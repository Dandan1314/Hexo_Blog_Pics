const fs = require('fs')
const request = require('request')
const path = require('path')
const BlogPic = require('./db')

// 上传到sm.ms
const upload2Net = async (file) => {
    return new Promise((resolve, reject) => {
        request.post({
            url: 'https://sm.ms/api/upload',
            headers: {
                'content_type': 'application/json',
                'User-Agent': 'request'
            },
            formData: {
                smfile: fs.createReadStream(file.path)
            }
        }, (error, response, body) => {
            if (error) {
                reject(error)
            }
            resolve(body)
        })
    })
}

module.exports = async (ctx, next) => {
    const files = ctx.request.files
    const file = files['file']
    // 获取到文件之后进行上传操作
    const uploadFileRes = JSON.parse(await upload2Net(file))
    const data = uploadFileRes.data;
    if (uploadFileRes.code === 'success') {
        const dirRes = await new Promise((resolve, reject) => {
            fs.mkdir('upload' + path.dirname(data.path), { recursive: true }, err => {
                if(err) {
                    reject(false)
                }
                const reader = fs.createReadStream(file.path);
                const upStream = fs.createWriteStream('upload' + data.path);
                reader.pipe(upStream);
                resolve(true)
            })
        })
        if(dirRes){
            await BlogPic.create(data)
            ctx.body = `{% img_path ${data.path} %}`
        }
    } else {
        ctx.body = uploadFileRes
    }
}