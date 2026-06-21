#!/usr/bin/env node
/** Generate Stitch mobile HTML screen specs under frontend/design/stitch/mobile/ */
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), 'mobile');

const STITCH_HEAD = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{{TITLE}}</title>
<script src="https://cdn.tailwindcss.com?plugins=forms"></script>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Google+Sans+Flex:wght@600;700&display=swap" rel="stylesheet"/>
<script>tailwind.config={theme:{extend:{colors:{primary:'#1A73E8',tertiary:'#9334E6',secondary:'#006e2c',background:'#F8FAFD',surface:'#FFFFFF','on-surface':'#1F1F1F','on-surface-variant':'#5F6368',outline:'#DADCE0','primary-container':'#D3E3FD','secondary-container':'#86f898'},borderRadius:{xl:'12px','2xl':'16px',full:'9999px'}}}};</script>
<style>body{font-family:Roboto,sans-serif;-webkit-tap-highlight-color:transparent}.no-scrollbar::-webkit-scrollbar{display:none}</style>
</head>
<body class="bg-background text-on-surface min-h-screen pb-24">`;

const STITCH_NAV = `
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-4 pt-2 bg-white shadow border-t border-outline">
<button class="flex flex-col items-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1"><span class="text-xs font-bold">Home</span></button>
<button class="flex flex-col items-center text-on-surface-variant px-4 py-1"><span class="text-xs">Courses</span></button>
<button class="flex flex-col items-center text-on-surface-variant px-4 py-1"><span class="text-xs">Tutor</span></button>
<button class="flex flex-col items-center text-on-surface-variant px-4 py-1"><span class="text-xs">Quizzes</span></button>
<button class="flex flex-col items-center text-on-surface-variant px-4 py-1"><span class="text-xs">Profile</span></button>
</nav>`;

const screens = {
  eduai_mobile_login: {
    title: 'EduAI Mobile Login',
    body: `<main class="px-4 py-8 max-w-md mx-auto space-y-6">
<div class="text-center pt-8"><div class="w-14 h-14 bg-primary rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold">E</div>
<h1 class="text-2xl font-bold mt-4 text-primary">EduAI</h1><p class="text-on-surface-variant text-sm">Student · Teacher · Parent</p></div>
<div class="flex gap-2 bg-gray-100 p-1 rounded-full"><button class="flex-1 py-2 rounded-full bg-primary text-white text-sm font-bold">Student</button><button class="flex-1 py-2 text-sm">Teacher</button><button class="flex-1 py-2 text-sm">Parent</button></div>
<div class="bg-white rounded-2xl p-4 shadow space-y-4"><label class="text-sm font-medium">Email</label><input class="w-full border rounded-xl px-4 py-3" placeholder="you@school.edu"/>
<label class="text-sm font-medium">Password</label><input type="password" class="w-full border rounded-xl px-4 py-3"/>
<button class="w-full py-3 bg-primary text-white rounded-full font-bold">Sign In</button></div></main>`,
    nav: false,
  },
  eduai_mobile_courses: {
    title: 'EduAI Mobile Courses',
    body: `<header class="sticky top-0 bg-background px-4 py-3 border-b border-outline flex justify-between items-center"><h1 class="font-bold text-lg text-primary">Courses</h1><button class="text-sm text-primary font-bold">Filter</button></header>
<main class="px-4 py-4 space-y-3 max-w-md mx-auto">
<div class="bg-white rounded-2xl p-4 border border-outline shadow-sm"><p class="font-bold">Mathematics · Class 8</p><p class="text-sm text-on-surface-variant">Advanced Algebra</p><div class="mt-3 h-1.5 bg-gray-200 rounded-full"><div class="h-1.5 bg-primary rounded-full w-3/4"></div></div></div>
<div class="bg-white rounded-2xl p-4 border border-outline shadow-sm"><p class="font-bold">Science · Class 8</p><p class="text-sm text-on-surface-variant">Physics Fundamentals</p><div class="mt-3 h-1.5 bg-gray-200 rounded-full"><div class="h-1.5 bg-secondary rounded-full w-2/5"></div></div></div></main>`,
  },
  eduai_mobile_tutor: {
    title: 'EduAI Mobile AI Tutor',
    body: `<header class="bg-tertiary text-white px-4 py-4"><h1 class="font-bold text-lg">AI Tutor</h1><p class="text-sm opacity-90">Learning Hub · Online</p></header>
