# Hexo_Blog_Pics

![License](https://img.shields.io/github/license/trazyn/ieaseMusic.svg?style=flat-square)
[![Travis CI status](https://img.shields.io/travis/trazyn/ieaseMusic/dev.svg?style=flat-square)](https://travis-ci.org/trazyn/ieaseMusic/branches)
[![Dependencies Status](https://david-dm.org/trazyn/ieaseMusic/status.svg?style=flat-square)](https://david-dm.org/trazyn/ieaseMusic)
[![DevDependencies Status](https://david-dm.org/trazyn/ieaseMusic/dev-status.svg?style=flat-square)](https://david-dm.org/trazyn/ieaseMusic?type=dev)
[![JS Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

## 程序介绍
开源的Hexo图片备份工具，通过在本地环境启动Nodejs程序，进行图片上传操作，使用了smms图床，七牛云对象存储，以及本地存储

## 环境要求

`Nodejs 8.9+`

`MongoDB 4+`

`Hexo 3+`

`七牛云开发者账户`

## 配置文件
在程序根目录创建config.js

```js
module.exports = {
    static_Dir: 'upload',
    mongoose_ConnectString: 'mongodb://127.0.0.1:12345/Blog_Pic',
    qiniu_AccessKey: '',
    qiniu_SecretKey: '',
    qiniu_Bucket: '',
}
```

配置项 | 对应功能
------ | ------
static_Dir | 静态资源目录，本地上传的目录
mongoose_ConnectString | MongoDB连接串
qiniu_AccessKey | 七牛开发者AccessKey
qiniu_SecretKey | 七牛开发者SecretKey
qiniu_Bucket | 七牛存储空间名

## 程序部署
```bash
git clone git@github.com:Dandan1314/Blog_Pics.git
cd Blog_Pics
yarn
```
修改配置文件之后启动程序，默认监听4832端口
```bash
yarn start
```
程序启动后，可以根据直接访问静态资源目录的方式来访问本地文件
```url
http://localhost:4832/2019/06/06/5cf8ab8ceeaf169784.jpg
```
同理，在图床程序异常时，可以通过部署到一台主机实现临时的图片加载

---
## 接口文档
### 1. 上传图片
#### 1.1 功能描述
将文件上传到MSSM/七牛云，在本地进行存储
#### 1.2 请求说明
> PUT
>
> 请求URL ：[/upload](#) 

#### 1.3 请求参数
字段         |字段类型    |字段说明
------------|-----------|-----------
file    |File     |要上传的图片
#### 1.4 返回结果
```json  
{
    "createPicRes": {
        "_id": "5cf8ab8d60bbae1ec41f9721",
        "width": 2,
        "height": 2,
        "filename": "upload_b2ddb277ca75be6c6bcc363e0ccb8a47.jpg",
        "storename": "5cf8ab8ceeaf169784.jpg",
        "size": 3220,
        "path": "/2019/06/06/5cf8ab8ceeaf169784.jpg",
        "hash": "W5X9pkyaQEcRFtA",
        "timestamp": 1559800716,
        "ip": "221.239.96.186",
        "url": "https://i.loli.net/2019/06/06/5cf8ab8ceeaf169784.jpg",
        "delete": "https://sm.ms/delete/W5X9pkyaQEcRFtA",
        "__v": 0
    },
    "qiniuUploadRes": {
        "hash": "FvEbXabBEH9s0IOcRdrKIwBboSu7",
        "key": "2019/06/06/5cf8ab8ceeaf169784.jpg"
    },
    "hexoUrl": "{% img_path /2019/06/06/5cf8ab8ceeaf169784.jpg %}"
}
```
#### 1.5 返回参数
字段         |字段类型    |字段说明
------------|-----------|-----------
createPicRes      |Object     |上传到SMMS返回的结果
qiniuUploadRes        |Object        |上传到七牛返回的结果
hexoUrl    |Object | 在HEXO中添加的图片信息

### 2. 删除图片
#### 2.1 功能描述
将传到图床的图片和本地的图片删除
#### 2.2 请求说明
> DELETE
>
> 请求URL ：[/delImg/:fileName](#) 

#### 2.3 请求参数
字段         |字段类型    |字段说明
------------|-----------|-----------
fileName    |String     |图片名，即上传到smms返回的storename
#### 2.4 返回结果
```json  
{
    "res": "删除成功"
}
```
如果有上传失败，根据控制台报错信息进行处理

---

## HEXO配置方式
1.  在HEXO根目录_config.yml 添加 img_path: 'https://i.loli.net'配置项，用于指定图片地址
2. 在模版的scripts目录下（不存在这个目录新建一个），创建siteUrl.js，内容如下
    ```javascript
    'use strict';
    const config = hexo.config;
    hexo.extend.tag.register('img_path', function (args) {
        return `<img src="${config.img_path + args[0]}" style="margin: 6px 0;width:${args[1] ? args[1]+'px' : "auto"};height:${args[2] ? args[2]+'px' : 'auto'}"/>`;
    });
    ```
3. 更新模版，清理HEXO并重新生成
4. 复制上传返回的 "hexoUrl" 即 {% img_path /2019/06/06/5cf8ab8ceeaf169784.jpg %}
4. 可以通过配置第三个和第四个参数的方式，控制图片宽高
5. 在要插入图片的位置粘贴

---

## 参考资料
> [Upload Api Document](https://sm.ms/doc/)
>  
> [hexojs Issues 2756](https://github.com/hexojs/hexo/issues/2756)
>  
> [Qiniu Developer Center](https://developer.qiniu.com/kodo)

## License
就MIT吧，懒得改了