import createMiddleware from "next-intl/middleware";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/lib/enums/role";
import { routing } from "./i18n/routing";

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
    pathname.includes(APP_PATHS.SIGN_IN) ||
    pathname.includes(APP_PATHS.SIGN_UP) ||
    pathname.includes(APP_PATHS.RESET_PASSWORD) ||
    pathname.includes(APP_PATHS.RECOVER_USERNAME);

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
    return NextResponse.redirect(
      new URL(`http://localhost:3000/sign-in`, request.url),
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
    return NextResponse.redirect(
      new URL(`http://localhost:3000/sign-in`, request.url),
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/(vi|en)/:path*"],
};
