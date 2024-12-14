const fs = require("fs");
const path = require("path");
const xlsx = require("node-xlsx").default;
// 设置缓存目录
let cwd = path.join(__dirname, "cache");




// 这里为guixiang添加部分（10-87）


const express = require('express');
const app = express();
const port = 3000;



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
  const filePath = path.join(__dirname, 'cache', 'temp.json');
  
  // 读取 temp.json 文件并返回给前端
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('读取文件失败');
    }
    res.json(JSON.parse(data));  // 将 JSON 数据返回给前端
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器正在运行，端口：${port}`);
});

// 保存数据到 temp.json 文件
function saveDataFile(data) {
  data = JSON.stringify(data, null, 2);  // 格式化数据为 JSON 字符串

  // 如果目录不存在则创建
  if (!fs.existsSync(cwd)) {
    fs.mkdirSync(cwd);
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(cwd, 'temp.json'), data, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
      console.log('数据写入成功');
    });
  });
}

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








// 







if (!fs.existsSync(cwd)) {
  fs.mkdirSync(cwd);
}

/**
 * 读取缓存的数据内容
 */
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

/**
 * 读取XML文件数据
 */
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

/**
 * 写入excel
 * @param {Array} data
 * @param {string} name
 */
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

/**
 * 写入文件
 * @param {*} data
 */
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



/**
 * 错误日志文件输出
 * @param {*} data
 */
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
      console.log("数据写入成功");
    });
  });
}

/**
 * 洗牌算法
 * @param {*} arr
 */
function shuffle(arr) {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--);
    let temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
}

module.exports = {
  loadTempData,
  loadXML,
  shuffle,
  writeXML,
  saveDataFile,
  saveErrorDataFile
};
