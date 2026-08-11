import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import rust from "highlight.js/lib/languages/rust";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import graphql from "highlight.js/lib/languages/graphql";
import { COPY_ICON } from "./icons";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("graphql", graphql);

hljs.registerLanguage("spark", function (hljs) {
  const KEYWORDS = {
    keyword: "val func when else return say not and or",
    literal: "yes no nil",
  };
  return {
    name: "Spark",
    aliases: ["spark"],
    keywords: KEYWORDS,
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: "built_in",
        begin: /\b(say)\s*(?=\()/,
        relevance: 0,
      },
      {
        className: "operator",
        begin: /[+\-*/%=!<>]=?|&&|\|\|/,
      },
      {
        className: "punctuation",
        begin: /[{}()\[\],;]/,
      },
    ],
  };
});

marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },
  }),
);

export function addLineNumbers(code: string): string {
  const lines = code.split("\n");
  const n = lines.length;
  // Trim trailing empty lines
  let end = n;
  while (end && lines[end - 1] === "") end--;
  if (!end) return "";
  const out = new Array(end);
  for (let i = 0; i < end; i++) {
    out[i] = `<span class="line-num">${i + 1}</span>${lines[i]}`;
  }
  return out.join("\n");
}

const FILE_PATH_RE = /^\s*(?:<span[^>]*class="[^"]*comment[^"]*"[^>]*>)?\/\/\s*(.+?)(?:<\/span>)?\s*$/;

export function wrapCodeBlocks(html: string): string {
  return html.replace(
    /<pre\b([^>]*)><code\b([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
    (match, preAttrs, codeAttrs, code) => {
      const lines = code.split("\n");
      let innerCode = code;
      let fileLabel = "";

      if (lines.length > 0) {
        const m = lines[0].match(FILE_PATH_RE);
        if (m) {
          const full = m[1];
          fileLabel = full.replace(/^.*[/\\]/, "");
          innerCode = lines.slice(1).join("\n");
          // Strip leading blank lines after removing the filename comment
          innerCode = innerCode.replace(/^\s*\n+/, "");
        }
      }

      const numbered = addLineNumbers(innerCode);
      const header = fileLabel
        ? `<div class="code-file-label">${fileLabel}</div>`
        : "";
      return `<div class="code-block">${header}<div class="code-wrapper"><pre${preAttrs}><code${codeAttrs}>${numbered}</code></pre><button class="copy-btn" aria-label="Copy code">${COPY_ICON}</button></div></div>`;
    },
  );
}

export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function renderMarkdown(
  content: string,
  images: { src: string; alt?: string }[],
  figureClass = "my-6",
  addHeadingIds = false,
  imgClass = "w-full rounded-lg border border-border object-cover",
): string {
  let html = content;

  for (let i = 0; i < images.length; i++) {
    const re = new RegExp(`\\{image:${i + 1}\\}`, "g");
    const img = images[i];
    html = html.replace(
      re,
      `<figure class="${figureClass}"><img src="${img.src}" alt="${img.alt ?? ""}" class="${imgClass}" />${img.alt ? `<figcaption class="text-xs text-center italic text-muted mt-1.5">${img.alt}</figcaption>` : ""}</figure>`,
    );
  }

  const rendered = marked.parse(html) as string;

  if (!addHeadingIds) {
    return wrapCodeBlocks(rendered);
  }

  const withIds = rendered.replace(
    /<h([23])([^>]*)>(.*?)<\/h\1>/g,
    (_, level, attrs, content) => {
      const id = headingId(decodeEntities(content.replace(/<[^>]+>/g, "")));
      return `<h${level} id="${id}"${attrs}>${content}</h${level}>`;
    },
  );

  return wrapCodeBlocks(withIds);
}
