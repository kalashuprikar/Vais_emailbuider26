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
  FooterWithSocialBlock,
  SpacerBlock,
  CenteredImageCardBlock,
  SplitImageCardBlock,
} from "./types";
import { compileHTML, sanitizeHTML } from "./htmlCompiler";

export function generateId(): string {
  // Use crypto.randomUUID if available, fallback to timestamp + random
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + multiple random components for better uniqueness
  const timestamp = Date.now();
  const random1 = Math.random().toString(36).substring(2, 15);
  const random2 = Math.random().toString(36).substring(2, 15);
  const random3 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random1}-${random2}-${random3}`;
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
    width: 600,
    height: 260,
    widthUnit: "px",
    heightUnit: "px",
    alignment: "center",
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 0,
    visibility: "all",
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
    widthUnit: "px",
    alignment: "center",
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 0,
    visibility: "all",
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
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 0,
    visibility: "all",
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
    widthUnit: "px",
    alignment: "center",
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 0,
    visibility: "all",
  };
}

export function createSocialBlock(): SocialBlock {
  return {
    type: "social",
    id: generateId(),
    platforms: [
      { name: "Facebook", url: "#", icon: "facebook" },
      { name: "Instagram", url: "#", icon: "instagram" },
      { name: "LinkedIn", url: "#", icon: "linkedin" },
      { name: "YouTube", url: "#", icon: "youtube" },
    ],
    alignment: "center",
    size: "medium",
    shape: "rounded",
    theme: "colored",
    spacing: 8,
    width: 100,
    widthUnit: "%",
    padding: 15,
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 4,
    visibility: "all",
  };
}

export function createHtmlBlock(content = ""): HtmlBlock {
  return {
    type: "html",
    id: generateId(),
    content,
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
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 0,
    visibility: "all",
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
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 0,
    visibility: "all",
  };
}

export function createButtonBlock(text = "Click me"): ButtonBlock {
  return {
    type: "button",
    id: generateId(),
    text,
    link: "#",
    linkType: "url",
    linkTarget: "",
    linkTooltip: "",
    backgroundColor: "#FF6A00",
    textColor: "#ffffff",
    padding: 12,
    margin: 0,
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#000000",
    width: 100,
    widthUnit: "%",
    fontSize: 16,
    fontWeight: "normal",
    alignment: "center",
    visibility: "all",
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

export function createFooterWithSocialBlock(): FooterWithSocialBlock {
  return {
    type: "footer-with-social",
    id: generateId(),
    social: {
      platforms: [
        { name: "Facebook", url: "#", icon: "facebook" },
        { name: "Instagram", url: "#", icon: "instagram" },
        { name: "LinkedIn", url: "#", icon: "linkedin" },
        { name: "YouTube", url: "#", icon: "youtube" },
      ],
      size: "small",
      shape: "rounded",
      theme: "colored",
      spacing: 8,
      alignment: "center",
      padding: 15,
      margin: 0,
      width: 100,
      widthUnit: "%",
    },
    enterpriseName: {
      content: "Enterprise name",
      fontSize: 16,
      fontColor: "#000000",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      fontStyle: "normal",
      alignment: "center",
      padding: 10,
      margin: 0,
    },
    address: {
      content: "69 Street Name, 00000, City",
      fontSize: 13,
      fontColor: "#666666",
      fontWeight: "normal",
      fontFamily: "Arial, sans-serif",
      fontStyle: "normal",
      alignment: "center",
      padding: 10,
      margin: 0,
    },
    subscriptionText: {
      content:
        "You've received it because you've subscribed to our newsletter.",
      fontSize: 12,
      fontColor: "#999999",
      fontWeight: "normal",
      fontFamily: "Arial, sans-serif",
      fontStyle: "normal",
      alignment: "center",
      padding: 10,
      margin: 0,
    },
    unsubscribeLink: {
      text: "Unsubscribe",
      url: "#",
      fontSize: 12,
      fontColor: "#FF6A00",
      fontWeight: "normal",
      fontFamily: "Arial, sans-serif",
      fontStyle: "normal",
      padding: 10,
      margin: 0,
      textDecoration: "underline",
    },
    backgroundColor: "#f5f5f5",
    padding: 30,
    margin: 0,
    alignment: "center",
    visibility: "all",
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

export function createCenteredImageCardBlock(): CenteredImageCardBlock {
  return {
    type: "centeredImageCard",
    id: generateId(),
    image:
      "https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=600&h=300&fit=crop",
    imageAlt: "Card image",
    title: "Some title here",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
    buttonText: "Call to action",
    buttonLink: "#",
    buttonLinkType: "url",
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    margin: 16,
    visibility: "all",
  };
}

export function createSplitImageCardBlock(
  imagePosition: "left" | "right" = "left",
): SplitImageCardBlock {
  return {
    type: "splitImageCard",
    id: generateId(),
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=300&fit=crop",
    imageAlt: "Card image",
    label: "New",
    title: "Some title here",
    description:
      "From 25€\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
    buttonText: "Call to action",
    buttonLink: "#",
    buttonLinkType: "url",
    imagePosition,
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    margin: 16,
    visibility: "all",
  };
}

export function createHeaderLogoAndDividerTemplate(): ContentBlock[] {
  return [createLogoBlock(), createDividerBlock()];
}

export function createHeaderLogoAndSocialTemplate(): ContentBlock[] {
  const logoBlock: LogoBlock = {
    type: "logo",
    id: generateId(),
    src: "",
    alt: "Logo",
    width: 149,
    height: 36,
    widthUnit: "px",
    alignment: "center",
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 0,
    visibility: "all",
  };

  const socialBlock: SocialBlock = {
    type: "social",
    id: generateId(),
    platforms: [
      { name: "Facebook", url: "#", icon: "facebook" },
      { name: "Instagram", url: "#", icon: "instagram" },
      { name: "LinkedIn", url: "#", icon: "linkedin" },
      { name: "YouTube", url: "#", icon: "youtube" },
    ],
    alignment: "center",
    size: "small",
    shape: "rounded",
    theme: "colored",
    spacing: 8,
    width: 100,
    widthUnit: "%",
    padding: 15,
    margin: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 4,
    visibility: "all",
  };

  return [logoBlock, socialBlock];
}

export function createHeaderLogoAndNavigationTemplate(): ContentBlock[] {
  const nav = createNavigationBlock();
  nav.items = [
    { label: "Order now", link: "#" },
    { label: "Contact us", link: "#" },
    { label: "Find a shop", link: "#" },
  ];
  return [createLogoBlock(), nav, createDividerBlock()];
}

export function createFooterWithSocialTemplate(): ContentBlock[] {
  return [createFooterWithSocialBlock()];
}

export function createFooterWithContactTemplate(): ContentBlock[] {
  const footerContent = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 30px 20px; margin: 0; border-top: 1px solid #e0e0e0;">
  <tr>
    <td style="text-align: left; vertical-align: top; width: 50%; padding-right: 15px;">
      <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #000;">Enterprise name</h3>
      <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.6;">69 Street Name, 00000, City</p>
    </td>
    <td style="text-align: right; vertical-align: top; width: 50%; padding-left: 15px;">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
        <a href="#" style="color: #666; text-decoration: none;">Privacy</a> |
        <a href="#" style="color: #666; text-decoration: none;">Terms</a> |
        <a href="#" style="color: #666; text-decoration: none;">Policy</a>
      </p>
      <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">
        <a href="mailto:contact@enterprise.com" style="color: #666; text-decoration: none;">contact@enterprise.com</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #666;">
        <a href="tel:+33901230467" style="color: #666; text-decoration: none;">+33 901 23 04 67</a>
      </p>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top: 15px; border-top: 1px solid #e0e0e0;">
      <p style="margin: 0; font-size: 11px; color: #999; text-align: center;">
        <a href="#" style="color: #999; text-decoration: none;">Unsubscribe</a>
      </p>
    </td>
  </tr>
</table>`;

  return [createHtmlBlock(footerContent)];
}

