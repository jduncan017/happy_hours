import { ButtonHTMLAttributes, ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  theme?: "light" | "dark";
}

export default function ActionButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  theme = "dark",
  className = "",
  disabled,
  ...props
}: ActionButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-5 text-lg",
  };

  const variantClasses = {
    primary:
      theme === "dark"
        ? "bg-gradient-to-r from-po1 to-py1 border border-white/10 text-white hover:shadow-xl hover:from-white hover:to-gray-200 hover:text-black focus:ring-po1/50"
        : "bg-gradient-to-r from-po1 to-py1 border border-white/10 text-white hover:shadow-xl hover:from-white hover:to-gray-200 hover:text-black focus:ring-po1/50",
    secondary:
      theme === "dark"
        ? "bg-stone-700 hover:bg-stone-600 text-white border border-white/10 focus:ring-white/50"
        : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 focus:ring-gray-400",
    outline:
      theme === "dark"
        ? "border-2 border-white/20 text-white hover:bg-white/10 focus:ring-white/50"
        : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
  };

  const baseClasses =
    "font-semibold cursor-pointer rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const fullWidthClass = fullWidth ? "w-full" : "";
  const disabledClass =
    disabled || loading
      ? "opacity-60 cursor-not-allowed transform-none hover:scale-100"
      : "";
  const ringOffset =
    theme === "dark"
      ? "focus:ring-offset-stone-900"
      : "focus:ring-offset-white";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidthClass} ${disabledClass} ${ringOffset} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <LoadingSpinner size="sm" className="mr-2" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
