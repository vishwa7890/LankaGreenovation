import React from 'react';
import '../css/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="leaf-spinner">
        <div className="leaf1"></div>
        <div className="leaf2"></div>
        <div className="leaf3"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
