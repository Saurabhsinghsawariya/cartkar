// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Requires authentication)
router.post(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            const order = new Order({
                user: req.user._id, // req.user comes from the protect middleware
                orderItems: orderItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item.product,
                })),
                shippingAddress,
                paymentMethod,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    })
);

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get(
    '/myorders', // Make sure this route comes BEFORE '/:id' if you're keeping the order from previous steps
    protect,
    asyncHandler(async (req, res) => {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    })
);

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get(
    '/:id',
    protect,
    asyncHandler(async (req, res) => {
        // Populate the user field with username and email, and the product field in order items with just name
        const order = await Order.findById(req.params.id)
            .populate('user', 'username email')
            .populate('orderItems.product', 'name'); // Populate product name within order items

        if (order) {
            // Ensure the logged-in user owns this order
            if (order.user._id.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error('Not authorized to view this order');
            }
            res.json(order);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    })
);


module.exports = router;