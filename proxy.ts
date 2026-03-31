import { NextResponse, NextRequest } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(request: NextRequest) {
  const session = await getSession();

  const isInSignInPage = request.nextUrl.pathname.startsWith("/sign-in");
  const isInSignUpPage = request.nextUrl.pathname.startsWith("/sign-up");

  if ((isInSignInPage || isInSignUpPage) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
