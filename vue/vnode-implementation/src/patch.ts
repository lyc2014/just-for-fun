import { VNodeWithELm, createElm } from './element'
import { VNode } from './vnode';
export function patchVnode(oldVnode: VNodeWithELm, newVnode: VNode) {
    /**
     * 首先比较是不是相同的node  如果node相同  则 newVnode.elm = oldVnode.elm  然后进行下一步的对比
     *                         如果node不相同  则直接createElm进行替代就行了
     */
    let elm: Element
    let newText= newVnode.text
    let newCh = newVnode.children
    let oldText = oldVnode.text
    let oldCh = oldVnode.children
    if (isSameVnode(oldVnode, newVnode)) {
        elm = newVnode.elm = oldVnode.elm
        if (newText) {
            if (oldText === undefined || oldText !== newText) {
                elm.innerHTML = ''
                elm.appendChild(document.createTextNode(newText))
            }
        } else if (newCh) {
            if (!oldCh) {
                if (oldText) {
                    elm.textContent = ''
                }
                for(let i = 0; i < newCh.length; i++) {
                    let child = newCh[i]
                    elm.insertBefore(createElm(child), null)
                }
            } else {
                updateChildren(elm, oldCh, newCh)
            }
        }
    } else {
        let parent:Element = oldVnode.elm.parentNode
        if (parent) {
            elm = createElm(newVnode)
            parent.insertBefore(elm, oldVnode.elm)
            parent.removeChild(oldVnode.elm)
        }
    }
}
function isSameVnode (vnode1:VNode, vnode2:VNode): boolean {
    let isSameTag = vnode1.sel === vnode2.sel
    let isSameKey = vnode1.key === vnode2.key
    let isSameText = !vnode1.sel ? vnode1.sel === vnode2.sel && vnode1.text === vnode2.text : true
    return isSameTag && isSameKey && isSameText
}
function updateChildren (parentElm: Element, oldCh: VNodeWithELm[], newCh: VNode[]) {
    let oldStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[oldStartIdx]
    let oldEndVnode = oldCh[oldEndIdx]
    let newStartIdx = 0
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[newStartIdx]
    let newEndVnode = newCh[newEndIdx]
    let oldChKeyToIndex
    let elmToMove: VNode

    while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode === undefined) {
            oldStartVnode = oldCh[++oldStartIdx]
        } else if (oldEndVnode === undefined) {
            oldEndVnode = oldCh[--oldEndIdx]
        } else if (isSameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode)
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode)
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        } else {
            if (oldChKeyToIndex === undefined) {
                oldChKeyToIndex = {}
                for(let i = oldStartIdx; i <= oldEndIdx; i++) {
                    let key = oldCh[i].key
                    if (key) {
                        oldChKeyToIndex[key] = i
                    }
                }
            }
            if(oldChKeyToIndex[newStartVnode.key as string] === undefined) {
                parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm)
            } else {
                let index = oldChKeyToIndex[newStartVnode.key as string]
                let elmToMove = oldCh[index]
                patchVnode(elmToMove, newStartVnode)
                oldCh[index] = undefined as any
                parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
            }
            newStartVnode = newCh[++newStartIdx]
        }
    }
    if (newStartIdx <= newEndIdx) {
        let before = newCh[newEndIdx + 1] === undefined ? null : newCh[newEndIdx + 1].elm
        for(; newStartIdx <= newEndIdx; newStartIdx++) {
            parentElm.insertBefore(createElm(newCh[newStartIdx]), before)
        }
    }

    if (oldStartIdx <= oldEndIdx) {
        for(; oldStartIdx <= oldEndIdx; oldStartIdx++) {
            if(oldCh[oldStartIdx] !== undefined) {
                parentElm.removeChild(oldCh[oldStartIdx].elm)
            }
        }
    }

}
