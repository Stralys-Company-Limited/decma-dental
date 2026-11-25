export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  values?: Record<string, string>;
  fieldErrors?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };
