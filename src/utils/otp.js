//   const generateOTP = () => {
//     // Menghasilkan kode OTP acak dengan panjang 6 digit
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   };

  // src/utils/otp.js

export const generateOTP = () => {
    // Generate OTP logic here
        // Menghasilkan kode OTP acak dengan panjang 6 digit
        return Math.floor(100000 + Math.random() * 900000).toString();
  };
  