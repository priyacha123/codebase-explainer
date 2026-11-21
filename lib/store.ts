import { create } from 'zustand'

export interface AnalysisData {
  status: string;
  files: Record<string, string>; // path -> content
  summaries: Record<string, string>; // path -> summary
  architecture_overview: string;
  graph?: {
    nodes: any[];
    edges: any[];
  };
}

interface AnalysisStore {
  analysisData: AnalysisData | null;
  selectedFile: string | null;
  repoUrl: string;
  setAnalysisData: (data: AnalysisData) => void;
  setSelectedFile: (file: string | null) => void;
  setRepoUrl: (url: string) => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  analysisData: null,
  selectedFile: null,
  repoUrl: "No repository loaded",
  setAnalysisData: (data) => set({ analysisData: data }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setRepoUrl: (url) => set({ repoUrl: url }),
}))
