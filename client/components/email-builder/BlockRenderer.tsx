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
  const handleClick = () => {
    onBlockSelect?.(block.id);
  };

  switch (block.type) {
    case "title":
      return (
        <div onClick={handleClick}>
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
        <div onClick={handleClick}>
          <TextBlockComponent
            block={block}
            isSelected={isSelected}
            isEditing={isEditing || false}
            onEdit={() => onBlockSelect?.(block.id)}
            onEditingChange={onEditingBlockChange}
            onContentChange={(content) => onBlockUpdate({ ...block, content })}
          />
        </div>
      );
    case "image":
      return (
        <div onClick={handleClick}>
          <ImageBlockComponent
            block={block}
            isSelected={isSelected}
            onSrcChange={(src) => onBlockUpdate({ ...block, src })}
            onDimensionChange={(width, height) =>
              onBlockUpdate({ ...block, width, height })
            }
          />
        </div>
      );
    case "video":
      return (
        <div onClick={handleClick}>
          <VideoBlockComponent
            block={block}
            isSelected={isSelected}
            onSrcChange={(src) => onBlockUpdate({ ...block, src })}
          />
        </div>
      );
    case "button":
      return (
        <div onClick={handleClick}>
          <ButtonBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "dynamicContent":
      return (
        <div onClick={handleClick}>
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
        <div onClick={handleClick}>
          <LogoBlockComponent
            block={block}
            isSelected={isSelected}
            onSrcChange={(src) => onBlockUpdate({ ...block, src })}
          />
        </div>
      );
    case "social":
      return (
        <div onClick={handleClick}>
          <SocialBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "html":
      return (
        <div onClick={handleClick}>
          <HtmlBlockComponent
            block={block}
            isSelected={isSelected}
            onContentChange={(content) => onBlockUpdate({ ...block, content })}
          />
        </div>
      );
    case "divider":
      return (
        <div onClick={handleClick}>
          <DividerBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "product":
      return (
        <div onClick={handleClick}>
          <ProductBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "navigation":
      return (
        <div onClick={handleClick}>
          <NavigationBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "header":
      return (
        <div onClick={handleClick}>
          <HeaderBlockComponent
            block={block}
            isSelected={isSelected}
            onLogoChange={(logo) => onBlockUpdate({ ...block, logo })}
          />
        </div>
      );
    case "footer":
      return (
        <div onClick={handleClick}>
          <FooterBlockComponent
            block={block}
            isSelected={isSelected}
            onContentChange={(content) => onBlockUpdate({ ...block, content })}
          />
        </div>
      );
    case "footer-with-social":
      return (
        <div onClick={handleClick}>
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
        <div onClick={handleClick}>
          <SpacerBlockComponent block={block} isSelected={isSelected} />
        </div>
      );
    case "centeredImageCard":
      return (
        <div onClick={handleClick}>
          <CenteredImageCardBlockComponent
            block={block as any}
            isSelected={isSelected}
            onBlockUpdate={(updatedBlock) => onBlockUpdate(updatedBlock)}
            blockIndex={blockIndex}
            onDuplicate={onDuplicate}
            onDelete={() => onDelete?.(block.id)}
          />
        </div>
      );
    case "splitImageCard":
      return (
        <div onClick={handleClick}>
          <SplitImageCardBlockComponent
            block={block as any}
            isSelected={isSelected}
            onBlockUpdate={(updatedBlock) => onBlockUpdate(updatedBlock)}
          />
        </div>
      );
    case "twoColumnCard":
      return (
        <div onClick={handleClick}>
          <TwoColumnCardBlockComponent
            block={block as any}
            isSelected={isSelected}
            onUpdate={(updatedBlock) => onBlockUpdate(updatedBlock)}
          />
        </div>
      );
    case "stats":
      return (
        <div onClick={handleClick}>
          <StatsBlockComponent
            block={block as any}
            isSelected={isSelected}
            onUpdate={(updatedBlock) => onBlockUpdate(updatedBlock)}
          />
        </div>
      );
    case "features":
      return (
        <div onClick={handleClick}>
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
