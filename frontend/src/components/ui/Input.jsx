import React from 'react';

const Input = ({ 
  label, 
  icon: Icon, 
  error, 
  className = '', 
  containerClassName = '',
  isValid = null, // null = neutral, true = green, false = red
  ...props 
}) => {
  const getStatusClasses = () => {
    if (isValid === true) return "border-green-500 bg-green-50 focus:ring-green-200";
    if (isValid === false || error) return "border-red-500 bg-red-50 focus:ring-red-200";
    return "border-2 border-slate-200 bg-white focus:bg-white focus:border-[#011F7B] focus:ring-[#011F7B]/5";
  };

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {React.cloneElement(Icon, { size: 20 })}
          </div>
        )}
        <input
          className={`w-full px-4 py-3 rounded-xl text-slate-900 text-sm font-medium transition-all outline-none border placeholder:text-slate-400 ${Icon ? 'pl-11' : ''} ${getStatusClasses()} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-semibold mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
