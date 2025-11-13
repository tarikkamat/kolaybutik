import * as React from 'react';
import { cn } from '@/lib/utils';

const InputGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn('relative flex items-center w-full', className)}
            {...props}
        />
    );
});
InputGroup.displayName = 'InputGroup';

const InputGroupInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<'input'> & { hasAddon?: boolean }
>(({ className, hasAddon, ...props }, ref) => {
    return (
        <input
            ref={ref}
            data-slot="input"
            className={cn(
                'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                hasAddon ? 'rounded-l-none rounded-r-md border-l-0' : 'rounded-md',
                className
            )}
            {...props}
        />
    );
});
InputGroupInput.displayName = 'InputGroupInput';

interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: 'inline-start' | 'inline-end';
}

const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
    ({ className, align = 'inline-start', children, ...props }, ref) => {
        const isStart = align === 'inline-start';
        const isEnd = align === 'inline-end';

        return (
            <div
                ref={ref}
                className={cn(
                    'flex h-9 shrink-0 items-center justify-center border border-input bg-muted px-3 text-muted-foreground',
                    isStart && 'rounded-l-md rounded-r-none border-r-0',
                    isEnd && 'rounded-r-md rounded-l-none border-l-0',
                    className
                )}
                {...props}
            >
                <div className="flex items-center gap-1">{children}</div>
            </div>
        );
    }
);
InputGroupAddon.displayName = 'InputGroupAddon';

export { InputGroup, InputGroupInput, InputGroupAddon };

