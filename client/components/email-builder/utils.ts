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

export function createImageBlock(
  src = "https://cdn.builder.io/o/assets%2Fa4ae9b84255d41ee86b79eb7d0d252c1%2Feea03b1548cc47089bc55e5e6444e1ec?alt=media&token=34f7628a-143a-42b0-aff9-8e380b3e52aa&apiKey=a4ae9b84255d41ee86b79eb7d0d252c1",
): ImageBlock {
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
    imagePosition: "center",
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
    logoAlt: "Company Logo",
    logoWidth: 40,
    logoHeight: 40,
    companyName: "Your Company",
    companyFontSize: 18,
    companyFontColor: "#000000",
    companyFontWeight: "bold",
    links: [
      { id: generateId(), text: "Sign in", url: "#" },
      { id: generateId(), text: "View Online", url: "#" },
    ],
    linksFontSize: 14,
    linksFontColor: "#666666",
    backgroundColor: "#ffffff",
    padding: 20,
    margin: 0,
    borderWidth: 0,
    borderColor: "#cccccc",
    borderRadius: 0,
    alignment: "center",
    visibility: "all",
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
      "https://cdn.builder.io/o/assets%2Fa4ae9b84255d41ee86b79eb7d0d252c1%2Feea03b1548cc47089bc55e5e6444e1ec?alt=media&token=34f7628a-143a-42b0-aff9-8e380b3e52aa&apiKey=a4ae9b84255d41ee86b79eb7d0d252c1",
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
      "https://cdn.builder.io/o/assets%2Fa4ae9b84255d41ee86b79eb7d0d252c1%2Feea03b1548cc47089bc55e5e6444e1ec?alt=media&token=34f7628a-143a-42b0-aff9-8e380b3e52aa&apiKey=a4ae9b84255d41ee86b79eb7d0d252c1",
    imageAlt: "Card image",
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
    margin: 12,
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

export function createTopImageSectionTemplate(): ContentBlock[] {
  return [createCenteredImageCardBlock()];
}

export function createTwoColumnCardBlock() {
  return {
    type: "twoColumnCard",
    id: generateId(),
    cards: [
      {
        id: generateId(),
        title: "Card Title",
        description: "Add your card description here",
        backgroundColor: "#333333",
        textColor: "#ffffff",
        borderRadius: 8,
        padding: 24,
        margin: 10,
      },
      {
        id: generateId(),
        title: "Card Title",
        description: "Add your card description here",
        backgroundColor: "#333333",
        textColor: "#ffffff",
        borderRadius: 8,
        padding: 24,
        margin: 10,
      },
    ],
    width: 100,
    widthUnit: "%",
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

export function createStatsBlock() {
  return {
    type: "stats",
    id: generateId(),
    stats: [
      {
        id: generateId(),
        value: "4.8",
        label: "Average rating",
        fontSize: 28,
        labelFontSize: 14,
        textColor: "#000000",
        padding: 20,
      },
      {
        id: generateId(),
        value: "120",
        label: "Reviews",
        fontSize: 28,
        labelFontSize: 14,
        textColor: "#000000",
        padding: 20,
      },
      {
        id: generateId(),
        value: "200K",
        label: "Downloads",
        fontSize: 28,
        labelFontSize: 14,
        textColor: "#000000",
        padding: 20,
      },
    ],
    width: 100,
    widthUnit: "%",
    visibility: "all",
  };
}

export function createFeaturesBlock() {
  return {
    type: "features" as const,
    id: generateId(),
    features: [
      {
        id: generateId(),
        icon: "❤️",
        title: "Feature One",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        fontSize: 14,
        titleFontSize: 16,
        textColor: "#000000",
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 8,
      },
      {
        id: generateId(),
        icon: "🎁",
        title: "Feature Two",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        fontSize: 14,
        titleFontSize: 16,
        textColor: "#000000",
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 8,
      },
      {
        id: generateId(),
        icon: "ℹ️",
        title: "Feature Three",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        fontSize: 14,
        titleFontSize: 16,
        textColor: "#000000",
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 8,
      },
    ],
    width: 100,
    widthUnit: "%",
    columnsCount: 3,
    visibility: "all" as const,
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
    case "video": {
      const videoBlock = block as VideoBlock;
      const videoBorder =
        videoBlock.borderWidth > 0
          ? `border: ${videoBlock.borderWidth}px solid ${videoBlock.borderColor};`
          : "";
      const videoDisplay =
        videoBlock.alignment === "left"
          ? "block; margin-right: auto;"
          : videoBlock.alignment === "right"
            ? "block; margin-left: auto;"
            : "block; margin: auto;";
      return `<div style="width: 100%; padding: ${videoBlock.padding}px; margin: ${videoBlock.margin}px; display: ${videoDisplay}"><video width="100%" controls poster="${videoBlock.thumbnail}" style="max-width: 100%; height: auto; border-radius: ${videoBlock.borderRadius}px; display: block; ${videoBorder}"><source src="${videoBlock.src}" type="video/mp4"></video></div>`;
    }
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
          facebook: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.993 4.388 10.954 10.125 11.854v-8.385H7.078V12h3.047V9.41c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953h-1.479c-1.49 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 18.002 24 12c0-6.627-5.373-12-12-12z"/></svg>`,
          instagram: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.756 0 8.331.012 7.052.07 2.696.272.273 2.69.07 7.052.012 8.331 0 8.756 0 12c0 3.244.011 3.668.07 4.948.202 4.358 2.62 6.78 6.98 6.98 1.281.058 1.7.07 4.948.07 3.248 0 3.668-.012 4.948-.07 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.071-1.699.071-4.948 0-3.244-.011-3.668-.07-4.948-.196-4.354-2.617-6.78-6.979-6.98C15.668.012 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.162 12 18.162s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>`,
          linkedin: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.725-2.004 1.428-.103.25-.129.599-.129.948v5.429h-3.554V9.956h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.354zM5.337 8.855c-1.144 0-1.915-.761-1.915-1.715 0-.955.77-1.715 1.958-1.715 1.187 0 1.927.76 1.927 1.715 0 .954-.74 1.715-1.97 1.715zm1.946 11.597H3.392V9.956h3.891v10.496zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>`,
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
    case "twoColumnCard": {
      const twoColBlock = block as any;
      const width = `${twoColBlock.width}${twoColBlock.widthUnit}`;
      const cardsHtml = twoColBlock.cards
        ?.map((card: any) => {
          let imageHtml = "";
          const contentPadding = Math.max(12, card.padding || 16);
          if (card.image) {
            const imageTag = `<img src="${card.image}" alt="${card.imageAlt || ""}" style="width: 100%; height: 100%; display: block; border-radius: ${card.borderRadius}px; object-fit: cover; border: none; cursor: pointer;" />`;
            if (card.imageLink) {
              let href = card.imageLink;
              if (card.imageLinkType === "email") {
                href = `mailto:${card.imageLink}`;
              } else {
                if (!href.startsWith("http")) {
                  href = `https://${href}`;
                }
              }
              const target =
                card.imageLinkType === "email"
                  ? ""
                  : ` target="_blank" rel="noopener noreferrer"`;
              imageHtml = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                  <a href="${href}"${target} style="text-decoration: none; display: block; width: 100%; height: 100%;">
                    ${imageTag}
                  </a>
                </div>`;
            } else {
              imageHtml = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                  ${imageTag}
                </div>`;
            }
          }
          return `<div style="width: 48%; display: inline-block; vertical-align: top; padding-right: 10px; box-sizing: border-box;">
              <div style="background-color: ${card.backgroundColor}; color: ${card.textColor}; border-radius: ${card.borderRadius}px; margin: ${card.margin}px; overflow: hidden; border: none; display: flex; flex-direction: column; height: 400px;">
                <div style="height: 160px; overflow: hidden; flex-shrink: 0;">
                  ${imageHtml}
                </div>
                <div style="padding: ${contentPadding}px; margin: 0; border: none; flex: 1; overflow: hidden;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${card.title}</h3>
                  <p style="margin: 0; font-size: 13px; line-height: 1.4;">${card.description}</p>
                </div>
              </div>
            </div>`;
        })
        .join("");
      return `<div style="width: ${width};"><div style="display: flex; gap: 20px; border: none;">${cardsHtml}</div></div>`;
    }
    case "stats": {
      const statsBlock = block as any;
      const width = `${statsBlock.width}${statsBlock.widthUnit}`;
      const statsHtml = statsBlock.stats
        ?.map((stat: any, index: number) => {
          const borderStyle =
            index !== statsBlock.stats.length - 1
              ? "border-right: 1px solid #e0e0e0;"
              : "";
          return `<div style="width: 33%; display: inline-block; vertical-align: top; text-align: center; padding: ${stat.padding}px; box-sizing: border-box; ${borderStyle}">
              <h3 style="margin: 0 0 8px 0; font-size: ${stat.fontSize}px; font-weight: bold; color: ${stat.textColor};">${stat.value}</h3>
              <p style="margin: 0; font-size: ${stat.labelFontSize}px; color: #666;">${stat.label}</p>
            </div>`;
        })
        .join("");
      return `<div style="width: ${width}; margin: 20px 0;">${statsHtml}</div>`;
    }
    case "features": {
      const featuresBlock = block as any;
      const width = `${featuresBlock.width}${featuresBlock.widthUnit}`;
      const featuresHtml = featuresBlock.features
        ?.map((feature: any) => {
          return `<div style="flex: 1; min-width: 0; text-align: center; padding: 0 10px; box-sizing: border-box;">
              <div style="background-color: ${feature.backgroundColor}; border-radius: ${feature.borderRadius}px; padding: ${feature.padding}px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); height: 100%;">
                <div style="font-size: 32px; margin-bottom: 12px; line-height: 1;">${feature.icon}</div>
                <h3 style="margin: 0 0 8px 0; font-size: ${feature.titleFontSize}px; font-weight: bold; color: ${feature.textColor};">${feature.title}</h3>
                <p style="margin: 0; font-size: ${feature.fontSize}px; color: ${feature.textColor}; line-height: 1.5;">${feature.description}</p>
              </div>
            </div>`;
        })
        .join("");
      return `<div style="width: ${width}; margin: 20px 0; display: flex; flex-wrap: nowrap; gap: 0; align-items: stretch;">${featuresHtml}</div>`;
    }
    case "divider":
      return `<hr style="border: none; border-top: ${block.height}px solid ${block.color}; margin: ${block.margin}px 0;" />`;
    case "product": {
      const productBlock = block as ProductBlock;
      const productBorder =
        productBlock.borderWidth > 0
          ? `border: ${productBlock.borderWidth}px solid ${productBlock.borderColor};`
          : "border: 1px solid #ddd;";
      const imageJustify =
        productBlock.imagePosition === "left"
          ? "flex-start"
          : productBlock.imagePosition === "right"
            ? "flex-end"
            : "center";
      const contentJustify =
        productBlock.alignment === "left"
          ? "flex-start"
          : productBlock.alignment === "right"
            ? "flex-end"
            : "center";
      return `<div style="padding: ${productBlock.padding}px; margin: ${productBlock.margin}px; border-radius: ${productBlock.borderRadius}px; ${productBorder} background-color: #ffffff;">
        <div style="display: flex; justify-content: ${imageJustify}; margin-bottom: 12px;">
          <img src="${productBlock.image}" alt="${productBlock.title}" style="max-width: 300px; height: auto; border-radius: 4px;" />
        </div>
        <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 8px 0; color: #333; text-align: ${productBlock.alignment};">${productBlock.title}</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 12px 0; line-height: 1.5; text-align: ${productBlock.alignment};">${productBlock.description}</p>
        <p style="font-size: 16px; font-weight: bold; color: #FF6A00; margin: 0 0 16px 0; text-align: ${productBlock.alignment};">${productBlock.price}</p>
        <div style="display: flex; justify-content: ${contentJustify};">
          <a href="${productBlock.buttonLink}" style="background-color: #FF6A00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 14px; font-weight: bold;">${productBlock.buttonText}</a>
        </div>
      </div>`;
    }
    case "navigation":
      return `<nav style="background-color: ${block.backgroundColor}; padding: 10px 0; text-align: ${block.alignment};"><a href="#" style="color: ${block.textColor}; margin: 0 15px; text-decoration: none;">Link</a></nav>`;
    case "header": {
      const headerBlock = block as HeaderBlock;
      const linksHtml = headerBlock.links
        .map(
          (link, index) =>
            `<a href="${link.url}" style="color: ${headerBlock.linksFontColor}; text-decoration: none; font-size: ${headerBlock.linksFontSize}px; margin: 0 5px;">${link.text}</a>${
              index < headerBlock.links.length - 1
                ? `<span style="color: ${headerBlock.linksFontColor}; margin: 0 5px;">|</span>`
                : ""
            }`,
        )
        .join("");

      return `<div style="display: flex; align-items: center; justify-content: space-between; background-color: ${headerBlock.backgroundColor}; padding: ${headerBlock.padding}px; margin: ${headerBlock.margin}px; border-width: ${headerBlock.borderWidth}px; border-color: ${headerBlock.borderColor}; border-radius: ${headerBlock.borderRadius}px;">
        <div style="flex-shrink: 0;">
          ${
            headerBlock.logo
              ? `<img src="${headerBlock.logo}" alt="${headerBlock.logoAlt}" style="width: ${headerBlock.logoWidth}px; height: ${headerBlock.logoHeight}px; object-fit: contain;" />`
              : ""
          }
        </div>
        <div style="flex-grow: 1; text-align: center; padding: 0 20px;">
          <span style="font-size: ${headerBlock.companyFontSize}px; color: ${headerBlock.companyFontColor}; font-weight: ${headerBlock.companyFontWeight};">${headerBlock.companyName}</span>
        </div>
        <div style="flex-shrink: 0;">
          ${linksHtml}
        </div>
      </div>`;
    }
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
          facebook: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.993 4.388 10.954 10.125 11.854v-8.385H7.078V12h3.047V9.41c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953h-1.479c-1.49 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 18.002 24 12c0-6.627-5.373-12-12-12z"/></svg>`,
          instagram: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.756 0 8.331.012 7.052.07 2.696.272.273 2.69.07 7.052.012 8.331 0 8.756 0 12c0 3.244.011 3.668.07 4.948.202 4.358 2.62 6.78 6.98 6.98 1.281.058 1.7.07 4.948.07 3.248 0 3.668-.012 4.948-.07 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.071-1.699.071-4.948 0-3.244-.011-3.668-.07-4.948-.196-4.354-2.617-6.78-6.979-6.98C15.668.012 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.162 12 18.162s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>`,
          linkedin: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.725-2.004 1.428-.103.25-.129.599-.129.948v5.429h-3.554V9.956h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.354zM5.337 8.855c-1.144 0-1.915-.761-1.915-1.715 0-.955.77-1.715 1.958-1.715 1.187 0 1.927.76 1.927 1.715 0 .954-.74 1.715-1.97 1.715zm1.946 11.597H3.392V9.956h3.891v10.496zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>`,
          youtube: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
          twitter: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.933 6.75h-3.308l7.73-8.835L.424 2.25h6.7l4.78 6.335L17.52 2.25h.724zm-1.04 17.41h1.828L7.04 3.795H5.074L17.204 19.66z"/></svg>`,
          x: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.933 6.75h-3.308l7.73-8.835L.424 2.25h6.7l4.78 6.335L17.52 2.25h.724zm-1.04 17.41h1.828L7.04 3.795H5.074L17.204 19.66z"/></svg>`,
          pinterest: `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="12" r="11" fill="none" stroke="${color}" strokeWidth="1"/><path d="M12 2.5a9.5 9.5 0 0 0-7.17 15.62 9.5 9.5 0 0 0 14.34-.02A9.5 9.5 0 0 0 12 2.5zm-3.17 10.82c0-1.1.9-2 2-2 1.1 0 2 .9 2 2 0 .8-.5 1.5-1.2 1.8.2-.3.4-.6.4-1 0-.7-.6-1.2-1.2-1.2s-1.2.5-1.2 1.2c0 .4.2.7.4 1-.7-.3-1.2-1-1.2-1.8z"/></svg>`,
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
      return `<div style="background-color: ${cardBlock.backgroundColor}; border-radius: ${cardBlock.borderRadius}px; ${borderStyle} padding: ${cardBlock.padding}px; margin: ${cardBlock.margin}px; max-width: 600px; margin-left: auto; margin-right: auto;">
        <img src="${cardBlock.image}" alt="${cardBlock.imageAlt}" style="width: 100%; height: 300px; object-fit: cover; display: block; border-radius: ${cardBlock.borderRadius}px ${cardBlock.borderRadius}px 0 0;" />
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

      // Create content cell HTML
      const contentCell = `<td width="${contentSide}" style="vertical-align: top; padding: 15px;">
        <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: bold; color: #000;">${splitBlock.title}</h2>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #666; line-height: 1.5; white-space: pre-line;">${splitBlock.description}</p>
        <a href="${splitBlock.buttonLink}" style="display: inline-block; background-color: #FF6A00; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">${splitBlock.buttonText}</a>
      </td>`;

      // Create image cell HTML
      const imageCell = `<td width="${imageSide}" style="vertical-align: middle; padding: 15px; text-align: center;">
        <img src="${splitBlock.image}" alt="${splitBlock.imageAlt}" style="width: 100%; height: 250px; object-fit: cover; display: block; border-radius: 4px;" />
      </td>`;

      // Arrange cells based on imagePosition
      const cells =
        splitBlock.imagePosition === "left"
          ? imageCell + contentCell
          : contentCell + imageCell;

      return `<div style="background-color: ${splitBlock.backgroundColor}; border-radius: ${splitBlock.borderRadius}px; ${borderStyle} margin: ${splitBlock.margin}px; max-width: 600px; margin-left: auto; margin-right: auto; overflow: hidden;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            ${cells}
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
  try {
    const templates = getTemplatesFromLocalStorage();
    const index = templates.findIndex((t) => t.id === template.id);
    if (index > -1) {
      templates[index] = template;
    } else {
      templates.push(template);
    }
    localStorage.setItem("email_templates", JSON.stringify(templates));
  } catch (error) {
    if ((error as any).name === "QuotaExceededError") {
      console.error(
        "❌ Storage quota exceeded! Images may be too large. Try removing some images or using smaller file sizes.",
      );
    } else {
      console.error("❌ Failed to save template:", error);
    }
  }
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
