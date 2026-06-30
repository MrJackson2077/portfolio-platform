import type {
  User, Workspace, Profile, Project, Asset, Portfolio,
  Template, TemplateId, AIModelOption, GenerationJob, GenerationStep,
  GeneratedSection, BlockType, ChecklistItem,
} from './types';

// ============================================================
// AI MODELS
// ============================================================

export const AI_MODELS: AIModelOption[] = [
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Lightning-fast generation with excellent quality.',
    speed: 'fast',
    quality: 'high',
    free: true,
    badge: 'Recommended',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: 'Long context, deep analysis of uploaded documents.',
    speed: 'medium',
    quality: 'best',
    free: true,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Best-in-class writing quality and creative tone.',
    speed: 'medium',
    quality: 'best',
    free: false,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Fast, cost-efficient, great for quick drafts.',
    speed: 'fast',
    quality: 'standard',
    free: false,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Nuanced writing, excellent at narrative polish.',
    speed: 'medium',
    quality: 'best',
    free: false,
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta (Open Source)',
    description: 'Open-source, self-hostable, strong performance.',
    speed: 'slow',
    quality: 'high',
    free: true,
    badge: 'Open Source',
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'European open-weight model, privacy-friendly.',
    speed: 'medium',
    quality: 'high',
    free: true,
    badge: 'Open Source',
  },
];

// ============================================================
// MOCK USER & WORKSPACE
// ============================================================

export const MOCK_USER: User = {
  id: 'user_01',
  email: 'alex.morgan@example.com',
  displayName: 'Alex Morgan',
  avatarUrl: undefined,
  role: 'emerging_professional',
  createdAt: '2026-05-15T10:00:00Z',
};

export const MOCK_WORKSPACE: Workspace = {
  id: 'ws_01',
  ownerId: 'user_01',
  name: "Alex's Workspace",
  createdAt: '2026-05-15T10:00:00Z',
};

// ============================================================
// MOCK PROFILE
// ============================================================

export const MOCK_PROFILE: Profile = {
  id: 'profile_01',
  workspaceId: 'ws_01',
  fullName: 'Alex Morgan',
  headline: 'Full-Stack Engineer & Product Builder',
  bio: 'I build intuitive digital products that solve real problems. With 4 years of experience spanning startups and growth-stage companies, I specialize in React, Node.js, and turning complex ideas into clean user experiences.',
  location: 'San Francisco, CA',
  primaryRole: 'Software Engineer',
  email: 'alex.morgan@example.com',
  website: 'https://alexmorgan.dev',
  linkedin: 'https://linkedin.com/in/alexmorgan',
  github: 'https://github.com/alexmorgan',
  twitter: 'https://twitter.com/alexmorgan',
};

// ============================================================
// MOCK PROJECTS
// ============================================================

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_01',
    workspaceId: 'ws_01',
    title: 'ClearFlow — Payment Analytics Dashboard',
    role: 'Lead Frontend Engineer',
    startDate: '2024-03',
    endDate: '2024-11',
    summary: 'Built a real-time payment analytics dashboard for a Series B fintech startup. The platform processes $2M+ in daily transactions and serves 800+ business customers.',
    contributions: [
      'Designed and implemented the entire frontend architecture using React and TypeScript',
      'Built a custom charting library optimized for real-time financial data',
      'Reduced dashboard load time from 4.2s to 0.8s through code splitting and caching',
    ],
    outcomes: [
      'Reduced customer support tickets by 40% through improved data visibility',
      'Dashboard used daily by 800+ paying customers',
      '30% increase in user engagement after redesign',
    ],
    skills: ['React', 'TypeScript', 'D3.js', 'WebSockets', 'Node.js', 'PostgreSQL'],
    mediaUrls: [],
    externalLinks: ['https://clearflow.io'],
    confidentiality: 'public',
    status: 'complete',
    sortOrder: 0,
  },
  {
    id: 'proj_02',
    workspaceId: 'ws_01',
    title: 'Habitat — Housing Match Platform',
    role: 'Full-Stack Engineer',
    startDate: '2023-06',
    endDate: '2024-01',
    summary: 'Co-built a housing platform connecting students with landlords verified by their university. Grew to 12,000 monthly active users across 8 universities.',
    contributions: [
      'Built the matching algorithm backend (Node.js + PostgreSQL)',
      'Implemented university SSO integration with OAuth 2.0',
      'Designed and shipped the mobile-responsive listing interface',
    ],
    outcomes: [
      '12,000 monthly active users at peak',
      '8 university partnerships secured',
      '$180K pre-seed round raised',
    ],
    skills: ['Next.js', 'Node.js', 'PostgreSQL', 'OAuth 2.0', 'Redis', 'AWS'],
    mediaUrls: [],
    externalLinks: [],
    confidentiality: 'public',
    status: 'complete',
    sortOrder: 1,
  },
  {
    id: 'proj_03',
    workspaceId: 'ws_01',
    title: 'Internal Design System — Redacted Client',
    role: 'Frontend Engineer',
    startDate: '2023-01',
    endDate: '2023-05',
    summary: 'Led the component library effort for a confidential enterprise SaaS client. Delivered 40+ accessible components used across 6 product teams.',
    contributions: [
      'Architected the token-based design system',
      'Delivered 40+ accessible React components with Storybook docs',
      'Established contribution guidelines adopted across 6 teams',
    ],
    outcomes: [
      '60% reduction in frontend code duplication',
      '40+ components shipped and adopted company-wide',
      'Significantly improved design-engineering alignment',
    ],
    skills: ['React', 'TypeScript', 'Storybook', 'CSS Variables', 'WCAG 2.1'],
    mediaUrls: [],
    externalLinks: [],
    confidentiality: 'redact',
    status: 'complete',
    sortOrder: 2,
  },
];

