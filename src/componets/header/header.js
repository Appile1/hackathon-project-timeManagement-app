"use client";
import React from "react";
import { useUser, SignOutButton, UserButton } from "@clerk/nextjs";
import "./header.css";
import Link from "next/link";

function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="header">
      <div className="header-content">
        <div className=" text-red-500 pr-4 text-2xl md:text-3xl">
          Networking Hub
        </div>
        <nav className="nav pt-3 flex px-1">
          <li className="flex gap-x-4 md:gap-x-12">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/reviews" className="nav-link">
              Reviews
            </Link>
            <Link href="/profile" className="nav-link">
              Profile
            </Link>

            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <SignOutButton className="sign-out-button relative bottom-2 px-2 py-1 mt-1  ">
                  Sign Out
                </SignOutButton>
              </>
            ) : (
              <Link href="/signin" className="nav-link ">
                Sign In
              </Link>
            )}
          </li>
        </nav>
      </div>
    </header>
  );
}

export default Header;
