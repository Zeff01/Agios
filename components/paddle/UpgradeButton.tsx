"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckoutTypes } from "@/types/paddle-types";
import { useUserAndPlan } from "@/hooks/useUserAndPlan";
import { useToast } from "@/components/ui/use-toast";

interface UpgradeButtonProps {
  planType: string | undefined;
  setWebHookLoading: any;
  disabled?: boolean;
}

const UpgradeButton: React.FC<UpgradeButtonProps> = ({
  planType,
  setWebHookLoading,
  disabled,
}) => {
  const { toast } = useToast();
  const { user, userPlan, isLoading, isError } = useUserAndPlan();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user)
    return <div>Error loading user details or user not found</div>;

  const userEmail = user.email;
  const userId = user.id;

  if (!userEmail) {
    return <div>User email is required for this operation.</div>;
  }

  const fetchSubscriptionDetails = async (
    subscriptionId: string | undefined
  ) => {
    if (!subscriptionId) {
      console.error("Subscription ID is required for fetching details.");
      return;
    }

    const response = await fetch(`/api/paddle-get-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch subscription details");
    }
    const data = await response.json();
    console.log("Subscription Details:", data);
    return data;
  };

  const handleUpgrade = async () => {
    const today = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(today.getDate() + 30);
    setWebHookLoading(true);

    if (!window?.Paddle) {
      console.error("Paddle is not available.");
      setWebHookLoading(false);
      return;
    }
    console.log("UPGRADE INTIATED!!!!");
    const subscriptionDetails = await fetchSubscriptionDetails(
      userPlan?.subscription_id
    );
    console.log("subscriptionDetails:", subscriptionDetails);
    const priceId = "pri_01hwc94xqe1vcwwn4ah3pb77b9";

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
        plan_type: "pro",
        userId: userId,
        userEmail: userEmail,
        futureScheduling: true,
        voiceCommunication: true,
        deepWebResearch: true,
        autonomyMode: true,
        paymentDate: today.toISOString(),
        expirationDate: expirationDate.toISOString(),
      },
      successUrl: "https://your-success-url.com",
      customer: {
        email: userEmail,
      },
    };

    window.Paddle.Checkout.open(checkoutOptions);
    setWebHookLoading(false);
    return;
  };

  return (
    <Button
      className="border px-4 py-5 rounded-sm bg-white text-black hover:bg-zinc-800 hover:text-white last:mt-4 w-full"
      onClick={handleUpgrade}
      disabled={disabled}
    >
      {disabled ? `You are already a ${userPlan?.plan_type} User` : "Upgrade"}
    </Button>
  );
};

export default UpgradeButton;
