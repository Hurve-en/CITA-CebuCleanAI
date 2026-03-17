type RouteStop = { bin: string; etaMinutes: number; distanceKm: number; priority: 'normal' | 'urgent' };

export function RoutePanel({ stops }: { stops: RouteStop[] }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-400">Optimized collection route</p>
        <span className="text-xs text-emerald-300">VRP stub</span>
      </div>
      <ol className="space-y-2">
        {stops.map((s, i) => (
          <li key={s.bin} className="flex items-center gap-3">
            <div className="text-sm text-gray-500 w-6">{i + 1}.</div>
            <div className="flex-1">
              <p className="text-white">Bin {s.bin}</p>
              <p className="text-xs text-gray-500">
                ETA {s.etaMinutes} min · {s.distanceKm.toFixed(1)} km
              </p>
            </div>
            <span className={s.priority === 'urgent' ? 'text-amber-300 text-xs' : 'text-emerald-300 text-xs'}>
              {s.priority}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
