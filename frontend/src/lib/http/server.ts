import { cookies } from "next/headers";

const BASE = process.env.BACKEND_API_URL !;

export async function serverFetch(path: string, init: RequestInit = {}) {
  const cookie = cookies().toString();
  const h = new Headers(init.headers);
  if (cookie) h.set("cookie", cookie);

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: h,
    // 서버에서 민감 데이터는 기본적으로 캐시하지 않음
    cache: "no-store",
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
