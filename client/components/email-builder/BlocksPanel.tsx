import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  GripHorizontal,
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

interface DraggableBlockProps {
  block: BlockOption;
}

const DraggableBlockButton: React.FC<DraggableBlockProps> = ({ block }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "block",
    item: { block: block.onCreate() },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <button
      ref={drag}
      className={`flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-valasys-orange hover:bg-orange-50 transition-all hover:shadow-md cursor-move ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <div className="mb-2 relative">
        {block.icon}
        <div className="absolute -top-1 -right-1 text-valasys-orange">
          <GripHorizontal className="w-3 h-3" />
        </div>
      </div>
      <span className="text-sm font-medium text-gray-900">{block.label}</span>
    </button>
  );
};

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

  return (
    <div className="flex flex-col bg-white border-r border-gray-200 w-full">
      <Tabs defaultValue="blocks" className="flex flex-col">
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

        <TabsContent value="blocks" className="flex flex-col m-0">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <Input
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              {filteredBlocks.map((block) => (
                <DraggableBlockButton key={block.id} block={block} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sections" className="flex flex-col m-0 p-4">
          <div className="flex items-center justify-center py-8">
            <div className="space-y-3 text-center">
              <div className="p-4 rounded-lg border border-dashed border-gray-300">
                <p className="text-sm text-gray-500">
                  No pre-built sections yet. Create your own and save them!
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="flex flex-col m-0 p-4">
          <div className="flex items-center justify-center py-8">
            <div className="space-y-3 text-center">
              <div className="p-4 rounded-lg border border-dashed border-gray-300">
                <p className="text-sm text-gray-500">
                  No saved blocks yet. Save your favorite blocks to access them
                  quickly.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
