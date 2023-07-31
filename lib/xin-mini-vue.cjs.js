'use strict';

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children
    };
    return vnode;
}

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type
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
    patch(vnode);
}
function patch(vnode, container) {
    // TODO
    // 判断vnode是不是一个element
    // 处理element
    // processElement()
    // 处理组件
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    // subTree是一个VNode tree
    var subTree = instance.render();
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree);
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 转换VNod
            // component -> VNode
            // 后续所有逻辑都是基于VNode上处理
            var vnode = createVNode(rootComponent);
            // 调用render函数
            render(vnode);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
