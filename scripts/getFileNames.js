
const path = require("path");
const fs = require("fs");

// 获取文件夹下的所有文件
function getFiles(dir, exclude = []) {
    const files = fs.readdirSync(dir);
    const data=  exclude.length ? files.filter(file => !exclude.includes(file)) : files;
    const fileName = data.map(item => item.replace(/\.md$/, ''))
    console.log(fileName);
    return fileName;
}
 
module.exports = getFiles;