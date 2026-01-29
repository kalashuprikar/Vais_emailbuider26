import React from "react";
import { Trash2, ChevronUp, ChevronDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingPage, LandingPageBlock } from "./types";
import {
  HeaderBlockPreview,
  HeroBlockPreview,
  FeaturesBlockPreview,
  TestimonialsBlockPreview,
  AboutBlockPreview,
  ContactFormBlockPreview,
  FooterBlockPreview,
  SpacerBlockPreview,
  PricingBlockPreview,
  FaqBlockPreview,
  SignupBlockPreview,
  PricingFooterBlockPreview,
} from "./BlockPreviews";

interface LandingPagePreviewProps {
  page: LandingPage;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onUpdateBlock: (blockId: string, properties: Record<string, any>) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
  onDuplicateBlock?: (blockId: string) => void;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({
  page,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onDuplicateBlock,
}) => {
  const renderBlock = (block: LandingPageBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;
    const canMoveUp = index > 0;
    const canMoveDown = index < page.blocks.length - 1;

    const blockProps = {
      block,
      isSelected,
      onSelect: () => onSelectBlock(block.id),
      onUpdate: (props: Record<string, any>) => onUpdateBlock(block.id, props),
    };

    let blockContent;

    switch (block.type) {
      case "header":
        blockContent = <HeaderBlockPreview {...blockProps} />;
        break;
      case "hero":
        blockContent = <HeroBlockPreview {...blockProps} />;
        break;
      case "features":
        blockContent = <FeaturesBlockPreview {...blockProps} />;
        break;
      case "testimonials":
        blockContent = <TestimonialsBlockPreview {...blockProps} />;
        break;
      case "about":
        blockContent = <AboutBlockPreview {...blockProps} />;
        break;
      case "contact-form":
        blockContent = <ContactFormBlockPreview {...blockProps} />;
        break;
      case "footer":
        blockContent = <FooterBlockPreview {...blockProps} />;
        break;
      case "section-spacer":
        blockContent = <SpacerBlockPreview {...blockProps} />;
        break;
      case "pricing":
        blockContent = <PricingBlockPreview {...blockProps} />;
        break;
      case "faq":
        blockContent = <FaqBlockPreview {...blockProps} />;
        break;
      case "signup":
        blockContent = <SignupBlockPreview {...blockProps} />;
        break;
      case "pricing-footer":
        blockContent = <PricingFooterBlockPreview {...blockProps} />;
        break;
      default:
        blockContent = <div>Unknown block type</div>;
    }

    return (
      <div
        key={block.id}
        className={`relative transition-all rounded cursor-pointer group ${
          isSelected
            ? "ring-2 ring-valasys-orange shadow-lg"
            : "hover:shadow-md"
        }`}
        onClick={() => onSelectBlock(block.id)}
      >
        {blockContent}

        {isSelected && (
          <div className="absolute top-2 right-2 flex gap-2 bg-white rounded-lg shadow-lg p-1 z-20">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title="Move up"
              onClick={(e) => {
                e.stopPropagation();
                if (canMoveUp) onMoveBlock(block.id, "up");
              }}
              disabled={!canMoveUp}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title="Move down"
              onClick={(e) => {
                e.stopPropagation();
                if (canMoveDown) onMoveBlock(block.id, "down");
              }}
              disabled={!canMoveDown}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title="Duplicate block"
              onClick={(e) => {
                e.stopPropagation();
                if (onDuplicateBlock) onDuplicateBlock(block.id);
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              title="Delete block"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBlock(block.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col gap-4 p-4">
      {page.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};
