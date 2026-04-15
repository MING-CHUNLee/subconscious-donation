import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const GAS_URL = import.meta.env.VITE_GAS_URL;

/* ─── 紙花 ────────────────────────────────────── */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 2.5 + Math.random() * 2,
        color: ['#dc2626', '#d97706', '#1d4ed8', '#16a34a', '#7c3aed', '#fcd34d'][i % 6],
        size: 8 + Math.random() * 8,
      })),
    []
  );

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.id % 3 === 0 ? '50%' : 2,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── 迷你募款箱（結果顯示用） ─────────────────── */
function ResultBox({ amount, color, icon, label }) {
  const fillPct = amount;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div style={{
          width: 72,
          height: 90,
          background: '#1f2937',
          border: `3px solid ${color}`,
          borderRadius: '4px 4px 8px 8px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <motion.div
            initial={{ height: '0%' }}
            animate={{ height: `${fillPct}%` }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: `linear-gradient(to top, ${color}cc, ${color})`,
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            zIndex: 2,
          }}>
            {icon}
          </div>
        </div>
        {/* 投幣口 */}
        <div style={{
          position: 'absolute',
          top: -7,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 26,
          height: 8,
          background: '#111827',
          border: `2px solid ${color}`,
          borderRadius: 3,
        }} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color, marginTop: 8, fontFamily: 'monospace' }}>${amount}</div>
      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* ─── 主元件 ────────────────────────────────────── */
export default function Debriefing({ condition, donationSplit }) {
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasSent = useRef(false);

  const careAmount      = 100 - donationSplit;
  const fairnessAmount  = donationSplit;
  const isCompassion    = condition === 'compassion';

  useEffect(() => {
    if (hasSent.current) return;
    hasSent.current = true;

    // 啟動紙花
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);

    const postData = async () => {
      const payload = { condition, careAmount, fairnessAmount };
      try {
        await fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error('資料傳輸失敗', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    postData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: 580,
          width: '100%',
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: '0 8px 48px rgba(0,0,0,0.2)',
          border: '3px solid #7c3aed',
        }}
      >
        {/* 標題 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: 20 }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔬</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#7c3aed', margin: 0 }}>
            這是一場心理學實驗
          </h2>
          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>
            您的捐款決定可能受到了潛意識的影響
          </p>
        </motion.div>

        {/* 您的捐款結果 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            padding: '20px 24px',
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 16, textAlign: 'center' }}>
            🏆 您的捐款結果
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
            <ResultBox amount={careAmount}     color="#dc2626" icon="❤️" label="Red Cross" />
            <div style={{ fontSize: 20, paddingBottom: 40 }}>⚖️</div>
            <ResultBox amount={fairnessAmount} color="#d97706" icon="✊" label="Amnesty" />
          </div>
        </motion.div>

        {/* 實驗說明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            background: isCompassion
              ? 'linear-gradient(135deg, #eff6ff, #dbeafe)'
              : 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            border: `2px solid ${isCompassion ? '#93c5fd' : '#86efac'}`,
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 8, letterSpacing: 1 }}>
            系統隨機分派給您的組別
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: isCompassion ? '#1d4ed8' : '#15803d' }}>
            {isCompassion ? '💙 同情 (Compassion) 組' : '💚 感激 (Gratitude) 組'}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
            {isCompassion
              ? '前導情境旨在喚起同情心，驅使您關注「減輕痛苦（Care）」的目標'
              : '前導情境旨在喚起感激之情，驅使您關注「公平正義（Fairness）」的目標'}
          </div>
        </motion.div>

        {/* 研究背景 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 16 }}
        >
          <p style={{ margin: '0 0 10px' }}>
            根據 <strong>Goenka &amp; van Osselaer (2019)</strong> 的研究：
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontWeight: 700, color: '#1d4ed8', marginBottom: 4, fontSize: 12 }}>同情心 (Compassion)</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>→ 傾向捐給強調「關懷」的組織</div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontWeight: 700, color: '#15803d', marginBottom: 4, fontSize: 12 }}>感激之情 (Gratitude)</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>→ 傾向捐給強調「公平」的組織</div>
            </div>
          </div>
        </motion.div>

        {/* 送出狀態 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: isSubmitting ? '#9ca3af' : '#16a34a',
            padding: '10px',
            background: isSubmitting ? '#f9fafb' : '#f0fdf4',
            borderRadius: 8,
            border: `1px solid ${isSubmitting ? '#e5e7eb' : '#bbf7d0'}`,
          }}
        >
          {isSubmitting
            ? '⏳ 正在將您的數據整合至全班統計資料庫…'
            : '✅ 數據已同步完成。請看台上的全班統計結果！'}
        </motion.div>
      </motion.div>
    </>
  );
}
