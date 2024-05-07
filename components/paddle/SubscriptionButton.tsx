import { Button } from "@/components/ui/button";
import { CheckoutTypes } from "@/types/paddle-types";
import { useUserAndPlan } from "@/hooks/useUserAndPlan";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import usePaddle from "@/hooks/usePaddle";

interface SubscriptionButtonProps {
  planType: string | undefined;
  setWebHookLoading: any;
  disabled?: boolean;
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  planType,
  setWebHookLoading,
  disabled,
}) => {
  const { toast } = useToast();
  const { user, userPlan, isLoading, isError } = useUserAndPlan();
  const router = useRouter();
  const isProUser = userPlan?.plan_type === "pro";
  const isBasicUser = userPlan?.plan_type === "basic";

  if (isError && !user) {
    return (
      <div className="text-center text-white">
        <p>Error occurred. Please try again later or log in if you're not.</p>
        <Button onClick={() => router.push("/login")}>Log in</Button>
      </div>
    );
  }
  const userEmail = user?.email;
  const userId = user?.id;

  const handleSubscribe = () => {
    const today = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(today.getDate() + 30);

    setWebHookLoading(true);

    if (!user) {
      toast({
        title: "Please Log In",
        description: "You need to log in to subscribe to a plan.",
      });
      router.push("/login");
      setWebHookLoading(false);
      return;
    }
    if (!window?.Paddle) {
      console.error("Paddle is not available.");
      setWebHookLoading(false);
      return;
    }

    if (!userEmail) {
      return <div>User email is required for this operation.</div>;
    }

    if (userPlan?.plan_type === planType) {
      toast({
        title: "Error",
        description: `You are already a ${planType} user.`,
      });
      setWebHookLoading(false);
      return;
    }

    if (isBasicUser && !isProUser) {
      const priceId = "pri_01hwc94xqe1vcwwn4ah3pb77b9";

      const checkoutOptions: CheckoutTypes = {
        allowedPaymentMethods: ["card", "paypal"],
        settings: {
          displayMode: "overlay",
          theme: "light",
          locale: "en",
        },
        items: [
          {
            priceId: priceId,
            quantity: 1,
          },
        ],
        customData: {
          credits: 100000,
          isUnlimited: false,
          plan_type: "pro",
          userId: userId,
          userEmail: userEmail,
          futureScheduling: true,
          voiceCommunication: true,
          deepWebResearch: true,
          autonomyMode: true,
          paymentDate: today.toISOString(),
          expirationDate: expirationDate.toISOString(),
        },
        successUrl: "https://your-success-url.com",
        customer: {
          email: userEmail,
        },
      };

      window.Paddle.Checkout.open(checkoutOptions);
      setWebHookLoading(false);
      return;
    }

    if (!isBasicUser && !isProUser) {
      const priceId =
        planType === "basic"
          ? "pri_01hwc9083h0spvq9rc3dc41nn3"
          : "pri_01hwc9440zkd3949svjyatbrbs";

      const checkoutOptions: CheckoutTypes = {
        allowedPaymentMethods: ["card", "paypal"],
        settings: {
          displayMode: "overlay",
          theme: "light",
          locale: "en",
        },
        items: [
          {
            priceId: priceId,
            quantity: 1,
          },
        ],
        customData: {
          credits: 100000,
          isUnlimited: false,
          plan_type: planType,
          userId: userId,
          userEmail: userEmail,
          futureScheduling: isProUser ? true : false,
          voiceCommunication: isProUser ? true : false,
          deepWebResearch: isProUser ? true : false,
          autonomyMode: isProUser ? true : false,
          paymentDate: today.toISOString(),
          expirationDate: expirationDate.toISOString(),
        },
        successUrl: "https://your-success-url.com",
        customer: {
          email: userEmail,
        },
      };

      window.Paddle.Checkout.open(checkoutOptions);
    }

    setWebHookLoading(false);
  };

  return (
    <Button
      className="border px-4 py-5 rounded-sm bg-white text-black hover:bg-zinc-800 hover:text-white last:mt-4 w-full"
      onClick={handleSubscribe}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          "Subscribe"
          <ClipLoader color="#FFFFFF" size={20} />
        </>
      ) : disabled ? (
        `You are already a ${userPlan?.plan_type} User`
      ) : (
        "Subscribe"
      )}
    </Button>
  );
};

export default SubscriptionButton;
