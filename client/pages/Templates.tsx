import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Plus, Trash2, Edit2, Copy, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preview: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to Valasys AI Score",
    preview: "Get started with our platform and unlock the power of intent signals...",
    body: "Hi {{firstName}},\n\nWelcome to Valasys AI Score! We're excited to have you on board.\n\nYou now have access to powerful intent signal analytics that will help you identify high-quality prospects.\n\nGet started by exploring your first campaign.\n\nBest regards,\nValasys Team",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    category: "Onboarding",
  },
  {
    id: "2",
    name: "Campaign Results",
    subject: "Your {{campaignName}} campaign results are ready",
    preview: "Check out the performance metrics and insights from your latest campaign...",
    body: "Hi {{firstName}},\n\nGreat news! Your {{campaignName}} campaign has completed processing.\n\nCampaign Summary:\n- Total Prospects Identified: {{prospectCount}}\n- Success Rate: {{successRate}}%\n- Next Steps: Review and export your results\n\nYou can download your prospect list from the dashboard.\n\nBest regards,\nValasys Team",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
    category: "Campaigns",
  },
  {
    id: "3",
    name: "Account Alert",
    subject: "Important: Action required for your account",
    preview: "Your account requires attention to maintain uninterrupted service...",
    body: "Hi {{firstName}},\n\nWe wanted to alert you about an important update regarding your account.\n\n{{message}}\n\nPlease log in to your account to resolve this issue.\n\nIf you have any questions, please contact our support team.\n\nBest regards,\nValasys Support Team",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13",
    category: "Account",
  },
];

export default function Templates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState<EmailTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    body: "",
    category: "General",
  });

  const categories = ["All", "Onboarding", "Campaigns", "Account", "General"];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      alert("Please fill in all fields");
      return;
    }

    const template: EmailTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      subject: newTemplate.subject,
      body: newTemplate.body,
      category: newTemplate.category,
      preview: newTemplate.body.substring(0, 100) + "...",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: "", subject: "", body: "", category: "General" });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;

    setTemplates(
      templates.map((t) =>
        t.id === editingTemplate.id
          ? {
              ...editingTemplate,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : t
      )
    );
    setEditingTemplate(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const duplicated: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setTemplates([...templates, duplicated]);
  };

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
              Create, manage, and organize email templates for your campaigns
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-valasys-orange hover:bg-valasys-orange/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a new email template with dynamic variables
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    placeholder="e.g., Welcome Email"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="template-subject">Email Subject</Label>
                  <Input
                    id="template-subject"
                    placeholder="e.g., Welcome to {{companyName}}"
                    value={newTemplate.subject}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, subject: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="template-category">Category</Label>
                  <select
                    id="template-category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                    value={newTemplate.category}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, category: e.target.value })
                    }
                  >
                    <option value="General">General</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Campaigns">Campaigns</option>
                    <option value="Account">Account</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="template-body">Email Body</Label>
                  <Textarea
                    id="template-body"
                    placeholder="Write your email template here. Use {{variableName}} for dynamic content."
                    value={newTemplate.body}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, body: e.target.value })
                    }
                    rows={8}
                  />
                </div>
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  <strong>Tip:</strong> Use variables like {{firstName}}, {{lastName}}, {{email}}, {{companyName}}, etc. for dynamic content
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTemplate}
                  className="bg-valasys-orange hover:bg-valasys-orange/90 text-white"
                >
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Search templates by name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Badge
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "cursor-pointer",
                  selectedCategory === cat
                    ? "bg-valasys-orange text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                )}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 font-medium">
                  Subject: {template.subject}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-gray-600 flex-1 line-clamp-3 mb-4">
                  {template.preview}
                </p>
                <div className="text-xs text-gray-400 mb-4">
                  Updated: {template.updatedAt}
                </div>
                <div className="flex gap-2">
                  <Dialog open={isViewDialogOpen && viewingTemplate?.id === template.id} onOpenChange={(open) => {
                    if (!open) setViewingTemplate(null);
                    setIsViewDialogOpen(open);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setViewingTemplate(template)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{template.name}</DialogTitle>
                        <DialogDescription>
                          Subject: {template.subject}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-900 font-semibold">Email Body:</Label>
                          <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm">
                            {template.body}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-600">Created</Label>
                            <p>{template.createdAt}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Last Updated</Label>
                            <p>{template.updatedAt}</p>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isEditDialogOpen && editingTemplate?.id === template.id} onOpenChange={(open) => {
                    if (!open) setEditingTemplate(null);
                    setIsEditDialogOpen(open);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Template</DialogTitle>
                        <DialogDescription>
                          Update your email template
                        </DialogDescription>
                      </DialogHeader>
                      {editingTemplate && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-name">Template Name</Label>
                            <Input
                              id="edit-name"
                              value={editingTemplate.name}
                              onChange={(e) =>
                                setEditingTemplate({
                                  ...editingTemplate,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-subject">Email Subject</Label>
                            <Input
                              id="edit-subject"
                              value={editingTemplate.subject}
                              onChange={(e) =>
                                setEditingTemplate({
                                  ...editingTemplate,
                                  subject: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-category">Category</Label>
                            <select
                              id="edit-category"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                              value={editingTemplate.category}
                              onChange={(e) =>
                                setEditingTemplate({
                                  ...editingTemplate,
                                  category: e.target.value,
                                })
                              }
                            >
                              <option value="General">General</option>
                              <option value="Onboarding">Onboarding</option>
                              <option value="Campaigns">Campaigns</option>
                              <option value="Account">Account</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="edit-body">Email Body</Label>
                            <Textarea
                              id="edit-body"
                              value={editingTemplate.body}
                              onChange={(e) =>
                                setEditingTemplate({
                                  ...editingTemplate,
                                  body: e.target.value,
                                })
                              }
                              rows={8}
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateTemplate}
                          className="bg-valasys-orange hover:bg-valasys-orange/90 text-white"
                        >
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDuplicateTemplate(template)}
                    title="Duplicate template"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteTemplate(template.id)}
                    title="Delete template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-gray-600 text-center">
                {searchQuery || selectedCategory !== "All"
                  ? "No templates match your filters"
                  : "No templates yet. Create your first template to get started!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
