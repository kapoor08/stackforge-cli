import { cn } from '../../lib/utils';

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-black px-3 py-2 text-sm text-white',
        className
      )}
      {...props}
    />
  );
}
