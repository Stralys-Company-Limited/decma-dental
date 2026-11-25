"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions";
import { initialFormState } from "@/lib/forms";
import { btn } from "@/components/Shell";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initialFormState);
  return (
    <form action={action} className="mx-auto mt-16 max-w-md space-y-4 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Clinic desk</h1>
      <p className="text-sm text-ink-80">Sign in with your staff account.</p>
      <label className="block text-sm">
        <span className="font-semibold">Email</span>
        <input name="email" type="email" required className="mt-1 w-full border border-navy-40 px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Password</span>
        <input name="password" type="password" required minLength={6} className="mt-1 w-full border border-navy-40 px-3 py-2" />
      </label>
      {state.status === "error" && <p className="text-sm text-ink-80">{state.message}</p>}
      <button disabled={pending} className={btn("navy", "w-full py-2 text-sm")}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
