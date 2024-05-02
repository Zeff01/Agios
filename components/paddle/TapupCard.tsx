import React from "react";
import TapupButton from "./TapupButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TapupCardProps {
  planType: string;
  credits: number;
}

const TapupCard = ({ planType, credits }: TapupCardProps) => {
  return (
    <Card className="border-none flex flex-row items-center rounded-lg shadow-ms shadow-green-500 bg-black text-white px-4 py-7 justify-between ">
      <CardHeader className="px-0 py-0 font-light text-xl">
        <CardTitle>{`Add ${credits.toLocaleString()} credits to your plan.`}</CardTitle>
      </CardHeader>

      <CardFooter className="justify-center items-center flex p-0">
        <TapupButton planType={planType} credits={credits} />
      </CardFooter>
    </Card>
  );
};

export default TapupCard;
