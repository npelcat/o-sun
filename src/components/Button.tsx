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
  if (link) {
    return (
      <Link href={link || "#"} target={target} rel={rel} className={className}>
        {titleButton}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {titleButton}
    </button>
  );
};
