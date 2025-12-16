import React, { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { EmailTemplate, ContentBlock } from "./types";
import { BlocksPanel } from "./BlocksPanel";
import { SettingsPanel } from "./SettingsPanel";
import { BlockRenderer } from "./BlockRenderer";
import { EmailPreview } from "./EmailPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createEmptyTemplate,
  saveTemplateToLocalStorage,
  getTemplatesFromLocalStorage,
  deleteTemplateFromLocalStorage,
} from "./utils";
import {
  Save,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailCanvas } from "./EmailCanvas";

interface EmailBuilderProps {
  templateId?: string;
  onBack?: () => void;
}

export const EmailBuilder: React.FC<EmailBuilderProps> = ({
  templateId,
  onBack,
}) => {
  const [template, setTemplate] = useState<EmailTemplate>(() => {
    if (templateId) {
      const existing = getTemplatesFromLocalStorage().find(
        (t) => t.id === templateId,
      );
      return existing || createEmptyTemplate();
    }
    return createEmptyTemplate();
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState(template.name);
  const [templateSubject, setTemplateSubject] = useState(template.subject);
  const [undoStack, setUndoStack] = useState<EmailTemplate[]>([]);
  const [redoStack, setRedoStack] = useState<EmailTemplate[]>([]);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const updated = {
        ...template,
        name: templateName,
        subject: templateSubject,
      };
      setTemplate(updated);
    }, 500);
    return () => clearTimeout(timer);
  }, [templateName, templateSubject]);

  const selectedBlock =
    template.blocks.find((b) => b.id === selectedBlockId) || null;

  const handleAddBlock = useCallback((block: ContentBlock) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: [...prev.blocks, block],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleUpdateBlock = useCallback((block: ContentBlock) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === block.id ? block : b)),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleDeleteBlock = useCallback(() => {
    if (selectedBlockId) {
      setTemplate((prev) => ({
        ...prev,
        blocks: prev.blocks.filter((b) => b.id !== selectedBlockId),
        updatedAt: new Date().toISOString(),
      }));
      setSelectedBlockId(null);
    }
  }, [selectedBlockId]);

  const handleMoveBlock = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragBlock = template.blocks[dragIndex];
      const newBlocks = [...template.blocks];
      newBlocks.splice(dragIndex, 1);
      newBlocks.splice(hoverIndex, 0, dragBlock);
      setTemplate((prev) => ({
        ...prev,
        blocks: newBlocks,
        updatedAt: new Date().toISOString(),
      }));
    },
    [template.blocks],
  );

  const handleSaveTemplate = () => {
    const updated = {
      ...template,
      name: templateName,
      subject: templateSubject,
      updatedAt: new Date().toISOString(),
    };
    setTemplate(updated);
    saveTemplateToLocalStorage(updated);
    setShowSaveDialog(false);
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const newUndo = [...undoStack];
      const prevTemplate = newUndo.pop()!;
      setRedoStack([...redoStack, template]);
      setTemplate(prevTemplate);
      setUndoStack(newUndo);
    }
  }, [undoStack, redoStack, template]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const newRedo = [...redoStack];
      const nextTemplate = newRedo.pop()!;
      setUndoStack([...undoStack, template]);
      setTemplate(nextTemplate);
      setRedoStack(newRedo);
    }
  }, [undoStack, redoStack, template]);

  return (
    <DashboardLayout>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
              {onBack && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <div className="flex-1 max-w-md">
                <div className="text-sm text-gray-600 mb-1">New template</div>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name"
                  className="font-semibold text-lg border-0 px-0 focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                  Unsaved changes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className={previewMode ? "bg-valasys-orange text-white" : ""}
              >
                <Eye className="w-4 h-4 mr-1" />
                {previewMode ? "Edit" : "Preview & test"}
              </Button>
              <Button
                onClick={() => setShowSaveDialog(true)}
                className="gap-2 bg-valasys-orange hover:bg-valasys-orange/90 text-white"
              >
                <Save className="w-4 h-4" />
                Save & exit
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {previewMode ? (
              <div className="flex-1">
                <EmailPreview template={template} />
              </div>
            ) : (
              <>
                {/* Left Sidebar - Blocks Panel with Selected Blocks */}
                <div className="flex flex-col w-72 bg-white border-r border-gray-200 overflow-hidden">
                  {/* Blocks/Sections/Saved Tabs */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <BlocksPanel onAddBlock={handleAddBlock} />
                  </div>
                </div>

                {/* Center - Editor Canvas */}
                <EmailCanvas
                  template={template}
                  templateSubject={templateSubject}
                  selectedBlockId={selectedBlockId}
                  onAddBlock={handleAddBlock}
                  onBlockUpdate={handleUpdateBlock}
                  onBlockSelect={setSelectedBlockId}
                  onTemplateSubjectChange={setTemplateSubject}
                  onBackgroundColorChange={(color) =>
                    setTemplate({
                      ...template,
                      backgroundColor: color,
                    })
                  }
                />

                {/* Right Sidebar - Settings Panel */}
                <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
                  <SettingsPanel
                    block={selectedBlock}
                    onBlockUpdate={handleUpdateBlock}
                    onBlockDelete={handleDeleteBlock}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Save Template Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Save Template
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Save this email template to your library for future use
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div>
                <Label
                  htmlFor="save-name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Template Name
                </Label>
                <Input
                  id="save-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Welcome Email"
                  className="mt-2 focus:ring-valasys-orange focus:ring-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="save-subject"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email Subject
                </Label>
                <Input
                  id="save-subject"
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                  placeholder="e.g., Welcome to Valasys"
                  className="mt-2 focus:ring-valasys-orange focus:ring-2"
                />
              </div>
            </div>
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTemplate}
                className="bg-valasys-orange hover:bg-valasys-orange/90 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DndProvider>
    </DashboardLayout>
  );
};
