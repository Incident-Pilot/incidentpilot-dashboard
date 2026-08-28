// Single-user session storage: a signed, httpOnly cookie holding a session
// flag (iron-session encrypts+signs, no server-side session store needed).
//
// SESSION_COOKIE_NAME is exported (not secret) for proxy.ts to read the raw
// cookie via NextRequest without importing this "server-only" module's
// getSession()/SESSION_SECRET-dependent parts.
import "server-only";

import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export interface SessionData {
  isLoggedIn: boolean;
  username: string;
}

export const SESSION_COOKIE_NAME = "incidentpilot_session";

const sessionOptions: SessionOptions = {
  cookieName: SESSION_COOKIE_NAME,
  password: process.env.SESSION_SECRET ?? "",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set (see .env.example)");
  }
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
