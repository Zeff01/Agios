import { createClient } from "@/utils/supabase/server";

export async function POST(req: any, res: any) {
  const { email, password } = req.body;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ message: "Could not authenticate user" });
  }

  res
    .status(200)
    .json({ message: "Authentication successful", redirectTo: "/protected" });
}
