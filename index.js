const fs = require('fs')
const tinify = require('tinify')
const paths = require('path')
const fromDir = 'images' // 源文件目录,须在根目录
const saveDir = 'ok_images' // 保存目录，须在根目录
const root = paths.join(__dirname, fromDir)
tinify.key = 'WS81LV9mrN80KgPJMBLXRmJN34l7ZfQ6' // 填写自己的API KEY
let curNum = 0

const readFile = async(path) => { // 循环调用处理图片
  const arr = fs.readdirSync(path)
  const promises = []
  arr.forEach((ele) => {
    const promise = tinyFuc(ele, arr.length)
    promises.push(promise)
  })
  Promise.all(promises).then((result) => {
    console.log('全部图片处理完毕了')
    curNum = 0
  }).catch((error) => {
    console.log(error)
  })
}
const tinyFuc = async(file, allNum) => { // 异步处理图片函数
  return new Promise((resolve, reject) => {
    const fromPath = paths.join(__dirname, fromDir, file)
    const toPath = paths.join(__dirname, saveDir, file)
    tinify.fromFile(fromPath).toFile(toPath, (err) => {
      if (err instanceof tinify.AccountError) {
        err = '您的API密钥或API帐户存在问题。您的请求无法被授权。'
        reject(err)
      } else if (err instanceof tinify.ClientError) {
        err = '由于提交的数据存在问题，因此无法完成请求。'
        reject(err)
        err = '由于Tinify API暂时存在问题，因此无法完成请求。'
      } else if (err instanceof tinify.ServerError) {
        reject(err)
      } else if (err instanceof tinify.ConnectionError) {
        err = '无法发送请求，因为连接Tinify API时出现问题。'
        reject(err)
      } else {
        curNum += 1
        console.log(file + ' 处理完毕 进度：' + curNum + '/' + allNum)
        resolve(file)
      }
    })
  }).catch((error) => {
    console.log('抛出异常图片：' + file + ' ' + error.message)
  })
}
readFile(root)
