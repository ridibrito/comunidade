import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RootRedirect() {
  const user = await getServerUser();
  if (user) {
    redirect("/dashboard");
  }
  redirect("/auth/login");
}

// remove conteúdo de template e mantenha apenas o redirect
