import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { KeyedMutator } from "swr";
interface User {
  id: string;
  email?: string | null;
  aud: string;
  role?: string;
  email_confirmed_at?: string;
}

interface UserPlan {
  plan_type: string;
  credits: number;
}

interface UseUserAndPlanReturn {
  user: User | null;
  userError: Error | null;
  userPlan: UserPlan | null;
  planError: Error | null;
  isLoading: boolean;
  isError: boolean;
  mutateUser: KeyedMutator<User | null>;
  mutateUserPlan: KeyedMutator<UserPlan | null>;
}

// Adjusting the fetchUser function to directly include the email
const fetchUser = async (): Promise<User | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return {
    ...data.user,
    email: data.user.email || null, // Ensure email is explicitly handled
  };
};

const fetchUserPlan = async (userId: string): Promise<UserPlan | null> => {
  const supabase = createClient();
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_plan")
    .select("plan_type, credits")
    .eq("userId", userId)
    .single();
  if (error || !data) return null;
  return data;
};

export function useUserAndPlan(): UseUserAndPlanReturn {
  const {
    data: user,
    error: userError,
    mutate: mutateUser,
  } = useSWR<User | null, Error>("user", fetchUser);

  const {
    data: userPlan,
    error: planError,
    mutate: mutateUserPlan,
  } = useSWR<UserPlan | null, Error>(user ? ["user_plan", user.id] : null, () =>
    fetchUserPlan(user?.id || "")
  );

  return {
    user: user ?? null,
    userError: userError ?? null,
    userPlan: userPlan ?? null,
    planError: planError ?? null,
    isLoading: !user && !userPlan,
    isError: !!userError || !!planError,
    mutateUser,
    mutateUserPlan,
  };
}
