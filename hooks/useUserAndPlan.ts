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
  userEmail: string;
  paymentDate: Date;
  expirationDate: Date;
  status: string;
  subscription_id: string;
}

interface UseUserAndPlanReturn {
  user: User | null;
  userError: Error | null;
  userPlan: UserPlan | null;
  planError: Error | null;
  firstName: string | null | undefined;
  isLoading: boolean;
  isError: boolean;
  mutateUser: KeyedMutator<User | null>;
  mutateUserPlan: KeyedMutator<UserPlan | null>;
}

// Type for handling extended error information
interface ExtendedError extends Error {
  status?: number;
}

const fetchUser = async (): Promise<User | null> => {
  const supabase = createClient();
  const sessionResult = await supabase.auth.getSession();

  if (sessionResult.error) {
    console.error("Session error:", sessionResult.error);
    return null;
  }

  if (sessionResult.data) {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
      return null;
    }
    return data ? { ...data.user, email: data.user.email || null } : null;
  }
  return null;
};

const fetchUserPlan = async (userId: string): Promise<UserPlan | null> => {
  const supabase = createClient();
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_plan")
    .select(
      "plan_type, credits, userEmail, paymentDate, expirationDate, status, subscription_id"
    )
    .eq("userId", userId)
    .single();
  if (error || !data) return null;
  return data;
};

const fetchFirstName = async (userId: string): Promise<string | null> => {
  const supabase = createClient();
  if (!userId) return null;
  const { data, error } = await supabase
    .from("users")
    .select("firstName")
    .eq("userId", userId)
    .single();

  if (error || !data) {
    console.error("Error fetching first name:", error);
    return null;
  }

  return data.firstName;
};

export function useUserAndPlan(): UseUserAndPlanReturn {
  const {
    data: user,
    error: userError,
    mutate: mutateUser,
  } = useSWR<User | null, ExtendedError>("user", fetchUser);
  const userId = user?.id;

  const {
    data: userPlan,
    error: planError,
    mutate: mutateUserPlan,
  } = useSWR<UserPlan | null, ExtendedError>(
    userId ? ["user_plan", userId] : null,
    () => fetchUserPlan(userId!)
  );

  const { data: firstName, error: firstNameError } = useSWR<
    string | null,
    ExtendedError
  >(userId ? ["firstName", userId] : null, () => fetchFirstName(userId!));

  const isLoading = !user && !userError;

  const isError = !!(userError || planError || firstNameError);
  return {
    user: user ?? null,
    firstName,
    userError: userError ?? null,
    userPlan: userPlan ?? null,
    planError: planError ?? null,
    isLoading,
    isError,
    mutateUser,
    mutateUserPlan,
  };
}
