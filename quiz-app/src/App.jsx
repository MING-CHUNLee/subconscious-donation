import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import EmotionPriming from './components/EmotionPriming';
import MoralDecision from './components/MoralDecision';
import Debriefing from './components/Debriefing';
import SceneBackground from './components/SceneBackground';

export default function App() {
  const [step, setStep] = useState(0); // 0=landing, 1=priming, 2=decision, 3=debrief
  const [condition, setCondition] = useState('');
  const [donationSplit, setDonationSplit] = useState(50);

  useEffect(() => {
    setCondition(Math.random() > 0.5 ? 'compassion' : 'gratitude');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 持續顯示的街道場景背景 */}
      <SceneBackground condition={condition} step={step} />

      {/* 內容層 */}
      <div
        className="relative flex flex-col items-center justify-center p-4"
        style={{ zIndex: 10, minHeight: '100vh', paddingBottom: 200 }}
      >
        {step === 0 && <Landing onStart={() => setStep(1)} />}
        {step === 1 && <EmotionPriming condition={condition} onNext={() => setStep(2)} />}
        {step === 2 && (
          <MoralDecision
            value={donationSplit}
            onChange={setDonationSplit}
            onSubmit={() => setStep(3)}
          />
        )}
        {step === 3 && <Debriefing condition={condition} donationSplit={donationSplit} />}
      </div>
    </div>
  );
}
