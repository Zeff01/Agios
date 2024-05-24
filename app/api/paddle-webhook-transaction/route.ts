import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

// Define your data interfaces
interface CustomData {
  userId: string;
  userEmail: string;
  plan_type: string;
  credits: number;
  paymentDate: Date;
  expirationDate: Date;
  isUnlimited: boolean;
  autonomyMode: boolean;
  deepWebResearch: boolean;
  futureScheduling: boolean;
  voiceCommunication: boolean;
}

interface WebhookData {
  data: {
    id: string;
    status: string;
    customer_id: string;
    custom_data: CustomData;
    subscription_id: string;
  };
  event_type: string;
}

const supabase = createClient();

async function handleWebhook({ data, event_type }: WebhookData) {
  const { id, customer_id, custom_data, subscription_id } = data;
  switch (event_type) {
    case "transaction.completed":
      await handleTransactionCompleted(
        custom_data,
        subscription_id,
        customer_id,
        id
      );
      break;
    case "transaction.payment_failed":
      await handlePaymentFailed(custom_data, subscription_id, customer_id, id);
      break;
    case "transaction.past_due":
      await handlePastDue(custom_data, subscription_id, customer_id, id);
      break;
    case "transaction.canceled":
      await handleCancellation(custom_data, subscription_id, customer_id, id);
      break;
    default:
      console.log("Unhandled event type:", event_type);
  }
}
async function updateOrCreateUserPlan(
  customData: CustomData,
  status: string,
  subscriptionId: string,
  customerId: string
) {
  const { userId, plan_type, credits, paymentDate, expirationDate } =
    customData;

  const planData = {
    userId,
    plan_type,
    credits,
    paymentDate,
    expirationDate,
    status,
    customer_id: customerId,
    subscription_id: subscriptionId,
  };

  try {
    const { data: existingUserPlan, error } = await supabase
      .from("user_plan")
      .select("*")
      .eq("userId", userId)
      .maybeSingle(); // Changes here to use maybeSingle which returns null instead of throwing if no rows are found

    if (error) {
      console.error("Error fetching user plan:", error);
      throw new Error(`Failed to retrieve user plan: ${error.message}`);
    }

    if (!existingUserPlan) {
      console.log("No existing user plan found. Creating a new one.");
      await supabase.from("user_plan").insert({
        ...customData,
        status,
      });
      console.log("New user plan inserted.");
      return;
    }

    let updateData = {
      ...planData,
      credits: existingUserPlan.credits + credits,
    };

    if (
      existingUserPlan.plan_type === null ||
      existingUserPlan.plan_type === "null"
    ) {
      console.log("Updating null plan type to:", plan_type);
      updateData.plan_type = plan_type;
    } else if (existingUserPlan.plan_type === "basic" && plan_type === "pro") {
      console.log("Upgrading from basic to pro plan.");
      updateData = {
        ...updateData,
        credits: existingUserPlan.credits / 2 + credits,
        futureScheduling: true,
        voiceCommunication: true,
        deepWebResearch: true,
        autonomyMode: true,
      };
    }

    await supabase.from("user_plan").update(updateData).eq("userId", userId);
    console.log(
      "User plan updated with data:>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      updateData
    );
  } catch (error) {
    console.error("Error handling user plan:", error);
  }
}

async function handleTransactionCompleted(
  customData: CustomData,
  subscriptionId: string,
  customerId: string,
  transactionId: string
) {
  console.log(
    `Handling completed transaction ${transactionId} for customer ${customerId}`
  );

  // Directly handle updating or creating the user plan with "active" status
  await updateOrCreateUserPlan(
    customData,
    "active",
    subscriptionId,
    customerId
  );
}

async function handlePaymentFailed(
  customData: CustomData,
  subscriptionId: string,
  customerId: string,
  transactionId: string
) {
  console.log(`Handling failed payment for transaction ${transactionId}`);
  await updateOrCreateUserPlan(
    customData,
    "payment_failed",
    subscriptionId,
    customerId
  );
}

async function handlePastDue(
  customData: CustomData,
  subscriptionId: string,
  customerId: string,
  transactionId: string
) {
  console.log(`Handling past due transaction for customer ${customerId}`);
  await updateOrCreateUserPlan(
    customData,
    "past_due",
    subscriptionId,
    customerId
  );
}

async function handleCancellation(
  customData: CustomData,
  subscriptionId: string,
  customerId: string,
  transactionId: string
) {
  console.log(`Handling cancellation of transaction ${transactionId}`);
  await updateOrCreateUserPlan(
    customData,
    "canceled",
    subscriptionId,
    customerId
  );
}

async function processWebhookData(webhookData: WebhookData) {
  const {
    id: transaction_id,
    status,
    customer_id,
    custom_data,
  } = webhookData.data;

  const transactionData = {
    transaction_id,
    status,
    customer_id,
    event_type: webhookData.event_type,
    userId: custom_data.userId,
  };

  return { transactionData };
}

export async function POST(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const webhookData: WebhookData = await req.json();
      await handleWebhook(webhookData);
      const { transactionData } = await processWebhookData(webhookData);

      // Save processedData to user payment data
      await supabase.from("transaction_data").insert(transactionData);

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
