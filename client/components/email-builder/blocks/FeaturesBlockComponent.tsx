import React from "react";
import { FeaturesBlock } from "../types";
import { renderBlockToHTML } from "../utils";

interface FeaturesBlockComponentProps {
  block: FeaturesBlock;
  isSelected: boolean;
  onUpdate: (block: FeaturesBlock) => void;
}

export const FeaturesBlockComponent: React.FC<FeaturesBlockComponentProps> = ({
  block,
  isSelected,
}) => {
  const html = renderBlockToHTML(block);

  return (
    <div
      className={`w-full rounded-lg overflow-hidden ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
