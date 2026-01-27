import React, { useState, useCallback } from "react";
import { EmailTemplate } from "./types";
import { renderTemplateToHTML } from "./utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface SourceCodeViewProps {
  template: EmailTemplate;
}

export const SourceCodeView: React.FC<SourceCodeViewProps> = ({ template }) => {
  const [copied, setCopied] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const htmlContent = renderTemplateToHTML(template);

  const handleCopy = useCallback(() => {
    if (!htmlContent) {
      console.error("No content to copy");
      return;
    }

    navigator.clipboard.writeText(htmlContent).then(() => {
      console.log("Content copied to clipboard");
      setCopied(true);
      setOpenTooltip(true);
      setTimeout(() => {
        setCopied(false);
        setOpenTooltip(false);
      }, 2000);
    }).catch((err) => {
      console.error("Failed to copy:", err);
      // Fallback: use old method
      const textArea = document.createElement("textarea");
      textArea.value = htmlContent;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setOpenTooltip(true);
        setTimeout(() => {
          setCopied(false);
          setOpenTooltip(false);
        }, 2000);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
      document.body.removeChild(textArea);
    });
  }, [htmlContent]);

  const handleDownloadHTML = () => {
    const element = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${template.name || "template"}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("HTML downloaded successfully");
  };

  const handleDownloadJSON = () => {
    const templateJson = JSON.stringify(template, null, 2);
    const element = document.createElement("a");
    const file = new Blob([templateJson], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `${template.name || "template"}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Template JSON downloaded successfully");
  };

  const handleDownloadPDF = () => {
    // Create a new window to print as PDF with the email preview
    const printWindow = window.open("", "", "height=900,width=1200");
    if (printWindow) {
      const bgColor = template.backgroundColor || "#ffffff";
      const padding = template.padding || 20;

      try {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${template.name || "Template"}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                padding: 40px 20px;
              }
              .container {
                max-width: 800px;
                margin: 0 auto;
                background-color: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header {
                border-bottom: 2px solid #e0e0e0;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .header h1 {
                font-size: 24px;
                color: #333;
                margin-bottom: 10px;
              }
              .subject {
                margin-top: 5px;
                padding: 8px 12px;
                background-color: #f0f0f0;
                border-radius: 4px;
                display: inline-block;
                color: #666;
                font-size: 14px;
              }
              .email-preview {
                border-radius: 4px;
                min-height: 400px;
              }
              .email-preview img {
                max-width: 100%;
                height: auto;
              }
              .email-preview h1, .email-preview h2, .email-preview h3 {
                margin-bottom: 15px;
              }
              .email-preview p {
                margin-bottom: 10px;
                line-height: 1.6;
              }
              .email-preview a {
                color: #007bff;
                text-decoration: none;
              }
              .email-preview button {
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
              }
              @media print {
                body {
                  background-color: white;
                  padding: 0;
                }
                .container {
                  box-shadow: none;
                  padding: 20px 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${template.name || "Email Template"}</h1>
                <div class="subject"><strong>Subject:</strong> ${template.subject || "No Subject"}</div>
              </div>
              <div class="email-preview" style="background-color: ${bgColor}; padding: ${padding}px;">
                ${htmlContent}
              </div>
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => printWindow.close(), 100);
        }, 250);
      } catch (error) {
        console.error("Error generating PDF preview:", error);
        toast.error("Failed to generate PDF preview");
      }
    }

    toast.success("PDF preview opened. Use your browser's print dialog to save as PDF");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Actions */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            HTML Source Code
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete HTML for: {template.name || "Untitled Template"}
          </p>
        </div>
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-2">
            <Tooltip open={openTooltip} onOpenChange={setOpenTooltip}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-medium" side="top">
                {copied ? "Copied!" : "Copy Code"}
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-max">
                <DropdownMenuItem onClick={handleDownloadHTML} className="py-2.5">
                  <Download className="w-4 h-4 mr-3" />
                  Download HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadPDF} className="py-2.5">
                  <Download className="w-4 h-4 mr-3" />
                  Download Preview (PDF)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadJSON} className="py-2.5">
                  <FileJson className="w-4 h-4 mr-3" />
                  Download Template (JSON)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <pre className="p-4 text-xs font-mono text-gray-800 overflow-auto max-h-full leading-relaxed">
            <code>{htmlContent}</code>
          </pre>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t border-gray-200 p-4 text-sm text-gray-600 flex justify-between">
        <span>Lines: {htmlContent.split("\n").length}</span>
        <span>Characters: {htmlContent.length}</span>
        <span>Blocks: {template.blocks.length}</span>
      </div>
    </div>
  );
};
