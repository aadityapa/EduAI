#!/usr/bin/env node
/**
 * Sync EduAI UI from Google Stitch MCP.
 * Usage: node scripts/stitch-sync.mjs [generate|fetch|all]
 * Requires STITCH_API_KEY env var (or reads from ~/.cursor/mcp.json).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STITCH_URL = 'https://stitch.googleapis.com/mcp';
const PROJECT_ID = process.env.STITCH_PROJECT_ID ?? '17256885408366407754';
const OUT_DIR = join(ROOT, 'docs', 'design', 'stitch-screens');

function getApiKey() {
  if (process.env.STITCH_API_KEY) return process.env.STITCH_API_KEY;
  try {
    const mcp = JSON.parse(readFileSync('C:/Users/Admin/.cursor/mcp.json', 'utf8'));
    return mcp.mcpServers?.stitch?.headers?.['X-Goog-Api-Key'];
  } catch {
    throw new Error('Set STITCH_API_KEY or configure ~/.cursor/mcp.json');
  }
}

async function stitchCall(name, args = {}) {
  const res = await fetch(STITCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': getApiKey(),
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  });
  const json = await res.json();
  if (json.result?.isError) {
    const msg = json.result.content?.[0]?.text ?? 'Stitch API error';
    throw new Error(msg);
  }
  return json.result?.structuredContent ?? JSON.parse(json.result?.content?.[0]?.text ?? '{}');
}

/** Extract first generated screen from Stitch outputComponents envelope */
function extractScreen(result) {
  for (const comp of result?.outputComponents ?? []) {
    const screens = comp?.design?.screens;
    if (screens?.length) return screens[0];
  }
  return result?.screen ?? null;
}

function screenIdFrom(screen) {
  if (!screen) return undefined;
  return screen.id ?? screen.name?.split('/').pop();
}

async function downloadHtml(htmlFile) {
  if (!htmlFile) return '';
  if (htmlFile.downloadUrl) {
    return await (await fetch(htmlFile.downloadUrl)).text();
  }
  if (htmlFile.fileContentBase64) {
    return Buffer.from(htmlFile.fileContentBase64, 'base64').toString('utf8');
  }
  return '';
}

async function saveScreenArtifacts(slug, screen, result) {
  const screenId = screenIdFrom(screen);
  const meta = {
    slug,
    screenId,
    title: screen?.title,
    screenshotUrl: screen?.screenshot?.downloadUrl,
    htmlUrl: screen?.htmlCode?.downloadUrl,
    result,
  };
  writeFileSync(join(OUT_DIR, `${slug}.meta.json`), JSON.stringify(meta, null, 2));

  const html = await downloadHtml(screen?.htmlCode);
  if (html) {
    const filename = slug ? `${slug}.html` : `${screenId}.html`;
    writeFileSync(join(OUT_DIR, filename), html);
    console.log(`  Saved ${filename} (${html.length} bytes)`);
  }
  return screenId;
}

const SCREENS = [
  {
    slug: 'web-login',
    deviceType: 'DESKTOP',
    prompt:
      'Modern EduAI web login for K-12 education SaaS. Split layout: left gradient hero with "Learn smarter with AI" headline, right white form card with Student/Teacher/Parent portal tabs, email/password fields, Google sign-in, primary blue #1A73E8 pill CTA. Clean Google Material 3 style, Google Sans typography.',
  },
  {
    slug: 'student-dashboard',
    deviceType: 'DESKTOP',
    prompt:
      'EduAI student dashboard: left sidebar nav (Dashboard, Courses, AI Tutor, Hub, Gamification), top bar with search and avatar. Main area: welcome banner, 4 KPI stat cards (XP, streak, courses, quizzes), course progress cards grid, AI tutor promo card purple accent. Material 3, white cards on #F8FAFD background.',
  },
  {
    slug: 'admin-dashboard',
    deviceType: 'DESKTOP',
    prompt:
      'EduAI admin CRM dashboard: dark sidebar with nav (Dashboard, Tenants, Schools, Users, Billing, Leads, Tickets, Analytics). Top command bar with search. KPI row (MRR, active tenants, users, AI cost). Revenue chart, recent leads table, support tickets kanban preview. Enterprise SaaS admin, Material 3, primary blue #1A73E8.',
  },
  {
    slug: 'admin-login',
    deviceType: 'DESKTOP',
    prompt:
      'EduAI admin portal login: split screen, left blue-green gradient hero "Admin CRM for modern schools", right minimal sign-in form with email/password, demo hint, Continue button. Professional enterprise look, Material 3.',
  },
];

