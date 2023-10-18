import { VNode } from "./vnode";

export type VNodeWithELm = VNode & {
    elm: Element,
    children?: VNodeWithELm[]
}

export type Element = any


export function createElm (vnode: VNode): Element {
    let tag = vnode.sel
    let children = vnode.children
    let text = vnode.text
    let elm: Element
    if (tag) {
        elm = document.createElement(tag)
        if (children) {
            for (let i = 0; i < children.length; i++) {
                elm.appendChild(createElm(children[i]))
            }
        } else if (typeof text === 'string') {
            elm.appendChild(document.createTextNode(text))
        }
    } else {
        if (typeof text === 'string') {
            elm = document.createTextNode(text)
        }
    }
    vnode.elm = elm
    return elm
}

export function mount (elm: Element, vnode: VNodeWithELm) {
    elm.innerHTML = ''
    elm.appendChild(vnode.elm)
}