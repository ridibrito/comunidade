import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function RootRedirect() {
  redirect("/auth/login");
}

// remove conteúdo de template e mantenha apenas o redirect
