"use client"
import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot, query, updateDoc, doc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavbarAdmin from "@/components/NavbarAdmin";

const PaymentProofList = () => {
  const [paymentProofs, setPaymentProofs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "buktiTransfer")), (snapshot) => {
      const proofs = [];
      snapshot.forEach((doc) => {
        proofs.push({ id: doc.id, ...doc.data() });
      });
      setPaymentProofs(proofs);
    });

    return () => unsubscribe();
  }, []);

//   const handleApprove = async (id) => {
//     try {
//       const proofDocRef = doc(db, "buktiTransfer", id);
//       await updateDoc(proofDocRef, { statusPembayaranUpload: "bukti payment di acc", });
//       alert("Status berhasil diubah menjadi 'bukti payment di acc'");
//     } catch (error) {
//       console.error("Error updating status: ", error);
//       alert("Gagal mengubah status");
//     }
//   };

const handleApprove = async (id) => {
    try {
      const proofDocRef = doc(db, "buktiTransfer", id);
      await updateDoc(proofDocRef, { statusPembayaranUpload: "bukti payment di acc" });
  
      // Setelah mengubah status di buktiTransfer, sinkronkan perubahan dengan products
      const productQuery = query(collection(db, "products"), where("title", "==", proof.title));
      const productSnapshot = await getDocs(productQuery);
  
      if (!productSnapshot.empty) {
        productSnapshot.forEach(async (doc) => {
          const productDocRef = doc(db, "products", doc.id);
          await updateDoc(productDocRef, { statusPembayaranUpload: "bukti payment di acc" });
        });
      }
  
      alert("Status berhasil diubah menjadi 'bukti payment di acc'");
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Gagal mengubah status");
    }
  };
  

  return (
    <div>
      <NavbarAdmin />
      <div className="p-8 md:p-24 mt-10">
        <h2 className="text-3xl mb-8">Daftar Bukti Transfer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentProofs.map((proof) => (
            <div key={proof.id} className="bg-white p-4 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{proof.title}</h3>
              <p className="text-gray-700 mb-2">{proof.description}</p>
              <p className="text-gray-700 mb-2">{`Price: ${proof.price}`}</p>
              <img src={proof.proofUrl} alt="Payment Proof" className="w-full h-auto mb-4" />
              <p className="text-gray-700 mb-2">{`Status: ${proof.statusPembayaranUpload}`}</p>
              <p className="text-gray-700 mb-2">{`Timestamp: ${proof.timestamp.toDate().toLocaleString()}`}</p>
              {proof.statusPembayaranUpload === "mohon menunggu proses pengerjaan" && (
                <button
                  onClick={() => handleApprove(proof.id)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Approve Bukti Payment
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentProofList;
