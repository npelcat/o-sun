import Link from "next/link";

interface ButtonInterface {
  titleButton: string;
  lien: string;
  target?: string;
}

export const Button: React.FC<ButtonInterface> = ({
  titleButton,
  lien,
  target,
}) => {
  return (
    <div className="flex justify-center items-center m-4">
      <Link href={lien} target={target} passHref>
        <a
          className="inline-block text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-dark-green focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
          aria-label={titleButton}
        >
          {titleButton}
        </a>
      </Link>
    </div>
  );
};
