"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect, useRef, useState } from "react";
import { TextBIcon as Bold, TextItalicIcon as Italic, TextUnderlineIcon as UnderlineIcon, TextStrikethroughIcon as Strikethrough, TextHOneIcon as Heading1, TextHTwoIcon as Heading2, TextHThreeIcon as Heading3, ListIcon as List, ListNumbersIcon as ListOrdered, QuotesIcon as Quote, MinusIcon as Minus, TextAlignLeftIcon as AlignLeft, TextAlignCenterIcon as AlignCenter, TextAlignRightIcon as AlignRight, LinkSimpleIcon as Link2, ImageIcon as ImagePlus, ArrowUUpLeftIcon as Undo, ArrowUUpRightIcon as Redo, SparkleIcon as Sparkles, CaretDownIcon as ChevronDown, CircleNotchIcon as Loader2, ArrowUpIcon as ArrowUp, XIcon as X } from "@phosphor-icons/react";
import { adminFetch } from "@/lib/admin-fetch";

interface Props {
  value: string;
  onChange: (html: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  /** Optional context passed to the AI "write from a prompt" action. */
  articleTitle?: string;
  articleCategory?: string;
  /** Called with the AI's suggested fields after a successful "write from a prompt" generation. */
  onGenerated?: (fields: {
    title: string;
    excerpt: string;
    tags: string[];
    seoTitle: string;
    seoDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
  }) => void;
}

type AiAction = "continue" | "lengthen" | "refine" | "tone" | "generate";
type AiProvider = "anthropic" | "openai";
type AiContentType =
  | "engineering-essay"
  | "technical-deep-dive"
  | "architecture-system-design"
  | "product-engineering"
  | "tutorial"
  | "industry-analysis"
  | "case-study"
  | "opinion";

const TONES = ["Professional", "Casual", "Persuasive", "Technical", "Friendly"];

const CONTENT_TYPES: { value: AiContentType; label: string }[] = [
  { value: "engineering-essay", label: "Engineering Essay" },
  { value: "technical-deep-dive", label: "Technical Deep Dive" },
  { value: "architecture-system-design", label: "Architecture & System Design" },
  { value: "product-engineering", label: "Product Engineering" },
  { value: "tutorial", label: "Tutorial" },
  { value: "industry-analysis", label: "Industry Analysis" },
  { value: "case-study", label: "Case Study" },
  { value: "opinion", label: "Opinion" },
];

/** Plain text (with \n\n paragraph breaks) -> TipTap-insertable HTML. */
function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
    .join("");
}

