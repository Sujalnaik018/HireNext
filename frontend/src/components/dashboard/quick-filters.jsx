import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Filter,
  RotateCcw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  getJobs,
} from '@/services/api';

import { fadeUpItem } from '@/lib/motion';

function FilterField({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>

      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full bg-background">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Live dashboard filters.
 *
 * Job options come from the Jobs API.
 * Experience and skills are derived from job data.
 */
export function QuickFilters({
  onApply,
}) {
  const [jobs, setJobs] =
    useState([]);

  const [job, setJob] =
    useState('All Jobs');

  const [experience, setExperience] =
    useState('Any Experience');

  const [skill, setSkill] =
    useState('All Skills');

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadFilterData =
      async () => {
        try {
          setLoading(true);

          const jobsData =
            await getJobs();

          const jobList =
            Array.isArray(
              jobsData
            )
              ? jobsData
              : [];

          setJobs(jobList);
        } catch (error) {
          console.error(
            'Failed to load filter options:',
            error
          );
        } finally {
          setLoading(false);
        }
      };

    loadFilterData();
  }, []);

  const jobOptions = [
    'All Jobs',
    ...jobs
      .map(
        (item) => item.title
      )
      .filter(Boolean)
      .filter(
        (value, index, array) =>
          array.indexOf(value) ===
          index
      ),
  ];

  const experienceOptions = [
    'Any Experience',
    ...jobs
      .map(
        (item) =>
          item.experience
      )
      .filter(Boolean)
      .filter(
        (value, index, array) =>
          array.indexOf(value) ===
          index
      ),
  ];

  const skillOptions = [
    'All Skills',
    ...jobs
      .flatMap((item) =>
        String(
          item.skills || ''
        )
          .split(',')
          .map((skillItem) =>
            skillItem.trim()
          )
          .filter(Boolean)
      )
      .filter(
        (value, index, array) =>
          array.indexOf(value) ===
          index
      ),
  ];

  const handleApply = () => {
    const filters = {
      job,
      experience,
      skill,
    };

    if (onApply) {
      onApply(filters);
    }
  };

  const handleReset = () => {
    setJob('All Jobs');
    setExperience('Any Experience');
    setSkill('All Skills');

    if (onApply) {
      onApply({
        job: 'All Jobs',
        experience: 'Any Experience',
        skill: 'All Skills',
      });
    }
  };

  return (
    <motion.div variants={fadeUpItem}>
      <Card className="border-border bg-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-brand-red" />

            <h2 className="text-base font-semibold tracking-tight">
              Quick Filters
            </h2>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FilterField
              label="Job"
              value={job}
              options={jobOptions}
              onChange={setJob}
            />

            <FilterField
              label="Experience"
              value={experience}
              options={experienceOptions}
              onChange={setExperience}
            />

            <FilterField
              label="Skills"
              value={skill}
              options={skillOptions}
              onChange={setSkill}
            />
          </div>

          <Button
            className="mt-4 w-full bg-brand-red text-white hover:bg-brand-red-dark"
            onClick={handleApply}
            disabled={loading}
          >
            Apply Filter
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}