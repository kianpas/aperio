// 예약 페이지 전용 로딩 UI
export default function ReservationLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            좌석 정보를 불러오는 중...
          </h2>
          <p className="text-gray-600">
            최적의 좌석을 찾고 있습니다
          </p>
        </div>
        
        {/* 좌석 스켈레톤 미리보기 */}
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}