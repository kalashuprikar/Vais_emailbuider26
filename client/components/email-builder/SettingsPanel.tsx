import React, { useState } from "react";
import { ContentBlock } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, X } from "lucide-react";
import { SocialLinksEditor } from "./SocialLinksEditor";
import { FooterSocialLinksEditor } from "./FooterSocialLinksEditor";

interface SettingsPanelProps {
  block: ContentBlock | null;
  onBlockUpdate: (block: ContentBlock) => void;
  onBlockDelete: () => void;
  selectedFooterElement?: string | null;
  onFooterElementSelect?: (element: string | null) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  block,
  onBlockUpdate,
  onBlockDelete,
  selectedFooterElement,
  onFooterElementSelect,
}) => {
  const [groupPaddingSides, setGroupPaddingSides] = useState(true);
  const [groupMarginSides, setGroupMarginSides] = useState(false);
  const [applyBorderToAllSides, setApplyBorderToAllSides] = useState(true);
  const [linkType, setLinkType] = useState("url");
  const paddingValue =
    "padding" in (block || {}) ? ((block as any).padding ?? 0) : 0;
  const marginValue =
    "margin" in (block || {}) ? ((block as any).margin ?? 0) : 0;
  const [paddingTop, setPaddingTop] = useState(paddingValue);
  const [paddingRight, setPaddingRight] = useState(paddingValue);
  const [paddingBottom, setPaddingBottom] = useState(paddingValue);
  const [paddingLeft, setPaddingLeft] = useState(paddingValue);
  const [marginTop, setMarginTop] = useState(marginValue);
  const [marginRight, setMarginRight] = useState(marginValue);
  const [marginBottom, setMarginBottom] = useState(marginValue);
  const [marginLeft, setMarginLeft] = useState(marginValue);

  if (!block) {
    return (
      <div className="bg-white border-l border-gray-200 p-4 h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">Select a block to edit</p>
      </div>
    );
  }

  const handlePaddingChange = (
    value: number,
    side?: "top" | "right" | "bottom" | "left",
  ) => {
    if (!block || !("padding" in block)) return;
    if (groupPaddingSides && !side) {
      setPaddingTop(value);
      setPaddingRight(value);
      setPaddingBottom(value);
      setPaddingLeft(value);
      onBlockUpdate({ ...block, padding: value });
    } else if (side) {
      if (side === "top") setPaddingTop(value);
      if (side === "right") setPaddingRight(value);
      if (side === "bottom") setPaddingBottom(value);
      if (side === "left") setPaddingLeft(value);
    }
  };

  const handleMarginChange = (
    value: number,
    side?: "top" | "right" | "bottom" | "left",
  ) => {
    if (!block || !("margin" in block)) return;
    if (groupMarginSides && !side) {
      setMarginTop(value);
      setMarginRight(value);
      setMarginBottom(value);
      setMarginLeft(value);
      onBlockUpdate({ ...block, margin: value });
    } else if (side) {
      if (side === "top") setMarginTop(value);
      if (side === "right") setMarginRight(value);
      if (side === "bottom") setMarginBottom(value);
      if (side === "left") setMarginLeft(value);
    }
  };

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
              <h4 className="text-xs font-bold text-gray-900 mb-3">Layout</h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="titleWidth"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Width
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="titleWidth"
                      type="number"
                      min="0"
                      max="100"
                      value={block.width}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          width: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={block.widthUnit}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          widthUnit: e.target.value as "px" | "%",
                        })
                      }
                      className="px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                    >
                      <option value="%">%</option>
                      <option value="px">px</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="titleAlignment"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Block Alignment
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        block.alignment === "left" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "left" })
                      }
                    >
                      ⬅
                    </Button>
                    <Button
                      variant={
                        block.alignment === "center" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "center" })
                      }
                    >
                      ⬇
                    </Button>
                    <Button
                      variant={
                        block.alignment === "right" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "right" })
                      }
                    >
                      ➡
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900">Spacing</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">Padding</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="groupPadding"
                        checked={groupPaddingSides}
                        onCheckedChange={(checked) =>
                          setGroupPaddingSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="groupPadding"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupPaddingSides ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={paddingTop}
                        onChange={(e) =>
                          handlePaddingChange(parseInt(e.target.value))
                        }
                        className="flex-1 focus:ring-valasys-orange focus:ring-2"
                      />
                      <span className="px-2 py-1 text-sm text-gray-600">
                        px
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↑
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingTop}
                          onChange={(e) =>
                            handlePaddingChange(parseInt(e.target.value), "top")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          →
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingRight}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "right",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↓
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingBottom}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "bottom",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ←
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingLeft}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "left",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">Margin</Label>
                  </div>
                  {!groupMarginSides ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={marginTop}
                        onChange={(e) =>
                          handleMarginChange(parseInt(e.target.value))
                        }
                        className="flex-1 focus:ring-valasys-orange focus:ring-2"
                      />
                      <span className="px-2 py-1 text-sm text-gray-600">
                        px
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↑
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginTop}
                          onChange={(e) =>
                            handleMarginChange(parseInt(e.target.value), "top")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          →
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginRight}
                          onChange={(e) =>
                            handleMarginChange(
                              parseInt(e.target.value),
                              "right",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↓
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginBottom}
                          onChange={(e) =>
                            handleMarginChange(
                              parseInt(e.target.value),
                              "bottom",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ←
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginLeft}
                          onChange={(e) =>
                            handleMarginChange(parseInt(e.target.value), "left")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Background
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Color
                  </Label>
                  <Input
                    type="color"
                    value={block.backgroundColor}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        backgroundColor: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-700 mb-2 block">
                    Image
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Add image
                  </Button>
                </div>
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Image URL
                  </Label>
                  <Input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Rounded corners
              </h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="titleRadius"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Radius
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="titleRadius"
                      type="number"
                      min="0"
                      value={block.borderRadius}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderRadius: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900">Borders</h4>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="applyBorder"
                    checked={applyBorderToAllSides}
                    onCheckedChange={(checked) =>
                      setApplyBorderToAllSides(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="applyBorder"
                    className="text-xs text-gray-600 cursor-pointer"
                  >
                    Apply to all sides
                  </Label>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Size
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={block.borderWidth}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderWidth: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Color
                  </Label>
                  <Input
                    type="color"
                    value={block.borderColor}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, borderColor: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Typography
              </h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="titleFontSize"
                    className="text-xs text-gray-700 mb-1 block"
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
                    htmlFor="titleFontWeight"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Font Weight
                  </Label>
                  <select
                    id="titleFontWeight"
                    value={block.fontWeight}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        fontWeight: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="titleFontColor"
                    className="text-xs text-gray-700 mb-1 block"
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
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Content visibility
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Display content based on the type of device or other specific
                conditions
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={block.visibility === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onBlockUpdate({ ...block, visibility: "all" })}
                  className="text-xs"
                >
                  All devices
                </Button>
                <Button
                  variant={
                    block.visibility === "desktop" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onBlockUpdate({ ...block, visibility: "desktop" })
                  }
                  className="text-xs"
                >
                  Only on desktop
                </Button>
                <Button
                  variant={
                    block.visibility === "mobile" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onBlockUpdate({ ...block, visibility: "mobile" })
                  }
                  className="text-xs"
                >
                  Only on mobile
                </Button>
              </div>
            </div>
          </div>
        );
      case "text":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Content
              </Label>
              <textarea
                value={block.content}
                onChange={(e) =>
                  onBlockUpdate({ ...block, content: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                rows={4}
              />
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Layout</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Width
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={block.width}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          width: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={block.widthUnit}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          widthUnit: e.target.value as "px" | "%",
                        })
                      }
                      className="px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                    >
                      <option value="%">%</option>
                      <option value="px">px</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Block Alignment
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        block.alignment === "left" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "left" })
                      }
                    >
                      ⬅
                    </Button>
                    <Button
                      variant={
                        block.alignment === "center" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "center" })
                      }
                    >
                      ⬇
                    </Button>
                    <Button
                      variant={
                        block.alignment === "right" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "right" })
                      }
                    >
                      ➡
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900">Spacing</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">Padding</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="groupPadding"
                        checked={groupPaddingSides}
                        onCheckedChange={(checked) =>
                          setGroupPaddingSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="groupPadding"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupPaddingSides ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={paddingTop}
                        onChange={(e) =>
                          handlePaddingChange(parseInt(e.target.value))
                        }
                        className="flex-1 focus:ring-valasys-orange focus:ring-2"
                      />
                      <span className="px-2 py-1 text-sm text-gray-600">
                        px
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↑
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingTop}
                          onChange={(e) =>
                            handlePaddingChange(parseInt(e.target.value), "top")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          →
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingRight}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "right",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↓
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingBottom}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "bottom",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ←
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingLeft}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "left",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">Margin</Label>
                  </div>
                  {!groupMarginSides ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={marginTop}
                        onChange={(e) =>
                          handleMarginChange(parseInt(e.target.value))
                        }
                        className="flex-1 focus:ring-valasys-orange focus:ring-2"
                      />
                      <span className="px-2 py-1 text-sm text-gray-600">
                        px
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↑
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginTop}
                          onChange={(e) =>
                            handleMarginChange(parseInt(e.target.value), "top")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          →
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginRight}
                          onChange={(e) =>
                            handleMarginChange(
                              parseInt(e.target.value),
                              "right",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↓
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginBottom}
                          onChange={(e) =>
                            handleMarginChange(
                              parseInt(e.target.value),
                              "bottom",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ←
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginLeft}
                          onChange={(e) =>
                            handleMarginChange(parseInt(e.target.value), "left")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Background
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Color
                  </Label>
                  <Input
                    type="color"
                    value={block.backgroundColor}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        backgroundColor: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-700 mb-2 block">
                    Image
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Add image
                  </Button>
                </div>
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Image URL
                  </Label>
                  <Input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Rounded corners
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Radius
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={block.borderRadius}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderRadius: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900">Borders</h4>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="applyBorder"
                    checked={applyBorderToAllSides}
                    onCheckedChange={(checked) =>
                      setApplyBorderToAllSides(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="applyBorder"
                    className="text-xs text-gray-600 cursor-pointer"
                  >
                    Apply to all sides
                  </Label>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Size
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={block.borderWidth}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderWidth: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Color
                  </Label>
                  <Input
                    type="color"
                    value={block.borderColor}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, borderColor: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Typography
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Font Size
                  </Label>
                  <Input
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
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Font Weight
                  </Label>
                  <select
                    value={block.fontWeight}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        fontWeight: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Font Style
                  </Label>
                  <select
                    value={block.fontStyle}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        fontStyle: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Text Color
                  </Label>
                  <Input
                    type="color"
                    value={block.fontColor}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, fontColor: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Content visibility
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Display content based on the type of device or other specific
                conditions
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={block.visibility === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onBlockUpdate({ ...block, visibility: "all" })}
                  className="text-xs"
                >
                  All devices
                </Button>
                <Button
                  variant={
                    block.visibility === "desktop" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onBlockUpdate({ ...block, visibility: "desktop" })
                  }
                  className="text-xs"
                >
                  Only on desktop
                </Button>
                <Button
                  variant={
                    block.visibility === "mobile" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onBlockUpdate({ ...block, visibility: "mobile" })
                  }
                  className="text-xs"
                >
                  Only on mobile
                </Button>
              </div>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="space-y-5">
            {/* Visual Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900">Visual</h4>
                <div className="flex gap-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs h-auto p-0 text-valasys-orange"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs h-auto p-0 text-valasys-orange"
                  >
                    Replace
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 rounded border border-gray-200 aspect-video flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-1">
                    Image placeholder
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                1200 x 675 px - 20 KB
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-700 mb-1 block">
                Image URL
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 focus:ring-valasys-orange focus:ring-2"
                />
                <Button variant="outline" size="sm" className="px-2">
                  ⓘ
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-700 mb-1 block">
                Alt Text
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Describe the image"
                  className="flex-1 focus:ring-valasys-orange focus:ring-2"
                />
                <Button variant="outline" size="sm" className="px-2">
                  ⓘ
                </Button>
              </div>
            </div>

            {/* Link Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Link</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Type
                  </Label>
                  <select
                    value={linkType}
                    onChange={(e) => setLinkType(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                  >
                    <option value="url">Absolute Link (URL)</option>
                    <option value="page">Page Link</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Target
                  </Label>
                  <Input
                    type="text"
                    placeholder="https://example.com"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Tooltip
                  </Label>
                  <Input
                    type="text"
                    placeholder="Hover text"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <Button
                  variant="link"
                  size="sm"
                  className="text-xs h-auto p-0 text-valasys-orange"
                >
                  Remove link
                </Button>
              </div>
            </div>

            {/* Layout Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Layout</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Width
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={block.width}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          width: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={block.widthUnit || "%"}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          widthUnit: e.target.value as "px" | "%",
                        })
                      }
                      className="px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                    >
                      <option value="%">%</option>
                      <option value="px">px</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Height
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={block.height}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          height: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={block.heightUnit || "px"}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          heightUnit: e.target.value as "px" | "%",
                        })
                      }
                      className="px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                    >
                      <option value="%">%</option>
                      <option value="px">px</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Block Alignment
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        block.alignment === "left" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "left" })
                      }
                    >
                      ⬅
                    </Button>
                    <Button
                      variant={
                        block.alignment === "center" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "center" })
                      }
                    >
                      ⬇
                    </Button>
                    <Button
                      variant={
                        block.alignment === "right" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "right" })
                      }
                    >
                      ➡
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rounded Corners Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Rounded corners
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Radius
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={block.borderRadius || 0}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderRadius: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900">Spacing</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">Padding</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="imgGroupPadding"
                        checked={groupPaddingSides}
                        onCheckedChange={(checked) =>
                          setGroupPaddingSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="imgGroupPadding"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupPaddingSides ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={paddingTop}
                        onChange={(e) =>
                          handlePaddingChange(parseInt(e.target.value))
                        }
                        className="flex-1 focus:ring-valasys-orange focus:ring-2"
                      />
                      <span className="px-2 py-1 text-sm text-gray-600">
                        px
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↑
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingTop}
                          onChange={(e) =>
                            handlePaddingChange(parseInt(e.target.value), "top")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          →
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingRight}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "right",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↓
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingBottom}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "bottom",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ←
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingLeft}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "left",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">Margin</Label>
                  </div>
                  {!groupMarginSides ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={marginTop}
                        onChange={(e) =>
                          handleMarginChange(parseInt(e.target.value))
                        }
                        className="flex-1 focus:ring-valasys-orange focus:ring-2"
                      />
                      <span className="px-2 py-1 text-sm text-gray-600">
                        px
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↑
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginTop}
                          onChange={(e) =>
                            handleMarginChange(parseInt(e.target.value), "top")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          →
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginRight}
                          onChange={(e) =>
                            handleMarginChange(
                              parseInt(e.target.value),
                              "right",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↓
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginBottom}
                          onChange={(e) =>
                            handleMarginChange(
                              parseInt(e.target.value),
                              "bottom",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ←
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginLeft}
                          onChange={(e) =>
                            handleMarginChange(parseInt(e.target.value), "left")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Borders Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900">Borders</h4>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="imgApplyBorder"
                    checked={applyBorderToAllSides}
                    onCheckedChange={(checked) =>
                      setApplyBorderToAllSides(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="imgApplyBorder"
                    className="text-xs text-gray-600 cursor-pointer"
                  >
                    Apply to all sides
                  </Label>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Size
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={block.borderWidth || 0}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderWidth: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Color
                  </Label>
                  <Input
                    type="color"
                    value={block.borderColor || "#000000"}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, borderColor: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Content Visibility Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Content visibility
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Display or hide content based on the type of device or other
                specific conditions
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={block.visibility === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onBlockUpdate({ ...block, visibility: "all" })}
                  className="text-xs"
                >
                  All devices
                </Button>
                <Button
                  variant={
                    block.visibility === "desktop" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onBlockUpdate({ ...block, visibility: "desktop" })
                  }
                  className="text-xs"
                >
                  Only on desktop
                </Button>
                <Button
                  variant={
                    block.visibility === "mobile" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onBlockUpdate({ ...block, visibility: "mobile" })
                  }
                  className="text-xs"
                >
                  Only on mobile
                </Button>
              </div>
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
              <h4 className="text-xs font-bold text-gray-900 mb-3">Link</h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="btnLinkType"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Type
                  </Label>
                  <select
                    id="btnLinkType"
                    value={(block as any).linkType || "url"}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        linkType: e.target.value as "url" | "page" | "email",
                      })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                  >
                    <option value="url">Absolute Link (URL)</option>
                    <option value="page">Page</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor="btnLinkTarget"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Target
                  </Label>
                  <Input
                    id="btnLinkTarget"
                    value={(block as any).linkTarget || ""}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, linkTarget: e.target.value })
                    }
                    placeholder="Leave empty for same tab"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="btnLinkTooltip"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Tooltip
                  </Label>
                  <Input
                    id="btnLinkTooltip"
                    value={(block as any).linkTooltip || ""}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, linkTooltip: e.target.value })
                    }
                    placeholder="Hover text"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="btnLink"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    URL
                  </Label>
                  <Input
                    id="btnLink"
                    value={block.link}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, link: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
                <button
                  className="text-xs text-valasys-orange font-semibold hover:text-valasys-orange"
                  onClick={() =>
                    onBlockUpdate({
                      ...block,
                      link: "",
                      linkTarget: "",
                      linkTooltip: "",
                    })
                  }
                >
                  Remove link
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Layout</h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="btnWidth"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Width
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="btnWidth"
                      type="number"
                      min="0"
                      value={block.width}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          width: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={block.widthUnit}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          widthUnit: e.target.value as "px" | "%",
                        })
                      }
                      className="px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                    >
                      <option value="px">px</option>
                      <option value="%">%</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="btnBlockAlignment"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Block Alignment
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        block.alignment === "left" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "left" })
                      }
                    >
                      ⬅
                    </Button>
                    <Button
                      variant={
                        block.alignment === "center" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "center" })
                      }
                    >
                      ⬇
                    </Button>
                    <Button
                      variant={
                        block.alignment === "right" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, alignment: "right" })
                      }
                    >
                      ➡
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900">Spacing</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">Padding</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="btnGroupPadding"
                        checked={groupPaddingSides}
                        onCheckedChange={(checked) =>
                          setGroupPaddingSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="btnGroupPadding"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupPaddingSides ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={paddingTop}
                        onChange={(e) =>
                          handlePaddingChange(parseInt(e.target.value))
                        }
                        className="flex-1 focus:ring-valasys-orange focus:ring-2"
                      />
                      <span className="px-2 py-1 text-sm text-gray-600">
                        px
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↑
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingTop}
                          onChange={(e) =>
                            handlePaddingChange(parseInt(e.target.value), "top")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          →
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingRight}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "right",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↓
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingBottom}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "bottom",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ←
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingLeft}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "left",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">Margin</Label>
                  </div>
                  {!groupMarginSides ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={marginTop}
                        onChange={(e) =>
                          handleMarginChange(parseInt(e.target.value))
                        }
                        className="flex-1 focus:ring-valasys-orange focus:ring-2"
                      />
                      <span className="px-2 py-1 text-sm text-gray-600">
                        px
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↑
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginTop}
                          onChange={(e) =>
                            handleMarginChange(parseInt(e.target.value), "top")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          →
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginRight}
                          onChange={(e) =>
                            handleMarginChange(
                              parseInt(e.target.value),
                              "right",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↓
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginBottom}
                          onChange={(e) =>
                            handleMarginChange(
                              parseInt(e.target.value),
                              "bottom",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ←
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginLeft}
                          onChange={(e) =>
                            handleMarginChange(parseInt(e.target.value), "left")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Background
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Color
                  </Label>
                  <Input
                    type="color"
                    value={block.backgroundColor}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Rounded corners
              </h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="btnRadius"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Radius
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="btnRadius"
                      type="number"
                      min="0"
                      value={block.borderRadius}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderRadius: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Borders</h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="btnBorderSize"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Size
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="btnBorderSize"
                      type="number"
                      min="0"
                      value={block.borderWidth}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderWidth: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="btnBorderColor"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Color
                  </Label>
                  <Input
                    id="btnBorderColor"
                    type="color"
                    value={block.borderColor}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, borderColor: e.target.value })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Show on</h4>
              <p className="text-xs text-gray-500 mb-3">
                Display content based on the type of device or other specific
                conditions
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={block.visibility === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onBlockUpdate({ ...block, visibility: "all" })}
                  className="text-xs"
                >
                  All devices
                </Button>
                <Button
                  variant={
                    block.visibility === "desktop" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onBlockUpdate({ ...block, visibility: "desktop" })
                  }
                  className="text-xs"
                >
                  Only on desktop
                </Button>
                <Button
                  variant={
                    block.visibility === "mobile" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onBlockUpdate({ ...block, visibility: "mobile" })
                  }
                  className="text-xs"
                >
                  Only on mobile
                </Button>
              </div>
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
      case "footer-with-social":
        if (!selectedFooterElement) {
          return (
            <div className="bg-white border-l border-gray-200 p-4 h-full flex items-center justify-center">
              <p className="text-gray-500 text-sm text-center">
                Click on a footer element to edit its styling
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-5">
            {selectedFooterElement === "social" && (
              <>
                <div>
                  <FooterSocialLinksEditor
                    block={block as any}
                    onBlockUpdate={onBlockUpdate}
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Icon Design
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label
                        htmlFor="socialSize"
                        className="text-xs text-gray-700 mb-1 block"
                      >
                        Size
                      </Label>
                      <select
                        id="socialSize"
                        value={block.social.size}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            social: {
                              ...block.social,
                              size: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div>
                      <Label
                        htmlFor="socialShape"
                        className="text-xs text-gray-700 mb-1 block"
                      >
                        Shape
                      </Label>
                      <select
                        id="socialShape"
                        value={block.social.shape}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            social: {
                              ...block.social,
                              shape: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="rounded">Rounded</option>
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                      </select>
                    </div>
                    <div>
                      <Label
                        htmlFor="socialTheme"
                        className="text-xs text-gray-700 mb-1 block"
                      >
                        Theme
                      </Label>
                      <select
                        id="socialTheme"
                        value={block.social.theme}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            social: {
                              ...block.social,
                              theme: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="colored">Colored</option>
                        <option value="outlined">Outlined</option>
                        <option value="solid">Solid</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Layout
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label
                        htmlFor="socialSpacing"
                        className="text-xs text-gray-700 mb-1 block"
                      >
                        Space between links
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="socialSpacing"
                          type="number"
                          min="0"
                          value={block.social.spacing}
                          onChange={(e) =>
                            onBlockUpdate({
                              ...block,
                              social: {
                                ...block.social,
                                spacing: parseInt(e.target.value),
                              },
                            })
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="text-xs text-gray-600 self-center px-2">
                          px
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="socialWidth"
                        className="text-xs text-gray-700 mb-1 block"
                      >
                        Width
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="socialWidth"
                          type="number"
                          min="0"
                          value={block.social.width}
                          onChange={(e) =>
                            onBlockUpdate({
                              ...block,
                              social: {
                                ...block.social,
                                width: parseInt(e.target.value),
                              },
                            })
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <select
                          value={block.social.widthUnit}
                          onChange={(e) =>
                            onBlockUpdate({
                              ...block,
                              social: {
                                ...block.social,
                                widthUnit: e.target.value as any,
                              },
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                        >
                          <option value="%">%</option>
                          <option value="px">px</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="socialAlignment"
                        className="text-xs text-gray-700 mb-1 block"
                      >
                        Block Alignment
                      </Label>
                      <select
                        id="socialAlignment"
                        value={block.social.alignment}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            social: {
                              ...block.social,
                              alignment: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedFooterElement === "enterpriseName" && (
              <>
                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                    Content
                  </Label>
                  <Input
                    type="text"
                    value={block.enterpriseName.content}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        enterpriseName: {
                          ...block.enterpriseName,
                          content: e.target.value,
                        },
                      })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Typography
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Size (px)
                      </Label>
                      <Input
                        type="number"
                        value={block.enterpriseName.fontSize}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            enterpriseName: {
                              ...block.enterpriseName,
                              fontSize: parseInt(e.target.value),
                            },
                          })
                        }
                        className="focus:ring-valasys-orange focus:ring-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Weight
                      </Label>
                      <select
                        value={block.enterpriseName.fontWeight}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            enterpriseName: {
                              ...block.enterpriseName,
                              fontWeight: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Style
                      </Label>
                      <select
                        value={block.enterpriseName.fontStyle}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            enterpriseName: {
                              ...block.enterpriseName,
                              fontStyle: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Family
                      </Label>
                      <Input
                        type="text"
                        value={block.enterpriseName.fontFamily}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            enterpriseName: {
                              ...block.enterpriseName,
                              fontFamily: e.target.value,
                            },
                          })
                        }
                        placeholder="Arial, sans-serif"
                        className="focus:ring-valasys-orange focus:ring-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Color
                      </Label>
                      <Input
                        type="color"
                        value={block.enterpriseName.fontColor}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            enterpriseName: {
                              ...block.enterpriseName,
                              fontColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedFooterElement === "address" && (
              <>
                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                    Content
                  </Label>
                  <textarea
                    value={block.address.content}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        address: { ...block.address, content: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Typography
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Size (px)
                      </Label>
                      <Input
                        type="number"
                        value={block.address.fontSize}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            address: {
                              ...block.address,
                              fontSize: parseInt(e.target.value),
                            },
                          })
                        }
                        className="focus:ring-valasys-orange focus:ring-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Weight
                      </Label>
                      <select
                        value={block.address.fontWeight}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            address: {
                              ...block.address,
                              fontWeight: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Style
                      </Label>
                      <select
                        value={block.address.fontStyle}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            address: {
                              ...block.address,
                              fontStyle: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Family
                      </Label>
                      <Input
                        type="text"
                        value={block.address.fontFamily}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            address: {
                              ...block.address,
                              fontFamily: e.target.value,
                            },
                          })
                        }
                        placeholder="Arial, sans-serif"
                        className="focus:ring-valasys-orange focus:ring-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Color
                      </Label>
                      <Input
                        type="color"
                        value={block.address.fontColor}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            address: {
                              ...block.address,
                              fontColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedFooterElement === "subscriptionText" && (
              <>
                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                    Content
                  </Label>
                  <textarea
                    value={block.subscriptionText.content}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        subscriptionText: {
                          ...block.subscriptionText,
                          content: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Typography
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Size (px)
                      </Label>
                      <Input
                        type="number"
                        value={block.subscriptionText.fontSize}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            subscriptionText: {
                              ...block.subscriptionText,
                              fontSize: parseInt(e.target.value),
                            },
                          })
                        }
                        className="focus:ring-valasys-orange focus:ring-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Weight
                      </Label>
                      <select
                        value={block.subscriptionText.fontWeight}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            subscriptionText: {
                              ...block.subscriptionText,
                              fontWeight: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Style
                      </Label>
                      <select
                        value={block.subscriptionText.fontStyle}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            subscriptionText: {
                              ...block.subscriptionText,
                              fontStyle: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Family
                      </Label>
                      <Input
                        type="text"
                        value={block.subscriptionText.fontFamily}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            subscriptionText: {
                              ...block.subscriptionText,
                              fontFamily: e.target.value,
                            },
                          })
                        }
                        placeholder="Arial, sans-serif"
                        className="focus:ring-valasys-orange focus:ring-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Color
                      </Label>
                      <Input
                        type="color"
                        value={block.subscriptionText.fontColor}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            subscriptionText: {
                              ...block.subscriptionText,
                              fontColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedFooterElement === "unsubscribeLink" && (
              <>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-3">Link</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Link Text
                      </Label>
                      <Input
                        type="text"
                        value={block.unsubscribeLink.text}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            unsubscribeLink: {
                              ...block.unsubscribeLink,
                              text: e.target.value,
                            },
                          })
                        }
                        className="focus:ring-valasys-orange focus:ring-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Link URL
                      </Label>
                      <Input
                        type="url"
                        value={block.unsubscribeLink.url}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            unsubscribeLink: {
                              ...block.unsubscribeLink,
                              url: e.target.value,
                            },
                          })
                        }
                        placeholder="https://example.com"
                        className="focus:ring-valasys-orange focus:ring-2"
                      />
                    </div>
                    <button
                      className="text-xs text-valasys-orange font-semibold hover:text-valasys-orange"
                      onClick={() =>
                        onBlockUpdate({
                          ...block,
                          unsubscribeLink: {
                            ...block.unsubscribeLink,
                            url: "",
                            text: "",
                          },
                        })
                      }
                    >
                      Remove link
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Typography
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Size (px)
                      </Label>
                      <Input
                        type="number"
                        value={block.unsubscribeLink.fontSize}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            unsubscribeLink: {
                              ...block.unsubscribeLink,
                              fontSize: parseInt(e.target.value),
                            },
                          })
                        }
                        className="focus:ring-valasys-orange focus:ring-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Weight
                      </Label>
                      <select
                        value={block.unsubscribeLink.fontWeight}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            unsubscribeLink: {
                              ...block.unsubscribeLink,
                              fontWeight: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Style
                      </Label>
                      <select
                        value={block.unsubscribeLink.fontStyle}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            unsubscribeLink: {
                              ...block.unsubscribeLink,
                              fontStyle: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Family
                      </Label>
                      <Input
                        type="text"
                        value={block.unsubscribeLink.fontFamily}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            unsubscribeLink: {
                              ...block.unsubscribeLink,
                              fontFamily: e.target.value,
                            },
                          })
                        }
                        placeholder="Arial, sans-serif"
                        className="focus:ring-valasys-orange focus:ring-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Font Color
                      </Label>
                      <Input
                        type="color"
                        value={block.unsubscribeLink.fontColor}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            unsubscribeLink: {
                              ...block.unsubscribeLink,
                              fontColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Text Decoration
                      </Label>
                      <select
                        value={block.unsubscribeLink.textDecoration}
                        onChange={(e) =>
                          onBlockUpdate({
                            ...block,
                            unsubscribeLink: {
                              ...block.unsubscribeLink,
                              textDecoration: e.target.value as any,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                      >
                        <option value="none">None</option>
                        <option value="underline">Underline</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
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
          <div className="space-y-5">
            <SocialLinksEditor block={block} onBlockUpdate={onBlockUpdate} />

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Icon Design
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="socialSize" className="text-xs text-gray-700">
                    Size
                  </Label>
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
                  <Label
                    htmlFor="socialShape"
                    className="text-xs text-gray-700"
                  >
                    Shape
                  </Label>
                  <select
                    id="socialShape"
                    value={block.shape}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        shape: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="rounded">Rounded</option>
                    <option value="circle">Circle</option>
                    <option value="square">Square</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor="socialTheme"
                    className="text-xs text-gray-700"
                  >
                    Theme
                  </Label>
                  <select
                    id="socialTheme"
                    value={block.theme}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        theme: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="colored">Colored</option>
                    <option value="outlined">Outlined</option>
                    <option value="solid">Solid</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-bold text-gray-900 mb-3">Layout</h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="socialSpacing"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Space between links
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="socialSpacing"
                      type="number"
                      min="0"
                      value={block.spacing}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          spacing: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="text-xs text-gray-600 self-center px-2">
                      px
                    </span>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="socialWidth"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Width
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="socialWidth"
                      type="number"
                      min="0"
                      value={block.width}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          width: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={block.widthUnit}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          widthUnit: e.target.value as "px" | "%",
                        })
                      }
                      className="px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                    >
                      <option value="%">%</option>
                      <option value="px">px</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="socialAlignment"
                    className="text-xs text-gray-700"
                  >
                    Block Alignment
                  </Label>
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
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-bold text-gray-900 mb-3">Spacing</h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="socialPadding"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Padding
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="socialPadding"
                      type="number"
                      min="0"
                      value={block.padding}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          padding: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="text-xs text-gray-600 self-center px-2">
                      px
                    </span>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="socialMargin"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Margin
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="socialMargin"
                      type="number"
                      min="0"
                      value={block.margin}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          margin: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="text-xs text-gray-600 self-center px-2">
                      px
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "html":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Content
              </Label>
              <textarea
                value={block.content}
                onChange={(e) =>
                  onBlockUpdate({ ...block, content: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                rows={4}
                placeholder="Edit your content here..."
              />
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Layout</h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="htmlWidth"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Width
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="htmlWidth"
                      type="number"
                      min="0"
                      value={block.width}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          width: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={block.widthUnit}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          widthUnit: e.target.value as "px" | "%",
                        })
                      }
                      className="px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                    >
                      <option value="%">%</option>
                      <option value="px">px</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Spacing</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">Padding</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="htmlGroupPadding"
                        checked={groupPaddingSides}
                        onCheckedChange={(checked) =>
                          setGroupPaddingSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="htmlGroupPadding"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupPaddingSides ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={paddingTop}
                        onChange={(e) =>
                          handlePaddingChange(parseInt(e.target.value))
                        }
                        className="flex-1 focus:ring-valasys-orange focus:ring-2"
                      />
                      <span className="px-2 py-1 text-sm text-gray-600">
                        px
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↑
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingTop}
                          onChange={(e) =>
                            handlePaddingChange(parseInt(e.target.value), "top")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          →
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingRight}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "right",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↓
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingBottom}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "bottom",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ←
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={paddingLeft}
                          onChange={(e) =>
                            handlePaddingChange(
                              parseInt(e.target.value),
                              "left",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">Margin</Label>
                  </div>
                  {!groupMarginSides ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={marginTop}
                        onChange={(e) =>
                          handleMarginChange(parseInt(e.target.value))
                        }
                        className="flex-1 focus:ring-valasys-orange focus:ring-2"
                      />
                      <span className="px-2 py-1 text-sm text-gray-600">
                        px
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↑
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginTop}
                          onChange={(e) =>
                            handleMarginChange(parseInt(e.target.value), "top")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          →
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginRight}
                          onChange={(e) =>
                            handleMarginChange(
                              parseInt(e.target.value),
                              "right",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ↓
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginBottom}
                          onChange={(e) =>
                            handleMarginChange(
                              parseInt(e.target.value),
                              "bottom",
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 w-6 text-center">
                          ←
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={marginLeft}
                          onChange={(e) =>
                            handleMarginChange(parseInt(e.target.value), "left")
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Background
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Color
                  </Label>
                  <Input
                    type="color"
                    value={(block as any).backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        backgroundColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Rounded corners
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Radius
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={block.borderRadius}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderRadius: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900">Borders</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Size
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={block.borderWidth}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderWidth: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Color
                  </Label>
                  <Input
                    type="color"
                    value={block.borderColor}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, borderColor: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Content visibility
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Display content based on the type of device or other specific
                conditions
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={block.visibility === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onBlockUpdate({ ...block, visibility: "all" })}
                  className="text-xs"
                >
                  All devices
                </Button>
                <Button
                  variant={
                    block.visibility === "desktop" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onBlockUpdate({ ...block, visibility: "desktop" })
                  }
                  className="text-xs"
                >
                  Only on desktop
                </Button>
                <Button
                  variant={
                    block.visibility === "mobile" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onBlockUpdate({ ...block, visibility: "mobile" })
                  }
                  className="text-xs"
                >
                  Only on mobile
                </Button>
              </div>
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
