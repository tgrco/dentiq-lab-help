# AI-SYNC — DentIQ Lab Help

Ground-truth ledger. Help content derives from `dentlab/specs` (SSOT). When specs change,
re-check the affected pages and bump the synced-commit line below.

<!-- Last synced specs commit (dentlab/specs): 73b72d8 (2026-07-01) -->

## Site facts
- 58 pages across 10 nav sections. Registry: `scripts/pages.json`. Integrity gate: `scripts/check.mjs` (`npm run check`).
- Vietnamese-first; keep-English lab terms (shade, milling, sinter, glaze, try-in, STL, QC, crown, veneer, margin, abutment, zirconia, e.max, PFM, work order).
- Domain assumed `https://help.dentiqlab.vn`. Search index: `assets/search-data.json` (58 entries) → `llms.txt` via `npm run gen-llms`.
- Screenshots sourced from `dentlab/screenshots/<feature>/<view>--<state>.png`.

## Page ↔ spec map
| Page | Source spec (dentlab/specs/) |
|---|---|
| overview | 00-vision.md |
| getting-started | 03-end-to-end.md |
| concepts | 01-glossary.md, 04-principles.md |
| lab-setup-wizard | features/pricing-material-catalog, 02-actors.md |
| migrate-from-excel-zalo | technical/vn-operations |
| role-lab-owner … role-accountant | 02-actors.md, 05-data-and-permission.md |
| role-clinic-dentist / assistant / owner | 02-actors.md (Phía Clinic) |
| connectionless-intake | features/connectionless-case-intake |
| rx-photo-capture | features/rx-photo-capture |
| dentiq-connected-intake | features/dentiq-connected-intake |
| stl-scan-upload | features/stl-scan-upload |
| lab-slip | 01-glossary.md#lab-slip |
| case-queue-assignment | features/case-queue-assignment |
| production-board | features/production-board |
| production-stages | 01-glossary.md#production-stage, features/production-board |
| qc-gate | features/qc-gate |
| shipment-delivery-tracking | features/shipment-delivery-tracking |
| redo-management | features/redo-management |
| warranty-lookup-claims | features/warranty-lookup-claims |
| pricing-material-catalog | features/pricing-material-catalog |
| accounts-receivable | features/accounts-receivable |
| statement | workflows/lab-billing-ar-cycle |
| e-invoice-issuance | features/e-invoice-issuance |
| deposit | 01-glossary.md#deposit, features/accounts-receivable |
| lab-clinic-invitation | features/lab-clinic-invitation |
| lab-clinic-connection | workflows/lab-clinic-connection, technical/dentiq-sync |
| zalo-bridge | 01-glossary.md#zalo-bridge, workflows/lab-billing-ar-cycle |
| e-invoice-providers | features/e-invoice-issuance |
| roles-permissions | 05-data-and-permission.md, technical/roles-permissions |
| lab-settings | 06-feature-map.md + feature config surfaces |
| reports-kpi | features/redo-management, 00-vision.md |
| notifications | 01-glossary.md#zalo-bridge, workflows/lab-billing-ar-cycle |
| security | 05-data-and-permission.md, technical/performance-observability |
| wf-first-order | workflows/clinic-onboarding-claim, features/connectionless-case-intake |
| wf-case-lifecycle | 03-end-to-end.md, workflows/lab-case-lifecycle (+states.md) |
| wf-rush-order | features/shipment-delivery-tracking, workflows/lab-case-lifecycle |
| wf-physical-impression | workflows/lab-case-lifecycle (BR-W1 sampleReceivedAt) |
| wf-stl-digital | features/stl-scan-upload |
| wf-qc-fail-rework | features/qc-gate |
| wf-redo-claim | features/redo-management |
| wf-warranty-claim | features/warranty-lookup-claims |
| wf-month-end-ar | workflows/lab-billing-ar-cycle |
| wf-einvoice-failed | features/e-invoice-issuance |
| wf-clinic-claim-account | workflows/clinic-onboarding-claim |
| wf-connect-dentiq | workflows/lab-clinic-connection, technical/dentiq-sync |
| wf-lab-go-live | workflows/network-growth |
| troubleshoot | aggregated from all wf-* "Khi nào hỏng" tables |
| faq | 00-vision.md, 04-principles.md, 08-non-goals.md |
| glossary | 01-glossary.md |
| shortcuts | help search shortcut (⌘K/Ctrl+K) |
| changelog | — |

## Sync history
- 2026-07-01 — Initial build. 58 pages, shell forked from dentiq-help, synced to dentlab/specs commit 73b72d8.
