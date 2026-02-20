'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { calculatePointValue, Course } from '@/lib/gpa-utils';

export default function GPACalculator() {
  // --- State for GPA Calculation ---
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', credits: 3, continuousScore: 0, continuousWeight: 60, finalScore: 0, finalWeight: 40 }
  ]);
  const [gpa, setGPA] = useState<string>('0.00');

  // --- State for CPA Calculation (Feature 1) ---
  const [priorCPA, setPriorCPA] = useState<number>(0);
  const [priorCredits, setPriorCredits] = useState<number>(0);
  const [finalCPA, setFinalCPA] = useState<string>('0.00');

  const addRow = () => {
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      name: '', credits: 3, continuousScore: 0, continuousWeight: 60, finalScore: 0, finalWeight: 40
    };
    setCourses([...courses, newCourse]);
  };

  const removeRow = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // --- Target Mark Logic (Feature 2) ---
  const calculateNeededForA = (course: Course) => {
    const currentCAContribution = (course.continuousScore * (course.continuousWeight / 100));
    // Based on UTHM table, 80% is the minimum for an A
    const neededFromFinal = 80 - currentCAContribution;
    const requiredPercentage = (neededFromFinal / (course.finalWeight / 100));
    
    if (requiredPercentage > 100) return "A is out of reach";
    if (requiredPercentage <= 0) return "A is secured!";
    return `Need ${requiredPercentage.toFixed(1)}% in Final for A`;
  };

  useEffect(() => {
    let currentPoints = 0;
    let currentCredits = 0;

    courses.forEach(c => {
      const finalMark = (Number(c.continuousScore) * (Number(c.continuousWeight) / 100)) + 
                        (Number(c.finalScore) * (Number(c.finalWeight) / 100));
      const pointValue = calculatePointValue(finalMark);
      currentPoints += pointValue * Number(c.credits);
      currentCredits += Number(c.credits);
    });

    // CPA Formula: (Prior Points + Current Points) / Total Credits
    const totalPoints = (Number(priorCPA) * Number(priorCredits)) + currentPoints;
    const totalCredits = Number(priorCredits) + currentCredits;

    setGPA(currentCredits > 0 ? (currentPoints / currentCredits).toFixed(2) : '0.00');
    setFinalCPA(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00');
  }, [courses, priorCPA, priorCredits]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Takwim</span>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">GPA & CPA Calculator</h1>
        <div className="w-24"></div> 
      </nav>

      <main className="max-w-5xl mx-auto p-4 mt-8">
        {/* Results Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl flex justify-between items-center">
            <div>
              <p className="text-blue-100 font-medium text-sm">Semester GPA</p>
              <h2 className="text-5xl font-black">{gpa}</h2>
            </div>
            <Calculator className="w-12 h-12 opacity-20" />
          </div>
          <div className="bg-slate-800 rounded-3xl p-6 text-white shadow-xl flex justify-between items-center">
            <div>
              <p className="text-slate-400 font-medium text-sm">Cumulative CPA</p>
              <h2 className="text-5xl font-black text-yellow-400">{finalCPA}</h2>
            </div>
            <div className="text-right text-xs text-slate-500">
                Calculated with<br/>Prior Credits
            </div>
          </div>
        </div>

        {/* Prior Results Input (For CPA Calculation) */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            Prior Academic Results (for CPA)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prior-cpa" className="text-xs font-bold text-gray-400 uppercase mb-2 block">Current CPA</label>
              <input 
                id="prior-cpa" type="number" step="0.01" placeholder="e.g. 3.50"
                className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPriorCPA(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label htmlFor="prior-credits" className="text-xs font-bold text-gray-400 uppercase mb-2 block">Total Credits Earned</label>
              <input 
                id="prior-credits" type="number" placeholder="e.g. 30"
                className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPriorCredits(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </section>

        {/* Dynamic Course Rows */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase px-1">Current Semester Subjects</h3>
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-6 gap-4 items-end transition-all hover:shadow-md">
              <div className="md:col-span-2">
                <label htmlFor={`name-${course.id}`} className="text-xs font-bold text-gray-400 uppercase mb-2 block">Course Name</label>
                <input 
                  id={`name-${course.id}`} type="text" placeholder="e.g. Web Development"
                  className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                />
                <p className="text-[10px] text-blue-500 font-bold mt-2 flex items-center gap-1">
                  <Calculator className="w-3 h-3" /> {calculateNeededForA(course)}
                </p>
              </div>
              <div>
                <label htmlFor={`credits-${course.id}`} className="text-xs font-bold text-gray-400 uppercase mb-2 block">Credits</label>
                <input 
                  id={`credits-${course.id}`} type="number" placeholder="0"
                  className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label htmlFor={`continuous-${course.id}`} className="text-xs font-bold text-gray-400 uppercase mb-2 block">CA (%)</label>
                <input 
                  id={`continuous-${course.id}`} type="number" placeholder="Mark"
                  className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => updateCourse(course.id, 'continuousScore', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label htmlFor={`final-${course.id}`} className="text-xs font-bold text-gray-400 uppercase mb-2 block">Final (%)</label>
                <input 
                  id={`final-${course.id}`} type="number" placeholder="Mark"
                  className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => updateCourse(course.id, 'finalScore', parseInt(e.target.value) || 0)}
                />
              </div>
              <button 
                onClick={() => removeRow(course.id)}
                className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors flex justify-center"
                aria-label={`Remove ${course.name || 'Course'}`}
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={addRow}
          className="mt-6 w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Another Subject
        </button>
      </main>
    </div>
  );
}