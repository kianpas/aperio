"use client";

import { FaDesktop, FaUsers, FaPhone, FaChair } from "react-icons/fa";
import { Seat, TimeSlot, PlanType } from "@/types/reservation";

interface DateTimeSelectionStepProps {
  selectedSeat: Seat | null;
  selectedDate: string;
  onDateChange: (date: string) => void;
  planType: PlanType;
  onPlanTypeChange: (planType: PlanType) => void;
  selectedTimes: string[];
  onTimeSelect: (time: string) => void;
  timeSlots: TimeSlot[];
}

// 좌석 타입별 아이콘 반환
const getSeatIcon = (type: string) => {
  switch (type) {
    case "individual":
      return <FaDesktop className="text-lg" />;
    case "meeting":
      return <FaUsers className="text-lg" />;
    case "phone":
      return <FaPhone className="text-lg" />;
    default:
      return <FaChair className="text-lg" />;
  }
};

// 선택된 좌석 정보 컴포넌트
const SelectedSeatInfo = ({ seat }: { seat: Seat }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <h3 className="font-semibold text-gray-900 mb-2">선택된 공간</h3>
    <div className="flex items-center">
      {getSeatIcon(seat.seatType)}
      <div className="ml-3">
        <p className="font-medium text-gray-900">{seat.name}</p>
        <p className="text-sm text-gray-800">
          {seat.hourlyPrice}원/시간
        </p>
      </div>
    </div>
  </div>
);

// 날짜 선택 컴포넌트
const DateSelector = ({ 
  selectedDate, 
  onDateChange 
}: { 
  selectedDate: string; 
  onDateChange: (date: string) => void; 
}) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">날짜 선택</h3>
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => onDateChange(e.target.value)}
      min={new Date().toISOString().split("T")[0]}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
    />
  </div>
);

// 요금제 선택 컴포넌트
const PlanTypeSelector = ({ 
  planType, 
  onPlanTypeChange 
}: { 
  planType: PlanType; 
  onPlanTypeChange: (planType: PlanType) => void; 
}) => {
  const plans = [
    {
      value: "HOURLY" as PlanType,
      label: "시간제",
      desc: "필요한 시간만큼",
      badge: "인기",
    },
    {
      value: "DAILY" as PlanType,
      label: "일일권",
      desc: "하루 종일 이용",
      badge: "절약",
    },
    {
      value: "MONTHLY" as PlanType,
      label: "월정액권",
      desc: "한 달 무제한",
      badge: "프리미엄",
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">요금제 선택</h3>
      <div className="space-y-3">
        {plans.map((plan) => (
          <label
            key={plan.value}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              planType === plan.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <input
              type="radio"
              name="planType"
              value={plan.value}
              checked={planType === plan.value}
              onChange={(e) => onPlanTypeChange(e.target.value as PlanType)}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{plan.label}</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {plan.badge}
                </span>
              </div>
              <p className="text-sm text-gray-700">{plan.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

// 시간 선택 컴포넌트
const TimeSelector = ({ 
  timeSlots, 
  selectedTimes, 
  onTimeSelect 
}: { 
  timeSlots: TimeSlot[]; 
  selectedTimes: string[]; 
  onTimeSelect: (time: string) => void; 
}) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">시간 선택</h3>
    <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
      {timeSlots.map((slot) => (
        <button
          key={slot.time}
          onClick={() => onTimeSelect(slot.time)}
          disabled={!slot.available}
          className={`p-3 rounded-lg text-sm font-medium transition-all ${
            !slot.available
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : selectedTimes.includes(slot.time)
              ? "bg-blue-600 text-white"
              : "bg-gray-50 text-gray-900 hover:bg-blue-50 hover:text-blue-700"
          }`}
        >
          {slot.time}
        </button>
      ))}
    </div>
    {selectedTimes.length > 0 && (
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          선택된 시간: {selectedTimes.length}시간 ({selectedTimes.join(", ")})
        </p>
      </div>
    )}
  </div>
);

// 메인 날짜/시간 선택 컴포넌트
const DateTimeSelectionStep = ({
  selectedSeat,
  selectedDate,
  onDateChange,
  planType,
  onPlanTypeChange,
  selectedTimes,
  onTimeSelect,
  timeSlots,
}: DateTimeSelectionStepProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* 선택된 공간 정보 */}
        {selectedSeat && <SelectedSeatInfo seat={selectedSeat} />}

        {/* 날짜 선택 */}
        <DateSelector selectedDate={selectedDate} onDateChange={onDateChange} />

        {/* 요금제 선택 */}
        <PlanTypeSelector planType={planType} onPlanTypeChange={onPlanTypeChange} />
      </div>

      <div>
        {/* 시간 선택 (시간제일 때만) */}
        {planType === "HOURLY" && (
          <TimeSelector
            timeSlots={timeSlots}
            selectedTimes={selectedTimes}
            onTimeSelect={onTimeSelect}
          />
        )}
      </div>
    </div>
  );
};

export default DateTimeSelectionStep;