import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Facebook, Globe, Instagram, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Post } from "../backend.d";
import { useDeletePost, useGetPosts } from "../hooks/useQueries";
import { DUMMY_POSTS } from "../lib/dummyData";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-border",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-chart-3/15 text-chart-3 border-chart-3/20",
  },
  published: {
    label: "Published",
    className: "bg-accent/15 text-accent border-accent/20",
  },
  approved: {
    label: "Approved",
    className: "bg-primary/15 text-primary border-primary/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/15 text-destructive border-destructive/20",
  },
};

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === "Instagram") return <Instagram className="w-3.5 h-3.5" />;
  if (platform === "Facebook") return <Facebook className="w-3.5 h-3.5" />;
  return <Globe className="w-3.5 h-3.5" />;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Posts({
  onNavigate,
}: { onNavigate: (page: string) => void }) {
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const { data: postsData, isLoading } = useGetPosts();
  const deletePost = useDeletePost();

  const allPosts: Post[] = (
    postsData && postsData.length > 0 ? postsData : DUMMY_POSTS
  ) as Post[];
  const filtered =
    filter === "all" ? allPosts : allPosts.filter((p) => p.status === filter);

  const handleDelete = async (id: bigint) => {
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
    setDeletingId(null);
  };

  const tabs = [
    { value: "all", label: "All", count: allPosts.length },
    {
      value: "draft",
      label: "Draft",
      count: allPosts.filter((p) => p.status === "draft").length,
    },
    {
      value: "scheduled",
      label: "Scheduled",
      count: allPosts.filter((p) => p.status === "scheduled").length,
    },
    {
      value: "published",
      label: "Published",
      count: allPosts.filter((p) => p.status === "published").length,
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
            All Posts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {allPosts.length} posts total
          </p>
        </div>
        <Button
          data-ocid="posts.new_post.primary_button"
          onClick={() => onNavigate("new-post")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </motion.div>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onValueChange={setFilter}
        className="mb-6"
        data-ocid="posts.filter.tab"
      >
        <TabsList className="bg-card border border-border">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              data-ocid={`posts.filter_${t.value}.tab`}
              className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
            >
              {t.label}
              <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full text-muted-foreground">
                {t.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Posts List */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-card rounded-2xl border border-border card-glow overflow-hidden"
      >
        {isLoading ? (
          <div className="p-8 text-center" data-ocid="posts.list.loading_state">
            <div className="text-muted-foreground text-sm">
              Loading posts...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center" data-ocid="posts.list.empty_state">
            <div className="text-muted-foreground text-sm mb-3">
              No posts in this category.
            </div>
            <Button
              data-ocid="posts.empty.primary_button"
              size="sm"
              onClick={() => onNavigate("new-post")}
              className="bg-primary text-primary-foreground"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Create Post
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Header Row */}
            <div className="hidden lg:grid grid-cols-[1fr_120px_120px_140px_100px] gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <span>Post Idea</span>
              <span>Platform</span>
              <span>Status</span>
              <span>Scheduled</span>
              <span>Actions</span>
            </div>

            {filtered.map((post, idx) => {
              const s = statusConfig[post.status] ?? statusConfig.draft;
              return (
                <motion.div
                  key={post.id.toString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  data-ocid={`posts.list.item.${idx + 1}`}
                  className="grid grid-cols-1 lg:grid-cols-[1fr_120px_120px_140px_100px] gap-2 lg:gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors items-center"
                >
                  {/* Idea */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <PlatformIcon platform={post.platform} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.idea}
                      </p>
                      {post.selectedCaption && (
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {post.selectedCaption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Platform */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <PlatformIcon platform={post.platform} />
                    {post.platform}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.className}`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {/* Scheduled */}
                  <div className="text-xs text-muted-foreground">
                    {formatDate(post.scheduledAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      data-ocid={`posts.view.button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          data-ocid={`posts.delete_button.${idx + 1}`}
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeletingId(post.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        className="bg-card border-border"
                        data-ocid="posts.delete.dialog"
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-foreground font-display">
                            Delete Post?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            This will permanently delete{" "}
                            <strong className="text-foreground">
                              "{post.idea}"
                            </strong>
                            . This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            data-ocid="posts.delete.cancel_button"
                            className="border-border"
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            data-ocid="posts.delete.confirm_button"
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() =>
                              deletingId && handleDelete(deletingId)
                            }
                          >
                            Delete Post
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
