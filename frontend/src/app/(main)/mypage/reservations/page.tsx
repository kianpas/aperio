'use client';

import { useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';

interface Reservation {
  id: number;
  seatName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'upcoming' | 'cancelled' | 'in-progress';
  price: number;
  reservationDate: string;
}

const Reservations = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 임시 데이터 (실제로는 API에서 가져올 데이터)
  const reservations: Reservation[] = [
    {
      id: 1,
      seatName: '회의실 A',
      date: '2024-02-05',
      startTime: '09:00',
      endTime: '12:00',
      status: 'upcoming',
      price: 30000,
      reservationDate: '2024-01-28'
    },
    {
      id: 2,
      seatName: '데스크 #15',
      date: '2024-01-30',
      startTime: '13:00',
      endTime: '18:00',
      status: 'completed',
      price: 15000,
      reservationDate: '2024-01-25'
    },
    {
      id: 3,
      seatName: '라운지 테이블',
      date: '2024-01-28',
      startTime: '10:00',
      endTime: '16:00',
      status: 'cancelled',
      price: 20000,
      reservationDate: '2024-01-20'
    },
    {
      id: 4,
      seatName: '회의실 B',
      date: '2024-01-31',
      startTime: '14:00',
      endTime: '17:00',
      status: 'in-progress',
      price: 25000,
      reservationDate: '2024-01-29'
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: '완료', color: 'bg-green-100 text-green-800', icon: FaCheckCircle };
      case 'upcoming':
        return { label: '예정', color: 'bg-blue-100 text-blue-800', icon: FaClock };
      case 'cancelled':
        return { label: '취소', color: 'bg-red-100 text-red-800', icon: FaTimes };
      case 'in-progress':
        return { label: '진행중', color: 'bg-yellow-100 text-yellow-800', icon: FaSpinner };
      default:
        return { label: '알 수 없음', color: 'bg-gray-100 text-gray-800', icon: FaExclamationTriangle };
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesTab = activeTab === 'all' || reservation.status === activeTab;
    const matchesSearch = reservation.seatName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getTabCount = (status: string) => {
    if (status === 'all') return reservations.length;
    return reservations.filter(r => r.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">예약내역</h1>
          <p className="text-gray-600 mt-1">나의 모든 예약 현황을 확인할 수 있습니다.</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '전체 예약', count: getTabCount('all'), color: 'blue' },
          { label: '예정된 예약', count: getTabCount('upcoming'), color: 'green' },
          { label: '완료된 예약', count: getTabCount('completed'), color: 'purple' },
          { label: '취소된 예약', count: getTabCount('cancelled'), color: 'red' }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <FaCalendarAlt className={`text-xl text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* 탭 필터 */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: '전체' },
              { key: 'upcoming', label: '예정' },
              { key: 'completed', label: '완료' },
              { key: 'cancelled', label: '취소' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'all' | 'upcoming' | 'completed' | 'cancelled')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({getTabCount(tab.key)})
              </button>
            ))}
          </div>

          {/* 검색 */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="좌석명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 예약 목록 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        {filteredReservations.length === 0 ? (
          <div className="p-12 text-center">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">예약 내역이 없습니다</h3>
            <p className="text-gray-500">새로운 예약을 만들어보세요.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReservations.map((reservation) => {
              const statusInfo = getStatusInfo(reservation.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={reservation.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaMapMarkerAlt className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {reservation.seatName}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {reservation.date}
                          </span>
                          <span className="flex items-center">
                            <FaClock className="mr-1" />
                            {reservation.startTime} - {reservation.endTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ₩{reservation.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          예약일: {reservation.reservationDate}
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="mr-1 text-xs" />
                        {statusInfo.label}
                      </span>

                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <FaEye />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 페이지네이션 (필요시) */}
      {filteredReservations.length > 0 && (
        <div className="flex items-center justify-center space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            이전
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default Reservations;