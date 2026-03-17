type HeatPoint = { lat: number; lng: number; intensity: number; label: string };

export function Heatmap({ points }: { points: HeatPoint[] }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-400">Illegal dumping / flood risk hotspots</p>
        <span className="text-xs text-gray-500">Live</span>
      </div>
      <div className="space-y-3">
        {points.map((p) => (
          <div key={p.label} className="flex items-center gap-3">
            <div
              className="w-2 h-10 rounded-full"
              style={{ background: `linear-gradient(180deg, #0f9b0f, rgba(255,0,0,${p.intensity}))` }}
            />
            <div className="flex-1">
              <p className="text-white">{p.label}</p>
              <p className="text-xs text-gray-500">
                {p.lat.toFixed(3)}, {p.lng.toFixed(3)}
              </p>
            </div>
            <span className="text-sm text-amber-300">{Math.round(p.intensity * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
