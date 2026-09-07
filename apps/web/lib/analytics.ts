// 全站唯一的 analytics 進出口。
// 換追蹤碼 → 改 .env.local 的 NEXT_PUBLIC_GA_ID，這個檔與所有頁面都不用動。
// 要埋自訂事件 → 從這裡 import trackEvent，不要在元件裡直接呼叫 gtag。

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4 Measurement ID；未設定時為空字串 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** 有填追蹤碼才啟用 GA（開發 / 預覽環境留空就整段不載入） */
export const gaEnabled = GA_ID.length > 0;

/** 送一次瀏覽頁面事件（SPA 換頁時由 <Analytics /> 呼叫） */
export function pageview(url: string) {
  if (!gaEnabled || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", { page_path: url });
}

/** 送自訂事件，例：trackEvent("begin_checkout", { value: 330 }) */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!gaEnabled || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
