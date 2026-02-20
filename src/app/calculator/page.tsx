'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Calculator, ArrowLeft, Info } from 'lucide-react';
import Footer from '@/components/footer';
import { calculatePointValue, Course } from '@/lib/gpa-utils';

export default function GPACalculator() {
  // ---------- Hooks ----------
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', credits: 3, continuousScore: 0, finalScore: 0 }
  ]);
  const [gpa, setGPA] = useState<string>('0.00');
  const [priorCPA, setPriorCPA] = useState<number>(0);
  const [priorCredits, setPriorCredits] = useState<number>(0);
  const [finalCPA, setFinalCPA] = useState<string>('0.00');

  // ---------- Handlers ----------
  const addRow = () => setCourses([...courses, {
    id: Math.random().toString(36).substr(2, 9),
    name: '', credits: 3, continuousScore: 0, finalScore: 0
  }]);

  const removeRow = (id: string) => courses.length > 1 && setCourses(courses.filter(c => c.id !== id));

  const updateCourse = (id: string, field: keyof Course, value: string | number) =>
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));

  const calculateNeededForA = (course: Course) => {
    const total = Number(course.continuousScore) + Number(course.finalScore);
    const required = 80 - total;
    if (required > 0) return `Need ${required.toFixed(2)}% more for A`;
    return "A is secured!";
  };

  // ---------- GPA Calculation ----------
  useEffect(() => {
    let currentPoints = 0;
    let currentCredits = 0;

    courses.forEach(c => {
      // Here we just sum CA + Final (user already entered %)
      let finalMark = Number(c.continuousScore) + Number(c.finalScore);
      if (finalMark > 100) finalMark = 100;

      const pointValue = calculatePointValue(finalMark);
      currentPoints += pointValue * Number(c.credits);
      currentCredits += Number(c.credits);
    });

    const totalPoints = (Number(priorCPA) * Number(priorCredits)) + currentPoints;
    const totalCredits = Number(priorCredits) + currentCredits;

    setGPA(currentCredits > 0 ? (currentPoints / currentCredits).toFixed(2) : '0.00');
    setFinalCPA(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00');
  }, [courses, priorCPA, priorCredits]);

  // ---------- JSX ----------
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Takwim</span>
        </Link>
        <h1 className="text-xl font-black tracking-tight dark:text-white">GPA & CPA Calculator</h1>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-10 flex-1 space-y-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl flex justify-between items-center">
            <div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-wide">Semester GPA</p>
              <h2 className="text-5xl font-black">{gpa}</h2>
            </div>
            <Calculator className="w-12 h-12 opacity-20 text-slate-300 dark:text-slate-700"/>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl flex justify-between items-center">
            <div>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-wide">Cumulative CPA</p>
              <h2 className="text-5xl font-black text-yellow-400">{finalCPA}</h2>
              <p className="text-xs text-slate-500 mt-1">Calculated with prior credits</p>
            </div>
          </div>
        </div>

        {/* Prior Results */}
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2 mb-4">
            <Info className="w-4 h-4"/> Prior Academic Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number" step="0.01" placeholder="Current CPA"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium"
              onChange={e => setPriorCPA(parseFloat(e.target.value) || 0)}
            />
            <input
              type="number" placeholder="Total Credits Earned"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium"
              onChange={e => setPriorCredits(parseInt(e.target.value) || 0)}
            />
          </div>
        </section>

        {/* Courses */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase px-2">Current Semester Subjects</h3>
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-6 gap-4 items-end transition-all hover:shadow-md">
              <input
                type="text" placeholder="Course Name"
                className="md:col-span-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                value={course.name} onChange={e => updateCourse(course.id, 'name', e.target.value)}
              />
              <input
                type="number" placeholder="Credits"
                className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={course.credits} onChange={e => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
              />
              <input
                type="number" placeholder="CA %"
                className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={e => updateCourse(course.id, 'continuousScore', parseFloat(e.target.value) || 0)}
              />
              <input
                type="number" placeholder="Final %"
                className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                onChange={e => updateCourse(course.id, 'finalScore', parseFloat(e.target.value) || 0)}
              />
              <button
                onClick={() => removeRow(course.id)}
                className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-xl flex justify-center"
                title="Delete course"
              >
                <Trash2 className="w-6 h-6"/>
              </button>
              <p className="text-[10px] col-span-full text-blue-500 font-bold mt-2">{calculateNeededForA(course)}</p>
            </div>
          ))}
          <button
            onClick={addRow}
            className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] text-slate-400 dark:text-slate-500 font-bold hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5"/> Add Another Subject
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}