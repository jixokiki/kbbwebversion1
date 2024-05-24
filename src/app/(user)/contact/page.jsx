"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import Footer from "@/components/Footer";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

const Contact = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
    }
  }, [user, userProfile, router]);

  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .sendForm(
        "service_i7yxw1b",
        "template_maz7s24",
        form.current,
        "5zCg9M6Gbc0oFFgN4"
      )
      .then(
        (result) => {
          console.log(result.text);
          setIsSending(false);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Pesan anda berhasil dikirim",
          });
        },
        (error) => {
          console.log(error.text);
          setIsSending(false);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Gagal mengirim pesan. Coba lagi nanti.",
          });
        }
      );
  };

  return (
    <div>
      <Navbar />
      <div className="relative">
        <Image
          src={"/assets/BG3.jpg"}
          width={1410 / 2}
          height={675 / 2}
          priority
          sizes="(max-width: 768px) 600px, 1410px"
          alt="Contact page"
          className="relative h-[600px] md:h-[560px] object-cover object-center mx-auto w-full"
        />
        <div className="absolute top-[250px] left-1/2 -translate-x-1/2 text-center flex flex-col gap-3">
          <h1 className="text-5xl font-extrabold text-zinc-900">Contact</h1>
        </div>
      </div>
      <div className="p-8 md:p-24">
        <h2 className="text-center text-3xl font-semibold mb-10">
          Send a message to us!
        </h2>
        <form
          ref={form}
          onSubmit={sendEmail}
          className="max-w-xl mx-auto p-5 md:p-10 bg-white shadow-md rounded-md border"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Nama
            </label>
            <input
              type="text"
              id="name"
              name="user_name"
              value={formData.name}
              onChange={handleChange}
              placeholder={user ? userProfile.name : "Isi nama anda disini..."}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="user_email"
              value={formData.email}
              onChange={handleChange}
              placeholder={
                user ? userProfile.email : "Isi email anda disini..."
              }
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-gray-700 font-semibold"
            >
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Isi pesan anda disini..."
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-gray-700 font-semibold"
            >
              Nomor HP
            </label>
            <input
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Isi no hp anda disini..."
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-gray-200 text-black py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-blue-200 ${
              isSending ? "animate-pulse" : ""
            }`}
          >
            {isSending ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
