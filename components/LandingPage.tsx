import React from 'react';
import { SparklesIcon, MailIcon, UsersIcon } from './Icons';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <MailIcon className="w-8 h-8 text-indigo-500" />
          <h1 className="text-2xl font-bold ml-3">Email Template AI Assistant</h1>
        </div>
        <button
          onClick={onLoginClick}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors"
        >
          Login / Sign Up
        </button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 md:px-12 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          Craft the Perfect Email, <span className="text-indigo-500">Every Time</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          Stop rewriting the same emails. Create, share, and enhance your email templates with the power of AI. Save time and communicate flawlessly.
        </p>
        <button
          onClick={onLoginClick}
          className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          Get Started for Free
        </button>
      </main>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-6 md:px-12">
          <h3 className="text-3xl font-bold text-center mb-12">Why You'll Love It</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
              <SparklesIcon className="w-12 h-12 text-indigo-500 mb-4" />
              <h4 className="text-xl font-bold mb-2">AI-Powered Enhancements</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Correct grammar, fix spelling, and rewrite your text in a friendly or formal tone with a single click using Google Gemini.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
              <MailIcon className="w-12 h-12 text-indigo-500 mb-4" />
              <h4 className="text-xl font-bold mb-2">Powerful Template Management</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Organize your templates in folders, use dynamic placeholders, and export to your favorite email client with `mailto:` or `.eml` files.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
              <UsersIcon className="w-12 h-12 text-indigo-500 mb-4" />
              <h4 className="text-xl font-bold mb-2">Team Collaboration</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Share templates with your team to ensure brand consistency and efficiency. Everyone stays on the same page, effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <p>&copy; {new Date().getFullYear()} Email Template AI Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;