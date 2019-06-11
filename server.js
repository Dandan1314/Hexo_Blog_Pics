const koa = require('koa')
const app = new koa()
const koaBody = require('koa-body')
const route = require('./src/router')
const cors = require('koa2-cors')
const static = require('koa-static')
const { static_Dir, website_Domain } = require('./config')

app
    .use(koaBody({
        multipart: true,
        formLimit: '10mb',
        formidable: {
            maxFileSize: 20000 * 1024 * 1024,
            encoding: 'utf-8',
            uploadDir: 'tmp',
            keepExtensions: true
        }
    }))
    .use(cors({
        origin: website_Domain && [],
        credentials: true,
        allowMethods: ['GET', 'PUT', 'DELETE'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept']
    }))
    .use(route.routes())
    .use(static(static_Dir))
    .listen(4832, () => {
        console.log('图床程序启动成功！')
    })

//捕获异常
app
    .on('error', err => console.log('ERROR => ', err))