/** Strips a ```html ... ``` fence if the model wrapped its HTML output in one. */
function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:html)?\n([\s\S]*?)\n```$/);
  return fenced ? fenced[1].trim() : trimmed;
}

const ToolBtn = ({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean;
  title: string; children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    disabled={disabled}
    title={title}
    className={`flex h-7 w-7 items-center justify-center transition-colors ${
      active
        ? "bg-foreground text-background"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    } disabled:opacity-30`}
  >
    {children}
  </button>
);

export function RichTextEditor({ value, onChange, onImageUpload, articleTitle, articleCategory, onGenerated }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const aiMenuRef = useRef<HTMLDivElement>(null);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [toneMenuOpen, setToneMenuOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [generateBrief, setGenerateBrief] = useState("");
  const [contentType, setContentType] = useState<AiContentType>(() =>
    (typeof window !== "undefined" && (localStorage.getItem("ai_content_type") as AiContentType)) || "engineering-essay"
  );
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState("");
  const [provider, setProvider] = useState<AiProvider>(() =>
    (typeof window !== "undefined" && (localStorage.getItem("ai_provider") as AiProvider)) || "anthropic"
  );

  function setAndPersistProvider(p: AiProvider) {
    setProvider(p);
    localStorage.setItem("ai_provider", p);
  }

  function setAndPersistContentType(c: AiContentType) {
    setContentType(c);
    localStorage.setItem("ai_content_type", c);
  }

  function closeAiMenu() {
    setAiMenuOpen(false);
    setToneMenuOpen(false);
  }

  function closeGenerateModal() {
    setGenerateOpen(false);
    setGenerateBrief("");
  }

  useEffect(() => {
    if (!aiMenuOpen) return;
    const onClickAway = (e: MouseEvent) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(e.target as Node)) {
        closeAiMenu();
      }
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [aiMenuOpen]);

  useEffect(() => {
    if (!generateOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !aiBusy) closeGenerateModal();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [generateOpen, aiBusy]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Typography,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#0a291a] underline" } }),
      Image.configure({ HTMLAttributes: { class: "max-w-full rounded-sm my-6" } }),
      Placeholder.configure({ placeholder: "Write your article here…" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-[420px] px-6 py-5 text-foreground text-base leading-relaxed focus:outline-none prose-custom",
      },
    },
  });

  // Sync external value changes (e.g. loading a saved post)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  function insertLink() {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function runAiAction(action: AiAction, tone?: string) {
    if (!editor) return;
    setAiMenuOpen(false);
    setToneMenuOpen(false);

    const { from, to, empty } = editor.state.selection;
    const selectedText = empty ? "" : editor.state.doc.textBetween(from, to, "\n\n");
    const fullText = editor.getText();

    if (action !== "continue" && !selectedText) {
      setAiError("Select some text first");
      setTimeout(() => setAiError(""), 2500);
      return;
    }

    const text = action === "continue" ? fullText : selectedText;
    if (!text.trim()) {
      setAiError("Write something first");
      setTimeout(() => setAiError(""), 2500);
      return;
    }

    setAiBusy(true);
    setAiError("");
    try {
      const res = await adminFetch("/api/admin/ai-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, provider, text, context: fullText, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "AI request failed");

      const html = textToHtml(data.result);
      if (action === "continue") {
        editor.chain().focus("end").insertContent(html).run();
      } else {
        editor.chain().focus().deleteRange({ from, to }).insertContentAt(from, html).run();
      }
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : "AI request failed");
      setTimeout(() => setAiError(""), 4000);
    } finally {
      setAiBusy(false);
    }
  }

  async function runGenerate() {
    if (!editor) return;
    const brief = generateBrief.trim();
    if (!brief) {
      setAiError("Describe what you want to write");
      setTimeout(() => setAiError(""), 2500);
      return;
    }

    setAiBusy(true);
    setAiError("");
    try {
      const res = await adminFetch("/api/admin/ai-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          provider,
          contentType,
          text: brief,
          title: articleTitle,
          category: articleCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "AI request failed");

      const html = stripCodeFence(data.body ?? "");
      editor.chain().focus("end").insertContent(html).run();
      if (data.title || data.excerpt) {
        onGenerated?.({
          title: data.title ?? "",
          excerpt: data.excerpt ?? "",
          tags: data.tags ?? [],
          seoTitle: data.seoTitle ?? "",
          seoDescription: data.seoDescription ?? "",
          primaryKeyword: data.primaryKeyword ?? "",
          secondaryKeywords: data.secondaryKeywords ?? [],
        });
      }
      closeGenerateModal();
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : "AI request failed");
      setTimeout(() => setAiError(""), 4000);
    } finally {
      setAiBusy(false);
    }
  }

  async function handleImageFile(file: File) {
    try {
      const url = await onImageUpload(file);
      editor!.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch {
      alert("Image upload failed");
    }
  }

  return (
    <div className="border border-border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-3 py-2">
        {/* History */}
        <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-3.5 w-3.5" />
        </ToolBtn>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Headings */}
        <ToolBtn title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-3.5 w-3.5" />
        </ToolBtn>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Inline marks */}
        <ToolBtn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolBtn>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Lists */}
        <ToolBtn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-3.5 w-3.5" />
        </ToolBtn>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Alignment */}
        <ToolBtn title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="h-3.5 w-3.5" />
        </ToolBtn>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Link & Image */}
        <ToolBtn title="Insert link" active={editor.isActive("link")} onClick={insertLink}>
          <Link2 className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Insert image" onClick={() => fileRef.current?.click()}>
          <ImagePlus className="h-3.5 w-3.5" />
        </ToolBtn>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageFile(file);
            e.target.value = "";
          }}
        />

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* AI writing tools */}
        <div className="relative" ref={aiMenuRef}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { setAiMenuOpen((o) => !o); setToneMenuOpen(false); }}
            disabled={aiBusy}
            title="AI writing tools"
            className="flex h-7 items-center gap-1 px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            {aiBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider">AI</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {aiMenuOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 w-64 border border-border bg-background shadow-lg">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setAiMenuOpen(false); setGenerateOpen(true); }}
                className="block w-full px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-muted"
              >
                Write from a prompt…
              </button>

              <div className="my-1 border-t border-border" />

              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runAiAction("continue")} className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted">
                Continue writing
              </button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runAiAction("lengthen")} className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted">
                Make longer <span className="text-muted-foreground/60">(selection)</span>
              </button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runAiAction("refine")} className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted">
                Refine <span className="text-muted-foreground/60">(selection)</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setToneMenuOpen((o) => !o)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-foreground hover:bg-muted"
                >
                  <span>Change tone <span className="text-muted-foreground/60">(selection)</span></span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {toneMenuOpen && (
                  <div className="absolute left-full top-0 z-20 w-40 border border-border bg-background shadow-lg">
                    {TONES.map((t) => (
                      <button key={t} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runAiAction("tone", t)} className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted">
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border px-3 py-2">
                <p className="mb-1.5 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Provider</p>
                <div className="flex gap-1">
                  {(["anthropic", "openai"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setAndPersistProvider(p)}
                      className={`px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-wider transition-colors ${
                        provider === p ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p === "anthropic" ? "Claude" : "OpenAI"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {aiError && !generateOpen && (
            <p className="absolute left-0 top-full mt-1 w-52 bg-red-500 px-2 py-1 text-[0.65rem] text-white">{aiError}</p>
          )}
        </div>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Write-from-a-prompt modal */}
      {generateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget && !aiBusy) closeGenerateModal(); }}
        >
          <div className="relative w-full max-w-xl rounded-3xl border border-border bg-background p-6 shadow-2xl">
            <button
              type="button"
              onClick={closeGenerateModal}
              disabled={aiBusy}
              aria-label="Close"
              className="absolute right-5 top-5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">AI</p>
            <h3 className="mb-5 text-lg font-bold text-foreground">Write an article</h3>

            <textarea
              autoFocus
              rows={4}
              value={generateBrief}
              onChange={(e) => setGenerateBrief(e.target.value)}
              disabled={aiBusy}
              placeholder='Give a topic — e.g. "PostgreSQL vs MySQL for modern SaaS applications"'
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); runGenerate(); }
              }}
            />

            <div className="mt-4">
              <p className="mb-1.5 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Editorial angle</p>
              <div className="flex flex-wrap gap-1">
                {CONTENT_TYPES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setAndPersistContentType(c.value)}
                    className={`rounded-full px-2.5 py-1 text-[0.6rem] font-semibold transition-colors ${
                      contentType === c.value ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-1">
                {(["anthropic", "openai"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAndPersistProvider(p)}
                    className={`rounded-full px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-wider transition-colors ${
                      provider === p ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p === "anthropic" ? "Claude" : "OpenAI"}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={runGenerate}
                disabled={aiBusy || !generateBrief.trim()}
                aria-label="Generate article"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-30"
              >
                {aiBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
              </button>
            </div>

            {aiError && (
              <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-wider text-red-500">{aiError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
