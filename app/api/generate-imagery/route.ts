import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"
import { parseLLMJson } from "@/lib/parse-llm-json"
import { buildPersonalizationContext, type ContentMode } from "@/lib/personalization-prompts"
import { getOpenRouterApiKey, getOpenRouterModelId } from "@/lib/env"
import { cleanLLMObject } from "@/lib/clean-llm-text"

export async function POST(request: Request) {
  try {
    const { verseReference, verseText, ageRange, gender, stageSituation, source, contentMode = "casual" } = await request.json()

    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const personalization = buildPersonalizationContext(ageRange, gender, stageSituation, contentMode as ContentMode)

    const isBookOfMormon = source?.includes("Book of Mormon") || /nephi|alma|mosiah|helaman|mormon|ether|moroni/i.test(verseReference)
    const isDandC = source?.includes("Doctrine") || /D&C|D\&C|Doctrine/i.test(verseReference)

    let scriptureContext = ""
    if (isBookOfMormon) {
      scriptureContext = contentMode === "academic"
        ? "This is from the Book of Mormon. Reference scholarly analysis of symbols: Nibley on temple imagery, Welch on chiastic symbolism, ancient Near Eastern parallels."
        : "This is from the Book of Mormon. Reference symbols like Liahona, iron rod, tree of life, waters of Mormon, etc."
    } else if (isDandC) {
      scriptureContext = contentMode === "academic"
        ? "This is from the Doctrine and Covenants. Reference Restoration symbolism with historical documentation, temple ordinance connections, and prophetic commentary."
        : "This is from the Doctrine and Covenants. Reference Restoration symbols like Sacred Grove, Kirtland Temple, priesthood keys, etc."
    }

    const systemInstruction = contentMode === "academic"
      ? `You are a religious studies scholar analyzing scriptural symbolism. Provide deep symbolic analysis with references to ancient texts, Hebrew/Greek meanings, temple typology, and scholarly interpretations from LDS academics.

${scriptureContext}

CRITICAL: Write ONLY plain prose text. NO URLs, NO links, NO citations, NO bracketed text, NO markdown formatting, NO asterisks or underscores.

${personalization}`
      : `You help Latter-day Saints discover beautiful symbolism in scripture. Write like you're sharing an insight in Gospel Doctrine class.

${scriptureContext}

Reference temple symbolism, covenants, prophetic teachings, and cross-references when appropriate.

CRITICAL: Write ONLY plain prose text. NO URLs, NO links, NO citations, NO bracketed text, NO markdown formatting, NO asterisks or underscores.

${personalization}`

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      system: systemInstruction,
      prompt: `Find 4 powerful symbols or metaphors in ${verseReference}: "${verseText}"
${source ? `(From: ${source})` : ""}

${contentMode === "academic" ? "Provide scholarly analysis of each symbol including linguistic origins, ancient parallels, and theological significance." : "Explain each symbol in a friendly, insightful way."}

Return ONLY a JSON object, no markdown, no citations, no URLs:
{
  "imagery": [
    { "title": "Symbol Name", "sub": "${contentMode === "academic" ? "Scholarly analysis with linguistic and historical depth" : "Plain text explanation of this symbol and how it applies to Latter-day Saints"}", "icon": "auto_awesome", "imagePrompt": "Visual description" },
    { "title": "Symbol Name", "sub": "${contentMode === "academic" ? "Scholarly analysis" : "Plain text explanation"}", "icon": "water_drop", "imagePrompt": "Visual description" },
    { "title": "Symbol Name", "sub": "${contentMode === "academic" ? "Scholarly analysis" : "Plain text explanation"}", "icon": "spa", "imagePrompt": "Visual description" },
    { "title": "Symbol Name", "sub": "${contentMode === "academic" ? "Scholarly analysis" : "Plain text explanation"}", "icon": "wb_sunny", "imagePrompt": "Visual description" }
  ]
}`,
      maxTokens: contentMode === "academic" ? 3000 : 1500,
    })

    const cleanJson = text.replace(/```json|```/g, "").trim()
    const data = parseLLMJson(cleanJson)
    const cleanedData = cleanLLMObject(data)

    return Response.json(cleanedData)
  } catch (error) {
    console.error("Imagery generation error:", error)
    return Response.json({ error: "Failed to generate imagery" }, { status: 500 })
  }
}
