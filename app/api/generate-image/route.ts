import { Runware } from "@runware/sdk-js"

export async function POST(req: Request) {
  console.log("[IMAGE] generate-image API called")
  let prompt = "image"
  let width = 1024
  let height = 1024
  let ageRange = ""

  try {
    const body = await req.json()
    prompt = body.prompt
    width = body.width || 1024
    height = body.height || 1024
    ageRange = body.ageRange || ""

    console.log("[IMAGE] Prompt:", prompt?.substring(0, 100) + "...")
    console.log("[IMAGE] Dimensions:", width, "x", height)

    if (!prompt) {
      console.error("[IMAGE] No prompt provided")
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const isTeen = ageRange?.toLowerCase() === "teen" || ageRange?.toLowerCase() === "teens"
    const finalPrompt = isTeen
      ? `${prompt}, modern anime style, vibrant colors, expressive characters, clean linework, contemporary anime aesthetic`
      : prompt

    const apiKey = process.env.RUNWARE_API_KEY
    if (!apiKey) {
      console.error("[IMAGE] RUNWARE_API_KEY not configured in environment")
      const placeholderUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(prompt?.substring(0, 50) || "image")}`
      return Response.json({ imageUrl: placeholderUrl }, { status: 200 })
    }

    console.log("[IMAGE] API Key found (first 10 chars):", apiKey.substring(0, 10) + "...")

    const modelId = process.env.RUNWARE_MODEL_ID || "runware:101@1"
    console.log("[IMAGE] Using model:", modelId)

    try {
      console.log("[IMAGE] Creating Runware instance...")
      const runware = new Runware({ apiKey })

      console.log("[IMAGE] Ensuring connection...")
      await runware.ensureConnection()
      console.log("[IMAGE] Connection established!")

      console.log("[IMAGE] Calling imageInference...")
      const images = await runware.imageInference({
        model: modelId,
        positivePrompt: finalPrompt,
        width: width,
        height: height,
        numberResults: 1,
        outputType: "URL",
        outputFormat: "JPG",
      })

      console.log("[IMAGE] Response received:", JSON.stringify(images, null, 2))

      if (images && Array.isArray(images) && images.length > 0) {
        const imageUrl = images[0].imageURL
        if (imageUrl) {
          console.log("[IMAGE] Success! URL:", imageUrl)
          return Response.json({ imageUrl: imageUrl }, { status: 200 })
        }
      }

      console.error("[IMAGE] No valid image in response")
    } catch (runwareError) {
      console.error("[IMAGE] Runware SDK error:", runwareError)
      console.error("[IMAGE] Error type:", typeof runwareError)
      console.error("[IMAGE] Error message:", runwareError instanceof Error ? runwareError.message : String(runwareError))
      console.error("[IMAGE] Error stack:", runwareError instanceof Error ? runwareError.stack : "N/A")
    }

    console.log("[IMAGE] Falling back to placeholder")
    const placeholderUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(prompt.substring(0, 100))}`
    return Response.json({ imageUrl: placeholderUrl }, { status: 200 })
  } catch (error) {
    console.error("[IMAGE] Top-level error:", error)
    const placeholderUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(prompt?.substring(0, 100) || "image")}`
    return Response.json({ imageUrl: placeholderUrl }, { status: 200 })
  }
}
