/**
 * HireNext Resume Adapter
 *
 * This file is the single compatibility layer between:
 *
 * AI Resume Assistant
 *        ↓
 * Canonical Resume
 *        ↓
 * Resume Builder
 *        ↓
 * Templates / Preview / Export
 *
 * IMPORTANT:
 * Keep all resume conversion functions in this file.
 */

/* =========================================================
   EMPTY / DEFAULT RESUME
========================================================= */

export function createEmptyResumeData() {
  return {
    name: '',
    fullName: '',
    full_name: '',

    email: '',
    phone: '',
    location: '',

    linkedin: '',
    github: '',
    portfolio: '',

    title: '',
    headline: '',
    profession: '',

    summary: '',
    profile: '',
    objective: '',

    skills: {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
      softSkills: [],
    },

    education: [],

    experience: [],

    projects: [],

    certifications: [],

    achievements: [],

    languages: [],

    interests: [],

    references: [],
  };
}


/* =========================================================
   HELPERS
========================================================= */

function safe(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined || value === '') {
    return [];
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [value];
}

function normalizeStringArray(value) {
  return toArray(value)
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim();
      }

      if (item && typeof item === 'object') {
        return (
          item.name ||
          item.title ||
          item.value ||
          item.label ||
          ''
        );
      }

      return safe(item);
    })
    .filter(Boolean);
}

function normalizeSkills(skills) {
  /*
   * Supports:
   *
   * {
   *   languages: [],
   *   frameworks: [],
   *   databases: [],
   *   tools: [],
   *   softSkills: []
   * }
   *
   * AND:
   *
   * {
   *   Languages: [],
   *   Frameworks: []
   * }
   *
   * AND a simple array:
   *
   * ["JavaScript", "Python"]
   */

  if (Array.isArray(skills)) {
    return {
      languages: normalizeStringArray(skills),
      frameworks: [],
      databases: [],
      tools: [],
      softSkills: [],
    };
  }

  if (!skills || typeof skills !== 'object') {
    return {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
      softSkills: [],
    };
  }

  return {
    languages: normalizeStringArray(
      skills.languages ||
      skills.Languages ||
      skills.language ||
      []
    ),

    frameworks: normalizeStringArray(
      skills.frameworks ||
      skills.Frameworks ||
      skills.framework ||
      []
    ),

    databases: normalizeStringArray(
      skills.databases ||
      skills.Databases ||
      skills.database ||
      []
    ),

    tools: normalizeStringArray(
      skills.tools ||
      skills.Tools ||
      []
    ),

    softSkills: normalizeStringArray(
      skills.softSkills ||
      skills.soft_skills ||
      skills['Soft Skills'] ||
      skills.SoftSkills ||
      []
    ),
  };
}


/* =========================================================
   NORMALIZE EDUCATION
========================================================= */

function normalizeEducation(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    if (typeof item === 'string') {
      return {
        degree: item,
        course: item,
        institution: '',
        school: '',
        university: '',
        year: '',
        duration: '',
        period: '',
        cgpa: '',
        grade: '',
        description: '',
      };
    }

    return {
      ...item,

      degree:
        item.degree ||
        item.course ||
        item.title ||
        '',

      course:
        item.course ||
        item.degree ||
        item.title ||
        '',

      institution:
        item.institution ||
        item.school ||
        item.university ||
        '',

      school:
        item.school ||
        item.institution ||
        '',

      university:
        item.university ||
        item.institution ||
        '',

      year:
        item.year ||
        item.duration ||
        item.period ||
        '',

      duration:
        item.duration ||
        item.year ||
        '',

      period:
        item.period ||
        item.year ||
        '',

      cgpa:
        item.cgpa ||
        item.gpa ||
        '',

      grade:
        item.grade ||
        '',

      description:
        item.description ||
        '',
    };
  });
}


/* =========================================================
   NORMALIZE EXPERIENCE
========================================================= */

