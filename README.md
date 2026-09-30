# NexusPress - Modern English Blog & Content Publishing Platform

NexusPress is a production-ready, lightweight **English-language content publication and blog platform** engineered with **Next.js (App Router), TypeScript, Tailwind CSS, and MongoDB (Mongoose)**. It features a modern public blog optimized for Google AdSense monetization and Google Analytics 4 tracking, coupled with a secure Admin CMS.

---

## 🌟 Key Features

### Public Editorial Blog
* **Modern Architecture**: Built with Next.js App Router, React Server Components, and responsive Vanilla Tailwind CSS styling.
* **Homepage Experience**:
  * Live status banner with localized date
  * Featured Cover Story hero section with glow backdrop
  * Category topic pills for horizontal filtering
  * Chronological Latest Articles feed
  * Sidebar with most-read articles, topics, and tag cloud
  * Programmatic AdSense / sponsor placement slots (Top, Mid-feed, Bottom, Sidebar)
  * Newsletter subscription dispatch unit
* **Article Reading Experience**:
  * Dynamic metadata, OpenGraph cards, and Twitter summary cards
  * Automatically generated **Table of Contents** with scroll spy
  * Formatted typography with code blocks, tables, blockquotes, and figure embeds
  * Reading time calculations & verified real-time MongoDB view counting
  * Social sharing buttons (X/Twitter, LinkedIn, Facebook, Instant Link Copy)
  * Internal linking: Related articles and Previous / Next post navigation
* **Taxonomy & Discovery**:
  * Category archives (`/category/[slug]`)
  * Tag collections (`/tag/[slug]`)
  * Search engine with pagination (`/search?q=keyword`)
* **Legal & AdSense Compliance Pages**:
  * Editorial Mission & Standards (`/about`)
  * Editorial & Business Contact Desk (`/contact`)
  * Privacy Policy with Google DoubleClick cookie disclosures (`/privacy-policy`)
  * Terms of Service (`/terms`)
  * Cookie Policy (`/cookie-policy`)
* **SEO Automation**:
  * Dynamic `sitemap.xml` generating article, category, and tag routes
  * `robots.txt` protecting admin and API routes
  * Schema.org JSON-LD structured data (`BlogPosting`, `BreadcrumbList`, `Organization`)

### Secure Admin CMS
* **Protected Routes & Edge Session**: Protected by Next.js Middleware with Edge-compatible signed JWT session tokens and HTTP-only cookies.
* **Master Dashboard**:
  * Real MongoDB metrics: Total Articles, Published, Drafts, Scheduled, Views, Categories, Tags, and Active Ad slots
  * Google Analytics 4 and Google AdSense real-time configuration status
  * Most-read and recently published article tables
* **Article Management**:
  * Full CRUD (Create, Read, Edit, Delete)
  * Draft, Published, Scheduled, and Archived statuses
  * Cover story toggle (`isFeatured`)
  * Rich article editor supporting H1–H3, Bold, Italic, Code blocks, Tables, Quotes, Lists, Image and Video embeds
  * Live sanitized preview pane (Editor, Split, Preview)
  * Custom SEO meta title, description, and keywords
* **Category & Tag Management**:
  * Category sorting, slugs, descriptions, cover images, and article counter aggregation
  * Fast inline tag creation and deletion
* **Monetization Desk**:
  * Manage 9 ad placements: Header, Homepage Top, Middle, Bottom, Sidebar, Article Top, Middle, Bottom, Footer
  * Support for Google AdSense slots, sponsor banner images, custom HTML, and script tags
  * Instant pause/activate toggles
* **System Settings**:
  * Global site branding, description, and contact info
  * Default Open Graph image and Twitter card format
  * Social channel URLs
  * GA4 Measurement ID & AdSense Publisher ID overrides

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router, Turbopack)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4
* **Database**: MongoDB with Mongoose ODM
* **Security & Auth**: bcryptjs, jose (Edge JWT), HTTP-only cookies
* **Sanitization**: sanitize-html
* **Icons**: Lucide React

---

## 🚀 Getting Started Locally

### 1. Prerequisites
* Node.js v18.17+ or Node.js v20+ (Node.js v24 recommended)
* A MongoDB database instance (Local MongoDB or free MongoDB Atlas cluster)

