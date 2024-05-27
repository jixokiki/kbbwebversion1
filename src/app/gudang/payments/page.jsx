"use client";
import useAuth from "@/app/hooks/useAuth";
import useProduct from "@/app/hooks/useProduct";
import CardItem3 from "@/components/CardItem3";
import Footer from "@/components/Footer";
import NavbarGudang from "@/components/NavbarGudang";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Payments = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [newPaymentNotification, setNewPaymentNotification] = useState(false);
  const { isInCart, removeFromCart, addToCart } = useProduct();

  useEffect(() => {
    if (user && userProfile.role === "user") {
      router.push("/");
    }
  }, [user, userProfile, router]);

  useEffect(() => {
    const unsubPayments = onSnapshot(
      collection(db, "payments"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        // Check if there are new payments added
        if (list.length > data.length) {
          setNewPaymentNotification(true);
          setTimeout(() => setNewPaymentNotification(false), 5000); // Hide notification after 5 seconds
        }

        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubPayments();
    };
  }, [data]);

  // Filter data based on category
  const filteredData =
    data && categoryFilter === "all"
      ? data
      : data.filter(
          (product) => product.category.toLowerCase() === categoryFilter
        );

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  // Update category filter based on search input
  useEffect(() => {
    const selectElement = document.querySelector(".select");
    selectElement.childNodes.forEach((option) => {
      if (option.value.toLowerCase().includes(searchInput)) {
        option.selected = true;
      }
    });
    setCategoryFilter(searchInput);
  }, [searchInput]);

  return (
    <div>
      <NavbarGudang />
      <div className="p-8 md:p-24 mt-10">
        <div className="flex justify-between mb-10">
          <h2 className="text-3xl mb-3">All Payments</h2>
          {newPaymentNotification && (
            <div className="notification text-green-500">
              New payment received!
            </div>
          )}
          <input
            type="text"
            className="input input-bordered"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(e) => setCategoryFilter(e.target.value.toLowerCase())}
          >
            <option value={"all"}>All</option>
            <option value={"fikom"}>Fikom</option>
            <option value={"dkv"}>DKV</option>
            <option value={"fasilkom"}>Fasilkom</option>
            <option value={"baleho 1"}>Baleho 1</option>
            <option value={"baleho 2"}>Baleho 2</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-6">
          {filteredData.map((product) => (
            <CardItem3
              key={product.id}
              imageUrl={product.image}
              fakultas={product.category}
              judul={product.title}
              deskripsi={product.description}
              harga={product.price}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payments;