// ============================================================
// MOCK ASSETS
// ============================================================

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'asset_01',
    workspaceId: 'ws_01',
    fileName: 'Alex_Morgan_Resume_2026.pdf',
    mediaType: 'document',
    mimeType: 'application/pdf',
    byteSize: 245000,
    scanStatus: 'clean',
    createdAt: '2026-05-15T10:30:00Z',
  },
  {
    id: 'asset_02',
    workspaceId: 'ws_01',
    fileName: 'clearflow_dashboard_screenshot.png',
    mediaType: 'image',
    mimeType: 'image/png',
    byteSize: 1240000,
    scanStatus: 'clean',
    createdAt: '2026-05-16T11:00:00Z',
  },
];

// ============================================================
// TEMPLATES
// ============================================================

export const TEMPLATES: Template[] = [
  {
    id: 'minimal_professional',
    name: 'Minimal Professional',
    description: 'Clean, typographic layout. Lets your work speak without distraction. Perfect for engineers, consultants, and analysts.',
    tags: ['Clean', 'Typographic', 'Minimal'],
    previewGradient: 'linear-gradient(135deg, hsl(220 20% 12%), hsl(220 15% 18%))',
    previewColors: ['#f8fafc', '#6366f1', '#0f172a'],
    bestFor: ['Engineers', 'Analysts', 'Consultants'],
    accentColor: 'hsl(246, 83%, 62%)',
    fontStyle: 'sans',
  },
  {
    id: 'editorial_case_study',
    name: 'Editorial Case Study',
    description: 'Long-form narrative layout with large imagery, pullquotes, and structured case study sections. Ideal for designers and product managers.',
    tags: ['Editorial', 'Narrative', 'Case Study'],
    previewGradient: 'linear-gradient(135deg, hsl(30 20% 10%), hsl(30 15% 16%))',
    previewColors: ['#fefce8', '#f59e0b', '#1c1917'],
    bestFor: ['Designers', 'Product Managers', 'Researchers'],
    accentColor: 'hsl(38, 92%, 50%)',
    fontStyle: 'serif',
  },
  {
    id: 'visual_showcase',
    name: 'Visual Showcase',
    description: 'Gallery-first layout with full-bleed imagery and bold color blocks. Built for creatives whose work is the centerpiece.',
    tags: ['Visual', 'Gallery', 'Creative'],
    previewGradient: 'linear-gradient(135deg, hsl(280 30% 8%), hsl(320 25% 14%))',
    previewColors: ['#fdf4ff', '#d946ef', '#0a0014'],
    bestFor: ['Designers', 'Photographers', 'Creators'],
    accentColor: 'hsl(280, 80%, 60%)',
    fontStyle: 'sans',
  },
  {
    id: 'builder_technical',
    name: 'Builder / Technical',
    description: 'Code-inspired aesthetic with dark tones, monospace accents, and GitHub-style project cards. Made for engineers and open-source contributors.',
    tags: ['Technical', 'Dark', 'Code'],
    previewGradient: 'linear-gradient(135deg, hsl(210 30% 6%), hsl(196 40% 10%))',
    previewColors: ['#e2f8ff', '#22d3ee', '#020c12'],
    bestFor: ['Engineers', 'Open Source', 'Developers'],
    accentColor: 'hsl(196, 94%, 52%)',
    fontStyle: 'mono',
  },
];

