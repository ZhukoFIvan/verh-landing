// Простейший скользящий rate-limit в памяти процесса (pm2 fork, 1 инстанс).
// Для лендинга этого достаточно; при переезде на serverless заменить на KV.

const hits = new Map<string, number[]>();

/** true — запрос пропущен; false — лимит исчерпан. */
export function allow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);

  // не даём Map расти бесконечно
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.length || now - v[v.length - 1] > windowMs) hits.delete(k);
    }
  }
  return true;
}
