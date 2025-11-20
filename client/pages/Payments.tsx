import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  CheckCircle,
  Plus,
  Wifi,
  Shield,
  Landmark,
  Edit2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DateRangePicker as RsuiteDateRangePicker } from "rsuite";
import { Switch } from "@/components/ui/switch";
import {
  AddPaymentMethodDialog,
  type PaymentMethod,
} from "@/components/billing/AddPaymentMethodDialog";

interface PaymentRow {
  id: string;
  transactionDate: string;
  invoiceId: string;
  paymentMethod: string;
  type: string;
  plan: string;
  currency: string;
  invoiceAmount: number;
  serviceProvider: string;
}

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

const paymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "credit_card",
    cardNetwork: "Visa",
    cardNumber: "4421",
    expiryDate: "12/25",
    cardholderName: "John Doe",
    isDefault: true,
    lastUsed: "2025-09-01",
    status: "active",
    autopayEnabled: true,
  },
  {
    id: "pm_2",
    type: "credit_card",
    cardNetwork: "Mastercard",
    cardNumber: "1887",
    expiryDate: "08/24",
    cardholderName: "John Doe",
    isDefault: false,
    lastUsed: "2025-07-15",
    status: "active",
    autopayEnabled: true,
  },
  {
    id: "pm_3",
    type: "credit_card",
    cardNetwork: "American Express",
    cardNumber: "3012",
    expiryDate: "06/26",
    cardholderName: "John Doe",
    isDefault: false,
    lastUsed: "2025-05-02",
    status: "active",
    autopayEnabled: true,
  },
  {
    id: "pm_4",
    type: "paypal",
    cardNumber: "john.doe@email.com",
    expiryDate: "",
    cardholderName: "John Doe",
    isDefault: false,
    lastUsed: "2025-02-14",
    status: "active",
    autopayEnabled: true,
  },
];

const rows: PaymentRow[] = [
  {
    id: "1",
    transactionDate: "2025-09-01 07:58 PM",
    invoiceId: "INV-2025-091-001",
    paymentMethod: "Mastercard **** 1887",
    type: "Subscription",
    plan: "Growth Plan",
    currency: "USD",
    invoiceAmount: 660,
    serviceProvider: "Stripe",
  },
  {
    id: "2",
    transactionDate: "2025-08-01 08:03 PM",
    invoiceId: "INV-2025-081-002",
    paymentMethod: "Visa **** 4421",
    type: "Subscription",
    plan: "Scale Plan",
    currency: "USD",
    invoiceAmount: 660,
    serviceProvider: "Stripe",
  },
  {
    id: "3",
    transactionDate: "2025-07-15 10:12 AM",
    invoiceId: "INV-2025-071-003",
    paymentMethod: "Amex **** 3012",
    type: "Add-on Credits",
    plan: "Custom Plan",
    currency: "USD",
    invoiceAmount: 120,
    serviceProvider: "Stripe",
  },
  {
    id: "4",
    transactionDate: "2025-06-04 11:00 AM",
    invoiceId: "INV-2025-061-004",
    paymentMethod: "UPI **** 3289",
    type: "Subscription",
    plan: "Growth Plan",
    currency: "INR",
    invoiceAmount: 5499,
    serviceProvider: "Razorpay",
  },
  {
    id: "5",
    transactionDate: "2025-05-02 05:34 PM",
    invoiceId: "INV-2025-051-005",
    paymentMethod: "PayPal john.doe@email.com",
    type: "Subscription",
    plan: "Scale Plan",
    currency: "USD",
    invoiceAmount: 660,
    serviceProvider: "PayPal",
  },
  {
    id: "6",
    transactionDate: "2025-04-17 09:27 AM",
    invoiceId: "INV-2025-041-006",
    paymentMethod: "Visa **** 9301",
    type: "Add-on Credits",
    plan: "Custom Plan",
    currency: "USD",
    invoiceAmount: 220,
    serviceProvider: "Stripe",
  },
  {
    id: "7",
    transactionDate: "2025-03-01 08:01 PM",
    invoiceId: "INV-2025-031-007",
    paymentMethod: "Mastercard **** 1887",
    type: "Subscription",
    plan: "Growth Plan",
    currency: "USD",
    invoiceAmount: 660,
    serviceProvider: "Stripe",
  },
  {
    id: "8",
    transactionDate: "2025-02-14 01:43 PM",
    invoiceId: "INV-2025-021-008",
    paymentMethod: "NetBanking ICICI",
    type: "Add-on Credits",
    plan: "Scale Plan",
    currency: "INR",
    invoiceAmount: 2999,
    serviceProvider: "Razorpay",
  },
];

