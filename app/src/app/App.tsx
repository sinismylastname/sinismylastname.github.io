import { useHashPage } from "../hooks/useHashPage";
import { AppShell } from "../components/AppShell";
import { HomePage } from "../pages/HomePage";
import { PortfolioPage } from "../pages/PortfolioPage";
import { AboutPage } from "../pages/AboutPage";
import { ResumePage } from "../pages/ResumePage";
import { ContactPage } from "../pages/ContactPage";
import { BlogPage } from "../pages/BlogPage";

export function App() {
  const { page, navigate } = useHashPage();

  return (
    <AppShell activePage={page} onNavigate={navigate}>
      {page === "home" && <HomePage onNavigate={navigate} />}
      {page === "notes" && <BlogPage />}
      {page === "work" && <PortfolioPage />}
      {page === "about" && <AboutPage onNavigate={navigate} />}
      {page === "resume" && <ResumePage />}
      {page === "contact" && <ContactPage />}
    </AppShell>
  );
}
