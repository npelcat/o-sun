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
      <Link href={lien} target={target}>
        <button className="text-xl text-white bg-dark-green font-subtitle rounded-full p-4 transition duration-300 ease-in-out hover:bg-dark-beige hover:text-dark-green">
          {titleButton}
        </button>
      </Link>
    </div>
  );
};
