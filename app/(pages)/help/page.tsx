"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../context/ThemeContext";
import theme from "../../theme";

// ========== MEDIA QUERY HOOK ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
};

const useIsDark = () => {
  const { theme: themeMode } = useTheme();
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  return themeMode === "dark" ? true : themeMode === "light" ? false : systemDark;
};

// ========== FAQ DATA ==========
const faqs = [
  {
    section: "Getting Started",
    icon: "🌱",
    id: "getting-started",
    items: [
      { q: "What is Enduring Roots?", a: "Enduring Roots is a digital platform designed to help you preserve, organize, and share your most cherished life memories — creating a lasting personal legacy for the people who matter most to you." },
      { q: "Is Enduring Roots free to use?", a: "Yes! Enduring Roots is free for all users. We may introduce premium features in the future for advanced storage and printing options — but the core experience will always remain accessible." },
      { q: "How do I add my first memory?", a: "Simply click the 'Add Memory' button on your dashboard. Enter a title, date, and description — you can also upload a photo and tag the memory with a life stage to keep your timeline beautifully organized." },
      { q: "Do I need an account to use Enduring Roots?", a: "Yes, a free account is required to create and store memories. This ensures your data remains private, secure, and accessible only to you — from any device, at any time." },
      { q: "Can I use Enduring Roots on my phone?", a: "Absolutely! Enduring Roots is fully responsive and works seamlessly on mobile browsers. A dedicated mobile app is also on our roadmap for the near future." },
      { q: "Can I use Enduring Roots to preserve memories for future generations?", a: "Yes — that's exactly what Enduring Roots is built for. You can build a rich, structured timeline of your life that family members can explore, cherish, and add to, creating a living legacy that grows over time." },
      { q: "Is there a limit on how many memories I can create?", a: "There is no hard limit on the number of memories you can create. Storage limits may apply to media uploads depending on your plan in the future, but your written memories are always unlimited." },
    ],
  },
  {
    section: "Privacy & Security",
    icon: "🔒",
    id: "privacy",
    items: [
      { q: "Are my memories private by default?", a: "Absolutely. All memories you create on Enduring Roots are private by default and visible only to you. You can choose to selectively share individual memories — or your entire timeline — with trusted family members or friends." },
      { q: "How is my data stored and protected?", a: "Your written content is encrypted and stored securely. Media files are kept in private, access-controlled storage that requires authentication — so only authorized users can view them at any time." },
      { q: "Who can see my memories?", a: "Only you — unless you explicitly share a memory with someone. Enduring Roots will never make your memories publicly visible or share them with anyone without your permission." },
      { q: "Is my personal information sold to advertisers?", a: "Never. Enduring Roots does not sell, share, or monetize your personal data in any way. Your legacy belongs entirely to you — not to advertisers." },
      { q: "Can I delete my account and all my data?", a: "Yes. You have full control over your data. You can permanently delete your account and all associated memories at any time from the Settings menu. Please note this action is irreversible, so we recommend reviewing your memories beforehand." },
    ],
  },
  {
    section: "Managing Memories",
    icon: "🗂️",
    id: "managing",
    items: [
      { q: "What types of media can I upload?", a: "Enduring Roots currently supports JPG and PNG image files. The maximum file size per upload is 5MB. Support for additional file types may be introduced in future updates." },
      { q: "Can I edit the date of a memory after saving it?", a: "Yes — you can edit any detail of a memory, including the date, at any time. Your timeline will automatically reorder itself to reflect the updated date as soon as you save the change." },
      { q: "Can I delete a memory permanently?", a: "Yes, only the memory owner can permanently delete a memory. Once deleted, it cannot be recovered — so please be certain before you proceed." },
      { q: "Can I organize memories by category or theme?", a: "Yes! When adding or editing a memory, you can tag it with a life stage (e.g., Childhood, Career, Family) to keep your timeline structured and easy to navigate across different chapters of your life." },
      { q: "Can I pin important memories to the top of my timeline?", a: "This feature is currently in development and will allow you to highlight your most treasured memories at the top of your timeline for easy access. We'll notify you as soon as it's available." },
    ],
  },
  {
    section: "Collaboration",
    icon: "🤝",
    id: "collaboration",
    items: [
      { q: "How do I invite someone to view or edit a memory?", a: "When editing a memory, go to the 'Collaborators' section and enter the email address of the person you'd like to invite. You can grant them either View or Edit access depending on your preference." },
      { q: "What is the difference between View and Edit access?", a: "A collaborator with View access can only see the memory. A collaborator with Edit access can update the text and tags — however, only the memory owner retains the ability to delete it permanently." },
      { q: "Can I remove a collaborator after inviting them?", a: "Yes. You can revoke a collaborator's access at any time from the memory's settings panel. Once removed, they will no longer be able to view or edit that memory." },
      { q: "Can a collaborator invite other people to a memory?", a: "No. Only the memory owner can add or remove collaborators. This ensures you always remain in full control of who can access your personal memories at all times." },
      { q: "Can family members contribute their own memories to my timeline?", a: "Collaborators with Edit access can contribute text and tag updates to shared memories. The ability for family members to independently add new memories to a shared timeline is a feature we're developing for a future release." },
      { q: "Will collaborators be notified when I share a memory with them?", a: "Yes. Collaborators receive an email notification when they are invited to view or edit a memory. The email includes a direct link to access the shared memory on Enduring Roots." },
    ],
  },
  {
    section: "Technical & Support",
    icon: "🛠️",
    id: "technical",
    items: [
      { q: "Which browsers does Enduring Roots support?", a: "Enduring Roots works best on the latest versions of Google Chrome, Safari, Firefox, and Microsoft Edge. We recommend keeping your browser updated for the smoothest experience." },
      { q: "What should I do if I forget my password?", a: "Click 'Forgot Password' on the login page and enter your registered email address. You'll receive a password reset link within a few minutes. If it doesn't arrive, please check your spam or junk folder." },
      { q: "I found a bug or something isn't working. How do I report it?", a: "We're sorry to hear that! Please reach out to us at support@enduringroots.in with a description of the issue and, if possible, a screenshot. Our team will look into it and get back to you as quickly as possible." },
      { q: "Will my memories be safe if the app goes down?", a: "Yes. Your data is stored on secure, redundant cloud servers. Any planned maintenance is announced in advance, and downtime is always temporary — your stored memories are never affected." },
      { q: "How do I update my account email or personal details?", a: "You can update your name, email address, and other account details anytime from the Settings menu after logging in. Changes take effect immediately upon saving." },
      { q: "Does Enduring Roots work offline?", a: "Currently, Enduring Roots requires an active internet connection to create, view, and manage memories. Offline access is something we're exploring for a future update." },
    ],
  },
];

