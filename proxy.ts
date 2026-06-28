import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/home", "/transactions", "/contacts"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  const authCookie = req.cookies.get("auth-storage")?.value;

  let isAuthenticated = false;
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      isAuthenticated = authData?.state?.isAuthenticated ?? false;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublicRoute && isAuthenticated && !path.startsWith("/home")) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$).*)"],
};
