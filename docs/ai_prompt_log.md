# AI Prompt Log — YourWork Portfolio Platform

> **Purpose:** Reference document for all AI prompt templates used in the platform, their expected inputs, and representative outputs.
> This file has no runtime dependency — it is documentation only and does not affect the build.
>
> **How to use:**
> - Add a new entry under the relevant section whenever a prompt is created or revised.
> - Record the prompt version, the model it was tested against, and a representative sample output.
> - Prefix draft prompts with `[DRAFT]` until they are confirmed in production.

---

## Table of Contents

1. [System Prompts](#1-system-prompts)
2. [Hero / Introduction Block](#2-hero--introduction-block)
3. [About Me Block](#3-about-me-block)
4. [Selected Work / Project Collection Block](#4-selected-work--project-collection-block)
5. [Skills & Technologies Block](#5-skills--technologies-block)
6. [Experience Block](#6-experience-block)
7. [Contact Block](#7-contact-block)
8. [AI Rewrite (Section-Level)](#8-ai-rewrite-section-level)
9. [SEO Meta Generation](#9-seo-meta-generation)
10. [Portfolio Title & Slug Suggestion](#10-portfolio-title--slug-suggestion)
11. [Prompt Changelog](#11-prompt-changelog)

---

## 1. System Prompts

### 1.1 — Global Generation System Prompt
**Version:** v1.0  
**Last tested:** 2026-06-30  
**Models tested:** Gemini 2.0 Flash, GPT-4o Mini, Llama 3 70B

```
You are an expert portfolio copywriter and career strategist.
Your job is to transform raw professional materials — resumes, project notes,
work documents, and bullet points — into polished, compelling portfolio content.

Guidelines:
- Write in first-person unless told otherwise.
- Be specific and results-oriented. Use numbers, percentages, and outcomes when available.
- Avoid filler phrases like "passionate about", "team player", "hard worker".
- Tone: confident, professional, and human. Not corporate. Not robotic.
- Never fabricate facts. If information is missing, leave a placeholder like [ADD YOUR METRIC].
- Output must be structured JSON matching the schema provided in the user message.
```

---

### 1.2 — Rewrite System Prompt
**Version:** v1.0  
**Last tested:** 2026-06-30  
**Models tested:** Gemini 2.0 Flash, Claude 3.5 Sonnet

```
You are a skilled editor helping a professional refine their portfolio content.
The user will provide:
  1. The current section content (JSON)
  2. A specific instruction for how to change it

Apply the instruction precisely. Preserve all factual information unless told to remove it.
Return only the updated JSON object — no explanation, no markdown wrapping.
```

---

## 2. Hero / Introduction Block

**Schema returned:**
```json
{
  "name": "string",
  "headline": "string (max 10 words)",
  "subheadline": "string (1-2 sentences, max 30 words)",
  "ctaText": "string (3-5 words)"
}
```

### Prompt v1.0
```
Using the professional profile below, generate a hero section for a portfolio website.

Profile data:
- Full name: {{fullName}}
- Primary role: {{primaryRole}}
- Years of experience: {{yearsExperience}}
- Top 3 skills: {{topSkills}}
- Career highlight: {{highlight}}

Return a JSON object with these exact keys:
{
  "name": "<full name>",
  "headline": "<role + value proposition, max 10 words>",
  "subheadline": "<1-2 sentence description of what they do and for whom, max 30 words>",
  "ctaText": "<call-to-action button text, 3-5 words>"
}
```

**Example Input:**
```
Full name: Alex Morgan
Primary role: Full-Stack Engineer
Years of experience: 6
Top 3 skills: React, Node.js, PostgreSQL
Career highlight: Led a team that reduced page load time by 60% at a Series B startup
```

**Example Output (Gemini 2.0 Flash):**
```json
{
  "name": "Alex Morgan",
  "headline": "Full-Stack Engineer Building Fast, Scalable Products",
  "subheadline": "I help startups and growth-stage companies ship reliable software — from pixel-perfect UIs to high-throughput APIs.",
  "ctaText": "See My Work"
}
```

---

## 3. About Me Block

**Schema returned:**
```json
{
  "title": "string",
  "body": "string (2-4 sentences)",
  "highlights": ["string", "string", "string"]
}
```

### Prompt v1.0
```
Write an "About Me" section for a portfolio site.

Input data:
- Name: {{fullName}}
- Role: {{primaryRole}}
- Bio notes: {{bio}}
- Location: {{location}}
- Key accomplishments: {{accomplishments}}

Return JSON:
{
  "title": "About Me",
  "body": "<2-4 sentence narrative paragraph in first person>",
  "highlights": ["<short achievement or fact>", "<short achievement or fact>", "<short achievement or fact>"]
}

The body should feel personal and specific. The highlights should be scannable facts (e.g. "6 years in fintech", "Open-source contributor").
```

**Example Input:**
```
Name: Alex Morgan
Role: Full-Stack Engineer
Bio notes: 6 years building web products. Love design systems and performance. Started as a designer.
Location: San Francisco, CA
Key accomplishments: Led rewrite of core API at ClearFlow, Contributed to React open source, Built 3 products from 0-to-1
```

**Example Output (GPT-4o Mini):**
```json
{
  "title": "About Me",
  "body": "I'm a full-stack engineer with 6 years of experience turning complex problems into clean, performant software. My background in design gives me a unique eye for detail — I care as much about how things look as how they scale. I've built products from zero to launch, led API migrations at growth-stage startups, and contributed to open source React tooling along the way.",
  "highlights": [
    "6 years building production web apps",
    "Former UI/UX designer",
    "3× 0-to-1 product builder"
  ]
}
```

---

## 4. Selected Work / Project Collection Block

**Schema returned:**
```json
{
  "title": "string",
  "subtitle": "string"
}
```
> Note: individual project cards are rendered from the `projects[]` array separately. This block only generates the section heading.

### Prompt v1.0
```
Generate a short section heading and subtitle for the "Selected Work" section
of a portfolio for: {{primaryRole}}.

Return JSON:
{
  "title": "<section heading, 2-4 words>",
  "subtitle": "<one sentence describing what the projects showcase, max 15 words>"
}
```

**Example Input:**
```
Primary role: Full-Stack Engineer
```

**Example Output (Llama 3 70B):**
```json
{
  "title": "Selected Work",
  "subtitle": "A curated look at projects I've shipped — from MVPs to mission-critical systems."
}
```

---

## 5. Skills & Technologies Block

**Schema returned:**
```json
{
  "title": "string",
  "categories": [
    {
      "name": "string",
      "skills": ["string"]
    }
  ]
}
```

### Prompt v1.0
```
Group the following skills into logical categories for a portfolio skills section.

Skills list: {{skillsList}}
Role: {{primaryRole}}

Return JSON:
{
  "title": "Skills & Technologies",
  "categories": [
    { "name": "<category label>", "skills": ["<skill>", ...] },
    ...
  ]
}

Create 3-5 categories. Good category names: "Frontend", "Backend", "Cloud & DevOps",
"Data & Analytics", "Design Tools", "Languages", "Testing".
Sort skills within each category alphabetically.
```

**Example Input:**
```
Skills list: React, Node.js, PostgreSQL, AWS, Docker, TypeScript, Figma, Jest, GraphQL, Redis, Python, Terraform
Role: Full-Stack Engineer
```

**Example Output (Gemini 1.5 Pro):**
```json
{
  "title": "Skills & Technologies",
  "categories": [
    {
      "name": "Frontend",
      "skills": ["React", "TypeScript"]
    },
    {
      "name": "Backend",
      "skills": ["GraphQL", "Node.js", "PostgreSQL", "Python", "Redis"]
    },
    {
      "name": "Cloud & DevOps",
      "skills": ["AWS", "Docker", "Terraform"]
    },
    {
      "name": "Design Tools",
      "skills": ["Figma"]
    },
    {
      "name": "Testing",
      "skills": ["Jest"]
    }
  ]
}
```

---

## 6. Experience Block

**Schema returned:**
```json
{
  "title": "string",
  "items": [
    {
      "company": "string",
      "role": "string",
      "period": "string",
      "summary": "string",
      "bullets": ["string"]
    }
  ]
}
```

### Prompt v1.0
```
Write an experience section for a portfolio site using the work history below.
This is NOT a resume — focus on impact and outcomes, not job duties.

Work history (JSON array):
{{workHistory}}

For each role, produce 2-3 strong impact bullets that start with an action verb.
Use numbers if they appear in the source material.

Return JSON:
{
  "title": "Experience",
  "items": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "period": "<e.g. Jan 2022 – Present>",
      "summary": "<one sentence describing the role>",
      "bullets": ["<impact bullet>", "<impact bullet>", "<impact bullet>"]
    }
  ]
}
```

**Example Input:**
```json
[
  {
    "company": "ClearFlow",
    "title": "Senior Frontend Engineer",
    "start": "2022-01",
    "end": null,
    "notes": "Built the dashboard from scratch. Reduced load time from 8s to 3s. Led team of 3 engineers. Introduced design system."
  }
]
```

**Example Output (Claude 3.5 Sonnet):**
```json
{
  "title": "Experience",
  "items": [
    {
      "company": "ClearFlow",
      "role": "Senior Frontend Engineer",
      "period": "Jan 2022 – Present",
      "summary": "Leads frontend development for a B2B SaaS analytics platform, managing a team of three engineers.",
      "bullets": [
        "Cut dashboard load time by 63% (8s → 3s) through code splitting, lazy loading, and query optimization.",
        "Architected and shipped a React component design system adopted across 4 product teams.",
        "Grew and managed a 3-engineer frontend squad, introducing weekly design reviews and pair programming rituals."
      ]
    }
  ]
}
```

---

## 7. Contact Block

**Schema returned:**
```json
{
  "title": "string",
  "body": "string",
  "email": "string"
}
```

### Prompt v1.0
```
Generate a short contact section for a portfolio.

Input:
- Name: {{fullName}}
- Email: {{email}}
- Open to: {{openTo}}  (e.g. "full-time roles", "freelance projects", "collaborations")

Return JSON:
{
  "title": "<section heading, 2-4 words>",
  "body": "<1-2 sentence warm invitation to reach out, max 25 words>",
  "email": "{{email}}"
}
```

**Example Input:**
```
Name: Alex Morgan
Email: alex@example.com
Open to: full-time roles and open source collaborations
```

**Example Output (Mistral Large):**
```json
{
  "title": "Get In Touch",
  "body": "I'm currently open to full-time engineering roles and open source collaborations. If something resonates, I'd love to hear from you.",
  "email": "alex@example.com"
}
```

---

## 8. AI Rewrite (Section-Level)

This prompt is fired when the user selects a section in the editor and submits a rewrite instruction.

### Prompt v1.0
```
Rewrite the portfolio section content below according to the user's instruction.

Current content (JSON):
{{currentContent}}

User instruction:
"{{instruction}}"

Rules:
- Keep all factual information unless the instruction says to remove it.
- Do not add invented facts or metrics.
- Return only the updated JSON object with the same keys — no explanation.
```

**Example — Make it more concise:**

Input content:
```json
{
  "title": "About Me",
  "body": "I'm a full-stack engineer with 6 years of experience turning complex problems into clean, performant software. My background in design gives me a unique eye for detail — I care as much about how things look as how they scale. I've built products from zero to launch, led API migrations at growth-stage startups, and contributed to open source React tooling along the way.",
  "highlights": ["6 years building production web apps", "Former UI/UX designer", "3× 0-to-1 product builder"]
}
```

Instruction: `"Make it more concise and punchy"`

**Output (Gemini 2.0 Flash):**
```json
{
  "title": "About Me",
  "body": "Full-stack engineer with 6 years shipping fast, well-crafted products. Design background. Built 3 products from 0-to-1. Led API migrations at growth-stage startups. Open source React contributor.",
  "highlights": ["6 years in production", "Design → Engineering", "3× 0-to-1"]
}
```

---

**Example — Change tone:**

Instruction: `"Make the tone more conversational and approachable"`

**Output (GPT-4o):**
```json
{
  "title": "About Me",
  "body": "Hey! I'm Alex — a full-stack engineer who's spent the last 6 years building things on the web. I started out as a designer, which means I actually care how the UI feels, not just that the API returns 200. I've helped startups ship their first product and scale their codebase, and I contribute to React open source when I get the chance.",
  "highlights": ["6 years building for the web", "Designer turned engineer", "Open source contributor"]
}
```

---

## 9. SEO Meta Generation

### Prompt v1.0
```
Generate SEO metadata for a professional portfolio page.

Portfolio owner:
- Name: {{fullName}}
- Role: {{primaryRole}}
- Top skills: {{topSkills}}
- Location: {{location}}

Return JSON:
{
  "seoTitle": "<name + role, max 60 chars>",
  "seoDescription": "<compelling 1-2 sentence description, max 155 chars>",
  "keywords": ["<keyword>", ...]
}

The seoTitle must be under 60 characters (Google's cutoff).
The seoDescription must be under 155 characters.
```

**Example Output (Gemini 2.0 Flash):**
```json
{
  "seoTitle": "Alex Morgan — Full-Stack Engineer",
  "seoDescription": "Portfolio of Alex Morgan, a full-stack engineer specializing in React, Node.js, and PostgreSQL. 6 years building fast, scalable web products.",
  "keywords": ["full-stack engineer", "React developer", "Node.js", "portfolio", "San Francisco engineer"]
}
```

---

## 10. Portfolio Title & Slug Suggestion

### Prompt v1.0
```
Suggest a URL slug for a portfolio site.

Name: {{fullName}}
Role: {{primaryRole}}

Return JSON:
{
  "suggestedTitle": "<portfolio page title, name + brief tagline>",
  "suggestedSlug": "<url-safe slug, lowercase, hyphens, max 30 chars>"
}
```

**Example Output:**
```json
{
  "suggestedTitle": "Alex Morgan — Full-Stack Engineer",
  "suggestedSlug": "alex-morgan"
}
```

---

## 11. Prompt Changelog

| Date | Version | Section | Change | Author |
|------|---------|---------|--------|--------|
| 2026-06-30 | v1.0 | All | Initial prompt suite created | System |
| — | — | — | _Add new entries above this line_ | — |

---

> **Note for Phase 2:** When real AI API calls are wired up in the backend, each prompt invocation should also be written to the `audit_events` table with:
> - `action: 'ai.generation'`
> - `metadata: { model, promptVersion, sectionType, inputTokens, outputTokens, latencyMs }`
>
> This creates a runtime audit trail that complements this static reference log.
