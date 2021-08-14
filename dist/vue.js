(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isFunction(val) {
    return typeof val == 'function';
  }
  function isObject(val) {
    return _typeof(val) == 'object' && val != 'null';
  }

  var oldArrayProto = Array.prototype;
  var Methods = ['splice', 'push', 'pop', 'shift', 'unshift', 'sort', 'reverse'];
  var arrayMethods = Object.create(oldArrayProto);
  arrayMethods.__proto__ = Array.prototype;
  Methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayProto$method;

      var ob = this.__ob__.observeArray;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));

      var addItem = null;

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

      ob(addItem);
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      if (Array.isArray(data)) {
        //对数组进行劫持;
        data.__proto__ = arrayMethods;
        data.__ob__ = this;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(obj, key, val) {
    observe(val);
    Object.defineProperty(obj, key, {
      get: function get() {
        return val;
      },
      set: function set(newV) {
        observe(newV);
        val = newV;
      }
    });
  }

  function observe(data) {
    //传入的不是对象，不监测
    if (!isObject(data)) return;
    new Observer(data);
  }

  function initState(vm) {
    var options = vm.$options;

    if (options.data) {
      //初始化data
      initData(vm);
    }

    if (options.methods) ;

    if (options.props) ;

    if (options.computed) ;

    if (options.watch) ;
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }

  function initData(vm) {
    var options = vm.$options;
    var data = options.data;
    data = vm._data = isFunction(data) ? data.call(vm) : data;

    for (var key in data) {
      //代理，可通过实例直接取数据
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名 

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //  用来获取的标签名的 match后的索引为1的

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配开始标签的 

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配闭合标签的
  //           aa  =   "  xxx "  | '  xxxx '  | xxx

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b  a="b"  a='b'

  var startTagClose = /^\s*(\/?)>/; //     />   <div/>
  //  <div id="app">{{ msg }}</div>

  /**
   * 处理开始标签的token
   * @param {*} tagName 
   * @param {*} attributes 
   */

  function start(tagName, attributes) {
    console.log('开始标签', tagName, attributes);
  }

  function _char(text) {
    console.log('文本', text);
  }

  function end(tagName) {
    // 处理结束标签
    console.log('结束标签', tagName);
  }

  function parserHTML(html) {
    function advance(len) {
      html = html.substring(len);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attributes: []
        }; //删除匹配成功的部分

        advance(start[0].length); //下一步，匹配属性

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attributes.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        advance(_end[0].length); //删除开始标签的 >

        return match;
      }

      return false;
    }

    while (html) {
      //有html继续解析
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        //step one 开始标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attributes);
        }

        var endTagMatch = html.match(endTag); // step three 结束标签

        if (endTagMatch) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);

        _char(text);
      }
    }
  }

  function compileToFunction (template) {
    parserHTML(template);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$el = options.el;
      vm.$options = options;
      initState(vm);

      if (options.el) {
        this.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      el = document.querySelector(el);
      var vm = this;
      var options = vm.$options;

      if (!options.render) {
        //用户没传render
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction(template);
        vm.render = render;
      }
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
