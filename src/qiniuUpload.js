const { uploadToken, formUploader, putExtra } = require('./qiniuAuth')

module.exports = async (remotePath, localPath) => {
    return new Promise((resolve, reject) => {
        formUploader.putFile(uploadToken, remotePath, localPath, putExtra, function (respErr,
            respBody, respInfo) {
            if (respErr) {
                reject(respErr);
            }
            if (respInfo.statusCode == 200) {
                resolve(respBody);
            } else {
                resolve(respBody);
            }
        });
    })
}