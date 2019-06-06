const mongoose = require('mongoose')
const { mongoose_ConnectString } = require('../config')

mongoose.connect(mongoose_ConnectString, { useNewUrlParser: true })

// 数据库状态
const db = mongoose.connection;
db.on('connected', err => {
    if (err) {
        console.log('连接数据库失败：' + err);
    } else {
        console.log('连接数据库成功！');
    }
})
db.on('error', console.error.bind(console, 'connection error:'));

// 接下来开始定义数据库的一些东西
const Schema = mongoose.Schema;

const BlogPicSchema = new Schema({
    width: Number,
    height: Number,
    filename: String,
    storename: String,
    size: Number,
    path: String,
    hash: String,
    timestamp: Number,
    ip: String,
    url: String,
    delete: String
})

module.exports = mongoose.model('BlogPic', BlogPicSchema)