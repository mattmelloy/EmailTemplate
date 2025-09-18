export interface Placeholder {
  name: string;
  sample: string;
}

export enum TemplatePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

export enum TemplateVisibility {
  PERSONAL = 'personal',
  TEAM = 'team',
}

export interface Template {
  id: string;
  teamId: string | null;
  userId: string;
  folderId: string | null;
  name: string;
  fromName?: string;
  fromEmail?: string;
  recipients: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  placeholders: Placeholder[];
  priority: TemplatePriority;
  visibility: TemplateVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  teamId: string | null;
  userId: string | null;
  name: string;
}

export enum AiAction {
  GRAMMAR = 'grammar',
  FRIENDLY = 'friendly',
  FORMAL = 'formal',
}
