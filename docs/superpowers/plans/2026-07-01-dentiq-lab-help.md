# DentIQ Lab Help Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, Vietnamese-first help site for DentIQ Lab (~58 pages) that mirrors the DentIQ clinic help site's shell, patterns, and search.

**Architecture:** Static HTML pages, each shipping only an `<article class="docs-content">` body. A shared `assets/docs-shell.js` injects topbar/sidebar/related/footer from a `NAV` array + `RELATED` map keyed by `<body data-page>`. Fuse.js searches `assets/search-data.json`. No build step. A Node integrity checker (`scripts/check.mjs`) is the test harness: it verifies every page is registered in NAV + search-data + sitemap, every RELATED key resolves, and no internal link is broken.

**Tech Stack:** HTML5, vanilla JS (Fuse.js CDN), CSS custom properties, Node 20 (checker only, no deps), Vercel static hosting.

**Reference site:** `/Users/tuong/Projects/dentiq-help` — copy shell from here.
**Source of truth:** `/Users/tuong/Projects/dentlab/specs` — content per page.
**Screenshots:** `/Users/tuong/Projects/dentlab/screenshots/<feature>/<view>--<state>.png`.
**Design spec:** `docs/superpowers/specs/2026-07-01-dentiq-lab-help-design.md`.

**Conventions used by every page-authoring task:**
- Language: Vietnamese-first. Keep-English lab terms untranslated: `shade, milling, sinter, glaze, try-in, STL, scan, QC, crown, veneer, margin, abutment, zirconia, e.max, PFM`.
- Every page = one of 4 patterns (exemplars in Tasks 4–7): **feature**, **workflow (`wf-*`)**, **role (`role-*`)**, **reference**.
- Registering a page always touches 4 places: NAV (docs-shell.js), RELATED (docs-shell.js), search-data.json, sitemap.xml. The checker enforces all 4.
- Screenshots: if `dentlab/screenshots/<feature>/` exists for the page, `cp` the `--happy` (and other relevant) shots into `assets/<page-key>/` and reference via `<figure>`. Otherwise use `<figure class="placeholder">`.
- Domain assumed `https://help.dentiqlab.vn/` — change the `SITE_ORIGIN` constant (Task 2) and shell if different.

---

## File Structure

```
dentiq-lab-help/
├── index.html                       # overview page (data-page="overview")
├── <page-key>.html                  # 57 more content pages
├── assets/
│   ├── docs-shell.js                # NAV + RELATED + injector + search (copied, rebranded)
│   ├── styles.css                   # tokens/global (copied, hue rebranded)
│   ├── subpages.css                 # article styles (copied verbatim)
│   ├── landing.css                  # index layout (copied verbatim)
│   ├── search-data.json             # search index (rebuilt for Lab pages)
│   ├── icons/{logo.png,favicon.ico} # Lab branding
│   └── <page-key>/*.png             # per-page screenshots copied from dentlab
├── scripts/
│   ├── check.mjs                    # integrity checker (test harness)
│   └── gen-llms.mjs                 # llms.txt generator from search-data.json
├── sitemap.xml
├── robots.txt
├── llms.txt                         # generated
├── AI-SYNC.md                       # page↔spec ledger, tracks dentlab/specs commit
├── vercel.json
├── .vercelignore
├── package.json
└── docs/superpowers/{specs,plans}/  # this plan + design
```

---

## Task 1: Copy & rebrand the shell

**Files:**
- Create: `assets/` (copied), `package.json`, `robots.txt`, `.gitignore`
- Modify: `assets/docs-shell.js`, `assets/styles.css`

- [ ] **Step 1: Copy shell assets from dentiq-help**

```bash
cd /Users/tuong/Projects/dentiq-lab-help
mkdir -p assets scripts
cp /Users/tuong/Projects/dentiq-help/assets/docs-shell.js assets/
cp /Users/tuong/Projects/dentiq-help/assets/styles.css assets/
cp /Users/tuong/Projects/dentiq-help/assets/subpages.css assets/
cp /Users/tuong/Projects/dentiq-help/assets/landing.css assets/
cp /Users/tuong/Projects/dentiq-help/assets/site.js assets/ 2>/dev/null || true
cp /Users/tuong/Projects/dentiq-help/robots.txt .
cp /Users/tuong/Projects/dentiq-help/package.json . 2>/dev/null || true
mkdir -p assets/icons
cp /Users/tuong/Projects/dentiq-help/assets/icons/favicon.ico assets/icons/ 2>/dev/null || true
```

- [ ] **Step 2: Add a placeholder Lab logo**

Until a real logo exists, copy DentIQ's and rename; swap later.
```bash
cp /Users/tuong/Projects/dentiq-help/assets/icons/logo.png assets/icons/logo.png
```

- [ ] **Step 3: Empty the NAV and RELATED in docs-shell.js**

In `assets/docs-shell.js`, replace the entire `const NAV = [ ... ];` array (lines ~6–78) with:
```javascript
  const NAV = [];
```
Replace the entire `const RELATED = { ... };` object (lines ~82–144) with:
```javascript
  const RELATED = {};
```
Change the brand constant (line ~146):
```javascript
  const BRAND_LOGO = '<img src="assets/icons/logo.png" alt="DentIQ Lab logo" width="24" height="24">';
```
Leave the rest of the file (injector, search, keyboard handling) untouched — it is content-agnostic.

- [ ] **Step 4: Rebrand color hue in styles.css**

In `assets/styles.css`, shift the primary hue from indigo (265) to steel-blue (230) so the Lab site is visually distinct from the clinic site. Replace lines ~25–28:
```css
  --primary: oklch(0.42 0.16 230);
  --primary-strong: oklch(0.34 0.18 230);
  --primary-soft: oklch(0.965 0.022 230);
  --primary-tint: oklch(0.92 0.045 230);
```
Leave accent (sage 165) and all other tokens as-is.

- [ ] **Step 5: Write package.json**

```json
{
  "name": "dentiq-lab-help",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "check": "node scripts/check.mjs",
    "gen-llms": "node scripts/gen-llms.mjs"
  }
}
```