const ALL_TAB = "all";

// ========== CHEVRON ICON ==========
const ChevronIcon = ({ open }: { open: boolean }) => {
  const isDark = useIsDark();
  const circleBg = open ? theme.colors.brand[100] : (isDark ? theme.colors.brand[800] : "#F4F1EC");
  const strokeColor = open ? theme.colors.brand[600] : (isDark ? theme.colors.brand[400] : "#999");

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
      }}
    >
      <circle cx="9" cy="9" r="9" fill={circleBg} />
      <path
        d="M5.5 7.5L9 11L12.5 7.5"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ========== FAQ ITEM ==========
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const isDark = useIsDark();

  useEffect(() => {
    if (answerRef.current) {
      setHeight(open ? answerRef.current.scrollHeight : 0);
    }
  }, [open]);

  const borderColor = open ? theme.colors.brand[500] : (isDark ? theme.colors.brand[700] : "#E8E0D5");
  const bgColor = isDark ? theme.dark.bgCard : "#fff";
  const shadowColor = open ? theme.colors.brand[500] + "14" : "none";
  const questionColor = open ? theme.colors.brand[600] : (isDark ? theme.dark.text : "#1C1C1C");
  const answerColor = isDark ? theme.dark.textMuted : "#5A5A5A";
  const answerBorderColor = isDark ? theme.dark.border : "#E8E0D5";
  const strongColor = isDark ? theme.dark.text : "#1C1C1C";

  return (
    <div
      style={{
        border: `1.5px solid ${borderColor}`,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing(2),
        background: bgColor,
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: open ? `0 2px 16px ${shadowColor}` : "none",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.spacing(4),
          padding: `${theme.spacing(3.75)} ${theme.spacing(5)}`,
          cursor: "pointer",
          textAlign: "left",
          fontFamily: theme.fontFamily.sans,
          fontSize: theme.fontSize.sm,
          fontWeight: 500,
          color: questionColor,
          lineHeight: 1.45,
          transition: "color 0.15s",
        }}
      >
        <span>{q}</span>
        <ChevronIcon open={open} />
      </button>

      <div
        style={{
          maxHeight: height,
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          ref={answerRef}
          style={{
            padding: `${theme.spacing(3.5)} ${theme.spacing(5)} ${theme.spacing(4.5)}`,
            borderTop: `1px solid ${answerBorderColor}`,
            fontFamily: theme.fontFamily.sans,
            fontSize: theme.fontSize.sm,
            color: answerColor,
            lineHeight: 1.78,
            fontWeight: 300,
          }}
          dangerouslySetInnerHTML={{
            __html: a.replace(
              /'([^']+)'/g,
              `<strong style='color:${strongColor};font-weight:500'>$1</strong>`
            ),
          }}
        />
      </div>
    </div>
  );
};

