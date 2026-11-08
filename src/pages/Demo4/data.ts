export type ScenicType =
  | "自然风光"
  | "历史人文"
  | "主题游乐"
  | "休闲度假"
  | "红色旅游";

export const SCENIC_TYPES: ScenicType[] = [
  "自然风光",
  "历史人文",
  "主题游乐",
  "休闲度假",
  "红色旅游",
];

export const TYPE_COLORS: Record<ScenicType, string> = {
  自然风光: "#58e6c8",
  历史人文: "#ffcf6b",
  主题游乐: "#b38bff",
  休闲度假: "#5ec8ff",
  红色旅游: "#ff7a7a",
};

export interface ScenicSpot {
  id: string;
  name: string;
  province: string;
  city: string;
  lng: number;
  lat: number;
  type: ScenicType;
  /** 年接待游客（万人次） */
  visitors: number;
  /** 景区综合收入（亿元） */
  revenue: number;
  /** 门票价格（元） */
  ticket: number;
  /** 同比增长（%） */
  growth: number;
  /** 游客满意度（0-100） */
  satisfaction: number;
  /** 热度指数（0-100） */
  hot: number;
}

export const scenicSpots: ScenicSpot[] = [
  { id: "gugong", name: "故宫博物院", province: "北京市", city: "北京", lng: 116.397, lat: 39.917, type: "历史人文", visitors: 1520, revenue: 88, ticket: 60, growth: 6.8, satisfaction: 96.2, hot: 98 },
  { id: "badaling", name: "八达岭长城", province: "北京市", city: "北京", lng: 116.017, lat: 40.356, type: "历史人文", visitors: 1180, revenue: 42, ticket: 40, growth: 5.2, satisfaction: 93.5, hot: 95 },
  { id: "guwenhua", name: "天津古文化街", province: "天津市", city: "天津", lng: 117.194, lat: 39.144, type: "历史人文", visitors: 830, revenue: 18, ticket: 0, growth: 7.4, satisfaction: 91.2, hot: 84 },
  { id: "chengde", name: "承德避暑山庄", province: "河北省", city: "承德", lng: 117.938, lat: 40.995, type: "历史人文", visitors: 520, revenue: 15, ticket: 130, growth: 6.1, satisfaction: 92.8, hot: 81 },
  { id: "shanhaiguan", name: "山海关", province: "河北省", city: "秦皇岛", lng: 119.753, lat: 40.009, type: "历史人文", visitors: 430, revenue: 11, ticket: 120, growth: 4.8, satisfaction: 90.6, hot: 76 },
  { id: "wutaishan", name: "五台山", province: "山西省", city: "忻州", lng: 113.596, lat: 39.007, type: "历史人文", visitors: 610, revenue: 21, ticket: 135, growth: 8.6, satisfaction: 93.7, hot: 86 },
  { id: "pingyao", name: "平遥古城", province: "山西省", city: "晋中", lng: 112.174, lat: 37.202, type: "历史人文", visitors: 720, revenue: 27, ticket: 125, growth: 9.2, satisfaction: 91.9, hot: 88 },
  { id: "yungang", name: "云冈石窟", province: "山西省", city: "大同", lng: 113.133, lat: 40.11, type: "历史人文", visitors: 380, revenue: 9, ticket: 120, growth: 5.5, satisfaction: 92.4, hot: 74 },
  { id: "xiangshawan", name: "响沙湾", province: "内蒙古自治区", city: "鄂尔多斯", lng: 109.973, lat: 40.241, type: "自然风光", visitors: 260, revenue: 7, ticket: 120, growth: 10.8, satisfaction: 90.3, hot: 72 },
  { id: "shenyanggugong", name: "沈阳故宫", province: "辽宁省", city: "沈阳", lng: 123.457, lat: 41.796, type: "历史人文", visitors: 460, revenue: 12, ticket: 50, growth: 6.4, satisfaction: 91.7, hot: 78 },
  { id: "laohutan", name: "大连老虎滩", province: "辽宁省", city: "大连", lng: 121.678, lat: 38.873, type: "主题游乐", visitors: 590, revenue: 16, ticket: 220, growth: 3.9, satisfaction: 90.9, hot: 80 },
  { id: "changbaishan", name: "长白山", province: "吉林省", city: "延边", lng: 128.064, lat: 42.006, type: "自然风光", visitors: 480, revenue: 14, ticket: 105, growth: 12.3, satisfaction: 94.6, hot: 85 },
  { id: "taiyangdao", name: "太阳岛", province: "黑龙江省", city: "哈尔滨", lng: 126.596, lat: 45.795, type: "自然风光", visitors: 350, revenue: 8, ticket: 40, growth: 7.7, satisfaction: 89.8, hot: 70 },
  { id: "dongfangmingzhu", name: "东方明珠", province: "上海市", city: "上海", lng: 121.499, lat: 31.239, type: "主题游乐", visitors: 1250, revenue: 31, ticket: 160, growth: 4.4, satisfaction: 92.3, hot: 93 },
  { id: "fuzimiao", name: "夫子庙-秦淮河", province: "江苏省", city: "南京", lng: 118.789, lat: 32.023, type: "历史人文", visitors: 1680, revenue: 36, ticket: 0, growth: 6.9, satisfaction: 92.6, hot: 94 },
  { id: "zhuozhengyuan", name: "拙政园", province: "江苏省", city: "苏州", lng: 120.629, lat: 31.324, type: "历史人文", visitors: 730, revenue: 18, ticket: 90, growth: 5.8, satisfaction: 94.4, hot: 87 },
  { id: "xihu", name: "杭州西湖", province: "浙江省", city: "杭州", lng: 120.148, lat: 30.244, type: "自然风光", visitors: 2980, revenue: 58, ticket: 0, growth: 7.2, satisfaction: 95.8, hot: 99 },
  { id: "wuzhen", name: "乌镇", province: "浙江省", city: "嘉兴", lng: 120.49, lat: 30.745, type: "休闲度假", visitors: 860, revenue: 32, ticket: 150, growth: 8.1, satisfaction: 93.1, hot: 90 },
  { id: "putuoshan", name: "普陀山", province: "浙江省", city: "舟山", lng: 122.39, lat: 30.01, type: "休闲度假", visitors: 690, revenue: 24, ticket: 160, growth: 6.6, satisfaction: 92.9, hot: 84 },
  { id: "huangshan", name: "黄山", province: "安徽省", city: "黄山", lng: 118.17, lat: 30.13, type: "自然风光", visitors: 740, revenue: 29, ticket: 190, growth: 7.8, satisfaction: 95.1, hot: 95 },
  { id: "jiuhuashan", name: "九华山", province: "安徽省", city: "池州", lng: 117.81, lat: 30.48, type: "历史人文", visitors: 420, revenue: 13, ticket: 160, growth: 5.9, satisfaction: 91.8, hot: 76 },
  { id: "wuyishan", name: "武夷山", province: "福建省", city: "南平", lng: 117.68, lat: 27.75, type: "自然风光", visitors: 560, revenue: 17, ticket: 140, growth: 9.4, satisfaction: 93.9, hot: 86 },
  { id: "gulangyu", name: "鼓浪屿", province: "福建省", city: "厦门", lng: 118.067, lat: 24.447, type: "休闲度假", visitors: 990, revenue: 25, ticket: 35, growth: 4.1, satisfaction: 91.3, hot: 90 },
  { id: "lushan", name: "庐山", province: "江西省", city: "九江", lng: 115.99, lat: 29.55, type: "自然风光", visitors: 610, revenue: 20, ticket: 160, growth: 6.7, satisfaction: 92.5, hot: 83 },
  { id: "sanqingshan", name: "三清山", province: "江西省", city: "上饶", lng: 118.06, lat: 28.91, type: "自然风光", visitors: 320, revenue: 9, ticket: 150, growth: 8.9, satisfaction: 93.3, hot: 75 },
  { id: "jinggangshan", name: "井冈山", province: "江西省", city: "吉安", lng: 114.17, lat: 26.57, type: "红色旅游", visitors: 460, revenue: 12, ticket: 165, growth: 6.4, satisfaction: 92.0, hot: 78 },
  { id: "taishan", name: "泰山", province: "山东省", city: "泰安", lng: 117.1, lat: 36.25, type: "自然风光", visitors: 820, revenue: 26, ticket: 115, growth: 6.3, satisfaction: 94.0, hot: 91 },
  { id: "qufu", name: "曲阜三孔", province: "山东省", city: "济宁", lng: 116.99, lat: 35.6, type: "历史人文", visitors: 570, revenue: 15, ticket: 150, growth: 5.1, satisfaction: 92.2, hot: 80 },
  { id: "longmenshiku", name: "龙门石窟", province: "河南省", city: "洛阳", lng: 112.47, lat: 34.55, type: "历史人文", visitors: 540, revenue: 14, ticket: 90, growth: 8.3, satisfaction: 93.6, hot: 84 },
  { id: "shaolinsi", name: "少林寺", province: "河南省", city: "登封", lng: 112.94, lat: 34.51, type: "历史人文", visitors: 680, revenue: 22, ticket: 80, growth: 7.5, satisfaction: 92.0, hot: 88 },
  { id: "wudangshan", name: "武当山", province: "湖北省", city: "十堰", lng: 111.0, lat: 32.4, type: "历史人文", visitors: 490, revenue: 16, ticket: 140, growth: 6.9, satisfaction: 93.4, hot: 82 },
  { id: "zhangjiajie", name: "张家界", province: "湖南省", city: "张家界", lng: 110.47, lat: 29.32, type: "自然风光", visitors: 1480, revenue: 47, ticket: 228, growth: 11.2, satisfaction: 94.8, hot: 96 },
  { id: "hengshan", name: "南岳衡山", province: "湖南省", city: "衡阳", lng: 112.69, lat: 27.3, type: "自然风光", visitors: 450, revenue: 12, ticket: 110, growth: 4.9, satisfaction: 90.7, hot: 75 },
  { id: "changlong", name: "广州长隆", province: "广东省", city: "广州", lng: 113.33, lat: 22.99, type: "主题游乐", visitors: 2100, revenue: 96, ticket: 350, growth: 9.8, satisfaction: 94.2, hot: 97 },
  { id: "danxiashan", name: "丹霞山", province: "广东省", city: "韶关", lng: 113.75, lat: 25.03, type: "自然风光", visitors: 310, revenue: 8, ticket: 130, growth: 6.2, satisfaction: 91.4, hot: 72 },
  { id: "lijiang", name: "桂林漓江", province: "广西壮族自治区", city: "桂林", lng: 110.29, lat: 25.27, type: "自然风光", visitors: 1360, revenue: 44, ticket: 215, growth: 8.7, satisfaction: 94.5, hot: 94 },
  { id: "tianya", name: "天涯海角", province: "海南省", city: "三亚", lng: 109.35, lat: 18.3, type: "休闲度假", visitors: 880, revenue: 30, ticket: 68, growth: 12.6, satisfaction: 91.6, hot: 89 },
  { id: "dazu", name: "大足石刻", province: "重庆市", city: "重庆", lng: 105.8, lat: 29.7, type: "历史人文", visitors: 330, revenue: 9, ticket: 115, growth: 5.7, satisfaction: 92.1, hot: 73 },
  { id: "jiuzhaigou", name: "九寨沟", province: "四川省", city: "阿坝", lng: 103.92, lat: 33.26, type: "自然风光", visitors: 620, revenue: 24, ticket: 190, growth: 15.4, satisfaction: 96.0, hot: 93 },
  { id: "emeishan", name: "峨眉山", province: "四川省", city: "乐山", lng: 103.34, lat: 29.55, type: "自然风光", visitors: 780, revenue: 28, ticket: 160, growth: 7.1, satisfaction: 94.3, hot: 90 },
  { id: "huangguoshu", name: "黄果树", province: "贵州省", city: "安顺", lng: 105.67, lat: 25.99, type: "自然风光", visitors: 590, revenue: 18, ticket: 160, growth: 10.5, satisfaction: 92.7, hot: 85 },
  { id: "lijianggucheng", name: "丽江古城", province: "云南省", city: "丽江", lng: 100.23, lat: 26.87, type: "休闲度假", visitors: 1720, revenue: 52, ticket: 50, growth: 8.4, satisfaction: 93.0, hot: 95 },
  { id: "yulongxueshan", name: "玉龙雪山", province: "云南省", city: "丽江", lng: 100.18, lat: 27.1, type: "自然风光", visitors: 640, revenue: 22, ticket: 100, growth: 9.6, satisfaction: 93.8, hot: 87 },
  { id: "budalagong", name: "布达拉宫", province: "西藏自治区", city: "拉萨", lng: 91.117, lat: 29.658, type: "历史人文", visitors: 310, revenue: 12, ticket: 200, growth: 13.2, satisfaction: 96.5, hot: 86 },
  { id: "bingmayong", name: "秦始皇帝陵博物院", province: "陕西省", city: "西安", lng: 109.273, lat: 34.385, type: "历史人文", visitors: 1160, revenue: 35, ticket: 120, growth: 6.5, satisfaction: 95.2, hot: 94 },
  { id: "huashan", name: "华山", province: "陕西省", city: "渭南", lng: 110.08, lat: 34.49, type: "自然风光", visitors: 520, revenue: 18, ticket: 160, growth: 7.9, satisfaction: 93.2, hot: 85 },
  { id: "yanan", name: "延安革命纪念地", province: "陕西省", city: "延安", lng: 109.49, lat: 36.6, type: "红色旅游", visitors: 380, revenue: 9, ticket: 0, growth: 7.2, satisfaction: 93.0, hot: 75 },
  { id: "mogao", name: "莫高窟", province: "甘肃省", city: "敦煌", lng: 94.81, lat: 40.04, type: "历史人文", visitors: 290, revenue: 11, ticket: 238, growth: 14.8, satisfaction: 96.8, hot: 83 },
  { id: "qinghaihu", name: "青海湖", province: "青海省", city: "海南州", lng: 100.2, lat: 36.9, type: "自然风光", visitors: 480, revenue: 15, ticket: 100, growth: 11.7, satisfaction: 93.5, hot: 82 },
  { id: "shapotou", name: "沙坡头", province: "宁夏回族自治区", city: "中卫", lng: 105.0, lat: 37.5, type: "自然风光", visitors: 280, revenue: 7, ticket: 100, growth: 8.8, satisfaction: 91.0, hot: 71 },
  { id: "kanasi", name: "喀纳斯", province: "新疆维吾尔自治区", city: "阿勒泰", lng: 87.03, lat: 48.7, type: "自然风光", visitors: 350, revenue: 13, ticket: 160, growth: 16.2, satisfaction: 95.6, hot: 84 },
  { id: "tianchi", name: "天山天池", province: "新疆维吾尔自治区", city: "昌吉", lng: 88.13, lat: 43.88, type: "自然风光", visitors: 390, revenue: 12, ticket: 125, growth: 9.1, satisfaction: 93.7, hot: 78 },
];

