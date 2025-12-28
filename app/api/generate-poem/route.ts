import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"
import { buildPersonalizationContext, type ContentMode } from "@/lib/personalization-prompts"
import { getOpenRouterApiKey, getOpenRouterModelId } from "@/lib/env"
import { cleanLLMText } from "@/lib/clean-llm-text"

export async function POST(request: Request) {
  try {
    const { verseReference, verseText, ageRange, gender, stageSituation, poemType, source, contentMode = "casual" } = await request.json()

    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const personalization = buildPersonalizationContext(ageRange, gender, stageSituation, contentMode as ContentMode)

    const isClassic = poemType === "classic"
    
    const styleGuide = contentMode === "academic"
      ? isClassic
        ? "Write a formally structured poem with attention to meter, rhyme scheme, and classical poetic devices. Draw on the tradition of religious poetry from Herbert, Hopkins, and LDS hymnody."
        : "Write a literary free verse poem with sophisticated imagery, allusion to scriptural typology, and theological depth. Reference the style of T.S. Eliot's religious poetry or contemporary religious verse."
      : isClassic
        ? "Write a HYMN-STYLE poem reminiscent of LDS hymns - with rhyme, meter, and traditional structure that could be sung."
        : "Write a FREE VERSE poem with vivid imagery and testimony-building themes, no strict rhyme required."

    const systemInstruction = contentMode === "academic"
      ? `You are a literary poet with expertise in religious verse and scriptural themes. Write poetry that combines literary sophistication with theological depth, drawing on both the LDS hymn tradition and broader religious poetry.

CRITICAL: Write ONLY plain text poetry. NO URLs, NO links, NO citations, NO bracketed text, NO markdown formatting, NO asterisks or underscores.

${personalization}`
      : `You are a gifted Latter-day Saint poet. Your poems reflect hope, faith, and testimony of the restored gospel with proper structure, line breaks, and stanzas. Reference gospel themes naturally - covenants, the Savior, temples, families, the Restoration.

CRITICAL: Write ONLY plain text poetry. NO URLs, NO links, NO citations, NO bracketed text, NO markdown formatting, NO asterisks or underscores.

${personalization}`

    const lineCount = contentMode === "academic" ? "16-24" : "8-16"

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      system: systemInstruction,
      prompt: `Generate 1 beautiful ${isClassic ? "HYMN-STYLE (Classic)" : "FREE VERSE"} poem inspired by ${verseReference}: "${verseText}"
${source ? `(From: ${source})` : ""}

${styleGuide}

Requirements: ${lineCount} lines, clear stanzas with blank lines between them, poetic devices, ${contentMode === "academic" ? "literary sophistication and theological depth" : "LDS testimony"}, appropriate for ${contentMode === "academic" ? "literary appreciation" : "Church setting"}.

Respond in this EXACT format:
TITLE===Your Poem Title===TITLE
POEM===
First line of poem
Second line of poem

Third line (new stanza)
Fourth line
===POEM
IMAGE===Visual description for artwork to accompany this poem===IMAGE`,
      maxTokens: contentMode === "academic" ? 1500 : 1000,
    })

    const titleMatch = text.match(/TITLE===(.+?)===TITLE/s)
    const poemMatch = text.match(/POEM===(.+?)===POEM/s)
    const imageMatch = text.match(/IMAGE===(.+?)===IMAGE/s)

    const poem = {
      title: cleanLLMText(titleMatch?.[1]?.trim() || "Untitled Poem"),
      type: isClassic ? "Hymn Style" : "Free Verse",
      text: poemMatch?.[1]?.trim() || text,
      imagePrompt: imageMatch?.[1]?.trim() || "Uplifting artistic representation of faith, hope, and spiritual peace",
    }

    return Response.json({ poem })
  } catch (error) {
    console.error("Poem generation error:", error)
    return Response.json({ error: "Failed to generate poem" }, { status: 500 })
  }
}
