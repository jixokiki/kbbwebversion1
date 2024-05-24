"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setUserProfile(JSON.parse(localStorage.getItem("userProfile")));
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        setUser(null);
        localStorage.removeItem("userProfile");
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      status: "offline",
    });
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/sign-in");
        localStorage.removeItem("user");
        localStorage.removeItem("userProfile");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return { user, userProfile, handleLogout };
};

export default useAuth;
