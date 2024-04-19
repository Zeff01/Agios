// PaddleEventListener.tsx
"use client";
import React, { useEffect } from "react";

const PaddleEventListener: React.FC = () => {
  useEffect(() => {
    const handleCheckoutCompleted = (event) => {
      console.log("Checkout completed event:", event.detail);
      // Extract relevant data from the event and save it to Supabase or perform other actions
      const checkoutData = event.detail.data;
      saveToSupabase(checkoutData);
    };

    window.addEventListener("checkout.completed", handleCheckoutCompleted);

    return () => {
      window.removeEventListener("checkout.completed", handleCheckoutCompleted);
    };
  }, []);

  const saveToSupabase = (checkoutData) => {
    // Code to save checkout data to Supabase
    // Replace this with your actual Supabase saving logic
    console.log("Saving checkout data to Supabase:", checkoutData);
  };

  return null; // This component doesn't render anything
};

export default PaddleEventListener;
