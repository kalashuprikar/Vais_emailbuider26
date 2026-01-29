import React, { useState } from "react";
import { CenteredImageCardBlock } from "../types";
import { ContentBlock } from "../types";
import { Upload, Edit2, Plus, Copy, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CenteredImageCardBlockComponentProps {
  block: CenteredImageCardBlock;
  isSelected: boolean;
  onBlockUpdate: (block: CenteredImageCardBlock) => void;
  blockIndex?: number;
}

export const CenteredImageCardBlockComponent: React.FC<
  CenteredImageCardBlockComponentProps
> = ({ block, isSelected, onBlockUpdate, blockIndex = 0 }) => {
  const [editMode, setEditMode] = useState<string | null>(null);

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
    value: string,
  ) => {
    onBlockUpdate({ ...block, [field]: value });
  };

  const SectionToolbar = ({
    sectionType,
  }: {
    sectionType: "image" | "title" | "description" | "buttonText";
  }) => {
    const handleCopy = () => {
      let contentToCopy = "";
      if (sectionType === "title") contentToCopy = block.title;
      else if (sectionType === "description") contentToCopy = block.description;
      else if (sectionType === "buttonText") contentToCopy = block.buttonText;
      else if (sectionType === "image") contentToCopy = block.image;

      if (!contentToCopy) {
        return;
      }

      try {
        // Use fallback method that's more compatible
        const textArea = document.createElement("textarea");
        textArea.value = contentToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (err) {
        // Silently fail if copy doesn't work
        console.error("Copy failed:", err);
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
      } else if (sectionType === "image") {
        onBlockUpdate({ ...block, image: "" });
        setEditMode(null);
      }
    };

    const handleAdd = () => {
      // Add text/content to the section
      if (sectionType === "title" || sectionType === "description") {
        // For now, just focus on the field when add is clicked
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
          onMouseDown={(e) => {
            e.preventDefault();
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
          onMouseDown={(e) => {
            e.preventDefault();
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
      className={`rounded-lg group ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      } hover:border-2 hover:border-dotted hover:border-gray-400`}
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
          className={`relative group mb-6 ${editMode === "image" ? "border-2 border-dotted border-valasys-orange rounded-lg" : ""} hover:border-2 hover:border-dotted hover:border-valasys-orange transition-all rounded-lg`}
        >
          {block.image ? (
            <>
              <img
                src={block.image}
                alt={block.imageAlt}
                onClick={() => setEditMode("image")}
                className="w-full h-auto rounded-lg cursor-pointer"
              />
              <label
                className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-lg ${editMode === "image" ? "pointer-events-none" : ""}`}
              >
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
          {editMode === "image" && <SectionToolbar sectionType="image" />}
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
                  className="text-center font-bold text-lg"
                />
              ) : (
                <h3
                  onClick={() => setEditMode("title")}
                  className="font-bold text-xl text-gray-900 cursor-pointer transition-all p-2 rounded hover:border-2 hover:border-dotted hover:border-gray-400"
                >
                  {block.title}
                </h3>
              )}
              {editMode === "title" && <SectionToolbar sectionType="title" />}
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
                  className="w-full p-2 rounded text-sm text-gray-600 min-h-24 border border-dotted border-valasys-orange focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                />
              ) : (
                <p
                  onClick={() => setEditMode("description")}
                  className="text-sm text-gray-600 cursor-pointer transition-all p-2 rounded whitespace-pre-wrap break-words hover:border-2 hover:border-dotted hover:border-gray-400"
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
            <div className="pt-2">
              {editMode === "buttonText" ? (
                <Input
                  value={block.buttonText}
                  onChange={(e) =>
                    handleFieldChange("buttonText", e.target.value)
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="text-center"
                />
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={() => setEditMode("buttonText")}
                    className="inline-block py-2 px-6 bg-valasys-orange text-white rounded text-sm font-bold hover:bg-orange-600 cursor-pointer transition-all hover:border-2 hover:border-dotted hover:border-gray-400"
                  >
                    {block.buttonText}
                  </button>
                </div>
              )}
              {editMode === "buttonText" && (
                <SectionToolbar sectionType="buttonText" />
              )}
            </div>
          )}

          {editMode === "buttonLink" && (
            <div>
              <Input
                value={block.buttonLink}
                onChange={(e) =>
                  handleFieldChange("buttonLink", e.target.value)
                }
                onBlur={() => setEditMode(null)}
                autoFocus
                placeholder="https://example.com"
                className="text-sm text-center"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
