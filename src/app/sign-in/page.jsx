"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useNavigation from "../hooks/useNavigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const SignIn = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email address is invalid";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      }
      setErrors(newErrors);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          status: "online",
        });
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          if (docSnap.data().role == "user") {
            router.push("/");
          } else if (docSnap.data().role == "admin") {
            router.push("/admin");
          }else if (docSnap.data().role == "gudang") {
            router.push("/gudang");
          }
          localStorage.setItem("userProfile", JSON.stringify(docSnap.data()));
        }
      }
    } catch (error) {
      console.log(error.message);
      let errorMessage = error.message;
      if (errorMessage == "Firebase: Error (auth/invalid-email).") {
        errorMessage = "Email yang anda masukkan salah";
      } else if ((errorMessage = "Firebase: Error (auth/missing-password).")) {
        errorMessage = "Password anda salah";
      } else if (
        (errorMessage = "Firebase: Error (auth/invalid-credential).")
      ) {
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
          <h2 className="text-center text-2xl font-semibold mb-10">Sign In</h2>
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
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          <p className="mt-10">
            Don't have an account?{" "}
            <Link href={"/sign-up"} className="text-indigo-500 hover:underline">
              Sign up here
            </Link>
          </p>
          <p className="mt-10">
            please reset your password!!{" "}
            <Link href={"/reset"} className="text-indigo-500 hover:underline">
              reset
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
