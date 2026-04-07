# System Architecture

## 1. High-Level Architecture
The system is built on a modular, layered static-site architecture using Next.js (App Router). It is essentially a file-based CMS. Instead of a traditional database, it utilizes Markdown files as its internal data source. The application parses these flat files using Node filesystem APIs to statically generate (and server-render) user-facing HTML pages.

## 2. Layer Definitions

### Routing / Presentation Layer (`app/`)
* **Purpose:** Defines the site structure, handles URL routing, and fetches data for specific pages.
* **Responsibilities:** Mapping URLs to React trees, declaring page metadata, and orchestrating server-side data extraction before passing it to visual components.
* **Can depend on:** `components/`, `lib/`, `types/`
* **Must NOT depend on:** Direct file-system or database operations (must delegate to `lib/`).

### Component Layer (`components/`)
* **Purpose:** Pure visual rendering.
* **Responsibilities:** Rendering data into styled HTML using React and Tailwind CSS. Contains reusable UI bits (e.g., `Navbar.tsx`, `ProjectCard.tsx`) and domain-specific UI sections (e.g., `home/HeroSection.tsx`).
* **Can depend on:** Other `components/`, `types/`, third-party UI libraries (e.g., `lucide-react`).
* **Must NOT depend on:** `lib/` (data access), `app/` (routing constraints).

### Service / Data Access Layer (`lib/`)
* **Purpose:** Centralized logic for interacting with the application's markdown "database".
* **Responsibilities:** Using Node.js APIs (`fs`, `path`) and parsers (`gray-matter`) to find, read, parse, format, sort, and expose Markdown content as strongly-typed JavaScript objects.
* **Can depend on:** Built-in node modules, `content/` files, `types/`.
* **Must NOT depend on:** `app/`, `components/` (UI/presentation concerns).

### Data / Content Layer (`content/`)
* **Purpose:** The actual persisted data store.
* **Responsibilities:** Hosting markdown (`.md`) files containing metadata via front-matter and article text.
* **Can depend on:** Nothing. Code cannot be imported here.
* **Must NOT depend on:** Any code or scripts.

## 3. Data Flow
A typical execution path for a dynamic data page (like a single project view):

1. **Routing:** Request hits a dynamic Next.js App router endpoint (e.g., `app/projects/[slug]/page.tsx`).
2. **Service Request:** The `page.tsx` module calls a data-fetching function from the Service Layer (e.g., `getProjectBySlug(slug)` inside `lib/projects.ts`).
3. **Data Access:** The `lib` function reads the corresponding Markdown file from the Data Layer (`content/projects/`).
4. **Processing:** The `lib` function leverages `gray-matter` to parse matter and markdown body, converting it into a structured JavaScript Object.
5. **Component Rendering:** The Next.js page passes this data structure as props to pure UI components imported from `components/` (and processes the Markdown content block via `remark` into HTML).
6. **Response:** The generated HTML interface is served to the client.

## 4. Dependency Rules (Observed)
* **Unidirectional Flow:** Imports flow strictly downwards or laterally. Routes (`app/`) import both UI (`components/`) and Logic (`lib/`). UI (`components/`) does not import Logic (`lib/`). Logic (`lib/`) operates independently of UI.
* **File System Access:** Only the `lib/` directory is routinely designed to utilize filesystem libraries (`fs` and `path`) to read local flat files.

## 5. Cross-Cutting Concerns

* **Styling:** Handled comprehensively via Tailwind CSS. The configuration core is `tailwind.config.ts`, with global tokens injected via `app/globals.css`. Components use inline utility classes.
* **Markdown Rendering:** Handled largely synchronously within routes themselves (e.g., `app/projects/[slug]/page.tsx`) via the `remark` ecosystem (`remark-gfm`, `remark-html`) before directly setting HTML.
* **External Integrations:** Functionalities requiring secure isolation from the main Next.js node site—specifically the AI Chat server proxy—are offloaded to independent Cloudflare Workers (`ai-chat-proxy` / `workers` directories).
* **Metadata & SEO:** Handled declaratively at the top of route files (`page.tsx`) by exporting a `generateMetadata` function or `metadata` object per Next.js conventions.

## 6. Architectural Weak Spots (Optional)
* The repository appears to hold potentially duplicative Cloudflare Worker environments (`workers/` vs `/ai-chat-proxy/`), which can lead to deployment confusion regarding the canonical location of worker development.
* Markdown-to-HTML conversion logic is placed alongside UI code in routing files (e.g., inside `app/projects/[slug]/page.tsx`) rather than decoupled into a shared utility function inside `lib/`.
