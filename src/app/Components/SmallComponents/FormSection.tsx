import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import CardWrapper from './CardWrapper';

interface FormSectionProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
}

export default function FormSection({ 
  title, 
  icon: Icon, 
  children, 
  theme = 'dark',
  className = '' 
}: FormSectionProps) {
  const variant = theme === 'dark' ? 'dark' : 'default';
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <CardWrapper variant={variant} className={className}>
      <h3 className={`text-lg font-semibold ${titleColor} mb-4 flex items-center`}>
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        {title}
      </h3>
      
      <div className="space-y-4">
        {children}
      </div>
    </CardWrapper>
  );
}