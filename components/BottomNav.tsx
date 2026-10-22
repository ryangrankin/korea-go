"use client";

/*
  BottomNav: the app's main navigation.
  - Phones: a tab bar fixed to the bottom of the screen.
  - Tablets: the same bar, floating under the centered page.
  - Laptops (900px and wider): a sidebar on the left with the logo.
  The layout changes with CSS only (see "MAIN NAVIGATION" in globals.css).
*/

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/friends", icon: "👥", label: "Friends" },
  { href: "/games", icon: "🎮", label: "Mini Games" },
  { href: "/my-pup", icon: "🐶", label: "My Pup" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // A tab stays active on its inner pages too (e.g. /games/hangeul-match).
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {/* Logo: only shown in the laptop sidebar */}
      <Link href="/dashboard" className="bottom-nav-brand">
        <Image src="/brand/wordmark.png" alt="korea GO! home" width={319} height={277} />
      </Link>

      <ul className="bottom-nav-list">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              className={`bottom-nav-item ${isActive(tab.href) ? "active" : ""}`}
              aria-current={isActive(tab.href) ? "page" : undefined}
            >
              <span className="bottom-nav-icon" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="bottom-nav-label">{tab.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
