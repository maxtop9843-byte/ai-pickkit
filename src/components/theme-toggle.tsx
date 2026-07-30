"use client";

import { useEffect, useState } from "react";

type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "pickkit-theme";
const preferences: ThemePreference[] = ["system", "light", "dark"];
const labels: Record<ThemePreference, string> = {
  system: "시스템",
  light: "라이트",
  dark: "다크",
};

function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  const resolved =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;

  root.dataset.theme = resolved;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolved;
}

export default function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial = preferences.includes(stored as ThemePreference)
      ? (stored as ThemePreference)
      : "system";
    setPreference(initial);
    applyTheme(initial);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if ((window.localStorage.getItem(STORAGE_KEY) ?? "system") === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  function selectTheme(next: ThemePreference) {
    setPreference(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <div className="theme-control" role="group" aria-label="화면 테마">
      {preferences.map((option) => (
        <button
          type="button"
          key={option}
          className="theme-control-option"
          aria-pressed={preference === option}
          onClick={() => selectTheme(option)}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}
