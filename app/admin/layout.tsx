import React, { Suspense } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Suspense fallback={<div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen" />}>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading admin operations...</div>}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
