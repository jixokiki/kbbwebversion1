"use client";
import CardItem from "@/components/CardItem";
import DivisionItem from "@/components/DivisionItem";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/Footer";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
    }
  }, [user, userProfile, router]);
  return (
    <div>
      <Navbar />
      <div className="relative">
        <Image
          src={"/assets/BG1.jpg"}
          width={3000 / 3}
          height={2000 / 3}
          className="relative w-full h-screen object-cover"
          alt="Home Page"
          priority
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center flex flex-col gap-3 w-3/4 md:w-fit">
          <h1 className="text-5xl font-extrabold text-orange-950">
            UEU ASSETS
          </h1>
          <p className="text-xl">Choose Your Favorite ASSET</p>
          <button className="bg-white p-4 rounded-lg font-bold text-xl">
            RIZKI PRODUCTION
          </button>
        </div>
      </div>
      <div className="p-5 md:p-24">
        <DivisionItem
          title={"PRESIDENT DIRECTOR"}
          description={
            "bertanggung jawab secara penuh diamnco, membangun visi, misi, tujuan, serta program kerja diamnco, bertanggung jawab untuk memberikan arah perkembangan tujuan jangka pendek dan panjang, kebijakan, anggaran dan rencana operasional perusahaan dan mengawasi interpretasi yang konsisten dan penerapannya, serta rencana pencapaiannya, membangun tim sesuai rencana dan arah agency."
          }
          image1={"/assets/IconPD.jpeg"}
          image2={"/assets/gilang.jpeg"}
        />
        <DivisionItem
          title={"VICE PRESIDENT"}
          description={
            "membantu dalam pengambilan keputusan diamnco, membantu dan mengembangkan tim sesuai visi, misi, tujuan, serta arah agency yang telah di setujuin president director, bertanggung jawab atas operasional tim dan produksi terutama dibidang media entertainment, meningkatkan efisiensi dan produktivitas tim, menganalisa arah media entertainment agency."
          }
          image1={"/assets/IconVD.jpeg"}
          image2={"/assets/bahtiar.jpeg"}
          align="left"
        />
        <DivisionItem
          title={"INFOMATION TECHNOLOGY"}
          description={
            "membangun sistem IT diamnco, mengerjakan setiap project IT, membangun portofolio IT, membangun branding diamnco."
          }
          image1={"/assets/IconIT.PNG"}
          image2={"/assets/iki.jpg"}
        />
        <DivisionItem
          title={"CONTENT CREATOR"}
          description={
            "memproduksi konten yang akan dipasarkan, menganalisa target pasar, membangun branding, menyusun strategi konten diamnco dan konsumen."
          }
          image1={"/assets/IconCC.PNG"}
          image2={"/assets/henry.PNG"}
          align="left"
        />
        <DivisionItem
          title={"CREATIVE"}
          description={
            "menganalisa produk dan jasa apa yang perlu dihasilkan oleh diamnco, menentukan konsep produk dan jasa yang dihasilkan, menentukan script acara, mengerjakan project design graphic,"
          }
          image1={"/assets/IconDC.PNG"}
          image2={"/assets/sila.PNG"}
        />
        <DivisionItem
          title={"DIGITAL MARKETING"}
          description={
            "membangun kemitraan dengan pihak luar, menjaring konsumen potensial, membangun branding diamnco, meriset pasar sesuai target diamnco."
          }
          image1={"/assets/IconDM.PNG"}
          image2={"/assets/najwa.PNG"}
          align="left"
        />
        <div className="text-center my-10 ">
          <h2 className="text-3xl mb-3">Our Products</h2>
          <p>Product Offer from DIAM Production</p>
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
