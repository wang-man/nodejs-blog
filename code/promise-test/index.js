const fs = require('fs');
const path = require('path')

function readFileContent (fileName) {
  const fullPathFile = path.resolve(__dirname, 'file', fileName);  // __dirname表示当前文件目录
  return new Promise(function (resolve, reject) {
    // 拿到带完整路径的文件
    fs.readFile(fullPathFile, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data.toString()));
    })
  })
}
// 第三种：使用async await
async function getFileContent () {
  const Adata = await readFileContent('a.json')
  // console.log(Adata);
  // const Bdata = await readFileContent(Adata.next);
  // console.log(Bdata);
  // const Cdata = await readFileContent(Bdata.next);
  // console.log(Cdata);
  return Adata
}
getFileContent()

async function test () {
  const prevAsync = await getFileContent();
  console.log(prevAsync)
}
test()


// 第二种利用promise链式回调
// readFileContent("a.json").then(Adata => {
//   console.log(Adata);
//   return readFileContent(Adata.next)      // 关键的要返回一个promise才可能继续链式回调
// }).then(Bdata => {
//   console.log(Bdata);
//   return readFileContent(Bdata.next)
// }).then(Cdata => {
//   console.log(Cdata)
// })

// 第一种：使用回调函数的形式
// readFileContent("a.json", Adata => {
//   console.log(Adata)
//   readFileContent(Adata.next, Bdata => {
//     console.log(Bdata);
//     readFileContent(Bdata.next, Cdata => {
//       console.log(Cdata)
//     })
//   })
// })