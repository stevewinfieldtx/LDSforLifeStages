export type ContentMode = "casual" | "academic"

export function getAgePrompt(ageRange: string, contentMode: ContentMode = "casual"): string {
  if (contentMode === "academic") {
    return getAcademicAgePrompt(ageRange)
  }
  
  const prompts: Record<string, string> = {
    teens: `Write a reflection on [scripture] that a Latter-day Saint teenager might share. Use contemporary but not exaggerated teen language. Include relevant examples from school, social media, friendships, family home evening, seminary, and youth activities. Reference LDS concepts naturally (testimony, prayer, keeping commandments, preparing for missions or temple). Avoid slang that would sound forced. Don't use first-person perspective or directly address a reader. Keep sentences shorter and ideas relatable to teenage experiences while maintaining depth.`,

    youth: `Write a reflection on [scripture] that a young single adult in the Church might share. Reference experiences like mission preparation or returned missionary life, dating within the Church, institute classes, finding a ward family away from home, and balancing faith with career/education decisions. Use language familiar to YSA members. Include subtle references to temple worthiness, personal revelation, and building a testimony. No first-person or direct address.`,

    adult: `Write a thoughtful reflection on [scripture] using balanced, mature language that resonates with Latter-day Saint adults. Include references to temple covenants, family callings, ward responsibilities, raising children in the gospel, and maintaining faith amid life's complexities. Reference concepts like eternal families, priesthood blessings, ministering, and personal revelation naturally. Use moderately sophisticated vocabulary and sentence structure with occasional metaphors drawn from LDS family and church life. Avoid first-person perspective or addressing the reader.`,

    senior: `Write a reflection on [scripture] using language that resonates with seasoned Latter-day Saint members. Include references to decades of church service, temple worship, missionary work, watching children and grandchildren in the gospel, and the eternal perspective that comes with age. Reference the comfort of covenants kept, the joy of family sealings, and the assurance of the Plan of Salvation. Use slightly more traditional phrasing while avoiding outdated expressions. The tone should be thoughtful and measured, acknowledging life's trials while testifying of God's faithfulness. No first-person perspective or direct address to the reader.`,
  }

  return prompts[ageRange] || prompts.adult
}

function getAcademicAgePrompt(ageRange: string): string {
  const prompts: Record<string, string> = {
    teens: `Write scholarly analysis accessible to a younger Latter-day Saint student. Explain original language insights simply. Include historical context with specific dates and figures. Reference Book of Mormon geography theories, archaeological connections, and textual analysis in an engaging educational way. Cite LDS scholars (Nibley, Welch, etc.) when relevant. Balance academic rigor with accessibility.`,

    youth: `Write analysis suitable for an institute-level Latter-day Saint student. Include Hebrew/Greek/reformed Egyptian linguistic analysis where relevant. Reference historical-critical scholarship, Book of Mormon chiastic structures, D&C historical documents, and JST comparisons. Cite BYU Religious Education scholars and FARMS/Interpreter publications. Maintain scholarly depth while remaining engaging.`,

    adult: `Write thorough scholarly analysis for an educated Latter-day Saint reader. Include detailed linguistic analysis (Hebrew, Greek, possible reformed Egyptian cognates). Reference manuscript traditions, historical-critical methods, archaeological evidence, and textual criticism. Cite extensively from LDS scholarship (Nibley, Welch, Tvedtnes, Sorenson, etc.) and peer-reviewed religious studies. Include JST variants, Journal of Discourses references, and early Church documents where relevant.`,

    senior: `Write comprehensive scholarly analysis for a well-read Latter-day Saint with decades of gospel study. Include deep linguistic analysis, extensive historical documentation, and thorough cross-referencing. Reference the full spectrum of LDS scholarship from early apologists to contemporary academics. Include detailed JST analysis, temple symbolism connections, and prophetic commentary across dispensations. Maintain reverence while providing rigorous academic depth.`,
  }

  return prompts[ageRange] || prompts.adult
}