export const spotsById = new Map(scenicSpots.map((s) => [s.id, s]));

export const totalSpots = scenicSpots.length;
export const totalVisitors = scenicSpots.reduce((s, el) => s + el.visitors, 0);
export const totalRevenue = scenicSpots.reduce((s, el) => s + el.revenue, 0);
export const avgSatisfaction =
  scenicSpots.reduce((s, el) => s + el.satisfaction, 0) / totalSpots;
export const avgGrowth =
  scenicSpots.reduce((s, el) => s + el.growth, 0) / totalSpots;

export const shortProvince = (name: string) =>
  name.replace(
    /维吾尔自治区|回族自治区|壮族自治区|自治区|特别行政区|省|市/g,
    ""
  );

export interface ProvinceStat {
  name: string;
  short: string;
  count: number;
  visitors: number;
  revenue: number;
}

export const provinceStats: ProvinceStat[] = Object.values(
  scenicSpots.reduce<Record<string, ProvinceStat>>((acc, spot) => {
    acc[spot.province] ??= {
      name: spot.province,
      short: shortProvince(spot.province),
      count: 0,
      visitors: 0,
      revenue: 0,
    };
    acc[spot.province].count += 1;
    acc[spot.province].visitors += spot.visitors;
    acc[spot.province].revenue += spot.revenue;
    return acc;
  }, {})
).sort((a, b) => b.visitors - a.visitors);

