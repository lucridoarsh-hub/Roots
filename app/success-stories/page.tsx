"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Info, AlertCircle, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { APP_NAME } from "../../constants";
import Footer from "../Footer";

// ========== THEME CONSTANTS (from BlogPage) ==========
const theme = {
  colors: {
    brand: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
  },
  spacing: (n: number) => `${n * 0.25}rem`,
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  boxShadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT:
      "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  transition: { DEFAULT: "all 0.3s ease" },
  zIndex: { 0: 0, 10: 10, 20: 20, 30: 30, 40: 40, 50: 50, 60: 60 },
};

// ========== HOOKS ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
};

const useDarkMode = () => useMediaQuery("(prefers-color-scheme: dark)");

// ========== STORY INTERFACE ==========
interface Story {
  id: number;
  tag: "grandparents" | "childhood" | "family" | "gifting" | "migration";
  className: string;
  quote: string;
  avatar: string;
  author: string;
  location: string;
}

const SuccessStoriesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const isDark = useDarkMode();
  const isMdUp = useMediaQuery("(min-width: 768px)");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const masonryRef = useRef<HTMLDivElement>(null);

  // Dynamic app settings from localStorage
  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
    announcement: "",
    maintenanceMode: false,
  });

  // Load settings
  useEffect(() => {
    const saved = localStorage.getItem("roots_app_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDynamicSettings({
        appName: parsed.appName || APP_NAME,
        logoUrl: parsed.logoUrl || "",
        announcement: parsed.announcement || "",
        maintenanceMode: parsed.maintenanceMode || false,
      });
    }
  }, []);

  // Maintenance mode screen
  if (dynamicSettings.maintenanceMode) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.colors.brand[900],
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing(6),
          textAlign: "center",
          color: theme.colors.white,
          fontFamily: theme.fontFamily.sans,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: theme.spacing(8),
            borderRadius: "3rem",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            maxWidth: "448px",
            boxShadow: theme.boxShadow["2xl"],
          }}
        >
          <AlertCircle
            size={64}
            color={theme.colors.brand[400]}
            style={{
              margin: "0 auto",
              marginBottom: theme.spacing(6),
              animation: "pulse 2s infinite",
            }}
          />
          <h1
            style={{
              fontSize: theme.fontSize["4xl"],
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              marginBottom: theme.spacing(4),
            }}
          >
            Under Maintenance
          </h1>
          <p
            style={{
              color: theme.colors.brand[200],
              lineHeight: 1.625,
              marginBottom: theme.spacing(8),
            }}
          >
            {dynamicSettings.appName} is currently undergoing scheduled
            improvements. We&apos;ll be back shortly!
          </p>
          <div
            style={{
              height: "4px",
              width: theme.spacing(24),
              backgroundColor: theme.colors.brand[500],
              margin: "0 auto",
              borderRadius: theme.borderRadius.full,
            }}
          />
        </div>
      </div>
    );
  }

  // Navbar colors (dark/light aware)
  const navBg = isDark ? theme.colors.brand[900] + "E6" : "rgba(255,255,255,0.9)";
  const navBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const textSecondary = isDark ? theme.colors.brand[400] : theme.colors.gray[600];

  // ========== FULL 30 STORIES (unchanged) ==========
  const stories: Story[] = [
    {
      id: 1,
      tag: "grandparents",
      className: "card-blue",
      quote: "My nani had never told anyone outside the family about her journey from East Bengal in 1947. I sat with her for six evenings, recording her stories. Enduring Roots preserved every word. She passed away three months later. I cannot describe what it means to still hear her voice.",
      avatar: "PM",
      author: "Priya Mukherjee",
      location: "Kolkata, West Bengal",
    },
    {
      id: 2,
      tag: "childhood",
      className: "card-green",
      quote: "I found a box of photographs in my parents' attic — none of them labelled, none of them dated. I uploaded all 200 to Enduring Roots and slowly, with help from my aunts and uncles over a family WhatsApp call, we identified every single person. My children now know the faces of great-grandparents they never met.",
      avatar: "AR",
      author: "Arun Ramachandran",
      location: "Chennai, Tamil Nadu",
    },
    {
      id: 3,
      tag: "gifting",
      className: "card-gold",
      quote: "For my parents' golden anniversary, I exported a memory book from Enduring Roots. Fifty years of their life together — photographs from their wedding, their children's births, family vacations, and everyday moments — all beautifully laid out. My mother wept. My father said it was the finest gift he had ever received.",
      avatar: "SS",
      author: "Sunita Sharma",
      location: "Jaipur, Rajasthan",
    },
    {
      id: 4,
      tag: "family",
      className: "card-navy",
      quote: "Our family is spread across Mumbai, Bengaluru, Pune, and Houston. Enduring Roots gave us a private space where all of us contribute. My brother in Houston scanned my grandfather's old letters and uploaded them. My cousin in Pune added translations. I added the historical context. Together we built something none of us could have built alone.",
      avatar: "VK",
      author: "Vikram Kulkarni",
      location: "Mumbai, Maharashtra",
    },
    {
      id: 5,
      tag: "grandparents",
      className: "card-purple",
      quote: "My dadi grew up in a small village in UP that no longer exists. Using Enduring Roots, she described every detail — the well, the mango tree, the school, the neighbours. My son, who is studying architecture, created a digital sketch of the village from her descriptions. It brought her to tears.",
      avatar: "AV",
      author: "Ananya Verma",
      location: "Lucknow, Uttar Pradesh",
    },
    {
      id: 6,
      tag: "migration",
      className: "card-sky",
      quote: "My family moved from Kerala to Nairobi three generations ago and then to London. The story of how and why was always vague. Enduring Roots helped us piece it together — using old documents, letters, and stories from elderly relatives across three continents. Our children now know the full story of where we come from.",
      avatar: "TN",
      author: "Thomas Nair",
      location: "Thiruvananthapuram, Kerala",
    },
    {
      id: 7,
      tag: "family",
      className: "card-gold",
      quote: "I am the youngest of six siblings. None of us agreed on our family history — different versions of the same stories. Enduring Roots gave us a shared space where we could each contribute our version. Surprisingly, the differences became the most interesting part of our archive.",
      avatar: "MG",
      author: "Meera Gupta",
      location: "New Delhi",
    },
    {
      id: 8,
      tag: "childhood",
      className: "card-green",
      quote: "My son is 8 and already documenting his own life on Enduring Roots with my help. I want him to have something I never had — a complete record of his own childhood, told in his own words, that he can share with his children someday. This platform makes that possible.",
      avatar: "RS",
      author: "Rohit Singh",
      location: "Chandigarh, Punjab",
    },
    {
      id: 9,
      tag: "grandparents",
      className: "card-blue",
      quote: "My grandfather was a freedom fighter who marched with Gandhi. His stories were legendary in our family but never written down. I spent three months recording interviews with him and his surviving contemporaries. Enduring Roots preserved everything. It is now a piece of living history.",
      avatar: "KP",
      author: "Kavitha Pillai",
      location: "Kochi, Kerala",
    },
    {
      id: 10,
      tag: "migration",
      className: "card-red",
      quote: "My family left Sindh during Partition and rebuilt everything from nothing in Ahmedabad. The courage of that generation was something my parents always spoke about but never documented. Enduring Roots helped us turn their oral history into a structured family archive our grandchildren can access anywhere.",
      avatar: "RK",
      author: "Raj Kapoor",
      location: "Ahmedabad, Gujarat",
    },
    {
      id: 11,
      tag: "gifting",
      className: "card-purple",
      quote: "I used Enduring Roots to compile a memory book for my mother's 70th birthday. Three months of collecting photographs, recording stories from relatives, and organising it all by decade. When she saw it, she said it was the first time she had seen her whole life in one place. I will treasure that moment forever.",
      avatar: "DS",
      author: "Deepa Srinivasan",
      location: "Bengaluru, Karnataka",
    },
    {
      id: 12,
      tag: "family",
      className: "card-sky",
      quote: "We are a joint family of four generations living under one roof in Varanasi. Enduring Roots became our shared project during lockdown. Each generation contributed what they remembered. My grandmother's memories of the 1960s sit alongside my nephew's memories from 2023. It is extraordinary to see them side by side.",
      avatar: "AM",
      author: "Aniket Mishra",
      location: "Varanasi, Uttar Pradesh",
    },
    {
      id: 13,
      tag: "grandparents",
      className: "card-gold",
      quote: "My thatha was a Tamil Brahmin scholar who never published any of his writings. After he passed, we found hundreds of handwritten manuscripts. We scanned and uploaded every page to Enduring Roots. His words now live on a platform that my family in America, UK, and Singapore can all read and cherish.",
      avatar: "PR",
      author: "Padma Rajan",
      location: "Coimbatore, Tamil Nadu",
    },
    {
      id: 14,
      tag: "childhood",
      className: "card-navy",
      quote: "I grew up in a small town in Assam that was completely transformed by the 1987 floods. Our old house, our neighbourhood, our school — all gone. Enduring Roots helped me create a complete digital record of a world that no longer exists, for my children who have never seen it.",
      avatar: "BB",
      author: "Bhaskar Bora",
      location: "Guwahati, Assam",
    },
    {
      id: 15,
      tag: "migration",
      className: "card-green",
      quote: "My parents were Goan Catholics who migrated to Muscat in the 1970s and then to Pune in the 90s. The story of our family crosses three countries and four decades. Enduring Roots let us organise all of it into a beautiful timeline. My teenage daughter read it and said she finally understood who she is.",
      avatar: "FC",
      author: "Fatima Coelho",
      location: "Pune, Maharashtra",
    },
    {
      id: 16,
      tag: "gifting",
      className: "card-blue",
      quote: "When my parents celebrated 40 years of marriage, I surprised them with a memory book made on Enduring Roots. I had secretly collected photographs from their siblings, cousins, and old friends. My father, who never cries, cried. That is all I need to say about whether this platform delivers.",
      avatar: "NR",
      author: "Neha Rastogi",
      location: "Noida, Uttar Pradesh",
    },
    {
      id: 17,
      tag: "grandparents",
      className: "card-red",
      quote: "My father was an Army officer who served in four wars. He never spoke about his experiences. When he was diagnosed with early Alzheimer's, we used Enduring Roots to record everything before his memories faded. We captured stories he had never told anyone. I am so grateful we acted in time.",
      avatar: "SK",
      author: "Sonal Khanna",
      location: "Delhi Cantonment, New Delhi",
    },
    {
      id: 18,
      tag: "childhood",
      className: "card-sky",
      quote: "I was an NRI who grew up in Dubai and never felt connected to my Indian roots. Using Enduring Roots to build our family archive helped me understand for the first time why India matters so much to my parents. Now I bring my children here every year and show them the places in our archive.",
      avatar: "SP",
      author: "Sameer Patel",
      location: "Surat, Gujarat (originally Dubai)",
    },
    {
      id: 19,
      tag: "family",
      className: "card-purple",
      quote: "My mother has 11 siblings. Organising a reunion for 60+ family members would have been chaotic. We used Enduring Roots as our shared space beforehand — everyone contributing their photographs and memories. By the time we met in person, we felt like we already knew each other again. The platform created the reunion before the reunion.",
      avatar: "LA",
      author: "Lakshmi Ayer",
      location: "Madurai, Tamil Nadu",
    },
    {
      id: 20,
      tag: "migration",
      className: "card-gold",
      quote: "Three generations of our family left Bihar for different cities and countries. Nobody knew the whole story. I spent a year gathering pieces from every branch of the family. Enduring Roots made it possible to put it all together into one coherent story. Our family tree now spans 6 countries and 150 years.",
      avatar: "AK",
      author: "Amit Kumar",
      location: "Patna, Bihar",
    },
    {
      id: 21,
      tag: "gifting",
      className: "card-navy",
      quote: "My dadi turned 90 this year. We gifted her a memory book that covered her entire life — from her childhood village in Himachal to her grandchildren's college graduations. She spent an entire afternoon looking through it, telling stories we had never heard before. It unlocked memories she thought she had lost.",
      avatar: "RT",
      author: "Ravi Thakur",
      location: "Shimla, Himachal Pradesh",
    },
    {
      id: 22,
      tag: "grandparents",
      className: "card-green",
      quote: "My grandfather built the first school in his village with his own hands in 1952. He never told the story publicly. When he turned 85, I sat with him every Sunday for six months, recording everything. Enduring Roots is now the permanent home for his extraordinary, untold life.",
      avatar: "GN",
      author: "Girish Naik",
      location: "Hubli, Karnataka",
    },
    {
      id: 23,
      tag: "family",
      className: "card-blue",
      quote: "My husband and I wanted our adopted daughter to know the full story of both families — her birth family's culture and our own. Enduring Roots gave us a thoughtful, beautiful way to do that. She is 12 now and regularly adds to her own section. Watching her engage with her roots is one of the greatest joys of our life.",
      avatar: "IP",
      author: "Indira Pandit",
      location: "Hyderabad, Telangana",
    },
    {
      id: 24,
      tag: "childhood",
      className: "card-red",
      quote: "I was diagnosed with a serious illness last year. One of the first things I did was create a comprehensive archive on Enduring Roots for my children. Letters I had written to them, stories of my own childhood, family traditions I wanted preserved. I am recovering now, but the archive exists. That brings me profound peace.",
      avatar: "SM",
      author: "Suresh Menon",
      location: "Thrissur, Kerala",
    },
    {
      id: 25,
      tag: "migration",
      className: "card-purple",
      quote: "We are a Marwari family that has lived in Kolkata for 100 years. Our grandparents came from Rajasthan with nothing and built a business over three generations. Enduring Roots helped us document not just the photographs but the values, the business philosophy, and the family principles that were passed down. It is our family's living constitution.",
      avatar: "BK",
      author: "Bhavna Kedia",
      location: "Kolkata, West Bengal",
    },
    {
      id: 26,
      tag: "gifting",
      className: "card-sky",
      quote: "My brother moved to the US 15 years ago and always felt disconnected from the family's life back home. I created a detailed Enduring Roots archive and gave him access as a surprise on his birthday. He called me crying an hour later. He said it was the first time in years he felt truly close to us.",
      avatar: "PC",
      author: "Pooja Choudhary",
      location: "Jodhpur, Rajasthan",
    },
    {
      id: 27,
      tag: "family",
      className: "card-green",
      quote: "My mother and her sisters had not spoken properly in 10 years. I created a family archive on Enduring Roots and invited all of them. The project of building something together gave them a reason to reconnect. They are not fully reconciled, but they are talking again. Memories have a healing power I had underestimated.",
      avatar: "DT",
      author: "Dinesh Tyagi",
      location: "Agra, Uttar Pradesh",
    },
    {
      id: 28,
      tag: "grandparents",
      className: "card-navy",
      quote: "My naana was a master weaver from Varanasi who created silk sarees for three generations of brides in our family. He passed last year. We uploaded photographs of every saree he ever made, along with the stories of the women who wore them. It is the most beautiful archive I have ever seen. A true work of art.",
      avatar: "TG",
      author: "Tanvi Ghosh",
      location: "Varanasi, Uttar Pradesh",
    },
    {
      id: 29,
      tag: "childhood",
      className: "card-gold",
      quote: "I grew up in a small Christian community in Nagaland that has unique traditions, songs, and festivals that most Indians have never heard of. I used Enduring Roots to document everything — the food, the music, the stories, the calendar of festivals. I want my culture to survive beyond my generation.",
      avatar: "CZ",
      author: "Chumkila Zhimomi",
      location: "Kohima, Nagaland",
    },
    {
      id: 30,
      tag: "migration",
      className: "card-blue",
      quote: "My family is a blend of Punjabi, Bengali, and Kashmiri heritage. My parents' marriage was considered unconventional in 1978. I documented the whole story — the love, the struggle for acceptance, the ultimate triumph. My children need to know that love is always worth it. Enduring Roots gave their story a permanent home.",
      avatar: "MA",
      author: "Mira Anand",
      location: "Mumbai, Maharashtra",
    },
  ];

  const getTagLabel = (tag: string): string => {
    switch (tag) {
      case "grandparents":
        return "Grandparents' Legacy";
      case "childhood":
        return "Childhood Memories";
      case "family":
        return "Family Collaboration";
      case "gifting":
        return "Memory Book Gift";
      case "migration":
        return "Family Migration";
      default:
        return "";
    }
  };

  // Scroll reveal + masonry stagger
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    const currentCards = document.querySelectorAll(".masonry-item");
    currentCards.forEach((card, i) => {
      const el = card as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = `opacity .6s ${i * 0.04}s ease, transform .6s ${i * 0.04}s ease, box-shadow .25s, border-color .25s`;
      cardObserver.observe(card);
    });

    return () => {
      revealObserver.disconnect();
      cardObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* ORIGINAL SUCCESS STORIES STYLES (pixel-perfect) */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #1e2d6b; --navy-dark: #141d4a; --blue: #4a6fd4; --blue-light: #eef2ff;
          --blue-mid: #c8d4f5; --gold: #f5a623; --gold-light: #fff8ec; --text: #1a1a2e;
          --muted: #5a6a7e; --light: #f7f9ff; --white: #ffffff; --border: #e0e8f5;
          --c1: #fff8ec; --c1b: #f5a623; --c2: #eef2ff; --c2b: #4a6fd4;
          --c3: #f0faf4; --c3b: #2d8653; --c4: #fef2f2; --c4b: #e05252;
          --c5: #f5f0ff; --c5b: #7c4dff; --c6: #f0faff; --c6b: #0ea5e9;
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--white); line-height: 1.7; overflow-x: hidden; }

        /* All original CSS rules (unchanged) */
        .navbar { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); padding: 0 4rem; display: flex; align-items: center; justify-content: space-between; height: 68px; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-box { width: 36px; height: 36px; border-radius: 8px; background: var(--navy); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 16px; font-family: 'Playfair Display', serif; }
        .nav-brand { font-size: 17px; font-weight: 600; color: var(--navy); letter-spacing: -0.01em; }
        .nav-links { display: flex; gap: 2.5rem; list-style: none; }
        .nav-links a { font-size: 14px; color: var(--muted); text-decoration: none; font-weight: 400; transition: color .2s; }
        .nav-links a:hover, .nav-links a.active { color: var(--navy); font-weight: 500; }
        .nav-right { display: flex; align-items: center; gap: 1.5rem; }
        .btn-signin { font-size: 14px; color: var(--muted); text-decoration: none; font-weight: 500; }
        .btn-primary { background: var(--navy); color: #fff; border: none; padding: 9px 22px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; display: inline-block; transition: background .2s, transform .15s; }
        .btn-primary:hover { background: var(--navy-dark); transform: translateY(-1px); }

        .hero { background: linear-gradient(165deg, #eaf0fb 0%, #dde8f7 55%, #ccdaf2 100%); padding: 7rem 4rem 5rem; text-align: center; position: relative; overflow: hidden; }
        .hero::before { content: ""; position: absolute; inset: 0; background-image: radial-gradient(circle at 15% 60%, rgba(74,111,212,.1) 0%, transparent 55%), radial-gradient(circle at 85% 20%, rgba(30,45,107,.07) 0%, transparent 50%); }
        .hero-inner { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; }
        .hero-badge { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.75); border: 1px solid rgba(74,111,212,.2); color: #3a4a8a; font-size: 11px; font-weight: 600; letter-spacing: .1em; padding: 7px 18px; border-radius: 24px; margin-bottom: 2rem; text-transform: uppercase; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: 68px; font-weight: 800; line-height: 1.05; color: var(--navy); letter-spacing: -.02em; margin-bottom: .3em; }
        .hero h1 em { font-style: italic; color: var(--blue); display: block; }
        .hero-sub { font-size: 18px; color: var(--muted); line-height: 1.8; max-width: 520px; margin: 1.5rem auto 0; font-weight: 300; }

        .featured-wrap { padding: 4rem 4rem 0; }
        .featured-card { background: var(--navy-dark); border-radius: 24px; padding: 3.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; position: relative; overflow: hidden; }
        .featured-card::before { content: ""; position: absolute; width: 400px; height: 400px; border-radius: 50%; background: rgba(74,111,212,.12); right: -100px; top: -100px; }
        .featured-tag { display: inline-flex; align-items: center; gap: 6px; background: var(--gold); color: #1a0a00; font-size: 11px; font-weight: 700; letter-spacing: .08em; padding: 5px 14px; border-radius: 20px; margin-bottom: 1.5rem; text-transform: uppercase; }
        .featured-quote { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; font-style: italic; color: #fff; line-height: 1.4; margin-bottom: 2rem; position: relative; }
        .featured-quote::before { content: "\\201C"; font-size: 80px; line-height: 0; color: rgba(255,255,255,.1); position: absolute; top: 20px; left: -16px; font-family: 'Playfair Display', serif; }
        .featured-author { display: flex; align-items: center; gap: 1rem; }
        .author-avatar-lg { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px; font-family: 'Playfair Display', serif; flex-shrink: 0; }
        .featured-author-info h4 { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: .2rem; }
        .featured-author-info p { font-size: 13px; color: rgba(255,255,255,.5); }
        .featured-stars { color: var(--gold); font-size: 16px; margin-top: .3rem; }
        .featured-right { position: relative; z-index: 1; }
        .featured-detail { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 2rem; }
        .featured-detail p { font-size: 15px; color: rgba(255,255,255,.7); line-height: 1.8; margin-bottom: 1rem; }
        .featured-detail p:last-child { margin-bottom: 0; }
        .detail-tag { display: inline-block; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); color: rgba(255,255,255,.6); font-size: 12px; padding: 4px 12px; border-radius: 12px; margin: .25rem .25rem 0 0; }

        .masonry-section { padding: 4rem 4rem; }
        .section-header { margin-bottom: 3rem; }
        .section-label { font-size: 11px; font-weight: 600; letter-spacing: .12em; color: var(--blue); text-transform: uppercase; margin-bottom: .75rem; }
        .section-header h2 { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 800; color: var(--navy); margin-bottom: .75rem; line-height: 1.15; }
        .section-header p { font-size: 16px; color: var(--muted); max-width: 520px; }

        .masonry { column-count: 3; column-gap: 20px; }
        .masonry-item { break-inside: avoid; margin-bottom: 20px; border-radius: 18px; padding: 1.75rem; border: 1px solid var(--border); background: var(--white); transition: transform .25s, box-shadow .25s, border-color .25s; cursor: default; position: relative; }
        .masonry-item:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(30,45,107,.1); border-color: var(--blue-mid); }

        .card-gold  { background: var(--c1); border-color: #fde8bb; }
        .card-blue  { background: var(--c2); border-color: var(--blue-mid); }
        .card-green { background: var(--c3); border-color: #b6e5cc; }
        .card-red   { background: var(--c4); border-color: #f9c0c0; }
        .card-purple{ background: var(--c5); border-color: #d4bfff; }
        .card-sky   { background: var(--c6); border-color: #bae6fd; }
        .card-navy  { background: var(--navy-dark); border-color: #2a3d8f; }

        .quote-mark { font-family: 'Playfair Display', serif; font-size: 52px; line-height: 1; margin-bottom: .25rem; display: block; }
        .card-gold   .quote-mark { color: var(--c1b); opacity: .6; }
        .card-blue   .quote-mark { color: var(--c2b); opacity: .5; }
        .card-green  .quote-mark { color: var(--c3b); opacity: .6; }
        .card-red    .quote-mark { color: var(--c4b); opacity: .5; }
        .card-purple .quote-mark { color: var(--c5b); opacity: .6; }
        .card-sky    .quote-mark { color: var(--c6b); opacity: .5; }
        .card-navy   .quote-mark { color: rgba(255,255,255,.2); }

        .card-quote { font-family: 'Playfair Display', serif; font-size: 15px; font-style: italic; line-height: 1.65; margin-bottom: 1.25rem; color: var(--text); }
        .card-navy .card-quote { color: rgba(255,255,255,.85); }

        .card-stars { color: var(--gold); font-size: 13px; margin-bottom: 1rem; letter-spacing: 1px; }
        .card-navy .card-stars { color: var(--gold); }

        .card-footer { display: flex; align-items: center; gap: .75rem; margin-top: auto; }
        .avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; font-family: 'Playfair Display', serif; }
        .card-gold   .avatar { background: #fde8bb; color: #a0620a; }
        .card-blue   .avatar { background: var(--blue-mid); color: var(--navy); }
        .card-green  .avatar { background: #b6e5cc; color: #1a5c38; }
        .card-red    .avatar { background: #f9c0c0; color: #8b1a1a; }
        .card-purple .avatar { background: #d4bfff; color: #4a1a9a; }
        .card-sky    .avatar { background: #bae6fd; color: #0c5a7a; }
        .card-navy   .avatar { background: rgba(255,255,255,.12); color: #fff; }

        .card-author h5 { font-size: 14px; font-weight: 600; color: var(--navy); margin-bottom: .15rem; }
        .card-author p  { font-size: 12px; color: var(--muted); }
        .card-navy .card-author h5 { color: #fff; }
        .card-navy .card-author p  { color: rgba(255,255,255,.5); }

        .card-tag { position: absolute; top: 1.25rem; right: 1.25rem; font-size: 10px; font-weight: 600; letter-spacing: .06em; padding: 3px 10px; border-radius: 10px; text-transform: uppercase; }
        .card-gold   .card-tag { background: #fde8bb; color: #a0620a; }
        .card-blue   .card-tag { background: var(--blue-mid); color: var(--navy); }
        .card-green  .card-tag { background: #b6e5cc; color: #1a5c38; }
        .card-red    .card-tag { background: #f9c0c0; color: #8b1a1a; }
        .card-purple .card-tag { background: #d4bfff; color: #4a1a9a; }
        .card-sky    .card-tag { background: #bae6fd; color: #0c5a7a; }
        .card-navy   .card-tag { background: rgba(255,255,255,.12); color: rgba(255,255,255,.8); }

        .cta-band { background: linear-gradient(135deg, var(--navy) 0%, #2a3d8f 100%); padding: 5rem 4rem; text-align: center; position: relative; overflow: hidden; }
        .cta-band::before { content: ""; position: absolute; width: 500px; height: 500px; border-radius: 50%; background: rgba(255,255,255,.03); right: -150px; top: -150px; }
        .cta-band h2 { font-family: 'Playfair Display', serif; font-size: 44px; font-weight: 800; color: #fff; margin-bottom: 1rem; position: relative; }
        .cta-band h2 em { font-style: italic; color: #93b5ff; }
        .cta-band p { font-size: 17px; color: rgba(255,255,255,.65); margin-bottom: 2.5rem; position: relative; }
        .btn-gold { background: var(--gold); color: #1a0a00; padding: 14px 36px; border-radius: 10px; border: none; font-size: 16px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; display: inline-block; margin-right: 1rem; transition: transform .15s, box-shadow .15s; }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,166,35,.4); }
        .btn-ghost { background: transparent; color: #fff; padding: 12px 28px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,.35); font-size: 15px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; display: inline-block; transition: border-color .2s, background .2s; }
        .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,.08); }

        footer { background: #0d1533; padding: 2rem 4rem; display: flex; align-items: center; justify-content: space-between; }
        .footer-logo { display: flex; align-items: center; gap: 10px; }
        .footer-logo-box { width: 30px; height: 30px; border-radius: 6px; background: rgba(255,255,255,.15); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 13px; font-family: 'Playfair Display', serif; }
        .footer-brand { font-size: 14px; color: rgba(255,255,255,.5); }
        footer p { font-size: 12px; color: rgba(255,255,255,.3); }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links a { font-size: 12px; color: rgba(255,255,255,.3); text-decoration: none; transition: color .2s; }
        .footer-links a:hover { color: rgba(255,255,255,.6); }

        .reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s, transform .7s; }
        .reveal.on { opacity: 1; transform: none; }

        @media (max-width: 1100px) { .masonry { column-count: 2; } .featured-card { grid-template-columns: 1fr; gap: 2.5rem; } }
        @media (max-width: 900px) { .navbar, .hero, .featured-wrap, .masonry-section, .cta-band { padding-left: 2rem; padding-right: 2rem; } footer { padding: 2rem; } }
        @media (max-width: 640px) { .hero h1 { font-size: 40px; } .masonry { column-count: 1; } .nav-links { display: none; } .section-header h2 { font-size: 30px; } footer { flex-direction: column; gap: 1rem; text-align: center; } .footer-links { justify-content: center; } .cta-band h2 { font-size: 32px; } }
      `}</style>

      {/* ANNOUNCEMENT BAR */}
      {dynamicSettings.announcement && (
        <div
          style={{
            backgroundColor: theme.colors.brand[600],
            color: theme.colors.white,
            padding: `${theme.spacing(2)} 0`,
            textAlign: "center",
            fontSize: theme.fontSize.xs,
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing(2),
            position: "sticky",
            top: 0,
            zIndex: theme.zIndex[60],
          }}
        >
          <Info size={14} style={{ animation: "pulse 1s infinite" }} />
          {dynamicSettings.announcement}
        </div>
      )}

      {/* DYNAMIC NAVIGATION */}
      <nav
        style={{
          position: "fixed",
          width: "100%",
          zIndex: theme.zIndex[50],
          backgroundColor: navBg,
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${navBorder}`,
          transition: theme.transition.DEFAULT,
          top: dynamicSettings.announcement ? theme.spacing(8) : 0,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `${theme.spacing(4)} ${theme.spacing(6)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(2),
              textDecoration: "none",
            }}
          >
            {dynamicSettings.logoUrl ? (
              <img
                src={dynamicSettings.logoUrl}
                style={{
                  width: theme.spacing(8),
                  height: theme.spacing(8),
                  borderRadius: theme.borderRadius.lg,
                  objectFit: "cover",
                }}
                alt="Logo"
              />
            ) : (
              <div
                style={{
                  width: theme.spacing(8),
                  height: theme.spacing(8),
                  backgroundColor: isDark ? theme.colors.brand[600] : theme.colors.brand[900],
                  borderRadius: theme.borderRadius.lg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.colors.white,
                  fontFamily: theme.fontFamily.serif,
                  fontWeight: "bold",
                  fontSize: theme.fontSize.xl,
                }}
              >
                {dynamicSettings.appName[0]}
              </div>
            )}
            <span
              style={{
                fontSize: theme.fontSize["2xl"],
                fontFamily: theme.fontFamily.serif,
                fontWeight: "bold",
                color: isDark ? theme.colors.brand[100] : theme.colors.brand[900],
                letterSpacing: "-0.025em",
              }}
            >
              {dynamicSettings.appName}.
            </span>
          </Link>

          {/* Desktop Links */}
          {isMdUp && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(6),
              }}
            >
              <Link
                href="/"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Home
              </Link>
              <Link
                href="/about"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                About
              </Link>
              <Link
                href="/blog"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Blog
              </Link>
              <Link
                href="/success-stories"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: theme.colors.brand[700],
                  textDecoration: "none",
                }}
              >
                Success Stories
              </Link>
              <Link
                href="/contact"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Contact
              </Link>
            </div>
          )}

          {/* Auth + Mobile Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(4),
            }}
          >
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                style={{
                  padding: `${theme.spacing(2.5)} ${theme.spacing(5)}`,
                  backgroundColor: theme.colors.brand[900],
                  color: theme.colors.white,
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  borderRadius: theme.borderRadius.full,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  boxShadow: `0 10px 15px -3px ${theme.colors.brand[900]}33`,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(2),
                }}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: theme.fontSize.sm,
                    fontWeight: 500,
                    color: textSecondary,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  style={{
                    padding: `${theme.spacing(2.5)} ${theme.spacing(5)}`,
                    backgroundColor: theme.colors.brand[900],
                    color: theme.colors.white,
                    fontSize: theme.fontSize.sm,
                    fontWeight: 500,
                    borderRadius: theme.borderRadius.full,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    boxShadow: `0 10px 15px -3px ${theme.colors.brand[900]}33`,
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
            {!isMdUp && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: theme.spacing(2),
                  color: isDark ? theme.colors.brand[100] : theme.colors.brand[900],
                }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {!isMdUp && mobileMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: isDark
                ? theme.colors.brand[900]
                : "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
              borderBottom: `1px solid ${navBorder}`,
              padding: theme.spacing(4),
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(3),
              zIndex: theme.zIndex[40],
              boxShadow: theme.boxShadow.lg,
            }}
          >
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/blog", label: "Blog" },
              { href: "/success-stories", label: "Success Stories" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: theme.fontSize.base,
                  fontWeight: 500,
                  color:
                    item.href === "/success-stories"
                      ? theme.colors.brand[700]
                      : textSecondary,
                  textDecoration: "none",
                  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                  borderRadius: theme.borderRadius.md,
                  transition: "background-color 0.2s",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* MAIN CONTENT (with proper offset for fixed nav + announcement) */}
      <div style={{ marginTop: dynamicSettings.announcement ? "120px" : "80px" }}>
        {/* Hero (no filter bar or stats strip) */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1.5C4.5 1.5 3 2.8 3 4.5C3 7 6 10.5 6 10.5C6 10.5 9 7 9 4.5C9 2.8 7.5 1.5 6 1.5Z"
                  fill="#4a6fd4"
                />
              </svg>
              Real Stories
            </div>
            <h1>
              Families Across India<em>Preserving What Matters Most</em>
            </h1>
            <p className="hero-sub">
              From Mumbai to Mysuru, Delhi to Dibrugarh — families are using Enduring
              Roots to make sure their stories are never lost.
            </p>
          </div>
        </section>

        {/* Featured story remains unchanged */}
        <div className="featured-wrap reveal">
          <div className="featured-card">
            <div>
              <div className="featured-tag">⭐ Featured Story</div>
              <div className="featured-quote">
                "My father passed away in 2019 without ever writing down the story of
                how he walked from Lahore to Delhi during Partition. Today, his voice
                lives on Enduring Roots. My grandchildren will know exactly who he
                was."
              </div>
              <div className="featured-author">
                <div
                  className="author-avatar-lg"
                  style={{ background: "rgba(245,166,35,.2)", color: "var(--gold)" }}
                >
                  RS
                </div>
                <div className="featured-author-info">
                  <h4>Rajinder Singh Bedi</h4>
                  <p>Retired Colonel, Amritsar, Punjab</p>
                  <div className="featured-stars">★★★★★</div>
                </div>
              </div>
            </div>
            <div className="featured-right">
              <div className="featured-detail">
                <p>
                  After my father passed, we found hundreds of loose photographs...
                </p>
                <p>
                  Within three months, our entire family had uploaded 340
                  photographs...
                </p>
                <p>
                  The memory book we exported for my father&apos;s first death
                  anniversary...
                </p>
                <div style={{ marginTop: "1rem" }}>
                  <span className="detail-tag">Partition memories</span>
                  <span className="detail-tag">4 generations</span>
                  <span className="detail-tag">340 photos archived</span>
                  <span className="detail-tag">Family collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Masonry section with all 30 stories */}
        <section className="masonry-section">
          <div className="section-header reveal">
            <div className="section-label">30 Real Stories</div>
            <h2>Voices from Families Across India</h2>
            <p>
              Every story below is from a real family that chose to preserve their
              heritage with Enduring Roots.
            </p>
          </div>

          <div className="masonry" ref={masonryRef}>
            {stories.map((story) => (
              <div
                key={story.id}
                className={`masonry-item ${story.className}`}
                data-tag={story.tag}
              >
                <span className="card-tag">{getTagLabel(story.tag)}</span>
                <span className="quote-mark">&quot;</span>
                <p className="card-quote">{story.quote}</p>
                <div className="card-stars">★★★★★</div>
                <div className="card-footer">
                  <div className="avatar">{story.avatar}</div>
                  <div className="card-author">
                    <h5>{story.author}</h5>
                    <p>{story.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="cta-band reveal">
          <h2>
            Your Family Has a Story<em>Worth Telling Forever</em>
          </h2>
          <p>
            Join families across India who are preserving their heritage, connecting
            generations, and building a legacy that will endure.
          </p>
          <Link href="/dashboard" className="btn-gold">
            Start Preserving Free →
          </Link>
          <Link href="/about" className="btn-ghost">
            Learn About Us
          </Link>
        </section>

        <Footer />
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

export default SuccessStoriesPage;