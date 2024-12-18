import React from "react";

interface CircularProgressBarProps {
  progress: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ progress }) => {
  const circleRadius = 30;
  const circleCircumference = 2 * Math.PI * circleRadius; // 188.5714

  const getStrokeColor = () => {
    if (progress <= 25) {
      return "#ef4444"; // Red
    } else if (progress > 25 && progress <= 50) {
      return "#f97316"; // Orange
    } else if (progress > 50 && progress <= 75) {
      return "#eab308"; // Yellow
    } else {
      return "#22c55e"; // Green
    }
  };

  return (
    <div className="relative w-18 h-18 flex items-center justify-center backdrop-blur-sm bg-transparent rounded-full">
      {/* Circle background (gray track) */}
      <svg className="w-20 h-20 transform -rotate-90 ">
        <circle
          cx="40"
          cy="40"
          r={circleRadius}
          strokeWidth="5"
          className="text-gray-200 dark:text-gray-600 "
          stroke="currentColor"
        />
      </svg>

      {/* Circle progress */}
      <svg className="absolute w-20 h-20 transform -rotate-90 blur-sm ">
        <circle
          cx="40"
          cy="40"
          r={circleRadius}
          strokeWidth="5"
          className="fill-transparent"
          stroke={getStrokeColor()} /* Apply dynamic stroke color */
          strokeDasharray={circleCircumference}
          strokeDashoffset={progress === 0 ? circleCircumference - 3.77 : circleCircumference - (circleCircumference * progress) / 100}
        />
      </svg>
      <svg className="absolute w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={circleRadius}
          strokeWidth="5"
          className="dark:fill-gray-600/50 backdrop-blur-2xl fill-gray-200/20"
          stroke={getStrokeColor()} /* Apply dynamic stroke color */
          strokeDasharray={circleCircumference} 
          strokeDashoffset={progress === 0 ?  circleCircumference - 3.77 : circleCircumference - (circleCircumference * progress) / 100}
        />
      </svg>

      {/* Progress percentage text */}
      <span className="absolute text-lg font-semibold font-ubuntu text-blend-luminosity text-white-700 dark:text-white">
        {progress}%
      </span>
    </div>
  );
};

export default CircularProgressBar;
