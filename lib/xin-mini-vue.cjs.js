'use strict';

var extend = Object.assign;
var isObject = function (value) { return value !== null && typeof value === 'object'; };
var hasOwn = function (value, key) { return Object.prototype.hasOwnProperty.call(value, key); };
var camelize = function (str) { return str.replace(/-(\w)/g, function (_, c) { return c ? c.toUpperCase() : ''; }); };
var capitalize = function (str) { return str.charAt(0).toUpperCase() + str.slice(1); };
var toHandlerKey = function (str) { return str ? "on".concat(capitalize(str)) : ''; };

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    // children
    if (typeof children === 'string') {
        // 等同于 vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    if ((vnode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) && isObject(children)) {
        vnode.shapeFlag |= 16 /* ShapeFlags.SLOT_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string'
        ? 1 /* ShapeFlags.ELEMENT */
        : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

var targetMap = new Map();
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}

var RefFlags;
(function (RefFlags) {
    RefFlags["IS_REF"] = "__v_isRef";
})(RefFlags || (RefFlags = {}));
RefFlags.IS_REF;

// 不需要每次都创建一个新的get，set，初始化时创建一个即可
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var readonlySet = createSetter(true);
var shallowReadonlyGet = createGetter(true, true);
// 抽离get
function createGetter(isReadonly, isShallowReadonly) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (isShallowReadonly === void 0) { isShallowReadonly = false; }
    return function get(target, key) {
        var res = Reflect.get(target, key);
        // 判断是不是 reactive
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        // 判断是不是shallowReadonly
        if (isShallowReadonly)
            return res;
        // 判断是不是 对象
        if (isObject(res))
            return isReadonly ? readonly(res) : reactive(res);
        return res;
    };
}
// 抽离set
// readonly 的 set 和 reactive 的 set 是有功能的本质区别
// 所以可以不抽离，或者单独抽离一个 readonly 的 set <readonlySet>，我这里是抽离了的
function createSetter(isReadonly) {
    if (isReadonly === void 0) { isReadonly = false; }
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        if (!isReadonly) {
            // 触发依赖
            trigger(target, key);
            return res;
        }
        else {
            console.warn("key".concat(key, "set\u5931\u8D25\uFF0Ctarget\u662F\u53EA\u8BFB"));
            return true;
        }
    };
}
// 不需要每次都创建一个新的get，set，初始化时创建一个即可
var mutableHandlers = {
    get: get,
    set: set
};
var readonlyBaseHandlers = {
    get: readonlyGet,
    set: readonlySet
};
var shallowReadonlyBaseHandlers = extend({}, readonlyBaseHandlers, {
    get: shallowReadonlyGet
});

function reactive(raw) {
    return createActiveObject(raw);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyBaseHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyBaseHandlers);
}
// 如果抽离了 readonly 的 set，这里默认值设不设置都可以，我这里抽离了的，所以默认值放上是可以的
function createActiveObject(raw, beseHandlers) {
    if (beseHandlers === void 0) { beseHandlers = mutableHandlers; }
    if (!isObject(raw))
        console.warn('target必须是一个对象');
    return new Proxy(raw, beseHandlers);
}

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log('emit' + event);
    var props = instance.props;
    var emitHandlerName = toHandlerKey(camelize(event));
    var emitHandler = Reflect.get(props, emitHandlerName);
    emitHandler && emitHandler.apply(void 0, args);
}

function initProps(instance, rawProps) {
    // TODO
    // attr
    // 没有值就给个空对象
    instance.props = rawProps || {};
}

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    $slots: function (i) { return i.slots; },
};
var publicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // setupState
        var setupState = instance.setupState, props = instance.props;
        if (key in setupState) {
            return Reflect.get(setupState, key);
        }
        if (hasOwn(setupState, key)) {
            return Reflect.get(setupState, key);
        }
        else if (hasOwn(props, key)) {
            return Reflect.get(props, key);
        }
        var publicGetter = Reflect.get(publicPropertiesMap, key);
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function initSlots(instance, children) {
    if (instance.vnode.shapeFlag & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        // 不需要赋值了，直接把slots的引用给到它
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    var _loop_1 = function (key) {
        var value = children[key];
        // slot
        slots[key] = function (props) { return normalizeSlotValue(value(props)); };
    };
    for (var key in children) {
        _loop_1(key);
    }
}
function normalizeSlotValue(value) {
    // 和之前要做一样的处理，判断是不是数组
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: function (event) { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    var _a = instance.vnode, props = _a.props, children = _a.children;
    // TODO
    initProps(instance, props);
    initSlots(instance, children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        // setup可以返回一个function，也可以返回一个object
        // 返回function我们认为是它是组件的一个render函数
        // 返回object认为是一个会把object注入到当前的组件的上下文中
        var setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // return function
    // return object
    // 基于上面两种情况判断
    // TODO
    // function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    // 需要保证render是有值的状态
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    // 看看当前的组件有没有对应的render
    var Component = instance.type;
    // 先假设一定有render，要不然跑不起来
    instance.render = Component.render;
}

function render(vnode, container) {
    // patch()
    patch(vnode, container);
}
function patch(vnode, container) {
    vnode.type; vnode.props; vnode.children; var shapeFlag = vnode.shapeFlag;
    // 判断vnode是不是一个element
    if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        // 处理element
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        // 处理组件
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountElement(vnode, container) {
    var type = vnode.type, props = vnode.props, children = vnode.children, shapeFlag = vnode.shapeFlag;
    var el = (vnode.el = document.createElement(type));
    // children
    if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    // props
    for (var key in props) {
        var value = props[key];
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var event_1 = key.slice(2).toLowerCase();
            el.addEventListener(event_1, value);
        }
        else {
            el.setAttribute(key, value);
        }
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}
function mountComponent(initialVNode, container) {
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    // subTree是一个VNode tree
    var subTree = instance.render.call(proxy);
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
    // element -> mount
    initialVNode.el = subTree.el;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 转换VNod
            // component -> VNode
            // 后续所有逻辑都是基于VNode上处理
            var vnode = createVNode(rootComponent);
            // 调用render函数
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    var slot = slots[name];
    if (slot) {
        // 现在的slot是一个function了
        if (typeof slot === 'function') {
            return createVNode('div', {}, slot(props));
        }
    }
}

exports.createApp = createApp;
exports.h = h;
exports.renderSlots = renderSlots;
