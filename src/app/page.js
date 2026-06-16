"use client";

import { useState, useRef } from "react";
import { Download, Copy, Check } from "lucide-react";
import { toPng } from "html-to-image";

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
    glow: "rgba(192, 132, 252, 0.4)",
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
    glow: "rgba(255, 121, 198, 0.4)",
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
    glow: "rgba(249, 38, 114, 0.4)",
  },
};

const LANG_KEYWORDS = {
  java: /\b(class|public|private|protected|static|final|void|int|char|return|if|else|for|while|new)\b/g,
  javascript: /\b(function|return|if|else|for|while|const|let|var|new|async|await|import|export|from|default)\b/g,
  python: /\b(def|return|if|else|elif|for|while|class|import|from|as|with|try|except|finally)\b/g,
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
  const [width, setWidth] = useState(800);

  const cardRef = useRef(null);
  const colors = THEMES[theme];

  const highlightCode = (code) => {
    const escape = (s) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let h = escape(code);

    h = h.replace(
      /(\/\/.*$)/gm,
      `<span style="color:${colors.comment}">$1</span>`,
    );
    h = h.replace(
      /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
      `<span style="color:${colors.string}">$&</span>`,
    );
    h = h.replace(
      LANG_KEYWORDS[language],
      `<span style="color:${colors.keyword}">$&</span>`,
    );
    h = h.replace(
      /\b([A-Z][a-zA-Z0-9_]*)\b/g,
      `<span style="color:${colors.type}">$&</span>`,
    );
    h = h.replace(
      /\b([a-zA-Z_]\w*)(?=\()/g,
      `<span style="color:${colors.method}">$1</span>`,
    );
    h = h.replace(/\b\d+\b/g, `<span style="color:${colors.number}">$&</span>`);

    return h;
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        skipAutoScale: true,
        cacheBust: true,
        backgroundColor: "transparent",
      });

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center gap-6 text-white">
      <div className="flex gap-4 flex-wrap bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
        <select
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-700 p-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>

        <select
          onChange={(e) => setTheme(e.target.value)}
          className="bg-slate-700 p-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="vscode">VS Code Dark</option>
          <option value="dracula">Dracula</option>
          <option value="monokai">Monokai</option>
        </select>

        <select
          onChange={(e) => setWindowStyle(e.target.value)}
          className="bg-slate-700 p-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="mac">macOS</option>
          <option value="windows">Windows</option>
        </select>

        <input
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="bg-slate-700 p-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Filename"
        />
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full max-w-3xl h-52 bg-slate-800 p-4 font-mono rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-3 items-center">
        <button
          onClick={copyCode}
          className="bg-slate-700 hover:bg-slate-600 transition-colors px-4 py-2 rounded-lg flex gap-2 items-center"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={downloadImage}
          className="bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded-lg flex gap-2 items-center"
        >
          <Download size={16} />
          Download Image
        </button>
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg">
          <input
            type="range"
            min="500"
            max="1200"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-40"
          />
          <span className="text-sm font-mono">{width}px</span>
        </div>
      </div>

      <div
        ref={cardRef}
        style={{
          background: "transparent",
          padding: "45px",
          width: `${width}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >

        <div
          style={{
            width: "100%",
            background: colors.bg,
            borderRadius: "16px",
            padding: "24px 32px",
            fontFamily: "Fira Code, monospace",
            overflow: "hidden",
            position: "relative",
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px ${colors.glow}, 0 0 50px ${colors.glow}`,
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              {windowStyle === "mac" ? (
                <>
                  <span style={{ background: "#ff5f56", width: 13, height: 13, borderRadius: "50%", boxShadow: "0 0 10px rgba(255, 95, 86, 0.3)" }} />
                  <span style={{ background: "#ffbd2e", width: 13, height: 13, borderRadius: "50%", boxShadow: "0 0 10px rgba(255, 189, 46, 0.3)" }} />
                  <span style={{ background: "#27c93f", width: 13, height: 13, borderRadius: "50%", boxShadow: "0 0 10px rgba(39, 201, 63, 0.3)" }} />
                </>
              ) : (
                <>
                  <span style={{ background: "#94a3b8", width: 13, height: 13, borderRadius: "2px" }} />
                  <span style={{ background: "#94a3b8", width: 13, height: 13, borderRadius: "2px" }} />
                  <span style={{ background: "#ef4444", width: 13, height: 13, borderRadius: "2px" }} />
                </>
              )}
            </div>

            <span
              style={{
                marginLeft: "auto",
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "12px",
                fontWeight: "500",
                letterSpacing: "0.5px",
                fontFamily: "Inter, sans-serif"
              }}
            >
              {filename}
            </span>
          </div>

          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 50%, transparent)",
              marginBottom: "24px",
            }}
          />

          <pre style={{ margin: 0, color: colors.text, lineHeight: "1.8", fontSize: "16px", textShadow: "0 0 20px rgba(255,255,255,0.05)" }}>
            <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
          </pre>
        </div>
      </div>
    </div>
  );
}
