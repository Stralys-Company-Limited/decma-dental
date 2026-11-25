import { redirect } from "next/navigation";
import { getStaffUser, isAuthConfigured } from "@decma/db/auth";

export async function requireClinicStaff() {
  if (!isAuthConfigured()) {
    return { kind: "unconfigured" as const, staff: null };
  }
  const staff = await getStaffUser();
  if (!staff) redirect("/login");
  return { kind: "ok" as const, staff };
}
