// "use client";
// import React, { useEffect, useState } from "react";
// import useAuth from "@/app/hooks/useAuth";
// import useProduct from "@/app/hooks/useProduct";
// import CardItem3 from "@/components/CardItem3"; // Pastikan mengganti dengan komponen yang sesuai
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import { db, storage } from "@/firebase/firebase";
// import {
//   collection,
//   onSnapshot,
//   updateDoc,
//   serverTimestamp,
//   doc,
//   setDoc,
// } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useRouter } from "next/navigation";

// const Product = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();
//   const [searchInput, setSearchInput] = useState("");
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [assetNotification, setAssetNotification] = useState(false);
//   const [statusChanged, setStatusChanged] = useState(false);
//   const { isInCart, removeFromCart, addToCart } = useProduct();
//   const [file, setFile] = useState(null);
//   const [percentage, setPercentage] = useState(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [isProofChecking, setIsProofChecking] = useState(false); // State untuk menandakan sedang memeriksa bukti transfer
//   const [paymentProofs, setPaymentProofs] = useState([]); // State untuk menyimpan bukti transfer

//   useEffect(() => {
//     const unsubProduct = onSnapshot(collection(db, "products"), (snapshot) => {
//       let list = [];
//       snapshot.docs.forEach((doc) => {
//         list.push({ id: doc.id, ...doc.data() });
//       });
//       setData(list);
//       setFilteredData(list);
//     });

//     return () => {
//       unsubProduct();
//     };
//   }, []);

//   useEffect(() => {
//     const updatedFilteredData = data.filter(
//       (product) =>
//         product.category.toLowerCase().includes(searchInput) ||
//         product.title.toLowerCase().includes(searchInput)
//     );
//     setFilteredData(updatedFilteredData);
//   }, [data, searchInput]);

//   useEffect(() => {
//     const unsubProofs = onSnapshot(collection(db, "buktiTransfer"), (snapshot) => {
//       let proofs = [];
//       snapshot.docs.forEach((doc) => {
//         proofs.push({ id: doc.id, ...doc.data() });
//       });
//       setPaymentProofs(proofs);
//     });

//     return () => {
//       unsubProofs();
//     };
//   }, []);

//   const handleSearchInputChange = (e) => {
//     setSearchInput(e.target.value.toLowerCase());
//   };

//   const handleAddToCart = async (product) => {
//     addToCart(product);
//     try {
//       await updateDoc(doc(db, "products", product.id), {
//         status: "in cart",
//         statusPemesanan: "pending",
//       });

//       const paymentData = {
//         ...product,
//         timestamp: serverTimestamp(),
//         status: "pending",
//         statusPemesanan: "pending",
//         inCart: true,
//       };
//       await updateDoc(doc(db, "payments", product.id), paymentData);

//       setStatusChanged(true);
//       setAssetNotification(true);
//       setTimeout(() => {
//         setAssetNotification(false);
//       }, 5000);
//     } catch (error) {
//       console.error("Error updating status in Firestore: ", error);
//     }
//   };

//   const handleRemoveFromCart = async (product) => {
//     removeFromCart(product);
//     try {
//       await updateDoc(doc(db, "products", product.id), {
//         status: "available",
//         statusPemesanan: "unknown",
//       });

//       const paymentData = {
//         ...product,
//         timestamp: serverTimestamp(),
//         status: "removed",
//         statusPemesanan: "removed",
//         inCart: false,
//       };
//       await updateDoc(doc(db, "payments", product.id), paymentData);

//       setStatusChanged(true);
//       setAssetNotification(true);
//       setTimeout(() => {
//         setAssetNotification(false);
//       }, 5000);
//     } catch (error) {
//       console.error("Error updating status in Firestore: ", error);
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Pilih file terlebih dahulu!");
//       return;
//     }

//     const storageRef = ref(storage, `payment-proof/${file.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setPercentage(progress);
//       },
//       (error) => {
//         console.error(error);
//       },
//       () => {
//         // Upload berhasil, dapatkan URL download
//         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//           // Simpan informasi pembayaran ke Firestore
//           const paymentData = {
//             title: title,
//             description: description,
//             price: price,
//             proofUrl: downloadURL,
//             timestamp: serverTimestamp(),
//             statusPembayaranUpload: "mohon menunggu proses pengerjaan",
//           };

