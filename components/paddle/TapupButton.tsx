"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useUserAndPlan } from "@/hooks/useUserAndPlan";
import { creditsOptions, PlanType } from "@/constants/creditsOptions";

interface TapupButtonProps {
  planType: string; // Received as a general string
  credits: number;
}

const priceIds: Record<PlanType, string[]> = {
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

const TapupButton: React.FC<TapupButtonProps> = ({ planType, credits }) => {
  const { user, userPlan } = useUserAndPlan();
  if (!user || !userPlan || !planType) {
    return <div>Loading...</div>;
  }
  const userEmail = user.email;
  const userId = user.id;
  const validPlanType = planType as PlanType;

  const getIndexByCredits = (credits: number) => {
    const creditsArray =
      planType === "pro" ? creditsOptions.pro : creditsOptions.basic;
    return creditsArray.indexOf(credits);
  };

  const handleClick = (credits: number) => {
    const tapupIndex = getIndexByCredits(credits);
    if (!window.Paddle) {
      console.error("Paddle is not available.");
      return;
    }

    const selectedPriceId = priceIds[validPlanType][tapupIndex];

    const customData = {
      credits,
      isUnlimited: tapupIndex === 4,
      plan_tapup: tapupIndex + 1,
      plan_type: validPlanType,
      futureScheduling: validPlanType === "pro",
      voiceCommunication: validPlanType === "pro",
      deepWebResearch: validPlanType === "pro",
      autonomyMode: validPlanType === "pro",
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
    <Button
      className="px-4 py-5 bg-black border-2 rounded-xl hover:text-green-500 hover:bg-black hover:border-green-500 ml-4 "
      onClick={() => handleClick(credits)}
    >
      ADD
    </Button>
  );
};

export default TapupButton;
