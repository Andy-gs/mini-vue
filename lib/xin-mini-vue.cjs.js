'use strict';

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null
    };
    return vnode;
}

var isObject = function (value) { return value !== null && typeof value === 'object'; };

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
var publicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // setupState
        var setupState = instance.setupState;
        if (key in setupState) {
            return Reflect.get(setupState, key);
        }
        var publicGetter = Reflect.get(publicPropertiesMap, key);
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
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
        var setupResult = setup();
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
    // 判断vnode是不是一个element
    if (typeof vnode.type === 'string') {
        // 处理element
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
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
    var type = vnode.type, props = vnode.props, children = vnode.children;
    var el = (vnode.el = document.createElement(type));
    // string array<TODO>
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    for (var key in props) {
        var value = props[key];
        el.setAttribute(key, value);
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

exports.createApp = createApp;
exports.h = h;