// ============================================================
// MOCK PORTFOLIO
// ============================================================

export const MOCK_PORTFOLIO: Portfolio = {
  id: 'port_01',
  workspaceId: 'ws_01',
  slug: 'alex-morgan',
  title: "Alex Morgan's Portfolio",
  templateId: 'minimal_professional',
  status: 'published',
  visibility: 'public',
  blocks: [
    {
      id: 'block_01',
      blockType: 'hero',
      sortOrder: 0,
      visible: true,
      content: {
        name: 'Alex Morgan',
        headline: 'Full-Stack Engineer & Product Builder',
        subheadline: 'I build products people love — from fintech dashboards to housing platforms.',
        ctaText: 'See my work',
        ctaUrl: '#projects',
        backgroundStyle: 'gradient',
      },
    },
    {
      id: 'block_02',
      blockType: 'about',
      sortOrder: 1,
      visible: true,
      content: {
        title: 'About Me',
        body: 'I build intuitive digital products that solve real problems. With 4 years of experience spanning startups and growth-stage companies, I specialize in React, Node.js, and turning complex ideas into clean user experiences.\n\nI care deeply about performance, accessibility, and the small details that make software feel great to use.',
        highlights: ['4 years experience', 'React & Node.js specialist', 'Open to new opportunities'],
      },
    },
    {
      id: 'block_03',
      blockType: 'project_collection',
      sortOrder: 2,
      visible: true,
      content: {
        title: 'Selected Work',
        subtitle: 'A few projects I\'m proud of.',
        projectIds: ['proj_01', 'proj_02'],
        layout: 'grid',
      },
    },
    {
      id: 'block_04',
      blockType: 'skills',
      sortOrder: 3,
      visible: true,
      content: {
        title: 'Skills & Technologies',
        categories: [
          { name: 'Frontend', skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'D3.js'] },
          { name: 'Backend', skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'GraphQL'] },
          { name: 'Tools', skills: ['AWS', 'Docker', 'GitHub Actions', 'Figma', 'Storybook'] },
        ],
      },
    },
    {
      id: 'block_05',
      blockType: 'contact',
      sortOrder: 4,
      visible: true,
      content: {
        title: "Let's work together",
        body: "I'm currently open to new opportunities. Whether you have a project in mind or just want to connect, I'd love to hear from you.",
        email: 'alex.morgan@example.com',
        showForm: false,
      },
    },
  ],
  seoTitle: 'Alex Morgan — Full-Stack Engineer',
  seoDescription: 'Portfolio of Alex Morgan, a full-stack engineer specializing in React and Node.js.',
  publishedAt: '2026-06-01T12:00:00Z',
  updatedAt: '2026-06-15T09:30:00Z',
};

// ============================================================
// MOCK GENERATION JOB
// ============================================================

export const GENERATION_STEPS: GenerationStep[] = [
  { id: 'step_1', label: 'Analyzing uploaded documents', status: 'pending' },
  { id: 'step_2', label: 'Extracting skills, roles, and experience', status: 'pending' },
  { id: 'step_3', label: 'Generating content structure', status: 'pending' },
  { id: 'step_4', label: 'Drafting portfolio sections', status: 'pending' },
  { id: 'step_5', label: 'Recommending template layout', status: 'pending' },
  { id: 'step_6', label: 'Running quality checks', status: 'pending' },
];