export function getSituationPrompt(situation: string): string {
  const prompts: Record<string, string> = {
    // Mission-related
    "Preparing for a mission": `Include references to the anticipation and spiritual preparation for full-time missionary service. Reference mission calls, temple preparation, studying Preach My Gospel, leaving family, and the mix of excitement and nervousness. Weave in themes of consecration, sacrifice, and trusting the Lord's timing.`,

    "Currently serving a mission": `Incorporate themes relevant to full-time missionaries: teaching the gospel, finding and baptizing, homesickness, difficult companions, rejection, miraculous moments, and personal growth. Reference the unique challenges and blessings of consecrated service.`,

    "Recently returned missionary": `Reference the adjustment of returning home from missionary service—reintegration challenges, maintaining spiritual momentum, dating, education/career decisions, and finding purpose after such an intense spiritual experience. Include themes of applying mission lessons to everyday life.`,

    // Temple & Marriage
    "Preparing for temple marriage": `Include references to temple preparation, eternal covenants, the significance of sealing, and the spiritual weight of this step. Reference garments, worthiness interviews, and the blend of temporal wedding planning with eternal perspective.`,

    "Newly sealed in the temple": `Weave in themes of new covenant responsibilities, building an eternal family, establishing family traditions and patterns, and the sacred nature of the sealing ordinance. Reference the adjustment of married life within the covenant.`,

    "Temple sealing anniversary": `Incorporate themes of covenant renewal, gratitude for years together, reflecting on the eternal nature of marriage, and the perspective that comes from years of keeping temple covenants together.`,

    // Family stages
    "Having a baby": `Weave in themes of welcoming a spirit child to an eternal family, the responsibility of raising children in the gospel, baby blessings, and the overwhelming love mixed with exhaustion. Reference the Plan of Salvation and the sacred nature of parenthood.`,

    "Raising young children": `Include references to family home evening, family scripture study, primary, teaching children to pray, the beautiful chaos of a Latter-day Saint household, and finding moments of connection amid busyness.`,

    "Raising teenagers": `Incorporate themes of youth programs, seminary, young women/young men activities, mission preparation, dating standards, watching agency unfold, and navigating when to guide versus when to trust them to the Lord.`,

    "Empty nester": `Reference the bittersweetness of children leaving for missions, college, or marriage. Include themes of continued temple worship, couple missionary opportunities, grandparenting, and the eternal perspective on family.`,

    // Callings & Church Service
    "New calling": `Acknowledge the weight of a new calling, feelings of inadequacy, and trusting that the Lord qualifies those He calls. Reference sustaining, setting apart, and the growth that comes from serving.`,

    "Demanding calling": `Include references to balancing church service with family and work, the sacrifice and blessings of leadership callings, and finding strength through the Savior when feeling overwhelmed.`,

    "Released from calling": `Weave in themes of transition, identity beyond a calling, gratitude for service, and trusting the Lord's purposes in release and reassignment.`,

    // Challenges
    "Faith crisis": `Gently incorporate themes of doubt, questioning, searching for answers, and the courage it takes to stay engaged. Reference the importance of continuing to study, pray, and attend even amid uncertainty. Avoid judgment; emphasize that questions are part of the journey.`,

    "Inactive family member": `Include references to loving without pressuring, praying for family members' return, maintaining hope, and trusting the Lord's timeline. Acknowledge the heartache while emphasizing continued love and eternal family bonds.`,

    "New convert": `Reference the excitement and challenges of being new to the Church—learning culture, making friends in the ward, understanding doctrine, family opposition, and the joy of newfound testimony.`,

    "Grieving a loss": `Gently incorporate references to the Plan of Salvation, temple sealings, the hope of reunion, and the comfort of knowing families can be together forever. Acknowledge the pain while emphasizing eternal perspective.`,

    "Getting a divorce": `Acknowledge themes of broken expectations while maintaining hope. Reference the Savior's Atonement for healing, navigating Church life as a single person, concerns about eternal families, and finding identity and purpose.`,

    "Going through health challenges": `Weave in themes of priesthood blessings, relying on the Savior, ward support, and finding faith amid uncertainty. Reference the Atonement's power to succor and heal.`,

    "Struggling financially": `Reference principles of tithing, fast offerings, and trusting the Lord with temporal needs. Include themes of Bishop's storehouse if appropriate, the dignity of work, and finding worth beyond material stability.`,

    "Feeling lonely or isolated": `Incorporate references to finding belonging in the ward family, ministering relationships, the Savior's perfect understanding of loneliness, and the importance of both giving and receiving fellowship.`,

    "Nothing special": ``,
  }

  return prompts[situation] || ""
}

