import { createClient } from "@/utils/supabase/server";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest) {
  try {
    // Parse the request body
    const { email, password, firstname, lastname } = req.body;
    console.log("req.body:", req.body);

    // Create a Supabase client instance
    const supabase = createClient();

    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Sign up the user using Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    // Handle errors during sign-up
    if (error) {
      console.error("Signup error:", error);
      return NextResponse.json(
        { error: "Could not authenticate user" },
        { status: 401 }
      );
    }

    // Extract the user object from the response data
    const { user } = data;

    // Check if the user object exists
    if (user) {
      // Prepare user profile data
      const profileData = { id: user.id, firstname, lastname, isPaid: false };

      // Insert user profile data into the database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert([profileData]);

      // Handle errors during profile creation
      if (profileError) {
        console.error("Profile creation error:", profileError);
        return NextResponse.json(
          { error: "Failed to set up user profile" },
          { status: 500 }
        );
      }

      // Return success response
      return NextResponse.json(
        {
          message: "Check your email to continue the sign-in process",
          redirectTo: "/login",
        },
        { status: 200 }
      );
    } else {
      // Return error response if user object is not found
      return NextResponse.json(
        { error: "User was not created successfully" },
        { status: 500 }
      );
    }
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
