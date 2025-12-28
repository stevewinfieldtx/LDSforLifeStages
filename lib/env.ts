// Shared environment variable utilities

export function getOpenRouterApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY
  console.log("[env] OPENROUTER_API_KEY exists:", !!apiKey, apiKey ? `(starts with ${apiKey.substring(0, 10)}...)` : "")
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is required")
  }
  return apiKey
}

export function getOpenRouterModelId(): string {
  const modelId = process.env.OPENROUTER_MODEL_ID
  console.log("[env] OPENROUTER_MODEL_ID:", modelId || "NOT SET")
  if (!modelId) {
    throw new Error("OPENROUTER_MODEL_ID environment variable is required")
  }
  return modelId.trim()
}

export function getRunwareApiKey(): string {
  const apiKey = process.env.RUNWARE_API_KEY
  console.log("[env] RUNWARE_API_KEY exists:", !!apiKey)
  if (!apiKey) {
    throw new Error("RUNWARE_API_KEY environment variable is required")
  }
  return apiKey
}

export function getRunwareModelId(): string {
  const modelId = process.env.RUNWARE_MODEL_ID
  console.log("[env] RUNWARE_MODEL_ID:", modelId || "NOT SET")
  if (!modelId) {
    throw new Error("RUNWARE_MODEL_ID environment variable is required")
  }
  return modelId.trim()
}
