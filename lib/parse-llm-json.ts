export function parseLLMJson<T>(text: string): T {
  // Remove markdown code blocks if present
  let cleanJson = text.replace(/```json\s*|```\s*/g, "").trim()

  // First, try to parse as-is (in case it's already valid)
  try {
    return JSON.parse(cleanJson)
  } catch {
    // Continue with cleaning
  }

  const jsonMatch = cleanJson.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
  if (jsonMatch) {
    cleanJson = jsonMatch[1]
  }

  // Replace actual newlines, carriage returns, and tabs with escaped versions
  // We need to do this carefully - only inside string values
  let result = ""
  let inString = false
  let escape = false

  for (let i = 0; i < cleanJson.length; i++) {
    const char = cleanJson[i]

    if (escape) {
      result += char
      escape = false
      continue
    }

    if (char === "\\") {
      result += char
      escape = true
      continue
    }

    if (char === '"') {
      inString = !inString
      result += char
      continue
    }

    if (inString) {
      // Escape control characters inside strings
      if (char === "\n") {
        result += "\\n"
      } else if (char === "\r") {
        result += "\\r"
      } else if (char === "\t") {
        result += "\\t"
      } else if (char.charCodeAt(0) < 32) {
        result += "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0")
      } else {
        result += char
      }
    } else {
      result += char
    }
  }

  try {
    return JSON.parse(result)
  } catch (e) {
    // Try using a more lenient approach - replace problematic patterns
    const fixedJson = result
      // Fix unescaped quotes inside strings (common LLM error)
      .replace(/:\s*"([^"]*?)(?<!\\)"([^"]*?)"/g, ': "$1\\"$2"')
      // Remove trailing commas before } or ]
      .replace(/,(\s*[}\]])/g, "$1")

    try {
      return JSON.parse(fixedJson)
    } catch {
      const repairedJson = repairTruncatedJson(result)
      try {
        return JSON.parse(repairedJson)
      } catch {
        console.error("[v0] Failed to parse JSON after all attempts. First 500 chars:", result.substring(0, 500))
        throw e
      }
    }
  }
}

function repairTruncatedJson(json: string): string {
  let repaired = json.trim()

  // If we're in the middle of a string, close it
  const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length
  if (quoteCount % 2 !== 0) {
    // Odd number of quotes - we're inside a string, close it
    repaired += '..."'
  }

  // Count open brackets and braces
  let openBraces = 0
  let openBrackets = 0
  let inString = false
  let escape = false

  for (const char of repaired) {
    if (escape) {
      escape = false
      continue
    }
    if (char === "\\") {
      escape = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }
    if (!inString) {
      if (char === "{") openBraces++
      if (char === "}") openBraces--
      if (char === "[") openBrackets++
      if (char === "]") openBrackets--
    }
  }

  // Remove trailing comma if present
  repaired = repaired.replace(/,\s*$/, "")

  // Close any incomplete object properties
  if (repaired.match(/:\s*$/)) {
    repaired += '""'
  }

  // Close open brackets and braces
  while (openBrackets > 0) {
    repaired += "]"
    openBrackets--
  }
  while (openBraces > 0) {
    repaired += "}"
    openBraces--
  }

  return repaired
}
