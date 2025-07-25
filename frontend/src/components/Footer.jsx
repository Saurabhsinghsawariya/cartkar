// frontend/src/components/Footer.jsx

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} E-Shop MVP. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;