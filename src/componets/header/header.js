"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, LogIn } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Flashcards", href: "/generate" },
  { name: "Memory", href: "/memory" },
  { name: "Profile", href: "/profile" },
  { name: "Leaderboard", href: "/leaderboard" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false); // Simulated auth state

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={` top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <Image
                src="/logo.png"
                alt="Logo"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-gray-800 text-xl font-bold group-hover:text-blue-600 transition-colors duration-300">
              YourApp
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 relative group"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            {isSignedIn ? (
              <button
                onClick={() => setIsSignedIn(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <User className="inline-block mr-2" size={18} />
                Profile
              </button>
            ) : (
              <button
                onClick={() => setIsSignedIn(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <LogIn className="inline-block mr-2" size={18} />
                Sign In
              </button>
            )}
          </div>

          <button
            className="md:hidden text-gray-600 hover:text-blue-600 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-white transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-2xl`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-800 text-2xl hover:text-blue-600 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {isSignedIn ? (
            <button
              onClick={() => {
                setIsSignedIn(false);
                setIsMenuOpen(false);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <User className="inline-block mr-2" size={18} />
              Profile
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSignedIn(true);
                setIsMenuOpen(false);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <LogIn className="inline-block mr-2" size={18} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
