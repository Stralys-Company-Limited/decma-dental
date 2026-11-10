"use client";

import { useEffect, useRef, useState } from "react";
import { ToothMascot, type MascotTool } from "./ToothMascot";

type Edge = "left" | "right" | "bottom";
type Visit = { edge: Edge; offset: number; tool: MascotTool; tip: string };

const STORAGE_KEY = "decma-mascot-hidden";
const FIRST_DELAY: [number, number] = [6_000, 12_000];
const BETWEEN_VISITS: [number, number] = [30_000, 60_000];
const VISIT_LENGTH = 7_000;

const rand = ([min, max]: [number, number]) => min + Math.random() * (max - min);
const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** Hidden off-screen and peeking positions for each edge (the mascot stays partly tucked behind the edge). */
const placement: Record<Edge, { hidden: string; shown: string; box: string; tilt: string }> = {
  left: { hidden: "-translate-x-[110%]", shown: "-translate-x-[14%]", box: "left-0", tilt: "rotate-12" },
  right: { hidden: "translate-x-[110%]", shown: "translate-x-[14%]", box: "right-0", tilt: "-rotate-12" },
  bottom: { hidden: "translate-y-[110%]", shown: "translate-y-[16%]", box: "bottom-0", tilt: "" },
};

export function MascotPopper({
  tips,
  closeLabel,
}: {
  tips: { brush: string[]; polisher: string[] };
  closeLabel: string;
}) {
  const [visit, setVisit] = useState<Visit | null>(null);
  const [shown, setShown] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

    const scheduleVisit = (delay: number) =>
      later(() => {
        const tool: MascotTool = Math.random() < 0.5 ? "brush" : "polisher";
        setVisit({
          edge: pick(["left", "right", "bottom"] as const),
          offset: 20 + Math.random() * 55,
          tool,
          tip: pick(tips[tool]),
        });
        later(() => setShown(true), 50);
        later(() => setShown(false), VISIT_LENGTH);
        later(() => setVisit(null), VISIT_LENGTH + 700);
        scheduleVisit(VISIT_LENGTH + rand(BETWEEN_VISITS));
      }, delay);

    scheduleVisit(rand(FIRST_DELAY));
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, [tips]);

  function hideForSession() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    timers.current.forEach(clearTimeout);
    setShown(false);
    window.setTimeout(() => setVisit(null), 700);
  }

  if (!visit) return null;
  const p = placement[visit.edge];
  const position =
    visit.edge === "bottom" ? { left: `${visit.offset}%` } : { top: `${Math.min(visit.offset, 70)}%` };
  const bubbleSide =
    visit.edge === "left" ? "left-full ml-1 top-2" : visit.edge === "right" ? "right-full mr-1 top-2" : "bottom-full mb-1 left-1/2 -translate-x-1/2";

  return (
    <div aria-hidden className={`pointer-events-none fixed z-30 ${p.box}`} style={position}>
      <div
        className={`pointer-events-auto relative transition-transform duration-700 ease-[cubic-bezier(.34,1.56,.64,1)] ${shown ? p.shown : p.hidden}`}
      >
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShown(false)}
          className={`block cursor-pointer ${p.tilt}`}
        >
          <ToothMascot
            tool={visit.tool}
            className={`w-20 drop-shadow-lg sm:w-24 ${visit.edge === "right" ? "-scale-x-100" : ""}`}
          />
        </button>

        <div
          className={`absolute w-44 rounded-2xl border-2 border-navy bg-white px-3 py-2 text-xs font-semibold leading-snug text-navy shadow-md transition-opacity delay-300 duration-300 ${bubbleSide} ${shown ? "opacity-100" : "opacity-0"}`}
        >
          {visit.tip}
          <button
            type="button"
            tabIndex={-1}
            onClick={hideForSession}
            title={closeLabel}
            className="absolute -top-2.5 -right-2.5 flex size-5 items-center justify-center rounded-full bg-navy text-[11px] leading-none text-white hover:bg-teal-deep"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
