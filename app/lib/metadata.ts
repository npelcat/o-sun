import type { Metadata } from "next";

export const pageMetadata: Record<string, Metadata> = {
  home: {
    title: "O'Sun - Communication animale et soins énergétiques",
    description:
      "Bienvenue sur O'Sun, site de communication animale et soins énergétiques pour humains et animaux. Découvrez les services d'Océane, praticienne à l'écoute du vivant.",
    openGraph: {
      title: "O'Sun - Communication animale & Soins énergétiques",
      description:
        "Explorez l'univers d'O'Sun : des soins pour les animaux et leurs gardiens, une communication douce et intuitive, basée sur l'écoute et l'énergie.",
      url: "https://www.osun-voixanimale.com/",
      siteName: "O'Sun - voix animale",
      images: [
        {
          url: "https://res.cloudinary.com/dqpkzbkca/image/upload/v1739012163/medium_280859275_1460786831038584_3178236038909394168_n_12a735936a.jpg",
          width: 1200,
          height: 630,
          alt: "O'Sun - Communication animale et soins énergétiques",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "O'Sun - Communication animale & Soins énergétiques",
      description:
        "Découvrez les services d'Océane : communication animale et soins énergétiques pour animaux et humains.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    keywords: [
      "communication animale",
      "soins énergétiques",
      "énergétique animale",
      "Océane",
      "O'Sun",
      "thérapie animale",
      "bien-être animal",
      "communication intuitive",
      "praticienne holistique",
    ],
    alternates: {
      canonical: "https://www.osun-voixanimale.com/",
    },
  },

  animalCommunication: {
    title: "Communication animale - Comprendre son animal autrement | O'Sun",
    description:
      "Découvrez la communication animale proposée par Océane : un échange d'âme à âme pour mieux comprendre les besoins, les émotions et le vécu de votre compagnon animal.",
    keywords: [
      "communication animale",
      "communication intuitive avec les animaux",
      "comprendre son animal",
      "écoute animale",
      "connexion animale",
      "échange animalier",
      "éthique communication animale",
      "Océane O'Sun",
      "voix animale",
      "soins pour animaux",
      "services holistiques animaux",
    ],
    openGraph: {
      title: "Communication animale - Service principal d'O'Sun",
      description:
        "Océane vous propose des séances de communication animale pour entrer en lien profond avec votre compagnon. Découvrez le déroulement, les bienfaits et ses engagements.",
      url: "https://www.osun-voixanimale.com/services",
      siteName: "O'Sun - voix animale",
      images: [
        {
          url: "https://res.cloudinary.com/dqpkzbkca/image/upload/v1739011417/small_312893740_1155383065095459_3430407705214598590_n_1_373ded7722.jpg",
          width: 1200,
          height: 630,
          alt: "O'Sun - Communication animale avec Océane",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Communication animale - O'Sun",
      description:
        "Séances de communication animale pour comprendre votre compagnon en profondeur.",
    },
    alternates: {
      canonical: "https://www.osun-voixanimale.com/services",
    },
  },

  energyCare: {
    title: "Soins énergétiques pour animaux et humains - O'Sun",
    description:
      "Découvrez les bienfaits des soins énergétiques proposés par Océane : rééquilibrage, bien-être et accompagnement personnalisé pour animaux et humains.",
    keywords: [
      "soins énergétiques",
      "énergie vitale",
      "équilibrage énergétique",
      "bien-être holistique",
      "thérapie énergétique",
      "Océane praticienne",
      "O'Sun soins",
      "soins énergétiques animaux",
      "duo humain-animal",
      "soins énergétiques humains",
      "chakras animaux",
      "communication énergétique",
      "soins vibratoires",
      "alignement énergétique",
      "rééquilibrage corps-esprit",
    ],
    openGraph: {
      title: "Soins énergétiques - O'Sun",
      description:
        "En savoir plus sur les soins énergétiques pour animaux et humains. Pratiques, effets et déroulement des séances.",
      url: "https://www.osun-voixanimale.com/services/energy-care",
      siteName: "O'Sun - voix animale",
      images: [
        {
          url: "https://res.cloudinary.com/dqpkzbkca/image/upload/v1739013236/small_IMG_7523_90da75126f.jpg",
          width: 1200,
          height: 630,
          alt: "O'Sun - Services énergétiques pour humains et duos",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Soins énergétiques - O'Sun",
      description: "Soins énergétiques personnalisés pour animaux et humains.",
    },
    alternates: {
      canonical: "https://www.osun-voixanimale.com/services/energy-care",
    },
  },

  guardians: {
    title: "Guidances lunaires et soins énergétiques humains - O'Sun",
    description:
      "Découvrez les services proposés par Océane pour les humains : guidances lunaires (Moon Guidance), soins énergétiques personnalisés et accompagnement duo humain-animal.",
    keywords: [
      "guidance lunaire",
      "moon guidance",
      "soin énergétique humain",
      "soin énergétique duo",
      "communication énergétique",
      "accompagnement énergétique",
      "pleine lune",
      "nouvelle lune",
      "Océane O'Sun",
      "soins holistiques humains",
    ],
    openGraph: {
      title: "Soins énergétiques humains et duo - O'Sun",
      description:
        "Explorez les services énergétiques proposés aux humains : soins personnalisés, guidances lunaires, accompagnement duo pour le lien humain-animal.",
      url: "https://www.osun-voixanimale.com/services/guardians",
      siteName: "O'Sun - voix animale",
      images: [
        {
          url: "https://res.cloudinary.com/dqpkzbkca/image/upload/v1740419365/small_462579441_582098950981349_5593562172733989030_n_5571d7e53b.jpg",
          width: 1200,
          height: 630,
          alt: "O'Sun - Services énergétiques pour humains et duos",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Guidances lunaires et soins humains - O'Sun",
      description:
        "Services énergétiques personnalisés pour humains et accompagnement duo.",
    },
    alternates: {
      canonical: "https://www.osun-voixanimale.com/services/guardians",
    },
  },

  booking: {
    title:
      "Réserver une séance - Communication animale, soins & guidance | O'Sun",
    description:
      "Prenez rendez-vous avec Océane pour une communication animale, un soin énergétique (animal, humain ou duo) ou une guidance. Réservation en ligne simple et rapide.",
    keywords: [
      "réservation communication animale",
      "prendre rendez-vous communication animale",
      "soin énergétique animal",
      "réserver soin énergétique humain",
      "réservation guidance lunaire",
      "pack communication et soin",
      "appel découverte",
      "réserver O'Sun",
      "Océane O'Sun rendez-vous",
      "services holistiques animaux humains",
    ],
    openGraph: {
      title: "Réservation des services O'Sun - Communication & soins",
      description:
        "Réservez votre séance avec Océane : communication animale, soins énergétiques, guidances, accompagnement duo humain-animal.",
      url: "https://www.osun-voixanimale.com/contact/booking",
      siteName: "O'Sun - voix animale",
      images: [
        {
          url: "https://res.cloudinary.com/dqpkzbkca/image/upload/v1739013155/small_DSC_03836_fc5750de73.jpg",
          width: 1200,
          height: 630,
          alt: "Réserver un service O'Sun : communication animale, soins énergétiques",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Réserver une séance O'Sun",
      description:
        "Prise de rendez-vous en ligne pour communication animale et soins énergétiques.",
    },
    alternates: {
      canonical: "https://www.osun-voixanimale.com/contact/booking",
    },
  },

  contact: {
    title: "Contact - Posez vos questions à Océane | O'Sun",
    description:
      "Une question sur la communication animale ou les soins énergétiques ? Contactez Océane via notre formulaire sécurisé. Réponse rapide et personnalisée garantie.",
    keywords: [
      "contact O'Sun",
      "question communication animale",
      "contacter Océane",
      "formulaire contact",
      "demande renseignements",
      "information soins énergétiques",
      "aide communication animale",
      "contact praticienne holistique",
    ],
    openGraph: {
      title: "Contactez O'Sun - Questions & renseignements",
      description:
        "Besoin d'informations sur nos services ? Contactez Océane pour toutes vos questions sur la communication animale et les soins énergétiques.",
      url: "https://www.osun-voixanimale.com/contact",
      siteName: "O'Sun - voix animale",
      images: [
        {
          url: "https://res.cloudinary.com/dqpkzbkca/image/upload/v1739012163/medium_280859275_1460786831038584_3178236038909394168_n_12a735936a.jpg",
          width: 1200,
          height: 630,
          alt: "Contactez O'Sun pour vos questions sur la communication animale",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact O'Sun",
      description:
        "Contactez Océane pour vos questions sur la communication animale et les soins énergétiques.",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://www.osun-voixanimale.com/contact",
    },
  },

  about: {
    title:
      "Qui suis-je ? - Océane, praticienne en communication animale | O'Sun",
    description:
      "Découvrez le parcours d'Océane, fondatrice d'O'Sun : son cheminement vers la communication animale, son rapport unique aux animaux, à l'énergétique et aux mondes subtils.",
    keywords: [
      "Océane O'Sun",
      "qui est Océane",
      "parcours communication animale",
      "formation communication animale",
      "praticienne holistique",
      "histoire personnelle",
      "passion animaux",
      "cheminement spirituel",
      "praticienne énergétique",
      "fondatrice O'Sun",
    ],
    openGraph: {
      title: "Océane - Fondatrice d'O'Sun, praticienne holistique",
      description:
        "Apprenez à connaître Océane : son parcours, sa formation, sa passion pour les animaux et son approche unique de la communication animale.",
      url: "https://www.osun-voixanimale.com/about",
      siteName: "O'Sun - voix animale",
      images: [
        {
          url: "https://res.cloudinary.com/dqpkzbkca/image/upload/v1739012163/medium_280859275_1460786831038584_3178236038909394168_n_12a735936a.jpg",
          width: 1200,
          height: 630,
          alt: "Océane, fondatrice d'O'Sun et praticienne en communication animale",
        },
      ],
      locale: "fr_FR",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: "Océane - O'Sun",
      description:
        "Découvrez le parcours d'Océane, praticienne en communication animale et soins énergétiques.",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://www.osun-voixanimale.com/about",
    },
  },

  ethics: {
    title: "Mon éthique professionnelle - Valeurs et engagements | O'Sun",
    description:
      "Découvrez l'éthique professionnelle d'Océane : ses valeurs, sa déontologie et ses engagements dans la pratique de la communication animale et des soins énergétiques.",
    keywords: [
      "éthique communication animale",
      "déontologie praticienne",
      "valeurs O'Sun",
      "éthique soins énergétiques",
      "respect animal",
      "engagement professionnel",
      "pratique responsable",
      "éthique holistique",
      "bienveillance animale",
      "respect gardiens",
    ],
    openGraph: {
      title: "Éthique professionnelle O'Sun - Valeurs & engagements",
      description:
        "Transparence sur les valeurs et l'éthique qui guident la pratique d'Océane en communication animale et soins énergétiques.",
      url: "https://www.osun-voixanimale.com/about/ethics",
      siteName: "O'Sun - voix animale",
      images: [
        {
          url: "https://res.cloudinary.com/dqpkzbkca/image/upload/v1739011417/small_312893740_1155383065095459_3430407705214598590_n_1_373ded7722.jpg",
          width: 1200,
          height: 630,
          alt: "Éthique professionnelle O'Sun - Respect et bienveillance",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Éthique O'Sun",
      description:
        "Les valeurs et engagements éthiques qui guident la pratique d'Océane.",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://www.osun-voixanimale.com/about/ethics",
    },
  },

  testimonials: {
    title:
      "Témoignages clients - Avis sur la communication animale et soins énergétiques | O'Sun",
    description:
      "Découvrez les témoignages authentiques de nos clients sur les séances de communication animale et soins énergétiques. Avis vérifiés et expériences partagées.",
    keywords: [
      "témoignages communication animale",
      "avis clients O'Sun",
      "retours d'expérience",
      "témoignages soins énergétiques",
      "avis communication animale",
      "expériences clients",
      "témoignages Océane",
      "avis Google O'Sun",
      "satisfaction clients",
      "retours positifs",
    ],
    openGraph: {
      title: "Témoignages clients O'Sun - Avis & expériences",
      description:
        "Lisez les témoignages de nos clients sur leurs expériences avec la communication animale et les soins énergétiques d'Océane.",
      url: "https://www.osun-voixanimale.com/about/testimonials",
      siteName: "O'Sun - voix animale",
      images: [
        {
          url: "https://res.cloudinary.com/dqpkzbkca/image/upload/v1739013155/small_DSC_03836_fc5750de73.jpg",
          width: 1200,
          height: 630,
          alt: "Témoignages clients O'Sun - Avis sur la communication animale",
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Témoignages O'Sun",
      description:
        "Découvrez les avis de nos clients sur la communication animale et les soins énergétiques.",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://www.osun-voixanimale.com/about/testimonials",
    },
  },
};
