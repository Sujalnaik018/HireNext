import { motion } from 'framer-motion';

import {
  CheckCircle2,
  CircleAlert,
  Target,
  XCircle,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

import { calculateATSScore } from '@/lib/atsScore';

/* =========================================================
   HELPERS
========================================================= */

function getScoreClass(score) {
  if (score >= 85) {
    return 'text-green-400';
  }

  if (score >= 70) {
    return 'text-blue-400';
  }

  if (score >= 50) {
    return 'text-yellow-400';
  }

  return 'text-red-400';
}

function getProgressClass(score) {
  if (score >= 85) {
    return 'bg-green-500';
  }

  if (score >= 70) {
    return 'bg-blue-500';
  }

  if (score >= 50) {
    return 'bg-yellow-500';
  }

  return 'bg-red-500';
}

function StatusIcon({
  active,
}) {
  return active ? (
    <CheckCircle2 className="h-4 w-4 text-green-400" />
  ) : (
    <XCircle className="h-4 w-4 text-red-400" />
  );
}

/* =========================================================
   BREAKDOWN ITEM
========================================================= */

function BreakdownItem({
  label,
  value,
  max,
}) {
  const numericValue =
    Number(value) || 0;

  const numericMax =
    Number(max) || 0;

  const percentage =
    numericMax > 0
      ? Math.round(
          (numericValue /
            numericMax) *
            100
        )
      : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm text-foreground">
          {label}
        </span>

        <span className="text-xs font-medium text-muted-foreground">
          {numericValue}/{numericMax}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{
            duration: 0.6,
          }}
          className="h-full rounded-full bg-brand-red"
        />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export function ATSScoreCard({
  resume,
}) {
  const result =
    calculateATSScore(resume);

  const score =
    Number(result?.score) || 0;

  const rating =
    result?.rating ||
    'Needs Improvement';

  const keywordScore =
    Number(
      result?.keywordScore
    ) || 0;

  const skillCount =
    Number(
      result?.skillCount
    ) || 0;

  const sections =
    result?.sections || {};

  const recommendations =
    Array.isArray(
      result?.recommendations
    )
      ? result.recommendations
      : [];

  const breakdown =
    result?.breakdown || {
      contact: sections.contact
        ? 15
        : 0,
      summary: sections.summary
        ? 15
        : 0,
      skills: sections.skills
        ? 20
        : 0,
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

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                <Target className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">
                  ATS Resume Score
                </h2>

                <p className="text-xs text-muted-foreground">
                  Resume compatibility analysis
                </p>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`text-3xl font-bold ${getScoreClass(
                  score
                )}`}
              >
                {score}

                <span className="text-base text-muted-foreground">
                  /100
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {rating}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* SCORE */}

          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                ATS Compatibility
              </span>

              <span className="font-medium text-foreground">
                {score}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${score}%`,
                }}
                transition={{
                  duration: 0.8,
                }}
                className={`h-full rounded-full ${getProgressClass(
                  score
                )}`}
              />
            </div>
          </div>

          {/* SECTIONS */}

          <div>
            <h3 className="mb-3 text-sm font-semibold">
              Resume Sections
            </h3>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                [
                  'Name',
                  sections.name,
                ],
                [
                  'Contact',
                  sections.contact,
                ],
                [
                  'Summary',
                  sections.summary,
                ],
                [
                  'Skills',
                  sections.skills,
                ],
                [
                  'Education',
                  sections.education,
                ],
                [
                  'Experience',
                  sections.experience,
                ],
                [
                  'Projects',
                  sections.projects,
                ],
                [
                  'Certifications',
                  sections.certifications,
                ],
                [
                  'Professional Links',
                  sections.links,
                ],
              ].map(
                ([
                  label,
                  active,
                ]) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <StatusIcon
                      active={Boolean(
                        active
                      )}
                    />

                    {label}
                  </div>
                )
              )}
            </div>
          </div>

          {/* METRICS */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">
                Skills
              </p>

              <p className="mt-1 text-lg font-semibold">
                {skillCount}
              </p>
            </div>

            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">
                Keywords
              </p>

              <p className="mt-1 text-lg font-semibold">
                {keywordScore}%
              </p>
            </div>

            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">
                Status
              </p>

              <p
                className={`mt-1 text-lg font-semibold ${getScoreClass(
                  score
                )}`}
              >
                {rating}
              </p>
            </div>
          </div>

          {/* BREAKDOWN */}

          <div>
            <div className="mb-5">
              <h2 className="text-base font-semibold">
                ATS Score Breakdown
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                See how your resume performs across important ATS categories.
              </p>
            </div>

            <div className="space-y-4">
              <BreakdownItem
                label="Contact Information"
                value={
                  breakdown.contact
                }
                max={15}
              />

              <BreakdownItem
                label="Professional Summary"
                value={
                  breakdown.summary
                }
                max={15}
              />

              <BreakdownItem
                label="Skills"
                value={
                  breakdown.skills
                }
                max={20}
              />

              <BreakdownItem
                label="Experience"
                value={
                  breakdown.experience
                }
                max={20}
              />

              <BreakdownItem
                label="Education"
                value={
                  breakdown.education
                }
                max={15}
              />

              <BreakdownItem
                label="Projects"
                value={
                  breakdown.projects
                }
                max={15}
              />
            </div>
          </div>

          {/* RECOMMENDATIONS */}

          {recommendations.length >
            0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CircleAlert className="h-4 w-4 text-yellow-400" />

                <h3 className="text-sm font-semibold">
                  Recommendations
                </h3>
              </div>

              <div className="space-y-2">
                {recommendations
                  .slice(0, 5)
                  .map(
                    (
                      recommendation,
                      index
                    ) => (
                      <div
                        key={`${recommendation}-${index}`}
                        className="flex gap-2 rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-muted-foreground"
                      >
                        <span className="text-brand-red">
                          •
                        </span>

                        <span>
                          {
                            recommendation
                          }
                        </span>
                      </div>
                    )
                  )}
              </div>
            </div>
          )}

          {recommendations.length ===
            0 && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              <CheckCircle2 className="h-4 w-4" />

              Your resume has strong ATS-friendly coverage.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ATSScoreCard;