import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/manrope/600.css";
import { MotionProvider } from "@/components/MotionProvider";
import { GlobalAmbientBackground } from "@/components/GlobalAmbientBackground";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "WellSide Behavioral Health",
  description:
    "Compassionate behavioral health care, wherever you are. Secure virtual appointments with Wulaimot Akindele, MSN, APRN, PMHNP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <GlobalAmbientBackground />
        <AuthProvider>
          <MotionProvider>{children}</MotionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