### 2. Installation
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` (or `.env.local`):
```bash
cp .env.example .env
```

Edit your `.env` file:
```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/english_blog?retryWrites=true&w=majority

# Secret for signing JWT session tokens (at least 32 characters)
AUTH_SECRET=nexuspress-super-secret-jwt-key-min-32-chars-2026!

# Seed Administrator Credentials
ADMIN_EMAIL=admin@nexuspress.com
ADMIN_PASSWORD=AdminPassword2026!

# Public Website URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Analytics 4 Measurement ID (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google AdSense Publisher ID (Optional)
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-0000000000000000
```

### 4. Seed the Database
Populate realistic English articles across Technology, AI, Programming, and Business:
```bash
npm run seed
```

This creates:
* Master Admin account (`admin@nexuspress.com` / `AdminPassword2026!`)
* 6 Categories (Technology, AI, Programming, Business, Productivity, Lifestyle)
* 10 Tags (Next.js, TypeScript, AI, Web Development, etc.)
* 6 High-quality, in-depth English articles (No Lorem Ipsum)
* 5 Sample advertising placements
* Global website settings

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the public publication.  
Access the Admin CMS at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## 🌐 Production Deployment Guide

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a database user with Read/Write privileges.
3. Under **Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere) so serverless Vercel edge/lambdas can connect.
4. Copy the connection string (format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/english_blog?retryWrites=true&w=majority`).

### 2. Vercel Deployment
1. Push your repository to GitHub / GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. In **Environment Variables**, add:
   * `MONGODB_URI`
   * `AUTH_SECRET`
   * `ADMIN_EMAIL`
   * `ADMIN_PASSWORD`
   * `NEXT_PUBLIC_SITE_URL` (e.g. `https://yourdomain.com`)
   * `NEXT_PUBLIC_GA_ID` (e.g. `G-XXXXXXXXXX`)
   * `NEXT_PUBLIC_ADSENSE_CLIENT` (e.g. `ca-pub-xxxxxxxxxxxxxxxx`)
5. Click **Deploy**.
6. After deployment completes, run the seed script once from your local machine pointing `MONGODB_URI` to your Atlas cluster (`npm run seed`), or use the Admin CMS directly to create content.

### 3. Custom Domain Setup
1. In your Vercel project settings, go to **Domains**.
2. Add your custom apex domain (`yourdomain.com`) and `www.yourdomain.com`.
3. Configure your DNS provider with the CNAME and A records displayed by Vercel.

### 4. Google Analytics 4 Setup
1. Go to [Google Analytics](https://analytics.google.com).
2. Create a Property for your domain and select **Web**.
3. Copy your Measurement ID (`G-XXXXXXXXXX`).
4. Set `NEXT_PUBLIC_GA_ID` in your environment or enter it directly in **Admin → Settings → Analytics & AdSense**.

### 5. Google AdSense Integration
1. Apply for Google AdSense with your custom domain.
2. Ensure your legal pages (`/privacy-policy`, `/terms`, `/cookie-policy`, `/about`, `/contact`) are live and accessible.
3. Obtain your Publisher ID (`ca-pub-xxxxxxxxxxxxxxxx`).
4. Set `NEXT_PUBLIC_ADSENSE_CLIENT` or update **Admin → Settings**.
5. In **Admin → Advertisements**, enable placement units and assign Ad Slot IDs.

---

## 🔒 Security & Performance Features

* **No Plaintext Passwords**: Password hashing using 10 rounds of salt with bcrypt.
* **HTTP-Only Cookies**: Protected against cross-site scripting (XSS) cookie extraction.
* **Edge Route Protection**: Admin paths (`/admin/*`) verified via Next.js Middleware.
* **HTML Sanitization**: Article content is sanitized via `sanitize-html` to prevent malicious tag injections.
* **Connection Caching**: Global connection pooling in `src/lib/mongodb.ts` prevents connection exhaustion on serverless platforms.
* **Image Optimization**: Fully optimized responsive images using `next/image` with WebP delivery.

---

## 📄 License
MIT License. Created for high-performance digital publishing.
