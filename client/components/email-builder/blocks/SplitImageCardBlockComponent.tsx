import React, { useState } from "react";
import { SplitImageCardBlock } from "../types";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SplitImageCardBlockComponentProps {
  block: SplitImageCardBlock;
  isSelected: boolean;
  onBlockUpdate: (block: SplitImageCardBlock) => void;
}

export const SplitImageCardBlockComponent: React.FC<
  SplitImageCardBlockComponentProps
> = ({ block, isSelected, onBlockUpdate }) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [isHoveringDescription, setIsHoveringDescription] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHoveringButtonLink, setIsHoveringButtonLink] = useState(false);

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
            <div className="md:w-2/5 relative group">
              {block.image ? (
                <>
                  <img
                    src={block.image}
                    alt={block.imageAlt}
                    className="w-full h-auto rounded"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
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
              )}
            </div>
          )}

          <div className={isImageLeft ? "md:w-3/5" : "md:w-3/5 order-first"}>
            <div className="space-y-3 p-4">
              <div>
                {editMode === "title" ? (
                  <Input
                    value={block.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    onBlur={() => setEditMode(null)}
                    autoFocus
                    className="font-bold text-lg focus:outline-none"
                    style={{ border: "2px solid rgb(255, 106, 0) !important" }}
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
              </div>

              <div>
                {editMode === "description" ? (
                  <textarea
                    value={block.description}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                    onBlur={() => setEditMode(null)}
                    autoFocus
                    className="w-full p-4 rounded-lg text-sm text-gray-700 min-h-24 focus:outline-none bg-white resize-none"
                    style={{ border: "2px solid rgb(255, 106, 0) !important", boxSizing: "border-box" }}
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
              </div>

              <div>
                {editMode === "buttonText" ? (
                  <Input
                    value={block.buttonText}
                    onChange={(e) =>
                      handleFieldChange("buttonText", e.target.value)
                    }
                    onBlur={() => setEditMode(null)}
                    autoFocus
                    className="focus:outline-none"
                    style={{ border: "2px solid rgb(255, 106, 0) !important" }}
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
              </div>

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
                    className="text-sm focus:outline-none"
                    style={{ border: "2px solid rgb(255, 106, 0) !important" }}
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
            </div>
          </div>

          {!isImageLeft && (
            <div className="md:w-2/5 relative group">
              {block.image ? (
                <>
                  <img
                    src={block.image}
                    alt={block.imageAlt}
                    className="w-full h-auto rounded"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
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
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2 justify-end">
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
