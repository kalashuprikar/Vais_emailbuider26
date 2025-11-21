import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, AlertCircle, Check } from "lucide-react";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "India",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "Mexico",
  "Singapore",
  "Netherlands",
  "Sweden",
  "Switzerland",
];

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "paypal" | "bank_transfer";
  cardNetwork?: string;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  isDefault: boolean;
  lastUsed: string;
  status: "active" | "expired" | "inactive";
  autopayEnabled: boolean;
}

interface AddPaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  country: string;
  paypalEmail: string;
}

interface ValidationError {
  field: keyof AddPaymentFormData;
  message: string;
}

const getCardNetworkFromNumber = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, "");
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) return "Visa";
  if (/^5[1-5][0-9]{14}$/.test(number)) return "Mastercard";
  if (/^3[47][0-9]{13}$/.test(number)) return "American Express";
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(number)) return "Discover";
  return "";
};

function validateCardForm(data: AddPaymentFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.cardholderName.trim()) {
    errors.push({
      field: "cardholderName",
      message: "Cardholder name is required",
    });
  }

  const cardNumber = data.cardNumber.replace(/\s/g, "");
  if (!cardNumber || cardNumber.length < 13) {
    errors.push({ field: "cardNumber", message: "Invalid card number" });
  }

  if (!data.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
    errors.push({
      field: "expiryDate",
      message: "Use MM/YY format",
    });
  }

  if (!data.cvc || data.cvc.length < 3) {
    errors.push({ field: "cvc", message: "Invalid CVC" });
  }

  return errors;
}

function validatePayPalForm(data: AddPaymentFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.paypalEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push({
      field: "paypalEmail",
      message: "Please enter a valid email address",
    });
  }

  return errors;
}

