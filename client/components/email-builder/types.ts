export type BlockType =
  | "text"
  | "title"
  | "image"
  | "video"
  | "button"
  | "dynamicContent"
  | "logo"
  | "social"
  | "html"
  | "divider"
  | "product"
  | "navigation"
  | "spacer"
  | "centeredImageCard"
  | "splitImageCard"
  | "twoColumnCard"
  | "stats"
  | "features";

export interface TitleBlock {
  type: "title";
  id: string;
  content: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  alignment: "left" | "center" | "right";
  fontWeight: "normal" | "bold";
  width: number;
  widthUnit: "px" | "%";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface TextBlock {
  type: "text";
  id: string;
  content: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  alignment: "left" | "center" | "right";
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  width: number;
  widthUnit: "px" | "%";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface ImageBlock {
  type: "image";
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  widthUnit: "px" | "%";
  heightUnit: "px" | "%";
  alignment: "left" | "center" | "right";
  link?: string;
  linkType?: "url" | "page" | "email";
  linkTarget?: string;
  linkTooltip?: string;
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface VideoBlock {
  type: "video";
  id: string;
  src: string;
  thumbnail: string;
  width: number;
  height: number;
  widthUnit: "px" | "%";
  alignment: "left" | "center" | "right";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface DynamicContentBlock {
  type: "dynamicContent";
  id: string;
  fieldName: string;
  placeholder: string;
  backgroundColor: string;
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface LogoBlock {
  type: "logo";
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  widthUnit: "px" | "%";
  alignment: "left" | "center" | "right";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface SocialBlock {
  type: "social";
  id: string;
  platforms: {
    name: string;
    url: string;
    icon: string;
  }[];
  alignment: "left" | "center" | "right";
  size: "small" | "medium" | "large";
  shape: "rounded" | "circle" | "square";
  theme: "colored" | "outlined" | "solid";
  spacing: number;
  width: number;
  widthUnit: "px" | "%";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface HtmlBlock {
  type: "html";
  id: string;
  content: string;
  width: number;
  widthUnit: "px" | "%";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface ProductBlock {
  type: "product";
  id: string;
  image: string;
  title: string;
  description: string;
  price: string;
  buttonText: string;
  buttonLink: string;
  alignment: "left" | "center" | "right";
  imagePosition: "left" | "right" | "center";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface NavigationBlock {
  type: "navigation";
  id: string;
  items: {
    label: string;
    link: string;
  }[];
  backgroundColor: string;
  textColor: string;
  alignment: "left" | "center" | "right";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface ButtonBlock {
  type: "button";
  id: string;
  text: string;
  link: string;
  linkType?: "url" | "page" | "email";
  linkTarget?: string;
  linkTooltip?: string;
  backgroundColor: string;
  textColor: string;
  padding: number;
  margin: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  alignment: "left" | "center" | "right";
  width: number;
  widthUnit: "px" | "%";
  fontSize: number;
  fontWeight: "normal" | "bold";
  visibility: "all" | "desktop" | "mobile";
}

export interface DividerBlock {
  type: "divider";
  id: string;
  color: string;
  height: number;
  margin: number;
  padding: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface HeaderBlock {
  type: "header";
  id: string;
  logo: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  companyName: string;
  companyFontSize: number;
  companyFontColor: string;
  companyFontWeight: "normal" | "bold";
  links: {
    id: string;
    text: string;
    url: string;
  }[];
  linksFontSize: number;
  linksFontColor: string;
  backgroundColor: string;
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  alignment: "left" | "center" | "right";
  visibility: "all" | "desktop" | "mobile";
}

export interface FooterBlock {
  type: "footer";
  id: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  padding: number;
  margin: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface FooterWithSocialBlock {
  type: "footer-with-social";
  id: string;
  social: {
    platforms: {
      name: string;
      url: string;
      icon: string;
    }[];
    size: "small" | "medium" | "large";
    shape: "rounded" | "circle" | "square";
    theme: "colored" | "outlined" | "solid";
    spacing: number;
    alignment: "left" | "center" | "right";
    padding: number;
    margin: number;
    width: number;
    widthUnit: "px" | "%";
  };
  enterpriseName: {
    content: string;
    fontSize: number;
    fontColor: string;
    fontWeight: "normal" | "bold";
    fontFamily: string;
    fontStyle: "normal" | "italic";
    alignment: "left" | "center" | "right";
    padding: number;
    margin: number;
  };
  address: {
    content: string;
    fontSize: number;
    fontColor: string;
    fontWeight: "normal" | "bold";
    fontFamily: string;
    fontStyle: "normal" | "italic";
    alignment: "left" | "center" | "right";
    padding: number;
    margin: number;
  };
  subscriptionText: {
    content: string;
    fontSize: number;
    fontColor: string;
    fontWeight: "normal" | "bold";
    fontFamily: string;
    fontStyle: "normal" | "italic";
    alignment: "left" | "center" | "right";
    padding: number;
    margin: number;
  };
  unsubscribeLink: {
    text: string;
    url: string;
    fontSize: number;
    fontColor: string;
    fontWeight: "normal" | "bold";
    fontFamily: string;
    fontStyle: "normal" | "italic";
    padding: number;
    margin: number;
    textDecoration: "none" | "underline";
  };
  backgroundColor: string;
  padding: number;
  margin: number;
  alignment: "left" | "center" | "right";
  visibility: "all" | "desktop" | "mobile";
}

export interface SpacerBlock {
  type: "spacer";
  id: string;
  height: number;
  backgroundColor: string;
  margin: number;
  borderWidth: number;
  borderColor: string;
  visibility: "all" | "desktop" | "mobile";
}

export interface CenteredImageCardBlock {
  type: "centeredImageCard";
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonLinkType?: "url" | "page" | "email";
  titles?: Array<{ id: string; content: string }>;
  descriptions?: Array<{ id: string; content: string }>;
  buttons?: Array<{ id: string; text: string; link: string }>;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  padding: number;
  margin: number;
  visibility: "all" | "desktop" | "mobile";
  width?: number;
  height?: number;
}

export interface SplitImageCardBlock {
  type: "splitImageCard";
  id: string;
  image: string;
  imageAlt: string;
  label?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonLinkType?: "url" | "page" | "email";
  width?: number;
  height?: number;
  imagePosition: "left" | "right";
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  padding: number;
  margin: number;
  visibility: "all" | "desktop" | "mobile";
}

export interface TwoColumnCardBlock {
  type: "twoColumnCard";
  id: string;
  cards: {
    id: string;
    title: string;
    description: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    padding: number;
    margin: number;
  }[];
  width: number;
  widthUnit: "px" | "%";
  visibility: "all" | "desktop" | "mobile";
}

export interface StatsBlock {
  type: "stats";
  id: string;
  stats: {
    id: string;
    value: string;
    label: string;
    fontSize: number;
    labelFontSize: number;
    textColor: string;
    padding: number;
  }[];
  width: number;
  widthUnit: "px" | "%";
  visibility: "all" | "desktop" | "mobile";
}

export interface FeaturesBlock {
  type: "features";
  id: string;
  features: {
    id: string;
    icon: string;
    title: string;
    description: string;
    fontSize: number;
    titleFontSize: number;
    textColor: string;
    backgroundColor: string;
    padding: number;
    borderRadius: number;
  }[];
  width: number;
  widthUnit: "px" | "%";
  columnsCount: number;
  visibility: "all" | "desktop" | "mobile";
}

export type ContentBlock =
  | TitleBlock
  | TextBlock
  | ImageBlock
  | VideoBlock
  | ButtonBlock
  | DynamicContentBlock
  | LogoBlock
  | SocialBlock
  | HtmlBlock
  | DividerBlock
  | ProductBlock
  | NavigationBlock
  | HeaderBlock
  | FooterBlock
  | FooterWithSocialBlock
  | SpacerBlock
  | CenteredImageCardBlock
  | SplitImageCardBlock
  | TwoColumnCardBlock
  | StatsBlock
  | FeaturesBlock;

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
  backgroundColor: string;
  padding: number;
}

export interface BlockSettings {
  [key: string]: any;
}