- [ ] **Step 6: Write .gitignore**

```
node_modules/
.DS_Store
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: copy and rebrand docs shell from dentiq-help"
```

---

## Task 2: Integrity checker (test harness) + page registry

The checker is the single source that lists every intended page. Authoring tasks add rows here; the checker fails until the page file + registration exist. This is the TDD loop for a content site.

**Files:**
- Create: `scripts/check.mjs`, `scripts/pages.json`, `sitemap.xml` (seed)

- [ ] **Step 1: Write the page registry `scripts/pages.json`**

The full intended sitemap. Each entry: `{key, section, label}`. (href is `<key>.html`, except overview → `index.html`.)
```json
{
  "sections": [
    "Bắt đầu", "Theo vai trò", "Đặt đơn", "Sản xuất",
    "Giao nhận & bảo hành", "Tài chính", "Mạng lưới & tích hợp",
    "Quản trị", "Tình huống thực tế", "Tài liệu khác"
  ],
  "pages": [
    {"key":"overview","section":"Bắt đầu","label":"Tổng quan"},
    {"key":"getting-started","section":"Bắt đầu","label":"Bắt đầu nhanh"},
    {"key":"concepts","section":"Bắt đầu","label":"Khái niệm cốt lõi"},
    {"key":"lab-setup-wizard","section":"Bắt đầu","label":"Cấu hình labo lần đầu"},
    {"key":"migrate-from-excel-zalo","section":"Bắt đầu","label":"Chuyển từ Excel/Zalo"},

    {"key":"role-lab-owner","section":"Theo vai trò","label":"Chủ labo"},
    {"key":"role-coordinator","section":"Theo vai trò","label":"Điều phối"},
    {"key":"role-technician","section":"Theo vai trò","label":"Kỹ thuật viên"},
    {"key":"role-qc","section":"Theo vai trò","label":"QC"},
    {"key":"role-shipper","section":"Theo vai trò","label":"Giao nhận"},
    {"key":"role-accountant","section":"Theo vai trò","label":"Kế toán labo"},
    {"key":"role-clinic-dentist","section":"Theo vai trò","label":"Nha sĩ (clinic)"},
    {"key":"role-clinic-assistant","section":"Theo vai trò","label":"Phụ tá (clinic)"},
    {"key":"role-clinic-owner","section":"Theo vai trò","label":"Chủ phòng khám"},

    {"key":"connectionless-intake","section":"Đặt đơn","label":"Đặt đơn không cài (QR/web)"},
    {"key":"rx-photo-capture","section":"Đặt đơn","label":"Rx & chụp ảnh"},
    {"key":"dentiq-connected-intake","section":"Đặt đơn","label":"Đặt đơn qua DentIQ"},
    {"key":"stl-scan-upload","section":"Đặt đơn","label":"Tải STL / scan"},
    {"key":"lab-slip","section":"Đặt đơn","label":"Phiếu labo"},

    {"key":"case-queue-assignment","section":"Sản xuất","label":"Hàng đợi & phân ca"},
    {"key":"production-board","section":"Sản xuất","label":"Bảng sản xuất"},
    {"key":"production-stages","section":"Sản xuất","label":"Công đoạn sản xuất"},
    {"key":"qc-gate","section":"Sản xuất","label":"Cổng QC"},

    {"key":"shipment-delivery-tracking","section":"Giao nhận & bảo hành","label":"Giao & theo dõi"},
    {"key":"redo-management","section":"Giao nhận & bảo hành","label":"Quản lý redo"},
    {"key":"warranty-lookup-claims","section":"Giao nhận & bảo hành","label":"Bảo hành & tra cứu"},

    {"key":"pricing-material-catalog","section":"Tài chính","label":"Bảng giá & vật liệu"},
    {"key":"accounts-receivable","section":"Tài chính","label":"Công nợ"},
    {"key":"statement","section":"Tài chính","label":"Sao kê"},
    {"key":"e-invoice-issuance","section":"Tài chính","label":"Hoá đơn điện tử"},
    {"key":"deposit","section":"Tài chính","label":"Đặt cọc"},

    {"key":"lab-clinic-invitation","section":"Mạng lưới & tích hợp","label":"Mời phòng khám"},
    {"key":"lab-clinic-connection","section":"Mạng lưới & tích hợp","label":"Kết nối DentIQ"},
    {"key":"zalo-bridge","section":"Mạng lưới & tích hợp","label":"Zalo ZNS"},
    {"key":"e-invoice-providers","section":"Mạng lưới & tích hợp","label":"Nhà cung cấp HĐĐT"},

    {"key":"roles-permissions","section":"Quản trị","label":"Vai trò & phân quyền"},
    {"key":"lab-settings","section":"Quản trị","label":"Cấu hình labo"},
    {"key":"reports-kpi","section":"Quản trị","label":"Báo cáo & KPI"},
    {"key":"notifications","section":"Quản trị","label":"Thông báo"},
    {"key":"security","section":"Quản trị","label":"Bảo mật & dữ liệu"},

    {"key":"wf-first-order","section":"Tình huống thực tế","label":"Đơn đầu tiên (clinic)"},
    {"key":"wf-case-lifecycle","section":"Tình huống thực tế","label":"Vòng đời case A→Z"},
    {"key":"wf-rush-order","section":"Tình huống thực tế","label":"Đơn gấp (48h)"},
    {"key":"wf-physical-impression","section":"Tình huống thực tế","label":"Mẫu vật lý gửi kèm"},
    {"key":"wf-stl-digital","section":"Tình huống thực tế","label":"Case digital (STL)"},
    {"key":"wf-qc-fail-rework","section":"Tình huống thực tế","label":"QC trượt → làm lại"},
    {"key":"wf-redo-claim","section":"Tình huống thực tế","label":"Redo sau giao"},
    {"key":"wf-warranty-claim","section":"Tình huống thực tế","label":"Yêu cầu bảo hành"},
    {"key":"wf-month-end-ar","section":"Tình huống thực tế","label":"Chốt công nợ cuối tháng"},
    {"key":"wf-einvoice-failed","section":"Tình huống thực tế","label":"HĐĐT thất bại"},
    {"key":"wf-clinic-claim-account","section":"Tình huống thực tế","label":"Nâng cấp tài khoản clinic"},
    {"key":"wf-connect-dentiq","section":"Tình huống thực tế","label":"Liên kết clinic DentIQ"},
    {"key":"wf-lab-go-live","section":"Tình huống thực tế","label":"Labo go-live"},

    {"key":"troubleshoot","section":"Tài liệu khác","label":"Xử lý sự cố"},
    {"key":"faq","section":"Tài liệu khác","label":"FAQ"},
    {"key":"glossary","section":"Tài liệu khác","label":"Thuật ngữ"},
    {"key":"shortcuts","section":"Tài liệu khác","label":"Phím tắt"},
    {"key":"changelog","section":"Tài liệu khác","label":"Changelog"}
  ]
}
```

