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
    const isPearlOfGreatPrice = source?.includes("Pearl") || /Moses|Abraham|JS-H|JS-M|Articles of Faith/i.test(verseReference)

    let scriptureTypeGuidance = ""
    if (isBookOfMormon) {
      scriptureTypeGuidance = contentMode === "academic" 
        ? `This is from the Book of Mormon. Provide scholarly analysis including: Hebraisms and chiastic structures, Book of Mormon geography theories, archaeological connections, Royal Skousen's textual analysis, Brant Gardner's cultural commentary.`
        : `This is from the Book of Mormon. Cover: ancient American setting, the prophet/writer, Book of Mormon chronology, Joseph Smith's translation, connections to brass plates or other BoM elements.`
    } else if (isDandC) {
      scriptureTypeGuidance = contentMode === "academic"
        ? `This is from the Doctrine and Covenants. Provide scholarly analysis including: historical documents and correspondence, specific dates and locations, early Saints involved, manuscript history, JSP (Joseph Smith Papers) references.`
        : `This is from the Doctrine and Covenants. Cover: what prompted the revelation, who was present, the location, early Saints involved, how it shaped the Restoration.`
    } else if (isPearlOfGreatPrice) {
      scriptureTypeGuidance = contentMode === "academic"
        ? `This is from the Pearl of Great Price. Provide scholarly analysis including: translation history, Egyptological context for Book of Abraham, comparative ancient Near Eastern texts, Hugh Nibley's research.`
        : `This is from the Pearl of Great Price. Cover: whether from Moses, Abraham, or JS-History, the translation context, unique doctrinal insights, temple connections if applicable.`
    } else {
      scriptureTypeGuidance = contentMode === "academic"
        ? `This is from the Bible (KJV). Provide scholarly analysis including: Hebrew (OT) or Greek (NT) word studies, Dead Sea Scrolls connections, JST variants, ancient Near Eastern context.`
        : `This is from the Bible (KJV). Cover: biblical setting, how LDS doctrine illuminates it, connections to Book of Mormon or Restoration, JST changes if significant.`
    }

    const toneInstruction = contentMode === "academic"
      ? `Write as a religious studies scholar. Be thorough, cite sources, include linguistic analysis.`
      : `Write like a knowledgeable Gospel Doctrine teacher who makes history come alive. Keep it engaging and accessible.`

    const systemInstruction = `${toneInstruction}

${scriptureTypeGuidance}

${personalization}

CRITICAL: Write ONLY plain prose text. NO URLs, NO links, NO citations, NO references, NO bracketed text like [source], NO markdown formatting, NO asterisks, NO underscores for emphasis. Just clean, flowing prose.`

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      system: systemInstruction,
      prompt: `Give me the backstory for ${verseReference}: "${verseText}"
      ${source ? `(Source: ${source})` : ""}
      
      Return ONLY a JSON object with this structure, no markdown, no citations, no URLs anywhere:
      {
        "context": {
          "whoIsSpeaking": "Plain text about the speaker/writer${contentMode === "academic" ? " with scholarly detail" : ""}",
          "originalListeners": "Plain text about who received these words${contentMode === "academic" ? " with specific names and dates" : ""}",
          "whyTheConversation": "Plain text about what prompted these words${contentMode === "academic" ? " with historical documentation" : ""}",
          "historicalBackdrop": "Plain text painting the bigger picture${contentMode === "academic" ? " with archaeological/historical context" : ""}",
          "immediateImpact": "Plain text about how people responded${contentMode === "academic" ? " citing early sources" : ""}",
          "longTermImpact": "Plain text about lasting impact${contentMode === "academic" ? " including scholarly reception" : ""}",
          "setting": "Plain text describing the location and scene${contentMode === "academic" ? " with geographical/archaeological detail" : ""}"
        },
        "contextImagePrompt": "Cinematic historical scene description"
      }`,
      maxTokens: contentMode === "academic" ? 4000 : 2500,
    })

    const data = parseLLMJson(text)
    const cleanedData = cleanLLMObject(data)

    return Response.json(cleanedData)
  } catch (error) {
    console.error("Context generation error:", error)
    return Response.json({ error: "Failed to generate context" }, { status: 500 })
  }
}
