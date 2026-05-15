import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false, 
  icon: Icon,
  as: Component = 'button',
  ...props 
}) => {
  const variants = {
    primary: 'bg-[#011F7B] text-white border-transparent hover:bg-[#011F7B]/90 shadow-md shadow-[#011F7B]/20',
    outline: 'bg-[#011F7B]/5 border-2 border-slate-200 text-slate-600 hover:border-[#011F7B]/30 hover:text-[#011F7B] hover:bg-[#011F7B]/5',
    ghost: 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100',
    danger: 'bg-red-500 text-white border-transparent hover:bg-red-600 shadow-md shadow-red-100',
  };

  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer border active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3';

  return (
    <Component 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memproses...
        </span>
      ) : (
        <>
          {children}
          {Icon && <Icon size={18} />}
        </>
      )}
    </Component>
  );
};

export default Button;
