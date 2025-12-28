"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type LanguageCode = "en" | "es" | "fr" | "de" | "zh" | "vi" | "ko" | "th" | "pt"

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
]

// UI translations
export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    discoverInspiration: "Discover daily inspiration tailored just for you.",
    setUpProfile: "Set up your profile",
    selectVerse: "Select a Verse or Story",
    verseOfDay: "Verse of the Day",
    personalized: "Content personalized to your life stage.",
    friendlyBreakdown: "Friendly Breakdown",
    context: "Context",
    stories: "Stories",
    poetry: "Poetry",
    imagery: "Imagery",
    songs: "Songs",
    loading: "Loading...",
    generating: "Curating your experience",
    profile: "Profile",
    home: "Home",
    premium: "Premium",
    language: "Language",
    save: "Save & Continue",
    letsGetToKnow: "Let's get to know you",
    personalizeDesc: "We'll use this to personalize your devotionals so they really speak to where you are right now.",
    fullName: "Full Name",
    email: "Email Address",
    ageRange: "Age Range",
    gender: "Gender",
    stageSituation: "What's your stage situation?",
    stageDesc: "Pick what best describes where you are in life right now.",
    privacyNote:
      "Your journey is private. We only use this data to personalize your devotional content and it is never shared with third parties.",
    trial: "Trial",
    daysLeft: "days left",
    dayLeft: "day left",
  },
  es: {
    welcome: "Bienvenido",
    discoverInspiration: "Descubre inspiración diaria adaptada solo para ti.",
    setUpProfile: "Configura tu perfil",
    selectVerse: "Selecciona un Versículo o Historia",
    verseOfDay: "Versículo del Día",
    personalized: "Contenido personalizado para tu etapa de vida.",
    friendlyBreakdown: "Explicación Amigable",
    context: "Contexto",
    stories: "Historias",
    poetry: "Poesía",
    imagery: "Imágenes",
    songs: "Canciones",
    loading: "Cargando...",
    generating: "Preparando tu experiencia",
    profile: "Perfil",
    home: "Inicio",
    premium: "Premium",
    language: "Idioma",
    save: "Guardar y Continuar",
    letsGetToKnow: "Conozcámonos",
    personalizeDesc: "Usaremos esto para personalizar tus devocionales para que realmente hablen a donde estás ahora.",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    ageRange: "Rango de Edad",
    gender: "Género",
    stageSituation: "¿Cuál es tu situación de vida?",
    stageDesc: "Elige lo que mejor describe dónde estás en la vida ahora.",
    privacyNote:
      "Tu viaje es privado. Solo usamos estos datos para personalizar tu contenido devocional y nunca se comparte con terceros.",
    trial: "Prueba",
    daysLeft: "días restantes",
    dayLeft: "día restante",
  },
  fr: {
    welcome: "Bienvenue",
    discoverInspiration: "Découvrez l'inspiration quotidienne adaptée pour vous.",
    setUpProfile: "Configurez votre profil",
    selectVerse: "Sélectionnez un Verset ou une Histoire",
    verseOfDay: "Verset du Jour",
    personalized: "Contenu personnalisé pour votre étape de vie.",
    friendlyBreakdown: "Explication Amicale",
    context: "Contexte",
    stories: "Histoires",
    poetry: "Poésie",
    imagery: "Imagerie",
    songs: "Chansons",
    loading: "Chargement...",
    generating: "Préparation de votre expérience",
    profile: "Profil",
    home: "Accueil",
    premium: "Premium",
    language: "Langue",
    save: "Enregistrer et Continuer",
    letsGetToKnow: "Faisons connaissance",
    personalizeDesc:
      "Nous utiliserons ceci pour personnaliser vos dévotions afin qu'elles parlent vraiment à où vous en êtes.",
    fullName: "Nom Complet",
    email: "Adresse Email",
    ageRange: "Tranche d'Âge",
    gender: "Genre",
    stageSituation: "Quelle est votre situation de vie?",
    stageDesc: "Choisissez ce qui décrit le mieux où vous en êtes dans la vie.",
    privacyNote:
      "Votre parcours est privé. Nous n'utilisons ces données que pour personnaliser votre contenu et ne les partageons jamais avec des tiers.",
    trial: "Essai",
    daysLeft: "jours restants",
    dayLeft: "jour restant",
  },
  de: {
    welcome: "Willkommen",
    discoverInspiration: "Entdecke tägliche Inspiration, die nur für dich gemacht ist.",
    setUpProfile: "Profil einrichten",
    selectVerse: "Wähle einen Vers oder eine Geschichte",
    verseOfDay: "Vers des Tages",
    personalized: "Inhalt personalisiert für deine Lebensphase.",
    friendlyBreakdown: "Freundliche Erklärung",
    context: "Kontext",
    stories: "Geschichten",
    poetry: "Poesie",
    imagery: "Bilder",
    songs: "Lieder",
    loading: "Laden...",
    generating: "Dein Erlebnis wird vorbereitet",
    profile: "Profil",
    home: "Startseite",
    premium: "Premium",
    language: "Sprache",
    save: "Speichern & Weiter",
    letsGetToKnow: "Lass uns dich kennenlernen",
    personalizeDesc: "Wir nutzen dies, um deine Andachten zu personalisieren, damit sie wirklich zu dir sprechen.",
    fullName: "Vollständiger Name",
    email: "E-Mail-Adresse",
    ageRange: "Altersbereich",
    gender: "Geschlecht",
    stageSituation: "Was ist deine Lebenssituation?",
    stageDesc: "Wähle, was am besten beschreibt, wo du gerade im Leben stehst.",
    privacyNote:
      "Deine Reise ist privat. Wir nutzen diese Daten nur zur Personalisierung und teilen sie niemals mit Dritten.",
    trial: "Testversion",
    daysLeft: "Tage übrig",
    dayLeft: "Tag übrig",
  },
  pt: {
    welcome: "Bem-vindo",
    discoverInspiration: "Descubra inspiração diária feita especialmente para você.",
    setUpProfile: "Configure seu perfil",
    selectVerse: "Selecione um Versículo ou História",
    verseOfDay: "Versículo do Dia",
    personalized: "Conteúdo personalizado para sua fase de vida.",
    friendlyBreakdown: "Explicação Amigável",
    context: "Contexto",
    stories: "Histórias",
    poetry: "Poesia",
    imagery: "Imagens",
    songs: "Músicas",
    loading: "Carregando...",
    generating: "Preparando sua experiência",
    profile: "Perfil",
    home: "Início",
    premium: "Premium",
    language: "Idioma",
    save: "Salvar e Continuar",
    letsGetToKnow: "Vamos nos conhecer",
    personalizeDesc: "Usaremos isso para personalizar seus devocionais para que falem diretamente com você.",
    fullName: "Nome Completo",
    email: "Endereço de Email",
    ageRange: "Faixa Etária",
    gender: "Gênero",
    stageSituation: "Qual é sua situação de vida?",
    stageDesc: "Escolha o que melhor descreve onde você está na vida agora.",
    privacyNote:
      "Sua jornada é privada. Usamos esses dados apenas para personalizar seu conteúdo e nunca compartilhamos com terceiros.",
    trial: "Teste",
    daysLeft: "dias restantes",
    dayLeft: "dia restante",
  },
  zh: {
    welcome: "欢迎",
    discoverInspiration: "发现专为您量身定制的每日灵感。",
    setUpProfile: "设置您的个人资料",
    selectVerse: "选择经文或故事",
    verseOfDay: "每日经文",
    personalized: "根据您的人生阶段个性化内容。",
    friendlyBreakdown: "友好解读",
    context: "背景",
    stories: "故事",
    poetry: "诗歌",
    imagery: "意象",
    songs: "歌曲",
    loading: "加载中...",
    generating: "正在准备您的体验",
    profile: "个人资料",
    home: "首页",
    premium: "高级版",
    language: "语言",
    save: "保存并继续",
    letsGetToKnow: "让我们了解您",
    personalizeDesc: "我们将用这些信息来个性化您的灵修内容，使其真正与您当前的处境相关。",
    fullName: "全名",
    email: "电子邮件地址",
    ageRange: "年龄范围",
    gender: "性别",
    stageSituation: "您目前的生活状况是什么？",
    stageDesc: "选择最能描述您当前生活状态的选项。",
    privacyNote: "您的旅程是私密的。我们仅使用这些数据来个性化您的灵修内容，绝不与第三方分享。",
    trial: "试用",
    daysLeft: "天剩余",
    dayLeft: "天剩余",
  },
  vi: {
    welcome: "Chào mừng",
    discoverInspiration: "Khám phá cảm hứng hàng ngày dành riêng cho bạn.",
    setUpProfile: "Thiết lập hồ sơ của bạn",
    selectVerse: "Chọn một Câu Kinh Thánh hoặc Câu Chuyện",
    verseOfDay: "Câu Kinh Thánh Hôm Nay",
    personalized: "Nội dung được cá nhân hóa theo giai đoạn cuộc sống của bạn.",
    friendlyBreakdown: "Giải Thích Thân Thiện",
    context: "Bối Cảnh",
    stories: "Câu Chuyện",
    poetry: "Thơ",
    imagery: "Hình Ảnh",
    songs: "Bài Hát",
    loading: "Đang tải...",
    generating: "Đang chuẩn bị trải nghiệm của bạn",
    profile: "Hồ Sơ",
    home: "Trang Chủ",
    premium: "Cao Cấp",
    language: "Ngôn Ngữ",
    save: "Lưu & Tiếp Tục",
    letsGetToKnow: "Hãy để chúng tôi hiểu bạn",
    personalizeDesc: "Chúng tôi sẽ sử dụng thông tin này để cá nhân hóa các bài suy niệm sao cho phù hợp với bạn.",
    fullName: "Họ và Tên",
    email: "Địa Chỉ Email",
    ageRange: "Độ Tuổi",
    gender: "Giới Tính",
    stageSituation: "Tình trạng cuộc sống của bạn là gì?",
    stageDesc: "Chọn điều mô tả đúng nhất vị trí của bạn trong cuộc sống hiện tại.",
    privacyNote:
      "Hành trình của bạn là riêng tư. Chúng tôi chỉ sử dụng dữ liệu này để cá nhân hóa nội dung và không bao giờ chia sẻ với bên thứ ba.",
    trial: "Dùng thử",
    daysLeft: "ngày còn lại",
    dayLeft: "ngày còn lại",
  },
  ko: {
    welcome: "환영합니다",
    discoverInspiration: "당신만을 위한 매일의 영감을 발견하세요.",
    setUpProfile: "프로필 설정",
    selectVerse: "구절 또는 이야기 선택",
    verseOfDay: "오늘의 성경구절",
    personalized: "당신의 인생 단계에 맞춤화된 콘텐츠.",
    friendlyBreakdown: "친근한 해석",
    context: "맥락",
    stories: "이야기",
    poetry: "시",
    imagery: "이미지",
    songs: "노래",
    loading: "로딩 중...",
    generating: "당신의 경험을 준비하고 있습니다",
    profile: "프로필",
    home: "홈",
    premium: "프리미엄",
    language: "언어",
    save: "저장 및 계속",
    letsGetToKnow: "당신을 알아가요",
    personalizeDesc: "이 정보를 사용하여 현재 당신의 상황에 맞는 묵상을 개인화합니다.",
    fullName: "성명",
    email: "이메일 주소",
    ageRange: "연령대",
    gender: "성별",
    stageSituation: "현재 당신의 인생 상황은?",
    stageDesc: "현재 인생에서 당신의 위치를 가장 잘 설명하는 것을 선택하세요.",
    privacyNote: "당신의 여정은 비공개입니다. 이 데이터는 콘텐츠 개인화에만 사용되며 제3자와 공유되지 않습니다.",
    trial: "체험판",
    daysLeft: "일 남음",
    dayLeft: "일 남음",
  },
  th: {
    welcome: "ยินดีต้อนรับ",
    discoverInspiration: "ค้นพบแรงบันดาลใจประจำวันที่ออกแบบมาเพื่อคุณโดยเฉพาะ",
    setUpProfile: "ตั้งค่าโปรไฟล์ของคุณ",
    selectVerse: "เลือกข้อพระคัมภีร์หรือเรื่องราว",
    verseOfDay: "ข้อพระคัมภีร์ประจำวัน",
    personalized: "เนื้อหาที่ปรับให้เหมาะกับช่วงชีวิตของคุณ",
    friendlyBreakdown: "คำอธิบายแบบเป็นมิตร",
    context: "บริบท",
    stories: "เรื่องราว",
    poetry: "บทกวี",
    imagery: "ภาพ",
    songs: "เพลง",
    loading: "กำลังโหลด...",
    generating: "กำลังเตรียมประสบการณ์ของคุณ",
    profile: "โปรไฟล์",
    home: "หน้าแรก",
    premium: "พรีเมียม",
    language: "ภาษา",
    save: "บันทึกและดำเนินการต่อ",
    letsGetToKnow: "มาทำความรู้จักกัน",
    personalizeDesc: "เราจะใช้ข้อมูลนี้เพื่อปรับแต่งการนมัสการให้ตรงกับสถานการณ์ของคุณ",
    fullName: "ชื่อเต็ม",
    email: "ที่อยู่อีเมล",
    ageRange: "ช่วงอายุ",
    gender: "เพศ",
    stageSituation: "สถานการณ์ชีวิตของคุณเป็นอย่างไร?",
    stageDesc: "เลือกสิ่งที่อธิบายตำแหน่งของคุณในชีวิตได้ดีที่สุด",
    privacyNote: "การเดินทางของคุณเป็นส่วนตัว เราใช้ข้อมูลนี้เพื่อปรับแต่งเนื้อหาเท่านั้นและไม่เคยแบ่งปันกับบุคคลที่สาม",
    trial: "ทดลองใช้",
    daysLeft: "วันที่เหลือ",
    dayLeft: "วันที่เหลือ",
  },
}

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
  currentLanguage: Language
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en")

  useEffect(() => {
    const saved = localStorage.getItem("userLanguage")
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setLanguageState(saved as LanguageCode)
    }
  }, [])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem("userLanguage", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key
  }

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
