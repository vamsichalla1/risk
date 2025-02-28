// src/components/Success.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Success() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Customer Created Successfully!</h1>
      <p>The customer data has been stored successfully.</p>
      <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>Go Back to Form</Link>
    </div>
  );
}

export default Success;