import Link from "next/link";
import Image from "next/image";

export const Header: React.FC = () => {
  return (
    <header>
      <div className="navbar">
        <div className="navbar-start px-3">
          <Link href="/">
            {" "}
            <Image
              className="h-20 w-20 md:h-50 md:w-50 transition duration-300 ease-in-out hover:scale-125"
              src="/img/logos_and_free_pics/o-sun-logo.png"
              width={760}
              height={759}
              alt="logo-o-sun"
            />{" "}
          </Link>
        </div>
        <div className="navbar-end">
          <div className="p-3 font-subtitle transition duration-300 ease-in-out hover:bg-beige hover:bg-opacity-30 hover:rounded-lg">
            <Link href="/about">A propos</Link>
          </div>
          <div className="p-3 font-subtitle transition duration-300 ease-in-out hover:bg-beige hover:bg-opacity-30 hover:rounded-lg">
            <Link href="/services">Services</Link>
          </div>
          <div className="p-3 font-subtitle transition duration-300 ease-in-out hover:bg-beige hover:bg-opacity-30 hover:rounded-lg">
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <section className="relative h-screen pt-32">
        <h1 className="z-40 absolute top-9 left-1/2  transform -translate-x-1/2 text-5xl md:text-7xl font-bold font-title py-25 text-center rounded-lg p-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white">
          O&apos;Sun
          <br />
          Voix Animale
        </h1>

        <Image
          className="absolute inset-0 w-full h-full object-cover"
          src="/img/oceane/oce-dogs/IMG_6808.jpg"
          width={6000}
          height={4000}
          alt="Océane et (nom du toutou)"
        />
      </section>

      <section className="pt-24">
        <div className="flex-col md:flex-row bg-dark-green bg-opacity-50 p-5 items-center mx-auto">
          <div className="w-full flex flex-col md:flex-row items-center justify-center md:px-16">
            <h2 className="pb-3 text-center">
              Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,
              ultricies sed, dolor. Cras elementum ultrices diam.
            </h2>
            <Image
              className="w-48 h-24 md:w-64 md:h-32 lg:w-72 lg:h-36 rounded-lg object-cover mt-4 md:mt-0 md:ml-4"
              src="/img/oceane/oce-dogs/280859275_1460786831038584_3178236038909394168_n.jpg"
              width={6000}
              height={4000}
              alt="Océane et sa famille de chiens"
            />
          </div>
        </div>
      </section>
    </header>
  );
};
