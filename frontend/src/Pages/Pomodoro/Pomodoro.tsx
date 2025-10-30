import { useEffect, useMemo, useRef, useState } from "react";

type PomodoroTimerProps = {
  focusDuration?: number; // in minutes (default 25)
  breakDuration?: number; // in minutes (default 5)
};

export default function PomodoroTimer({
  focusDuration = 25,
  breakDuration = 5,
}: PomodoroTimerProps) {
  const [selectedFocus, setSelectedFocus] = useState<number>(focusDuration);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  type Note = { id: number; text: string; editing?: boolean };
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [completedRests, setCompletedRests] = useState(0); // short rests completed
  const [completedLongRests, setCompletedLongRests] = useState(0);

  const SHORT_BREAK = 5;
  const LONG_BREAK = 15;
  const [showPicker, setShowPicker] = useState(false);
  const [customMinutes, setCustomMinutes] = useState<string>("");

  // Format time into mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // Toggle start/pause
  const toggleTimer = () => setIsRunning((prev) => !prev);

  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false);
    // Keep current mode and adjust to its default duration
    const nextRestIndex = completedRests + 1;
    const isLong = nextRestIndex % 4 === 0;
    const breakLen = isLong ? LONG_BREAK : SHORT_BREAK;
    setTimeLeft((isBreak ? breakLen : selectedFocus) * 60);
  };

  // Timer countdown logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Switch modes
            if (!isBreak) {
              // Finished a pomodoro -> go to break
              setCompletedPomodoros((v) => v + 1);
              setIsBreak(true);
              const nextRestIndex = completedRests + 1; // about to take this rest
              const isLong = nextRestIndex % 4 === 0;
              return (isLong ? LONG_BREAK : SHORT_BREAK) * 60;
            } else {
              // Finished a break -> increment rest counters and go back to pomodoro
              const thisRestIndex = completedRests + 1; // the one we just finished
              if (thisRestIndex % 4 === 0) {
                setCompletedLongRests((v) => v + 1);
              } else {
                setCompletedRests((v) => v + 1);
              }
              setIsBreak(false);
              return selectedFocus * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup interval when stopped
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isBreak, focusDuration, breakDuration]);

  // Recompute timeLeft when durations change or session toggles
  useEffect(() => {
    const nextRestIndex = completedRests + 1;
    const isLong = nextRestIndex % 4 === 0;
    setTimeLeft((isBreak ? (isLong ? LONG_BREAK : SHORT_BREAK) : selectedFocus) * 60);
  }, [isBreak, selectedFocus, completedRests]);

  const totalSeconds = useMemo(() => {
    const nextRestIndex = completedRests + 1;
    const isLong = nextRestIndex % 4 === 0;
    return (isBreak ? (isLong ? LONG_BREAK : SHORT_BREAK) : selectedFocus) * 60;
  }, [isBreak, selectedFocus, completedRests]);
  const progress = useMemo(
    () => 1 - timeLeft / totalSeconds,
    [timeLeft, totalSeconds]
  );

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(1, progress)) * circumference;

  return (
    <div className="space-y-8">
      {/* Timer Card */}
      <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Focus Session</h2>
          <div className="flex items-center gap-2 relative">
            {/* Session length selector */}
            {!isBreak && (
              <div>
                <button
                  onClick={() => setShowPicker((s) => !s)}
                  className="px-3 py-1 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 text-sm"
                >
                  Change time
                </button>
                {showPicker && (
                  <div className="absolute right-0 mt-2 z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-56">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[25, 30, 40].map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setIsRunning(false);
                            setIsBreak(false);
                            setSelectedFocus(m);
                            setTimeLeft(m * 60);
                            setShowPicker(false);
                          }}
                          className={`px-2 py-1 rounded-lg text-sm border ${
                            selectedFocus === m
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">Custom minutes</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={180}
                        value={customMinutes}
                        onChange={(e) => setCustomMinutes(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
                        placeholder="e.g. 50"
                      />
                      <button
                        onClick={() => {
                          const val = parseInt(customMinutes, 10);
                          if (!Number.isNaN(val) && val > 0) {
                            setIsRunning(false);
                            setIsBreak(false);
                            setSelectedFocus(val);
                            setTimeLeft(val * 60);
                            setShowPicker(false);
                            setCustomMinutes("");
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-yellow-400 text-white text-sm hover:bg-yellow-500"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <span className="text-sm bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
              {(() => {
                const nextRestIndex = completedRests + 1;
                const isLong = nextRestIndex % 4 === 0;
                return isBreak ? (isLong ? `${LONG_BREAK}m` : `${SHORT_BREAK}m`) : `${selectedFocus}m`;
              })()}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {/* Circular progress */}
          <div className="relative h-56 w-56 mb-6">
            <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="#FFF7D6"
                strokeWidth="14"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="#FACC15"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-500">
              <div className="text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</div>
              <div className="text-xs mt-1 text-yellow-600">{Math.round(progress * 100)}% Complete</div>
            </div>
          </div>

          <div className="text-lg font-semibold text-gray-800 mb-1">Task 1</div>
          <div className="text-xs text-gray-500 mb-3">
            {isBreak
              ? (() => {
                  const nextRestIndex = completedRests + 1;
                  const isLong = nextRestIndex % 4 === 0;
                  return isLong
                    ? `Long Rest ${completedLongRests + 1}`
                    : `Rest ${completedRests + 1}`;
                })()
              : `Pomodoro ${completedPomodoros + 1}`}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleTimer}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => {
                // Manual complete current segment
                if (!isBreak) {
                  setCompletedPomodoros((v) => v + 1);
                  setIsBreak(true);
                  setIsRunning(false);
                  const nextRestIndex = completedRests + 1;
                  const isLong = nextRestIndex % 4 === 0;
                  setTimeLeft((isLong ? LONG_BREAK : SHORT_BREAK) * 60);
                } else {
                  const thisRestIndex = completedRests + 1;
                  if (thisRestIndex % 4 === 0) {
                    setCompletedLongRests((v) => v + 1);
                  } else {
                    setCompletedRests((v) => v + 1);
                  }
                  setIsBreak(false);
                  setIsRunning(false);
                  setTimeLeft(selectedFocus * 60);
                }
              }}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Complete
            </button>
            <button
              onClick={resetTimer}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Reset
            </button>
            <button
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Fullscreen
            </button>
          </div>
        </div>
      </div>

      {/* Quick Note Card */}
      <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Quick Note</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">+5 XP</span>
        </div>
        <div className="mb-3 text-sm text-gray-600">Add context tags</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "idea",
            "blocker",
            "win",
            "plan",
            "bug",
            "note",
          ].map((t) => {
            const active = tags.includes(t);
            return (
              <button
                key={t}
                onClick={() =>
                  setTags((prev) =>
                    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                  )
                }
                className={`px-3 py-1 rounded-full text-sm border ${
                  active
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write down your thought, idea, breakthroughs or blocker..."
            className="w-full resize-none h-28 rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-yellow-200"
          />
          <button
            onClick={() => {
              if (!draft.trim()) return;
              setNotes((prev) => [{ id: Date.now(), text: draft.trim() }, ...prev]);
              setDraft("");
            }}
            className="w-full rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white py-2"
          >
            Add note
          </button>
        </div>
      </div>

      {/* Session Notes Card */}
      <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Session Notes</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            {notes.length}
          </span>
        </div>
        <div className="space-y-3">
          {notes.length === 0 && (
            <div className="text-sm text-gray-500">No notes yet</div>
          )}
          {notes.map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3"
            >
              <div className="flex-1 pr-3">
                {n.editing ? (
                  <input
                    value={n.text}
                    onChange={(e) =>
                      setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, text: e.target.value } : x)))
                    }
                    className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm"
                  />
                ) : (
                  <div className="text-gray-800 text-sm">{n.text}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {n.editing ? (
                  <>
                    <button
                      className="text-xs px-2 py-1 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500"
                      onClick={() =>
                        setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, editing: false } : x)))
                      }
                    >
                      Save
                    </button>
                    <button
                      className="text-xs px-2 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                      onClick={() =>
                        setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, editing: false } : x)))
                      }
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-xs px-2 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                      onClick={() =>
                        setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, editing: true } : x)))
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                      onClick={() => setNotes((prev) => prev.filter((x) => x.id !== n.id))}
                    >
                      Delete
                    </button>
                  </>
                )}
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
