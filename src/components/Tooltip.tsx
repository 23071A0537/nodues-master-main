import React, { ReactNode } from "react";
import "./Tooltip.css";

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = "top",
}) => {
  return (
    <div className="tooltip-wrapper">
      {children}
      <span className={`tooltip-text tooltip-${position}`}>{text}</span>
    </div>
  );
};

export default Tooltip;
