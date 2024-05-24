"use client";
import useAuth from "@/app/hooks/useAuth";
import NavbarAdmin from "@/components/NavbarAdmin";
import { db, storage } from "@/firebase/firebase";
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

const Product = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && userProfile.role === "user") {
      router.push("/");
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

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
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
    const uploadFile = async () => {
      const storageRef = ref(
        storage,
        "products/" +
          new Date().getTime() +
          file.name.replace(" ", "%20") +
          "UEU"
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
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDownloadUrl(downloadURL);
          });
        }
      );
    };
    file && uploadFile();
    return () => {
      unsub();
    };
  }, [file]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    // Collect user data and perform necessary operations
    const productData = {
      id: new Date().getTime() + title + "UEU",
      image: downloadUrl,
      title: title,
      description: description,
      category: category,
      price: price,
    };

    try {
      await setDoc(
        doc(db, "products", new Date().getTime() + productData.title + "UEU"),
        {
          ...productData,
          timeStamp: serverTimestamp(),
        }
      );
      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("fikom");
      setPrice("");
      document.getElementById("addProductModal").close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id, image) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setData(data.filter((item) => item.id !== id));

      const desertRef = ref(storage, image);
      await deleteObject(desertRef);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[87%] mx-auto mt-32">
      <NavbarAdmin />

      <div className="flex justify-between items-center gap-3 mb-10">
        <h1 className="text-3xl font-semibold mb-3">Product List</h1>
        <input
          type="text"
          placeholder="Search here"
          className="input input-bordered w-full max-w-xs"
        />
        <label className="form-control w-full max-w-xs">
          <select className="select select-bordered">
            <option>All</option>
            <option>Fikom</option>
            <option>Fasilkom</option>
            <option>DKV</option>
            <option>Fasilkom</option>
            <option>Baleho 1</option>
            <option>Baleho 2</option>
            <option>Baleho 3</option>
            <option>Baleho 4</option>
            <option>Baleho 5</option>
            <option>Baleho 6</option>
            <option>Baleho 7</option>
            <option>Baleho 8</option>
            <option>Baleho 9</option>
            <option>Baleho 10</option>
          </select>
        </label>
        <button
          className="btn bg-teal-600 hover:bg-teal-500 text-white"
          onClick={() => document.getElementById("addProductModal").showModal()}
        >
          Add Product
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
                  <label htmlFor="category">Kategori</label>
                  <select
                    name="category"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="select select-bordered w-full"
                  >
                    <option>fikom</option>
                    <option>fasilkom</option>
                    <option>dkv</option>
                    <option>baleho 1</option>
                    <option>baleho 2</option>
                    <option>baleho 3</option>
                    <option>baleho 4</option>
                    <option>baleho 5</option>
                    <option>baleho 6</option>
                    <option>baleho 7</option>
                    <option>baleho 8</option>
                    <option>baleho 9</option>
                    <option>baleho 10</option>
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

                <button
                  type="submit"
                  className={`w-full btn ${
                    percentage !== null && percentage < 100
                      ? "btn-disabled"
                      : "bg-teal-500"
                  }`}
                >
                  Submit
                </button>
              </div>
            </form>
            <div className="modal-action">
              <form method="dialog" className="flex gap-1">
                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    document.getElementById("addProductModal").close()
                  }
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Kategori</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {data &&
              data.map((product) => (
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
    </div>
  );
};

export default Product;
