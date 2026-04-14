import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://www.mentormeritsacademy.in"),
  title: {
    default: "Mentor Merits Academy | Best UPSC & TNPSC Coaching in India",
    template: "%s | Mentor Merits Academy",
  },
  description:
    "Mentor Merits Academy is India's premier institute for UPSC and TNPSC preparation. Achieve your civil service dreams with expert mentorship, comprehensive study materials, and a proven track record of excellence.",
  keywords: [
    "UPSC Coaching India",
    "TNPSC Coaching",
    "Best IAS Academy",
    "Civil Services Preparation",
    "Online UPSC Mentorship",
    "IAS Exam Training",
    "Mentor Merits Academy",
  ],
  authors: [{ name: "Mentor Merits Academy" }],
  creator: "Mentor Merits Academy",
  publisher: "Mentor Merits Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.mentormeritsacademy.in",
    title: "Mentor Merits Academy | Lead Your Success in Civil Services",
    description:
      "Expert UPSC & TNPSC coaching with personalized mentorship. Join the academy that turns aspirants into achievers.",
    siteName: "Mentor Merits Academy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mentor Merits Academy Entrance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentor Merits Academy | Best UPSC Coaching",
    description:
      "Transform your IAS/UPSC preparation with expert guidance from Mentor Merits Academy.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Mentor Merits Academy",
    "url": "https://www.mentormeritsacademy.in",
    "logo": "https://www.mentormeritsacademy.in/logo.jpg",
    "sameAs": [
      "https://facebook.com/mentormerits",
      "https://twitter.com/mentormerits",
      "https://instagram.com/mentormerits",
      "https://youtube.com/mentormerits"
    ],
    "description": "Premium UPSC and TNPSC coaching institute in India offering expert mentorship and structured courses.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
