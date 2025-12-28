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
        ? `This is from the Book of Mormon. Your scholarly analysis MUST include:
- Specific textual analysis citing Royal Skousen's Critical Text Project findings
- Hebraisms identified by John Tvedtnes or Donald Parry (name specific examples)
- Chiastic structures identified by John Welch if present
- Book of Mormon geography theories (Limited Geography Model, Heartland Model) with scholarly proponents
- Ancient Mesoamerican or Near Eastern cultural parallels cited by Brant Gardner, John Sorenson, or Hugh Nibley
- Narrative criticism and literary analysis
- Dating and chronological framework from Mormon's abridgment`
        : `This is from the Book of Mormon. Cover: ancient American setting, the prophet/writer, Book of Mormon chronology, Joseph Smith's translation, connections to brass plates or other BoM elements.`
    } else if (isDandC) {
      scriptureTypeGuidance = contentMode === "academic"
        ? `This is from the Doctrine and Covenants. Your scholarly analysis MUST include:
- Exact dates, locations, and circumstances from Joseph Smith Papers Project
- Names of all individuals present and their roles
- Contemporary correspondence and journal entries that illuminate the revelation
- Manuscript history and textual variants between editions
- Historical context from Leonard Arrington, Richard Bushman, or other historians
- How the revelation addressed specific questions or controversies of the time
- Reception history and how interpretation evolved`
        : `This is from the Doctrine and Covenants. Cover: what prompted the revelation, who was present, the location, early Saints involved, how it shaped the Restoration.`
    } else if (isPearlOfGreatPrice) {
      scriptureTypeGuidance = contentMode === "academic"
        ? `This is from the Pearl of Great Price. Your scholarly analysis MUST include:
- Translation and production history with specific dates
- For Book of Abraham: Egyptological analysis, relationship to Joseph Smith Papyri, scholarly debates (Gee, Muhlestein, Ritner)
- For Book of Moses: Relationship to JST Genesis, ancient pseudepigraphal parallels
- Hugh Nibley's comparative ancient textual analysis
- Temple themes and ritual connections identified by scholars
- Textual criticism and manuscript evidence`
        : `This is from the Pearl of Great Price. Cover: whether from Moses, Abraham, or JS-History, the translation context, unique doctrinal insights, temple connections if applicable.`
    } else {
      scriptureTypeGuidance = contentMode === "academic"
        ? `This is from the Bible (KJV). Your scholarly analysis MUST include:
- Hebrew (OT) or Greek (NT) word studies with transliteration and Strong's numbers
- Textual variants from Dead Sea Scrolls, Septuagint, or other manuscripts
- JST (Joseph Smith Translation) changes with analysis of significance
- Ancient Near Eastern context (archaeology, epigraphy, comparative texts)
- Form criticism, source criticism, or redaction criticism insights
- How LDS scholarship interprets this passage differently than traditional Christianity
- Cross-references to Restoration scripture that illuminate meaning`
        : `This is from the Bible (KJV). Cover: biblical setting, how LDS doctrine illuminates it, connections to Book of Mormon or Restoration, JST changes if significant.`
    }

    const systemInstruction = contentMode === "academic"
      ? `You are a BYU Religious Education professor writing for an academic journal. Your analysis must demonstrate deep scholarly expertise.

CRITICAL ACADEMIC REQUIREMENTS:
- Cite specific scholars BY NAME (Nibley, Welch, Tvedtnes, Sorenson, Skousen, Gardner, Bushman, etc.)
- Include specific dates, not approximate ones
- Reference primary sources (Joseph Smith Papers, Journal of Discourses, Times and Seasons)
- Use technical terminology (chiasmus, Hebraism, pericope, redaction, etc.)
- Acknowledge scholarly debates and competing interpretations
- Include linguistic analysis where relevant
- Reference peer-reviewed publications (BYU Studies, Interpreter, Journal of Book of Mormon Studies)

${scriptureTypeGuidance}

${personalization}

CRITICAL: Write ONLY plain prose text. NO URLs, NO links, NO bracketed citations like [1] or [source]. Mention scholars and works by name in the text itself, not as footnotes.`
      : `You're helping Latter-day Saints understand their scriptures - like a knowledgeable Gospel Doctrine teacher who makes history come alive. Keep it engaging and accessible.

${scriptureTypeGuidance}

${personalization}

CRITICAL: Write ONLY plain prose text. NO URLs, NO links, NO citations, NO references, NO bracketed text like [source], NO markdown formatting, NO asterisks, NO underscores for emphasis. Just clean, flowing prose.`

    const academicFieldPrompts = {
      whoIsSpeaking: "Provide detailed biographical and scholarly analysis of the speaker/writer, including their historical context, literary voice, and how scholars have analyzed their role",
      originalListeners: "Identify the specific audience with names, dates, population estimates from scholarly sources, and socio-cultural analysis of their situation",
      whyTheConversation: "Analyze the precipitating circumstances using primary historical documents, scholarly reconstructions, and theological significance",
      historicalBackdrop: "Provide comprehensive historical-critical context including archaeology, epigraphy, political situation, and relevant ancient Near Eastern or American parallels cited by scholars",
      immediateImpact: "Analyze immediate reception using textual evidence, contemporary accounts, and scholarly interpretation of audience response",
      longTermImpact: "Trace the interpretive history, theological development, and scholarly reception of this passage through LDS history",
      setting: "Describe the geographical and archaeological context with specific site identifications, scholarly debates about location, and material culture evidence"
    }

    const casualFieldPrompts = {
      whoIsSpeaking: "Plain text about the speaker/writer",
      originalListeners: "Plain text about who received these words",
      whyTheConversation: "Plain text about what prompted these words",
      historicalBackdrop: "Plain text painting the bigger picture",
      immediateImpact: "Plain text about how people responded",
      longTermImpact: "Plain text about lasting impact",
      setting: "Plain text describing the location and scene"
    }

    const fieldPrompts = contentMode === "academic" ? academicFieldPrompts : casualFieldPrompts

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      system: systemInstruction,
      prompt: `Provide ${contentMode === "academic" ? "scholarly analysis of" : "the backstory for"} ${verseReference}: "${verseText}"
      ${source ? `(Source: ${source})` : ""}
      
      ${contentMode === "academic" ? "Write as if for an academic journal. Cite scholars by name. Include specific dates and primary sources." : ""}
      
      Return ONLY a JSON object with this structure, no markdown, no bracketed citations, no URLs:
      {
        "context": {
          "whoIsSpeaking": "${fieldPrompts.whoIsSpeaking}",
          "originalListeners": "${fieldPrompts.originalListeners}",
          "whyTheConversation": "${fieldPrompts.whyTheConversation}",
          "historicalBackdrop": "${fieldPrompts.historicalBackdrop}",
          "immediateImpact": "${fieldPrompts.immediateImpact}",
          "longTermImpact": "${fieldPrompts.longTermImpact}",
          "setting": "${fieldPrompts.setting}"
        },
        "contextImagePrompt": "Cinematic historical scene description"
      }`,
      maxTokens: contentMode === "academic" ? 6000 : 2500,
    })

    const data = parseLLMJson(text)
    const cleanedData = cleanLLMObject(data)

    return Response.json(cleanedData)
  } catch (error) {
    console.error("Context generation error:", error)
    return Response.json({ error: "Failed to generate context" }, { status: 500 })
  }
}
