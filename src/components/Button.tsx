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
    "text-xl font-subtitle text-white bg-dark-green rounded-full p-4 max-w-xs",
    "text-center transition duration-300 ease-in-out",
    "hover:bg-green hover:text-black border-2 border-transparent",
    "focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2",
    className
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
