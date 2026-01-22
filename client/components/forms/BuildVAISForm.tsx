import React, { useState, useRef, useEffect } from "react";
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { decrypt } from '@/store/encryption';
import type { RootState } from '@/store';
import { setICPScore, setICPData, setPagination } from '@/store/reducers/icpScoreSlice';
import { setICPFilters } from '@/store/reducers/icpScoreSlice';
import { setLoading } from '@/store/reducers/loadingSlice';
import authService from '@/api/services/authService';
import { icpService } from '@/api/services';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTaskManager } from "../layout/TaskManager";
// import { markStepCompleted } from "@/lib/masteryStorage";
import Fuse from "fuse.js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  X,
  Search,
  Download,
  Info,
  FileText,
  MapPin,
  Tag,
  Building,
  CheckCircle,
  AlertCircle,
  Plus,
  Save,
  Clock,
  TrendingUp,
  Users,
  Target,
  Bot,
  Check,
  FileCheck,
  FileX,
  Sparkles,
  Loader2,
  Trash2,
  RotateCcw, 
  ArrowLeft,
  ArrowRight,
  RocketIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingStatsWidget } from "@/components/ui/floating-stats-widget";
import { apiClient, API_ENDPOINTS } from '@/api/config';
import { getOllamaConfig } from "@/config/ollamaConfig";


interface FormData {
  productSubcategory: string; // stores id or name depending on source
  productCategory: string;
  geolocation: string[];
  intentTopics: string[];
  uploadedFile?: File;
}

interface AiTopic {
  topic_name: string;
  score: number;
  description: string;
  category?: string;
  theme?: string;
}

interface SavedSearch {
  id: string;
  name: string;
  formData: FormData;
  createdAt: Date;
}

// Utility to truncate filenames for UI display (same as ABMLAL)
function truncateFilename(filename: string, startLen = 35, endLen = 13): string {
  if (!filename || filename.length <= startLen + endLen + 3) return filename;
  const extMatch = filename.match(/(\.[^./\\]+)$/);
  const ext = extMatch ? extMatch[1] : '';
  const base = ext ? filename.slice(0, -ext.length) : filename;
  if (base.length <= startLen + endLen + 3) return filename;
  return (
    base.slice(0, startLen) +
    '...' +
    base.slice(-endLen) +
    ext
  );
}

// Default fallbacks used until API values are loaded
const DEFAULT_PRODUCT_SUBCATEGORIES = [
  "Software Solutions",
  "Hardware Components",
  "Cloud Services",
  "Analytics Tools",
  "Security Solutions",
  "AI/ML Platforms",
  "Data Management",
  "Infrastructure Services",
];

const DEFAULT_PRODUCT_CATEGORIES = [
  "Enterprise Software",
  "Consumer Technology",
  "B2B Services",
  "SaaS Platform",
  "Mobile Applications",
  "IoT Solutions",
  "Cybersecurity",
  "Digital Marketing",
];

const DEFAULT_GEOLOCATIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East & Africa",
  "Global",
];

const filterTopics = [
  "Supply Chain",
  "Financial",
  "Technology",
  "Telecommunications",
  "Health Tech",
  "Sales",
  "Emerging Tech",
  "Mobile",
  "Other",
  "Security",
  "Tools & Electronics",
  "Business Services",
  "Corporate Finance",
  "Controls & Standards",
  "Finance IT",
  "Personal Finance",
  "Operations",
  "Business Solutions",
  "Enterprise",
  "Standards & Regulatory",
  "Disease Control",
  "HR",
  "AgriTech",
  "Water Quality",
  "Media & Advertising",
  "Compliance & Governance",
  "Legal & Regulatory",
  "Policy & Culture",
  "Staff Departure",
  "Branding",
  "Content",
  "Creativity Software",
  "Search Marketing",
  "Certifications",
  "Desktop",
  "Email",
  "Messaging",
  "Transportation",
  "Personal Computer",
  "Trends",
  "Aerospace",
  "Gaming",
  "Medical Education",
  "Landmark Cases",
  "Marketing",
  "Medical Testing",
  "Chromatography",
  "Lab Automation",
  "Lab Data Management & Analysis",
  "Jail & Prison",
  "Energy & Construction",
  "Copyright",
  "Design Engineering",
  "Health Conditions",
];

const filterThemes = [
  "Business",
  "Energy/Construction/Manufacturing",
  "Company",
  "Technology",
  "Healthcare",
  "Finance",
  "BioTech",
  "Human Resources",
  "Legal",
  "Marketing",
  "Products",
  "Government",
  "Retail",
  "Media",
  "Travel",
  "Consumer Technology",
  "Events & Conferences",
  "Arts & Entertainment",
  "Beauty & Fitness",
  "Food & Drink",
  "Hobbies & Leisure",
  "Home & Garden",
  "Education",
  "People & Society",
  "Pets & Animals",
  "Science",
  "Shopping",
  "Sports",
];

// Lightweight FAISS-style sparse vector utilities (no external APIs, no fuzzy matching)
type SparseVector = Record<string, number>;

