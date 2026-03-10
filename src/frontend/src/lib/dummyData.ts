export function generateCaptions(idea: string) {
  const topic = idea.trim() || "your brand";
  return [
    {
      type: "Short Version",
      emoji: "⚡",
      description: "Punchy and direct — perfect for quick scrollers",
      text: `✨ ${topic} — curated just for you. Shop the look now before it sells out. Limited drops only. 🛍️ Link in bio.`,
    },
    {
      type: "Story Version",
      emoji: "📖",
      description: "Narrative-driven — builds emotional connection",
      text: `Every great story starts with a single step. Our ${topic} collection is the beginning of yours. Crafted for those who dare to stand out, these pieces are more than clothing — they're a statement. Swipe up to explore the full range. ✨`,
    },
    {
      type: "Engagement Version",
      emoji: "🔥",
      description: "Conversation-starting — drives comments and shares",
      text: `Which look is YOUR favorite? 👇 Drop a 🔥 for the bold choice or ❤️ for the classic! Our ${topic} drop is LIVE and selling fast. Tag a friend who needs to see this! 🙌`,
    },
  ];
}

export function generateHashtags(idea: string) {
  const words = idea.trim().split(/\s+/).filter(Boolean);
  const capitalized = words.map(
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
  );
  const joined = capitalized.join("");
  const first = capitalized[0] || "Brand";

  return {
    trending: [
      `#${joined}`,
      "#OOTD",
      "#FashionInspo",
      "#NewDrop",
      "#StyleGoals",
    ],
    niche: [
      `#${first}Aesthetic`,
      `#${joined}Vibes`,
      "#ContentCreator",
      `#${first}Community`,
      "#MicroInfluencer",
    ],
    brand: ["#AECLO", "#AECLOStyle", "#AECLODrop"],
  };
}

export function generateOptimizedCaption(
  original: string,
  idea: string,
): string {
  return `${original}\n\n🚀 Ready to elevate your ${idea.trim()} game? Tap the link in our bio for exclusive access. Limited time — don't miss out! 👉 Save this post for later inspiration. Follow us for daily drops that define the culture. 💫`;
}

export const SCHEDULE_SLOTS = [
  {
    label: "Tuesday, 9:00 AM",
    sublabel: "High engagement window — morning commute",
    value: "2026-03-10T09:00:00Z",
    badge: "Best",
  },
  {
    label: "Wednesday, 6:30 PM",
    sublabel: "Peak hours — post-work browsing spike",
    value: "2026-03-11T18:30:00Z",
    badge: "Popular",
  },
  {
    label: "Friday, 12:00 PM",
    sublabel: "Lunch scroll — strong on Fridays",
    value: "2026-03-13T12:00:00Z",
    badge: "Good",
  },
];

export const DUMMY_POSTS = [
  {
    id: 1n,
    idea: "Summer streetwear collection",
    platform: "Instagram",
    status: "published",
    scheduledAt: "2026-03-01T09:00:00Z",
    selectedCaption:
      "✨ Summer streetwear — curated just for you. Shop the look now!",
    optimizedCaption: "",
    hashtags: ["#SummerFashion", "#OOTD", "#StreetStyle"],
    createdAt: 1740000000000n,
    analytics: {
      likes: 234n,
      comments: 47n,
      shares: 89n,
      reach: 4200n,
      engagementRate: 8.8,
    },
    owner: "" as any,
  },
  {
    id: 2n,
    idea: "Winter hoodie drop",
    platform: "Both",
    status: "scheduled",
    scheduledAt: "2026-03-12T18:30:00Z",
    selectedCaption: "The hoodie drop you've been waiting for. 🧥",
    optimizedCaption: "",
    hashtags: ["#WinterFashion", "#HoodieSeason"],
    createdAt: 1740100000000n,
    analytics: {
      likes: 0n,
      comments: 0n,
      shares: 0n,
      reach: 0n,
      engagementRate: 0,
    },
    owner: "" as any,
  },
  {
    id: 3n,
    idea: "Spring florals lookbook",
    platform: "Facebook",
    status: "draft",
    scheduledAt: undefined,
    selectedCaption: "",
    optimizedCaption: "",
    hashtags: [],
    createdAt: 1740200000000n,
    analytics: {
      likes: 0n,
      comments: 0n,
      shares: 0n,
      reach: 0n,
      engagementRate: 0,
    },
    owner: "" as any,
  },
  {
    id: 4n,
    idea: "Collab with local artists",
    platform: "Instagram",
    status: "published",
    scheduledAt: "2026-02-20T12:00:00Z",
    selectedCaption: "Art meets fashion. Meet our local artist collab drop. 🎨",
    optimizedCaption: "",
    hashtags: ["#ArtFashion", "#Collab", "#LocalArtist"],
    createdAt: 1739900000000n,
    analytics: {
      likes: 512n,
      comments: 93n,
      shares: 145n,
      reach: 8700n,
      engagementRate: 12.1,
    },
    owner: "" as any,
  },
  {
    id: 5n,
    idea: "Limited edition varsity jacket",
    platform: "Both",
    status: "scheduled",
    scheduledAt: "2026-03-14T09:00:00Z",
    selectedCaption: "The varsity jacket that defines the season. 🏆",
    optimizedCaption: "",
    hashtags: ["#VarsityJacket", "#LimitedEdition"],
    createdAt: 1740300000000n,
    analytics: {
      likes: 0n,
      comments: 0n,
      shares: 0n,
      reach: 0n,
      engagementRate: 0,
    },
    owner: "" as any,
  },
  {
    id: 6n,
    idea: "Behind the scenes design process",
    platform: "Instagram",
    status: "published",
    scheduledAt: "2026-02-25T18:00:00Z",
    selectedCaption:
      "Go behind the seams. Watch how we design for the culture. 🧵",
    optimizedCaption: "",
    hashtags: ["#BTS", "#DesignProcess", "#Fashion"],
    createdAt: 1739800000000n,
    analytics: {
      likes: 389n,
      comments: 62n,
      shares: 110n,
      reach: 6300n,
      engagementRate: 9.7,
    },
    owner: "" as any,
  },
];

export const ENGAGEMENT_DATA = [
  { day: "Mon", likes: 120, comments: 34, shares: 45 },
  { day: "Tue", likes: 180, comments: 52, shares: 67 },
  { day: "Wed", likes: 145, comments: 41, shares: 53 },
  { day: "Thu", likes: 220, comments: 78, shares: 92 },
  { day: "Fri", likes: 310, comments: 95, shares: 134 },
  { day: "Sat", likes: 280, comments: 83, shares: 110 },
  { day: "Sun", likes: 195, comments: 59, shares: 76 },
];
