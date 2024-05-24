import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="p-12 md:p-24 bg-gray-950 text-white">
      <h2 className="text-3xl font-bold text-center md:text-left">
        DESAINERIAM & CO
      </h2>
      <p className="my-3 text-center md:text-left">
        Digital Marketing Agency And Media Entertainment.
      </p>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-10 place-items-center md:place-items-start text-center md:text-left">
        <ul className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">Project</h3>
          <div className="w-full md:w-28 mb-2">
            <hr />
          </div>
          <Link href={"/"} className="hover:underline">
            Photographer
          </Link>
          <Link href={"/"} className="hover:underline">
            Photoshoot
          </Link>
          <Link href={"/"} className="hover:underline">
            Photo Product
          </Link>
          <Link href={"/"} className="hover:underline">
            Videographer
          </Link>
          <Link href={"/"} className="hover:underline">
            Advertising Video
          </Link>
          <Link href={"/"} className="hover:underline">
            Social Media Marketing
          </Link>
          <Link href={"/"} className="hover:underline">
            Website Development
          </Link>
        </ul>
        <ul className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">Community</h3>
          <div className="w-full md:w-28 mb-2">
            <hr />
          </div>
          <Link href={"/"} className="hover:underline">
            Github
          </Link>
          <Link href={"/"} className="hover:underline">
            Issues
          </Link>
          <Link href={"/"} className="hover:underline">
            Project
          </Link>
          <Link href={"/"} className="hover:underline">
            Twitter
          </Link>
          <Link href={"/"} className="hover:underline">
            Instagram
          </Link>
          <Link href={"/"} className="hover:underline">
            Gmail
          </Link>
          <Link href={"/"} className="hover:underline">
            Freelancer
          </Link>
          <Link href={"/"} className="hover:underline">
            Linkedin
          </Link>
        </ul>
        <ul className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">Help</h3>
          <div className="w-full md:w-28 mb-2">
            <hr />
          </div>
          <Link href={"/"} className="hover:underline">
            Support
          </Link>
          <Link href={"/"} className="hover:underline">
            Troubleshooting
          </Link>
          <Link href={"/"} className="hover:underline">
            Contact Us
          </Link>
        </ul>
        <ul className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">Others</h3>
          <div className="w-full md:w-28 mb-2">
            <hr />
          </div>
          <Link href={"/"} className="hover:underline">
            Terms Of Service
          </Link>
          <Link href={"/"} className="hover:underline">
            Privacy Policy
          </Link>
          <Link href={"/"} className="hover:underline">
            License
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
