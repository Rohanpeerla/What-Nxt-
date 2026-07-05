export type Mood =
  | "energetic"
  | "chill"
  | "creative"
  | "social"
  | "productive"
  | "curious"
  | "adventurous"
  | "cozy";

export type TimeSlot = 5 | 15 | 30 | 60 | 180;

export type Idea = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  moods: Mood[];
  minMinutes: TimeSlot;
  indoor: boolean;
  outdoor: boolean;
  solo: boolean;
  social: boolean;
  tags: string[];
  isCustom?: boolean;
};

export const IDEAS: Idea[] = [
  // 5 minutes
  { id: "1", title: "Box breathing reset", description: "Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 8 times and feel your nervous system reboot.", emoji: "🌬️", moods: ["chill", "productive"], minMinutes: 5, indoor: true, outdoor: true, solo: true, social: false, tags: ["mindful", "reset"] },
  { id: "2", title: "Write down 3 wins", description: "Grab any scrap of paper. List 3 small wins from today — you'll be shocked how it shifts your mood.", emoji: "🏆", moods: ["chill", "productive", "curious"], minMinutes: 5, indoor: true, outdoor: true, solo: true, social: false, tags: ["journal", "gratitude"] },
  { id: "3", title: "Text an old friend", description: "Message someone you haven't spoken to in 6+ months. Just: 'Hey, thinking of you 💛'. That's it.", emoji: "💌", moods: ["social", "chill"], minMinutes: 5, indoor: true, outdoor: true, solo: true, social: true, tags: ["connection"] },
  { id: "4", title: "60-second dance party", description: "Play your most embarrassing favorite song. Dance like nobody's watching (they aren't).", emoji: "💃", moods: ["energetic"], minMinutes: 5, indoor: true, outdoor: false, solo: true, social: true, tags: ["fun", "movement"] },
  { id: "5", title: "Cold water splash", description: "Splash your face with cold water for 30 seconds. Instant clarity. Ancient trick, works every time.", emoji: "💧", moods: ["energetic", "productive"], minMinutes: 5, indoor: true, outdoor: false, solo: true, social: false, tags: ["reset"] },
  { id: "6", title: "Learn one weird word", description: "Open a dictionary or Wiktionary's random page. Learn a word. Try to use it today.", emoji: "📖", moods: ["curious", "creative"], minMinutes: 5, indoor: true, outdoor: true, solo: true, social: false, tags: ["learn"] },

  // 15 minutes
  { id: "7", title: "Neighborhood micro-adventure", description: "Walk in a direction you never go. Notice 5 things you've never noticed before. Photograph one.", emoji: "🚶", moods: ["curious", "adventurous", "chill"], minMinutes: 15, indoor: false, outdoor: true, solo: true, social: true, tags: ["walk", "explore"] },
  { id: "8", title: "Brain dump on paper", description: "Set a timer for 15 min. Write every single thought in your head. Don't stop. Don't edit. Freedom.", emoji: "🧠", moods: ["productive", "creative"], minMinutes: 15, indoor: true, outdoor: true, solo: true, social: false, tags: ["journal"] },
  { id: "9", title: "Doodle your feelings", description: "No skill required. Grab a pen and draw shapes that match how you feel right now. Weirdly therapeutic.", emoji: "🎨", moods: ["creative", "chill"], minMinutes: 15, indoor: true, outdoor: true, solo: true, social: false, tags: ["art"] },
  { id: "10", title: "Tidy one square meter", description: "Pick ONE small area — a drawer, your desk, one shelf. Make it beautiful. Momentum from there.", emoji: "✨", moods: ["productive", "cozy"], minMinutes: 15, indoor: true, outdoor: false, solo: true, social: false, tags: ["home"] },
  { id: "11", title: "Learn a magic trick", description: "YouTube 'easy card trick'. Learn one. Perform it on the next human you see. Instant delight.", emoji: "🎩", moods: ["creative", "social", "curious"], minMinutes: 15, indoor: true, outdoor: true, solo: true, social: true, tags: ["skill", "fun"] },
  { id: "12", title: "Stretch it out", description: "Follow a 15-min yoga flow on YouTube. Your future body will send thank-you letters.", emoji: "🧘", moods: ["chill", "energetic"], minMinutes: 15, indoor: true, outdoor: true, solo: true, social: false, tags: ["movement"] },

  // 30 minutes
  { id: "13", title: "Cook something new", description: "Pick a recipe with ingredients you already have. Bonus points if you've never tried the cuisine.", emoji: "🍳", moods: ["creative", "cozy", "curious"], minMinutes: 30, indoor: true, outdoor: false, solo: true, social: true, tags: ["food"] },
  { id: "14", title: "Podcast + walk combo", description: "Queue up a podcast episode you've been meaning to hear. Walk while listening. Double win.", emoji: "🎧", moods: ["chill", "curious", "energetic"], minMinutes: 30, indoor: false, outdoor: true, solo: true, social: false, tags: ["walk", "learn"] },
  { id: "15", title: "Write a letter you'll never send", description: "To your past self, future self, or someone you're stuck on. No filter. Burn it or save it.", emoji: "📝", moods: ["creative", "chill"], minMinutes: 30, indoor: true, outdoor: true, solo: true, social: false, tags: ["journal"] },
  { id: "16", title: "Deep-clean one room", description: "Pick a room. Put on loud music. Attack it. In 30 min you'll have a whole new environment.", emoji: "🧹", moods: ["productive", "energetic"], minMinutes: 30, indoor: true, outdoor: false, solo: true, social: false, tags: ["home"] },
  { id: "17", title: "Sketch a stranger's story", description: "Sit somewhere public. Pick one person. Invent their entire life story. Write it down.", emoji: "👀", moods: ["creative", "curious"], minMinutes: 30, indoor: true, outdoor: true, solo: true, social: false, tags: ["writing"] },
  { id: "18", title: "Board game or puzzle", description: "Solo puzzle or grab a person. 30 min of screenless play beats hours of scrolling.", emoji: "🧩", moods: ["cozy", "social", "chill"], minMinutes: 30, indoor: true, outdoor: false, solo: true, social: true, tags: ["play"] },
  { id: "19", title: "Try a HIIT workout", description: "20-min high-intensity session. You'll feel like a superhero for the rest of the day.", emoji: "🔥", moods: ["energetic"], minMinutes: 30, indoor: true, outdoor: true, solo: true, social: false, tags: ["fitness"] },

  // 60 minutes
  { id: "20", title: "Coffee shop mission", description: "Find a café you've never been to. Bring a notebook. Order something you can't pronounce.", emoji: "☕", moods: ["chill", "adventurous", "creative"], minMinutes: 60, indoor: false, outdoor: true, solo: true, social: true, tags: ["explore"] },
  { id: "21", title: "Start that side project", description: "The one you keep thinking about. Open a blank doc. Write the first ugly draft of anything.", emoji: "🚀", moods: ["productive", "creative"], minMinutes: 60, indoor: true, outdoor: false, solo: true, social: false, tags: ["build"] },
  { id: "22", title: "Cook a proper meal", description: "Not just food — an experience. Set the table. Light a candle. Even if you're eating alone.", emoji: "🍝", moods: ["cozy", "creative"], minMinutes: 60, indoor: true, outdoor: false, solo: true, social: true, tags: ["food"] },
  { id: "23", title: "Bike ride nowhere in particular", description: "Just go. Turn where it looks interesting. Get a little lost. Come back with a story.", emoji: "🚴", moods: ["adventurous", "energetic"], minMinutes: 60, indoor: false, outdoor: true, solo: true, social: true, tags: ["outdoors"] },
  { id: "24", title: "Read a real book", description: "Phone in another room. One hour with a physical book. Notice how time slows down.", emoji: "📚", moods: ["cozy", "chill", "curious"], minMinutes: 60, indoor: true, outdoor: true, solo: true, social: false, tags: ["read"] },
  { id: "25", title: "Learn the basics of anything", description: "Pick a topic that's mystified you — quantum physics, sourdough, chess openings. Just start.", emoji: "🎓", moods: ["curious", "productive"], minMinutes: 60, indoor: true, outdoor: true, solo: true, social: false, tags: ["learn"] },
  { id: "26", title: "Call someone you love", description: "Not text. Not video. Just voice. 45 minutes with someone who matters. Watch what happens.", emoji: "📞", moods: ["social", "cozy"], minMinutes: 60, indoor: true, outdoor: true, solo: true, social: true, tags: ["connection"] },

  // 3 hours+
  { id: "27", title: "Day-trip somewhere close", description: "Google 'best day trips near me'. Pick one. Leave in the next hour. Be back by dinner.", emoji: "🗺️", moods: ["adventurous", "curious"], minMinutes: 180, indoor: false, outdoor: true, solo: true, social: true, tags: ["travel"] },
  { id: "28", title: "Cook a 3-course meal for friends", description: "Invite 2-3 people. Make appetizer, main, dessert. The best evenings start with 'want to come over?'", emoji: "🍷", moods: ["social", "cozy", "creative"], minMinutes: 180, indoor: true, outdoor: false, solo: false, social: true, tags: ["food", "connection"] },
  { id: "29", title: "Museum wander", description: "No agenda. Walk slowly. Stop only at things that grab you. Skip the rest guilt-free.", emoji: "🏛️", moods: ["curious", "chill", "creative"], minMinutes: 180, indoor: true, outdoor: false, solo: true, social: true, tags: ["culture"] },
  { id: "30", title: "Hike to a viewpoint", description: "Look up a trail with an epic view. Bring snacks. Take the long way. Sunset bonus if you can time it.", emoji: "⛰️", moods: ["adventurous", "energetic", "chill"], minMinutes: 180, indoor: false, outdoor: true, solo: true, social: true, tags: ["nature"] },
  { id: "31", title: "Movie marathon, done right", description: "Pick a trilogy or director. Pillows, snacks, dim lights, phone away. Full immersion mode.", emoji: "🎬", moods: ["cozy", "chill"], minMinutes: 180, indoor: true, outdoor: false, solo: true, social: true, tags: ["chill"] },
  { id: "32", title: "Build something with your hands", description: "IKEA furniture, a birdhouse, terrarium, a Lego set. Anything physical. Screens off, tools out.", emoji: "🔨", moods: ["creative", "productive", "cozy"], minMinutes: 180, indoor: true, outdoor: true, solo: true, social: true, tags: ["build"] },
  { id: "33", title: "Volunteer for a few hours", description: "Food bank, animal shelter, park cleanup. Search now, go today. Nothing beats it.", emoji: "🤝", moods: ["social", "productive"], minMinutes: 180, indoor: true, outdoor: true, solo: true, social: true, tags: ["give"] },

  // extra sprinkle
  { id: "34", title: "Photo walk challenge", description: "30 min, one theme (red things, doors, shadows). Come back with 10 photos. Post your favorite.", emoji: "📸", moods: ["creative", "curious"], minMinutes: 30, indoor: false, outdoor: true, solo: true, social: true, tags: ["art"] },
  { id: "35", title: "Learn 5 phrases in a new language", description: "Pick a language. Duolingo or YouTube. Say them out loud. Tomorrow-you will feel classy.", emoji: "🌍", moods: ["curious", "productive"], minMinutes: 15, indoor: true, outdoor: true, solo: true, social: false, tags: ["learn"] },
  { id: "36", title: "Make a killer playlist", description: "Theme it: 'songs for driving at night', 'main character energy', 'crying in the shower'. Share it.", emoji: "🎵", moods: ["creative", "chill"], minMinutes: 30, indoor: true, outdoor: true, solo: true, social: true, tags: ["music"] },
  { id: "37", title: "Rearrange your space", description: "Move the couch. Rotate the desk. Swap the wall art. New room, same rent.", emoji: "🛋️", moods: ["creative", "productive", "cozy"], minMinutes: 60, indoor: true, outdoor: false, solo: true, social: false, tags: ["home"] },
  { id: "38", title: "Do the thing you've been avoiding", description: "You know exactly what it is. 15 min, no distractions. Start. That's the whole task.", emoji: "⚡", moods: ["productive"], minMinutes: 15, indoor: true, outdoor: true, solo: true, social: false, tags: ["focus"] },
  { id: "39", title: "Compliment 3 strangers", description: "Genuine, specific compliments. Watch faces light up. You'll feel amazing too. Chain reaction.", emoji: "🌟", moods: ["social", "energetic"], minMinutes: 15, indoor: true, outdoor: true, solo: true, social: true, tags: ["kindness"] },
  { id: "40", title: "Plan your dream trip", description: "Even if you can't go yet. Pick a place, map it, list what you'd do. Manifestation mode: ON.", emoji: "✈️", moods: ["curious", "creative", "cozy"], minMinutes: 30, indoor: true, outdoor: true, solo: true, social: true, tags: ["dream"] },
  { id: "41", title: "Handwrite a thank-you note", description: "Actual paper. Actual pen. Mail it. Nobody does this anymore. That's exactly why it hits so hard.", emoji: "✉️", moods: ["cozy", "social"], minMinutes: 15, indoor: true, outdoor: true, solo: true, social: false, tags: ["kindness"] },
  { id: "42", title: "Sunset watching", description: "Find the best west-facing spot near you. Show up 20 min early. No phone. Just watch.", emoji: "🌅", moods: ["chill", "cozy"], minMinutes: 30, indoor: false, outdoor: true, solo: true, social: true, tags: ["nature"] },
  { id: "43", title: "Try 10 min of meditation", description: "Insight Timer or Calm. Just sit. Notice the thoughts. Let them pass. It's a superpower in training.", emoji: "🕉️", moods: ["chill"], minMinutes: 15, indoor: true, outdoor: true, solo: true, social: false, tags: ["mindful"] },
  { id: "44", title: "Bake something", description: "Cookies, banana bread, focaccia. Your kitchen will smell like a hug for the rest of the day.", emoji: "🍪", moods: ["cozy", "creative"], minMinutes: 60, indoor: true, outdoor: false, solo: true, social: true, tags: ["food"] },
  { id: "45", title: "Journal a hard question", description: "'What am I avoiding?' or 'What would I do if I couldn't fail?' Write for 20 minutes. See what surfaces.", emoji: "🔍", moods: ["chill", "curious", "productive"], minMinutes: 30, indoor: true, outdoor: true, solo: true, social: false, tags: ["journal"] },
  { id: "46", title: "Random acts of chaos (good kind)", description: "Leave a $5 bill in a library book. Chalk a compliment on a sidewalk. Small mystery, big joy.", emoji: "🎁", moods: ["creative", "social", "adventurous"], minMinutes: 30, indoor: false, outdoor: true, solo: true, social: true, tags: ["kindness"] },
  { id: "47", title: "Sing loudly in the car/shower", description: "Full send. Wrong lyrics allowed. Bad voice mandatory. Endorphins guaranteed.", emoji: "🎤", moods: ["energetic"], minMinutes: 5, indoor: true, outdoor: false, solo: true, social: false, tags: ["fun"] },
  { id: "48", title: "Watch a documentary", description: "Pick one about something you know nothing about. In 90 min you'll have a new obsession.", emoji: "🎥", moods: ["curious", "chill", "cozy"], minMinutes: 180, indoor: true, outdoor: false, solo: true, social: true, tags: ["learn"] },
];

