const fs = require('fs')
const path = require('path')
const BlogPic = require('./db')
const smmsUpload = require('./smmsUpload')
const qiniuUpload = require('./qiniuUpload')
const { static_Dir } = require('../config')
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

module.exports = async (ctx, next) => {
    const files = ctx.request.files
    const file = files['file']
    // 压缩图片
    await imagemin([file.path], 'tmp', {
		plugins: [
			imageminJpegtran(),
			imageminPngquant({
				quality: [0.4, 0.6]
			})
		]
    });
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
        fs.unlink(file.path, (err, res) => {
            if(!err) {
                console.log('临时文件删除成功。');
            } else {
                console.log('临时文件删除失败，请手动清空tmp目录。')
            }
        })
    } else {
        ctx.body = uploadFileRes
    }
}