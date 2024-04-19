import { NextResponse } from "next/server";

export async function POST(req: any, res: any) {
  if (req.method === "POST") {
    try {
      // Process Paddle webhook data here
      console.log("Received Paddle webhook data:", req.body);
      // Implement your processing logic here

      // Return a successful response
      return NextResponse.json(
        { message: "Webhook data received successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error handling Paddle webhook:", error);
      // Return an error response
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } else {
    // Return a method not allowed response for other HTTP methods
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
