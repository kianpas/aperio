# Next.js App Router API Strategy Guide (Next.js 13+)

목표: 프론트엔드에서 백엔드(스프링)와 통신하는 방식을 Next.js App Router에 맞춰 일관되게 정리합니다. CSR 직결 방식 대신, Route Handler 프록시, 서버 컴포넌트/액션을 적절히 조합해 보안, DX, 캐싱을 개선합니다.

## 아키텍처 옵션

1) 클라이언트 → 백엔드 직접 호출 (CSR)
- 장점: 간단, 훅에서 바로 사용 가능.
- 단점: CORS/쿠키 제약, 비공개 베이스 URL/비밀 노출 위험, 환경 분기 복잡.
- 권장: 공개 데이터, 비로그인, 빠른 프로토타이핑에만 제한적으로.

2) Next Route Handler 프록시 (/app/api/...)
- 장점: 동일 오리진으로 클라이언트는 `/api`만 호출, 서버에서 쿠키/토큰 안전 관리, 헤더/캐시/에러 표준화, 로깅과 레이트리밋 용이.
- 단점: 얇은 레이어라도 코드가 늘어남.
- 권장: 기본 전략. 민감한 트래픽, 인증 필요한 API, 환경 분리 필요 시.

3) 서버 컴포넌트/서버 액션에서 백엔드 직접 호출
- 장점: 추가 프록시 없이 서버에서 바로 호출, 쿠키 안전, SEO/SSR에 최적.
- 단점: 클라이언트 재검증/실시간 갱신은 추가 훅 필요, 런타임 제약(Edge/Node) 고려.
- 권장: SSR 초기 데이터, SEO가 중요한 화면, 생성/수정 서버 액션.

전략 요약: SSR/보안은 서버(2,3)로, 상호작용/리프레시/옵티미스틱 갱신은 클라이언트 훅으로. 클라이언트는 가급적 Next `/api`를 호출하고, 서버는 백엔드를 직접 호출합니다.

## 환경 변수 가이드

- `BACKEND_API_URL`: 서버(Next)에서 백엔드 호출용. 예: http://localhost:8080
- `NEXT_PUBLIC_APP_BASE_URL`: 클라이언트가 자신의 오리진을 알 때 사용(옵션).
- 클라이언트에서 백엔드 주소가 필요하면 원칙적으로 Next `/api`를 호출하여 주소 노출을 피합니다.

예시 (.env.local)
```
BACKEND_API_URL=http://localhost:8080
```

## HTTP 클라이언트 레이어

공통 fetch 래퍼를 서버/클라이언트 각각 제공합니다.

`frontend/src/lib/http/server.ts` (서버 전용)
```ts
import { cookies, headers } from 'next/headers';

const BASE = process.env.BACKEND_API_URL!;

export async function serverFetch(path: string, init: RequestInit = {}) {
  const cookie = cookies().toString();
  const h = new Headers(init.headers);
  if (cookie) h.set('cookie', cookie);

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: h,
    // 서버에서 민감 데이터는 기본적으로 캐시하지 않음
    cache: 'no-store',
  });
  if (!res.ok) throw await toApiError(res);
  return res;
}

async function toApiError(res: Response) {
  let body: any = undefined;
  try { body = await res.json(); } catch {}
  return new Error(body?.message || `API ${res.status}`);
}
```

`frontend/src/lib/http/client.ts` (클라이언트 전용 → Next `/api` 호출)
```ts
export async function clientFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`/api${path}`, {
    ...init,
    credentials: 'include',
  });
  if (!res.ok) {
    let body: any = undefined; try { body = await res.json(); } catch {}
    throw new Error(body?.message || `API ${res.status}`);
  }
  return res;
}
```

## Route Handler 프록시 패턴

예) 예약 목록/생성 프록시

`frontend/src/app/api/reservations/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server';

const BASE = process.env.BACKEND_API_URL!;

export const runtime = 'nodejs'; // 파일 업로드 등 Node 런타임이 유리

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const qs = url.search ? url.search : '';
  const res = await fetch(`${BASE}/api/v1/reservations${qs}`, {
    headers: { cookie: req.headers.get('cookie') ?? '' },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${BASE}/api/v1/reservations`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: req.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
