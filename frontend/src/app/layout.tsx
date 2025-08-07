import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Poppins,
  Montserrat,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // 폰트 로딩 최적화
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// 브랜드 로고용 폰트 - 모던하고 세련된 느낌
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

// 대체 브랜드 폰트 - 깔끔하고 전문적인 느낌
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

// 본문용 폰트 - 가독성이 좋은 폰트
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Aperio - 스마트 워크스페이스 플랫폼",
    template: "%s | Aperio",
  },
  description:
    "아이디어와 가능성을 열어주는 스마트 워크스페이스 플랫폼. Next.js 15와 Spring Boot로 구현한 포트폴리오 프로젝트.",
  keywords: [
    "포트폴리오",
    "워크스페이스",
    "예약시스템",
    "Next.js",
    "Spring Boot",
    "Aperio",
  ],
  authors: [{ name: "Portfolio Developer" }],
  creator: "Portfolio Project",
  publisher: "Developer Portfolio",
  // Open Graph (소셜 미디어 최적화)
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://aperio.vercel.app",
    siteName: "Aperio",
    title: "Aperio - 스마트 워크스페이스 플랫폼",
    description: "아이디어와 가능성을 열어주는 스마트 워크스페이스 플랫폼",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aperio 워크스페이스",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Aperio - 스마트 워크스페이스 플랫폼",
    description: "아이디어와 가능성을 열어주는 스마트 워크스페이스 플랫폼",
    images: ["/og-image.png"],
  },
  // 검색 엔진 최적화
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // 앱 매니페스트
  manifest: "/manifest.json",
  // 아이콘 설정
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

// 뷰포트 최적화
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <head>
        {/* 폰트 최적화 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />

        {/* 구조화된 데이터 (JSON-LD) - 포트폴리오 프로젝트용 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Aperio",
              description:
                "아이디어와 가능성을 열어주는 스마트 워크스페이스 플랫폼",
              url: "https://aperio.vercel.app",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              author: {
                "@type": "Person",
                name: "Developer Portfolio",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
                description: "포트폴리오 데모 프로젝트",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${montserrat.variable} ${inter.variable} antialiased min-h-screen`}
      >
        {/* 접근성 개선 - Skip to main content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          메인 콘텐츠로 건너뛰기
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
