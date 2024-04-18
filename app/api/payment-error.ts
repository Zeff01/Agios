// pages/api/payment-error.ts
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorResponse = {
  message: string;
  errorInfo?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse>
) {
  if (req.method === "POST") {
    const errorInfo = req.body;
    console.log("be goes here fail", req.body);
    console.log("Received payment error info:", errorInfo);

    res.status(200).json({ message: "Error logged successfully", errorInfo });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
