'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Footer from '@/components/footer';
import { 
  Calculator, Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  BookOpen, Star, Clipboard, Coffee, GraduationCap, Moon, Sun
} from 'lucide-react';
import { academicEvents, semesterInfo } from '@/data/events';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWithinInterval, parseISO 
} from 'date-fns';

const EventIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    lecture: <BookOpen className="w-3.5 h-3.5" />,
    holiday: <Star className="w-3.5 h-3.5" />,
    admin: <Clipboard className="w-3.5 h-3.5" />,
    break: <Coffee className="w-3.5 h-3.5" />,
    exam: <GraduationCap className="w-3.5 h-3.5" />,
  };
  return icons[type] || null;
};

export default function UTHMTakwim() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); 
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Crucial for Dark Mode toggle to work without errors
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarDays = eachDayOfInterval({ 
    start: startOfWeek(monthStart), 
    end: endOfWeek(monthEnd) 
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Modern Glassmorphism Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-2 rounded-xl shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight dark:text-white">UTHM Takwim</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle 
          <button
            onClick={() =>setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:scale-105 transition-all"
            aria-label="Toggle Dark Mode"
          >
            {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
          </button>
          */}
          <Link href="/calculator" className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-900/10">
            <Calculator className="w-4 h-4" />
            <span>GPA Calculator</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-widest uppercase">{semesterInfo.session} Session</span>
            <h2 className="text-4xl font-black tracking-tight">{semesterInfo.name}</h2>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               {semesterInfo.duration} Academic Period
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
            <button onClick={prevMonth} aria-label="Previous Month" title="Previous Month" className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400"/>
            </button>
            <span className="px-6 font-bold min-w-[160px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button onClick={nextMonth} aria-label="Next Month" title="Next Month" className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400"/>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Calendar Card */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="grid grid-cols-7 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 auto-rows-[120px] md:auto-rows-[160px]">
              {calendarDays.map((day, i) => {
                const dayEvents = academicEvents.filter(event => 
                  isWithinInterval(day, { start: parseISO(event.start), end: parseISO(event.end) })
                );

                const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);

                return (
                  <div key={i} className={`border-r border-b border-slate-50 dark:border-slate-800 p-2 flex flex-col ${!isCurrentMonth ? 'opacity-20' : ''}`}>
                    <span className={`text-xs font-bold mb-2 ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-lg shadow-blue-200' : 'text-slate-400'}`}>
                      {format(day, 'd')}
                    </span>

                    <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                      {dayEvents.map((event, idx) => (
                        <div key={idx} className={`${event.color} text-[10px] p-2 rounded-lg font-bold flex items-start gap-1.5 leading-tight shadow-sm border border-black/5`}>
                          <div className="mt-0.5 flex-shrink-0"><EventIcon type={event.type} /></div>
                          {/* WHITE-SPACE-NORMAL ensures full word wrapping */}
                          <span className="whitespace-normal break-words">{event.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Section */}
          <aside className="lg:col-span-3 space-y-6">
            <h3 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs px-2">Timeline</h3>
            <div className="space-y-4">
              {academicEvents.slice(0,).map((event, idx) => (
                <div key={idx} className={`p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {format(parseISO(event.start), 'MMM dd') } - {format(parseISO(event.end), 'MMM dd, yyyy')}
                    </span>
                    <EventIcon type={event.type} />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">{event.title}</h4>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}