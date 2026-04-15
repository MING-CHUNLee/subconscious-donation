這是一個非常棒的技術架構選擇！利用 Google Sheets 作為後端資料庫，對於小型專案或原型開發來說非常高效且成本極低。

為了幫助你實作，我整理了一份詳細的實作指南 Markdown 檔案內容。這份文件不僅包含技術步驟，也將這篇論文（Goenka & van Osselaer, 2019）的核心研究邏輯嵌入到遊戲流程中。

---

### **已確認設計決策**

| 項目 | 決策 |
|---|---|
| 情緒植入方式 | 詩句閱讀（對應 Study 2 廣告文字操控，非 essay writing） |
| 慈善機構選擇 | **Red Cross**（Care）vs **Amnesty International**（Fairness） |
| 選擇原因 | 論文 intro 直接點名為典型對比；台灣／國際學生皆認識 |
| 操控確認（Manipulation Check） | 不加（課堂示範用，非正式研究） |
| 知情同意頁 | 不加 |
| 全班統計視覺化 | 直接開 Google Sheets 給全班看 |
| 部署 | 本地開發優先，完成後部署至 Vercel |
| Exchange norms 邊界條件（Study 5）| 目前不納入 |

---

### **實作指南：道德契合度互動遊戲 (React + Google Apps Script)**

這份文件說明如何建立一個讓使用者在「不知情」狀況下參與心理實驗的互動網頁，並將數據存儲至 Google Sheets。

#### **1. 系統架構**


* **Frontend**: React (Vite) + Tailwind CSS + Framer Motion (動畫)。
* **Backend**: Google Apps Script (GAS) 部署為 Web App，提供 API 端點。
* **Database**: Google Sheets。

---

#### **2. 遊戲流程設計 (基於論文 Study 2 & 4)**

為了達到「Aha! Moment」，我們將玩家隨機分配到「同情組」或「感激組」。

1.  **進入畫面 (Landing)**：簡單的遊戲標題，點擊「開始測試」。
2.  **情緒啟發 (Implicit Priming)**：
    * [cite_start]**隨機 A 組 (Compassion)**：顯示論文中「樹木枯萎、河流阻塞」的詩句 [cite: 290]。
    * [cite_start]**隨機 B 組 (Gratitude)**：顯示論文中「樹木滋養、溪流解渴」的詩句 [cite: 290]。
3.  **捐款抉擇 (Decision)**：
    * 介紹兩個真實且全球知名的慈善機構（論文 intro 直接引用為典型對比案例）：
    * 讓玩家用滑桿分配 \$100：
        * **Red Cross（紅十字會）— Care**：強調人道救援、減輕苦難、緊急照護。
        * **Amnesty International（國際特赦組織）— Fairness**：強調人權倡議、公平正義、制度改革。
4.  **數據上傳**：玩家點擊確認後，資料非同步傳送到 Google Sheets。
5.  **揭曉真相 (The Reveal)**：
    * 告訴玩家剛才的文字是為了觸發特定情緒。
    * [cite_start]引用論文結論：同情心會提升對「關懷」目標的偏好；感激之情則提升對「公平」目標的偏好 [cite: 9, 52]。

---

#### **3. 後端實作：Google Apps Script (GAS)**

