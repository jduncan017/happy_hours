type ButtonProps = {
  text: string;
  rounded: boolean;
  variant: "orange" | "yellow" | "red" | "white" | "gradient";
  addClasses?: string;
  size?: "xs" | "sm" | "md" | "lg";
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
};

const SiteButton = ({
  text,
  rounded,
  variant,
  addClasses,
  size,
  onSubmit,
  disabled = false,
  type,
}: ButtonProps) => {
  let buttonSize: string;
  let buttonColor: string;

  switch (size) {
    case "xs":
      buttonSize = "px-2 py-1 text-xs";
      break;
    case "sm":
      buttonSize = "sm:px-4 sm:py-2 px-3 py-1";
      break;
    case "md":
      buttonSize = "w-40 sm:py-3 py-3";
      break;
    case "lg":
      buttonSize = "w-full h-[48px]";
      break;
    default:
      buttonSize = "w-20 h-10";
  }

  switch (variant) {
    case "orange":
      buttonColor = "bg-po1 text-white";
      break;
    case "yellow":
      buttonColor = "bg-py1 text-white";
      break;
    case "red":
      buttonColor = "bg-pr1 text-white";
      break;
    case "white":
      buttonColor = "bg-white border border-gray-300 text-black";
      break;
    case "gradient":
      buttonColor =
        "bg-gradient-to-tr from-pr1 via-po1 to-py1 text-white font-medium text-shadow-xs";
      break;
  }

  return (
    <button
      className={`SiteButton text-nowrap cursor-pointer text-sm transition-all duration-200 hover:scale-102 hover:border-none hover:bg-stone-200 hover:text-black disabled:bg-gray-500 disabled:hover:cursor-not-allowed disabled:hover:text-white sm:text-base ${buttonSize} ${addClasses} ${
        rounded ? "rounded-full" : "rounded-sm"
      } ${buttonColor}`}
      type={type ?? "button"}
      onClick={onSubmit}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default SiteButton;
