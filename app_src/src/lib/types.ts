// ============================================================
// CORE TYPES — YourWork Platform
// ============================================================

export type UserRole = 'emerging_professional' | 'experienced_operator' | 'freelancer' | 'career_support';
export type Tone = 'professional' | 'creative' | 'technical' | 'conversational';
export type PortfolioMode = 'template_first' | 'ai_directed';
export type VisibilityLevel = 'draft' | 'unlisted' | 'public';
export type ConfidentialityLevel = 'private' | 'redact' | 'public';
export type ScanStatus = 'pending' | 'clean' | 'flagged' | 'failed';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface OnboardingData {
  role: UserRole;
  objective: string;
  audience: string;
  tone: Tone;
  mode: PortfolioMode;
  completed: boolean;
}

export interface Profile {
  id: string;
  workspaceId: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  primaryRole: string;
  email?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  title: string;
  role: string;
  startDate: string;
  endDate?: string;
  summary: string;
  contributions: string[];
  outcomes: string[];
  skills: string[];
  mediaUrls: string[];
  externalLinks: string[];
  confidentiality: ConfidentialityLevel;
  status: 'draft' | 'complete';
  sortOrder: number;
}

export interface Asset {
  id: string;
  workspaceId: string;
  fileName: string;
  mediaType: 'document' | 'image' | 'video' | 'other';
  mimeType: string;
  byteSize: number;
  scanStatus: ScanStatus;
  url?: string;
  createdAt: string;
}

export interface SourceDocument {
  id: string;
  workspaceId: string;
  assetId: string;
  docType: 'resume' | 'work_sample' | 'bio' | 'other';
  extractionStatus: 'pending' | 'processing' | 'complete' | 'failed';
  fileName: string;
}

export interface ExternalLink {
  id: string;
  workspaceId: string;
  url: string;
  title: string;
  description?: string;
  fetchStatus: 'pending' | 'fetched' | 'failed';
}

// ============================================================
// PORTFOLIO & BLOCKS
// ============================================================

export type BlockType =
  | 'hero'
  | 'about'
  | 'project_collection'
  | 'project_detail'
  | 'experience'
  | 'skills'
  | 'gallery'
  | 'testimonials'
  | 'contact'
  | 'links';

export interface PortfolioBlock {
  id: string;
  blockType: BlockType;
  sortOrder: number;
  visible: boolean;
  content: BlockContent;
}

export type BlockContent =
  | HeroContent
  | AboutContent
  | ProjectCollectionContent
  | ExperienceContent
  | SkillsContent
  | ContactContent
  | LinksContent;

export interface HeroContent {
  name: string;
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  avatarUrl?: string;
  backgroundStyle?: 'gradient' | 'image' | 'minimal';
}

export interface AboutContent {
  title: string;
  body: string;
  highlights?: string[];
}

export interface ProjectCollectionContent {
  title: string;
  subtitle?: string;
  projectIds: string[];
  layout: 'grid' | 'list' | 'featured';
}

export interface ExperienceContent {
  title: string;
  items: ExperienceItem[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  current?: boolean;
}

export interface SkillsContent {
  title: string;
  categories: SkillCategory[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ContactContent {
  title: string;
  body?: string;
  email?: string;
  showForm: boolean;
}

export interface LinksContent {
  title: string;
  links: { label: string; url: string; icon?: string }[];
}

// ============================================================
// TEMPLATES
// ============================================================

export type TemplateId = 'minimal_professional' | 'editorial_case_study' | 'visual_showcase' | 'builder_technical';

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  tags: string[];
  previewGradient: string;
  previewColors: string[];
  bestFor: string[];
  accentColor: string;
  fontStyle: 'sans' | 'serif' | 'mono';
}

// ============================================================
// PORTFOLIO
// ============================================================

export interface Portfolio {
  id: string;
  workspaceId: string;
  slug: string;
  title: string;
  templateId: TemplateId;
  status: 'draft' | 'published' | 'archived';
  visibility: VisibilityLevel;
  blocks: PortfolioBlock[];
  seoTitle?: string;
  seoDescription?: string;
  activeRevisionId?: string;
  publishedAt?: string;
  updatedAt: string;
}

// ============================================================
// AI
// ============================================================

export type AIModel =
  | 'gemini-1.5-pro'
  | 'gemini-2.0-flash'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'claude-3-5-sonnet'
  | 'llama-3-70b'
  | 'mistral-large';

export interface AIModelOption {
  id: AIModel;
  name: string;
  provider: string;
  description: string;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'standard' | 'high' | 'best';
  free: boolean;
  badge?: string;
}

export interface GenerationJob {
  id: string;
  portfolioId: string;
  workspaceId: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  model: AIModel;
  progress: number;
  steps: GenerationStep[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface GenerationStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
}

export interface GeneratedSection {
  blockType: BlockType;
  content: BlockContent;
  sourceFragments: string[];
  confidence: number;
  reviewStatus: 'pending' | 'accepted' | 'rejected' | 'edited';
}

// ============================================================
// WORKSPACE / APP STATE
// ============================================================

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
}

export interface AppState {
  user: User | null;
  workspace: Workspace | null;
  profile: Profile | null;
  projects: Project[];
  assets: Asset[];
  sources: SourceDocument[];
  externalLinks: ExternalLink[];
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  onboarding: OnboardingData | null;
  selectedModel: AIModel;
  isAuthenticated: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  href: string;
}
