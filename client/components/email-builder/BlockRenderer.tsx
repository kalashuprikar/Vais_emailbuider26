import React from "react";
import { ContentBlock } from "./types";
import { TitleBlockComponent } from "./blocks/TitleBlockComponent";
import { TextBlockComponent } from "./blocks/TextBlockComponent";
import { ImageBlockComponent } from "./blocks/ImageBlockComponent";
import { VideoBlockComponent } from "./blocks/VideoBlockComponent";
import { ButtonBlockComponent } from "./blocks/ButtonBlockComponent";
import { DynamicContentBlockComponent } from "./blocks/DynamicContentBlockComponent";
import { LogoBlockComponent } from "./blocks/LogoBlockComponent";
import { SocialBlockComponent } from "./blocks/SocialBlockComponent";
import { HtmlBlockComponent } from "./blocks/HtmlBlockComponent";
import { DividerBlockComponent } from "./blocks/DividerBlockComponent";
import { ProductBlockComponent } from "./blocks/ProductBlockComponent";
import { NavigationBlockComponent } from "./blocks/NavigationBlockComponent";
import { HeaderBlockComponent } from "./blocks/HeaderBlockComponent";
import { FooterBlockComponent } from "./blocks/FooterBlockComponent";
import { FooterWithSocialBlockComponent } from "./blocks/FooterWithSocialBlockComponent";
import { SpacerBlockComponent } from "./blocks/SpacerBlockComponent";
import { CenteredImageCardBlockComponent } from "./blocks/CenteredImageCardBlockComponent";
import { SplitImageCardBlockComponent } from "./blocks/SplitImageCardBlockComponent";
import { TwoColumnCardBlockComponent } from "./blocks/TwoColumnCardBlockComponent";
import { StatsBlockComponent } from "./blocks/StatsBlockComponent";
import { FeaturesBlockComponent } from "./blocks/FeaturesBlockComponent";

interface BlockRendererProps {
  block: ContentBlock;
  isSelected: boolean;
  isEditing?: boolean;
  selectedFooterElement?: string | null;
  onBlockUpdate: (block: ContentBlock) => void;
  onBlockSelect?: (blockId: string) => void;
  onEditingBlockChange?: (id: string | null) => void;
  onFooterElementSelect?: (element: string | null) => void;
  onAddBlock?: (block: ContentBlock, position: number) => void;
  onDuplicate?: (block: ContentBlock, position: number) => void;
  onDelete?: (blockId: string) => void;
  blockIndex?: number;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected,
  isEditing,
  selectedFooterElement,
  onBlockUpdate,
  onBlockSelect,
  onEditingBlockChange,
  onFooterElementSelect,
  onAddBlock,
  onDuplicate,
  onDelete,
  blockIndex = 0,
}) => {
  switch (block.type) {
    case "title":
      return (
        <div>
          <TitleBlockComponent
            block={block}
            isSelected={isSelected}
            isEditing={isEditing || false}
            onEdit={() => onBlockSelect?.(block.id)}
            onEditingChange={onEditingBlockChange}
            onContentChange={(content) => onBlockUpdate({ ...block, content })}
          />
        </div>
      );
    case "text":
      return (
        <div>
          <TextBlockComponent
            block={block}
            isSelected={isSelected}
            isEditing={isEditing || false}
            onEdit={() => onBlockSelect?.(block.id)}
            onEditingChange={onEditingBlockChange}
            onContentChange={(content) => onBlockUpdate({ ...block, content })}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            blockIndex={blockIndex}
          />
        </div>
      );
    case "image":
      return (
        <div>
          <ImageBlockComponent
            block={block}
            isSelected={isSelected}
            onSrcChange={(src) => onBlockUpdate({ ...block, src })}
            onDimensionChange={(width, height) =>
              onBlockUpdate({ ...block, width, height })
            }
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            blockIndex={blockIndex}
          />
        </div>
      );
    case "video":
      return (
        <div>
          <VideoBlockComponent
            block={block}
            isSelected={isSelected}
            onSrcChange={(src) => onBlockUpdate({ ...block, src })}
          />
        </div>
      );
    case "button":
      return (
        <div>
          <ButtonBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "dynamicContent":
      return (
        <div>
          <DynamicContentBlockComponent
            block={block}
            isSelected={isSelected}
            onFieldNameChange={(fieldName) =>
              onBlockUpdate({ ...block, fieldName })
            }
          />
        </div>
      );
    case "logo":
      return (
        <div>
          <LogoBlockComponent
            block={block}
            isSelected={isSelected}
            onSrcChange={(src) => onBlockUpdate({ ...block, src })}
          />
        </div>
      );
    case "social":
      return (
        <div>
          <SocialBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "html":
      return (
        <div>
          <HtmlBlockComponent
            block={block}
            isSelected={isSelected}
            onContentChange={(content) => onBlockUpdate({ ...block, content })}
          />
        </div>
      );
    case "divider":
      return (
        <div>
          <DividerBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "product":
      return (
        <div>
          <ProductBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "navigation":
      return (
        <div>
          <NavigationBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "header":
      return (
        <div>
          <HeaderBlockComponent
            block={block}
            isSelected={isSelected}
            onLogoChange={(logo) => onBlockUpdate({ ...block, logo })}
          />
        </div>
      );
    case "footer":
      return (
        <div>
          <FooterBlockComponent
            block={block}
            isSelected={isSelected}
            onContentChange={(content) => onBlockUpdate({ ...block, content })}
          />
        </div>
      );
    case "footer-with-social":
      return (
        <div>
          <FooterWithSocialBlockComponent
            block={block as any}
            isSelected={isSelected}
            selectedElement={selectedFooterElement}
            onContentChange={(field, value) =>
              onBlockUpdate({ ...block, [field]: value })
            }
            onSocialUpdate={(social) => onBlockUpdate({ ...block, social })}
            onElementSelect={onFooterElementSelect}
          />
        </div>
      );
    case "spacer":
      return (
        <div>
          <SpacerBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "centeredImageCard":
      return (
        <div>
          <CenteredImageCardBlockComponent
            block={block as any}
            isSelected={isSelected}
            onBlockUpdate={(updatedBlock) => onBlockUpdate(updatedBlock)}
            blockIndex={blockIndex}
          />
        </div>
      );
    case "splitImageCard":
      return (
        <div>
          <SplitImageCardBlockComponent
            block={block as any}
            isSelected={isSelected}
            onBlockUpdate={(updatedBlock) => onBlockUpdate(updatedBlock)}
            blockIndex={blockIndex}
          />
        </div>
      );
    case "twoColumnCard":
      return (
        <div>
          <TwoColumnCardBlockComponent
            block={block as any}
            isSelected={isSelected}
            onUpdate={(updatedBlock) => onBlockUpdate(updatedBlock)}
          />
        </div>
      );
    case "stats":
      return (
        <div>
          <StatsBlockComponent
            block={block as any}
            isSelected={isSelected}
            onUpdate={(updatedBlock) => onBlockUpdate(updatedBlock)}
          />
        </div>
      );
    case "features":
      return (
        <div>
          <FeaturesBlockComponent
            block={block as any}
            isSelected={isSelected}
            onUpdate={(updatedBlock) => onBlockUpdate(updatedBlock)}
          />
        </div>
      );
    default:
      return null;
  }
};
