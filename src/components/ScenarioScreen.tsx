import React, { useState } from 'react';
import { SCENARIO_TREE, ScenarioNode } from '../data/tourismData';
import { Compass, MapPin, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ScenarioScreen() {
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const [scoreHistory, setScoreHistory] = useState<number>(0);
  const [historyLog, setHistoryLog] = useState<string[]>([]);

  const node: ScenarioNode = SCENARIO_TREE[currentNodeId] || SCENARIO_TREE["start"];

  const handleChoiceClick = (choice: { text: string; nextNodeId: string; scoreDelta: number; feedback: string }) => {
    setScoreHistory(prev => prev + choice.scoreDelta);
    setHistoryLog(prev => [choice.feedback, ...prev]);
    setCurrentNodeId(choice.nextNodeId);
  };

  const handleReset = () => {
    setCurrentNodeId("start");
    setScoreHistory(0);
    setHistoryLog([]);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-md border border-teal-500/20 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full font-medium">شبیه‌ساز واقعی</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-400" />
            <span>سناریوی تعاملی راهنمای تور</span>
          </h2>
        </div>
        <div className="bg-teal-500/20 text-teal-300 text-xs font-bold px-3.5 py-2 rounded-2xl border border-teal-500/30">
          امتیاز سناریو: {scoreHistory}
        </div>
      </div>

      {/* Scenario Adventure Card */}
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-xs text-teal-400">
          <MapPin className="w-4 h-4" />
          <span>موقعیت: {node.location}</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-100 leading-snug">
          {node.title}
        </h3>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed bg-slate-900/60 p-5 rounded-2xl border border-slate-700/60">
          {node.description}
        </p>

        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-400">تصمیم شما چیست؟</div>
          {node.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => handleChoiceClick(choice)}
              className="w-full text-right p-4 bg-slate-900 hover:bg-teal-950/40 border border-slate-700 hover:border-teal-500/50 rounded-2xl transition-all text-sm font-medium text-slate-200 hover:text-teal-200 flex items-center justify-between group"
            >
              <span className="leading-relaxed">{choice.text}</span>
              <span className="w-7 h-7 rounded-xl bg-slate-800 group-hover:bg-teal-500/20 text-slate-400 group-hover:text-teal-300 flex items-center justify-center text-xs font-bold shrink-0 mr-3">
                {idx + 1}
              </span>
            </button>
          ))}
        </div>

        {currentNodeId !== "start" && (
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 bg-teal-500/10 px-4 py-2.5 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" /> شروع مجدد سناریو
            </button>
          </div>
        )}
      </div>

      {/* Action Feedback Log */}
      {historyLog.length > 0 && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-6 space-y-3">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-400" /> بازخورد کارشناسی آخرین تصمیم:
          </h4>
          <p className="text-xs text-teal-300 leading-relaxed bg-slate-900/80 p-4 rounded-2xl border border-teal-500/20">
            {historyLog[0]}
          </p>
        </div>
      )}
    </div>
  );
}
