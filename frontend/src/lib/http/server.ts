import { cookies, headers } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_API_URL!;

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

async function toApiError(res: Response) {
  let body: any = undefined;
  try {
    body = await res.json();
  } catch {}
  return new Error(body?.message || `API ${res.status}`);
}
