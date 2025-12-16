import React from "react";
import { useDrop } from "react-dnd";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailTemplate, ContentBlock } from "./types";
import { BlockRenderer } from "./BlockRenderer";

interface EmailCanvasProps {
  template: EmailTemplate;
  templateSubject: string;
  selectedBlockId: string | null;
  onAddBlock: (block: ContentBlock) => void;
  onBlockUpdate: (block: ContentBlock) => void;
  onBlockSelect: (id: string) => void;
  onTemplateSubjectChange: (subject: string) => void;
  onBackgroundColorChange: (color: string) => void;
}

export const EmailCanvas: React.FC<EmailCanvasProps> = ({
  template,
  templateSubject,
  selectedBlockId,
  onAddBlock,
  onBlockUpdate,
  onBlockSelect,
  onTemplateSubjectChange,
  onBackgroundColorChange,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "block",
    drop: (item: any) => {
      onAddBlock(item.block);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Template Settings */}
        <div className="bg-white border border-gray-200 rounded-t-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="subject"
                className="text-xs font-medium text-gray-700 block"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={templateSubject}
                onChange={(e) => onTemplateSubjectChange(e.target.value)}
                placeholder="Email subject"
                className="text-sm mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="bgColor"
                className="text-xs font-medium text-gray-700 block"
              >
                Background
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  id="bgColor"
                  type="color"
                  value={template.backgroundColor}
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                  className="text-sm w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={template.backgroundColor}
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                  className="text-sm flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blocks Canvas */}
        <div
          ref={drop}
          style={{
            backgroundColor: template.backgroundColor,
            padding: `${template.padding}px`,
          }}
          className={cn(
            "bg-white border border-t-0 border-gray-200 rounded-b-lg shadow-sm min-h-96 transition-all",
            isOver && "ring-2 ring-valasys-orange bg-orange-50",
          )}
        >
          {template.blocks.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-8 h-8 text-gray-300" />
                </div>
              </div>
              <p className="mb-2 text-gray-600 font-medium">
                Drop content here
              </p>
              <p className="text-sm text-gray-400">
                Drag blocks from the left sidebar to add them to your email
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {template.blocks.map((block) => (
                <div key={block.id}>
                  <BlockRenderer
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onBlockUpdate={onBlockUpdate}
                    onBlockSelect={onBlockSelect}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
