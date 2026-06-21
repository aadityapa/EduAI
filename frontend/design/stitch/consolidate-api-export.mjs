#!/usr/bin/env node
/**
 * Copy Stitch API fetch artifacts into frontend/design/stitch/from-api/
 * Run after: pnpm stitch:fetch
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SRC = join(ROOT, 'backend', 'docs', 'design', 'stitch-screens');
const DEST = join(dirname(fileURLToPath(import.meta.url)), 'from-api');
const PROJECT_ID = '17256885408366407754';
const PROJECT_URL = `https://stitch.withgoogle.com/projects/${PROJECT_ID}`;

const SLUG_ROUTES = {
  'web-login': '/login',
  'student-dashboard': '/student/dashboard',
  'teacher-dashboard': '/teacher/dashboard',
  'parent-dashboard': '/parent/dashboard',
  'admin-dashboard': '/dashboard',
  'admin-login': '/login',
  'admin-leads-crm': '/dashboard/leads',
  'admin-support-tickets': '/dashboard/tickets',
  'ai-tutor-chat': '/student/tutor',
  'teacher-quiz-builder': '/teacher/quizzes/builder',
  'student-mobile-dashboard': '/(student)/index',
};

mkdirSync(DEST, { recursive: true });

const htmlFiles = readdirSync(SRC).filter((f) => f.endsWith('.html'));
const inventory = {};

for (const file of htmlFiles) {
  const key = file.replace(/\.html$/, '');
  const folder = join(DEST, key);
  mkdirSync(folder, { recursive: true });
  const html = readFileSync(join(SRC, file), 'utf8');
  writeFileSync(join(folder, 'code.html'), html, 'utf8');

  let meta = {};
  const metaPath = join(SRC, `${key}.meta.json`);
  if (existsSync(metaPath)) {
    try {
      meta = JSON.parse(readFileSync(metaPath, 'utf8'));
    } catch {
      /* ignore */
    }
  }

  inventory[key] = {
    path: `from-api/${key}/code.html`,
    title: meta.title ?? key,
    screenId: meta.screenId ?? (key.match(/^[a-f0-9-]{32}$/i) ? key : undefined),
    appRoute: SLUG_ROUTES[key] ?? null,
    bytes: html.length,
  };
}

const manifestPath = join(dirname(fileURLToPath(import.meta.url)), 'manifest.json');
let manifest = {};
if (existsSync(manifestPath)) {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
}

manifest.stitchProject = {
  id: PROJECT_ID,
  url: PROJECT_URL,
  syncedAt: new Date().toISOString(),
  screenCount: htmlFiles.length,
};
manifest.apiExport = inventory;

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Consolidated ${htmlFiles.length} screens -> ${DEST}`);
console.log(`Updated ${manifestPath}`);