export const provinceStatByName = new Map(
  provinceStats.map((p) => [p.name, p])
);

export interface TypeStat {
  type: ScenicType;
  count: number;
  visitors: number;
  color: string;
}

export const typeStats: TypeStat[] = SCENIC_TYPES.map((type) => {
  const spots = scenicSpots.filter((s) => s.type === type);
  return {
    type,
    count: spots.length,
    visitors: spots.reduce((s, el) => s + el.visitors, 0),
    color: TYPE_COLORS[type],
  };
});

export const topByVisitors = [...scenicSpots]
  .sort((a, b) => b.visitors - a.visitors)
  .slice(0, 8);

export const topProvincesByVisitors = provinceStats.slice(0, 8);

export const topProvincesByRevenue = [...provinceStats]
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 8);

/** 热门旅游线路（用于地图飞线） */
export const travelRoutes: [string, string][] = [
  ["gugong", "bingmayong"],
  ["badaling", "taishan"],
  ["xihu", "huangshan"],
  ["changlong", "lijiang"],
  ["jiuzhaigou", "lijianggucheng"],
  ["gugong", "zhangjiajie"],
  ["mogao", "bingmayong"],
  ["gulangyu", "putuoshan"],
];

/** 地图上常驻展示的重点景区标签 */
export const LABEL_IDS = [
  "xihu",
  "gugong",
  "changlong",
  "zhangjiajie",
  "huangshan",
  "lijianggucheng",
  "bingmayong",
  "lijiang",
];

