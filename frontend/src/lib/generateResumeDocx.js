import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';

import { saveAs } from 'file-saver';

function safe(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function toArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (item === null || item === undefined) {
          return [];
        }

        if (typeof item === 'object') {
          return Object.values(item);
        }

        return [item];
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

function makeSectionHeading(text) {
  return new Paragraph({
    text: safe(text).toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: {
      before: 250,
      after: 100,
    },
  });
}

function makeBullet(text) {
  if (!safe(text)) return null;

  return new Paragraph({
    text: safe(text),
    bullet: {
      level: 0,
    },
    spacing: {
      after: 50,
    },
  });
}

function makeContactLine(resume) {
  const parts = [
    resume?.email,
    resume?.phone,
    resume?.location,
    resume?.linkedin,
    resume?.github,
  ]
    .filter(Boolean)
    .map((item) => safe(item));

  return parts.join('  |  ');
}

function renderSkills(resume) {
  const output = [];

  const skills = resume?.skills;

  if (!skills) {
    return output;
  }

  if (Array.isArray(skills) || typeof skills === 'string') {
    const values = toArray(skills);

    if (values.length) {
      output.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Skills: ',
              bold: true,
            }),
            new TextRun({
              text: values.join(', '),
            }),
          ],
        })
      );
    }

    return output;
  }

  if (typeof skills === 'object') {
    const categories = [
      ['Languages', skills.languages || skills.language],
      ['Frameworks', skills.frameworks || skills.framework],
      ['Databases', skills.databases || skills.database],
      ['Tools', skills.tools || skills.tool],
      [
        'Soft Skills',
        skills.softSkills ||
          skills.soft_skills ||
          skills.soft,
      ],
      ['Other', skills.other || skills.additional],
    ];

    categories.forEach(([label, value]) => {
      const values = toArray(value);

      if (!values.length) return;

      output.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${label}: `,
              bold: true,
            }),
            new TextRun({
              text: values.join(', '),
            }),
          ],
          spacing: {
            after: 60,
          },
        })
      );
    });
  }

  return output;
}

function renderExperience(resume) {
  const experience = Array.isArray(resume?.experience)
    ? resume.experience
    : [];

  const output = [];

  experience.forEach((item) => {
    if (!item) return;

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

    const location = item.location || '';

    if (title || company) {
      output.push(
        new Paragraph({
          children: [
            new TextRun({
              text: safe(title),
              bold: true,
            }),
            new TextRun({
              text: company
                ? ` — ${safe(company)}`
                : '',
            }),
          ],
          spacing: {
            before: 100,
            after: 40,
          },
        })
      );
    }

    if (location || dates) {
      output.push(
        new Paragraph({
          children: [
            new TextRun({
              text: [dates, location]
                .filter(Boolean)
                .join(' | '),
              italics: true,
            }),
          ],
          spacing: {
            after: 60,
          },
        })
      );
    }

    const description =
      item.description ||
      item.summary ||
      '';

    if (description) {
      if (Array.isArray(description)) {
        description.forEach((point) => {
          const bullet = makeBullet(point);

          if (bullet) {
            output.push(bullet);
          }
        });
      } else {
        output.push(
          new Paragraph({
            text: safe(description),
            spacing: {
              after: 80,
            },
          })
        );
      }
    }

    const responsibilities = toArray(
      item.responsibilities ||
      item.bullets ||
      item.achievements
    );

    responsibilities.forEach((point) => {
      const bullet = makeBullet(point);

      if (bullet) {
        output.push(bullet);
      }
    });
  });

  return output;
}

function renderEducation(resume) {
  const education = Array.isArray(resume?.education)
    ? resume.education
    : [];

  const output = [];

  education.forEach((item) => {
    if (!item) return;

    const degree =
      item.degree ||
      item.course ||
      item.title ||
      item.program ||
      '';

    const institution =
      item.institution ||
      item.school ||
      item.university ||
      item.college ||
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

    if (degree || institution) {
      output.push(
        new Paragraph({
          children: [
            new TextRun({
              text: safe(degree),
              bold: true,
            }),
            new TextRun({
              text: institution
                ? ` — ${safe(institution)}`
                : '',
            }),
          ],
          spacing: {
            after: 40,
          },
        })
      );
    }

    if (field) {
      output.push(
        new Paragraph({
          text: safe(field),
          spacing: {
            after: 40,
          },
        })
      );
    }

    if (year || cgpa) {
      output.push(
        new Paragraph({
          text: [
            year,
            cgpa ? `CGPA: ${cgpa}` : '',
          ]
            .filter(Boolean)
            .join(' | '),
          spacing: {
            after: 100,
          },
        })
      );
    }
  });

  return output;
}

function renderProjects(resume) {
  const projects = Array.isArray(resume?.projects)
    ? resume.projects
    : [];

  const output = [];

  projects.forEach((project) => {
    if (!project) return;

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

    if (name) {
      output.push(
        new Paragraph({
          children: [
            new TextRun({
              text: safe(name),
              bold: true,
            }),
          ],
          spacing: {
            before: 100,
            after: 50,
          },
        })
      );
    }

    if (description) {
      output.push(
        new Paragraph({
          text: safe(description),
          spacing: {
            after: 60,
          },
        })
      );
    }

    if (technologies.length) {
      output.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Technologies: ',
              bold: true,
            }),
            new TextRun({
              text: technologies.join(', '),
            }),
          ],
          spacing: {
            after: 60,
          },
        })
      );
    }

    if (link) {
      output.push(
        new Paragraph({
          text: safe(link),
          spacing: {
            after: 80,
          },
        })
      );
    }
  });

  return output;
}

function renderCertifications(resume) {
  const certifications = Array.isArray(
    resume?.certifications
  )
    ? resume.certifications
    : toArray(resume?.certifications);

  if (!certifications.length) {
    return [];
  }

  const output = [];

  certifications.forEach((certification) => {
    let text = '';

    if (typeof certification === 'string') {
      text = certification;
    } else if (certification) {
      text =
        certification.name ||
        certification.title ||
        certification.certificate ||
        '';
    }

    const bullet = makeBullet(text);

    if (bullet) {
      output.push(bullet);
    }
  });

  return output;
}

function renderAchievements(resume) {
  const achievements = toArray(
    resume?.achievements ||
    resume?.awards ||
    resume?.accomplishments
  );

  return achievements
    .map((item) => makeBullet(item))
    .filter(Boolean);
}

export async function downloadResumeDocx(
  resume = {},
  template = {}
) {
  try {
    const name =
      resume?.name ||
      resume?.fullName ||
      resume?.full_name ||
      'Resume';

    const contactLine = makeContactLine(resume);

    const children = [];

    // NAME
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 100,
        },
        children: [
          new TextRun({
            text: safe(name),
            bold: true,
            size: 32,
          }),
        ],
      })
    );

    // HEADLINE
    const headline =
      resume?.title ||
      resume?.headline ||
      resume?.profession ||
      '';

    if (headline) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 80,
          },
          children: [
            new TextRun({
              text: safe(headline),
              bold: true,
              size: 22,
            }),
          ],
        })
      );
    }

    // CONTACT
    if (contactLine) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 200,
          },
          children: [
            new TextRun({
              text: contactLine,
              size: 18,
            }),
          ],
        })
      );
    }

    // SUMMARY
    const summary =
      resume?.summary ||
      resume?.profile ||
      resume?.objective ||
      '';

    if (summary) {
      children.push(
        makeSectionHeading('Professional Summary')
      );

      children.push(
        new Paragraph({
          text: safe(summary),
          spacing: {
            after: 100,
          },
        })
      );
    }

    // SKILLS
    const skills = renderSkills(resume);

    if (skills.length) {
      children.push(
        makeSectionHeading('Technical Skills')
      );

      children.push(...skills);
    }

    // EXPERIENCE
    const experience = renderExperience(resume);

    if (experience.length) {
      children.push(
        makeSectionHeading('Experience')
      );

      children.push(...experience);
    }

    // EDUCATION
    const education = renderEducation(resume);

    if (education.length) {
      children.push(
        makeSectionHeading('Education')
      );

      children.push(...education);
    }

    // PROJECTS
    const projects = renderProjects(resume);

    if (projects.length) {
      children.push(
        makeSectionHeading('Projects')
      );

      children.push(...projects);
    }

    // CERTIFICATIONS
    const certifications =
      renderCertifications(resume);

    if (certifications.length) {
      children.push(
        makeSectionHeading('Certifications')
      );

      children.push(...certifications);
    }

    // ACHIEVEMENTS
    const achievements =
      renderAchievements(resume);

    if (achievements.length) {
      children.push(
        makeSectionHeading('Achievements')
      );

      children.push(...achievements);
    }

    const templateName =
      template?.name || 'Resume';

    const document = new Document({
      creator: 'HireNext',
      title: `${safe(name)} - ${safe(
        templateName
      )}`,
      description:
        'ATS-friendly resume generated by HireNext',

      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },

          children,
        },
      ],
    });

    const blob = await Packer.toBlob(document);

    const safeFileName =
      safe(name)
        .trim()
        .replace(
          /[^a-zA-Z0-9-_]+/g,
          '_'
        )
        .replace(
          /^_+|_+$/g,
          ''
        ) || 'Resume';

    saveAs(
      blob,
      `${safeFileName}.docx`
    );

    return true;
  } catch (error) {
    console.error(
      'DOCX generation failed:',
      error
    );

    throw error;
  }
}

export default downloadResumeDocx;