// const CardItem5 = ({
//     imageUrl,
//     fakultas,
//     judul,
//     deskripsi,
//     harga,
//     status,
//     timeStamp,
//     inCart,
//     addToCart,
//     removeFromCart,
//     isInCart,
//   }) => {
//     return (
//       <div className="card">
//         <img src={imageUrl} alt={judul} />
//         <div className="card-body">
//           <h2>{judul}</h2>
//           <p>{deskripsi}</p>
//           <p>{fakultas}</p>
//           <p>{harga}</p>
//           <p>{status}</p>
//           <p>{new Date(timeStamp?.toDate()).toLocaleString()}</p>
//           {/* {inCart ? (
//             <button onClick={removeFromCart}>Remove from Cart</button>
//           ) : (
//             <button onClick={addToCart}>Add to Cart</button>
//           )} */}
//         </div>
//       </div>
//     );
//   };
  
//   export default CardItem5;
  




// const CardItem5 = ({
//   imageUrl,
//   fakultas,
//   judul,
//   deskripsi,
//   harga,
//   status,
//   timeStamp,
//   inCart,
//   addToCart,
//   removeFromCart,
//   isInCart,
// }) => {
//   return (
//     <div className="card">
//       <img src={imageUrl} alt={judul} />
//       <div className="card-body">
//         <h2>{judul}</h2>
//         <p>{deskripsi}</p>
//         <p>{fakultas}</p>
//         <p>{harga}</p>
//         <p>{status}</p>
//         <p>{new Date(timeStamp?.toDate()).toLocaleString()}</p>
//         {/* Optional Add to Cart functionality */}
//         {/* {inCart ? (
//           <button onClick={removeFromCart}>Remove from Cart</button>
//         ) : (
//           <button onClick={addToCart}>Add to Cart</button>
//         )} */}
//       </div>
//     </div>
//   );
// };

// export default CardItem5;










import React from "react";

const CardItem5 = ({
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
  onPaymentAcc,
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
        {statusPemesanan === "pending" && (
          <button className="btn btn-success" onClick={onAcc}>
            Approve
          </button>
        )}
        {status === "mohon menunggu proses pengerjaan" && (
          <button className="btn btn-info" onClick={onPaymentAcc}>
            Payment Acc
          </button>
        )}
      </div>
    </div>
  );
};

export default CardItem5;







// // CardItem5.jsx
// import React from "react";

// const CardItem5 = ({
//   imageUrl,
//   fakultas,
//   judul,
//   deskripsi,
//   harga,
//   status,
//   timeStamp,
//   inCart,
//   handleApprovePayment, // Function to handle approval
// }) => {
//   return (
//     <div className="card">
//       <img src={imageUrl} alt={judul} />
//       <div className="card-body">
//         <h2>{judul}</h2>
//         <p>{deskripsi}</p>
//         <p>{fakultas}</p>
//         <p>{harga}</p>
//         <p>{status}</p>
//         <p>{new Date(timeStamp?.toDate()).toLocaleString()}</p>
//         {inCart ? (
//           <button onClick={() => handleApprovePayment(product.id)}>
//             Approve Payment
//           </button>
//         ) : (
//           <p>Payment Approved</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CardItem5;
