import React, { useState } from "react";
import { FooterWithSocialBlock } from "../types";
import { SocialBlockComponent } from "./SocialBlockComponent";

interface FooterWithSocialBlockComponentProps {
  block: FooterWithSocialBlock;
  isSelected: boolean;
  selectedElement?: string | null;
  onContentChange: (field: string, value: any) => void;
  onSocialUpdate: (social: any) => void;
  onElementSelect?: (element: string) => void;
}

export const FooterWithSocialBlockComponent: React.FC<
  FooterWithSocialBlockComponentProps
> = ({
  block,
  isSelected,
  selectedElement,
  onContentChange,
  onSocialUpdate,
  onElementSelect,
}) => {
  const handleFieldChange = (
    field: keyof typeof block,
    subField: string,
    value: string,
  ) => {
    const updatedField = { ...block[field], [subField]: value };
    onContentChange(field, updatedField);
  };

  const handleSocialChange = (socialData: any) => {
    onSocialUpdate(socialData);
  };

  return (
    <footer
      className={`transition-all ${isSelected ? "ring-2 ring-valasys-orange" : ""}`}
      style={{
        backgroundColor: block.backgroundColor,
        padding: `${block.padding}px`,
        textAlign: block.alignment as any,
      }}
    >
      <div className="space-y-4">
        {/* Social Media Section */}
        <div
          onClick={() => onElementSelect?.("social")}
          className={`py-4 px-2 cursor-pointer hover:bg-gray-50 rounded transition-all ${
            selectedElement === "social" ? "ring-2 ring-valasys-orange" : ""
          }`}
          style={{
            width:
              block.social.widthUnit === "%"
                ? `${block.social.width}%`
                : `${block.social.width}px`,
            margin:
              block.social.alignment === "center"
                ? "0 auto"
                : block.social.alignment === "right"
                  ? "0 0 0 auto"
                  : undefined,
          }}
        >
          <div
            className={`flex flex-wrap gap-2`}
            style={{
              justifyContent:
                block.social.alignment === "left"
                  ? "flex-start"
                  : block.social.alignment === "center"
                    ? "center"
                    : "flex-end",
            }}
          >
            {block.social.platforms.map((platform, index) => {
              const iconColor = getIconColor(platform.icon);
              const iconBg = getIconBackgroundColor(
                block.social.theme,
                platform.icon,
              );

              const sizeMap = {
                small: "w-5 h-5",
                medium: "w-6 h-6",
                large: "w-8 h-8",
              };

              const shapeClasses = {
                rounded: "rounded-md",
                circle: "rounded-full",
                square: "rounded-none",
              };

              return (
                <a
                  key={index}
                  href={platform.url}
                  className={`${sizeMap[block.social.size]} ${shapeClasses[block.social.shape]} flex items-center justify-center transition-transform hover:scale-110`}
                  style={{
                    backgroundColor: iconBg,
                    color: iconColor,
                    marginRight:
                      index < block.social.platforms.length - 1
                        ? `${block.social.spacing}px`
                        : "0",
                  }}
                >
                  {getSocialIcon(platform.icon, iconColor)}
                </a>
              );
            })}
          </div>
        </div>

        {/* Enterprise Name */}
        <div
          className={`cursor-pointer hover:bg-gray-50 rounded p-2 transition-all ${
            selectedElement === "enterpriseName"
              ? "ring-2 ring-valasys-orange"
              : ""
          }`}
          onClick={() => onElementSelect?.("enterpriseName")}
        >
          {selectedElement === "enterpriseName" ? (
            <input
              type="text"
              value={block.enterpriseName.content}
              onChange={(e) =>
                handleFieldChange("enterpriseName", "content", e.target.value)
              }
              onBlur={() => onElementSelect?.(null)}
              autoFocus
              className="w-full border border-valasys-orange rounded px-2 py-1 text-center"
              style={{
                fontSize: `${block.enterpriseName.fontSize}px`,
                fontWeight: block.enterpriseName.fontWeight,
                color: block.enterpriseName.fontColor,
              }}
            />
          ) : (
            <h3
              style={{
                fontSize: `${block.enterpriseName.fontSize}px`,
                fontWeight: block.enterpriseName.fontWeight,
                color: block.enterpriseName.fontColor,
                fontFamily: block.enterpriseName.fontFamily,
                fontStyle: block.enterpriseName.fontStyle,
                margin: 0,
                padding: `${block.enterpriseName.padding}px`,
              }}
            >
              {block.enterpriseName.content}
            </h3>
          )}
        </div>

        {/* Address */}
        <div
          className={`cursor-pointer hover:bg-gray-50 rounded p-2 transition-all ${
            selectedElement === "address" ? "ring-2 ring-valasys-orange" : ""
          }`}
          onClick={() => onElementSelect?.("address")}
        >
          {selectedElement === "address" ? (
            <textarea
              value={block.address.content}
              onChange={(e) =>
                handleFieldChange("address", "content", e.target.value)
              }
              onBlur={() => onElementSelect?.(null)}
              autoFocus
              className="w-full border border-valasys-orange rounded px-2 py-1 text-center"
              style={{
                fontSize: `${block.address.fontSize}px`,
                fontWeight: block.address.fontWeight,
                color: block.address.fontColor,
              }}
              rows={2}
            />
          ) : (
            <p
              style={{
                fontSize: `${block.address.fontSize}px`,
                fontWeight: block.address.fontWeight,
                color: block.address.fontColor,
                fontFamily: block.address.fontFamily,
                fontStyle: block.address.fontStyle,
                margin: 0,
                padding: `${block.address.padding}px`,
                lineHeight: "1.6",
              }}
            >
              {block.address.content}
            </p>
          )}
        </div>

        {/* Subscription Text */}
        <div
          className={`cursor-pointer hover:bg-gray-50 rounded p-2 transition-all ${
            selectedElement === "subscriptionText"
              ? "ring-2 ring-valasys-orange"
              : ""
          }`}
          onClick={() => onElementSelect?.("subscriptionText")}
        >
          {selectedElement === "subscriptionText" ? (
            <textarea
              value={block.subscriptionText.content}
              onChange={(e) =>
                handleFieldChange("subscriptionText", "content", e.target.value)
              }
              onBlur={() => onElementSelect?.(null)}
              autoFocus
              className="w-full border border-valasys-orange rounded px-2 py-1 text-center"
              style={{
                fontSize: `${block.subscriptionText.fontSize}px`,
                fontWeight: block.subscriptionText.fontWeight,
                color: block.subscriptionText.fontColor,
              }}
              rows={2}
            />
          ) : (
            <p
              style={{
                fontSize: `${block.subscriptionText.fontSize}px`,
                fontWeight: block.subscriptionText.fontWeight,
                color: block.subscriptionText.fontColor,
                fontFamily: block.subscriptionText.fontFamily,
                fontStyle: block.subscriptionText.fontStyle,
                margin: 0,
                padding: `${block.subscriptionText.padding}px`,
              }}
            >
              {block.subscriptionText.content}
            </p>
          )}
        </div>

        {/* Unsubscribe Link */}
        <div
          className={`cursor-pointer hover:bg-gray-50 rounded p-2 transition-all ${
            selectedElement === "unsubscribeLink"
              ? "ring-2 ring-valasys-orange"
              : ""
          }`}
          onClick={() => onElementSelect?.("unsubscribeLink")}
        >
          {selectedElement === "unsubscribeLink" ? (
            <div className="space-y-2">
              <input
                type="text"
                value={block.unsubscribeLink.text}
                onChange={(e) =>
                  handleFieldChange("unsubscribeLink", "text", e.target.value)
                }
                placeholder="Link text"
                className="w-full border border-valasys-orange rounded px-2 py-1 text-sm"
              />
              <input
                type="url"
                value={block.unsubscribeLink.url}
                onChange={(e) =>
                  handleFieldChange("unsubscribeLink", "url", e.target.value)
                }
                placeholder="https://"
                className="w-full border border-valasys-orange rounded px-2 py-1 text-sm"
              />
            </div>
          ) : (
            <a
              href={block.unsubscribeLink.url}
              style={{
                fontSize: `${block.unsubscribeLink.fontSize}px`,
                fontWeight: block.unsubscribeLink.fontWeight,
                color: block.unsubscribeLink.fontColor,
                fontFamily: block.unsubscribeLink.fontFamily,
                fontStyle: block.unsubscribeLink.fontStyle,
                padding: `${block.unsubscribeLink.padding}px`,
                textDecoration: block.unsubscribeLink.textDecoration,
              }}
            >
              {block.unsubscribeLink.text}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

function getIconColor(platform: string): string {
  const colorMap: { [key: string]: string } = {
    facebook: "#4267B2",
    instagram: "#E4405F",
    linkedin: "#0A66C2",
    youtube: "#FF0000",
    twitter: "#000000",
    pinterest: "#E60023",
    tiktok: "#000000",
    github: "#333333",
  };
  return colorMap[platform] || "#666666";
}

function getIconBackgroundColor(theme: string, platform: string): string {
  if (theme === "colored") {
    return getIconColor(platform);
  } else if (theme === "outlined") {
    return "transparent";
  } else if (theme === "solid") {
    return "#333333";
  }
  return "#ffffff";
}

function getSocialIcon(
  platform: string,
  color: string = "#ffffff",
): React.ReactNode {
  const iconMap: { [key: string]: React.ReactNode } = {
    facebook: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={color}
        style={{ display: "block" }}
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={color}
        style={{ display: "block" }}
      >
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.521 17.52c-1.887 1.887-4.401 2.928-7.074 2.928-2.672 0-5.186-1.04-7.074-2.928-1.887-1.887-2.928-4.401-2.928-7.074 0-2.672 1.04-5.186 2.928-7.074 1.887-1.887 4.401-2.928 7.074-2.928 2.672 0 5.186 1.04 7.074 2.928 1.887 1.887 2.928 4.401 2.928 7.074 0 2.672-1.04 5.186-2.928 7.074z" />
      </svg>
    ),
    linkedin: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={color}
        style={{ display: "block" }}
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.725-2.004 1.428-.103.25-.129.599-.129.948v5.429h-3.554s.047-8.814 0-9.752h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.61zM5.337 8.855c-1.144 0-1.915-.761-1.915-1.715 0-.955.77-1.715 1.958-1.715 1.187 0 1.927.76 1.927 1.715 0 .954-.74 1.715-1.97 1.715zm1.946 11.597H3.392V9.956h3.891v10.496zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
    youtube: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={color}
        style={{ display: "block" }}
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    twitter: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={color}
        style={{ display: "block" }}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.933 6.75h-3.308l7.73-8.835L.424 2.25h6.7l4.78 6.335L17.52 2.25h.724zm-1.04 17.41h1.828L7.04 3.795H5.074L17.204 19.66z" />
      </svg>
    ),
    pinterest: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={color}
        style={{ display: "block" }}
      >
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
    tiktok: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={color}
        style={{ display: "block" }}
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.9 2.9 0 0 1 2.31-4.64 2.74 2.74 0 0 1 .26 0v-3.45a6.47 6.47 0 0 0-.7-.07 6.24 6.24 0 0 0-6.14 7.12 6.24 6.24 0 0 0 6.14 5.43 6.22 6.22 0 0 0 5.82-3.31 2.86 2.86 0 0 0 2.31 1.08A2.92 2.92 0 1 0 19.59 6.69z" />
      </svg>
    ),
    github: (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={color}
        style={{ display: "block" }}
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  };
  return iconMap[platform] || null;
}
