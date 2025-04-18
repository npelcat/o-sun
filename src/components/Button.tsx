import Link from "next/link";
import clsx from "clsx";

interface ButtonInterface {
  titleButton: string;
  link?: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonInterface> = ({
  titleButton,
  link,
  target,
  rel,
  className = "",
  onClick,
}) => {
  const baseClasses = clsx(
    "text-xl font-subtitle text-white bg-dark-green rounded-full p-4 max-w-xs",
    "text-center transition duration-300 ease-in-out",
    "hover:bg-dark-beige hover:text-black border-2 border-transparent",
    "focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2",
    className
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses}>
        {titleButton}
      </button>
    );
  }

  return (
    <Link href={link || "#"} target={target} rel={rel} className={baseClasses}>
      {titleButton}
    </Link>
  );
};
