// Shared mock data for the Admin Portal

// ── Users ──────────────────────────────────────────────
export const mockUsers = [
  { id: 'u1', name: 'Amani Kamau', email: 'amani@school.ke', role: 'student', grade: 'Grade 4', status: 'active', joined: '2025-01-10', avatar: 'AK' },
  { id: 'u2', name: 'Baraka Odhiambo', email: 'baraka@school.ke', role: 'student', grade: 'Grade 1', status: 'active', joined: '2025-01-10', avatar: 'BO' },
  { id: 'u3', name: 'Cynthia Mwangi', email: 'cynthia@school.ke', role: 'student', grade: 'Grade 6', status: 'inactive', joined: '2025-01-12', avatar: 'CM' },
  { id: 'u4', name: 'Mrs. Njoroge', email: 'njoroge@school.ke', role: 'teacher', grade: '', status: 'active', joined: '2024-08-01', avatar: 'MN' },
  { id: 'u5', name: 'Mr. Kariuki', email: 'kariuki@school.ke', role: 'teacher', grade: '', status: 'active', joined: '2024-08-01', avatar: 'MK' },
  { id: 'u6', name: 'Ms. Achieng', email: 'achieng@school.ke', role: 'teacher', grade: '', status: 'inactive', joined: '2024-08-15', avatar: 'MA' },
  { id: 'u7', name: 'Mrs. Wanjiku Kamau', email: 'wanjiku@school.ke', role: 'parent', grade: '', status: 'active', joined: '2025-01-10', avatar: 'WK' },
  { id: 'u8', name: 'Mr. James Odhiambo', email: 'james@school.ke', role: 'parent', grade: '', status: 'active', joined: '2025-01-10', avatar: 'JO' },
  { id: 'u9', name: 'Admin Super', email: 'admin@school.ke', role: 'admin', grade: '', status: 'active', joined: '2024-01-01', avatar: 'AS' },
];

// ── Classes ────────────────────────────────────────────
export const mockClasses = [
  { id: 'c1', name: 'Grade 4 – Morning', teacher: 'Mrs. Njoroge', teacherId: 'u4', students: ['u1'], capacity: 30, term: 'Term 2 2026', subject: 'Mathematics', status: 'active' },
  { id: 'c2', name: 'Grade 1 – Morning', teacher: 'Mr. Kariuki', teacherId: 'u5', students: ['u2'], capacity: 25, term: 'Term 2 2026', subject: 'Language Activities', status: 'active' },
  { id: 'c3', name: 'Grade 6 – Afternoon', teacher: 'Ms. Achieng', teacherId: 'u6', students: ['u3'], capacity: 35, term: 'Term 2 2026', subject: 'Integrated Science', status: 'inactive' },
];

// ── Payments ───────────────────────────────────────────
export const mockPayments = [
  { id: 'p1', date: '2026-05-10', student: 'Amani Kamau', parent: 'Mrs. Wanjiku Kamau', amount: 10000, method: 'M-Pesa', status: 'successful', term: 'Term 2 2026', ref: 'MPESA-AA001' },
  { id: 'p2', date: '2026-05-08', student: 'Baraka Odhiambo', parent: 'Mr. James Odhiambo', amount: 8500, method: 'Bank', status: 'successful', term: 'Term 2 2026', ref: 'BANK-BB002' },
  { id: 'p3', date: '2026-04-30', student: 'Cynthia Mwangi', parent: 'Unknown', amount: 5000, method: 'M-Pesa', status: 'failed', term: 'Term 1 2026', ref: 'MPESA-CC003' },
  { id: 'p4', date: '2026-04-15', student: 'Amani Kamau', parent: 'Mrs. Wanjiku Kamau', amount: 10000, method: 'Cash', status: 'successful', term: 'Term 1 2026', ref: 'CASH-AA004' },
  { id: 'p5', date: '2026-03-20', student: 'Baraka Odhiambo', parent: 'Mr. James Odhiambo', amount: 8500, method: 'M-Pesa', status: 'overdue', term: 'Term 1 2026', ref: 'MPESA-BB005' },
  { id: 'p6', date: '2026-03-01', student: 'Cynthia Mwangi', parent: 'Unknown', amount: 5000, method: 'Bank', status: 'successful', term: 'Term 1 2026', ref: 'BANK-CC006' },
];