const NEXT_SCREENS = [
  {
    slug: 'teacher-dashboard',
    deviceType: 'DESKTOP',
    prompt:
      'EduAI teacher dashboard for K-12 schools. Left sidebar nav, top command/search bar, welcome header, class schedule cards, attendance summary, pending assignments, quiz builder CTA, and AI question generator promo. Material 3, Google blue #1A73E8, clean white cards on #F8FAFD.',
  },
  {
    slug: 'parent-dashboard',
    deviceType: 'DESKTOP',
    prompt:
      'EduAI parent dashboard. Family-focused overview with student selector, attendance and fee cards, child progress timeline, upcoming school notifications, teacher messages, and AI assistant card. Calm Material 3 education style, clear hierarchy, accessible typography.',
  },
  {
    slug: 'ai-tutor-chat',
    deviceType: 'DESKTOP',
    prompt:
      'EduAI AI tutor chat interface for students. Sidebar with recent chats and subjects, main chat area with friendly tutor messages, citations to lessons, suggested prompts, attachment button, and large rounded input composer. Tertiary purple accent for AI moments, Material 3.',
  },
  {
    slug: 'teacher-quiz-builder',
    deviceType: 'DESKTOP',
    prompt:
      'EduAI teacher quiz builder screen. Stepper header, form controls for class, subject, chapter, difficulty, question types, generated question preview cards, rubric panel, and primary Generate with AI button. Professional teacher workflow, Material 3.',
  },
  {
    slug: 'admin-leads-crm',
    deviceType: 'DESKTOP',
    prompt:
      'EduAI admin leads CRM page. Dark admin sidebar, command bar, pipeline KPI cards, leads table with school name, stage, ARR potential, owner, next action, plus kanban pipeline preview. Enterprise SaaS CRM style, Material 3, primary blue.',
  },
  {
    slug: 'admin-support-tickets',
    deviceType: 'DESKTOP',
    prompt:
      'EduAI admin support tickets page. Dark admin sidebar, ticket priority KPIs, SLA breach alert, kanban columns Open, In Progress, Waiting, Resolved, ticket cards with school, severity, assignee, and AI suggested response panel. Enterprise support dashboard.',
  },
  {
    slug: 'student-mobile-dashboard',
    deviceType: 'MOBILE',
    prompt:
      'EduAI mobile student dashboard for Android/iPhone. Top greeting, XP and streak chips, compact course progress carousel, AI Tutor floating card, bottom navigation with Dashboard, Courses, AI, Hub, Rewards. Material 3 mobile, Google blue and purple AI accent.',
  },
];

const ALL_SCREENS = [...SCREENS, ...NEXT_SCREENS];

async function uploadDesignMd() {
  const md = readFileSync(join(ROOT, 'docs', 'design', 'DESIGN.md'), 'utf8');
  const designMdBase64 = Buffer.from(md, 'utf8').toString('base64');
  await stitchCall('upload_design_md', { projectId: PROJECT_ID, designMdBase64 });
  console.log('Uploaded DESIGN.md');
  try {
    await stitchCall('create_design_system_from_design_md', { projectId: PROJECT_ID });
    console.log('Created design system');
  } catch (e) {
    console.warn('Design system skip:', e.message);
  }
}

