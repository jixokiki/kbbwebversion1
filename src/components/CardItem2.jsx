import React from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase/firebase";

const CardItem2 = ({ imageUrl, fakultas, judul, deskripsi, harga, handleSendToGudang }) => {
  const handleDownload = async () => {
    try {
      const imageRef = ref(storage, imageUrl);
      const downloadURL = await getDownloadURL(imageRef);
      const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

      const link = document.createElement('a');
      link.href = downloadURL;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={imageUrl} alt={judul} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{judul}</h2>
        <p>{deskripsi}</p>
        <p>Category: {fakultas}</p>
        <p>Price: {harga}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleDownload}>Download</button>
          <button className="btn btn-secondary" onClick={handleSendToGudang}>Send to Gudang</button>
        </div>
      </div>
    </div>
  );
};

export default CardItem2;
