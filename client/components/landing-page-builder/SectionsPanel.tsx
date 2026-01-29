import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingPageBlock } from "./types";
import {
  createMeetFramerTemplate,
  createMeetFramerWithButtonsTemplate,
  createLogoTemplate,
  createInfiniteCanvasTemplate,
  createInfiniteCanvasTwoColumnTemplate,
  createCanvasPublishTemplate,
  createThreeColumnTemplate,
  createStatisticsTemplate,
  createTestimonialTemplate,
  createPricingTemplate,
  createFaqTemplate,
  createSignupTemplate,
  createPricingFooterTemplate,
} from "./utils";

interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  preview: (isSelected: boolean) => React.ReactNode;
  blocks: () => LandingPageBlock[];
}

interface SectionsPanelProps {
  onSelectTemplate: (blocks: LandingPageBlock[]) => void;
  onBack: () => void;
}

const sectionTemplates: SectionTemplate[] = [
  {
    id: "template-1",
    name: "Meet Framer",
    description: "Internet canvas.",
    preview: (isSelected) => (
      <div className={`bg-white ${isSelected ? 'border border-gray-900' : 'border border-gray-200 hover:border-dashed hover:border-gray-400'} rounded-xl p-6 h-40 flex flex-col items-center justify-between transition-all`}>
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">Meet Framer</div>
          <div className="text-xs text-gray-600 mt-1">Internet canvas.</div>
        </div>
        <div className="w-full h-16 bg-gray-100 rounded-lg"></div>
      </div>
    ),
    blocks: createMeetFramerTemplate,
  },
  {
    id: "template-2",
    name: "Meet Framer",
    description: "With buttons",
    preview: (isSelected) => (
      <div className={`bg-white ${isSelected ? 'border border-gray-900' : 'border border-gray-200 hover:border-dashed hover:border-gray-400'} rounded-xl p-6 h-40 flex flex-col items-center justify-center gap-4 transition-all`}>
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">Meet Framer</div>
          <div className="text-xs text-gray-600 mt-1">Internet canvas.</div>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded pointer-events-none">
            Sign Up
          </div>
          <div className="px-4 py-2 bg-gray-100 text-gray-900 text-xs font-medium rounded pointer-events-none">
            Download
          </div>
        </div>
      </div>
    ),
    blocks: createMeetFramerWithButtonsTemplate,
  },
  {
    id: "template-3",
    name: "Logo",
    description: "Three logos",
    preview: (isSelected) => (
      <div className={`bg-white ${isSelected ? 'border border-gray-900' : 'border border-gray-200 hover:border-dashed hover:border-gray-400'} rounded-xl p-6 h-40 flex items-center justify-center gap-4 transition-all`}>
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="flex items-center gap-1 text-gray-400">
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <span className="text-xs text-gray-500">Logo</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="text-xs text-gray-500">Logo</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <div className="w-2 h-2 bg-gray-400"></div>
            <span className="text-xs text-gray-500">Logo</span>
          </div>
        </div>
      </div>
    ),
    blocks: createLogoTemplate,
  },
  {
    id: "template-4",
    name: "Infinite canvas",
    description: "Content layout",
    preview: (isSelected) => (
      <div className={`bg-white ${isSelected ? 'border border-gray-900' : 'border border-gray-200 hover:border-dashed hover:border-gray-400'} rounded-xl p-6 h-40 flex transition-all`}>
        <div className="flex-1 flex flex-col justify-center gap-2">
          <div className="text-xs font-semibold text-gray-900">
            Infinite canvas.
          </div>
          <div className="text-xs text-gray-500 line-clamp-2">
            Create layouts with your canvas
          </div>
          <div className="h-8 bg-gray-100 rounded-lg mt-2"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    ),
    blocks: createInfiniteCanvasTemplate,
  },
  {
    id: "template-5",
    name: "Infinite canvas",
    description: "Two-column section",
    preview: (isSelected) => (
      <div className={`bg-white ${isSelected ? 'border border-gray-900' : 'border border-gray-200 hover:border-dashed hover:border-gray-400'} rounded-xl p-6 h-40 flex gap-4 transition-all`}>
        <div className="flex-1 flex flex-col justify-center gap-2">
          <div className="text-xs font-semibold text-gray-900">
            Infinite canvas.
          </div>
          <div className="text-xs text-gray-500 line-clamp-2">
            Design inspiration section
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded mt-2"></div>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-2">
          <div className="text-xs font-semibold text-gray-900">
            Blazing fast.
          </div>
          <div className="text-xs text-gray-500 line-clamp-2">
            Performance optimized
          </div>
          <div className="h-16 bg-gray-100 rounded mt-2"></div>
        </div>
      </div>
    ),
    blocks: createInfiniteCanvasTwoColumnTemplate,
  },
  {
    id: "template-6",
    name: "Canvas & Publish",
    description: "Two-column layout",
    preview: (isSelected) => (
      <div className={`bg-white ${isSelected ? 'border border-gray-900' : 'border border-gray-200 hover:border-dashed hover:border-gray-400'} rounded-xl p-6 h-40 flex gap-4 transition-all`}>
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded"></div>
          <div className="text-xs font-semibold text-gray-900">Canvas.</div>
          <div className="text-xs text-gray-500 text-center line-clamp-2">
            Design together
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
          <div className="text-xs font-semibold text-gray-900">Publish.</div>
          <div className="text-xs text-gray-500 text-center line-clamp-2">
            Share your work
          </div>
        </div>
      </div>
    ),
    blocks: createCanvasPublishTemplate,
  },
  {
    id: "template-7",
    name: "Three Column",
    description: "Design, Write, Publish",
    preview: (isSelected) => (
      <div className={`bg-white ${isSelected ? 'border border-gray-900' : 'border border-gray-200 hover:border-dashed hover:border-gray-400'} rounded-xl p-6 h-40 flex gap-3 transition-all`}>
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 rounded"></div>
          <div className="text-xs font-semibold text-gray-900 text-center">
            Design
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 rounded"></div>
          <div className="text-xs font-semibold text-gray-900 text-center">
            Write
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 rounded"></div>
          <div className="text-xs font-semibold text-gray-900 text-center">
            Publish
          </div>
        </div>
      </div>
    ),
    blocks: createThreeColumnTemplate,
  },
  {
    id: "template-8",
    name: "Statistics",
    description: "Stats showcase",
    preview: (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-40 flex gap-4 items-center justify-center">
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <div className="text-lg font-bold text-gray-900">30+</div>
          <div className="text-xs text-gray-500">Templates</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <div className="text-lg font-bold text-gray-900">32+</div>
          <div className="text-xs text-gray-500">Integrations</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <div className="text-lg font-bold text-gray-900">10K</div>
          <div className="text-xs text-gray-500">Customers</div>
        </div>
      </div>
    ),
    blocks: createStatisticsTemplate,
  },
  {
    id: "template-9",
    name: "Testimonial",
    description: "Customer quote",
    preview: (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-40 flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900 leading-relaxed">
            "Framer is one of the best web design builders I have come across"
          </div>
          <div className="text-xs text-gray-500 mt-3">- Danielle</div>
        </div>
      </div>
    ),
    blocks: createTestimonialTemplate,
  },
  {
    id: "template-pricing",
    name: "Pricing",
    description: "Pricing plans with tiers",
    preview: (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-40 flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">Pricing</div>
          <div className="text-xs text-gray-500 mt-1">Subtitle.</div>
        </div>
        <div className="flex gap-3 justify-center items-end">
          <div className="flex flex-col items-center text-xs gap-2">
            <div className="text-sm font-bold text-gray-900">$0</div>
            <div className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              Sign up
            </div>
          </div>
          <div className="flex flex-col items-center text-xs gap-2">
            <div className="text-sm font-bold text-gray-900">$20</div>
            <div className="px-2 py-1 bg-gray-900 text-white text-xs rounded">
              Get In
            </div>
          </div>
          <div className="flex flex-col items-center text-xs gap-2">
            <div className="text-sm font-bold text-gray-900">$40</div>
            <div className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              Sign up
            </div>
          </div>
        </div>
      </div>
    ),
    blocks: createPricingTemplate,
  },
  {
    id: "template-faq",
    name: "FAQ",
    description: "Frequently asked questions",
    preview: (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-40 flex flex-col items-center justify-center gap-3">
        <div className="text-center mb-2">
          <div className="text-sm font-semibold text-gray-900">FAQ</div>
        </div>
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded text-xs">
            <input type="checkbox" className="w-3 h-3" disabled />
            <span className="text-gray-600 text-xs">How do frames work?</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded text-xs">
            <input type="checkbox" className="w-3 h-3" disabled />
            <span className="text-gray-600 text-xs">How do code pages?</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded text-xs">
            <input type="checkbox" className="w-3 h-3" disabled />
            <span className="text-gray-600 text-xs">How do features?</span>
          </div>
        </div>
      </div>
    ),
    blocks: createFaqTemplate,
  },
  {
    id: "template-signup",
    name: "Signup",
    description: "Newsletter signup section",
    preview: (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-40 flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">
            Stay in the loop.
          </div>
          <div className="text-xs text-gray-500 mt-1">Sign up now.</div>
        </div>
        <div className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded">
          Sign up
        </div>
      </div>
    ),
    blocks: createSignupTemplate,
  },
  {
    id: "template-footer",
    name: "Footer",
    description: "Footer with links and branding",
    preview: (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-40 flex flex-col justify-center gap-3">
        <div className="flex justify-between gap-4">
          <div className="text-xs">
            <div className="font-semibold text-gray-900 mb-1">Product</div>
            <div className="text-gray-500 text-xs space-y-0.5">
              <div>Solutions</div>
              <div>Contacts</div>
            </div>
          </div>
          <div className="text-xs">
            <div className="font-semibold text-gray-900 mb-1">Resources</div>
            <div className="text-gray-500 text-xs space-y-0.5">
              <div>Docs</div>
              <div>Help</div>
            </div>
          </div>
          <div className="text-xs">
            <div className="font-semibold text-gray-900 mb-1">Company</div>
            <div className="text-gray-500 text-xs space-y-0.5">
              <div>Support</div>
              <div>Blog</div>
            </div>
          </div>
        </div>
      </div>
    ),
    blocks: createPricingFooterTemplate,
  },
];

export const SectionsPanel: React.FC<SectionsPanelProps> = ({
  onSelectTemplate,
  onBack,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectTemplate = (templateId: string, blocks: LandingPageBlock[]) => {
    setSelectedId(templateId);
    onSelectTemplate(blocks);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              theme === "light"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Section Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4">
          {sectionTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template.id, template.blocks())}
              className={`group text-left transition-all ${
                selectedId === template.id ? '[&>div]:!border-gray-900' : '[&>div]:hover:border-dashed'
              }`}
            >
              {template.preview}
              <div className="mt-3">
                <div className="font-semibold text-sm text-gray-900 group-hover:text-valasys-orange transition-colors">
                  {template.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {template.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
