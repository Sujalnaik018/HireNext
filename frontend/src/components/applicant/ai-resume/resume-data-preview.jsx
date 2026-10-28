import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Right panel — live resume preview data.
 * Shows only the fields already collected during the chat.
 */
function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function ListPreview({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <ul className="mt-1 space-y-1">
        {items.map((item, i) => {
          if (typeof item === 'string') {
            return (
              <li key={i} className="text-sm text-foreground">
                • {item}
              </li>
            );
          }
          const name = item.title || item.name || item.company || item.degree;
          return (
            <li key={i} className="text-sm text-foreground">
              • {name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Live resume data preview based on the collected applicant answers.
 */
export function ResumeDataPreview({ resume }) {
  const { personalInfo, summary, education, experience, skills, projects } = resume;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Resume Preview Data
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Only collected information is shown
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Name" value={personalInfo.fullName} />
          <Field label="Email" value={personalInfo.email} />
          <Field label="Phone" value={personalInfo.phone} />
          <Field label="Location" value={personalInfo.location} />
        </div>

        <Field label="Professional Summary" value={summary} />
        <ListPreview label="Education" items={education} />
        <ListPreview label="Experience" items={experience} />
        <ListPreview label="Skills" items={skills} />
        <ListPreview label="Projects" items={projects} />

        {!personalInfo.fullName &&
          !summary &&
          education.length === 0 &&
          experience.length === 0 &&
          skills.length === 0 &&
          projects.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Start chatting to build your resume. Your collected information
              will appear here.
            </p>
)}
      </CardContent>
    </Card>
  );
}
