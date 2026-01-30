import React, { useState, useMemo } from "react";
import { SplitImageCardBlock } from "../types";
import { Upload, Copy, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SplitImageCardBlockComponentProps {
  block: SplitImageCardBlock;
  isSelected: boolean;
  onBlockUpdate: (block: SplitImageCardBlock) => void;
  onDuplicate?: (block: SplitImageCardBlock, position: number) => void;
  blockIndex?: number;
}

// Helper to generate unique IDs
const generateId = () =>
  `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const SplitImageCardBlockComponent: React.FC<
  SplitImageCardBlockComponentProps
> = ({ block, isSelected, onBlockUpdate, onDuplicate, blockIndex = 0 }) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

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

  const toggleImagePosition = () => {
    onBlockUpdate({
      ...block,
      imagePosition: block.imagePosition === "left" ? "right" : "left",
    });
  };

  const handleImageUrlSubmit = () => {
    const trimmedUrl = imageUrlInput.trim();
    if (trimmedUrl) {
      if (
        trimmedUrl.startsWith("http://") ||
        trimmedUrl.startsWith("https://")
      ) {
        onBlockUpdate({ ...block, image: trimmedUrl });
        setImageUrlInput("");
      } else {
        alert("Please enter a valid URL starting with http:// or https://");
      }
    } else {
      alert("Please enter an image URL");
    }
  };

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

      // Copy to clipboard with styling
      const styledContent = `<h2 style="font-weight: bold; font-size: 18px; color: rgb(17, 24, 39);">${titleToDuplicate.content}</h2>`;
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

      // Copy to clipboard with styling
      const styledContent = `<p style="font-size: 14px; color: rgb(75, 85, 99); white-space: pre-wrap;">${descToDuplicate.content}</p>`;
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

      // Copy to clipboard with styling
      const styledContent = `<a href="${buttonToDuplicate.link}" style="display: inline-block; padding: 8px 16px; background-color: rgb(255, 106, 35); color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">${buttonToDuplicate.text}</a>`;
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

  const isImageLeft = block.imagePosition === "left";

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
        className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm mt-2 w-fit"
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
      className="p-4 rounded-lg"
      style={{
        backgroundColor: block.backgroundColor,
        border: `${block.borderWidth}px solid ${block.borderColor}`,
        borderRadius: `${block.borderRadius}px`,
        margin: `${block.margin}px`,
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {isImageLeft && (
            <div
              className="md:w-2/5"
              onMouseEnter={() => block.image && setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              {block.image ? (
                <div className="relative group">
                  <img
                    src={block.image}
                    alt={block.imageAlt}
                    className="w-full h-auto rounded"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all rounded">
                    <div className="flex gap-3 items-center">
                      <label
                        className="flex items-center justify-center cursor-pointer p-2 hover:bg-black hover:bg-opacity-60 rounded transition-all"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).tagName === "LABEL") {
                            (
                              e.currentTarget.querySelector(
                                'input[type="file"]',
                              ) as HTMLInputElement
                            )?.click();
                          }
                        }}
                      >
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
                          navigator.clipboard.writeText(block.image);
                        }}
                        className="flex items-center justify-center cursor-pointer p-2 hover:bg-black hover:bg-opacity-60 rounded transition-all"
                        title="Copy image URL"
                      >
                        <Copy className="w-6 h-6 text-white" />
                      </button>
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
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
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
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Or paste image URL..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleImageUrlSubmit()
                      }
                      className="flex-1 text-xs"
                    />
                    <Button
                      onClick={handleImageUrlSubmit}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={isImageLeft ? "md:w-3/5" : "md:w-3/5 order-first"}>
            <div className="space-y-4 p-4">
              {/* Titles Section */}
              {titles.length > 0 && (
                <div className="space-y-2">
                  {titles.map((title, idx) => (
                    <div key={title.id}>
                      {editMode === `title-${title.id}` ? (
                        <>
                          <Input
                            value={title.content}
                            onChange={(e) =>
                              handleUpdateTitle(title.id, e.target.value)
                            }
                            onBlur={() =>
                              setTimeout(() => setEditMode(null), 200)
                            }
                            onMouseDown={(e) => e.stopPropagation()}
                            autoFocus
                            className="font-bold text-lg focus:outline-none"
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
                          <p
                            onClick={() => setEditMode(`title-${title.id}`)}
                            className="font-bold text-lg text-gray-900 cursor-pointer p-3 rounded transition-all"
                            style={{
                              border:
                                hoveredSection === `title-${title.id}`
                                  ? "1px dashed rgb(255, 106, 0)"
                                  : "none",
                            }}
                          >
                            {title.content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Descriptions Section */}
              {descriptions.length > 0 && (
                <div className="space-y-2">
                  {descriptions.map((desc, idx) => (
                    <div key={desc.id}>
                      {editMode === `description-${desc.id}` ? (
                        <>
                          <textarea
                            value={desc.content}
                            onChange={(e) =>
                              handleUpdateDescription(desc.id, e.target.value)
                            }
                            onBlur={() =>
                              setTimeout(() => setEditMode(null), 200)
                            }
                            onMouseDown={(e) => e.stopPropagation()}
                            autoFocus
                            className="w-full resize-none"
                            style={{
                              padding: "1rem",
                              borderRadius: "0.5rem",
                              fontSize: "0.875rem",
                              color: "rgb(55, 65, 81)",
                              minHeight: "6rem",
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
                          <p
                            onClick={() =>
                              setEditMode(`description-${desc.id}`)
                            }
                            className="text-sm text-gray-600 cursor-pointer p-3 rounded whitespace-pre-line transition-all"
                            style={{
                              border:
                                hoveredSection === `description-${desc.id}`
                                  ? "1px dashed rgb(255, 106, 0)"
                                  : "none",
                            }}
                          >
                            {desc.content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Buttons Section */}
              {buttons.length > 0 && (
                <div className="space-y-2">
                  {buttons.map((btn, idx) => (
                    <div key={btn.id}>
                      {editMode === `button-text-${btn.id}` ? (
                        <>
                          <Input
                            value={btn.text}
                            onChange={(e) =>
                              handleUpdateButton(
                                btn.id,
                                e.target.value,
                                btn.link,
                              )
                            }
                            onBlur={() =>
                              setTimeout(() => setEditMode(null), 200)
                            }
                            onMouseDown={(e) => e.stopPropagation()}
                            autoFocus
                            className="focus:outline-none"
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
                              handleUpdateButton(
                                btn.id,
                                btn.text,
                                e.target.value,
                              )
                            }
                            onBlur={() =>
                              setTimeout(() => setEditMode(null), 200)
                            }
                            onMouseDown={(e) => e.stopPropagation()}
                            autoFocus
                            placeholder="https://example.com"
                            className="text-sm focus:outline-none"
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
                          onMouseEnter={() =>
                            setHoveredSection(`button-${btn.id}`)
                          }
                          onMouseLeave={() => setHoveredSection(null)}
                        >
                          <button
                            onClick={() => setEditMode(`button-text-${btn.id}`)}
                            className="py-2 px-4 bg-valasys-orange text-white rounded text-sm font-bold hover:bg-orange-600 cursor-pointer transition-all"
                            style={{
                              border:
                                hoveredSection === `button-${btn.id}`
                                  ? "1px dashed white"
                                  : "none",
                            }}
                          >
                            {btn.text}
                          </button>
                          <div className="text-xs text-gray-500 mt-1 p-2">
                            Link: {btn.link || "#"}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!isImageLeft && (
            <div
              className="md:w-2/5"
              onMouseEnter={() => block.image && setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              {block.image ? (
                <div className="relative group">
                  <img
                    src={block.image}
                    alt={block.imageAlt}
                    className="w-full h-auto rounded"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all rounded">
                    <div className="flex gap-3 items-center">
                      <label
                        className="flex items-center justify-center cursor-pointer p-2 hover:bg-black hover:bg-opacity-60 rounded transition-all"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).tagName === "LABEL") {
                            (
                              e.currentTarget.querySelector(
                                'input[type="file"]',
                              ) as HTMLInputElement
                            )?.click();
                          }
                        }}
                      >
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
                          navigator.clipboard.writeText(block.image);
                        }}
                        className="flex items-center justify-center cursor-pointer p-2 hover:bg-black hover:bg-opacity-60 rounded transition-all"
                        title="Copy image URL"
                      >
                        <Copy className="w-6 h-6 text-white" />
                      </button>
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
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
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
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Or paste image URL..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleImageUrlSubmit()
                      }
                      className="flex-1 text-xs"
                    />
                    <Button
                      onClick={handleImageUrlSubmit}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            onClick={toggleImagePosition}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Swap Image Position
          </Button>
        </div>
      </div>
    </div>
  );
};