<main class="flex flex-col h-[calc(100vh-8rem)] max-w-md mx-auto"><div class="flex-1 p-4 space-y-3 overflow-y-auto">
<div class="bg-gray-100 self-start max-w-[85%] rounded-2xl px-4 py-3 text-sm">Hi! What would you like to learn today?</div>
<div class="bg-primary text-white self-end max-w-[85%] rounded-2xl px-4 py-3 text-sm">Explain photosynthesis simply</div></div>
<div class="p-3 border-t flex gap-2"><input class="flex-1 rounded-full border px-4 py-2 text-sm" placeholder="Ask your AI tutor..."/><button class="bg-primary text-white rounded-full px-5 py-2 font-bold text-sm">Send</button></div></main>`,
    nav: false,
  },
  eduai_mobile_quizzes: {
    title: 'EduAI Mobile Quizzes',
    body: `<header class="px-4 py-3 border-b"><h1 class="font-bold text-lg">Quizzes</h1></header>
<main class="px-4 py-4 space-y-3 max-w-md mx-auto">
<div class="bg-white rounded-2xl p-4 border flex justify-between items-center"><div><p class="font-bold">Algebra Quiz 3</p><p class="text-xs text-on-surface-variant">Due tomorrow</p></div><span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">New</span></div>
<div class="bg-white rounded-2xl p-4 border"><p class="font-bold">Science MCQ</p><p class="text-xs text-green-600 font-bold mt-1">Score: 92%</p></div></main>`,
  },
  eduai_mobile_planner: {
    title: 'EduAI Mobile Planner',
    body: `<header class="px-4 py-3 border-b"><h1 class="font-bold text-lg">Study Planner</h1></header>
<main class="px-4 py-4 space-y-3 max-w-md mx-auto">
<div class="bg-primary-container rounded-2xl p-4"><p class="font-bold text-on-primary-container">Today's Plan</p><p class="text-sm mt-1">2 lessons · 1 quiz · 15 min AI review</p></div>
<ul class="space-y-2"><li class="bg-white rounded-xl p-3 border flex gap-3 items-center"><span class="w-2 h-2 rounded-full bg-primary"></span><span class="text-sm font-medium">Complete Chapter 4</span></li>
<li class="bg-white rounded-xl p-3 border flex gap-3 items-center"><span class="w-2 h-2 rounded-full bg-tertiary"></span><span class="text-sm font-medium">Practice quiz</span></li></ul></main>`,
  },
  eduai_mobile_profile: {
    title: 'EduAI Mobile Profile',
    body: `<main class="px-4 py-6 max-w-md mx-auto space-y-4">
<div class="flex items-center gap-4"><div class="w-16 h-16 rounded-full bg-primary-container"></div><div><p class="font-bold text-lg">Arjun Sharma</p><p class="text-sm text-on-surface-variant">Class 8 · CBSE</p></div></div>
<div class="bg-white rounded-2xl border divide-y"><button class="w-full text-left px-4 py-3 text-sm font-medium">Notifications</button><button class="w-full text-left px-4 py-3 text-sm font-medium">Language</button><button class="w-full text-left px-4 py-3 text-sm font-medium text-red-600">Sign Out</button></div></main>`,
  },
  eduai_mobile_gamification: {
    title: 'EduAI Mobile Rewards',
    body: `<header class="px-4 py-3 border-b"><h1 class="font-bold text-lg">Rewards</h1></header>
