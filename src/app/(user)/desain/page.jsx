"use client";
import useAuth from "@/app/hooks/useAuth";
import NavbarAdmin from "@/components/NavbarAdmin";
import { db, storage } from "@/firebase/firebase";
import Navbar from "@/components/Navbar";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useProduct from "@/app/hooks/useProduct";

const Desain = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
    }
  }, [user, userProfile, router]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("fikom");
  const [price, setPrice] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [percentage, setPercentage] = useState(null);
  const [data, setData] = useState([]);
  const { isInCart, removeFromCart, addToCart, cart, totalPrice } = useProduct();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "desain"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_CLIENT;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(
        storage,
        "desain/" +
          new Date().getTime() +
          file.name.replace(" ", "%20") +
          "KBB"
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentage(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const uploadFileTransfer = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(
        storage,
        "payments/" +
          new Date().getTime() +
          file.name.replace(" ", "%20") +
          "KBB"
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentage(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const generateWhatsAppMessage = () => {
    const message = cart
      .map((item) => `- Pesanan ${item.title}: ${numberToRupiah(item.price)}`)
      .join("\n");
    const total = numberToRupiah(totalPrice);
    return `*Pesanan Baru KBB Assets*\n-------------------------------------\nUser\nNama : _${userProfile.name}_\nEmail : _${userProfile.email}_\n-------------------------------------\nDetail pesanan\n-------------------------------------\n${message}\n-------------------------------------\n*Total*: ${total}`;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const downloadURL = await uploadFile(file);
      const productData = {
        id: new Date().getTime() + user.uid + "DESAIN",
        image: downloadURL,
        title: title,
        description: description,
        category: category,
        price: price,
      };

      await setDoc(doc(db, "desain", productData.id), {
        ...productData,
        timeStamp: serverTimestamp(),
      });

      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("fikom");
      setPrice("");
      setDownloadUrl("");
      setPercentage(null);
      alert("Desain berhasil ditambahkan!");
      document.getElementById("addProductModal").close();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsPaymentLoading(true);

    try {
      const downloadURL = await uploadFile(file);

      const transactionDetails = {
        order_id: `ORDER-${new Date().getTime()}`,
        gross_amount: totalPrice,
      };

      const customerDetails = {
        first_name: userProfile.name,
        email: userProfile.email,
      };

      const itemDetails = cart.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: 1,
        name: item.title,
      }));

      const paymentData = {
        transaction_details: transactionDetails,
        customer_details: customerDetails,
        item_details: itemDetails,
      };

      const response = await fetch("/api/createTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.token) {
        window.snap.pay(result.token, {
          onSuccess: async (result) => {
            try {
              await setDoc(
                doc(db, "payments", new Date().getTime() + user.uid + "KKB"),
                {
                  id: new Date().getTime() + user.uid + "KKB",
                  image: downloadURL,
                  title: "Payment Proof",
                  user: userProfile.name,
                  email: userProfile.email,
                  amount: totalPrice,
                  transactionResult: result,
                  timeStamp: serverTimestamp(),
                }
              );
              setFile(null);
              alert("Pembayaran berhasil dilakukan!");
              document.getElementById("paymentModal").close();
            } catch (error) {
              console.log(error);
            }
          },
          onPending: (result) => {
            alert("Pembayaran Anda tertunda.");
          },
          onError: (result) => {
            alert("Pembayaran gagal.");
          },
          onClose: () => {
            alert("Anda menutup jendela pembayaran.");
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleDelete = async (id, image) => {
    try {
      await deleteDoc(doc(db, "desain", id));
      setData(filteredData.filter((item) => item.id !== id));

      const desertRef = ref(storage, image);
      await deleteObject(desertRef);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadPaymentProof = async (e) => {
    e.preventDefault();

    try {
      const downloadURL = await uploadFileTransfer(file);
      const productData = {
        id: new Date().getTime() + user.uid + "Bukti Transfer",
        image: downloadURL,
        title: title,
        description: description,
        category: category,
        price: price,
      };

      await setDoc(doc(db, "payments", productData.id), {
        ...productData,
        timeStamp: serverTimestamp(),
      });

      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("fikom");
      setPrice("");
      setDownloadUrl("");
      setPercentage(null);
      alert("Bukti Payment berhasil ditambahkan!");
      document.getElementById("addProductModal").close();
    } catch (error) {
      console.log(error);
    }
  };

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
    // Menyaring produk berdasarkan kategori yang dipilih
  const filteredData =
    data && categoryFilter === "all"
      ? data
      : data.filter(
          (product) => product.category.toLowerCase() === categoryFilter
        );

  // Fungsi untuk memperbarui state pencarian ketika nilai input berubah
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };
  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value.toLowerCase());
  };

    // Fungsi untuk memilih opsi dropdown sesuai dengan input pencarian
    useEffect(() => {
      const selectElement = document.querySelector(".select");
      // Melakukan perulangan pada setiap opsi dropdown
      selectElement.childNodes.forEach((option) => {
        if (option.value.toLowerCase().includes(searchInput)) {
          // Jika nilai opsi cocok dengan input pengguna, opsi tersebut akan dipilih
          option.selected = true;
        }
      });
      // Memperbarui state kategori filter sesuai dengan input pencarian
      setCategoryFilter(searchInput);
    }, [searchInput]);

  return (
    <div className="w-[100%] mx-auto mt-32">
      <Navbar />
      <div className=" w-[90%] flex justify-between items-center gap-3 mb-10">
        <h1 className="w[50%] mx-auto text-3xl font-semibold mb-3">Paddy List</h1>
          <input
            type="text"
            className="input input-bordered"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={handleCategoryFilterChange}
            value={categoryFilter}
          >
            <option value="all">All</option>
            <option value="3kg">3 Kg</option>
            <option value="5kg">5 Kg</option>
            <option value="10kg">10 Kg</option>
            <option value="15kg">15 Kg</option>
            <option value="20kg">20 Kg</option>
            <option value="25kg">25 Kg</option>
          </select>


        <button
          className="btn bg-teal-600 hover:bg-teal-500 text-white"
          onClick={() => document.getElementById("addProductModal").showModal()}
        >
          Add Desain
        </button>
        {/* Modal add user */}
        <dialog id="addProductModal" className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-xl">Add Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="py-4">
                <div className="flex flex-col gap-3 mb-3">
                  <label htmlFor="image">Image</label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  {percentage !== null && percentage < 100 ? (
                    <progress
                      className="progress progress-accent w-56"
                      value={percentage}
                      max="100"
                    ></progress>
                  ) : (
                    percentage === 100 && (
                      <div className="text-green-500 font-semibold">
                        Upload Completed
                      </div>
                    )
                  )}
                </div>
                <div className="flex flex-col gap-3 mb-3">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Masukkan judul"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="input input-bordered w-full "
                  />
                </div>
                <div className="flex flex-col gap-3 mb-3">
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    placeholder="Masukkan judul"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="textarea textarea-accent w-full"
                  ></textarea>
                </div>
                <div className="flex flex-col gap-3 mb-3">
                  <label htmlFor="category">Category</label>
                  <select
                    name="category"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="select select-bordered w-full "
                  >
                    <option value="3Kg">3 Kg</option>
                    <option value="5Kg ">5 Kg</option>
                    <option value="10Kg">10 Kg</option>
                    <option value="15Kg">15 Kg</option>
                    <option value="20Kg">20 Kg</option>
                    <option value="25Kg">25 Kg</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3 mb-3">
                  <label htmlFor="price">Price</label>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    placeholder="Masukkan harga"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="input input-bordered w-full "
                  />
                </div>
              </div>
              <div className="modal-action">
                <button className="btn" type="submit">
                  Add
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => document.getElementById("addProductModal").close()}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>

      <div className="overflow-x-auto ">
        <table className="table">
          <thead>
            <tr>
              <th>Bukti Transfer</th>
              <th>Title</th>
              <th>Description</th>
              <th>Kategori</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData &&
              filteredData.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={product.image}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{product.title}</td>
                  <td>{product.description}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        isInCart(product)
                          ? removeFromCart(product)
                          : addToCart(product)
                      }
                    >
                      {isInCart(product) ? "Remove from Cart" : "Add to Cart"}
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDelete(product.id, product.image)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-5 right-5">
        <button
          className={`btn btn-primary ${isPaymentLoading ? "loading" : ""}`}
          onClick={() => document.getElementById("paymentModal").showModal()}
        >
          {isPaymentLoading ? "Processing..." : `Upload Payment Proof`}
        </button>
      </div>

      {/* Modal for payment proof */}
      <dialog id="paymentModal" className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-xl">Upload Payment Proof</h3>
          <form onSubmit={handleUploadPaymentProof}>
            <div className="py-4">
              <div className="flex flex-col gap-3 mb-3">
                <label htmlFor="paymentProof">Payment Proof</label>
                <input
                  type="file"
                  name="paymentProof"
                  id="paymentProof"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {percentage !== null && percentage < 100 ? (
                  <progress
                    className="progress progress-accent w-56"
                    value={percentage}
                    max="100"
                  ></progress>
                ) : (
                  percentage === 100 && (
                    <div className="text-green-500 font-semibold">
                      Upload Completed
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" type="submit">
                Submit
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => document.getElementById("paymentModal").close()}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

const numberToRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

export default Desain;




