import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Buildora - ابني صفحتك الاحترافية بسهولة",
    template: "%s | Buildora"
  },
  description: "منصة بناء صفحات الويب الأسهل في المنطقة العربية. اصمم صفحتك احترافية في دقائق بدون أي برمجة. اسحب وأفلت العناصر ونشر مباشرة.",
  keywords: ["بناء مواقع", "صفحة ويب", "تصميم", "بدون برمجة", "page builder", "buildora", "مواقع مجانية", "صفحات هبوط", "متجر إلكتروني", "_buildora"],
  authors: [{ name: "Buildora" }],
  creator: "Buildora",
  publisher: "Buildora",
  metadataBase: new URL("https://buildora.vexonet.online"),
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://buildora.vexonet.online",
    siteName: "Buildora",
    title: "Buildora - ابني صفحتك الاحترافية بسهولة",
    description: "منصة بناء صفحات الويب الأسهل. صمم صفحتك احترافية في دقائق بدون برمجة.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Buildora" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buildora - ابني صفحتك الاحترافية بسهولة",
    description: "منصة بناء صفحات الويب الأسهل. صمم صفحتك احترافية في دقائق.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: { canonical: "https://buildora.vexonet.online" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Cairo', sans-serif" }}>{children}</body>
    </html>
  );
}
