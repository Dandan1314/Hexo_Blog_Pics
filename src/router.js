const Router = require('@eggjs/router');
const router = new Router();
const upload = require('./upload')
const delPic = require('./delPic')

router.put('/upload', upload);

router.delete('/delImg/:picName', delPic)

module.exports = router