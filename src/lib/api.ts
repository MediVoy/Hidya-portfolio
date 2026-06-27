const APPSCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwNrmjCqqh0bd7bvoRmxxNcIqAHTbVCDvH6jLeSH0F71sB3POzosgDfTP64BF4yIcnFFA/exec";

export { APPSCRIPT_URL };

export function jsonp(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const cb = "jp" + Date.now() + Math.random().toString(36).substring(2, 7);
    (window as any)[cb] = (data: any) => {
      delete (window as any)[cb];
      const s = document.getElementById("_jp_" + cb);
      if (s) s.remove();
      resolve(data);
    };
    const sep = url.includes("?") ? "&" : "?";
    const script = document.createElement("script");
    script.id = "_jp_" + cb;
    script.src = url + sep + "callback=" + cb;
    script.onerror = () => {
      delete (window as any)[cb];
      script.remove();
      reject(new Error("JSONP request failed"));
    };
    document.body.appendChild(script);
  });
}

export async function apiGet(path: string): Promise<any> {
  return jsonp(APPSCRIPT_URL + path);
}

export async function apiPost(body: Record<string, unknown>): Promise<void> {
  await fetch(APPSCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(body),
  });
}

export async function uploadImage(file: File): Promise<string> {
  const toBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const uploadId = "up_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const fileData = await toBase64(file);
  await apiPost({
    action: "uploadImage",
    fileData,
    fileName: file.name,
    mimeType: file.type,
    uploadId,
  });

  // Poll via JSONP until upload is ready (large images can take a while to write to Drive)
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const json = await apiGet("?action=getUpload&uploadId=" + uploadId);
      if (json.success && json.url) return json.url;
      if (json.success === false && json.error && json.error !== "Not ready") {
        throw new Error(json.error);
      }
    } catch (err) {
      if (err instanceof Error && err.message !== "JSONP request failed") throw err;
    }
  }
  throw new Error("Upload timed out");
}

export function textToHtml(text: string): string {
  if (!text) return "";
  return text
    .split(/\n\n+/)
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      // A chunk that is a single bare URL is an image (covers Drive thumbnail
      // links, which have no file extension and wouldn't match an extension check).
      if (/^https?:\/\/\S+$/.test(block)) {
        return `<img src="${block}" alt="" style="max-width:100%;border-radius:12px;margin:1.5rem 0" />`;
      }
      const lines = block.split("\n");
      if (lines.every((l) => /^[-*]\s/.test(l))) {
        return (
          "<ul>" + lines.map((l) => "<li>" + l.replace(/^[-*]\s/, "") + "</li>").join("") + "</ul>"
        );
      }
      return "<p>" + lines.join("<br/>") + "</p>";
    })
    .join("\n");
}
