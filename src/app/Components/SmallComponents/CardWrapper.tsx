import { ReactNode, HTMLAttributes } from "react";

interface CardWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  selected?: boolean;
  variant?:
    | "default"
    | "glass"
    | "outlined"
    | "elevated"
    | "glass-80"
    | "dark"
    | "dark-glass"
    | "panel-dark"
    | "panel-light";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function CardWrapper({
  children,
  padding = "md",
  hover = false,
  selected = false,
  variant = "default",
  rounded = "2xl",
  className = "",
  ...props
}: CardWrapperProps) {
  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const variantClasses = {
    default: "bg-white border-2 border-n3 shadow-lg",
    glass: "bg-white/90 border-2 border-white/20 backdrop-blur-sm shadow-lg",
    outlined: "bg-transparent border-2 border-n3",
    elevated: "bg-white shadow-xl border border-gray-100",
    "glass-80": "bg-white/90 border border-white/60 backdrop-blur-md shadow-xl",
    dark: "bg-stone-800/50 border border-white/10 shadow-lg",
    "dark-glass":
      "bg-black/50 border border-white/10 backdrop-blur-sm shadow-lg",
    "panel-dark": "bg-black/50 border-white/10",
    "panel-light": "bg-white/20 border-gray-200",
  };

  const roundedClasses = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    "2xl": "rounded-2xl",
  };

  // Panel variants don't use rounded classes
  const isPanel = variant === "panel-dark" || variant === "panel-light";

  const baseClasses = "CardWrapper";
  const hoverClasses = hover
    ? "hover:shadow-xl hover:border-po1 cursor-pointer transition-all duration-300"
    : "";
  const selectedClasses = selected
    ? "border-po1 ring-2 ring-po1 ring-opacity-20"
    : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${!isPanel ? roundedClasses[rounded] : ""} ${hoverClasses} ${selectedClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
