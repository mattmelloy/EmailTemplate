
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Folder } from '../types';
import { supabase } from '../services/supabaseClient';
import { FolderIcon, UserCircleIcon, LogoutIcon } from './Icons';

interface SidebarProps {
  folders: Folder[];
  selectedFolder: string | null;
  setSelectedFolder: (folderId: string | null) => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ folders, selectedFolder, setSelectedFolder, user }) => {
  const personalFolders = folders.filter(f => f.userId);
  const teamFolders = folders.filter(f => f.teamId);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderFolderList = (folderList: Folder[], title: string) => (
    <div className="mt-4">
      <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      <div className="mt-2 space-y-1">
        {folderList.map(folder => (
          <button
            key={folder.id}
            onClick={() => setSelectedFolder(folder.id)}
            className={`w-full text-left flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
              selectedFolder === folder.id
                ? 'bg-indigo-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <FolderIcon className="w-5 h-5 mr-3" />
            {folder.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
       <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 flex-shrink-0 px-4">
         <button 
           onClick={() => setSelectedFolder(null)}
           className={`w-full text-left flex items-center px-2 py-2 text-sm font-bold rounded-md transition-colors duration-150 ${
              !selectedFolder
                ? 'bg-indigo-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
         >
           All Templates
         </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {renderFolderList(personalFolders, 'Personal')}
        {renderFolderList(teamFolders, 'Team')}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
              <div className="flex items-center overflow-hidden">
                  <UserCircleIcon className="w-10 h-10 text-gray-400 flex-shrink-0"/>
                  <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate" title={user.email}>{user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Logged In</p>
                  </div>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <LogoutIcon className="w-5 h-5"/>
              </button>
          </div>
      </div>
    </aside>
  );
};

export default Sidebar;