- [ ] **Step 2: Write `scripts/check.mjs`**

```javascript
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_ORIGIN = 'https://help.dentiqlab.vn';
const reg = JSON.parse(readFileSync(join(ROOT, 'scripts/pages.json'), 'utf8'));
const shell = readFileSync(join(ROOT, 'assets/docs-shell.js'), 'utf8');
const errors = [];

const href = (k) => (k === 'overview' ? 'index.html' : `${k}.html`);

// search-data.json (may be an empty [] early on)
let search = [];
const searchPath = join(ROOT, 'assets/search-data.json');
if (existsSync(searchPath)) search = JSON.parse(readFileSync(searchPath, 'utf8'));
const searchKeys = new Set(search.map((e) => e.key));

// sitemap.xml
let sitemap = '';
const sitemapPath = join(ROOT, 'sitemap.xml');
if (existsSync(sitemapPath)) sitemap = readFileSync(sitemapPath, 'utf8');

for (const p of reg.pages) {
  const file = join(ROOT, href(p.key));
  if (!existsSync(file)) { errors.push(`[missing-file] ${href(p.key)}`); continue; }
  const html = readFileSync(file, 'utf8');
  if (!html.includes(`data-page="${p.key}"`))
    errors.push(`[bad-data-page] ${href(p.key)} missing data-page="${p.key}"`);
  if (!shell.includes(`key: '${p.key}'`) && !shell.includes(`key:'${p.key}'`))
    errors.push(`[nav-unregistered] ${p.key} not in docs-shell.js NAV`);
  if (!searchKeys.has(p.key))
    errors.push(`[search-missing] ${p.key} not in search-data.json`);
  if (sitemap && !sitemap.includes(`${SITE_ORIGIN}/${href(p.key)}`))
    errors.push(`[sitemap-missing] ${p.key} not in sitemap.xml`);
}

// RELATED keys must be real page keys
const validKeys = new Set(reg.pages.map((p) => p.key));
const relMatch = shell.match(/const RELATED = \{([\s\S]*?)\n  \};/);
if (relMatch) {
  for (const m of relMatch[1].matchAll(/'([^']+)'/g)) {
    if (!validKeys.has(m[1])) errors.push(`[related-bad-key] '${m[1]}' not a known page`);
  }
}

// internal <a href="X.html"> targets must exist
for (const p of reg.pages) {
  const file = join(ROOT, href(p.key));
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/href="([a-z0-9-]+)\.html"/g)) {
    const target = join(ROOT, `${m[1]}.html`);
    if (!existsSync(target)) errors.push(`[broken-link] ${href(p.key)} → ${m[1]}.html`);
  }
}

if (errors.length) {
  console.error(`FAIL — ${errors.length} issue(s):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`OK — ${reg.pages.length} pages registered, all links resolve.`);
```

- [ ] **Step 3: Seed an empty sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
</urlset>
```

- [ ] **Step 4: Run the checker — expect it to FAIL**

Run: `node scripts/check.mjs`
Expected: `FAIL` listing every page as `[missing-file]` (no pages built yet). This confirms the harness works.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: add page registry and integrity checker"
```

---

## Task 3: Registration helper conventions (reference for all later tasks)

No code — this task documents the exact edits every page-authoring task repeats. Later tasks say "register the page (Task 3 convention)".

**To register page `<key>` in section `<Section>` with label `<Label>`:**

1. **NAV** — in `assets/docs-shell.js`, inside the `NAV` array, find or add the section object and append:
```javascript
{ key: '<key>', href: '<key>.html', label: '<Label>' },
```
(For `overview`, href is `index.html`.) Section objects use the exact strings from `pages.json` `sections`.

2. **RELATED** — add one line mapping this page to 3–5 sibling keys, and add this key into 2–3 other pages' arrays:
```javascript
'<key>': ['<related1>', '<related2>', '<related3>'],
```

3. **search-data.json** — append one entry:
```json
{ "key": "<key>", "url": "<key>.html", "title": "<Title>", "section": "<Section>",
  "description": "<1-sentence VN summary>",
  "keywords": ["<term with dấu>", "<term khong dau>", "..."] }
```
Keywords: include each important term twice — with and without Vietnamese diacritics — so search matches either.

4. **sitemap.xml** — add before `</urlset>`:
```xml
  <url><loc>https://help.dentiqlab.vn/<key>.html</loc><lastmod>2026-07-01</lastmod><changefreq>monthly</changefreq></url>
