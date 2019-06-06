const fs = require('fs')
const path = require('path')
const BlogPic = require('./db')
const smmsUpload = require('./smmsUpload')
const qiniuUpload = require('./qiniuUpload')
const { static_Dir } = require('../config')

module.exports = async (ctx, next) => {
    const files = ctx.request.files
    const file = files['file']
    // 获取到文件之后进行上传操作
    const uploadFileRes = JSON.parse(await smmsUpload(file))
    const data = uploadFileRes.data;
    if (uploadFileRes.code === 'success') {
        const dirRes = await new Promise((resolve, reject) => {
            fs.mkdir(static_Dir + path.dirname(data.path), { recursive: true }, err => {
                if(err) {
                    reject(false)
                }
                const reader = fs.createReadStream(file.path);
                const upStream = fs.createWriteStream(static_Dir + data.path);
                reader.pipe(upStream);
                resolve(true)
            })
        })
        if(dirRes){
            const createPicRes = await BlogPic.create(data)
            const remotePath = data.path.substr(1)
            const localPath = static_Dir + data.path
            const qiniuUploadRes = await qiniuUpload(remotePath, localPath)
            ctx.body = {
                createPicRes,
                qiniuUploadRes,
                hexoUrl : `{% img_path ${data.path} %}`
            }
        }
    } else {
        ctx.body = uploadFileRes
    }
}