請在 Google Sheet 中點擊「擴充功能」>「Apps Script」，並貼入以下代碼：

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // 寫入資料欄位：時間, 組別, 專案A金額, 專案B金額
  sheet.appendRow([
    new Date(), 
    data.condition, 
    data.careAmount, 
    data.fairnessAmount
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```
* **注意**：部署時必須選擇「所有人 (Anyone)」都能存取，並記下產生的 Web App URL。

---

#### **4. 前端實作：React 核心邏輯**

使用 `fetch` 將資料送往 GAS：

```jsx
const handleSubmit = async (choiceData) => {
  const GAS_URL = "你的Apps_Script_URL";
  
  try {
    await fetch(GAS_URL, {
      method: "POST",
      mode: "no-cors", // 注意：GAS 跨網域通常需使用 no-cors
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(choiceData)
    });
    // 轉向結果頁面
  } catch (error) {
    console.error("儲存失敗", error);
  }
};
```

---

#### **5. 論文核心概念總結 (用於遊戲結束後的教育區)**

在遊戲最後，你可以加入以下科普內容來提升專案深度：

* **道德領域理論 (Moral Foundations Theory)**：
    * [cite_start]**Harm/Care (傷害/關懷)**：關於減輕痛苦與提供照護 [cite: 68]。
    * [cite_start]**Fairness/Reciprocity (公平/互惠)**：關於社會資源的公平分配與正義 [cite: 69]。
* **道德契合效果 (Moral Congruence)**：
    * [cite_start]**同情 (Compassion)** 與關懷領域契合，因為它進化來加強對弱者的保護 [cite: 115, 118]。
    * [cite_start]**感激 (Gratitude)** 與公平領域契合，因為它強化了對互惠與社會資源分配的敏感度 [cite: 136, 144]。
* **實務應用**：
    * [cite_start]慈善機構（如紅十字會 vs. ACLU）應根據其核心目標選擇適當的宣傳情緒 [cite: 53]。
    * [cite_start]**注意！** 若強調「捐款換贈品」（交換規範），這種由情緒驅動的道德偏好會消失 [cite: 168, 523]。

---

### **建議開發順序**
1.  **環境設定**：建立 Google Sheet 並完成 Apps Script 部署。
2.  **前端 A/B Test 邏輯**：確保 `Math.random()` 能正確分發不同的啟發文字。
3.  **UI/UX 動畫**：利用 `framer-motion` 製作文字淡入效果，增加「心理學實驗」的專業感。
4.  **測試數據流**：確認點擊捐款後，Google Sheet 真的有增加一列資料。


針對這個網頁互動遊戲的開發計畫，以下提供各個階段的 React 實作細節與 Tailwind CSS 樣式建議。架構將區分為狀態管理與三個主要畫面組件。

### 1. 狀態管理與主控台 (App.jsx)

為了在不同階段間切換並保留使用者的分派條件與選擇，建議在最上層的組件統一管理狀態。

```jsx
import React, { useState, useEffect } from 'react';
import EmotionPriming from './EmotionPriming';
import MoralDecision from './MoralDecision';
import Debriefing from './Debriefing';

export default function App() {
  const [step, setStep] = useState(1);
  const [condition, setCondition] = useState('');
  const [donationSplit, setDonationSplit] = useState(50); // 0-100，代表資金分配比例

  // 初始化階段：隨機分派條件
  useEffect(() => {
    const isCompassion = Math.random() > 0.5;
    setCondition(isCompassion ? 'compassion' : 'gratitude');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {step === 1 && <EmotionPriming condition={condition} onNext={() => setStep(2)} />}
      {step === 2 && <MoralDecision value={donationSplit} onChange={setDonationSplit} onSubmit={() => setStep(3)} />}
      {step === 3 && <Debriefing condition={condition} donationSplit={donationSplit} />}
    </div>
  );
}
```

---

### 2. 階段一：情緒植入 (EmotionPriming.jsx)

此階段的目標是讓使用者專注閱讀，不應有過多的視覺干擾。CSS 樣式應強調文字的排版。

* **樣式建議：** 使用襯線字體（Serif）增加詩句的文學感，設定適當的行高（Leading）與字距（Tracking），背景保持簡潔。
* **動畫建議：** 運用 `framer-motion` 讓文字緩慢淡入，強制使用者放慢閱讀速度。

```jsx
import { motion } from 'framer-motion';

export default function EmotionPriming({ condition, onNext }) {
  const textContent = condition === 'compassion' 
    ? "對於每一棵在乾旱中枯萎的樹，\n對於每一條被塑膠阻塞的河流...\n獻給大地之母。"
    : "對於每一棵給予我們滋養的樹，\n對於每一條為我們解渴的溪流...\n獻給大地之母。";

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1.5 }}
      className="max-w-lg w-full bg-white p-8 md:p-12 shadow-sm rounded-lg text-center"
    >
      <p className="whitespace-pre-line text-lg md:text-xl font-serif text-gray-700 leading-loose mb-10">
        {textContent}
      </p>
      <button 
        onClick={onNext}
        className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
      >
        下一步
      </button>
    </motion.div>
  );
}
```

---

### 3. 階段二：道德抉擇 (MoralDecision.jsx)

此階段需要呈現拉霸（Slider）並即時顯示資源分配的變化。

* **樣式建議：** 拉霸應顯眼且易於在行動裝置上觸控操作。兩端的選項卡片需使用響應式網格（Grid 或 Flex）對齊。
* **實作重點：** 使用 `<input type="range">` 作為核心控制元件。

```jsx
export default function MoralDecision({ value, onChange, onSubmit }) {
  // value 為 0 代表 100% 給專案甲，100 代表 100% 給專案乙
  const careAmount = 100 - value;
  const fairnessAmount = value;

  return (
    <div className="max-w-2xl w-full bg-white p-6 md:p-10 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">分配您的 $100 捐款</h2>
      
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        {/* Red Cross (Care) 卡片 */}
        <div className="flex-1 p-4 border rounded-md border-red-200 bg-red-50 text-center">
          <h3 className="font-semibold text-red-800">🔴 Red Cross（紅十字會）</h3>
          <p className="text-sm text-gray-600 mt-2">人道救援 · 緊急醫療照護 · 減輕苦難</p>
          <div className="text-xl font-bold mt-4 text-red-600">${careAmount}</div>
        </div>

        {/* Amnesty International (Fairness) 卡片 */}
        <div className="flex-1 p-4 border rounded-md border-amber-200 bg-amber-50 text-center">
          <h3 className="font-semibold text-amber-800">✊ Amnesty International</h3>
          <p className="text-sm text-gray-600 mt-2">人權倡議 · 公平正義 · 制度改革</p>
          <div className="text-xl font-bold mt-4 text-amber-600">${fairnessAmount}</div>
        </div>
      </div>

      {/* 滑桿區塊 */}
      <div className="mb-10">
        <input 
          type="range" 
          min="0" max="100" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
        />
      </div>

      <div className="text-center">
        <button 
          onClick={onSubmit}
          className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded shadow hover:bg-indigo-700 transition-colors"
        >
          確認捐款
        </button>
      </div>
    </div>
  );
}
```

---

### 4. 階段三：揭密與資料傳輸 (Debriefing.jsx)

此組件在掛載時執行資料傳輸，並同步展示文獻解析。

* **樣式建議：** 使用對比色塊標示使用者剛剛經歷的心理機制，強調實驗結果與文獻理論。

```jsx
import React, { useEffect, useState } from 'react';