// ========== FAQ SECTION ==========
const FAQSection = ({ section, icon, id, items, visible }: any) => {
  const isDark = useIsDark();
  if (!visible) return null;

  const iconBg = isDark ? theme.colors.brand[800] : "#EAF0EA";
  const titleColor = isDark ? theme.dark.text : "#1C1C1C";

  return (
    <div style={{ marginBottom: theme.spacing(2) }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing(2.5),
          padding: `${theme.spacing(5.5)} 0 ${theme.spacing(2.5)}`,
        }}
      >
        <div
          style={{
            width: theme.spacing(8.5),
            height: theme.spacing(8.5),
            borderRadius: theme.borderRadius.lg,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: theme.fontSize.lg,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <h2
          style={{
            fontFamily: theme.fontFamily.serif,
            fontSize: theme.fontSize.xl,
            fontWeight: 600,
            color: titleColor,
            margin: 0,
          }}
        >
          {section}
        </h2>
      </div>
      {items.map((item: any, i: number) => (
        <FAQItem key={i} q={item.q} a={item.a} />
      ))}
    </div>
  );
};

// ========== MAIN COMPONENT ==========
export default function EnduringRootsFAQ() {
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [search, setSearch] = useState("");
  const isDark = useIsDark();

  const tabs = [
    { label: "All", id: ALL_TAB },
    { label: "Getting Started", id: "getting-started" },
    { label: "Privacy & Security", id: "privacy" },
    { label: "Managing Memories", id: "managing" },
    { label: "Collaboration", id: "collaboration" },
    { label: "Technical & Support", id: "technical" },
  ];

  const filteredFaqs = faqs
    .map((section) => {
      const sectionVisible = activeTab === ALL_TAB || activeTab === section.id;
      if (!sectionVisible) return null;

      const items = search.trim()
        ? section.items.filter(
            (item) =>
              item.q.toLowerCase().includes(search.toLowerCase()) ||
              item.a.toLowerCase().includes(search.toLowerCase())
          )
        : section.items;

      if (items.length === 0) return null;
      return { ...section, items };
    })
    .filter(Boolean);

  const noResults = filteredFaqs.length === 0;

  // Theme-based colors
  const pageBg = isDark ? theme.dark.bg : "#FDFAF6";
  const heroBg = theme.colors.brand[600];
  const heroText = theme.colors.white;
  const heroSubtext = isDark ? theme.colors.brand[200] : "rgba(255,255,255,0.75)";
  const searchBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.18)";
  const searchText = theme.colors.white;
  const searchPlaceholder = "rgba(255,255,255,0.6)";
  const tabBorder = isDark ? theme.colors.brand[700] : "#E8E0D5";
  const tabActiveBg = theme.colors.brand[600];
  const tabActiveColor = theme.colors.white;
  const tabInactiveBg = isDark ? theme.dark.bgCard : "#fff";
  const tabInactiveColor = isDark ? theme.dark.textMuted : "#5A5A5A";
  const noResultsColor = isDark ? theme.dark.textMuted : "#999";
  const footerBg = isDark ? theme.colors.brand[800] : "#EAF0EA";
  const footerText = isDark ? theme.dark.textMuted : "#5A5A5A";
  const footerLinkColor = theme.colors.brand[500];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          minHeight: "100vh",
          background: pageBg,
          fontFamily: theme.fontFamily.sans,
          paddingBottom: theme.spacing(16),
          transition: `background-color 300ms ${theme.transition.DEFAULT}`,
        }}
      >
        {/* HERO */}
        <div
          style={{
            background: heroBg,
            padding: `${theme.spacing(13)} ${theme.spacing(8)} ${theme.spacing(11)}`,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 60% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <p
            style={{
              fontFamily: theme.fontFamily.sans,
              fontWeight: 300,
              fontSize: theme.fontSize.xs,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              marginBottom: theme.spacing(3.5),
            }}
          >
            Help Center
          </p>
          <h1
            style={{
              fontFamily: theme.fontFamily.serif,
              fontSize: "clamp(24px, 4vw, 38px)",
              fontWeight: 600,
              color: heroText,
              lineHeight: 1.2,
              marginBottom: theme.spacing(3.5),
            }}
          >
            How Can We Help You?
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.sm,
              fontWeight: 300,
              color: heroSubtext,
              maxWidth: 500,
              margin: `0 auto ${theme.spacing(7)}`,
              lineHeight: 1.7,
            }}
          >
            Find answers to common questions about managing your legacy, privacy
            settings, and key features of Enduring Roots.
          </p>

          {/* Search */}
          <div
            style={{
              maxWidth: 420,
              margin: "0 auto",
              position: "relative",
            }}
          >
            <input
              type="text"
              placeholder="Search a question..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveTab(ALL_TAB);
              }}
              style={{
                width: "100%",
                padding: `${theme.spacing(3.25)} ${theme.spacing(11)} ${theme.spacing(3.25)} ${theme.spacing(4.5)}`,
                borderRadius: theme.borderRadius.full,
                border: "none",
                fontFamily: theme.fontFamily.sans,
                fontSize: theme.fontSize.sm,
                background: searchBg,
                color: searchText,
                outline: "none",
                backdropFilter: "blur(4px)",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: theme.spacing(4),
                top: "50%",
                transform: "translateY(-50%)",
                color: searchPlaceholder,
                fontSize: theme.fontSize.lg,
                pointerEvents: "none",
              }}
            >
              ⌕
            </span>
          </div>
        </div>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: theme.spacing(2),
            justifyContent: "center",
            flexWrap: "wrap",
            padding: `${theme.spacing(6)} ${theme.spacing(5)} ${theme.spacing(2)}`,
            maxWidth: 780,
            margin: "0 auto",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearch("");
              }}
              style={{
                padding: `${theme.spacing(2)} ${theme.spacing(4.5)}`,
                borderRadius: theme.borderRadius.full,
                border: `1.5px solid ${activeTab === tab.id ? theme.colors.brand[500] : tabBorder}`,
                background: activeTab === tab.id ? tabActiveBg : tabInactiveBg,
                fontFamily: theme.fontFamily.sans,
                fontSize: theme.fontSize.xs,
                fontWeight: 500,
                color: activeTab === tab.id ? tabActiveColor : tabInactiveColor,
                cursor: "pointer",
                letterSpacing: "0.3px",
                transition: "all 0.18s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div
          style={{
            maxWidth: 740,
            margin: "0 auto",
            padding: `${theme.spacing(2)} ${theme.spacing(5)} 0`,
          }}
        >
          {noResults ? (
            <div
              style={{
                textAlign: "center",
                padding: `${theme.spacing(14)} ${theme.spacing(6)}`,
                color: noResultsColor,
              }}
            >
              <div style={{ fontSize: theme.fontSize["4xl"], marginBottom: theme.spacing(3.5) }}>🌿</div>
              <p
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: noResultsColor,
                }}
              >
                No matching questions found.
                <br />
                Try a different search term or browse a category above.
              </p>
            </div>
          ) : (
            filteredFaqs.map((section: any) => (
              <FAQSection key={section.id} {...section} visible={true} />
            ))
          )}
        </div>

        {/* FOOTER NOTE */}
        {!noResults && (
          <div
            style={{
              maxWidth: 740,
              margin: `${theme.spacing(7)} auto 0`,
              padding: `${theme.spacing(5.5)} ${theme.spacing(7)}`,
              background: footerBg,
              borderRadius: theme.borderRadius.xl,
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              width: "calc(100% - 40px)",
            }}
          >
            <p
              style={{
                fontSize: theme.fontSize.sm,
                color: footerText,
                fontWeight: 300,
                lineHeight: 1.7,
                margin: 0,
                fontFamily: theme.fontFamily.sans,
              }}
            >
              Still have questions? Reach us at{" "}
              <a
                href="mailto:support@enduringroots.in"
                style={{ color: footerLinkColor, fontWeight: 500, textDecoration: "none" }}
              >
                support@enduringroots.in
              </a>{" "}
              — we're always happy to help you preserve what matters most. 🌿
            </p>
          </div>
        )}
      </div>
    </>
  );
}