export function patch(oldVnde, vnode) {
    if (oldVnde.nodeType === 1) {
        let parent = oldVnde.parentNode;
        let node = createEle(vnode)
        parent.insertBefore(node, oldVnde.nextSibling)
        parent.removeChild(oldVnde)
    }
    return vnode.el
}

function createEle(vnode) {
    let { tag, text, children } = vnode;

    if (tag) {
        vnode.el = document.createElement(tag);
        if (children.length) {
            for (const child of children) {
                vnode.el.appendChild(createEle(child))
            }
        }
    } else {
        vnode.el = document.createTextNode(text)
    }

    return vnode.el;
}   