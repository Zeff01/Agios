import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Process Paddle webhook data here
      console.log("Received Paddle webhook data:", req.body);
      res.status(200).end();
    } catch (error) {
      console.error("Error handling Paddle webhook:", error);
      res.status(500).end("Internal server error");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
