import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";

async function getUserEmail(): Promise<string | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}

export async function AppShell({ children }: { children: React.ReactNode }) {
  const userEmail = await getUserEmail();

  return (
    <div className="flex min-h-screen">
      <Sidebar userEmail={userEmail} />
      <main className="flex flex-1 flex-col overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
