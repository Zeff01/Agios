"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useUserAndPlan } from "@/hooks/useUserAndPlan";

interface TapupButtonProps {
  planType: "basic" | "pro" | null;
}

const TapupButton: React.FC<TapupButtonProps> = ({ planType }) => {
  const { user, userPlan } = useUserAndPlan();
  if (!user || !userPlan || !planType) {
    return <div>Loading...</div>;
  }
  const window: any = null;
  const userEmail = user.email;
  const userId = user.id;

  const creditsOptions = {
    basic: [100000, 210000, 450000],
    pro: [100000, 210000, 450000, 900000, Number.MAX_SAFE_INTEGER],
  };

  const handleClick = (tapupIndex: number) => {
    if (!window.Paddle) {
      console.error("Paddle is not available.");
      return;
    }

    const priceIds = {
      basic: [
        "pri_01hw7hcfwwc0ryty445anjjhd4",
        "pri_01hw7hejdj04se3g5s3fd4a9bq",
        "pri_01hw7hg26q62jhf2zprxzb1khg",
      ],
      pro: [
        "pri_01hw7hweaxfgp6jfhe76h76ae3",
        "pri_01hw7hxazbark610jmxfrrq4mh",
        "pri_01hw7hy3m0sdew684dtjqv1ggq",
        "pri_01hw7hyzq2p6wmt1yqaz3vms6k",
        "pri_01hw7j0eckzxkx348sdrfwb61r",
      ],
    };

    const selectedPriceId = priceIds[planType][tapupIndex];
    const customData = {
      credits: creditsOptions[planType][tapupIndex],
      isUnlimited: tapupIndex === 4,
      plan_tapup: tapupIndex + 1,
      plan_type: planType,
      futureScheduling: planType === "pro",
      voiceCommunication: planType === "pro",
      deepWebResearch: planType === "pro",
      autonomyMode: planType === "pro",
      userId: userId,
      userEmail: userEmail,
    };

    const checkoutOptions = {
      allowedPaymentMethods: ["card", "paypal"],
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en",
      },
      items: [
        {
          priceId: selectedPriceId,
          quantity: 1,
        },
      ],
      customData: customData,
      successUrl: "https://your-success-url.com",
      customer: {
        email: userEmail,
      },
    };

    window.Paddle.Checkout.open(checkoutOptions);
  };

  return (
    <div className="p-5 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold mb-5">
        {planType === "basic" ? "Basic Plan Tapups" : "Pro Plan Tapups"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {creditsOptions[planType].map((credits, index) => (
          <Button
            key={`tapup-${index}`}
            className="p-8"
            onClick={() => handleClick(index)}
            disabled={!userId || !userEmail}
          >
            Add {index === 4 ? "Unlimited" : credits.toLocaleString()} Credits
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TapupButton;
