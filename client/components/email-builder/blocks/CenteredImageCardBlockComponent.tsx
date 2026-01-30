import React, { useState, useRef, useEffect } from "react";
import { CenteredImageCardBlock } from "../types";
import { ContentBlock } from "../types";
import { Upload, Edit2, Copy, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CenteredImageCardBlockComponentProps {
  block: CenteredImageCardBlock;
  isSelected: boolean;
  onBlockUpdate: (block: CenteredImageCardBlock) => void;
}

export const CenteredImageCardBlockComponent: React.FC<
  CenteredImageCardBlockComponentProps
> = ({
  block,
  isSelected,
  onBlockUpdate,
}) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [isHoveringDescription, setIsHoveringDescription] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHoveringButtonLink, setIsHoveringButtonLink] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onBlockUpdate({ ...block, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFieldChange = (
    field: keyof CenteredImageCardBlock,
    value: string | number,
  ) => {
    onBlockUpdate({ ...block, [field]: value });
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setStartWidth(block.width || 300);
    setStartHeight(block.height || 200);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeHandle) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // Handle different resize handles
      switch (resizeHandle) {
        case "se": // Southeast corner
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = Math.max(100, startHeight + deltaY);
          break;
        case "sw": // Southwest corner
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = Math.max(100, startHeight + deltaY);
          break;
        case "ne": // Northeast corner
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "nw": // Northwest corner
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "e": // East
          newWidth = Math.max(100, startWidth + deltaX);
          break;
        case "w": // West
          newWidth = Math.max(100, startWidth - deltaX);
          break;
        case "n": // North
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "s": // South
          newHeight = Math.max(100, startHeight + deltaY);
          break;
      }

      onBlockUpdate({ ...block, width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
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
    onBlockUpdate,
  ]);

  const SectionToolbar = ({
    sectionType,
  }: {
    sectionType: "image" | "title" | "description" | "buttonText" | "buttonLink";
  }) => {
    const handleCopy = () => {
      let contentToCopy = "";
      let successMessage = "";

      if (sectionType === "title") {
        contentToCopy = block.title;
        successMessage = "Title copied to clipboard!";
      } else if (sectionType === "description") {
        contentToCopy = block.description;
        successMessage = "Description copied to clipboard!";
      } else if (sectionType === "buttonText") {
        contentToCopy = block.buttonText;
        successMessage = "Button text copied to clipboard!";
      } else if (sectionType === "buttonLink") {
        contentToCopy = block.buttonLink;
        successMessage = "Button link copied to clipboard!";
      } else if (sectionType === "image") {
        contentToCopy = block.image;
        successMessage = "Image URL copied to clipboard!";
      }

      if (!contentToCopy) {
        toast.error("Content is empty");
        return;
      }

      try {
        navigator.clipboard.writeText(contentToCopy).then(() => {
          toast.success(successMessage);
        }).catch(() => {
          toast.error("Failed to copy");
        });
      } catch (err) {
        toast.error("Failed to copy");
      }
    };

    const handleDelete = () => {
      if (sectionType === "title") {
        onBlockUpdate({ ...block, title: "" });
        setEditMode(null);
      } else if (sectionType === "description") {
        onBlockUpdate({ ...block, description: "" });
        setEditMode(null);
      } else if (sectionType === "buttonText") {
        onBlockUpdate({ ...block, buttonText: "" });
        setEditMode(null);
      } else if (sectionType === "buttonLink") {
        onBlockUpdate({ ...block, buttonLink: "" });
        setEditMode(null);
      } else if (sectionType === "image") {
        onBlockUpdate({ ...block, image: "" });
        setEditMode(null);
      }
      toast.success("Deleted!");
    };

    const handleAdd = () => {
      if (sectionType === "title" || sectionType === "description" || sectionType === "buttonText" || sectionType === "buttonLink") {
        setEditMode(sectionType);
      }
    };

    return (
      <div
        className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm mt-2 w-fit"
        onMouseDown={(e) => e.preventDefault()}
      >
        {sectionType !== "image" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-gray-100"
            title="Add"
            onMouseDown={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <Plus className="w-3 h-3 text-gray-700" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-gray-100"
          title="Copy"
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
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
            handleDelete();
          }}
        >
          <Trash2 className="w-3 h-3 text-red-600" />
        </Button>
      </div>
    );
  };

  return (
    <div
      className="rounded-lg group transition-all"
      style={{
        backgroundColor: block.backgroundColor,
        border: `${block.borderWidth}px solid ${block.borderColor}`,
        borderRadius: `${block.borderRadius}px`,
        margin: `${block.margin}px`,
        padding: `${block.padding}px`,
      }}
    >
      <div className="w-full">
        <div
          ref={imageContainerRef}
          className={`relative group mb-6 transition-all rounded-lg ${
            editMode === "image"
              ? "border-2 border-dotted border-valasys-orange"
              : isHoveringImage
                ? "border-2 border-dotted border-gray-400"
                : ""
          }`}
          style={{ boxSizing: "border-box" }}
          onMouseEnter={() => block.image && setIsHoveringImage(true)}
          onMouseLeave={() => setIsHoveringImage(false)}
        >
          {block.image ? (
            <>
              <div
                style={{
                  position: "relative",
                  display: "block",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={block.image}
                  alt={block.imageAlt}
                  onClick={() => setEditMode("image")}
                  className="w-full rounded-lg cursor-pointer"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: "block",
                    maxWidth: "100%",
                  }}
                />

                {/* Overlay on hover */}
                {isHoveringImage && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-100 transition-all cursor-pointer rounded-lg">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Resize Handles - Only show when hovering (Corners only) */}
                {isHoveringImage && (
                  <>
                    {/* Corner handles only */}
                    {[
                      {
                        pos: "nw",
                        cursor: "nw-resize",
                        top: "-4px",
                        left: "-4px",
                      },
                      {
                        pos: "ne",
                        cursor: "ne-resize",
                        top: "-4px",
                        right: "-4px",
                      },
                      {
                        pos: "sw",
                        cursor: "sw-resize",
                        bottom: "-4px",
                        left: "-4px",
                      },
                      {
                        pos: "se",
                        cursor: "se-resize",
                        bottom: "-4px",
                        right: "-4px",
                      },
                    ].map((handle) => (
                      <div
                        key={handle.pos}
                        onMouseDown={(e) => handleResizeStart(e, handle.pos)}
                        style={{
                          position: "absolute",
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#FF6B35",
                          border: "2px solid white",
                          borderRadius: "2px",
                          cursor: handle.cursor,
                          zIndex: 40,
                          ...((handle as any).top && { top: handle.top }),
                          ...((handle as any).bottom && {
                            bottom: handle.bottom,
                          }),
                          ...((handle as any).left && { left: handle.left }),
                          ...((handle as any).right && { right: handle.right }),
                        }}
                        title={`Drag to resize (${handle.pos})`}
                      />
                    ))}
                  </>
                )}
              </div>
            </>
          ) : (
            <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="space-y-4 text-center">
          {(block.title || editMode === "title") && (
            <div>
              {editMode === "title" ? (
                <Input
                  value={block.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="text-center font-bold text-lg focus:outline-none"
                  style={{ border: "2px solid rgb(255, 106, 0)" }}
                />
              ) : (
                <h3
                  onClick={() => setEditMode("title")}
                  onMouseEnter={() => setIsHoveringTitle(true)}
                  onMouseLeave={() => setIsHoveringTitle(false)}
                  className="font-bold text-xl text-gray-900 cursor-pointer transition-all p-3 rounded"
                  style={{
                    border: isHoveringTitle
                      ? "1px dashed rgb(255, 106, 0)"
                      : "none",
                  }}
                >
                  {block.title}
                </h3>
              )}
            </div>
          )}

          {(block.description || editMode === "description") && (
            <div>
              {editMode === "description" ? (
                <textarea
                  value={block.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="w-full resize-none"
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    color: "rgb(55, 65, 81)",
                    minHeight: "7rem",
                    border: "2px solid rgb(255, 106, 0)",
                    boxSizing: "border-box",
                    outline: "none",
                    backgroundColor: "white",
                  }}
                />
              ) : (
                <p
                  onClick={() => setEditMode("description")}
                  onMouseEnter={() => setIsHoveringDescription(true)}
                  onMouseLeave={() => setIsHoveringDescription(false)}
                  className="text-sm text-gray-600 cursor-pointer transition-all p-3 rounded whitespace-pre-wrap break-words"
                  style={{
                    border: isHoveringDescription
                      ? "1px dashed rgb(255, 106, 0)"
                      : "none",
                  }}
                >
                  {block.description}
                </p>
              )}
            </div>
          )}

          {(block.buttonText || editMode === "buttonText") && (
            <div className="pt-2">
              {editMode === "buttonText" ? (
                <Input
                  value={block.buttonText}
                  onChange={(e) =>
                    handleFieldChange("buttonText", e.target.value)
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="text-center focus:outline-none"
                  style={{ border: "2px solid rgb(255, 106, 0)" }}
                />
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={() => setEditMode("buttonText")}
                    onMouseEnter={() => setIsHoveringButton(true)}
                    onMouseLeave={() => setIsHoveringButton(false)}
                    className="inline-block py-2 px-6 bg-valasys-orange text-white rounded text-sm font-bold hover:bg-orange-600 cursor-pointer transition-all"
                    style={{
                      border: isHoveringButton ? "1px dashed white" : "none",
                    }}
                  >
                    {block.buttonText}
                  </button>
                </div>
              )}
            </div>
          )}

          {(block.buttonLink || editMode === "buttonLink") && (
            <div>
              {editMode === "buttonLink" ? (
                <Input
                  value={block.buttonLink}
                  onChange={(e) =>
                    handleFieldChange("buttonLink", e.target.value)
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  placeholder="https://example.com"
                  className="text-sm text-center focus:outline-none"
                  style={{ border: "2px solid rgb(255, 106, 0)" }}
                />
              ) : (
                <p
                  onClick={() => setEditMode("buttonLink")}
                  onMouseEnter={() => setIsHoveringButtonLink(true)}
                  onMouseLeave={() => setIsHoveringButtonLink(false)}
                  className="text-xs text-gray-500 cursor-pointer p-3 rounded break-all transition-all"
                  style={{
                    border: isHoveringButtonLink
                      ? "1px dashed rgb(255, 106, 0)"
                      : "none",
                  }}
                >
                  {block.buttonLink || "#"}
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
