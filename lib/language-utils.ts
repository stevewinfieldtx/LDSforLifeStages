export function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    pt: "Portuguese",
    zh: "Chinese",
    vi: "Vietnamese",
    ko: "Korean",
    th: "Thai",
  }
  return languages[code] || "English"
}

export function getLanguageInstruction(language: string): string {
  if (language === "en") return ""
  return `\n\nIMPORTANT: Write ALL your response in ${getLanguageName(language)}. The content MUST be entirely in ${getLanguageName(language)}.`
}
