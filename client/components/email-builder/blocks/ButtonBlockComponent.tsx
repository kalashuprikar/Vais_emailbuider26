import React, { useState } from "react";
import { ButtonBlock } from "../types";

interface ButtonBlockComponentProps {
  block: ButtonBlock;
  isSelected: boolean;
}

export const ButtonBlockComponent: React.FC<ButtonBlockComponentProps> = ({
  block,
  isSelected,
}) => {
  const buttonBorder =
    block.borderWidth > 0
      ? `${block.borderWidth}px solid ${block.borderColor}`
      : "none";

  const buttonDisplay =
    block.alignment === "left"
      ? "flex"
      : block.alignment === "right"
        ? "flex"
        : "flex";

  const buttonJustify =
    block.alignment === "left"
      ? "flex-start"
      : block.alignment === "right"
        ? "flex-end"
        : "center";

  const buttonWidth =
    block.widthUnit === "%" ? `${block.width}%` : `${block.width}px`;

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`p-4 transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{
        display: buttonDisplay,
        justifyContent: buttonJustify,
        margin: `${block.margin}px`,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          overflow: "visible",
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          style={{
            backgroundColor: block.backgroundColor,
            color: block.textColor,
            padding: `${block.padding}px 20px`,
            borderRadius: `${block.borderRadius}px`,
            border: buttonBorder,
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            width: buttonWidth,
            textAlign: "center",
          }}
          disabled
        >
          {block.text}
        </button>
        {showTooltip && block.linkTooltip && (
          <div
            style={
              {
                position: "absolute",
                top: "calc(100% + 12px)",
                left: "60%",
                transform: "translateX(-50%) scale(1)",
                backgroundColor: "#F5F5F5",
                color: "#333333",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                zIndex: 10000,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                pointerEvents: "none",
                animation: "tooltipFade 0.2s ease-in-out",
                letterSpacing: "0.3px",
                border: "1px solid #E5E5E5",
              } as React.CSSProperties
            }
          >
            {block.linkTooltip}
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: "50%",
                marginLeft: "-5px",
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderBottom: "5px solid #F5F5F5",
              }}
            />
            <style>{`
              @keyframes tooltipFade {
                from {
                  opacity: 0;
                  transform: translateX(-50%) scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: translateX(-50%) scale(1);
                }
              }
            `}</style>
          </div>
        )}
        {showTooltip && block.link && block.link !== "#" && (
          <div
            style={
              {
                position: "fixed",
                bottom: "20px",
                left: "20px",
                backgroundColor: "#D97706",
                color: "#FFFFFF",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "500",
                maxWidth: "500px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                zIndex: 10001,
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                pointerEvents: "none",
                animation: "urlDisplay 0.2s ease-in-out",
                letterSpacing: "0px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                fontFamily: "monospace",
              } as React.CSSProperties
            }
          >
            URL: {block.link}
            <style>{`
              @keyframes urlDisplay {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};
