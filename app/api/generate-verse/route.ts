import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"
import { getOpenRouterApiKey, getOpenRouterModelId } from "@/lib/env"

// Standard Works scripture sources for LDS
const SCRIPTURE_SOURCES = {
  BIBLE: "Bible (KJV)",
  BOOK_OF_MORMON: "Book of Mormon",
  DOCTRINE_AND_COVENANTS: "Doctrine and Covenants",
  PEARL_OF_GREAT_PRICE: "Pearl of Great Price",
}

// Come Follow Me typically follows a schedule - we'll generate contextually appropriate verses
async function fetchComeFollowMeVerse(): Promise<{ reference: string; text: string; version: string; source: string } | null> {
  try {
    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      prompt: `Today is ${currentDate}. Select a meaningful scripture from the current Come, Follow Me curriculum for The Church of Jesus Christ of Latter-day Saints. 
      
      Return ONLY a JSON object with this structure:
      {
        "reference": "Book Chapter:Verse (e.g., '1 Nephi 3:7' or 'D&C 4:2')",
        "version": "LDS",
        "text": "The exact text of the scripture",
        "source": "Book of Mormon" or "Doctrine and Covenants" or "Pearl of Great Price" or "Bible (KJV)"
      }
      
      Choose from any of the Standard Works. Return only the JSON, no explanation.`,
      maxTokens: 500,
    })

    const cleanJson = text.replace(/```json|```/g, "").trim()
    return JSON.parse(cleanJson)
  } catch (e) {
    console.error("Come Follow Me fetch error:", e)
  }
  return null
}

async function fetchBookOfMormonVerse(): Promise<{ reference: string; text: string; version: string; source: string } | null> {
  try {
    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      prompt: `Select a powerful, well-known scripture from the Book of Mormon that would be meaningful for daily study.
      
      Return ONLY a JSON object with this structure:
      {
        "reference": "Book Chapter:Verse (e.g., '1 Nephi 3:7', 'Alma 32:21', 'Moroni 10:4-5')",
        "version": "LDS",
        "text": "The exact text of the scripture",
        "source": "Book of Mormon"
      }
      
      Choose scriptures that are frequently quoted in General Conference or are particularly meaningful for Latter-day Saints. Return only the JSON, no explanation.`,
      maxTokens: 500,
    })

    const cleanJson = text.replace(/```json|```/g, "").trim()
    return JSON.parse(cleanJson)
  } catch (e) {
    console.error("Book of Mormon fetch error:", e)
  }
  return null
}

async function fetchDoctrineAndCovenantsVerse(): Promise<{ reference: string; text: string; version: string; source: string } | null> {
  try {
    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      prompt: `Select a meaningful scripture from the Doctrine and Covenants that would be uplifting for daily study.
      
      Return ONLY a JSON object with this structure:
      {
        "reference": "D&C Section:Verse (e.g., 'D&C 4:2', 'D&C 121:7-8', 'D&C 58:27')",
        "version": "LDS",
        "text": "The exact text of the scripture",
        "source": "Doctrine and Covenants"
      }
      
      Choose scriptures that are frequently quoted or particularly relevant to modern-day Saints. Return only the JSON, no explanation.`,
      maxTokens: 500,
    })

    const cleanJson = text.replace(/```json|```/g, "").trim()
    return JSON.parse(cleanJson)
  } catch (e) {
    console.error("D&C fetch error:", e)
  }
  return null
}

async function fetchBibleKJVVerse(): Promise<{ reference: string; text: string; version: string; source: string } | null> {
  try {
    const openrouter = createOpenRouter({
      apiKey: getOpenRouterApiKey(),
    })

    const { text } = await generateText({
      model: openrouter(getOpenRouterModelId()),
      prompt: `Select a meaningful scripture from the King James Version of the Bible that would be particularly meaningful for Latter-day Saints.
      
      Return ONLY a JSON object with this structure:
      {
        "reference": "Book Chapter:Verse (e.g., 'John 3:16', 'James 1:5', 'Isaiah 53:5')",
        "version": "KJV",
        "text": "The exact KJV text of the scripture",
        "source": "Bible (KJV)"
      }
      
      Choose scriptures that are frequently quoted in LDS contexts or connect to Restoration truths. Return only the JSON, no explanation.`,
      maxTokens: 500,
    })

    const cleanJson = text.replace(/```json|```/g, "").trim()
    return JSON.parse(cleanJson)
  } catch (e) {
    console.error("Bible KJV fetch error:", e)
  }
  return null
}

export async function POST(request: Request) {
  try {
    const { source, verseQuery } = await request.json()

    // Handle specific verse queries (user searching for a specific verse)
    if (verseQuery) {
      console.log("[v0] generate-verse API - verseQuery requested:", verseQuery)
      const openrouter = createOpenRouter({
        apiKey: getOpenRouterApiKey(),
      })

      const { text } = await generateText({
        model: openrouter(getOpenRouterModelId()),
        prompt: `Return ONLY a JSON object for the LDS scripture: ${verseQuery}
        
        This could be from the Bible (KJV), Book of Mormon, Doctrine and Covenants, or Pearl of Great Price.
        
        Return ONLY this JSON structure, no markdown, no explanation:
        {
          "reference": "Book Chapter:Verse (exactly as requested or corrected if needed)",
          "version": "LDS" or "KJV",
          "text": "The exact text of the verse",
          "source": "Book of Mormon" or "Doctrine and Covenants" or "Pearl of Great Price" or "Bible (KJV)"
        }`,
        maxTokens: 500,
      })

      const cleanJson = text.replace(/```json|```/g, "").trim()
      const data = JSON.parse(cleanJson)
      console.log("[v0] generate-verse API - LLM returned:", data.reference)
      return Response.json(data)
    }

    let verse = null

    // Handle scripture source selection
    if (source === "ComeFollowMe") {
      verse = await fetchComeFollowMeVerse()
    } else if (source === "BookOfMormon") {
      verse = await fetchBookOfMormonVerse()
    } else if (source === "DoctrineCovenants") {
      verse = await fetchDoctrineAndCovenantsVerse()
    } else if (source === "Bible") {
      verse = await fetchBibleKJVVerse()
    }

    // Fallback: try Come, Follow Me if nothing else works
    if (!verse) {
      console.log("[v0] generate-verse API - Primary source failed, trying Come Follow Me...")
      verse = await fetchComeFollowMeVerse()
    }

    if (!verse) {
      console.log("[v0] generate-verse API - No verse found, returning error")
      return Response.json({ error: "Unable to fetch verse of the day" }, { status: 500 })
    }

    console.log("[v0] generate-verse API - Returning verse:", verse.reference, "from", verse.source)
    return Response.json(verse)
  } catch (error) {
    console.error("Verse generation error:", error)
    return Response.json({ error: "Failed to generate verse" }, { status: 500 })
  }
}
