"use client";

"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Clipboard,
  Download,
  Eye,
  FileText,
  Info,
  PenLine,
} from "lucide-react";
import Markdown from "@/components/Markdown";

function today(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** 由标题自动生成 ASCII slug */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function yamlString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

function FormField({ label, required, children }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#c6cae8]">
        {label}
        {required && <span className="ml-0.5 text-[var(--theme-accent)]">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-[#eef0ff] outline-none transition-colors placeholder:text-[#6f7595] focus:border-[var(--theme-primary)]";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState(today);
  const [author, setAuthor] = useState("严正易");
  const [read, setRead] = useState("");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);
  const [showFile, setShowFile] = useState(false);

  const tagList = useMemo(
    () =>
      tags
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean),
    [tags]
  );

  const markdown = useMemo(() => {
    const fm = [
      "---",
      `title: "${yamlString(title)}"`,
      `date: "${date}"`,
      `author: "${yamlString(author)}"`,
      `tags: [${tagList.map((t) => `"${yamlString(t)}"`).join(", ")}]`,
      read ? `read: "${yamlString(read)}"` : "",
      excerpt ? `excerpt: "${yamlString(excerpt)}"` : "",
      "---",
      "",
      body,
    ]
      .filter((line) => line !== null)
      .join("\n");
    return fm;
  }, [title, date, author, read, tagList, excerpt, body]);

  const fileName = slug || slugify(title) || "untitled";

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 忽略 */
    }
  };

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(v));
    }
  };

  return (
    <div className="space-y-6">
      {/* 使用说明 */}
      <section className="glass-card p-6">
        <h1 className="section-title">写文章</h1>
        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-[0.92rem] leading-relaxed text-[rgba(240,240,255,0.75)]">
          <Info size={18} className="mt-0.5 shrink-0 text-[var(--theme-accent)]" />
          <div>
            填写内容后点击「下载 .md 文件」或「复制」，将生成的文件放入仓库的
            <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-[#ffb8d4]">
              content/posts/
            </code>
            目录，commit 并 push 到 <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-[#ffb8d4]">main</code>{" "}
            分支，GitHub Actions 会自动构建并部署。
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6 xl:flex-row">
        {/* 编辑区 */}
        <section className="glass-card flex-1 p-6">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-[#eef0ff]">
            <PenLine size={18} className="text-[var(--theme-accent)]" />
            编辑
          </h2>
          <div className="space-y-4">
            <FormField label="标题" required>
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="文章标题"
                className={inputCls}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="文件名 / slug" required>
                <input
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="my-first-post"
                  className={`${inputCls} font-mono`}
                />
              </FormField>
              <FormField label="日期">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputCls}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="作者">
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className={inputCls}
                />
              </FormField>
              <FormField label="阅读时长">
                <input
                  value={read}
                  onChange={(e) => setRead(e.target.value)}
                  placeholder="如：5 分钟"
                  className={inputCls}
                />
              </FormField>
            </div>

            <FormField label="标签（逗号分隔）">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="前端, JavaScript, 技术思考"
                className={inputCls}
              />
            </FormField>

            <FormField label="摘要">
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="文章摘要，显示在列表页"
                className={`${inputCls} resize-y`}
              />
            </FormField>

            <FormField label="正文（支持 Markdown / LaTeX / 代码高亮）" required>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={16}
                placeholder={"# 标题\n\n支持 **加粗**、$E=mc^2$、\n\n```js\nconsole.log('hi')\n```\n"}
                className={`${inputCls} resize-y font-mono text-[0.88rem] leading-relaxed`}
              />
            </FormField>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={handleDownload} className="neon-btn">
              <Download size={16} />
              下载 .md 文件
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-[#c6cae8] transition-all hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
            >
              <Clipboard size={16} />
              {copied ? "已复制" : "复制全文"}
            </button>
            <button
              onClick={() => setShowFile((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-[#c6cae8] transition-all hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
            >
              <FileText size={16} />
              {showFile ? "隐藏文件内容" : "查看生成的文件"}
            </button>
          </div>

          {showFile && (
            <pre className="mt-5 max-h-80 overflow-auto rounded-xl border border-white/10 bg-[#0b0d1f] p-4 font-mono text-[0.82rem] leading-relaxed text-[#c6cae8]">
              {markdown}
            </pre>
          )}
        </section>

        {/* 实时预览 */}
        <section className="glass-card w-full p-6 xl:w-[46%] xl:max-w-xl">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-[#eef0ff]">
            <Eye size={18} className="text-[var(--theme-accent)]" />
            实时预览
          </h2>
          {body.trim() ? (
            <Markdown content={body} />
          ) : (
            <p className="py-10 text-center text-sm text-[#6f7595]">在左侧输入正文后，这里会实时渲染 Markdown 效果。</p>
          )}
        </section>
      </div>
    </div>
  );
}
