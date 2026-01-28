import React, { ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "react-router-dom";
import { Link } from "@/lib/utils";
import {
  User,
  Menu,
  X,
  LayoutDashboard,
  Bot,
  Target,
  Users,
  BarChart3,
  Megaphone,
  Bell,
  Settings,
  HelpCircle,
  Ticket,
  LogOut,
  CreditCard,
  UserCog,
  Search,
  Crown,
  PlusCircle,
  Play,
  RotateCcw,
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  MoreHorizontal,
  Plug,
  ChevronDown,
  Lock,
  Heart,
  Mail,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DraggableChatSupport } from "@/components/ui/draggable-chat-support";
import TrialProgressBar from "@/components/ui/trial-progress-bar";
import TrialBanner from "@/components/ui/trial-banner";
import TrialBadgeDropdown from "@/components/ui/trial-badge-dropdown";
import OnboardingSkipBadge from "@/components/layout/OnboardingSkipBadge";
import { useTour } from "@/contexts/TourContext";
import PlatformTour from "@/components/tour/PlatformTour";
import MasteryBottomBar from "@/components/layout/MasteryBottomBar";
import MasteryProgressBadge from "@/components/layout/MasteryProgressBadge";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Core navigation items for the middle section
const coreNavigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    tourId: "dashboard-nav",
  },
  { name: "VAIS Results", href: "/build-vais", icon: Bot, tourId: "vais-nav" },
  { name: "ABM/LAL", href: "/abm-lal", icon: Target, tourId: "abm-nav" },
  {
    name: "Find Prospect",
    href: "/find-prospect",
    icon: Search,
    tourId: "prospect-nav",
    submenu: [
      {
        name: "Favorites Prospects",
        href: "/favorites-prospects",
        icon: Heart,
        tourId: "favorites-nav",
      },
    ],
  },
  {
    name: "Build My Campaign",
    href: "/build-my-campaign",
    icon: Megaphone,
    tourId: "my-campaign-nav",
  },
  {
    name: "Reports",
    href: "/analytics",
    icon: BarChart3,
    tourId: "reports-nav",
  },
];

