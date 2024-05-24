// hooks/usePaddle.tsx
"use client";
import {
  initializePaddle,
  InitializePaddleOptions,
  Paddle,
} from "@paddle/paddle-js";
import { useEffect, useState } from "react";

export default function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle>();
  useEffect(() => {
    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV,
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_KEY!,
      seller: Number(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
    } as unknown as InitializePaddleOptions).then(
      (paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      }
    );
  }, []);

  return paddle;
}
