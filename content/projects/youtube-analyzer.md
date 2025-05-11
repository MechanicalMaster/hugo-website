---
title: "YouTube Analyzer: AI-Powered Video Summarization Tool"
date: 2023-09-15
description: "An AI-powered web application that provides concise, structured summaries of YouTube videos, saving users time and helping them extract key information efficiently."
tags: ["AI", "Next.js", "Supabase", "LLM", "Tailwind CSS", "Product Management", "Web Development"]
---

## YouTube Analyzer: Taming Information Overload from Video

*As a Product Manager with a technical background, I built YouTube Analyzer to demonstrate my ability to conceive, design, and implement AI-powered features from end-to-end. This project showcases how product thinking can be combined with modern AI capabilities to solve real-world user problems.*

---

### The Problem: Information Overload

In an age of information abundance, YouTube is a vast ocean of knowledge, tutorials, and entertainment. However, the sheer volume of content and the length of many videos make it challenging to quickly extract key information. Users often spend significant time watching entire videos to find the specific insights they need, leading to inefficiency and information fatigue.

---

### My Solution: AI-Powered Video Summarization

YouTube Analyzer is a web application designed to tackle this problem head-on. It leverages Artificial Intelligence, specifically Large Language Models (LLMs), to provide users with concise, structured summaries of YouTube videos. This allows users to:

* **Save Time:** Quickly grasp the main points of a video without watching it in its entirety.
* **Improve Learning:** Easily review key concepts and takeaways.
* **Efficient Research:** Rapidly assess the relevance of multiple videos.

---

### How It Works: A User's Journey

The application offers a seamless user experience:

1. **Landing Page & Authentication:** Users are introduced to the app via a landing page (showcasing features and pricing tiers built with Next.js and animated with Framer Motion) and can sign up or log in. Authentication is handled securely by Supabase, and new users receive an initial credit balance.

2. **Dashboard:** Upon logging in, users are greeted with a clean dashboard where they can input a YouTube video URL.

3. **Summarization:** After submitting a URL, a Next.js server action (`actions/summarize-video.ts`) processes the video. This involves fetching video details and its content (e.g., transcript), then sending this information to an AI model.

4. **View Summary:** The generated summary is displayed, typically including:
   * An overall concise summary.
   * Key talking points.
   * Timestamped sections for easy navigation within the video content.

5. **History:** All generated summaries are automatically saved to the user's personal history page (`app/(dashboard)/history/page.tsx`). This page features a paginated grid of `SummaryTile` components, each displaying the video title, a truncated summary, creation date, and a YouTube thumbnail.

6. **Detailed Summary View:** Users can click on any summary in their history to navigate to a dynamic route (`app/(dashboard)/summary/[id]/page.tsx`). This page presents the full summary, including all sections (often in an `Accordion` component for better readability), and allows users to quickly jump back to their history.

7. **Manage Summaries:** Users can delete summaries they no longer need via an `AlertDialog` confirmation, triggering another server action (`actions/delete-summary.ts`).

8. **Personalization & Settings:** A dedicated settings page (`components/settings.tsx`), integrated into the profile page (`app/profile/page.tsx`), allows users to manage preferences like UI theme (Light/Dark/System via `next-themes`), default actions, and search language. User settings are fetched and updated using Supabase client functions (`fetchUserSettings`, `updateUserSettings`).

---

### Under the Hood: The Technology Stack

This application is built using a modern, robust technology stack:

* **Frontend:**
  * **Next.js 14 & React:** For a fast, server-rendered application using the App Router.
  * **Tailwind CSS & Shadcn/UI:** For a utility-first approach to styling and a collection of accessible UI components (e.g., `Card`, `Button`, `Dialog`, `Select`).
  * **`next-themes`:** For theme management.
  * **`framer-motion`:** Used on the landing page for engaging animations.

* **Backend & Database:**
  * **Supabase:** An open-source Firebase alternative, providing:
    * **PostgreSQL Database:** To store user data (`users` table with `credits`), user settings (`user_settings` table with a trigger `on_user_created` to initialize defaults), and summaries (`summaries` table with fields like `id`, `user_id`, `video_id`, `video_title`, `summary_data` (JSONB), and `created_at`).
    * **Authentication:** Secure user sign-up and login.
    * **Row-Level Security (RLS):** Implemented extensively (e.g., on `summaries` and `user_settings`) to ensure users can only access and manage their own data (e.g., `user_id = auth.uid()`).
    * **Admin Client (`supabaseAdmin`):** A service role client, initialized in `lib/supabase.ts` using the `SUPABASE_SERVICE_ROLE_KEY`, is crucial. It's used in server actions to bypass RLS for necessary backend operations like inserting new summaries or updating user credits, which are critical for system integrity when RLS might otherwise block server-to-server interactions where `auth.uid()` is null.

* **Server-Side Logic:**
  * **Next.js Server Actions:** Used for backend operations like video summarization (`actions/summarize-video.ts`) and deleting summaries (`actions/delete-summary.ts`), allowing direct, secure function calls from client components to server-side code.

* **Image Handling:**
  * **`next/image`:** With `remotePatterns` correctly configured in `next.config.mjs` to allow images from YouTube domains (`img.youtube.com`, `i.ytimg.com`). Client-side error handling in components like `SummaryTile` ensures a placeholder icon (`FileVideo`) is shown if a thumbnail fails to load.

---

### Key AI Capabilities: The Summarization Engine

The core AI functionality revolves around generating high-quality summaries:

