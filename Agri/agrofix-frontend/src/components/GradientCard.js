import React from 'react';
import { gradients } from '../theme/gradientPalette';

const GradientCard = ({ children, style, ...props }) => (
  <div
    style={{
      background: gradients.card,
      borderRadius: '18px',
      boxShadow: '0 4px 18px #a8e06333',
      padding: '2rem',
      margin: '1.5rem 0',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export default GradientCard;
