"use client";

import { useState } from "react";
import {
  FaBars,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaGripVertical,
  FaList,
  FaStream,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
  FaFilter,
  FaEye,
  FaArrowRight,
  FaCog,
  FaChartBar,
  FaLink,
  FaSort,
  FaCheckCircle,
  FaTimesCircle,
  FaHome,
  FaInfoCircle,
  FaCalendarAlt,
} from "react-icons/fa";

interface MenuItem {
  id: string;
  name: string;
  url: string;
  type: "main" | "sub" | "footer";
  order: number;
  isActive: boolean;
  parentId?: string;
}

const MenusPage = () => {
  const [selectedType, setSelectedType] = useState("main");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("text/plain", itemId);
    setDraggedItem(itemId);
    const draggedElement = e.target as HTMLElement;
    draggedElement.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.target as HTMLElement;
    draggedElement.classList.remove("opacity-50");
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const menuItem = target.closest("[data-menu-id]");
    if (menuItem) {
      const rect = menuItem.getBoundingClientRect();
      const threshold = rect.top + rect.height / 2;

      if (e.clientY < threshold) {
        menuItem.classList.add("border-t-2", "border-blue-500");
        menuItem.classList.remove("border-b-2");
      } else {
        menuItem.classList.add("border-b-2", "border-blue-500");
        menuItem.classList.remove("border-t-2");
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    const menuItem = target.closest("[data-menu-id]");
    if (menuItem) {
      menuItem.classList.remove("border-t-2", "border-b-2", "border-blue-500");
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId === targetId) return;

    const target = e.target as HTMLElement;
    const menuItem = target.closest("[data-menu-id]");
    if (menuItem) {
      menuItem.classList.remove("border-t-2", "border-b-2", "border-blue-500");
    }

    // 여기서 실제 메뉴 순서 변경 로직 구현
    console.log(`Move ${draggedId} to ${targetId}`);
    setDraggedItem(null);
  };

  const toggleExpand = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: "M1",
      name: "홈",
      url: "/",
      type: "main",
      order: 1,
      isActive: true,
    },
    {
      id: "M2",
      name: "공간 소개",
      url: "/spaces",
      type: "main",
      order: 2,
      isActive: true,
    },
    {
      id: "M2-1",
      name: "개인 공간",
      url: "/spaces/individual",
      type: "sub",
      order: 1,
      isActive: true,
      parentId: "M2",
    },
    {
      id: "M3",
      name: "예약하기",
      url: "/reservation",
      type: "main",
      order: 3,
      isActive: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 상단 헤더 - Netflix 스타일 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">메뉴 관리</h1>
          <p className="text-gray-600 mt-2">웹사이트의 네비게이션 메뉴를 관리하고 구조를 설정합니다</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaFilter />
            <span>필터</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <FaPlus />
            <span>새 메뉴</span>
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "전체 메뉴", value: "12", change: "+2", trend: "up" },
          { label: "활성 메뉴", value: "10", change: "+1", trend: "up" },
          { label: "메인 메뉴", value: "5", change: "0", trend: "stable" },
          { label: "서브 메뉴", value: "7", change: "+2", trend: "up" }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change !== "0" && stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 빠른 액션 카드 - Netflix/Spotify 스타일 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "메뉴 구조 설계",
              description: "드래그 앤 드롭으로 메뉴 순서 변경",
              count: "12개 메뉴",
              icon: FaSort,
              color: "blue",
              href: "/admin/menus/structure"
            },
            {
              title: "메뉴 분석",
              description: "메뉴별 클릭률 및 사용 통계",
              count: "평균 CTR 4.2%",
              icon: FaChartBar,
              color: "green",
              href: "/admin/analytics/menus"
            },
            {
              title: "메뉴 미리보기",
              description: "실제 사이트에서 메뉴 확인",
              count: "실시간 반영",
              icon: FaEye,
              color: "purple",
              href: "/admin/menus/preview"
            }
          ].map((action, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => console.log(`Navigate to ${action.href}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-${action.color}-100`}>
                  <action.icon className={`text-2xl text-${action.color}-600`} />
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{action.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{action.count}</span>
                <span className="text-sm text-blue-600 group-hover:text-blue-700">
                  관리하기 →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 검색 및 필터 바 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="메뉴명, URL로 검색..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex space-x-3">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="all" className="text-gray-900">전체 메뉴</option>
              <option value="main" className="text-gray-900">메인 메뉴</option>
              <option value="sub" className="text-gray-900">서브 메뉴</option>
              <option value="footer" className="text-gray-900">푸터 메뉴</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white">
              <option value="all" className="text-gray-900">전체 상태</option>
              <option value="active" className="text-gray-900">활성</option>
              <option value="inactive" className="text-gray-900">비활성</option>
            </select>
          </div>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                메뉴 목록 ({menuItems.filter((item) => selectedType === "all" || item.type === selectedType).length}개)
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FaEye />
                  <span>미리보기</span>
                </button>
                <button
                  onClick={() => setExpandedMenus(menuItems.map((item) => item.id))}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FaList />
                  <span>전체 펼치기</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {menuItems
                .filter((item) => (selectedType === "all" || item.type === selectedType) && !item.parentId)
                .sort((a, b) => a.order - b.order)
                .map((item) => {
                  const hasChildren = menuItems.some(
                    (m) => m.parentId === item.id
                  );
                  const isExpanded = expandedMenus.includes(item.id);

                  return (
                    <div key={item.id} className="menu-tree-item">
                      <div
                        data-menu-id={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, item.id)}
                        className={`
                          group flex items-center p-4 hover:bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200
                          ${draggedItem === item.id ? "opacity-50" : ""}
                        `}
                      >
                        {hasChildren && (
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="mr-2 text-gray-400 hover:text-gray-600"
                          >
                            {isExpanded ? (
                              <FaChevronDown />
                            ) : (
                              <FaChevronRight />
                            )}
                          </button>
                        )}
                        <div className="cursor-move text-gray-400 hover:text-gray-600 mr-2">
                          <FaGripVertical />
                        </div>
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${
                            item.type === "main" ? "bg-blue-100" :
                            item.type === "sub" ? "bg-green-100" : "bg-gray-100"
                          }`}>
                            {item.type === "main" ? <FaHome className="text-blue-600" /> :
                             item.type === "sub" ? <FaList className="text-green-600" /> :
                             <FaInfoCircle className="text-gray-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900">
                                {item.name}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                item.isActive 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                <span className={`w-2 h-2 rounded-full mr-1 ${
                                  item.isActive ? "bg-green-400" : "bg-red-400"
                                }`}></span>
                                {item.isActive ? "활성" : "비활성"}
                              </span>
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                {item.type === "main" ? "메인" : item.type === "sub" ? "서브" : "푸터"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <FaLink className="text-gray-400 text-xs" />
                              <span className="text-sm text-gray-500">{item.url}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <FaEye />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <FaEdit />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      {/* 서브메뉴 표시 */}
                      {hasChildren && isExpanded && (
                        <div className="ml-12 mt-3 space-y-2">
                          {menuItems
                            .filter((child) => child.parentId === item.id)
                            .sort((a, b) => a.order - b.order)
                            .map((child) => (
                              <div
                                key={child.id}
                                data-menu-id={child.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, child.id)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, child.id)}
                                className="group flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100 hover:border-green-200 transition-all duration-200"
                              >
                                <div className="cursor-move text-gray-400 hover:text-gray-600 mr-3">
                                  <FaGripVertical />
                                </div>
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className="p-2 rounded-lg bg-green-100">
                                    <FaList className="text-green-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-gray-900">
                                        {child.name}
                                      </span>
                                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                        child.isActive 
                                          ? "bg-green-100 text-green-800" 
                                          : "bg-red-100 text-red-800"
                                      }`}>
                                        <span className={`w-2 h-2 rounded-full mr-1 ${
                                          child.isActive ? "bg-green-400" : "bg-red-400"
                                        }`}></span>
                                        {child.isActive ? "활성" : "비활성"}
                                      </span>
                                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                        서브메뉴
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <FaLink className="text-gray-400 text-xs" />
                                      <span className="text-sm text-gray-500">{child.url}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <FaEye />
                                  </button>
                                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                    <FaEdit />
                                  </button>
                                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

      {/* 메뉴 추가 모달 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">새 메뉴 추가</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메뉴명
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="메뉴 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="/example"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메뉴 타입
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="main">메인 메뉴</option>
                  <option value="sub">서브 메뉴</option>
                  <option value="footer">푸터 메뉴</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상위 메뉴
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">없음</option>
                  {menuItems
                    .filter((item) => item.type === "main")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-gray-700"
                >
                  활성화
                </label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 메뉴 미리보기 모달 */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl h-3/4 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">메뉴 미리보기</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="border rounded-lg p-4">
                <nav className="space-y-4">
                  {menuItems
                    .filter((item) => !item.parentId && item.isActive)
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <div key={item.id}>
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        {menuItems.some(
                          (child) => child.parentId === item.id
                        ) && (
                          <div className="ml-4 mt-2 space-y-2">
                            {menuItems
                              .filter(
                                (child) =>
                                  child.parentId === item.id && child.isActive
                              )
                              .sort((a, b) => a.order - b.order)
                              .map((child) => (
                                <div
                                  key={child.id}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  {child.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenusPage;
