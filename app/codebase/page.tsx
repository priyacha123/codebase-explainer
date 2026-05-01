"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"

type Sub = { t: string; done: boolean; tag?: string }
type Task = {
  id: number
  title: string
  status: "done" | "active" | "pending"
  badges: string[]
  required?: boolean
  subs: Sub[]
}

const INITIAL: Task[] = [
  {
    id: 0,
    title: "Build GitHub URL input + file upload UI",
    status: "done",
    badges: ["React", "Tailwind", "Framer Motion"],
    subs: [
      { t: "GitHub URL text input with validation", done: true },
      { t: "Drag-and-drop file upload zone", done: true },
      { t: "File pill list with remove controls", done: true },
      { t: "Animated progress bar + step indicators", done: true },
      { t: "Status bar with pulse indicator", done: true },
    ],
  },
  {
    id: 1,
    title: "Build File Tree Viewer component",
    status: "pending",
    badges: ["React", "Recursive", "Virtualized"],
    subs: [
      { t: "Recursive folder/file tree renderer", done: false, tag: "core" },
      { t: "Expand / collapse folder nodes", done: false, tag: "UX" },
      { t: "File type icons (svg, ts, py, etc.)", done: false, tag: "icons" },
      { t: "Search & filter files by name", done: false, tag: "search" },
      { t: "Highlight active/selected file", done: false, tag: "state" },
      { t: "Virtual scroll for large repos", done: false, tag: "perf" },
    ],
  },
  {
    id: 2,
    title: "Build Dependency Graph Visualization",
    status: "pending",
    badges: ["D3.js", "React Flow", "Force-directed"],
    subs: [
      { t: "Parse import/require statements from files", done: false, tag: "parser" },
      { t: "Build adjacency list of module deps", done: false, tag: "core" },
      { t: "Render force-directed graph with D3", done: false, tag: "D3" },
      { t: "Node hover: show file name + dep count", done: false, tag: "UX" },
      { t: "Click node → open File Explanation Panel", done: false, tag: "nav" },
      { t: "Zoom, pan, reset controls", done: false, tag: "controls" },
      { t: "Highlight circular dependencies in red", done: false, tag: "analysis" },
    ],
  },
  {
    id: 3,
    title: "Build File Explanation Panel",
    status: "pending",
    badges: ["Claude API", "Streaming", "AI"],
    subs: [
      { t: "Slide-in side panel with file context header", done: false, tag: "layout" },
      { t: "Stream AI summary token by token", done: false, tag: "streaming" },
      { t: "Show: purpose, exports, key functions", done: false, tag: "content" },
      { t: "Code snippet preview with syntax highlight", done: false, tag: "code" },
      { t: "Complexity + lines of code metrics", done: false, tag: "metrics" },
      { t: "Related files section (via dep graph)", done: false, tag: "links" },
    ],
  },
  {
    id: 4,
    title: "Build Prompt Editor UI",
    status: "pending",
    required: true,
    badges: ["Monaco Editor", "Claude API", "Required"],
    subs: [
      { t: "Monaco editor for system prompt editing", done: false, tag: "editor" },
      { t: "Variable token insertion ({filename}, {tree})", done: false, tag: "tokens" },
      { t: "Live preview of prompt with context injected", done: false, tag: "preview" },
      { t: "Run prompt → stream response in panel", done: false, tag: "exec" },
      { t: "Save / load named prompt presets", done: false, tag: "persist" },
      { t: "Diff view: compare original vs edited prompt", done: false, tag: "diff" },
      { t: "Reviewer annotation sidebar", done: false, tag: "review" },
    ],
  },
]

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL)
  const [open, setOpen] = useState<boolean[]>(INITIAL.map((t) => t.status === "done"))

  const completedCount = tasks.filter((t) => t.subs.every((s) => s.done)).length
  const progressPct = Math.round((completedCount / tasks.length) * 100)

  const toggleTask = (i: number) => {
    setTasks((prev) => {
      const next = [...prev]
      const allDone = next[i].subs.every((s) => s.done)
      next[i] = {
        ...next[i],
        subs: next[i].subs.map((s) => ({ ...s, done: !allDone })),
      }
      return next
    })
  }

  const toggleSub = (i: number, j: number) => {
    setTasks((prev) => {
      const next = [...prev]
      const subs = next[i].subs.map((s, idx) =>
        idx === j ? { ...s, done: !s.done } : s
      )
      next[i] = { ...next[i], subs }
      return next
    })
  }

  const toggleOpen = (i: number) =>
    setOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  return (
    <div
      className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <div className="max-w-[640px] mx-auto">

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between pb-5 mb-8 border-b border-neutral-100 dark:border-neutral-800"
        >
          <h1
            className="text-2xl font-light tracking-tight text-neutral-900 dark:text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}
          >
            codebase<em className="text-neutral-300 dark:text-neutral-600">.</em>viewer
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.14em] text-neutral-400">implementation plan</span>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400">Overall progress</span>
            <span
              className="text-2xl font-light text-neutral-900 dark:text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {completedCount} / {tasks.length}
            </span>
          </div>
          <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-neutral-900 dark:bg-white"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <div className="flex gap-6 mt-2">
            {[
              ["Completed", completedCount],
              ["Remaining", tasks.length - completedCount],
              ["Required", tasks.filter((t) => t.required && !t.subs.every((s) => s.done)).length],
            ].map(([label, val]) => (
              <span key={label as string} className="text-[10px] text-neutral-400 tracking-[0.06em]">
                {label} <span className="text-neutral-600 dark:text-neutral-300">{val}</span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* Task list */}
        <div>
          {tasks.map((task, i) => {
            const allDone = task.subs.every((s) => s.done)
            const someDone = task.subs.some((s) => s.done)
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.06 }}
                className="border-t border-neutral-100 dark:border-neutral-800 last:border-b"
              >
                {/* Task row */}
                <div
                  className="flex items-start gap-3 py-4 cursor-pointer group"
                  onClick={() => toggleOpen(i)}
                >
                  {/* Checkbox */}
                  <div
                    onClick={(e) => { e.stopPropagation(); toggleTask(i) }}
                    className={`w-[14px] h-[14px] border flex items-center justify-center flex-shrink-0 mt-[2px] transition-colors cursor-pointer ${
                      allDone
                        ? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white"
                        : someDone
                        ? "border-neutral-400 dark:border-neutral-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                  >
                    {allDone && (
                      <Check
                        className="w-[8px] h-[8px] text-white dark:text-neutral-900"
                        strokeWidth={2.5}
                      />
                    )}
                    {someDone && !allDone && (
                      <div className="w-[6px] h-[1px] bg-neutral-400" />
                    )}
                  </div>

                  {/* Number */}
                  <span className="text-[9px] tracking-[0.1em] text-neutral-300 dark:text-neutral-600 w-4 text-right flex-shrink-0 mt-[2px]">
                    0{i + 1}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] leading-relaxed tracking-[0.02em] transition-colors group-hover:text-neutral-900 dark:group-hover:text-white ${
                      allDone
                        ? "line-through text-neutral-300 dark:text-neutral-600"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {task.badges.map((b) => (
                        <span
                          key={b}
                          className={`text-[8px] tracking-[0.08em] px-1.5 py-[2px] border ${
                            b === "Required"
                              ? "border-red-200 text-red-400 dark:border-red-800 dark:text-red-500"
                              : allDone
                              ? "border-neutral-100 dark:border-neutral-800 text-neutral-300 dark:text-neutral-600"
                              : "border-neutral-200 dark:border-neutral-700 text-neutral-400"
                          }`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-2.5 flex-shrink-0 mt-[1px]">
                    <span className={`text-[9px] tracking-[0.1em] px-2 py-[2px] border ${
                      allDone
                        ? "border-green-200 text-green-500 dark:border-green-900 dark:text-green-400"
                        : someDone
                        ? "border-amber-200 text-amber-600 dark:border-amber-900 dark:text-amber-400"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-400"
                    }`}>
                      {allDone ? "done" : someDone ? "in progress" : "pending"}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-neutral-300 dark:text-neutral-600 transition-transform duration-200 ${
                        open[i] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Sub-tasks */}
                <AnimatePresence initial={false}>
                  {open[i] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 pl-[52px] flex flex-col">
                        {task.subs.map((sub, j) => (
                          <div
                            key={j}
                            className="flex items-start gap-2 py-[7px] border-t border-neutral-100 dark:border-neutral-800 first:border-t-0 cursor-pointer group/sub"
                            onClick={() => toggleSub(i, j)}
                          >
                            <div className={`w-[10px] h-[10px] border flex items-center justify-center flex-shrink-0 mt-[3px] transition-colors ${
                              sub.done
                                ? "bg-neutral-400 dark:bg-neutral-500 border-neutral-400 dark:border-neutral-500"
                                : "border-neutral-200 dark:border-neutral-700"
                            }`}>
                              {sub.done && (
                                <svg width="6" height="6" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.5">
                                  <polyline points="1,4 3,6 7,2" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-[10px] tracking-[0.02em] leading-relaxed flex-1 transition-colors group-hover/sub:text-neutral-700 dark:group-hover/sub:text-neutral-300 ${
                              sub.done
                                ? "line-through text-neutral-300 dark:text-neutral-600"
                                : "text-neutral-500 dark:text-neutral-400"
                            }`}>
                              {sub.t}
                            </span>
                            {sub.tag && (
                              <span className="text-[8px] tracking-[0.08em] px-1.5 py-[1px] border border-neutral-100 dark:border-neutral-800 text-neutral-300 dark:text-neutral-600 flex-shrink-0 mt-[3px]">
                                {sub.tag}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            <span className="text-[9px] tracking-[0.12em] text-neutral-300 dark:text-neutral-600">
              Next.js · TypeScript · Tailwind · shadcn/ui
            </span>
          </div>
          <span className="text-[9px] tracking-[0.1em] text-neutral-300 dark:text-neutral-600">
            {progressPct}% complete
          </span>
        </motion.div>

      </div>
    </div>
  )
}
