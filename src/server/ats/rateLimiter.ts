interface RateLimitRecord {
  timestamps: number[];
}

const userScansMap = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SCANS_PER_HOUR = 10;

export function checkRateLimit(userIdOrKey: string | number): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
} {
  const key = String(userIdOrKey || "default_user");
  const now = Date.now();

  let record = userScansMap.get(key);
  if (!record) {
    record = { timestamps: [] };
    userScansMap.set(key, record);
  }

  // Filter out timestamps older than 1 hour
  record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (record.timestamps.length >= MAX_SCANS_PER_HOUR) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      limit: MAX_SCANS_PER_HOUR,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Allow scan and record timestamp
  record.timestamps.push(now);
  const remaining = MAX_SCANS_PER_HOUR - record.timestamps.length;

  return {
    allowed: true,
    limit: MAX_SCANS_PER_HOUR,
    remaining,
    resetSeconds: Math.ceil(WINDOW_MS / 1000),
  };
}
