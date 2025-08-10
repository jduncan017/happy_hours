import { InputHTMLAttributes, ReactNode } from "react";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  containerClassName?: string;
  variant?: "default" | "search" | "auth";
  size?: "sm" | "md" | "lg";
}

export default function TextInput({
  label,
  icon,
  error,
  containerClassName = "",
  className = "",
  variant = "default",
  size = "md",
  ...props
}: TextInputProps) {
  const sizeClasses = {
    sm: "py-2 text-sm",
    md: "py-3 text-base",
    lg: "py-4 text-lg",
  };

  const variantClasses = {
    default:
      "bg-white border-2 border-n3 focus:ring-2 focus:ring-po1 focus:border-po1",
    search:
      "bg-white border-2 border-n3 focus:ring-2 focus:ring-po1 focus:border-po1 placeholder-gray-400",
    auth: "bg-white/90 border-2 border-white/20 focus:ring-2 focus:ring-po1 focus:border-po1 backdrop-blur-sm",
  };

  return (
    <div className={`TextInputContainer ${containerClassName}`}>
      {label && (
        <label className="TextInputLabel block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="TextInputWrapper relative">
        {icon && (
          <div className="TextInputIcon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={`TextInput w-full ${icon ? "pl-10" : "pl-4"} pr-4 ${sizeClasses[size]} ${variantClasses[variant]} rounded-xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="TextInputError text-sm text-pr1 mt-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
