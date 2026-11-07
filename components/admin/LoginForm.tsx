"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions/admin";
import { initialFormState } from "@/lib/forms";
import { Button } from "@/components/ui/Button";
import { Field, FormAlert, TextInput } from "@/components/forms/Fields";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initialFormState);
  return (
    <form action={action} className="space-y-5">
      <Field id="email" label="Email">
        <TextInput id="email" type="email" autoComplete="username" required />
      </Field>
      <Field id="password" label="Password">
        <TextInput id="password" type="password" autoComplete="current-password" required />
      </Field>
      {state.status === "error" && state.message && <FormAlert status="error" message={state.message} />}
      <Button type="submit" variant="navy" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
