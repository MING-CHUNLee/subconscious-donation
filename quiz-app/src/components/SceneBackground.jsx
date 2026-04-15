import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

/* ─── 雲朵 ─────────────────────────────────────────── */
function Cloud({ x, y, scale, delay }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, zIndex: 1 }}
      animate={{ x: [0, 45, 0] }}
      transition={{ duration: 14 + delay * 4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'left top' }}>
        <div style={{ position: 'relative', width: 90, height: 36 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 90, height: 28, background: 'white', borderRadius: 99, opacity: 0.88 }} />
          <div style={{ position: 'absolute', bottom: 12, left: 14, width: 48, height: 48, background: 'white', borderRadius: 99, opacity: 0.88 }} />
          <div style={{ position: 'absolute', bottom: 10, left: 44, width: 36, height: 36, background: 'white', borderRadius: 99, opacity: 0.88 }} />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── 雨效果 ─────────────────────────────────────────── */
function RainEffect() {
  const drops = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.8 + Math.random() * 0.6,
        height: 12 + Math.random() * 10,
      })),
    []
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {drops.map((d) => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.left}%`,
            top: 0,
            width: 2,
            height: d.height,
            background: 'rgba(147,197,253,0.55)',
            borderRadius: 2,
            animation: `rain-drop ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── 陽光粒子 ─────────────────────────────────────────── */
function SparkleEffect() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        top: 5 + Math.random() * 60,
        delay: Math.random() * 3,
        size: 10 + Math.random() * 14,
        char: ['✨', '🌟', '⭐', '💛', '🌸'][Math.floor(Math.random() * 5)],
      })),
    []
  );
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      {sparks.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: s.size,
            animation: `sparkle-pop ${2 + s.delay * 0.5}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {s.char}
        </div>
      ))}
    </div>
  );
}

/* ─── 落葉 ─────────────────────────────────────────── */
function LeafEffect() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 2,
        char: ['🍂', '🍁', '🌿', '🍃'][Math.floor(Math.random() * 4)],
      })),
    []
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {leaves.map((l) => (
        <div
          key={l.id}
          style={{
            position: 'absolute',
            left: `${l.left}%`,
            top: 0,
            fontSize: 16,
            animation: `leaf-drift ${l.duration}s ease-in ${l.delay}s infinite`,
          }}
        >
          {l.char}
        </div>
      ))}
    </div>
  );
}

/* ─── 主場景 ─────────────────────────────────────────── */
export default function SceneBackground({ condition, step }) {
  const isCompassion = condition === 'compassion';
  const isPriming = step === 1;
  const isDebriefing = step === 3;

  const skyStyle = useMemo(() => {
    if (isPriming && isCompassion)
      return { background: 'linear-gradient(to bottom, #1f2937, #4b5563)' };
    if (isPriming && !isCompassion)
      return { background: 'linear-gradient(to bottom, #f59e0b, #fef3c7)' };
    if (isDebriefing)
      return { background: 'linear-gradient(to bottom, #4338ca, #c4b5fd)' };
    return { background: 'linear-gradient(to bottom, #38bdf8, #bae6fd)' };
  }, [condition, step, isCompassion, isPriming, isDebriefing]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* 天空 */}
      <motion.div
        className="absolute inset-0"
        animate={skyStyle}
        transition={{ duration: 2 }}
        style={skyStyle}
      />

      {/* 太陽 / 月亮 */}
      <AnimatePresence>
        {!isPriming || !isCompassion ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              top: '8%',
              right: '10%',
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: isDebriefing ? '#c084fc' : '#fde047',
              animation: 'float 6s ease-in-out infinite, sun-pulse 3s ease-in-out infinite',
              zIndex: 1,
            }}
          />
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'absolute',
              top: '8%',
              right: '10%',
              width: 60,
              height: 60,
              zIndex: 1,
              animation: 'float 6s ease-in-out infinite',
            }}
          >
            {/* 月亮 */}
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#d1d5db', boxShadow: '0 0 20px #d1d5db', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -6, left: 12, width: 54, height: 54, borderRadius: '50%', background: '#374151' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 雲朵 */}
      <Cloud x={5}  y={10} scale={1.1} delay={0} />
      <Cloud x={40} y={7}  scale={0.75} delay={4} />
      <Cloud x={68} y={13} scale={0.85} delay={8} />

      {/* 街道 SVG 場景 */}
      <svg
        style={{ position: 'absolute', bottom: 0, width: '100%', height: 240 }}
        viewBox="0 0 1400 240"
        preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === 地面 === */}
        <rect x="0"   y="175" width="1400" height="65" fill="#5c4a32" />
        <rect x="0"   y="170" width="1400" height="10" fill="#a09070" />
        <rect x="0"   y="178" width="1400" height="2"  fill="#6b5b45" />
        {/* 地磚縫 */}
        {[200,400,600,800,1000,1200].map(x => (
          <line key={x} x1={x} y1="170" x2={x} y2="240" stroke="#6b5b45" strokeWidth="2" />
        ))}

        {/* === 左後方小建築 === */}
        <rect x="0"   y="90"  width="95"  height="80"  fill="#d1fae5" stroke="#6ee7b7" strokeWidth="2" rx="2" />
        <polygon points="-10,90 105,90 95,58 0,58" fill="#059669" />

        {/* === 慈善商店（左） === */}
        {/* 屋頂 */}
        <polygon points="30,48 260,48 248,8 42,8" fill="#92400e" />
        <polygon points="30,48 260,48 255,30 35,30" fill="#b45309" />
        {/* 屋身 */}
        <rect x="30" y="48" width="230" height="122" fill="#fffbeb" stroke="#d97706" strokeWidth="3" rx="0 0 3 3" />
        {/* 左窗 */}
        <rect x="48"  y="68" width="52" height="52" fill="#fde68a" stroke="#f59e0b" strokeWidth="2" rx="4" />
        <line x1="74" y1="68" x2="74" y2="120" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="48" y1="94" x2="100" y2="94" stroke="#f59e0b" strokeWidth="1.5" />
        {/* 右窗 */}
        <rect x="168" y="68" width="52" height="52" fill="#fde68a" stroke="#f59e0b" strokeWidth="2" rx="4"
              style={{ animation: 'window-shimmer 3.5s ease-in-out 1.5s infinite' }} />
        <line x1="194" y1="68" x2="194" y2="120" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="168" y1="94" x2="220" y2="94" stroke="#f59e0b" strokeWidth="1.5" />
        {/* 門 */}
        <rect x="110" y="100" width="55" height="70" fill="#92400e" rx="28 28 0 0" />
        <circle cx="158" cy="136" r="4" fill="#fcd34d" />
        {/* 招牌 */}
        <rect x="68" y="14" width="150" height="22" fill="#dc2626" rx="5" />
        <text x="143" y="29" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui">❤️ 慈善商店</text>
        {/* 遮陽棚 */}
        <polygon points="26,122 264,122 274,140 16,140" fill="#dc2626" opacity="0.85" />
        {[56,106,156,206].map(x => (
          <line key={x} x1={x} y1="122" x2={x-10} y2="140" stroke="#b91c1c" strokeWidth="1.5" />
        ))}
        {/* 募款箱（小） */}
        <rect x="38"  y="138" width="28" height="32" fill="#dc2626" rx="3" />
        <rect x="43"  y="135" width="18" height="5"  fill="#991b1b" rx="2" />
        <text x="52"  y="159" textAnchor="middle" fill="white" fontSize="8">❤</text>

        {/* === 左側樹木 === */}
        <polygon points="292,100 310,62 328,100" fill="#16a34a" />
        <polygon points="286,115 310,77 334,115" fill="#15803d" />
        <rect x="303" y="115" width="14" height="55" fill="#92400e" />

        <polygon points="346,108 360,74 374,108" fill="#16a34a" />
        <polygon points="341,120 360,86 379,120" fill="#15803d" />
        <rect x="353" y="120" width="12" height="50" fill="#92400e" />

        {/* === 慈善捐款亭（中央、最高） === */}
        {/* 屋頂（兩層） */}
        <polygon points="390,22 740,22 720,0  410,0"  fill="#1e40af" />
        <polygon points="375,28 755,28 735,6  395,6"  fill="#1d4ed8" />
        {/* 頂部裝飾旗 */}
        <line x1="565" y1="0" x2="565" y2="-18" stroke="#fcd34d" strokeWidth="3" />
        <polygon points="565,-18 590,-10 565,-2" fill="#fcd34d" />
        {/* 屋身 */}
        <rect x="375" y="28" width="380" height="142" fill="#1e3a5f" stroke="#1d4ed8" strokeWidth="4" rx="3" />
        {/* 左窗戶 */}
        <rect x="390" y="40" width="80" height="95" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" rx="5" />
        <rect x="400" y="50" width="60" height="65" fill="rgba(147,197,253,0.22)" rx="3" />
        {/* 右窗戶 */}
        <rect x="660" y="40" width="80" height="95" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" rx="5" />
        <rect x="670" y="50" width="60" height="65" fill="rgba(147,197,253,0.22)" rx="3" />
        {/* 中央門 + 布幕 */}
        <rect x="510" y="52" width="110" height="118" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="12 12 0 0" />
        <rect x="510" y="52" width="55"  height="113" fill="#dc2626" opacity="0.75" rx="12 0 0 0" />
        <rect x="565" y="52" width="55"  height="113" fill="#dc2626" opacity="0.75" rx="0 12 0 0" />
        {/* 布幕繩 */}
        <line x1="510" y1="52" x2="620" y2="52" stroke="#fcd34d" strokeWidth="3" />
        {/* 招牌 */}
        <rect x="440" y="9" width="250" height="24" fill="#fcd34d" rx="6" />
        <text x="565" y="25" textAnchor="middle" fill="#1e3a8a" fontSize="13" fontWeight="bold" fontFamily="system-ui">🗳️ 慈善捐款亭</text>
        {/* 兩側小募款箱 */}
        <rect x="387" y="136" width="38" height="34" fill="#dc2626" rx="4" />
        <rect x="393" y="132" width="26" height="6"  fill="#991b1b" rx="2" />
        <text x="406" y="158" textAnchor="middle" fill="white" fontSize="9">❤</text>

        <rect x="705" y="136" width="38" height="34" fill="#d97706" rx="4" />
        <rect x="711" y="132" width="26" height="6"  fill="#92400e" rx="2" />
        <text x="724" y="158" textAnchor="middle" fill="white" fontSize="9">✊</text>

        {/* === 右側樹木 === */}
        <polygon points="772,102 788,66 804,102" fill="#16a34a" />
        <polygon points="767,116 788,80 809,116" fill="#15803d" />
        <rect x="781" y="116" width="13" height="54" fill="#92400e" />

        <polygon points="824,112 838,80 852,112" fill="#16a34a" />
        <polygon points="819,124 838,92 857,124" fill="#15803d" />
        <rect x="831" y="124" width="12" height="46" fill="#92400e" />

        {/* === 人權中心（右） === */}
        {/* 屋頂 */}
        <polygon points="870,52 1100,52 1088,10 882,10" fill="#78350f" />
        <polygon points="870,52 1100,52 1095,34 875,34" fill="#92400e" />
        {/* 屋身 */}
        <rect x="870" y="52" width="230" height="118" fill="#fff7ed" stroke="#f59e0b" strokeWidth="3" rx="0 0 3 3" />
        {/* 左窗 */}
        <rect x="888" y="72" width="52" height="50" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="4"
              style={{ animation: 'window-shimmer 4s ease-in-out 2s infinite' }} />
        <line x1="914" y1="72" x2="914" y2="122" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="888" y1="97" x2="940" y2="97"  stroke="#f59e0b" strokeWidth="1.5" />
        {/* 右窗 */}
        <rect x="1020" y="72" width="52" height="50" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="4" />
        <line x1="1046" y1="72" x2="1046" y2="122" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="1020" y1="97"  x2="1072" y2="97"  stroke="#f59e0b" strokeWidth="1.5" />
        {/* 門 */}
        <rect x="950" y="105" width="60" height="65" fill="#78350f" rx="8 8 0 0" />
        <circle cx="1003" cy="140" r="4" fill="#fcd34d" />
        {/* 招牌 */}
        <rect x="905" y="16" width="160" height="22" fill="#b45309" rx="5" />
        <text x="985" y="31" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui">✊ 人權中心</text>
        {/* 遮陽棚 */}
        <polygon points="866,125 1104,125 1114,143 856,143" fill="#f59e0b" opacity="0.85" />
        {[916,966,1016,1066].map(x => (
          <line key={x} x1={x} y1="125" x2={x-10} y2="143" stroke="#d97706" strokeWidth="1.5" />
        ))}
        {/* 募款箱 */}
        <rect x="1074" y="138" width="28" height="32" fill="#d97706" rx="3" />
        <rect x="1079" y="135" width="18" height="5"  fill="#92400e" rx="2" />
        <text x="1088" y="159" textAnchor="middle" fill="white" fontSize="8">✊</text>

        {/* === 右後方建築 === */}
        <rect x="1160" y="75" width="160" height="95"  fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" rx="2" />
        <polygon points="1150,75 1330,75 1318,42 1162,42" fill="#6b7280" />
        <rect x="1175" y="90"  width="35" height="35" fill="#fde68a" stroke="#f59e0b" strokeWidth="1" rx="3" />
        <rect x="1250" y="90"  width="35" height="35" fill="#fde68a" stroke="#f59e0b" strokeWidth="1" rx="3" />
        <rect x="1200" y="110" width="45" height="60" fill="#6b7280" rx="4 4 0 0" />

        {/* 最右路燈 */}
        <line x1="1120" y1="60" x2="1120" y2="170" stroke="#374151" strokeWidth="5" />
        <path d="M1120,60 Q1155,55 1158,75" stroke="#374151" strokeWidth="4" fill="none" />
        <ellipse cx="1158" cy="76" rx="10" ry="6" fill="#fde68a" />

        {/* 左路燈 */}
        <line x1="310" y1="70" x2="310" y2="170" stroke="#374151" strokeWidth="5" />
        <path d="M310,70 Q275,65 272,85" stroke="#374151" strokeWidth="4" fill="none" />
        <ellipse cx="272" cy="86" rx="10" ry="6" fill="#fde68a" />
      </svg>

      {/* 氛圍特效 */}
      {isPriming && isCompassion  && <RainEffect />}
      {isPriming && !isCompassion && <SparkleEffect />}
      {isPriming && !isCompassion && <LeafEffect />}
    </div>
  );
}
