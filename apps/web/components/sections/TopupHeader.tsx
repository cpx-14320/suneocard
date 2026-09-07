import { type QuickTopupGame } from "@/lib/data";

// 快速儲值頁頂部：遊戲 icon 置左 + 名稱／發行商／評分／信任小標（不使用橫幅主視覺）
export default function TopupHeader({ game }: { game: QuickTopupGame }) {
  return (
    <section className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:gap-5 sm:p-6">
      <img
        src={game.cover}
        alt={`${game.name} 圖示`}
        className="size-20 shrink-0 rounded-2xl border border-gray-200 object-cover sm:size-28"
      />

      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-bold text-gray-900 sm:text-2xl">
          {game.name}
        </h1>
        <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
          {game.publisher}
        </p>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
          <svg viewBox="0 0 20 20" className="size-3.5 fill-amber-400" aria-hidden>
            <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6z" />
          </svg>
          <span className="font-semibold text-gray-900">
            {game.rating.toFixed(1)}
          </span>
          <span>（{game.ratingCount.toLocaleString()} 則評價）</span>
        </div>

        <p className="mt-1.5 hidden text-sm leading-relaxed text-gray-500 line-clamp-2 sm:block">
          {game.blurb}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {game.highlights.map((h) => (
            <span
              key={h}
              className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600 sm:text-xs"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