```

Then run `node scripts/check.mjs` — the newly added page must stop reporting errors.

---

## Task 4: EXEMPLAR — overview page (`index.html`) + Getting Started section

Build all 5 "Bắt đầu" pages. `index.html` below is the full copy-paste exemplar for the head + page skeleton every page reuses (swap `data-page`, title, breadcrumb, body).

**Files:**
- Create: `index.html`, `getting-started.html`, `concepts.html`, `lab-setup-wizard.html`, `migrate-from-excel-zalo.html`
- Modify: `assets/docs-shell.js`, `assets/search-data.json`, `sitemap.xml`
- Sources: `dentlab/specs/00-vision.md` (overview), `03-end-to-end.md` (getting-started), `01-glossary.md` + `04-principles.md` (concepts), `features/pricing-material-catalog` + `02-actors.md` (lab-setup-wizard), `technical/vn-operations` (migrate)

- [ ] **Step 1: Write `index.html`** (full exemplar — reuse this head for every page)

```html
<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DentIQ Lab Help — Tài liệu hệ điều hành Labo ↔ Phòng khám</title>
<meta name="description" content="Help portal chính thức của DentIQ Lab: đặt đơn không cài, sản xuất, QC, giao nhận, bảo hành, công nợ và hoá đơn điện tử cho labo nha khoa.">
<link rel="canonical" href="https://help.dentiqlab.vn/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="DentIQ Lab Help">
<meta property="og:locale" content="vi_VN">
<meta property="og:title" content="DentIQ Lab Help — Tài liệu hệ điều hành Labo ↔ Phòng khám">
<meta property="og:description" content="Help portal chính thức của DentIQ Lab: đặt đơn không cài, sản xuất, QC, giao nhận, bảo hành, công nợ và hoá đơn điện tử.">
<meta property="og:url" content="https://help.dentiqlab.vn/">
<meta property="og:image" content="https://help.dentiqlab.vn/assets/icons/logo.png">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="DentIQ Lab Help">
<meta name="twitter:description" content="Tài liệu hệ điều hành Labo ↔ Phòng khám cho labo nha khoa Việt Nam.">
<meta name="twitter:image" content="https://help.dentiqlab.vn/assets/icons/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lexend:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/styles.css">
<link rel="stylesheet" href="assets/landing.css">
<link rel="stylesheet" href="assets/subpages.css">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"DentIQ Lab Help","url":"https://help.dentiqlab.vn/","inLanguage":"vi","publisher":{"@type":"Organization","name":"DentIQ Lab","url":"https://dentiqlab.vn","logo":{"@type":"ImageObject","url":"https://help.dentiqlab.vn/assets/icons/logo.png"}}}</script>
</head>
<body data-page="overview">

<main>
<div class="container docs-shell">

  <article class="docs-content">
    <h1>Tổng quan DentIQ Lab</h1>
    <p style="font-size:1.15rem;font-weight:600;color:var(--primary);margin-bottom:.5rem;">Một dòng chảy từ phòng khám đến labo. Realtime, không thất lạc.</p>
    <p>DentIQ Lab là hệ điều hành realtime nối <strong>phòng khám</strong> (bên đặt) và <strong>labo</strong> (bên nhận) cho ngành phục hình răng tại Việt Nam. Phòng khám gửi work order kèm ảnh, Rx, vật liệu & shade qua QR/web — không cài app; labo quản lý toàn bộ vòng đời case: tiếp nhận → sản xuất → QC → giao → bảo hành → công nợ.</p>

    <h2>DentIQ Lab là gì</h2>
    <p>Thay Zalo/Excel bằng một nguồn dữ liệu thống nhất: mọi đơn, tiến độ, redo, công nợ đều ở một chỗ, cả hai phía cùng nhìn thấy trạng thái theo thời gian thực.</p>
    <ul>
      <li><strong>Đặt đơn không cài</strong> — phòng khám quét QR, điền phiếu, gửi. Hết gọi điện hỏi lại shade/tooth.</li>
      <li><strong>Vòng đời case minh bạch</strong> — design → milling → sinter → polish → QC → giao, phòng khám thấy tiến độ.</li>
      <li><strong>Moat Việt Nam</strong> — công nợ (AR), hoá đơn điện tử, nhắc nợ qua Zalo — dựng sẵn.</li>
    </ul>

    <div class="callout">
      <div class="ctitle">Lưu ý</div>
      <p>Lần đầu dùng DentIQ Lab? Đọc <a href="getting-started.html" style="color:var(--primary);font-weight:500;">Bắt đầu nhanh</a> rồi tới <a href="concepts.html" style="color:var(--primary);font-weight:500;">Khái niệm cốt lõi</a>.</p>
    </div>

    <h2>Hai phía, một hệ thống</h2>
    <table>
      <thead><tr><th>Phía</th><th>Ai</th><th>Làm gì</th></tr></thead>
      <tbody>
        <tr><td><strong>Phòng khám</strong></td><td>Nha sĩ, phụ tá, chủ PK</td><td>Tạo đơn qua QR/web, theo dõi, nhận hàng, báo bảo hành</td></tr>
        <tr><td><strong>Labo</strong></td><td>Chủ labo, điều phối, KTV, QC, giao nhận, kế toán</td><td>Nhận đơn, sản xuất, kiểm QC, giao, xuất HĐĐT, theo dõi công nợ</td></tr>
      </tbody>
    </table>

    <h2>Bước tiếp theo</h2>
    <ul>
      <li><a href="getting-started.html">Bắt đầu nhanh</a> — dựng labo đầu tiên.</li>
      <li><a href="lab-setup-wizard.html">Cấu hình labo lần đầu</a> — bảng giá, vật liệu, vai trò, QR.</li>
      <li><a href="role-lab-owner.html">Hướng dẫn theo vai trò</a> — chọn đúng vai trò của bạn.</li>
    </ul>

    <div class="docs-pager">
      <span></span>
      <a href="getting-started.html" class="next">
        <div class="pager-label">Tiếp →</div>
        <div class="pager-title">Bắt đầu nhanh</div>
      </a>
    </div>
  </article>

</div>
</main>

<script src="assets/docs-shell.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Write the other 4 Getting Started pages**

