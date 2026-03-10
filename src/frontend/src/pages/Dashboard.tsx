import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Facebook,
  Globe,
  Instagram,
  Plus,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetDashboardStats, useGetPosts } from "../hooks/useQueries";
import { DUMMY_POSTS } from "../lib/dummyData";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  scheduled: { label: "Scheduled", className: "bg-chart-3/15 text-chart-3" },
  published: { label: "Published", className: "bg-accent/15 text-accent" },
  approved: { label: "Approved", className: "bg-primary/15 text-primary" },
};

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === "Instagram") return <Instagram className="w-3.5 h-3.5" />;
  if (platform === "Facebook") return <Facebook className="w-3.5 h-3.5" />;
  return <Globe className="w-3.5 h-3.5" />;
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function FileStack({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 7h-3a2 2 0 0 1-2-2V2" />
      <path d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z" />
      <path d="M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15" />
      <path d="M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11" />
    </svg>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: postsData, isLoading: postsLoading } = useGetPosts();

  const posts = (
    postsData && postsData.length > 0 ? postsData : DUMMY_POSTS
  ).slice(0, 5);

  const displayStats = {
    totalPosts: stats ? Number(stats.totalPosts) : DUMMY_POSTS.length,
    scheduled: stats
      ? Number(stats.scheduled)
      : DUMMY_POSTS.filter((p) => p.status === "scheduled").length,
    published: stats
      ? Number(stats.published)
      : DUMMY_POSTS.filter((p) => p.status === "published").length,
    avgEngagement: stats ? stats.avgEngagement : 10.2,
  };

  const statCards = [
    {
      label: "Total Posts",
      value: displayStats.totalPosts,
      icon: FileStack,
      glow: "stat-glow-purple",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      change: "+12%",
    },
    {
      label: "Scheduled",
      value: displayStats.scheduled,
      icon: CalendarClock,
      glow: "stat-glow-teal",
      iconBg: "bg-accent/15",
      iconColor: "text-accent",
      change: "+5%",
    },
    {
      label: "Published",
      value: displayStats.published,
      icon: CheckCircle2,
      glow: "stat-glow-amber",
      iconBg: "bg-chart-3/15",
      iconColor: "text-chart-3",
      change: "+18%",
    },
    {
      label: "Avg Engagement",
      value: `${displayStats.avgEngagement.toFixed(1)}%`,
      icon: TrendingUp,
      glow: "stat-glow-rose",
      iconBg: "bg-chart-4/15",
      iconColor: "text-chart-4",
      change: "+2.4%",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
            Good morning, <span className="gradient-text">AÉCLO</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here's your content performance overview
          </p>
        </div>
        <Button
          data-ocid="dashboard.new_post.primary_button"
          onClick={() => onNavigate("new-post")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 hidden sm:flex"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            variants={itemVariant}
            className={`rounded-xl p-4 lg:p-5 bg-card ${card.glow} transition-all duration-300 hover:scale-[1.02] cursor-default`}
            data-ocid={`dashboard.stat.card.${i + 1}`}
          >
            {statsLoading ? (
              <div data-ocid="dashboard.stats.loading_state">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}
                  >
                    <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-accent">
                    <ArrowUpRight className="w-3 h-3" />
                    {card.change}
                  </span>
                </div>
                <div className="text-2xl font-display font-bold text-foreground">
                  {card.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {card.label}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border card-glow"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">
              Recent Posts
            </h2>
            <button
              type="button"
              data-ocid="dashboard.posts.link"
              onClick={() => onNavigate("posts")}
              className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {postsLoading ? (
              <div
                className="p-5 space-y-3"
                data-ocid="dashboard.posts.loading_state"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div
                className="p-10 text-center"
                data-ocid="dashboard.posts.empty_state"
              >
                <div className="text-muted-foreground text-sm">
                  No posts yet. Create your first post!
                </div>
                <Button
                  data-ocid="dashboard.posts_empty.primary_button"
                  onClick={() => onNavigate("new-post")}
                  className="mt-3"
                  size="sm"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Create Post
                </Button>
              </div>
            ) : (
              posts.map((post, idx) => {
                const s = statusConfig[post.status] ?? statusConfig.draft;
                return (
                  <div
                    key={post.id.toString()}
                    data-ocid={`dashboard.posts.item.${idx + 1}`}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <PlatformIcon platform={post.platform} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.idea}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {post.platform}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${s.className}`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card rounded-xl border border-border card-glow flex flex-col"
        >
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">
              Quick Actions
            </h2>
          </div>
          <div className="p-5 flex flex-col gap-3 flex-1">
            <button
              type="button"
              data-ocid="dashboard.quick_create.primary_button"
              onClick={() => onNavigate("new-post")}
              className="w-full rounded-lg p-4 bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    AI Post Workflow
                  </p>
                  <p className="text-xs text-muted-foreground">
                    6-step content creation
                  </p>
                </div>
              </div>
            </button>
            <button
              type="button"
              data-ocid="dashboard.quick_calendar.secondary_button"
              onClick={() => onNavigate("calendar")}
              className="w-full rounded-lg p-4 bg-secondary hover:bg-secondary/80 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                  <CalendarClock className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Content Calendar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Plan your schedule
                  </p>
                </div>
              </div>
            </button>
            <button
              type="button"
              data-ocid="dashboard.quick_analytics.secondary_button"
              onClick={() => onNavigate("analytics")}
              className="w-full rounded-lg p-4 bg-secondary hover:bg-secondary/80 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-chart-3/15 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    View Analytics
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Performance insights
                  </p>
                </div>
              </div>
            </button>
            <div className="mt-auto pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Connected Platforms
              </p>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-chart-4/10 border border-chart-4/20">
                  <Instagram className="w-3 h-3 text-chart-4" />
                  <span className="text-xs text-chart-4 font-medium">
                    Instagram
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                  <Facebook className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Facebook
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