function tokenizeText(text: string): string[] {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function buildSparseVector(tokens: string[]): SparseVector {
  const vec: SparseVector = {};
  tokens.forEach((token) => {
    vec[token] = (vec[token] || 0) + 1;
  });
  const norm = Math.sqrt(
    Object.values(vec).reduce((sum, v) => sum + v * v, 0) || 1,
  );
  Object.keys(vec).forEach((key) => {
    vec[key] = vec[key] / norm;
  });
  return vec;
}

function cosineSimilaritySparse(a: SparseVector, b: SparseVector): number {
  const keys = Object.keys(a).length < Object.keys(b).length ? Object.keys(a) : Object.keys(b);
  let dot = 0;
  for (const key of keys) {
    if (a[key] && b[key]) dot += a[key] * b[key];
  }
  return dot;
}

interface FaissCandidate {
  value: string;
  label: string;
  extra?: string;
}

function faissLikeRank(
  query: string,
  candidates: FaissCandidate[],
): Array<FaissCandidate & { score: number }> {
  const queryVec = buildSparseVector(tokenizeText(query));
  return candidates
    .map((cand) => {
      const text = `${cand.label} ${cand.extra || ""}`;
      const candVec = buildSparseVector(tokenizeText(text));
      return { ...cand, score: cosineSimilaritySparse(queryVec, candVec) };
    })
    .sort((a, b) => b.score - a.score);
}

// High-intent / geo helpers (local-only, no external calls)
const GEO_ALIAS_ENTRIES = [
  {
    canonical: "United States",
    aliases: [
      "united states",
      "united states of america",
      "usa",
      "us",
      "u.s.",
      "america",
    ],
  },
  {
    canonical: "United Kingdom",
    aliases: ["united kingdom", "uk", "u.k.", "britain", "great britain", "england"],
  },
  {
    canonical: "United Arab Emirates",
    aliases: ["united arab emirates", "uae", "u.a.e", "dubai", "abu dhabi"],
  },
  { canonical: "Russia", aliases: ["russia", "russian federation"] },
  { canonical: "South Korea", aliases: ["south korea", "korea", "republic of korea"] },
  { canonical: "North Korea", aliases: ["north korea", "dprk"] },
  { canonical: "Czech Republic", aliases: ["czech republic", "czechia"] },
  { canonical: "Viet Nam", aliases: ["vietnam", "viet nam"] },
  { canonical: "China", aliases: ["china", "prc", "people's republic of china"] },
  { canonical: "Hong Kong", aliases: ["hong kong", "hk"] },
  { canonical: "Taiwan", aliases: ["taiwan", "taipei"] },
  { canonical: "Ivory Coast", aliases: ["cote d'ivoire", "ivory coast"] },
  { canonical: "Cape Verde", aliases: ["cabo verde", "cape verde"] },
  { canonical: "Democratic Republic of the Congo", aliases: ["drc", "congo kinshasa", "democratic republic of the congo"] },
  { canonical: "Republic of the Congo", aliases: ["congo brazzaville", "republic of the congo"] },
  { canonical: "South Africa", aliases: ["south africa", "sa"] },
  { canonical: "United Republic of Tanzania", aliases: ["tanzania", "united republic of tanzania"] },
  { canonical: "India", aliases: ["india", "bharat", "republic of india"] },
  { canonical: "Eswatini", aliases: ["eswatini", "swaziland"] },
  { canonical: "Burma (Myanmar)", aliases: ["myanmar", "burma"] },
  { canonical: "Lao People's Democratic Republic", aliases: ["laos", "lao pdr", "lao people's democratic republic"] },
  { canonical: "Macedonia", aliases: ["north macedonia", "macedonia"] },
  { canonical: "Moldova", aliases: ["moldova", "moldavia", "republic of moldova"] },
  { canonical: "Palestine", aliases: ["palestine", "palestinian territories", "west bank", "gaza"] },
  { canonical: "Bolivia", aliases: ["bolivia", "plurinational state of bolivia"] },
  { canonical: "Venezuela", aliases: ["venezuela", "bolivarian republic of venezuela"] },
  { canonical: "Syria", aliases: ["syria", "syrian arab republic"] },
  { canonical: "Iran", aliases: ["iran", "islamic republic of iran"] },
];

function normalizeGeoName(name: string) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTopicText(name: string) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasTokenSequence(queryTokens: string[], targetTokens: string[]): boolean {
  if (!targetTokens.length || !queryTokens.length) return false;
  if (targetTokens.length === 1) {
    return queryTokens.includes(targetTokens[0]);
  }
  for (let i = 0; i <= queryTokens.length - targetTokens.length; i += 1) {
    let hit = true;
    for (let j = 0; j < targetTokens.length; j += 1) {
      if (queryTokens[i + j] !== targetTokens[j]) {
        hit = false;
        break;
      }
    }
    if (hit) return true;
  }
  return false;
}

function getTopicThemeValue(topic: any): string {
  return String(
    topic?.theme ||
      topic?.topic_theme ||
      topic?.topic_theme_name ||
      topic?.theme_name ||
      "",
  ).trim();
}

function getTopicCategoryValue(topic: any): string {
  return String(
    topic?.category ||
      topic?.topic_category ||
      topic?.topic_category_name ||
      topic?.category_name ||
      "",
  ).trim();
}

function extractExplicitTopicsFromQuery(query: string, topics: any[]): string[] {
  const normalizedQuery = normalizeTopicText(query);
  if (!normalizedQuery || !Array.isArray(topics) || topics.length === 0) return [];
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const picks = new Set<string>();

  topics.forEach((topic) => {
    const rawName =
      topic?.name ||
      topic?.topic_name ||
      topic?.topic ||
      topic?.label ||
      "";
    const name = String(rawName || "").trim();
    if (!name) return;
    const normName = normalizeTopicText(name);
    if (!normName) return;
    const nameTokens = normName.split(" ").filter(Boolean);
    if (hasTokenSequence(queryTokens, nameTokens)) {
      picks.add(name);
    }
  });

  return Array.from(picks);
}

function getTopicName(topic: any): string {
  return String(
    topic?.name ||
      topic?.topic_name ||
      topic?.topic ||
      topic?.label ||
      "",
  ).trim();
}

function mapTopicsToPool(values: string[], pool: any[]): string[] {
  if (!Array.isArray(values) || values.length === 0) return [];
  if (!Array.isArray(pool) || pool.length === 0) return values;

  const poolMap = pool
    .map((topic) => {
      const name = getTopicName(topic);
      return {
        raw: name,
        norm: normalizeTopicText(name),
        tokens: normalizeTopicText(name).split(" ").filter(Boolean),
      };
    })
    .filter((item) => item.raw);

  const mapped = new Set<string>();
  values.forEach((value) => {
    const cleaned = String(value || "").trim();
    if (!cleaned) return;
    const norm = normalizeTopicText(cleaned);
    const direct = poolMap.find((item) => item.norm === norm);
    if (direct) {
      mapped.add(direct.raw);
      return;
    }
    const tokens = norm.split(" ").filter(Boolean);
    const partial = poolMap.find((item) => hasTokenSequence(tokens, item.tokens));
    if (partial) mapped.add(partial.raw);
    else mapped.add(cleaned);
  });

  return Array.from(mapped);
}

function extractJsonObject(text: string): any | null {
  if (!text) return null;
  const directTry = text.trim();
  if (directTry.startsWith("{") && directTry.endsWith("}")) {
    try {
      return JSON.parse(directTry);
    } catch (e) {
      // fall through
    }
  }
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

async function fetchRagContext(query: string): Promise<string> {
  const endpoint = (import.meta as any)?.env?.VITE_BOMBORA_RAG_ENDPOINT;
  if (!endpoint) return "";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return String(
      data?.context ||
        data?.result ||
        data?.data ||
        data?.response ||
        "",
    ).trim();
  } catch (e) {
    return "";
  }
}

// Use Ollama to infer one or more countries from free-text locations (cities, states, regions).
// Only countries that exist in the provided list will be returned.
async function inferCountriesWithOllama(query: string, countries: string[]): Promise<string[]> {
  if (!query?.trim() || !Array.isArray(countries) || countries.length === 0) return [];

  const { baseUrl: host, model } = getOllamaConfig();
  const prompt = `
You are a geolocation resolver for a B2B marketing platform.
The user may describe locations using cities, states/provinces or regions.
Your job is to infer which COUNTRIES these locations belong to, using ONLY the allowed list.

User query:
${query}

Allowed Countries (return only names from this list):
${countries.join(", ")}

Rules:
- Map cities and states to their correct country.
  Examples (non-exhaustive):
  - "Pune", "Mumbai", "Bangalore", "Delhi" => "India"
  - "London", "Manchester", "Birmingham" => "United Kingdom"
  - "California", "New York", "San Francisco", "Chicago", "Boston" => "United States"
  - "Berlin", "Munich" => "Germany"
  - "Toronto", "Vancouver" => "Canada"
- If multiple locations are mentioned in different countries, return all relevant countries.
- If you are not sure, do not guess; omit that country.

Return JSON only in this exact format (no extra text):
{
  "countries": ["Exact Country Name 1", "Exact Country Name 2", ...]
}
`;

  try {
    const res = await fetch(`${host}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false, options: { temperature: 0.1 } }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const raw = String(data?.response || "").trim();
    const parsed = extractJsonObject(raw);
    const list = Array.isArray(parsed?.countries)
      ? parsed.countries.map((c: any) => String(c).trim()).filter(Boolean)
      : [];

    if (!list.length) return [];

    // Map returned country names back to actual geolocation labels using normalized text.
    const pool = (countries || []).map((g) => ({ raw: g, norm: normalizeGeoName(g) }));
    const picked: string[] = [];

    list.forEach((name) => {
      const norm = normalizeGeoName(name);
      if (!norm) return;
      
      // Prioritize exact match
      let match = pool.find((g) => g.norm === norm);
      
      // Fallback to substring match
      if (!match) {
         match = pool.find((g) => g.norm.includes(norm) || norm.includes(g.norm));
      }
      
      if (match && !picked.includes(match.raw)) picked.push(match.raw);
    });

    return picked;
  } catch (e) {
    console.warn("inferCountriesWithOllama failed", e);
    return [];
  }
}

async function callOllamaForIntentTopics(payload: {
  query: string;
  ragContext: string;
  topics: string[];
  themes: string[];
  categories: string[];
  productCategory?: string;
  productSubcategory?: string;
  topicsLimit?: number;
}): Promise<{ theme?: string; category?: string; topics?: string[] } | null> {
  const { baseUrl: host, model } = getOllamaConfig();

  const prompt = `
You are an expert Intent Topic Selector for a B2B marketing platform.
Your goal is to identify "High Intent" topics that signal a company is actively researching or looking to buy the user's product.

Product Context:
- Category: ${payload.productCategory || "Unspecified"}
- Subcategory: ${payload.productSubcategory || "Unspecified"}
- User Query: ${payload.query}

VERY IMPORTANT GEOLOCATION RULE (for your internal reasoning only):
- The user may mention CITIES, STATES/PROVINCES, or REGIONS instead of explicit country names.
- When you read the User Query and RAG Context, you MUST internally infer which COUNTRY those locations belong to.
- Examples:
  - "Pune", "Mumbai" => "India"
  - "London", "Manchester" => "United Kingdom"
  - "California", "New York", "San Francisco" => "United States"
- Use these inferred countries as part of your understanding of the product context and buyer intent, but do NOT add countries to the JSON output. Only return the fields specified below.

Instructions:
1. Analyze the Product Category and Subcategory carefully.
   - If the Subcategory (or any product term) is an acronym or technical abbreviation, you MUST expand it to its full meaning and identify topics related to its core technology and definition.
   - This applies to ANY product or subcategory (e.g., if "CRM", look for "Customer Relationship Management"; if "ERP", look for "Enterprise Resource Planning", etc.).
2. Identify the intent topics from the "Candidate Topics" list below that are MOST relevant to this product.
3. PRIORITIZE topics that indicate:
   - Active purchase research and implementation intent relevant to the specific product domain.
   - Specific technical needs, tools, or solutions related to the subcategory.
   - Competitor evaluation or vendor selection.
   - NOTE: The examples "Software", "Solutions", etc. are just examples. You must select the high-intent terms that are specific to the ACTUAL product being analyzed.
4. STRICTLY EXCLUDE topics that are:
   - Vague or too broad (e.g., "General", "Other") unless no specific topics exist.
   - Unrelated to the product domain (e.g., don't pick HR topics for a Cybersecurity product).
   - Low intent (e.g., purely educational or news-related).
5. Select exactly ${payload.topicsLimit ?? 12} intent topics from the "Candidate Topics" list below that are MOST relevant to this product. If fewer than that many relevant topics exist, return as many as are relevant.

Candidate Topics (Select ONLY from this list):
${payload.topics.join(", ")}

RAG Context (Bombora mappings):
${payload.ragContext || "None"}

Return JSON only in this format:
{
  "theme": "Best matching theme from available themes",
  "category": "Best matching category from available categories",
  "topics": ["Exact Name of Topic 1", "Exact Name of Topic 2", ...]
}
`;

  const res = await fetch(`${host}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: { temperature: 0.2 },
    }),
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  const rawText = String(data?.response || "").trim();
  const parsed = extractJsonObject(rawText);
  if (!parsed || typeof parsed !== "object") return null;

  const topics = Array.isArray(parsed.topics)
    ? parsed.topics.map((t: any) => String(t).trim()).filter(Boolean)
    : [];
  return {
    theme: parsed.theme ? String(parsed.theme).trim() : "",
    category: parsed.category ? String(parsed.category).trim() : "",
    topics,
  };
}

async function explainTopicWithOllama(
  topicName: string,
  productCategory: string,
  productSubcategory: string
): Promise<string | null> {
  const { baseUrl: host, model } = getOllamaConfig();

  const prompt = `
You are an expert B2B Intent Data Analyst.
Explain why the intent topic "${topicName}" is relevant to a company selling "${productSubcategory}" (Category: ${productCategory}).

Rules:
- Use concise, professional language capped at 2–3 sentences.
- Be specific to the technology or service; avoid generic marketing fluff.
- Plain text ONLY: do not use markdown, asterisks, quotes, or any styling.
- End with a single line starting with: Very Important: <strongest high-intent signal in 5–12 words>

Return ONLY the explanation text (including the final Very Important line). Do not wrap in JSON.
`;

  try {
    const res = await fetch(`${host}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { temperature: 0.3 },
        }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return String(data?.response || "").trim();
  } catch (e) {
      console.error("Failed to explain topic", e);
      return null;
  }
}

function findBestGeoMatch(query: string, geos: string[]): string | null {
  if (!Array.isArray(geos) || geos.length === 0) return null;
  const normQuery = normalizeGeoName(query);
  const geoList = geos.map((g) => ({ raw: g, norm: normalizeGeoName(g) }));

  // 0) Exact match
  const exact = geoList.find((g) => g.norm === normQuery);
  if (exact) return exact.raw;

  // 1) Alias-based fast path
  for (const entry of GEO_ALIAS_ENTRIES) {
    const hit = entry.aliases.some((alias) => normQuery.includes(alias));
    if (hit) {
      // pick the geo in the list that best matches this canonical/alias
      const targetNorms = [normalizeGeoName(entry.canonical), ...entry.aliases];
      
      // Prioritize exact match
      let found = geoList.find((g) => targetNorms.includes(g.norm));
      
      if (!found) {
        found = geoList.find((g) =>
            targetNorms.some(
            (alias) => g.norm.includes(alias) || alias.includes(g.norm),
            ),
        );
      }
      if (found) return found.raw;
    }
  }

  // 2) Direct substring match
  // A. Query contains Geo (e.g. "Pune, India" contains "India")
  let direct = geoList.find((g) => normQuery.includes(g.norm));
  
  // B. Geo contains Query (e.g. "India" in "British Indian Ocean Territory")
  if (!direct) {
    direct = geoList.find((g) => g.norm.includes(normQuery));
  }
  
  if (direct) return direct.raw;

  // 3) Fallback to cosine similarity scoring
  const rankedGeos = scoreCandidates(query, geos, (item: any) => String(item));
  const bestGeo = rankedGeos[0]?.item;
  return bestGeo ? String(bestGeo) : null;
}

function findAllGeoMatches(query: string, geos: string[], max = 5): string[] {
  if (!query?.trim()) return [];
  const normalized = normalizeGeoName(query);

  // If user asks for all countries/locations, return everything
  if (normalized.includes("all country") || normalized === "all" || normalized.includes("all geo") || normalized.includes("all location")) {
    return Array.isArray(geos) ? geos.slice() : [];
  }

  if (!Array.isArray(geos) || geos.length === 0) return [];

  const picks = new Set<string>();
  const queryTokens = normalized.split(" ").filter(Boolean);
  const geoList = geos.map((g) => ({
    raw: g,
    norm: normalizeGeoName(g),
    tokens: normalizeGeoName(g).split(" ").filter(Boolean),
  }));

  // Direct matches by token sequences (supports "india japan" without separators)
  geoList.forEach((g) => {
    if (hasTokenSequence(queryTokens, g.tokens)) {
      picks.add(g.raw);
    }
  });

  // Alias-based matches (map alias to canonical geo in list)
  GEO_ALIAS_ENTRIES.forEach((entry) => {
    const canonicalNorm = normalizeGeoName(entry.canonical);
    const canonicalTokens = canonicalNorm.split(" ").filter(Boolean);
    let foundCanonical = geoList.find((g) => g.norm === canonicalNorm);
    if (!foundCanonical) {
        foundCanonical = geoList.find((g) => g.norm.includes(canonicalNorm) || canonicalNorm.includes(g.norm));
    }
    entry.aliases.forEach((alias) => {
      const aliasTokens = normalizeGeoName(alias).split(" ").filter(Boolean);
      if (!aliasTokens.length) return;
      if (hasTokenSequence(queryTokens, aliasTokens)) {
        if (foundCanonical) {
          picks.add(foundCanonical.raw);
        } else if (canonicalTokens.length) {
          const fallback = geoList.find((g) => hasTokenSequence(g.tokens, canonicalTokens));
          if (fallback) picks.add(fallback.raw);
        }
      }
    });
  });

  const segments = query
    .split(/[,;]+| and /gi)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  segments.forEach((segment) => {
    const match = findBestGeoMatch(segment, geos);
    if (match) picks.add(match);
  });

  // If nothing matched by segments, try whole query as fallback
  if (picks.size === 0) {
    const fallback = findBestGeoMatch(query, geos);
    if (fallback) picks.add(fallback);
  }

  return Array.from(picks).slice(0, max);
}

// Build local high-intent AI topics if Ollama returns nothing
function buildLocalHighIntentTopics(
  availableTopics: any[],
  context: string,
  max: number,
): AiTopic[] {
  if (!Array.isArray(availableTopics) || availableTopics.length === 0) return [];
  const ranked = scoreCandidates(
    context,
    availableTopics,
    (item: any) => String(item.name || item.topic_name || item.topic || ""),
  );
  return ranked.slice(0, max).map((r, idx) => ({
    topic_name: String((r.item as any).name || (r.item as any).topic_name || r.item),
    // Scale similarity into 70-95, keep ordering deterministic
    score: Math.min(95, Math.max(70, Math.round((r.score || 0) * 100))) - idx,
    description: "",
  }));
}

async function loadCsvText(path: string): Promise<string> {
  try {
    const res = await fetch(path);
    if (!res.ok) return "";
    const text = await res.text();
    return String(text || "").trim();
  } catch {
    return "";
  }
}

function parseCsvRecords(text: string): Array<Record<string, string>> {
  const rows: Array<Record<string, string>> = [];
  if (!text) return rows;
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return rows;
  const header = parseCsvLine(lines[0]);
  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseCsvLine(lines[i]);
    const rec: Record<string, string> = {};
    for (let j = 0; j < header.length; j += 1) {
      const key = header[j];
      const val = cols[j] ?? "";
      rec[key] = val;
    }
    rows.push(rec);
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.replace(/^\s+|\s+$/g, ""));
}

async function getRelevantTopicsFromCsv(
  productCategory: string,
  productSubcategory: string,
  themePool: string[],
  categoryPool: string[],
  max = 30,
  additionalContext = ""
): Promise<AiTopic[]> {
  const categoryCsv = await loadCsvText("/category.csv");
  const topicCsv = await loadCsvText("/category_topic.csv");
  const categoryRows = parseCsvRecords(categoryCsv);
  const topicRows = parseCsvRecords(topicCsv);

  const normCat = String(productCategory || "").trim().toLowerCase();
  const normSub = String(productSubcategory || "").trim().toLowerCase();

  const pairExists = categoryRows.some(
    (r) =>
      String(r["product_category_name"] || "").trim().toLowerCase() === normCat &&
      String(r["product_sub_category_name"] || "").trim().toLowerCase() === normSub,
  );

  const candidateTopicNames = Array.from(
    new Set(
      topicRows
        .filter(
          (r) =>
            String(r["product_category_name"] || "").trim().toLowerCase() === normCat ||
            String(r["topic_category"] || "").trim().toLowerCase() === normCat,
        )
        .map((r) => String(r["topic_name"] || "").trim())
        .filter(Boolean),
    ),
  );

  const context = `${normCat} ${normSub} ${additionalContext}`.trim();
  let ragContext = "";
  try {
    ragContext = await fetchRagContext(normSub);
  } catch {
    /* ignore */
  }

  let llamaSelection: { topics?: string[]; theme?: string; category?: string } | null = null;
  try {
    // Directly use CSV candidates without cosine similarity pre-filtering
    // Limit to a reasonable number to fit in context window if necessary, but prioritize CSV relevance
    const topCandidates = candidateTopicNames.slice(0, 300);

    llamaSelection = await callOllamaForIntentTopics({
      query: `${context} ${ragContext}`,
      ragContext,
      topics: topCandidates,
      themes: themePool,
      categories: categoryPool,
      productCategory: normCat,
      productSubcategory: normSub,
      topicsLimit: max,
    });
  } catch {
    /* ignore */
  }

  const picked = (llamaSelection?.topics || []).slice(0, max);
  if (picked.length === 0) {
    return buildLocalHighIntentTopics(
      candidateTopicNames.map((name) => ({ name })),
      context,
      Math.min(max, 20),
    );
  }

  return picked.map((name, idx) => ({
    topic_name: name,
    score: Math.max(60, 100 - idx * 3),
    description: `${name} is relevant to ${normSub} under ${normCat}`,
    category: llamaSelection?.category || "",
    theme: llamaSelection?.theme || "",
  }));
}

const intentTopics = [
  {
    name: "Request for Information (RFI)",
    description: "Prospects actively seeking product information",
    volume: "High",
    conversion: "85%",
  },
  {
    name: "Pricing Inquiry",
    description: "Ready-to-buy prospects comparing prices",
    volume: "Medium",
    conversion: "92%",
  },
  {
    name: "Product Demo",
    description: "Qualified prospects wanting to see the product",
    volume: "Medium",
    conversion: "88%",
  },
  {
    name: "Technical Support",
    description: "Existing customers needing assistance",
    volume: "High",
    conversion: "65%",
  },
  {
    name: "Partnership Opportunities",
    description: "Businesses seeking strategic partnerships",
    volume: "Low",
    conversion: "78%",
  },
  {
    name: "Implementation Services",
    description: "Prospects needing implementation help",
    volume: "Medium",
    conversion: "90%",
  },
  {
    name: "Training & Certification",
    description: "Organizations wanting team training",
    volume: "Medium",
    conversion: "82%",
  },
  {
    name: "Custom Development",
    description: "Prospects needing customization",
    volume: "Low",
    conversion: "95%",
  },
  {
    name: "Integration Support",
    description: "Technical prospects needing integration help",
    volume: "Medium",
    conversion: "87%",
  },
  {
    name: "Competitive Analysis",
    description: "Prospects comparing solutions",
    volume: "High",
    conversion: "70%",
  },
  {
    name: "Case Studies",
    description: "Prospects seeking proof of success",
    volume: "High",
    conversion: "75%",
  },
  {
    name: "Compliance & Security",
    description: "Security-focused prospects",
    volume: "Medium",
    conversion: "89%",
  },
  {
    name: "Migration Services",
    description: "Companies looking to migrate systems",
    volume: "Medium",
    conversion: "86%",
  },
  {
    name: "ROI Assessment",
    description: "Prospects evaluating return on investment",
    volume: "High",
    conversion: "79%",
  },
  {
    name: "Vendor Evaluation",
    description: "Companies comparing multiple vendors",
    volume: "High",
    conversion: "73%",
  },
  {
    name: "Proof of Concept",
    description: "Technical prospects wanting to test solutions",
    volume: "Medium",
    conversion: "91%",
  },
  {
    name: "Scalability Planning",
    description: "Growing companies planning for scale",
    volume: "Low",
    conversion: "84%",
  },
  {
    name: "Budget Planning",
    description: "Finance teams planning technology budgets",
    volume: "Medium",
    conversion: "77%",
  },
  {
    name: "Technology Roadmap",
    description: "Strategic planning for technology adoption",
    volume: "Low",
    conversion: "88%",
  },
  {
    name: "Disaster Recovery",
    description: "Companies planning business continuity",
    volume: "Medium",
    conversion: "83%",
  },
  {
    name: "Performance Optimization",
    description: "Organizations seeking to improve efficiency",
    volume: "High",
    conversion: "81%",
  },
  {
    name: "Cloud Migration",
    description: "Companies moving to cloud infrastructure",
    volume: "High",
    conversion: "85%",
  },
];

const steps = [
  { id: 1, name: "Product Configuration", icon: Tag },
  { id: 2, name: "Intent Topics", icon: Target },
  // { id: 3, name: "Suppression File", icon: Upload },
  { id: 4, name: "Build VAIS", icon: Building },
];

// Minimal FAISS-style cosine matcher (local only, no external API)
function tokenize(text: string): string[] {
  return (
    text
      ?.toLowerCase()
      ?.replace(/[^a-z0-9]+/gi, " ")
      ?.split(" ")
      ?.filter(Boolean) || []
  );
}

function buildVector(tokens: string[]): Record<string, number> {
  return tokens.reduce((acc: Record<string, number>, token) => {
    acc[token] = (acc[token] || 0) + 1;
    return acc;
  }, {});
}

function cosineSimilarity(a: Record<string, number>, b: Record<string, number>): number {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  keys.forEach((k) => {
    const va = a[k] || 0;
    const vb = b[k] || 0;
    dot += va * vb;
    normA += va * va;
    normB += vb * vb;
  });
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function scoreCandidates<T>(
  query: string,
  candidates: T[],
  getLabel: (item: T) => string,
): Array<{ item: T; score: number }> {
  const queryVec = buildVector(tokenize(query));
  return candidates
    .map((item) => {
      const label = getLabel(item) || "";
      const candVec = buildVector(tokenize(label));
      return { item, score: cosineSimilarity(queryVec, candVec) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
// Highlight important phrases within an explanation by making them bold.
// Currently we use the derived "keyPoint" (Very Important) as the primary highlight.
function renderHighlightedText(text: string, highlights: string[]): React.ReactNode {
  if (!text) return null;
  const cleanedHighlights = (highlights || []).filter((h) => h && h.trim().length > 0);
  if (cleanedHighlights.length === 0) return text;

  // Sort longer phrases first so we match specific phrases before their substrings
  const sorted = [...cleanedHighlights].sort((a, b) => b.length - a.length);
  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${sorted.map(escapeRegex).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const isHighlight = sorted.some(
          (h) => h.toLowerCase() === part.toLowerCase().trim(),
        );
        if (isHighlight) {
          return (
            <strong key={index} className="font-semibold">
              {part}
            </strong>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}

// Extract a small set of important keywords from an explanation string.
// This is heuristic (no external ML): we pick rare, longer words that
// are more likely to represent actions, pains, or value (e.g. "automating",
// "reducing", "efficiency", "financial management").
function extractImportantKeywords(text: string, max: number = 6): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean);

  const stopwords = new Set([
    "this","that","with","from","which","can","help","their","they","them","the","and","for","are","is","was","were","will","would","should","could","to","of","in","on","at","by","as","it","its","a","an","be","or","than","such","also","more","most","very","directly","because","point","tasks","task","issue","issues","company","companies","solution","solutions","product","products","process","processes","topic","topics","pain","point","aligns","purpose","streamlining","management","managements"
  ]);

  const freq: Record<string, number> = {};
  for (const t of tokens) {
    if (t.length <= 3) continue;
    if (stopwords.has(t)) continue;
    freq[t] = (freq[t] || 0) + 1;
  }

  const ranked = Object.entries(freq)
    .sort((a, b) => {
      // sort by frequency desc, then length desc
      if (b[1] !== a[1]) return b[1] - a[1];
      return b[0].length - a[0].length;
    })
    .slice(0, max)
    .map(([word]) => word);

  return ranked;
}

const TopicInsightContent = ({ topic, formData, productSubcategories }: { topic: any, formData: any, productSubcategories: any[] | null }) => {
  const [description, setDescription] = useState<string>(topic.aiDescription || topic.description || "");
  const [keyPoint, setKeyPoint] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchExplanation = async () => {
        setLoading(true);
        const subcat = productSubcategories?.find((item: any) => String(item.id || item.product_sub_category_name) === formData.productSubcategory);
        const subcatName = subcat ? (subcat.product_sub_category_name || subcat.name) : formData.productSubcategory;
        const catName = formData.productCategory;

        if (subcatName && catName) {
            const aiExpl = await explainTopicWithOllama(topic.name, catName, subcatName);
            if (aiExpl) {
                const importantMatch = aiExpl.match(/^\s*Very Important:\s*(.+)$/im);
                const importantRaw = importantMatch ? importantMatch[1].trim() : "";
                const important = importantRaw.replace(/\*/g, "").replace(/^["'`]+|["'`]+$/g, "").trim();
                const trimmedText = aiExpl.replace(/^\s*Very Important:\s*.+$/im, "").trim();
                const sentences = trimmedText.split(/(?<=[.!?])\s+/).slice(0, 3).join(" ").trim();
                setDescription(sentences);
                setKeyPoint(important || deriveKeyPoint(topic.name));
            } else {
                const fallback = `${topic.name} is relevant to ${subcatName} under ${catName}.`;
                setDescription(fallback);
                setKeyPoint(deriveKeyPoint(topic.name));
            }
        } else {
            const fallback = `${topic.name} is a high-intent topic relevant to your search criteria.`;
            setDescription(fallback);
            setKeyPoint(deriveKeyPoint(topic.name));
        }
        setLoading(false);
    };
    fetchExplanation();
  }, [topic.name, formData.productSubcategory, formData.productCategory]);

  const score = topic.aiScore;
  const category = topic.category;
  const theme = topic.theme;

  // Compute a short, high-impact summary (first sentence) for collapsed view.
  const { shortDescription, hasMoreDescription } = React.useMemo(() => {
    if (!description) return { shortDescription: "", hasMoreDescription: false };
    const segments = description.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (segments.length <= 1) {
      return { shortDescription: description, hasMoreDescription: false };
    }
    return {
      shortDescription: segments[0],
      hasMoreDescription: true,
    };
  }, [description]);

  const displayedDescription = isExpanded ? description : shortDescription;

  // Build the list of phrases/keywords we want to visually emphasize inside
  // the explanation paragraph. We always include a few important keywords from
  // the explanation itself and also try to include the derived keyPoint if it
  // appears in the text.
  const highlightPhrases = React.useMemo(() => {
    const baseKeywords = extractImportantKeywords(description, 6);
    const highlights = new Set<string>();

    baseKeywords.forEach((w) => highlights.add(w));

    const topicName = String(topic?.name || "").trim();
    if (topicName) highlights.add(topicName);

    if (keyPoint) {
      // Use shorter chunks from the keyPoint (split on commas/"and") so that
      // they are more likely to appear within the explanation text.
      const pieces = keyPoint
        .split(/[,.;]+| and /i)
        .map((p) => p.trim())
        .filter((p) => p.length > 3);
      pieces.forEach((p) => highlights.add(p));
    }

    return Array.from(highlights);
  }, [description, keyPoint, topic?.name]);
  
  function deriveKeyPoint(name: string): string {
    const n = String(name || "").toLowerCase();
    if (/\bpricing|quote|cost|budget\b/.test(n)) return "Budget readiness and imminent vendor selection";
    if (/\brfi|rfp|tender|bid\b/.test(n)) return "Formal vendor evaluation with defined requirements";
    if (/\bdemo|trial|poc|proof of concept|evaluation\b/.test(n)) return "Hands-on validation indicating near-term purchase intent";
    if (/\bimplementation|deployment|rollout|migration|integration\b/.test(n)) return "Adoption planning with committed project timeline";
    if (/\bcomparison|benchmark|vs\b/.test(n)) return "Competitive assessment and shortlist creation";
    if (/\bcompliance|regulation|security|risk\b/.test(n)) return "Urgent, risk-driven initiative with executive visibility";
    if (/\bsupport|services|integration support\b/.test(n)) return "Post-purchase enablement and long-term usage intent";
    return "Active purchase research by qualified buyers";
  }
  
  const getScoreExplanation = (s: number) => {
      if (s >= 95) return "Exceptional Match: This topic is highly aligned with your product category and ideal customer profile, indicating a very strong intent signal.";
      if (s >= 85) return "Strong Match: This topic shows significant relevance to your target audience and is likely to drive engagement.";
      if (s >= 70) return "Good Match: This topic is relevant but may have a broader scope. It is worth considering for your campaign.";
      return "Potential Match: This topic has some relevance but may require further qualification.";
    };

  return (
      <div className="space-y-6 pt-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
             <h3 className="text-xl font-bold text-gray-900">{topic.name}</h3>
             {loading && <Loader2 className="w-4 h-4 animate-spin text-valasys-orange shrink-0" />}
          </div>
          
          {loading ? (
              <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/6"></div>
              </div>
          ) : (
            <div className="text-sm text-gray-600 leading-relaxed">
              <span>
                {renderHighlightedText(displayedDescription, highlightPhrases)}
                {!isExpanded && hasMoreDescription && " …"}
              </span>
              {hasMoreDescription && (
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="ml-1 text-xs font-semibold text-valasys-orange hover:underline align-baseline inline-flex"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}
          
          {/* {keyPoint && (
            <div className="mt-2 bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-sm text-yellow-900">
              <span className="font-semibold">Very Important:</span> <span className="font-bold">{keyPoint}</span>
            </div>
          )} */}
        </div>

        <div className="space-y-2">
            <div className="flex items-center text-sm">
                <span className="font-semibold text-gray-700 w-32">Topic Category:</span>
                <span className="text-gray-600">{category || 'N/A'}</span>
            </div>
            <div className="flex items-center text-sm">
                <span className="font-semibold text-gray-700 w-32">Topic Theme:</span>
                <span className="text-gray-600">{theme || 'N/A'}</span>
            </div>
        </div>

        {score && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-valasys-orange" />
                        <span className="font-semibold text-gray-900">Score</span>
                   <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-valasys-gray-400 hover:text-valasys-gray-600 cursor-help transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs leading-relaxed">
                        {getScoreExplanation(Number(score))}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{score}%</span>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                        {getScoreExplanation(Number(score))}
                    </p>
                </div>
            </div>
        )}

        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex gap-3 items-start">
            <div className="space-y-1">
                <h4 className="text-sm font-semibold text-orange-900 flex"> <AlertCircle className="w-4 h-4 text-valasys-orange shrink-0 mt-0.5 mr-2" /> AI-Generated Content Disclaimer</h4>
                <p className="text-xs text-orange-800 leading-relaxed">
                    This information is generated by AI and may not be 100% accurate.
                </p>
            </div>
        </div>
      </div>
  );
};

export default function BuildVAISForm() { 
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  // Whether the user has navigated using Next/Previous. Used to avoid
  // auto-highlighting or focusing the first step on initial page load.
  const [navigationStarted, setNavigationStarted] = useState(false);
  const firstRenderRef = useRef(true);
  const [formData, setFormData] = useState<FormData>({
    productSubcategory: "",
    productCategory: "",
    geolocation: [],
    intentTopics: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [geoSearchTerm, setGeoSearchTerm] = useState("");
  const [subcategorySearchTerm, setSubcategorySearchTerm] = useState(""); // NEW: for Product Subcategory dropdown search
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);
  const [filterTopicDropdownOpen, setFilterTopicDropdownOpen] = useState(false);
  const [filterThemeDropdownOpen, setFilterThemeDropdownOpen] = useState(false);

  const [aiTopics, setAiTopics] = useState<AiTopic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [generateTopicsInput, setGenerateTopicsInput] = useState("");
  const [showGenerateResultDialog, setShowGenerateResultDialog] = useState(false);
  const [generateResult, setGenerateResult] = useState<{ domain: string; total: number; shown: number; topics: string[] }>({ domain: '', total: 0, shown: 0, topics: [] });
  const [filterTopic, setFilterTopic] = useState("");
  const [filterTheme, setFilterTheme] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<"none" | "valid" | "invalid">(
    "none",
  );
  const { toggleTaskCompletion } = useTaskManager();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    // {
    //   id: "1",
    //   name: "Software Campaign Q3",
    //   formData: {
    //     productSubcategory: "Software Solutions",
    //     productCategory: "Enterprise Software",
    //     geolocation: ["North America"],
    //     intentTopics: ["Pricing Inquiry", "Product Demo"],
    //   },
    //   createdAt: new Date("2024-08-15"),
    // },
  ]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [loadingSavedSearches, setLoadingSavedSearches] = useState<boolean>(true);
  // number of expected saved searches returned by the backend while loading
  const [expectedSavedSearchesCount, setExpectedSavedSearchesCount] = useState<number | null>(null);
  const [newSearchName, setNewSearchName] = useState("");
  // Persist the last saved filter name so it can be included in the VAIS payload
  const [savedFilterName, setSavedFilterName] = useState<string | null>(null);
  // Track which saved search is currently applied and the prior state to enable reset
  const [activeSavedId, setActiveSavedId] = useState<string | null>(null);
  const [preSavedState, setPreSavedState] = useState<{ formData: FormData; selectedTopics: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const geoSearchInputRef = useRef<HTMLInputElement | null>(null);
  const subcategorySearchInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubcategoryManual, setIsSubcategoryManual] = useState(false);

  const themeSearchInputRef = useRef<HTMLInputElement | null>(null);
  const categorySearchInputRef = useRef<HTMLInputElement | null>(null);
  // Refs to each step container so we can scroll and focus inputs when navigating
  const stepRefs = useRef<Record<number, HTMLDivElement | null>>({ 1: null, 2: null, 3: null, 4: null });
  const dispatch = useDispatch();
  // Prefer user from user slice, fallback to auth slice (where logged-in user is often stored)
  const reduxUser = useSelector((state: RootState) => state.user?.userInfo ?? state.auth?.user);
  // Load saved searches for the current user (if any)
  
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingSavedSearches(true);
        // resolve user id similar to other parts of this component
        let userObj: any = reduxUser;
        if (typeof reduxUser === 'string') userObj = decrypt(reduxUser as string) || reduxUser;
        if (userObj?.user) userObj = userObj.user;
        const userId = userObj?.id ?? userObj?.user_id ?? userObj?._id ?? null;

        const res = await icpService.getSavedSearches(userId);
        const list = Array.isArray(res) ? res : res?.data || res?.result || [];
        // capture expected count for skeletons if available
        try {
          const rawCount = Array.isArray(list)
            ? list.length
            : Array.isArray(res?.data)
              ? res.data.length
              : Array.isArray(res?.result)
                ? res.result.length
                : null;
          if (mounted) setExpectedSavedSearchesCount(rawCount);
        } catch (e) {
          // ignore
        }
        if (!mounted) return;

        const normalized = (list || []).map((s: any) => ({
          id: String(s.id || s._id || s.vais_filter_id),
          name: s.vais_filter_name || s.name || `Saved ${s.id}`,
          formData: {
            productSubcategory: s.product_sub_category_name || s.product_subcategory || s.product_sub_category || '',
            productCategory: s.product_category_name || s.product_category || '',
            geolocation: s.location || s.geolocation || [],
            intentTopics: s.topics || s.intent_topics || [],
          },
          createdAt: s.created_at ? new Date(s.created_at) : new Date(),
        }));

        if (normalized.length > 0) setSavedSearches(normalized);
        else setSavedSearches([]);
      } catch (e) {
        console.warn('Failed to load saved searches', e);
      }
      finally {
        if (mounted) {
          setLoadingSavedSearches(false);
          // clear expected count after we finished loading to avoid stale UI
          setExpectedSavedSearchesCount(null);
        }
      }
    })();
    return () => { mounted = false; };
  }, [reduxUser]);
  // productSubcategories will hold objects when returned by API: { id, product_sub_category_name }
  // Start empty while we fetch actual values from APIs
  const [productCategories, setProductCategories] = useState<string[] | null>(null);
  const [productSubcategories, setProductSubcategories] = useState<any[] | null>(null);
  const [geolocations, setGeolocations] = useState<string[] | null>(null);
  const [userPlanForForm, setUserPlanForForm] = useState<any | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<boolean>(false);
  const [allTopics, setAllTopics] = useState<any[] | null>(null);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(false);
  const [loadingGenerate, setLoadingGenerate] = useState<boolean>(false);
  const [loadingAiGenerate, setLoadingAiGenerate] = useState<boolean>(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>(filterTopics);
  const [themeOptions, setThemeOptions] = useState<string[]>(filterThemes);
  const [visibleCount, setVisibleCount] = useState<number>(50);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [showAllGeos, setShowAllGeos] = useState(false);
  const availableListRef = useRef<HTMLDivElement | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [themeSearchTerm, setThemeSearchTerm] = useState("");
  // Magic Search (FAISS-like, offline)
  const [showMagicSearch, setShowMagicSearch] = useState(false);
  const [magicSearchInput, setMagicSearchInput] = useState("");
  const [isMagicSearching, setIsMagicSearching] = useState(false);
  const [magicSearchError, setMagicSearchError] = useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Only fetch subcategories and countries on mount. Product categories
        // are fetched when a subcategory is selected (to keep category sticky).
        const [subsRes, countriesRes] = await Promise.all([
          icpService.getProductsSubCategory().catch(() => null),
          icpService.getAllCountries().catch(() => null),
        ]);

        if (!mounted) return;

        const normalizeArray = (res: any) => {
          // Try a few common shapes returned by different backends
          if (!res) return null;
          if (Array.isArray(res)) return res;
          // axios-like: response.data could be the array or an object that wraps the array
          if (Array.isArray(res.data)) return res.data;
          if (Array.isArray(res.data?.data)) return res.data.data;
          // specific keys used by our ICP endpoints
          if (Array.isArray(res.data?.product_sub_category_list)) return res.data.product_sub_category_list;
          if (Array.isArray(res.product_sub_category_list)) return res.product_sub_category_list;
          if (Array.isArray(res.data?.product_category_list)) return res.data.product_category_list;
          if (Array.isArray(res.data?.countries)) return res.data.countries;
          if (Array.isArray(res.data?.country_list)) return res.data.country_list;
          // country API: array under result
          if (Array.isArray(res.result)) return res.result;
          return null;
        };

        const subsArr = normalizeArray(subsRes);
        let countriesArr = normalizeArray(countriesRes);

        // Retry countries fetch once if it failed or returned null
        if (!countriesArr) {
          try {
            const retryRes = await icpService.getAllCountries();
            countriesArr = normalizeArray(retryRes);
          } catch (e) {
            // keep fallback
          }
        }

  // if product categories are returned independently, keep them; otherwise
  // categories will be set when a subcategory is selected
  // normalize subcategories
  if (subsArr) setProductSubcategories(subsArr.map((i: any) => {
          // normalize to object { id, product_sub_category_name }
          if (typeof i === 'string') return { id: i, product_sub_category_name: i };
          return { id: i.id ?? i._id ?? i.product_sub_category_id ?? i.product_sub_category_id ?? i.product_sub_category_id, product_sub_category_name: i.product_sub_category_name || i.name || i.product_sub_category || i };
        }));
  if (countriesArr) setGeolocations(countriesArr.map((i: any) => i.country || i.country_name || i.name || i));
      } catch (e) {
        console.warn('Failed to fetch dropdown data', e);
      }
    })();
    // Fetch topics for Available Topics
    (async () => {
      setLoadingTopics(true);
      try {
        const res = await icpService.getAllTopics();
        // normalize different payload shapes
        const topicsArr = Array.isArray(res) ? res : res?.result || res?.data || res?.topics || [];
        if (!mounted) return;
        if (Array.isArray(topicsArr) && topicsArr.length > 0) {
          setAllTopics(topicsArr);
          // derive unique categories and themes from API if present
          const cats = new Set<string>();
          const themes = new Set<string>();
          topicsArr.forEach((t: any) => {
            if (t.category) cats.add(t.category);
            if (t.theme) themes.add(t.theme);
          });
          if (cats.size > 0) setCategoryOptions([...(cats as any)]);
          if (themes.size > 0) setThemeOptions([...(themes as any)]);
        }
      } catch (e) {
        // keep local fallback list (intentTopics) if API call fails
        console.warn('Failed to fetch topics', e);
      } finally {
        setLoadingTopics(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  
const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  useEffect(() => {
    // If no theme selected (or 'all-themes'), clear filtered categories
    // and reset any category filter selection so the category control
    // remains disabled until a valid theme is chosen.
    if (!filterTheme || filterTheme === "all-themes") {
      setFilteredCategories([]);
      setFilterTopic("");
      return;
    }

    const normalizedTheme = filterTheme.toLowerCase();
    const sourceTopics = Array.isArray(allTopics) && allTopics.length > 0 ? allTopics : [];

    let relatedCats: string[] = [];
    if (sourceTopics.length > 0) {
      relatedCats = Array.from(
        new Set(
          sourceTopics
            .filter((t: any) => getTopicThemeValue(t).toLowerCase() === normalizedTheme)
            .map((t: any) => getTopicCategoryValue(t))
            .filter(Boolean),
        ),
      );
    }

    if (relatedCats.length === 0) {
      relatedCats = Array.isArray(categoryOptions) && categoryOptions.length > 0 ? categoryOptions : [];
    }

    setFilteredCategories(relatedCats);

    if (filterTopic && filterTopic !== "all-topics" && !relatedCats.includes(filterTopic)) {
      setFilterTopic("");
    }
  }, [filterTheme, allTopics, categoryOptions, filterTopic]);


  // Log decrypted user id when Build VAIS loads
  React.useEffect(() => {
    try {
      let userObj: any = reduxUser;
      // if the selector returned an encrypted string (persisted form), decrypt it
      if (typeof reduxUser === 'string') {
        userObj = decrypt(reduxUser as string) || reduxUser;
      }

      // If redux state contains a wrapper like { user: { ... } } (some slices use nested shapes), unwrap
      if (userObj?.user) userObj = userObj.user;

      // If still a wrapper (e.g., object with id field), try to extract id
      const userId = userObj?.id ?? userObj?.user_id ?? userObj?._id ?? null;
      if (userId == null) {
        // console.log('BuildVAIS: userId is null - raw reduxUser:', reduxUser, 'decrypted/resolved userObj:', userObj);
      } else {
      
      }
    } catch (e) {
      console.warn('Failed to log decrypted user id', e);
    }
  }, [reduxUser]);

  // Ensure the default localStorage flag is false while the user is on the Build VAIS page.
  // This makes direct navigation to `/vais-results` invalid unless a build completed
  // and set the flag to 'true'. Wrap in try/catch to avoid errors in private mode.
  React.useEffect(() => {
    try {
      // Only set to false when the user actively visits the build page.
      localStorage.setItem('vais_result_build', 'false');
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  // When currentStep changes (after navigation started), smoothly scroll the
  // corresponding step into view and focus the first visible interactive
  // control inside it. Skip the first render to avoid auto-focusing step 1.
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (!navigationStarted) return;

    const container = stepRefs.current[currentStep];
    if (!container) return;

    // Smooth scroll into view (centered)
    try {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
      container.scrollIntoView();
    }

    const isVisible = (el: Element) => {
      if (!(el instanceof HTMLElement)) return false;
      if (el.hasAttribute('disabled')) return false;
      const rects = el.getClientRects();
      if (rects.length === 0) return false;
      const style = window.getComputedStyle(el as HTMLElement);
      if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') return false;
      return true;
    };

    const selectors = 'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [role="combobox"], [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
    const candidates = Array.from(container.querySelectorAll<HTMLElement>(selectors));
    for (const node of candidates) {
      if (!isVisible(node)) continue;
      try {
        node.focus();
        // If it's a text input, place cursor at end
        if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
          const input = node as HTMLInputElement | HTMLTextAreaElement;
          try {
            const len = (input.value || '').length;
            if (typeof input.setSelectionRange === 'function') input.setSelectionRange(len, len);
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        // ignore focus errors
      }
      break;
    }
  }, [currentStep, navigationStarted]);

  // Helper to change steps and mark navigation started
  const goToStep = (step: number) => {
    setNavigationStarted(true);
    setCurrentStep(step);
  };

  // Fetch user plan for stats and limits
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingPlan(true);
        let userObj: any = reduxUser;
        if (typeof reduxUser === 'string') userObj = decrypt(reduxUser as string) || reduxUser;
        if (userObj?.user) userObj = userObj.user;
        const userId = userObj?.id ?? userObj?.user_id ?? userObj?._id ?? null;
        if (!userId) return;
        const resp = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.GET_USER_PLAN, { user_id: userId });
        if (!mounted) return;
        if (resp?.data && resp.data.status === 200) {
          setUserPlanForForm(resp.data.data || null);
        }
      } catch (e) {
        console.warn('Failed to fetch user plan for BuildVAISForm', e);
      } finally {
        if (mounted) setLoadingPlan(false);
      }
    })();
    return () => { mounted = false; };
  }, [reduxUser]);

  // Compute max topics from subscription plan with explicit limits:
  // Free: 3, Growth: 5, Scale: 8, Enterprise: 12
  // Falls back to intent_topics when plan is unknown, otherwise 12.
  const maxTopics = React.useMemo(() => {
    const planNameRaw =
      userPlanForForm?.user_package_name ||
      userPlanForForm?.package_name ||
      null;
    const planName = planNameRaw ? String(planNameRaw).toLowerCase() : null;
    const isFree =
      userPlanForForm?.is_free_trial === true ||
      (planName ? planName.includes("free") : false);
    if (isFree) return 3;
    if (planName) {
      if (planName.includes("growth")) return 5;
      if (planName.includes("scale")) return 8;
      if (planName.includes("enterprise")) return 12;
    }
    const raw = userPlanForForm?.intent_topics;
    const parsed =
      raw == null
        ? NaN
        : typeof raw === "string"
        ? parseInt(raw, 10)
        : Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 12;
  }, [userPlanForForm]);

  // compute available topics using API payload when possible, otherwise fallback
  const availableTopicsSource = allTopics && allTopics.length > 0 ? allTopics : intentTopics.map((t) => ({ name: t.name, category: (t as any).category || null, theme: (t as any).theme || null, conversion: t.conversion }));

  const handleGenerateAiTopics = async () => {
    
    // Scroll after DOM updates
    setTimeout(() => {
      availableListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    if (!formData.productCategory || !formData.productSubcategory) {
        toast({ title: "Missing Information", description: "Please select Product Category and Subcategory first.", variant: "destructive" });
        return;
    }

    // Find the subcategory name if the value is an ID
    const selectedSubcatObj = productSubcategories?.find((item: any) => String(item.id || item.product_sub_category_name) === formData.productSubcategory);
    const subcatName = selectedSubcatObj ? (selectedSubcatObj.product_sub_category_name || selectedSubcatObj.name) : formData.productSubcategory;

    setIsSubcategoryManual(false);
    setLoadingAiGenerate(true);
    try {
        const locationContext = (formData.geolocation || []).join(" ");
        let topics = await getRelevantTopicsFromCsv(
          formData.productCategory,
          subcatName,
          themeOptions || [],
          categoryOptions || [],
          maxTopicsSafe,
          locationContext
        );
        if (!Array.isArray(topics) || topics.length === 0) {
          // Fallback to local FAISS-like scoring against available topics
          const context = `${formData.productCategory} ${subcatName}`;
          topics = buildLocalHighIntentTopics(availableTopicsSource, context, maxTopicsSafe);
        }
        setAiTopics(topics);
        // // Scroll to Available Topics section after generation

        // setTimeout(() => {
          
        // }, 300);
        // toast({ title: "Topics Generated", description: `Found ${topics.length} relevant topics based on your category.` });
    } catch (error) {
        console.error(error);
        // toast({ title: "Error", description: "Failed to generate topics.", variant: "destructive" });
    } finally {
        setLoadingAiGenerate(false);
    }
  };

  const processedTopics = React.useMemo(() => {
      const selectedSubcatObj = productSubcategories?.find((item: any) => String(item.id || item.product_sub_category_name) === formData.productSubcategory);
      const subcatName = selectedSubcatObj ? (selectedSubcatObj.product_sub_category_name || selectedSubcatObj.name) : formData.productSubcategory;
      const locationContext = (formData.geolocation || []).join(" ");
      const baseContext = `${formData.productCategory} ${subcatName} ${locationContext}`.trim();

      // If we have no AI topics from Ollama, build local scores so the UI shows % for each topic
      if (aiTopics.length === 0) {
        const localAi = buildLocalHighIntentTopics(availableTopicsSource, baseContext, availableTopicsSource.length);
        const localMap = new Map(localAi.map(t => [t.topic_name, { score: t.score, description: t.description }]));
        const withScores = availableTopicsSource.map((t: any) => {
          const m = localMap.get(String(t.name));
          return m ? { ...t, aiScore: m.score, aiDescription: m.description } : t;
        });
        return withScores.sort((a: any, b: any) => (b.aiScore || 0) - (a.aiScore || 0));
      }

      const fuse = new Fuse(availableTopicsSource, {
          keys: ['name'],
          threshold: 0.3,
          includeScore: true
      });

      const matchedTopicsMap = new Map<string, { score: number; description: string; category?: string; theme?: string }>();
      // Track which aiTopics were matched to existing available topics
      const matchedAiTopicNames = new Set<string>();

      aiTopics.forEach(aiTopic => {
          const result = fuse.search(aiTopic.topic_name);
          // If we find a close match in available topics, map it
          if (result.length > 0) {
              const bestMatch = result[0].item;
              if (!matchedTopicsMap.has(bestMatch.name)) {
                  matchedTopicsMap.set(bestMatch.name, {
                      score: aiTopic.score,
                      description: aiTopic.description,
                      category: aiTopic.category,
                      theme: aiTopic.theme
                  });
                  matchedAiTopicNames.add(aiTopic.topic_name);
              }
          }
      });

      // 1. Start with available topics, updated with scores where found
      const sorted = [...availableTopicsSource].map(t => {
          const match = matchedTopicsMap.get(t.name);
          if (match) {
              const next: any = { ...t, aiScore: match.score, aiDescription: match.description };
              if (!next.category && match.category) next.category = match.category;
              if (!next.theme && match.theme) next.theme = match.theme;
              return next;
          }
          return t;
      });

      // 2. Identify AI topics that were NOT matched to any available topic
      //    (i.e., new high-intent topics from CSV that aren't in the default list)
      const newTopics = aiTopics
        .filter(t => !matchedAiTopicNames.has(t.topic_name))
        .map(t => ({
           name: t.topic_name,
           description: t.description,
           aiScore: t.score,
           aiDescription: t.description,
           category: t.category || null,
           theme: t.theme || null,
           // Default values for missing fields
           volume: "Medium",
           conversion: "N/A"
        }));

      // 3. Merge and sort by AI score (descending)
      //    Prioritize scored items at the top
      const combined = [...sorted, ...newTopics].sort((a: any, b: any) => {
          const scoreA = a.aiScore || 0;
          const scoreB = b.aiScore || 0;
          if (scoreA !== scoreB) {
              return scoreB - scoreA;
          }
          return 0; // maintain relative order otherwise
      });
      
      return combined;

  }, [availableTopicsSource, aiTopics, formData.productCategory, formData.productSubcategory, formData.geolocation, productSubcategories]);

  const filteredTopics = processedTopics.filter((topic: any) => {
    const name = String(topic.name || "");
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const notSelected = !selectedTopics.includes(name);
    const matchesCategory =
      !filterTopic || filterTopic === "all-topics"
        ? true
        : getTopicCategoryValue(topic).toLowerCase() ===
          filterTopic.toLowerCase();
    const matchesTheme =
      !filterTheme || filterTheme === "all-themes"
        ? true
        : getTopicThemeValue(topic).toLowerCase() ===
          filterTheme.toLowerCase();
    return matchesSearch && notSelected && matchesCategory && matchesTheme;
  });

  const aiSuggestedTopics = React.useMemo(() => {
    if (!aiTopics || aiTopics.length === 0) return [];
    const aiNames = new Set(
      aiTopics.map((t) => String(t.topic_name || "").trim().toLowerCase()),
    );
    return processedTopics.filter((topic: any) => {
      const name = String(topic.name || "");
      return aiNames.has(name.trim().toLowerCase());
    });
  }, [aiTopics, processedTopics]);

  const filteredAiSuggestedTopics = React.useMemo(() => {
    if (!aiSuggestedTopics || aiSuggestedTopics.length === 0) return [];
    const search = searchTerm.toLowerCase();
    return aiSuggestedTopics.filter((topic: any) => {
      const name = String(topic.name || "");
      const matchesSearch = name.toLowerCase().includes(search);
      const notSelected = !selectedTopics.includes(name);
      const matchesCategory =
        !filterTopic || filterTopic === "all-topics"
          ? true
          : getTopicCategoryValue(topic).toLowerCase() ===
            filterTopic.toLowerCase();
      const matchesTheme =
        !filterTheme || filterTheme === "all-themes"
          ? true
          : getTopicThemeValue(topic).toLowerCase() ===
            filterTheme.toLowerCase();
      return matchesSearch && notSelected && matchesCategory && matchesTheme;
    });
  }, [
    aiSuggestedTopics,
    searchTerm,
    selectedTopics,
    filterTopic,
    filterTheme,
  ]);

  const handleTopicSelect = (topicName: string) => {
    if (selectedTopics.includes(topicName)) return;
    setSelectedTopics([...selectedTopics, topicName]);
    // Add micro-interaction animation class
    setTimeout(() => {
      const element = document.querySelector(`[data-topic="${topicName}"]`);
      if (element) {
        element.classList.add("animate-pulse");
        setTimeout(() => element.classList.remove("animate-pulse"), 500);
      }
    }, 100);
    // Keep the search term in the input field instead of clearing it
  };

  const handleTopicRemove = (topic: string) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topic));
  };

  const { toast } = useToast();

  const maxTopicsSafe = React.useMemo(() => {
    const limit = maxTopics && Number.isFinite(maxTopics) ? maxTopics : 0;
    return limit > 0 ? limit : 12;
  }, [maxTopics]);

  const runMagicSearch = async () => {
    const query = magicSearchInput.trim();
    if (!query) return;

    setIsMagicSearching(true);
    setMagicSearchError(null);

    try {
      const ragContext = await fetchRagContext(query);
      const combinedContext = ragContext ? `${query}\n${ragContext}` : query;

      // Build candidate pools with safe fallbacks
      const subcategoryPool =
        productSubcategories && productSubcategories.length > 0
          ? productSubcategories
          : DEFAULT_PRODUCT_SUBCATEGORIES.map((name, idx) => ({
              id: `local-${idx}`,
              product_sub_category_name: name,
            }));

      const geolocationPool =
        geolocations && geolocations.length > 0 ? geolocations : DEFAULT_GEOLOCATIONS;

      const topicPool =
        availableTopicsSource && availableTopicsSource.length > 0
          ? availableTopicsSource
          : intentTopics.map((t) => ({ name: t.name }));

      const themePool =
        themeOptions && themeOptions.length > 0 ? themeOptions : filterThemes;
      const categoryPool =
        categoryOptions && categoryOptions.length > 0 ? categoryOptions : filterTopics;

      // Score subcategories
      const rankedSubcats = scoreCandidates(combinedContext, subcategoryPool, (item: any) =>
        String(item.product_sub_category_name || item.name || item),
      );
      const bestSubcat = rankedSubcats[0]?.item;

      // Geolocations: use Ollama LLM to infer countries directly from the query (no local similarity search)
      let pickedGeos: string[] = [];
      try {
        pickedGeos = await inferCountriesWithOllama(combinedContext, geolocationPool);
      } catch (e) {
        console.warn('Magic Search geolocation inference failed', e);
      }

      // Fetch Category for better topic scoring
      let resolvedCategoryName = "";
      if (bestSubcat) {
        const subValue = String(bestSubcat.id || bestSubcat.product_sub_category_name || bestSubcat);
        try {
          const categoryRes = await icpService.getProductsCategoryForSubcategory(subValue);
          const catArr = Array.isArray(categoryRes)
            ? categoryRes
            : categoryRes?.data?.product_category_list || categoryRes?.product_category_list || categoryRes?.data;
          resolvedCategoryName =
            Array.isArray(catArr) && catArr[0]
              ? catArr[0].product_category_name || catArr[0].name
              : "";
        } catch (err) {
          console.warn("Magic Search category fetch failed", err);
        }
      }

      // Use Category + Subcategory + Location + Query for better relevance
      const subcatName = bestSubcat 
        ? (bestSubcat.product_sub_category_name || bestSubcat.name || String(bestSubcat)) 
        : "";
      const locationStr = pickedGeos.join(" ");

      // Fetch additional RAG context for the subcategory to bridge semantic gaps (e.g. PaaS -> Cloud)
      let subcatRagContext = "";
      if (subcatName) {
         try {
           subcatRagContext = await fetchRagContext(subcatName);
         } catch (e) {
            // ignore
         }
      }
      const enrichedRagContext = [ragContext, subcatRagContext].filter(Boolean).join("\n");
      const enrichedCombinedContext = `${query}\n${enrichedRagContext}`;
      
      const topicScoringContext = `${resolvedCategoryName} ${subcatName} ${locationStr} ${enrichedCombinedContext}`;

      // Apply selections (Category, Subcategory, Location)
      if (bestSubcat) {
        const subValue = String(bestSubcat.id || bestSubcat.product_sub_category_name || bestSubcat);
        setFormData((prev) => ({
          ...prev,
          productSubcategory: subValue,
        }));

        if (resolvedCategoryName) {
            setFormData((prev) => ({ ...prev, productCategory: resolvedCategoryName }));
        }
      }

      if (pickedGeos.length > 0) {
        setFormData((prev) => ({ ...prev, geolocation: pickedGeos }));
      }

      // Generate Intent Topics from CSV + Ollama but DO NOT auto-select them.
      // Instead, populate the "Available Topics" list (aiTopics) so the user can choose.
      let generatedTopicsCount = 0;
      try {
        const generatedTopics = await getRelevantTopicsFromCsv(
          resolvedCategoryName,
          subcatName,
          themePool,
          categoryPool,
          maxTopicsSafe,
          `${locationStr} ${enrichedCombinedContext}`
        );
        if (generatedTopics && generatedTopics.length > 0) {
          setAiTopics(generatedTopics);
          generatedTopicsCount = generatedTopics.length;
        }
      } catch (err) {
        console.error("Error generating topics in Magic Search", err);
      }

      // If CSV+Ollama did not produce topics (e.g., model missing), build local scores so % appears
      if (generatedTopicsCount === 0) {
        const localTopics = buildLocalHighIntentTopics(
          topicPool,
          `${resolvedCategoryName} ${subcatName} ${locationStr} ${enrichedCombinedContext}`,
          Math.max(maxTopicsSafe, 20)
        );
        if (localTopics && localTopics.length > 0) {
          setAiTopics(localTopics);
          generatedTopicsCount = localTopics.length;
        }
      }

      if (!bestSubcat && pickedGeos.length === 0 && generatedTopicsCount === 0) {
        setMagicSearchError("No relevant matches were found for your description. Please try a more specific query.");
        return;
      }

      toast({
        title: "Magic Search Applied",
        description: "Product details and intent topics were auto-filled using LLaMA + Bombora mappings.",
      });
      setShowMagicSearch(false);
    } catch (error) {
      console.error("Magic Search error", error);
      setMagicSearchError("Something went wrong while applying Magic Search. Please try again.");
    } finally {
      setIsMagicSearching(false);
    }
  };

  // Handler for generating topics by domain URL (used by button and Enter key)
  const handleGenerateTopics = async (domain?: string) => {
    const url = (domain ?? generateTopicsInput)?.trim();
    if (!url) return;
    // Show both local spinner and global loader
    dispatch(setLoading({ isLoading: true, message: 'Generating topics...', type: 'TOPIC_SEARCH' }));
    setLoadingGenerate(true);
    try {
      const res = await icpService.getTopicsByUrl(url);
      // Normalize different payload shapes
      const topicsArr = res?.result?.topics || res?.topics || res?.result || res?.data || null;
      if (!Array.isArray(topicsArr) || topicsArr.length === 0) {
        // Show dialog with results (instead of toast)
        setGenerateResult({ domain: url, total: 0, shown: 0, topics: [] });
        setShowGenerateResultDialog(true);
        return;
      }

  // Extract unique topic names (do not cap)
  const names = topicsArr.map((t: any) => String(t.name || t.topic || '').trim()).filter(Boolean);
  const uniqueNames = Array.from(new Set(names));

  // Replace previous selected topics with new topics (full list)
  setSelectedTopics(uniqueNames);

  // Show dialog with results (instead of toast)
  setGenerateResult({ domain: url, total: uniqueNames.length, shown: uniqueNames.length, topics: uniqueNames });
  setShowGenerateResultDialog(true);
    } catch (err: any) {
      console.error('Failed to fetch topics for URL', err);
      toast({ title: 'Failed to generate topics', description: err?.message || 'Please try again', variant: 'default' });
    } finally {
      setLoadingGenerate(false);
      dispatch(setLoading({ isLoading: false }));
    }
  };

  const handleFileUpload = (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
 
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain"
    ];

    const isValidFormat = validTypes.includes(file.type) || /\.(xls|xlsx|csv|txt)$/i.test(file.name);
  
    if (!isValidFormat) {
      console.warn('Invalid file format:', file.type, file.name);
      toast({
        title: "Upload Error",
        description: `Invalid file format: ${file.name}. Only CSV, Excel (.xls, .xlsx), and TXT files are allowed.`,
        variant: "destructive",
      });
      setFileStatus("invalid");
      fileInputRef.current.value = '';
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "Upload Error",
        description: `File exceeding 5 MB limit: ${file.name}`,
        variant: "destructive",
      });
      setFileStatus("invalid");
      fileInputRef.current.value = '';
      return;
    }

    const validExtensions = [".xlsx", ".csv", ".txt"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setFileStatus("invalid");
      fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setFileStatus("none");

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Domain checking logic
    const checkForDomainColumn = (file: File): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const result = e.target?.result;
            let hasDomainColumn = false;

            if (file.name.endsWith('.csv') || file.type === 'text/csv' || file.name.endsWith('.txt')) {
              const text = typeof result === 'string' ? result : new TextDecoder().decode(result as ArrayBuffer);
              const lines = text.split(/\r?\n/).filter(Boolean);
              
              if (lines.length > 0) {
                const headers = lines[0].split(/,|;|\t/).map(h => h.trim());
                hasDomainColumn = headers.some(
                  (h: string) => h === 'Domain' || h === 'Domains' || h === 'domain' || h === 'domains'
                );
              }
            } else if (file.name.endsWith('.xlsx') || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
              // For Excel files, we'll assume domain column might exist
              // In a real implementation, you'd parse the Excel file here
              hasDomainColumn = true; // Assume true for Excel since we can't parse without XLSX
            }

            if (hasDomainColumn) {
              resolve(true);
            } else {
              reject(new Error("No domain column found"));
            }
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };

        if (file.name.endsWith('.xlsx')) {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsText(file);
        }
      });
    };

    // Check for domain column and stop upload if not found
    checkForDomainColumn(file).then((hasDomainColumn) => {
      // Domain column found - complete the upload
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadedFile(file);
        setFileStatus("valid");
        setIsUploading(false);
      }, 1200);
    }).catch((error) => {
      console.error('Domain check failed:', error);
      // Stop upload - clear progress and show error
      clearInterval(progressInterval);
      setUploadProgress(0);
      setIsUploading(false);
      setFileStatus("invalid");
      fileInputRef.current.value = '';
      
      toast({
        title: "Upload Failed",
        description: "Uploaded file must contain a 'Domain' column.",
        variant: "destructive",
      });
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    // alert("coming -drop")
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSaveSearch = () => {
    if (newSearchName.trim()) {
      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        name: newSearchName,
        formData: { ...formData, intentTopics: selectedTopics },
        createdAt: new Date(),
      };
      setSavedSearches([...savedSearches, newSearch]);
  // remember the saved name so the subsequent Build action can send it
  setSavedFilterName(newSearchName.trim());
  setNewSearchName("");
  setShowSaveDialog(false);
    }
  };

  const loadSavedSearch = (search: SavedSearch) => {
       // Remember the current manual state the first time a saved search is applied
      setPreSavedState((prev) => prev ?? { formData, selectedTopics });
      setFormData(search.formData);
      setSelectedTopics(search.formData.intentTopics);
  setActiveSavedId(search.id);
  setIsSubcategoryManual(false);

  };

type HelpTooltipProps = {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
};

  const HelpTooltip = ({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 5,
}: HelpTooltipProps) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent
      side={side}
      align={align}
      sideOffset={sideOffset}
      className="max-w-xs font-normal"
    >
      <p className="text-sm">{content}</p>
    </TooltipContent>
  </Tooltip>
);

  const resetSavedSearch = () => {

    // Clear all filters to defaults (full reset)

    setFormData({ productSubcategory: "", productCategory: "", geolocation: [], intentTopics: [] });

    setSelectedTopics([]);

    setActiveSavedId(null);

    setPreSavedState(null);
    setIsSubcategoryManual(false);

  };

  

  const getStepProgress = () => {
    let progress = 0;
    if (formData.productSubcategory && formData.geolocation.length > 0)
      progress = 25;
    if (selectedTopics.length > 0) progress = 50;
    if (uploadedFile) progress = 75;
    if (progress === 75 && isFormValid()) progress = 100;
    return progress;
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.productSubcategory && formData.geolocation.length > 0;
      case 2:
        return selectedTopics.length > 0;
      case 3:
        return uploadedFile && fileStatus === "valid"; // Only green when file is uploaded and valid
      case 4:
        return isFormValid();
      default:
        return false;
    }
  };

  const isFormValid = () => {
    return (
      formData.productSubcategory &&
      formData.geolocation.length > 0 &&
      selectedTopics.length > 0 && 
      selectedTopics.length <= maxTopics 
    );
  };

  // console.log('BuildVAISForm render: formData=', formData);

  const handleBuildVAIS = () => {
    (async () => {
      // authService returns a typed AuthUser; cast to any to safely access dynamic fields
      const currentUser: any = authService.getCurrentUser() as any;
      const userId = currentUser?.id ?? currentUser?.user_id ?? currentUser?._id ?? null;

  const filterNameToSend = (savedFilterName && savedFilterName.trim()) ? savedFilterName.trim() : (newSearchName && newSearchName.trim() ? newSearchName.trim() : '');

  const payload = {
        // Ensure the "view" field sends a human-readable name, not an id.
        // formData.productSubcategory / productCategory may contain either an id or a name
        // depending on where they were populated from. Try to resolve to a name
        // by looking up the objects returned by the APIs (productSubcategories / productCategories).
        // If resolution fails, fall back to the raw form values.
        product_category_name_view: (
          // try subcategory name lookup first
          ((): string => {
            const tryVal = formData.productSubcategory || formData.productCategory || '';
            // helper to resolve a name from a list
            const resolveFromList = (val: any, list: any[] | null) => {
              if (!val || !list || !Array.isArray(list)) return null;
              // Prefer common name fields, otherwise coerce string values
              for (const item of list) {
                try {
                  if (item == null) continue;
                  // if list items are primitives (strings), match directly
                  if (typeof item === 'string' && String(item) === String(val)) return item;
                  // match id-like fields
                  if (typeof item === 'object') {
                    if (['id', 'value', 'pk'].some(k => String(item[k]) === String(val))) {
                      return String(item.product_sub_category_name ?? item.product_category_name ?? item.name ?? item.title ?? val);
                    }
                    // match by name fields
                    if (['product_sub_category_name', 'product_category_name', 'name', 'title'].some(k => String(item[k]) === String(val))) {
                      return String(item.product_sub_category_name ?? item.product_category_name ?? item.name ?? item.title ?? val);
                    }
                  }
                } catch (e) {
                  // ignore lookup errors and continue
                }
              }
              return null;
            };

            // Try resolving from productSubcategories first
            const subResolved = resolveFromList(formData.productSubcategory, productSubcategories);
            if (subResolved) return subResolved;

            // Then try productCategories
            const catResolved = resolveFromList(formData.productCategory, productCategories as any[] | null);
            if (catResolved) return catResolved;

            // Fallback: if the form values are strings, return them as-is
            return String(tryVal || '');
          })()
        ),
        product_category_name: formData.productCategory || '',
        product_sub_category_name: formData.productSubcategory || '',
        // prefer location but include geolocation for legacy backends
        location: formData.geolocation || [],
        // geolocation: formData.geolocation || [],
        topics: selectedTopics || [],
        // intent_topics: selectedTopics || [],
        page: 1,
        user_id: userId,
        // If the user provided a save name in the Save dialog, send it and mark to save
  vais_filter_name: filterNameToSend,
  is_save_filter: Boolean(filterNameToSend),
        is_credit: true,
      } as any;

      try {
        setIsSaving(true);
        dispatch(setLoading({ isLoading: true, message: 'Building VAIS...', type: 'ICP_SCORE' }));
        const res = await icpService.getIcpScore(payload);

        // res expected: { status, message, data: [...] }
        if (res && res.status === 200) {
           // Mark VAIS results generated for mastery progress
            //  markStepCompleted("vaisResultsGenerated");
          // store full response and individual data array
          dispatch(setICPScore(res));
          // persist initial payload (filters) into redux and localStorage for VAISResults to reuse
          try {
            dispatch(setICPFilters(payload));
            localStorage.setItem('icp_payload', JSON.stringify(payload));
          } catch (e) {
            // ignore storage errors
          }
          if (Array.isArray(res.data)) {
            dispatch(setICPData(res.data));
            // Basic pagination: set totalCount and currentPage if available in res
            dispatch(setPagination({ currentPage: payload.page, totalPages: 0, totalCount: res.data.length }));
          }
          try {
            // Mark that VAIS was built so direct URL access to results is allowed
            localStorage.setItem('vais_result_build', 'true');
          } catch (e) {
            // ignore localStorage errors (e.g., private mode)
          }
          navigate('/vais-results');
        } else {
          window.alert(res?.message || 'Failed to build VAIS.');
        }
      } catch (err: any) {
        console.error('Error fetching ICP score', err);
        window.alert(err?.response?.data?.message || 'Failed to build VAIS. Please try again.');
      } finally {
        setIsSaving(false);
        dispatch(setLoading({ isLoading: false }));
      }
    })();
  };



  return (
    <TooltipProvider>
      <div className="w-full space-y-6">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex flex-col lg:flex-row items-start lg:justify-between mb-6 gap-3">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-valasys-gray-900 flex items-center flex-nowrap whitespace-nowrap truncate max-w-full">
                <div className="w-8 h-8 rounded-lg bg-primary hover:bg-primary/80 bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white border-transparent flex items-center justify-center mr-3">
                  <Bot className="w-5 h-5 text-white" />
                </div>
               Build VAIS with Intent
              </h1>
              <p className="text-valasys-gray-600">
                Configure your Valasys AI Score parameters to generate personalized ABM list. 
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
              
              {userPlanForForm && (() => {
                const abm = userPlanForForm.abm_limit ?? 0;
                const lal = userPlanForForm.lal_limit ?? 0;
                const prospect = userPlanForForm.prospect_credits ?? 0;
                const available = typeof userPlanForForm.available_credits === 'number' ? userPlanForForm.available_credits : Number(userPlanForForm.available_credits) || 0;
                const vais = Math.max(0, available - (abm + lal + prospect));
                if (userPlanForForm.is_free_trial === true) {
                  return (
                    <FloatingStatsWidget
                      creditsBreakdown={{ abm, lal, prospect, vais }}
                      className="w-full lg:w-auto"
                      stats={[
                        // { label: 'Search Left', value: typeof userPlanForForm.searches_left === 'number' ? userPlanForForm.searches_left : (userPlanForForm.searches_left ?? '—'), color: 'red' as const },
                        { label: 'Credits Left', value: typeof userPlanForForm.available_credits === 'number' ? String(userPlanForForm.available_credits).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : (userPlanForForm.available_credits ?? '—'), color: 'green' as const }
                      ]}
                    />
                  );
                } else {
                  return (
                    <FloatingStatsWidget
                      className="w-full lg:w-auto"
                      showTooltipAndInfoIcon={false}
                      stats={[
                        // { label: 'Search Left', value: typeof userPlanForForm.searches_left === 'number' ? userPlanForForm.searches_left : (userPlanForForm.searches_left ?? '—'), color: 'red' as const },
                        { label: 'Credits Left', value: typeof userPlanForForm.available_credits === 'number' ? String(userPlanForForm.available_credits).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : (userPlanForForm.available_credits ?? '—'), color: 'green' as const }
                      ]}
                    />
                  );
                }
              })()}
            </div>
          </div>
        </div>

        {/* Enhanced Steps Progress */}
        <Card className="hidden md:block bg-gradient-to-r from-valasys-orange/5 to-valasys-blue/5 border-valasys-orange/20">
          <CardHeader>
            {/* Step Progress Indicator */}
            <div className="space-y-4">
              <div className="flex flex-row items-center gap-2 md:gap-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = navigationStarted && currentStep === step.id;
                  const isCompleted = isStepValid(step.id);

                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center",
                        index === steps.length - 1 ? "" : "flex-1"
                      )}
                    >
                       <div className="flex flex-col items-center">
                          <div
                          className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all flex-shrink-0",
                            isActive
                              ? "border-valasys-orange bg-valasys-orange text-white"
                              : isCompleted
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-gray-300 bg-white text-gray-400",
                          )}
                        >
                          {isCompleted && !isActive ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <StepIcon className="w-5 h-5" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "mt-2 text-xs sm:text-sm font-medium text-center",
                            isActive
                              ? "text-valasys-orange"
                              : isCompleted
                                ? "text-green-600"
                                : "text-gray-500",
                          )}
                        >
                          {step.name}
                        </span>
                       </div>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            "hidden lg:block h-1 mx-4 flex-1 rounded-full",
                            isCompleted ? "bg-green-500" : "bg-gray-300",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {/* <Progress value={getStepProgress()} className="h-2" /> */}
            </div>
          </CardHeader>
        </Card>

        {/* Saved Searches */}
        {loadingSavedSearches ? (
          <div data-tour="vais-saved-searches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2 text-valasys-orange" />
                  Access one of your previous searches. 
                </CardTitle>
                 <Button variant="ghost" size="sm" onClick={resetSavedSearch}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {/* Skeletons mirror the saved-search button: icon, name, topics badge */}
                  {Array.from({ length: expectedSavedSearchesCount ?? 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center space-x-2 px-3 py-1 rounded-[10px] bg-white border border-gray-200"
                    >
                      <div className="w-4 h-4 rounded-[4px] bg-gray-200 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
                      <div>
                        <div className="inline-block bg-gray-200 rounded-full mt-2 w-12 h-4 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : savedSearches.length > 0 && (
          <div data-tour="vais-saved-searches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2 text-valasys-orange" />
                  Access one of your previous searches. 
                   <Button variant="ghost" size="sm" onClick={resetSavedSearch} disabled={!activeSavedId}  className="ml-auto flex items-center">

                    <RotateCcw className="w-4 h-4 mr-1 float-right" />

                    Reset

                  </Button>
                </CardTitle>
                 

                
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {savedSearches.map((search) => (
                    <Button
                      key={search.id}
                       variant={activeSavedId === search.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => loadSavedSearch(search)}
                        aria-pressed={activeSavedId === search.id}

                      className={`flex items-center space-x-2 ${

                        activeSavedId === search.id

                          ? 'bg-valasys-orange text-white border-valasys-orange hover:bg-valasys-orange/90'

                          : ''

                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>{search.name}</span>
                      <Badge  variant={activeSavedId === search.id ? "default" : "secondary"} className="ml-1 bg-white text-valasys-gray-800  hover:bg-white">
                        {search.formData.intentTopics.length} topics
                      </Badge> 
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Product Configuration */}
            <div data-tour="vais-product-config" ref={(el) => (stepRefs.current[1] = el)}>
              <Card
                className={cn(
                  "transition-all duration-200",
                  navigationStarted && currentStep === 1
                    ? "ring-2 ring-valasys-orange/50 shadow-lg"
                    : "",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg font-semibold">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                          isStepValid(1)
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600",
                        )}
                      >
                          {isStepValid(1) ? <Check className="w-4 h-4" /> : "1"}
                        </div>
                      Product Configuration
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        setMagicSearchInput("");
                        setMagicSearchError(null);
                        setShowMagicSearch(true);
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Magic Search
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <HelpTooltip content="Specify your product subcategory to build an accurate ABM">
                      <Label htmlFor="subcategory" className="flex items-center cursor-help">
                        My Product Subcategory                        
                        <span style={{ color: "#ff2929" }}>&nbsp;*</span>
                        <Info className="w-3 h-3 ml-1 text-gray-400" />
                      </Label>
                     </HelpTooltip>
                      <div className="relative">
                        <Select
                          value={formData.productSubcategory}
                          open={subcategoryDropdownOpen}
                          onOpenChange={(isOpen) => {
                            setSubcategoryDropdownOpen(isOpen);
                            // Focus the search input when dropdown opens
                            if (isOpen) {
                              setTimeout(() => {
                                try {
                                  subcategorySearchInputRef?.current?.focus();
                                } catch (e) {
                                  // ignore focus errors
                                }
                              }, 0);
                            }
                          }}
                          onValueChange={async (value) => {
                            setIsSubcategoryManual(true);
                            setFormData({ ...formData, productSubcategory: value });
                            setSubcategorySearchTerm("");
                            try {
                              const categoryRes = await icpService.getProductsCategoryForSubcategory(value);
                              const catArr = Array.isArray(categoryRes) ? categoryRes : categoryRes?.data?.product_category_list || categoryRes?.product_category_list || categoryRes?.data;
                              const catName = (Array.isArray(catArr) && catArr[0]) ? (catArr[0].product_category_name || catArr[0].name) : undefined;
                              if (catName) {
                                setFormData((f) => ({ ...f, productCategory: catName }));
                              }
                            } catch (err) {
                              console.warn('Failed to fetch product category for subcategory', err);
                            }
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "min-h-[40px]",
                              formData.productSubcategory
                                ? "border-green-300"
                                : "",
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-sm">
                                {formData.productSubcategory
                                  ? productSubcategories?.find((item: any) => String(item.id || item.product_sub_category_name) === formData.productSubcategory)?.product_sub_category_name || "Select Product Subcategory"
                                  : "Select Product Subcategory"}
                              </span>
                            </div>
                          </SelectTrigger>
                          <SelectContent className="w-[--radix-select-trigger-width] max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px] overflow-y-auto">
                            {/* Search Input */}
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                  ref={subcategorySearchInputRef}
                                  placeholder="Search subcategories..."
                                  value={subcategorySearchTerm}
                                  onChange={(e) => setSubcategorySearchTerm(e.target.value)}
                                  onKeyDown={(e) => e.stopPropagation()}
                                  onKeyUp={(e) => { e.stopPropagation(); }}
                                  onKeyPress={(e) => { e.stopPropagation(); }}
                                  onClick={(e) => { e.stopPropagation(); }}
                                  className="pl-8 h-8"
                                />
                              </div>
                            </div>

                            {/* Options */}
                            <div className="max-h-48 overflow-y-auto text-sm">
                            {productSubcategories === null ? (
                              <div className="p-2 text-sm text-gray-500">Loading...</div>
                            ) : (
                              <>
                                {/* Subcategory List */}
                                {productSubcategories
                                  .filter((item: any) =>
                                    String(item.product_sub_category_name || '')
                                      .toLowerCase()
                                      .includes(subcategorySearchTerm.toLowerCase())
                                  )
                                  .map((item: any) => {
                                    const itemValue = String(item.id || item.product_sub_category_name);
                                    const isSelected = formData.productSubcategory === itemValue;
                                    return (
                                      <div
                                        key={itemValue}
                                        onClick={async () => {
                                          setIsSubcategoryManual(true);
                                          setFormData({ ...formData, productSubcategory: itemValue });
                                          setSubcategorySearchTerm("");
                                          setSubcategoryDropdownOpen(false);
                                          try {
                                            const categoryRes = await icpService.getProductsCategoryForSubcategory(itemValue);
                                            const catArr = Array.isArray(categoryRes) ? categoryRes : categoryRes?.data?.product_category_list || categoryRes?.product_category_list || categoryRes?.data;
                                            const catName = (Array.isArray(catArr) && catArr[0]) ? (catArr[0].product_category_name || catArr[0].name) : undefined;
                                            if (catName) {
                                              setFormData((f) => ({ ...f, productCategory: catName }));
                                            }
                                          } catch (err) {
                                            console.warn('Failed to fetch product category for subcategory', err);
                                          }
                                        }}
                                        className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-[10px] hover:bg-accent hover:text-accent-foreground"
                                      >
                                        <div className="w-5 flex-shrink-0">
                                          {isSelected && <Check className="w-4 h-4 text-current" />}
                                        </div>
                                        <span>{item.product_sub_category_name}</span>
                                      </div>
                                    );
                                  })}

                                {/* No results */}
                                {productSubcategories.filter((item: any) =>
                                  String(item.product_sub_category_name || '')
                                    .toLowerCase()
                                    .includes(subcategorySearchTerm.toLowerCase())
                                ).length === 0 && (
                                  <div className="p-2 text-sm text-gray-500 text-center">
                                    No subcategories found
                                  </div>
                                )}
                              </>
                            )}
                            </div>
                          </SelectContent>
                        </Select>
                        {formData.productSubcategory && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({ ...formData, productSubcategory: "", productCategory: "" });
                              setSubcategorySearchTerm("");
                              setIsSubcategoryManual(false);
                            }}
                            aria-label="Clear selection"
                          >
                            <X className="w-3 h-3 text-gray-400" />
                          </Button>
                        )}
                        
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="flex items-center ">My Product Category</Label>
                      <Select value={formData.productCategory} disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Product Category" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px] overflow-y-auto">
                          {formData.productCategory ? (
                            <SelectItem key={formData.productCategory} value={formData.productCategory}>
                              {formData.productCategory}
                            </SelectItem>
                          ) : productCategories === null ? (
                            <div className="p-2 text-sm text-gray-500">Loading...</div>
                          ) : (
                            productCategories.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <HelpTooltip content="Narrow your ABM list by choosing your targeted location">
                      <Label htmlFor="geolocation" className="flex items-center cursor-help">
                        <MapPin className="w-4 h-4 mr-1" />
                        Geolocation <span style={{ color: "#ff2929" }}>&nbsp;*</span>
                         <Info className="w-3 h-3 ml-1 text-gray-400" />
                      </Label>
                       </HelpTooltip>
                      {/* {formData.geolocation.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              geolocation: [],
                            });
                            setGeoSearchTerm("");
                             
                          }}
                        >
                          Clear
                        </Button>
                      )} */}
                    </div>

                    {/* Enhanced Multi-select Geolocation with Search */}
                    <div className="space-y-3" >
                      <div className="relative">
                        <Select
                          onOpenChange={(isOpen) => {
                            if (isOpen) setShowAllGeos(false);
                            // Focus the search input when dropdown opens
                            if (isOpen) {
                              setTimeout(() => {
                                try {
                                  geoSearchInputRef?.current?.focus();
                                } catch (e) {
                                  // ignore focus errors
                                }
                              }, 0);
                            }
                          }}
                          onValueChange={(value) => {
                            if (value === "select-all") {
                              setFormData({
                                ...formData,
                                geolocation: [...geolocations],
                              });
                            } else if (!formData.geolocation.includes(value)) {
                              setFormData({
                                ...formData,
                                geolocation: [...formData.geolocation, value],
                              });
                            }
                            setGeoSearchTerm("");
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "min-h-[40px]",
                              formData.geolocation.length > 0
                                ? "border-green-300"
                                : "",
                            )}
                            onClick={() => setShowAllGeos(false)}
                            onPointerDown={() => setShowAllGeos(false)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-sm">
                                {formData.geolocation.length > 0
                                  ? `${formData.geolocation.length} selected`
                                  : "Select target geographies"}
                              </span>
                            </div>
                          </SelectTrigger>
                         <SelectContent className="max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px] overflow-y-auto">
                          {/* Search Input */}
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                ref={geoSearchInputRef}
                                placeholder="Search geographies..."
                                value={geoSearchTerm}
                                onChange={(e) => setGeoSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="pl-8 h-8"
                              />
                            </div>
                          </div>

                          {/* Options */}
                          <div className="max-h-48 overflow-y-auto text-sm">
                            {geolocations === null ? (
                              <div className="p-2 text-sm text-gray-500">Loading...</div>
                            ) : (
                              <>
                                {/* Select All */}
                                <div
                                  onClick={() => {
                                    if (formData.geolocation.length === geolocations.length) {
                                      setFormData({ ...formData, geolocation: [] });
                                    } else {
                                      setFormData({ ...formData, geolocation: [...geolocations] });
                                    }
                                  }}
                                  className="flex items-center gap-2 px-2 py-2 mb-1 cursor-pointer font-medium border-b border-gray-200 rounded-[10px]  hover:bg-accent hover:text-accent-foreground "
                                >
                                  <div className="w-5 flex-shrink-0">
                                    {formData.geolocation.length === geolocations.length && (
                                      <Check className="w-4 h-4 text-current" />
                                    )}
                                  </div>
                                  <span>Select All</span>
                                </div>

                                {/* Country List */}
                                {geolocations
                                  .filter((item) =>
                                    item.toLowerCase().includes(geoSearchTerm.toLowerCase())
                                  )
                                  .map((item) => {
                                    const selected = formData.geolocation.includes(item);
                                    return (
                                      <div
                                        key={item}
                                        onClick={() => {
                                          if (selected) {
                                            setFormData({
                                              ...formData,
                                              geolocation: formData.geolocation.filter((x) => x !== item),
                                            });
                                          } else {
                                            setFormData({
                                              ...formData,
                                              geolocation: [...formData.geolocation, item],
                                            });
                                          }
                                        }}
                                        className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-[10px]  hover:bg-accent hover:text-accent-foreground "
                                      >
                                        <div className="w-5 flex-shrink-0">
                                          {selected && <Check className="w-4 h-4 text-current" />}
                                        </div>
                                        <span>{item}</span>
                                      </div>
                                    );
                                  })}

                                {/* No results */}
                                {geolocations.filter((item) =>
                                  item.toLowerCase().includes(geoSearchTerm.toLowerCase())
                                ).length === 0 && (
                                  <div className="p-2 text-sm text-gray-500 text-center">
                                    No geographies found
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </SelectContent>
                        </Select>
                        {formData.geolocation.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({
                                ...formData,
                                geolocation: [],
                              });
                              setGeoSearchTerm("");
                            }}
                            aria-label="Clear geolocation selection"
                          >
                            <X className="w-3 h-3 text-gray-400" />
                          </Button>
                        )}
                      </div>

                      {formData.geolocation.length > 0 && (
                       <div className="space-y-2 h-[73px] overflow-y-auto">
                          <div className="flex flex-wrap gap-2">
                              {(() => {
                              const MAX_VISIBLE = 6; // show up to this many chips including the +N chip
                              const total = formData.geolocation.length;

                              // If user toggled expanded view, show full list
                              if (showAllGeos) {
                                return formData.geolocation.map((location) => (
                                  <div
                                    key={location}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                                  >
                                    <span>{location}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData({
                                          ...formData,
                                          geolocation: formData.geolocation.filter(
                                            (l) => l !== location,
                                          ),
                                        });
                                      }}
                                      className="ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ));
                              }

                              if (total <= MAX_VISIBLE) {
                                return formData.geolocation.map((location) => (
                                  <div
                                    key={location}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                                  >
                                    <span>{location}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData({
                                          ...formData,
                                          geolocation: formData.geolocation.filter(
                                            (l) => l !== location,
                                          ),
                                        });
                                      }}
                                      className="ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ));
                              }

                              // If more than MAX_VISIBLE, show first (MAX_VISIBLE - 1) and a final +N chip
                              const visible = formData.geolocation.slice(0, MAX_VISIBLE - 1);
                              const extraCount = total - visible.length;
                              return (
                                <>
                                  {visible.map((location) => (
                                    <div
                                      key={location}
                                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                                    >
                                      <span>{location}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setFormData({
                                            ...formData,
                                            geolocation: formData.geolocation.filter(
                                              (l) => l !== location,
                                            ),
                                          });
                                        }}
                                        className="ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}

                                  <button
                                    key="more"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowAllGeos(true);
                                    }}
                                    title={`${total} selected`}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                                  >
                                    <span>+{extraCount}</span>
                                  </button>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end flex-wrap md:flex-nowrap">
                    <Button
                      onClick={() => goToStep(2)}
                      disabled={!isStepValid(1)}
                    >
                      <ArrowRight className="w-4 h-4 " />
                      Next: Select Topics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step 2: Intent Topics Selection */}
            <div data-tour="vais-intent-topics" ref={(el) => (stepRefs.current[2] = el)}>
              <Card
                className={cn(
                  "transition-all duration-200",
                  navigationStarted && currentStep === 2
                    ? "ring-2 ring-valasys-orange/50 shadow-lg"
                    : "",
                )}
              >
                <CardHeader>
                  <CardTitle >
                  <div className="flex flex-col space-y-3 lg:hidden">
                      <div className="flex justify-end">
                       <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleGenerateAiTopics} 
                        disabled={!formData.productCategory || !formData.productSubcategory || loadingAiGenerate}
                        className="glow-on-hover h-8 rounded-full border-2 border-transparent bg-white text-gray-900 hover:bg-gray-50 transition-all shadow-sm "
                        style={{
                              backgroundImage: "linear-gradient(#fff, #fff), linear-gradient(90deg, #3b82f6, #22c55e, #eab308, #ef4444)",
                              backgroundOrigin: "border-box",
                              backgroundClip: "padding-box, border-box",
                              fontSize: "13px"
                        }}
                      >
                        {loadingAiGenerate ? <Loader2 className="animate-spin w-3 h-3 " /> : <Sparkles className="w-3 h-3" />}
                        AI Suggest Topics
                      </Button>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg",
                            isStepValid(2)
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600",
                          )}
                        >
                          {isStepValid(2) ? <Check className="w-4 h-4" /> : "2"}
                        </div>
                        <span className="whitespace-nowrap text-lg">
                          Select Intent Topics{" "}
                          <span style={{ color: "#ff2929" }}>*</span>
                        </span>
                      </div>
                    </div>
                     {/* Desktop View*/}
                    <div className="hidden lg:flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                          isStepValid(2)
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {isStepValid(2) ? <Check className="w-4 h-4" /> : "2"}
                      </div>

                        <HelpTooltip content={`Choose up to ${maxTopics} topics that resonate with your Product Subcategory`}>
                      <Label htmlFor="intenttopics" className="flex items-center cursor-help text-lg font-semibold">
                       Select Intent Topics <span className="text-red-500 text-sm">&nbsp;*</span>
                         <Info className="w-3 h-3 ml-1 text-gray-400" />
                      </Label>
                       </HelpTooltip>
                    </div>
                     <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleGenerateAiTopics} 
                        disabled={!formData.productCategory || !formData.productSubcategory || loadingAiGenerate}
                        className="glow-on-hover h-8 rounded-full border-2 border-transparent bg-white text-gray-900 hover:bg-gray-50 transition-all shadow-sm "
                        style={{
                              backgroundImage: "linear-gradient(#fff, #fff), linear-gradient(90deg, #3b82f6, #22c55e, #eab308, #ef4444)",
                              backgroundOrigin: "border-box",
                              backgroundClip: "padding-box, border-box",
                              fontSize: "13px"
                        }}
                      >
                        {loadingAiGenerate ? <Loader2 className="animate-spin w-3 h-3 " /> : <Sparkles className="w-3 h-3" />}
                        AI Suggest Topics
                      </Button>
                    </div>
                  </CardTitle>
                  {/* <p className="text-sm text-valasys-gray-600">
                    Select the intent topics
                  </p> */}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Generate Topics Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-black">
                        Generate Topics{" "}
                        {/* show counter here only when there are no selected topics */}
                        {selectedTopics.length === 0 && (
                          <span
                            className={
                              selectedTopics.length > maxTopics
                                ? "text-[#ff2929]"
                                : "text-green-600 text-sm"
                            }
                          >
                            ({selectedTopics.length}/{maxTopics} Intent topics{" "}
                            {selectedTopics.length > maxTopics
                              ? "limit is exceeded."
                              : "are selected"}
                            )
                          </span>
                        )}
                      </Label>
                      
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="https://www.bombora.com"
                        value={generateTopicsInput}
                        onChange={(e) => setGenerateTopicsInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            void handleGenerateTopics();
                          }
                        }}
                        className="pr-10"
                        aria-label="Generate topics by domain"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => void handleGenerateTopics()}
                        aria-label="Search topics"
                        disabled={loadingGenerate}
                      >
                        {loadingGenerate ? (
                          <Loader2 className="w-4 h-4 text-valasys-orange animate-spin" />
                        ) : (
                          <Search className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center  ">
                      <Label className="text-sm font-medium text-valasys-gray-700">
                        Topics
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="inline-flex items-center justify-center w-5 h-5 rounded-full  cursor-help">
                            <Info className="w-3 h-3 text-gray-400" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">Search intent topics to target specific buyer behaviors and get more precise results</p>
                        </TooltipContent>
                      </Tooltip></div>
                     <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-valasys-gray-400" />
                      <Input
                        placeholder="Search intent topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {searchTerm && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() => setSearchTerm("")}
                          aria-label="Clear search"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </Button>
                      )}
                    </div>
                  </div>      
                 

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <HelpTooltip content="Pick a theme to quickly filter available intent topics.">
                    <Label htmlFor="filterTheme" className="flex items-center cursor-help">
                     Filter Topic by Theme
                         <Info className="w-3 h-3 ml-1 text-gray-400" />
                      </Label>
                       </HelpTooltip>
                      <div className="relative">
                        <Select value={filterTheme} 
                          open={filterThemeDropdownOpen}
                          onOpenChange={(isOpen) => {
                          setFilterThemeDropdownOpen(isOpen)
                          if (isOpen) {
                            setTimeout(() => {
                              try {
                                themeSearchInputRef?.current?.focus();
                              } catch (e) {
                                // ignore focus errors
                              }
                            }, 0);
                          }
                        }} onValueChange={setFilterTheme}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a theme to filter" />
                          </SelectTrigger>
                          <SelectContent className="p-0 max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px]">
                            <div className="sticky top-0 z-10 p-2 border-b bg-white">
                              <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"/> 
                                <Input
                                  ref={themeSearchInputRef}
                                  placeholder="Search themes..."
                                  value={themeSearchTerm}
                                  onChange={(e) => setThemeSearchTerm(e.target.value)}
                                  onKeyDown={(e) => { e.stopPropagation(); }}
                                  onKeyUp={(e) => { e.stopPropagation(); }}
                                  onKeyPress={(e) => { e.stopPropagation(); }}
                                  onClick={(e) => { e.stopPropagation(); }}
                                  className="pl-8 h-8"
                                />
                              </div>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                              <SelectItem value="all-themes">All Themes</SelectItem>
                              {(themeOptions || filterThemes)
                                .filter((theme) => theme.toLowerCase().includes(themeSearchTerm.toLowerCase()))
                                .map((theme) => (
                                  <SelectItem key={theme} value={theme}>
                                    {theme}
                                  </SelectItem>
                                ))}
                            </div>
                          </SelectContent>
                        </Select>
                        {filterTheme && filterTheme !== 'all-themes' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterTheme("");
                              setThemeSearchTerm("");
                            }}
                            aria-label="Clear theme filter"
                          >
                            <X className="w-3 h-3 text-gray-400" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <HelpTooltip content="Pick a category to quickly filter available intent topics.">
                      <Label htmlFor="filterTopic" className="flex items-center cursor-help">
                       Filter Topic by Category
                         <Info className="w-3 h-3 ml-1 text-gray-400" />
                      </Label>
                       </HelpTooltip>

                      <div className="relative">
                        <Select
                          value={filterTopic}
                          onValueChange={setFilterTopic}
                          disabled={!filterTheme || filterTheme === 'all-themes'}
                          onOpenChange={(isOpen) => {
                            if (isOpen) {
                              setTimeout(() => {
                                try {
                                  categorySearchInputRef?.current?.focus();
                                } catch (e) {
                                  // ignore focus errors
                                }
                              }, 0);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={(!filterTheme || filterTheme === 'all-themes') ? 'Select a theme first' : 'Select a category to filter'} />
                          </SelectTrigger>
                          <SelectContent className="p-0 max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px]">
                            <div className="sticky top-0 z-10 p-2 border-b bg-white">
                              <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                  ref={categorySearchInputRef}
                                  placeholder="Search categories..."
                                  value={categorySearchTerm}
                                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                                  onKeyDown={(e) => { e.stopPropagation(); }}
                                  onKeyUp={(e) => { e.stopPropagation(); }}
                                  onKeyPress={(e) => { e.stopPropagation(); }}
                                  onClick={(e) => { e.stopPropagation(); }}
                                  className="pl-8 h-8"
                                />
                              </div>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                              <SelectItem value="all-topics">All Categories</SelectItem>
                              {filteredCategories && filteredCategories.length > 0 ? (
                                filteredCategories
                                  .filter((topic) => topic.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                                  .map((topic) => (
                                    <SelectItem key={topic} value={topic}>
                                      {topic}
                                    </SelectItem>
                                  ))
                              ) : (
                                <div className="p-2 text-sm text-gray-500">{(!filterTheme || filterTheme === 'all-themes') ? 'Select a theme to see categories' : 'No categories available for the selected theme'}</div>
                              )}
                            </div>
                          </SelectContent>
                        </Select>
                        {filterTopic && filterTopic !== 'all-topics' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterTopic("");
                              setCategorySearchTerm("");
                            }}
                            aria-label="Clear category filter"
                          >
                            <X className="w-3 h-3 text-gray-400" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selected Topics - Enhanced Visualization */}
                  {selectedTopics.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Label>Selected Topics:
                          {/* show the moved counter next to Selected Topics when present */}
                          <span
                            className={
                              selectedTopics.length > maxTopics
                                ? "text-[#ff2929] ml-1"
                                : "text-green-600 text-sm  ml-1"
                                
                            }
                          >
                            ({selectedTopics.length}/{maxTopics} Intent topics selected)
                          </span>
                          </Label>
                        </div>
                        
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm"
                            onClick={() => setSelectedTopics([])}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                      <div className="p-3  border border-blue-200 rounded-lg">
                        <div className="max-h-40 overflow-y-auto flex flex-wrap gap-2">
                          {selectedTopics.map((topic) => (
                            <Badge
                              key={topic}
                              variant="default"
                              className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer "
                              onClick={() => handleTopicRemove(topic)}
                              data-topic={topic}
                            >
                              {topic}
                              <X className="w-3 h-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {aiTopics.length === 0 ? (
                    <div
                      className="border rounded-lg p-4 max-h-48 overflow-y-hidden relative"
                      ref={availableListRef}
                    >
                      <Label className="text-sm text-valasys-gray-600 mb-2 block">
                        Available Topics:
                      </Label>
                      {loadingTopics ? (
                        <div className="flex items-center justify-center py-6">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-5 h-5 text-valasys-orange animate-spin" />
                            <div className="text-sm text-valasys-gray-500">
                              Loading topics...
                            </div>
                          </div>
                        </div>
                      ) : filteredTopics.length > 0 ? (
                        <div
                          onScroll={(e) => {
                            const el = e.currentTarget as HTMLDivElement;
                            if (loadingMore) return;
                            if (
                              el.scrollTop + el.clientHeight >=
                              el.scrollHeight - 40
                            ) {
                              if (visibleCount < filteredTopics.length) {
                                setLoadingMore(true);
                                setTimeout(() => {
                                  setVisibleCount((v) =>
                                    Math.min(v + 50, filteredTopics.length),
                                  );
                                  setLoadingMore(false);
                                }, 150);
                              }
                            }
                          }}
                          className="space-y-1"
                          style={{ maxHeight: 130, overflowY: "auto" }}
                        >
                          {filteredTopics.slice(0, visibleCount).map((topic, idx) => {
                            const key = topic.id ?? `${String(topic.name)}-${idx}`;
                            return (
                              <div
                                key={key}
                                className="flex items-center justify-between hover:bg-valasys-gray-100 rounded cursor-pointer text-sm transition-all duration-200"
                              >
                                <span
                                  className="flex-1 p-2"
                                  onClick={() => handleTopicSelect(topic.name)}
                                >
                                  {topic.name}
                                </span>
                                <div className="flex items-center gap-4 mr-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-valasys-orange hover:text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTopicSelect(topic.name);
                                    }}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}

                          {loadingMore && (
                            <div className="py-2 text-center text-sm text-valasys-gray-500">
                              Loading more…
                            </div>
                          )}
                          {!loadingMore && visibleCount < filteredTopics.length && (
                            <div className="py-2 text-center text-sm text-valasys-gray-500">
                              Scroll to load more
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-valasys-gray-500 text-center py-4">
                          {searchTerm ? "No topics found" : "All topics selected ✓"}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className="border rounded-lg p-4 max-h-72 overflow-y-hidden relative"
                        ref={availableListRef}
                      >
                        <Label className="text-sm text-valasys-gray-600 mb-2 block">
                          Available Topics:
                        </Label>
                        {loadingTopics ? (
                          <div className="flex items-center justify-center py-6">
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="w-5 h-5 text-valasys-orange animate-spin" />
                              <div className="text-sm text-valasys-gray-500">
                                Loading topics...
                              </div>
                            </div>
                          </div>
                        ) : filteredTopics.length > 0 ? (
                          <div
                            onScroll={(e) => {
                              const el = e.currentTarget as HTMLDivElement;
                              if (loadingMore) return;
                              if (
                                el.scrollTop + el.clientHeight >=
                                el.scrollHeight - 40
                              ) {
                                if (visibleCount < filteredTopics.length) {
                                  setLoadingMore(true);
                                  setTimeout(() => {
                                    setVisibleCount((v) =>
                                      Math.min(v + 50, filteredTopics.length),
                                    );
                                    setLoadingMore(false);
                                  }, 150);
                                }
                              }
                            }}
                            className="space-y-1"
                            style={{ maxHeight: 220, overflowY: "auto" }}
                          >
                            {filteredTopics.slice(0, visibleCount).map((topic, idx) => {
                              const key = topic.id ?? `${String(topic.name)}-${idx}`;
                              return (
                                <div
                                  key={key}
                                  className="flex items-center justify-between hover:bg-valasys-gray-100 rounded cursor-pointer text-sm transition-all duration-200"
                                >
                                  <span
                                    className="flex-1 p-2"
                                    onClick={() => handleTopicSelect(topic.name)}
                                  >
                                    {topic.name}
                                  </span>
                                  <div className="flex items-center gap-4 mr-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-valasys-orange hover:text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTopicSelect(topic.name);
                                      }}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}

                            {loadingMore && (
                              <div className="py-2 text-center text-sm text-valasys-gray-500">
                                Loading more…
                              </div>
                            )}
                            {!loadingMore && visibleCount < filteredTopics.length && (
                              <div className="py-2 text-center text-sm text-valasys-gray-500">
                                Scroll to load more
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-valasys-gray-500 text-center py-4">
                            {searchTerm ? "No topics found" : "All topics selected ✓"}
                          </p>
                        )}
                      </div>

                      <div className="border rounded-lg p-4 max-h-72 overflow-y-hidden">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Label className="text-sm text-valasys-gray-600">
                              AI Suggested Topics
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="inline-flex items-center justify-center w-5 h-5 rounded-full cursor-help">
                                  <Info className="w-3 h-3 text-gray-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-xs">
                                  These topics are automatically recommended based on your product, subcategory and geo.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-valasys-orange to-valasys-orange-light shadow-sm"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>AI</span>
                          </div>
                        </div>
                        {loadingAiGenerate ? (
                          <div className="flex items-center justify-center py-6">
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="w-5 h-5 text-valasys-orange animate-spin" />
                              <div className="text-sm text-valasys-gray-500">
                                Preparing your AI-generated topics…
                              </div>
                            </div>
                          </div>
                        ) : filteredAiSuggestedTopics.length > 0 ? (
                          <div
                            className="space-y-1"
                            style={{ maxHeight: 220, overflowY: "auto" }}
                          >
                            {filteredAiSuggestedTopics.map(
                              (topic: any, idx: number) => {
                                const key =
                                  topic.id ?? `${String(topic.name)}-ai-${idx}`;
                                return (
                                  <div
                                    key={key}
                                    className="flex items-center justify-between hover:bg-valasys-gray-100 rounded cursor-pointer text-sm transition-all duration-200"
                                  >
                                    <span
                                      className="flex-1 p-2"
                                      onClick={() => handleTopicSelect(topic.name)}
                                    >
                                      {topic.name}
                                    </span>

                                    <div className="flex items-center gap-4 mr-2">
                                      {topic.aiScore && (
                                        <span className="text-sm font-semibold text-gray-600">
                                          {topic.aiScore}%
                                        </span>
                                      )}

                                      {(topic.aiDescription ||
                                        topic.description ||
                                        topic.volume ||
                                        topic.conversion) && (
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <div
                                              className="p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Info className="w-4 h-4 text-gray-500" />
                                                </TooltipTrigger>
                                                <TooltipContent
                                                  side="top"
                                                  className="bg-gray-900 text-white border-0"
                                                >
                                                  <div className="space-y-1 text-center">
                                                    <div className="text-xs text-gray-300">
                                                      Click here to learn more about this
                                                      topic.
                                                    </div>
                                                  </div>
                                                </TooltipContent>
                                              </Tooltip>
                                            </div>
                                          </DialogTrigger>
                                          <DialogContent className="max-w-lg">
                                            <DialogHeader className="border-b pb-4">
                                              <div className="flex items-center justify-between pr-8">
                                                <DialogTitle className="text-xl font-bold">
                                                  Topic Insights
                                                </DialogTitle>
                                                <Badge className="bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white border-0 flex items-center gap-1 px-3 py-1">
                                                  <Sparkles className="w-3 h-3" />
                                                  AI Generated
                                                </Badge>
                                              </div>
                                              <DialogDescription className="text-gray-500 mt-1">
                                                Detailed intelligence about this intent
                                                topic
                                              </DialogDescription>
                                            </DialogHeader>
                                            <TopicInsightContent
                                              topic={topic}
                                              formData={formData}
                                              productSubcategories={
                                                productSubcategories
                                              }
                                            />
                                          </DialogContent>
                                        </Dialog>
                                      )}

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 hover:bg-valasys-orange hover:text-white"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTopicSelect(topic.name);
                                        }}
                                      >
                                        <Plus className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-valasys-gray-500 text-center py-4">
                            {aiTopics.length === 0
                              ? "No AI suggestions generated yet."
                              : "No AI suggestions match your filters yet."}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-4 mb-4">
                    <img
                      src="https://dj5ra5fp2z43j.cloudfront.net/logos/Bombora.webp"
                      alt="Powered by Bombora"
                      className="opacity-75 hover:opacity-100 transition-opacity"
                      style={{height: "18px",objectFit:"contain" }}
                    />
                  </div>

                  <div className="flex justify-between flex-wrap md:flex-nowrap">
                    <Button variant="outline" onClick={() => goToStep(1)}>
                       <ArrowLeft className="w-4 h-4 " />
                      Previous
                    </Button>
                    <Button
                      onClick={() => goToStep(3)}
                      disabled={!isStepValid(2)}
                    >
                      <ArrowRight className="w-4 h-4 " />
                      Next: Upload File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Step 3: File Upload */}
            <div ref={(el) => (stepRefs.current[3] = el)}>
              <Card
                data-tour="vais-suppression-file"
                className={cn(
                  "transition-all duration-200",
                  navigationStarted && currentStep === 3
                    ? "ring-2 ring-valasys-orange/50 shadow-lg"
                    : "",
                )}
              >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg ">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 aspect-square rounded-full flex items-center justify-center mr-3",
                        uploadedFile
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600",
                      )}
                    >
                      {uploadedFile ? <Check className="w-4 h-4" /> : <span className="text-lg font-bold" style={{fontWeight:600,fontSize:"18px"}}>3</span>}
                    </div>
                    <HelpTooltip
                    side="top"
                    sideOffset={10}
                    align="start"
                    content="Upload your suppression file to exclude any accounts you do not wish to target"
                  >
                  <span className="inline-block " style={{fontWeight:600,fontSize:"16.5px"}}>Upload Suppression File  <Info className="w-3 h-3 ml-1 text-gray-400 inline-block" /></span>
                  </HelpTooltip>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-sm"
                    onClick={async () => {
                      try {
                        const templatePath = '/abmtemplate.csv';
                        const response = await fetch(templatePath);
                        if (!response.ok) {
                          throw new Error('Failed to fetch template');
                        }
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'Suppression.csv';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                        toast({
                          title: 'Template Downloaded',
                          description: 'Suppression file template has been downloaded successfully.',
                          variant: 'default'
                        });
                      } catch (error) {
                        console.error('Download failed:', error);
                        toast({
                          title: 'Download Failed',
                          description: 'Failed to download the template. Please try again.',
                          variant: 'default'
                        });
                      }
                    }}
                  >
                    <Download className="w-4 h-4" />
                   Template
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enhanced Upload Area with animations */}
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer",
                    dragActive
                      ? "border-valasys-orange bg-valasys-orange/5"
                      : "border-gray-300 hover:border-valasys-orange",
                    uploadedFile && "border-green-300 bg-green-50",
                  )}
                  tabIndex={0}
                  role="button"
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onClick={() =>
                    !isUploading && fileInputRef.current?.click()
                  }
                >
                  {isUploading ? (
                    <div className="space-y-4">
                      <Loader2 className="w-12 h-12 mx-auto text-valasys-orange animate-spin" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Processing Upload...
                        </p>
                        <Progress value={uploadProgress} className="mt-2" />
                        <p className="text-sm text-gray-500 mt-1">
                          {uploadProgress}% complete
                        </p>
                      </div>
                    </div>
                  ) : uploadedFile ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-white animate-bounce" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 break-words whitespace-normal overflow-hidden text-sm text-center" title={uploadedFile.name}>
                          {truncateFilename(uploadedFile.name)}
                        </p>
                        <p className="text-sm text-green-600">
                          Successfully uploaded • {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Ready for suppression filtering
                        </p>
                      </div>
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFile(null);
                            setFileStatus("none");
                            setUploadProgress(0);
                              fileInputRef.current.value = '';
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Clear
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Select / Drop file to upload
                        </p>
                        <p className="text-sm text-gray-500">
                          .csv, .xlsx, .txt — max 5 MB
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Upload your suppression list to exclude contacts
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        disabled={isUploading}
                        className="mt-4 border-valasys-orange text-valasys-orange hover:bg-valasys-orange hover:text-white transition-colors"
                      >
                        <Upload className="w-4 h-4 " />
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.csv,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                <div className="flex justify-between flex-wrap md:flex-nowrap">
                  <Button variant="outline" onClick={() => goToStep(2)}>
                    <ArrowLeft className="w-4 h-4 " />
                    Previous
                  </Button>
                  <Button onClick={() => goToStep(4)}>
                    <ArrowRight className="w-4 h-4 " />
                    Next: Build VAIS
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>

            {/* Step 4: Build Action */}
            <div ref={(el) => (stepRefs.current[4] = el)}>
              <Card
              data-tour="vais-ready-to-build"
              className={cn(
                "transition-all duration-200",
                navigationStarted && currentStep === 4
                  ? "ring-2 ring-valasys-orange/50 shadow-lg"
                  : "",
              )}
            >
              <CardContent className="p-4 space-y-3 ">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <CardTitle className="flex items-center justify-between text-lg font-bold">
                    {/* <span>Form Title</span> */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mr-3 ",
                        isFormValid()
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600",
                      )}
                    >
                      {isFormValid() ? <Check className="w-4 h-4" /> : "4"}
                    </div>
                  </CardTitle>

                    <span className=" text-lg" style={{fontWeight:600,fontSize:"18px"}}>Click to build your VAIS</span>
                  </div>
                  <Button
                    data-tour="vais-save-search"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSaveDialog(true)}
                    disabled={!isFormValid()}
                    className="ml-2"
                  >
                    <Save className="w-4 h-4 " />
                    Save Search
                  </Button>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handleBuildVAIS}
                        className="w-full bg-valasys-orange hover:bg-valasys-orange/90 "
                        disabled={!isFormValid() || isSaving}
                      >
                        {isSaving ? (
                          <span className="flex items-center justify-center w-full">
                            Building...
                          </span>
                        ) : (
                          <>
                            {!isFormValid() && (
                              <AlertCircle className="w-4 h-4 mr-2" />
                            )}
                            <RocketIcon className="w-4 h-4 " />
                            Build Your VAIS
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!isFormValid() && (
                    <TooltipContent>
                      <p>Please complete required fields:</p>
                      <ul className="text-xs list-disc list-inside">
                        {!formData.productSubcategory && (
                          <li>Product Subcategory</li>
                        )}
                        {formData.geolocation.length === 0 && (
                          <li>Geolocation</li>
                        )}
                        {selectedTopics.length === 0 && (
                          <li>At least one Intent Topic</li>
                        )}
                      </ul>
                    </TooltipContent>
                  )}
                </Tooltip>

                <div className="text-center text-xs text-valasys-gray-500">
                  
                  <div className="font-bold mb-1 flex items-center justify-center gap-2">
                    {/* Tooltip showing per-day download credit history breakdown (only when available) */}
                      {(() => {
                        const history = userPlanForForm?.per_day_data_download_credit_history || {};
                        const abm = typeof history.ABM === 'number' ? history.ABM : (typeof history.ABM === 'string' ? Number(history.ABM) : 0);
                        const icp = typeof history.ICP === 'number' ? history.ICP : (typeof history.ICP === 'string' ? Number(history.ICP) : 0);
                        const lal = typeof history.LAL === 'number' ? history.LAL : (typeof history.LAL === 'string' ? Number(history.LAL) : 0);

                        const lines: Array<{ key: string; label: string; value: number }> = [];
                        if (abm && abm > 0) lines.push({ key: 'ABM', label: 'ABM Downloaded', value: abm });
                        if (icp && icp > 0) lines.push({ key: 'ICP', label: 'ICP Downloaded', value: icp });
                        if (lal && lal > 0) lines.push({ key: 'LAL', label: 'LAL Downloaded', value: lal });

                        if (lines.length === 0) return null;

                        return (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button aria-label="View per-day download history" className="ml-1 text-gray-400 hover:text-gray-600">
                                <Info className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs" side="bottom" style={{fontWeight:500,fontSize:"14px",textAlign:"left"}}>
                              <div className="text-sm">
                                <div className="text-xs space-y-1">
                                  <div>Per Day Download Breakdown</div>
                                  {lines.map((line) => (
                                    <div key={line.key}>{line.label}: {line.value}</div>
                                  ))}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })()}
                      {(() => {
                        // Prefer numeric values from userPlanForForm when available
                        const used = typeof userPlanForForm?.remaining_download_limit === 'number'
                          ? userPlanForForm.remaining_download_limit
                          : 0;
                        const limit = typeof userPlanForForm?.daily_download_limit === 'number'
                          ? userPlanForForm.daily_download_limit
                          : (typeof userPlanForForm?.daily_download_limit === 'string' ? Number(userPlanForForm.daily_download_limit) : 0);

                      // If limit looks like it's in 'counts' but stored as small (e.g. 200) convert to display scale if necessary.
                      const displayLimit = limit || 0;

                      return `${displayLimit - used}/${displayLimit} Utilized Per Day Download`;
                    })()}
                  </div>
                  Note: Each 'Build Your VAIS' action deducts one search from
                  your available search credits.
                </div>
              </CardContent>
            </Card>

              </div>

              {/* Info Panel */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Pro Tip:</p>
                    <p>
                      Use specific intent topics to get more targeted results.
                      You can combine multiple topics for better precision.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Search Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Search Configuration</DialogTitle>
              <DialogDescription>
                Save this search configuration for future use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter search name..."
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                >
                  <X className="w-4 h-4 " />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSearch}
                  disabled={!newSearchName.trim()}
                >
                  <Save className="w-4 h-4 " />
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Generate Topics Result Dialog */}
        <Dialog open={showGenerateResultDialog} onOpenChange={setShowGenerateResultDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Extracted Topics</DialogTitle>
              <DialogDescription className="text-left text-sm break-words whitespace-normal overflow-hidden px-4">
  <span className="font-medium break-all text-valasys-gray-500">
    {generateResult.total === 0 ? `No topics were returned for ${generateResult.domain}` : `The system has retrieved ${generateResult.total} topics for the URL you requested.`}
  </span>
</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {/* Magic Search Dialog */}
        <Dialog open={showMagicSearch} onOpenChange={setShowMagicSearch}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Magic Search</DialogTitle>
              <DialogDescription className="text-sm text-left">
                Describe your ideal customer or use-case. We will auto-fill Product Subcategory, Category,
                Geolocations, and Intent Topics.
              </DialogDescription>
              <div className="text-sm text-gray-600 mt-2 mb-3">
                <h4 className="font-semibold text-gray-700">Some examples to get you started:</h4>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>"Find construction companies in California looking for Construction Management Software."</li>
                  <li>"Show me manufacturers in Germany evaluating Supply Chain Management Software."</li>
                  <li>"I need businesses in the UK planning a move using Cloud Migration Tools."</li>
                  <li>"Find large enterprises in New York actively researching Enterprise Resource Planning (ERP) Software."</li>
                </ul>
              </div>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder='e.g., "AI security tools for US healthcare providers"'
                value={magicSearchInput}
                onChange={(e) => setMagicSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void runMagicSearch();
                  }
                }}
              />
              {magicSearchError && (
                <div className="text-sm text-red-600">{magicSearchError}</div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMagicSearch(false)}>
                  Cancel
                </Button>
                <Button onClick={() => void runMagicSearch()} disabled={isMagicSearching}>
                  {isMagicSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Auto-Fill
                </Button>
              </div>
              <div className="text-xs text-valasys-gray-500">
                {/* Local-only matching (FAISS-style cosine). No external API calls or keys are used. */}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
