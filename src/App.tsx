/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import ExamScreen from './components/ExamScreen';
import ScenarioScreen from './components/ScenarioScreen';
import ProfileScreen from './components/ProfileScreen';
import KotlinCodeViewerModal from './components/KotlinCodeViewerModal';
import { Home, CheckCircle, Play, User, Code2, Smartphone, Monitor, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'exam' | 'scenario' | 'profile'>('home');
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);
  const [showKotlinModal, setShowKotlinModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-['Vazirmatn',sans-serif] flex flex-col items-center justify-start p-0 sm:p-4 md:p-6">
      
      {/* Top Outer Toolbar (For web simulation & code export) */}
      <header className="w-full max-w-5xl bg-slate-900/90 backdrop-blur-md border-b sm:border border-slate-800 sm:rounded-3xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">گردشگری عمومی (فنی و حرفه‌ای)</h1>
            <p className="text-xs text-teal-400">اپلیکیشن آموزشی اندروید با Jetpack Compose و Kotlin</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <button
            onClick={() => setIsDeviceFrame(!isDeviceFrame)}
            className="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border border-slate-700"
            title="تغییر حالت نمایش"
          >
            {isDeviceFrame ? <Monitor className="w-4 h-4 text-teal-400" /> : <Smartphone className="w-4 h-4 text-teal-400" />}
            <span>{isDeviceFrame ? 'نمایش تمام‌صفحه وب' : 'قاب گوشی اندروید'}</span>
          </button>

          {/* Kotlin Code Viewer Button */}
          <button
            onClick={() => setShowKotlinModal(true)}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            <span>مشاهده کدهای Kotlin و Compose</span>
          </button>
        </div>
      </header>

      {/* Main Container: Android Phone Frame OR Immersive Web View */}
      <main className={`w-full transition-all duration-300 ${
        isDeviceFrame 
          ? 'max-w-md bg-slate-950 rounded-[48px] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col min-h-[820px]' 
          : 'max-w-4xl bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col min-h-[750px]'
      }`}>

        {/* Android Phone Speaker / Camera Notch (if in device frame mode) */}
        {isDeviceFrame && (
          <div className="w-full pt-3 pb-2 flex items-center justify-center bg-slate-950 shrink-0">
            <div className="w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
              <div className="w-10 h-1.5 rounded-full bg-slate-800"></div>
            </div>
          </div>
        )}

        {/* Screen Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'exam' && <ExamScreen />}
          {activeTab === 'scenario' && <ScenarioScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </div>

        {/* Material 3 Bottom Navigation Bar */}
        <nav className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 flex items-center justify-around shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-2xl ${
              activeTab === 'home' 
                ? 'bg-teal-500/20 text-teal-300 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px]">خانه</span>
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-2xl ${
              activeTab === 'exam' 
                ? 'bg-teal-500/20 text-teal-300 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-[11px]">آزمون</span>
          </button>

          <button
            onClick={() => setActiveTab('scenario')}
            className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-2xl ${
              activeTab === 'scenario' 
                ? 'bg-teal-500/20 text-teal-300 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-5 h-5" />
            <span className="text-[11px]">سناریو</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-2xl ${
              activeTab === 'profile' 
                ? 'bg-teal-500/20 text-teal-300 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px]">پروفایل</span>
          </button>
        </nav>

        {/* Android Navigation Bar Indicator */}
        {isDeviceFrame && (
          <div className="w-full pb-2 pt-1 flex items-center justify-center bg-slate-950 shrink-0">
            <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
          </div>
        )}
      </main>

      {/* Kotlin Code Viewer Modal */}
      {showKotlinModal && (
        <KotlinCodeViewerModal onClose={() => setShowKotlinModal(false)} />
      )}
    </div>
  );
}
