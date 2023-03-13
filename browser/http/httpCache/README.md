总结：
1、先判断是否命中强缓存 如 Cache-Control: max-age: 200000000; 命中则直接从dist里拿资源。
2、如果没有命中强缓存，判断是否命中协商缓存，如response中的max-age时间过期了 或者response返回了no-cache 会发起请求， 服务端根据Request Header里的If-None-Match（对应Etag）和If-Modified-Since（对应Last-Modified）判断资源是否过期，没过期则返回304状态码，浏览器依旧用disk里的资源。如果资源过期，则服务端会返回新的资源；
3、如果也没有命中协商缓存，则这个请求不走缓存策略，发起真实的请求，从服务端拿资源；

request中的 cache-contrl

Cache-Control:max-age=0
这个值表示，这个请求按照协商缓存的规则走，一定会发出真实的请求。
Cache-Control:no-cache
这个值一般会附带Pragma: no-cache，是为了兼容http1.0。表示这次请求不会读缓存资源，即便缓存没有过期，或者资源并没有修改，这样的请求不会有返回304的可能。这一点和响应头里的Cache-Control:no-cache是有区别的。
Request Header里Cache-Control只有这两个值可取，设置其他的值无效

Ctrl + F5 (强制刷新)：：request header多了cache-control： no-cache （重新获取请求,不会读取缓存）
• F5 (刷新)/ctrl+R刷新：：request header多了 cache-control： max-age=0 （需要先验证，通过请求头信息知道未过期的话，后端返回304,前端取缓存）
