/**
 * 版本快照相关纯函数：版本号比较、版本时间线推导、快照过滤。
 *
 * 三游戏版本号均为 "X.Y" 形式；快照语义为「该版本结束前已实装」（含所选版本实装的角色）。
 */

/** 参与版本推导/快照过滤的最小角色形状 */
export interface VersionedCharacter {
  /** 实装日期（ISO，仅用于推导版本开启日） */
  rel: string;
  /** 实装版本号，如 "7.2" */
  ver: string;
}

/** 版本时间线条目：ver + 该版本开启日（= 此版本首个上半角色的实装日） */
export interface VersionInfo {
  ver: string;
  date: string;
}

/** 版本号数值化排序键（"7.10" → 70010 > "7.2" → 70002），非法格式返回 -1 排最前 */
export function verRank(ver: string): number {
  const m = /^(\d+)\.(\d+)$/.exec(ver.trim());
  if (!m) return -1;
  return Number(m[1]) * 10000 + Number(m[2]);
}

/**
 * 从角色列表推导版本时间线：每个版本取最早实装日期作为版本开启日
 * （国服惯例上半卡池随版本开启同步实装），按版本号升序返回。
 */
export function deriveVersions<T extends VersionedCharacter>(chars: T[]): VersionInfo[] {
  const byVer = new Map<string, string>();
  for (const c of chars) {
    if (!c.ver) continue;
    const prev = byVer.get(c.ver);
    if (prev === undefined || c.rel < prev) byVer.set(c.ver, c.rel);
  }
  return [...byVer.entries()]
    .sort((a, b) => verRank(a[0]) - verRank(b[0]))
    .map(([ver, date]) => ({ ver, date }));
}

/**
 * 版本快照过滤：返回实装版本 ≤ snapshotVer 的角色；
 * snapshotVer 为 "all" 时返回全部。
 */
export function filterBySnapshot<T extends { ver: string }>(
  chars: T[],
  snapshotVer: string | "all",
): T[] {
  if (snapshotVer === "all") return chars;
  const limit = verRank(snapshotVer);
  return chars.filter((c) => verRank(c.ver) <= limit);
}
