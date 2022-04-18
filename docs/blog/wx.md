---
title: 微信小程序经验记录
tags: [wx]
---
记录工作中遇到的有关微信小程序的问题与经验。

## 1. 微信小程序更新时机

### 未启动时更新
开发者在发布新版本的小程序之后，如果用户本地有小程序的历史版本，此时打开的可能还是旧版本。微信客户端会有若干个时机去检查本地缓存的小程序有没有更新版本，如果有则会静默更新到新版本。也就是说，开发者在发布新版本之后，无法立刻影响到所有现网用户，最差情况，也在发布之后24小时之内下发新版本信息到用户。用户下次打开时会先更新最新版本再打开。

### 启动时更新
小程序每次冷启动时，都会检查是否有更新版本，如果发现有新版本，将会异步下载新版本的代码包，并同时用客户端本地的包进行启动，即新版本的小程序需要等下一次冷启动才会应用上。
如果需要马上应用最新版本，可以使用 wx.getUpdateManager API 进行处理。
```javascript
  const updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log(res.hasUpdate)
  })
  // 监听小程序有版本更新事件 参数 function callback 更新事件的回调
  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
  updateManager.onUpdateFailed(function () {
    // 新版本下载失败
  })
```

