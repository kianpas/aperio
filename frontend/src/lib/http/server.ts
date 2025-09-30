import { cookies } from "next/headers";

// Resolve backend base URL with sensible fallbacks for dev
const BASE =
  process.env.BACKEND_API_URL ||
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

// fetch 옵션 + 개발 편의를 위한 timeout 설정을 허용
type ServerFetchInit = RequestInit & { timeoutMs?: number };

// SSR 전용 공통 fetch 래퍼
export async function serverFetch(path: string, init: ServerFetchInit = {}) {
  if (!BASE || BASE === "undefined") {
    throw new Error("BACKEND_API_URL(.env.local)이 설정되지 않았습니다.");
  }

  const base = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  //서버 컴포넌트에서 await cookies()
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
    .join("; ");

  const { timeoutMs = 5000, headers, cache, ...restInit } = init;
  const mergedHeaders = new Headers(
    headers instanceof Headers
      ? Object.fromEntries(headers.entries())
      : headers ?? {}
  );

  if (cookieHeader) mergedHeaders.set("cookie", cookieHeader);

  // cache 기본값은 보안 지침상 no-store (Next 확장 옵션도 그대로 사용 가능)
  const cacheOption = cache ?? (restInit.next ? undefined : "no-store");

  //비동기 작업을 중간에 취소(cancel)할 때 사용하는 API
  //타임아웃 설정이 있으면 일정 시간이 지난 후 자동으로 취소
  const controller = new AbortController();
  //controller.abort();를 호출하면 signal을 건 모든 작업이 즉시 중단
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${base}${normalizedPath}`, {
      ...init,
      headers: mergedHeaders,
      // 서버에서 민감 데이터는 기본적으로 캐시하지 않음
      cache: cacheOption,
      signal: controller.signal,
    });
    if (!res.ok) throw await toApiError(res);
    return res;
  } catch (err) {
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function toApiError(res: Response): Promise<Error> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  const message =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as any).message === "string"
      ? (body as any).message.trim()
      : `API ${res.status} ${res.statusText}`.trim();

  return new Error(message);
}
