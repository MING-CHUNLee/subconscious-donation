import { motion } from 'framer-motion';

export default function EmotionPriming({ condition, onNext }) {
  const isCompassion = condition === 'compassion';

  const textContent = isCompassion
    ? '對於每一棵在乾旱中枯萎的樹，\n對於每一條被塑膠阻塞的河流…\n獻給大地之母。'
    : '對於每一棵給予我們滋養的樹，\n對於每一條為我們解渴的溪流…\n獻給大地之母。';

  /* ── 同情組：深沉、雨夜感 ── */
  const compassionStyle = {
    background: 'linear-gradient(160deg, rgba(17,24,39,0.88) 0%, rgba(55,65,81,0.84) 100%)',
    border: '2px solid rgba(156,163,175,0.4)',
    color: '#e5e7eb',
  };

  /* ── 感激組：溫暖、陽光感 ── */
  const gratitudeStyle = {
    background: 'linear-gradient(160deg, rgba(255,251,235,0.93) 0%, rgba(254,243,199,0.88) 100%)',
    border: '2px solid rgba(217,119,6,0.4)',
    color: '#78350f',
  };

  const cardStyle = isCompassion ? compassionStyle : gratitudeStyle;

  const lines = textContent.split('\n');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2 }}
      style={{
        maxWidth: 500,
        width: '100%',
        backdropFilter: 'blur(12px)',
        borderRadius: 20,
        padding: '48px 40px',
        boxShadow: isCompassion
          ? '0 8px 48px rgba(0,0,0,0.5)'
          : '0 8px 48px rgba(217,119,6,0.3)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        ...cardStyle,
      }}
    >
      {/* 裝飾 emoji */}
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: 48, marginBottom: 20 }}
      >
        {isCompassion ? '🌧️' : '🌤️'}
      </motion.div>

      {/* 情境標籤 */}
      <div style={{
        display: 'inline-block',
        background: isCompassion ? 'rgba(255,255,255,0.15)' : 'rgba(217,119,6,0.2)',
        padding: '4px 16px',
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 24,
        letterSpacing: 1,
        color: isCompassion ? '#d1d5db' : '#92400e',
      }}>
        {isCompassion ? '🌿 情境感受' : '☀️ 情境感受'}
      </div>

      {/* 詩句逐行顯示 */}
      <div style={{ marginBottom: 36 }}>
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.6, duration: 0.8 }}
            style={{
              fontSize: 19,
              fontFamily: 'Georgia, serif',
              lineHeight: 2,
              margin: 0,
              fontWeight: i === lines.length - 1 ? 700 : 400,
              fontStyle: i < lines.length - 1 ? 'italic' : 'normal',
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* 分隔線 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        style={{
          height: 2,
          background: isCompassion
            ? 'linear-gradient(to right, transparent, rgba(156,163,175,0.5), transparent)'
            : 'linear-gradient(to right, transparent, rgba(217,119,6,0.5), transparent)',
          margin: '0 auto 28px',
          maxWidth: 200,
        }}
      />

      {/* 下一步按鈕 */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.5 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        style={{
          background: isCompassion
            ? 'linear-gradient(135deg, #374151, #1f2937)'
            : 'linear-gradient(135deg, #d97706, #b45309)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 15,
          padding: '12px 36px',
          borderRadius: 99,
          border: 'none',
          cursor: 'pointer',
          boxShadow: isCompassion
            ? '0 4px 16px rgba(0,0,0,0.4)'
            : '0 4px 16px rgba(217,119,6,0.4)',
          letterSpacing: 1,
        }}
      >
        {isCompassion ? '繼續 →' : '前往捐款亭 →'}
      </motion.button>

      {/* 底部裝飾粒子（靜態） */}
      {isCompassion ? (
        <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 20, opacity: 0.3 }}>💧</div>
      ) : (
        <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 20, opacity: 0.4, animation: 'float 3s ease-in-out infinite' }}>✨</div>
      )}
    </motion.div>
  );
}
