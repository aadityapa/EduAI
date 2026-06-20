export const dashboardKpis = {
  totalStudents: 24850,
  totalTeachers: 1842,
  totalSchools: 156,
  monthlyRevenue: 428500,
  activeUsers: 19200,
  aiRequests: 847200,
  subscriptions: 142,
  retention: 94.2,
};

export const userGrowthData = [
  { month: 'Jan', students: 18200, teachers: 1200, schools: 98 },
  { month: 'Feb', students: 19100, teachers: 1280, schools: 105 },
  { month: 'Mar', students: 20100, teachers: 1350, schools: 112 },
  { month: 'Apr', students: 21200, teachers: 1480, schools: 125 },
  { month: 'May', students: 22800, teachers: 1620, schools: 138 },
  { month: 'Jun', students: 24850, teachers: 1842, schools: 156 },
];

export const revenueData = [
  { month: 'Jan', mrr: 285000, arr: 3420000 },
  { month: 'Feb', mrr: 312000, arr: 3744000 },
  { month: 'Mar', mrr: 338000, arr: 4056000 },
  { month: 'Apr', mrr: 365000, arr: 4380000 },
  { month: 'May', mrr: 398000, arr: 4776000 },
  { month: 'Jun', mrr: 428500, arr: 5142000 },
];

export const aiUsageData = [
  { day: 'Mon', requests: 12400, tokens: 820000 },
  { day: 'Tue', requests: 14200, tokens: 940000 },
  { day: 'Wed', requests: 13800, tokens: 910000 },
  { day: 'Thu', requests: 15600, tokens: 1020000 },
  { day: 'Fri', requests: 16200, tokens: 1080000 },
  { day: 'Sat', requests: 8900, tokens: 580000 },
  { day: 'Sun', requests: 7200, tokens: 470000 },
];

export const courseCompletionData = [
  { subject: 'Math', completion: 78 },
  { subject: 'Science', completion: 72 },
  { subject: 'English', completion: 85 },
  { subject: 'Hindi', completion: 68 },
  { subject: 'Social', completion: 74 },
];

export const engagementData = [
  { week: 'W1', sessions: 42000, avgDuration: 28 },
  { week: 'W2', sessions: 44500, avgDuration: 31 },
  { week: 'W3', sessions: 46200, avgDuration: 29 },
  { week: 'W4', sessions: 48100, avgDuration: 33 },
];

export const schoolAnalyticsData = [
  { name: 'Delhi Public School', students: 2400, teachers: 120, revenue: 48000 },
  { name: 'Ryan International', students: 1850, teachers: 95, revenue: 37000 },
  { name: 'DAV Public School', students: 1620, teachers: 88, revenue: 32400 },
  { name: 'Kendriya Vidyalaya', students: 2100, teachers: 105, revenue: 42000 },
  { name: 'St. Mary\'s Academy', students: 980, teachers: 52, revenue: 19600 },
];

export const mockUsers = [
  { id: '1', email: 'admin@demo.eduai.in', first_name: 'Platform', last_name: 'Admin', roles: ['platform_admin'], status: 'active' },
  { id: '2', email: 'teacher@demo.eduai.in', first_name: 'Priya', last_name: 'Sharma', roles: ['teacher'], status: 'active' },
  { id: '3', email: 'student@demo.eduai.in', first_name: 'Arjun', last_name: 'Patel', roles: ['student'], status: 'active' },
  { id: '4', email: 'parent@demo.eduai.in', first_name: 'Rajesh', last_name: 'Patel', roles: ['parent'], status: 'active' },
  { id: '5', email: 'inactive@demo.eduai.in', first_name: 'Test', last_name: 'User', roles: ['student'], status: 'inactive' },
];

