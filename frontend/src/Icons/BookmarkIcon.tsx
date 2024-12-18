import * as React from "react";

interface BookmarkIconProps {
  size?: number;
  fillColor?: string;
}

const BookmarkIcon: React.FC<BookmarkIconProps> = ({
  size = 24,
  fillColor = "#464455",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6923 6.08088C14.6923 5.48393 14.2618 5 13.7308 5H7.96154C7.4305 5 7 5.48393 7 6.08088V16.5294L7.76923 15.9529M10.2692 7.47059H16.0385C16.5695 7.47059 17 7.95452 17 8.55147V19L13.1538 16.1176L9.30769 19V8.55147C9.30769 7.95452 9.73819 7.47059 10.2692 7.47059Z"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BookmarkIcon;
