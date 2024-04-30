"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import TapupButton from "@/components/paddle/TapupButton";
import UpgradeModal from "@/components/paddle/UpgradeModal";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";
import useLoadingStore from "@/store/loadingStore";
import { useUserAndPlan } from "@/hooks/useUserAndPlan";

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user, userPlan, isLoading, isError, mutateUser, mutateUserPlan } =
    useUserAndPlan();
  const {
    initialLoading,
    setInitialLoading,
    webHookLoading,
    setWebHookLoading,
  } = useLoadingStore();
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

  if (isLoading || initialLoading || webHookLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4A90E2" size={150} />
      </div>
    );
  }

  if (isError) return <div>Error loading user or plan data.</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-2xl w-full space-y-6">
        <Button onClick={handleUpgrade}>
          {userPlan?.plan_type === "basic"
            ? "Upgrade to Pro Plan"
            : "Downgrade to Basic Plan"}
        </Button>
        <UpgradeModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          planType={userPlan?.plan_type}
        />
        <h1 className="text-3xl font-bold text-center">
          Welcome to Your Home Page
        </h1>
        <p className="text-xl text-center">
          Plan:{" "}
          <span className="text-blue-600 font-semibold">
            {userPlan?.plan_type}
          </span>
        </p>
        <div>
          <h2 className="text-xl font-semibold text-center">
            Credits Available:
          </h2>
          <p className="text-4xl font-bold text-green-600 text-center">
            {userPlan?.credits.toLocaleString()}
          </p>
        </div>
        {userPlan && (
          <TapupButton
            planType={userPlan.plan_type.toLowerCase() as "basic" | "pro"}
          />
        )}
      </div>
    </div>
  );
}
