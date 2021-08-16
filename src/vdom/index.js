export function createElement(vm, tag, data = {},...children) {

    return vNode(vm,tag,data,data.key,children,undefined);
}

export function createTextNode(vm, text) {

    return vNode(vm,undefined,undefined,undefined,undefined,text);
}

function vNode(vm, tag, data, key, children, text) {
    return {
        vm,
        tag,
        data,
        key,
        children,
        text
    }
}