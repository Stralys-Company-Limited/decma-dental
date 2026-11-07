import type { ComponentProps, ReactNode } from "react";
import { HONEYPOT_FIELD } from "@/lib/forms";

const control =
  "mt-1.5 block w-full border border-navy-40 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-60 focus:border-navy focus:outline-none focus:ring-2 focus:ring-teal/50 aria-invalid:border-red-700";

export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-ink-60">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function TextInput({
  id,
  error,
  hint,
  ...rest
}: { id: string; error?: string; hint?: string } & ComponentProps<"input">) {
  return (
    <input
      id={id}
      name={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, error, hint)}
      className={control}
      {...rest}
    />
  );
}

export function Select({
  id,
  error,
  options,
  ...rest
}: { id: string; error?: string; options: { value: string; label: string }[] } & ComponentProps<"select">) {
  return (
    <select
      id={id}
      name={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, error)}
      className={control}
      {...rest}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function TextArea({ id, error, ...rest }: { id: string; error?: string } & ComponentProps<"textarea">) {
  return (
    <textarea
      id={id}
      name={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, error)}
      className={`${control} min-h-28`}
      {...rest}
    />
  );
}

export function Checkbox({
  id,
  error,
  children,
  ...rest
}: { id: string; error?: string; children: ReactNode } & ComponentProps<"input">) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-4 shrink-0 accent-navy"
          {...rest}
        />
        <label htmlFor={id} className="text-xs leading-relaxed text-ink-80">
          {children}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 pl-7 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

/** Off-screen field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormAlert({ status, message }: { status: "success" | "error"; message: string }) {
  return (
    <p
      role={status === "error" ? "alert" : "status"}
      className={`border-l-4 px-4 py-3 text-sm ${
        status === "success" ? "border-teal bg-teal-20 text-navy-deep" : "border-red-700 bg-red-50 text-red-800"
      }`}
    >
      {message}
    </p>
  );
}
