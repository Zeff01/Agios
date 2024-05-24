"use client";
import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SubscriptionButton from "./SubscriptionButton";
import useLoadingStore from "@/store/loadingStore";
import { useUserAndPlan } from "@/hooks/useUserAndPlan";
import UpgradeButton from "./UpgradeButton";
import { useRouter } from "next/navigation";
interface SubscriptionCardProps {
  planType: string | undefined;
  title: string;
  description: string;
  price: ReactNode;
  features: string[];
  disabled?: boolean;
}
const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  planType,
  title,
  description,
  price,
  features,
  disabled,
}) => {
  const { setWebHookLoading } = useLoadingStore();
  const { userPlan } = useUserAndPlan();
  const isBasicUser = userPlan?.plan_type === "basic";
  const router = useRouter();
  const cardClass = `flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900 flex-1 basis-1/3 max-w-xs text-white p-4 ${
    planType === "pro" ? "border-pink-500" : "border-none"
  }`;

  return (
    <Card className={cardClass}>
      <CardHeader className="p-4">
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 border-none flex-grow">
        <p className="text-2xl font-bold text-left mb-4">{price}</p>
        <ul className="list-inside text-left flex flex-col gap-1">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-4 border-none">
        {isBasicUser ? (
          <UpgradeButton
            planType={planType}
            disabled={disabled}
            setWebHookLoading={setWebHookLoading}
          />
        ) : (
          <SubscriptionButton
            planType={planType}
            disabled={disabled}
            setWebHookLoading={setWebHookLoading}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
