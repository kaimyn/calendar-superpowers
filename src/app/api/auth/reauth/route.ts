import { signOut } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Clears the session then redirects to sign-in, preserving the original callbackUrl.
export async function GET(req: NextRequest) {
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") ?? "/";
  await signOut({ redirect: false });
  const signinUrl = `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  return NextResponse.redirect(new URL(signinUrl, req.url));
}
