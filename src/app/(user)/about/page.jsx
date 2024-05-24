"use client";
import useAuth from "@/app/hooks/useAuth";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const About = () => {
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
      <div className="relative mt-20 md:mt-14">
        <Image
          src={"/assets/BG3.jpg"}
          width={1410 / 2}
          height={675 / 2}
          priority
          sizes="(max-width: 768px) 600px, 1410px"
          alt="about page"
          className="relative w-full h-[600px] md:h-screen object-cover object-center mx-auto"
        />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center flex flex-col gap-3">
          <h1 className="text-5xl font-extrabold text-gray-950">About</h1>
        </div>
      </div>
      <div className="p-8 md:p-24 flex flex-col gap-6 text-justify">
        <h2 className="font-bold text-3xl text-center md:text-left">VISI</h2>
        <p>
          Menjadi platform e-commerce terkemuka yang memungkinkan pelanggan
          untuk dengan mudah menjelajahi, menemukan, dan mendapatkan produk
          berkualitas tinggi, sambil memberikan pengalaman belanja yang tak
          tertandingi
        </p>
        <h2 className="font-bold text-3xl text-center md:text-left">MISI</h2>
        <p>
          UEU Asset memiliki sejumlah misi yang menjadi pilar strategis
          perusahaan.
          <br />
          <br />
          Misi pertama UEU Asset adalah memberikan keanekaragaman produk.
          Platform ini berkomitmen untuk menyediakan beragam produk berkualitas
          tinggi dari berbagai kategori. Ini bertujuan agar pelanggan dapat
          memenuhi segala kebutuhan belanja mereka dalam satu tempat,
          menciptakan kenyamanan dan kepuasan pelanggan.
          <br />
          <br />
          Inovasi teknologi merupakan fokus utama UEU Asset. Perusahaan terus
          mengadopsi dan mengintegrasikan teknologi terkini untuk meningkatkan
          fungsionalitas platform. Dengan demikian, UEU Asset memberikan
          pengalaman belanja online yang lancar, efisien, dan sesuai dengan
          perkembangan zaman.
          <br />
          <br />
          Pelayanan pelanggan yang unggul menjadi misi lainnya. UEU Asset
          berkomitmen untuk memberikan layanan pelanggan yang ramah, responsif,
          dan profesional. Hal ini dilakukan untuk memastikan kepuasan pelanggan
          dan membangun hubungan jangka panjang yang kuat.
          <br />
          <br />
          Keamanan dan privasi menjadi poin krusial dalam misi UEU Asset.
          Perusahaan menempatkan keamanan dan privasi pelanggan sebagai
          prioritas utama. Ini dilakukan dengan menerapkan standar keamanan
          tinggi dan kebijakan privasi yang transparan, memberikan kepercayaan
          kepada pelanggan.
          <br />
          <br />
          Kemitraan strategis dengan merek-merek terkemuka dan penjual
          terpercaya menjadi misi penting lainnya. UEU Asset berusaha membangun
          kemitraan yang kuat untuk menawarkan produk berkualitas tinggi dan
          harga yang bersaing.
          <br />
          <br />
          UEU Asset juga berkomitmen pada pembangunan berkelanjutan. Perusahaan
          aktif mempromosikan produk ramah lingkungan, mendukung keberlanjutan,
          dan berkontribusi pada masyarakat.
          <br />
          <br />
          Menggunakan data dan kecerdasan buatan, UEU Asset menciptakan
          pengalaman belanja yang dipersonalisasi. Perusahaan memahami kebutuhan
          dan preferensi pelanggan untuk memberikan layanan yang lebih relevan
          dan bermakna.
          <br />
          <br />
          UEU Asset tidak hanya berfokus pada pertumbuhan bisnis, tetapi juga
          pada keberlanjutan operasional. Efisiensi operasional menjadi misi
          penting untuk menciptakan keberlanjutan jangka panjang.
          <br />
          <br />
          Terakhir, UEU Asset berkomitmen pada keterlibatan masyarakat. Melalui
          partisipasi aktif dalam kegiatan dan inisiatif masyarakat, perusahaan
          menciptakan dampak positif dan membangun citra sebagai anggota
          masyarakat yang bertanggung jawab.
          <br />
          <br />
          Melalui misi-misi ini, UEU Asset berusaha untuk mencapai visinya
          sebagai pemimpin di industri e-commerce dengan memberikan nilai tambah
          bagi pelanggan, membangun kepercayaan, dan berkontribusi pada
          perkembangan positif masyarakat dan lingkungan.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
