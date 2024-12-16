/**
 * 奖品设置
 * type: 唯一标识，0是默认特别奖的占位符，其它奖品不可使用
 * count: 奖品数量
 * title: 奖品描述
 * text: 奖品标题
 * img: 图片地址
 */

const fs = require('fs');
const path = require('path');

const prizes = [
  {
    type: 0,
    count: 1000,
    title: "",
    text: "特别奖"
  },
  {
    type: 1,
    count: 1,
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
  },
  {
    type: 3,
    count: 10,
    text: "二等奖",
    title: "华为 Mate30",
    img: "../img/huawei.png"
  },
  // {
  //   type: 4,
  //   count: 0,
  //   text: "淘汰组",
  //   title: "抽中者直接淘汰",
  //   img: "../img/ipad.jpg"
  // },
  // {
  //   type: 5,
  //   count: 0,
  //   text: "淘汰组",
  //   title: "抽中者直接淘汰",
  //   img: "../img/spark.jpg"
  // },
  // {
  //   type: 6,
  //   count: 0,
  //   text: "淘汰组",
  //   title: "抽中者直接淘汰",
  //   img: "../img/kindle.jpg"
  // },
  // {
  //   type: 7,
  //   count: 0,
  //   text: "淘汰组",
  //   title: "抽中者直接淘汰",
  //   img: "../img/edifier.jpg"
  // }
];

/**
 * 一次抽取的奖品个数与prizes对应
 */
// const EACH_COUNT = [1, 1, 1, 2, 3, 4, 5, 6];
const EACH_COUNT = [1, 1, 1, 1];
/**
 * 卡片公司名称标识
 */
const COMPANY = "英格科技";

function saveAllDataFile(data) {
  const filePath = path.join(__dirname, 'prizes.json');
  data = JSON.stringify(data, null, 2);

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
      console.log('奖品数据已保存');
    });
  });
}




module.exports = {
  prizes,
  EACH_COUNT,
  COMPANY,
  saveAllDataFile
};
