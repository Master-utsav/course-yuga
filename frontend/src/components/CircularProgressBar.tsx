import React from "react";

interface CircularProgressBarProps {
  progress: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ progress }) => {
  const circleRadius = 30;
  const circleCircumference = 2 * Math.PI * circleRadius;

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
      <svg className="w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={circleRadius}
          strokeWidth="5"
          className="text-gray-200 dark:text-gray-600 fill-transparent"
          stroke="currentColor"
        />
      </svg>

      {/* Circle progress */}
      <svg className="absolute w-20 h-20 transform -rotate-90 blur-sm">
        <circle
          cx="40"
          cy="40"
          r={circleRadius}
          strokeWidth="5"
          className="fill-transparent"
          stroke={getStrokeColor()} /* Apply dynamic stroke color */
          strokeDasharray={circleCircumference}
          strokeDashoffset={circleCircumference - (circleCircumference * progress) / 100}
        />
      </svg>
      <svg className="absolute w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={circleRadius}
          strokeWidth="5"
          className="fill-transparent"
          stroke={getStrokeColor()} /* Apply dynamic stroke color */
          strokeDasharray={circleCircumference}
          strokeDashoffset={circleCircumference - (circleCircumference * progress) / 100}
        />
      </svg>

      {/* Progress percentage text */}
      <span className="absolute text-lg font-semibold  font-ubuntu mix-blend-luminosity">
        {progress}%
      </span>
    </div>
  );
};

export default CircularProgressBar;
