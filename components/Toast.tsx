'use client';

import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

export default function Toast({ message, type, onDismiss }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      onClick={onDismiss}
      style={{
        position: 'fixed',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: type === 'success'
          ? 'linear-gradient(135deg, #16a34a, #15803d)'
          : 'linear-gradient(135deg, #dc2626, #b91c1c)',
        color: 'white',
        padding: '12px 22px',
        borderRadius: 14,
        fontWeight: 600,
        fontSize: 14,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '-0.01em',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        userSelect: 'none',
      }}
    >
      {message}
    </motion.div>
  );
}
