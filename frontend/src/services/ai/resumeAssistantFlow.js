/**
 * Local AI Resume Assistant flow definition.
 *
 * This module keeps the chatbot logic separated from the UI so a real AI
 * service can be connected later. The future architecture:
 *
 *   Applicant message → Frontend → Backend API → AI Model
 *     → Structured Resume Data → Frontend → Resume Builder
 *     → Selected Template → Resume Export
 *
 * For now, all data lives in local state and questions are predefined.
 */

/**
 * Sections the assistant collects, in order.
 * `multi: true` sections collect multiple entries.
 */
export const resumeSections = [
  { id: 'personalInfo', label: 'Personal Information' },
  { id: 'summary', label: 'Professional Summary' },
  { id: 'education', label: 'Education', multi: true },
  { id: 'experience', label: 'Work Experience', multi: true },
  { id: 'skills', label: 'Skills', multi: true },
  { id: 'projects', label: 'Projects', multi: true },
  { id: 'certifications', label: 'Certifications', multi: true },
  { id: 'achievements', label: 'Achievements', multi: true },
  { id: 'extras', label: 'Extra Information', multi: true },
];

/**
 * A clean, serializable resume object ready to be sent to a backend API later.
 */
export function createEmptyResume() {
  return {
    personalInfo: {},
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    extra: [],
  };
}

/**
 * Sequential questions the assistant asks one at a time.
 * Each question maps an answer into the resume object.
 */
export const questions = [
  // ---- Personal Information ----
  {
    id: 'fullName',
    section: 'personalInfo',
    field: 'fullName',
    question:
      "Hi! I'm your HireNext AI Resume Assistant. I'll help you create an ATS-friendly resume. Let's start with your name. What should we call you?",
  },
  {
    id: 'email',
    section: 'personalInfo',
    field: 'email',
    question: 'Great! What is your email address?',
  },
  {
    id: 'phone',
    section: 'personalInfo',
    field: 'phone',
    question: 'Perfect. What is your phone number?',
  },
  {
    id: 'location',
    section: 'personalInfo',
    field: 'location',
    question: 'Where are you located? (City, Country)',
  },
  {
    id: 'linkedin',
    section: 'personalInfo',
    field: 'linkedin',
    question: "What's your LinkedIn profile URL? (type 'skip' if you don't have one)",
  },
  {
    id: 'github',
    section: 'personalInfo',
    field: 'github',
    question: "Do you have a GitHub profile? (type 'skip' if not)",
  },
  {
    id: 'portfolio',
    section: 'personalInfo',
    field: 'portfolio',
    question: "Do you have a portfolio website? (type 'skip' if not)",
  },

  // ---- Professional Summary ----
  {
    id: 'summary',
    section: 'summary',
    field: 'summary',
    question:
      'Tell me briefly about yourself and your career goals. This will become your professional summary.',
  },

  // ---- Education ----
  { id: 'ed_degree', section: 'education', field: 'degree', question: "What's your highest degree? (e.g. B.Tech, M.Sc)" },
  { id: 'ed_college', section: 'education', field: 'college', question: 'Which college or university did you attend?' },
  { id: 'ed_location', section: 'education', field: 'location', question: 'Where is it located? (City, Country)' },
  { id: 'ed_start', section: 'education', field: 'startYear', question: 'What year did you start?' },
  { id: 'ed_end', section: 'education', field: 'endYear', question: 'What year did you finish (or expect to finish)?' },
  { id: 'ed_score', section: 'education', field: 'score', question: 'What was your CGPA or percentage?' },
  { id: 'ed_continue', section: 'education', field: '__continue__', question: 'Would you like to add another education entry? (yes/no)' },

  // ---- Work Experience ----
  { id: 'ex_title', section: 'experience', field: 'jobTitle', question: "What was your job title?" },
  { id: 'ex_company', section: 'experience', field: 'company', question: 'Which company did you work at?' },
  { id: 'ex_location', section: 'experience', field: 'location', question: 'Where was the job located?' },
  { id: 'ex_start', section: 'experience', field: 'startDate', question: 'When did you start? (e.g. Jan 2022)' },
  { id: 'ex_end', section: 'experience', field: 'endDate', question: "When did you finish? (or 'current' if still working)" },
  { id: 'ex_resp', section: 'experience', field: 'responsibilities', question: 'What were your key responsibilities?' },
  { id: 'ex_ach', section: 'experience', field: 'achievements', question: 'Any notable achievements or impact?' },
  { id: 'ex_continue', section: 'experience', field: '__continue__', question: 'Would you like to add another work experience? (yes/no)' },

  // ---- Skills ----
  { id: 'sk_tech', section: 'skills', field: 'technical', question: 'What are your technical skills? (comma separated)' },
  { id: 'sk_soft', section: 'skills', field: 'soft', question: 'What are your soft skills? (comma separated)' },
  { id: 'sk_lang', section: 'skills', field: 'languages', question: 'Which programming languages do you know?' },
  { id: 'sk_frameworks', section: 'skills', field: 'frameworks', question: 'Which frameworks or libraries do you use?' },
  { id: 'sk_tools', section: 'skills', field: 'tools', question: 'Which tools do you work with?' },
  { id: 'sk_databases', section: 'skills', field: 'databases', question: 'Which databases are you familiar with?' },
  { id: 'sk_continue', section: 'skills', field: '__continue__', question: 'Would you like to add more skills? (yes/no)' },

  // ---- Projects ----
  { id: 'pj_name', section: 'projects', field: 'name', question: "What's the name of your project?" },
  { id: 'pj_desc', section: 'projects', field: 'description', question: 'Briefly describe the project and its purpose.' },
  { id: 'pj_tech', section: 'projects', field: 'technologies', question: 'What technologies were used?' },
  { id: 'pj_role', section: 'projects', field: 'role', question: 'What was your role in the project?' },
  { id: 'pj_link', section: 'projects', field: 'link', question: 'Do you have a project link? (type skip if not)' },
  { id: 'pj_continue', section: 'projects', field: '__continue__', question: 'Would you like to add another project? (yes/no)' },

  // ---- Certifications ----
  { id: 'ce_name', section: 'certifications', field: 'name', question: "What's the name of your certification?" },
  { id: 'ce_org', section: 'certifications', field: 'organization', question: 'Which organization issued it?' },
  { id: 'ce_date', section: 'certifications', field: 'issueDate', question: 'When was it issued?' },
  { id: 'ce_id', section: 'certifications', field: 'credentialId', question: 'Do you have a credential ID? (type skip if not)' },
  { id: 'ce_url', section: 'certifications', field: 'credentialUrl', question: 'Do you have a credential URL? (type skip if not)' },
  { id: 'ce_continue', section: 'certifications', field: '__continue__', question: 'Would you like to add another certification? (yes/no)' },

  // ---- Achievements ----
  { id: 'ac_title', section: 'achievements', field: 'title', question: 'What achievement would you like to highlight?' },
  { id: 'ac_desc', section: 'achievements', field: 'description', question: 'Give a short description of this achievement.' },
  { id: 'ac_continue', section: 'achievements', field: '__continue__', question: 'Would you like to add another achievement? (yes/no)' },

  // ---- Extra Information ----
  { id: 'ex_languages', section: 'extras', field: 'languages', question: 'What languages do you speak? (comma separated)' },
  { id: 'ex_interests', section: 'extras', field: 'interests', question: 'What are your interests or hobbies?' },
  { id: 'ex_volunteer', section: 'extras', field: 'volunteer', question: 'Any volunteer experience? (type skip if none)' },
  { id: 'ex_other', section: 'extras', field: 'other', question: 'Any other relevant information you want to include?' },
];

