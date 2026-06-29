import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, ChevronRight } from "lucide-react";
import { getBlog, normalizeDriveImageUrl, type BlogPost } from "@/lib/api";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlog("hidya", params.slug);
    if (!post || (post.Status && post.Status !== "Published")) {
      throw notFound();
    }
    return { post };
  },
  pendingComponent: BlogPostSkeleton,
  component: BlogPostPage,
  notFoundComponent: BlogNotFound,
});

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

function estimateReadTime(text: string) {
  return `${Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200))} min read`;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function applyInlineMarkdown(text: string) {
  const escaped = escapeHtml(text);

  return escaped
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      `<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--gold)] underline underline-offset-2 hover:opacity-80 transition-opacity">$1</a>`,
    )
    .replace(
      /`([^`]+)`/g,
      `<code class="bg-white/10 text-[var(--gold)] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>`,
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function renderMarkdown(content: string): string {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";

  const hasCustomTags = /\[(H2|H3|P|LIST|IMG|QUOTE)\]/i.test(normalized);
  if (hasCustomTags) {
    return renderTaggedContent(normalized);
  }

  const lines = normalized.split("\n");
  const blocks: string[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    const html = paragraphBuffer.join(" ").trim();
    if (html) {
      blocks.push(
        `<p class="text-muted-foreground leading-relaxed my-4">${applyInlineMarkdown(html)}</p>`,
      );
    }
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (!listBuffer.length) return;
    blocks.push(
      `<ul class="space-y-2 my-4">${listBuffer
        .map(
          (item) =>
            `<li class="ml-4 list-disc marker:text-[var(--gold)]">${applyInlineMarkdown(item)}</li>`,
        )
        .join("")}</ul>`,
    );
    listBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^---$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push(`<hr class="border-border/40 my-10" />`);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();

      const level = headingMatch[1].length;
      const text = applyInlineMarkdown(headingMatch[2].trim());
      const sizes = ["", "text-4xl", "text-3xl", "text-2xl", "text-xl", "text-lg", "text-base"];
      const size = sizes[level] || "text-base";

      blocks.push(
        `<h${level} class="font-display ${size} font-semibold leading-tight mt-10 mb-4 text-foreground">${text}</h${level}>`,
      );
      continue;
    }

    const blockquoteMatch = line.match(/^>\s+(.+)$/);
    if (blockquoteMatch) {
      flushParagraph();
      flushList();
      blocks.push(
        `<blockquote class="border-l-2 border-[var(--gold)]/50 pl-4 py-1 my-4 text-muted-foreground italic">${applyInlineMarkdown(
          blockquoteMatch[1],
        )}</blockquote>`,
      );
      continue;
    }

    const listMatch = line.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      listBuffer.push(listMatch[1].trim());
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return blocks.join("");
}