export const MOODS: { key: Mood; label: string; emoji: string; color: string }[] = [
  { key: "energetic", label: "Energetic", emoji: "⚡", color: "from-orange-400 to-red-500" },
  { key: "chill", label: "Chill", emoji: "🌊", color: "from-cyan-400 to-blue-500" },
  { key: "creative", label: "Creative", emoji: "🎨", color: "from-pink-400 to-purple-500" },
  { key: "social", label: "Social", emoji: "🫂", color: "from-yellow-400 to-orange-500" },
  { key: "productive", label: "Productive", emoji: "🎯", color: "from-emerald-400 to-teal-500" },
  { key: "curious", label: "Curious", emoji: "🔭", color: "from-indigo-400 to-violet-500" },
  { key: "adventurous", label: "Adventurous", emoji: "🧭", color: "from-lime-400 to-green-500" },
  { key: "cozy", label: "Cozy", emoji: "🕯️", color: "from-amber-400 to-rose-500" },
];

export const TIME_OPTIONS: { value: TimeSlot; label: string }[] = [
  { value: 5, label: "5 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 180, label: "3+ hours" },
];

export type VibePack = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  moods: Mood[];
  time: TimeSlot;
  location: "any" | "indoor" | "outdoor";
  company: "any" | "solo" | "social";
  bgGradient: string;
};

