import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { type Idea } from "../data/ideas";
import { cn } from "../utils/cn";

interface ActivityTimerProps {
  idea: Idea;
  onClose: () => void;
  onComplete: (ideaId: string) => void;
}

export function ActivityTimer({ idea, onClose, onComplete }: ActivityTimerProps) {
  // Convert minutes to seconds for timer
  const initialSeconds = idea.minMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [ambientSound, setAmbientSound] = useState<"off" | "rain" | "waves" | "forest">("off");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Timer interval
  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            triggerCelebration();
            onComplete(idea.id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, idea.id, onComplete]);

  // Handle synthesized ambient noise using Web Audio API
  useEffect(() => {
    if (ambientSound === "off") {
      stopNoise();
      return;
    }
    startNoise(ambientSound);
    return () => stopNoise();
  }, [ambientSound]);

  const startNoise = (type: "rain" | "waves" | "forest") => {
    try {
      stopNoise();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create pink/brown noise buffer for ambient relaxing sound
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === "rain") {
          // Pink noise for rain
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else if (type === "waves") {
          // Brown noise with slow modulation for ocean waves
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          const mod = Math.sin((i / bufferSize) * Math.PI * 4) * 0.5 + 0.5;
          output[i] *= 2.5 * (0.3 + mod * 0.7);
        } else {
          // Soft forest wind
          output[i] = (lastOut + 0.015 * white) / 1.015;
          lastOut = output[i];
          output[i] *= 2.0;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = type === "rain" ? 800 : type === "waves" ? 400 : 600;

      const gain = ctx.createGain();
      gain.gain.value = 0.15; // Gentle volume

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(0);
      noiseNodeRef.current = whiteNoise;
    } catch (e) {
      console.warn("Audio context error:", e);
    }
  };

  const stopNoise = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop();
        noiseNodeRef.current.disconnect();
      } catch {}
      noiseNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"],
    });
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = ((initialSeconds - timeLeft) / initialSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-[fadeInUp_0.2s_ease-out]">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl sm:p-8">
        {/* Close button */}
        <button
          onClick={() => {
            stopNoise();
            onClose();
          }}
          className="absolute top-5 right-5 rounded-full bg-white/10 p-2.5 text-slate-400 transition hover:bg-white/20 hover:text-white"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 text-6xl animate-bounce">{idea.emoji}</div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{idea.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{idea.description}</p>
        </div>

        {/* Timer Circle */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-8 border-white/5 bg-slate-950 shadow-inner">
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-violet-500 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progress) / 100}
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <div className="text-center">
              <div className="font-mono text-4xl font-extrabold tracking-tighter text-white sm:text-5xl">
                {formatCountdown(timeLeft)}
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-slate-500">
                {isCompleted ? "Completed! 🎉" : isRunning ? "In Progress..." : "Ready when you are"}
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Sound Synthesizer */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            🎧 Ambient Zen Sound (Web Audio)
          </div>
          <div className="flex justify-center gap-2">
            {[
              { id: "off", label: "🔇 Off" },
              { id: "rain", label: "🌧️ Gentle Rain" },
              { id: "waves", label: "🌊 Ocean Waves" },
              { id: "forest", label: "🍃 Forest Wind" },
            ].map((snd) => (
              <button
                key={snd.id}
                onClick={() => setAmbientSound(snd.id as any)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition",
                  ambientSound === snd.id
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/50"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                )}
              >
                {snd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isCompleted ? (
            <>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={cn(
                  "flex-1 rounded-2xl py-4 text-base font-bold shadow-lg transition",
                  isRunning
                    ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:brightness-110"
                )}
              >
                {isRunning ? "⏸ Pause Timer" : timeLeft < initialSeconds ? "▶️ Resume" : "▶️ Start Activity Now"}
              </button>
              {timeLeft < initialSeconds && (
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setTimeLeft(initialSeconds);
                  }}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-sm font-semibold hover:bg-white/10"
                >
                  🔄 Reset
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => {
                stopNoise();
                onClose();
              }}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-4 text-lg font-bold text-white shadow-xl hover:brightness-110"
            >
              🎉 Amazing Job! Close Timer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
