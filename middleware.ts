import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const currentUser = request.cookies.get("authToken")?.value;
//   if (!currentUser) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   } 
// }
//"/Chat/:path*",
import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";
export default createMiddleware({
  // A list of all locales that are supported

  // Used when no locale matches
  defaultLocale: "english",
  localePrefix,
  locales,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(bangla|english|canada|china|france|germany|india|japan|russia)/:path*"],
};