// Next.js 16 renamed the `middleware.ts` convention to `proxy.ts`
// (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
// -- middleware.ts is deprecated but functionally identical, just renamed).
//
// Protects the entire app by default: every request must carry a valid
// session cookie, except the two paths explicitly allow-listed below. New
// routes (e.g. the resolve/cancel status route) are covered automatically
// -- nothing to remember to add here.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unsealData } from "iron-session";
import { SESSION_COOKIE_NAME, type SessionData } from "@/lib/session";

const PUBLIC_PATHS = new Set(["/login", "/api/login"]);

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!secret || !cookie) {
    return false;
  }

  try {
    const data = await unsealData<SessionData>(cookie, { password: secret });
    return data.isLoggedIn === true;
  } catch {
    // Malformed/expired/tampered cookie -- treat as unauthenticated.
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (await isAuthenticated(request)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
