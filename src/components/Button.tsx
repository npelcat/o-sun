import Link from "next/link";

interface ButtonInterface {
  titleButton: string;
  lien: string;
  target?: string;
  className?: string;
}

export const Button: React.FC<ButtonInterface> = ({
  titleButton,
  lien,
  target,
}) => {
  return (
    <Link
      href={lien}
      target={target}
      className="flex justify-center items-center m-4 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
      style={{ zIndex: 100 }}
    >
      {titleButton}
    </Link>
  );
};
