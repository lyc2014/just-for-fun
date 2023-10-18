import { vnode, VNode, VNodeData } from "./vnode";
export type VnodeChild = VNode | string
export type ArrayOrItem<T> = T | T[]
export type VnodeChildren = ArrayOrItem<VnodeChild>

export default function h (sel: string): VNode;
export default function h (sel: string, data?: VNodeData): VNode;
export default function h (sel: string, data?: VNodeData, children?: VnodeChildren): VNode {
    let d: VNodeData | undefined
    let c: VNode [] | undefined
    let text: string | undefined
    if (children !== undefined) {
        if (data !== undefined) {
            d = data
        }
        if (isSignleChild(children)) {
            if (typeof children === 'string') {
                text = children
                c = undefined
            } else {
                c = [children]
            }
        } else {
            for (let i = 0; i < children.length; i++) {
                if (typeof children[i] === 'string') {
                    children[i] = vnode(
                        undefined, // sel
                        undefined, // data
                        undefined, // children
                        children[i] as string // text,
                    )
                }
            }
            c = children as VNode[]
        }
        
    }
    return vnode(sel, data, c, text)
}
function isSignleChild (children: VnodeChildren): children is VnodeChild {
    return !Array.isArray(children)
}