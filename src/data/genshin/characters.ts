import type { Character } from "../../types.genshin";

/**
 * 离线头像：import.meta.glob 加载 src/portraits/genshin/*.webp。
 * 单文件模式（vite build --mode single）下 assetsInlineLimit 极大，全部内联为 base64 data URI；
 * 网页模式下为独立资源 URL，配合 <img loading="lazy"> 按需加载。
 *
 * 文件名约定：src/portraits/genshin/{character.id}.webp
 */
const PORTRAIT_MODULES = import.meta.glob("../../portraits/genshin/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const LOCAL_PORTRAITS: Record<string, string> = {};
for (const [path, url] of Object.entries(PORTRAIT_MODULES)) {
  // path 形如 '../../portraits/genshin/venti.webp' → 提取 'venti'
  const id = path.split("/").pop()!.replace(/\.webp$/, "");
  LOCAL_PORTRAITS[id] = url;
}

/**
 * 原神角色数据（截至 7.2 版本全部实装可玩角色，不含旅行者多元素变体与派蒙）
 * rel/ver（实装日期/版本）由 scripts/fetch-genshin-versions.py 从 BWIKI 拉取合并，
 * 新增角色后重跑该脚本补全字段
 *
 * 头像来源（apiId 字段，仅作为下载脚本的历史参考，运行时不再使用远程 URL）：
 *  - "xxx"        → genshin.jmp.blue（4.x 及之前实装角色 + 旅行者）
 *  - "enka:Name"  → enka.network（5.x~7.x 较新角色）
 *  - "bwiki:Name" → patchwiki.biligame.com（enka/jmp.blue 均未收录的角色）
 *
 * 离线模式：所有头像已下载到 src/portraits/ 并在构建时内联为 base64 打包进单文件 HTML
 */
export const CHARACTERS: Character[] = [
  // ============ 蒙德 ============
  { id: "venti", name: "温迪", element: "anemo", rarity: 5, weapon: "bow", region: "蒙德", apiId: "venti" , rel: "2020-09-28", ver: "1.0" },
  { id: "jean", name: "琴", element: "anemo", rarity: 5, weapon: "sword", region: "蒙德", apiId: "jean" , rel: "2020-09-15", ver: "1.0" },
  { id: "mona", name: "莫娜", element: "hydro", rarity: 5, weapon: "catalyst", region: "蒙德", apiId: "mona" , rel: "2020-09-15", ver: "1.0" },
  { id: "klee", name: "可莉", element: "pyro", rarity: 5, weapon: "catalyst", region: "蒙德", apiId: "klee" , rel: "2020-10-20", ver: "1.0" },
  { id: "albedo", name: "阿贝多", element: "geo", rarity: 5, weapon: "sword", region: "蒙德", apiId: "albedo" , rel: "2020-12-23", ver: "1.2" },
  { id: "eula", name: "优菈", element: "cryo", rarity: 5, weapon: "claymore", region: "蒙德", apiId: "eula" , rel: "2021-05-18", ver: "1.5" },
  { id: "diluc", name: "迪卢克", element: "pyro", rarity: 5, weapon: "claymore", region: "蒙德", apiId: "diluc" , rel: "2020-09-15", ver: "1.0" },
  { id: "durin", name: "杜林", element: "pyro", rarity: 5, weapon: "sword", region: "蒙德", apiId: "enka:Durin" , rel: "2025-12-03", ver: "6.2" },
  { id: "varka", name: "法尔伽", element: "anemo", rarity: 5, weapon: "claymore", region: "蒙德", apiId: "enka:Varka" , rel: "2026-02-25", ver: "6.4" },
  { id: "lohen", name: "洛恩", element: "cryo", rarity: 5, weapon: "polearm", region: "蒙德", apiId: "enka:Lohen" , rel: "2026-06-09", ver: "6.6" },
  { id: "traveler", name: "旅行者", element: "anemo", rarity: 5, weapon: "sword", region: "蒙德", apiId: "traveler-anemo" , rel: "2020-09-15", ver: "1.0" },
  { id: "amber", name: "安柏", element: "pyro", rarity: 4, weapon: "bow", region: "蒙德", apiId: "amber" , rel: "2020-09-15", ver: "1.0" },
  { id: "kaeya", name: "凯亚", element: "cryo", rarity: 4, weapon: "sword", region: "蒙德", apiId: "kaeya" , rel: "2020-09-15", ver: "1.0" },
  { id: "lisa", name: "丽莎", element: "electro", rarity: 4, weapon: "catalyst", region: "蒙德", apiId: "lisa" , rel: "2020-09-15", ver: "1.0" },
  { id: "barbara", name: "芭芭拉", element: "hydro", rarity: 4, weapon: "catalyst", region: "蒙德", apiId: "barbara" , rel: "2020-09-15", ver: "1.0" },
  { id: "razor", name: "雷泽", element: "electro", rarity: 4, weapon: "claymore", region: "蒙德", apiId: "razor" , rel: "2020-09-15", ver: "1.0" },
  { id: "bennett", name: "班尼特", element: "pyro", rarity: 4, weapon: "sword", region: "蒙德", apiId: "bennett" , rel: "2020-09-15", ver: "1.0" },
  { id: "noelle", name: "诺艾尔", element: "geo", rarity: 4, weapon: "claymore", region: "蒙德", apiId: "noelle" , rel: "2020-09-15", ver: "1.0" },
  { id: "sucrose", name: "砂糖", element: "anemo", rarity: 4, weapon: "catalyst", region: "蒙德", apiId: "sucrose" , rel: "2020-09-15", ver: "1.0" },
  { id: "fischl", name: "菲谢尔", element: "electro", rarity: 4, weapon: "bow", region: "蒙德", apiId: "fischl" , rel: "2020-09-15", ver: "1.0" },
  { id: "diona", name: "迪奥娜", element: "cryo", rarity: 4, weapon: "bow", region: "蒙德", apiId: "diona" , rel: "2020-11-11", ver: "1.1" },
  { id: "rosaria", name: "罗莎莉亚", element: "cryo", rarity: 4, weapon: "polearm", region: "蒙德", apiId: "rosaria" , rel: "2021-04-06", ver: "1.4" },
  { id: "mika", name: "米卡", element: "cryo", rarity: 4, weapon: "polearm", region: "蒙德", apiId: "mika" , rel: "2023-03-21", ver: "3.5" },
  { id: "dahlia", name: "塔利雅", element: "hydro", rarity: 4, weapon: "sword", region: "蒙德", apiId: "enka:Dahlia" , rel: "2025-06-18", ver: "5.7" },
  { id: "prune", name: "布伦妮", element: "anemo", rarity: 4, weapon: "catalyst", region: "蒙德", apiId: "enka:Prune" , rel: "2026-05-20", ver: "6.6" },

  // ============ 璃月 ============
  { id: "zhongli", name: "钟离", element: "geo", rarity: 5, weapon: "polearm", region: "璃月", apiId: "zhongli" , rel: "2020-12-01", ver: "1.1" },
  { id: "xiao", name: "魈", element: "anemo", rarity: 5, weapon: "polearm", region: "璃月", apiId: "xiao" , rel: "2021-02-03", ver: "1.3" },
  { id: "ganyu", name: "甘雨", element: "cryo", rarity: 5, weapon: "bow", region: "璃月", apiId: "ganyu" , rel: "2021-01-12", ver: "1.2" },
  { id: "hutao", name: "胡桃", element: "pyro", rarity: 5, weapon: "polearm", region: "璃月", apiId: "hu-tao" , rel: "2021-03-02", ver: "1.3" },
  { id: "keqing", name: "刻晴", element: "electro", rarity: 5, weapon: "sword", region: "璃月", apiId: "keqing" , rel: "2020-09-15", ver: "1.0" },
  { id: "qiqi", name: "七七", element: "cryo", rarity: 5, weapon: "sword", region: "璃月", apiId: "qiqi" , rel: "2020-09-15", ver: "1.0" },
  { id: "baizhu", name: "白术", element: "dendro", rarity: 5, weapon: "catalyst", region: "璃月", apiId: "baizhu" , rel: "2023-05-02", ver: "3.6" },
  { id: "shenhe", name: "申鹤", element: "cryo", rarity: 5, weapon: "polearm", region: "璃月", apiId: "shenhe" , rel: "2022-01-05", ver: "2.4" },
  { id: "yelan", name: "夜兰", element: "hydro", rarity: 5, weapon: "bow", region: "璃月", apiId: "yelan" , rel: "2022-05-31", ver: "2.7" },
  { id: "xianyun", name: "闲云", element: "anemo", rarity: 5, weapon: "catalyst", region: "璃月", apiId: "xianyun" , rel: "2024-01-31", ver: "4.4" },
  { id: "ningguang", name: "凝光", element: "geo", rarity: 4, weapon: "catalyst", region: "璃月", apiId: "ningguang" , rel: "2020-09-15", ver: "1.0" },
  { id: "xiangling", name: "香菱", element: "pyro", rarity: 4, weapon: "polearm", region: "璃月", apiId: "xiangling" , rel: "2020-09-15", ver: "1.0" },
  { id: "xingqiu", name: "行秋", element: "hydro", rarity: 4, weapon: "sword", region: "璃月", apiId: "xingqiu" , rel: "2020-09-15", ver: "1.0" },
  { id: "beidou", name: "北斗", element: "electro", rarity: 4, weapon: "claymore", region: "璃月", apiId: "beidou" , rel: "2020-09-15", ver: "1.0" },
  { id: "chongyun", name: "重云", element: "cryo", rarity: 4, weapon: "claymore", region: "璃月", apiId: "chongyun" , rel: "2020-09-15", ver: "1.0" },
  { id: "xinyan", name: "辛焱", element: "pyro", rarity: 4, weapon: "claymore", region: "璃月", apiId: "xinyan" , rel: "2020-12-01", ver: "1.1" },
  { id: "yanfei", name: "烟绯", element: "pyro", rarity: 4, weapon: "catalyst", region: "璃月", apiId: "yanfei" , rel: "2021-04-28", ver: "1.5" },
  { id: "yunjin", name: "云堇", element: "geo", rarity: 4, weapon: "polearm", region: "璃月", apiId: "yun-jin" , rel: "2022-01-05", ver: "2.4" },
  { id: "yaoyao", name: "瑶瑶", element: "dendro", rarity: 4, weapon: "polearm", region: "璃月", apiId: "yaoyao" , rel: "2023-01-18", ver: "3.4" },
  { id: "gaming", name: "嘉明", element: "pyro", rarity: 4, weapon: "claymore", region: "璃月", apiId: "gaming" , rel: "2024-01-31", ver: "4.4" },
  { id: "lanyan", name: "蓝砚", element: "anemo", rarity: 4, weapon: "catalyst", region: "璃月", apiId: "enka:Lanyan" , rel: "2025-01-21", ver: "5.3" },
  { id: "zibai", name: "兹白", element: "geo", rarity: 5, weapon: "sword", region: "璃月", apiId: "enka:Zibai" , rel: "2026-02-03", ver: "6.3" },

  // ============ 稻妻 ============
  { id: "raiden", name: "雷电将军", element: "electro", rarity: 5, weapon: "polearm", region: "稻妻", apiId: "raiden" , rel: "2021-09-01", ver: "2.1" },
  { id: "ayaka", name: "神里绫华", element: "cryo", rarity: 5, weapon: "sword", region: "稻妻", apiId: "ayaka" , rel: "2021-07-21", ver: "2.0" },
  { id: "kazuha", name: "枫原万叶", element: "anemo", rarity: 5, weapon: "sword", region: "稻妻", apiId: "kazuha" , rel: "2021-06-29", ver: "1.6" },
  { id: "yoimiya", name: "宵宫", element: "pyro", rarity: 5, weapon: "bow", region: "稻妻", apiId: "yoimiya" , rel: "2021-08-10", ver: "2.0" },
  { id: "kokomi", name: "珊瑚宫心海", element: "hydro", rarity: 5, weapon: "catalyst", region: "稻妻", apiId: "kokomi" , rel: "2021-09-21", ver: "2.1" },
  { id: "itto", name: "荒泷一斗", element: "geo", rarity: 5, weapon: "claymore", region: "稻妻", apiId: "arataki-itto" , rel: "2021-12-14", ver: "2.3" },
  { id: "yaemiko", name: "八重神子", element: "electro", rarity: 5, weapon: "catalyst", region: "稻妻", apiId: "yae-miko" , rel: "2022-02-16", ver: "2.5" },
  { id: "ayato", name: "神里绫人", element: "hydro", rarity: 5, weapon: "sword", region: "稻妻", apiId: "ayato" , rel: "2022-03-30", ver: "2.6" },
  { id: "sayu", name: "早柚", element: "anemo", rarity: 4, weapon: "claymore", region: "稻妻", apiId: "sayu" , rel: "2021-08-10", ver: "2.0" },
  { id: "sara", name: "九条裟罗", element: "electro", rarity: 4, weapon: "bow", region: "稻妻", apiId: "sara" , rel: "2021-09-01", ver: "2.1" },
  { id: "gorou", name: "五郎", element: "geo", rarity: 4, weapon: "bow", region: "稻妻", apiId: "gorou" , rel: "2021-12-14", ver: "2.3" },
  { id: "thoma", name: "托马", element: "pyro", rarity: 4, weapon: "polearm", region: "稻妻", apiId: "thoma" , rel: "2021-11-02", ver: "2.2" },
  { id: "heizou", name: "鹿野院平藏", element: "anemo", rarity: 4, weapon: "catalyst", region: "稻妻", apiId: "shikanoin-heizou" , rel: "2022-07-13", ver: "2.8" },
  { id: "shinobu", name: "久岐忍", element: "electro", rarity: 4, weapon: "sword", region: "稻妻", apiId: "kuki-shinobu" , rel: "2022-06-21", ver: "2.7" },
  { id: "kirara", name: "绮良良", element: "dendro", rarity: 4, weapon: "sword", region: "稻妻", apiId: "kirara" , rel: "2023-05-24", ver: "3.7" },
  { id: "mizuki", name: "梦见月瑞希", element: "anemo", rarity: 5, weapon: "catalyst", region: "稻妻", apiId: "enka:Mizuki" , rel: "2025-02-12", ver: "5.4" },
  { id: "chiori", name: "千织", element: "geo", rarity: 5, weapon: "sword", region: "稻妻", apiId: "chiori" , rel: "2024-03-13", ver: "4.5" },

  // ============ 须弥 ============
  { id: "nahida", name: "纳西妲", element: "dendro", rarity: 5, weapon: "catalyst", region: "须弥", apiId: "nahida" , rel: "2022-11-02", ver: "3.2" },
  { id: "tighnari", name: "提纳里", element: "dendro", rarity: 5, weapon: "bow", region: "须弥", apiId: "tighnari" , rel: "2022-08-24", ver: "3.0" },
  { id: "cyno", name: "赛诺", element: "electro", rarity: 5, weapon: "polearm", region: "须弥", apiId: "cyno" , rel: "2022-09-28", ver: "3.1" },
  { id: "nilou", name: "妮露", element: "hydro", rarity: 5, weapon: "sword", region: "须弥", apiId: "nilou" , rel: "2022-10-14", ver: "3.1" },
  { id: "wanderer", name: "流浪者", element: "anemo", rarity: 5, weapon: "catalyst", region: "须弥", apiId: "wanderer" , rel: "2022-12-07", ver: "3.3" },
  { id: "alhaitham", name: "艾尔海森", element: "dendro", rarity: 5, weapon: "sword", region: "须弥", apiId: "alhaitham" , rel: "2023-01-18", ver: "3.4" },
  { id: "dehya", name: "迪希雅", element: "pyro", rarity: 5, weapon: "claymore", region: "须弥", apiId: "dehya" , rel: "2023-03-01", ver: "3.5" },
  { id: "collei", name: "柯莱", element: "dendro", rarity: 4, weapon: "bow", region: "须弥", apiId: "collei" , rel: "2022-08-24", ver: "3.0" },
  { id: "dori", name: "多莉", element: "electro", rarity: 4, weapon: "claymore", region: "须弥", apiId: "dori" , rel: "2022-09-09", ver: "3.0" },
  { id: "candace", name: "坎蒂丝", element: "hydro", rarity: 4, weapon: "polearm", region: "须弥", apiId: "candace" , rel: "2022-09-28", ver: "3.1" },
  { id: "faruzan", name: "珐露珊", element: "anemo", rarity: 4, weapon: "bow", region: "须弥", apiId: "faruzan" , rel: "2022-12-07", ver: "3.3" },
  { id: "layla", name: "莱依拉", element: "cryo", rarity: 4, weapon: "sword", region: "须弥", apiId: "layla" , rel: "2022-11-18", ver: "3.2" },
  { id: "kaveh", name: "卡维", element: "dendro", rarity: 4, weapon: "claymore", region: "须弥", apiId: "kaveh" , rel: "2023-05-02", ver: "3.6" },
  { id: "sethos", name: "赛索斯", element: "electro", rarity: 4, weapon: "bow", region: "须弥", apiId: "sethos" , rel: "2024-06-05", ver: "4.7" },

  // ============ 枫丹 ============
  { id: "neuvillette", name: "那维莱特", element: "hydro", rarity: 5, weapon: "catalyst", region: "枫丹", apiId: "neuvillette" , rel: "2023-09-27", ver: "4.1" },
  { id: "furina", name: "芙宁娜", element: "hydro", rarity: 5, weapon: "sword", region: "枫丹", apiId: "furina" , rel: "2023-11-08", ver: "4.2" },
  { id: "lyney", name: "林尼", element: "pyro", rarity: 5, weapon: "bow", region: "枫丹", apiId: "lyney" , rel: "2023-08-16", ver: "4.0" },
  { id: "wriothesley", name: "莱欧斯利", element: "cryo", rarity: 5, weapon: "catalyst", region: "枫丹", apiId: "wriothesley" , rel: "2023-10-17", ver: "4.1" },
  { id: "navia", name: "娜维娅", element: "geo", rarity: 5, weapon: "claymore", region: "枫丹", apiId: "navia" , rel: "2023-12-20", ver: "4.3" },
  { id: "clorinde", name: "克洛琳德", element: "electro", rarity: 5, weapon: "sword", region: "枫丹", apiId: "clorinde" , rel: "2024-06-05", ver: "4.7" },
  { id: "sigewinne", name: "希格雯", element: "hydro", rarity: 5, weapon: "bow", region: "枫丹", apiId: "sigewinne" , rel: "2024-06-25", ver: "4.7" },
  { id: "emilie", name: "艾梅莉埃", element: "dendro", rarity: 5, weapon: "polearm", region: "枫丹", apiId: "emilie" , rel: "2024-08-06", ver: "4.8" },
  { id: "escoffier", name: "爱可菲", element: "cryo", rarity: 5, weapon: "polearm", region: "枫丹", apiId: "enka:Escoffier" , rel: "2025-05-07", ver: "5.6" },
  { id: "lynette", name: "琳妮特", element: "anemo", rarity: 4, weapon: "sword", region: "枫丹", apiId: "lynette" , rel: "2023-08-16", ver: "4.0" },
  { id: "freminet", name: "菲米尼", element: "cryo", rarity: 4, weapon: "claymore", region: "枫丹", apiId: "freminet" , rel: "2023-09-05", ver: "4.0" },
  { id: "charlotte", name: "夏洛蒂", element: "cryo", rarity: 4, weapon: "catalyst", region: "枫丹", apiId: "charlotte" , rel: "2023-11-08", ver: "4.2" },
  { id: "chevreuse", name: "夏沃蕾", element: "pyro", rarity: 4, weapon: "polearm", region: "枫丹", apiId: "chevreuse" , rel: "2024-01-09", ver: "4.3" },

  // ============ 纳塔 ============
  { id: "mualani", name: "玛拉妮", element: "hydro", rarity: 5, weapon: "catalyst", region: "纳塔", apiId: "mualani" , rel: "2024-08-28", ver: "5.0" },
  { id: "kinich", name: "基尼奇", element: "dendro", rarity: 5, weapon: "claymore", region: "纳塔", apiId: "kinich" , rel: "2024-09-17", ver: "5.0" },
  { id: "mavuika", name: "玛薇卡", element: "pyro", rarity: 5, weapon: "claymore", region: "纳塔", apiId: "enka:Mavuika" , rel: "2025-01-01", ver: "5.3" },
  { id: "xilonen", name: "希诺宁", element: "geo", rarity: 5, weapon: "sword", region: "纳塔", apiId: "enka:Xilonen" , rel: "2024-10-09", ver: "5.1" },
  { id: "chasca", name: "恰斯卡", element: "anemo", rarity: 5, weapon: "bow", region: "纳塔", apiId: "enka:Chasca" , rel: "2024-11-20", ver: "5.2" },
  { id: "citlali", name: "茜特菈莉", element: "cryo", rarity: 5, weapon: "catalyst", region: "纳塔", apiId: "enka:Citlali" , rel: "2025-01-01", ver: "5.3" },
  { id: "varesa", name: "瓦雷莎", element: "electro", rarity: 5, weapon: "catalyst", region: "纳塔", apiId: "enka:Varesa" , rel: "2025-03-26", ver: "5.5" },
  { id: "iansan", name: "伊安珊", element: "electro", rarity: 4, weapon: "polearm", region: "纳塔", apiId: "enka:Iansan" , rel: "2025-03-26", ver: "5.5" },
  { id: "kachina", name: "卡齐娜", element: "geo", rarity: 4, weapon: "polearm", region: "纳塔", apiId: "kachina" , rel: "2024-08-28", ver: "5.0" },
  { id: "ororon", name: "欧洛伦", element: "electro", rarity: 4, weapon: "bow", region: "纳塔", apiId: "bwiki:ororon" , rel: "2024-11-20", ver: "5.2" },
  { id: "ifa", name: "伊法", element: "anemo", rarity: 4, weapon: "catalyst", region: "纳塔", apiId: "enka:Ifa" , rel: "2025-05-07", ver: "5.6" },

  // ============ 至冬 (愚人众) ============
  { id: "tartaglia", name: "达达利亚", element: "hydro", rarity: 5, weapon: "bow", region: "至冬", apiId: "tartaglia" , rel: "2020-11-11", ver: "1.1" },
  { id: "arlecchino", name: "阿蕾奇诺", element: "pyro", rarity: 5, weapon: "polearm", region: "至冬", apiId: "arlecchino" , rel: "2024-04-24", ver: "4.6" },
  { id: "sandrone", name: "桑多涅", element: "cryo", rarity: 5, weapon: "claymore", region: "至冬", apiId: "bwiki:sandrone" , rel: "2026-07-01", ver: "6.7" },
  { id: "odette", name: "奥黛塔", element: "cryo", rarity: 5, weapon: "sword", region: "至冬", apiId: "bwiki:odette" , rel: "2026-08-12", ver: "7.0" },
  { id: "alyosha", name: "阿罗夏", element: "electro", rarity: 4, weapon: "polearm", region: "至冬", apiId: "bwiki:alyosha" , rel: "2026-08-12", ver: "7.0" },
  { id: "vesna", name: "薇斯纳", element: "anemo", rarity: 5, weapon: "sword", region: "至冬", apiId: "bwiki:vesna" , rel: "2026-09-23", ver: "7.1" },
  { id: "vodyanitsa", name: "沃雅妮莎", element: "hydro", rarity: 5, weapon: "catalyst", region: "至冬", apiId: "bwiki:vodyanitsa" , rel: "2026-09-23", ver: "7.1" },
  { id: "mitya", name: "米提亚", element: "electro", rarity: 5, weapon: "catalyst", region: "至冬", apiId: "bwiki:mitya" , rel: "2026-11-04", ver: "7.2" },
  { id: "valeriy", name: "瓦列里", element: "electro", rarity: 4, weapon: "sword", region: "至冬", apiId: "bwiki:valeriy" , rel: "2026-11-04", ver: "7.2" },

  // ============ 挪德卡莱 (6.x) ============
  { id: "columbina", name: "哥伦比娅", element: "hydro", rarity: 5, weapon: "catalyst", region: "挪德卡莱", apiId: "enka:Columbina" , rel: "2026-01-14", ver: "6.3" },
  { id: "illuga", name: "叶洛亚", element: "geo", rarity: 4, weapon: "polearm", region: "挪德卡莱", apiId: "enka:Illuga" , rel: "2026-02-03", ver: "6.3" },
  { id: "flins", name: "菲林斯", element: "electro", rarity: 5, weapon: "polearm", region: "挪德卡莱", apiId: "enka:Flins" , rel: "2025-09-30", ver: "6.0" },
  { id: "aino", name: "爱诺", element: "hydro", rarity: 4, weapon: "claymore", region: "挪德卡莱", apiId: "enka:Aino" , rel: "2025-09-10", ver: "6.0" },
  { id: "ineffa", name: "伊涅芙", element: "electro", rarity: 5, weapon: "polearm", region: "挪德卡莱", apiId: "enka:Ineffa" , rel: "2025-07-30", ver: "5.8" },
  { id: "lauma", name: "菈乌玛", element: "dendro", rarity: 5, weapon: "catalyst", region: "挪德卡莱", apiId: "enka:Lauma" , rel: "2025-09-10", ver: "6.0" },
  { id: "nefer", name: "奈芙尔", element: "dendro", rarity: 5, weapon: "catalyst", region: "挪德卡莱", apiId: "enka:Nefer" , rel: "2025-10-22", ver: "6.1" },
  { id: "jahoda", name: "雅珂达", element: "anemo", rarity: 4, weapon: "bow", region: "挪德卡莱", apiId: "enka:Jahoda" , rel: "2025-12-03", ver: "6.2" },
  { id: "linnea", name: "莉奈娅", element: "geo", rarity: 5, weapon: "bow", region: "挪德卡莱", apiId: "enka:Linnea" , rel: "2026-04-08", ver: "6.5" },

  // ============ 其他（无固定地区归属的特殊角色） ============
  { id: "aloy", name: "埃洛伊", element: "cryo", rarity: 5, weapon: "bow", region: "其他", apiId: "aloy" , rel: "2021-09-01", ver: "2.1" },
  { id: "skirk", name: "丝柯克", element: "cryo", rarity: 5, weapon: "sword", region: "其他", apiId: "bwiki:skirk" , rel: "2025-06-18", ver: "5.7" },
  { id: "nicole", name: "尼可", element: "pyro", rarity: 5, weapon: "catalyst", region: "其他", apiId: "enka:Nicole" , rel: "2026-05-20", ver: "6.6" },
  // 奇偶：千星奇域人偶，官方标记为特殊5★，元素随旅行者当前元素变化（此处记为 "none"）
  { id: "manekin", name: "奇偶", element: "none", rarity: 5, weapon: "sword", region: "其他", apiId: "bwiki:manekin" , rel: "2025-10-22", ver: "6.1" },
];

export const CHARACTER_MAP: Record<string, Character> = CHARACTERS.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<string, Character>,
);

/**
 * 获取角色离线头像（base64 data URI，已内联进单文件 HTML）
 * @param id 角色 id（对应 src/portraits/{id}.png 文件名）
 * @returns 内联图片 URL；若本地未找到则返回空字符串（由调用方回退到元素符号）
 */
export function portraitUrl(id: string): string {
  return LOCAL_PORTRAITS[id] ?? "";
}
