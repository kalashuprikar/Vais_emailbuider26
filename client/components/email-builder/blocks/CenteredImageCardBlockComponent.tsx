import React, { useState } from "react";
import { CenteredImageCardBlock } from "../types";
import { Upload, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CenteredImageCardBlockComponentProps {
  block: CenteredImageCardBlock;
  isSelected: boolean;
  onBlockUpdate: (block: CenteredImageCardBlock) => void;
}

export const CenteredImageCardBlockComponent: React.FC<
  CenteredImageCardBlockComponentProps
> = ({ block, isSelected, onBlockUpdate }) => {
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

  return (
    <div
      className={`rounded-lg transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{
        backgroundColor: block.backgroundColor,
        border: `${block.borderWidth}px solid ${block.borderColor}`,
        borderRadius: `${block.borderRadius}px`,
        margin: `${block.margin}px`,
        padding: `${block.padding}px`,
      }}
    >
      <div className="w-full">
        <div className="relative group mb-6">
          {block.image ? (
            <>
              <img
                src={block.image}
                alt={block.imageAlt}
                className="w-full h-auto rounded-lg"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-lg">
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
        </div>

        <div className="space-y-4 text-center">
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
                className="font-bold text-xl text-gray-900 cursor-pointer transition-colors p-2 rounded"
              >
                {block.title}
              </h3>
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
                className="w-full p-2 rounded text-sm text-gray-600 min-h-24"
                style={{ borderStyle: "dotted", borderColor: "#d1d5db", borderWidth: "1px" }}
              />
            ) : (
              <p
                onClick={() => setEditMode("description")}
                className="text-sm text-gray-600 cursor-pointer transition-colors p-2 rounded whitespace-pre-wrap break-words"
              >
                {block.description}
              </p>
            )}
          </div>

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
                  className="inline-block py-2 px-6 bg-valasys-orange text-white rounded text-sm font-bold hover:bg-orange-600 cursor-pointer transition-colors"
                >
                  {block.buttonText}
                </button>
              </div>
            )}
          </div>

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
