// import { numberToRupiah } from "@/utils/rupiah";
// import React from "react";

// const CardItem = ({
//   imageUrl,
//   judul,
//   deskripsi,
//   harga,
//   fakultas,
//   addToCart,
//   removeFromCart,
//   isInCart,
// }) => {
//   return (
//     <div className="w-full rounded overflow-hidden shadow-lg">
//       <img className="w-full h-44 object-cover" src={imageUrl} alt={judul} />
//       <div className="px-6 py-3">
//         {fakultas && (
//           <p className="text-gray-400 font-semibold text-base mt-2 uppercase">
//             {fakultas}
//           </p>
//         )}
//         <div className=" text-xl mb-2">{judul}</div>
//         <p className="text-gray-700 text-base">{deskripsi}</p>
//         {harga && (
//           <p className="text-red-600 text-base mt-2">{numberToRupiah(harga)}</p>
//         )}
//       </div>
//       <div className="px-6 py-3">
//         {isInCart ? ( // ubah teks tombol berdasarkan properti inCart
//           <button
//             className="bg-red-500 hover:bg-red-600 text-white hover:text-white font-bold py-2 px-4 rounded"
//             onClick={removeFromCart} // tambahkan event onClick removeFromCart
//           >
//             Remove From Cart
//           </button>
//         ) : (
//           <button
//             className="bg-gray-200 hover:bg-teal-500 text-gray-900 hover:text-white font-bold py-2 px-4 rounded"
//             onClick={addToCart}
//           >
//             Add To Cart
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CardItem;

// import React from "react";
// // import Image from "next/image";

// const CardItem = ({ imageUrl, title, description, price }) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col md:flex-row items-center md:items-start">
//       <img
//         src={imageUrl}
//         alt={title}
//         width={150}
//         height={150}
//         className="w-32 h-32 object-cover mr-4"
//       />
//       <div className="flex-1">
//         <div className="mb-2">
//           <h3 className="text-lg font-bold">{title}</h3>
//           <p className="text-gray-600">{description}</p>
//         </div>
//         <div className="flex justify-between items-center mb-2">
//           <p className="text-gray-800 font-semibold">Variasi: 40</p>
//           <p className="text-gray-800 font-semibold">Rp{price}</p>
//         </div>
//         <div className="flex justify-between items-center">
//           <p className="text-gray-800 font-semibold">1</p>
//           <p className="text-gray-800 font-semibold">Rp{price}</p>
//         </div>
//         <div className="flex justify-between items-center mt-2">
//           <button className="text-red-500">Hapus</button>
//           <button className="text-blue-500">Produk Serupa</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardItem;


// //YANG DIGUNAKAN UNTUK STATUS
// import React from "react";

// const CardItem = ({
//   imageUrl,
//   fakultas,
//   judul,
//   deskripsi,
//   harga,
//   status,
//   inCart,
//   addToCart,
//   removeFromCart,
//   isInCart,
//   showButtons = true, // Tambahkan prop showButtons dengan default true
// }) => {
//   return (
//     <div className="card">
//       <img src={imageUrl} alt={judul} className="card-img-top" />
//       <div className="card-body">
//         <h5 className="card-title">{judul}</h5>
//         <p className="card-text">{deskripsi}</p>
//         <p className="card-text">{fakultas}</p>
//         <p className="card-text">{harga}</p>
//         <p className="card-text">{status}</p>
//         <p className="card-text">
//           Status: {inCart ? "In Cart" : "Available"}
//         </p>
//         {showButtons && ( // Tambahkan kondisi untuk menampilkan tombol
//           inCart ? (
//             <button className="btn btn-danger" onClick={removeFromCart}>
//               Remove from Cart
//             </button>
//           ) : (
//             <button className="btn btn-primary" onClick={addToCart}>
//               Add to Cart
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default CardItem;



// import React from "react";

// const CardItem = ({
//   imageUrl,
//   fakultas,
//   judul,
//   deskripsi,
//   harga,
//   statusPemesanan,
//   inCart,
//   addToCart,
//   removeFromCart,
//   onAcc,
//   isInCart,
// }) => {
//   const getStatusPemesananLabel = (statusPemesanan) => {
//     switch (statusPemesanan) {
//       case "pending":
//         return "Pending";
//       case "acc":
//         return "Approved";
//       case "rejected":
//         return "Rejected";
//       default:
//         return "Unknown";
//     }
//   };

