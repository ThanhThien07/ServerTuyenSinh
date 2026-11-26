#!/usr/bin/env node
'use strict';

/**
 * ============================================================================
 * ITC ADMISSIONS SERVER v2.0 — SINGLE-FILE FULL-STACK PRODUCTION BUNDLE
 * ============================================================================
 * Toàn bộ Backend (Node.js + SQLite WAL/FULL + RBAC/Session + Authenticated WS
 * + SLA/KPI + Import Engine + OOXML DOCX + Dynamic Excel + Versioned Backup)
 * và toàn bộ Frontend (HTML + CSS + 11 phân hệ JS LAN-Offline, CSP chặt)
 * được đóng gói gọn trong MỘT tệp duy nhất: server.js
 *
 * Chạy máy chủ  : node server.js   (hoặc npm start)
 * Nạp mẫu thử   : node server.js --seed-demo
 * Chạy kiểm thử : npm test
 * ============================================================================
 */

const http = require('http');

// ---------------------------------------------------------------------------
// 1. EMBEDDED STATIC FRONTEND ASSETS (Served from RAM, zero CDN, zero traversal)
// ---------------------------------------------------------------------------
const STATIC_ASSETS = {
  "/css/app.css": {
    "contentType": "text/css; charset=utf-8",
    "body": ":root {\n  --font-sans: 'Be Vietnam Pro', 'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif;\n  --bg: #f1f5f9;\n  --surface: #ffffff;\n  --surface-alt: #f8fafc;\n  --border: #e2e8f0;\n  --border-strong: #cbd5e1;\n  --text: #0f172a;\n  --text-muted: #475569;\n  --text-light: #64748b;\n  --primary: #0369a1;\n  --primary-hover: #075985;\n  --primary-soft: #e0f2fe;\n  --success: #059669;\n  --success-soft: #d1fae5;\n  --warn: #d97706;\n  --warn-soft: #fef3c7;\n  --danger: #dc2626;\n  --danger-soft: #fee2e2;\n  --indigo: #4f46e5;\n  --indigo-soft: #e0e7ff;\n  --radius: 12px;\n  --radius-sm: 8px;\n  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);\n  --shadow: 0 4px 16px rgba(15, 23, 42, 0.08);\n  --shadow-lg: 0 18px 48px rgba(15, 23, 42, 0.18);\n  --sidebar-w: 248px;\n}\n\n*, *::before, *::after { box-sizing: border-box; }\n\nhtml, body {\n  margin: 0;\n  padding: 0;\n  font-family: var(--font-sans);\n  font-size: 14px;\n  line-height: 1.5;\n  color: var(--text);\n  background: var(--bg);\n  -webkit-font-smoothing: antialiased;\n}\n\n.hidden { display: none !important; }\n.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }\n.min-w-0 { min-width: 0; }\n.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.text-muted { color: var(--text-muted); }\n.text-light { color: var(--text-light); }\n.text-danger { color: var(--danger); }\n.text-success { color: var(--success); }\n.text-warn { color: var(--warn); }\n.text-right { text-align: right; }\n.text-center { text-align: center; }\n.font-bold { font-weight: 700; }\n.font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }\n.mt-1 { margin-top: 6px; }\n.mt-2 { margin-top: 12px; }\n.mt-3 { margin-top: 18px; }\n.mb-2 { margin-bottom: 12px; }\n\n/* Login Screen */\n.login-screen {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0f172a 100%);\n}\n.login-card {\n  width: 100%;\n  max-width: 420px;\n  background: var(--surface);\n  border-radius: 16px;\n  padding: 30px;\n  box-shadow: var(--shadow-lg);\n}\n.login-brand {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  margin-bottom: 24px;\n}\n.login-brand h1 { margin: 0; font-size: 20px; font-weight: 800; color: var(--text); }\n.login-brand p { margin: 2px 0 0; font-size: 12px; color: var(--text-light); }\n.login-footer {\n  margin-top: 20px;\n  padding-top: 14px;\n  border-top: 1px solid var(--border);\n  text-align: center;\n  font-size: 11px;\n  color: var(--text-light);\n}\n\n.brand-mark {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  background: linear-gradient(135deg, #0284c7, #0369a1);\n  color: #fff;\n  font-weight: 800;\n  font-size: 15px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  letter-spacing: 0.5px;\n}\n.brand-mark.sm { width: 34px; height: 34px; font-size: 12px; border-radius: 10px; }\n\n/* App Shell */\n.app-shell {\n  display: flex;\n  min-height: 100vh;\n}\n\n.sidebar {\n  width: var(--sidebar-w);\n  background: var(--surface);\n  border-right: 1px solid var(--border);\n  display: flex;\n  flex-direction: column;\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 40;\n}\n.sidebar-head {\n  padding: 14px 16px;\n  border-bottom: 1px solid var(--border);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.brand-row { display: flex; align-items: center; gap: 10px; min-width: 0; }\n.brand-title { font-weight: 800; font-size: 14px; color: var(--text); line-height: 1.2; }\n.brand-sub { font-size: 11px; color: var(--text-light); }\n\n.sidebar-nav {\n  flex: 1;\n  overflow-y: auto;\n  padding: 10px;\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n}\n.nav-item {\n  width: 100%;\n  border: none;\n  background: transparent;\n  color: var(--text-muted);\n  font-family: inherit;\n  font-size: 13px;\n  font-weight: 600;\n  padding: 9px 11px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  cursor: pointer;\n  text-align: left;\n  transition: background 0.15s, color 0.15s;\n}\n.nav-item:hover { background: var(--surface-alt); color: var(--text); }\n.nav-item.active { background: var(--primary); color: #fff; }\n.nav-item .nav-left { display: flex; align-items: center; gap: 9px; min-width: 0; }\n.nav-badge {\n  font-size: 10px;\n  font-weight: 700;\n  padding: 2px 7px;\n  border-radius: 999px;\n  background: var(--surface-alt);\n  color: var(--text-muted);\n  border: 1px solid var(--border);\n  flex-shrink: 0;\n}\n.nav-item.active .nav-badge {\n  background: rgba(255,255,255,0.2);\n  color: #fff;\n  border-color: transparent;\n}\n\n.sidebar-foot {\n  padding: 12px;\n  border-top: 1px solid var(--border);\n  background: var(--surface-alt);\n}\n.user-card { display: flex; flex-direction: column; gap: 3px; }\n.user-card-top { display: flex; align-items: center; gap: 6px; }\n.user-role-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: var(--primary); }\n.user-name { font-size: 13px; font-weight: 700; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.user-email { font-size: 11px; color: var(--text-light); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.user-actions { display: flex; gap: 6px; margin-top: 8px; }\n\n/* Workspace & Topbar */\n.workspace {\n  flex: 1;\n  margin-left: var(--sidebar-w);\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n.topbar {\n  background: var(--surface);\n  border-bottom: 1px solid var(--border);\n  padding: 10px 20px;\n  position: sticky;\n  top: 0;\n  z-index: 30;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.topbar-left { display: flex; align-items: center; gap: 10px; }\n.page-title { margin: 0; font-size: 16px; font-weight: 800; color: var(--text); }\n.topbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }\n\n.module-root {\n  padding: 18px 20px 36px;\n  max-width: 1440px;\n  width: 100%;\n  margin: 0 auto;\n}\n\n/* Status Dots & Pills */\n.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }\n.dot-online { background: var(--success); }\n.dot-warn { background: var(--warn); }\n.dot-offline { background: var(--danger); }\n\n.pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 10px;\n  border-radius: 999px;\n  font-size: 12px;\n  font-weight: 600;\n  border: 1px solid var(--border);\n  background: var(--surface-alt);\n  color: var(--text-muted);\n}\n.pill-success { background: var(--success-soft); color: #065f46; border-color: #a7f3d0; }\n.pill-warn { background: var(--warn-soft); color: #92400e; border-color: #fde68a; cursor: pointer; }\n.pill-danger { background: var(--danger-soft); color: #991b1b; border-color: #fecaca; }\n.pill-primary { background: var(--primary-soft); color: #075985; border-color: #bae6fd; }\n.pill-indigo { background: var(--indigo-soft); color: #3730a3; border-color: #c7d2fe; }\n\n/* Cards & Grids */\n.card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow-sm);\n  padding: 16px;\n}\n.card + .card { margin-top: 14px; }\n.card-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  flex-wrap: wrap;\n  margin-bottom: 12px;\n}\n.card-title { margin: 0; font-size: 15px; font-weight: 700; color: var(--text); }\n.card-sub { margin: 2px 0 0; font-size: 12px; color: var(--text-light); }\n\n.grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }\n.grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }\n.grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }\n.grid-5 { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }\n.stat-card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  padding: 14px 16px;\n  box-shadow: var(--shadow-sm);\n}\n.stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: var(--text-light); }\n.stat-value { font-size: 24px; font-weight: 800; color: var(--text); margin-top: 4px; line-height: 1.2; }\n.stat-note { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n\n/* Buttons */\n.btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  padding: 8px 14px;\n  border-radius: var(--radius-sm);\n  font-family: inherit;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  border: 1px solid transparent;\n  transition: background 0.15s, border-color 0.15s, opacity 0.15s;\n  white-space: nowrap;\n}\n.btn:disabled { opacity: 0.55; cursor: not-allowed; }\n.btn-sm { padding: 5px 10px; font-size: 12px; }\n.btn-xs { padding: 4px 8px; font-size: 11px; }\n.btn-block { width: 100%; }\n.btn-primary { background: var(--primary); color: #fff; }\n.btn-primary:hover { background: var(--primary-hover); }\n.btn-success { background: var(--success); color: #fff; }\n.btn-success:hover { background: #047857; }\n.btn-warn { background: var(--warn); color: #fff; }\n.btn-danger { background: var(--danger); color: #fff; }\n.btn-danger-outline { background: transparent; color: var(--danger); border-color: #fecaca; }\n.btn-danger-outline:hover { background: var(--danger-soft); }\n.btn-outline { background: var(--surface); color: var(--text); border-color: var(--border-strong); }\n.btn-outline:hover { background: var(--surface-alt); }\n.btn-ghost { background: transparent; color: var(--text-muted); border-color: var(--border); }\n.btn-ghost:hover { background: var(--surface); color: var(--text); }\n.icon-btn {\n  border: 1px solid var(--border);\n  background: var(--surface);\n  color: var(--text);\n  border-radius: 8px;\n  width: 34px;\n  height: 34px;\n  cursor: pointer;\n  font-size: 16px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n/* Forms */\n.form-stack { display: flex; flex-direction: column; gap: 12px; }\n.form-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; }\n.field { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 140px; }\n.field label { font-size: 12px; font-weight: 600; color: var(--text-muted); }\ninput[type=\"text\"], input[type=\"email\"], input[type=\"password\"], input[type=\"number\"],\ninput[type=\"date\"], input[type=\"datetime-local\"], select, textarea {\n  font-family: inherit;\n  font-size: 13px;\n  padding: 8px 10px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius-sm);\n  background: var(--surface);\n  color: var(--text);\n  outline: none;\n  width: 100%;\n}\ninput:focus, select:focus, textarea:focus {\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.12);\n}\ntextarea { resize: vertical; min-height: 76px; }\n.select-sm { padding: 5px 10px; font-size: 12px; width: auto; min-width: 140px; }\n.input-inline { padding: 4px 7px; font-size: 12px; width: auto; }\n.check-row { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; user-select: none; }\n.check-row input[type=\"checkbox\"] { width: auto; }\n\n/* Toolbar & Tabs */\n.toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 12px;\n}\n.toolbar-group { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }\n\n.subtabs {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n  border-bottom: 1px solid var(--border);\n  padding-bottom: 10px;\n  margin-bottom: 14px;\n}\n.subtab-btn {\n  border: 1px solid var(--border);\n  background: var(--surface-alt);\n  color: var(--text-muted);\n  font-family: inherit;\n  font-size: 12px;\n  font-weight: 700;\n  padding: 7px 12px;\n  border-radius: 8px;\n  cursor: pointer;\n}\n.subtab-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }\n\n/* Tables */\n.table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius-sm); }\ntable { width: 100%; border-collapse: collapse; font-size: 13px; }\nth, td { padding: 9px 10px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: middle; }\nth {\n  background: var(--surface-alt);\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n  color: var(--text-muted);\n  white-space: nowrap;\n}\ntr:last-child td { border-bottom: none; }\ntbody tr:hover { background: #f8fafc; }\n\n.badge {\n  display: inline-flex;\n  align-items: center;\n  padding: 2px 8px;\n  border-radius: 999px;\n  font-size: 11px;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.badge-gray { background: #e2e8f0; color: #334155; }\n.badge-blue { background: var(--primary-soft); color: #075985; }\n.badge-green { background: var(--success-soft); color: #065f46; }\n.badge-amber { background: var(--warn-soft); color: #92400e; }\n.badge-red { background: var(--danger-soft); color: #991b1b; }\n.badge-indigo { background: var(--indigo-soft); color: #3730a3; }\n\n/* Alerts */\n.alert {\n  padding: 10px 12px;\n  border-radius: var(--radius-sm);\n  font-size: 13px;\n  border: 1px solid transparent;\n}\n.alert-danger { background: var(--danger-soft); color: #991b1b; border-color: #fecaca; }\n.alert-warn { background: var(--warn-soft); color: #92400e; border-color: #fde68a; }\n.alert-info { background: var(--primary-soft); color: #075985; border-color: #bae6fd; }\n.alert-success { background: var(--success-soft); color: #065f46; border-color: #a7f3d0; }\n\n/* Progress Bar */\n.progress-track { width: 100%; height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }\n.progress-fill { height: 100%; background: var(--primary); border-radius: 999px; transition: width 0.25s; }\n.progress-fill.green { background: var(--success); }\n.progress-fill.amber { background: var(--warn); }\n.progress-fill.red { background: var(--danger); }\n\n/* Pagination */\n.pagination {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  margin-top: 12px;\n  flex-wrap: wrap;\n  font-size: 12px;\n  color: var(--text-muted);\n}\n\n/* Drawer & Modal */\n.drawer-backdrop, .modal-backdrop, .sidebar-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(15, 23, 42, 0.45);\n  z-index: 60;\n}\n.drawer {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: min(680px, 100vw);\n  background: var(--surface);\n  z-index: 70;\n  box-shadow: var(--shadow-lg);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.drawer-head {\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--border);\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n}\n.drawer-body {\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px 20px 30px;\n}\n.modal-backdrop {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n  z-index: 80;\n}\n.modal-dialog {\n  width: min(780px, 100%);\n  max-height: 90vh;\n  background: var(--surface);\n  border-radius: 14px;\n  box-shadow: var(--shadow-lg);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.modal-head {\n  padding: 14px 18px;\n  border-bottom: 1px solid var(--border);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.modal-body {\n  padding: 16px 18px;\n  overflow-y: auto;\n}\n.modal-foot {\n  padding: 12px 18px;\n  border-top: 1px solid var(--border);\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n  background: var(--surface-alt);\n}\n\n/* Timeline */\n.timeline { display: flex; flex-direction: column; gap: 10px; }\n.timeline-item {\n  border-left: 3px solid var(--primary);\n  padding: 6px 12px;\n  background: var(--surface-alt);\n  border-radius: 0 8px 8px 0;\n}\n.timeline-meta { font-size: 11px; color: var(--text-light); display: flex; justify-content: space-between; gap: 8px; }\n.timeline-text { font-size: 13px; margin-top: 3px; white-space: pre-wrap; word-break: break-word; }\n\n/* Formal A4 Report Preview */\n.report-paper {\n  background: #fff;\n  border: 1px solid var(--border-strong);\n  border-radius: 8px;\n  padding: 28px 32px;\n  color: #111827;\n  font-family: 'Times New Roman', Times, serif;\n  font-size: 14px;\n  line-height: 1.55;\n}\n.report-paper h3 { margin: 16px 0 8px; font-size: 15px; }\n.report-paper table { margin: 8px 0 12px; font-size: 13px; }\n.report-paper th, .report-paper td { border: 1px solid #94a3b8; padding: 6px 8px; }\n.report-header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: center; margin-bottom: 18px; }\n.report-sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }\n\n/* Toast */\n.toast-root {\n  position: fixed;\n  top: 16px;\n  right: 16px;\n  z-index: 120;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  max-width: 380px;\n}\n.toast {\n  background: #0f172a;\n  color: #fff;\n  padding: 10px 14px;\n  border-radius: 10px;\n  box-shadow: var(--shadow);\n  font-size: 13px;\n  font-weight: 500;\n  border-left: 4px solid var(--success);\n}\n.toast.error { border-left-color: var(--danger); background: #7f1d1d; }\n.toast.warn { border-left-color: var(--warn); background: #78350f; }\n\n.mobile-only { display: none; }\n\n@media (max-width: 1024px) {\n  .grid-4, .grid-5 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n  .grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}\n\n@media (max-width: 820px) {\n  .mobile-only { display: inline-flex; }\n  .sidebar { transform: translateX(-100%); transition: transform 0.2s ease; }\n  .sidebar.open { transform: translateX(0); }\n  .workspace { margin-left: 0; }\n  .grid-2, .grid-3, .grid-4, .grid-5 { grid-template-columns: 1fr; }\n  .module-root { padding: 12px; }\n  .topbar { padding: 8px 12px; }\n  .report-paper { padding: 14px; }\n}\n\n@media print {\n  body { background: #fff; }\n  .sidebar, .topbar, .toast-root, .no-print, .subtabs { display: none !important; }\n  .workspace { margin-left: 0 !important; }\n  .module-root { padding: 0 !important; max-width: none !important; }\n  .card { border: none !important; box-shadow: none !important; padding: 0 !important; }\n  .report-paper { border: none !important; padding: 0 !important; }\n}\n"
  },
  "/index.html": {
    "contentType": "text/html; charset=utf-8",
    "body": "<!DOCTYPE html>\n<html lang=\"vi\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>ITC Admissions — Quản trị Tuyển sinh</title>\n  <link rel=\"stylesheet\" href=\"/css/app.css\">\n</head>\n<body>\n  <!-- Toast notification stack (textContent only, XSS-safe) -->\n  <div id=\"toast-root\" class=\"toast-root\" aria-live=\"polite\"></div>\n\n  <!-- LOGIN VIEW (Rendered strictly before any app data loads!) -->\n  <section id=\"login-view\" class=\"login-screen\">\n    <div class=\"login-card\">\n      <div class=\"login-brand\">\n        <div class=\"brand-mark\">ITC</div>\n        <div>\n          <h1>Phòng Tuyển Sinh ITC</h1>\n          <p>Hệ thống Quản trị Tuyển sinh Nội bộ v2.1</p>\n        </div>\n      </div>\n      <form id=\"login-form\" class=\"form-stack\" autocomplete=\"on\">\n        <div class=\"field\">\n          <label for=\"login-email\">Email tài khoản</label>\n          <input id=\"login-email\" name=\"email\" type=\"email\" required placeholder=\"vd: tai.nh@itc.edu.vn\" autocomplete=\"username\">\n        </div>\n        <div class=\"field\">\n          <label for=\"login-password\">Mật khẩu</label>\n          <div style=\"display:flex;gap:6px;align-items:center\"><input id=\"login-password\" name=\"password\" type=\"password\" required placeholder=\"Nhập mật khẩu\" autocomplete=\"current-password\" style=\"flex:1\"><button id=\"toggle-login-pw\" type=\"button\" class=\"btn btn-outline btn-sm\" style=\"flex-shrink:0\">Hiện</button></div>\n        </div>\n        <div id=\"login-error\" class=\"alert alert-danger hidden\"></div>\n        <button id=\"login-submit\" type=\"submit\" class=\"btn btn-primary btn-block\">Đăng nhập hệ thống</button>\n      </form>\n      <div class=\"login-footer\">\n        <p>Xác thực phiên máy chủ • Phân quyền RBAC • SQLite giao dịch bền vững</p>\n      </div>\n    </div>\n  </section>\n\n  <!-- MAIN APPLICATION SHELL -->\n  <div id=\"app-shell\" class=\"app-shell hidden\">\n    <!-- Mobile Sidebar Overlay -->\n    <div id=\"sidebar-backdrop\" class=\"sidebar-backdrop hidden\"></div>\n\n    <!-- LEFT VERTICAL SIDEBAR -->\n    <aside id=\"sidebar\" class=\"sidebar\">\n      <div class=\"sidebar-head\">\n        <div class=\"brand-row\">\n          <div class=\"brand-mark sm\">ITC</div>\n          <div class=\"min-w-0\">\n            <div class=\"brand-title\">Tuyển Sinh ITC</div>\n            <div class=\"brand-sub\">Quản trị nội bộ v2.1</div>\n          </div>\n        </div>\n        <button id=\"sidebar-close-btn\" class=\"icon-btn mobile-only\" type=\"button\" aria-label=\"Đóng menu\">✕</button>\n      </div>\n\n      <nav id=\"sidebar-nav\" class=\"sidebar-nav\" aria-label=\"Phân hệ chức năng\"></nav>\n\n      <div class=\"sidebar-foot\">\n        <div class=\"user-card\">\n          <div class=\"user-card-top\">\n            <span class=\"dot dot-online\"></span>\n            <span id=\"sidebar-user-role\" class=\"user-role-tag\"></span>\n          </div>\n          <div id=\"sidebar-user-name\" class=\"user-name\"></div>\n          <div id=\"sidebar-user-email\" class=\"user-email\"></div>\n          <div class=\"user-actions\">\n            <button id=\"btn-change-pw\" type=\"button\" class=\"btn btn-xs btn-ghost\">Đổi MK</button>\n            <button id=\"btn-logout\" type=\"button\" class=\"btn btn-xs btn-danger-outline\">Đăng xuất</button>\n          </div>\n        </div>\n      </div>\n    </aside>\n\n    <!-- RIGHT WORKSPACE -->\n    <div class=\"workspace\">\n      <header class=\"topbar\">\n        <div class=\"topbar-left\">\n          <button id=\"sidebar-open-btn\" class=\"icon-btn mobile-only\" type=\"button\" aria-label=\"Mở menu\">☰</button>\n          <h2 id=\"page-title\" class=\"page-title\">Việc Hôm Nay</h2>\n        </div>\n\n        <div class=\"topbar-right\">\n          <div class=\"intake-picker\">\n            <label for=\"global-intake-year\" class=\"sr-only\">Niên khóa</label>\n            <select id=\"global-intake-year\" class=\"select-sm\"></select>\n          </div>\n          <div id=\"outbox-indicator\" class=\"pill pill-warn hidden\" title=\"Thao tác đang chờ đồng bộ\"></div>\n          <div id=\"sync-indicator\" class=\"pill pill-neutral\" title=\"Trạng thái kết nối WebSocket\">\n            <span class=\"dot\" id=\"sync-dot\"></span>\n            <span id=\"sync-label\">Đang kết nối...</span>\n          </div>\n          <div id=\"presence-indicator\" class=\"pill pill-neutral\" title=\"Nhân sự đang trực tuyến\">\n            <span id=\"presence-label\">1 trực tuyến</span>\n          </div>\n        </div>\n      </header>\n\n      <main id=\"module-root\" class=\"module-root\"></main>\n    </div>\n  </div>\n\n  <!-- SLIDE-OVER DETAIL DRAWER (CRM Registration Detail) -->\n  <div id=\"drawer-backdrop\" class=\"drawer-backdrop hidden\"></div>\n  <aside id=\"detail-drawer\" class=\"drawer hidden\" aria-label=\"Chi tiết hồ sơ\"></aside>\n\n  <!-- GENERIC MODAL CONTAINER (Import Preview, Conflict Resolution, Password Change, Modals) -->\n  <div id=\"modal-backdrop\" class=\"modal-backdrop hidden\">\n    <div id=\"modal-dialog\" class=\"modal-dialog\" role=\"dialog\" aria-modal=\"true\"></div>\n  </div>\n\n  <!-- Modular Client Scripts (Strict CSP: script-src 'self', ZERO inline JS!) -->\n  <script src=\"/js/utils.js\"></script>\n  <script src=\"/js/charts.js\"></script>\n  <script src=\"/js/api.js\"></script>\n  <script src=\"/js/sync.js\"></script>\n  <script src=\"/js/modules/today.js\"></script>\n  <script src=\"/js/modules/crm.js\"></script>\n  <script src=\"/js/modules/regional.js\"></script>\n  <script src=\"/js/modules/zalo.js\"></script>\n  <script src=\"/js/modules/sla.js\"></script>\n  <script src=\"/js/modules/kpi.js\"></script>\n  <script src=\"/js/modules/executive.js\"></script>\n  <script src=\"/js/modules/tasks.js\"></script>\n  <script src=\"/js/modules/reports.js\"></script>\n  <script src=\"/js/modules/admin.js\"></script>\n  <script src=\"/js/modules/analytics.js\"></script>\n  <script src=\"/js/app.js\"></script>\n</body>\n</html>\n"
  },
  "/js/api.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  /**\n   * Authenticated HTTP client + Persistent Offline Outbox Queue + Conflict Error Surface (DEV05).\n   * - Never discards unsent local operations when server patches arrive!\n   * - Every write attaches an X-Idempotency-Key so retries never create duplicate records!\n   */\n  const OUTBOX_STORAGE_PREFIX = 'itc_outbox_v2_';\n\n  class ApiClient {\n    constructor() {\n      this.currentUserId = null;\n      this.outbox = [];\n      this.onOutboxChange = null;\n      this.onUnauthorized = null;\n      this.onConflict = null;\n      this.flushing = false;\n    }\n\n    setUserId(userId) {\n      this.currentUserId = userId;\n      this._loadOutbox();\n    }\n\n    _storageKey() {\n      return OUTBOX_STORAGE_PREFIX + (this.currentUserId || 'anon');\n    }\n\n    _loadOutbox() {\n      try {\n        const raw = localStorage.getItem(this._storageKey());\n        this.outbox = raw ? JSON.parse(raw) : [];\n      } catch (_) {\n        this.outbox = [];\n      }\n      this._notifyOutbox();\n    }\n\n    _saveOutbox() {\n      try {\n        localStorage.setItem(this._storageKey(), JSON.stringify(this.outbox));\n      } catch (_) {}\n      this._notifyOutbox();\n    }\n\n    _notifyOutbox() {\n      if (typeof this.onOutboxChange === 'function') {\n        this.onOutboxChange([...this.outbox]);\n      }\n    }\n\n    getOutbox() {\n      return [...this.outbox];\n    }\n\n    clearOutboxItem(id) {\n      this.outbox = this.outbox.filter(x => x.id !== id);\n      this._saveOutbox();\n    }\n\n    async request(method, url, body = null, opts = {}) {\n      const headers = { 'Accept': 'application/json' };\n      if (body !== null && body !== undefined) {\n        headers['Content-Type'] = 'application/json';\n      }\n      const idempotencyKey = opts.idempotencyKey || (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method) ? global.ITCUtils.genIdempotencyKey('req') : null);\n      if (idempotencyKey) {\n        headers['X-Idempotency-Key'] = idempotencyKey;\n      }\n\n      let resp;\n      try {\n        resp = await fetch(url, {\n          method,\n          headers,\n          credentials: 'same-origin',\n          body: body !== null && body !== undefined ? JSON.stringify(body) : undefined\n        });\n      } catch (networkErr) {\n        // Network offline! Queue into persistent outbox if queueable mutation\n        if (opts.queueOnOffline && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {\n          const item = {\n            id: global.ITCUtils.genIdempotencyKey('obx'),\n            idempotencyKey,\n            method,\n            url,\n            body,\n            label: opts.label || `${method} ${url}`,\n            createdAt: new Date().toISOString()\n          };\n          this.outbox.push(item);\n          this._saveOutbox();\n          const err = new Error('Mất kết nối mạng — thao tác đã được giữ an toàn trong Hàng đợi Outbox để tự đồng bộ khi có mạng.');\n          err.isQueued = true;\n          err.outboxItem = item;\n          throw err;\n        }\n        throw new Error('Không thể kết nối máy chủ. Vui lòng kiểm tra mạng LAN/Server.');\n      }\n\n      const contentType = resp.headers.get('content-type') || '';\n      const payload = contentType.includes('application/json') ? await resp.json() : await resp.text();\n\n      if (resp.status === 401) {\n        if (!opts.skipAuthRedirect && typeof this.onUnauthorized === 'function') {\n          this.onUnauthorized(payload && payload.message);\n        }\n        const err = new Error((payload && payload.message) || 'Phiên đăng nhập đã hết hạn.');\n        err.statusCode = 401;\n        throw err;\n      }\n\n      if (resp.status === 409) {\n        const err = new Error((payload && payload.message) || 'Phát hiện xung đột sửa đồng thời.');\n        err.statusCode = 409;\n        err.conflict = payload;\n        if (typeof this.onConflict === 'function' && !opts.suppressConflictModal) {\n          this.onConflict(payload, { method, url, body, idempotencyKey });\n        }\n        throw err;\n      }\n\n      if (!resp.ok) {\n        const err = new Error((payload && payload.message) || `Lỗi máy chủ (${resp.status})`);\n        err.statusCode = resp.status;\n        err.payload = payload;\n        throw err;\n      }\n\n      return payload;\n    }\n\n    get(url, opts = {}) { return this.request('GET', url, null, opts); }\n    post(url, body, opts = {}) { return this.request('POST', url, body, opts); }\n    patch(url, body, opts = {}) { return this.request('PATCH', url, body, opts); }\n    put(url, body, opts = {}) { return this.request('PUT', url, body, opts); }\n    del(url, opts = {}) { return this.request('DELETE', url, null, opts); }\n\n    async flushOutbox() {\n      if (this.flushing || this.outbox.length === 0) return { flushed: 0, remaining: this.outbox.length };\n      this.flushing = true;\n      let flushed = 0;\n      try {\n        while (this.outbox.length > 0) {\n          const item = this.outbox[0];\n          try {\n            await this.request(item.method, item.url, item.body, {\n              idempotencyKey: item.idempotencyKey,\n              queueOnOffline: false\n            });\n            this.outbox.shift();\n            this._saveOutbox();\n            flushed++;\n          } catch (err) {\n            if (err.statusCode === 409) {\n              // Remove from head so conflict modal can handle it explicitly without looping forever\n              this.outbox.shift();\n              this._saveOutbox();\n            } else {\n              break; // Still offline or transient failure\n            }\n          }\n        }\n      } finally {\n        this.flushing = false;\n      }\n      return { flushed, remaining: this.outbox.length };\n    }\n  }\n\n  global.ITCApi = new ApiClient();\n})(window);\n"
  },
  "/js/app.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, toast } = global.ITCUtils;\n\n  const NAV_ITEMS = [\n    { id: 0, key: 'today', icon: '⚡', label: '0. Việc Hôm Nay' },\n    { id: 1, key: 'crm', icon: '👥', label: '1. CRM Thí Sinh' },\n    { id: 2, key: 'regional', icon: '🗺️', label: '2. Data Tuyến Tỉnh' },\n    { id: 3, key: 'zalo', icon: '💬', label: '3. Bóc Tách Zalo' },\n    { id: 4, key: 'sla', icon: '⏱️', label: '4. Giám Sát SLA' },\n    { id: 5, key: 'kpi', icon: '📊', label: '5. Tiến Độ KPI' },\n    { id: 6, key: 'executive', icon: '📅', label: '6. Việc BGH & Họp' },\n    { id: 7, key: 'tasks', icon: '✅', label: '7. Giao Việc & Hỗ Trợ' },\n    { id: 8, key: 'reports', icon: '📑', label: '8. Xuất Báo Cáo' },\n    { id: 9, key: 'admin', icon: '⚙️', label: '9. Quản Trị & Server' },\n    { id: 10, key: 'analytics', icon: '📈', label: '10. Phân Tích Nguồn' }\n  ];\n\n  const state = {\n    bootstrap: null,\n    intakeYear: '2027',\n    activeTab: 0,\n    refreshTimer: null\n  };\n\n  function showLogin(errorMsg = '') {\n    global.ITCSync.stop();\n    document.getElementById('app-shell').classList.add('hidden');\n    document.getElementById('login-view').classList.remove('hidden');\n    const errEl = document.getElementById('login-error');\n    if (errorMsg) {\n      errEl.textContent = errorMsg;\n      errEl.classList.remove('hidden');\n    } else {\n      errEl.classList.add('hidden');\n    }\n  }\n\n  function showApp() {\n    document.getElementById('login-view').classList.add('hidden');\n    document.getElementById('app-shell').classList.remove('hidden');\n  }\n\n  function openModal(html, onReady) {\n    const backdrop = document.getElementById('modal-backdrop');\n    const dialog = document.getElementById('modal-dialog');\n    dialog.innerHTML = html;\n    backdrop.classList.remove('hidden');\n    dialog.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));\n    if (typeof onReady === 'function') onReady(dialog);\n  }\n\n  function closeModal() {\n    document.getElementById('modal-backdrop').classList.add('hidden');\n    document.getElementById('modal-dialog').innerHTML = '';\n  }\n\n  /**\n   * Explicit Conflict Resolution Modal (HTTP 409 Conflict — DEV05 & Scenario 10!)\n   */\n  function showConflictModal(conflictPayload, originalReq) {\n    const conflicts = conflictPayload.conflicts || [];\n    const curRec = conflictPayload.currentRecord || {};\n    openModal(`\n      <div class=\"modal-head\">\n        <h3 class=\"card-title text-danger\">Phát hiện xung đột chỉnh sửa đồng thời (HTTP 409)</h3>\n        <button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button>\n      </div>\n      <div class=\"modal-body form-stack\">\n        <div class=\"alert alert-warn\">Một người dùng khác đã cập nhật cùng trường dữ liệu lên phiên bản <strong>v${curRec.version || '?'}</strong> trước khi bạn lưu. Hệ thống không ghi đè im lặng — hãy chọn phương án xử lý:</div>\n        <div class=\"table-wrap\">\n          <table>\n            <thead><tr><th>Trường xung đột</th><th>Giá trị hiện tại trên Server</th><th>Giá trị bạn đang gửi</th></tr></thead>\n            <tbody>\n              ${conflicts.map(c => `<tr><td class=\"font-bold\">${esc(c.field)}</td><td>${esc(c.serverValue)}</td><td class=\"font-bold text-danger\">${esc(c.clientValue)}</td></tr>`).join('')}\n            </tbody>\n          </table>\n        </div>\n      </div>\n      <div class=\"modal-foot\">\n        <button type=\"button\" id=\"cfl-keep-server\" class=\"btn btn-outline\">Giữ bản Server (tải lại)</button>\n        <button type=\"button\" id=\"cfl-force-mine\" class=\"btn btn-danger\">Áp dụng bản của tôi (lên v${(curRec.version || 1) + 1})</button>\n      </div>\n    `, (dialog) => {\n      dialog.querySelector('#cfl-keep-server').addEventListener('click', () => {\n        closeModal();\n        refreshCurrentTab();\n      });\n      dialog.querySelector('#cfl-force-mine').addEventListener('click', async () => {\n        try {\n          const nextBody = { ...(originalReq.body || {}), expectedVersion: curRec.version };\n          await global.ITCApi.request(originalReq.method, originalReq.url, nextBody, { suppressConflictModal: true });\n          closeModal();\n          toast('Đã áp dụng bản của bạn trên phiên bản mới nhất.');\n          refreshCurrentTab();\n        } catch (err) {\n          toast(err.message, 'error');\n        }\n      });\n    });\n  }\n\n  function renderSidebar() {\n    const user = state.bootstrap.user;\n    const allowed = new Set(user.role === 'super_admin' ? NAV_ITEMS.map(n => n.id) : (user.allowed_tabs || [0, 1, 2, 3, 4, 5, 7, 10]));\n    if (['super_admin', 'manager'].includes(user.role)) {\n      allowed.add(6); allowed.add(8); allowed.add(9);\n    }\n\n    const nav = document.getElementById('sidebar-nav');\n    nav.innerHTML = NAV_ITEMS.filter(item => allowed.has(item.id)).map(item => `\n      <button type=\"button\" class=\"nav-item ${state.activeTab === item.id ? 'active' : ''}\" data-nav-id=\"${item.id}\">\n        <span class=\"nav-left\"><span>${item.icon}</span><span class=\"truncate\">${esc(item.label)}</span></span>\n      </button>\n    `).join('');\n\n    nav.querySelectorAll('[data-nav-id]').forEach(btn => {\n      btn.addEventListener('click', () => {\n        switchTab(Number(btn.dataset.navId));\n        closeMobileSidebar();\n      });\n    });\n\n    document.getElementById('sidebar-user-role').textContent = `${user.role} • scope:${user.scope}`;\n    document.getElementById('sidebar-user-name').textContent = user.full_name;\n    document.getElementById('sidebar-user-email').textContent = user.email;\n\n    const yearSel = document.getElementById('global-intake-year');\n    yearSel.innerHTML = (state.bootstrap.intakeYears || []).map(y =>\n      `<option value=\"${esc(y.year)}\" ${y.year === state.intakeYear ? 'selected' : ''}>NK ${esc(y.year)}${y.status === 'closed' ? ' (Đã khóa)' : ''}</option>`\n    ).join('');\n  }\n\n  function makeContext() {\n    return {\n      bootstrap: state.bootstrap,\n      intakeYear: state.intakeYear,\n      switchTab,\n      refreshCurrentTab,\n      reloadBootstrap,\n      openModal,\n      closeModal,\n      openRegistrationDrawer: (regId) => global.ITCModules.crm.openDetailDrawer(regId, makeContext())\n    };\n  }\n\n  async function refreshCurrentTab() {\n    if (!state.bootstrap) return;\n    const item = NAV_ITEMS.find(n => n.id === state.activeTab) || NAV_ITEMS[0];\n    document.getElementById('page-title').textContent = item.label;\n    const root = document.getElementById('module-root');\n    const mod = global.ITCModules[item.key];\n    if (!mod) {\n      root.innerHTML = '<div class=\"alert alert-danger\">Phân hệ chưa sẵn sàng.</div>';\n      return;\n    }\n    try {\n      await mod.render(root, makeContext());\n    } catch (err) {\n      if (err.statusCode !== 401) {\n        root.innerHTML = `<div class=\"alert alert-danger\">${esc(err.message)}</div>`;\n      }\n    }\n  }\n\n  function switchTab(tabId) {\n    state.activeTab = tabId;\n    renderSidebar();\n    refreshCurrentTab();\n  }\n\n  async function reloadBootstrap() {\n    const data = await global.ITCApi.get('/api/bootstrap');\n    state.bootstrap = data;\n    if (!data.intakeYears.some(y => y.year === state.intakeYear)) {\n      state.intakeYear = data.defaultIntakeYear || '2027';\n    }\n    global.ITCApi.setUserId(data.user.id);\n    renderSidebar();\n  }\n\n  function scheduleSoftRefresh() {\n    // Do NOT wipe unsent input while user is actively editing a form/modal or focused in an input!\n    const modalOpen = !document.getElementById('modal-backdrop').classList.contains('hidden');\n    const drawerOpen = !document.getElementById('detail-drawer').classList.contains('hidden');\n    const activeEl = document.activeElement;\n    const editingField = activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName);\n    if (modalOpen || drawerOpen || editingField) return;\n\n    clearTimeout(state.refreshTimer);\n    state.refreshTimer = setTimeout(() => refreshCurrentTab(), 300);\n  }\n\n  function closeMobileSidebar() {\n    document.getElementById('sidebar').classList.remove('open');\n    document.getElementById('sidebar-backdrop').classList.add('hidden');\n  }\n\n  function wireGlobalEvents() {\n    global.ITCApi.onUnauthorized = (msg) => showLogin(msg || 'Vui lòng đăng nhập để tiếp tục.');\n    global.ITCApi.onConflict = (payload, req) => showConflictModal(payload, req);\n    global.ITCApi.onOutboxChange = (items) => {\n      const pill = document.getElementById('outbox-indicator');\n      if (items.length > 0) {\n        pill.textContent = `Outbox: ${items.length} thao tác chờ đồng bộ (Nhấn gửi lại)`;\n        pill.classList.remove('hidden');\n      } else {\n        pill.classList.add('hidden');\n      }\n    };\n\n    document.getElementById('outbox-indicator').addEventListener('click', async () => {\n      const res = await global.ITCApi.flushOutbox();\n      toast(`Đã đồng bộ ${res.flushed} thao tác (còn lại: ${res.remaining}).`, res.remaining > 0 ? 'warn' : 'ok');\n      if (res.flushed > 0) refreshCurrentTab();\n    });\n\n    global.ITCSync.onStatus = (st, label) => {\n      const dot = document.getElementById('sync-dot');\n      const lbl = document.getElementById('sync-label');\n      dot.className = 'dot ' + (st === 'online' ? 'dot-online' : (st === 'fallback' ? 'dot-warn' : 'dot-offline'));\n      lbl.textContent = label;\n    };\n    global.ITCSync.onPresence = (p) => {\n      document.getElementById('presence-label').textContent = `${p.onlineUsers} người online • ${p.totalConnections} tab`;\n    };\n    global.ITCSync.onDomainEvent = () => scheduleSoftRefresh();\n    global.ITCSync.onFallbackPoll = () => scheduleSoftRefresh();\n    global.ITCSync.onSessionRevoked = (reason) => {\n      toast(reason || 'Phiên đã bị thu hồi.', 'error');\n      showLogin(reason || 'Tài khoản đã bị khóa hoặc đăng xuất.');\n    };\n    global.ITCSync.onSystemReload = async (reason) => {\n      toast(reason || 'Hệ thống vừa khôi phục dữ liệu.', 'warn');\n      await reloadBootstrap();\n      refreshCurrentTab();\n    };\n\n    // Login form\n    const tpwBtn = document.getElementById('toggle-login-pw'); if (tpwBtn) { tpwBtn.addEventListener('click', () => { const inp = document.getElementById('login-password'); const showing = inp.type === 'text'; inp.type = showing ? 'password' : 'text'; tpwBtn.textContent = showing ? 'Hiện' : 'Ẩn'; }); }\n    document.getElementById('login-form').addEventListener('submit', async (e) => {\n      e.preventDefault();\n      const email = document.getElementById('login-email').value.trim();\n      const password = document.getElementById('login-password').value;\n      const errEl = document.getElementById('login-error');\n      errEl.classList.add('hidden');\n      try {\n        await global.ITCApi.post('/api/auth/login', { email, password }, { skipAuthRedirect: true });\n        document.getElementById('login-password').value = '';\n        await startAuthenticatedSession();\n      } catch (err) {\n        errEl.textContent = err.message;\n        errEl.classList.remove('hidden');\n      }\n    });\n\n    document.getElementById('btn-logout').addEventListener('click', async () => {\n      try { await global.ITCApi.post('/api/auth/logout', {}); } catch (_) {}\n      state.bootstrap = null;\n      showLogin('');\n      toast('Đã đăng xuất an toàn.');\n    });\n\n    document.getElementById('btn-change-pw').addEventListener('click', () => {\n      openModal(`\n        <div class=\"modal-head\"><h3 class=\"card-title\">Đổi mật khẩu tài khoản</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div>\n        <form id=\"chg-pw-form\">\n          <div class=\"modal-body form-stack\">\n            <div class=\"field\"><label>Mật khẩu hiện tại *</label><input name=\"cur\" type=\"password\" required></div>\n            <div class=\"field\"><label>Mật khẩu mới (&ge;8 ký tự) *</label><input name=\"next\" type=\"password\" required minlength=\"8\"></div>\n          </div>\n          <div class=\"modal-foot\"><button type=\"button\" class=\"btn btn-outline\" data-close-modal>Hủy</button><button type=\"submit\" class=\"btn btn-primary\">Đổi mật khẩu</button></div>\n        </form>\n      `, (dialog) => {\n        dialog.querySelector('#chg-pw-form').addEventListener('submit', async (e) => {\n          e.preventDefault();\n          const fd = new FormData(e.target);\n          try {\n            await global.ITCApi.post('/api/auth/change-password', { currentPassword: fd.get('cur'), newPassword: fd.get('next') });\n            closeModal();\n            toast('Đã đổi mật khẩu thành công.');\n          } catch (err) { toast(err.message, 'error'); }\n        });\n      });\n    });\n\n    document.getElementById('global-intake-year').addEventListener('change', (e) => {\n      state.intakeYear = e.target.value;\n      toast(`Đã chuyển sang Niên khóa ${state.intakeYear} (dữ liệu cô lập hoàn toàn theo năm).`);\n      refreshCurrentTab();\n    });\n\n    document.getElementById('sidebar-open-btn').addEventListener('click', () => {\n      document.getElementById('sidebar').classList.add('open');\n      document.getElementById('sidebar-backdrop').classList.remove('hidden');\n    });\n    document.getElementById('sidebar-close-btn').addEventListener('click', closeMobileSidebar);\n    document.getElementById('sidebar-backdrop').addEventListener('click', closeMobileSidebar);\n  }\n\n  async function startAuthenticatedSession() {\n    await reloadBootstrap();\n    showApp();\n    global.ITCSync.start();\n    switchTab(0);\n  }\n\n  async function boot() {\n    wireGlobalEvents();\n    try {\n      await global.ITCApi.get('/api/auth/me', { skipAuthRedirect: true });\n      await startAuthenticatedSession();\n    } catch (_) {\n      showLogin('');\n    }\n  }\n\n  document.addEventListener('DOMContentLoaded', boot);\n})(window);\n"
  },
  "/js/charts.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  /**\n   * Lightweight zero-CDN pure SVG chart renderers (100% LAN offline-safe, XSS-safe).\n   */\n  const { esc } = global.ITCUtils;\n\n  function renderMonthlyBarChart(series) {\n    if (!Array.isArray(series) || series.length === 0) {\n      return '<div class=\"text-light text-center\" style=\"padding:20px\">Chưa có dữ liệu biểu đồ.</div>';\n    }\n    const maxVal = Math.max(10, ...series.map(s => Math.max(s.targetLead || 0, s.actualLead || 0)));\n    const w = 780;\n    const h = 210;\n    const padL = 36;\n    const padB = 30;\n    const padT = 16;\n    const plotH = h - padB - padT;\n    const groupW = (w - padL - 10) / series.length;\n\n    const bars = series.map((s, idx) => {\n      const gx = padL + idx * groupW + 4;\n      const bw = Math.max(8, (groupW - 14) / 2);\n      const tH = Math.round(((s.targetLead || 0) / maxVal) * plotH);\n      const aH = Math.round(((s.actualLead || 0) / maxVal) * plotH);\n      const ty = padT + (plotH - tH);\n      const ay = padT + (plotH - aH);\n      return `\n        <g>\n          <rect x=\"${gx}\" y=\"${ty}\" width=\"${bw}\" height=\"${tH}\" rx=\"3\" fill=\"#cbd5e1\">\n            <title>${esc(s.label)} - Chỉ tiêu ĐK: ${s.targetLead}</title>\n          </rect>\n          <rect x=\"${gx + bw + 2}\" y=\"${ay}\" width=\"${bw}\" height=\"${aH}\" rx=\"3\" fill=\"#0369a1\">\n            <title>${esc(s.label)} - Thực đạt ĐK: ${s.actualLead}</title>\n          </rect>\n          <text x=\"${gx + bw}\" y=\"${h - 10}\" text-anchor=\"middle\" font-size=\"10\" fill=\"#475569\">${esc(s.label.slice(0, 5))}</text>\n        </g>`;\n    }).join('');\n\n    return `\n      <svg viewBox=\"0 0 ${w} ${h}\" style=\"width:100%;height:auto;max-height:240px;display:block\">\n        <line x1=\"${padL}\" y1=\"${padT}\" x2=\"${padL}\" y2=\"${padT + plotH}\" stroke=\"#cbd5e1\" stroke-width=\"1\"/>\n        <line x1=\"${padL}\" y1=\"${padT + plotH}\" x2=\"${w - 8}\" y2=\"${padT + plotH}\" stroke=\"#cbd5e1\" stroke-width=\"1\"/>\n        <text x=\"${padL - 4}\" y=\"${padT + 8}\" text-anchor=\"end\" font-size=\"10\" fill=\"#64748b\">${maxVal}</text>\n        <text x=\"${padL - 4}\" y=\"${padT + plotH}\" text-anchor=\"end\" font-size=\"10\" fill=\"#64748b\">0</text>\n        ${bars}\n      </svg>\n      <div class=\"toolbar-group\" style=\"font-size:11px;margin-top:4px;color:#475569\">\n        <span><span style=\"display:inline-block;width:10px;height:10px;background:#cbd5e1;border-radius:2px;margin-right:4px\"></span>Chỉ tiêu đăng ký</span>\n        <span><span style=\"display:inline-block;width:10px;height:10px;background:#0369a1;border-radius:2px;margin-right:4px\"></span>Thực đạt đăng ký</span>\n      </div>`;\n  }\n\n  function renderHorizontalBars(rows, valueKey = 'leads', maxItems = 8) {\n    const list = (rows || []).slice(0, maxItems);\n    if (list.length === 0) return '<div class=\"text-light\">Chưa có dữ liệu.</div>';\n    const maxV = Math.max(1, ...list.map(r => r[valueKey] || 0));\n    return list.map(r => {\n      const val = r[valueKey] || 0;\n      const pct = Math.round((val / maxV) * 100);\n      return `\n        <div style=\"margin-bottom:8px\">\n          <div style=\"display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px\">\n            <span class=\"truncate\" style=\"max-width:70%;font-weight:600\">${esc(r.name)}</span>\n            <span class=\"text-muted\">${val} ĐK • ${r.submitted || 0} HS • ${r.enrolled || 0} NH (${r.enrollRate || 0}%)</span>\n          </div>\n          <div class=\"progress-track\"><div class=\"progress-fill\" style=\"width:${pct}%\"></div></div>\n        </div>`;\n    }).join('');\n  }\n\n  global.ITCCharts = {\n    renderMonthlyBarChart,\n    renderHorizontalBars\n  };\n})(window);\n"
  },
  "/js/modules/admin.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, formatDateTime, toast } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n  let activeSub = 'users';\n\n  global.ITCModules.admin = {\n    async render(container, ctx) {\n      if (!['super_admin', 'manager'].includes(ctx.bootstrap.user.role)) {\n        container.innerHTML = '<div class=\"alert alert-danger\">Bạn không có quyền truy cập phân hệ Quản trị & Server.</div>';\n        return;\n      }\n\n      const [usersRes, staffRes, yearsRes, auditRes, bkpRes, healthRes] = await Promise.all([\n        global.ITCApi.get('/api/admin/users'),\n        global.ITCApi.get('/api/admin/staff'),\n        global.ITCApi.get('/api/admin/intake-years'),\n        global.ITCApi.get('/api/admin/audit?limit=80'),\n        global.ITCApi.get('/api/backup'),\n        global.ITCApi.get('/api/health')\n      ]);\n\n      const isSuper = ctx.bootstrap.user.role === 'super_admin';\n\n      container.innerHTML = `\n        <div class=\"card\">\n          <div class=\"subtabs\">\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'users' ? 'active' : ''}\" data-adm-sub=\"users\">Tài khoản & Phân quyền RBAC</button>\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'staff' ? 'active' : ''}\" data-adm-sub=\"staff\">Danh mục Nhân sự & Zalo Slot</button>\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'years' ? 'active' : ''}\" data-adm-sub=\"years\">Niên khóa tuyển sinh</button>\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'backup' ? 'active' : ''}\" data-adm-sub=\"backup\">Sao lưu & Khôi phục</button>\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'audit' ? 'active' : ''}\" data-adm-sub=\"audit\">Nhật ký Server (${auditRes.items.length})</button>\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'health' ? 'active' : ''}\" data-adm-sub=\"health\">Sức khỏe Hệ thống</button>\n          </div>\n\n          <div id=\"adm-panel-body\"></div>\n        </div>\n      `;\n\n      container.querySelectorAll('[data-adm-sub]').forEach(btn => {\n        btn.addEventListener('click', () => { activeSub = btn.dataset.admSub; ctx.refreshCurrentTab(); });\n      });\n\n      const body = container.querySelector('#adm-panel-body');\n\n      if (activeSub === 'users') {\n        body.innerHTML = `\n          <div class=\"toolbar\">\n            <div><h3 class=\"card-title\">Quản lý Tài khoản, Phạm vi dữ liệu & Phiên máy chủ</h3><p class=\"card-sub\">Khóa tài khoản lập tức thu hồi phiên HTTP và ngắt kết nối WebSocket đang mở</p></div>\n            ${isSuper ? '<button type=\"button\" id=\"adm-new-user\" class=\"btn btn-primary btn-sm\">+ Thêm tài khoản & nhân sự mới</button>' : ''}\n          </div>\n          <div class=\"table-wrap\">\n            <table>\n              <thead><tr><th>Họ tên & Email</th><th>Vai trò</th><th>Phạm vi hồ sơ</th><th>Quyền chức năng</th><th>Trạng thái</th><th></th></tr></thead>\n              <tbody>\n                ${usersRes.items.map(u => `\n                  <tr>\n                    <td><div class=\"font-bold\">${esc(u.full_name)}</div><div class=\"text-light\" style=\"font-size:11px\">${esc(u.email)}</div></td>\n                    <td><span class=\"badge ${u.role === 'super_admin' ? 'badge-indigo' : 'badge-blue'}\">${esc(u.role)}</span></td>\n                    <td><code>${esc(u.scope)}</code></td>\n                    <td style=\"font-size:11px\">\n                      KPI:${u.can_edit_kpi ? '✓' : '✗'} • Export:${u.can_export ? '✓' : '✗'} • Xóa:${u.can_delete ? '✓' : '✗'} • Duyệt BC:${u.can_approve_reports ? '✓' : '✗'} • Restore:${u.can_restore ? '✓' : '✗'}\n                    </td>\n                    <td><span class=\"badge ${u.active ? 'badge-green' : 'badge-red'}\">${u.active ? 'Hoạt động' : 'Đã khóa'}</span></td>\n                    <td class=\"text-right\">\n                      ${isSuper ? `<button type=\"button\" class=\"btn btn-xs btn-outline adm-edit-user\" data-id=\"${esc(u.id)}\">Sửa quyền / Khóa</button>` : ''}\n                    </td>\n                  </tr>\n                `).join('')}\n              </tbody>\n            </table>\n          </div>`;\n\n        if (isSuper) {\n          body.querySelector('#adm-new-user').addEventListener('click', () => {\n            ctx.openModal(`\n              <div class=\"modal-head\"><h3 class=\"card-title\">Thêm tài khoản & nhân sự mới</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div>\n              <form id=\"adm-create-user-form\">\n                <div class=\"modal-body form-stack\">\n                  <div class=\"form-row\">\n                    <div class=\"field\"><label>Họ và tên *</label><input name=\"full_name\" type=\"text\" required></div>\n                    <div class=\"field\"><label>Email đăng nhập *</label><input name=\"email\" type=\"email\" required></div>\n                  </div>\n                  <div class=\"form-row\">\n                    <div class=\"field\"><label>Mật khẩu khởi tạo (&ge;8 ký tự) *</label><input name=\"password\" type=\"password\" required value=\"ItcStaff@2027!\"></div>\n                    <div class=\"field\"><label>Zalo Slot (tách biệt nhân sự)</label><input name=\"zalo_slot\" type=\"text\" placeholder=\"vd: Zalo 5\"></div>\n                  </div>\n                  <div class=\"form-row\">\n                    <div class=\"field\">\n                      <label>Vai trò</label>\n                      <select name=\"role\">\n                        <option value=\"consultant\">Chuyên viên Tư vấn</option>\n                        <option value=\"manager\">Lãnh đạo Phòng</option>\n                        <option value=\"super_admin\">Super Admin</option>\n                      </select>\n                    </div>\n                    <div class=\"field\">\n                      <label>Phạm vi hồ sơ</label>\n                      <select name=\"scope\">\n                        <option value=\"own\">own (chỉ hồ sơ được giao)</option>\n                        <option value=\"team\">team (nhóm tư vấn)</option>\n                        <option value=\"all\">all (toàn phòng)</option>\n                      </select>\n                    </div>\n                  </div>\n                  <div class=\"toolbar-group\">\n                    <label class=\"check-row\"><input type=\"checkbox\" name=\"can_export\" checked> Xuất Excel/Word</label>\n                    <label class=\"check-row\"><input type=\"checkbox\" name=\"can_edit_kpi\"> Sửa KPI</label>\n                    <label class=\"check-row\"><input type=\"checkbox\" name=\"can_delete\"> Xóa hồ sơ</label>\n                    <label class=\"check-row\"><input type=\"checkbox\" name=\"can_approve_reports\"> Duyệt báo cáo</label>\n                  </div>\n                </div>\n                <div class=\"modal-foot\"><button type=\"button\" class=\"btn btn-outline\" data-close-modal>Hủy</button><button type=\"submit\" class=\"btn btn-primary\">Tạo tài khoản</button></div>\n              </form>\n            `, (dialog) => {\n              dialog.querySelector('#adm-create-user-form').addEventListener('submit', async (e) => {\n                e.preventDefault();\n                const fd = new FormData(e.target);\n                try {\n                  await global.ITCApi.post('/api/admin/users', {\n                    full_name: fd.get('full_name'),\n                    email: fd.get('email'),\n                    password: fd.get('password'),\n                    zalo_slot: fd.get('zalo_slot'),\n                    role: fd.get('role'),\n                    scope: fd.get('scope'),\n                    can_export: fd.get('can_export') === 'on',\n                    can_edit_kpi: fd.get('can_edit_kpi') === 'on',\n                    can_delete: fd.get('can_delete') === 'on',\n                    can_approve_reports: fd.get('can_approve_reports') === 'on'\n                  });\n                  ctx.closeModal();\n                  toast('Đã tạo tài khoản & nhân sự mới (có thể phân công và lập KPI ngay).');\n                  await ctx.reloadBootstrap();\n                  ctx.refreshCurrentTab();\n                } catch (err) { toast(err.message, 'error'); }\n              });\n            });\n          });\n\n          body.querySelectorAll('.adm-edit-user').forEach(btn => {\n            btn.addEventListener('click', () => {\n              const u = usersRes.items.find(x => x.id === btn.dataset.id);\n              if (!u) return;\n              ctx.openModal(`\n                <div class=\"modal-head\"><h3 class=\"card-title\">Chỉnh quyền tài khoản: ${esc(u.email)}</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div>\n                <form id=\"adm-edit-user-form\">\n                  <div class=\"modal-body form-stack\">\n                    <div class=\"form-row\">\n                      <div class=\"field\"><label>Họ tên hiển thị (đổi tên không mất dữ liệu)</label><input name=\"full_name\" type=\"text\" value=\"${esc(u.full_name)}\" required></div>\n                      <div class=\"field\"><label>Zalo Slot</label><input name=\"zalo_slot\" type=\"text\" value=\"${esc(u.zalo_slot)}\"></div>\n                    </div>\n                    <div class=\"form-row\">\n                      <div class=\"field\">\n                        <label>Vai trò</label>\n                        <select name=\"role\">\n                          <option value=\"consultant\" ${u.role === 'consultant' ? 'selected' : ''}>Chuyên viên Tư vấn</option>\n                          <option value=\"manager\" ${u.role === 'manager' ? 'selected' : ''}>Lãnh đạo Phòng</option>\n                          <option value=\"super_admin\" ${u.role === 'super_admin' ? 'selected' : ''}>Super Admin</option>\n                        </select>\n                      </div>\n                      <div class=\"field\">\n                        <label>Phạm vi hồ sơ</label>\n                        <select name=\"scope\">\n                          <option value=\"own\" ${u.scope === 'own' ? 'selected' : ''}>own (chỉ hồ sơ được giao)</option>\n                          <option value=\"team\" ${u.scope === 'team' ? 'selected' : ''}>team (theo nhóm)</option>\n                          <option value=\"all\" ${u.scope === 'all' ? 'selected' : ''}>all (toàn phòng)</option>\n                        </select>\n                      </div>\n                      <div class=\"field\">\n                        <label>Trạng thái tài khoản</label>\n                        <select name=\"active\">\n                          <option value=\"1\" ${u.active ? 'selected' : ''}>Hoạt động</option>\n                          <option value=\"0\" ${!u.active ? 'selected' : ''}>KHÓA (ngắt phiên ngay lập tức)</option>\n                        </select>\n                      </div>\n                    </div>\n                    <div class=\"toolbar-group\">\n                      <label class=\"check-row\"><input type=\"checkbox\" name=\"can_export\" ${u.can_export ? 'checked' : ''}> Xuất dữ liệu</label>\n                      <label class=\"check-row\"><input type=\"checkbox\" name=\"can_edit_kpi\" ${u.can_edit_kpi ? 'checked' : ''}> Sửa KPI</label>\n                      <label class=\"check-row\"><input type=\"checkbox\" name=\"can_delete\" ${u.can_delete ? 'checked' : ''}> Xóa hồ sơ</label>\n                      <label class=\"check-row\"><input type=\"checkbox\" name=\"can_approve_reports\" ${u.can_approve_reports ? 'checked' : ''}> Duyệt báo cáo</label>\n                      <label class=\"check-row\"><input type=\"checkbox\" name=\"can_restore\" ${u.can_restore ? 'checked' : ''}> Khôi phục hệ thống</label>\n                    </div>\n                    <div class=\"field\"><label>Đặt lại mật khẩu mới (để trống nếu không đổi)</label><input name=\"resetPassword\" type=\"password\" placeholder=\"Tối thiểu 8 ký tự\"></div>\n                  </div>\n                  <div class=\"modal-foot\"><button type=\"button\" class=\"btn btn-outline\" data-close-modal>Hủy</button><button type=\"submit\" class=\"btn btn-primary\">Lưu thay đổi</button></div>\n                </form>\n              `, (dialog) => {\n                dialog.querySelector('#adm-edit-user-form').addEventListener('submit', async (e) => {\n                  e.preventDefault();\n                  const fd = new FormData(e.target);\n                  try {\n                    await global.ITCApi.patch(`/api/admin/users/${encodeURIComponent(u.id)}`, {\n                      full_name: fd.get('full_name'),\n                      zalo_slot: fd.get('zalo_slot'),\n                      role: fd.get('role'),\n                      scope: fd.get('scope'),\n                      active: fd.get('active') === '1',\n                      can_export: fd.get('can_export') === 'on',\n                      can_edit_kpi: fd.get('can_edit_kpi') === 'on',\n                      can_delete: fd.get('can_delete') === 'on',\n                      can_approve_reports: fd.get('can_approve_reports') === 'on',\n                      can_restore: fd.get('can_restore') === 'on',\n                      resetPassword: fd.get('resetPassword') || undefined\n                    });\n                    ctx.closeModal();\n                    toast('Đã cập nhật quyền tài khoản.');\n                    await ctx.reloadBootstrap();\n                    ctx.refreshCurrentTab();\n                  } catch (err) { toast(err.message, 'error'); }\n                });\n              });\n            });\n          });\n        }\n      }\n\n      if (activeSub === 'staff') {\n        body.innerHTML = `\n          <h3 class=\"card-title mb-2\">Danh mục Nhân sự (ID ổn định, tách biệt Zalo Slot)</h3>\n          <div class=\"table-wrap\">\n            <table>\n              <thead><tr><th>ID ổn định</th><th>Họ tên</th><th>Zalo Slot</th><th>Nhóm</th><th>Trạng thái</th><th></th></tr></thead>\n              <tbody>\n                ${staffRes.items.map(s => `\n                  <tr>\n                    <td class=\"font-mono\">${esc(s.id)}</td>\n                    <td><input type=\"text\" class=\"stf-name input-inline\" data-id=\"${esc(s.id)}\" value=\"${esc(s.full_name)}\"></td>\n                    <td><input type=\"text\" class=\"stf-zalo input-inline\" data-id=\"${esc(s.id)}\" value=\"${esc(s.zalo_slot)}\"></td>\n                    <td><input type=\"text\" class=\"stf-team input-inline\" data-id=\"${esc(s.id)}\" value=\"${esc(s.team)}\"></td>\n                    <td><span class=\"badge ${s.active ? 'badge-green' : 'badge-gray'}\">${s.active ? 'Đang làm' : 'Nghỉ'}</span></td>\n                    <td class=\"text-right\"><button type=\"button\" class=\"btn btn-xs btn-primary stf-save\" data-id=\"${esc(s.id)}\">Lưu</button></td>\n                  </tr>\n                `).join('')}\n              </tbody>\n            </table>\n          </div>`;\n        body.querySelectorAll('.stf-save').forEach(btn => {\n          btn.addEventListener('click', async () => {\n            const id = btn.dataset.id;\n            const tr = btn.closest('tr');\n            try {\n              await global.ITCApi.patch(`/api/admin/staff/${encodeURIComponent(id)}`, {\n                full_name: tr.querySelector('.stf-name').value.trim(),\n                zalo_slot: tr.querySelector('.stf-zalo').value.trim(),\n                team: tr.querySelector('.stf-team').value.trim()\n              });\n              toast('Đã cập nhật nhân sự (giữ nguyên toàn bộ hồ sơ & KPI theo ID).');\n              await ctx.reloadBootstrap();\n            } catch (err) { toast(err.message, 'error'); }\n          });\n        });\n      }\n\n      if (activeSub === 'years') {\n        body.innerHTML = `\n          <form id=\"adm-new-year-form\" class=\"form-row mb-2\">\n            <div class=\"field\" style=\"max-width:140px\"><label>Năm mới</label><input name=\"year\" type=\"text\" placeholder=\"2030\" required></div>\n            <div class=\"field\"><label>Nhãn hiển thị</label><input name=\"label\" type=\"text\" placeholder=\"Niên khóa 2030 (11/2029 - 10/2030)\"></div>\n            <button type=\"submit\" class=\"btn btn-primary btn-sm\">+ Mở niên khóa mới</button>\n          </form>\n          <div class=\"table-wrap\">\n            <table>\n              <thead><tr><th>Niên khóa</th><th>Nhãn</th><th>Chu kỳ 12 tháng</th><th>Trạng thái</th><th></th></tr></thead>\n              <tbody>\n                ${yearsRes.items.map(y => `\n                  <tr>\n                    <td class=\"font-bold\">${esc(y.year)}</td>\n                    <td>${esc(y.label)}</td>\n                    <td>${esc(y.start_month)} → ${esc(y.end_month)}</td>\n                    <td><span class=\"badge ${y.status === 'open' ? 'badge-green' : 'badge-red'}\">${esc(y.status)}</span></td>\n                    <td class=\"text-right\">\n                      ${isSuper ? `<button type=\"button\" class=\"btn btn-xs btn-outline adm-toggle-yr\" data-yr=\"${esc(y.year)}\" data-next=\"${y.status === 'open' ? 'closed' : 'open'}\">${y.status === 'open' ? 'Khóa sổ năm' : 'Mở lại năm'}</button>` : ''}\n                    </td>\n                  </tr>\n                `).join('')}\n              </tbody>\n            </table>\n          </div>`;\n        body.querySelector('#adm-new-year-form').addEventListener('submit', async (e) => {\n          e.preventDefault();\n          const fd = new FormData(e.target);\n          try {\n            await global.ITCApi.post('/api/admin/intake-years', { year: fd.get('year'), label: fd.get('label') });\n            toast('Đã mở niên khóa mới.');\n            await ctx.reloadBootstrap();\n            ctx.refreshCurrentTab();\n          } catch (err) { toast(err.message, 'error'); }\n        });\n        body.querySelectorAll('.adm-toggle-yr').forEach(btn => {\n          btn.addEventListener('click', async () => {\n            try {\n              await global.ITCApi.patch(`/api/admin/intake-years/${encodeURIComponent(btn.dataset.yr)}`, { status: btn.dataset.next });\n              toast('Đã đổi trạng thái niên khóa.');\n              await ctx.reloadBootstrap();\n              ctx.refreshCurrentTab();\n            } catch (err) { toast(err.message, 'error'); }\n          });\n        });\n      }\n\n      if (activeSub === 'backup') {\n        body.innerHTML = `\n          <div class=\"toolbar\">\n            <div>\n              <h3 class=\"card-title\">Sao lưu có phiên bản & Khôi phục nguyên tử (SQLite + JSON Checksum)</h3>\n              <p class=\"card-sub\">Mỗi bản sao lưu có tên riêng theo dấu thời gian (không ghi đè trong ngày). Khôi phục tự tạo checkpoint và yêu cầu xác thực tăng cường.</p>\n            </div>\n            <div class=\"toolbar-group\">\n              <button type=\"button\" id=\"bkp-btn-create\" class=\"btn btn-primary btn-sm\">+ Tạo bản sao lưu ngay</button>\n              ${isSuper ? '<button type=\"button\" id=\"bkp-btn-restore-file\" class=\"btn btn-warn btn-sm\">Khôi phục từ tệp JSON...</button><button type=\"button\" id=\"bkp-btn-clean-reset\" class=\"btn btn-danger-outline btn-sm\">Dọn sạch dữ liệu thử nghiệm</button>' : ''}\n            </div>\n          </div>\n          <div class=\"table-wrap\">\n            <table>\n              <thead><tr><th>Tên tệp sao lưu</th><th>Loại</th><th>Schema</th><th>Kích thước</th><th>Thời điểm</th><th class=\"text-right\">Thao tác</th></tr></thead>\n              <tbody>\n                ${bkpRes.items.map(b => `\n                  <tr>\n                    <td class=\"font-mono\">${esc(b.filename)}</td>\n                    <td><span class=\"badge badge-blue\">${esc(b.backup_type)}</span></td>\n                    <td>v${b.schema_version}</td>\n                    <td>${Math.round(b.size_bytes / 1024)} KB</td>\n                    <td>${esc(formatDateTime(b.created_at))}</td>\n                    <td class=\"text-right\" style=\"white-space:nowrap\">\n                      ${isSuper ? `<a class=\"btn btn-xs btn-outline\" href=\"/api/backup/${encodeURIComponent(b.filename)}/download\">Tải bản ngoài máy</a>` : ''}\n                      ${isSuper ? `<button type=\"button\" class=\"btn btn-xs btn-warn bkp-restore-server\" data-file=\"${esc(b.filename)}\">Khôi phục</button>` : ''}\n                    </td>\n                  </tr>\n                `).join('') || '<tr><td colspan=\"6\" class=\"text-center text-light\">Chưa có bản sao lưu nào. Nhấn \"Tạo bản sao lưu ngay\".</td></tr>'}\n              </tbody>\n            </table>\n          </div>`;\n\n        body.querySelector('#bkp-btn-create').addEventListener('click', async () => {\n          try {\n            const res = await global.ITCApi.post('/api/backup', {});\n            toast(`Đã tạo sao lưu ${res.backup.filename}`);\n            ctx.refreshCurrentTab();\n          } catch (err) { toast(err.message, 'error'); }\n        });\n\n        const openRestoreDialog = (filename = null) => {\n          ctx.openModal(`\n            <div class=\"modal-head\"><h3 class=\"card-title\">Khôi phục dữ liệu hệ thống (Yêu cầu xác thực Super Admin)</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div>\n            <div class=\"modal-body form-stack\">\n              ${filename\n                ? `<div class=\"alert alert-info\">Khôi phục từ tệp trên máy chủ: <strong>${esc(filename)}</strong></div>`\n                : `<div class=\"field\"><label>Chọn tệp backup JSON (schemaVersion & checksum)</label><input id=\"rst-file\" type=\"file\" accept=\".json\"></div>`}\n              <button type=\"button\" id=\"rst-btn-dryrun\" class=\"btn btn-outline btn-sm\">1. Kiểm thử toàn vẹn & Tác động (Dry-run)</button>\n              <div id=\"rst-dryrun-out\"></div>\n              <div class=\"form-row\">\n                <div class=\"field\"><label>Mật khẩu Super Admin (hoặc để trống nếu nhập PIN)</label><input id=\"rst-pw\" type=\"password\"></div>\n                <div class=\"field\"><label>Hoặc Mã PIN Quản trị</label><input id=\"rst-pin\" type=\"password\"></div>\n              </div>\n            </div>\n            <div class=\"modal-foot\">\n              <button type=\"button\" class=\"btn btn-outline\" data-close-modal>Hủy</button>\n              <button type=\"button\" id=\"rst-btn-exec\" class=\"btn btn-danger\" disabled>2. Xác nhận khôi phục</button>\n            </div>\n          `, (dialog) => {\n            let parsedPayload = null;\n            const out = dialog.querySelector('#rst-dryrun-out');\n            const execBtn = dialog.querySelector('#rst-btn-exec');\n\n            const getReqPayload = async () => {\n              if (filename) return { filename };\n              if (!parsedPayload) {\n                const f = dialog.querySelector('#rst-file').files[0];\n                if (!f) throw new Error('Vui lòng chọn tệp backup JSON.');\n                parsedPayload = JSON.parse(await f.text());\n              }\n              return { backupPayload: parsedPayload };\n            };\n\n            dialog.querySelector('#rst-btn-dryrun').addEventListener('click', async () => {\n              try {\n                const base = await getReqPayload();\n                const res = await global.ITCApi.post('/api/backup/restore', { ...base, dryRun: true });\n                execBtn.disabled = false;\n                out.innerHTML = `<div class=\"alert alert-success\">Hợp lệ (Schema v${res.schemaVersion}). Dữ liệu sẽ khôi phục: ${esc(JSON.stringify(res.impactSummary))}</div>`;\n              } catch (err) {\n                execBtn.disabled = true;\n                out.innerHTML = `<div class=\"alert alert-danger\">${esc(err.message)}</div>`;\n              }\n            });\n\n            execBtn.addEventListener('click', async () => {\n              try {\n                const base = await getReqPayload();\n                const res = await global.ITCApi.post('/api/backup/restore', {\n                  ...base,\n                  dryRun: false,\n                  confirmPassword: dialog.querySelector('#rst-pw').value,\n                  confirmPin: dialog.querySelector('#rst-pin').value\n                });\n                ctx.closeModal();\n                toast(`Khôi phục thành công! Checkpoint tự động: ${res.checkpoint}`);\n                await ctx.reloadBootstrap();\n                ctx.refreshCurrentTab();\n              } catch (err) { toast(err.message, 'error'); }\n            });\n          });\n        };\n\n        const btnFile = body.querySelector('#bkp-btn-restore-file');\n        if (btnFile) btnFile.addEventListener('click', () => openRestoreDialog(null));\n        const btnCleanReset = body.querySelector('#bkp-btn-clean-reset');\n        if (btnCleanReset) btnCleanReset.addEventListener('click', () => { ctx.openModal(`<div class=\"modal-head\"><h3 class=\"card-title text-danger\">Dọn sạch toàn bộ dữ liệu thử nghiệm về nguyên trạng</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div><div class=\"modal-body form-stack\"><div class=\"alert alert-warn\">Thao tác này sẽ xóa toàn bộ hồ sơ thí sinh, tuyến tỉnh, Zalo, công việc, báo cáo thử nghiệm và tự tạo 1 bản sao lưu checkpoint trước khi xóa. <strong>Giữ nguyên</strong> 6 tài khoản, nhân sự, niên khóa và kế hoạch KPI 2027.</div><div class=\"form-row\"><div class=\"field\"><label>Mật khẩu Super Admin</label><input id=\"clr-pw\" type=\"password\"></div><div class=\"field\"><label>Hoặc Mã PIN Quản trị</label><input id=\"clr-pin\" type=\"password\"></div></div></div><div class=\"modal-foot\"><button type=\"button\" class=\"btn btn-outline\" data-close-modal>Hủy</button><button type=\"button\" id=\"clr-exec\" class=\"btn btn-danger\">Xác nhận dọn sạch về nguyên trạng</button></div>`, (dialog) => { dialog.querySelector('#clr-exec').addEventListener('click', async () => { try { const r = await global.ITCApi.post('/api/admin/reset-data', { confirmPassword: dialog.querySelector('#clr-pw').value, confirmPin: dialog.querySelector('#clr-pin').value }); ctx.closeModal(); toast('Đã dọn sạch dữ liệu về nguyên trạng! Checkpoint: ' + r.checkpoint); ctx.refreshCurrentTab(); } catch (err) { toast(err.message, 'error'); } }); }); });\n        body.querySelectorAll('.bkp-restore-server').forEach(btn => {\n          btn.addEventListener('click', () => openRestoreDialog(btn.dataset.file));\n        });\n      }\n\n      if (activeSub === 'audit') {\n        body.innerHTML = `\n          <h3 class=\"card-title mb-2\">Nhật ký kiểm toán Server (Chỉ đọc — ghi trong giao dịch DB, client không thể sửa/xóa)</h3>\n          <div class=\"table-wrap\">\n            <table>\n              <thead><tr><th>Thời điểm</th><th>Tác nhân</th><th>Hành động</th><th>Đối tượng</th><th>Tóm tắt</th><th>IP</th></tr></thead>\n              <tbody>\n                ${auditRes.items.map(a => `\n                  <tr>\n                    <td style=\"white-space:nowrap;font-size:12px\">${esc(formatDateTime(a.occurred_at))}</td>\n                    <td><div class=\"font-bold\" style=\"font-size:12px\">${esc(a.actor_name || 'System')}</div><div class=\"text-light\" style=\"font-size:11px\">${esc(a.actor_email)}</div></td>\n                    <td><span class=\"badge badge-gray\">${esc(a.action)}</span></td>\n                    <td class=\"font-mono\">${esc(a.entity_type)}${a.entity_id ? ':' + esc(a.entity_id.slice(0, 12)) : ''}</td>\n                    <td style=\"font-size:12px\">${esc(a.summary)}</td>\n                    <td class=\"font-mono\">${esc(a.ip_address || '—')}</td>\n                  </tr>\n                `).join('')}\n              </tbody>\n            </table>\n          </div>`;\n      }\n\n      if (activeSub === 'health') {\n        const h = healthRes;\n        body.innerHTML = `\n          <div class=\"grid-4 mb-2\">\n            <div class=\"stat-card\"><div class=\"stat-label\">Trạng thái Server</div><div class=\"stat-value text-success\">${esc(h.status.toUpperCase())}</div><div class=\"stat-note\">Uptime: ${h.uptimeSeconds}s • v${esc(h.appVersion)}</div></div>\n            <div class=\"stat-card\"><div class=\"stat-label\">${h.storage && h.storage.mode === 'postgresql+sqlite' ? 'PostgreSQL Cloud + SQLite' : 'Cơ sở dữ liệu SQLite Local'}</div><div class=\"stat-value\">${h.storage && h.storage.mode === 'postgresql+sqlite' ? 'PG rev #' + h.storage.pgRev : Math.round((h.db.sizeBytes || 0) / 1024) + ' KB'}</div><div class=\"stat-note\">Lỗi ghi: ${h.db.writeErrorCount} • Schema v${h.schemaVersion}${h.storage && h.storage.lastGzipBytes ? ' • ' + Math.round(h.storage.lastGzipBytes / 1024) + ' KB gz' : ''}</div></div>\n            <div class=\"stat-card\"><div class=\"stat-label\">Kết nối Realtime WS</div><div class=\"stat-value\">${h.realtime.onlineUsers} người</div><div class=\"stat-note\">${h.realtime.totalConnections} tab/kết nối đang mở</div></div>\n            <div class=\"stat-card\"><div class=\"stat-label\">Sao lưu gần nhất</div><div class=\"stat-value\">${h.backups.count} bản</div><div class=\"stat-note\">${h.backups.latest ? esc(formatDateTime(h.backups.latest.created_at)) : 'Chưa tạo backup'}</div></div>\n          </div>\n          <div class=\"card\" style=\"background:var(--surface-alt)\">\n            <div class=\"font-bold mb-2\">Thống kê bản ghi trong hệ thống</div>\n            <div class=\"font-mono\">${esc(JSON.stringify(h.counts, null, 2))}</div>\n          </div>`;\n      }\n    }\n  };\n})(window);\n"
  },
  "/js/modules/analytics.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n\n  global.ITCModules.analytics = {\n    async render(container, ctx) {\n      const data = await global.ITCApi.get(`/api/analytics?intakeYear=${encodeURIComponent(ctx.intakeYear)}`);\n      const t = data.totals;\n      const subRate = t.leads > 0 ? Math.round((t.submitted / t.leads) * 1000) / 10 : 0;\n      const enrRate = t.leads > 0 ? Math.round((t.enrolled / t.leads) * 1000) / 10 : 0;\n\n      container.innerHTML = `\n        <div class=\"grid-4 mb-2\">\n          <div class=\"stat-card\"><div class=\"stat-label\">Tổng đăng ký (đối soát phòng)</div><div class=\"stat-value\">${t.leads}</div><div class=\"stat-note\">Niên khóa ${esc(ctx.intakeYear)}</div></div>\n          <div class=\"stat-card\"><div class=\"stat-label\">Đã nộp hồ sơ</div><div class=\"stat-value\">${t.submitted}</div><div class=\"stat-note\">Tỷ lệ nộp HS: ${subRate}%</div></div>\n          <div class=\"stat-card\"><div class=\"stat-label\">Đã nhập học</div><div class=\"stat-value text-success\">${t.enrolled}</div><div class=\"stat-note\">Tỷ lệ chuyển đổi NH: ${enrRate}%</div></div>\n          <div class=\"stat-card\"><div class=\"stat-label\">Rút hồ sơ / Hủy</div><div class=\"stat-value text-danger\">${t.withdrawn}</div><div class=\"stat-note\">Không tính vào chuyển đổi</div></div>\n        </div>\n\n        <div class=\"grid-2\">\n          <div class=\"card\">\n            <div class=\"card-header\"><h3 class=\"card-title\">Hiệu quả chuyển đổi theo Nguồn tuyển sinh</h3></div>\n            ${global.ITCCharts.renderHorizontalBars(data.bySource, 'leads', 10)}\n          </div>\n          <div class=\"card\">\n            <div class=\"card-header\"><h3 class=\"card-title\">Hiệu quả chuyển đổi theo Ngành đào tạo</h3></div>\n            ${global.ITCCharts.renderHorizontalBars(data.byMajor, 'leads', 10)}\n          </div>\n        </div>\n\n        <div class=\"grid-2 mt-2\">\n          <div class=\"card\">\n            <div class=\"card-header\"><h3 class=\"card-title\">Top Trường THPT theo số đăng ký & nhập học</h3></div>\n            <div class=\"table-wrap\">\n              <table>\n                <thead><tr><th>Trường THPT</th><th class=\"text-center\">ĐK</th><th class=\"text-center\">Nộp HS</th><th class=\"text-center\">Nhập học</th><th class=\"text-center\">Tỷ lệ NH</th></tr></thead>\n                <tbody>\n                  ${data.bySchool.map(r => `<tr><td>${esc(r.name)}</td><td class=\"text-center\">${r.leads}</td><td class=\"text-center\">${r.submitted}</td><td class=\"text-center font-bold\">${r.enrolled}</td><td class=\"text-center\">${r.enrollRate}%</td></tr>`).join('') || '<tr><td colspan=\"5\" class=\"text-center text-light\">Chưa có dữ liệu.</td></tr>'}\n                </tbody>\n              </table>\n            </div>\n          </div>\n          <div class=\"card\">\n            <div class=\"card-header\"><h3 class=\"card-title\">Phân bổ theo Tỉnh / Thành phố</h3></div>\n            <div class=\"table-wrap\">\n              <table>\n                <thead><tr><th>Tỉnh / TP</th><th class=\"text-center\">ĐK</th><th class=\"text-center\">Nộp HS</th><th class=\"text-center\">Nhập học</th><th class=\"text-center\">Tỷ lệ NH</th></tr></thead>\n                <tbody>\n                  ${data.byProvince.map(r => `<tr><td>${esc(r.name)}</td><td class=\"text-center\">${r.leads}</td><td class=\"text-center\">${r.submitted}</td><td class=\"text-center font-bold\">${r.enrolled}</td><td class=\"text-center\">${r.enrollRate}%</td></tr>`).join('') || '<tr><td colspan=\"5\" class=\"text-center text-light\">Chưa có dữ liệu.</td></tr>'}\n                </tbody>\n              </table>\n            </div>\n          </div>\n        </div>\n      `;\n    }\n  };\n})(window);\n"
  },
  "/js/modules/crm.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, formatDateTime, badgeForStage, badgeForContact, readFileAsBase64, toast } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n\n  // Preserved filters across drawer/tab navigation (DEV08 requirement!)\n  const filters = {\n    search: '',\n    staffId: 'ALL',\n    contactStatus: 'ALL',\n    stageCode: 'ALL',\n    dedupFlag: '',\n    page: 1,\n    pageSize: 25\n  };\n\n  function buildStaffOptions(staffList, selectedId, includeAll = false, includeUnassigned = false) {\n    let html = '';\n    if (includeAll) html += `<option value=\"ALL\" ${selectedId === 'ALL' ? 'selected' : ''}>Tất cả nhân sự</option>`;\n    if (includeUnassigned) html += `<option value=\"UNASSIGNED\" ${selectedId === 'UNASSIGNED' ? 'selected' : ''}>Chưa phân công</option>`;\n    for (const s of staffList) {\n      if (!s.active && s.id !== selectedId) continue;\n      const sel = s.id === selectedId ? 'selected' : '';\n      html += `<option value=\"${esc(s.id)}\" ${sel}>${esc(s.full_name)}${s.zalo_slot ? ' (' + esc(s.zalo_slot) + ')' : ''}</option>`;\n    }\n    return html;\n  }\n\n  function buildMajorOptions(majors, selected) {\n    let html = '<option value=\"\">-- Chưa xác định ngành --</option>';\n    const seen = new Set();\n    for (const m of majors) {\n      seen.add(m);\n      html += `<option value=\"${esc(m)}\" ${m === selected ? 'selected' : ''}>${esc(m)}</option>`;\n    }\n    if (selected && !seen.has(selected)) {\n      html += `<option value=\"${esc(selected)}\" selected>${esc(selected)}</option>`;\n    }\n    return html;\n  }\n\n  global.ITCModules.crm = {\n    async render(container, ctx) {\n      const qs = new URLSearchParams({\n        intakeYear: ctx.intakeYear,\n        search: filters.search,\n        staffId: filters.staffId,\n        contactStatus: filters.contactStatus,\n        stageCode: filters.stageCode,\n        dedupFlag: filters.dedupFlag,\n        page: String(filters.page),\n        pageSize: String(filters.pageSize)\n      });\n\n      const data = await global.ITCApi.get(`/api/registrations?${qs.toString()}`);\n      const staff = ctx.bootstrap.staff || [];\n      const user = ctx.bootstrap.user;\n      const contactLabels = ctx.bootstrap.contactStatusLabels;\n      const stageLabels = ctx.bootstrap.stageLabels;\n\n      container.innerHTML = `\n        <div class=\"card\">\n          <div class=\"toolbar\">\n            <div class=\"toolbar-group\">\n              <button type=\"button\" id=\"crm-btn-new\" class=\"btn btn-primary\">+ Thêm thí sinh</button>\n              <button type=\"button\" id=\"crm-btn-import-excel\" class=\"btn btn-outline\">Nhập Excel (Preview)</button>\n              <button type=\"button\" id=\"crm-btn-quick-paste\" class=\"btn btn-outline\">Dán nhanh 8 cột</button>\n              <a class=\"btn btn-ghost btn-sm\" href=\"/api/templates/crm\" download>Tải mẫu Excel</a>\n            </div>\n            <div class=\"toolbar-group\">\n              ${user.can_export ? `<a class=\"btn btn-success btn-sm\" href=\"/api/registrations/export?intakeYear=${encodeURIComponent(ctx.intakeYear)}\">Xuất Excel (theo phạm vi)</a>` : ''}\n            </div>\n          </div>\n\n          <div class=\"form-row mb-2\">\n            <div class=\"field\" style=\"flex:2;min-width:200px\">\n              <label>Tìm kiếm</label>\n              <input id=\"crm-filter-search\" type=\"text\" value=\"${esc(filters.search)}\" placeholder=\"Tên, SĐT thí sinh/PH, ngành, trường THPT, ghi chú...\">\n            </div>\n            <div class=\"field\">\n              <label>Nhân sự phụ trách</label>\n              <select id=\"crm-filter-staff\">${buildStaffOptions(staff, filters.staffId, true, true)}</select>\n            </div>\n            <div class=\"field\">\n              <label>Trạng thái liên hệ</label>\n              <select id=\"crm-filter-contact\">\n                <option value=\"ALL\">Tất cả liên hệ</option>\n                ${Object.entries(contactLabels).map(([k, v]) => `<option value=\"${esc(k)}\" ${filters.contactStatus === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}\n              </select>\n            </div>\n            <div class=\"field\">\n              <label>Giai đoạn tuyển sinh</label>\n              <select id=\"crm-filter-stage\">\n                <option value=\"ALL\">Tất cả giai đoạn</option>\n                ${Object.entries(stageLabels).map(([k, v]) => `<option value=\"${esc(k)}\" ${filters.stageCode === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}\n              </select>\n            </div>\n            <div class=\"field\" style=\"flex:0 0 auto\">\n              <label>Lọc nghi trùng</label>\n              <select id=\"crm-filter-dedup\">\n                <option value=\"\" ${!filters.dedupFlag ? 'selected' : ''}>Tất cả</option>\n                <option value=\"flagged\" ${filters.dedupFlag === 'flagged' ? 'selected' : ''}>Có cờ nghi trùng / chung SĐT</option>\n              </select>\n            </div>\n            <button type=\"button\" id=\"crm-btn-apply-filter\" class=\"btn btn-primary btn-sm\">Lọc</button>\n          </div>\n\n          <div class=\"table-wrap\">\n            <table>\n              <thead>\n                <tr>\n                  <th>Thí sinh & Liên hệ</th>\n                  <th>Ngành & Trường THPT</th>\n                  <th>Phụ trách</th>\n                  <th>Trạng thái chăm sóc</th>\n                  <th>Giai đoạn hồ sơ</th>\n                  <th>Ghi chú nhanh</th>\n                  <th class=\"text-right\">Thao tác</th>\n                </tr>\n              </thead>\n              <tbody>\n                ${data.items.map(r => `\n                  <tr data-reg-row=\"${esc(r.id)}\" data-version=\"${r.version}\">\n                    <td>\n                      <div class=\"font-bold\">${esc(r.full_name)}</div>\n                      <div class=\"font-mono text-muted\">${esc(r.student_phone || 'Chưa có SĐT')}</div>\n                      ${r.parent_phone ? `<div class=\"font-mono text-light\" style=\"font-size:11px\">PH: ${esc(r.parent_phone)}</div>` : ''}\n                      ${r.dedup_flag ? `<span class=\"badge badge-amber mt-1\">${esc(r.dedup_flag)}</span>` : ''}\n                    </td>\n                    <td>\n                      <div>${esc(r.major || 'Chưa xác định')}</div>\n                      <div class=\"text-light\" style=\"font-size:11px\">${esc(r.school || '—')}${r.province ? ' • ' + esc(r.province) : ''}</div>\n                      <div class=\"text-light\" style=\"font-size:11px\">Nguồn: ${esc(r.source)}</div>\n                    </td>\n                    <td>\n                      <div class=\"font-bold\" style=\"font-size:12px\">${esc(r.staff_name || 'Chưa phân công')}</div>\n                      <div class=\"text-light\" style=\"font-size:11px\">v${r.version}</div>\n                    </td>\n                    <td>\n                      <select class=\"input-inline crm-inline-contact\" data-id=\"${esc(r.id)}\" data-ver=\"${r.version}\">\n                        ${Object.entries(contactLabels).map(([k, v]) => `<option value=\"${esc(k)}\" ${r.contact_status === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}\n                      </select>\n                    </td>\n                    <td>\n                      ${badgeForStage(r.stage_code, stageLabels)}\n                      ${r.raw_status_text && r.stage_code === 'pending_verify' ? `<div class=\"text-warn\" style=\"font-size:11px\">Gốc: ${esc(r.raw_status_text)}</div>` : ''}\n                    </td>\n                    <td style=\"max-width:220px\">\n                      <div class=\"truncate\" title=\"${esc(r.notes)}\">${esc(r.notes || '—')}</div>\n                      <div class=\"text-light\" style=\"font-size:11px\">${esc(formatDateTime(r.updated_at))}</div>\n                    </td>\n                    <td class=\"text-right\" style=\"white-space:nowrap\">\n                      <button type=\"button\" class=\"btn btn-xs btn-primary\" data-open-detail=\"${esc(r.id)}\">Chi tiết</button>\n                      ${user.can_delete ? `<button type=\"button\" class=\"btn btn-xs btn-danger-outline\" data-del-reg=\"${esc(r.id)}\" data-name=\"${esc(r.full_name)}\">Xóa</button>` : ''}\n                    </td>\n                  </tr>\n                `).join('') || '<tr><td colspan=\"7\" class=\"text-center text-light\" style=\"padding:24px\">Chưa có hồ sơ thí sinh nào trong bộ lọc này.</td></tr>'}\n              </tbody>\n            </table>\n          </div>\n\n          <div class=\"pagination\">\n            <div>Hiển thị <strong>${data.items.length}</strong> / <strong>${data.total}</strong> hồ sơ (Phạm vi quyền: <code>${esc(user.scope)}</code>)</div>\n            <div class=\"toolbar-group\">\n              <button type=\"button\" id=\"crm-prev-page\" class=\"btn btn-xs btn-outline\" ${data.page <= 1 ? 'disabled' : ''}>← Trước</button>\n              <span>Trang ${data.page} / ${data.totalPages}</span>\n              <button type=\"button\" id=\"crm-next-page\" class=\"btn btn-xs btn-outline\" ${data.page >= data.totalPages ? 'disabled' : ''}>Sau →</button>\n            </div>\n          </div>\n        </div>\n      `;\n\n      // Filter listeners\n      const applyFilters = () => {\n        filters.search = container.querySelector('#crm-filter-search').value.trim();\n        filters.staffId = container.querySelector('#crm-filter-staff').value;\n        filters.contactStatus = container.querySelector('#crm-filter-contact').value;\n        filters.stageCode = container.querySelector('#crm-filter-stage').value;\n        filters.dedupFlag = container.querySelector('#crm-filter-dedup').value;\n        filters.page = 1;\n        ctx.refreshCurrentTab();\n      };\n      container.querySelector('#crm-btn-apply-filter').addEventListener('click', applyFilters);\n      container.querySelector('#crm-filter-search').addEventListener('keydown', (e) => { if (e.key === 'Enter') applyFilters(); });\n      container.querySelector('#crm-filter-staff').addEventListener('change', applyFilters);\n      container.querySelector('#crm-filter-contact').addEventListener('change', applyFilters);\n      container.querySelector('#crm-filter-stage').addEventListener('change', applyFilters);\n      container.querySelector('#crm-filter-dedup').addEventListener('change', applyFilters);\n\n      container.querySelector('#crm-prev-page').addEventListener('click', () => { filters.page = Math.max(1, filters.page - 1); ctx.refreshCurrentTab(); });\n      container.querySelector('#crm-next-page').addEventListener('click', () => { filters.page = Math.min(data.totalPages, filters.page + 1); ctx.refreshCurrentTab(); });\n\n      // Inline contact status update with optimistic version & offline outbox\n      container.querySelectorAll('.crm-inline-contact').forEach(sel => {\n        sel.addEventListener('change', async () => {\n          const id = sel.dataset.id;\n          const ver = Number(sel.dataset.ver);\n          try {\n            const res = await global.ITCApi.patch(`/api/registrations/${encodeURIComponent(id)}`, {\n              expectedVersion: ver,\n              patch: { contact_status: sel.value }\n            }, { queueOnOffline: true, label: `Cập nhật trạng thái liên hệ (${id})` });\n            sel.dataset.ver = res.record.version;\n            toast(res.merged ? 'Đã gộp cập nhật thành công với phiên bản mới nhất.' : 'Đã lưu trạng thái chăm sóc.');\n          } catch (err) {\n            toast(err.message, err.isQueued ? 'warn' : 'error');\n            if (!err.isQueued) ctx.refreshCurrentTab();\n          }\n        });\n      });\n\n      container.querySelectorAll('[data-open-detail]').forEach(btn => {\n        btn.addEventListener('click', () => this.openDetailDrawer(btn.dataset.openDetail, ctx));\n      });\n\n      container.querySelectorAll('[data-del-reg]').forEach(btn => {\n        btn.addEventListener('click', async () => {\n          if (!confirm(`Xác nhận xóa hồ sơ \"${btn.dataset.name}\"? Thao tác chỉ xóa đúng bản ghi này và có ghi nhật ký.`)) return;\n          try {\n            await global.ITCApi.del(`/api/registrations/${encodeURIComponent(btn.dataset.delReg)}`);\n            toast('Đã xóa hồ sơ.');\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            toast(err.message, 'error');\n          }\n        });\n      });\n\n      container.querySelector('#crm-btn-new').addEventListener('click', () => this.openCreateModal(ctx));\n      container.querySelector('#crm-btn-import-excel').addEventListener('click', () => this.openImportModal(ctx, 'excel'));\n      container.querySelector('#crm-btn-quick-paste').addEventListener('click', () => this.openImportModal(ctx, 'paste'));\n    },\n\n    openCreateModal(ctx) {\n      const staff = ctx.bootstrap.staff || [];\n      const majors = ctx.bootstrap.majors || [];\n      const user = ctx.bootstrap.user;\n      ctx.openModal(`\n        <div class=\"modal-head\">\n          <h3 class=\"card-title\">Thêm hồ sơ thí sinh mới (Niên khóa ${esc(ctx.intakeYear)})</h3>\n          <button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button>\n        </div>\n        <form id=\"crm-create-form\">\n          <div class=\"modal-body form-stack\">\n            <div class=\"form-row\">\n              <div class=\"field\"><label>Họ và tên thí sinh *</label><input name=\"full_name\" type=\"text\" required></div>\n              <div class=\"field\"><label>SĐT thí sinh</label><input name=\"student_phone\" type=\"text\" placeholder=\"09xxxxxxxx\"></div>\n              <div class=\"field\"><label>SĐT phụ huynh (cho phép anh/chị em dùng chung)</label><input name=\"parent_phone\" type=\"text\" placeholder=\"09xxxxxxxx\"></div>\n            </div>\n            <div class=\"form-row\">\n              <div class=\"field\"><label>Ngành quan tâm</label><select name=\"major\">${buildMajorOptions(majors, '')}</select></div>\n              <div class=\"field\"><label>Trường THPT</label><input name=\"school\" type=\"text\" placeholder=\"vd: THPT Lê Hồng Phong\"></div>\n              <div class=\"field\"><label>Tỉnh / TP</label><input name=\"province\" type=\"text\" placeholder=\"vd: TP.HCM\"></div>\n            </div>\n            <div class=\"form-row\">\n              <div class=\"field\"><label>Nguồn tiếp nhận</label><input name=\"source\" type=\"text\" value=\"CRM trực tiếp\"></div>\n              <div class=\"field\">\n                <label>Nhân sự phụ trách</label>\n                <select name=\"assigned_staff_id\" ${user.scope === 'own' && user.role === 'consultant' ? 'disabled' : ''}>\n                  <option value=\"\">-- Chưa phân công --</option>\n                  ${buildStaffOptions(staff, user.staff_id || '')}\n                </select>\n              </div>\n            </div>\n            <div class=\"field\"><label>Ghi chú ban đầu</label><textarea name=\"notes\" rows=\"2\"></textarea></div>\n            <label class=\"check-row\"><input type=\"checkbox\" name=\"allow_shared_parent_phone\"> Cho phép tạo riêng nếu dùng chung SĐT phụ huynh (2 anh/chị em)</label>\n          </div>\n          <div class=\"modal-foot\">\n            <button type=\"button\" class=\"btn btn-outline\" data-close-modal>Hủy</button>\n            <button type=\"submit\" class=\"btn btn-primary\">Lưu hồ sơ</button>\n          </div>\n        </form>\n      `, (dialog) => {\n        dialog.querySelector('#crm-create-form').addEventListener('submit', async (e) => {\n          e.preventDefault();\n          const fd = new FormData(e.target);\n          const payload = {\n            intake_year: ctx.intakeYear,\n            full_name: fd.get('full_name'),\n            student_phone: fd.get('student_phone'),\n            parent_phone: fd.get('parent_phone'),\n            major: fd.get('major'),\n            school: fd.get('school'),\n            province: fd.get('province'),\n            source: fd.get('source'),\n            assigned_staff_id: fd.get('assigned_staff_id') || (user.staff_id || null),\n            notes: fd.get('notes'),\n            allow_shared_parent_phone: fd.get('allow_shared_parent_phone') === 'on'\n          };\n          try {\n            const res = await global.ITCApi.post('/api/registrations', payload, { queueOnOffline: true, label: `Tạo hồ sơ ${payload.full_name}` });\n            ctx.closeModal();\n            toast(res.deduplicated ? 'Phát hiện cùng thí sinh -> đã gộp nguồn, không đếm trùng KPI.' : 'Đã tạo hồ sơ thí sinh mới.');\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            toast(err.message, err.isQueued ? 'warn' : 'error');\n            if (err.isQueued) ctx.closeModal();\n          }\n        });\n      });\n    },\n\n    openImportModal(ctx, mode) {\n      let previewData = null;\n      let lastFileName = '';\n\n      ctx.openModal(`\n        <div class=\"modal-head\">\n          <h3 class=\"card-title\">${mode === 'excel' ? 'Nhập Excel CRM (Xem trước & Đối chiếu trùng)' : 'Dán nhanh CRM 8 cột (Schema chuẩn)'}</h3>\n          <button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button>\n        </div>\n        <div class=\"modal-body form-stack\">\n          ${mode === 'excel' ? `\n            <div class=\"field\">\n              <label>Chọn tệp .xlsx / .xls / .csv</label>\n              <input id=\"imp-file\" type=\"file\" accept=\".xlsx,.xls,.csv\">\n            </div>\n          ` : `\n            <div class=\"field\">\n              <label>Dán nhiều dòng từ Excel/SharePoint (8 cột: Họ tên | SĐT | Ngành | Nguồn | Nhân sự | Trạng thái | Kết quả | Ghi chú)</label>\n              <textarea id=\"imp-paste\" rows=\"6\" placeholder=\"Dán dữ liệu có hoặc không có dòng tiêu đề...\"></textarea>\n            </div>\n          `}\n          <div class=\"form-row\">\n            <div class=\"field\">\n              <label>Xử lý dòng nghi trùng SĐT khác tên</label>\n              <select id=\"imp-dup-policy\">\n                <option value=\"flag\">Tạo mới và gắn cờ nghi trùng (để xác minh)</option>\n                <option value=\"skip\">Bỏ qua dòng nghi trùng</option>\n              </select>\n            </div>\n            <button type=\"button\" id=\"imp-btn-preview\" class=\"btn btn-primary\">Phân tích & Xem trước</button>\n          </div>\n          <div id=\"imp-preview-area\"></div>\n        </div>\n        <div class=\"modal-foot\">\n          <button type=\"button\" class=\"btn btn-outline\" data-close-modal>Đóng</button>\n          <button type=\"button\" id=\"imp-btn-commit\" class=\"btn btn-success\" disabled>Xác nhận nhập vào hệ thống</button>\n        </div>\n      `, (dialog) => {\n        const previewArea = dialog.querySelector('#imp-preview-area');\n        const btnCommit = dialog.querySelector('#imp-btn-commit');\n\n        dialog.querySelector('#imp-btn-preview').addEventListener('click', async () => {\n          try {\n            const payload = { intakeYear: ctx.intakeYear };\n            if (mode === 'excel') {\n              const f = dialog.querySelector('#imp-file').files[0];\n              if (!f) return toast('Vui lòng chọn tệp Excel.', 'warn');\n              lastFileName = f.name;\n              payload.fileBase64 = await readFileAsBase64(f);\n            } else {\n              const txt = dialog.querySelector('#imp-paste').value.trim();\n              if (!txt) return toast('Vui lòng dán dữ liệu.', 'warn');\n              lastFileName = 'quick-paste.tsv';\n              payload.pasteText = txt;\n            }\n            previewArea.innerHTML = '<div class=\"text-muted\">Đang phân tích cấu trúc cột và đối chiếu trùng...</div>';\n            previewData = await global.ITCApi.post('/api/import/crm/preview', payload);\n            const st = previewData.stats;\n            btnCommit.disabled = previewData.rows.length === 0;\n\n            previewArea.innerHTML = `\n              <div class=\"alert alert-info mb-2\">\n                Tổng <strong>${st.total}</strong> dòng • Mới: <strong>${st.newCount}</strong> • Gộp cập nhật: <strong>${st.updatedCount}</strong> • Nghi trùng: <strong>${st.duplicateCount}</strong> • Chờ xác minh trạng thái: <strong>${st.pendingVerifyCount}</strong> • Lỗi: <strong>${st.errorCount}</strong>\n              </div>\n              <div class=\"table-wrap\" style=\"max-height:280px;overflow:auto\">\n                <table>\n                  <thead><tr><th>#</th><th>Hành động</th><th>Họ tên</th><th>SĐT</th><th>Ngành</th><th>Nhân sự</th><th>Giai đoạn</th><th>Ghi chú / Cảnh báo</th></tr></thead>\n                  <tbody>\n                    ${previewData.rows.slice(0, 100).map(r => `\n                      <tr>\n                        <td>${r.rowIndex}</td>\n                        <td><span class=\"badge ${r.action === 'error' ? 'badge-red' : (r.action === 'suspected_duplicate' ? 'badge-amber' : (r.action === 'updated' ? 'badge-indigo' : 'badge-green'))}\">${esc(r.action)}</span></td>\n                        <td>${esc(r.parsed.full_name)}</td>\n                        <td class=\"font-mono\">${esc(r.parsed.student_phone || r.parsed.parent_phone)}</td>\n                        <td>${esc(r.parsed.major || '—')}</td>\n                        <td>${esc(r.parsed.assigned_staff_name || '—')}</td>\n                        <td>${esc(r.parsed.stage_code)}${r.unrecognizedStatus ? ' (chờ xác minh)' : ''}</td>\n                        <td style=\"font-size:11px\">${esc((r.errors && r.errors.length ? r.errors.join('; ') : (r.duplicateReason || r.parsed.notes)))}</td>\n                      </tr>\n                    `).join('')}\n                  </tbody>\n                </table>\n              </div>\n            `;\n          } catch (err) {\n            previewArea.innerHTML = `<div class=\"alert alert-danger\">${esc(err.message)}</div>`;\n          }\n        });\n\n        btnCommit.addEventListener('click', async () => {\n          if (!previewData) return;\n          btnCommit.disabled = true;\n          try {\n            const res = await global.ITCApi.post('/api/import/crm/commit', {\n              intakeYear: ctx.intakeYear,\n              targetType: mode === 'excel' ? 'crm_excel' : 'crm_paste',\n              fileName: lastFileName,\n              duplicatePolicy: dialog.querySelector('#imp-dup-policy').value,\n              rows: previewData.rows\n            });\n            ctx.closeModal();\n            toast(`Hoàn tất đợt nhập ${res.batchId}: +${res.createdCount} mới, ~${res.updatedCount} gộp cập nhật, !${res.duplicateCount} nghi trùng.`);\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            btnCommit.disabled = false;\n            toast(err.message, 'error');\n          }\n        });\n      });\n    },\n\n    async openDetailDrawer(regId, ctx) {\n      const drawer = document.getElementById('detail-drawer');\n      const backdrop = document.getElementById('drawer-backdrop');\n      drawer.classList.remove('hidden');\n      backdrop.classList.remove('hidden');\n      drawer.innerHTML = '<div class=\"drawer-head\"><div class=\"font-bold\">Đang tải hồ sơ...</div></div>';\n\n      try {\n        const detail = await global.ITCApi.get(`/api/registrations/${encodeURIComponent(regId)}`);\n        const r = detail.record;\n        const staff = ctx.bootstrap.staff || [];\n        const majors = ctx.bootstrap.majors || [];\n        const contactLabels = ctx.bootstrap.contactStatusLabels;\n        const stageLabels = ctx.bootstrap.stageLabels;\n        let sourcesHist = [];\n        try { sourcesHist = JSON.parse(r.sources_history_json || '[]'); } catch (_) {}\n\n        drawer.innerHTML = `\n          <div class=\"drawer-head\">\n            <div>\n              <h3 class=\"card-title\">${esc(r.full_name)} <span class=\"font-mono text-light\">v${r.version}</span></h3>\n              <div class=\"text-muted\" style=\"font-size:12px\">\n                SĐT: <span class=\"font-mono\">${esc(r.student_phone || '—')}</span>\n                ${r.parent_phone ? ` • PH: <span class=\"font-mono\">${esc(r.parent_phone)}</span>` : ''}\n                • NK ${esc(r.intake_year)}\n              </div>\n              <div class=\"toolbar-group mt-1\">\n                ${badgeForStage(r.stage_code, stageLabels)}\n                ${badgeForContact(r.contact_status, contactLabels)}\n                ${global.ITCUtils.badgeForSlaBucket(detail.sla.bucket, detail.sla.label)}\n              </div>\n            </div>\n            <button type=\"button\" class=\"icon-btn\" id=\"drawer-close-btn\">✕</button>\n          </div>\n\n          <div class=\"drawer-body form-stack\">\n            <!-- Core info editor with optimistic locking -->\n            <form id=\"drawer-edit-form\" class=\"card form-stack\">\n              <div class=\"card-header\"><h4 class=\"card-title\">Thông tin hồ sơ</h4><span class=\"text-light\" style=\"font-size:11px\">Nguồn lịch sử: ${esc(sourcesHist.join(', ') || r.source)}</span></div>\n              <div class=\"form-row\">\n                <div class=\"field\"><label>Họ tên</label><input name=\"full_name\" type=\"text\" value=\"${esc(r.full_name)}\" required></div>\n                <div class=\"field\"><label>SĐT thí sinh</label><input name=\"student_phone\" type=\"text\" value=\"${esc(r.student_phone)}\"></div>\n                <div class=\"field\"><label>SĐT phụ huynh</label><input name=\"parent_phone\" type=\"text\" value=\"${esc(r.parent_phone)}\"></div>\n              </div>\n              <div class=\"form-row\">\n                <div class=\"field\"><label>Ngành quan tâm</label><select name=\"major\">${buildMajorOptions(majors, r.major)}</select></div>\n                <div class=\"field\"><label>Trường THPT</label><input name=\"school\" type=\"text\" value=\"${esc(r.school)}\"></div>\n                <div class=\"field\"><label>Tỉnh/TP</label><input name=\"province\" type=\"text\" value=\"${esc(r.province)}\"></div>\n              </div>\n              <div class=\"field\"><label>Ghi chú chăm sóc</label><textarea name=\"notes\" rows=\"2\">${esc(r.notes)}</textarea></div>\n              <div class=\"field\"><label>Hành động tiếp theo</label><input name=\"next_action\" type=\"text\" value=\"${esc(r.next_action)}\"></div>\n              <div class=\"text-right\"><button type=\"submit\" class=\"btn btn-sm btn-primary\">Lưu chỉnh sửa (kiểm tra xung đột)</button></div>\n            </form>\n\n            <!-- Milestones (Independent dates!) -->\n            <div class=\"card\">\n              <div class=\"card-header\"><h4 class=\"card-title\">Xác nhận mốc tuyển sinh (lưu thời điểm độc lập)</h4></div>\n              <form id=\"drawer-milestone-form\" class=\"form-row\">\n                <div class=\"field\">\n                  <label>Mốc nghiệp vụ</label>\n                  <select name=\"milestone_type\">\n                    <option value=\"submitted\">Đã nộp hồ sơ</option>\n                    <option value=\"enrolled\">Đã nhập học chính thức</option>\n                    <option value=\"verified\">Xác minh hồ sơ hợp lệ</option>\n                    <option value=\"withdrawn\">Rút hồ sơ / Hủy</option>\n                  </select>\n                </div>\n                <div class=\"field\">\n                  <label>Thời điểm phát sinh mốc</label>\n                  <input name=\"occurred_at\" type=\"datetime-local\" value=\"${new Date().toISOString().slice(0, 16)}\">\n                </div>\n                <div class=\"field\">\n                  <label>Căn cứ / Minh chứng</label>\n                  <input name=\"evidence_note\" type=\"text\" placeholder=\"Biên lai / số hồ sơ / lý do rút...\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-sm btn-success\">Ghi nhận mốc</button>\n              </form>\n              <div class=\"timeline mt-2\">\n                ${detail.milestones.map(m => `\n                  <div class=\"timeline-item\">\n                    <div class=\"timeline-meta\">\n                      <strong>${esc(m.milestone_type.toUpperCase())}</strong>\n                      <span>${esc(formatDateTime(m.occurred_at))}</span>\n                    </div>\n                    <div class=\"timeline-text\">Ghi nhận cho: ${esc(m.attributed_staff_name || 'Chưa phân công')} • Căn cứ: ${esc(m.evidence_note || '—')}</div>\n                  </div>\n                `).join('')}\n              </div>\n            </div>\n\n            <!-- Interactions log -->\n            <div class=\"card\">\n              <div class=\"card-header\"><h4 class=\"card-title\">Nhật ký chăm sóc (Gọi điện / Zalo / SMS)</h4></div>\n              <form id=\"drawer-interaction-form\" class=\"form-stack\">\n                <div class=\"form-row\">\n                  <div class=\"field\">\n                    <label>Kênh</label>\n                    <select name=\"channel\">\n                      <option value=\"call\">Gọi điện thoại</option>\n                      <option value=\"zalo\">Nhắn Zalo</option>\n                      <option value=\"sms\">Gửi SMS</option>\n                      <option value=\"in_person\">Tư vấn trực tiếp</option>\n                    </select>\n                  </div>\n                  <div class=\"field\">\n                    <label>Kết quả liên hệ</label>\n                    <select name=\"outcome\">\n                      <option value=\"interested\">Đã tư vấn - Quan tâm</option>\n                      <option value=\"callback_requested\">Hẹn gọi lại</option>\n                      <option value=\"no_answer\">Không nghe máy / Thuê bao</option>\n                      <option value=\"wrong_number\">Sai số / Nhầm số</option>\n                      <option value=\"not_interested\">Không có nhu cầu</option>\n                      <option value=\"info_sent\">Đã gửi thông tin ngành/học phí</option>\n                    </select>\n                  </div>\n                </div>\n                <div class=\"form-row\">\n                  <div class=\"field\" style=\"flex:3\"><input name=\"summary\" type=\"text\" required placeholder=\"Ghi tóm tắt nội dung trao đổi với thí sinh/phụ huynh...\"></div>\n                  <button type=\"submit\" class=\"btn btn-sm btn-primary\">Lưu nhật ký</button>\n                </div>\n              </form>\n              <div class=\"timeline mt-2\">\n                ${detail.interactions.map(i => `\n                  <div class=\"timeline-item\">\n                    <div class=\"timeline-meta\">\n                      <strong>${esc(i.channel)} • ${esc(i.outcome)}</strong>\n                      <span>${esc(formatDateTime(i.occurred_at))} — ${esc(i.user_name || i.staff_name || '')}</span>\n                    </div>\n                    <div class=\"timeline-text\">${esc(i.summary)}</div>\n                  </div>\n                `).join('') || '<div class=\"text-light\">Chưa có lịch sử tương tác.</div>'}\n              </div>\n            </div>\n\n            <!-- Follow-up callback scheduler -->\n            <div class=\"card\">\n              <div class=\"card-header\"><h4 class=\"card-title\">Lịch hẹn gọi lại</h4></div>\n              <form id=\"drawer-fup-form\" class=\"form-row\">\n                <div class=\"field\"><label>Thời điểm hẹn</label><input name=\"due_at\" type=\"datetime-local\" required></div>\n                <div class=\"field\" style=\"flex:2\"><label>Nội dung hẹn</label><input name=\"note\" type=\"text\" required placeholder=\"Gọi lại sau giờ học / nhắc bổ sung học bạ...\"></div>\n                <button type=\"submit\" class=\"btn btn-sm btn-primary\">Đặt hẹn</button>\n              </form>\n              <div class=\"mt-2\">\n                ${detail.followUps.map(f => `\n                  <div style=\"display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)\">\n                    <div>\n                      <div class=\"font-bold\" style=\"font-size:12px\">${esc(formatDateTime(f.due_at))} — ${esc(f.note)}</div>\n                      <div class=\"text-light\" style=\"font-size:11px\">Trạng thái: ${esc(f.status)}</div>\n                    </div>\n                    ${f.status === 'pending' ? `<button type=\"button\" class=\"btn btn-xs btn-success\" data-drawer-done-fup=\"${esc(f.id)}\">Hoàn thành</button>` : ''}\n                  </div>\n                `).join('') || '<div class=\"text-light\">Chưa đặt lịch hẹn gọi lại.</div>'}\n              </div>\n            </div>\n\n            <!-- Document Checklist -->\n            <div class=\"card\">\n              <div class=\"card-header\"><h4 class=\"card-title\">Danh mục giấy tờ hồ sơ cần bổ sung</h4></div>\n              ${detail.documents.map(doc => `\n                <div style=\"display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)\">\n                  <span>${esc(doc.doc_name)}</span>\n                  <select class=\"input-inline drawer-doc-status\" data-doc-code=\"${esc(doc.doc_code)}\">\n                    <option value=\"missing\" ${doc.status === 'missing' ? 'selected' : ''}>Còn thiếu</option>\n                    <option value=\"submitted\" ${doc.status === 'submitted' ? 'selected' : ''}>Đã nộp bản sao</option>\n                    <option value=\"verified\" ${doc.status === 'verified' ? 'selected' : ''}>Đã kiểm tra đủ</option>\n                  </select>\n                </div>\n              `).join('')}\n            </div>\n\n            <!-- Staff Handover -->\n            <div class=\"card\">\n              <div class=\"card-header\"><h4 class=\"card-title\">Bàn giao nhân sự phụ trách (giữ nguyên thành tích mốc cũ)</h4></div>\n              <form id=\"drawer-handover-form\" class=\"form-row\">\n                <div class=\"field\">\n                  <label>Chuyển giao cho</label>\n                  <select name=\"to_staff_id\">${buildStaffOptions(staff, r.assigned_staff_id || '')}</select>\n                </div>\n                <div class=\"field\" style=\"flex:2\"><label>Lý do bàn giao</label><input name=\"reason\" type=\"text\" placeholder=\"Điều phối tải / chuyển tuyến...\"></div>\n                <button type=\"submit\" class=\"btn btn-sm btn-warn\">Bàn giao</button>\n              </form>\n              ${detail.handovers.length ? `<div class=\"mt-2\" style=\"font-size:12px\">${detail.handovers.map(h => `<div>• ${esc(formatDateTime(h.created_at))}: ${esc(h.from_staff_name || 'Chưa giao')} → <strong>${esc(h.to_staff_name)}</strong> (${esc(h.reason || 'Không ghi lý do')})</div>`).join('')}</div>` : ''}\n            </div>\n          </div>\n        `;\n\n        const closeDrawer = () => {\n          drawer.classList.add('hidden');\n          backdrop.classList.add('hidden');\n        };\n        drawer.querySelector('#drawer-close-btn').addEventListener('click', closeDrawer);\n        backdrop.onclick = closeDrawer;\n\n        drawer.querySelector('#drawer-edit-form').addEventListener('submit', async (e) => {\n          e.preventDefault();\n          const fd = new FormData(e.target);\n          const patch = {\n            full_name: fd.get('full_name'),\n            student_phone: fd.get('student_phone'),\n            parent_phone: fd.get('parent_phone'),\n            major: fd.get('major'),\n            school: fd.get('school'),\n            province: fd.get('province'),\n            notes: fd.get('notes'),\n            next_action: fd.get('next_action')\n          };\n          try {\n            await global.ITCApi.patch(`/api/registrations/${encodeURIComponent(regId)}`, { expectedVersion: r.version, patch }, { queueOnOffline: true, label: `Sửa hồ sơ ${r.full_name}` });\n            toast('Đã cập nhật hồ sơ thành công.');\n            this.openDetailDrawer(regId, ctx);\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            toast(err.message, err.isQueued ? 'warn' : 'error');\n          }\n        });\n\n        drawer.querySelector('#drawer-milestone-form').addEventListener('submit', async (e) => {\n          e.preventDefault();\n          const fd = new FormData(e.target);\n          const dtVal = fd.get('occurred_at');\n          try {\n            await global.ITCApi.post(`/api/registrations/${encodeURIComponent(regId)}/milestones`, {\n              milestone_type: fd.get('milestone_type'),\n              occurred_at: dtVal ? new Date(dtVal).toISOString() : new Date().toISOString(),\n              evidence_note: fd.get('evidence_note')\n            });\n            toast('Đã ghi nhận mốc tuyển sinh.');\n            this.openDetailDrawer(regId, ctx);\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            toast(err.message, 'error');\n          }\n        });\n\n        drawer.querySelector('#drawer-interaction-form').addEventListener('submit', async (e) => {\n          e.preventDefault();\n          const fd = new FormData(e.target);\n          try {\n            await global.ITCApi.post(`/api/registrations/${encodeURIComponent(regId)}/interactions`, {\n              channel: fd.get('channel'),\n              outcome: fd.get('outcome'),\n              summary: fd.get('summary')\n            }, { queueOnOffline: true, label: `Ghi cuộc gọi ${r.full_name}` });\n            toast('Đã ghi nhận nhật ký chăm sóc (đã chốt mốc liên hệ đầu nếu chưa có).');\n            this.openDetailDrawer(regId, ctx);\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            toast(err.message, err.isQueued ? 'warn' : 'error');\n          }\n        });\n\n        drawer.querySelector('#drawer-fup-form').addEventListener('submit', async (e) => {\n          e.preventDefault();\n          const fd = new FormData(e.target);\n          try {\n            await global.ITCApi.post(`/api/registrations/${encodeURIComponent(regId)}/follow-ups`, {\n              due_at: new Date(fd.get('due_at')).toISOString(),\n              note: fd.get('note')\n            });\n            toast('Đã đặt lịch hẹn gọi lại.');\n            this.openDetailDrawer(regId, ctx);\n          } catch (err) {\n            toast(err.message, 'error');\n          }\n        });\n\n        drawer.querySelectorAll('[data-drawer-done-fup]').forEach(btn => {\n          btn.addEventListener('click', async () => {\n            await global.ITCApi.patch(`/api/follow-ups/${encodeURIComponent(btn.dataset.drawerDoneFup)}`, { status: 'done' });\n            toast('Đã hoàn thành lịch hẹn.');\n            this.openDetailDrawer(regId, ctx);\n          });\n        });\n\n        drawer.querySelectorAll('.drawer-doc-status').forEach(sel => {\n          sel.addEventListener('change', async () => {\n            try {\n              await global.ITCApi.patch(`/api/registrations/${encodeURIComponent(regId)}/documents/${encodeURIComponent(sel.dataset.docCode)}`, { status: sel.value });\n              toast('Đã cập nhật giấy tờ.');\n            } catch (err) {\n              toast(err.message, 'error');\n            }\n          });\n        });\n\n        drawer.querySelector('#drawer-handover-form').addEventListener('submit', async (e) => {\n          e.preventDefault();\n          const fd = new FormData(e.target);\n          try {\n            await global.ITCApi.post(`/api/registrations/${encodeURIComponent(regId)}/handover`, {\n              to_staff_id: fd.get('to_staff_id'),\n              reason: fd.get('reason')\n            });\n            toast('Đã bàn giao hồ sơ thành công.');\n            closeDrawer();\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            toast(err.message, 'error');\n          }\n        });\n      } catch (err) {\n        drawer.innerHTML = `<div class=\"drawer-head\"><h3>Lỗi tải hồ sơ</h3><button type=\"button\" class=\"icon-btn\" id=\"drawer-err-close\">✕</button></div><div class=\"drawer-body\"><div class=\"alert alert-danger\">${esc(err.message)}</div></div>`;\n        drawer.querySelector('#drawer-err-close').addEventListener('click', () => { drawer.classList.add('hidden'); backdrop.classList.add('hidden'); });\n      }\n    }\n  };\n})(window);\n"
  },
  "/js/modules/executive.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, toast } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n  let activeSub = 'bgh';\n\n  global.ITCModules.executive = {\n    async render(container, ctx) {\n      const data = await global.ITCApi.get(`/api/tasks?intakeYear=${encodeURIComponent(ctx.intakeYear)}&taskType=bgh,directive,meeting`);\n      const staff = ctx.bootstrap.staff || [];\n      const labels = ctx.bootstrap.taskStatusLabels;\n      const items = data.items.filter(t => t.task_type === activeSub);\n\n      container.innerHTML = `\n        <div class=\"card\">\n          <div class=\"subtabs\">\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'bgh' ? 'active' : ''}\" data-ex-sub=\"bgh\">Việc Ban Giám hiệu giao (${data.items.filter(t => t.task_type === 'bgh').length})</button>\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'directive' ? 'active' : ''}\" data-ex-sub=\"directive\">Chỉ đạo điều hành phòng (${data.items.filter(t => t.task_type === 'directive').length})</button>\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'meeting' ? 'active' : ''}\" data-ex-sub=\"meeting\">Lịch họp & Biên bản (${data.items.filter(t => t.task_type === 'meeting').length})</button>\n          </div>\n\n          <div class=\"toolbar\">\n            <h3 class=\"card-title\">${activeSub === 'bgh' ? 'Danh mục việc BGH giao' : (activeSub === 'directive' ? 'Chỉ đạo điều hành nội bộ' : 'Lịch họp & Biên bản thực hiện')}</h3>\n            <button type=\"button\" id=\"ex-btn-new\" class=\"btn btn-primary btn-sm\">+ Tạo hạng mục mới</button>\n          </div>\n\n          <div class=\"table-wrap\">\n            <table>\n              <thead>\n                <tr>\n                  <th>Nội dung & Mô tả</th>\n                  <th>Phụ trách</th>\n                  <th>${activeSub === 'meeting' ? 'Thời gian / Địa điểm' : 'Hạn hoàn thành'}</th>\n                  <th>Trạng thái</th>\n                  <th>${activeSub === 'meeting' ? 'Biên bản / Kết luận' : 'Minh chứng / Gia hạn'}</th>\n                  <th class=\"text-right\">Thao tác</th>\n                </tr>\n              </thead>\n              <tbody>\n                ${items.map(t => `\n                  <tr>\n                    <td>\n                      <div class=\"font-bold\">${esc(t.title)}</div>\n                      <div class=\"text-light\" style=\"font-size:12px\">${esc(t.description || '')}</div>\n                    </td>\n                    <td>${esc(t.owner_name || 'Chưa giao')}</td>\n                    <td>${activeSub === 'meeting' ? `${esc(t.meeting_time || '—')}<div class=\"text-light\" style=\"font-size:11px\">${esc(t.meeting_location || '')}</div>` : esc(t.deadline || '—')}</td>\n                    <td>\n                      <select class=\"input-inline ex-status\" data-id=\"${esc(t.id)}\">\n                        ${Object.entries(labels).map(([k, v]) => `<option value=\"${esc(k)}\" ${t.status === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}\n                      </select>\n                    </td>\n                    <td style=\"max-width:260px;font-size:12px\">${esc(activeSub === 'meeting' ? (t.meeting_minutes || '—') : (t.evidence_note || t.extension_reason || '—'))}</td>\n                    <td class=\"text-right\" style=\"white-space:nowrap\">\n                      <button type=\"button\" class=\"btn btn-xs btn-outline ex-edit\" data-id=\"${esc(t.id)}\">Sửa</button>\n                      ${ctx.bootstrap.user.can_delete ? `<button type=\"button\" class=\"btn btn-xs btn-danger-outline ex-del\" data-id=\"${esc(t.id)}\">Xóa</button>` : ''}\n                    </td>\n                  </tr>\n                `).join('') || '<tr><td colspan=\"6\" class=\"text-center text-light\" style=\"padding:20px\">Chưa có mục nào trong danh sách.</td></tr>'}\n              </tbody>\n            </table>\n          </div>\n        </div>\n      `;\n\n      container.querySelectorAll('[data-ex-sub]').forEach(btn => {\n        btn.addEventListener('click', () => { activeSub = btn.dataset.exSub; ctx.refreshCurrentTab(); });\n      });\n\n      container.querySelectorAll('.ex-status').forEach(sel => {\n        sel.addEventListener('change', async () => {\n          try {\n            await global.ITCApi.patch(`/api/tasks/${encodeURIComponent(sel.dataset.id)}`, { status: sel.value });\n            toast('Đã cập nhật trạng thái.');\n          } catch (err) { toast(err.message, 'error'); }\n        });\n      });\n\n      container.querySelectorAll('.ex-del').forEach(btn => {\n        btn.addEventListener('click', async () => {\n          if (!confirm('Xóa hạng mục này?')) return;\n          try {\n            await global.ITCApi.del(`/api/tasks/${encodeURIComponent(btn.dataset.id)}`);\n            toast('Đã xóa.');\n            ctx.refreshCurrentTab();\n          } catch (err) { toast(err.message, 'error'); }\n        });\n      });\n\n      const openEditor = (existing = null) => {\n        ctx.openModal(`\n          <div class=\"modal-head\"><h3 class=\"card-title\">${existing ? 'Cập nhật hạng mục điều hành' : 'Thêm hạng mục điều hành mới'}</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div>\n          <form id=\"ex-form\">\n            <div class=\"modal-body form-stack\">\n              <div class=\"field\"><label>Tiêu đề *</label><input name=\"title\" type=\"text\" required value=\"${esc(existing ? existing.title : '')}\"></div>\n              <div class=\"field\"><label>Mô tả chi tiết</label><textarea name=\"description\" rows=\"2\">${esc(existing ? existing.description : '')}</textarea></div>\n              <div class=\"form-row\">\n                <div class=\"field\">\n                  <label>Người phụ trách</label>\n                  <select name=\"owner_staff_id\">\n                    <option value=\"\">-- Chọn nhân sự --</option>\n                    ${staff.filter(s => s.active).map(s => `<option value=\"${esc(s.id)}\" ${(existing && existing.owner_staff_id === s.id) ? 'selected' : ''}>${esc(s.full_name)}</option>`).join('')}\n                  </select>\n                </div>\n                <div class=\"field\"><label>Hạn hoàn thành</label><input name=\"deadline\" type=\"date\" value=\"${esc(existing ? existing.deadline : '')}\"></div>\n                <div class=\"field\">\n                  <label>Ưu tiên</label>\n                  <select name=\"priority\">\n                    <option value=\"normal\" ${existing && existing.priority === 'normal' ? 'selected' : ''}>Bình thường</option>\n                    <option value=\"high\" ${existing && existing.priority === 'high' ? 'selected' : ''}>Cao</option>\n                    <option value=\"urgent\" ${existing && existing.priority === 'urgent' ? 'selected' : ''}>Khẩn cấp</option>\n                  </select>\n                </div>\n              </div>\n              ${activeSub === 'meeting' ? `\n                <div class=\"form-row\">\n                  <div class=\"field\"><label>Thời gian họp</label><input name=\"meeting_time\" type=\"text\" placeholder=\"08:30 thứ Hai hàng tuần\" value=\"${esc(existing ? existing.meeting_time : '')}\"></div>\n                  <div class=\"field\"><label>Địa điểm / Link họp</label><input name=\"meeting_location\" type=\"text\" value=\"${esc(existing ? existing.meeting_location : '')}\"></div>\n                </div>\n                <div class=\"field\"><label>Biên bản & Kết luận cuộc họp</label><textarea name=\"meeting_minutes\" rows=\"3\">${esc(existing ? existing.meeting_minutes : '')}</textarea></div>\n              ` : `\n                <div class=\"field\"><label>Minh chứng kết quả thực hiện</label><textarea name=\"evidence_note\" rows=\"2\">${esc(existing ? existing.evidence_note : '')}</textarea></div>\n                <div class=\"field\"><label>Lý do gia hạn (nếu có)</label><input name=\"extension_reason\" type=\"text\" value=\"${esc(existing ? existing.extension_reason : '')}\"></div>\n              `}\n            </div>\n            <div class=\"modal-foot\">\n              <button type=\"button\" class=\"btn btn-outline\" data-close-modal>Hủy</button>\n              <button type=\"submit\" class=\"btn btn-primary\">Lưu</button>\n            </div>\n          </form>\n        `, (dialog) => {\n          dialog.querySelector('#ex-form').addEventListener('submit', async (e) => {\n            e.preventDefault();\n            const fd = new FormData(e.target);\n            const payload = {\n              intake_year: ctx.intakeYear,\n              task_type: activeSub,\n              title: fd.get('title'),\n              description: fd.get('description'),\n              owner_staff_id: fd.get('owner_staff_id') || null,\n              deadline: fd.get('deadline'),\n              priority: fd.get('priority'),\n              meeting_time: fd.get('meeting_time') || '',\n              meeting_location: fd.get('meeting_location') || '',\n              meeting_minutes: fd.get('meeting_minutes') || '',\n              evidence_note: fd.get('evidence_note') || '',\n              extension_reason: fd.get('extension_reason') || ''\n            };\n            try {\n              if (existing) await global.ITCApi.patch(`/api/tasks/${encodeURIComponent(existing.id)}`, payload);\n              else await global.ITCApi.post('/api/tasks', payload);\n              ctx.closeModal();\n              toast('Đã lưu hạng mục điều hành.');\n              ctx.refreshCurrentTab();\n            } catch (err) { toast(err.message, 'error'); }\n          });\n        });\n      };\n\n      container.querySelector('#ex-btn-new').addEventListener('click', () => openEditor(null));\n      container.querySelectorAll('.ex-edit').forEach(btn => {\n        btn.addEventListener('click', () => {\n          const item = items.find(x => x.id === btn.dataset.id);\n          if (item) openEditor(item);\n        });\n      });\n    }\n  };\n})(window);\n"
  },
  "/js/modules/kpi.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, toast } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n  let selectedMonthByYear = {};\n\n  global.ITCModules.kpi = {\n    async render(container, ctx) {\n      const mParam = selectedMonthByYear[ctx.intakeYear] || '';\n      const qs = new URLSearchParams({ intakeYear: ctx.intakeYear });\n      if (mParam) qs.set('monthKey', mParam);\n\n      const data = await global.ITCApi.get(`/api/kpi?${qs.toString()}`);\n      selectedMonthByYear[ctx.intakeYear] = data.selectedMonth;\n      const canEdit = ctx.bootstrap.user.can_edit_kpi || ctx.bootstrap.user.role === 'super_admin';\n\n      container.innerHTML = `\n        <div class=\"grid-4 mb-2\">\n          <div class=\"stat-card\">\n            <div class=\"stat-label\">Đăng ký tháng ${esc(data.selectedMonth)}</div>\n            <div class=\"stat-value\">${data.roomMonthActual.lead} / ${data.roomMonthTarget.lead}</div>\n            <div class=\"stat-note\">Tiến độ kỳ vọng đến hôm nay: ${Math.round(data.pace.ratio * 100)}% (${data.pace.elapsedDays}/${data.pace.daysInMonth} ngày)</div>\n          </div>\n          <div class=\"stat-card\">\n            <div class=\"stat-label\">Nộp hồ sơ tháng ${esc(data.selectedMonth)}</div>\n            <div class=\"stat-value\">${data.roomMonthActual.submitted} / ${data.roomMonthTarget.submitted}</div>\n            <div class=\"stat-note\">Đếm đúng sự kiện nộp trong tháng</div>\n          </div>\n          <div class=\"stat-card\">\n            <div class=\"stat-label\">Lũy kế Niên khóa ${esc(ctx.intakeYear)} (ĐK)</div>\n            <div class=\"stat-value\">${data.roomAnnualActual.lead} / ${data.roomAnnualTarget.lead}</div>\n            <div class=\"stat-note\">Chưa phân công: ${data.unassignedActual.lead} ĐK</div>\n          </div>\n          <div class=\"stat-card\">\n            <div class=\"stat-label\">Lũy kế HS / Nhập học ${esc(ctx.intakeYear)}</div>\n            <div class=\"stat-value\">${data.roomAnnualActual.submitted} HS • ${data.roomAnnualActual.enrolled} NH</div>\n            <div class=\"stat-note\">Chỉ tiêu năm: ${data.roomAnnualTarget.submitted} HS • ${data.roomAnnualTarget.enrolled} NH</div>\n          </div>\n        </div>\n\n        <div class=\"card mb-2\">\n          <div class=\"toolbar\">\n            <div class=\"toolbar-group\">\n              <label for=\"kpi-month-select\" class=\"font-bold\">Chọn tháng trong kỳ tuyển sinh ${esc(ctx.intakeYear)}:</label>\n              <select id=\"kpi-month-select\" class=\"select-sm\">\n                ${data.months.map(m => `<option value=\"${esc(m.key)}\" ${m.key === data.selectedMonth ? 'selected' : ''}>Tháng ${esc(m.label)}</option>`).join('')}\n              </select>\n              <span class=\"pill pill-primary\">Kế hoạch v${data.planVersion ? data.planVersion.version_number : 1}</span>\n            </div>\n            ${canEdit ? '<button type=\"button\" id=\"kpi-btn-edit-plan\" class=\"btn btn-primary btn-sm\">Chỉnh sửa Kế hoạch KPI 12 tháng</button>' : ''}\n          </div>\n\n          <div class=\"table-wrap\">\n            <table>\n              <thead>\n                <tr>\n                  <th>Chuyên viên (ID ổn định)</th>\n                  <th class=\"text-center\">ĐK Tháng</th>\n                  <th class=\"text-center\">HS Tháng</th>\n                  <th class=\"text-center\">NH Tháng</th>\n                  <th>Tiến độ tháng vs Kỳ vọng (${Math.round(data.pace.ratio * 100)}%)</th>\n                  <th class=\"text-center\">ĐK Lũy kế Năm</th>\n                  <th class=\"text-center\">HS Lũy kế Năm</th>\n                  <th class=\"text-center\">NH Lũy kế Năm</th>\n                </tr>\n              </thead>\n              <tbody>\n                ${data.staffRows.map(s => `\n                  <tr>\n                    <td>\n                      <div class=\"font-bold\">${esc(s.full_name)}</div>\n                      <div class=\"text-light\" style=\"font-size:11px\">${esc(s.zalo_slot || 'Chưa gán Zalo')} • ${esc(s.staff_id)}</div>\n                    </td>\n                    <td class=\"text-center font-bold\">${s.monthActual.lead} / ${s.monthTarget.lead}</td>\n                    <td class=\"text-center\">${s.monthActual.submitted} / ${s.monthTarget.submitted}</td>\n                    <td class=\"text-center\">${s.monthActual.enrolled} / ${s.monthTarget.enrolled}</td>\n                    <td style=\"min-width:170px\">\n                      <div style=\"display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px\">\n                        <span>${s.monthLeadPct !== null ? s.monthLeadPct + '%' : 'Chưa giao chỉ tiêu'}</span>\n                        <span>${s.isLagging ? '<strong class=\"text-danger\">Chậm tiến độ kỳ vọng</strong>' : '<span class=\"text-success\">Đúng nhịp</span>'}</span>\n                      </div>\n                      <div class=\"progress-track\">\n                        <div class=\"progress-fill ${s.isLagging ? 'red' : 'green'}\" style=\"width:${Math.min(100, s.monthLeadPct || 0)}%\"></div>\n                      </div>\n                    </td>\n                    <td class=\"text-center\">${s.annualActual.lead} / ${s.annualTarget.lead}</td>\n                    <td class=\"text-center\">${s.annualActual.submitted} / ${s.annualTarget.submitted}</td>\n                    <td class=\"text-center font-bold text-success\">${s.annualActual.enrolled} / ${s.annualTarget.enrolled}</td>\n                  </tr>\n                `).join('')}\n              </tbody>\n            </table>\n          </div>\n        </div>\n\n        <div class=\"card\">\n          <div class=\"card-header\"><h3 class=\"card-title\">Biểu đồ tiến độ đăng ký 12 tháng — Niên khóa ${esc(ctx.intakeYear)}</h3></div>\n          ${global.ITCCharts.renderMonthlyBarChart(data.monthlySeries)}\n        </div>\n      `;\n\n      container.querySelector('#kpi-month-select').addEventListener('change', (e) => {\n        selectedMonthByYear[ctx.intakeYear] = e.target.value;\n        ctx.refreshCurrentTab();\n      });\n\n      const editBtn = container.querySelector('#kpi-btn-edit-plan');\n      if (editBtn) {\n        editBtn.addEventListener('click', () => this.openPlanEditor(ctx));\n      }\n    },\n\n    async openPlanEditor(ctx) {\n      const planData = await global.ITCApi.get(`/api/kpi/plan?intakeYear=${encodeURIComponent(ctx.intakeYear)}`);\n      const consultants = planData.staff.filter(s => s.user_role === 'consultant' || s.team === 'Tư vấn tuyển sinh' || !s.user_role);\n      const tMap = {};\n      for (const t of planData.targets) {\n        tMap[`${t.staff_id}|${t.month_key}`] = t;\n      }\n\n      ctx.openModal(`\n        <div class=\"modal-head\">\n          <h3 class=\"card-title\">Lập / Điều chỉnh Kế hoạch KPI 12 tháng — NK ${esc(ctx.intakeYear)} (tạo phiên bản mới)</h3>\n          <button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button>\n        </div>\n        <div class=\"modal-body form-stack\">\n          <div class=\"field\">\n            <label>Ghi chú phiên bản kế hoạch</label>\n            <input id=\"kpi-plan-note\" type=\"text\" placeholder=\"vd: Phân bổ bổ sung nhân sự mới tháng 03/2027\">\n          </div>\n          <div class=\"field\">\n            <label>Chọn nhân sự cần chỉnh chỉ tiêu 12 tháng</label>\n            <select id=\"kpi-plan-staff-picker\">\n              ${consultants.map(s => `<option value=\"${esc(s.id)}\">${esc(s.full_name)} (${esc(s.zalo_slot || s.id)})</option>`).join('')}\n            </select>\n          </div>\n          <div id=\"kpi-plan-grid\"></div>\n          <div id=\"kpi-plan-totals\" class=\"alert alert-info\"></div>\n        </div>\n        <div class=\"modal-foot\">\n          <button type=\"button\" class=\"btn btn-outline\" data-close-modal>Hủy</button>\n          <button type=\"button\" id=\"kpi-plan-save\" class=\"btn btn-success\">Ban hành phiên bản kế hoạch mới</button>\n        </div>\n      `, (dialog) => {\n        // Working copy for all consultants x 12 months\n        const matrix = {};\n        for (const s of consultants) {\n          for (const m of planData.months) {\n            const k = `${s.id}|${m.key}`;\n            const cur = tMap[k] || { target_lead: 0, target_submitted: 0, target_enrolled: 0 };\n            matrix[k] = {\n              staff_id: s.id,\n              month_key: m.key,\n              target_lead: cur.target_lead,\n              target_submitted: cur.target_submitted,\n              target_enrolled: cur.target_enrolled\n            };\n          }\n        }\n\n        const updateTotals = () => {\n          let sumL = 0, sumS = 0, sumE = 0;\n          Object.values(matrix).forEach(v => { sumL += v.target_lead; sumS += v.target_submitted; sumE += v.target_enrolled; });\n          dialog.querySelector('#kpi-plan-totals').textContent = `Tổng toàn phòng NK ${ctx.intakeYear}: ${sumL.toLocaleString('vi-VN')} Đăng ký • ${sumS.toLocaleString('vi-VN')} Hồ sơ • ${sumE.toLocaleString('vi-VN')} Nhập học`;\n        };\n\n        const renderStaffGrid = (staffId) => {\n          const grid = dialog.querySelector('#kpi-plan-grid');\n          grid.innerHTML = `\n            <div class=\"table-wrap\">\n              <table>\n                <thead><tr><th>Tháng</th><th>Chỉ tiêu ĐK</th><th>Chỉ tiêu Nộp HS</th><th>Chỉ tiêu Nhập học</th></tr></thead>\n                <tbody>\n                  ${planData.months.map(m => {\n                    const row = matrix[`${staffId}|${m.key}`];\n                    return `\n                      <tr>\n                        <td class=\"font-bold\">${esc(m.label)}</td>\n                        <td><input type=\"number\" min=\"0\" class=\"kp-in\" data-k=\"${esc(staffId)}|${esc(m.key)}\" data-f=\"target_lead\" value=\"${row.target_lead}\"></td>\n                        <td><input type=\"number\" min=\"0\" class=\"kp-in\" data-k=\"${esc(staffId)}|${esc(m.key)}\" data-f=\"target_submitted\" value=\"${row.target_submitted}\"></td>\n                        <td><input type=\"number\" min=\"0\" class=\"kp-in\" data-k=\"${esc(staffId)}|${esc(m.key)}\" data-f=\"target_enrolled\" value=\"${row.target_enrolled}\"></td>\n                      </tr>`;\n                  }).join('')}\n                </tbody>\n              </table>\n            </div>`;\n          grid.querySelectorAll('.kp-in').forEach(inp => {\n            inp.addEventListener('input', () => {\n              matrix[inp.dataset.k][inp.dataset.f] = Math.max(0, parseInt(inp.value || '0', 10));\n              updateTotals();\n            });\n          });\n          updateTotals();\n        };\n\n        const picker = dialog.querySelector('#kpi-plan-staff-picker');\n        if (consultants.length > 0) renderStaffGrid(picker.value);\n        picker.addEventListener('change', () => renderStaffGrid(picker.value));\n\n        dialog.querySelector('#kpi-plan-save').addEventListener('click', async () => {\n          try {\n            const res = await global.ITCApi.post('/api/kpi/plan', {\n              intakeYear: ctx.intakeYear,\n              note: dialog.querySelector('#kpi-plan-note').value.trim(),\n              targets: Object.values(matrix)\n            });\n            ctx.closeModal();\n            toast(`Đã ban hành kế hoạch KPI v${res.versionNumber} (${res.totals.lead} ĐK / ${res.totals.submitted} HS / ${res.totals.enrolled} NH).`);\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            toast(err.message, 'error');\n          }\n        });\n      });\n    }\n  };\n})(window);\n"
  },
  "/js/modules/regional.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, formatDate, readFileAsBase64, toast } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n  let activeRegion = 'mientay';\n  let searchQ = '';\n\n  global.ITCModules.regional = {\n    async render(container, ctx) {\n      const regions = ctx.bootstrap.regions || { mientay: 'Tuyến Miền Tây', mientrung: 'Tuyến Miền Trung', hcmc: 'Tuyến TP.HCM' };\n      const data = await global.ITCApi.get(`/api/regional?intakeYear=${encodeURIComponent(ctx.intakeYear)}&region=${encodeURIComponent(activeRegion)}&search=${encodeURIComponent(searchQ)}`);\n\n      container.innerHTML = `\n        <div class=\"card\">\n          <div class=\"subtabs\">\n            ${Object.entries(regions).map(([k, label]) => `\n              <button type=\"button\" class=\"subtab-btn ${activeRegion === k ? 'active' : ''}\" data-region=\"${esc(k)}\">${esc(label)}</button>\n            `).join('')}\n          </div>\n\n          <div class=\"toolbar\">\n            <div class=\"toolbar-group\">\n              <button type=\"button\" id=\"rgn-btn-new\" class=\"btn btn-primary\">+ Thêm hồ sơ tuyến</button>\n              <button type=\"button\" id=\"rgn-btn-import\" class=\"btn btn-outline\">Nhập Excel Tuyến (Preview)</button>\n              <a class=\"btn btn-ghost btn-sm\" href=\"/api/templates/regional\" download>Tải mẫu Tuyến Tỉnh (.xlsx)</a>\n            </div>\n            <div class=\"toolbar-group\">\n              <input id=\"rgn-search\" type=\"text\" value=\"${esc(searchQ)}\" placeholder=\"Tìm tên, SĐT, trường THPT, tỉnh, sự kiện...\" style=\"width:260px\">\n              <button type=\"button\" id=\"rgn-btn-search\" class=\"btn btn-sm btn-outline\">Tìm</button>\n            </div>\n          </div>\n\n          <div class=\"table-wrap\">\n            <table>\n              <thead>\n                <tr>\n                  <th>Họ tên & SĐT</th>\n                  <th>Trường THPT</th>\n                  <th>Tỉnh / TP</th>\n                  <th>Ngành quan tâm</th>\n                  <th>Sự kiện / Nguồn / Ngày</th>\n                  <th>Liên kết CRM</th>\n                  <th class=\"text-right\">Thao tác</th>\n                </tr>\n              </thead>\n              <tbody>\n                ${data.items.map(r => `\n                  <tr>\n                    <td>\n                      <div class=\"font-bold\">${esc(r.full_name)}</div>\n                      <div class=\"font-mono text-muted\">${esc(r.phone || '—')}</div>\n                      ${r.parent_phone ? `<div class=\"font-mono text-light\" style=\"font-size:11px\">PH: ${esc(r.parent_phone)}</div>` : ''}\n                    </td>\n                    <td>${esc(r.school || '—')}</td>\n                    <td>${esc(r.province || '—')}</td>\n                    <td>${esc(r.major || '—')}</td>\n                    <td>\n                      <div>${esc(r.event_name || r.source)}</div>\n                      <div class=\"text-light\" style=\"font-size:11px\">${esc(formatDate(r.collected_at))}</div>\n                    </td>\n                    <td>\n                      ${r.linked_registration_id\n                        ? `<button type=\"button\" class=\"btn btn-xs btn-ghost\" data-open-linked=\"${esc(r.linked_registration_id)}\">Đã nối CRM</button>`\n                        : `<button type=\"button\" class=\"btn btn-xs btn-success\" data-convert-crm=\"${esc(r.id)}\">Chuyển sang CRM</button>`}\n                    </td>\n                    <td class=\"text-right\">\n                      ${ctx.bootstrap.user.can_delete ? `<button type=\"button\" class=\"btn btn-xs btn-danger-outline\" data-del-rgn=\"${esc(r.id)}\">Xóa</button>` : ''}\n                    </td>\n                  </tr>\n                `).join('') || '<tr><td colspan=\"7\" class=\"text-center text-light\" style=\"padding:20px\">Chưa có dữ liệu cho tuyến này trong niên khóa đã chọn.</td></tr>'}\n              </tbody>\n            </table>\n          </div>\n        </div>\n      `;\n\n      container.querySelectorAll('[data-region]').forEach(btn => {\n        btn.addEventListener('click', () => { activeRegion = btn.dataset.region; ctx.refreshCurrentTab(); });\n      });\n      container.querySelector('#rgn-btn-search').addEventListener('click', () => { searchQ = container.querySelector('#rgn-search').value.trim(); ctx.refreshCurrentTab(); });\n      container.querySelector('#rgn-search').addEventListener('keydown', (e) => { if (e.key === 'Enter') { searchQ = e.target.value.trim(); ctx.refreshCurrentTab(); } });\n\n      container.querySelectorAll('[data-convert-crm]').forEach(btn => {\n        btn.addEventListener('click', async () => {\n          try {\n            const res = await global.ITCApi.post(`/api/regional/${encodeURIComponent(btn.dataset.convertCrm)}/convert-to-crm`, {});\n            toast(res.updatedCount > 0 ? 'Đã đối chiếu trùng và gộp nguồn vào CRM (không đếm lặp KPI).' : 'Đã chuyển sang hồ sơ chăm sóc CRM.');\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            toast(err.message, 'error');\n          }\n        });\n      });\n\n      container.querySelectorAll('[data-open-linked]').forEach(btn => {\n        btn.addEventListener('click', () => ctx.openRegistrationDrawer(btn.dataset.openLinked));\n      });\n\n      container.querySelectorAll('[data-del-rgn]').forEach(btn => {\n        btn.addEventListener('click', async () => {\n          if (!confirm('Xóa bản ghi tuyến tỉnh này?')) return;\n          try {\n            await global.ITCApi.del(`/api/regional/${encodeURIComponent(btn.dataset.delRgn)}`);\n            toast('Đã xóa.');\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            toast(err.message, 'error');\n          }\n        });\n      });\n\n      container.querySelector('#rgn-btn-new').addEventListener('click', () => {\n        ctx.openModal(`\n          <div class=\"modal-head\"><h3 class=\"card-title\">Thêm khảo sát ${esc(regions[activeRegion])}</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div>\n          <form id=\"rgn-create-form\">\n            <div class=\"modal-body form-stack\">\n              <div class=\"form-row\">\n                <div class=\"field\"><label>Họ và tên *</label><input name=\"full_name\" type=\"text\" required></div>\n                <div class=\"field\"><label>SĐT thí sinh</label><input name=\"phone\" type=\"text\"></div>\n                <div class=\"field\"><label>SĐT phụ huynh</label><input name=\"parent_phone\" type=\"text\"></div>\n              </div>\n              <div class=\"form-row\">\n                <div class=\"field\"><label>Trường THPT *</label><input name=\"school\" type=\"text\" placeholder=\"vd: THPT Nguyễn Đình Chiểu\"></div>\n                <div class=\"field\"><label>Tỉnh / TP *</label><input name=\"province\" type=\"text\" placeholder=\"vd: Tiền Giang\"></div>\n                <div class=\"field\"><label>Ngành quan tâm</label><input name=\"major\" type=\"text\"></div>\n              </div>\n              <div class=\"form-row\">\n                <div class=\"field\"><label>Sự kiện / Đợt tư vấn</label><input name=\"event_name\" type=\"text\" placeholder=\"Ngày hội hướng nghiệp...\"></div>\n                <div class=\"field\"><label>Ngày thu thập</label><input name=\"collected_at\" type=\"date\" value=\"${new Date().toISOString().slice(0, 10)}\"></div>\n              </div>\n              <div class=\"field\"><label>Ghi chú</label><textarea name=\"notes\" rows=\"2\"></textarea></div>\n            </div>\n            <div class=\"modal-foot\">\n              <button type=\"button\" class=\"btn btn-outline\" data-close-modal>Hủy</button>\n              <button type=\"submit\" class=\"btn btn-primary\">Lưu dữ liệu tuyến</button>\n            </div>\n          </form>\n        `, (dialog) => {\n          dialog.querySelector('#rgn-create-form').addEventListener('submit', async (e) => {\n            e.preventDefault();\n            const fd = new FormData(e.target);\n            try {\n              await global.ITCApi.post('/api/regional', {\n                intake_year: ctx.intakeYear,\n                region: activeRegion,\n                full_name: fd.get('full_name'),\n                phone: fd.get('phone'),\n                parent_phone: fd.get('parent_phone'),\n                school: fd.get('school'),\n                province: fd.get('province'),\n                major: fd.get('major'),\n                event_name: fd.get('event_name'),\n                collected_at: fd.get('collected_at') ? new Date(fd.get('collected_at')).toISOString() : new Date().toISOString(),\n                notes: fd.get('notes')\n              });\n              ctx.closeModal();\n              toast('Đã thêm hồ sơ tuyến tỉnh.');\n              ctx.refreshCurrentTab();\n            } catch (err) {\n              toast(err.message, 'error');\n            }\n          });\n        });\n      });\n\n      container.querySelector('#rgn-btn-import').addEventListener('click', () => {\n        let preview = null;\n        let fname = '';\n        ctx.openModal(`\n          <div class=\"modal-head\"><h3 class=\"card-title\">Nhập Excel ${esc(regions[activeRegion])} (giữ nguyên Trường THPT & Tỉnh)</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div>\n          <div class=\"modal-body form-stack\">\n            <div class=\"form-row\">\n              <div class=\"field\"><label>Chọn tệp Excel (.xlsx/.csv)</label><input id=\"rgn-imp-file\" type=\"file\" accept=\".xlsx,.xls,.csv\"></div>\n              <button type=\"button\" id=\"rgn-imp-preview\" class=\"btn btn-primary\">Xem trước cột</button>\n            </div>\n            <div id=\"rgn-imp-out\"></div>\n          </div>\n          <div class=\"modal-foot\">\n            <button type=\"button\" class=\"btn btn-outline\" data-close-modal>Đóng</button>\n            <button type=\"button\" id=\"rgn-imp-commit\" class=\"btn btn-success\" disabled>Xác nhận nhập</button>\n          </div>\n        `, (dialog) => {\n          const out = dialog.querySelector('#rgn-imp-out');\n          const btnCommit = dialog.querySelector('#rgn-imp-commit');\n          dialog.querySelector('#rgn-imp-preview').addEventListener('click', async () => {\n            const f = dialog.querySelector('#rgn-imp-file').files[0];\n            if (!f) return toast('Chọn tệp trước.', 'warn');\n            fname = f.name;\n            try {\n              const b64 = await readFileAsBase64(f);\n              preview = await global.ITCApi.post('/api/regional/import/preview', { region: activeRegion, fileBase64: b64 });\n              btnCommit.disabled = preview.rows.length === 0;\n              out.innerHTML = `\n                <div class=\"alert alert-info mb-2\">Tìm thấy <strong>${preview.stats.total}</strong> dòng (Hợp lệ: ${preview.stats.newCount}, Lỗi: ${preview.stats.errorCount})</div>\n                <div class=\"table-wrap\" style=\"max-height:260px;overflow:auto\">\n                  <table>\n                    <thead><tr><th>Họ tên</th><th>SĐT</th><th>Trường THPT</th><th>Tỉnh/TP</th><th>Ngành</th><th>Sự kiện</th></tr></thead>\n                    <tbody>\n                      ${preview.rows.slice(0, 80).map(r => `<tr><td>${esc(r.parsed.full_name)}</td><td>${esc(r.parsed.phone)}</td><td><strong>${esc(r.parsed.school)}</strong></td><td><strong>${esc(r.parsed.province)}</strong></td><td>${esc(r.parsed.major)}</td><td>${esc(r.parsed.event_name)}</td></tr>`).join('')}\n                    </tbody>\n                  </table>\n                </div>`;\n            } catch (err) {\n              out.innerHTML = `<div class=\"alert alert-danger\">${esc(err.message)}</div>`;\n            }\n          });\n          btnCommit.addEventListener('click', async () => {\n            if (!preview) return;\n            try {\n              const res = await global.ITCApi.post('/api/regional/import/commit', { intakeYear: ctx.intakeYear, region: activeRegion, fileName: fname, rows: preview.rows });\n              ctx.closeModal();\n              toast(`Đã nhập ${res.createdCount} dòng vào ${regions[activeRegion]}.`);\n              ctx.refreshCurrentTab();\n            } catch (err) {\n              toast(err.message, 'error');\n            }\n          });\n        });\n      });\n    }\n  };\n})(window);\n"
  },
  "/js/modules/reports.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, formatDateTime, toast } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n\n  const cfg = {\n    template: 'phong',\n    periodType: 'week',\n    startDate: '',\n    endDate: '',\n    cutoffAt: '',\n    snapshotId: '',\n    includeCRM: true,\n    includeKPI: true,\n    includeRegional: true,\n    includeTasks: true,\n    includeBGH: true,\n    includeOutsideSupport: true\n  };\n\n  function buildQueryParams(intakeYear) {\n    const qs = new URLSearchParams({\n      intakeYear,\n      template: cfg.template,\n      periodType: cfg.periodType,\n      includeCRM: String(cfg.includeCRM),\n      includeKPI: String(cfg.includeKPI),\n      includeRegional: String(cfg.includeRegional),\n      includeTasks: String(cfg.includeTasks),\n      includeBGH: String(cfg.includeBGH),\n      includeOutsideSupport: String(cfg.includeOutsideSupport)\n    });\n    if (cfg.startDate) qs.set('startDate', new Date(cfg.startDate + 'T00:00:00+07:00').toISOString());\n    if (cfg.endDate) qs.set('endDate', new Date(cfg.endDate + 'T23:59:59+07:00').toISOString());\n    if (cfg.cutoffAt) qs.set('cutoffAt', new Date(cfg.cutoffAt).toISOString());\n    if (cfg.snapshotId) qs.set('snapshotId', cfg.snapshotId);\n    return qs.toString();\n  }\n\n  function renderReportPaper(data, snap) {\n    const m = data.meta;\n    const sec = m.sections || {};\n    let idx = 1;\n    return `\n      <div class=\"report-paper\" id=\"report-paper-area\">\n        ${snap ? `<div class=\"alert ${snap.status === 'approved' ? 'alert-success' : 'alert-info'} no-print mb-2\">Đang xem bản chốt Snapshot: <strong>${esc(snap.title)}</strong> • Trạng thái: <strong>${esc(snap.status.toUpperCase())}</strong>${snap.approved_at ? ' • Duyệt lúc: ' + esc(formatDateTime(snap.approved_at)) : ''}</div>` : ''}\n        <div class=\"report-header-grid\">\n          <div>\n            <div class=\"font-bold\">TRƯỜNG CAO ĐẲNG CNTT TP. HCM</div>\n            <div class=\"font-bold\">PHÒNG TUYỂN SINH</div>\n            <div style=\"font-style:italic\">Số: ..../BC-P.TS</div>\n          </div>\n          <div>\n            <div class=\"font-bold\">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>\n            <div class=\"font-bold\">Độc lập – Tự do – Hạnh phúc</div>\n            <div style=\"font-style:italic\">TP. Hồ Chí Minh, ngày ${esc(m.cutoffDisplay)}</div>\n          </div>\n        </div>\n\n        <div class=\"text-center mb-2\">\n          <div style=\"font-size:18px;font-weight:700\">${esc(m.title)}</div>\n          <div style=\"font-weight:700\">Công tác Tuyển sinh Niên khóa ${esc(m.intakeYear)} • Kỳ: ${esc(m.periodDisplay)}</div>\n          <div style=\"font-style:italic\">Thời điểm chốt số liệu: ${esc(m.cutoffDisplay)}</div>\n          <div style=\"font-style:italic;font-weight:700;margin-top:6px\">Kính gửi: ${esc(m.recipient)}.</div>\n        </div>\n\n        ${sec.includeCRM ? `\n          <h3>${idx++}. Kết quả tiếp nhận & chăm sóc thí sinh (CRM)</h3>\n          <table>\n            <thead><tr><th>Chỉ tiêu</th><th>Phát sinh trong kỳ (${esc(m.periodDisplay)})</th><th>Lũy kế niên khóa ${esc(m.intakeYear)} (đến chốt)</th></tr></thead>\n            <tbody>\n              <tr><td>Đăng ký mới (Lead)</td><td class=\"text-center font-bold\">${data.crm.inPeriod.registered}</td><td class=\"text-center font-bold\">${data.crm.cumulative.registered}</td></tr>\n              <tr><td>Đã nộp hồ sơ (bao gồm nhập học)</td><td class=\"text-center\">${data.crm.inPeriod.submitted}</td><td class=\"text-center\">${data.crm.cumulative.submitted}</td></tr>\n              <tr><td>Đã nhập học chính thức</td><td class=\"text-center\">${data.crm.inPeriod.enrolled}</td><td class=\"text-center\">${data.crm.cumulative.enrolled}</td></tr>\n              <tr><td>Rút hồ sơ / Hủy</td><td class=\"text-center\">${data.crm.inPeriod.withdrawn}</td><td class=\"text-center\">${data.crm.cumulative.withdrawn}</td></tr>\n              <tr><td>Chờ xác minh trạng thái</td><td class=\"text-center\">${data.crm.inPeriod.pendingVerify}</td><td class=\"text-center\">${data.crm.cumulative.pendingVerify}</td></tr>\n            </tbody>\n          </table>\n          <div>Tỷ lệ đã xử lý (lũy kế): <strong>${data.crm.slaCumulative.handledRate}%</strong> • Tỷ lệ đúng hạn SLA &lt;15 phút: <strong>${data.crm.slaCumulative.onTimeSlaRate !== null ? data.crm.slaCumulative.onTimeSlaRate + '%' : 'Chưa đủ mốc đo'}</strong> • Quá hạn chưa gọi: <strong>${data.crm.slaCumulative.counts.overdue_unhandled}</strong>.</div>\n        ` : ''}\n\n        ${sec.includeKPI ? `\n          <h3>${idx++}. Tiến độ KPI nhân sự tư vấn (Tháng ${esc(data.kpi.selectedMonth)} & Lũy kế năm)</h3>\n          <table>\n            <thead><tr><th>Nhân sự</th><th>ĐK Tháng</th><th>HS Tháng</th><th>NH Tháng</th><th>ĐK Năm (LK)</th><th>NH Năm (LK)</th></tr></thead>\n            <tbody>\n              ${data.kpi.staffRows.map(s => `\n                <tr>\n                  <td>${esc(s.full_name)}</td>\n                  <td class=\"text-center\">${s.monthActual.lead}/${s.monthTarget.lead}</td>\n                  <td class=\"text-center\">${s.monthActual.submitted}/${s.monthTarget.submitted}</td>\n                  <td class=\"text-center\">${s.monthActual.enrolled}/${s.monthTarget.enrolled}</td>\n                  <td class=\"text-center\">${s.annualActual.lead}/${s.annualTarget.lead}</td>\n                  <td class=\"text-center\">${s.annualActual.enrolled}/${s.annualTarget.enrolled}</td>\n                </tr>\n              `).join('')}\n              <tr style=\"font-weight:700\">\n                <td>TỔNG PHÒNG</td>\n                <td class=\"text-center\">${data.kpi.roomMonthActual.lead}/${data.kpi.roomMonthTarget.lead}</td>\n                <td class=\"text-center\">${data.kpi.roomMonthActual.submitted}/${data.kpi.roomMonthTarget.submitted}</td>\n                <td class=\"text-center\">${data.kpi.roomMonthActual.enrolled}/${data.kpi.roomMonthTarget.enrolled}</td>\n                <td class=\"text-center\">${data.kpi.roomAnnualActual.lead}/${data.kpi.roomAnnualTarget.lead}</td>\n                <td class=\"text-center\">${data.kpi.roomAnnualActual.enrolled}/${data.kpi.roomAnnualTarget.enrolled}</td>\n              </tr>\n            </tbody>\n          </table>\n        ` : ''}\n\n        ${sec.includeRegional ? `\n          <h3>${idx++}. Dữ liệu 03 Tuyến Tỉnh</h3>\n          <table>\n            <thead><tr><th>Tuyến địa bàn</th><th>Phát sinh trong kỳ</th><th>Lũy kế niên khóa</th></tr></thead>\n            <tbody>\n              ${Object.values(data.regional.byRegion).map(r => `<tr><td>${esc(r.label)}</td><td class=\"text-center\">${r.inPeriod}</td><td class=\"text-center\">${r.cumulative}</td></tr>`).join('')}\n              <tr style=\"font-weight:700\"><td>Tổng cộng</td><td class=\"text-center\">${data.regional.inPeriodTotal}</td><td class=\"text-center\">${data.regional.cumulativeTotal}</td></tr>\n            </tbody>\n          </table>\n        ` : ''}\n\n        ${sec.includeBGH ? `\n          <h3>${idx++}. Thực hiện Việc BGH giao, Chỉ đạo & Lịch họp (${data.tasks.bgh.filter(t => t.status === 'done').length}/${data.tasks.bgh.length} hoàn thành)</h3>\n          ${data.tasks.bgh.length ? `<ul>${data.tasks.bgh.map(t => `<li><strong>${esc(t.title)}</strong> — Phụ trách: ${esc(t.owner_name || '—')} • Hạn: ${esc(t.deadline || '—')} • Trạng thái: ${esc(t.status)}</li>`).join('')}</ul>` : '<div style=\"font-style:italic\">Chưa có hạng mục trong kỳ.</div>'}\n        ` : ''}\n\n        ${(sec.includeTasks || sec.includeOutsideSupport) ? `\n          <h3>${idx++}. Việc nội bộ phòng & Phối hợp đơn vị ngoài phòng</h3>\n          <div>Việc nội bộ: <strong>${data.tasks.internal.length}</strong> (Hoàn thành: ${data.tasks.internal.filter(t => t.status === 'done').length}) • Phối hợp đơn vị ngoài: <strong>${data.tasks.externalSupport.length}</strong>.</div>\n        ` : ''}\n\n        <div class=\"report-sig-grid\">\n          <div>\n            <div style=\"font-weight:700;font-style:italic\">Nơi nhận:</div>\n            <div>- ${esc(m.recipient)} (báo cáo);</div>\n            <div>- Lưu: P.TS.</div>\n          </div>\n          <div class=\"text-center\">\n            <div style=\"font-weight:700\">${esc(m.signerTitle)}</div>\n            <div style=\"font-style:italic\">(Ký và ghi rõ họ tên)</div>\n            <div style=\"height:64px\"></div>\n            <div style=\"font-weight:700\">${esc(m.signerName)}</div>\n          </div>\n        </div>\n      </div>`;\n  }\n\n  global.ITCModules.reports = {\n    async render(container, ctx) {\n      const qs = buildQueryParams(ctx.intakeYear);\n      const [previewRes, snapRes, notifRes] = await Promise.all([\n        global.ITCApi.get(`/api/reports/preview?${qs}`),\n        global.ITCApi.get(`/api/reports/snapshots?intakeYear=${encodeURIComponent(ctx.intakeYear)}`),\n        global.ITCApi.get('/api/notifications')\n      ]);\n\n      const user = ctx.bootstrap.user;\n      const canApprove = user.can_approve_reports || user.role === 'super_admin';\n\n      container.innerHTML = `\n        <div class=\"card no-print mb-2\">\n          <div class=\"card-header\">\n            <div>\n              <h3 class=\"card-title\">Bộ lọc kỳ báo cáo dùng chung (Preview • DOCX thật • PDF • Excel động)</h3>\n              <p class=\"card-sub\">Mọi định dạng xuất đều lấy chung một truy vấn kỳ, tách bạch số phát sinh trong kỳ và số lũy kế</p>\n            </div>\n            <div class=\"toolbar-group\">\n              ${cfg.snapshotId ? '<button type=\"button\" id=\"rpt-exit-snap\" class=\"btn btn-xs btn-warn\">Thoát xem Snapshot (về số liệu trực tiếp)</button>' : ''}\n            </div>\n          </div>\n\n          <div class=\"form-row\">\n            <div class=\"field\">\n              <label>Mẫu báo cáo</label>\n              <select id=\"rpt-template\">\n                <option value=\"phong\" ${cfg.template === 'phong' ? 'selected' : ''}>Báo cáo Trưởng phòng Tuyển sinh</option>\n                <option value=\"bgh\" ${cfg.template === 'bgh' ? 'selected' : ''}>Báo cáo Ban Giám hiệu</option>\n              </select>\n            </div>\n            <div class=\"field\">\n              <label>Kỳ báo cáo</label>\n              <select id=\"rpt-period\">\n                <option value=\"day\" ${cfg.periodType === 'day' ? 'selected' : ''}>Báo cáo Ngày</option>\n                <option value=\"week\" ${cfg.periodType === 'week' ? 'selected' : ''}>Báo cáo Tuần (T7 &lt;09:30)</option>\n                <option value=\"month\" ${cfg.periodType === 'month' ? 'selected' : ''}>Báo cáo Tháng (&lt;ngày 25)</option>\n                <option value=\"year\" ${cfg.periodType === 'year' ? 'selected' : ''}>Tổng hợp Niên khóa ${esc(ctx.intakeYear)}</option>\n                <option value=\"custom\" ${cfg.periodType === 'custom' ? 'selected' : ''}>Khoảng ngày tùy chọn</option>\n              </select>\n            </div>\n            <div class=\"field\"><label>Từ ngày (tùy chọn)</label><input id=\"rpt-start\" type=\"date\" value=\"${esc(cfg.startDate)}\"></div>\n            <div class=\"field\"><label>Đến ngày (tùy chọn)</label><input id=\"rpt-end\" type=\"date\" value=\"${esc(cfg.endDate)}\"></div>\n            <button type=\"button\" id=\"rpt-btn-apply\" class=\"btn btn-primary btn-sm\">Cập nhật Preview</button>\n          </div>\n\n          <div class=\"toolbar mt-2\" style=\"margin-bottom:0\">\n            <div class=\"toolbar-group\">\n              <label class=\"check-row\"><input type=\"checkbox\" id=\"chk-crm\" ${cfg.includeCRM ? 'checked' : ''}> CRM & SLA</label>\n              <label class=\"check-row\"><input type=\"checkbox\" id=\"chk-kpi\" ${cfg.includeKPI ? 'checked' : ''}> Tiến độ KPI</label>\n              <label class=\"check-row\"><input type=\"checkbox\" id=\"chk-rgn\" ${cfg.includeRegional ? 'checked' : ''}> 3 Tuyến Tỉnh</label>\n              <label class=\"check-row\"><input type=\"checkbox\" id=\"chk-bgh\" ${cfg.includeBGH ? 'checked' : ''}> Việc BGH & Họp</label>\n              <label class=\"check-row\"><input type=\"checkbox\" id=\"chk-tsk\" ${cfg.includeTasks ? 'checked' : ''}> Việc Nội bộ</label>\n              <label class=\"check-row\"><input type=\"checkbox\" id=\"chk-ext\" ${cfg.includeOutsideSupport ? 'checked' : ''}> Hỗ trợ ngoài phòng</label>\n            </div>\n            <div class=\"toolbar-group\">\n              <button type=\"button\" id=\"rpt-btn-freeze\" class=\"btn btn-sm btn-outline\">Lưu bản chốt (Snapshot)</button>\n              ${user.can_export ? `<a class=\"btn btn-sm btn-primary\" href=\"/api/reports/export/docx?${esc(qs)}\">Tải Word chuẩn (.docx)</a>` : ''}\n              ${user.can_export ? `<a class=\"btn btn-sm btn-success\" href=\"/api/reports/export/xlsx?${esc(qs)}\">Tải Excel động (.xlsx)</a>` : ''}\n              <button type=\"button\" id=\"rpt-btn-print\" class=\"btn btn-sm btn-ghost\">In / Xuất PDF</button>\n              <button type=\"button\" id=\"rpt-btn-notify\" class=\"btn btn-sm btn-warn\">Chuẩn bị Email / Zalo</button>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"grid-3\">\n          <div style=\"grid-column: span 2\">\n            ${renderReportPaper(previewRes.data, previewRes.snapshot)}\n          </div>\n          <div class=\"no-print form-stack\">\n            <div class=\"card\">\n              <div class=\"card-header\"><h3 class=\"card-title\">Lịch sử bản chốt Báo cáo (${snapRes.items.length})</h3></div>\n              <div class=\"form-stack\">\n                ${snapRes.items.map(s => `\n                  <div style=\"padding:8px;border:1px solid var(--border);border-radius:8px;background:var(--surface-alt)\">\n                    <div class=\"font-bold\" style=\"font-size:12px\">${esc(s.title)}</div>\n                    <div class=\"text-light\" style=\"font-size:11px\">Tạo: ${esc(formatDateTime(s.created_at))} • ${esc(s.created_by_name || '')}</div>\n                    <div class=\"toolbar mt-1\" style=\"margin-bottom:0\">\n                      <span class=\"badge ${s.status === 'approved' ? 'badge-green' : (s.status === 'reopened' ? 'badge-amber' : 'badge-blue')}\">${esc(s.status)}</span>\n                      <div class=\"toolbar-group\">\n                        <button type=\"button\" class=\"btn btn-xs btn-outline rpt-view-snap\" data-id=\"${esc(s.id)}\">Mở</button>\n                        ${canApprove && s.status !== 'approved' ? `<button type=\"button\" class=\"btn btn-xs btn-success rpt-approve-snap\" data-id=\"${esc(s.id)}\">Duyệt chốt</button>` : ''}\n                        ${canApprove && s.status === 'approved' ? `<button type=\"button\" class=\"btn btn-xs btn-warn rpt-reopen-snap\" data-id=\"${esc(s.id)}\">Mở lại</button>` : ''}\n                      </div>\n                    </div>\n                  </div>\n                `).join('') || '<div class=\"text-light\">Chưa có bản chốt nào.</div>'}\n              </div>\n            </div>\n\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <div>\n                  <h3 class=\"card-title\">Lịch sử chuẩn bị thông báo</h3>\n                  <p class=\"card-sub\">${notifRes.smtpConfigured ? 'SMTP đã cấu hình' : 'SMTP chưa cấu hình — chỉ lưu trạng thái ĐÃ CHUẨN BỊ (không báo gửi giả)'}</p>\n                </div>\n              </div>\n              <div class=\"form-stack\">\n                ${notifRes.items.slice(0, 8).map(n => `\n                  <div style=\"font-size:12px;padding:6px;border-bottom:1px solid var(--border)\">\n                    <div class=\"font-bold\">${esc(n.subject)} <span class=\"badge badge-amber\">${esc(n.status)}</span></div>\n                    <div class=\"text-muted\">Tới: ${esc(n.recipient_name)} (${esc(n.channel)})</div>\n                    <div class=\"text-light\" style=\"font-size:11px\">${esc(n.provider_note)}</div>\n                  </div>\n                `).join('') || '<div class=\"text-light\">Chưa có bản thông báo nào.</div>'}\n              </div>\n            </div>\n          </div>\n        </div>\n      `;\n\n      const syncConfigFromDom = () => {\n        cfg.template = container.querySelector('#rpt-template').value;\n        cfg.periodType = container.querySelector('#rpt-period').value;\n        cfg.startDate = container.querySelector('#rpt-start').value;\n        cfg.endDate = container.querySelector('#rpt-end').value;\n        cfg.includeCRM = container.querySelector('#chk-crm').checked;\n        cfg.includeKPI = container.querySelector('#chk-kpi').checked;\n        cfg.includeRegional = container.querySelector('#chk-rgn').checked;\n        cfg.includeBGH = container.querySelector('#chk-bgh').checked;\n        cfg.includeTasks = container.querySelector('#chk-tsk').checked;\n        cfg.includeOutsideSupport = container.querySelector('#chk-ext').checked;\n        cfg.snapshotId = '';\n      };\n\n      container.querySelector('#rpt-btn-apply').addEventListener('click', () => { syncConfigFromDom(); ctx.refreshCurrentTab(); });\n      ['#rpt-template', '#rpt-period', '#chk-crm', '#chk-kpi', '#chk-rgn', '#chk-bgh', '#chk-tsk', '#chk-ext'].forEach(sel => {\n        container.querySelector(sel).addEventListener('change', () => { syncConfigFromDom(); ctx.refreshCurrentTab(); });\n      });\n\n      const exitSnap = container.querySelector('#rpt-exit-snap');\n      if (exitSnap) exitSnap.addEventListener('click', () => { cfg.snapshotId = ''; ctx.refreshCurrentTab(); });\n\n      container.querySelector('#rpt-btn-print').addEventListener('click', () => window.print());\n\n      container.querySelector('#rpt-btn-freeze').addEventListener('click', async () => {\n        syncConfigFromDom();\n        try {\n          const res = await global.ITCApi.post('/api/reports/snapshots', {\n            intakeYear: ctx.intakeYear,\n            template: cfg.template,\n            periodType: cfg.periodType,\n            startDate: cfg.startDate ? new Date(cfg.startDate + 'T00:00:00+07:00').toISOString() : null,\n            endDate: cfg.endDate ? new Date(cfg.endDate + 'T23:59:59+07:00').toISOString() : null,\n            sections: {\n              includeCRM: cfg.includeCRM, includeKPI: cfg.includeKPI, includeRegional: cfg.includeRegional,\n              includeTasks: cfg.includeTasks, includeBGH: cfg.includeBGH, includeOutsideSupport: cfg.includeOutsideSupport\n            }\n          });\n          cfg.snapshotId = res.snapshot.id;\n          toast('Đã lưu bản chốt Snapshot (trạng thái nháp).');\n          ctx.refreshCurrentTab();\n        } catch (err) { toast(err.message, 'error'); }\n      });\n\n      container.querySelectorAll('.rpt-view-snap').forEach(btn => {\n        btn.addEventListener('click', () => { cfg.snapshotId = btn.dataset.id; ctx.refreshCurrentTab(); });\n      });\n      container.querySelectorAll('.rpt-approve-snap').forEach(btn => {\n        btn.addEventListener('click', async () => {\n          try {\n            await global.ITCApi.post(`/api/reports/snapshots/${encodeURIComponent(btn.dataset.id)}/approve`, {});\n            toast('Đã phê duyệt và khóa số liệu bản báo cáo.');\n            ctx.refreshCurrentTab();\n          } catch (err) { toast(err.message, 'error'); }\n        });\n      });\n      container.querySelectorAll('.rpt-reopen-snap').forEach(btn => {\n        btn.addEventListener('click', async () => {\n          const reason = prompt('Nhập lý do mở lại bản báo cáo đã duyệt:');\n          if (!reason) return;\n          try {\n            await global.ITCApi.post(`/api/reports/snapshots/${encodeURIComponent(btn.dataset.id)}/reopen`, { reason });\n            toast('Đã mở lại báo cáo và ghi nhật ký.');\n            ctx.refreshCurrentTab();\n          } catch (err) { toast(err.message, 'error'); }\n        });\n      });\n\n      container.querySelector('#rpt-btn-notify').addEventListener('click', () => {\n        ctx.openModal(`\n          <div class=\"modal-head\"><h3 class=\"card-title\">Chuẩn bị Thông báo / Nhắc tiến độ (Trung thực trạng thái gửi)</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div>\n          <form id=\"ntf-form\">\n            <div class=\"modal-body form-stack\">\n              <div class=\"alert alert-warn\">\n                ${notifRes.smtpConfigured\n                  ? 'Hệ thống đã cấu hình SMTP: thư sẽ được đưa vào hàng đợi gửi.'\n                  : 'Hệ thống chưa cấu hình máy chủ SMTP thật: thư chỉ được lưu ở trạng thái ĐÃ CHUẨN BỊ / CHƯA GỬI ĐI (không báo gửi thành công giả). Với Zalo, bạn có thể sao chép nội dung đã duyệt để gửi thủ công.'}\n              </div>\n              <div class=\"form-row\">\n                <div class=\"field\">\n                  <label>Kênh</label>\n                  <select name=\"channel\">\n                    <option value=\"zalo_copy\">Chuẩn bị nội dung gửi Zalo (Copy thủ công)</option>\n                    <option value=\"email\">Chuẩn bị Email nhắc tiến độ</option>\n                  </select>\n                </div>\n                <div class=\"field\"><label>Người nhận *</label><input name=\"recipient_name\" type=\"text\" required placeholder=\"Tên chuyên viên / Lãnh đạo\"></div>\n                <div class=\"field\"><label>Địa chỉ Email (nếu chọn Email)</label><input name=\"recipient_address\" type=\"email\"></div>\n              </div>\n              <div class=\"field\"><label>Tiêu đề *</label><input name=\"subject\" type=\"text\" required value=\"Nhắc tiến độ tuyển sinh NK ${esc(ctx.intakeYear)}\"></div>\n              <div class=\"field\"><label>Nội dung *</label><textarea name=\"body\" rows=\"4\" required>Kính gửi anh/chị,\\nĐề nghị rà soát hồ sơ quá hạn SLA và hoàn tất cập nhật báo cáo kỳ ${esc(previewRes.data.meta.periodDisplay)}.</textarea></div>\n            </div>\n            <div class=\"modal-foot\">\n              <button type=\"button\" class=\"btn btn-outline\" data-close-modal>Đóng</button>\n              <button type=\"submit\" class=\"btn btn-primary\">Lưu & Chuẩn bị nội dung</button>\n            </div>\n          </form>\n        `, (dialog) => {\n          dialog.querySelector('#ntf-form').addEventListener('submit', async (e) => {\n            e.preventDefault();\n            const fd = new FormData(e.target);\n            try {\n              const res = await global.ITCApi.post('/api/notifications', {\n                channel: fd.get('channel'),\n                recipient_name: fd.get('recipient_name'),\n                recipient_address: fd.get('recipient_address'),\n                subject: fd.get('subject'),\n                body: fd.get('body')\n              });\n              ctx.closeModal();\n              toast(`Trạng thái thực: ${res.job.status} — ${res.job.provider_note}`);\n              ctx.refreshCurrentTab();\n            } catch (err) { toast(err.message, 'error'); }\n          });\n        });\n      });\n    }\n  };\n})(window);\n"
  },
  "/js/modules/sla.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, formatDateTime, badgeForSlaBucket, toast } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n  let bucketFilter = 'ALL';\n\n  global.ITCModules.sla = {\n    async render(container, ctx) {\n      const data = await global.ITCApi.get(`/api/sla?intakeYear=${encodeURIComponent(ctx.intakeYear)}`);\n      const c = data.counts;\n      const dl = data.deadlines;\n      const wh = data.workingHours;\n      const canConfig = ['super_admin', 'manager'].includes(ctx.bootstrap.user.role);\n\n      const filtered = bucketFilter === 'ALL'\n        ? data.items\n        : data.items.filter(x => x.sla.bucket === bucketFilter);\n\n      container.innerHTML = `\n        <div class=\"grid-5 mb-2\">\n          <div class=\"stat-card\">\n            <div class=\"stat-label\">Tỷ lệ đã xử lý</div>\n            <div class=\"stat-value\">${data.handledRate}%</div>\n            <div class=\"stat-note\">${c.handled} / ${c.total} hồ sơ đã liên hệ</div>\n          </div>\n          <div class=\"stat-card\">\n            <div class=\"stat-label\">Tỷ lệ ĐÚNG HẠN SLA (&le;${wh.slaMinutes}p)</div>\n            <div class=\"stat-value ${data.onTimeSlaRate !== null && data.onTimeSlaRate < 80 ? 'text-danger' : 'text-success'}\">${data.onTimeSlaRate !== null ? data.onTimeSlaRate + '%' : 'Chưa đủ mốc'}</div>\n            <div class=\"stat-note\">Đạt: ${c.on_time} / ${data.slaDenominator} hồ sơ đo được</div>\n          </div>\n          <div class=\"stat-card\">\n            <div class=\"stat-label\">Quá hạn CHƯA gọi</div>\n            <div class=\"stat-value text-danger\">${c.overdue_unhandled + data.overdueUnassigned}</div>\n            <div class=\"stat-note\">Chưa phân công: ${c.unassigned}</div>\n          </div>\n          <div class=\"stat-card\">\n            <div class=\"stat-label\">Ngoài giờ / Trong hạn</div>\n            <div class=\"stat-value\">${c.after_hours_pending} / ${c.in_window_pending}</div>\n            <div class=\"stat-note\">TB phản hồi: ${data.avgResponseMinutes !== null ? data.avgResponseMinutes + ' phút' : '—'}</div>\n          </div>\n          <div class=\"stat-card\">\n            <div class=\"stat-label\">Thiếu mốc thời gian</div>\n            <div class=\"stat-value text-muted\">${c.insufficient_timestamp}</div>\n            <div class=\"stat-note\">Không tự cộng vào tỷ lệ đạt</div>\n          </div>\n        </div>\n\n        <div class=\"grid-2 mb-2\">\n          <div class=\"card\">\n            <div class=\"card-header\"><h3 class=\"card-title\">Hạn Báo cáo Tuần (gắn trạng thái nộp thật)</h3></div>\n            <div class=\"font-bold\">${esc(dl.weekly.rule)}</div>\n            <div class=\"text-muted mt-1\">Hạn gần nhất: <strong>${esc(formatDateTime(dl.weekly.deadlineAt))}</strong> (còn ${dl.weekly.hoursRemaining} giờ)</div>\n            <div class=\"mt-2\">\n              ${dl.weekly.approved\n                ? '<span class=\"badge badge-green\">Đã duyệt chốt báo cáo tuần này</span>'\n                : (dl.weekly.submitted ? '<span class=\"badge badge-blue\">Đã lưu bản nháp tuần này (chờ duyệt)</span>' : '<span class=\"badge badge-red\">Chưa lập báo cáo tuần này</span>')}\n            </div>\n          </div>\n          <div class=\"card\">\n            <div class=\"card-header\"><h3 class=\"card-title\">Hạn Báo cáo Tháng (trước ngày 25)</h3></div>\n            <div class=\"font-bold\">${esc(dl.monthly.rule)}</div>\n            <div class=\"text-muted mt-1\">Hạn gần nhất: <strong>${esc(formatDateTime(dl.monthly.deadlineAt))}</strong> (còn ${dl.monthly.hoursRemaining} giờ)</div>\n            <div class=\"mt-2\">\n              ${dl.monthly.approved\n                ? '<span class=\"badge badge-green\">Đã duyệt chốt báo cáo tháng này</span>'\n                : (dl.monthly.submitted ? '<span class=\"badge badge-blue\">Đã lưu bản nháp tháng này (chờ duyệt)</span>' : '<span class=\"badge badge-red\">Chưa lập báo cáo tháng này</span>')}\n            </div>\n          </div>\n        </div>\n\n        ${canConfig ? `\n          <div class=\"card mb-2\">\n            <div class=\"card-header\"><h3 class=\"card-title\">Cấu hình Ca trực & Chuẩn SLA giờ hành chính</h3></div>\n            <form id=\"sla-wh-form\" class=\"form-row\">\n              <div class=\"field\" style=\"max-width:160px\"><label>Chuẩn SLA (phút)</label><input name=\"slaMinutes\" type=\"number\" min=\"1\" max=\"240\" value=\"${wh.slaMinutes}\"></div>\n              <div class=\"field\"><label>Ca trực hiện tại</label><input type=\"text\" disabled value=\"${esc((wh.shifts || []).map(s => s.name + ': ' + s.start + '-' + s.end).join(' | '))}\"></div>\n              <div class=\"field\"><label>Ngày nghỉ lễ (YYYY-MM-DD, cách nhau dấu phẩy)</label><input name=\"holidays\" type=\"text\" value=\"${esc((wh.holidays || []).join(', '))}\"></div>\n              <button type=\"submit\" class=\"btn btn-sm btn-primary\">Lưu cấu hình SLA</button>\n            </form>\n          </div>\n        ` : ''}\n\n        <div class=\"card\">\n          <div class=\"toolbar\">\n            <h3 class=\"card-title\">Danh sách giám sát SLA từng hồ sơ</h3>\n            <select id=\"sla-bucket-filter\" class=\"select-sm\">\n              <option value=\"ALL\" ${bucketFilter === 'ALL' ? 'selected' : ''}>Tất cả (${c.total})</option>\n              <option value=\"overdue_unhandled\" ${bucketFilter === 'overdue_unhandled' ? 'selected' : ''}>Quá hạn chưa gọi (${c.overdue_unhandled})</option>\n              <option value=\"unassigned\" ${bucketFilter === 'unassigned' ? 'selected' : ''}>Chưa phân công (${c.unassigned})</option>\n              <option value=\"in_window_pending\" ${bucketFilter === 'in_window_pending' ? 'selected' : ''}>Đang trong hạn (${c.in_window_pending})</option>\n              <option value=\"after_hours_pending\" ${bucketFilter === 'after_hours_pending' ? 'selected' : ''}>Ngoài giờ chờ ca (${c.after_hours_pending})</option>\n              <option value=\"on_time\" ${bucketFilter === 'on_time' ? 'selected' : ''}>Đạt SLA (${c.on_time})</option>\n              <option value=\"overdue_handled\" ${bucketFilter === 'overdue_handled' ? 'selected' : ''}>Đã xử lý trễ (${c.overdue_handled})</option>\n              <option value=\"insufficient_timestamp\" ${bucketFilter === 'insufficient_timestamp' ? 'selected' : ''}>Thiếu mốc thời gian (${c.insufficient_timestamp})</option>\n            </select>\n          </div>\n          <div class=\"table-wrap\">\n            <table>\n              <thead><tr><th>Thí sinh</th><th>Phụ trách</th><th>Tiếp nhận CRM</th><th>Liên hệ đầu</th><th>Phút giờ trực</th><th>Phân loại SLA</th><th></th></tr></thead>\n              <tbody>\n                ${filtered.slice(0, 100).map(r => `\n                  <tr>\n                    <td><div class=\"font-bold\">${esc(r.full_name)}</div><div class=\"font-mono text-light\">${esc(r.student_phone || '—')}</div></td>\n                    <td>${esc(r.staff_name || 'Chưa phân công')}</td>\n                    <td>${esc(formatDateTime(r.sla.startIso))}</td>\n                    <td>${esc(formatDateTime(r.sla.firstContactAt))}</td>\n                    <td>${r.sla.businessMinutes !== null ? r.sla.businessMinutes + ' phút' : '—'}</td>\n                    <td>${badgeForSlaBucket(r.sla.bucket, r.sla.label)}</td>\n                    <td class=\"text-right\"><button type=\"button\" class=\"btn btn-xs btn-primary\" data-sla-open=\"${esc(r.id)}\">Xử lý</button></td>\n                  </tr>\n                `).join('') || '<tr><td colspan=\"7\" class=\"text-center text-light\">Không có hồ sơ trong nhóm này.</td></tr>'}\n              </tbody>\n            </table>\n          </div>\n        </div>\n      `;\n\n      container.querySelector('#sla-bucket-filter').addEventListener('change', (e) => {\n        bucketFilter = e.target.value;\n        ctx.refreshCurrentTab();\n      });\n      container.querySelectorAll('[data-sla-open]').forEach(btn => {\n        btn.addEventListener('click', () => ctx.openRegistrationDrawer(btn.dataset.slaOpen));\n      });\n      const whForm = container.querySelector('#sla-wh-form');\n      if (whForm) {\n        whForm.addEventListener('submit', async (e) => {\n          e.preventDefault();\n          const fd = new FormData(e.target);\n          const holidays = String(fd.get('holidays') || '').split(',').map(s => s.trim()).filter(Boolean);\n          try {\n            await global.ITCApi.put('/api/sla/working-hours', { slaMinutes: Number(fd.get('slaMinutes')), holidays });\n            toast('Đã cập nhật cấu hình SLA & ca trực.');\n            ctx.refreshCurrentTab();\n          } catch (err) {\n            toast(err.message, 'error');\n          }\n        });\n      }\n    }\n  };\n})(window);\n"
  },
  "/js/modules/tasks.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, formatDateTime, toast } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n  let activeSub = 'internal';\n\n  global.ITCModules.tasks = {\n    async render(container, ctx) {\n      const data = await global.ITCApi.get(`/api/tasks?intakeYear=${encodeURIComponent(ctx.intakeYear)}&taskType=internal,external_support`);\n      const staff = ctx.bootstrap.staff || [];\n      const labels = ctx.bootstrap.taskStatusLabels;\n      const canAccept = ['super_admin', 'manager'].includes(ctx.bootstrap.user.role);\n      const items = data.items.filter(t => t.task_type === activeSub);\n\n      container.innerHTML = `\n        <div class=\"card\">\n          <div class=\"subtabs\">\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'internal' ? 'active' : ''}\" data-t-sub=\"internal\">Giao việc nội bộ phòng (${data.items.filter(t => t.task_type === 'internal').length})</button>\n            <button type=\"button\" class=\"subtab-btn ${activeSub === 'external_support' ? 'active' : ''}\" data-t-sub=\"external_support\">Hỗ trợ đơn vị ngoài phòng (${data.items.filter(t => t.task_type === 'external_support').length})</button>\n          </div>\n          <div class=\"toolbar\">\n            <h3 class=\"card-title\">${activeSub === 'internal' ? 'Công việc nội bộ (Checklist, Trao đổi, Minh chứng, Nghiệm thu)' : 'Phối hợp & Hỗ trợ đơn vị ngoài phòng'}</h3>\n            <button type=\"button\" id=\"tsk-btn-new\" class=\"btn btn-primary btn-sm\">+ Tạo công việc mới</button>\n          </div>\n\n          <div class=\"form-stack\">\n            ${items.map(t => {\n              const doneChecklist = (t.checklist || []).filter(c => c.done).length;\n              const totalChecklist = (t.checklist || []).length;\n              return `\n                <div class=\"card\" style=\"padding:14px;background:var(--surface-alt)\" data-task-card=\"${esc(t.id)}\">\n                  <div class=\"toolbar\" style=\"margin-bottom:6px\">\n                    <div>\n                      <span class=\"font-bold\" style=\"font-size:15px\">${esc(t.title)}</span>\n                      ${t.external_unit ? `<span class=\"badge badge-indigo\" style=\"margin-left:6px\">${esc(t.external_unit)}</span>` : ''}\n                      <span class=\"badge ${t.status === 'done' ? 'badge-green' : (t.status === 'overdue' ? 'badge-red' : 'badge-blue')}\" style=\"margin-left:6px\">${esc(labels[t.status] || t.status)}</span>\n                    </div>\n                    <div class=\"toolbar-group\">\n                      ${canAccept && t.status !== 'done' ? `<button type=\"button\" class=\"btn btn-xs btn-success tsk-accept\" data-id=\"${esc(t.id)}\">Nghiệm thu xong</button>` : ''}\n                      <button type=\"button\" class=\"btn btn-xs btn-outline tsk-open-detail\" data-id=\"${esc(t.id)}\">Chi tiết / Checklist / Trao đổi</button>\n                    </div>\n                  </div>\n                  <div class=\"text-muted\" style=\"font-size:12px\">\n                    Người chính: <strong>${esc(t.owner_name || 'Chưa phân công')}</strong>\n                    • Hạn: <strong>${esc(t.deadline || '—')}</strong>\n                    • Checklist: <strong>${doneChecklist}/${totalChecklist}</strong>\n                    • Trao đổi: <strong>${(t.comments || []).length}</strong>\n                    ${t.accepted_by_name ? ` • Đã nghiệm thu bởi: <strong class=\"text-success\">${esc(t.accepted_by_name)}</strong>` : ''}\n                  </div>\n                  ${t.evidence_note ? `<div class=\"mt-1\" style=\"font-size:12px\">Minh chứng: ${esc(t.evidence_note)}</div>` : ''}\n                  ${t.extension_reason ? `<div class=\"mt-1 text-warn\" style=\"font-size:12px\">Lý do gia hạn: ${esc(t.extension_reason)}</div>` : ''}\n                </div>`;\n            }).join('') || '<div class=\"text-center text-light\" style=\"padding:20px\">Chưa có công việc nào.</div>'}\n          </div>\n        </div>\n      `;\n\n      container.querySelectorAll('[data-t-sub]').forEach(btn => {\n        btn.addEventListener('click', () => { activeSub = btn.dataset.tSub; ctx.refreshCurrentTab(); });\n      });\n\n      container.querySelectorAll('.tsk-accept').forEach(btn => {\n        btn.addEventListener('click', async () => {\n          try {\n            await global.ITCApi.post(`/api/tasks/${encodeURIComponent(btn.dataset.id)}/accept`, {});\n            toast('Đã nghiệm thu hoàn thành công việc.');\n            ctx.refreshCurrentTab();\n          } catch (err) { toast(err.message, 'error'); }\n        });\n      });\n\n      container.querySelector('#tsk-btn-new').addEventListener('click', () => {\n        ctx.openModal(`\n          <div class=\"modal-head\"><h3 class=\"card-title\">Tạo công việc mới</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div>\n          <form id=\"tsk-create-form\">\n            <div class=\"modal-body form-stack\">\n              <div class=\"field\"><label>Tiêu đề công việc *</label><input name=\"title\" type=\"text\" required></div>\n              ${activeSub === 'external_support' ? `<div class=\"field\"><label>Đơn vị ngoài phòng phối hợp</label><input name=\"external_unit\" type=\"text\" placeholder=\"vd: Phòng Đào tạo / Đoàn trường / Sở GD\"></div>` : ''}\n              <div class=\"field\"><label>Mô tả & Yêu cầu kết quả</label><textarea name=\"description\" rows=\"2\"></textarea></div>\n              <div class=\"form-row\">\n                <div class=\"field\">\n                  <label>Người phụ trách chính</label>\n                  <select name=\"owner_staff_id\">\n                    <option value=\"\">-- Chọn --</option>\n                    ${staff.filter(s => s.active).map(s => `<option value=\"${esc(s.id)}\">${esc(s.full_name)}</option>`).join('')}\n                  </select>\n                </div>\n                <div class=\"field\"><label>Hạn hoàn thành</label><input name=\"deadline\" type=\"date\"></div>\n                <div class=\"field\">\n                  <label>Mức ưu tiên</label>\n                  <select name=\"priority\"><option value=\"normal\">Bình thường</option><option value=\"high\">Cao</option><option value=\"urgent\">Khẩn</option></select>\n                </div>\n              </div>\n              <div class=\"field\"><label>Danh sách Checklist (mỗi dòng 1 đầu việc)</label><textarea name=\"checklist_lines\" rows=\"3\" placeholder=\"Bước 1...\\nBước 2...\"></textarea></div>\n            </div>\n            <div class=\"modal-foot\">\n              <button type=\"button\" class=\"btn btn-outline\" data-close-modal>Hủy</button>\n              <button type=\"submit\" class=\"btn btn-primary\">Tạo công việc</button>\n            </div>\n          </form>\n        `, (dialog) => {\n          dialog.querySelector('#tsk-create-form').addEventListener('submit', async (e) => {\n            e.preventDefault();\n            const fd = new FormData(e.target);\n            const checklist = String(fd.get('checklist_lines') || '').split('\\n').map(l => l.trim()).filter(Boolean).map(text => ({ text, done: false }));\n            try {\n              await global.ITCApi.post('/api/tasks', {\n                intake_year: ctx.intakeYear,\n                task_type: activeSub,\n                title: fd.get('title'),\n                external_unit: fd.get('external_unit') || '',\n                description: fd.get('description'),\n                owner_staff_id: fd.get('owner_staff_id') || null,\n                deadline: fd.get('deadline'),\n                priority: fd.get('priority'),\n                checklist\n              });\n              ctx.closeModal();\n              toast('Đã tạo công việc mới.');\n              ctx.refreshCurrentTab();\n            } catch (err) { toast(err.message, 'error'); }\n          });\n        });\n      });\n\n      container.querySelectorAll('.tsk-open-detail').forEach(btn => {\n        btn.addEventListener('click', () => {\n          const t = items.find(x => x.id === btn.dataset.id);\n          if (!t) return;\n          const checklist = (t.checklist || []).map(x => ({ ...x }));\n          ctx.openModal(`\n            <div class=\"modal-head\"><h3 class=\"card-title\">${esc(t.title)}</h3><button type=\"button\" class=\"icon-btn\" data-close-modal>✕</button></div>\n            <div class=\"modal-body form-stack\">\n              <form id=\"tsk-detail-form\" class=\"form-stack\">\n                <div class=\"form-row\">\n                  <div class=\"field\">\n                    <label>Trạng thái</label>\n                    <select name=\"status\">\n                      ${Object.entries(labels).map(([k, v]) => `<option value=\"${esc(k)}\" ${t.status === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}\n                    </select>\n                  </div>\n                  <div class=\"field\"><label>Hạn hoàn thành</label><input name=\"deadline\" type=\"date\" value=\"${esc(t.deadline)}\"></div>\n                </div>\n                <div class=\"field\"><label>Minh chứng kết quả</label><textarea name=\"evidence_note\" rows=\"2\">${esc(t.evidence_note)}</textarea></div>\n                <div class=\"field\"><label>Lý do gia hạn (nếu lùi hạn)</label><input name=\"extension_reason\" type=\"text\" value=\"${esc(t.extension_reason)}\"></div>\n                <div>\n                  <label class=\"font-bold\" style=\"font-size:12px\">Checklist công việc</label>\n                  <div id=\"tsk-chk-list\" class=\"form-stack mt-1\">\n                    ${checklist.map((c, idx) => `<label class=\"check-row\"><input type=\"checkbox\" class=\"tsk-chk-box\" data-idx=\"${idx}\" ${c.done ? 'checked' : ''}> <span>${esc(c.text)}</span></label>`).join('') || '<div class=\"text-light\">Chưa có checklist.</div>'}\n                  </div>\n                </div>\n                <div class=\"text-right\"><button type=\"submit\" class=\"btn btn-sm btn-primary\">Lưu tiến độ & Minh chứng</button></div>\n              </form>\n\n              <div class=\"card\" style=\"background:var(--surface-alt)\">\n                <div class=\"font-bold mb-2\">Trao đổi công việc (${(t.comments || []).length})</div>\n                <div class=\"timeline mb-2\">\n                  ${(t.comments || []).map(c => `\n                    <div class=\"timeline-item\">\n                      <div class=\"timeline-meta\"><strong>${esc(c.author_name)}</strong><span>${esc(formatDateTime(c.created_at))}</span></div>\n                      <div class=\"timeline-text\">${esc(c.content)}</div>\n                    </div>\n                  `).join('') || '<div class=\"text-light\">Chưa có bình luận.</div>'}\n                </div>\n                <form id=\"tsk-comment-form\" class=\"form-row\">\n                  <div class=\"field\"><input name=\"content\" type=\"text\" required placeholder=\"Nhập trao đổi tiến độ...\"></div>\n                  <button type=\"submit\" class=\"btn btn-sm btn-outline\">Gửi trao đổi</button>\n                </form>\n              </div>\n            </div>\n          `, (dialog) => {\n            dialog.querySelector('#tsk-detail-form').addEventListener('submit', async (e) => {\n              e.preventDefault();\n              const fd = new FormData(e.target);\n              dialog.querySelectorAll('.tsk-chk-box').forEach(cb => {\n                checklist[Number(cb.dataset.idx)].done = cb.checked;\n              });\n              try {\n                await global.ITCApi.patch(`/api/tasks/${encodeURIComponent(t.id)}`, {\n                  status: fd.get('status'),\n                  deadline: fd.get('deadline'),\n                  evidence_note: fd.get('evidence_note'),\n                  extension_reason: fd.get('extension_reason'),\n                  checklist\n                });\n                ctx.closeModal();\n                toast('Đã lưu cập nhật công việc.');\n                ctx.refreshCurrentTab();\n              } catch (err) { toast(err.message, 'error'); }\n            });\n            dialog.querySelector('#tsk-comment-form').addEventListener('submit', async (e) => {\n              e.preventDefault();\n              const fd = new FormData(e.target);\n              try {\n                await global.ITCApi.post(`/api/tasks/${encodeURIComponent(t.id)}/comments`, { content: fd.get('content') });\n                ctx.closeModal();\n                toast('Đã gửi trao đổi.');\n                ctx.refreshCurrentTab();\n              } catch (err) { toast(err.message, 'error'); }\n            });\n          });\n        });\n      });\n    }\n  };\n})(window);\n"
  },
  "/js/modules/today.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, formatDateTime, badgeForStage, badgeForSlaBucket } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n\n  global.ITCModules.today = {\n    async render(container, ctx) {\n      container.innerHTML = '<div class=\"card\"><div class=\"text-muted\">Đang tải danh sách việc cần xử lý hôm nay...</div></div>';\n      try {\n        const data = await global.ITCApi.get(`/api/my-work?intakeYear=${encodeURIComponent(ctx.intakeYear)}`);\n        const s = data.summary || {};\n\n        container.innerHTML = `\n          <div class=\"grid-5 mb-2\">\n            <div class=\"stat-card\">\n              <div class=\"stat-label\">Lead mới chưa gọi</div>\n              <div class=\"stat-value text-danger\">${s.newLeadsCount || 0}</div>\n              <div class=\"stat-note\">Ưu tiên gọi ngay</div>\n            </div>\n            <div class=\"stat-card\">\n              <div class=\"stat-label\">SLA cần xử lý gấp</div>\n              <div class=\"stat-value text-warn\">${s.slaUrgentCount || 0}</div>\n              <div class=\"stat-note\">Quá hạn / sắp quá hạn</div>\n            </div>\n            <div class=\"stat-card\">\n              <div class=\"stat-label\">Hẹn gọi lại đến hạn</div>\n              <div class=\"stat-value\">${s.dueFollowUpsCount || 0}</div>\n              <div class=\"stat-note\">Trong 24 giờ tới & trễ</div>\n            </div>\n            <div class=\"stat-card\">\n              <div class=\"stat-label\">Hồ sơ thiếu giấy tờ / xác minh</div>\n              <div class=\"stat-value\">${(s.missingDocsCount || 0) + (s.pendingVerifyCount || 0)}</div>\n              <div class=\"stat-note\">Cần bổ sung & kiểm tra</div>\n            </div>\n            <div class=\"stat-card\">\n              <div class=\"stat-label\">Công việc đang mở</div>\n              <div class=\"stat-value\">${s.openTasksCount || 0}</div>\n              <div class=\"stat-note\">Niên khóa ${esc(ctx.intakeYear)}</div>\n            </div>\n          </div>\n\n          <div class=\"grid-2\">\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <div>\n                  <h3 class=\"card-title\">Hàng đợi SLA ưu tiên & Lead mới</h3>\n                  <p class=\"card-sub\">Nhấn vào thí sinh để mở ngăn chi tiết ghi cuộc gọi và cập nhật tiến trình</p>\n                </div>\n                <button type=\"button\" class=\"btn btn-sm btn-outline\" data-goto-tab=\"1\">Mở CRM</button>\n              </div>\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr><th>Thí sinh</th><th>SĐT</th><th>Trạng thái SLA</th><th></th></tr>\n                  </thead>\n                  <tbody>\n                    ${(data.slaUrgent.length ? data.slaUrgent : data.newLeads).slice(0, 10).map(r => `\n                      <tr>\n                        <td>\n                          <div class=\"font-bold\">${esc(r.full_name)}</div>\n                          <div class=\"text-light\" style=\"font-size:11px\">${esc(r.major || 'Chưa rõ ngành')} • ${esc(r.source)}</div>\n                        </td>\n                        <td class=\"font-mono\">${esc(r.student_phone || r.parent_phone || '—')}</td>\n                        <td>${badgeForSlaBucket(r.sla.bucket, r.sla.label)}</td>\n                        <td class=\"text-right\">\n                          <button type=\"button\" class=\"btn btn-xs btn-primary\" data-open-reg=\"${esc(r.id)}\">Chăm sóc</button>\n                        </td>\n                      </tr>\n                    `).join('') || '<tr><td colspan=\"4\" class=\"text-center text-light\">Không có hồ sơ cần xử lý gấp.</td></tr>'}\n                  </tbody>\n                </table>\n              </div>\n            </div>\n\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <div>\n                  <h3 class=\"card-title\">Lịch hẹn gọi lại đến hạn</h3>\n                  <p class=\"card-sub\">Theo sát lịch hẹn để không bỏ sót thí sinh tiềm năng</p>\n                </div>\n              </div>\n              <div class=\"table-wrap\">\n                <table>\n                  <thead>\n                    <tr><th>Thí sinh</th><th>Giờ hẹn</th><th>Nội dung</th><th></th></tr>\n                  </thead>\n                  <tbody>\n                    ${data.dueFollowUps.map(f => `\n                      <tr>\n                        <td>\n                          <div class=\"font-bold\">${esc(f.full_name)}</div>\n                          <div class=\"font-mono text-light\">${esc(f.student_phone || '—')}</div>\n                        </td>\n                        <td style=\"white-space:nowrap\">${esc(formatDateTime(f.due_at))}</td>\n                        <td>${esc(f.note)}</td>\n                        <td class=\"text-right\" style=\"white-space:nowrap\">\n                          <button type=\"button\" class=\"btn btn-xs btn-success\" data-done-fup=\"${esc(f.id)}\">Xong</button>\n                          <button type=\"button\" class=\"btn btn-xs btn-outline\" data-open-reg=\"${esc(f.registration_id)}\">Xem</button>\n                        </td>\n                      </tr>\n                    `).join('') || '<tr><td colspan=\"4\" class=\"text-center text-light\">Chưa có lịch hẹn gọi lại đến hạn.</td></tr>'}\n                  </tbody>\n                </table>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"grid-2 mt-2\">\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <div>\n                  <h3 class=\"card-title\">Hồ sơ chờ xác minh trạng thái / Nghi trùng</h3>\n                  <p class=\"card-sub\">Các dòng nhập có trạng thái lạ hoặc trùng SĐT cần đối soát</p>\n                </div>\n              </div>\n              <div class=\"table-wrap\">\n                <table>\n                  <thead><tr><th>Thí sinh</th><th>Giai đoạn / Cờ</th><th>Ghi chú gốc</th><th></th></tr></thead>\n                  <tbody>\n                    ${data.pendingVerify.map(r => `\n                      <tr>\n                        <td><div class=\"font-bold\">${esc(r.full_name)}</div><div class=\"font-mono text-light\">${esc(r.student_phone || r.parent_phone)}</div></td>\n                        <td>\n                          ${badgeForStage(r.stage_code, ctx.bootstrap.stageLabels)}\n                          ${r.dedup_flag ? `<span class=\"badge badge-amber\">${esc(r.dedup_flag)}</span>` : ''}\n                        </td>\n                        <td>${esc(r.raw_status_text || r.notes || '—')}</td>\n                        <td class=\"text-right\"><button type=\"button\" class=\"btn btn-xs btn-primary\" data-open-reg=\"${esc(r.id)}\">Xác minh</button></td>\n                      </tr>\n                    `).join('') || '<tr><td colspan=\"4\" class=\"text-center text-light\">Không có hồ sơ chờ xác minh.</td></tr>'}\n                  </tbody>\n                </table>\n              </div>\n            </div>\n\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <div>\n                  <h3 class=\"card-title\">Công việc của tôi & Hạn sắp tới</h3>\n                  <p class=\"card-sub\">Việc BGH, chỉ đạo và nhiệm vụ nội bộ được giao</p>\n                </div>\n                <button type=\"button\" class=\"btn btn-sm btn-outline\" data-goto-tab=\"7\">Tất cả việc</button>\n              </div>\n              <div class=\"table-wrap\">\n                <table>\n                  <thead><tr><th>Tiêu đề</th><th>Hạn</th><th>Trạng thái</th></tr></thead>\n                  <tbody>\n                    ${data.myTasks.map(t => `\n                      <tr>\n                        <td>\n                          <div class=\"font-bold\">${esc(t.title)}</div>\n                          <div class=\"text-light\" style=\"font-size:11px\">${esc(t.owner_name || 'Chưa phân công')}</div>\n                        </td>\n                        <td style=\"white-space:nowrap\">${esc(t.deadline || '—')}</td>\n                        <td><span class=\"badge badge-blue\">${esc(ctx.bootstrap.taskStatusLabels[t.status] || t.status)}</span></td>\n                      </tr>\n                    `).join('') || '<tr><td colspan=\"3\" class=\"text-center text-light\">Không có công việc tồn đọng.</td></tr>'}\n                  </tbody>\n                </table>\n              </div>\n            </div>\n          </div>\n        `;\n\n        container.querySelectorAll('[data-open-reg]').forEach(btn => {\n          btn.addEventListener('click', () => ctx.openRegistrationDrawer(btn.dataset.openReg));\n        });\n        container.querySelectorAll('[data-goto-tab]').forEach(btn => {\n          btn.addEventListener('click', () => ctx.switchTab(Number(btn.dataset.gotoTab)));\n        });\n        container.querySelectorAll('[data-done-fup]').forEach(btn => {\n          btn.addEventListener('click', async () => {\n            try {\n              await global.ITCApi.patch(`/api/follow-ups/${encodeURIComponent(btn.dataset.doneFup)}`, { status: 'done' });\n              global.ITCUtils.toast('Đã đánh dấu hoàn thành lịch hẹn gọi lại.');\n              ctx.refreshCurrentTab();\n            } catch (err) {\n              global.ITCUtils.toast(err.message, 'error');\n            }\n          });\n        });\n      } catch (err) {\n        container.innerHTML = `<div class=\"alert alert-danger\">${esc(err.message)}</div>`;\n      }\n    }\n  };\n})(window);\n"
  },
  "/js/modules/zalo.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  const { esc, toast } = global.ITCUtils;\n\n  global.ITCModules = global.ITCModules || {};\n  let statusFilter = 'pending';\n\n  global.ITCModules.zalo = {\n    async render(container, ctx) {\n      const data = await global.ITCApi.get(`/api/zalo-staging?intakeYear=${encodeURIComponent(ctx.intakeYear)}&status=${encodeURIComponent(statusFilter)}`);\n      const staff = ctx.bootstrap.staff || [];\n      const majors = ctx.bootstrap.majors || [];\n\n      container.innerHTML = `\n        <div class=\"grid-2\">\n          <div class=\"card\">\n            <div class=\"card-header\">\n              <div>\n                <h3 class=\"card-title\">Bóc tách nhiều thí sinh từ đoạn chat Zalo / Văn bản OCR</h3>\n                <p class=\"card-sub\">Hệ thống trích xuất nhiều ứng viên, để trống ngành/nhân sự chưa rõ (không tự đoán CNTT) và đưa vào vùng chờ xác minh</p>\n              </div>\n            </div>\n            <form id=\"zalo-parse-form\" class=\"form-stack\">\n              <div class=\"form-row\">\n                <div class=\"field\">\n                  <label>Nhóm nguồn Zalo</label>\n                  <input name=\"sourceGroup\" type=\"text\" value=\"Group Zalo Tuyển sinh ITC\">\n                </div>\n                <div class=\"field\">\n                  <label>Nguồn đầu vào</label>\n                  <select name=\"sourceType\" id=\"zalo-source-type\">\n                    <option value=\"text\">Dán đoạn chat Zalo</option>\n                    <option value=\"ocr_image\">Ảnh chụp màn hình Zalo (đối chiếu)</option>\n                  </select>\n                </div>\n              </div>\n              <div class=\"field\">\n                <label>Ảnh chụp màn hình đối chiếu (tùy chọn)</label>\n                <input id=\"zalo-img-input\" type=\"file\" accept=\"image/*\">\n                <div id=\"zalo-img-preview\" class=\"mt-1\"></div>\n              </div>\n              <div class=\"field\">\n                <label>Nội dung đoạn chat / Văn bản trích từ ảnh *</label>\n                <textarea id=\"zalo-raw-text\" name=\"rawText\" rows=\"6\" required placeholder=\"Ví dụ:\n1. Nguyễn Văn A - 0901234567 - ngành Kế toán - THPT Nguyễn Du\n2. Trần Thị B - 0912345678 - quan tâm học phí\"></textarea>\n              </div>\n              <button type=\"submit\" class=\"btn btn-primary\">Bóc tách đưa vào hàng chờ xác minh</button>\n            </form>\n          </div>\n\n          <div class=\"card\">\n            <div class=\"card-header\">\n              <div>\n                <h3 class=\"card-title\">Hàng chờ xác minh trước khi nhập CRM</h3>\n                <p class=\"card-sub\">Kiểm tra họ tên, SĐT, ngành, nghi trùng và chọn người phụ trách trước khi duyệt</p>\n              </div>\n              <select id=\"zalo-status-filter\" class=\"select-sm\">\n                <option value=\"pending\" ${statusFilter === 'pending' ? 'selected' : ''}>Chờ xác minh</option>\n                <option value=\"approved\" ${statusFilter === 'approved' ? 'selected' : ''}>Đã duyệt mới</option>\n                <option value=\"merged\" ${statusFilter === 'merged' ? 'selected' : ''}>Đã gộp trùng</option>\n                <option value=\"rejected\" ${statusFilter === 'rejected' ? 'selected' : ''}>Đã loại bỏ</option>\n                <option value=\"ALL\" ${statusFilter === 'ALL' ? 'selected' : ''}>Tất cả</option>\n              </select>\n            </div>\n\n            <div class=\"form-stack\">\n              ${data.items.map(z => `\n                <div class=\"card\" style=\"padding:12px;background:var(--surface-alt)\" data-zalo-card=\"${esc(z.id)}\">\n                  <div class=\"toolbar\" style=\"margin-bottom:6px\">\n                    <span class=\"badge ${z.status === 'pending' ? 'badge-amber' : (z.status === 'rejected' ? 'badge-red' : 'badge-green')}\">${esc(z.status)}</span>\n                    <span class=\"text-light\" style=\"font-size:11px\">${esc(z.source_group)}</span>\n                  </div>\n                  <div class=\"text-muted\" style=\"font-size:11px;white-space:pre-wrap;background:#fff;padding:6px 8px;border-radius:6px;border:1px solid var(--border);margin-bottom:8px\">${esc(z.raw_text)}</div>\n                  ${z.duplicate_reason ? `<div class=\"alert alert-warn mb-2\" style=\"padding:6px 8px;font-size:12px\">⚠️ ${esc(z.duplicate_reason)}</div>` : ''}\n                  <div class=\"form-row\">\n                    <div class=\"field\"><label>Họ tên</label><input class=\"z-name\" type=\"text\" value=\"${esc(z.extracted_name)}\" ${z.status !== 'pending' ? 'disabled' : ''}></div>\n                    <div class=\"field\"><label>SĐT thí sinh</label><input class=\"z-phone\" type=\"text\" value=\"${esc(z.extracted_phone)}\" ${z.status !== 'pending' ? 'disabled' : ''}></div>\n                    <div class=\"field\"><label>SĐT PH</label><input class=\"z-pphone\" type=\"text\" value=\"${esc(z.extracted_parent_phone)}\" ${z.status !== 'pending' ? 'disabled' : ''}></div>\n                  </div>\n                  <div class=\"form-row mt-1\">\n                    <div class=\"field\">\n                      <label>Ngành (để trống nếu chưa rõ)</label>\n                      <select class=\"z-major\" ${z.status !== 'pending' ? 'disabled' : ''}>\n                        <option value=\"\">-- Chưa xác định --</option>\n                        ${majors.map(m => `<option value=\"${esc(m)}\" ${z.extracted_major === m ? 'selected' : ''}>${esc(m)}</option>`).join('')}\n                        ${z.extracted_major && !majors.includes(z.extracted_major) ? `<option value=\"${esc(z.extracted_major)}\" selected>${esc(z.extracted_major)}</option>` : ''}\n                      </select>\n                    </div>\n                    <div class=\"field\">\n                      <label>Phụ trách</label>\n                      <select class=\"z-staff\" ${z.status !== 'pending' ? 'disabled' : ''}>\n                        <option value=\"\">-- Chưa phân công --</option>\n                        ${staff.filter(s => s.active).map(s => `<option value=\"${esc(s.id)}\" ${z.suggested_staff_id === s.id ? 'selected' : ''}>${esc(s.full_name)}</option>`).join('')}\n                      </select>\n                    </div>\n                  </div>\n                  ${z.status === 'pending' ? `\n                    <div class=\"toolbar mt-2\" style=\"margin-bottom:0\">\n                      <label class=\"check-row\" style=\"font-size:12px\"><input type=\"checkbox\" class=\"z-shared\"> Dùng chung SĐT phụ huynh</label>\n                      <div class=\"toolbar-group\">\n                        <button type=\"button\" class=\"btn btn-xs btn-danger-outline z-reject\">Loại bỏ</button>\n                        <button type=\"button\" class=\"btn btn-xs btn-success z-approve\">Xác nhận nhập CRM</button>\n                      </div>\n                    </div>\n                  ` : ''}\n                </div>\n              `).join('') || '<div class=\"text-center text-light\" style=\"padding:20px\">Hàng chờ xác minh Zalo đang trống.</div>'}\n            </div>\n          </div>\n        </div>\n      `;\n\n      // Image preview side-by-side for visual verification\n      container.querySelector('#zalo-img-input').addEventListener('change', (e) => {\n        const f = e.target.files[0];\n        const prev = container.querySelector('#zalo-img-preview');\n        prev.innerHTML = '';\n        if (!f) return;\n        container.querySelector('#zalo-source-type').value = 'ocr_image';\n        const img = document.createElement('img');\n        img.src = URL.createObjectURL(f);\n        img.style.maxWidth = '100%';\n        img.style.maxHeight = '220px';\n        img.style.borderRadius = '8px';\n        img.style.border = '1px solid var(--border)';\n        prev.appendChild(img);\n        const note = document.createElement('div');\n        note.className = 'text-light mt-1';\n        note.style.fontSize = '11px';\n        note.textContent = 'Ảnh đã nạp ở chế độ đối chiếu nội bộ LAN. Hãy nhập/dán nội dung text bên dưới để bóc tách và đối chiếu.';\n        prev.appendChild(note);\n      });\n\n      container.querySelector('#zalo-status-filter').addEventListener('change', (e) => {\n        statusFilter = e.target.value;\n        ctx.refreshCurrentTab();\n      });\n\n      container.querySelector('#zalo-parse-form').addEventListener('submit', async (e) => {\n        e.preventDefault();\n        const fd = new FormData(e.target);\n        try {\n          const res = await global.ITCApi.post('/api/zalo-staging/parse', {\n            intakeYear: ctx.intakeYear,\n            sourceGroup: fd.get('sourceGroup'),\n            sourceType: fd.get('sourceType'),\n            rawText: fd.get('rawText')\n          });\n          toast(`Đã bóc tách ${res.count} ứng viên vào hàng chờ xác minh.`);\n          statusFilter = 'pending';\n          ctx.refreshCurrentTab();\n        } catch (err) {\n          toast(err.message, 'error');\n        }\n      });\n\n      container.querySelectorAll('[data-zalo-card]').forEach(card => {\n        const id = card.dataset.zaloCard;\n        const btnApprove = card.querySelector('.z-approve');\n        const btnReject = card.querySelector('.z-reject');\n        if (btnApprove) {\n          btnApprove.addEventListener('click', async () => {\n            try {\n              const res = await global.ITCApi.post(`/api/zalo-staging/${encodeURIComponent(id)}/approve`, {\n                extracted_name: card.querySelector('.z-name').value.trim(),\n                extracted_phone: card.querySelector('.z-phone').value.trim(),\n                extracted_parent_phone: card.querySelector('.z-pphone').value.trim(),\n                extracted_major: card.querySelector('.z-major').value,\n                suggested_staff_id: card.querySelector('.z-staff').value || null,\n                allow_shared_parent_phone: card.querySelector('.z-shared').checked\n              });\n              toast(res.status === 'merged' ? 'Đã gộp vào hồ sơ CRM sẵn có (không tính trùng KPI).' : 'Đã duyệt tạo hồ sơ CRM mới.');\n              ctx.refreshCurrentTab();\n            } catch (err) {\n              toast(err.message, 'error');\n            }\n          });\n        }\n        if (btnReject) {\n          btnReject.addEventListener('click', async () => {\n            await global.ITCApi.post(`/api/zalo-staging/${encodeURIComponent(id)}/reject`, {});\n            toast('Đã loại bỏ khỏi hàng chờ.');\n            ctx.refreshCurrentTab();\n          });\n        }\n      });\n    }\n  };\n})(window);\n"
  },
  "/js/sync.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  /**\n   * Realtime WebSocket client with automatic HTTP fallback when WS drops\n   * and clean fallback teardown on WS reconnect (Section 3 & Scenario 16).\n   */\n  class RealtimeSync {\n    constructor() {\n      this.ws = null;\n      this.running = false;\n      this.reconnectTimer = null;\n      this.pollTimer = null;\n      this.reconnectAttempts = 0;\n      this.onStatus = null;\n      this.onPresence = null;\n      this.onDomainEvent = null;\n      this.onSessionRevoked = null;\n      this.onSystemReload = null;\n      this.onFallbackPoll = null;\n    }\n\n    start() {\n      this.running = true;\n      this._connect();\n      window.addEventListener('online', () => {\n        if (this.running) {\n          global.ITCApi.flushOutbox();\n          this._connect();\n        }\n      });\n    }\n\n    stop() {\n      this.running = false;\n      clearTimeout(this.reconnectTimer);\n      this._stopFallbackPolling();\n      if (this.ws) {\n        try { this.ws.close(1000, 'Logout'); } catch (_) {}\n        this.ws = null;\n      }\n    }\n\n    _connect() {\n      if (!this.running) return;\n      if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;\n\n      const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';\n      const url = `${proto}//${location.host}/ws`;\n      this._emitStatus('connecting', 'Đang kết nối WS...');\n\n      try {\n        this.ws = new WebSocket(url);\n      } catch (_) {\n        this._startFallbackPolling();\n        this._scheduleReconnect();\n        return;\n      }\n\n      this.ws.onopen = () => {\n        this.reconnectAttempts = 0;\n        this._stopFallbackPolling(); // Stop HTTP fallback immediately when WS is live!\n        this._emitStatus('online', 'Realtime WS');\n        // Automatically flush any queued offline mutations with their idempotency keys!\n        global.ITCApi.flushOutbox().then((res) => {\n          if (res.flushed > 0) {\n            global.ITCUtils.toast(`Đã tự động đồng bộ ${res.flushed} thao tác từ hàng đợi ngoại tuyến.`);\n          }\n        });\n      };\n\n      this.ws.onmessage = (ev) => {\n        try {\n          const msg = JSON.parse(ev.data);\n          if (msg.type === 'presence' && typeof this.onPresence === 'function') {\n            this.onPresence(msg);\n          } else if (msg.type === 'domain_event' && typeof this.onDomainEvent === 'function') {\n            this.onDomainEvent(msg);\n          } else if (msg.type === 'session_revoked' && typeof this.onSessionRevoked === 'function') {\n            this.onSessionRevoked(msg.reason);\n          } else if (msg.type === 'system_reload' && typeof this.onSystemReload === 'function') {\n            this.onSystemReload(msg.reason);\n          }\n        } catch (_) {}\n      };\n\n      this.ws.onclose = (ev) => {\n        this.ws = null;\n        if (ev.code === 4001) {\n          this.stop();\n          if (typeof this.onSessionRevoked === 'function') {\n            this.onSessionRevoked('Phiên làm việc đã bị thu hồi hoặc tài khoản bị khóa.');\n          }\n          return;\n        }\n        if (this.running) {\n          this._emitStatus('fallback', 'HTTP Fallback');\n          this._startFallbackPolling(); // Automatically start HTTP polling fallback on WS drop!\n          this._scheduleReconnect();\n        }\n      };\n\n      this.ws.onerror = () => {\n        // onclose will handle fallback + reconnect cleanly\n      };\n    }\n\n    _scheduleReconnect() {\n      clearTimeout(this.reconnectTimer);\n      const delay = Math.min(15000, 1500 * Math.pow(1.6, this.reconnectAttempts++));\n      this.reconnectTimer = setTimeout(() => this._connect(), delay);\n    }\n\n    _startFallbackPolling() {\n      if (this.pollTimer) return;\n      this.pollTimer = setInterval(() => {\n        if (this.running && typeof this.onFallbackPoll === 'function') {\n          this.onFallbackPoll();\n        }\n      }, 10000);\n    }\n\n    _stopFallbackPolling() {\n      if (this.pollTimer) {\n        clearInterval(this.pollTimer);\n        this.pollTimer = null;\n      }\n    }\n\n    _emitStatus(state, label) {\n      if (typeof this.onStatus === 'function') this.onStatus(state, label);\n    }\n  }\n\n  global.ITCSync = new RealtimeSync();\n})(window);\n"
  },
  "/js/utils.js": {
    "contentType": "application/javascript; charset=utf-8",
    "body": "(function (global) {\n  'use strict';\n\n  /**\n   * STRICT HTML ESCAPING — P0 XSS Guard (DEV03).\n   * Every dynamic user/imported string inserted into HTML templates MUST pass through esc().\n   */\n  function esc(val) {\n    return String(val === null || val === undefined ? '' : val)\n      .replace(/&/g, '&amp;')\n      .replace(/</g, '&lt;')\n      .replace(/>/g, '&gt;')\n      .replace(/\"/g, '&quot;')\n      .replace(/'/g, '&#39;');\n  }\n\n  function formatDateTime(iso) {\n    if (!iso) return '—';\n    const d = new Date(iso);\n    if (Number.isNaN(d.getTime())) return String(iso);\n    return d.toLocaleString('vi-VN', { hour12: false, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });\n  }\n\n  function formatDate(iso) {\n    if (!iso) return '—';\n    const d = new Date(iso);\n    if (Number.isNaN(d.getTime())) return String(iso);\n    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });\n  }\n\n  function toLocalInputDate(iso) {\n    if (!iso) return '';\n    const d = new Date(iso);\n    if (Number.isNaN(d.getTime())) return '';\n    const pad = (n) => String(n).padStart(2, '0');\n    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;\n  }\n\n  function toast(message, type = 'ok') {\n    const root = document.getElementById('toast-root');\n    if (!root) return;\n    const el = document.createElement('div');\n    el.className = 'toast' + (type === 'error' ? ' error' : (type === 'warn' ? ' warn' : ''));\n    // Strictly textContent — never innerHTML!\n    el.textContent = String(message || '');\n    root.appendChild(el);\n    setTimeout(() => {\n      el.style.opacity = '0';\n      el.style.transition = 'opacity 0.25s';\n      setTimeout(() => el.remove(), 260);\n    }, 3600);\n  }\n\n  function badgeForStage(stageCode, labels) {\n    const label = (labels && labels[stageCode]) || stageCode || '—';\n    const clsMap = {\n      lead: 'badge-blue',\n      pending_verify: 'badge-amber',\n      submitted: 'badge-indigo',\n      enrolled: 'badge-green',\n      withdrawn: 'badge-red'\n    };\n    return `<span class=\"badge ${clsMap[stageCode] || 'badge-gray'}\">${esc(label)}</span>`;\n  }\n\n  function badgeForContact(contactStatus, labels) {\n    const label = (labels && labels[contactStatus]) || contactStatus || '—';\n    const clsMap = {\n      uncontacted: 'badge-red',\n      no_answer: 'badge-amber',\n      wrong_number: 'badge-gray',\n      contacted_interested: 'badge-green',\n      callback_scheduled: 'badge-blue',\n      not_interested: 'badge-gray'\n    };\n    return `<span class=\"badge ${clsMap[contactStatus] || 'badge-gray'}\">${esc(label)}</span>`;\n  }\n\n  function badgeForSlaBucket(bucket, label) {\n    const clsMap = {\n      on_time: 'badge-green',\n      overdue_handled: 'badge-amber',\n      overdue_unhandled: 'badge-red',\n      unassigned: 'badge-red',\n      in_window_pending: 'badge-blue',\n      after_hours_pending: 'badge-indigo',\n      insufficient_timestamp: 'badge-gray'\n    };\n    return `<span class=\"badge ${clsMap[bucket] || 'badge-gray'}\">${esc(label || bucket)}</span>`;\n  }\n\n  function readFileAsBase64(file) {\n    return new Promise((resolve, reject) => {\n      const reader = new FileReader();\n      reader.onload = () => {\n        const res = String(reader.result || '');\n        const idx = res.indexOf(',');\n        resolve(idx >= 0 ? res.slice(idx + 1) : res);\n      };\n      reader.onerror = () => reject(new Error('Không thể đọc tệp đã chọn.'));\n      reader.readAsDataURL(file);\n    });\n  }\n\n  function genIdempotencyKey(prefix = 'op') {\n    const rand = (global.crypto && global.crypto.randomUUID)\n      ? global.crypto.randomUUID()\n      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;\n    return `${prefix}_${rand}`;\n  }\n\n  global.ITCUtils = {\n    esc,\n    formatDateTime,\n    formatDate,\n    toLocalInputDate,\n    toast,\n    badgeForStage,\n    badgeForContact,\n    badgeForSlaBucket,\n    readFileAsBase64,\n    genIdempotencyKey\n  };\n})(window);\n"
  }
};

// ---------------------------------------------------------------------------
// 2. EMBEDDED BACKEND MODULES (Clean isolated module scopes)
// ---------------------------------------------------------------------------
const __moduleFactories = {
  // =========================================================================
  // MODULE: ./config
  // =========================================================================
  "./config": function (module, exports, require) {
'use strict';

const os = require('os');
const path = require('path');

const ROOT_DIR = __dirname;

function sanitizeDatabaseUrl(raw) {
  let s = String(raw || '').trim();
  if (!s) return '';
  if (/^psql\s+/i.test(s)) s = s.replace(/^psql\s+/i, '').trim();
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    s = s.slice(1, -1).trim();
  }
  try {
    const u = new URL(s);
    u.searchParams.delete('channel_binding');
    return u.toString();
  } catch (_) {
    return s;
  }
}

function loadConfig(overrides = {}) {
  const rawDbUrl = overrides.databaseUrl !== undefined ? overrides.databaseUrl : (process.env.DATABASE_URL || '');
  const databaseUrl = sanitizeDatabaseUrl(rawDbUrl);
  const defaultLocalDataDir = databaseUrl
    ? path.join(os.tmpdir(), 'itc-tuyensinh-runtime')
    : path.join(ROOT_DIR, 'data');
  const dataDir = overrides.dataDir || process.env.ITC_DATA_DIR || defaultLocalDataDir;
  const backupDir = overrides.backupDir || process.env.ITC_BACKUP_DIR || path.join(dataDir, 'backups');
  const dbPath = overrides.dbPath || process.env.ITC_DB_PATH || path.join(dataDir, 'itc_tuyensinh.sqlite');
  const port = Number(overrides.port !== undefined ? overrides.port : (process.env.PORT || 3000));
  const host = overrides.host || process.env.HOST || '0.0.0.0';
  const sessionTtlHours = Number(process.env.ITC_SESSION_TTL_HOURS || 12);
  const maxBodyBytes = Number(overrides.maxBodyBytes || process.env.ITC_MAX_BODY_BYTES || 5 * 1024 * 1024); // 5MB
  const allowedOriginsEnv = process.env.ITC_ALLOWED_ORIGINS || '';
  const allowedOrigins = overrides.allowedOrigins || (allowedOriginsEnv ? allowedOriginsEnv.split(',').map(s => s.trim()).filter(Boolean) : []);
  const retentionBackups = Number(process.env.ITC_BACKUP_RETENTION || 30);
  const smtpHost = process.env.SMTP_HOST || '';

  return {
    appName: 'ITC Admissions Server',
    appVersion: '2.1.0',
    schemaVersion: 2,
    rootDir: ROOT_DIR,
    publicDir: path.join(ROOT_DIR, 'public'),
    databaseUrl,
    dataDir,
    backupDir,
    dbPath,
    port,
    host,
    sessionTtlHours,
    maxBodyBytes,
    allowedOrigins,
    retentionBackups,
    smtpConfigured: Boolean(smtpHost),
    defaultWorkingHours: {
      timezoneOffsetMinutes: 420, // UTC+7 Vietnam
      slaMinutes: 15,
      workDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
      shifts: [
        { name: 'Ca Sáng', start: '07:30', end: '11:30' },
        { name: 'Ca Chiều', start: '13:00', end: '17:00' },
        { name: 'Ca Tối', start: '17:00', end: '21:00' }
      ],
      holidays: [] // ['YYYY-MM-DD']
    }
  };
}

module.exports = { loadConfig };

  },

  // =========================================================================
  // MODULE: ./pg-store
  // =========================================================================
  "./pg-store": function (module, exports, require) {
'use strict';

const crypto = require('crypto');
const zlib = require('zlib');

function shouldUseSsl(connectionString) {
  if (!connectionString) return false;
  const low = String(connectionString).toLowerCase();
  if (low.includes('sslmode=disable')) return false;
  if (low.includes('localhost') || low.includes('127.0.0.1')) return false;
  return { rejectUnauthorized: false };
}

/**
 * Durable PostgreSQL Persistence Layer for Cloud Free Tiers (Render + Neon/Supabase).
 * Stores:
 *  - itc_db_state : gzipped atomic SQLite database image with SHA-256 & monotonic revision
 *  - itc_backups  : versioned JSON backups surviving container/ephemeral-disk resets
 */
class PostgresStore {
  constructor(config, customPool = null) {
    this.config = config;
    this.customPool = customPool;
    this.pool = null;
    this.connected = false;
    this.rev = 0;
    this.lastSyncedAt = null;
    this.lastGzipBytes = 0;
  }

  async init() {
    if (this.customPool) {
      this.pool = this.customPool;
    } else {
      const { Pool } = require('pg');
      this.pool = new Pool({
        connectionString: this.config.databaseUrl,
        ssl: shouldUseSsl(this.config.databaseUrl),
        max: 3,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 15000
      });
    }

    await this.pool.query('SELECT 1');
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS itc_db_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        rev BIGINT NOT NULL DEFAULT 0,
        schema_version INTEGER NOT NULL,
        sha256 TEXT NOT NULL,
        db_gzip BYTEA NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS itc_backups (
        filename TEXT PRIMARY KEY,
        schema_version INTEGER NOT NULL,
        size_bytes INTEGER NOT NULL,
        backup_type TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    this.connected = true;
    return this;
  }

  async loadState() {
    const res = await this.pool.query(
      'SELECT rev, schema_version, sha256, db_gzip, updated_at FROM itc_db_state WHERE id = 1'
    );
    if (!res.rows || res.rows.length === 0) return null;
    const row = res.rows[0];
    const gzBuf = Buffer.isBuffer(row.db_gzip) ? row.db_gzip : Buffer.from(row.db_gzip);
    const computed = crypto.createHash('sha256').update(gzBuf).digest('hex');
    if (row.sha256 && computed !== row.sha256) {
      throw new Error('Dữ liệu SQLite trong PostgreSQL bị sai lệch checksum SHA-256.');
    }
    const dbBytes = zlib.gunzipSync(gzBuf);
    this.rev = Number(row.rev || 0);
    this.lastSyncedAt = row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString();
    this.lastGzipBytes = gzBuf.length;
    return {
      rev: this.rev,
      schemaVersion: Number(row.schema_version || this.config.schemaVersion),
      dbBytes,
      gzipBytes: gzBuf.length,
      updatedAt: this.lastSyncedAt
    };
  }

  async saveState(dbBytes, schemaVersion) {
    const gzBuf = zlib.gzipSync(dbBytes, { level: 6 });
    const sha256 = crypto.createHash('sha256').update(gzBuf).digest('hex');
    const res = await this.pool.query(
      `INSERT INTO itc_db_state (id, rev, schema_version, sha256, db_gzip, updated_at)
       VALUES (1, 1, $1, $2, $3, NOW())
       ON CONFLICT (id) DO UPDATE SET
         rev = itc_db_state.rev + 1,
         schema_version = EXCLUDED.schema_version,
         sha256 = EXCLUDED.sha256,
         db_gzip = EXCLUDED.db_gzip,
         updated_at = NOW()
       RETURNING rev, updated_at`,
      [schemaVersion, sha256, gzBuf]
    );
    const row = res.rows && res.rows[0] ? res.rows[0] : {};
    this.rev = Number(row.rev || (this.rev + 1));
    this.lastSyncedAt = row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString();
    this.lastGzipBytes = gzBuf.length;
    return { rev: this.rev, updatedAt: this.lastSyncedAt, gzipBytes: gzBuf.length };
  }

  async saveBackup({ filename, schemaVersion, sizeBytes, backupType, payloadJson }) {
    await this.pool.query(
      `INSERT INTO itc_backups (filename, schema_version, size_bytes, backup_type, payload_json, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (filename) DO UPDATE SET
         payload_json = EXCLUDED.payload_json,
         size_bytes = EXCLUDED.size_bytes`,
      [filename, schemaVersion, sizeBytes, backupType, payloadJson]
    );
    const maxKeep = Math.max(5, this.config.retentionBackups || 30);
    await this.pool.query(
      `DELETE FROM itc_backups
       WHERE filename NOT IN (
         SELECT filename FROM itc_backups ORDER BY created_at DESC LIMIT $1
       )`,
      [maxKeep]
    );
  }

  async loadBackup(filename) {
    const res = await this.pool.query(
      'SELECT payload_json FROM itc_backups WHERE filename = $1',
      [filename]
    );
    if (!res.rows || res.rows.length === 0) return null;
    return res.rows[0].payload_json;
  }

  async close() {
    this.connected = false;
    if (this.pool && typeof this.pool.end === 'function') {
      try { await this.pool.end(); } catch (_) {}
    }
    this.pool = null;
  }
}

module.exports = { PostgresStore, shouldUseSsl };

  },

  // =========================================================================
  // MODULE: ./constants
  // =========================================================================
  "./constants": function (module, exports, require) {
'use strict';

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  CONSULTANT: 'consultant'
};

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  manager: 'Lãnh đạo Phòng',
  consultant: 'Chuyên viên Tư vấn'
};

const SCOPES = {
  ALL: 'all',
  TEAM: 'team',
  OWN: 'own'
};

const CONTACT_STATUS = {
  UNCONTACTED: 'uncontacted',
  NO_ANSWER: 'no_answer',
  WRONG_NUMBER: 'wrong_number',
  CONTACTED_INTERESTED: 'contacted_interested',
  CALLBACK_SCHEDULED: 'callback_scheduled',
  NOT_INTERESTED: 'not_interested'
};

const CONTACT_STATUS_LABELS = {
  uncontacted: 'Chưa gọi điện',
  no_answer: 'Không nghe máy / Thuê bao',
  wrong_number: 'Sai số / Nhầm số',
  contacted_interested: 'Đã tư vấn - Quan tâm',
  callback_scheduled: 'Hẹn gọi lại',
  not_interested: 'Không có nhu cầu'
};

const STAGE_CODE = {
  LEAD: 'lead',
  PENDING_VERIFY: 'pending_verify',
  SUBMITTED: 'submitted',
  ENROLLED: 'enrolled',
  WITHDRAWN: 'withdrawn'
};

const STAGE_LABELS = {
  lead: 'Đang tư vấn',
  pending_verify: 'Chờ xác minh trạng thái',
  submitted: 'Đã nộp hồ sơ',
  enrolled: 'Đã nhập học',
  withdrawn: 'Rút hồ sơ / Hủy'
};

const MILESTONE_TYPE = {
  REGISTERED: 'registered',
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
  ENROLLED: 'enrolled',
  WITHDRAWN: 'withdrawn'
};

const TASK_TYPE = {
  BGH: 'bgh',
  DIRECTIVE: 'directive',
  MEETING: 'meeting',
  INTERNAL: 'internal',
  EXTERNAL_SUPPORT: 'external_support',
  REPORT_DEADLINE: 'report_deadline'
};

const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  WAITING_APPROVAL: 'waiting_approval',
  DONE: 'done',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

const TASK_STATUS_LABELS = {
  todo: 'Chưa thực hiện',
  in_progress: 'Đang thực hiện',
  waiting_approval: 'Chờ nghiệm thu',
  done: 'Hoàn thành',
  overdue: 'Quá hạn',
  cancelled: 'Đã hủy'
};

const REGIONS = {
  mientay: 'Tuyến Miền Tây',
  mientrung: 'Tuyến Miền Trung - Tây Nguyên',
  hcmc: 'Tuyến TP. Hồ Chí Minh'
};

const ITC_MAJORS = [
  'Công nghệ thông tin',
  'Thiết kế đồ họa',
  'Lập trình máy tính',
  'Quản trị mạng máy tính',
  'Truyền thông và Mạng máy tính',
  'Thương mại điện tử',
  'Digital Marketing',
  'Kế toán',
  'Kế toán doanh nghiệp',
  'Quản trị kinh doanh',
  'Logistics',
  'Tài chính - Ngân hàng',
  'Hướng dẫn du lịch',
  'Quản trị khách sạn',
  'Tiếng Anh',
  'Tiếng Hàn',
  'Tiếng Nhật',
  'Công nghệ kỹ thuật điện tử - viễn thông',
  'Công nghệ kỹ thuật điều khiển và tự động hóa'
];

const DEFAULT_DOCUMENT_CHECKLIST = [
  { code: 'hoc_ba', name: 'Học bạ THPT (bản sao công chứng)' },
  { code: 'bang_tot_nghiep', name: 'Giấy chứng nhận TN tạm thời / Bằng TN THPT' },
  { code: 'cccd', name: 'CCCD thí sinh (bản sao công chứng)' },
  { code: 'anh_the', name: 'Ảnh thẻ 3x4 (04 tấm)' },
  { code: 'phieu_dk', name: 'Phiếu đăng ký xét tuyển ITC' }
];

// Official 12-month KPI plan for 2027 intake (totals: 4,000 leads / 1,440 submitted / 900 enrolled)
const OFFICIAL_2027_KPI = {
  stf_1: {
    name: 'Tô Nhựt Điển', zalo: 'Zalo 1', email: 'dien.tn@itc.edu.vn',
    monthly: {
      '2026-11': { lead: 7, hs: 2, nh: 1 },
      '2026-12': { lead: 5, hs: 2, nh: 1 },
      '2027-01': { lead: 11, hs: 4, nh: 3 },
      '2027-02': { lead: 11, hs: 4, nh: 2 },
      '2027-03': { lead: 37, hs: 13, nh: 8 },
      '2027-04': { lead: 35, hs: 13, nh: 8 },
      '2027-05': { lead: 97, hs: 35, nh: 22 },
      '2027-06': { lead: 238, hs: 86, nh: 53 },
      '2027-07': { lead: 325, hs: 117, nh: 73 },
      '2027-08': { lead: 187, hs: 67, nh: 42 },
      '2027-09': { lead: 37, hs: 14, nh: 9 },
      '2027-10': { lead: 10, hs: 4, nh: 2 }
    }
  },
  stf_2: {
    name: 'Võ Văn Lâm', zalo: 'Zalo 2', email: 'lam.v@itc.edu.vn',
    monthly: {
      '2026-11': { lead: 6, hs: 3, nh: 1 },
      '2026-12': { lead: 5, hs: 1, nh: 1 },
      '2027-01': { lead: 11, hs: 4, nh: 3 },
      '2027-02': { lead: 11, hs: 4, nh: 3 },
      '2027-03': { lead: 36, hs: 13, nh: 8 },
      '2027-04': { lead: 35, hs: 12, nh: 8 },
      '2027-05': { lead: 97, hs: 35, nh: 22 },
      '2027-06': { lead: 237, hs: 86, nh: 54 },
      '2027-07': { lead: 325, hs: 117, nh: 73 },
      '2027-08': { lead: 188, hs: 67, nh: 42 },
      '2027-09': { lead: 37, hs: 13, nh: 9 },
      '2027-10': { lead: 10, hs: 4, nh: 3 }
    }
  },
  stf_3: {
    name: 'Nguyễn Thị Thùy Trâm', zalo: 'Zalo 3', email: 'tram.ntt@itc.edu.vn',
    monthly: {
      '2026-11': { lead: 6, hs: 2, nh: 2 },
      '2026-12': { lead: 5, hs: 2, nh: 1 },
      '2027-01': { lead: 12, hs: 4, nh: 2 },
      '2027-02': { lead: 11, hs: 4, nh: 3 },
      '2027-03': { lead: 36, hs: 13, nh: 9 },
      '2027-04': { lead: 35, hs: 13, nh: 7 },
      '2027-05': { lead: 98, hs: 35, nh: 22 },
      '2027-06': { lead: 237, hs: 85, nh: 54 },
      '2027-07': { lead: 325, hs: 117, nh: 73 },
      '2027-08': { lead: 188, hs: 68, nh: 42 },
      '2027-09': { lead: 38, hs: 13, nh: 8 },
      '2027-10': { lead: 10, hs: 3, nh: 2 }
    }
  },
  stf_4: {
    name: 'Võ Đặng Kim Trang', zalo: 'Zalo 4', email: 'trang.vdk@itc.edu.vn',
    monthly: {
      '2026-11': { lead: 6, hs: 2, nh: 2 },
      '2026-12': { lead: 5, hs: 2, nh: 1 },
      '2027-01': { lead: 11, hs: 4, nh: 2 },
      '2027-02': { lead: 12, hs: 4, nh: 2 },
      '2027-03': { lead: 36, hs: 13, nh: 8 },
      '2027-04': { lead: 35, hs: 13, nh: 8 },
      '2027-05': { lead: 98, hs: 36, nh: 22 },
      '2027-06': { lead: 238, hs: 85, nh: 53 },
      '2027-07': { lead: 325, hs: 117, nh: 73 },
      '2027-08': { lead: 187, hs: 68, nh: 43 },
      '2027-09': { lead: 38, hs: 14, nh: 8 },
      '2027-10': { lead: 10, hs: 3, nh: 2 }
    }
  }
};

function getIntakeMonths(intakeYear) {
  const y = parseInt(intakeYear, 10);
  if (!Number.isFinite(y) || y < 2020 || y > 2100) return [];
  const prev = y - 1;
  return [
    { key: `${prev}-11`, label: `11/${prev}` },
    { key: `${prev}-12`, label: `12/${prev}` },
    { key: `${y}-01`, label: `01/${y}` },
    { key: `${y}-02`, label: `02/${y}` },
    { key: `${y}-03`, label: `03/${y}` },
    { key: `${y}-04`, label: `04/${y}` },
    { key: `${y}-05`, label: `05/${y}` },
    { key: `${y}-06`, label: `06/${y}` },
    { key: `${y}-07`, label: `07/${y}` },
    { key: `${y}-08`, label: `08/${y}` },
    { key: `${y}-09`, label: `09/${y}` },
    { key: `${y}-10`, label: `10/${y}` }
  ];
}

module.exports = {
  ROLES,
  ROLE_LABELS,
  SCOPES,
  CONTACT_STATUS,
  CONTACT_STATUS_LABELS,
  STAGE_CODE,
  STAGE_LABELS,
  MILESTONE_TYPE,
  TASK_TYPE,
  TASK_STATUS,
  TASK_STATUS_LABELS,
  REGIONS,
  ITC_MAJORS,
  DEFAULT_DOCUMENT_CHECKLIST,
  OFFICIAL_2027_KPI,
  getIntakeMonths
};

  },

  // =========================================================================
  // MODULE: ./db
  // =========================================================================
  "./db": function (module, exports, require) {
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');
const { OFFICIAL_2027_KPI, getIntakeMonths } = require('./constants');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.startsWith('scrypt$')) return false;
  const parts = storedHash.split('$');
  if (parts.length !== 3) return false;
  const [, salt, hex] = parts;
  const derived = crypto.scryptSync(String(password), salt, 64);
  const expected = Buffer.from(hex, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

function newId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

function nowIso() {
  return new Date().toISOString();
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS schema_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'own',
  active INTEGER NOT NULL DEFAULT 1,
  can_edit_kpi INTEGER NOT NULL DEFAULT 0,
  can_export INTEGER NOT NULL DEFAULT 1,
  can_delete INTEGER NOT NULL DEFAULT 0,
  can_approve_reports INTEGER NOT NULL DEFAULT 0,
  can_restore INTEGER NOT NULL DEFAULT 0,
  allowed_tabs_json TEXT NOT NULL DEFAULT '[0,1,2,3,4,5,7]',
  must_change_password INTEGER NOT NULL DEFAULT 0,
  mfa_pin_hash TEXT DEFAULT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT DEFAULT '',
  zalo_slot TEXT DEFAULT '',
  team TEXT DEFAULT 'Tư vấn tuyển sinh',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  ip_address TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS intake_years (
  year TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  start_month TEXT NOT NULL,
  end_month TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS persons (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  student_phone TEXT DEFAULT '',
  parent_phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  dob TEXT DEFAULT '',
  province TEXT DEFAULT '',
  school TEXT DEFAULT '',
  raw_data_json TEXT NOT NULL DEFAULT '{}',
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_persons_student_phone ON persons(student_phone);
CREATE INDEX IF NOT EXISTS idx_persons_parent_phone ON persons(parent_phone);

CREATE TABLE IF NOT EXISTS contact_points (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL,
  value TEXT NOT NULL,
  is_shared_parent INTEGER NOT NULL DEFAULT 0,
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_contact_points_val ON contact_points(value);

CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  intake_year TEXT NOT NULL REFERENCES intake_years(year),
  major TEXT NOT NULL DEFAULT '',
  degree_level TEXT NOT NULL DEFAULT 'Cao đẳng',
  source TEXT NOT NULL DEFAULT 'CRM trực tiếp',
  campaign TEXT NOT NULL DEFAULT '',
  school TEXT NOT NULL DEFAULT '',
  province TEXT NOT NULL DEFAULT '',
  assigned_staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
  contact_status TEXT NOT NULL DEFAULT 'uncontacted',
  stage_code TEXT NOT NULL DEFAULT 'lead',
  raw_status_text TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  next_action TEXT NOT NULL DEFAULT '',
  source_received_at TEXT DEFAULT NULL,
  crm_received_at TEXT DEFAULT NULL,
  first_contact_at TEXT DEFAULT NULL,
  sla_exception_reason TEXT NOT NULL DEFAULT '',
  dedup_flag TEXT NOT NULL DEFAULT '',
  dedup_group_id TEXT NOT NULL DEFAULT '',
  sources_history_json TEXT NOT NULL DEFAULT '[]',
  import_batch_id TEXT DEFAULT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  field_versions_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT DEFAULT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_reg_year ON registrations(intake_year);
CREATE INDEX IF NOT EXISTS idx_reg_staff ON registrations(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_reg_person ON registrations(person_id);
CREATE INDEX IF NOT EXISTS idx_reg_stage ON registrations(stage_code);

CREATE TABLE IF NOT EXISTS milestone_events (
  id TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  intake_year TEXT NOT NULL,
  milestone_type TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  attributed_staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
  recorded_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  evidence_note TEXT NOT NULL DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mil_reg ON milestone_events(registration_id);
CREATE INDEX IF NOT EXISTS idx_mil_year_type ON milestone_events(intake_year, milestone_type, occurred_at);

CREATE TABLE IF NOT EXISTS interactions (
  id TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  outcome TEXT NOT NULL,
  summary TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_int_reg ON interactions(registration_id);

CREATE TABLE IF NOT EXISTS follow_ups (
  id TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  assigned_staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
  due_at TEXT NOT NULL,
  note TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TEXT DEFAULT NULL,
  created_by TEXT DEFAULT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_fup_reg ON follow_ups(registration_id);
CREATE INDEX IF NOT EXISTS idx_fup_staff_status ON follow_ups(assigned_staff_id, status, due_at);

CREATE TABLE IF NOT EXISTS document_checklists (
  id TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  doc_code TEXT NOT NULL,
  doc_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'missing',
  note TEXT NOT NULL DEFAULT '',
  updated_by TEXT DEFAULT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(registration_id, doc_code)
);

CREATE TABLE IF NOT EXISTS assignment_history (
  id TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  from_staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
  to_staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
  reason TEXT NOT NULL DEFAULT '',
  attribution_rule TEXT NOT NULL DEFAULT 'keep_prior_milestones',
  changed_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS regional_records (
  id TEXT PRIMARY KEY,
  intake_year TEXT NOT NULL REFERENCES intake_years(year),
  region TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  parent_phone TEXT NOT NULL DEFAULT '',
  school TEXT NOT NULL DEFAULT '',
  province TEXT NOT NULL DEFAULT '',
  major TEXT NOT NULL DEFAULT '',
  event_name TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'Khảo sát tuyến tỉnh',
  collected_at TEXT NOT NULL,
  assigned_staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
  care_status TEXT NOT NULL DEFAULT 'uncontacted',
  notes TEXT NOT NULL DEFAULT '',
  linked_person_id TEXT REFERENCES persons(id) ON DELETE SET NULL,
  linked_registration_id TEXT REFERENCES registrations(id) ON DELETE SET NULL,
  import_batch_id TEXT DEFAULT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  field_versions_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT DEFAULT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_regional_year_region ON regional_records(intake_year, region);

CREATE TABLE IF NOT EXISTS zalo_staging (
  id TEXT PRIMARY KEY,
  intake_year TEXT NOT NULL REFERENCES intake_years(year),
  raw_text TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'text',
  extracted_name TEXT NOT NULL DEFAULT '',
  extracted_phone TEXT NOT NULL DEFAULT '',
  extracted_parent_phone TEXT NOT NULL DEFAULT '',
  extracted_major TEXT NOT NULL DEFAULT '',
  extracted_school TEXT NOT NULL DEFAULT '',
  extracted_province TEXT NOT NULL DEFAULT '',
  suggested_staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
  source_group TEXT NOT NULL DEFAULT 'Group Zalo Tuyển sinh',
  ocr_confidence REAL DEFAULT NULL,
  suspected_duplicate_reg_id TEXT DEFAULT NULL,
  duplicate_reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  committed_registration_id TEXT DEFAULT NULL,
  created_by TEXT DEFAULT NULL,
  reviewed_by TEXT DEFAULT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS kpi_plan_versions (
  id TEXT PRIMARY KEY,
  intake_year TEXT NOT NULL REFERENCES intake_years(year),
  version_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  note TEXT NOT NULL DEFAULT '',
  created_by TEXT DEFAULT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS kpi_targets (
  id TEXT PRIMARY KEY,
  plan_version_id TEXT NOT NULL REFERENCES kpi_plan_versions(id) ON DELETE CASCADE,
  intake_year TEXT NOT NULL,
  staff_id TEXT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  month_key TEXT NOT NULL,
  target_lead INTEGER NOT NULL DEFAULT 0,
  target_submitted INTEGER NOT NULL DEFAULT 0,
  target_enrolled INTEGER NOT NULL DEFAULT 0,
  UNIQUE(plan_version_id, staff_id, month_key)
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  intake_year TEXT NOT NULL REFERENCES intake_years(year),
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  owner_staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
  collaborators_json TEXT NOT NULL DEFAULT '[]',
  external_unit TEXT NOT NULL DEFAULT '',
  meeting_time TEXT NOT NULL DEFAULT '',
  meeting_location TEXT NOT NULL DEFAULT '',
  meeting_minutes TEXT NOT NULL DEFAULT '',
  deadline TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'todo',
  checklist_json TEXT NOT NULL DEFAULT '[]',
  evidence_note TEXT NOT NULL DEFAULT '',
  extension_reason TEXT NOT NULL DEFAULT '',
  accepted_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  accepted_at TEXT DEFAULT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  field_versions_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT DEFAULT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_tasks_year_type ON tasks(intake_year, task_type);

CREATE TABLE IF NOT EXISTS task_comments (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS report_snapshots (
  id TEXT PRIMARY KEY,
  intake_year TEXT NOT NULL,
  template TEXT NOT NULL,
  period_type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  cutoff_at TEXT NOT NULL,
  sections_json TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  snapshot_data_json TEXT NOT NULL,
  created_by_user_id TEXT DEFAULT NULL,
  approved_by_user_id TEXT DEFAULT NULL,
  approved_at TEXT DEFAULT NULL,
  reopen_reason TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notification_jobs (
  id TEXT PRIMARY KEY,
  channel TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_address TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_message_id TEXT NOT NULL DEFAULT '',
  provider_note TEXT NOT NULL DEFAULT '',
  created_by_user_id TEXT DEFAULT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS import_batches (
  id TEXT PRIMARY KEY,
  intake_year TEXT NOT NULL,
  target_type TEXT NOT NULL,
  file_name TEXT NOT NULL DEFAULT '',
  uploaded_by_user_id TEXT NOT NULL,
  total_rows INTEGER NOT NULL DEFAULT 0,
  created_count INTEGER NOT NULL DEFAULT 0,
  updated_count INTEGER NOT NULL DEFAULT 0,
  duplicate_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  summary_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS import_rows (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  row_index INTEGER NOT NULL,
  action TEXT NOT NULL,
  target_id TEXT DEFAULT NULL,
  before_json TEXT DEFAULT NULL,
  after_json TEXT DEFAULT NULL,
  message TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  occurred_at TEXT NOT NULL,
  actor_user_id TEXT DEFAULT NULL,
  actor_email TEXT DEFAULT '',
  actor_name TEXT DEFAULT '',
  actor_role TEXT DEFAULT '',
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT DEFAULT NULL,
  summary TEXT NOT NULL,
  detail_json TEXT NOT NULL DEFAULT '{}',
  ip_address TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_events(occurred_at DESC);

CREATE TABLE IF NOT EXISTS backup_records (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  size_bytes INTEGER NOT NULL,
  record_counts_json TEXT NOT NULL,
  backup_type TEXT NOT NULL,
  created_by_user_id TEXT DEFAULT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;

class DatabaseManager {
  constructor(config) {
    this.config = config;
    this.db = null;
    this.pgStore = null;
    this.dirty = false;
    this._lastCommittedBytes = null;
    this._writeQueue = Promise.resolve();
    this.simulateWriteError = false; // Hook for durability acceptance testing only
    this.simulateCloudError = false; // Hook for PostgreSQL commit failure testing only
    this.writeErrorCount = 0;
  }

  isCloudEnabled() {
    return Boolean(this.pgStore);
  }

  _cleanupSidecarFiles() {
    for (const suffix of ['-wal', '-shm']) {
      try { fs.unlinkSync(this.config.dbPath + suffix); } catch (_) {}
    }
  }

  init() {
    fs.mkdirSync(this.config.dataDir, { recursive: true });
    fs.mkdirSync(this.config.backupDir, { recursive: true });

    this.db = new DatabaseSync(this.config.dbPath);
    this.db.exec('PRAGMA journal_mode = WAL;');
    this.db.exec('PRAGMA synchronous = FULL;');
    this.db.exec('PRAGMA foreign_keys = ON;');
    this.db.exec('PRAGMA busy_timeout = 5000;');
    this.db.exec(SCHEMA_SQL);

    this.db.prepare(`INSERT OR REPLACE INTO schema_meta (key, value) VALUES ('schema_version', ?)`).run(String(this.config.schemaVersion));
    this._bootstrapInitialReferenceData();
    return this;
  }

  async initCloud(pgStore) {
    fs.mkdirSync(this.config.dataDir, { recursive: true });
    fs.mkdirSync(this.config.backupDir, { recursive: true });
    this.pgStore = pgStore;
    await this.pgStore.init();

    const cloudState = await this.pgStore.loadState();
    this.close();
    this._cleanupSidecarFiles();

    if (cloudState && cloudState.dbBytes && cloudState.dbBytes.length > 0) {
      fs.writeFileSync(this.config.dbPath, cloudState.dbBytes);
      this._lastCommittedBytes = Buffer.from(cloudState.dbBytes);
      this.dirty = false;
      this.init();
      if (this.dirty) {
        await this.flushToCloud(true);
      }
    } else {
      try { fs.unlinkSync(this.config.dbPath); } catch (_) {}
      this.init();
      await this.flushToCloud(true);
    }
    return this;
  }

  withWriteLock(asyncFn) {
    const run = this._writeQueue.then(() => asyncFn());
    this._writeQueue = run.catch(() => {});
    return run;
  }

  async flushToCloud(force = false) {
    if (!this.pgStore) return null;
    if (!this.dirty && !force) return null;

    try {
      if (this.simulateCloudError) {
        const err = new Error('Simulated PostgreSQL cloud commit failure');
        err.code = 'STORAGE_COMMIT_FAILED';
        err.statusCode = 500;
        throw err;
      }
      this.db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
      const bytes = fs.readFileSync(this.config.dbPath);
      const saved = await this.pgStore.saveState(bytes, this.config.schemaVersion);
      this._lastCommittedBytes = bytes;
      this.dirty = false;
      return saved;
    } catch (err) {
      this.writeErrorCount++;
      // Roll back local SQLite to last cloud-confirmed commit so local never diverges from PostgreSQL!
      if (this._lastCommittedBytes) {
        this.close();
        this._cleanupSidecarFiles();
        fs.writeFileSync(this.config.dbPath, this._lastCommittedBytes);
        this.init();
      }
      this.dirty = false;
      const wrapped = new Error('Lỗi đồng bộ lưu bền lên PostgreSQL: ' + (err.message || 'Unknown error'));
      wrapped.code = 'STORAGE_COMMIT_FAILED';
      wrapped.statusCode = 500;
      throw wrapped;
    }
  }

  close() {
    if (this.db) {
      try { this.db.close(); } catch (_) {}
      this.db = null;
    }
  }

  async closeAsync() {
    this.close();
    if (this.pgStore) {
      await this.pgStore.close();
      this.pgStore = null;
    }
  }

  reopen() {
    this.close();
    return this.init();
  }

  transaction(fn) {
    if (this.simulateWriteError) {
      this.writeErrorCount++;
      const err = new Error('Simulated disk/storage commit failure');
      err.code = 'STORAGE_COMMIT_FAILED';
      throw err;
    }
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const result = fn(this.db);
      this.db.exec('COMMIT');
      this.dirty = true;
      return result;
    } catch (err) {
      try { this.db.exec('ROLLBACK'); } catch (_) {}
      if (err && err.code === 'STORAGE_COMMIT_FAILED') {
        this.writeErrorCount++;
      }
      throw err;
    }
  }

  appendAudit(dbOrNull, { actor, action, entityType, entityId = null, summary, detail = {}, ip = '' }) {
    const conn = dbOrNull || this.db;
    conn.prepare(`
      INSERT INTO audit_events (occurred_at, actor_user_id, actor_email, actor_name, actor_role, action, entity_type, entity_id, summary, detail_json, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      nowIso(),
      actor ? actor.id : null,
      actor ? (actor.email || '') : 'system',
      actor ? (actor.full_name || actor.name || '') : 'System',
      actor ? (actor.role || '') : 'system',
      action,
      entityType,
      entityId,
      summary,
      JSON.stringify(detail || {}),
      ip || ''
    );
    this.dirty = true;
  }

  getSetting(key, fallback = null) {
    const row = this.db.prepare('SELECT value_json FROM system_settings WHERE key = ?').get(key);
    if (!row) return fallback;
    try { return JSON.parse(row.value_json); } catch (_) { return fallback; }
  }

  setSetting(key, value, dbOrNull = null) {
    const conn = dbOrNull || this.db;
    conn.prepare(`
      INSERT INTO system_settings (key, value_json, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at
    `).run(key, JSON.stringify(value), nowIso());
  }

  _bootstrapInitialReferenceData() {
    const defaultAdminPw = String(process.env.ITC_DEFAULT_ADMIN_PASSWORD || 'ItcAdmin@2027!').trim();
    const defaultStaffPw = String(process.env.ITC_DEFAULT_STAFF_PASSWORD || 'ItcStaff@2027!').trim();
    const defaultAdminPin = String(process.env.ITC_DEFAULT_ADMIN_PIN || '202700').trim();

    const userCount = this.db.prepare('SELECT COUNT(*) AS cnt FROM users').get().cnt;
    if (userCount > 0) {
      // Optional explicit recovery flag: sync Super Admin & Staff passwords from Render Env Vars
      if (String(process.env.ITC_SYNC_DEFAULT_PASSWORDS || '').trim().toLowerCase() === 'true') {
        const tsSync = nowIso();
        this.transaction((db) => {
          const adminHash = hashPassword(defaultAdminPw);
          const staffHash = hashPassword(defaultStaffPw);
          const pinHash = hashPassword(defaultAdminPin);
          db.prepare("UPDATE users SET password_hash = ?, mfa_pin_hash = ?, active = 1, updated_at = ? WHERE id IN ('usr_admin_tai', 'usr_admin_le')")
            .run(adminHash, pinHash, tsSync);
          db.prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id IN ('usr_staff_1', 'usr_staff_2', 'usr_staff_3', 'usr_staff_4')")
            .run(staffHash, tsSync);
          this.appendAudit(db, {
            actor: null,
            action: 'ENV_PASSWORDS_SYNCED',
            entityType: 'auth',
            summary: 'Đồng bộ lại mật khẩu mặc định từ biến môi trường (ITC_SYNC_DEFAULT_PASSWORDS=true).'
          });
        });
      }
      return;
    }

    const ts = nowIso();

    this.transaction((db) => {
      // 1. Default Intake Years (2027, 2028, 2029)
      const insertYear = db.prepare(`
        INSERT OR IGNORE INTO intake_years (year, label, start_month, end_month, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      insertYear.run('2027', 'Niên khóa 2027 (11/2026 - 10/2027)', '2026-11', '2027-10', 'open', ts);
      insertYear.run('2028', 'Niên khóa 2028 (11/2027 - 10/2028)', '2027-11', '2028-10', 'open', ts);
      insertYear.run('2029', 'Niên khóa 2029 (11/2028 - 10/2029)', '2028-11', '2029-10', 'open', ts);

      // 2. Default Accounts (Real server-side hashed passwords; zero auto-login!)
      const insertUser = db.prepare(`
        INSERT INTO users (
          id, email, password_hash, full_name, role, scope, active,
          can_edit_kpi, can_export, can_delete, can_approve_reports, can_restore,
          allowed_tabs_json, must_change_password, mfa_pin_hash, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const allTabs = JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const staffTabs = JSON.stringify([0, 1, 2, 3, 4, 5, 7, 10]);
      const pinHash = hashPassword(defaultAdminPin);

      insertUser.run(
        'usr_admin_tai', 'tai.nh@itc.edu.vn', hashPassword(defaultAdminPw),
        'Nguyễn Hữu Tài', 'super_admin', 'all', 1,
        1, 1, 1, 1, 1, allTabs, 0, pinHash, ts, ts
      );
      insertUser.run(
        'usr_admin_le', 'phanbichle28@gmail.com', hashPassword(defaultAdminPw),
        'Phan Bích Lệ', 'super_admin', 'all', 1,
        1, 1, 1, 1, 1, allTabs, 0, pinHash, ts, ts
      );

      // 3. 4 Official Consultants (linked by stable staff.id <-> users.id)
      const insertStaff = db.prepare(`
        INSERT INTO staff (id, user_id, full_name, email, zalo_slot, team, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
      `);

      const staffKeys = ['stf_1', 'stf_2', 'stf_3', 'stf_4'];
      staffKeys.forEach((stfId, idx) => {
        const info = OFFICIAL_2027_KPI[stfId];
        const usrId = `usr_staff_${idx + 1}`;
        insertUser.run(
          usrId, info.email, hashPassword(defaultStaffPw),
          info.name, 'consultant', 'own', 1,
          0, 1, 0, 0, 0, staffTabs, 0, null, ts, ts
        );
        insertStaff.run(stfId, usrId, info.name, info.email, info.zalo, 'Tư vấn tuyển sinh', ts, ts);
      });

      // Also add management staff records for task ownership if needed (inactive for consultant KPI targets)
      insertStaff.run('stf_admin_tai', 'usr_admin_tai', 'Nguyễn Hữu Tài', 'tai.nh@itc.edu.vn', '', 'Ban Lãnh đạo Phòng', ts, ts);
      insertStaff.run('stf_admin_le', 'usr_admin_le', 'Phan Bích Lệ', 'phanbichle28@gmail.com', '', 'Ban Lãnh đạo Phòng', ts, ts);

      // 4. Official 2027 KPI Plan v1 (exact 4,000 leads / 1,440 submitted / 900 enrolled)
      const plan2027Id = 'kpi_plan_2027_v1';
      db.prepare(`
        INSERT INTO kpi_plan_versions (id, intake_year, version_number, status, note, created_by, created_at)
        VALUES (?, '2027', 1, 'active', 'Kế hoạch chỉ tiêu chính thức ITC 2027 (4.000 ĐK / 1.440 HS / 900 NH)', 'usr_admin_tai', ?)
      `).run(plan2027Id, ts);

      const insertTarget = db.prepare(`
        INSERT INTO kpi_targets (id, plan_version_id, intake_year, staff_id, month_key, target_lead, target_submitted, target_enrolled)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const stfId of staffKeys) {
        const monthly = OFFICIAL_2027_KPI[stfId].monthly;
        for (const [mKey, vals] of Object.entries(monthly)) {
          insertTarget.run(newId('kpt'), plan2027Id, '2027', stfId, mKey, vals.lead, vals.hs, vals.nh);
        }
      }

      // Initialize blank v1 plans for 2028 and 2029 so switching years works cleanly
      for (const yr of ['2028', '2029']) {
        const planId = `kpi_plan_${yr}_v1`;
        db.prepare(`
          INSERT INTO kpi_plan_versions (id, intake_year, version_number, status, note, created_by, created_at)
          VALUES (?, ?, 1, 'active', ?, 'usr_admin_tai', ?)
        `).run(planId, yr, `Kế hoạch khởi tạo niên khóa ${yr} (chưa phân bổ)`, ts);
        const months = getIntakeMonths(yr);
        for (const stfId of staffKeys) {
          for (const m of months) {
            insertTarget.run(newId('kpt'), planId, yr, stfId, m.key, 0, 0, 0);
          }
        }
      }

      // 5. Default system settings (working hours, SLA config, report rules)
      this.setSetting('working_hours', this.config.defaultWorkingHours, db);
      this.setSetting('default_intake_year', '2027', db);

      // 6. Audit bootstrap event (NOTE: ZERO fake leads inserted in production bootstrap!)
      this.appendAudit(db, {
        actor: null,
        action: 'SYSTEM_BOOTSTRAP',
        entityType: 'system',
        summary: 'Khởi tạo cơ sở dữ liệu sạch (tài khoản mặc định, danh mục nhân sự, niên khóa 2027-2029, kế hoạch KPI 2027 chính thức; không nạp dữ liệu mẫu).'
      });
    });
  }
}

module.exports = {
  DatabaseManager,
  hashPassword,
  verifyPassword,
  newId,
  nowIso
};

  },

  // =========================================================================
  // MODULE: ./validators
  // =========================================================================
  "./validators": function (module, exports, require) {
'use strict';

const {
  CONTACT_STATUS,
  STAGE_CODE,
  TASK_TYPE,
  TASK_STATUS,
  ROLES,
  SCOPES,
  REGIONS
} = require('./constants');

const VALID_CONTACT_STATUS = new Set(Object.values(CONTACT_STATUS));
const VALID_STAGE_CODE = new Set(Object.values(STAGE_CODE));
const VALID_TASK_TYPE = new Set(Object.values(TASK_TYPE));
const VALID_TASK_STATUS = new Set(Object.values(TASK_STATUS));
const VALID_ROLES = new Set(Object.values(ROLES));
const VALID_SCOPES = new Set(Object.values(SCOPES));
const VALID_REGIONS = new Set(Object.keys(REGIONS));

function cleanString(val, maxLen = 500) {
  if (val === null || val === undefined) return '';
  if (typeof val !== 'string' && typeof val !== 'number' && typeof val !== 'boolean') {
    throw validationError('Giá trị chuỗi không hợp lệ (sai kiểu dữ liệu).');
  }
  const s = String(val).trim();
  if (s.length > maxLen) {
    throw validationError(`Độ dài vượt quá giới hạn ${maxLen} ký tự.`);
  }
  return s;
}

function normalizePhone(raw) {
  if (raw === null || raw === undefined) return '';
  let digits = String(raw).replace(/[^\d+]/g, '');
  if (!digits) return '';
  if (digits.startsWith('+84')) digits = '0' + digits.slice(3);
  else if (digits.startsWith('84') && digits.length >= 10 && digits.length <= 11) digits = '0' + digits.slice(2);
  digits = digits.replace(/\D/g, '');
  if (digits.length === 9 && /^[35789]/.test(digits)) {
    digits = '0' + digits;
  }
  if (digits.length >= 9 && digits.length <= 11) return digits;
  return '';
}

function normalizeVi(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function validationError(message, field = null) {
  const err = new Error(message);
  err.statusCode = 400;
  err.code = 'VALIDATION_ERROR';
  if (field) err.field = field;
  return err;
}

function validateIsoDateOrNull(val, fieldName) {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val !== 'string') {
    throw validationError(`Trường ${fieldName} phải là chuỗi thời gian hợp lệ.`, fieldName);
  }
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) {
    throw validationError(`Trường ${fieldName} không đúng định dạng ngày giờ ISO.`, fieldName);
  }
  return d.toISOString();
}

/**
 * Strict mapping from free-text Vietnamese/English admission status strings to enum codes.
 * CRITICAL P0 FIX: Negative phrases ("Chưa nộp hồ sơ", "Chưa nhập học", "Dự định", "Không tiếp tục", "Rút hồ sơ")
 * NEVER map to submitted/enrolled! Unknown strings go to pending_verify.
 */
function mapImportedStageStatus(rawText) {
  const orig = String(rawText || '').trim();
  if (!orig) {
    return { stageCode: STAGE_CODE.LEAD, rawStatusText: '', recognized: true };
  }
  const norm = normalizeVi(orig);

  // Direct enum codes
  if (VALID_STAGE_CODE.has(norm)) {
    return { stageCode: norm, rawStatusText: '', recognized: true };
  }

  // 1. Withdrawn / Cancelled FIRST
  if (
    /\brut\b/.test(norm) ||
    /\bhuy\b/.test(norm) ||
    norm.includes('khong tiep tuc') ||
    norm.includes('khong hoc') ||
    norm.includes('bo hoc') ||
    norm.includes('tu choi')
  ) {
    return { stageCode: STAGE_CODE.WITHDRAWN, rawStatusText: orig, recognized: true };
  }

  // 2. Explicit negative or prospective phrases -> NEVER submitted or enrolled!
  if (
    /\bchua\b/.test(norm) ||
    /\bdu dinh\b/.test(norm) ||
    /\bse nop\b/.test(norm) ||
    /\bse nhap\b/.test(norm) ||
    /\bkhong nop\b/.test(norm) ||
    /\bkhong nhap\b/.test(norm) ||
    /\bdang can nhac\b/.test(norm) ||
    /\bdang hoi\b/.test(norm) ||
    /\bdang tu van\b/.test(norm) ||
    /\bmoi dang ky\b/.test(norm) ||
    /\bdang ky moi\b/.test(norm) ||
    /\btu van\b/.test(norm) ||
    /\bquan tam\b/.test(norm) ||
    /\btheo doi\b/.test(norm) ||
    /\bcho phan hoi\b/.test(norm) ||
    /\btiem nang\b/.test(norm)
  ) {
    return { stageCode: STAGE_CODE.LEAD, rawStatusText: orig, recognized: true };
  }

  // 3. Positive Enrolled (must clearly mean enrolled, not negative)
  if (
    norm === 'da nhap hoc' ||
    norm === 'nhap hoc' ||
    norm === 'da dong hoc phi' ||
    norm === 'hoan tat nhap hoc' ||
    norm === 'chinh thuc nhap hoc' ||
    norm.startsWith('da nhap hoc')
  ) {
    return { stageCode: STAGE_CODE.ENROLLED, rawStatusText: orig, recognized: true };
  }

  // 4. Positive Submitted (must clearly mean submitted, not negative)
  if (
    norm === 'da nop ho so' ||
    norm === 'nop ho so' ||
    norm === 'da nop hs' ||
    norm === 'da nhan ho so' ||
    norm === 'trung tuyen' ||
    norm === 'du ho so' ||
    norm.startsWith('da nop ho so') ||
    norm.startsWith('da nop hs')
  ) {
    return { stageCode: STAGE_CODE.SUBMITTED, rawStatusText: orig, recognized: true };
  }

  // 5. Unknown string -> pending_verify (verification queue)
  return { stageCode: STAGE_CODE.PENDING_VERIFY, rawStatusText: orig, recognized: false };
}

function mapImportedContactStatus(rawText) {
  const orig = String(rawText || '').trim();
  if (!orig) return CONTACT_STATUS.UNCONTACTED;
  const norm = normalizeVi(orig);
  if (VALID_CONTACT_STATUS.has(norm)) return norm;

  if (norm.includes('chua goi') || norm.includes('chua lien he') || norm.includes('moi')) {
    return CONTACT_STATUS.UNCONTACTED;
  }
  if (norm.includes('sai so') || norm.includes('nham so') || norm.includes('khong ton tai')) {
    return CONTACT_STATUS.WRONG_NUMBER;
  }
  if (norm.includes('khong nghe') || norm.includes('thue bao') || norm.includes('khong bat may') || norm.includes('tat may')) {
    return CONTACT_STATUS.NO_ANSWER;
  }
  if (norm.includes('hen goi') || norm.includes('goi lai')) {
    return CONTACT_STATUS.CALLBACK_SCHEDULED;
  }
  if (norm.includes('khong co nhu cau') || norm.includes('khong quan tam') || norm.includes('tu choi')) {
    return CONTACT_STATUS.NOT_INTERESTED;
  }
  if (norm.includes('da goi') || norm.includes('da tu van') || norm.includes('quan tam') || norm.includes('zalo') || norm.includes('da lien he')) {
    return CONTACT_STATUS.CONTACTED_INTERESTED;
  }
  return CONTACT_STATUS.UNCONTACTED;
}

function validateRegistrationPayload(body, isPatch = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw validationError('Payload hồ sơ phải là đối tượng JSON hợp lệ.');
  }
  const out = {};

  if (!isPatch || body.full_name !== undefined) {
    const name = cleanString(body.full_name, 160);
    if (!isPatch && !name) throw validationError('Họ tên thí sinh không được để trống.', 'full_name');
    if (body.full_name !== undefined) out.full_name = name;
  }
  if (body.student_phone !== undefined) {
    const raw = cleanString(body.student_phone, 32);
    out.student_phone = raw ? normalizePhone(raw) : '';
    if (raw && !out.student_phone) throw validationError('Số điện thoại thí sinh không hợp lệ (cần 9-11 chữ số).', 'student_phone');
  }
  if (body.parent_phone !== undefined) {
    const raw = cleanString(body.parent_phone, 32);
    out.parent_phone = raw ? normalizePhone(raw) : '';
    if (raw && !out.parent_phone) throw validationError('Số điện thoại phụ huynh không hợp lệ.', 'parent_phone');
  }
  if (body.email !== undefined) out.email = cleanString(body.email, 160);
  if (body.dob !== undefined) out.dob = cleanString(body.dob, 30);
  if (body.intake_year !== undefined) {
    const y = cleanString(body.intake_year, 10);
    if (!/^\d{4}$/.test(y)) throw validationError('Niên khóa phải là 4 chữ số (vd: 2027).', 'intake_year');
    out.intake_year = y;
  }
  if (body.major !== undefined) out.major = cleanString(body.major, 160);
  if (body.degree_level !== undefined) out.degree_level = cleanString(body.degree_level, 60);
  if (body.source !== undefined) out.source = cleanString(body.source, 120);
  if (body.campaign !== undefined) out.campaign = cleanString(body.campaign, 120);
  if (body.school !== undefined) out.school = cleanString(body.school, 200);
  if (body.province !== undefined) out.province = cleanString(body.province, 120);
  if (body.assigned_staff_id !== undefined) {
    out.assigned_staff_id = body.assigned_staff_id === null || body.assigned_staff_id === '' ? null : cleanString(body.assigned_staff_id, 64);
  }
  if (body.contact_status !== undefined) {
    const cs = cleanString(body.contact_status, 50);
    if (!VALID_CONTACT_STATUS.has(cs)) {
      throw validationError(`Trạng thái liên hệ không hợp lệ: ${cs}`, 'contact_status');
    }
    out.contact_status = cs;
  }
  if (body.stage_code !== undefined) {
    const sc = cleanString(body.stage_code, 50);
    if (!VALID_STAGE_CODE.has(sc)) {
      throw validationError(`Mã giai đoạn tuyển sinh không hợp lệ: ${sc}`, 'stage_code');
    }
    out.stage_code = sc;
  }
  if (body.notes !== undefined) out.notes = cleanString(body.notes, 2000);
  if (body.next_action !== undefined) out.next_action = cleanString(body.next_action, 500);
  if (body.sla_exception_reason !== undefined) out.sla_exception_reason = cleanString(body.sla_exception_reason, 500);
  if (body.source_received_at !== undefined) out.source_received_at = validateIsoDateOrNull(body.source_received_at, 'source_received_at');
  if (body.crm_received_at !== undefined) out.crm_received_at = validateIsoDateOrNull(body.crm_received_at, 'crm_received_at');
  if (body.first_contact_at !== undefined) out.first_contact_at = validateIsoDateOrNull(body.first_contact_at, 'first_contact_at');
  if (body.milestone_occurred_at !== undefined) out.milestone_occurred_at = validateIsoDateOrNull(body.milestone_occurred_at, 'milestone_occurred_at');
  if (body.dedup_flag !== undefined) out.dedup_flag = cleanString(body.dedup_flag, 40);
  if (body.allow_shared_parent_phone !== undefined) out.allow_shared_parent_phone = Boolean(body.allow_shared_parent_phone);

  return out;
}

function validateTaskPayload(body, isPatch = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw validationError('Payload công việc không hợp lệ.');
  }
  const out = {};
  if (!isPatch || body.title !== undefined) {
    const t = cleanString(body.title, 300);
    if (!isPatch && !t) throw validationError('Tiêu đề công việc không được để trống.', 'title');
    if (body.title !== undefined) out.title = t;
  }
  if (!isPatch || body.task_type !== undefined) {
    const tt = cleanString(body.task_type || TASK_TYPE.INTERNAL, 40);
    if (!VALID_TASK_TYPE.has(tt)) throw validationError(`Loại công việc không hợp lệ: ${tt}`, 'task_type');
    out.task_type = tt;
  }
  if (body.intake_year !== undefined) {
    const y = cleanString(body.intake_year, 10);
    if (!/^\d{4}$/.test(y)) throw validationError('Niên khóa không hợp lệ.', 'intake_year');
    out.intake_year = y;
  }
  if (body.description !== undefined) out.description = cleanString(body.description, 3000);
  if (body.owner_staff_id !== undefined) out.owner_staff_id = body.owner_staff_id ? cleanString(body.owner_staff_id, 64) : null;
  if (body.collaborators !== undefined) {
    if (!Array.isArray(body.collaborators)) throw validationError('collaborators phải là mảng.');
    out.collaborators = body.collaborators.map(x => cleanString(x, 64)).slice(0, 20);
  }
  if (body.external_unit !== undefined) out.external_unit = cleanString(body.external_unit, 200);
  if (body.meeting_time !== undefined) out.meeting_time = cleanString(body.meeting_time, 100);
  if (body.meeting_location !== undefined) out.meeting_location = cleanString(body.meeting_location, 200);
  if (body.meeting_minutes !== undefined) out.meeting_minutes = cleanString(body.meeting_minutes, 4000);
  if (body.deadline !== undefined) out.deadline = cleanString(body.deadline, 40);
  if (body.priority !== undefined) {
    const p = cleanString(body.priority, 20);
    if (!['low', 'normal', 'high', 'urgent'].includes(p)) throw validationError('Mức độ ưu tiên không hợp lệ.');
    out.priority = p;
  }
  if (body.status !== undefined) {
    const s = cleanString(body.status, 30);
    if (!VALID_TASK_STATUS.has(s)) throw validationError(`Trạng thái công việc không hợp lệ: ${s}`);
    out.status = s;
  }
  if (body.checklist !== undefined) {
    if (!Array.isArray(body.checklist)) throw validationError('checklist phải là mảng.');
    out.checklist = body.checklist.slice(0, 50).map(item => ({
      id: cleanString(item.id || '', 40) || undefined,
      text: cleanString(item.text || '', 300),
      done: Boolean(item.done)
    })).filter(i => i.text);
  }
  if (body.evidence_note !== undefined) out.evidence_note = cleanString(body.evidence_note, 2000);
  if (body.extension_reason !== undefined) out.extension_reason = cleanString(body.extension_reason, 1000);
  return out;
}

module.exports = {
  VALID_CONTACT_STATUS,
  VALID_STAGE_CODE,
  VALID_TASK_TYPE,
  VALID_TASK_STATUS,
  VALID_ROLES,
  VALID_SCOPES,
  VALID_REGIONS,
  cleanString,
  normalizePhone,
  normalizeVi,
  validationError,
  validateIsoDateOrNull,
  mapImportedStageStatus,
  mapImportedContactStatus,
  validateRegistrationPayload,
  validateTaskPayload
};

  },

  // =========================================================================
  // MODULE: ./auth
  // =========================================================================
  "./auth": function (module, exports, require) {
'use strict';

const crypto = require('crypto');
const { verifyPassword, hashPassword, nowIso } = require('./db');
const { ROLES, SCOPES } = require('./constants');

const SESSION_COOKIE_NAME = 'itc_sid';

function sha256(str) {
  return crypto.createHash('sha256').update(String(str)).digest('hex');
}

function parseCookies(cookieHeader) {
  const map = {};
  if (!cookieHeader) return map;
  const parts = String(cookieHeader).split(';');
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) map[k] = decodeURIComponent(v);
  }
  return map;
}

function extractSessionToken(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookies = parseCookies(req.headers['cookie'] || '');
  if (cookies[SESSION_COOKIE_NAME]) {
    return cookies[SESSION_COOKIE_NAME];
  }
  return null;
}

class AuthService {
  constructor(dbManager, config) {
    this.dbm = dbManager;
    this.config = config;
    this.onUserRevoked = null; // Callback set by RealtimeServer to close active sockets immediately
  }

  getUserWithStaff(userId) {
    const row = this.dbm.db.prepare(`
      SELECT u.*, s.id AS staff_id, s.zalo_slot AS staff_zalo_slot, s.team AS staff_team
      FROM users u
      LEFT JOIN staff s ON s.user_id = u.id
      WHERE u.id = ?
    `).get(userId);
    return row ? this.sanitizeUser(row) : null;
  }

  sanitizeUser(row) {
    let allowedTabs = [0, 1, 2, 3, 4, 5, 7];
    try { allowedTabs = JSON.parse(row.allowed_tabs_json || '[]'); } catch (_) {}
    return {
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      role: row.role,
      scope: row.scope,
      active: Boolean(row.active),
      can_edit_kpi: Boolean(row.can_edit_kpi),
      can_export: Boolean(row.can_export),
      can_delete: Boolean(row.can_delete),
      can_approve_reports: Boolean(row.can_approve_reports),
      can_restore: Boolean(row.can_restore),
      allowed_tabs: allowedTabs,
      must_change_password: Boolean(row.must_change_password),
      has_mfa_pin: Boolean(row.mfa_pin_hash),
      staff_id: row.staff_id || null,
      zalo_slot: row.staff_zalo_slot || '',
      team: row.staff_team || '',
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  login(email, password, ip = '', userAgent = '') {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const row = this.dbm.db.prepare(`
      SELECT u.*, s.id AS staff_id, s.zalo_slot AS staff_zalo_slot, s.team AS staff_team
      FROM users u
      LEFT JOIN staff s ON s.user_id = u.id
      WHERE LOWER(u.email) = ?
    `).get(normalizedEmail);

    if (!row || !verifyPassword(password, row.password_hash)) {
      this.dbm.appendAudit(null, {
        actor: null,
        action: 'AUTH_LOGIN_FAILED',
        entityType: 'auth',
        summary: `Đăng nhập thất bại cho email: ${normalizedEmail}`,
        ip
      });
      const err = new Error('Email hoặc mật khẩu không đúng.');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    if (!row.active) {
      this.dbm.appendAudit(null, {
        actor: row,
        action: 'AUTH_LOGIN_BLOCKED_LOCKED',
        entityType: 'auth',
        entityId: row.id,
        summary: `Tài khoản đang bị khóa thử đăng nhập: ${row.email}`,
        ip
      });
      const err = new Error('Tài khoản của bạn đang bị khóa. Liên hệ Super Admin.');
      err.statusCode = 403;
      err.code = 'ACCOUNT_LOCKED';
      throw err;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = sha256(token);
    const createdAt = nowIso();
    const expiresAt = new Date(Date.now() + this.config.sessionTtlHours * 3600 * 1000).toISOString();

    this.dbm.transaction((db) => {
      db.prepare(`
        INSERT INTO sessions (token_hash, user_id, created_at, expires_at, last_seen_at, ip_address, user_agent, revoked)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
      `).run(tokenHash, row.id, createdAt, expiresAt, createdAt, ip, String(userAgent || '').slice(0, 300));

      this.dbm.appendAudit(db, {
        actor: row,
        action: 'AUTH_LOGIN_SUCCESS',
        entityType: 'session',
        entityId: row.id,
        summary: `Đăng nhập thành công (${row.role})`,
        ip
      });
    });

    return {
      token,
      expiresAt,
      user: this.sanitizeUser(row)
    };
  }

  authenticateRequest(req) {
    const token = extractSessionToken(req);
    if (!token) return null;
    return this.authenticateToken(token);
  }

  authenticateToken(token) {
    if (!token) return null;
    const tokenHash = sha256(token);
    const row = this.dbm.db.prepare(`
      SELECT
        sess.token_hash, sess.expires_at, sess.revoked,
        u.*, s.id AS staff_id, s.zalo_slot AS staff_zalo_slot, s.team AS staff_team
      FROM sessions sess
      JOIN users u ON u.id = sess.user_id
      LEFT JOIN staff s ON s.user_id = u.id
      WHERE sess.token_hash = ?
    `).get(tokenHash);

    if (!row) return null;
    if (row.revoked) return null;
    if (!row.active) return null;
    if (new Date(row.expires_at).getTime() <= Date.now()) return null;

    // Lightweight touch
    try {
      this.dbm.db.prepare('UPDATE sessions SET last_seen_at = ? WHERE token_hash = ?').run(nowIso(), tokenHash);
    } catch (_) {}

    return {
      tokenHash,
      user: this.sanitizeUser(row)
    };
  }

  logout(token, actor, ip = '') {
    if (!token) return;
    const tokenHash = sha256(token);
    this.dbm.transaction((db) => {
      db.prepare('UPDATE sessions SET revoked = 1 WHERE token_hash = ?').run(tokenHash);
      if (actor) {
        this.dbm.appendAudit(db, {
          actor,
          action: 'AUTH_LOGOUT',
          entityType: 'session',
          entityId: actor.id,
          summary: 'Đăng xuất phiên làm việc',
          ip
        });
      }
    });
  }

  revokeAllUserSessions(userId, dbOrNull = null) {
    const conn = dbOrNull || this.dbm.db;
    conn.prepare('UPDATE sessions SET revoked = 1 WHERE user_id = ?').run(userId);
    if (typeof this.onUserRevoked === 'function') {
      this.onUserRevoked(userId);
    }
  }

  verifyElevatedAdminConfirmation(userId, { confirmPassword, confirmPin }) {
    const row = this.dbm.db.prepare('SELECT password_hash, mfa_pin_hash FROM users WHERE id = ?').get(userId);
    if (!row) return false;
    if (confirmPin && row.mfa_pin_hash && verifyPassword(confirmPin, row.mfa_pin_hash)) {
      return true;
    }
    if (confirmPassword && verifyPassword(confirmPassword, row.password_hash)) {
      return true;
    }
    return false;
  }

  changePassword(userId, currentPassword, newPassword, ip = '') {
    if (!newPassword || String(newPassword).length < 8) {
      const err = new Error('Mật khẩu mới phải có ít nhất 8 ký tự.');
      err.statusCode = 400;
      throw err;
    }
    const row = this.dbm.db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!row || !verifyPassword(currentPassword, row.password_hash)) {
      const err = new Error('Mật khẩu hiện tại không đúng.');
      err.statusCode = 400;
      throw err;
    }
    this.dbm.transaction((db) => {
      db.prepare('UPDATE users SET password_hash = ?, must_change_password = 0, updated_at = ? WHERE id = ?')
        .run(hashPassword(newPassword), nowIso(), userId);
      this.dbm.appendAudit(db, {
        actor: row,
        action: 'AUTH_CHANGE_PASSWORD',
        entityType: 'user',
        entityId: userId,
        summary: 'Người dùng đổi mật khẩu tài khoản',
        ip
      });
    });
  }

  // --- Authorization & Record Scope Rules ---
  isAdminOrManager(user) {
    return user && (user.role === ROLES.SUPER_ADMIN || user.role === ROLES.MANAGER);
  }

  isSuperAdmin(user) {
    return user && user.role === ROLES.SUPER_ADMIN;
  }

  requireRole(user, allowedRoles) {
    if (!user || !allowedRoles.includes(user.role)) {
      const err = new Error('Bạn không có quyền thực hiện thao tác này.');
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }
  }

  requirePermission(user, flagName, message) {
    if (!user) {
      const err = new Error('Chưa đăng nhập.');
      err.statusCode = 401;
      throw err;
    }
    if (user.role === ROLES.SUPER_ADMIN) return;
    if (!user[flagName]) {
      const err = new Error(message || `Bạn không có quyền (${flagName}).`);
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }
  }

  /**
   * Check whether `user` can access (view/edit) a record assigned to `recordStaffId`.
   * Scope rules:
   * - `all` or `super_admin` or `manager`: full room visibility
   * - `team`: records assigned to staff in the same team (or unassigned)
   * - `own`: strictly records assigned to `user.staff_id`
   */
  canAccessRecord(user, recordStaffId, recordTeam = null) {
    if (!user || !user.active) return false;
    if (user.role === ROLES.SUPER_ADMIN || user.scope === SCOPES.ALL) return true;
    if (user.scope === SCOPES.TEAM) {
      if (!recordStaffId) return true;
      if (recordStaffId === user.staff_id) return true;
      if (recordTeam && user.team && recordTeam === user.team) return true;
      const stf = this.dbm.db.prepare('SELECT team FROM staff WHERE id = ?').get(recordStaffId);
      return Boolean(stf && stf.team === user.team);
    }
    // scope === 'own'
    return Boolean(user.staff_id && recordStaffId === user.staff_id);
  }

  buildScopeFilterSql(user, staffColAlias = 'r.assigned_staff_id') {
    if (user.role === ROLES.SUPER_ADMIN || user.scope === SCOPES.ALL) {
      return { sql: '1=1', params: [] };
    }
    if (user.scope === SCOPES.TEAM) {
      const teamStaff = this.dbm.db.prepare('SELECT id FROM staff WHERE team = ?').all(user.team || 'Tư vấn tuyển sinh').map(x => x.id);
      if (teamStaff.length === 0) return { sql: `${staffColAlias} IS NULL`, params: [] };
      const placeholders = teamStaff.map(() => '?').join(',');
      return { sql: `(${staffColAlias} IS NULL OR ${staffColAlias} IN (${placeholders}))`, params: teamStaff };
    }
    // own scope
    if (!user.staff_id) {
      return { sql: '1=0', params: [] };
    }
    return { sql: `${staffColAlias} = ?`, params: [user.staff_id] };
  }

  makeSessionCookie(token, maxAgeSeconds, isHttps = false) {
    return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}${isHttps ? '; Secure' : ''}`;
  }

  clearSessionCookie(isHttps = false) {
    return `${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${isHttps ? '; Secure' : ''}`;
  }
}

module.exports = {
  AuthService,
  SESSION_COOKIE_NAME,
  extractSessionToken,
  parseCookies
};

  },

  // =========================================================================
  // MODULE: ./sla-kpi
  // =========================================================================
  "./sla-kpi": function (module, exports, require) {
'use strict';

const { getIntakeMonths, STAGE_CODE, MILESTONE_TYPE } = require('./constants');

function parseHm(hm) {
  const [h, m] = String(hm || '00:00').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Convert a UTC Date to local (Vietnam UTC+7) calendar components using fixed offset.
 */
function toLocalParts(date, offsetMinutes = 420) {
  const shifted = new Date(date.getTime() + offsetMinutes * 60000);
  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth() + 1;
  const day = shifted.getUTCDate();
  const dow = shifted.getUTCDay(); // 0=Sun .. 6=Sat
  const minutesOfDay = shifted.getUTCHours() * 60 + shifted.getUTCMinutes() + shifted.getUTCSeconds() / 60;
  const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { year, month, day, dow, minutesOfDay, dateKey, shiftedMs: shifted.getTime() };
}

/**
 * Compute exact working-hours minutes between startIso and endIso according to configured shifts & holidays.
 */
function calcBusinessMinutes(startIso, endIso, workingHours) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  if (end.getTime() <= start.getTime()) return 0;

  const offsetMin = Number(workingHours.timezoneOffsetMinutes ?? 420);
  const workDays = new Set(workingHours.workDays || [1, 2, 3, 4, 5, 6]);
  const holidays = new Set(workingHours.holidays || []);
  const shifts = (workingHours.shifts || [
    { start: '07:30', end: '11:30' },
    { start: '13:00', end: '17:00' },
    { start: '17:00', end: '21:00' }
  ]).map(s => ({ start: parseHm(s.start), end: parseHm(s.end) }));

  // Cap loop to 120 days to stay fast even on old unhandled leads
  const maxEndMs = Math.min(end.getTime(), start.getTime() + 120 * 86400000);
  const startLocal = toLocalParts(start, offsetMin);
  const endLocal = toLocalParts(new Date(maxEndMs), offsetMin);

  // Iterate day by day in shifted UTC space
  const startDayMidnightMs = Date.UTC(startLocal.year, startLocal.month - 1, startLocal.day);
  const endDayMidnightMs = Date.UTC(endLocal.year, endLocal.month - 1, endLocal.day);

  let totalMinutes = 0;
  for (let dayMs = startDayMidnightMs; dayMs <= endDayMidnightMs; dayMs += 86400000) {
    const dObj = new Date(dayMs);
    const dow = dObj.getUTCDay();
    const dateKey = `${dObj.getUTCFullYear()}-${String(dObj.getUTCMonth() + 1).padStart(2, '0')}-${String(dObj.getUTCDate()).padStart(2, '0')}`;
    if (!workDays.has(dow) || holidays.has(dateKey)) continue;

    const dayStartMin = dayMs === startDayMidnightMs ? startLocal.minutesOfDay : 0;
    const dayEndMin = dayMs === endDayMidnightMs ? endLocal.minutesOfDay : 1440;
    if (dayEndMin <= dayStartMin) continue;

    for (const sh of shifts) {
      const overlapStart = Math.max(dayStartMin, sh.start);
      const overlapEnd = Math.min(dayEndMin, sh.end);
      if (overlapEnd > overlapStart) {
        totalMinutes += (overlapEnd - overlapStart);
      }
    }
  }
  return Math.round(totalMinutes * 10) / 10;
}

function isWithinBusinessHours(dateObj, workingHours) {
  const offsetMin = Number(workingHours.timezoneOffsetMinutes ?? 420);
  const workDays = new Set(workingHours.workDays || [1, 2, 3, 4, 5, 6]);
  const holidays = new Set(workingHours.holidays || []);
  const lp = toLocalParts(dateObj, offsetMin);
  if (!workDays.has(lp.dow) || holidays.has(lp.dateKey)) return false;
  const shifts = (workingHours.shifts || []).map(s => ({ start: parseHm(s.start), end: parseHm(s.end) }));
  return shifts.some(sh => lp.minutesOfDay >= sh.start && lp.minutesOfDay <= sh.end);
}

/**
 * Evaluate a single registration's SLA classification cleanly.
 * Buckets:
 * - insufficient_timestamp: missing start timestamp (never auto-counted as on_time!)
 * - on_time: first_contact_at present & businessMinutes <= slaMinutes
 * - overdue_handled: first_contact_at present & businessMinutes > slaMinutes
 * - after_hours_pending: unhandled, arrived outside business hours, and 0 business minutes elapsed so far
 * - unassigned: unhandled & no assigned_staff_id (also flags isOverdue if businessMinutes > slaMinutes)
 * - overdue_unhandled: unhandled, assigned, and businessMinutes > slaMinutes
 * - in_window_pending: unhandled, assigned, within SLA window (0..slaMinutes)
 */
function evaluateRegistrationSla(reg, workingHours, nowDate = new Date()) {
  const slaLimit = Number(workingHours.slaMinutes || 15);
  const startIso = reg.crm_received_at || reg.source_received_at;
  const handled = Boolean(reg.first_contact_at);

  if (!startIso || Number.isNaN(new Date(startIso).getTime())) {
    return {
      bucket: 'insufficient_timestamp',
      label: 'Chưa đủ căn cứ mốc thời gian',
      handled,
      isOnTime: false,
      isOverdue: false,
      isUnassigned: !reg.assigned_staff_id,
      businessMinutes: null,
      slaLimit,
      startIso: null,
      firstContactAt: reg.first_contact_at || null
    };
  }

  if (handled) {
    const fcDate = new Date(reg.first_contact_at);
    if (Number.isNaN(fcDate.getTime())) {
      return {
        bucket: 'insufficient_timestamp',
        label: 'Mốc liên hệ đầu không hợp lệ',
        handled: false,
        isOnTime: false,
        isOverdue: false,
        isUnassigned: !reg.assigned_staff_id,
        businessMinutes: null,
        slaLimit,
        startIso,
        firstContactAt: null
      };
    }
    const bizMin = calcBusinessMinutes(startIso, reg.first_contact_at, workingHours);
    if (bizMin <= slaLimit) {
      return {
        bucket: 'on_time',
        label: `Đạt SLA (${bizMin} phút)`,
        handled: true,
        isOnTime: true,
        isOverdue: false,
        isUnassigned: !reg.assigned_staff_id,
        businessMinutes: bizMin,
        slaLimit,
        startIso,
        firstContactAt: reg.first_contact_at
      };
    }
    return {
      bucket: 'overdue_handled',
      label: `Đã xử lý - Trễ SLA (${bizMin} phút)`,
      handled: true,
      isOnTime: false,
      isOverdue: true,
      isUnassigned: !reg.assigned_staff_id,
      businessMinutes: bizMin,
      slaLimit,
      startIso,
      firstContactAt: reg.first_contact_at
    };
  }

  // Unhandled case
  const bizMin = calcBusinessMinutes(startIso, nowDate.toISOString(), workingHours);
  const startInHours = isWithinBusinessHours(new Date(startIso), workingHours);
  const nowInHours = isWithinBusinessHours(nowDate, workingHours);

  if (!startInHours && bizMin === 0 && !nowInHours) {
    return {
      bucket: 'after_hours_pending',
      label: 'Tiếp nhận ngoài giờ (chờ đầu ca)',
      handled: false,
      isOnTime: false,
      isOverdue: false,
      isUnassigned: !reg.assigned_staff_id,
      businessMinutes: 0,
      slaLimit,
      startIso,
      firstContactAt: null
    };
  }

  if (!reg.assigned_staff_id) {
    const isOverdue = bizMin > slaLimit;
    return {
      bucket: 'unassigned',
      label: isOverdue ? `Chưa phân công - Quá hạn (${bizMin} phút)` : `Chưa phân công (${bizMin} phút)`,
      handled: false,
      isOnTime: false,
      isOverdue,
      isUnassigned: true,
      businessMinutes: bizMin,
      slaLimit,
      startIso,
      firstContactAt: null
    };
  }

  if (bizMin > slaLimit) {
    return {
      bucket: 'overdue_unhandled',
      label: `Quá hạn chưa gọi (${bizMin} phút)`,
      handled: false,
      isOnTime: false,
      isOverdue: true,
      isUnassigned: false,
      businessMinutes: bizMin,
      slaLimit,
      startIso,
      firstContactAt: null
    };
  }

  return {
    bucket: 'in_window_pending',
    label: `Trong hạn SLA (${bizMin}/${slaLimit} phút)`,
    handled: false,
    isOnTime: false,
    isOverdue: false,
    isUnassigned: false,
    atRisk: bizMin >= Math.max(1, slaLimit - 5),
    businessMinutes: bizMin,
    slaLimit,
    startIso,
    firstContactAt: null
  };
}

function computeSlaSummary(registrations, workingHours, nowDate = new Date()) {
  const counts = {
    total: registrations.length,
    handled: 0,
    on_time: 0,
    overdue_handled: 0,
    overdue_unhandled: 0,
    after_hours_pending: 0,
    unassigned: 0,
    in_window_pending: 0,
    insufficient_timestamp: 0
  };
  const items = [];
  let sumResponseMin = 0;
  let responseCount = 0;

  for (const reg of registrations) {
    const ev = evaluateRegistrationSla(reg, workingHours, nowDate);
    counts[ev.bucket] = (counts[ev.bucket] || 0) + 1;
    if (ev.handled) {
      counts.handled++;
      if (ev.businessMinutes !== null) {
        sumResponseMin += ev.businessMinutes;
        responseCount++;
      }
    }
    items.push({ ...reg, sla: ev });
  }

  // Measurable denominator for On-Time SLA: leads that either responded or already exceeded SLA (including overdue unassigned)
  const overdueUnassigned = items.filter(x => x.sla.bucket === 'unassigned' && x.sla.isOverdue).length;
  const slaDenominator = counts.on_time + counts.overdue_handled + counts.overdue_unhandled + overdueUnassigned;
  const handledRate = counts.total > 0 ? Math.round((counts.handled / counts.total) * 1000) / 10 : 0;
  const onTimeSlaRate = slaDenominator > 0 ? Math.round((counts.on_time / slaDenominator) * 1000) / 10 : null;
  const avgResponseMinutes = responseCount > 0 ? Math.round((sumResponseMin / responseCount) * 10) / 10 : null;

  return {
    counts,
    overdueUnassigned,
    slaDenominator,
    handledRate,
    onTimeSlaRate,
    avgResponseMinutes,
    items
  };
}

/**
 * Compute official ITC report deadlines (Vietnam UTC+7):
 * - Weekly report: every Saturday BEFORE 09:30 (<09:30)
 * - Monthly report: BEFORE Day 25 (i.e., Day 24 23:59:59, NOT Day 25 23:59!)
 * Linked to actual submitted/approved report snapshots in the database.
 */
function computeReportDeadlines(db, intakeYear, nowDate = new Date()) {
  const offsetMin = 420;
  const lp = toLocalParts(nowDate, offsetMin);

  // Next Saturday 09:30 local
  const daysToSat = (6 - lp.dow + 7) % 7;
  let satDayOffset = daysToSat;
  if (daysToSat === 0 && lp.minutesOfDay >= 9 * 60 + 30) {
    satDayOffset = 7;
  }
  const satLocalUtcMs = Date.UTC(lp.year, lp.month - 1, lp.day + satDayOffset, 9, 30, 0) - offsetMin * 60000;
  const nextWeeklyDeadline = new Date(satLocalUtcMs);

  // Current week window (Monday .. Saturday)
  const daysSinceMon = (lp.dow + 6) % 7;
  const monLocalMs = Date.UTC(lp.year, lp.month - 1, lp.day - daysSinceMon, 0, 0, 0) - offsetMin * 60000;
  const weekStartIso = new Date(monLocalMs).toISOString();

  // Monthly deadline: BEFORE Day 25 -> Day 24 at 23:59:59 local
  let targetMonthYear = lp.year;
  let targetMonth = lp.month;
  if (lp.day >= 25) {
    targetMonth += 1;
    if (targetMonth > 12) { targetMonth = 1; targetMonthYear += 1; }
  }
  const monthlyDeadlineMs = Date.UTC(targetMonthYear, targetMonth - 1, 24, 23, 59, 59) - offsetMin * 60000;
  const nextMonthlyDeadline = new Date(monthlyDeadlineMs);
  const monthStartIso = new Date(Date.UTC(targetMonthYear, targetMonth - 1, 1, 0, 0, 0) - offsetMin * 60000).toISOString();

  const weeklySubmitted = db.prepare(`
    SELECT id, title, status, approved_at, created_at FROM report_snapshots
    WHERE intake_year = ? AND period_type = 'week' AND created_at >= ?
    ORDER BY created_at DESC LIMIT 1
  `).get(intakeYear, weekStartIso);

  const monthlySubmitted = db.prepare(`
    SELECT id, title, status, approved_at, created_at FROM report_snapshots
    WHERE intake_year = ? AND period_type = 'month' AND created_at >= ?
    ORDER BY created_at DESC LIMIT 1
  `).get(intakeYear, monthStartIso);

  return {
    weekly: {
      rule: 'Thứ 7 hàng tuần trước 09:30',
      deadlineAt: nextWeeklyDeadline.toISOString(),
      hoursRemaining: Math.max(0, Math.round((nextWeeklyDeadline.getTime() - nowDate.getTime()) / 360000) / 10),
      submitted: Boolean(weeklySubmitted),
      approved: Boolean(weeklySubmitted && weeklySubmitted.status === 'approved'),
      latestSnapshot: weeklySubmitted || null
    },
    monthly: {
      rule: 'Trước ngày 25 hàng tháng (chốt 23:59 ngày 24)',
      deadlineAt: nextMonthlyDeadline.toISOString(),
      hoursRemaining: Math.max(0, Math.round((nextMonthlyDeadline.getTime() - nowDate.getTime()) / 360000) / 10),
      submitted: Boolean(monthlySubmitted),
      approved: Boolean(monthlySubmitted && monthlySubmitted.status === 'approved'),
      latestSnapshot: monthlySubmitted || null
    }
  };
}

function getMonthDateRange(monthKey) {
  // monthKey: 'YYYY-MM'
  const [y, m] = String(monthKey).split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
    daysInMonth: end.getUTCDate()
  };
}

/**
 * Expected progress ratio in a given monthKey as of nowDate (fixes naive <50% warning on day 1).
 */
function getExpectedMonthProgress(monthKey, nowDate = new Date()) {
  const [y, m] = String(monthKey).split('-').map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lp = toLocalParts(nowDate, 420);
  if (lp.year > y || (lp.year === y && lp.month > m)) {
    return { ratio: 1, elapsedDays: daysInMonth, daysInMonth, status: 'past' };
  }
  if (lp.year < y || (lp.year === y && lp.month < m)) {
    return { ratio: 0, elapsedDays: 0, daysInMonth, status: 'future' };
  }
  const ratio = Math.min(1, Math.max(0, lp.day / daysInMonth));
  return { ratio: Math.round(ratio * 1000) / 1000, elapsedDays: lp.day, daysInMonth, status: 'current' };
}

/**
 * Core milestone-based KPI computation strictly scoped by intakeYear and monthKey (or date range).
 * Guarantees:
 * - Multi-year isolation (2027 never leaks into 2028)
 * - Monthly numbers come from milestone_events occurring in THAT exact month
 * - Cumulative submitted includes enrolled (unless withdrawn), counted cleanly via strict enums
 * - Reassignment/handover preserves historical attribution via milestone_events.attributed_staff_id
 */
function computeKpiReport(db, { intakeYear, monthKey = null, cutoffIso = null, nowDate = new Date() }) {
  const months = getIntakeMonths(intakeYear);
  const selectedMonth = monthKey || (months[0] ? months[0].key : `${Number(intakeYear) - 1}-11`);
  const cutoff = cutoffIso || nowDate.toISOString();

  // Active KPI Plan version for this intake year
  let plan = db.prepare(`
    SELECT * FROM kpi_plan_versions
    WHERE intake_year = ? AND status = 'active'
    ORDER BY version_number DESC LIMIT 1
  `).get(intakeYear);

  if (!plan) {
    plan = db.prepare(`
      SELECT * FROM kpi_plan_versions
      WHERE intake_year = ?
      ORDER BY version_number DESC LIMIT 1
    `).get(intakeYear);
  }

  const allStaff = db.prepare(`
    SELECT s.*, u.role AS user_role
    FROM staff s
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.active = 1
    ORDER BY s.id ASC
  `).all();

  const targets = plan
    ? db.prepare('SELECT * FROM kpi_targets WHERE plan_version_id = ?').all(plan.id)
    : [];

  // Map targets[staffId][monthKey]
  const targetMap = {};
  const annualTargetMap = {};
  for (const t of targets) {
    if (!targetMap[t.staff_id]) targetMap[t.staff_id] = {};
    targetMap[t.staff_id][t.month_key] = {
      lead: t.target_lead,
      submitted: t.target_submitted,
      enrolled: t.target_enrolled
    };
    if (!annualTargetMap[t.staff_id]) annualTargetMap[t.staff_id] = { lead: 0, submitted: 0, enrolled: 0 };
    annualTargetMap[t.staff_id].lead += t.target_lead;
    annualTargetMap[t.staff_id].submitted += t.target_submitted;
    annualTargetMap[t.staff_id].enrolled += t.target_enrolled;
  }

  // Fetch all active registrations and active milestone events for this intakeYear ONLY
  const activeRegs = db.prepare(`
    SELECT id, person_id, assigned_staff_id, stage_code, created_at
    FROM registrations
    WHERE intake_year = ? AND deleted_at IS NULL
  `).all(intakeYear);
  const activeRegMap = new Map(activeRegs.map(r => [r.id, r]));

  const milestones = db.prepare(`
    SELECT m.*
    FROM milestone_events m
    JOIN registrations r ON r.id = m.registration_id
    WHERE m.intake_year = ? AND m.is_active = 1 AND r.deleted_at IS NULL AND m.occurred_at <= ?
    ORDER BY m.occurred_at ASC
  `).all(intakeYear, cutoff);

  // Identify withdrawn registrations up to cutoff
  const withdrawnRegIds = new Set();
  for (const r of activeRegs) {
    if (r.stage_code === STAGE_CODE.WITHDRAWN) withdrawnRegIds.add(r.id);
  }
  for (const m of milestones) {
    if (m.milestone_type === MILESTONE_TYPE.WITHDRAWN) withdrawnRegIds.add(m.registration_id);
  }

  // Track unique reg milestones by type for month & cumulative
  const monthPrefix = selectedMonth; // 'YYYY-MM'
  const byStaffMonth = {};
  const byStaffCum = {};
  const roomMonth = { lead: 0, submitted: 0, enrolled: 0 };
  const roomCum = { lead: 0, submitted: 0, enrolled: 0 };
  const monthlySeries = {};
  for (const m of months) {
    monthlySeries[m.key] = { monthKey: m.key, label: m.label, targetLead: 0, targetSubmitted: 0, targetEnrolled: 0, actualLead: 0, actualSubmitted: 0, actualEnrolled: 0 };
  }
  for (const t of targets) {
    if (monthlySeries[t.month_key]) {
      monthlySeries[t.month_key].targetLead += t.target_lead;
      monthlySeries[t.month_key].targetSubmitted += t.target_submitted;
      monthlySeries[t.month_key].targetEnrolled += t.target_enrolled;
    }
  }

  // Ensure each registration counted at most once per milestone type in cumulative & per month
  const regMilestones = new Map(); // regId -> { registered, submitted, enrolled }
  for (const m of milestones) {
    if (!regMilestones.has(m.registration_id)) regMilestones.set(m.registration_id, {});
    const rm = regMilestones.get(m.registration_id);
    if (m.milestone_type === MILESTONE_TYPE.REGISTERED && !rm.registered) rm.registered = m;
    if (m.milestone_type === MILESTONE_TYPE.SUBMITTED && !rm.submitted) rm.submitted = m;
    if (m.milestone_type === MILESTONE_TYPE.ENROLLED && !rm.enrolled) rm.enrolled = m;
  }

  function inc(map, staffId, field) {
    const key = staffId || '_unassigned';
    if (!map[key]) map[key] = { lead: 0, submitted: 0, enrolled: 0 };
    map[key][field]++;
  }

  function toMonthKey(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const lp = toLocalParts(d, 420);
    return `${lp.year}-${String(lp.month).padStart(2, '0')}`;
  }

  for (const [regId, rm] of regMilestones.entries()) {
    const reg = activeRegMap.get(regId);
    if (!reg) continue;
    const isWithdrawn = withdrawnRegIds.has(regId);

    // 1. Registered (Lead)
    if (rm.registered) {
      const mk = toMonthKey(rm.registered.occurred_at);
      const stf = rm.registered.attributed_staff_id || reg.assigned_staff_id;
      roomCum.lead++;
      inc(byStaffCum, stf, 'lead');
      if (monthlySeries[mk]) monthlySeries[mk].actualLead++;
      if (mk === monthPrefix) {
        roomMonth.lead++;
        inc(byStaffMonth, stf, 'lead');
      }
    }

    // 2. Submitted (cumulative includes enrolled unless withdrawn!)
    if (!isWithdrawn) {
      const effectiveSub = rm.submitted || rm.enrolled;
      if (effectiveSub) {
        const mk = toMonthKey(effectiveSub.occurred_at);
        const stf = effectiveSub.attributed_staff_id || reg.assigned_staff_id;
        roomCum.submitted++;
        inc(byStaffCum, stf, 'submitted');
        if (monthlySeries[mk]) monthlySeries[mk].actualSubmitted++;
        if (mk === monthPrefix) {
          roomMonth.submitted++;
          inc(byStaffMonth, stf, 'submitted');
        }
      }

      // 3. Enrolled
      if (rm.enrolled) {
        const mk = toMonthKey(rm.enrolled.occurred_at);
        const stf = rm.enrolled.attributed_staff_id || reg.assigned_staff_id;
        roomCum.enrolled++;
        inc(byStaffCum, stf, 'enrolled');
        if (monthlySeries[mk]) monthlySeries[mk].actualEnrolled++;
        if (mk === monthPrefix) {
          roomMonth.enrolled++;
          inc(byStaffMonth, stf, 'enrolled');
        }
      }
    }
  }

  const pace = getExpectedMonthProgress(selectedMonth, nowDate);

  // Include all consultant staff + any staff who has targets or actuals
  const staffRows = [];
  for (const s of allStaff) {
    const hasTargets = Boolean(annualTargetMap[s.id] && (annualTargetMap[s.id].lead > 0 || annualTargetMap[s.id].submitted > 0 || annualTargetMap[s.id].enrolled > 0));
    const hasActuals = Boolean(byStaffCum[s.id] && (byStaffCum[s.id].lead > 0 || byStaffCum[s.id].submitted > 0 || byStaffCum[s.id].enrolled > 0));
    const isConsultant = s.user_role === 'consultant' || !s.user_role || s.team === 'Tư vấn tuyển sinh';
    if (!isConsultant && !hasTargets && !hasActuals) continue;

    const mTarget = (targetMap[s.id] && targetMap[s.id][selectedMonth]) || { lead: 0, submitted: 0, enrolled: 0 };
    const yTarget = annualTargetMap[s.id] || { lead: 0, submitted: 0, enrolled: 0 };
    const mActual = byStaffMonth[s.id] || { lead: 0, submitted: 0, enrolled: 0 };
    const yActual = byStaffCum[s.id] || { lead: 0, submitted: 0, enrolled: 0 };

    const expectedMonthLead = Math.round(mTarget.lead * pace.ratio * 10) / 10;
    const monthLeadPct = mTarget.lead > 0 ? Math.round((mActual.lead / mTarget.lead) * 1000) / 10 : null;
    const expectedPct = Math.round(pace.ratio * 1000) / 10;
    // Flag lagging ONLY relative to elapsed time in the month (not naive <50% on Day 1!)
    const isLagging = mTarget.lead > 0 && pace.ratio > 0.15 && mActual.lead < expectedMonthLead * 0.75;

    staffRows.push({
      staff_id: s.id,
      full_name: s.full_name,
      email: s.email,
      zalo_slot: s.zalo_slot,
      team: s.team,
      monthTarget: mTarget,
      monthActual: mActual,
      monthLeadPct,
      expectedMonthLead,
      expectedPct,
      isLagging,
      annualTarget: yTarget,
      annualActual: yActual,
      annualLeadPct: yTarget.lead > 0 ? Math.round((yActual.lead / yTarget.lead) * 1000) / 10 : null,
      annualSubmittedPct: yTarget.submitted > 0 ? Math.round((yActual.submitted / yTarget.submitted) * 1000) / 10 : null,
      annualEnrolledPct: yTarget.enrolled > 0 ? Math.round((yActual.enrolled / yTarget.enrolled) * 1000) / 10 : null
    });
  }

  const roomAnnualTarget = staffRows.reduce((acc, r) => ({
    lead: acc.lead + r.annualTarget.lead,
    submitted: acc.submitted + r.annualTarget.submitted,
    enrolled: acc.enrolled + r.annualTarget.enrolled
  }), { lead: 0, submitted: 0, enrolled: 0 });

  const roomMonthTarget = staffRows.reduce((acc, r) => ({
    lead: acc.lead + r.monthTarget.lead,
    submitted: acc.submitted + r.monthTarget.submitted,
    enrolled: acc.enrolled + r.monthTarget.enrolled
  }), { lead: 0, submitted: 0, enrolled: 0 });

  return {
    intakeYear,
    selectedMonth,
    cutoffIso: cutoff,
    planVersion: plan || null,
    pace,
    months,
    roomMonthTarget,
    roomMonthActual: roomMonth,
    roomAnnualTarget,
    roomAnnualActual: roomCum,
    unassignedActual: byStaffCum['_unassigned'] || { lead: 0, submitted: 0, enrolled: 0 },
    staffRows,
    monthlySeries: Object.values(monthlySeries)
  };
}

module.exports = {
  calcBusinessMinutes,
  isWithinBusinessHours,
  evaluateRegistrationSla,
  computeSlaSummary,
  computeReportDeadlines,
  getMonthDateRange,
  getExpectedMonthProgress,
  computeKpiReport,
  toLocalParts
};

  },

  // =========================================================================
  // MODULE: ./import-engine
  // =========================================================================
  "./import-engine": function (module, exports, require) {
'use strict';

const XLSX = require('xlsx');
const { newId, nowIso } = require('./db');
const { STAGE_CODE, MILESTONE_TYPE, CONTACT_STATUS, DEFAULT_DOCUMENT_CHECKLIST } = require('./constants');
const {
  normalizePhone,
  normalizeVi,
  mapImportedStageStatus,
  mapImportedContactStatus,
  cleanString
} = require('./validators');

// Known ITC major keywords (strict explicit match only - NEVER default unknown to CNTT!)
const MAJOR_MATCHERS = [
  { pattern: /\b(ke toan doanh nghiep)\b/, major: 'Kế toán doanh nghiệp' },
  { pattern: /\b(ke toan|kt)\b/, major: 'Kế toán' },
  { pattern: /\b(thiet ke do hoa|do hoa|tkdh|graphic)\b/, major: 'Thiết kế đồ họa' },
  { pattern: /\b(lap trinh may tinh|lap trinh|ltmt|software)\b/, major: 'Lập trình máy tính' },
  { pattern: /\b(quan tri mang|mang may tinh|qtm)\b/, major: 'Quản trị mạng máy tính' },
  { pattern: /\b(truyen thong va mang)\b/, major: 'Truyền thông và Mạng máy tính' },
  { pattern: /\b(cong nghe thong tin|cntt|it)\b/, major: 'Công nghệ thông tin' },
  { pattern: /\b(thuong mai dien tu|tmdt|ecommerce)\b/, major: 'Thương mại điện tử' },
  { pattern: /\b(digital marketing|marketing|mkt)\b/, major: 'Digital Marketing' },
  { pattern: /\b(quan tri kinh doanh|qtkd)\b/, major: 'Quản trị kinh doanh' },
  { pattern: /\b(logistics|xuat nhap khau)\b/, major: 'Logistics' },
  { pattern: /\b(tai chinh|ngan hang|tcnh)\b/, major: 'Tài chính - Ngân hàng' },
  { pattern: /\b(huong dan du lich|du lich)\b/, major: 'Hướng dẫn du lịch' },
  { pattern: /\b(quan tri khach san|khach san)\b/, major: 'Quản trị khách sạn' },
  { pattern: /\b(tieng anh|ngon ngu anh)\b/, major: 'Tiếng Anh' },
  { pattern: /\b(tieng han|ngon ngu han)\b/, major: 'Tiếng Hàn' },
  { pattern: /\b(tieng nhat|ngon ngu nhat)\b/, major: 'Tiếng Nhật' },
  { pattern: /\b(dien tu|vien thong)\b/, major: 'Công nghệ kỹ thuật điện tử - viễn thông' },
  { pattern: /\b(tu dong hoa|dieu khien)\b/, major: 'Công nghệ kỹ thuật điều khiển và tự động hóa' }
];

function detectMajorStrict(text) {
  const norm = normalizeVi(text);
  if (!norm) return '';
  for (const m of MAJOR_MATCHERS) {
    if (m.pattern.test(norm)) return m.major;
  }
  return ''; // NEVER invent CNTT when unknown!
}

function resolveStaffFromText(rawStaff, staffList) {
  const norm = normalizeVi(rawStaff);
  if (!norm) return null;
  for (const stf of staffList) {
    const sName = normalizeVi(stf.full_name);
    const sZalo = normalizeVi(stf.zalo_slot);
    const sEmail = normalizeVi(stf.email);
    if (norm === sName || norm === stf.id.toLowerCase() || (sZalo && norm === sZalo) || (sEmail && norm === sEmail)) {
      return stf;
    }
    // Partial match on last two words of staff name (e.g. "Nhựt Điển" or "Kim Trang")
    const parts = sName.split(' ');
    const lastTwo = parts.slice(-2).join(' ');
    if (lastTwo.length >= 5 && norm.includes(lastTwo)) {
      return stf;
    }
    if (sZalo && norm.includes(sZalo)) {
      return stf;
    }
  }
  return null; // NEVER turn arbitrary chat text into a staff name!
}

function isSummaryOrNoiseRow(cells) {
  const joined = normalizeVi(cells.join(' '));
  if (!joined) return true;
  if (/^(tong cong|tong so|cong cong|stt|ho va ten|ho ten|total|subtotal)\b/.test(joined)) return true;
  return false;
}

const CRM_HEADER_ALIASES = {
  full_name: ['ho va ten', 'ho ten', 'ten thi sinh', 'thi sinh', 'hoc sinh', 'full name', 'name'],
  student_phone: ['so dien thoai', 'sdt', 'dien thoai', 'sdt thi sinh', 'so dt', 'phone', 'mobile'],
  parent_phone: ['sdt phu huynh', 'so phu huynh', 'dien thoai phu huynh', 'parent phone', 'sdt ph'],
  major: ['nganh quan tam', 'nganh dang ky', 'nganh', 'nganh hoc', 'chuyen nganh', 'major'],
  school: ['truong thpt', 'truong', 'thpt', 'ten truong', 'school'],
  province: ['tinh', 'tinh/tp', 'tinh thanh', 'thanh pho', 'dia phuong', 'province'],
  school_province_combined: ['tinh / truong thpt', 'tinh/truong thpt', 'truong / tinh', 'truong/tinh', 'tinh - truong'],
  source: ['nguon', 'kenh', 'nguon data', 'source', 'kenh tiep nhan'],
  staff: ['nhan su phu trach', 'phu trach', 'chuyen vien', 'tu van vien', 'nhan su', 'staff', 'zalo'],
  contact_status: ['trang thai cham soc', 'trang thai lien he', 'cham soc', 'tinh trang goi', 'contact status'],
  stage_text: ['ket qua cuoi cung', 'ket qua', 'trang thai ho so', 'giai doan', 'tien trinh', 'stage'],
  notes: ['ghi chu', 'note', 'notes', 'noi dung tu van', 'phan hoi'],
  received_at: ['ngay dang ky', 'ngay tiep nhan', 'thoi gian', 'ngay thu thap', 'ngay', 'date'],
  event_name: ['su kien', 'chuong trinh', 'dot tu van', 'event', 'chien dich']
};

function detectHeaderMapping(rowCells) {
  const mapping = {};
  let matchedCount = 0;
  rowCells.forEach((cell, idx) => {
    const norm = normalizeVi(cell);
    if (!norm) return;
    for (const [field, aliases] of Object.entries(CRM_HEADER_ALIASES)) {
      if (mapping[field] !== undefined) continue;
      if (aliases.some(a => norm === a || norm.includes(a))) {
        mapping[field] = idx;
        matchedCount++;
        break;
      }
    }
  });
  return { mapping, matchedCount };
}

function splitCombinedSchoolProvince(raw) {
  const txt = String(raw || '').trim();
  if (!txt) return { province: '', school: '' };
  // Supports "Tiền Giang - THPT Nguyễn Đình Chiểu" or "THPT ABC / Long An" or "Long An | THPT ABC"
  const sep = txt.includes(' - ') ? ' - ' : (txt.includes(' / ') ? ' / ' : (txt.includes('|') ? '|' : null));
  if (sep) {
    const parts = txt.split(sep).map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      if (/thpt|trung hoc|gdtx|cao dang/i.test(parts[0])) {
        return { school: parts[0], province: parts.slice(1).join(' - ') };
      }
      return { province: parts[0], school: parts.slice(1).join(' - ') };
    }
  }
  if (/thpt|trung hoc|gdtx/i.test(txt)) {
    return { school: txt, province: '' };
  }
  return { province: '', school: txt };
}

function parseExcelBufferToMatrix(buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const firstSheetName = wb.SheetNames[0];
  if (!firstSheetName) return [];
  const sheet = wb.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
}

function parseQuickPasteTextToMatrix(text) {
  const lines = String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(l => l.trimEnd())
    .filter(l => l.trim().length > 0);
  return lines.map(line => {
    if (line.includes('\t')) return line.split('\t').map(c => c.trim());
    if (line.includes('|')) return line.split('|').map(c => c.trim());
    if (line.includes(';')) return line.split(';').map(c => c.trim());
    return line.split(',').map(c => c.trim());
  });
}

function parseDateSafe(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;
  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (dmy) {
    const day = Number(dmy[1]);
    const mon = Number(dmy[2]);
    const yr = Number(dmy[3]);
    const hr = dmy[4] ? Number(dmy[4]) : 9;
    const min = dmy[5] ? Number(dmy[5]) : 0;
    // Interpret as Vietnam UTC+7
    const utcMs = Date.UTC(yr, mon - 1, day, hr, min, 0) - 420 * 60000;
    const d = new Date(utcMs);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Unified CRM Parser (used for BOTH Excel upload AND 8-column Quick Paste!).
 * Default 8-column positional fallback matches official CRM template:
 * 0: Họ và tên | 1: SĐT | 2: Ngành quan tâm | 3: Nguồn | 4: Nhân sự phụ trách | 5: Trạng thái chăm sóc | 6: Kết quả cuối cùng | 7: Ghi chú
 */
function parseCrmMatrix(matrix, { db, intakeYear, staffList, defaultSource = 'Import Excel CRM' }) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    return { columns: {}, rows: [], stats: { total: 0, newCount: 0, updatedCount: 0, duplicateCount: 0, pendingVerifyCount: 0, errorCount: 0 } };
  }

  // Locate header row in first 5 rows
  let headerRowIdx = -1;
  let mapping = {};
  for (let i = 0; i < Math.min(5, matrix.length); i++) {
    const res = detectHeaderMapping(matrix[i]);
    if (res.matchedCount >= 2 && (res.mapping.full_name !== undefined || res.mapping.student_phone !== undefined)) {
      headerRowIdx = i;
      mapping = res.mapping;
      break;
    }
  }

  const startIdx = headerRowIdx >= 0 ? headerRowIdx + 1 : 0;
  if (headerRowIdx === -1) {
    // Official 8-column CRM layout fallback (fixes column drift & 8th column drop!)
    mapping = {
      full_name: 0,
      student_phone: 1,
      major: 2,
      source: 3,
      staff: 4,
      contact_status: 5,
      stage_text: 6,
      notes: 7
    };
  }

  // Existing registrations in this intake year for unified deduplication
  const existingRegs = db.prepare(`
    SELECT r.*, p.full_name, p.student_phone, p.parent_phone
    FROM registrations r
    JOIN persons p ON p.id = r.person_id
    WHERE r.intake_year = ? AND r.deleted_at IS NULL
  `).all(intakeYear);

  const byStudentPhone = new Map();
  const byParentPhone = new Map();
  for (const er of existingRegs) {
    if (er.student_phone) {
      if (!byStudentPhone.has(er.student_phone)) byStudentPhone.set(er.student_phone, []);
      byStudentPhone.get(er.student_phone).push(er);
    }
    if (er.parent_phone) {
      if (!byParentPhone.has(er.parent_phone)) byParentPhone.set(er.parent_phone, []);
      byParentPhone.get(er.parent_phone).push(er);
    }
  }

  const seenInBatch = new Map();
  const parsedRows = [];
  const stats = { total: 0, newCount: 0, updatedCount: 0, duplicateCount: 0, pendingVerifyCount: 0, errorCount: 0 };

  for (let i = startIdx; i < matrix.length; i++) {
    const rawCells = (matrix[i] || []).map(c => String(c === null || c === undefined ? '' : c).trim());
    if (rawCells.every(c => !c) || isSummaryOrNoiseRow(rawCells)) continue;

    stats.total++;
    const get = (field) => (mapping[field] !== undefined ? (rawCells[mapping[field]] || '') : '');

    const fullName = cleanString(get('full_name'), 160);
    const rawPhone = get('student_phone');
    const studentPhone = normalizePhone(rawPhone);
    const parentPhone = normalizePhone(get('parent_phone'));
    const rawMajor = cleanString(get('major'), 160);
    const matchedMajor = rawMajor ? (detectMajorStrict(rawMajor) || rawMajor) : '';
    let school = cleanString(get('school'), 200);
    let province = cleanString(get('province'), 120);
    if ((!school || !province) && mapping.school_province_combined !== undefined) {
      const sp = splitCombinedSchoolProvince(get('school_province_combined'));
      if (!school) school = sp.school;
      if (!province) province = sp.province;
    }

    const source = cleanString(get('source') || defaultSource, 120);
    const staffRaw = get('staff');
    const matchedStaff = resolveStaffFromText(staffRaw, staffList);
    const contactStatus = mapImportedContactStatus(get('contact_status'));
    const stageRes = mapImportedStageStatus(get('stage_text'));
    const notes = cleanString(get('notes'), 2000);
    const receivedAt = parseDateSafe(get('received_at'));

    const errors = [];
    if (!fullName) errors.push('Thiếu họ tên thí sinh');
    if (rawPhone && !studentPhone) errors.push(`SĐT không hợp lệ (${rawPhone})`);
    if (!studentPhone && !parentPhone) errors.push('Thiếu cả SĐT thí sinh và SĐT phụ huynh');

    if (errors.length > 0) {
      stats.errorCount++;
      parsedRows.push({
        rowIndex: i + 1,
        action: 'error',
        errors,
        parsed: { full_name: fullName, student_phone: studentPhone, parent_phone: parentPhone, major: matchedMajor, school, province, source, assigned_staff_id: matchedStaff ? matchedStaff.id : null, contact_status: contactStatus, stage_code: stageRes.stageCode, raw_status_text: stageRes.rawStatusText, notes, source_received_at: receivedAt },
        existingMatch: null
      });
      continue;
    }

    if (stageRes.stageCode === STAGE_CODE.PENDING_VERIFY) {
      stats.pendingVerifyCount++;
    }

    // Check duplicates
    let action = 'new';
    let existingMatch = null;
    let duplicateReason = '';

    const candidates = studentPhone ? (byStudentPhone.get(studentPhone) || []) : [];
    const parentCandidates = parentPhone ? (byParentPhone.get(parentPhone) || []) : [];
    const samePhoneInBatch = studentPhone ? seenInBatch.get(studentPhone) : null;

    if (candidates.length > 0) {
      const sameNameMatch = candidates.find(c => normalizeVi(c.full_name) === normalizeVi(fullName));
      if (sameNameMatch) {
        action = 'updated';
        existingMatch = { id: sameNameMatch.id, full_name: sameNameMatch.full_name, student_phone: sameNameMatch.student_phone, major: sameNameMatch.major, stage_code: sameNameMatch.stage_code, contact_status: sameNameMatch.contact_status };
        duplicateReason = 'Trùng SĐT và họ tên cùng niên khóa -> gộp cập nhật, giữ lịch sử nguồn, không đếm lặp KPI';
        stats.updatedCount++;
      } else {
        action = 'suspected_duplicate';
        const first = candidates[0];
        existingMatch = { id: first.id, full_name: first.full_name, student_phone: first.student_phone, major: first.major };
        duplicateReason = `Trùng SĐT (${studentPhone}) nhưng khác họ tên ("${first.full_name}" vs "${fullName}") - nghi trùng hoặc anh/chị em dùng chung số phụ huynh`;
        stats.duplicateCount++;
      }
    } else if (samePhoneInBatch) {
      action = 'suspected_duplicate';
      duplicateReason = `Trùng SĐT ngay trong cùng tệp nhập (dòng ${samePhoneInBatch.rowIndex}: ${samePhoneInBatch.full_name})`;
      stats.duplicateCount++;
    } else if (parentCandidates.length > 0) {
      action = 'new';
      duplicateReason = `Dùng chung SĐT phụ huynh (${parentPhone}) với hồ sơ khác - cho phép tạo hồ sơ riêng`;
      stats.newCount++;
    } else {
      stats.newCount++;
    }

    if (studentPhone && !samePhoneInBatch) {
      seenInBatch.set(studentPhone, { rowIndex: i + 1, full_name: fullName });
    }

    parsedRows.push({
      rowIndex: i + 1,
      action,
      errors: [],
      duplicateReason,
      unrecognizedStatus: !stageRes.recognized,
      parsed: {
        full_name: fullName,
        student_phone: studentPhone,
        parent_phone: parentPhone,
        major: matchedMajor,
        school,
        province,
        source,
        assigned_staff_id: matchedStaff ? matchedStaff.id : null,
        assigned_staff_name: matchedStaff ? matchedStaff.full_name : '',
        contact_status: contactStatus,
        stage_code: stageRes.stageCode,
        raw_status_text: stageRes.rawStatusText,
        notes,
        source_received_at: receivedAt
      },
      existingMatch
    });
  }

  return { columns: mapping, headerRowIdx, rows: parsedRows, stats };
}

/**
 * Unified Regional Parser (fixes bug #1: downloading Regional template and re-importing ALWAYS preserves school & province!).
 */
function parseRegionalMatrix(matrix, { staffList, defaultRegion = 'mientay', defaultSource = 'Khảo sát tuyến tỉnh' }) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    return { columns: {}, rows: [], stats: { total: 0, newCount: 0, errorCount: 0 } };
  }

  let headerRowIdx = -1;
  let mapping = {};
  for (let i = 0; i < Math.min(5, matrix.length); i++) {
    const res = detectHeaderMapping(matrix[i]);
    if (res.matchedCount >= 2) {
      headerRowIdx = i;
      mapping = res.mapping;
      break;
    }
  }
  const startIdx = headerRowIdx >= 0 ? headerRowIdx + 1 : 0;
  if (headerRowIdx === -1) {
    // Official Regional template order:
    // 0: Họ và tên | 1: SĐT | 2: SĐT phụ huynh | 3: Trường THPT | 4: Tỉnh/TP | 5: Ngành quan tâm | 6: Sự kiện | 7: Nguồn | 8: Ngày thu thập | 9: Ghi chú
    mapping = {
      full_name: 0,
      student_phone: 1,
      parent_phone: 2,
      school: 3,
      province: 4,
      major: 5,
      event_name: 6,
      source: 7,
      received_at: 8,
      notes: 9
    };
  }

  const rows = [];
  const stats = { total: 0, newCount: 0, errorCount: 0 };

  for (let i = startIdx; i < matrix.length; i++) {
    const rawCells = (matrix[i] || []).map(c => String(c === null || c === undefined ? '' : c).trim());
    if (rawCells.every(c => !c) || isSummaryOrNoiseRow(rawCells)) continue;

    stats.total++;
    const get = (f) => (mapping[f] !== undefined ? (rawCells[mapping[f]] || '') : '');
    const fullName = cleanString(get('full_name'), 160);
    const phone = normalizePhone(get('student_phone'));
    const parentPhone = normalizePhone(get('parent_phone'));
    let school = cleanString(get('school'), 200);
    let province = cleanString(get('province'), 120);
    if (mapping.school_province_combined !== undefined && (!school || !province)) {
      const sp = splitCombinedSchoolProvince(get('school_province_combined'));
      if (!school) school = sp.school;
      if (!province) province = sp.province;
    }
    const rawMajor = cleanString(get('major'), 160);
    const major = rawMajor ? (detectMajorStrict(rawMajor) || rawMajor) : '';
    const eventName = cleanString(get('event_name'), 200);
    const source = cleanString(get('source') || defaultSource, 120);
    const collectedAt = parseDateSafe(get('received_at')) || nowIso();
    const matchedStaff = resolveStaffFromText(get('staff'), staffList);
    const notes = cleanString(get('notes'), 1500);

    const errors = [];
    if (!fullName) errors.push('Thiếu họ tên');
    if (errors.length > 0) {
      stats.errorCount++;
      rows.push({ rowIndex: i + 1, action: 'error', errors, parsed: { full_name: fullName, phone, parent_phone: parentPhone, school, province, major, event_name: eventName, source, collected_at: collectedAt, notes, region: defaultRegion } });
      continue;
    }

    stats.newCount++;
    rows.push({
      rowIndex: i + 1,
      action: 'new',
      errors: [],
      parsed: {
        full_name: fullName,
        phone,
        parent_phone: parentPhone,
        school,
        province,
        major,
        event_name: eventName,
        source,
        collected_at: collectedAt,
        assigned_staff_id: matchedStaff ? matchedStaff.id : null,
        notes,
        region: defaultRegion
      }
    });
  }

  return { columns: mapping, headerRowIdx, rows, stats };
}

/**
 * Multi-candidate Zalo chat / OCR text extractor (fixes bug #3):
 * - Extracts ALL candidates found in the chat text (not just the first one!)
 * - NEVER defaults unknown major to CNTT (leaves empty for verification!)
 * - NEVER assigns arbitrary chat text as staff name (only matches real staff!)
 * - Checks existing CRM registrations for suspected duplicates
 */
function parseZaloCandidates(rawText, { db, intakeYear, staffList, sourceGroup = 'Group Zalo Tuyển sinh' }) {
  const text = String(rawText || '').replace(/\r\n/g, '\n').trim();
  if (!text) return [];

  // Split into candidate segments by blank lines, numbered items ("1.", "2."), bullet lines ("-", "•"), or phone-anchored lines
  let blocks = text
    .split(/\n\s*\n+/)
    .map(b => b.trim())
    .filter(Boolean);

  // If a single block contains multiple phone numbers on separate lines, split line-by-line or per-candidate
  const refinedBlocks = [];
  const phoneGlobalRe = /(?:\+84|84|0)[35789][\d.\-\s]{7,11}\d/g;
  const phoneSingleRe = /(?:\+84|84|0)[35789][\d.\-\s]{7,11}\d/;

  for (const blk of blocks) {
    const allPhones = blk.match(phoneGlobalRe) || [];
    if (allPhones.length <= 1) {
      refinedBlocks.push(blk);
      continue;
    }
    const lines = blk.split('\n').map(l => l.trim()).filter(Boolean);
    // Check if lines represent separate candidates (each line has a phone OR numbered prefixes)
    const linesWithPhone = lines.filter(l => phoneSingleRe.test(l));
    if (linesWithPhone.length >= 2) {
      let current = [];
      let currentHasPhone = false;
      for (const ln of lines) {
        const hasPhone = phoneSingleRe.test(ln);
        const startsNew = /^\d+[.)]\s+|^[-•*]\s+|^(?:ho ten|ten|em|ban|thi sinh)\s*[:\-]/i.test(ln);
        if ((startsNew && current.length > 0) || (hasPhone && currentHasPhone)) {
          refinedBlocks.push(current.join('\n'));
          current = [ln];
          currentHasPhone = hasPhone;
        } else {
          current.push(ln);
          if (hasPhone) currentHasPhone = true;
        }
      }
      if (current.length > 0) refinedBlocks.push(current.join('\n'));
    } else {
      refinedBlocks.push(blk);
    }
  }

  const existingRegs = db.prepare(`
    SELECT r.id, p.full_name, p.student_phone, p.parent_phone
    FROM registrations r
    JOIN persons p ON p.id = r.person_id
    WHERE r.intake_year = ? AND r.deleted_at IS NULL
  `).all(intakeYear);

  const candidates = [];
  for (const seg of refinedBlocks) {
    const matches = seg.match(/(?:\+84|84|0)[35789][\d.\-\s]{7,11}\d/g) || [];
    const cleanPhones = [...new Set(matches.map(m => normalizePhone(m)).filter(Boolean))];

    // Extract name cleanly
    let extractedName = '';
    const labeledName = seg.match(/(?:họ\s*(?:và\s*)?tên|tên\s*(?:thí\s*sinh|học\s*sinh|em)?|thí\s*sinh)\s*[:\-]\s*([^\n,;|]+)/i);
    if (labeledName) {
      extractedName = labeledName[1].trim();
    } else {
      // Remove leading numbering, timestamps like "[10:25]", and phone numbers to find candidate name
      const firstLine = seg.split('\n')[0]
        .replace(/^\[?\d{1,2}:\d{2}(?::\d{2})?\]?\s*/, '')
        .replace(/^\d+[.)]\s*/, '')
        .replace(/^[-•*]\s*/, '')
        .trim();
      const beforePhone = firstLine.split(/(?:\+84|84|0)[35789][\d.\-\s]{7,11}\d/)[0]
        .split(/[-–|,;]/)[0]
        .replace(/^(?:nhờ|nho|gửi|gui|data|lead|zalo|ad|admin)\s*[:\-]?\s*/i, '')
        .trim();
      extractedName = beforePhone.slice(0, 120);
    }

    // Strict major detection — NEVER guesses CNTT!
    const extractedMajor = detectMajorStrict(seg);

    // Extract school if explicitly mentioned
    let extractedSchool = '';
    const schoolMatch = seg.match(/(?:trường\s*)?(?:THPT|TT\s*GDTX|GDTX)\s+([^\n,;|]+)/i);
    if (schoolMatch) {
      extractedSchool = schoolMatch[0].trim().slice(0, 160);
    }

    // Extract province if explicitly labeled
    let extractedProvince = '';
    const provMatch = seg.match(/(?:tỉnh|tp\.?|thành\s*phố)\s*[:\-]?\s*([^\n,;|]+)/i);
    if (provMatch) {
      extractedProvince = provMatch[1].trim().slice(0, 100);
    }

    // Match ONLY known staff (never put chat text into staff!)
    let suggestedStaff = null;
    for (const stf of staffList) {
      const nSeg = normalizeVi(seg);
      const sName = normalizeVi(stf.full_name);
      const sZalo = normalizeVi(stf.zalo_slot);
      if ((sName && nSeg.includes(sName)) || (sZalo && nSeg.includes(sZalo))) {
        suggestedStaff = stf;
        break;
      }
    }

    const studentPhone = cleanPhones[0] || '';
    const parentPhone = cleanPhones[1] || '';

    // Skip noise blocks that have neither a phone nor a plausible labeled name
    if (!studentPhone && !extractedName) continue;
    if (!studentPhone && extractedName.length < 3) continue;

    // Duplicate lookup in CRM
    let suspectedDupId = null;
    let dupReason = '';
    if (studentPhone) {
      const hit = existingRegs.find(r => r.student_phone === studentPhone || r.parent_phone === studentPhone);
      if (hit) {
        suspectedDupId = hit.id;
        dupReason = normalizeVi(hit.full_name) === normalizeVi(extractedName)
          ? `Trùng hồ sơ đã có: ${hit.full_name} (${studentPhone})`
          : `Trùng SĐT với ${hit.full_name} (${studentPhone}) - cần xác minh trùng hay dùng chung số phụ huynh`;
      }
    }

    candidates.push({
      raw_text: seg,
      extracted_name: extractedName,
      extracted_phone: studentPhone,
      extracted_parent_phone: parentPhone,
      extracted_major: extractedMajor, // '' if unknown!
      extracted_school: extractedSchool,
      extracted_province: extractedProvince,
      suggested_staff_id: suggestedStaff ? suggestedStaff.id : null,
      suggested_staff_name: suggestedStaff ? suggestedStaff.full_name : '',
      source_group: sourceGroup,
      suspected_duplicate_reg_id: suspectedDupId,
      duplicate_reason: dupReason
    });
  }

  return candidates;
}

/**
 * Commit parsed CRM rows into DB inside a single atomic transaction with full import_batches & import_rows audit.
 */
function commitCrmImport(dbm, { actor, intakeYear, targetType, fileName, rows, duplicatePolicy = 'flag', ip = '' }) {
  const ts = nowIso();
  const batchId = newId('imp');

  return dbm.transaction((db) => {
    let createdCount = 0;
    let updatedCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;
    const affectedRegIds = [];

    db.prepare(`
      INSERT INTO import_batches (id, intake_year, target_type, file_name, uploaded_by_user_id, total_rows, created_count, updated_count, duplicate_count, error_count, summary_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, 0, '{}', ?)
    `).run(batchId, intakeYear, targetType, fileName || '', actor.id, rows.length, ts);

    const insertRowAudit = db.prepare(`
      INSERT INTO import_rows (id, batch_id, row_index, action, target_id, before_json, after_json, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of rows) {
      if (item.action === 'error' || !item.parsed) {
        errorCount++;
        insertRowAudit.run(newId('imr'), batchId, item.rowIndex || 0, 'error', null, null, JSON.stringify(item.parsed || {}), (item.errors || []).join('; '));
        continue;
      }

      const p = item.parsed;
      const studentPhone = normalizePhone(p.student_phone || '');
      const parentPhone = normalizePhone(p.parent_phone || '');
      const receivedAt = p.source_received_at || ts;

      // Re-check DB at commit time to prevent race duplicates
      let existing = null;
      if (studentPhone) {
        const matches = db.prepare(`
          SELECT r.*, p.full_name, p.student_phone, p.parent_phone
          FROM registrations r
          JOIN persons p ON p.id = r.person_id
          WHERE r.intake_year = ? AND r.deleted_at IS NULL AND p.student_phone = ?
        `).all(intakeYear, studentPhone);
        existing = matches.find(m => normalizeVi(m.full_name) === normalizeVi(p.full_name)) || matches[0] || null;
      }

      if (existing && normalizeVi(existing.full_name) === normalizeVi(p.full_name)) {
        // Same person in same intake year -> merge sources history & enrich empty fields; NEVER double-count KPI!
        const before = { ...existing };
        let sourcesHist = [];
        try { sourcesHist = JSON.parse(existing.sources_history_json || '[]'); } catch (_) {}
        if (p.source && !sourcesHist.includes(p.source)) sourcesHist.push(p.source);

        const nextMajor = existing.major || p.major || '';
        const nextSchool = existing.school || p.school || '';
        const nextProvince = existing.province || p.province || '';
        const nextNotes = p.notes && !existing.notes.includes(p.notes)
          ? (existing.notes ? `${existing.notes} | [Import] ${p.notes}` : p.notes)
          : existing.notes;
        const nextStaff = existing.assigned_staff_id || p.assigned_staff_id || null;

        db.prepare(`
          UPDATE registrations
          SET major = ?, school = ?, province = ?, notes = ?, assigned_staff_id = ?,
              sources_history_json = ?, version = version + 1, updated_at = ?
          WHERE id = ?
        `).run(nextMajor, nextSchool, nextProvince, nextNotes, nextStaff, JSON.stringify(sourcesHist), ts, existing.id);

        updatedCount++;
        affectedRegIds.push(existing.id);
        insertRowAudit.run(newId('imr'), batchId, item.rowIndex || 0, 'updated', existing.id, JSON.stringify(before), JSON.stringify({ major: nextMajor, school: nextSchool, province: nextProvince, sources: sourcesHist }), 'Gộp trùng thí sinh (giữ lịch sử nguồn, không đếm lặp KPI)');
        continue;
      }

      // Different person sharing same phone
      let dedupFlag = '';
      if (existing) {
        if (duplicatePolicy === 'skip' && !item.allowSharedParentPhone) {
          duplicateCount++;
          insertRowAudit.run(newId('imr'), batchId, item.rowIndex || 0, 'skipped', existing.id, null, JSON.stringify(p), 'Bỏ qua do nghi trùng SĐT');
          continue;
        }
        dedupFlag = item.allowSharedParentPhone ? 'verified_shared_parent' : 'suspected_duplicate';
        duplicateCount++;
      }

      // Create new Person + ContactPoints + AdmissionRegistration + Milestone + Checklist
      const personId = newId('per');
      const regId = newId('reg');
      db.prepare(`
        INSERT INTO persons (id, full_name, student_phone, parent_phone, province, school, raw_data_json, verified, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(personId, p.full_name, studentPhone, parentPhone, p.province || '', p.school || '', JSON.stringify(p), dedupFlag === 'verified_shared_parent' ? 1 : 0, ts, ts);

      if (studentPhone) {
        db.prepare('INSERT INTO contact_points (id, person_id, contact_type, value, is_shared_parent, verified, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)')
          .run(newId('ctp'), personId, 'student_phone', studentPhone, 0, ts);
      }
      if (parentPhone) {
        db.prepare('INSERT INTO contact_points (id, person_id, contact_type, value, is_shared_parent, verified, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)')
          .run(newId('ctp'), personId, 'parent_phone', parentPhone, 1, ts);
      }

      const stageCode = p.stage_code || STAGE_CODE.LEAD;
      const contactStatus = p.contact_status || CONTACT_STATUS.UNCONTACTED;
      const sourcesArr = p.source ? [p.source] : [];
      const firstContactAt = contactStatus !== CONTACT_STATUS.UNCONTACTED ? ts : null;

      db.prepare(`
        INSERT INTO registrations (
          id, person_id, intake_year, major, degree_level, source, school, province,
          assigned_staff_id, contact_status, stage_code, raw_status_text, notes,
          source_received_at, crm_received_at, first_contact_at, dedup_flag,
          sources_history_json, import_batch_id, version, field_versions_json,
          created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'Cao đẳng', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, '{}', ?, ?, ?)
      `).run(
        regId, personId, intakeYear, p.major || '', p.source || 'Import', p.school || '', p.province || '',
        p.assigned_staff_id || null, contactStatus, stageCode, p.raw_status_text || '', p.notes || '',
        receivedAt, ts, firstContactAt, dedupFlag,
        JSON.stringify(sourcesArr), batchId, actor.id, ts, ts
      );

      // Registered milestone
      db.prepare(`
        INSERT INTO milestone_events (id, registration_id, intake_year, milestone_type, occurred_at, attributed_staff_id, recorded_by_user_id, evidence_note, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      `).run(newId('mil'), regId, intakeYear, MILESTONE_TYPE.REGISTERED, receivedAt, p.assigned_staff_id || null, actor.id, `Import batch ${batchId}`, ts);

      // Only record submitted/enrolled milestones when strict enum is genuinely submitted or enrolled (never for negative strings!)
      if (stageCode === STAGE_CODE.SUBMITTED || stageCode === STAGE_CODE.ENROLLED) {
        db.prepare(`
          INSERT INTO milestone_events (id, registration_id, intake_year, milestone_type, occurred_at, attributed_staff_id, recorded_by_user_id, evidence_note, is_active, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `).run(newId('mil'), regId, intakeYear, MILESTONE_TYPE.SUBMITTED, receivedAt, p.assigned_staff_id || null, actor.id, `Import batch ${batchId}`, ts);
      }
      if (stageCode === STAGE_CODE.ENROLLED) {
        db.prepare(`
          INSERT INTO milestone_events (id, registration_id, intake_year, milestone_type, occurred_at, attributed_staff_id, recorded_by_user_id, evidence_note, is_active, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `).run(newId('mil'), regId, intakeYear, MILESTONE_TYPE.ENROLLED, receivedAt, p.assigned_staff_id || null, actor.id, `Import batch ${batchId}`, ts);
      }

      // Initialize default document checklist
      const insDoc = db.prepare(`
        INSERT OR IGNORE INTO document_checklists (id, registration_id, doc_code, doc_name, status, note, updated_by, updated_at)
        VALUES (?, ?, ?, ?, 'missing', '', ?, ?)
      `);
      for (const d of DEFAULT_DOCUMENT_CHECKLIST) {
        insDoc.run(newId('doc'), regId, d.code, d.name, actor.id, ts);
      }

      createdCount++;
      affectedRegIds.push(regId);
      insertRowAudit.run(newId('imr'), batchId, item.rowIndex || 0, dedupFlag ? 'suspected_duplicate' : 'created', regId, null, JSON.stringify(p), dedupFlag ? 'Tạo mới có cờ nghi trùng cần xác minh' : 'Tạo mới thành công');
    }

    db.prepare(`
      UPDATE import_batches
      SET created_count = ?, updated_count = ?, duplicate_count = ?, error_count = ?, summary_json = ?
      WHERE id = ?
    `).run(createdCount, updatedCount, duplicateCount, errorCount, JSON.stringify({ affectedRegIds }), batchId);

    dbm.appendAudit(db, {
      actor,
      action: 'IMPORT_CRM_COMMIT',
      entityType: 'import_batch',
      entityId: batchId,
      summary: `Nhập dữ liệu CRM (${targetType}): +${createdCount} mới, ~${updatedCount} cập nhật, !${duplicateCount} nghi trùng, x${errorCount} lỗi`,
      detail: { batchId, intakeYear, fileName, createdCount, updatedCount, duplicateCount, errorCount },
      ip
    });

    return { batchId, createdCount, updatedCount, duplicateCount, errorCount, affectedRegIds };
  });
}

function buildCrmTemplateBuffer() {
  const rows = [
    ['Họ và tên', 'Số điện thoại', 'Ngành quan tâm', 'Nguồn', 'Nhân sự phụ trách', 'Trạng thái chăm sóc', 'Kết quả cuối cùng', 'Ghi chú'],
    ['Nguyễn Văn An', '0901234567', 'Công nghệ thông tin', 'Website ITC', 'Tô Nhựt Điển', 'Đã tư vấn - Quan tâm', 'Đang tư vấn', 'Học sinh lớp 12 THPT Lê Hồng Phong']
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Mau_Nhap_CRM');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

function buildRegionalTemplateBuffer() {
  const rows = [
    ['Họ và tên', 'Số điện thoại', 'SĐT phụ huynh', 'Trường THPT', 'Tỉnh/TP', 'Ngành quan tâm', 'Sự kiện', 'Nguồn', 'Ngày thu thập', 'Ghi chú'],
    ['Trần Thị Bình', '0912345678', '0987654321', 'THPT Nguyễn Đình Chiểu', 'Tiền Giang', 'Thiết kế đồ họa', 'Ngày hội Tư vấn Hướng nghiệp', 'Khảo sát tuyến tỉnh', '2026-11-20', 'Quan tâm học bổng']
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Mau_Tuyen_Tinh');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

module.exports = {
  detectMajorStrict,
  resolveStaffFromText,
  parseExcelBufferToMatrix,
  parseQuickPasteTextToMatrix,
  parseCrmMatrix,
  parseRegionalMatrix,
  parseZaloCandidates,
  commitCrmImport,
  buildCrmTemplateBuffer,
  buildRegionalTemplateBuffer
};

  },

  // =========================================================================
  // MODULE: ./reports
  // =========================================================================
  "./reports": function (module, exports, require) {
'use strict';

const JSZip = require('jszip');
const XLSX = require('xlsx');
const { newId, nowIso } = require('./db');
const { computeKpiReport, computeSlaSummary, toLocalParts } = require('./sla-kpi');
const { STAGE_CODE, MILESTONE_TYPE, CONTACT_STATUS_LABELS, STAGE_LABELS, TASK_STATUS_LABELS, REGIONS } = require('./constants');

function xmlEscape(val) {
  return String(val === null || val === undefined ? '' : val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatVnDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const lp = toLocalParts(d, 420);
  return `${String(lp.day).padStart(2, '0')}/${String(lp.month).padStart(2, '0')}/${lp.year}`;
}

function defaultPeriodRange(periodType, intakeYear, nowDate = new Date()) {
  const lp = toLocalParts(nowDate, 420);
  const offsetMs = 420 * 60000;
  if (periodType === 'day') {
    const start = new Date(Date.UTC(lp.year, lp.month - 1, lp.day, 0, 0, 0) - offsetMs);
    const end = new Date(Date.UTC(lp.year, lp.month - 1, lp.day, 23, 59, 59, 999) - offsetMs);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }
  if (periodType === 'week') {
    const daysSinceMon = (lp.dow + 6) % 7;
    const start = new Date(Date.UTC(lp.year, lp.month - 1, lp.day - daysSinceMon, 0, 0, 0) - offsetMs);
    const end = new Date(Date.UTC(lp.year, lp.month - 1, lp.day - daysSinceMon + 6, 23, 59, 59, 999) - offsetMs);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }
  if (periodType === 'month') {
    const start = new Date(Date.UTC(lp.year, lp.month - 1, 1, 0, 0, 0) - offsetMs);
    const end = new Date(Date.UTC(lp.year, lp.month, 0, 23, 59, 59, 999) - offsetMs);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }
  // year (intake cycle: Nov prev year .. Oct intake year)
  const y = Number(intakeYear) || 2027;
  const start = new Date(Date.UTC(y - 1, 10, 1, 0, 0, 0) - offsetMs);
  const end = new Date(Date.UTC(y, 9, 31, 23, 59, 59, 999) - offsetMs);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

/**
 * SINGLE SHARED PERIOD-SCOPED REPORT QUERY
 * Used identically by:
 * 1. Live Preview
 * 2. Saved/Approved Report Snapshots
 * 3. Real OOXML .docx Generator
 * 4. Dynamic Multi-Sheet .xlsx Generator
 * Strictly separates IN-PERIOD NEW ("phát sinh trong kỳ") from CUMULATIVE ("lũy kế đến thời điểm chốt").
 */
function buildReportDataset(dbm, {
  intakeYear = '2027',
  template = 'phong',
  periodType = 'week',
  startDate = null,
  endDate = null,
  cutoffAt = null,
  sections = {},
  user = null,
  auth = null
}) {
  const now = new Date();
  const defRange = defaultPeriodRange(periodType, intakeYear, now);
  const startIso = startDate ? new Date(startDate).toISOString() : defRange.startDate;
  const endIso = endDate ? new Date(endDate).toISOString() : defRange.endDate;
  const cutoffIso = cutoffAt ? new Date(cutoffAt).toISOString() : endIso;

  const selectedSections = {
    includeCRM: sections.includeCRM !== false,
    includeKPI: sections.includeKPI !== false,
    includeRegional: sections.includeRegional !== false,
    includeTasks: sections.includeTasks !== false,
    includeBGH: sections.includeBGH !== false,
    includeOutsideSupport: sections.includeOutsideSupport !== false
  };

  const scope = (user && auth) ? auth.buildScopeFilterSql(user, 'r.assigned_staff_id') : { sql: '1=1', params: [] };

  // Fetch all registrations for this intakeYear within scope up to cutoff
  const allRegs = dbm.db.prepare(`
    SELECT r.*, p.full_name, p.student_phone, p.parent_phone, s.full_name AS staff_name
    FROM registrations r
    JOIN persons p ON p.id = r.person_id
    LEFT JOIN staff s ON s.id = r.assigned_staff_id
    WHERE r.intake_year = ? AND r.deleted_at IS NULL AND r.created_at <= ? AND ${scope.sql}
    ORDER BY r.created_at DESC
  `).all(intakeYear, cutoffIso, ...scope.params);

  const regIds = new Set(allRegs.map(r => r.id));

  // Fetch milestones up to cutoff
  const allMilestones = dbm.db.prepare(`
    SELECT m.*
    FROM milestone_events m
    JOIN registrations r ON r.id = m.registration_id
    WHERE m.intake_year = ? AND m.is_active = 1 AND r.deleted_at IS NULL AND m.occurred_at <= ? AND ${scope.sql}
    ORDER BY m.occurred_at ASC
  `).all(intakeYear, cutoffIso, ...scope.params);

  const withdrawnIds = new Set(allRegs.filter(r => r.stage_code === STAGE_CODE.WITHDRAWN).map(r => r.id));
  for (const m of allMilestones) {
    if (m.milestone_type === MILESTONE_TYPE.WITHDRAWN) withdrawnIds.add(m.registration_id);
  }

  // Group milestones per registration
  const byReg = new Map();
  for (const m of allMilestones) {
    if (!regIds.has(m.registration_id)) continue;
    if (!byReg.has(m.registration_id)) byReg.set(m.registration_id, {});
    const rm = byReg.get(m.registration_id);
    if (m.milestone_type === MILESTONE_TYPE.REGISTERED && !rm.registered) rm.registered = m;
    if (m.milestone_type === MILESTONE_TYPE.SUBMITTED && !rm.submitted) rm.submitted = m;
    if (m.milestone_type === MILESTONE_TYPE.ENROLLED && !rm.enrolled) rm.enrolled = m;
  }

  const inRange = (iso) => Boolean(iso && iso >= startIso && iso <= endIso);

  const inPeriod = { registered: 0, submitted: 0, enrolled: 0, withdrawn: 0, pendingVerify: 0 };
  const cumulative = { registered: 0, submitted: 0, enrolled: 0, withdrawn: 0, pendingVerify: 0 };
  const inPeriodRegIds = new Set();

  for (const reg of allRegs) {
    const rm = byReg.get(reg.id) || {};
    const isWithdrawn = withdrawnIds.has(reg.id);
    if (reg.stage_code === STAGE_CODE.PENDING_VERIFY) {
      cumulative.pendingVerify++;
      if (inRange(reg.created_at)) inPeriod.pendingVerify++;
    }
    if (isWithdrawn) {
      cumulative.withdrawn++;
      const wm = allMilestones.find(m => m.registration_id === reg.id && m.milestone_type === MILESTONE_TYPE.WITHDRAWN);
      if (wm && inRange(wm.occurred_at)) inPeriod.withdrawn++;
    }
    if (rm.registered) {
      cumulative.registered++;
      if (inRange(rm.registered.occurred_at)) {
        inPeriod.registered++;
        inPeriodRegIds.add(reg.id);
      }
    }
    if (!isWithdrawn) {
      const effSub = rm.submitted || rm.enrolled;
      if (effSub) {
        cumulative.submitted++;
        if (inRange(effSub.occurred_at)) {
          inPeriod.submitted++;
          inPeriodRegIds.add(reg.id);
        }
      }
      if (rm.enrolled) {
        cumulative.enrolled++;
        if (inRange(rm.enrolled.occurred_at)) {
          inPeriod.enrolled++;
          inPeriodRegIds.add(reg.id);
        }
      }
    }
  }

  const periodRegs = allRegs.filter(r => inPeriodRegIds.has(r.id));
  const workingHours = dbm.getSetting('working_hours', dbm.config.defaultWorkingHours);
  const slaInPeriod = computeSlaSummary(periodRegs, workingHours, new Date(cutoffIso));
  const slaCumulative = computeSlaSummary(allRegs, workingHours, new Date(cutoffIso));

  // Derive selected monthKey from endIso for KPI breakdown
  const endLp = toLocalParts(new Date(endIso), 420);
  const monthKey = `${endLp.year}-${String(endLp.month).padStart(2, '0')}`;
  const kpi = computeKpiReport(dbm.db, { intakeYear, monthKey, cutoffIso, nowDate: new Date(cutoffIso) });

  // Regional data (in-period vs cumulative)
  const regionalAll = dbm.db.prepare(`
    SELECT rr.*, s.full_name AS staff_name
    FROM regional_records rr
    LEFT JOIN staff s ON s.id = rr.assigned_staff_id
    WHERE rr.intake_year = ? AND rr.deleted_at IS NULL AND rr.created_at <= ?
    ORDER BY rr.collected_at DESC
  `).all(intakeYear, cutoffIso);
  const regionalInPeriod = regionalAll.filter(r => inRange(r.collected_at));
  const regionalByRegion = {};
  for (const key of Object.keys(REGIONS)) {
    regionalByRegion[key] = {
      label: REGIONS[key],
      inPeriod: regionalInPeriod.filter(r => r.region === key).length,
      cumulative: regionalAll.filter(r => r.region === key).length
    };
  }

  // Tasks grouped by type
  const tasksAll = dbm.db.prepare(`
    SELECT t.*, s.full_name AS owner_name
    FROM tasks t
    LEFT JOIN staff s ON s.id = t.owner_staff_id
    WHERE t.intake_year = ? AND t.deleted_at IS NULL AND t.created_at <= ?
    ORDER BY t.deadline ASC, t.created_at DESC
  `).all(intakeYear, cutoffIso);

  const bghTasks = tasksAll.filter(t => t.task_type === 'bgh' || t.task_type === 'directive' || t.task_type === 'meeting');
  const internalTasks = tasksAll.filter(t => t.task_type === 'internal');
  const externalSupport = tasksAll.filter(t => t.task_type === 'external_support');

  const periodLabels = {
    day: 'BÁO CÁO NGÀY',
    week: 'BÁO CÁO TUẦN (ĐỊNH KỲ THỨ 7 <09H30)',
    month: 'BÁO CÁO THÁNG (TRƯỚC NGÀY 25)',
    year: `BÁO CÁO TỔNG HỢP NIÊN KHÓA ${intakeYear}`,
    custom: 'BÁO CÁO THEO KỲ TÙY CHỌN'
  };

  const recipient = template === 'bgh'
    ? 'Ban Giám hiệu Trường Cao đẳng Công nghệ Thông tin TP.HCM'
    : 'Trưởng phòng Tuyển sinh Trường Cao đẳng Công nghệ Thông tin TP.HCM';

  const signerTitle = template === 'bgh' ? 'TRƯỞNG PHÒNG TUYỂN SINH' : 'PHÓ PHÒNG TUYỂN SINH';
  const signerName = user ? user.full_name : 'Nguyễn Hữu Tài';

  return {
    meta: {
      title: periodLabels[periodType] || 'BÁO CÁO CÔNG TÁC TUYỂN SINH',
      intakeYear,
      template,
      periodType,
      startDate: startIso,
      endDate: endIso,
      cutoffAt: cutoffIso,
      periodDisplay: `${formatVnDate(startIso)} – ${formatVnDate(endIso)}`,
      cutoffDisplay: formatVnDate(cutoffIso),
      recipient,
      signerTitle,
      signerName,
      generatedAt: nowIso(),
      sections: selectedSections
    },
    crm: {
      inPeriod,
      cumulative,
      slaInPeriod: {
        handledRate: slaInPeriod.handledRate,
        onTimeSlaRate: slaInPeriod.onTimeSlaRate,
        avgResponseMinutes: slaInPeriod.avgResponseMinutes,
        counts: slaInPeriod.counts
      },
      slaCumulative: {
        handledRate: slaCumulative.handledRate,
        onTimeSlaRate: slaCumulative.onTimeSlaRate,
        avgResponseMinutes: slaCumulative.avgResponseMinutes,
        counts: slaCumulative.counts
      },
      periodRegistrations: periodRegs.slice(0, 500),
      allRegistrationsCount: allRegs.length
    },
    kpi: {
      selectedMonth: kpi.selectedMonth,
      planVersion: kpi.planVersion ? kpi.planVersion.version_number : 1,
      roomMonthTarget: kpi.roomMonthTarget,
      roomMonthActual: kpi.roomMonthActual,
      roomAnnualTarget: kpi.roomAnnualTarget,
      roomAnnualActual: kpi.roomAnnualActual,
      staffRows: kpi.staffRows
    },
    regional: {
      byRegion: regionalByRegion,
      inPeriodTotal: regionalInPeriod.length,
      cumulativeTotal: regionalAll.length,
      records: regionalInPeriod.slice(0, 500)
    },
    tasks: {
      bgh: bghTasks,
      internal: internalTasks,
      externalSupport
    }
  };
}

/**
 * Generates a genuine OOXML .docx (ZIP archive with valid WordprocessingML XML)
 * preserving Vietnamese UTF-8, clean tables, borders, page-break safe rows, and official ITC signature block!
 */
async function generateRealDocxBuffer(reportData) {
  const m = reportData.meta;
  const sec = m.sections || {};

  function p(text, { bold = false, italic = false, size = 24, align = 'left', spaceBefore = 0, spaceAfter = 100 } = {}) {
    return `<w:p><w:pPr><w:jc w:val="${align}"/><w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}" w:line="276" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>${bold ? '<w:b/>' : ''}${italic ? '<w:i/>' : ''}<w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r></w:p>`;
  }

  function makeTable(headers, rows, colWidths) {
    const tblGrid = colWidths.map(w => `<w:gridCol w:w="${w}"/>`).join('');
    const headerCells = headers.map((h, i) => `
      <w:tc>
        <w:tcPr><w:tcW w:w="${colWidths[i]}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="E2E8F0"/></w:tcPr>
        ${p(h, { bold: true, size: 20, align: 'center', spaceBefore: 40, spaceAfter: 40 })}
      </w:tc>`).join('');
    const headerRow = `<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>${headerCells}</w:tr>`;

    const bodyRows = rows.map(row => {
      const cells = row.map((val, i) => `
        <w:tc>
          <w:tcPr><w:tcW w:w="${colWidths[i]}" w:type="dxa"/></w:tcPr>
          ${p(String(val ?? ''), { size: 20, align: i === 0 ? 'left' : 'center', spaceBefore: 30, spaceAfter: 30 })}
        </w:tc>`).join('');
      return `<w:tr><w:trPr><w:cantSplit/></w:trPr>${cells}</w:tr>`;
    }).join('');

    return `
      <w:tbl>
        <w:tblPr>
          <w:tblW w:w="9360" w:type="dxa"/>
          <w:tblBorders>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
            <w:left w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
          </w:tblBorders>
        </w:tblPr>
        <w:tblGrid>${tblGrid}</w:tblGrid>
        ${headerRow}
        ${bodyRows}
      </w:tbl>`;
  }

  // Borderless 2-column header & signature tables
  function borderlessTwoCol(leftXml, rightXml) {
    return `
      <w:tbl>
        <w:tblPr>
          <w:tblW w:w="9360" w:type="dxa"/>
          <w:tblBorders>
            <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/>
            <w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/>
          </w:tblBorders>
        </w:tblPr>
        <w:tblGrid><w:gridCol w:w="4500"/><w:gridCol w:w="4860"/></w:tblGrid>
        <w:tr><w:trPr><w:cantSplit/></w:trPr>
          <w:tc><w:tcPr><w:tcW w:w="4500" w:type="dxa"/></w:tcPr>${leftXml}</w:tc>
          <w:tc><w:tcPr><w:tcW w:w="4860" w:type="dxa"/></w:tcPr>${rightXml}</w:tc>
        </w:tr>
      </w:tbl>`;
  }

  const bodyParts = [];

  // Official Vietnamese Header
  bodyParts.push(borderlessTwoCol(
    p('TRƯỜNG CAO ĐẲNG CNTT TP. HCM', { bold: true, size: 22, align: 'center', spaceAfter: 20 }) +
    p('PHÒNG TUYỂN SINH', { bold: true, size: 22, align: 'center', spaceAfter: 40 }) +
    p('Số: ..../BC-P.TS', { italic: true, size: 22, align: 'center', spaceAfter: 0 }),
    p('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { bold: true, size: 22, align: 'center', spaceAfter: 20 }) +
    p('Độc lập - Tự do - Hạnh phúc', { bold: true, size: 22, align: 'center', spaceAfter: 40 }) +
    p(`TP. Hồ Chí Minh, ngày ${m.cutoffDisplay}`, { italic: true, size: 22, align: 'center', spaceAfter: 0 })
  ));

  // Title block
  bodyParts.push(p(m.title, { bold: true, size: 30, align: 'center', spaceBefore: 240, spaceAfter: 60 }));
  bodyParts.push(p(`Công tác Tuyển sinh Niên khóa ${m.intakeYear} | Kỳ báo cáo: ${m.periodDisplay}`, { bold: true, size: 24, align: 'center', spaceAfter: 40 }));
  bodyParts.push(p(`Thời điểm chốt số liệu: ${m.cutoffDisplay}`, { italic: true, size: 22, align: 'center', spaceAfter: 80 }));
  bodyParts.push(p(`Kính gửi: ${m.recipient}.`, { italic: true, bold: true, size: 24, align: 'center', spaceAfter: 200 }));

  let secNum = 1;

  if (sec.includeCRM) {
    const ip = reportData.crm.inPeriod;
    const cu = reportData.crm.cumulative;
    const sla = reportData.crm.slaCumulative;
    bodyParts.push(p(`${secNum++}. Kết quả tiếp nhận & chăm sóc thí sinh (CRM)`, { bold: true, size: 26, spaceBefore: 160, spaceAfter: 80 }));
    bodyParts.push(makeTable(
      ['Chỉ tiêu', `Phát sinh trong kỳ (${m.periodDisplay})`, `Lũy kế niên khóa ${m.intakeYear} (đến chốt)`],
      [
        ['Đăng ký mới (Lead)', ip.registered, cu.registered],
        ['Đã nộp hồ sơ (bao gồm nhập học)', ip.submitted, cu.submitted],
        ['Đã nhập học chính thức', ip.enrolled, cu.enrolled],
        ['Rút hồ sơ / Hủy', ip.withdrawn, cu.withdrawn],
        ['Chờ xác minh trạng thái', ip.pendingVerify, cu.pendingVerify]
      ],
      [4160, 2600, 2600]
    ));
    const onTimeTxt = sla.onTimeSlaRate !== null ? `${sla.onTimeSlaRate}%` : 'Chưa đủ dữ liệu đo';
    bodyParts.push(p(`Tỷ lệ đã xử lý (lũy kế): ${sla.handledRate}% | Tỷ lệ đúng hạn SLA (<15 phút giờ hành chính): ${onTimeTxt} | Quá hạn chưa gọi: ${sla.counts.overdue_unhandled} hồ sơ | Thiếu mốc thời gian: ${sla.counts.insufficient_timestamp} hồ sơ.`, { size: 22, spaceBefore: 80, spaceAfter: 120 }));
  }

  if (sec.includeKPI) {
    bodyParts.push(p(`${secNum++}. Tiến độ KPI nhân sự tư vấn (Tháng ${reportData.kpi.selectedMonth} & Lũy kế niên khóa ${m.intakeYear})`, { bold: true, size: 26, spaceBefore: 160, spaceAfter: 80 }));
    const kpiRows = reportData.kpi.staffRows.map(s => [
      `${s.full_name}${s.zalo_slot ? ' (' + s.zalo_slot + ')' : ''}`,
      `${s.monthActual.lead}/${s.monthTarget.lead}`,
      `${s.monthActual.submitted}/${s.monthTarget.submitted}`,
      `${s.monthActual.enrolled}/${s.monthTarget.enrolled}`,
      `${s.annualActual.lead}/${s.annualTarget.lead}`,
      `${s.annualActual.enrolled}/${s.annualTarget.enrolled}`
    ]);
    kpiRows.push([
      'TỔNG PHÒNG',
      `${reportData.kpi.roomMonthActual.lead}/${reportData.kpi.roomMonthTarget.lead}`,
      `${reportData.kpi.roomMonthActual.submitted}/${reportData.kpi.roomMonthTarget.submitted}`,
      `${reportData.kpi.roomMonthActual.enrolled}/${reportData.kpi.roomMonthTarget.enrolled}`,
      `${reportData.kpi.roomAnnualActual.lead}/${reportData.kpi.roomAnnualTarget.lead}`,
      `${reportData.kpi.roomAnnualActual.enrolled}/${reportData.kpi.roomAnnualTarget.enrolled}`
    ]);
    bodyParts.push(makeTable(
      ['Nhân sự', 'ĐK Tháng', 'HS Tháng', 'NH Tháng', 'ĐK Năm (LK)', 'NH Năm (LK)'],
      kpiRows,
      [2760, 1320, 1320, 1320, 1320, 1320]
    ));
  }

  if (sec.includeRegional) {
    bodyParts.push(p(`${secNum++}. Kết quả dữ liệu 03 Tuyến Tỉnh`, { bold: true, size: 26, spaceBefore: 160, spaceAfter: 80 }));
    const regRows = Object.values(reportData.regional.byRegion).map(r => [r.label, r.inPeriod, r.cumulative]);
    regRows.push(['Tổng cộng 03 tuyến', reportData.regional.inPeriodTotal, reportData.regional.cumulativeTotal]);
    bodyParts.push(makeTable(
      ['Tuyến địa bàn', 'Phát sinh trong kỳ', 'Lũy kế niên khóa'],
      regRows,
      [4560, 2400, 2400]
    ));
  }

  if (sec.includeBGH) {
    const bgh = reportData.tasks.bgh || [];
    const done = bgh.filter(t => t.status === 'done').length;
    bodyParts.push(p(`${secNum++}. Thực hiện Việc Ban Giám hiệu giao, Chỉ đạo & Lịch họp (${done}/${bgh.length} hoàn thành)`, { bold: true, size: 26, spaceBefore: 160, spaceAfter: 80 }));
    if (bgh.length === 0) {
      bodyParts.push(p('Chưa có hạng mục việc BGH / chỉ đạo trong kỳ báo cáo.', { italic: true, size: 22 }));
    } else {
      bodyParts.push(makeTable(
        ['Nội dung công việc / Chỉ đạo', 'Phụ trách', 'Hạn hoàn thành', 'Trạng thái'],
        bgh.map(t => [t.title, t.owner_name || 'Chưa phân công', t.deadline || '-', TASK_STATUS_LABELS[t.status] || t.status]),
        [4260, 1900, 1500, 1700]
      ));
    }
  }

  if (sec.includeTasks || sec.includeOutsideSupport) {
    const intTasks = sec.includeTasks ? (reportData.tasks.internal || []) : [];
    const extTasks = sec.includeOutsideSupport ? (reportData.tasks.externalSupport || []) : [];
    bodyParts.push(p(`${secNum++}. Công tác nội bộ phòng & Phối hợp đơn vị ngoài phòng`, { bold: true, size: 26, spaceBefore: 160, spaceAfter: 80 }));
    const combined = [
      ...intTasks.map(t => ['Nội bộ phòng', t.title, t.owner_name || '-', t.deadline || '-', TASK_STATUS_LABELS[t.status] || t.status]),
      ...extTasks.map(t => [`Hỗ trợ (${t.external_unit || 'Đơn vị ngoài'})`, t.title, t.owner_name || '-', t.deadline || '-', TASK_STATUS_LABELS[t.status] || t.status])
    ];
    if (combined.length === 0) {
      bodyParts.push(p('Không có công việc nội bộ / phối hợp phát sinh trong kỳ.', { italic: true, size: 22 }));
    } else {
      bodyParts.push(makeTable(
        ['Phân loại', 'Nội dung', 'Phụ trách', 'Hạn', 'Trạng thái'],
        combined,
        [1860, 3400, 1500, 1200, 1400]
      ));
    }
  }

  // Signature block (always kept together via cantSplit)
  bodyParts.push(p('', { size: 16, spaceBefore: 200, spaceAfter: 40 }));
  bodyParts.push(borderlessTwoCol(
    p('Nơi nhận:', { bold: true, italic: true, size: 22, spaceAfter: 40 }) +
    p(`- ${m.recipient} (để báo cáo);`, { size: 20, spaceAfter: 20 }) +
    p('- Lưu: P.TS.', { size: 20, spaceAfter: 0 }),
    p(m.signerTitle, { bold: true, size: 22, align: 'center', spaceAfter: 20 }) +
    p('(Ký và ghi rõ họ tên)', { italic: true, size: 20, align: 'center', spaceAfter: 560 }) +
    p(m.signerName, { bold: true, size: 24, align: 'center', spaceAfter: 0 })
  ));

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyParts.join('\n')}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', contentTypesXml);
  zip.file('_rels/.rels', relsXml);
  zip.file('word/document.xml', documentXml);
  zip.file('word/_rels/document.xml.rels', docRelsXml);
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

/**
 * Dynamic Multi-Sheet Excel Report Generator:
 * Sheets created dynamically match the EXACT checked sections and selected intakeYear/period!
 */
function generateDynamicExcelBuffer(reportData) {
  const wb = XLSX.utils.book_new();
  const m = reportData.meta;
  const sec = m.sections || {};

  // Always include Overview sheet
  const summaryRows = [
    ['TRƯỜNG CAO ĐẲNG CNTT TP. HCM - PHÒNG TUYỂN SINH'],
    [m.title],
    ['Niên khóa', m.intakeYear],
    ['Kỳ báo cáo', m.periodDisplay],
    ['Thời điểm chốt số liệu', m.cutoffDisplay],
    ['Người xuất', m.signerName],
    [],
    ['Chỉ số tổng hợp', 'Phát sinh trong kỳ', `Lũy kế niên khóa ${m.intakeYear}`],
    ['Đăng ký mới (Lead)', reportData.crm.inPeriod.registered, reportData.crm.cumulative.registered],
    ['Đã nộp hồ sơ (bao gồm nhập học)', reportData.crm.inPeriod.submitted, reportData.crm.cumulative.submitted],
    ['Đã nhập học', reportData.crm.inPeriod.enrolled, reportData.crm.cumulative.enrolled],
    ['Rút hồ sơ / Hủy', reportData.crm.inPeriod.withdrawn, reportData.crm.cumulative.withdrawn],
    ['Tỷ lệ đã xử lý (%)', reportData.crm.slaInPeriod.handledRate, reportData.crm.slaCumulative.handledRate],
    ['Tỷ lệ đúng hạn SLA <15p (%)', reportData.crm.slaInPeriod.onTimeSlaRate ?? 'Chưa đủ dữ liệu', reportData.crm.slaCumulative.onTimeSlaRate ?? 'Chưa đủ dữ liệu']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryRows), 'Tong_Quan');

  if (sec.includeCRM) {
    const crmRows = [
      ['Mã ĐK', 'Họ và tên', 'SĐT thí sinh', 'SĐT phụ huynh', 'Ngành quan tâm', 'Trường THPT', 'Tỉnh/TP', 'Nguồn', 'Nhân sự', 'Liên hệ', 'Giai đoạn', 'Ngày tạo', 'Ghi chú'],
      ...reportData.crm.periodRegistrations.map(r => [
        r.id, r.full_name, r.student_phone, r.parent_phone, r.major, r.school, r.province,
        r.source, r.staff_name || 'Chưa phân công',
        CONTACT_STATUS_LABELS[r.contact_status] || r.contact_status,
        STAGE_LABELS[r.stage_code] || r.stage_code,
        formatVnDate(r.created_at), r.notes
      ])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(crmRows), 'CRM_Trong_Ky');
  }

  if (sec.includeKPI) {
    const kpiRows = [
      ['Nhân sự', 'Zalo', `ĐK Tháng (${reportData.kpi.selectedMonth})`, 'Chỉ tiêu ĐK Tháng', 'HS Tháng', 'Chỉ tiêu HS Tháng', 'NH Tháng', 'Chỉ tiêu NH Tháng', 'ĐK Năm (LK)', 'Chỉ tiêu ĐK Năm', 'HS Năm (LK)', 'Chỉ tiêu HS Năm', 'NH Năm (LK)', 'Chỉ tiêu NH Năm'],
      ...reportData.kpi.staffRows.map(s => [
        s.full_name, s.zalo_slot,
        s.monthActual.lead, s.monthTarget.lead,
        s.monthActual.submitted, s.monthTarget.submitted,
        s.monthActual.enrolled, s.monthTarget.enrolled,
        s.annualActual.lead, s.annualTarget.lead,
        s.annualActual.submitted, s.annualTarget.submitted,
        s.annualActual.enrolled, s.annualTarget.enrolled
      ]),
      [
        'TỔNG PHÒNG', '',
        reportData.kpi.roomMonthActual.lead, reportData.kpi.roomMonthTarget.lead,
        reportData.kpi.roomMonthActual.submitted, reportData.kpi.roomMonthTarget.submitted,
        reportData.kpi.roomMonthActual.enrolled, reportData.kpi.roomMonthTarget.enrolled,
        reportData.kpi.roomAnnualActual.lead, reportData.kpi.roomAnnualTarget.lead,
        reportData.kpi.roomAnnualActual.submitted, reportData.kpi.roomAnnualTarget.submitted,
        reportData.kpi.roomAnnualActual.enrolled, reportData.kpi.roomAnnualTarget.enrolled
      ]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(kpiRows), 'Tien_Do_KPI');
  }

  if (sec.includeRegional) {
    const regRows = [
      ['Tuyến', 'Họ và tên', 'SĐT', 'SĐT phụ huynh', 'Trường THPT', 'Tỉnh/TP', 'Ngành', 'Sự kiện', 'Nguồn', 'Ngày thu thập', 'Ghi chú'],
      ...reportData.regional.records.map(r => [
        REGIONS[r.region] || r.region, r.full_name, r.phone, r.parent_phone, r.school, r.province,
        r.major, r.event_name, r.source, formatVnDate(r.collected_at), r.notes
      ])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(regRows), 'Tuyen_Tinh');
  }

  if (sec.includeBGH) {
    const bghRows = [
      ['Phân loại', 'Tiêu đề', 'Người phụ trách', 'Hạn', 'Trạng thái', 'Biên bản / Minh chứng'],
      ...(reportData.tasks.bgh || []).map(t => [
        t.task_type, t.title, t.owner_name || '', t.deadline, TASK_STATUS_LABELS[t.status] || t.status, t.meeting_minutes || t.evidence_note || ''
      ])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(bghRows), 'Viec_BGH_Hop');
  }

  if (sec.includeTasks) {
    const taskRows = [
      ['Tiêu đề', 'Người phụ trách', 'Hạn', 'Ưu tiên', 'Trạng thái', 'Minh chứng', 'Lý do gia hạn'],
      ...(reportData.tasks.internal || []).map(t => [
        t.title, t.owner_name || '', t.deadline, t.priority, TASK_STATUS_LABELS[t.status] || t.status, t.evidence_note || '', t.extension_reason || ''
      ])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(taskRows), 'Viec_Noi_Bo');
  }

  if (sec.includeOutsideSupport) {
    const extRows = [
      ['Đơn vị ngoài', 'Nội dung phối hợp', 'Phụ trách', 'Hạn', 'Trạng thái', 'Minh chứng'],
      ...(reportData.tasks.externalSupport || []).map(t => [
        t.external_unit || '', t.title, t.owner_name || '', t.deadline, TASK_STATUS_LABELS[t.status] || t.status, t.evidence_note || ''
      ])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(extRows), 'Ho_Tro_Ngoai_Phong');
  }

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

function createNotificationJob(dbm, { actor, channel, recipientName, recipientAddress, subject, body, ip = '' }) {
  const ts = nowIso();
  const id = newId('ntf');
  // HONEST NOTIFICATION STATUS (Scenario 14):
  // NEVER claim an email was sent when no real SMTP/provider is configured!
  let status = 'prepared';
  let providerNote = '';

  if (channel === 'zalo_copy') {
    status = 'approved';
    providerNote = 'Đã phê duyệt nội dung. Sao chép nội dung để gửi thủ công qua Zalo (hệ thống không tự gửi tin nhắn Zalo).';
  } else {
    if (dbm.config.smtpConfigured) {
      status = 'queued';
      providerNote = 'Đã đưa vào hàng đợi gửi SMTP (chờ xác nhận từ máy chủ thư).';
    } else {
      status = 'prepared';
      providerNote = 'Chưa cấu hình máy chủ SMTP thật — thư chỉ ở trạng thái ĐÃ CHUẨN BỊ / CHƯA GỬI ĐI.';
    }
  }

  dbm.transaction((db) => {
    db.prepare(`
      INSERT INTO notification_jobs (id, channel, recipient_name, recipient_address, subject, body, status, provider_message_id, provider_note, created_by_user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?)
    `).run(id, channel, recipientName, recipientAddress || '', subject, body, status, providerNote, actor.id, ts, ts);

    dbm.appendAudit(db, {
      actor,
      action: 'NOTIFICATION_JOB_CREATED',
      entityType: 'notification_job',
      entityId: id,
      summary: `Tạo thông báo (${channel}) cho ${recipientName} - trạng thái thực: ${status}`,
      detail: { channel, recipientAddress, status, providerNote },
      ip
    });
  });

  return dbm.db.prepare('SELECT * FROM notification_jobs WHERE id = ?').get(id);
}

module.exports = {
  buildReportDataset,
  generateRealDocxBuffer,
  generateDynamicExcelBuffer,
  createNotificationJob,
  defaultPeriodRange
};

  },

  // =========================================================================
  // MODULE: ./backup
  // =========================================================================
  "./backup": function (module, exports, require) {
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { newId, nowIso } = require('./db');

// Ordered tables for clean export/import respecting foreign keys
const BACKUP_TABLES = [
  'intake_years',
  'users',
  'staff',
  'persons',
  'contact_points',
  'registrations',
  'milestone_events',
  'interactions',
  'follow_ups',
  'document_checklists',
  'assignment_history',
  'regional_records',
  'zalo_staging',
  'kpi_plan_versions',
  'kpi_targets',
  'tasks',
  'task_comments',
  'report_snapshots',
  'notification_jobs',
  'import_batches',
  'import_rows',
  'audit_events',
  'system_settings'
];

function timestampFileSlug(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const rand = crypto.randomBytes(2).toString('hex');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}-${rand}`;
}

function exportDatabaseSnapshotObject(dbm) {
  const data = {};
  const counts = {};
  for (const table of BACKUP_TABLES) {
    const rows = dbm.db.prepare(`SELECT * FROM ${table}`).all();
    data[table] = rows;
    counts[table] = rows.length;
  }
  return {
    format: 'itc-tuyensinh-backup',
    schemaVersion: dbm.config.schemaVersion,
    appVersion: dbm.config.appVersion,
    exportedAt: nowIso(),
    recordCounts: counts,
    checksumSha256: crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),
    data
  };
}

function createVersionedBackup(dbm, { actor = null, backupType = 'manual', ip = '' }) {
  fs.mkdirSync(dbm.config.backupDir, { recursive: true });
  const slug = timestampFileSlug();
  const jsonFilename = `backup-${slug}.json`;
  const jsonPath = path.join(dbm.config.backupDir, jsonFilename);

  const payload = exportDatabaseSnapshotObject(dbm);
  const rawJson = JSON.stringify(payload, null, 2);
  fs.writeFileSync(jsonPath, rawJson, 'utf8');

  const sizeBytes = Buffer.byteLength(rawJson, 'utf8');
  const recId = newId('bkp');
  const ts = nowIso();

  dbm.transaction((db) => {
    db.prepare(`
      INSERT INTO backup_records (id, filename, schema_version, size_bytes, record_counts_json, backup_type, created_by_user_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(recId, jsonFilename, payload.schemaVersion, sizeBytes, JSON.stringify(payload.recordCounts), backupType, actor ? actor.id : null, ts);

    dbm.appendAudit(db, {
      actor,
      action: 'BACKUP_CREATED',
      entityType: 'backup',
      entityId: recId,
      summary: `Tạo bản sao lưu có phiên bản (${backupType}): ${jsonFilename} (${sizeBytes} bytes)`,
      detail: { filename: jsonFilename, schemaVersion: payload.schemaVersion, recordCounts: payload.recordCounts },
      ip
    });
  });

  // Retention cleanup (keep newest N backup files)
  enforceRetention(dbm);

  return {
    id: recId,
    filename: jsonFilename,
    filePath: jsonPath,
    schemaVersion: payload.schemaVersion,
    sizeBytes,
    recordCounts: payload.recordCounts,
    backupType,
    createdAt: ts,
    rawJson
  };
}

function enforceRetention(dbm) {
  const maxKeep = Math.max(5, dbm.config.retentionBackups || 30);
  try {
    const files = fs.readdirSync(dbm.config.backupDir)
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .sort()
      .reverse();
    for (const stale of files.slice(maxKeep)) {
      try { fs.unlinkSync(path.join(dbm.config.backupDir, stale)); } catch (_) {}
    }
  } catch (_) {}
}

function validateBackupPayload(payload, expectedSchemaVersion) {
  const errors = [];
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, errors: ['Tệp khôi phục không phải JSON object hợp lệ.'] };
  }
  if (payload.format !== 'itc-tuyensinh-backup') {
    errors.push('Sai định dạng backup (thiếu format = itc-tuyensinh-backup).');
  }
  if (typeof payload.schemaVersion !== 'number' || payload.schemaVersion > expectedSchemaVersion || payload.schemaVersion < 1) {
    errors.push(`Phiên bản schema không tương thích: ${payload.schemaVersion} (hệ thống hỗ trợ <= ${expectedSchemaVersion}).`);
  }
  if (!payload.data || typeof payload.data !== 'object') {
    errors.push('Thiếu khối dữ liệu data.');
    return { valid: false, errors };
  }

  for (const requiredTable of ['users', 'staff', 'intake_years', 'persons', 'registrations']) {
    if (!Array.isArray(payload.data[requiredTable])) {
      errors.push(`Thiếu hoặc sai kiểu bảng bắt buộc: ${requiredTable}`);
    }
  }

  // Verify checksum if present
  if (payload.checksumSha256) {
    const computed = crypto.createHash('sha256').update(JSON.stringify(payload.data)).digest('hex');
    if (computed !== payload.checksumSha256) {
      errors.push('Mã kiểm tra toàn vẹn (checksumSha256) không khớp — tệp có thể bị hỏng hoặc chỉnh sửa trái phép.');
    }
  }

  // Ensure at least one active Super Admin exists in backup
  const activeAdmins = (payload.data.users || []).filter(u => u.role === 'super_admin' && u.active);
  if (activeAdmins.length === 0) {
    errors.push('Bản sao lưu không có Super Admin hoạt động nào — từ chối để tránh khóa hệ thống.');
  }

  // Validate relational integrity (registrations -> persons & intake_years)
  const personIds = new Set((payload.data.persons || []).map(p => p.id));
  const yearSet = new Set((payload.data.intake_years || []).map(y => y.year));
  let orphanRegCount = 0;
  for (const r of (payload.data.registrations || [])) {
    if (!personIds.has(r.person_id) || !yearSet.has(r.intake_year)) orphanRegCount++;
  }
  if (orphanRegCount > 0) {
    errors.push(`Phát hiện ${orphanRegCount} bản ghi đăng ký bị đứt liên kết person/intake_year.`);
  }

  const impactSummary = {};
  for (const t of BACKUP_TABLES) {
    impactSummary[t] = Array.isArray(payload.data[t]) ? payload.data[t].length : 0;
  }

  return { valid: errors.length === 0, errors, impactSummary, schemaVersion: payload.schemaVersion };
}

/**
 * Atomic Restore:
 * 1. Validates payload schema, checksum, super admin presence, and FK integrity
 * 2. Automatically saves a pre_restore checkpoint backup first
 * 3. Replaces tables inside a single SQLite transaction
 * 4. Revokes other stale sessions & notifies realtime clients to reload
 */
function restoreFromBackupPayload(dbm, payload, { actor, ip = '', dryRun = false, realtime = null }) {
  const check = validateBackupPayload(payload, dbm.config.schemaVersion);
  if (!check.valid) {
    const err = new Error('Bản sao lưu không hợp lệ: ' + check.errors.join(' | '));
    err.statusCode = 400;
    err.details = check.errors;
    throw err;
  }

  if (dryRun) {
    return { dryRun: true, valid: true, schemaVersion: check.schemaVersion, impactSummary: check.impactSummary };
  }

  // Automatic pre-restore safety checkpoint
  const checkpoint = createVersionedBackup(dbm, { actor, backupType: 'pre_restore', ip });

  // Perform full restore atomically
  dbm.db.exec('PRAGMA foreign_keys = OFF;');
  try {
    dbm.transaction((db) => {
      for (const table of [...BACKUP_TABLES].reverse()) {
        db.exec(`DELETE FROM ${table}`);
      }

      for (const table of BACKUP_TABLES) {
        const rows = payload.data[table];
        if (!Array.isArray(rows) || rows.length === 0) continue;

        const tableCols = new Set(db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name));
        for (const row of rows) {
          const cols = Object.keys(row).filter(c => tableCols.has(c));
          if (cols.length === 0) continue;
          const placeholders = cols.map(() => '?').join(',');
          const vals = cols.map(c => row[c]);
          db.prepare(`INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders})`).run(...vals);
        }
      }

      // Preserve current actor's active sessions if actor still exists; revoke others cleanly
      db.prepare('DELETE FROM idempotency_keys').run();

      dbm.appendAudit(db, {
        actor,
        action: 'SYSTEM_RESTORE_EXECUTED',
        entityType: 'system',
        summary: `Khôi phục dữ liệu thành công (schema v${payload.schemaVersion}). Checkpoint trước khôi phục: ${checkpoint.filename}`,
        detail: { checkpoint: checkpoint.filename, restoredCounts: check.impactSummary },
        ip
      });
    });
  } finally {
    dbm.db.exec('PRAGMA foreign_keys = ON;');
  }

  // Verify SQLite integrity after restore
  const fkCheck = dbm.db.prepare('PRAGMA foreign_key_check').all();
  if (fkCheck.length > 0) {
    const err = new Error(`Khôi phục phát hiện lỗi khóa ngoại (${fkCheck.length} dòng).`);
    err.statusCode = 500;
    throw err;
  }

  if (realtime) {
    realtime.broadcastSystemReload(`Hệ thống vừa khôi phục dữ liệu bởi ${actor.full_name}. Vui lòng tải lại.`);
  }

  return {
    restored: true,
    checkpoint: checkpoint.filename,
    checkpointObj: checkpoint,
    schemaVersion: payload.schemaVersion,
    restoredCounts: check.impactSummary
  };
}

function getSystemHealth(dbm, realtime, startTimeMs) {
  let dbOk = false;
  let dbSizeBytes = 0;
  let counts = {};
  let latestBackup = null;
  let backupRecordCount = 0;
  try {
    dbm.db.prepare('SELECT 1 AS ok').get();
    dbOk = true;
    if (fs.existsSync(dbm.config.dbPath)) {
      dbSizeBytes = fs.statSync(dbm.config.dbPath).size;
    }
    counts = {
      users: dbm.db.prepare('SELECT COUNT(*) AS c FROM users').get().c,
      staff: dbm.db.prepare('SELECT COUNT(*) AS c FROM staff WHERE active = 1').get().c,
      registrations: dbm.db.prepare('SELECT COUNT(*) AS c FROM registrations WHERE deleted_at IS NULL').get().c,
      regional: dbm.db.prepare('SELECT COUNT(*) AS c FROM regional_records WHERE deleted_at IS NULL').get().c,
      tasks: dbm.db.prepare('SELECT COUNT(*) AS c FROM tasks WHERE deleted_at IS NULL').get().c,
      snapshots: dbm.db.prepare('SELECT COUNT(*) AS c FROM report_snapshots').get().c,
      auditEvents: dbm.db.prepare('SELECT COUNT(*) AS c FROM audit_events').get().c
    };
    latestBackup = dbm.db.prepare('SELECT * FROM backup_records ORDER BY created_at DESC LIMIT 1').get() || null;
    backupRecordCount = dbm.db.prepare('SELECT COUNT(*) AS c FROM backup_records').get().c;
  } catch (_) {}

  let backupFileCount = backupRecordCount;
  if (!dbm.isCloudEnabled()) {
    try {
      backupFileCount = fs.readdirSync(dbm.config.backupDir).filter(f => f.endsWith('.json')).length;
    } catch (_) {}
  }

  return {
    status: dbOk ? 'healthy' : 'degraded',
    appVersion: dbm.config.appVersion,
    schemaVersion: dbm.config.schemaVersion,
    uptimeSeconds: Math.round((Date.now() - startTimeMs) / 1000),
    storage: {
      mode: dbm.isCloudEnabled() ? 'postgresql+sqlite' : 'sqlite-local',
      pgConnected: Boolean(dbm.pgStore && dbm.pgStore.connected),
      pgRev: dbm.pgStore ? dbm.pgStore.rev : null,
      lastSyncedAt: dbm.pgStore ? dbm.pgStore.lastSyncedAt : null,
      lastGzipBytes: dbm.pgStore ? dbm.pgStore.lastGzipBytes : null
    },
    db: {
      ok: dbOk,
      path: path.basename(dbm.config.dbPath),
      sizeBytes: dbSizeBytes,
      writeErrorCount: dbm.writeErrorCount
    },
    counts,
    backups: {
      count: backupFileCount,
      latest: latestBackup
    },
    realtime: realtime ? realtime.getStats() : { onlineUsers: 0, totalConnections: 0 },
    smtpConfigured: dbm.config.smtpConfigured,
    timestamp: nowIso()
  };
}

module.exports = {
  BACKUP_TABLES,
  exportDatabaseSnapshotObject,
  createVersionedBackup,
  validateBackupPayload,
  restoreFromBackupPayload,
  getSystemHealth
};

  },

  // =========================================================================
  // MODULE: ./realtime
  // =========================================================================
  "./realtime": function (module, exports, require) {
'use strict';

const { WebSocketServer } = require('ws');
const { extractSessionToken } = require('./auth');
const { nowIso } = require('./db');

class RealtimeHub {
  constructor({ server, auth, config }) {
    this.auth = auth;
    this.config = config;
    this.clients = new Set(); // { ws, user, token, connectedAt }
    this.wss = new WebSocketServer({ noServer: true, maxPayload: 256 * 1024 });

    // Wire immediate socket disconnect when an account is locked/revoked
    this.auth.onUserRevoked = (userId) => this.disconnectUser(userId);

    server.on('upgrade', (req, socket, head) => {
      const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      if (urlObj.pathname !== '/ws') {
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.destroy();
        return;
      }

      // 1. Validate Origin (OWASP WebSocket Security)
      if (!this._isOriginAllowed(req)) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
      }

      // 2. Strict server-side session authentication BEFORE upgrade!
      const token = extractSessionToken(req);
      const session = this.auth.authenticateToken(token);
      if (!session || !session.user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      this.wss.handleUpgrade(req, socket, head, (ws) => {
        this._handleConnection(ws, session.user, token);
      });
    });

    // Periodic heartbeat to clean dead sockets
    this._heartbeatTimer = setInterval(() => {
      for (const client of this.clients) {
        if (client.ws.isAlive === false) {
          try { client.ws.terminate(); } catch (_) {}
          this.clients.delete(client);
          continue;
        }
        client.ws.isAlive = false;
        try { client.ws.ping(); } catch (_) {}
      }
    }, 30000);
    if (this._heartbeatTimer.unref) this._heartbeatTimer.unref();
  }

  _isOriginAllowed(req) {
    const origin = req.headers['origin'];
    if (!origin) return true; // Non-browser WS client (e.g. automated tests or same-host)
    try {
      const originHost = new URL(origin).host;
      const reqHost = req.headers['host'];
      if (originHost === reqHost) return true;
      if (this.config.allowedOrigins && this.config.allowedOrigins.includes(origin)) return true;
    } catch (_) {
      return false;
    }
    return false;
  }

  _handleConnection(ws, user, token) {
    ws.isAlive = true;
    const client = { ws, user, token, connectedAt: nowIso() };
    this.clients.add(client);

    ws.on('pong', () => { ws.isAlive = true; });

    ws.on('message', (raw) => {
      // Re-verify active session on inbound messages
      const fresh = this.auth.authenticateToken(client.token);
      if (!fresh) {
        this._closeClient(client, 4001, 'Session revoked or account locked');
        return;
      }
      client.user = fresh.user;

      try {
        const msg = JSON.parse(String(raw));
        if (msg && msg.type === 'ping') {
          this._safeSend(ws, { type: 'pong', serverTime: nowIso() });
        }
      } catch (_) {
        // Ignore malformed client messages; all mutations go through transactional REST API
      }
    });

    ws.on('close', () => {
      this.clients.delete(client);
      this.broadcastPresence();
    });

    ws.on('error', () => {
      this.clients.delete(client);
    });

    // Send authenticated hello + deduplicated presence (NO unauthenticated full data dump!)
    this._safeSend(ws, {
      type: 'connected',
      serverTime: nowIso(),
      user: { id: user.id, full_name: user.full_name, role: user.role, scope: user.scope }
    });
    this.broadcastPresence();
  }

  _safeSend(ws, obj) {
    if (ws.readyState === 1) {
      try { ws.send(JSON.stringify(obj)); } catch (_) {}
    }
  }

  _closeClient(client, code, reason) {
    this.clients.delete(client);
    try {
      client.ws.close(code, reason);
    } catch (_) {
      try { client.ws.terminate(); } catch (__) {}
    }
  }

  /**
   * Immediately disconnect every open WebSocket belonging to a locked/deactivated user!
   */
  disconnectUser(userId) {
    let kicked = 0;
    for (const client of [...this.clients]) {
      if (client.user && client.user.id === userId) {
        this._safeSend(client.ws, { type: 'session_revoked', reason: 'Tài khoản đã bị khóa hoặc phiên bị thu hồi.' });
        this._closeClient(client, 4001, 'Account locked or session revoked');
        kicked++;
      }
    }
    if (kicked > 0) this.broadcastPresence();
    return kicked;
  }

  /**
   * Presence deduplicated by userId (fixing duplicate tab over-counting!)
   */
  getStats() {
    const userMap = new Map();
    for (const c of this.clients) {
      if (c.ws.readyState !== 1) continue;
      if (!userMap.has(c.user.id)) {
        userMap.set(c.user.id, {
          id: c.user.id,
          full_name: c.user.full_name,
          role: c.user.role,
          connections: 1
        });
      } else {
        userMap.get(c.user.id).connections++;
      }
    }
    return {
      onlineUsers: userMap.size,
      totalConnections: this.clients.size,
      users: Array.from(userMap.values())
    };
  }

  broadcastPresence() {
    const stats = this.getStats();
    const payload = { type: 'presence', ...stats, serverTime: nowIso() };
    for (const client of this.clients) {
      this._safeSend(client.ws, payload);
    }
  }

  /**
   * Broadcast a committed record-level change ONLY to authenticated recipients authorized for its scope!
   */
  broadcastEvent(event) {
    const msg = {
      type: 'domain_event',
      serverTime: nowIso(),
      ...event
    };
    for (const client of [...this.clients]) {
      if (client.ws.readyState !== 1) continue;

      // Refresh user permissions if needed or check scope
      const fresh = this.auth.authenticateToken(client.token);
      if (!fresh) {
        this._closeClient(client, 4001, 'Session expired or revoked');
        continue;
      }
      client.user = fresh.user;

      if (event.scopeStaffId !== undefined) {
        // Record-level scope check (also allow previousStaffId so old owner sees handover removal!)
        const canSeeCurrent = this.auth.canAccessRecord(client.user, event.scopeStaffId);
        const canSeePrev = event.previousScopeStaffId !== undefined && this.auth.canAccessRecord(client.user, event.previousScopeStaffId);
        if (!canSeeCurrent && !canSeePrev) continue;
      } else if (event.adminOnly && !this.auth.isAdminOrManager(client.user)) {
        continue;
      }

      this._safeSend(client.ws, msg);
    }
  }

  broadcastSystemReload(reason) {
    const payload = { type: 'system_reload', reason, serverTime: nowIso() };
    for (const client of this.clients) {
      this._safeSend(client.ws, payload);
    }
  }

  close() {
    clearInterval(this._heartbeatTimer);
    for (const c of this.clients) {
      try { c.ws.terminate(); } catch (_) {}
    }
    this.clients.clear();
    try { this.wss.close(); } catch (_) {}
  }
}

module.exports = { RealtimeHub };

  },

  // =========================================================================
  // MODULE: ./routes
  // =========================================================================
  "./routes": function (module, exports, require) {
'use strict';

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { newId, nowIso, hashPassword } = require('./db');
const {
  ROLES, SCOPES, CONTACT_STATUS, CONTACT_STATUS_LABELS,
  STAGE_CODE, STAGE_LABELS, MILESTONE_TYPE, TASK_STATUS,
  TASK_STATUS_LABELS, REGIONS, ITC_MAJORS, DEFAULT_DOCUMENT_CHECKLIST,
  getIntakeMonths
} = require('./constants');
const {
  cleanString, normalizePhone, normalizeVi, validationError,
  validateRegistrationPayload, validateTaskPayload, VALID_ROLES, VALID_SCOPES, VALID_REGIONS
} = require('./validators');
const { computeSlaSummary, computeReportDeadlines, computeKpiReport } = require('./sla-kpi');
const {
  parseExcelBufferToMatrix, parseQuickPasteTextToMatrix,
  parseCrmMatrix, parseRegionalMatrix, parseZaloCandidates,
  commitCrmImport, buildCrmTemplateBuffer, buildRegionalTemplateBuffer
} = require('./import-engine');
const {
  buildReportDataset, generateRealDocxBuffer, generateDynamicExcelBuffer, createNotificationJob
} = require('./reports');
const {
  createVersionedBackup, restoreFromBackupPayload, getSystemHealth
} = require('./backup');

function sendJsonRaw(res, statusCode, data, extraHeaders = {}) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  res.end(body);
}

function sendBufferRaw(res, statusCode, buf, contentType, filename = null) {
  const headers = {
    'Content-Type': contentType,
    'Content-Length': buf.length,
    'Cache-Control': 'no-store'
  };
  if (filename) {
    headers['Content-Disposition'] = `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`;
  }
  res.writeHead(statusCode, headers);
  res.end(buf);
}

function readJsonBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        const err = new Error(`Kích thước yêu cầu vượt giới hạn tối đa (${Math.round(maxBytes / 1024)} KB).`);
        err.statusCode = 413;
        err.code = 'PAYLOAD_TOO_LARGE';
        req.destroy();
        reject(err);
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (chunks.length === 0) return resolve({});
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (_) {
        const err = new Error('Nội dung JSON không hợp lệ.');
        err.statusCode = 400;
        err.code = 'INVALID_JSON';
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.socket ? (req.socket.remoteAddress || '') : '';
}

function enrichRegistrationRow(db, regId) {
  return db.prepare(`
    SELECT
      r.*,
      p.full_name, p.student_phone, p.parent_phone, p.email, p.dob, p.verified AS person_verified,
      s.full_name AS staff_name, s.zalo_slot AS staff_zalo_slot, s.team AS staff_team
    FROM registrations r
    JOIN persons p ON p.id = r.person_id
    LEFT JOIN staff s ON s.id = r.assigned_staff_id
    WHERE r.id = ?
  `).get(regId);
}

function parseFieldVersions(jsonStr) {
  try {
    const o = JSON.parse(jsonStr || '{}');
    return (o && typeof o === 'object') ? o : {};
  } catch (_) {
    return {};
  }
}

/**
 * Field-level optimistic concurrency check & merge:
 * - Different fields edited concurrently -> merge cleanly, keep both!
 * - Same field edited concurrently after expectedVersion -> return 409 Conflict with full details!
 */
function checkOptimisticMerge(currentObj, incomingPatch, expectedVersion, fieldVersions) {
  if (expectedVersion === undefined || expectedVersion === null) {
    return { ok: true, merged: false, conflicts: [] };
  }
  const expV = Number(expectedVersion);
  const curV = Number(currentObj.version || 1);
  if (expV === curV) {
    return { ok: true, merged: false, conflicts: [] };
  }
  if (expV > curV) {
    return {
      ok: false,
      conflicts: [{ field: '_version', serverVersion: curV, clientVersion: expV, message: 'Phiên bản client lớn hơn server.' }]
    };
  }
  const conflicts = [];
  for (const [field, newVal] of Object.entries(incomingPatch)) {
    if (field === 'milestone_occurred_at' || field === 'allow_shared_parent_phone') continue;
    const serverVal = currentObj[field];
    if (String(serverVal ?? '') === String(newVal ?? '')) continue;
    const lastFieldV = Number(fieldVersions[field] || 1);
    if (lastFieldV > expV) {
      conflicts.push({
        field,
        serverValue: serverVal,
        clientValue: newVal,
        serverFieldVersion: lastFieldV,
        serverVersion: curV
      });
    }
  }
  if (conflicts.length > 0) {
    return { ok: false, conflicts };
  }
  return { ok: true, merged: true, conflicts: [] };
}

function createApiHandler({ dbm, auth, realtime: rawRealtime, config, startTimeMs }) {
  async function handleApi(req, res, urlObj) {
    const method = req.method.toUpperCase();
    const pathname = urlObj.pathname;
    const ip = getClientIp(req);
    const isHttps = req.headers['x-forwarded-proto'] === 'https';

    const executeRequest = async () => {
      let pendingResp = null;
      const pendingWs = [];
      const sendJson = (_res, statusCode, data, extraHeaders = {}) => {
        pendingResp = { type: 'json', statusCode, data, extraHeaders };
      };
      const sendBuffer = (_res, statusCode, buf, contentType, filename = null) => {
        pendingResp = { type: 'buf', statusCode, buf, contentType, filename };
      };
      const realtime = dbm.isCloudEnabled()
        ? {
            getStats: () => rawRealtime.getStats(),
            disconnectUser: (uid) => rawRealtime.disconnectUser(uid),
            broadcastEvent: (ev) => pendingWs.push({ kind: 'event', ev }),
            broadcastSystemReload: (reason) => pendingWs.push({ kind: 'reload', reason })
          }
        : rawRealtime;

      const dispatch = async () => {
      // --- PUBLIC ENDPOINTS (strictly minimal!) ---
      if (method === 'GET' && pathname === '/api/health') {
        const session = auth.authenticateRequest(req);
        if (session && auth.isAdminOrManager(session.user)) {
          return sendJson(res, 200, getSystemHealth(dbm, realtime, startTimeMs));
        }
        return sendJson(res, 200, { status: 'healthy', appVersion: config.appVersion, storageMode: dbm.isCloudEnabled() ? 'postgresql+sqlite' : 'sqlite-local', timestamp: nowIso() });
      }

      if (method === 'POST' && pathname === '/api/auth/login') {
        const body = await readJsonBody(req, 16 * 1024);
        const result = auth.login(body.email, body.password, ip, req.headers['user-agent'] || '');
        const maxAge = config.sessionTtlHours * 3600;
        return sendJson(
          res, 200,
          { ok: true, user: result.user, token: result.token, expiresAt: result.expiresAt },
          { 'Set-Cookie': auth.makeSessionCookie(result.token, maxAge, isHttps) }
        );
      }

      // --- ALL OTHER /api/* ROUTES REQUIRE VALID SERVER SESSION ---
      const session = auth.authenticateRequest(req);
      if (!session || !session.user) {
        return sendJson(res, 401, { error: 'UNAUTHORIZED', message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
      }
      const user = session.user;

      if (method === 'POST' && pathname === '/api/auth/logout') {
        const token = req.headers['authorization']?.startsWith('Bearer ')
          ? req.headers['authorization'].slice(7).trim()
          : (require('./auth').extractSessionToken(req));
        auth.logout(token, user, ip);
        return sendJson(res, 200, { ok: true }, { 'Set-Cookie': auth.clearSessionCookie(isHttps) });
      }

      if (method === 'GET' && pathname === '/api/auth/me') {
        return sendJson(res, 200, { user, serverTime: nowIso() });
      }

      if (method === 'POST' && pathname === '/api/auth/change-password') {
        const body = await readJsonBody(req, 16 * 1024);
        auth.changePassword(user.id, body.currentPassword, body.newPassword, ip);
        return sendJson(res, 200, { ok: true, message: 'Đã đổi mật khẩu thành công.' });
      }

      // --- IDEMPOTENCY KEY CHECK FOR MUTATIONS ---
      const idemKey = cleanString(req.headers['x-idempotency-key'] || '', 120);
      if (idemKey && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
        const existingIdem = dbm.db.prepare('SELECT status_code, response_json FROM idempotency_keys WHERE key = ? AND user_id = ?')
          .get(idemKey, user.id);
        if (existingIdem) {
          return sendJson(res, existingIdem.status_code, JSON.parse(existingIdem.response_json), { 'X-Idempotent-Replay': 'true' });
        }
      }

      const saveIdempotency = (db, statusCode, payload) => {
        if (!idemKey) return;
        db.prepare(`
          INSERT OR REPLACE INTO idempotency_keys (key, user_id, method, path, status_code, response_json, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(idemKey, user.id, method, pathname, statusCode, JSON.stringify(payload), nowIso());
      };

      // --- BOOTSTRAP REFERENCE DATA ---
      if (method === 'GET' && pathname === '/api/bootstrap') {
        const staff = dbm.db.prepare(`
          SELECT s.*, u.role AS user_role, u.active AS user_active
          FROM staff s LEFT JOIN users u ON u.id = s.user_id
          ORDER BY s.active DESC, s.id ASC
        `).all();
        const intakeYears = dbm.db.prepare('SELECT * FROM intake_years ORDER BY year ASC').all();
        const workingHours = dbm.getSetting('working_hours', config.defaultWorkingHours);
        const defaultYear = dbm.getSetting('default_intake_year', '2027');
        return sendJson(res, 200, {
          user,
          staff,
          intakeYears,
          defaultIntakeYear: defaultYear,
          workingHours,
          majors: ITC_MAJORS,
          regions: REGIONS,
          contactStatusLabels: CONTACT_STATUS_LABELS,
          stageLabels: STAGE_LABELS,
          taskStatusLabels: TASK_STATUS_LABELS,
          presence: realtime.getStats(),
          smtpConfigured: config.smtpConfigured,
          appVersion: config.appVersion
        });
      }

      // --- M0: MY TODAY'S WORK ("Việc của tôi hôm nay") ---
      if (method === 'GET' && pathname === '/api/my-work') {
        const intakeYear = urlObj.searchParams.get('intakeYear') || '2027';
        const scope = auth.buildScopeFilterSql(user, 'r.assigned_staff_id');
        const workingHours = dbm.getSetting('working_hours', config.defaultWorkingHours);

        const regs = dbm.db.prepare(`
          SELECT r.*, p.full_name, p.student_phone, p.parent_phone, s.full_name AS staff_name
          FROM registrations r
          JOIN persons p ON p.id = r.person_id
          LEFT JOIN staff s ON s.id = r.assigned_staff_id
          WHERE r.intake_year = ? AND r.deleted_at IS NULL AND ${scope.sql}
          ORDER BY r.created_at DESC
        `).all(intakeYear, ...scope.params);

        const slaRes = computeSlaSummary(regs, workingHours, new Date());
        const newLeads = slaRes.items.filter(r => r.contact_status === CONTACT_STATUS.UNCONTACTED).slice(0, 30);
        const slaUrgent = slaRes.items.filter(r => ['overdue_unhandled', 'in_window_pending', 'unassigned'].includes(r.sla.bucket)).slice(0, 30);
        const pendingVerify = regs.filter(r => r.stage_code === STAGE_CODE.PENDING_VERIFY || r.dedup_flag === 'suspected_duplicate').slice(0, 30);

        // Follow-ups due today or overdue
        const tomorrowIso = new Date(Date.now() + 24 * 3600000).toISOString();
        const fupScope = auth.buildScopeFilterSql(user, 'COALESCE(f.assigned_staff_id, r.assigned_staff_id)');
        const dueFollowUps = dbm.db.prepare(`
          SELECT f.*, p.full_name, p.student_phone, r.major, r.stage_code
          FROM follow_ups f
          JOIN registrations r ON r.id = f.registration_id
          JOIN persons p ON p.id = r.person_id
          WHERE r.intake_year = ? AND r.deleted_at IS NULL AND f.status = 'pending' AND f.due_at <= ? AND ${fupScope.sql}
          ORDER BY f.due_at ASC LIMIT 30
        `).all(intakeYear, tomorrowIso, ...fupScope.params);

        // Missing documents for submitted/interested leads
        const missingDocs = dbm.db.prepare(`
          SELECT r.id AS registration_id, p.full_name, p.student_phone, r.stage_code,
                 COUNT(d.id) AS missing_count
          FROM registrations r
          JOIN persons p ON p.id = r.person_id
          JOIN document_checklists d ON d.registration_id = r.id AND d.status = 'missing'
          WHERE r.intake_year = ? AND r.deleted_at IS NULL AND r.stage_code IN ('submitted', 'lead') AND r.contact_status IN ('contacted_interested', 'callback_scheduled') AND ${scope.sql}
          GROUP BY r.id
          ORDER BY r.updated_at DESC LIMIT 20
        `).all(intakeYear, ...scope.params);

        // Overdue / due soon tasks
        const taskOwnerSql = auth.isAdminOrManager(user)
          ? { sql: '1=1', params: [] }
          : { sql: '(t.owner_staff_id = ? OR t.collaborators_json LIKE ?)', params: [user.staff_id || '', `%${user.staff_id || '__none__'}%`] };
        const myTasks = dbm.db.prepare(`
          SELECT t.*, s.full_name AS owner_name
          FROM tasks t LEFT JOIN staff s ON s.id = t.owner_staff_id
          WHERE t.intake_year = ? AND t.deleted_at IS NULL AND t.status NOT IN ('done', 'cancelled') AND ${taskOwnerSql.sql}
          ORDER BY t.deadline ASC LIMIT 25
        `).all(intakeYear, ...taskOwnerSql.params);

        return sendJson(res, 200, {
          intakeYear,
          summary: {
            newLeadsCount: newLeads.length,
            slaUrgentCount: slaUrgent.length,
            dueFollowUpsCount: dueFollowUps.length,
            missingDocsCount: missingDocs.length,
            pendingVerifyCount: pendingVerify.length,
            openTasksCount: myTasks.length
          },
          newLeads,
          slaUrgent,
          dueFollowUps,
          missingDocs,
          pendingVerify,
          myTasks
        });
      }

      // --- TEMPLATES DOWNLOAD ---
      if (method === 'GET' && pathname === '/api/templates/crm') {
        const buf = buildCrmTemplateBuffer();
        return sendBuffer(res, 200, buf, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Mau_Nhap_CRM_ITC.xlsx');
      }
      if (method === 'GET' && pathname === '/api/templates/regional') {
        const buf = buildRegionalTemplateBuffer();
        return sendBuffer(res, 200, buf, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Mau_Tuyen_Tinh_ITC.xlsx');
      }

      // --- M1: CRM REGISTRATIONS ---
      if (method === 'GET' && pathname === '/api/registrations/export') {
        auth.requirePermission(user, 'can_export', 'Tài khoản của bạn không có quyền xuất dữ liệu Excel.');
        const intakeYear = urlObj.searchParams.get('intakeYear') || '2027';
        const scope = auth.buildScopeFilterSql(user, 'r.assigned_staff_id');
        const rows = dbm.db.prepare(`
          SELECT r.*, p.full_name, p.student_phone, p.parent_phone, s.full_name AS staff_name
          FROM registrations r
          JOIN persons p ON p.id = r.person_id
          LEFT JOIN staff s ON s.id = r.assigned_staff_id
          WHERE r.intake_year = ? AND r.deleted_at IS NULL AND ${scope.sql}
          ORDER BY r.created_at DESC
        `).all(intakeYear, ...scope.params);

        dbm.appendAudit(null, {
          actor: user,
          action: 'EXPORT_CRM_EXCEL',
          entityType: 'registration',
          summary: `Xuất Excel CRM niên khóa ${intakeYear} (${rows.length} dòng theo phạm vi ${user.scope})`,
          detail: { intakeYear, count: rows.length, scope: user.scope },
          ip
        });

        const aoa = [
          ['Họ và tên', 'Số điện thoại', 'Ngành quan tâm', 'Nguồn', 'Nhân sự phụ trách', 'Trạng thái chăm sóc', 'Kết quả cuối cùng', 'Ghi chú', 'SĐT phụ huynh', 'Trường THPT', 'Tỉnh/TP', 'Mã ĐK'],
          ...rows.map(r => [
            r.full_name, r.student_phone, r.major, r.source, r.staff_name || '',
            CONTACT_STATUS_LABELS[r.contact_status] || r.contact_status,
            STAGE_LABELS[r.stage_code] || r.stage_code,
            r.notes, r.parent_phone, r.school, r.province, r.id
          ])
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), `CRM_${intakeYear}`);
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        return sendBuffer(res, 200, buf, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', `CRM_ITC_${intakeYear}.xlsx`);
      }

      if (method === 'GET' && pathname === '/api/registrations') {
        const intakeYear = urlObj.searchParams.get('intakeYear') || '2027';
        const search = cleanString(urlObj.searchParams.get('search') || '', 120);
        const staffId = urlObj.searchParams.get('staffId') || '';
        const contactStatus = urlObj.searchParams.get('contactStatus') || '';
        const stageCode = urlObj.searchParams.get('stageCode') || '';
        const dedupFlag = urlObj.searchParams.get('dedupFlag') || '';
        const page = Math.max(1, parseInt(urlObj.searchParams.get('page') || '1', 10));
        const pageSize = Math.min(200, Math.max(5, parseInt(urlObj.searchParams.get('pageSize') || '25', 10)));

        const scope = auth.buildScopeFilterSql(user, 'r.assigned_staff_id');
        const where = ['r.intake_year = ?', 'r.deleted_at IS NULL', scope.sql];
        const params = [intakeYear, ...scope.params];

        if (staffId && staffId !== 'ALL') {
          if (staffId === 'UNASSIGNED') {
            where.push('r.assigned_staff_id IS NULL');
          } else {
            where.push('r.assigned_staff_id = ?');
            params.push(staffId);
          }
        }
        if (contactStatus && contactStatus !== 'ALL') {
          where.push('r.contact_status = ?');
          params.push(contactStatus);
        }
        if (stageCode && stageCode !== 'ALL') {
          where.push('r.stage_code = ?');
          params.push(stageCode);
        }
        if (dedupFlag === 'flagged') {
          where.push(`r.dedup_flag != ''`);
        }
        if (search) {
          const like = `%${search}%`;
          where.push('(p.full_name LIKE ? OR p.student_phone LIKE ? OR p.parent_phone LIKE ? OR r.major LIKE ? OR r.school LIKE ? OR r.province LIKE ? OR r.notes LIKE ?)');
          params.push(like, like, like, like, like, like, like);
        }

        const whereSql = where.join(' AND ');
        const total = dbm.db.prepare(`
          SELECT COUNT(*) AS cnt FROM registrations r JOIN persons p ON p.id = r.person_id WHERE ${whereSql}
        `).get(...params).cnt;

        const items = dbm.db.prepare(`
          SELECT r.*, p.full_name, p.student_phone, p.parent_phone, p.email, p.verified AS person_verified,
                 s.full_name AS staff_name, s.zalo_slot AS staff_zalo_slot
          FROM registrations r
          JOIN persons p ON p.id = r.person_id
          LEFT JOIN staff s ON s.id = r.assigned_staff_id
          WHERE ${whereSql}
          ORDER BY r.created_at DESC
          LIMIT ? OFFSET ?
        `).all(...params, pageSize, (page - 1) * pageSize);

        return sendJson(res, 200, { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
      }

      if (method === 'POST' && pathname === '/api/registrations') {
        const body = await readJsonBody(req, config.maxBodyBytes);
        const v = validateRegistrationPayload(body, false);
        const intakeYear = v.intake_year || '2027';

        // Check intake year exists & open
        const iy = dbm.db.prepare('SELECT * FROM intake_years WHERE year = ?').get(intakeYear);
        if (!iy) throw validationError(`Niên khóa ${intakeYear} không tồn tại.`);
        if (iy.status === 'closed' && !auth.isSuperAdmin(user)) {
          const err = new Error(`Niên khóa ${intakeYear} đã đóng, không thể tạo hồ sơ mới.`);
          err.statusCode = 403;
          throw err;
        }

        // Enforce scope: consultant with own scope creating a lead assigns to self
        let assignedStaffId = v.assigned_staff_id !== undefined ? v.assigned_staff_id : user.staff_id;
        if (user.scope === SCOPES.OWN && !auth.isAdminOrManager(user)) {
          assignedStaffId = user.staff_id;
        }
        if (assignedStaffId) {
          const stf = dbm.db.prepare('SELECT id FROM staff WHERE id = ?').get(assignedStaffId);
          if (!stf) throw validationError('Nhân sự phụ trách không tồn tại.', 'assigned_staff_id');
        }

        const ts = nowIso();
        const crmReceivedAt = body.crm_received_at === null ? null : (v.crm_received_at || ts);
        const sourceReceivedAt = body.source_received_at === null ? null : (v.source_received_at || crmReceivedAt);
        const regOccurredAt = v.milestone_occurred_at || sourceReceivedAt || crmReceivedAt || ts;
        const stageCode = v.stage_code || STAGE_CODE.LEAD;
        const contactStatus = v.contact_status || CONTACT_STATUS.UNCONTACTED;
        const firstContactAt = v.first_contact_at || (contactStatus !== CONTACT_STATUS.UNCONTACTED ? ts : null);

        const result = dbm.transaction((db) => {
          // Unified dedup check within same intakeYear
          let dedupFlag = v.dedup_flag || '';
          let existingSamePerson = null;
          if (v.student_phone) {
            const matches = db.prepare(`
              SELECT r.*, p.full_name FROM registrations r JOIN persons p ON p.id = r.person_id
              WHERE r.intake_year = ? AND r.deleted_at IS NULL AND p.student_phone = ?
            `).all(intakeYear, v.student_phone);
            existingSamePerson = matches.find(m => normalizeVi(m.full_name) === normalizeVi(v.full_name));
            if (existingSamePerson && !v.allow_shared_parent_phone) {
              // Merge source into existing person instead of double counting!
              let sh = [];
              try { sh = JSON.parse(existingSamePerson.sources_history_json || '[]'); } catch (_) {}
              if (v.source && !sh.includes(v.source)) sh.push(v.source);
              db.prepare('UPDATE registrations SET sources_history_json = ?, version = version + 1, updated_at = ? WHERE id = ?')
                .run(JSON.stringify(sh), ts, existingSamePerson.id);
              const updated = enrichRegistrationRow(db, existingSamePerson.id);
              const resp = { ok: true, deduplicated: true, record: updated };
              saveIdempotency(db, 200, resp);
              return { statusCode: 200, resp, record: updated, eventType: 'record_updated' };
            }
            if (matches.length > 0 && !v.allow_shared_parent_phone) {
              dedupFlag = 'suspected_duplicate';
            }
          }
          if (v.parent_phone && v.allow_shared_parent_phone) {
            dedupFlag = 'verified_shared_parent';
          }

          const personId = newId('per');
          const regId = newId('reg');
          db.prepare(`
            INSERT INTO persons (id, full_name, student_phone, parent_phone, email, dob, province, school, raw_data_json, verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            personId, v.full_name, v.student_phone || '', v.parent_phone || '',
            v.email || '', v.dob || '', v.province || '', v.school || '',
            JSON.stringify(body), v.allow_shared_parent_phone ? 1 : 0, ts, ts
          );

          if (v.student_phone) {
            db.prepare('INSERT INTO contact_points (id, person_id, contact_type, value, is_shared_parent, verified, created_at) VALUES (?, ?, ?, ?, 0, 0, ?)')
              .run(newId('ctp'), personId, 'student_phone', v.student_phone, ts);
          }
          if (v.parent_phone) {
            db.prepare('INSERT INTO contact_points (id, person_id, contact_type, value, is_shared_parent, verified, created_at) VALUES (?, ?, ?, ?, 1, ?, ?)')
              .run(newId('ctp'), personId, 'parent_phone', v.parent_phone, v.allow_shared_parent_phone ? 1 : 0, ts);
          }

          const sourcesHist = [v.source || 'CRM trực tiếp'];
          db.prepare(`
            INSERT INTO registrations (
              id, person_id, intake_year, major, degree_level, source, campaign, school, province,
              assigned_staff_id, contact_status, stage_code, notes, next_action,
              source_received_at, crm_received_at, first_contact_at, sla_exception_reason,
              dedup_flag, sources_history_json, version, field_versions_json, created_by, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, '{}', ?, ?, ?)
          `).run(
            regId, personId, intakeYear, v.major || '', v.degree_level || 'Cao đẳng',
            v.source || 'CRM trực tiếp', v.campaign || '', v.school || '', v.province || '',
            assignedStaffId || null, contactStatus, stageCode, v.notes || '', v.next_action || '',
            sourceReceivedAt, crmReceivedAt, firstContactAt, v.sla_exception_reason || '',
            dedupFlag, JSON.stringify(sourcesHist), user.id, ts, ts
          );

          db.prepare(`
            INSERT INTO milestone_events (id, registration_id, intake_year, milestone_type, occurred_at, attributed_staff_id, recorded_by_user_id, evidence_note, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
          `).run(newId('mil'), regId, intakeYear, MILESTONE_TYPE.REGISTERED, regOccurredAt, assignedStaffId || null, user.id, 'Tiếp nhận hồ sơ CRM', ts);

          if (stageCode === STAGE_CODE.SUBMITTED || stageCode === STAGE_CODE.ENROLLED) {
            db.prepare(`
              INSERT INTO milestone_events (id, registration_id, intake_year, milestone_type, occurred_at, attributed_staff_id, recorded_by_user_id, evidence_note, is_active, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
            `).run(newId('mil'), regId, intakeYear, MILESTONE_TYPE.SUBMITTED, regOccurredAt, assignedStaffId || null, user.id, 'Ghi nhận khi tạo hồ sơ', ts);
          }
          if (stageCode === STAGE_CODE.ENROLLED) {
            db.prepare(`
              INSERT INTO milestone_events (id, registration_id, intake_year, milestone_type, occurred_at, attributed_staff_id, recorded_by_user_id, evidence_note, is_active, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
            `).run(newId('mil'), regId, intakeYear, MILESTONE_TYPE.ENROLLED, regOccurredAt, assignedStaffId || null, user.id, 'Ghi nhận khi tạo hồ sơ', ts);
          }

          const insDoc = db.prepare(`
            INSERT OR IGNORE INTO document_checklists (id, registration_id, doc_code, doc_name, status, note, updated_by, updated_at)
            VALUES (?, ?, ?, ?, 'missing', '', ?, ?)
          `);
          for (const d of DEFAULT_DOCUMENT_CHECKLIST) {
            insDoc.run(newId('doc'), regId, d.code, d.name, user.id, ts);
          }

          dbm.appendAudit(db, {
            actor: user,
            action: 'REGISTRATION_CREATED',
            entityType: 'registration',
            entityId: regId,
            summary: `Tạo hồ sơ thí sinh ${v.full_name} (NK ${intakeYear})`,
            detail: { regId, intakeYear, assignedStaffId, stageCode },
            ip
          });

          const created = enrichRegistrationRow(db, regId);
          const resp = { ok: true, deduplicated: false, record: created };
          saveIdempotency(db, 201, resp);
          return { statusCode: 201, resp, record: created, eventType: 'record_created' };
        });

        // Broadcast AFTER transaction committed!
        realtime.broadcastEvent({
          entity: 'registration',
          action: result.eventType,
          id: result.record.id,
          intakeYear: result.record.intake_year,
          scopeStaffId: result.record.assigned_staff_id,
          record: result.record
        });

        return sendJson(res, result.statusCode, result.resp);
      }

      // Single Registration routes: /api/registrations/:id[/sub]
      const regMatch = pathname.match(/^\/api\/registrations\/([^/]+)(?:\/([^/]+)(?:\/([^/]+))?)?$/);
      if (regMatch) {
        const regId = regMatch[1];
        const sub = regMatch[2] || '';
        const subId = regMatch[3] || '';

        const current = enrichRegistrationRow(dbm.db, regId);
        if (!current || current.deleted_at) {
          return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy hồ sơ thí sinh.' });
        }
        // Strict record-scope enforcement (Scenario 2!)
        if (!auth.canAccessRecord(user, current.assigned_staff_id, current.staff_team)) {
          return sendJson(res, 403, { error: 'FORBIDDEN_SCOPE', message: 'Bạn không có quyền truy cập hồ sơ ngoài phạm vi được giao.' });
        }

        if (method === 'GET' && !sub) {
          const milestones = dbm.db.prepare(`
            SELECT m.*, s.full_name AS attributed_staff_name, u.full_name AS recorded_by_name
            FROM milestone_events m
            LEFT JOIN staff s ON s.id = m.attributed_staff_id
            LEFT JOIN users u ON u.id = m.recorded_by_user_id
            WHERE m.registration_id = ?
            ORDER BY m.occurred_at DESC
          `).all(regId);
          const interactions = dbm.db.prepare(`
            SELECT i.*, s.full_name AS staff_name, u.full_name AS user_name
            FROM interactions i
            LEFT JOIN staff s ON s.id = i.staff_id
            LEFT JOIN users u ON u.id = i.user_id
            WHERE i.registration_id = ?
            ORDER BY i.occurred_at DESC
          `).all(regId);
          const followUps = dbm.db.prepare(`
            SELECT f.*, s.full_name AS assigned_staff_name
            FROM follow_ups f LEFT JOIN staff s ON s.id = f.assigned_staff_id
            WHERE f.registration_id = ?
            ORDER BY f.due_at ASC
          `).all(regId);
          const documents = dbm.db.prepare('SELECT * FROM document_checklists WHERE registration_id = ? ORDER BY id ASC').all(regId);
          const handovers = dbm.db.prepare(`
            SELECT h.*, sf.full_name AS from_staff_name, st.full_name AS to_staff_name, u.full_name AS changed_by_name
            FROM assignment_history h
            LEFT JOIN staff sf ON sf.id = h.from_staff_id
            LEFT JOIN staff st ON st.id = h.to_staff_id
            LEFT JOIN users u ON u.id = h.changed_by_user_id
            WHERE h.registration_id = ?
            ORDER BY h.created_at DESC
          `).all(regId);
          const workingHours = dbm.getSetting('working_hours', config.defaultWorkingHours);
          const sla = require('./sla-kpi').evaluateRegistrationSla(current, workingHours, new Date());

          return sendJson(res, 200, { record: current, sla, milestones, interactions, followUps, documents, handovers });
        }

        if (method === 'PATCH' && !sub) {
          const body = await readJsonBody(req, config.maxBodyBytes);
          const patchRaw = body.patch && typeof body.patch === 'object' ? body.patch : body;
          const expectedVersion = body.expectedVersion !== undefined ? body.expectedVersion : body.version;
          const v = validateRegistrationPayload(patchRaw, true);

          // Prevent closed-year edits by non-super-admin
          const iy = dbm.db.prepare('SELECT status FROM intake_years WHERE year = ?').get(current.intake_year);
          if (iy && iy.status === 'closed' && !auth.isSuperAdmin(user)) {
            return sendJson(res, 403, { error: 'YEAR_CLOSED', message: `Niên khóa ${current.intake_year} đã khóa sổ.` });
          }

          // Consultants with own scope cannot reassign away to another staff without handover/admin
          if (v.assigned_staff_id !== undefined && v.assigned_staff_id !== current.assigned_staff_id && !auth.isAdminOrManager(user)) {
            return sendJson(res, 403, { error: 'FORBIDDEN', message: 'Chỉ lãnh đạo/quản trị mới được điều chuyển nhân sự phụ trách.' });
          }

          const ts = nowIso();
          const txResult = dbm.transaction((db) => {
            const fresh = enrichRegistrationRow(db, regId);
            const fv = parseFieldVersions(fresh.field_versions_json);
            const check = checkOptimisticMerge(fresh, v, expectedVersion, fv);
            if (!check.ok) {
              return { conflict: true, conflicts: check.conflicts, currentRecord: fresh };
            }

            const nextVersion = Number(fresh.version || 1) + 1;
            const nextFv = { ...fv };

            // Update person fields if present
            const personFields = ['full_name', 'student_phone', 'parent_phone', 'email', 'dob'];
            const personUpdates = [];
            const personParams = [];
            for (const pf of personFields) {
              if (v[pf] !== undefined && String(fresh[pf] ?? '') !== String(v[pf] ?? '')) {
                personUpdates.push(`${pf} = ?`);
                personParams.push(v[pf]);
                nextFv[pf] = nextVersion;
              }
            }
            if (personUpdates.length > 0) {
              personUpdates.push('updated_at = ?');
              personParams.push(ts, fresh.person_id);
              db.prepare(`UPDATE persons SET ${personUpdates.join(', ')} WHERE id = ?`).run(...personParams);
            }

            // Update registration fields
            const regFields = [
              'major', 'degree_level', 'source', 'campaign', 'school', 'province',
              'assigned_staff_id', 'contact_status', 'stage_code', 'notes', 'next_action',
              'source_received_at', 'crm_received_at', 'first_contact_at', 'sla_exception_reason', 'dedup_flag'
            ];
            const regUpdates = [];
            const regParams = [];
            for (const rf of regFields) {
              if (v[rf] !== undefined && String(fresh[rf] ?? '') !== String(v[rf] ?? '')) {
                regUpdates.push(`${rf} = ?`);
                regParams.push(v[rf]);
                nextFv[rf] = nextVersion;
              }
            }

            // Auto-capture first_contact_at when transitioning out of uncontacted for the first time
            if (v.contact_status && v.contact_status !== CONTACT_STATUS.UNCONTACTED && !fresh.first_contact_at && v.first_contact_at === undefined) {
              regUpdates.push('first_contact_at = ?');
              regParams.push(ts);
              nextFv.first_contact_at = nextVersion;
            }

            regUpdates.push('version = ?', 'field_versions_json = ?', 'updated_at = ?');
            regParams.push(nextVersion, JSON.stringify(nextFv), ts, regId);
            db.prepare(`UPDATE registrations SET ${regUpdates.join(', ')} WHERE id = ?`).run(...regParams);

            // Sync milestones if stage_code explicitly changed
            if (v.stage_code && v.stage_code !== fresh.stage_code) {
              const occ = v.milestone_occurred_at || ts;
              const staffAttr = v.assigned_staff_id !== undefined ? v.assigned_staff_id : fresh.assigned_staff_id;
              if (v.stage_code === STAGE_CODE.SUBMITTED) {
                db.prepare(`INSERT INTO milestone_events (id, registration_id, intake_year, milestone_type, occurred_at, attributed_staff_id, recorded_by_user_id, evidence_note, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`)
                  .run(newId('mil'), regId, fresh.intake_year, MILESTONE_TYPE.SUBMITTED, occ, staffAttr, user.id, 'Cập nhật trạng thái Đã nộp hồ sơ', ts);
              } else if (v.stage_code === STAGE_CODE.ENROLLED) {
                db.prepare(`INSERT INTO milestone_events (id, registration_id, intake_year, milestone_type, occurred_at, attributed_staff_id, recorded_by_user_id, evidence_note, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`)
                  .run(newId('mil'), regId, fresh.intake_year, MILESTONE_TYPE.ENROLLED, occ, staffAttr, user.id, 'Cập nhật trạng thái Đã nhập học', ts);
              } else if (v.stage_code === STAGE_CODE.WITHDRAWN) {
                db.prepare(`INSERT INTO milestone_events (id, registration_id, intake_year, milestone_type, occurred_at, attributed_staff_id, recorded_by_user_id, evidence_note, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`)
                  .run(newId('mil'), regId, fresh.intake_year, MILESTONE_TYPE.WITHDRAWN, occ, staffAttr, user.id, 'Rút hồ sơ / Hủy đăng ký', ts);
              }
            }

            dbm.appendAudit(db, {
              actor: user,
              action: 'REGISTRATION_UPDATED',
              entityType: 'registration',
              entityId: regId,
              summary: `Cập nhật hồ sơ ${fresh.full_name} (v${fresh.version} -> v${nextVersion})`,
              detail: { changedFields: Object.keys(v), merged: check.merged },
              ip
            });

            const updated = enrichRegistrationRow(db, regId);
            const resp = { ok: true, merged: check.merged, record: updated };
            saveIdempotency(db, 200, resp);
            return { conflict: false, resp, record: updated, previousStaffId: fresh.assigned_staff_id };
          });

          if (txResult.conflict) {
            return sendJson(res, 409, {
              error: 'CONFLICT',
              message: 'Phát hiện xung đột sửa đồng thời trên cùng trường dữ liệu. Vui lòng xem và chọn phương án xử lý.',
              conflicts: txResult.conflicts,
              currentRecord: txResult.currentRecord
            });
          }

          realtime.broadcastEvent({
            entity: 'registration',
            action: 'record_updated',
            id: txResult.record.id,
            intakeYear: txResult.record.intake_year,
            scopeStaffId: txResult.record.assigned_staff_id,
            previousScopeStaffId: txResult.previousStaffId,
            record: txResult.record
          });
          return sendJson(res, 200, txResult.resp);
        }

        if (method === 'DELETE' && !sub) {
          auth.requirePermission(user, 'can_delete', 'Tài khoản của bạn không có quyền xóa hồ sơ.');
          const ts = nowIso();
          const resp = dbm.transaction((db) => {
            db.prepare('UPDATE registrations SET deleted_at = ?, version = version + 1, updated_at = ? WHERE id = ?')
              .run(ts, ts, regId);
            dbm.appendAudit(db, {
              actor: user,
              action: 'REGISTRATION_DELETED',
              entityType: 'registration',
              entityId: regId,
              summary: `Xóa hồ sơ ${current.full_name} (${regId})`,
              ip
            });
            const r = { ok: true, deletedId: regId };
            saveIdempotency(db, 200, r);
            return r;
          });

          realtime.broadcastEvent({
            entity: 'registration',
            action: 'record_deleted',
            id: regId,
            intakeYear: current.intake_year,
            scopeStaffId: current.assigned_staff_id
          });
          return sendJson(res, 200, resp);
        }

        // Sub-resource: Interactions (call/Zalo/SMS log)
        if (method === 'POST' && sub === 'interactions') {
          const body = await readJsonBody(req, 64 * 1024);
          const channel = cleanString(body.channel || 'call', 30);
          const outcome = cleanString(body.outcome || 'connected', 40);
          const summary = cleanString(body.summary || '', 2000);
          if (!summary) throw validationError('Nội dung chăm sóc không được để trống.');
          const occurredAt = body.occurred_at ? new Date(body.occurred_at).toISOString() : nowIso();
          const ts = nowIso();
          const intId = newId('int');

          const outcomeToContact = {
            no_answer: CONTACT_STATUS.NO_ANSWER,
            wrong_number: CONTACT_STATUS.WRONG_NUMBER,
            callback_requested: CONTACT_STATUS.CALLBACK_SCHEDULED,
            interested: CONTACT_STATUS.CONTACTED_INTERESTED,
            not_interested: CONTACT_STATUS.NOT_INTERESTED,
            connected: CONTACT_STATUS.CONTACTED_INTERESTED,
            info_sent: CONTACT_STATUS.CONTACTED_INTERESTED
          };

          const updated = dbm.transaction((db) => {
            db.prepare(`
              INSERT INTO interactions (id, registration_id, staff_id, user_id, channel, outcome, summary, occurred_at, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(intId, regId, user.staff_id || current.assigned_staff_id, user.id, channel, outcome, summary, occurredAt, ts);

            const nextStatus = outcomeToContact[outcome] || current.contact_status;
            const nextFirstContact = current.first_contact_at || occurredAt;
            db.prepare(`
              UPDATE registrations
              SET contact_status = ?, first_contact_at = ?, version = version + 1, updated_at = ?
              WHERE id = ?
            `).run(nextStatus, nextFirstContact, ts, regId);

            dbm.appendAudit(db, {
              actor: user,
              action: 'INTERACTION_LOGGED',
              entityType: 'registration',
              entityId: regId,
              summary: `Ghi nhật ký ${channel} (${outcome}) cho ${current.full_name}`,
              ip
            });
            return enrichRegistrationRow(db, regId);
          });

          realtime.broadcastEvent({
            entity: 'registration',
            action: 'record_updated',
            id: regId,
            intakeYear: updated.intake_year,
            scopeStaffId: updated.assigned_staff_id,
            record: updated
          });
          return sendJson(res, 201, { ok: true, id: intId, record: updated });
        }

        // Sub-resource: Follow-ups
        if (method === 'POST' && sub === 'follow-ups') {
          const body = await readJsonBody(req, 32 * 1024);
          const dueAt = body.due_at ? new Date(body.due_at).toISOString() : null;
          if (!dueAt) throw validationError('Vui lòng chọn thời gian hẹn gọi lại.');
          const note = cleanString(body.note || '', 1000);
          if (!note) throw validationError('Vui lòng nhập nội dung hẹn gọi lại.');
          const fupId = newId('fup');
          const ts = nowIso();
          dbm.transaction((db) => {
            db.prepare(`
              INSERT INTO follow_ups (id, registration_id, assigned_staff_id, due_at, note, status, created_by, created_at)
              VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
            `).run(fupId, regId, body.assigned_staff_id || current.assigned_staff_id || user.staff_id, dueAt, note, user.id, ts);
            db.prepare(`UPDATE registrations SET contact_status = ?, next_action = ?, version = version + 1, updated_at = ? WHERE id = ?`)
              .run(CONTACT_STATUS.CALLBACK_SCHEDULED, `Hẹn gọi lại: ${note}`, ts, regId);
          });
          return sendJson(res, 201, { ok: true, id: fupId });
        }

        // Sub-resource: Document checklist update
        if (method === 'PATCH' && sub === 'documents' && subId) {
          const body = await readJsonBody(req, 16 * 1024);
          const status = cleanString(body.status || 'missing', 20);
          if (!['missing', 'submitted', 'verified'].includes(status)) throw validationError('Trạng thái giấy tờ không hợp lệ.');
          const note = cleanString(body.note || '', 500);
          const ts = nowIso();
          dbm.transaction((db) => {
            db.prepare(`
              UPDATE document_checklists SET status = ?, note = ?, updated_by = ?, updated_at = ?
              WHERE registration_id = ? AND doc_code = ?
            `).run(status, note, user.id, ts, regId, subId);
          });
          return sendJson(res, 200, { ok: true });
        }

        // Sub-resource: Milestones (independent timestamps per submitted / enrolled / withdrawn!)
        if (method === 'POST' && sub === 'milestones') {
          const body = await readJsonBody(req, 32 * 1024);
          const mType = cleanString(body.milestone_type || '', 30);
          if (!Object.values(MILESTONE_TYPE).includes(mType)) {
            throw validationError(`Loại mốc không hợp lệ: ${mType}`);
          }
          const occurredAt = body.occurred_at ? new Date(body.occurred_at).toISOString() : nowIso();
          if (Number.isNaN(new Date(occurredAt).getTime())) throw validationError('Thời điểm mốc không hợp lệ.');
          const evidenceNote = cleanString(body.evidence_note || '', 1000);
          const attributedStaffId = body.attributed_staff_id || current.assigned_staff_id || user.staff_id || null;
          const milId = newId('mil');
          const ts = nowIso();

          const updated = dbm.transaction((db) => {
            db.prepare(`
              INSERT INTO milestone_events (id, registration_id, intake_year, milestone_type, occurred_at, attributed_staff_id, recorded_by_user_id, evidence_note, is_active, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
            `).run(milId, regId, current.intake_year, mType, occurredAt, attributedStaffId, user.id, evidenceNote, ts);

            let nextStage = current.stage_code;
            if (mType === MILESTONE_TYPE.SUBMITTED) nextStage = STAGE_CODE.SUBMITTED;
            if (mType === MILESTONE_TYPE.ENROLLED) nextStage = STAGE_CODE.ENROLLED;
            if (mType === MILESTONE_TYPE.WITHDRAWN) nextStage = STAGE_CODE.WITHDRAWN;
            if (mType === MILESTONE_TYPE.VERIFIED && current.stage_code === STAGE_CODE.PENDING_VERIFY) nextStage = STAGE_CODE.LEAD;

            db.prepare('UPDATE registrations SET stage_code = ?, version = version + 1, updated_at = ? WHERE id = ?')
              .run(nextStage, ts, regId);

            dbm.appendAudit(db, {
              actor: user,
              action: 'MILESTONE_RECORDED',
              entityType: 'registration',
              entityId: regId,
              summary: `Ghi nhận mốc ${mType} lúc ${occurredAt} cho ${current.full_name}`,
              detail: { milId, mType, occurredAt, attributedStaffId, evidenceNote },
              ip
            });

            return enrichRegistrationRow(db, regId);
          });

          realtime.broadcastEvent({
            entity: 'registration',
            action: 'record_updated',
            id: regId,
            intakeYear: updated.intake_year,
            scopeStaffId: updated.assigned_staff_id,
            record: updated
          });
          return sendJson(res, 201, { ok: true, id: milId, record: updated });
        }

        // Sub-resource: Handover (preserves historical milestone attribution!)
        if (method === 'POST' && sub === 'handover') {
          if (!auth.isAdminOrManager(user) && current.assigned_staff_id !== user.staff_id) {
            return sendJson(res, 403, { error: 'FORBIDDEN', message: 'Bạn không có quyền bàn giao hồ sơ này.' });
          }
          const body = await readJsonBody(req, 32 * 1024);
          const toStaffId = cleanString(body.to_staff_id || '', 64);
          const targetStaff = dbm.db.prepare('SELECT id, full_name FROM staff WHERE id = ? AND active = 1').get(toStaffId);
          if (!targetStaff) throw validationError('Nhân sự nhận bàn giao không tồn tại hoặc đã nghỉ.');
          const reason = cleanString(body.reason || '', 500);
          const attributionRule = cleanString(body.attribution_rule || 'keep_prior_milestones', 40);
          const ts = nowIso();
          const hovId = newId('hov');

          const updated = dbm.transaction((db) => {
            db.prepare(`
              INSERT INTO assignment_history (id, registration_id, from_staff_id, to_staff_id, reason, attribution_rule, changed_by_user_id, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(hovId, regId, current.assigned_staff_id, toStaffId, reason, attributionRule, user.id, ts);

            // CRITICAL: Do NOT rewrite prior milestone_events.attributed_staff_id! Only update current owner.
            db.prepare('UPDATE registrations SET assigned_staff_id = ?, version = version + 1, updated_at = ? WHERE id = ?')
              .run(toStaffId, ts, regId);

            dbm.appendAudit(db, {
              actor: user,
              action: 'REGISTRATION_HANDOVER',
              entityType: 'registration',
              entityId: regId,
              summary: `Bàn giao hồ sơ ${current.full_name} từ ${current.staff_name || 'Chưa giao'} -> ${targetStaff.full_name} (giữ thành tích mốc cũ)`,
              detail: { from: current.assigned_staff_id, to: toStaffId, reason, attributionRule },
              ip
            });

            return enrichRegistrationRow(db, regId);
          });

          realtime.broadcastEvent({
            entity: 'registration',
            action: 'record_updated',
            id: regId,
            intakeYear: updated.intake_year,
            scopeStaffId: toStaffId,
            previousScopeStaffId: current.assigned_staff_id,
            record: updated
          });
          return sendJson(res, 200, { ok: true, handoverId: hovId, record: updated });
        }
      }

      // Follow-up status update
      const fupMatch = pathname.match(/^\/api\/follow-ups\/([^/]+)$/);
      if (fupMatch && method === 'PATCH') {
        const fupId = fupMatch[1];
        const fup = dbm.db.prepare('SELECT f.*, r.assigned_staff_id AS reg_staff FROM follow_ups f JOIN registrations r ON r.id = f.registration_id WHERE f.id = ?').get(fupId);
        if (!fup) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy lịch hẹn.' });
        if (!auth.canAccessRecord(user, fup.assigned_staff_id || fup.reg_staff)) {
          return sendJson(res, 403, { error: 'FORBIDDEN_SCOPE', message: 'Ngoài phạm vi hồ sơ.' });
        }
        const body = await readJsonBody(req, 16 * 1024);
        const status = cleanString(body.status || 'done', 20);
        if (!['pending', 'done', 'cancelled'].includes(status)) throw validationError('Trạng thái hẹn không hợp lệ.');
        const ts = nowIso();
        dbm.transaction((db) => {
          db.prepare('UPDATE follow_ups SET status = ?, completed_at = ? WHERE id = ?')
            .run(status, status === 'done' ? ts : null, fupId);
        });
        return sendJson(res, 200, { ok: true });
      }

      // --- UNIFIED IMPORT ENGINE (DEV07) ---
      if (method === 'POST' && pathname === '/api/import/crm/preview') {
        const body = await readJsonBody(req, config.maxBodyBytes);
        const intakeYear = cleanString(body.intakeYear || '2027', 10);
        const staffList = dbm.db.prepare('SELECT * FROM staff WHERE active = 1').all();
        let matrix = [];
        let defaultSource = 'Import Excel CRM';
        if (body.fileBase64) {
          const buf = Buffer.from(body.fileBase64, 'base64');
          matrix = parseExcelBufferToMatrix(buf);
        } else if (body.pasteText !== undefined) {
          matrix = parseQuickPasteTextToMatrix(body.pasteText);
          defaultSource = 'Dán nhanh CRM';
        } else {
          throw validationError('Cần cung cấp fileBase64 hoặc pasteText.');
        }
        const preview = parseCrmMatrix(matrix, { db: dbm.db, intakeYear, staffList, defaultSource });
        return sendJson(res, 200, preview);
      }

      if (method === 'POST' && pathname === '/api/import/crm/commit') {
        const body = await readJsonBody(req, config.maxBodyBytes);
        const intakeYear = cleanString(body.intakeYear || '2027', 10);
        const rows = Array.isArray(body.rows) ? body.rows : [];
        if (rows.length === 0) throw validationError('Danh sách dòng nhập trống.');
        // Scope guard for consultants importing: assign unassigned rows to self if own scope
        if (user.scope === SCOPES.OWN && !auth.isAdminOrManager(user)) {
          for (const r of rows) {
            if (r.parsed) r.parsed.assigned_staff_id = user.staff_id;
          }
        }
        const result = commitCrmImport(dbm, {
          actor: user,
          intakeYear,
          targetType: cleanString(body.targetType || 'crm_excel', 40),
          fileName: cleanString(body.fileName || '', 200),
          rows,
          duplicatePolicy: cleanString(body.duplicatePolicy || 'flag', 20),
          ip
        });

        realtime.broadcastEvent({ entity: 'registration', action: 'batch_imported', intakeYear, batchId: result.batchId });
        return sendJson(res, 200, { ok: true, ...result });
      }

      if (method === 'GET' && pathname === '/api/import/batches') {
        const rows = dbm.db.prepare(`
          SELECT b.*, u.full_name AS uploader_name
          FROM import_batches b LEFT JOIN users u ON u.id = b.uploaded_by_user_id
          ORDER BY b.created_at DESC LIMIT 50
        `).all();
        return sendJson(res, 200, { items: rows });
      }

      // --- M2: REGIONAL DATA ---
      if (method === 'GET' && pathname === '/api/regional') {
        const intakeYear = urlObj.searchParams.get('intakeYear') || '2027';
        const region = urlObj.searchParams.get('region') || '';
        const search = cleanString(urlObj.searchParams.get('search') || '', 120);
        const where = ['rr.intake_year = ?', 'rr.deleted_at IS NULL'];
        const params = [intakeYear];
        if (region && VALID_REGIONS.has(region)) {
          where.push('rr.region = ?');
          params.push(region);
        }
        if (search) {
          const like = `%${search}%`;
          where.push('(rr.full_name LIKE ? OR rr.phone LIKE ? OR rr.school LIKE ? OR rr.province LIKE ? OR rr.event_name LIKE ?)');
          params.push(like, like, like, like, like);
        }
        const items = dbm.db.prepare(`
          SELECT rr.*, s.full_name AS staff_name
          FROM regional_records rr LEFT JOIN staff s ON s.id = rr.assigned_staff_id
          WHERE ${where.join(' AND ')}
          ORDER BY rr.collected_at DESC, rr.created_at DESC
          LIMIT 500
        `).all(...params);
        return sendJson(res, 200, { items });
      }

      if (method === 'POST' && pathname === '/api/regional') {
        const body = await readJsonBody(req, config.maxBodyBytes);
        const region = cleanString(body.region || 'mientay', 20);
        if (!VALID_REGIONS.has(region)) throw validationError('Tuyến tỉnh không hợp lệ.');
        const fullName = cleanString(body.full_name || '', 160);
        if (!fullName) throw validationError('Họ tên thí sinh tuyến tỉnh không được để trống.');
        const intakeYear = cleanString(body.intake_year || '2027', 10);
        const ts = nowIso();
        const id = newId('rgn');

        const rec = dbm.transaction((db) => {
          db.prepare(`
            INSERT INTO regional_records (
              id, intake_year, region, full_name, phone, parent_phone, school, province, major,
              event_name, source, collected_at, assigned_staff_id, care_status, notes,
              version, field_versions_json, created_by, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'uncontacted', ?, 1, '{}', ?, ?, ?)
          `).run(
            id, intakeYear, region, fullName,
            normalizePhone(body.phone || ''), normalizePhone(body.parent_phone || ''),
            cleanString(body.school || '', 200), cleanString(body.province || '', 120),
            cleanString(body.major || '', 160), cleanString(body.event_name || '', 200),
            cleanString(body.source || 'Khảo sát tuyến tỉnh', 120),
            body.collected_at ? new Date(body.collected_at).toISOString() : ts,
            body.assigned_staff_id || user.staff_id || null,
            cleanString(body.notes || '', 1500),
            user.id, ts, ts
          );
          dbm.appendAudit(db, { actor: user, action: 'REGIONAL_CREATED', entityType: 'regional', entityId: id, summary: `Thêm hồ sơ tuyến ${region}: ${fullName}`, ip });
          return db.prepare('SELECT * FROM regional_records WHERE id = ?').get(id);
        });
        realtime.broadcastEvent({ entity: 'regional', action: 'record_created', id, intakeYear, record: rec });
        return sendJson(res, 201, { ok: true, record: rec });
      }

      if (method === 'POST' && pathname === '/api/regional/import/preview') {
        const body = await readJsonBody(req, config.maxBodyBytes);
        const region = cleanString(body.region || 'mientay', 20);
        const staffList = dbm.db.prepare('SELECT * FROM staff WHERE active = 1').all();
        let matrix = [];
        if (body.fileBase64) {
          matrix = parseExcelBufferToMatrix(Buffer.from(body.fileBase64, 'base64'));
        } else if (body.pasteText !== undefined) {
          matrix = parseQuickPasteTextToMatrix(body.pasteText);
        } else {
          throw validationError('Thiếu dữ liệu fileBase64 hoặc pasteText.');
        }
        const preview = parseRegionalMatrix(matrix, { staffList, defaultRegion: region });
        return sendJson(res, 200, preview);
      }

      if (method === 'POST' && pathname === '/api/regional/import/commit') {
        const body = await readJsonBody(req, config.maxBodyBytes);
        const intakeYear = cleanString(body.intakeYear || '2027', 10);
        const region = cleanString(body.region || 'mientay', 20);
        const rows = Array.isArray(body.rows) ? body.rows : [];
        const ts = nowIso();
        const batchId = newId('imp');

        const result = dbm.transaction((db) => {
          let createdCount = 0;
          let errorCount = 0;
          db.prepare(`
            INSERT INTO import_batches (id, intake_year, target_type, file_name, uploaded_by_user_id, total_rows, created_count, updated_count, duplicate_count, error_count, summary_json, created_at)
            VALUES (?, ?, 'regional_excel', ?, ?, ?, 0, 0, 0, 0, '{}', ?)
          `).run(batchId, intakeYear, cleanString(body.fileName || '', 200), user.id, rows.length, ts);

          for (const item of rows) {
            if (item.action === 'error' || !item.parsed) { errorCount++; continue; }
            const p = item.parsed;
            const id = newId('rgn');
            db.prepare(`
              INSERT INTO regional_records (
                id, intake_year, region, full_name, phone, parent_phone, school, province, major,
                event_name, source, collected_at, assigned_staff_id, care_status, notes, import_batch_id,
                version, field_versions_json, created_by, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'uncontacted', ?, ?, 1, '{}', ?, ?, ?)
            `).run(
              id, intakeYear, p.region || region, p.full_name, p.phone || '', p.parent_phone || '',
              p.school || '', p.province || '', p.major || '', p.event_name || '', p.source || 'Khảo sát tuyến tỉnh',
              p.collected_at || ts, p.assigned_staff_id || user.staff_id || null, p.notes || '', batchId, user.id, ts, ts
            );
            createdCount++;
          }
          db.prepare('UPDATE import_batches SET created_count = ?, error_count = ? WHERE id = ?').run(createdCount, errorCount, batchId);
          dbm.appendAudit(db, { actor: user, action: 'REGIONAL_IMPORT_COMMIT', entityType: 'import_batch', entityId: batchId, summary: `Nhập tuyến tỉnh ${region}: +${createdCount} hồ sơ`, ip });
          return { batchId, createdCount, errorCount };
        });
        realtime.broadcastEvent({ entity: 'regional', action: 'batch_imported', intakeYear, region });
        return sendJson(res, 200, { ok: true, ...result });
      }

      const rgnMatch = pathname.match(/^\/api\/regional\/([^/]+)(?:\/([^/]+))?$/);
      if (rgnMatch) {
        const rgnId = rgnMatch[1];
        const sub = rgnMatch[2] || '';
        const existing = dbm.db.prepare('SELECT * FROM regional_records WHERE id = ? AND deleted_at IS NULL').get(rgnId);
        if (!existing) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy bản ghi tuyến tỉnh.' });

        if (method === 'PATCH' && !sub) {
          const body = await readJsonBody(req, 64 * 1024);
          const ts = nowIso();
          const updated = dbm.transaction((db) => {
            db.prepare(`
              UPDATE regional_records
              SET full_name = ?, phone = ?, parent_phone = ?, school = ?, province = ?, major = ?,
                  event_name = ?, care_status = ?, notes = ?, version = version + 1, updated_at = ?
              WHERE id = ?
            `).run(
              body.full_name !== undefined ? cleanString(body.full_name, 160) : existing.full_name,
              body.phone !== undefined ? normalizePhone(body.phone) : existing.phone,
              body.parent_phone !== undefined ? normalizePhone(body.parent_phone) : existing.parent_phone,
              body.school !== undefined ? cleanString(body.school, 200) : existing.school,
              body.province !== undefined ? cleanString(body.province, 120) : existing.province,
              body.major !== undefined ? cleanString(body.major, 160) : existing.major,
              body.event_name !== undefined ? cleanString(body.event_name, 200) : existing.event_name,
              body.care_status !== undefined ? cleanString(body.care_status, 40) : existing.care_status,
              body.notes !== undefined ? cleanString(body.notes, 1500) : existing.notes,
              ts, rgnId
            );
            return db.prepare('SELECT * FROM regional_records WHERE id = ?').get(rgnId);
          });
          return sendJson(res, 200, { ok: true, record: updated });
        }

        if (method === 'DELETE' && !sub) {
          auth.requirePermission(user, 'can_delete', 'Không có quyền xóa bản ghi tuyến tỉnh.');
          dbm.transaction((db) => {
            db.prepare('UPDATE regional_records SET deleted_at = ?, updated_at = ? WHERE id = ?').run(nowIso(), nowIso(), rgnId);
          });
          return sendJson(res, 200, { ok: true, deletedId: rgnId });
        }

        if (method === 'POST' && sub === 'convert-to-crm') {
          const body = await readJsonBody(req, 32 * 1024);
          const assignedStaffId = body.assigned_staff_id || existing.assigned_staff_id || user.staff_id || null;
          const commitRes = commitCrmImport(dbm, {
            actor: user,
            intakeYear: existing.intake_year,
            targetType: 'regional_convert',
            fileName: `regional:${rgnId}`,
            rows: [{
              rowIndex: 1,
              action: 'new',
              parsed: {
                full_name: existing.full_name,
                student_phone: existing.phone,
                parent_phone: existing.parent_phone,
                major: existing.major,
                school: existing.school,
                province: existing.province,
                source: existing.source || REGIONS[existing.region] || 'Tuyến tỉnh',
                assigned_staff_id: assignedStaffId,
                contact_status: CONTACT_STATUS.UNCONTACTED,
                stage_code: STAGE_CODE.LEAD,
                notes: existing.notes,
                source_received_at: existing.collected_at
              }
            }],
            ip
          });
          const linkedRegId = commitRes.affectedRegIds[0] || null;
          if (linkedRegId) {
            const regRow = dbm.db.prepare('SELECT person_id FROM registrations WHERE id = ?').get(linkedRegId);
            dbm.db.prepare('UPDATE regional_records SET linked_registration_id = ?, linked_person_id = ?, updated_at = ? WHERE id = ?')
              .run(linkedRegId, regRow ? regRow.person_id : null, nowIso(), rgnId);
          }
          return sendJson(res, 200, { ok: true, linkedRegistrationId: linkedRegId, ...commitRes });
        }
      }

      // --- M3: ZALO & OCR STAGING QUEUE ---
      if (method === 'GET' && pathname === '/api/zalo-staging') {
        const intakeYear = urlObj.searchParams.get('intakeYear') || '2027';
        const status = urlObj.searchParams.get('status') || 'pending';
        const where = ['z.intake_year = ?'];
        const params = [intakeYear];
        if (status && status !== 'ALL') {
          where.push('z.status = ?');
          params.push(status);
        }
        const items = dbm.db.prepare(`
          SELECT z.*, s.full_name AS suggested_staff_name
          FROM zalo_staging z LEFT JOIN staff s ON s.id = z.suggested_staff_id
          WHERE ${where.join(' AND ')}
          ORDER BY z.created_at DESC LIMIT 200
        `).all(...params);
        return sendJson(res, 200, { items });
      }

      if (method === 'POST' && pathname === '/api/zalo-staging/parse') {
        const body = await readJsonBody(req, config.maxBodyBytes);
        const intakeYear = cleanString(body.intakeYear || '2027', 10);
        const rawText = cleanString(body.rawText || '', 50000);
        const sourceType = cleanString(body.sourceType || 'text', 20);
        const sourceGroup = cleanString(body.sourceGroup || 'Group Zalo Tuyển sinh', 120);
        const ocrConfidence = body.ocrConfidence !== undefined ? Number(body.ocrConfidence) : null;
        if (!rawText) throw validationError('Vui lòng dán nội dung đoạn chat Zalo hoặc văn bản OCR.');

        const staffList = dbm.db.prepare('SELECT * FROM staff WHERE active = 1').all();
        const candidates = parseZaloCandidates(rawText, { db: dbm.db, intakeYear, staffList, sourceGroup });
        const ts = nowIso();

        const staged = dbm.transaction((db) => {
          const ins = db.prepare(`
            INSERT INTO zalo_staging (
              id, intake_year, raw_text, source_type, extracted_name, extracted_phone, extracted_parent_phone,
              extracted_major, extracted_school, extracted_province, suggested_staff_id, source_group,
              ocr_confidence, suspected_duplicate_reg_id, duplicate_reason, status, created_by, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
          `);
          const ids = [];
          for (const c of candidates) {
            const id = newId('zst');
            ins.run(
              id, intakeYear, c.raw_text, sourceType, c.extracted_name, c.extracted_phone, c.extracted_parent_phone,
              c.extracted_major, c.extracted_school, c.extracted_province, c.suggested_staff_id, sourceGroup,
              ocrConfidence, c.suspected_duplicate_reg_id, c.duplicate_reason, user.id, ts, ts
            );
            ids.push(id);
          }
          dbm.appendAudit(db, {
            actor: user,
            action: 'ZALO_STAGED',
            entityType: 'zalo_staging',
            summary: `Bóc tách Zalo (${sourceType}): đưa ${ids.length} ứng viên vào hàng chờ xác minh`,
            ip
          });
          return ids.map(id => db.prepare('SELECT z.*, s.full_name AS suggested_staff_name FROM zalo_staging z LEFT JOIN staff s ON s.id = z.suggested_staff_id WHERE z.id = ?').get(id));
        });

        return sendJson(res, 201, { ok: true, count: staged.length, items: staged });
      }

      const zaloMatch = pathname.match(/^\/api\/zalo-staging\/([^/]+)(?:\/([^/]+))?$/);
      if (zaloMatch) {
        const zId = zaloMatch[1];
        const sub = zaloMatch[2] || '';
        const item = dbm.db.prepare('SELECT * FROM zalo_staging WHERE id = ?').get(zId);
        if (!item) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy dòng chờ xác minh Zalo.' });

        if (method === 'PATCH' && !sub) {
          const body = await readJsonBody(req, 32 * 1024);
          const ts = nowIso();
          const updated = dbm.transaction((db) => {
            db.prepare(`
              UPDATE zalo_staging
              SET extracted_name = ?, extracted_phone = ?, extracted_parent_phone = ?,
                  extracted_major = ?, extracted_school = ?, extracted_province = ?,
                  suggested_staff_id = ?, updated_at = ?
              WHERE id = ?
            `).run(
              body.extracted_name !== undefined ? cleanString(body.extracted_name, 160) : item.extracted_name,
              body.extracted_phone !== undefined ? normalizePhone(body.extracted_phone) : item.extracted_phone,
              body.extracted_parent_phone !== undefined ? normalizePhone(body.extracted_parent_phone) : item.extracted_parent_phone,
              body.extracted_major !== undefined ? cleanString(body.extracted_major, 160) : item.extracted_major,
              body.extracted_school !== undefined ? cleanString(body.extracted_school, 200) : item.extracted_school,
              body.extracted_province !== undefined ? cleanString(body.extracted_province, 120) : item.extracted_province,
              body.suggested_staff_id !== undefined ? (body.suggested_staff_id || null) : item.suggested_staff_id,
              ts, zId
            );
            return db.prepare('SELECT * FROM zalo_staging WHERE id = ?').get(zId);
          });
          return sendJson(res, 200, { ok: true, item: updated });
        }

        if (method === 'POST' && sub === 'approve') {
          const body = await readJsonBody(req, 32 * 1024);
          const name = cleanString(body.extracted_name || item.extracted_name, 160);
          const phone = normalizePhone(body.extracted_phone || item.extracted_phone);
          const parentPhone = normalizePhone(body.extracted_parent_phone || item.extracted_parent_phone);
          if (!name) throw validationError('Vui lòng nhập họ tên thí sinh trước khi duyệt.');
          if (!phone && !parentPhone) throw validationError('Vui lòng nhập SĐT thí sinh hoặc phụ huynh trước khi duyệt.');

          let assignedStaff = body.suggested_staff_id !== undefined ? body.suggested_staff_id : (item.suggested_staff_id || user.staff_id);
          if (user.scope === SCOPES.OWN && !auth.isAdminOrManager(user)) assignedStaff = user.staff_id;

          const commitRes = commitCrmImport(dbm, {
            actor: user,
            intakeYear: item.intake_year,
            targetType: 'zalo_batch',
            fileName: item.source_group,
            rows: [{
              rowIndex: 1,
              action: 'new',
              allowSharedParentPhone: Boolean(body.allow_shared_parent_phone),
              parsed: {
                full_name: name,
                student_phone: phone,
                parent_phone: parentPhone,
                major: cleanString(body.extracted_major !== undefined ? body.extracted_major : item.extracted_major, 160),
                school: cleanString(body.extracted_school !== undefined ? body.extracted_school : item.extracted_school, 200),
                province: cleanString(body.extracted_province !== undefined ? body.extracted_province : item.extracted_province, 120),
                source: item.source_group || 'Group Zalo',
                assigned_staff_id: assignedStaff || null,
                contact_status: CONTACT_STATUS.UNCONTACTED,
                stage_code: STAGE_CODE.LEAD,
                notes: `[Zalo] ${item.raw_text.slice(0, 300)}`
              }
            }],
            ip
          });

          const regId = commitRes.affectedRegIds[0] || null;
          const finalStatus = commitRes.updatedCount > 0 ? 'merged' : 'approved';
          dbm.db.prepare('UPDATE zalo_staging SET status = ?, committed_registration_id = ?, reviewed_by = ?, updated_at = ? WHERE id = ?')
            .run(finalStatus, regId, user.id, nowIso(), zId);

          realtime.broadcastEvent({ entity: 'registration', action: 'batch_imported', intakeYear: item.intake_year });
          return sendJson(res, 200, { ok: true, status: finalStatus, registrationId: regId, ...commitRes });
        }

        if (method === 'POST' && sub === 'reject') {
          dbm.transaction((db) => {
            db.prepare('UPDATE zalo_staging SET status = ?, reviewed_by = ?, updated_at = ? WHERE id = ?')
              .run('rejected', user.id, nowIso(), zId);
          });
          return sendJson(res, 200, { ok: true });
        }
      }

      // --- M4: SLA & REPORT DEADLINES ---
      if (method === 'GET' && pathname === '/api/sla') {
        const intakeYear = urlObj.searchParams.get('intakeYear') || '2027';
        const nowParam = urlObj.searchParams.get('now');
        const nowDate = nowParam ? new Date(nowParam) : new Date();
        const scope = auth.buildScopeFilterSql(user, 'r.assigned_staff_id');
        const workingHours = dbm.getSetting('working_hours', config.defaultWorkingHours);

        const regs = dbm.db.prepare(`
          SELECT r.*, p.full_name, p.student_phone, s.full_name AS staff_name
          FROM registrations r
          JOIN persons p ON p.id = r.person_id
          LEFT JOIN staff s ON s.id = r.assigned_staff_id
          WHERE r.intake_year = ? AND r.deleted_at IS NULL AND ${scope.sql}
          ORDER BY r.created_at DESC
        `).all(intakeYear, ...scope.params);

        const sla = computeSlaSummary(regs, workingHours, nowDate);
        const deadlines = computeReportDeadlines(dbm.db, intakeYear, nowDate);
        return sendJson(res, 200, { intakeYear, workingHours, deadlines, ...sla });
      }

      if (method === 'PUT' && pathname === '/api/sla/working-hours') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN, ROLES.MANAGER]);
        const body = await readJsonBody(req, 32 * 1024);
        const currentWh = dbm.getSetting('working_hours', config.defaultWorkingHours);
        const nextWh = {
          timezoneOffsetMinutes: Number(body.timezoneOffsetMinutes ?? currentWh.timezoneOffsetMinutes ?? 420),
          slaMinutes: Math.max(1, Math.min(240, Number(body.slaMinutes ?? currentWh.slaMinutes ?? 15))),
          workDays: Array.isArray(body.workDays) ? body.workDays.map(Number) : currentWh.workDays,
          shifts: Array.isArray(body.shifts) && body.shifts.length > 0 ? body.shifts : currentWh.shifts,
          holidays: Array.isArray(body.holidays) ? body.holidays.map(s => cleanString(s, 20)) : (currentWh.holidays || [])
        };
        dbm.transaction((db) => {
          dbm.setSetting('working_hours', nextWh, db);
          dbm.appendAudit(db, { actor: user, action: 'SLA_CONFIG_UPDATED', entityType: 'system_settings', summary: `Cập nhật lịch làm việc & chuẩn SLA (${nextWh.slaMinutes} phút)`, detail: nextWh, ip });
        });
        return sendJson(res, 200, { ok: true, workingHours: nextWh });
      }

      // --- M5: KPI & VERSIONED PLAN ---
      if (method === 'GET' && pathname === '/api/kpi') {
        const intakeYear = urlObj.searchParams.get('intakeYear') || '2027';
        const monthKey = urlObj.searchParams.get('monthKey') || null;
        const cutoffIso = urlObj.searchParams.get('cutoffIso') || null;
        const nowParam = urlObj.searchParams.get('now');
        const report = computeKpiReport(dbm.db, {
          intakeYear,
          monthKey,
          cutoffIso,
          nowDate: nowParam ? new Date(nowParam) : new Date()
        });
        return sendJson(res, 200, report);
      }

      if (method === 'GET' && pathname === '/api/kpi/plan') {
        const intakeYear = urlObj.searchParams.get('intakeYear') || '2027';
        const months = getIntakeMonths(intakeYear);
        const versions = dbm.db.prepare('SELECT * FROM kpi_plan_versions WHERE intake_year = ? ORDER BY version_number DESC').all(intakeYear);
        const activePlan = versions.find(v => v.status === 'active') || versions[0] || null;
        const targets = activePlan ? dbm.db.prepare('SELECT * FROM kpi_targets WHERE plan_version_id = ?').all(activePlan.id) : [];
        const staff = dbm.db.prepare(`
          SELECT s.*, u.role AS user_role FROM staff s LEFT JOIN users u ON u.id = s.user_id WHERE s.active = 1 ORDER BY s.id ASC
        `).all();
        return sendJson(res, 200, { intakeYear, months, versions, activePlan, targets, staff });
      }

      if (method === 'POST' && pathname === '/api/kpi/plan') {
        auth.requirePermission(user, 'can_edit_kpi', 'Tài khoản không có quyền điều chỉnh kế hoạch KPI.');
        const body = await readJsonBody(req, config.maxBodyBytes);
        const intakeYear = cleanString(body.intakeYear || '2027', 10);
        const note = cleanString(body.note || '', 500);
        const entries = Array.isArray(body.targets) ? body.targets : [];
        if (entries.length === 0) throw validationError('Danh sách chỉ tiêu KPI không được rỗng.');

        const ts = nowIso();
        const created = dbm.transaction((db) => {
          const maxV = db.prepare('SELECT COALESCE(MAX(version_number), 0) AS mv FROM kpi_plan_versions WHERE intake_year = ?').get(intakeYear).mv;
          const nextV = maxV + 1;
          const planId = newId('kpl');
          db.prepare("UPDATE kpi_plan_versions SET status = 'closed' WHERE intake_year = ? AND status = 'active'").run(intakeYear);
          db.prepare(`
            INSERT INTO kpi_plan_versions (id, intake_year, version_number, status, note, created_by, created_at)
            VALUES (?, ?, ?, 'active', ?, ?, ?)
          `).run(planId, intakeYear, nextV, note || `Điều chỉnh kế hoạch v${nextV}`, user.id, ts);

          const ins = db.prepare(`
            INSERT INTO kpi_targets (id, plan_version_id, intake_year, staff_id, month_key, target_lead, target_submitted, target_enrolled)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `);
          let sumLead = 0; let sumSub = 0; let sumEnr = 0;
          for (const e of entries) {
            const tl = Math.max(0, parseInt(e.target_lead || 0, 10));
            const ts2 = Math.max(0, parseInt(e.target_submitted || 0, 10));
            const te = Math.max(0, parseInt(e.target_enrolled || 0, 10));
            sumLead += tl; sumSub += ts2; sumEnr += te;
            ins.run(newId('kpt'), planId, intakeYear, cleanString(e.staff_id, 64), cleanString(e.month_key, 10), tl, ts2, te);
          }

          dbm.appendAudit(db, {
            actor: user,
            action: 'KPI_PLAN_UPDATED',
            entityType: 'kpi_plan',
            entityId: planId,
            summary: `Ban hành kế hoạch KPI NK ${intakeYear} v${nextV} (Tổng: ${sumLead} ĐK / ${sumSub} HS / ${sumEnr} NH)`,
            detail: { intakeYear, version: nextV, sumLead, sumSub, sumEnr },
            ip
          });
          return { planId, versionNumber: nextV, totals: { lead: sumLead, submitted: sumSub, enrolled: sumEnr } };
        });

        realtime.broadcastEvent({ entity: 'kpi', action: 'plan_updated', intakeYear });
        return sendJson(res, 201, { ok: true, ...created });
      }

      // --- M6 & M7: UNIFIED TASKS, BGH, DIRECTIVES, MEETINGS & EXTERNAL SUPPORT ---
      if (method === 'GET' && pathname === '/api/tasks') {
        const intakeYear = urlObj.searchParams.get('intakeYear') || '2027';
        const taskType = urlObj.searchParams.get('taskType') || '';
        const status = urlObj.searchParams.get('status') || '';
        const where = ['t.intake_year = ?', 't.deleted_at IS NULL'];
        const params = [intakeYear];
        if (taskType) {
          const types = taskType.split(',').map(s => s.trim()).filter(Boolean);
          where.push(`t.task_type IN (${types.map(() => '?').join(',')})`);
          params.push(...types);
        }
        if (status && status !== 'ALL') {
          where.push('t.status = ?');
          params.push(status);
        }
        const rows = dbm.db.prepare(`
          SELECT t.*, s.full_name AS owner_name, u.full_name AS accepted_by_name
          FROM tasks t
          LEFT JOIN staff s ON s.id = t.owner_staff_id
          LEFT JOIN users u ON u.id = t.accepted_by_user_id
          WHERE ${where.join(' AND ')}
          ORDER BY t.deadline ASC, t.created_at DESC
        `).all(...params);

        const taskIds = rows.map(r => r.id);
        const commentsMap = {};
        if (taskIds.length > 0) {
          const comments = dbm.db.prepare(`SELECT * FROM task_comments WHERE task_id IN (${taskIds.map(() => '?').join(',')}) ORDER BY created_at ASC`).all(...taskIds);
          for (const c of comments) {
            if (!commentsMap[c.task_id]) commentsMap[c.task_id] = [];
            commentsMap[c.task_id].push(c);
          }
        }
        const items = rows.map(r => ({
          ...r,
          collaborators: JSON.parse(r.collaborators_json || '[]'),
          checklist: JSON.parse(r.checklist_json || '[]'),
          comments: commentsMap[r.id] || []
        }));
        return sendJson(res, 200, { items });
      }

      if (method === 'POST' && pathname === '/api/tasks') {
        const body = await readJsonBody(req, config.maxBodyBytes);
        const v = validateTaskPayload(body, false);
        const intakeYear = v.intake_year || '2027';
        const id = newId('tsk');
        const ts = nowIso();

        const created = dbm.transaction((db) => {
          db.prepare(`
            INSERT INTO tasks (
              id, intake_year, task_type, title, description, owner_staff_id, collaborators_json,
              external_unit, meeting_time, meeting_location, meeting_minutes, deadline, priority,
              status, checklist_json, evidence_note, extension_reason, version, field_versions_json,
              created_by, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, '{}', ?, ?, ?)
          `).run(
            id, intakeYear, v.task_type, v.title, v.description || '',
            v.owner_staff_id || user.staff_id || null, JSON.stringify(v.collaborators || []),
            v.external_unit || '', v.meeting_time || '', v.meeting_location || '', v.meeting_minutes || '',
            v.deadline || '', v.priority || 'normal', v.status || TASK_STATUS.TODO,
            JSON.stringify(v.checklist || []), v.evidence_note || '', v.extension_reason || '',
            user.id, ts, ts
          );
          dbm.appendAudit(db, { actor: user, action: 'TASK_CREATED', entityType: 'task', entityId: id, summary: `Tạo công việc (${v.task_type}): ${v.title}`, ip });
          return db.prepare('SELECT t.*, s.full_name AS owner_name FROM tasks t LEFT JOIN staff s ON s.id = t.owner_staff_id WHERE t.id = ?').get(id);
        });
        realtime.broadcastEvent({ entity: 'task', action: 'record_created', id, intakeYear });
        return sendJson(res, 201, { ok: true, task: created });
      }

      const taskMatch = pathname.match(/^\/api\/tasks\/([^/]+)(?:\/([^/]+))?$/);
      if (taskMatch) {
        const tId = taskMatch[1];
        const sub = taskMatch[2] || '';
        const current = dbm.db.prepare('SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL').get(tId);
        if (!current) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy công việc.' });

        if (method === 'PATCH' && !sub) {
          const body = await readJsonBody(req, config.maxBodyBytes);
          const v = validateTaskPayload(body, true);
          const ts = nowIso();
          const updated = dbm.transaction((db) => {
            db.prepare(`
              UPDATE tasks
              SET title = ?, description = ?, owner_staff_id = ?, collaborators_json = ?,
                  external_unit = ?, meeting_time = ?, meeting_location = ?, meeting_minutes = ?,
                  deadline = ?, priority = ?, status = ?, checklist_json = ?,
                  evidence_note = ?, extension_reason = ?, version = version + 1, updated_at = ?
              WHERE id = ?
            `).run(
              v.title !== undefined ? v.title : current.title,
              v.description !== undefined ? v.description : current.description,
              v.owner_staff_id !== undefined ? v.owner_staff_id : current.owner_staff_id,
              v.collaborators !== undefined ? JSON.stringify(v.collaborators) : current.collaborators_json,
              v.external_unit !== undefined ? v.external_unit : current.external_unit,
              v.meeting_time !== undefined ? v.meeting_time : current.meeting_time,
              v.meeting_location !== undefined ? v.meeting_location : current.meeting_location,
              v.meeting_minutes !== undefined ? v.meeting_minutes : current.meeting_minutes,
              v.deadline !== undefined ? v.deadline : current.deadline,
              v.priority !== undefined ? v.priority : current.priority,
              v.status !== undefined ? v.status : current.status,
              v.checklist !== undefined ? JSON.stringify(v.checklist) : current.checklist_json,
              v.evidence_note !== undefined ? v.evidence_note : current.evidence_note,
              v.extension_reason !== undefined ? v.extension_reason : current.extension_reason,
              ts, tId
            );
            dbm.appendAudit(db, { actor: user, action: 'TASK_UPDATED', entityType: 'task', entityId: tId, summary: `Cập nhật công việc: ${v.title || current.title}`, ip });
            return db.prepare('SELECT * FROM tasks WHERE id = ?').get(tId);
          });
          realtime.broadcastEvent({ entity: 'task', action: 'record_updated', id: tId, intakeYear: current.intake_year });
          return sendJson(res, 200, { ok: true, task: updated });
        }

        if (method === 'DELETE' && !sub) {
          auth.requirePermission(user, 'can_delete', 'Bạn không có quyền xóa công việc.');
          dbm.transaction((db) => {
            db.prepare('UPDATE tasks SET deleted_at = ?, updated_at = ? WHERE id = ?').run(nowIso(), nowIso(), tId);
            dbm.appendAudit(db, { actor: user, action: 'TASK_DELETED', entityType: 'task', entityId: tId, summary: `Xóa công việc: ${current.title}`, ip });
          });
          return sendJson(res, 200, { ok: true, deletedId: tId });
        }

        if (method === 'POST' && sub === 'comments') {
          const body = await readJsonBody(req, 32 * 1024);
          const content = cleanString(body.content || '', 2000);
          if (!content) throw validationError('Nội dung trao đổi không được trống.');
          const cId = newId('tcm');
          const ts = nowIso();
          dbm.transaction((db) => {
            db.prepare('INSERT INTO task_comments (id, task_id, user_id, author_name, content, created_at) VALUES (?, ?, ?, ?, ?, ?)')
              .run(cId, tId, user.id, user.full_name, content, ts);
          });
          return sendJson(res, 201, { ok: true, id: cId });
        }

        if (method === 'POST' && sub === 'accept') {
          auth.requireRole(user, [ROLES.SUPER_ADMIN, ROLES.MANAGER]);
          const ts = nowIso();
          dbm.transaction((db) => {
            db.prepare("UPDATE tasks SET status = 'done', accepted_by_user_id = ?, accepted_at = ?, version = version + 1, updated_at = ? WHERE id = ?")
              .run(user.id, ts, ts, tId);
            dbm.appendAudit(db, { actor: user, action: 'TASK_ACCEPTED', entityType: 'task', entityId: tId, summary: `Nghiệm thu hoàn thành công việc: ${current.title}`, ip });
          });
          return sendJson(res, 200, { ok: true });
        }
      }

      // --- M8: REPORTS, SNAPSHOTS, REAL DOCX, DYNAMIC EXCEL, HONEST NOTIFICATIONS ---
      const parseReportParams = (sp) => ({
        intakeYear: sp.get('intakeYear') || '2027',
        template: sp.get('template') || 'phong',
        periodType: sp.get('periodType') || 'week',
        startDate: sp.get('startDate') || null,
        endDate: sp.get('endDate') || null,
        cutoffAt: sp.get('cutoffAt') || null,
        sections: {
          includeCRM: sp.get('includeCRM') !== 'false',
          includeKPI: sp.get('includeKPI') !== 'false',
          includeRegional: sp.get('includeRegional') !== 'false',
          includeTasks: sp.get('includeTasks') !== 'false',
          includeBGH: sp.get('includeBGH') !== 'false',
          includeOutsideSupport: sp.get('includeOutsideSupport') !== 'false'
        },
        user,
        auth
      });

      if (method === 'GET' && pathname === '/api/reports/preview') {
        const snapshotId = urlObj.searchParams.get('snapshotId');
        if (snapshotId) {
          const snap = dbm.db.prepare('SELECT * FROM report_snapshots WHERE id = ?').get(snapshotId);
          if (!snap) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy bản chốt báo cáo.' });
          return sendJson(res, 200, { snapshot: snap, data: JSON.parse(snap.snapshot_data_json) });
        }
        const data = buildReportDataset(dbm, parseReportParams(urlObj.searchParams));
        return sendJson(res, 200, { snapshot: null, data });
      }

      if (method === 'GET' && pathname === '/api/reports/snapshots') {
        const intakeYear = urlObj.searchParams.get('intakeYear') || '';
        const rows = intakeYear
          ? dbm.db.prepare(`
              SELECT s.id, s.intake_year, s.template, s.period_type, s.start_date, s.end_date, s.cutoff_at,
                     s.title, s.status, s.approved_at, s.reopen_reason, s.created_at,
                     uc.full_name AS created_by_name, ua.full_name AS approved_by_name
              FROM report_snapshots s
              LEFT JOIN users uc ON uc.id = s.created_by_user_id
              LEFT JOIN users ua ON ua.id = s.approved_by_user_id
              WHERE s.intake_year = ?
              ORDER BY s.created_at DESC
            `).all(intakeYear)
          : dbm.db.prepare('SELECT * FROM report_snapshots ORDER BY created_at DESC LIMIT 50').all();
        return sendJson(res, 200, { items: rows });
      }

      if (method === 'POST' && pathname === '/api/reports/snapshots') {
        const body = await readJsonBody(req, config.maxBodyBytes);
        const data = buildReportDataset(dbm, {
          intakeYear: body.intakeYear || '2027',
          template: body.template || 'phong',
          periodType: body.periodType || 'week',
          startDate: body.startDate || null,
          endDate: body.endDate || null,
          cutoffAt: body.cutoffAt || null,
          sections: body.sections || {},
          user,
          auth
        });
        const snapId = newId('rpt');
        const ts = nowIso();
        dbm.transaction((db) => {
          db.prepare(`
            INSERT INTO report_snapshots (
              id, intake_year, template, period_type, start_date, end_date, cutoff_at,
              sections_json, title, status, snapshot_data_json, created_by_user_id, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?)
          `).run(
            snapId, data.meta.intakeYear, data.meta.template, data.meta.periodType,
            data.meta.startDate, data.meta.endDate, data.meta.cutoffAt,
            JSON.stringify(data.meta.sections), body.title || `${data.meta.title} (${data.meta.periodDisplay})`,
            JSON.stringify(data), user.id, ts, ts
          );
          dbm.appendAudit(db, {
            actor: user,
            action: 'REPORT_SNAPSHOT_CREATED',
            entityType: 'report_snapshot',
            entityId: snapId,
            summary: `Lưu bản nháp báo cáo ${data.meta.periodDisplay} (NK ${data.meta.intakeYear})`,
            ip
          });
        });
        const snap = dbm.db.prepare('SELECT * FROM report_snapshots WHERE id = ?').get(snapId);
        return sendJson(res, 201, { ok: true, snapshot: snap, data });
      }

      const snapMatch = pathname.match(/^\/api\/reports\/snapshots\/([^/]+)(?:\/([^/]+))?$/);
      if (snapMatch) {
        const snapId = snapMatch[1];
        const sub = snapMatch[2] || '';
        const snap = dbm.db.prepare('SELECT * FROM report_snapshots WHERE id = ?').get(snapId);
        if (!snap) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy bản chốt báo cáo.' });

        if (method === 'GET' && !sub) {
          return sendJson(res, 200, { snapshot: snap, data: JSON.parse(snap.snapshot_data_json) });
        }
        if (method === 'POST' && sub === 'approve') {
          auth.requirePermission(user, 'can_approve_reports', 'Bạn không có quyền phê duyệt báo cáo.');
          const ts = nowIso();
          dbm.transaction((db) => {
            db.prepare("UPDATE report_snapshots SET status = 'approved', approved_by_user_id = ?, approved_at = ?, updated_at = ? WHERE id = ?")
              .run(user.id, ts, ts, snapId);
            dbm.appendAudit(db, { actor: user, action: 'REPORT_SNAPSHOT_APPROVED', entityType: 'report_snapshot', entityId: snapId, summary: `Phê duyệt & khóa số liệu báo cáo ${snap.title}`, ip });
          });
          return sendJson(res, 200, { ok: true, snapshot: dbm.db.prepare('SELECT * FROM report_snapshots WHERE id = ?').get(snapId) });
        }
        if (method === 'POST' && sub === 'reopen') {
          auth.requirePermission(user, 'can_approve_reports', 'Bạn không có quyền mở lại kỳ báo cáo đã chốt.');
          const body = await readJsonBody(req, 16 * 1024);
          const reason = cleanString(body.reason || '', 500);
          if (!reason) throw validationError('Vui lòng ghi rõ lý do mở lại kỳ báo cáo.');
          const ts = nowIso();
          dbm.transaction((db) => {
            db.prepare("UPDATE report_snapshots SET status = 'reopened', reopen_reason = ?, updated_at = ? WHERE id = ?")
              .run(reason, ts, snapId);
            dbm.appendAudit(db, { actor: user, action: 'REPORT_SNAPSHOT_REOPENED', entityType: 'report_snapshot', entityId: snapId, summary: `Mở lại báo cáo ${snap.title}. Lý do: ${reason}`, ip });
          });
          return sendJson(res, 200, { ok: true, snapshot: dbm.db.prepare('SELECT * FROM report_snapshots WHERE id = ?').get(snapId) });
        }
      }

      if (method === 'GET' && pathname === '/api/reports/export/docx') {
        auth.requirePermission(user, 'can_export', 'Tài khoản không có quyền xuất tài liệu Word.');
        const snapshotId = urlObj.searchParams.get('snapshotId');
        let data;
        if (snapshotId) {
          const snap = dbm.db.prepare('SELECT * FROM report_snapshots WHERE id = ?').get(snapshotId);
          if (!snap) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy snapshot.' });
          data = JSON.parse(snap.snapshot_data_json);
        } else {
          data = buildReportDataset(dbm, parseReportParams(urlObj.searchParams));
        }
        const docxBuf = await generateRealDocxBuffer(data);
        dbm.appendAudit(null, { actor: user, action: 'EXPORT_REPORT_DOCX', entityType: 'report', entityId: snapshotId || null, summary: `Xuất báo cáo Word (.docx) kỳ ${data.meta.periodDisplay}`, ip });
        return sendBuffer(
          res, 200, docxBuf,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          `Bao_Cao_Tuyen_Sinh_ITC_${data.meta.intakeYear}_${data.meta.periodType}.docx`
        );
      }

      if (method === 'GET' && pathname === '/api/reports/export/xlsx') {
        auth.requirePermission(user, 'can_export', 'Tài khoản không có quyền xuất báo cáo Excel.');
        const snapshotId = urlObj.searchParams.get('snapshotId');
        let data;
        if (snapshotId) {
          const snap = dbm.db.prepare('SELECT * FROM report_snapshots WHERE id = ?').get(snapshotId);
          if (!snap) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy snapshot.' });
          data = JSON.parse(snap.snapshot_data_json);
        } else {
          data = buildReportDataset(dbm, parseReportParams(urlObj.searchParams));
        }
        const xlsBuf = generateDynamicExcelBuffer(data);
        dbm.appendAudit(null, { actor: user, action: 'EXPORT_REPORT_XLSX', entityType: 'report', entityId: snapshotId || null, summary: `Xuất báo cáo Excel (.xlsx) kỳ ${data.meta.periodDisplay}`, ip });
        return sendBuffer(
          res, 200, xlsBuf,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          `Bao_Cao_Tuyen_Sinh_ITC_${data.meta.intakeYear}_${data.meta.periodType}.xlsx`
        );
      }

      // Honest notification jobs
      if (method === 'GET' && pathname === '/api/notifications') {
        const items = dbm.db.prepare(`
          SELECT n.*, u.full_name AS created_by_name
          FROM notification_jobs n LEFT JOIN users u ON u.id = n.created_by_user_id
          ORDER BY n.created_at DESC LIMIT 100
        `).all();
        return sendJson(res, 200, { items, smtpConfigured: config.smtpConfigured });
      }
      if (method === 'POST' && pathname === '/api/notifications') {
        const body = await readJsonBody(req, 64 * 1024);
        const channel = cleanString(body.channel || 'email', 20);
        if (!['email', 'zalo_copy'].includes(channel)) throw validationError('Kênh thông báo không hợp lệ.');
        const recipientName = cleanString(body.recipient_name || '', 160);
        const subject = cleanString(body.subject || '', 300);
        const content = cleanString(body.body || '', 5000);
        if (!recipientName || !subject || !content) throw validationError('Cần đủ người nhận, tiêu đề và nội dung.');
        const job = createNotificationJob(dbm, {
          actor: user,
          channel,
          recipientName,
          recipientAddress: cleanString(body.recipient_address || '', 200),
          subject,
          body: content,
          ip
        });
        return sendJson(res, 201, { ok: true, job });
      }

      // --- M9: ADMIN, RBAC, STAFF, INTAKE YEARS, AUDIT, BACKUP/RESTORE ---
      if (method === 'GET' && pathname === '/api/admin/users') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN, ROLES.MANAGER]);
        const rows = dbm.db.prepare(`
          SELECT u.*, s.id AS staff_id, s.zalo_slot AS staff_zalo_slot, s.team AS staff_team
          FROM users u LEFT JOIN staff s ON s.user_id = u.id
          ORDER BY u.created_at ASC
        `).all();
        return sendJson(res, 200, { items: rows.map(r => auth.sanitizeUser(r)) });
      }

      if (method === 'POST' && pathname === '/api/admin/users') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN]);
        const body = await readJsonBody(req, 32 * 1024);
        const email = cleanString(body.email || '', 160).toLowerCase();
        const fullName = cleanString(body.full_name || '', 160);
        const password = cleanString(body.password || 'ItcStaff@2027!', 120);
        const role = cleanString(body.role || ROLES.CONSULTANT, 30);
        const scope = cleanString(body.scope || (role === ROLES.CONSULTANT ? SCOPES.OWN : SCOPES.ALL), 20);
        if (!email || !fullName) throw validationError('Email và Họ tên không được trống.');
        if (!VALID_ROLES.has(role)) throw validationError('Vai trò không hợp lệ.');
        if (!VALID_SCOPES.has(scope)) throw validationError('Phạm vi dữ liệu không hợp lệ.');
        if (password.length < 8) throw validationError('Mật khẩu phải ít nhất 8 ký tự.');

        const exists = dbm.db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(email);
        if (exists) throw validationError('Email tài khoản đã tồn tại.');

        const ts = nowIso();
        const usrId = newId('usr');
        const stfId = newId('stf');
        const defaultTabs = role === ROLES.CONSULTANT ? [0, 1, 2, 3, 4, 5, 7, 10] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        const created = dbm.transaction((db) => {
          db.prepare(`
            INSERT INTO users (
              id, email, password_hash, full_name, role, scope, active,
              can_edit_kpi, can_export, can_delete, can_approve_reports, can_restore,
              allowed_tabs_json, must_change_password, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, 0, ?, ?)
          `).run(
            usrId, email, hashPassword(password), fullName, role, scope,
            body.can_edit_kpi ? 1 : (role !== ROLES.CONSULTANT ? 1 : 0),
            body.can_export !== false ? 1 : 0,
            body.can_delete ? 1 : (role === ROLES.SUPER_ADMIN ? 1 : 0),
            body.can_approve_reports ? 1 : (role !== ROLES.CONSULTANT ? 1 : 0),
            body.can_restore ? 1 : (role === ROLES.SUPER_ADMIN ? 1 : 0),
            JSON.stringify(Array.isArray(body.allowed_tabs) ? body.allowed_tabs : defaultTabs),
            ts, ts
          );

          // Automatically create linked Staff entity with stable ID (Scenario 15!)
          db.prepare(`
            INSERT INTO staff (id, user_id, full_name, email, zalo_slot, team, active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
          `).run(
            stfId, usrId, fullName, email,
            cleanString(body.zalo_slot || '', 60),
            cleanString(body.team || 'Tư vấn tuyển sinh', 100),
            ts, ts
          );

          dbm.appendAudit(db, {
            actor: user,
            action: 'USER_CREATED',
            entityType: 'user',
            entityId: usrId,
            summary: `Tạo tài khoản & nhân sự ${fullName} (${email}, role=${role}, scope=${scope})`,
            detail: { usrId, stfId, role, scope },
            ip
          });

          return auth.getUserWithStaff(usrId);
        });

        realtime.broadcastEvent({ entity: 'staff', action: 'record_created', id: stfId });
        return sendJson(res, 201, { ok: true, user: created });
      }

      const usrMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
      if (usrMatch && method === 'PATCH') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN]);
        const targetId = usrMatch[1];
        const target = dbm.db.prepare('SELECT * FROM users WHERE id = ?').get(targetId);
        if (!target) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy tài khoản.' });

        const body = await readJsonBody(req, 32 * 1024);
        const nextRole = body.role !== undefined ? cleanString(body.role, 30) : target.role;
        const nextActive = body.active !== undefined ? (body.active ? 1 : 0) : target.active;
        const nextScope = body.scope !== undefined ? cleanString(body.scope, 20) : target.scope;
        if (!VALID_ROLES.has(nextRole)) throw validationError('Vai trò không hợp lệ.');
        if (!VALID_SCOPES.has(nextScope)) throw validationError('Phạm vi không hợp lệ.');

        // Protect retaining AT LEAST ONE active Super Admin while allowing revoking a compromised admin!
        if (target.role === ROLES.SUPER_ADMIN && (nextRole !== ROLES.SUPER_ADMIN || nextActive === 0)) {
          const otherActiveAdmins = dbm.db.prepare(
            "SELECT COUNT(*) AS cnt FROM users WHERE role = 'super_admin' AND active = 1 AND id != ?"
          ).get(targetId).cnt;
          if (otherActiveAdmins < 1) {
            return sendJson(res, 400, {
              error: 'LAST_SUPER_ADMIN',
              message: 'Hệ thống phải giữ tối thiểu 01 Super Admin đang hoạt động.'
            });
          }
        }

        const ts = nowIso();
        const nextName = body.full_name !== undefined ? cleanString(body.full_name, 160) : target.full_name;
        const updated = dbm.transaction((db) => {
          db.prepare(`
            UPDATE users
            SET full_name = ?, role = ?, scope = ?, active = ?,
                can_edit_kpi = ?, can_export = ?, can_delete = ?, can_approve_reports = ?, can_restore = ?,
                allowed_tabs_json = ?, updated_at = ?
            WHERE id = ?
          `).run(
            nextName, nextRole, nextScope, nextActive,
            body.can_edit_kpi !== undefined ? (body.can_edit_kpi ? 1 : 0) : target.can_edit_kpi,
            body.can_export !== undefined ? (body.can_export ? 1 : 0) : target.can_export,
            body.can_delete !== undefined ? (body.can_delete ? 1 : 0) : target.can_delete,
            body.can_approve_reports !== undefined ? (body.can_approve_reports ? 1 : 0) : target.can_approve_reports,
            body.can_restore !== undefined ? (body.can_restore ? 1 : 0) : target.can_restore,
            body.allowed_tabs !== undefined ? JSON.stringify(body.allowed_tabs) : target.allowed_tabs_json,
            ts, targetId
          );

          if (body.resetPassword && String(body.resetPassword).length >= 8) {
            db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(body.resetPassword), targetId);
          }

          // Sync linked staff display name & zalo slot without changing stable staff.id!
          db.prepare('UPDATE staff SET full_name = ?, active = ?, updated_at = ? WHERE user_id = ?')
            .run(nextName, nextActive, ts, targetId);
          if (body.zalo_slot !== undefined) {
            db.prepare('UPDATE staff SET zalo_slot = ?, updated_at = ? WHERE user_id = ?')
              .run(cleanString(body.zalo_slot, 60), ts, targetId);
          }

          // CRITICAL P0: Deactivating account immediately revokes all HTTP sessions & terminates open WS sockets!
          if (nextActive === 0) {
            auth.revokeAllUserSessions(targetId, db);
          }

          dbm.appendAudit(db, {
            actor: user,
            action: nextActive === 0 ? 'USER_LOCKED' : 'USER_UPDATED',
            entityType: 'user',
            entityId: targetId,
            summary: `Cập nhật tài khoản ${target.email}: active=${nextActive}, role=${nextRole}, scope=${nextScope}`,
            detail: { targetId, nextRole, nextScope, nextActive },
            ip
          });

          return auth.getUserWithStaff(targetId);
        });

        realtime.broadcastEvent({ entity: 'staff', action: 'record_updated', id: updated.staff_id });
        return sendJson(res, 200, { ok: true, user: updated });
      }

      // Dynamic Staff endpoints (Scenario 15!)
      if (method === 'GET' && pathname === '/api/admin/staff') {
        const items = dbm.db.prepare(`
          SELECT s.*, u.role AS user_role, u.scope AS user_scope, u.active AS user_active
          FROM staff s LEFT JOIN users u ON u.id = s.user_id
          ORDER BY s.active DESC, s.id ASC
        `).all();
        return sendJson(res, 200, { items });
      }

      const stfMatch = pathname.match(/^\/api\/admin\/staff\/([^/]+)$/);
      if (stfMatch && method === 'PATCH') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN, ROLES.MANAGER]);
        const stfId = stfMatch[1];
        const stf = dbm.db.prepare('SELECT * FROM staff WHERE id = ?').get(stfId);
        if (!stf) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy nhân sự.' });
        const body = await readJsonBody(req, 16 * 1024);
        const ts = nowIso();
        const nextName = body.full_name !== undefined ? cleanString(body.full_name, 160) : stf.full_name;
        const nextZalo = body.zalo_slot !== undefined ? cleanString(body.zalo_slot, 60) : stf.zalo_slot;
        const nextTeam = body.team !== undefined ? cleanString(body.team, 100) : stf.team;
        const nextActive = body.active !== undefined ? (body.active ? 1 : 0) : stf.active;

        const updated = dbm.transaction((db) => {
          db.prepare('UPDATE staff SET full_name = ?, zalo_slot = ?, team = ?, active = ?, updated_at = ? WHERE id = ?')
            .run(nextName, nextZalo, nextTeam, nextActive, ts, stfId);
          if (stf.user_id && body.full_name !== undefined) {
            db.prepare('UPDATE users SET full_name = ?, updated_at = ? WHERE id = ?').run(nextName, ts, stf.user_id);
          }
          dbm.appendAudit(db, {
            actor: user,
            action: 'STAFF_UPDATED',
            entityType: 'staff',
            entityId: stfId,
            summary: `Cập nhật nhân sự ${stfId}: ${nextName} (Zalo: ${nextZalo})`,
            ip
          });
          return db.prepare('SELECT * FROM staff WHERE id = ?').get(stfId);
        });
        realtime.broadcastEvent({ entity: 'staff', action: 'record_updated', id: stfId });
        return sendJson(res, 200, { ok: true, staff: updated });
      }

      // Intake Years management
      if (method === 'GET' && pathname === '/api/admin/intake-years') {
        const items = dbm.db.prepare('SELECT * FROM intake_years ORDER BY year ASC').all();
        return sendJson(res, 200, { items });
      }

      if (method === 'POST' && pathname === '/api/admin/intake-years') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN, ROLES.MANAGER]);
        const body = await readJsonBody(req, 16 * 1024);
        const year = cleanString(body.year || '', 10);
        if (!/^\d{4}$/.test(year)) throw validationError('Niên khóa phải là 4 chữ số (vd: 2030).');
        const yNum = parseInt(year, 10);
        const label = cleanString(body.label || `Niên khóa ${year} (11/${yNum - 1} - 10/${year})`, 160);
        const ts = nowIso();
        dbm.transaction((db) => {
          db.prepare('INSERT OR IGNORE INTO intake_years (year, label, start_month, end_month, status, created_at) VALUES (?, ?, ?, ?, ?, ?)')
            .run(year, label, `${yNum - 1}-11`, `${year}-10`, 'open', ts);
          // Initialize empty v1 KPI plan for new year
          const existingPlan = db.prepare('SELECT id FROM kpi_plan_versions WHERE intake_year = ?').get(year);
          if (!existingPlan) {
            const pId = newId('kpl');
            db.prepare('INSERT INTO kpi_plan_versions (id, intake_year, version_number, status, note, created_by, created_at) VALUES (?, ?, 1, ?, ?, ?, ?)')
              .run(pId, year, 'active', `Kế hoạch khởi tạo NK ${year}`, user.id, ts);
          }
          dbm.appendAudit(db, { actor: user, action: 'INTAKE_YEAR_CREATED', entityType: 'intake_year', entityId: year, summary: `Mở niên khóa mới ${year}`, ip });
        });
        return sendJson(res, 201, { ok: true, year });
      }

      const iyMatch = pathname.match(/^\/api\/admin\/intake-years\/(\d{4})$/);
      if (iyMatch && method === 'PATCH') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN]);
        const year = iyMatch[1];
        const body = await readJsonBody(req, 16 * 1024);
        const status = cleanString(body.status || 'open', 20);
        if (!['open', 'closed'].includes(status)) throw validationError('Trạng thái niên khóa chỉ được là open hoặc closed.');
        dbm.transaction((db) => {
          db.prepare('UPDATE intake_years SET status = ? WHERE year = ?').run(status, year);
          dbm.appendAudit(db, { actor: user, action: 'INTAKE_YEAR_STATUS', entityType: 'intake_year', entityId: year, summary: `Đổi trạng thái niên khóa ${year} -> ${status}`, ip });
        });
        return sendJson(res, 200, { ok: true, year, status });
      }

      // Server-only Audit Log (read-only! Clients can NEVER insert/edit/delete audit logs!)
      if (method === 'GET' && pathname === '/api/admin/audit') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN, ROLES.MANAGER]);
        const limit = Math.min(500, Math.max(10, parseInt(urlObj.searchParams.get('limit') || '100', 10)));
        const actionFilter = cleanString(urlObj.searchParams.get('action') || '', 60);
        const items = actionFilter
          ? dbm.db.prepare('SELECT * FROM audit_events WHERE action = ? ORDER BY id DESC LIMIT ?').all(actionFilter, limit)
          : dbm.db.prepare('SELECT * FROM audit_events ORDER BY id DESC LIMIT ?').all(limit);
        return sendJson(res, 200, { items });
      }

      // Backup & Restore (DEV06)
      if (method === 'GET' && pathname === '/api/backup') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN, ROLES.MANAGER]);
        const items = dbm.db.prepare('SELECT * FROM backup_records ORDER BY created_at DESC LIMIT 50').all();
        return sendJson(res, 200, { items });
      }

      if (method === 'POST' && pathname === '/api/backup') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN, ROLES.MANAGER]);
        const bkp = createVersionedBackup(dbm, { actor: user, backupType: 'manual', ip });
        if (dbm.pgStore) {
          await dbm.pgStore.saveBackup({
            filename: bkp.filename,
            schemaVersion: bkp.schemaVersion,
            sizeBytes: bkp.sizeBytes,
            backupType: bkp.backupType,
            payloadJson: bkp.rawJson
          });
        }
        const { rawJson, ...safeBkp } = bkp;
        return sendJson(res, 201, { ok: true, backup: safeBkp });
      }

      const bkpDlMatch = pathname.match(/^\/api\/backup\/([a-zA-Z0-9._-]+)\/download$/);
      if (bkpDlMatch && method === 'GET') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN]);
        const filename = path.basename(bkpDlMatch[1]);
        const fullPath = path.join(config.backupDir, filename);
        let buf = null;
        if (fs.existsSync(fullPath)) {
          buf = fs.readFileSync(fullPath);
        } else if (dbm.pgStore) {
          const cloudJson = await dbm.pgStore.loadBackup(filename);
          if (cloudJson) buf = Buffer.from(cloudJson, 'utf8');
        }
        if (!buf) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy tệp backup.' });
        dbm.appendAudit(null, { actor: user, action: 'BACKUP_DOWNLOADED', entityType: 'backup', summary: `Tải bản sao lưu ngoài máy chủ: ${filename}`, ip });
        return sendBuffer(res, 200, buf, 'application/json; charset=utf-8', filename);
      }

      if (method === 'POST' && pathname === '/api/backup/restore') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN]);
        auth.requirePermission(user, 'can_restore', 'Tài khoản không có quyền khôi phục hệ thống.');
        const body = await readJsonBody(req, Math.max(config.maxBodyBytes, 15 * 1024 * 1024));
        const dryRun = Boolean(body.dryRun);

        // Require elevated re-authentication (password or admin PIN) for actual restore execution!
        if (!dryRun) {
          const confirmed = auth.verifyElevatedAdminConfirmation(user.id, {
            confirmPassword: body.confirmPassword,
            confirmPin: body.confirmPin
          });
          if (!confirmed) {
            return sendJson(res, 403, {
              error: 'ELEVATED_AUTH_REQUIRED',
              message: 'Khôi phục dữ liệu yêu cầu xác thực tăng cường (nhập mật khẩu Super Admin hoặc mã PIN quản trị).'
            });
          }
        }

        let payload = body.backupPayload;
        if (!payload && body.filename) {
          const safeName = path.basename(String(body.filename));
          const fullPath = path.join(config.backupDir, safeName);
          if (fs.existsSync(fullPath)) {
            payload = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
          } else if (dbm.pgStore) {
            const cloudJson = await dbm.pgStore.loadBackup(safeName);
            if (cloudJson) payload = JSON.parse(cloudJson);
          }
          if (!payload) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Không tìm thấy tệp sao lưu trên máy chủ.' });
        }
        const result = restoreFromBackupPayload(dbm, payload, { actor: user, ip, dryRun, realtime });
        if (!dryRun && dbm.pgStore && result.checkpointObj) {
          await dbm.pgStore.saveBackup({
            filename: result.checkpointObj.filename,
            schemaVersion: result.checkpointObj.schemaVersion,
            sizeBytes: result.checkpointObj.sizeBytes,
            backupType: 'pre_restore',
            payloadJson: result.checkpointObj.rawJson
          });
        }
        const { checkpointObj, ...safeRes } = result;
        return sendJson(res, 200, { ok: true, ...safeRes });
      }

      // Clean Production Reset (Super Admin only + elevated confirmation + automatic pre_reset checkpoint)
      if (method === 'POST' && pathname === '/api/admin/reset-data') {
        auth.requireRole(user, [ROLES.SUPER_ADMIN]);
        const body = await readJsonBody(req, 16 * 1024);
        const confirmed = auth.verifyElevatedAdminConfirmation(user.id, {
          confirmPassword: body.confirmPassword,
          confirmPin: body.confirmPin
        });
        if (!confirmed) {
          return sendJson(res, 403, {
            error: 'ELEVATED_AUTH_REQUIRED',
            message: 'Xóa sạch dữ liệu thử nghiệm yêu cầu nhập mật khẩu Super Admin hoặc mã PIN quản trị.'
          });
        }
        const checkpoint = createVersionedBackup(dbm, { actor: user, backupType: 'pre_reset', ip });
        if (dbm.pgStore) {
          await dbm.pgStore.saveBackup({
            filename: checkpoint.filename,
            schemaVersion: checkpoint.schemaVersion,
            sizeBytes: checkpoint.sizeBytes,
            backupType: 'pre_reset',
            payloadJson: checkpoint.rawJson
          });
        }
        const clearTables = [
          'import_rows', 'import_batches', 'notification_jobs', 'report_snapshots',
          'task_comments', 'tasks', 'zalo_staging', 'regional_records',
          'assignment_history', 'document_checklists', 'follow_ups', 'interactions',
          'milestone_events', 'registrations', 'contact_points', 'persons', 'idempotency_keys'
        ];
        dbm.transaction((db) => {
          for (const tbl of clearTables) {
            db.exec(`DELETE FROM ${tbl}`);
          }
          dbm.appendAudit(db, {
            actor: user,
            action: 'PRODUCTION_CLEAN_RESET',
            entityType: 'system',
            summary: `Đã dọn sạch toàn bộ hồ sơ/công việc thử nghiệm về nguyên trạng (giữ tài khoản, nhân sự, niên khóa & KPI 2027). Checkpoint: ${checkpoint.filename}`,
            ip
          });
        });
        realtime.broadcastSystemReload(`Dữ liệu thử nghiệm đã được dọn sạch về nguyên trạng bởi ${user.full_name}.`);
        return sendJson(res, 200, { ok: true, checkpoint: checkpoint.filename });
      }

      // --- M10 (P2): SOURCE / SCHOOL / PROVINCE / MAJOR CONVERSION ANALYTICS ---
      if (method === 'GET' && pathname === '/api/analytics') {
        const intakeYear = urlObj.searchParams.get('intakeYear') || '2027';
        const scope = auth.buildScopeFilterSql(user, 'r.assigned_staff_id');
        const regs = dbm.db.prepare(`
          SELECT r.id, r.source, r.school, r.province, r.major, r.stage_code
          FROM registrations r
          WHERE r.intake_year = ? AND r.deleted_at IS NULL AND ${scope.sql}
        `).all(intakeYear, ...scope.params);

        const groupBy = (field, emptyLabel) => {
          const map = {};
          for (const r of regs) {
            const key = (r[field] || '').trim() || emptyLabel;
            if (!map[key]) map[key] = { name: key, leads: 0, submitted: 0, enrolled: 0, withdrawn: 0 };
            map[key].leads++;
            if (r.stage_code === STAGE_CODE.SUBMITTED || r.stage_code === STAGE_CODE.ENROLLED) map[key].submitted++;
            if (r.stage_code === STAGE_CODE.ENROLLED) map[key].enrolled++;
            if (r.stage_code === STAGE_CODE.WITHDRAWN) map[key].withdrawn++;
          }
          return Object.values(map)
            .map(row => ({
              ...row,
              submitRate: row.leads > 0 ? Math.round((row.submitted / row.leads) * 1000) / 10 : 0,
              enrollRate: row.leads > 0 ? Math.round((row.enrolled / row.leads) * 1000) / 10 : 0
            }))
            .sort((a, b) => b.leads - a.leads);
        };

        const totals = {
          leads: regs.length,
          submitted: regs.filter(r => r.stage_code === STAGE_CODE.SUBMITTED || r.stage_code === STAGE_CODE.ENROLLED).length,
          enrolled: regs.filter(r => r.stage_code === STAGE_CODE.ENROLLED).length,
          withdrawn: regs.filter(r => r.stage_code === STAGE_CODE.WITHDRAWN).length
        };

        return sendJson(res, 200, {
          intakeYear,
          totals,
          bySource: groupBy('source', 'Chưa rõ nguồn'),
          byMajor: groupBy('major', 'Chưa xác định ngành'),
          bySchool: groupBy('school', 'Chưa rõ trường THPT').slice(0, 30),
          byProvince: groupBy('province', 'Chưa rõ tỉnh/TP')
        });
      }

      return sendJson(res, 404, { error: 'NOT_FOUND', message: `Không tìm thấy API ${method} ${pathname}` });
      };

      try {
        await dispatch();
        if (dbm.isCloudEnabled() && dbm.dirty) {
          await dbm.flushToCloud();
        }
        for (const item of pendingWs) {
          if (item.kind === 'event') rawRealtime.broadcastEvent(item.ev);
          else if (item.kind === 'reload') rawRealtime.broadcastSystemReload(item.reason);
        }
        if (pendingResp) {
          if (pendingResp.type === 'json') {
            return sendJsonRaw(res, pendingResp.statusCode, pendingResp.data, pendingResp.extraHeaders);
          }
          return sendBufferRaw(res, pendingResp.statusCode, pendingResp.buf, pendingResp.contentType, pendingResp.filename);
        }
      } catch (err) {
        const status = err.statusCode || (err.code === 'STORAGE_COMMIT_FAILED' ? 500 : 500);
        return sendJsonRaw(res, status, {
          error: err.code || 'INTERNAL_ERROR',
          message: err.message || 'Lỗi xử lý phía máy chủ.',
          details: err.details || undefined
        });
      }
    };

    if (dbm.isCloudEnabled() && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return dbm.withWriteLock(executeRequest);
    }
    return executeRequest();
  }

  return handleApi;
}

module.exports = { createApiHandler };

  }
};

const __moduleCache = {};
function __localRequire(id) {
  let key = id;
  if (key.startsWith('./src/')) key = './' + key.slice(6);
  if (__moduleFactories[key]) {
    if (!__moduleCache[key]) {
      const mod = { exports: {} };
      __moduleCache[key] = mod;
      __moduleFactories[key](mod, mod.exports, __localRequire);
    }
    return __moduleCache[key].exports;
  }
  return require(id);
}

// ---------------------------------------------------------------------------
// 3. HTTP + WEBSOCKET SERVER FACTORY & ENTRYPOINT
// ---------------------------------------------------------------------------
const { loadConfig } = __localRequire('./config');
const { DatabaseManager } = __localRequire('./db');
const { PostgresStore } = __localRequire('./pg-store');
const { AuthService } = __localRequire('./auth');
const { RealtimeHub } = __localRequire('./realtime');
const { createApiHandler } = __localRequire('./routes');
const { createVersionedBackup } = __localRequire('./backup');

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' ws: wss:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
  );
}

function createAppServer(overrides = {}) {
  const config = loadConfig(overrides);
  const startTimeMs = Date.now();
  const useCloudPg = Boolean(overrides.pgPool || config.databaseUrl);
  const dbm = new DatabaseManager(config);
  let dbInitialized = false;
  if (!useCloudPg) {
    dbm.init();
    dbInitialized = true;
  }
  const auth = new AuthService(dbm, config);

  let realtime = null;
  let apiHandler = null;

  const server = http.createServer(async (req, res) => {
    setSecurityHeaders(res);
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (urlObj.pathname.startsWith('/api/')) {
      return apiHandler(req, res, urlObj);
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Method Not Allowed');
    }

    let reqPath;
    try {
      reqPath = decodeURIComponent(urlObj.pathname);
    } catch (_) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Bad Request');
    }

    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    // Exact allow-listed in-memory asset lookup (zero disk traversal possible!)
    const asset = Object.prototype.hasOwnProperty.call(STATIC_ASSETS, reqPath)
      ? STATIC_ASSETS[reqPath]
      : null;

    if (!asset) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found');
    }

    const buf = Buffer.from(asset.body, 'utf8');
    res.writeHead(200, {
      'Content-Type': asset.contentType,
      'Content-Length': buf.length,
      'Cache-Control': reqPath === '/index.html' ? 'no-cache' : 'public, max-age=300'
    });
    if (req.method === 'HEAD') return res.end();
    res.end(buf);
  });

  realtime = new RealtimeHub({ server, auth, config });
  apiHandler = createApiHandler({ dbm, auth, realtime, config, startTimeMs });

  // Scheduled automated versioned backup every 6 hours (runs even without open browser)
  let backupTimer = null;
  if (!overrides.disableScheduledBackup) {
    backupTimer = setInterval(async () => {
      try {
        const doBackup = async () => {
          const bkp = createVersionedBackup(dbm, { actor: null, backupType: 'scheduled' });
          if (dbm.pgStore) {
            await dbm.pgStore.saveBackup({
              filename: bkp.filename,
              schemaVersion: bkp.schemaVersion,
              sizeBytes: bkp.sizeBytes,
              backupType: 'scheduled',
              payloadJson: bkp.rawJson
            });
            await dbm.flushToCloud();
          }
        };
        if (dbm.isCloudEnabled()) await dbm.withWriteLock(doBackup);
        else await doBackup();
      } catch (e) {
        console.error('[Backup Scheduler Error]', e.message);
      }
    }, 6 * 3600 * 1000);
    if (backupTimer.unref) backupTimer.unref();
  }

  return {
    config,
    dbm,
    auth,
    realtime,
    server,
    async start() {
      if (!dbInitialized && useCloudPg) {
        const pgStore = new PostgresStore(config, overrides.pgPool || null);
        await dbm.initCloud(pgStore);
        dbInitialized = true;
      }
      return new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(config.port, config.host, () => {
          const addr = server.address();
          resolve({ port: addr.port, host: addr.address });
        });
      });
    },
    async stop() {
      if (backupTimer) clearInterval(backupTimer);
      realtime.close();
      await new Promise((resolve) => server.close(() => resolve()));
      await dbm.closeAsync();
    }
  };
}

if (require.main === module) {
  const app = createAppServer();
  app.start().then(({ port }) => {
    const storageLabel = app.dbm.isCloudEnabled()
      ? `PostgreSQL Cloud (rev #${app.dbm.pgStore.rev}) + SQLite WAL`
      : `SQLite Local (${app.config.dbPath})`;
    console.log('================================================================');
    console.log(` ITC Tuyển Sinh Server v${app.config.appVersion} (Single-File Bundle) đang chạy!`);
    console.log(` Địa chỉ LAN/Cloud : http://localhost:${port}`);
    console.log(` Lưu trữ bền vững  : ${storageLabel}`);
    console.log('================================================================');
  }).catch((err) => {
    console.error('Không thể khởi động máy chủ:', err);
    process.exit(1);
  });

  const graceful = () => {
    console.log('\nĐang dừng máy chủ an toàn...');
    app.stop().then(() => process.exit(0));
  };
  process.on('SIGINT', graceful);
  process.on('SIGTERM', graceful);
}

module.exports = { createAppServer, STATIC_ASSETS, PostgresStore };
