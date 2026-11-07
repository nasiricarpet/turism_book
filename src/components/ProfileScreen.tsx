import React, { useState, useEffect } from 'react';
import { LEADERBOARD_USERS, LeaderboardUser, TOURISM_CHAPTERS } from '../data/tourismData';
import { User, Trophy, Award, BookCheck, Star, ShieldCheck, Bell, Clock, Check, Sparkles, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ProfileScreen() {
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(() => {
    return localStorage.getItem('tourism_reminder_enabled') === 'true';
  });
  const [reminderTime, setReminderTime] = useState<string>(() => {
    return localStorage.getItem('tourism_reminder_time') || '20:00';
  });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('tourism_reminder_enabled', String(reminderEnabled));
    localStorage.setItem('tourism_reminder_time', reminderTime);
  }, [reminderEnabled, reminderTime]);

  const handleSaveReminder = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const chapters = (() => {
    const saved = localStorage.getItem('tourism_chapters_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return TOURISM_CHAPTERS;
  })();

  const completedCount = chapters.filter((c: any) => c.progress === 100).length;
  const inProgressCount = chapters.filter((c: any) => c.progress > 0 && c.progress < 100).length;
  const unreadCount = chapters.filter((c: any) => c.progress === 0).length;

  const chartData = [
    { name: 'تکمیل شده (۱۰۰٪)', value: completedCount, color: '#14b8a6' },
    { name: 'در حال مطالعه', value: inProgressCount, color: '#06b6d4' },
    { name: 'خوانده نشده', value: unreadCount, color: '#334155' }
  ].filter(item => item.value > 0);

  const totalProgressSum = chapters.reduce((acc: number, c: any) => acc + c.progress, 0);
  const overallPercentage = Math.round(totalProgressSum / chapters.length);

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Card */}
      <div className="bg-slate-800/80 backdrop-blur-md border border-teal-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
            رضا
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">رضا کریمی</h2>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> هنرجوی تایید شده
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">استاندارد آموزشی: گردشگری عمومی (سازمان فنی و حرفه‌ای)</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-700/60 text-center">
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-700/50">
            <div className="text-xs text-slate-400">فصل‌های تکمیل</div>
            <div className="text-base font-extrabold text-teal-400 mt-1">{completedCount} از {chapters.length}</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-700/50">
            <div className="text-xs text-slate-400">امتیاز کل</div>
            <div className="text-base font-extrabold text-amber-400 mt-1">۹۸۰</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-700/50">
            <div className="text-xs text-slate-400">رتبه شما</div>
            <div className="text-base font-extrabold text-cyan-400 mt-1">۴</div>
          </div>
        </div>
      </div>

      {/* Overall Progress Pie Chart Card */}
      <div className="bg-slate-800/80 backdrop-blur-md border border-teal-500/20 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-teal-400" />
            <span>نمودار پیشرفت کل کتاب گردشگری عمومی</span>
          </h3>
          <span className="text-xs bg-teal-500/20 text-teal-300 font-extrabold px-3 py-1 rounded-full">
            {overallPercentage}% پیشرفت کل
          </span>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#f8fafc', fontSize: '12px' }}
                formatter={(value: any) => [`${value} فصل`, 'تعداد']}
              />
              <Legend 
                formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Study Reminder Settings Card */}
      <div className="bg-slate-800/80 backdrop-blur-md border border-teal-500/20 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">یادآور روزانه مطالعه</h3>
              <p className="text-xs text-slate-400">تنظیم ساعت دلخواه برای دریافت اعلان مطالعه کتاب</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
          </label>
        </div>

        {reminderEnabled && (
          <div className="pt-3 border-t border-slate-700/60 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-400" /> ساعت یادآوری:
              </span>
              <input 
                type="time" 
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-teal-300 font-bold text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-teal-500 shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> اعلان روزانه برای حفظ استمرار مطالعه فعال است.
              </span>
              <button
                onClick={handleSaveReminder}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                {savedSuccess ? 'ذخیره شد' : 'ذخیره تنظیمات'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>جدول رتبه‌بندی هنرجویان (Leaderboard)</span>
          </h3>
          <span className="text-xs text-slate-400">بروزرسانی زنده</span>
        </div>

        <div className="space-y-3">
          {LEADERBOARD_USERS.map((user: LeaderboardUser) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                user.isCurrentUser
                  ? 'bg-gradient-to-r from-teal-950/60 to-cyan-950/60 border-teal-500/80 shadow-lg shadow-teal-950/30'
                  : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                  user.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-md' :
                  user.rank === 2 ? 'bg-slate-300 text-slate-950' :
                  user.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-slate-900 text-slate-400 border border-slate-700'
                }`}>
                  {user.rank}
                </div>
                <div>
                  <div className={`font-bold text-sm ${user.isCurrentUser ? 'text-teal-300' : 'text-slate-200'}`}>
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {user.chaptersCompleted} فصل تکمیل شده
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-amber-400">{user.score}</span>
                <span className="text-xs text-slate-500">امتیاز</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
