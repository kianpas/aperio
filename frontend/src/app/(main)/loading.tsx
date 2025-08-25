// 메인 페이지 전용 로딩 UI - Next.js App Router에서 자동 사용
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* 브랜드 로고/타이틀 */}
        <div className="mb-8">
          <h1 className="text-4xl font-brand-bold text-gray-900 mb-2">
            <span className="text-blue-600">Aperio</span>
          </h1>
          <p className="text-gray-600">당신의 아이디어가 현실이 되는 공간</p>
        </div>

        {/* 커스텀 로딩 애니메이션 */}
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto">
            {/* 메인 스피너 */}
            <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            {/* 이중 스피너 효과 */}
            <div
              className="absolute inset-2 border-3 border-transparent border-t-blue-400 rounded-full animate-spin"
              style={{ animationDelay: "0.15s", animationDuration: "1.5s" }}
            ></div>
          </div>
        </div>

        {/* 로딩 메시지 */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700">
            최고의 워크스페이스를 준비하고 있습니다
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 text-sm text-gray-500">
          <p>잠시만 기다려주세요. 곧 시작됩니다!</p>
        </div>
      </div>
    </div>
  );
}
