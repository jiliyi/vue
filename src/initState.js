import { isFunction } from "./utils";
import { observe } from './observer/index'
//初始化状态
export default function initState(vm){
    let options = vm.$options;
    
    if(options.data){
        //初始化data
        initData(vm);
    }
    
    if(options.methods){
        //初始化methods
    }
    if(options.props){
        //初始化props
    }
    if(options.computed){
        //初始化computed
    }
    if(options.watch){
        //初始化watch
    }

}

function proxy(vm,source,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key];
        },
        set(newVal){
            vm[source][key] = newVal;
        }
    })    
}

function initData(vm){
    let options = vm.$options;
    let data = options.data;
    data = vm._data = isFunction(data) ? data.call(vm) : data;
    
    for(let key in data){
        //代理，可通过实例直接取数据
        proxy(vm,'_data',key)
    }
    
    observe(data);
}