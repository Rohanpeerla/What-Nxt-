import { useState } from "react";
import { MOODS, TIME_OPTIONS, type Idea, type Mood, type TimeSlot } from "../data/ideas";
import { cn } from "../utils/cn";

interface CustomIdeaModalProps {
  onClose: () => void;
  onAddIdea: (newIdea: Idea) => void;
}

export function CustomIdeaModal({ onClose, onAddIdea }: CustomIdeaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>(["chill"]);
  const [minMinutes, setMinMinutes] = useState<TimeSlot>(15);
  const [location, setLocation] = useState<"indoor" | "outdoor" | "both">("both");
  const [company, setCompany] = useState<"solo" | "social" | "both">("solo");

  const commonEmojis = ["✨", "🚀", "☕", "📚", "🧘", "🎵", "🚶", "🎨", "🎮", "🍳", "💡", "🌿", "🏋️", "✍️", "💻"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newIdea: Idea = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || "A custom activity created just for you.",
      emoji: emoji || "✨",
      moods: selectedMoods.length > 0 ? selectedMoods : ["chill"],
      minMinutes,
      indoor: location === "indoor" || location === "both",
      outdoor: location === "outdoor" || location === "both",
      solo: company === "solo" || company === "both",
      social: company === "social" || company === "both",
      tags: ["custom", "personal"],
      isCustom: true,
    };

    onAddIdea(newIdea);
    onClose();
  };

  const toggleMood = (m: Mood) => {
    setSelectedMoods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-[fadeInUp_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white sm:text-2xl">✨ Create Custom Idea</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-slate-400 hover:bg-white/20 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Emoji */}
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Emoji</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
                className="w-full rounded-2xl border border-white/15 bg-slate-950 p-3 text-center text-2xl focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Activity Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10-minute stretching session"
                required
                className="w-full rounded-2xl border border-white/15 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick emoji selector */}
          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/5 bg-white/5 p-2.5">
            {commonEmojis.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={cn(
                  "rounded-lg p-1 text-base transition hover:scale-125 hover:bg-white/10",
                  emoji === e && "bg-violet-600/50 scale-110"
                )}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-400">Description / Instructions</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this activity great? How should you do it?"
              rows={2}
              className="w-full rounded-2xl border border-white/15 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>

          {/* Moods */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-400">Associated Moods</label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => {
                const active = selectedMoods.includes(m.key);
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => toggleMood(m.key)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition",
                      active
                        ? `border-transparent bg-gradient-to-r ${m.color} text-white`
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                    )}
                  >
                    {m.emoji} {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time & Options */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Time</label>
              <select
                value={minMinutes}
                onChange={(e) => setMinMinutes(Number(e.target.value) as TimeSlot)}
                className="w-full rounded-xl border border-white/15 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as any)}
                className="w-full rounded-xl border border-white/15 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="both">🌐 Anywhere</option>
                <option value="indoor">🏠 Indoor</option>
                <option value="outdoor">🌳 Outdoor</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value as any)}
                className="w-full rounded-xl border border-white/15 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="solo">🧍 Solo</option>
                <option value="social">👥 With others</option>
                <option value="both">🧍👥 Either</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
          >
            ➕ Save Custom Idea
          </button>
        </form>
      </div>
    </div>
  );
}
