"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setActiveAccordion(null);
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const navigationSections = {
    about: {
      title: "A propos",
      items: [
        { label: "Qui suis-je ?", href: "/about" },
        { label: "Mon éthique", href: "/about/ethics" },
        { label: "Témoignages", href: "/about/testimonials" },
      ],
    },
    services: {
      title: "Services",
      items: [
        { label: "La communication animale", href: "/services" },
        { label: "Les soins énergétiques", href: "/services/energy-care" },
        { label: "Pour les gardiens", href: "/services/guardians" },
      ],
    },
    booking: {
      title: "Réservation",
      items: [
        { label: "Réservation", href: "/contact/booking" },
        { label: "Me contacter", href: "/contact" },
      ],
    },
  };

  return (
    <>
      {/* Sticky navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg  bg-opacity-85 py-1"
            : "bg-white py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Retour à la page d'accueil"
            className="flex-shrink-0"
          >
            <Image
              className={`transition-all duration-300 ease-in-out hover:scale-110 ${
                isScrolled ? "h-12 w-12" : "h-20 w-20"
              }`}
              src="/img/logos_and_free_pics/o-sun-logo.png"
              width={80}
              height={80}
              alt="Logo d'O'Sun Voix Animale"
              priority
            />
          </Link>

          {/* Desktop navbar - dropdown on hover */}
          <div className="hidden lg:flex items-center gap-1">
            {Object.entries(navigationSections).map(([key, section]) => (
              <div key={key} className="relative group">
                <button
                  className="px-4 py-2 font-subtitle text-lg hover:bg-beige hover:bg-opacity-30 rounded-lg transition-all duration-200"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {section.title}
                </button>

                <div className="absolute top-full left-0 mt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                  <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    {section.items.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block px-4 py-3 hover:bg-dark-green hover:bg-opacity-20 transition-colors duration-150"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hamburger menu mobile */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors active:bg-beige"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu de navigation"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6 transition-transform duration-300"
              style={{ transform: isMenuOpen ? "rotate(90deg)" : "rotate(0)" }}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu with accordions */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
            {Object.entries(navigationSections).map(([key, section]) => (
              <div key={key}>
                <button
                  onClick={() => toggleAccordion(key)}
                  className="w-full flex items-center justify-between py-3 px-2 font-semibold text-dark-green hover:text-black hover:bg-beige hover:bg-opacity-20 rounded-lg transition-all duration-200 active:bg-beige active:bg-opacity-50"
                  aria-expanded={activeAccordion === key}
                >
                  <span>{section.title}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      activeAccordion === key ? "rotate-180" : ""
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    activeAccordion === key
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-4 pr-2 pb-2 space-y-1">
                    {section.items.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block py-2 px-3 hover:bg-green hover:bg-opacity-50 rounded-lg transition-all duration-150 active:bg-green active:bg-opacity-90"
                        onClick={handleLinkClick}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/dqpkzbkca/image/upload/f_auto,q_auto,w_1920/v1719403241/IMG_6808_i2woft.jpg"
          width={1920}
          height={1280}
          alt="Océane et un de ses bergers australien partageant un contact main-patte"
          priority
          quality={85}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="text-8xl md:text-9xl lg:text-10xl text-white font-title drop-shadow-2xl leading-tight">
            O&apos;Sun
            <br />
            <span className="text-6xl md:text-7xl lg:text-8xl">
              Voix Animale
            </span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-lg">
            Communication animale et soins énergétiques
          </p>
        </div>
      </header>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </>
  );
};