```

포인트
- 동일 오리진(`/api/...`)으로 클라이언트는 CORS/쿠키 걱정 없이 호출합니다.
- 서버에서 쿠키를 백엔드로 전달합니다.
- 응답을 그대로 전달하거나, 에러·스키마 매핑을 표준화할 수 있습니다.
- 변이 이후 ISR 무효화가 필요하면 `revalidateTag`/`revalidatePath`를 활용합니다.

## 서버 컴포넌트/서버 액션

서버에서 직접 백엔드를 호출해 초기 데이터를 구성합니다.

`frontend/src/app/(main)/reservation/page.tsx` (서버 컴포넌트)
```tsx
import { serverFetch } from '@/lib/http/server';

export default async function ReservationPage() {
  const res = await serverFetch('/api/v1/reservations');
  const list = await res.json();
  return <pre>{JSON.stringify(list, null, 2)}</pre>;
}
```

서버 액션으로 생성/수정 처리
```tsx
'use server';
import { serverFetch } from '@/lib/http/server';

export async function createReservation(form: FormData) {
  const payload = Object.fromEntries(form.entries());
  const res = await serverFetch('/api/v1/reservations', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

## 클라이언트 훅 (React Query 권장)

CSR 상호작용은 Next `/api`를 호출합니다.

`frontend/src/hooks/useReservation.ts`
```ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientFetch } from '@/lib/http/client';

export function useReservations(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  return useQuery({
    queryKey: ['reservations', qs],
    queryFn: async () => (await (await clientFetch(`/reservations${qs}`)).json()),
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await (await clientFetch('/reservations', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
    })).json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });
}
```

## 인증/쿠키 전략

- 클라이언트: Next `/api`만 호출 → 백엔드 베이스 URL/비밀 미노출.
- 서버: `cookies()`로 세션/토큰을 읽어 백엔드로 전달. 필요 시 Authorization 헤더 주입.
- NextAuth 등 사용 시 Route Handler에서 세션을 해석해 백엔드 인증과 연결.
- CSRF: 동일 오리진 `/api`를 사용하면 위험이 낮지만, 상태 변경은 CSRF 토큰을 고려.

## 캐싱/리밸리데이션

- 서버 fetch: 기본 `cache: 'no-store'`로 안전 시작. 데이터 성격에 맞춰 `next: { revalidate: N }`, `tags` 적용.
- 변이 후: `revalidateTag('reservations')` 또는 클라이언트에서 `invalidateQueries`.
- Route Handler 응답 헤더로 `Cache-Control`을 명시해 중간 캐시 제어 가능.

## 오류/스키마 표준화

- Route Handler에서 백엔드 오류를 수집해 `{ message, code, details }` 형태로 매핑.
- DTO 유효성 검증에 Zod를 사용해 방어적 프로그래밍.

예) 간단한 에러 래핑
```ts
function wrapError(status: number, body: any) {
  const message = body?.message || 'Unexpected error';
  const code = body?.code || `${status}`;
  return { message, code, details: body };
}
```

## 파일 업로드/스트리밍 특이점

- 업로드는 Route Handler에서 `formData()`를 받아 백엔드로 스트리밍 전달.
- SSE/WebSocket은 라우트 핸들러 대신 직접 백엔드 엔드포인트로 연결 고려.

## 선택 가이드

- 공개/캐시 가능한 리스트, SEO 필요: 서버 컴포넌트 fetch 또는 Route Handler + `revalidate`.
- 인증 필요한 데이터: Route Handler 프록시 또는 서버 컴포넌트 서버 fetch.
- 상호작용 많은 화면: 클라이언트 훅(React Query) + Next `/api`.
- 생성/수정: 서버 액션 또는 Route Handler POST, 이후 무효화.

## 마이그레이션 팁 (기존 CSR 훅 → Next 방식)

1) 훅에서 백엔드 직접 호출을 제거하고 Next `/api`를 호출하도록 경로만 변경.
2) 공통 오류/응답 포맷을 Route Handler에서 통일.
3) 초기 데이터는 서버 컴포넌트로 선호, 클라이언트는 후속 갱신 전담.
4) 타입/DTO는 `frontend/src/types`에 중앙 관리.

---

이 가이드를 기준으로 현재 `frontend/src/hooks`의 CSR 호출을 `/app/api` 경유로 점진 전환하고, 초기 데이터는 서버 컴포넌트에서 불러오는 하이브리드 구성을 권장합니다.

