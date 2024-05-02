import { Button } from "@/components/ui/button";
import { CheckoutTypes } from "@/types/paddle-types";
import { useUserAndPlan } from "@/hooks/useUserAndPlan";
import { useToast } from "@/components/ui/use-toast";

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
  const isProUser = userPlan?.plan_type === "pro";
  const isBasicUser = userPlan?.plan_type === "basic";

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user)
    return <div>Error loading user details or user not found</div>;

  const userEmail = user.email;
  const userId = user.id;

  if (!userEmail) {
    return <div>User email is required for this operation.</div>;
  }

  const handleSubscribe = () => {
    setWebHookLoading(true);

    if (!window?.Paddle) {
      console.error("Paddle is not available.");
      setWebHookLoading(false);
      return;
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
      disabled={disabled}
    >
      {disabled ? `You are already a ${userPlan?.plan_type} User` : "Subscribe"}
    </Button>
  );
};

export default SubscriptionButton;
