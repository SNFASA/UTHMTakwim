'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Footer from '@/components/footer';
import { 
  Calculator, Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  BookOpen, Star, Clipboard, Coffee, GraduationCap
} from 'lucide-react';
import { academicEvents, semesterInfo } from '@/data/events';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isWithinInterval, 
  isSameDay, 
  parseISO 
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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  if (!mounted) return <div className="min-h-screen bg-white" />;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarDays = eachDayOfInterval({ 
    start: startOfWeek(monthStart), 
    end: endOfWeek(monthEnd) 
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-2 rounded-xl">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black">UTHM Takwim</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Portal</p>
          </div>
        </div>

        <Link
          href="/calculator"
          className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-transform active:scale-95"
        >
          <Calculator className="w-4 h-4" />
          <span className="hidden sm:inline">GPA Calculator</span>
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-10">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">
              {semesterInfo.session} Session
            </span>
            <h2 className="text-3xl md:text-4xl font-black">{semesterInfo.name}</h2>
            <p className="text-slate-500">{semesterInfo.duration}</p>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border rounded-2xl p-1.5 shadow-sm w-full md:w-auto justify-between">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 font-bold min-w-[140px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CALENDAR COLUMN */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/50 border-b">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                  <div key={d} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {d}
                  </div>
                ))}
              </div>

              {/* auto-rows-min ensures the row height is determined by the tallest content */}
              <div className="grid grid-cols-7 auto-rows-min">
                {calendarDays.map((day, i) => {
                  const dayEvents = academicEvents.filter(event =>
                    isWithinInterval(day, {
                      start: parseISO(event.start),
                      end: parseISO(event.end),
                    })
                  );
                  const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);

                  return (
                    <div
                      key={i}
                      className={`border-r border-b p-1 md:p-2 min-h-[120px] flex flex-col transition-colors ${
                        !isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-950/20' : ''
                      }`}
                    >
                      <span className={`text-[10px] md:text-xs font-bold mb-1 ${
                        isCurrentMonth ? 'text-slate-900 dark:text-slate-100' : 'text-slate-300 dark:text-slate-600'
                      }`}>
                        {format(day, 'd')}
                      </span>

                      <div className="flex-1 space-y-1">
                        {dayEvents.map((event, idx) => (
                          <div 
                            key={idx} 
                            className={`${event.color} text-[8px] md:text-[10px] p-1.5 rounded-md font-bold flex items-start gap-1 leading-[1.2] border border-black/5 shadow-sm`}
                          >
                            <div className="mt-0.5 flex-shrink-0 scale-75 md:scale-100"><EventIcon type={event.type} /></div>
                            {/* whitespace-normal: allows multi-line
                                break-words: ensures long words don't overflow the box
                                hyphens-auto: adds hyphens if a word is too long for the width
                            */}
                            <span className="whitespace-normal break-words hyphens-auto w-full">
                              {event.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TIMELINE SIDEBAR - NO SCROLL */}
          <aside className="lg:col-span-3 space-y-6">
            <h3 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs px-2">Timeline</h3>
            <div className="space-y-4">
              {academicEvents.map((event, idx) => (
                <div key={idx} className="p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {format(parseISO(event.start), 'MMM dd')} - {format(parseISO(event.end), 'MMM dd, yyyy')}
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