import React from 'react';
import '../../App.css';
import Button from 'react-bootstrap/Button';
import Card from './card';
import CustomerRating from './CustomerRating';

const HeroSection: React.FC = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="left-content texte-a-gauche">
          <h1>Collaborate instantly within OCP<br />
            connect with your team anytime,<br />
            anywhere through our app</h1>
          <p>Exceptional program that enables seamless<br /> communication from any location at any given<br /> moment, free from any disruptions.</p>
         
          <br /> <Button className="get-started-btn" variant="primary">Start chatting now</Button>
          <br />  <br />
          <CustomerRating />
        </div>
        <div className="right-content">
          <div style={{
            width: '370px',
            height: '370px',
            backgroundColor: 'yellow',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '180px',
            right: '100px',
            zIndex: '2',
          }}>

            <div style={{
              width: '390px',
              height: '390px',
              borderRadius: '50%',
              border: '2px solid black',
              position: 'absolute',
              top: '-10px',
              right: '50px',
              boxSizing: 'border-box',
              zIndex: '1',
            }} />
          </div>
          <img src="../images/img2.PNG" alt="Circle Image" style={{ width: '350px', height: '450px', position: 'absolute', top: '98px', right: '180px', zIndex: '3' }} />
          <Card style={{ top: '335px', left: '1050px', width: '250px', height: '120px' }} name="Fatima ezzahra Seffari" image="../images/img3.PNG" text="Remarkable software solution enabling continuous chatting from anywhere, at any time." />
          <Card style={{ top: '370px', left: '625px', width: '250px', height: '120px' }} name="Seffari " image="../images/img4.PNG" text="Great software that allows you to chat from any place at any time without any interruption." />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
