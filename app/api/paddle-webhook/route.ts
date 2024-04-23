import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface WebhookData {
  data: {
    id: string;
    origin: string;
    status: string;
    customer_id: string;
    currency_code: string;
    billing_period?: { ends_at: string; starts_at: string };
    billing_cycle?: { interval: string; frequency: number };
    details?: {
      totals: {
        total: number;
      };
      line_items: {
        price_id: string;
        quantity: number;
      }[];
      payout_totals: object;
      tax_rates_used: any[];
      adjusted_totals: object;
    };
  };
  event_id: string; // Include event_id from webhookData directly
  event_type: string; // Include event_type from webhookData directly
  notification_id: string; // Include notification_id from webhookData directly
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function processWebhookData(webhookData: WebhookData) {
  const {
    id: transaction_id,
    origin,
    status,
    customer_id,
    currency_code,
    billing_period,
    billing_cycle,
    details, // Include the details object
  } = webhookData.data;

  // Define types for current_billing_period and billing_cycle with default values
  const { ends_at = "", starts_at = "" } = billing_period || {};
  const { interval = "", frequency = 0 } = billing_cycle || {};

  const supabaseData = {
    transaction_id,
    origin,
    status,
    customer_id,
    currency_code,
    billing_period_ends_at: ends_at,
    billing_period_starts_at: starts_at,
    event_id: webhookData.event_id, // Include event_id from webhookData directly
    event_type: webhookData.event_type, // Include event_type from webhookData directly
    notification_id: webhookData.notification_id, // Include notification_id from webhookData directly
    billing_cycle_interval: interval,
    billing_cycle_frequency: frequency,
    // Include total, price_id, id, and quantity from details object if it exists
    total: details?.totals.total || 0,
    price_id: details?.line_items[0]?.price_id || "",
    quantity: details?.line_items[0]?.quantity || 0,
  };

  return supabaseData;
}

export async function POST(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const webhookData: WebhookData = await req.json();
      console.log("Received Paddle webhook data:", webhookData);
      console.log("DETAILS>>>", webhookData.data.details);

      const processedData = processWebhookData(webhookData);
      const transactionId = webhookData.data.id;

      // Save processedData to Supabase
      const { data, error } = await supabase
        .from("users_payment_data")
        .insert({ ...processedData, transaction_id: transactionId });

      if (error) {
        throw error;
      }

      console.log("Data saved to Supabase:", data);

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
