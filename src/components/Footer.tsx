import Link from "next/link";
import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <footer
      className="bg-dark-green text-white mt-16"
      aria-label="Footer section"
    >
      <div className="container mx-auto p-5 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <h3 className="text-lg text-white font-subtitle font-bold mb-2">
            On se retrouve sur mes réseaux ?
          </h3>
          <div className="flex items-center">
            <Link
              href="https://www.instagram.com/o.sun.voixanimale/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez-moi sur Instagram"
            >
              <Image
                className="h-20 w-20 p-3 transition duration-300 ease-in-out hover:scale-125"
                src="/img/social/instagram-white2.png"
                width={382}
                height={392}
                alt="Logo Instagram"
                loading="lazy"
              />
            </Link>
            <Link
              href="https://www.facebook.com/people/OSun-Voix-Animale/61551996179066/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez-moi sur Facebook"
            >
              <Image
                className="h-20 w-20 p-3 transition duration-300 ease-in-out hover:scale-125"
                src="/img/social/facebook-white.png"
                width={384}
                height={392}
                alt="Logo Facebook"
                loading="lazy"
              />
            </Link>
          </div>
        </div>

        <div className="flex-col items-center mt-4 text-center">
          <Link
            href="/mentions-legales"
            className="p-1 mr-2 text-sm font-semibold text-white hover:bg-green hover:text-black rounded-lg transition duration-300 ease-in-out"
          >
            Mentions légales
          </Link>
          ·
          <Link
            href="/cgv"
            className="p-1 ml-2 font-semibold text-sm text-white hover:bg-green hover:text-black rounded-lg transition duration-300 ease-in-out"
          >
            CGV
          </Link>
          ·
          <Link
            href="/privacy-policy"
            className="p-1 ml-2 font-semibold text-sm text-white hover:bg-green hover:text-black rounded-lg transition duration-300 ease-in-out"
          >
            Politique de confidentialité
          </Link>
          <p className="text-xs pt-3 text-white">
            © 2024 par O&apos;Sun - Voix Animale
          </p>
        </div>
      </div>
    </footer>
  );
};
