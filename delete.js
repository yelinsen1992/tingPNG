<<<<<<< HEAD
/* eslint-disable promise/param-names */
const fs = require('fs')
const path = require('path')
const fromDir = 'images' // 源文件目录,须在根目录
const saveDir = 'ok_images' // 保存目录，须在根目录
const root = path.join(__dirname, fromDir)
const _root = path.join(__dirname, saveDir)

// 递归删除
const rmDir = (dir) => {
  return new Promise(resolve => {
    fs.stat(dir, (err, status) => {
      if (err) {
        resolve(false)
      } else {
        if (status.isDirectory()) { // 是文件夹
          fs.readdir(dir, (err, file) => {
            if (!err) {
              const res = file.map((item) => rmDir(path.join(dir, item)))
              Promise.all(res).then(() => { // 当所有的子文件都删除后就删除当前文件夹
                fs.rmdir(dir, () => { resolve(true) })
              })
            } else {
              resolve(false)
            }
          })
        } else {
          fs.unlink(dir, () => { resolve(true) })
        }
      }
    })
  })
}
// 读取路径信息
const getStat = (path) => {
  return new Promise(resolve => {
    fs.stat(path, (err, stats) => {
      err ? resolve(false) : resolve(stats)
    })
  })
}
// 创建路径
const mkdir = (dir) => {
  return new Promise(resolve => {
    fs.mkdir(dir, err => {
      err ? resolve(false) : resolve(true)
    })
  })
}
// 递归判断上级目录
const mkDir = async(dir) => {
  const isExists = await getStat(dir)
  if (isExists && isExists.isDirectory()) { // 存在路径且是文件夹，返回true
    return true
  } else if (isExists) {
    return false // 存在路径且是文件，返回false
  }
  const tempDir = path.parse(dir).dir // 拿到上级路径
  const status = await mkDir(tempDir) // 递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let mkdirStatus
  if (status) {
    mkdirStatus = await mkdir(dir)
  }
  return mkdirStatus
}
(async () => {
  await rmDir(root)
  await rmDir(_root)
  await mkDir(root)
  await mkDir(_root)
})()
=======
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
>>>>>>> 9859a9055fce0c85501cc99f3b8c22001ce6f373
