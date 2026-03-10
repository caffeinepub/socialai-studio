import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "./components/Layout";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import NewPost from "./pages/NewPost";
import Posts from "./pages/Posts";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
});

type Page = "dashboard" | "new-post" | "calendar" | "analytics" | "posts";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const navigate = (page: string) => setCurrentPage(page as Page);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={navigate} />;
      case "new-post":
        return <NewPost onNavigate={navigate} />;
      case "calendar":
        return <Calendar onNavigate={navigate} />;
      case "analytics":
        return <Analytics />;
      case "posts":
        return <Posts onNavigate={navigate} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border bg-background">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
      <Toaster richColors position="bottom-right" />
    </QueryClientProvider>
  );
}
