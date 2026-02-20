'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, Check } from 'lucide-react';
import { GitHubImporter, type ImportedRepo } from '@/components/case-study/github-importer';
import { InterviewWizard, type Question, type Answer } from '@/components/case-study/interview-wizard';

type Step = 'import' | 'analysis' | 'interview' | 'complete';

export default function CaseStudyGeneratorPage() {
  const [step, setStep] = useState<Step>('import');
  const [selectedRepo, setSelectedRepo] = useState<ImportedRepo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [caseStudy, setCaseStudy] = useState<string>('');

  // Mock questions - in production, these would come from API
  const mockQuestions: Question[] = [
    {
      id: '1',
      question: 'What was the primary technical challenge you faced when building this project?',
      context: 'Understanding the core problem helps us explain why specific architectural decisions were made.',
      category: 'architecture',
    },
    {
      id: '2',
      question: 'Why did you choose this particular tech stack over alternatives?',
      context: 'Your technology decisions reveal your priorities around performance, scalability, and developer experience.',
      category: 'architecture',
    },
    {
      id: '3',
      question: 'What performance optimizations did you implement, and what impact did they have?',
      context: 'Real performance improvements demonstrate your understanding of system bottlenecks and optimization techniques.',
      category: 'performance',
    },
    {
      id: '4',
      question: 'Were there any security considerations in your implementation? How did you address them?',
      context: 'Security decisions show your awareness of best practices and real-world threats.',
      category: 'security',
    },
    {
      id: '5',
      question: 'What would you do differently if you started this project today?',
      context: 'Reflections on past decisions demonstrate growth and evolving technical expertise.',
      category: 'architecture',
    },
  ];

  const handleImport = async (repo: ImportedRepo) => {
    setSelectedRepo(repo);
    setIsLoading(true);

    // Simulate API call to analyze GitHub repo
    setTimeout(() => {
      setQuestions(mockQuestions);
      setStep('analysis');
      setIsLoading(false);
    }, 2000);
  };

  const handleInterviewComplete = async (answers: Answer[]) => {
    setIsLoading(true);

    // Mock case study generation
    const mockCaseStudy = `
# ${selectedRepo?.name} - Case Study

## Overview
${selectedRepo?.name} is a modern full-stack application built with cutting-edge technologies. This case study explores the architectural decisions, challenges overcome, and lessons learned during its development.

## The Challenge
The team faced significant challenges in ${answers[0]?.text?.substring(0, 50)}... This required careful planning and strategic decision-making to overcome.

## Technical Approach
Based on the technology stack analysis and the team's expertise, they selected ${answers[1]?.text?.substring(0, 60)}... This choice proved to be instrumental in achieving the project's performance goals.

## Key Decisions
- Architecture: ${answers[0]?.text?.substring(0, 80) || 'Modular design pattern'}...
- Performance: ${answers[2]?.text?.substring(0, 80) || 'Implemented aggressive caching'}...
- Security: ${answers[3]?.text?.substring(0, 80) || 'Applied industry best practices'}...

## Results & Impact
The implementation achieved significant improvements across multiple metrics:
- 40% reduction in load times
- 99.9% uptime achieved
- 3x increase in user capacity
- Improved developer productivity by 2x

## Lessons Learned
${answers[4]?.text?.substring(0, 100) || 'Continuous learning and iteration are essential'}...

The journey of building ${selectedRepo?.name} provides valuable insights for any engineering team looking to scale their applications effectively.
    `.trim();

    setCaseStudy(mockCaseStudy);
    setStep('complete');
    setIsLoading(false);
  };

  const handleReset = () => {
    setStep('import');
    setSelectedRepo(null);
    setQuestions([]);
    setCaseStudy('');
  };

  return (
    <main className="min-h-screen bg-[#050505] py-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-6 inline-block rounded-full bg-[#10b981]/20 px-4 py-2 text-sm font-semibold text-[#10b981]">
            <Zap className="mr-2 inline h-4 w-4" />
            Case Study Generator
          </div>
          <h1 className="mb-4 text-4xl font-bold text-[#e5e7eb]">
            Transform Your Project into a Compelling Case Study
          </h1>
          <p className="text-lg text-[#9ca3af]">
            Import your GitHub repository, answer targeted questions, and let AI generate a polished case study in minutes
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12 flex items-center justify-center gap-4">
          {(['import', 'analysis', 'interview', 'complete'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <motion.div
                animate={{
                  backgroundColor:
                    s === step
                      ? '#10b981'
                      : ['import', 'analysis', 'interview'].indexOf(s) < ['import', 'analysis', 'interview'].indexOf(step)
                      ? '#10b981'
                      : '#374151',
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
              >
                {s === 'import' && '1'}
                {s === 'analysis' && '2'}
                {s === 'interview' && '3'}
                {s === 'complete' && <Check className="h-5 w-5" />}
              </motion.div>
              {i < 3 && <div className="h-1 w-8 bg-[#374151]" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          {step === 'import' && (
            <>
              <GitHubImporter onImport={handleImport} isLoading={isLoading} />
            </>
          )}

          {step === 'analysis' && selectedRepo && (
            <div className="rounded-lg border border-[#10b981]/30 bg-gradient-to-br from-[#050505] via-[#050505] to-[#0f2318] p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#10b981]/20">
                  <Zap className="h-6 w-6 text-[#10b981]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#e5e7eb]">Analyzing Repository</h3>
                  <p className="mt-2 text-[#9ca3af]">
                    We're examining <span className="text-[#10b981] font-semibold">{selectedRepo.name}</span> to understand its architecture, technology stack, and key components.
                  </p>
                  <p className="mt-3 text-sm text-[#6b7280]">
                    This will help us generate targeted questions that reveal the most interesting aspects of your project.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'interview' && questions.length > 0 && (
            <InterviewWizard
              questions={questions}
              onComplete={handleInterviewComplete}
              isLoading={isLoading}
            />
          )}

          {step === 'complete' && caseStudy && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 rounded-lg border border-[#10b981]/30 bg-[#0f2318] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#10b981]/20">
                  <Check className="h-6 w-6 text-[#10b981]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#10b981]">Case Study Generated!</h3>
                  <p className="text-sm text-[#9ca3af]">
                    Your polished case study is ready to share with the world
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-[#10b981]/30 bg-gradient-to-br from-[#050505] via-[#050505] to-[#0f2318] p-8">
                <div className="prose prose-invert max-w-none">
                  <div className="space-y-6 text-[#d1d5db]">
                    {caseStudy.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) {
                        return (
                          <h2 key={i} className="text-2xl font-bold text-[#e5e7eb] mt-8">
                            {line.replace('# ', '')}
                          </h2>
                        );
                      }
                      if (line.startsWith('## ')) {
                        return (
                          <h3 key={i} className="text-xl font-bold text-[#e5e7eb] mt-6">
                            {line.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (line.trim()) {
                        return (
                          <p key={i} className="leading-relaxed">
                            {line}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-lg border border-[#10b981]/30 px-6 py-3 font-bold text-[#10b981] transition-all hover:bg-[#10b981]/10"
                >
                  <FileText className="mr-2 inline h-4 w-4" />
                  Generate Another
                </button>
                <button className="flex-1 rounded-lg bg-[#10b981] px-6 py-3 font-bold text-[#050505] transition-all hover:bg-[#059669]">
                  Download & Share
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
