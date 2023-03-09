1、首先cookie只能本域名下设置，例如domain为 www.testdomaina.com 的cookie 只能在www.testdomaina.com域名下设置
2、其次cookie不区分端口, 当 secure = false 时也不区分协议。如 secure = true, 同域名的 https设置的cookie 在 http 下获取不到。
3、跨域共享cookie的设置为 secure = true sameSite=None。 即 www.testdomaina.com 设置此类型的cookie， 在其他域名www.testdomainb.com
   下也可以 有权 “共享”， 此处的共享是指 当前页面中 Application => Cookies 能看到 www.testdomaina.com 的cookie, 如果在 www.testdomainb.com
   下发起 www.testdomaina.com 的接口请求  无限制下会带上这个cookie。

cross site request forgery 思路：

利用上面 sameSite=None的特性（设置sameSite=None的话secure必须设置为true）, 也就是只能https协议下才能做到伪造cookie

域名不同情况下：

首先script 和 表单post提交的方式 浏览器不会进行跨域拦截
所以如果上面的cookie如果设置了sameSite=None  那么直接就会把cookie带过去了

ajax脚本的话

1、后端要设置好 Access-Control-Allow-Origin ， 告诉浏览器allow这个域名，不进行response拦截。

2、这种跨域的脚本请求要设置告诉浏览器要带上cookie， 比如fetch请求 mode: 'cors' credentials: 'include'。 cookie才会在request带去给 后端
   然后 后端还需要 在response header上面设置一下  Access-Control-Allow-Credentials = true  浏览器才不会拦截response。