import React from 'react';
import '../../App.css';

const LiveDemo: React.FC = () => {
  return (
    <div id="live-demo">
      <section className="live-demo-section">
        <div className="left-content">
          <div className="image-container">
            <img src="../images/img10.png" alt="Person on call" className="base-image" />
            <img src="../images/img11.png" alt="Call UI" className="overlay-image" />
          </div>
        </div>
        <div className="right-content">
          <h2>Meet your colleagues,<br />with live video conferences</h2>
          <p>Powerful software that lets you chat from anywhere at any <br />time without interruption.
            <br />
            <br />An exceptional software that gives you the ability <br />to chat from anywhere at any time without interruption.<br />
            An innovative solution that allows you to communicate directly <br />with your customers, wherever you are and at any time, <br />without any interruption.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LiveDemo;
