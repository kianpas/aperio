import { cookies } from "next/headers";

// Resolve backend base URL with sensible fallbacks for dev
const BASE =
  process.env.BACKEND_API_URL ||
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function serverFetch(path: string, init: RequestInit = {}) {
  if (!BASE || BASE === "undefined") {
    throw new Error(
      "BACKEND_API_URL is not configured. Set it in your environment (.env.local)."
    );
  }

  const base = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Next.js 14+ dynamic API: await cookies()
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
    .join("; ");

  const h = new Headers(init.headers);
  if (cookieHeader) h.set("cookie", cookieHeader);

  const cacheOption = init.cache ?? (init.next ? undefined : "no-store");

  const res = await fetch(`${base}${normalizedPath}`, {
    ...init,
    headers: h,
    // 서버에서 민감 데이터는 기본적으로 캐시하지 않음
    cache: cacheOption,
  });
  if (!res.ok) throw await toApiError(res);
  return res;
}

async function toApiError(res: Response): Promise<Error> {
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  let message = `API ${res.status}`;
  if (typeof body === "object" && body !== null && "message" in body) {
    const maybeMsg = (body as { message?: unknown }).message;
    if (typeof maybeMsg === "string" && maybeMsg.trim().length > 0) {
      message = maybeMsg;
    }
  }

  return new Error(message);
}
