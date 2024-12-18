const fs = require("fs");
const path = require("path");
const xlsx = require("node-xlsx").default;
const express = require('express');
const app = express();
const port = 3000;
const { prizes, EACH_COUNT, COMPANY } = require('./config'); // 引入奖品配置
const bodyParser = require('body-parser');  // 引入 body-parser
// 设置缓存目录
let cwd = path.join(__dirname, "cache");
// 使用 body-parser 中间件来解析 JSON 数据
app.use(bodyParser.json());  // 解析 POST 请求中的 JSON 数据
// 设置跨域头部
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // 允许所有来源
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 如果是 OPTIONS 请求，直接响应 200
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 提供读取 temp.json 文件的接口
app.get('/getData', (req, res) => {
  const filePath = path.join(cwd, 'temp.json');
  
  // 读取 temp.json 文件并返回给前端
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('读取文件失败');
    }
    res.json(JSON.parse(data));  // 将 JSON 数据返回给前端
  });
});


// 提供读取 all.json 文件的接口
app.get('/getAllData', (req, res) => {
  const filePath = path.join(cwd, 'all.json');
  
  // 读取 all.json 文件并返回给前端
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('读取文件失败');
    }
    res.json(JSON.parse(data));  // 将 JSON 数据返回给前端
  });
});


// 提供读取奖品数据的接口
app.get('/getPrizeData', (req, res) => {
  // 直接读取 config.js 中的奖品数据
  res.json({ prizes });
});

// 提供接口更新奖品数量
app.post('/updatePrizeCount', (req, res) => {
  const { type, count } = req.body;

  // 查找奖品类型
  const prize = prizes.find(p => p.type === type);
  
  if (prize) {
    prize.count = count;  // 更新奖品数量
    // 保存更新后的奖品配置到 config.js 或者文件中
    saveAllDataFile(prizes)
      .then(() => res.json({ success: true, prize }))
      .catch((err) => res.status(500).json({ success: false, message: '更新奖品数量失败' }));
  } else {
    res.status(400).json({ success: false, message: '奖品类型不存在' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器正在运行，端口：${port}`);
});

// 将 users.xlsx 转换为 JSON 格式并保存为 all.json
function convertXlsxToJson() {
  const xlsxPath = path.join(__dirname, 'data', 'users.xlsx');
  
  // 解析 XLSX 文件
  const userData = xlsx.parse(xlsxPath);
  let allData = [];
  
  // 提取第一个 sheet 的数据
  userData.forEach(item => {
    allData = item.data;
    allData.shift();  // 去掉表头
    return false;  // 只取第一个 sheet
  });

  allData = allData.filter(item => item.length > 0);  // 去掉空行

  // 保存为 all.json 文件
  saveAllDataFile(allData)
    .then(() => {
      console.log('users.xlsx 转换并保存为 all.json 成功');
    })
    .catch(err => {
      console.error('保存 all.json 失败', err);
    });
}

// 保存 all.json 文件
function saveAllDataFile(data) {
  const filePath = path.join(cwd, 'all.json');
  data = JSON.stringify(data, null, 2);

  return new Promise((resolve, reject) => {
    // 如果目录不存在则创建
    if (!fs.existsSync(cwd)) {
      fs.mkdirSync(cwd);
    }

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
      console.log('all.json 文件写入成功');
    });
  });
}

// 启动时转换 users.xlsx 为 all.json
convertXlsxToJson();

// 扩展其他功能
function saveDataFile(data) {
  data = JSON.stringify(data, "", 2);

  if (!fs.existsSync(cwd)) {
    fs.mkdirSync(cwd);
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(cwd, "temp.json"), data, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
      console.log("数据写入成功");
    });
  });
}

function saveErrorDataFile(data) {
  data = JSON.stringify(data, "", 2);
  if (!fs.existsSync(cwd)) {
    fs.mkdirSync(cwd);
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(cwd, "error.json"), data, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
      console.log("错误日志写入成功");
    });
  });
}
function loadTempData() {
  let pros = [];
  pros.push(
    new Promise((resolve, reject) => {
      fs.readFile(path.join(cwd, "temp.json"), "utf8", (err, data) => {
        if (err) {
          resolve({});
          return;
        }
        resolve(JSON.parse(data));
      });
    })
  );

  pros.push(
    new Promise((resolve, reject) => {
      fs.readFile(path.join(cwd, "error.json"), "utf8", (err, data) => {
        if (err) {
          resolve([]);
          return;
        }
        resolve(JSON.parse(data));
      });
    })
  );

  return Promise.all(pros);
}
function shuffle(arr) {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--);
    let temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
}
function writeXML(data, name) {
  let buffer = xlsx.build([
    {
      name: "抽奖结果",
      data: data
    }
  ]);

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(process.cwd(), name), buffer, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
function loadXML(xmlPath) {
  let userData = xlsx.parse(xmlPath);
  let outData = [];
  userData.forEach(item => {
    outData = item.data;
    outData.shift();
    return false;
  });
  outData = outData.filter(item => item.length > 0);
  return outData;
}
module.exports = {
  loadTempData,
  loadXML,
  shuffle,
  writeXML,
  saveDataFile,
  saveErrorDataFile,
  convertXlsxToJson
};