//           try {
//             // Simpan ke koleksi buktiTransfer
//             const docRef = await setDoc(
//               doc(collection(db, "buktiTransfer")),
//               paymentData
//             );
//             console.log("Informasi pembayaran berhasil disimpan!");
//             setTitle("");
//             setDescription("");
//             setPrice("");
//             setFile(null);
//             setPercentage(null);
//             setIsProofChecking(true); // Set state untuk menunjukkan sedang memeriksa bukti transfer
//             setTimeout(() => {
//               setIsProofChecking(false); // Reset state setelah beberapa waktu
//             }, 5000);
//             alert("Bukti transfer berhasil diunggah!");
//           } catch (error) {
//             console.error("Error adding document: ", error);
//           }
//         });
//       }
//     );
//   };

//   const handleApprove = async (id) => {
//     try {
//       const proofDocRef = doc(db, "buktiTransfer", id);
//       await updateDoc(proofDocRef, { statusPembayaranUpload: "bukti payment di acc" });
//       alert("Status berhasil diubah menjadi 'bukti payment di acc'");
//     } catch (error) {
//       console.error("Error updating status: ", error);
//       alert("Gagal mengubah status");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="p-8 md:p-24 mt-10">
//         <div className="flex justify-between mb-10">
//           <h2 className="text-3xl mb-3">Semua Produk</h2>
//           {statusChanged && (
//             <div className="notification-3xl mb-3">
//               Status berubah menjadi "available"
//             </div>
//           )}
//           {assetNotification && (
//             <div className="notification-3xl mb-3">Happy Hunting</div>
//           )}
//           <input
//             type="text"
//             className="input input-bordered"
//             value={searchInput}
//             onChange={handleSearchInputChange}
//             placeholder="Cari berdasarkan kategori atau judul"
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {filteredData.map((product) => (
//             <CardItem3
//               key={product.id}
//               imageUrl={product.image}
//               fakultas={product.category}
//               judul={product.title}
//               deskripsi={product.description}
//               harga={product.price}
//               status={product.status}
//               statusPemesanan={product.statusPemesanan}
//               inCart={product.inCart}
//               addToCart={() => handleAddToCart(product)}
//               removeFromCart={() => handleRemoveFromCart(product)}
//             />
//           ))}
//         </div>
//         <div className="mt-8">
//           <h2 className="text-2xl mb-3">Upload Bukti Transfer</h2>
//           <input type="file" onChange={handleFileChange} />
//           <button
//             onClick={handleUpload}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
//           >
//             Upload
//           </button>
//           {percentage !== null && (
//             <div className="mt-2">Uploading: {percentage}%</div>
//           )}
//           {isProofChecking && (
//             <div className="mt-2">Bukti transfer sedang dicek...</div>
//           )}
//           {paymentProofs.map((proof) => (
//               <div key={proof.id} className="bg-white p-4 mb-5 mt-5 shadow-md rounded-lg">
//                 <h3 className="text-xl font-semibold mb-2 px-3">{proof.title}</h3>
//                 <p className="text-gray-700 mb-2">{proof.description}</p>
//                 <p className="text-gray-700 mb-2">{`Price: ${proof.price}`}</p>
//                 <p className="text-gray-700 mb-2">{`Status: ${proof.statusPembayaranUpload}`}</p>
//                 <p className="text-gray-700 mb-2">{`Timestamp: ${proof.timestamp?.toDate().toLocaleString()}`}</p>
//               </div>
//             ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Product;





"use client"
import React, { useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import useProduct from "@/app/hooks/useProduct";
import CardItem3 from "@/components/CardItem3"; // Pastikan mengganti dengan komponen yang sesuai
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { db, storage } from "@/firebase/firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

const Product = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [assetNotification, setAssetNotification] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);
  const { isInCart, removeFromCart, addToCart } = useProduct();
  const [file, setFile] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isProofChecking, setIsProofChecking] = useState(false); // State untuk menandakan sedang memeriksa bukti transfer
  const [paymentProofs, setPaymentProofs] = useState([]); // State untuk menyimpan bukti transfer

  useEffect(() => {
    const unsubProduct = onSnapshot(collection(db, "products"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setData(list);
      setFilteredData(list);

      // Sinkronisasi data baru ke buktiTransfer
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const productData = change.doc.data();
          const buktiTransferRef = doc(db, "buktiTransfer", change.doc.id);

          // Cek apakah data sudah ada di buktiTransfer
          const buktiTransferSnapshot = await getDocs(query(collection(db, "buktiTransfer"), where("title", "==", productData.title)));

          if (buktiTransferSnapshot.empty) {
            // Data baru, tambahkan ke buktiTransfer
            const newPaymentData = {
              title: productData.title,
              description: productData.description,
              price: productData.price,
              proofUrl: "",
              timestamp: serverTimestamp(),
              statusPembayaranUpload: "mohon menunggu proses pengerjaan",
              productData: productData // Simpan semua data produk ke dalam buktiTransfer
            };

            await setDoc(buktiTransferRef, newPaymentData);
          }
        }
      });
    });

    return () => {
      unsubProduct();
    };
  }, []);

  useEffect(() => {
    const updatedFilteredData = data.filter(
      (product) =>
        product.category.toLowerCase().includes(searchInput) ||
        product.title.toLowerCase().includes(searchInput)
    );
    setFilteredData(updatedFilteredData);
  }, [data, searchInput]);

  useEffect(() => {
    const unsubProofs = onSnapshot(collection(db, "buktiTransfer"), (snapshot) => {
      let proofs = [];
      snapshot.docs.forEach((doc) => {
        proofs.push({ id: doc.id, ...doc.data() });
      });
      setPaymentProofs(proofs);
    });

    return () => {
      unsubProofs();
    };
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  const handleAddToCart = async (product) => {
    addToCart(product);
    try {
      await updateDoc(doc(db, "products", product.id), {
        status: "in cart",
        statusPemesanan: "pending",
      });

      const paymentData = {
        ...product,
        timestamp: serverTimestamp(),
        status: "pending",
        statusPemesanan: "pending",
        inCart: true,
      };
      await updateDoc(doc(db, "payments", product.id), paymentData);

      setStatusChanged(true);
      setAssetNotification(true);
      setTimeout(() => {
        setAssetNotification(false);
      }, 5000);
    } catch (error) {
      console.error("Error updating status in Firestore: ", error);
    }
  };

  const handleRemoveFromCart = async (product) => {
    removeFromCart(product);
    try {
      await updateDoc(doc(db, "products", product.id), {
        status: "available",
        statusPemesanan: "unknown",
      });

      const paymentData = {
        ...product,
        timestamp: serverTimestamp(),
        status: "removed",
        statusPemesanan: "removed",
        inCart: false,
      };
      await updateDoc(doc(db, "payments", product.id), paymentData);

      setStatusChanged(true);
      setAssetNotification(true);
      setTimeout(() => {
        setAssetNotification(false);
      }, 5000);
    } catch (error) {
      console.error("Error updating status in Firestore: ", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file terlebih dahulu!");
      return;
    }

    const storageRef = ref(storage, `payment-proof/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercentage(progress);
      },
      (error) => {
        console.error(error);
      },
      async () => {
        // Upload berhasil, dapatkan URL download
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Simpan informasi pembayaran ke Firestore
        const paymentData = {
          title: title,
          description: description,
          price: price,
          proofUrl: downloadURL,
          timestamp: serverTimestamp(),
          statusPembayaranUpload: "mohon menunggu proses pengerjaan",
        };

        try {
          // Simpan ke koleksi buktiTransfer
          await setDoc(doc(collection(db, "buktiTransfer")), paymentData);
          console.log("Informasi pembayaran berhasil disimpan!");

          // Clear input fields
          setTitle("");
          setDescription("");
          setPrice("");
          setFile(null);
          setPercentage(null);
          setIsProofChecking(true); // Set state untuk menunjukkan sedang memeriksa bukti transfer
          setTimeout(() => {
            setIsProofChecking(false); // Reset state setelah beberapa waktu
          }, 5000);
          alert("Bukti transfer berhasil diunggah!");
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    );
  };

  // const handleApprove = async (id) => {
  //   try {
  //     const proofDocRef = doc(db, "buktiTransfer", id);
  //     await updateDoc(proofDocRef, { statusPembayaranUpload: "bukti payment di acc" });
  //     alert("Status berhasil diubah menjadi 'bukti payment di acc'");
  //   } catch (error) {
  //     console.error("Error updating status: ", error);
  //     alert("Gagal mengubah status");
  //   }
  // };

  const handleApprove = async (id) => {
    try {
      const proofDocRef = doc(db, "buktiTransfer", id);
      const proofSnapshot = await getDoc(proofDocRef);
      const proofData = proofSnapshot.data();
  
      await updateDoc(proofDocRef, { 
        statusPembayaranUpload: proofData.statusPembayaranUpload === "acc" ? "acc" : "bukti payment di acc"
      });
  
      alert("Status berhasil diubah menjadi 'bukti payment di acc'");
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Gagal mengubah status");
    }
  };
  
  return (
    <div>
      <Navbar />
      <div className="p-8 md:p-24 mt-10">
        <div className="flex justify-between mb-10">
          <h2 className="text-3xl mb-3">Semua Produk</h2>
          {statusChanged && (
            <div className="notification-3xl mb-3">
              Status berubah menjadi "available"
            </div>
          )}
          {assetNotification && (
            <div className="notification-3xl mb-3">Happy Hunting</div>
          )}
          <input
            type="text"
            className="input input-bordered"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Cari berdasarkan kategori atau judul"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredData.map((product) => (
            <CardItem3
              key={product.id}
              imageUrl={product.image}
              fakultas={product.category}
              judul={product.title}
              deskripsi={product.description}
              harga={product.price}
              status={product.status}
              statusPemesanan={product.statusPemesanan}
              inCart={product.inCart}
              addToCart={() => handleAddToCart(product)}
              removeFromCart={() => handleRemoveFromCart(product)}
            />
          ))}
        </div>
        <div className="mt-8">
          <h2 className="text-3xl mb-3">Upload Bukti Transfer</h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="input input-bordered mb-3"
          />
          {file && (
            <progress value={percentage} max="100" className="mb-3"></progress>
          )}
          <input
            type="text"
            placeholder="Judul"
            className="input input-bordered mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Deskripsi"
            className="textarea textarea-bordered mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type="number"
            placeholder="Harga"
            className="input input-bordered mb-3"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleUpload}>
            Upload Bukti Transfer
          </button>
          {isProofChecking && (
            <div className="mt-3 text-green-500">
              Sedang memeriksa bukti transfer...
            </div>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-3xl mb-3">Bukti Transfer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paymentProofs.map((proof) => (
               <div key={proof.id} className="bg-white p-4 mb-5 mt-5 shadow-md rounded-lg">
                 <h3 className="text-xl font-semibold mb-2 px-3">{proof.title}</h3>
                 <p className="text-gray-700 mb-2">{proof.description}</p>
                 <p className="text-gray-700 mb-2">{`Price: ${proof.price}`}</p>
                 <p className="text-gray-700 mb-2">{`Status: ${proof.statusPembayaranUpload}`}</p>
                 <p className="text-gray-700 mb-2">{`Timestamp: ${proof.timestamp?.toDate().toLocaleString()}`}</p>
               </div>
             ))}
            {/* {paymentProofs.map((proof) => (
              <CardItem3
                key={proof.id}
                judul={proof.title}
                deskripsi={proof.description}
                harga={proof.price}
                statusPembayaranUpload={proof.statusPembayaranUpload}
                imageUrl={proof.proofUrl}
                isBuktiTransfer={true}
                approve={() => handleApprove(proof.id)}
              />
            ))} */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;

