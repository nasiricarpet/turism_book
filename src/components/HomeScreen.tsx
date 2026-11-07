import React, { useState, useEffect } from 'react';
import { TOURISM_CHAPTERS, Chapter } from '../data/tourismData';
import { Lock, Star, BookOpen, Clock, CheckCircle2, ChevronLeft, Sparkles, AlertCircle, Check, Search, X, Video, Play, FileText, HelpCircle, Mic, Volume2, Square } from 'lucide-react';

export default function HomeScreen() {
  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('tourism_chapters_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return TOURISM_CHAPTERS;
  });

  useEffect(() => {
    localStorage.setItem('tourism_chapters_state', JSON.stringify(chapters));
  }, [chapters]);

  const [userScore, setUserScore] = useState<number>(980);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("مرورگر شما از جستجوی صوتی پشتیبانی نمی‌کند.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fa-IR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const speechToText = event.results[0][0].transcript;
        setSearchQuery(speechToText);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const handleSpeakText = (text: string, index?: number) => {
    if (!('speechSynthesis' in window)) {
      alert("مرورگر شما از خواندن صوتی پشتیبانی نمی‌کند.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fa-IR';
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (index !== undefined) setSpeakingIndex(index);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    if (!selectedChapter && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingIndex(null);
    }
  }, [selectedChapter]);

  const [activeTab, setActiveTab] = useState<'content' | 'videos' | 'quiz' | 'highlights'>('content');
  const [highlights, setHighlights] = useState<string[]>(() => {
    const saved = localStorage.getItem('tourism_highlighted_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('tourism_highlighted_notes', JSON.stringify(highlights));
  }, [highlights]);

  const toggleHighlight = (text: string) => {
    setHighlights(prev => 
      prev.includes(text) ? prev.filter(item => item !== text) : [...prev, text]
    );
  };

  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [paywallChapter, setPaywallChapter] = useState<Chapter | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'completed' | 'inprogress'>('all');

  const filteredChapters = chapters.filter(chapter => {
    const matchesSearch = 
      chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.competency.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'completed') return matchesSearch && chapter.progress === 100;
    if (selectedCategory === 'inprogress') return matchesSearch && chapter.progress > 0 && chapter.progress < 100;
    return matchesSearch;
  });

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setActiveTab('content');
    setQuizSelectedOption(null);
    setQuizAnswered(false);
  };

  const handleUnlockAll = () => {
    setChapters(prev => prev.map(c => ({ ...c, isUnlocked: true, progress: c.progress === 0 ? 10 : c.progress })));
    setUserScore(prev => prev + 150);
    setShowPaywallModal(false);
  };

  const toggleReadStatus = (e: React.MouseEvent, chapterId: number) => {
    e.stopPropagation();
    setChapters(prev => prev.map(c => {
      if (c.id === chapterId) {
        const newProgress = c.progress === 100 ? 0 : 100;
        return { ...c, progress: newProgress };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Score & User Header Widget */}
      <div className="bg-slate-800/80 backdrop-blur-md border border-teal-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full font-medium">استاندارد TVTO</span>
              <span className="text-xs text-slate-400">گردشگری عمومی</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100">سلام، رضا عزیز 👋</h1>
            <p className="text-sm text-slate-400 mt-1">امروز کدام فصل از دنیای گردشگری را کاوش می‌کنید؟</p>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-4 rounded-2xl shadow-lg flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
            <div>
              <div className="text-xs text-teal-100 font-medium">امتیاز کل</div>
              <div className="text-lg font-extrabold text-white">{userScore}</div>
            </div>
          </div>
        </div>

        {/* Daily Tourism Tip Banner */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-start gap-3">
          <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-teal-300 ml-1">نکته روز گردشگری:</span>
            راهنمای تور حرفه‌ای همواره قبل از ورود گروه به اماکن مذهبی و تاریخی، قوانین پوشش و سکوت را به گردشگران یادآوری می‌کند.
          </div>
        </div>
      </div>

      {/* Chapters Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <span>فصل‌های آموزشی (۸ فصل مصوب)</span>
        </h2>
        <span className="text-xs text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full">
          {chapters.filter(c => c.isUnlocked).length} از {chapters.length} فصل فعال
        </span>
      </div>

      {/* Advanced Search Bar with Voice Search & Quick Filters */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-teal-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isListening ? "در حال گوش دادن... صحبت کنید..." : "جستجوی صوتی یا متنی سرفصل‌ها، کلمات کلیدی، مباحث گردشگری..."}
            className={`w-full bg-slate-800/95 border text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-2xl py-3.5 pr-11 pl-20 shadow-inner focus:outline-none transition-all ${
              isListening ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-700/80 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
            }`}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-200 p-1"
                title="پاک کردن جستجو"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleVoiceSearch}
              title="جستجوی صوتی"
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40' 
                  : 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30'
              }`}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Filter Status Pills & Topic Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            همه سرفصل‌ها ({chapters.length})
          </button>
          <button
            onClick={() => setSelectedCategory('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'completed'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            خوانده شده ({chapters.filter(c => c.progress === 100).length})
          </button>
          <button
            onClick={() => setSelectedCategory('inprogress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'inprogress'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            در حال مطالعه
          </button>
          
          <div className="h-4 w-px bg-slate-700 shrink-0 mx-1"></div>

          {['جغرافیا', 'تاریخ', 'صنایع دستی', 'هتل‌داری', 'مقررات'].map((topic) => (
            <button
              key={topic}
              onClick={() => setSearchQuery(topic)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/60 text-teal-300 hover:bg-teal-500/20 border border-teal-500/20 whitespace-nowrap transition-all"
            >
              # {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters List (Freemium Model) */}
      <div className="space-y-3">
        {filteredChapters.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-200">فصلی با این عبارت یافت نشد</h4>
            <p className="text-xs text-slate-400">لطفاً کلیدواژه دیگری مانند «جغرافیا»، «تاریخ»، «صنایع دستی» یا «معماری» را جستجو کنید.</p>
          </div>
        ) : (
          filteredChapters.map((chapter) => {
            const index = chapters.findIndex(c => c.id === chapter.id);
            return (
          <div
            key={chapter.id}
            onClick={() => handleChapterClick(chapter)}
            className={`group relative bg-slate-800/60 backdrop-blur-sm border transition-all duration-300 rounded-2xl p-5 cursor-pointer hover:border-teal-500/50 hover:bg-slate-800 shadow-sm ${
              chapter.isUnlocked ? 'border-slate-700/80' : 'border-slate-700/40 opacity-90'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-transform group-hover:scale-105 ${
                  chapter.isUnlocked ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-700 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                      {chapter.title}
                    </h3>
                    {chapter.progress === 100 && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> خوانده شده
                      </span>
                    )}
                    {!chapter.isUnlocked && (
                      <span className="bg-amber-500/20 text-amber-300 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        <Lock className="w-3 h-3" /> قفل
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {chapter.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-400" /> {chapter.duration}
                      </span>
                      <span>·</span>
                      <span>{chapter.lessonsCount} درس آموزشی</span>
                    </div>
                    {chapter.isUnlocked && (
                      <button
                        onClick={(e) => toggleReadStatus(e, chapter.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                          chapter.progress === 100
                            ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                            : 'bg-slate-700/60 text-slate-300 hover:bg-teal-500/20 hover:text-teal-300 border border-slate-600'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        {chapter.progress === 100 ? 'خوانده شده' : 'نشان کردن خوانده شده'}
                      </button>
                    )}
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">پیشرفت مطالعه فصل:</span>
                      <span className={`font-extrabold ${chapter.progress === 100 ? 'text-emerald-400' : 'text-teal-400'}`}>
                        {chapter.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          chapter.progress === 100 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/30' 
                            : 'bg-gradient-to-r from-teal-500 to-cyan-400'
                        }`} 
                        style={{ width: `${chapter.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="self-center p-2 text-slate-500 group-hover:text-teal-400 transition-colors">
                {chapter.isUnlocked ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5 text-amber-400" />
                )}
              </div>
            </div>
          </div>
          );
        })
      )}
      </div>

      {/* Chapter Detailed View Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full font-bold">
                  فصل {selectedChapter.id} از ۸
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400" /> {selectedChapter.duration}
                </span>
              </div>
              <button 
                onClick={() => setSelectedChapter(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-4 mb-2">{selectedChapter.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">{selectedChapter.description}</p>

            {/* Tab Navigation */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6 shrink-0">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'content'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> متن کتاب
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'videos'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> ویدیوها
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> آزمونک
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all relative ${
                  activeTab === 'highlights'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> هایلایت‌ها ({highlights.length})
              </button>
            </div>

            {/* Tab Content Body with Smooth Scrolling */}
            <div className="flex-1 overflow-y-auto scroll-smooth overscroll-contain space-y-4 pr-1.5 pl-1.5 custom-scrollbar">
              {activeTab === 'content' && (
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="font-bold text-teal-300 text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-teal-400" /> متن کامل کتاب (فصل {selectedChapter.id})
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakText((selectedChapter.fullText || [selectedChapter.description]).join('. '))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isSpeaking && speakingIndex === null
                            ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                            : 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30'
                        }`}
                      >
                        {isSpeaking && speakingIndex === null ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        {isSpeaking && speakingIndex === null ? 'توقف خواندن' : '🔊 خواندن صوتی کل فصل'}
                      </button>
                    </div>
                  </div>
                  {selectedChapter.fullText && selectedChapter.fullText.map((paragraph, idx) => {
                    const isHighlighted = highlights.includes(paragraph);
                    const isParagraphSpeaking = isSpeaking && speakingIndex === idx;
                    return (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-xl border transition-all relative group ${
                          isParagraphSpeaking
                            ? 'bg-teal-950/30 border-teal-500 shadow-md ring-2 ring-teal-500/20 text-teal-100'
                            : isHighlighted 
                            ? 'bg-amber-950/20 border-amber-500/60 shadow-md shadow-amber-950/30 text-amber-100' 
                            : 'bg-slate-900/80 border-slate-800/80 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="leading-relaxed flex-1">{paragraph}</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleSpeakText(paragraph, idx)}
                              title={isParagraphSpeaking ? "توقف" : "خواندن صوتی این پاراگراف"}
                              className={`p-2 rounded-xl transition-all ${
                                isParagraphSpeaking
                                  ? 'bg-rose-500 text-white animate-pulse'
                                  : 'bg-slate-800 text-slate-400 hover:text-teal-300 hover:bg-slate-700'
                              }`}
                            >
                              {isParagraphSpeaking ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => toggleHighlight(paragraph)}
                              title={isHighlighted ? "حذف هایلایت" : "هایلایت به عنوان نکته مهم"}
                              className={`p-2 rounded-xl transition-all ${
                                isHighlighted 
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                                  : 'bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-700'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${isHighlighted ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </div>
                        </div>
                        {isHighlighted && (
                          <div className="mt-2 text-[10px] text-amber-400 font-bold flex items-center gap-1">
                            ⭐ نکته مهم ذخیره شده (آفلاین)
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'highlights' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/60 border border-amber-500/30 p-5 rounded-2xl">
                    <h4 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-amber-300 text-amber-300" /> نکات مهم هایلایت‌شده آفلاین ({highlights.length})
                    </h4>
                    <p className="text-xs text-slate-400">این نکات در حافظه محلی مرورگر شما ذخیره شده و به‌صورت آفلاین قابل دسترسی هستند.</p>
                  </div>

                  {highlights.length === 0 ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
                      <Star className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-sm font-bold text-slate-300">هنوز نکته‌ای را هایلایت نکرده‌اید</p>
                      <p className="text-xs text-slate-400">با کلیک روی دکمه ستاره در تب «متن کتاب»، نکات مهم را ذخیره کنید.</p>
                    </div>
                  ) : (
                    highlights.map((note, idx) => (
                      <div key={idx} className="bg-amber-950/20 border border-amber-500/50 p-4 rounded-2xl space-y-2 relative group">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed flex-1">{note}</p>
                          <button
                            onClick={() => toggleHighlight(note)}
                            className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1.5 rounded-xl hover:bg-rose-500/30 transition-all shrink-0 font-bold"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-teal-500/40 transition-all group">
                    <div className="w-16 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 shrink-0 relative overflow-hidden">
                      <Play className="w-6 h-6 fill-teal-400/20 text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-200 text-sm">ویدیو آموزشی شماره ۱: مرور جامع مباحث فصل</h4>
                      <p className="text-xs text-slate-400 mt-1">مدت زمان: ۱۲ دقیقه · مدرس: استاد راهنمای تور</p>
                    </div>
                    <span className="text-xs bg-teal-500/20 text-teal-300 px-3 py-1.5 rounded-xl font-bold">پخش آنلاین</span>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-teal-500/40 transition-all group">
                    <div className="w-16 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 shrink-0 relative overflow-hidden">
                      <Play className="w-6 h-6 fill-teal-400/20 text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-200 text-sm">ویدیو شماره ۲: بررسی نمونه موردی و کیس استادی</h4>
                      <p className="text-xs text-slate-400 mt-1">مدت زمان: ۱۵ دقیقه · تحلیل آزمون فنی و حرفه‌ای</p>
                    </div>
                    <span className="text-xs bg-teal-500/20 text-teal-300 px-3 py-1.5 rounded-xl font-bold">پخش آنلاین</span>
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold">
                      آزمونک خودآزمایی این فصل
                    </span>
                    <span className="text-xs text-slate-400">۱ سوال چهارگزینه‌ای</span>
                  </div>

                  <p className="text-sm font-bold text-slate-100 leading-relaxed">
                    سوال ۱: طبق استانداردهای سازمان جهانی جهانگردی (UNWTO)، مهم‌ترین ویژگی گردشگر بین‌المللی چیست؟
                  </p>

                  <div className="space-y-2 pt-2">
                    {[
                      "حداقل ۲۴ ساعت اقامت و کمتر از یک سال در مقصد",
                      "فقط سفر با هواپیما و هتل‌های پنج ستاره",
                      "اقامت کمتر از ۱۲ ساعت بدون شب‌مانی",
                      "سفر صرفاً با اهداف تجاری و اداری"
                    ].map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={quizAnswered}
                        onClick={() => {
                          setQuizSelectedOption(idx);
                          setQuizAnswered(true);
                        }}
                        className={`w-full text-right p-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between border ${
                          quizAnswered
                            ? idx === 0
                              ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200'
                              : quizSelectedOption === idx
                              ? 'bg-rose-500/20 border-rose-500/60 text-rose-200'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                            : quizSelectedOption === idx
                            ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-teal-500/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {quizAnswered && idx === 0 && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {quizAnswered && (
                    <div className="mt-4 p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-200 leading-relaxed animate-in fade-in">
                      <span className="font-bold ml-1">پاسخ تشریحی:</span>
                      طبق تعریف UNWTO، گردشگر (Tourist) به فردی اطلاق می‌شود که حداقل ۲۴ ساعت و حداکثر یک سال در مقصد مورد بازدید اقامت داشته باشد.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex gap-3 shrink-0">
              <button 
                onClick={() => {
                  if (selectedChapter) {
                    setChapters(prev => prev.map(c => c.id === selectedChapter.id ? { ...c, progress: 100 } : c));
                  }
                  setSelectedChapter(null);
                  setUserScore(prev => prev + 50);
                }}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                تکمیل مطالعه و دریافت ۵۰ امتیاز (+50)
              </button>
              <button 
                onClick={() => setSelectedChapter(null)}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-sm font-medium transition-all"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Freemium Paywall Modal */}
      {showPaywallModal && paywallChapter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-100 mb-2">این فصل قفل است</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              فصل‌های ۳ تا ۸ مخصوص نسخه کامل استاندارد سازمان آموزش فنی و حرفه‌ای هستند. با باز کردن نسخه کامل، به تمام آزمون‌ها و سناریوها دسترسی پیدا کنید.
            </p>

            <div className="bg-slate-800/80 rounded-2xl p-4 mb-6 text-right space-y-2">
              <div className="text-xs font-bold text-amber-400">مزایای نسخه کامل:</div>
              <div className="text-xs text-slate-300">✓ دسترسی نامحدود به تمامی ۸ فصل آموزشی</div>
              <div className="text-xs text-slate-300">✓ آزمون‌های جامع شبیه‌ساز سازمان فنی و حرفه‌ای</div>
              <div className="text-xs text-slate-300">✓ سناریوهای تعاملی پیشرفته راهنمای تور</div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleUnlockAll}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl shadow-lg transition-all text-sm"
              >
                باز کردن نسخه کامل (شبیه‌سازی خرید)
              </button>
              <button 
                onClick={() => setShowPaywallModal(false)}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-sm font-medium transition-all"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
