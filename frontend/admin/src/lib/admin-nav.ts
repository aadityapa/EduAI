import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  Headphones,
  KeyRound,
  LayoutDashboard,
  Megaphone,
  Palette,
  School,
  Shield,
  Sparkles,
  Ticket,
  Users,
  Scale,
} from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  section: string;
  /** i18n key under `admin.nav.*` */
  i18nKey: string;
}

/** Single source of truth for sidebar + command palette. */
export const ADMIN_NAV: AdminNavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview', i18nKey: 'dashboard' },
  { href: '/dashboard/users', label: 'Users', icon: Users, section: 'Overview', i18nKey: 'users' },
  { href: '/dashboard/rbac', label: 'RBAC', icon: KeyRound, section: 'Overview', i18nKey: 'rbac' },
  { href: '/dashboard/schools', label: 'Schools', icon: School, section: 'Management', i18nKey: 'schools' },
  { href: '/dashboard/tenants', label: 'Tenants', icon: Building2, section: 'Management', i18nKey: 'tenants' },
  { href: '/dashboard/branding', label: 'Branding', icon: Palette, section: 'Management', i18nKey: 'branding' },
  { href: '/dashboard/ai-analytics', label: 'AI Analytics', icon: Sparkles, section: 'Analytics', i18nKey: 'aiAnalytics' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, section: 'Analytics', i18nKey: 'analytics' },
  { href: '/dashboard/billing', label: 'Revenue', icon: CreditCard, section: 'Revenue', i18nKey: 'billing' },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard, section: 'Revenue', i18nKey: 'subscriptions' },
  { href: '/dashboard/coupons', label: 'Coupons', icon: Ticket, section: 'Revenue', i18nKey: 'coupons' },
  { href: '/dashboard/content', label: 'Content', icon: FileText, section: 'Content', i18nKey: 'content' },
  { href: '/dashboard/leads', label: 'Leads CRM', icon: Megaphone, section: 'Sales', i18nKey: 'leads' },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone, section: 'Sales', i18nKey: 'campaigns' },
  { href: '/dashboard/tickets', label: 'Support', icon: Headphones, section: 'Support', i18nKey: 'tickets' },
  { href: '/dashboard/audit-logs', label: 'Audit Center', icon: Shield, section: 'Security', i18nKey: 'audit' },
  { href: '/dashboard/security', label: 'Security', icon: Shield, section: 'Security', i18nKey: 'security' },
  { href: '/dashboard/privacy', label: 'Privacy & DSR', icon: Scale, section: 'Security', i18nKey: 'privacy' },
];

export const ADMIN_FAVORITES = [
  '/dashboard',
  '/dashboard/users',
  '/dashboard/ai-analytics',
  '/dashboard/billing',
] as const;

export const ADMIN_COMMAND_ACTIONS = [
  { href: '/dashboard/tenants', label: 'New tenant', shortcut: '⌘N' },
  { href: '/dashboard/users', label: 'Manage users', shortcut: '⌘U' },
  { href: '/dashboard/audit-logs', label: 'Open audit log', shortcut: '⌘A' },
  { href: '/dashboard/billing', label: 'Revenue dashboard', shortcut: '⌘R' },
] as const;
