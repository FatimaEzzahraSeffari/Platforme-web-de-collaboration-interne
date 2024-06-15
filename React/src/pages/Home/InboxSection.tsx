import React from 'react';
import '../../App.css';

const Inbox: React.FC = () => {
    return (
        <section className="live-demo-section1">
            <div className="left-content">
                <div className="image-container">
                    <img src="../images/img15.png" alt="Person on call" className="base-image" />
                </div>
            </div>
            <div className="right-content">
                <h2>Stay connected with your <br />team around the clock.</h2>
                <p>Experience exceptional software enabling <br />uninterrupted chatting from anywhere, at any time.<br /></p>
            </div>
        </section>
    );
};

export default Inbox;
