# 抽奖程序

## 技术

技术：Node + Express + Three.js

后台通过`Express`实现

前端抽奖界面通过`Three.js`实现 3D 抽奖球，引用了`Three.js`的官方 3D 示例

## 安装

```

git clone https://github.com/xiaowang872/eagle_chouka.git


cd lottery


# 服务端插件安装
cd server
npm config set registry https://registry.npmmirror.com/
npm install
cd ../product
npm install
set NODE_OPTIONS=--openssl-legacy-provider
npm run build

npm run serve

```

## 目录结构

```
Lottery
├── product
│   ├── src
│   │   ├── lottery
│   │   │   └── index.js
│   │   ├── lib
│   │   ├── img
│   │   ├── css
│   │   └── data
│   ├── package.json
│   └── webpack.config.js
├── server
│   ├── config.js
│   ├── server.js
│   └── package.js
```

> 1. product 为前端页面目录
> 2. package.josn web 项目配置文件
> 3. webpack.config.js 打包配置文件
> 4. server 为服务器目录
> 5. config 为奖品信息的配置文件

## 配置信息

### 抽奖用户信息配置

抽奖用户信息在**`server/data/user.xlsx`**文件中，按文件格式进行填充，不能修改文件名和列头

### 奖品信息配置

奖品的配置信息填写在**server/config.js**文件中，不能修改文件名。

**其中奖品 prizes 的配置描述如下：**

| 参数  | 值类型 | 描述                                                         |
| ----- | ------ | ------------------------------------------------------------ |
| type  | Number | 奖品类型，唯一标识，0 是默认特别奖的占位符，其它奖品不可使用 |
| count | Number | 奖品数量                                                     |
| text  | String | 奖项名称                                                     |
| title | String | 奖品描述                                                     |
| img   | String | 奖品的图片地址，图片在**img**目录下                          |

```js
// 奖品信息，第一项为预留项不可修改，其他项可根据需要修改
let prizes = [{
        type: 0,
        count: 1000,
        title: "",
        text: "特别奖"
    },
    {
        type: 1,
        count: 2,
        text: "特等奖",
        title: "神秘大礼",
        img: "../img/secrit.jpg"
    },
    {
        type: 2,
        count: 5,
        text: "一等奖",
        title: "Mac Pro",
        img: "../img/mbp.jpg"
    }
    ...
];
```

### 奖品每次抽取个数配置

**EACH_COUNT**用于配置每次的抽奖个数，与 prizes 奖品一一对应，例如上面的奖品配置对应的抽奖个数配置如下：

```js
const EACH_COUNT = [1, 1, 5];
```

如上配置，表示一次抽取的奖品个数顺序为：特别奖每次抽一个，特等奖每次抽一个，一等奖每次抽五个

### 企业标识配置

该标识用于显示在抽奖卡片上。

```js
const COMPANY = "";
```

