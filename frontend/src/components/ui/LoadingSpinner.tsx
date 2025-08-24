"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  /** 스피너 크기 */
  size?: "sm" | "md" | "lg" | "xl";
  /** 스피너 색상 */
  color?: "blue" | "white" | "gray" | "primary";
  /** 로딩 텍스트 */
  text?: string;
  /** 전체 화면 로딩 여부 */
  fullScreen?: boolean;
  /** 배경 그라데이션 적용 여부 */
  gradient?: boolean;
  /** 이중 스피너 효과 */
  double?: boolean;
  /** 커스텀 클래스명 */
  className?: string;
}

const LoadingSpinner = ({
  size = "md",
  color = "blue",
  text,
  fullScreen = false,
  gradient = false,
  double = false,
  className,
}: LoadingSpinnerProps) => {
  // 크기별 스타일
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  };

  // 색상별 스타일
  const colorClasses = {
    blue: "border-blue-200 border-t-blue-600",
    white: "border-white/30 border-t-white",
    gray: "border-gray-200 border-t-gray-600",
    primary: "border-blue-200 border-t-blue-600",
  };

  // 이중 스피너용 색상
  const doubleColorClasses = {
    blue: "border-transparent border-t-blue-400",
    white: "border-transparent border-t-white/70",
    gray: "border-transparent border-t-gray-400",
    primary: "border-transparent border-t-blue-400",
  };

  // 텍스트 크기
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const spinnerElement = (
    <div className="relative">
      {/* 메인 스피너 */}
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      
      {/* 이중 스피너 효과 */}
      {double && (
        <div
          className={cn(
            "absolute inset-0 animate-spin rounded-full",
            sizeClasses[size],
            doubleColorClasses[color]
          )}
          style={{ animationDelay: "0.15s" }}
        />
      )}
    </div>
  );

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        className
      )}
    >
      {spinnerElement}
      {text && (
        <div
          className={cn(
            "font-medium",
            textSizeClasses[size],
            color === "white" ? "text-white" : "text-gray-700"
          )}
        >
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          gradient
            ? "bg-gradient-to-br from-blue-50 to-indigo-100"
            : "bg-white"
        )}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;