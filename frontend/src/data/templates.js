/**
 * Resume template gallery data + dummy resume content.
 * Used by the Resume Template Selection module.
 * No backend — static definitions only.
 */

export const resumeTemplates = [
  {
    id: 'classic-ats',
    name: 'Classic ATS',
    description:
      'Clean single-column layout, standard fonts, and simple headers. The safest choice for ATS parsing.',
    isDefault: true,
    accent: {
      text: 'text-brand-red',
      bg: 'bg-brand-red',
      border: 'border-brand-red',
      soft: 'bg-brand-red/10',
    },
    font: 'font-sans',
  },
  {
    id: 'modern-ats',
    name: 'Modern ATS',
    description:
      'Two-column design with a colored sidebar for skills and contact. Modern yet fully ATS-friendly.',
    isDefault: false,
    accent: {
      text: 'text-sky-500',
      bg: 'bg-sky-500',
      border: 'border-sky-500',
      soft: 'bg-sky-500/10',
    },
    font: 'font-sans',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description:
      'Centered header, structured sections, and a professional navy accent. Perfect for finance & consulting.',
    isDefault: false,
    accent: {
      text: 'text-blue-700',
      bg: 'bg-blue-700',
      border: 'border-blue-700',
      soft: 'bg-blue-700/10',
    },
    font: 'font-sans',
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description:
      'Technical layout with a dark header strip and monospace accents. Built for engineers and developers.',
    isDefault: false,
    accent: {
      text: 'text-emerald-600',
      bg: 'bg-emerald-600',
      border: 'border-emerald-600',
      soft: 'bg-emerald-600/10',
    },
    font: 'font-mono',
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description:
      'Metrics-forward layout with highlight chips and a teal accent for data-driven roles.',
    isDefault: false,
    accent: {
      text: 'text-teal-600',
      bg: 'bg-teal-600',
      border: 'border-teal-600',
      soft: 'bg-teal-600/10',
    },
    font: 'font-sans',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description:
      'Ultra-clean, lots of whitespace, thin dividers, and no color distraction. Modern and timeless.',
    isDefault: false,
    accent: {
      text: 'text-neutral-600',
      bg: 'bg-neutral-600',
      border: 'border-neutral-600',
      soft: 'bg-neutral-600/10',
    },
    font: 'font-sans',
  },
];

export const placeholderTemplate = {
  id: 'classic-ats',
  name: 'Classic ATS',
  description:
    'Clean single-column layout, standard fonts, and simple headers. The safest choice for ATS parsing.',
  isDefault: true,
  accent: {
    text: 'text-brand-red',
    bg: 'bg-brand-red',
    border: 'border-brand-red',
    soft: 'bg-brand-red/10',
  },
  font: 'font-sans',
};

export const dummyResume = {
  name: 'Aarav Sharma',
  title: 'Senior Full-Stack Developer',
  email: 'aarav.sharma@email.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  linkedin: 'linkedin.com/in/aaravsharma',
  github: 'github.com/aaravsharma',
  summary:
    'Full-stack developer with 4+ years of experience building scalable web applications. Passionate about clean architecture, AI-driven products, and mentoring junior engineers.',
  education: {
    institution: 'Indian Institute of Technology, Delhi',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    cgpa: '8.7/10',
    gradYear: '2024',
  },
  skills: {
    languages: 'JavaScript, TypeScript, Python, Go',
    frameworks: 'React, Next.js, Node.js, Express, TailwindCSS',
    databases: 'PostgreSQL, MongoDB, Redis',
    tools: 'Git, Docker, Kubernetes, AWS, Figma',
    soft: 'Communication, Leadership, Problem Solving',
  },
  projects: [
    {
      name: 'HireNext AI Platform',
      description:
        'AI-powered recruitment platform with resume parsing, ATS scoring, and candidate ranking using transformers.',
      tech: ['React', 'FastAPI', 'PostgreSQL', 'spaCy'],
      link: 'github.com/aarav/hirenext',
    },
    {
      name: 'DevOps Dashboard',
      description:
        'Real-time deployment monitoring dashboard aggregating CI/CD pipelines, metrics, and alerts across 30+ services.',
      tech: ['Next.js', 'WebSockets', 'Redis', 'Docker'],
      link: 'github.com/aarav/devops-dashboard',
    },
    {
      name: 'ML Model Registry',
      description:
        'Internal tool for versioning, comparing, and deploying ML models with experiment tracking and rollback support.',
      tech: ['Python', 'FastAPI', 'MLflow', 'S3'],
      link: 'github.com/aarav/ml-registry',
    },
  ],
  experience: [
    {
      company: 'TechNova Solutions',
      role: 'Senior Full-Stack Developer',
      duration: '2022 — Present',
      responsibilities:
        'Leading a team of 5 building a multi-tenant SaaS platform. Reduced deployment time by 60% through CI/CD automation and containerization. Designed REST APIs serving 2M+ monthly requests.',
    },
    {
      company: 'StartupX',
      role: 'Software Engineer',
      duration: '2020 — 2022',
      responsibilities:
        'Built customer-facing features for a fintech product used by 50k users. Improved test coverage from 40% to 85% and cut page load time by 45% via code-splitting and caching.',
    },
  ],
  certificates: [
    {
      course: 'AWS Certified Solutions Architect',
      platform: 'Amazon Web Services',
      year: '2023',
    },
    {
      course: 'TensorFlow Developer Certificate',
      platform: 'Coursera',
      year: '2022',
    },
    {
      course: 'Google Cloud Professional Engineer',
      platform: 'Google Cloud',
      year: '2021',
    },
  ],
  achievements: [
    'Winner — Smart India Hackathon 2023 (National level, 1200+ teams)',
    'Top 1% — GitHub contributions 2023 in India',
    'Speaker at JSConf India 2023 on building scalable React architectures',
  ],
  languages: ['English (Fluent)', 'Hindi (Native)', 'Kannada (Conversational)'],
  hobbies: ['Open Source', 'Chess', 'Trail Running', 'Photography'],
};

export function getTemplateById(id) {
  return resumeTemplates.find((t) => t.id === id) || placeholderTemplate;
}
