import React from 'react';
import { motion } from 'framer-motion';
import { FaSeedling } from 'react-icons/fa';
import { gradients } from '../theme/gradientPalette';

const EnhancedButton = ({ children, onClick, style, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.08, boxShadow: '0 4px 24px #a8e06355' }}
    whileTap={{ scale: 0.96 }}
    style={{
      background: gradients.button,
      color: '#388e3c',
      border: 'none',
      padding: '0.9rem 2.1rem',
      borderRadius: '12px',
      fontWeight: 800,
      fontSize: '1.13rem',
      letterSpacing: '1px',
      boxShadow: '0 2px 10px #fbc02d33',
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      cursor: 'pointer',
      ...style,
    }}
    {...props}
    onClick={onClick}
  >
    <FaSeedling style={{ fontSize: '1.3rem' }} />
    {children}
  </motion.button>
);

export default EnhancedButton;
