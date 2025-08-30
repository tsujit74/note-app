// components/Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-center md:justify-start p-2 shadow-md bg-white">
      <img
        src="/images/top.png"
        alt="Logo"
        className="w-48 md:w-64 h-auto object-contain"
      />
    </header>
  );
};

export default Header;
