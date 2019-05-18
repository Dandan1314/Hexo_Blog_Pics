const Router = require('@eggjs/router');
const router = new Router();

router.post('/upload', async (ctx, next) => {

});

router.get('/list/:limit/:page', async (ctx, next) => {
    ctx.body = '获取list'
});

router.delete('/delImg', async (ctx, next) => {
    ctx.body = '删除图片'
})

router.delete('/delHistory', async (ctx, next) => {
    ctx.body = '删除远程记录，并无卵用，本地存库了，远程只能根据IP来获取。'
})

module.exports = router