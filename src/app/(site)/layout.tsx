import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { StructuredData } from "@/components/StructuredData";
import { ThemeLab } from "@/components/ThemeLab";
import { ChatWidget } from "@/components/ChatWidget";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <StructuredData />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileActionBar />
        <ChatWidget />
      </div>
      <ThemeLab />
    </LanguageProvider>
  );
}
