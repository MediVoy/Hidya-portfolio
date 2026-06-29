import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Stethoscope, User } from "lucide-react";
import { getBlogs, normalizeDriveImageUrl, type BlogPost } from "@/lib/api";

export const Route = createFileRoute("/blog")({
  component: BlogLayout,
});

function BlogLayout() {
  const matchRoute = useMatchRoute();
  const isDetail = matchRoute({ to: "/blog/$slug" });

  if (isDetail) {
    return <Outlet />;
  }

  return <BlogIndexPage />;
}

function formatDate(val?: string) {
  if (!val) return "";
  try {
    return new Date(val).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return val;
  }
}

function BlogCardImage({ src }: { src: string }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <Stethoscope className="absolute bottom-6 right-6 h-16 w-16 text-[var(--gold)]/30 group-hover:text-[var(--gold)]/60 group-hover:rotate-12 transition-all duration-500" />
    );
  }

  return (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setBroken(true)}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

function BlogIndexSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-12">
      <div className="h-10 w-64 rounded-xl bg-white/10 mb-12 animate-pulse" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-3xl glass overflow-hidden animate-pulse">
            <div className="h-48 bg-white/10" />
            <div className="p-6 space-y-3">
              <div className="h-4 w-1/2 rounded bg-white/10" />
              <div className="h-6 w-3/4 rounded bg-white/10" />
              <div className="h-4 w-full rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogEmptyState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 h-16 w-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
        <BookOpen className="h-8 w-8 text-[var(--gold)]/50" />
      </div>
      <h1 className="font-display text-3xl mb-3">No articles yet</h1>
      <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
        New patient-friendly writing from Dr. Hidaya will appear here soon.
      </p>
    </div>
  );
}

function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const blogs = await getBlogs("hidya", "Published");
        if (!active) return;
        setPosts(blogs);
      } catch (err) {
        console.error("Failed to load Hidya blog posts:", err);
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const normalizedPosts = useMemo(
    () =>
      posts.map((post) => ({
        ...post,
        "Cover Image URL": normalizeDriveImageUrl(post["Cover Image URL"]),
      })),
    [posts],
  );

  if (loading) return <BlogIndexSkeleton />;

  return (
    <div className="relative min-h-screen">
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[var(--teal-glow)] opacity-[0.04] blur-[160px] pointer-events-none" />

      <div className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Home
          </Link>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <div className="mb-14">
          <div className="text-xs uppercase tracking-[0.4em] text-[var(--gold)] mb-3">Insights</div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-2xl">
            Notes from <em className="italic text-gradient-gold">Dr. Hidaya.</em>
          </h1>
          <p className="text-muted-foreground max-w-md text-sm sm:text-base mt-6">
            Clear, patient-friendly writing on care, treatment, recovery and common questions.
          </p>
        </div>

        {failed || normalizedPosts.length === 0 ? (
          <BlogEmptyState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {normalizedPosts.map((post) => (
              <Link
                key={String(post.Slug)}
                to="/blog/$slug"
                params={{ slug: String(post.Slug) }}
                className="group relative flex flex-col rounded-3xl glass overflow-hidden hover:-translate-y-1 hover:border-[var(--gold)]/50 transition-all duration-500"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--teal-deep)]/40 to-[var(--gold)]/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--teal-glow)_0%,transparent_60%)] opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700" />
                  {post["Cover Image URL"] ? (
                    <BlogCardImage src={String(post["Cover Image URL"])} />
                  ) : (
                    <Stethoscope className="absolute bottom-6 right-6 h-16 w-16 text-[var(--gold)]/30 group-hover:text-[var(--gold)]/60 group-hover:rotate-12 transition-all duration-500" />
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                    {!!post["Published Date"] && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {formatDate(String(post["Published Date"]))}
                      </span>
                    )}

                    {!!post.Author && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-3 w-3" />
                          {String(post.Author)}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-display text-xl leading-snug mb-3 group-hover:text-[var(--gold)] transition-colors">
                    {String(post.Title || "")}
                  </h3>

                  {!!post.Excerpt && (
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {String(post.Excerpt)}
                    </p>
                  )}

                  <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--gold)] group-hover:gap-3 transition-all">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
