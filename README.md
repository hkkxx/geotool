![vite.svg](assets/vite.svg)

# **geotool**

本地离线工具


## function

1. 快速编辑geojson 文件。 可同时打开一个主文件和多个附文件，一键复制和删除其中一个要素。
2. geojson格式验证功能。
3. 具有经纬度转换功能

### geojson 格式验证能力

[https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.8](定义)

忽略实现（不验证的部分）：

1. 几何图形的 position 顺序，包括不限于面图形的外圈和内圈的前后顺序
2. 坐标使用经纬度判断，无法进行笛卡尔坐标（东向北向巨鹿）判断。（不具备坐标系转换能力）.
3. 没有边界 bbox 的判断。
4. 没有子午线切割（ Antimeridian Cutting）的检查.
5. 还有一些前后与以上的约束不进行判断，——（定义 7.1 Semantics of GeoJSON Members and Types Are Not Changeable）
6. 基本判断注意点：不接受三个元素以上的坐标数组，只两二元素、三元素坐标。（超过四个元素的坐标只存在于古老系统中）

## develop

### run

`npm run build:vite`

`npm run start:electron-forge`

### make

`npm run make:electron-forge`

## ib

**UI:**

* react
* antd
* tailwindcss

**build:**

* vite
* electron
* electron-forge

**other:**

* socket.io
  ...
