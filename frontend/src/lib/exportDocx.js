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
    resume.email,
    resume.phone,
    resume.location,
    resume.linkedin,
    resume.github,
  ].filter(Boolean);

  return parts.join('  |  ');
}

function renderSkills(resume) {
  const sections = [];

  if (resume.skills) {
    if (Array.isArray(resume.skills)) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Skills: ',
              bold: true,
            }),
            new TextRun({
              text: resume.skills.join(', '),
            }),
          ],
        })
      );
    } else if (typeof resume.skills === 'object') {
      Object.entries(resume.skills).forEach(([key, value]) => {
        const skills = Array.isArray(value)
          ? value.join(', ')
          : safe(value);

        if (skills) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${key}: `,
                  bold: true,
                }),
                new TextRun({
                  text: skills,
                }),
              ],
            })
          );
        }
      });
    } else {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Skills: ',
              bold: true,
            }),
            new TextRun({
              text: safe(resume.skills),
            }),
          ],
        })
      );
    }
  }

  return sections;
}

function renderExperience(resume) {
  if (!Array.isArray(resume.experience)) {
    return [];
  }

  const output = [];

  resume.experience.forEach((item) => {
    const title =
      item.title ||
      item.position ||
      item.role ||
      '';

    const company =
      item.company ||
      item.organization ||
      '';

    const dates =
      item.dates ||
      item.duration ||
      item.period ||
      '';

    if (title || company) {
      output.push(
        new Paragraph({
          children: [
            new TextRun({
              text: safe(title),
              bold: true,
            }),
            new TextRun({
              text: company ? ` — ${safe(company)}` : '',
            }),
          ],
          spacing: {
            before: 100,
            after: 50,
          },
        })
      );
    }

    if (dates) {
      output.push(
        new Paragraph({
          children: [
            new TextRun({
              text: safe(dates),
              italics: true,
            }),
          ],
          spacing: {
            after: 50,
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
          output.push(makeBullet(point));
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

    if (Array.isArray(item.responsibilities)) {
      item.responsibilities.forEach((point) => {
        output.push(makeBullet(point));
      });
    }
  });

  return output;
}

function renderEducation(resume) {
  if (!Array.isArray(resume.education)) {
    return [];
  }

  const output = [];

  resume.education.forEach((item) => {
    const degree =
      item.degree ||
      item.course ||
      item.title ||
      '';

    const institution =
      item.institution ||
      item.school ||
      item.university ||
      '';

    const year =
      item.year ||
      item.duration ||
      item.period ||
      '';

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
          after: 50,
        },
      })
    );

    if (year) {
      output.push(
        new Paragraph({
          text: safe(year),
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
  if (!Array.isArray(resume.projects)) {
    return [];
  }

  const output = [];

  resume.projects.forEach((project) => {
    const name =
      project.name ||
      project.title ||
      '';

    const description =
      project.description ||
      project.summary ||
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
            after: 80,
          },
        })
      );
    }

    if (Array.isArray(project.technologies)) {
      output.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Technologies: ',
              bold: true,
            }),
            new TextRun({
              text: project.technologies.join(', '),
            }),
          ],
          spacing: {
            after: 100,
          },
        })
      );
    }
  });

  return output;
}

export async function downloadResumeDocx(resume, template) {
  const name =
    resume.name ||
    resume.fullName ||
    resume.full_name ||
    'Resume';

  const contactLine = makeContactLine(resume);

  const children = [];

  // Name
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

  // Job title
  const headline =
    resume.title ||
    resume.headline ||
    resume.profession ||
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

  // Contact information
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

  // Summary
  const summary =
    resume.summary ||
    resume.profile ||
    resume.objective ||
    '';

  if (summary) {
    children.push(makeSectionHeading('Professional Summary'));

    children.push(
      new Paragraph({
        text: safe(summary),
        spacing: {
          after: 100,
        },
      })
    );
  }

  // Skills
  const skillParagraphs = renderSkills(resume);

  if (skillParagraphs.length > 0) {
    children.push(makeSectionHeading('Technical Skills'));
    children.push(...skillParagraphs);
  }

  // Experience
  const experienceParagraphs = renderExperience(resume);

  if (experienceParagraphs.length > 0) {
    children.push(makeSectionHeading('Experience'));
    children.push(...experienceParagraphs);
  }

  // Education
  const educationParagraphs = renderEducation(resume);

  if (educationParagraphs.length > 0) {
    children.push(makeSectionHeading('Education'));
    children.push(...educationParagraphs);
  }

  // Projects
  const projectParagraphs = renderProjects(resume);

  if (projectParagraphs.length > 0) {
    children.push(makeSectionHeading('Projects'));
    children.push(...projectParagraphs);
  }

  // Certifications
  if (Array.isArray(resume.certifications) && resume.certifications.length) {
    children.push(makeSectionHeading('Certifications'));

    resume.certifications.forEach((certification) => {
      if (typeof certification === 'string') {
        children.push(makeBullet(certification));
      } else {
        children.push(
          makeBullet(
            certification.name ||
              certification.title ||
              certification.certificate ||
              ''
          )
        );
      }
    });
  }

  // Template information is intentionally kept out of the visible resume.
  // It is only used to make sure a selected template exists.
  const templateName = template?.name || 'Resume';

  const document = new Document({
    creator: 'HireNext',
    title: `${name} - ${templateName}`,
    description: 'ATS-friendly resume generated by HireNext',
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

  const safeFileName = safe(name)
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, '_')
    .replace(/^_+|_+$/g, '');

  saveAs(
    blob,
    `${safeFileName || 'Resume'}.docx`
  );
}