function renderTaggedContent(content: string): string {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[] = [];
  let i = 0;

  const pushParagraph = (text: string) => {
    const value = text.trim();
    if (!value) return;
    blocks.push(
      `<p class="text-muted-foreground leading-relaxed my-4">${applyInlineMarkdown(value)}</p>`,
    );
  };

  const pushH2 = (text: string) => {
    const value = text.trim();
    if (!value) return;
    blocks.push(
      `<h2 class="font-display text-3xl sm:text-4xl font-semibold leading-tight mt-10 mb-4 text-foreground">${applyInlineMarkdown(value)}</h2>`,
    );
  };

  const pushH3 = (text: string) => {
    const value = text.trim();
    if (!value) return;
    blocks.push(
      `<h3 class="font-display text-2xl font-semibold leading-tight mt-8 mb-3 text-foreground">${applyInlineMarkdown(value)}</h3>`,
    );
  };

  const pushList = (items: string[]) => {
    const cleanItems = items.map((item) => item.trim()).filter(Boolean);
    if (!cleanItems.length) return;

    blocks.push(
      `<ul class="space-y-2 my-4">${cleanItems
        .map(
          (item) =>
            `<li class="ml-4 list-disc marker:text-[var(--gold)]">${applyInlineMarkdown(item)}</li>`,
        )
        .join("")}</ul>`,
    );
  };

  const pushImage = (url: string, caption = "") => {
    const normalizedUrl = normalizeDriveImageUrl(url);
    if (!normalizedUrl) return;

    blocks.push(
      `<figure class="my-8">
        <img
          src="${escapeHtml(normalizedUrl)}"
          alt="${escapeHtml(caption)}"
          class="w-full rounded-2xl object-cover"
          loading="lazy"
          referrerpolicy="no-referrer"
        />
        ${
          caption
            ? `<figcaption class="text-center text-xs text-muted-foreground mt-2">${escapeHtml(caption)}</figcaption>`
            : ""
        }
      </figure>`,
    );
  };

  const pushQuote = (text: string) => {
    const value = text.trim();
    if (!value) return;
    blocks.push(
      `<blockquote class="border-l-2 border-[var(--gold)]/50 pl-4 py-1 my-6 italic text-muted-foreground">${applyInlineMarkdown(value)}</blockquote>`,
    );
  };

  while (i < lines.length) {
    const raw = lines[i]?.trim() || "";

    if (!raw) {
      i++;
      continue;
    }

    if (/^\[H2\]/i.test(raw)) {
      pushH2(raw.replace(/^\[H2\]\s*/i, ""));
      i++;
      continue;
    }

    if (/^\[H3\]/i.test(raw)) {
      pushH3(raw.replace(/^\[H3\]\s*/i, ""));
      i++;
      continue;
    }

    if (/^\[IMG\]/i.test(raw)) {
      const payload = raw.replace(/^\[IMG\]\s*/i, "").trim();
      const splitIndex = payload.indexOf(" | ");
      const url = splitIndex === -1 ? payload : payload.slice(0, splitIndex);
      const caption = splitIndex === -1 ? "" : payload.slice(splitIndex + 3);
      pushImage(url, caption);
      i++;
      continue;
    }

    if (/^\[QUOTE\]/i.test(raw)) {
      pushQuote(raw.replace(/^\[QUOTE\]\s*/i, ""));
      i++;
      continue;
    }

    if (/^\[P\]/i.test(raw)) {
      const inlineText = raw.replace(/^\[P\]\s*/i, "").trim();

      if (inlineText) {
        pushParagraph(inlineText);
        i++;
        continue;
      }

      i++;
      const paragraphLines: string[] = [];

      while (i < lines.length) {
        const next = lines[i]?.trim() || "";

        if (!next) {
          if (paragraphLines.length) break;
          i++;
          continue;
        }

        if (/^\[(H2|H3|P|LIST|IMG|QUOTE)\]/i.test(next)) break;

        paragraphLines.push(next);
        i++;
      }

      pushParagraph(paragraphLines.join(" "));
      continue;
    }

    if (/^\[LIST\]/i.test(raw)) {
      i++;
      const items: string[] = [];

      while (i < lines.length) {
        const next = lines[i]?.trim() || "";

        if (!next) {
          if (items.length) break;
          i++;
          continue;
        }

        if (/^\[(H2|H3|P|LIST|IMG|QUOTE)\]/i.test(next)) break;

        items.push(next.replace(/^[-*]\s+/, "").trim());
        i++;
      }

      pushList(items);
      continue;
    }

    const looseParagraph: string[] = [raw];
    i++;

    while (i < lines.length) {
      const next = lines[i]?.trim() || "";
      if (!next || /^\[(H2|H3|P|LIST|IMG|QUOTE)\]/i.test(next)) break;
      looseParagraph.push(next);
      i++;
    }

    pushParagraph(looseParagraph.join(" "));
  }

  return blocks.join("");
}

function BlogPostSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12 animate-pulse">
      <div className="h-3 w-20 rounded bg-white/10 mb-8" />
      <div className="h-12 w-3/4 rounded-xl bg-white/10 mb-4" />
      <div className="h-8 w-1/2 rounded-xl bg-white/10 mb-4" />
      <div className="h-5 w-64 rounded bg-white/10 mb-10" />
      <div className="h-72 rounded-3xl bg-white/10 mb-10" />
      <div className="space-y-3">
        {[100, 95, 90, 100, 85, 60].map((w, i) => (
          <div key={i} className="h-4 rounded bg-white/10" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function CoverImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) return null;

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
}

function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/40 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-[var(--gold)]/40 transition-all duration-300"
    >
      <Share2 className="h-3.5 w-3.5" />
      {copied ? "Copied!" : "Share"}
    </button>
  );
}

function BlogNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 h-16 w-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
        <BookOpen className="h-8 w-8 text-[var(--gold)]/50" />
      </div>
      <h1 className="font-display text-4xl mb-3">Article not found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm text-sm leading-relaxed">
        This article may have been moved or is no longer published.
      </p>
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-[var(--gold)] text-xs uppercase tracking-[0.25em] hover:gap-3 transition-all"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to all articles
      </Link>
    </div>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  const readTime =
    post["Read Time"] ?? (post.Content ? estimateReadTime(post.Content) : "5 min read");

  const tags = post.Tags
    ? post.Tags.split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const coverImageUrl = useMemo(() => normalizeDriveImageUrl(post["Cover Image URL"]), [post]);

  const renderedContent = useMemo(() => {
    if (!post.Content) return "";
    return renderMarkdown(String(post.Content));
  }, [post.Content]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [post]);

  return (
    <article className="relative min-h-screen">
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[var(--teal-glow)] opacity-[0.04] blur-[160px] pointer-events-none" />

      <div className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            All articles
          </Link>
          <ShareButton title={String(post.Title)} />
        </div>
      </div>

      <header className="relative pt-12 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {post.Category && (
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-[var(--gold)] mb-6">
              <Link to="/blog" className="hover:opacity-70 transition-opacity">
                Insights
              </Link>
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
              <span>{String(post.Category)}</span>
            </div>
          )}

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6 max-w-5xl">
            {String(post.Title)}
          </h1>

          {post.Excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              {String(post.Excerpt)}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-8 border-b border-border/40">
            {post.Author && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--teal-deep)]/60 to-[var(--gold)]/30 flex items-center justify-center">
                  <User className="h-4 w-4 text-[var(--gold)]" />
                </div>
                <span className="font-medium text-foreground">{String(post.Author)}</span>
              </div>
            )}

            {post["Published Date"] && (
              <>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(String(post["Published Date"]))}
                </span>
              </>
            )}

            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readTime}
            </span>
          </div>
        </div>
      </header>

      {coverImageUrl && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
          <div className="relative rounded-3xl overflow-hidden h-64 sm:h-96 bg-gradient-to-br from-[var(--teal-deep)]/40 to-[var(--gold)]/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--teal-glow)_0%,transparent_60%)] opacity-30" />
            <CoverImage src={coverImageUrl} alt={String(post.Title)} />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid lg:grid-cols-[1fr_240px] gap-12 items-start">
          <div>
            {post.Content ? (
              <div
                className="text-[15px] sm:text-base leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">{post.Excerpt}</p>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border/40">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full glass border border-border/40 text-xs text-muted-foreground uppercase tracking-[0.15em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-12 p-6 rounded-3xl glass border border-[var(--gold)]/20 bg-gradient-to-br from-[var(--teal-deep)]/10 to-[var(--gold)]/5">
              <p className="text-sm text-muted-foreground mb-4">
                Have questions after reading? Reach out for a personal consultation.
              </p>
              <Link
                to="/"
                hash="contact"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--gold)] hover:gap-3 transition-all"
              >
                Book a consultation <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="p-5 rounded-2xl glass border border-border/40">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  Share
                </p>
                <ShareButton title={String(post.Title)} />
              </div>

              <div className="p-5 rounded-2xl glass border border-border/40 space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About</p>

                {post.Author && (
                  <div>
                    <p className="text-[11px] text-muted-foreground/60 mb-1">Written by</p>
                    <p className="text-sm font-medium text-foreground">{String(post.Author)}</p>
                  </div>
                )}

                {post["Published Date"] && (
                  <div>
                    <p className="text-[11px] text-muted-foreground/60 mb-1">Published</p>
                    <p className="text-sm">{formatDate(String(post["Published Date"]))}</p>
                  </div>
                )}

                <div>
                  <p className="text-[11px] text-muted-foreground/60 mb-1">Reading time</p>
                  <p className="text-sm">{readTime}</p>
                </div>
              </div>

              <Link
                to="/blog"
                className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-[var(--gold)] transition-colors group"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                All articles
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
