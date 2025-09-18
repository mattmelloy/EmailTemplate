import React from 'react';
import { BoldIcon, ItalicIcon, UnderlineIcon, HighlightIcon } from './Icons';

interface WysiwygToolbarProps {
  onCommand: (cmd: string, value?: string) => void;
}

const WysiwygToolbar: React.FC<WysiwygToolbarProps> = ({ onCommand }) => {
    // Using onMouseDown with preventDefault keeps the editor focused
    const handleCommand = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { command, value } = e.currentTarget.dataset;
        if (command) {
            onCommand(command, value);
        }
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const { command } = e.currentTarget.dataset;
        const value = e.target.value;
        if (command && value) {
            onCommand(command, value);
            e.target.value = ''; // Reset select after applying
        }
    }

    return (
        <div className="flex items-center flex-wrap gap-1 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-t-md border-b border-gray-300 dark:border-gray-600">
            <select 
                data-command="fontName" 
                onChange={handleSelectChange} 
                onMouseDown={e => e.preventDefault()} 
                className="text-xs rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                aria-label="Font Family"
            >
                <option value="">Font</option>
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
            </select>
            <select 
                data-command="fontSize" 
                onChange={handleSelectChange} 
                onMouseDown={e => e.preventDefault()} 
                className="text-xs rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                aria-label="Font Size"
            >
                <option value="">Size</option>
                <option value="2">Small</option>
                <option value="3">Normal</option>
                <option value="5">Large</option>
                <option value="7">Huge</option>
            </select>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-500 mx-1"></div>
            <button data-command="bold" onMouseDown={handleCommand} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="Bold"><BoldIcon className="w-5 h-5"/></button>
            <button data-command="italic" onMouseDown={handleCommand} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="Italic"><ItalicIcon className="w-5 h-5"/></button>
            <button data-command="underline" onMouseDown={handleCommand} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="Underline"><UnderlineIcon className="w-5 h-5"/></button>
            <button data-command="backColor" data-value="#FFFFA7" onMouseDown={handleCommand} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="Highlight"><HighlightIcon className="w-5 h-5"/></button>
        </div>
    );
};

export default WysiwygToolbar;
