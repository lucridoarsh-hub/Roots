
import { LifeStage, MediaType, Memory, UserProfile, BlogPost } from './types';
import { Book, GraduationCap, Briefcase, Heart, Baby, Sun, Image as ImageIcon, Video, Mic, FileText } from 'lucide-react';

export const APP_NAME = "Enduring Roots";

// Mock logged-in user for collaboration logic
export const CURRENT_USER: UserProfile = {
  id: 'user_123',
  name: 'Alex Thompson',
  email: 'alex@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=alex',
  joinDate: '2023-01-01'
};

export const LIFE_STAGE_CONFIG = {
  [LifeStage.EARLY_YEARS]: { color: 'bg-rose-100 text-rose-800', icon: Baby, label: 'Early Years' },
  [LifeStage.SCHOOL_YEARS]: { color: 'bg-blue-100 text-blue-800', icon: Book, label: 'School Years' },
  [LifeStage.COLLEGE]: { color: 'bg-indigo-100 text-indigo-800', icon: GraduationCap, label: 'College' },
  [LifeStage.MARRIAGE_RELATIONSHIPS]: { color: 'bg-pink-100 text-pink-800', icon: Heart, label: 'Marriage & Relationships' },
  [LifeStage.CAREER]: { color: 'bg-amber-100 text-amber-800', icon: Briefcase, label: 'Career' },
  [LifeStage.RETIREMENT_REFLECTIONS]: { color: 'bg-emerald-100 text-emerald-800', icon: Sun, label: 'Retirement & Reflections' },
  [LifeStage.OTHER]: { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Other' },
};

export const MEDIA_TYPE_ICONS = {
  [MediaType.PHOTO]: ImageIcon,
  [MediaType.VIDEO]: Video,
  [MediaType.DOCUMENT]: FileText,
};

export const MOCK_MEMORIES: Memory[] = [
  {
    id: 'early-1',
    title: 'First Baby Steps',
    description: 'Dad captured this moment in the backyard. Apparently, I was chasing the family dog when I finally found my balance!',
    summary: 'Taking my very first steps while chasing the family dog.',
    date: '1961-05-12',
    year: 1961,
    lifeStage: LifeStage.EARLY_YEARS,
    tags: ['childhood', 'firsts', 'family'],
    mediaType: MediaType.PHOTO,
    mediaUrl: 'https://images.unsplash.com/photo-1519689680058-324335c777eba?q=80&w=2670&auto=format&fit=crop',
    createdAt: Date.now() - 1000000,
    ownerId: 'user_123',
    collaborators: [],
    history: []
  },
  {
    id: 'early-2',
    title: 'Third Birthday Party',
    description: 'I remember the giant strawberry cake Mom made. Most of it ended up on my face rather than in my mouth.',
    summary: 'Messy face and strawberry cake at my 3rd birthday.',
    date: '1963-08-20',
    year: 1963,
    lifeStage: LifeStage.EARLY_YEARS,
    tags: ['birthday', 'cake', 'celebration'],
    mediaType: MediaType.PHOTO,
    mediaUrl: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=2669&auto=format&fit=crop',
    createdAt: Date.now() - 900000,
    ownerId: 'user_123',
    collaborators: [],
    history: []
  }
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Importance of Preserving Family History',
    excerpt: 'Why documenting your lineage is the greatest gift you can leave for future generations.',
    content: 'In an age of fleeting digital moments, taking the time to curate a structured family history is profound. It anchors us, giving us a sense of belonging and identity...',
    coverImageUrl: 'https://images.unsplash.com/photo-1544391672-8705f4c4a4f8?q=80&w=2568&auto=format&fit=crop',
    author: 'Eleanor Vance',
    date: '2023-10-15',
    category: 'Legacy'
  },
  {
    id: '2',
    title: 'Digitizing Old Photos: A Step-by-Step Guide',
    excerpt: 'How to scan, restore, and upload your physical photo albums without losing quality.',
    content: 'Those dusty shoeboxes in the attic hold treasures. But time is the enemy of physical paper. Here is how you can ensure your grandparents\' wedding photos last forever...',
    coverImageUrl: 'https://images.unsplash.com/photo-1550949023-2895f3295982?q=80&w=2670&auto=format&fit=crop',
    author: 'Marcus Chen',
    date: '2023-11-02',
    category: 'Tips & Tricks'
  }
];

