"use client";

import { useState, useCallback, useRef, useMemo, memo } from "react";
import { run } from "@/lib/language";
import hljs from "highlight.js";

hljs.registerLanguage("spark", function (hljs) {
  const KEYWORDS = {
    keyword: "val func when else return say not",
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
        begin: /[+\-*/%=!<>]=?|\.\.|&&|\|\|/,
      },
      {
        className: "punctuation",
        begin: /[{}()\[\],;]/,
      },
    ],
  };
});

const DEFAULT_CODE = `// --- variables & reassignment ---
val greeting = "hello"
val name = "world"
say(greeting + " " + name)

val x = 10
x = x + 5
say("x after += 5:", x)

// --- arithmetic ---
say("10 + 3 =", 10 + 3)
say("10 - 3 =", 10 - 3)
say("10 * 3 =", 10 * 3)
say("10 / 3 =", 10 / 3)
say("10 % 3 =", 10 % 3)

// --- comparisons ---
say("10 == 10:", 10 == 10)
say("10 != 10:", 10 != 10)
say("10 < 3:", 10 < 3)
say("10 > 3:", 10 > 3)
say("10 <= 10:", 10 <= 10)
say("10 >= 11:", 10 >= 11)

// --- booleans & not ---
say("not yes:", not yes)
say("not no:", not no)
say("not 0:", not 0)
say("not 1:", not 1)
val empty_arr = []
say("not []:", not empty_arr)
say("not [1]:", not [1])

// --- nil ---
val n = nil
say("nil value:", n)
say("nil is falsy:", not n)

// --- conditionals ---
val score = 85
when (score >= 90) {
  say("grade: A")
} else when (score >= 80) {
  say("grade: B")
} else {
  say("grade: C")
}

// --- arrays & indexing ---
val nums = [10, 20, 30, 40, 50]
say("nums[0]:", nums[0])
say("nums[4]:", nums[4])
say("before set nums[2]", nums)
nums[2] = 99
say("after set nums[2] = 99:", nums)

// --- range operator ---
val r = 1..5
say("1..5:", r)

// --- functions & recursion ---
func factorial(n) {
  when (n <= 1) {
    return 1
  }
  return n * factorial(n - 1)
}
say("factorial(6):", factorial(6))

func fibonacci(n) {
  when (n <= 1) {
    return n
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}
say("fib(10):", fibonacci(10))
`;

function highlightSpark(code: string): string {
  const lang = hljs.getLanguage("spark") ? "spark" : "plaintext";
  return hljs.highlight(code, { language: lang }).value;
}

const LineNumbers = memo(function LineNumbers({ code }: { code: string }) {
  const nums = useMemo(() => {
    const n = code.split("\n").length;
    const arr = new Array(n);
    for (let i = 0; i < n; i++) arr[i] = i + 1;
    return arr;
  }, [code]);
  return (
    <div
      className="select-none text-right text-[13px] font-mono leading-relaxed text-muted/25 pt-4 pl-4 pr-3 border-r border-white/10 flex flex-col items-end"
      aria-hidden="true"
    >
      {nums.map((n) => (
        <div key={n}>{n}</div>
      ))}
    </div>
  );
});

export function LanguageRunner() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ran, setRan] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const highlighted = useMemo(() => highlightSpark(code), [code]);

  const handleRun = useCallback(() => {
    setError(null);
    setRan(true);
    const result = run(code);
    setOutput(result.output);
    if (result.error) setError(result.error);
    setTimeout(
      () => outputRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
      50,
    );
  }, [code]);

  const handleClear = useCallback(() => {
    setOutput([]);
    setError(null);
    setRan(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleRun();
      }
    },
    [handleRun],
  );

  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      const ta = textareaRef.current;
      preRef.current.style.transform = `translate(-${ta.scrollLeft}px, -${ta.scrollTop}px)`;
    }
  }, []);

  return (
    <div className="border border-border rounded-lg overflow-hidden my-8 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1613] border-b border-border">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-red-500/60" />
          <span className="size-2.5 rounded-full bg-yellow-500/60" />
          <span className="size-2.5 rounded-full bg-green-500/60" />
          <span className="text-[11px] text-muted uppercase tracking-wider font-medium ml-2">
            Spark Playground
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="text-[11px] px-2.5 py-1 rounded text-muted hover:text-secondary transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleRun}
            className="text-[11px] px-3 py-1 rounded bg-accent text-bg-primary font-medium hover:bg-accent-light transition-colors"
          >
            Run
            <span className="ml-1.5 text-[10px] opacity-60">⌘⏎</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row max-h-[70vh]">
        <div className="flex flex-1 min-h-0 bg-[#0f0c0a] group/editor overflow-hidden">
          <LineNumbers code={code} />
          <div className="relative flex-1">
            <div
              ref={highlightRef}
              className="absolute inset-0 overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              <pre ref={preRef} className="m-0 bg-transparent text-[13px] font-mono leading-relaxed whitespace-pre pt-4 pl-3 pr-4">
                <code
                  className="hljs bg-transparent! p-0!"
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              </pre>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              className="relative w-full h-full bg-transparent text-[13px] font-mono leading-relaxed whitespace-pre resize-none outline-none text-transparent caret-white pt-4 pr-4 pl-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/5 [&::-webkit-scrollbar-thumb]:hover:bg-white/10"
              spellCheck={false}
              placeholder="Write your code here..."
            />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#0f0c0a] to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="w-px bg-border/20" />

        <div
          className="w-full md:w-80 shrink-0 bg-[#0f0c0a] flex flex-col"
          ref={outputRef}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20 shrink-0">
            <span className="text-[11px] text-muted uppercase tracking-wider font-medium">
              Output
            </span>
            {ran && (
              <span className="text-[10px] text-muted/40 tabular-nums">
                {output.length} line{output.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex-1 p-4 font-mono text-[13px] leading-relaxed overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/5 [&::-webkit-scrollbar-thumb]:hover:bg-white/10">
            {!ran && (
              <span className="text-muted/40 text-[12px]">
                Press Run or ⌘⏎ to execute
              </span>
            )}
            {ran && output.length === 0 && !error && (
              <span className="text-muted/40 text-[12px]">No output</span>
            )}
            {output.map((line, i) => (
              <div
                key={i}
                className="text-primary/90 whitespace-pre-wrap py-px"
              >
                {line}
              </div>
            ))}
            {error && (
              <div className="text-red-400 mt-2 whitespace-pre-wrap font-mono text-[12px] leading-relaxed border-l-2 border-red-400/30 pl-3">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
