/* (03) — Selected Work. Two card shapes share one reel:
   `feature` = an orb + copy, `site` = a browser mock + meta. */

const MicIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
    <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff" stroke="none" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <line x1="12" y1="18" x2="12" y2="22" />
  </svg>
);

const BookIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export const workProjects = [
  {
    type: "feature",
    id: "orvyn",
    href: "https://github.com/SAMEER-KHAN-1/Orvyn-AI/releases",
    openLabel: "GitHub Release",
    icon: MicIcon,
    kicker: "01 — Featured · Android AI",
    title: "Orvyn",
    titleEm: "AI",
    desc: "A voice-controlled Android assistant that runs tasks from natural speech — open apps, fetch info, trigger system actions. Built with integrated speech-to-text and text-to-speech for smooth, hands-free interaction.",
    tags: ["Android", "Java", "Kotlin", "Speech-to-Text", "TTS"],
  },
  {
    type: "feature",
    id: "lecture",
    href: "https://github.com/SAMEER-KHAN-1/Lecture.ai",
    openLabel: "GitHub",
    icon: BookIcon,
    orbStyle: { background: "radial-gradient(circle at 38% 32%,#c7b3ff,#b06bff 45%,#5a2f9f 100%)" },
    kicker: "02 — Featured · Web AI",
    title: "Lecture",
    titleEm: "AI",
    desc: "A web app that turns audio into structured notes — key points, summaries, and practice questions. Uses Whisper for transcription and Phi-3 for on-device content processing.",
    tags: ["Web", "Whisper", "Phi-3", "LLMs", "Python"],
  },
  {
    type: "site",
    id: "dermatology",
    href: "https://venerable-raindrop-d3be66.netlify.app/",
    openLabel: "Open live site",
    url: "linwood-dermatology.app",
    img: "/images/thumb-dermatology.jpg",
    alt: "Dermatology clinic website preview",
    title: "Dermatology Clinic",
    cat: "Healthcare",
    desc: "A clean, trust-building site for a skin clinic — services, treatments, and an easy path to booking.",
  },
  {
    type: "site",
    id: "furniture",
    href: "https://cool-duckanoo-d14eed.netlify.app/",
    openLabel: "Open live site",
    url: "norda-furniture.app",
    img: "/images/thumb-furniture.jpg",
    alt: "Furniture store website preview",
    title: "Furniture Store",
    cat: "E-commerce",
    desc: "An e-commerce storefront for a modern furniture brand — rich product imagery and a smooth browse-to-cart flow.",
  },
  {
    type: "site",
    id: "pediatric",
    href: "https://whimsical-blancmange-1101fe.netlify.app/",
    openLabel: "Open live site",
    url: "wonderyears-pediatric.app",
    img: "/images/thumb-pediatric.jpg",
    alt: "Pediatric clinic website preview",
    title: "Pediatric Clinic",
    cat: "Healthcare",
    desc: "A warm, friendly site for a children's clinic — services, care info, and simple parent-facing booking.",
  },
  {
    type: "site",
    id: "frootza",
    href: "https://fabulous-marigold-40bbcb.netlify.app/",
    openLabel: "Open live site",
    url: "frootza.app",
    img: "/images/thumb-frootza.jpg",
    alt: "Frootza grocery & food delivery website preview",
    title: "Frootza — Moradabad",
    cat: "Grocery & Food Delivery",
    desc: "A live grocery & food-delivery web app for Moradabad — 30-minute delivery, category browsing, and WhatsApp ordering. A real, working product.",
  },
];