1. **Video Content Ingestion:** The system first acquires the textual content of the YouTube video. (The exact mechanism for transcript fetching, e.g., using a library like `youtube-dl` or a dedicated API, isn't detailed in the summary but is a necessary precursor).

2. **LLM-Powered Summarization:**
   * The transcript and video metadata are then processed by a Large Language Model (LLM). While the specific model (e.g., from OpenAI, Anthropic) can be chosen based on requirements, the key is its ability to understand context and condense lengthy text.
   * The `generateSummaryForUser` function within `actions/summarize-video.ts` orchestrates this. It takes the video content and sends it to the LLM with a carefully crafted prompt.
   * The prompt guides the LLM to produce a structured output. This output is then saved into the `summary_data` JSONB field in the `summaries` table. This structured data typically includes:
     * `overall_summary`: A brief overview of the video's content.
     * `key_points`: Bullet points highlighting the most important information or arguments.
     * `sections`: A breakdown of the video into logical segments, often with titles and corresponding timestamps from the video, making the summary more digestible and allowing users to jump to relevant parts of the original video if needed.

3. **Credit Management:** Recognizing that LLM calls are resource-intensive, the application implements a credit system. Each summarization deducts credits from the user's account (stored in the `users` table). This critical operation also uses the `supabaseAdmin` client to ensure credit updates are reliably processed server-side, irrespective of RLS on the `users` table that might otherwise restrict direct updates without a user session.

*(This project currently focuses on the core summarization. Future AI enhancements could include RAG pipelines for Q&A on video content, embedding generation for semantic search across summaries, or even voice-based interaction.)*

---

### Product Thinking in Action

Several design and architectural decisions were guided by product strategy and a relentless focus on user experience:

* **User-Centric Feature Set:** The application prioritizes features that deliver immediate user value. The History tab with `SummaryTile` components for quick review, pagination (`CustomPagination`) for handling many summaries, and detailed summary views with `Accordion` components for readability are prime examples.

* **Robust Backend Operations & Security:** The deliberate use of a `supabaseAdmin` client for critical server actions (saving summaries, updating credits, deleting summaries) was a direct result of understanding and correctly working with Supabase's RLS. This ensures data integrity and allows server-side processes to function securely and reliably—a key learning in integrating RLS with Next.js Server Actions.

* **Iterative Problem Solving & Refinement:** The development journey involved identifying and systematically fixing issues. This included:
  * Refining RLS policies from a single `SELECT`-only policy to specific `SELECT` and `INSERT` policies.
  * Addressing server action authentication by employing the `supabaseAdmin` client.
  * Fixing image loading errors by updating `next.config.mjs` from deprecated `images.domains` to `images.remotePatterns`.
  * Ensuring correct user credit updates by also using `supabaseAdmin` for that database interaction.
  
  This iterative debugging and enhancement process is crucial for shipping reliable AI features.

* **Scalability & Maintainability Considerations:**
  * The use of a JSONB field for `summary_data` offers flexibility to evolve the structure of summary content generated by the LLM without frequent, disruptive schema migrations.
  * The new dashboard layout (`app/(dashboard)/layout.tsx`) provides a consistent navigation structure ("Dashboard", "History") and user experience across related application sections.
  * A component-based architecture (e.g., `SummaryTile`, `CustomPagination`, `Settings`, `AlertDialog`) promotes code reusability, testability, and easier maintenance.

* **Clear User Feedback and Control:** Implementing `AlertDialog` for delete confirmations enhances UX by preventing accidental data loss. Adding settings for theme and other preferences empowers users.

* **Future-Proofing:** By building a modular system with server actions and a robust database schema, the application is well-positioned for future enhancements, such as different summary types, more advanced AI features, or subscription tiers.

---

### Outcome: Shipping AI Features End-to-End

This YouTube Analyzer project serves as a tangible demonstration of my ability to:

* **Identify a User Need:** Recognize a common pain point (information overload from lengthy videos) and conceptualize an AI-driven solution.
* **Design a User-Friendly Product:** Translate the solution into intuitive user flows, a clean interface, and features that directly address user needs (e.g., quick summaries, history, detailed views).
* **Architect and Implement a Full-Stack Application:** Utilize modern web technologies (Next.js, React, Supabase, Tailwind CSS) to build both the interactive frontend and the robust backend.
* **Integrate and Leverage AI:** Successfully incorporate LLMs as the core engine for the summarization feature, including designing how data flows to and from the AI model.
* **Navigate Complex Technical Challenges:** Systematically troubleshoot and resolve issues related to database security (RLS with Supabase), server-side authentication for backend tasks, API integrations, and frontend development best practices.
* **Think and Act Like a Product Owner:** Manage the development lifecycle from concept to a functional application, make pragmatic technical trade-offs, and iterate based on encountered challenges and implicit user needs.

As a Product Manager with a hands-on technical approach, this project highlights my capacity to not only define *what* to build but also to deeply understand *how* it's built, and to actively participate in bringing AI-powered features to life. It underscores the ability to bridge the critical gap between product vision and engineering execution—an essential skill for delivering impactful AI products in today's rapidly evolving technology landscape.

---

### See it in Action

Explore the project firsthand:

* **Live Application:** [https://youtube-summary-plum.vercel.app/](https://youtube-summary-plum.vercel.app/)
* **GitHub Repository:** [https://github.com/MechanicalMaster/Youtube-Summary.git](https://github.com/MechanicalMaster/Youtube-Summary.git)