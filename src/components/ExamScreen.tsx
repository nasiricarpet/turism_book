import React, { useState, useEffect } from 'react';
import { EXAM_QUESTIONS, FLASHCARDS_DATA, Question, Flashcard } from '../data/tourismData';
import { CheckCircle2, XCircle, Timer, RotateCw, Award, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ExamScreen() {
  const [mode, setMode] = useState<'mcq' | 'flashcards'>('mcq');
  
  // MCQ state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showComprehensiveModal, setShowComprehensiveModal] = useState<boolean>(false);

  // Flashcards state
  const [fcIndex, setFcIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const currentQ: Question = EXAM_QUESTIONS[currentIndex];
  const currentFc: Flashcard = FLASHCARDS_DATA[fcIndex];

  // Timer effect for MCQ
  useEffect(() => {
    if (mode === 'mcq' && !isAnswered && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, isAnswered, timeLeft]);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.correctIndex) {
      setScore(prev => prev + 10);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(60);
    if (currentIndex < EXAM_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/80 backdrop-blur-md border border-teal-500/20 p-4 rounded-3xl">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-teal-400" />
          <h2 className="text-lg font-bold text-slate-100">آزمون شبیه‌ساز و فلش‌کارت</h2>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={() => setMode('mcq')}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${
              mode === 'mcq' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            آزمون چهارگزینه‌ای
          </button>
          <button
            onClick={() => setMode('flashcards')}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${
              mode === 'flashcards' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            فلش‌کارت آموزشی
          </button>
        </div>
      </div>

      {mode === 'mcq' ? (
        <div className="space-y-4">
          {/* Timer & Question Counter Header */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="text-sm font-bold text-slate-200">
              سوال <span className="text-teal-400">{currentIndex + 1}</span> از {EXAM_QUESTIONS.length}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <Timer className={`w-4 h-4 ${timeLeft < 15 ? 'text-red-400 animate-bounce' : 'text-teal-400'}`} />
                <span className={`text-xs font-mono font-bold ${timeLeft < 15 ? 'text-red-400' : 'text-slate-200'}`}>
                  {timeLeft} ثانیه
                </span>
              </div>

              <div className="text-xs bg-teal-500/20 text-teal-300 px-3 py-1.5 rounded-xl font-bold">
                امتیاز این آزمون: {score}
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
              {currentQ.question}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                
                let btnStyle = "bg-slate-900/80 border-slate-700 text-slate-200 hover:border-teal-500/50";
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-950/60 border-emerald-500/80 text-emerald-200 shadow-lg shadow-emerald-900/20";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-950/60 border-rose-500/80 text-rose-200 shadow-lg shadow-rose-900/20";
                  } else {
                    btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-right p-4 rounded-2xl border transition-all flex items-center justify-between text-sm font-medium ${btnStyle}`}
                  >
                    <span className="leading-relaxed">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mt-4 p-4 bg-teal-950/40 border border-teal-500/30 rounded-2xl space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                  <HelpCircle className="w-4 h-4" /> پاسخ تشریحی:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>سوال بعدی</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Full Comprehensive Exam CTA */}
          <div className="bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border border-teal-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-100 text-base">شرکت در آزمون جامع سازمان فنی و حرفه‌ای</h4>
              <p className="text-xs text-slate-300 mt-1">آزمون استاندارد ۵۰ سوالی با گواهینامه معتبر رسمی</p>
            </div>
            <button
              onClick={() => setShowComprehensiveModal(true)}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-xs shadow-lg transition-all whitespace-nowrap"
            >
              شرکت در آزمون جامع
            </button>
          </div>
        </div>
      ) : (
        /* Flashcards Mode */
        <div className="space-y-6">
          <div className="text-center text-xs text-slate-400">
            برای دیدن پاسخ، روی کارت کلیک کنید یا دکمه چرخش را بزنید
          </div>

          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-slate-800/90 border border-teal-500/30 rounded-3xl p-8 min-h-[320px] flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl relative overflow-hidden transition-all hover:border-teal-400"
          >
            <div className="absolute top-4 right-4 bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-full">
              {currentFc.category}
            </div>

            <div className="absolute top-4 left-4 text-xs text-slate-500">
              فلش‌کارت {fcIndex + 1} از {FLASHCARDS_DATA.length}
            </div>

            <div className="my-auto space-y-4 max-w-md">
              <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                {isFlipped ? "پاسخ صحیح" : "سوال / مفهوم"}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 leading-relaxed">
                {isFlipped ? currentFc.back : currentFc.front}
              </h3>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-teal-400 bg-teal-500/10 px-4 py-2 rounded-xl">
              <RotateCw className="w-4 h-4 animate-spin-slow" />
              <span>کلیک برای چرخش کارت</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setIsFlipped(false);
                setFcIndex(prev => (prev > 0 ? prev - 1 : FLASHCARDS_DATA.length - 1));
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-2xl text-xs font-medium flex items-center gap-2 transition-all"
            >
              <ArrowRight className="w-4 h-4" /> کارت قبلی
            </button>
            <button
              onClick={() => {
                setIsFlipped(false);
                setFcIndex(prev => (prev < FLASHCARDS_DATA.length - 1 ? prev + 1 : 0));
              }}
              className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <span>کارت بعدی</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Exam Modal */}
      {showComprehensiveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-100">آزمون جامع سازمان فنی و حرفه‌ای</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              این آزمون شامل ۵۰ سوال چهارگزینه‌ای از تمامی ۸ فصل گردشگری عمومی است و نیاز به تمرکز کامل دارد.
            </p>

            <div className="bg-slate-800/80 rounded-2xl p-4 text-right space-y-2 text-xs text-slate-300">
              <div>⏱️ مدت زمان: ۶۰ دقیقه</div>
              <div>🎯 نمره قبولی: ۷۰ از ۱۰۰</div>
              <div>📜 صدور گواهی الکترونیکی پس از موفقیت</div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  setShowComprehensiveModal(false);
                  alert("آزمون جامع با موفقیت شبیه‌سازی شد! به زودی نتایج ارسال می‌شود.");
                }}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all text-sm"
              >
                شروع آزمون جامع
              </button>
              <button 
                onClick={() => setShowComprehensiveModal(false)}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-sm font-medium transition-all"
              >
                بازگشت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
