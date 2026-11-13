import 'server-only';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Tiny key-value layer with two backends:
 *  - Redis over REST (Upstash / Vercel KV marketplace integration): durable, for production.
 *  - JSON file in ./.data: zero-config, for local development and self-hosted Node servers.
 * Only hashes and sets are needed (leads, analytics counters, unique visitors).
 */
export interface Store {
  kind: 'redis' | 'file';
  durable: boolean;
  hset(key: string, field: string, value: string): Promise<void>;
  hget(key: string, field: string): Promise<string | null>;
  hdel(key: string, ...fields: string[]): Promise<void>;
  hgetall(key: string): Promise<Record<string, string>>;
  hgetallMany(keys: string[]): Promise<Record<string, string>[]>;
  hincr(key: string, field: string, by?: number): Promise<void>;
  hincrMany(key: string, fields: Record<string, number>): Promise<void>;
  sadd(key: string, member: string): Promise<boolean>;
  scardMany(keys: string[]): Promise<number[]>;
}

/* ───────────── Redis REST ───────────── */
function redisStore(url: string, token: string): Store {
  const call = async (cmd: (string | number)[]) => {
    const r = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd), cache: 'no-store' });
    const j = (await r.json()) as { result?: unknown; error?: string };
    if (!r.ok || j.error) throw new Error(j.error || `redis ${r.status}`);
    return j.result;
  };
  const pipeline = async (cmds: (string | number)[][]) => {
    if (!cmds.length) return [];
    const r = await fetch(url.replace(/\/$/, '') + '/pipeline', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds), cache: 'no-store' });
    const j = (await r.json()) as { result?: unknown; error?: string }[];
    if (!r.ok) throw new Error(`redis pipeline ${r.status}`);
    return j.map((x) => { if (x.error) throw new Error(x.error); return x.result; });
  };
  const toObj = (flat: unknown): Record<string, string> => {
    const o: Record<string, string> = {};
    if (Array.isArray(flat)) for (let i = 0; i < flat.length; i += 2) o[String(flat[i])] = String(flat[i + 1]);
    return o;
  };
  return {
    kind: 'redis', durable: true,
    async hset(k, f, v) { await call(['HSET', k, f, v]); },
    async hget(k, f) { const r = await call(['HGET', k, f]); return r == null ? null : String(r); },
    async hdel(k, ...f) { if (f.length) await call(['HDEL', k, ...f]); },
    async hgetall(k) { return toObj(await call(['HGETALL', k])); },
    async hgetallMany(keys) { return (await pipeline(keys.map((k) => ['HGETALL', k]))).map(toObj); },
    async hincr(k, f, by = 1) { await call(['HINCRBY', k, f, by]); },
    async hincrMany(k, fields) { await pipeline(Object.entries(fields).map(([f, n]) => ['HINCRBY', k, f, n])); },
    async sadd(k, m) { return Number(await call(['SADD', k, m])) === 1; },
    async scardMany(keys) { return (await pipeline(keys.map((k) => ['SCARD', k]))).map(Number); },
  };
}

/* ───────────── JSON file ───────────── */
type Db = { h: Record<string, Record<string, string>>; s: Record<string, string[]> };

function fileStore(): Store {
  let dir = join(process.cwd(), '.data');
  let durable = true;
  try { mkdirSync(dir, { recursive: true }); } catch { dir = join(tmpdir(), 'highland-data'); durable = false; try { mkdirSync(dir, { recursive: true }); } catch { /* ignore */ } }
  if (process.env.VERCEL) durable = false; // serverless filesystems are ephemeral
  const file = join(dir, 'store.json');
  let db: Db = { h: {}, s: {} };
  try { if (existsSync(file)) db = JSON.parse(readFileSync(file, 'utf8')); } catch { /* start fresh */ }
  let timer: ReturnType<typeof setTimeout> | null = null;
  const flush = () => { timer = null; try { const tmp = file + '.tmp'; writeFileSync(tmp, JSON.stringify(db)); renameSync(tmp, file); } catch { /* read-only fs */ } };
  const save = (now = false) => { if (now) { if (timer) clearTimeout(timer); flush(); } else if (!timer) timer = setTimeout(flush, 400); };
  const H = (k: string) => (db.h[k] ||= {});
  return {
    kind: 'file', durable,
    async hset(k, f, v) { H(k)[f] = v; save(true); },
    async hget(k, f) { return db.h[k]?.[f] ?? null; },
    async hdel(k, ...f) { for (const x of f) delete db.h[k]?.[x]; save(true); },
    async hgetall(k) { return { ...(db.h[k] || {}) }; },
    async hgetallMany(keys) { return keys.map((k) => ({ ...(db.h[k] || {}) })); },
    async hincr(k, f, by = 1) { const h = H(k); h[f] = String((parseInt(h[f] || '0', 10) || 0) + by); save(); },
    async hincrMany(k, fields) { const h = H(k); for (const [f, n] of Object.entries(fields)) h[f] = String((parseInt(h[f] || '0', 10) || 0) + n); save(); },
    async sadd(k, m) { const s = (db.s[k] ||= []); if (s.includes(m)) return false; s.push(m); save(); return true; },
    async scardMany(keys) { return keys.map((k) => db.s[k]?.length || 0); },
  };
}

const g = globalThis as unknown as { __hcStore?: Store };
export function getStore(): Store {
  if (g.__hcStore) return g.__hcStore;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  g.__hcStore = url && token ? redisStore(url, token) : fileStore();
  return g.__hcStore;
}
