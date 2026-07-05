import { useEffect, useMemo, useState, useRef } from "react";
import confetti from "canvas-confetti";
import {
  IDEAS,
  MOODS,
  TIME_OPTIONS,
  VIBE_PACKS,
  getDailyQuest,
  type Idea,
  type Mood,
  type TimeSlot,
  type VibePack,
} from "./data/ideas";
import { cn } from "./utils/cn";
import { ActivityTimer } from "./components/ActivityTimer";
import { CustomIdeaModal } from "./components/CustomIdeaModal";

type Location = "any" | "indoor" | "outdoor";
type Company = "any" | "solo" | "social";

const FAV_KEY = "whatnext:favorites";
const HISTORY_KEY = "whatnext:history";
const CUSTOM_KEY = "whatnext:custom_ideas";
const COMPLETED_KEY = "whatnext:completed_count";

export default function App() {
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [time, setTime] = useState<TimeSlot>(30);
  const [location, setLocation] = useState<Location>("any");
  const [company, setCompany] = useState<Company>("any");
  const [current, setCurrent] = useState<Idea | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customIdeas, setCustomIdeas] = useState<Idea[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const ideaCardRef = useRef<HTMLDivElement>(null);
  
  // Modals & companion modes
  const [showFavs, setShowFavs] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [activeTimerIdea, setActiveTimerIdea] = useState<Idea | null>(null);
  const [activePackId, setActivePackId] = useState<string | null>(null);

  // Load persisted state
  useEffect(() => {
    try {
      const f = localStorage.getItem(FAV_KEY);
      if (f) setFavorites(JSON.parse(f));
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) setHistory(JSON.parse(h));
      const c = localStorage.getItem(CUSTOM_KEY);
      if (c) setCustomIdeas(JSON.parse(c));
      const cmp = localStorage.getItem(COMPLETED_KEY);
      if (cmp) setCompletedIds(JSON.parse(cmp));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customIdeas));
  }, [customIdeas]);
  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedIds));
  }, [completedIds]);

  const allIdeas = useMemo(() => [...customIdeas, ...IDEAS], [customIdeas]);
  const dailyQuest = useMemo(() => getDailyQuest(allIdeas), [allIdeas]);

  const filteredIdeas = useMemo(() => {
    return allIdeas.filter((idea) => {
      if (idea.minMinutes > time) return false;
      if (selectedMoods.length > 0 && !idea.moods.some((m) => selectedMoods.includes(m))) return false;
      if (location === "indoor" && !idea.indoor) return false;
      if (location === "outdoor" && !idea.outdoor) return false;
      if (company === "solo" && !idea.solo) return false;
      if (company === "social" && !idea.social) return false;
      return true;
    });
  }, [allIdeas, selectedMoods, time, location, company]);

  const pickIdea = (customPool?: Idea[]) => {
    const pool = customPool || filteredIdeas;
    if (pool.length === 0) return;
    setSpinning(true);
    setTimeout(() => {
      ideaCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    let ticks = 0;
    const maxTicks = 14;
    const interval = setInterval(() => {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      setCurrent(rand);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        let final = pool[Math.floor(Math.random() * pool.length)];
        if (pool.length > 1 && history[0] === final.id) {
          const others = pool.filter((i) => i.id !== final.id);
          final = others[Math.floor(Math.random() * others.length)];
        }
        setCurrent(final);
        setHistory((h) => [final.id, ...h.filter((x) => x !== final.id)].slice(0, 20));
        setSpinning(false);
      }
    }, 60);
  };

  const applyVibePack = (pack: VibePack) => {
    setActivePackId(pack.id);
    setSelectedMoods(pack.moods);
    setTime(pack.time);
    setLocation(pack.location);
    setCompany(pack.company);
    
    // Find matching ideas for this pack and auto-spin
    const matching = allIdeas.filter((i) => {
      if (i.minMinutes > pack.time) return false;
      if (!i.moods.some((m) => pack.moods.includes(m))) return false;
      if (pack.location === "indoor" && !i.indoor) return false;
      if (pack.location === "outdoor" && !i.outdoor) return false;
      if (pack.company === "solo" && !i.solo) return false;
      if (pack.company === "social" && !i.social) return false;
      return true;
    });
    pickIdea(matching.length > 0 ? matching : undefined);
  };

  const toggleMood = (m: Mood) => {
    setActivePackId(null);
    setSelectedMoods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAddCustomIdea = (newIdea: Idea) => {
    setCustomIdeas((prev) => [newIdea, ...prev]);
    setCurrent(newIdea);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  const handleCompleteActivity = (id: string) => {
    if (!completedIds.includes(id)) {
      setCompletedIds((prev) => [...prev, id]);
    }
  };

  const favoriteIdeas = favorites
    .map((id) => allIdeas.find((i) => i.id === id))
    .filter((x): x is Idea => Boolean(x));

  const currentMoodColor = current
    ? MOODS.find((m) => current.moods.includes(m.key))?.color ?? "from-violet-500 to-indigo-600"
    : "from-violet-500 to-indigo-600";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-fuchsia-500 selection:text-white">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-8 sm:py-10">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-2xl shadow-lg shadow-violet-900/50">
              ✨
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight sm:text-2xl">What Next?</div>
              <div className="text-xs text-slate-400">Your intelligent lifestyle & activity companion</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Completed badge */}
            <div
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400"
              title="Total activities completed"
            >
              <span>🎉</span>
              <span>{completedIds.length} done</span>
            </div>

            {/* Custom Idea Button */}
            <button
              onClick={() => setShowCustomModal(true)}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold backdrop-blur transition hover:bg-white/15 hover:scale-105"
            >
              <span>➕</span>
              <span className="hidden sm:inline">Add Idea</span>
            </button>

            {/* Favorites Button */}
            <button
              onClick={() => setShowFavs(true)}
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold backdrop-blur transition hover:bg-white/15 hover:scale-105"
            >
              <span className="text-sm">❤️</span>
              <span className="hidden sm:inline">Favorites</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">{favorites.length}</span>
            </button>
          </div>
        </header>

        {/* Hero Banner with Surprise Me Roulette */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 bg-gradient-to-br from-white via-violet-100 to-fuchsia-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            What should I do next?
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-sm text-slate-400 sm:text-base">
            Never waste a free moment. Pick your vibe or let our roulette wheel surprise you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => pickIdea(allIdeas)}
              disabled={spinning}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-900/40 transition hover:scale-105 hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <span>🎲</span>
              <span>Surprise Me In 1 Click</span>
            </button>
          </div>
        </div>

        {/* Activity Card Section - Appears directly down of the Surprise Me button! */}
        <div ref={ideaCardRef} className="mb-10 scroll-mt-24">
          {current ? (
            <IdeaCard
              idea={current}
              gradient={currentMoodColor}
              spinning={spinning}
              isFavorite={favorites.includes(current.id)}
              isCompleted={completedIds.includes(current.id)}
              onFavorite={() => toggleFavorite(current.id)}
              onNext={() => pickIdea()}
              onStartTimer={() => setActiveTimerIdea(current)}
              onComplete={() => handleCompleteActivity(current.id)}
            />
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center backdrop-blur-sm sm:p-10">
              <div className="mb-3 text-5xl">🎯</div>
              <h3 className="mb-1 text-lg font-bold text-white">Your Activity Idea Will Appear Here</h3>
              <p className="text-sm text-slate-400">
                Click <span className="font-bold text-amber-400">Surprise Me In 1 Click</span> above or choose a preset below to reveal your adventure!
              </p>
            </div>
          )}
        </div>

        {/* Daily Quest Highlight Card */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 p-5 backdrop-blur-md sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <span className="animate-pulse">🔥</span> Today's Daily Quest
            </div>
            {completedIds.includes(dailyQuest.id) ? (
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                ✓ Completed Today!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Resets in 24 hrs</span>
            )}
          </div>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl">{dailyQuest.emoji}</div>
              <div>
                <h3 className="text-lg font-bold text-white sm:text-xl">{dailyQuest.title}</h3>
                <p className="text-xs text-slate-300 sm:text-sm">{dailyQuest.description}</p>
              </div>
            </div>
            <div className="flex w-full shrink-0 gap-2 sm:w-auto">
              <button
                onClick={() => setActiveTimerIdea(dailyQuest)}
                className="flex-1 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400 sm:flex-initial"
              >
                ▶️ Start Timer
              </button>
              <button
                onClick={() => setCurrent(dailyQuest)}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Quick Vibe Packs */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>⚡ Quick Vibe Presets (One-Click)</span>
            {activePackId && (
              <button
                onClick={() => setActivePackId(null)}
                className="text-xs text-violet-400 hover:underline"
              >
                Clear preset
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {VIBE_PACKS.map((pack) => {
              const active = activePackId === pack.id;
              return (
                <button
                  key={pack.id}
                  onClick={() => applyVibePack(pack)}
                  className={cn(
                    "group relative flex flex-col items-start overflow-hidden rounded-2xl border p-4 text-left transition-all",
                    active
                      ? `border-transparent bg-gradient-to-br ${pack.bgGradient} text-white shadow-lg scale-105`
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <div className="mb-2 text-2xl">{pack.emoji}</div>
                  <div className="font-bold text-white">{pack.title}</div>
                  <div className="mt-1 text-[11px] line-clamp-2 text-slate-400 group-hover:text-slate-300">
                    {pack.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md sm:p-7">
          {/* Mood chips */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Filter by Mood {selectedMoods.length > 0 && <span className="text-violet-400">· {selectedMoods.length} picked</span>}
              </label>
              {selectedMoods.length > 0 && (
                <button
                  onClick={() => {
                    setActivePackId(null);
                    setSelectedMoods([]);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const active = selectedMoods.includes(m.key);
                return (
                  <button
                    key={m.key}
                    onClick={() => toggleMood(m.key)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
                      active
                        ? `border-transparent bg-gradient-to-r ${m.color} text-white shadow-lg shadow-black/30 scale-105`
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              I've got time for
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setActivePackId(null);
                    setTime(t.value);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    time === t.value
                      ? "border-white/40 bg-white text-slate-950 shadow-lg"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Company */}
          <div className="grid gap-4 sm:grid-cols-2">
            <SegmentedControl
              label="Where"
              value={location}
              onChange={(v) => {
                setActivePackId(null);
                setLocation(v);
              }}
              options={[
                { value: "any", label: "Anywhere" },
                { value: "indoor", label: "🏠 Indoor" },
                { value: "outdoor", label: "🌳 Outdoor" },
              ]}
            />
            <SegmentedControl
              label="With"
              value={company}
              onChange={(v) => {
                setActivePackId(null);
                setCompany(v);
              }}
              options={[
                { value: "any", label: "Either" },
                { value: "solo", label: "🧍 Solo" },
                { value: "social", label: "👥 Others" },
              ]}
            />
          </div>
        </div>

        {/* Generate button */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <button
            onClick={() => pickIdea()}
            disabled={spinning || filteredIdeas.length === 0}
            className={cn(
              "group relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-8 py-5 text-lg font-bold text-white shadow-2xl shadow-fuchsia-900/50 transition-all",
              !spinning && filteredIdeas.length > 0 && "hover:scale-[1.02] hover:shadow-fuchsia-800/70 active:scale-95",
              (spinning || filteredIdeas.length === 0) && "opacity-70"
            )}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {spinning ? (
                <>
                  <span className="animate-spin">🎲</span> Finding something amazing...
                </>
              ) : current ? (
                <>🔄 Give me another idea</>
              ) : (
                <>✨ Show me what to do</>
              )}
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </button>
          <div className="text-xs text-slate-500">
            {filteredIdeas.length === 0
              ? "No ideas match — try loosening a filter"
              : `${filteredIdeas.length} ideas match your exact criteria`}
          </div>
        </div>

        {/* Recent history */}
        {history.length > 1 && (
          <div className="mb-8">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recently shown
            </div>
            <div className="flex flex-wrap gap-2">
              {history
                .slice(1, 8)
                .map((id) => allIdeas.find((i) => i.id === id))
                .filter((x): x is Idea => Boolean(x))
                .map((idea) => (
                  <button
                    key={idea.id}
                    onClick={() => setCurrent(idea)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
                  >
                    <span>{idea.emoji}</span>
                    <span className="max-w-[160px] truncate">{idea.title}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        <footer className="mt-auto pt-6 text-center text-xs text-slate-600">
          Made for the moments you're stuck between scroll and sleep 💫 · Arena Web Dev
        </footer>
      </div>

      {/* Activity Timer Companion Modal */}
      {activeTimerIdea && (
        <ActivityTimer
          idea={activeTimerIdea}
          onClose={() => setActiveTimerIdea(null)}
          onComplete={(id) => handleCompleteActivity(id)}
        />
      )}

      {/* Custom Idea Creator Modal */}
      {showCustomModal && (
        <CustomIdeaModal
          onClose={() => setShowCustomModal(false)}
          onAddIdea={handleAddCustomIdea}
        />
      )}

      {/* Favorites modal */}
      {showFavs && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 backdrop-blur-md animate-[fadeInUp_0.2s_ease-out] sm:items-center"
          onClick={() => setShowFavs(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Your Saved Favorites ❤️</h2>
              <button
                onClick={() => setShowFavs(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            {favoriteIdeas.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <div className="mb-2 text-4xl">🤍</div>
                Tap the heart on any activity idea to save it here for instant access.
              </div>
            ) : (
              <div className="max-h-[60vh] space-y-2.5 overflow-y-auto pr-1">
                {favoriteIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-3.5 transition hover:bg-white/10"
                  >
                    <div className="text-3xl">{idea.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{idea.title}</span>
                        {idea.isCustom && (
                          <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] text-violet-300">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">{idea.description}</div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => {
                            setShowFavs(false);
                            setActiveTimerIdea(idea);
                          }}
                          className="rounded-lg bg-violet-600/30 px-2.5 py-1 text-[11px] font-semibold text-violet-300 hover:bg-violet-600/50"
                        >
                          ▶️ Start Timer
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(idea.id)}
                      className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-red-400"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm",
              value === opt.value
                ? "bg-white text-slate-950 shadow"
                : "text-slate-300 hover:text-white"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function IdeaCard({
  idea,
  gradient,
  spinning,
  isFavorite,
  isCompleted,
  onFavorite,
  onNext,
  onStartTimer,
  onComplete,
}: {
  idea: Idea;
  gradient: string;
  spinning: boolean;
  isFavorite: boolean;
  isCompleted: boolean;
  onFavorite: () => void;
  onNext: () => void;
  onStartTimer: () => void;
  onComplete: () => void;
}) {
  return (
    <div
      key={idea.id + (spinning ? "-s" : "")}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br p-1 shadow-2xl transition-all",
        gradient,
        !spinning && "animate-[fadeInUp_0.3s_ease-out]"
      )}
    >
      <div className="rounded-[calc(1.5rem-4px)] bg-slate-950/80 p-6 backdrop-blur-md sm:p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("text-5xl sm:text-6xl", spinning && "animate-bounce")}>{idea.emoji}</div>
            {idea.isCustom && (
              <span className="rounded-full border border-violet-400/30 bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300">
                ✨ Your Custom Idea
              </span>
            )}
            {isCompleted && (
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                ✓ Completed
              </span>
            )}
          </div>
          
          <button
            onClick={onFavorite}
            className={cn(
              "rounded-full border border-white/15 bg-white/5 p-3 text-xl transition hover:scale-110 hover:bg-white/10",
              isFavorite && "border-red-400/40 bg-red-500/20"
            )}
            title={isFavorite ? "Remove favorite" : "Save favorite"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{idea.title}</h2>
        <p className="mb-6 text-base leading-relaxed text-slate-300 sm:text-lg">{idea.description}</p>

        <div className="mb-6 flex flex-wrap gap-2">
          <MetaChip>⏱ {formatTime(idea.minMinutes)}</MetaChip>
          {idea.indoor && idea.outdoor ? (
            <MetaChip>🌐 Anywhere</MetaChip>
          ) : idea.indoor ? (
            <MetaChip>🏠 Indoor</MetaChip>
          ) : (
            <MetaChip>🌳 Outdoor</MetaChip>
          )}
          {idea.social && !idea.solo ? (
            <MetaChip>👥 With others</MetaChip>
          ) : idea.solo && idea.social ? (
            <MetaChip>🧍👥 Solo or social</MetaChip>
          ) : (
            <MetaChip>🧍 Solo</MetaChip>
          )}
          {idea.tags.slice(0, 3).map((t) => (
            <MetaChip key={t}>#{t}</MetaChip>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={onStartTimer}
            disabled={spinning}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50 sm:col-span-1"
          >
            <span>▶️</span>
            <span>Start Activity Timer</span>
          </button>

          <button
            onClick={() => {
              if (!isCompleted) {
                onComplete();
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
              }
            }}
            disabled={spinning}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition disabled:opacity-50 sm:col-span-1",
              isCompleted
                ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                : "bg-white text-slate-950 hover:bg-slate-100"
            )}
          >
            <span>{isCompleted ? "✓ Done! 🎉" : "✓ Mark as Done"}</span>
          </button>

          <button
            onClick={onNext}
            disabled={spinning}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50 sm:col-span-1"
          >
            <span>🔀</span>
            <span>Next Idea</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
      {children}
    </span>
  );
}

function formatTime(m: number) {
  if (m < 60) return `${m} min`;
  if (m === 60) return `1 hour`;
  return `${m / 60}+ hours`;
}