<main class="px-4 py-4 space-y-4 max-w-md mx-auto">
<div class="flex gap-3"><div class="flex-1 bg-white rounded-xl p-3 border text-center"><p class="text-xl font-bold text-tertiary">2,450</p><p class="text-xs text-on-surface-variant">XP</p></div>
<div class="flex-1 bg-white rounded-xl p-3 border text-center"><p class="text-xl font-bold text-red-500">15</p><p class="text-xs text-on-surface-variant">Streak</p></div></div>
<div class="bg-white rounded-2xl p-4 border"><p class="font-bold mb-2">Leaderboard</p><p class="text-sm text-on-surface-variant">You are #4 in your class</p></div></main>`,
  },
  eduai_mobile_hub: {
    title: 'EduAI Mobile Hub',
    body: `<header class="px-4 py-3 border-b"><h1 class="font-bold text-lg">Learning Hub</h1></header>
<main class="px-4 py-4 space-y-3 max-w-md mx-auto">
<div class="bg-white rounded-2xl p-4 border"><p class="font-bold">CBSE · Class 8</p><p class="text-sm text-on-surface-variant">Mathematics → Algebra</p></div>
<div class="grid grid-cols-2 gap-2"><div class="bg-primary/10 rounded-xl p-3 text-center text-sm font-bold">Lessons</div><div class="bg-secondary/10 rounded-xl p-3 text-center text-sm font-bold">Practice</div></div></main>`,
  },
  eduai_mobile_parent_home: {
    title: 'EduAI Mobile Parent',
    body: `<header class="px-4 py-4 border-b"><h1 class="font-bold text-lg text-primary">Parent Portal</h1></header>
<main class="px-4 py-4 space-y-4 max-w-md mx-auto">
<div class="grid grid-cols-2 gap-3"><div class="bg-white rounded-xl p-4 border"><p class="text-2xl font-bold text-primary">95%</p><p class="text-xs text-on-surface-variant">Attendance</p></div>
<div class="bg-white rounded-xl p-4 border"><p class="text-2xl font-bold text-tertiary">Paid</p><p class="text-xs text-on-surface-variant">Fees</p></div></div>
<div class="bg-white rounded-2xl p-4 border"><p class="font-bold">Arjun Patel</p><p class="text-sm text-on-surface-variant">Class 8 · Linked</p></div></main>`,
    nav: false,
  },
  eduai_mobile_parent_fees: {
    title: 'EduAI Mobile Fees',
    body: `<header class="px-4 py-3 border-b"><h1 class="font-bold text-lg">Fees</h1></header>
<main class="px-4 py-4 space-y-3 max-w-md mx-auto"><div class="bg-green-50 border border-green-200 rounded-xl p-4"><p class="font-bold text-green-800">Term 2 — Paid</p><p class="text-sm text-green-700">Receipt #EDU-2026-042</p></div></main>`,
    nav: false,
  },
  eduai_mobile_teacher_home: {
    title: 'EduAI Mobile Teacher',
    body: `<header class="px-4 py-4 border-b"><h1 class="font-bold text-lg text-primary">Teacher Portal</h1></header>
<main class="px-4 py-4 space-y-4 max-w-md mx-auto">
<div class="bg-tertiary/10 rounded-2xl p-4 border border-tertiary/20"><p class="font-bold text-tertiary">AI Question Generator</p><p class="text-sm mt-1">Create quizzes in seconds</p><button class="mt-3 bg-tertiary text-white rounded-full px-4 py-2 text-sm font-bold">Try Now</button></div>
<div class="bg-white rounded-xl p-4 border"><p class="text-xs uppercase text-on-surface-variant">Today's Schedule</p><p class="font-bold mt-1">Grade 8 Science · 10:00 AM</p></div></main>`,
    nav: false,
  },
};

for (const [slug, spec] of Object.entries(screens)) {
  const dir = join(ROOT, slug);
  mkdirSync(dir, { recursive: true });
  const html = `${STITCH_HEAD.replace('{{TITLE}}', spec.title)}
${spec.body}
${spec.nav !== false ? STITCH_NAV : ''}
</body></html>`;
  writeFileSync(join(dir, 'code.html'), html, 'utf8');
  writeFileSync(
    join(dir, 'DESIGN.md'),
    `# ${spec.title}\n\nStitch mobile screen spec. Route: see \`../manifest.json\`.\n`,
    'utf8',
  );
}

console.log(`Generated ${Object.keys(screens).length} mobile Stitch screens in ${ROOT}`);
