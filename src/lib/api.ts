const APPSCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzH9s1xIwz5Ok3JfwqKD_yS-zpiEOUKR37yYL_wvYURXAh4oxpAo6XOUL1mv1qkkbaY5w/exec";

export { APPSCRIPT_URL };

export type BlogPost = {
  ID?: string;
  Title?: string;
  Slug?: string;
  Excerpt?: string;
  Content?: string;
  "Cover Image URL"?: string;
  "Published Date"?: string;
  Author?: string;
  Category?: string;
  Tags?: string;
  "Read Time"?: string;
  Status?: string;
  Project?: string;
  "SEO Title"?: string;
  "Meta Description"?: string;
  "Created At"?: string;
  "Updated At"?: string;
  _row?: number;
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
  return `blk_${Date.now()}_${_blockIdCounter}`;
}

export function slugify(value: string): string {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeDriveImageUrl(url?: string): string {
  const raw = String(url || "").trim();

  if (!raw) return "";

  const idFromQuery = raw.match(/[?&]id=([^&]+)/)?.[1];
  const idFromPath = raw.match(/\/d\/([^/]+)/)?.[1];
  const idFromLooseMatch = raw.match(/[-\w]{25,}/)?.[0];

  const fileId = idFromQuery || idFromPath || idFromLooseMatch;

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=` + `${encodeURIComponent(fileId)}&sz=w1600`;
  }

  return raw;
}

export function normalizeBlogPost(input: Record<string, unknown>): BlogPost {
  const title = String(input.Title || "").trim();
  const rawSlug = String(input.Slug || "").trim();

  return {
    ...input,
    ID: String(input.ID || "").trim(),
    Title: title,
    Slug: slugify(rawSlug || title),
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
    "Created At": String(input["Created At"] || "").trim(),
    "Updated At": String(input["Updated At"] || "").trim(),
    _row: Number(input._row || 0) || undefined,
  };
}

export function jsonp<T = unknown>(url: string, timeoutMs = 15000): Promise<T> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      reject(new Error("JSONP can only run in the browser"));
      return;
    }

    const callbackName = `jp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const root = document.head || document.body || document.documentElement;

    if (!root) {
      reject(new Error("No DOM target available for JSONP"));
      return;
    }

    let finished = false;
    let timer: number | undefined;

    const cleanup = () => {
      finished = true;

      try {
        delete (window as Record<string, unknown>)[callbackName];
      } catch {
        (window as Record<string, unknown>)[callbackName] = undefined;
      }

      document.getElementById(`_jp_${callbackName}`)?.remove();

      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };

    (window as Record<string, unknown>)[callbackName] = (data: T) => {
      if (finished) return;

      cleanup();
      resolve(data);
    };

    const separator = url.includes("?") ? "&" : "?";

    const script = document.createElement("script");
    script.id = `_jp_${callbackName}`;
    script.async = true;
    script.src = `${url}${separator}callback=${encodeURIComponent(callbackName)}`;

    script.onerror = () => {
      if (finished) return;

      cleanup();
      reject(new Error("JSONP request failed"));
    };

    timer = window.setTimeout(() => {
      if (finished) return;

      cleanup();
      reject(new Error("JSONP request timed out"));
    }, timeoutMs);

    root.appendChild(script);
  });
}

/**
 * Public GET:
 *   await apiGet("?action=getBlogs&project=hidaya")
 *
 * Admin GET:
 *   await apiGet("?action=getLeads&project=hidaya", adminApiKey)
 */
export async function apiGet<T = unknown>(path: string, apiKey?: string): Promise<T> {
  const normalizedPath = path.startsWith("?") ? path : `?${path}`;

  const separator = normalizedPath.includes("?") ? "&" : "?";

  const pathWithKey = apiKey
    ? `${normalizedPath}${separator}key=${encodeURIComponent(apiKey)}`
    : normalizedPath;

  return jsonp<T>(APPSCRIPT_URL + pathWithKey);
}

/**
 * Public POST:
 *   await apiPost({ action: "create", project: "hidaya", ... })
 *
 * Admin POST:
 *   await apiPost({ action: "create", project: "blog", ... }, adminApiKey)
 *
 * `no-cors` means the browser cannot read the Apps Script response body.
 * The request is still sent successfully.
 */
export async function apiPost(body: Record<string, unknown>, apiKey?: string): Promise<void> {
  try {
    await fetch(APPSCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body: JSON.stringify({
        ...body,
        ...(apiKey ? { key: apiKey } : {}),
      }),
    });
  } catch (error) {
    console.error("[apiPost] failed:", error);
    throw error;
  }
}

/**
 * Public booking form helper.
 *
 * Do not pass an admin key here. Public lead creation is protected server-side
 * by the honeypot and phone-number rate limiting.
 */