function getAcademicModeInstructions(): string {
  return `
ACADEMIC/RESEARCH MODE INSTRUCTIONS:
Write as a religious studies scholar with expertise in Latter-day Saint scripture. Your analysis should include:

1. LINGUISTIC ANALYSIS:
   - For Bible: Hebrew (OT) and Greek (NT) word studies with transliteration
   - For Book of Mormon: Hebraisms, chiastic structures, wordplay that works in Hebrew
   - For D&C: Analysis of Joseph Smith's revelatory language patterns
   - Include Strong's numbers or lexical references where helpful

2. HISTORICAL-CRITICAL CONTEXT:
   - Specific dates, locations, and historical figures
   - Archaeological evidence and scholarly debates
   - Manuscript traditions and textual variants
   - JST (Joseph Smith Translation) comparisons with analysis

3. SCHOLARLY CITATIONS:
   - Reference LDS scholars: Hugh Nibley, John Welch, John Tvedtnes, John Sorenson, Royal Skousen, Brant Gardner
   - Reference publications: BYU Studies, Interpreter, FARMS Review, Journal of Book of Mormon Studies
   - Reference early Church documents: Journal of Discourses, History of the Church, Times and Seasons

4. INTERTEXTUAL CONNECTIONS:
   - Cross-references across all standard works
   - Connections to ancient Near Eastern texts (Dead Sea Scrolls, Pseudepigrapha)
   - Temple symbolism and covenant patterns
   - Prophetic commentary from General Conference

5. TONE:
   - Scholarly but accessible
   - Maintain faith perspective while engaging critically with the text
   - Acknowledge scholarly debates and differing interpretations
   - Balance academic rigor with spiritual insight`
}

export function buildPersonalizationContext(
  ageRange: string, 
  gender: string, 
  stageSituation: string,
  contentMode: ContentMode = "casual"
): string {
  const parts: string[] = []

  // Base LDS context
  if (contentMode === "academic") {
    parts.push(`This analysis is for a Latter-day Saint seeking scholarly, research-based content. Assume familiarity with Church doctrine, history, and culture. Provide academic depth with proper citations and linguistic analysis.`)
    parts.push(getAcademicModeInstructions())
  } else {
    parts.push(`This reflection is for a member of The Church of Jesus Christ of Latter-day Saints. Use LDS terminology naturally (testimony, covenant, priesthood, Relief Society, temple, calling, etc.) but don't over-explain—assume familiarity with Church culture and doctrine.`)
  }

  // Add age-specific prompt
  if (ageRange) {
    parts.push(getAgePrompt(ageRange, contentMode))
  }

  // Add gender context if specified
  if (gender && gender !== "other") {
    if (gender === "female") {
      parts.push(`The reader is a woman. You may naturally reference Relief Society, Young Women experiences, or motherhood where relevant.`)
    } else if (gender === "male") {
      parts.push(`The reader is a man. You may naturally reference priesthood responsibilities, Elders Quorum, or fatherhood where relevant.`)
    }
  }

  // Add situation-specific prompt (applies to both modes)
  if (stageSituation && stageSituation !== "Nothing special") {
    const situationPrompt = getSituationPrompt(stageSituation)
    if (situationPrompt) {
      parts.push(situationPrompt)
    }
  }

  return parts.length > 0 ? `\n\nPERSONALIZATION INSTRUCTIONS:\n${parts.join("\n\n")}` : ""
}
