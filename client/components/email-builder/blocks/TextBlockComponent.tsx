import React from "react";
import { TextBlock } from "../types";
import { Edit2 } from "lucide-react";

interface TextBlockComponentProps {
  block: TextBlock;
  isSelected: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onContentChange: (content: string) => void;
}

export const TextBlockComponent: React.FC<TextBlockComponentProps> = ({
  block,
  isSelected,
  isEditing,
  onEdit,
  onContentChange,
}) => {
  const getWidthStyle = () => {
    if (block.widthUnit === "%") {
      return `${block.width}%`;
    }
    return `${block.width}px`;
  };

  return (
    <div
      className={`relative transition-all cursor-pointer ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      onClick={onEdit}
      style={{
        margin: `${block.margin}px`,
        display: "block",
      }}
    >
      {isEditing ? (
        <textarea
          value={block.content}
          onChange={(e) => onContentChange(e.target.value)}
          autoFocus
          className="w-full border border-valasys-orange rounded px-2 py-1 font-serif"
          style={{
            fontSize: `${block.fontSize}px`,
            color: block.fontColor,
            backgroundColor: block.backgroundColor,
            textAlign: block.alignment as any,
            fontWeight: block.fontWeight as any,
            fontStyle: block.fontStyle as any,
            padding: `${block.padding}px`,
            width: getWidthStyle(),
            borderWidth: `${block.borderWidth}px`,
            borderColor: block.borderColor,
            borderStyle: block.borderWidth > 0 ? "solid" : "none",
            borderRadius: `${block.borderRadius}px`,
          }}
        />
      ) : (
        <p
          style={{
            fontSize: `${block.fontSize}px`,
            color: block.fontColor,
            backgroundColor: block.backgroundColor,
            textAlign: block.alignment as any,
            fontWeight: block.fontWeight as any,
            fontStyle: block.fontStyle as any,
            padding: `${block.padding}px`,
            width: getWidthStyle(),
            borderWidth: `${block.borderWidth}px`,
            borderColor: block.borderColor,
            borderStyle: block.borderWidth > 0 ? "solid" : "none",
            borderRadius: `${block.borderRadius}px`,
            margin: 0,
          }}
        >
          {block.content}
        </p>
      )}
      {isSelected && !isEditing && (
        <div className="absolute top-1 right-1 bg-valasys-orange text-white p-1 rounded">
          <Edit2 className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};
