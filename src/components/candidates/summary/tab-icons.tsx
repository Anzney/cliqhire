import { Briefcase, FileText, Mail, Users, Activity, ClipboardList, Paperclip, History, MessageSquare, User } from 'lucide-react';

export const TAB_ICONS: Record<string, JSX.Element> = {
  Jobs: <Briefcase className="w-4 h-4 mr-1" />,
  Summary: <FileText className="w-4 h-4 mr-1" />,
  Activities: <Activity className="w-4 h-4 mr-1" />,
  Notes: <ClipboardList className="w-4 h-4 mr-1" />,
  'Client Team': <Users className="w-4 h-4 mr-1" />,
  Contacts: <User className="w-4 h-4 mr-1" />,
  History: <History className="w-4 h-4 mr-1" />,
  Resume: <Paperclip className="w-4 h-4 mr-1" />,
  Inbox: <Mail className="w-4 h-4 mr-1" />,
  Social: <MessageSquare className="w-4 h-4 mr-1" />,
  Recommendation: <Users className="w-4 h-4 mr-1" />,
  Attachments: <Paperclip className="w-4 h-4 mr-1" />,
};
