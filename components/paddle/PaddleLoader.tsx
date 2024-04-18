"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

export function PaddleLoader() {
  const [paddleReady, setPaddleReady] = useState(false);

  const itemsList = [
    { priceId: "pri_01hvn8w5629ejjqb3y21xqmfe9", quantity: 1 },
    { priceId: "pri_01hvn8vsztet8dfkc9zn8znd0z", quantity: 1 },
  ];

  const customerInfo = {
    email: "sam@example.com",
    address: {
      countryCode: "US",
      postalCode: "10021",
    },
  };

  useEffect(() => {
    if (window.Paddle) {
      window.Paddle.Environment.set("sandbox");
      window.Paddle.Setup({
        vendor: Number(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
        token: "test_bd7982eb9b542d8f85df094e039",
        eventCallback: (data) => {
          console.log("Event Callback:", data);
        },
      });
      setPaddleReady(true);
    }
  }, []);

  const openCheckout = () => {
    if (paddleReady) {
      window.Paddle.Checkout.open({
        items: itemsList,
        customer: customerInfo,
      });
    } else {
      console.error("Paddle.js not ready");
    }
  };

  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/paddle.js"
        strategy="afterInteractive"
        onLoad={() => setPaddleReady(true)}
      />
      <button onClick={openCheckout} disabled={!paddleReady}>
        Checkout scrpt
      </button>
    </>
  );
}
