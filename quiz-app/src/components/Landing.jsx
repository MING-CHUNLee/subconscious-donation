import { motion } from 'framer-motion';
import strings from '../strings.json';

const s = strings.landing;

export default function Landing({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      style={{
        maxWidth: 480,
        width: '100%',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderRadius: 20,
        padding: '40px 36px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        border: '3px solid #d97706',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 裝飾角落 */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, background: 'linear-gradient(135deg, #fef3c7, transparent)', borderRadius: '0 0 80px 0' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 80, height: 80, background: 'linear-gradient(315deg, #fee2e2, transparent)', borderRadius: '80px 0 0 0' }} />

      {/* 上方橫幅 */}
      <div style={{
        display: 'inline-block',
        background: '#dc2626',
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        padding: '4px 16px',
        borderRadius: 99,
        letterSpacing: 2,
        marginBottom: 20,
      }}>
        {s.badge}
      </div>

      {/* 標題 */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ fontSize: 32, fontWeight: 900, color: '#1e3a5f', marginBottom: 8, lineHeight: 1.2 }}
      >
        {s.title}
      </motion.h1>

      {/* 裝飾線 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={{ height: 3, background: 'linear-gradient(to right, #dc2626, #d97706)', borderRadius: 99, margin: '12px auto', maxWidth: 120 }}
      />

      {/* 說明文字 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        style={{ color: '#6b7280', lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}
      >
        {s.description}
        <br />
        <span style={{ fontSize: 13, color: '#9ca3af' }}>{s.hint}</span>
      </motion.p>

      {/* 小圖示列 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28 }}
      >
        {s.icons.map((item) => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, marginBottom: 4, animation: 'float-slow 3s ease-in-out infinite' }}>{item.icon}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{item.label}</div>
          </div>
        ))}
      </motion.div>

      {/* 開始按鈕 */}
      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.06, boxShadow: '0 6px 24px rgba(220,38,38,0.4)' }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16,
          padding: '14px 40px',
          borderRadius: 99,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(220,38,38,0.35)',
          letterSpacing: 1,
        }}
      >
        {s.startButton}
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ fontSize: 11, color: '#d1d5db', marginTop: 16 }}
      >
        {s.disclaimer}
      </motion.p>
    </motion.div>
  );
}