//   return (
//     <div className="card">
//       <img src={imageUrl} alt={judul} className="card-img-top" />
//       <div className="card-body">
//         <h5 className="card-title">{judul}</h5>
//         <p className="card-text">{deskripsi}</p>
//         <p className="card-text">{fakultas}</p>
//         <p className="card-text">{harga}</p>
//         <p className="card-text">Status Pemesanan: {getStatusPemesananLabel(statusPemesanan)}</p>
//         <p className="card-text">{inCart ? "In Cart" : "Not In Cart"}</p>
//         {inCart ? (
//           <button className="btn btn-danger" onClick={removeFromCart}>
//             Remove from Cart
//           </button>
//         ) : (
//           <>
//             <button className="btn btn-primary" onClick={addToCart}>
//               Add to Cart
//             </button>
//           </>
//         )}
//                     <button className="btn btn-success ml-2" onClick={onAcc}>
//               Acc
//             </button>
//       </div>
//     </div>
//   );
// };

// export default CardItem;


// import React from "react";

// const CardItem = ({
//   imageUrl,
//   fakultas,
//   judul,
//   deskripsi,
//   harga,
//   status,
//   statusPemesanan,
//   inCart,
//   addToCart,
//   removeFromCart,
//   onAcc,
//   isInCart,
//   statusChanged,
// }) => {
//   const getStatusPemesananLabel = (statusPemesanan) => {
//     switch (statusPemesanan) {
//       case "pending":
//         return "Pending";
//       case "acc":
//         return "Approved";
//       case "rejected":
//         return "Rejected";
//       default:
//         return "Unknown";
//     }
//   };

//   return (
//     <div className="card">
//       <img src={imageUrl} alt={judul} className="card-img-top" />
//       <div className="card-body">
//         <h5 className="card-title">{judul}</h5>
//         <p className="card-text">{deskripsi}</p>
//         <p className="card-text">{`Price: ${harga}`}</p>
//         <p className="card-text">{`Category: ${fakultas}`}</p>
//         {statusChanged && (
//           <p className="card-text">Status: Available</p>
//         )}
//         {!statusChanged && (
//           <p className="card-text">Status: {status}</p>
//         )}
//         <p className="card-text">
//           Status Pemesanan: {getStatusPemesananLabel(statusPemesanan)}
//         </p>
//         {inCart ? (
//           <button className="btn btn-danger" onClick={removeFromCart}>
//             Remove from Cart
//           </button>
//         ) : (
//           <button className="btn btn-primary" onClick={addToCart}>
//             Add to Cart
//           </button>
//         )}
//         {statusPemesanan === "pending" && (
//           <button className="btn btn-success" onClick={onAcc}>
//             Approve
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CardItem;




import React from "react";

const CardItem = ({
  imageUrl,
  fakultas,
  judul,
  deskripsi,
  harga,
  status,
  statusPemesanan,
  inCart,
  addToCart,
  removeFromCart,
  onAcc,
  isInCart,
  statusChanged,
}) => {
  const getStatusPemesananLabel = (statusPemesanan) => {
    switch (statusPemesanan) {
      case "pending":
        return "Pending";
      case "acc":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="card">
      <img src={imageUrl} alt={judul} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{judul}</h5>
        <p className="card-text">{deskripsi}</p>
        <p className="card-text">{`Price: ${harga}`}</p>
        <p className="card-text">{`Category: ${fakultas}`}</p>
        {statusChanged && (
          <p className="card-text">Status: Available</p>
        )}
        {!statusChanged && (
          <p className="card-text">Status: {status}</p>
        )}
        <p className="card-text">
          Status Pemesanan: {getStatusPemesananLabel(statusPemesanan)}
        </p>
        {inCart ? (
          <button className="btn btn-danger" onClick={removeFromCart}>
            Remove from Cart
          </button>
        ) : (
          <button className="btn btn-primary" onClick={addToCart}>
            Add to Cart
          </button>
        )}
        {/* {statusPemesanan === "pending" && ( */}
          <button className="btn btn-success" onClick={onAcc}>
            Approve
          </button>
        {/* )} */}
      </div>
    </div>
  );
};

export default CardItem;







