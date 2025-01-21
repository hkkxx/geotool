

# **geotool**

本地离线工具
最新1.1：
![image](https://github.com/user-attachments/assets/15ad04b0-ade2-4f0a-ab3c-7ddac3cf9db6)


## function

1. 快速编辑geojson 文件。 可同时打开一个主文件和多个附文件，一键复制和删除其中一个要素。
2. geojson格式验证功能。
3. 具有经纬度转换功能

### geojson 格式验证能力

[https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.8](定义)

忽略实现（不验证的部分）：

1. 几何图形的 position 顺序，包括不限于面图形的外圈和内圈的前后顺序
2. 坐标使用经纬度判断，无法进行笛卡尔坐标（东向北向距离）判断。（不具备坐标系转换能力）.
3. 没有边界 bbox 的判断。
4. 没有子午线切割（ Antimeridian Cutting）的检查.
5. 还有一些前后与以上的约束不进行判断，——（定义 7.1 Semantics of GeoJSON Members and Types Are Not Changeable）
6. 基本判断注意点：不接受三个元素以上的坐标数组，只判断二元素、三元素坐标。（超过四个元素的坐标只存在于古老系统中）

## 使用use
### 主界面：
![image](https://github.com/user-attachments/assets/d930ae5f-f8d4-4643-9be1-2babbdba165c)
### 打开文件 ，限制后缀 .json .geojson：
覆盖：替换主界面文件
追加：追加到主界面文件，忽略文件最外层属性type：
分页，打开一个新窗口，显示文件内容：
![image](https://github.com/user-attachments/assets/cc91d177-ebf9-45f4-9d30-b1c87f833a9a)
显示文件后，从列表中选择要显示的属性（最多五个属性），删除属性
![image](https://github.com/user-attachments/assets/81326edc-5224-4ad7-a7c2-5ed1bede5e1b)

### 经纬度转换，时分秒，允许js number类型最大范围，小数点后十五位置
![image](https://github.com/user-attachments/assets/278e0551-48b5-40af-8fcf-013c3e01b704)
### 同时打开多个geojson文件，“复制”按钮将要素追加到主界面内容，“保存文件”下载到当前路径，文件为当前日期。
eg： “Sat Dec 28 2024.geojson”



## develop

### run

1，vite构建打包react项目;2，electron-forge 构建

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
