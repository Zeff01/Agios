import { createClient } from "@/utils/supabase/server";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest) {
  try {
    const { email, password, firstname, lastname } = req.body;
    console.log("req.body:", req.body);
    const supabase = createClient();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Signup error:", error);
      return NextResponse.json(
        { error: "Could not authenticate user" },
        { status: 401 }
      );
    }

    const { user } = data;

    if (user) {
      const profileData = { id: user.id, firstname, lastname, isPaid: false };

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert([profileData]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        return NextResponse.json(
          { error: "Failed to set up user profile" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          message: "Check your email to continue the sign-in process",
          redirectTo: "/login",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "User was not created successfully" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