async function generateAll(screensToGenerate = SCREENS) {
  await uploadDesignMd();
  let designSystem;
  try {
    const project = await stitchCall('get_project', { projectId: PROJECT_ID });
    designSystem = project.designSystems?.[0]?.name ?? project.designTheme?.name;
    console.log('Project:', project.title ?? PROJECT_ID, designSystem ? `DS: ${designSystem}` : '');
  } catch (e) {
    console.warn('get_project skip:', e.message);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  for (const screen of screensToGenerate) {
    console.log(`Generating: ${screen.slug}... (may take 2-5 min)`);
    try {
      const result = await stitchCall('generate_screen_from_text', {
        projectId: PROJECT_ID,
        prompt: screen.prompt,
        deviceType: screen.deviceType,
        modelId: 'GEMINI_3_FLASH',
        ...(designSystem ? { designSystem } : {}),
      });
      const generated = extractScreen(result);
      const screenId = await saveScreenArtifacts(screen.slug, generated, result);
      console.log(`  -> screen ${screenId ?? '(unknown)'}`);
    } catch (e) {
      console.error(`  Failed ${screen.slug}:`, e.message);
      try {
        const { screens } = await stitchCall('list_screens', { projectId: PROJECT_ID });
        const latest = screens?.[screens.length - 1];
        if (latest) {
          const screenId = screenIdFrom(latest);
          console.log(`  Poll found: ${screenId}`);
          writeFileSync(
            join(OUT_DIR, `${screen.slug}.meta.json`),
            JSON.stringify({ slug: screen.slug, screenId, polled: true }, null, 2),
          );
        }
      } catch {
        /* ignore poll errors */
      }
    }
  }
}

async function fetchScreens() {
  mkdirSync(OUT_DIR, { recursive: true });

  // Prefer slug-named HTML from meta files (maps Stitch screens to our slugs)
  const slugByScreenId = {};
  for (const slug of ALL_SCREENS.map((s) => s.slug)) {
    const metaPath = join(OUT_DIR, `${slug}.meta.json`);
    if (!existsSync(metaPath)) continue;
    try {
      const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
      const id = meta.screenId ?? extractScreen(meta.result)?.id;
      if (id) slugByScreenId[id] = slug;
    } catch {
      /* skip bad meta */
    }
  }

  const { screens } = await stitchCall('list_screens', { projectId: PROJECT_ID });
  console.log(`Found ${screens?.length ?? 0} screens`);

  for (const s of screens ?? []) {
    const screenId = screenIdFrom(s);
    const slug = slugByScreenId[screenId];
    try {
      const detail = await stitchCall('get_screen', { projectId: PROJECT_ID, screenId });
      const htmlFile =
        detail.htmlCode ?? detail.html ?? detail.files?.find((f) => f.mimeType?.includes('html'));
      const html = await downloadHtml(htmlFile);
      if (html) {
        const base = slug ?? screenId;
        writeFileSync(join(OUT_DIR, `${base}.html`), html);
        console.log(`Saved ${base}.html (${html.length} bytes)`);
      }
    } catch (e) {
      console.warn(`  Skip ${screenId}:`, e.message);
    }
  }

  // Fallback: download from htmlUrl stored in meta when get_screen fails
  for (const slug of ALL_SCREENS.map((s) => s.slug)) {
    const htmlPath = join(OUT_DIR, `${slug}.html`);
    if (existsSync(htmlPath)) continue;
    const metaPath = join(OUT_DIR, `${slug}.meta.json`);
    if (!existsSync(metaPath)) continue;
    try {
      const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
      const url = meta.htmlUrl ?? extractScreen(meta.result)?.htmlCode?.downloadUrl;
      if (url) {
        const html = await (await fetch(url)).text();
        writeFileSync(htmlPath, html);
        console.log(`Saved ${slug}.html from meta (${html.length} bytes)`);
      }
    } catch (e) {
      console.warn(`  Meta fallback ${slug}:`, e.message);
    }
  }
}

const cmd = process.argv[2] ?? 'all';
if (cmd === 'generate') await generateAll();
else if (cmd === 'generate:next') await generateAll(NEXT_SCREENS);
else if (cmd === 'fetch') await fetchScreens();
else if (cmd === 'backfill') {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const slug of ALL_SCREENS.map((s) => s.slug)) {
    const metaPath = join(OUT_DIR, `${slug}.meta.json`);
    if (!existsSync(metaPath)) continue;
    const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
    const screen = extractScreen(meta.result);
    const screenId = meta.screenId ?? screenIdFrom(screen);
    if (!screenId) {
      console.warn(`No screenId for ${slug}`);
      continue;
    }
    const updated = {
      slug,
      screenId,
      title: meta.title ?? screen?.title,
      screenshotUrl: meta.screenshotUrl ?? screen?.screenshot?.downloadUrl,
      htmlUrl: meta.htmlUrl ?? screen?.htmlCode?.downloadUrl,
    };
    writeFileSync(metaPath, JSON.stringify(updated, null, 2));
    console.log(`${slug} -> ${screenId}`);
  }
} else {
  await generateAll();
  console.log('Waiting 90s for generation...');
  await new Promise((r) => setTimeout(r, 90000));
  await fetchScreens();
}
