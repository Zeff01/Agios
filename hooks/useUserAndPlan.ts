import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  email?: string; // Assuming email can be undefined
  aud: string;
  role?: string; // Making role optional if it can be undefined
  email_confirmed_at?: string;
}

interface UserPlan {
  plan_type: string;
  credits: number;
}

interface UseUserAndPlanReturn {
  user: User | null;
  userError: Error | null | undefined; // Adjust this line
  userPlan: UserPlan | null;
  planError: Error | null | undefined; // Adjust this line
  isLoading: boolean;
  isError: boolean;
}

const fetchUser = async (): Promise<User> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error("Failed to fetch user details.");
  if (!data.user) throw new Error("No user data available.");
  return data.user;
};

const fetchUserPlan = async (userId: string): Promise<UserPlan> => {
  const supabase = createClient();
  if (!userId) throw new Error("User ID is required");
  const { data, error } = await supabase
    .from("user_plan")
    .select("plan_type, credits")
    .eq("userId", userId)
    .single();
  if (error) throw new Error("Failed to fetch user plan.");
  return data;
};

export function useUserAndPlan(): UseUserAndPlanReturn {
  const { data: user, error: userError } = useSWR<User, Error>(
    "user",
    fetchUser
  );
  const { data: userPlan, error: planError } = useSWR<UserPlan, Error>(
    user ? ["user_plan", user?.id] : null,
    () => fetchUserPlan(user?.id || ""),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  return {
    user: user || null,
    userError: userError || null,
    userPlan: userPlan || null,
    planError: planError || null,
    isLoading: !user && !userPlan,
    isError: !!userError || !!planError,
  };
}
