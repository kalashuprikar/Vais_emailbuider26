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
  createHeaderBlock,
  createSpacerBlock,
  createCenteredImageCardBlock,
  createSplitImageCardBlock,
  createTwoColumnCardBlock,
  createPromoBlock,
  createStatsBlock,
  createFeaturesBlock,
  createHeaderLogoAndDividerTemplate,
  createHeaderLogoAndSocialTemplate,
  createHeaderLogoAndNavigationTemplate,
  createFooterWithSocialTemplate,
  createFooterWithContactTemplate,
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
      className={`flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 hover:border-valasys-orange hover:bg-orange-50 transition-all hover:shadow-md cursor-move ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <div className="mb-4 relative pt-3">
        {block.icon}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-valasys-orange">
          <GripHorizontal className="w-4 h-4" />
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([
      "Text & images",
      "Content sections",
      "Headers",
      "Footer & signatures",
    ]),
  );

  const textImageTemplates: Template[] = [
    {
      id: "top-image-section",
      title: "Top Image Section",
      description:
        "Image at top, followed by title, description text, and call-to-action button",
      preview:
        "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23f5f5f5'/%3E%3Crect y='0' width='400' height='80' fill='%23ddd'/%3E%3Ctext x='200' y='120' font-size='16' font-weight='bold' text-anchor='middle' fill='%23333'%3ESome title here%3C/text%3E%3Ctext x='200' y='140' font-size='12' text-anchor='middle' fill='%23666'%3ELorem ipsum dolor sit amet%3C/text%3E%3Crect x='150' y='155' width='100' height='30' fill='%23FF6A00' rx='4'/%3E%3Ctext x='200' y='175' font-size='12' text-anchor='middle' fill='white' font-weight='bold'%3ECall to action%3C/text%3E%3C/svg%3E",
      blocks: () => [
        createImageBlock(),
        createTitleBlock(),
        createTextBlock(),
        createButtonBlock(),
      ],
    },
    {
      id: "left-image-section",
      title: "Left Image Section",
      description:
        "Image on left side with title, description text, and CTA button on right side",
      preview:
        "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23f5f5f5'/%3E%3Crect x='0' y='0' width='180' height='200' fill='%23ddd'/%3E%3Ctext x='250' y='50' font-size='14' font-weight='bold' fill='%23333'%3ETitle%3C/text%3E%3Ctext x='250' y='70' font-size='11' fill='%23666'%3ELorem ipsum dolor sit amet%3C/text%3E%3Ctext x='250' y='85' font-size='11' fill='%23666'%3Econsectetur adipiscing elit%3C/text%3E%3Crect x='220' y='110' width='80' height='25' fill='%23FF6A00' rx='3'/%3E%3Ctext x='260' y='128' font-size='11' text-anchor='middle' fill='white' font-weight='bold'%3ECall to action%3C/text%3E%3C/svg%3E",
      blocks: () => [createSplitImageCardBlock("left")],
    },
    {
      id: "right-image-section",
      title: "Right Image Section",
      description:
        "Image on right side with title, description text, and CTA button on left side",
      preview:
        "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23f5f5f5'/%3E%3Crect x='220' y='0' width='180' height='200' fill='%23ddd'/%3E%3Ctext x='100' y='50' font-size='14' font-weight='bold' fill='%23333'%3ETitle%3C/text%3E%3Ctext x='100' y='70' font-size='11' fill='%23666'%3ELorem ipsum dolor sit amet%3C/text%3E%3Ctext x='100' y='85' font-size='11' fill='%23666'%3Econsectetur adipiscing elit%3C/text%3E%3Crect x='60' y='110' width='80' height='25' fill='%23FF6A00' rx='3'/%3E%3Ctext x='100' y='128' font-size='11' text-anchor='middle' fill='white' font-weight='bold'%3ECall to action%3C/text%3E%3C/svg%3E",
      blocks: () => [createSplitImageCardBlock("right")],
    },
  ];

  const contentTemplates: Template[] = [
    {
      id: "two-column-cards",
      title: "Two Column Cards",
      description: "Two side-by-side dark cards with titles and descriptions",
      preview:
        "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23f5f5f5'/%3E%3Crect x='10' y='20' width='180' height='160' fill='%23333' rx='4'/%3E%3Ctext x='100' y='60' font-size='14' font-weight='bold' text-anchor='middle' fill='white'%3ETitle%3C/text%3E%3Ctext x='100' y='85' font-size='11' text-anchor='middle' fill='white'%3ELorem ipsum dolor%3C/text%3E%3Crect x='210' y='20' width='180' height='160' fill='%23333' rx='4'/%3E%3Ctext x='300' y='60' font-size='14' font-weight='bold' text-anchor='middle' fill='white'%3ETitle%3C/text%3E%3Ctext x='300' y='85' font-size='11' text-anchor='middle' fill='white'%3ELorem ipsum dolor%3C/text%3E%3C/svg%3E",
      blocks: () => [createTwoColumnCardBlock()],
    },
    {
      id: "promo-section",
      title: "Promo Code Section",
      description: "Highlight a promotional code or offer",
      preview:
        "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23f9f9f9'/%3E%3Ctext x='200' y='60' font-size='14' text-anchor='middle' fill='%23666'%3ESave 15% on your next order!%3C/text%3E%3Crect x='80' y='90' width='240' height='70' fill='%23fff' stroke='%23ddd' stroke-width='2' rx='4'/%3E%3Ctext x='200' y='145' font-size='36' font-weight='bold' text-anchor='middle' fill='%23000' letter-spacing='3'%3EPROMO15%3C/text%3E%3C/svg%3E",
      blocks: () => [createPromoBlock()],
    },
    {
      id: "stats-section",
      title: "Statistics Section",
      description: "Display key metrics or numbers in three columns",
      preview:
        "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23f5f5f5'/%3E%3Ctext x='67' y='80' font-size='24' font-weight='bold' text-anchor='middle' fill='%23000'%3E4.8%3C/text%3E%3Ctext x='67' y='130' font-size='12' text-anchor='middle' fill='%23666'%3ERating%3C/text%3E%3Cline x1='134' y1='30' x2='134' y2='170' stroke='%23ddd' stroke-width='1'/%3E%3Ctext x='200' y='80' font-size='24' font-weight='bold' text-anchor='middle' fill='%23000'%3E120%3C/text%3E%3Ctext x='200' y='130' font-size='12' text-anchor='middle' fill='%23666'%3EReviews%3C/text%3E%3Cline x1='266' y1='30' x2='266' y2='170' stroke='%23ddd' stroke-width='1'/%3E%3Ctext x='333' y='80' font-size='24' font-weight='bold' text-anchor='middle' fill='%23000'%3E200K%3C/text%3E%3Ctext x='333' y='130' font-size='12' text-anchor='middle' fill='%23666'%3EDownloads%3C/text%3E%3C/svg%3E",
      blocks: () => [createStatsBlock()],
    },
    {
      id: "features-section",
      title: "Features Section",
      description: "Showcase features or benefits with icons and titles",
      preview:
        "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23f5f5f5'/%3E%3Ctext x='67' y='45' font-size='28' text-anchor='middle'%3E%E2%9D%A4%EF%B8%8F%3C/text%3E%3Ctext x='67' y='75' font-size='12' font-weight='bold' text-anchor='middle' fill='%23000'%3EFeature%3C/text%3E%3Ctext x='67' y='155' font-size='10' text-anchor='middle' fill='%23666'%3ELorem ipsum%3C/text%3E%3Ctext x='200' y='45' font-size='28' text-anchor='middle'%3E%F0%9F%8E%81%3C/text%3E%3Ctext x='200' y='75' font-size='12' font-weight='bold' text-anchor='middle' fill='%23000'%3EFeature%3C/text%3E%3Ctext x='200' y='155' font-size='10' text-anchor='middle' fill='%23666'%3ELorem ipsum%3C/text%3E%3Ctext x='333' y='45' font-size='28' text-anchor='middle'%3Eℹ%EF%B8%8F%3C/text%3E%3Ctext x='333' y='75' font-size='12' font-weight='bold' text-anchor='middle' fill='%23000'%3EFeature%3C/text%3E%3Ctext x='333' y='155' font-size='10' text-anchor='middle' fill='%23666'%3ELorem ipsum%3C/text%3E%3C/svg%3E",
      blocks: () => [createFeaturesBlock()],
    },
  ];

  const sections: Section[] = [
    {
      title: "Text & images",
      templates: textImageTemplates,
    },
    {
      title: "Content sections",
      templates: contentTemplates,
    },
    {
      title: "Headers",
      templates: [
        {
          id: "header-logo-divider",
          title: "Logo with Divider",
          description: "Centered logo with horizontal divider line",
          preview:
            "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23ffffff'/%3E%3Crect x='150' y='50' width='100' height='50' fill='%23666666' rx='4'/%3E%3Ctext x='200' y='82' font-size='14' font-weight='bold' text-anchor='middle' fill='white'%3ELogo%3C/text%3E%3Cline x1='20' y1='120' x2='380' y2='120' stroke='%23e0e0e0' stroke-width='1'/%3E%3C/svg%3E",
          blocks: () => createHeaderLogoAndDividerTemplate(),
        },
        {
          id: "header-logo-social",
          title: "Logo with Social",
          description: "Logo on left, social icons on right",
          preview:
            "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23ffffff'/%3E%3Crect x='20' y='60' width='80' height='40' fill='%23666666' rx='3'/%3E%3Ctext x='60' y='85' font-size='12' font-weight='bold' text-anchor='middle' fill='white'%3ELogo%3C/text%3E%3Ccircle cx='300' cy='80' r='8' fill='%234267B2'/%3E%3Ccircle cx='320' cy='80' r='8' fill='%23E1306C'/%3E%3Ccircle cx='340' cy='80' r='8' fill='%230A66C2'/%3E%3Ccircle cx='360' cy='80' r='8' fill='%23FF0000'/%3E%3C/svg%3E",
          blocks: () => createHeaderLogoAndSocialTemplate(),
        },
        {
          id: "header-logo-navigation",
          title: "Logo with Navigation",
          description: "Centered logo with navigation links and divider",
          preview:
            "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23ffffff'/%3E%3Crect x='150' y='30' width='100' height='40' fill='%23666666' rx='4'/%3E%3Ctext x='200' y='56' font-size='12' font-weight='bold' text-anchor='middle' fill='white'%3ELogo%3C/text%3E%3Ctext x='100' y='95' font-size='11' text-anchor='middle' fill='%23333'%3EOrder now%3C/text%3E%3Ctext x='200' y='95' font-size='11' text-anchor='middle' fill='%23333'%3EContact us%3C/text%3E%3Ctext x='300' y='95' font-size='11' text-anchor='middle' fill='%23333'%3EFind a shop%3C/text%3E%3Cline x1='20' y1='120' x2='380' y2='120' stroke='%23e0e0e0' stroke-width='1'/%3E%3C/svg%3E",
          blocks: () => createHeaderLogoAndNavigationTemplate(),
        },
      ],
      blocks: [
        {
          id: "header",
          icon: <Menu className="w-6 h-6 text-valasys-orange" />,
          label: "Header",
          description: "Logo, company name, and links",
          onCreate: () => createHeaderBlock(),
        },
      ],
    },
    {
      title: "Footer & signatures",
      templates: [
        {
          id: "footer-social",
          title: "Footer with Social",
          description:
            "Footer with social media icons and subscription message",
          preview:
            "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23f5f5f5'/%3E%3Ccircle cx='100' cy='60' r='8' fill='%234267B2'/%3E%3Ccircle cx='120' cy='60' r='8' fill='%23E4405F'/%3E%3Ccircle cx='140' cy='60' r='8' fill='%230A66C2'/%3E%3Ccircle cx='160' cy='60' r='8' fill='%23FF0000'/%3E%3Ctext x='200' y='70' font-size='12' font-weight='bold' text-anchor='middle' fill='%23000'%3EEnterprise name%3C/text%3E%3Ctext x='200' y='90' font-size='11' text-anchor='middle' fill='%23666'%3E69 Street Name, 00000, City%3C/text%3E%3Ctext x='200' y='110' font-size='10' text-anchor='middle' fill='%23999'%3ENewsletter subscription message%3C/text%3E%3Ctext x='200' y='130' font-size='10' text-anchor='middle' fill='%23FF6A00'%3EUnsubscribe%3C/text%3E%3C/svg%3E",
          blocks: () => createFooterWithSocialTemplate(),
        },
        {
          id: "footer-contact",
          title: "Footer with Contact",
          description: "Footer with company info and contact details",
          preview:
            "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23ffffff'/%3E%3Crect x='0' y='0' width='400' height='1' fill='%23e0e0e0'/%3E%3Ctext x='20' y='40' font-size='12' font-weight='bold' fill='%23000'%3EEnterprise name%3C/text%3E%3Ctext x='20' y='60' font-size='11' fill='%23666'%3E69 Street Name, 00000, City%3C/text%3E%3Ctext x='300' y='40' font-size='11' fill='%23666' text-anchor='end'%3EPrivacy | Terms | Policy%3C/text%3E%3Ctext x='300' y='60' font-size='11' fill='%23666' text-anchor='end'%3Econtact@enterprise.com%3C/text%3E%3Ctext x='300' y='80' font-size='11' fill='%23666' text-anchor='end'%3E+33 901 23 04 67%3C/text%3E%3C/svg%3E",
          blocks: () => createFooterWithContactTemplate(),
        },
      ],
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
  ];

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
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
                  expandedSections.has(section.title) ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.has(section.title) && (
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
                  <div className="grid grid-cols-2 gap-3">
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
        <TabsList className="sticky top-0 z-20 flex w-full h-auto rounded-none border-b border-gray-200 bg-white p-0">
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
          <div className="p-4 border-b border-gray-200 sticky top-[52px] bg-white z-20">
            <Input
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
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
