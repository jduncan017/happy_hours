import React from "react";

interface FlexContainerProps {
  children: React.ReactNode;
  direction?: "row" | "col";
  gap?: "1" | "2" | "3" | "4" | "5" | "6";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  className?: string;
}

const gapClasses = {
  "1": "gap-1",
  "2": "gap-2", 
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6"
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch"
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center", 
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
};

/**
 * Flexible container component for common flex layouts
 * Defaults to flex-col with gap-2 which is a common pattern in the app
 */
const FlexContainer: React.FC<FlexContainerProps> = ({ 
  children,
  direction = "col",
  gap = "2",
  align,
  justify,
  className = ""
}) => {
  const directionClass = direction === "row" ? "flex-row" : "flex-col";
  const gapClass = gapClasses[gap];
  const alignClass = align ? alignClasses[align] : "";
  const justifyClass = justify ? justifyClasses[justify] : "";
  
  return (
    <div className={`FlexContainer flex ${directionClass} ${gapClass} ${alignClass} ${justifyClass} ${className}`}>
      {children}
    </div>
  );
};

export default FlexContainer;