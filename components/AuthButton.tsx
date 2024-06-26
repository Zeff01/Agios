"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const AuthButton = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
      return;
    }
    setUser(user);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }
    router.push("/login");
  };

  if (user) {
    return (
      <div className="flex items-center gap-4 px-4 py-2 rounded-md">
        <span className="font-medium text-white">Hey, {user.email}!</span>
        <button
          onClick={signOut}
          className="py-2 px-4 rounded-md text-white border-2 hover:bg-gray-900"
        >
          Logout
        </button>
      </div>
    );
  } else {
    return (
      <Link
        href="/login"
        className="inline-block py-2 px-3 rounded-md text-white focus:outline-none focus:ring-2 border-2 hover:bg-gray-900"
      >
        Login
      </Link>
    );
  }
};

export default AuthButton;
