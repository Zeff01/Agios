// PaddleEventListener.tsx
"use client";
import React, { useEffect } from "react";

const PaddleEventListener: React.FC = () => {
  useEffect(() => {
    const handleCheckoutCompleted = (event: CustomEvent) => {
      console.log("Checkout completed event:", event.detail);
      // Extract relevant data from the event and save it to Supabase or perform other actions
      const checkoutData = (event.detail as any).data; // Assuming 'data' is a property of the event detail
      saveToSupabase(checkoutData);
    };

    window.addEventListener(
      "checkout.completed" as any,
      handleCheckoutCompleted
    ); // Type assertion to 'any'

    return () => {
      window.removeEventListener(
        "checkout.completed" as any,
        handleCheckoutCompleted
      ); // Type assertion to 'any'
    };
  }, []);

  const saveToSupabase = (checkoutData: any) => {
    // Specify the type of 'checkoutData' as 'any'
    // Code to save checkout data to Supabase
    // Replace this with your actual Supabase saving logic
    console.log("Saving checkout data to Supabase:", checkoutData);
  };

  return null; // This component doesn't render anything
};

export default PaddleEventListener;