Use the same `<head>` skeleton (swap `<title>`, `og`/`twitter`, canonical, JSON-LD `@type":"TechArticle"`, `data-page`). Each non-index page starts its `<article>` with a breadcrumb:
```html
<nav class="breadcrumb"><a href="index.html">Help</a><span class="sep"></span>Bắt đầu<span class="sep"></span><Label></nav>
```
Author content from the cited sources, following the **feature-page pattern** (intro → figure → h2 sections → tables → callouts → docs-pager):
- `getting-started.html` — the 9-step case story from `03-end-to-end.md`, framed as "what happens when you start". Pager: prev index / next concepts.
- `concepts.html` — define the mental model from `01-glossary.md` + `04-principles.md`: work-order vs case vs **unit**; the two intake channels; **SLA measured from sample receipt** (`sampleReceivedAt`), not submission; redo vs warranty. Use `<h3>` per concept like dentiq-help's index.
- `lab-setup-wizard.html` — first-run config from `features/pricing-material-catalog` + `02-actors.md` seeded roles. Screenshots: `cp /Users/tuong/Projects/dentlab/screenshots/lab-manager-shell/login--happy.png assets/lab-setup-wizard/` and `pricing-in-shell--owner.png`.
- `migrate-from-excel-zalo.html` — from `technical/vn-operations`; how a labo currently on Zalo/Excel moves over.

- [ ] **Step 3: Register all 5 pages** (Task 3 convention) in NAV (section "Bắt đầu"), RELATED, search-data.json, sitemap.xml. Suggested RELATED:
```javascript
'overview':               ['getting-started', 'concepts', 'role-lab-owner', 'glossary'],
'getting-started':        ['overview', 'concepts', 'lab-setup-wizard', 'wf-case-lifecycle'],
'concepts':               ['glossary', 'getting-started', 'wf-case-lifecycle', 'production-stages'],
'lab-setup-wizard':       ['pricing-material-catalog', 'roles-permissions', 'lab-clinic-invitation', 'getting-started'],
'migrate-from-excel-zalo':['lab-setup-wizard', 'accounts-receivable', 'wf-lab-go-live', 'troubleshoot'],
```

- [ ] **Step 4: Run the checker for these pages**

Run: `node scripts/check.mjs`
Expected: the 5 Bắt đầu pages no longer error (other unbuilt pages still error — fine). Fix any `[broken-link]` by pointing to pages not yet built only if they are in `pages.json` (checker only flags missing *files*; forward links to unbuilt pages WILL flag as broken-link — acceptable until those pages exist; the final task re-runs green).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: getting started section (overview, getting-started, concepts, setup, migrate)"
```

---

## Task 5: EXEMPLAR — feature page (`pricing-material-catalog.html`) + Finance & Production & Intake & Logistics & Network sections

This task authors all **feature-pattern** pages. `pricing-material-catalog.html` is the worked exemplar; the rest follow it, each from its own spec + screenshots.

**Files:**
- Create feature pages: intake (`connectionless-intake`, `rx-photo-capture`, `dentiq-connected-intake`, `stl-scan-upload`, `lab-slip`), production (`case-queue-assignment`, `production-board`, `production-stages`, `qc-gate`), logistics (`shipment-delivery-tracking`, `redo-management`, `warranty-lookup-claims`), finance (`pricing-material-catalog`, `accounts-receivable`, `statement`, `e-invoice-issuance`, `deposit`), network (`lab-clinic-invitation`, `lab-clinic-connection`, `zalo-bridge`, `e-invoice-providers`)
- Modify: `assets/docs-shell.js`, `assets/search-data.json`, `sitemap.xml`

**Feature-page pattern** (all pages this task):
```html
<article class="docs-content">
  <nav class="breadcrumb"><a href="index.html">Help</a><span class="sep"></span><Section><span class="sep"></span><Label></nav>
  <h1><Label></h1>
  <p><1–2 sentence intro: what + why></p>
  <figure class="placeholder">  <!-- or without "placeholder" class if real screenshot -->
    <img src="assets/<key>/<view>--happy.png" alt="..." loading="lazy">
    <figcaption>...</figcaption>
  </figure>
  <h2>...</h2> <p/ul/table>
  <div class="callout"><div class="ctitle">Lưu ý</div><p>...</p></div>
  <div class="docs-pager">...</div>