export async function submitLead(input: {
  project: "hidaya" | "muneef";
  name: string;
  phone: string;
  email: string;
  date?: string;
  time?: string;
  service?: string;
  message?: string;
  consent: boolean;
  website?: string;
}): Promise<void> {
  await apiPost({
    action: "create",
    project: input.project,
    name: input.name,
    phone: input.phone,
    email: input.email,
    date: input.date || "",
    time: input.time || "",
    service: input.service || "",
    message: input.message || "",
    consent: input.consent,
    website: input.website || "",
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.split(",")[1];

      if (!base64) {
        reject(new Error("Failed to convert image to base64"));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image file"));
    };

    reader.readAsDataURL(file);
  });
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

/**
 * Admin-only image upload.
 *
 * The Apps Script backend requires a valid key for uploadChunk and getUpload.
 *
 * IMPORTANT:
 * Do not put API_SECRET in a public website, a VITE_* variable, or any
 * browser-exposed production JavaScript bundle.
 */
export async function uploadImage(file: File, adminApiKey: string): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file");
  }

  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    throw new Error("Only JPEG, PNG, WebP, and GIF image files are supported");
  }

  if (!adminApiKey) {
    throw new Error("Admin API key is missing");
  }

  const base64 = await fileToBase64(file);

  const uploadId = `up_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  /**
   * Keep under Apps Script Script Property single-value limits.
   * The backend permits a maximum 8,500-character chunk.
   */
  const chunkSize = 8000;
  const chunks: string[] = [];

  for (let offset = 0; offset < base64.length; offset += chunkSize) {
    chunks.push(base64.slice(offset, offset + chunkSize));
  }

  if (chunks.length > 200) {
    throw new Error("Image is too large. Please resize or compress it before uploading.");
  }

  for (let index = 0; index < chunks.length; index += 1) {
    await apiPost(
      {
        action: "uploadChunk",
        uploadId,
        chunkIndex: index,
        totalChunks: chunks.length,
        chunk: chunks[index],
        fileName: file.name,
        mimeType: file.type || "image/jpeg",
      },
      adminApiKey,
    );
  }

  for (let attempt = 0; attempt < 45; attempt += 1) {
    await sleep(2000);

    try {
      const json = await apiGet<{
        success?: boolean;
        error?: string;
        url?: string;
        fileId?: string;
      }>(`?action=getUpload&uploadId=${encodeURIComponent(uploadId)}`, adminApiKey);

      if (json?.success && json.url) {
        return String(json.url);
      }

      if (json?.success === false && json.error && json.error !== "Not ready") {
        throw new Error(String(json.error));
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message !== "JSONP request failed" &&
        error.message !== "JSONP request timed out"
      ) {
        throw error;
      }
    }
  }

  throw new Error(
    "Image upload timed out. Check Apps Script execution logs and Google Drive permissions.",
  );
}

/**
 * Public read. The backend always returns only Published blogs unless a valid
 * admin key is sent through apiGet().
 */
export async function getBlogs(project?: string, status?: string): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams({
      action: "getBlogs",
    });

    if (project) {
      params.set("project", project);
    }

    if (status) {
      params.set("status", status);
    }

    const json = await apiGet<{
      success?: boolean;
      blogs?: Record<string, unknown>[];
    }>(`?${params.toString()}`);

    if (json?.success && Array.isArray(json.blogs)) {
      return json.blogs.map((blog) => normalizeBlogPost(blog));
    }
  } catch (error) {
    console.error("[getBlogs] failed:", error);
  }

  return [];
}

/**
 * Admin blog list helper. Allows Draft filtering because it supplies the key.
 */
export async function getAdminBlogs(
  project: string,
  status: string,
  adminApiKey: string,
): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams({
      action: "getBlogs",
      project,
      status,
    });

    const json = await apiGet<{
      success?: boolean;
      error?: string;
      blogs?: Record<string, unknown>[];
    }>(`?${params.toString()}`, adminApiKey);

    if (!json?.success) {
      throw new Error(json?.error || "Could not load blogs");
    }

    if (!Array.isArray(json.blogs)) {
      return [];
    }

    return json.blogs.map((blog) => normalizeBlogPost(blog));
  } catch (error) {
    console.error("[getAdminBlogs] failed:", error);
    throw error;
  }
}

export async function getBlog(project: string, slug: string): Promise<BlogPost | null> {
  const normalizedSlug = slugify(slug);

  try {
    const json = await apiGet<{
      success?: boolean;
      blog?: Record<string, unknown>;
    }>(
      `?action=getBlog&project=${encodeURIComponent(project)}&slug=${encodeURIComponent(normalizedSlug)}`,
    );

    if (json?.success && json.blog) {
      return normalizeBlogPost(json.blog);
    }
  } catch (error) {
    console.error("[getBlog exact] failed:", error);
  }

  try {
    const blogs = await getBlogs(project);

    return (
      blogs.find((post) => slugify(String(post.Slug || post.Title || "")) === normalizedSlug) ||
      null
    );
  } catch (error) {
    console.error("[getBlog fallback] failed:", error);
    return null;
  }
}

/**
 * Admin-only blog create helper.
 */
export async function createBlog(
  blog: Omit<BlogPost, "ID" | "_row" | "Created At" | "Updated At">,
  adminApiKey: string,
): Promise<void> {
  await apiPost(
    {
      action: "create",
      project: "blog",
      ...blog,
    },
    adminApiKey,
  );
}

/**
 * Admin-only blog update helper.
 */
export async function updateBlog(
  blog: Partial<BlogPost> & { ID: string },
  adminApiKey: string,
): Promise<void> {
  await apiPost(
    {
      action: "update",
      project: "blog",
      ...blog,
    },
    adminApiKey,
  );
}

/**
 * Admin-only blog delete helper.
 */
export async function deleteBlog(id: string, adminApiKey: string): Promise<void> {
  await apiPost(
    {
      action: "delete",
      project: "blog",
      ID: id,
    },
    adminApiKey,
  );
}

function escapeHtml(value: string): string {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function blocksToContent(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `[H2] ${block.text.trim()}`;

        case "subheading":
          return `[H3] ${block.text.trim()}`;

        case "paragraph":
          return `[P] ${block.text.trim()}`;

        case "image":
          return `[IMG] ${block.url.trim()}${block.caption ? ` | ${block.caption.trim()}` : ""}`;

        case "list":
          return `[LIST]\n${block.items
            .map((item) => `- ${item.trim()}`)
            .filter((line) => line !== "-")
            .join("\n")}`;

        case "quote":
          return `[QUOTE] ${block.text.trim()}`;

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

  for (const rawChunk of chunks) {
    const chunk = rawChunk.trim();

    if (!chunk) continue;

    if (chunk.startsWith("[H2] ")) {
      blocks.push({
        id: newBlockId(),
        type: "heading",
        text: chunk.slice(5).trim(),
      });
      continue;
    }

    if (chunk.startsWith("[H3] ")) {
      blocks.push({
        id: newBlockId(),
        type: "subheading",
        text: chunk.slice(5).trim(),
      });
      continue;
    }

    if (chunk.startsWith("[P] ")) {
      blocks.push({
        id: newBlockId(),
        type: "paragraph",
        text: chunk.slice(4).trim(),
      });
      continue;
    }

    if (chunk.startsWith("[IMG] ")) {
      const rest = chunk.slice(6).trim();
      const splitIndex = rest.indexOf(" | ");

      const imageUrl = splitIndex === -1 ? rest : rest.slice(0, splitIndex);

      const caption = splitIndex === -1 ? "" : rest.slice(splitIndex + 3);

      blocks.push({
        id: newBlockId(),
        type: "image",
        url: imageUrl.trim(),
        caption: caption.trim() || undefined,
      });

      continue;
    }

    if (chunk.startsWith("[LIST]")) {
      const items = chunk
        .split("\n")
        .slice(1)
        .map((line) => line.replace(/^[-*]\s*/, "").trim())
        .filter(Boolean);

      blocks.push({
        id: newBlockId(),
        type: "list",
        items: items.length ? items : [""],
      });

      continue;
    }

    if (chunk.startsWith("[QUOTE] ")) {
      blocks.push({
        id: newBlockId(),
        type: "quote",
        text: chunk.slice(8).trim(),
      });

      continue;
    }

    blocks.push({
      id: newBlockId(),
      type: "paragraph",
      text: chunk,
    });
  }

  return blocks;
}

export function textToHtml(content: string): string {
  if (!content) return "";

  const blocks = parseContentToBlocks(content);

  if (!blocks.length) {
    return content
      .split(/\n\n+/)
      .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
      .join("\n");
  }

  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2 class="font-display text-2xl font-semibold leading-tight mt-10 mb-3 text-foreground">${escapeHtml(block.text)}</h2>`;

        case "subheading":
          return `<h3 class="font-display text-xl font-semibold leading-tight mt-8 mb-2 text-foreground">${escapeHtml(block.text)}</h3>`;

        case "paragraph":
          return `<p class="my-4 leading-relaxed text-muted-foreground">${escapeHtml(block.text).replace(/\n/g, "<br/>")}</p>`;

        case "image":
          return `<figure class="my-8">
  <img src="${escapeHtml(normalizeDriveImageUrl(block.url))}" alt="${escapeHtml(block.caption || "")}" class="w-full rounded-2xl object-cover" loading="lazy" referrerpolicy="no-referrer" />
  ${block.caption ? `<figcaption class="text-center text-xs text-muted-foreground mt-2">${escapeHtml(block.caption)}</figcaption>` : ""}
</figure>`;

        case "list":
          return `<ul class="my-4 space-y-1.5 list-disc ml-5 text-muted-foreground">
  ${block.items.map((item) => `<li class="leading-relaxed">${escapeHtml(item)}</li>`).join("")}
</ul>`;

        case "quote":
          return `<blockquote class="border-l-2 border-[var(--gold)]/50 pl-4 py-1 my-6 italic text-muted-foreground">${escapeHtml(block.text)}</blockquote>`;

        default:
          return "";
      }
    })
    .join("\n");
}
