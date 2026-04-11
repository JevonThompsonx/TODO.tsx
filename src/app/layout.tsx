import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TODO.tsx — Production-ready Next.js Todo App",
  description:
    "A Next.js TypeScript todo app with Turso DB, Tailwind CSS, and Vercel CI/CD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <a
              href="/todos"
              className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              TODO<span className="text-gray-400">.tsx</span>
            </a>
            <nav aria-label="Main navigation">
              <a
                href="https://github.com/JevonThompsonx/TODO.tsx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
