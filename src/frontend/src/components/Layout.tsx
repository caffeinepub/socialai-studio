import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Bell,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

type Page = "dashboard" | "new-post" | "calendar" | "analytics" | "posts";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: {
  id: Page;
  label: string;
  icon: React.ElementType;
  badge?: string;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "new-post", label: "New Post", icon: PlusCircle, badge: "Create" },
  { id: "calendar", label: "Content Calendar", icon: CalendarDays },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "posts", label: "All Posts", icon: FileText },
];

export default function Layout({
  children,
  currentPage,
  onNavigate,
}: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-sidebar relative overflow-hidden">
        <div className="sidebar-glow absolute inset-0 pointer-events-none" />
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border relative">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm leading-tight text-foreground">
              SocialAI
            </h1>
            <p className="text-xs text-muted-foreground">Studio</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 relative">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                currentPage === item.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && currentPage !== item.id && (
                <Badge
                  variant="outline"
                  className="text-xs py-0 border-primary/30 text-primary"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-border relative space-y-1">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <div className="flex items-center gap-3 px-3 py-2.5 mt-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              AE
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                AÉCLO Brand
              </p>
              <p className="text-xs text-muted-foreground truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-sidebar border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-display font-bold text-sm text-foreground">
            SocialAI Studio
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          data-ocid="nav.mobile_menu.button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-muted-foreground"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div
          role="presentation"
          className="lg:hidden fixed inset-0 z-30 bg-background/90 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
        >
          <nav className="absolute top-14 left-0 right-0 bg-sidebar border-b border-border px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                data-ocid={`nav.mobile.${item.id}.link`}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  currentPage === item.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-14">{children}</main>
    </div>
  );
}
