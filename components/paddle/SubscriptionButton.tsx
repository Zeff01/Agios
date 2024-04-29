"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckoutTypes } from "@/types/paddle-types";

interface SubscriptionButtonProps {
  planType: "basic" | "pro";
  setWebHookLoading: any;
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  planType,
  setWebHookLoading,
}) => {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const {
          data: { user },
          error,
        }: { data?: any; error?: any } = await supabase.auth.getUser();
        if (error) throw error;
        setUserEmail(user?.email || "");
        setUserId(user.id);
      } catch (error: any) {
        console.error("Error fetching user email:", error?.message);
      }
    };

    fetchUserDetails();
  }, []);

  if (!userEmail) {
    return <div>Loading...</div>; // Handle loading state if needed
  }

  const handleClick = () => {
    console.log("goes here");
    setWebHookLoading(true);
    if (!window.Paddle) {
      console.error("Paddle is not available.");
      return;
    }

    const priceId =
      planType === "basic"
        ? "pri_01hwc9083h0spvq9rc3dc41nn3"
        : "pri_01hwc9440zkd3949svjyatbrbs";

    const checkoutOptions: CheckoutTypes = {
      allowedPaymentMethods: ["card", "paypal"],
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en",
      },
      items: [
        {
          priceId: priceId,
          quantity: 1,
        },
      ],
      customData: {
        credits: 100000,
        isUnlimited: false,
        plan_type: planType,
        userId: userId,
        userEmail: userEmail,
        futureScheduling: planType === "pro" ? true : false,
        voiceCommunication: planType === "pro" ? true : false,
        deepWebResearch: planType === "pro" ? true : false,
        autonomyMode: planType === "pro" ? true : false,
      },
      successUrl: "https://your-success-url.com",
      customer: {
        email: userEmail,
      },
    };

    window.Paddle.Checkout.open(checkoutOptions);
    setWebHookLoading(false);
  };

  return (
    <div className="mt-4">
      <Button className="border px-4 py-2 rounded-xl" onClick={handleClick}>
        Subscribe
      </Button>
    </div>
  );
};

export default SubscriptionButton;
