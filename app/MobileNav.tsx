"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Clock, Users, HelpCircle } from "lucide-react";

const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Profile", path: "/profile", icon: User },
    { name: "Timeline", path: "/dashboard", icon: Clock },
    { name: "Family", path: "/family", icon: Users },
    { name: "Help", path: "/help", icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    // Exact match for profile, help, family; timeline points to dashboard
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === path;
  };

  return (
    <div className="mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around items-center px-2 py-3 shadow-lg">
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.name}
            href={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              active
                ? "text-brand-600 bg-brand-50"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileNav;