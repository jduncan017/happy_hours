import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "bordered" | "elevated";
  padding?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses = {
  default: "bg-white rounded-lg",
  bordered: "bg-white border border-n3 rounded-lg",
  elevated: "bg-white border border-n3 rounded-lg shadow-themeShadow"
};

const paddingClasses = {
  sm: "p-3",
  md: "p-4 sm:p-6", 
  lg: "p-6 sm:p-8"
};

/**
 * Reusable card component with consistent styling
 * Default variant is 'bordered' with medium padding
 */
const Card: React.FC<CardProps> = ({ 
  children,
  variant = "bordered", 
  padding = "md",
  className = ""
}) => {
  const variantClass = variantClasses[variant];
  const paddingClass = paddingClasses[padding];
  
  return (
    <div className={`Card ${variantClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;