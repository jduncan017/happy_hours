"use client";
type ButtonProps = {
  text: string;
  rounded: boolean;
  colorFill: true | false | "variable";
  addClasses?: string;
  size?: "sm" | "md" | "lg";
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
};

const SiteButton = ({
  text,
  rounded,
  colorFill,
  addClasses,
  size,
  onSubmit,
  disabled,
  type,
}: ButtonProps) => {
  let buttonSize: string;
  let buttonColor: string;

  switch (size) {
    case "sm":
      buttonSize = "sm:px-6 sm:py-3 px-4 py-3";
      break;
    case "md":
      buttonSize = "w-40 sm:py-3 py-3";
      break;
    case "lg":
      buttonSize = "w-full h-[52px]";
      break;
    default:
      buttonSize = "w-20 h-10";
  }

  switch (colorFill) {
    case true:
      buttonColor = "bg-primary text-white";
      break;
    case false:
      buttonColor = "border border-gray-800 text-gray-800";
      break;
    case "variable":
      buttonColor =
        "bg-neutralLight border-none text-gray-800 md:border md:border-solid md:border-white md:bg-transparent md:text-white";
      break;
  }

  return (
    <button
      className={`SiteButton duration-400 font-sans text-sm shadow-sm transition-all hover:scale-105 hover:bg-gray-600 hover:text-primaryLight disabled:bg-gray-500 disabled:hover:cursor-not-allowed disabled:hover:text-white sm:text-base ${buttonSize} ${addClasses} ${rounded ? "rounded-full" : "rounded-sm"} ${buttonColor}`}
      type={type ?? "button"}
      onClick={onSubmit}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default SiteButton;
