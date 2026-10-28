/**
 * Central site configuration for HireNext.
 * Update branding, nav links, and platform links here.
 */

export const siteConfig = {
  name: 'HireNext',
  description: 'AI Powered Recruitment & Resume Intelligence Platform',
  url: 'https://hirenext.example.com',
  author: 'HireNext Team',
  links: {
    github: 'https://github.com/hirenext',
    twitter: 'https://twitter.com/hirenext',
  },
  nav: {
    main: [
      { label: 'Home', path: '/' },
      { label: 'Features', path: '/features' },
      { label: 'About', path: '/about' },
    ],
    auth: [
      { label: 'Login', path: '/login' },
      { label: 'Sign Up', path: '/register' },
    ],
  },
recruiter: {
    nav: {
      main: [
        { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Jobs', path: '/dashboard/jobs', icon: 'Briefcase' },
        { label: 'Resumes', path: '/dashboard/resumes', icon: 'FileText' },
        { label: 'Candidates', path: '/dashboard/candidates', icon: 'Users' },
        {
          label: 'Shortlisted',
          path: '/dashboard/shortlisted',
          icon: 'Star',
        },
        { label: 'Interviews', path: '/dashboard/interviews', icon: 'CalendarDays' },
        { label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart3' },
        { label: 'Templates', path: '/dashboard/templates', icon: 'LayoutTemplate' },
        { label: 'Settings', path: '/dashboard/settings', icon: 'Settings' },
      ],
      bottom: [{ label: 'Logout', path: '/logout', icon: 'LogOut' }],
    },
  },
  applicant: {
    nav: {
      main: [
        { label: 'Dashboard', path: '/applicant/dashboard', icon: 'LayoutDashboard' },
        { label: 'Find Jobs', path: '/applicant/jobs', icon: 'Briefcase' },
        { label: 'My Applications', path: '/applicant/applications', icon: 'FileText' },
        { label: 'My Resume', path: '/resume-builder', icon: 'User' },
        {
          label: 'AI Resume Assistant',
          path: '/applicant/ai-resume-assistant',
          icon: 'Sparkles',
        },
        { label: 'Interviews', path: '/applicant/interviews', icon: 'CalendarDays' },
        { label: 'Templates', path: '/resume-templates', icon: 'LayoutTemplate' },
        { label: 'Settings', path: '/applicant/settings', icon: 'Settings' },
      ],
      bottom: [{ label: 'Logout', path: '/logout', icon: 'LogOut' }],
    },
  },
  footer: {
    columns: [
      {
        title: 'Platform',
        links: [
          { label: 'Features', path: '/features' },
          { label: 'Pricing', path: '/pricing' },
          { label: 'About', path: '/about' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Documentation', path: '/docs' },
          { label: 'Support', path: '/support' },
          { label: 'Contact', path: '/contact' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy', path: '/privacy' },
          { label: 'Terms', path: '/terms' },
        ],
      },
    ],
  },
};

export const appConfig = {
  authTokenKey: 'hn_access_token',
  refreshTokenKey: 'hn_refresh_token',
  themeStorageKey: 'hn-theme',
};

