// import { getDownloadURL, ref } from "firebase/storage";
// import { storage } from "@/firebase/firebase";

// const CardItem3 = ({ imageUrl, fakultas, judul, deskripsi, harga }) => {
//   const handleDownload = async () => {
//     try {
//       // Mendapatkan URL unduhan gambar dari Firebase Storage
//       const imageRef = ref(storage, imageUrl);
//       const downloadURL = await getDownloadURL(imageRef);

//       // Mendapatkan nama file dari URL unduhan
//       const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

//       // Melakukan pengunduhan gambar dengan nama file dari URL
//       const link = document.createElement('a');
//       link.href = downloadURL;
//       link.setAttribute('download', fileName); // Gunakan nama file dari URL
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading image:', error);
//     }
//   };

//   return (
//     <div>
//       <img src={imageUrl} alt="Bukti Transfer" />
//       <div>
//         <h3>{judul}</h3>
//         <p>{deskripsi}</p>
//         <p>{fakultas}</p>
//         <p>{harga}</p>
//       </div>
//       <button onClick={handleDownload} style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 20px', border: 'none', fontSize: '16px', cursor: 'pointer' }}>Download</button>
//     </div>
//   );
// };

// export default CardItem3;

// //YANG DIGUNAKAN SEBELUMNYA STATUS
// import { getDownloadURL, ref } from "firebase/storage";
// import { storage, db } from "@/firebase/firebase"; // import db from firebase config
// import { doc, updateDoc } from "firebase/firestore";

// const CardItem3 = ({ id, imageUrl, fakultas, judul, deskripsi, harga }) => {
//   const handleDownload = async () => {
//     try {
//       const imageRef = ref(storage, imageUrl);
//       const downloadURL = await getDownloadURL(imageRef);
//       const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

//       const link = document.createElement('a');
//       link.href = downloadURL;
//       link.setAttribute('download', fileName);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading image:', error);
//     }
//   };

//   const handleApprove = async () => {
//     try {
//       const productRef = doc(db, "payments", id); // reference to the specific document
//       await updateDoc(productRef, {
//         status: "mohon menunggu proses pengerjaan",
//       });
//       alert('Status updated successfully!');
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   return (
//     <div style={{ border: '1px solid #ddd', padding: '20px', margin: '10px' }}>
//       <img src={imageUrl} alt="Bukti Transfer" style={{ width: '100%', height: 'auto' }} />
//       <div>
//         <h3>{judul}</h3>
//         <p>{deskripsi}</p>
//         <p>{fakultas}</p>
//         <p>{harga}</p>
//       </div>
//       <div>
//         <button 
//           onClick={handleDownload} 
//           style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 20px', border: 'none', fontSize: '16px', cursor: 'pointer', marginRight: '10px' }}
//         >
//           Download
//         </button>
//         <button 
//           onClick={handleApprove} 
//           style={{ backgroundColor: '#008cba', color: 'white', padding: '10px 20px', border: 'none', fontSize: '16px', cursor: 'pointer' }}
//         >
//           Acc
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CardItem3;






// // CardItem3.jsx (example)

// import React from "react";

// const CardItem3 = ({
//   imageUrl,
//   fakultas,
//   judul,
//   deskripsi,
//   harga,
//   status,
//   statusPemesanan,
//   timestamp,
//   inCart,
//   handleApprove,
// }) => {
//   return (
//     <div className="card">
//       <img src={imageUrl} alt={judul} className="card-img-top" />
//       <div className="card-body">
//         <h5 className="card-title">{judul}</h5>
//         <p className="card-text">{deskripsi}</p>
//         <p className="card-text">{fakultas}</p>
//         <p className="card-text">{harga}</p>
//         <p className="card-text">Status Pemesanan: {getStatusPemesananLabel(statusPemesanan)}</p>
//         <p className="card-text">Status: {status}</p>
//         <p className="card-text">Timestamp: {new Date(timestamp?.seconds * 1000).toLocaleString()}</p>
//         {statusPemesanan === "acc" && (
//           <p className="card-text text-green-500 font-bold">Approved</p>
//         )}
//         <button className="btn btn-primary" onClick={handleApprove}>
//           Acc
//         </button>
//       </div>
//     </div>
//   );
// };

// const getStatusPemesananLabel = (statusPemesanan) => {
//   switch (statusPemesanan) {
//     case "pending":
//       return "Pending";
//     case "acc":
//       return "Approved";
//     case "rejected":
//       return "Rejected";
//     default:
//       return "Unknown";
//   }
// };

// export default CardItem3;



import React from "react";

const CardItem3 = ({
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
          {/* <button className="btn btn-success" onClick={onAcc}>
            Approve
          </button> */}
        {/* )} */}
      </div>
    </div>
  );
};

export default CardItem3;