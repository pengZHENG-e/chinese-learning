import { cookies } from "next/headers";
import { getKV } from "@/lib/kv";

export const SESSION_COOKIE = "cl_sid";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
export const MAGIC_TTL_SECONDS = 60 * 15; // 15 minutes

const sessionKey = (id: string) => `session:${id}`;
const magicKey = (token: string) => `magic:${token}`;

/** Returns the email for the current session cookie, or null. */
export async function getSessionEmail(): Promise<string | null> {
  const kv = getKV();
  if (!kv) return null;
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const email = await kv.get<string>(sessionKey(id));
  return email ?? null;
}

/** Issues a new session for `email`, sets cookie, returns session id. */
export async function createSession(email: string): Promise<string> {
  const kv = getKV();
  if (!kv) throw new Error("KV not configured");
  const id = randomToken(32);
  await kv.set(sessionKey(id), email, { ex: SESSION_TTL_SECONDS });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return id;
}

export async function destroySession(): Promise<void> {
  const kv = getKV();
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id && kv) await kv.del(sessionKey(id));
  jar.delete(SESSION_COOKIE);
}

/** Issues a one-time magic-link token for `email`, returns the token. */
export async function createMagicToken(email: string): Promise<string> {
  const kv = getKV();
  if (!kv) throw new Error("KV not configured");
  const token = randomToken(32);
  await kv.set(magicKey(token), email.toLowerCase(), { ex: MAGIC_TTL_SECONDS });
  return token;
}

/** Consumes a magic-link token (single-use). Returns the email or null. */
export async function consumeMagicToken(token: string): Promise<string | null> {
  const kv = getKV();
  if (!kv) return null;
  const email = await kv.get<string>(magicKey(token));
  if (!email) return null;
  await kv.del(magicKey(token));
  return email;
}

function randomToken(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  let s = "";
  for (const b of bytes) s += b.toString(16).padStart(2, "0");
  return s;
}
