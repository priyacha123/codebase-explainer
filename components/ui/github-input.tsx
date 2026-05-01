"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { IconBrandGithub, IconLoader2, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function GitHubInput() {
  const [githubUrl, setGithubUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [error, setError] = useState("");

  const validateGitHubUrl = (url: string) => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+\/?$/;
    return githubRegex.test(url);
  };

  const handleAnalyze = async () => {
    if (!githubUrl.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    if (!validateGitHubUrl(githubUrl)) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    setError("");
    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      // Reset after 3 seconds
      setTimeout(() => setIsAnalyzed(false), 3000);
    }, 2500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-gray-600 mb-6"
          >
            <IconBrandGithub className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Analyze Your Codebase
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Enter a GitHub repository URL to get AI-powered insights, architecture analysis, and comprehensive documentation.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
          
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label htmlFor="github-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IconBrandGithub className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="github-url"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => {
                      setGithubUrl(e.target.value);
                      setError("");
                      setIsAnalyzed(false);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="https://github.com/username/repository"
                    className={cn(
                      "w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                      "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
                      "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                      error && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {isAnalyzed && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <IconCheck className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={cn(
                  "w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200",
                  "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                )}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <IconLoader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing repository...</span>
                  </div>
                ) : (
                  <span>Analyze Codebase</span>
                )}
              </motion.button>

              {isAnalyzed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <IconCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      Repository analysis complete! Redirecting to results...
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>AI-powered insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Comprehensive documentation</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
