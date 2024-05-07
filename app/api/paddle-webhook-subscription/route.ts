import { NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

interface WebhookData {
  data: {
    id: string;
    origin: string;
    status: string;
    customer_id: string;
    currency_code: string;
    subscription_id: string;
    custom_data: {
      userId: string;
      credits: number;
      plan_type: string;
      paymentDate: Date;
      expirationDate: Date;
      isUnlimited: boolean;
      autonomyMode: boolean;
      deepWebResearch: boolean;
      futureScheduling: boolean;
      voiceCommunication: boolean;
      userEmail: string;
    };
  };
  event_id: string;
  event_type: string;
  notification_id: string;
}

const supabase = createClient();

export async function POST(req: any, res: NextApiResponse) {
  try {
    const webhookData: WebhookData = await req.json();
    console.log("Received webhook data:", webhookData);

    await handleEvent(webhookData);

    console.log("Webhook data processed accordingly.");
    return NextResponse.json(
      { message: "Webhook data received and processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleEvent(webhookData: WebhookData) {
  const { event_type, data } = webhookData;
  const { id: subscription_id, status, customer_id, custom_data } = data;

  const userPlanData = {
    customer_id,
    subscription_id,
    status: status === "active" ? "active" : status,
    ...custom_data,
  };

  // Check if the user plan exists to decide on insert or update
  const { data: existingUserPlan, error: selectError } = await supabase
    .from("user_plan")
    .select("customer_id")
    .eq("customer_id", customer_id)
    .maybeSingle();

  if (selectError) {
    console.error("Error fetching user plan:", selectError);
    throw new Error(`Failed to retrieve user plan: ${selectError.message}`);
  }

  if (!existingUserPlan) {
    console.log("No existing user plan found. Creating a new one.");
    const { error } = await supabase.from("user_plan").insert(userPlanData);
    if (error) {
      console.error("Failed to insert user plan:", error);
      throw error;
    }
    console.log("New user plan created.");
  } else {
    console.log(`Handling ${event_type} for existing user plan.`);
    const { error } = await supabase
      .from("user_plan")
      .update(userPlanData)
      .eq("customer_id", customer_id);
    if (error) {
      console.error("Failed to update user plan:", error);
      throw error;
    }
    console.log("User plan updated with data:", userPlanData);
  }
}