// ============================================================
// CHECKLIST ITEMS
// ============================================================

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'check_1',
    label: 'Complete your profile',
    description: 'Add your name, headline, bio, and contact info.',
    completed: true,
    href: '/studio?tab=profile',
  },
  {
    id: 'check_2',
    label: 'Add at least one project',
    description: 'Describe your work, contributions, and outcomes.',
    completed: true,
    href: '/studio?tab=projects',
  },
  {
    id: 'check_3',
    label: 'Upload a resume or work document',
    description: 'PDF, DOCX, or TXT — AI will extract content from it.',
    completed: true,
    href: '/studio?tab=sources',
  },
  {
    id: 'check_4',
    label: 'Choose a template',
    description: 'Browse 4 curated templates and pick your style.',
    completed: true,
    href: '/templates',
  },
  {
    id: 'check_5',
    label: 'Generate your portfolio draft',
    description: 'AI turns your materials into a structured draft.',
    completed: false,
    href: '/workspace',
  },
  {
    id: 'check_6',
    label: 'Review and edit your draft',
    description: 'Accept, edit, or regenerate each section.',
    completed: false,
    href: '/editor',
  },
  {
    id: 'check_7',
    label: 'Publish your portfolio',
    description: 'Share your work with the world.',
    completed: false,
    href: '/editor',
  },
];

// ============================================================
// SIMULATED AI GENERATION
// ============================================================

export async function simulateGeneration(
  model: string,
  onStep: (stepIndex: number, status: GenerationStep['status']) => void,
  onProgress: (progress: number) => void,
): Promise<GeneratedSection[]> {
  const stepDurations = [1800, 2200, 1500, 2500, 1200, 1000];

  for (let i = 0; i < stepDurations.length; i++) {
    onStep(i, 'running');
    onProgress(Math.round(((i) / stepDurations.length) * 90));

    await new Promise(r => setTimeout(r, stepDurations[i]));

    onStep(i, 'done');
    onProgress(Math.round(((i + 1) / stepDurations.length) * 90));
  }

  onProgress(100);

  // Return simulated generated content
  const sections: GeneratedSection[] = [
    {
      blockType: 'hero',
      content: {
        name: 'Alex Morgan',
        headline: 'Full-Stack Engineer & Product Builder',
        subheadline: 'I craft high-performance digital products used by thousands. Currently open to senior engineering and technical lead roles.',
        ctaText: 'View my work',
        ctaUrl: '#projects',
        backgroundStyle: 'gradient',
      },
      sourceFragments: ['Resume: Summary section', 'LinkedIn bio'],
      confidence: 0.95,
      reviewStatus: 'pending',
    },
    {
      blockType: 'about',
      content: {
        title: 'About Me',
        body: 'I\'m a full-stack engineer with 4 years of experience building products at the intersection of design and engineering. I\'ve worked across fintech, proptech, and enterprise software — always focused on shipping things that work beautifully.\n\nI\'m at my best when I can work closely with product and design to turn complex problems into elegant solutions.',
        highlights: ['4 years of full-stack experience', 'Fintech & proptech expertise', 'Open to senior roles'],
      },
      sourceFragments: ['Resume: Professional Summary', 'Cover letter excerpt'],
      confidence: 0.88,
      reviewStatus: 'pending',
    },
    {
      blockType: 'project_collection',
      content: {
        title: 'Selected Work',
        subtitle: 'Projects I\'ve built and shipped.',
        projectIds: ['proj_01', 'proj_02'],
        layout: 'grid',
      },
      sourceFragments: ['Resume: Experience section', 'Project links'],
      confidence: 0.92,
      reviewStatus: 'pending',
    },
    {
      blockType: 'skills',
      content: {
        title: 'Technical Skills',
        categories: [
          { name: 'Frontend', skills: ['React', 'TypeScript', 'Next.js', 'D3.js', 'CSS/SCSS'] },
          { name: 'Backend', skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'REST APIs'] },
          { name: 'Infrastructure', skills: ['AWS', 'Docker', 'CI/CD', 'GitHub Actions'] },
        ],
      },
      sourceFragments: ['Resume: Skills section', 'Project descriptions'],
      confidence: 0.97,
      reviewStatus: 'pending',
    },
    {
      blockType: 'contact',
      content: {
        title: "Get in touch",
        body: "I'm currently exploring new opportunities. If you're building something interesting and need a strong engineer, let's talk.",
        email: 'alex.morgan@example.com',
        showForm: false,
      },
      sourceFragments: ['Resume: Contact info'],
      confidence: 1.0,
      reviewStatus: 'pending',
    },
  ];

  return sections;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
