import type { NextApiRequest, NextApiResponse } from "next";

type SuccessResponse = {
  message: string;
  paymentData?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse>
) {
  if (req.method === "POST") {
    const paymentData = req.body;
    console.log("be goes here success", req.body);
    console.log("Received payment success data:", paymentData);

    res
      .status(200)
      .json({ message: "Payment recorded successfully", paymentData });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
