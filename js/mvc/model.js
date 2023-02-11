window.Model = function (options) {
    let resourceName = options.resourceName
    return {
        // 初始化
        init: function () {
            AV.init({
                appId: 'xxxx',
                appKey: 'xxxx'
            })
        },
        fetch: function () {
            var query = new AV.Query(resourceName)
            return query.find()
        },
        save: function (object) {
            var X = AV.Object.extend(resourceName)
            var x = new X()
            return X.save(object)
        }
    }
}