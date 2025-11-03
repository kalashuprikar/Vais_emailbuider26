import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  Key,
  Globe,
  Mail,
  Phone,
  Save,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  BarChart3,
  Info,
  Calendar,
  Clock,
  Crown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    sms: false,
    weekly: true,
    monthly: false,
  });

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Anderson",
    email: "john.anderson@company.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corporation",
    role: "Marketing Director",
    location: "",
    homeAddress: "",
    workAddress: "",
    billingAddress: "",
    linkedInUrl: "",
    xUrl: "",
    avatarUrl: null as string | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("app.profile");
      if (raw) {
        const saved = JSON.parse(raw);
        setProfile((prev) => ({
          ...prev,
          firstName: saved.firstName ?? prev.firstName,
          lastName: saved.lastName ?? prev.lastName,
          email: saved.email ?? prev.email,
          phone: saved.phone ?? prev.phone,
          company: saved.company ?? prev.company,
          role: saved.role ?? prev.role,
          location: saved.location ?? prev.location,
          homeAddress: saved.homeAddress ?? prev.homeAddress,
          workAddress: saved.workAddress ?? prev.workAddress,
          billingAddress: saved.billingAddress ?? prev.billingAddress,
          linkedInUrl: saved.linkedInUrl ?? prev.linkedInUrl,
          xUrl: saved.xUrl ?? prev.xUrl,
          avatarUrl: saved.avatarUrl ?? prev.avatarUrl,
        }));
      }
    } catch {}
  }, []);

  const [apiSettings, setApiSettings] = useState({
    apiKey: "vls_1234567890abcdef1234567890abcdef",
    webhookUrl: "https://api.company.com/webhook",
    rateLimitPerHour: 1000,
  });

  const [billing] = useState({
    plan: "Professional",
    credits: 8450,
    nextBilling: new Date("2024-02-15"),
    usageThisMonth: 2150,
  });

  const availableCredit = Math.max(0, billing.credits - billing.usageThisMonth);
  const metrics = {
    accountsVerified: 12,
    availableCredit,
    creditsSpent: 74948,
    credit: { used: 14964, total: 54997 },
    search: { used: 617, total: 720 },
    downloads: { used: 9993, total: 56000 },
  };
  const percent = (used: number, total: number) =>
    total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;

  const handleSaveProfile = () => {
    const stored = {
      ...profile,
      fullName: `${profile.firstName} ${profile.lastName}`.trim(),
    };
    try {
      localStorage.setItem("app.profile", JSON.stringify(stored));
      window.dispatchEvent(
        new CustomEvent("app:profile-updated", { detail: stored }),
      );
    } catch (e) {
      console.error("Failed to persist profile", e);
    }
    console.log("Saving profile:", profile);
  };

  const handleGenerateApiKey = () => {
    const newKey = "vls_" + Math.random().toString(36).substring(2, 32);
    setApiSettings({ ...apiSettings, apiKey: newKey });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Account Settings
              </h1>
            </div>
            <p className="text-gray-600 mt-1">
              Manage your account preferences and security settings
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Account Verified
          </Badge>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex justify-center gap-4">
            <TabsTrigger
              value="profile"
              className="flex items-center justify-center space-x-2 w-56"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center justify-center space-x-2 w-56"
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span>Personal Information</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Profile Photo</Label>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={profile.avatarUrl || undefined}
                            alt={`${profile.firstName} ${profile.lastName}`}
                          />
                          <AvatarFallback className="bg-valasys-orange text-white">
                            {profile.firstName.charAt(0)}
                            {profile.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center space-x-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  const dataUrl = reader.result as string;
                                  setProfile((prev) => ({
                                    ...prev,
                                    avatarUrl: dataUrl,
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="border-valasys-orange text-valasys-orange hover:bg-valasys-orange hover:text-white"
                          >
                            <Upload className="w-4 h-4 mr-2" /> Upload Photo
                          </Button>
                          {profile.avatarUrl && (
                            <Button
                              variant="ghost"
                              onClick={() =>
                                setProfile({ ...profile, avatarUrl: null })
                              }
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          required
                          aria-required="true"
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Enter last name"
                          required
                          aria-required="true"
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Business Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@company.com"
                          required
                          aria-required="true"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="e.g. +1 555 123 4567"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">
                          Company Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="company"
                          placeholder="Your company name"
                          required
                          aria-required="true"
                          value={profile.company}
                          onChange={(e) =>
                            setProfile({ ...profile, company: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Job Title</Label>
                        <Input
                          id="role"
                          placeholder="Your job title"
                          value={profile.role}
                          onChange={(e) =>
                            setProfile({ ...profile, role: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            placeholder="City, Country"
                            value={profile.location}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                location: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="homeAddress">Home Address</Label>
                          <Input
                            id="homeAddress"
                            placeholder="Street, City, State, ZIP"
                            value={profile.homeAddress}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                homeAddress: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="workAddress">Work Address</Label>
                          <Input
                            id="workAddress"
                            placeholder="Company address"
                            value={profile.workAddress}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                workAddress: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingAddress">
                            Billing Address
                          </Label>
                          <Input
                            id="billingAddress"
                            placeholder="Billing address"
                            value={profile.billingAddress}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                billingAddress: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
                          <Input
                            id="linkedInUrl"
                            type="url"
                            placeholder="https://www.linkedin.com/in/username"
                            value={profile.linkedInUrl}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                linkedInUrl: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="xUrl">X URL</Label>
                          <Input
                            id="xUrl"
                            type="url"
                            placeholder="https://x.com/username"
                            value={profile.xUrl}
                            onChange={(e) =>
                              setProfile({ ...profile, xUrl: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-center">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valasys-orange/40 h-12 px-8 min-w-[220px]"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {/* Usage Overview (similar to provided design) */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <span>Usage Overview</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stat badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 bg-white border rounded-lg flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                          <CheckCircle
                            className="w-5 h-5 text-valasys-orange"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          Accounts Verified
                        </div>
                        <div className="text-lg font-semibold text-gray-900 mt-1">
                          {metrics.accountsVerified.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 bg-white border rounded-lg flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                          <CreditCard
                            className="w-5 h-5 text-valasys-orange"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          Available Credit
                        </div>
                        <div className="text-lg font-semibold text-gray-900 mt-1">
                          {metrics.availableCredit.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 bg-white border rounded-lg flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                          <Download
                            className="w-5 h-5 text-valasys-orange"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          Credits Spent
                        </div>
                        <div className="text-lg font-semibold text-gray-900 mt-1">
                          {metrics.creditsSpent.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Progress bars */}
                    <div className="space-y-5">
                      {/* Credit */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Credit</span>
                          <span>
                            {metrics.credit.used.toLocaleString()} /{" "}
                            {metrics.credit.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-valasys-orange to-valasys-orange-light"
                            style={{
                              width: `${percent(metrics.credit.used, metrics.credit.total)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Search */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Search</span>
                          <span>
                            {metrics.search.used.toLocaleString()} /{" "}
                            {metrics.search.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-valasys-orange"
                            style={{
                              width: `${percent(metrics.search.used, metrics.search.total)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Downloads */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Downloads</span>
                          <span>
                            {metrics.downloads.used.toLocaleString()} /{" "}
                            {metrics.downloads.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-gray-700"
                            style={{
                              width: `${percent(metrics.downloads.used, metrics.downloads.total)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-valasys-orange to-valasys-orange-light" />
                          <span>
                            Credit ({metrics.credit.used.toLocaleString()}/
                            {metrics.credit.total.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full bg-gray-700" />
                          <span>
                            Downloads ({metrics.downloads.used.toLocaleString()}
                            /{metrics.downloads.total.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full bg-valasys-orange" />
                          <span>
                            Search ({metrics.search.used.toLocaleString()}/
                            {metrics.search.total.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full bg-gray-200" />
                          <span>Remaining</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                          <Info className="w-4 h-4 text-white" />
                        </div>
                        <span>Account Summary</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600 flex items-center gap-2">
                          <Crown
                            className="w-4 h-4 text-valasys-orange"
                            aria-hidden="true"
                          />
                          <span>Account Type</span>
                        </Label>
                        <div className="font-medium">{billing.plan}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600 flex items-center gap-2">
                          <CreditCard
                            className="w-4 h-4 text-valasys-orange"
                            aria-hidden="true"
                          />
                          <span>Credits Remaining</span>
                        </Label>
                        <div className="font-medium text-green-600">
                          {billing.credits.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-valasys-gray-200 my-2" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar
                            className="w-4 h-4 text-valasys-orange"
                            aria-hidden="true"
                          />
                          <span>Member Since</span>
                        </Label>
                        <div className="font-medium">June 2023</div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock
                            className="w-4 h-4 text-valasys-orange"
                            aria-hidden="true"
                          />
                          <span>Last Login</span>
                        </Label>
                        <div className="font-medium">Today at 2:30 PM</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button className="bg-valasys-orange hover:bg-valasys-orange/90">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Enable 2FA
                      </Label>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Setup 2FA</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Login Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          Current Session - Chrome on MacOS
                        </div>
                        <div className="text-sm text-gray-600">
                          San Francisco, CA • Active now
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        Current
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Safari on iPhone</div>
                        <div className="text-sm text-gray-600">
                          San Francisco, CA • 2 hours ago
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Revoke All Other Sessions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
