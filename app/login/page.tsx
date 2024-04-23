"use client";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { SubmitButton } from "./submit-button";

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
  console.log("formState:", formState);
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn");

  // Handle form input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  // General form submission handler
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    endpoint: string
  ) => {
    event.preventDefault();

    // Validate fields here before submitting
    if (
      activeTab === "signUp" &&
      formState.password !== formState.confirmPassword
    ) {
      alert("Passwords do not match.");
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
      alert(result.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto mt-20">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-white bg-blue-600 hover:bg-blue-700 flex items-center group text-sm"
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
      <div className="tabs flex border-b-2">
        <button
          className={`tab flex-1 text-center py-2 font-semibold ${
            activeTab === "signIn"
              ? "text-blue-600 border-blue-600 border-b-2"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("signIn")}
        >
          Sign In
        </button>
        <button
          className={`tab flex-1 text-center py-2 font-semibold ${
            activeTab === "signUp"
              ? "text-blue-600 border-blue-600 border-b-2"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("signUp")}
        >
          Sign Up
        </button>
      </div>
      {activeTab === "signIn" && (
        <form
          className="animate-in flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg mt-4"
          onSubmit={(e) => handleSubmit(e, "/api/signin")}
        >
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            className="input text-lg rounded-lg border px-4 py-2"
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
            className="input text-lg rounded-lg border px-4 py-2"
            type="password"
            name="password"
            required
            value={formState.password}
            onChange={handleChange}
          />
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot password?
          </Link>
          <SubmitButton
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 mt-4"
            pendingText="Signing In..."
            children="Sign In"
          />
        </form>
      )}
      {activeTab === "signUp" && (
        <form
          className="animate-in flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg mt-4"
          onSubmit={(e) => handleSubmit(e, "/api/signup")}
        >
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            className="input text-lg rounded-lg border px-4 py-2"
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
            className="input text-lg rounded-lg border px-4 py-2"
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
            className="input text-lg rounded-lg border px-4 py-2"
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
            className="input text-lg rounded-lg border px-4 py-2"
            name="firstname"
            required
            value={formState.firstname}
            onChange={handleChange}
          />
          <label htmlFor="lastname" className="font-semibold">
            Last Name
          </label>
          <input
            className="input text-lg rounded-lg border px-4 py-2"
            name="lastname"
            required
            value={formState.lastname}
            onChange={handleChange}
          />
          <SubmitButton
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg px-4 py-2 mt-4"
            pendingText="Signing Up..."
            children="Sign Up"
          />
        </form>
      )}
      {searchParams?.message && (
        <p className="p-4 text-center text-red-500">{searchParams.message}</p>
      )}
    </div>
  );
}
