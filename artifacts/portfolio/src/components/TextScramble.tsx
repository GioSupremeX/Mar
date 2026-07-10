import { useEffect, useState, useRef, useCallback } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function TextScramble({
  text,
  className = "",
  speed = 30,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    if (!text) return;
    let iteration = 0;
    const maxIterations = text.length * 3;
    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (iteration > i * 3) return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      iteration++;
      if (iteration >= maxIterations) {
        stop();
        setDisplay(text);
      }
    }, speed);
  }, [text, speed, stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <span
      className={`inline-block ${className}`}
      onMouseEnter={start}
      onMouseLeave={() => {
        stop();
        setDisplay(text);
      }}
      style={{ fontFamily: "monospace" }}
    >
      {display}
    </span>
  );
}
