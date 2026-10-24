import { createHash } from "crypto";
import { cookies } from "next/headers";

export const adminPassword = () => process.env.ADMIN_PASSWORD || "himitsu-admin";
export const adminToken = () => createHash("sha256").update("himitsu:" + adminPassword()).digest("hex");

export async function isAdmin() {
  return (await cookies()).get("admin")?.value === adminToken();
}
