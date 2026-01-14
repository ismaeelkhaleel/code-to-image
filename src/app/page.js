"use client";

import { useState, useRef } from "react";
import { Download, Copy, Check } from "lucide-react";
import html2canvas from "html2canvas";

const THEMES = {
  vscode: {
    bg: "#020617",
    keyword: "#c084fc",
    type: "#7dd3fc",
    method: "#67e8f9",
    string: "#fcd34d",
    comment: "#64748b",
    number: "#fb7185",
    text: "#e5e7eb",
  },
  dracula: {
    bg: "#282a36",
    keyword: "#ff79c6",
    type: "#8be9fd",
    method: "#50fa7b",
    string: "#f1fa8c",
    comment: "#6272a4",
    number: "#bd93f9",
    text: "#f8f8f2",
  },
  monokai: {
    bg: "#272822",
    keyword: "#f92672",
    type: "#66d9ef",
    method: "#a6e22e",
    string: "#e6db74",
    comment: "#75715e",
    number: "#ae81ff",
    text: "#f8f8f2",
  },
};

const LANG_KEYWORDS = {
  java: /\b(class|public|private|protected|static|final|void|int|char|return|if|else|for|while|new)\b/g,
  javascript: /\b(function|return|if|else|for|while|const|let|var|new)\b/g,
  python: /\b(def|return|if|else|elif|for|while|class|import)\b/g,
};

export default function CodeScreenshot() {
  const [code, setCode] = useState(`class Solution {
  public int add(int a, int b) {
    return a + b;
  }
}`);
  const [theme, setTheme] = useState("vscode");
  const [language, setLanguage] = useState("java");
  const [filename, setFilename] = useState("Solution.java");
  const [windowStyle, setWindowStyle] = useState("mac");
  const [copied, setCopied] = useState(false);

  const cardRef = useRef(null);
  const colors = THEMES[theme];

  /* ---------- HIGHLIGHTER ---------- */

  const highlightCode = (code) => {
    const escape = (s) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let h = escape(code);

    h = h.replace(
      /(\/\/.*$)/gm,
      `<span style="color:${colors.comment}">$1</span>`
    );
    h = h.replace(
      /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
      `<span style="color:${colors.string}">$&</span>`
    );
    h = h.replace(
      LANG_KEYWORDS[language],
      `<span style="color:${colors.keyword}">$&</span>`
    );
    h = h.replace(
      /\b([A-Z][a-zA-Z0-9_]*)\b/g,
      `<span style="color:${colors.type}">$&</span>`
    );
    h = h.replace(
      /\b([a-zA-Z_]\w*)(?=\()/g,
      `<span style="color:${colors.method}">$1</span>`
    );
    h = h.replace(/\b\d+\b/g, `<span style="color:${colors.number}">$&</span>`);

    return h;
  };

  /* ---------- IMAGE ---------- */

  const downloadImage = async () => {
    const radius = 18;
    const scale = 2;

    const sourceCanvas = await html2canvas(cardRef.current, {
      scale,
      backgroundColor: colors.bg,
    });

    const w = sourceCanvas.width;
    const h = sourceCanvas.height;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    // Rounded rectangle clip
    ctx.beginPath();
    ctx.moveTo(radius * scale, 0);
    ctx.lineTo(w - radius * scale, 0);
    ctx.quadraticCurveTo(w, 0, w, radius * scale);
    ctx.lineTo(w, h - radius * scale);
    ctx.quadraticCurveTo(w, h, w - radius * scale, h);
    ctx.lineTo(radius * scale, h);
    ctx.quadraticCurveTo(0, h, 0, h - radius * scale);
    ctx.lineTo(0, radius * scale);
    ctx.quadraticCurveTo(0, 0, radius * scale, 0);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(sourceCanvas, 0, 0);

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center gap-6 text-white">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap">
        <select
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-800 p-2 rounded"
        >
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>

        <select
          onChange={(e) => setTheme(e.target.value)}
          className="bg-slate-800 p-2 rounded"
        >
          <option value="vscode">VS Code Dark</option>
          <option value="dracula">Dracula</option>
          <option value="monokai">Monokai</option>
        </select>

        <select
          onChange={(e) => setWindowStyle(e.target.value)}
          className="bg-slate-800 p-2 rounded"
        >
          <option value="mac">macOS</option>
          <option value="windows">Windows</option>
        </select>

        <input
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="bg-slate-800 p-2 rounded"
          placeholder="Filename"
        />
      </div>

      {/* Code Input */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full max-w-2xl h-52 bg-slate-800 p-4 font-mono rounded"
      />

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={copyCode}
          className="bg-slate-700 px-4 py-2 rounded flex gap-2 cursor-pointer"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={downloadImage}
          className="bg-blue-600 px-4 py-2 rounded flex gap-2 cursor-pointer"
        >
          <Download size={16} />
          Download
        </button>
      </div>

      {/* CARD */}
      <div
        ref={cardRef}
        style={{
          width: "640px",
          background: colors.bg,
          borderRadius: "18px",
          padding: "26px",
          fontFamily: "Fira Code, monospace",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            {windowStyle === "mac" ? (
              <>
                <span
                  style={{
                    background: "#ff5f56",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    background: "#ffbd2e",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    background: "#27c93f",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                  }}
                />
              </>
            ) : (
              <>
                <span
                  style={{ background: "#94a3b8", width: 12, height: 12 }}
                />
                <span
                  style={{ background: "#94a3b8", width: 12, height: 12 }}
                />
                <span
                  style={{ background: "#ef4444", width: 12, height: 12 }}
                />
              </>
            )}
          </div>
          <span
            style={{
              marginLeft: "auto",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {filename}
          </span>
        </div>
        <div
          style={{
            height: "1px",
            background: "rgba(255, 255, 255, 0.69)",
            marginBottom: "14px",
          }}
        />
        {/* Code */}
        <pre style={{ margin: 0, color: colors.text, lineHeight: "1.7" }}>
          <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
        </pre>
      </div>
    </div>
  );
}
