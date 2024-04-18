"use client";

import { useEffect, useState } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

export function Checkout() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  useEffect(() => {
    console.log("Initializing Paddle...");
    initializePaddle({
      environment: "sandbox",
      token: "test_bd7982eb9b542d8f85df094e039",
    }).then((paddleInstance) => {
      console.log("Paddle initialized:", paddleInstance);
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

  const handlePaymentSuccess = (data: any) => {
    console.log("goes here success");
    fetch("/api/payment-success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error posting success data:", error));
  };

  const handlePaymentError = (error: any) => {
    console.log("goes here error");
    fetch("/api/payment-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error }),
    }).catch((error) => console.error("Error posting error data:", error));
  };

  const openCheckout = () => {
    console.log("Opening checkout...");
    paddle?.Checkout.open({
      items: [
        { priceId: "pri_01hvn8w5629ejjqb3y21xqmfe9", quantity: 1 },
        { priceId: "pri_01hvn8vsztet8dfkc9zn8znd0z", quantity: 1 },
      ],
    });
  };

  return (
    <button onClick={openCheckout} disabled={!paddle}>
      Checkout
    </button>
  );
}
