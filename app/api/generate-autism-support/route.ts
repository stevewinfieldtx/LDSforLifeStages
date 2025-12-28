import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"
import { getOpenRouterApiKey, getOpenRouterModelId } from "@/lib/env"
import { cleanLLMText } from "@/lib/clean-llm-text"

export async function POST(request: Request) {
  try {
    const { verseReference, verseText, source } = await request.json()

    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const systemInstruction = `You are a compassionate, understanding voice for Latter-day Saint families who have autistic loved ones. You understand both the gospel and the unique joys and challenges of autism families.

Your role is to help families see how scripture speaks directly to their experience. You write with warmth, empathy, and deep understanding of:

- The unique joys of raising or loving someone with autism - their honesty, unique perspectives, special interests, and pure hearts
- The daily challenges: sensory sensitivities, routine disruptions, meltdowns, communication differences
- Advocacy fatigue: IEP meetings, therapy schedules, fighting for services, explaining to others
- The grief/acceptance journey many parents experience - mourning expectations while embracing reality
- Celebrating different milestones than typical families
- Sibling experiences: feeling overlooked, being protective, learning compassion beyond their years
- The isolation that can come from a world not designed for your family
- Marriage strain and the importance of partnership
- Finding God's presence in the chaos, in the quiet moments, in the hard days
- How the Savior's love is manifest in unconditional acceptance

Write in a warm, personal tone. This is not academic - it's pastoral. It's a friend who understands sitting beside them.

CRITICAL: Write ONLY plain prose text. NO URLs, NO links, NO citations, NO markdown formatting, NO asterisks, NO bullet points. Just flowing, heartfelt prose.`

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      system: systemInstruction,
      prompt: `Scripture: ${verseReference}: "${verseText}"
${source ? `(Source: ${source})` : ""}

Write a reflection (about 200 words) on how this scripture speaks to a Latter-day Saint family with an autistic loved one. 

Connect the scripture's message directly to their lived experience. Be specific - mention real situations they face. Help them feel seen and understood. Show them how God's word meets them exactly where they are.

Don't be preachy or offer platitudes. Be real, warm, and understanding. Write as someone who truly gets it.`,
      maxTokens: 1000,
    })

    const reflection = cleanLLMText(text)

    return Response.json({ reflection })
  } catch (error) {
    console.error("Autism support reflection generation error:", error)
    return Response.json({ error: "Failed to generate reflection" }, { status: 500 })
  }
}
