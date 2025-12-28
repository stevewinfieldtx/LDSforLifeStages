import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"
import { getOpenRouterApiKey, getOpenRouterModelId } from "@/lib/env"

export async function POST(req: Request) {
  try {
    const { message, verseReference, verseText, history, source } = await req.json()

    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const systemPrompt = `You are a helpful, empathetic scripture study companion for members of The Church of Jesus Christ of Latter-day Saints. You are discussing the scripture: ${verseReference} ("${verseText}").
${source ? `This scripture is from: ${source}` : ""}

Guidelines:
- Keep responses concise (under 100 words) and conversational
- Ask open-ended questions to help the member reflect and build their testimony
- Be warm, encouraging, and supportive - like a caring gospel doctrine teacher
- Reference the specific scripture when relevant
- Use appropriate LDS terminology naturally (testimony, covenant, priesthood, temple, calling, etc.)
- Feel free to reference General Conference talks, modern prophets, or other scriptures that connect
- For Book of Mormon scriptures, you can reference the narrative context
- For D&C, you can reference the historical Restoration context
- If the member asks about other topics, gently guide back to scripture study
- Never be preachy - be a supportive companion in their gospel learning
- Respect that members may have different levels of gospel knowledge`

    // Build conversation history for context
    const conversationContext =
      history
        ?.slice(-6)
        .map((msg: { sender: string; text: string }) => `${msg.sender}: ${msg.text}`)
        .join("\n") || ""

    const prompt = conversationContext
      ? `Previous conversation:\n${conversationContext}\n\nMember: ${message}\n\nRespond helpfully:`
      : `Member: ${message}\n\nRespond helpfully:`

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      system: systemPrompt,
      prompt,
      maxTokens: 500,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ response: "I apologize, but I had trouble responding. Please try again." }, { status: 500 })
  }
}
