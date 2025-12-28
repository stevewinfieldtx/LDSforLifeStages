# Scripture for Life Stages - LDS Edition

A personalized scripture study app for members of The Church of Jesus Christ of Latter-day Saints.

## Features

### 📖 All Standard Works
- **Book of Mormon** - Scripture of the Day from the Book of Mormon
- **Doctrine & Covenants** - Revelations for modern Saints
- **Pearl of Great Price** - Scripture search support
- **Bible (KJV)** - King James Version with LDS perspective
- **Come, Follow Me** - Scriptures aligned with current curriculum

### 🎯 Life Stage Personalization
Content adapts to where you are in your gospel journey:

**Age Groups:**
- Youth (12-17)
- Young Single Adult (18-30)
- Adult (31-64)
- Senior (65+)

**LDS-Specific Life Stages:**
- Missionary Service (preparing, serving, returned)
- Temple & Marriage (preparing, newly sealed, anniversary)
- Family Life (babies, young children, teens, empty nest)
- Church Callings (new, demanding, released)
- Faith & Challenges (new convert, faith crisis, inactive family, grief, health, etc.)

### ✨ AI-Generated Content
For each scripture, the app generates:
- **Personalized Interpretation** - Reflection tailored to your life stage
- **Historical Context** - The backstory from Book of Mormon, D&C, or Bible times
- **Two Stories** - Contemporary LDS story + Historical/scriptural narrative
- **Two Poems** - Hymn-style + Free verse
- **Symbolic Imagery** - Deep-dive into scripture symbolism
- **Original Song** - Inspirational music in LDS artist style
- **AI Art** - Images for each content piece

### 💬 Scripture Chat
Interactive study companion for Come, Follow Me discussions

### 🌍 Multi-Language Support
- English, Spanish, Portuguese, Chinese, Vietnamese, Korean, Thai, Tagalog, Japanese

## Tech Stack

- **Framework:** Next.js 16 with React 19
- **AI:** OpenRouter (Claude Sonnet 4)
- **Image Generation:** Runware
- **Styling:** Tailwind CSS + Radix UI
- **Deployment:** Vercel

## Environment Variables

```env
OPENROUTER_API_KEY=your_key
OPENROUTER_MODEL_ID=anthropic/claude-sonnet-4-20250514
RUNWARE_API_KEY=your_key
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Content Guidelines

All generated content follows Church standards:
- Doctrinally sound and testimony-building
- Appropriate for all ages
- Modest imagery
- Reflects LDS culture and terminology authentically
- Never preachy - focuses on personal application

## Future Enhancements

- [ ] General Conference talk integration
- [ ] Seminary/Institute curriculum alignment
- [ ] Family sharing features
- [ ] Personal scripture journal
- [ ] Streak tracking for daily study
- [ ] Audio narration of generated content
- [ ] Integration with Gospel Library app

---

*"Search the scriptures; for in them ye think ye have eternal life: and they are they which testify of me."* - John 5:39
