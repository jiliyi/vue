import { initMixin } from "./init.js";
import { lifeCycleMixin } from "./lifecycle.js";
import { renderMixin } from './render.js';

function Vue(options){
    this._init(options);
}

initMixin(Vue)
lifeCycleMixin(Vue)
renderMixin(Vue)

export default  Vue;