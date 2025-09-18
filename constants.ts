
import { Template, Folder, TemplatePriority, TemplateVisibility } from './types';

export const USER_ID = 'uuid-user-1';
export const TEAM_ID = 'uuid-team-1';

export const FOLDERS: Folder[] = [
  { id: 'folder-1', teamId: null, userId: USER_ID, name: 'Personal' },
  { id: 'folder-2', teamId: TEAM_ID, userId: null, name: 'Sales Team' },
  { id: 'folder-3', teamId: TEAM_ID, userId: null, name: 'Support' },
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'uuid-1234',
    teamId: TEAM_ID,
    userId: USER_ID,
    folderId: 'folder-2',
    name: 'New Client Onboarding',
    fromName: 'Melloy Surgery',
    fromEmail: 'info@melloymedical.au',
    to: '{ClientEmail}',
    cc: 'reception@melloymedical.au',
    bcc: '',
    subject: 'Welcome to Melloy Surgery — Next steps for {ClientName}',
    body: `<p>Hello {ClientName},</p><p>Thanks for choosing us for your upcoming procedure. We've attached a welcome packet with all the information you need.</p><p>Please let us know if you have any questions.</p><p>Best regards,<br>The Team at Melloy Surgery</p>`,
    placeholders: [
      { name: 'ClientName', sample: 'John Smith' },
      { name: 'ClientEmail', sample: 'john@example.com' },
    ],
    priority: TemplatePriority.NORMAL,
    visibility: TemplateVisibility.TEAM,
    createdAt: '2024-09-18T10:00:00Z',
    updatedAt: '2024-09-18T10:00:00Z',
  },
  {
    id: 'uuid-5678',
    teamId: null,
    userId: USER_ID,
    folderId: 'folder-1',
    name: 'Project Follow-up',
    to: '{ContactEmail}',
    cc: '',
    bcc: '',
    subject: 'Following up on {ProjectName}',
    body: `<p>Hi {ContactFirstName},</p><p>Just wanted to quickly follow up on our conversation about the {ProjectName} project. Are you free for a brief chat sometime this week?</p><p>Thanks,</p>`,
    placeholders: [
      { name: 'ContactEmail', sample: 'jane.d@company.com' },
      { name: 'ProjectName', sample: 'Q4 Marketing Campaign' },
      { name: 'ContactFirstName', sample: 'Jane' },
    ],
    priority: TemplatePriority.LOW,
    visibility: TemplateVisibility.PERSONAL,
    createdAt: '2024-09-17T14:30:00Z',
    updatedAt: '2024-09-17T14:30:00Z',
  },
  {
    id: 'uuid-9101',
    teamId: TEAM_ID,
    userId: 'uuid-user-2',
    folderId: 'folder-3',
    name: 'Support Ticket Resolved',
    to: '{UserEmail}',
    cc: '',
    bcc: '',
    subject: 'Re: Your support ticket #{TicketID} has been resolved',
    body: `<p>Hello {UserName},</p><p>We're writing to let you know that your support ticket #{TicketID} has been marked as resolved. If you feel the issue is not resolved, please reply to this email to reopen the ticket.</p><p>Thank you for your patience!</p>`,
    placeholders: [
      { name: 'UserEmail', sample: 'user@domain.com' },
      { name: 'UserName', sample: 'Sam Jones' },
      { name: 'TicketID', sample: '748391' },
    ],
    priority: TemplatePriority.HIGH,
    visibility: TemplateVisibility.TEAM,
    createdAt: '2024-09-16T09:00:00Z',
    updatedAt: '2024-09-16T09:00:00Z',
  },
];

export const EMPTY_TEMPLATE: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
  teamId: null,
  userId: USER_ID,
  folderId: FOLDERS[0].id,
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