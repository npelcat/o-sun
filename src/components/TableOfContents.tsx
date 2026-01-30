"use client";

interface ToCItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: ToCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="mx-4 md:mx-auto md:w-3/5 mb-8">
      <div className="flex flex-wrap gap-3 justify-center">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-beige border border-brown/20 hover:border-brown rounded-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="text-sm font-medium text-darkGray group-hover:text-brown transition-colors">
              {item.title}
            </span>
            <svg
              className="w-4 h-4 text-brown/60 group-hover:text-brown group-hover:translate-x-0.5 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        ))}
      </div>
    </nav>
  );
}
