"use client";
import useAuth from "@/app/hooks/useAuth";
import Link from "next/link";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const { user, handleLogout } = useAuth();
  return (
    <>
      <nav className="bg-white flex justify-between items-center px-4 md:px-8 w-full md:w-11/12 h-20 shadow-md mx-auto rounded-none md:rounded-2xl border fixed top-0 md:top-5 left-1/2 -translate-x-1/2 z-40">
        <h1 className="text-3xl font-bold text-gray-900">KBB</h1>
        <div className="block md:hidden" onClick={toggleMenu}>
          <FaBars size={35} />
        </div>
        <ul
          className={`text-lg font-semibold text-gray-900 hidden md:flex md:items-center`}
        >
          <li className="md:mr-3">
            <Link
              href={"/"}
              className="px-4 py-3  transition-all duration-300 hover:bg-teal-500 hover:text-white rounded"
            >
              Home
            </Link>
          </li>
          <li className="md:mr-3">
            <Link
              href={"/about"}
              className="px-4 py-3  transition-all duration-300 hover:bg-teal-500 hover:text-white rounded"
            >
              About
            </Link>
          </li>
          {user && (
            <li className="md:mr-3">
              <Link
                href={"/product"}
                className="px-4 py-3  transition-all duration-300 hover:bg-teal-500 hover:text-white rounded"
              >
                Product
              </Link>
            </li>
          )}
          {user && (
            <li className="md:mr-3">
              <Link
                href={"/desain"}
                className="px-4 py-3  transition-all duration-300 hover:bg-teal-500 hover:text-white rounded"
              >
                Paddy
              </Link>
            </li>
          )}
          <li className="md:mr-3">
            <Link
              href={"/service"}
              className="px-4 py-3  transition-all duration-300 hover:bg-teal-500 hover:text-white rounded"
            >
              Service
            </Link>
          </li>
          <li className="md:mr-3">
            <Link
              href={"/payment"}
              className="px-4 py-3  transition-all duration-300 hover:bg-teal-500 hover:text-white rounded"
            >
              Payment Road
            </Link>
          </li>
          <li className="md:mr-3">
            <Link
              href={"/contact"}
              className="px-4 py-3  transition-all duration-300 hover:bg-teal-500 hover:text-white rounded"
            >
              Contact
            </Link>
          </li>
          {user && (
            <li className="md:mr-6">
              <CartDrawer />
            </li>
          )}
          {!user ? (
            <>
              <li className="md:mr-3">
                <Link
                  href={"/sign-up"}
                  className="px-4 py-3 transition-all duration-500 bg-gray-200 hover:bg-zinc-900 rounded hover:text-white"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href={"/sign-in"}
                  className="px-4 py-3 transition-all duration-500 bg-teal-500 text-white hover:bg-teal-800 rounded hover:text-white"
                >
                  Sign In
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link
                href={"/sign-in"}
                onClick={handleLogout}
                className="px-4 py-3 transition-all duration-500 bg-teal-500 text-white hover:bg-teal-800 rounded hover:text-white"
              >
                Logout
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <ul
        className={`fixed z-40 top-[67px] w-full bg-white border-t border-gray-200 transform transition-transform flex flex-col gap-5 p-10 font-semibold text-center ${
          isOpen
            ? "-translate-x-0"
            : "-translate-x-full transition-transform duration-500"
        }`}
      >
        <li className="md:mr-3">
          <Link href={"/"}>Home</Link>
        </li>
        <li className="md:mr-3">
          <Link href={"/about"}>About</Link>
        </li>
        {user && (
          <li className="md:mr-3">
            <Link href={"/product"}>Product</Link>
          </li>
        )}
        {user && (
          <li className="md:mr-3">
            <Link href={"/desain"}>Paddy</Link>
          </li>
        )}
        <li className="md:mr-3">
          <Link href={"/service"}>Service</Link>
        </li>
        <li className="md:mr-3">
          <Link href={"/contact"}>Contact</Link>
        </li>
        {user && (
          <li className="md:mr-6">
            <CartDrawer />
          </li>
        )}
        {!user ? (
          <>
            <li className="w-full bg-gray-100 py-3 rounded">
              <Link
                href={"/sign-up"}
                className="transition-all duration-500  rounded hover:text-white"
              >
                Sign Up
              </Link>
            </li>
            <li className="w-full bg-teal-100 py-3 rounded">
              <Link
                href={"/sign-in"}
                className="transition-all duration-500  rounded hover:text-white"
              >
                Sign In
              </Link>
            </li>
          </>
        ) : (
          <li className="w-full bg-teal-100 py-3 rounded">
            <Link
              href={"/sign-in"}
              onClick={handleLogout}
              className="transition-all duration-500  rounded hover:text-white"
            >
              Logout
            </Link>
          </li>
        )}
      </ul>
    </>
  );
};

export default Navbar;
