import React, { useState } from "react";
import { ContentBlock, HeaderBlock } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, X, Copy, Plus } from "lucide-react";
import { SocialLinksEditor } from "./SocialLinksEditor";
import { FooterSocialLinksEditor } from "./FooterSocialLinksEditor";
import { generateId } from "./utils";

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
  const [groupMarginSides, setGroupMarginSides] = useState(true);
  const [applyBorderToAllSides, setApplyBorderToAllSides] = useState(true);
  const [linkType, setLinkType] = useState("url");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedStatId, setSelectedStatId] = useState<string | null>(null);
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
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
    null,
  );
  const [titleWidthInput, setTitleWidthInput] = useState<string>(
    String(block?.type === "title" ? (block.width ?? 100) : 100),
  );
  const [videoWidthInput, setVideoWidthInput] = useState<string>(
    String(block?.type === "video" ? (block.width ?? 300) : 300),
  );
  const [videoHeightInput, setVideoHeightInput] = useState<string>(
    String(block?.type === "video" ? (block.height ?? 200) : 200),
  );
  const [twoCardWidthInput, setTwoCardWidthInput] = useState<string>(
    String(
      block?.type === "twoColumnCard" ? ((block as any).width ?? 100) : 100,
    ),
  );
  const [twoCardHeightInput, setTwoCardHeightInput] = useState<string>(
    String(
      block?.type === "twoColumnCard" ? ((block as any).height ?? 300) : 300,
    ),
  );

  // Update input states when block changes
  React.useEffect(() => {
    if (block?.type === "title") {
      setTitleWidthInput(String(block.width ?? 100));
    } else if (block?.type === "video") {
      setVideoWidthInput(String(block.width ?? 300));
      setVideoHeightInput(String(block.height ?? 200));
    } else if (block?.type === "twoColumnCard") {
      setTwoCardWidthInput(String((block as any).width ?? 100));
      setTwoCardHeightInput(String((block as any).height ?? 300));
    }
  }, [block?.id, block?.type, block?.width, block?.height]);

  // Initialize selectedCardId when block changes to twoColumnCard
  React.useEffect(() => {
    if (block?.type === "twoColumnCard") {
      const twoColBlock = block as any;
      setSelectedCardId(twoColBlock.cards?.[0]?.id || null);
    } else if (block?.type === "stats") {
      const statsBlock = block as any;
      setSelectedStatId(statsBlock.stats?.[0]?.id || null);
    } else if (block?.type === "features") {
      const featuresBlock = block as any;
      setSelectedFeatureId(featuresBlock.features?.[0]?.id || null);
    }
  }, [block?.id, block?.type]);

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
                      type="text"
                      inputMode="numeric"
                      value={titleWidthInput}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");

                        setTitleWidthInput(inputValue);

                        if (numericValue !== "") {
                          const num = parseInt(numericValue);
                          const maxValue = block.widthUnit === "%" ? 100 : 1000;
                          if (num >= 1 && num <= maxValue) {
                            onBlockUpdate({
                              ...block,
                              width: num,
                            });
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");
                        if (numericValue === "") {
                          onBlockUpdate({
                            ...block,
                            width: 100,
                          });
                          setTitleWidthInput("100");
                        } else {
                          const num = parseInt(numericValue);
                          const maxValue = block.widthUnit === "%" ? 100 : 1000;
                          if (num > maxValue) {
                            onBlockUpdate({
                              ...block,
                              width: maxValue,
                            });
                            setTitleWidthInput(String(maxValue));
                          } else if (num < 1) {
                            onBlockUpdate({
                              ...block,
                              width: 1,
                            });
                            setTitleWidthInput("1");
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          const currentWidth = parseInt(titleWidthInput) || 100;
                          const maxValue = block.widthUnit === "%" ? 100 : 1000;
                          const newWidth = Math.min(currentWidth + 1, maxValue);
                          onBlockUpdate({
                            ...block,
                            width: newWidth,
                          });
                          setTitleWidthInput(String(newWidth));
                        } else if (e.key === "ArrowDown") {
                          e.preventDefault();
                          const currentWidth = parseInt(titleWidthInput) || 100;
                          const newWidth = Math.max(1, currentWidth - 1);
                          onBlockUpdate({
                            ...block,
                            width: newWidth,
                          });
                          setTitleWidthInput(String(newWidth));
                        }
                      }}
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
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="groupMargin"
                        checked={groupMarginSides}
                        onCheckedChange={(checked) =>
                          setGroupMarginSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="groupMargin"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupMarginSides ? (
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
                  <input
                    type="file"
                    accept="image/*"
                    id="bgImageUpload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          onBlockUpdate({
                            ...block,
                            backgroundImage: event.target?.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() =>
                      document.getElementById("bgImageUpload")?.click()
                    }
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
                    value={(block as any).backgroundImage || ""}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        backgroundImage: e.target.value,
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
                      value={block.borderRadius || 0}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderRadius: parseInt(e.target.value) || 0,
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
                      value={block.borderWidth || 0}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderWidth: parseInt(e.target.value) || 0,
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
                    value={block.fontSize || 32}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        fontSize: parseInt(e.target.value) || 32,
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
                      value={block.width ?? 100}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          onBlockUpdate({ ...block, width: 100 });
                        } else {
                          const num = parseInt(val);
                          if (!isNaN(num)) {
                            onBlockUpdate({ ...block, width: num });
                          }
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                    />
                    <select
                      value={block.widthUnit ?? "%"}
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
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="groupMargin"
                        checked={groupMarginSides}
                        onCheckedChange={(checked) =>
                          setGroupMarginSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="groupMargin"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupMarginSides ? (
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
                  <input
                    type="file"
                    accept="image/*"
                    id="bgImageUpload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          onBlockUpdate({
                            ...block,
                            backgroundImage: event.target?.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() =>
                      document.getElementById("bgImageUpload")?.click()
                    }
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
                    value={(block as any).backgroundImage || ""}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        backgroundImage: e.target.value,
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
                          borderRadius: parseInt(e.target.value) || 0,
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
                      value={block.borderWidth || 0}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderWidth: parseInt(e.target.value) || 0,
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
                        fontSize: parseInt(e.target.value) || 16,
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
                  <input
                    type="file"
                    accept="image/*"
                    id="imageBlockUpload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          onBlockUpdate({
                            ...block,
                            src: event.target?.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs h-auto p-0 text-valasys-orange"
                    onClick={() =>
                      document.getElementById("imageBlockUpload")?.click()
                    }
                  >
                    Upload
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs h-auto p-0 text-valasys-orange"
                    onClick={() =>
                      document.getElementById("imageBlockUpload")?.click()
                    }
                  >
                    Replace
                  </Button>
                </div>
              </div>
              {(block as any).src ? (
                <div className="bg-gray-50 rounded border border-gray-200 aspect-video flex items-center justify-center mb-3 overflow-hidden">
                  <img
                    src={(block as any).src}
                    alt="Preview"
                    crossOrigin="anonymous"
                    className="max-w-full max-h-full"
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      const currentSrc = imgElement.src;

                      // Check if this is the original URL or already a proxy attempt
                      if (
                        !currentSrc.includes("cors-anywhere") &&
                        !currentSrc.includes("corsproxy")
                      ) {
                        console.warn(
                          "⚠️ Image blocked by CORS. Retrying with CORS proxy...",
                          (block as any).src,
                        );
                        // Try with CORS proxy
                        imgElement.src = `https://cors-anywhere.herokuapp.com/${(block as any).src}`;

                        // Set a timeout to show error if proxy also fails
                        imgElement.onerror = () => {
                          imgElement.style.display = "none";
                          const parent = imgElement.parentElement;
                          if (parent) {
                            const errorDiv = document.createElement("div");
                            errorDiv.className =
                              "text-gray-400 text-xs text-center p-4";
                            errorDiv.innerHTML = `
                              <div style="margin-bottom: 8px;">⚠️ Image failed to load</div>
                              <div style="font-size: 11px; color: #999; margin-bottom: 8px;">
                                The image server is blocking requests (CORS restricted)
                              </div>
                              <div style="font-size: 11px; color: #999;">
                                <strong>Solution:</strong> Download and upload the image directly
                              </div>
                            `;
                            parent.appendChild(errorDiv);
                          }
                        };
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 rounded border border-gray-200 aspect-video flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="text-gray-400 text-xs mb-1">
                      No image added yet
                    </div>
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-500 mb-3">
                {(block as any).src
                  ? "Image added"
                  : "Upload or paste URL to add image"}
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
                  value={(block as any).src || ""}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      src: e.target.value,
                    })
                  }
                  className="flex-1 focus:ring-valasys-orange focus:ring-2"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2"
                  title="Images must allow CORS requests. If using external URLs, ensure the server allows cross-origin requests. Use file upload as an alternative."
                >
                  ⓘ
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ External URLs may not load due to CORS restrictions. Use file
                upload for reliable image hosting.
              </p>
            </div>

            <div>
              <Label className="text-xs text-gray-700 mb-1 block">
                Alt Text
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Describe the image"
                  value={(block as any).alt || ""}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      alt: e.target.value,
                    })
                  }
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
                    value={(block as any).linkType || "url"}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        linkType: e.target.value as "url" | "page" | "email",
                      })
                    }
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
                    value={(block as any).linkTarget || ""}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        linkTarget: e.target.value,
                      })
                    }
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
                    value={(block as any).linkTooltip || ""}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        linkTooltip: e.target.value,
                      })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <Button
                  variant="link"
                  size="sm"
                  className="text-xs h-auto p-0 text-valasys-orange"
                  onClick={() =>
                    onBlockUpdate({
                      ...block,
                      linkType: undefined,
                      linkTarget: "",
                      linkTooltip: "",
                    })
                  }
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
                      min="0"
                      value={block.width ?? 100}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          onBlockUpdate({ ...block, width: 100 });
                        } else {
                          const num = parseInt(val);
                          if (!isNaN(num)) {
                            onBlockUpdate({ ...block, width: num });
                          }
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                    />
                    <select
                      value={block.widthUnit ?? "%"}
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
                      type="text"
                      inputMode="numeric"
                      value={block.height ?? 200}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");
                        if (numericValue === "") {
                          onBlockUpdate({
                            ...block,
                            height: 200,
                          });
                        } else {
                          onBlockUpdate({
                            ...block,
                            height: parseInt(numericValue),
                          });
                        }
                      }}
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={block.heightUnit ?? "px"}
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
                          borderRadius: parseInt(e.target.value) || 0,
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
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="groupMargin"
                        checked={groupMarginSides}
                        onCheckedChange={(checked) =>
                          setGroupMarginSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="groupMargin"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupMarginSides ? (
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
                          borderWidth: parseInt(e.target.value) || 0,
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
                      value={block.width ?? 100}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          onBlockUpdate({ ...block, width: 100 });
                        } else {
                          const num = parseInt(val);
                          if (!isNaN(num)) {
                            onBlockUpdate({ ...block, width: num });
                          }
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                    />
                    <select
                      value={block.widthUnit ?? "%"}
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
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="btnGroupMargin"
                        checked={groupMarginSides}
                        onCheckedChange={(checked) =>
                          setGroupMarginSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="btnGroupMargin"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupMarginSides ? (
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
                      value={block.borderRadius || 0}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderRadius: parseInt(e.target.value) || 0,
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
                      value={block.borderWidth || 0}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderWidth: parseInt(e.target.value) || 0,
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
                    value={block.borderColor || "#000000"}
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
      case "header": {
        const headerBlock = block as HeaderBlock;
        return (
          <div className="space-y-4">
            {/* Logo Upload */}
            <div>
              <Label>Logo</Label>
              {headerBlock.logo && (
                <div className="mb-2 flex items-center gap-2">
                  <img
                    src={headerBlock.logo}
                    alt="Logo"
                    className="max-h-12 max-w-12"
                    onError={(e) => {
                      console.error(
                        "❌ Logo image failed to load. Check the URL or try uploading again.",
                      );
                      (e.target as HTMLImageElement).style.border =
                        "2px solid red";
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onBlockUpdate({ ...headerBlock, logo: "" })}
                  >
                    Remove
                  </Button>
                </div>
              )}
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 1024 * 1024) {
                          console.warn(
                            "⚠️ Large image detected! File size: " +
                              (file.size / 1024 / 1024).toFixed(2) +
                              "MB. Consider using a smaller image.",
                          );
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          if (result) {
                            console.log("✅ Logo image loaded successfully");
                            onBlockUpdate({
                              ...headerBlock,
                              logo: result,
                            });
                          }
                        };
                        reader.onerror = () => {
                          console.error("❌ Failed to read image file");
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Or paste Image URL
                  </label>
                  <Input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    value={headerBlock.logo}
                    onChange={(e) => {
                      const url = e.target.value;
                      onBlockUpdate({
                        ...headerBlock,
                        logo: url,
                      });
                    }}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Logo Dimensions */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="logoWidth">Logo Width (px)</Label>
                <Input
                  id="logoWidth"
                  type="number"
                  value={headerBlock.logoWidth}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...headerBlock,
                      logoWidth: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="logoHeight">Logo Height (px)</Label>
                <Input
                  id="logoHeight"
                  type="number"
                  value={headerBlock.logoHeight}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...headerBlock,
                      logoHeight: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                value={headerBlock.companyName}
                onChange={(e) =>
                  onBlockUpdate({ ...headerBlock, companyName: e.target.value })
                }
              />
            </div>

            {/* Company Name Styling */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="companyFontSize">Name Font Size (px)</Label>
                <Input
                  id="companyFontSize"
                  type="number"
                  value={headerBlock.companyFontSize}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...headerBlock,
                      companyFontSize: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="companyFontColor">Name Color</Label>
                <Input
                  id="companyFontColor"
                  type="color"
                  value={headerBlock.companyFontColor}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...headerBlock,
                      companyFontColor: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Links */}
            <div>
              <Label>Links</Label>
              <div className="space-y-2">
                {headerBlock.links.map((link, index) => (
                  <div key={link.id} className="flex gap-1">
                    <Input
                      type="text"
                      placeholder="Link text"
                      value={link.text}
                      onChange={(e) => {
                        const newLinks = [...headerBlock.links];
                        newLinks[index].text = e.target.value;
                        onBlockUpdate({ ...headerBlock, links: newLinks });
                      }}
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...headerBlock.links];
                        newLinks[index].url = e.target.value;
                        onBlockUpdate({ ...headerBlock, links: newLinks });
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newLinks = headerBlock.links.filter(
                          (_, i) => i !== index,
                        );
                        onBlockUpdate({ ...headerBlock, links: newLinks });
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    onBlockUpdate({
                      ...headerBlock,
                      links: [
                        ...headerBlock.links,
                        { id: generateId(), text: "", url: "" },
                      ],
                    });
                  }}
                >
                  + Add Link
                </Button>
              </div>
            </div>

            {/* Links Styling */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="linksFontSize">Links Font Size (px)</Label>
                <Input
                  id="linksFontSize"
                  type="number"
                  value={headerBlock.linksFontSize}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...headerBlock,
                      linksFontSize: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="linksFontColor">Links Color</Label>
                <Input
                  id="linksFontColor"
                  type="color"
                  value={headerBlock.linksFontColor}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...headerBlock,
                      linksFontColor: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <Label htmlFor="headerBgColor">Background Color</Label>
              <Input
                id="headerBgColor"
                type="color"
                value={headerBlock.backgroundColor}
                onChange={(e) =>
                  onBlockUpdate({
                    ...headerBlock,
                    backgroundColor: e.target.value,
                  })
                }
              />
            </div>

            {/* Padding */}
            <div>
              <Label htmlFor="headerPadding">Padding (px)</Label>
              <Input
                id="headerPadding"
                type="number"
                value={headerBlock.padding}
                onChange={(e) =>
                  onBlockUpdate({
                    ...headerBlock,
                    padding: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        );
      }
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
                              fontSize: parseInt(e.target.value) || 16,
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
                              fontSize: parseInt(e.target.value) || 16,
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
                              fontSize: parseInt(e.target.value) || 16,
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
                              fontSize: parseInt(e.target.value) || 16,
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
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Content
              </Label>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="videoSrc"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Video URL
                  </Label>
                  <Input
                    id="videoSrc"
                    value={block.src}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, src: e.target.value })
                    }
                    placeholder="https://example.com/video.mp4"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="videoThumb"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Thumbnail URL
                  </Label>
                  <Input
                    id="videoThumb"
                    value={block.thumbnail}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, thumbnail: e.target.value })
                    }
                    placeholder="https://example.com/thumb.jpg"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
              </div>
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
                      type="text"
                      inputMode="numeric"
                      value={videoWidthInput}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");

                        setVideoWidthInput(inputValue);

                        if (numericValue !== "") {
                          const num = parseInt(numericValue);
                          const maxValue = block.widthUnit === "%" ? 100 : 1000;
                          if (num >= 1 && num <= maxValue) {
                            onBlockUpdate({
                              ...block,
                              width: num,
                            });
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");
                        if (numericValue === "") {
                          onBlockUpdate({
                            ...block,
                            width: 300,
                          });
                          setVideoWidthInput("300");
                        } else {
                          const num = parseInt(numericValue);
                          const maxValue = block.widthUnit === "%" ? 100 : 1000;
                          if (num > maxValue) {
                            onBlockUpdate({
                              ...block,
                              width: maxValue,
                            });
                            setVideoWidthInput(String(maxValue));
                          } else if (num < 1) {
                            onBlockUpdate({
                              ...block,
                              width: 1,
                            });
                            setVideoWidthInput("1");
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          const currentWidth = parseInt(videoWidthInput) || 300;
                          const maxValue = block.widthUnit === "%" ? 100 : 1000;
                          const newWidth = Math.min(currentWidth + 1, maxValue);
                          onBlockUpdate({
                            ...block,
                            width: newWidth,
                          });
                          setVideoWidthInput(String(newWidth));
                        } else if (e.key === "ArrowDown") {
                          e.preventDefault();
                          const currentWidth = parseInt(videoWidthInput) || 300;
                          const newWidth = Math.max(1, currentWidth - 1);
                          onBlockUpdate({
                            ...block,
                            width: newWidth,
                          });
                          setVideoWidthInput(String(newWidth));
                        }
                      }}
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={block.widthUnit ?? "px"}
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
                      type="text"
                      inputMode="numeric"
                      value={videoHeightInput}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");

                        setVideoHeightInput(inputValue);

                        if (numericValue !== "") {
                          const num = parseInt(numericValue);
                          if (num >= 1 && num <= 1000) {
                            onBlockUpdate({
                              ...block,
                              height: num,
                            });
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");
                        if (numericValue === "") {
                          onBlockUpdate({
                            ...block,
                            height: 200,
                          });
                          setVideoHeightInput("200");
                        } else {
                          const num = parseInt(numericValue);
                          if (num > 1000) {
                            onBlockUpdate({
                              ...block,
                              height: 1000,
                            });
                            setVideoHeightInput("1000");
                          } else if (num < 1) {
                            onBlockUpdate({
                              ...block,
                              height: 1,
                            });
                            setVideoHeightInput("1");
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          const currentHeight =
                            parseInt(videoHeightInput) || 200;
                          const newHeight = Math.min(currentHeight + 1, 1000);
                          onBlockUpdate({
                            ...block,
                            height: newHeight,
                          });
                          setVideoHeightInput(String(newHeight));
                        } else if (e.key === "ArrowDown") {
                          e.preventDefault();
                          const currentHeight =
                            parseInt(videoHeightInput) || 200;
                          const newHeight = Math.max(1, currentHeight - 1);
                          onBlockUpdate({
                            ...block,
                            height: newHeight,
                          });
                          setVideoHeightInput(String(newHeight));
                        }
                      }}
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <span className="px-2 py-1 text-sm text-gray-600">px</span>
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
                        id="videoGroupPadding"
                        checked={groupPaddingSides}
                        onCheckedChange={(checked) =>
                          setGroupPaddingSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="videoGroupPadding"
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
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="videoGroupMargin"
                        checked={groupMarginSides}
                        onCheckedChange={(checked) =>
                          setGroupMarginSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="videoGroupMargin"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupMarginSides ? (
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
                          borderRadius: parseInt(e.target.value) || 0,
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
                    id="videoApplyBorder"
                    checked={applyBorderToAllSides}
                    onCheckedChange={(checked) =>
                      setApplyBorderToAllSides(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="videoApplyBorder"
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
                          borderWidth: parseInt(e.target.value) || 0,
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
                      value={block.width ?? 100}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          onBlockUpdate({ ...block, width: 0 });
                        } else {
                          const num = parseInt(val);
                          if (!isNaN(num)) {
                            onBlockUpdate({ ...block, width: num });
                          }
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                    />
                    <select
                      value={block.widthUnit ?? "%"}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onBlockUpdate({
                          ...block,
                          width: Math.max(10, (block.width ?? 100) - 10),
                        })
                      }
                      className="px-2"
                    >
                      −
                    </Button>
                    <Input
                      id="htmlWidth"
                      type="number"
                      min="1"
                      value={block.width ?? 100}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        if (val === "") return;
                        const num = parseInt(val, 10);
                        if (!isNaN(num) && num > 0) {
                          onBlockUpdate({ ...block, width: num });
                        }
                      }}
                      placeholder="Enter width"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onBlockUpdate({
                          ...block,
                          width: (block.width ?? 100) + 10,
                        })
                      }
                      className="px-2"
                    >
                      +
                    </Button>
                    <select
                      value={block.widthUnit ?? "%"}
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
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="groupMargin"
                        checked={groupMarginSides}
                        onCheckedChange={(checked) =>
                          setGroupMarginSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="groupMargin"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupMarginSides ? (
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
                      value={block.borderRadius || 0}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderRadius: parseInt(e.target.value) || 0,
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
                      value={block.borderWidth || 0}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          borderWidth: parseInt(e.target.value) || 0,
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
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Content</h4>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="prodImage"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Product Image URL
                  </Label>
                  <Input
                    id="prodImage"
                    value={block.image}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, image: e.target.value })
                    }
                    placeholder="https://example.com/product.jpg"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="prodTitle"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Product Title
                  </Label>
                  <Input
                    id="prodTitle"
                    value={block.title}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, title: e.target.value })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="prodDesc"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Description
                  </Label>
                  <textarea
                    id="prodDesc"
                    value={block.description}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                    rows={3}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="prodPrice"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Price
                  </Label>
                  <Input
                    id="prodPrice"
                    value={block.price}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, price: e.target.value })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="prodBtnText"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Button Text
                  </Label>
                  <Input
                    id="prodBtnText"
                    value={block.buttonText}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, buttonText: e.target.value })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="prodBtnLink"
                    className="text-xs text-gray-700 mb-1 block"
                  >
                    Button Link
                  </Label>
                  <Input
                    id="prodBtnLink"
                    value={block.buttonLink}
                    onChange={(e) =>
                      onBlockUpdate({ ...block, buttonLink: e.target.value })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Layout</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Image Position
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        block.imagePosition === "left" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, imagePosition: "left" })
                      }
                    >
                      ⬅
                    </Button>
                    <Button
                      variant={
                        block.imagePosition === "center" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, imagePosition: "center" })
                      }
                    >
                      ⬇
                    </Button>
                    <Button
                      variant={
                        block.imagePosition === "right" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onBlockUpdate({ ...block, imagePosition: "right" })
                      }
                    >
                      ➡
                    </Button>
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
                        id="prodGroupPadding"
                        checked={groupPaddingSides}
                        onCheckedChange={(checked) =>
                          setGroupPaddingSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="prodGroupPadding"
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
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="prodGroupMargin"
                        checked={groupMarginSides}
                        onCheckedChange={(checked) =>
                          setGroupMarginSides(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="prodGroupMargin"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Group sides
                      </Label>
                    </div>
                  </div>
                  {groupMarginSides ? (
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
                          borderRadius: parseInt(e.target.value) || 0,
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
                    id="prodApplyBorder"
                    checked={applyBorderToAllSides}
                    onCheckedChange={(checked) =>
                      setApplyBorderToAllSides(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="prodApplyBorder"
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
                          borderWidth: parseInt(e.target.value) || 0,
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
      case "twoColumnCard": {
        const twoColBlock = block as any;
        const selectedCard = twoColBlock.cards?.find(
          (card: any) => card.id === selectedCardId,
        );

        const handleCardUpdate = (fieldName: string, value: any) => {
          if (!selectedCard) return;
          const updatedCards = twoColBlock.cards.map((card: any) =>
            card.id === selectedCardId ? { ...card, [fieldName]: value } : card,
          );
          onBlockUpdate({ ...twoColBlock, cards: updatedCards });
        };

        const handleDuplicateCard = () => {
          if (!selectedCard) return;
          const duplicatedCard = {
            ...JSON.parse(JSON.stringify(selectedCard)),
            id: generateId(),
          };
          const newCards = [...twoColBlock.cards, duplicatedCard];
          onBlockUpdate({ ...twoColBlock, cards: newCards });
          setSelectedCardId(duplicatedCard.id);
        };

        const handleAddCard = () => {
          const newCard = {
            id: generateId(),
            title: "Card Title",
            description: "Add your card description here",
            image: "",
            imageAlt: "",
            imageWidth: undefined,
            imageHeight: undefined,
            imageLink: "",
            imageLinkType: "url" as const,
            backgroundColor: "#333333",
            textColor: "#ffffff",
            borderRadius: 8,
            padding: 16,
            margin: 8,
          };
          const newCards = [...twoColBlock.cards, newCard];
          onBlockUpdate({ ...twoColBlock, cards: newCards });
          setSelectedCardId(newCard.id);
        };

        const handleDeleteCard = () => {
          if (!selectedCard) return;
          const newCards = twoColBlock.cards.filter(
            (card: any) => card.id !== selectedCardId,
          );
          if (newCards.length > 0) {
            setSelectedCardId(newCards[0].id);
          }
          onBlockUpdate({ ...twoColBlock, cards: newCards });
        };

        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Select Card to Edit
              </Label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {twoColBlock.cards?.map((card: any, index: number) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                      selectedCardId === card.id
                        ? "bg-valasys-orange text-white ring-2 ring-orange-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Card {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={handleAddCard}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Card
                </Button>
                {twoColBlock.cards?.length > 1 && (
                  <>
                    <Button
                      onClick={handleDuplicateCard}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      title="Copy this card"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={handleDeleteCard}
                      size="sm"
                      variant="outline"
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete this card"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Layout</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Card Width
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={twoCardWidthInput}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");

                        setTwoCardWidthInput(inputValue);

                        if (numericValue !== "") {
                          const num = parseInt(numericValue);
                          const maxValue =
                            twoColBlock.widthUnit === "%" ? 100 : 1000;
                          if (num >= 1 && num <= maxValue) {
                            onBlockUpdate({
                              ...twoColBlock,
                              width: num,
                            });
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");
                        if (numericValue === "") {
                          onBlockUpdate({
                            ...twoColBlock,
                            width: 100,
                          });
                          setTwoCardWidthInput("100");
                        } else {
                          const num = parseInt(numericValue);
                          const maxValue =
                            twoColBlock.widthUnit === "%" ? 100 : 1000;
                          if (num > maxValue) {
                            onBlockUpdate({
                              ...twoColBlock,
                              width: maxValue,
                            });
                            setTwoCardWidthInput(String(maxValue));
                          } else if (num < 1) {
                            onBlockUpdate({
                              ...twoColBlock,
                              width: 1,
                            });
                            setTwoCardWidthInput("1");
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          const currentWidth =
                            parseInt(twoCardWidthInput) || 100;
                          const maxValue =
                            twoColBlock.widthUnit === "%" ? 100 : 1000;
                          const newWidth = Math.min(currentWidth + 1, maxValue);
                          onBlockUpdate({
                            ...twoColBlock,
                            width: newWidth,
                          });
                          setTwoCardWidthInput(String(newWidth));
                        } else if (e.key === "ArrowDown") {
                          e.preventDefault();
                          const currentWidth =
                            parseInt(twoCardWidthInput) || 100;
                          const newWidth = Math.max(1, currentWidth - 1);
                          onBlockUpdate({
                            ...twoColBlock,
                            width: newWidth,
                          });
                          setTwoCardWidthInput(String(newWidth));
                        }
                      }}
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={twoColBlock.widthUnit}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...twoColBlock,
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
                    Card Height
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={twoCardHeightInput}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");

                        setTwoCardHeightInput(inputValue);

                        if (numericValue !== "") {
                          const num = parseInt(numericValue);
                          const maxValue =
                            (twoColBlock as any).heightUnit === "%"
                              ? 100
                              : 1000;
                          if (num >= 1 && num <= maxValue) {
                            onBlockUpdate({
                              ...twoColBlock,
                              height: num,
                            });
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^\d]/g, "");
                        if (numericValue === "") {
                          onBlockUpdate({
                            ...twoColBlock,
                            height: 300,
                          });
                          setTwoCardHeightInput("300");
                        } else {
                          const num = parseInt(numericValue);
                          const maxValue =
                            (twoColBlock as any).heightUnit === "%"
                              ? 100
                              : 1000;
                          if (num > maxValue) {
                            onBlockUpdate({
                              ...twoColBlock,
                              height: maxValue,
                            });
                            setTwoCardHeightInput(String(maxValue));
                          } else if (num < 1) {
                            onBlockUpdate({
                              ...twoColBlock,
                              height: 1,
                            });
                            setTwoCardHeightInput("1");
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          const currentHeight =
                            parseInt(twoCardHeightInput) || 300;
                          const maxValue =
                            (twoColBlock as any).heightUnit === "%"
                              ? 100
                              : 1000;
                          const newHeight = Math.min(
                            currentHeight + 1,
                            maxValue,
                          );
                          onBlockUpdate({
                            ...twoColBlock,
                            height: newHeight,
                          });
                          setTwoCardHeightInput(String(newHeight));
                        } else if (e.key === "ArrowDown") {
                          e.preventDefault();
                          const currentHeight =
                            parseInt(twoCardHeightInput) || 300;
                          const newHeight = Math.max(1, currentHeight - 1);
                          onBlockUpdate({
                            ...twoColBlock,
                            height: newHeight,
                          });
                          setTwoCardHeightInput(String(newHeight));
                        }
                      }}
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <select
                      value={(twoColBlock as any).heightUnit || "px"}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...twoColBlock,
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
              </div>
            </div>

            {selectedCard && (
              <>
                <div>
                  <Label
                    htmlFor="cardTitle"
                    className="text-xs font-semibold text-gray-700 mb-2 block"
                  >
                    Card Title
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="cardTitle"
                      value={selectedCard.title}
                      onChange={(e) =>
                        handleCardUpdate("title", e.target.value)
                      }
                      placeholder="Enter card title"
                      className="flex-1 focus:ring-valasys-orange focus:ring-2"
                    />
                    <Button
                      onClick={() => {
                        const newTitle = selectedCard.title + " (copy)";
                        handleCardUpdate("title", newTitle);
                      }}
                      size="sm"
                      variant="outline"
                      title="Duplicate title text"
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleCardUpdate("title", "")}
                      size="sm"
                      variant="outline"
                      title="Clear title"
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="cardDescription"
                    className="text-xs font-semibold text-gray-700 mb-2 block"
                  >
                    Card Description
                  </Label>
                  <div className="flex gap-2">
                    <textarea
                      id="cardDescription"
                      value={selectedCard.description}
                      onChange={(e) =>
                        handleCardUpdate("description", e.target.value)
                      }
                      placeholder="Enter card description"
                      rows={4}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => {
                          const newDesc = selectedCard.description + " (copy)";
                          handleCardUpdate("description", newDesc);
                        }}
                        size="sm"
                        variant="outline"
                        title="Duplicate description text"
                        className="text-xs"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleCardUpdate("description", "")}
                        size="sm"
                        variant="outline"
                        title="Clear description"
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                    Card Image
                  </Label>
                  {selectedCard.image ? (
                    <div className="space-y-2">
                      <div className="w-full rounded border border-gray-300 overflow-hidden">
                        <img
                          src={selectedCard.image}
                          alt={selectedCard.imageAlt || "Card image"}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.style.display = "none";
                            const parent = imgElement.parentElement;
                            if (parent) {
                              const errorDiv = document.createElement("div");
                              errorDiv.className =
                                "w-full h-32 bg-gray-200 flex items-center justify-center text-center p-2";
                              errorDiv.innerHTML =
                                '<p style="font-size: 11px; color: #999;">Image failed to load</p>';
                              parent.appendChild(errorDiv);
                            }
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          // Batch all updates into a single state update
                          const updatedCards = twoColBlock.cards.map(
                            (card: any) =>
                              card.id === selectedCardId
                                ? {
                                    ...card,
                                    image: "",
                                    imageAlt: "",
                                    imageWidth: undefined,
                                    imageHeight: undefined,
                                  }
                                : card,
                          );
                          onBlockUpdate({
                            ...twoColBlock,
                            cards: updatedCards,
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="block w-full px-3 py-3 bg-gray-100 rounded text-center cursor-pointer hover:bg-gray-200 transition-colors border border-gray-300">
                      <p className="text-xs text-gray-600">Click to upload</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              // Batch both image updates into a single state update
                              const updatedCards = twoColBlock.cards.map(
                                (card: any) =>
                                  card.id === selectedCardId
                                    ? {
                                        ...card,
                                        image: event.target?.result as string,
                                        imageAlt: file.name,
                                      }
                                    : card,
                              );
                              onBlockUpdate({
                                ...twoColBlock,
                                cards: updatedCards,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                    Image URL
                  </Label>
                  <Input
                    value={selectedCard.image || ""}
                    onChange={(e) => handleCardUpdate("image", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="text-xs focus:ring-valasys-orange focus:ring-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste an image URL or upload a file above
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                    Image Link Type
                  </Label>
                  <select
                    value={selectedCard.imageLinkType || "url"}
                    onChange={(e) =>
                      handleCardUpdate("imageLinkType", e.target.value)
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                  >
                    <option value="url">URL</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                    Image Link
                  </Label>
                  <Input
                    value={selectedCard.imageLink || ""}
                    onChange={(e) =>
                      handleCardUpdate("imageLink", e.target.value)
                    }
                    placeholder={
                      selectedCard.imageLinkType === "email"
                        ? "example@email.com"
                        : "https://example.com"
                    }
                    className="text-xs focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Image Styling
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-700 mb-2 block">
                        Image Width
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="50"
                          value={selectedCard.imageWidth || ""}
                          onChange={(e) =>
                            handleCardUpdate(
                              "imageWidth",
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                          placeholder="Auto"
                          className="flex-1 text-xs focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty for auto
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-2 block">
                        Image Height
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="50"
                          value={selectedCard.imageHeight || ""}
                          onChange={(e) =>
                            handleCardUpdate(
                              "imageHeight",
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                          placeholder="Auto"
                          className="flex-1 text-xs focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty for auto
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Card Styling
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-700 mb-2 block">
                        Background Color
                      </Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={selectedCard.backgroundColor}
                          onChange={(e) =>
                            handleCardUpdate("backgroundColor", e.target.value)
                          }
                          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <Input
                          value={selectedCard.backgroundColor}
                          onChange={(e) =>
                            handleCardUpdate("backgroundColor", e.target.value)
                          }
                          placeholder="#333333"
                          className="flex-1 text-xs focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-2 block">
                        Text Color
                      </Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={selectedCard.textColor}
                          onChange={(e) =>
                            handleCardUpdate("textColor", e.target.value)
                          }
                          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <Input
                          value={selectedCard.textColor}
                          onChange={(e) =>
                            handleCardUpdate("textColor", e.target.value)
                          }
                          placeholder="#ffffff"
                          className="flex-1 text-xs focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Border Radius
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          value={selectedCard.borderRadius}
                          onChange={(e) =>
                            handleCardUpdate(
                              "borderRadius",
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Padding
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={selectedCard.padding}
                          onChange={(e) =>
                            handleCardUpdate(
                              "padding",
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Margin
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={selectedCard.margin}
                          onChange={(e) =>
                            handleCardUpdate("margin", parseInt(e.target.value))
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      }
      case "stats": {
        const statsBlock = block as any;
        const selectedStat = statsBlock.stats?.find(
          (stat: any) => stat.id === selectedStatId,
        );

        const handleStatUpdate = (fieldName: string, value: any) => {
          if (!selectedStat) return;
          const updatedStats = statsBlock.stats.map((stat: any) =>
            stat.id === selectedStatId ? { ...stat, [fieldName]: value } : stat,
          );
          onBlockUpdate({ ...statsBlock, stats: updatedStats });
        };

        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Select Stat to Edit
              </Label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {statsBlock.stats?.map((stat: any, index: number) => (
                  <button
                    key={stat.id}
                    onClick={() => setSelectedStatId(stat.id)}
                    className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                      selectedStatId === stat.id
                        ? "bg-valasys-orange text-white ring-2 ring-orange-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Stat {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {selectedStat && (
              <>
                <div>
                  <Label
                    htmlFor="statValue"
                    className="text-xs font-semibold text-gray-700 mb-2 block"
                  >
                    Value
                  </Label>
                  <Input
                    id="statValue"
                    value={selectedStat.value}
                    onChange={(e) => handleStatUpdate("value", e.target.value)}
                    placeholder="e.g., 4.8"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="statLabel"
                    className="text-xs font-semibold text-gray-700 mb-2 block"
                  >
                    Label
                  </Label>
                  <Input
                    id="statLabel"
                    value={selectedStat.label}
                    onChange={(e) => handleStatUpdate("label", e.target.value)}
                    placeholder="e.g., Average rating"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Styling
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Value Font Size
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="12"
                          max="72"
                          value={selectedStat.fontSize}
                          onChange={(e) =>
                            handleStatUpdate(
                              "fontSize",
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Label Font Size
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="10"
                          max="32"
                          value={selectedStat.labelFontSize}
                          onChange={(e) =>
                            handleStatUpdate(
                              "labelFontSize",
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-2 block">
                        Text Color
                      </Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={selectedStat.textColor}
                          onChange={(e) =>
                            handleStatUpdate("textColor", e.target.value)
                          }
                          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <Input
                          value={selectedStat.textColor}
                          onChange={(e) =>
                            handleStatUpdate("textColor", e.target.value)
                          }
                          placeholder="#000000"
                          className="flex-1 text-xs focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Padding
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={selectedStat.padding}
                          onChange={(e) =>
                            handleStatUpdate(
                              "padding",
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      }
      case "centeredImageCard":
      case "splitImageCard":
        return (
          <div className="space-y-5">
            {/* Image Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Image</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Upload Image
                  </Label>
                  <input
                    type="file"
                    accept="image/*"
                    id="cardImageUpload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          onBlockUpdate({
                            ...block,
                            image: event.target?.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() =>
                      document.getElementById("cardImageUpload")?.click()
                    }
                  >
                    Choose File
                  </Button>
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Or paste Image URL
                  </Label>
                  <Input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={(block as any).image || ""}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        image: e.target.value,
                      })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                {(block as any).image && (
                  <div>
                    <Label className="text-xs text-gray-700 mb-1 block">
                      Image Alt Text
                    </Label>
                    <Input
                      type="text"
                      placeholder="Describe the image..."
                      value={(block as any).imageAlt || ""}
                      onChange={(e) =>
                        onBlockUpdate({
                          ...block,
                          imageAlt: e.target.value,
                        })
                      }
                      className="focus:ring-valasys-orange focus:ring-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Content</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Title
                  </Label>
                  <Input
                    type="text"
                    value={(block as any).title || ""}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        title: e.target.value,
                      })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Description
                  </Label>
                  <textarea
                    value={(block as any).description || ""}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Button Text
                  </Label>
                  <Input
                    type="text"
                    value={(block as any).buttonText || ""}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        buttonText: e.target.value,
                      })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Button Link
                  </Label>
                  <Input
                    type="text"
                    placeholder="https://example.com"
                    value={(block as any).buttonLink || ""}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        buttonLink: e.target.value,
                      })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
              </div>
            </div>

            {/* Styling Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3">Styling</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Background Color
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

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Border Color
                  </Label>
                  <Input
                    type="color"
                    value={(block as any).borderColor || "#000000"}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        borderColor: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Border Width (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={(block as any).borderWidth || 0}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        borderWidth: parseInt(e.target.value) || 0,
                      })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Border Radius (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={(block as any).borderRadius || 0}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        borderRadius: parseInt(e.target.value) || 0,
                      })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">
                    Margin (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={(block as any).margin || 0}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        margin: parseInt(e.target.value) || 0,
                      })
                    }
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "features": {
        const featuresBlock = block as any;
        const selectedFeature = featuresBlock.features?.find(
          (feature: any) => feature.id === selectedFeatureId,
        );

        const handleFeatureUpdate = (fieldName: string, value: any) => {
          if (!selectedFeature) return;
          const updatedFeatures = featuresBlock.features.map((feature: any) =>
            feature.id === selectedFeatureId
              ? { ...feature, [fieldName]: value }
              : feature,
          );
          onBlockUpdate({ ...featuresBlock, features: updatedFeatures });
        };

        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Select Feature to Edit
              </Label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {featuresBlock.features?.map((feature: any, index: number) => (
                  <button
                    key={feature.id}
                    onClick={() => setSelectedFeatureId(feature.id)}
                    className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                      selectedFeatureId === feature.id
                        ? "bg-valasys-orange text-white ring-2 ring-orange-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Feature {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Columns Count
              </Label>
              <select
                value={featuresBlock.columnsCount}
                onChange={(e) =>
                  onBlockUpdate({
                    ...featuresBlock,
                    columnsCount: parseInt(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
              >
                <option value="1">1 Column</option>
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </div>

            {selectedFeature && (
              <>
                <div>
                  <Label
                    htmlFor="featureIcon"
                    className="text-xs font-semibold text-gray-700 mb-2 block"
                  >
                    Icon/Emoji
                  </Label>
                  <Input
                    id="featureIcon"
                    value={selectedFeature.icon}
                    onChange={(e) =>
                      handleFeatureUpdate("icon", e.target.value)
                    }
                    placeholder="e.g., ❤️"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="featureTitle"
                    className="text-xs font-semibold text-gray-700 mb-2 block"
                  >
                    Title
                  </Label>
                  <Input
                    id="featureTitle"
                    value={selectedFeature.title}
                    onChange={(e) =>
                      handleFeatureUpdate("title", e.target.value)
                    }
                    placeholder="e.g., Feature One"
                    className="focus:ring-valasys-orange focus:ring-2"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="featureDescription"
                    className="text-xs font-semibold text-gray-700 mb-2 block"
                  >
                    Description
                  </Label>
                  <textarea
                    id="featureDescription"
                    value={selectedFeature.description}
                    onChange={(e) =>
                      handleFeatureUpdate("description", e.target.value)
                    }
                    placeholder="Feature description..."
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Styling
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Title Font Size
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="12"
                          max="72"
                          value={selectedFeature.titleFontSize}
                          onChange={(e) =>
                            handleFeatureUpdate(
                              "titleFontSize",
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Description Font Size
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="10"
                          max="32"
                          value={selectedFeature.fontSize}
                          onChange={(e) =>
                            handleFeatureUpdate(
                              "fontSize",
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-2 block">
                        Text Color
                      </Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={selectedFeature.textColor}
                          onChange={(e) =>
                            handleFeatureUpdate("textColor", e.target.value)
                          }
                          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <Input
                          value={selectedFeature.textColor}
                          onChange={(e) =>
                            handleFeatureUpdate("textColor", e.target.value)
                          }
                          placeholder="#000000"
                          className="flex-1 text-xs focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-2 block">
                        Background Color
                      </Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={selectedFeature.backgroundColor}
                          onChange={(e) =>
                            handleFeatureUpdate(
                              "backgroundColor",
                              e.target.value,
                            )
                          }
                          className="w-12 h-10 rounded border border-gray-300 cursor-pointer mr-2"
                        />
                        <Input
                          value={selectedFeature.backgroundColor}
                          onChange={(e) =>
                            handleFeatureUpdate(
                              "backgroundColor",
                              e.target.value,
                            )
                          }
                          placeholder="#ffffff"
                          className="flex-1 text-xs focus:ring-valasys-orange focus:ring-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Border Radius
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          value={selectedFeature.borderRadius}
                          onChange={(e) =>
                            handleFeatureUpdate(
                              "borderRadius",
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-700 mb-1 block">
                        Padding
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={selectedFeature.padding}
                          onChange={(e) =>
                            handleFeatureUpdate(
                              "padding",
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 focus:ring-valasys-orange focus:ring-2"
                        />
                        <span className="px-2 py-1 text-sm text-gray-600">
                          px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      }
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
