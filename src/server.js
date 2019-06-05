const koa = require('koa')
const app = new koa()
const koaBody = require('koa-body')
const route = require('./router')
const static = require('koa-static')

app
    .use(koaBody({
        multipart: true,
        formLimit: '10mb',
        formidable: {
            maxFileSize: 20000 * 1024 * 1024
        }
    }))
    .use(route.routes())
    .use(route.allowedMethods())
    .use(static('upload'))
    .listen(4832, () => {
        console.log('图床程序启动成功！')
    })

//捕获异常
app
    .on('error', err => console.log('ERROR => ', err))