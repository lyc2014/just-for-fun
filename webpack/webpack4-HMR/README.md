## 概述

* 热重载： 重新加载，使用 window.location.reload() 刷新页面达到更新的目的。
* 热更新： 只更新修改的文件，不会刷新页面。

### webpack.HotModuleReplacementPlugin

webpack.HotModuleReplacementPlugin负责往bundle文件中注入负责热更新的相关函数，比如注入 module 更新后会触发的 回调函数。 module.hot.accept(moduleId, callback)

### webpack-dev-middleware

webpack-dev-middleware 是一个容器，它可以把webpack处理后的文件传递给一个服务器，客户端可以通过服务器链接访问这些bundle文件

### webpack-hot-middleware

webpack-hot-middleware 负责将浏览器客户端连接到 webpack 服务器并接收更新

### 图示

<image src="./public/image.image"/>