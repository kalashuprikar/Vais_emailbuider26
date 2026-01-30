import React, { useState } from "react";
import { SplitImageCardBlock } from "../types";
import { Upload, Copy, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SplitImageCardBlockComponentProps {
  block: SplitImageCardBlock;
  isSelected: boolean;
  onBlockUpdate: (block: SplitImageCardBlock) => void;
  onDuplicate?: (block: SplitImageCardBlock, position: number) => void;
  onDelete?: () => void;
  blockIndex?: number;
}

export const SplitImageCardBlockComponent: React.FC<
  SplitImageCardBlockComponentProps
> = ({ block, isSelected, onBlockUpdate, onDuplicate, onDelete, blockIndex = 0 }) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [isHoveringDescription, setIsHoveringDescription] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHoveringButtonLink, setIsHoveringButtonLink] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

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
    field: keyof SplitImageCardBlock,
    value: string | boolean,
  ) => {
    onBlockUpdate({ ...block, [field]: value });
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
      // Validate that it's a proper URL
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


  const isImageLeft = block.imagePosition === "left";

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
                  <label
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded"
                    onClick={(e) => {
                      // Only open dialog if clicking on the label, not on toolbar buttons
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
                  {isHoveringImage && (
                    <div className="absolute bottom-0 left-0 right-0 z-50">
                      <SectionToolbar sectionType="image" />
                    </div>
                  )}
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
            <div className="space-y-3 p-4">
              {(block.title || editMode === "title") && (
                <div>
                  {editMode === "title" ? (
                    <Input
                      value={block.title}
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                      onBlur={() => setTimeout(() => setEditMode(null), 200)}
                      onMouseDown={(e) => e.stopPropagation()}
                      autoFocus
                      className="font-bold text-lg focus:outline-none"
                      style={{ border: "2px solid rgb(255, 106, 0)" }}
                    />
                  ) : (
                    <p
                      onClick={() => setEditMode("title")}
                      onMouseEnter={() => setIsHoveringTitle(true)}
                      onMouseLeave={() => setIsHoveringTitle(false)}
                      className="font-bold text-lg text-gray-900 cursor-pointer p-3 rounded transition-all"
                      style={{
                        border: isHoveringTitle
                          ? "1px dashed rgb(255, 106, 0)"
                          : "none",
                      }}
                    >
                      {block.title}
                    </p>
                  )}
                  {editMode === "title" && (
                    <SectionToolbar sectionType="title" />
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
                      onBlur={() => setTimeout(() => setEditMode(null), 200)}
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
                  ) : (
                    <p
                      onClick={() => setEditMode("description")}
                      onMouseEnter={() => setIsHoveringDescription(true)}
                      onMouseLeave={() => setIsHoveringDescription(false)}
                      className="text-sm text-gray-600 cursor-pointer p-3 rounded whitespace-pre-line transition-all"
                      style={{
                        border: isHoveringDescription
                          ? "1px dashed rgb(255, 106, 0)"
                          : "none",
                      }}
                    >
                      {block.description}
                    </p>
                  )}
                  {editMode === "description" && (
                    <SectionToolbar sectionType="description" />
                  )}
                </div>
              )}

              {(block.buttonText || editMode === "buttonText") && (
                <div>
                  {editMode === "buttonText" ? (
                    <Input
                      value={block.buttonText}
                      onChange={(e) =>
                        handleFieldChange("buttonText", e.target.value)
                      }
                      onBlur={() => setTimeout(() => setEditMode(null), 200)}
                      onMouseDown={(e) => e.stopPropagation()}
                      autoFocus
                      className="focus:outline-none"
                      style={{ border: "2px solid rgb(255, 106, 0)" }}
                    />
                  ) : (
                    <button
                      onClick={() => setEditMode("buttonText")}
                      onMouseEnter={() => setIsHoveringButton(true)}
                      onMouseLeave={() => setIsHoveringButton(false)}
                      className="py-2 px-4 bg-valasys-orange text-white rounded text-sm font-bold hover:bg-orange-600 cursor-pointer transition-all"
                      style={{
                        border: isHoveringButton ? "1px dashed white" : "none",
                      }}
                    >
                      {block.buttonText}
                    </button>
                  )}
                  {editMode === "buttonText" && (
                    <SectionToolbar sectionType="buttonText" />
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
                      onBlur={() => setTimeout(() => setEditMode(null), 200)}
                      onMouseDown={(e) => e.stopPropagation()}
                      autoFocus
                      placeholder="https://example.com"
                      className="text-sm focus:outline-none"
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
                  {editMode === "buttonLink" && (
                    <SectionToolbar sectionType="buttonLink" />
                  )}
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
                  <label
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded"
                    onClick={(e) => {
                      // Only open dialog if clicking on the label, not on toolbar buttons
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
                  {isHoveringImage && (
                    <div className="absolute bottom-0 left-0 right-0 z-50">
                      <SectionToolbar sectionType="image" />
                    </div>
                  )}
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

        <div className="mt-4 flex gap-2 justify-between">
          <Button
            onClick={toggleImagePosition}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Swap Image Position
          </Button>

          {isSelected && (onDuplicate || onDelete) && (
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
              {onDuplicate && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(block, blockIndex + 1);
                  }}
                  title="Duplicate block"
                >
                  <Copy className="w-4 h-4 text-gray-700" />
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100"
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  title="Delete block"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