export const TESTIMONIALS = [
  { name: "Rajesh Kumar", location: "New Delhi", quote: "Enduring Roots helped me preserve my grandfather's partition stories that were otherwise fading from our memory.", avatar: "https://i.pravatar.cc/150?u=rajesh" },
  { name: "Priya Sharma", location: "Mumbai", quote: "The timeline view is therapeutic. Seeing my life chapters unfold like a book makes me appreciate my journey so much more.", avatar: "https://i.pravatar.cc/150?u=priya" },
  { name: "Amit Patel", location: "Ahmedabad", quote: "Best way to document family recipes and history. My kids now have a digital heritage they can actually interact with.", avatar: "https://i.pravatar.cc/150?u=amit" },
  { name: "Ananya Iyer", location: "Chennai", quote: "Finally a place where my photos aren't just sitting in a cloud folder. They actually tell a story here.", avatar: "https://i.pravatar.cc/150?u=ananya" },
  { name: "Vikram Singh", location: "Chandigarh", quote: "I used the export feature to print a memory book for my parents' 50th anniversary. They were moved to tears.", avatar: "https://i.pravatar.cc/150?u=vikram" },
  { name: "Sneha Reddy", location: "Hyderabad", quote: "The privacy controls are what sold me. I feel safe sharing my most personal moments with just my inner circle.", avatar: "https://i.pravatar.cc/150?u=sneha" },
  { name: "Arjun Mehta", location: "Pune", quote: "As a history buff, I love how I can organize my family's migration story across generations using the 'Other' life stages.", avatar: "https://i.pravatar.cc/150?u=arjun" },
  { name: "Kavita Gupta", location: "Lucknow", quote: "I've started interviewing my elders using the legacy prompts. It's uncovering stories I never knew existed.", avatar: "https://i.pravatar.cc/150?u=kavita" },
  { name: "Rohan Das", location: "Kolkata", quote: "A brilliant tool for the modern Indian family spread across the globe. We stay connected through our shared roots.", avatar: "https://i.pravatar.cc/150?u=rohan" },
  { name: "Meera Nair", location: "Kochi", quote: "User-friendly even for my grandmother. She loves uploading old photos and narrating the stories behind them.", avatar: "https://i.pravatar.cc/150?u=meera" },
  { name: "Sanjay Verma", location: "Jaipur", quote: "The smart summaries are surprisingly accurate. It saves so much time when looking back at a specific decade.", avatar: "https://i.pravatar.cc/150?u=sanjay" },
  { name: "Ishani Bose", location: "Guwahati", quote: "Preserving our cultural festivals through videos on Enduring Roots has been a joy for my entire extended family.", avatar: "https://i.pravatar.cc/150?u=ishani" },
  { name: "Rahul Malhotra", location: "Gurgaon", quote: "I document my professional milestones here. It's more than just a resume; it's a career legacy.", avatar: "https://i.pravatar.cc/150?u=rahul" },
  { name: "Deepa Krishnan", location: "Bangalore", quote: "The mobile experience is seamless. I capture moments on the go and they fit right into my life timeline.", avatar: "https://i.pravatar.cc/150?u=deepa" },
  { name: "Manish Joshi", location: "Indore", quote: "Enduring Roots is exactly what I was looking for to archive our family business history from 1950 onwards.", avatar: "https://i.pravatar.cc/150?u=manish" },
  { name: "Saritha Rao", location: "Mysore", quote: "Documenting my kids' early years here is so much better than messy scrapbooks. It's organized and searchable.", avatar: "https://i.pravatar.cc/150?u=saritha" },
  { name: "Abhishek Pandey", location: "Patna", quote: "Reliable and robust. I trust this platform with my most precious digital assets.", avatar: "https://i.pravatar.cc/150?u=abhishek" },
  { name: "Tanvi Saxena", location: "Bhopal", quote: "The 'On This Day' feature always brings a smile to my face. A daily dose of nostalgia done right.", avatar: "https://i.pravatar.cc/150?u=tanvi" },
  { name: "Gautam Deshmukh", location: "Nagpur", quote: "An essential app for every Indian household. Our history is too rich to be forgotten in dusty albums.", avatar: "https://i.pravatar.cc/150?u=gautam" },
  { name: "Pooja Trivedi", location: "Surat", quote: "I love the clean, distraction-free design. It really lets the memories take center stage.", avatar: "https://i.pravatar.cc/150?u=pooja" }
];

export const ASK_ME_QUESTIONS = [
  "What was your favorite toy growing up?",
  "How did you meet your spouse/partner?",
  "What is a family tradition you hope continues?",
  "What was your first job like?",
  "Who was your favorite teacher and why?",
  "Tell us a memory about a holiday celebration.",
  "What advice would you give your younger self?"
];
