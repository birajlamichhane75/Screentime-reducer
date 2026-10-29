'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, ShieldCheck, Compass, Briefcase, HelpCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { RoleSwitcher } from './RoleSwitcher';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0E0830] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              S
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Skill<span className="text-[#0E0830] dark:text-[#c4bbf0]">Bridge</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/#how-it-works"
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#0E0830] dark:hover:text-[#c4bbf0] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/feed"
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#0E0830] dark:hover:text-[#c4bbf0] transition-colors"
            >
              Talent Showcase
            </Link>
            <Link
              href="/explore"
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#0E0830] dark:hover:text-[#c4bbf0] transition-colors"
            >
              Explore Work
            </Link>
            <Link
              href="/#for-organizations"
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#0E0830] dark:hover:text-[#c4bbf0] transition-colors"
            >
              For Organizations
            </Link>
          </div>

          {/* Right Action Tools */}
          <div className="hidden md:flex items-center gap-3">
            <RoleSwitcher />
            <ThemeToggle />
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0E0830] dark:hover:text-[#c4bbf0] px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/feed"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white shadow-xs transition-colors"
            >
              View Feed
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <RoleSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 text-xs">
          <Link
            href="/feed"
            className="block py-2 text-slate-700 dark:text-slate-200 hover:text-[#0E0830] dark:hover:text-[#c4bbf0] font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Talent Showcase Feed
          </Link>
          <Link
            href="/explore"
            className="block py-2 text-slate-700 dark:text-slate-200 hover:text-[#0E0830] dark:hover:text-[#c4bbf0] font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore Directory
          </Link>
          <Link
            href="/saved"
            className="block py-2 text-slate-700 dark:text-slate-200 hover:text-[#0E0830] dark:hover:text-[#c4bbf0] font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Selected Works
          </Link>
          <div className="pt-2 flex items-center gap-2">
            <Link
              href="/login"
              className="flex-1 text-center py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/feed"
              className="flex-1 text-center py-2 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
