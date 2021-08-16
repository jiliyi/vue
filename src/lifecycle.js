import { patch } from "./vdom/patch"

export function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this;
        let r = patch(vm.$el,vnode);
        console.log(r)  
    }
}

export function mountComponent(vm) {

    let updateComponent = function () {
        vm._update(vm._render())
    }

    updateComponent()
}