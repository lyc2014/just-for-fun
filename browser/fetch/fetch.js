const net = require('node:net')
const fs = require('node:fs')
const { Buffer } = require('node:buffer')

const server = new net.Server()
server.on('connection', (socket) => {
  let reqData = ''
  let contentLength = 0; // 请求体的长度
  let content = ''
  socket.on('data', (reqBuffer) => {
    reqData += reqBuffer
    // 判断是否接收到完整的 HTTP 请求头
    const requestEndIndex = reqData.indexOf('\r\n\r\n')
    if (requestEndIndex !== -1) {
      const requestHeader = reqData.slice(0, requestEndIndex + 4) // 获取完整的请求头

      // 解析 HTTP
      const lines = requestHeader.split('\r\n')
      const [method, path] = lines[0].split(' ')
      let compleContent = ''
      if (method === 'GET') { // GET情况默认没有Content内容
        reqData = ''
      } else if (method === 'POST') {
        // 获取Content-Length
        content = reqData.slice(requestEndIndex + 4) // 获取content
        const contentLengthLine = lines.find(line => line.startsWith('Content-Length:'))
        if (contentLengthLine) {
          contentLength = parseInt(contentLengthLine.split(':')[1].trim())
        }
        // 判断是否接收到完整的请求体
        if (contentLength > 0) {
          if (content.length >= contentLength) {
            compleContent = content
            reqData = ''
            contentLength = 0
            content = ''
          }
        }
      }
      
      console.log('path ===========>', path)
      if ((path === '/' || path === '/index.html') && method === 'GET') {
        const fileHTMLReadStream = fs.createReadStream('./fetch.html', {
          highWaterMark: 15
        })
        // const fileHtmlContent = fs.readFileSync('./fetch.html')
        // HTML 请求头
        // if (socket.readyState === 'open')  {
          socket.write('HTTP/1.1 200 OK\r\n' +
                      'Connection: keep-alive\r\n' +
                      // `Content-Length: ${Buffer.byteLength(fileHtmlContent).toString(16)}\r\n` +
                      'Transfer-Encoding: chunked\r\n' +
                      'Content-Type: text/html;charset=utf-8\r\n' +
                      '\r\n'
                      )
        // }
        
        // HTML 请求内容
        // fileHTMLReadStream.pipe(socket)
        fileHTMLReadStream.on('readable', () => {
          let chunk
          while(null !== (chunk = fileHTMLReadStream.read())) {
              socket.write(`${chunk.length.toString(16)}\r\n`);
              socket.write(chunk);
              socket.write('\r\n')
              // sleep(0.1)
          }
        })
        fileHTMLReadStream.on('end', () => {
            socket.write('0\r\n');
            socket.write('\r\n');
        })
      } else if (path === '/moviesJSON' && method === 'GET') {
        let moviesList = [{
          id: 1, name: '钢铁侠'
        }, { id: 2, name: '蜘蛛侠'
       }, { id: 3, name: '蝙蝠侠' }]
        socket.write('HTTP/1.1 200 OK\r\n' +
                  'Content-Type: application/json; charset=utf8\r\n' +
                  `Content-Length: ${Buffer.byteLength(JSON.stringify(moviesList))}\r\n` +
                  'Connection: keep-alive\r\n' +
                  '\r\n')
        socket.write(JSON.stringify(moviesList))
      } else if (path === '/chunk' && method === 'GET') {
        console.log('===============>', path)
        console.log('------------>', socket.readyState)
        socket.write('HTTP/1.1 200 OK\r\n' +
                      'Content-Type: text/plain; charset=utf8\r\n' +
                      'Transfer-Encoding: chunked\r\n' +
                      'Connection: keep-alive\r\n' +
                      '\r\n')
        const chunkReadStream = fs.createReadStream('./chunk.txt', {
          highWaterMark: 15
        })
        chunkReadStream.on('readable', () => {
          let chunk
          while (null !== (chunk = chunkReadStream.read())) {
            socket.write(`${chunk.length.toString(16)}\r\n`)
            socket.write(chunk)
            socket.write('\r\n')
            sleep(0.01)
          }
        })
        chunkReadStream.on('end', () => {
          console.log('chunks is all sended')
          socket.write('0\r\n')
          socket.write('\r\n')
        })
      } else if (path === '/formData' && method === 'GET') {
        const responseData = 'username=john_doe&password=mypassword&email=john.doe@example.com';
        const response = 'HTTP/1.1 200 OK\r\n' +
                          'Connection: keep-alive\r\n' +
                          'Content-Type: application/x-www-form-urlencoded\r\n' +
                          `Content-Length: ${Buffer.byteLength(responseData)}\r\n` +
                          '\r\n'
        socket.write(response);
        socket.write(responseData);
      } else if (path === '/textData' && method === 'GET') {
        const textContent = 'Hi, This is lyc, I am twenty nine years old'
        socket.write('HTTP/1.1 200 OK\r\n' +
                      'Connection: keep-alive\r\n' +
                      'Content-Type: text/plain; charset=utf8\r\n' +
                      `Content-Length: ${Buffer.byteLength(textContent)}\r\n` +
                      '\r\n')
        socket.write(textContent)
      } else if (path === '/arrayBuffer' && method === 'GET') {
        let fileBinaryContent = fs.readFileSync('./chunk.txt')
        socket.write('HTTP/1.1 200 OK\r\n' +
                      'Connection: keep-alive\r\n' +
                      'Content-Type: application/octet-stream\r\n' +
                      `Content-Length: ${Buffer.byteLength(fileBinaryContent)}\r\n` +
                      '\r\n')
        socket.write(fileBinaryContent)
      } else if (path === '/multipartFormData' && method === 'GET') {
        
        const response = '--boundary123\r\n' +
                        'Content-Disposition: form-data; name="field1"\r\n' +
                        '\r\n' +
                        'Value1\r\n' +
                        '--boundary123\r\n' +
                        'Content-Disposition: form-data; name="field2"\r\n' +
                        '\r\n' +
                        'Value2\r\n' +
                        '--boundary123--\r\n'
        socket.write('HTTP/1.1 200 OK\r\n');
        socket.write('Content-Type: multipart/form-data; boundary=boundary123\r\n');
        socket.write(`Content-Length: ${Buffer.byteLength(response)}\r\n`)
        socket.write('\r\n');
        socket.write(response)
      } else if (method === 'POST' && path ==='/postDataBaisc' && compleContent) {
        socket.write('HTTP/1.1 200 OK\r\n' +
                     'Content-Type: application/json;charset=utf8\r\n' +
                     'Connection: keep-alive\r\n' +
                     `Content-Length: ${Buffer.byteLength(compleContent)}\r\n` +
                     '\r\n')
        socket.write(compleContent)
      }
      
    }
  })
})
server.listen(3000, () => {
  console.log('The server is started...')
})

function sleep(time) {
  let startTime = +new Date()
  while(+new Date() - startTime < time * 1000) {}
}