const APPSCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz71DXZrI85OGINsdhN1qQCvQjzitGt0x_lJIzkI3KCFMCCgYOydAGOC3rtufNOOXNhew/exec";

export { APPSCRIPT_URL };

export type BlogPost = {
  Slug?: string;
  Title?: string;
  Excerpt?: string;
  Content?: string;
  "Cover Image URL"?: string;
  "Published Date"?: string;
  Author?: string;
  Category?: string;
  Tags?: string;
  "Read Time"?: string;
  ID?: string;
  Status?: string;
  Project?: string;
  "SEO Title"?: string;
  "Meta Description"?: string;
};

export type ContentBlock =
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "subheading"; text: string }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; url: string; caption?: string }
  | { id: string; type: "list"; items: string[] }
  | { id: string; type: "quote"; text: string };

let _blockIdCounter = 0;

export function newBlockId(): string {
  _blockIdCounter += 1;
  return "blk_" + Date.now() + "_" + _blockIdCounter;
}

export function slugify(s: string): string {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeDriveImageUrl(url?: string) {
  const raw = String(url || "").trim();
  if (!raw) return "";

  const idFromQuery = raw.match(/[?&]id=([^&]+)/)?.[1];
  const idFromPath = raw.match(/\/d\/([^/]+)/)?.[1];
  const idFromUc = raw.match(/[-\w]{25,}/)?.[0];
  const fileId = idFromQuery || idFromPath || idFromUc;

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
  }

  return raw;
}

export function normalizeBlogPost(input: Record<string, unknown>): BlogPost {
  const title = String(input.Title || "").trim();
  const rawSlug = String(input.Slug || "").trim();
  const normalizedSlug = slugify(rawSlug || title);

  return {
    ...input,
    ID: String(input.ID || "").trim(),
    Title: title,
    Slug: normalizedSlug,
    Excerpt: String(input.Excerpt || "").trim(),
    Content: String(input.Content || ""),
    "Cover Image URL": normalizeDriveImageUrl(String(input["Cover Image URL"] || "")),
    "Published Date": String(input["Published Date"] || "").trim(),
    Author: String(input.Author || "").trim(),
    Category: String(input.Category || "").trim(),
    Tags: String(input.Tags || "").trim(),
    "Read Time": String(input["Read Time"] || "").trim(),
    Status: String(input.Status || "").trim(),
    Project: String(input.Project || "").trim(),
    "SEO Title": String(input["SEO Title"] || "").trim(),
    "Meta Description": String(input["Meta Description"] || "").trim(),
  };
}

export function jsonp(url: string, timeoutMs = 15000): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      reject(new Error("JSONP can only run in the browser"));
      return;
    }

    const cb = "jp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    const root = document.head || document.body || document.documentElement;

    if (!root) {
      reject(new Error("No DOM target available for JSONP"));
      return;
    }

    let finished = false;

    const cleanup = () => {
      finished = true;
      try {
        delete (window as any)[cb];
      } catch {
        (window as any)[cb] = undefined;
      }
      document.getElementById("_jp_" + cb)?.remove();
      clearTimeout(timer);
    };

    (window as any)[cb] = (data: any) => {
      if (finished) return;
      cleanup();
      resolve(data);
    };

    const sep = url.includes("?") ? "&" : "?";
    const fullUrl = `${url}${sep}callback=${encodeURIComponent(cb)}`;

    const script = document.createElement("script");
    script.id = "_jp_" + cb;
    script.async = true;
    script.src = fullUrl;

    script.onerror = () => {
      if (finished) return;
      cleanup();
      reject(new Error("JSONP request failed"));
    };

    const timer = window.setTimeout(() => {
      if (finished) return;
      cleanup();
      reject(new Error("JSONP request timed out"));
    }, timeoutMs);

    root.appendChild(script);
  });
}

export async function apiGet(path: string): Promise<any> {
  const normalizedPath = path.startsWith("?") ? path : `?${path}`;
  return jsonp(APPSCRIPT_URL + normalizedPath);
}

export async function apiPost(body: Record<string, unknown>): Promise<void> {
  try {
    await fetch(APPSCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("[apiPost] failed:", error);
    throw error;
  }
}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file");
  }

  const uploadId = "up_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

  const b64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const parts = result.split(",");
      if (!parts[1]) {
        reject(new Error("Failed to convert image to base64"));
        return;
      }
      resolve(parts[1]);
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

  try {
    await fetch(APPSCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({
        action: "uploadImage",
        uploadId,
        fileData: b64,
        fileName: file.name,
        mimeType: file.type || "image/jpeg",
      }),
    });
  } catch (error) {
    console.error("[uploadImage] post failed:", error);
    throw new Error("Image upload request failed");
  }

  for (let i = 0; i < 45; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const json = await apiGet(`?action=getUpload&uploadId=${encodeURIComponent(uploadId)}`);
      if (json?.success && json.url) return String(json.url);
      if (json?.success === false && json?.error && json.error !== "Not ready") {
        throw new Error(String(json.error));
      }
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== "JSONP request failed" &&
        err.message !== "JSONP request timed out"
      ) {
        throw err;
      }
    }
  }

  throw new Error("Upload timed out — check Drive folder permissions");
}

