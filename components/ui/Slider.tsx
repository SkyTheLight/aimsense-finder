'use client';

import { useId } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  label,
  showValue = true,
}: SliderProps) {
  const id = useId();
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <label htmlFor={id} className="text-sm text-[#94a3b8]">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-mono text-[#00ff88] font-semibold">
              {value}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-[#1a1a24] rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #00ff88 0%, #00ff88 ${percentage}%, #1a1a24 ${percentage}%, #1a1a24 100%)`,
          }}
        />
        <style jsx>{`
          .slider-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #ffffff;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
            transition: box-shadow 0.2s;
          }
          .slider-thumb::-webkit-slider-thumb:hover {
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
          }
          .slider-thumb::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #ffffff;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
          }
        `}</style>
      </div>
    </div>
  );
}