</article>
```

- [ ] **Step 1: Write the exemplar `pricing-material-catalog.html`**

Source: `dentlab/specs/features/pricing-material-catalog/README.md`. Screenshots:
```bash
mkdir -p assets/pricing-material-catalog
cp /Users/tuong/Projects/dentlab/screenshots/pricing-material-catalog/material-catalog--happy.png assets/pricing-material-catalog/
cp /Users/tuong/Projects/dentlab/screenshots/pricing-material-catalog/price-matrix--happy.png assets/pricing-material-catalog/
cp /Users/tuong/Projects/dentlab/screenshots/pricing-material-catalog/clinic-overrides--happy.png assets/pricing-material-catalog/
```
Sections to cover (from spec): material catalog (zirconia/e.max/PFM… + their production stages), price list per unit/material/product-line, clinic-specific price overrides, how incoming orders auto-apply stages + price. Use the `material-catalog--happy` shot in the lead `<figure>` (drop the `placeholder` class since it's a real image), `price-matrix--happy` and `clinic-overrides--happy` in mid-page figures.

- [ ] **Step 2: Write remaining feature pages**

For each page below: create `assets/<key>/`, `cp` the matching screenshots from `dentlab/screenshots/<feature>/` (use the folder whose name matches; where names differ they are listed), author from the spec, follow the pattern. If no screenshot folder exists, use `<figure class="placeholder">` with a box.

| Page key | Source spec (`dentlab/specs/`) | Screenshot folder |
|---|---|---|
| `connectionless-intake` | `features/connectionless-case-intake/README.md` | `connectionless-case-intake/` (intake-form--happy, tracking--happy, intake-form--expired-link) |
| `rx-photo-capture` | `features/rx-photo-capture/README.md` | `rx-photo-capture/` (rx-form--happy-ready, rx-form--shade-critical-blocked) |
| `dentiq-connected-intake` | `features/dentiq-connected-intake/README.md` | `dentiq-connected-intake/` (dentiq-links--happy, dentiq-links--create) |
| `stl-scan-upload` | `features/stl-scan-upload/README.md` | `stl-scan-upload/` (intake-form--scan-attached, scan-viewer--happy, scan-viewer--error) |
| `lab-slip` | `01-glossary.md#lab-slip` + `features/rx-photo-capture` | none → placeholder |
| `case-queue-assignment` | `features/case-queue-assignment/README.md` | `case-queue-assignment/` (case-list--happy, case-board--happy, case-board--readonly) |
| `production-board` | `features/production-board/README.md` | `production-board/` (board--happy, board--technician) |
| `production-stages` | `01-glossary.md#production-stage` + `features/production-board` | reuse `production-board/board--happy` |
| `qc-gate` | `features/qc-gate/README.md` | `qc-gate/` (qc-worklist--happy, qc-inspection--checklist) |
| `shipment-delivery-tracking` | `features/shipment-delivery-tracking/README.md` | `shipment-delivery-tracking/` (shipping-console--happy) |
| `redo-management` | `features/redo-management/README.md` | `redo-management/` (redo-worklist--happy, quality-dashboard--happy) |
| `warranty-lookup-claims` | `features/warranty-lookup-claims/README.md` | `warranty-lookup-claims/` (lookup--results, warranty-card--drawer, warranty-terms--config) |
| `accounts-receivable` | `features/accounts-receivable/README.md` | `accounts-receivable/` (ar-overview--happy, ar-clinic-ledger--drawer) |
| `statement` | `workflows/lab-billing-ar-cycle/README.md` | reuse `accounts-receivable/ar-clinic-ledger--drawer` |
| `e-invoice-issuance` | `features/e-invoice-issuance/README.md` | `e-invoice-issuance/` (einvoice-list--happy, einvoice-detail--drawer, einvoice-config--settings) |
| `deposit` | `01-glossary.md#deposit` + `features/accounts-receivable` | none → placeholder |
| `lab-clinic-invitation` | `features/lab-clinic-invitation/README.md` | `lab-clinic-invitation/` (network--happy, network--create, invite-landing--happy) |
| `lab-clinic-connection` | `workflows/lab-clinic-connection/README.md` + `technical/dentiq-sync` | reuse `dentiq-connected-intake/dentiq-links--happy` |
| `zalo-bridge` | `01-glossary.md#zalo-bridge` + `workflows/lab-billing-ar-cycle` | none → placeholder |
| `e-invoice-providers` | `features/e-invoice-issuance/README.md` | reuse `e-invoice-issuance/einvoice-config--settings` |

- [ ] **Step 3: Register all 21 pages** (Task 3 convention) in their sections (Đặt đơn / Sản xuất / Giao nhận & bảo hành / Tài chính / Mạng lưới & tích hợp), plus RELATED (link features to their workflow + role pages), search-data.json, sitemap.xml.

- [ ] **Step 4: Run checker**

