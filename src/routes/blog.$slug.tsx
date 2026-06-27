import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { apiGet, textToHtml } from "../lib/api";

type BlogPost = Record<string, unknown>;

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetail,
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const json = await apiGet(`?action=getBlog&slug=${encodeURIComponent(slug)}`);
        if (!cancelled && json.success) setPost(json.blog);
      } catch {}
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (post) {
      const t = String(post["SEO Title"] || post.Title || "");
      if (t) document.title = t + " — Dr. Noorul Hidaya";
    }
  }, [post]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="text-4xl font-semibold mb-4">Not found</h1>
        <p className="text-muted-foreground mb-8">This article doesn't exist or has been removed.</p>
        <Link to="/blog" className="text-sm text-primary hover:underline flex items-center gap-1"><ArrowLeft size={14} /> Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-10"><ArrowLeft size={14} /> Back to Blog</Link>

        {!!post["Cover Image URL"] && (
          <img src={String(post["Cover Image URL"])} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} className="w-full h-56 sm:h-72 object-cover rounded-2xl mb-10" />
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {!!post.Author && <span className="flex items-center gap-1.5"><User size={14} />{String(post.Author)}</span>}
          {!!post["Published Date"] && <span className="flex items-center gap-1.5"><Calendar size={14} />{formatDate(String(post["Published Date"]))}</span>}
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold leading-tight mb-6">{String(post.Title)}</h1>

        {!!post.Excerpt && <p className="text-lg text-muted-foreground italic border-l-4 border-border pl-4 mb-8">{String(post.Excerpt)}</p>}

        <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: textToHtml(String(post.Content || "")) }} />
      </article>
    </div>
  );
}

function formatDate(val: string) {
  try { return format(new Date(val), "MMM d, yyyy"); } catch { return val; }
}
