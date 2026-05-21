import Link from "next/link";
import clsx from "clsx";

interface ButtonInterface {
  titleButton: string;
  link?: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export const Button: React.FC<ButtonInterface> = ({
  titleButton,
  link,
  target,
  rel,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}) => {
  const baseClasses = clsx(
    "inline-flex items-center justify-center text-center",
    "w-full sm:w-auto px-6 py-4 rounded-full",
    "text-xl font-subtitle",
    "whitespace-normal break-words",
    "bg-dark-green",
    "border-2 border-transparent",
    "transition duration-300 ease-in-out",
    "hover:bg-green hover:text-black",
    "focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    !className.includes("text-") && "text-white",
    className,
  );

  if (link) {
    return (
      <Link href={link} target={target} rel={rel} className={baseClasses}>
        {titleButton}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {titleButton}
    </button>
  );
};
