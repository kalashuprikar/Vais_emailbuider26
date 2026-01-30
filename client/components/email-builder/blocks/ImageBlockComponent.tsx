import React, { useRef, useState } from "react";
import { ImageBlock } from "../types";
import { Upload, Copy, Trash2 } from "lucide-react";

interface ImageBlockComponentProps {
  block: ImageBlock;
  isSelected: boolean;
  onSrcChange: (src: string) => void;
  onDimensionChange: (width: number, height: number) => void;
  onDuplicate?: (block: ImageBlock, position: number) => void;
  onDelete?: (blockId: string) => void;
  blockIndex?: number;
}

export const ImageBlockComponent: React.FC<ImageBlockComponentProps> = ({
  block,
  isSelected,
  onSrcChange,
  onDimensionChange,
  onDuplicate,
  onDelete,
  blockIndex = 0,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(block.width);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (warn if > 1MB)
      if (file.size > 1024 * 1024) {
        console.warn(
          "⚠️ Large image detected! File size: " +
            (file.size / 1024 / 1024).toFixed(2) +
            "MB. Consider using a smaller image to avoid storage issues.",
        );
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onSrcChange(result);
        }
      };
      reader.onerror = () => {
        console.error("❌ Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(block.width);
  };

  React.useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      let newWidth: number;

      // Handle different width units properly
      if (block.widthUnit === "%") {
        // For percentage, convert pixel delta to percentage
        const containerWidth =
          containerRef.current?.getBoundingClientRect().width || 600;
        const deltaPercent = (deltaX / containerWidth) * 100;
        newWidth = Math.max(10, Math.min(100, startWidth + deltaPercent)); // Min 10%, Max 100%
      } else {
        // For pixels, directly add pixel delta
        newWidth = Math.max(50, Math.min(800, startWidth + deltaX)); // Min 50px, Max 800px
      }

      onDimensionChange(newWidth, block.height);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startX, startWidth, block, onDimensionChange]);

  return (
    <div
      ref={containerRef}
      className={`relative p-4 transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{ textAlign: block.alignment as any }}
    >
      {block.src ? (
        <div
          className="group"
          style={{
            textAlign: block.alignment as any,
            position: "relative",
            display: "inline-block",
            width: block.alignment === "center" ? "auto" : "auto",
            margin: block.alignment === "center" ? "0 auto" : "0",
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {(block as any).linkTarget ? (
            <a
              href={(block as any).linkTarget}
              title={(block as any).linkTooltip || ""}
              style={{
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              <img
                src={block.src}
                alt={block.alt || "Image"}
                crossOrigin="anonymous"
                style={{
                  width: `${block.width || 100}${block.widthUnit || "px"}`,
                  height:
                    block.heightUnit === "%"
                      ? `${block.height || 100}${block.heightUnit}`
                      : `${block.height || "auto"}px`,
                  display: "block",
                  maxWidth: "100%",
                  objectFit: "contain",
                  boxSizing: "border-box",
                  userSelect: "none",
                }}
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  const currentSrc = imgElement.src;

                  // Retry with CORS proxy if not already attempted
                  if (!currentSrc.includes("cors-anywhere") && !currentSrc.includes("corsproxy")) {
                    console.warn("⚠️ Image blocked by CORS. Retrying with proxy...", block.src);
                    imgElement.src = `https://cors-anywhere.herokuapp.com/${block.src}`;
                    imgElement.onerror = () => {
                      console.error("Image failed to load even with CORS proxy:", block.src);
                      imgElement.style.border = "2px solid red";
                      imgElement.style.opacity = "0.5";
                    };
                  }
                }}
              />
            </a>
          ) : (
            <img
              src={block.src}
              alt={block.alt || "Image"}
              crossOrigin="anonymous"
              style={{
                width: `${block.width || 100}${block.widthUnit || "px"}`,
                height:
                  block.heightUnit === "%"
                    ? `${block.height || 100}${block.heightUnit}`
                    : `${block.height || "auto"}px`,
                display: "block",
                maxWidth: "100%",
                objectFit: "contain",
                boxSizing: "border-box",
                userSelect: "none",
              }}
              onError={(e) => {
                console.error("Image failed to load:", block.src);
                (e.target as HTMLImageElement).style.border = "2px solid red";
              }}
            />
          )}

          {/* Hover Toolbar */}
          {isHovering && (
            <div
              className="absolute top-0 right-0 flex gap-2 items-center bg-white border border-gray-300 rounded-lg p-2 shadow-lg z-50"
              style={{
                transform: "translateY(-100%)",
                marginTop: "-8px",
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {onDuplicate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(block, blockIndex + 1);
                  }}
                  className="text-gray-700 hover:text-blue-600 transition-colors p-1"
                  title="Copy block"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(block.id);
                  }}
                  className="text-gray-700 hover:text-red-600 transition-colors p-1"
                  title="Delete block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          {/* Resize Handle */}
          {isSelected && (
            <div
              onMouseDown={handleResizeStart}
              style={{
                position: "absolute",
                right: "-3px",
                top: 0,
                height: "100%",
                width: "12px",
                backgroundColor: isResizing
                  ? "#FF6B35"
                  : "rgba(255, 107, 53, 0.4)",
                cursor: "col-resize",
                zIndex: 50,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  "#FF6B35";
                (e.currentTarget as HTMLDivElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                if (!isResizing) {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    "rgba(255, 107, 53, 0.4)";
                  (e.currentTarget as HTMLDivElement).style.opacity = "0.7";
                }
              }}
              title="Drag to resize image width"
            />
          )}
        </div>
      ) : (
        <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload image</p>
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
  );
};
