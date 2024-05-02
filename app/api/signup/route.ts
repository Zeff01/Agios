import { createClient } from "@/utils/supabase/server";
import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";

// Define an interface for the request body
interface SignUpRequestBody {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export async function POST(req: Request, res: NextApiResponse) {
  try {
    // Typecast req.body to SignUpRequestBody
    const { email, password, firstname, lastname }: SignUpRequestBody =
      await req.json();

    const supabase = createClient();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    // Call supabase.auth.getUser() before supabase.auth.getSession()
    await supabase.auth.getUser();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    if (signUpError) {
      console.error("Signup error:", signUpError);
      return NextResponse.json(
        { error: "Could not authenticate user" },
        { status: 401 }
      );
    }

    const { user } = signUpData;

    if (user) {
      const profileData = {
        userId: user.id,
        firstName: firstname,
        lastName: lastname,
        isPaid: false,
        email: email,
      };

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .insert([profileData]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        return NextResponse.json(
          { error: profileError.message || "Failed to set up user profile" },
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
