import React from "react";

interface MaxWidthContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  width?: "sm" | "md" | "lg" | "xl";
}

const widthClasses = {
  sm: "max-w-[600px]",
  md: "max-w-[800px]", 
  lg: "max-w-[1000px]",
  xl: "max-w-[1200px]"
};

/**
 * Container component with consistent max-width constraints
 * Default width is 'lg' (1000px) which is the most common pattern in the app
 */
const MaxWidthContainer: React.FC<MaxWidthContainerProps> = ({ 
  children, 
  className = "",
  width = "lg",
  ...props
}) => {
  return (
    <div className={`MaxWidthContainer w-full ${widthClasses[width]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default MaxWidthContainer;