import React from "react";
import { HtmlBlock } from "../types";

interface HtmlBlockComponentProps {
  block: HtmlBlock;
  isSelected: boolean;
  onContentChange: (content: string) => void;
}

export const HtmlBlockComponent: React.FC<HtmlBlockComponentProps> = ({
  block,
  isSelected,
  onContentChange,
}) => {
  const width = `${block.width}${block.widthUnit}`;

  return (
    <div
      className={`relative transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{
        margin: `${block.margin}px`,
        padding: `${block.padding}px`,
        width: block.widthUnit === "%" ? "100%" : "auto",
      }}
    >
      <div
        style={{
          width: width,
        }}
        dangerouslySetInnerHTML={{
          __html: block.content || "<div>Add your HTML here</div>",
        }}
      />
    </div>
  );
};
