"use client";

import {
  FaDesktop,
  FaUsers,
  FaPhone,
  FaWifi,
  FaCoffee,
  FaCheck,
} from "react-icons/fa";
import { Seat } from "@/types/reservation";

interface SeatSelectionStepProps {
  seats: Seat[];
  selectedSeat: Seat | null;
  onSeatSelect: (seat: Seat) => void;
}

// 좌석 그룹 컴포넌트
interface SeatGroupProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  seats: Seat[];
  selectedSeat: Seat | null;
  onSeatSelect: (seat: Seat) => void;
  gridCols: string;
  cardSize: "small" | "large";
}

const SeatGroup = ({
  title,
  icon: Icon,
  iconColor,
  seats,
  selectedSeat,
  onSeatSelect,
  gridCols,
  cardSize,
}: SeatGroupProps) => {
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
        return <FaDesktop className="text-lg" />;
    }
  };

  // 기능 아이콘 반환
  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "Wi-Fi":
        return <FaWifi className="text-xs" />;
      case "커피":
        return <FaCoffee className="text-xs" />;
      case "모니터":
        return <FaDesktop className="text-xs" />;
      default:
        return <FaCheck className="text-xs" />;
    }
  };

  // 선택된 좌석의 색상 클래스 반환
  const getSelectedColorClass = (type: string) => {
    switch (type) {
      case "individual":
        return "bg-blue-600 border-blue-600 text-white shadow-lg";
      case "meeting":
        return "bg-purple-600 border-purple-600 text-white shadow-lg";
      case "phone":
        return "bg-green-600 border-green-600 text-white shadow-lg";
      default:
        return "bg-blue-600 border-blue-600 text-white shadow-lg";
    }
  };

  // 호버 색상 클래스 반환
  const getHoverColorClass = (type: string) => {
    switch (type) {
      case "individual":
        return "hover:border-blue-300";
      case "meeting":
        return "hover:border-purple-300";
      case "phone":
        return "hover:border-green-300";
      default:
        return "hover:border-blue-300";
    }
  };

  return (
    <div>
      <h3
        className={`text-lg font-semibold text-gray-800 mb-4 flex items-center`}
      >
        <Icon className={`mr-2 ${iconColor}`} />
        {title}
      </h3>
      <div className={`grid ${gridCols} gap-4`}>
        {seats.map((seat) => (
          <SeatCard
            key={seat.id}
            seat={seat}
            isSelected={selectedSeat?.id === seat.id}
            onSelect={() => onSeatSelect(seat)}
            getSeatIcon={getSeatIcon}
            getFeatureIcon={getFeatureIcon}
            selectedColorClass={getSelectedColorClass(seat.seatType)}
            hoverColorClass={getHoverColorClass(seat.seatType)}
            size={cardSize}
          />
        ))}
      </div>
    </div>
  );
};

// 개별 좌석 카드 컴포넌트
interface SeatCardProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: () => void;
  getSeatIcon: (type: string) => React.ReactElement;
  getFeatureIcon: (feature: string) => React.ReactElement;
  selectedColorClass: string;
  hoverColorClass: string;
  size: "small" | "large";
}

const SeatCard = ({
  seat,
  isSelected,
  onSelect,
  getSeatIcon,
  getFeatureIcon,
  selectedColorClass,
  hoverColorClass,
  size,
}: SeatCardProps) => {
  const baseClasses =
    "rounded-xl border-2 cursor-pointer transition-all duration-200";
  const padding = size === "large" ? "p-6" : "p-4";

  const getCardClasses = () => {
    if (seat.status === "unavailable") {
      return `${baseClasses} ${padding} bg-gray-100 border-gray-200 cursor-not-allowed opacity-60`;
    }
    if (isSelected) {
      return `${baseClasses} ${padding} ${selectedColorClass}`;
    }
    return `${baseClasses} ${padding} bg-white border-gray-200 ${hoverColorClass} hover:shadow-md`;
  };

  return (
    <div className={getCardClasses()} onClick={onSelect}>
      <div className="text-center">
        {getSeatIcon(seat.seatType)}
        <h4
          className={`font-semibold mt-2 ${
            size === "large" ? "text-base mt-3" : "text-sm"
          } ${isSelected ? "text-white" : "text-gray-900"}`}
        >
          {seat.name}
        </h4>
        <p
          className={`mt-1 text-gray-700 ${
            size === "large" ? "text-sm" : "text-xs"
          } ${isSelected ? "text-white/90" : ""}`}
        >
          {seat.capacity && `최대 ${seat.capacity}인 • `}
          {seat.hourlyPrice}원/시간
        </p>
        {/* {size === "large" && seat.features && (
          <div className="flex justify-center mt-2 space-x-1">
            {seat.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className={`text-xs ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                {getFeatureIcon(feature)}
              </span>
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
};

// 메인 좌석 선택 컴포넌트
const SeatSelectionStep = ({
  seats,
  selectedSeat,
  onSeatSelect,
}: SeatSelectionStepProps) => {
  if (!seats || seats.length === 0) {
    // 샘플 데이터
    seats = [
      {
        id: "1",
        name: "Test Zone A1",
        seatType: "SINGLE",
        status: "available",
        hourlyPrice: 1500,
        dailyPrice: 12000,
        monthlyPrice: 200000,
        capacity: 1,
        description: "조용한 개인 작업 공간",
        floor: "1층",
        location: "1층",
      },
    ];
  }

  const individualSeats = seats.filter((seat) => seat.seatType === "SINGLE");
  const meetingSeats = seats.filter((seat) => seat.seatType === "MEETING");
  const phoneSeats = seats.filter((seat) => seat.seatType === "phone");
  console.log("individualSeats =>", individualSeats);
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          어떤 공간을 원하시나요?
        </h2>
        <p className="text-gray-700">용도에 맞는 공간을 선택해주세요</p>
      </div>

      <div className="space-y-8">
        {/* 개인 좌석 */}
        <SeatGroup
          title="개인 작업 공간"
          icon={FaDesktop}
          iconColor="text-blue-600"
          seats={individualSeats}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
          gridCols="grid-cols-2 md:grid-cols-4"
          cardSize="small"
        />

        {/* 회의실 */}
        <SeatGroup
          title="회의실"
          icon={FaUsers}
          iconColor="text-purple-600"
          seats={meetingSeats}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
          gridCols="grid-cols-1 md:grid-cols-3"
          cardSize="large"
        />

        {/* 폰부스 */}
        <SeatGroup
          title="폰부스"
          icon={FaPhone}
          iconColor="text-green-600"
          seats={phoneSeats}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
          gridCols="grid-cols-2 md:grid-cols-4"
          cardSize="small"
        />
      </div>
    </div>
  );
};

export default SeatSelectionStep;
