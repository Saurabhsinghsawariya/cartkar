// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const products = await Product.find({});
        res.json(products);
    })
);

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    })
);

module.exports = router;