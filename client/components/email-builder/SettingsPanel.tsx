import React from "react";
import { ContentBlock } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";

interface SettingsPanelProps {
  block: ContentBlock | null;
  onBlockUpdate: (block: ContentBlock) => void;
  onBlockDelete: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  block,
  onBlockUpdate,
  onBlockDelete,
}) => {
  if (!block) {
    return (
      <div className="bg-white border-l border-gray-200 p-4 h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">Select a block to edit</p>
      </div>
    );
  }

  const renderSettings = () => {
    switch (block.type) {
      case "title":
        return (
          <div className="space-y-5">
            <div>
              <Label
                htmlFor="titleContent"
                className="text-xs font-semibold text-gray-700 mb-2 block"
              >
                Content
              </Label>
              <textarea
                id="titleContent"
                value={block.content}
                onChange={(e) =>
                  onBlockUpdate({ ...block, content: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <Label
                htmlFor="titleFontSize"
                className="text-xs font-semibold text-gray-700 mb-2 block"
              >
                Font Size
              </Label>
              <Input
                id="titleFontSize"
                type="number"
                min="12"
                max="72"
                value={block.fontSize}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    fontSize: parseInt(e.target.value),
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label
                htmlFor="titleFontColor"
                className="text-xs font-semibold text-gray-700 mb-2 block"
              >
                Text Color
              </Label>
              <Input
                id="titleFontColor"
                type="color"
                value={block.fontColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, fontColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label
                htmlFor="titleBgColor"
                className="text-xs font-semibold text-gray-700 mb-2 block"
              >
                Background Color
              </Label>
              <Input
                id="titleBgColor"
                type="color"
                value={block.backgroundColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, backgroundColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label
                htmlFor="titleAlignment"
                className="text-xs font-semibold text-gray-700 mb-2 block"
              >
                Alignment
              </Label>
              <select
                id="titleAlignment"
                value={block.alignment}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    alignment: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );
      case "text":
        return (
          <div className="space-y-5">
            <div>
              <Label
                htmlFor="content"
                className="text-xs font-semibold text-gray-700 mb-2 block"
              >
                Content
              </Label>
              <textarea
                id="content"
                value={block.content}
                onChange={(e) =>
                  onBlockUpdate({ ...block, content: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="fontSize">Font Size</Label>
              <Input
                id="fontSize"
                type="number"
                min="8"
                max="72"
                value={block.fontSize}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    fontSize: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="fontColor">Text Color</Label>
              <Input
                id="fontColor"
                type="color"
                value={block.fontColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, fontColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="bgColor">Background Color</Label>
              <Input
                id="bgColor"
                type="color"
                value={block.backgroundColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, backgroundColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="alignment">Alignment</Label>
              <select
                id="alignment"
                value={block.alignment}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    alignment: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <Label htmlFor="fontWeight">Font Weight</Label>
              <select
                id="fontWeight"
                value={block.fontWeight}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    fontWeight: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="space-y-5">
            <div>
              <Label
                htmlFor="width"
                className="text-xs font-semibold text-gray-700 mb-2 block"
              >
                Width (px)
              </Label>
              <Input
                id="width"
                type="number"
                value={block.width}
                onChange={(e) =>
                  onBlockUpdate({ ...block, width: parseInt(e.target.value) })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={block.height}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    height: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="imgAlignment">Alignment</Label>
              <select
                id="imgAlignment"
                value={block.alignment}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    alignment: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );
      case "button":
        return (
          <div className="space-y-5">
            <div>
              <Label
                htmlFor="btnText"
                className="text-xs font-semibold text-gray-700 mb-2 block"
              >
                Button Text
              </Label>
              <Input
                id="btnText"
                value={block.text}
                onChange={(e) =>
                  onBlockUpdate({ ...block, text: e.target.value })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label htmlFor="btnLink">Link</Label>
              <Input
                id="btnLink"
                value={block.link}
                onChange={(e) =>
                  onBlockUpdate({ ...block, link: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="btnBgColor">Button Color</Label>
              <Input
                id="btnBgColor"
                type="color"
                value={block.backgroundColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, backgroundColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="btnTextColor">Text Color</Label>
              <Input
                id="btnTextColor"
                type="color"
                value={block.textColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, textColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="btnAlignment">Alignment</Label>
              <select
                id="btnAlignment"
                value={block.alignment}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    alignment: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );
      case "divider":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="dividerColor">Color</Label>
              <Input
                id="dividerColor"
                type="color"
                value={block.color}
                onChange={(e) =>
                  onBlockUpdate({ ...block, color: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="dividerHeight">Height (px)</Label>
              <Input
                id="dividerHeight"
                type="number"
                value={block.height}
                onChange={(e) =>
                  onBlockUpdate({ ...block, height: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="dividerMargin">Margin (px)</Label>
              <Input
                id="dividerMargin"
                type="number"
                value={block.margin}
                onChange={(e) =>
                  onBlockUpdate({ ...block, margin: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        );
      case "header":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="headerBgColor">Background Color</Label>
              <Input
                id="headerBgColor"
                type="color"
                value={block.backgroundColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, backgroundColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="headerPadding">Padding (px)</Label>
              <Input
                id="headerPadding"
                type="number"
                value={block.padding}
                onChange={(e) =>
                  onBlockUpdate({ ...block, padding: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        );
      case "footer":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="footerContent">Content</Label>
              <textarea
                id="footerContent"
                value={block.content}
                onChange={(e) =>
                  onBlockUpdate({ ...block, content: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="footerBgColor">Background Color</Label>
              <Input
                id="footerBgColor"
                type="color"
                value={block.backgroundColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, backgroundColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="footerTextColor">Text Color</Label>
              <Input
                id="footerTextColor"
                type="color"
                value={block.textColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, textColor: e.target.value })
                }
              />
            </div>
          </div>
        );
      case "spacer":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="spacerHeight">Height (px)</Label>
              <Input
                id="spacerHeight"
                type="number"
                value={block.height}
                onChange={(e) =>
                  onBlockUpdate({ ...block, height: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="spacerBgColor">Background Color</Label>
              <Input
                id="spacerBgColor"
                type="color"
                value={block.backgroundColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, backgroundColor: e.target.value })
                }
              />
            </div>
          </div>
        );
      case "video":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="videoSrc">Video URL</Label>
              <Input
                id="videoSrc"
                value={block.src}
                onChange={(e) =>
                  onBlockUpdate({ ...block, src: e.target.value })
                }
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div>
              <Label htmlFor="videoThumb">Thumbnail URL</Label>
              <Input
                id="videoThumb"
                value={block.thumbnail}
                onChange={(e) =>
                  onBlockUpdate({ ...block, thumbnail: e.target.value })
                }
                placeholder="https://example.com/thumb.jpg"
              />
            </div>
            <div>
              <Label htmlFor="videoWidth">Width (px)</Label>
              <Input
                id="videoWidth"
                type="number"
                value={block.width}
                onChange={(e) =>
                  onBlockUpdate({ ...block, width: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="videoHeight">Height (px)</Label>
              <Input
                id="videoHeight"
                type="number"
                value={block.height}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    height: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        );
      case "dynamicContent":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fieldName">Field Name</Label>
              <Input
                id="fieldName"
                value={block.fieldName}
                onChange={(e) =>
                  onBlockUpdate({ ...block, fieldName: e.target.value })
                }
                placeholder="e.g., user_name"
              />
            </div>
            <div>
              <Label htmlFor="dcBgColor">Background Color</Label>
              <Input
                id="dcBgColor"
                type="color"
                value={block.backgroundColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, backgroundColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="dcPadding">Padding (px)</Label>
              <Input
                id="dcPadding"
                type="number"
                value={block.padding}
                onChange={(e) =>
                  onBlockUpdate({ ...block, padding: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        );
      case "logo":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="logoSrc">Logo URL</Label>
              <Input
                id="logoSrc"
                value={block.src}
                onChange={(e) =>
                  onBlockUpdate({ ...block, src: e.target.value })
                }
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="logoWidth">Width (px)</Label>
              <Input
                id="logoWidth"
                type="number"
                value={block.width}
                onChange={(e) =>
                  onBlockUpdate({ ...block, width: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="logoHeight">Height (px)</Label>
              <Input
                id="logoHeight"
                type="number"
                value={block.height}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    height: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="logoAlignment">Alignment</Label>
              <select
                id="logoAlignment"
                value={block.alignment}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    alignment: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );
      case "social":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="socialSize">Icon Size</Label>
              <select
                id="socialSize"
                value={block.size}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    size: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <Label htmlFor="socialAlignment">Alignment</Label>
              <select
                id="socialAlignment"
                value={block.alignment}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    alignment: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );
      case "html":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="htmlContent">HTML Content</Label>
              <textarea
                id="htmlContent"
                value={block.content}
                onChange={(e) =>
                  onBlockUpdate({ ...block, content: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-mono"
                rows={6}
                placeholder="<div>Your HTML here</div>"
              />
            </div>
          </div>
        );
      case "product":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prodImage">Product Image URL</Label>
              <Input
                id="prodImage"
                value={block.image}
                onChange={(e) =>
                  onBlockUpdate({ ...block, image: e.target.value })
                }
                placeholder="https://example.com/product.jpg"
              />
            </div>
            <div>
              <Label htmlFor="prodTitle">Product Title</Label>
              <Input
                id="prodTitle"
                value={block.title}
                onChange={(e) =>
                  onBlockUpdate({ ...block, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="prodDesc">Description</Label>
              <textarea
                id="prodDesc"
                value={block.description}
                onChange={(e) =>
                  onBlockUpdate({ ...block, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="prodPrice">Price</Label>
              <Input
                id="prodPrice"
                value={block.price}
                onChange={(e) =>
                  onBlockUpdate({ ...block, price: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="prodBtnText">Button Text</Label>
              <Input
                id="prodBtnText"
                value={block.buttonText}
                onChange={(e) =>
                  onBlockUpdate({ ...block, buttonText: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="prodBtnLink">Button Link</Label>
              <Input
                id="prodBtnLink"
                value={block.buttonLink}
                onChange={(e) =>
                  onBlockUpdate({ ...block, buttonLink: e.target.value })
                }
              />
            </div>
          </div>
        );
      case "navigation":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="navBgColor">Background Color</Label>
              <Input
                id="navBgColor"
                type="color"
                value={block.backgroundColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, backgroundColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="navTextColor">Text Color</Label>
              <Input
                id="navTextColor"
                type="color"
                value={block.textColor}
                onChange={(e) =>
                  onBlockUpdate({ ...block, textColor: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="navAlignment">Alignment</Label>
              <select
                id="navAlignment"
                value={block.alignment}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    alignment: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 p-5 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-base">Style</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onBlockDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-5">{renderSettings()}</div>
    </div>
  );
};
