const mkcert = require('mkcert');
const fs = require("fs")
const https = require('https')
const path = require('path')
const url = require('url')


function parseCookies (request) {
    const list = {};
    const cookieHeader = request.headers.cookie || undefined;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name ? name.trim() : name;
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

// create a certificate authority
async function getKeyAndCert () {
    const ca = await mkcert.createCA({
        organization: 'Hello CA',
        countryCode: 'NP',
        state: 'Bagmati',
        locality: 'Kathmandu',
        validityDays: 365
    });
      
      // then create a tls certificate
    const cert = await mkcert.createCert({
        domains: ['127.0.1.1', 'www.testdomaina.com'],
        validityDays: 365,
        caKey: ca.key,
        caCert: ca.cert
    });
    return cert
}
// 初始金额为 1000
let money = 10000;
let currentUserName = '';

getKeyAndCert().then(cert => {
    // console.log(cert.key, cert.cert); // certificate info
    https.createServer(
        {
            key: cert.key,
            cert: cert.cert
        },
        (req, res) => {
            var urlParts = url.parse(req.url, true),
            urlParams = urlParts.query, 
            urlPathname = urlParts.pathname
            if (urlPathname === '/' || urlPathname === '/client.html') {
                fs.readFile(path.resolve(__dirname, './client.html'), 'utf8', function (err, data) {
                    res.writeHeader(200, {"Content-Type": "text/html"});
                    res.end(data)
                })
            }
            if (urlPathname === '/isLogin' && req.method === 'POST') {
                res.writeHeader(200, {"Content-Type": "application/json; charset=utf-8"})
                let cookieList = parseCookies(req)

                if (cookieList['csrfName']) {
                    res.end(`${JSON.stringify({
                        data: true,
                        msg: '登录成功'
                    })}`)
                } else {
                    res.end(`${JSON.stringify({
                        data: false,
                        msg: '未登录'
                    })}`)
                }
            }
            if (req.method === 'OPTIONS') {
                let obj = {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Credentials': 'true'
                }
                if (req.headers.origin) {
                    obj['Access-Control-Allow-Origin'] = req.headers.origin
                }
                res.writeHead(204, obj).end()
            }
            if (urlPathname === '/login' && req.method === 'POST') {
                let data = ''
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', () => {
                    const body = JSON.parse(data)
                    const userName = body.userName
                    currentUserName = userName
                    res.writeHead(200, {
                        'Set-Cookie': `csrfName=${userName}; secure; SameSite=None`,
                        'Content-Type': 'application/json; charset=utf-8'
                    })
                    res.end(`${JSON.stringify({
                        data: {
                            money
                        },
                        msg: '登陆成功'
                    })}`)
                })
            }
            if (urlPathname === '/pay') {
                let obj = {
                    "Content-Type": "application/json; charset=utf-8"
                }
                if (req.headers.origin) {
                    // srcript 和 表单提交 不需要设置 Access-Control-Allow-Origin， 浏览器不拦截。
                    // ajax请求脚本 需要设置 Access-Control-Allow-Origin。
                    obj['Access-Control-Allow-Origin'] = req.headers.origin
                }
                
                let cookieList = parseCookies(req)
                if (cookieList['csrfName']) {
                    if(req.method === 'GET') {
                        var query = urlParams
                        money = money - query.money
                        res.writeHeader(200, obj);
                        res.end(`${JSON.stringify({
                            data: {
                                money: money,
                            },
                            msg: '支付成功'
                        })}`)
                    } else {
                        let data = ''
                        req.on('data', chunk => {
                            data += chunk;
                        })
                        req.on('end', () => {
                            var body
                            if (req.headers['content-type'] && req.headers['content-type'].indexOf('application/json') > -1) {
                                body = JSON.parse(data)
                                // 为 bad.html 跨域post 脚本请求 设置
                                obj['Access-Control-Allow-Credentials'] = 'true'
                            } else {
                                // bad.html form post 提交方式处理
                                body = {}
                                data = data.split('&')[1]
                                data = data.split('=')
                                let key = data[0]
                                let value = data[1]
                                body[key] = Number(value)
                            }
                            money = money - body.money
                            res.writeHeader(200, obj);
                            res.end(`${JSON.stringify({
                                data: {
                                    money: money,
                                },
                                msg: '支付成功'
                            })}`)
                        })
                    }
                } else {
                    res.end(`${JSON.stringify('支付失败，未登录')}`)
                }
            }
        }
    ).listen(8080, "127.0.1.1", function () {
        console.log('https server is on')
    });
})


// server bad.html
// create a certificate authority
async function getKeyAndCertForBad () {
    const ca = await mkcert.createCA({
        organization: 'Hello CA',
        countryCode: 'NP',
        state: 'Bagmati',
        locality: 'Kathmandu',
        validityDays: 365
    });
      
      // then create a tls certificate
    const cert = await mkcert.createCert({
        domains: ['192.168.1.5', 'www.testdomainb.com'],
        validityDays: 365,
        caKey: ca.key,
        caCert: ca.cert
    });
    return cert
}
getKeyAndCertForBad().then(cert => {
    // console.log(cert.key, cert.cert); // certificate info
    https.createServer(
        {
            key: cert.key,
            cert: cert.cert
        },
        (req, res) => {
            if (req.url === '/' || req.url === '/bad.html') {
                fs.readFile(path.resolve(__dirname, './bad.html'), 'utf8', function (err, data) {
                    res.writeHeader(200, {"Content-Type": "text/html"});
                    res.end(data)
                })
            }
        }
    ).listen(8080, "192.168.1.5", function () {
        console.log('https server is on')
    })
})