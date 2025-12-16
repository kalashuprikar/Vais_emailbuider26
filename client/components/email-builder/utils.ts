import {
  ContentBlock,
  EmailTemplate,
  TitleBlock,
  TextBlock,
  ImageBlock,
  VideoBlock,
  ButtonBlock,
  DynamicContentBlock,
  LogoBlock,
  SocialBlock,
  HtmlBlock,
  DividerBlock,
  ProductBlock,
  NavigationBlock,
  HeaderBlock,
  FooterBlock,
  SpacerBlock,
} from "./types";

let idCounter = 0;
export function generateId(): string {
  const timestamp = Date.now();
  const counter = idCounter++ % 10000;
  const random =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${counter}-${random}`;
}

export function createTitleBlock(content = "Click to edit title"): TitleBlock {
  return {
    type: "title",
    id: generateId(),
    content,
    fontSize: 32,
    fontColor: "#000000",
    backgroundColor: "#ffffff",
    alignment: "left",
    fontWeight: "bold",
    width: 100,
    widthUnit: "%",
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 0,
    visibility: "all",
  };
}

export function createTextBlock(content = "Click to edit text"): TextBlock {
  return {
    type: "text",
    id: generateId(),
    content,
    fontSize: 16,
    fontColor: "#000000",
    backgroundColor: "#ffffff",
    alignment: "left",
    fontWeight: "normal",
    fontStyle: "normal",
    width: 100,
    widthUnit: "%",
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 0,
    visibility: "all",
  };
}

export function createImageBlock(src = ""): ImageBlock {
  return {
    type: "image",
    id: generateId(),
    src,
    alt: "Image",
    width: 300,
    height: 200,
    alignment: "center",
  };
}

export function createVideoBlock(src = ""): VideoBlock {
  return {
    type: "video",
    id: generateId(),
    src,
    thumbnail: "",
    width: 300,
    height: 200,
    alignment: "center",
  };
}

export function createDynamicContentBlock(
  fieldName = "field_name",
): DynamicContentBlock {
  return {
    type: "dynamicContent",
    id: generateId(),
    fieldName,
    placeholder: `[${fieldName}]`,
    backgroundColor: "#f5f5f5",
    padding: 12,
  };
}

export function createLogoBlock(src = ""): LogoBlock {
  return {
    type: "logo",
    id: generateId(),
    src,
    alt: "Logo",
    width: 150,
    height: 60,
    alignment: "center",
  };
}

export function createSocialBlock(): SocialBlock {
  return {
    type: "social",
    id: generateId(),
    platforms: [
      { name: "Facebook", url: "#", icon: "facebook" },
      { name: "Twitter", url: "#", icon: "twitter" },
      { name: "LinkedIn", url: "#", icon: "linkedin" },
    ],
    alignment: "center",
    size: "medium",
  };
}

export function createHtmlBlock(content = ""): HtmlBlock {
  return {
    type: "html",
    id: generateId(),
    content,
  };
}

export function createProductBlock(): ProductBlock {
  return {
    type: "product",
    id: generateId(),
    image: "",
    title: "Product Name",
    description: "Product description goes here",
    price: "$99.99",
    buttonText: "Buy Now",
    buttonLink: "#",
    alignment: "center",
  };
}

export function createNavigationBlock(): NavigationBlock {
  return {
    type: "navigation",
    id: generateId(),
    items: [
      { label: "Home", link: "#" },
      { label: "Products", link: "#" },
      { label: "About", link: "#" },
      { label: "Contact", link: "#" },
    ],
    backgroundColor: "#333333",
    textColor: "#ffffff",
    alignment: "center",
  };
}

export function createButtonBlock(text = "Click me"): ButtonBlock {
  return {
    type: "button",
    id: generateId(),
    text,
    link: "#",
    backgroundColor: "#FF6A00",
    textColor: "#ffffff",
    padding: 12,
    borderRadius: 4,
    alignment: "center",
  };
}

export function createDividerBlock(): DividerBlock {
  return {
    type: "divider",
    id: generateId(),
    color: "#e0e0e0",
    height: 1,
    margin: 20,
  };
}

export function createHeaderBlock(logo = ""): HeaderBlock {
  return {
    type: "header",
    id: generateId(),
    logo,
    backgroundColor: "#ffffff",
    padding: 20,
    alignment: "center",
  };
}

export function createFooterBlock(
  content = "© 2024 Valasys. All rights reserved.",
): FooterBlock {
  return {
    type: "footer",
    id: generateId(),
    content,
    backgroundColor: "#f5f5f5",
    textColor: "#666666",
    fontSize: 12,
    padding: 20,
  };
}

export function createSpacerBlock(height = 20): SpacerBlock {
  return {
    type: "spacer",
    id: generateId(),
    height,
    backgroundColor: "#ffffff",
  };
}

export function createEmptyTemplate(): EmailTemplate {
  return {
    id: generateId(),
    name: "Untitled Template",
    subject: "Email Subject",
    blocks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    backgroundColor: "#ffffff",
    padding: 20,
  };
}

export function renderBlockToHTML(block: ContentBlock): string {
  switch (block.type) {
    case "title": {
      const titleBlock = block as TitleBlock;
      const titleWidth =
        titleBlock.widthUnit === "%"
          ? `${titleBlock.width}%`
          : `${titleBlock.width}px`;
      const titleBorder =
        titleBlock.borderWidth > 0
          ? `border: ${titleBlock.borderWidth}px solid ${titleBlock.borderColor};`
          : "";
      return `<h1 style="font-size: ${titleBlock.fontSize}px; color: ${titleBlock.fontColor}; background-color: ${titleBlock.backgroundColor}; text-align: ${titleBlock.alignment}; font-weight: ${titleBlock.fontWeight}; margin: ${titleBlock.margin}px; padding: ${titleBlock.padding}px; width: ${titleWidth}; border-radius: ${titleBlock.borderRadius}px; ${titleBorder}">${titleBlock.content}</h1>`;
    }
    case "text": {
      const textBlock = block as TextBlock;
      const textWidth =
        textBlock.widthUnit === "%"
          ? `${textBlock.width}%`
          : `${textBlock.width}px`;
      const textBorder =
        textBlock.borderWidth > 0
          ? `border: ${textBlock.borderWidth}px solid ${textBlock.borderColor};`
          : "";
      return `<p style="font-size: ${textBlock.fontSize}px; color: ${textBlock.fontColor}; background-color: ${textBlock.backgroundColor}; text-align: ${textBlock.alignment}; font-weight: ${textBlock.fontWeight}; font-style: ${textBlock.fontStyle}; margin: ${textBlock.margin}px; padding: ${textBlock.padding}px; width: ${textWidth}; border-radius: ${textBlock.borderRadius}px; ${textBorder}">${textBlock.content}</p>`;
    }
    case "image":
      return `<img src="${block.src}" alt="${block.alt}" style="width: ${block.width}px; height: ${block.height}px; display: block; margin: 0 auto;" />`;
    case "video":
      return `<div style="text-align: ${block.alignment};"><video width="${block.width}" height="${block.height}" controls poster="${block.thumbnail}" style="max-width: 100%;"><source src="${block.src}" type="video/mp4"></video></div>`;
    case "button":
      return `<a href="${block.link}" style="background-color: ${block.backgroundColor}; color: ${block.textColor}; padding: ${block.padding}px 20px; border-radius: ${block.borderRadius}px; text-decoration: none; display: inline-block; text-align: center;">${block.text}</a>`;
    case "dynamicContent":
      return `<div style="background-color: ${block.backgroundColor}; padding: ${block.padding}px; border: 1px dashed #ccc;">${block.placeholder}</div>`;
    case "logo":
      return `<div style="text-align: ${block.alignment};"><img src="${block.src}" alt="${block.alt}" style="width: ${block.width}px; height: ${block.height}px;" /></div>`;
    case "social":
      return `<div style="text-align: ${block.alignment}; padding: 20px 0;"><p>Follow us on social media</p></div>`;
    case "html":
      return block.content;
    case "divider":
      return `<hr style="border: none; border-top: ${block.height}px solid ${block.color}; margin: ${block.margin}px 0;" />`;
    case "product":
      return `<div style="text-align: ${block.alignment}; border: 1px solid #ddd; padding: 20px; border-radius: 8px;"><img src="${block.image}" alt="${block.title}" style="width: 100%; max-width: 300px; height: auto;"><h3>${block.title}</h3><p>${block.description}</p><p style="font-weight: bold;">${block.price}</p><a href="${block.buttonLink}" style="background-color: #FF6A00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">${block.buttonText}</a></div>`;
    case "navigation":
      return `<nav style="background-color: ${block.backgroundColor}; padding: 10px 0; text-align: ${block.alignment};"><a href="#" style="color: ${block.textColor}; margin: 0 15px; text-decoration: none;">Link</a></nav>`;
    case "header":
      return `<div style="background-color: ${block.backgroundColor}; padding: ${block.padding}px; text-align: ${block.alignment};"><img src="${block.logo}" alt="Logo" style="max-width: 200px; height: auto;" /></div>`;
    case "footer":
      return `<footer style="background-color: ${block.backgroundColor}; color: ${block.textColor}; font-size: ${block.fontSize}px; padding: ${block.padding}px; text-align: center;">${block.content}</footer>`;
    case "spacer":
      return `<div style="height: ${block.height}px; background-color: ${block.backgroundColor};"></div>`;
    default:
      return "";
  }
}

export function renderTemplateToHTML(template: EmailTemplate): string {
  const bodyContent = template.blocks
    .map((block) => renderBlockToHTML(block))
    .join("");
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject}</title>
</head>
<body style="background-color: ${template.backgroundColor}; padding: ${template.padding}px; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto;">
    ${bodyContent}
  </div>
</body>
</html>`;
}

export function saveTemplateToLocalStorage(template: EmailTemplate): void {
  const templates = getTemplatesFromLocalStorage();
  const index = templates.findIndex((t) => t.id === template.id);
  if (index > -1) {
    templates[index] = template;
  } else {
    templates.push(template);
  }
  localStorage.setItem("email_templates", JSON.stringify(templates));
}

export function getTemplatesFromLocalStorage(): EmailTemplate[] {
  const templates = localStorage.getItem("email_templates");
  return templates ? JSON.parse(templates) : [];
}

export function deleteTemplateFromLocalStorage(id: string): void {
  const templates = getTemplatesFromLocalStorage();
  const filtered = templates.filter((t) => t.id !== id);
  localStorage.setItem("email_templates", JSON.stringify(filtered));
}

export function getTemplateById(id: string): EmailTemplate | null {
  const templates = getTemplatesFromLocalStorage();
  return templates.find((t) => t.id === id) || null;
}
