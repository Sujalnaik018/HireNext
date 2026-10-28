import React from 'react';

/**
 * Safely convert any value into an array.
 *
 * Handles:
 * - ["JavaScript", "Python"]
 * - "JavaScript, Python"
 * - "JavaScript"
 * - { JavaScript: true, Python: true }
 * - null / undefined
 */
function toArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (item === null || item === undefined) return [];

        if (typeof item === 'object') {
          return Object.values(item);
        }

        return [String(item)];
      })
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,;\n|]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .flatMap(([key, val]) => {
        if (Array.isArray(val)) {
          return val.map((item) => String(item));
        }

        if (typeof val === 'string') {
          return val
            .split(/[,;\n|]+/)
            .map((item) => item.trim());
        }

        if (val === true) {
          return [key];
        }

        return [];
      })
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return [String(value)];
}

function safe(value, fallback = '') {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

function getName(resume) {
  return (
    resume?.name ||
    resume?.fullName ||
    resume?.full_name ||
    'Your Name'
  );
}

function getSummary(resume) {
  return (
    resume?.summary ||
    resume?.profile ||
    resume?.objective ||
    ''
  );
}

function getContactItems(resume) {
  return [
    resume?.email,
    resume?.phone,
    resume?.location,
  ].filter(Boolean);
}

function getSocialItems(resume) {
  return [
    resume?.linkedin,
    resume?.github,
  ].filter(Boolean);
}

function normalizeSkills(resume) {
  const skills = resume?.skills;

  if (!skills) {
    return {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
      softSkills: [],
      other: [],
    };
  }

  // Array format:
  // ["JavaScript", "Python", "React"]
  if (Array.isArray(skills)) {
    return {
      languages: toArray(skills),
      frameworks: [],
      databases: [],
      tools: [],
      softSkills: [],
      other: [],
    };
  }

  // String format:
  // "JavaScript, Python, React"
  if (typeof skills === 'string') {
    return {
      languages: toArray(skills),
      frameworks: [],
      databases: [],
      tools: [],
      softSkills: [],
      other: [],
    };
  }

  // Object format:
  // {
  //   languages: ["JavaScript"],
  //   frameworks: ["React"],
  //   databases: ["PostgreSQL"],
  //   tools: ["Git"]
  // }
  if (typeof skills === 'object') {
    return {
      languages: toArray(
        skills.languages ||
        skills.language ||
        skills.programmingLanguages
      ),

      frameworks: toArray(
        skills.frameworks ||
        skills.framework ||
        skills.libraries
      ),

      databases: toArray(
        skills.databases ||
        skills.database
      ),

      tools: toArray(
        skills.tools ||
        skills.tool
      ),

      softSkills: toArray(
        skills.softSkills ||
        skills.soft_skills ||
        skills.soft
      ),

      other: toArray(
        skills.other ||
        skills.additional
      ),
    };
  }

  return {
    languages: [],
    frameworks: [],
    databases: [],
    tools: [],
    softSkills: [],
    other: [],
  };
}

function SkillRow({ label, values }) {
  const items = toArray(values);

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-1">
      <div className="font-semibold text-white">
        {label}:
      </div>

      <div className="text-gray-300">
        {items.join(', ')}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="mb-3 mt-6">
      <h2 className="border-b border-gray-700 pb-2 text-sm font-bold uppercase tracking-wide text-red-500">
        {children}
      </h2>
    </div>
  );
}

