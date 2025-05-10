import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Canadian Antibiotic Guide',
  description: 'Evidence-based antibiotic recommendations based on Canadian guidelines for resident physicians',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <a href="/" className="text-xl font-bold text-gray-900">
                      Canadian Antibiotic Guide
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>

          <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-yellow-700">
                  <strong>EDUCATIONAL TOOL ONLY:</strong> This tool is intended for educational purposes only. 
                  Clinical decisions should be made based on professional judgment and current guidelines. 
                  The creators of this tool assume no responsibility for clinical use or outcomes.
                </p>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                Canadian Antibiotic Guide © {new Date().getFullYear()}
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 