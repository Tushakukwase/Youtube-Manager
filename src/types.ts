export type LanguageMode = 'hinglish' | 'hi' | 'en';

export interface VideoMetadata {
  title?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
}

export interface VideoChapter {
  timestamp: string;
  title: string;
  retentionTactic: string;
}

export interface ViralFactor {
  factor: string;
  description: string;
}

export interface VideoAnalysis {
  summary: string;
  targetAudience: string;
  retentionScore: number;
  hookAnalysis: {
    effectiveness: string;
    hookFormula: string;
    recommendation: string;
  };
  keyHighlights: string[];
  chapters: VideoChapter[];
  viralFactors: ViralFactor[];
  nextVideoAngles: string[];
  topCommentSuggestions: {
    type: string;
    comment: string;
  }[];
}

export interface ScriptScene {
  sceneNumber: number;
  timeCode: string;
  sectionName: string;
  visualDirection: string;
  onScreenText: string;
  soundEffects: string;
  spokenDialogue: string;
  bRollIdea: string;
}

export interface VideoScript {
  title: string;
  hook: {
    first3Seconds: string;
    visualHook: string;
    soundEffect: string;
    retentionPromise: string;
  };
  structureSummary: string;
  scenes: ScriptScene[];
  retentionSpikes: string[];
  callToAction: {
    verbalCTA: string;
    endScreenHook: string;
  };
  productionChecklist: string[];
}

export interface TitleIdea {
  title: string;
  ctrScore: number;
  formula: string;
  whyItWorks: string;
  characterCount: number;
}

export interface ThumbnailConcept {
  id: number;
  conceptName: string;
  layout: string;
  focalSubject: string;
  overlayText: string;
  textColor: string;
  visualElements: string;
  background: string;
  psychology: string;
}

export interface SeoData {
  optimizedDescription: string;
  tags: string[];
  tagsCommaSeparated: string;
  hashtags: string[];
  category: string;
  searchIntentScore: number;
  seoStrategy: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
