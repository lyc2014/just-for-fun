const http = require('http');

// 创建一个HTTP服务器
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream', // 设置响应类型为二进制流
    'Transfer-Encoding': 'chunked' // 使用分块传输编码
  });

  // 每隔一秒发送一次数据
  const interval = setInterval(() => {
    const data = Buffer.from('Hello, world! ', 'utf8');
    res.write(data); // 发送数据

    // 检查是否已经持续发送了10秒钟，如果是则停止发送数据
    if (Date.now() - startTime > 10000) {
      clearInterval(interval);
      res.end();
      console.log('执行完成了')
    }
  }, 1000);

  const startTime = Date.now(); // 记录开始时间
});

server.listen(3000, () => {
  console.log(`Server running at http://localhost:${3000}/`);
});
