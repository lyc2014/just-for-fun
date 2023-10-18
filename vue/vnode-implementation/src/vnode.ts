import { Element } from "./element"
export type VNode = {
    sel?: string,
    data?: VNodeData,
    children?: VNode[],
    text?: string,
    key?: number | string,
    elm?: Element
}

export type VNodeData = {
    class?: Record<string, boolean>
    key?: number | string
}

export function vnode (sel?: string, data?: VNodeData, children?: VNode[], text?: string): VNode {
    let key = data &&  data.key ? data.key : undefined
    return { sel, data, children, text, key }
}