import Link from 'next/link';
import { cn } from '@/lib/utils';

const buttonVariants = {
  primary: 'bg-[#5bad6a] text-white hover:bg-[#3d8f4d] focus:ring-2 focus:ring-[#5bad6a] focus:ring-offset-2 transition-colors',
  secondary: 'bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90 focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 transition-colors',
  ghost: 'bg-transparent text-[#1a1a1a] border border-[#e7e7e7] hover:bg-[#f6f6f6] focus:ring-2 focus:ring-[#5bad6a] focus:ring-offset-2 transition-colors',
  outline: 'bg-white text-[#5bad6a] border-2 border-[#5bad6a] hover:bg-[#5bad6a] hover:text-white focus:ring-2 focus:ring-[#5bad6a] focus:ring-offset-2 transition-colors',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-colors',
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';
  const classes = cn(
    baseClasses,
    buttonVariants[variant],
    buttonSizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

