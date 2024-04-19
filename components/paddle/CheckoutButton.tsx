// CheckoutButton.tsx
"use client";
import React from "react";

const CheckoutButton: React.FC = () => {
  const handleClick = () => {
    if (!window.Paddle) {
      console.error("Paddle is not available.");
      return;
    }

    // Open the Paddle checkout with desired settings
    window.Paddle.Checkout.open({
      // Add your desired settings here
      allowedPaymentMethods: ["card", "paypal"],
      displayMode: "inline",
      theme: "dark",
      locale: "en",
      // Add more settings as needed
      items: [
        {
          priceId: "pri_01hvn8w5629ejjqb3y21xqmfe9",
          quantity: 1,
        },
      ],
      successUrl: "https://your-success-url.com",
      customer: {
        email: "jzeffsomera@gmail.com",
      },
      // Add successCallback to handle successful checkout
      successCallback: function (data) {
        // Callback function to handle successful checkout
        console.log("Checkout successful:", data);
        // Save data to Supabase or perform other actions here
        // Example: Save checkout data to Supabase
        saveToSupabase(data);
      },
    });
    console.log("window.Paddle:", window);
  };

  const saveToSupabase = (data) => {
    // Code to save checkout data to Supabase
    // Replace this with your actual Supabase saving logic
    console.log("Saving checkout data to Supabase:", data);
  };

  return <button onClick={handleClick}>Checkout</button>;
};

export default CheckoutButton;