function downloadInvoice(row: PaymentRow) {
  const lines = [
    "Invoice",
    "------------------------------",
    `Invoice ID: ${row.invoiceId}`,
    `Date: ${row.transactionDate}`,
    `Payment Method: ${row.paymentMethod}`,
    `Type: ${row.type}`,
    `Plan: ${row.plan}`,
    `Currency: ${row.currency}`,
    `Amount: ${row.invoiceAmount}`,
    `Service Provider: ${row.serviceProvider}`,
  ];
  const blob = new Blob([lines.join("\n")], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${row.invoiceId}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function parsePaymentDate(input: string): Date | null {
  const m = input.match(
    /(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)/i,
  );
  if (!m) return null;
  const [_, y, mo, d, hh, mm, ap] = m;
  let hour = parseInt(hh, 10);
  const minute = parseInt(mm, 10);
  if (/pm/i.test(ap) && hour !== 12) hour += 12;
  if (/am/i.test(ap) && hour === 12) hour = 0;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d), hour, minute, 0);
  if (isNaN(dt.getTime())) return null;
  return dt;
}

type SortField =
  | "transactionDate"
  | "invoiceId"
  | "paymentMethod"
  | "type"
  | "plan"
  | "currency"
  | "invoiceAmount"
  | "serviceProvider";

type SortDir = "asc" | "desc";

function getCardNetwork(paymentMethod: PaymentMethod) {
  if (paymentMethod.type === "paypal") {
    return "PayPal";
  }
  return paymentMethod.cardNetwork || "Card";
}

function getCardGradient(cardNetwork?: string) {
  switch (cardNetwork) {
    case "Visa":
      return "from-blue-500 via-blue-600 to-blue-700";
    case "Mastercard":
      return "from-red-500 via-orange-500 to-red-600";
    case "American Express":
      return "from-slate-700 via-slate-800 to-slate-900";
    default:
      return "from-purple-500 via-pink-500 to-purple-600";
  }
}


