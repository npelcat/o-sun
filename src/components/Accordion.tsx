"use client";

import { useState, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface AccordionProps {
  title: string;
  content: string;
}

const Accordion: FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full my-10">
      <h3
        className="font-subtitle cursor-pointer flex items-center md:text-xl"
        onClick={toggleAccordion}
      >
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="mr-2 md:text-2xl"
        />
        {title}
      </h3>
      {isOpen && <p className="m-2 bg-white rounded-lg p-4">{content}</p>}
    </div>
  );
};

export default Accordion;
