import React from "react";
import { LinkedIn, GitHub, Twitter, Instagram } from "@mui/icons-material";

const socialLinks = [
  { icon: LinkedIn, href: "https://www.linkedin.com" },
  { icon: GitHub, href: "https://www.github.com" },
  { icon: Twitter, href: "https://www.twitter.com" },
  { icon: Instagram, href: "https://www.instagram.com" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-8 px-4 shadow-lg animate-fadeIn">
      <div className="container mx-auto flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
        <p className="text-sm sm:text-base font-inter text-center sm:text-left animate-slideUp">
          © 2024 Networking Hub. All rights reserved.
        </p>
        <div className="flex space-x-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00A3E0] transition-transform transform hover:scale-125"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <link.icon fontSize="medium" />
              <span className="sr-only">{link.icon.name}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
