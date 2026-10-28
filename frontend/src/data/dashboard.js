/**
 * Dashboard configuration.
 *
 * Dashboard values are loaded from the backend.
 * This file only contains UI configuration/defaults.
 */

export const stats = [
  {
    id: 'jobs',
    label: 'Total Jobs',
    value: 0,
    status: 'Loading...',
    icon: 'Briefcase',
    trend: 'neutral',
  },
  {
    id: 'resumes',
    label: 'Total Resumes',
    value: 0,
    status: 'Loading...',
    icon: 'FileText',
    trend: 'neutral',
  },
  {
    id: 'shortlisted',
    label: 'Shortlisted Candidates',
    value: 0,
    status: 'Loading...',
    icon: 'Star',
    trend: 'neutral',
  },
  {
    id: 'interviews',
    label: 'Scheduled Interviews',
    value: 0,
    status: 'Loading...',
    icon: 'CalendarDays',
    trend: 'neutral',
  },
];

export const filterOptions = {
  jobs: ['All Jobs'],
  experience: [
    'Any Experience',
    '0-2 yrs',
    '3-5 yrs',
    '5-8 yrs',
    '8+ yrs',
  ],
  skills: ['All Skills'],
};

export const emptyActivityFeed = [];