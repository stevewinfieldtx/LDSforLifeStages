// Helper to clean URLs, citations, and markdown formatting from LLM output
export function cleanLLMText(text: string): string {
  if (!text) return text
  return text
    .replace(/\[.*?\]\(https?:\/\/[^\)]+\)/g, '') // Remove markdown links [text](url)
    .replace(/\(https?:\/\/[^\)]+\)/g, '') // Remove (url) patterns
    .replace(/https?:\/\/[^\s\)\]]+/g, '') // Remove bare URLs
    .replace(/\[[^\]]*(?:\.org|\.com|\.net|\.edu)[^\]]*\]/g, '') // Remove [domain.org] patterns
    .replace(/\[\w+\]/g, '') // Remove [word] citation patterns
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **bold** but keep text
    .replace(/\*([^*]+)\*/g, '$1') // Remove *italic* but keep text
    .replace(/_{2}([^_]+)_{2}/g, '$1') // Remove __bold__ but keep text
    .replace(/_([^_]+)_/g, '$1') // Remove _italic_ but keep text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\s+\./g, '.') // Fix spaces before periods
    .replace(/\s+,/g, ',') // Fix spaces before commas
    .trim()
}

// Clean all string values in an object recursively
export function cleanLLMObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return cleanLLMText(obj) as T
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanLLMObject(item)) as T
  }
  if (obj && typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      // Don't clean image prompts - those need their formatting
      if (key.toLowerCase().includes('imageprompt') || key.toLowerCase().includes('image_prompt')) {
        cleaned[key] = value
      } else {
        cleaned[key] = cleanLLMObject(value)
      }
    }
    return cleaned as T
  }
  return obj
}
