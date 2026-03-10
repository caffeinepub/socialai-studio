import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Facebook,
  Globe,
  Hash,
  Instagram,
  Loader2,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreatePost,
  useSchedulePost,
  useUpdatePostCaption,
  useUpdatePostHashtags,
  useUpdatePostStatus,
} from "../hooks/useQueries";
import {
  SCHEDULE_SLOTS,
  generateCaptions,
  generateHashtags,
  generateOptimizedCaption,
} from "../lib/dummyData";

const STEPS = [
  "Idea Input",
  "Caption Options",
  "Creative Preview",
  "Approval",
  "Optimize & Hashtags",
  "Schedule",
];

const ASPECT_RATIOS = [
  {
    label: "1:1 Square",
    ratio: "1/1",
    gradient: "from-primary/40 via-primary/20 to-chart-1/30",
    platform: "Feed",
    w: "w-full",
    aspect: "aspect-square",
  },
  {
    label: "4:5 Portrait",
    ratio: "4/5",
    gradient: "from-chart-4/40 via-chart-4/20 to-primary/30",
    platform: "Portrait",
    w: "w-4/5",
    aspect: "aspect-[4/5]",
  },
  {
    label: "9:16 Story",
    ratio: "9/16",
    gradient: "from-accent/40 via-accent/20 to-chart-3/30",
    platform: "Story/Reel",
    w: "w-1/2",
    aspect: "aspect-[9/16]",
  },
];

const pageVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function NewPost({
  onNavigate,
}: { onNavigate: (page: string) => void }) {
  const [step, setStep] = useState(0);
  const [idea, setIdea] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCaptionIdx, setSelectedCaptionIdx] = useState(0);
  const [selectedCreativeIdx, setSelectedCreativeIdx] = useState(0);
  const [editCaption, setEditCaption] = useState("");
  const [activeHashtags, setActiveHashtags] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(0);
  const [customDate, setCustomDate] = useState("");
  const [postId, setPostId] = useState<bigint | null>(null);

  const createPost = useCreatePost();
  const updateCaption = useUpdatePostCaption();
  const updateHashtags = useUpdatePostHashtags();
  const schedulePost = useSchedulePost();
  const updateStatus = useUpdatePostStatus();

  const captions = generateCaptions(idea);
  const hashtags = generateHashtags(idea);
  const allHashtags = [
    ...hashtags.trending,
    ...hashtags.niche,
    ...hashtags.brand,
  ];

  const getToggled = () =>
    allHashtags.filter((h) => activeHashtags[h] !== false);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      toast.error("Please enter an idea first");
      return;
    }
    setIsGenerating(true);
    try {
      const post = await createPost.mutateAsync({ idea, platform });
      setPostId(post.id);
      const init: Record<string, boolean> = {};
      for (const h of allHashtags) {
        init[h] = true;
      }
      setActiveHashtags(init);
      setEditCaption(captions[selectedCaptionIdx].text);
    } catch {
      toast.error("Failed to create post. Using dummy mode.");
    } finally {
      setIsGenerating(false);
      setStep(1);
    }
  };

  const handleApprove = async () => {
    if (postId) {
      try {
        await updateCaption.mutateAsync({ id: postId, caption: editCaption });
        await updateStatus.mutateAsync({ id: postId, status: "approved" });
      } catch {
        /* continue */
      }
    }
    const init: Record<string, boolean> = {};
    for (const h of allHashtags) {
      init[h] = true;
    }
    setActiveHashtags(init);
    setStep(4);
  };

  const handleReject = () => {
    toast("Post rejected. Returning to caption selection.");
    setStep(1);
  };

  const handleSchedule = async () => {
    const slot = customDate || SCHEDULE_SLOTS[selectedSlotIdx].value;
    if (postId) {
      try {
        const toggled = getToggled();
        await updateHashtags.mutateAsync({ id: postId, hashtags: toggled });
        await schedulePost.mutateAsync({ id: postId, scheduledAt: slot });
        await updateStatus.mutateAsync({ id: postId, status: "scheduled" });
      } catch {
        /* continue */
      }
    }
    toast.success("Post scheduled successfully! 🎉");
    onNavigate("posts");
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground mb-1">
          New Post Workflow
        </h1>
        <p className="text-muted-foreground text-sm">
          AI-powered content creation in 6 steps
        </p>
      </div>

      {/* Step Indicator */}
      <div
        className="flex items-center gap-0 mb-8 overflow-x-auto pb-2"
        data-ocid="new_post.steps.panel"
      >
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center shrink-0">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                i === step
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : i < step
                    ? "text-accent"
                    : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  i === step
                    ? "bg-primary text-primary-foreground"
                    : i < step
                      ? "bg-accent/20 text-accent"
                      : "bg-secondary text-muted-foreground",
                )}
              >
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-6 h-px mx-1",
                  i < step ? "bg-accent/50" : "bg-border",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="bg-card rounded-2xl border border-border card-glow p-6 lg:p-8"
        >
          {/* STEP 0: Idea Input */}
          {step === 0 && (
            <div data-ocid="new_post.idea.panel">
              <h2 className="text-xl font-display font-bold text-foreground mb-1">
                What's your idea?
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enter a topic, keyword, or campaign concept
              </p>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    Topic / Keyword
                  </Label>
                  <Input
                    data-ocid="new_post.idea.input"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="e.g. Summer streetwear collection"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    onKeyDown={(e) =>
                      e.key === "Enter" && !isGenerating && handleGenerate()
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    Target Platform
                  </Label>
                  <div className="flex gap-3">
                    {[
                      {
                        value: "Instagram",
                        icon: Instagram,
                        label: "Instagram",
                      },
                      { value: "Facebook", icon: Facebook, label: "Facebook" },
                      { value: "Both", icon: Globe, label: "Both" },
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        type="button"
                        key={value}
                        data-ocid={`new_post.platform_${value.toLowerCase()}.toggle`}
                        onClick={() => setPlatform(value)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all",
                          platform === value
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border bg-secondary text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  data-ocid="new_post.generate.primary_button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !idea.trim()}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" /> Generate Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 1: Caption Options */}
          {step === 1 && (
            <div data-ocid="new_post.captions.panel">
              <h2 className="text-xl font-display font-bold text-foreground mb-1">
                Choose Your Caption
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                3 AI-generated options for{" "}
                <strong className="text-foreground">"{idea}"</strong>
              </p>
              <div className="space-y-3 mb-6">
                {captions.map((cap, i) => (
                  <button
                    type="button"
                    key={cap.type}
                    data-ocid={`new_post.caption.item.${i + 1}`}
                    onClick={() => {
                      setSelectedCaptionIdx(i);
                      setEditCaption(cap.text);
                    }}
                    className={cn(
                      "w-full text-left rounded-xl border p-4 transition-all duration-200",
                      selectedCaptionIdx === i
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary hover:border-border/80",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{cap.emoji}</span>
                      <span className="font-semibold text-foreground text-sm">
                        {cap.type}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
                        {cap.description}
                      </span>
                      {selectedCaptionIdx === i && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {cap.text}
                    </p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  data-ocid="new_post.captions.cancel_button"
                  variant="outline"
                  onClick={goBack}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  data-ocid="new_post.captions.primary_button"
                  onClick={goNext}
                  className="flex-1 gap-2 bg-primary text-primary-foreground"
                >
                  Use This Caption <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Creative Preview */}
          {step === 2 && (
            <div data-ocid="new_post.creative.panel">
              <h2 className="text-xl font-display font-bold text-foreground mb-1">
                Choose Your Creative
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Select an aspect ratio for your post
              </p>
              <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {ASPECT_RATIOS.map((ar, i) => (
                  <button
                    type="button"
                    key={ar.label}
                    data-ocid={`new_post.creative.item.${i + 1}`}
                    onClick={() => setSelectedCreativeIdx(i)}
                    className={cn(
                      "shrink-0 rounded-xl border-2 p-3 transition-all duration-200 flex flex-col items-center gap-2",
                      selectedCreativeIdx === i
                        ? "border-primary"
                        : "border-border hover:border-border/80",
                    )}
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-lg bg-gradient-to-br",
                        ar.gradient,
                        ar.w,
                        ar.aspect,
                        "min-w-[80px] max-w-[120px]",
                      )}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/40 text-xs font-mono">
                          {ar.ratio}
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-black/30 rounded-md p-1.5 backdrop-blur-sm">
                        <div className="h-1.5 w-full bg-white/30 rounded-full mb-1" />
                        <div className="h-1 w-3/4 bg-white/20 rounded-full" />
                      </div>
                      {selectedCreativeIdx === i && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-foreground">
                      {ar.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ar.platform}
                    </p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  data-ocid="new_post.creative.cancel_button"
                  variant="outline"
                  onClick={goBack}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  data-ocid="new_post.creative.primary_button"
                  onClick={goNext}
                  className="flex-1 gap-2 bg-primary text-primary-foreground"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Approval */}
          {step === 3 && (
            <div data-ocid="new_post.approval.panel">
              <h2 className="text-xl font-display font-bold text-foreground mb-1">
                Review & Approve
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Edit the caption and approve your post for publishing
              </p>
              <div className="rounded-xl border border-border bg-secondary p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-lg bg-gradient-to-br h-16 w-12 shrink-0",
                      ASPECT_RATIOS[selectedCreativeIdx].gradient,
                    )}
                  />
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {idea}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {platform} · {ASPECT_RATIOS[selectedCreativeIdx].label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {captions[selectedCaptionIdx].type}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <Label className="text-foreground font-medium">Caption</Label>
                <Textarea
                  data-ocid="new_post.approval.textarea"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  rows={5}
                  className="bg-secondary border-border text-foreground resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  data-ocid="new_post.approval.cancel_button"
                  variant="outline"
                  onClick={goBack}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  data-ocid="new_post.approval.delete_button"
                  variant="destructive"
                  onClick={handleReject}
                  className="gap-2"
                >
                  Reject
                </Button>
                <Button
                  data-ocid="new_post.approval.confirm_button"
                  onClick={handleApprove}
                  disabled={updateCaption.isPending || updateStatus.isPending}
                  className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {updateCaption.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve Post
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Optimize & Hashtags */}
          {step === 4 && (
            <div data-ocid="new_post.hashtags.panel">
              <h2 className="text-xl font-display font-bold text-foreground mb-1">
                Optimize & Hashtags
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                AI-optimized caption with trending hashtags
              </p>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Optimized Caption
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {generateOptimizedCaption(editCaption, idea)}
                </p>
              </div>
              <div className="space-y-4 mb-6">
                {(
                  [
                    {
                      label: "Trending",
                      tags: hashtags.trending,
                      color: "text-chart-3",
                      bg: "bg-chart-3/10 border-chart-3/20",
                    },
                    {
                      label: "Niche",
                      tags: hashtags.niche,
                      color: "text-primary",
                      bg: "bg-primary/10 border-primary/20",
                    },
                    {
                      label: "Brand",
                      tags: hashtags.brand,
                      color: "text-chart-4",
                      bg: "bg-chart-4/10 border-chart-4/20",
                    },
                  ] as const
                ).map((group) => (
                  <div key={group.label}>
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">
                        {group.label} Hashtags
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag, ti) => (
                        <button
                          type="button"
                          key={tag}
                          data-ocid={`new_post.hashtag_${group.label.toLowerCase()}.toggle.${ti + 1}`}
                          onClick={() =>
                            setActiveHashtags((prev) => ({
                              ...prev,
                              [tag]: prev[tag] === false,
                            }))
                          }
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                            activeHashtags[tag] !== false
                              ? `${group.bg} ${group.color}`
                              : "bg-muted/50 text-muted-foreground border-border line-through",
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  data-ocid="new_post.hashtags.cancel_button"
                  variant="outline"
                  onClick={goBack}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  data-ocid="new_post.hashtags.primary_button"
                  onClick={goNext}
                  className="flex-1 gap-2 bg-primary text-primary-foreground"
                >
                  Continue to Schedule <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: Schedule */}
          {step === 5 && (
            <div data-ocid="new_post.schedule.panel">
              <h2 className="text-xl font-display font-bold text-foreground mb-1">
                Schedule Your Post
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                AI-suggested optimal posting times based on audience activity
              </p>
              <div className="space-y-3 mb-6">
                {SCHEDULE_SLOTS.map((slot, i) => (
                  <button
                    type="button"
                    key={slot.value}
                    data-ocid={`new_post.schedule.item.${i + 1}`}
                    onClick={() => {
                      setSelectedSlotIdx(i);
                      setCustomDate("");
                    }}
                    className={cn(
                      "w-full text-left rounded-xl border p-4 transition-all duration-200 flex items-center gap-4",
                      selectedSlotIdx === i && !customDate
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary hover:border-border/80",
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {slot.label}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent font-medium">
                          {slot.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {slot.sublabel}
                      </p>
                    </div>
                    {selectedSlotIdx === i && !customDate && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="space-y-2 mb-6">
                <Label className="text-foreground font-medium text-sm">
                  Or pick a custom time
                </Label>
                <Input
                  data-ocid="new_post.schedule.input"
                  type="datetime-local"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="bg-secondary border-border text-foreground"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  data-ocid="new_post.schedule.cancel_button"
                  variant="outline"
                  onClick={goBack}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  data-ocid="new_post.schedule.primary_button"
                  onClick={handleSchedule}
                  disabled={schedulePost.isPending}
                  className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-5 text-base font-semibold"
                >
                  {schedulePost.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Scheduling...
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-4 h-4" /> Schedule Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
