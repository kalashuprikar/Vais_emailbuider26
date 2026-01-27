import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { EmailBuilder } from "@/components/email-builder/EmailBuilder";
import { EmailTemplate } from "@/components/email-builder/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getTemplatesFromLocalStorage,
  deleteTemplateFromLocalStorage,
  renderTemplateToHTML,
} from "@/components/email-builder/utils";
import { Mail, Plus, Trash2, Edit2, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "list" | "editor";

export default function Templates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [view, setView] = useState<View>("list");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Load templates from localStorage
  useEffect(() => {
    const loaded = getTemplatesFromLocalStorage();
    setTemplates(loaded);
  }, []);

  const handleNewTemplate = () => {
    setSelectedTemplateId(null);
    setView("editor");
  };

  const handleEditTemplate = (id: string) => {
    setSelectedTemplateId(id);
    setView("editor");
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplateFromLocalStorage(id);
    setTemplates(templates.filter((t) => t.id !== id));
    setShowDeleteDialog(false);
    setDeleteTargetId(null);
  };

  const handleDownloadTemplate = (template: EmailTemplate) => {
    const htmlContent = renderTemplateToHTML(template);
    const element = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${template.name || "template"}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleBackToList = () => {
    // Refresh templates from localStorage
    const loaded = getTemplatesFromLocalStorage();
    setTemplates(loaded);
    setView("list");
    setSelectedTemplateId(null);
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (view === "editor") {
    return (
      <EmailBuilder
        templateId={selectedTemplateId || undefined}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-8 h-8 text-valasys-orange" />
              Email Templates
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage professional email templates with our
              drag-and-drop builder
            </p>
          </div>
          <Button
            onClick={handleNewTemplate}
            className="bg-valasys-orange hover:bg-valasys-orange/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Empty State */}
        {templates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Mail className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No templates yet
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Create your first email template using our drag-and-drop builder
                to get started with professional email designs.
              </p>
              <Button
                onClick={handleNewTemplate}
                className="bg-valasys-orange hover:bg-valasys-orange/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search */}
            <div>
              <Input
                placeholder="Search templates by name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="flex flex-col hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg truncate">
                            {template.name}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2 font-medium truncate">
                        Subject: {template.subject}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex-1 mb-4">
                        <Badge variant="outline" className="bg-blue-50">
                          {template.blocks.length} blocks
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400 mb-4">
                        Updated: {formatDate(template.updatedAt)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditTemplate(template.id)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Download as HTML"
                          onClick={() => handleDownloadTemplate(template)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setDeleteTargetId(template.id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-600 text-center">
                    No templates match your search. Try a different query.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Info Banner */}
        <Alert className="border-blue-200 bg-blue-50">
          <Mail className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 ml-2">
            Use our drag-and-drop email builder to create beautiful, responsive
            email templates. Add blocks, customize styling, and preview your
            design in real-time across different devices.
          </AlertDescription>
        </Alert>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteTargetId && handleDeleteTemplate(deleteTargetId)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
