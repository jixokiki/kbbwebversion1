import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";

const Thanks = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <div className="md:px-20 mt-28">
        <h1 className="text-center text-2xl font-semibold">
          Terimakasih telah membeli
        </h1>
        <Image
          src={"/assets/thankyou.png"}
          width={926}
          height={900}
          alt="Thankyou"
          className="w-full h-96 object-contain"
        />
        <div className=" flex justify-center">
          <Link
            href={"/"}
            className="bg-stone-800 px-8 py-4 text-white text-2xl rounded flex items-center gap-3"
          >
            <span>
              <IoIosArrowBack size={24} />
            </span>
            Kembali ke payment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Thanks;
