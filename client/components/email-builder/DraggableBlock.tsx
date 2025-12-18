import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { ContentBlock } from "./types";
import { BlockRenderer } from "./BlockRenderer";
import { BlockActions } from "./BlockActions";
import { cn } from "@/lib/utils";

interface DraggableBlockProps {
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  isSelected: boolean;
  selectedFooterElement?: string | null;
  onBlockUpdate: (block: ContentBlock) => void;
  onBlockSelect: (id: string) => void;
  onFooterElementSelect?: (element: string | null) => void;
  onMoveBlock: (dragIndex: number, hoverIndex: number) => void;
  onAddBlock: (block: ContentBlock, position: number) => void;
  onDuplicate: (block: ContentBlock, position: number) => void;
  onDelete: (blockId: string) => void;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  index,
  totalBlocks,
  isSelected,
  selectedFooterElement,
  onBlockUpdate,
  onBlockSelect,
  onFooterElementSelect,
  onMoveBlock,
  onAddBlock,
  onDuplicate,
  onDelete,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "canvas-block",
      item: () => ({ index, blockId: block.id }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [index, block.id],
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "canvas-block",
      hover: (item: { index: number; blockId: string }) => {
        if (item.index !== index) {
          onMoveBlock(item.index, index);
          item.index = index;
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, onMoveBlock],
  );

  const dragDropRef = React.useRef<HTMLDivElement>(null);
  drag(drop(dragDropRef));

  return (
    <div
      ref={dragDropRef}
      className={cn(
        "group relative transition-all cursor-move",
        isDragging && "opacity-50 scale-95",
        isOver && "ring-2 ring-valasys-orange rounded-lg",
      )}
    >
      {/* Drag Hint */}
      {!isDragging && (
        <div className="absolute left-0 top-0 h-full w-1 bg-valasys-orange opacity-0 group-hover:opacity-100 transition-opacity rounded-l-lg pointer-events-none" />
      )}

      <BlockRenderer
        block={block}
        isSelected={isSelected}
        selectedFooterElement={selectedFooterElement}
        onBlockUpdate={onBlockUpdate}
        onBlockSelect={onBlockSelect}
        onFooterElementSelect={onFooterElementSelect}
      />

      {isSelected && (
        <div className="px-4 py-2">
          <BlockActions
            blockId={block.id}
            blockIndex={index}
            totalBlocks={totalBlocks}
            onAddBlock={(newBlock, position) => {
              onAddBlock(newBlock, position);
            }}
            onDuplicate={(_, position) => {
              onDuplicate(block, position);
            }}
            onDelete={() => onDelete(block.id)}
          />
        </div>
      )}
    </div>
  );
};
