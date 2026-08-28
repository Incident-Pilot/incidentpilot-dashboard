// Single hardcoded user, checked against env vars -- see .env.example for
// how DASHBOARD_PASSWORD_HASH is generated. No user table, no roles.
import "server-only";

import bcrypt from "bcryptjs";

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.DASHBOARD_USERNAME;
  const expectedHash = process.env.DASHBOARD_PASSWORD_HASH;
  if (!expectedUsername || !expectedHash) {
    throw new Error(
      "DASHBOARD_USERNAME and DASHBOARD_PASSWORD_HASH must be set (see .env.example)",
    );
  }

  // Always run the bcrypt compare, even on a wrong username, so a request
  // with a bad username doesn't return measurably faster than one with a
  // bad password -- keeps the response from leaking which field was wrong.
  const passwordMatches = await bcrypt.compare(password, expectedHash);
  return username === expectedUsername && passwordMatches;
}
