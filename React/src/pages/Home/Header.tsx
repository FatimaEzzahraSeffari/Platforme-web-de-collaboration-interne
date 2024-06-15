import React from 'react';
import '../../App.css';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="navbar-brand">
          <a href="/">
            <img src="../../images/ocp.PNG" alt="Logo de notre application" style={{ height: '60px', width: 'auto' }} />
          </a>
        </div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="#features">Features</a>
          </li>
          <li className="nav-item">
            <a href="#live-demo">Live Demo</a>
          </li>
          <li className="nav-item">
            <a href="#about">About</a>
          </li>
          <li className="nav-item">
            <a href="#testimonials">Testimonials</a>
          </li>
          <li className="nav-item">
            <a href="/contact">Contact</a>
          </li>
        </ul>
        <div className="navbar-login">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/auth-login-boxed">Login</a>
            </li>
          </ul>
          <Button className="get-started-btn" variant="primary">Get Started Free</Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
