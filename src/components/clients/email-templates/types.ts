export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}
