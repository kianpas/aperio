import { Banner } from "@/types/banner";
import BannerCarousel from "./BannerCarousel";

interface BannerSectionProps {
  banners: Banner[];
}

// 서버 컴포넌트 - 배너 데이터를 받아서 렌더링
export default function BannerSection({ banners }: BannerSectionProps) {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full">
      {banners.length === 1 ? (
        // 단일 배너
        <div className="relative h-64 md:h-96 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                {banners[0].title}
              </h2>
              {/* {banners[0].content && (
                <p className="text-lg md:text-xl opacity-90">
                  {banners[0].content}
                </p>
              )} */}
            </div>
          </div>
        </div>
      ) : (
        // 다중 배너 - 클라이언트 컴포넌트로 위임
        <BannerCarousel banners={banners} />
      )}
    </section>
  );
}