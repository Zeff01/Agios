import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

interface WebhookData {
  data: {
    id: string;
    origin: string;
    status: string;
    customer_id: string;
    currency_code: string;
    details?: {
      totals: {
        total: number;
      };
      line_items: {
        price_id: string;
        quantity: number;
      }[];
    };
    custom_data: {
      credits: number;
      plan_type: string;
      isUnlimited: boolean;
      autonomyMode: boolean;
      deepWebResearch: boolean;
      futureScheduling: boolean;
      voiceCommunication: boolean;
      userId: string;
      userEmail: string;
    };
  };
  event_id: string;
  event_type: string;
  notification_id: string;
}

const supabase = createClient();

async function processWebhookData(webhookData: WebhookData) {
  const {
    id: transaction_id,
    origin,
    status,
    customer_id,
    currency_code,
    details,
    custom_data,
  } = webhookData.data;

  const paymentDate = new Date();
  const expirationDate = new Date();
  expirationDate.setMonth(expirationDate.getMonth() + 1);

  const supabaseData = {
    transaction_id,
    origin,
    status,
    customer_id,
    currency_code,
    event_id: webhookData.event_id,
    event_type: webhookData.event_type,
    notification_id: webhookData.notification_id,
    total: details?.totals.total || 0,
    price_id: details?.line_items[0]?.price_id || "",
    quantity: details?.line_items[0]?.quantity || 0,
    userId: custom_data.userId,
  };

  const userPlanData = {
    credits: custom_data.credits,
    plan_type: custom_data.plan_type,
    isUnlimited: custom_data.isUnlimited,
    autonomyMode: custom_data.autonomyMode,
    deepWebResearch: custom_data.deepWebResearch,
    futureScheduling: custom_data.futureScheduling,
    voiceCommunication: custom_data.voiceCommunication,
    paymentDate: paymentDate,
    expirationDate: expirationDate,
    userId: custom_data.userId,
    userEmail: custom_data.userEmail,
  };

  return { supabaseData, userPlanData };
}

export async function POST(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const webhookData: WebhookData = await req.json();
      console.log("webhookData:", webhookData);

      const { supabaseData, userPlanData } = await processWebhookData(
        webhookData
      );

      // Check if the user already has a row in the user_plan table
      const { data: existingUserPlan, error: userPlanError } = await supabase
        .from("user_plan")
        .select()
        .eq("userId", userPlanData.userId);

      if (userPlanError) {
        throw userPlanError;
      }

      switch (true) {
        case existingUserPlan.length === 0:
          // Insert new user plan
          await supabase.from("user_plan").insert(userPlanData);
          console.log("New user plan inserted.");
          break;
        case existingUserPlan[0].plan_type === null ||
          existingUserPlan[0].plan_type === "null":
          // Update null plan_type
          await supabase
            .from("user_plan")
            .update({ plan_type: userPlanData.plan_type })
            .eq("userId", userPlanData.userId);
          console.log("Plan type updated from null.");
          break;
        case existingUserPlan[0].plan_type === "basic" &&
          userPlanData.plan_type === "pro":
          // Upgrade from basic to pro
          await supabase
            .from("user_plan")
            .update({
              credits: existingUserPlan[0].credits / 2 + userPlanData.credits,
              plan_type: userPlanData.plan_type,
              futureScheduling: true,
              voiceCommunication: true,
              deepWebResearch: true,
              autonomyMode: true,
            })
            .eq("userId", userPlanData.userId);
          console.log("User upgraded to Pro plan.");
          break;
        default:
          // Update credits for existing plans without changing plan_type
          await supabase
            .from("user_plan")
            .update({
              credits: existingUserPlan[0].credits + userPlanData.credits,
            })
            .eq("userId", userPlanData.userId);
          console.log("Credits updated.");
          break;
      }

      // Save processedData to user payment data
      await supabase.from("users_payment_data").insert(supabaseData);

      console.log("Data saved to Supabase:");

      return NextResponse.json(
        { message: "Webhook data received and processed successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error handling Paddle webhook:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
