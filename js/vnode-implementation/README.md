### VNode节点

VNode: { sel: 'div', data: {}, children: [VNode], text: '', key: xx }

### h 函数
    多态函数  多种传参格式 都返回 符合格式的 vnode节点

### createElm
    根据vnode 树  创建一个dom树

### mount
    vnode树构建出来的dom树  挂载在根节点下

### patchVnode
    节点相同的话进一步比较子节点
    节点不同的话直接替代
    新增节点就 add
    老节点用不着就 remove