// ── Activity Log ───────────────────────────────────────
export const mockActivity = [
  { id: 'a1', user: 'Admin Super', action: 'added user', detail: 'Cynthia Mwangi (student)', time: '2 min ago', color: '#6366f1' },
  { id: 'a2', user: 'Mrs. Wanjiku Kamau', action: 'made payment', detail: 'KES 10,000 via M-Pesa', time: '14 min ago', color: '#10b981' },
  { id: 'a3', user: 'Mr. Kariuki', action: 'logged in', detail: '', time: '28 min ago', color: '#3b82f6' },
  { id: 'a4', user: 'Admin Super', action: 'updated class', detail: 'Grade 4 – Morning capacity', time: '1 hr ago', color: '#8b5cf6' },
  { id: 'a5', user: 'System', action: 'flagged payment', detail: 'MPESA-BB005 as overdue', time: '3 hr ago', color: '#f59e0b' },
  { id: 'a6', user: 'Mrs. Njoroge', action: 'uploaded portfolio', detail: 'Science Project: Plants', time: '5 hr ago', color: '#10b981' },
];

// ── Audit Log ──────────────────────────────────────────
export const mockAuditLog = [
  { id: 'al1', time: '2026-05-12 17:42', user: 'Admin Super', action: 'Changed language setting to Swahili', category: 'Settings' },
  { id: 'al2', time: '2026-05-12 16:20', user: 'Admin Super', action: 'Deactivated user Ms. Achieng', category: 'Users' },
  { id: 'al3', time: '2026-05-12 14:05', user: 'Admin Super', action: 'Updated XP threshold (Level up) from 100 to 150', category: 'Settings' },
  { id: 'al4', time: '2026-05-11 09:18', user: 'Admin Super', action: 'Created class "Grade 6 – Afternoon"', category: 'Classes' },
  { id: 'al5', time: '2026-05-10 11:33', user: 'Admin Super', action: 'Exported financial report (Term 1 2026)', category: 'Finance' },
];

// ── Default Global Config ──────────────────────────────
export const defaultConfig = {
  language: 'en',
  xpLevelUp: 150,
  xpBadge: 300,
  badgesEnabled: true,
  leaderboardEnabled: true,
  notifyPayment: true,
  notifyPortfolio: true,
  notifyAnnouncement: true,
  dataRetentionYears: 5,
  allowParentMessaging: true,
  allowStudentLeaderboard: true,
};

// ── Translations ───────────────────────────────────────
export const translations = {
  en: {
    dashboard: 'Dashboard',
    users: 'User Management',
    classes: 'Class Setup',
    finance: 'Financial Oversight',
    settings: 'System Settings',
    totalStudents: 'Total Students',
    totalTeachers: 'Total Teachers',
    pendingFees: 'Pending Fees',
    activeClasses: 'Active Classes',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    manageUsers: 'Manage Users',
    setupClasses: 'Class Setup',
    viewFinance: 'Financial Reports',
    systemSettings: 'System Settings',
  },
  sw: {
    dashboard: 'Dashibodi',
    users: 'Usimamizi wa Watumiaji',
    classes: 'Usanidi wa Darasa',
    finance: 'Usimamizi wa Fedha',
    settings: 'Mipangilio ya Mfumo',
    totalStudents: 'Jumla ya Wanafunzi',
    totalTeachers: 'Jumla ya Walimu',
    pendingFees: 'Ada Zinazongoja',
    activeClasses: 'Madarasa Yanayofanya Kazi',
    quickActions: 'Vitendo vya Haraka',
    recentActivity: 'Shughuli za Hivi Karibuni',
    manageUsers: 'Simamia Watumiaji',
    setupClasses: 'Sanidi Madarasa',
    viewFinance: 'Ripoti za Fedha',
    systemSettings: 'Mipangilio ya Mfumo',
  },
};
