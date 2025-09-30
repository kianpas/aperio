// 예약 페이지 전용 로딩 UI
export default function FaqLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            FAQ 정보를 불러오는 중...
          </h2>
        </div>
      </div>
    </div>
  );
}
