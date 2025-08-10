import { InputHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  helpText?: string;
  theme?: 'light' | 'dark';
  error?: string;
}

export default function FormField({ 
  label, 
  icon: Icon, 
  helpText, 
  theme = 'dark', 
  error,
  className = '',
  ...props 
}: FormFieldProps) {
  const labelColor = theme === 'dark' ? 'text-white/80' : 'text-gray-700';
  const inputColors = theme === 'dark' 
    ? 'bg-stone-800/80 border-white/10 text-white placeholder:text-white/40 focus:ring-po1' 
    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-po1';
  const iconColor = theme === 'dark' ? 'text-white/40' : 'text-gray-400';
  const helpTextColor = theme === 'dark' ? 'text-white/50' : 'text-gray-500';
  const errorColor = theme === 'dark' ? 'text-pr1' : 'text-red-600';

  return (
    <div>
      <label htmlFor={props.id} className={`block text-sm ${labelColor} mb-1`}>
        {label}
      </label>
      
      <div className="relative">
        <input
          className={`w-full rounded-xl border px-4 py-3 ${Icon ? 'pr-10' : ''} transition-colors focus:ring-2 focus:outline-none ${inputColors} ${error ? 'border-pr1' : ''} ${className}`}
          {...props}
        />
        {Icon && (
          <Icon className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 ${iconColor}`} />
        )}
      </div>
      
      {helpText && (
        <p className={`text-xs ${helpTextColor} mt-1`}>
          {helpText}
        </p>
      )}
      
      {error && (
        <p className={`text-xs ${errorColor} mt-1`}>
          {error}
        </p>
      )}
    </div>
  );
}