export default function Debriefing({ condition, donationSplit }) {
  const [isSubmitting, setIsSubmitting] = useState(true);

  const careAmount = 100 - donationSplit;
  const fairnessAmount = donationSplit;

  useEffect(() => {
    const postData = async () => {
      const payload = {
        condition,
        careAmount,
        fairnessAmount
      };

      try {
        // 替換為實際的 Google Apps Script 部署 URL
        const GAS_URL = "YOUR_GAS_WEB_APP_URL";
        await fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.error("資料傳輸失敗");
      } finally {
        setIsSubmitting(false);
      }
    };

    postData();
  }, [condition, careAmount, fairnessAmount]);

  return (
    <div className="max-w-2xl w-full bg-white p-6 md:p-10 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center text-red-600 mb-6">這是一場心理學實驗</h2>
      
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          您剛剛的捐款決定，可能受到了潛意識的影響。
        </p>
        <div className="p-4 bg-gray-100 rounded-md border-l-4 border-gray-800">
          <p>
            系統隨機派給您的前導文字旨在喚起特定的情緒：<br/>
            <strong>您被分配到：{condition === 'compassion' ? '「同情 (Compassion)」' : '「感激 (Gratitude)」'} 組別。</strong>
          </p>
        </div>
        <p>
          根據 Goenka & van Osselaer (2019) 的研究：<br/>
          <span className="text-blue-600 font-semibold">同情心 (Compassion)</span> 會驅使人們將資源分配給強調「關懷與減輕痛苦 (Care)」的目標。<br/>
          <span className="text-green-600 font-semibold">感激之情 (Gratitude)</span> 則會驅使人們將資源分配給強調「公平與正義 (Fairness)」的目標。
        </p>
        
        <hr className="my-6" />
        
        <h3 className="text-lg font-bold">您的行為數據分析：</h3>
        <ul className="list-disc list-inside">
          <li>關懷專案 (專案甲) 分配：${careAmount}</li>
          <li>公平專案 (專案乙) 分配：${fairnessAmount}</li>
        </ul>
        <p className="text-sm text-gray-500 mt-4">
          {isSubmitting ? "正在將您的數據整合至全班統計資料庫..." : "數據已同步完成。請看台上的全班統計結果！"}
        </p>
      </div>
    </div>
  );
}
```

這些組件涵蓋了主要的互動邏輯與響應式排版。您希望針對 Google Apps Script 接收與處理前端資料的實作細節進行討論，還是針對資料庫（Google Sheet）回傳整體統計圖表供結尾展示的部分進行規劃？