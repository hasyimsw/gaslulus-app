import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  as: Component = 'div',
  ...props
}) => {
  // Check if specific styles are already provided in className to avoid conflicts
  const hasBg = className.includes('bg-');
  const hasRounded = className.includes('rounded-');
  const hasBorder = className.includes('border-');
  const hasShadow = className.includes('shadow-') && !className.includes('shadow-none');

  return (
    <Component 
      className={`
        transition-all duration-300 
        ${!hasBg ? 'bg-white' : ''} 
        ${!hasBorder ? 'border border-slate-100' : ''} 
        ${!hasRounded ? 'rounded-3xl' : ''} 
        ${!hasShadow ? 'shadow-sm' : ''} 
        ${hoverable ? 'hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1' : ''} 
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;

