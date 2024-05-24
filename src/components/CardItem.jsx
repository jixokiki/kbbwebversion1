import { numberToRupiah } from "@/utils/rupiah";
import React from "react";

const CardItem = ({
  imageUrl,
  judul,
  deskripsi,
  harga,
  fakultas,
  addToCart,
  removeFromCart,
  isInCart,
}) => {
  return (
    <div className="w-full rounded overflow-hidden shadow-lg">
      <img className="w-full h-44 object-cover" src={imageUrl} alt={judul} />
      <div className="px-6 py-3">
        {fakultas && (
          <p className="text-gray-400 font-semibold text-base mt-2 uppercase">
            {fakultas}
          </p>
        )}
        <div className=" text-xl mb-2">{judul}</div>
        <p className="text-gray-700 text-base">{deskripsi}</p>
        {harga && (
          <p className="text-red-600 text-base mt-2">{numberToRupiah(harga)}</p>
        )}
      </div>
      {/* <div className="px-6 py-3">
        {isInCart ? ( // ubah teks tombol berdasarkan properti inCart
          <button
            className="bg-red-500 hover:bg-red-600 text-white hover:text-white font-bold py-2 px-4 rounded"
            onClick={removeFromCart} // tambahkan event onClick removeFromCart
          >
            Remove From Cart
          </button>
        ) : (
          <button
            className="bg-gray-200 hover:bg-teal-500 text-gray-900 hover:text-white font-bold py-2 px-4 rounded"
            onClick={addToCart}
          >
            Add To Cart
          </button>
        )}
      </div> */}
    </div>
  );
};

export default CardItem;
