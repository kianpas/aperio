"use client";

import { useState } from "react";
import {
  FaBars,
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaTimes,
  FaGripVertical,
  FaList,
    FaStream,
    FaEye,
    FaChevronDown,
    FaChevronRight,
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
    e.dataTransfer.setData('text/plain', itemId);
    setDraggedItem(itemId);
    const draggedElement = e.target as HTMLElement;
    draggedElement.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.target as HTMLElement;
    draggedElement.classList.remove('opacity-50');
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const menuItem = target.closest('[data-menu-id]');
    if (menuItem) {
      const rect = menuItem.getBoundingClientRect();
      const threshold = rect.top + rect.height / 2;
      
      if (e.clientY < threshold) {
        menuItem.classList.add('border-t-2', 'border-blue-500');
        menuItem.classList.remove('border-b-2');
      } else {
        menuItem.classList.add('border-b-2', 'border-blue-500');
        menuItem.classList.remove('border-t-2');
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    const menuItem = target.closest('[data-menu-id]');
    if (menuItem) {
      menuItem.classList.remove('border-t-2', 'border-b-2', 'border-blue-500');
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === targetId) return;

    const target = e.target as HTMLElement;
    const menuItem = target.closest('[data-menu-id]');
    if (menuItem) {
      menuItem.classList.remove('border-t-2', 'border-b-2', 'border-blue-500');
    }

    // 여기서 실제 메뉴 순서 변경 로직 구현
    console.log(`Move ${draggedId} to ${targetId}`);
    setDraggedItem(null);
  };

  const toggleExpand = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
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
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">메뉴 관리</h1>
        <p className="text-blue-100 text-lg">
          웹사이트의 메뉴 구조를 관리하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "전체 메뉴",
            value: "12",
            subValue: "활성 메뉴 10개",
            icon: FaBars,
            color: "blue",
          },
          {
            title: "메인 메뉴",
            value: "5",
            subValue: "서브메뉴 7개",
            icon: FaList,
            color: "purple",
          },
          {
            title: "푸터 메뉴",
            value: "6",
            subValue: "최근 수정 2일 전",
            icon: FaStream,
            color: "gray",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.subValue}</p>
          </div>
        ))}
      </div>

      {/* 메뉴 타입 필터 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex space-x-2">
            {["main", "sub", "footer"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type === "main"
                  ? "메인 메뉴"
                  : type === "sub"
                  ? "서브 메뉴"
                  : "푸터 메뉴"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            새 메뉴 추가
          </button>
        </div>
      </div>

      {/* 메뉴 목록 및 사이드바 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 메뉴 구조 */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              메뉴 구조 ({menuItems.filter((item) => item.type === selectedType).length})
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPreview(true)}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                메뉴 미리보기
              </button>
              <button 
                onClick={() => setExpandedMenus(menuItems.map(item => item.id))}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                전체 펼치기
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {menuItems
                .filter((item) => item.type === selectedType && !item.parentId)
                .sort((a, b) => a.order - b.order)
                .map((item) => {
                  const hasChildren = menuItems.some(m => m.parentId === item.id);
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
                          group flex items-center p-2 hover:bg-gray-50 rounded-lg
                          ${draggedItem === item.id ? "opacity-50" : ""}
                        `}
                      >
                        {hasChildren && (
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="mr-2 text-gray-400 hover:text-gray-600"
                          >
                            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                          </button>
                        )}
                        <div className="cursor-move text-gray-400 hover:text-gray-600 mr-2">
                          <FaGripVertical />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            {!item.isActive && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                비활성
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{item.url}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-2">
                          <button className="p-1 hover:bg-blue-100 rounded text-blue-600">
                            <FaEdit />
                          </button>
                          <button className="p-1 hover:bg-red-100 rounded text-red-600">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      {/* 서브메뉴 표시 */}
                      {hasChildren && isExpanded && (
                        <div className="ml-8 mt-1 space-y-1">
                          {menuItems
                            .filter(child => child.parentId === item.id)
                            .sort((a, b) => a.order - b.order)
                            .map(child => (
                              <div
                                key={child.id}
                                data-menu-id={child.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, child.id)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, child.id)}
                                className="group flex items-center p-2 hover:bg-gray-50 rounded-lg"
                              >
                                <div className="cursor-move text-gray-400 hover:text-gray-600 mr-2">
                                  <FaGripVertical />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900">{child.name}</span>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                      서브메뉴
                                    </span>
                                    {!child.isActive && (
                                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                        비활성
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-500">{child.url}</span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-2">
                                  <button className="p-1 hover:bg-blue-100 rounded text-blue-600">
                                    <FaEdit />
                                  </button>
                                  <button className="p-1 hover:bg-red-100 rounded text-red-600">
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

        {/* 메뉴 정보 사이드바 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">메뉴 정보</h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-700">전체 메뉴</span>
              <div className="mt-1 text-2xl font-bold text-gray-900">12</div>
            </div>
            <div className="border-t pt-4">
              <span className="text-sm font-medium text-gray-700">메뉴 구성</span>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">메인 메뉴</span>
                  <span className="font-medium text-gray-900">5개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">서브 메뉴</span>
                  <span className="font-medium text-gray-900">7개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">푸터 메뉴</span>
                  <span className="font-medium text-gray-900">4개</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <span className="text-sm font-medium text-gray-700">상태</span>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">활성 메뉴</span>
                  <span className="font-medium text-green-600">10개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">비활성 메뉴</span>
                  <span className="font-medium text-red-600">2개</span>
                </div>
              </div>
            </div>
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
                        {menuItems.some(child => child.parentId === item.id) && (
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
