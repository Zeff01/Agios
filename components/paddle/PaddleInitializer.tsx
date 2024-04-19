"use client";

import React, { useEffect } from "react";

const PaddleInitializer: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      window.Paddle.Environment.set("sandbox");
      console.log("Paddle script loaded successfully");
      window.Paddle.Initialize({
        token: "test_6713304c52ce4f81edd625ff74c",
      });
    };
    script.onerror = () => {
      console.error("Failed to load Paddle script");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PaddleInitializer;
