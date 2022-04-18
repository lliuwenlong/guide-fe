---
title: OSS上传组件封装
tags: [Vue, AntdVue]
---

```javascript

import OSS from 'ali-oss';
import commonApi from '@/common/services/query';
import { uuid } from '@/common/utils/index';

let stsInfo = {
    access_key_id: null,
    access_key_secret: null,
    security_token: null,
    bucket: null,
    cdn_host: null,
    path: null,
};

// eslint-disable-next-line consistent-return
export const put = (name, File) => {
    try {
        // eslint-disable-next-line consistent-return
        return new Promise((resolve) => {
            if (!stsInfo.stsToken) {
                return commonApi.querySTSToken().then(result => {
                    stsInfo = result.data.data;
                    stsInfo.path = result.data.data.files.path;
                    resolve(stsInfo);
                });
            }
            resolve(stsInfo);
        // eslint-disable-next-line no-shadow
        }).then(stsInfo => {
            const urlstring = `${stsInfo.path}${uuid()} + ${name}`;
            const client = new OSS({
                region: 'oss-cn-beijing',
                accessKeyId: stsInfo.access_key_id,
                accessKeySecret: stsInfo.access_key_secret,
                bucket: stsInfo.bucket,
                stsToken: stsInfo.security_token,
            });
            return client.put(urlstring, File);
        });
    } catch (e) {
        window.console.error(e);
    }
};

export default {
    put,
};

```

```javascript
<AUploadDagger
    name="file"
    :multiple="true"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="true"
    :custom-request="customRequest"
    :before-upload="beforeUpload"
    :file-list="fileList"
    @change="handleChange"
  >
    <p class="ant-upload-text">
      点击或者拖拽图片上传Query
    </p>
</AUploadDagger>

customRequest (action) {
  const {file} = action;
    put(
        new Date().valueOf() + parseInt(Math.random() * 10000, 10)
            +
            file.name.substring(0, 20), file,
    ).then(result => {
        this.loading = false;
        const item = {
            uid: uuid(),
            name: result.name,
            status: 'done',
            url: result.url,
            thumbUrl: result.url,
        };
        this.fileList = [...this.fileList, item];
        // this.imageUrl = result.url;
    }).catch(error => {
        window.console.error('异常', error);
        put(file.name.substring(0, 20), file).then(result => {
            this.loading = false;
            this.imageUrl = result.url;
        });
    });
},
```