/** 近 12 个月客流（万人次），模拟同比口径 */
const seasonalWeights = [
  0.72, 0.68, 0.78, 0.9, 1.12, 1.02, 1.24, 1.3, 0.96, 1.18, 0.86, 0.74,
];
const weightSum = seasonalWeights.reduce((s, w) => s + w, 0);
export const monthlyVisitors = seasonalWeights.map((w) =>
  Math.round((totalVisitors * w) / weightSum)
);
export const monthlyVisitorsLastYear = monthlyVisitors.map((v, i) =>
  Math.round(v / (1 + (0.05 + (i % 4) * 0.012)))
);
export const monthLabels = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];


export interface CityStat {
  name: string;
  count: number;
  visitors: number;
  revenue: number;
}

export interface ProvinceMetrics {
  name: string;
  short: string;
  spots: ScenicSpot[];
  count: number;
  visitors: number;
  revenue: number;
  satisfaction: number;
  growth: number;
  types: TypeStat[];
  cities: CityStat[];
}

const provinceMetricsCache = new Map<string, ProvinceMetrics>();

/** 省级视图所需的聚合数据（无需等待地图 GeoJSON 加载） */
export function getProvinceMetrics(name: string): ProvinceMetrics {
  const cached = provinceMetricsCache.get(name);
  if (cached) return cached;

  const spots = scenicSpots
    .filter((spot) => spot.province === name)
    .sort((a, b) => b.visitors - a.visitors);
  const visitors = spots.reduce((sum, spot) => sum + spot.visitors, 0);
  const revenue = spots.reduce((sum, spot) => sum + spot.revenue, 0);
  const weight = visitors || 1;

  const types: TypeStat[] = SCENIC_TYPES.map((type) => {
    const typeSpots = spots.filter((spot) => spot.type === type);
    return {
      type,
      count: typeSpots.length,
      visitors: typeSpots.reduce((sum, spot) => sum + spot.visitors, 0),
      color: TYPE_COLORS[type],
    };
  }).filter((item) => item.count > 0);

  const cityMap: Record<string, CityStat> = {};
  spots.forEach((spot) => {
    cityMap[spot.city] ??= {
      name: spot.city,
      count: 0,
      visitors: 0,
      revenue: 0,
    };
    cityMap[spot.city].count += 1;
    cityMap[spot.city].visitors += spot.visitors;
    cityMap[spot.city].revenue += spot.revenue;
  });

  const metrics: ProvinceMetrics = {
    name,
    short: shortProvince(name),
    spots,
    count: spots.length,
    visitors,
    revenue,
    satisfaction:
      spots.reduce((sum, spot) => sum + spot.satisfaction * spot.visitors, 0) /
      weight,
    growth:
      spots.reduce((sum, spot) => sum + spot.growth * spot.visitors, 0) /
      weight,
    types,
    cities: Object.values(cityMap).sort((a, b) => b.visitors - a.visitors),
  };

  provinceMetricsCache.set(name, metrics);
  return metrics;
}
