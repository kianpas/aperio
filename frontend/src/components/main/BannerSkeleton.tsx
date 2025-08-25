// 배너 로딩 스켈레톤
export default function BannerSkeleton() {
  return (
    <section className="relative w-full h-64 md:h-96 bg-gray-200 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 md:h-12 bg-gray-300 rounded-lg w-64 md:w-96 mb-4"></div>
          <div className="h-4 md:h-6 bg-gray-300 rounded-lg w-48 md:w-72"></div>
        </div>
      </div>
    </section>
  );
}