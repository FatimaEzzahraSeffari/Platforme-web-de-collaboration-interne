import React from 'react';
import '../../App.css';

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const Feature: React.FC<FeatureProps> = ({ title, description, image }) => (
  <div id="features">
    <div className="feature-card ">
      <div className="card-name" style={{ display: 'inline-block', fontWeight: 'bold', color: 'black' }}>
        <img src={image} alt={title} className="profile-picture" style={{ display: 'inline-block', verticalAlign: 'top' }} />
        <span style={{ display: 'inline-block', marginTop: '6px' }}>{title}</span>
      </div>
      <p className="feature-description">{description}</p>
    </div>
  </div>
);

const Features: React.FC = () => {
  const featuresData: FeatureProps[] = [
    {
      title: 'Video Messaging',
      description: 'This software is very easy for you to manage you can use it as you wish.',
      image: '../images/img9.png'
    },
    {
      title: 'Keep Safe & Private',
      description: 'Your chats are encrypted and secure with us.',
      image: '../images/img7.png'
    },
    {
      title: 'Save you time',
      description: 'Simplify task management, save valuable time.',
      image: '../images/img8.png'
    },
  ];

  return (
    <section className="features-section">
      <p className="feature-title" style={{ fontWeight: 'bold', textAlign: 'center' }}>Features for a better experience</p>
      <div className="features-container">
        {featuresData.map((feature, index) => (
          <Feature
            key={index}
            title={feature.title}
            description={feature.description}
            image={feature.image}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
