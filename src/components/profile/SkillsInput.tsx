import { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SkillsInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: readonly string[];
  maxItems?: number;
  placeholder?: string;
}

export function SkillsInput({
  label,
  value,
  onChange,
  suggestions,
  maxItems = 10,
  placeholder = 'Add skill...',
}: SkillsInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addItem = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !value.includes(trimmed) && value.length < maxItems) {
      onChange([...value, trimmed]);
      setInputValue('');
      setOpen(false);
    }
  };

  const removeItem = (item: string) => {
    onChange(value.filter(v => v !== item));
  };

  const filteredSuggestions = suggestions.filter(
    s => !value.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      
      {/* Current Tags */}
      <div className="flex flex-wrap gap-2">
        {value.map((item) => (
          <Badge key={item} variant="secondary" className="gap-1 pr-1">
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
              className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        
        {value.length < maxItems && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 gap-1 text-xs"
              >
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandInput
                  ref={inputRef}
                  placeholder={placeholder}
                  value={inputValue}
                  onValueChange={setInputValue}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                      e.preventDefault();
                      addItem(inputValue);
                    }
                  }}
                />
                <CommandList>
                  <CommandEmpty>
                    {inputValue.trim() ? (
                      <button
                        type="button"
                        className="w-full p-2 text-sm text-left hover:bg-accent"
                        onClick={() => addItem(inputValue)}
                      >
                        Add "{inputValue}"
                      </button>
                    ) : (
                      <span className="text-muted-foreground">Type to search...</span>
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredSuggestions.slice(0, 10).map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        value={suggestion}
                        onSelect={() => addItem(suggestion)}
                      >
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        {value.length}/{maxItems} selected
      </p>
    </div>
  );
}
