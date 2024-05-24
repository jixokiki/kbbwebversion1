"use client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { useRouter } from "next/navigation"; // Menggunakan next/router bukan next/navigation
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useNavigation from "../hooks/useNavigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const ResetPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, setIsLoading } = useNavigation();
  const [toastMessage, setToastMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      let newErrors = {};
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email address is invalid";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      setErrors(newErrors);
  
      if (Object.keys(newErrors).length === 0) {
        // Cek apakah email sudah ada di Firestore
        const userDocRef = doc(db, "users", formData.email);
        const docSnap = await getDoc(userDocRef);
  
        if (docSnap.exists()) {
          // Jika pengguna sudah ada, update data pengguna
          await updateDoc(userDocRef, {
            fullName: formData.fullName,
            password: formData.password, // perhatikan bahwa menyimpan password di sini harus dilakukan dengan hati-hati, biasanya lebih baik hanya menyimpan hashed password atau menggunakan auth credential firebase.
            status: "online",
            timeStamp: serverTimestamp(),
          });
        } else {
          // Jika pengguna belum ada, buat pengguna baru
          const userData = {
            fullName: formData.fullName,
            role: "user",
            email: formData.email,
            password: formData.password,
            status: "online",
          };
  
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
  
          await setDoc(doc(db, "users", userCredential.user.uid), {
            ...userData,
            timeStamp: serverTimestamp(),
          });
        }
  
        // Setelah selesai, arahkan pengguna ke halaman utama
        router.push("/");
        setToastMessage(null);
      }
    } catch (error) {
      console.error("Error registering user:", error.message);
      let errorMessage = error.message;
      if (errorMessage === "Firebase: Error (auth/invalid-email).") {
        errorMessage = "Email yang anda masukkan salah";
      } else if (errorMessage === "Firebase: Error (auth/missing-password).") {
        errorMessage = "Password anda salah";
      } else if (errorMessage === "Firebase: Error (auth/invalid-credential).") {
        errorMessage = "Email atau password salah";
      }
      setToastMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="mt-10">
      <Navbar />
      <div className="py-24">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto rounded-xl md:border p-8 md:shadow-lg"
        >
          <h2 className="text-center text-2xl font-semibold mb-10">Reset Password</h2>
          <div className="mb-4">
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            {errors.fullName && (
              <p className="text-red-500">{errors.fullName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <div className="flex items-center justify-between gap-3 border border-gray-300 mt-1 p-2 w-full rounded-md focus:ring focus:ring-blue-200">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none"
              />
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {toastMessage && (
            <div className="toast toast-end">
              <div className="alert alert-error">
                <span>{toastMessage}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`bg-gray-200 ${
              isLoading ? "animate-pulse" : ""
            } transition-all duration-300 hover:bg-gray-900 hover:text-white px-6 py-4 rounded w-full`}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          <p className="mt-10">
            Already have an account?{" "}
            <Link href={"/sign-in"} className="text-indigo-500 hover:underline">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
