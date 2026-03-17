export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error('Failed to fetch ' + url);
  return (await res.json()) as T;
}

export const API_BASE = process.env.NEXT_PUBLIC_API ?? 'http://localhost:3001/api';
