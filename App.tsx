import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Template } from './types';
import { INITIAL_TEMPLATES, FOLDERS, EMPTY_TEMPLATE } from './constants';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TemplateCard from './components/TemplateCard';
import TemplateEditor from './components/TemplateEditor';
import UseTemplateModal from './components/UseTemplateModal';
import { PlusIcon } from './components/Icons';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';


const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [usingTemplate, setUsingTemplate] = useState<Template | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setShowAuthModal(false); // Close modal on successful login
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNewTemplate = () => {
    if (!session?.user) return; // Guard against no user
    const newTemplate: Template = {
      id: `new-${Date.now()}`,
      ...JSON.parse(JSON.stringify(EMPTY_TEMPLATE)),
      userId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: selectedFolder || FOLDERS[0].id,
    };
    setEditingTemplate(newTemplate);
    setIsEditorOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsEditorOpen(true);
  };
  
  const handleUseTemplate = (template: Template) => {
    setUsingTemplate(template);
  };

  const handleSaveTemplate = (templateToSave: Template) => {
    setTemplates(prev => {
      const exists = prev.some(t => t.id === templateToSave.id);
      if (exists) {
        return prev.map(t => t.id === templateToSave.id ? { ...templateToSave, updatedAt: new Date().toISOString() } : t);
      }
      return [...prev, templateToSave];
    });
    setIsEditorOpen(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    setIsEditorOpen(false);
    setEditingTemplate(null);
  }

  const filteredTemplates = useMemo(() => {
    if (!selectedFolder) return templates;
    return templates.filter(t => t.folderId === selectedFolder);
  }, [templates, selectedFolder]);

  if (!session) {
    return (
      <>
        <LandingPage onLoginClick={() => setShowAuthModal(true)} />
        {showAuthModal && <Auth onClose={() => setShowAuthModal(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <Sidebar folders={FOLDERS} selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} user={session.user} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onNewTemplate={handleNewTemplate} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
            <div className="container mx-auto">
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTemplates.map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onEdit={handleEditTemplate}
                      onUse={handleUseTemplate}
                    />
                  ))}
                </div>
              ) : (
                  <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">No templates in this folder.</p>
                      <button
                          onClick={handleNewTemplate}
                          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                          <PlusIcon className="w-5 h-5 mr-2" />
                          Create a New Template
                      </button>
                  </div>
              )}
            </div>
          </main>
        </div>

        {isEditorOpen && editingTemplate && (
          <TemplateEditor 
            template={editingTemplate}
            onSave={handleSaveTemplate}
            onClose={() => setIsEditorOpen(false)}
            onDelete={handleDeleteTemplate}
            folders={FOLDERS}
          />
        )}

        {usingTemplate && (
          <UseTemplateModal
            template={usingTemplate}
            onClose={() => setUsingTemplate(null)}
          />
        )}
      </div>
    </>
  );
};

export default App;