"use client";

import { useState, FC, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface AccordionProps {
  title: string;
  children: ReactNode;
  button?: ReactNode;
}

const Accordion: FC<AccordionProps> = ({ title, children, button }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full my-10">
      <h3
        className="font-subtitle cursor-pointer flex items-center md:text-xl transition ease-in-out hover:bg-white hover:rounded-lg hover:bg-opacity-70"
        onClick={toggleAccordion}
      >
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="mr-2 md:text-2xl"
        />
        {title}
      </h3>
      {isOpen && (
        <div>
          <div className="m-2 bg-white rounded-lg p-4">{children}</div>
          {button && <div className="mt-4">{button}</div>}
        </div>
      )}
    </div>
  );
};

export default Accordion;
