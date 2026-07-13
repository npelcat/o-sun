export interface UrgencyConfig {
  text: string;
  link: string;
  linkLabel?: string;
  conditions?: string[];
  followUpText?: string;
  followUpLink?: string;
  followUpLinkLabel?: string;
}

export interface ServicePageConfig {
  hero: {
    label?: string;
    title: string;
    description: string;
  };
  highlightSlug?: string;
  pricingSubtitle?: string;
  urgency?: UrgencyConfig;
  cta: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonLink: string;
  };
  sectionTitles?: {
    pricing?: string;
    about?: string;
    practical?: string;
  };
}
