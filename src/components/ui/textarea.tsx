import * as React from 'react';

import { cn } from '@/lib/utils';

interface IProps {
  isError?: boolean;
  showMaxLengthCounter?: boolean;
}

function getTextLength(value: React.ComponentProps<'textarea'>['value']): number {
  if (value === undefined || value === null) {
    return 0;
  }

  if (Array.isArray(value)) {
    return value.join('').length;
  }

  return String(value).length;
}

function Textarea({
  className,
  isError,
  showMaxLengthCounter = false,
  value,
  defaultValue,
  maxLength,
  onChange,
  ...props
}: React.ComponentProps<'textarea'> & IProps) {
  const [currentLength, setCurrentLength] = React.useState<number>(() => {
    if (value !== undefined) {
      return getTextLength(value);
    }

    return getTextLength(defaultValue as React.ComponentProps<'textarea'>['value']);
  });

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentLength(getTextLength(value));
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentLength(event.target.value.length);
    onChange?.(event);
  };

  const shouldShowCounter = showMaxLengthCounter && typeof maxLength === 'number';

  return (
    <div className="space-y-1">
      <textarea
        data-slot="textarea"
        className={cn(
          'border-input dark:bg-input/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:border-primary-light focus-visible:ring-ring/50 focus-visible:ring-1',
          isError && 'border-destructive border',
          className
        )}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />

      {shouldShowCounter && (
        <div className="text-muted-foreground text-right text-xs" aria-live="polite">
          {currentLength}/{maxLength}
        </div>
      )}
    </div>
  );
}

export { Textarea };
