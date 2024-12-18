"use client";
import Link from "next/link";
import { ShieldCheckIcon } from "lucide-react";
import ThemeController from "./ThemeToggler";

const Header: React.FC = () => {
  return (
    <div className="navbar bg-base-100 px-[1rem] shadow-md">
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {/* Dropdown Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-base"
          >
            <li>
              <Link href="/" className="btn btn-ghost">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="btn btn-ghost">
                About
              </Link>
            </li>
            <li>
              <Link href="/check-url" className="btn btn-ghost">
                Check URL
              </Link>
            </li>
            <li>
              <Link href="/contact" className="btn btn-ghost">
                Contact
              </Link>
            </li>
            <div className="mt-4 flex flex-col gap-2">
              <button className="btn btn-primary">Login</button>
              <button className="btn btn-secondary">Sign Up</button>
            </div>
          </ul>
        </div>
        <Link
          href="/"
          className="text-2xl font-bold flex items-center justify-center gap-3 px-4 py-2 rounded-lg hover:bg-base-200 transition-colors duration-300"
        >
          {/* Icon */}
          <ShieldCheckIcon className="text-primary" size={28} />

          {/* Text and Tagline */}
          <div className="flex flex-col items-start justify-center gap-1">
            {/* Brand Name */}
            <div className="flex items-baseline gap-[2px]">
              <span className="text-primary font-extrabold text-xl">Cyber</span>
              <span className="text-accent font-semibold text-xl">Scout</span>
            </div>
            <hr className="border border-base-content w-full" />
            {/* Tagline */}
            <span className="text-sm text-base-content/70 italic">
              Click with confidence
            </span>
          </div>
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-4 text-base">
          <li>
            <Link href="/" className="">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-primary-focus">
              About
            </Link>
          </li>
          <li>
            <Link href="/check-url" className="hover:text-primary-focus">
              Check URL
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-primary-focus">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end hidden lg:flex gap-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            (document.getElementById("login") as HTMLDialogElement).showModal();
          }}
        >
          Login
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            (
              document.getElementById("signup") as HTMLDialogElement
            ).showModal();
          }}
        >
          Sign Up
        </button>
        <ThemeController />
      </div>

      <div className="navbar-end lg:hidden">
        <ThemeController />
      </div>
    </div>
  );
};

export default Header;