function ModernPaymentCard({
  method,
  onDelete,
  onSetDefault,
  onAutopayChange,
  onEdit,
  isLastPaymentMethod,
}: {
  method: PaymentMethod;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onAutopayChange: (id: string, enabled: boolean) => void;
  onEdit?: (id: string) => void;
  isLastPaymentMethod?: boolean;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isPayPal = method.type === "paypal";

  return (
    <>
      <div className="group relative">
        <div
          className={`relative rounded-2xl overflow-hidden h-52 bg-white transition-all duration-300 transform hover:scale-105 p-6 flex flex-col justify-between ${
            method.isDefault
              ? "border-2 border-valasys-orange shadow-md hover:shadow-lg"
              : "border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-600 tracking-wider">
                {isPayPal ? "PAYPAL" : "CREDIT CARD"}
              </div>
              <div className="text-lg font-bold text-gray-900">
                {getCardNetwork(method)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {method.isDefault && (
                <div className="bg-blue-50 px-3 py-1.5 rounded-full border border-blue-300">
                  <span
                    className="flex items-center gap-1.5 text-blue-700 font-semibold"
                    style={{ fontSize: "12px" }}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Default
                  </span>
                </div>
              )}
              {!method.isDefault && (
                <button
                  onClick={() => onSetDefault(method.id)}
                  className="p-2 rounded-full bg-orange-100 border border-orange-300 text-valasys-orange hover:bg-orange-200 transition-all duration-200"
                  title="Set as default"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(method.id)}
                  className="p-2 rounded-full bg-blue-100 border border-blue-300 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                  title="Edit card"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setDeleteOpen(true)}
                disabled={isLastPaymentMethod}
                className={`p-2 rounded-full border transition-all duration-200 ${
                  isLastPaymentMethod
                    ? "bg-red-50 border-red-200 text-red-400 cursor-not-allowed opacity-50"
                    : "bg-red-100 border-red-300 text-red-600 hover:bg-red-200"
                }`}
                title={
                  isLastPaymentMethod
                    ? "Cannot delete the only payment method"
                    : "Delete card"
                }
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 tracking-wide">
                {method.cardholderName.toUpperCase()}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex-1">
                <p className="text-lg font-mono font-bold text-gray-900 tracking-widest">
                  {isPayPal
                    ? method.cardNumber
                    : `•••• •••• •••• ${method.cardNumber}`}
                </p>
                {method.isDefault && (
                  <div className="mt-2">
                    <div
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${
                        method.autopayEnabled
                          ? "bg-green-100 border-green-300"
                          : "bg-gray-100 border-gray-300"
                      }`}
                    >
                      <Switch
                        checked={method.autopayEnabled}
                        onCheckedChange={(checked) =>
                          onAutopayChange(method.id, checked)
                        }
                        className="h-3.5 w-7 scale-75 origin-left"
                      />
                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold ${
                          method.autopayEnabled
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                        style={{ fontSize: "11px" }}
                      >
                        {method.autopayEnabled ? (
                          <>
                            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Autopay Enabled
                          </>
                        ) : (
                          <>
                            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                            Autopay Disabled
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {!isPayPal && (
                <div className="text-right">
                  <p className="font-mono font-bold text-sm text-gray-900">
                    {method.expiryDate}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              {isLastPaymentMethod
                ? "Cannot Delete Payment Method"
                : "Delete Payment Method?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              {isLastPaymentMethod
                ? "You must keep at least one payment method on file. Please add another payment method before deleting this one."
                : "This action cannot be undone. You won't be able to use this payment method for future transactions."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 my-4">
            <p className="text-sm font-semibold text-gray-900">
              {getCardNetwork(method)} •••• {method.cardNumber}
            </p>
            <p className="text-xs text-gray-600 mt-1 font-medium">
              {method.cardholderName}
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!isLastPaymentMethod) {
                  onDelete(method.id);
                  setDeleteOpen(false);
                }
              }}
              disabled={isLastPaymentMethod}
              className={`h-10 ${
                isLastPaymentMethod
                  ? "bg-red-400 cursor-not-allowed opacity-50"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function Payments() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("transactionDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [paymentMethodsList, setPaymentMethodsList] =
    useState<PaymentMethod[]>([]);
  const [addPaymentDialogOpen, setAddPaymentDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | undefined>();

  const uniqueTypes = useMemo(
    () => Array.from(new Set(rows.map((r) => r.type))).sort(),
    [],
  );

  const uniquePlans = useMemo(
    () => Array.from(new Set(rows.map((r) => r.plan))).sort(),
    [],
  );

  const [dateRange, setDateRange] = useState<
    { from: Date | undefined; to: Date | undefined } | undefined
  >();
  const [pickerValue, setPickerValue] = useState<[Date, Date] | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = q
        ? [r.invoiceId, r.paymentMethod, r.type, r.plan, r.serviceProvider]
            .join(" ")
            .toLowerCase()
            .includes(q)
        : true;

      const matchesType = typeFilter === "all" ? true : r.type === typeFilter;
      const matchesPlan = planFilter === "all" ? true : r.plan === planFilter;

      let inRange = true;
      if (dateRange?.from && dateRange?.to) {
        const dt = parsePaymentDate(r.transactionDate);
        if (!dt) return false;
        const t = dt.getTime();
        inRange = t >= dateRange.from.getTime() && t <= dateRange.to.getTime();
      }

      return matchesQuery && matchesType && matchesPlan && inRange;
    });
  }, [query, typeFilter, planFilter, dateRange]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      const getVal = (r: PaymentRow) => {
        switch (sortField) {
          case "transactionDate": {
            const da = parsePaymentDate(r.transactionDate)?.getTime() ?? 0;
            return da;
          }
          case "invoiceAmount":
            return r.invoiceAmount;
          case "invoiceId":
            return r.invoiceId.toLowerCase();
          case "paymentMethod":
            return r.paymentMethod.toLowerCase();
          case "type":
            return r.type.toLowerCase();
          case "plan":
            return r.plan.toLowerCase();
          case "currency":
            return r.currency.toLowerCase();
          case "serviceProvider":
            return r.serviceProvider.toLowerCase();
        }
      };
      const va = getVal(a);
      const vb = getVal(b);

      if (typeof va === "number" && typeof vb === "number") {
        cmp = va - vb;
      } else {
        const sa = String(va);
        const sb = String(vb);
        cmp = sa.localeCompare(sb);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const resetFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setPlanFilter("all");
    setDateRange(undefined);
    setPickerValue(null);
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethodsList((prev) => prev.filter((pm) => pm.id !== id));
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethodsList((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    );
  };

  const handleAutopayChange = (id: string, enabled: boolean) => {
    setPaymentMethodsList((prev) =>
      prev.map((pm) =>
        pm.id === id ? { ...pm, autopayEnabled: enabled } : pm,
      ),
    );
  };

  const handleAddPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethodsList((prev) => {
      if (editingMethod) {
        return prev.map((pm) => (pm.id === method.id ? method : pm));
      }

      const isFirstCard = prev.length === 0;
      const newMethod = isFirstCard
        ? { ...method, isDefault: true, autopayEnabled: true }
        : method;
      return [...prev, newMethod];
    });
    setEditingMethod(undefined);
  };

  const handleEditPaymentMethod = (id: string) => {
    const method = paymentMethodsList.find((pm) => pm.id === id);
    if (method) {
      setEditingMethod(method);
      setAddPaymentDialogOpen(true);
    }
  };

  const HeaderSort = ({
    label,
    field,
    alignRight,
  }: {
    label: string;
    field: SortField;
    alignRight?: boolean;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="group flex items-center justify-between gap-2 text-left hover:text-valasys-orange w-full h-full px-4 py-2 cursor-pointer"
    >
      <span>{label}</span>
      <div className="flex-shrink-0">
        {sortField === field ? (
          sortDir === "asc" ? (
            <ArrowUp className="w-3.5 h-3.5 text-valasys-orange" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-valasys-orange" />
          )
        ) : (
          <span className="opacity-40 group-hover:opacity-70">↕</span>
        )}
      </div>
    </button>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-valasys-orange to-orange-600 rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            Payments & Billing
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Manage your payment methods and review transaction history
          </p>
        </div>

        <Tabs defaultValue="payment-methods" className="w-full">
          <TabsList className="grid w-auto grid-cols-2 bg-gray-100 p-1">
            <TabsTrigger
              value="payment-methods"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-valasys-orange data-[state=active]:to-valasys-orange-light data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger
              value="payment-history"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-valasys-orange data-[state=active]:to-valasys-orange-light data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payment-methods" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Saved Cards & Methods
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {paymentMethodsList.length} payment method
                  {paymentMethodsList.length !== 1 ? "s" : ""} on file
                </p>
              </div>
              <Button
                onClick={() => setAddPaymentDialogOpen(true)}
                className="bg-gradient-to-r from-valasys-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all h-11"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Card
              </Button>
            </div>

            {paymentMethodsList.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <CreditCard className="w-8 h-8 text-valasys-orange" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  No payment methods yet
                </p>
                <p className="text-gray-600 mb-6">
                  Add your first payment method to get started
                </p>
                <Button
                  onClick={() => setAddPaymentDialogOpen(true)}
                  className="bg-gradient-to-r from-valasys-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethodsList.map((method) => (
                  <ModernPaymentCard
                    key={method.id}
                    method={method}
                    onDelete={handleDeletePaymentMethod}
                    onSetDefault={handleSetDefaultPaymentMethod}
                    onAutopayChange={handleAutopayChange}
                    onEdit={handleEditPaymentMethod}
                    isLastPaymentMethod={paymentMethodsList.length === 1}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="payment-history" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  Transaction History
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  View and download your invoices
                </p>
              </div>
            </div>

            <Card className="bg-white border-gray-200">
              <CardHeader className="pb-4 border-b border-gray-200">
                <CardTitle className="flex items-center text-base font-semibold">
                  <Filter className="w-5 h-5 mr-2 text-valasys-orange" />
                  Search & Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-3 items-end">
                  <div className="w-full flex-1">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Invoice ID, method, provider..."
                        className="pl-10 h-10"
                        aria-label="Search payments"
                      />
                    </div>
                  </div>
                  <div className="w-full flex-1">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Date Range
                    </label>
                    <RsuiteDateRangePicker
                      value={pickerValue as any}
                      onChange={(val) => setPickerValue(val as any)}
                      onOk={(val) => {
                        setPickerValue(val as any);
                        if (val && Array.isArray(val)) {
                          setDateRange({ from: val[0], to: val[1] });
                        }
                      }}
                      onClean={() => {
                        setPickerValue(null);
                        setDateRange(undefined);
                      }}
                      placeholder="MM/DD/YYYY - MM/DD/YYYY"
                      format="MM/dd/yyyy"
                      character=" - "
                      placement="leftStart"
                      showOneCalendar={false}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="w-full flex-1">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Type
                    </label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {uniqueTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full flex-1">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Plan
                    </label>
                    <Select value={planFilter} onValueChange={setPlanFilter}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Plans" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plans</SelectItem>
                        {uniquePlans.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetFilters}
                    title="Reset filters"
                    aria-label="Reset filters"
                    className="h-10 w-10 border-gray-300"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                        <TableHead className="min-w-[180px] font-semibold text-gray-700">
                          <HeaderSort
                            label="Transaction Date"
                            field="transactionDate"
                          />
                        </TableHead>
                        <TableHead className="min-w-[160px] font-semibold text-gray-700">
                          <HeaderSort label="Invoice ID" field="invoiceId" />
                        </TableHead>
                        <TableHead className="min-w-[200px] font-semibold text-gray-700">
                          <HeaderSort
                            label="Payment Method"
                            field="paymentMethod"
                          />
                        </TableHead>
                        <TableHead className="min-w-[140px] font-semibold text-gray-700">
                          <HeaderSort label="Type" field="type" />
                        </TableHead>
                        <TableHead className="min-w-[140px] font-semibold text-gray-700">
                          <HeaderSort label="Plan" field="plan" />
                        </TableHead>
                        <TableHead className="min-w-[120px] font-semibold text-gray-700">
                          <HeaderSort label="Currency" field="currency" />
                        </TableHead>
                        <TableHead className="text-right min-w-[150px] font-semibold text-gray-700">
                          <HeaderSort
                            label="Amount"
                            field="invoiceAmount"
                            alignRight
                          />
                        </TableHead>
                        <TableHead className="min-w-[160px] font-semibold text-gray-700">
                          <HeaderSort
                            label="Provider"
                            field="serviceProvider"
                          />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sorted.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="text-sm text-gray-700 font-medium">
                            {row.transactionDate}
                          </TableCell>
                          <TableCell className="font-mono text-sm font-semibold text-gray-900">
                            <button
                              className="inline-flex items-center gap-2 text-valasys-orange hover:text-orange-700 font-semibold transition-colors"
                              onClick={() => downloadInvoice(row)}
                              aria-label={`Download invoice ${row.invoiceId}`}
                            >
                              {row.invoiceId}
                              <Download className="w-4 h-4" />
                            </button>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700">
                            {row.paymentMethod}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium text-xs">
                              {row.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 font-medium">
                            {row.plan}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 font-semibold">
                            {row.currency}
                          </TableCell>
                          <TableCell className="text-right font-bold text-gray-900 text-sm">
                            {row.currency === "USD"
                              ? `$${row.invoiceAmount.toLocaleString()}`
                              : `${row.invoiceAmount.toLocaleString()} ${row.currency}`}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 font-medium">
                            {row.serviceProvider}
                          </TableCell>
                        </TableRow>
                      ))}
                      {sorted.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center py-12 text-sm text-gray-500"
                          >
                            <div className="space-y-2">
                              <p className="font-semibold">
                                No transactions found
                              </p>
                              <p className="text-xs">
                                Try adjusting your filters
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AddPaymentMethodDialog
          open={addPaymentDialogOpen}
          onOpenChange={(open) => {
            setAddPaymentDialogOpen(open);
            if (!open) {
              setEditingMethod(undefined);
            }
          }}
          onAdd={handleAddPaymentMethod}
          editingMethod={editingMethod}
        />
      </div>
    </DashboardLayout>
  );
}