export async function getBlogs(project?: string, status?: string): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams({ action: "getBlogs" });
    if (project) params.set("project", project);
    if (status) params.set("status", status);

    const json = await apiGet(`?${params.toString()}`);

    if (json?.success && Array.isArray(json.blogs)) {
      return json.blogs.map((blog: Record<string, unknown>) => normalizeBlogPost(blog));
    }
  } catch (error) {
    console.error("[getBlogs] failed:", error);
  }

  return [];
}

export async function getBlog(project: string, slug: string): Promise<BlogPost | null> {
  const normalizedSlug = slugify(slug);

  try {
    const json = await apiGet(
      `?action=getBlog&project=${encodeURIComponent(project)}&slug=${encodeURIComponent(normalizedSlug)}`,
    );

    if (json?.success && json.blog) {
      return normalizeBlogPost(json.blog as Record<string, unknown>);
    }
  } catch (error) {
    console.error("[getBlog exact] failed:", error);
  }

  try {
    const blogs = await getBlogs(project);
    const matched = blogs.find(
      (post) => slugify(String(post.Slug || post.Title || "")) === normalizedSlug,
    );
    return matched || null;
  } catch (error) {
    console.error("[getBlog fallback] failed:", error);
    return null;
  }
}

function escapeHtml(s: string): string {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function blocksToContent(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
          return `[H2] ${b.text.trim()}`;
        case "subheading":
          return `[H3] ${b.text.trim()}`;
        case "paragraph":
          return `[P] ${b.text.trim()}`;
        case "image":
          return `[IMG] ${b.url.trim()}${b.caption ? ` | ${b.caption.trim()}` : ""}`;
        case "list":
          return `[LIST]\n${b.items
            .map((i) => `- ${i.trim()}`)
            .filter((line) => line !== "-")
            .join("\n")}`;
        case "quote":
          return `[QUOTE] ${b.text.trim()}`;
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

export function parseContentToBlocks(content: string): ContentBlock[] {
  if (!content.trim()) return [];

  const blocks: ContentBlock[] = [];
  const chunks = content.split(/\n\s*\n(?=\[)/);

  for (const raw of chunks) {
    const c = raw.trim();
    if (!c) continue;

    if (c.startsWith("[H2] ")) {
      blocks.push({ id: newBlockId(), type: "heading", text: c.slice(5).trim() });
    } else if (c.startsWith("[H3] ")) {
      blocks.push({ id: newBlockId(), type: "subheading", text: c.slice(5).trim() });
    } else if (c.startsWith("[P] ")) {
      blocks.push({ id: newBlockId(), type: "paragraph", text: c.slice(4).trim() });
    } else if (c.startsWith("[IMG] ")) {
      const rest = c.slice(6).trim();
      const splitIndex = rest.indexOf(" | ");
      const url = splitIndex === -1 ? rest : rest.slice(0, splitIndex);
      const caption = splitIndex === -1 ? "" : rest.slice(splitIndex + 3);

      blocks.push({
        id: newBlockId(),
        type: "image",
        url: url.trim(),
        caption: caption.trim() || undefined,
      });
    } else if (c.startsWith("[LIST]")) {
      const items = c
        .split("\n")
        .slice(1)
        .map((l) => l.replace(/^[-*]\s*/, "").trim())
        .filter(Boolean);

      blocks.push({
        id: newBlockId(),
        type: "list",
        items: items.length ? items : [""],
      });
    } else if (c.startsWith("[QUOTE] ")) {
      blocks.push({ id: newBlockId(), type: "quote", text: c.slice(8).trim() });
    } else {
      blocks.push({ id: newBlockId(), type: "paragraph", text: c });
    }
  }

  return blocks;
}

export function textToHtml(content: string): string {
  if (!content) return "";

  const blocks = parseContentToBlocks(content);

  if (!blocks.length) {
    return content
      .split(/\n\n+/)
      .map((p) => `<p>${escapeHtml(p.trim())}</p>`)
      .join("\n");
  }

  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
          return `<h2 class="font-display text-2xl font-semibold leading-tight mt-10 mb-3 text-foreground">${escapeHtml(b.text)}</h2>`;

        case "subheading":
          return `<h3 class="font-display text-xl font-semibold leading-tight mt-8 mb-2 text-foreground">${escapeHtml(b.text)}</h3>`;

        case "paragraph":
          return `<p class="my-4 leading-relaxed text-muted-foreground">${escapeHtml(b.text).replace(/\n/g, "<br/>")}</p>`;

        case "image":
          return `<figure class="my-8">
  <img src="${escapeHtml(normalizeDriveImageUrl(b.url))}" alt="${escapeHtml(b.caption || "")}" class="w-full rounded-2xl object-cover" loading="lazy" referrerpolicy="no-referrer" />
  ${b.caption ? `<figcaption class="text-center text-xs text-muted-foreground mt-2">${escapeHtml(b.caption)}</figcaption>` : ""}
</figure>`;

        case "list":
          return `<ul class="my-4 space-y-1.5 list-disc ml-5 text-muted-foreground">
  ${b.items.map((i) => `<li class="leading-relaxed">${escapeHtml(i)}</li>`).join("")}
</ul>`;

        case "quote":
          return `<blockquote class="border-l-2 border-[var(--gold)]/50 pl-4 py-1 my-6 italic text-muted-foreground">${escapeHtml(b.text)}</blockquote>`;

        default:
          return "";
      }
    })
    .join("\n");
}