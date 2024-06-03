"use client";
import useAuth from "@/app/hooks/useAuth";
import NavbarGudang from "@/components/NavbarGudang";
import { db, storage } from "@/firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
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
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [percentage, setPercentage] = useState(null);
  const [data, setData] = useState([]);
  const [warehouseDataKg, setWarehouseDataKg] = useState([]);
  const [warehouseDataPcs, setWarehouseDataPcs] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingWarehouseProduct, setEditingWarehouseProduct] = useState(null);
  const [unitType, setUnitType] = useState("kg");

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

    const warehouseKgUnsub = onSnapshot(
      collection(db, "warehouseKg"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setWarehouseDataKg(list);
      },
      (error) => {
        console.log(error);
      }
    );

    const warehousePcsUnsub = onSnapshot(
      collection(db, "warehousePcs"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setWarehouseDataPcs(list);
      },
      (error) => {
        console.log(error);
      }
    );

    const uploadFile = async () => {
      const storageRef = ref(
        storage,
        "products/" + new Date().getTime() + file.name.replace(" ", "%20") + "KBB"
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
      warehouseKgUnsub();
      warehousePcsUnsub();
    };
  }, [file]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const productData = {
      id: new Date().getTime() + productName + "KBB",
      date: new Date().toLocaleDateString(),
      productName,
      description,
      category,
      price,
      image: downloadUrl,
      timeStamp: serverTimestamp(), // Tambahkan serverTimestamp di sini
    };
  
    try {
      await setDoc(
        doc(
          db,
          "products",
          new Date().getTime() + productData.productName + "KBB"
        ),
        productData
      );
      setFile(null);
      setProductName("");
      setDescription("");
      setCategory("fikom");
      setPrice("");
      document.getElementById("addProductModal").close();
    } catch (error) {
      console.log(error);
    }
  };
  

  const calculateStock = (initialStock, stockIn, stockOut) => {
    return initialStock + stockIn - stockOut;
  };

  const handleAddWarehouseProduct = async (e) => {
    e.preventDefault();
    let initialStock = parseFloat(description);
    let stockIn = parseFloat(category);
    let stockOut = parseFloat(price);
  
    let totalStock = calculateStock(initialStock, stockIn, stockOut);
  
    const warehouseProductData = {
      id: new Date().getTime() + productName + (unitType === "kg" ? "WarehouseKg" : "WarehousePcs"),
      date: new Date().toLocaleDateString(),
      productName,
      stock: initialStock,
      stockIn,
      stockOut,
      totalStock,
      unitType,
      timeStamp: serverTimestamp(), // Tambahkan serverTimestamp di sini
    };
  
    try {
      await setDoc(
        doc(
          db,
          unitType === "kg" ? "warehouseKg" : "warehousePcs",
          warehouseProductData.id
        ),
        warehouseProductData
      );
      setFile(null);
      setProductName("");
      setDescription("");
      setCategory("");
      setPrice("");
      document.getElementById("addWarehouseProductModal").close();
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleDeleteWarehouseProduct = async (id, unit) => {
    try {
      await deleteDoc(doc(db, unit === "kg" ? "warehouseKg" : "warehousePcs", id));
      if (unit === "kg") {
        setWarehouseDataKg(warehouseDataKg.filter((item) => item.id !== id));
      } else {
        setWarehouseDataPcs(warehouseDataPcs.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateWarehouseProduct = async (e) => {
    e.preventDefault();
    const updatedWarehouseProductData = {
      productName,
      stock: parseFloat(description),
      stockIn: parseFloat(category),
      stockOut: parseFloat(price),
      timeStamp: serverTimestamp(),
      unitType,
    };

    try {
      await updateDoc(doc(db, unitType === "kg" ? "warehouseKg" : "warehousePcs", editingWarehouseProduct.id), {
        ...updatedWarehouseProductData,
      });
      setFile(null);
      setProductName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setEditingWarehouseProduct(null);
      document.getElementById("updateWarehouseProductModal").close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[87%] mx-auto mt-32">
      <NavbarGudang />

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
          Add New Product
        </button>
        <button
          className="btn bg-teal-600 hover:bg-teal-500 text-white"
          onClick={() => document.getElementById("addWarehouseProductModal").showModal()}
        >
          Add New Warehouse Product
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product Name</th>
              <th>Unit Type</th>
              <th>Stock</th>
              <th>Stock In</th>
              <th>Stock Out</th>
              <th>Total Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouseDataKg.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.productName}</td>
                <td>{item.unitType}</td>
                <td>{item.stock}</td>
                <td>{item.stockIn}</td>
                <td>{item.stockOut}</td>
                <td>{item.totalStock}</td>
                <td>
                  <button
                    className="btn bg-orange-500 hover:bg-orange-400 text-white"
                      onClick={() => {
                        setEditingWarehouseProduct(item);  // Pastikan item disesuaikan dengan object data di tabel
                        document.getElementById("updateWarehouseProductModal").showModal();
                      }}
                  >
                  Edit
                  </button>

                  <button
                    className="btn bg-red-600 hover:bg-red-500 text-white"
                    onClick={() => handleDeleteWarehouseProduct(item.id, "kg")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {warehouseDataPcs.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.productName}</td>
                <td>{item.unitType}</td>
                <td>{item.stock}</td>
                <td>{item.stockIn}</td>
                <td>{item.stockOut}</td>
                <td>{item.totalStock}</td>
                <td>
                  <button
                    className="btn bg-orange-500 hover:bg-orange-400 text-white"
                    onClick={() => {
                      setEditingWarehouseProduct(item);
                      document.getElementById("updateWarehouseProductModal").showModal();
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn bg-red-600 hover:bg-red-500 text-white"
                    onClick={() => handleDeleteWarehouseProduct(item.id, "pcs")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="addProductModal" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h3 className="font-bold text-lg">Add New Product</h3>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input file-input-bordered w-full my-2"
          />
          <button className="btn bg-teal-600 hover:bg-teal-500 text-white" onClick={handleAddProduct}>
            Submit
          </button>
        </form>
      </dialog>

      <dialog id="addWarehouseProductModal" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h3 className="font-bold text-lg">Add New Warehouse Product</h3>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <input
            type="number"
            placeholder="Initial Stock"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <input
            type="number"
            placeholder="Stock In"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <input
            type="number"
            placeholder="Stock Out"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <label className="label cursor-pointer">
            <span className="label-text">Unit Type</span>
            <select value={unitType} onChange={(e) => setUnitType(e.target.value)} className="select select-bordered">
              <option value="kg">Kg</option>
              <option value="pcs">Pcs</option>
            </select>
          </label>
          <button className="btn bg-teal-600 hover:bg-teal-500 text-white" onClick={handleAddWarehouseProduct}>
            Submit
          </button>
        </form>
      </dialog>

      <dialog id="updateWarehouseProductModal" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h3 className="font-bold text-lg">Update Warehouse Product</h3>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <input
            type="number"
            placeholder="Initial Stock"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <input
            type="number"
            placeholder="Stock In"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <input
            type="number"
            placeholder="Stock Out"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered w-full my-2"
          />
          <button className="btn bg-teal-600 hover:bg-teal-500 text-white" onClick={handleUpdateWarehouseProduct}>
            Submit
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default Product;
