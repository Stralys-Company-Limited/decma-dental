export type MascotTool = "brush" | "polisher";

const NAVY = "#223f82";
const TEAL = "#00ada2";

/** Cute tooth character holding a toothbrush or a dental polishing handpiece. Animations live in globals.css. */
export function ToothMascot({ tool, className = "" }: { tool: MascotTool; className?: string }) {
  return (
    <svg viewBox="0 0 130 120" className={className} aria-hidden focusable="false">
      <g className="mascot-bob">
        {/* left arm, waving */}
        <g className="mascot-wave" style={{ transformBox: "view-box", transformOrigin: "34px 64px" }}>
          <path d="M34 64 Q22 66 16 56" fill="none" stroke={NAVY} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="15" cy="54" r="5" fill="#fff" stroke={NAVY} strokeWidth="3" />
        </g>

        {/* tooth body */}
        <path
          d="M30 32C30 16 45 11 60 19C75 11 90 16 90 32C90 47 86 57 84 72C82 87 80 102 72 106C66 109 64 98 62 90C61 86 59 86 58 90C56 98 54 109 48 106C40 102 38 87 36 72C34 57 30 47 30 32Z"
          fill="#fff"
          stroke={NAVY}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M38 30Q41 21 50 22" fill="none" stroke="#ccefec" strokeWidth="4" strokeLinecap="round" />

        {/* face */}
        <g className="mascot-blink" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx="50" cy="50" r="5" fill={NAVY} />
          <circle cx="70" cy="50" r="5" fill={NAVY} />
          <circle cx="51.8" cy="48.2" r="1.7" fill="#fff" />
          <circle cx="71.8" cy="48.2" r="1.7" fill="#fff" />
        </g>
        <ellipse cx="42" cy="60" rx="5.5" ry="3.2" fill="#f7a9b8" opacity="0.75" />
        <ellipse cx="78" cy="60" rx="5.5" ry="3.2" fill="#f7a9b8" opacity="0.75" />
        <path d="M52 61Q60 70 68 61" fill="#e86a82" stroke={NAVY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* right arm + tool */}
        <path d="M86 64 Q96 64 100 56" fill="none" stroke={NAVY} strokeWidth="3.5" strokeLinecap="round" />
        {tool === "brush" ? <Toothbrush /> : <Polisher />}
      </g>
    </svg>
  );
}

function Toothbrush() {
  return (
    <g className="mascot-brush" style={{ transformBox: "view-box", transformOrigin: "101px 55px" }}>
      <rect x="97" y="20" width="8" height="40" rx="4" fill={TEAL} stroke={NAVY} strokeWidth="2.5" />
      <rect x="95" y="7" width="12" height="16" rx="3" fill="#fff" stroke={NAVY} strokeWidth="2.5" />
      <path d="M95 11h-5M95 15h-5M95 19h-5" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
      <circle cx="101" cy="55" r="5" fill="#fff" stroke={NAVY} strokeWidth="3" />
      <circle className="mascot-bubble" cx="86" cy="10" r="3" fill="#fff" stroke="#99deda" strokeWidth="1.5" />
      <circle className="mascot-bubble mascot-bubble-2" cx="82" cy="18" r="2.2" fill="#fff" stroke="#99deda" strokeWidth="1.5" />
    </g>
  );
}

function Polisher() {
  return (
    <g>
      {/* handpiece body with turquoise grip band */}
      <rect x="97" y="18" width="9" height="42" rx="4.5" fill="#e3e6ee" stroke={NAVY} strokeWidth="2.5" />
      <rect x="97" y="38" width="9" height="8" fill={TEAL} stroke={NAVY} strokeWidth="2.5" />
      {/* angled head */}
      <path d="M99 19 L94 9 L100 6 L104 18" fill="#e3e6ee" stroke={NAVY} strokeWidth="2.5" strokeLinejoin="round" />
      {/* spinning polishing cup */}
      <g className="mascot-spin" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="91" cy="7" r="5.5" fill="#99deda" stroke={NAVY} strokeWidth="2.5" />
        <path d="M88 7h6M91 4v6" stroke={NAVY} strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <circle cx="101.5" cy="55" r="5" fill="#fff" stroke={NAVY} strokeWidth="3" />
      {/* sparkles */}
      <path className="mascot-twinkle" d="M80 2l1.5 3.5L85 7l-3.5 1.5L80 12l-1.5-3.5L75 7l3.5-1.5Z" fill="#ffd166" />
      <path className="mascot-twinkle mascot-twinkle-2" d="M111 4l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1Z" fill="#ffd166" />
    </g>
  );
}
