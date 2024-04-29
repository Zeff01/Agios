import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

export default function Index() {
  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();
  console.log("isSupabaseConnected:", isSupabaseConnected);

  // Dummy data for blog posts
  const blogPosts = [
    {
      id: 1,
      title: "First Post",
      summary: "This is the summary of the first post.",
    },
    {
      id: 2,
      title: "Second Post",
      summary: "This is the summary of the second post.",
    },
    {
      id: 3,
      title: "Third Post",
      summary: "This is the summary of the third post.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 text-gray-800">
      <Toaster />
      <nav className="w-full border-b border-gray-300 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <div className="text-lg font-semibold">
            <Link href="/">AGIOS</Link>
          </div>
          <AuthButton />
        </div>
      </nav>
      <main className="flex-grow container mx-auto text-center py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Application</h1>
        <p className="text-gray-600 text-lg mb-8">
          Start building something amazing.
        </p>
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="text-gray-600">{post.summary}</p>
              <Link
                href={`/posts/${post.id}`}
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/subscription"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Subscribe Now
          </Link>
        </div>
      </main>
      <footer className="w-full py-4 border-t border-gray-300 bg-white">
        <div className="max-w-6xl mx-auto flex justify-center text-xs">
          <p>
            Powered by{" "}
            <Link
              className="font-bold hover:text-blue-500 underline"
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            >
              Agios
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
