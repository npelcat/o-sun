import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface DropdownMenuProps {
  title: string;
  items: { label: string; href: string }[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuPosition = () => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        menuRef.current.style.right = "0";
        menuRef.current.style.left = "auto";
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleMenuPosition();
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 font-subtitle transition duration-300 ease-in-out hover:bg-beige hover:bg-opacity-30 hover:rounded-lg"
      >
        {title}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-40 right-0 rounded-md shadow-lg bg-white ring-1 ring-dark-green ring-opacity-5 z-50">
          <div className="py-1">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block px-4 py-2 hover:bg-dark-beige hover: bg-opacity-30 rounded-lg focus:font-bold"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
