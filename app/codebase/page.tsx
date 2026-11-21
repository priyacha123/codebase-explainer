"use client"

import { useState, useEffect, useCallback } from "react"
import { Github, Folder, FileText, ChevronDown, ChevronRight, GitBranch, Play, Save, Layers, List } from "lucide-react"
import { useAnalysisStore } from "../../lib/store"
import { useRouter } from "next/navigation"
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge, 
  MarkerType,
  Position
} from "react-flow-renderer"

export default function CodebaseViewer() {
  const router = useRouter()
  const { analysisData, selectedFile, setSelectedFile, repoUrl, setAnalysisData } = useAnalysisStore()
  
  const [promptOpen, setPromptOpen] = useState(false)
  const [expandedDirs, setExpandedDirs] = useState(new Set<string>())
  const [prompts, setPrompts] = useState<Record<string, string>>({})
  const [selectedPromptKey, setSelectedPromptKey] = useState("file_summary")
  const [promptValue, setPromptValue] = useState("")
  const [isSavingPrompt, setIsSavingPrompt] = useState(false)
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false)

  // Redirect if no data
  useEffect(() => {
    if (!analysisData) {
      router.push('/upload')
    }
  }, [analysisData, router])

  // Fetch prompts on mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/prompts")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setPrompts(data.prompts)
          setPromptValue(data.prompts["file_summary"] || "")
        }
      })
      .catch(err => console.error("Failed to fetch prompts:", err))
  }, [])

  // Update prompt value when key changes
  useEffect(() => {
    if (prompts[selectedPromptKey]) {
      setPromptValue(prompts[selectedPromptKey])
    }
  }, [selectedPromptKey, prompts])

  if (!analysisData) {
    return <div className="h-screen bg-white dark:bg-neutral-950 flex items-center justify-center font-mono text-xs text-neutral-500">Redirecting...</div>
  }

  // Build tree
  const buildTree = (files: Record<string, string>) => {
    const root: any = {};
    for (const path of Object.keys(files)) {
      const parts = path.split('/');
      let current = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? null : {};
        }
        current = current[part];
      }
    }
    return root;
  };

  const fileTree = analysisData.files ? buildTree(analysisData.files) : {};

  const toggleDir = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) newExpanded.delete(path);
    else newExpanded.add(path);
    setExpandedDirs(newExpanded);
  };

  const renderTree = (node: any, path = '') => {
    return Object.entries(node).map(([name, children]) => {
      const currentPath = path ? `${path}/${name}` : name;
      const isDir = children !== null;
      const isExpanded = expandedDirs.has(currentPath);

      if (isDir) {
        return (
          <div key={currentPath} className="ml-2">
            <div 
              className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 dark:hover:text-white py-1 opacity-80"
              onClick={() => toggleDir(currentPath)}
            >
              {isExpanded ? <ChevronDown size={12} className="text-neutral-400" /> : <ChevronRight size={12} className="text-neutral-400" />}
              <Folder size={10} className="text-neutral-400" />
              <span className="text-[10px] tracking-wide">{name}/</span>
            </div>
            {isExpanded && <div className="ml-1 border-l border-neutral-200 dark:border-neutral-800 pl-1">{renderTree(children, currentPath)}</div>}
          </div>
        );
      }

      return (
        <div 
          key={currentPath} 
          className={`ml-3 flex items-center gap-2 cursor-pointer py-1 ${selectedFile === currentPath ? 'text-blue-500 font-medium' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
          onClick={() => setSelectedFile(currentPath)}
        >
          <FileText size={10} className={selectedFile === currentPath ? 'text-blue-500' : 'text-neutral-400'} />
          <span className="text-[10px] tracking-wide truncate">{name}</span>
        </div>
      );
    });
  };

  const handleSavePrompt = async () => {
    setIsSavingPrompt(true)
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/prompts/${selectedPromptKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: promptValue })
      })
      if (res.ok) {
        setPrompts(prev => ({ ...prev, [selectedPromptKey]: promptValue }))
        alert("Prompt saved successfully!")
      }
    } catch (err) {
      console.error("Failed to save prompt:", err)
    } finally {
      setIsSavingPrompt(false)
    }
  }

  const handleRunAnalysis = async () => {
    if (!selectedFile) {
      alert("Please select a file to re-analyze.")
      return
    }
    setIsRunningAnalysis(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          filename: selectedFile, 
          content: analysisData.files[selectedFile] || "" 
        })
      })
      const data = await res.json()
      if (data.status === "success") {
        // Update summaries in global state
        const newSummaries = { ...analysisData.summaries, [selectedFile]: data.explanation }
        setAnalysisData({ ...analysisData, summaries: newSummaries })
      }
    } catch (err) {
      console.error("Analysis failed:", err)
    } finally {
      setIsRunningAnalysis(false)
    }
  }

  // ReactFlow Graph setup
  const nodes: Node[] = (analysisData.graph?.nodes || []).map((node: any, idx: number) => ({
    id: node.id,
    data: { label: node.data?.label || node.id },
    position: { x: (idx % 5) * 200, y: Math.floor(idx / 5) * 100 },
    style: { 
      fontSize: '8px', 
      background: '#fff', 
      border: '1px solid #e5e7eb', 
      padding: '4px',
      borderRadius: '2px',
      width: 120,
      textAlign: 'center' as const
    }
  }))

  const edges: Edge[] = (analysisData.graph?.edges || []).map((edge: any) => ({
    id: `e-${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    animated: true,
    style: { stroke: '#94a3b8', strokeWidth: 1 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' }
  }))

  const numFiles = Object.keys(analysisData.files || {}).length;
  const numDeps = nodes.length;

  return (
    <div
      className="flex flex-col h-screen bg-white dark:bg-neutral-950 overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >

      {/* ── Top Bar ── */}
      <div className="flex items-center h-11 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
        <div className="flex items-center px-4 h-full border-r border-neutral-100 dark:border-neutral-800 flex-shrink-0">
          <span
            className="text-[.95rem] font-light tracking-tight text-neutral-900 dark:text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}
          >
            codebase<em className="text-neutral-300 dark:text-neutral-600">.</em>viewer
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 px-4 h-full border-r border-neutral-100 dark:border-neutral-800 min-w-0">
          <Github className="w-3 h-3 text-neutral-300 dark:text-neutral-600 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-[10px] font-light text-neutral-600 dark:text-neutral-300 tracking-wide truncate">
            {repoUrl}
          </span>
        </div>

        <div className="flex items-center h-full flex-shrink-0">
          <button onClick={() => router.push('/upload')} className="h-full px-4 text-[9px] tracking-[0.14em] uppercase text-neutral-400 border-l border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-700 dark:hover:text-white transition-colors">
            Upload
          </button>
          <button onClick={() => router.push('/upload')} className="h-full px-4 text-[9px] tracking-[0.14em] uppercase bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-l border-neutral-100 dark:border-neutral-800 hover:opacity-75 transition-opacity">
            New Analysis ↗
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: File Tree ── */}
        <div className="w-[250px] flex-shrink-0 border-r border-neutral-100 dark:border-neutral-800 flex flex-col overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/20">
          <PanelHeader label="File tree" num="02" />

          <div className="flex-1 overflow-y-auto p-3">
            {numFiles > 0 ? (
              <div className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-0.5">
                {renderTree(fileTree)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 p-7 h-full">
                <div className="w-7 h-7 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                  <Folder className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" strokeWidth={1.2} />
                </div>
                <span className="text-[9px] tracking-[0.1em] text-neutral-300 dark:text-neutral-600 text-center leading-[1.8]">
                  No repository<br />loaded yet
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: explanation top + graph bottom ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* File Explanation Panel */}
          <div className="flex-1 flex flex-col border-b border-neutral-100 dark:border-neutral-800 overflow-hidden min-h-0 bg-white dark:bg-neutral-950">
            <PanelHeader label="File explanation" num="04" />
            <div className="flex flex-1 overflow-hidden">
              {!selectedFile ? (
                <div className="flex-1 flex flex-col items-start p-8 overflow-y-auto">
                  <h4 className="text-[10px] tracking-[0.18em] uppercase text-blue-500 mb-4">Architecture Overview</h4>
                  <div className="text-[11px] leading-[1.8] text-neutral-600 dark:text-neutral-300 prose prose-sm max-w-none prose-neutral dark:prose-invert">
                    {analysisData.architecture_overview || "No overview available."}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-start p-8 overflow-y-auto relative">
                  {isRunningAnalysis && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-neutral-950/50 flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  <h4 className="text-[10px] tracking-[0.18em] uppercase text-neutral-500 mb-2">Selected File</h4>
                  <p className="text-[10px] text-blue-500 mb-6 font-bold bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-1 rounded border border-blue-100 dark:border-blue-900/50">{selectedFile}</p>
                  <div className="text-[11px] leading-[1.8] text-neutral-600 dark:text-neutral-300 prose prose-sm max-w-none prose-neutral dark:prose-invert">
                    {analysisData.summaries?.[selectedFile] || "No AI summary available for this file."}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dependency Graph */}
          <div className="h-[250px] flex-shrink-0 flex flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-900/50 relative">
            <PanelHeader label="Dependency graph" num="03" />
            <div className="flex-1 overflow-hidden">
              {nodes.length > 0 ? (
                <ReactFlow 
                  nodes={nodes} 
                  edges={edges}
                  fitView
                  attributionPosition="bottom-right"
                >
                  <Background color="#d4d4d4" gap={22} size={0.5} />
                  <Controls style={{ display: 'flex', flexDirection: 'row', gap: '4px', padding: '4px', borderRadius: '4px' }} />
                </ReactFlow>
              ) : (
                <div className="flex-1 relative flex items-center justify-center h-full">
                  <div className="relative z-10 flex flex-col items-center gap-2.5 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm p-4 border border-neutral-200 dark:border-neutral-800 rounded">
                    <p className="text-[9px] tracking-[0.1em] text-center text-neutral-600 dark:text-neutral-300 leading-[1.8]">
                      No graph data available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Prompt Editor Bar ── */}
      <div className="border-t border-neutral-100 dark:border-neutral-800 flex-shrink-0 bg-white dark:bg-neutral-950">
        <button
          onClick={() => setPromptOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 h-[34px] hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[9px] tracking-[0.18em] uppercase text-neutral-400">Prompt editor</span>
            <span className="text-[8px] tracking-[0.08em] px-1.5 py-[2px] border border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500">
              Editing: {selectedPromptKey}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] tracking-[0.08em] px-1.5 py-[2px] border border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500">05</span>
            <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${promptOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {promptOpen && (
          <div className="flex border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30">
            <div className="w-[150px] border-r border-neutral-100 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/50 p-2 flex flex-col gap-1 overflow-y-auto max-h-[150px]">
              {Object.keys(prompts).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedPromptKey(key)}
                  className={`text-[8px] text-left px-2 py-1.5 rounded transition-colors ${selectedPromptKey === key ? 'bg-blue-500 text-white' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500'}`}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="flex-1 p-3 border-r border-neutral-100 dark:border-neutral-800">
              <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 flex flex-col gap-1.5 h-[100px]">
                <textarea 
                  className="w-full h-full bg-transparent resize-none outline-none text-[10px] text-neutral-600 dark:text-neutral-300"
                  placeholder="System instructions..."
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col w-[84px] flex-shrink-0 bg-white dark:bg-neutral-950">
              <button
                onClick={handleRunAnalysis}
                disabled={isRunningAnalysis}
                className="text-[9px] tracking-[0.12em] uppercase text-neutral-500 px-3 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2"
              >
                <Play size={10} /> Run ↗
              </button>
              <button
                onClick={handleSavePrompt}
                disabled={isSavingPrompt}
                className="text-[9px] tracking-[0.12em] uppercase text-neutral-500 px-3 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2"
              >
                <Save size={10} /> {isSavingPrompt ? 'Saving...' : 'Save'}
              </button>
              <button className="text-[9px] tracking-[0.12em] uppercase text-neutral-500 px-3 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <Layers size={10} /> Diff
              </button>
              <button className="text-[9px] tracking-[0.12em] uppercase text-neutral-500 px-3 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-2">
                <List size={10} /> Presets
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Status Bar ── */}
      <div className="h-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center px-3 gap-4 flex-shrink-0 bg-white dark:bg-neutral-950">
        {[
          { dot: "bg-green-400", label: "ready" },
          { dot: "bg-blue-400", label: `${numFiles} files` },
          { dot: "bg-purple-400", label: `${numDeps} deps` },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`w-1 h-1 rounded-full ${s.dot}`} />
            <span className="text-[8px] tracking-[0.1em] text-neutral-500 dark:text-neutral-400">{s.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <GitBranch className="w-2.5 h-2.5 text-neutral-400" />
          <span className="text-[8px] tracking-[0.1em] text-neutral-500 dark:text-neutral-400">v2.1.0</span>
        </div>
      </div>

    </div>
  )
}

function PanelHeader({ label, num }: { label: string; num: string }) {
  return (
    <div className="flex items-center justify-between px-3 h-[34px] border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0 bg-neutral-50/50 dark:bg-neutral-900/30">
      <span className="text-[9px] tracking-[0.18em] uppercase text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="text-[8px] tracking-[0.08em] px-1.5 py-[2px] border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">{num}</span>
    </div>
  )
}
