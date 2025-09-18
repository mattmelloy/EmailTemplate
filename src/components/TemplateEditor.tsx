import React, { useState } from 'react';
import { Template, Placeholder, Folder, AiAction, TemplateVisibility } from '../types';
import { correctGrammar, rewriteFriendly, rewriteFormal } from '../services/geminiService';
import { SaveIcon, TrashIcon, XIcon, SparklesIcon, PlusIcon, TagIcon } from './Icons';

interface TemplateEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  folders: Folder[];
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onSave, onClose, onDelete, folders }) => {
  const [editedTemplate, setEditedTemplate] = useState<Template>(JSON.parse(JSON.stringify(template)));
  const [newPlaceholder, setNewPlaceholder] = useState({ name: '', sample: '' });
  const [isAiLoading, setIsAiLoading] = useState<AiAction | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceholderChange = (index: number, field: keyof Placeholder, value: string) => {
    const updatedPlaceholders = [...editedTemplate.placeholders];
    updatedPlaceholders[index][field] = value;
    setEditedTemplate(prev => ({ ...prev, placeholders: updatedPlaceholders }));
  };

  const addPlaceholder = () => {
    if (newPlaceholder.name.trim() === '') return;
    setEditedTemplate(prev => ({
      ...prev,
      placeholders: [...prev.placeholders, { ...newPlaceholder, name: newPlaceholder.name.replace(/\s+/g, '') }]
    }));
    setNewPlaceholder({ name: '', sample: '' });
  };
  
  const removePlaceholder = (index: number) => {
    const updatedPlaceholders = editedTemplate.placeholders.filter((_, i) => i !== index);
    setEditedTemplate(prev => ({...prev, placeholders: updatedPlaceholders}));
  }

  const insertPlaceholder = (name: string) => {
    // This is a simplified insertion. A real rich text editor would be more complex.
    setEditedTemplate(prev => ({...prev, body: prev.body + `{${name}}`}));
  }

  const handleAiAction = async (action: AiAction) => {
    if (!editedTemplate.body) return;
    setIsAiLoading(action);
    try {
      let newBody = '';
      if (action === AiAction.GRAMMAR) {
        newBody = await correctGrammar(editedTemplate.body);
      } else if (action === AiAction.FRIENDLY) {
        newBody = await rewriteFriendly(editedTemplate.body);
      } else if (action === AiAction.FORMAL) {
        newBody = await rewriteFormal(editedTemplate.body);
      }
      setEditedTemplate(prev => ({ ...prev, body: newBody }));
    } catch (error) {
      console.error('AI action failed:', error);
      alert('An error occurred while using the AI assistant.');
    } finally {
      setIsAiLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {template.id.startsWith('new-') ? 'Create Template' : 'Edit Template'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="col-span-2 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Template Name</label>
              <input type="text" name="name" id="name" value={editedTemplate.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fromName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Name</label>
                  <input type="text" name="fromName" id="fromName" value={editedTemplate.fromName || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g., Jane Doe"/>
                </div>
                <div>
                  <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Email</label>
                  <input type="email" name="fromEmail" id="fromEmail" value={editedTemplate.fromEmail || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g., jane.doe@example.com"/>
                </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
              <input type="text" name="subject" id="subject" value={editedTemplate.subject} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
             <div>
              <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
              <input type="text" name="recipients" id="recipients" value={editedTemplate.recipients} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="cc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cc</label>
              <input type="text" name="cc" id="cc" value={editedTemplate.cc} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Body</label>
              <textarea name="body" id="body" value={editedTemplate.body} onChange={handleChange} rows={10} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1 space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <div>
                <label htmlFor="folderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Folder</label>
                <select name="folderId" id="folderId" value={editedTemplate.folderId || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="" disabled>Select a folder</option>
                  {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
               </div>
                <div>
                  <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Visibility</label>
                  <select name="visibility" id="visibility" value={editedTemplate.visibility} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value={TemplateVisibility.PERSONAL}>Personal</option>
                    <option value={TemplateVisibility.TEAM}>Team</option>
                  </select>
                </div>
            </div>
            
            {/* AI Assistant */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold flex items-center mb-3"><SparklesIcon className="w-5 h-5 mr-2 text-indigo-400"/>AI Assistant</h3>
                <div className="space-y-2">
                    <button onClick={() => handleAiAction(AiAction.GRAMMAR)} disabled={!!isAiLoading} className="w-full flex justify-center items-center text-sm py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                        {isAiLoading === AiAction.GRAMMAR ? 'Correcting...' : 'Correct Grammar & Spelling'}
                    </button>
                    <button onClick={() => handleAiAction(AiAction.FRIENDLY)} disabled={!!isAiLoading} className="w-full flex justify-center items-center text-sm py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                        {isAiLoading === AiAction.FRIENDLY ? 'Rewriting...' : 'Rewrite: Friendly & Helpful'}
                    </button>
                     <button onClick={() => handleAiAction(AiAction.FORMAL)} disabled={!!isAiLoading} className="w-full flex justify-center items-center text-sm py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                        {isAiLoading === AiAction.FORMAL ? 'Rewriting...' : 'Rewrite: Formal & Professional'}
                    </button>
                </div>
            </div>

            {/* Placeholders */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold flex items-center mb-3"><TagIcon className="w-5 h-5 mr-2 text-indigo-400"/>Placeholders</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {editedTemplate.placeholders.map((p, i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <span className="text-sm font-mono bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-1 rounded cursor-pointer" onClick={() => insertPlaceholder(p.name)}>{`{${p.name}}`}</span>
                            <input type="text" placeholder="Sample Value" value={p.sample} onChange={e => handlePlaceholderChange(i, 'sample', e.target.value)} className="flex-1 w-full text-xs rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm"/>
                            <button onClick={() => removePlaceholder(i)}><XIcon className="w-4 h-4 text-gray-500 hover:text-red-500"/></button>
                        </div>
                    ))}
                </div>
                <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <input type="text" placeholder="NewPlaceholder" value={newPlaceholder.name} onChange={e => setNewPlaceholder({...newPlaceholder, name: e.target.value})} className="flex-1 w-full text-sm rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm" />
                    <button onClick={addPlaceholder} className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"><PlusIcon className="w-4 h-4"/></button>
                </div>
            </div>

          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div>
            {!template.id.startsWith('new-') && (
              <button
                onClick={() => onDelete(template.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Delete
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editedTemplate)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <SaveIcon className="w-5 h-5 mr-2" />
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
