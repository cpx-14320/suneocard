"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  /** 電腦 / 平板（sm 以上）用，16:9 橫式 */
  imageWide?: string;
  /** 手機（sm 以下）用，9:16 直式 */
  imageTall?: string;
  href?: string;
  alt?: string;
  /** localStorage key：不同頁面 / 不同檔期的彈窗用不同 key 才能各自記憶「今日不再顯示」 */
  storageKey?: string;
};

const DEFAULTS = {
  imageWide: "https://picsum.photos/seed/suneocard-promo-wide/1600/900",
  imageTall: "https://picsum.photos/seed/suneocard-promo-tall/900/1600",
  href: "/topup-event",
  alt: "限時活動公告",
  storageKey: "suneocard-promo-popup",
};

/** 蓋台開啟後自動關閉的秒數 */
const AUTO_CLOSE_SECONDS = 10;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function PromoPopup({
  imageWide = DEFAULTS.imageWide,
  imageTall = DEFAULTS.imageTall,
  href = DEFAULTS.href,
  alt = DEFAULTS.alt,
  storageKey = DEFAULTS.storageKey,
}: Props) {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_CLOSE_SECONDS);

  // 進站時檢查：當天按過「今日不再顯示」就不跳
  useEffect(() => {
    let dismissed = "";
    try {
      dismissed = window.localStorage.getItem(storageKey) ?? "";
    } catch {
      dismissed = "";
    }
    if (dismissed === today()) return;
    // 用 setTimeout 延後一拍，避免在 effect body 內同步 setState
    const id = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(id);
  }, [storageKey]);

  // 開啟後每秒倒數，歸零就自動關閉（歸零時延後一拍再 setOpen，避免在 effect body 內同步 setState）
  useEffect(() => {
    if (!open) return;
    if (secondsLeft <= 0) {
      const id = window.setTimeout(() => setOpen(false), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setSecondsLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [open, secondsLeft]);

  // 開啟時鎖捲動 + Esc 關閉
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const dismissToday = () => {
    try {
      window.localStorage.setItem(storageKey, today());
    } catch {
      /* localStorage 不可用時就略過 */
    }
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      {/* 背景遮罩：點擊關閉 */}
      <button
        type="button"
        aria-label="關閉"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative w-full max-w-[19rem] sm:max-w-2xl">
        <Link
          href={href}
          onClick={() => setOpen(false)}
          className="block overflow-hidden rounded-2xl shadow-2xl"
        >
          {/* sm 以上載入 16:9 橫圖，sm 以下用 img 的 9:16 直圖 */}
          <picture>
            <source media="(min-width: 640px)" srcSet={imageWide} />
            <img
              src={imageTall}
              alt={alt}
              className="block aspect-[9/16] w-full object-cover sm:aspect-video"
            />
          </picture>
        </Link>

        {/* 關閉鈕 */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="關閉"
          className="absolute -right-3 -top-3 grid size-9 place-items-center rounded-full bg-white text-gray-700 shadow-lg transition hover:bg-gray-100"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="mt-3 flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={dismissToday}
            className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-gray-600 shadow transition hover:bg-white"
          >
            今日不再顯示
          </button>
          {secondsLeft > 0 && (
            <p className="text-xs text-white/80">
              {secondsLeft} 秒後自動關閉
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
