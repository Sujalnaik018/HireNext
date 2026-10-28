const SKILLS = [
  'javascript',
  'typescript',
  'react',
  'next.js',
  'node.js',
  'node',
  'python',
  'java',
  'c++',
  'c#',
  'sql',
  'postgresql',
  'mysql',
  'mongodb',
  'html',
  'css',
  'tailwind',
  'docker',
  'kubernetes',
  'aws',
  'azure',
  'git',
  'github',
  'fastapi',
  'django',
  'flask',
  'machine learning',
  'artificial intelligence',
  'data analysis',
  'excel',
];

function text(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  return String(value).toLowerCase();
}

function hasText(
  source,
  keywords
) {
  const value = text(source);

  return keywords.some(
    (keyword) =>
      value.includes(keyword)
  );
}

export function calculateATSScore(
  resume
) {
  const source = [
    resume?.name,
    resume?.email,
    resume?.phone,
    resume?.summary,
    resume?.professional_summary,
    resume?.skills,
    resume?.experience,
    resume?.education,
    resume?.projects,
    resume?.certifications,
    resume?.linkedin,
    resume?.github,
    resume?.file_name,
    resume?.user?.name,
    resume?.user?.email,
  ]
    .filter(Boolean)
    .join(' ');

  const sections = {
    name: Boolean(
      resume?.name ||
      resume?.user?.name
    ),

    contact: Boolean(
      resume?.email ||
      resume?.user?.email ||
      resume?.phone
    ),

    summary: hasText(
      source,
      [
        'summary',
        'professional summary',
        'objective',
        'profile',
      ]
    ),

    skills: hasText(
      source,
      [
        'skills',
        'technical skills',
        'skill set',
      ]
    ),

    education: hasText(
      source,
      [
        'education',
        'degree',
        'university',
        'college',
        'bachelor',
        'master',
      ]
    ),

    experience: hasText(
      source,
      [
        'experience',
        'work experience',
        'employment',
        'professional experience',
      ]
    ),

    projects: hasText(
      source,
      [
        'projects',
        'project experience',
      ]
    ),

    certifications: hasText(
      source,
      [
        'certification',
        'certifications',
      ]
    ),

    links: hasText(
      source,
      [
        'linkedin',
        'github',
        'portfolio',
        'website',
      ]
    ),
  };

  /* =======================================================
     SKILLS
  ======================================================= */

  const detectedSkills =
    SKILLS.filter((skill) =>
      source.includes(skill)
    );

  const skillCount =
    detectedSkills.length;

  const keywordScore = Math.min(
    100,
    Math.round(
      (skillCount /
        Math.min(
          SKILLS.length,
          10
        )) *
        100
    )
  );

  /* =======================================================
     BREAKDOWN
  ======================================================= */

  const breakdown = {
    contact: sections.contact
      ? 15
      : 0,

    summary: sections.summary
      ? 15
      : 0,

    skills: sections.skills
      ? 20
      : Math.min(
          skillCount * 2,
          20
        ),

    experience: sections.experience
      ? 20
      : 0,

    education: sections.education
      ? 15
      : 0,

    projects: sections.projects
      ? 15
      : 0,
  };

  /* =======================================================
     SCORE
  ======================================================= */

  let score =
    breakdown.contact +
    breakdown.summary +
    breakdown.skills +
    breakdown.experience +
    breakdown.education +
    breakdown.projects;

  if (sections.certifications) {
    score += 2;
  }

  if (sections.links) {
    score += 2;
  }

  score = Math.min(
    100,
    Math.round(score)
  );

  /* =======================================================
     RATING
  ======================================================= */

  let rating;

  if (score >= 85) {
    rating = 'Excellent';
  } else if (score >= 70) {
    rating = 'Good';
  } else if (score >= 50) {
    rating = 'Fair';
  } else {
    rating = 'Needs Improvement';
  }

  /* =======================================================
     RECOMMENDATIONS
  ======================================================= */

  const recommendations = [];

  if (!sections.name) {
    recommendations.push(
      'Add your full name to the resume.'
    );
  }

  if (!sections.contact) {
    recommendations.push(
      'Add contact information such as email and phone number.'
    );
  }

  if (!sections.summary) {
    recommendations.push(
      'Add a professional summary.'
    );
  }

  if (!sections.skills) {
    recommendations.push(
      'Add a dedicated Skills section.'
    );
  }

  if (!sections.experience) {
    recommendations.push(
      'Add professional experience with measurable achievements.'
    );
  }

  if (!sections.education) {
    recommendations.push(
      'Add an Education section.'
    );
  }

  if (!sections.projects) {
    recommendations.push(
      'Add relevant projects.'
    );
  }

  if (!sections.certifications) {
    recommendations.push(
      'Consider adding relevant certifications.'
    );
  }

  if (!sections.links) {
    recommendations.push(
      'Add LinkedIn, GitHub, portfolio, or another professional link.'
    );
  }

  if (skillCount < 5) {
    recommendations.push(
      'Add more job-relevant keywords and technical skills.'
    );
  }

  return {
    score,
    rating,
    keywordScore,
    skillCount,
    detectedSkills,
    sections,
    breakdown,
    recommendations,
  };
}

export default calculateATSScore;