export const VIBE_PACKS: VibePack[] = [
  {
    id: "desk-break",
    title: "Bored at Desk",
    emoji: "💻",
    description: "5–15 min indoor reset without leaving your room",
    moods: ["chill", "productive"],
    time: 15,
    location: "indoor",
    company: "solo",
    bgGradient: "from-blue-600 to-indigo-700",
  },
  {
    id: "screen-free",
    title: "Screen-Free Evening",
    emoji: "🕯️",
    description: "Unplug, recharge, and do something tangible",
    moods: ["cozy", "creative", "chill"],
    time: 60,
    location: "any",
    company: "any",
    bgGradient: "from-amber-600 to-rose-700",
  },
  {
    id: "dopamine-hit",
    title: "Quick Dopamine Reset",
    emoji: "⚡",
    description: "Fast 5-min energy boosters when feeling sluggish",
    moods: ["energetic"],
    time: 5,
    location: "any",
    company: "solo",
    bgGradient: "from-orange-500 to-red-600",
  },
  {
    id: "rainy-day",
    title: "Rainy Sunday",
    emoji: "🌧️",
    description: "Cozy indoor projects and comforting vibes",
    moods: ["cozy", "creative", "curious"],
    time: 180,
    location: "indoor",
    company: "any",
    bgGradient: "from-teal-600 to-cyan-700",
  },
  {
    id: "social-recharge",
    title: "Social Connection",
    emoji: "🫂",
    description: "Reach out, share joy, and feel connected",
    moods: ["social"],
    time: 30,
    location: "any",
    company: "social",
    bgGradient: "from-fuchsia-600 to-pink-700",
  },
];

export function getDailyQuest(allIdeas: Idea[]): Idea {
  const todayStr = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = (hash << 5) - hash + todayStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % allIdeas.length;
  return allIdeas[index] || allIdeas[0];
}
