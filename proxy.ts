import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.includes("/sign-in") ||
    pathname.includes("/sign-up") ||
    pathname.includes("/reset-password") ||
    pathname.includes("/recover-usernames");

  const authToken = request.cookies.get("ACCESS_TOKEN")?.value;

  if (isAuthPage && authToken) {
    const locale = pathname.split("/")[1];
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/(vi|en)/:path*"],
};
