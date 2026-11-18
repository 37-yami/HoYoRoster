import { describe, expect, it } from "vitest";

import { deriveVersions, filterBySnapshot, verRank } from "./version";

describe("verRank 版本号数值化", () => {
  it("小版本按数字而非字符串比较：7.10 晚于 7.2", () => {
    expect(verRank("7.10")).toBeGreaterThan(verRank("7.2"));
  });

  it("大版本跨越：4.7 晚于 3.3，5.0 晚于 4.7", () => {
    expect(verRank("4.7")).toBeGreaterThan(verRank("3.3"));
    expect(verRank("5.0")).toBeGreaterThan(verRank("4.7"));
  });

  it("同版本相等", () => {
    expect(verRank("1.0")).toBe(verRank("1.0"));
  });

  it("1.0 是最早", () => {
    expect(verRank("1.0")).toBeLessThan(verRank("1.1"));
    expect(verRank("1.0")).toBeLessThan(verRank("2.0"));
  });
});

describe("deriveVersions 从角色推导版本时间线", () => {
  const chars = [
    { id: "c", rel: "2026-11-11", ver: "4.7" },
    { id: "b", rel: "2026-09-28", ver: "4.6" },
    { id: "a", rel: "2023-04-26", ver: "1.0" },
    { id: "d", rel: "2026-10-15", ver: "4.6" }, // 同版本更晚实装（下半）
    { id: "e", rel: "2023-05-10", ver: "1.0" }, // 1.0 下半
  ];

  it("每版本取最早实装日期（=版本开启日），按版本升序", () => {
    expect(deriveVersions(chars)).toEqual([
      { ver: "1.0", date: "2023-04-26" },
      { ver: "4.6", date: "2026-09-28" },
      { ver: "4.7", date: "2026-11-11" },
    ]);
  });

  it("空列表返回空数组", () => {
    expect(deriveVersions([])).toEqual([]);
  });
});

describe("filterBySnapshot 版本快照过滤", () => {
  const chars = [
    { id: "a", ver: "1.0" },
    { id: "b", ver: "4.6" },
    { id: "c", ver: "4.7" },
    { id: "d", ver: "7.10" },
    { id: "e", ver: "7.2" },
  ];

  it("『all』返回全部角色", () => {
    expect(filterBySnapshot(chars, "all")).toHaveLength(5);
  });

  it("选 4.6 时包含 4.6 及之前实装的角色，不含之后的", () => {
    expect(filterBySnapshot(chars, "4.6").map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("选 7.2 时 7.10 的角色被排除（数字比较而非字符串）", () => {
    expect(filterBySnapshot(chars, "7.2").map((c) => c.id)).toEqual(["a", "b", "c", "e"]);
  });

  it("选 1.0 只含初始角色", () => {
    expect(filterBySnapshot(chars, "1.0").map((c) => c.id)).toEqual(["a"]);
  });
});
