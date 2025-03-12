
import React, { useState, useEffect, useRef } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const toggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const removeItem = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== value));
  };

  // Get labels for selected options
  const selectedLabels = options
    .filter(option => selected.includes(option.value))
    .map(option => option.label);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div
        className={`flex flex-wrap min-h-10 p-2 border rounded-md ${isOpen ? 'border-primary' : 'border-input'} ${disabled ? 'bg-muted cursor-not-allowed' : 'bg-background cursor-pointer'}`}
        onClick={toggle}
      >
        {selectedLabels.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedLabels.map((label, index) => (
              <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-sm">
                {label}
                {!disabled && (
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={(e) => removeItem(selected[index], e)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">Chọn các tùy chọn</div>
        )}
        <div className="ml-auto self-center">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-background border border-input rounded-md shadow-md">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center px-3 py-2 hover:bg-secondary cursor-pointer ${selected.includes(option.value) ? 'bg-secondary/50' : ''}`}
              onClick={() => handleOptionClick(option.value)}
            >
              <div className="w-4 h-4 mr-2 flex-shrink-0">
                {selected.includes(option.value) && <Check className="h-4 w-4" />}
              </div>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
