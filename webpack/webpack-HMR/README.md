1. server 启动serversendevent header Content-type: 'text/event-stream'
2. new EventSource('/__webpack_hmr') 监听服务端返回信息。（webpack-hot-middleware/client 通过entry入口注入）
3. 获取.json、xxx.hot.js， json存hash   hot.js存储更新的module 即 {'./src/xxx': functin(){xxxxx}}