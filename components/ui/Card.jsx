import { cn } from '@/lib/utils';

export default function Card({ children, className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-white border border-[#e7e7e7] shadow-sm',
    muted: 'bg-[#f6f6f6] border border-[#e7e7e7]',
    elevated: 'bg-white border border-[#e7e7e7] shadow-md',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

