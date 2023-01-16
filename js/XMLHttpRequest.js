
// 理解 主线程 和 网络线程 通信过程

// 0 unsent 代理被创建，但尚未调用open()方法
// 1 opened open（）方法已被调用
// 2 headers-received send()方法已经被调用，并且头部状态已经可获得
// 3.loading 下载中
// 4 done 下载操作已完成。

function sleep (delay) {
    let startTime = +new Date()
    while(+new Date() - startTime) {}
}
var xhr = new XMLHttpRequest()
console.log(xhr.readyState)
let n = 0
xhr.addEventListener('readystatechange', function (readyState) {
    // 把网络设置得很慢 会发现持续有间隔时间的打印 3 。 证明在下载资源期间，网络线程会有间隔时间的往任务队列里面推任务
    // 并且response的length是慢慢在增大  
    // console.log(this.readyState)
    if (this.readyState === 3) {
        n++
        console.log('response', n, this.response.length)
    }
    if (this.readyState === 4 && this.status === 200) {
        // console.log(this.responseText)
    }
    setInterval(function () {
        console.log('定时器监控', xhr.response.length)
        if (n === 4) {
            // 这个指令 不仅会让readyState 编程 UNSENT (0) 而且还会通知 网络线程 终止请求。
            xhr.abort()
        }
    }, 1000)
    // setTimeout(function () {
    //     xhr.abort()
    // }, 5000)
}, false)
xhr.open('GET', 'https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap.css', true)
console.log('xhr is opened')
sleep(2000)
xhr.send()
console.log('执行完了')

// response 2437
// 35次 定时器监控 2437
// response 9622
// 35次 定时器监控 9622

// 证明 xhr.response 的传输过程是通过 任务队列 传过来的， 也就是发生在了 网络线程定时间隔时间往任务队列推任务 =》 时间循环执行任务队列里的任务。
