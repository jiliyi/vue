import { isObject } from "../utils";

import arrayMethods from './array'



class Observer{
    constructor(data){
        if(Array.isArray(data)){
            //对数组进行劫持;
            data.__proto__ = arrayMethods;
            data.__ob__ = this;
           this.observeArray(data);
        }else{
            this.walk(data);
        }
    }
    walk(data){
        Object.keys(data).forEach(key=>{
            defineReactive(data,key,data[key])
        })
    }
    observeArray(data){
        data.forEach(item=>{
            observe(item)
        })
    }
   
}


function defineReactive(obj,key,val){
    observe(val);
    Object.defineProperty(obj,key,{
        get(){
            
            return val
        },
        set(newV){
            observe(newV)
            val = newV;
        }
    })
}

export function observe(data){
    //传入的不是对象，不监测
    if(!isObject(data)) return
    
    new Observer(data);
}