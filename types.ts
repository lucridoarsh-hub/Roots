export enum LifeStage {
  EARLY_YEARS = 'Early Years',
  SCHOOL_YEARS = 'School Years',
  COLLEGE = 'College',
  MARRIAGE_RELATIONSHIPS = 'Marriage & Relationships',
  CAREER = 'Career',
  RETIREMENT_REFLECTIONS = 'Retirement & Reflections',
  OTHER = 'Other'
}

export enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  TEXT = "text",
}

export type PermissionLevel = 'VIEW' | 'COMMENT' | 'EDIT';

export interface Collaborator {
  userId: string;
  email: string;
  name?: string;
  permission: PermissionLevel;
  status: 'PENDING' | 'ACCEPTED';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface Reaction {
  userId: string;
  userName: string;
  type: 'HEART' | 'LIKE' | 'SMILE';
}

export interface HistoryChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface HistoryEntry {
  id: string;
  userId: string;
  userName: string;
  timestamp: number;
  action: 'CREATED' | 'UPDATED' | 'MEDIA_ADDED' | 'COLLABORATOR_ADDED' | 'COLLABORATOR_REMOVED';
  details?: string;
  changes?: HistoryChange[];
}

type Preferences = {
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  highContrast?: boolean;
};

type User = {
  _id: string;
  name: string;
  email: string;
  preferences?: Preferences;
};

// Extended image type with altText and location
export interface MemoryImage {
  url: string;
  publicId: string;
  caption: string;
  altText?: string;    // for accessibility
  location?: string;   // where this specific photo was taken
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  summary?: string;
  date: string;
  images?: MemoryImage[];  // updated to use MemoryImage
  year: number;
  lifeStage: LifeStage;
  tags: string[];
  mediaUrl?: string;
  mediaType: MediaType;
  isPrivate?: boolean;
  createdAt: number;
  isDeleted?: boolean; // Soft delete support
  
  ownerId: string;
  collaborators: Collaborator[];
  comments?: Comment[];
  reactions?: Reaction[];
  history?: HistoryEntry[];
  
  lastEditedBy?: string;
  lastEditedAt?: number;

  // New fields added for enhanced metadata
  location?: string;     // memory-level location (e.g., "Paris, France")
  mood?: string;         // "happy", "nostalgic", "funny", "sad", "exciting"
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  author: string;
  date: string;
  category: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  joinDate: string;
  preferences?: {
    fontSize: 'sm' | 'base' | 'lg';
    highContrast: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface FilterState {
  searchQuery: string;
  lifeStage: LifeStage | 'ALL';
  mediaType: MediaType | 'ALL';
  yearRange: [number, number];
  showDeleted: boolean;
}