# -*- coding: utf-8 -*-
"""
一次性脚本：从原神 BWIKI(ys) 拉取全部角色实装日期/版本，
合并到 src/data/genshin/characters.ts（在每条角色行追加 rel/ver 字段）。

用法：python scripts/fetch-genshin-versions.py
依赖：仅 Python 标准库
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) roster-fetch/1.0"}
API = "https://wiki.biligame.com/ys/api.php"
DATA = ROOT / "src" / "data" / "genshin" / "characters.ts"
RELEASE_CUTOFF = date.today() + timedelta(days=7)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def fetch_url(url: str, retries: int = 4) -> bytes:
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = resp.read()
            time.sleep(0.4)
            return data
        except Exception as e:
            last_err = e
            wait = 2 * (attempt + 1)
            print(f"  [重试 {attempt + 1}/{retries}] {e}，{wait}s 后重试")
            time.sleep(wait)
    raise last_err


def parse_date(s: str):
    m = re.match(r"(\d{4})年(\d{2})月(\d{2})日", s or "")
    return date(int(m.group(1)), int(m.group(2)), int(m.group(3))) if m else None


# 1) SMW 全量拉取角色实装数据（页面名 → {rel, ver}）
query = "[[分类:角色]]|?实装日期|?实装版本|limit=500"
url = API + "?" + urllib.parse.urlencode({"action": "ask", "query": query, "format": "json"})
data = json.loads(fetch_url(url).decode("utf-8"))
wiki: dict[str, dict] = {}
for page, obj in data["query"]["results"].items():
    p = obj["printouts"]
    rel = parse_date((p.get("实装日期") or [""])[0])
    ver = (p.get("实装版本") or [""])[0]
    if rel is None or rel > RELEASE_CUTOFF:
        continue  # 未实装 / 一周内将实装，跳过（与其他游戏口径一致）
    wiki[page] = {"rel": rel.isoformat(), "ver": ver}
print(f"BWIKI 有效角色 {len(wiki)} 名")

# 名称差异手工映射（项目名 → BWIKI 页面名）
NAME_FIX = {
    "旅行者": "旅行者",
}

# 2) 读 TS 文件，逐条匹配并追加字段
text = DATA.read_text(encoding="utf-8")
if "rel:" in text:
    print("characters.ts 已包含 rel 字段，先回退再重跑")
    sys.exit(1)

rows = re.findall(r'\{ id: "([^"]+)", name: "([^"]+)", element: "([^"]+)", rarity: (\d), weapon: "([^"]+)", region: "([^"]+)", apiId: ("[^"]*"|null) \},', text)
print(f"项目角色 {len(rows)} 条")
missing, nover = [], []
count = 0


def repl(m):
    global count
    whole, name = m.group(0), m.group(1)
    page = NAME_FIX.get(name, name)
    info = wiki.get(page)
    if info is None:
        missing.append(name)
        return whole
    if not info["ver"]:
        nover.append(name)
    count += 1
    return whole[:-2] + f', rel: "{info["rel"]}", ver: "{info["ver"]}" }},'


new_text = re.sub(
    r'\{ id: "[^"]+", name: "([^"]+)", element: "[^"]+", rarity: \d, weapon: "[^"]+", region: "[^"]+", apiId: ("[^"]*"|null) \},',
    repl,
    text,
)

print(f"已合并 {count} 条；未匹配：{missing or '无'}；缺版本号：{nover or '无'}")
if missing:
    print("存在未匹配角色，未写回文件，请先处理 NAME_FIX")
    sys.exit(1)

# 3) 更新文件头注释说明
new_text = new_text.replace(
    " * 原神角色数据（截至 7.1 版本全部实装可玩角色，不含旅行者多元素变体与派蒙）",
    " * 原神角色数据（截至 7.2 版本全部实装可玩角色，不含旅行者多元素变体与派蒙）\n"
    " * rel/ver（实装日期/版本）由 scripts/fetch-genshin-versions.py 从 BWIKI 拉取合并，\n"
    " * 新增角色后重跑该脚本补全字段",
)

DATA.write_text(new_text, encoding="utf-8", newline="\n")
print(f"已写回 {DATA}")
