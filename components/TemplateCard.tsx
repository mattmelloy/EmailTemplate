
import React from 'react';
import { Template, TemplateVisibility } from '../types';
import { PencilIcon, PaperAirplaneIcon, UsersIcon, UserIcon } from './Icons';

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onUse: (template: Template) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onEdit, onUse }) => {
  const VisibilityIcon = template.visibility === TemplateVisibility.TEAM ? UsersIcon : UserIcon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200 dark:border-gray-700">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-2">{template.name}</h3>
          <div className="flex-shrink-0 flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
            <VisibilityIcon className="w-4 h-4 mr-1"/>
            <span>{template.visibility}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2" title={template.subject}>
          <strong>Sub:</strong> {template.subject}
        </p>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2 rounded-b-lg">
        <button
          onClick={() => onEdit(template)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          onClick={() => onUse(template)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PaperAirplaneIcon className="w-4 h-4 mr-2" />
          Use
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
