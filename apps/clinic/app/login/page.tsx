import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getStaffUser, isAuthConfigured } from "@decma/db/auth";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-sm">Loading…</div>}>
      <Login />
    </Suspense>
  );
}

async function Login() {
  await connection();
  if (!isAuthConfigured()) {
    return (
      <div className="container-page py-16">
        <p className="bg-white p-6 text-sm">
          Supabase Auth is not configured. Set the environment variables from the root <code>.env.example</code>.
        </p>
      </div>
    );
  }
  if (await getStaffUser()) redirect("/");
  return <LoginForm />;
}