export const mockSchools = [
  { id: '1', name: 'Delhi Public School', city: 'New Delhi', students: 2400, teachers: 120, subscription: 'Enterprise', status: 'active', tenant: 'demo' },
  { id: '2', name: 'Ryan International', city: 'Mumbai', students: 1850, teachers: 95, subscription: 'Pro', status: 'active', tenant: 'demo' },
  { id: '3', name: 'DAV Public School', city: 'Chennai', students: 1620, teachers: 88, subscription: 'Pro', status: 'active', tenant: 'demo' },
  { id: '4', name: 'Kendriya Vidyalaya', city: 'Bangalore', students: 2100, teachers: 105, subscription: 'Enterprise', status: 'active', tenant: 'demo' },
];

export const mockTenants = [
  { id: '1', name: 'Demo Academy', slug: 'demo', domain: 'demo.eduai.in', users: 5200, mrr: 85000, health: 98 },
  { id: '2', name: 'Sunrise Schools', slug: 'sunrise', domain: 'sunrise.eduai.in', users: 3200, mrr: 52000, health: 92 },
  { id: '3', name: 'Green Valley', slug: 'greenvalley', domain: 'greenvalley.eduai.in', users: 1800, mrr: 28000, health: 85 },
];

export const mockLeads = [
  { id: '1', title: 'ABC International School', description: '500+ students, CBSE board', tags: ['Enterprise', 'Hot'], assignee: 'Sales Team' },
  { id: '2', title: 'Modern Public School', description: 'Interested in AI tutor', tags: ['Pro'], assignee: 'Rahul K.' },
  { id: '3', title: 'Heritage Academy', description: 'Follow-up scheduled', tags: ['Demo'], assignee: 'Priya S.' },
];

export const mockTickets = [
  { id: '1', title: 'Login issue on mobile', description: 'Parent unable to login', tags: ['High', 'Auth'], assignee: 'Support L1' },
  { id: '2', title: 'Billing discrepancy', description: 'Invoice amount mismatch', tags: ['Medium', 'Billing'], assignee: 'Finance' },
  { id: '3', title: 'AI tutor timeout', description: 'Slow responses during peak', tags: ['Low', 'AI'], assignee: 'Engineering' },
];

export const mockAuditLogs = [
  { id: '1', title: 'User login', description: 'admin@demo.eduai.in signed in', timestamp: '2 min ago', type: 'info' as const },
  { id: '2', title: 'Subscription updated', description: 'Enterprise plan activated for DPS', timestamp: '15 min ago', type: 'success' as const },
  { id: '3', title: 'Failed login attempt', description: '3 attempts from 192.168.1.1', timestamp: '1 hour ago', type: 'warning' as const },
  { id: '4', title: 'AI quota exceeded', description: 'Tenant sunrise hit 90% limit', timestamp: '2 hours ago', type: 'error' as const },
];

export const chartConfig = {
  students: { label: 'Students', color: 'hsl(var(--chart-1))' },
  teachers: { label: 'Teachers', color: 'hsl(var(--chart-2))' },
  schools: { label: 'Schools', color: 'hsl(var(--chart-3))' },
  mrr: { label: 'MRR', color: 'hsl(var(--chart-1))' },
  requests: { label: 'Requests', color: 'hsl(var(--chart-1))' },
  tokens: { label: 'Tokens', color: 'hsl(var(--chart-2))' },
  completion: { label: 'Completion %', color: 'hsl(var(--chart-1))' },
  sessions: { label: 'Sessions', color: 'hsl(var(--chart-1))' },
  revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
};

export const notifications = [
  { id: '1', title: 'New school onboarded', message: 'St. Mary\'s Academy joined the platform', time: '5m ago', read: false },
  { id: '2', title: 'Payment received', message: '₹48,000 from Delhi Public School', time: '1h ago', read: false },
  { id: '3', title: 'AI usage alert', message: 'Sunrise Schools at 85% quota', time: '3h ago', read: true },
];

export const tenants = [
  { id: 'demo', name: 'Demo Academy', slug: 'demo' },
  { id: 'sunrise', name: 'Sunrise Schools', slug: 'sunrise' },
  { id: 'greenvalley', name: 'Green Valley', slug: 'greenvalley' },
];
