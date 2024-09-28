import React, { useState } from "react";
import { NavItemsArray } from "../constants/index";
import { NavLink } from "react-router-dom";
import TextHoverJumbledAnimationEffect from "../Effects/TextHoverJumbledAnimationEffect";
import { cn } from "../lib/utilts";
import { useAuthContext } from "../context/authContext";

interface NavItemsProps{
    navListBgForSmallScreen?: string
}
const NavItems: React.FC<NavItemsProps> = ({navListBgForSmallScreen="bg-transparent"}) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const {setIsSignupOpen} = useAuthContext();

  const handleNavigationClick = () => {
    setIsSignupOpen(false);
  }
  return (
    <ul className="nav-ul">
      {NavItemsArray.map((item) => (
        <li
          className={cn('nav-li' , navListBgForSmallScreen)}
          key={item.id}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={handleNavigationClick}
        >
        <NavLink to={item.href} className="nav-li_a z-10">
          <TextHoverJumbledAnimationEffect text={`${item.name}`} isHovered={hoveredId === item.id} />
        </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavItems;
