'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, ArrowRight, ShieldCheck, Compass, Briefcase, HelpCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { RoleSwitcher } from './RoleSwitcher';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Skill<span className="text-indigo-600 dark:text-indigo-400">Bridge</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                MVP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              How It Works
            </Link>
            <Link
              href="/#explore-skills"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              Explore Skills
            </Link>
            <Link
              href="/#opportunities"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-slate-400" />
              Opportunities
            </Link>
            <Link
              href="/#for-organizations"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              For Organizations
            </Link>
          </div>

          {/* Right Action Tools */}
          <div className="hidden md:flex items-center gap-3">
            <RoleSwitcher />
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              id="nav-get-started-btn"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all hover:scale-102"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <RoleSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            How It Works
          </Link>
          <Link
            href="/#explore-skills"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Explore Skills
          </Link>
          <Link
            href="/#opportunities"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Opportunities
          </Link>
          <Link
            href="/#for-organizations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            For Organizations
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-sm text-slate-800 dark:text-slate-200"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center w-full py-2.5 rounded-xl bg-indigo-600 font-semibold text-sm text-white shadow-md shadow-indigo-600/30"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