export function createTwoColumnCardBlock(): HtmlBlock {
  return {
    type: "html",
    id: generateId(),
    content: `<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
      <tr>
        <td width="48%" style="vertical-align: top; padding-right: 10px;">
          <div style="background-color: #333333; color: #ffffff; padding: 24px; border-radius: 8px;">
            <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;">Some title here</h3>
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
          </div>
        </td>
        <td width="48%" style="vertical-align: top; padding-left: 10px;">
          <div style="background-color: #333333; color: #ffffff; padding: 24px; border-radius: 8px;">
            <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;">Some title here</h3>
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
          </div>
        </td>
      </tr>
    </table>`,
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

export function createPromoBlock(): HtmlBlock {
  return {
    type: "html",
    id: generateId(),
    content: `<div style="background-color: #f9f9f9; padding: 40px 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 12px 0; font-size: 16px; color: #666;">Save 15% on your next order!</p>
      <h2 style="margin: 0; font-size: 36px; font-weight: bold; color: #000; letter-spacing: 2px;">PROMO15</h2>
    </div>`,
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

export function createStatsBlock(): HtmlBlock {
  return {
    type: "html",
    id: generateId(),
    content: `<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
      <tr>
        <td width="33%" style="text-align: center; padding: 20px;">
          <h3 style="margin: 0 0 8px 0; font-size: 28px; font-weight: bold; color: #000;">4.8</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">Average rating</p>
        </td>
        <td width="33%" style="text-align: center; padding: 20px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;">
          <h3 style="margin: 0 0 8px 0; font-size: 28px; font-weight: bold; color: #000;">120</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">Reviews</p>
        </td>
        <td width="33%" style="text-align: center; padding: 20px;">
          <h3 style="margin: 0 0 8px 0; font-size: 28px; font-weight: bold; color: #000;">200K</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">Downloads</p>
        </td>
      </tr>
    </table>`,
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

export function createFeaturesBlock(): HtmlBlock {
  return {
    type: "html",
    id: generateId(),
    content: `<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
      <tr>
        <td width="33%" style="text-align: center; padding: 20px;">
          <div style="font-size: 32px; margin-bottom: 12px;">❤️</div>
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #000;">Some title here</h3>
          <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.5;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </td>
        <td width="33%" style="text-align: center; padding: 20px;">
          <div style="font-size: 32px; margin-bottom: 12px;">🎁</div>
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #000;">Some title here</h3>
          <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.5;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </td>
        <td width="33%" style="text-align: center; padding: 20px;">
          <div style="font-size: 32px; margin-bottom: 12px;">ℹ️</div>
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #000;">Some title here</h3>
          <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.5;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </td>
      </tr>
    </table>`,
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
    case "image": {
      const imageBlock = block as ImageBlock;
      const imageWidth =
        imageBlock.widthUnit === "%"
          ? `${imageBlock.width}%`
          : `${imageBlock.width}px`;
      const imageHeight =
        imageBlock.heightUnit === "%"
          ? `${imageBlock.height}%`
          : `${imageBlock.height}px`;
      const imageBorder =
        imageBlock.borderWidth > 0
          ? `border: ${imageBlock.borderWidth}px solid ${imageBlock.borderColor};`
          : "";
      const imageDisplay =
        imageBlock.alignment === "left"
          ? "block; margin-right: auto;"
          : imageBlock.alignment === "right"
            ? "block; margin-left: auto;"
            : "block; margin: auto;";
      return `<img src="${imageBlock.src}" alt="${imageBlock.alt}" style="width: ${imageWidth}; height: ${imageHeight}; display: ${imageDisplay} padding: ${imageBlock.padding}px; margin: ${imageBlock.margin}px; border-radius: ${imageBlock.borderRadius}px; ${imageBorder}" />`;
    }
    case "video":
      return `<div style="text-align: ${block.alignment};"><video width="${block.width}" height="${block.height}" controls poster="${block.thumbnail}" style="max-width: 100%;"><source src="${block.src}" type="video/mp4"></video></div>`;
    case "button": {
      const buttonBlock = block as ButtonBlock;
      const buttonWidth =
        buttonBlock.widthUnit === "%"
          ? `${buttonBlock.width}%`
          : `${buttonBlock.width}px`;
      const buttonBorder =
        buttonBlock.borderWidth > 0
          ? `border: ${buttonBlock.borderWidth}px solid ${buttonBlock.borderColor};`
          : "";
      const buttonAlignment =
        buttonBlock.alignment === "left"
          ? "flex-start"
          : buttonBlock.alignment === "right"
            ? "flex-end"
            : "center";
      const target = buttonBlock.linkTarget
        ? `target="${buttonBlock.linkTarget}"`
        : "";
      const title = buttonBlock.linkTooltip
        ? `title="${buttonBlock.linkTooltip}"`
        : "";
      return `<div style="display: flex; justify-content: ${buttonAlignment}; margin: ${buttonBlock.margin}px;"><a href="${buttonBlock.link}" ${target} ${title} style="background-color: ${buttonBlock.backgroundColor}; color: ${buttonBlock.textColor}; padding: ${buttonBlock.padding}px 20px; border-radius: ${buttonBlock.borderRadius}px; text-decoration: none; display: inline-block; text-align: center; font-size: ${buttonBlock.fontSize}px; font-weight: ${buttonBlock.fontWeight}; width: ${buttonWidth}; ${buttonBorder}">${buttonBlock.text}</a></div>`;
    }
    case "dynamicContent":
      return `<div style="background-color: ${block.backgroundColor}; padding: ${block.padding}px; border: 1px dashed #ccc;">${block.placeholder}</div>`;
    case "logo": {
      const logoBlock = block as LogoBlock;
      const logoDisplay = logoBlock.alignment === "center" ? "block" : "inline";
      const logoMargin = logoBlock.alignment === "center" ? "0 auto" : "0";
      return `<div style="text-align: ${logoBlock.alignment};"><img src="${logoBlock.src}" alt="${logoBlock.alt}" style="width: ${logoBlock.width}px; height: ${logoBlock.height}px; display: ${logoDisplay}; margin: ${logoMargin};" /></div>`;
    }
    case "social": {
      const socialBlock = block as SocialBlock;
      const iconSize =
        socialBlock.size === "small"
          ? 20
          : socialBlock.size === "medium"
            ? 32
            : 48;

      const getSocialIconColor = (platform: string): string => {
        const colors: { [key: string]: string } = {
          facebook: "#4267B2",
          twitter: "#000000",
          x: "#000000",
          linkedin: "#0A66C2",
          instagram: "#E4405F",
          pinterest: "#E60023",
          youtube: "#FF0000",
          tiktok: "#000000",
          github: "#333333",
        };
        return colors[platform.toLowerCase()] || "#666666";
      };

      const getSocialIcon = (
        platform: string,
        color: string = "#ffffff",
      ): string => {
        const platformLower = platform.toLowerCase();
        const icons: { [key: string]: string } = {
          facebook: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
          instagram: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.521 17.52c-1.887 1.887-4.401 2.928-7.074 2.928-2.672 0-5.186-1.04-7.074-2.928-1.887-1.887-2.928-4.401-2.928-7.074 0-2.672 1.04-5.186 2.928-7.074 1.887-1.887 4.401-2.928 7.074-2.928 2.672 0 5.186 1.04 7.074 2.928 1.887 1.887 2.928 4.401 2.928 7.074 0 2.672-1.04 5.186-2.928 7.074z"/></svg>`,
          linkedin: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.725-2.004 1.428-.103.25-.129.599-.129.948v5.429h-3.554s.047-8.814 0-9.752h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.61zM5.337 8.855c-1.144 0-1.915-.761-1.915-1.715 0-.955.77-1.715 1.958-1.715 1.187 0 1.927.76 1.927 1.715 0 .954-.74 1.715-1.97 1.715zm1.946 11.597H3.392V9.956h3.891v10.496zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>`,
          youtube: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
          twitter: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.933 6.75h-3.308l7.73-8.835L.424 2.25h6.7l4.78 6.335L17.52 2.25h.724zm-1.04 17.41h1.828L7.04 3.795H5.074L17.204 19.66z"/></svg>`,
          x: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.933 6.75h-3.308l7.73-8.835L.424 2.25h6.7l4.78 6.335L17.52 2.25h.724zm-1.04 17.41h1.828L7.04 3.795H5.074L17.204 19.66z"/></svg>`,
          pinterest: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>`,
          tiktok: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.9 2.9 0 0 1 2.31-4.64 2.74 2.74 0 0 1 .26 0v-3.45a6.47 6.47 0 0 0-.7-.07 6.24 6.24 0 0 0-6.14 7.12 6.24 6.24 0 0 0 6.14 5.43 6.22 6.22 0 0 0 5.82-3.31 2.86 2.86 0 0 0 2.31 1.08A2.92 2.92 0 1 0 19.59 6.69z"/></svg>`,
          github: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
        };
        return icons[platformLower] || "";
      };

      const borderRadius =
        socialBlock.shape === "circle"
          ? "50%"
          : socialBlock.shape === "rounded"
            ? "6px"
            : "2px";

      const getBackgroundColor = (platformName: string): string => {
        if (socialBlock.theme === "colored") {
          return getSocialIconColor(platformName);
        } else if (socialBlock.theme === "outlined") {
          return "transparent";
        }
        return "#f0f0f0";
      };

      const getBorderColor = (platformName: string): string => {
        if (socialBlock.theme === "outlined") {
          return getSocialIconColor(platformName);
        }
        return "transparent";
      };

      const getIconColor = (platformName: string): string => {
        if (socialBlock.theme === "colored") {
          return "#ffffff";
        } else if (socialBlock.theme === "outlined") {
          return getSocialIconColor(platformName);
        }
        return getSocialIconColor(platformName);
      };

      const iconsHtml = socialBlock.platforms
        .map((platform) => {
          const backgroundColor = getBackgroundColor(platform.name);
          const borderColor = getBorderColor(platform.name);
          const iconColor = getIconColor(platform.name);
          const iconHtml = getSocialIcon(platform.icon, iconColor);

          return `<a href="${platform.url}" style="display: inline-flex; align-items: center; justify-content: center; width: ${iconSize + 16}px; height: ${iconSize + 16}px; background-color: ${backgroundColor}; border: 2px solid ${borderColor}; border-radius: ${borderRadius}; margin: 0 ${socialBlock.spacing / 2}px; text-decoration: none; color: ${iconColor}; transition: transform 0.2s;">${iconHtml}</a>`;
        })
        .join("");

      const justifyClass =
        socialBlock.alignment === "left"
          ? "flex-start"
          : socialBlock.alignment === "right"
            ? "flex-end"
            : "center";
      const width =
        socialBlock.widthUnit === "%"
          ? `${socialBlock.width}%`
          : `${socialBlock.width}px`;

      return `<div style="display: flex; justify-content: ${justifyClass}; align-items: center; width: ${width}; padding: ${socialBlock.padding}px; margin: ${socialBlock.margin}px auto; gap: 0;">${iconsHtml}</div>`;
    }
    case "html": {
      const htmlBlock = block as HtmlBlock;
      const sanitized = sanitizeHTML(htmlBlock.content);
      const compiled = compileHTML(sanitized);
      return `<div style="width: ${htmlBlock.width}${htmlBlock.widthUnit}; padding: ${htmlBlock.padding}px; margin: ${htmlBlock.margin}px;">${compiled}</div>`;
    }
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
    case "footer-with-social": {
      const footerWithSocialBlock = block as FooterWithSocialBlock;
      const iconSize =
        footerWithSocialBlock.social.size === "small"
          ? 16
          : footerWithSocialBlock.social.size === "medium"
            ? 24
            : 32;

      const getSocialIconColorFooter = (platform: string): string => {
        const colors: { [key: string]: string } = {
          facebook: "#4267B2",
          twitter: "#000000",
          x: "#000000",
          linkedin: "#0A66C2",
          instagram: "#E4405F",
          pinterest: "#E60023",
          youtube: "#FF0000",
          tiktok: "#000000",
          github: "#333333",
        };
        return colors[platform.toLowerCase()] || "#666666";
      };

      const getSocialIconFooter = (
        platform: string,
        color: string = "#ffffff",
      ): string => {
        const platformLower = platform.toLowerCase();
        const icons: { [key: string]: string } = {
          facebook: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
          instagram: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.521 17.52c-1.887 1.887-4.401 2.928-7.074 2.928-2.672 0-5.186-1.04-7.074-2.928-1.887-1.887-2.928-4.401-2.928-7.074 0-2.672 1.04-5.186 2.928-7.074 1.887-1.887 4.401-2.928 7.074-2.928 2.672 0 5.186 1.04 7.074 2.928 1.887 1.887 2.928 4.401 2.928 7.074 0 2.672-1.04 5.186-2.928 7.074z"/></svg>`,
          linkedin: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.725-2.004 1.428-.103.25-.129.599-.129.948v5.429h-3.554s.047-8.814 0-9.752h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.61zM5.337 8.855c-1.144 0-1.915-.761-1.915-1.715 0-.955.77-1.715 1.958-1.715 1.187 0 1.927.76 1.927 1.715 0 .954-.74 1.715-1.97 1.715zm1.946 11.597H3.392V9.956h3.891v10.496zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>`,
          youtube: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
          twitter: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.933 6.75h-3.308l7.73-8.835L.424 2.25h6.7l4.78 6.335L17.52 2.25h.724zm-1.04 17.41h1.828L7.04 3.795H5.074L17.204 19.66z"/></svg>`,
          x: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.933 6.75h-3.308l7.73-8.835L.424 2.25h6.7l4.78 6.335L17.52 2.25h.724zm-1.04 17.41h1.828L7.04 3.795H5.074L17.204 19.66z"/></svg>`,
          pinterest: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>`,
          tiktok: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.9 2.9 0 0 1 2.31-4.64 2.74 2.74 0 0 1 .26 0v-3.45a6.47 6.47 0 0 0-.7-.07 6.24 6.24 0 0 0-6.14 7.12 6.24 6.24 0 0 0 6.14 5.43 6.22 6.22 0 0 0 5.82-3.31 2.86 2.86 0 0 0 2.31 1.08A2.92 2.92 0 1 0 19.59 6.69z"/></svg>`,
          github: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
        };
        return icons[platformLower] || "";
      };

      const borderRadiusFooter =
        footerWithSocialBlock.social.shape === "circle"
          ? "50%"
          : footerWithSocialBlock.social.shape === "rounded"
            ? "6px"
            : "2px";

      const getBackgroundColorFooter = (platformName: string): string => {
        if (footerWithSocialBlock.social.theme === "colored") {
          return getSocialIconColorFooter(platformName);
        } else if (footerWithSocialBlock.social.theme === "outlined") {
          return "transparent";
        }
        return "#f0f0f0";
      };

      const getBorderColorFooter = (platformName: string): string => {
        if (footerWithSocialBlock.social.theme === "outlined") {
          return getSocialIconColorFooter(platformName);
        }
        return "transparent";
      };

      const getIconColorFooter = (platformName: string): string => {
        if (footerWithSocialBlock.social.theme === "colored") {
          return "#ffffff";
        } else if (footerWithSocialBlock.social.theme === "outlined") {
          return getSocialIconColorFooter(platformName);
        }
        return getSocialIconColorFooter(platformName);
      };

      const socialIconsHtml = footerWithSocialBlock.social.platforms
        .map((platform) => {
          const backgroundColor = getBackgroundColorFooter(platform.name);
          const borderColor = getBorderColorFooter(platform.name);
          const iconColor = getIconColorFooter(platform.name);
          const iconHtml = getSocialIconFooter(platform.icon, iconColor);

          return `<a href="${platform.url}" style="display: inline-flex; align-items: center; justify-content: center; width: ${iconSize + 12}px; height: ${iconSize + 12}px; background-color: ${backgroundColor}; border: 1px solid ${borderColor}; border-radius: ${borderRadiusFooter}; margin: 0 ${footerWithSocialBlock.social.spacing / 2}px; text-decoration: none; color: ${iconColor}; transition: transform 0.2s;">${iconHtml}</a>`;
        })
        .join("");

      const alignmentFooter =
        footerWithSocialBlock.social.alignment === "left"
          ? "flex-start"
          : footerWithSocialBlock.social.alignment === "right"
            ? "flex-end"
            : "center";

      const widthFooter =
        footerWithSocialBlock.social.widthUnit === "%"
          ? `${footerWithSocialBlock.social.width}%`
          : `${footerWithSocialBlock.social.width}px`;

      const enterpriseNameHtml = `<h2 style="margin: 0 0 12px 0; font-size: ${footerWithSocialBlock.enterpriseName.fontSize}px; font-weight: ${footerWithSocialBlock.enterpriseName.fontWeight}; color: ${footerWithSocialBlock.enterpriseName.fontColor}; font-family: ${footerWithSocialBlock.enterpriseName.fontFamily}; font-style: ${footerWithSocialBlock.enterpriseName.fontStyle}; text-align: center;">${footerWithSocialBlock.enterpriseName.content}</h2>`;

      const addressHtml = `<p style="margin: 0 0 12px 0; font-size: ${footerWithSocialBlock.address.fontSize}px; font-weight: ${footerWithSocialBlock.address.fontWeight}; color: ${footerWithSocialBlock.address.fontColor}; font-family: ${footerWithSocialBlock.address.fontFamily}; font-style: ${footerWithSocialBlock.address.fontStyle}; text-align: center; line-height: 1.6;">${footerWithSocialBlock.address.content}</p>`;

      const subscriptionTextHtml = `<p style="margin: 0 0 12px 0; font-size: ${footerWithSocialBlock.subscriptionText.fontSize}px; font-weight: ${footerWithSocialBlock.subscriptionText.fontWeight}; color: ${footerWithSocialBlock.subscriptionText.fontColor}; font-family: ${footerWithSocialBlock.subscriptionText.fontFamily}; font-style: ${footerWithSocialBlock.subscriptionText.fontStyle}; text-align: center;">${footerWithSocialBlock.subscriptionText.content}</p>`;

      const unsubscribeLinkHtml = `<a href="${footerWithSocialBlock.unsubscribeLink.url}" style="font-size: ${footerWithSocialBlock.unsubscribeLink.fontSize}px; font-weight: ${footerWithSocialBlock.unsubscribeLink.fontWeight}; color: ${footerWithSocialBlock.unsubscribeLink.fontColor}; font-family: ${footerWithSocialBlock.unsubscribeLink.fontFamily}; font-style: ${footerWithSocialBlock.unsubscribeLink.fontStyle}; text-decoration: ${footerWithSocialBlock.unsubscribeLink.textDecoration};">${footerWithSocialBlock.unsubscribeLink.text}</a>`;

      return `<footer style="background-color: ${footerWithSocialBlock.backgroundColor}; padding: ${footerWithSocialBlock.padding}px; margin: ${footerWithSocialBlock.margin}px; text-align: ${footerWithSocialBlock.alignment};">
        <div style="display: flex; justify-content: ${alignmentFooter}; align-items: center; width: ${widthFooter}; margin: 0 auto 20px auto; gap: 0;">${socialIconsHtml}</div>
        ${enterpriseNameHtml}
        ${addressHtml}
        ${subscriptionTextHtml}
        <div style="margin-top: 12px;">${unsubscribeLinkHtml}</div>
      </footer>`;
    }
    case "spacer":
      return `<div style="height: ${block.height}px; background-color: ${block.backgroundColor};"></div>`;
    case "centeredImageCard": {
      const cardBlock = block as CenteredImageCardBlock;
      const borderStyle =
        cardBlock.borderWidth > 0
          ? `border: ${cardBlock.borderWidth}px solid ${cardBlock.borderColor};`
          : "";
      return `<div style="background-color: ${cardBlock.backgroundColor}; border-radius: ${cardBlock.borderRadius}px; ${borderStyle} padding: ${cardBlock.padding}px; margin: ${cardBlock.margin}px; max-width: 500px; margin-left: auto; margin-right: auto;">
        <img src="${cardBlock.image}" alt="${cardBlock.imageAlt}" style="width: 100%; height: auto; display: block; border-radius: ${cardBlock.borderRadius}px ${cardBlock.borderRadius}px 0 0;" />
        <div style="text-align: center; padding: 20px;">
          <h2 style="margin: 0 0 12px 0; font-size: 24px; font-weight: bold; color: #000;">${cardBlock.title}</h2>
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #666; line-height: 1.5;">${cardBlock.description}</p>
          <a href="${cardBlock.buttonLink}" style="display: inline-block; background-color: #FF6A00; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">${cardBlock.buttonText}</a>
        </div>
      </div>`;
    }
    case "splitImageCard": {
      const splitBlock = block as SplitImageCardBlock;
      const borderStyle =
        splitBlock.borderWidth > 0
          ? `border: ${splitBlock.borderWidth}px solid ${splitBlock.borderColor};`
          : "";
      const imageSide = splitBlock.imagePosition === "left" ? "45%" : "55%";
      const contentSide = splitBlock.imagePosition === "left" ? "55%" : "45%";
      const direction = splitBlock.imagePosition === "left" ? "ltr" : "rtl";
      const label = splitBlock.label
        ? `<span style="display: inline-block; background-color: #FF6A00; color: #ffffff; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 8px;">${splitBlock.label}</span>`
        : "";
      return `<div style="background-color: ${splitBlock.backgroundColor}; border-radius: ${splitBlock.borderRadius}px; ${borderStyle} margin: ${splitBlock.margin}px; max-width: 600px; margin-left: auto; margin-right: auto; overflow: hidden;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="${imageSide}" style="vertical-align: middle; padding: 20px; text-align: center;">
              <img src="${splitBlock.image}" alt="${splitBlock.imageAlt}" style="width: 100%; height: auto; display: block; border-radius: 4px;" />
            </td>
            <td width="${contentSide}" style="vertical-align: top; padding: 20px;">
              ${label}
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: bold; color: #000;">${splitBlock.title}</h2>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #666; line-height: 1.5; white-space: pre-line;">${splitBlock.description}</p>
              <a href="${splitBlock.buttonLink}" style="display: inline-block; background-color: #FF6A00; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">${splitBlock.buttonText}</a>
            </td>
          </tr>
        </table>
      </div>`;
    }
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
