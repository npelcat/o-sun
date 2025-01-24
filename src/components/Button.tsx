import Link from "next/link";

interface ButtonInterface {
  titleButton: string;
  lien?: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonInterface> = ({
  titleButton,
  lien,
  target,
  rel,
  className,
  onClick,
}) => {
  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {titleButton}
      </button>
    );
  }

  return (
    <Link href={lien || "#"} target={target} rel={rel} className={className}>
      {titleButton}
    </Link>
  );
};
