import { demoCall } from "./demo";

const DEMO = import.meta.env.VITE_DEMO === "true";
const NS = "automategenie_core.api";

let csrfToken: string | undefined;
export const setCsrfToken = (t?: string) => { csrfToken = t; };
export const isDemo = DEMO;

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

/** Pull a readable message out of Frappe's error payloads. */
function frappeMessage(body: any, fallback: string): string {
  try {
    if (body?._server_messages) {
      const msgs = JSON.parse(body._server_messages).map((m: string) => JSON.parse(m).message);
      if (msgs.length) return msgs.join(" ").replace(/<[^>]+>/g, "");
    }
  } catch { /* fall through */ }
  return body?.message && typeof body.message === "string" ? body.message : fallback;
}

/** Call a whitelisted method, e.g. call("sales.list_quotes", { limit: 10 }). */
export async function call<T>(method: string, args: Record<string, unknown> = {}, post = false): Promise<T> {
  if (DEMO) return demoCall<T>(method, args);

  const url = `/api/method/${method.startsWith(NS) ? method : `${NS}.${method}`}`;
  const init: RequestInit = { credentials: "include", headers: { Accept: "application/json" } };
  let target = url;
  if (post) {
    init.method = "POST";
    init.headers = { ...init.headers, "Content-Type": "application/json", ...(csrfToken ? { "X-Frappe-CSRF-Token": csrfToken } : {}) };
    init.body = JSON.stringify(args);
  } else if (Object.keys(args).length) {
    target += "?" + new URLSearchParams(Object.entries(args).map(([k, v]) => [k, String(v)]));
  }

  const res = await fetch(target, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(frappeMessage(body, `Request failed (${res.status}).`), res.status);
  return body.message as T;
}

export async function login(usr: string, pwd: string) {
  if (DEMO) return;
  const res = await fetch("/api/method/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ usr, pwd }),
  });
  if (!res.ok) throw new ApiError("That email and password don't match an account.", res.status);
}

export async function logout() {
  if (DEMO) return;
  await fetch("/api/method/logout", { method: "POST", credentials: "include" }).catch(() => {});
}
