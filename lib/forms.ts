export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Submitted values, returned on error so the form can be refilled after React resets it. */
  values?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };

/** Name of the hidden field used to catch bots. Real users never see or fill it. */
export const HONEYPOT_FIELD = "website";
