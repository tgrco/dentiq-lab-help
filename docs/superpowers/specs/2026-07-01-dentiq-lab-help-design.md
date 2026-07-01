# DentIQ Lab Help Site — Design

- **Date:** 2026-07-01
- **Owner:** tuong
- **Status:** approved (brainstorm) → ready for implementation plan
- **Target repo:** `/Users/tuong/Projects/dentiq-lab-help` (currently empty)
- **Reference:** `/Users/tuong/Projects/dentiq-help` (sibling clinic help site)
- **Source of truth:** `/Users/tuong/Projects/dentlab/specs` (DentIQ Lab product specs)

## 1. Goal

A static, Vietnamese-first help/documentation site for **DentIQ Lab** — the realtime
Clinic↔Lab operating system for dental laboratories in Vietnam. Mirrors the structure,
tech shell, and content patterns of the existing DentIQ clinic help site so the two feel
like siblings.

## 2. Locked decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Audience** | Both sides, one site | Lab staff (owner/coordinator/technician/QC/shipper/accountant) + clinic users (dentist/assistant/owner) in one site, separated by nav section. |
| **Coverage** | Full vision (Phase 1 + Phase 2) | Document the whole spec surface, comprehensive like dentiq-help. Accept some drift risk on unbuilt features. |
| **Tech shell** | Reuse dentiq-help shell | Copy `docs-shell.js` + CSS + Fuse.js search + AI-SYNC pattern, rebrand to DentIQ Lab, swap NAV/RELATED/search-data. |
| **Language** | Vietnamese-first | Matches product + sibling site. Keep-English lab terms untranslated (shade, milling, sinter, STL, QC, try-in, crown, veneer, margin, abutment). |
| **Section 8 extras** | Drop | No `operational-modes`, `audit-log`, `mobile-app`, `offline-support`, `automation-triggers`, `sms-brandname` — no evidence in specs. Add later if the product grows into them. |
| **Page count** | ~58 (comprehensive) | dentiq-help = 49. Grow, don't trim. |

## 3. Architecture (inherited from dentiq-help)

Static HTML + shared JS shell, no build step.

- Each page is a content-only `<article class="docs-content">` body with `<head>` meta/schema.
- `assets/docs-shell.js` injects topbar, sidebar nav, related cards, footer at runtime from a
  `NAV` array + `RELATED` map keyed by `data-page`.
- Fuse.js in-memory search over `assets/search-data.json` (⌘K / Ctrl+K), Vietnamese
  diacritics-normalized.
- CSS: `styles.css` (tokens/global) + `subpages.css` (article) + `landing.css` (index). Reused
  near-verbatim; only color tokens / logo rebranded for DentIQ Lab.
- JSON-LD (`TechArticle`/`WebSite`/`Organization`/`FAQPage`/`HowTo`), Open Graph, sitemap.xml,
  robots.txt, llms.txt — all carried over.

### Page registration (every new page hits 4 places)
1. `assets/docs-shell.js` `NAV` array — one entry (section, key, href, label).
2. `assets/docs-shell.js` `RELATED` map — 3–5 cross-links; also add this page into others' lists.
3. `assets/search-data.json` — one entry (key, url, title, section, description, keywords with +
   without diacritics).
4. `sitemap.xml` — one `<url>`.

## 4. Page patterns (reused from dentiq-help)

1. **Feature page** — intro → figure → sections (h2/h3) → tables → callouts → pager. (catalog, AR, QC…)
2. **Workflow page (`wf-*`)** — Bối cảnh (scenario) → Diễn viên & quyền → Quy trình từng bước (ol)
   → Kết quả mong đợi → **Khi nào hỏng & cách xử lý** (troubleshoot table) → callout → pager.
3. **Role page (`role-*`)** — responsibilities → workspace figure → end-to-end tasks → domain
   features → tips/best-practices.
4. **Reference page** — big tables (permissions matrix, glossary, shortcuts).
5. **Troubleshoot/FAQ** — symptom→cause→recovery table; Q&A pairs.

## 5. Sitemap (10 nav sections, ~58 pages)

Each page cites its source spec under `dentlab/specs`.

### 1. Bắt đầu (Getting Started) — 5
| key | source spec |
|---|---|
| `index` (overview) | `00-vision.md` |
| `getting-started` | `03-end-to-end.md` |
| `concepts` (work-order vs case vs unit, 2 intake channels, SLA-from-sample-receipt) | `01-glossary.md`, `04-principles.md` |
| `lab-setup-wizard` (catalog, pricing, roles, QR) | `features/pricing-material-catalog`, `02-actors.md` |
| `migrate-from-excel-zalo` | `technical/vn-operations` |

### 2. Theo vai trò (By Role) — 9
Lab: `role-lab-owner`, `role-coordinator`, `role-technician`, `role-qc`, `role-shipper`,
`role-accountant` · Clinic: `role-clinic-dentist`, `role-clinic-assistant`, `role-clinic-owner`
— source: `02-actors.md`, `05-data-and-permission.md`.

