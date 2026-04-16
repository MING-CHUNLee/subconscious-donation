import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import strings from '../strings.json';

const s = strings.moralDecision;

/* ─── 動態募款箱 ────────────────────────────────────── */
function DonationBox({ amount, maxAmount, side, label, sublabel }) {
  const fillPct = maxAmount > 0 ? Math.min((amount / maxAmount) * 100, 100) : 0;
  const isRed = side === 'left';

  const accentColor = isRed ? '#dc2626' : '#d97706';
  const lightColor  = isRed ? '#fee2e2' : '#fef3c7';
  const darkColor   = isRed ? '#991b1b' : '#92400e';
  const glowAnim    = isRed ? 'glow-red' : 'glow-amber';
  const icon        = isRed ? '❤️' : '✊';

  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      {/* 標籤 */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: isRed ? 0 : 1.5 }}
        style={{ marginBottom: 10 }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: accentColor, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#9ca3af' }}>{sublabel}</div>
      </motion.div>

      {/* 募款箱主體 */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* 箱體外框 */}
        <div style={{
          width: 110,
          height: 140,
          background: '#1f2937',
          borderRadius: '6px 6px 10px 10px',
          border: `3px solid ${accentColor}`,
          position: 'relative',
          overflow: 'hidden',
          animation: amount > 0 ? `${glowAnim} 2s ease-in-out infinite` : 'none',
        }}>
          {/* 填充液體（從底部往上） */}
          <motion.div
            animate={{ height: `${fillPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: `linear-gradient(to top, ${darkColor}, ${accentColor})`,
              transformOrigin: 'bottom',
            }}
          />

          {/* 液面波紋 */}
          {fillPct > 0 && (
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                bottom: `${fillPct}%`,
                left: 0,
                right: 0,
                height: 4,
                background: lightColor,
                opacity: 0.6,
              }}
            />
          )}

          {/* 中央圖示 */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
            zIndex: 2,
          }}>
            {icon}
          </div>

          {/* 投幣格線條 */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#111827', zIndex: 3 }} />
        </div>

        {/* 頂部投幣口 */}
        <div style={{
          position: 'absolute',
          top: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 40,
          height: 10,
          background: '#111827',
          border: `2px solid ${accentColor}`,
          borderRadius: 4,
          zIndex: 4,
        }}>
          <div style={{ height: 3, background: '#374151', margin: '2px 4px', borderRadius: 1 }} />
        </div>
      </div>

      {/* 金額顯示 */}
      <motion.div
        key={amount}
        initial={{ scale: 1.3, color: accentColor }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: accentColor,
          marginTop: 14,
          fontFamily: 'monospace',
        }}
      >
        ${amount}
      </motion.div>
    </div>
  );
}

/* ─── 飛行硬幣 ────────────────────────────────────── */
function FlyingCoin({ direction, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{
        x: direction === 'left' ? -140 : 140,
        y: 60,
        scale: 0.2,
        opacity: 0,
      }}
      transition={{ duration: 0.75, ease: 'easeIn' }}
      onAnimationComplete={onDone}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: 22,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      🪙
    </motion.div>
  );
}

/* ─── 主元件 ────────────────────────────────────── */
let coinId = 0;

export default function MoralDecision({ value, onChange, onSubmit }) {
  // value 0 = 100% Red Cross；value 100 = 100% Amnesty
  const careAmount      = 100 - value;
  const fairnessAmount  = value;

  const [coins, setCoins]         = useState([]);
  const prevValueRef              = useRef(value);
  const coinTimerRef              = useRef(null);

  const spawnCoin = useCallback((dir) => {
    const id = ++coinId;
    setCoins((prev) => [...prev, { id, direction: dir }]);
  }, []);

  const removeCoin = useCallback((id) => {
    setCoins((prev) => prev.filter((c) => c.id !== id));
  }, []);

  useEffect(() => {
    const diff = value - prevValueRef.current;
    if (diff !== 0) {
      clearTimeout(coinTimerRef.current);
      const dir = diff < 0 ? 'left' : 'right';
      coinTimerRef.current = setTimeout(() => spawnCoin(dir), 0);
    }
    prevValueRef.current = value;
  }, [value, spawnCoin]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={{
        maxWidth: 560,
        width: '100%',
        background: 'rgba(255,255,255,0.93)',
        backdropFilter: 'blur(10px)',
        borderRadius: 20,
        padding: '32px 28px',
        boxShadow: '0 8px 48px rgba(0,0,0,0.2)',
        border: '3px solid #1d4ed8',
        position: 'relative',
      }}
    >
      {/* 標題列 */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          display: 'inline-block',
          background: '#1e3a5f',
          color: '#fcd34d',
          fontSize: 12,
          fontWeight: 700,
          padding: '4px 16px',
          borderRadius: 99,
          letterSpacing: 2,
          marginBottom: 10,
        }}>
          {s.badge}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1e3a5f', margin: 0 }}>
          {s.title}
        </h2>
        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 6 }}>
          {s.subtitle}
        </p>
      </div>

      {/* 募款箱區域 */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: 20, minHeight: 200 }}>
        <DonationBox
          amount={careAmount}
          maxAmount={100}
          side="left"
          label={s.redCross.label}
          sublabel={s.redCross.sublabel}
        />

        {/* 中央天平裝飾 */}
        <div style={{
          textAlign: 'center',
          paddingBottom: 8,
          color: '#6b7280',
          fontSize: 11,
          userSelect: 'none',
          flexShrink: 0,
          width: 40,
        }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>⚖️</div>
          <div>vs</div>
        </div>

        <DonationBox
          amount={fairnessAmount}
          maxAmount={100}
          side="right"
          label={s.amnesty.label}
          sublabel={s.amnesty.sublabel}
        />

        {/* 飛行硬幣 */}
        <AnimatePresence>
          {coins.map((c) => (
            <FlyingCoin key={c.id} direction={c.direction} onDone={() => removeCoin(c.id)} />
          ))}
        </AnimatePresence>
      </div>

      {/* 滑桿 */}
      <div style={{ padding: '0 8px', marginBottom: 24 }}>
        {/* 滑桿軌道裝飾 */}
        <div style={{
          height: 6,
          borderRadius: 99,
          background: 'linear-gradient(to right, #fee2e2, #e5e7eb, #fef3c7)',
          marginBottom: 12,
          position: 'relative',
        }}>
          {/* 當前位置指示條 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: `${value}%`,
            transform: 'translateX(-50%)',
            width: 3,
            height: '100%',
            background: '#374151',
            borderRadius: 99,
          }} />
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: 6,
            borderRadius: 99,
            appearance: 'none',
            background: `linear-gradient(to right, #dc2626 ${value}%, #e5e7eb ${value}%, #e5e7eb ${value}%, #d97706 ${value}%)`,
            cursor: 'pointer',
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#9ca3af' }}>
          <span>{s.sliderLeft}</span>
          <span>{s.sliderRight}</span>
        </div>
      </div>

      {/* 當前分配預覽 */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 20,
        fontSize: 13,
        color: '#374151',
      }}>
        <span>{s.redCross.label}: <strong style={{ color: '#dc2626' }}>${careAmount}</strong></span>
        <span style={{ color: '#d1d5db' }}>|</span>
        <span>{s.amnesty.label}: <strong style={{ color: '#d97706' }}>${fairnessAmount}</strong></span>
      </div>

      {/* 確認按鈕 */}
      <div style={{ textAlign: 'center' }}>
        <motion.button
          onClick={onSubmit}
          whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(30,58,95,0.4)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: 'linear-gradient(135deg, #1d4ed8, #1e3a5f)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
            padding: '14px 48px',
            borderRadius: 99,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(30,58,95,0.35)',
            letterSpacing: 1,
          }}
        >
          {s.confirmButton}
        </motion.button>
      </div>
    </motion.div>
  );
}
