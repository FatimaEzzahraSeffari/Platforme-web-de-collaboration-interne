import React from 'react';
import '../../App.css';
import Button from 'react-bootstrap/Button';

const StartCollab: React.FC = () => {
    return (
        <div id="about">
            <section className="start-collab-section">
                <div className="start-collab-image-container">
                    <img src="../images/img14.png" alt="Person on call" className="start-collab-image" />
                </div>
                <div className="start-collab-content start-collab-right-content">
                    <h2>About Us</h2>
                    <h1>Start collaborating directly inside conversations.</h1>
                    <p>Welcome to OCPLINK Platforme , where innovation meets seamless <br />collaboration. 
                    Our mission is to empower teams worldwide with cutting-edge <br />
                    communication solutions. Backed by a team of experts, we're <br />
                    committed to delivering excellence and exceeding expectations.<br />
                    Join us and experience communication without limits.
                    </p>
                    <Button className="get-started-btn" variant="primary">Get Started Free</Button>
                </div>
            </section>
        </div>
    );
};

export default StartCollab;
