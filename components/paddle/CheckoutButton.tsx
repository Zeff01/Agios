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
      items: [
        {
          priceId: "pri_01hvn8w5629ejjqb3y21xqmfe9",
          quantity: 1,
        },
      ],
      customer: {
        email: "jzeffsomera@gmail.com",
      },
    });
    console.log("window.Paddle:", window);
  };

  // const saveToSupabase = (data) => {
  //   // Code to save checkout data to Supabase
  //   // Replace this with your actual Supabase saving logic
  //   console.log("Saving checkout data to Supabase:", data);
  // };

  return <button onClick={handleClick}>Checkout</button>;
};

export default CheckoutButton;
