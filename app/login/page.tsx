"use client";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { SubmitButton } from "./submit-button";
import { useToast } from "@/components/ui/use-toast";
interface LoginProps {
  searchParams: { message: string };
}

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
}

export default function Login({ searchParams }: LoginProps) {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
  });
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn");
  const { toast } = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    endpoint: string
  ) => {
    event.preventDefault();

    if (
      activeTab === "signUp" &&
      formState.password !== formState.confirmPassword
    ) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
      });
      return;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formState),
    });
    const result = await response.json();
    if (response.ok) {
      window.location.href = result.redirectTo;
    } else {
      toast({ title: "Error", description: result.message });
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full items-center justify-center px-8  gap-8  bg-black  ">
      <div>
        <Link
          href="/"
          className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-white flex items-center group text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
      </div>

      <div className="w-[500px] mx-auto flex flex-col">
        <div className="text-white text-2xl mb-4">
          Hello You could sign in to your account here
        </div>
        <div className="tabs flex ">
          <button
            className={`tab flex-1 text-center py-2 font-semibold ${
              activeTab === "signIn"
                ? "text-green-500 border-green-500 border-b-2"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("signIn")}
          >
            Sign In
          </button>
          <button
            className={`tab flex-1 text-center py-2 font-semibold ${
              activeTab === "signUp"
                ? "text-green-500 border-green-500 border-b-2"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("signUp")}
          >
            Sign Up
          </button>
        </div>
        {activeTab === "signIn" && (
          <form
            className=" shadow-green-500 animate-in flex flex-col gap-8 p-8 bg-black text-white shadow-md rounded-lg mt-4"
            onSubmit={(e) => handleSubmit(e, "/api/signin")}
          >
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              className="input text-lg rounded-lg px-4 py-2 bg-zinc-900"
              name="email"
              type="email"
              required
              value={formState.email}
              onChange={handleChange}
            />
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              className="input text-lg rounded-lg px-4 py-2 bg-zinc-900"
              type="password"
              name="password"
              required
              value={formState.password}
              onChange={handleChange}
            />
            <Link
              href="/forgot-password"
              className="text-sm text-green-600 hover:text-green-800"
            >
              Forgot password?
            </Link>
            <SubmitButton
              className="bg-black-500 hover:bg-black-600 border text-white rounded-lg px-4 py-2 mt-4"
              pendingText="Signing In..."
              children="Sign In"
            />
          </form>
        )}
        {activeTab === "signUp" && (
          <form
            className=" shadow-green-500 animate-in flex flex-col gap-4 p-8 bg-black text-white shadow-md rounded-lg mt-4"
            onSubmit={(e) => handleSubmit(e, "/api/signup")}
          >
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              className="input text-lg rounded-lg border px-4 py-2 bg-zinc-900 border-none"
              name="email"
              type="email"
              required
              value={formState.email}
              onChange={handleChange}
            />
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              className="input text-lg rounded-lg border px-4 py-2 bg-zinc-900 border-none"
              type="password"
              name="password"
              required
              value={formState.password}
              onChange={handleChange}
            />
            <label htmlFor="confirmPassword" className="font-semibold">
              Confirm Password
            </label>
            <input
              className="input text-lg rounded-lg border px-4 py-2 bg-zinc-900 border-none"
              type="password"
              name="confirmPassword"
              required
              value={formState.confirmPassword}
              onChange={handleChange}
            />
            <label htmlFor="firstname" className="font-semibold">
              First Name
            </label>
            <input
              className="input text-lg rounded-lg border px-4 py-2 bg-zinc-900 border-none"
              name="firstname"
              required
              value={formState.firstname}
              onChange={handleChange}
            />
            <label htmlFor="lastname" className="font-semibold">
              Last Name
            </label>
            <input
              className="input text-lg rounded-lg border px-4 py-2 bg-zinc-900 border-none"
              name="lastname"
              required
              value={formState.lastname}
              onChange={handleChange}
            />
            <SubmitButton
              className="border-white-500 text-white-500 hover:bg-green-500 hover:text-white rounded-lg px-4 py-2 mt-4 border"
              pendingText="Signing Up..."
              children="Sign Up"
            />
          </form>
        )}
        {searchParams?.message && (
          <p className="p-4 text-center text-red-500">{searchParams.message}</p>
        )}
      </div>
    </div>
  );
}
