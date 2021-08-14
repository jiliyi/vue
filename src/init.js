import initState from './initState.js';
import compileToFunction from './compile/index.js';
export function initMixin(Vue){
    Vue.prototype._init = function(options){
        let vm = this;
        vm.$el = options.el;
        vm.$options = options;
        initState(vm)

        if(options.el){
            this.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function(el){
        el = document.querySelector(el)
        const vm = this;
        const options = vm.$options;
        if(!options.render){
            //用户没传render
            let template = options.template;
            if(!template && el){
                template = el.outerHTML;
            }
            let render = compileToFunction(template);
            vm.render = render;
        }
    }
}