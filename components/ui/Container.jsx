import { cn } from '@/lib/utils';

export default function Container({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

