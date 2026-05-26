import { useState, useEffect, useRef } from "react";

// ============================================================
// DESIGN TOKENS
// ============================================================
const tokens = {
  gold: {
    50: "#FFF9E6",
    100: "#FFEDAB",
    300: "#F5C842",
    400: "#E6AA20",
    500: "#C9891A",
    600: "#A36A0F",
    gradient: "linear-gradient(135deg, #F5C842 0%, #E6AA20 40%, #C9891A 100%)",
    shimmer: "linear-gradient(90deg, #F5C842, #fff8dc, #E6AA20, #F5C842)",
  },
  dark: {
    bg: "#0A0812",
    surface: "#120F1E",
    elevated: "#1C1730",
    border: "rgba(245,200,66,0.15)",
    text: "#F5EDD8",
    muted: "rgba(245,237,216,0.45)",
  },
  light: {
    bg: "#FBF7EE",
    surface: "#FFFFFF",
    elevated: "#F5EDD8",
    border: "rgba(201,137,26,0.2)",
    text: "#1A1215",
    muted: "rgba(26,18,21,0.5)",
  },
  radius: { sm: 12, md: 20, lg: 28, xl: 40, pill: 999 },
  shadow: {
    gold: "0 8px 32px rgba(230,170,32,0.25)",
    dark: "0 16px 48px rgba(0,0,0,0.6)",
    glass: "0 8px 32px rgba(0,0,0,0.3)",
  },
};

