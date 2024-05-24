import midtransClient from "midtrans-client";
import { NextResponse } from "next/server";

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SECRET,
  clientKey: process.env.NEXT_PUBLIC_CLIENT,
});

export async function POST(request) {
  const { id, username, fullname, email, amount } = await request.json();
  let parameter = {
    transaction_details: {
      order_id: id,
      gross_amount: amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      user_name: username,
      fullname: fullname,
      email: email,
    },
  };

  const token = await snap.createTransaction(parameter).then((transaction) => {
    // transaction token
    let transactionToken = transaction.token;
    return transactionToken;
  });

  console.log(token);
  return NextResponse.json({ token });
}
