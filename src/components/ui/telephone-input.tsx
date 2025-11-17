
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TelephoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TelephoneInput = React.forwardRef<HTMLInputElement, TelephoneInputProps>(
  ({ className, ...props }, ref) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 9) {
        event.target.value = numericValue;
        if (props.onChange) {
          props.onChange(event);
        }
      }
    };
    
    return (
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">
          +233
        </span>
        <Input
          type="tel"
          className={cn('pl-14', className)}
          maxLength={9}
          {...props}
          onChange={handleInputChange}
          ref={ref}
        />
      </div>
    );
  }
);
TelephoneInput.displayName = 'TelephoneInput';

export { TelephoneInput };
