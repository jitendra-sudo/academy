import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Mentors Merits Academy | Best UPSC Coaching in India",
  description:
    "Join Mentors Merits Academy, India's premier UPSC coaching institute. Expert mentorship, structured courses, and top success rates in UPSC and TNPSC.",
  keywords:
    "IAS coaching, UPSC coaching, TNPSC coaching, best IAS academy, civil services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