### 3. Đặt đơn (Case Intake — clinic-facing) — 5
`connectionless-intake`, `rx-photo-capture`, `dentiq-connected-intake`, `stl-scan-upload`,
`lab-slip` — source: `features/connectionless-case-intake`, `features/rx-photo-capture`,
`features/dentiq-connected-intake`, `features/stl-scan-upload`, `01-glossary.md#lab-slip`.

### 4. Sản xuất (Production — lab) — 4
`case-queue-assignment`, `production-board`, `production-stages`, `qc-gate` — source:
`features/case-queue-assignment`, `features/production-board`, `features/qc-gate`,
`01-glossary.md#production-stage`.

### 5. Giao nhận & bảo hành (Logistics & After-sale) — 3
`shipment-delivery-tracking`, `redo-management`, `warranty-lookup-claims` — source: matching
`features/*`.

### 6. Tài chính (Finance) — 5
`pricing-material-catalog`, `accounts-receivable`, `statement`, `e-invoice-issuance`, `deposit`
— source: `features/pricing-material-catalog`, `features/accounts-receivable`,
`workflows/lab-billing-ar-cycle`, `features/e-invoice-issuance`, `01-glossary.md#deposit`.

### 7. Mạng lưới & tích hợp (Network & Integrations) — 4
`lab-clinic-invitation`, `lab-clinic-connection`, `zalo-bridge`, `e-invoice-providers` — source:
`features/lab-clinic-invitation`, `workflows/lab-clinic-connection` + `technical/dentiq-sync`,
`01-glossary.md#zalo-bridge`, `features/e-invoice-issuance`.

### 8. Quản trị (Admin) — 5
`roles-permissions`, `lab-settings`, `reports-kpi`, `notifications`, `security` — source:
`05-data-and-permission.md`, `technical/roles-permissions`, `technical/performance-observability`.

### 9. Tình huống thực tế (Workflows) — 13
`wf-first-order`, `wf-case-lifecycle`, `wf-rush-order`, `wf-physical-impression`, `wf-stl-digital`,
`wf-qc-fail-rework`, `wf-redo-claim`, `wf-warranty-claim`, `wf-month-end-ar`, `wf-einvoice-failed`,
`wf-clinic-claim-account`, `wf-connect-dentiq`, `wf-lab-go-live` — source:
`workflows/lab-case-lifecycle` (+ `states.md`), `workflows/lab-billing-ar-cycle`,
`workflows/clinic-onboarding-claim`, `workflows/lab-clinic-connection`, `workflows/network-growth`.

### 10. Tài liệu khác (Reference) — 5
`troubleshoot`, `faq`, `glossary`, `shortcuts`, `changelog` — source: aggregated from all workflow
"Khi nào hỏng" tables + `01-glossary.md`.

## 6. Content sourcing & drift strategy

- **No screenshots yet** — product is spec-phase. Figures use the existing
  `<figure class="placeholder">` pattern with box placeholders + state-machine / flow diagrams
  derived from specs (e.g. case lifecycle states from `workflows/lab-case-lifecycle/states.md`).
  Real screenshots swap in as UI ships.
- **Troubleshoot / FAQ** built from each workflow spec's "Khi nào hỏng & cách xử lý" table (already
  authored in specs) + glossary.
- **AI-SYNC.md analog** — track last-synced **spec commit** in `dentlab/specs` (not a product-code
  commit), since specs are SSOT. Maintain page↔spec map + sync history like dentiq-help.

## 7. Build order (for the implementation plan)

1. **Shell** — copy dentiq-help `assets/` (docs-shell.js, css, search scaffolding, icons), rebrand
   tokens/logo, empty NAV/RELATED/search-data. Root `index.html` + one page rendering to prove the
   shell.
2. **Spine pages** — Getting Started (5) + glossary + concepts. Establishes vocabulary all other
   pages link to.
3. **Feature sections** — Intake (3) → Production (4) → Logistics (5) → Finance (6) → Network (7) →
   Admin (8).
4. **Role pages** (2) — reference the feature pages.
5. **Workflows** (9) — tie features + roles into scenarios; source of troubleshoot content.
6. **Reference** (10) — troubleshoot/faq/shortcuts/changelog, aggregated last.
7. **Register + ship** — fill NAV/RELATED/search-data/sitemap; robots/llms.txt; AI-SYNC.md.

## 8. Non-goals

- Marketplace, referral, AI case assistant, benchmark, device APIs, patient registry — separate
  Dental Platform project, out of scope (`dentiq-platform-plan.md`).
- No app functionality — documentation only.
- No mobile-app / offline / audit-log / automation-trigger pages until specs cover them.

## 9. Open item

Target repo `dentiq-lab-help` is not yet a git repo. Decide at implementation: `git init` here as
its own repo (recommended, mirrors dentiq-help being standalone), or nest elsewhere.
