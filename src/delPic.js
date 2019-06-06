const BlogPic = require('./db')
const request = require('request')
const { bucketManager } = require('./qiniuAuth')
const fs = require('fs')
const { static_Dir, qiniu_Bucket } = require('../config')

const deleteSmms = async (delUrl) => new Promise((resolve, reject) => {
    request.get({
        url: delUrl,
        headers: {
            'User-Agent': 'request'
        },
    }, (err, req, body) => {
        if (err) {
            reject('smms 图片删除失败 => ', err)
        }
        resolve(true)
    })
})

const delQiniu = async fileKey => new Promise((resolve, reject) => {
    bucketManager.delete(qiniu_Bucket, fileKey, function (err, respBody, respInfo) {
        if (err) {
            reject('七牛图片删除失败 => ', err)
        } 
        resolve(true)
    });
})

const delLocalFile = async filePath => new Promise((resolve, reject) => {
    fs.unlink(filePath, err => {
        if(err) {
            reject('本地文件删除失败 => ', err)
        }
        resolve(true)
    })
})

module.exports = async (ctx, next) => {
    const picName = ctx.params.picName
    if (!picName) {
        return ctx.body = {
            error: '参数错误'
        }
    }
    const findPicRes = await BlogPic.findOne({ storename: picName })
    if (!findPicRes) {
        return ctx.body = {
            error: '图片不存在'
        }
    }
    // 开始进行删除操作
    const delUrl = findPicRes.delete;
    try {
        // 删除smms图片
        const deleteSmmsRes = await deleteSmms(delUrl)
        // 删除七牛图片
        const deleteQiniuRes = await delQiniu(findPicRes.path.substr(1))
        // 删除本地图片
        const deleteLocalRes = await delLocalFile(static_Dir + findPicRes.path)
        // 删除mongoose记录
        const deleteMongoose = await BlogPic.deleteOne({ storename: picName })
        if(deleteSmmsRes && deleteQiniuRes && deleteLocalRes && deleteMongoose.ok) {
            ctx.body = {
                res: '删除成功'
            }
        }
    } catch (e) {
        console.log('SMMS删除错误 => ', e)
    }
}