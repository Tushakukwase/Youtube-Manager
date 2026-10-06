import { VideoAnalysis, VideoScript, TitleIdea, ThumbnailConcept, SeoData, VideoMetadata } from '../types';

export async function analyzeVideo(params: {
  url?: string;
  topic?: string;
  language?: string;
  notes?: string;
}): Promise<{
  analysis: VideoAnalysis;
  meta: VideoMetadata | null;
  videoId: string | null;
}> {
  const res = await fetch('/api/agent/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze video');
  }
  return res.json();
}

export async function generateScript(params: {
  topic: string;
  format?: string;
  tone?: string;
  language?: string;
  targetDuration?: string;
  channelNiche?: string;
}): Promise<{ script: VideoScript }> {
  const res = await fetch('/api/agent/script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate script');
  }
  return res.json();
}

export async function generateTitlesAndThumbnails(params: {
  topic: string;
  niche?: string;
  language?: string;
}): Promise<{
  data: {
    titles: TitleIdea[];
    thumbnailConcepts: ThumbnailConcept[];
  };
}> {
  const res = await fetch('/api/agent/titles-thumbnails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate titles & thumbnails');
  }
  return res.json();
}

export async function generateSeo(params: {
  title?: string;
  topic: string;
  language?: string;
  niche?: string;
}): Promise<{ seo: SeoData }> {
  const res = await fetch('/api/agent/seo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate SEO data');
  }
  return res.json();
}

export async function sendChatMessage(params: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  persona?: string;
  language?: string;
}): Promise<{ reply: string }> {
  const res = await fetch('/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to communicate with agent');
  }
  return res.json();
}
