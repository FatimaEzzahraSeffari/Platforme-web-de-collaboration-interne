import React from 'react';
import { Button } from 'react-bootstrap';
import '../../App.css';
import { BsGoogle, BsTwitter, BsFacebook, BsInstagram } from 'react-icons/bs';

const Footer: React.FC = () => {
  return (
    <div className="left-content">
      <h1>Ready to grow your business?<br /> Start with OCP LINK and become faster<br /> every second</h1>
      <Button className="get-started-btn" variant="primary">Start chatting now</Button>
      <br /><br />
      <footer className="site-footer">
        <div className="footer-content">
          <div className="app-info">
            <img src="../images/ocp.PNG" alt="Chat Application Logo" className="footer-logo" />
          </div>
          <nav className="footer-nav">
            <ul>
              <li key="features"><a href="#features">Features</a></li>
              <li key="livedemo"><a href="#live-demo">LiveDemo</a></li>
              <li key="about"><a href="#about">About</a></li>
              <li key="testimonials"><a href="#testimonials">Testimonials</a></li>
              <li key="contact"><a href="/contact">Contact</a></li>
            </ul>
          </nav>
          <div className="social-links">
            <a href="votre_lien_google" className="social-icon"><BsGoogle /></a>
            <a href="votre_lien_twitter" className="social-icon"><BsTwitter /></a>
            <a href="votre_lien_facebook" className="social-icon"><BsFacebook /></a>
            <a href="votre_lien_instagram" className="social-icon"><BsInstagram /></a>
          </div>
        </div>
        <hr />
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} OCPLINK Platforme All rights reserved.
          <span className="footer-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms and Conditions</a>
          </span>
        </p>
      </footer>
    </div>
  );
};

export default Footer;
