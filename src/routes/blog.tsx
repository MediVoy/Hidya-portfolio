import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { apiGet } from "../lib/api";

type BlogPost = Record<string, unknown>;

export const Route = createFileRoute("/blog")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "Insights — Dr. Noorul Hidaya" },
      { name: "description", content: "Eye care insights, tips, and updates from Dr. Noorul Hidaya." },
    ],
  }),
});

function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const json = await apiGet("?action=getBlogs&project=hidya&status=Published");
        if (!cancelled && json.success) setPosts(json.blogs);
      } catch {}
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="py-20 px-6 text-center border-b border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Insights</p>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">Blog & Updates</h1>
          <p className="text-muted-foreground">Eye care insights, tips, and updates from Dr. Noorul Hidaya</p>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-20">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((p) => (
              <article key={String(p.Slug)} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition">
                {!!p["Cover Image URL"] && (
                  <div className="h-48 overflow-hidden"><img src={String(p["Cover Image URL"])} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} className="w-full h-full object-cover group-hover:scale-[1.02] transition" /></div>
                )}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    {!!p.Author && <span className="flex items-center gap-1"><User size={11} />{String(p.Author)}</span>}
                    {!!p["Published Date"] && <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(String(p["Published Date"]))}</span>}
                  </div>
                  <h2 className="font-display text-xl font-semibold leading-snug group-hover:text-primary transition">{String(p.Title)}</h2>
                  {!!p.Excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{String(p.Excerpt)}</p>}
                  <Link to="/blog/$slug" params={{ slug: String(p.Slug) }} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">Read more <ArrowRight size={14} /></Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function formatDate(val: string) {
  try { return format(new Date(val), "MMM d, yyyy"); } catch { return val; }
}
