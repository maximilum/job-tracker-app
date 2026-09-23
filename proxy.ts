import { NextResponse, NextRequest } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(request: NextRequest) {
  const session = await getSession();

  const isInSignInPage = request.nextUrl.pathname.startsWith("/sign-in");
  const isInSignUpPage = request.nextUrl.pathname.startsWith("/sign-up");
  const isInDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // Redirect authenticated users away from auth pages to dashboard
  if ((isInSignInPage || isInSignUpPage) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Guard dashboard for unauthenticated users (Fixes Bug 6.3)
  if (isInDashboard && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// Route matcher configuration so proxy only executes on relevant paths
export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
