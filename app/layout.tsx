import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGate from "../components/AuthGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Korea GO! — Korean for travelers",
  description:
    "Learn practical Korean for your trip to Korea: Hangul, greetings, airports, restaurants, and culture, in short lessons.",
};

// viewport-fit=cover lets the bottom nav stay clear of the iPhone home bar.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before the page is drawn, so a learner who turned Background Photos off
// in Settings never sees a photo flash on first. See [data-background-photos] in globals.css.
const backgroundPhotosScript = `try {
  var prefs = JSON.parse(localStorage.getItem("koreaGoPreferences") || "{}");
  document.documentElement.dataset.backgroundPhotos = prefs.backgroundPhotos === false ? "off" : "on";
} catch (e) {}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // the script below adds data-background-photos
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: backgroundPhotosScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthGate />
        {children}
      </body>
    </html>
  );
}
