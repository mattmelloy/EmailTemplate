import React from 'react';
import { PlusIcon, MailIcon } from './Icons';

interface HeaderProps {
  onNewTemplate: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewTemplate }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <MailIcon className="w-8 h-8 text-indigo-500" />
        <h1 className="text-2xl font-bold ml-3 text-gray-800 dark:text-white">AutoDraft</h1>
      </div>
      <button
        onClick={onNewTemplate}
        className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        New Template
      </button>
    </header>
  );
};

export default Header;