function ExperienceSection({ resume }) {
  const experience = Array.isArray(resume?.experience)
    ? resume.experience
    : [];

  if (!experience.length) return null;

  return (
    <>
      <SectionTitle>Experience</SectionTitle>

      <div className="space-y-4">
        {experience.map((item, index) => {
          if (!item) return null;

          const title =
            item.title ||
            item.position ||
            item.role ||
            item.jobTitle ||
            '';

          const company =
            item.company ||
            item.organization ||
            item.employer ||
            '';

          const dates =
            item.dates ||
            item.duration ||
            item.period ||
            item.date ||
            '';

          const location =
            item.location ||
            '';

          const description = item.description ||
            item.summary ||
            '';

          const responsibilities = toArray(
            item.responsibilities ||
            item.bullets ||
            item.achievements
          );

          return (
            <div
              key={`${title}-${company}-${index}`}
              className="rounded-lg border border-gray-800 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  {title && (
                    <h3 className="font-semibold text-white">
                      {title}
                    </h3>
                  )}

                  {company && (
                    <p className="text-sm text-gray-400">
                      {company}
                    </p>
                  )}

                  {location && (
                    <p className="text-xs text-gray-500">
                      {location}
                    </p>
                  )}
                </div>

                {dates && (
                  <div className="text-sm text-gray-400 sm:text-right">
                    {dates}
                  </div>
                )}
              </div>

              {description && (
                <div className="mt-3 text-sm leading-6 text-gray-300">
                  {Array.isArray(description)
                    ? description.map((text, i) => (
                        <p key={i}>{safe(text)}</p>
                      ))
                    : safe(description)}
                </div>
              )}

              {responsibilities.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-300">
                  {responsibilities.map((item, i) => (
                    <li key={i}>{safe(item)}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function EducationSection({ resume }) {
  const education = Array.isArray(resume?.education)
    ? resume.education
    : [];

  if (!education.length) return null;

  return (
    <>
      <SectionTitle>Education</SectionTitle>

      <div className="space-y-4">
        {education.map((item, index) => {
          if (!item) return null;

          const institution =
            item.institution ||
            item.school ||
            item.university ||
            item.college ||
            '';

          const degree =
            item.degree ||
            item.course ||
            item.title ||
            item.program ||
            '';

          const field =
            item.field ||
            item.specialization ||
            '';

          const year =
            item.year ||
            item.duration ||
            item.period ||
            '';

          const cgpa =
            item.cgpa ||
            item.gpa ||
            '';

          return (
            <div
              key={`${institution}-${degree}-${index}`}
              className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                {institution && (
                  <h3 className="font-semibold text-white">
                    {institution}
                  </h3>
                )}

                {degree && (
                  <p className="text-sm text-gray-400">
                    {degree}
                    {field ? ` — ${field}` : ''}
                  </p>
                )}
              </div>

              <div className="text-sm text-gray-400 sm:text-right">
                {year && <div>{year}</div>}
                {cgpa && <div>CGPA: {cgpa}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function ProjectsSection({ resume }) {
  const projects = Array.isArray(resume?.projects)
    ? resume.projects
    : [];

  if (!projects.length) return null;

  return (
    <>
      <SectionTitle>Projects</SectionTitle>

      <div className="space-y-4">
        {projects.map((project, index) => {
          if (!project) return null;

          const name =
            project.name ||
            project.title ||
            '';

          const description =
            project.description ||
            project.summary ||
            '';

          const technologies = toArray(
            project.technologies ||
            project.tech ||
            project.skills
          );

          const link =
            project.link ||
            project.url ||
            '';

          return (
            <div key={`${name}-${index}`}>
              {name && (
                <h3 className="font-semibold text-white">
                  {name}
                </h3>
              )}

              {description && (
                <p className="mt-1 text-sm leading-6 text-gray-300">
                  {safe(description)}
                </p>
              )}

              {technologies.length > 0 && (
                <p className="mt-1 text-sm text-gray-400">
                  <span className="font-semibold text-white">
                    Technologies:
                  </span>{' '}
                  {technologies.join(', ')}
                </p>
              )}

              {link && (
                <p className="mt-1 text-sm text-gray-400">
                  {link}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function CertificationsSection({ resume }) {
  const certifications = Array.isArray(resume?.certifications)
    ? resume.certifications
    : toArray(resume?.certifications);

  if (!certifications.length) return null;

  return (
    <>
      <SectionTitle>Certifications</SectionTitle>

      <ul className="list-disc space-y-1 pl-5 text-sm text-gray-300">
        {certifications.map((item, index) => {
          if (typeof item === 'string') {
            return <li key={index}>{item}</li>;
          }

          const name =
            item?.name ||
            item?.title ||
            item?.certificate ||
            '';

          return (
            <li key={index}>
              {safe(name)}
            </li>
          );
        })}
      </ul>
    </>
  );
}

function AchievementsSection({ resume }) {
  const achievements = toArray(
    resume?.achievements ||
    resume?.awards ||
    resume?.accomplishments
  );

  if (!achievements.length) return null;

  return (
    <>
      <SectionTitle>Achievements</SectionTitle>

      <ul className="list-disc space-y-1 pl-5 text-sm text-gray-300">
        {achievements.map((item, index) => (
          <li key={index}>{safe(item)}</li>
        ))}
      </ul>
    </>
  );
}

export function ExportPreview({ resume = {}, template = {} }) {
  const skills = normalizeSkills(resume);

  const name = getName(resume);

  const headline =
    resume?.title ||
    resume?.headline ||
    resume?.profession ||
    '';

  const summary = getSummary(resume);

  const contactItems = getContactItems(resume);
  const socialItems = getSocialItems(resume);

  return (
    <div
      id="resume-preview"
      className="mx-auto w-full max-w-[850px] overflow-hidden rounded-lg border border-gray-800 bg-[#181818] text-white shadow-xl"
    >
      <div className="p-8 sm:p-10 md:p-12">
        {/* HEADER */}
        <header className="text-center">
          <h1 className="text-3xl font-bold uppercase tracking-wide sm:text-4xl">
            {name}
          </h1>

          {headline && (
            <p className="mt-2 text-base font-medium text-gray-300">
              {headline}
            </p>
          )}

          {contactItems.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-400">
              {contactItems.map((item, index) => (
                <span key={index}>
                  {safe(item)}
                </span>
              ))}
            </div>
          )}

          {socialItems.length > 0 && (
            <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-400">
              {socialItems.map((item, index) => (
                <span key={index}>
                  {safe(item)}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="mt-6 border-t-2 border-blue-500" />

        {/* SUMMARY */}
        {summary && (
          <>
            <SectionTitle>
              Professional Summary
            </SectionTitle>

            <p className="text-sm leading-6 text-gray-300">
              {safe(summary)}
            </p>
          </>
        )}

        {/* SKILLS */}
        <SectionTitle>Technical Skills</SectionTitle>

        <div className="text-sm">
          <SkillRow
            label="Languages"
            values={skills.languages}
          />

          <SkillRow
            label="Frameworks"
            values={skills.frameworks}
          />

          <SkillRow
            label="Databases"
            values={skills.databases}
          />

          <SkillRow
            label="Tools"
            values={skills.tools}
          />

          <SkillRow
            label="Soft Skills"
            values={skills.softSkills}
          />

          <SkillRow
            label="Other"
            values={skills.other}
          />
        </div>

        <ExperienceSection resume={resume} />

        <EducationSection resume={resume} />

        <ProjectsSection resume={resume} />

        <CertificationsSection resume={resume} />

        <AchievementsSection resume={resume} />

        {/* Template footer */}
        {template?.name && (
          <div className="mt-8 border-t border-gray-800 pt-3 text-center text-xs text-gray-600">
            {template.name}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExportPreview;