// DentIQ Docs — shared sidebar / topbar / footer injector.
// Every docs/*.html page declares <body data-page="key"> and ships only the
// <article class="docs-content"> body. This file injects everything else.

(function () {
  const NAV = [
    { section: 'Bắt đầu', items: [
      { key: 'overview',                 href: 'index.html',                     label: 'Tổng quan' },
      { key: 'getting-started',          href: 'getting-started.html',           label: 'Bắt đầu nhanh' },
      { key: 'concepts',                 href: 'concepts.html',                  label: 'Khái niệm cốt lõi' },
      { key: 'lab-setup-wizard',         href: 'lab-setup-wizard.html',          label: 'Cấu hình labo lần đầu' },
      { key: 'migrate-from-excel-zalo',  href: 'migrate-from-excel-zalo.html',   label: 'Chuyển từ Excel/Zalo' },
    ]},

    { section: 'Theo vai trò', items: [
      { key: 'role-lab-owner',        href: 'role-lab-owner.html',        label: 'Chủ labo' },
      { key: 'role-coordinator',      href: 'role-coordinator.html',      label: 'Điều phối' },
      { key: 'role-technician',       href: 'role-technician.html',       label: 'Kỹ thuật viên' },
      { key: 'role-qc',               href: 'role-qc.html',               label: 'QC' },
      { key: 'role-shipper',          href: 'role-shipper.html',          label: 'Giao nhận' },
      { key: 'role-accountant',       href: 'role-accountant.html',       label: 'Kế toán labo' },
      { key: 'role-clinic-dentist',   href: 'role-clinic-dentist.html',   label: 'Nha sĩ (clinic)' },
      { key: 'role-clinic-assistant', href: 'role-clinic-assistant.html', label: 'Phụ tá (clinic)' },
      { key: 'role-clinic-owner',     href: 'role-clinic-owner.html',     label: 'Chủ phòng khám' },
    ]},

    { section: 'Đặt đơn', items: [
      { key: 'connectionless-intake',    href: 'connectionless-intake.html',    label: 'Đặt đơn không cài (QR/web)' },
      { key: 'rx-photo-capture',         href: 'rx-photo-capture.html',         label: 'Rx & chụp ảnh' },
      { key: 'dentiq-connected-intake',  href: 'dentiq-connected-intake.html',  label: 'Đặt đơn qua DentIQ' },
      { key: 'stl-scan-upload',          href: 'stl-scan-upload.html',          label: 'Tải STL / scan' },
      { key: 'lab-slip',                 href: 'lab-slip.html',                 label: 'Phiếu labo' },
    ]},

    { section: 'Sản xuất', items: [
      { key: 'case-queue-assignment', href: 'case-queue-assignment.html', label: 'Hàng đợi & phân ca' },
      { key: 'production-board',      href: 'production-board.html',      label: 'Bảng sản xuất' },
      { key: 'production-stages',     href: 'production-stages.html',     label: 'Công đoạn sản xuất' },
      { key: 'qc-gate',               href: 'qc-gate.html',               label: 'Cổng QC' },
    ]},

    { section: 'Giao nhận & bảo hành', items: [
      { key: 'shipment-delivery-tracking', href: 'shipment-delivery-tracking.html', label: 'Giao & theo dõi' },
      { key: 'redo-management',            href: 'redo-management.html',            label: 'Quản lý redo' },
      { key: 'warranty-lookup-claims',     href: 'warranty-lookup-claims.html',     label: 'Bảo hành & tra cứu' },
    ]},

    { section: 'Tài chính', items: [
      { key: 'pricing-material-catalog', href: 'pricing-material-catalog.html', label: 'Bảng giá & vật liệu' },
      { key: 'accounts-receivable',      href: 'accounts-receivable.html',      label: 'Công nợ' },
      { key: 'statement',                href: 'statement.html',                label: 'Sao kê' },
      { key: 'e-invoice-issuance',       href: 'e-invoice-issuance.html',       label: 'Hoá đơn điện tử' },
      { key: 'deposit',                  href: 'deposit.html',                  label: 'Đặt cọc' },
    ]},

    { section: 'Mạng lưới & tích hợp', items: [
      { key: 'lab-clinic-invitation', href: 'lab-clinic-invitation.html', label: 'Mời phòng khám' },
      { key: 'lab-clinic-connection', href: 'lab-clinic-connection.html', label: 'Kết nối DentIQ' },
      { key: 'zalo-bridge',           href: 'zalo-bridge.html',           label: 'Zalo ZNS' },
      { key: 'e-invoice-providers',   href: 'e-invoice-providers.html',   label: 'Nhà cung cấp HĐĐT' },
    ]},

    { section: 'Quản trị', items: [
      { key: 'roles-permissions', href: 'roles-permissions.html', label: 'Vai trò & phân quyền' },
      { key: 'lab-settings',      href: 'lab-settings.html',      label: 'Cấu hình labo' },
      { key: 'reports-kpi',       href: 'reports-kpi.html',       label: 'Báo cáo & KPI' },
      { key: 'notifications',     href: 'notifications.html',     label: 'Thông báo' },
      { key: 'security',          href: 'security.html',          label: 'Bảo mật & dữ liệu' },
    ]},
    { section: 'Tình huống thực tế', items: [
      { key: 'wf-first-order',         href: 'wf-first-order.html',         label: 'Đơn đầu tiên (clinic)' },
      { key: 'wf-case-lifecycle',      href: 'wf-case-lifecycle.html',      label: 'Vòng đời case A→Z' },
      { key: 'wf-rush-order',          href: 'wf-rush-order.html',          label: 'Đơn gấp (48h)' },
      { key: 'wf-physical-impression', href: 'wf-physical-impression.html', label: 'Mẫu vật lý gửi kèm' },
      { key: 'wf-stl-digital',         href: 'wf-stl-digital.html',         label: 'Case digital (STL)' },
      { key: 'wf-qc-fail-rework',      href: 'wf-qc-fail-rework.html',      label: 'QC trượt → làm lại' },
      { key: 'wf-redo-claim',          href: 'wf-redo-claim.html',          label: 'Redo sau giao' },
      { key: 'wf-warranty-claim',      href: 'wf-warranty-claim.html',      label: 'Yêu cầu bảo hành' },
      { key: 'wf-month-end-ar',        href: 'wf-month-end-ar.html',        label: 'Chốt công nợ cuối tháng' },
      { key: 'wf-einvoice-failed',     href: 'wf-einvoice-failed.html',     label: 'HĐĐT thất bại' },
      { key: 'wf-clinic-claim-account', href: 'wf-clinic-claim-account.html', label: 'Nâng cấp tài khoản clinic' },
      { key: 'wf-connect-dentiq',       href: 'wf-connect-dentiq.html',       label: 'Liên kết clinic DentIQ' },
      { key: 'wf-lab-go-live',          href: 'wf-lab-go-live.html',          label: 'Labo go-live' },
    ]},

    { section: 'Tài liệu khác', items: [
      { key: 'troubleshoot', href: 'troubleshoot.html', label: 'Xử lý sự cố' },
      { key: 'faq',          href: 'faq.html',          label: 'FAQ' },
      { key: 'glossary',     href: 'glossary.html',     label: 'Thuật ngữ' },
      { key: 'shortcuts',    href: 'shortcuts.html',    label: 'Phím tắt' },
      { key: 'changelog',    href: 'changelog.html',    label: 'Changelog' },
    ]},
  ];

  // Related-links map. Each entry: target pageKey → 3-5 related pageKeys.
  // Labels resolved from NAV above so a single source of truth.
  const RELATED = {
    'overview':                ['getting-started', 'concepts', 'role-lab-owner', 'glossary'],
    'getting-started':         ['overview', 'concepts', 'lab-setup-wizard', 'wf-case-lifecycle'],
    'concepts':                ['glossary', 'getting-started', 'wf-case-lifecycle', 'production-stages'],
    'lab-setup-wizard':        ['pricing-material-catalog', 'roles-permissions', 'lab-clinic-invitation', 'getting-started'],
    'migrate-from-excel-zalo': ['lab-setup-wizard', 'accounts-receivable', 'wf-lab-go-live', 'troubleshoot'],
    'connectionless-intake':   ['rx-photo-capture', 'wf-first-order', 'role-clinic-dentist', 'lab-slip'],
    'rx-photo-capture':        ['connectionless-intake', 'lab-slip', 'stl-scan-upload', 'role-clinic-assistant'],
    'dentiq-connected-intake': ['connectionless-intake', 'lab-clinic-connection', 'wf-connect-dentiq', 'stl-scan-upload'],
    'stl-scan-upload':         ['rx-photo-capture', 'dentiq-connected-intake', 'wf-stl-digital', 'production-board'],
    'lab-slip':                ['rx-photo-capture', 'connectionless-intake', 'role-clinic-assistant', 'glossary'],
    'case-queue-assignment': ['production-board', 'role-coordinator', 'wf-case-lifecycle', 'qc-gate'],
    'production-board':      ['case-queue-assignment', 'production-stages', 'qc-gate', 'role-technician'],
    'production-stages':     ['production-board', 'qc-gate', 'concepts', 'wf-case-lifecycle'],
    'qc-gate':               ['production-board', 'redo-management', 'wf-qc-fail-rework', 'role-qc'],
    'shipment-delivery-tracking': ['qc-gate', 'warranty-lookup-claims', 'role-shipper', 'wf-case-lifecycle'],
    'redo-management':            ['qc-gate', 'warranty-lookup-claims', 'wf-redo-claim', 'reports-kpi'],
    'warranty-lookup-claims':     ['redo-management', 'wf-warranty-claim', 'role-clinic-dentist', 'accounts-receivable'],
    'pricing-material-catalog': ['lab-setup-wizard', 'production-stages', 'accounts-receivable', 'role-lab-owner'],
    'accounts-receivable':      ['statement', 'deposit', 'e-invoice-issuance', 'wf-month-end-ar'],
    'statement':                ['accounts-receivable', 'e-invoice-issuance', 'wf-month-end-ar', 'deposit'],
    'e-invoice-issuance':       ['statement', 'e-invoice-providers', 'wf-einvoice-failed', 'role-accountant'],
    'deposit':                  ['accounts-receivable', 'statement', 'pricing-material-catalog', 'role-accountant'],
    'lab-clinic-invitation': ['lab-clinic-connection', 'wf-lab-go-live', 'role-lab-owner', 'connectionless-intake'],
    'lab-clinic-connection': ['dentiq-connected-intake', 'wf-connect-dentiq', 'lab-clinic-invitation', 'concepts'],
    'zalo-bridge':           ['notifications', 'accounts-receivable', 'wf-month-end-ar', 'shipment-delivery-tracking'],
    'e-invoice-providers':   ['e-invoice-issuance', 'wf-einvoice-failed', 'role-accountant', 'statement'],

    'roles-permissions': ['role-lab-owner', 'lab-settings', 'security', 'concepts'],
    'lab-settings':      ['pricing-material-catalog', 'warranty-lookup-claims', 'e-invoice-issuance', 'roles-permissions'],
    'reports-kpi':       ['redo-management', 'accounts-receivable', 'role-lab-owner', 'warranty-lookup-claims'],
    'notifications':     ['zalo-bridge', 'wf-month-end-ar', 'shipment-delivery-tracking', 'security'],
    'security':          ['roles-permissions', 'concepts', 'lab-settings', 'faq'],

    'role-lab-owner':   ['pricing-material-catalog', 'reports-kpi', 'lab-clinic-invitation', 'roles-permissions'],
    'role-coordinator': ['case-queue-assignment', 'production-board', 'role-technician', 'wf-case-lifecycle'],
    'role-technician':  ['production-board', 'production-stages', 'qc-gate', 'role-coordinator'],
    'role-qc':          ['qc-gate', 'redo-management', 'wf-qc-fail-rework', 'role-technician'],
    'role-shipper':     ['shipment-delivery-tracking', 'wf-case-lifecycle', 'role-coordinator', 'warranty-lookup-claims'],
    'role-accountant':  ['accounts-receivable', 'statement', 'e-invoice-issuance', 'deposit'],

    'role-clinic-dentist':   ['connectionless-intake', 'rx-photo-capture', 'warranty-lookup-claims', 'wf-first-order'],
    'role-clinic-assistant': ['connectionless-intake', 'lab-slip', 'accounts-receivable', 'role-clinic-dentist'],
    'role-clinic-owner':     ['accounts-receivable', 'redo-management', 'reports-kpi', 'role-clinic-dentist'],

    'wf-first-order':         ['connectionless-intake', 'role-clinic-dentist', 'wf-case-lifecycle', 'lab-clinic-invitation'],
    'wf-case-lifecycle':      ['getting-started', 'case-queue-assignment', 'qc-gate', 'shipment-delivery-tracking'],
    'wf-rush-order':          ['shipment-delivery-tracking', 'wf-case-lifecycle', 'case-queue-assignment', 'production-board'],
    'wf-physical-impression': ['concepts', 'case-queue-assignment', 'wf-case-lifecycle', 'rx-photo-capture'],
    'wf-stl-digital':         ['stl-scan-upload', 'production-board', 'wf-case-lifecycle', 'dentiq-connected-intake'],
    'wf-qc-fail-rework':      ['qc-gate', 'redo-management', 'production-stages', 'role-qc'],
    'wf-redo-claim':          ['redo-management', 'warranty-lookup-claims', 'qc-gate', 'wf-warranty-claim'],
    'wf-warranty-claim':  ['warranty-lookup-claims', 'wf-redo-claim', 'role-clinic-dentist', 'redo-management'],
    'wf-month-end-ar':    ['accounts-receivable', 'statement', 'e-invoice-issuance', 'deposit'],
    'wf-einvoice-failed': ['e-invoice-issuance', 'e-invoice-providers', 'wf-month-end-ar', 'statement'],
    'wf-clinic-claim-account': ['connectionless-intake', 'lab-clinic-invitation', 'role-clinic-owner', 'concepts'],
    'wf-connect-dentiq':       ['dentiq-connected-intake', 'lab-clinic-connection', 'wf-clinic-claim-account', 'concepts'],
    'wf-lab-go-live':          ['lab-setup-wizard', 'lab-clinic-invitation', 'migrate-from-excel-zalo', 'role-lab-owner'],

    'troubleshoot': ['faq', 'wf-qc-fail-rework', 'wf-einvoice-failed', 'shortcuts'],
    'faq':          ['glossary', 'troubleshoot', 'getting-started', 'concepts'],
    'glossary':     ['concepts', 'faq', 'production-stages', 'overview'],
    'shortcuts':    ['troubleshoot', 'faq', 'glossary', 'overview'],
    'changelog':    ['faq', 'overview', 'getting-started', 'glossary'],
  };

  const BRAND_LOGO = '<img src="assets/icons/logo.png" alt="DentIQ Lab logo" width="24" height="24">';
  const FAVICON_HREF = 'assets/icons/favicon.ico';
  const SEARCH_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
  const MENU_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  const SEARCH_LG_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
  const CLOSE_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  function buildTopbar() {
    return `
<header class="docs-topbar">
  <div class="container docs-topbar-inner">
    <a href="index.html" class="brand">
      <span class="brand-mark">${BRAND_LOGO}</span>
      DentIQ <span class="docs-mark">HELP</span>
    </a>
    <div class="docs-topbar-search">
      <span class="icon">${SEARCH_SVG}</span>
      <input type="search" id="docsTopSearch" placeholder="Tìm trong help… (⌘K)" aria-label="Tìm tài liệu">
    </div>
    <div class="docs-topbar-mobile-actions">
      <button type="button" class="docs-topbar-btn" id="docsMobileSearchBtn" aria-label="Tìm kiếm">${SEARCH_LG_SVG}</button>
      <button type="button" class="docs-topbar-btn" id="docsMobileMenuBtn" aria-label="Mở menu" aria-expanded="false" aria-controls="docsSidebar">${MENU_SVG}</button>
    </div>
  </div>
</header>`;
  }

  function buildSidebar(activeKey) {
    const sections = NAV.map(s => {
      const links = s.items.map(it => {
        const cls = it.key === activeKey ? ' class="active"' : '';
        const badge = it.badge ? ` <span class="badge">${it.badge}</span>` : '';
        return `      <a href="${it.href}"${cls}>${it.label}${badge}</a>`;
      }).join('\n');
      return `    <div class="docs-nav-section">${s.section}</div>\n${links}`;
    }).join('\n\n');

    return `
<aside class="docs-sidebar" id="docsSidebar" aria-label="Docs navigation">
  <div class="docs-sidebar-header">
    <a href="index.html" class="brand">
      <span class="brand-mark" style="width:22px;height:22px;border-radius:6px;">${BRAND_LOGO}</span>
      DentIQ Help
    </a>
    <button type="button" class="docs-sidebar-close" id="docsSidebarClose" aria-label="Đóng menu">${CLOSE_SVG}</button>
  </div>
  <div class="docs-search">
    <span class="icon">${SEARCH_SVG}</span>
    <input type="search" id="docsSidebarSearch" placeholder="Tìm trong help…" aria-label="Tìm tài liệu">
    <span class="kbd">⌘K</span>
  </div>
  <nav class="docs-nav">
${sections}
  </nav>
</aside>`;
  }

  // Section label for a pageKey (from NAV ordering).
  function sectionFor(key) {
    for (const s of NAV) if (s.items.some(it => it.key === key)) return s.section;
    return '';
  }

  function itemFor(key) {
    for (const s of NAV) {
      const it = s.items.find(i => i.key === key);
      if (it) return it;
    }
    return null;
  }

  function buildRelated(activeKey) {
    const keys = RELATED[activeKey];
    if (!keys || !keys.length) return '';
    const cards = keys.map(k => {
      const it = itemFor(k);
      if (!it) return '';
      const sec = sectionFor(k);
      return `    <a class="docs-related-card" href="${it.href}">
      <span class="docs-related-section">${sec}</span>
      <span class="docs-related-title">${it.label}</span>
    </a>`;
    }).filter(Boolean).join('\n');
    if (!cards) return '';
    return `
<section class="docs-related" aria-label="Xem thêm">
  <h2 class="docs-related-heading">Xem thêm</h2>
  <div class="docs-related-grid">
${cards}
  </div>
</section>`;
  }

  function buildFooter() {
    return `
<footer class="docs-footer">
  <div class="container docs-footer-inner">
    <div>© 2026 DentIQ. Made in Vietnam.</div>
    <div class="docs-footer-meta">
      <a href="mailto:support@dentiq.vn">support@dentiq.vn</a>
      <span class="mono">vi · v1.0</span>
    </div>
  </div>
</footer>`;
  }

  // ---------- Fuse.js search (VN diacritics-insensitive) ----------
  let searchAssets = null;
  let srSelectedIdx = -1;

  function normVN(s) {
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function buildSearchModal() {
    var iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
    var html = '<div id="docsSearchModal" class="docs-search-modal" hidden aria-hidden="true">'
      + '<div class="docs-search-modal-backdrop" data-search-close></div>'
      + '<div class="docs-search-modal-panel" role="dialog" aria-modal="true" aria-label="Tim trong help">'
      + '<div class="docs-search-modal-head">'
      + '<span class="docs-search-modal-icon">' + iconSvg + '</span>'
      + '<input type="search" id="docsSearchInput" class="docs-search-modal-input"'
      + ' placeholder="Tim... vi du: benh nhan, payment, bac si"'
      + ' autocomplete="off" spellcheck="false" aria-label="Tim tai lieu">'
      + '<button type="button" class="docs-search-modal-close" data-search-close aria-label="Dong">ESC</button>'
      + '</div>'
      + '<div id="docsSearchResults" class="docs-search-results" role="listbox" aria-label="Ket qua"></div>'
      + '<div class="docs-search-modal-foot">'
      + '<span><kbd>↑↓</kbd> điều hướng \xb7 <kbd>↵</kbd> mở \xb7 <kbd>ESC</kbd> đóng</span>'
      + '</div>'
      + '</div>'
      + '</div>';
    return html;
  }

  function loadSearchAssets() {
    if (searchAssets) return Promise.resolve(searchAssets);
    var fuseReady = window.Fuse
      ? Promise.resolve()
      : new Promise(function(resolve, reject) {
          var s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7/dist/fuse.min.js';
          s.onload = resolve;
          s.onerror = function() { reject(new Error('Fuse.js failed to load')); };
          document.head.appendChild(s);
        });
    return fuseReady.then(function() {
      return fetch('assets/search-data.json');
    }).then(function(res) {
      return res.json();
    }).then(function(raw) {
      var items = raw.map(function(e) {
        return Object.assign({}, e, {
          _norm: normVN([e.title, e.description].concat(e.keywords || []).join(' '))
        });
      });
      var fuse = new window.Fuse(items, {
        keys: [{ name: '_norm', weight: 1 }],
        threshold: 0.35,
        minMatchCharLength: 2,
        includeScore: true,
      });
      searchAssets = { fuse: fuse, items: items };
      return searchAssets;
    });
  }

  function clearContainer(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function renderSearchResults(query, results) {
    var container = document.getElementById('docsSearchResults');
    if (!container) return;
    srSelectedIdx = -1;
    clearContainer(container);
    if (!query.trim()) {
      var hint = document.createElement('div');
      hint.className = 'docs-sr-hint';
      hint.textContent = 'Gõ để tìm kiếm tài liệu DentIQ…';
      container.appendChild(hint);
      return;
    }
    if (!results || !results.length) {
      var noResult = document.createElement('div');
      noResult.className = 'docs-sr-hint';
      noResult.textContent = 'Không tìm thấy "' + query + '" — thử từ khác?';
      container.appendChild(noResult);
      return;
    }
    results.slice(0, 8).forEach(function(r, i) {
      var a = document.createElement('a');
      a.className = 'docs-sr-item';
      a.href = r.item.url;
      a.dataset.idx = String(i);
      a.setAttribute('role', 'option');
      a.setAttribute('aria-selected', 'false');
      var sec = document.createElement('span');
      sec.className = 'docs-sr-section';
      sec.textContent = r.item.section;
      var title = document.createElement('span');
      title.className = 'docs-sr-title';
      title.textContent = r.item.title;
      var desc = document.createElement('span');
      desc.className = 'docs-sr-desc';
      desc.textContent = r.item.description;
      a.appendChild(sec);
      a.appendChild(title);
      a.appendChild(desc);
      container.appendChild(a);
    });
  }

  function moveSrSelection(dir) {
    var container = document.getElementById('docsSearchResults');
    if (!container) return;
    var items = container.querySelectorAll('.docs-sr-item');
    if (!items.length) return;
    items.forEach(function(el) { el.classList.remove('active'); el.setAttribute('aria-selected', 'false'); });
    srSelectedIdx = Math.max(0, Math.min(items.length - 1, srSelectedIdx + dir));
    var target = items[srSelectedIdx];
    if (target) { target.classList.add('active'); target.setAttribute('aria-selected', 'true'); target.scrollIntoView({ block: 'nearest' }); }
  }

  function openSearchModal(prefill) {
    var modal = document.getElementById('docsSearchModal');
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('docs-search-open');
    var input = document.getElementById('docsSearchInput');
    if (!input) return;
    if (prefill) input.value = prefill;
    input.focus();
    if (input.value) {
      loadSearchAssets().then(function(assets) {
        renderSearchResults(input.value, assets.fuse.search(normVN(input.value)));
      }).catch(function(e) { console.error(e); });
    } else {
      renderSearchResults('', []);
    }
    if (input._dfWired) return;
    input._dfWired = true;
    input.addEventListener('input', function() {
      var q = input.value;
      loadSearchAssets().then(function(assets) {
        renderSearchResults(q, assets.fuse.search(normVN(q)));
      }).catch(function(e) { console.error(e); });
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSrSelection(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveSrSelection(-1); }
      else if (e.key === 'Enter') {
        var container = document.getElementById('docsSearchResults');
        if (container) {
          var active = container.querySelector('.docs-sr-item.active') || container.querySelector('.docs-sr-item');
          if (active) { active.click(); }
        }
      }
    });
  }

  function closeSearchModal() {
    var modal = document.getElementById('docsSearchModal');
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('docs-search-open');
  }

  function wireSearch() {
    var inputs = document.querySelectorAll('#docsTopSearch, #docsSidebarSearch');
    inputs.forEach(function(inp) {
      inp.setAttribute('readonly', 'readonly');
      inp.addEventListener('focus', function() { openSearchModal(''); inp.blur(); });
      inp.addEventListener('keydown', function(e) {
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          openSearchModal(e.key);
        }
      });
      inp.addEventListener('click', function() { openSearchModal(''); });
    });
    document.addEventListener('keydown', function(e) {
      var isK = e.key === 'k' || e.key === 'K';
      if (isK && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearchModal(''); }
      else if (e.key === 'Escape') {
        var modal = document.getElementById('docsSearchModal');
        if (modal && !modal.hidden) closeSearchModal();
      }
    });
    document.addEventListener('click', function(e) {
      var t = e.target;
      if (t && t.closest && t.closest('[data-search-close]')) closeSearchModal();
    });
  }

  // ---- Mobile drawer ----
  function openDrawer() {
    var sidebar = document.getElementById('docsSidebar');
    var overlay = document.getElementById('docsSidebarOverlay');
    var menuBtn = document.getElementById('docsMobileMenuBtn');
    if (!sidebar) return;
    sidebar.classList.add('open');
    if (overlay) { overlay.classList.add('visible'); }
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first link in sidebar for a11y
    var firstLink = sidebar.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeDrawer() {
    var sidebar = document.getElementById('docsSidebar');
    var overlay = document.getElementById('docsSidebarOverlay');
    var menuBtn = document.getElementById('docsMobileMenuBtn');
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (overlay) { overlay.classList.remove('visible'); }
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function wireDrawer() {
    var menuBtn = document.getElementById('docsMobileMenuBtn');
    var closeBtn = document.getElementById('docsSidebarClose');
    var overlay = document.getElementById('docsSidebarOverlay');
    var mobileSearch = document.getElementById('docsMobileSearchBtn');
    if (menuBtn) menuBtn.addEventListener('click', function() { openDrawer(); });
    if (closeBtn) closeBtn.addEventListener('click', function() { closeDrawer(); });
    if (overlay) overlay.addEventListener('click', function() { closeDrawer(); });
    if (mobileSearch) mobileSearch.addEventListener('click', function() { openSearchModal(''); });
    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var sidebar = document.getElementById('docsSidebar');
        if (sidebar && sidebar.classList.contains('open')) { closeDrawer(); }
      }
    });
    // Close drawer when a nav link inside is clicked (navigate away)
    var sidebar = document.getElementById('docsSidebar');
    if (sidebar) {
      sidebar.querySelectorAll('.docs-nav a').forEach(function(a) {
        a.addEventListener('click', function() { closeDrawer(); });
      });
    }
  }

  // Wrap bare <table> elements in a scroll container
  function wrapTables() {
    var content = document.querySelector('.docs-content');
    if (!content) return;
    content.querySelectorAll('table').forEach(function(tbl) {
      if (tbl.parentElement && tbl.parentElement.classList.contains('table-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      tbl.parentNode.insertBefore(wrap, tbl);
      wrap.appendChild(tbl);
    });
  }

  function inject() {
    const activeKey = document.body.dataset.page || '';
    if (!document.querySelector('link[rel="icon"]')) {
      var favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/x-icon';
      favicon.href = FAVICON_HREF;
      document.head.appendChild(favicon);
    }

    // Topbar — before <main>.
    const main = document.querySelector('main');
    if (main && !document.querySelector('.docs-topbar')) {
      main.insertAdjacentHTML('beforebegin', buildTopbar());
    }

    // Sidebar — into <div class="docs-shell"> as first child.
    const shell = document.querySelector('.docs-shell');
    if (shell && !shell.querySelector('.docs-sidebar')) {
      shell.insertAdjacentHTML('afterbegin', buildSidebar(activeKey));
    }

    // Overlay backdrop for mobile drawer — append once to body.
    if (!document.getElementById('docsSidebarOverlay')) {
      var ov = document.createElement('div');
      ov.id = 'docsSidebarOverlay';
      ov.className = 'docs-sidebar-overlay';
      document.body.appendChild(ov);
    }

    // Footer — after <main>.
    if (main && !document.querySelector('.docs-footer')) {
      main.insertAdjacentHTML('afterend', buildFooter());
    }

    // Related-links — inject before pager inside the article.
    const article = document.querySelector('.docs-content');
    if (article && !article.querySelector('.docs-related')) {
      const html = buildRelated(activeKey);
      if (html) {
        const pager = article.querySelector('.docs-pager');
        if (pager) pager.insertAdjacentHTML('beforebegin', html);
        else article.insertAdjacentHTML('beforeend', html);
      }
    }

    // Search modal — append once to body.
    if (!document.getElementById('docsSearchModal')) {
      document.body.insertAdjacentHTML('beforeend', buildSearchModal());
    }

    // Wrap tables for mobile scroll
    wrapTables();

    wireSearch();
    wireDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
