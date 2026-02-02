import React, { useState, useRef, useEffect, useMemo } from "react";
import { CenteredImageCardBlock } from "../types";
import { ContentBlock } from "../types";
import { Upload, Edit2, Copy, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CenteredImageCardBlockComponentProps {
  block: CenteredImageCardBlock;
  isSelected: boolean;
  onBlockUpdate: (block: CenteredImageCardBlock) => void;
  blockIndex?: number;
}

// Helper to generate unique IDs
const generateId = () =>
  `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const CenteredImageCardBlockComponent: React.FC<
  CenteredImageCardBlockComponentProps
> = ({ block, isSelected, onBlockUpdate, blockIndex = 0 }) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Initialize sections from old format or arrays
  const titles = useMemo(
    () =>
      block.titles ||
      (block.title ? [{ id: "title-0", content: block.title }] : []),
    [block.titles, block.title],
  );

  const descriptions = useMemo(
    () =>
      block.descriptions ||
      (block.description
        ? [{ id: "description-0", content: block.description }]
        : []),
    [block.descriptions, block.description],
  );

  const buttons = useMemo(
    () =>
      block.buttons ||
      (block.buttonText
        ? [
            {
              id: "button-0",
              text: block.buttonText,
              link: block.buttonLink,
            },
          ]
        : []),
    [block.buttons, block.buttonText, block.buttonLink],
  );

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

  const handleAddTitle = () => {
    const newTitles = [...titles, { id: generateId(), content: "" }];
    onBlockUpdate({ ...block, titles: newTitles });
    setEditMode(`title-${newTitles[newTitles.length - 1].id}`);
  };

  const handleAddDescription = () => {
    const newDescriptions = [
      ...descriptions,
      { id: generateId(), content: "" },
    ];
    onBlockUpdate({ ...block, descriptions: newDescriptions });
    setEditMode(
      `description-${newDescriptions[newDescriptions.length - 1].id}`,
    );
  };

  const handleAddButton = () => {
    const newButtons = [...buttons, { id: generateId(), text: "", link: "" }];
    onBlockUpdate({ ...block, buttons: newButtons });
    setEditMode(`button-${newButtons[newButtons.length - 1].id}`);
  };

  const handleUpdateTitle = (id: string, content: string) => {
    const newTitles = titles.map((t) => (t.id === id ? { ...t, content } : t));
    onBlockUpdate({ ...block, titles: newTitles });
  };

  const handleUpdateDescription = (id: string, content: string) => {
    const newDescriptions = descriptions.map((d) =>
      d.id === id ? { ...d, content } : d,
    );
    onBlockUpdate({ ...block, descriptions: newDescriptions });
  };

  const handleUpdateButton = (id: string, text: string, link: string) => {
    const newButtons = buttons.map((b) =>
      b.id === id ? { ...b, text, link } : b,
    );
    onBlockUpdate({ ...block, buttons: newButtons });
  };

  const handleDuplicateTitle = (id: string) => {
    const titleToDuplicate = titles.find((t) => t.id === id);
    if (titleToDuplicate) {
      const newTitles = [...titles];
      const index = titles.findIndex((t) => t.id === id);
      newTitles.splice(index + 1, 0, {
        ...titleToDuplicate,
        id: generateId(),
      });
      onBlockUpdate({ ...block, titles: newTitles });

      // Copy to clipboard with complete styling
      const styledContent = `<h2 style="font-weight: 700; font-size: 20px; color: rgb(17, 24, 39); text-align: center; margin: 0; padding: 12px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5;">${titleToDuplicate.content}</h2>`;
      navigator.clipboard
        .write([
          new ClipboardItem({
            "text/html": new Blob([styledContent], { type: "text/html" }),
            "text/plain": new Blob([titleToDuplicate.content], {
              type: "text/plain",
            }),
          }),
        ])
        .catch(() => {
          navigator.clipboard.writeText(titleToDuplicate.content);
        });
    }
  };

  const handleDuplicateDescription = (id: string) => {
    const descToDuplicate = descriptions.find((d) => d.id === id);
    if (descToDuplicate) {
      const newDescriptions = [...descriptions];
      const index = descriptions.findIndex((d) => d.id === id);
      newDescriptions.splice(index + 1, 0, {
        ...descToDuplicate,
        id: generateId(),
      });
      onBlockUpdate({ ...block, descriptions: newDescriptions });

      // Copy to clipboard with complete styling
      const styledContent = `<p style="font-size: 14px; color: rgb(75, 85, 99); text-align: center; white-space: pre-wrap; margin: 0; padding: 12px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; letter-spacing: 0.3px;">${descToDuplicate.content}</p>`;
      navigator.clipboard
        .write([
          new ClipboardItem({
            "text/html": new Blob([styledContent], { type: "text/html" }),
            "text/plain": new Blob([descToDuplicate.content], {
              type: "text/plain",
            }),
          }),
        ])
        .catch(() => {
          navigator.clipboard.writeText(descToDuplicate.content);
        });
    }
  };

  const handleDuplicateButton = (id: string) => {
    const buttonToDuplicate = buttons.find((b) => b.id === id);
    if (buttonToDuplicate) {
      const newButtons = [...buttons];
      const index = buttons.findIndex((b) => b.id === id);
      newButtons.splice(index + 1, 0, {
        ...buttonToDuplicate,
        id: generateId(),
      });
      onBlockUpdate({ ...block, buttons: newButtons });

      // Copy to clipboard with complete styling
      const styledContent = `<a href="${buttonToDuplicate.link}" style="display: inline-block; padding: 10px 24px; background-color: rgb(255, 106, 0); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border: none; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(255, 106, 0, 0.2);">${buttonToDuplicate.text}</a>`;
      navigator.clipboard
        .write([
          new ClipboardItem({
            "text/html": new Blob([styledContent], { type: "text/html" }),
            "text/plain": new Blob(
              [`${buttonToDuplicate.text} (${buttonToDuplicate.link})`],
              { type: "text/plain" },
            ),
          }),
        ])
        .catch(() => {
          navigator.clipboard.writeText(
            `${buttonToDuplicate.text} (${buttonToDuplicate.link})`,
          );
        });
    }
  };

  const handleDeleteTitle = (id: string) => {
    const newTitles = titles.filter((t) => t.id !== id);
    onBlockUpdate({ ...block, titles: newTitles });
    setEditMode(null);
  };

  const handleDeleteDescription = (id: string) => {
    const newDescriptions = descriptions.filter((d) => d.id !== id);
    onBlockUpdate({ ...block, descriptions: newDescriptions });
    setEditMode(null);
  };

  const handleDeleteButton = (id: string) => {
    const newButtons = buttons.filter((b) => b.id !== id);
    onBlockUpdate({ ...block, buttons: newButtons });
    setEditMode(null);
  };

  const SectionToolbar = ({
    onCopy,
    onDelete,
    onAdd,
  }: {
    onCopy: () => void;
    onDelete: () => void;
    onAdd?: () => void;
  }) => {
    return (
      <div
        className="flex items-center justify-center gap-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm mt-2"
        onMouseDown={(e) => e.preventDefault()}
      >
        {onAdd && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-gray-100"
            title="Add"
            onMouseDown={(e) => {
              e.preventDefault();
              onAdd();
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
            onCopy();
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
            onDelete();
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
          style={{
            boxSizing: "border-box",
            position: "relative",
            width: block.image ? "100%" : "auto",
            margin: "0 auto",
          }}
          onMouseEnter={() => block.image && setIsHoveringImage(true)}
          onMouseLeave={() => setIsHoveringImage(false)}
        >
          {block.image ? (
            <>
              <img
                src={block.image}
                alt={block.imageAlt}
                onClick={() => setEditMode("image")}
                className="rounded-lg cursor-pointer"
                crossOrigin="anonymous"
                style={{
                  width: block.width ? `${block.width}px` : "auto",
                  height: block.height ? `${block.height}px` : "auto",
                  display: "block",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  const currentSrc = imgElement.src;

                  // Retry with CORS proxy if not already attempted
                  if (
                    !currentSrc.includes("cors-anywhere") &&
                    !currentSrc.includes("corsproxy")
                  ) {
                    console.warn(
                      "⚠️ Image blocked by CORS. Retrying with proxy...",
                      block.image,
                    );
                    imgElement.src = `https://cors-anywhere.herokuapp.com/${block.image}`;
                    imgElement.onerror = () => {
                      console.error(
                        "Image failed to load even with CORS proxy:",
                        block.image,
                      );
                      imgElement.style.border = "2px solid red";
                      imgElement.style.opacity = "0.5";
                    };
                  }
                }}
              />

              {/* Overlay on hover */}
              {isHoveringImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-100 transition-all rounded-lg">
                  <div className="flex gap-3 items-center">
                    <label className="flex items-center justify-center cursor-pointer p-2 hover:bg-black hover:bg-opacity-60 rounded transition-all">
                      <Upload className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBlockUpdate({ ...block, image: "" });
                      }}
                      className="flex items-center justify-center cursor-pointer p-2 hover:bg-black hover:bg-opacity-60 rounded transition-all"
                      title="Delete image"
                    >
                      <Trash2 className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
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
          {/* Titles Section */}
          {titles.length > 0 && (
            <div className="space-y-2">
              {titles.map((title) => (
                <div key={title.id}>
                  {editMode === `title-${title.id}` ? (
                    <>
                      <Input
                        value={title.content}
                        onChange={(e) =>
                          handleUpdateTitle(title.id, e.target.value)
                        }
                        onBlur={() => setTimeout(() => setEditMode(null), 200)}
                        onMouseDown={(e) => e.stopPropagation()}
                        autoFocus
                        className="text-center font-bold text-lg focus:outline-none"
                        style={{ border: "2px solid rgb(255, 106, 0)" }}
                      />
                      <SectionToolbar
                        onAdd={handleAddTitle}
                        onCopy={() => handleDuplicateTitle(title.id)}
                        onDelete={() => handleDeleteTitle(title.id)}
                      />
                    </>
                  ) : (
                    <div
                      onMouseEnter={() =>
                        setHoveredSection(`title-${title.id}`)
                      }
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      <div className="flex items-center justify-between gap-2 group">
                        <h3
                          onClick={() => setEditMode(`title-${title.id}`)}
                          className="flex-1 font-bold text-xl text-gray-900 cursor-pointer transition-all p-3 rounded"
                          style={{
                            border: "2px dotted rgb(255, 106, 0)",
                          }}
                        >
                          {title.content}
                        </h3>
                        {hoveredSection === `title-${title.id}` && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-gray-100"
                              title="Copy"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateTitle(title.id);
                              }}
                            >
                              <Copy className="w-4 h-4 text-gray-700" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-red-100"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTitle(title.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Descriptions Section */}
          {descriptions.length > 0 && (
            <div className="space-y-2">
              {descriptions.map((desc) => (
                <div key={desc.id}>
                  {editMode === `description-${desc.id}` ? (
                    <>
                      <textarea
                        value={desc.content}
                        onChange={(e) =>
                          handleUpdateDescription(desc.id, e.target.value)
                        }
                        onBlur={() => setTimeout(() => setEditMode(null), 200)}
                        onMouseDown={(e) => e.stopPropagation()}
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
                      <SectionToolbar
                        onAdd={handleAddDescription}
                        onCopy={() => handleDuplicateDescription(desc.id)}
                        onDelete={() => handleDeleteDescription(desc.id)}
                      />
                    </>
                  ) : (
                    <div
                      onMouseEnter={() =>
                        setHoveredSection(`description-${desc.id}`)
                      }
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      <div className="flex items-start justify-between gap-2 group">
                        <p
                          onClick={() => setEditMode(`description-${desc.id}`)}
                          className="flex-1 text-sm text-gray-600 cursor-pointer transition-all p-3 rounded whitespace-pre-wrap break-words"
                          style={{
                            border: "2px dotted rgb(255, 106, 0)",
                          }}
                        >
                          {desc.content}
                        </p>
                        {hoveredSection === `description-${desc.id}` && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-3 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-gray-100"
                              title="Copy"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateDescription(desc.id);
                              }}
                            >
                              <Copy className="w-4 h-4 text-gray-700" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-red-100"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDescription(desc.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Buttons Section */}
          {buttons.length > 0 && (
            <div className="space-y-2 pt-2">
              {buttons.map((btn) => (
                <div key={btn.id}>
                  {editMode === `button-text-${btn.id}` ? (
                    <>
                      <Input
                        value={btn.text}
                        onChange={(e) =>
                          handleUpdateButton(btn.id, e.target.value, btn.link)
                        }
                        onBlur={() => setTimeout(() => setEditMode(null), 200)}
                        onMouseDown={(e) => e.stopPropagation()}
                        autoFocus
                        className="text-center focus:outline-none"
                        style={{ border: "2px solid rgb(255, 106, 0)" }}
                      />
                      <SectionToolbar
                        onAdd={handleAddButton}
                        onCopy={() => handleDuplicateButton(btn.id)}
                        onDelete={() => handleDeleteButton(btn.id)}
                      />
                    </>
                  ) : editMode === `button-link-${btn.id}` ? (
                    <>
                      <Input
                        value={btn.link}
                        onChange={(e) =>
                          handleUpdateButton(btn.id, btn.text, e.target.value)
                        }
                        onBlur={() => setTimeout(() => setEditMode(null), 200)}
                        onMouseDown={(e) => e.stopPropagation()}
                        autoFocus
                        placeholder="https://example.com"
                        className="text-sm text-center focus:outline-none"
                        style={{ border: "2px solid rgb(255, 106, 0)" }}
                      />
                      <SectionToolbar
                        onAdd={handleAddButton}
                        onCopy={() => handleDuplicateButton(btn.id)}
                        onDelete={() => handleDeleteButton(btn.id)}
                      />
                    </>
                  ) : (
                    <div
                      onMouseEnter={() => setHoveredSection(`button-${btn.id}`)}
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      <div className="flex justify-center items-center gap-2 group">
                        <div>
                          <button
                            onClick={() => setEditMode(`button-text-${btn.id}`)}
                            className="inline-block py-2 px-6 bg-valasys-orange text-white rounded text-sm font-bold hover:bg-orange-600 cursor-pointer transition-all"
                            style={{
                              border: "2px dotted white",
                            }}
                          >
                            {btn.text}
                          </button>
                          <div className="text-xs text-gray-500 mt-1">
                            Link: {btn.link || "#"}
                          </div>
                        </div>
                        {hoveredSection === `button-${btn.id}` && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-gray-100"
                              title="Copy"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateButton(btn.id);
                              }}
                            >
                              <Copy className="w-4 h-4 text-gray-700" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-red-100"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteButton(btn.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