/**
 * Determine which questions belong to a given section.
 * A section is "complete" once all of its non-continue questions have been answered.
 */
export function questionsForSection(sectionId) {
  return questions.filter((q) => q.section === sectionId && q.field !== '__continue__');
}

/**
 * Apply an answer to the resume object based on a question.
 * Returns a new resume object (immutable update).
 */
export function applyAnswer(resume, question, answer) {
  const { section, field } = question;
  const next = { ...resume };

  if (field === '__continue__') {
    return next;
  }

  if (section === 'personalInfo') {
    next.personalInfo = { ...next.personalInfo, [field]: answer };
    return next;
  }

  if (section === 'summary') {
    next.summary = answer;
    return next;
  }

  if (section === 'skills') {
    // skills are stored as an array of strings
    const items = answer
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    next.skills = [...next.skills, ...items];
    return next;
  }

  if (section === 'extras') {
    next.extra = [...next.extra, { [field]: answer }];
    return next;
  }

  // Multi-entry object sections (education, experience, projects, etc.)
  const lastIndex = Array.isArray(next[section]) ? next[section].length - 1 : -1;
  const entry = lastIndex >= 0 ? { ...next[section][lastIndex] } : {};
  entry[field] = answer;

  if (lastIndex >= 0) {
    const updated = [...next[section]];
    updated[lastIndex] = entry;
    next[section] = updated;
  } else {
    next[section] = [entry];
  }

  return next;
}

/**
 * Compute completion percentage based on answered sections.
 */
export function computeProgress(resume) {
  const answered = (sectionId) => {
    const section = resume[sectionId];
    if (sectionId === 'personalInfo') {
      return Object.keys(resume.personalInfo || {}).length;
    }
    if (sectionId === 'summary') {
      return resume.summary ? 1 : 0;
    }
    if (Array.isArray(section)) {
      return section.length;
    }
    return 0;
  };

  const total = resumeSections.length;
  const done = resumeSections.filter((s) => answered(s.id) > 0).length;
  return Math.min(100, Math.round((done / total) * 100));
}

/**
 * Determine which sections have been started (for the status checklist).
 */
export function getCompletedSections(resume) {
  return resumeSections.map((s) => ({
    id: s.id,
    label: s.label,
    complete:
      s.id === 'personalInfo'
        ? Object.keys(resume.personalInfo || {}).length > 0
        : s.id === 'summary'
          ? Boolean(resume.summary)
          : Array.isArray(resume[s.id]) && resume[s.id].length > 0,
  }));
}
