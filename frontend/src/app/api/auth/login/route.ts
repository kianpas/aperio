import { NextRequest, NextResponse } from "next/server";

interface LoginPayload {
  email?: string;
  password?: string;
}

const BACKEND_BASE_URL =
  process.env.BACKEND_API_URL ||
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

const LOGIN_ENDPOINT = "/api/v1/auth/login";
const REQUEST_TIMEOUT_MS = 5000;

export async function POST(request: NextRequest) {
  if (!BACKEND_BASE_URL || BACKEND_BASE_URL === "undefined") {
    return NextResponse.json(
      { message: "BACKEND_API_URL(.env.local) configuration missing. Please verify the value." },
      { status: 500 }
    );
  }

  let payload: LoginPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body could not be parsed as JSON." },
      { status: 400 }
    );
  }

  if (!payload?.email || !payload?.password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const headers = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    });

    const forwardedCookies = request.headers.get("cookie");
    if (forwardedCookies) {
      headers.set("cookie", forwardedCookies);
    }

    const xsrfHeader =
      request.headers.get("x-xsrf-token") ?? request.headers.get("X-XSRF-TOKEN");
    const xsrfCookie = request.cookies.get("XSRF-TOKEN")?.value;
    const xsrfToken = xsrfHeader || xsrfCookie;
    if (xsrfToken) {
      headers.set("X-XSRF-TOKEN", xsrfToken);
    }

    const response = await fetch(`${normalizeBase(BACKEND_BASE_URL)}${LOGIN_ENDPOINT}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    const responseText = await response.text();
    const responseJson = safeJsonParse(responseText);

    const nextResponse = NextResponse.json(responseJson ?? {}, {
      status: response.status,
    });

    const setCookies = extractSetCookies(response.headers);
    for (const cookie of setCookies) {
      nextResponse.headers.append("Set-Cookie", cookie);
    }

    return nextResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { message: "Login request timed out." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { message: "An error occurred while processing the login request." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timer);
  }
}

function normalizeBase(base: string) {
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function safeJsonParse(text: string | null) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function extractSetCookies(headers: Headers): string[] {
  const getSetCookie = (headers as Headers & {
    getSetCookie?: () => string[];
  }).getSetCookie;

  if (typeof getSetCookie === "function") {
    return getSetCookie();
  }

  const raw = headers.get("set-cookie");
  return raw ? [raw] : [];
}
