'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Github, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ImportedRepo {
  url: string;
  name: string;
  description?: string;
  tech_stack?: string[];
}

export function GitHubImporter({
  onImport,
  isLoading,
}: {
  onImport: (repo: ImportedRepo) => void;
  isLoading: boolean;
}) {
  const [url, setUrl] = useState('');
  const [manualContext, setManualContext] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!url.trim()) {
      setError('Please enter a GitHub URL');
      return;
    }

    // Validate GitHub URL format
    const githubUrlRegex =
      /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubUrlRegex.test(url)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    try {
      const response = await fetch('/api/ai/analyze-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl: url, manualContext }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze repository');
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setSuccess(true);
      setTimeout(() => {
        onImport({
          url,
          name: result.analysis.title || url.split('/').pop() || 'Untitled',
          description: result.analysis.subtitle || result.analysis.summary?.split('.')[0] || '',
          tech_stack: result.analysis.technologies || [],
          analysis: result.analysis // Pass full analysis
        } as any);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze repository');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#9ca3af] mb-2">
            Repository URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full rounded-lg border border-[#10b981]/20 bg-[#0f0f0f] px-4 py-3 text-[#e5e7eb] placeholder-[#6b7280] outline-none transition-all focus:border-[#10b981]/50 focus:ring-1 focus:ring-[#10b981]/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#9ca3af] mb-2">
            Project Story / Human Context <span className="text-[#10b981] text-xs">(Optional but Recommended)</span>
          </label>
          <textarea
            value={manualContext}
            onChange={(e) => setManualContext(e.target.value)}
            placeholder="Tell the story behind this project. What were the biggest challenges? What is the core problem it solves? Who is it for?"
            rows={4}
            className="w-full rounded-lg border border-[#10b981]/20 bg-[#0f0f0f] px-4 py-3 text-[#e5e7eb] placeholder-[#6b7280] outline-none transition-all focus:border-[#10b981]/50 focus:ring-1 focus:ring-[#10b981]/30 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#10b981] px-4 py-3 font-medium text-[#050505] transition-all hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isLoading ? 'Analyzing Repository...' : 'Analyze Repository'}
        </button>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3"
          >
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 rounded-lg border border-[#10b981]/30 bg-[#10b981]/10 p-3"
          >
            <CheckCircle2 className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#10b981]">Repository imported successfully!</p>
          </motion.div>
        )}
      </form>

      <div className="mt-6 space-y-3 border-t border-[#10b981]/20 pt-6">
        <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">
          What we analyze
        </p>
        <ul className="space-y-2 text-sm text-[#d1d5db]">
          <li className="flex items-start gap-2">
            <span className="text-[#10b981] font-bold">•</span>
            <span>Project structure & architecture patterns</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10b981] font-bold">•</span>
            <span>Technology stack and dependencies</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10b981] font-bold">•</span>
            <span>README and configuration files</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
