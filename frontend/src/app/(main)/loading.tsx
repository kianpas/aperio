// 메인 페이지 전용 로딩 UI - Next.js App Router에서 자동 사용
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* 브랜드 로고 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <span className="text-blue-600">Aperio</span>
          </h1>
        </div>

        {/* 심플한 로딩 애니메이션 - 점 3개 */}
        <div className="mb-6">
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>

        {/* 로딩 메시지 */}
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}
