import { Template, Folder, TemplatePriority, TemplateVisibility } from './types';

export const USER_ID = 'uuid-user-1'; // This will be replaced by the authenticated user's ID
export const TEAM_ID = 'uuid-team-1'; // This will be replaced by the user's current team ID

export const EMPTY_TEMPLATE: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'userId'> = {
  teamId: null,
  folderId: null,
  name: '',
  fromName: '',
  fromEmail: '',
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  body: '',
  placeholders: [],
  priority: TemplatePriority.NORMAL,
  visibility: TemplateVisibility.PERSONAL,
};
