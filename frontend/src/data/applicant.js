/**
 * Dummy data for the Applicant Dashboard.
 * Kept isolated so it can be swapped for API-driven data later.
 */

export const applicantInfo = {
  name: 'Aarav Sharma',
  firstName: 'Aarav',
  email: 'aarav.sharma@example.com',
};

export const applicantStats = [
  {
    id: 'resume-score',
    label: 'Resume Score',
    value: 82,
    status: '+5 this month',
    icon: 'FileText',
    trend: 'up',
  },
  {
    id: 'ats-score',
    label: 'ATS Score',
    value: 74,
    status: 'Needs improvement',
    icon: 'Gauge',
    trend: 'neutral',
  },
  {
    id: 'jobs-applied',
    label: 'Jobs Applied',
    value: 23,
    status: '+3 this week',
    icon: 'Send',
    trend: 'up',
  },
  {
    id: 'interview-calls',
    label: 'Interview Calls',
    value: 5,
    status: '2 upcoming',
    icon: 'Phone',
    trend: 'up',
  },
];

export const resumeProgress = {
  value: 78,
  label: 'Resume Completion',
  sections: [
    { name: 'Contact Info', complete: true },
    { name: 'Work Experience', complete: true },
    { name: 'Education', complete: true },
    { name: 'Skills', complete: true },
    { name: 'Projects', complete: false },
    { name: 'Certifications', complete: false },
  ],
};

export const recentApplications = [
  {
    id: 1,
    company: 'Google',
    role: 'Senior Frontend Engineer',
    appliedDate: 'Oct 12, 2025',
    status: 'Under Review',
  },
  {
    id: 2,
    company: 'Stripe',
    role: 'Product Designer',
    appliedDate: 'Oct 09, 2025',
    status: 'Shortlisted',
  },
  {
    id: 3,
    company: 'Netflix',
    role: 'Frontend Engineer',
    appliedDate: 'Oct 05, 2025',
    status: 'Interview',
  },
  {
    id: 4,
    company: 'Spotify',
    role: 'UI Engineer',
    appliedDate: 'Sep 28, 2025',
    status: 'Applied',
  },
  {
    id: 5,
    company: 'Amazon',
    role: 'Web Developer',
    appliedDate: 'Sep 20, 2025',
    status: 'Rejected',
  },
];

export const recommendedJobs = [
  {
    id: 1,
    company: 'Google',
    initials: 'G',
    title: 'Senior Frontend Engineer',
    location: 'Bengaluru, India',
    salary: '$85k - $110k',
    type: 'Full-time',
  },
  {
    id: 2,
    company: 'Stripe',
    initials: 'S',
    title: 'Product Designer',
    location: 'Remote',
    salary: '$80k - $105k',
    type: 'Full-time',
  },
  {
    id: 3,
    company: 'Netflix',
    initials: 'N',
    title: 'Frontend Engineer',
    location: 'Los Angeles, CA',
    salary: '$120k - $150k',
    type: 'Full-time',
  },
  {
    id: 4,
    company: 'Microsoft',
    initials: 'M',
    title: 'React Developer',
    location: 'Hyderabad, India',
    salary: '$70k - $95k',
    type: 'Full-time',
  },
  {
    id: 5,
    company: 'Spotify',
    initials: 'S',
    title: 'UI Engineer',
    location: 'Stockholm, Sweden',
    salary: '$90k - $115k',
    type: 'Hybrid',
  },
  {
    id: 6,
    company: 'Amazon',
    initials: 'A',
    title: 'Web Developer',
    location: 'Seattle, WA',
    salary: '$95k - $130k',
    type: 'Full-time',
  },
];

export const resumeSuggestions = [
  {
    id: 1,
    title: 'Add more technical skills',
    description:
      'Add React, TypeScript, and Tailwind CSS to your skills section to match more job descriptions.',
    icon: 'Sparkles',
  },
  {
    id: 2,
    title: 'Improve project descriptions',
    description:
      'Quantify your project impact with metrics like "increased performance by 40%".',
    icon: 'PenLine',
  },
  {
    id: 3,
    title: 'Add certifications',
    description:
      'Add AWS Certified Developer or Google UX certificates to boost your ATS score.',
    icon: 'Award',
  },
  {
    id: 4,
    title: 'Increase keyword matching',
    description:
      'Include keywords like "responsive design" and "CI/CD" to align with job postings.',
    icon: 'Target',
  },
];

export const upcomingInterviews = [
  {
    id: 1,
    company: 'Google',
    role: 'Senior Frontend Engineer',
    date: 'Oct 18, 2025',
    time: '10:00 AM',
    type: 'Video',
  },
  {
    id: 2,
    company: 'Stripe',
    role: 'Product Designer',
    date: 'Oct 21, 2025',
    time: '2:30 PM',
    type: 'Phone',
  },
  {
    id: 3,
    company: 'Netflix',
    role: 'Frontend Engineer',
    date: 'Oct 25, 2025',
    time: '11:00 AM',
    type: 'Onsite',
  },
];

