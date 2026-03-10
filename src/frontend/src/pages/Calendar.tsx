import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Globe,
  Instagram,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Post } from "../backend.d";
import { useGetPosts } from "../hooks/useQueries";
import { DUMMY_POSTS } from "../lib/dummyData";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const platformColors: Record<string, string> = {
  Instagram: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  Facebook: "bg-primary/20 text-primary border-primary/30",
  Both: "bg-accent/20 text-accent border-accent/30",
};

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === "Instagram") return <Instagram className="w-2.5 h-2.5" />;
  if (platform === "Facebook") return <Facebook className="w-2.5 h-2.5" />;
  return <Globe className="w-2.5 h-2.5" />;
};

export default function Calendar({
  onNavigate,
}: { onNavigate: (page: string) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const { data: postsData } = useGetPosts();
  const posts: Post[] = (
    postsData && postsData.length > 0 ? postsData : DUMMY_POSTS
  ) as Post[];

  const scheduledPosts = posts.filter(
    (p) =>
      p.scheduledAt && (p.status === "scheduled" || p.status === "published"),
  );

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const getPostsForDay = (day: number) => {
    return scheduledPosts.filter((p) => {
      if (!p.scheduledAt) return false;
      const d = new Date(p.scheduledAt);
      return (
        d.getFullYear() === viewYear &&
        d.getMonth() === viewMonth &&
        d.getDate() === day
      );
    });
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  // Build cells: nulls for empty prefix + day numbers
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null as null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              Content Calendar
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Plan and visualize your posting schedule
            </p>
          </div>
          <Button
            data-ocid="calendar.new_post.primary_button"
            onClick={() => onNavigate("new-post")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            Schedule Post
          </Button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold text-foreground">
            {MONTHS[viewMonth]} {viewYear}
          </h2>
          <div className="flex gap-2">
            <Button
              data-ocid="calendar.month.pagination_prev"
              variant="outline"
              size="icon"
              onClick={prevMonth}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              data-ocid="calendar.month.pagination_next"
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="border-border"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-card rounded-2xl border border-border card-glow overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS.map((d) => (
              <div
                key={d}
                className="py-3 text-center text-xs font-semibold text-muted-foreground"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              const cellKey =
                day !== null
                  ? `day-${viewYear}-${viewMonth}-${day}`
                  : `empty-${idx}`;
              const dayPosts = day !== null ? getPostsForDay(day) : [];
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();
              return (
                <div
                  key={cellKey}
                  data-ocid={
                    day !== null ? `calendar.day.${day}.cell` : undefined
                  }
                  className={`min-h-[80px] lg:min-h-[100px] p-2 border-r border-b border-border last:border-r-0 ${
                    day === null
                      ? "bg-background/30"
                      : "hover:bg-secondary/30 transition-colors"
                  }`}
                >
                  {day !== null && (
                    <>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1 ${
                          isToday
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayPosts.slice(0, 2).map((post, pi) => (
                          <div
                            key={post.id.toString()}
                            data-ocid={`calendar.post.item.${pi + 1}`}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border ${
                              platformColors[post.platform] ??
                              platformColors.Both
                            } truncate`}
                          >
                            <PlatformIcon platform={post.platform} />
                            <span className="truncate hidden lg:block">
                              {post.idea}
                            </span>
                          </div>
                        ))}
                        {dayPosts.length > 2 && (
                          <div className="text-xs text-muted-foreground pl-1">
                            +{dayPosts.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4">
          {Object.entries(platformColors).map(([platform, cls]) => (
            <div key={platform} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded border ${cls}`} />
              <span className="text-xs text-muted-foreground">{platform}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
