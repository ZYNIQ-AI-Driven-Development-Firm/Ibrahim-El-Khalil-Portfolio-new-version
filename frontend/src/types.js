export enum MessageSender {
    USER = 'user',
    AI = 'ai',
}

export interface ChatMessage {
    sender: MessageSender;
    text: string;
}

export interface Project {
  name: string;
  description: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  projects?: Project[];
}

export interface EducationItem {
    institution: string;
    degree: string;
    period: string;
    location: string;
    description?: string;
}

export interface SkillCategory {
    title: string;
    skills: string[];
}

export interface VentureItem {
    name: string;
    tagline?: string;
    description: string;
    byline?: string;
    logoPlaceholder?: boolean;
}
