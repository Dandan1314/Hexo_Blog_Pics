const koa = require('koa')
const app = new koa();
const route = require('./router')

app
    .use(route.routes())
    .use(route.allowedMethods())
    .listen(4832, () => {
        console.log('图床程序启动成功！')
    })

//捕获异常
app
    .on('error', err => console.log('ERROR => ', err))