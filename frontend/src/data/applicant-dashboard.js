/**
 * Dummy data for the Applicant Dashboard (/applicant/dashboard).
 * Local, static definitions only — no backend.
 * Structured so it can be swapped for API-driven data later.
 */

export const applicantProfile = {
  name: 'Aarav Sharma',
  firstName: 'Aarav',
  email: 'aarav.sharma@email.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  linkedin: 'linkedin.com/in/aaravsharma',
  github: 'github.com/aaravsharma',
};

/**
 * Profile identity used by the shared layout/navbar for the Applicant Dashboard.
 * Derived from the dummy applicant profile. Keep it distinct from the recruiter.
 */
export const applicantUser = {
  name: 'Aarav Sharma',
  initials: 'AS',
  role: 'Applicant',
  email: 'aarav.sharma@email.com',
};

export const resumeStatus = {
  completion: 85,
  templateName: 'Professional',
  lastUpdated: 'Today',
  atsScore: 82,
  sections: [
    { name: 'Contact Info', complete: true },
    { name: 'Summary', complete: true },
    { name: 'Work Experience', complete: true },
    { name: 'Education', complete: true },
    { name: 'Skills', complete: true },
    { name: 'Projects', complete: false },
    { name: 'Certifications', complete: false },
  ],
};

export const recommendedJobs = [
  {
    id: 1,
    title: 'Senior Python Developer',
    company: 'TechNova',
    location: 'Mumbai',
    experience: '2-4 years',
    skills: ['Python', 'FastAPI', 'SQL', 'Docker'],
    match: 96,
  },
  {
    id: 2,
    title: 'Senior Frontend Engineer',
    company: 'Google',
    location: 'Bengaluru, India',
    experience: '4+ years',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    match: 92,
  },
  {
    id: 3,
    title: 'Full-Stack Developer',
    company: 'StartupX',
    location: 'Remote',
    experience: '3+ years',
    skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
    match: 89,
  },
  {
    id: 4,
    title: 'Data Engineer',
    company: 'DataCore',
    location: 'Hyderabad',
    experience: '3+ years',
    skills: ['Python', 'Spark', 'Airflow', 'Snowflake'],
    match: 85,
  },
  {
    id: 5,
    title: 'Backend Engineer',
    company: 'FinLeap',
    location: 'Pune',
    experience: '2+ years',
    skills: ['Go', 'Docker', 'Kubernetes', 'Redis'],
    match: 81,
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    company: 'Cloudify',
    location: 'Remote',
    experience: '2+ years',
    skills: ['AWS', 'Terraform', 'CI/CD', 'Linux'],
    match: 78,
  },
];

export const applications = [
  {
    id: 1,
    job: 'Python Developer',
    company: 'TechNova',
    appliedDate: '20 Jul 2025',
    matchScore: 96,
    status: 'Interview',
  },
  {
    id: 2,
    job: 'Senior Frontend Engineer',
    company: 'Google',
    appliedDate: '14 Jul 2025',
    matchScore: 92,
    status: 'Under Review',
  },
  {
    id: 3,
    job: 'Full-Stack Developer',
    company: 'StartupX',
    appliedDate: '08 Jul 2025',
    matchScore: 89,
    status: 'Shortlisted',
  },
  {
    id: 4,
    job: 'Data Engineer',
    company: 'DataCore',
    appliedDate: '02 Jul 2025',
    matchScore: 85,
    status: 'Applied',
  },
  {
    id: 5,
    job: 'Backend Engineer',
    company: 'FinLeap',
    appliedDate: '25 Jun 2025',
    matchScore: 81,
    status: 'Rejected',
  },
];

export const upcomingInterviews = [
  {
    id: 1,
    company: 'TechNova',
    job: 'Python Developer',
    date: '24 Jul 2025',
    time: '10:00 AM',
    type: 'Video',
    status: 'Confirmed',
  },
  {
    id: 2,
    company: 'Google',
    job: 'Senior Frontend Engineer',
    date: '28 Jul 2025',
    time: '2:30 PM',
    type: 'Phone',
    status: 'Scheduled',
  },
  {
    id: 3,
    company: 'StartupX',
    job: 'Full-Stack Developer',
    date: '01 Aug 2025',
    time: '11:00 AM',
    type: 'Onsite',
    status: 'Pending',
  },
];

export const quickActions = [
  {
    id: 'create',
    label: 'Create Resume',
    description: 'Build a new ATS-friendly resume',
    icon: 'FilePlus2',
    to: '/resume-builder',
  },
  {
    id: 'upload',
    label: 'Upload Resume',
    description: 'Import an existing resume',
    icon: 'Upload',
    to: '/resume-builder',
  },
  {
    id: 'browse',
    label: 'Browse Jobs',
    description: 'Explore AI-matched openings',
    icon: 'Briefcase',
    to: '/applicant/dashboard',
  },
  {
    id: 'applications',
    label: 'My Applications',
    description: 'Track your submissions',
    icon: 'Send',
    to: '/applicant/dashboard',
  },
];
