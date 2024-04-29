import { createClient } from "@/utils/supabase/server";
import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    console.log("Entering POST handler for sign-in...");

    const { email, password } = await req.json();
    const supabase = createClient();

    if (!email || !password) {
      console.log("Email and password are required.");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Signing in user...");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign-in error:", error);
      return NextResponse.json(
        { error: "Could not authenticate user" },
        { status: 401 }
      );
    }

    console.log("User authenticated successfully.");
    return NextResponse.json(
      {
        message: "Authentication successful",
        redirectTo: "/subscription",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
