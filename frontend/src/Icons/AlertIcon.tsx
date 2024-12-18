import React from 'react';

interface AlertIconProps {
  fillColor?: string;
  size?: number;
}

const AlertIcon: React.FC<AlertIconProps> = ({ fillColor = "#000000", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        fill={fillColor}
        fillRule="evenodd"
        d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm10.01 4a1 1 0 01-1 1H10a1 1 0 110-2h.01a1 1 0 011 1zM11 6a1 1 0 10-2 0v5a1 1 0 102 0V6z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default AlertIcon;
