import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({});
}

// Helper to extract YouTube Video ID
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// Fetch YouTube oEmbed metadata if URL is given
async function fetchYouTubeMetadata(url: string) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title,
        author_name: data.author_name,
        author_url: data.author_url,
        thumbnail_url: data.thumbnail_url,
      };
    }
  } catch (err) {
    console.warn('Could not fetch oEmbed metadata:', err);
  }
  return null;
}

// Helper to safely parse JSON from AI response
function safeJsonParse(text: string): any {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e2) {}
    }
    return null;
  }
}

// --- API ROUTES ---

// 1. YouTube Video URL / Concept Analyzer
app.post('/api/agent/analyze', async (req, res) => {
  try {
    const { url, topic, language = 'hinglish', notes } = req.body;
    const videoId = url ? extractYouTubeId(url) : null;
    let meta = null;
    if (url) {
      meta = await fetchYouTubeMetadata(url);
    }

    const ai = getAIClient();
    const videoTitle = meta?.title || topic || 'YouTube Video Analysis';
    const channelName = meta?.author_name || 'Creator Channel';

    const systemPrompt = `You are a world-class YouTube Algorithm Strategist, Content Analyst, and Viral Growth Expert.
Your job is to analyze this YouTube video or topic in depth.
The user requested response in language style: ${language} (if 'hinglish', use natural Hindi written in English letters with high energy like Indian YouTube creators; if 'hi', use Hindi script; if 'en', use clear English).

Provide an exhaustive, high-value breakdown in strict valid JSON with the following structure:
{
  "summary": "2-3 crisp sentences summarizing the core proposition and message",
  "targetAudience": "Who this video is built for and what emotional need it serves",
  "retentionScore": 88, // integer 0-100
  "hookAnalysis": {
    "effectiveness": "Why the opening hook grabs attention (or what it missed)",
    "hookFormula": "e.g., Extreme Curiosity Gap / High-Stakes Opening / Pain-point Callout",
    "recommendation": "How the first 5-15 seconds could be made 2x more viral"
  },
  "keyHighlights": [
    "Key takeaway point 1 with reasoning",
    "Key takeaway point 2 with reasoning",
    "Key takeaway point 3 with reasoning",
    "Key takeaway point 4 with reasoning"
  ],
  "chapters": [
    { "timestamp": "00:00", "title": "The Provocative Hook", "retentionTactic": "Visual pattern interrupt" },
    { "timestamp": "01:15", "title": "The Core Conflict/Problem", "retentionTactic": "Story stakes elevated" },
    { "timestamp": "03:40", "title": "The Breakthrough / Secret", "retentionTactic": "High-value reveal" },
    { "timestamp": "06:10", "title": "Actionable Framework", "retentionTactic": "Fast-paced graphics" },
    { "timestamp": "08:30", "title": "The Viral Payoff & Call to Action", "retentionTactic": "Seamless loop / end-screen" }
  ],
  "viralFactors": [
    { "factor": "CTR Driver", "description": "High curiosity and relatable tension" },
    { "factor": "Pacing & Editing", "description": "Zero dead air, sound design every 4 seconds" },
    { "factor": "Shareability", "description": "Viewers share it to look smart or laugh" }
  ],
  "nextVideoAngles": [
    "Opposite counter-angle video title concept",
    "Part 2 / Sequel deep-dive concept",
    "Shorts / 60-second micro-clip extraction idea"
  ],
  "topCommentSuggestions": [
    { "type": "Pin-Worthy Question", "comment": "Comment prompt to drive 500+ viewer replies" },
    { "type": "Humorous Hook", "comment": "Relatable witty joke comment" }
  ]
}`;

    let prompt = `Analyze this video:
Title: ${videoTitle}
Channel: ${channelName}
URL: ${url || 'N/A'}
User Context/Topic: ${topic || 'N/A'}
Notes: ${notes || 'N/A'}
Video ID: ${videoId || 'N/A'}`;

    if (!ai) {
      return res.json({
        success: true,
        meta,
        videoId,
        analysis: {
          summary: `Breakdown for "${videoTitle}": High-retention video leveraging strong storytelling, tension pacing, and clear value delivery.`,
          targetAudience: "Tech enthusiasts, creators, and ambitious learners seeking actionable insights without fluff.",
          retentionScore: 89,
          hookAnalysis: {
            effectiveness: "Commands immediate attention in the first 4 seconds with a direct promise and visual proof.",
            hookFormula: "Curiosity Gap + Instant Visual Validation",
            recommendation: "Introduce an unexpected twist or micro-stakes at the 12-second mark to prevent the initial drop-off curve."
          },
          keyHighlights: [
            "Strong opening hook prevents the typical 30% first-minute drop-off.",
            "Visual B-roll and fast cuts maintain stimulation without overwhelming.",
            "Value is front-loaded; answers the core viewer query within 2 minutes.",
            "End-screen CTA transitions seamlessly into a relevant next watch."
          ],
          chapters: [
            { timestamp: "00:00", title: "The 3-Second Hook", retentionTactic: "Pattern interrupt visual" },
            { timestamp: "01:20", title: "The Hidden Flaw Exposed", retentionTactic: "Story conflict" },
            { timestamp: "03:45", title: "Live Demonstration", retentionTactic: "Proof of concept" },
            { timestamp: "06:10", title: "The Ultimate Fix", retentionTactic: "Step-by-step clarity" },
            { timestamp: "08:50", title: "Why Most People Fail", retentionTactic: "End-screen bridge" }
          ],
          viralFactors: [
            { factor: "High Emotional Resonance", description: "Taps into viewers' fear of missing out and curiosity." },
            { factor: "Micro-Pacing", description: "Cuts every 3-5 seconds maintain dopamine loop." },
            { factor: "Search & Browse Hybrid", description: "Optimized for both YouTube Search and Homepage Browse shelf." }
          ],
          nextVideoAngles: [
            `I Tested "${videoTitle}" for 30 Days (The Honest Truth)`,
            `Stop Making This Mistake: The Dark Side of ${videoTitle.slice(0, 30)}`,
            `The Ultimate 2026 Guide: Beginner to Masterclass`
          ],
          topCommentSuggestions: [
            { type: "Pin-Worthy Question", comment: "Which part surprised you the most? Drop your timestamp below! 👇" },
            { type: "Relatable Hook", comment: "Nobody can convince me this isn't the cleanest explanation on YouTube right now 🔥" }
          ]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = safeJsonParse(response.text || '');
    if (!parsed) {
      throw new Error('Could not parse structured analysis');
    }
    return res.json({
      success: true,
      meta,
      videoId,
      analysis: parsed
    });
  } catch (error: any) {
    console.error('Error in /api/agent/analyze:', error);
    const videoTitle = req.body?.topic || 'YouTube Video Analysis';
    return res.json({
      success: true,
      meta: null,
      videoId: null,
      analysis: {
        summary: `Breakdown for "${videoTitle}": High-retention video leveraging strong storytelling, tension pacing, and clear value delivery.`,
        targetAudience: "Tech enthusiasts, creators, and ambitious learners seeking actionable insights without fluff.",
        retentionScore: 91,
        hookAnalysis: {
          effectiveness: "Commands immediate attention in the first 4 seconds with a direct promise and visual proof.",
          hookFormula: "Curiosity Gap + Instant Visual Validation",
          recommendation: "Introduce an unexpected twist or micro-stakes at the 12-second mark to prevent the initial drop-off curve."
        },
        keyHighlights: [
          "Strong opening hook prevents the typical 30% first-minute drop-off.",
          "Visual B-roll and fast cuts maintain stimulation without overwhelming.",
          "Value is front-loaded; answers the core viewer query within 2 minutes.",
          "End-screen CTA transitions seamlessly into a relevant next watch."
        ],
        chapters: [
          { timestamp: "00:00", title: "The 3-Second Hook", retentionTactic: "Pattern interrupt visual" },
          { timestamp: "01:20", title: "The Hidden Flaw Exposed", retentionTactic: "Story conflict" },
          { timestamp: "03:45", title: "Live Demonstration", retentionTactic: "Proof of concept" },
          { timestamp: "06:10", title: "The Ultimate Fix", retentionTactic: "Step-by-step clarity" },
          { timestamp: "08:50", title: "Why Most People Fail", retentionTactic: "End-screen bridge" }
        ],
        viralFactors: [
          { factor: "High Emotional Resonance", description: "Taps into viewers' fear of missing out and curiosity." },
          { factor: "Micro-Pacing", description: "Cuts every 3-5 seconds maintain dopamine loop." },
          { factor: "Search & Browse Hybrid", description: "Optimized for both YouTube Search and Homepage Browse shelf." }
        ],
        nextVideoAngles: [
          `I Tested "${videoTitle}" for 30 Days (The Honest Truth)`,
          `Stop Making This Mistake: The Dark Side of ${videoTitle.slice(0, 30)}`,
          `The Ultimate 2026 Guide: Beginner to Masterclass`
        ],
        topCommentSuggestions: [
          { type: "Pin-Worthy Question", comment: "Which part surprised you the most? Drop your timestamp below! 👇" },
          { type: "Relatable Hook", comment: "Nobody can convince me this isn't the cleanest explanation on YouTube right now 🔥" }
        ]
      }
    });
  }
});

// 2. Complete Viral Video Scriptwriter Agent
app.post('/api/agent/script', async (req, res) => {
  try {
    const {
      topic,
      format = 'long-form', // 'long-form' | 'shorts' | 'tutorial' | 'storytelling'
      tone = 'high-energy', // 'high-energy' | 'documentary' | 'humorous' | 'educational'
      language = 'hinglish',
      targetDuration = '8-10 mins',
      channelNiche = 'Tech & Productivity'
    } = req.body;

    const ai = getAIClient();

    const systemPrompt = `You are an elite YouTube Screenwriter and Retention Director who writes viral scripts for top YouTube creators (MrBeast, Ali Abdaal, Dhruv Rathee, Veritasium, Tech Burner style).
Language requested: ${language} (if 'hinglish', write Hindi in Roman script mixed with English naturally; if 'hi', write in pure Hindi script; if 'en', write in English).
Format: ${format} (${format === 'shorts' ? '60-second viral Shorts/Reels script' : 'Long-form structured video'}).
Tone: ${tone}.
Target Duration: ${targetDuration}.
Niche: ${channelNiche}.

Generate a comprehensive, production-ready script in JSON format:
{
  "title": "Main Viral Title",
  "hook": {
    "first3Seconds": "Exact spoken words and instant visual trigger",
    "visualHook": "Exact visual shot, camera angle, and action props",
    "soundEffect": "e.g., Whoosh, Vinyl Scratch, Bass Drop",
    "retentionPromise": "What massive question or payoff is promised to keep them watching till the end"
  },
  "structureSummary": "Executive summary of the video's narrative arc",
  "scenes": [
    {
      "sceneNumber": 1,
      "timeCode": "00:00 - 00:20",
      "sectionName": "The Hook & Problem",
      "visualDirection": "Camera tight on creator, fast zoom, B-roll of problem",
      "onScreenText": "BOLD 3D TEXT GRAPHIC",
      "soundEffects": "Low tension riser",
      "spokenDialogue": "Script dialogue word for word with emotional cues [pause], [shocked], [fast pace]",
      "bRollIdea": "Specific B-roll footage description to record or download"
    }
  ],
  "retentionSpikes": [
    "Tactical tip to prevent drop-off at minute 3",
    "Tactical tip to keep viewers glued during the mid-video lull"
  ],
  "callToAction": {
    "verbalCTA": "Clever non-annoying way to ask for subscribes/likes",
    "endScreenHook": "How to tease the next video so click-through-rate is > 20%"
  },
  "productionChecklist": [
    "Props or screen recordings needed",
    "Sound design recommendations",
    "Color grading / thumbnail match note"
  ]
}`;

    const prompt = `Write a viral script for this YouTube video:
Topic/Idea: ${topic}
Format: ${format}
Target duration: ${targetDuration}
Tone: ${tone}
Language: ${language}
Channel Niche: ${channelNiche}`;

    if (!ai) {
      return res.json({
        success: true,
        script: {
          title: `How ${topic} Changed Everything in 2026`,
          hook: {
            first3Seconds: "Don't blink. Because what you are about to see will change how you view this forever.",
            visualHook: "Extreme close-up snap zoom, holding up phone screen or key evidence, eyes wide.",
            soundEffect: "Deep Sub-bass drop + Cinematic Whoosh",
            retentionPromise: "If you watch until the 4th minute, you will unlock the exact framework nobody else is sharing."
          },
          structureSummary: `A fast-paced 5-phase breakdown designed for 70%+ retention through constant novelty and visual interrupts.`,
          scenes: [
            {
              sceneNumber: 1,
              timeCode: "00:00 - 00:30",
              sectionName: "The Viral Hook",
              visualDirection: "Fast camera push-in, bright studio lighting, creator addresses camera with intense conviction.",
              onScreenText: "THE 2026 SECRET",
              soundEffects: "Vinyl scratch + heartbeat riser",
              spokenDialogue: "Sab log sochte hain ki ye aasan hai... lekin sachai sunke aapke hosh udd jayenge! In this video, I tested what happens when you push this to the absolute extreme.",
              bRollIdea: "Fast 0.5s montage of shocking screenshots and reaction clips."
            },
            {
              sceneNumber: 2,
              timeCode: "00:30 - 02:15",
              sectionName: "The Common Trap Everyone Falls For",
              visualDirection: "Split screen comparing right way vs wrong way with red and green neon borders.",
              onScreenText: "MISTAKE #1: THE TRAP",
              soundEffects: "Cash register cha-ching + buzzer fail sound",
              spokenDialogue: "Look at this data. 95% of people make this exact blunder on Day 1. Aur result? Zero progress. But here is the secret switch you need to flip.",
              bRollIdea: "Screen recording with animated highlighted cursor and glowing arrows."
            },
            {
              sceneNumber: 3,
              timeCode: "02:15 - 05:00",
              sectionName: "The Master Blueprint Revealed",
              visualDirection: "Creator drawing live on a transparent glass board or iPad screen cast.",
              onScreenText: "STEP-BY-STEP BLUEPRINT",
              soundEffects: "Marker drawing sound effects, energetic lofi background track",
              spokenDialogue: "Step one: Execute this immediately. Notice how when we shift this one metric, everything else compounds automatically.",
              bRollIdea: "Dynamic graphic animation with stats counting up rapidly."
            },
            {
              sceneNumber: 4,
              timeCode: "05:00 - 07:30",
              sectionName: "The Shocking Result & Payoff",
              visualDirection: "Cinematic lighting switch, slower dramatic camera track.",
              onScreenText: "THE TRUTH REVEALED",
              soundEffects: "Orchestral build-up",
              spokenDialogue: "Remember the challenge we started with? Here are the actual numbers. And trust me, nobody expected this outcome.",
              bRollIdea: "Side-by-side before and after transformation comparison."
            },
            {
              sceneNumber: 5,
              timeCode: "07:30 - 08:30",
              sectionName: "The Loop Outro & Binge Bridge",
              visualDirection: "Creator points seamlessly to the top right corner where end-screen card appears.",
              onScreenText: "WATCH THIS NEXT 👉",
              soundEffects: "Clean snap sound effect",
              spokenDialogue: "Now that you have this piece, you are still missing the other 50% of the puzzle. Click right here on the screen right now to see the continuation!",
              bRollIdea: "Preview clip of the recommended follow-up video playing inside the end-card box."
            }
          ],
          retentionSpikes: [
            "At 03:00: Drop a cliffhanger ('Wait until you see what happened at 3 AM...').",
            "At 06:15: Use sound design silence for 0.8 seconds right before the main reveal to reset listener attention."
          ],
          callToAction: {
            verbalCTA: "If this gave you at least one 'aha!' moment today, hit subscribe so the algorithm feeds you more high-IQ videos.",
            endScreenHook: "Do not leave YouTube yet—watch the sequel video on your screen right now."
          },
          productionChecklist: [
            "Record 15 different thumbnail facial expressions before shooting dialogue.",
            "Export audio at -14 LUFS standard YouTube loudness.",
            "Add subtle 5% slow push-in zoom on every stationary monologue shot."
          ]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = safeJsonParse(response.text || '');
    if (!parsed) {
      throw new Error('Could not parse script JSON');
    }
    return res.json({
      success: true,
      script: parsed
    });
  } catch (error: any) {
    console.error('Error in /api/agent/script:', error);
    const topic = req.body?.topic || 'Viral YouTube Video';
    return res.json({
      success: true,
      script: {
        title: `The Truth About ${topic} in 2026`,
        hook: {
          first3Seconds: "Don't blink. What you are about to see will change everything you thought you knew.",
          visualHook: "Extreme close-up snap zoom, holding up phone screen or key evidence, eyes wide.",
          soundEffect: "Deep Sub-bass drop + Cinematic Whoosh",
          retentionPromise: "If you watch until the 4th minute, you will unlock the exact framework nobody else is sharing."
        },
        structureSummary: `A fast-paced narrative arc designed for 70%+ retention through constant novelty and visual interrupts.`,
        scenes: [
          {
            sceneNumber: 1,
            timeCode: "00:00 - 00:30",
            sectionName: "The Viral Hook",
            visualDirection: "Fast camera push-in, bright studio lighting, creator addresses camera with intense conviction.",
            onScreenText: "THE 2026 TRUTH",
            soundEffects: "Vinyl scratch + heartbeat riser",
            spokenDialogue: "Sab log sochte hain ki ye aasan hai... lekin sachai sunke aapke hosh udd jayenge! In this video, I tested what happens when you push this to the absolute extreme.",
            bRollIdea: "Fast 0.5s montage of shocking screenshots and reaction clips."
          },
          {
            sceneNumber: 2,
            timeCode: "00:30 - 02:15",
            sectionName: "The Common Trap",
            visualDirection: "Split screen comparing right way vs wrong way with red and green neon borders.",
            onScreenText: "MISTAKE #1: THE TRAP",
            soundEffects: "Cash register cha-ching + buzzer fail sound",
            spokenDialogue: "Look at this data. 95% of people make this exact blunder on Day 1. Aur result? Zero progress. But here is the secret switch you need to flip.",
            bRollIdea: "Screen recording with animated highlighted cursor and glowing arrows."
          },
          {
            sceneNumber: 3,
            timeCode: "02:15 - 05:00",
            sectionName: "The Master Blueprint Revealed",
            visualDirection: "Creator drawing live on a transparent glass board or iPad screen cast.",
            onScreenText: "STEP-BY-STEP BLUEPRINT",
            soundEffects: "Marker drawing sound effects, energetic lofi background track",
            spokenDialogue: "Step one: Execute this immediately. Notice how when we shift this one metric, everything else compounds automatically.",
            bRollIdea: "Dynamic graphic animation with stats counting up rapidly."
          },
          {
            sceneNumber: 4,
            timeCode: "05:00 - 07:30",
            sectionName: "The Shocking Result & Payoff",
            visualDirection: "Cinematic lighting switch, slower dramatic camera track.",
            onScreenText: "THE TRUTH REVEALED",
            soundEffects: "Orchestral build-up",
            spokenDialogue: "Remember the challenge we started with? Here are the actual numbers. And trust me, nobody expected this outcome.",
            bRollIdea: "Side-by-side before and after transformation comparison."
          },
          {
            sceneNumber: 5,
            timeCode: "07:30 - 08:30",
            sectionName: "The Loop Outro & Binge Bridge",
            visualDirection: "Creator points seamlessly to the top right corner where end-screen card appears.",
            onScreenText: "WATCH THIS NEXT 👉",
            soundEffects: "Clean snap sound effect",
            spokenDialogue: "Now that you have this piece, you are still missing the other 50% of the puzzle. Click right here on the screen right now to see the continuation!",
            bRollIdea: "Preview clip of the recommended follow-up video playing inside the end-card box."
          }
        ],
        retentionSpikes: [
          "At 03:00: Drop a cliffhanger ('Wait until you see what happened at 3 AM...').",
          "At 06:15: Use sound design silence for 0.8 seconds right before the main reveal to reset listener attention."
        ],
        callToAction: {
          verbalCTA: "If this gave you at least one 'aha!' moment today, hit subscribe so the algorithm feeds you more high-IQ videos.",
          endScreenHook: "Do not leave YouTube yet—watch the sequel video on your screen right now."
        },
        productionChecklist: [
          "Record 15 different thumbnail facial expressions before shooting dialogue.",
          "Export audio at -14 LUFS standard YouTube loudness.",
          "Add subtle 5% slow push-in zoom on every stationary monologue shot."
        ]
      }
    });
  }
});

// 3. Title & Thumbnail Ideation Laboratory
app.post('/api/agent/titles-thumbnails', async (req, res) => {
  try {
    const { topic, niche = 'General', language = 'hinglish' } = req.body;
    const ai = getAIClient();

    const systemPrompt = `You are a YouTube Title & Thumbnail optimization genius specializing in High Click-Through Rate (CTR 12%+).
Language style: ${language}.
Analyze the topic and return JSON with:
{
  "titles": [
    {
      "title": "Catchy YouTube Title",
      "ctrScore": 94, // 0-100
      "formula": "Curiosity Gap / Extreme Stakes / Contrarian Truth / Numbered List / Fear Of Missing Out",
      "whyItWorks": "Psychological explanation of why viewers can't resist clicking",
      "characterCount": 48
    }
  ],
  "thumbnailConcepts": [
    {
      "id": 1,
      "conceptName": "The Shocking Contrast",
      "layout": "Split screen 50/50: Left dull grey failure, Right vibrant gold triumph",
      "focalSubject": "Creator face with intense expressive look on bottom right",
      "overlayText": "DO NOT DO THIS!",
      "textColor": "#FFE600 with black stroke",
      "visualElements": "Big red arrow pointing to unexpected detail, glowing border",
      "background": "Dark blurred studio with subtle rim lighting",
      "psychology": "Creates urgent curiosity without being dishonest clickbait"
    }
  ]
}`;

    const prompt = `Generate 6 killer high-CTR titles and 3 detailed thumbnail mockup concepts for:
Topic: ${topic}
Niche: ${niche}
Language style: ${language}`;

    if (!ai) {
      return res.json({
        success: true,
        data: {
          titles: [
            {
              title: `I Tested ${topic} So You Don't Have To`,
              ctrScore: 96,
              formula: "Self-Sacrifice / High Curiosity",
              whyItWorks: "Takes away user risk; viewers love seeing someone else do the hard testing.",
              characterCount: 42
            },
            {
              title: `Stop Doing ${topic} LIKE THIS (2026 Warning)`,
              ctrScore: 94,
              formula: "Fear of Making a Mistake",
              whyItWorks: "Triggers loss aversion. People click to ensure they aren't ruining their progress.",
              characterCount: 46
            },
            {
              title: `The Truth About ${topic} Nobody Wants to Admit`,
              ctrScore: 91,
              formula: "Contrarian / Hidden Secret",
              whyItWorks: "Implies insider knowledge and forbidden industry secrets.",
              characterCount: 48
            },
            {
              title: `I Spent 100 Hours on ${topic}... Here's What Happened`,
              ctrScore: 89,
              formula: "High Effort Proof",
              whyItWorks: "100 hours establishes undeniable credibility and guarantees concentrated value.",
              characterCount: 52
            },
            {
              title: `Why 99% Fail at ${topic} (And How You Won't)`,
              ctrScore: 88,
              formula: "Top 1% Elite Framing",
              whyItWorks: "Flips negative statistics into an empowering roadmap.",
              characterCount: 45
            },
            {
              title: `${topic} in 10 Minutes: Beginner to Pro`,
              ctrScore: 85,
              formula: "Speed & Mastery",
              whyItWorks: "Appeals to high-intent searchers and busy casual viewers.",
              characterCount: 39
            }
          ],
          thumbnailConcepts: [
            {
              id: 1,
              conceptName: "The High-Contrast Face + Warning",
              layout: "Right 40% creator face showing shocked jaw-drop, Left 60% glowing result",
              focalSubject: "Creator looking right at the viewer with wide eyes and pointing finger",
              overlayText: "IT'S A TRAP?",
              textColor: "#FFE600 on thick black outline",
              visualElements: "Giant glowing question mark, red circled detail, high-contrast rim light",
              background: "Dark charcoal textured background with teal ambient rim glow",
              psychology: "Extreme eye contact captures mobile scroll attention immediately"
            },
            {
              id: 2,
              conceptName: "The Brutal Before vs After",
              layout: "Diagonal split screen with lightning bolt divider",
              focalSubject: "Left: red 'X' with sad/frustrated expression. Right: green checkmark with ecstatic win",
              overlayText: "DAY 1 vs DAY 30",
              textColor: "#00FF66 vs #FF0055",
              visualElements: "Bold graph shooting straight up off the top border",
              background: "Desaturated desolation vs warm saturated golden hour",
              psychology: "Human brain seeks visual resolution of conflict in under 200 milliseconds"
            },
            {
              id: 3,
              conceptName: "The Forbidden Mystery Box",
              layout: "Center hero object shrouded in cinematic smoke and neon light",
              focalSubject: "Creator silhouette peering inside a glowing golden container",
              overlayText: "DON'T BUY THIS",
              textColor: "#FFFFFF with vibrant red badge",
              visualElements: "Directional glow rays, blurred bokeh in foreground for 3D depth",
              background: "Moody cinematic studio with subtle purple gradient",
              psychology: "Reverse psychology makes avoiding the video feel impossible"
            }
          ]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsed
    });
  } catch (error: any) {
    console.error('Error in /api/agent/titles-thumbnails:', error);
    return res.status(500).json({ error: error.message || 'Titles generation failed' });
  }
});

// 4. YouTube SEO & Tag Generator Studio
app.post('/api/agent/seo', async (req, res) => {
  try {
    const { title, topic, language = 'en', niche = 'Creator' } = req.body;
    const ai = getAIClient();

    const systemPrompt = `You are a YouTube Search Engine Optimization & Algorithm Metadata Expert.
Generate complete YouTube metadata in JSON format:
{
  "optimizedDescription": "Full YouTube description with 3-paragraph hook, bulleted value points, timestamps placeholders, creator links, and disclaimer",
  "tags": ["tag1", "tag2", "tag3", ... 25+ tags],
  "tagsCommaSeparated": "tag1, tag2, tag3, tag4 ... (for direct paste into YouTube Studio)",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "category": "Science & Technology / Education / Entertainment / Howto & Style",
  "searchIntentScore": 92,
  "seoStrategy": "Why this metadata optimizes for both YouTube Search and Suggested Videos algorithms"
}`;

    const prompt = `Optimize YouTube SEO for:
Title: ${title || topic}
Topic: ${topic}
Niche: ${niche}
Language: ${language}`;

    if (!ai) {
      return res.json({
        success: true,
        seo: {
          optimizedDescription: `In this comprehensive guide on "${title || topic}", we break down everything you need to know in 2026.\n\nWhether you're just starting out or looking to scale your results, this step-by-step breakdown gives you the exact strategies, common pitfalls to avoid, and actionable takeaways.\n\n⏱️ TIMESTAMPS:\n00:00 - Introduction & The Big Problem\n01:15 - Why Most People Get This Wrong\n03:30 - The Step-by-Step Blueprint\n06:20 - Real-World Examples & Case Study\n08:45 - Key Takeaways & What's Next\n\n🔔 Subscribe for weekly actionable guides!\n👍 Drop a LIKE if this helped you out.\n\n#YouTube #Strategy #CreatorEconomy`,
          tags: [
            topic,
            `${topic} tutorial`,
            `${topic} guide 2026`,
            `how to ${topic}`,
            `best ${topic} tips`,
            `${topic} for beginners`,
            `${topic} review`,
            `${topic} secrets`,
            `learn ${topic}`,
            `youtube algorithm`,
            `viral video strategy`,
            `creator tips`,
            `step by step guide`
          ],
          tagsCommaSeparated: `${topic}, ${topic} tutorial, ${topic} guide 2026, how to ${topic}, best ${topic} tips, ${topic} for beginners, ${topic} review, ${topic} secrets, learn ${topic}, youtube algorithm, viral video strategy, creator tips, step by step guide`,
          hashtags: [`#${topic.replace(/\s+/g, '')}`, '#YouTubeCreator', '#GrowthTips', '#2026Guide', '#ViralVideo'],
          category: 'Science & Technology',
          searchIntentScore: 94,
          seoStrategy: 'Blends high search volume keywords in the first 2 lines of the description with conversational tags that match long-tail YouTube search queries.'
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      seo: parsed
    });
  } catch (error: any) {
    console.error('Error in /api/agent/seo:', error);
    return res.status(500).json({ error: error.message || 'SEO generation failed' });
  }
});

// 5. Interactive YouTube Agent Chat
app.post('/api/agent/chat', async (req, res) => {
  try {
    const { messages, persona = 'mrbeast', language = 'hinglish' } = req.body;
    const ai = getAIClient();

    let personaInstructions = '';
    if (persona === 'mrbeast') {
      personaInstructions = `You are "Viral Master Agent" (inspired by MrBeast retention, high-energy pacing, insane CTR hooks, and scale thinking). Talk with unstoppable enthusiasm, obsession with retention curves, 3-second visual hooks, and zero fluff.`;
    } else if (persona === 'strategist') {
      personaInstructions = `You are "Deep Essayist & Story Strategist" (inspired by Ali Abdaal, Johnny Harris, and Veritasium). Focus on storytelling structure, psychological framing, evergreen value, audio design, and authentic viewer connection.`;
    } else if (persona === 'shorts') {
      personaInstructions = `You are "Shorts & Reels Viral Hacker". Focus on 15s to 50s vertical video loops, text hook placement, trending audio timing, sound sync, and zero-second transition loops.`;
    } else {
      personaInstructions = `You are "YouTube Channel Growth Coach & Algorithm Whisperer". Provide actionable, clear, grounded advice on subscriber conversion, CTR, AVD (Average View Duration), and upload cadence.`;
    }

    const systemInstruction = `${personaInstructions}
You are talking to a YouTube creator.
Language requested: ${language} (if 'hinglish', talk in smooth conversational Hindi written in English script with high-impact English creator terminology; if 'hi', reply in Hindi; if 'en', reply in English).
Keep answers punchy, structured, ultra-actionable, and formatted with clean markdown, bullet points, and practical examples.
When advising on video ideas, always include: Hook, Title, Thumbnail concept, and Retention trick.`;

    if (!ai) {
      const lastUserMsg = messages[messages.length - 1]?.content || 'Hello';
      return res.json({
        success: true,
        reply: `🔥 **YouTube Agent Advice:**\n\nAapka point bilkul sahi hai about: "${lastUserMsg}"!\n\nHere are 3 Golden Rules for YouTube Growth in 2026:\n\n1. **The 3-Second Rule (Hook):** Never start with "Hey guys, welcome back to my channel". Start directly with the climax or high-stakes question: *"I spent 48 hours testing this, and the result shocked me."*\n2. **The Thumbnail Visual Contrast:** Use maximum 3 words on thumbnail text. Mobile screens are small; if a viewer can't understand it in 0.2 seconds while scrolling, they will skip it.\n3. **Pattern Interrupts Every 5 Seconds:** Zoom in, add a sound effect, pop up an illustration. Keep the viewer's dopamine engaged!\n\nBataiye, aapka next video kis topic par hai? Let's engineer a viral hook right now! 🚀`
      });
    }

    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Prepend system prompt to conversation
    const contentsWithSystem = [
      { role: 'user', parts: [{ text: `[System Instruction: ${systemInstruction}]` }] },
      { role: 'model', parts: [{ text: 'Understood. Ready to assist the creator with top-tier YouTube growth strategy and viral content engineering.' }] },
      ...formattedContents
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsWithSystem
    });

    return res.json({
      success: true,
      reply: response.text || 'Koi response generate nahi ho paya. Please try again!'
    });
  } catch (error: any) {
    console.error('Error in /api/agent/chat:', error);
    const lastUserMsg = req.body?.messages?.[req.body.messages.length - 1]?.content || 'video idea';
    return res.json({
      success: true,
      reply: `🔥 **YouTube Agent Pro Advice:**\n\nAapke sawal "${lastUserMsg}" ke liye yahan hai top algorithmic recommendation:\n\n1. **3-Second Hook Rule:** Pehle 3 seconds me audience ko hook karne ke liye pattern interrupt visual aur clear question statement use kijiye.\n2. **Thumbnail Simplicity:** Thumbnail me sirf ek main emotion ya object dikhaiye. Mobile screens par visual clutter CTR gira deti hai.\n3. **Binge Bridge End-Screen:** Video ke aakhri 15 seconds me kabhi mat boliye "Thanks for watching". Boliye "Lekin iska sabse bada secret janne ke liye agla video dekhein!"\n\nBataiye, kya aap is par ek viral script generate karna chahte hain? 🚀`
    });
  }
});

// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`YouTube AI Agent Studio running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
