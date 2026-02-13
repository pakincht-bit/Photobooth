import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  label: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', label, className = '', ...props }) => {
  const baseStyle = "px-8 py-3 rounded-none border-2 font-serif text-lg tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100";
  
  const variants = {
    primary: "bg-cupid-100 border-cupid-300 text-cupid-500 hover:bg-cupid-200 shadow-[4px_4px_0px_0px_rgba(255,77,109,0.5)]",
    secondary: "bg-white border-cupid-200 text-cupid-400 hover:bg-gray-50",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {variant === 'primary' && <span className="w-2 h-2 rounded-full bg-cupid-300 animate-pulse" />}
        {label}
      </div>
    </button>
  );
};

export default Button;