Run: `node scripts/check.mjs` — expect these 21 pages clear (remaining role/workflow/reference pages still error).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: intake, production, logistics, finance, network feature pages"
```

---

## Task 6: EXEMPLAR — role page (`role-technician.html`) + all role pages

**Files:**
- Create: `role-lab-owner`, `role-coordinator`, `role-technician`, `role-qc`, `role-shipper`, `role-accountant`, `role-clinic-dentist`, `role-clinic-assistant`, `role-clinic-owner`
- Modify: docs-shell.js, search-data.json, sitemap.xml
- Source: `dentlab/specs/02-actors.md` (the actor table is the spine), `05-data-and-permission.md` (permissions per role)

**Role-page pattern:** responsibilities intro → workspace figure → "công việc từ đầu đến cuối" (ordered tasks) → domain features they touch (link to feature pages) → callout → tips → pager.

- [ ] **Step 1: Write exemplar `role-technician.html`**

From `02-actors.md` (Technician: "Cập nhật tiến độ công đoạn được giao — milling/sinter/polish"). Figure: `cp /Users/tuong/Projects/dentlab/screenshots/production-board/board--technician.png assets/role-technician/`. Link tasks to `production-board.html`, `production-stages.html`, `qc-gate.html`.

- [ ] **Step 2: Write the other 8 role pages** from `02-actors.md`:
  - `role-lab-owner` — config catalog/pricing/roles, revenue/KPI, invite clinics. Figure: `lab-manager-shell/dashboard--owner.png`. Links: pricing-material-catalog, reports-kpi, lab-clinic-invitation, roles-permissions.
  - `role-coordinator` — accept orders, assign technicians, set deadlines. Figure: `case-queue-assignment/case-board--happy.png`. Links: case-queue-assignment, production-board.
  - `role-qc` — inspect tooth/shade/material/fit, pass/fail. Figure: `qc-gate/qc-inspection--checklist.png`. Links: qc-gate, redo-management.
  - `role-shipper` — log shipments, confirm delivery. Figure: `shipment-delivery-tracking/shipping-console--happy.png`. Links: shipment-delivery-tracking.
  - `role-accountant` — close AR, statements, e-invoice, payments. Figure: `accounts-receivable/ar-overview--happy.png`. Links: accounts-receivable, statement, e-invoice-issuance, deposit.
  - `role-clinic-dentist` — create order via QR, Rx+photos, track, receive, warranty. Figure: `connectionless-case-intake/intake-form--happy.png`. Links: connectionless-intake, rx-photo-capture, warranty-lookup-claims.
  - `role-clinic-assistant` — fill lab slip, photos, receive shipment, reconcile AR. Figure: `connectionless-case-intake/intake-form--happy.png`. Links: connectionless-intake, lab-slip, accounts-receivable.
  - `role-clinic-owner` — aggregate view: cases in labs, AR owed, redo rate per lab. Figure placeholder. Links: accounts-receivable, redo-management, reports-kpi.

- [ ] **Step 3: Register all 9 pages** (Task 3 convention), section "Theo vai trò".

- [ ] **Step 4: Run checker** — expect role pages clear. Commit:

```bash
git add -A
git commit -m "feat: role pages (lab + clinic personas)"
```

---

## Task 7: EXEMPLAR — workflow page (`wf-case-lifecycle.html`) + all workflow pages

**Files:**
- Create 13 `wf-*` pages (see pages.json). Modify docs-shell.js, search-data.json, sitemap.xml.
- Sources: `workflows/lab-case-lifecycle/README.md` + `states.md`, `workflows/lab-billing-ar-cycle`, `workflows/clinic-onboarding-claim`, `workflows/lab-clinic-connection`, `workflows/network-growth`.

**Workflow-page pattern** (mirrors dentiq-help `wf-*`): breadcrumb → h1 → narrative intro → `<h2>Bối cảnh</h2>` (scenario) → `<h2>Diễn viên & quyền cần</h2>` (table role/permission/action) → `<h2>Quy trình từng bước</h2>` (`<ol>`) → `<h2>Kết quả mong đợi</h2>` → `<h2>Khi nào hỏng & cách xử lý</h2>` (symptom→cause→recovery table) → callout → pager. **The "Khi nào hỏng" table content is harvested in Task 8 for troubleshoot.html — write it thoughtfully.**

- [ ] **Step 1: Write exemplar `wf-case-lifecycle.html`**

Source: `03-end-to-end.md` narrative + `workflows/lab-case-lifecycle/states.md` state machine (submitted → received → in_production → qc → ready_to_ship → shipped → delivered → [redo|warranty] → closed). Figure: placeholder with a `<figcaption>` describing the state flow (no screenshot; optionally an SVG flow later). Actors table from `02-actors.md`. The "Khi nào hỏng" table: e.g. *sample chưa tới → SLA chưa chạy → chờ `sampleReceivedAt`*; *QC trượt → quay lại công đoạn*; *giao nhầm địa chỉ → cập nhật shipment*.

- [ ] **Step 2: Write the other 12 workflow pages** from these sources:

| Page | Source | Scenario core |
|---|---|---|
| `wf-first-order` | `clinic-onboarding-claim` + `connectionless-case-intake` | Clinic chưa có tài khoản quét QR gửi đơn đầu tiên |
| `wf-rush-order` | `shipment-delivery-tracking` (SLA) + `lab-case-lifecycle` | Đơn gấp 48h, ưu tiên, đo SLA từ nhận mẫu |
| `wf-physical-impression` | `lab-case-lifecycle` (BR-W1 sampleReceivedAt) | Mẫu vật lý gửi riêng, SLA chờ nhận mẫu |
| `wf-stl-digital` | `stl-scan-upload` | Case digital, không mẫu vật lý, vào sản xuất ngay |
| `wf-qc-fail-rework` | `qc-gate` | QC đánh trượt → loop về công đoạn tương ứng |
| `wf-redo-claim` | `redo-management` | Sau giao phát hiện sai → phân loại lỗi labo/clinic |
| `wf-warranty-claim` | `warranty-lookup-claims` | Trong hạn bảo hành, tra lịch sử case, sửa/làm lại |
| `wf-month-end-ar` | `lab-billing-ar-cycle` | Chốt công nợ → sao kê → phát hành HĐĐT |
| `wf-einvoice-failed` | `e-invoice-issuance` | HĐĐT lỗi provider → retry/khắc phục |
| `wf-clinic-claim-account` | `clinic-onboarding-claim` | Clinic nhẹ (theo SĐT) → claim nâng lên tài khoản đầy đủ |
| `wf-connect-dentiq` | `lab-clinic-connection` + `technical/dentiq-sync` | Clinic dùng DentIQ → bắt tay đồng bộ 2 chiều |
| `wf-lab-go-live` | `network-growth` + `lab-setup-wizard` | Labo mới lên hệ thống, mời clinic, chạy thật |

- [ ] **Step 3: Register all 13 pages** (Task 3 convention), section "Tình huống thực tế".

- [ ] **Step 4: Run checker** — expect workflow pages clear. Commit:

```bash
git add -A
git commit -m "feat: workflow scenario pages (wf-*)"
```

---

## Task 8: Admin + Reference sections (troubleshoot/faq/glossary/shortcuts/changelog)

**Files:**
- Create admin: `roles-permissions`, `lab-settings`, `reports-kpi`, `notifications`, `security`
- Create reference: `troubleshoot`, `faq`, `glossary`, `shortcuts`, `changelog`
- Modify docs-shell.js, search-data.json, sitemap.xml
- Sources: `05-data-and-permission.md`, `technical/roles-permissions`, `technical/performance-observability`, `01-glossary.md`, and the "Khi nào hỏng" tables written in Task 7.

- [ ] **Step 1: Admin pages** (feature-pattern):
  - `roles-permissions` — reference-pattern big table of lab roles (`lab_admin`, `coordinator`, `technician`, `qc`, `shipper`, `accountant`) × permissions, from `05-data-and-permission.md` + `technical/roles-permissions`. Figure: `lab-manager-shell/dashboard--technician-gated-nav.png` (shows gated nav).
  - `lab-settings` — labo config surface (catalog, warranty terms, e-invoice config). Links to pricing-material-catalog, warranty-lookup-claims, e-invoice-issuance.
  - `reports-kpi` — redo rate, capacity, revenue, AR aging. Figure: `redo-management/quality-dashboard--happy.png`.
  - `notifications` — status/payment reminders (Zalo-first). Links: zalo-bridge.
  - `security` — tenancy isolation, loginId auth, data. From `05-data-and-permission.md` + `technical/performance-observability`.

- [ ] **Step 2: Reference pages:**
  - `glossary.html` — reference-pattern alphabetical table from `01-glossary.md` (work-order, case, unit, shade, material, production-stage, milling, sinter, QC, redo, warranty, AR, statement, deposit, e-invoice, connectionless-intake, lab-slip, Zalo bridge, …). Term (VN) | English | Định nghĩa.
  - `troubleshoot.html` — reference-pattern table aggregating every workflow's "Khi nào hỏng & cách xử lý" rows (Task 7), grouped by area (intake/production/QC/logistics/finance). Triệu chứng | Nguyên nhân | Khắc phục.
  - `faq.html` — Q&A pairs distilled from `00-vision.md`, `04-principles.md`, `08-non-goals.md` (e.g. "Phòng khám có phải trả tiền không?", "Có cần cài app không?", "SLA tính từ lúc nào?").
  - `shortcuts.html` — keyboard shortcuts (at minimum ⌘K/Ctrl+K search; expand as app defines them).
  - `changelog.html` — start with a single dated entry: "2026-07-01 — Ra mắt help site DentIQ Lab."

- [ ] **Step 3: Register all 10 pages** (Task 3 convention), sections "Quản trị" and "Tài liệu khác".

- [ ] **Step 4: Run checker** — expect ALL 58 pages now present. Commit:

```bash
git add -A
git commit -m "feat: admin + reference pages (troubleshoot, faq, glossary, shortcuts, changelog)"
```

---

## Task 9: Search index completeness, llms.txt, deploy config, AI-SYNC

**Files:**
- Create: `scripts/gen-llms.mjs`, `llms.txt`, `vercel.json`, `.vercelignore`, `AI-SYNC.md`
- Verify: `assets/search-data.json` has all 58 entries.

- [ ] **Step 1: Verify search-data completeness**

Add a check to `scripts/check.mjs` is already done (search-missing rule). Run `node scripts/check.mjs` and confirm `OK — 58 pages`.

- [ ] **Step 2: Write `scripts/gen-llms.mjs`** (generates llms.txt from search-data.json)

```javascript
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://help.dentiqlab.vn';
const data = JSON.parse(readFileSync(join(ROOT, 'assets/search-data.json'), 'utf8'));
const bySection = new Map();
for (const e of data) {
  if (!bySection.has(e.section)) bySection.set(e.section, []);
  bySection.get(e.section).push(e);
}
let out = `# DentIQ Lab Help\n\n> Tài liệu hệ điều hành Labo ↔ Phòng khám cho labo nha khoa Việt Nam.\n\n`;
for (const [section, entries] of bySection) {
  out += `## ${section}\n\n`;
  for (const e of entries) out += `- [${e.title}](${ORIGIN}/${e.url}): ${e.description}\n`;
  out += '\n';
}
writeFileSync(join(ROOT, 'llms.txt'), out);
console.log(`Wrote llms.txt — ${data.length} entries.`);
```
Run: `node scripts/gen-llms.mjs`. Expected: `Wrote llms.txt — 58 entries.`

- [ ] **Step 3: Write `vercel.json`** (copy dentiq-help's, keep `.html` URLs)

```json
{
  "cleanUrls": false,
  "trailingSlash": false,
  "headers": [
    { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

- [ ] **Step 4: Write `.vercelignore`** (don't serve internal files)

```
AI-SYNC.md
README.md
package.json
scripts/
docs/
.git/
.gitignore
```
Note: `assets/search-data.json` and `llms.txt` MUST remain served (not ignored) — search + LLM index depend on them.

- [ ] **Step 5: Update `robots.txt`** — set the sitemap host

Edit `robots.txt` so the `Sitemap:` line reads `Sitemap: https://help.dentiqlab.vn/sitemap.xml` and keep the AI-crawler allow list from dentiq-help.

- [ ] **Step 6: Write `AI-SYNC.md`** (spec-commit ledger)

```markdown
# AI-SYNC — DentIQ Lab Help

Ground-truth ledger. Help content derives from `dentlab/specs` (SSOT).

<!-- Last synced specs commit: <run `git -C /Users/tuong/Projects/dentlab rev-parse --short HEAD` and paste> -->

## Page ↔ spec map
| Page | Source spec |
|---|---|
| overview | specs/00-vision.md |
| getting-started | specs/03-end-to-end.md |
| concepts | specs/01-glossary.md, specs/04-principles.md |
| ... | (fill one row per page from the plan's source tables) |

## Sync history
- 2026-07-01 — Initial build, 58 pages, synced to specs commit above.
```
Fill the page↔spec table from the source columns in Tasks 4–8.

- [ ] **Step 7: Final full checker run + commit**

```bash
node scripts/check.mjs   # expect: OK — 58 pages registered, all links resolve.
git add -A
git commit -m "chore: llms.txt generator, vercel deploy config, AI-SYNC ledger"
```

---

## Task 10: Local smoke test

- [ ] **Step 1: Serve locally**

```bash
cd /Users/tuong/Projects/dentiq-lab-help
python3 -m http.server 8080
```

- [ ] **Step 2: Manual smoke checks** (open `http://localhost:8080/`)
  - Sidebar shows all 10 sections with correct pages; active page highlights.
  - ⌘K/Ctrl+K search opens; typing "cong no" (no diacritics) finds "Công nợ"; "shade" finds rx-photo-capture.
  - Open 3 pages (a feature, a workflow, a role); breadcrumb + related cards + footer render; screenshots load (no broken images); docs-pager links work.
  - Click every sidebar link once — no 404 (checker already guarantees, this is visual confirmation).

- [ ] **Step 3: Stop server, final commit if any fixes**

```bash
git add -A
git commit -m "fix: smoke-test corrections" || echo "nothing to fix"
```

---

## Self-Review notes (author-completed)

- **Spec coverage:** every design-spec section 5 page (58) appears in `pages.json` and has an authoring task (Tasks 4–8). Content sourcing (design §6) → Task 4–8 per-page source columns + screenshot `cp` steps. AI-SYNC analog (design §6) → Task 9 Step 6. Shell reuse (design §3) → Task 1. Registration mechanics (design §3) → Task 3 + checker Task 2. Build order (design §7) → Task ordering.
- **Placeholder scan:** exemplar pages (index, and skeletons) are full HTML; bulk pages specify exact source spec file + screenshot path + pattern (not "TODO"). Content derived from named specs is a data source, not a placeholder.
- **Type consistency:** page keys are identical across `pages.json`, checker, NAV, RELATED, search-data, sitemap, and cross-links. `check.mjs` enforces this mechanically.
- **Known acceptable transient:** forward links to not-yet-built pages flag `[broken-link]` mid-build; Task 9/10 final runs are green once all 58 exist.
```