// Utility items for the bottom section
const utilityItems = [
  {
    name: "Downloaded List",
    href: "/my-downloads",
    icon: Download,
    tourId: "downloads-nav",
  },
  {
    name: "Templates",
    href: "/templates",
    icon: Mail,
    tourId: "templates-nav",
  },
  {
    name: "Landing Pages",
    href: "/landing-pages",
    icon: Layers,
    tourId: "landing-pages-nav",
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: Plug,
    tourId: "integrations-nav",
  },
  {
    name: "Manage Users",
    href: "/manage-users",
    icon: Users,
    tourId: "users-nav",
  },
  {
    name: "Support Ticket",
    href: "/support",
    icon: Ticket,
    tourId: "support-nav",
  },
  { name: "FAQs", href: "/faqs", icon: HelpCircle, tourId: "faqs-nav" },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    tourId: "settings-nav",
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start with sidebar closed on mobile
  const [unreadNotifications] = useState(3); // Mock unread count
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const isExpanded = sidebarOpen || hoverExpanded;

  // Ensure sidebar starts collapsed on all screens
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  const [chatOpen, setChatOpen] = useState(false);

  // Tooltip state for disabled Manage Users item (rendered via portal outside sidebar)
  const [manageUsersTooltipVisible, setManageUsersTooltipVisible] =
    useState(false);
  const [manageUsersTooltipPos, setManageUsersTooltipPos] = useState({
    left: 0,
    top: 0,
  });

  // Contact Sales dialog
  const [showContactSalesDialog, setShowContactSalesDialog] = useState(false);

  // Favorites and submenu state
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const [hasFavorites, setHasFavorites] = useState(false);
  const [masteryMinimized, setMasteryMinimized] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("valasys-mastery-minimized") === "1";
    } catch (error) {
      return false;
    }
  });
  const [masteryPercent, setMasteryPercent] = useState(0);

  useEffect(() => {
    const checkFavorites = () => {
      try {
        const raw = localStorage.getItem("prospect:favorites");
        const favorites = raw ? (JSON.parse(raw) as string[]) : [];
        setHasFavorites(favorites.length > 0);
      } catch {
        setHasFavorites(false);
      }
    };

    checkFavorites();
    const handleStorageChange = () => checkFavorites();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "app:favorites-updated",
      handleStorageChange as EventListener,
    );

    const handleMasteryMinimized = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setMasteryPercent(detail?.percent || 0);
      setMasteryMinimized(true);
    };

    window.addEventListener(
      "app:mastery-minimized",
      handleMasteryMinimized as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "app:favorites-updated",
        handleStorageChange as EventListener,
      );
      window.removeEventListener(
        "app:mastery-minimized",
        handleMasteryMinimized as EventListener,
      );
    };
  }, []);

  const showManageUsersTooltip = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    setManageUsersTooltipPos({
      left: rect.left + rect.width / 2,
      top: rect.bottom + 12,
    });
    setManageUsersTooltipVisible(true);
  };
  const hideManageUsersTooltip = () => setManageUsersTooltipVisible(false);

  // Mock notification data
  const notifications = [
    {
      id: 1,
      title: "VAIS Campaign Completed",
      message:
        "Your 'Enterprise Software Q3' campaign has been successfully processed with 1,247 prospects identified.",
      time: "2 minutes ago",
      type: "success",
      unread: true,
      icon: "✅",
    },
    {
      id: 2,
      title: "Credit Usage Alert",
      message:
        "You have used 85% of your monthly credits. Consider upgrading your plan.",
      time: "1 hour ago",
      type: "warning",
      unread: true,
      icon: "⚠️",
    },
    {
      id: 3,
      title: "New Feature Available",
      message:
        "Check out our new Intent Signal Analytics dashboard for deeper insights.",
      time: "3 hours ago",
      type: "info",
      unread: true,
      icon: "��",
    },
    {
      id: 4,
      title: "Weekly Report Ready",
      message: "Your weekly performance report is ready for download.",
      time: "1 day ago",
      type: "info",
      unread: false,
      icon: "📊",
    },
    {
      id: 5,
      title: "Support Ticket Update",
      message: "Your support ticket #12345 has been resolved.",
      time: "2 days ago",
      type: "success",
      unread: false,
      icon: "🎫",
    },
  ];

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    // In a real app, this would make an API call
    console.log("Marking all notifications as read");
  };

  const [chatMinimized, setChatMinimized] = useState(true);
  const [profileInfo, setProfileInfo] = useState<{
    avatarUrl?: string | null;
    fullName?: string;
    email?: string;
  }>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("app.profile");
      if (raw) setProfileInfo(JSON.parse(raw));
    } catch {}
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setProfileInfo(detail || {});
    };
    window.addEventListener("app:profile-updated", onUpdate as EventListener);
    return () =>
      window.removeEventListener(
        "app:profile-updated",
        onUpdate as EventListener,
      );
  }, []);

  const {
    isTourOpen,
    hasCompletedTour,
    startTour,
    closeTour,
    completeTour,
    resetTour,
  } = useTour();

  const getCurrentPageTitle = () => {
    const currentItem =
      coreNavigationItems.find((item) => item.href === location.pathname) ||
      utilityItems.find((item) => item.href === location.pathname);
    return currentItem?.name || "Dashboard";
  };

  const handleChatToggle = () => {
    if (chatMinimized) {
      setChatMinimized(false);
      setChatOpen(true);
    } else {
      setChatMinimized(true);
      setChatOpen(false);
    }
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setChatMinimized(true);
  };

  const handleRestoreMastery = () => {
    try {
      localStorage.removeItem("valasys-mastery-minimized");
    } catch (error) {}
    setMasteryMinimized(false);
    window.dispatchEvent(new Event("app:mastery-restored"));
  };

  const handleMobileNavigationClick = () => {
    // Close sidebar on mobile when navigating
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleNavigationClick = (_item: { href: string }, _e: any) => {
    handleMobileNavigationClick();
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-valasys-gray-50 flex">
      {/* Mobile Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div
        data-tour="sidebar"
        onMouseEnter={() => window.innerWidth >= 1024 && setHoverExpanded(true)}
        onMouseLeave={() => setHoverExpanded(false)}
        className={cn(
          "bg-white shadow-lg border-r border-valasys-gray-200 transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen z-50",
          // Mobile: Hidden by default, overlay when open
          "lg:translate-x-0",
          isExpanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop: Always visible with width changes
          "lg:w-64 lg:block",
          !isExpanded && "lg:w-16",
          isExpanded ? "overflow-y-auto" : "overflow-y-hidden",
          "w-64",
        )}
      >
        {/* Sidebar Header with Toggle */}
        <div className="p-4 border-b border-valasys-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between relative">
            <div
              className={cn(
                "flex items-center space-x-2 transition-opacity duration-200",
                isExpanded ? "opacity-100" : "opacity-0 lg:opacity-0",
              )}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VS</span>
              </div>
              {isExpanded && (
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F779c4bd1963348a29b51eaa91e7f14a3%2Ff883da05f6274db597c569f0757e04d8?format=webp&width=800"
                  alt="Valasys AI Score"
                  className="h-6 w-auto"
                />
              )}
            </div>
            {!isExpanded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F779c4bd1963348a29b51eaa91e7f14a3%2Fc3dbbd3b7c1542d28bba7c96a6572970?format=webp&width=800"
                  alt="VM Logo"
                  className="h-8 w-auto"
                />
              </div>
            )}
            {/* Desktop-only toggle button moved to header; hide here to avoid duplication */}
            <div className="hidden"></div>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8 p-0 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Core Navigation Section */}
          <nav className="p-4">
            <div
              className={cn(
                "mb-3 text-xs font-semibold text-valasys-gray-500 uppercase tracking-wide",
                isExpanded ? "block" : "hidden lg:hidden",
              )}
            >
              Navigation
            </div>
            <ul className="space-y-1">
              {coreNavigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                const IconComponent = item.icon;
                const isSubmenuOpen = expandedSubmenu === item.name;
                const hasSubmenu =
                  "submenu" in item && item.submenu && item.submenu.length > 0;

                return (
                  <li key={item.name}>
                    <div
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                        !isExpanded && "justify-center",
                        isActive
                          ? "bg-valasys-orange text-white shadow-sm"
                          : "text-valasys-gray-600 hover:text-valasys-gray-900 hover:bg-valasys-gray-100",
                      )}
                      title={!isExpanded ? item.name : undefined}
                    >
                      {isExpanded ? (
                        <IconComponent
                          className={cn(
                            "w-4 h-4 flex-shrink-0 mr-3",
                            isActive ? "text-white" : "text-valasys-gray-500",
                          )}
                        />
                      ) : (
                        <div
                          className={cn(
                            "w-10 h-10 rounded-md flex items-center justify-center",
                            isActive
                              ? "bg-valasys-orange text-white shadow-sm"
                              : "bg-valasys-gray-100 text-valasys-gray-600 group-hover:bg-valasys-gray-200",
                          )}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                      )}
                      {isExpanded && (
                        <>
                          <Link
                            to={item.href}
                            data-tour={item.tourId}
                            onClick={(e) => handleNavigationClick(item, e)}
                            className="truncate flex-1"
                          >
                            {item.name}
                          </Link>
                          {hasSubmenu && (
                            <button
                              onClick={() =>
                                setExpandedSubmenu(
                                  isSubmenuOpen ? null : item.name,
                                )
                              }
                              className="ml-auto p-1 hover:bg-white/10 rounded transition-colors"
                              aria-label={
                                isSubmenuOpen
                                  ? "Collapse submenu"
                                  : "Expand submenu"
                              }
                            >
                              <ChevronDown
                                className={cn(
                                  "w-4 h-4 transition-transform",
                                  isSubmenuOpen && "rotate-180",
                                  isActive
                                    ? "text-white"
                                    : "text-valasys-gray-500",
                                )}
                              />
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {hasSubmenu && isExpanded && isSubmenuOpen && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-valasys-gray-200 pl-0">
                        {item.submenu!.map((submenuItem) => {
                          const isSubmenuActive =
                            location.pathname === submenuItem.href;
                          const SubMenuIconComponent = submenuItem.icon;

                          return (
                            <li key={submenuItem.name}>
                              <Link
                                to={submenuItem.href}
                                data-tour={submenuItem.tourId}
                                onClick={(e) =>
                                  handleNavigationClick(submenuItem, e)
                                }
                                className={cn(
                                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                                  isSubmenuActive
                                    ? "bg-valasys-orange text-white shadow-sm"
                                    : "text-valasys-gray-600 hover:text-valasys-gray-900 hover:bg-valasys-gray-100",
                                )}
                                title={submenuItem.name}
                              >
                                <SubMenuIconComponent
                                  className={cn(
                                    "w-4 h-4 flex-shrink-0 mr-3",
                                    isSubmenuActive
                                      ? "text-white"
                                      : "text-valasys-gray-500",
                                  )}
                                />
                                <span className="truncate">
                                  {submenuItem.name}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Utility Features Section */}
          <div className="p-4 border-t border-valasys-gray-200">
            <div
              className={cn(
                "mb-3 text-xs font-semibold text-valasys-gray-500 uppercase tracking-wide",
                isExpanded ? "block" : "hidden lg:hidden",
              )}
            >
              Utilities
            </div>
            <ul className="space-y-1">
              {utilityItems.map((item) => {
                const isActive = location.pathname === item.href;
                const IconComponent = item.icon;
                const isManageUsers = item.href === "/manage-users";

                return (
                  <li key={item.name}>
                    {isManageUsers ? (
                      <div
                        className={cn("relative group")}
                        onMouseEnter={showManageUsersTooltip}
                        onMouseLeave={hideManageUsersTooltip}
                        onClick={() => handleMobileNavigationClick()}
                        role="button"
                        tabIndex={0}
                      >
                        <div
                          className={cn(
                            "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent hover:border-red-500 hover:shadow-md",
                            !isExpanded && "justify-center",
                            "text-valasys-gray-600 bg-transparent cursor-not-allowed opacity-90",
                          )}
                          title={!isExpanded ? item.name : undefined}
                          aria-disabled
                        >
                          {isExpanded ? (
                            <IconComponent
                              className={cn(
                                "w-4 h-4 flex-shrink-0 mr-3",
                                "text-valasys-gray-500",
                              )}
                            />
                          ) : (
                            <div
                              className={cn(
                                "w-10 h-10 rounded-md flex items-center justify-center border border-transparent group-hover:border-red-500 group-hover:shadow-md",
                                "bg-valasys-gray-100 text-valasys-gray-600",
                              )}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                          )}

                          {isExpanded && (
                            <span className="truncate">{item.name}</span>
                          )}

                          {isExpanded && (
                            <Lock className="ml-auto w-4 h-4 text-valasys-gray-400 group-hover:text-red-500" />
                          )}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        data-tour={item.tourId}
                        onClick={(e) => handleNavigationClick(item, e)}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                          !isExpanded && "justify-center",
                          isActive
                            ? "bg-valasys-orange text-white shadow-sm"
                            : "text-valasys-gray-600 hover:text-valasys-gray-900 hover:bg-valasys-gray-100",
                        )}
                        title={!isExpanded ? item.name : undefined}
                      >
                        {isExpanded ? (
                          <IconComponent
                            className={cn(
                              "w-4 h-4 flex-shrink-0 mr-3",
                              isActive ? "text-white" : "text-valasys-gray-500",
                            )}
                          />
                        ) : (
                          <div
                            className={cn(
                              "w-10 h-10 rounded-md flex items-center justify-center",
                              isActive
                                ? "bg-valasys-orange text-white shadow-sm"
                                : "bg-valasys-gray-100 text-valasys-gray-600 group-hover:bg-valasys-gray-200",
                            )}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                        )}
                        {isExpanded && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Upgrade Card - Bottom of Sidebar */}
          <div
            className={cn(
              "p-4 border-t border-valasys-gray-200",
              isExpanded ? "block" : "hidden lg:hidden",
            )}
          >
            <div
              data-tour="upgrade"
              className="bg-gradient-to-br from-valasys-orange to-valasys-orange-light rounded-lg p-4 text-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm mb-1">
                    Become Pro Access
                  </h3>
                  <p className="text-blue-100 text-xs leading-relaxed">
                    Try your experience for using more features.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-white text-valasys-blue hover:bg-gray-50 font-medium text-xs h-8"
              >
                <Crown className="w-3 h-3 mr-2" />
                Upgrade Pro
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Profile Card - Fixed at Bottom */}
        <div className="p-4 border-t border-valasys-gray-200 flex-shrink-0 bg-white">
          <div
            className={cn(
              "bg-white rounded-lg",
              isExpanded
                ? "border border-valasys-gray-200 shadow-sm p-3"
                : "shadow-none p-2",
            )}
          >
            {isExpanded ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={profileInfo?.avatarUrl || undefined}
                      alt={profileInfo?.fullName || "Profile"}
                    />
                    <AvatarFallback className="bg-valasys-orange text-white">
                      {(profileInfo?.fullName?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <div className="font-semibold text-gray-900 truncate max-w-[120px]">
                      {profileInfo.fullName || "John Smith"}
                    </div>
                    <div className="text-xs text-gray-500">Creator</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 border-red-200 hover:bg-red-50 h-8 w-8 p-0 flex items-center justify-center"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  className="text-red-600 border-red-200 hover:bg-red-50 h-10 w-10 p-0"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          // Mobile: No margin (sidebar overlays)
          // Desktop: Proper margin for sidebar
          "lg:ml-16", // Default margin for collapsed sidebar
          isExpanded && "lg:ml-64", // Expanded margin for open sidebar
        )}
      >
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-valasys-gray-200 sticky top-0 z-40 pt-2 sm:pt-4 lg:pt-10">
          <TrialBanner
            className="fixed inset-x-0 top-0 z-[60]"
            daysUsed={5}
            totalDays={10}
            endAt={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)}
          />
          <div className="px-4 lg:px-6 py-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="h-8 w-8 p-0 lg:hidden"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-4 w-4" />
                </Button>

                {/* Desktop Toggle Button (outside sidebar) */}
                <Button
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="h-8 w-8 p-0 hidden lg:inline-flex bg-valasys-orange text-white hover:bg-valasys-orange/90"
                  aria-label="Toggle sidebar"
                >
                  {isExpanded ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </Button>

                {/* Mobile Logo */}
                <div className="flex items-center space-x-2 lg:hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Ff175eb92de704327bb52162c1cf84ff3%2Fecb6a5ee790e40ecb44aa7d9621b5985?format=webp&width=800"
                    alt="VM Mobile Logo"
                    className="h-8 w-auto"
                  />
                </div>

                <div className="hidden lg:block">
                  <TrialBadgeDropdown />
                </div>
              </div>

              {/* Right side - Notification, G2 Reviews, Profile */}
              <div className="flex items-center space-x-4">
                <OnboardingSkipBadge />
                <MasteryProgressBadge onClick={handleRestoreMastery} />
                <div className="flex items-center space-x-3">
                  {/* Notification Dropdown */}
                  <div data-tour="notifications" className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-valasys-gray-100 relative"
                          title="Notifications"
                        >
                          <Bell className="h-5 w-5 text-valasys-gray-600" />
                          {unreadNotifications > 0 && (
                            <Badge
                              variant="destructive"
                              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-valasys-orange border-valasys-orange"
                            >
                              {unreadNotifications}
                            </Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-96 max-h-[500px] overflow-y-auto overflow-x-hidden"
                        sideOffset={8}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                          <DropdownMenuLabel className="text-base font-semibold">
                            Notifications
                          </DropdownMenuLabel>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {unreadNotifications} new
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-xs hover:bg-gray-100"
                              title="Mark all as read"
                              onClick={markAllAsRead}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Notification List */}
                        <div className="max-h-80 overflow-y-auto overflow-x-hidden">
                          {notifications.map((notification, index) => (
                            <div key={notification.id}>
                              <DropdownMenuItem className="p-0 focus:bg-gray-50">
                                <div
                                  className={cn(
                                    "w-full p-4 cursor-pointer transition-colors hover:bg-gray-50",
                                    notification.unread &&
                                      "bg-blue-50/50 border-l-4 border-l-valasys-orange",
                                  )}
                                >
                                  <div className="flex items-start space-x-3">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 mt-1">
                                      <div
                                        className={cn(
                                          "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                                          notification.type === "success" &&
                                            "bg-green-100 text-green-600",
                                          notification.type === "warning" &&
                                            "bg-yellow-100 text-yellow-600",
                                          notification.type === "info" &&
                                            "bg-blue-100 text-blue-600",
                                        )}
                                      >
                                        {notification.type === "success" && (
                                          <CheckCircle className="w-4 h-4" />
                                        )}
                                        {notification.type === "warning" && (
                                          <AlertTriangle className="w-4 h-4" />
                                        )}
                                        {notification.type === "info" && (
                                          <Info className="w-4 h-4" />
                                        )}
                                      </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                      <div className="flex items-center justify-between">
                                        <h4
                                          className={cn(
                                            "text-sm font-medium text-gray-900",
                                            notification.unread &&
                                              "font-semibold",
                                          )}
                                        >
                                          {notification.title}
                                        </h4>
                                        {notification.unread && (
                                          <div className="w-2 h-2 bg-valasys-orange rounded-full ml-2 flex-shrink-0"></div>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1 line-clamp-2 break-words">
                                        {notification.message}
                                      </p>
                                      <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-400 flex items-center">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {notification.time}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <MoreHorizontal className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DropdownMenuItem>
                              {index < notifications.length - 1 && (
                                <DropdownMenuSeparator className="my-0" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <DropdownMenuSeparator />
                        <div className="p-3">
                          <Link to="/notifications" className="block">
                            <Button
                              variant="ghost"
                              className="w-full text-sm text-valasys-orange hover:bg-valasys-orange/10"
                            >
                              View All Notifications
                            </Button>
                          </Link>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* G2 Review Logo */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-valasys-gray-100"
                    title="G2 Reviews"
                    asChild
                  >
                    <Link to="/reviews" target="_blank">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F9db3df5b68bf4ece8531cd0e6ed60d89%2F3fa5ac398f0e491bb8a3c77b5810eb8a?format=webp&width=800"
                        alt="G2 Reviews"
                        className="h-5 w-5"
                      />
                    </Link>
                  </Button>

                  {/* Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        data-tour="profile"
                        variant="ghost"
                        className="flex items-center space-x-2 h-10 px-3 hover:bg-valasys-gray-100"
                        title="Profile Menu"
                      >
                        {profileInfo?.avatarUrl ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={profileInfo.avatarUrl || undefined}
                              alt={profileInfo.fullName || "Profile"}
                            />
                            <AvatarFallback className="bg-valasys-orange text-white text-xs">
                              <User className="w-3 h-3" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src="https://cdn.builder.io/api/v1/image/assets%2F01baaecc62a64600a15da0c046188c43%2F85ffe47c124e4450bf89ae4b5bf8b374?format=webp&width=800"
                              alt="User"
                            />
                            <AvatarFallback className="bg-valasys-orange text-white text-xs">
                              U
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-80 p-0 overflow-hidden rounded-xl shadow-lg"
                    >
                      <div className="p-4 bg-gradient-to-r from-valasys-orange/10 to-valasys-orange-light/10">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12 ring-2 ring-valasys-orange/30">
                              <AvatarImage
                                src={
                                  profileInfo?.avatarUrl ||
                                  "https://cdn.builder.io/api/v1/image/assets%2F01baaecc62a64600a15da0c046188c43%2F85ffe47c124e4450bf89ae4b5bf8b374?format=webp&width=800"
                                }
                                alt={profileInfo.fullName || "User"}
                              />
                              <AvatarFallback className="bg-valasys-orange text-white text-xs">
                                U
                              </AvatarFallback>
                            </Avatar>
                            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate">
                              {profileInfo.fullName || "John Smith"}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {profileInfo.email || "marketing@company.com"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pt-3 pb-2 text-[11px] font-semibold text-gray-500">
                        ACCOUNT MANAGEMENT
                      </div>
                      <DropdownMenuSeparator />

                      <div className="p-1">
                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer items-start gap-3 py-3"
                        >
                          <Link
                            to="/settings"
                            className="flex items-start gap-3 w-full"
                          >
                            <UserCog className="mt-0.5 h-4 w-4 text-gray-600" />
                            <div>
                              <div className="font-medium">
                                Profile Settings
                              </div>
                              <div className="text-xs text-gray-500">
                                Manage your account details
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer items-start gap-3 py-3"
                        >
                          <Link
                            to="/subscription"
                            className="flex items-start gap-3 w-full"
                          >
                            <Crown className="mt-0.5 h-4 w-4 text-gray-600" />
                            <div>
                              <div className="font-medium">Subscription</div>
                              <div className="text-xs text-gray-500">
                                Manage plan & billing
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer items-start gap-3 py-3"
                        >
                          <Link
                            to="/payments"
                            className="flex items-start gap-3 w-full"
                          >
                            <CreditCard className="mt-0.5 h-4 w-4 text-gray-600" />
                            <div>
                              <div className="font-medium">Payments</div>
                              <div className="text-xs text-gray-500">
                                Transactions & invoices
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer items-start gap-3 py-3"
                        >
                          <Link
                            to="/settings"
                            className="flex items-start gap-3 w-full"
                          >
                            <Settings className="mt-0.5 h-4 w-4 text-gray-600" />
                            <div>
                              <div className="font-medium">Preferences</div>
                              <div className="text-xs text-gray-500">
                                Customize your experience
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer items-start gap-3 py-3"
                        >
                          <Link
                            to="/notifications"
                            className="flex items-start gap-3 w-full"
                          >
                            <Bell className="mt-0.5 h-4 w-4 text-gray-600" />
                            <div>
                              <div className="font-medium">Notifications</div>
                              <div className="text-xs text-gray-500">
                                Manage alerts & updates
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </div>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem className="cursor-pointer text-red-600 items-start gap-3 py-3">
                        <LogOut className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Sign Out</div>
                          <div className="text-xs text-red-500">
                            Sign out from your account
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            {/* Trial Progress Bar (only appears during active trials) */}
            <div className="absolute left-0 right-0 bottom-0">
              <TrialProgressBar daysUsed={8} totalDays={10} active />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative flex-1 p-6 overflow-auto">{children}</main>
      </div>

      {/* Manage Users Text Portal (renders outside sidebar) */}
      {manageUsersTooltipVisible &&
        createPortal(
          <div
            style={{
              left: manageUsersTooltipPos.left,
              top: manageUsersTooltipPos.top,
              transform: "translateX(-50%)",
            }}
            className="fixed z-50"
            role="tooltip"
            onMouseEnter={() => setManageUsersTooltipVisible(true)}
            onMouseLeave={() => setManageUsersTooltipVisible(false)}
          >
            <div className="bg-gray-800 text-white px-3 py-2 rounded-md text-xs whitespace-nowrap shadow-lg">
              Manage Users (Premium Feature)
            </div>
          </div>,
          document.body,
        )}

      {/* Contact Sales Dialog */}
      <Dialog
        open={showContactSalesDialog}
        onOpenChange={setShowContactSalesDialog}
      >
        <DialogContent className="max-w-md w-[95vw] p-0 overflow-hidden rounded-2xl">
          <div className="p-6 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-valasys-orange to-valasys-orange-light flex items-center justify-center text-white shadow-md">
                  <Lock className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Buy Credits
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  You don’t have access to purchase additional credits during
                  the trial period. If you still wish to buy credits, contact
                  your admin and they will get back to you shortly.
                </DialogDescription>
              </div>

              <DialogClose asChild>
                <button className="ml-2 text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </DialogClose>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="border rounded-lg p-3 text-sm">
                <div className="font-medium text-gray-900">
                  Purchase via Sales
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Contact our sales team to purchase credits and discuss custom
                  packages.
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Button
                  onClick={() => {
                    /* placeholder: navigate or open contact flow */
                  }}
                  className="bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white px-6 py-2 rounded-full shadow"
                >
                  Contact Sales
                </Button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-400 text-center">
              Or email{" "}
              <a
                href="mailto:sales@company.com"
                className="text-valasys-orange underline"
              >
                sales@company.com
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Draggable Chat Support Widget */}
      <div data-tour="chat">
        <DraggableChatSupport
          isOpen={chatOpen}
          onClose={handleChatClose}
          isMinimized={chatMinimized}
          onMinimize={handleChatToggle}
          enableDrag={true}
        />
      </div>

      {/* Platform Tour */}
      <PlatformTour
        isOpen={isTourOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />

      {/* Mastery Bottom Bar */}
      <MasteryBottomBar />
    </div>
  );
}
