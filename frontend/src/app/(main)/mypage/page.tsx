const Mypage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">안녕하세요! 👋</h1>
        <p className="text-blue-100 text-lg">마이페이지에 오신 것을 환영합니다.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">프로필</h3>
          </div>
          <p className="text-gray-600">개인정보를 관리하세요</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">예약내역</h3>
          </div>
          <p className="text-gray-600">예약 현황을 확인하세요</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">설정</h3>
          </div>
          <p className="text-gray-600">계정 설정을 변경하세요</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">최근 활동</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-green-500 mr-3">✅</span>
            <span className="text-gray-700">새로운 예약이 완료되었습니다.</span>
            <span className="text-gray-500 text-sm ml-auto">2시간 전</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-blue-500 mr-3">📝</span>
            <span className="text-gray-700">프로필 정보가 업데이트되었습니다.</span>
            <span className="text-gray-500 text-sm ml-auto">1일 전</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;