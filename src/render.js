import { createElement, createTextNode } from "./vdom/index";

export function renderMixin(Vue) {

    Vue.prototype._c = function () {
        const vm = this;
       return createElement(vm,...arguments)
    }

    Vue.prototype._v = function () {
        const vm = this;
        return createTextNode(vm,...arguments);
    }

    Vue.prototype._s = function (text) {

        if(typeof text == 'object') return JSON.stringify(text);
        return text;
    }

    Vue.prototype._render = function () {

        const vm = this;
        const render = vm.$options.render;
        const vnode = render.call(vm);
        return vnode;
    }
}