// ============================================================
// ANIMATIONS (CSS injected once)
// ============================================================
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes floatMoon {
    0%,100% { transform: translateY(0px) rotate(-5deg); }
    50% { transform: translateY(-14px) rotate(5deg); }
  }
  @keyframes twinkle {
    0%,100% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes shimmerGold {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.88); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(245,200,66,0.4); }
    50% { box-shadow: 0 0 0 12px rgba(245,200,66,0); }
  }
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33% { transform: translate(20px,-30px) scale(1.1); }
    66% { transform: translate(-15px,20px) scale(0.95); }
  }
  @keyframes borderGlow {
    0%,100% { border-color: rgba(245,200,66,0.3); }
    50% { border-color: rgba(245,200,66,0.8); }
  }
  @keyframes cardFloat {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-6px) rotate(0.5deg); }
  }
  @keyframes ripple {
    0% { transform: scale(0); opacity: 0.6; }
    100% { transform: scale(4); opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes slideRight {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes duaReveal {
    from { clip-path: inset(0 100% 0 0); opacity:0; }
    to { clip-path: inset(0 0% 0 0); opacity:1; }
  }
  
  .glass-dark {
    background: rgba(18, 15, 30, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(245,200,66,0.15);
  }
  .glass-light {
    background: rgba(255,255,255,0.65);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(201,137,26,0.2);
  }
  .gold-text {
    background: linear-gradient(135deg, #F5C842 0%, #E6AA20 40%, #C9891A 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .shimmer-text {
    background: linear-gradient(90deg, #F5C842, #fff8dc, #E6AA20, #F5C842);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerGold 3s linear infinite;
  }
  .btn-gold {
    background: linear-gradient(135deg, #F5C842 0%, #E6AA20 40%, #C9891A 100%);
    color: #0A0812;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
  }
  .btn-gold:hover { filter: brightness(1.1); transform: translateY(-2px); }
  .btn-gold:active { transform: scale(0.97); }
  .btn-ghost {
    background: transparent;
    border: 1.5px solid rgba(245,200,66,0.4);
    color: #F5C842;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-ghost:hover { background: rgba(245,200,66,0.1); border-color: rgba(245,200,66,0.8); }
  
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(245,200,66,0.3); border-radius: 4px; }
`;

// ============================================================
// SUB-COMPONENTS
// ============================================================

function Stars({ count = 40, theme }) {
  const stars = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      dur: 2 + Math.random() * 3,
    }))
  ).current;

  if (theme === "light") return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#F5C842",
            animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

function CrescentMoon({ size = 60, color = "#F5C842", animate = true, glow = true }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        animation: animate ? `floatMoon 4s ease-in-out infinite` : "none",
        filter: glow ? `drop-shadow(0 0 ${size * 0.3}px rgba(245,200,66,0.6))` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <radialGradient id="moonGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#FFF3A0" />
            <stop offset="50%" stopColor="#F5C842" />
            <stop offset="100%" stopColor="#C9891A" />
          </radialGradient>
        </defs>
        <path
          d="M55,10 A40,40 0 1,0 55,90 A28,28 0 1,1 55,10 Z"
          fill="url(#moonGrad)"
        />
      </svg>
    </div>
  );
}

function ArabicOrnament({ color = "rgba(245,200,66,0.3)", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path d="M20 2 L22 14 L34 8 L26 18 L38 20 L26 22 L34 32 L22 26 L20 38 L18 26 L6 32 L14 22 L2 20 L14 18 L6 8 L18 14 Z"
        fill={color} />
    </svg>
  );
}

function IslamicPattern({ opacity = 0.04 }) {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="islamic" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#F5C842" strokeWidth="0.8" opacity={opacity * 25}>
            <polygon points="40,5 75,20 75,60 40,75 5,60 5,20" />
            <polygon points="40,15 65,27.5 65,52.5 40,65 15,52.5 15,27.5" />
            <line x1="40" y1="5" x2="40" y2="15" />
            <line x1="75" y1="20" x2="65" y2="27.5" />
            <line x1="75" y1="60" x2="65" y2="52.5" />
            <line x1="40" y1="75" x2="40" y2="65" />
            <line x1="5" y1="60" x2="15" y2="52.5" />
            <line x1="5" y1="20" x2="15" y2="27.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic)" />
    </svg>
  );
}

function StatusBar({ theme }) {
  const t = theme === "dark" ? tokens.dark : tokens.light;
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 20px 6px", fontSize: 12, fontFamily: "'DM Sans',sans-serif",
      fontWeight: 600, color: t.text, letterSpacing: 0.3,
    }}>
      <span>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span>●●●●</span>
        <span>WiFi</span>
        <span>🔋</span>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
      <div style={{ width: 134, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.25)" }} />
    </div>
  );
}

function TabBar({ active, setActive, theme }) {
  const t = theme === "dark" ? tokens.dark : tokens.light;
  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "cards", icon: "✉️", label: "Cards" },
    { id: "duas", icon: "🤲", label: "Duas" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  return (
    <div
      className={theme === "dark" ? "glass-dark" : "glass-light"}
      style={{
        display: "flex", padding: "10px 0 4px",
        borderTop: `1px solid ${t.border}`,
        borderRadius: "28px 28px 0 0",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            padding: "6px 0", transition: "all 0.25s ease",
            transform: active === tab.id ? "translateY(-2px)" : "none",
          }}
        >
          <div style={{
            fontSize: active === tab.id ? 22 : 20,
            filter: active === tab.id ? "drop-shadow(0 2px 8px rgba(245,200,66,0.6))" : "grayscale(0.5) opacity(0.6)",
            transition: "all 0.25s ease",
          }}>
            {tab.icon}
          </div>
          <span style={{
            fontSize: 9.5, fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
            letterSpacing: 0.5,
            color: active === tab.id ? "#F5C842" : t.muted,
            transition: "color 0.25s",
          }}>
            {tab.label.toUpperCase()}
          </span>
          {active === tab.id && (
            <div style={{
              width: 4, height: 4, borderRadius: "50%",
              background: tokens.gold.gradient,
              animation: "pulse 2s infinite",
            }} />
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// SCREENS
// ============================================================

// --- ONBOARDING ---
function OnboardingScreen({ onComplete, theme }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      emoji: null, moon: true,
      title: "عيد مبارك",
      subtitle: "Happy Eid",
      body: "Celebrate the blessed occasion with elegance. Share love, duas, and joy with everyone you cherish.",
    },
    {
      emoji: "✨", moon: false,
      title: "Beautiful Cards",
      subtitle: "Crafted with love",
      body: "Design stunning Eid greeting cards with AI-powered personalisation. Hundreds of premium templates await.",
    },
    {
      emoji: "🤲", moon: false,
      title: "Sacred Duas",
      subtitle: "Prayers for every moment",
      body: "Discover curated Islamic duas with transliterations, translations, and audio guidance.",
    },
  ];
  const s = steps[step];
  const t = theme === "dark" ? tokens.dark : tokens.light;

  return (
    <div style={{
      position: "relative", height: "100%", overflow: "hidden",
      background: theme === "dark"
        ? "radial-gradient(ellipse at 30% 20%, #1E1540 0%, #0A0812 60%)"
        : "radial-gradient(ellipse at 30% 20%, #FFF5CC 0%, #FBF7EE 60%)",
      display: "flex", flexDirection: "column",
    }}>
      <Stars theme={theme} />
      <IslamicPattern />

      {/* Orbs */}
      {theme === "dark" && (
        <>
          <div style={{
            position: "absolute", width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,200,66,0.12) 0%, transparent 70%)",
            top: -80, right: -80, animation: "orbFloat 8s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(130,70,200,0.1) 0%, transparent 70%)",
            bottom: 100, left: -60, animation: "orbFloat 10s 2s ease-in-out infinite",
          }} />
        </>
      )}

      {/* Content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 32px 20px",
        animation: "fadeUp 0.6s ease both",
        key: step,
      }}>
        {s.moon ? (
          <CrescentMoon size={110} animate />
        ) : (
          <div style={{ fontSize: 80, lineHeight: 1, filter: "drop-shadow(0 4px 24px rgba(245,200,66,0.4))" }}>
            {s.emoji}
          </div>
        )}

        <div style={{ marginTop: 36, textAlign: "center" }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: s.moon ? 44 : 34, fontWeight: 700, lineHeight: 1.1,
            marginBottom: 6,
            ...(theme === "dark" ? {
              background: "linear-gradient(135deg, #F5C842, #FFF3A0, #C9891A)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            } : { color: "#7A4F0D" }),
          }}>
            {s.title}
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18, fontStyle: "italic", fontWeight: 300,
            color: theme === "dark" ? "rgba(245,200,66,0.6)" : "rgba(122,79,13,0.6)",
            marginBottom: 24, letterSpacing: 2,
          }}>
            {s.subtitle}
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 15.5,
            color: t.muted, lineHeight: 1.7, maxWidth: 300,
          }}>
            {s.body}
          </p>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", paddingBottom: 16 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8, height: 8,
            borderRadius: 4,
            background: i === step ? tokens.gold.gradient : "rgba(245,200,66,0.25)",
            transition: "all 0.35s ease",
            cursor: "pointer",
          }} onClick={() => setStep(i)} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: "0 24px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          className="btn-gold"
          onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
          style={{
            width: "100%", padding: "17px 0", borderRadius: tokens.radius.pill,
            fontSize: 16, letterSpacing: 0.5, fontWeight: 700,
            boxShadow: tokens.shadow.gold,
          }}
        >
          {step < steps.length - 1 ? "Continue →" : "Begin the Celebration 🌙"}
        </button>
        {step < steps.length - 1 && (
          <button
            className="btn-ghost"
            onClick={onComplete}
            style={{ width: "100%", padding: "13px 0", borderRadius: tokens.radius.pill, fontSize: 14 }}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

// --- HOME ---
function HomeScreen({ theme, setTab }) {
  const t = theme === "dark" ? tokens.dark : tokens.light;
  const greetings = [
    { ar: "تقبل الله منا ومنكم", en: "May Allah accept from us and from you", icon: "🤲" },
    { ar: "عيد مبارك وكل عام وأنتم بخير", en: "Blessed Eid and may you always be well", icon: "✨" },
    { ar: "كل عام وأنت بألف خير", en: "May every year bring you a thousand blessings", icon: "💛" },
  ];
  const [activeGreeting, setActiveGreeting] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveGreeting((p) => (p + 1) % greetings.length), 3500);
    return () => clearInterval(t);
  }, []);

  const quick = [
    { icon: "✉️", label: "Create Card", color: "#E6AA20", action: () => setTab("cards") },
    { icon: "🤲", label: "Find Dua", color: "#7C3AED", action: () => setTab("duas") },
    { icon: "🎁", label: "Send Gift", color: "#059669", action: () => {} },
    { icon: "📱", label: "Share", color: "#DC2626", action: () => {} },
  ];

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: "0 20px 20px",
    }}>
      {/* Hero */}
      <div style={{
        position: "relative", borderRadius: tokens.radius.lg,
        overflow: "hidden", marginBottom: 20,
        background: theme === "dark"
          ? "linear-gradient(135deg, #1A1430 0%, #2D1F4E 50%, #1A1430 100%)"
          : "linear-gradient(135deg, #FFF3CC 0%, #FFE58A 50%, #FFF3CC 100%)",
        padding: "28px 24px",
        animation: "scaleIn 0.5s ease both",
      }}>
        <IslamicPattern opacity={0.06} />
        <div style={{ position: "absolute", top: -10, right: -10 }}>
          <CrescentMoon size={90} />
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <ArabicOrnament color="rgba(245,200,66,0.5)" size={16} />
          <ArabicOrnament color="rgba(245,200,66,0.3)" size={16} />
          <ArabicOrnament color="rgba(245,200,66,0.5)" size={16} />
        </div>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 13, letterSpacing: 3, fontWeight: 400,
          color: "rgba(245,200,66,0.7)", textTransform: "uppercase", marginBottom: 10,
        }}>
          Eid Al-Fitr Mubarak
        </p>
        <div style={{ minHeight: 72 }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20, fontWeight: 700, lineHeight: 1.3,
            color: theme === "dark" ? "#F5EDD8" : "#4A2C0A",
            animation: "fadeUp 0.5s ease both",
          }}>
            {greetings[activeGreeting].ar}
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 13.5, fontStyle: "italic",
            color: theme === "dark" ? "rgba(245,200,66,0.65)" : "rgba(122,79,13,0.65)",
            marginTop: 4,
          }}>
            {greetings[activeGreeting].en}
          </p>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          {greetings.map((_, i) => (
            <div key={i} onClick={() => setActiveGreeting(i)} style={{
              width: i === activeGreeting ? 20 : 6, height: 6, borderRadius: 3,
              background: i === activeGreeting ? "#F5C842" : "rgba(245,200,66,0.3)",
              transition: "all 0.3s", cursor: "pointer",
            }} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <p style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, fontWeight: 700,
        letterSpacing: 2, color: t.muted, textTransform: "uppercase",
        marginBottom: 14,
      }}>
        Quick Actions
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        {quick.map((q, i) => (
          <button key={i} onClick={q.action} style={{
            background: theme === "dark" ? tokens.dark.elevated : "#fff",
            border: `1px solid ${t.border}`,
            borderRadius: tokens.radius.md, padding: "16px 8px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            cursor: "pointer", transition: "all 0.25s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = tokens.shadow.gold; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: tokens.radius.sm,
              background: q.color + "22", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 20,
            }}>
              {q.icon}
            </div>
            <span style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, fontWeight: 600,
              color: t.text, textAlign: "center", lineHeight: 1.3,
            }}>
              {q.label}
            </span>
          </button>
        ))}
      </div>

      {/* AI Greeting Banner */}
      <div style={{
        background: theme === "dark"
          ? "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(230,170,32,0.15) 100%)"
          : "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(230,170,32,0.1) 100%)",
        border: `1px solid rgba(124,58,237,0.3)`,
        borderRadius: tokens.radius.lg, padding: "18px 20px",
        marginBottom: 20, cursor: "pointer",
        animation: "borderGlow 3s ease-in-out infinite",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: tokens.radius.sm,
            background: "linear-gradient(135deg, #7C3AED, #C9891A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>
            ✨
          </div>
          <div>
            <p style={{
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
              color: t.text, marginBottom: 3,
            }}>
              AI Greeting Generator
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: t.muted, lineHeight: 1.4 }}>
              Personalise your Eid message with AI magic in seconds
            </p>
          </div>
          <span style={{ fontSize: 18, color: "#F5C842", marginLeft: "auto" }}>→</span>
        </div>
      </div>

      {/* Dua of the Day */}
      <div
        className={theme === "dark" ? "glass-dark" : "glass-light"}
        style={{ borderRadius: tokens.radius.lg, padding: "20px", marginBottom: 20 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase",
            color: "rgba(245,200,66,0.7)",
          }}>
            🤲 Dua of the Day
          </p>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: t.muted }}>Tap to share</span>
        </div>
        <p style={{
          fontFamily: "'Playfair Display', serif", fontSize: 19,
          color: t.text, lineHeight: 1.6, textAlign: "right",
          direction: "rtl", marginBottom: 10,
        }}>
          اللهم تقبل منا صيامنا وقيامنا
        </p>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 14.5,
          fontStyle: "italic", color: t.muted, lineHeight: 1.5,
        }}>
          "O Allah, accept our fasting and our prayers."
        </p>
      </div>

      {/* Recent Activity */}
      <p style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, fontWeight: 700,
        letterSpacing: 2, color: t.muted, textTransform: "uppercase", marginBottom: 14,
      }}>
        Recent Cards
      </p>
      {[
        { to: "Mama & Baba", time: "Sent 2h ago", preview: "Golden Crescent", emoji: "🌙" },
        { to: "Team at Work", time: "Sent yesterday", preview: "Starry Night Eid", emoji: "⭐" },
      ].map((card, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px 16px", borderRadius: tokens.radius.md,
          background: theme === "dark" ? tokens.dark.elevated : "#fff",
          border: `1px solid ${t.border}`, marginBottom: 10,
          cursor: "pointer",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: tokens.radius.sm,
            background: tokens.gold.gradient,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>
            {card.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, color: t.text }}>
              {card.to}
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: t.muted }}>{card.preview}</p>
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: t.muted }}>{card.time}</p>
        </div>
      ))}
    </div>
  );
}

// --- CARDS ---
function CardsScreen({ theme }) {
  const t = theme === "dark" ? tokens.dark : tokens.light;
  const [selected, setSelected] = useState(null);
  const [aiMode, setAiMode] = useState(false);
  const [name, setName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState("");

  const templates = [
    { id: 1, name: "Golden Crescent", bg: "linear-gradient(135deg, #1A1430 0%, #2D1A50 100%)", accent: "#F5C842", emoji: "🌙", premium: false },
    { id: 2, name: "Desert Dawn", bg: "linear-gradient(135deg, #7C2D12 0%, #C2410C 50%, #F97316 100%)", accent: "#FEF3C7", emoji: "🌅", premium: false },
    { id: 3, name: "Emerald Mosque", bg: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #059669 100%)", accent: "#A7F3D0", emoji: "🕌", premium: true },
    { id: 4, name: "Rose Garden", bg: "linear-gradient(135deg, #831843 0%, #9D174D 50%, #BE185D 100%)", accent: "#FBCFE8", emoji: "🌹", premium: true },
    { id: 5, name: "Midnight Blue", bg: "linear-gradient(135deg, #1E3A5F 0%, #1E40AF 100%)", accent: "#BFDBFE", emoji: "⭐", premium: false },
    { id: 6, name: "Royal Purple", bg: "linear-gradient(135deg, #3B0764 0%, #6D28D9 100%)", accent: "#E9D5FF", emoji: "💜", premium: true },
  ];

  const handleGenerate = async () => {
    if (!name.trim()) return;
    setGenerating(true);
    setGenerated("");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 150,
          messages: [{
            role: "user",
            content: `Write a warm, heartfelt 2-sentence Eid Mubarak greeting personalised for someone named "${name}". Include one short Arabic phrase. Make it beautiful, sincere, and festive. Only output the greeting text, nothing else.`
          }]
        })
      });
      const data = await resp.json();
      const text = data?.content?.[0]?.text || "Eid Mubarak! May this blessed occasion fill your heart with joy and gratitude.";
      setGenerated(text);
    } catch {
      setGenerated(`Eid Mubarak, ${name}! تقبل الله منا ومنكم — May this blessed day bring you and your family endless joy, peace, and prosperity. 🌙`);
    } finally {
      setGenerating(false);
    }
  };

  if (selected !== null) {
    const tpl = templates.find(t => t.id === selected);
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 20px 20px", overflowY: "auto" }}>
        <button onClick={() => setSelected(null)} style={{
          alignSelf: "flex-start", background: "none", border: "none",
          color: "#F5C842", fontFamily: "'DM Sans',sans-serif", fontSize: 14,
          fontWeight: 600, cursor: "pointer", padding: "8px 0", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          ← Back to Templates
        </button>

        {/* Card Preview */}
        <div style={{
          background: tpl.bg, borderRadius: tokens.radius.lg,
          padding: "40px 28px", textAlign: "center", marginBottom: 20,
          position: "relative", overflow: "hidden",
          animation: "cardFloat 4s ease-in-out infinite",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}>
          <IslamicPattern opacity={0.08} />
          <div style={{ fontSize: 52, marginBottom: 12 }}>{tpl.emoji}</div>
          <p style={{
            fontFamily: "'Playfair Display',serif", fontSize: 26,
            fontWeight: 700, color: tpl.accent, marginBottom: 6,
          }}>
            عيد مبارك
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: 16,
            fontStyle: "italic", color: tpl.accent, opacity: 0.8, marginBottom: 14,
          }}>
            Eid Mubarak
          </p>
          {generated && (
            <p style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 13,
              color: tpl.accent, opacity: 0.9, lineHeight: 1.6,
              padding: "0 12px",
            }}>
              {generated}
            </p>
          )}
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 8 }}>
            {[0, 1, 2].map(i => <ArabicOrnament key={i} color={tpl.accent + "60"} size={20} />)}
          </div>
        </div>

        {/* AI Personalise */}
        <div className={theme === "dark" ? "glass-dark" : "glass-light"}
          style={{ borderRadius: tokens.radius.lg, padding: 20, marginBottom: 16 }}>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
            color: t.text, marginBottom: 12,
          }}>
            ✨ AI Personalise
          </p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Recipient's name…"
            style={{
              width: "100%", padding: "12px 16px", borderRadius: tokens.radius.md,
              background: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${t.border}`, color: t.text,
              fontFamily: "'DM Sans',sans-serif", fontSize: 14,
              outline: "none", marginBottom: 12,
            }}
          />
          <button className="btn-gold" onClick={handleGenerate} disabled={generating} style={{
            width: "100%", padding: "13px", borderRadius: tokens.radius.md,
            fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {generating ? (
              <><div style={{
                width: 16, height: 16, border: "2px solid #0A0812",
                borderTopColor: "transparent", borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />Generating…</>
            ) : "✨ Generate Greeting"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-gold" style={{
            flex: 1, padding: "15px", borderRadius: tokens.radius.md, fontSize: 14,
          }}>
            📤 Share Card
          </button>
          <button className="btn-ghost" style={{
            flex: 1, padding: "15px", borderRadius: tokens.radius.md, fontSize: 14,
          }}>
            💾 Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{
          fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700,
          color: t.text, marginBottom: 4,
        }}>
          Eid Cards
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: t.muted }}>
          Choose a template & personalise with AI
        </p>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {["All", "Free", "Premium", "Animated"].map((f, i) => (
          <button key={i} style={{
            padding: "7px 16px", borderRadius: tokens.radius.pill,
            background: i === 0 ? tokens.gold.gradient : "transparent",
            border: i === 0 ? "none" : `1px solid ${t.border}`,
            color: i === 0 ? "#0A0812" : t.muted,
            fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12.5,
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => setSelected(tpl.id)}
            style={{
              background: tpl.bg, borderRadius: tokens.radius.md,
              padding: "24px 16px", textAlign: "center",
              cursor: "pointer", position: "relative", overflow: "hidden",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03) translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
          >
            {tpl.premium && (
              <div style={{
                position: "absolute", top: 8, right: 8,
                background: tokens.gold.gradient,
                padding: "2px 8px", borderRadius: tokens.radius.pill,
                fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 800,
                color: "#0A0812", letterSpacing: 0.5,
              }}>
                PRO
              </div>
            )}
            <IslamicPattern opacity={0.06} />
            <div style={{ fontSize: 36, marginBottom: 8 }}>{tpl.emoji}</div>
            <p style={{
              fontFamily: "'Playfair Display',serif", fontSize: 16,
              color: tpl.accent, fontWeight: 600,
            }}>
              عيد مبارك
            </p>
            <p style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 10.5,
              color: tpl.accent, opacity: 0.7, marginTop: 4,
            }}>
              {tpl.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- DUAS ---
function DuasScreen({ theme }) {
  const t = theme === "dark" ? tokens.dark : tokens.light;
  const [active, setActive] = useState(null);

  const categories = [
    { icon: "🌙", name: "Eid Special", count: 12 },
    { icon: "🤲", name: "General Duas", count: 45 },
    { icon: "💛", name: "For Family", count: 18 },
    { icon: "🕌", name: "After Salah", count: 24 },
  ];
  const duas = [
    {
      ar: "تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ",
      transliteration: "Taqabbalallahu minna wa minkum",
      en: "May Allah accept from us and from you.",
      occasion: "Eid greeting — said to others",
      source: "Fath al-Bari",
    },
    {
      ar: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ",
      transliteration: "Allahumma antas-salam wa minkas-salam",
      en: "O Allah, You are As-Salam (the Peace) and from You comes peace.",
      occasion: "After completing Salah",
      source: "Sahih Muslim",
    },
    {
      ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
      transliteration: "Rabbana atina fid-dunya hasanatan...",
      en: "Our Lord, grant us good in this world and good in the Hereafter.",
      occasion: "General supplication",
      source: "Al-Baqarah 2:201",
    },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{
          fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700,
          color: t.text, marginBottom: 4,
        }}>
          Islamic Duas
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: t.muted }}>
          Prayers for every blessed moment
        </p>
      </div>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: theme === "dark" ? tokens.dark.elevated : "#fff",
        border: `1px solid ${t.border}`,
        borderRadius: tokens.radius.md, padding: "12px 16px", marginBottom: 20,
      }}>
        <span style={{ fontSize: 16 }}>🔍</span>
        <input placeholder="Search duas…" style={{
          flex: 1, background: "none", border: "none", outline: "none",
          fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: t.text,
        }} />
      </div>

      {/* Categories */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {categories.map((c, i) => (
          <div key={i} style={{
            background: theme === "dark" ? tokens.dark.elevated : "#fff",
            border: `1px solid ${t.border}`,
            borderRadius: tokens.radius.md, padding: "14px 16px",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
            transition: "all 0.25s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,200,66,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; }}
          >
            <span style={{ fontSize: 22 }}>{c.icon}</span>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: t.text }}>{c.name}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: t.muted }}>{c.count} duas</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured */}
      <p style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, fontWeight: 700,
        letterSpacing: 2, color: t.muted, textTransform: "uppercase", marginBottom: 14,
      }}>
        🌟 Featured Duas
      </p>

      {duas.map((dua, i) => (
        <div
          key={i}
          onClick={() => setActive(active === i ? null : i)}
          className={theme === "dark" ? "glass-dark" : "glass-light"}
          style={{
            borderRadius: tokens.radius.lg, padding: "20px",
            marginBottom: 14, cursor: "pointer",
            transition: "all 0.3s ease",
            border: active === i ? "1.5px solid rgba(245,200,66,0.5)" : undefined,
          }}
        >
          {/* Arabic */}
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18, direction: "rtl", textAlign: "right",
            lineHeight: 1.7, color: t.text, marginBottom: 10,
          }}>
            {dua.ar}
          </p>
          {/* Transliteration */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 13.5, fontStyle: "italic",
            color: "rgba(245,200,66,0.75)", marginBottom: 6, lineHeight: 1.5,
          }}>
            {dua.transliteration}
          </p>
          {/* Translation */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: t.muted, lineHeight: 1.55,
          }}>
            {dua.en}
          </p>

          {active === i && (
            <div style={{
              marginTop: 14, paddingTop: 14,
              borderTop: `1px solid ${t.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: t.muted }}>
                  📖 {dua.source}
                </p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: t.muted, marginTop: 2 }}>
                  ✨ {dua.occasion}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-gold" style={{
                  padding: "8px 14px", borderRadius: tokens.radius.md, fontSize: 12,
                }}>
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- PROFILE ---
function ProfileScreen({ theme, toggleTheme }) {
  const t = theme === "dark" ? tokens.dark : tokens.light;
  const stats = [
    { label: "Cards Sent", value: "24", icon: "✉️" },
    { label: "Duas Saved", value: "18", icon: "🤲" },
    { label: "Friends", value: "67", icon: "👥" },
  ];
  const settings = [
    { icon: "🌙", label: "Theme", action: toggleTheme, value: theme === "dark" ? "Dark" : "Light" },
    { icon: "🔔", label: "Notifications", action: null, value: "On" },
    { icon: "🌐", label: "Language", action: null, value: "English" },
    { icon: "⭐", label: "Upgrade to Pro", action: null, value: null, gold: true },
    { icon: "ℹ️", label: "About", action: null, value: null },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      {/* Avatar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, marginBottom: 28 }}>
        <div style={{
          width: 84, height: 84, borderRadius: "50%",
          background: tokens.gold.gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, marginBottom: 14,
          boxShadow: `0 0 0 4px ${theme === "dark" ? tokens.dark.bg : tokens.light.bg}, 0 0 0 6px rgba(245,200,66,0.4)`,
        }}>
          🌙
        </div>
        <p style={{
          fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700,
          color: t.text, marginBottom: 3,
        }}>
          Ahmad Al-Rashid
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: t.muted }}>
          ahmad@example.com
        </p>
        <div style={{
          marginTop: 10, padding: "4px 14px", borderRadius: tokens.radius.pill,
          background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.3)",
        }}>
          <span className="gold-text" style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
          }}>
            ✦ FREE PLAN
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: theme === "dark" ? tokens.dark.elevated : "#fff",
            border: `1px solid ${t.border}`,
            borderRadius: tokens.radius.md, padding: "14px 10px", textAlign: "center",
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <p style={{
              fontFamily: "'Playfair Display',serif", fontSize: 22,
              fontWeight: 700, color: "#F5C842", lineHeight: 1,
            }}>
              {s.value}
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: t.muted, marginTop: 4 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <p style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, fontWeight: 700,
        letterSpacing: 2, color: t.muted, textTransform: "uppercase", marginBottom: 14,
      }}>
        Settings
      </p>
      {settings.map((s, i) => (
        <div
          key={i}
          onClick={s.action}
          style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 16px", borderRadius: tokens.radius.md,
            background: s.gold
              ? "linear-gradient(135deg, rgba(245,200,66,0.1) 0%, rgba(201,137,26,0.1) 100%)"
              : (theme === "dark" ? tokens.dark.elevated : "#fff"),
            border: s.gold ? "1px solid rgba(245,200,66,0.35)" : `1px solid ${t.border}`,
            marginBottom: 10, cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: 18 }}>{s.icon}</span>
          <p style={{
            flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500,
            color: s.gold ? "#F5C842" : t.text,
          }}>
            {s.label}
          </p>
          {s.value && (
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: t.muted }}>
              {s.value}
            </span>
          )}
          <span style={{ color: t.muted, fontSize: 14 }}>›</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// APP SHELL
// ============================================================
export default function HappyEidApp() {
  const [theme, setTheme] = useState("dark");
  const [screen, setScreen] = useState("onboarding"); // onboarding | app
  const [tab, setTab] = useState("home");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const t = theme === "dark" ? tokens.dark : tokens.light;
  const toggleTheme = () => setTheme(p => p === "dark" ? "light" : "dark");

  // Phone shell dimensions
  const PHONE_W = 390;
  const PHONE_H = 844;

  const renderScreen = () => {
    switch (tab) {
      case "home": return <HomeScreen theme={theme} setTab={setTab} />;
      case "cards": return <CardsScreen theme={theme} />;
      case "duas": return <DuasScreen theme={theme} />;
      case "profile": return <ProfileScreen theme={theme} toggleTheme={toggleTheme} />;
      default: return null;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0D0A18 0%, #1A1230 50%, #0D0A18 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Design System Label */}
      <div style={{ position: "fixed", top: 20, left: 20 }}>
        <p className="shimmer-text" style={{
          fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700,
        }}>
          Happy Eid ☽
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(245,200,66,0.4)", marginTop: 2 }}>
          Design System v1.0
        </p>
      </div>

      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{
        position: "fixed", top: 20, right: 20,
        background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.25)",
        borderRadius: tokens.radius.pill, padding: "8px 18px",
        color: "#F5C842", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
        cursor: "pointer",
      }}>
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* Screen label row */}
      {screen === "app" && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 8,
        }}>
          {["home", "cards", "duas", "profile"].map(s => (
            <button key={s} onClick={() => setTab(s)} style={{
              padding: "6px 14px", borderRadius: tokens.radius.pill,
              background: tab === s ? "rgba(245,200,66,0.2)" : "rgba(255,255,255,0.05)",
              border: tab === s ? "1px solid rgba(245,200,66,0.4)" : "1px solid rgba(255,255,255,0.08)",
              color: tab === s ? "#F5C842" : "rgba(255,255,255,0.35)",
              fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600,
              cursor: "pointer", textTransform: "capitalize",
            }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Phone Frame */}
      <div style={{
        width: PHONE_W, height: PHONE_H,
        borderRadius: 54,
        background: theme === "dark" ? "#0A0812" : "#FBF7EE",
        boxShadow: "0 50px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,200,66,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
        overflow: "hidden", position: "relative",
        display: "flex", flexDirection: "column",
        transition: "background 0.4s ease",
        outline: "10px solid #1A1530",
        outlineOffset: "-1px",
      }}>
        {/* Notch */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 126, height: 36, background: "#000",
          borderRadius: "0 0 22px 22px", zIndex: 100,
        }} />

        {screen === "onboarding" ? (
          <>
            <StatusBar theme={theme} />
            <OnboardingScreen onComplete={() => setScreen("app")} theme={theme} />
            <HomeIndicator />
          </>
        ) : (
          <>
            <StatusBar theme={theme} />
            {/* Screen Header */}
            <div style={{
              padding: "6px 20px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <p className={theme === "dark" ? "shimmer-text" : "gold-text"} style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 13, fontWeight: 700, letterSpacing: 1,
                }}>
                  Happy Eid ☽
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: theme === "dark" ? tokens.dark.elevated : "#fff",
                  border: `1px solid ${t.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: 16,
                }}>
                  🔔
                </button>
                <button style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: tokens.gold.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: 16,
                }}>
                  🌙
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {renderScreen()}
            </div>

            {/* Tab Bar */}
            <TabBar active={tab} setActive={setTab} theme={theme} />
            <HomeIndicator />
          </>
        )}
      </div>
    </div>
  );
}
