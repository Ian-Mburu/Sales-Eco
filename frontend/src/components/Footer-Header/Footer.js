import React from 'react';
import '../../styles/footer-header/footer.css'; 
import { FaPaypal } from "react-icons/fa";
import { SiMastercard } from "react-icons/si";
import { RiVisaLine } from "react-icons/ri";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Help Section */}
        <div className="footer-section">
          <h3>NEED HELP?</h3>
          <ul>
            <li><a href="#">Chat with us</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="footer-section">
          <h3>USEFUL LINKS</h3>
          <ul>
            <li><a href="#">Track Your Order</a></li>
            <li><a href="#">Shipping and Delivery</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">How to Order?</a></li>
            <li><a href="#">Advertise with Eco-Sales</a></li>
            <li><a href="#">Report a Product</a></li>
            <li><a href="#">Black Friday</a></li>
          </ul>
        </div>

        {/* About Jumia */}
        <div className="footer-section">
          <h3>ABOUT JUMIA</h3>
          <ul>
            <li><a href="#">About us</a></li>
            <li><a href="#">Returns and Refunds Policy</a></li>
            <li><a href="#">Terms and Conditions</a></li>
            <li><a href="#">Store Credit Terms and Conditions</a></li>
            <li><a href="#">Privacy Notice</a></li>
            <li><a href="#">Cookies Notice</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>JOIN US ON</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>

          <h3>PAYMENT METHODS</h3>
          <div className="payment-icons">
            <RiVisaLine className='payment-icons-1'     />
            <SiMastercard className='payment-icons-1' />
            <FaPaypal className='payment-icons-1' />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
