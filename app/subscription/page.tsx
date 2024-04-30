"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import AuthButton from "@/components/AuthButton";
import SubscriptionButton from "@/components/paddle/SubscriptionButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserAndPlan } from "@/hooks/useUserAndPlan";
import { mutate } from "swr";
import ClipLoader from "react-spinners/ClipLoader";

export default function ProtectedPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, userPlan, isLoading, isError } = useUserAndPlan();
  const [initialLoading, setInitialLoading] = useState(true);
  const [webHookLoading, setWebHookLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialLoading && !isLoading && !webHookLoading) {
      if (isError) {
        toast({
          title: "Error",
          description: "Failed to load data, please try again.",
          status: "error",
        });
        return;
      }
      if (!user) {
        console.error("No user found, redirecting to login.");
        router.push("/login");
      } else if (userPlan) {
        console.log("User has a valid plan, redirecting to home.");
        router.push("/home");
      } else {
        console.log("No valid user plan found, redirecting to subscription.");
        router.push("/subscription");
      }
    }
  }, [
    user,
    userPlan,
    initialLoading,
    isLoading,
    isError,
    webHookLoading,
    router,
  ]);

  const checkUserPlan = async () => {
    try {
      // Assuming you have a way to directly trigger a re-fetch or receive a push update
      const updatedPlan = await mutate("user_plan");
      if (updatedPlan && updatedPlan.plan_type) {
        // Make sure updatedPlan has the data you expect
        console.log("Plan updated, navigating to home page.");
        clearInterval(intervalId); // Clear the interval using a saved interval ID

        router.push("/home");
      }
    } catch (error) {
      console.error("Failed to fetch the updated user plan:", error);
      toast({
        title: "Error",
        description:
          "Could not confirm the subscription update. Please try again.",
        status: "error",
      });
    }
  };
  useEffect(() => {
    let interval;
    if (webHookLoading) {
      interval = setInterval(checkUserPlan, 5000); // Poll every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval); // Ensure the interval is cleared correctly
    };
  }, [webHookLoading, checkUserPlan]);

  if (isLoading || initialLoading) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-10 p-8">
        <ClipLoader color="#4A90E2" size={150} />
      </div>
    );
  }

  if (webHookLoading) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-10 p-8">
        <ClipLoader color="#4A90E2" size={150} />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center gap-10 p-8">
      <nav className="w-full flex justify-center border-b border-gray-300 h-16">
        <div className="w-full max-w-6xl flex justify-between items-center p-3">
          <AuthButton />
        </div>
      </nav>
      <main className="flex-grow w-full">
        <div className="flex justify-center space-x-6">
          <div className="flex flex-wrap justify-center gap-4">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Basic Plan
                </CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>$25/month</p>
                <ul>
                  <li>✅ 100,000 basic plan credits</li>
                  <li>✅ Whatever plan</li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionButton
                  planType="basic"
                  setWebHookLoading={setWebHookLoading}
                />
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Pro Plan
                </CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>$50/month</p>
                <ul>
                  <li>✅ 100,000 pro plan credits</li>
                  <li>✅ Future Scheduling</li>
                  <li>✅ Voice Communication</li>
                  <li>✅ Deep Web Research</li>
                  <li>✅ Autonomy Mode</li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionButton
                  planType="pro"
                  setWebHookLoading={setWebHookLoading}
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <footer className="w-full py-4 border-t border-gray-300">
        <p>
          Powered by{" "}
          <a href="https://supabase.com" className="font-bold hover:underline">
            Agios
          </a>
        </p>
      </footer>
    </div>
  );
}
