import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { createEmptyResumeData } from '@/lib/resumeAdapter';

const STORAGE_KEY = 'hirenext_resume_data';
const TEMPLATE_KEY = 'hirenext_selected_template';

const ResumeContext = createContext(null);

function safeParse(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Centralized resume state shared across the AI Resume Assistant, Resume
 * Builder, Templates, Preview, and Export pages.
 *
 * Data is persisted to localStorage so it survives a page refresh. No backend
 * is involved — this simply prepares the app for a real API later.
 */
export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(() => {
    const saved = safeParse(
      window.localStorage.getItem(STORAGE_KEY),
      createEmptyResumeData()
    );
    // Merge so new canonical fields are always present.
    return { ...createEmptyResumeData(), ...saved };
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState(() => {
    const saved = window.localStorage.getItem(TEMPLATE_KEY);
    return saved || 'classic-ats';
  });

  // Persist resume whenever it changes.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  }, [resume]);

  // Persist selected template whenever it changes.
  useEffect(() => {
    window.localStorage.setItem(TEMPLATE_KEY, selectedTemplateId);
  }, [selectedTemplateId]);

  /** Replace the resume with a canonical object (e.g. from the AI assistant). */
  const saveResume = useCallback((nextResume) => {
    setResume({ ...createEmptyResumeData(), ...nextResume });
  }, []);

  /** Shallow/nested update of a single top-level field. */
  const updateResume = useCallback((updater) => {
    setResume((prev) => {
      const next =
        typeof updater === 'function' ? updater(prev) : updater;
      return { ...createEmptyResumeData(), ...next };
    });
  }, []);

  /** Clear the current resume (used by "Start New Resume"). */
  const resetResume = useCallback(() => {
    setResume(createEmptyResumeData());
  }, []);

  const selectTemplate = useCallback((templateId) => {
    setSelectedTemplateId(templateId);
  }, []);

  const value = {
    resume,
    selectedTemplateId,
    saveResume,
    updateResume,
    resetResume,
    selectTemplate,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return ctx;
}
