import {
  ArrowUpRight,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Post } from "../backend.d";
import { useGetPosts } from "../hooks/useQueries";
import { DUMMY_POSTS, ENGAGEMENT_DATA } from "../lib/dummyData";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="text-foreground font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { data: postsData } = useGetPosts();
  const posts: Post[] = (
    postsData && postsData.length > 0 ? postsData : DUMMY_POSTS
  ) as Post[];

  const publishedPosts = posts.filter((p) => p.status === "published");

  const totalLikes = publishedPosts.reduce(
    (sum, p) => sum + Number(p.analytics.likes),
    0,
  );
  const totalComments = publishedPosts.reduce(
    (sum, p) => sum + Number(p.analytics.comments),
    0,
  );
  const totalShares = publishedPosts.reduce(
    (sum, p) => sum + Number(p.analytics.shares),
    0,
  );
  const totalReach = publishedPosts.reduce(
    (sum, p) => sum + Number(p.analytics.reach),
    0,
  );

  const topPosts = [...publishedPosts]
    .sort((a, b) => b.analytics.engagementRate - a.analytics.engagementRate)
    .slice(0, 4);

  const stats = [
    {
      label: "Total Reach",
      value: totalReach.toLocaleString(),
      icon: Eye,
      color: "text-primary",
      bg: "bg-primary/15",
      glow: "stat-glow-purple",
    },
    {
      label: "Total Likes",
      value: totalLikes.toLocaleString(),
      icon: Heart,
      color: "text-chart-4",
      bg: "bg-chart-4/15",
      glow: "stat-glow-rose",
    },
    {
      label: "Comments",
      value: totalComments.toLocaleString(),
      icon: MessageCircle,
      color: "text-chart-3",
      bg: "bg-chart-3/15",
      glow: "stat-glow-amber",
    },
    {
      label: "Shares",
      value: totalShares.toLocaleString(),
      icon: Share2,
      color: "text-accent",
      bg: "bg-accent/15",
      glow: "stat-glow-teal",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">
          Analytics
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Performance insights across all published content
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={item}
            data-ocid={`analytics.stat.card.${i + 1}`}
            className={`rounded-xl p-5 bg-card ${stat.glow} cursor-default`}
          >
            <div
              className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-display font-bold text-foreground">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-card rounded-2xl border border-border card-glow p-6 mb-6"
        data-ocid="analytics.chart.panel"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-semibold text-foreground">
              Engagement Over 7 Days
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Likes, comments, and shares breakdown
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-accent">
            <TrendingUp className="w-4 h-4" />
            <span>+22% vs last week</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ENGAGEMENT_DATA} barGap={4} barCategoryGap="30%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0.025 265)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "oklch(0.55 0.04 265)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.55 0.04 265)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "oklch(0.25 0.025 265 / 0.5)" }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                  color: "oklch(0.55 0.04 265)",
                }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="likes"
                name="Likes"
                fill="oklch(0.62 0.2 275)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="comments"
                name="Comments"
                fill="oklch(0.68 0.18 330)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="shares"
                name="Shares"
                fill="oklch(0.72 0.18 170)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card rounded-2xl border border-border card-glow"
        data-ocid="analytics.top_posts.panel"
      >
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-foreground">
            Top Performing Posts
          </h2>
        </div>
        <div className="divide-y divide-border">
          {topPosts.length === 0 ? (
            <div
              className="p-8 text-center text-muted-foreground text-sm"
              data-ocid="analytics.top_posts.empty_state"
            >
              No published posts yet.
            </div>
          ) : (
            topPosts.map((post, idx) => (
              <div
                key={post.id.toString()}
                data-ocid={`analytics.top_posts.item.${idx + 1}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {post.idea}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {post.platform}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {Number(post.analytics.likes).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {Number(post.analytics.comments).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {Number(post.analytics.shares).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-accent text-sm font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {post.analytics.engagementRate.toFixed(1)}%
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
