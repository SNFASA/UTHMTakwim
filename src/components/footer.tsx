'use client';
import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 py-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
      © {new Date().getFullYear()} UTHM Student Portal. All rights reserved.(Coremind Hub)
    </footer>
  );
}