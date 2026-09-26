import React from 'react';

const VARIANTS = {
  // 1. Primary: Brand action (Book, Submit, Add)
  primary: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm hover:shadow-cyan-100 focus-visible:ring-cyan-500 border border-transparent',
  
  // 2. Secondary / Subtle: Auxiliary actions (Filters, Inquire Now header, View)
  secondary: 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 focus-visible:ring-slate-400 border border-transparent',
  
  // 3. Outline: Clear actions, Back buttons, Category pills
  outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 focus-visible:ring-cyan-500 shadow-sm',
  
  // 4. WhatsApp / Success: Direct messaging CTA
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-emerald-100 focus-visible:ring-emerald-500 border border-transparent',
  
  // 5. Danger: Deletion & destructive actions
  danger: 'bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/70 focus-visible:ring-rose-500'
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-5 py-3 text-base font-semibold rounded-2xl gap-2.5'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
