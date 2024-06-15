import React from 'react';

interface CardProps {
  style?: React.CSSProperties;
  name: string;
  image: string;
  text: string;
}

const Card: React.FC<CardProps> = ({ style, name, image, text }) => {
  return (
    <div className="card-container" style={{ ...style, display: 'flex', alignItems: 'center' }}>
      <div className="card-content" >
        <div className="card-name" style={{ display: 'inline-block', fontWeight: 'bold', color: 'black' }}>
          <img src={image} alt={name} className="profile-picture" style={{ display: 'inline-block', verticalAlign: 'top' }} />
          <span style={{ display: 'inline-block', marginTop: '6px' }}>{name}</span>
        </div>
        <div className="card-text">{text}</div>
      </div>
    </div>
  );
};

export default Card;
