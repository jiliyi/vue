import initState from './initState.js';
import compileToFunction from './compile/index.js';
import { mountComponent } from './lifecycle.js';

export function initMixin(Vue) {

    Vue.prototype._init = function (options) {

        let vm = this;
        vm.$options = options;
        initState(vm)

        if (options.el) {
            this.$mount(options.el)
        }
    }

    Vue.prototype.$mount = function (el) {

        el = document.querySelector(el)
        const vm = this;
        vm.$el = el;
        const options = vm.$options;
        if (!options.render) {
            //用户没传render
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML;
            }
            vm.$options.render = compileToFunction(template);
        }

        mountComponent(vm)

    }
}