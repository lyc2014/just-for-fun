const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

const etag = ['123456789','987654321']
var noweEtag = etag[0]

http.createServer(function (req, res) {
    var urlParts = url.parse(req.url, true),
    urlParams = urlParts.query, 
    urlPathname = urlParts.pathname
    // res.setHeader('Cache-Control', 'max-age=31536000')
    if (urlPathname === '/' || urlPathname === '/index.html') {
        fs.readFile(path.resolve(__dirname, './index.html'), 'utf8', function (err, data) {
            if (!err) {
                res.setHeader('Content-Type', 'text/html; charset=utf8')
                res.end(data)
            }
        })
    }
    if (urlPathname === '/api') {
        if (urlParams['max-age']) {
            res.setHeader('Cache-Control', `max-age=${urlParams['max-age']}`)
        }
        if (urlParams['no-store']) {
            res.setHeader('Cache-Control', 'no-store')
        }
        if (urlParams['no-cache']) {
            res.setHeader('Cache-Control', 'no-cache')
        }
        if (urlParams['etag']) {
            res.setHeader('Etag', noweEtag)
        }
        if (urlParams['etagchange']) {
            noweEtag = noweEtag === etag[0] ? etag[1] : etag[0]
            res.setHeader('Etag', noweEtag)
        }
        if (req.headers['if-none-match'] === noweEtag) {
            res.statusCode = 304
            res.end()
            return
        }
        res.end(`${JSON.stringify({
            n: '222'
        })}`)
    }
}).listen(9797, '127.0.3.1', function () {
    console.log('serve is listen')
})