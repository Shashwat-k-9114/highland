/**
 * One-off helper: downloads the original Pexels footage (free commercial licence) and re-encodes it
 * into light, web-optimised H.264 files in /public/videos (self-hosted = no third-party requests,
 * 3-10x smaller than the originals).
 *
 *   FFMPEG=/path/to/ffmpeg(.exe) WORK=/some/empty/dir node scripts/optimise-videos.mjs
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const WORK = resolve(process.env.WORK || './.video-src');
const OUT = resolve('public/videos');
mkdirSync(WORK, { recursive: true });
mkdirSync(OUT, { recursive: true });

const P = 'https://videos.pexels.com/video-files/';
// name, url, scale filter, seconds, crf
const JOBS = [
  ['hero1', P + '8397996/8397996-hd_1920_1080_25fps.mp4', 'scale=1280:-2', 12, 28],
  ['hero2', P + '8359173/8359173-hd_1920_1080_25fps.mp4', 'scale=1280:-2', 12, 28],
  ['hero3', P + '34753592/14732736_1920_1080_30fps.mp4', 'scale=1280:-2', 12, 28],
  ['hero-m1', P + '33730467/14322174_1440_2560_24fps.mp4', 'scale=720:-2', 10, 29],
  ['hero-m2', P + '29773587/12793948_1440_2560_60fps.mp4', 'scale=720:-2', 10, 29],
  ['comp0', P + '9788683/9788683-hd_1920_1080_30fps.mp4', 'scale=960:-2', 8, 30],
  ['comp1', P + '30899668/13211432_2560_1440_60fps.mp4', 'scale=960:-2', 8, 30],
  ['comp3', P + '857151/857151-hd_1920_746_30fps.mp4', 'scale=960:-2', 8, 30],
  ['comp4', P + '39596352/16878339_1080_1920_60fps.mp4', 'scale=640:-2', 8, 30],
  ['band', P + '30654242/13118741_2560_1440_30fps.mp4', 'scale=1280:-2', 12, 29],
];

for (const [name, url, scale, secs, crf] of JOBS) {
  const src = join(WORK, name + '-src.mp4');
  const out = join(OUT, name + '.mp4');
  if (existsSync(out)) { console.log('skip', name); continue; }
  if (!existsSync(src)) {
    console.log('download', name);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    writeFileSync(src, Buffer.from(await res.arrayBuffer()));
  }
  console.log('encode', name);
  const r = spawnSync(FFMPEG, [
    '-y', '-i', src, '-t', String(secs), '-an',
    '-vf', `${scale},fps=24,format=yuv420p`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-profile:v', 'high', '-movflags', '+faststart',
    out,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg failed for ${name}`);
  console.log(name, (statSync(out).size / 1048576).toFixed(2) + ' MB');
}
console.log('done');
