const fs = require('fs')
const tinify = require('tinify')
const paths = require('path')
const fromDir = 'images' // 源文件目录,须在根目录
const saveDir = 'ok_images' // 保存目录，须在根目录
const root = paths.join(__dirname, fromDir)
const _root = paths.join(__dirname, saveDir)
tinify.key = 'WS81LV9mrN80KgPJMBLXRmJN34l7ZfQ6' // 填写自己的API KEY
let curNum = 0

// 读取文件所有信息
const fileInfo = async(pathName) => {
  return new Promise((resolve, reject) => {
    fs.stat(pathName, (err, stats) => {
      if (err) {
        resolve(false)
      }
      resolve(stats)
    })
  })
}

// 彻底删除文件或文件夹
const rmFuc = async(_pathName, allNum) => {
  const flag = await fileInfo(_pathName)
  return new Promise((resolve, reject) => {
    if (!flag) {
      console.log('抛出异常图片：' + _pathName)
      resolve(false)
    }
    if (flag.isFile()) {
      fs.unlink(_pathName, (err) => {
        if (err) {
          console.log('抛出异常图片：' + _pathName)
          resolve(false)
        }
        curNum = curNum + 1
        console.log(_pathName + ' 删除完毕 进度：' + curNum + '/' + allNum)
        resolve(true)
      })
    } else if (flag.isDirectory()) {
      fs.rmdir(_pathName, { recursive: true }, (err) => {
        if (err) {
          console.log('抛出异常图片：' + _pathName)
          resolve(false)
        }
        curNum = curNum + 1
        console.log(_pathName + ' 删除完毕 进度：' + curNum + '/' + allNum)
        resolve(true)
      })
    }
  })
}

const readFile = async(path) => { // 循环调用处理图片
  const arr = fs.readdirSync(path)
  const promises = []
  arr.forEach((ele) => {
    const promise = rmFuc(paths.join(path, ele), arr.length)
    promises.push(promise)
  })
  Promise.all(promises).then((result) => {
    console.log('全部图片删除完毕了')
    curNum = 0
  }).catch((error) => {
    console.log(error)
  })
}
readFile(root)
readFile(_root)
