"use client"

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Github, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

const STEPS = ["Parsing", "Indexing", "Analysing", "Complete"]

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${Math.round(b / 1024)} KB`
  return `${(b / 1048576).toFixed(1)} MB`
}

const Page = () => {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const addFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles])
    setError("")
  }

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  const startAnalysis = () => {
    if (!url && files.length === 0) {
      setError("Add a URL or upload files first")
      setTimeout(() => setError(""), 2200)
      return
    }
    setLoading(true)
    setStepIndex(0)
    if (timerRef.current) clearInterval(timerRef.current)
    let i = 0
    timerRef.current = setInterval(() => {
      i = Math.min(i + 1, STEPS.length - 1)
      setStepIndex(i)
      if (i === STEPS.length - 1) clearInterval(timerRef.current!)
    }, 1300)
  }

  const hintText = error
    ? error
    : files.length === 0
    ? "No files selected"
    : `${files.length} file${files.length > 1 ? "s" : ""} selected`

  return (
    // ✅ FULL SCREEN WRAPPER
    <div className="h-full w-full flex flex-col items-center justify-center">
      
      {/* ✅ CENTERED CONTENT */}
      <div
        className="w-full max-w-5xl px-8 flex flex-col h-full justify-center"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >

        <AnimatePresence mode="wait">
          {!loading ? (
            <motion.div
              key="upload-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col"
            >
              {/* Status bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100 dark:border-neutral-800"
              >
                <div className="flex items-center gap-2">
                  <span className="w-[5px] h-[5px] rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] tracking-[0.16em] text-neutral-400">Analysis ready</span>
                </div>
                <span className="text-[10px] tracking-[0.1em] text-neutral-300 dark:text-neutral-600">v2.1.0</span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-6xl md:text-7xl font-light leading-[0.9] tracking-tight mb-4"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}
              >
                Upload your<br />
                <em className="text-neutral-200 dark:text-neutral-700">repository</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[11px] font-light text-neutral-400 leading-[1.6] mb-8 tracking-wide"
              >
                Paste a GitHub link or drop your source files.<br />
                Deep AI analysis in seconds.
              </motion.p>

              {/* Section 01 — URL */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] tracking-[0.1em] border border-neutral-200 dark:border-neutral-700 w-[20px] h-[20px] flex items-center justify-center text-neutral-400">
                    01
                  </span>
                  <span className="text-[9px] tracking-[0.22em] uppercase text-neutral-400">GITHUB URL</span>
                </div>

                <div className={`flex items-center gap-3 px-4 py-4 transition-colors ${
                  url ? "bg-neutral-100 dark:bg-neutral-800" : "bg-neutral-50 dark:bg-neutral-900"
                }`}>
                  <Github className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" strokeWidth={1.5} />
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="github.com/username/repository"
                    className="flex-1 bg-transparent outline-none text-[11px] text-neutral-900 dark:text-white"
                  />
                </div>
              </motion.div>

              {/* OR divider */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-center my-6">
                <span className="text-[9px] text-neutral-300 dark:text-neutral-600 tracking-widest lowercase">or</span>
              </motion.div>

              {/* Section 02 — Upload */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] tracking-[0.1em] border border-neutral-200 dark:border-neutral-700 w-[20px] h-[20px] flex items-center justify-center text-neutral-400">
                    02
                  </span>
                  <span className="text-[9px] tracking-[0.22em] uppercase text-neutral-400">UPLOAD FILES</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={e => e.target.files && addFiles(Array.from(e.target.files))}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className="border border-neutral-200 dark:border-neutral-800 py-10 md:py-12 text-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex flex-col items-center justify-center"
                >
                  <Upload className="w-4 h-4 text-neutral-300 dark:text-neutral-600 mb-5" strokeWidth={1} />
                  <p className="text-[11px] text-neutral-500 mb-2.5">Drop files here</p>
                  <p className="text-[9px] text-neutral-300 dark:text-neutral-600 tracking-[0.2em] uppercase">.js .ts .py .go .rs .java .cpp</p>
                </div>
              </motion.div>

              {/* Bottom */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-between items-end mt-10">
                <span className="text-[10px] text-neutral-400 tracking-widest uppercase">{hintText}</span>
                <button onClick={startAnalysis} className="border border-neutral-200 dark:border-neutral-800 px-8 py-3 text-[9px] tracking-[0.2em] font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2">
                  ANALYSE <span className="transform rotate-45 text-neutral-400">↗</span>
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="loading-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center justify-center py-24"
            >
              <div className="mb-10 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-neutral-200 dark:border-neutral-800 animate-ping opacity-50"></div>
                <div className="w-20 h-20 rounded-full border-t border-black dark:border-white animate-spin"></div>
              </div>
              <motion.h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase text-neutral-900 mb-4">
                {STEPS[stepIndex]}
              </motion.h2>
              <div className="w-64 h-[1px] bg-neutral-200 dark:bg-neutral-800 mt-8 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-black dark:bg-white" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                  transition={{ ease: "easeInOut", duration: 1 }}
                />
              </div>
              {stepIndex === STEPS.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => router.push('/codebase')}
                  className="mt-12 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-white text-black px-8 py-3 text-[10px] tracking-[0.2em] font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                  VIEW RESULTS
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

export default Page