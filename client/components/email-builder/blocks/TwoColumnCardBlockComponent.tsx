import React, { useState, useRef, useEffect } from "react";
import { TwoColumnCardBlock } from "../types";
import { Upload, Trash2, Plus, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Helper function to copy text to clipboard with fallbacks
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("Clipboard API failed, trying fallback:", err);
  }

  // Fallback: use textarea method
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);

    // For iOS compatibility
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }

    const success = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (success) {
      return true;
    }
  } catch (err) {
    console.error("Fallback clipboard copy failed:", err);
  }

  return false;
};

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
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const handleDuplicateCard = (cardId: string) => {
    const cardToDuplicate = block.cards.find((c) => c.id === cardId);
    if (cardToDuplicate) {
      const newCard = {
        ...cardToDuplicate,
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      const cardIndex = block.cards.findIndex((c) => c.id === cardId);
      const newCards = [...block.cards];
      newCards.splice(cardIndex + 1, 0, newCard);
      onUpdate({ ...block, cards: newCards });
    }
  };

  const handleCopyStyledTitle = async (text: string) => {
    await copyToClipboard(text);
  };

  const handleCopyStyledDescription = async (text: string) => {
    await copyToClipboard(text);
  };

  const handleDeleteCard = (cardId: string) => {
    if (block.cards.length > 1) {
      const newCards = block.cards.filter((c) => c.id !== cardId);
      onUpdate({ ...block, cards: newCards });
      setFocusedField(null);
    }
  };

  const handleDeleteField = (
    cardId: string,
    fieldName: "title" | "description",
  ) => {
    const updatedCards = block.cards.map((card) =>
      card.id === cardId ? { ...card, [fieldName]: "" } : card,
    );
    onUpdate({ ...block, cards: updatedCards });
    setFocusedField(null);
  };

  const FieldToolbar = ({
    cardId,
    fieldName,
    fieldValue,
    onCopy,
    onDelete,
  }: {
    cardId: string;
    fieldName: "title" | "description";
    fieldValue: string;
    onCopy: (value: string, fieldName: "title" | "description") => void;
    onDelete: (cardId: string, fieldName: "title" | "description") => void;
  }) => {
    return (
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm mt-2 w-fit">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-gray-100"
          title="Add new card"
          onClick={(e) => {
            e.stopPropagation();
            handleDuplicateCard(cardId);
          }}
        >
          <Plus className="w-3 h-3 text-gray-700" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-gray-100"
          title="Copy"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(fieldValue, fieldName);
          }}
        >
          <Copy className="w-3 h-3 text-gray-700" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-red-100"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(cardId, fieldName);
          }}
        >
          <Trash2 className="w-3 h-3 text-red-600" />
        </Button>
      </div>
    );
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
              height: "400px",
            }}
            onMouseEnter={() => setHoveredCardId(card.id)}
            onMouseLeave={() => setHoveredCardId(null)}
          >
            {/* Image Section */}
            <div
              className="relative h-40 flex-shrink-0"
              style={{
                borderRadius: `${card.borderRadius}px ${card.borderRadius}px 0 0`,
              }}
            >
              {card.image ? (
                <>
                  <div
                    style={{
                      padding: "12px",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
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
              className="flex-1 overflow-hidden"
              style={{
                padding: `${Math.max(12, card.padding)}px`,
                color: card.textColor,
                margin: 0,
                border: "none",
              }}
            >
              {editingField === `${card.id}-title` ? (
                <>
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
                  <FieldToolbar
                    cardId={card.id}
                    fieldName="title"
                    fieldValue={editingValue}
                    onCopy={(value, fieldName) =>
                      fieldName === "title"
                        ? handleCopyStyledTitle(value)
                        : handleCopyStyledDescription(value)
                    }
                    onDelete={handleDeleteField}
                  />
                </>
              ) : card.title ? (
                <div
                  onMouseEnter={() => setHoveredField(`${card.id}-title`)}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <h3
                    className="font-bold text-base mb-2 m-0 cursor-pointer px-2 py-1 rounded transition-all"
                    style={{
                      color: card.textColor,
                      border:
                        focusedField === `${card.id}-title`
                          ? "2px solid rgb(255, 106, 0)"
                          : hoveredField === `${card.id}-title`
                            ? "2px dotted rgb(255, 106, 0)"
                            : "none",
                    }}
                    onClick={() => setFocusedField(`${card.id}-title`)}
                    onDoubleClick={() =>
                      handleStartEditingField(card.id, "title")
                    }
                    title="Double-click to edit"
                  >
                    {card.title}
                  </h3>
                  {focusedField === `${card.id}-title` && (
                    <FieldToolbar
                      cardId={card.id}
                      fieldName="title"
                      fieldValue={card.title}
                      onCopy={(value, fieldName) =>
                        fieldName === "title"
                          ? handleCopyStyledTitle(value)
                          : handleCopyStyledDescription(value)
                      }
                      onDelete={handleDeleteField}
                    />
                  )}
                </div>
              ) : null}
              {editingField === `${card.id}-description` ? (
                <>
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
                  <FieldToolbar
                    cardId={card.id}
                    fieldName="description"
                    fieldValue={editingValue}
                    onCopy={(value, fieldName) =>
                      fieldName === "title"
                        ? handleCopyStyledTitle(value)
                        : handleCopyStyledDescription(value)
                    }
                    onDelete={handleDeleteField}
                  />
                </>
              ) : card.description ? (
                <div
                  onMouseEnter={() => setHoveredField(`${card.id}-description`)}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <p
                    className="text-xs leading-snug m-0 cursor-pointer px-2 py-1 rounded transition-all"
                    style={{
                      color: card.textColor,
                      border:
                        focusedField === `${card.id}-description`
                          ? "2px solid rgb(255, 106, 0)"
                          : hoveredField === `${card.id}-description`
                            ? "2px dotted rgb(255, 106, 0)"
                            : "none",
                    }}
                    onClick={() => setFocusedField(`${card.id}-description`)}
                    onDoubleClick={() =>
                      handleStartEditingField(card.id, "description")
                    }
                    title="Double-click to edit"
                  >
                    {card.description}
                  </p>
                  {focusedField === `${card.id}-description` && (
                    <FieldToolbar
                      cardId={card.id}
                      fieldName="description"
                      fieldValue={card.description}
                      onCopy={(value, fieldName) =>
                        fieldName === "title"
                          ? handleCopyStyledTitle(value)
                          : handleCopyStyledDescription(value)
                      }
                      onDelete={handleDeleteField}
                    />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
