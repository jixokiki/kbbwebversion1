"use client";
import CardItem from "@/components/CardItem";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/Footer";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState(""); // Inisialisasi state userName dengan nilai awal kosong
  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
    }else if (user && userProfile.role === "gudang") {
      router.push("/gudang");
    }else if (user && userProfile.role === "user") {
      // Jika user adalah admin, kita dapat menampilkan alert selamat datang
      // dan menampilkan nama admin dari userProfile
      alert("Selamat datang, " + userProfile.name);
      setUserName(userProfile.name);
    }
  }, [user, userProfile, router]);
  return (
    <div>
      <Navbar />
      <div className="relative">
        <Image
          src={"/assets/balehologo.jpg"}
          width={3000 / 3}
          height={2000 / 3}
          className="relative w-full h-screen object-cover"
          alt="Home Page"
          priority
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center flex flex-col gap-3 w-3/4 md:w-fit">
          <h1 className="text-5xl font-extrabold text-orange-950">
            KBB
          </h1>
          <p className="text-xl">Choose the product according to your wishes</p>
          <button className="bg-white p-4 rounded-lg font-bold text-xl">
            R +
          </button>
        </div>
      </div>
      <div className="p-5 md:p-24">
        <div className="text-center my-10 ">
          <h2 className="text-3xl mb-3">Our Products</h2>
          <p>Product Offer from KBB Production</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <CardItem
            judul={"DKV"}
            deskripsi={"Desain Komunikasi Visual"}
            imageUrl={"/assets/IconDM.PNG"}
          />
          <CardItem
            judul={"FIKOM"}
            deskripsi={"Fakultas Ilmu Komunikasi"}
            imageUrl={"/assets/IconDM.PNG"}
          />
          <CardItem
            judul={"FASILKOM"}
            deskripsi={"Fakultas Ilmu Komputer"}
            imageUrl={"/assets/IconDM.PNG"}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}