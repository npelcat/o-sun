import Link from "next/link";

interface ButtonInterface {
  titleButton: string;
  lien: string;
  target?: string;
  rel?: string;
  className?: string;
}

export const Button: React.FC<ButtonInterface> = ({
  titleButton,
  lien,
  target,
  rel,
  className,
}) => {
  return (
    <Link href={lien} target={target} rel={rel} className={className}>
      {titleButton}
    </Link>
  );
};
