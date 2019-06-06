const fs = require('fs')
const request = require('request')

module.exports = async (file) => {
    return new Promise((resolve, reject) => {
        request.post({
            url: 'https://sm.ms/api/upload',
            headers: {
                'User-Agent': 'request'
            },
            formData: {
                smfile: fs.createReadStream(file.path)
            }
        }, (error, response, body) => {
            if (error) {
                reject(error)
            }
            resolve(body)
        })
    })
}