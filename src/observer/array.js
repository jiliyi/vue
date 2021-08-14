const oldArrayProto = Array.prototype;
const Methods = ['splice', 'push', 'pop', 'shift', 'unshift', 'sort', 'reverse'];
const arrayMethods = Object.create(oldArrayProto)

arrayMethods.__proto__ = Array.prototype;

Methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        const ob = this.__ob__.observeArray;
        oldArrayProto[method].call(this, ...args);
        let addItem = null;
        switch (method) {
            case 'push':
                addItem = args;
                break;
            case 'unshift':
                addItem = args;
                break;
            case 'splice':
                addItem = args.slice(2);
                break;
        }
         ob(addItem)
    }
})



export default arrayMethods