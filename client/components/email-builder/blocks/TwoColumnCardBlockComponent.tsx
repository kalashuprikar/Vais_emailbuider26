import React, { useState, useRef, useEffect } from "react";
import { TwoColumnCardBlock } from "../types";
import { Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TwoColumnCardBlockComponentProps {
  block: TwoColumnCardBlock;
  isSelected: boolean;
  onUpdate: (block: TwoColumnCardBlock) => void;
}

export const TwoColumnCardBlockComponent: React.FC<
  TwoColumnCardBlockComponentProps
> = ({ block, isSelected, onUpdate }) => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [resizingCardId, setResizingCardId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    cardId: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updatedCards = block.cards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                image: event.target?.result as string,
                imageAlt: file.name,
              }
            : card,
        );
        onUpdate({ ...block, cards: updatedCards });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (cardId: string) => {
    const updatedCards = block.cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            image: "",
            imageAlt: "",
            imageWidth: undefined,
            imageHeight: undefined,
          }
        : card,
    );
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleStartEditingField = (
    cardId: string,
    fieldName: "title" | "description",
  ) => {
    const card = block.cards.find((c) => c.id === cardId);
    if (card) {
      setEditingField(`${cardId}-${fieldName}`);
      setEditingValue(card[fieldName]);
    }
  };

  const handleSaveEdit = (
    cardId: string,
    fieldName: "title" | "description",
  ) => {
    if (editingField === `${cardId}-${fieldName}`) {
      const updatedCards = block.cards.map((card) =>
        card.id === cardId ? { ...card, [fieldName]: editingValue } : card,
      );
      onUpdate({ ...block, cards: updatedCards });
      setEditingField(null);
      setEditingValue("");
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    cardId: string,
    fieldName: "title" | "description",
  ) => {
    if (e.key === "Enter" && fieldName === "title") {
      handleSaveEdit(cardId, fieldName);
    } else if (e.key === "Escape") {
      setEditingField(null);
      setEditingValue("");
    }
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    cardId: string,
    handle: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizingCardId(cardId);
    setResizeHandle(handle);
    setStartX(e.clientX);
    setStartY(e.clientY);

    const card = block.cards.find((c) => c.id === cardId);
    setStartWidth(card?.imageWidth || 300);
    setStartHeight(card?.imageHeight || 200);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeHandle || !resizingCardId) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      switch (resizeHandle) {
        case "se":
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = Math.max(100, startHeight + deltaY);
          break;
        case "sw":
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = Math.max(100, startHeight + deltaY);
          break;
        case "ne":
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "nw":
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "e":
          newWidth = Math.max(100, startWidth + deltaX);
          break;
        case "w":
          newWidth = Math.max(100, startWidth - deltaX);
          break;
        case "n":
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "s":
          newHeight = Math.max(100, startHeight + deltaY);
          break;
      }

      const updatedCards = block.cards.map((card) =>
        card.id === resizingCardId
          ? { ...card, imageWidth: newWidth, imageHeight: newHeight }
          : card,
      );
      onUpdate({ ...block, cards: updatedCards });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      setResizingCardId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isResizing,
    resizeHandle,
    startX,
    startY,
    startWidth,
    startHeight,
    block,
    onUpdate,
    resizingCardId,
  ]);

  return (
    <div
      className={`w-full rounded-lg overflow-hidden ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{
        width: `${block.width}${block.widthUnit}`,
      }}
    >
      <div className="flex gap-5">
        {block.cards.map((card, index) => (
          <div
            key={card.id}
            className="flex-1 rounded-lg overflow-hidden flex flex-col"
            style={{
              backgroundColor: card.backgroundColor,
              margin: `${card.margin}px`,
              borderRadius: `${card.borderRadius}px`,
            }}
            onMouseEnter={() => setHoveredCardId(card.id)}
            onMouseLeave={() => setHoveredCardId(null)}
          >
            {/* Image Section */}
            <div
              className="relative flex-shrink-0"
              style={{
                borderRadius: `${card.borderRadius}px ${card.borderRadius}px 0 0`,
                height: card.imageHeight ? `${card.imageHeight}px` : "auto",
              }}
            >
              {card.image ? (
                <>
                  <div style={{ padding: "12px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img
                      src={card.image}
                      alt={card.imageAlt || "Card image"}
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.style.display = "none";
                        const parent = imgElement.parentElement;
                        if (parent) {
                          const errorDiv = document.createElement("div");
                          errorDiv.className =
                            "w-full h-40 bg-gray-200 flex items-center justify-center text-center p-4";
                          errorDiv.innerHTML =
                            '<p style="font-size: 12px; color: #666;">Image failed to load. Check the URL or upload the image directly.</p>';
                          parent.appendChild(errorDiv);
                        }
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: "100%",
                        display: "block",
                        objectFit: "cover",
                        borderRadius: `${card.borderRadius}px`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <label className="flex items-center justify-center w-full h-full bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors rounded">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, card.id)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Content Section */}
            <div
              style={{
                padding: `${Math.max(12, card.padding)}px`,
                color: card.textColor,
                margin: 0,
                border: "none",
              }}
            >
              {editingField === `${card.id}-title` ? (
                <input
                  type="text"
                  autoFocus
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => handleSaveEdit(card.id, "title")}
                  onKeyPress={(e) => handleKeyPress(e, card.id, "title")}
                  className="w-full font-bold text-base mb-2 m-0 p-1 border-2 border-valasys-orange rounded"
                  style={{
                    color: card.textColor,
                    backgroundColor: "transparent",
                  }}
                />
              ) : (
                <h3
                  className="font-bold text-base mb-2 m-0 cursor-pointer px-2 py-1 rounded transition-all hover:border-2 hover:border-dotted hover:border-current"
                  onDoubleClick={() =>
                    handleStartEditingField(card.id, "title")
                  }
                  title="Double-click to edit"
                >
                  {card.title}
                </h3>
              )}
              {editingField === `${card.id}-description` ? (
                <textarea
                  autoFocus
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => handleSaveEdit(card.id, "description")}
                  onKeyPress={(e) => {
                    if (e.key === "Escape") {
                      setEditingField(null);
                      setEditingValue("");
                    }
                  }}
                  className="w-full text-xs leading-snug m-0 p-1 border-2 border-valasys-orange rounded"
                  style={{
                    color: card.textColor,
                    backgroundColor: "transparent",
                  }}
                  rows={3}
                />
              ) : (
                <p
                  className="text-xs leading-snug m-0 cursor-pointer"
                  onDoubleClick={() =>
                    handleStartEditingField(card.id, "description")
                  }
                  title="Double-click to edit"
                >
                  {card.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
