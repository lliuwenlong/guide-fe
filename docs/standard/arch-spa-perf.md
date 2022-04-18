---
title: 性能实践
sidebar_label: 性能实践
---

## 一、Service Worker
Service Worker为网页应用增加了本地安装的能力，在浏览器中首次打开配置了Service Worker的网页应用后，即自动安装到了本地浏览器中，支持无网环境下离线使用网页应用。

当网页应用发布新版本之后，浏览器中再次打开的依然是上一个安装版本，与此同时Service Worker在后台下载新版本网页应用。
但下载完成后，并不会自动应用到浏览器中，需要刷新（执行了skipWaiting）或重启浏览器（未执行skipWaiting）才可以应用新版本。

### 注意：
1. 使用[FE-GUIDE Beta](/fe-guide/docs/index)中的“一键创建Vue2.0项目”，已经集成了Service Worker。
2. 启用了Service Worker的网页应用，API必须版本化，至少保持兼容。

### 要求：
1. `service-worker.js`跟`index.html`、`manifest.json`一样，要禁用缓存配置；

发布在服务器端的文件列表如下所示：
```bash
index.html
manifest.json
service-worker.js
precache-manifest.1d51690273c7b19d2358a57e1622b543.js
precache-manifest.88af3439466326b3aeeecfef3606ad0d.js
......
```
每次刷新网页应用后会请求`service-worker.js`文件，`service-workder.js`更新后会加载新版本的`precache-manifest.js`文件（`importScripts("/precache-manifest.1d51690273c7b19d2358a57e1622b543.js");`，以进行新版本网页应用的下载。所以要禁用`service-worker.js`的缓存配置，保证每次浏览器都能从服务器端获取到最新版本。


### 详解：
`"@vue/cli-plugin-pwa"`提供的`registerServiceWorker.js`需要做如下修改：
```diff
-    updated() {
-        console.log('New content is available; please refresh.');
-    },
+    updated(event) {
+        console.log('New content is available; please refresh.', event.waiting);
+        if (event) {
+            const { waiting } = event;
+            // Todo 解决一半的缓存，需要二次刷新
+            waiting.postMessage({ type: 'SKIP_WAITING' });
+
+            waiting.onstatechange = () => {
+                console.log(waiting);
+                if (waiting.state !== 'activated') {
+                    return;
+                }
+                // eslint-disable-next-line no-alert
+                const result = window.confirm('QEagles发布了新版本，是否刷新？');
+                if (result) {
+                    window.location.reload(true);
+                }
+            };
+        }
+    },
```

## 二、参考
1. [Service Worker 生命周期](https://developers.google.cn/web/fundamentals/primers/service-workers/lifecycle?hl=zh-cn)
2. [Workbox Core](https://developers.google.cn/web/tools/workbox/modules/workbox-core?hl=zh-cn)
