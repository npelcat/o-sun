"use client";

import { useState, FC, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionProps {
  title: string;
  children: ReactNode;
  button?: ReactNode;
}

export const Accordion: FC<AccordionProps> = ({ title, children, button }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleAccordion();
    }
  };

  return (
    <div className="w-full my-4">
      <h3 className="font-subtitle cursor-pointer flex items-center md:text-xl transition ease-in-out hover:bg-white hover:rounded-lg hover:bg-opacity-70">
        <button
          aria-expanded={isOpen}
          className="flex items-center w-full text-left"
          onClick={toggleAccordion}
          onKeyDown={handleKeyDown}
          role="button"
        >
          {isOpen ? (
            <ChevronUp className="mr-2 w-12 h-12 p-2" />
          ) : (
            <ChevronDown className="mr-2 w-12 h-12 p-2" />
          )}
          {title}
        </button>
      </h3>
      {isOpen && (
        <div>
          <div role="region" className="m-2 bg-white rounded-lg p-4">
            {children}
          </div>
          {button && <div className="mt-4">{button}</div>}
        </div>
      )}
    </div>
  );
};
