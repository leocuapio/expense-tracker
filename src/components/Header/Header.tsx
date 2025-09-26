// src/components/Header/Header.tsx
import React from 'react';

/**
 * Application header with title and navigation elements
 */
interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="
      bg-gradient-to-br from-blue-500 to-purple-600
      text-white shadow-lg mb-8
      flex flex-col md:flex-row items-center md:items-center justify-between
      px-5 py-6 rounded-xl gap-5
      text-center md:text-left
    ">
      {/* Header Content */}
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{title}</h1>
        {subtitle && (
          <p className="text-base opacity-90 text-blue-100 m-0">{subtitle}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
        <button className="bg-white/20 border border-white/20 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5">
          Dashboard
        </button>
        <button className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5">
          Analytics
        </button>
        <button className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5">
          Settings
        </button>
      </nav>
    </header>
  );
};

export default Header;
