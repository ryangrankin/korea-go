
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard", icon: "🏠", label: "Home" },
    { href: "/friends", icon: "👥", label: "Friends" },
    { href: "/games", icon: "🎮", label: "Mini Games" },
  ];

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`bottom-nav-item ${
            pathname === tab.href ? "active" : ""
          }`}
        >
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
