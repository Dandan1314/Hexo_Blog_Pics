const qiniu = require('qiniu')
const { qiniu_AccessKey, qiniu_SecretKey, qiniu_Bucket, qiniu_Zone } = require('../config')

const mac = new qiniu.auth.digest.Mac(qiniu_AccessKey, qiniu_SecretKey);
const options = { scope: qiniu_Bucket }
const putPolicy = new qiniu.rs.PutPolicy(options);

const uploadToken = putPolicy.uploadToken(mac);
const config = new qiniu.conf.Config({ zone: qiniu.zone[qiniu_Zone] });
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

const bucketManager = new qiniu.rs.BucketManager(mac, config);

module.exports = {
    uploadToken, 
    formUploader,
    putExtra,
    bucketManager
}