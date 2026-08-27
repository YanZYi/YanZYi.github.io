"use client";

import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";

import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.css";

/** 从 React 节点树中提取纯文本（用于复制代码） */
function nodeToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return nodeToText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/** 带复制按钮的代码块 */
function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const text = nodeToText(children);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 剪贴板不可用时静默失败 */
    }
  };

  return (
    <div className="group relative">
      <pre>{children}</pre>
      <button
        onClick={copy}
        className="code-copy-btn opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="复制代码"
      >
        {copied ? <Check size={13} className="inline" /> : <Copy size={13} className="inline" />}
        {copied ? " 已复制" : " 复制"}
      </button>
    </div>
  );
}

interface MarkdownProps {
  content: string;
}

/**
 * Markdown 渲染组件
 * - GFM（表格、任务列表、删除线、脚注）
 * - LaTeX 数学公式（$...$ / $$...$$）
 * - 代码语法高亮 + 一键复制
 */
export default function Markdown({ content }: MarkdownProps) {
  return (
    <div className="md-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeKatex, { throwOnError: false }],
          rehypeHighlight,
        ]}
        components={{
          pre({ children }) {
            return <CodeBlock>{children}</CodeBlock>;
          },
          a({ node, href, children, ...props }) {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                {...props}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer noopener" : undefined}
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table>{children}</table>
              </div>
            );
          },
          img({ node, src, alt, ...props }) {
            return <img src={src} alt={alt} loading="lazy" {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
