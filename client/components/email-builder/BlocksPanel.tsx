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
  ChevronDown,
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
  createCenteredImageCardBlock,
  createSplitImageCardBlock,
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
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "block",
      item: () => {
        // Create a new block each time drag starts, not once on mount
        return { block: block.onCreate() };
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [block],
  );

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

interface Section {
  title: string;
  blocks?: BlockOption[];
  templates?: Template[];
}

interface Template {
  id: string;
  title: string;
  description: string;
  preview: string;
  blocks: () => ContentBlock[];
}

interface SectionsPanelProps {
  onAddBlock: (block: ContentBlock) => void;
}

interface DraggableTemplateProps {
  template: Template;
  onAddBlocks: (blocks: ContentBlock[]) => void;
}

const DraggableTemplateCard: React.FC<DraggableTemplateProps> = ({
  template,
  onAddBlocks,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "template",
      item: () => {
        return { blocks: template.blocks() };
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [template],
  );

  return (
    <div
      ref={drag}
      className={`flex flex-col border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="w-full h-32 bg-gray-200 overflow-hidden">
        <img
          src={template.preview}
          alt={template.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          {template.title}
        </h3>
        <p className="text-xs text-gray-600 mb-3 flex-1">
          {template.description}
        </p>
        <button
          onClick={() => onAddBlocks(template.blocks())}
          className="w-full px-3 py-2 bg-valasys-orange text-white text-xs font-medium rounded hover:bg-orange-600 transition-colors"
        >
          Use template
        </button>
      </div>
    </div>
  );
};

const SectionsPanel: React.FC<SectionsPanelProps> = ({ onAddBlock }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const textImageTemplates: Template[] = [];

  const sections: Section[] = [
    {
      title: "Text & images",
      templates: textImageTemplates,
    },
    {
      title: "Text",
      blocks: [
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
      ],
    },
    {
      title: "Images",
      blocks: [
        {
          id: "image",
          icon: <Image className="w-6 h-6 text-valasys-orange" />,
          label: "Image",
          description: "Image element",
          onCreate: () => createImageBlock(),
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
      ],
    },
    {
      title: "Headers",
      blocks: [
        {
          id: "navigation",
          icon: <Menu className="w-6 h-6 text-valasys-orange" />,
          label: "Navigation",
          description: "Menu links",
          onCreate: () => createNavigationBlock(),
        },
      ],
    },
    {
      title: "Footer & signatures",
      blocks: [
        {
          id: "social",
          icon: <Share2 className="w-6 h-6 text-valasys-orange" />,
          label: "Social",
          description: "Social media links",
          onCreate: () => createSocialBlock(),
        },
      ],
    },
    {
      title: "Empty columns",
      blocks: [
        {
          id: "spacer",
          icon: <Plus className="w-6 h-6 text-valasys-orange" />,
          label: "Spacer",
          description: "Vertical space",
          onCreate: () => createSpacerBlock(),
        },
        {
          id: "divider",
          icon: <Minus className="w-6 h-6 text-valasys-orange" />,
          label: "Divider",
          description: "Horizontal line",
          onCreate: () => createDividerBlock(),
        },
      ],
    },
  ];

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  const handleAddBlocks = (blocks: ContentBlock[]) => {
    blocks.forEach((block) => onAddBlock(block));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="border-b border-gray-200">
        {sections.map((section) => (
          <div
            key={section.title}
            className="border-b border-gray-200 last:border-b-0"
          >
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">
                {section.title}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedSection === section.title ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection === section.title && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                {section.templates ? (
                  <div className="flex flex-col gap-3">
                    {section.templates.map((template) => (
                      <DraggableTemplateCard
                        key={template.id}
                        template={template}
                        onAddBlocks={handleAddBlocks}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {section.blocks?.map((block) => (
                      <DraggableBlockButton key={block.id} block={block} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
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

        <TabsContent value="sections" className="flex flex-col m-0">
          <SectionsPanel onAddBlock={onAddBlock} />
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
