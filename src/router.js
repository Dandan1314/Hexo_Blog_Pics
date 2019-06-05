const Router = require('@eggjs/router');
const router = new Router();
const upload = require('./upload')

router.post('/upload', upload);

router.get('/list/:limit/:page', async (ctx, next) => {
    ctx.body = '获取list'
});

router.delete('/delImg/:id', async (ctx, next) => {
    ctx.body = '删除图片'
})


module.exports = router