import { Mail, MapPin, Phone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { dummyResume, getTemplateById } from '@/data/templates';
import { cn } from '@/lib/utils';

function Section({ title, children, visible = true }) {
  if (!visible) return null;
  return (
    <section className="mt-4 first:mt-0">
      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <Separator className="mb-2 mt-1" />
      {children}
    </section>
  );
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-2 text-xs text-muted-foreground">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
      <span>{children}</span>
    </li>
  );
}

/**
 * Full ATS resume preview modal.
 * Receives the selected template ID and renders the resume with
 * dummy data following the standard ATS format.
 */
export function PreviewModal({ templateId }) {
  const template = getTemplateById(templateId);
  const d = dummyResume;

  return (
    <DialogContent className="flex h-[85vh] max-w-2xl flex-col gap-0 p-0 sm:rounded-lg">
      <DialogHeader className="border-b border-border px-5 py-3 sm:px-6">
        <DialogTitle className="text-sm font-semibold text-foreground">
          {template.name} Template
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          ATS-friendly resume preview using sample data
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-1">
        <div className="px-5 pb-6 pt-4 sm:px-6">
          {/* Resume paper */}
          <div
            className={cn(
              'mx-auto max-w-xl rounded-sm border border-border bg-card p-6 shadow-sm sm:p-8',
              template.font
            )}
          >
            {/* Header */}
            <header className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {d.name}
              </h1>
              <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                {d.title}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {d.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {d.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {d.location}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {d.linkedin} &nbsp;|&nbsp; {d.github}
              </p>
            </header>

            {/* Summary */}
            <Section title="Professional Summary" visible={Boolean(d.summary)}>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {d.summary}
              </p>
            </Section>

            {/* Education */}
            <Section title="Education" visible={Boolean(d.education.institution)}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {d.education.institution}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[d.education.degree, d.education.branch]
                      .filter(Boolean)
                      .join(' — ')}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Class of {d.education.gradYear}</p>
                  <p>CGPA: {d.education.cgpa}</p>
                </div>
              </div>
            </Section>

            {/* Technical Skills */}
            <Section title="Technical Skills">
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">
                    Languages:{' '}
                  </span>
                  {d.skills.languages}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Frameworks:{' '}
                  </span>
                  {d.skills.frameworks}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Databases:{' '}
                  </span>
                  {d.skills.databases}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Tools: </span>
                  {d.skills.tools}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Soft Skills:{' '}
                  </span>
                  {d.skills.soft}
                </p>
              </div>
            </Section>

            {/* Projects */}
            <Section title="Projects" visible={d.projects.length > 0}>
              <div className="space-y-3">
                {d.projects.map((project, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-border/60 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {project.name}
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
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.tech.map((tech, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-border bg-muted/40 text-[10px] font-normal text-muted-foreground"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Experience */}
            <Section title="Experience" visible={d.experience.length > 0}>
              <div className="space-y-3">
                {d.experience.map((exp, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-border/60 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {exp.role}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {exp.responsibilities}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Certificates */}
            <Section title="Certificates" visible={d.certificates.length > 0}>
              <div className="space-y-1.5">
                {d.certificates.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {cert.course}
                      </p>
                      <p className="text-muted-foreground">{cert.platform}</p>
                    </div>
                    <span className="text-muted-foreground">{cert.year}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Achievements */}
            <Section title="Achievements" visible={d.achievements.length > 0}>
              <ul className="space-y-1">
                {d.achievements.map((a, i) => (
                  <Bullet key={i}>{a}</Bullet>
                ))}
              </ul>
            </Section>

            {/* Languages */}
            <Section title="Languages" visible={d.languages.length > 0}>
              <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                {d.languages.map((lang, i) => (
                  <span key={i} className="text-xs">
                    {lang}
                    {i < d.languages.length - 1 && (
                      <span className="mx-1.5 text-muted-foreground/40">|</span>
                    )}
                  </span>
                ))}
              </div>
            </Section>

            {/* Hobbies */}
            <Section title="Hobbies" visible={d.hobbies.length > 0}>
              <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                {d.hobbies.map((hobby, i) => (
                  <span key={i} className="text-xs">
                    {hobby}
                    {i < d.hobbies.length - 1 && (
                      <span className="mx-1.5 text-muted-foreground/40">|</span>
                    )}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  );
}
