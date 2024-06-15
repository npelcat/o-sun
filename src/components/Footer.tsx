import Link from "next/link";
import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-green text-white bg-opacity-50 mt-16">
      <div className="container mx-auto p-5 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <h3 className="text-lg text-black font-subtitle font-bold mb-2">
            On se retrouve sur mes réseaux ?
          </h3>
          <div className="flex items-center">
            <Link
              href="https://www.instagram.com/o.sun.voixanimale/"
              target="_blank"
            >
              {" "}
              <Image
                className="h-20 w-20 p-3 transition duration-300 ease-in-out hover:scale-125"
                src="/img/social/instagram.png"
                width={382}
                height={392}
                alt="logo instagram"
              />{" "}
            </Link>
            <Link href="#" target="_blank">
              {" "}
              <Image
                className="h-20 w-20 p-3 transition duration-300 ease-in-out hover:scale-125"
                src="/img/social/facebook.png"
                width={384}
                height={392}
                alt="logo facebook"
              />{" "}
            </Link>
          </div>
        </div>
        <div className="flex-col items-center mt-4 text-center">
          <Link
            href="#"
            target="_blank"
            className="mb-2 p-2 text-sm font-semibold"
          >
            Mentions légales
          </Link>
          <Link
            href="#"
            target="_blank"
            className="mb-2 p-2 font-semibold text-sm"
          >
            CGV
          </Link>
          <p className="text-xs">© 2024 par O&apos;Sun - Voix Animale</p>
        </div>
      </div>
    </footer>
  );
};
