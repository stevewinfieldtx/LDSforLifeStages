import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"
import { buildPersonalizationContext, type ContentMode } from "@/lib/personalization-prompts"
import { getOpenRouterApiKey, getOpenRouterModelId } from "@/lib/env"
import { cleanLLMText } from "@/lib/clean-llm-text"

export async function POST(request: Request) {
  try {
    const { verseReference, verseText, ageRange, gender, stageSituation, storyType, source, contentMode = "casual" } = await request.json()

    if (!verseReference || !verseText || !storyType) {
      return Response.json({
        error: "Missing required fields",
        title: "Story Unavailable",
        text: "Unable to generate story due to missing information.",
        imagePrompt: "A peaceful scene",
      }, { status: 400 })
    }

    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const personalization = buildPersonalizationContext(ageRange, gender, stageSituation, contentMode as ContentMode)

    const storyPrompts: Record<string, Record<string, string>> = {
      casual: {
        contemporary: `Write a modern-day story set in TODAY's world within an LDS context. Settings: family home, ward building, temple grounds, mission field, YSA ward, hospital with priesthood blessing, family home evening, youth camp, etc. Focus on realistic situations - callings, missionary work, covenants, family challenges, faith, service, temple attendance. Use natural LDS vernacular.`,
        historical: `Write a story in a historical setting related to this scripture. For Book of Mormon: perspective of someone in the narrative. For Bible: the original biblical setting. For D&C: early Restoration - Joseph Smith era, Kirtland, Nauvoo, pioneer trek. Make it historically vivid.`,
      },
      academic: {
        contemporary: `Write a modern narrative that explores the theological and doctrinal implications of this scripture. Include realistic scenarios where Latter-day Saints grapple with applying scriptural principles, referencing scholarly insights and deeper doctrinal understanding.`,
        historical: `Write a historically rigorous narrative set in the actual time and place of this scripture. For Book of Mormon: incorporate Mesoamerican or ancient American cultural details per scholarly theories. For Bible: accurate ancient Near Eastern context. For D&C: precise historical details from Joseph Smith Papers and early Church documents. Include accurate cultural practices, material culture, and historical figures.`,
      }
    }

    const mode = contentMode as ContentMode
    const storyPrompt = storyPrompts[mode]?.[storyType] || storyPrompts.casual[storyType] || storyPrompts.casual.contemporary

    const systemInstruction = contentMode === "academic"
      ? `You are a historical fiction writer with deep expertise in religious history and LDS scholarship. Write stories that are both engaging and historically/doctrinally rigorous, incorporating scholarly insights.

CRITICAL: Write ONLY plain prose. NO URLs, NO links, NO citations, NO bracketed text, NO markdown formatting, NO asterisks or underscores for emphasis.

${personalization}`
      : `You are a gifted storyteller for Latter-day Saints. Write stories that feel authentic to LDS culture - like ones shared in a fireside or Come, Follow Me discussion.

Stories should be genuine, relatable, use LDS terminology naturally, never preachy, show characters growing in testimony, and be appropriate for all ages.

CRITICAL: Write ONLY plain prose. NO URLs, NO links, NO citations, NO bracketed text, NO markdown formatting, NO asterisks or underscores for emphasis.

${personalization}`

    const wordCount = contentMode === "academic" ? "800-1000" : "500"

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      system: systemInstruction,
      prompt: `Create ONE powerful story that brings ${verseReference}: "${verseText}" to life.
${source ? `(Scripture source: ${source})` : ""}

${storyPrompt}

The story should be at least ${wordCount} words with detailed scene setting, dialogue, internal thoughts, and a clear narrative arc.

Format response EXACTLY like this:
TITLE===Your Story Title===TITLE
STORY===Your full story text (plain prose, no formatting)===STORY
IMAGE===Cinematic scene description for an image===IMAGE`,
      maxTokens: contentMode === "academic" ? 6000 : 4000,
    })

    const titleMatch = text.match(/TITLE===(.+?)===TITLE/s)
    const storyMatch = text.match(/STORY===(.+?)===STORY/s)
    const imageMatch = text.match(/IMAGE===(.+?)===IMAGE/s)

    const title = cleanLLMText(titleMatch?.[1]?.trim() || "A Story of Faith")
    const storyText = cleanLLMText(storyMatch?.[1]?.trim() || text.replace(/TITLE===.+?===TITLE/s, "").replace(/IMAGE===.+?===IMAGE/s, "").trim())
    const imagePrompt = imageMatch?.[1]?.trim() || `A warm, uplifting scene depicting ${verseReference}`

    return Response.json({
      title,
      text: storyText,
      imagePrompt,
    })
  } catch (error) {
    console.error("Story generation error:", error)
    return Response.json({
      title: "Story Unavailable",
      text: "We encountered an issue generating this story. Please try again later.",
      imagePrompt: "A peaceful, contemplative scene",
    }, { status: 200 })
  }
}
