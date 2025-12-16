import React from "react";
import { NavigationBlock } from "../types";
import { Menu } from "lucide-react";

interface NavigationBlockComponentProps {
  block: NavigationBlock;
  isSelected: boolean;
}

export const NavigationBlockComponent: React.FC<
  NavigationBlockComponentProps
> = ({ block, isSelected }) => {
  return (
    <div
      className={`relative p-4 transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
    >
      <nav
        style={{
          backgroundColor: block.backgroundColor,
          padding: "12px 16px",
          borderRadius: "4px",
          textAlign: block.alignment as any,
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Menu className="w-4 h-4 text-white" />
          <span className="text-xs font-semibold text-white">Navigation</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {block.items.map((item) => (
            <a
              key={`${item.label}-${item.link}`}
              href={item.link}
              style={{
                color: block.textColor,
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};
