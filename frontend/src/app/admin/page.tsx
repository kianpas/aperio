"use client";

import {
  FaUsers,
  FaCalendarCheck,
  FaChair,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
} from "react-icons/fa";

const Admin = () => {
  // 실제로는 API에서 가져올 데이터
  const stats = [
    {
      title: "총 사용자",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: FaUsers,
      color: "blue",
    },
    {
      title: "오늘 예약",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: FaCalendarCheck,
      color: "green",
    },
    {
      title: "사용 중인 좌석",
      value: "67/120",
      change: "56%",
      trend: "up",
      icon: FaChair,
      color: "purple",
    },
    {
      title: "이번 달 매출",
      value: "₩12,450,000",
      change: "+8%",
      trend: "up",
      icon: FaDollarSign,
      color: "yellow",
    },
  ];

  const recentActivities = [
    {
      type: "reservation",
      message: "김철수님이 회의실 A를 예약했습니다.",
      time: "5분 전",
      status: "success",
    },
    {
      type: "user",
      message: "새로운 사용자가 가입했습니다.",
      time: "15분 전",
      status: "info",
    },
    {
      type: "payment",
      message: "월 이용료 결제가 완료되었습니다.",
      time: "1시간 전",
      status: "success",
    },
    {
      type: "system",
      message: "시스템 점검이 예정되어 있습니다.",
      time: "2시간 전",
      status: "warning",
    },
  ];

  const pendingTasks = [
    { task: "신규 회원 승인 대기", count: 5, priority: "high" },
    { task: "환불 요청 처리", count: 3, priority: "medium" },
    { task: "시설 점검 일정", count: 2, priority: "low" },
    { task: "문의사항 답변", count: 8, priority: "high" },
  ];

  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">안녕하세요, 관리자님! 👋</h1>
        <p className="text-blue-100 text-lg">
          오늘도 Aperio 관리 시스템에 오신 것을 환영합니다.
        </p>
      </div>

      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <FaArrowUp className="mr-1" />
                ) : (
                  <FaArrowDown className="mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 최근 활동 */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">최근 활동</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              <FaEye className="mr-1" />
              전체보기
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className={`p-2 rounded-full ${
                    activity.status === "success"
                      ? "bg-green-100"
                      : activity.status === "warning"
                      ? "bg-yellow-100"
                      : "bg-blue-100"
                  }`}
                >
                  {activity.status === "success" ? (
                    <FaCheckCircle className="text-green-600" />
                  ) : activity.status === "warning" ? (
                    <FaExclamationTriangle className="text-yellow-600" />
                  ) : (
                    <FaClock className="text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">
                    {activity.message}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 처리 대기 작업 */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">처리 대기 작업</h2>
            <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
              {pendingTasks.reduce((sum, task) => sum + task.count, 0)}건
            </span>
          </div>
          <div className="space-y-4">
            {pendingTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <span className="font-medium text-gray-800">{task.task}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                    {task.count}건
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">빠른 액션</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "새 사용자 등록", icon: FaUsers, color: "blue" },
            { label: "예약 생성", icon: FaCalendarCheck, color: "green" },
            { label: "좌석 상태 변경", icon: FaChair, color: "purple" },
            {
              label: "공지사항 작성",
              icon: FaExclamationTriangle,
              color: "yellow",
            },
          ].map((action, index) => (
            <button
              key={index}
              className={`p-4 border-2 border-dashed border-${action.color}-300 rounded-xl hover:border-${action.color}-500 hover:bg-${action.color}-50 transition-all duration-200 group`}
            >
              <action.icon
                className={`text-2xl text-${action.color}-600 mb-2 group-hover:scale-110 transition-transform`}
              />
              <p className={`text-${action.color}-800 font-medium text-sm`}>
                {action.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
