import { RiStarFill, RiStarHalfLine, RiStarLine } from 'react-icons/ri';
import React from 'react';

interface RatingProps {
  rating: number; 
  customColor?: string; 
}

const RatingComponent: React.FC<RatingProps> = ({ rating, customColor = 'gold' }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1); 

  return (
    <div className="rating flex">
      {stars.map((star, i) => {
        if (star <= rating) {
          return <RiStarFill key={i} style={{ color: customColor }} />;
        } else if (star - 0.5 <= rating) {
          return <RiStarHalfLine key={i} style={{ color: customColor }} />;
        } else {
          return <RiStarLine key={i} style={{ color: customColor }} />;
        }
      })}
    </div>
  );
};

export default RatingComponent;