function normalizeExperience(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    if (typeof item === 'string') {
      return {
        title: item,
        position: item,
        role: item,
        company: '',
        organization: '',
        dates: '',
        duration: '',
        period: '',
        description: '',
        summary: '',
        responsibilities: [],
      };
    }

    return {
      ...item,

      title:
        item.title ||
        item.position ||
        item.role ||
        '',

      position:
        item.position ||
        item.title ||
        item.role ||
        '',

      role:
        item.role ||
        item.title ||
        item.position ||
        '',

      company:
        item.company ||
        item.organization ||
        '',

      organization:
        item.organization ||
        item.company ||
        '',

      dates:
        item.dates ||
        item.duration ||
        item.period ||
        '',

      duration:
        item.duration ||
        item.dates ||
        '',

      period:
        item.period ||
        item.dates ||
        '',

      description:
        item.description ||
        item.summary ||
        '',

      summary:
        item.summary ||
        item.description ||
        '',

      responsibilities:
        normalizeStringArray(
          item.responsibilities ||
          item.bullets ||
          []
        ),
    };
  });
}


/* =========================================================
   NORMALIZE PROJECTS
========================================================= */

function normalizeProjects(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    if (typeof item === 'string') {
      return {
        name: item,
        title: item,
        description: '',
        summary: '',
        technologies: [],
        techStack: [],
        link: '',
        url: '',
      };
    }

    return {
      ...item,

      name:
        item.name ||
        item.title ||
        '',

      title:
        item.title ||
        item.name ||
        '',

      description:
        item.description ||
        item.summary ||
        '',

      summary:
        item.summary ||
        item.description ||
        '',

      technologies:
        normalizeStringArray(
          item.technologies ||
          item.techStack ||
          item.tech_stack ||
          []
        ),

      techStack:
        normalizeStringArray(
          item.techStack ||
          item.technologies ||
          []
        ),

      link:
        item.link ||
        item.url ||
        '',

      url:
        item.url ||
        item.link ||
        '',
    };
  });
}


/* =========================================================
   NORMALIZE CERTIFICATIONS
========================================================= */

function normalizeCertifications(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    if (typeof item === 'string') {
      return {
        name: item,
        title: item,
        certificate: item,
        issuer: '',
        year: '',
      };
    }

    return {
      ...item,

      name:
        item.name ||
        item.title ||
        item.certificate ||
        '',

      title:
        item.title ||
        item.name ||
        '',

      certificate:
        item.certificate ||
        item.name ||
        '',

      issuer:
        item.issuer ||
        item.organization ||
        '',

      year:
        item.year ||
        '',
    };
  });
}


/* =========================================================
   CANONICAL NORMALIZER
========================================================= */

export function normalizeResume(resume = {}) {
  const base = createEmptyResumeData();

  const source =
    resume && typeof resume === 'object'
      ? resume
      : {};

  return {
    ...base,
    ...source,

    name:
      source.name ||
      source.fullName ||
      source.full_name ||
      '',

    fullName:
      source.fullName ||
      source.name ||
      source.full_name ||
      '',

    full_name:
      source.full_name ||
      source.fullName ||
      source.name ||
      '',

    email:
      source.email ||
      '',

    phone:
      source.phone ||
      '',

    location:
      source.location ||
      '',

    linkedin:
      source.linkedin ||
      source.linkedIn ||
      '',

    github:
      source.github ||
      source.gitHub ||
      '',

    portfolio:
      source.portfolio ||
      source.website ||
      '',

    title:
      source.title ||
      source.headline ||
      source.profession ||
      '',

    headline:
      source.headline ||
      source.title ||
      source.profession ||
      '',

    profession:
      source.profession ||
      source.title ||
      source.headline ||
      '',

    summary:
      source.summary ||
      source.profile ||
      source.objective ||
      '',

    profile:
      source.profile ||
      source.summary ||
      '',

    objective:
      source.objective ||
      source.summary ||
      '',

    skills: normalizeSkills(source.skills),

    education: normalizeEducation(
      source.education
    ),

    experience: normalizeExperience(
      source.experience
    ),

    projects: normalizeProjects(
      source.projects
    ),

    certifications: normalizeCertifications(
      source.certifications
    ),

    achievements: normalizeStringArray(
      source.achievements
    ),

    languages: normalizeStringArray(
      source.languages
    ),

    interests: normalizeStringArray(
      source.interests
    ),

    references: normalizeStringArray(
      source.references
    ),
  };
}


