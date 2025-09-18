
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Template, Folder } from './types';
import { EMPTY_TEMPLATE, TEAM_ID } from './constants';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TemplateCard from './components/TemplateCard';
import TemplateEditor from './components/TemplateEditor';
import UseTemplateModal from './components/UseTemplateModal';
import { PlusIcon, GlobeAltIcon } from './components/Icons';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';


const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [usingTemplate, setUsingTemplate] = useState<Template | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const fetchData = useCallback(async (user: Session['user']) => {
    setLoading(true);
    
    // In a real app, folders would also be fetched from the database
    // For now, we'll create some default folders for the user
    const defaultFolders: Folder[] = [
      { id: 'folder-personal', teamId: null, userId: user.id, name: 'Personal' },
      { id: 'folder-team-sales', teamId: TEAM_ID, userId: null, name: 'Sales Team' },
      { id: 'folder-team-support', teamId: TEAM_ID, userId: null, name: 'Support' },
    ];
    setFolders(defaultFolders);

    // Fetch templates
    // This fetches templates created by the user OR templates visible to their team
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .or(`user_id.eq.${user.id},and(visibility.eq.team,team_id.eq.${TEAM_ID})`);

    if (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    } else if (data) {
      // Supabase returns snake_case, so we map to our camelCase type
      const formattedTemplates = data.map(t => ({
        id: t.id,
        teamId: t.team_id,
        userId: t.user_id,
        folderId: t.folder_id,
        name: t.name,
        fromName: t.from_name,
        fromEmail: t.from_email,
        to: t.to,
        cc: t.cc,
        bcc: t.bcc,
        subject: t.subject,
        body: t.body,
        placeholders: t.placeholders || [],
        priority: t.priority,
        visibility: t.visibility,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      }));
      setTemplates(formattedTemplates);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchData(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchData(session.user);
      } else {
        setTemplates([]);
        setFolders([]);
      }
      setShowAuthModal(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  const handleNewTemplate = () => {
    if (!session?.user) return;
    const newTemplate: Template = {
      id: `new-${Date.now()}`,
      ...JSON.parse(JSON.stringify(EMPTY_TEMPLATE)),
      userId: session.user.id,
      teamId: TEAM_ID, // Assign a default team
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: selectedFolder || folders[0]?.id || null,
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

  const handleSaveTemplate = async (templateToSave: Template) => {
    if (!session?.user) return;

    // Map frontend camelCase to database snake_case
    const { id, teamId, userId, folderId, name, fromName, fromEmail, to, cc, bcc, subject, body, placeholders, priority, visibility } = templateToSave;
    const record = {
      team_id: teamId,
      user_id: userId,
      folder_id: folderId,
      name,
      from_name: fromName,
      from_email: fromEmail,
      to, cc, bcc, subject, body, placeholders, priority, visibility,
    };

    let error;
    if (id.startsWith('new-')) {
      ({ error } = await supabase.from('templates').insert({ ...record, user_id: session.user.id }));
    } else {
      ({ error } = await supabase.from('templates').update(record).eq('id', id));
    }
    
    if (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template.');
    } else {
      await fetchData(session.user); // Refresh data from DB
    }

    setIsEditorOpen(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = async (id: string) => {
    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template.');
    } else {
      setTemplates(prev => prev.filter(t => t.id !== id)); // Optimistic update
    }
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
        <Sidebar folders={folders} selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} user={session.user} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onNewTemplate={handleNewTemplate} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
            <div className="container mx-auto">
              {loading ? (
                  <div className="text-center py-20">
                    <GlobeAltIcon className="w-12 h-12 text-gray-400 mx-auto animate-spin" />
                    <p className="mt-4 text-lg text-gray-500">Loading your templates...</p>
                  </div>
              ) : filteredTemplates.length > 0 ? (
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
            folders={folders}
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