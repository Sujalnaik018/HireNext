import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, LayoutTemplate, Send } from 'lucide-react';

import { ChatWindow } from '@/components/applicant/ai-resume/chat-window';
import { ResumeDataPreview } from '@/components/applicant/ai-resume/resume-data-preview';
import { ResumeProgress } from '@/components/applicant/ai-resume/resume-progress';
import { Button } from '@/components/ui/button';
import { useResume } from '@/context/ResumeContext';
import { fadeUpItem, staggerContainer } from '@/lib/motion';
import { aiResumeToCanonical } from '@/lib/resumeAdapter';
import {
  applyAnswer,
  computeProgress,
  createEmptyResume,
  getCompletedSections,
  questions,
} from '@/services/ai/resumeAssistantFlow';

const now = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * Applicant AI Resume Assistant.
 * Guides the applicant through resume sections one question at a time via chat.
 * All data is local state — no backend/AI API yet.
 */
export function AIResumeAssistant() {
  const navigate = useNavigate();
  const { saveResume } = useResume();

  const [resume, setResume] = useState(createEmptyResume);
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: questions[0].question,
      time: now(),
    },
  ]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const progress = useMemo(() => computeProgress(resume), [resume]);
  const sections = useMemo(() => getCompletedSections(resume), [resume]);

  const pushMessage = useCallback((from, text) => {
    setMessages((prev) => [...prev, { from, text, time: now() }]);
  }, []);

  const advance = useCallback(
    (nextResume) => {
      const nextIndex = questionIndex + 1;
      if (nextIndex >= questions.length) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          pushMessage(
            'ai',
            "That's everything I need! Your resume is looking great. You can preview it, choose a template, or continue to the Resume Builder to refine it."
          );
        }, 700);
        return;
      }
      setQuestionIndex(nextIndex);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        pushMessage('ai', questions[nextIndex].question);
      }, 600);
    },
    [questionIndex, pushMessage]
  );

  const handleSend = useCallback(
    (answer) => {
      const question = questions[questionIndex];
      pushMessage('user', answer);
      const nextResume = applyAnswer(resume, question, answer);
      setResume(nextResume);
      advance(nextResume);
    },
    [questionIndex, resume, pushMessage, advance]
  );

  const handleStartOver = useCallback(() => {
    setResume(createEmptyResume());
    setQuestionIndex(0);
    setIsTyping(false);
    setMessages([
      {
        from: 'ai',
        text: questions[0].question,
        time: now(),
      },
    ]);
  }, []);

const handleContinueToBuilder = useCallback(() => {
    // Convert the AI-collected resume to the canonical shared shape and save.
    const canonical = aiResumeToCanonical(resume);
    saveResume(canonical);
    navigate('/resume-builder');
  }, [resume, saveResume, navigate]);

  const handleGenerateSummary = useCallback(() => {
    // Predefined local suggestion (no real AI yet).
    const first = resume.personalInfo.fullName
      ? resume.personalInfo.fullName.split(' ')[0]
      : 'there';
    const suggestion = `Motivated professional ready to bring strong technical and problem-solving skills to a dynamic team. Eager to contribute, learn, and grow while delivering high-quality results.`;
    pushMessage(
      'ai',
      `Here's a suggested summary for you, ${first}: "${suggestion}" You can edit it or type your own.`
    );
  }, [resume.personalInfo.fullName, pushMessage]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page header */}
      <motion.div variants={fadeUpItem}>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          AI Resume Assistant
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Let's build your professional resume together.
        </p>
      </motion.div>

      {/* Two-column layout */}
      <motion.div
        variants={fadeUpItem}
        className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      >
        {/* LEFT — Chatbot */}
        <div className="lg:col-span-3">
          <div className="h-[520px] lg:h-[620px]">
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              onSend={handleSend}
              onStartOver={handleStartOver}
            />
          </div>
        </div>

        {/* RIGHT — Resume progress + preview */}
        <div className="space-y-6 lg:col-span-2">
          <ResumeProgress progress={progress} sections={sections} />
          <ResumeDataPreview resume={resume} />

          {/* Generate summary suggestion */}
          <Button
            variant="outline"
            size="sm"
            className="w-full border-brand-red/30 text-brand-red hover:bg-brand-red/10"
            onClick={handleGenerateSummary}
          >
            <Send className="h-4 w-4" />
            Generate Summary
          </Button>

          {/* Action buttons */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/resume-export')}
            >
              <Eye className="h-4 w-4" />
              Preview Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/resume-templates')}
            >
              <LayoutTemplate className="h-4 w-4" />
              Choose Template
            </Button>
<Button
              size="sm"
              className="bg-brand-red text-white hover:bg-brand-red-dark"
              onClick={handleContinueToBuilder}
            >
              Continue to Builder
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
</motion.div>
  );
}
