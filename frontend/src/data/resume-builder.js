/**
 * Dummy data + step definitions for the AI Resume Builder.
 * No backend / AI integration — purely local state & UI.
 */

export const steps = [
  {
    id: 'personal',
    title: 'Personal Details',
    subtitle: 'Let\'s start with who you are.',
    fields: [
      { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Aarav Sharma' },
      { key: 'email', label: 'Email', type: 'email', placeholder: 'aarav@email.com' },
      { key: 'phone', label: 'Phone', type: 'text', placeholder: '+91 98765 43210' },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Bengaluru, India' },
      { key: 'linkedin', label: 'LinkedIn', type: 'text', placeholder: 'linkedin.com/in/aarav' },
      { key: 'github', label: 'GitHub', type: 'text', placeholder: 'github.com/aarav' },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    subtitle: 'Tell us about your education.',
    fields: [
      { key: 'college', label: 'College', type: 'text', placeholder: 'IIT Delhi' },
      { key: 'degree', label: 'Degree', type: 'text', placeholder: 'B.Tech' },
      { key: 'branch', label: 'Branch', type: 'text', placeholder: 'Computer Science' },
      { key: 'cgpa', label: 'CGPA', type: 'text', placeholder: '8.5' },
      { key: 'gradYear', label: 'Graduation Year', type: 'text', placeholder: '2024' },
    ],
  },
  {
    id: 'skills',
    title: 'Technical Skills',
    subtitle: 'List your technical skills.',
    fields: [
      { key: 'programming', label: 'Programming Languages', type: 'text', placeholder: 'JavaScript, Python' },
      { key: 'frameworks', label: 'Frameworks', type: 'text', placeholder: 'React, Node.js' },
      { key: 'databases', label: 'Databases', type: 'text', placeholder: 'PostgreSQL, MongoDB' },
      { key: 'tools', label: 'Tools', type: 'text', placeholder: 'Git, Docker, Figma' },
      { key: 'softSkills', label: 'Soft Skills', type: 'text', placeholder: 'Communication, Leadership' },
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    subtitle: 'Add your projects (one per line set).',
    type: 'list',
    fields: [
      { key: 'name', label: 'Project Name', type: 'text', placeholder: 'HireNext AI' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your project...' },
      { key: 'technologies', label: 'Technologies Used', type: 'text', placeholder: 'React, Python' },
      { key: 'link', label: 'GitHub Link (Optional)', type: 'text', placeholder: 'github.com/...' },
    ],
  },
  {
    id: 'experience',
    title: 'Experience',
    subtitle: 'Add your work experience (one per line set).',
    type: 'list',
    fields: [
      { key: 'company', label: 'Company', type: 'text', placeholder: 'Google' },
      { key: 'role', label: 'Role', type: 'text', placeholder: 'Frontend Engineer' },
      { key: 'duration', label: 'Duration', type: 'text', placeholder: '2022 - 2024' },
      { key: 'responsibilities', label: 'Responsibilities', type: 'textarea', placeholder: 'Describe your responsibilities...' },
    ],
  },
  {
    id: 'certificates',
    title: 'Certificates',
    subtitle: 'Add your certifications (one per line set).',
    type: 'list',
    fields: [
      { key: 'course', label: 'Course', type: 'text', placeholder: 'AWS Certified Developer' },
      { key: 'platform', label: 'Platform', type: 'text', placeholder: 'Coursera' },
      { key: 'year', label: 'Year', type: 'text', placeholder: '2023' },
    ],
  },
  {
    id: 'achievements',
    title: 'Achievements',
    subtitle: 'Keep it short and impactful.',
    fields: [
      { key: 'achievements', label: 'Achievements', type: 'textarea', placeholder: 'Won 1st place at Hackathon...' },
      { key: 'languages', label: 'Languages', type: 'text', placeholder: 'English, Hindi' },
      { key: 'hobbies', label: 'Hobbies', type: 'text', placeholder: 'Coding, Chess' },
    ],
  },
];

export const initialResume = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
  },
  education: {
    college: '',
    degree: '',
    branch: '',
    cgpa: '',
    gradYear: '',
  },
  skills: {
    programming: '',
    frameworks: '',
    databases: '',
    tools: '',
    softSkills: '',
  },
  projects: [],
  experience: [],
  certificates: [],
  achievements: {
    achievements: '',
    languages: '',
    hobbies: '',
  },
};

export const initialProject = {
  name: '',
  description: '',
  technologies: '',
  link: '',
};

export const initialExperience = {
  company: '',
  role: '',
  duration: '',
  responsibilities: '',
};

export const initialCertificate = {
  course: '',
  platform: '',
  year: '',
};

export const chatIntroMessage =
  "Hi! I'm HireNext AI. Let's build your ATS-friendly resume. We'll go through 7 quick steps. Click 'Next' to begin.";
