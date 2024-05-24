"use client";
import AuthButton from "../components/AuthButton";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import SubscriptionCard from "@/components/paddle/SubscriptionCard";
import { useUserAndPlan } from "@/hooks/useUserAndPlan";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { user, userPlan, isLoading, isError } = useUserAndPlan();

  // if (isLoading) {
  //   return <ClipLoader color="green" size={150} />;
  // }

  if (isError) {
    return (
      <div className="text-center text-white">
        <p>Error loading data. Please try again later.</p>
      </div>
    );
  }

  const isProUser = userPlan?.plan_type === "pro";
  const isBasicUser = userPlan?.plan_type === "basic";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-black text-white">
      <Toaster />

      {/* HEADER HERE */}
      <nav className="w-full bg-black shadow-sm ">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-2">
          <div className="text-md font-semibold">
            <Link href="/">AGIOS</Link>
          </div>
          <AuthButton />
        </div>
      </nav>

      {/* TITLE HERE */}
      <main className="flex-grow container mx-auto text-center py-10 px-4">
        <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
          Pricing Plans
        </h1>
        <p className="max-w-2xl m-auto mt-5 mb-12 text-xl text-zinc-200 sm:text-center sm:text-2xl">
          Start building for free, then add a site plan to go live. Account
          plans unlock additional features.
        </p>

        {/* CONTENT HERE */}
        <div className="items-center justify-center flex p-2">
          <div className="flex flex-col md:flex-row  justify-center gap-8">
            <SubscriptionCard
              planType="basic"
              title="Basic Plan"
              description="Lorem ipsum dolor sit amet, consectetur"
              price="$25/month"
              features={["✅ 100,000 basic plan credits", "✅ Whatever plan"]}
              disabled={isBasicUser || isProUser}
            />
            <SubscriptionCard
              planType="pro"
              title="Pro Plan"
              description="Lorem ipsum dolor sit amet, consectetur"
              price={
                isBasicUser ? (
                  <>
                    <span className="line-through text-gray-400 text-sm">
                      $50/month
                    </span>{" "}
                    $25/month
                  </>
                ) : (
                  "$50/month"
                )
              }
              features={[
                "✅ 100,000 pro plan credits",
                "✅ Future Scheduling",
                "✅ Voice Communication",
                "✅ Deep Web Research",
                "✅ Autonomy Mode",
              ]}
              disabled={isProUser}
            />
          </div>
        </div>

        {/* FOOTER HERE */}
        <div className="mt-10">
          {/* <Link
            href="/subscription"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Subscribe Now
          </Link> */}
        </div>
      </main>
      <footer className="w-full py-4 border-t border-gray-300">
        <div className="max-w-6xl mx-auto flex justify-center text-xs">
          <p>
            Powered by{" "}
            <Link
              className="font-bold hover:text-blue-500 underline"
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            >
              Agios
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
