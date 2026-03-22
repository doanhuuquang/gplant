import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/lib/enums/role";
import { APP_PATHS } from "@/lib/constants/app-paths";

const intlMiddleware = createMiddleware(routing);

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const decodeJwtPayload = (token: string): JwtPayload | null => {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
};

const hasAdminRole = (payload: JwtPayload | null): boolean => {
  if (!payload) return false;
  const roles = payload[ROLE_CLAIM];
  if (Array.isArray(roles)) {
    return roles.includes(Role.Admin) || roles.includes(Role.Manager);
  }
  return roles === Role.Admin || roles === Role.Manager;
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];

  const isAuthPage =
    pathname.includes("/sign-in") ||
    pathname.includes("/sign-up") ||
    pathname.includes("/reset-password") ||
    pathname.includes("/recover-usernames");

  const isRequireAuthPage =
    pathname.includes(APP_PATHS.SHOP_CART) ||
    pathname.includes(APP_PATHS.SHOP_SHIPPING) ||
    pathname.includes(APP_PATHS.SHOP_REVIEW) ||
    pathname.includes(APP_PATHS.SHOP_ORDER_CONFIRMATION) ||
    pathname.includes(APP_PATHS.USER_ACCOUNT) ||
    pathname.includes(APP_PATHS.USER_ADDRESSES) ||
    pathname.includes(APP_PATHS.USER_ORDERS);

  const isLocale = locale === "vi" || locale === "en";
  const adminSegment = isLocale ? segments[1] : segments[0];
  const isAdminPath = adminSegment === "admin";

  const authToken = request.cookies.get("ACCESS_TOKEN")?.value;

  if (isAuthPage && authToken) {
    const redirectLocale = isLocale ? locale : "";
    return NextResponse.redirect(
      new URL(`http://localhost:3000/${redirectLocale}`, request.url),
    );
  }

  if (isAdminPath && !authToken) {
    const redirectLocale = isLocale ? locale : "";
    return NextResponse.redirect(
      new URL(`http://localhost:3000/${redirectLocale}/sign-in`, request.url),
    );
  }

  if (isAdminPath && authToken) {
    const payload = decodeJwtPayload(authToken);
    if (!hasAdminRole(payload)) {
      const redirectLocale = isLocale ? locale : "";
      return NextResponse.redirect(
        new URL(`http://localhost:3000/${redirectLocale}`, request.url),
      );
    }
  }

  if (isRequireAuthPage && !authToken) {
    const redirectLocale = isLocale ? locale : "";
    return NextResponse.redirect(
      new URL(`http://localhost:3000/${redirectLocale}/sign-in`, request.url),
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/(vi|en)/:path*"],
};
