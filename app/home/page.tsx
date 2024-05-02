"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import UpgradeModal from "@/components/paddle/UpgradeModal";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";
import useLoadingStore from "@/store/loadingStore";
import { useUserAndPlan } from "@/hooks/useUserAndPlan";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import TapupCard from "@/components/paddle/TapupCard";
import { creditsOptions } from "@/constants/creditsOptions";

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const {
    user,
    userPlan,
    isLoading,
    isError,
    mutateUser,
    mutateUserPlan,
    firstName,
  } = useUserAndPlan();

  const { initialLoading, setInitialLoading, webHookLoading } =
    useLoadingStore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [setInitialLoading]);

  const debouncedRedirect = debounce(() => {
    if (!initialLoading && !webHookLoading) {
      if (!user) {
        console.error("No user found, redirecting to login.");
        router.push("/login");
      } else if (!userPlan) {
        console.log("No valid user plan found, redirecting to subscription.");
        router.push("/subscription");
      }
    }
  }, 1500);
  useEffect(() => {
    debouncedRedirect();
  }, [
    user,
    userPlan,
    isLoading,
    isError,
    initialLoading,
    webHookLoading,
    router,
  ]);

  const handleUpgrade = () => {
    setModalOpen(true);
    toast({
      title: "Upgrade initiated",
      description: "Your plan upgrade is being processed.",
    });
  };

  const handleModalClose = async () => {
    setModalOpen(false);
    try {
      await Promise.all([mutateUser(), mutateUserPlan()]);
      toast({
        title: "Transaction Completed",
        description: "Your plan change has been successfully processed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data. Please check your connection.",
      });
    }
  };
  if (!userPlan)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4A90E2" size={150} />
      </div>
    );
  if (isLoading || initialLoading || webHookLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4A90E2" size={150} />
      </div>
    );
  }

  if (isError) return <div>Error loading user or plan data.</div>;
  const planTypeKey =
    userPlan.plan_type.toLowerCase() as keyof typeof creditsOptions;

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const paymentDate = formatDate(userPlan.paymentDate);
  const expirationDate = formatDate(userPlan.expirationDate);
  return (
    <div className="min-h-screen flex flex-col justify-between bg-black text-white">
      <nav className="w-full bg-black shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-2">
          <div className="text-md font-semibold">
            <Link href="/">AGIOS</Link>
          </div>
          <AuthButton />
        </div>
      </nav>

      <main className="flex-grow container mx-auto py-10 px-4 ">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 shadow-md shadow-green-400 rounded-xl p-8 flex justify-between flex-col">
            <div className="flex justify-between  ">
              <div className="flex flex-col gap-4">
                <h1 className="text-md font-bold text-white sm:text-4xl">
                  Hi, Zeff 👋
                </h1>

                <p className="max-w-xl text-xl text-zinc-200 sm:text-2xl">
                  Current Plan:{" "}
                  <span className="text-green-500 font-semibold">
                    {userPlan?.plan_type.toUpperCase()}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-4xl font-bold text-green-500">
                  {userPlan?.credits.toLocaleString()}
                </p>
                <h2 className="text-md text-right font-semibold">
                  Credits Available
                </h2>
              </div>
            </div>

            <div className="flex justify-between ">
              <div>
                <div>Payment Date: {paymentDate}</div>
                <div>Expiration Date: {expirationDate}</div>
              </div>
              <Button
                onClick={handleUpgrade}
                className="p-6 bg-black border-white border rounded-xl hover:text-green-500 hover:bg-black hover:border-green-500"
              >
                {userPlan?.plan_type === "basic"
                  ? "Upgrade to Pro Plan"
                  : "Downgrade to Basic Plan"}
              </Button>
              <UpgradeModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                planType={userPlan?.plan_type}
              />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {userPlan &&
              creditsOptions[planTypeKey].map((credits, index) => (
                <TapupCard
                  key={index}
                  planType={userPlan.plan_type.toLowerCase() as "basic" | "pro"}
                  credits={credits}
                />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
