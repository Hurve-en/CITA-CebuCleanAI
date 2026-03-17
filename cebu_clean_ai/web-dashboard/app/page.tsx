'use client';

import useSWR from 'swr';
import { Activity, BatteryCharging, MapPin, Waves } from 'lucide-react';

import { API_BASE, fetcher } from '../lib/api';
import { StatCard } from './components/stat-card';
import { Heatmap } from './components/heatmap';
import { FillChart } from './components/fill-chart';
import { RoutePanel } from './components/route-panel';

const fallbackBins = [
  { code: 'CB-101', barangay: 'Lahug', fillLevel: 76, status: 'online' },
  { code: 'CB-204', barangay: 'Carbon', fillLevel: 92, status: 'alert' },
];

const fallbackHeatmap = [
  { lat: 10.296, lng: 123.902, intensity: 0.9, label: 'Carbon Market' },
  { lat: 10.332, lng: 123.897, intensity: 0.6, label: 'Lahug' },
];

export default function DashboardPage() {
  const { data: bins } = useSWR(`${API_BASE}/bins`, fetcher, { fallbackData: fallbackBins });
  const { data: heat } = useSWR(`${API_BASE}/analytics/heatmap`, fetcher, { fallbackData: fallbackHeatmap });
  const { data: sdg } = useSWR(`${API_BASE}/analytics/sdg11`, fetcher, {
    fallbackData: { diversionRate: 0.34, collectionOnTime: 0.88, illegalDumpSites: 12, floodingAlerts: 2 },
  });

  const stops = (bins ?? fallbackBins).map((b, i) => ({
    bin: b.code,
    etaMinutes: 6 + i * 4,
    distanceKm: 1.2 + i * 0.6,
    priority: (b.fillLevel > 85 ? 'urgent' : 'normal') as const,
  }));

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-emerald-300">SmartBin Cebu</p>
          <h1 className="text-3xl font-semibold text-white">Urban Resilience Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time fill-levels, hotspots, and SDG 11 impact.</p>
        </div>
        <div className="hidden md:flex gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Activity size={14} /> Live
          </span>
          <span className="flex items-center gap-1">
            <Waves size={14} /> Flood watch
          </span>
          <span className="flex items-center gap-1">
            <BatteryCharging size={14} /> IoT
          </span>
        </div>
      </header>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Diversion rate" value={`${Math.round((sdg?.diversionRate ?? 0) * 100)}%`} change="+4% vs last month" icon={<Activity className="text-emerald-300" />} />
        <StatCard label="On-time collection" value={`${Math.round((sdg?.collectionOnTime ?? 0) * 100)}%`} change="+2%" />
        <StatCard label="Illegal dumps" value={`${sdg?.illegalDumpSites ?? 12}`} change="-1 this week" />
        <StatCard label="Flood alerts" value={`${sdg?.floodingAlerts ?? 2}`} change="stable" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <Heatmap points={heat ?? fallbackHeatmap} />
          <FillChart bins={bins ?? fallbackBins} />
        </div>
        <div className="space-y-4">
          <RoutePanel stops={stops} />
          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-gray-400 mb-2">Bin locations</p>
            <div className="space-y-2">
              {(bins ?? fallbackBins).map((b) => (
                <div key={b.code} className="flex items-center gap-2 text-sm text-gray-200">
                  <MapPin size={16} className="text-emerald-300" /> {b.code} · {b.barangay}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
