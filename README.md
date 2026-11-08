<div align="center">
  <h1>数据可视化大屏</h1>
  <p>基于 Three.js + React 19 + ECharts 的 3D 地图可视化大屏项目</p>
  <p>包含 3D 地图渲染、轮廓飞线、侧边扫光、多图表联动等丰富功能</p>

<p>
    <a href="https://github.com/knight-L/sc-datav/pulls">
      <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
    </a>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/React-19.1.1-61dafb?style=flat-square&logo=react" alt="React">
    </a>
    <a href="https://threejs.org/">
      <img src="https://img.shields.io/badge/Three.js-0.181.2-black?style=flat-square&logo=three.js" alt="Three.js">
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=flat-square&logo=typescript" alt="TypeScript">
    </a>
    <a href="https://github.com/knight-L/datav/stargazers">
      <img src="https://img.shields.io/github/stars/knight-L/datav?style=flat-square" alt="GitHub stars">
    </a>
    <a href="https://github.com/knight-L/datav/network/members">
      <img src="https://img.shields.io/github/forks/knight-L/datav?style=flat-square" alt="GitHub forks">
    </a>
  </p>
</div>

## 预览

| [预览地址](https://hfhfn.github.io/sc-datav/#/demo0) | [预览地址](https://hfhfn.github.io/sc-datav/#/demo1) |
| ------------------------------------------------------- | ------------------------------------------------------- |
| ![demo1](./public/demo_0.jpg)                           | ![demo2](./public/demo_1.jpg)                           |

| [预览地址](https://hfhfn.github.io/sc-datav/#/demo2) | [预览地址](https://hfhfn.github.io/sc-datav/#/demo3) |
| ------------------------------------------------------- | ------------------------------------------------------- |
| ![demo3](./public/demo_2.jpg)                           | ![demo4](./public/demo_3.jpg)                           |

| [全国视图](https://hfhfn.github.io/sc-datav/#/demo4) | [省内下钻](https://hfhfn.github.io/sc-datav/#/demo4) |
| ------------------------------------------------------- | ------------------------------------------------------- |
| ![demo5](./public/demo_4.jpg)                           | ![demo6](./public/demo_4_province.jpg)                  |

## 地图轮廓贴图下载工具

[https://github.com/knight-L/sat-hunter](https://github.com/knight-L/sat-hunter)

## 功能特性

1. **3D 地图可视化**: 基于 Three.js 的 3D 地图渲染，轮廓飞线动画效果，侧边扫光视觉效果
2. **省级地图展示**: 四川省地理轮廓精确呈现
3. **多图表联动**: 柱状图、折线图等多种数据可视化形式
4. **响应式设计**: 支持多种屏幕尺寸自适应
5. **实时调试面板**: 使用 Leva 实现参数实时调整
6. **全国重点景区大屏**: 中国 3D 省份地图、52 个重点景区光柱标记、省份下钻、热门线路飞线、镜头聚焦与实时客流监控

## 全国重点景区 3D 可视化大屏（`#/demo4`）

- 全国 34 个省级行政区 3D 挤出地图，按省内重点景区数量呈现景区密度色阶（含南海诸岛断续线）
- 52 个重点 5A 级景区数据，按自然风光 / 历史人文 / 主题游乐 / 休闲度假 / 红色旅游五类着色，带光柱、扩散波纹与热度样式
- 8 条热门跨省旅游线路飞线，流光贴图 + 彗星粒子沿曲线运动
- 操作：左键拖动旋转、右键拖动平移、滚轮缩放（较大步长）、中键拖动缩放；点击省份或景区光柱下钻到该省的地市/区县 3D 地图；左右面板（核心指标、景区排行、类型分布、城市客流/收入、实时客流）同步切换为省内口径
- 省内视图点击景区光柱：镜头平滑聚焦并弹出详情卡；点击「返回全国」恢复全国地图与全国面板数据
- 左侧核心指标、景区接待量 TOP8、类型分布；右侧省份接待量 / 收入 TOP8、每 2.6 秒刷新的实时客流监控；下钻后自动切换为省内景区与城市数据，全国/省内视图切换时会各自回到标准视角，旋转互不联动
- 底部类型图例、省份密度图例与实时客流播报；用加法光晕、环境粒子与扫描光效营造夜游氛围（不使用后处理，避免部分显卡闪屏）

> 说明：本项目为可视化演示，景区坐标与名称取自公开资料，客流、收入等指标均为演示数据，非官方统计。

## 技术栈

本项目是一个基于现代 Web 技术的数据可视化大屏应用，主要技术栈包括：

- **核心框架**: React 19 + TypeScript
- **构建工具**: Vite (Rolldown 版本)
- **3D 可视化**: Three.js + @react-three/fiber + @react-three/drei
- **数据可视化**: ECharts
- **地理数据处理**: D3-geo
- **动画库**: GSAP
- **样式库**: Styled-components
- **调试工具**: Leva
- **自适应布局**: autofit.js

## 目录结构

```
src/
├── assets/             # 静态资源文件
│   ├── sc.json         # 四川省地理数据
│   └── sc_outline.json # 四川省轮廓数据
├── components/         # 通用组件
│   ├── chart.tsx       # 图表组件
│   └── seamVirtualScroll.tsx # 虚拟滚动组件
├── hooks/              # 自定义Hooks
├── pages/SCDataV/      # 数据大屏页面
│   ├── index.tsx       # 页面入口
│   ├── scMap.tsx       # 地图组件
│   ├── flyLine.tsx     # 飞线动画组件
│   ├── chart1.tsx      # 图表1
│   ├── chart2.tsx      # 图表2
│   ├── chart3.tsx      # 图表3
│   └── content.tsx     # 内容布局组件
└── App.tsx             # 应用根组件
```

## 开发指南

### 环境要求

- Node.js >= 18
- PNPM >= 8

### 安装依赖

```bash
pnpm install
```

### 开发运行

```bash
# 启动开发服务器
pnpm dev
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```
