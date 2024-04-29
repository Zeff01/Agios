import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { CheckoutTypes } from "@/types/paddle-types";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: string;
}

const UpgradeModal = ({ isOpen, onClose, planType }: UpgradeModalProps) => {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

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

  if (!isOpen) return null;

  const handleClick = async () => {
    setLoading(true); // Set loading to true
    if (!window.Paddle) {
      console.error("Paddle is not available.");
      setLoading(false); // Reset loading state
      return;
    }
    if (planType === "basic") {
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
        },
        successUrl: "https://your-success-url.com",
        customer: {
          email: userEmail,
        },
      };

      window.Paddle.Checkout.open(checkoutOptions);
      setLoading(false); // Reset loading state after Paddle Checkout is triggered
    } else {
      try {
        await supabase
          .from("user_plan")
          .update({
            plan_type: "basic",
            futureScheduling: false,
            voiceCommunication: false,
            deepWebResearch: false,
            autonomyMode: false,
            isUnlimited: false,
          })
          .eq("userId", userId);
      } catch (error) {
        console.error("Error updating user plan:", error.message);
      } finally {
        setLoading(false); // Reset loading state regardless of success or failure
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {planType === "basic"
              ? "Upgrade to Pro Plan"
              : "Downgrade to Basic Plan"}
          </DialogTitle>
          <DialogDescription>
            {planType === "basic"
              ? "Are you sure you want to upgrade your plan to Pro? This change will enhance your service capabilities."
              : "Are you sure you want to downgrade your plan to Basic? This will change your service capabilities."}
          </DialogDescription>
        </DialogHeader>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={onClose} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button onClick={handleClick} disabled={loading}>
            {loading
              ? "Processing..."
              : planType === "basic"
              ? "Upgrade"
              : "Downgrade"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
