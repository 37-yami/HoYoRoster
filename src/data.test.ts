import { describe, expect, it } from "vitest";

import { GAME_REGISTRY } from "./config/games";
import { GAME_KEYS } from "./config/games";
import { filterBySnapshot, verRank } from "./utils/version";

/**
 * 数据不变式校验：不写死角色数量（数据随版本增长），
 * 只校验版本快照功能依赖的结构性约束。
 */
describe("三游戏角色数据满足版本快照不变式", () => {
  for (const key of GAME_KEYS) {
    const config = GAME_REGISTRY[key];

    it(`${key}：所有角色的 ver 非空且为 X.Y 格式，rel 为 ISO 日期`, () => {
      for (const c of config.characters) {
        expect(c.ver, `${key}/${c.name} ver`).toMatch(/^\d+\.\d+$/);
        expect(c.rel, `${key}/${c.name} rel`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it(`${key}：版本时间线升序，首版本为 1.0，且包含全部角色`, () => {
      const versions = config.versions;
      expect(versions.length).toBeGreaterThan(0);
      expect(versions[0].ver).toBe("1.0");
      for (let i = 1; i < versions.length; i++) {
        expect(verRank(versions[i].ver)).toBeGreaterThan(verRank(versions[i - 1].ver));
      }
      // 快照选最新版本 = 全部角色
      const latest = versions[versions.length - 1].ver;
      expect(filterBySnapshot(config.characters, latest)).toHaveLength(config.characters.length);
    });

    it(`${key}：选 1.0 快照至少包含初始角色`, () => {
      expect(filterBySnapshot(config.characters, "1.0").length).toBeGreaterThan(0);
    });

    it(`${key}：版本开启日与角色实装日一致（推导自该版本最早实装角色）`, () => {
      const byVer = new Map(config.versions.map((v) => [v.ver, v.date]));
      for (const c of config.characters) {
        const openDate = byVer.get(c.ver)!;
        // 角色实装日不早于该版本开启日
        expect(c.rel >= openDate, `${key}/${c.name} ${c.rel} < 版本开启日 ${openDate}`).toBe(true);
      }
    });
  }
});
