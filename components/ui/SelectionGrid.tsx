'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface SelectionOption<T> {
  value: T;
  label: string;
  icon?: string;
  iconColor?: string;
  fallback?: string;
  description?: string;
}

interface SelectionGridProps<T> {
  options: SelectionOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: 2 | 3;
}

export function SelectionGrid<T>({
  options,
  value,
  onChange,
  columns = 2,
}: SelectionGridProps<T>) {
  const gridCols = columns === 3 ? 'grid-cols-3' : 'grid-cols-2';
  const [iconErrors, setIconErrors] = useState<Record<string, boolean>>({});

  const renderIcon = (option: SelectionOption<T>) => {
    const { icon, iconColor, fallback } = option;
    if (!icon) return null;
    
    if (icon.startsWith('data:')) {
      return <img src={icon} alt="" className="w-8 h-8 object-contain" />;
    }
    
    if (icon.includes(':') && !iconErrors[String(option.value)]) {
      return (
        <Icon 
          icon={icon} 
          className="w-8 h-8" 
          style={{ color: iconColor }}
          onError={() => setIconErrors(prev => ({ ...prev, [String(option.value)]: true }))}
        />
      );
    }
    
    return <span className="text-2xl">{fallback || icon}</span>;
  };

  return (
    <div className={`grid ${gridCols} gap-3`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200 text-left
              ${isSelected
                ? 'border-[#00ff88] bg-[#00ff88]/5 shadow-[0_0_20px_rgba(0,255,136,0.1)]'
                : 'border-[#2a2a3a] bg-[#1a1a24] hover:border-[#4a4a5a]'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              {renderIcon(option)}
              <span className={`font-medium text-sm ${isSelected ? 'text-[#00ff88]' : 'text-white'}`}>
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-[#64748b] text-center">
                  {option.description}
                </span>
              )}
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00ff88]" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}