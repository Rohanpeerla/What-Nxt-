import { useState, useRef, useEffect } from "react";
import { IDEAS, type Idea } from "../data/ideas";
import { cn } from "../utils/cn";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  suggestedIdeas?: Idea[];
  timestamp: string;
}

interface ChatCoachProps {
  onStartTimer: (idea: Idea) => void;
  onAddCustomIdea: (idea: Idea) => void;
  onFavorite: (ideaId: string) => void;
  favorites: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    sender: "bot",
    text: "Hey there! 👋 I'm your AI Vibe Coach. Tell me how you're feeling right now, how much time you have, or what kind of energy you want to cultivate. Let's find your next great moment!",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
];

const QUICK_PROMPTS = [
  "🧠 I'm exhausted after a long meeting",
  "🕯️ I want a screen-free evening idea",
  "⚡ Give me a 5-minute energy booster",
  "🎨 Something creative and weird",
  "🫂 A fun activity to do with a friend",
];

export function ChatCoach({ onStartTimer, onAddCustomIdea, onFavorite, favorites }: ChatCoachProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  
  // Optional OpenAI key setting
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("whatnext:openai_key") || "");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("whatnext:openai_key", apiKey);
    setShowSettings(false);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);
    scrollToBottom();

    // Check if user has API key for real GPT response, otherwise use intelligent local coach engine
    if (apiKey.trim().startsWith("sk-")) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are an empathetic, enthusiastic AI Lifestyle Coach. Suggest 1 or 2 specific, actionable, creative things the user should do next based on their message. Keep your tone encouraging and concise. Format any activity suggestion clearly with an emoji.",
              },
              ...messages.map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
              { role: "user", content: text.trim() },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const botReplyText = data.choices[0]?.message?.content || "Here is a great idea for you!";
          
          // Match against existing ideas or create dynamic suggestions
          const matched = findMatchingIdeas(text);
          
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                sender: "bot",
                text: botReplyText,
                suggestedIdeas: matched.slice(0, 2),
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
            setIsTyping(false);
            if (!isOpen) setUnreadCount((c) => c + 1);
          }, 600);
          return;
        }
      } catch (err) {
        console.warn("OpenAI API error, falling back to smart local coach:", err);
      }
    }

    // Default: Smart Local NLP Coach Engine
    setTimeout(() => {
      const { replyText, suggestions } = generateSmartBotResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: replyText,
          suggestedIdeas: suggestions,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
      if (!isOpen) setUnreadCount((c) => c + 1);
    }, 800);
  };

  return (
    <>
      {/* Floating Toggle Button - Hidden when chat is open for maximum screen space */}
      {!isOpen && (
        <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6">
          {unreadCount > 0 && (
            <div className="animate-bounce rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-violet-900/50">
              💬 AI Coach: What's your vibe?
            </div>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 text-2xl text-white shadow-2xl animate-pulse transition-all duration-300 hover:scale-110 active:scale-95"
            title="Open AI Vibe Coach"
          >
            💬
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat Window / Drawer - Perfectly sized and positioned for mobile and desktop */}
      {isOpen && (
        <div className="fixed right-3 bottom-3 z-50 flex h-[calc(100vh-1.5rem)] max-h-[580px] w-[calc(100vw-1.5rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-slate-900/98 shadow-2xl backdrop-blur-xl animate-[fadeInUp_0.2s_ease-out] sm:right-6 sm:bottom-6 sm:max-w-[420px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg shadow">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">AI Vibe Coach</span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-slate-400">
                  {apiKey ? "⚡ GPT-4 Connected" : "🧠 Smart Coach Engine"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                title="AI Settings / API Key"
              >
                ⚙️
              </button>
              <button
                onClick={() => setMessages(INITIAL_MESSAGES)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                title="Clear Chat"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Settings Drawer */}
          {showSettings && (
            <form
              onSubmit={handleSaveApiKey}
              className="border-b border-white/10 bg-slate-950/90 p-4 text-xs animate-[fadeInDown_0.2s_ease-out]"
            >
              <div className="mb-2 font-semibold text-violet-300">⚙️ Optional OpenAI API Key</div>
              <p className="mb-2.5 text-[11px] text-slate-400">
                By default, this chat uses an ultra-fast built-in smart AI engine. If you want live OpenAI GPT responses, paste your API key below (stored locally on your device).
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 rounded-xl border border-white/15 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-3 py-1.5 font-bold text-white hover:bg-violet-500"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Message List */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex flex-col", m.sender === "user" ? "items-end" : "items-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md",
                    m.sender === "user"
                      ? "rounded-tr-none bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                      : "rounded-tl-none border border-white/10 bg-white/5 text-slate-200"
                  )}
                >
                  <div>{m.text}</div>
                  <div
                    className={cn(
                      "mt-1 text-[10px] opacity-60",
                      m.sender === "user" ? "text-right" : "text-left"
                    )}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {/* Suggested Idea Cards embedded in chat */}
                {m.suggestedIdeas && m.suggestedIdeas.length > 0 && (
                  <div className="mt-2.5 w-full max-w-[92%] space-y-2">
                    {m.suggestedIdeas.map((idea) => (
                      <div
                        key={idea.id}
                        className="overflow-hidden rounded-2xl border border-violet-500/30 bg-slate-950/80 p-3.5 shadow-lg transition hover:border-violet-500/60"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{idea.emoji}</span>
                            <div>
                              <div className="font-bold text-white text-sm">{idea.title}</div>
                              <div className="text-[11px] text-violet-300">⏱ {idea.minMinutes} min · {idea.indoor ? "🏠 Indoor" : "🌳 Outdoor"}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => onFavorite(idea.id)}
                            className="text-base transition hover:scale-125"
                            title="Save favorite"
                          >
                            {favorites.includes(idea.id) ? "❤️" : "🤍"}
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-slate-300">{idea.description}</p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => {
                              onStartTimer(idea);
                              setIsOpen(false);
                            }}
                            className="flex-1 rounded-xl bg-violet-600 py-1.5 text-center text-xs font-bold text-white hover:bg-violet-500"
                          >
                            ▶️ Start Timer
                          </button>
                          {!IDEAS.some((i) => i.id === idea.id) && (
                            <button
                              onClick={() => onAddCustomIdea(idea)}
                              className="rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                              title="Add to My Custom Ideas"
                            >
                              ➕ Save Idea
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 w-max">
                <span>🤖 Thinking</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" />
                <span className="flex h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                <span className="flex h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Starter Chips */}
          <div className="flex gap-1.5 overflow-x-auto border-t border-white/5 bg-slate-950/50 px-3 py-2 no-scrollbar">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.slice(3))}
                className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300 transition hover:border-violet-500/40 hover:bg-white/10 hover:text-white"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-slate-950 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for an idea, e.g. 'Stressed after work'..."
              className="flex-1 rounded-2xl border border-white/15 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// Helper: Find matching existing ideas based on user keywords
function findMatchingIdeas(query: string): Idea[] {
  const q = query.toLowerCase();
  const scored = IDEAS.map((idea) => {
    let score = 0;
    if (idea.title.toLowerCase().includes(q)) score += 5;
    if (idea.description.toLowerCase().includes(q)) score += 3;
    idea.tags.forEach((t) => {
      if (q.includes(t)) score += 4;
    });
    idea.moods.forEach((m) => {
      if (q.includes(m)) score += 3;
    });
    if (q.includes("5 min") || q.includes("quick") || q.includes("short")) {
      if (idea.minMinutes <= 15) score += 4;
    }
    if (q.includes("hour") || q.includes("long") || q.includes("movie")) {
      if (idea.minMinutes >= 60) score += 4;
    }
    if (q.includes("friend") || q.includes("social") || q.includes("partner") || q.includes("people")) {
      if (idea.social) score += 4;
    }
    if (q.includes("outside") || q.includes("walk") || q.includes("sun") || q.includes("nature")) {
      if (idea.outdoor) score += 4;
    }
    return { idea, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((item) => item.score > 0).map((item) => item.idea);
}

// Helper: Intelligent local bot conversational engine
function generateSmartBotResponse(query: string): { replyText: string; suggestions: Idea[] } {
  const q = query.toLowerCase();
  let replyText = "I hear you! Based on your vibe right now, here are a couple of fantastic ideas that will hit the spot:";
  let matched = findMatchingIdeas(query);

  if (q.includes("exhausted") || q.includes("tired") || q.includes("work") || q.includes("meeting") || q.includes("stress")) {
    replyText = "Sounds like your nervous system needs a gentle reboot! Don't push yourself too hard right now. Let's do something restorative that doesn't require high energy:";
    if (matched.length === 0) {
      matched = IDEAS.filter((i) => i.moods.includes("chill") || i.tags.includes("reset"));
    }
  } else if (q.includes("bored") || q.includes("nothing") || q.includes("fun") || q.includes("exciting") || q.includes("surprise")) {
    replyText = "Boredom is just creative energy waiting for a spark! ⚡ Let's shake things up with something adventurous or slightly unexpected:";
    if (matched.length === 0) {
      matched = IDEAS.filter((i) => i.moods.includes("adventurous") || i.moods.includes("energetic"));
    }
  } else if (q.includes("screen") || q.includes("phone") || q.includes("scroll") || q.includes("digital")) {
    replyText = "Stepping away from screens is the ultimate life hack! Here are tangible, hands-on experiences to ground you in the real world:";
    if (matched.length === 0) {
      matched = IDEAS.filter((i) => i.indoor || i.outdoor).slice(10, 14);
    }
  } else if (q.includes("friend") || q.includes("partner") || q.includes("social") || q.includes("couple") || q.includes("date")) {
    replyText = "Shared experiences build the best memories! Here is a great activity to connect and share some laughs together:";
    if (matched.length === 0) {
      matched = IDEAS.filter((i) => i.social);
    }
  } else if (q.includes("creative") || q.includes("art") || q.includes("write") || q.includes("make") || q.includes("draw")) {
    replyText = "Time to let your imagination flow! Remember, perfection isn't the goal—just expressing yourself is therapeutic:";
    if (matched.length === 0) {
      matched = IDEAS.filter((i) => i.moods.includes("creative"));
    }
  }

  // If still no direct match, grab random top picks
  if (matched.length === 0) {
    const shuffled = [...IDEAS].sort(() => 0.5 - Math.random());
    matched = shuffled.slice(0, 2);
  }

  return {
    replyText,
    suggestions: matched.slice(0, 2),
  };
}
