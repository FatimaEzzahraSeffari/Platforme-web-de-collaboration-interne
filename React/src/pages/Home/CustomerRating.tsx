import React from 'react';
import '../../App.css';

const CustomerRating: React.FC = () => {
  return (
    <div className="customer-rating-container">
      <div className="customer-rating">
        <div className="customer-rating-avatar">
          <img src="../images/img3.PNG" alt="avatar" />
          <img src="../images/img4.PNG" alt="avatar" />
        </div>
        <div className="customer-rating-info">
          <span className="customer-count">2,291</span>
          <span className="happy-customers">Happy customers</span>
        </div>
      </div>
      <div className="rating">
        <span className="rating-value">4.8/5</span>
        <span className="rating-label">Rating</span>
      </div>
    </div>
  );
};

export default CustomerRating;