/* =========================================================
   AI → CANONICAL
========================================================= */

/**
 * Used by AI Resume Assistant.
 */
export function aiResumeToCanonical(aiResume = {}) {
  return normalizeResume(aiResume);
}


/**
 * Compatibility alias.
 */
export function aiToCanonical(aiResume = {}) {
  return aiResumeToCanonical(aiResume);
}


/**
 * Compatibility alias for older AI assistant code.
 */
export function aiResumeToCanon(aiResume = {}) {
  return aiResumeToCanonical(aiResume);
}


/* =========================================================
   BUILDER → CANONICAL
========================================================= */

/**
 * Used by Resume Builder.
 */
export function builderToCanonical(builderResume = {}) {
  return normalizeResume(builderResume);
}


/**
 * Compatibility alias.
 */
export function builderToCanon(builderResume = {}) {
  return builderToCanonical(builderResume);
}


/* =========================================================
   CANONICAL → BUILDER
========================================================= */

/**
 * Used when opening existing resume data inside Resume Builder.
 */
export function canonicalToBuilder(canonicalResume = {}) {
  const resume = normalizeResume(canonicalResume);

  return {
    ...resume,

    name: resume.name,
    fullName: resume.fullName,

    email: resume.email,
    phone: resume.phone,
    location: resume.location,

    linkedin: resume.linkedin,
    github: resume.github,
    portfolio: resume.portfolio,

    title: resume.title,
    headline: resume.headline,
    profession: resume.profession,

    summary: resume.summary,

    skills: {
      languages: [...resume.skills.languages],
      frameworks: [...resume.skills.frameworks],
      databases: [...resume.skills.databases],
      tools: [...resume.skills.tools],
      softSkills: [...resume.skills.softSkills],
    },

    education: resume.education.map((item) => ({
      ...item,
    })),

    experience: resume.experience.map((item) => ({
      ...item,
    })),

    projects: resume.projects.map((item) => ({
      ...item,
    })),

    certifications: resume.certifications.map((item) => ({
      ...item,
    })),

    achievements: [...resume.achievements],

    languages: [...resume.languages],

    interests: [...resume.interests],

    references: [...resume.references],
  };
}


/* =========================================================
   CANONICAL → EXPORT
========================================================= */

/**
 * Used by Resume Export page.
 */
export function canonicalToExport(canonicalResume = {}) {
  const resume = normalizeResume(canonicalResume);

  return {
    ...resume,

    name: resume.name,
    fullName: resume.fullName,

    email: resume.email,
    phone: resume.phone,
    location: resume.location,

    linkedin: resume.linkedin,
    github: resume.github,
    portfolio: resume.portfolio,

    title: resume.title,
    headline: resume.headline,
    profession: resume.profession,

    summary: resume.summary,

    skills: {
      languages: [...resume.skills.languages],
      frameworks: [...resume.skills.frameworks],
      databases: [...resume.skills.databases],
      tools: [...resume.skills.tools],
      softSkills: [...resume.skills.softSkills],
    },

    education: [...resume.education],

    experience: [...resume.experience],

    projects: [...resume.projects],

    certifications: [...resume.certifications],

    achievements: [...resume.achievements],

    languages: [...resume.languages],

    interests: [...resume.interests],

    references: [...resume.references],
  };
}


/* =========================================================
   EXPORT → CANONICAL
========================================================= */

export function exportToCanonical(exportResume = {}) {
  return normalizeResume(exportResume);
}


/* =========================================================
   GENERIC CONVERTERS
========================================================= */

export function toCanonicalResume(resume = {}) {
  return normalizeResume(resume);
}

export function fromCanonicalResume(resume = {}) {
  return normalizeResume(resume);
}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  createEmptyResumeData,
  normalizeResume,

  aiResumeToCanonical,
  aiToCanonical,
  aiResumeToCanon,

  builderToCanonical,
  builderToCanon,

  canonicalToBuilder,
  canonicalToExport,

  exportToCanonical,

  toCanonicalResume,
  fromCanonicalResume,
};