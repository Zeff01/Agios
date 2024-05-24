// pages/api/paddle-get-subscription.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const PADDLE_VENDOR_ID = process.env.PADDLE_VENDOR_ID;
const PADDLE_VENDOR_AUTH_CODE = process.env.PADDLE_VENDOR_AUTH_CODE;

interface PaddleSubscriptionDetail {
  subscription_id: string;
  plan_id: string;
  status: string;
}

interface PaddleSubscriptionResponse {
  success: boolean;
  response: PaddleSubscriptionDetail;
  error: any;
}

async function fetchPaddleSubscription(
  subscriptionId: string
): Promise<PaddleSubscriptionResponse | null> {
  const url = `https://sandbox-api.paddle.com/subscriptions/${subscriptionId}`;
  try {
    console.log("PADDLE_VENDOR_AUTH_CODE:", PADDLE_VENDOR_AUTH_CODE);
    console.log("url:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PADDLE_VENDOR_AUTH_CODE}`, // Adjust based on actual API requirements
        "Content-Type": "application/json",
      },
    });

    const data: PaddleSubscriptionResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch subscription:", error);
    return null;
  }
}

export async function POST(req: any, res: NextApiResponse) {
  try {
    const { subscriptionId } = await req.json(); // Correctly extracting from body
    if (!subscriptionId) {
      return NextResponse.json(
        { message: "Missing subscription ID" },
        { status: 400 }
      );
    }

    const subscriptionData = await fetchPaddleSubscription(subscriptionId);
    console.log("subscriptionData:", subscriptionData);
    // if (!subscriptionData || !subscriptionData.success) {
    //   return NextResponse.json(
    //     { message: "Failed to retrieve subscription data" },
    //     { status: 500 }
    //   );
    // }
    return NextResponse.json({ message: subscriptionData }, { status: 200 });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
