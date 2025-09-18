import React, { useState } from 'react';
import { Template } from '../types';
import { generateEmlContent } from '../services/emlService';
import { XIcon, MailIcon } from './Icons';

interface UseTemplateModalProps {
  template: Template;
  onClose: () => void;
}

const UseTemplateModal: React.FC<UseTemplateModalProps> = ({ template, onClose }) => {
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>(
    () => Object.fromEntries(template.placeholders.map(p => [p.name, p.sample || '']))
  );

  const handleValueChange = (name: string, value: string) => {
    setPlaceholderValues(prev => ({ ...prev, [name]: value }));
  };

  const renderContent = (content: string) => {
    let rendered = content;
    for (const key in placeholderValues) {
      rendered = rendered.replace(new RegExp(`{${key}}`, 'g'), placeholderValues[key]);
    }
    return rendered;
  };
  
  const handleOpenInEmailApp = () => {
    const renderedEmail = {
        fromName: template.fromName ? renderContent(template.fromName) : undefined,
        fromEmail: renderContent(template.fromEmail || 'sender@example.com'),
        recipients: renderContent(template.recipients),
        cc: renderContent(template.cc),
        subject: renderContent(template.subject),
        body: renderContent(template.body),
    };
    const emlContent = generateEmlContent(renderedEmail);
    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s/g, '_')}.eml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Use Template: {template.name}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Fill in Placeholders</h3>
            {template.placeholders.length > 0 ? (
                template.placeholders.map(p => (
                    <div key={p.name}>
                        <label htmlFor={p.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{p.name}</label>
                        <input
                            type="text"
                            id={p.name}
                            value={placeholderValues[p.name] || ''}
                            onChange={(e) => handleValueChange(p.name, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">This template has no placeholders.</p>
            )}
        </div>

        <div className="flex justify-end space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleOpenInEmailApp}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <MailIcon className="w-5 h-5 mr-2" />
            Open in Email App
          </button>
        </div>
      </div>
    </div>
  );
};

export default UseTemplateModal;