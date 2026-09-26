import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'Career':
      case 'primary':
        return { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' };
      case 'Leadership':
      case 'amber':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      case 'Workplace':
      case 'emerald':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
      case 'Spontaneous':
      case 'rose':
        return { bg: 'rgba(244, 63, 94, 0.15)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.3)' };
      case 'Creative':
      case 'purple':
        return { bg: 'rgba(139, 92, 246, 0.15)', text: '#c084fc', border: 'rgba(139, 92, 246, 0.3)' };
      case 'Beginner':
        return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981', border: 'rgba(16, 185, 129, 0.4)' };
      case 'Intermediate':
        return { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)' };
      case 'Advanced':
        return { bg: 'rgba(244, 63, 94, 0.2)', text: '#f43f5e', border: 'rgba(244, 63, 94, 0.4)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#cbd5e1', border: 'rgba(148, 163, 184, 0.25)' };
    }
  };

  const style = getVariantStyles();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
        fontSize: '0.75rem',
        padding: '0.2rem 0.65rem',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}
    >
      {children}
    </span>
  );
};
