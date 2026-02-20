'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  MessageCircle,
  Mic,
  Check,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export interface Question {
  id: string;
  question: string;
  context: string;
  category: 'architecture' | 'performance' | 'security' | 'ux' | 'impact';
}

export interface Answer {
  questionId: string;
  text: string;
  type: 'text' | 'voice';
}

export function InterviewWizard({
  questions,
  onComplete,
  isLoading,
}: {
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
  isLoading: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleTextAnswer = (text: string) => {
    if (!text.trim()) return;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      text: text.trim(),
      type: 'text',
    };

    const existingIndex = answers.findIndex(
      (a) => a.questionId === currentQuestion.id
    );
    const updatedAnswers =
      existingIndex >= 0
        ? answers.map((a, i) => (i === existingIndex ? newAnswer : a))
        : [...answers, newAnswer];

    setAnswers(updatedAnswers);
    setInputValue('');

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = async () => {
    if (answers.length === questions.length) {
      onComplete(answers);
    }
  };

  const categoryEmoji: Record<Question['category'], string> = {
    architecture: '🏗️',
    performance: '⚡',
    security: '🔒',
    ux: '✨',
    impact: '🚀',
  };

  const categoryLabel: Record<Question['category'], string> = {
    architecture: 'Architecture',
    performance: 'Performance',
    security: 'Security',
    ux: 'User Experience',
    impact: 'Business Impact',
  };

  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  if (!currentQuestion) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-6"
    >
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9ca3af]">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="font-semibold text-[#10b981]">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 rounded-full bg-[#1f2937] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-[#10b981] to-[#059669]"
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="rounded-lg border border-[#10b981]/30 bg-gradient-to-br from-[#050505] via-[#050505] to-[#0f2318] p-8 shadow-xl"
      >
        {/* Category Badge */}
        <div className="mb-6 inline-block rounded-full bg-[#10b981]/20 px-3 py-1 text-sm font-medium text-[#10b981]">
          {categoryEmoji[currentQuestion.category]}{' '}
          {categoryLabel[currentQuestion.category]}
        </div>

        {/* Question */}
        <h3 className="mb-4 text-2xl font-bold text-[#e5e7eb] leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* Context */}
        <p className="mb-8 text-[#9ca3af] leading-relaxed">
          <span className="font-semibold text-[#d1d5db]">Why this matters:</span>{' '}
          {currentQuestion.context}
        </p>

        {/* Input Area */}
        <div className="space-y-4">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Share your experience, decisions, and insights..."
            className="w-full rounded-lg border border-[#10b981]/20 bg-[#0f0f0f] px-4 py-4 text-[#e5e7eb] placeholder-[#6b7280] outline-none transition-all focus:border-[#10b981]/50 focus:ring-1 focus:ring-[#10b981]/30 resize-none"
            rows={5}
          />

          <div className="flex gap-2">
            <button
              onClick={() => handleTextAnswer(inputValue)}
              disabled={!inputValue.trim()}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#10b981] px-4 py-3 font-medium text-[#050505] transition-all hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4" />
              Save Answer
            </button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#10b981]/30 px-4 py-3 font-medium text-[#10b981] transition-all hover:bg-[#10b981]/10"
            >
              <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
              Voice
            </button>
          </div>
        </div>

        {/* Current Answer Display */}
        {currentAnswer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-lg border border-[#10b981]/30 bg-[#0f2318] p-4"
          >
            <p className="text-sm font-semibold text-[#10b981] mb-2">Your Answer:</p>
            <p className="text-[#d1d5db] text-sm leading-relaxed">{currentAnswer.text}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#10b981]/30 text-[#10b981] font-medium transition-all hover:bg-[#10b981]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex gap-2">
          {questions.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all ${i === currentIndex ? 'bg-[#10b981] w-8' : 'bg-[#374151] w-2'
                }`}
            />
          ))}
        </div>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleComplete}
            disabled={answers.length !== questions.length || isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#10b981] text-[#050505] font-bold transition-all hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {isLoading ? 'Generating...' : 'Complete'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#10b981] text-[#050505] font-bold transition-all hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
