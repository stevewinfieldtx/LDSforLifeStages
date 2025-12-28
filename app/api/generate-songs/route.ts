import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"
import { buildPersonalizationContext } from "@/lib/personalization-prompts"
import { getOpenRouterApiKey, getOpenRouterModelId } from "@/lib/env"
import { cleanLLMText } from "@/lib/clean-llm-text"

export async function POST(request: Request) {
  try {
    const { verseReference, verseText, ageRange, gender, stageSituation, language = "en", source } = await request.json()

    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const musicStyle = getMusicStyleForAge(ageRange)
    const personalization = buildPersonalizationContext(ageRange, gender, stageSituation)

    const languageInstruction =
      language !== "en"
        ? `\n\nIMPORTANT: Write the song lyrics in ${getLanguageName(language)}. Structure labels stay in English, but all lyrical content must be in ${getLanguageName(language)}.`
        : ""

    const systemInstruction = `You're a contemporary Latter-day Saint songwriter who writes songs that sound like modern LDS artists (The Piano Guys, David Archuleta, Gentri, Alex Boyé).

Write contemporary Christian/inspirational music that reflects LDS values - hope, faith, families, covenants, the Savior - but not preachy. Appropriate for EFY, youth conferences, mission farewells, or firesides. Use modern, natural language (no thee/thou). Emotionally authentic and testimony-building.

CRITICAL: Write ONLY plain text. NO URLs, NO links, NO citations, NO bracketed text except song structure markers like [Verse 1], [Chorus]. NO markdown formatting.

${musicStyle}${personalization}${languageInstruction}`

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      system: systemInstruction,
      prompt: `Write an uplifting contemporary song inspired by ${verseReference}: "${verseText}"
${source ? `(From: ${source})` : ""}

Create a song with verse-chorus structure, modern pop/inspirational style, contemporary language, emotional build, and memorable chorus.

Use this format:

TITLE===
[Song title]
===TITLE

SUBTITLE===
[Genre/style]
===SUBTITLE

LYRICS===
[Full song with [Verse 1], [Chorus], etc.]
===LYRICS

AUDIO_PROMPT===
[Suno AI prompt for musical style]
===AUDIO_PROMPT

IMAGE_PROMPT===
[Album art description]
===IMAGE_PROMPT`,
      maxTokens: 3000,
    })

    const titleMatch = text.match(/TITLE===\s*([\s\S]*?)\s*===TITLE/)
    const subtitleMatch = text.match(/SUBTITLE===\s*([\s\S]*?)\s*===SUBTITLE/)
    const lyricsMatch = text.match(/LYRICS===\s*([\s\S]*?)\s*===LYRICS/)
    const audioPromptMatch = text.match(/AUDIO_PROMPT===\s*([\s\S]*?)\s*===AUDIO_PROMPT/)
    const imagePromptMatch = text.match(/IMAGE_PROMPT===\s*([\s\S]*?)\s*===IMAGE_PROMPT/)

    if (!titleMatch || !lyricsMatch) {
      throw new Error("Failed to parse song response")
    }

    const songs = {
      title: cleanLLMText(titleMatch[1].trim()),
      sub: cleanLLMText(subtitleMatch ? subtitleMatch[1].trim() : "Inspirational Pop"),
      lyrics: lyricsMatch[1].trim(), // Don't over-clean lyrics - preserve structure
      prompt: audioPromptMatch ? audioPromptMatch[1].trim() : "uplifting inspirational pop song",
      imagePrompt: imagePromptMatch ? imagePromptMatch[1].trim() : "uplifting album art, light rays, hope",
    }

    return Response.json({ songs })
  } catch (error) {
    console.error("Songs generation error:", error)
    return Response.json({ error: "Failed to generate songs" }, { status: 500 })
  }
}

function getMusicStyleForAge(ageRange: string): string {
  const styles: Record<string, string> = {
    teens: "Style: High-energy inspirational pop like EFY music, upbeat (120+ BPM), catchy hooks.",
    youth: "Style: Contemporary pop with emotional depth, David Archuleta vibes (100-115 BPM).",
    adult: "Style: Polished inspirational pop-rock, The Piano Guys aesthetic (100-120 BPM).",
    senior: "Style: Warm, reverent pop with rich harmonies, piano-forward (70-90 BPM).",
  }
  return styles[ageRange] || "Style: Modern inspirational pop - emotionally resonant, testimony-building."
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "English", es: "Spanish", fr: "French", de: "German", pt: "Portuguese",
    zh: "Chinese", vi: "Vietnamese", ko: "Korean", th: "Thai", tl: "Tagalog", ja: "Japanese",
  }
  return languages[code] || "English"
}
