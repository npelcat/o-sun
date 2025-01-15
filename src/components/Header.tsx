import Link from "next/link";
import Image from "next/image";
import DropdownMenu from "./DropdownMenu";

export const Header: React.FC = () => {
  return (
    <header>
      <div className="navbar">
        <div className="navbar-start">
          <Link href="/" aria-label="Retour à la page d'accueil">
            {" "}
            <Image
              className="h-20 w-20 md:h-50 md:w-50 transition duration-300 ease-in-out hover:scale-125"
              src="/img/logos_and_free_pics/o-sun-logo.png"
              width={760}
              height={759}
              alt="Logo d'O'Sun Voix Animale"
            />{" "}
          </Link>
        </div>
        <div className="navbar-end flex">
          <DropdownMenu
            title="A propos"
            items={[
              { label: "Qui suis-je ?", href: "/about" },
              { label: "Mon éthique", href: "/about/ethics" },
              { label: "Témoignages", href: "/about/testimonials" },
            ]}
          />
          <DropdownMenu
            title="Services"
            items={[
              { label: "La communication animale", href: "/services" },
              {
                label: "Les soins énergétiques",
                href: "/services/energy-care",
              },
              { label: "Pour les gardiens", href: "/services/guardians" },
            ]}
          />
          <DropdownMenu
            title="Réservation"
            items={[
              { label: "Réservation", href: "/contact/booking" },
              { label: "Me contacter", href: "/contact" },
            ]}
          />
        </div>
      </div>

      <section className="relative h-screen pt-32">
        <h1 className="z-40 absolute top-9 left-1/2  transform -translate-x-1/2 text-5xl md:text-7xl text-dark-green font-bold font-title py-25 text-center rounded-lg p-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white">
          O&apos;Sun
          <br />
          Voix Animale
        </h1>

        <Image
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/dqpkzbkca/image/upload/v1719403241/IMG_6808_i2woft.jpg"
          width={6000}
          height={4000}
          alt="Océane et un de ses bergers australien partageant un contact main-patte"
          loading="eager"
        />
      </section>
    </header>
  );
};
