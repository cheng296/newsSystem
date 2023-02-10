const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        'api1',
        createProxyMiddleware({
            target:'http://baidu.com',
            changeOrigin:true    
        })
    )
}