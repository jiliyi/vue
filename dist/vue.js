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

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
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
  //  <div id="app" name=aa age='19'>
  //      <ul data-id="10">
  //          <li>{{text}}</li>
  //          <li class="item">{{一小项}}</li>
  //      </ul>
  //  </div> 

  var stack = [];
  var root; // const arr = {
  //     tag: 'xx',
  //     parent : ''
  //     attribute: [],
  //     children: [
  //         { tagName: 'a', attribute: [], children: [] },
  //         { tagName: 'a', attribute: [], children: [] },
  //     ]
  // }

  /**
   * 处理开始标签的token
   * @param {*} tagName 
   * @param {*} attributes 
   */

  function start(tagName, attributes) {
    var parent = stack[stack.length - 1];
    var element = {
      tag: tagName,
      type: 1,
      // 类型为dom
      attributes: attributes,
      children: []
    };

    if (parent) {
      parent.children.push(element);
    } else {
      root = element;
    }

    element.parent = parent;
    stack.push(element);
  }

  function _char(text) {
    text = text.replace(/\s/g, '');

    if (text) {
      var cur = stack[stack.length - 1];
      cur.children.push({
        type: 3,
        //指代文本元素
        text: text
      });
    }
  }

  function end(tagName) {
    // 处理结束标签
    var last = stack.pop();

    if (last.tag !== tagName) {
      throw new Error('endTag Not Match');
    }
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

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}

  function genAttr(attributes) {
    var str = '';

    var _iterator = _createForOfIteratorHelper(attributes),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var attr = _step.value;

        if (attr.name === 'style') {
          (function () {
            var styleObj = {};
            attr.value.replace(/([^:;]+)\:([^:;]+)/g, function (n1, n2, n3) {
              styleObj[n2] = n3;
            });
            attr.value = styleObj;
          })();
        }

        str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChar(_char) {
    var text = _char.text;

    if (!defaultTagRE.test(text)) {
      return "_v(".concat(text, ")");
    } else {
      defaultTagRE.lastIndex = 0;
      var tokens = [];
      var match;
      var lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        // name {{ age }} sex {{a }}
        var index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1], ")")); // 处理可能是对象的情况

        lastIndex = match[0].length + index;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genChildren(el) {
    var str = '';

    var _iterator2 = _createForOfIteratorHelper(el.children),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var child = _step2.value;

        if (child.type === 1) {
          str += "".concat(generate(child), ",");
        } else {
          str += "".concat(genChar(child), ",");
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return "".concat(str.slice(0, -1));
  }

  function generate(root) {
    //_c('div',{id:'app',name : '1'},'text')
    var children = genChildren(root);
    return "_c('".concat(root.tag, "',").concat(root.attributes.length ? genAttr(root.attributes) : undefined).concat(children ? ",".concat(children) : '', ")");
  }

  function compileToFunction (template) {
    var root = parserHTML(template);
    var code = generate(root);
    return new Function("with(this){return ".concat(code, "}")); // 模板引擎
  }

  function patch(oldVnde, vnode) {
    if (oldVnde.nodeType === 1) {
      var parent = oldVnde.parentNode;
      var node = createEle(vnode);
      parent.insertBefore(node, oldVnde.nextSibling);
      parent.removeChild(oldVnde);
    }

    return vnode.el;
  }

  function createEle(vnode) {
    var tag = vnode.tag,
        text = vnode.text,
        children = vnode.children;

    if (tag) {
      vnode.el = document.createElement(tag);

      if (children.length) {
        var _iterator = _createForOfIteratorHelper(children),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var child = _step.value;
            vnode.el.appendChild(createEle(child));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var r = patch(vm.$el, vnode);
      console.log(r);
    };
  }
  function mountComponent(vm) {
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

    updateComponent();
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);

      if (options.el) {
        this.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      el = document.querySelector(el);
      var vm = this;
      vm.$el = el;
      var options = vm.$options;

      if (!options.render) {
        //用户没传render
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        vm.$options.render = compileToFunction(template);
      }

      mountComponent(vm);
    };
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vNode(vm, tag, data, data.key, children, undefined);
  }
  function createTextNode(vm, text) {
    return vNode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vNode(vm, tag, data, key, children, text) {
    return {
      vm: vm,
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      var vm = this;
      return createElement.apply(void 0, [vm].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function () {
      var vm = this;
      return createTextNode.apply(void 0, [vm].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._s = function (text) {
      if (_typeof(text) == 'object') return JSON.stringify(text);
      return text;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  lifeCycleMixin(Vue);
  renderMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
