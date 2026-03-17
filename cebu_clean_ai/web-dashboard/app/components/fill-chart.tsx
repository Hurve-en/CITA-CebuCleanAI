type Bin = { code: string; barangay: string; fillLevel: number; status: string };

export function FillChart({ bins }: { bins: Bin[] }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-sm text-gray-400 mb-3">Fill-level by smart bin</p>
      <div className="space-y-2">
        {bins.map((b) => (
          <div key={b.code} className="w-full">
            <div className="flex justify-between text-xs text-gray-400">
              <span>
                {b.code} · {b.barangay}
              </span>
              <span className={b.fillLevel > 85 ? 'text-amber-300' : 'text-emerald-300'}>
                {b.fillLevel.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-800 mt-1">
              <div
                className="h-2 rounded-full"
                style={{ width: `${Math.min(b.fillLevel, 100)}%`, background: b.fillLevel > 85 ? '#f59e0b' : '#10b981' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