export function AddPaymentMethodDialog({
  open,
  onOpenChange,
  onAdd,
  editingMethod,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (method: PaymentMethod) => void;
  editingMethod?: PaymentMethod;
}) {
  const isEditMode = !!editingMethod;
  const initialPaymentType: "card" | "paypal" = editingMethod
    ? editingMethod.type === "paypal"
      ? "paypal"
      : "card"
    : "card";

  const [paymentType, setPaymentType] = useState<"card" | "paypal">(
    initialPaymentType,
  );
  const [formData, setFormData] = useState<AddPaymentFormData>({
    cardholderName: editingMethod?.cardholderName || "",
    cardNumber: editingMethod?.cardNumber || "",
    expiryDate: editingMethod?.expiryDate || "",
    cvc: "",
    country: "United States",
    paypalEmail:
      editingMethod?.type === "paypal" ? editingMethod.cardNumber : "",
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardNetwork = useMemo(
    () => getCardNetworkFromNumber(formData.cardNumber),
    [formData.cardNumber],
  );

  useEffect(() => {
    if (open && editingMethod) {
      setPaymentType(editingMethod.type === "paypal" ? "paypal" : "card");
      setFormData({
        cardholderName: editingMethod.cardholderName || "",
        cardNumber: editingMethod.cardNumber || "",
        expiryDate: editingMethod.expiryDate || "",
        cvc: "",
        country: "United States",
        paypalEmail:
          editingMethod.type === "paypal" ? editingMethod.cardNumber : "",
      });
      setErrors([]);
    }
  }, [editingMethod, open]);

  const getErrorMessage = (field: keyof AddPaymentFormData): string => {
    return errors.find((e) => e.field === field)?.message || "";
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "");
    value = value.replace(/[^\d]/g, "");
    value = value.slice(0, 19);
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setFormData({ ...formData, cardNumber: value });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setFormData({ ...formData, expiryDate: value });
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFormData({ ...formData, cvc: value });
  };

  const handleAddCard = async () => {
    let validationErrors = validateCardForm(formData);

    if (isEditMode) {
      validationErrors = validationErrors.filter(
        (e) => e.field !== "cardNumber" && e.field !== "cvc",
      );
    }

    setErrors(validationErrors);

    if (validationErrors.length > 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newMethod: PaymentMethod = {
      id: editingMethod?.id || `pm_${Date.now()}`,
      type: "credit_card",
      cardNetwork: cardNetwork || "Card",
      cardNumber: formData.cardNumber.slice(-4),
      expiryDate: formData.expiryDate,
      cardholderName: formData.cardholderName,
      isDefault: editingMethod?.isDefault ?? false,
      lastUsed:
        editingMethod?.lastUsed || new Date().toISOString().split("T")[0],
      status: editingMethod?.status ?? "active",
      autopayEnabled: editingMethod?.autopayEnabled ?? true,
    };

    onAdd(newMethod);
    resetForm();
    onOpenChange(false);
    setIsSubmitting(false);
  };

  const handleAddPayPal = async () => {
    const validationErrors = validatePayPalForm(formData);
    setErrors(validationErrors);

    if (validationErrors.length > 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newMethod: PaymentMethod = {
      id: editingMethod?.id || `pm_${Date.now()}`,
      type: "paypal",
      cardNumber: formData.paypalEmail,
      expiryDate: "",
      cardholderName: "PayPal Account",
      isDefault: editingMethod?.isDefault ?? false,
      lastUsed:
        editingMethod?.lastUsed || new Date().toISOString().split("T")[0],
      status: editingMethod?.status ?? "active",
      autopayEnabled: editingMethod?.autopayEnabled ?? true,
    };

    onAdd(newMethod);
    resetForm();
    onOpenChange(false);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      country: "United States",
      paypalEmail: "",
    });
    setErrors([]);
    setPaymentType("card");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full mx-2 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-valasys-orange to-valasys-orange-light bg-clip-text text-transparent">
            {isEditMode ? "Edit Payment Method" : "Add Payment Method"}
          </DialogTitle>
          <p className="text-xs md:text-sm text-gray-600 mt-2">
            {isEditMode
              ? "Update your payment method details"
              : "Choose your preferred payment method to get started"}
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setPaymentType("card");
                setErrors([]);
              }}
              className={`group relative px-3 py-3 rounded-xl border-2 transition-all duration-300 ${
                paymentType === "card"
                  ? "border-valasys-orange bg-gradient-to-br from-orange-50 to-orange-100 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`p-2 rounded-lg transition-all ${
                    paymentType === "card"
                      ? "bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white shadow-md"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 text-xs">Card</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard</p>
                </div>
              </div>
              {paymentType === "card" && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-full p-1 shadow-md">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => {
                setPaymentType("paypal");
                setErrors([]);
              }}
              className={`group relative px-3 py-3 rounded-xl border-2 transition-all duration-300 ${
                paymentType === "paypal"
                  ? "border-valasys-orange bg-gradient-to-br from-orange-50 to-orange-100 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`p-2 rounded-lg transition-all ${
                    paymentType === "paypal"
                      ? "bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white shadow-md"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 4-.04.22a.805.805 0 01-.794.68h-2.31a.626.626 0 01-.625-.7l.236-1.49.32-2.03.158-1c.047-.3.318-.508.626-.508h1.04c3.238 0 5.774-1.314 6.514-5.12.74-3.807-.236-5.428-2.55-5.428h-4.166L7.944 4.24a.805.805 0 01-.794-.68l-.04-.22a.626.626 0 01.625-.7h2.31a.805.805 0 01.794.68l.04.22 1.342 8.513h1.575c3.238 0 5.774 1.314 6.514 5.12.373 1.903.04 3.327-.743 4.64z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 text-xs">PayPal</p>
                  <p className="text-xs text-gray-500">Fast & secure</p>
                </div>
              </div>
              {paymentType === "paypal" && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-full p-1 shadow-md">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          </div>

          {paymentType === "card" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3">
                    Card Information
                  </label>

                  <div className="space-y-3">
                    <div className="relative group">
                      <Input
                        placeholder="1234 1234 1234 1234"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        disabled={isEditMode}
                        className={`h-11 text-sm font-mono tracking-wider transition-all border rounded-lg focus:ring-2 focus:ring-valasys-orange/30 pr-28 ${
                          isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
                        } ${
                          getErrorMessage("cardNumber")
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-valasys-orange"
                        }`}
                        maxLength={19}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        {/* VISA */}
                        <svg className={`w-7 h-5 transition-opacity ${cardNetwork === "Visa" ? "opacity-100" : "opacity-30"}`} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="32" rx="3" fill="#1434CB"/>
                          <text x="24" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" dominantBaseline="middle">VISA</text>
                        </svg>

                        {/* Mastercard */}
                        <svg className={`w-7 h-5 transition-opacity ${cardNetwork === "Mastercard" ? "opacity-100" : "opacity-30"}`} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="32" rx="3" fill="white" stroke="#E5E7EB" strokeWidth="0.5"/>
                          <circle cx="16" cy="16" r="9" fill="#EB001B"/>
                          <circle cx="32" cy="16" r="9" fill="#FF5F00"/>
                          <circle cx="24" cy="16" r="9" fill="#FF5F00" opacity="0.6"/>
                        </svg>

                        {/* American Express */}
                        <svg className={`w-7 h-5 transition-opacity ${cardNetwork === "American Express" ? "opacity-100" : "opacity-30"}`} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="32" rx="3" fill="#006FCF"/>
                          <text x="24" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" dominantBaseline="middle">AMEX</text>
                        </svg>

                        {/* Discover */}
                        <svg className={`w-7 h-5 transition-opacity ${cardNetwork === "Discover" ? "opacity-100" : "opacity-30"}`} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="32" rx="3" fill="#FF6000"/>
                          <circle cx="28" cy="16" r="5" fill="white"/>
                        </svg>
                      </div>
                    </div>
                    {getErrorMessage("cardNumber") && (
                      <div className="flex items-center gap-2 text-xs text-red-600 animate-in fade-in">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{getErrorMessage("cardNumber")}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Input
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleExpiryChange}
                          className={`h-11 text-sm font-mono tracking-widest transition-all border rounded-lg focus:ring-2 focus:ring-valasys-orange/30 ${
                            getErrorMessage("expiryDate")
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 focus:border-valasys-orange"
                          }`}
                          maxLength={5}
                        />
                        {getErrorMessage("expiryDate") && (
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-red-600 animate-in fade-in">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            <span>{getErrorMessage("expiryDate")}</span>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="CVC"
                          value={formData.cvc}
                          onChange={handleCvcChange}
                          disabled={isEditMode}
                          className={`h-11 text-sm font-mono tracking-widest transition-all border rounded-lg focus:ring-2 focus:ring-valasys-orange/30 pr-10 ${
                            isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
                          } ${
                            getErrorMessage("cvc")
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 focus:border-valasys-orange"
                          }`}
                          maxLength={4}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="5" width="20" height="14" rx="2"/>
                            <rect x="2" y="5" width="20" height="4"/>
                          </svg>
                        </div>
                        {getErrorMessage("cvc") && (
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-red-600 animate-in fade-in">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            <span>{getErrorMessage("cvc")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <Input
                    placeholder="Full name on card"
                    value={formData.cardholderName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardholderName: e.target.value,
                      })
                    }
                    className={`h-11 text-sm transition-all border rounded-lg focus:ring-2 focus:ring-valasys-orange/30 ${
                      getErrorMessage("cardholderName")
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-valasys-orange"
                    }`}
                  />
                  {getErrorMessage("cardholderName") && (
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-red-600 animate-in fade-in">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{getErrorMessage("cardholderName")}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Country or Region
                  </label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }
                  >
                    <SelectTrigger className="h-11 text-sm border rounded-lg border-gray-200 focus:border-valasys-orange">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 h-11 border border-gray-300 hover:border-gray-400 font-semibold text-sm text-gray-700 transition-all rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCard}
                  disabled={isSubmitting}
                  className="flex-1 h-11 bg-gradient-to-r from-valasys-orange to-valasys-orange-light hover:from-valasys-orange/90 hover:to-valasys-orange-light/90 disabled:opacity-50 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all rounded-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">
                        {isEditMode ? "Updating..." : "Adding..."}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {isEditMode ? "Update Card" : "Add Card"}
                      </span>
                      <span className="sm:hidden">
                        {isEditMode ? "Update" : "Add"}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}

          {paymentType === "paypal" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-900 mb-2">
                  PayPal Email Address
                </label>
                <Input
                  placeholder="your-email@example.com"
                  type="email"
                  value={formData.paypalEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, paypalEmail: e.target.value })
                  }
                  className={`h-10 md:h-12 text-sm md:text-base transition-all border-2 focus:ring-2 focus:ring-valasys-orange/30 ${
                    getErrorMessage("paypalEmail")
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-valasys-orange"
                  }`}
                />
                {getErrorMessage("paypalEmail") && (
                  <div className="flex items-center gap-2 mt-1.5 md:mt-2 text-xs md:text-sm text-red-600 animate-in fade-in">
                    <AlertCircle className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                    <span>{getErrorMessage("paypalEmail")}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 md:gap-3 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 h-10 md:h-12 border-2 border-gray-300 hover:border-gray-400 font-semibold text-sm md:text-base text-gray-700 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPayPal}
                  disabled={isSubmitting}
                  className="flex-1 h-10 md:h-12 bg-gradient-to-r from-valasys-orange to-valasys-orange-light hover:from-valasys-orange/90 hover:to-valasys-orange-light/90 disabled:opacity-50 text-white font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">
                        {isEditMode ? "Updating..." : "Adding..."}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 md:w-5 h-4 md:h-5" />
                      <span className="hidden sm:inline">
                        {isEditMode ? "Update PayPal" : "Add PayPal"}
                      </span>
                      <span className="sm:hidden">
                        {isEditMode ? "Update" : "Add"}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
