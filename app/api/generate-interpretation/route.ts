import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"
import { buildPersonalizationContext, type ContentMode } from "@/lib/personalization-prompts"
import { getOpenRouterApiKey, getOpenRouterModelId } from "@/lib/env"
import { cleanLLMText } from "@/lib/clean-llm-text"

export async function POST(request: Request) {
  try {
    const { verseReference, verseText, ageRange, gender, stageSituation, language = "en", source, contentMode = "casual" } = await request.json()

    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const personalizationContext = buildPersonalizationContext(ageRange, gender, stageSituation, contentMode as ContentMode)

    const languageName = getLanguageName(language)
    const languageInstruction =
      language !== "en"
        ? `CRITICAL LANGUAGE REQUIREMENT: You MUST write your entire interpretation in ${languageName}. Every single word of the interpretation content must be in ${languageName}. Do NOT write in English. The delimiters stay in English, but ALL content between them must be in ${languageName}.`
        : ""

    const ldsContext = contentMode === "academic" 
      ? `You are a religious studies scholar specializing in Latter-day Saint scripture and history. Provide rigorous academic analysis while maintaining a faith-affirming perspective.`
      : `You are creating scripture study content for members of The Church of Jesus Christ of Latter-day Saints. 
    
Key guidelines:
- Use LDS terminology naturally (testimony, covenant, priesthood, temple, calling, ward, stake, bishop, etc.)
- Reference modern prophets and General Conference when relevant
- Connect scriptures to the Restoration, Plan of Salvation, and latter-day context
- For Book of Mormon verses, reference the context of who is speaking (Nephi, Alma, Mormon, etc.)
- For D&C verses, reference the historical context of the revelation when helpful
- Maintain a tone consistent with Church publications - warm, testimony-building, and doctrinally sound
- Never use "Mormon" as a noun for church members; use "Latter-day Saints" or "members of the Church"`

    const baseInstructions = `CRITICAL: Write ONLY plain prose text. NO URLs, NO links, NO citations, NO bracketed text, NO markdown formatting, NO asterisks, NO underscores for emphasis.`

    const systemInstruction = `${ldsContext}\n\n${baseInstructions}\n\n${languageInstruction}${languageInstruction ? "\n\n" : ""}${personalizationContext}`

    const promptInstruction = contentMode === "academic"
      ? `Write a scholarly analysis of this scripture. Include linguistic insights (Hebrew/Greek/Hebraisms where relevant), historical-critical context, cross-references, and academic perspective. Cite LDS scholars where appropriate (Nibley, Welch, etc.). Maintain academic rigor while being spiritually insightful.`
      : `Write a reflective monologue about this scripture in a warm, personal tone. This should feel like something a thoughtful member might share in testimony meeting or a Come, Follow Me discussion - genuine, heartfelt, and connecting the scripture to real life.`

    const wordLimit = contentMode === "academic" ? "300-400 words" : "under 200 words"

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      system: systemInstruction,
      prompt: `${verseReference}: "${verseText}"
      ${source ? `(Source: ${source})` : ""}
      
      ${language !== "en" ? `REMINDER: Write your interpretation in ${languageName}, NOT English.\n\n` : ""}${promptInstruction}

      Write ONLY plain text - no URLs, no links, no citations, no brackets, no asterisks.
      
      Format your response EXACTLY like this:
      
      INTERPRETATION===
      Your ${contentMode === "academic" ? "scholarly analysis" : "reflective monologue"} here... (${wordLimit}, just flowing ${contentMode === "academic" ? "analysis" : "reflection"})
      ===INTERPRETATION
      
      IMAGE_PROMPT===
      Cinematic description of an inspiring scene that captures the scripture's theme.
      ===IMAGE_PROMPT`,
      maxTokens: contentMode === "academic" ? 5000 : 4000,
    })

    let interpretationMatch = text.match(/INTERPRETATION===\s*([\s\S]*?)\s*===INTERPRETATION/)
    if (!interpretationMatch) {
      interpretationMatch = text.match(/INTERPRETATION===\s*([\s\S]*?)\s*===(?:IMAGE_PROMPT|$)/)
    }

    let imagePromptMatch = text.match(/IMAGE_PROMPT===\s*([\s\S]*?)\s*===(?:IMAGE_PROMPT|$)/)
    if (!imagePromptMatch) {
      imagePromptMatch = text.match(/===?IMAGE_PROMPT\s*([\s\S]*?)(?:===|$)/)
    }

    const interpretation = cleanLLMText(interpretationMatch ? interpretationMatch[1].trim() : "Unable to generate interpretation.")
    const heroImagePrompt = imagePromptMatch ? imagePromptMatch[1].trim() : "A serene scene depicting faith and hope"

    return Response.json({
      interpretation,
      heroImagePrompt,
    })
  } catch (error) {
    console.error("Interpretation generation error:", error)
    return Response.json({ error: "Failed to generate interpretation" }, { status: 500 })
  }
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    es: "Spanish (Español)",
    fr: "French (Français)",
    de: "German (Deutsch)",
    pt: "Portuguese (Português)",
    zh: "Chinese (中文)",
    vi: "Vietnamese (Tiếng Việt)",
    ko: "Korean (한국어)",
    th: "Thai (ไทย)",
    tl: "Tagalog",
    ja: "Japanese (日本語)",
  }
  return languages[code] || "English"
}
