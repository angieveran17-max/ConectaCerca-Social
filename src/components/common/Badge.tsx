import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'emerald' | 'purple' | 'amber' | 'sky' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  selected = false
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200';
  
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3.5 py-1.5 text-xs sm:text-sm'
  };

  const variantClasses = {
    primary: selected 
      ? 'bg-indigo-600 text-white shadow-xs' 
      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60',
    secondary: selected 
      ? 'bg-slate-800 text-white' 
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
    emerald: selected 
      ? 'bg-emerald-600 text-white' 
      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/70',
    purple: selected 
      ? 'bg-purple-600 text-white' 
      : 'bg-purple-50 text-purple-700 border border-purple-200/60',
    amber: selected 
      ? 'bg-amber-600 text-white' 
      : 'bg-amber-50 text-amber-800 border border-amber-200/60',
    sky: selected 
      ? 'bg-sky-600 text-white' 
      : 'bg-sky-50 text-sky-700 border border-sky-200/60',
    outline: selected
      ? 'bg-indigo-600 text-white border-indigo-600'
      : 'bg-white text-slate-700 border border-slate-300 hover:border-indigo-400'
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} cursor-pointer active:scale-95`}
      >
        {icon}
        <span>{children}</span>
      </button>
    );
  }

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {icon}
      <span>{children}</span>
    </span>
  );
};
