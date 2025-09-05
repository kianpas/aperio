import { NextResponse } from "next/server";

// Revalidate this route every 5 minutes (ISR-like behavior)
export const revalidate = 300;

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  "http://localhost:8080";

export async function GET() {
  try {
    const url = `${BACKEND_BASE_URL}/api/v1/main`;

    // Cache the upstream fetch for revalidate seconds
    const res = await fetch(url, {
      next: { revalidate }, // Next.js caching for server fetch
      // If auth headers/cookies are needed, add them here
      // headers: { Authorization: `Bearer ${process.env.SERVICE_TOKEN}` },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Backend request failed", status: res.status },
        { status: res.status }
      );
    }
    const data = await res.json();
    const list = Array.isArray(data?.bannerList) ? data.bannerList : [];
    return NextResponse.json(list, {
      // Optional: client cache hint (edge/CDN can respect s-maxage)
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" },
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load banners" },
      { status: 500 }
    );
  }
}
