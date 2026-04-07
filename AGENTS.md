# AGENTS.md

## 1. Project Overview
This repository contains a personal website, portfolio, and blog built using Next.js (App Router). It serves to showcase projects, thoughts, and experiences. The system is primarily content-driven, converting statically stored Markdown files into HTML pages using React components and Tailwind CSS for styling. The primary runtime environment is Node.js for Next.js, with additional external integrations via Cloudflare Workers (e.g., an AI chat proxy).

## 2. Architecture Overview
The application follows a strictly layered Next.js static site architecture. It distinguishes between routing (App Router), presentation (React UI components), data access (Node.js FS operations parsing Markdown), and raw data (Markdown files).
For full architectural details, see [`docs/architecture.md`](docs/architecture.md).

## 3. Folder Responsibility Map
* `/app` — Request handling, page routing (Next.js App Router), and data fetching orchestration.
* `/components` — Reusable pure presentational React components (e.g., UI blocks, cards, layout pieces). 
* `/content` — Data layer; contains raw Markdown files (e.g., projects, policies) acting as the underlying database.
* `/lib` — Business logic and data access tier; handles reading, parsing, and filtering filesystem Markdown content.
* `/types` — Shared TypeScript type definitions.
* `/public` & `/static` — Static assets (images, fonts, etc.).
* `/workers` & `/ai-chat-proxy` — External Cloudflare Worker scripts for proxying requests (e.g., AI chat integration).

## 4. Coding and Structural Standards (Observed)
* **Naming Patterns:** React component files use PascalCase (e.g., `ProjectCard.tsx`). Route files use Next.js conventions (`page.tsx`, `layout.tsx`). Utility files use camelCase (e.g., `projects.ts`).
* **Module Boundaries:** UI elements are isolated within `components/`. Data reading operations are centralized in `lib/`.
* **Dependency Direction:** `app/` modules import from `components/` and `lib/`. Modules inside `components/` are a pure presentational layer and do not import from `lib/`. `lib/` modules do not import from `app/` or `components/`. 

## 5. Non-Negotiable Guardrails
* **Strict Dependency Separation:** The `components/` layer MUST NOT directly import or query data from `lib/` or `content/`. Components are strictly for presentation.
* **Business Logic Placement:** All data retrieval, filtering, and sorting logic (accessing the Markdown files) belongs exclusively in `lib/`. 
* **Data Access Placement:** Components must have data passed to them as props from page components in `app/`.
* **No Database:** Do not introduce ORMs, databases, or external API data stores for core site content; it is powered solely by localized Markdown files in `content/`.

## 6. Adding New Features
* **New Page:** Create a directory in `app/` (e.g., `app/new-feature/`) and add a `page.tsx` file to handle website routing and data orchestration.
* **New UI Component:** Create a `.tsx` file in `components/` (or a subfolder like `components/home/` if page-specific). Design it to accept raw data via props.
* **New Content Type:** Add markdown files to a new directory in `content/` and create an accompanying parser script in `lib/` (following the pattern in `lib/projects.ts`) to read and transform them.
