// _app.js (atau MyApp.js)

import { CartProvider } from '@/context/CartContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Navbar /> {/* Navbar ditambahkan di sini */}
      <Component {...pageProps} />
      <Footer /> {/* Footer ditambahkan di sini */}
    </CartProvider>
  );
}

export default MyApp;
