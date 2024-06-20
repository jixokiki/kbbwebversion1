// import React, { useEffect, useState } from "react";
// import useAuth from "./useAuth";
// import {
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "@/firebase/firebase";

// const useProduct = () => {
//   const { user, userProfile } = useAuth();
//   const [cart, setCart] = useState([]);
//   const [data, setData] = useState([]);

//   // get product
//   useEffect(() => {
//     const unsubProduct = onSnapshot(
//       collection(db, "products"),
//       (snapshot) => {
//         let list = [];
//         snapshot.docs.forEach((doc) => {
//           list.push({ id: doc.id, ...doc.data() });
//         });
//         setData(list);
//       },
//       (error) => {
//         console.log(error);
//       }
//     );
//     return () => {
//       unsubProduct();
//     };
//   }, []);

//   // get cart
//   useEffect(() => {
//     const fetchCartData = () => {
//       const cartDoc = doc(db, "cart", user.uid);
//       const unsubCart = onSnapshot(
//         cartDoc,
//         (cartSnapshot) => {
//           if (cartSnapshot.exists()) {
//             const cartData = cartSnapshot.data();
//             setCart(cartData.pesanan);
//           } else {
//             setCart([]);
//           }
//         },
//         (error) => {
//           console.error("Error fetching cart data:", error);
//         }
//       );

//       return unsubCart; // Unsubscribe when component unmounts
//     };

//     if (user) {
//       const unsubscribe = fetchCartData();
//       return () => unsubscribe(); // Unsubscribe when user changes
//     }
//   }, [user]);

//   const addToCart = async (product) => {
//     const existingCartDoc = doc(db, "cart", user.uid);

//     try {
//       const cartSnapshot = await getDoc(existingCartDoc);
//       if (cartSnapshot.exists()) {
//         const existingCartData = cartSnapshot.data();
//         const updatedPesanan = [...existingCartData.pesanan, product];

//         await updateDoc(existingCartDoc, {
//           pesanan: updatedPesanan,
//           timeStamp: serverTimestamp(),
//         });
//       } else {
//         const cartData = {
//           userId: user.uid,
//           userName: userProfile.name,
//           timeStamp: serverTimestamp(),
//           pesanan: [product],
//         };

//         await setDoc(existingCartDoc, cartData);
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   };

//   const removeFromCart = async (productToRemove) => {
//     const existingCartDoc = doc(db, "cart", user.uid);

//     try {
//       const cartSnapshot = await getDoc(existingCartDoc);
//       if (cartSnapshot.exists()) {
//         const existingCartData = cartSnapshot.data();
//         const updatedPesanan = existingCartData.pesanan.filter(
//           (product) => product.id !== productToRemove.id
//         );

//         await updateDoc(existingCartDoc, {
//           pesanan: updatedPesanan,
//           timeStamp: serverTimestamp(),
//         });
//       }
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//     }
//   };

//   const isInCart = (productId) => {
//     return cart.some((product) => product.id === productId);
//   };

//   return { data, cart, isInCart, addToCart, removeFromCart, setData };
// };

// export default useProduct;


import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

const useProduct = () => {
  const { user, userProfile } = useAuth();
  const [cart, setCart] = useState([]);
  const [data, setData] = useState([]);

  // get product
  useEffect(() => {
    const unsubProduct = onSnapshot(
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
    return () => {
      unsubProduct();
    };
  }, []);

  // get cart
  useEffect(() => {
    const fetchCartData = () => {
      const cartDoc = doc(db, "cart", user.uid);
      const unsubCart = onSnapshot(
        cartDoc,
        (cartSnapshot) => {
          if (cartSnapshot.exists()) {
            const cartData = cartSnapshot.data();
            setCart(cartData.pesanan);
          } else {
            setCart([]);
          }
        },
        (error) => {
          console.error("Error fetching cart data:", error);
        }
      );

      return unsubCart; // Unsubscribe when component unmounts
    };

    if (user) {
      const unsubscribe = fetchCartData();
      return () => unsubscribe(); // Unsubscribe when user changes
    }
  }, [user]);

  const addToCart = async (product) => {
    const existingCartDoc = doc(db, "cart", user.uid);

    try {
      const cartSnapshot = await getDoc(existingCartDoc);
      if (cartSnapshot.exists()) {
        const existingCartData = cartSnapshot.data();
        const updatedPesanan = [...existingCartData.pesanan, product];

        await updateDoc(existingCartDoc, {
          pesanan: updatedPesanan,
          timeStamp: serverTimestamp(),
        });
      } else {
        const cartData = {
          userId: user.uid,
          userName: userProfile.name,
          timeStamp: serverTimestamp(),
          pesanan: [product],
        };

        await setDoc(existingCartDoc, cartData);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productToRemove) => {
    const existingCartDoc = doc(db, "cart", user.uid);

    try {
      const cartSnapshot = await getDoc(existingCartDoc);
      if (cartSnapshot.exists()) {
        const existingCartData = cartSnapshot.data();
        const updatedPesanan = existingCartData.pesanan.filter(
          (product) => product.id !== productToRemove.id
        );

        await updateDoc(existingCartDoc, {
          pesanan: updatedPesanan,
          timeStamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const isInCart = (productId) => {
    return cart.some((product) => product.id === productId);
  };

  const updateProductStatus = async (productId, status) => {
    const productDoc = doc(db, "products", productId);

    try {
      await updateDoc(productDoc, {
        status: status,
      });
      console.log(`Product status updated to ${status}`);
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  return { data, cart, isInCart, addToCart, removeFromCart, updateProductStatus };
};

export default useProduct;
