import { motion } from 'framer-motion';
import { Download, Mail, MapPin, Phone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fadeUpItem } from '@/lib/motion';

function PreviewSection({ title, children, show = true }) {
  if (!show) return null;
  return (
    <motion.section variants={fadeUpItem} className="mt-5">
      <h3 className="border-b border-border pb-1 text-xs font-bold uppercase tracking-wider text-brand-red">
        {title}
      </h3>
      <div className="mt-2 space-y-2">{children}</div>
    </motion.section>
  );
}

function SkillsGroup({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="w-32 shrink-0 text-xs font-semibold text-foreground">
        {label}
      </span>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}

/**
 * Right panel — LIVE resume preview following the HireNext template.
 * Updates instantly as the user fills in each step.
 */
export function ResumePreview({ data, onDownload }) {
  const p = data.personal;
  const edu = data.education;
  const skills = data.skills;
  const hasName = p.fullName || p.email;

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Live Resume Preview</h2>
          <p className="text-xs text-muted-foreground">Updates as you type</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 sm:p-8">
          {/* Resume paper */}
          <motion.div
            variants={fadeUpItem}
            className="mx-auto max-w-3xl rounded-sm border border-border bg-card p-6 shadow-lg sm:p-8"
          >
            {/* Header */}
            <header className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {p.fullName || 'Your Name'}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.linkedin ? `LinkedIn: ${p.linkedin}` : ''}
                {p.linkedin && p.github ? '  |  ' : ''}
                {p.github ? `GitHub: ${p.github}` : ''}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {p.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {p.email}
                  </span>
                )}
                {p.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {p.phone}
                  </span>
                )}
                {p.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {p.location}
                  </span>
                )}
              </div>
            </header>

            {/* Education */}
            <PreviewSection title="Education" show={Boolean(edu.college || edu.degree)}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{edu.college || 'College'}</p>
                  <p className="text-xs text-muted-foreground">
                    {[edu.degree, edu.branch].filter(Boolean).join(' — ')}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {edu.gradYear && <p>Class of {edu.gradYear}</p>}
                  {edu.cgpa && <p>CGPA: {edu.cgpa}</p>}
                </div>
              </div>
            </PreviewSection>

            {/* Technical Skills */}
            <PreviewSection title="Technical Skills" show={Boolean(hasName)}>
              <div className="space-y-1.5">
                <SkillsGroup label="Languages" value={skills.programming} />
                <SkillsGroup label="Frameworks" value={skills.frameworks} />
                <SkillsGroup label="Databases" value={skills.databases} />
                <SkillsGroup label="Tools" value={skills.tools} />
                <SkillsGroup label="Soft Skills" value={skills.softSkills} />
              </div>
            </PreviewSection>

            {/* Projects */}
            <PreviewSection title="Projects" show={data.projects.length > 0}>
              {data.projects.map((project, i) => (
                <div key={i} className="rounded-md border border-border/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {project.name || `Project ${i + 1}`}
                    </p>
                    {project.link && (
                      <a
                        href="#"
                        className="text-xs text-brand-red hover:underline"
                      >
                        {project.link}
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {project.description}
                  </p>
                  {project.technologies && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.technologies
                        .split(',')
                        .map((tech) => tech.trim())
                        .filter(Boolean)
                        .map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-border bg-muted/40 text-[10px] font-normal text-muted-foreground"
                          >
                            {tech}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </PreviewSection>

            {/* Experience */}
            <PreviewSection title="Experience" show={data.experience.length > 0}>
              {data.experience.map((exp, i) => (
                <div key={i} className="rounded-md border border-border/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {exp.role || 'Role'}
                      </p>
                      <p className="text-xs text-muted-foreground">{exp.company}</p>
                    </div>
                    {exp.duration && (
                      <span className="text-xs text-muted-foreground">
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {exp.responsibilities}
                  </p>
                </div>
              ))}
            </PreviewSection>

            {/* Certificates */}
            <PreviewSection title="Certificates" show={data.certificates.length > 0}>
              {data.certificates.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-2 text-xs"
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      {cert.course || 'Course'}
                    </p>
                    <p className="text-muted-foreground">{cert.platform}</p>
                  </div>
                  {cert.year && (
                    <span className="text-muted-foreground">{cert.year}</span>
                  )}
                </div>
              ))}
            </PreviewSection>

            {/* Achievements */}
            <PreviewSection title="Achievements" show={Boolean(data.achievements.achievements)}>
              <p className="whitespace-pre-line text-xs text-muted-foreground">
                {data.achievements.achievements}
              </p>
            </PreviewSection>

            {/* Languages + Hobbies */}
            <PreviewSection title="Languages" show={Boolean(data.achievements.languages)}>
              <p className="text-xs text-muted-foreground">
                {data.achievements.languages}
              </p>
            </PreviewSection>

            <PreviewSection title="Hobbies" show={Boolean(data.achievements.hobbies)}>
              <p className="text-xs text-muted-foreground">
                {data.achievements.hobbies}
              </p>
            </PreviewSection>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}
