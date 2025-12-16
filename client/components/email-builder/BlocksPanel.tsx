import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Type,
  Image,
  MousePointerClick,
  Minus,
  Plus,
  Zap,
  LogIn,
  Share2,
  Code,
  ShoppingCart,
  Menu,
  Film,
} from "lucide-react";
import {
  createTitleBlock,
  createTextBlock,
  createImageBlock,
  createVideoBlock,
  createButtonBlock,
  createDynamicContentBlock,
  createLogoBlock,
  createSocialBlock,
  createHtmlBlock,
  createDividerBlock,
  createProductBlock,
  createNavigationBlock,
  createSpacerBlock,
} from "./utils";
import { ContentBlock } from "./types";

interface BlocksPanelProps {
  onAddBlock: (block: ContentBlock) => void;
}

interface BlockOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  onCreate: () => ContentBlock;
}

export const BlocksPanel: React.FC<BlocksPanelProps> = ({ onAddBlock }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const blockOptions: BlockOption[] = [
    {
      id: "title",
      icon: <Type className="w-6 h-6 text-valasys-orange" />,
      label: "Title",
      description: "Large heading text",
      onCreate: () => createTitleBlock(),
    },
    {
      id: "text",
      icon: <Type className="w-6 h-6 text-valasys-orange" />,
      label: "Text",
      description: "Body text content",
      onCreate: () => createTextBlock(),
    },
    {
      id: "image",
      icon: <Image className="w-6 h-6 text-valasys-orange" />,
      label: "Image",
      description: "Image element",
      onCreate: () => createImageBlock(),
    },
    {
      id: "video",
      icon: <Film className="w-6 h-6 text-valasys-orange" />,
      label: "Video",
      description: "Video player",
      onCreate: () => createVideoBlock(),
    },
    {
      id: "button",
      icon: <MousePointerClick className="w-6 h-6 text-valasys-orange" />,
      label: "Button",
      description: "Clickable button",
      onCreate: () => createButtonBlock(),
    },
    {
      id: "dynamicContent",
      icon: <Zap className="w-6 h-6 text-valasys-orange" />,
      label: "Dynamic content",
      description: "Variable field",
      onCreate: () => createDynamicContentBlock(),
    },
    {
      id: "logo",
      icon: (
        <div className="w-6 h-6 text-valasys-orange border-2 border-current rounded px-1">
          LOGO
        </div>
      ),
      label: "Logo",
      description: "Logo image",
      onCreate: () => createLogoBlock(),
    },
    {
      id: "social",
      icon: <Share2 className="w-6 h-6 text-valasys-orange" />,
      label: "Social",
      description: "Social media links",
      onCreate: () => createSocialBlock(),
    },
    {
      id: "html",
      icon: <Code className="w-6 h-6 text-valasys-orange" />,
      label: "HTML",
      description: "Custom HTML",
      onCreate: () => createHtmlBlock(),
    },
    {
      id: "divider",
      icon: <Minus className="w-6 h-6 text-valasys-orange" />,
      label: "Divider",
      description: "Horizontal line",
      onCreate: () => createDividerBlock(),
    },
    {
      id: "product",
      icon: <ShoppingCart className="w-6 h-6 text-valasys-orange" />,
      label: "Product",
      description: "Product card",
      onCreate: () => createProductBlock(),
    },
    {
      id: "navigation",
      icon: <Menu className="w-6 h-6 text-valasys-orange" />,
      label: "Navigation",
      description: "Menu links",
      onCreate: () => createNavigationBlock(),
    },
    {
      id: "spacer",
      icon: <Plus className="w-6 h-6 text-valasys-orange" />,
      label: "Spacer",
      description: "Vertical space",
      onCreate: () => createSpacerBlock(),
    },
  ];

  const filteredBlocks = blockOptions.filter(
    (block) =>
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleBlockClick = (block: BlockOption) => {
    onAddBlock(block.onCreate());
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <Tabs defaultValue="blocks" className="flex flex-col h-full">
        <TabsList className="flex w-full h-auto rounded-none border-b border-gray-200 bg-white p-0">
          <TabsTrigger
            value="blocks"
            className="flex-1 rounded-none px-4 py-3 text-gray-600 border-b-2 border-transparent data-[state=active]:border-valasys-orange data-[state=active]:text-gray-900 data-[state=active]:bg-white shadow-none"
          >
            Blocks
          </TabsTrigger>
          <TabsTrigger
            value="sections"
            className="flex-1 rounded-none px-4 py-3 text-gray-600 border-b-2 border-transparent data-[state=active]:border-valasys-orange data-[state=active]:text-gray-900 data-[state=active]:bg-white shadow-none"
          >
            Sections
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="flex-1 rounded-none px-4 py-3 text-gray-600 border-b-2 border-transparent data-[state=active]:border-valasys-orange data-[state=active]:text-gray-900 data-[state=active]:bg-white shadow-none"
          >
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="blocks"
          className="flex-1 flex flex-col overflow-hidden m-0"
        >
          <div className="p-4 border-b border-gray-200">
            <Input
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {filteredBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block)}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-valasys-orange hover:bg-orange-50 transition-all hover:shadow-md"
                  >
                    <div className="mb-2">{block.icon}</div>
                    <span className="text-sm font-medium text-gray-900">
                      {block.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="sections"
          className="flex-1 flex flex-col overflow-hidden m-0"
        >
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-dashed border-gray-300 text-center">
                  <p className="text-sm text-gray-500">
                    No pre-built sections yet. Create your own and save them!
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="saved"
          className="flex-1 flex flex-col overflow-hidden m-0"
        >
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-dashed border-gray-300 text-center">
                  <p className="text-sm text-gray-500">
                    No saved blocks yet. Save your favorite blocks to access
                    them quickly.
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
