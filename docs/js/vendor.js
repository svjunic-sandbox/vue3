(window["sandbox"] = window["sandbox"] || []).push([["vendor"],{

/***/ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js ***!
  \*********************************************************************/
/*! exports provided: ITERATE_KEY, computed, customRef, effect, enableTracking, isProxy, isReactive, isReadonly, isRef, markRaw, pauseTracking, reactive, readonly, ref, resetTracking, shallowReactive, shallowReadonly, shallowRef, stop, toRaw, toRef, toRefs, track, trigger, triggerRef, unref */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ITERATE_KEY", function() { return ITERATE_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "computed", function() { return computed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "customRef", function() { return customRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "effect", function() { return effect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enableTracking", function() { return enableTracking; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isProxy", function() { return isProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isReactive", function() { return isReactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isReadonly", function() { return isReadonly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRef", function() { return isRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "markRaw", function() { return markRaw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pauseTracking", function() { return pauseTracking; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reactive", function() { return reactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readonly", function() { return readonly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ref", function() { return ref; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetTracking", function() { return resetTracking; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shallowReactive", function() { return shallowReactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shallowReadonly", function() { return shallowReadonly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shallowRef", function() { return shallowRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stop", function() { return stop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRaw", function() { return toRaw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRef", function() { return toRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRefs", function() { return toRefs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "track", function() { return track; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trigger", function() { return trigger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "triggerRef", function() { return triggerRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unref", function() { return unref; });
/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");


const targetMap = new WeakMap();
const effectStack = [];
let activeEffect;
const ITERATE_KEY = Symbol(( true) ? 'iterate' : undefined);
const MAP_KEY_ITERATE_KEY = Symbol(( true) ? 'Map key iterate' : undefined);
function isEffect(fn) {
    return fn && fn._isEffect === true;
}
function effect(fn, options = _vue_shared__WEBPACK_IMPORTED_MODULE_0__["EMPTY_OBJ"]) {
    if (isEffect(fn)) {
        fn = fn.raw;
    }
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}
function stop(effect) {
    if (effect.active) {
        cleanup(effect);
        if (effect.options.onStop) {
            effect.options.onStop();
        }
        effect.active = false;
    }
}
let uid = 0;
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effect.active) {
            return options.scheduler ? undefined : fn();
        }
        if (!effectStack.includes(effect)) {
            cleanup(effect);
            try {
                enableTracking();
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            }
            finally {
                effectStack.pop();
                resetTracking();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    };
    effect.id = uid++;
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
}
function cleanup(effect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
}
function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
}
function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
}
function track(target, type, key) {
    if (!shouldTrack || activeEffect === undefined) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if (( true) && activeEffect.options.onTrack) {
            activeEffect.options.onTrack({
                effect: activeEffect,
                target,
                type,
                key
            });
        }
    }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        // never been tracked
        return;
    }
    const effects = new Set();
    const add = (effectsToAdd) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => {
                if (effect !== activeEffect || !shouldTrack) {
                    effects.add(effect);
                }
            });
        }
    };
    if (type === "clear" /* CLEAR */) {
        // collection being cleared
        // trigger all effects for target
        depsMap.forEach(add);
    }
    else if (key === 'length' && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isArray"])(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= newValue) {
                add(dep);
            }
        });
    }
    else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            add(depsMap.get(key));
        }
        // also run for iteration key on ADD | DELETE | Map.SET
        const isAddOrDelete = type === "add" /* ADD */ ||
            (type === "delete" /* DELETE */ && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isArray"])(target));
        if (isAddOrDelete ||
            (type === "set" /* SET */ && target instanceof Map)) {
            add(depsMap.get(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isArray"])(target) ? 'length' : ITERATE_KEY));
        }
        if (isAddOrDelete && target instanceof Map) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY));
        }
    }
    const run = (effect) => {
        if (( true) && effect.options.onTrigger) {
            effect.options.onTrigger({
                effect,
                target,
                key,
                type,
                newValue,
                oldValue,
                oldTarget
            });
        }
        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        }
        else {
            effect();
        }
    };
    effects.forEach(run);
}

const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
    .map(key => Symbol[key])
    .filter(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isSymbol"]));
const get = /*#__PURE__*/ createGetter();
const shallowGet = /*#__PURE__*/ createGetter(false, true);
const readonlyGet = /*#__PURE__*/ createGetter(true);
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true);
const arrayInstrumentations = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
    arrayInstrumentations[key] = function (...args) {
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++) {
            track(arr, "get" /* GET */, i + '');
        }
        // we run the method using the original args first (which may be reactive)
        const res = arr[key](...args);
        if (res === -1 || res === false) {
            // if that didn't work, run it again using raw values.
            return arr[key](...args.map(toRaw));
        }
        else {
            return res;
        }
    };
});
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        else if (key === "__v_raw" /* RAW */ &&
            receiver ===
                (isReadonly
                    ? target["__v_readonly" /* READONLY */]
                    : target["__v_reactive" /* REACTIVE */])) {
            return target;
        }
        const targetIsArray = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isArray"])(target);
        if (targetIsArray && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["hasOwn"])(arrayInstrumentations, key)) {
            return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isSymbol"])(key)
            ? builtInSymbols.has(key)
            : key === `__proto__` || key === `__v_isRef`) {
            return res;
        }
        if (!isReadonly) {
            track(target, "get" /* GET */, key);
        }
        if (shallow) {
            return res;
        }
        if (isRef(res)) {
            // ref unwrapping, only for Objects, not for Arrays.
            return targetIsArray ? res : res.value;
        }
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isObject"])(res)) {
            // Convert returned value into a proxy as well. we do the isObject check
            // here to avoid invalid value warning. Also need to lazy access readonly
            // and reactive here to avoid circular dependency.
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
const set = /*#__PURE__*/ createSetter();
const shallowSet = /*#__PURE__*/ createSetter(true);
function createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
        const oldValue = target[key];
        if (!shallow) {
            value = toRaw(value);
            if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isArray"])(target) && isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
                return true;
            }
        }
        const hadKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["hasOwn"])(target, key);
        const result = Reflect.set(target, key, value, receiver);
        // don't trigger if target is something up in the prototype chain of original
        if (target === toRaw(receiver)) {
            if (!hadKey) {
                trigger(target, "add" /* ADD */, key, value);
            }
            else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["hasChanged"])(value, oldValue)) {
                trigger(target, "set" /* SET */, key, value, oldValue);
            }
        }
        return result;
    };
}
function deleteProperty(target, key) {
    const hadKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["hasOwn"])(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
    }
    return result;
}
function has(target, key) {
    const result = Reflect.has(target, key);
    track(target, "has" /* HAS */, key);
    return result;
}
function ownKeys(target) {
    track(target, "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.ownKeys(target);
}
const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
};
const readonlyHandlers = {
    get: readonlyGet,
    has,
    ownKeys,
    set(target, key) {
        if ((true)) {
            console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
    },
    deleteProperty(target, key) {
        if ((true)) {
            console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
    }
};
const shallowReactiveHandlers = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["extend"])({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
});
// Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.
const shallowReadonlyHandlers = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["extend"])({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

const toReactive = (value) => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isObject"])(value) ? reactive(value) : value;
const toReadonly = (value) => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isObject"])(value) ? readonly(value) : value;
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, wrap) {
    target = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
        track(target, "get" /* GET */, key);
    }
    track(target, "get" /* GET */, rawKey);
    const { has, get } = getProto(target);
    if (has.call(target, key)) {
        return wrap(get.call(target, key));
    }
    else if (has.call(target, rawKey)) {
        return wrap(get.call(target, rawKey));
    }
}
function has$1(key) {
    const target = toRaw(this);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
        track(target, "has" /* HAS */, key);
    }
    track(target, "has" /* HAS */, rawKey);
    const has = getProto(target).has;
    return has.call(target, key) || has.call(target, rawKey);
}
function size(target) {
    target = toRaw(target);
    track(target, "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.get(getProto(target), 'size', target);
}
function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    const result = proto.add.call(target, value);
    if (!hadKey) {
        trigger(target, "add" /* ADD */, value, value);
    }
    return result;
}
function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has, get, set } = getProto(target);
    let hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    }
    else if ((true)) {
        checkIdentityKeys(target, has, key);
    }
    const oldValue = get.call(target, key);
    const result = set.call(target, key, value);
    if (!hadKey) {
        trigger(target, "add" /* ADD */, key, value);
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["hasChanged"])(value, oldValue)) {
        trigger(target, "set" /* SET */, key, value, oldValue);
    }
    return result;
}
function deleteEntry(key) {
    const target = toRaw(this);
    const { has, get, delete: del } = getProto(target);
    let hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    }
    else if ((true)) {
        checkIdentityKeys(target, has, key);
    }
    const oldValue = get ? get.call(target, key) : undefined;
    // forward the operation before queueing reactions
    const result = del.call(target, key);
    if (hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
    }
    return result;
}
function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = ( true)
        ? target instanceof Map
            ? new Map(target)
            : new Set(target)
        : undefined;
    // forward the operation before queueing reactions
    const result = getProto(target).clear.call(target);
    if (hadItems) {
        trigger(target, "clear" /* CLEAR */, undefined, undefined, oldTarget);
    }
    return result;
}
function createForEach(isReadonly, shallow) {
    return function forEach(callback, thisArg) {
        const observed = this;
        const target = toRaw(observed);
        const wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive;
        !isReadonly && track(target, "iterate" /* ITERATE */, ITERATE_KEY);
        // important: create sure the callback is
        // 1. invoked with the reactive map as `this` and 3rd arg
        // 2. the value received should be a corresponding reactive/readonly.
        function wrappedCallback(value, key) {
            return callback.call(thisArg, wrap(value), wrap(key), observed);
        }
        return getProto(target).forEach.call(target, wrappedCallback);
    };
}
function createIterableMethod(method, isReadonly, shallow) {
    return function (...args) {
        const target = toRaw(this);
        const isMap = target instanceof Map;
        const isPair = method === 'entries' || (method === Symbol.iterator && isMap);
        const isKeyOnly = method === 'keys' && isMap;
        const innerIterator = getProto(target)[method].apply(target, args);
        const wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive;
        !isReadonly &&
            track(target, "iterate" /* ITERATE */, isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        // return a wrapped iterator which returns observed versions of the
        // values emitted from the real iterator
        return {
            // iterator protocol
            next() {
                const { value, done } = innerIterator.next();
                return done
                    ? { value, done }
                    : {
                        value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                        done
                    };
            },
            // iterable protocol
            [Symbol.iterator]() {
                return this;
            }
        };
    };
}
function createReadonlyMethod(type) {
    return function (...args) {
        if ((true)) {
            const key = args[0] ? `on key "${args[0]}" ` : ``;
            console.warn(`${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["capitalize"])(type)} operation ${key}failed: target is readonly.`, toRaw(this));
        }
        return type === "delete" /* DELETE */ ? false : this;
    };
}
const mutableInstrumentations = {
    get(key) {
        return get$1(this, key, toReactive);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
};
const shallowInstrumentations = {
    get(key) {
        return get$1(this, key, toShallow);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
};
const readonlyInstrumentations = {
    get(key) {
        return get$1(this, key, toReadonly);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add: createReadonlyMethod("add" /* ADD */),
    set: createReadonlyMethod("set" /* SET */),
    delete: createReadonlyMethod("delete" /* DELETE */),
    clear: createReadonlyMethod("clear" /* CLEAR */),
    forEach: createForEach(true, false)
};
const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
iteratorMethods.forEach(method => {
    mutableInstrumentations[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations[method] = createIterableMethod(method, true, false);
    shallowInstrumentations[method] = createIterableMethod(method, false, true);
});
function createInstrumentationGetter(isReadonly, shallow) {
    const instrumentations = shallow
        ? shallowInstrumentations
        : isReadonly
            ? readonlyInstrumentations
            : mutableInstrumentations;
    return (target, key, receiver) => {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        else if (key === "__v_raw" /* RAW */) {
            return target;
        }
        return Reflect.get(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["hasOwn"])(instrumentations, key) && key in target
            ? instrumentations
            : target, key, receiver);
    };
}
const mutableCollectionHandlers = {
    get: createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
    get: createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, false)
};
function checkIdentityKeys(target, has, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has.call(target, rawKey)) {
        const type = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["toRawType"])(target);
        console.warn(`Reactive ${type} contains both the raw and reactive ` +
            `versions of the same object${type === `Map` ? `as keys` : ``}, ` +
            `which can lead to inconsistencies. ` +
            `Avoid differentiating between the raw and reactive versions ` +
            `of an object and only use the reactive version if possible.`);
    }
}

const collectionTypes = new Set([Set, Map, WeakMap, WeakSet]);
const isObservableType = /*#__PURE__*/ Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["makeMap"])('Object,Array,Map,Set,WeakMap,WeakSet');
const canObserve = (value) => {
    return (!value["__v_skip" /* SKIP */] &&
        isObservableType(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["toRawType"])(value)) &&
        !Object.isFrozen(value));
};
function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (target && target["__v_isReadonly" /* IS_READONLY */]) {
        return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers);
}
// Return a reactive-copy of the original object, where only the root level
// properties are reactive, and does NOT unwrap refs nor recursively convert
// returned properties.
function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers);
}
function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers);
}
// Return a reactive-copy of the original object, where only the root level
// properties are readonly, and does NOT unwrap refs nor recursively convert
// returned properties.
// This is used for creating the props proxy object for stateful components.
function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, readonlyCollectionHandlers);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers) {
    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isObject"])(target)) {
        if ((true)) {
            console.warn(`value cannot be made reactive: ${String(target)}`);
        }
        return target;
    }
    // target is already a Proxy, return it.
    // exception: calling readonly() on a reactive object
    if (target["__v_raw" /* RAW */] &&
        !(isReadonly && target["__v_isReactive" /* IS_REACTIVE */])) {
        return target;
    }
    // target already has corresponding Proxy
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["hasOwn"])(target, isReadonly ? "__v_readonly" /* READONLY */ : "__v_reactive" /* REACTIVE */)) {
        return isReadonly
            ? target["__v_readonly" /* READONLY */]
            : target["__v_reactive" /* REACTIVE */];
    }
    // only a whitelist of value types can be observed.
    if (!canObserve(target)) {
        return target;
    }
    const observed = new Proxy(target, collectionTypes.has(target.constructor) ? collectionHandlers : baseHandlers);
    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["def"])(target, isReadonly ? "__v_readonly" /* READONLY */ : "__v_reactive" /* REACTIVE */, observed);
    return observed;
}
function isReactive(value) {
    if (isReadonly(value)) {
        return isReactive(value["__v_raw" /* RAW */]);
    }
    return !!(value && value["__v_isReactive" /* IS_REACTIVE */]);
}
function isReadonly(value) {
    return !!(value && value["__v_isReadonly" /* IS_READONLY */]);
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
    return ((observed && toRaw(observed["__v_raw" /* RAW */])) || observed);
}
function markRaw(value) {
    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["def"])(value, "__v_skip" /* SKIP */, true);
    return value;
}

const convert = (val) => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isObject"])(val) ? reactive(val) : val;
function isRef(r) {
    return r ? r.__v_isRef === true : false;
}
function ref(value) {
    return createRef(value);
}
function shallowRef(value) {
    return createRef(value, true);
}
function createRef(rawValue, shallow = false) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    let value = shallow ? rawValue : convert(rawValue);
    const r = {
        __v_isRef: true,
        get value() {
            track(r, "get" /* GET */, 'value');
            return value;
        },
        set value(newVal) {
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["hasChanged"])(toRaw(newVal), rawValue)) {
                rawValue = newVal;
                value = shallow ? newVal : convert(newVal);
                trigger(r, "set" /* SET */, 'value', ( true) ? { newValue: newVal } : undefined);
            }
        }
    };
    return r;
}
function triggerRef(ref) {
    trigger(ref, "set" /* SET */, 'value', ( true) ? { newValue: ref.value } : undefined);
}
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
function customRef(factory) {
    const { get, set } = factory(() => track(r, "get" /* GET */, 'value'), () => trigger(r, "set" /* SET */, 'value'));
    const r = {
        __v_isRef: true,
        get value() {
            return get();
        },
        set value(v) {
            set(v);
        }
    };
    return r;
}
function toRefs(object) {
    if (( true) && !isProxy(object)) {
        console.warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
function toRef(object, key) {
    return {
        __v_isRef: true,
        get value() {
            return object[key];
        },
        set value(newVal) {
            object[key] = newVal;
        }
    };
}

function computed(getterOrOptions) {
    let getter;
    let setter;
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__["isFunction"])(getterOrOptions)) {
        getter = getterOrOptions;
        setter = ( true)
            ? () => {
                console.warn('Write operation failed: computed value is readonly');
            }
            : undefined;
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    let dirty = true;
    let value;
    let computed;
    const runner = effect(getter, {
        lazy: true,
        scheduler: () => {
            if (!dirty) {
                dirty = true;
                trigger(computed, "set" /* SET */, 'value');
            }
        }
    });
    computed = {
        __v_isRef: true,
        // expose effect so computed can be stopped
        effect: runner,
        get value() {
            if (dirty) {
                value = runner();
                dirty = false;
            }
            track(computed, "get" /* GET */, 'value');
            return value;
        },
        set value(newValue) {
            setter(newValue);
        }
    };
    return computed;
}




/***/ }),

/***/ "./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js ***!
  \*************************************************************************/
/*! exports provided: customRef, isProxy, isReactive, isReadonly, isRef, markRaw, reactive, readonly, ref, shallowReactive, shallowReadonly, shallowRef, toRaw, toRef, toRefs, triggerRef, unref, camelize, capitalize, toDisplayString, BaseTransition, Comment, Fragment, KeepAlive, Static, Suspense, Teleport, Text, callWithAsyncErrorHandling, callWithErrorHandling, cloneVNode, computed, createBlock, createCommentVNode, createHydrationRenderer, createRenderer, createSlots, createStaticVNode, createTextVNode, createVNode, defineAsyncComponent, defineComponent, devtools, getCurrentInstance, getTransitionRawChildren, h, handleError, inject, isVNode, mergeProps, nextTick, onActivated, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onDeactivated, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onUnmounted, onUpdated, openBlock, popScopeId, provide, pushScopeId, queuePostFlushCb, registerRuntimeCompiler, renderList, renderSlot, resolveComponent, resolveDirective, resolveDynamicComponent, resolveTransitionHooks, setBlockTracking, setDevtoolsHook, setTransitionHooks, ssrContextKey, ssrUtils, toHandlers, transformVNodeArgs, useSSRContext, useTransitionState, version, warn, watch, watchEffect, withCtx, withDirectives, withScopeId */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseTransition", function() { return BaseTransition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Comment", function() { return Comment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fragment", function() { return Fragment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KeepAlive", function() { return KeepAlive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Static", function() { return Static; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Suspense", function() { return Suspense; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Teleport", function() { return Teleport; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "callWithAsyncErrorHandling", function() { return callWithAsyncErrorHandling; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "callWithErrorHandling", function() { return callWithErrorHandling; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneVNode", function() { return cloneVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "computed", function() { return computed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createBlock", function() { return createBlock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCommentVNode", function() { return createCommentVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createHydrationRenderer", function() { return createHydrationRenderer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRenderer", function() { return createRenderer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSlots", function() { return createSlots; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createStaticVNode", function() { return createStaticVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTextVNode", function() { return createTextVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createVNode", function() { return createVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineAsyncComponent", function() { return defineAsyncComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineComponent", function() { return defineComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "devtools", function() { return devtools; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentInstance", function() { return getCurrentInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTransitionRawChildren", function() { return getTransitionRawChildren; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleError", function() { return handleError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inject", function() { return inject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isVNode", function() { return isVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeProps", function() { return mergeProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nextTick", function() { return nextTick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onActivated", function() { return onActivated; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onBeforeMount", function() { return onBeforeMount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onBeforeUnmount", function() { return onBeforeUnmount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onBeforeUpdate", function() { return onBeforeUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onDeactivated", function() { return onDeactivated; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onErrorCaptured", function() { return onErrorCaptured; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onMounted", function() { return onMounted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onRenderTracked", function() { return onRenderTracked; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onRenderTriggered", function() { return onRenderTriggered; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onUnmounted", function() { return onUnmounted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onUpdated", function() { return onUpdated; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openBlock", function() { return openBlock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "popScopeId", function() { return popScopeId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "provide", function() { return provide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pushScopeId", function() { return pushScopeId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "queuePostFlushCb", function() { return queuePostFlushCb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerRuntimeCompiler", function() { return registerRuntimeCompiler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderList", function() { return renderList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderSlot", function() { return renderSlot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveComponent", function() { return resolveComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveDirective", function() { return resolveDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveDynamicComponent", function() { return resolveDynamicComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveTransitionHooks", function() { return resolveTransitionHooks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setBlockTracking", function() { return setBlockTracking; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setDevtoolsHook", function() { return setDevtoolsHook; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setTransitionHooks", function() { return setTransitionHooks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ssrContextKey", function() { return ssrContextKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ssrUtils", function() { return ssrUtils; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHandlers", function() { return toHandlers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformVNodeArgs", function() { return transformVNodeArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useSSRContext", function() { return useSSRContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useTransitionState", function() { return useTransitionState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "warn", function() { return warn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "watch", function() { return watch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "watchEffect", function() { return watchEffect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withCtx", function() { return withCtx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withDirectives", function() { return withDirectives; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withScopeId", function() { return withScopeId; });
/* harmony import */ var _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/reactivity */ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "customRef", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["customRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isProxy", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isReactive", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isReactive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isReadonly", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isReadonly"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isRef", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "markRaw", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["markRaw"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "reactive", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["reactive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "readonly", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["readonly"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ref", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["ref"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shallowReactive", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["shallowReactive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shallowReadonly", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["shallowReadonly"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shallowRef", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["shallowRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toRaw", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRaw"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toRef", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toRefs", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRefs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "triggerRef", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["triggerRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "unref", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["unref"]; });

/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "camelize", function() { return _vue_shared__WEBPACK_IMPORTED_MODULE_1__["camelize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return _vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toDisplayString", function() { return _vue_shared__WEBPACK_IMPORTED_MODULE_1__["toDisplayString"]; });






const stack = [];
function pushWarningContext(vnode) {
    stack.push(vnode);
}
function popWarningContext() {
    stack.pop();
}
function warn(msg, ...args) {
    // avoid props formatting or warn handler tracking deps that might be mutated
    // during patch, leading to infinite recursion.
    Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["pauseTracking"])();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
        callWithErrorHandling(appWarnHandler, instance, 11 /* APP_WARN_HANDLER */, [
            msg + args.join(''),
            instance && instance.proxy,
            trace
                .map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`)
                .join('\n'),
            trace
        ]);
    }
    else {
        const warnArgs = [`[Vue warn]: ${msg}`, ...args];
        /* istanbul ignore if */
        if (trace.length &&
            // avoid spamming console during tests
            !false) {
            warnArgs.push(`\n`, ...formatTrace(trace));
        }
        console.warn(...warnArgs);
    }
    Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["resetTracking"])();
}
function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
        return [];
    }
    // we can't just use the stack because it will be incomplete during updates
    // that did not start from the root. Re-construct the parent chain using
    // instance parent pointers.
    const normalizedStack = [];
    while (currentVNode) {
        const last = normalizedStack[0];
        if (last && last.vnode === currentVNode) {
            last.recurseCount++;
        }
        else {
            normalizedStack.push({
                vnode: currentVNode,
                recurseCount: 0
            });
        }
        const parentInstance = currentVNode.component && currentVNode.component.parent;
        currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
}
/* istanbul ignore next */
function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
        logs.push(...(i === 0 ? [] : [`\n`]), ...formatTraceEntry(entry));
    });
    return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
    const close = `>` + postfix;
    return vnode.props
        ? [open, ...formatProps(vnode.props), close]
        : [open + close];
}
/* istanbul ignore next */
function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach(key => {
        res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
        res.push(` ...`);
    }
    return res;
}
/* istanbul ignore next */
function formatProp(key, value, raw) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(value)) {
        value = JSON.stringify(value);
        return raw ? value : [`${key}=${value}`];
    }
    else if (typeof value === 'number' ||
        typeof value === 'boolean' ||
        value == null) {
        return raw ? value : [`${key}=${value}`];
    }
    else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isRef"])(value)) {
        value = formatProp(key, Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRaw"])(value.value), true);
        return raw ? value : [`${key}=Ref<`, value, `>`];
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(value)) {
        return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    }
    else {
        value = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRaw"])(value);
        return raw ? value : [`${key}=`, value];
    }
}

const ErrorTypeStrings = {
    ["bc" /* BEFORE_CREATE */]: 'beforeCreate hook',
    ["c" /* CREATED */]: 'created hook',
    ["bm" /* BEFORE_MOUNT */]: 'beforeMount hook',
    ["m" /* MOUNTED */]: 'mounted hook',
    ["bu" /* BEFORE_UPDATE */]: 'beforeUpdate hook',
    ["u" /* UPDATED */]: 'updated',
    ["bum" /* BEFORE_UNMOUNT */]: 'beforeUnmount hook',
    ["um" /* UNMOUNTED */]: 'unmounted hook',
    ["a" /* ACTIVATED */]: 'activated hook',
    ["da" /* DEACTIVATED */]: 'deactivated hook',
    ["ec" /* ERROR_CAPTURED */]: 'errorCaptured hook',
    ["rtc" /* RENDER_TRACKED */]: 'renderTracked hook',
    ["rtg" /* RENDER_TRIGGERED */]: 'renderTriggered hook',
    [0 /* SETUP_FUNCTION */]: 'setup function',
    [1 /* RENDER_FUNCTION */]: 'render function',
    [2 /* WATCH_GETTER */]: 'watcher getter',
    [3 /* WATCH_CALLBACK */]: 'watcher callback',
    [4 /* WATCH_CLEANUP */]: 'watcher cleanup function',
    [5 /* NATIVE_EVENT_HANDLER */]: 'native event handler',
    [6 /* COMPONENT_EVENT_HANDLER */]: 'component event handler',
    [7 /* VNODE_HOOK */]: 'vnode hook',
    [8 /* DIRECTIVE_HOOK */]: 'directive hook',
    [9 /* TRANSITION_HOOK */]: 'transition hook',
    [10 /* APP_ERROR_HANDLER */]: 'app errorHandler',
    [11 /* APP_WARN_HANDLER */]: 'app warnHandler',
    [12 /* FUNCTION_REF */]: 'ref function',
    [13 /* ASYNC_COMPONENT_LOADER */]: 'async component loader',
    [14 /* SCHEDULER */]: 'scheduler flush. This is likely a Vue internals bug. ' +
        'Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/vue-next'
};
function callWithErrorHandling(fn, instance, type, args) {
    let res;
    try {
        res = args ? fn(...args) : fn();
    }
    catch (err) {
        handleError(err, instance, type);
    }
    return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(fn)) {
        const res = callWithErrorHandling(fn, instance, type, args);
        if (res && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isPromise"])(res)) {
            res.catch(err => {
                handleError(err, instance, type);
            });
        }
        return res;
    }
    const values = [];
    for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
}
function handleError(err, instance, type) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
        let cur = instance.parent;
        // the exposed instance is the render proxy to keep it consistent with 2.x
        const exposedInstance = instance.proxy;
        // in production the hook receives only the error code
        const errorInfo = ( true) ? ErrorTypeStrings[type] : undefined;
        while (cur) {
            const errorCapturedHooks = cur.ec;
            if (errorCapturedHooks) {
                for (let i = 0; i < errorCapturedHooks.length; i++) {
                    if (errorCapturedHooks[i](err, exposedInstance, errorInfo)) {
                        return;
                    }
                }
            }
            cur = cur.parent;
        }
        // app-level handling
        const appErrorHandler = instance.appContext.config.errorHandler;
        if (appErrorHandler) {
            callWithErrorHandling(appErrorHandler, null, 10 /* APP_ERROR_HANDLER */, [err, exposedInstance, errorInfo]);
            return;
        }
    }
    logError(err, type, contextVNode);
}
function logError(err, type, contextVNode) {
    // default behavior is crash in prod & test, recover in dev.
    if (true) {
        const info = ErrorTypeStrings[type];
        if (contextVNode) {
            pushWarningContext(contextVNode);
        }
        warn(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
        console.error(err);
        if (contextVNode) {
            popWarningContext();
        }
    }
    else {}
}

const queue = [];
const postFlushCbs = [];
const p = Promise.resolve();
let isFlushing = false;
let isFlushPending = false;
let flushIndex = 0;
let pendingPostFlushCbs = null;
let pendingPostFlushIndex = 0;
const RECURSION_LIMIT = 100;
function nextTick(fn) {
    return fn ? p.then(fn) : p;
}
function queueJob(job) {
    if (!queue.includes(job, flushIndex)) {
        queue.push(job);
        queueFlush();
    }
}
function invalidateJob(job) {
    const i = queue.indexOf(job);
    if (i > -1) {
        queue[i] = null;
    }
}
function queuePostFlushCb(cb) {
    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(cb)) {
        if (!pendingPostFlushCbs ||
            !pendingPostFlushCbs.includes(cb, pendingPostFlushIndex)) {
            postFlushCbs.push(cb);
        }
    }
    else {
        // if cb is an array, it is a component lifecycle hook which can only be
        // triggered by a job, which is already deduped in the main queue, so
        // we can skip dupicate check here to improve perf
        postFlushCbs.push(...cb);
    }
    queueFlush();
}
function queueFlush() {
    if (!isFlushing && !isFlushPending) {
        isFlushPending = true;
        nextTick(flushJobs);
    }
}
function flushPostFlushCbs(seen) {
    if (postFlushCbs.length) {
        pendingPostFlushCbs = [...new Set(postFlushCbs)];
        postFlushCbs.length = 0;
        if ((true)) {
            seen = seen || new Map();
        }
        for (pendingPostFlushIndex = 0; pendingPostFlushIndex < pendingPostFlushCbs.length; pendingPostFlushIndex++) {
            if ((true)) {
                checkRecursiveUpdates(seen, pendingPostFlushCbs[pendingPostFlushIndex]);
            }
            pendingPostFlushCbs[pendingPostFlushIndex]();
        }
        pendingPostFlushCbs = null;
        pendingPostFlushIndex = 0;
    }
}
const getId = (job) => (job.id == null ? Infinity : job.id);
function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    if ((true)) {
        seen = seen || new Map();
    }
    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child so its render effect will have smaller
    //    priority number)
    // 2. If a component is unmounted during a parent component's update,
    //    its update can be skipped.
    // Jobs can never be null before flush starts, since they are only invalidated
    // during execution of another flushed job.
    queue.sort((a, b) => getId(a) - getId(b));
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job) {
            if ((true)) {
                checkRecursiveUpdates(seen, job);
            }
            callWithErrorHandling(job, null, 14 /* SCHEDULER */);
        }
    }
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    // some postFlushCb queued jobs!
    // keep flushing until it drains.
    if (queue.length || postFlushCbs.length) {
        flushJobs(seen);
    }
}
function checkRecursiveUpdates(seen, fn) {
    if (!seen.has(fn)) {
        seen.set(fn, 1);
    }
    else {
        const count = seen.get(fn);
        if (count > RECURSION_LIMIT) {
            throw new Error('Maximum recursive updates exceeded. ' +
                "You may have code that is mutating state in your component's " +
                'render function or updated hook or watcher source function.');
        }
        else {
            seen.set(fn, count + 1);
        }
    }
}

let isHmrUpdating = false;
const hmrDirtyComponents = new Set();
// Expose the HMR runtime on the global object
// This makes it entirely tree-shakable without polluting the exports and makes
// it easier to be used in toolings like vue-loader
// Note: for a component to be eligible for HMR it also needs the __hmrId option
// to be set so that its instances can be registered / removed.
if ((true)) {
    const globalObject = typeof global !== 'undefined'
        ? global
        : typeof self !== 'undefined'
            ? self
            : typeof window !== 'undefined'
                ? window
                : {};
    globalObject.__VUE_HMR_RUNTIME__ = {
        createRecord: tryWrap(createRecord),
        rerender: tryWrap(rerender),
        reload: tryWrap(reload)
    };
}
const map = new Map();
function registerHMR(instance) {
    const id = instance.type.__hmrId;
    let record = map.get(id);
    if (!record) {
        createRecord(id);
        record = map.get(id);
    }
    record.add(instance);
}
function unregisterHMR(instance) {
    map.get(instance.type.__hmrId).delete(instance);
}
function createRecord(id) {
    if (map.has(id)) {
        return false;
    }
    map.set(id, new Set());
    return true;
}
function rerender(id, newRender) {
    const record = map.get(id);
    if (!record)
        return;
    // Array.from creates a snapshot which avoids the set being mutated during
    // updates
    Array.from(record).forEach(instance => {
        if (newRender) {
            instance.render = newRender;
        }
        instance.renderCache = [];
        // this flag forces child components with slot content to update
        isHmrUpdating = true;
        instance.update();
        isHmrUpdating = false;
    });
}
function reload(id, newComp) {
    const record = map.get(id);
    if (!record)
        return;
    // Array.from creates a snapshot which avoids the set being mutated during
    // updates
    Array.from(record).forEach(instance => {
        const comp = instance.type;
        if (!hmrDirtyComponents.has(comp)) {
            // 1. Update existing comp definition to match new one
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(comp, newComp);
            for (const key in comp) {
                if (!(key in newComp)) {
                    delete comp[key];
                }
            }
            // 2. Mark component dirty. This forces the renderer to replace the component
            // on patch.
            hmrDirtyComponents.add(comp);
            // 3. Make sure to unmark the component after the reload.
            queuePostFlushCb(() => {
                hmrDirtyComponents.delete(comp);
            });
        }
        if (instance.parent) {
            // 4. Force the parent instance to re-render. This will cause all updated
            // components to be unmounted and re-mounted. Queue the update so that we
            // don't end up forcing the same parent to re-render multiple times.
            queueJob(instance.parent.update);
        }
        else if (instance.appContext.reload) {
            // root instance mounted via createApp() has a reload method
            instance.appContext.reload();
        }
        else if (typeof window !== 'undefined') {
            // root instance inside tree created via raw render(). Force reload.
            window.location.reload();
        }
        else {
            console.warn('[HMR] Root or manually mounted instance modified. Full reload required.');
        }
    });
}
function tryWrap(fn) {
    return (id, arg) => {
        try {
            return fn(id, arg);
        }
        catch (e) {
            console.error(e);
            console.warn(`[HMR] Something went wrong during Vue component hot-reload. ` +
                `Full reload required.`);
        }
    };
}

// mark the current rendering instance for asset resolution (e.g.
// resolveComponent, resolveDirective) during render
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
    currentRenderingInstance = instance;
}
// dev only flag to track whether $attrs was used during render.
// If $attrs was used during render then the warning for failed attrs
// fallthrough can be suppressed.
let accessedAttrs = false;
function markAttrsAccessed() {
    accessedAttrs = true;
}
function renderComponentRoot(instance) {
    const { type: Component, parent, vnode, proxy, withProxy, props, slots, attrs, emit, render, renderCache, data, setupState, ctx } = instance;
    let result;
    currentRenderingInstance = instance;
    if ((true)) {
        accessedAttrs = false;
    }
    try {
        let fallthroughAttrs;
        if (vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */) {
            // withProxy is a proxy with a different `has` trap only for
            // runtime-compiled render functions using `with` block.
            const proxyToUse = withProxy || proxy;
            result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
            fallthroughAttrs = attrs;
        }
        else {
            // functional
            const render = Component;
            // in dev, mark attrs accessed if optional props (attrs === props)
            if (( true) && attrs === props) {
                markAttrsAccessed();
            }
            result = normalizeVNode(render.length > 1
                ? render(props, ( true)
                    ? {
                        get attrs() {
                            markAttrsAccessed();
                            return attrs;
                        },
                        slots,
                        emit
                    }
                    : undefined)
                : render(props, null /* we know it doesn't need it */));
            fallthroughAttrs = Component.props ? attrs : getFallthroughAttrs(attrs);
        }
        // attr merging
        // in dev mode, comments are preserved, and it's possible for a template
        // to have comments along side the root element which makes it a fragment
        let root = result;
        let setRoot = undefined;
        if ((true)) {
            ;
            [root, setRoot] = getChildRoot(result);
        }
        if (Component.inheritAttrs !== false &&
            fallthroughAttrs &&
            Object.keys(fallthroughAttrs).length) {
            if (root.shapeFlag & 1 /* ELEMENT */ ||
                root.shapeFlag & 6 /* COMPONENT */) {
                root = cloneVNode(root, fallthroughAttrs);
            }
            else if (( true) && !accessedAttrs && root.type !== Comment) {
                const allAttrs = Object.keys(attrs);
                const eventAttrs = [];
                const extraAttrs = [];
                for (let i = 0, l = allAttrs.length; i < l; i++) {
                    const key = allAttrs[i];
                    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isOn"])(key)) {
                        // ignore v-model handlers when they fail to fallthrough
                        if (!key.startsWith('onUpdate:')) {
                            // remove `on`, lowercase first letter to reflect event casing
                            // accurately
                            eventAttrs.push(key[2].toLowerCase() + key.slice(3));
                        }
                    }
                    else {
                        extraAttrs.push(key);
                    }
                }
                if (extraAttrs.length) {
                    warn(`Extraneous non-props attributes (` +
                        `${extraAttrs.join(', ')}) ` +
                        `were passed to component but could not be automatically inherited ` +
                        `because component renders fragment or text root nodes.`);
                }
                if (eventAttrs.length) {
                    warn(`Extraneous non-emits event listeners (` +
                        `${eventAttrs.join(', ')}) ` +
                        `were passed to component but could not be automatically inherited ` +
                        `because component renders fragment or text root nodes. ` +
                        `If the listener is intended to be a component custom event listener only, ` +
                        `declare it using the "emits" option.`);
                }
            }
        }
        // inherit scopeId
        const scopeId = vnode.scopeId;
        // vite#536: if subtree root is created from parent slot if would already
        // have the correct scopeId, in this case adding the scopeId will cause
        // it to be removed if the original slot vnode is reused.
        const needScopeId = scopeId && root.scopeId !== scopeId;
        const treeOwnerId = parent && parent.type.__scopeId;
        const slotScopeId = treeOwnerId && treeOwnerId !== scopeId ? treeOwnerId + '-s' : null;
        if (needScopeId || slotScopeId) {
            const extras = {};
            if (needScopeId)
                extras[scopeId] = '';
            if (slotScopeId)
                extras[slotScopeId] = '';
            root = cloneVNode(root, extras);
        }
        // inherit directives
        if (vnode.dirs) {
            if (( true) && !isElementRoot(root)) {
                warn(`Runtime directive used on component with non-element root node. ` +
                    `The directives will not function as intended.`);
            }
            root.dirs = vnode.dirs;
        }
        // inherit transition data
        if (vnode.transition) {
            if (( true) && !isElementRoot(root)) {
                warn(`Component inside <Transition> renders non-element root node ` +
                    `that cannot be animated.`);
            }
            root.transition = vnode.transition;
        }
        if (( true) && setRoot) {
            setRoot(root);
        }
        else {
            result = root;
        }
    }
    catch (err) {
        handleError(err, instance, 1 /* RENDER_FUNCTION */);
        result = createVNode(Comment);
    }
    currentRenderingInstance = null;
    return result;
}
const getChildRoot = (vnode) => {
    if (vnode.type !== Fragment) {
        return [vnode, undefined];
    }
    const rawChildren = vnode.children;
    const dynamicChildren = vnode.dynamicChildren;
    const children = rawChildren.filter(child => {
        return !(isVNode(child) && child.type === Comment);
    });
    if (children.length !== 1) {
        return [vnode, undefined];
    }
    const childRoot = children[0];
    const index = rawChildren.indexOf(childRoot);
    const dynamicIndex = dynamicChildren
        ? dynamicChildren.indexOf(childRoot)
        : null;
    const setRoot = (updatedRoot) => {
        rawChildren[index] = updatedRoot;
        if (dynamicIndex !== null)
            dynamicChildren[dynamicIndex] = updatedRoot;
    };
    return [normalizeVNode(childRoot), setRoot];
};
const getFallthroughAttrs = (attrs) => {
    let res;
    for (const key in attrs) {
        if (key === 'class' || key === 'style' || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isOn"])(key)) {
            (res || (res = {}))[key] = attrs[key];
        }
    }
    return res;
};
const isElementRoot = (vnode) => {
    return (vnode.shapeFlag & 6 /* COMPONENT */ ||
        vnode.shapeFlag & 1 /* ELEMENT */ ||
        vnode.type === Comment // potential v-if branch switch
    );
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    // Parent component's render function was hot-updated. Since this may have
    // caused the child component's slots content to have changed, we need to
    // force the child to update as well.
    if (( true) && (prevChildren || nextChildren) && isHmrUpdating) {
        return true;
    }
    // force child update for runtime directive or transition on component vnode.
    if (nextVNode.dirs || nextVNode.transition) {
        return true;
    }
    if (patchFlag > 0) {
        if (patchFlag & 1024 /* DYNAMIC_SLOTS */) {
            // slot content that references values that might have changed,
            // e.g. in a v-for
            return true;
        }
        if (patchFlag & 16 /* FULL_PROPS */) {
            if (!prevProps) {
                return !!nextProps;
            }
            // presence of this flag indicates props are always non-null
            return hasPropsChanged(prevProps, nextProps);
        }
        else if (patchFlag & 8 /* PROPS */) {
            const dynamicProps = nextVNode.dynamicProps;
            for (let i = 0; i < dynamicProps.length; i++) {
                const key = dynamicProps[i];
                if (nextProps[key] !== prevProps[key]) {
                    return true;
                }
            }
        }
    }
    else if (!optimized) {
        // this path is only taken by manually written render functions
        // so presence of any children leads to a forced update
        if (prevChildren || nextChildren) {
            if (!nextChildren || !nextChildren.$stable) {
                return true;
            }
        }
        if (prevProps === nextProps) {
            return false;
        }
        if (!prevProps) {
            return !!nextProps;
        }
        if (!nextProps) {
            return true;
        }
        return hasPropsChanged(prevProps, nextProps);
    }
    return false;
}
function hasPropsChanged(prevProps, nextProps) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
        return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
        const key = nextKeys[i];
        if (nextProps[key] !== prevProps[key]) {
            return true;
        }
    }
    return false;
}
function updateHOCHostEl({ vnode, parent }, el // HostNode
) {
    while (parent && parent.subTree === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
    }
}

const isSuspense = (type) => type.__isSuspense;
// Suspense exposes a component-like API, and is treated like a component
// in the compiler, but internally it's a special built-in type that hooks
// directly into the renderer.
const SuspenseImpl = {
    // In order to make Suspense tree-shakable, we need to avoid importing it
    // directly in the renderer. The renderer checks for the __isSuspense flag
    // on a vnode's type and calls the `process` method, passing in renderer
    // internals.
    __isSuspense: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, 
    // platform-specific impl passed from renderer
    rendererInternals) {
        if (n1 == null) {
            mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, rendererInternals);
        }
        else {
            patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, optimized, rendererInternals);
        }
    },
    hydrate: hydrateSuspense
};
// Force-casted public typing for h and TSX props inference
const Suspense = ( SuspenseImpl
    );
function mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, rendererInternals) {
    const { p: patch, o: { createElement } } = rendererInternals;
    const hiddenContainer = createElement('div');
    const suspense = (n2.suspense = createSuspenseBoundary(n2, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, optimized, rendererInternals));
    // start mounting the content subtree in an off-dom container
    patch(null, suspense.subTree, hiddenContainer, null, parentComponent, suspense, isSVG, optimized);
    // now check if we have encountered any async deps
    if (suspense.deps > 0) {
        // mount the fallback tree
        patch(null, suspense.fallbackTree, container, anchor, parentComponent, null, // fallback tree will not have suspense context
        isSVG, optimized);
        n2.el = suspense.fallbackTree.el;
    }
    else {
        // Suspense has no async deps. Just resolve.
        suspense.resolve();
    }
}
function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, optimized, { p: patch }) {
    const suspense = (n2.suspense = n1.suspense);
    suspense.vnode = n2;
    const { content, fallback } = normalizeSuspenseChildren(n2);
    const oldSubTree = suspense.subTree;
    const oldFallbackTree = suspense.fallbackTree;
    if (!suspense.isResolved) {
        patch(oldSubTree, content, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, optimized);
        if (suspense.deps > 0) {
            // still pending. patch the fallback tree.
            patch(oldFallbackTree, fallback, container, anchor, parentComponent, null, // fallback tree will not have suspense context
            isSVG, optimized);
            n2.el = fallback.el;
        }
        // If deps somehow becomes 0 after the patch it means the patch caused an
        // async dep component to unmount and removed its dep. It will cause the
        // suspense to resolve and we don't need to do anything here.
    }
    else {
        // just normal patch inner content as a fragment
        patch(oldSubTree, content, container, anchor, parentComponent, suspense, isSVG, optimized);
        n2.el = content.el;
    }
    suspense.subTree = content;
    suspense.fallbackTree = fallback;
}
let hasWarned = false;
function createSuspenseBoundary(vnode, parent, parentComponent, container, hiddenContainer, anchor, isSVG, optimized, rendererInternals, isHydrating = false) {
    /* istanbul ignore if */
    if ( true && !hasWarned) {
        hasWarned = true;
        // @ts-ignore `console.info` cannot be null error
        console[console.info ? 'info' : 'log'](`<Suspense> is an experimental feature and its API will likely change.`);
    }
    const { p: patch, m: move, um: unmount, n: next, o: { parentNode } } = rendererInternals;
    const getCurrentTree = () => suspense.isResolved || suspense.isHydrating
        ? suspense.subTree
        : suspense.fallbackTree;
    const { content, fallback } = normalizeSuspenseChildren(vnode);
    const suspense = {
        vnode,
        parent,
        parentComponent,
        isSVG,
        optimized,
        container,
        hiddenContainer,
        anchor,
        deps: 0,
        subTree: content,
        fallbackTree: fallback,
        isHydrating,
        isResolved: false,
        isUnmounted: false,
        effects: [],
        resolve() {
            if ((true)) {
                if (suspense.isResolved) {
                    throw new Error(`resolveSuspense() is called on an already resolved suspense boundary.`);
                }
                if (suspense.isUnmounted) {
                    throw new Error(`resolveSuspense() is called on an already unmounted suspense boundary.`);
                }
            }
            const { vnode, subTree, fallbackTree, effects, parentComponent, container } = suspense;
            if (suspense.isHydrating) {
                suspense.isHydrating = false;
            }
            else {
                // this is initial anchor on mount
                let { anchor } = suspense;
                // unmount fallback tree
                if (fallbackTree.el) {
                    // if the fallback tree was mounted, it may have been moved
                    // as part of a parent suspense. get the latest anchor for insertion
                    anchor = next(fallbackTree);
                    unmount(fallbackTree, parentComponent, suspense, true);
                }
                // move content from off-dom container to actual container
                move(subTree, container, anchor, 0 /* ENTER */);
            }
            const el = (vnode.el = subTree.el);
            // suspense as the root node of a component...
            if (parentComponent && parentComponent.subTree === vnode) {
                parentComponent.vnode.el = el;
                updateHOCHostEl(parentComponent, el);
            }
            // check if there is a pending parent suspense
            let parent = suspense.parent;
            let hasUnresolvedAncestor = false;
            while (parent) {
                if (!parent.isResolved) {
                    // found a pending parent suspense, merge buffered post jobs
                    // into that parent
                    parent.effects.push(...effects);
                    hasUnresolvedAncestor = true;
                    break;
                }
                parent = parent.parent;
            }
            // no pending parent suspense, flush all jobs
            if (!hasUnresolvedAncestor) {
                queuePostFlushCb(effects);
            }
            suspense.isResolved = true;
            suspense.effects = [];
            // invoke @resolve event
            const onResolve = vnode.props && vnode.props.onResolve;
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(onResolve)) {
                onResolve();
            }
        },
        recede() {
            suspense.isResolved = false;
            const { vnode, subTree, fallbackTree, parentComponent, container, hiddenContainer, isSVG, optimized } = suspense;
            // move content tree back to the off-dom container
            const anchor = next(subTree);
            move(subTree, hiddenContainer, null, 1 /* LEAVE */);
            // remount the fallback tree
            patch(null, fallbackTree, container, anchor, parentComponent, null, // fallback tree will not have suspense context
            isSVG, optimized);
            const el = (vnode.el = fallbackTree.el);
            // suspense as the root node of a component...
            if (parentComponent && parentComponent.subTree === vnode) {
                parentComponent.vnode.el = el;
                updateHOCHostEl(parentComponent, el);
            }
            // invoke @recede event
            const onRecede = vnode.props && vnode.props.onRecede;
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(onRecede)) {
                onRecede();
            }
        },
        move(container, anchor, type) {
            move(getCurrentTree(), container, anchor, type);
            suspense.container = container;
        },
        next() {
            return next(getCurrentTree());
        },
        registerDep(instance, setupRenderEffect) {
            // suspense is already resolved, need to recede.
            // use queueJob so it's handled synchronously after patching the current
            // suspense tree
            if (suspense.isResolved) {
                queueJob(() => {
                    suspense.recede();
                });
            }
            const hydratedEl = instance.vnode.el;
            suspense.deps++;
            instance
                .asyncDep.catch(err => {
                handleError(err, instance, 0 /* SETUP_FUNCTION */);
            })
                .then(asyncSetupResult => {
                // retry when the setup() promise resolves.
                // component may have been unmounted before resolve.
                if (instance.isUnmounted || suspense.isUnmounted) {
                    return;
                }
                suspense.deps--;
                // retry from this component
                instance.asyncResolved = true;
                const { vnode } = instance;
                if ((true)) {
                    pushWarningContext(vnode);
                }
                handleSetupResult(instance, asyncSetupResult);
                if (hydratedEl) {
                    // vnode may have been replaced if an update happened before the
                    // async dep is resolved.
                    vnode.el = hydratedEl;
                }
                setupRenderEffect(instance, vnode, 
                // component may have been moved before resolve.
                // if this is not a hydration, instance.subTree will be the comment
                // placeholder.
                hydratedEl
                    ? parentNode(hydratedEl)
                    : parentNode(instance.subTree.el), 
                // anchor will not be used if this is hydration, so only need to
                // consider the comment placeholder case.
                hydratedEl ? null : next(instance.subTree), suspense, isSVG, optimized);
                updateHOCHostEl(instance, vnode.el);
                if ((true)) {
                    popWarningContext();
                }
                if (suspense.deps === 0) {
                    suspense.resolve();
                }
            });
        },
        unmount(parentSuspense, doRemove) {
            suspense.isUnmounted = true;
            unmount(suspense.subTree, parentComponent, parentSuspense, doRemove);
            if (!suspense.isResolved) {
                unmount(suspense.fallbackTree, parentComponent, parentSuspense, doRemove);
            }
        }
    };
    return suspense;
}
function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, optimized, rendererInternals, hydrateNode) {
    /* eslint-disable no-restricted-globals */
    const suspense = (vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement('div'), null, isSVG, optimized, rendererInternals, true /* hydrating */));
    // there are two possible scenarios for server-rendered suspense:
    // - success: ssr content should be fully resolved
    // - failure: ssr content should be the fallback branch.
    // however, on the client we don't really know if it has failed or not
    // attempt to hydrate the DOM assuming it has succeeded, but we still
    // need to construct a suspense boundary first
    const result = hydrateNode(node, suspense.subTree, parentComponent, suspense, optimized);
    if (suspense.deps === 0) {
        suspense.resolve();
    }
    return result;
    /* eslint-enable no-restricted-globals */
}
function normalizeSuspenseChildren(vnode) {
    const { shapeFlag, children } = vnode;
    if (shapeFlag & 32 /* SLOTS_CHILDREN */) {
        const { default: d, fallback } = children;
        return {
            content: normalizeVNode(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(d) ? d() : d),
            fallback: normalizeVNode(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(fallback) ? fallback() : fallback)
        };
    }
    else {
        return {
            content: normalizeVNode(children),
            fallback: normalizeVNode(null)
        };
    }
}
function queueEffectWithSuspense(fn, suspense) {
    if (suspense && !suspense.isResolved) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(fn)) {
            suspense.effects.push(...fn);
        }
        else {
            suspense.effects.push(fn);
        }
    }
    else {
        queuePostFlushCb(fn);
    }
}

/**
 * Wrap a slot function to memoize current rendering instance
 * @private
 */
function withCtx(fn, ctx = currentRenderingInstance) {
    if (!ctx)
        return fn;
    return function renderFnWithContext() {
        const owner = currentRenderingInstance;
        setCurrentRenderingInstance(ctx);
        const res = fn.apply(null, arguments);
        setCurrentRenderingInstance(owner);
        return res;
    };
}

// SFC scoped style ID management.
let currentScopeId = null;
const scopeIdStack = [];
/**
 * @private
 */
function pushScopeId(id) {
    scopeIdStack.push((currentScopeId = id));
}
/**
 * @private
 */
function popScopeId() {
    scopeIdStack.pop();
    currentScopeId = scopeIdStack[scopeIdStack.length - 1] || null;
}
/**
 * @private
 */
function withScopeId(id) {
    return ((fn) => withCtx(function () {
        pushScopeId(id);
        const res = fn.apply(this, arguments);
        popScopeId();
        return res;
    }));
}

const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === '');
const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(targetSelector)) {
        if (!select) {
            ( true) &&
                warn(`Current renderer does not support string target for Teleports. ` +
                    `(missing querySelector renderer option)`);
            return null;
        }
        else {
            const target = select(targetSelector);
            if (!target) {
                ( true) &&
                    warn(`Failed to locate Teleport target with selector "${targetSelector}". ` +
                        `Note the target element must exist before the component is mounted - ` +
                        `i.e. the target cannot be rendered by the component itself, and ` +
                        `ideally should be outside of the entire Vue component tree.`);
            }
            return target;
        }
    }
    else {
        if (( true) && !targetSelector) {
            warn(`Invalid Teleport target: ${targetSelector}`);
        }
        return targetSelector;
    }
};
const TeleportImpl = {
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals) {
        const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
        const disabled = isTeleportDisabled(n2.props);
        const { shapeFlag, children } = n2;
        if (n1 == null) {
            // insert anchors in the main view
            const placeholder = (n2.el = ( true)
                ? createComment('teleport start')
                : undefined);
            const mainAnchor = (n2.anchor = ( true)
                ? createComment('teleport end')
                : undefined);
            insert(placeholder, container, anchor);
            insert(mainAnchor, container, anchor);
            const target = (n2.target = resolveTarget(n2.props, querySelector));
            const targetAnchor = (n2.targetAnchor = createText(''));
            if (target) {
                insert(targetAnchor, target);
            }
            else if ((true)) {
                warn('Invalid Teleport target on mount:', target, `(${typeof target})`);
            }
            const mount = (container, anchor) => {
                // Teleport *always* has Array children. This is enforced in both the
                // compiler and vnode children normalization.
                if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                    mountChildren(children, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                }
            };
            if (disabled) {
                mount(container, mainAnchor);
            }
            else if (target) {
                mount(target, targetAnchor);
            }
        }
        else {
            // update content
            n2.el = n1.el;
            const mainAnchor = (n2.anchor = n1.anchor);
            const target = (n2.target = n1.target);
            const targetAnchor = (n2.targetAnchor = n1.targetAnchor);
            const wasDisabled = isTeleportDisabled(n1.props);
            const currentContainer = wasDisabled ? container : target;
            const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
            if (n2.dynamicChildren) {
                // fast path when the teleport happens to be a block root
                patchBlockChildren(n1.dynamicChildren, n2.dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG);
            }
            else if (!optimized) {
                patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG);
            }
            if (disabled) {
                if (!wasDisabled) {
                    // enabled -> disabled
                    // move into main container
                    moveTeleport(n2, container, mainAnchor, internals, 1 /* TOGGLE */);
                }
            }
            else {
                // target changed
                if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
                    const nextTarget = (n2.target = resolveTarget(n2.props, querySelector));
                    if (nextTarget) {
                        moveTeleport(n2, nextTarget, null, internals, 0 /* TARGET_CHANGE */);
                    }
                    else if ((true)) {
                        warn('Invalid Teleport target on update:', target, `(${typeof target})`);
                    }
                }
                else if (wasDisabled) {
                    // disabled -> enabled
                    // move into teleport target
                    moveTeleport(n2, target, targetAnchor, internals, 1 /* TOGGLE */);
                }
            }
        }
    },
    remove(vnode, { r: remove, o: { remove: hostRemove } }) {
        const { shapeFlag, children, anchor } = vnode;
        hostRemove(anchor);
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            for (let i = 0; i < children.length; i++) {
                remove(children[i]);
            }
        }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2 /* REORDER */) {
    // move target anchor if this is a target change.
    if (moveType === 0 /* TARGET_CHANGE */) {
        insert(vnode.targetAnchor, container, parentAnchor);
    }
    const { el, anchor, shapeFlag, children, props } = vnode;
    const isReorder = moveType === 2 /* REORDER */;
    // move main view anchor if this is a re-order.
    if (isReorder) {
        insert(el, container, parentAnchor);
    }
    // if this is a re-order and teleport is enabled (content is in target)
    // do not move children. So the opposite is: only move children if this
    // is not a reorder, or the teleport is disabled
    if (!isReorder || isTeleportDisabled(props)) {
        // Teleport has either Array children or no children.
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            for (let i = 0; i < children.length; i++) {
                move(children[i], container, parentAnchor, 2 /* REORDER */);
            }
        }
    }
    // move main view anchor if this is a re-order.
    if (isReorder) {
        insert(anchor, container, parentAnchor);
    }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, optimized, { o: { nextSibling, parentNode, querySelector } }, hydrateChildren) {
    const target = (vnode.target = resolveTarget(vnode.props, querySelector));
    if (target) {
        // if multiple teleports rendered to the same target element, we need to
        // pick up from where the last teleport finished instead of the first node
        const targetNode = target._lpa || target.firstChild;
        if (vnode.shapeFlag & 16 /* ARRAY_CHILDREN */) {
            if (isTeleportDisabled(vnode.props)) {
                vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, optimized);
                vnode.targetAnchor = targetNode;
            }
            else {
                vnode.anchor = nextSibling(node);
                vnode.targetAnchor = hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, optimized);
            }
            target._lpa =
                vnode.targetAnchor && nextSibling(vnode.targetAnchor);
        }
    }
    return vnode.anchor && nextSibling(vnode.anchor);
}
// Force-casted public typing for h and TSX props inference
const Teleport = TeleportImpl;

const COMPONENTS = 'components';
const DIRECTIVES = 'directives';
/**
 * @private
 */
function resolveComponent(name) {
    return resolveAsset(COMPONENTS, name) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
/**
 * @private
 */
function resolveDynamicComponent(component) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(component)) {
        return resolveAsset(COMPONENTS, component, false) || component;
    }
    else {
        // invalid types will fallthrough to createVNode and raise warning
        return (component || NULL_DYNAMIC_COMPONENT);
    }
}
/**
 * @private
 */
function resolveDirective(name) {
    return resolveAsset(DIRECTIVES, name);
}
// implementation
function resolveAsset(type, name, warnMissing = true) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
        let camelized, capitalized;
        const registry = instance[type];
        let res = registry[name] ||
            registry[(camelized = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["camelize"])(name))] ||
            registry[(capitalized = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(camelized))];
        if (!res && type === COMPONENTS) {
            const self = instance.type;
            const selfName = self.displayName || self.name;
            if (selfName &&
                (selfName === name ||
                    selfName === camelized ||
                    selfName === capitalized)) {
                res = self;
            }
        }
        if (( true) && warnMissing && !res) {
            warn(`Failed to resolve ${type.slice(0, -1)}: ${name}`);
        }
        return res;
    }
    else if ((true)) {
        warn(`resolve${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(type.slice(0, -1))} ` +
            `can only be used in render() or setup().`);
    }
}

const Fragment = Symbol(( true) ? 'Fragment' : undefined);
const Text = Symbol(( true) ? 'Text' : undefined);
const Comment = Symbol(( true) ? 'Comment' : undefined);
const Static = Symbol(( true) ? 'Static' : undefined);
// Since v-if and v-for are the two possible ways node structure can dynamically
// change, once we consider v-if branches and each v-for fragment a block, we
// can divide a template into nested blocks, and within each block the node
// structure would be stable. This allows us to skip most children diffing
// and only worry about the dynamic nodes (indicated by patch flags).
const blockStack = [];
let currentBlock = null;
/**
 * Open a block.
 * This must be called before `createBlock`. It cannot be part of `createBlock`
 * because the children of the block are evaluated before `createBlock` itself
 * is called. The generated code typically looks like this:
 *
 * ```js
 * function render() {
 *   return (openBlock(),createBlock('div', null, [...]))
 * }
 * ```
 * disableTracking is true when creating a v-for fragment block, since a v-for
 * fragment always diffs its children.
 *
 * @private
 */
function openBlock(disableTracking = false) {
    blockStack.push((currentBlock = disableTracking ? null : []));
}
// Whether we should be tracking dynamic child nodes inside a block.
// Only tracks when this value is > 0
// We are not using a simple boolean because this value may need to be
// incremented/decremented by nested usage of v-once (see below)
let shouldTrack = 1;
/**
 * Block tracking sometimes needs to be disabled, for example during the
 * creation of a tree that needs to be cached by v-once. The compiler generates
 * code like this:
 *
 * ``` js
 * _cache[1] || (
 *   setBlockTracking(-1),
 *   _cache[1] = createVNode(...),
 *   setBlockTracking(1),
 *   _cache[1]
 * )
 * ```
 *
 * @private
 */
function setBlockTracking(value) {
    shouldTrack += value;
}
/**
 * Create a block root vnode. Takes the same exact arguments as `createVNode`.
 * A block root keeps track of dynamic nodes within the block in the
 * `dynamicChildren` array.
 *
 * @private
 */
function createBlock(type, props, children, patchFlag, dynamicProps) {
    const vnode = createVNode(type, props, children, patchFlag, dynamicProps, true /* isBlock: prevent a block from tracking itself */);
    // save current block children on the block vnode
    vnode.dynamicChildren = currentBlock || _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_ARR"];
    // close block
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
    // a block is always going to be patched, so track it as a child of its
    // parent block
    if (currentBlock) {
        currentBlock.push(vnode);
    }
    return vnode;
}
function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
    if (( true) &&
        n2.shapeFlag & 6 /* COMPONENT */ &&
        hmrDirtyComponents.has(n2.type)) {
        // HMR only: if the component has been hot-updated, force a reload.
        return false;
    }
    return n1.type === n2.type && n1.key === n2.key;
}
let vnodeArgsTransformer;
/**
 * Internal API for registering an arguments transform for createVNode
 * used for creating stubs in the test-utils
 * It is *internal* but needs to be exposed for test-utils to pick up proper
 * typings
 */
function transformVNodeArgs(transformer) {
    vnodeArgsTransformer = transformer;
}
const createVNodeWithArgsTransform = (...args) => {
    return _createVNode(...(vnodeArgsTransformer
        ? vnodeArgsTransformer(args, currentRenderingInstance)
        : args));
};
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref }) => {
    return (ref != null
        ? Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(ref)
            ? ref
            : [currentRenderingInstance, ref]
        : null);
};
const createVNode = (( true)
    ? createVNodeWithArgsTransform
    : undefined);
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
        if (( true) && !type) {
            warn(`Invalid vnode type when creating vnode: ${type}.`);
        }
        type = Comment;
    }
    if (isVNode(type)) {
        return cloneVNode(type, props, children);
    }
    // class component normalization.
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(type) && '__vccOpts' in type) {
        type = type.__vccOpts;
    }
    // class & style normalization.
    if (props) {
        // for reactive or proxy objects, we need to clone it to enable mutation.
        if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isProxy"])(props) || InternalObjectKey in props) {
            props = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, props);
        }
        let { class: klass, style } = props;
        if (klass && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(klass)) {
            props.class = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["normalizeClass"])(klass);
        }
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(style)) {
            // reactive state objects need to be cloned since they are likely to be
            // mutated
            if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isProxy"])(style) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(style)) {
                style = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, style);
            }
            props.style = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["normalizeStyle"])(style);
        }
    }
    // encode the vnode type information into a bitmap
    const shapeFlag = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(type)
        ? 1 /* ELEMENT */
        :  isSuspense(type)
            ? 128 /* SUSPENSE */
            : isTeleport(type)
                ? 64 /* TELEPORT */
                : Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(type)
                    ? 4 /* STATEFUL_COMPONENT */
                    : Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(type)
                        ? 2 /* FUNCTIONAL_COMPONENT */
                        : 0;
    if (( true) && shapeFlag & 4 /* STATEFUL_COMPONENT */ && Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isProxy"])(type)) {
        type = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRaw"])(type);
        warn(`Vue received a Component which was made a reactive object. This can ` +
            `lead to unnecessary performance overhead, and should be avoided by ` +
            `marking the component with \`markRaw\` or using \`shallowRef\` ` +
            `instead of \`ref\`.`, `\nComponent that was made reactive: `, type);
    }
    const vnode = {
        __v_isVNode: true,
        __v_skip: true,
        type,
        props,
        key: props && normalizeKey(props),
        ref: props && normalizeRef(props),
        scopeId: currentScopeId,
        children: null,
        component: null,
        suspense: null,
        dirs: null,
        transition: null,
        el: null,
        anchor: null,
        target: null,
        targetAnchor: null,
        staticCount: 0,
        shapeFlag,
        patchFlag,
        dynamicProps,
        dynamicChildren: null,
        appContext: null
    };
    // validate key
    if (( true) && vnode.key !== vnode.key) {
        warn(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
    }
    normalizeChildren(vnode, children);
    // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    if (shouldTrack > 0 &&
        !isBlockNode &&
        currentBlock &&
        // the EVENTS flag is only for hydration and if it is the only flag, the
        // vnode should not be considered dynamic due to handler caching.
        patchFlag !== 32 /* HYDRATE_EVENTS */ &&
        (patchFlag > 0 ||
            shapeFlag & 128 /* SUSPENSE */ ||
            shapeFlag & 64 /* TELEPORT */ ||
            shapeFlag & 4 /* STATEFUL_COMPONENT */ ||
            shapeFlag & 2 /* FUNCTIONAL_COMPONENT */)) {
        currentBlock.push(vnode);
    }
    return vnode;
}
function cloneVNode(vnode, extraProps, children) {
    const props = extraProps
        ? vnode.props
            ? mergeProps(vnode.props, extraProps)
            : Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, extraProps)
        : vnode.props;
    // This is intentionally NOT using spread or extend to avoid the runtime
    // key enumeration cost.
    const cloned = {
        __v_isVNode: true,
        __v_skip: true,
        type: vnode.type,
        props,
        key: props && normalizeKey(props),
        ref: extraProps && extraProps.ref ? normalizeRef(extraProps) : vnode.ref,
        scopeId: vnode.scopeId,
        children: vnode.children,
        target: vnode.target,
        targetAnchor: vnode.targetAnchor,
        staticCount: vnode.staticCount,
        shapeFlag: vnode.shapeFlag,
        // if the vnode is cloned with extra props, we can no longer assume its
        // existing patch flag to be reliable and need to bail out of optimized mode.
        // however we don't want block nodes to de-opt their children, so if the
        // vnode is a block node, we only add the FULL_PROPS flag to it.
        patchFlag: extraProps
            ? vnode.dynamicChildren
                ? vnode.patchFlag | 16 /* FULL_PROPS */
                : -2 /* BAIL */
            : vnode.patchFlag,
        dynamicProps: vnode.dynamicProps,
        dynamicChildren: vnode.dynamicChildren,
        appContext: vnode.appContext,
        dirs: vnode.dirs,
        transition: vnode.transition,
        // These should technically only be non-null on mounted VNodes. However,
        // they *should* be copied for kept-alive vnodes. So we just always copy
        // them since them being non-null during a mount doesn't affect the logic as
        // they will simply be overwritten.
        component: vnode.component,
        suspense: vnode.suspense,
        el: vnode.el,
        anchor: vnode.anchor
    };
    if (children) {
        normalizeChildren(cloned, children);
    }
    return cloned;
}
/**
 * @private
 */
function createTextVNode(text = ' ', flag = 0) {
    return createVNode(Text, null, text, flag);
}
/**
 * @private
 */
function createStaticVNode(content, numberOfNodes) {
    // A static vnode can contain multiple stringified elements, and the number
    // of elements is necessary for hydration.
    const vnode = createVNode(Static, null, content);
    vnode.staticCount = numberOfNodes;
    return vnode;
}
/**
 * @private
 */
function createCommentVNode(text = '', 
// when used as the v-else branch, the comment node must be created as a
// block to ensure correct updates.
asBlock = false) {
    return asBlock
        ? (openBlock(), createBlock(Comment, null, text))
        : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
    if (child == null || typeof child === 'boolean') {
        // empty placeholder
        return createVNode(Comment);
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(child)) {
        // fragment
        return createVNode(Fragment, null, child);
    }
    else if (typeof child === 'object') {
        // already vnode, this should be the most common since compiled templates
        // always produce all-vnode children arrays
        return child.el === null ? child : cloneVNode(child);
    }
    else {
        // strings and numbers
        return createVNode(Text, null, String(child));
    }
}
// optimized normalization for template-compiled render fns
function cloneIfMounted(child) {
    return child.el === null ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
        children = null;
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(children)) {
        type = 16 /* ARRAY_CHILDREN */;
    }
    else if (typeof children === 'object') {
        // Normalize slot to plain children
        if ((shapeFlag & 1 /* ELEMENT */ || shapeFlag & 64 /* TELEPORT */) &&
            children.default) {
            normalizeChildren(vnode, children.default());
            return;
        }
        else {
            type = 32 /* SLOTS_CHILDREN */;
            const slotFlag = children._;
            if (!slotFlag && !(InternalObjectKey in children)) {
                children._ctx = currentRenderingInstance;
            }
            else if (slotFlag === 3 /* FORWARDED */ && currentRenderingInstance) {
                // a child component receives forwarded slots from the parent.
                // its slot type is determined by its parent's slot type.
                if (currentRenderingInstance.vnode.patchFlag & 1024 /* DYNAMIC_SLOTS */) {
                    children._ = 2 /* DYNAMIC */;
                    vnode.patchFlag |= 1024 /* DYNAMIC_SLOTS */;
                }
                else {
                    children._ = 1 /* STABLE */;
                }
            }
        }
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(children)) {
        children = { default: children, _ctx: currentRenderingInstance };
        type = 32 /* SLOTS_CHILDREN */;
    }
    else {
        children = String(children);
        // force teleport children to array so it can be moved around
        if (shapeFlag & 64 /* TELEPORT */) {
            type = 16 /* ARRAY_CHILDREN */;
            children = [createTextVNode(children)];
        }
        else {
            type = 8 /* TEXT_CHILDREN */;
        }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
}
const handlersRE = /^on|^vnode/;
function mergeProps(...args) {
    const ret = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, args[0]);
    for (let i = 1; i < args.length; i++) {
        const toMerge = args[i];
        for (const key in toMerge) {
            if (key === 'class') {
                if (ret.class !== toMerge.class) {
                    ret.class = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["normalizeClass"])([ret.class, toMerge.class]);
                }
            }
            else if (key === 'style') {
                ret.style = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["normalizeStyle"])([ret.style, toMerge.style]);
            }
            else if (handlersRE.test(key)) {
                // on*, vnode*
                const existing = ret[key];
                const incoming = toMerge[key];
                if (existing !== incoming) {
                    ret[key] = existing
                        ? [].concat(existing, toMerge[key])
                        : incoming;
                }
            }
            else {
                ret[key] = toMerge[key];
            }
        }
    }
    return ret;
}

function emit(instance, event, ...args) {
    const props = instance.vnode.props || _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"];
    if ((true)) {
        const options = normalizeEmitsOptions(instance.type);
        if (options) {
            if (!(event in options)) {
                const propsOptions = normalizePropsOptions(instance.type)[0];
                if (!propsOptions || !(`on` + Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(event) in propsOptions)) {
                    warn(`Component emitted event "${event}" but it is neither declared in ` +
                        `the emits option nor as an "on${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(event)}" prop.`);
                }
            }
            else {
                const validator = options[event];
                if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(validator)) {
                    const isValid = validator(...args);
                    if (!isValid) {
                        warn(`Invalid event arguments: event validation failed for event "${event}".`);
                    }
                }
            }
        }
    }
    let handlerName = `on${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(event)}`;
    let handler = props[handlerName];
    // for v-model update:xxx events, also trigger kebab-case equivalent
    // for props passed via kebab-case
    if (!handler && event.startsWith('update:')) {
        handlerName = `on${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hyphenate"])(event))}`;
        handler = props[handlerName];
    }
    if (!handler) {
        handler = props[handlerName + `Once`];
        if (!instance.emitted) {
            (instance.emitted = {})[handlerName] = true;
        }
        else if (instance.emitted[handlerName]) {
            return;
        }
    }
    if (handler) {
        callWithAsyncErrorHandling(handler, instance, 6 /* COMPONENT_EVENT_HANDLER */, args);
    }
}
function normalizeEmitsOptions(comp) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(comp, '__emits')) {
        return comp.__emits;
    }
    const raw = comp.emits;
    let normalized = {};
    // apply mixin/extends props
    let hasExtends = false;
    if ( !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(comp)) {
        if (comp.extends) {
            hasExtends = true;
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(normalized, normalizeEmitsOptions(comp.extends));
        }
        if (comp.mixins) {
            hasExtends = true;
            comp.mixins.forEach(m => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(normalized, normalizeEmitsOptions(m)));
        }
    }
    if (!raw && !hasExtends) {
        return (comp.__emits = undefined);
    }
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(raw)) {
        raw.forEach(key => (normalized[key] = null));
    }
    else {
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(normalized, raw);
    }
    return (comp.__emits = normalized);
}
// Check if an incoming prop key is a declared emit event listener.
// e.g. With `emits: { click: null }`, props named `onClick` and `onclick` are
// both considered matched listeners.
function isEmitListener(comp, key) {
    let emits;
    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isOn"])(key) || !(emits = normalizeEmitsOptions(comp))) {
        return false;
    }
    key = key.replace(/Once$/, '');
    return (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(emits, key[2].toLowerCase() + key.slice(3)) ||
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(emits, key.slice(2)));
}

function initProps(instance, rawProps, isStateful, // result of bitwise flag comparison
isSSR = false) {
    const props = {};
    const attrs = {};
    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["def"])(attrs, InternalObjectKey, 1);
    setFullProps(instance, rawProps, props, attrs);
    // validation
    if ((true)) {
        validateProps(props, instance.type);
    }
    if (isStateful) {
        // stateful
        instance.props = isSSR ? props : Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["shallowReactive"])(props);
    }
    else {
        if (!instance.type.props) {
            // functional w/ optional props, props === attrs
            instance.props = attrs;
        }
        else {
            // functional w/ declared props
            instance.props = props;
        }
    }
    instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const { props, attrs, vnode: { patchFlag } } = instance;
    const rawCurrentProps = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRaw"])(props);
    const [options] = normalizePropsOptions(instance.type);
    if ((optimized || patchFlag > 0) && !(patchFlag & 16 /* FULL_PROPS */)) {
        if (patchFlag & 8 /* PROPS */) {
            // Compiler-generated props & no keys change, just set the updated
            // the props.
            const propsToUpdate = instance.vnode.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
                const key = propsToUpdate[i];
                // PROPS flag guarantees rawProps to be non-null
                const value = rawProps[key];
                if (options) {
                    // attr / props separation was done on init and will be consistent
                    // in this code path, so just check if attrs have it.
                    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(attrs, key)) {
                        attrs[key] = value;
                    }
                    else {
                        const camelizedKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["camelize"])(key);
                        props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value);
                    }
                }
                else {
                    attrs[key] = value;
                }
            }
        }
    }
    else {
        // full props update.
        setFullProps(instance, rawProps, props, attrs);
        // in case of dynamic props, check if we need to delete keys from
        // the props object
        let kebabKey;
        for (const key in rawCurrentProps) {
            if (!rawProps ||
                // for camelCase
                (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(rawProps, key) &&
                    // it's possible the original props was passed in as kebab-case
                    // and converted to camelCase (#955)
                    ((kebabKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hyphenate"])(key)) === key || !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(rawProps, kebabKey)))) {
                if (options) {
                    if (rawPrevProps &&
                        // for camelCase
                        (rawPrevProps[key] !== undefined ||
                            // for kebab-case
                            rawPrevProps[kebabKey] !== undefined)) {
                        props[key] = resolvePropValue(options, rawProps || _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"], key, undefined);
                    }
                }
                else {
                    delete props[key];
                }
            }
        }
        // in the case of functional component w/o props declaration, props and
        // attrs point to the same object so it should already have been updated.
        if (attrs !== rawCurrentProps) {
            for (const key in attrs) {
                if (!rawProps || !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(rawProps, key)) {
                    delete attrs[key];
                }
            }
        }
    }
    // trigger updates for $attrs in case it's used in component slots
    Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["trigger"])(instance, "set" /* SET */, '$attrs');
    if (( true) && rawProps) {
        validateProps(props, instance.type);
    }
}
function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = normalizePropsOptions(instance.type);
    if (rawProps) {
        for (const key in rawProps) {
            const value = rawProps[key];
            // key, ref are reserved and never passed down
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isReservedProp"])(key)) {
                continue;
            }
            // prop option names are camelized during normalization, so to support
            // kebab -> camel conversion here we need to camelize the key.
            let camelKey;
            if (options && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(options, (camelKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["camelize"])(key)))) {
                props[camelKey] = value;
            }
            else if (!isEmitListener(instance.type, key)) {
                // Any non-declared (either as a prop or an emitted event) props are put
                // into a separate `attrs` object for spreading. Make sure to preserve
                // original key casing
                attrs[key] = value;
            }
        }
    }
    if (needCastKeys) {
        const rawCurrentProps = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRaw"])(props);
        for (let i = 0; i < needCastKeys.length; i++) {
            const key = needCastKeys[i];
            props[key] = resolvePropValue(options, rawCurrentProps, key, rawCurrentProps[key]);
        }
    }
}
function resolvePropValue(options, props, key, value) {
    const opt = options[key];
    if (opt != null) {
        const hasDefault = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(opt, 'default');
        // default values
        if (hasDefault && value === undefined) {
            const defaultValue = opt.default;
            value =
                opt.type !== Function && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(defaultValue)
                    ? defaultValue()
                    : defaultValue;
        }
        // boolean casting
        if (opt[0 /* shouldCast */]) {
            if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(props, key) && !hasDefault) {
                value = false;
            }
            else if (opt[1 /* shouldCastTrue */] &&
                (value === '' || value === Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hyphenate"])(key))) {
                value = true;
            }
        }
    }
    return value;
}
function normalizePropsOptions(comp) {
    if (comp.__props) {
        return comp.__props;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    // apply mixin/extends props
    let hasExtends = false;
    if ( !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(comp)) {
        const extendProps = (raw) => {
            const [props, keys] = normalizePropsOptions(raw);
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(normalized, props);
            if (keys)
                needCastKeys.push(...keys);
        };
        if (comp.extends) {
            hasExtends = true;
            extendProps(comp.extends);
        }
        if (comp.mixins) {
            hasExtends = true;
            comp.mixins.forEach(extendProps);
        }
    }
    if (!raw && !hasExtends) {
        return (comp.__props = _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_ARR"]);
    }
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(raw)) {
        for (let i = 0; i < raw.length; i++) {
            if (( true) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(raw[i])) {
                warn(`props must be strings when using array syntax.`, raw[i]);
            }
            const normalizedKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["camelize"])(raw[i]);
            if (validatePropName(normalizedKey)) {
                normalized[normalizedKey] = _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"];
            }
        }
    }
    else if (raw) {
        if (( true) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(raw)) {
            warn(`invalid props options`, raw);
        }
        for (const key in raw) {
            const normalizedKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["camelize"])(key);
            if (validatePropName(normalizedKey)) {
                const opt = raw[key];
                const prop = (normalized[normalizedKey] =
                    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(opt) || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(opt) ? { type: opt } : opt);
                if (prop) {
                    const booleanIndex = getTypeIndex(Boolean, prop.type);
                    const stringIndex = getTypeIndex(String, prop.type);
                    prop[0 /* shouldCast */] = booleanIndex > -1;
                    prop[1 /* shouldCastTrue */] =
                        stringIndex < 0 || booleanIndex < stringIndex;
                    // if the prop needs boolean casting or default value
                    if (booleanIndex > -1 || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(prop, 'default')) {
                        needCastKeys.push(normalizedKey);
                    }
                }
            }
        }
    }
    const normalizedEntry = [normalized, needCastKeys];
    comp.__props = normalizedEntry;
    return normalizedEntry;
}
// use function string name to check type constructors
// so that it works across vms / iframes.
function getType(ctor) {
    const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : '';
}
function isSameType(a, b) {
    return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(expectedTypes)) {
        for (let i = 0, len = expectedTypes.length; i < len; i++) {
            if (isSameType(expectedTypes[i], type)) {
                return i;
            }
        }
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(expectedTypes)) {
        return isSameType(expectedTypes, type) ? 0 : -1;
    }
    return -1;
}
/**
 * dev only
 */
function validateProps(props, comp) {
    const rawValues = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRaw"])(props);
    const options = normalizePropsOptions(comp)[0];
    for (const key in options) {
        let opt = options[key];
        if (opt == null)
            continue;
        validateProp(key, rawValues[key], opt, !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(rawValues, key));
    }
}
/**
 * dev only
 */
function validatePropName(key) {
    if (key[0] !== '$') {
        return true;
    }
    else if ((true)) {
        warn(`Invalid prop name: "${key}" is a reserved property.`);
    }
    return false;
}
/**
 * dev only
 */
function validateProp(name, value, prop, isAbsent) {
    const { type, required, validator } = prop;
    // required!
    if (required && isAbsent) {
        warn('Missing required prop: "' + name + '"');
        return;
    }
    // missing but optional
    if (value == null && !prop.required) {
        return;
    }
    // type check
    if (type != null && type !== true) {
        let isValid = false;
        const types = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(type) ? type : [type];
        const expectedTypes = [];
        // value is valid as long as one of the specified types match
        for (let i = 0; i < types.length && !isValid; i++) {
            const { valid, expectedType } = assertType(value, types[i]);
            expectedTypes.push(expectedType || '');
            isValid = valid;
        }
        if (!isValid) {
            warn(getInvalidTypeMessage(name, value, expectedTypes));
            return;
        }
    }
    // custom validator
    if (validator && !validator(value)) {
        warn('Invalid prop: custom validator check failed for prop "' + name + '".');
    }
}
const isSimpleType = /*#__PURE__*/ Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["makeMap"])('String,Number,Boolean,Function,Symbol');
/**
 * dev only
 */
function assertType(value, type) {
    let valid;
    const expectedType = getType(type);
    if (isSimpleType(expectedType)) {
        const t = typeof value;
        valid = t === expectedType.toLowerCase();
        // for primitive wrapper objects
        if (!valid && t === 'object') {
            valid = value instanceof type;
        }
    }
    else if (expectedType === 'Object') {
        valid = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["toRawType"])(value) === 'Object';
    }
    else if (expectedType === 'Array') {
        valid = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(value);
    }
    else {
        valid = value instanceof type;
    }
    return {
        valid,
        expectedType
    };
}
/**
 * dev only
 */
function getInvalidTypeMessage(name, value, expectedTypes) {
    let message = `Invalid prop: type check failed for prop "${name}".` +
        ` Expected ${expectedTypes.map(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"]).join(', ')}`;
    const expectedType = expectedTypes[0];
    const receivedType = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["toRawType"])(value);
    const expectedValue = styleValue(value, expectedType);
    const receivedValue = styleValue(value, receivedType);
    // check if we need to specify expected value
    if (expectedTypes.length === 1 &&
        isExplicable(expectedType) &&
        !isBoolean(expectedType, receivedType)) {
        message += ` with value ${expectedValue}`;
    }
    message += `, got ${receivedType} `;
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
        message += `with value ${receivedValue}.`;
    }
    return message;
}
/**
 * dev only
 */
function styleValue(value, type) {
    if (type === 'String') {
        return `"${value}"`;
    }
    else if (type === 'Number') {
        return `${Number(value)}`;
    }
    else {
        return `${value}`;
    }
}
/**
 * dev only
 */
function isExplicable(type) {
    const explicitTypes = ['string', 'number', 'boolean'];
    return explicitTypes.some(elem => type.toLowerCase() === elem);
}
/**
 * dev only
 */
function isBoolean(...args) {
    return args.some(elem => elem.toLowerCase() === 'boolean');
}

function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
        const hooks = target[type] || (target[type] = []);
        // cache the error handling wrapper for injected hooks so the same hook
        // can be properly deduped by the scheduler. "__weh" stands for "with error
        // handling".
        const wrappedHook = hook.__weh ||
            (hook.__weh = (...args) => {
                if (target.isUnmounted) {
                    return;
                }
                // disable tracking inside all lifecycle hooks
                // since they can potentially be called inside effects.
                Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["pauseTracking"])();
                // Set currentInstance during hook invocation.
                // This assumes the hook does not synchronously trigger other hooks, which
                // can only be false when the user does something really funky.
                setCurrentInstance(target);
                const res = callWithAsyncErrorHandling(hook, target, type, args);
                setCurrentInstance(null);
                Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["resetTracking"])();
                return res;
            });
        if (prepend) {
            hooks.unshift(wrappedHook);
        }
        else {
            hooks.push(wrappedHook);
        }
    }
    else if ((true)) {
        const apiName = `on${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(ErrorTypeStrings[type].replace(/ hook$/, ''))}`;
        warn(`${apiName} is called when there is no active component instance to be ` +
            `associated with. ` +
            `Lifecycle injection APIs can only be used during execution of setup().` +
            ( ` If you are using async setup(), make sure to register lifecycle ` +
                    `hooks before the first await statement.`
                ));
    }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => 
// post-create lifecycle registrations are noops during SSR
!isInSSRComponentSetup && injectHook(lifecycle, hook, target);
const onBeforeMount = createHook("bm" /* BEFORE_MOUNT */);
const onMounted = createHook("m" /* MOUNTED */);
const onBeforeUpdate = createHook("bu" /* BEFORE_UPDATE */);
const onUpdated = createHook("u" /* UPDATED */);
const onBeforeUnmount = createHook("bum" /* BEFORE_UNMOUNT */);
const onUnmounted = createHook("um" /* UNMOUNTED */);
const onRenderTriggered = createHook("rtg" /* RENDER_TRIGGERED */);
const onRenderTracked = createHook("rtc" /* RENDER_TRACKED */);
const onErrorCaptured = (hook, target = currentInstance) => {
    injectHook("ec" /* ERROR_CAPTURED */, hook, target);
};

function useTransitionState() {
    const state = {
        isMounted: false,
        isLeaving: false,
        isUnmounting: false,
        leavingVNodes: new Map()
    };
    onMounted(() => {
        state.isMounted = true;
    });
    onBeforeUnmount(() => {
        state.isUnmounting = true;
    });
    return state;
}
const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: {
        mode: String,
        appear: Boolean,
        persisted: Boolean,
        // enter
        onBeforeEnter: Function,
        onEnter: Function,
        onAfterEnter: Function,
        onEnterCancelled: Function,
        // leave
        onBeforeLeave: Function,
        onLeave: Function,
        onAfterLeave: Function,
        onLeaveCancelled: Function,
        // appear
        onBeforeAppear: Function,
        onAppear: Function,
        onAfterAppear: Function,
        onAppearCancelled: Function
    },
    setup(props, { slots }) {
        const instance = getCurrentInstance();
        const state = useTransitionState();
        let prevTransitionKey;
        return () => {
            const children = slots.default && getTransitionRawChildren(slots.default(), true);
            if (!children || !children.length) {
                return;
            }
            // warn multiple elements
            if (( true) && children.length > 1) {
                warn('<transition> can only be used on a single element or component. Use ' +
                    '<transition-group> for lists.');
            }
            // there's no need to track reactivity for these props so use the raw
            // props for a bit better perf
            const rawProps = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRaw"])(props);
            const { mode } = rawProps;
            // check mode
            if (( true) && mode && !['in-out', 'out-in', 'default'].includes(mode)) {
                warn(`invalid <transition> mode: ${mode}`);
            }
            // at this point children has a guaranteed length of 1.
            const child = children[0];
            if (state.isLeaving) {
                return emptyPlaceholder(child);
            }
            // in the case of <transition><keep-alive/></transition>, we need to
            // compare the type of the kept-alive children.
            const innerChild = getKeepAliveChild(child);
            if (!innerChild) {
                return emptyPlaceholder(child);
            }
            const enterHooks = (innerChild.transition = resolveTransitionHooks(innerChild, rawProps, state, instance));
            const oldChild = instance.subTree;
            const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
            let transitionKeyChanged = false;
            const { getTransitionKey } = innerChild.type;
            if (getTransitionKey) {
                const key = getTransitionKey();
                if (prevTransitionKey === undefined) {
                    prevTransitionKey = key;
                }
                else if (key !== prevTransitionKey) {
                    prevTransitionKey = key;
                    transitionKeyChanged = true;
                }
            }
            // handle mode
            if (oldInnerChild &&
                oldInnerChild.type !== Comment &&
                (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
                const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
                // update old tree's hooks in case of dynamic transition
                setTransitionHooks(oldInnerChild, leavingHooks);
                // switching between different views
                if (mode === 'out-in') {
                    state.isLeaving = true;
                    // return placeholder node and queue update when leave finishes
                    leavingHooks.afterLeave = () => {
                        state.isLeaving = false;
                        instance.update();
                    };
                    return emptyPlaceholder(child);
                }
                else if (mode === 'in-out') {
                    leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
                        const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
                        leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
                        // early removal callback
                        el._leaveCb = () => {
                            earlyRemove();
                            el._leaveCb = undefined;
                            delete enterHooks.delayedLeave;
                        };
                        enterHooks.delayedLeave = delayedLeave;
                    };
                }
            }
            return child;
        };
    }
};
// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
    const { leavingVNodes } = state;
    let leavingVNodesCache = leavingVNodes.get(vnode.type);
    if (!leavingVNodesCache) {
        leavingVNodesCache = Object.create(null);
        leavingVNodes.set(vnode.type, leavingVNodesCache);
    }
    return leavingVNodesCache;
}
// The transition hooks are attached to the vnode as vnode.transition
// and will be called at appropriate timing in the renderer.
function resolveTransitionHooks(vnode, { appear, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled }, state, instance) {
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook = (hook, args) => {
        hook &&
            callWithAsyncErrorHandling(hook, instance, 9 /* TRANSITION_HOOK */, args);
    };
    const hooks = {
        persisted,
        beforeEnter(el) {
            let hook = onBeforeEnter;
            if (!state.isMounted) {
                if (appear) {
                    hook = onBeforeAppear || onBeforeEnter;
                }
                else {
                    return;
                }
            }
            // for same element (v-show)
            if (el._leaveCb) {
                el._leaveCb(true /* cancelled */);
            }
            // for toggled element with same key (v-if)
            const leavingVNode = leavingVNodesCache[key];
            if (leavingVNode &&
                isSameVNodeType(vnode, leavingVNode) &&
                leavingVNode.el._leaveCb) {
                // force early removal (not cancelled)
                leavingVNode.el._leaveCb();
            }
            callHook(hook, [el]);
        },
        enter(el) {
            let hook = onEnter;
            let afterHook = onAfterEnter;
            let cancelHook = onEnterCancelled;
            if (!state.isMounted) {
                if (appear) {
                    hook = onAppear || onEnter;
                    afterHook = onAfterAppear || onAfterEnter;
                    cancelHook = onAppearCancelled || onEnterCancelled;
                }
                else {
                    return;
                }
            }
            let called = false;
            const done = (el._enterCb = (cancelled) => {
                if (called)
                    return;
                called = true;
                if (cancelled) {
                    callHook(cancelHook, [el]);
                }
                else {
                    callHook(afterHook, [el]);
                }
                if (hooks.delayedLeave) {
                    hooks.delayedLeave();
                }
                el._enterCb = undefined;
            });
            if (hook) {
                hook(el, done);
                if (hook.length <= 1) {
                    done();
                }
            }
            else {
                done();
            }
        },
        leave(el, remove) {
            const key = String(vnode.key);
            if (el._enterCb) {
                el._enterCb(true /* cancelled */);
            }
            if (state.isUnmounting) {
                return remove();
            }
            callHook(onBeforeLeave, [el]);
            let called = false;
            const done = (el._leaveCb = (cancelled) => {
                if (called)
                    return;
                called = true;
                remove();
                if (cancelled) {
                    callHook(onLeaveCancelled, [el]);
                }
                else {
                    callHook(onAfterLeave, [el]);
                }
                el._leaveCb = undefined;
                if (leavingVNodesCache[key] === vnode) {
                    delete leavingVNodesCache[key];
                }
            });
            leavingVNodesCache[key] = vnode;
            if (onLeave) {
                onLeave(el, done);
                if (onLeave.length <= 1) {
                    done();
                }
            }
            else {
                done();
            }
        }
    };
    return hooks;
}
// the placeholder really only handles one special case: KeepAlive
// in the case of a KeepAlive in a leave phase we need to return a KeepAlive
// placeholder with empty content to avoid the KeepAlive instance from being
// unmounted.
function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
        vnode = cloneVNode(vnode);
        vnode.children = null;
        return vnode;
    }
}
function getKeepAliveChild(vnode) {
    return isKeepAlive(vnode)
        ? vnode.children
            ? vnode.children[0]
            : undefined
        : vnode;
}
function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 /* COMPONENT */ && vnode.component) {
        setTransitionHooks(vnode.component.subTree, hooks);
    }
    else {
        vnode.transition = hooks;
    }
}
function getTransitionRawChildren(children, keepComment = false) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        // handle fragment children case, e.g. v-for
        if (child.type === Fragment) {
            if (child.patchFlag & 128 /* KEYED_FRAGMENT */)
                keyedFragmentCount++;
            ret = ret.concat(getTransitionRawChildren(child.children, keepComment));
        }
        // comment placeholders should be skipped, e.g. v-if
        else if (keepComment || child.type !== Comment) {
            ret.push(child);
        }
    }
    // #1126 if a transition children list contains multiple sub fragments, these
    // fragments will be merged into a flat children array. Since each v-for
    // fragment may contain different static bindings inside, we need to de-top
    // these children to force full diffs to ensure correct behavior.
    if (keyedFragmentCount > 1) {
        for (let i = 0; i < ret.length; i++) {
            ret[i].patchFlag = -2 /* BAIL */;
        }
    }
    return ret;
}

const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
const KeepAliveImpl = {
    name: `KeepAlive`,
    // Marker for special handling inside the renderer. We are not using a ===
    // check directly on KeepAlive in the renderer, because importing it directly
    // would prevent it from being tree-shaken.
    __isKeepAlive: true,
    inheritRef: true,
    props: {
        include: [String, RegExp, Array],
        exclude: [String, RegExp, Array],
        max: [String, Number]
    },
    setup(props, { slots }) {
        const cache = new Map();
        const keys = new Set();
        let current = null;
        const instance = getCurrentInstance();
        const parentSuspense = instance.suspense;
        // KeepAlive communicates with the instantiated renderer via the
        // ctx where the renderer passes in its internals,
        // and the KeepAlive instance exposes activate/deactivate implementations.
        // The whole point of this is to avoid importing KeepAlive directly in the
        // renderer to facilitate tree-shaking.
        const sharedContext = instance.ctx;
        const { renderer: { p: patch, m: move, um: _unmount, o: { createElement } } } = sharedContext;
        const storageContainer = createElement('div');
        sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
            const instance = vnode.component;
            move(vnode, container, anchor, 0 /* ENTER */, parentSuspense);
            // in case props have changed
            patch(instance.vnode, vnode, container, anchor, instance, parentSuspense, isSVG, optimized);
            queuePostRenderEffect(() => {
                instance.isDeactivated = false;
                if (instance.a) {
                    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["invokeArrayFns"])(instance.a);
                }
                const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
                if (vnodeHook) {
                    invokeVNodeHook(vnodeHook, instance.parent, vnode);
                }
            }, parentSuspense);
        };
        sharedContext.deactivate = (vnode) => {
            const instance = vnode.component;
            move(vnode, storageContainer, null, 1 /* LEAVE */, parentSuspense);
            queuePostRenderEffect(() => {
                if (instance.da) {
                    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["invokeArrayFns"])(instance.da);
                }
                const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
                if (vnodeHook) {
                    invokeVNodeHook(vnodeHook, instance.parent, vnode);
                }
                instance.isDeactivated = true;
            }, parentSuspense);
        };
        function unmount(vnode) {
            // reset the shapeFlag so it can be properly unmounted
            resetShapeFlag(vnode);
            _unmount(vnode, instance, parentSuspense);
        }
        function pruneCache(filter) {
            cache.forEach((vnode, key) => {
                const name = getName(vnode.type);
                if (name && (!filter || !filter(name))) {
                    pruneCacheEntry(key);
                }
            });
        }
        function pruneCacheEntry(key) {
            const cached = cache.get(key);
            if (!current || cached.type !== current.type) {
                unmount(cached);
            }
            else if (current) {
                // current active instance should no longer be kept-alive.
                // we can't unmount it now but it might be later, so reset its flag now.
                resetShapeFlag(current);
            }
            cache.delete(key);
            keys.delete(key);
        }
        watch(() => [props.include, props.exclude], ([include, exclude]) => {
            include && pruneCache(name => matches(include, name));
            exclude && pruneCache(name => matches(exclude, name));
        });
        // cache sub tree in beforeMount/Update (i.e. right after the render)
        let pendingCacheKey = null;
        const cacheSubtree = () => {
            // fix #1621, the pendingCacheKey could be 0
            if (pendingCacheKey != null) {
                cache.set(pendingCacheKey, instance.subTree);
            }
        };
        onBeforeMount(cacheSubtree);
        onBeforeUpdate(cacheSubtree);
        onBeforeUnmount(() => {
            cache.forEach(cached => {
                const { subTree, suspense } = instance;
                if (cached.type === subTree.type) {
                    // current instance will be unmounted as part of keep-alive's unmount
                    resetShapeFlag(subTree);
                    // but invoke its deactivated hook here
                    const da = subTree.component.da;
                    da && queuePostRenderEffect(da, suspense);
                    return;
                }
                unmount(cached);
            });
        });
        return () => {
            pendingCacheKey = null;
            if (!slots.default) {
                return null;
            }
            const children = slots.default();
            let vnode = children[0];
            if (children.length > 1) {
                if ((true)) {
                    warn(`KeepAlive should contain exactly one component child.`);
                }
                current = null;
                return children;
            }
            else if (!isVNode(vnode) ||
                !(vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */)) {
                current = null;
                return vnode;
            }
            const comp = vnode.type;
            const name = getName(comp);
            const { include, exclude, max } = props;
            if ((include && (!name || !matches(include, name))) ||
                (exclude && name && matches(exclude, name))) {
                return (current = vnode);
            }
            const key = vnode.key == null ? comp : vnode.key;
            const cachedVNode = cache.get(key);
            // clone vnode if it's reused because we are going to mutate it
            if (vnode.el) {
                vnode = cloneVNode(vnode);
            }
            // #1513 it's possible for the returned vnode to be cloned due to attr
            // fallthrough or scopeId, so the vnode here may not be the final vnode
            // that is mounted. Instead of caching it directly, we store the pending
            // key and cache `instance.subTree` (the normalized vnode) in
            // beforeMount/beforeUpdate hooks.
            pendingCacheKey = key;
            if (cachedVNode) {
                // copy over mounted state
                vnode.el = cachedVNode.el;
                vnode.component = cachedVNode.component;
                if (vnode.transition) {
                    // recursively update transition hooks on subTree
                    setTransitionHooks(vnode, vnode.transition);
                }
                // avoid vnode being mounted as fresh
                vnode.shapeFlag |= 512 /* COMPONENT_KEPT_ALIVE */;
                // make this key the freshest
                keys.delete(key);
                keys.add(key);
            }
            else {
                keys.add(key);
                // prune oldest entry
                if (max && keys.size > parseInt(max, 10)) {
                    pruneCacheEntry(keys.values().next().value);
                }
            }
            // avoid vnode being unmounted
            vnode.shapeFlag |= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
            current = vnode;
            return vnode;
        };
    }
};
// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
const KeepAlive = KeepAliveImpl;
function getName(comp) {
    return comp.displayName || comp.name;
}
function matches(pattern, name) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(pattern)) {
        return pattern.some((p) => matches(p, name));
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(pattern)) {
        return pattern.split(',').indexOf(name) > -1;
    }
    else if (pattern.test) {
        return pattern.test(name);
    }
    /* istanbul ignore next */
    return false;
}
function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a" /* ACTIVATED */, target);
}
function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da" /* DEACTIVATED */, target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
    // cache the deactivate branch check wrapper for injected hooks so the same
    // hook can be properly deduped by the scheduler. "__wdc" stands for "with
    // deactivation check".
    const wrappedHook = hook.__wdc ||
        (hook.__wdc = () => {
            // only fire the hook if the target instance is NOT in a deactivated branch.
            let current = target;
            while (current) {
                if (current.isDeactivated) {
                    return;
                }
                current = current.parent;
            }
            hook();
        });
    injectHook(type, wrappedHook, target);
    // In addition to registering it on the target instance, we walk up the parent
    // chain and register it on all ancestor instances that are keep-alive roots.
    // This avoids the need to walk the entire component tree when invoking these
    // hooks, and more importantly, avoids the need to track child components in
    // arrays.
    if (target) {
        let current = target.parent;
        while (current && current.parent) {
            if (isKeepAlive(current.parent.vnode)) {
                injectToKeepAliveRoot(wrappedHook, type, target, current);
            }
            current = current.parent;
        }
    }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    injectHook(type, hook, keepAliveRoot, true /* prepend */);
    onUnmounted(() => {
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["remove"])(keepAliveRoot[type], hook);
    }, target);
}
function resetShapeFlag(vnode) {
    let shapeFlag = vnode.shapeFlag;
    if (shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
        shapeFlag -= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
    }
    if (shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
        shapeFlag -= 512 /* COMPONENT_KEPT_ALIVE */;
    }
    vnode.shapeFlag = shapeFlag;
}

const isInternalKey = (key) => key[0] === '_' || key === '$stable';
const normalizeSlotValue = (value) => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(value)
    ? value.map(normalizeVNode)
    : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => withCtx((props) => {
    if (( true) && currentInstance) {
        warn(`Slot "${key}" invoked outside of the render function: ` +
            `this will not track dependencies used in the slot. ` +
            `Invoke the slot function inside the render function instead.`);
    }
    return normalizeSlotValue(rawSlot(props));
}, ctx);
const normalizeObjectSlots = (rawSlots, slots) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
        if (isInternalKey(key))
            continue;
        const value = rawSlots[key];
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(value)) {
            slots[key] = normalizeSlot(key, value, ctx);
        }
        else if (value != null) {
            if ((true)) {
                warn(`Non-function value encountered for slot "${key}". ` +
                    `Prefer function slots for better performance.`);
            }
            const normalized = normalizeSlotValue(value);
            slots[key] = () => normalized;
        }
    }
};
const normalizeVNodeSlots = (instance, children) => {
    if (( true) && !isKeepAlive(instance.vnode)) {
        warn(`Non-function value encountered for default slot. ` +
            `Prefer function slots for better performance.`);
    }
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
    if (instance.vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
        const type = children._;
        if (type) {
            instance.slots = children;
            // make compiler marker non-enumerable
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["def"])(children, '_', type);
        }
        else {
            normalizeObjectSlots(children, (instance.slots = {}));
        }
    }
    else {
        instance.slots = {};
        if (children) {
            normalizeVNodeSlots(instance, children);
        }
    }
    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["def"])(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"];
    if (vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
        const type = children._;
        if (type) {
            // compiled slots.
            if (( true) && isHmrUpdating) {
                // Parent was HMR updated so slot content may have changed.
                // force update slots and mark instance for hmr as well
                Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(slots, children);
            }
            else if (type === 1 /* STABLE */) {
                // compiled AND stable.
                // no need to update, and skip stale slots removal.
                needDeletionCheck = false;
            }
            else {
                // compiled but dynamic (v-if/v-for on slots) - update slots, but skip
                // normalization.
                Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(slots, children);
            }
        }
        else {
            needDeletionCheck = !children.$stable;
            normalizeObjectSlots(children, slots);
        }
        deletionComparisonTarget = children;
    }
    else if (children) {
        // non slot object children (direct value) passed to a component
        normalizeVNodeSlots(instance, children);
        deletionComparisonTarget = { default: 1 };
    }
    // delete stale slots
    if (needDeletionCheck) {
        for (const key in slots) {
            if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
                delete slots[key];
            }
        }
    }
};

/**
Runtime helper for applying directives to a vnode. Example usage:

const comp = resolveComponent('comp')
const foo = resolveDirective('foo')
const bar = resolveDirective('bar')

return withDirectives(h(comp), [
  [foo, this.x],
  [bar, this.y]
])
*/
const isBuiltInDirective = /*#__PURE__*/ Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["makeMap"])('bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text');
function validateDirectiveName(name) {
    if (isBuiltInDirective(name)) {
        warn('Do not use built-in directive ids as custom directive id: ' + name);
    }
}
/**
 * Adds directives to a VNode.
 */
function withDirectives(vnode, directives) {
    const internalInstance = currentRenderingInstance;
    if (internalInstance === null) {
        ( true) && warn(`withDirectives can only be used inside render functions.`);
        return vnode;
    }
    const instance = internalInstance.proxy;
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
        let [dir, value, arg, modifiers = _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"]] = directives[i];
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(dir)) {
            dir = {
                mounted: dir,
                updated: dir
            };
        }
        bindings.push({
            dir,
            instance,
            value,
            oldValue: void 0,
            arg,
            modifiers
        });
    }
    return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
        const binding = bindings[i];
        if (oldBindings) {
            binding.oldValue = oldBindings[i].value;
        }
        const hook = binding.dir[name];
        if (hook) {
            callWithAsyncErrorHandling(hook, instance, 8 /* DIRECTIVE_HOOK */, [
                vnode.el,
                binding,
                vnode,
                prevVNode
            ]);
        }
    }
}

var DevtoolsHooks;
(function (DevtoolsHooks) {
    DevtoolsHooks["APP_INIT"] = "app:init";
    DevtoolsHooks["APP_UNMOUNT"] = "app:unmount";
    DevtoolsHooks["COMPONENT_UPDATED"] = "component:updated";
    DevtoolsHooks["COMPONENT_ADDED"] = "component:added";
    DevtoolsHooks["COMPONENT_REMOVED"] = "component:removed";
})(DevtoolsHooks || (DevtoolsHooks = {}));
let devtools;
function setDevtoolsHook(hook) {
    devtools = hook;
}
function initApp(app, version) {
    // TODO queue if devtools is undefined
    if (!devtools)
        return;
    devtools.emit(DevtoolsHooks.APP_INIT, app, version, {
        Fragment: Fragment,
        Text: Text,
        Comment: Comment,
        Static: Static
    });
}
function appUnmounted(app) {
    if (!devtools)
        return;
    devtools.emit(DevtoolsHooks.APP_UNMOUNT, app);
}
const componentAdded = createDevtoolsHook(DevtoolsHooks.COMPONENT_ADDED);
const componentUpdated = createDevtoolsHook(DevtoolsHooks.COMPONENT_UPDATED);
const componentRemoved = createDevtoolsHook(DevtoolsHooks.COMPONENT_REMOVED);
function createDevtoolsHook(hook) {
    return (component) => {
        if (!devtools || !component.appContext.__app)
            return;
        devtools.emit(hook, component.appContext.__app, component.uid, component.parent ? component.parent.uid : undefined);
    };
}

function createAppContext() {
    return {
        config: {
            isNativeTag: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NO"],
            devtools: true,
            performance: false,
            globalProperties: {},
            optionMergeStrategies: {},
            isCustomElement: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NO"],
            errorHandler: undefined,
            warnHandler: undefined
        },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null)
    };
}
function createAppAPI(render, hydrate) {
    return function createApp(rootComponent, rootProps = null) {
        if (rootProps != null && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(rootProps)) {
            ( true) && warn(`root props passed to app.mount() must be an object.`);
            rootProps = null;
        }
        const context = createAppContext();
        const installedPlugins = new Set();
        let isMounted = false;
        const app = {
            _component: rootComponent,
            _props: rootProps,
            _container: null,
            _context: context,
            version,
            get config() {
                return context.config;
            },
            set config(v) {
                if ((true)) {
                    warn(`app.config cannot be replaced. Modify individual options instead.`);
                }
            },
            use(plugin, ...options) {
                if (installedPlugins.has(plugin)) {
                    ( true) && warn(`Plugin has already been applied to target app.`);
                }
                else if (plugin && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(plugin.install)) {
                    installedPlugins.add(plugin);
                    plugin.install(app, ...options);
                }
                else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(plugin)) {
                    installedPlugins.add(plugin);
                    plugin(app, ...options);
                }
                else if ((true)) {
                    warn(`A plugin must either be a function or an object with an "install" ` +
                        `function.`);
                }
                return app;
            },
            mixin(mixin) {
                {
                    if (!context.mixins.includes(mixin)) {
                        context.mixins.push(mixin);
                    }
                    else if ((true)) {
                        warn('Mixin has already been applied to target app' +
                            (mixin.name ? `: ${mixin.name}` : ''));
                    }
                }
                return app;
            },
            component(name, component) {
                if ((true)) {
                    validateComponentName(name, context.config);
                }
                if (!component) {
                    return context.components[name];
                }
                if (( true) && context.components[name]) {
                    warn(`Component "${name}" has already been registered in target app.`);
                }
                context.components[name] = component;
                return app;
            },
            directive(name, directive) {
                if ((true)) {
                    validateDirectiveName(name);
                }
                if (!directive) {
                    return context.directives[name];
                }
                if (( true) && context.directives[name]) {
                    warn(`Directive "${name}" has already been registered in target app.`);
                }
                context.directives[name] = directive;
                return app;
            },
            mount(rootContainer, isHydrate) {
                if (!isMounted) {
                    const vnode = createVNode(rootComponent, rootProps);
                    // store app context on the root VNode.
                    // this will be set on the root instance on initial mount.
                    vnode.appContext = context;
                    // HMR root reload
                    if ((true)) {
                        context.reload = () => {
                            render(cloneVNode(vnode), rootContainer);
                        };
                    }
                    if (isHydrate && hydrate) {
                        hydrate(vnode, rootContainer);
                    }
                    else {
                        render(vnode, rootContainer);
                    }
                    isMounted = true;
                    app._container = rootContainer;
                    ( true) && initApp(app, version);
                    return vnode.component.proxy;
                }
                else if ((true)) {
                    warn(`App has already been mounted.\n` +
                        `If you want to remount the same app, move your app creation logic ` +
                        `into a factory function and create fresh app instances for each ` +
                        `mount - e.g. \`const createMyApp = () => createApp(App)\``);
                }
            },
            unmount() {
                if (isMounted) {
                    render(null, app._container);
                    ( true) && appUnmounted(app);
                }
                else if ((true)) {
                    warn(`Cannot unmount an app that is not mounted.`);
                }
            },
            provide(key, value) {
                if (( true) && key in context.provides) {
                    warn(`App already provides property with key "${String(key)}". ` +
                        `It will be overwritten with the new value.`);
                }
                // TypeScript doesn't allow symbols as index type
                // https://github.com/Microsoft/TypeScript/issues/24587
                context.provides[key] = value;
                return app;
            }
        };
        context.__app = app;
        return app;
    };
}

let hasMismatch = false;
const isSVGContainer = (container) => /svg/.test(container.namespaceURI) && container.tagName !== 'foreignObject';
const isComment = (node) => node.nodeType === 8 /* COMMENT */;
// Note: hydration is DOM-specific
// But we have to place it in core due to tight coupling with core - splitting
// it out creates a ton of unnecessary complexity.
// Hydration also depends on some renderer internal logic which needs to be
// passed in via arguments.
function createHydrationFunctions(rendererInternals) {
    const { mt: mountComponent, p: patch, o: { patchProp, nextSibling, parentNode, remove, insert, createComment } } = rendererInternals;
    const hydrate = (vnode, container) => {
        if (( true) && !container.hasChildNodes()) {
            warn(`Attempting to hydrate existing markup but container is empty. ` +
                `Performing full mount instead.`);
            patch(null, vnode, container);
            return;
        }
        hasMismatch = false;
        hydrateNode(container.firstChild, vnode, null, null);
        flushPostFlushCbs();
        if (hasMismatch && !false) {
            // this error should show up in production
            console.error(`Hydration completed but contains mismatches.`);
        }
    };
    const hydrateNode = (node, vnode, parentComponent, parentSuspense, optimized = false) => {
        const isFragmentStart = isComment(node) && node.data === '[';
        const onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, isFragmentStart);
        const { type, ref, shapeFlag } = vnode;
        const domType = node.nodeType;
        vnode.el = node;
        let nextNode = null;
        switch (type) {
            case Text:
                if (domType !== 3 /* TEXT */) {
                    nextNode = onMismatch();
                }
                else {
                    if (node.data !== vnode.children) {
                        hasMismatch = true;
                        ( true) &&
                            warn(`Hydration text mismatch:` +
                                `\n- Client: ${JSON.stringify(node.data)}` +
                                `\n- Server: ${JSON.stringify(vnode.children)}`);
                        node.data = vnode.children;
                    }
                    nextNode = nextSibling(node);
                }
                break;
            case Comment:
                if (domType !== 8 /* COMMENT */ || isFragmentStart) {
                    nextNode = onMismatch();
                }
                else {
                    nextNode = nextSibling(node);
                }
                break;
            case Static:
                if (domType !== 1 /* ELEMENT */) {
                    nextNode = onMismatch();
                }
                else {
                    // determine anchor, adopt content
                    nextNode = node;
                    // if the static vnode has its content stripped during build,
                    // adopt it from the server-rendered HTML.
                    const needToAdoptContent = !vnode.children.length;
                    for (let i = 0; i < vnode.staticCount; i++) {
                        if (needToAdoptContent)
                            vnode.children += nextNode.outerHTML;
                        if (i === vnode.staticCount - 1) {
                            vnode.anchor = nextNode;
                        }
                        nextNode = nextSibling(nextNode);
                    }
                    return nextNode;
                }
                break;
            case Fragment:
                if (!isFragmentStart) {
                    nextNode = onMismatch();
                }
                else {
                    nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, optimized);
                }
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    if (domType !== 1 /* ELEMENT */ ||
                        vnode.type !== node.tagName.toLowerCase()) {
                        nextNode = onMismatch();
                    }
                    else {
                        nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, optimized);
                    }
                }
                else if (shapeFlag & 6 /* COMPONENT */) {
                    // when setting up the render effect, if the initial vnode already
                    // has .el set, the component will perform hydration instead of mount
                    // on its sub-tree.
                    const container = parentNode(node);
                    const hydrateComponent = () => {
                        mountComponent(vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), optimized);
                    };
                    // async component
                    const loadAsync = vnode.type.__asyncLoader;
                    if (loadAsync) {
                        loadAsync().then(hydrateComponent);
                    }
                    else {
                        hydrateComponent();
                    }
                    // component may be async, so in the case of fragments we cannot rely
                    // on component's rendered output to determine the end of the fragment
                    // instead, we do a lookahead to find the end anchor node.
                    nextNode = isFragmentStart
                        ? locateClosingAsyncAnchor(node)
                        : nextSibling(node);
                }
                else if (shapeFlag & 64 /* TELEPORT */) {
                    if (domType !== 8 /* COMMENT */) {
                        nextNode = onMismatch();
                    }
                    else {
                        nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, optimized, rendererInternals, hydrateChildren);
                    }
                }
                else if ( shapeFlag & 128 /* SUSPENSE */) {
                    nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, isSVGContainer(parentNode(node)), optimized, rendererInternals, hydrateNode);
                }
                else if ((true)) {
                    warn('Invalid HostVNode type:', type, `(${typeof type})`);
                }
        }
        if (ref != null && parentComponent) {
            setRef(ref, null, parentComponent, parentSuspense, vnode);
        }
        return nextNode;
    };
    const hydrateElement = (el, vnode, parentComponent, parentSuspense, optimized) => {
        optimized = optimized || !!vnode.dynamicChildren;
        const { props, patchFlag, shapeFlag, dirs } = vnode;
        // skip props & children if this is hoisted static nodes
        if (patchFlag !== -1 /* HOISTED */) {
            // props
            if (props) {
                if (!optimized ||
                    (patchFlag & 16 /* FULL_PROPS */ ||
                        patchFlag & 32 /* HYDRATE_EVENTS */)) {
                    for (const key in props) {
                        if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isReservedProp"])(key) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isOn"])(key)) {
                            patchProp(el, key, null, props[key]);
                        }
                    }
                }
                else if (props.onClick) {
                    // Fast path for click listeners (which is most often) to avoid
                    // iterating through props.
                    patchProp(el, 'onClick', null, props.onClick);
                }
            }
            // vnode / directive hooks
            let vnodeHooks;
            if ((vnodeHooks = props && props.onVnodeBeforeMount)) {
                invokeVNodeHook(vnodeHooks, parentComponent, vnode);
            }
            if (dirs) {
                invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
            }
            if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
                queueEffectWithSuspense(() => {
                    vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
                    dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
                }, parentSuspense);
            }
            // children
            if (shapeFlag & 16 /* ARRAY_CHILDREN */ &&
                // skip if element has innerHTML / textContent
                !(props && (props.innerHTML || props.textContent))) {
                let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, optimized);
                let hasWarned = false;
                while (next) {
                    hasMismatch = true;
                    if (( true) && !hasWarned) {
                        warn(`Hydration children mismatch in <${vnode.type}>: ` +
                            `server rendered element contains more child nodes than client vdom.`);
                        hasWarned = true;
                    }
                    // The SSRed DOM contains more nodes than it should. Remove them.
                    const cur = next;
                    next = next.nextSibling;
                    remove(cur);
                }
            }
            else if (shapeFlag & 8 /* TEXT_CHILDREN */) {
                if (el.textContent !== vnode.children) {
                    hasMismatch = true;
                    ( true) &&
                        warn(`Hydration text content mismatch in <${vnode.type}>:\n` +
                            `- Client: ${el.textContent}\n` +
                            `- Server: ${vnode.children}`);
                    el.textContent = vnode.children;
                }
            }
        }
        return el.nextSibling;
    };
    const hydrateChildren = (node, vnode, container, parentComponent, parentSuspense, optimized) => {
        optimized = optimized || !!vnode.dynamicChildren;
        const children = vnode.children;
        const l = children.length;
        let hasWarned = false;
        for (let i = 0; i < l; i++) {
            const vnode = optimized
                ? children[i]
                : (children[i] = normalizeVNode(children[i]));
            if (node) {
                node = hydrateNode(node, vnode, parentComponent, parentSuspense, optimized);
            }
            else {
                hasMismatch = true;
                if (( true) && !hasWarned) {
                    warn(`Hydration children mismatch in <${container.tagName.toLowerCase()}>: ` +
                        `server rendered element contains fewer child nodes than client vdom.`);
                    hasWarned = true;
                }
                // the SSRed DOM didn't contain enough nodes. Mount the missing ones.
                patch(null, vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container));
            }
        }
        return node;
    };
    const hydrateFragment = (node, vnode, parentComponent, parentSuspense, optimized) => {
        const container = parentNode(node);
        const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, optimized);
        if (next && isComment(next) && next.data === ']') {
            return nextSibling((vnode.anchor = next));
        }
        else {
            // fragment didn't hydrate successfully, since we didn't get a end anchor
            // back. This should have led to node/children mismatch warnings.
            hasMismatch = true;
            // since the anchor is missing, we need to create one and insert it
            insert((vnode.anchor = createComment(`]`)), container, next);
            return next;
        }
    };
    const handleMismatch = (node, vnode, parentComponent, parentSuspense, isFragment) => {
        hasMismatch = true;
        ( true) &&
            warn(`Hydration node mismatch:\n- Client vnode:`, vnode.type, `\n- Server rendered DOM:`, node, node.nodeType === 3 /* TEXT */
                ? `(text)`
                : isComment(node) && node.data === '['
                    ? `(start of fragment)`
                    : ``);
        vnode.el = null;
        if (isFragment) {
            // remove excessive fragment nodes
            const end = locateClosingAsyncAnchor(node);
            while (true) {
                const next = nextSibling(node);
                if (next && next !== end) {
                    remove(next);
                }
                else {
                    break;
                }
            }
        }
        const next = nextSibling(node);
        const container = parentNode(node);
        remove(node);
        patch(null, vnode, container, next, parentComponent, parentSuspense, isSVGContainer(container));
        return next;
    };
    const locateClosingAsyncAnchor = (node) => {
        let match = 0;
        while (node) {
            node = nextSibling(node);
            if (node && isComment(node)) {
                if (node.data === '[')
                    match++;
                if (node.data === ']') {
                    if (match === 0) {
                        return nextSibling(node);
                    }
                    else {
                        match--;
                    }
                }
            }
        }
        return node;
    };
    return [hydrate, hydrateNode];
}

let supported;
let perf;
function startMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
        perf.mark(`vue-${type}-${instance.uid}`);
    }
}
function endMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
        const startTag = `vue-${type}-${instance.uid}`;
        const endTag = startTag + `:end`;
        perf.mark(endTag);
        perf.measure(`<${formatComponentName(instance, instance.type)}> ${type}`, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
    }
}
function isSupported() {
    if (supported !== undefined) {
        return supported;
    }
    /* eslint-disable no-restricted-globals */
    if (typeof window !== 'undefined' && window.performance) {
        supported = true;
        perf = window.performance;
    }
    else {
        supported = false;
    }
    /* eslint-enable no-restricted-globals */
    return supported;
}

const prodEffectOptions = {
    scheduler: queueJob
};
function createDevEffectOptions(instance) {
    return {
        scheduler: queueJob,
        onTrack: instance.rtc ? e => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["invokeArrayFns"])(instance.rtc, e) : void 0,
        onTrigger: instance.rtg ? e => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["invokeArrayFns"])(instance.rtg, e) : void 0
    };
}
const queuePostRenderEffect =  queueEffectWithSuspense
    ;
const setRef = (rawRef, oldRawRef, parentComponent, parentSuspense, vnode) => {
    let value;
    if (!vnode) {
        value = null;
    }
    else {
        if (vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */) {
            value = vnode.component.proxy;
        }
        else {
            value = vnode.el;
        }
    }
    const [owner, ref] = rawRef;
    if (( true) && !owner) {
        warn(`Missing ref owner context. ref cannot be used on hoisted vnodes. ` +
            `A vnode with ref must be created inside the render function.`);
        return;
    }
    const oldRef = oldRawRef && oldRawRef[1];
    const refs = owner.refs === _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"] ? (owner.refs = {}) : owner.refs;
    const setupState = owner.setupState;
    // unset old ref
    if (oldRef != null && oldRef !== ref) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(oldRef)) {
            refs[oldRef] = null;
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(setupState, oldRef)) {
                queuePostRenderEffect(() => {
                    setupState[oldRef] = null;
                }, parentSuspense);
            }
        }
        else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isRef"])(oldRef)) {
            oldRef.value = null;
        }
    }
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(ref)) {
        refs[ref] = value;
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(setupState, ref)) {
            queuePostRenderEffect(() => {
                setupState[ref] = value;
            }, parentSuspense);
        }
    }
    else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isRef"])(ref)) {
        ref.value = value;
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(ref)) {
        callWithErrorHandling(ref, parentComponent, 12 /* FUNCTION_REF */, [
            value,
            refs
        ]);
    }
    else if ((true)) {
        warn('Invalid template ref type:', value, `(${typeof value})`);
    }
};
/**
 * The createRenderer function accepts two generic arguments:
 * HostNode and HostElement, corresponding to Node and Element types in the
 * host environment. For example, for runtime-dom, HostNode would be the DOM
 * `Node` interface and HostElement would be the DOM `Element` interface.
 *
 * Custom renderers can pass in the platform specific types like this:
 *
 * ``` js
 * const { render, createApp } = createRenderer<Node, Element>({
 *   patchProp,
 *   ...nodeOps
 * })
 * ```
 */
function createRenderer(options) {
    return baseCreateRenderer(options);
}
// Separate API for creating hydration-enabled renderer.
// Hydration logic is only used when calling this function, making it
// tree-shakable.
function createHydrationRenderer(options) {
    return baseCreateRenderer(options, createHydrationFunctions);
}
// implementation
function baseCreateRenderer(options, createHydrationFns) {
    const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, forcePatchProp: hostForcePatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NOOP"], cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
    // Note: functions inside this closure should use `const xxx = () => {}`
    // style in order to prevent being inlined by minifiers.
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, optimized = false) => {
        // patching & not same type, unmount old tree
        if (n1 && !isSameVNodeType(n1, n2)) {
            anchor = getNextHostNode(n1);
            unmount(n1, parentComponent, parentSuspense, true);
            n1 = null;
        }
        if (n2.patchFlag === -2 /* BAIL */) {
            optimized = false;
            n2.dynamicChildren = null;
        }
        const { type, ref, shapeFlag } = n2;
        switch (type) {
            case Text:
                processText(n1, n2, container, anchor);
                break;
            case Comment:
                processCommentNode(n1, n2, container, anchor);
                break;
            case Static:
                if (n1 == null) {
                    mountStaticNode(n2, container, anchor, isSVG);
                }
                else if ((true)) {
                    patchStaticNode(n1, n2, container, isSVG);
                }
                break;
            case Fragment:
                processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                }
                else if (shapeFlag & 6 /* COMPONENT */) {
                    processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                }
                else if (shapeFlag & 64 /* TELEPORT */) {
                    type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals);
                }
                else if ( shapeFlag & 128 /* SUSPENSE */) {
                    type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals);
                }
                else if ((true)) {
                    warn('Invalid VNode type:', type, `(${typeof type})`);
                }
        }
        // set ref
        if (ref != null && parentComponent) {
            setRef(ref, n1 && n1.ref, parentComponent, parentSuspense, n2);
        }
    };
    const processText = (n1, n2, container, anchor) => {
        if (n1 == null) {
            hostInsert((n2.el = hostCreateText(n2.children)), container, anchor);
        }
        else {
            const el = (n2.el = n1.el);
            if (n2.children !== n1.children) {
                hostSetText(el, n2.children);
            }
        }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
        if (n1 == null) {
            hostInsert((n2.el = hostCreateComment(n2.children || '')), container, anchor);
        }
        else {
            // there's no support for dynamic comments
            n2.el = n1.el;
        }
    };
    const mountStaticNode = (n2, container, anchor, isSVG) => {
        [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
    };
    /**
     * Dev / HMR only
     */
    const patchStaticNode = (n1, n2, container, isSVG) => {
        // static nodes are only patched during dev for HMR
        if (n2.children !== n1.children) {
            const anchor = hostNextSibling(n1.anchor);
            // remove existing
            removeStaticNode(n1);
            [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
        }
        else {
            n2.el = n1.el;
            n2.anchor = n1.anchor;
        }
    };
    /**
     * Dev / HMR only
     */
    const moveStaticNode = (vnode, container, anchor) => {
        let cur = vnode.el;
        const end = vnode.anchor;
        while (cur && cur !== end) {
            const next = hostNextSibling(cur);
            hostInsert(cur, container, anchor);
            cur = next;
        }
        hostInsert(end, container, anchor);
    };
    /**
     * Dev / HMR only
     */
    const removeStaticNode = (vnode) => {
        let cur = vnode.el;
        while (cur && cur !== vnode.anchor) {
            const next = hostNextSibling(cur);
            hostRemove(cur);
            cur = next;
        }
        hostRemove(vnode.anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        isSVG = isSVG || n2.type === 'svg';
        if (n1 == null) {
            mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
        }
        else {
            patchElement(n1, n2, parentComponent, parentSuspense, isSVG, optimized);
        }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        let el;
        let vnodeHook;
        const { type, props, shapeFlag, transition, scopeId, patchFlag, dirs } = vnode;
        if (false /* HOISTED */) {}
        else {
            el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is);
            // mount children first, since some props may rely on child content
            // being already rendered, e.g. `<select value>`
            if (shapeFlag & 8 /* TEXT_CHILDREN */) {
                hostSetElementText(el, vnode.children);
            }
            else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== 'foreignObject', optimized || !!vnode.dynamicChildren);
            }
            // props
            if (props) {
                for (const key in props) {
                    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isReservedProp"])(key)) {
                        hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
                    }
                }
                if ((vnodeHook = props.onVnodeBeforeMount)) {
                    invokeVNodeHook(vnodeHook, parentComponent, vnode);
                }
            }
            if (dirs) {
                invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
            }
            // scopeId
            if (scopeId) {
                hostSetScopeId(el, scopeId);
            }
            const treeOwnerId = parentComponent && parentComponent.type.__scopeId;
            // vnode's own scopeId and the current patched component's scopeId is
            // different - this is a slot content node.
            if (treeOwnerId && treeOwnerId !== scopeId) {
                hostSetScopeId(el, treeOwnerId + '-s');
            }
            if (transition && !transition.persisted) {
                transition.beforeEnter(el);
            }
        }
        hostInsert(el, container, anchor);
        // #1583 For inside suspense case, enter hook should call when suspense resolved
        const needCallTransitionHooks = !parentSuspense && transition && !transition.persisted;
        if ((vnodeHook = props && props.onVnodeMounted) ||
            needCallTransitionHooks ||
            dirs) {
            queuePostRenderEffect(() => {
                vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
                needCallTransitionHooks && transition.enter(el);
                dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
            }, parentSuspense);
        }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, optimized, start = 0) => {
        for (let i = start; i < children.length; i++) {
            const child = (children[i] = optimized
                ? cloneIfMounted(children[i])
                : normalizeVNode(children[i]));
            patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
        }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, optimized) => {
        const el = (n2.el = n1.el);
        let { patchFlag, dynamicChildren, dirs } = n2;
        // #1426 take the old vnode's patch flag into account since user may clone a
        // compiler-generated vnode, which de-opts to FULL_PROPS
        patchFlag |= n1.patchFlag & 16 /* FULL_PROPS */;
        const oldProps = n1.props || _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"];
        const newProps = n2.props || _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"];
        let vnodeHook;
        if ((vnodeHook = newProps.onVnodeBeforeUpdate)) {
            invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        }
        if (dirs) {
            invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate');
        }
        if (( true) && isHmrUpdating) {
            // HMR updated, force full diff
            patchFlag = 0;
            optimized = false;
            dynamicChildren = null;
        }
        if (patchFlag > 0) {
            // the presence of a patchFlag means this element's render code was
            // generated by the compiler and can take the fast path.
            // in this path old node and new node are guaranteed to have the same shape
            // (i.e. at the exact same position in the source template)
            if (patchFlag & 16 /* FULL_PROPS */) {
                // element props contain dynamic keys, full diff needed
                patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
            }
            else {
                // class
                // this flag is matched when the element has dynamic class bindings.
                if (patchFlag & 2 /* CLASS */) {
                    if (oldProps.class !== newProps.class) {
                        hostPatchProp(el, 'class', null, newProps.class, isSVG);
                    }
                }
                // style
                // this flag is matched when the element has dynamic style bindings
                if (patchFlag & 4 /* STYLE */) {
                    hostPatchProp(el, 'style', oldProps.style, newProps.style, isSVG);
                }
                // props
                // This flag is matched when the element has dynamic prop/attr bindings
                // other than class and style. The keys of dynamic prop/attrs are saved for
                // faster iteration.
                // Note dynamic keys like :[foo]="bar" will cause this optimization to
                // bail out and go through a full diff because we need to unset the old key
                if (patchFlag & 8 /* PROPS */) {
                    // if the flag is present then dynamicProps must be non-null
                    const propsToUpdate = n2.dynamicProps;
                    for (let i = 0; i < propsToUpdate.length; i++) {
                        const key = propsToUpdate[i];
                        const prev = oldProps[key];
                        const next = newProps[key];
                        if (next !== prev ||
                            (hostForcePatchProp && hostForcePatchProp(el, key))) {
                            hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
                        }
                    }
                }
            }
            // text
            // This flag is matched when the element has only dynamic text children.
            if (patchFlag & 1 /* TEXT */) {
                if (n1.children !== n2.children) {
                    hostSetElementText(el, n2.children);
                }
            }
        }
        else if (!optimized && dynamicChildren == null) {
            // unoptimized, full diff
            patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
        }
        const areChildrenSVG = isSVG && n2.type !== 'foreignObject';
        if (dynamicChildren) {
            patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG);
            if (( true) && parentComponent && parentComponent.type.__hmrId) {
                traverseStaticChildren(n1, n2);
            }
        }
        else if (!optimized) {
            // full diff
            patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG);
        }
        if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
            queuePostRenderEffect(() => {
                vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
                dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated');
            }, parentSuspense);
        }
    };
    // The fast path for blocks.
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG) => {
        for (let i = 0; i < newChildren.length; i++) {
            const oldVNode = oldChildren[i];
            const newVNode = newChildren[i];
            // Determine the container (parent element) for the patch.
            const container = 
            // - In the case of a Fragment, we need to provide the actual parent
            // of the Fragment itself so it can move its children.
            oldVNode.type === Fragment ||
                // - In the case of different nodes, there is going to be a replacement
                // which also requires the correct parent container
                !isSameVNodeType(oldVNode, newVNode) ||
                // - In the case of a component, it could contain anything.
                oldVNode.shapeFlag & 6 /* COMPONENT */
                ? hostParentNode(oldVNode.el)
                : // In other cases, the parent container is not actually used so we
                    // just pass the block element here to avoid a DOM parentNode call.
                    fallbackContainer;
            patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, true);
        }
    };
    const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isReservedProp"])(key))
                    continue;
                const next = newProps[key];
                const prev = oldProps[key];
                if (next !== prev ||
                    (hostForcePatchProp && hostForcePatchProp(el, key))) {
                    hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
                }
            }
            if (oldProps !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"]) {
                for (const key in oldProps) {
                    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isReservedProp"])(key) && !(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
                    }
                }
            }
        }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        const fragmentStartAnchor = (n2.el = n1 ? n1.el : hostCreateText(''));
        const fragmentEndAnchor = (n2.anchor = n1 ? n1.anchor : hostCreateText(''));
        let { patchFlag, dynamicChildren } = n2;
        if (patchFlag > 0) {
            optimized = true;
        }
        if (( true) && isHmrUpdating) {
            // HMR updated, force full diff
            patchFlag = 0;
            optimized = false;
            dynamicChildren = null;
        }
        if (n1 == null) {
            hostInsert(fragmentStartAnchor, container, anchor);
            hostInsert(fragmentEndAnchor, container, anchor);
            // a fragment can only have array children
            // since they are either generated by the compiler, or implicitly created
            // from arrays.
            mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, optimized);
        }
        else {
            if (patchFlag > 0 &&
                patchFlag & 64 /* STABLE_FRAGMENT */ &&
                dynamicChildren) {
                // a stable fragment (template root or <template v-for>) doesn't need to
                // patch children order, but it may contain dynamicChildren.
                patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG);
                if (( true) && parentComponent && parentComponent.type.__hmrId) {
                    traverseStaticChildren(n1, n2);
                }
            }
            else {
                // keyed / unkeyed, or manual fragments.
                // for keyed & unkeyed, since they are compiler generated from v-for,
                // each child is guaranteed to be a block so the fragment will never
                // have dynamicChildren.
                patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, optimized);
            }
        }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        if (n1 == null) {
            if (n2.shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
                parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
            }
            else {
                mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
            }
        }
        else {
            updateComponent(n1, n2, optimized);
        }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense));
        if (( true) && instance.type.__hmrId) {
            registerHMR(instance);
        }
        if ((true)) {
            pushWarningContext(initialVNode);
            startMeasure(instance, `mount`);
        }
        // inject renderer internals for keepAlive
        if (isKeepAlive(initialVNode)) {
            instance.ctx.renderer = internals;
        }
        // resolve props and slots for setup context
        if ((true)) {
            startMeasure(instance, `init`);
        }
        setupComponent(instance);
        if ((true)) {
            endMeasure(instance, `init`);
        }
        // setup() is async. This component relies on async logic to be resolved
        // before proceeding
        if ( instance.asyncDep) {
            if (!parentSuspense) {
                if ((true))
                    warn('async setup() is used without a suspense boundary!');
                return;
            }
            parentSuspense.registerDep(instance, setupRenderEffect);
            // Give it a placeholder if this is not hydration
            if (!initialVNode.el) {
                const placeholder = (instance.subTree = createVNode(Comment));
                processCommentNode(null, placeholder, container, anchor);
            }
            return;
        }
        setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
        if ((true)) {
            popWarningContext();
            endMeasure(instance, `mount`);
        }
    };
    const updateComponent = (n1, n2, optimized) => {
        const instance = (n2.component = n1.component);
        if (shouldUpdateComponent(n1, n2, optimized)) {
            if (
                instance.asyncDep &&
                !instance.asyncResolved) {
                // async & still pending - just update props and slots
                // since the component's reactive effect for render isn't set-up yet
                if ((true)) {
                    pushWarningContext(n2);
                }
                updateComponentPreRender(instance, n2, optimized);
                if ((true)) {
                    popWarningContext();
                }
                return;
            }
            else {
                // normal update
                instance.next = n2;
                // in case the child component is also queued, remove it to avoid
                // double updating the same child component in the same flush.
                invalidateJob(instance.update);
                // instance.update is the reactive effect runner.
                instance.update();
            }
        }
        else {
            // no update needed. just copy over properties
            n2.component = n1.component;
            n2.el = n1.el;
            instance.vnode = n2;
        }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
        // create reactive effect for rendering
        instance.update = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["effect"])(function componentEffect() {
            if (!instance.isMounted) {
                let vnodeHook;
                const { el, props } = initialVNode;
                const { bm, m, a, parent } = instance;
                if ((true)) {
                    startMeasure(instance, `render`);
                }
                const subTree = (instance.subTree = renderComponentRoot(instance));
                if ((true)) {
                    endMeasure(instance, `render`);
                }
                // beforeMount hook
                if (bm) {
                    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["invokeArrayFns"])(bm);
                }
                // onVnodeBeforeMount
                if ((vnodeHook = props && props.onVnodeBeforeMount)) {
                    invokeVNodeHook(vnodeHook, parent, initialVNode);
                }
                if (el && hydrateNode) {
                    if ((true)) {
                        startMeasure(instance, `hydrate`);
                    }
                    // vnode has adopted host node - perform hydration instead of mount.
                    hydrateNode(initialVNode.el, subTree, instance, parentSuspense);
                    if ((true)) {
                        endMeasure(instance, `hydrate`);
                    }
                }
                else {
                    if ((true)) {
                        startMeasure(instance, `patch`);
                    }
                    patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
                    if ((true)) {
                        endMeasure(instance, `patch`);
                    }
                    initialVNode.el = subTree.el;
                }
                // mounted hook
                if (m) {
                    queuePostRenderEffect(m, parentSuspense);
                }
                // onVnodeMounted
                if ((vnodeHook = props && props.onVnodeMounted)) {
                    queuePostRenderEffect(() => {
                        invokeVNodeHook(vnodeHook, parent, initialVNode);
                    }, parentSuspense);
                }
                // activated hook for keep-alive roots.
                if (a &&
                    initialVNode.shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
                    queuePostRenderEffect(a, parentSuspense);
                }
                instance.isMounted = true;
            }
            else {
                // updateComponent
                // This is triggered by mutation of component's own state (next: null)
                // OR parent calling processComponent (next: VNode)
                let { next, bu, u, parent, vnode } = instance;
                let originNext = next;
                let vnodeHook;
                if ((true)) {
                    pushWarningContext(next || instance.vnode);
                }
                if (next) {
                    updateComponentPreRender(instance, next, optimized);
                }
                else {
                    next = vnode;
                }
                if ((true)) {
                    startMeasure(instance, `render`);
                }
                const nextTree = renderComponentRoot(instance);
                if ((true)) {
                    endMeasure(instance, `render`);
                }
                const prevTree = instance.subTree;
                instance.subTree = nextTree;
                next.el = vnode.el;
                // beforeUpdate hook
                if (bu) {
                    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["invokeArrayFns"])(bu);
                }
                // onVnodeBeforeUpdate
                if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
                    invokeVNodeHook(vnodeHook, parent, next, vnode);
                }
                // reset refs
                // only needed if previous patch had refs
                if (instance.refs !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"]) {
                    instance.refs = {};
                }
                if ((true)) {
                    startMeasure(instance, `patch`);
                }
                patch(prevTree, nextTree, 
                // parent may have changed if it's in a teleport
                hostParentNode(prevTree.el), 
                // anchor may have changed if it's in a fragment
                getNextHostNode(prevTree), instance, parentSuspense, isSVG);
                if ((true)) {
                    endMeasure(instance, `patch`);
                }
                next.el = nextTree.el;
                if (originNext === null) {
                    // self-triggered update. In case of HOC, update parent component
                    // vnode el. HOC is indicated by parent instance's subTree pointing
                    // to child component's vnode
                    updateHOCHostEl(instance, nextTree.el);
                }
                // updated hook
                if (u) {
                    queuePostRenderEffect(u, parentSuspense);
                }
                // onVnodeUpdated
                if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
                    queuePostRenderEffect(() => {
                        invokeVNodeHook(vnodeHook, parent, next, vnode);
                    }, parentSuspense);
                }
                if ((true)) {
                    popWarningContext();
                    componentUpdated(instance);
                }
            }
        }, ( true) ? createDevEffectOptions(instance) : undefined);
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
        if (( true) && instance.type.__hmrId) {
            optimized = false;
        }
        nextVNode.component = instance;
        const prevProps = instance.vnode.props;
        instance.vnode = nextVNode;
        instance.next = null;
        updateProps(instance, nextVNode.props, prevProps, optimized);
        updateSlots(instance, nextVNode.children);
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized = false) => {
        const c1 = n1 && n1.children;
        const prevShapeFlag = n1 ? n1.shapeFlag : 0;
        const c2 = n2.children;
        const { patchFlag, shapeFlag } = n2;
        // fast path
        if (patchFlag > 0) {
            if (patchFlag & 128 /* KEYED_FRAGMENT */) {
                // this could be either fully-keyed or mixed (some keyed some not)
                // presence of patchFlag means children are guaranteed to be arrays
                patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                return;
            }
            else if (patchFlag & 256 /* UNKEYED_FRAGMENT */) {
                // unkeyed
                patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                return;
            }
        }
        // children has 3 possibilities: text, array or no children.
        if (shapeFlag & 8 /* TEXT_CHILDREN */) {
            // text children fast path
            if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
                unmountChildren(c1, parentComponent, parentSuspense);
            }
            if (c2 !== c1) {
                hostSetElementText(container, c2);
            }
        }
        else {
            if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
                // prev children was array
                if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                    // two arrays, cannot assume anything, do full diff
                    patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                }
                else {
                    // no new children, just unmount old
                    unmountChildren(c1, parentComponent, parentSuspense, true);
                }
            }
            else {
                // prev children was text OR null
                // new children is array OR null
                if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
                    hostSetElementText(container, '');
                }
                // mount new if array
                if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                    mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                }
            }
        }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        c1 = c1 || _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_ARR"];
        c2 = c2 || _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_ARR"];
        const oldLength = c1.length;
        const newLength = c2.length;
        const commonLength = Math.min(oldLength, newLength);
        let i;
        for (i = 0; i < commonLength; i++) {
            const nextChild = (c2[i] = optimized
                ? cloneIfMounted(c2[i])
                : normalizeVNode(c2[i]));
            patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, optimized);
        }
        if (oldLength > newLength) {
            // remove old
            unmountChildren(c1, parentComponent, parentSuspense, true, commonLength);
        }
        else {
            // mount new
            mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, commonLength);
        }
    };
    // can be all-keyed or mixed
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
        let i = 0;
        const l2 = c2.length;
        let e1 = c1.length - 1; // prev ending index
        let e2 = l2 - 1; // next ending index
        // 1. sync from start
        // (a b) c
        // (a b) d e
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = (c2[i] = optimized
                ? cloneIfMounted(c2[i])
                : normalizeVNode(c2[i]));
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, optimized);
            }
            else {
                break;
            }
            i++;
        }
        // 2. sync from end
        // a (b c)
        // d e (b c)
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = (c2[e2] = optimized
                ? cloneIfMounted(c2[e2])
                : normalizeVNode(c2[e2]));
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, optimized);
            }
            else {
                break;
            }
            e1--;
            e2--;
        }
        // 3. common sequence + mount
        // (a b)
        // (a b) c
        // i = 2, e1 = 1, e2 = 2
        // (a b)
        // c (a b)
        // i = 0, e1 = -1, e2 = 0
        if (i > e1) {
            if (i <= e2) {
                const nextPos = e2 + 1;
                const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
                while (i <= e2) {
                    patch(null, (c2[i] = optimized
                        ? cloneIfMounted(c2[i])
                        : normalizeVNode(c2[i])), container, anchor, parentComponent, parentSuspense, isSVG);
                    i++;
                }
            }
        }
        // 4. common sequence + unmount
        // (a b) c
        // (a b)
        // i = 2, e1 = 2, e2 = 1
        // a (b c)
        // (b c)
        // i = 0, e1 = 0, e2 = -1
        else if (i > e2) {
            while (i <= e1) {
                unmount(c1[i], parentComponent, parentSuspense, true);
                i++;
            }
        }
        // 5. unknown sequence
        // [i ... e1 + 1]: a b [c d e] f g
        // [i ... e2 + 1]: a b [e d c h] f g
        // i = 2, e1 = 4, e2 = 5
        else {
            const s1 = i; // prev starting index
            const s2 = i; // next starting index
            // 5.1 build key:index map for newChildren
            const keyToNewIndexMap = new Map();
            for (i = s2; i <= e2; i++) {
                const nextChild = (c2[i] = optimized
                    ? cloneIfMounted(c2[i])
                    : normalizeVNode(c2[i]));
                if (nextChild.key != null) {
                    if (( true) && keyToNewIndexMap.has(nextChild.key)) {
                        warn(`Duplicate keys found during update:`, JSON.stringify(nextChild.key), `Make sure keys are unique.`);
                    }
                    keyToNewIndexMap.set(nextChild.key, i);
                }
            }
            // 5.2 loop through old children left to be patched and try to patch
            // matching nodes & remove nodes that are no longer present
            let j;
            let patched = 0;
            const toBePatched = e2 - s2 + 1;
            let moved = false;
            // used to track whether any node has moved
            let maxNewIndexSoFar = 0;
            // works as Map<newIndex, oldIndex>
            // Note that oldIndex is offset by +1
            // and oldIndex = 0 is a special value indicating the new node has
            // no corresponding old node.
            // used for determining longest stable subsequence
            const newIndexToOldIndexMap = new Array(toBePatched);
            for (i = 0; i < toBePatched; i++)
                newIndexToOldIndexMap[i] = 0;
            for (i = s1; i <= e1; i++) {
                const prevChild = c1[i];
                if (patched >= toBePatched) {
                    // all new children have been patched so this can only be a removal
                    unmount(prevChild, parentComponent, parentSuspense, true);
                    continue;
                }
                let newIndex;
                if (prevChild.key != null) {
                    newIndex = keyToNewIndexMap.get(prevChild.key);
                }
                else {
                    // key-less node, try to locate a key-less node of the same type
                    for (j = s2; j <= e2; j++) {
                        if (newIndexToOldIndexMap[j - s2] === 0 &&
                            isSameVNodeType(prevChild, c2[j])) {
                            newIndex = j;
                            break;
                        }
                    }
                }
                if (newIndex === undefined) {
                    unmount(prevChild, parentComponent, parentSuspense, true);
                }
                else {
                    newIndexToOldIndexMap[newIndex - s2] = i + 1;
                    if (newIndex >= maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex;
                    }
                    else {
                        moved = true;
                    }
                    patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, optimized);
                    patched++;
                }
            }
            // 5.3 move and mount
            // generate longest stable subsequence only when nodes have moved
            const increasingNewIndexSequence = moved
                ? getSequence(newIndexToOldIndexMap)
                : _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_ARR"];
            j = increasingNewIndexSequence.length - 1;
            // looping backwards so that we can use last patched node as anchor
            for (i = toBePatched - 1; i >= 0; i--) {
                const nextIndex = s2 + i;
                const nextChild = c2[nextIndex];
                const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
                if (newIndexToOldIndexMap[i] === 0) {
                    // mount new
                    patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG);
                }
                else if (moved) {
                    // move if:
                    // There is no stable subsequence (e.g. a reverse)
                    // OR current node is not among the stable sequence
                    if (j < 0 || i !== increasingNewIndexSequence[j]) {
                        move(nextChild, container, anchor, 2 /* REORDER */);
                    }
                    else {
                        j--;
                    }
                }
            }
        }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
        const { el, type, transition, children, shapeFlag } = vnode;
        if (shapeFlag & 6 /* COMPONENT */) {
            move(vnode.component.subTree, container, anchor, moveType);
            return;
        }
        if ( shapeFlag & 128 /* SUSPENSE */) {
            vnode.suspense.move(container, anchor, moveType);
            return;
        }
        if (shapeFlag & 64 /* TELEPORT */) {
            type.move(vnode, container, anchor, internals);
            return;
        }
        if (type === Fragment) {
            hostInsert(el, container, anchor);
            for (let i = 0; i < children.length; i++) {
                move(children[i], container, anchor, moveType);
            }
            hostInsert(vnode.anchor, container, anchor);
            return;
        }
        // static node move can only happen when force updating HMR
        if (( true) && type === Static) {
            moveStaticNode(vnode, container, anchor);
            return;
        }
        // single nodes
        const needTransition = moveType !== 2 /* REORDER */ &&
            shapeFlag & 1 /* ELEMENT */ &&
            transition;
        if (needTransition) {
            if (moveType === 0 /* ENTER */) {
                transition.beforeEnter(el);
                hostInsert(el, container, anchor);
                queuePostRenderEffect(() => transition.enter(el), parentSuspense);
            }
            else {
                const { leave, delayLeave, afterLeave } = transition;
                const remove = () => hostInsert(el, container, anchor);
                const performLeave = () => {
                    leave(el, () => {
                        remove();
                        afterLeave && afterLeave();
                    });
                };
                if (delayLeave) {
                    delayLeave(el, remove, performLeave);
                }
                else {
                    performLeave();
                }
            }
        }
        else {
            hostInsert(el, container, anchor);
        }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false) => {
        const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
        // unset ref
        if (ref != null && parentComponent) {
            setRef(ref, null, parentComponent, parentSuspense, null);
        }
        if (shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
            parentComponent.ctx.deactivate(vnode);
            return;
        }
        const shouldInvokeDirs = shapeFlag & 1 /* ELEMENT */ && dirs;
        let vnodeHook;
        if ((vnodeHook = props && props.onVnodeBeforeUnmount)) {
            invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
        if (shapeFlag & 6 /* COMPONENT */) {
            unmountComponent(vnode.component, parentSuspense, doRemove);
        }
        else {
            if ( shapeFlag & 128 /* SUSPENSE */) {
                vnode.suspense.unmount(parentSuspense, doRemove);
                return;
            }
            if (shouldInvokeDirs) {
                invokeDirectiveHook(vnode, null, parentComponent, 'beforeUnmount');
            }
            if (dynamicChildren &&
                // #1153: fast path should not be taken for non-stable (v-for) fragments
                (type !== Fragment ||
                    (patchFlag > 0 && patchFlag & 64 /* STABLE_FRAGMENT */))) {
                // fast path for block nodes: only need to unmount dynamic children.
                unmountChildren(dynamicChildren, parentComponent, parentSuspense);
            }
            else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                unmountChildren(children, parentComponent, parentSuspense);
            }
            // an unmounted teleport should always remove its children
            if (shapeFlag & 64 /* TELEPORT */) {
                vnode.type.remove(vnode, internals);
            }
            if (doRemove) {
                remove(vnode);
            }
        }
        if ((vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
            queuePostRenderEffect(() => {
                vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
                shouldInvokeDirs &&
                    invokeDirectiveHook(vnode, null, parentComponent, 'unmounted');
            }, parentSuspense);
        }
    };
    const remove = vnode => {
        const { type, el, anchor, transition } = vnode;
        if (type === Fragment) {
            removeFragment(el, anchor);
            return;
        }
        if (( true) && type === Static) {
            removeStaticNode(vnode);
            return;
        }
        const performRemove = () => {
            hostRemove(el);
            if (transition && !transition.persisted && transition.afterLeave) {
                transition.afterLeave();
            }
        };
        if (vnode.shapeFlag & 1 /* ELEMENT */ &&
            transition &&
            !transition.persisted) {
            const { leave, delayLeave } = transition;
            const performLeave = () => leave(el, performRemove);
            if (delayLeave) {
                delayLeave(vnode.el, performRemove, performLeave);
            }
            else {
                performLeave();
            }
        }
        else {
            performRemove();
        }
    };
    const removeFragment = (cur, end) => {
        // For fragments, directly remove all contained DOM nodes.
        // (fragment child nodes cannot have transition)
        let next;
        while (cur !== end) {
            next = hostNextSibling(cur);
            hostRemove(cur);
            cur = next;
        }
        hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
        if (( true) && instance.type.__hmrId) {
            unregisterHMR(instance);
        }
        const { bum, effects, update, subTree, um, da, isDeactivated } = instance;
        // beforeUnmount hook
        if (bum) {
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["invokeArrayFns"])(bum);
        }
        if (effects) {
            for (let i = 0; i < effects.length; i++) {
                Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["stop"])(effects[i]);
            }
        }
        // update may be null if a component is unmounted before its async
        // setup has resolved.
        if (update) {
            Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["stop"])(update);
            unmount(subTree, instance, parentSuspense, doRemove);
        }
        // unmounted hook
        if (um) {
            queuePostRenderEffect(um, parentSuspense);
        }
        // deactivated hook
        if (da &&
            !isDeactivated &&
            instance.vnode.shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
            queuePostRenderEffect(da, parentSuspense);
        }
        queuePostRenderEffect(() => {
            instance.isUnmounted = true;
        }, parentSuspense);
        // A component with async dep inside a pending suspense is unmounted before
        // its async dep resolves. This should remove the dep from the suspense, and
        // cause the suspense to resolve immediately if that was the last dep.
        if (
            parentSuspense &&
            !parentSuspense.isResolved &&
            !parentSuspense.isUnmounted &&
            instance.asyncDep &&
            !instance.asyncResolved) {
            parentSuspense.deps--;
            if (parentSuspense.deps === 0) {
                parentSuspense.resolve();
            }
        }
        ( true) && componentRemoved(instance);
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, start = 0) => {
        for (let i = start; i < children.length; i++) {
            unmount(children[i], parentComponent, parentSuspense, doRemove);
        }
    };
    const getNextHostNode = vnode => {
        if (vnode.shapeFlag & 6 /* COMPONENT */) {
            return getNextHostNode(vnode.component.subTree);
        }
        if ( vnode.shapeFlag & 128 /* SUSPENSE */) {
            return vnode.suspense.next();
        }
        return hostNextSibling((vnode.anchor || vnode.el));
    };
    /**
     * #1156
     * When a component is HMR-enabled, we need to make sure that all static nodes
     * inside a block also inherit the DOM element from the previous tree so that
     * HMR updates (which are full updates) can retrieve the element for patching.
     *
     * Dev only.
     */
    const traverseStaticChildren = (n1, n2) => {
        const ch1 = n1.children;
        const ch2 = n2.children;
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(ch1) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(ch2)) {
            for (let i = 0; i < ch1.length; i++) {
                // this is only called in the optimized path so array children are
                // guaranteed to be vnodes
                const c1 = ch1[i];
                const c2 = (ch2[i] = cloneIfMounted(ch2[i]));
                if (c2.shapeFlag & 1 /* ELEMENT */ && !c2.dynamicChildren) {
                    if (c2.patchFlag <= 0) {
                        c2.el = c1.el;
                    }
                    traverseStaticChildren(c1, c2);
                }
            }
        }
    };
    const render = (vnode, container) => {
        if (vnode == null) {
            if (container._vnode) {
                unmount(container._vnode, null, null, true);
            }
        }
        else {
            patch(container._vnode || null, vnode, container);
        }
        flushPostFlushCbs();
        container._vnode = vnode;
    };
    const internals = {
        p: patch,
        um: unmount,
        m: move,
        r: remove,
        mt: mountComponent,
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        n: getNextHostNode,
        o: options
    };
    let hydrate;
    let hydrateNode;
    if (createHydrationFns) {
        [hydrate, hydrateNode] = createHydrationFns(internals);
    }
    return {
        render,
        hydrate,
        createApp: createAppAPI(render, hydrate)
    };
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7 /* VNODE_HOOK */, [
        vnode,
        prevVNode
    ]);
}
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = ((u + v) / 2) | 0;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}

// Simple effect.
function watchEffect(effect, options) {
    return doWatch(effect, null, options);
}
// initial value for watchers to trigger on undefined initial values
const INITIAL_WATCHER_VALUE = {};
// implementation
function watch(source, cb, options) {
    if (( true) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(cb)) {
        warn(`\`watch(fn, options?)\` signature has been moved to a separate API. ` +
            `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
            `supports \`watch(source, cb, options?) signature.`);
    }
    return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"], instance = currentInstance) {
    if (( true) && !cb) {
        if (immediate !== undefined) {
            warn(`watch() "immediate" option is only respected when using the ` +
                `watch(source, callback, options?) signature.`);
        }
        if (deep !== undefined) {
            warn(`watch() "deep" option is only respected when using the ` +
                `watch(source, callback, options?) signature.`);
        }
    }
    const warnInvalidSource = (s) => {
        warn(`Invalid watch source: `, s, `A watch source can only be a getter/effect function, a ref, ` +
            `a reactive object, or an array of these types.`);
    };
    let getter;
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(source)) {
        getter = () => source.map(s => {
            if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isRef"])(s)) {
                return s.value;
            }
            else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isReactive"])(s)) {
                return traverse(s);
            }
            else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(s)) {
                return callWithErrorHandling(s, instance, 2 /* WATCH_GETTER */);
            }
            else {
                ( true) && warnInvalidSource(s);
            }
        });
    }
    else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isRef"])(source)) {
        getter = () => source.value;
    }
    else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["isReactive"])(source)) {
        getter = () => source;
        deep = true;
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(source)) {
        if (cb) {
            // getter with cb
            getter = () => callWithErrorHandling(source, instance, 2 /* WATCH_GETTER */);
        }
        else {
            // no cb -> simple effect
            getter = () => {
                if (instance && instance.isUnmounted) {
                    return;
                }
                if (cleanup) {
                    cleanup();
                }
                return callWithErrorHandling(source, instance, 3 /* WATCH_CALLBACK */, [onInvalidate]);
            };
        }
    }
    else {
        getter = _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NOOP"];
        ( true) && warnInvalidSource(source);
    }
    if (cb && deep) {
        const baseGetter = getter;
        getter = () => traverse(baseGetter());
    }
    let cleanup;
    const onInvalidate = (fn) => {
        cleanup = runner.options.onStop = () => {
            callWithErrorHandling(fn, instance, 4 /* WATCH_CLEANUP */);
        };
    };
    let oldValue = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(source) ? [] : INITIAL_WATCHER_VALUE;
    const job = () => {
        if (!runner.active) {
            return;
        }
        if (cb) {
            // watch(source, cb)
            const newValue = runner();
            if (deep || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasChanged"])(newValue, oldValue)) {
                // cleanup before running cb again
                if (cleanup) {
                    cleanup();
                }
                callWithAsyncErrorHandling(cb, instance, 3 /* WATCH_CALLBACK */, [
                    newValue,
                    // pass undefined as the old value when it's changed for the first time
                    oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
                    onInvalidate
                ]);
                oldValue = newValue;
            }
        }
        else {
            // watchEffect
            runner();
        }
    };
    let scheduler;
    if (flush === 'sync') {
        scheduler = job;
    }
    else if (flush === 'pre') {
        // ensure it's queued before component updates (which have positive ids)
        job.id = -1;
        scheduler = () => {
            if (!instance || instance.isMounted) {
                queueJob(job);
            }
            else {
                // with 'pre' option, the first call must happen before
                // the component is mounted so it is called synchronously.
                job();
            }
        };
    }
    else {
        scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
    }
    const runner = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["effect"])(getter, {
        lazy: true,
        onTrack,
        onTrigger,
        scheduler
    });
    recordInstanceBoundEffect(runner);
    // initial run
    if (cb) {
        if (immediate) {
            job();
        }
        else {
            oldValue = runner();
        }
    }
    else {
        runner();
    }
    return () => {
        Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["stop"])(runner);
        if (instance) {
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["remove"])(instance.effects, runner);
        }
    };
}
// this.$watch
function instanceWatch(source, cb, options) {
    const publicThis = this.proxy;
    const getter = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(source)
        ? () => publicThis[source]
        : source.bind(publicThis);
    return doWatch(getter, cb.bind(publicThis), options, this);
}
function traverse(value, seen = new Set()) {
    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(value) || seen.has(value)) {
        return value;
    }
    seen.add(value);
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(value)) {
        for (let i = 0; i < value.length; i++) {
            traverse(value[i], seen);
        }
    }
    else if (value instanceof Map) {
        value.forEach((v, key) => {
            // to register mutation dep for existing keys
            traverse(value.get(key), seen);
        });
    }
    else if (value instanceof Set) {
        value.forEach(v => {
            traverse(v, seen);
        });
    }
    else {
        for (const key in value) {
            traverse(value[key], seen);
        }
    }
    return value;
}

function provide(key, value) {
    if (!currentInstance) {
        if ((true)) {
            warn(`provide() can only be used inside setup().`);
        }
    }
    else {
        let provides = currentInstance.provides;
        // by default an instance inherits its parent's provides object
        // but when it needs to provide values of its own, it creates its
        // own provides object using parent provides object as prototype.
        // this way in `inject` we can simply look up injections from direct
        // parent and let the prototype chain do the work.
        const parentProvides = currentInstance.parent && currentInstance.parent.provides;
        if (parentProvides === provides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        // TS doesn't allow symbol as index type
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    // fallback to `currentRenderingInstance` so that this can be called in
    // a functional component
    const instance = currentInstance || currentRenderingInstance;
    if (instance) {
        const provides = instance.provides;
        if (key in provides) {
            // TS doesn't allow symbol as index type
            return provides[key];
        }
        else if (arguments.length > 1) {
            return defaultValue;
        }
        else if ((true)) {
            warn(`injection "${String(key)}" not found.`);
        }
    }
    else if ((true)) {
        warn(`inject() can only be used inside setup() or functional components.`);
    }
}

function createDuplicateChecker() {
    const cache = Object.create(null);
    return (type, key) => {
        if (cache[key]) {
            warn(`${type} property "${key}" is already defined in ${cache[key]}.`);
        }
        else {
            cache[key] = type;
        }
    };
}
function applyOptions(instance, options, deferredData = [], deferredWatch = [], asMixin = false) {
    const { 
    // composition
    mixins, extends: extendsOptions, 
    // state
    data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, 
    // assets
    components, directives, 
    // lifecycle
    beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeUnmount, unmounted, renderTracked, renderTriggered, errorCaptured } = options;
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    const globalMixins = instance.appContext.mixins;
    // call it only during dev
    // applyOptions is called non-as-mixin once per instance
    if (!asMixin) {
        callSyncHook('beforeCreate', options, publicThis, globalMixins);
        // global mixins are applied first
        applyMixins(instance, globalMixins, deferredData, deferredWatch);
    }
    // extending a base component...
    if (extendsOptions) {
        applyOptions(instance, extendsOptions, deferredData, deferredWatch, true);
    }
    // local mixins
    if (mixins) {
        applyMixins(instance, mixins, deferredData, deferredWatch);
    }
    const checkDuplicateProperties = ( true) ? createDuplicateChecker() : undefined;
    if ((true)) {
        const propsOptions = normalizePropsOptions(options)[0];
        if (propsOptions) {
            for (const key in propsOptions) {
                checkDuplicateProperties("Props" /* PROPS */, key);
            }
        }
    }
    // options initialization order (to be consistent with Vue 2):
    // - props (already done outside of this function)
    // - inject
    // - methods
    // - data (deferred since it relies on `this` access)
    // - computed
    // - watch (deferred since it relies on `this` access)
    if (injectOptions) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(injectOptions)) {
            for (let i = 0; i < injectOptions.length; i++) {
                const key = injectOptions[i];
                ctx[key] = inject(key);
                if ((true)) {
                    checkDuplicateProperties("Inject" /* INJECT */, key);
                }
            }
        }
        else {
            for (const key in injectOptions) {
                const opt = injectOptions[key];
                if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(opt)) {
                    ctx[key] = inject(opt.from, opt.default);
                }
                else {
                    ctx[key] = inject(opt);
                }
                if ((true)) {
                    checkDuplicateProperties("Inject" /* INJECT */, key);
                }
            }
        }
    }
    if (methods) {
        for (const key in methods) {
            const methodHandler = methods[key];
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(methodHandler)) {
                ctx[key] = methodHandler.bind(publicThis);
                if ((true)) {
                    checkDuplicateProperties("Methods" /* METHODS */, key);
                }
            }
            else if ((true)) {
                warn(`Method "${key}" has type "${typeof methodHandler}" in the component definition. ` +
                    `Did you reference the function correctly?`);
            }
        }
    }
    if (dataOptions) {
        if (( true) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(dataOptions)) {
            warn(`The data option must be a function. ` +
                `Plain object usage is no longer supported.`);
        }
        if (asMixin) {
            deferredData.push(dataOptions);
        }
        else {
            resolveData(instance, dataOptions, publicThis);
        }
    }
    if (!asMixin) {
        if (deferredData.length) {
            deferredData.forEach(dataFn => resolveData(instance, dataFn, publicThis));
        }
        if ((true)) {
            const rawData = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRaw"])(instance.data);
            for (const key in rawData) {
                checkDuplicateProperties("Data" /* DATA */, key);
                // expose data on ctx during dev
                if (key[0] !== '$' && key[0] !== '_') {
                    Object.defineProperty(ctx, key, {
                        configurable: true,
                        enumerable: true,
                        get: () => rawData[key],
                        set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NOOP"]
                    });
                }
            }
        }
    }
    if (computedOptions) {
        for (const key in computedOptions) {
            const opt = computedOptions[key];
            const get = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(opt)
                ? opt.bind(publicThis, publicThis)
                : Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(opt.get)
                    ? opt.get.bind(publicThis, publicThis)
                    : _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NOOP"];
            if (( true) && get === _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NOOP"]) {
                warn(`Computed property "${key}" has no getter.`);
            }
            const set = !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(opt) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(opt.set)
                ? opt.set.bind(publicThis)
                : ( true)
                    ? () => {
                        warn(`Write operation failed: computed property "${key}" is readonly.`);
                    }
                    : undefined;
            const c = computed({
                get,
                set
            });
            Object.defineProperty(ctx, key, {
                enumerable: true,
                configurable: true,
                get: () => c.value,
                set: v => (c.value = v)
            });
            if ((true)) {
                checkDuplicateProperties("Computed" /* COMPUTED */, key);
            }
        }
    }
    if (watchOptions) {
        deferredWatch.push(watchOptions);
    }
    if (!asMixin && deferredWatch.length) {
        deferredWatch.forEach(watchOptions => {
            for (const key in watchOptions) {
                createWatcher(watchOptions[key], ctx, publicThis, key);
            }
        });
    }
    if (provideOptions) {
        const provides = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(provideOptions)
            ? provideOptions.call(publicThis)
            : provideOptions;
        for (const key in provides) {
            provide(key, provides[key]);
        }
    }
    // asset options
    if (components) {
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(instance.components, components);
    }
    if (directives) {
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(instance.directives, directives);
    }
    // lifecycle options
    if (!asMixin) {
        callSyncHook('created', options, publicThis, globalMixins);
    }
    if (beforeMount) {
        onBeforeMount(beforeMount.bind(publicThis));
    }
    if (mounted) {
        onMounted(mounted.bind(publicThis));
    }
    if (beforeUpdate) {
        onBeforeUpdate(beforeUpdate.bind(publicThis));
    }
    if (updated) {
        onUpdated(updated.bind(publicThis));
    }
    if (activated) {
        onActivated(activated.bind(publicThis));
    }
    if (deactivated) {
        onDeactivated(deactivated.bind(publicThis));
    }
    if (errorCaptured) {
        onErrorCaptured(errorCaptured.bind(publicThis));
    }
    if (renderTracked) {
        onRenderTracked(renderTracked.bind(publicThis));
    }
    if (renderTriggered) {
        onRenderTriggered(renderTriggered.bind(publicThis));
    }
    if (beforeUnmount) {
        onBeforeUnmount(beforeUnmount.bind(publicThis));
    }
    if (unmounted) {
        onUnmounted(unmounted.bind(publicThis));
    }
}
function callSyncHook(name, options, ctx, globalMixins) {
    callHookFromMixins(name, globalMixins, ctx);
    const baseHook = options.extends && options.extends[name];
    if (baseHook) {
        baseHook.call(ctx);
    }
    const mixins = options.mixins;
    if (mixins) {
        callHookFromMixins(name, mixins, ctx);
    }
    const selfHook = options[name];
    if (selfHook) {
        selfHook.call(ctx);
    }
}
function callHookFromMixins(name, mixins, ctx) {
    for (let i = 0; i < mixins.length; i++) {
        const fn = mixins[i][name];
        if (fn) {
            fn.call(ctx);
        }
    }
}
function applyMixins(instance, mixins, deferredData, deferredWatch) {
    for (let i = 0; i < mixins.length; i++) {
        applyOptions(instance, mixins[i], deferredData, deferredWatch, true);
    }
}
function resolveData(instance, dataFn, publicThis) {
    const data = dataFn.call(publicThis, publicThis);
    if (( true) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isPromise"])(data)) {
        warn(`data() returned a Promise - note data() cannot be async; If you ` +
            `intend to perform data fetching before component renders, use ` +
            `async setup() + <Suspense>.`);
    }
    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(data)) {
        ( true) && warn(`data() should return an object.`);
    }
    else if (instance.data === _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"]) {
        instance.data = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["reactive"])(data);
    }
    else {
        // existing data: this is a mixin or extends.
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(instance.data, data);
    }
}
function createWatcher(raw, ctx, publicThis, key) {
    const getter = () => publicThis[key];
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(raw)) {
        const handler = ctx[raw];
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(handler)) {
            watch(getter, handler);
        }
        else if ((true)) {
            warn(`Invalid watch handler specified by key "${raw}"`, handler);
        }
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(raw)) {
        watch(getter, raw.bind(publicThis));
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(raw)) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(raw)) {
            raw.forEach(r => createWatcher(r, ctx, publicThis, key));
        }
        else {
            watch(getter, raw.handler.bind(publicThis), raw);
        }
    }
    else if ((true)) {
        warn(`Invalid watch option: "${key}"`);
    }
}
function resolveMergedOptions(instance) {
    const raw = instance.type;
    const { __merged, mixins, extends: extendsOptions } = raw;
    if (__merged)
        return __merged;
    const globalMixins = instance.appContext.mixins;
    if (!globalMixins.length && !mixins && !extendsOptions)
        return raw;
    const options = {};
    globalMixins.forEach(m => mergeOptions(options, m, instance));
    extendsOptions && mergeOptions(options, extendsOptions, instance);
    mixins && mixins.forEach(m => mergeOptions(options, m, instance));
    mergeOptions(options, raw, instance);
    return (raw.__merged = options);
}
function mergeOptions(to, from, instance) {
    const strats = instance.appContext.config.optionMergeStrategies;
    for (const key in from) {
        if (strats && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(strats, key)) {
            to[key] = strats[key](to[key], from[key], instance.proxy, key);
        }
        else if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(to, key)) {
            to[key] = from[key];
        }
    }
}

const publicPropertiesMap = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(Object.create(null), {
    $: i => i,
    $el: i => i.vnode.el,
    $data: i => i.data,
    $props: i => (( true) ? Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["shallowReadonly"])(i.props) : undefined),
    $attrs: i => (( true) ? Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["shallowReadonly"])(i.attrs) : undefined),
    $slots: i => (( true) ? Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["shallowReadonly"])(i.slots) : undefined),
    $refs: i => (( true) ? Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["shallowReadonly"])(i.refs) : undefined),
    $parent: i => i.parent && i.parent.proxy,
    $root: i => i.root && i.root.proxy,
    $emit: i => i.emit,
    $options: i => ( resolveMergedOptions(i) ),
    $forceUpdate: i => () => queueJob(i.update),
    $nextTick: () => nextTick,
    $watch:  i => instanceWatch.bind(i) 
});
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
        // let @vue/reactivity know it should never observe Vue public instances.
        if (key === "__v_skip" /* SKIP */) {
            return true;
        }
        // data / props / ctx
        // This getter gets called for every property access on the render context
        // during render and is a major hotspot. The most expensive part of this
        // is the multiple hasOwn() calls. It's much faster to do a simple property
        // access on a plain object, so we use an accessCache object (with null
        // prototype) to memoize what access type a key corresponds to.
        let normalizedProps;
        if (key[0] !== '$') {
            const n = accessCache[key];
            if (n !== undefined) {
                switch (n) {
                    case 0 /* SETUP */:
                        return setupState[key];
                    case 1 /* DATA */:
                        return data[key];
                    case 3 /* CONTEXT */:
                        return ctx[key];
                    case 2 /* PROPS */:
                        return props[key];
                    // default: just fallthrough
                }
            }
            else if (setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(setupState, key)) {
                accessCache[key] = 0 /* SETUP */;
                return setupState[key];
            }
            else if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(data, key)) {
                accessCache[key] = 1 /* DATA */;
                return data[key];
            }
            else if (
            // only cache other properties when instance has declared (thus stable)
            // props
            (normalizedProps = normalizePropsOptions(type)[0]) &&
                Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(normalizedProps, key)) {
                accessCache[key] = 2 /* PROPS */;
                return props[key];
            }
            else if (ctx !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(ctx, key)) {
                accessCache[key] = 3 /* CONTEXT */;
                return ctx[key];
            }
            else {
                accessCache[key] = 4 /* OTHER */;
            }
        }
        const publicGetter = publicPropertiesMap[key];
        let cssModule, globalProperties;
        // public $xxx properties
        if (publicGetter) {
            if (key === '$attrs') {
                Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["track"])(instance, "get" /* GET */, key);
                ( true) && markAttrsAccessed();
            }
            return publicGetter(instance);
        }
        else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) &&
            (cssModule = cssModule[key])) {
            return cssModule;
        }
        else if (ctx !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(ctx, key)) {
            // user may set custom properties to `this` that start with `$`
            accessCache[key] = 3 /* CONTEXT */;
            return ctx[key];
        }
        else if (
        // global properties
        ((globalProperties = appContext.config.globalProperties),
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(globalProperties, key))) {
            return globalProperties[key];
        }
        else if (( true) &&
            currentRenderingInstance &&
            // #1091 avoid internal isRef/isVNode checks on component instance leading
            // to infinite warning loop
            key.indexOf('__v') !== 0) {
            if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"] && key[0] === '$' && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(data, key)) {
                warn(`Property ${JSON.stringify(key)} must be accessed via $data because it starts with a reserved ` +
                    `character and is not proxied on the render context.`);
            }
            else {
                warn(`Property ${JSON.stringify(key)} was accessed during render ` +
                    `but is not defined on instance.`);
            }
        }
    },
    set({ _: instance }, key, value) {
        const { data, setupState, ctx } = instance;
        if (setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(setupState, key)) {
            setupState[key] = value;
        }
        else if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(data, key)) {
            data[key] = value;
        }
        else if (key in instance.props) {
            ( true) &&
                warn(`Attempting to mutate prop "${key}". Props are readonly.`, instance);
            return false;
        }
        if (key[0] === '$' && key.slice(1) in instance) {
            ( true) &&
                warn(`Attempting to mutate public property "${key}". ` +
                    `Properties starting with $ are reserved and readonly.`, instance);
            return false;
        }
        else {
            if (( true) && key in instance.appContext.config.globalProperties) {
                Object.defineProperty(ctx, key, {
                    enumerable: true,
                    configurable: true,
                    value
                });
            }
            else {
                ctx[key] = value;
            }
        }
        return true;
    },
    has({ _: { data, setupState, accessCache, ctx, type, appContext } }, key) {
        let normalizedProps;
        return (accessCache[key] !== undefined ||
            (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(data, key)) ||
            (setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(setupState, key)) ||
            ((normalizedProps = normalizePropsOptions(type)[0]) &&
                Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(normalizedProps, key)) ||
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(ctx, key) ||
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(publicPropertiesMap, key) ||
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hasOwn"])(appContext.config.globalProperties, key));
    }
};
if (true) {
    PublicInstanceProxyHandlers.ownKeys = (target) => {
        warn(`Avoid app logic that relies on enumerating keys on a component instance. ` +
            `The keys will be empty in production mode to avoid performance overhead.`);
        return Reflect.ownKeys(target);
    };
}
const RuntimeCompiledPublicInstanceProxyHandlers = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, PublicInstanceProxyHandlers, {
    get(target, key) {
        // fast path for unscopables when using `with` block
        if (key === Symbol.unscopables) {
            return;
        }
        return PublicInstanceProxyHandlers.get(target, key, target);
    },
    has(_, key) {
        const has = key[0] !== '_' && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isGloballyWhitelisted"])(key);
        if (( true) && !has && PublicInstanceProxyHandlers.has(_, key)) {
            warn(`Property ${JSON.stringify(key)} should not start with _ which is a reserved prefix for Vue internals.`);
        }
        return has;
    }
});
// In dev mode, the proxy target exposes the same properties as seen on `this`
// for easier console inspection. In prod mode it will be an empty object so
// these properties definitions can be skipped.
function createRenderContext(instance) {
    const target = {};
    // expose internal instance for proxy handlers
    Object.defineProperty(target, `_`, {
        configurable: true,
        enumerable: false,
        get: () => instance
    });
    // expose public properties
    Object.keys(publicPropertiesMap).forEach(key => {
        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: false,
            get: () => publicPropertiesMap[key](instance),
            // intercepted by the proxy so no need for implementation,
            // but needed to prevent set errors
            set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NOOP"]
        });
    });
    // expose global properties
    const { globalProperties } = instance.appContext.config;
    Object.keys(globalProperties).forEach(key => {
        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: false,
            get: () => globalProperties[key],
            set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NOOP"]
        });
    });
    return target;
}
// dev only
function exposePropsOnRenderContext(instance) {
    const { ctx, type } = instance;
    const propsOptions = normalizePropsOptions(type)[0];
    if (propsOptions) {
        Object.keys(propsOptions).forEach(key => {
            Object.defineProperty(ctx, key, {
                enumerable: true,
                configurable: true,
                get: () => instance.props[key],
                set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NOOP"]
            });
        });
    }
}
// dev only
function exposeSetupStateOnRenderContext(instance) {
    const { ctx, setupState } = instance;
    Object.keys(Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["toRaw"])(setupState)).forEach(key => {
        Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            get: () => setupState[key],
            set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NOOP"]
        });
    });
}

const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
    // inherit parent app context - or - if root, adopt from root vnode
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
        uid: uid++,
        vnode,
        parent,
        appContext,
        type: vnode.type,
        root: null,
        next: null,
        subTree: null,
        update: null,
        render: null,
        proxy: null,
        withProxy: null,
        effects: null,
        provides: parent ? parent.provides : Object.create(appContext.provides),
        accessCache: null,
        renderCache: [],
        // state
        ctx: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"],
        data: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"],
        props: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"],
        attrs: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"],
        slots: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"],
        refs: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"],
        setupState: _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"],
        setupContext: null,
        // per-instance asset storage (mutable during options resolution)
        components: Object.create(appContext.components),
        directives: Object.create(appContext.directives),
        // suspense related
        suspense,
        asyncDep: null,
        asyncResolved: false,
        // lifecycle hooks
        // not using enums here because it results in computed properties
        isMounted: false,
        isUnmounted: false,
        isDeactivated: false,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        emit: null,
        emitted: null
    };
    if ((true)) {
        instance.ctx = createRenderContext(instance);
    }
    else {}
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    ( true) && componentAdded(instance);
    return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
    currentInstance = instance;
};
const isBuiltInTag = /*#__PURE__*/ Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["makeMap"])('slot,component');
function validateComponentName(name, config) {
    const appIsNativeTag = config.isNativeTag || _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NO"];
    if (isBuiltInTag(name) || appIsNativeTag(name)) {
        warn('Do not use built-in or reserved HTML elements as component id: ' + name);
    }
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
    isInSSRComponentSetup = isSSR;
    const { props, children, shapeFlag } = instance.vnode;
    const isStateful = shapeFlag & 4 /* STATEFUL_COMPONENT */;
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children);
    const setupResult = isStateful
        ? setupStatefulComponent(instance, isSSR)
        : undefined;
    isInSSRComponentSetup = false;
    return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    if ((true)) {
        if (Component.name) {
            validateComponentName(Component.name, instance.appContext.config);
        }
        if (Component.components) {
            const names = Object.keys(Component.components);
            for (let i = 0; i < names.length; i++) {
                validateComponentName(names[i], instance.appContext.config);
            }
        }
        if (Component.directives) {
            const names = Object.keys(Component.directives);
            for (let i = 0; i < names.length; i++) {
                validateDirectiveName(names[i]);
            }
        }
    }
    // 0. create render proxy property access cache
    instance.accessCache = {};
    // 1. create public instance / render proxy
    // also mark it raw so it's never observed
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    if ((true)) {
        exposePropsOnRenderContext(instance);
    }
    // 2. call setup()
    const { setup } = Component;
    if (setup) {
        const setupContext = (instance.setupContext =
            setup.length > 1 ? createSetupContext(instance) : null);
        currentInstance = instance;
        Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["pauseTracking"])();
        const setupResult = callWithErrorHandling(setup, instance, 0 /* SETUP_FUNCTION */, [( true) ? Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["shallowReadonly"])(instance.props) : undefined, setupContext]);
        Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["resetTracking"])();
        currentInstance = null;
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isPromise"])(setupResult)) {
            if (isSSR) {
                // return the promise so server-renderer can wait on it
                return setupResult.then((resolvedResult) => {
                    handleSetupResult(instance, resolvedResult);
                });
            }
            else {
                // async setup returned Promise.
                // bail here and wait for re-entry.
                instance.asyncDep = setupResult;
            }
        }
        else {
            handleSetupResult(instance, setupResult);
        }
    }
    else {
        finishComponentSetup(instance);
    }
}
function handleSetupResult(instance, setupResult, isSSR) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(setupResult)) {
        // setup returned an inline render function
        instance.render = setupResult;
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(setupResult)) {
        if (( true) && isVNode(setupResult)) {
            warn(`setup() should not return VNodes directly - ` +
                `return a render function instead.`);
        }
        // setup returned bindings.
        // assuming a render function compiled from template is present.
        instance.setupState = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["reactive"])(setupResult);
        if ((true)) {
            exposeSetupStateOnRenderContext(instance);
        }
    }
    else if (( true) && setupResult !== undefined) {
        warn(`setup() should return an object. Received: ${setupResult === null ? 'null' : typeof setupResult}`);
    }
    finishComponentSetup(instance);
}
let compile;
/**
 * For runtime-dom to register the compiler.
 * Note the exported method uses any to avoid d.ts relying on the compiler types.
 */
function registerRuntimeCompiler(_compile) {
    compile = _compile;
}
function finishComponentSetup(instance, isSSR) {
    const Component = instance.type;
    // template / render function normalization
    if (!instance.render) {
        if (compile && Component.template && !Component.render) {
            if ((true)) {
                startMeasure(instance, `compile`);
            }
            Component.render = compile(Component.template, {
                isCustomElement: instance.appContext.config.isCustomElement || _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NO"]
            });
            if ((true)) {
                endMeasure(instance, `compile`);
            }
            Component.render._rc = true;
        }
        if (( true) && !Component.render) {
            /* istanbul ignore if */
            if (!compile && Component.template) {
                warn(`Component provided template option but ` +
                    `runtime compilation is not supported in this build of Vue.` +
                    ( ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
                        ) /* should not happen */);
            }
            else {
                warn(`Component is missing template or render function.`);
            }
        }
        instance.render = (Component.render || _vue_shared__WEBPACK_IMPORTED_MODULE_1__["NOOP"]);
        // for runtime-compiled render functions using `with` blocks, the render
        // proxy used needs a different `has` handler which is more performant and
        // also only allows a whitelist of globals to fallthrough.
        if (instance.render._rc) {
            instance.withProxy = new Proxy(instance.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
        }
    }
    // support for 2.x options
    {
        currentInstance = instance;
        applyOptions(instance, Component);
        currentInstance = null;
    }
}
const attrHandlers = {
    get: (target, key) => {
        if ((true)) {
            markAttrsAccessed();
        }
        return target[key];
    },
    set: () => {
        warn(`setupContext.attrs is readonly.`);
        return false;
    },
    deleteProperty: () => {
        warn(`setupContext.attrs is readonly.`);
        return false;
    }
};
function createSetupContext(instance) {
    if ((true)) {
        // We use getters in dev in case libs like test-utils overwrite instance
        // properties (overwrites should not be done in prod)
        return Object.freeze({
            get attrs() {
                return new Proxy(instance.attrs, attrHandlers);
            },
            get slots() {
                return Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["shallowReadonly"])(instance.slots);
            },
            get emit() {
                return (event, ...args) => instance.emit(event, ...args);
            }
        });
    }
    else {}
}
// record effects created during a component's setup() so that they can be
// stopped when the component unmounts
function recordInstanceBoundEffect(effect) {
    if (currentInstance) {
        (currentInstance.effects || (currentInstance.effects = [])).push(effect);
    }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');
/* istanbul ignore next */
function formatComponentName(instance, Component, isRoot = false) {
    let name = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(Component)
        ? Component.displayName || Component.name
        : Component.name;
    if (!name && Component.__file) {
        const match = Component.__file.match(/([^/\\]+)\.vue$/);
        if (match) {
            name = match[1];
        }
    }
    if (!name && instance && instance.parent) {
        // try to infer the name based on local resolution
        const registry = instance.parent.components;
        for (const key in registry) {
            if (registry[key] === Component) {
                name = key;
                break;
            }
        }
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}

function computed(getterOrOptions) {
    const c = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["computed"])(getterOrOptions);
    recordInstanceBoundEffect(c.effect);
    return c;
}

// implementation, close to no-op
function defineComponent(options) {
    return Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(options) ? { setup: options } : options;
}

function defineAsyncComponent(source) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(source)) {
        source = { loader: source };
    }
    const { loader, loadingComponent: loadingComponent, errorComponent: errorComponent, delay = 200, timeout, // undefined = never times out
    suspensible = true, onError: userOnError } = source;
    let pendingRequest = null;
    let resolvedComp;
    let retries = 0;
    const retry = () => {
        retries++;
        pendingRequest = null;
        return load();
    };
    const load = () => {
        let thisRequest;
        return (pendingRequest ||
            (thisRequest = pendingRequest = loader()
                .catch(err => {
                err = err instanceof Error ? err : new Error(String(err));
                if (userOnError) {
                    return new Promise((resolve, reject) => {
                        const userRetry = () => resolve(retry());
                        const userFail = () => reject(err);
                        userOnError(err, userRetry, userFail, retries + 1);
                    });
                }
                else {
                    throw err;
                }
            })
                .then((comp) => {
                if (thisRequest !== pendingRequest && pendingRequest) {
                    return pendingRequest;
                }
                if (( true) && !comp) {
                    warn(`Async component loader resolved to undefined. ` +
                        `If you are using retry(), make sure to return its return value.`);
                }
                // interop module default
                if (comp &&
                    (comp.__esModule || comp[Symbol.toStringTag] === 'Module')) {
                    comp = comp.default;
                }
                if (( true) && comp && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(comp) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(comp)) {
                    throw new Error(`Invalid async component load result: ${comp}`);
                }
                resolvedComp = comp;
                return comp;
            })));
    };
    return defineComponent({
        __asyncLoader: load,
        name: 'AsyncComponentWrapper',
        setup() {
            const instance = currentInstance;
            // already resolved
            if (resolvedComp) {
                return () => createInnerComp(resolvedComp, instance);
            }
            const onError = (err) => {
                pendingRequest = null;
                handleError(err, instance, 13 /* ASYNC_COMPONENT_LOADER */);
            };
            // suspense-controlled or SSR.
            if (( suspensible && instance.suspense) ||
                (false )) {
                return load()
                    .then(comp => {
                    return () => createInnerComp(comp, instance);
                })
                    .catch(err => {
                    onError(err);
                    return () => errorComponent
                        ? createVNode(errorComponent, { error: err })
                        : null;
                });
            }
            const loaded = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["ref"])(false);
            const error = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["ref"])();
            const delayed = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["ref"])(!!delay);
            if (delay) {
                setTimeout(() => {
                    delayed.value = false;
                }, delay);
            }
            if (timeout != null) {
                setTimeout(() => {
                    if (!loaded.value) {
                        const err = new Error(`Async component timed out after ${timeout}ms.`);
                        onError(err);
                        error.value = err;
                    }
                }, timeout);
            }
            load()
                .then(() => {
                loaded.value = true;
            })
                .catch(err => {
                onError(err);
                error.value = err;
            });
            return () => {
                if (loaded.value && resolvedComp) {
                    return createInnerComp(resolvedComp, instance);
                }
                else if (error.value && errorComponent) {
                    return createVNode(errorComponent, {
                        error: error.value
                    });
                }
                else if (loadingComponent && !delayed.value) {
                    return createVNode(loadingComponent);
                }
            };
        }
    });
}
function createInnerComp(comp, { vnode: { props, children } }) {
    return createVNode(comp, props, children);
}

// Actual implementation
function h(type, propsOrChildren, children) {
    if (arguments.length === 2) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(propsOrChildren) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(propsOrChildren)) {
            // single vnode without props
            if (isVNode(propsOrChildren)) {
                return createVNode(type, null, [propsOrChildren]);
            }
            // props without children
            return createVNode(type, propsOrChildren);
        }
        else {
            // omit props
            return createVNode(type, null, propsOrChildren);
        }
    }
    else {
        if (isVNode(children)) {
            children = [children];
        }
        return createVNode(type, propsOrChildren, children);
    }
}

const ssrContextKey = Symbol(( true) ? `ssrContext` : undefined);
const useSSRContext = () => {
    {
        const ctx = inject(ssrContextKey);
        if (!ctx) {
            warn(`Server rendering context not provided. Make sure to only call ` +
                `useSsrContext() conditionally in the server build.`);
        }
        return ctx;
    }
};

/**
 * Actual implementation
 */
function renderList(source, renderItem) {
    let ret;
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(source) || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(source)) {
        ret = new Array(source.length);
        for (let i = 0, l = source.length; i < l; i++) {
            ret[i] = renderItem(source[i], i);
        }
    }
    else if (typeof source === 'number') {
        ret = new Array(source);
        for (let i = 0; i < source; i++) {
            ret[i] = renderItem(i + 1, i);
        }
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(source)) {
        if (source[Symbol.iterator]) {
            ret = Array.from(source, renderItem);
        }
        else {
            const keys = Object.keys(source);
            ret = new Array(keys.length);
            for (let i = 0, l = keys.length; i < l; i++) {
                const key = keys[i];
                ret[i] = renderItem(source[key], key, i);
            }
        }
    }
    else {
        ret = [];
    }
    return ret;
}

/**
 * For prefixing keys in v-on="obj" with "on"
 * @private
 */
function toHandlers(obj) {
    const ret = {};
    if (( true) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(obj)) {
        warn(`v-on with no argument expects an object value.`);
        return ret;
    }
    for (const key in obj) {
        ret[`on${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(key)}`] = obj[key];
    }
    return ret;
}

/**
 * Compiler runtime helper for rendering `<slot/>`
 * @private
 */
function renderSlot(slots, name, props = {}, 
// this is not a user-facing function, so the fallback is always generated by
// the compiler and guaranteed to be a function returning an array
fallback) {
    let slot = slots[name];
    if (( true) && slot && slot.length > 1) {
        warn(`SSR-optimized slot function detected in a non-SSR-optimized render ` +
            `function. You need to mark this component with $dynamic-slots in the ` +
            `parent template.`);
        slot = () => [];
    }
    return (openBlock(),
        createBlock(Fragment, { key: props.key }, slot ? slot(props) : fallback ? fallback() : [], slots._ === 1 /* STABLE */
            ? 64 /* STABLE_FRAGMENT */
            : -2 /* BAIL */));
}

/**
 * Compiler runtime helper for creating dynamic slots object
 * @private
 */
function createSlots(slots, dynamicSlots) {
    for (let i = 0; i < dynamicSlots.length; i++) {
        const slot = dynamicSlots[i];
        // array of dynamic slot generated by <template v-for="..." #[...]>
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(slot)) {
            for (let j = 0; j < slot.length; j++) {
                slots[slot[j].name] = slot[j].fn;
            }
        }
        else if (slot) {
            // conditional single slot generated by <template v-if="..." #foo>
            slots[slot.name] = slot.fn;
        }
    }
    return slots;
}

// Core API ------------------------------------------------------------------
const version = "3.0.0-rc.2";
/**
 * SSR utils for \@vue/server-renderer. Only exposed in cjs builds.
 * @internal
 */
const ssrUtils = ( null);



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js ***!
  \***********************************************************************/
/*! exports provided: customRef, isProxy, isReactive, isReadonly, isRef, markRaw, reactive, readonly, ref, shallowReactive, shallowReadonly, shallowRef, toRaw, toRef, toRefs, triggerRef, unref, camelize, capitalize, toDisplayString, BaseTransition, Comment, Fragment, KeepAlive, Static, Suspense, Teleport, Text, callWithAsyncErrorHandling, callWithErrorHandling, cloneVNode, computed, createBlock, createCommentVNode, createHydrationRenderer, createRenderer, createSlots, createStaticVNode, createTextVNode, createVNode, defineAsyncComponent, defineComponent, devtools, getCurrentInstance, getTransitionRawChildren, h, handleError, inject, isVNode, mergeProps, nextTick, onActivated, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onDeactivated, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onUnmounted, onUpdated, openBlock, popScopeId, provide, pushScopeId, queuePostFlushCb, registerRuntimeCompiler, renderList, renderSlot, resolveComponent, resolveDirective, resolveDynamicComponent, resolveTransitionHooks, setBlockTracking, setDevtoolsHook, setTransitionHooks, ssrContextKey, ssrUtils, toHandlers, transformVNodeArgs, useSSRContext, useTransitionState, version, warn, watch, watchEffect, withCtx, withDirectives, withScopeId, Transition, TransitionGroup, createApp, createSSRApp, hydrate, render, useCssModule, useCssVars, vModelCheckbox, vModelDynamic, vModelRadio, vModelSelect, vModelText, vShow, withKeys, withModifiers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transition", function() { return Transition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransitionGroup", function() { return TransitionGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createApp", function() { return createApp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSSRApp", function() { return createSSRApp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hydrate", function() { return hydrate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useCssModule", function() { return useCssModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useCssVars", function() { return useCssVars; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vModelCheckbox", function() { return vModelCheckbox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vModelDynamic", function() { return vModelDynamic; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vModelRadio", function() { return vModelRadio; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vModelSelect", function() { return vModelSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vModelText", function() { return vModelText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vShow", function() { return vShow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withKeys", function() { return withKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withModifiers", function() { return withModifiers; });
/* harmony import */ var _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/runtime-core */ "./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "customRef", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["customRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isProxy", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["isProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isReactive", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["isReactive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isReadonly", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["isReadonly"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isRef", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["isRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "markRaw", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["markRaw"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "reactive", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["reactive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "readonly", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["readonly"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ref", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["ref"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shallowReactive", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["shallowReactive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shallowReadonly", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["shallowReadonly"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shallowRef", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["shallowRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toRaw", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["toRaw"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toRef", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["toRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toRefs", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["toRefs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "triggerRef", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["triggerRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "unref", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["unref"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "camelize", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["camelize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["capitalize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toDisplayString", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseTransition", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["BaseTransition"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Comment", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["Comment"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Fragment", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["Fragment"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KeepAlive", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["KeepAlive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Static", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["Static"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Suspense", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["Suspense"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Teleport", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["Teleport"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["Text"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "callWithAsyncErrorHandling", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["callWithAsyncErrorHandling"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "callWithErrorHandling", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["callWithErrorHandling"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "cloneVNode", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["cloneVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "computed", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["computed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createBlock", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createBlock"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createCommentVNode", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createHydrationRenderer", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createHydrationRenderer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createRenderer", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createRenderer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createSlots", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createSlots"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createStaticVNode", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createStaticVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createTextVNode", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createTextVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createVNode", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defineAsyncComponent", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["defineAsyncComponent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defineComponent", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["defineComponent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "devtools", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["devtools"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentInstance", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["getCurrentInstance"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getTransitionRawChildren", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["getTransitionRawChildren"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "h", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["h"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "handleError", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["handleError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "inject", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["inject"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isVNode", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["isVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeProps", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["mergeProps"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "nextTick", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["nextTick"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onActivated", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onActivated"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onBeforeMount", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onBeforeMount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onBeforeUnmount", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onBeforeUnmount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onBeforeUpdate", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onBeforeUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onDeactivated", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onDeactivated"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onErrorCaptured", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onErrorCaptured"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onMounted", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onMounted"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onRenderTracked", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onRenderTracked"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onRenderTriggered", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onRenderTriggered"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onUnmounted", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onUnmounted"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onUpdated", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onUpdated"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "openBlock", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["openBlock"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "popScopeId", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["popScopeId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "provide", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["provide"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "pushScopeId", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["pushScopeId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "queuePostFlushCb", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["queuePostFlushCb"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerRuntimeCompiler", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["registerRuntimeCompiler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "renderList", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["renderList"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "renderSlot", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["renderSlot"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveComponent", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["resolveComponent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveDirective", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["resolveDirective"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveDynamicComponent", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["resolveDynamicComponent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveTransitionHooks", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["resolveTransitionHooks"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setBlockTracking", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["setBlockTracking"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setDevtoolsHook", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["setDevtoolsHook"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setTransitionHooks", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["setTransitionHooks"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ssrContextKey", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["ssrContextKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ssrUtils", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["ssrUtils"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toHandlers", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["toHandlers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "transformVNodeArgs", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["transformVNodeArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useSSRContext", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["useSSRContext"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useTransitionState", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["useTransitionState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "version", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["version"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "warn", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "watch", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["watch"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "watchEffect", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["watchEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withCtx", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["withCtx"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withDirectives", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["withDirectives"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withScopeId", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["withScopeId"]; });

/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");




const svgNS = 'http://www.w3.org/2000/svg';
const doc = (typeof document !== 'undefined' ? document : null);
let tempContainer;
let tempSVGContainer;
const nodeOps = {
    insert: (child, parent, anchor) => {
        parent.insertBefore(child, anchor || null);
    },
    remove: child => {
        const parent = child.parentNode;
        if (parent) {
            parent.removeChild(child);
        }
    },
    createElement: (tag, isSVG, is) => isSVG
        ? doc.createElementNS(svgNS, tag)
        : doc.createElement(tag, is ? { is } : undefined),
    createText: text => doc.createTextNode(text),
    createComment: text => doc.createComment(text),
    setText: (node, text) => {
        node.nodeValue = text;
    },
    setElementText: (el, text) => {
        el.textContent = text;
    },
    parentNode: node => node.parentNode,
    nextSibling: node => node.nextSibling,
    querySelector: selector => doc.querySelector(selector),
    setScopeId(el, id) {
        el.setAttribute(id, '');
    },
    cloneNode(el) {
        return el.cloneNode(true);
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, isSVG) {
        const temp = isSVG
            ? tempSVGContainer ||
                (tempSVGContainer = doc.createElementNS(svgNS, 'svg'))
            : tempContainer || (tempContainer = doc.createElement('div'));
        temp.innerHTML = content;
        const first = temp.firstChild;
        let node = first;
        let last = node;
        while (node) {
            last = node;
            nodeOps.insert(node, parent, anchor);
            node = temp.firstChild;
        }
        return [first, last];
    }
};

// compiler should normalize class + :class bindings on the same element
// into a single binding ['staticClass', dynamic]
function patchClass(el, value, isSVG) {
    if (value == null) {
        value = '';
    }
    if (isSVG) {
        el.setAttribute('class', value);
    }
    else {
        // directly setting className should be faster than setAttribute in theory
        // if this is an element during a transition, take the temporary transition
        // classes into account.
        const transitionClasses = el._vtc;
        if (transitionClasses) {
            value = (value
                ? [value, ...transitionClasses]
                : [...transitionClasses]).join(' ');
        }
        el.className = value;
    }
}

function patchStyle(el, prev, next) {
    const style = el.style;
    if (!next) {
        el.removeAttribute('style');
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(next)) {
        if (prev !== next) {
            style.cssText = next;
        }
    }
    else {
        for (const key in next) {
            setStyle(style, key, next[key]);
        }
        if (prev && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(prev)) {
            for (const key in prev) {
                if (next[key] == null) {
                    setStyle(style, key, '');
                }
            }
        }
    }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
    if (name.startsWith('--')) {
        // custom property definition
        style.setProperty(name, val);
    }
    else {
        const prefixed = autoPrefix(style, name);
        if (importantRE.test(val)) {
            // !important
            style.setProperty(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hyphenate"])(prefixed), val.replace(importantRE, ''), 'important');
        }
        else {
            style[prefixed] = val;
        }
    }
}
const prefixes = ['Webkit', 'Moz', 'ms'];
const prefixCache = {};
function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
        return cached;
    }
    let name = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["camelize"])(rawName);
    if (name !== 'filter' && name in style) {
        return (prefixCache[rawName] = name);
    }
    name = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(name);
    for (let i = 0; i < prefixes.length; i++) {
        const prefixed = prefixes[i] + name;
        if (prefixed in style) {
            return (prefixCache[rawName] = prefixed);
        }
    }
    return rawName;
}

const xlinkNS = 'http://www.w3.org/1999/xlink';
function patchAttr(el, key, value, isSVG) {
    if (isSVG && key.startsWith('xlink:')) {
        if (value == null) {
            el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
        }
        else {
            el.setAttributeNS(xlinkNS, key, value);
        }
    }
    else {
        // note we are only checking boolean attributes that don't have a
        // corresponding dom prop of the same name here.
        const isBoolean = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isSpecialBooleanAttr"])(key);
        if (value == null || (isBoolean && value === false)) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, isBoolean ? '' : value);
        }
    }
}

// __UNSAFE__
// functions. The user is responsible for using them with only trusted content.
function patchDOMProp(el, key, value, 
// the following args are passed only due to potential innerHTML/textContent
// overriding existing VNodes, in which case the old tree must be properly
// unmounted.
prevChildren, parentComponent, parentSuspense, unmountChildren) {
    if (key === 'innerHTML' || key === 'textContent') {
        if (prevChildren) {
            unmountChildren(prevChildren, parentComponent, parentSuspense);
        }
        el[key] = value == null ? '' : value;
        return;
    }
    if (key === 'value' && el.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified.
        el._value = value;
        el.value = value == null ? '' : value;
        return;
    }
    if (value === '' && typeof el[key] === 'boolean') {
        // e.g. <select multiple> compiles to { multiple: '' }
        el[key] = true;
    }
    else if (value == null && typeof el[key] === 'string') {
        // e.g. <div :id="null">
        el[key] = '';
        el.removeAttribute(key);
    }
    else {
        // some properties perform value validation and throw
        try {
            el[key] = value;
        }
        catch (e) {
            if ((true)) {
                Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"])(`Failed setting prop "${key}" on <${el.tagName.toLowerCase()}>: ` +
                    `value ${value} is invalid.`, e);
            }
        }
    }
}

// Async edge case fix requires storing an event listener's attach timestamp.
let _getNow = Date.now;
// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
if (typeof document !== 'undefined' &&
    _getNow() > document.createEvent('Event').timeStamp) {
    // if the low-res timestamp which is bigger than the event timestamp
    // (which is evaluated AFTER) it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listeners as well.
    _getNow = () => performance.now();
}
// To avoid the overhead of repeatedly calling performance.now(), we cache
// and use the same timestamp for all event listeners attached in the same tick.
let cachedNow = 0;
const p = Promise.resolve();
const reset = () => {
    cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), (cachedNow = _getNow()));
function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invoker = prevValue && prevValue.invoker;
    if (nextValue && invoker) {
        prevValue.invoker = null;
        invoker.value = nextValue;
        nextValue.invoker = invoker;
    }
    else {
        const [name, options] = parseName(rawName);
        if (nextValue) {
            addEventListener(el, name, createInvoker(nextValue, instance), options);
        }
        else if (invoker) {
            // remove
            removeEventListener(el, name, invoker, options);
        }
    }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
        options = {};
        let m;
        while ((m = name.match(optionsModifierRE))) {
            name = name.slice(0, name.length - m[0].length);
            options[m[0].toLowerCase()] = true;
        }
    }
    return [name.slice(2).toLowerCase(), options];
}
function createInvoker(initialValue, instance) {
    const invoker = (e) => {
        // async edge case #6566: inner click event triggers patch, event handler
        // attached to outer element during patch, and triggered again. This
        // happens because browsers fire microtask ticks between event propagation.
        // the solution is simple: we save the timestamp when a handler is attached,
        // and the handler would only fire if the event passed to it was fired
        // AFTER it was attached.
        const timeStamp = e.timeStamp || _getNow();
        if (timeStamp >= invoker.attached - 1) {
            Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["callWithAsyncErrorHandling"])(patchStopImmediatePropagation(e, invoker.value), instance, 5 /* NATIVE_EVENT_HANDLER */, [e]);
        }
    };
    invoker.value = initialValue;
    initialValue.invoker = invoker;
    invoker.attached = getNow();
    return invoker;
}
function patchStopImmediatePropagation(e, value) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(value)) {
        const originalStop = e.stopImmediatePropagation;
        e.stopImmediatePropagation = () => {
            originalStop.call(e);
            e._stopped = true;
        };
        return value.map(fn => (e) => !e._stopped && fn(e));
    }
    else {
        return value;
    }
}

const nativeOnRE = /^on[a-z]/;
const forcePatchProp = (_, key) => key === 'value';
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
    switch (key) {
        // special
        case 'class':
            patchClass(el, nextValue, isSVG);
            break;
        case 'style':
            patchStyle(el, prevValue, nextValue);
            break;
        default:
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isOn"])(key)) {
                // ignore v-model listeners
                if (!key.startsWith('onUpdate:')) {
                    patchEvent(el, key, prevValue, nextValue, parentComponent);
                }
            }
            else if (shouldSetAsProp(el, key, nextValue, isSVG)) {
                patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
            }
            else {
                // special case for <input v-model type="checkbox"> with
                // :true-value & :false-value
                // store value as dom properties since non-string values will be
                // stringified.
                if (key === 'true-value') {
                    el._trueValue = nextValue;
                }
                else if (key === 'false-value') {
                    el._falseValue = nextValue;
                }
                patchAttr(el, key, nextValue, isSVG);
            }
            break;
    }
};
function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
        // most keys must be set as attribute on svg elements to work
        // ...except innerHTML
        if (key === 'innerHTML') {
            return true;
        }
        // or native onclick with function values
        if (key in el && nativeOnRE.test(key) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(value)) {
            return true;
        }
        return false;
    }
    // spellcheck and draggable are numerated attrs, however their
    // corresponding DOM properties are actually booleans - this leads to
    // setting it with a string "false" value leading it to be coerced to
    // `true`, so we need to always treat them as attributes.
    // Note that `contentEditable` doesn't have this problem: its DOM
    // property is also enumerated string values.
    if (key === 'spellcheck' || key === 'draggable') {
        return false;
    }
    // #1526 <input list> must be set as attribute
    if (key === 'list' && el.tagName === 'INPUT') {
        return false;
    }
    // native onclick with string value, must be set as attribute
    if (nativeOnRE.test(key) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(value)) {
        return false;
    }
    return key in el;
}

function useCssModule(name = '$style') {
    /* istanbul ignore else */
    {
        const instance = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["getCurrentInstance"])();
        if (!instance) {
            ( true) && Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"])(`useCssModule must be called inside setup()`);
            return _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"];
        }
        const modules = instance.type.__cssModules;
        if (!modules) {
            ( true) && Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"])(`Current instance does not have CSS modules injected.`);
            return _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"];
        }
        const mod = modules[name];
        if (!mod) {
            ( true) &&
                Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"])(`Current instance does not have CSS module named "${name}".`);
            return _vue_shared__WEBPACK_IMPORTED_MODULE_1__["EMPTY_OBJ"];
        }
        return mod;
    }
}

function useCssVars(getter, scoped = false) {
    const instance = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["getCurrentInstance"])();
    /* istanbul ignore next */
    if (!instance) {
        ( true) &&
            Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"])(`useCssVars is called without current active component instance.`);
        return;
    }
    const prefix = scoped && instance.type.__scopeId
        ? `${instance.type.__scopeId.replace(/^data-v-/, '')}-`
        : ``;
    Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onMounted"])(() => {
        Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["watchEffect"])(() => {
            setVarsOnVNode(instance.subTree, getter(instance.proxy), prefix);
        });
    });
}
function setVarsOnVNode(vnode, vars, prefix) {
    // drill down HOCs until it's a non-component vnode
    while (vnode.component) {
        vnode = vnode.component.subTree;
    }
    if (vnode.shapeFlag & 1 /* ELEMENT */ && vnode.el) {
        const style = vnode.el.style;
        for (const key in vars) {
            style.setProperty(`--${prefix}${key}`, Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["unref"])(vars[key]));
        }
    }
    else if (vnode.type === _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["Fragment"]) {
        vnode.children.forEach(c => setVarsOnVNode(c, vars, prefix));
    }
}

const TRANSITION = 'transition';
const ANIMATION = 'animation';
// DOM Transition is a higher-order-component based on the platform-agnostic
// base Transition component, with DOM-specific logic.
const Transition = (props, { slots }) => Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["h"])(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["BaseTransition"], resolveTransitionProps(props), slots);
Transition.displayName = 'Transition';
const DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
        type: Boolean,
        default: true
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
};
const TransitionPropsValidators = (Transition.props = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["BaseTransition"].props, DOMTransitionPropsValidators));
function resolveTransitionProps(rawProps) {
    let { name = 'v', type, css = true, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
    const baseProps = {};
    for (const key in rawProps) {
        if (!(key in DOMTransitionPropsValidators)) {
            baseProps[key] = rawProps[key];
        }
    }
    if (!css) {
        return baseProps;
    }
    const durations = normalizeDuration(duration);
    const enterDuration = durations && durations[0];
    const leaveDuration = durations && durations[1];
    const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
    const finishEnter = (el, isAppear, done) => {
        removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
        removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
        done && done();
    };
    const finishLeave = (el, done) => {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
        done && done();
    };
    const makeEnterHook = (isAppear) => {
        return (el, done) => {
            const hook = isAppear ? onAppear : onEnter;
            const resolve = () => finishEnter(el, isAppear, done);
            hook && hook(el, resolve);
            nextFrame(() => {
                removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
                addTransitionClass(el, isAppear ? appearToClass : enterToClass);
                if (!(hook && hook.length > 1)) {
                    if (enterDuration) {
                        setTimeout(resolve, enterDuration);
                    }
                    else {
                        whenTransitionEnds(el, type, resolve);
                    }
                }
            });
        };
    };
    return Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])(baseProps, {
        onBeforeEnter(el) {
            onBeforeEnter && onBeforeEnter(el);
            addTransitionClass(el, enterActiveClass);
            addTransitionClass(el, enterFromClass);
        },
        onBeforeAppear(el) {
            onBeforeAppear && onBeforeAppear(el);
            addTransitionClass(el, appearActiveClass);
            addTransitionClass(el, appearFromClass);
        },
        onEnter: makeEnterHook(false),
        onAppear: makeEnterHook(true),
        onLeave(el, done) {
            const resolve = () => finishLeave(el, done);
            addTransitionClass(el, leaveActiveClass);
            addTransitionClass(el, leaveFromClass);
            nextFrame(() => {
                removeTransitionClass(el, leaveFromClass);
                addTransitionClass(el, leaveToClass);
                if (!(onLeave && onLeave.length > 1)) {
                    if (leaveDuration) {
                        setTimeout(resolve, leaveDuration);
                    }
                    else {
                        whenTransitionEnds(el, type, resolve);
                    }
                }
            });
            onLeave && onLeave(el, resolve);
        },
        onEnterCancelled(el) {
            finishEnter(el, false);
            onEnterCancelled && onEnterCancelled(el);
        },
        onAppearCancelled(el) {
            finishEnter(el, true);
            onAppearCancelled && onAppearCancelled(el);
        },
        onLeaveCancelled(el) {
            finishLeave(el);
            onLeaveCancelled && onLeaveCancelled(el);
        }
    });
}
function normalizeDuration(duration) {
    if (duration == null) {
        return null;
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isObject"])(duration)) {
        return [NumberOf(duration.enter), NumberOf(duration.leave)];
    }
    else {
        const n = NumberOf(duration);
        return [n, n];
    }
}
function NumberOf(val) {
    const res = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["toNumber"])(val);
    if ((true))
        validateDuration(res);
    return res;
}
function validateDuration(val) {
    if (typeof val !== 'number') {
        Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"])(`<transition> explicit duration is not a valid number - ` +
            `got ${JSON.stringify(val)}.`);
    }
    else if (isNaN(val)) {
        Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"])(`<transition> explicit duration is NaN - ` +
            'the duration expression might be incorrect.');
    }
}
function addTransitionClass(el, cls) {
    cls.split(/\s+/).forEach(c => c && el.classList.add(c));
    (el._vtc ||
        (el._vtc = new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
    cls.split(/\s+/).forEach(c => c && el.classList.remove(c));
    const { _vtc } = el;
    if (_vtc) {
        _vtc.delete(cls);
        if (!_vtc.size) {
            el._vtc = undefined;
        }
    }
}
function nextFrame(cb) {
    requestAnimationFrame(() => {
        requestAnimationFrame(cb);
    });
}
function whenTransitionEnds(el, expectedType, cb) {
    const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
    if (!type) {
        return cb();
    }
    const endEvent = type + 'end';
    let ended = 0;
    const end = () => {
        el.removeEventListener(endEvent, onEnd);
        cb();
    };
    const onEnd = (e) => {
        if (e.target === el) {
            if (++ended >= propCount) {
                end();
            }
        }
    };
    setTimeout(() => {
        if (ended < propCount) {
            end();
        }
    }, timeout + 1);
    el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    const getStyleProperties = (key) => (styles[key] || '').split(', ');
    const transitionDelays = getStyleProperties(TRANSITION + 'Delay');
    const transitionDurations = getStyleProperties(TRANSITION + 'Duration');
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(ANIMATION + 'Delay');
    const animationDurations = getStyleProperties(ANIMATION + 'Duration');
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout = 0;
    let propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
            type = TRANSITION;
            timeout = transitionTimeout;
            propCount = transitionDurations.length;
        }
    }
    else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
            type = ANIMATION;
            timeout = animationTimeout;
            propCount = animationDurations.length;
        }
    }
    else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type =
            timeout > 0
                ? transitionTimeout > animationTimeout
                    ? TRANSITION
                    : ANIMATION
                : null;
        propCount = type
            ? type === TRANSITION
                ? transitionDurations.length
                : animationDurations.length
            : 0;
    }
    const hasTransform = type === TRANSITION &&
        /\b(transform|all)(,|$)/.test(styles[TRANSITION + 'Property']);
    return {
        type,
        timeout,
        propCount,
        hasTransform
    };
}
function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
        delays = delays.concat(delays);
    }
    return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
// Old versions of Chromium (below 61.0.3163.100) formats floating pointer
// numbers in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down
// (i.e. acting as a floor function) causing unexpected behaviors
function toMs(s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}

function toRaw(observed) {
    return ((observed && toRaw(observed["__v_raw" /* RAW */])) || observed);
}

const positionMap = new WeakMap();
const newPositionMap = new WeakMap();
const TransitionGroupImpl = {
    name: 'TransitionGroup',
    props: Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, TransitionPropsValidators, {
        tag: String,
        moveClass: String
    }),
    setup(props, { slots }) {
        const instance = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["getCurrentInstance"])();
        const state = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["useTransitionState"])();
        let prevChildren;
        let children;
        Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["onUpdated"])(() => {
            // children is guaranteed to exist after initial render
            if (!prevChildren.length) {
                return;
            }
            const moveClass = props.moveClass || `${props.name || 'v'}-move`;
            if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
                return;
            }
            // we divide the work into three loops to avoid mixing DOM reads and writes
            // in each iteration - which helps prevent layout thrashing.
            prevChildren.forEach(callPendingCbs);
            prevChildren.forEach(recordPosition);
            const movedChildren = prevChildren.filter(applyTranslation);
            // force reflow to put everything in position
            forceReflow();
            movedChildren.forEach(c => {
                const el = c.el;
                const style = el.style;
                addTransitionClass(el, moveClass);
                style.transform = style.webkitTransform = style.transitionDuration = '';
                const cb = (el._moveCb = (e) => {
                    if (e && e.target !== el) {
                        return;
                    }
                    if (!e || /transform$/.test(e.propertyName)) {
                        el.removeEventListener('transitionend', cb);
                        el._moveCb = null;
                        removeTransitionClass(el, moveClass);
                    }
                });
                el.addEventListener('transitionend', cb);
            });
        });
        return () => {
            const rawProps = toRaw(props);
            const cssTransitionProps = resolveTransitionProps(rawProps);
            const tag = rawProps.tag || _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["Fragment"];
            prevChildren = children;
            children = slots.default ? Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["getTransitionRawChildren"])(slots.default()) : [];
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child.key != null) {
                    Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["setTransitionHooks"])(child, Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["resolveTransitionHooks"])(child, cssTransitionProps, state, instance));
                }
                else if ((true)) {
                    Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"])(`<TransitionGroup> children must be keyed.`);
                }
            }
            if (prevChildren) {
                for (let i = 0; i < prevChildren.length; i++) {
                    const child = prevChildren[i];
                    Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["setTransitionHooks"])(child, Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["resolveTransitionHooks"])(child, cssTransitionProps, state, instance));
                    positionMap.set(child, child.el.getBoundingClientRect());
                }
            }
            return Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createVNode"])(tag, null, children);
        };
    }
};
// remove mode props as TransitionGroup doesn't support it
delete TransitionGroupImpl.props.mode;
const TransitionGroup = TransitionGroupImpl;
function callPendingCbs(c) {
    const el = c.el;
    if (el._moveCb) {
        el._moveCb();
    }
    if (el._enterCb) {
        el._enterCb();
    }
}
function recordPosition(c) {
    newPositionMap.set(c, c.el.getBoundingClientRect());
}
function applyTranslation(c) {
    const oldPos = positionMap.get(c);
    const newPos = newPositionMap.get(c);
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
        const s = c.el.style;
        s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
        s.transitionDuration = '0s';
        return c;
    }
}
// this is put in a dedicated function to avoid the line from being treeshaken
function forceReflow() {
    return document.body.offsetHeight;
}
function hasCSSTransform(el, root, moveClass) {
    // Detect whether an element with the move class applied has
    // CSS transitions. Since the element may be inside an entering
    // transition at this very moment, we make a clone of it and remove
    // all other transition classes applied to ensure only the move class
    // is applied.
    const clone = el.cloneNode();
    if (el._vtc) {
        el._vtc.forEach(cls => {
            cls.split(/\s+/).forEach(c => c && clone.classList.remove(c));
        });
    }
    moveClass.split(/\s+/).forEach(c => c && clone.classList.add(c));
    clone.style.display = 'none';
    const container = (root.nodeType === 1
        ? root
        : root.parentNode);
    container.appendChild(clone);
    const { hasTransform } = getTransitionInfo(clone);
    container.removeChild(clone);
    return hasTransform;
}

const getModelAssigner = (vnode) => {
    const fn = vnode.props['onUpdate:modelValue'];
    return Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(fn) ? value => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["invokeArrayFns"])(fn, value) : fn;
};
function onCompositionStart(e) {
    e.target.composing = true;
}
function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
        target.composing = false;
        trigger(target, 'input');
    }
}
function trigger(el, type) {
    const e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
}
// We are exporting the v-model runtime directly as vnode hooks so that it can
// be tree-shaken in case v-model is never used.
const vModelText = {
    beforeMount(el, { value, modifiers: { lazy, trim, number } }, vnode) {
        el.value = value == null ? '' : value;
        el._assign = getModelAssigner(vnode);
        const castToNumber = number || el.type === 'number';
        addEventListener(el, lazy ? 'change' : 'input', e => {
            if (e.target.composing)
                return;
            let domValue = el.value;
            if (trim) {
                domValue = domValue.trim();
            }
            else if (castToNumber) {
                domValue = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["toNumber"])(domValue);
            }
            el._assign(domValue);
        });
        if (trim) {
            addEventListener(el, 'change', () => {
                el.value = el.value.trim();
            });
        }
        if (!lazy) {
            addEventListener(el, 'compositionstart', onCompositionStart);
            addEventListener(el, 'compositionend', onCompositionEnd);
            // Safari < 10.2 & UIWebView doesn't fire compositionend when
            // switching focus before confirming composition choice
            // this also fixes the issue where some browsers e.g. iOS Chrome
            // fires "change" instead of "input" on autocomplete.
            addEventListener(el, 'change', onCompositionEnd);
        }
    },
    beforeUpdate(el, { value, modifiers: { trim, number } }, vnode) {
        el._assign = getModelAssigner(vnode);
        if (document.activeElement === el) {
            if (trim && el.value.trim() === value) {
                return;
            }
            if ((number || el.type === 'number') && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["toNumber"])(el.value) === value) {
                return;
            }
        }
        el.value = value == null ? '' : value;
    }
};
const vModelCheckbox = {
    beforeMount(el, binding, vnode) {
        setChecked(el, binding, vnode);
        el._assign = getModelAssigner(vnode);
        addEventListener(el, 'change', () => {
            const modelValue = el._modelValue;
            const elementValue = getValue(el);
            const checked = el.checked;
            const assign = el._assign;
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(modelValue)) {
                const index = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["looseIndexOf"])(modelValue, elementValue);
                const found = index !== -1;
                if (checked && !found) {
                    assign(modelValue.concat(elementValue));
                }
                else if (!checked && found) {
                    const filtered = [...modelValue];
                    filtered.splice(index, 1);
                    assign(filtered);
                }
            }
            else {
                assign(getCheckboxValue(el, checked));
            }
        });
    },
    beforeUpdate(el, binding, vnode) {
        el._assign = getModelAssigner(vnode);
        setChecked(el, binding, vnode);
    }
};
function setChecked(el, { value, oldValue }, vnode) {
    el._modelValue = value;
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(value)) {
        el.checked = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["looseIndexOf"])(value, vnode.props.value) > -1;
    }
    else if (value !== oldValue) {
        el.checked = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["looseEqual"])(value, getCheckboxValue(el, true));
    }
}
const vModelRadio = {
    beforeMount(el, { value }, vnode) {
        el.checked = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["looseEqual"])(value, vnode.props.value);
        el._assign = getModelAssigner(vnode);
        addEventListener(el, 'change', () => {
            el._assign(getValue(el));
        });
    },
    beforeUpdate(el, { value, oldValue }, vnode) {
        el._assign = getModelAssigner(vnode);
        if (value !== oldValue) {
            el.checked = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["looseEqual"])(value, vnode.props.value);
        }
    }
};
const vModelSelect = {
    // use mounted & updated because <select> relies on its children <option>s.
    mounted(el, { value }, vnode) {
        setSelected(el, value);
        el._assign = getModelAssigner(vnode);
        addEventListener(el, 'change', () => {
            const selectedVal = Array.prototype.filter
                .call(el.options, (o) => o.selected)
                .map(getValue);
            el._assign(el.multiple ? selectedVal : selectedVal[0]);
        });
    },
    beforeUpdate(el, _binding, vnode) {
        el._assign = getModelAssigner(vnode);
    },
    updated(el, { value }) {
        setSelected(el, value);
    }
};
function setSelected(el, value) {
    const isMultiple = el.multiple;
    if (isMultiple && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isArray"])(value)) {
        ( true) &&
            Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"])(`<select multiple v-model> expects an Array value for its binding, ` +
                `but got ${Object.prototype.toString.call(value).slice(8, -1)}.`);
        return;
    }
    for (let i = 0, l = el.options.length; i < l; i++) {
        const option = el.options[i];
        const optionValue = getValue(option);
        if (isMultiple) {
            option.selected = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["looseIndexOf"])(value, optionValue) > -1;
        }
        else {
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["looseEqual"])(getValue(option), value)) {
                el.selectedIndex = i;
                return;
            }
        }
    }
    if (!isMultiple) {
        el.selectedIndex = -1;
    }
}
// retrieve raw value set via :value bindings
function getValue(el) {
    return '_value' in el ? el._value : el.value;
}
// retrieve raw value for true-value and false-value set via :true-value or :false-value bindings
function getCheckboxValue(el, checked) {
    const key = checked ? '_trueValue' : '_falseValue';
    return key in el ? el[key] : checked;
}
const vModelDynamic = {
    beforeMount(el, binding, vnode) {
        callModelHook(el, binding, vnode, null, 'beforeMount');
    },
    mounted(el, binding, vnode) {
        callModelHook(el, binding, vnode, null, 'mounted');
    },
    beforeUpdate(el, binding, vnode, prevVNode) {
        callModelHook(el, binding, vnode, prevVNode, 'beforeUpdate');
    },
    updated(el, binding, vnode, prevVNode) {
        callModelHook(el, binding, vnode, prevVNode, 'updated');
    }
};
function callModelHook(el, binding, vnode, prevVNode, hook) {
    let modelToUse;
    switch (el.tagName) {
        case 'SELECT':
            modelToUse = vModelSelect;
            break;
        case 'TEXTAREA':
            modelToUse = vModelText;
            break;
        default:
            switch (el.type) {
                case 'checkbox':
                    modelToUse = vModelCheckbox;
                    break;
                case 'radio':
                    modelToUse = vModelRadio;
                    break;
                default:
                    modelToUse = vModelText;
            }
    }
    const fn = modelToUse[hook];
    fn && fn(el, binding, vnode, prevVNode);
}

const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'];
const modifierGuards = {
    stop: e => e.stopPropagation(),
    prevent: e => e.preventDefault(),
    self: e => e.target !== e.currentTarget,
    ctrl: e => !e.ctrlKey,
    shift: e => !e.shiftKey,
    alt: e => !e.altKey,
    meta: e => !e.metaKey,
    left: e => 'button' in e && e.button !== 0,
    middle: e => 'button' in e && e.button !== 1,
    right: e => 'button' in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some(m => e[`${m}Key`] && !modifiers.includes(m))
};
/**
 * @private
 */
const withModifiers = (fn, modifiers) => {
    return (event, ...args) => {
        for (let i = 0; i < modifiers.length; i++) {
            const guard = modifierGuards[modifiers[i]];
            if (guard && guard(event, modifiers))
                return;
        }
        return fn(event, ...args);
    };
};
// Kept for 2.x compat.
// Note: IE11 compat for `spacebar` and `del` is removed for now.
const keyNames = {
    esc: 'escape',
    space: ' ',
    up: 'arrow-up',
    left: 'arrow-left',
    right: 'arrow-right',
    down: 'arrow-down',
    delete: 'backspace'
};
/**
 * @private
 */
const withKeys = (fn, modifiers) => {
    return (event) => {
        if (!('key' in event))
            return;
        const eventKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["hyphenate"])(event.key);
        if (
        // None of the provided key modifiers match the current event key
        !modifiers.some(k => k === eventKey || keyNames[k] === eventKey)) {
            return;
        }
        return fn(event);
    };
};

const vShow = {
    beforeMount(el, { value }, { transition }) {
        el._vod = el.style.display === 'none' ? '' : el.style.display;
        if (transition && value) {
            transition.beforeEnter(el);
        }
        else {
            setDisplay(el, value);
        }
    },
    mounted(el, { value }, { transition }) {
        if (transition && value) {
            transition.enter(el);
        }
    },
    updated(el, { value, oldValue }, { transition }) {
        if (!value === !oldValue)
            return;
        if (transition) {
            if (value) {
                transition.beforeEnter(el);
                setDisplay(el, true);
                transition.enter(el);
            }
            else {
                transition.leave(el, () => {
                    setDisplay(el, false);
                });
            }
        }
        else {
            setDisplay(el, value);
        }
    },
    beforeUnmount(el, { value }) {
        setDisplay(el, value);
    }
};
function setDisplay(el, value) {
    el.style.display = value ? el._vod : 'none';
}

const rendererOptions = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["extend"])({ patchProp, forcePatchProp }, nodeOps);
// lazy create the renderer - this makes core renderer logic tree-shakable
// in case the user only imports reactivity utilities from Vue.
let renderer;
let enabledHydration = false;
function ensureRenderer() {
    return renderer || (renderer = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createRenderer"])(rendererOptions));
}
function ensureHydrationRenderer() {
    renderer = enabledHydration
        ? renderer
        : Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["createHydrationRenderer"])(rendererOptions);
    enabledHydration = true;
    return renderer;
}
// use explicit type casts here to avoid import() calls in rolled-up d.ts
const render = ((...args) => {
    ensureRenderer().render(...args);
});
const hydrate = ((...args) => {
    ensureHydrationRenderer().hydrate(...args);
});
const createApp = ((...args) => {
    const app = ensureRenderer().createApp(...args);
    if ((true)) {
        injectNativeTagCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
        const container = normalizeContainer(containerOrSelector);
        if (!container)
            return;
        const component = app._component;
        if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(component) && !component.render && !component.template) {
            component.template = container.innerHTML;
        }
        // clear content before mounting
        container.innerHTML = '';
        const proxy = mount(container);
        container.removeAttribute('v-cloak');
        return proxy;
    };
    return app;
});
const createSSRApp = ((...args) => {
    const app = ensureHydrationRenderer().createApp(...args);
    if ((true)) {
        injectNativeTagCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
        const container = normalizeContainer(containerOrSelector);
        if (container) {
            return mount(container, true);
        }
    };
    return app;
});
function injectNativeTagCheck(app) {
    // Inject `isNativeTag`
    // this is used for component name validation (dev only)
    Object.defineProperty(app.config, 'isNativeTag', {
        value: (tag) => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isHTMLTag"])(tag) || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isSVGTag"])(tag),
        writable: false
    });
}
function normalizeContainer(container) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__["isString"])(container)) {
        const res = document.querySelector(container);
        if (( true) && !res) {
            Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["warn"])(`Failed to mount app: mount target selector returned null.`);
        }
        return res;
    }
    return container;
}




/***/ }),

/***/ "./node_modules/@vue/shared/dist/shared.esm-bundler.js":
/*!*************************************************************!*\
  !*** ./node_modules/@vue/shared/dist/shared.esm-bundler.js ***!
  \*************************************************************/
/*! exports provided: EMPTY_ARR, EMPTY_OBJ, NO, NOOP, PatchFlagNames, babelParserDefautPlugins, camelize, capitalize, def, escapeHtml, escapeHtmlComment, extend, generateCodeFrame, hasChanged, hasOwn, hyphenate, invokeArrayFns, isArray, isBooleanAttr, isDate, isFunction, isGloballyWhitelisted, isHTMLTag, isKnownAttr, isNoUnitNumericStyleProp, isObject, isOn, isPlainObject, isPromise, isReservedProp, isSSRSafeAttrName, isSVGTag, isSpecialBooleanAttr, isString, isSymbol, isVoidTag, looseEqual, looseIndexOf, makeMap, mockError, mockWarn, normalizeClass, normalizeStyle, objectToString, parseStringStyle, propsToAttrMap, remove, stringifyStyle, toDisplayString, toNumber, toRawType, toTypeString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EMPTY_ARR", function() { return EMPTY_ARR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EMPTY_OBJ", function() { return EMPTY_OBJ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NO", function() { return NO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOOP", function() { return NOOP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatchFlagNames", function() { return PatchFlagNames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "babelParserDefautPlugins", function() { return babelParserDefautPlugins; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "camelize", function() { return camelize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "def", function() { return def; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escapeHtml", function() { return escapeHtml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escapeHtmlComment", function() { return escapeHtmlComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extend", function() { return extend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateCodeFrame", function() { return generateCodeFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasChanged", function() { return hasChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasOwn", function() { return hasOwn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hyphenate", function() { return hyphenate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "invokeArrayFns", function() { return invokeArrayFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBooleanAttr", function() { return isBooleanAttr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDate", function() { return isDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFunction", function() { return isFunction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isGloballyWhitelisted", function() { return isGloballyWhitelisted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isHTMLTag", function() { return isHTMLTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isKnownAttr", function() { return isKnownAttr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNoUnitNumericStyleProp", function() { return isNoUnitNumericStyleProp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return isObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isOn", function() { return isOn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPlainObject", function() { return isPlainObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPromise", function() { return isPromise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isReservedProp", function() { return isReservedProp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSSRSafeAttrName", function() { return isSSRSafeAttrName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSVGTag", function() { return isSVGTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSpecialBooleanAttr", function() { return isSpecialBooleanAttr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSymbol", function() { return isSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isVoidTag", function() { return isVoidTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "looseEqual", function() { return looseEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "looseIndexOf", function() { return looseIndexOf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeMap", function() { return makeMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mockError", function() { return mockError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mockWarn", function() { return mockWarn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeClass", function() { return normalizeClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeStyle", function() { return normalizeStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "objectToString", function() { return objectToString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseStringStyle", function() { return parseStringStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "propsToAttrMap", function() { return propsToAttrMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringifyStyle", function() { return stringifyStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toDisplayString", function() { return toDisplayString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toNumber", function() { return toNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRawType", function() { return toRawType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toTypeString", function() { return toTypeString; });
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 */
function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}

// Patch flags are optimization hints generated by the compiler.
// when a block with dynamicChildren is encountered during diff, the algorithm
// enters "optimized mode". In this mode, we know that the vdom is produced by
// a render function generated by the compiler, so the algorithm only needs to
// handle updates explicitly marked by these patch flags.
// dev only flag -> name mapping
const PatchFlagNames = {
    [1 /* TEXT */]: `TEXT`,
    [2 /* CLASS */]: `CLASS`,
    [4 /* STYLE */]: `STYLE`,
    [8 /* PROPS */]: `PROPS`,
    [16 /* FULL_PROPS */]: `FULL_PROPS`,
    [32 /* HYDRATE_EVENTS */]: `HYDRATE_EVENTS`,
    [64 /* STABLE_FRAGMENT */]: `STABLE_FRAGMENT`,
    [128 /* KEYED_FRAGMENT */]: `KEYED_FRAGMENT`,
    [256 /* UNKEYED_FRAGMENT */]: `UNKEYED_FRAGMENT`,
    [1024 /* DYNAMIC_SLOTS */]: `DYNAMIC_SLOTS`,
    [512 /* NEED_PATCH */]: `NEED_PATCH`,
    [-1 /* HOISTED */]: `HOISTED`,
    [-2 /* BAIL */]: `BAIL`
};

const GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
    'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
    'Object,Boolean,String,RegExp,Map,Set,JSON,Intl';
const isGloballyWhitelisted = /*#__PURE__*/ makeMap(GLOBALS_WHITE_LISTED);

const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
    const lines = source.split(/\r?\n/);
    let count = 0;
    const res = [];
    for (let i = 0; i < lines.length; i++) {
        count += lines[i].length + 1;
        if (count >= start) {
            for (let j = i - range; j <= i + range || end > count; j++) {
                if (j < 0 || j >= lines.length)
                    continue;
                const line = j + 1;
                res.push(`${line}${' '.repeat(3 - String(line).length)}|  ${lines[j]}`);
                const lineLength = lines[j].length;
                if (j === i) {
                    // push underline
                    const pad = start - (count - lineLength) + 1;
                    const length = Math.max(1, end > count ? lineLength - pad : end - start);
                    res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length));
                }
                else if (j > i) {
                    if (end > count) {
                        const length = Math.max(Math.min(end - count, lineLength), 1);
                        res.push(`   |  ` + '^'.repeat(length));
                    }
                    count += lineLength + 1;
                }
            }
            break;
        }
    }
    return res.join('\n');
}

const mockError = () => mockWarn(true);
function mockWarn(asError = false) {
    expect.extend({
        toHaveBeenWarned(received) {
            asserted.add(received);
            const passed = warn.mock.calls.some(args => args[0].indexOf(received) > -1);
            if (passed) {
                return {
                    pass: true,
                    message: () => `expected "${received}" not to have been warned.`
                };
            }
            else {
                const msgs = warn.mock.calls.map(args => args[0]).join('\n - ');
                return {
                    pass: false,
                    message: () => `expected "${received}" to have been warned.\n\nActual messages:\n\n - ${msgs}`
                };
            }
        },
        toHaveBeenWarnedLast(received) {
            asserted.add(received);
            const passed = warn.mock.calls[warn.mock.calls.length - 1][0].indexOf(received) > -1;
            if (passed) {
                return {
                    pass: true,
                    message: () => `expected "${received}" not to have been warned last.`
                };
            }
            else {
                const msgs = warn.mock.calls.map(args => args[0]).join('\n - ');
                return {
                    pass: false,
                    message: () => `expected "${received}" to have been warned last.\n\nActual messages:\n\n - ${msgs}`
                };
            }
        },
        toHaveBeenWarnedTimes(received, n) {
            asserted.add(received);
            let found = 0;
            warn.mock.calls.forEach(args => {
                if (args[0].indexOf(received) > -1) {
                    found++;
                }
            });
            if (found === n) {
                return {
                    pass: true,
                    message: () => `expected "${received}" to have been warned ${n} times.`
                };
            }
            else {
                return {
                    pass: false,
                    message: () => `expected "${received}" to have been warned ${n} times but got ${found}.`
                };
            }
        }
    });
    let warn;
    const asserted = new Set();
    beforeEach(() => {
        asserted.clear();
        warn = jest.spyOn(console, asError ? 'error' : 'warn');
        warn.mockImplementation(() => { });
    });
    afterEach(() => {
        const assertedArray = Array.from(asserted);
        const nonAssertedWarnings = warn.mock.calls
            .map(args => args[0])
            .filter(received => {
            return !assertedArray.some(assertedMsg => {
                return received.indexOf(assertedMsg) > -1;
            });
        });
        warn.mockRestore();
        if (nonAssertedWarnings.length) {
            nonAssertedWarnings.forEach(warning => {
                console.warn(warning);
            });
            throw new Error(`test case threw unexpected warnings.`);
        }
    });
}

/**
 * On the client we only need to offer special cases for boolean attributes that
 * have different names from their corresponding dom properties:
 * - itemscope -> N/A
 * - allowfullscreen -> allowFullscreen
 * - formnovalidate -> formNoValidate
 * - ismap -> isMap
 * - nomodule -> noModule
 * - novalidate -> noValidate
 * - readonly -> readOnly
 */
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /*#__PURE__*/ makeMap(specialBooleanAttrs);
/**
 * The full list is needed during SSR to produce the correct initial markup.
 */
const isBooleanAttr = /*#__PURE__*/ makeMap(specialBooleanAttrs +
    `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,` +
    `loop,open,required,reversed,scoped,seamless,` +
    `checked,muted,multiple,selected`);
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
    if (attrValidationCache.hasOwnProperty(name)) {
        return attrValidationCache[name];
    }
    const isUnsafe = unsafeAttrCharRE.test(name);
    if (isUnsafe) {
        console.error(`unsafe attribute name: ${name}`);
    }
    return (attrValidationCache[name] = !isUnsafe);
}
const propsToAttrMap = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
};
/**
 * CSS properties that accept plain numbers
 */
const isNoUnitNumericStyleProp = /*#__PURE__*/ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,` +
    `border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,` +
    `columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,` +
    `grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,` +
    `grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,` +
    `line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,` +
    // SVG
    `fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,` +
    `stroke-miterlimit,stroke-opacity,stroke-width`);
/**
 * Known attributes, this is used for stringification of runtime static nodes
 * so that we don't stringify bindings that cannot be set from HTML.
 * Don't also forget to allow `data-*` and `aria-*`!
 * Generated from https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */
const isKnownAttr = /*#__PURE__*/ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,` +
    `autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,` +
    `border,buffered,capture,challenge,charset,checked,cite,class,code,` +
    `codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,` +
    `coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,` +
    `disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,` +
    `formaction,formenctype,formmethod,formnovalidate,formtarget,headers,` +
    `height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,` +
    `ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,` +
    `manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,` +
    `open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,` +
    `referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,` +
    `selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,` +
    `start,step,style,summary,tabindex,target,title,translate,type,usemap,` +
    `value,width,wrap`);

function normalizeStyle(value) {
    if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const normalized = normalizeStyle(isString(item) ? parseStringStyle(item) : item);
            if (normalized) {
                for (const key in normalized) {
                    res[key] = normalized[key];
                }
            }
        }
        return res;
    }
    else if (isObject(value)) {
        return value;
    }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
    const ret = {};
    cssText.split(listDelimiterRE).forEach(item => {
        if (item) {
            const tmp = item.split(propertyDelimiterRE);
            tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
    });
    return ret;
}
function stringifyStyle(styles) {
    let ret = '';
    if (!styles) {
        return ret;
    }
    for (const key in styles) {
        const value = styles[key];
        const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
        if (isString(value) ||
            (typeof value === 'number' && isNoUnitNumericStyleProp(normalizedKey))) {
            // only render valid values
            ret += `${normalizedKey}:${value};`;
        }
    }
    return ret;
}
function normalizeClass(value) {
    let res = '';
    if (isString(value)) {
        res = value;
    }
    else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            res += normalizeClass(value[i]) + ' ';
        }
    }
    else if (isObject(value)) {
        for (const name in value) {
            if (value[name]) {
                res += name + ' ';
            }
        }
    }
    return res.trim();
}

// These tag configs are shared between compiler-dom and runtime-dom, so they
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const HTML_TAGS = 'html,body,base,head,link,meta,style,title,address,article,aside,footer,' +
    'header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,' +
    'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
    'data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,' +
    'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
    'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
    'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
    'option,output,progress,select,textarea,details,dialog,menu,' +
    'summary,content,template,blockquote,iframe,tfoot';
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element
const SVG_TAGS = 'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' +
    'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' +
    'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' +
    'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' +
    'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' +
    'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' +
    'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' +
    'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' +
    'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' +
    'text,textPath,title,tspan,unknown,use,view';
const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
const isHTMLTag = /*#__PURE__*/ makeMap(HTML_TAGS);
const isSVGTag = /*#__PURE__*/ makeMap(SVG_TAGS);
const isVoidTag = /*#__PURE__*/ makeMap(VOID_TAGS);

const escapeRE = /["'&<>]/;
function escapeHtml(string) {
    const str = '' + string;
    const match = escapeRE.exec(str);
    if (!match) {
        return str;
    }
    let html = '';
    let escaped;
    let index;
    let lastIndex = 0;
    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escaped = '&quot;';
                break;
            case 38: // &
                escaped = '&amp;';
                break;
            case 39: // '
                escaped = '&#39;';
                break;
            case 60: // <
                escaped = '&lt;';
                break;
            case 62: // >
                escaped = '&gt;';
                break;
            default:
                continue;
        }
        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escaped;
    }
    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
// https://www.w3.org/TR/html52/syntax.html#comments
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
    return src.replace(commentStripRE, '');
}

function looseCompareArrays(a, b) {
    if (a.length !== b.length)
        return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
        equal = looseEqual(a[i], b[i]);
    }
    return equal;
}
function looseEqual(a, b) {
    if (a === b)
        return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
        return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
        return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject(a);
    bValidType = isObject(b);
    if (aValidType || bValidType) {
        /* istanbul ignore if: this if will probably never be called */
        if (!aValidType || !bValidType) {
            return false;
        }
        const aKeysCount = Object.keys(a).length;
        const bKeysCount = Object.keys(b).length;
        if (aKeysCount !== bKeysCount) {
            return false;
        }
        for (const key in a) {
            const aHasKey = a.hasOwnProperty(key);
            const bHasKey = b.hasOwnProperty(key);
            if ((aHasKey && !bHasKey) ||
                (!aHasKey && bHasKey) ||
                !looseEqual(a[key], b[key])) {
                return false;
            }
        }
    }
    return String(a) === String(b);
}
function looseIndexOf(arr, val) {
    return arr.findIndex(item => looseEqual(item, val));
}

/**
 * For converting {{ interpolation }} values to displayed strings.
 * @private
 */
const toDisplayString = (val) => {
    return val == null
        ? ''
        : isObject(val)
            ? JSON.stringify(val, replacer, 2)
            : String(val);
};
const replacer = (_key, val) => {
    if (val instanceof Map) {
        return {
            [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
                entries[`${key} =>`] = val;
                return entries;
            }, {})
        };
    }
    else if (val instanceof Set) {
        return {
            [`Set(${val.size})`]: [...val.values()]
        };
    }
    else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
        return String(val);
    }
    return val;
};

/**
 * List of @babel/parser plugins that are used for template expression
 * transforms and SFC script transforms. By default we enable proposals slated
 * for ES2020. This will need to be updated as the spec moves forward.
 * Full list at https://babeljs.io/docs/en/next/babel-parser#plugins
 */
const babelParserDefautPlugins = [
    'bigInt',
    'optionalChaining',
    'nullishCoalescingOperator'
];
const EMPTY_OBJ = ( true)
    ? Object.freeze({})
    : undefined;
const EMPTY_ARR = [];
const NOOP = () => { };
/**
 * Always return false.
 */
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const extend = Object.assign;
const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
        arr.splice(i, 1);
    }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isDate = (val) => val instanceof Date;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
const isSymbol = (val) => typeof val === 'symbol';
const isObject = (val) => val !== null && typeof val === 'object';
const isPromise = (val) => {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === '[object Object]';
const isReservedProp = /*#__PURE__*/ makeMap('key,ref,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted');
const cacheStringFunction = (fn) => {
    const cache = Object.create(null);
    return ((str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
};
const camelizeRE = /-(\w)/g;
/**
 * @private
 */
const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});
const hyphenateRE = /\B([A-Z])/g;
/**
 * @private
 */
const hyphenate = cacheStringFunction((str) => {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
});
/**
 * @private
 */
const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
// compare whether a value has changed, accounting for NaN.
const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
const invokeArrayFns = (fns, arg) => {
    for (let i = 0; i < fns.length; i++) {
        fns[i](arg);
    }
};
const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        value
    });
};
const toNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
};




/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/vue/dist/vue.runtime.esm-bundler.js":
/*!**********************************************************!*\
  !*** ./node_modules/vue/dist/vue.runtime.esm-bundler.js ***!
  \**********************************************************/
/*! exports provided: customRef, isProxy, isReactive, isReadonly, isRef, markRaw, reactive, readonly, ref, shallowReactive, shallowReadonly, shallowRef, toRaw, toRef, toRefs, triggerRef, unref, camelize, capitalize, toDisplayString, BaseTransition, Comment, Fragment, KeepAlive, Static, Suspense, Teleport, Text, callWithAsyncErrorHandling, callWithErrorHandling, cloneVNode, computed, createBlock, createCommentVNode, createHydrationRenderer, createRenderer, createSlots, createStaticVNode, createTextVNode, createVNode, defineAsyncComponent, defineComponent, devtools, getCurrentInstance, getTransitionRawChildren, h, handleError, inject, isVNode, mergeProps, nextTick, onActivated, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onDeactivated, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onUnmounted, onUpdated, openBlock, popScopeId, provide, pushScopeId, queuePostFlushCb, registerRuntimeCompiler, renderList, renderSlot, resolveComponent, resolveDirective, resolveDynamicComponent, resolveTransitionHooks, setBlockTracking, setDevtoolsHook, setTransitionHooks, ssrContextKey, ssrUtils, toHandlers, transformVNodeArgs, useSSRContext, useTransitionState, version, warn, watch, watchEffect, withCtx, withDirectives, withScopeId, Transition, TransitionGroup, createApp, createSSRApp, hydrate, render, useCssModule, useCssVars, vModelCheckbox, vModelDynamic, vModelRadio, vModelSelect, vModelText, vShow, withKeys, withModifiers, compile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compile", function() { return compile; });
/* harmony import */ var _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/runtime-dom */ "./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "customRef", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["customRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isProxy", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["isProxy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isReactive", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["isReactive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isReadonly", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["isReadonly"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isRef", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["isRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "markRaw", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["markRaw"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "reactive", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["reactive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "readonly", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["readonly"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ref", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["ref"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shallowReactive", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["shallowReactive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shallowReadonly", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["shallowReadonly"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shallowRef", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["shallowRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toRaw", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["toRaw"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toRef", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["toRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toRefs", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["toRefs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "triggerRef", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["triggerRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "unref", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["unref"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "camelize", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["camelize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["capitalize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toDisplayString", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseTransition", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["BaseTransition"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Comment", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["Comment"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Fragment", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["Fragment"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KeepAlive", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["KeepAlive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Static", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["Static"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Suspense", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["Suspense"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Teleport", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["Teleport"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["Text"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "callWithAsyncErrorHandling", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["callWithAsyncErrorHandling"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "callWithErrorHandling", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["callWithErrorHandling"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "cloneVNode", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["cloneVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "computed", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["computed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createBlock", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["createBlock"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createCommentVNode", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createHydrationRenderer", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["createHydrationRenderer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createRenderer", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["createRenderer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createSlots", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["createSlots"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createStaticVNode", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["createStaticVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createTextVNode", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["createTextVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createVNode", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["createVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defineAsyncComponent", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["defineAsyncComponent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defineComponent", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["defineComponent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "devtools", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["devtools"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentInstance", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["getCurrentInstance"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getTransitionRawChildren", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["getTransitionRawChildren"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "h", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["h"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "handleError", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["handleError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "inject", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["inject"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isVNode", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["isVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeProps", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["mergeProps"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "nextTick", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["nextTick"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onActivated", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onActivated"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onBeforeMount", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onBeforeMount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onBeforeUnmount", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onBeforeUnmount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onBeforeUpdate", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onBeforeUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onDeactivated", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onDeactivated"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onErrorCaptured", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onErrorCaptured"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onMounted", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onMounted"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onRenderTracked", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onRenderTracked"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onRenderTriggered", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onRenderTriggered"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onUnmounted", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onUnmounted"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onUpdated", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["onUpdated"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "openBlock", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["openBlock"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "popScopeId", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["popScopeId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "provide", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["provide"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "pushScopeId", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["pushScopeId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "queuePostFlushCb", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["queuePostFlushCb"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerRuntimeCompiler", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["registerRuntimeCompiler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "renderList", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["renderList"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "renderSlot", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["renderSlot"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveComponent", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["resolveComponent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveDirective", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["resolveDirective"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveDynamicComponent", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["resolveDynamicComponent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveTransitionHooks", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["resolveTransitionHooks"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setBlockTracking", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["setBlockTracking"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setDevtoolsHook", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["setDevtoolsHook"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setTransitionHooks", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["setTransitionHooks"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ssrContextKey", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["ssrContextKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ssrUtils", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["ssrUtils"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toHandlers", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["toHandlers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "transformVNodeArgs", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["transformVNodeArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useSSRContext", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["useSSRContext"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useTransitionState", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["useTransitionState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "version", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["version"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "warn", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["warn"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "watch", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["watch"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "watchEffect", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["watchEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withCtx", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["withCtx"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withDirectives", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["withDirectives"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withScopeId", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["withScopeId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Transition", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["Transition"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TransitionGroup", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["TransitionGroup"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createApp", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["createApp"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createSSRApp", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["createSSRApp"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hydrate", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["hydrate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useCssModule", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["useCssModule"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useCssVars", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["useCssVars"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "vModelCheckbox", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["vModelCheckbox"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "vModelDynamic", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["vModelDynamic"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "vModelRadio", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["vModelRadio"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "vModelSelect", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["vModelSelect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "vModelText", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["vModelText"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "vShow", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["vShow"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withKeys", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["withKeys"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withModifiers", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["withModifiers"]; });




function initDev() {
    const target =  window ;
    target.__VUE__ = _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["version"];
    Object(_vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["setDevtoolsHook"])(target.__VUE_DEVTOOLS_GLOBAL_HOOK__);
    {
        // @ts-ignore `console.info` cannot be null error
        console[console.info ? 'info' : 'log'](`You are running a development build of Vue.\n` +
            `Make sure to use the production build (*.prod.js) when deploying for production.`);
    }
}

// This entry exports the runtime only, and is built as
( true) && initDev();
const compile = () => {
    if ((true)) {
        Object(_vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["warn"])(`Runtime compilation is not supported in this build of Vue.` +
            ( ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
                ) /* should not happen */);
    }
};




/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQHZ1ZS9yZWFjdGl2aXR5L2Rpc3QvcmVhY3Rpdml0eS5lc20tYnVuZGxlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQHZ1ZS9ydW50aW1lLWNvcmUvZGlzdC9ydW50aW1lLWNvcmUuZXNtLWJ1bmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0B2dWUvcnVudGltZS1kb20vZGlzdC9ydW50aW1lLWRvbS5lc20tYnVuZGxlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQHZ1ZS9zaGFyZWQvZGlzdC9zaGFyZWQuZXNtLWJ1bmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Z1ZS9kaXN0L3Z1ZS5ydW50aW1lLmVzbS1idW5kbGVyLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXdKOztBQUV4SjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsS0FBcUMsZ0JBQWdCLFNBQUU7QUFDbkYsb0NBQW9DLEtBQXFDLHdCQUF3QixTQUFFO0FBQ25HO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixxREFBUztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQSxpQkFBaUIsSUFBcUM7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQXFDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSwwREFBTTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVywwSEFBMEg7QUFDckk7QUFDQTtBQUNBLFNBQVMsSUFBcUM7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QUFDMUI7QUFDQSxzQkFBc0IsOERBQVU7QUFDaEM7QUFDQTtBQUNBLFNBQVMsS0FBcUMsK0NBQStDLCtEQUFPO0FBQ3BHLGVBQWUsNkRBQUs7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxLQUFxQztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYywwREFBTSxHQUFHO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSwyREFBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdB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Q0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXNnQzs7Ozs7Ozs7Ozs7Ozs7QUN2OUx0Z0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMFQ7QUFDeFI7QUFDbUw7O0FBRXJOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHVDQUF1QyxLQUFLO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSw0REFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDREQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qiw2REFBUztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsa0VBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4REFBVTtBQUNyQixtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHdFQUFvQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLElBQXFDO0FBQ3RELGdCQUFnQiw4REFBSSx5QkFBeUIsSUFBSSxRQUFRLHlCQUF5QjtBQUNsRiw2QkFBNkIsTUFBTTtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxvRkFBMEI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsMkRBQU87QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQix3REFBSTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELDhEQUFVO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyw0REFBUTtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsNEVBQWtCO0FBQzNDO0FBQ0EsYUFBYSxLQUFxQyxLQUFLLDhEQUFJO0FBQzNELG1CQUFtQixxREFBUztBQUM1QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQXFDLEtBQUssOERBQUk7QUFDM0QsbUJBQW1CLHFEQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBcUM7QUFDbEQsZ0JBQWdCLDhEQUFJLHFEQUFxRCxLQUFLO0FBQzlFLG1CQUFtQixxREFBUztBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQiw0RUFBa0I7QUFDdkM7QUFDQTtBQUNBLFNBQVMsS0FBcUM7QUFDOUMsWUFBWSw4REFBSTtBQUNoQjtBQUNBO0FBQ0E7QUFDQSxhQUFhLGdEQUFnRDtBQUM3RDtBQUNBLElBQUksbUVBQVM7QUFDYixRQUFRLHFFQUFXO0FBQ25CO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsT0FBTyxFQUFFLElBQUksR0FBRywrREFBSztBQUN4RDtBQUNBO0FBQ0EsNEJBQTRCLDBEQUFRO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixRQUFRLEtBQUssMkRBQUMsQ0FBQyxnRUFBYztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELDBEQUFNLEdBQUcsRUFBRSxnRUFBYztBQUMvRTtBQUNBLFNBQVMsNkRBQTZELEtBQUssb0NBQW9DLEtBQUssa0NBQWtDLEtBQUssc0lBQXNJLEtBQUssb0NBQW9DLEtBQUssa0NBQWtDLEtBQUssWUFBWTtBQUNsWTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdLQUFnSztBQUMzSztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxXQUFXLDBEQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSw0REFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDREQUFRO0FBQ3hCLFNBQVMsSUFBcUM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsOERBQUk7QUFDWixtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7QUFDQSxRQUFRLDhEQUFJO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFdBQVcsMkJBQTJCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQU0sR0FBRztBQUNwQjtBQUNBO0FBQ0EsS0FBSztBQUNMLGtCQUFrQixRQUFRO0FBQzFCLHlCQUF5Qiw0RUFBa0I7QUFDM0Msc0JBQXNCLDRFQUFrQjtBQUN4QztBQUNBO0FBQ0EsUUFBUSxtRUFBUztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxrQkFBa0I7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsMERBQVE7QUFDaEQ7QUFDQSx1Q0FBdUMsa0ZBQXdCO0FBQy9ELDJCQUEyQixxQkFBcUI7QUFDaEQ7QUFDQTtBQUNBLG9CQUFvQiw0RUFBa0IsUUFBUSxnRkFBc0I7QUFDcEU7QUFDQSwwQkFBMEIsSUFBcUM7QUFDL0Qsb0JBQW9CLDhEQUFJO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBLCtCQUErQix5QkFBeUI7QUFDeEQ7QUFDQSxvQkFBb0IsNEVBQWtCLFFBQVEsZ0ZBQXNCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixxRUFBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxHQUFHLEtBQUssR0FBRztBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGVBQWU7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLDJEQUFPLGdCQUFnQixrRUFBYztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixvQkFBb0IscUJBQXFCLEVBQUU7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQiw0REFBUTtBQUNuQztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxzQkFBc0Isb0JBQW9CLGVBQWUsRUFBRTtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELDREQUFRO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiwyREFBTztBQUN2Qiw4QkFBOEIsZ0VBQVk7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsa0JBQWtCO0FBQzNDO0FBQ0EsUUFBUSwyREFBTztBQUNmLHFCQUFxQixnRUFBWTtBQUNqQztBQUNBO0FBQ0EscUJBQXFCLDhEQUFVO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixRQUFRO0FBQzdCLHFCQUFxQiw4REFBVTtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMLHNCQUFzQixrQkFBa0I7QUFDeEM7QUFDQTtBQUNBLHlCQUF5Qiw4REFBVTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QiwyREFBTztBQUM5QixTQUFTLEtBQXFDO0FBQzlDLFlBQVksOERBQUk7QUFDaEIsMkJBQTJCLG1EQUFtRDtBQUM5RTtBQUNBO0FBQ0EsMENBQTBDLE9BQU87QUFDakQ7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGdFQUFZO0FBQzFDO0FBQ0E7QUFDQSxnQkFBZ0IsOERBQVU7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsRUFBRTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLDZEQUFTO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsUUFBUSxHQUFHLGFBQWE7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsaUJBQWlCLFFBQVEsR0FBRyxhQUFhO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxpQkFBaUIsa0JBQWtCLEdBQUcsYUFBYTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsdUJBQXVCLFFBQVE7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3QiwwREFBTSxFQUFFLDRCQUE0QjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLHdFQUFjO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxpRkFBdUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLFNBQVMsSUFBcUM7QUFDOUM7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSw4REFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLFNBQVMsSUFBcUM7QUFDOUM7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw2REFBUyxTQUFTLDREQUFRO0FBQ2xEO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxRQUFRLDREQUFRO0FBQ2hCO0FBQ0EsYUFBYSxLQUFxQztBQUNsRCxZQUFZLDhEQUFJO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWlOOzs7Ozs7Ozs7Ozs7O0FDN3FDak47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBLG1DQUFtQywrQkFBK0I7QUFDbEU7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLEtBQUssRUFBRSxvQ0FBb0MsS0FBSyxTQUFTO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFNBQVM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFNBQVMsbURBQW1ELEtBQUs7QUFDakg7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsU0FBUztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsU0FBUyx3REFBd0QsS0FBSztBQUN0SDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxTQUFTLHdCQUF3QixFQUFFO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsU0FBUyx3QkFBd0IsRUFBRSxpQkFBaUIsTUFBTTtBQUMxRztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxFQUFFO0FBQ3pDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxLQUFLO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixjQUFjLEdBQUcsT0FBTztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixrQkFBa0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixvQkFBb0I7QUFDakQ7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsdUJBQXVCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCLDJCQUEyQixJQUFJO0FBQy9CO0FBQ0EsYUFBYSxJQUFJO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixLQUFxQztBQUN4RCxzQkFBc0I7QUFDdEIsTUFBTSxTQUFFO0FBQ1I7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUUrcUI7Ozs7Ozs7Ozs7Ozs7QUNyaUJscUI7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7O0FBRWhCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRDQUE0QyxxQkFBcUI7QUFDakU7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EscUJBQXFCLGlCQUFpQjtBQUN0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLHFCQUFxQjtBQUN6Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCOztBQUU5Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLENBQUM7OztBQUdEO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxjQUFjO0FBQ25FO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDN0ZhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQ7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQix3QkFBd0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsS0FBd0MsR0FBRyxzQkFBaUIsR0FBRyxTQUFJOztBQUVuRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxxRUFBcUUscUJBQXFCLGFBQWE7O0FBRXZHOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQSx5REFBeUQ7QUFDekQsR0FBRzs7QUFFSDs7O0FBR0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQjtBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1CQUFtQiw0QkFBNEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsb0JBQW9CLDZCQUE2QjtBQUNqRDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRTs7Ozs7Ozs7Ozs7O0FDNVFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBa0U7QUFDakM7O0FBRWpDO0FBQ0E7QUFDQSxxQkFBcUIsd0RBQU87QUFDNUIsSUFBSSx3RUFBZTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDLEtBQXFDO0FBQ3RDO0FBQ0EsU0FBUyxJQUFxQztBQUM5QyxRQUFRLDZEQUFJO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRW1COzs7Ozs7Ozs7Ozs7QUN4Qm5COztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1QyIsImZpbGUiOiJ2ZW5kb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFTVBUWV9PQkosIGlzQXJyYXksIGlzU3ltYm9sLCBleHRlbmQsIGhhc093biwgaXNPYmplY3QsIGhhc0NoYW5nZWQsIGNhcGl0YWxpemUsIHRvUmF3VHlwZSwgZGVmLCBtYWtlTWFwLCBpc0Z1bmN0aW9uLCBOT09QIH0gZnJvbSAnQHZ1ZS9zaGFyZWQnO1xuXG5jb25zdCB0YXJnZXRNYXAgPSBuZXcgV2Vha01hcCgpO1xyXG5jb25zdCBlZmZlY3RTdGFjayA9IFtdO1xyXG5sZXQgYWN0aXZlRWZmZWN0O1xyXG5jb25zdCBJVEVSQVRFX0tFWSA9IFN5bWJvbCgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgPyAnaXRlcmF0ZScgOiAnJyk7XHJcbmNvbnN0IE1BUF9LRVlfSVRFUkFURV9LRVkgPSBTeW1ib2woKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpID8gJ01hcCBrZXkgaXRlcmF0ZScgOiAnJyk7XHJcbmZ1bmN0aW9uIGlzRWZmZWN0KGZuKSB7XHJcbiAgICByZXR1cm4gZm4gJiYgZm4uX2lzRWZmZWN0ID09PSB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIGVmZmVjdChmbiwgb3B0aW9ucyA9IEVNUFRZX09CSikge1xyXG4gICAgaWYgKGlzRWZmZWN0KGZuKSkge1xyXG4gICAgICAgIGZuID0gZm4ucmF3O1xyXG4gICAgfVxyXG4gICAgY29uc3QgZWZmZWN0ID0gY3JlYXRlUmVhY3RpdmVFZmZlY3QoZm4sIG9wdGlvbnMpO1xyXG4gICAgaWYgKCFvcHRpb25zLmxhenkpIHtcclxuICAgICAgICBlZmZlY3QoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBlZmZlY3Q7XHJcbn1cclxuZnVuY3Rpb24gc3RvcChlZmZlY3QpIHtcclxuICAgIGlmIChlZmZlY3QuYWN0aXZlKSB7XHJcbiAgICAgICAgY2xlYW51cChlZmZlY3QpO1xyXG4gICAgICAgIGlmIChlZmZlY3Qub3B0aW9ucy5vblN0b3ApIHtcclxuICAgICAgICAgICAgZWZmZWN0Lm9wdGlvbnMub25TdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVmZmVjdC5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5sZXQgdWlkID0gMDtcclxuZnVuY3Rpb24gY3JlYXRlUmVhY3RpdmVFZmZlY3QoZm4sIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IGVmZmVjdCA9IGZ1bmN0aW9uIHJlYWN0aXZlRWZmZWN0KCkge1xyXG4gICAgICAgIGlmICghZWZmZWN0LmFjdGl2ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5zY2hlZHVsZXIgPyB1bmRlZmluZWQgOiBmbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWVmZmVjdFN0YWNrLmluY2x1ZGVzKGVmZmVjdCkpIHtcclxuICAgICAgICAgICAgY2xlYW51cChlZmZlY3QpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZW5hYmxlVHJhY2tpbmcoKTtcclxuICAgICAgICAgICAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0KTtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgZWZmZWN0U3RhY2sucG9wKCk7XHJcbiAgICAgICAgICAgICAgICByZXNldFRyYWNraW5nKCk7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBlZmZlY3QuaWQgPSB1aWQrKztcclxuICAgIGVmZmVjdC5faXNFZmZlY3QgPSB0cnVlO1xyXG4gICAgZWZmZWN0LmFjdGl2ZSA9IHRydWU7XHJcbiAgICBlZmZlY3QucmF3ID0gZm47XHJcbiAgICBlZmZlY3QuZGVwcyA9IFtdO1xyXG4gICAgZWZmZWN0Lm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgcmV0dXJuIGVmZmVjdDtcclxufVxyXG5mdW5jdGlvbiBjbGVhbnVwKGVmZmVjdCkge1xyXG4gICAgY29uc3QgeyBkZXBzIH0gPSBlZmZlY3Q7XHJcbiAgICBpZiAoZGVwcy5sZW5ndGgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZGVwc1tpXS5kZWxldGUoZWZmZWN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVwcy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59XHJcbmxldCBzaG91bGRUcmFjayA9IHRydWU7XHJcbmNvbnN0IHRyYWNrU3RhY2sgPSBbXTtcclxuZnVuY3Rpb24gcGF1c2VUcmFja2luZygpIHtcclxuICAgIHRyYWNrU3RhY2sucHVzaChzaG91bGRUcmFjayk7XHJcbiAgICBzaG91bGRUcmFjayA9IGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIGVuYWJsZVRyYWNraW5nKCkge1xyXG4gICAgdHJhY2tTdGFjay5wdXNoKHNob3VsZFRyYWNrKTtcclxuICAgIHNob3VsZFRyYWNrID0gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiByZXNldFRyYWNraW5nKCkge1xyXG4gICAgY29uc3QgbGFzdCA9IHRyYWNrU3RhY2sucG9wKCk7XHJcbiAgICBzaG91bGRUcmFjayA9IGxhc3QgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBsYXN0O1xyXG59XHJcbmZ1bmN0aW9uIHRyYWNrKHRhcmdldCwgdHlwZSwga2V5KSB7XHJcbiAgICBpZiAoIXNob3VsZFRyYWNrIHx8IGFjdGl2ZUVmZmVjdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGRlcHNNYXAgPSB0YXJnZXRNYXAuZ2V0KHRhcmdldCk7XHJcbiAgICBpZiAoIWRlcHNNYXApIHtcclxuICAgICAgICB0YXJnZXRNYXAuc2V0KHRhcmdldCwgKGRlcHNNYXAgPSBuZXcgTWFwKCkpKTtcclxuICAgIH1cclxuICAgIGxldCBkZXAgPSBkZXBzTWFwLmdldChrZXkpO1xyXG4gICAgaWYgKCFkZXApIHtcclxuICAgICAgICBkZXBzTWFwLnNldChrZXksIChkZXAgPSBuZXcgU2V0KCkpKTtcclxuICAgIH1cclxuICAgIGlmICghZGVwLmhhcyhhY3RpdmVFZmZlY3QpKSB7XHJcbiAgICAgICAgZGVwLmFkZChhY3RpdmVFZmZlY3QpO1xyXG4gICAgICAgIGFjdGl2ZUVmZmVjdC5kZXBzLnB1c2goZGVwKTtcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGFjdGl2ZUVmZmVjdC5vcHRpb25zLm9uVHJhY2spIHtcclxuICAgICAgICAgICAgYWN0aXZlRWZmZWN0Lm9wdGlvbnMub25UcmFjayh7XHJcbiAgICAgICAgICAgICAgICBlZmZlY3Q6IGFjdGl2ZUVmZmVjdCxcclxuICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICBrZXlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHRyaWdnZXIodGFyZ2V0LCB0eXBlLCBrZXksIG5ld1ZhbHVlLCBvbGRWYWx1ZSwgb2xkVGFyZ2V0KSB7XHJcbiAgICBjb25zdCBkZXBzTWFwID0gdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xyXG4gICAgaWYgKCFkZXBzTWFwKSB7XHJcbiAgICAgICAgLy8gbmV2ZXIgYmVlbiB0cmFja2VkXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZWZmZWN0cyA9IG5ldyBTZXQoKTtcclxuICAgIGNvbnN0IGFkZCA9IChlZmZlY3RzVG9BZGQpID0+IHtcclxuICAgICAgICBpZiAoZWZmZWN0c1RvQWRkKSB7XHJcbiAgICAgICAgICAgIGVmZmVjdHNUb0FkZC5mb3JFYWNoKGVmZmVjdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWZmZWN0ICE9PSBhY3RpdmVFZmZlY3QgfHwgIXNob3VsZFRyYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0cy5hZGQoZWZmZWN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGlmICh0eXBlID09PSBcImNsZWFyXCIgLyogQ0xFQVIgKi8pIHtcclxuICAgICAgICAvLyBjb2xsZWN0aW9uIGJlaW5nIGNsZWFyZWRcclxuICAgICAgICAvLyB0cmlnZ2VyIGFsbCBlZmZlY3RzIGZvciB0YXJnZXRcclxuICAgICAgICBkZXBzTWFwLmZvckVhY2goYWRkKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGtleSA9PT0gJ2xlbmd0aCcgJiYgaXNBcnJheSh0YXJnZXQpKSB7XHJcbiAgICAgICAgZGVwc01hcC5mb3JFYWNoKChkZXAsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnbGVuZ3RoJyB8fCBrZXkgPj0gbmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGFkZChkZXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBzY2hlZHVsZSBydW5zIGZvciBTRVQgfCBBREQgfCBERUxFVEVcclxuICAgICAgICBpZiAoa2V5ICE9PSB2b2lkIDApIHtcclxuICAgICAgICAgICAgYWRkKGRlcHNNYXAuZ2V0KGtleSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhbHNvIHJ1biBmb3IgaXRlcmF0aW9uIGtleSBvbiBBREQgfCBERUxFVEUgfCBNYXAuU0VUXHJcbiAgICAgICAgY29uc3QgaXNBZGRPckRlbGV0ZSA9IHR5cGUgPT09IFwiYWRkXCIgLyogQUREICovIHx8XHJcbiAgICAgICAgICAgICh0eXBlID09PSBcImRlbGV0ZVwiIC8qIERFTEVURSAqLyAmJiAhaXNBcnJheSh0YXJnZXQpKTtcclxuICAgICAgICBpZiAoaXNBZGRPckRlbGV0ZSB8fFxyXG4gICAgICAgICAgICAodHlwZSA9PT0gXCJzZXRcIiAvKiBTRVQgKi8gJiYgdGFyZ2V0IGluc3RhbmNlb2YgTWFwKSkge1xyXG4gICAgICAgICAgICBhZGQoZGVwc01hcC5nZXQoaXNBcnJheSh0YXJnZXQpID8gJ2xlbmd0aCcgOiBJVEVSQVRFX0tFWSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNBZGRPckRlbGV0ZSAmJiB0YXJnZXQgaW5zdGFuY2VvZiBNYXApIHtcclxuICAgICAgICAgICAgYWRkKGRlcHNNYXAuZ2V0KE1BUF9LRVlfSVRFUkFURV9LRVkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBydW4gPSAoZWZmZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBlZmZlY3Qub3B0aW9ucy5vblRyaWdnZXIpIHtcclxuICAgICAgICAgICAgZWZmZWN0Lm9wdGlvbnMub25UcmlnZ2VyKHtcclxuICAgICAgICAgICAgICAgIGVmZmVjdCxcclxuICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgIGtleSxcclxuICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSxcclxuICAgICAgICAgICAgICAgIG9sZFZhbHVlLFxyXG4gICAgICAgICAgICAgICAgb2xkVGFyZ2V0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWZmZWN0Lm9wdGlvbnMuc2NoZWR1bGVyKSB7XHJcbiAgICAgICAgICAgIGVmZmVjdC5vcHRpb25zLnNjaGVkdWxlcihlZmZlY3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZWZmZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGVmZmVjdHMuZm9yRWFjaChydW4pO1xyXG59XG5cbmNvbnN0IGJ1aWx0SW5TeW1ib2xzID0gbmV3IFNldChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhTeW1ib2wpXHJcbiAgICAubWFwKGtleSA9PiBTeW1ib2xba2V5XSlcclxuICAgIC5maWx0ZXIoaXNTeW1ib2wpKTtcclxuY29uc3QgZ2V0ID0gLyojX19QVVJFX18qLyBjcmVhdGVHZXR0ZXIoKTtcclxuY29uc3Qgc2hhbGxvd0dldCA9IC8qI19fUFVSRV9fKi8gY3JlYXRlR2V0dGVyKGZhbHNlLCB0cnVlKTtcclxuY29uc3QgcmVhZG9ubHlHZXQgPSAvKiNfX1BVUkVfXyovIGNyZWF0ZUdldHRlcih0cnVlKTtcclxuY29uc3Qgc2hhbGxvd1JlYWRvbmx5R2V0ID0gLyojX19QVVJFX18qLyBjcmVhdGVHZXR0ZXIodHJ1ZSwgdHJ1ZSk7XHJcbmNvbnN0IGFycmF5SW5zdHJ1bWVudGF0aW9ucyA9IHt9O1xyXG5bJ2luY2x1ZGVzJywgJ2luZGV4T2YnLCAnbGFzdEluZGV4T2YnXS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICBhcnJheUluc3RydW1lbnRhdGlvbnNba2V5XSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgYXJyID0gdG9SYXcodGhpcyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICB0cmFjayhhcnIsIFwiZ2V0XCIgLyogR0VUICovLCBpICsgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB3ZSBydW4gdGhlIG1ldGhvZCB1c2luZyB0aGUgb3JpZ2luYWwgYXJncyBmaXJzdCAod2hpY2ggbWF5IGJlIHJlYWN0aXZlKVxyXG4gICAgICAgIGNvbnN0IHJlcyA9IGFycltrZXldKC4uLmFyZ3MpO1xyXG4gICAgICAgIGlmIChyZXMgPT09IC0xIHx8IHJlcyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgLy8gaWYgdGhhdCBkaWRuJ3Qgd29yaywgcnVuIGl0IGFnYWluIHVzaW5nIHJhdyB2YWx1ZXMuXHJcbiAgICAgICAgICAgIHJldHVybiBhcnJba2V5XSguLi5hcmdzLm1hcCh0b1JhdykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KTtcclxuZnVuY3Rpb24gY3JlYXRlR2V0dGVyKGlzUmVhZG9ubHkgPSBmYWxzZSwgc2hhbGxvdyA9IGZhbHNlKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gZ2V0KHRhcmdldCwga2V5LCByZWNlaXZlcikge1xyXG4gICAgICAgIGlmIChrZXkgPT09IFwiX192X2lzUmVhY3RpdmVcIiAvKiBJU19SRUFDVElWRSAqLykge1xyXG4gICAgICAgICAgICByZXR1cm4gIWlzUmVhZG9ubHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFkb25seVwiIC8qIElTX1JFQURPTkxZICovKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpc1JlYWRvbmx5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChrZXkgPT09IFwiX192X3Jhd1wiIC8qIFJBVyAqLyAmJlxyXG4gICAgICAgICAgICByZWNlaXZlciA9PT1cclxuICAgICAgICAgICAgICAgIChpc1JlYWRvbmx5XHJcbiAgICAgICAgICAgICAgICAgICAgPyB0YXJnZXRbXCJfX3ZfcmVhZG9ubHlcIiAvKiBSRUFET05MWSAqL11cclxuICAgICAgICAgICAgICAgICAgICA6IHRhcmdldFtcIl9fdl9yZWFjdGl2ZVwiIC8qIFJFQUNUSVZFICovXSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0SXNBcnJheSA9IGlzQXJyYXkodGFyZ2V0KTtcclxuICAgICAgICBpZiAodGFyZ2V0SXNBcnJheSAmJiBoYXNPd24oYXJyYXlJbnN0cnVtZW50YXRpb25zLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldChhcnJheUluc3RydW1lbnRhdGlvbnMsIGtleSwgcmVjZWl2ZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZXMgPSBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xyXG4gICAgICAgIGlmIChpc1N5bWJvbChrZXkpXHJcbiAgICAgICAgICAgID8gYnVpbHRJblN5bWJvbHMuaGFzKGtleSlcclxuICAgICAgICAgICAgOiBrZXkgPT09IGBfX3Byb3RvX19gIHx8IGtleSA9PT0gYF9fdl9pc1JlZmApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFpc1JlYWRvbmx5KSB7XHJcbiAgICAgICAgICAgIHRyYWNrKHRhcmdldCwgXCJnZXRcIiAvKiBHRVQgKi8sIGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzaGFsbG93KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc1JlZihyZXMpKSB7XHJcbiAgICAgICAgICAgIC8vIHJlZiB1bndyYXBwaW5nLCBvbmx5IGZvciBPYmplY3RzLCBub3QgZm9yIEFycmF5cy5cclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldElzQXJyYXkgPyByZXMgOiByZXMudmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc09iamVjdChyZXMpKSB7XHJcbiAgICAgICAgICAgIC8vIENvbnZlcnQgcmV0dXJuZWQgdmFsdWUgaW50byBhIHByb3h5IGFzIHdlbGwuIHdlIGRvIHRoZSBpc09iamVjdCBjaGVja1xyXG4gICAgICAgICAgICAvLyBoZXJlIHRvIGF2b2lkIGludmFsaWQgdmFsdWUgd2FybmluZy4gQWxzbyBuZWVkIHRvIGxhenkgYWNjZXNzIHJlYWRvbmx5XHJcbiAgICAgICAgICAgIC8vIGFuZCByZWFjdGl2ZSBoZXJlIHRvIGF2b2lkIGNpcmN1bGFyIGRlcGVuZGVuY3kuXHJcbiAgICAgICAgICAgIHJldHVybiBpc1JlYWRvbmx5ID8gcmVhZG9ubHkocmVzKSA6IHJlYWN0aXZlKHJlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9O1xyXG59XHJcbmNvbnN0IHNldCA9IC8qI19fUFVSRV9fKi8gY3JlYXRlU2V0dGVyKCk7XHJcbmNvbnN0IHNoYWxsb3dTZXQgPSAvKiNfX1BVUkVfXyovIGNyZWF0ZVNldHRlcih0cnVlKTtcclxuZnVuY3Rpb24gY3JlYXRlU2V0dGVyKHNoYWxsb3cgPSBmYWxzZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKSB7XHJcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0YXJnZXRba2V5XTtcclxuICAgICAgICBpZiAoIXNoYWxsb3cpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICghaXNBcnJheSh0YXJnZXQpICYmIGlzUmVmKG9sZFZhbHVlKSAmJiAhaXNSZWYodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBvbGRWYWx1ZS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaGFkS2V5ID0gaGFzT3duKHRhcmdldCwga2V5KTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKTtcclxuICAgICAgICAvLyBkb24ndCB0cmlnZ2VyIGlmIHRhcmdldCBpcyBzb21ldGhpbmcgdXAgaW4gdGhlIHByb3RvdHlwZSBjaGFpbiBvZiBvcmlnaW5hbFxyXG4gICAgICAgIGlmICh0YXJnZXQgPT09IHRvUmF3KHJlY2VpdmVyKSkge1xyXG4gICAgICAgICAgICBpZiAoIWhhZEtleSkge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIgLyogQUREICovLCBrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChoYXNDaGFuZ2VkKHZhbHVlLCBvbGRWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiIC8qIFNFVCAqLywga2V5LCB2YWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSB7XHJcbiAgICBjb25zdCBoYWRLZXkgPSBoYXNPd24odGFyZ2V0LCBrZXkpO1xyXG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0YXJnZXRba2V5XTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpO1xyXG4gICAgaWYgKHJlc3VsdCAmJiBoYWRLZXkpIHtcclxuICAgICAgICB0cmlnZ2VyKHRhcmdldCwgXCJkZWxldGVcIiAvKiBERUxFVEUgKi8sIGtleSwgdW5kZWZpbmVkLCBvbGRWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmZ1bmN0aW9uIGhhcyh0YXJnZXQsIGtleSkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5oYXModGFyZ2V0LCBrZXkpO1xyXG4gICAgdHJhY2sodGFyZ2V0LCBcImhhc1wiIC8qIEhBUyAqLywga2V5KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gb3duS2V5cyh0YXJnZXQpIHtcclxuICAgIHRyYWNrKHRhcmdldCwgXCJpdGVyYXRlXCIgLyogSVRFUkFURSAqLywgSVRFUkFURV9LRVkpO1xyXG4gICAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xyXG59XHJcbmNvbnN0IG11dGFibGVIYW5kbGVycyA9IHtcclxuICAgIGdldCxcclxuICAgIHNldCxcclxuICAgIGRlbGV0ZVByb3BlcnR5LFxyXG4gICAgaGFzLFxyXG4gICAgb3duS2V5c1xyXG59O1xyXG5jb25zdCByZWFkb25seUhhbmRsZXJzID0ge1xyXG4gICAgZ2V0OiByZWFkb25seUdldCxcclxuICAgIGhhcyxcclxuICAgIG93bktleXMsXHJcbiAgICBzZXQodGFyZ2V0LCBrZXkpIHtcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU2V0IG9wZXJhdGlvbiBvbiBrZXkgXCIke1N0cmluZyhrZXkpfVwiIGZhaWxlZDogdGFyZ2V0IGlzIHJlYWRvbmx5LmAsIHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSB7XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYERlbGV0ZSBvcGVyYXRpb24gb24ga2V5IFwiJHtTdHJpbmcoa2V5KX1cIiBmYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLCB0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufTtcclxuY29uc3Qgc2hhbGxvd1JlYWN0aXZlSGFuZGxlcnMgPSBleHRlbmQoe30sIG11dGFibGVIYW5kbGVycywge1xyXG4gICAgZ2V0OiBzaGFsbG93R2V0LFxyXG4gICAgc2V0OiBzaGFsbG93U2V0XHJcbn0pO1xyXG4vLyBQcm9wcyBoYW5kbGVycyBhcmUgc3BlY2lhbCBpbiB0aGUgc2Vuc2UgdGhhdCBpdCBzaG91bGQgbm90IHVud3JhcCB0b3AtbGV2ZWxcclxuLy8gcmVmcyAoaW4gb3JkZXIgdG8gYWxsb3cgcmVmcyB0byBiZSBleHBsaWNpdGx5IHBhc3NlZCBkb3duKSwgYnV0IHNob3VsZFxyXG4vLyByZXRhaW4gdGhlIHJlYWN0aXZpdHkgb2YgdGhlIG5vcm1hbCByZWFkb25seSBvYmplY3QuXHJcbmNvbnN0IHNoYWxsb3dSZWFkb25seUhhbmRsZXJzID0gZXh0ZW5kKHt9LCByZWFkb25seUhhbmRsZXJzLCB7XHJcbiAgICBnZXQ6IHNoYWxsb3dSZWFkb25seUdldFxyXG59KTtcblxuY29uc3QgdG9SZWFjdGl2ZSA9ICh2YWx1ZSkgPT4gaXNPYmplY3QodmFsdWUpID8gcmVhY3RpdmUodmFsdWUpIDogdmFsdWU7XHJcbmNvbnN0IHRvUmVhZG9ubHkgPSAodmFsdWUpID0+IGlzT2JqZWN0KHZhbHVlKSA/IHJlYWRvbmx5KHZhbHVlKSA6IHZhbHVlO1xyXG5jb25zdCB0b1NoYWxsb3cgPSAodmFsdWUpID0+IHZhbHVlO1xyXG5jb25zdCBnZXRQcm90byA9ICh2KSA9PiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHYpO1xyXG5mdW5jdGlvbiBnZXQkMSh0YXJnZXQsIGtleSwgd3JhcCkge1xyXG4gICAgdGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcclxuICAgIGNvbnN0IHJhd0tleSA9IHRvUmF3KGtleSk7XHJcbiAgICBpZiAoa2V5ICE9PSByYXdLZXkpIHtcclxuICAgICAgICB0cmFjayh0YXJnZXQsIFwiZ2V0XCIgLyogR0VUICovLCBrZXkpO1xyXG4gICAgfVxyXG4gICAgdHJhY2sodGFyZ2V0LCBcImdldFwiIC8qIEdFVCAqLywgcmF3S2V5KTtcclxuICAgIGNvbnN0IHsgaGFzLCBnZXQgfSA9IGdldFByb3RvKHRhcmdldCk7XHJcbiAgICBpZiAoaGFzLmNhbGwodGFyZ2V0LCBrZXkpKSB7XHJcbiAgICAgICAgcmV0dXJuIHdyYXAoZ2V0LmNhbGwodGFyZ2V0LCBrZXkpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhhcy5jYWxsKHRhcmdldCwgcmF3S2V5KSkge1xyXG4gICAgICAgIHJldHVybiB3cmFwKGdldC5jYWxsKHRhcmdldCwgcmF3S2V5KSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaGFzJDEoa2V5KSB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSB0b1Jhdyh0aGlzKTtcclxuICAgIGNvbnN0IHJhd0tleSA9IHRvUmF3KGtleSk7XHJcbiAgICBpZiAoa2V5ICE9PSByYXdLZXkpIHtcclxuICAgICAgICB0cmFjayh0YXJnZXQsIFwiaGFzXCIgLyogSEFTICovLCBrZXkpO1xyXG4gICAgfVxyXG4gICAgdHJhY2sodGFyZ2V0LCBcImhhc1wiIC8qIEhBUyAqLywgcmF3S2V5KTtcclxuICAgIGNvbnN0IGhhcyA9IGdldFByb3RvKHRhcmdldCkuaGFzO1xyXG4gICAgcmV0dXJuIGhhcy5jYWxsKHRhcmdldCwga2V5KSB8fCBoYXMuY2FsbCh0YXJnZXQsIHJhd0tleSk7XHJcbn1cclxuZnVuY3Rpb24gc2l6ZSh0YXJnZXQpIHtcclxuICAgIHRhcmdldCA9IHRvUmF3KHRhcmdldCk7XHJcbiAgICB0cmFjayh0YXJnZXQsIFwiaXRlcmF0ZVwiIC8qIElURVJBVEUgKi8sIElURVJBVEVfS0VZKTtcclxuICAgIHJldHVybiBSZWZsZWN0LmdldChnZXRQcm90byh0YXJnZXQpLCAnc2l6ZScsIHRhcmdldCk7XHJcbn1cclxuZnVuY3Rpb24gYWRkKHZhbHVlKSB7XHJcbiAgICB2YWx1ZSA9IHRvUmF3KHZhbHVlKTtcclxuICAgIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xyXG4gICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byh0YXJnZXQpO1xyXG4gICAgY29uc3QgaGFkS2V5ID0gcHJvdG8uaGFzLmNhbGwodGFyZ2V0LCB2YWx1ZSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBwcm90by5hZGQuY2FsbCh0YXJnZXQsIHZhbHVlKTtcclxuICAgIGlmICghaGFkS2V5KSB7XHJcbiAgICAgICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIgLyogQUREICovLCB2YWx1ZSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5mdW5jdGlvbiBzZXQkMShrZXksIHZhbHVlKSB7XHJcbiAgICB2YWx1ZSA9IHRvUmF3KHZhbHVlKTtcclxuICAgIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xyXG4gICAgY29uc3QgeyBoYXMsIGdldCwgc2V0IH0gPSBnZXRQcm90byh0YXJnZXQpO1xyXG4gICAgbGV0IGhhZEtleSA9IGhhcy5jYWxsKHRhcmdldCwga2V5KTtcclxuICAgIGlmICghaGFkS2V5KSB7XHJcbiAgICAgICAga2V5ID0gdG9SYXcoa2V5KTtcclxuICAgICAgICBoYWRLZXkgPSBoYXMuY2FsbCh0YXJnZXQsIGtleSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhcywga2V5KTtcclxuICAgIH1cclxuICAgIGNvbnN0IG9sZFZhbHVlID0gZ2V0LmNhbGwodGFyZ2V0LCBrZXkpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gc2V0LmNhbGwodGFyZ2V0LCBrZXksIHZhbHVlKTtcclxuICAgIGlmICghaGFkS2V5KSB7XHJcbiAgICAgICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIgLyogQUREICovLCBrZXksIHZhbHVlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhhc0NoYW5nZWQodmFsdWUsIG9sZFZhbHVlKSkge1xyXG4gICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiIC8qIFNFVCAqLywga2V5LCB2YWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5mdW5jdGlvbiBkZWxldGVFbnRyeShrZXkpIHtcclxuICAgIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xyXG4gICAgY29uc3QgeyBoYXMsIGdldCwgZGVsZXRlOiBkZWwgfSA9IGdldFByb3RvKHRhcmdldCk7XHJcbiAgICBsZXQgaGFkS2V5ID0gaGFzLmNhbGwodGFyZ2V0LCBrZXkpO1xyXG4gICAgaWYgKCFoYWRLZXkpIHtcclxuICAgICAgICBrZXkgPSB0b1JhdyhrZXkpO1xyXG4gICAgICAgIGhhZEtleSA9IGhhcy5jYWxsKHRhcmdldCwga2V5KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgIGNoZWNrSWRlbnRpdHlLZXlzKHRhcmdldCwgaGFzLCBrZXkpO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgb2xkVmFsdWUgPSBnZXQgPyBnZXQuY2FsbCh0YXJnZXQsIGtleSkgOiB1bmRlZmluZWQ7XHJcbiAgICAvLyBmb3J3YXJkIHRoZSBvcGVyYXRpb24gYmVmb3JlIHF1ZXVlaW5nIHJlYWN0aW9uc1xyXG4gICAgY29uc3QgcmVzdWx0ID0gZGVsLmNhbGwodGFyZ2V0LCBrZXkpO1xyXG4gICAgaWYgKGhhZEtleSkge1xyXG4gICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcImRlbGV0ZVwiIC8qIERFTEVURSAqLywga2V5LCB1bmRlZmluZWQsIG9sZFZhbHVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSB0b1Jhdyh0aGlzKTtcclxuICAgIGNvbnN0IGhhZEl0ZW1zID0gdGFyZ2V0LnNpemUgIT09IDA7XHJcbiAgICBjb25zdCBvbGRUYXJnZXQgPSAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJylcclxuICAgICAgICA/IHRhcmdldCBpbnN0YW5jZW9mIE1hcFxyXG4gICAgICAgICAgICA/IG5ldyBNYXAodGFyZ2V0KVxyXG4gICAgICAgICAgICA6IG5ldyBTZXQodGFyZ2V0KVxyXG4gICAgICAgIDogdW5kZWZpbmVkO1xyXG4gICAgLy8gZm9yd2FyZCB0aGUgb3BlcmF0aW9uIGJlZm9yZSBxdWV1ZWluZyByZWFjdGlvbnNcclxuICAgIGNvbnN0IHJlc3VsdCA9IGdldFByb3RvKHRhcmdldCkuY2xlYXIuY2FsbCh0YXJnZXQpO1xyXG4gICAgaWYgKGhhZEl0ZW1zKSB7XHJcbiAgICAgICAgdHJpZ2dlcih0YXJnZXQsIFwiY2xlYXJcIiAvKiBDTEVBUiAqLywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG9sZFRhcmdldCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZUZvckVhY2goaXNSZWFkb25seSwgc2hhbGxvdykge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpIHtcclxuICAgICAgICBjb25zdCBvYnNlcnZlZCA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdG9SYXcob2JzZXJ2ZWQpO1xyXG4gICAgICAgIGNvbnN0IHdyYXAgPSBpc1JlYWRvbmx5ID8gdG9SZWFkb25seSA6IHNoYWxsb3cgPyB0b1NoYWxsb3cgOiB0b1JlYWN0aXZlO1xyXG4gICAgICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHRhcmdldCwgXCJpdGVyYXRlXCIgLyogSVRFUkFURSAqLywgSVRFUkFURV9LRVkpO1xyXG4gICAgICAgIC8vIGltcG9ydGFudDogY3JlYXRlIHN1cmUgdGhlIGNhbGxiYWNrIGlzXHJcbiAgICAgICAgLy8gMS4gaW52b2tlZCB3aXRoIHRoZSByZWFjdGl2ZSBtYXAgYXMgYHRoaXNgIGFuZCAzcmQgYXJnXHJcbiAgICAgICAgLy8gMi4gdGhlIHZhbHVlIHJlY2VpdmVkIHNob3VsZCBiZSBhIGNvcnJlc3BvbmRpbmcgcmVhY3RpdmUvcmVhZG9ubHkuXHJcbiAgICAgICAgZnVuY3Rpb24gd3JhcHBlZENhbGxiYWNrKHZhbHVlLCBrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgd3JhcCh2YWx1ZSksIHdyYXAoa2V5KSwgb2JzZXJ2ZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ2V0UHJvdG8odGFyZ2V0KS5mb3JFYWNoLmNhbGwodGFyZ2V0LCB3cmFwcGVkQ2FsbGJhY2spO1xyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIGlzUmVhZG9ubHksIHNoYWxsb3cpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xyXG4gICAgICAgIGNvbnN0IGlzTWFwID0gdGFyZ2V0IGluc3RhbmNlb2YgTWFwO1xyXG4gICAgICAgIGNvbnN0IGlzUGFpciA9IG1ldGhvZCA9PT0gJ2VudHJpZXMnIHx8IChtZXRob2QgPT09IFN5bWJvbC5pdGVyYXRvciAmJiBpc01hcCk7XHJcbiAgICAgICAgY29uc3QgaXNLZXlPbmx5ID0gbWV0aG9kID09PSAna2V5cycgJiYgaXNNYXA7XHJcbiAgICAgICAgY29uc3QgaW5uZXJJdGVyYXRvciA9IGdldFByb3RvKHRhcmdldClbbWV0aG9kXS5hcHBseSh0YXJnZXQsIGFyZ3MpO1xyXG4gICAgICAgIGNvbnN0IHdyYXAgPSBpc1JlYWRvbmx5ID8gdG9SZWFkb25seSA6IHNoYWxsb3cgPyB0b1NoYWxsb3cgOiB0b1JlYWN0aXZlO1xyXG4gICAgICAgICFpc1JlYWRvbmx5ICYmXHJcbiAgICAgICAgICAgIHRyYWNrKHRhcmdldCwgXCJpdGVyYXRlXCIgLyogSVRFUkFURSAqLywgaXNLZXlPbmx5ID8gTUFQX0tFWV9JVEVSQVRFX0tFWSA6IElURVJBVEVfS0VZKTtcclxuICAgICAgICAvLyByZXR1cm4gYSB3cmFwcGVkIGl0ZXJhdG9yIHdoaWNoIHJldHVybnMgb2JzZXJ2ZWQgdmVyc2lvbnMgb2YgdGhlXHJcbiAgICAgICAgLy8gdmFsdWVzIGVtaXR0ZWQgZnJvbSB0aGUgcmVhbCBpdGVyYXRvclxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC8vIGl0ZXJhdG9yIHByb3RvY29sXHJcbiAgICAgICAgICAgIG5leHQoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IHZhbHVlLCBkb25lIH0gPSBpbm5lckl0ZXJhdG9yLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkb25lXHJcbiAgICAgICAgICAgICAgICAgICAgPyB7IHZhbHVlLCBkb25lIH1cclxuICAgICAgICAgICAgICAgICAgICA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGlzUGFpciA/IFt3cmFwKHZhbHVlWzBdKSwgd3JhcCh2YWx1ZVsxXSldIDogd3JhcCh2YWx1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBpdGVyYWJsZSBwcm90b2NvbFxyXG4gICAgICAgICAgICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlUmVhZG9ubHlNZXRob2QodHlwZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBhcmdzWzBdID8gYG9uIGtleSBcIiR7YXJnc1swXX1cIiBgIDogYGA7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHtjYXBpdGFsaXplKHR5cGUpfSBvcGVyYXRpb24gJHtrZXl9ZmFpbGVkOiB0YXJnZXQgaXMgcmVhZG9ubHkuYCwgdG9SYXcodGhpcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHlwZSA9PT0gXCJkZWxldGVcIiAvKiBERUxFVEUgKi8gPyBmYWxzZSA6IHRoaXM7XHJcbiAgICB9O1xyXG59XHJcbmNvbnN0IG11dGFibGVJbnN0cnVtZW50YXRpb25zID0ge1xyXG4gICAgZ2V0KGtleSkge1xyXG4gICAgICAgIHJldHVybiBnZXQkMSh0aGlzLCBrZXksIHRvUmVhY3RpdmUpO1xyXG4gICAgfSxcclxuICAgIGdldCBzaXplKCkge1xyXG4gICAgICAgIHJldHVybiBzaXplKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIGhhczogaGFzJDEsXHJcbiAgICBhZGQsXHJcbiAgICBzZXQ6IHNldCQxLFxyXG4gICAgZGVsZXRlOiBkZWxldGVFbnRyeSxcclxuICAgIGNsZWFyLFxyXG4gICAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaChmYWxzZSwgZmFsc2UpXHJcbn07XHJcbmNvbnN0IHNoYWxsb3dJbnN0cnVtZW50YXRpb25zID0ge1xyXG4gICAgZ2V0KGtleSkge1xyXG4gICAgICAgIHJldHVybiBnZXQkMSh0aGlzLCBrZXksIHRvU2hhbGxvdyk7XHJcbiAgICB9LFxyXG4gICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHNpemUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgaGFzOiBoYXMkMSxcclxuICAgIGFkZCxcclxuICAgIHNldDogc2V0JDEsXHJcbiAgICBkZWxldGU6IGRlbGV0ZUVudHJ5LFxyXG4gICAgY2xlYXIsXHJcbiAgICBmb3JFYWNoOiBjcmVhdGVGb3JFYWNoKGZhbHNlLCB0cnVlKVxyXG59O1xyXG5jb25zdCByZWFkb25seUluc3RydW1lbnRhdGlvbnMgPSB7XHJcbiAgICBnZXQoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIGdldCQxKHRoaXMsIGtleSwgdG9SZWFkb25seSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHNpemUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgaGFzOiBoYXMkMSxcclxuICAgIGFkZDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXCJhZGRcIiAvKiBBREQgKi8pLFxyXG4gICAgc2V0OiBjcmVhdGVSZWFkb25seU1ldGhvZChcInNldFwiIC8qIFNFVCAqLyksXHJcbiAgICBkZWxldGU6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwiZGVsZXRlXCIgLyogREVMRVRFICovKSxcclxuICAgIGNsZWFyOiBjcmVhdGVSZWFkb25seU1ldGhvZChcImNsZWFyXCIgLyogQ0xFQVIgKi8pLFxyXG4gICAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaCh0cnVlLCBmYWxzZSlcclxufTtcclxuY29uc3QgaXRlcmF0b3JNZXRob2RzID0gWydrZXlzJywgJ3ZhbHVlcycsICdlbnRyaWVzJywgU3ltYm9sLml0ZXJhdG9yXTtcclxuaXRlcmF0b3JNZXRob2RzLmZvckVhY2gobWV0aG9kID0+IHtcclxuICAgIG11dGFibGVJbnN0cnVtZW50YXRpb25zW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICByZWFkb25seUluc3RydW1lbnRhdGlvbnNbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgc2hhbGxvd0luc3RydW1lbnRhdGlvbnNbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgZmFsc2UsIHRydWUpO1xyXG59KTtcclxuZnVuY3Rpb24gY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKGlzUmVhZG9ubHksIHNoYWxsb3cpIHtcclxuICAgIGNvbnN0IGluc3RydW1lbnRhdGlvbnMgPSBzaGFsbG93XHJcbiAgICAgICAgPyBzaGFsbG93SW5zdHJ1bWVudGF0aW9uc1xyXG4gICAgICAgIDogaXNSZWFkb25seVxyXG4gICAgICAgICAgICA/IHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9uc1xyXG4gICAgICAgICAgICA6IG11dGFibGVJbnN0cnVtZW50YXRpb25zO1xyXG4gICAgcmV0dXJuICh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpID0+IHtcclxuICAgICAgICBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWN0aXZlXCIgLyogSVNfUkVBQ1RJVkUgKi8pIHtcclxuICAgICAgICAgICAgcmV0dXJuICFpc1JlYWRvbmx5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChrZXkgPT09IFwiX192X2lzUmVhZG9ubHlcIiAvKiBJU19SRUFET05MWSAqLykge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNSZWFkb25seTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9yYXdcIiAvKiBSQVcgKi8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KGhhc093bihpbnN0cnVtZW50YXRpb25zLCBrZXkpICYmIGtleSBpbiB0YXJnZXRcclxuICAgICAgICAgICAgPyBpbnN0cnVtZW50YXRpb25zXHJcbiAgICAgICAgICAgIDogdGFyZ2V0LCBrZXksIHJlY2VpdmVyKTtcclxuICAgIH07XHJcbn1cclxuY29uc3QgbXV0YWJsZUNvbGxlY3Rpb25IYW5kbGVycyA9IHtcclxuICAgIGdldDogY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKGZhbHNlLCBmYWxzZSlcclxufTtcclxuY29uc3Qgc2hhbGxvd0NvbGxlY3Rpb25IYW5kbGVycyA9IHtcclxuICAgIGdldDogY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKGZhbHNlLCB0cnVlKVxyXG59O1xyXG5jb25zdCByZWFkb25seUNvbGxlY3Rpb25IYW5kbGVycyA9IHtcclxuICAgIGdldDogY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKHRydWUsIGZhbHNlKVxyXG59O1xyXG5mdW5jdGlvbiBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhcywga2V5KSB7XHJcbiAgICBjb25zdCByYXdLZXkgPSB0b1JhdyhrZXkpO1xyXG4gICAgaWYgKHJhd0tleSAhPT0ga2V5ICYmIGhhcy5jYWxsKHRhcmdldCwgcmF3S2V5KSkge1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSB0b1Jhd1R5cGUodGFyZ2V0KTtcclxuICAgICAgICBjb25zb2xlLndhcm4oYFJlYWN0aXZlICR7dHlwZX0gY29udGFpbnMgYm90aCB0aGUgcmF3IGFuZCByZWFjdGl2ZSBgICtcclxuICAgICAgICAgICAgYHZlcnNpb25zIG9mIHRoZSBzYW1lIG9iamVjdCR7dHlwZSA9PT0gYE1hcGAgPyBgYXMga2V5c2AgOiBgYH0sIGAgK1xyXG4gICAgICAgICAgICBgd2hpY2ggY2FuIGxlYWQgdG8gaW5jb25zaXN0ZW5jaWVzLiBgICtcclxuICAgICAgICAgICAgYEF2b2lkIGRpZmZlcmVudGlhdGluZyBiZXR3ZWVuIHRoZSByYXcgYW5kIHJlYWN0aXZlIHZlcnNpb25zIGAgK1xyXG4gICAgICAgICAgICBgb2YgYW4gb2JqZWN0IGFuZCBvbmx5IHVzZSB0aGUgcmVhY3RpdmUgdmVyc2lvbiBpZiBwb3NzaWJsZS5gKTtcclxuICAgIH1cclxufVxuXG5jb25zdCBjb2xsZWN0aW9uVHlwZXMgPSBuZXcgU2V0KFtTZXQsIE1hcCwgV2Vha01hcCwgV2Vha1NldF0pO1xyXG5jb25zdCBpc09ic2VydmFibGVUeXBlID0gLyojX19QVVJFX18qLyBtYWtlTWFwKCdPYmplY3QsQXJyYXksTWFwLFNldCxXZWFrTWFwLFdlYWtTZXQnKTtcclxuY29uc3QgY2FuT2JzZXJ2ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gICAgcmV0dXJuICghdmFsdWVbXCJfX3Zfc2tpcFwiIC8qIFNLSVAgKi9dICYmXHJcbiAgICAgICAgaXNPYnNlcnZhYmxlVHlwZSh0b1Jhd1R5cGUodmFsdWUpKSAmJlxyXG4gICAgICAgICFPYmplY3QuaXNGcm96ZW4odmFsdWUpKTtcclxufTtcclxuZnVuY3Rpb24gcmVhY3RpdmUodGFyZ2V0KSB7XHJcbiAgICAvLyBpZiB0cnlpbmcgdG8gb2JzZXJ2ZSBhIHJlYWRvbmx5IHByb3h5LCByZXR1cm4gdGhlIHJlYWRvbmx5IHZlcnNpb24uXHJcbiAgICBpZiAodGFyZ2V0ICYmIHRhcmdldFtcIl9fdl9pc1JlYWRvbmx5XCIgLyogSVNfUkVBRE9OTFkgKi9dKSB7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH1cclxuICAgIHJldHVybiBjcmVhdGVSZWFjdGl2ZU9iamVjdCh0YXJnZXQsIGZhbHNlLCBtdXRhYmxlSGFuZGxlcnMsIG11dGFibGVDb2xsZWN0aW9uSGFuZGxlcnMpO1xyXG59XHJcbi8vIFJldHVybiBhIHJlYWN0aXZlLWNvcHkgb2YgdGhlIG9yaWdpbmFsIG9iamVjdCwgd2hlcmUgb25seSB0aGUgcm9vdCBsZXZlbFxyXG4vLyBwcm9wZXJ0aWVzIGFyZSByZWFjdGl2ZSwgYW5kIGRvZXMgTk9UIHVud3JhcCByZWZzIG5vciByZWN1cnNpdmVseSBjb252ZXJ0XHJcbi8vIHJldHVybmVkIHByb3BlcnRpZXMuXHJcbmZ1bmN0aW9uIHNoYWxsb3dSZWFjdGl2ZSh0YXJnZXQpIHtcclxuICAgIHJldHVybiBjcmVhdGVSZWFjdGl2ZU9iamVjdCh0YXJnZXQsIGZhbHNlLCBzaGFsbG93UmVhY3RpdmVIYW5kbGVycywgc2hhbGxvd0NvbGxlY3Rpb25IYW5kbGVycyk7XHJcbn1cclxuZnVuY3Rpb24gcmVhZG9ubHkodGFyZ2V0KSB7XHJcbiAgICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCB0cnVlLCByZWFkb25seUhhbmRsZXJzLCByZWFkb25seUNvbGxlY3Rpb25IYW5kbGVycyk7XHJcbn1cclxuLy8gUmV0dXJuIGEgcmVhY3RpdmUtY29weSBvZiB0aGUgb3JpZ2luYWwgb2JqZWN0LCB3aGVyZSBvbmx5IHRoZSByb290IGxldmVsXHJcbi8vIHByb3BlcnRpZXMgYXJlIHJlYWRvbmx5LCBhbmQgZG9lcyBOT1QgdW53cmFwIHJlZnMgbm9yIHJlY3Vyc2l2ZWx5IGNvbnZlcnRcclxuLy8gcmV0dXJuZWQgcHJvcGVydGllcy5cclxuLy8gVGhpcyBpcyB1c2VkIGZvciBjcmVhdGluZyB0aGUgcHJvcHMgcHJveHkgb2JqZWN0IGZvciBzdGF0ZWZ1bCBjb21wb25lbnRzLlxyXG5mdW5jdGlvbiBzaGFsbG93UmVhZG9ubHkodGFyZ2V0KSB7XHJcbiAgICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCB0cnVlLCBzaGFsbG93UmVhZG9ubHlIYW5kbGVycywgcmVhZG9ubHlDb2xsZWN0aW9uSGFuZGxlcnMpO1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZVJlYWN0aXZlT2JqZWN0KHRhcmdldCwgaXNSZWFkb25seSwgYmFzZUhhbmRsZXJzLCBjb2xsZWN0aW9uSGFuZGxlcnMpIHtcclxuICAgIGlmICghaXNPYmplY3QodGFyZ2V0KSkge1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGB2YWx1ZSBjYW5ub3QgYmUgbWFkZSByZWFjdGl2ZTogJHtTdHJpbmcodGFyZ2V0KX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH1cclxuICAgIC8vIHRhcmdldCBpcyBhbHJlYWR5IGEgUHJveHksIHJldHVybiBpdC5cclxuICAgIC8vIGV4Y2VwdGlvbjogY2FsbGluZyByZWFkb25seSgpIG9uIGEgcmVhY3RpdmUgb2JqZWN0XHJcbiAgICBpZiAodGFyZ2V0W1wiX192X3Jhd1wiIC8qIFJBVyAqL10gJiZcclxuICAgICAgICAhKGlzUmVhZG9ubHkgJiYgdGFyZ2V0W1wiX192X2lzUmVhY3RpdmVcIiAvKiBJU19SRUFDVElWRSAqL10pKSB7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH1cclxuICAgIC8vIHRhcmdldCBhbHJlYWR5IGhhcyBjb3JyZXNwb25kaW5nIFByb3h5XHJcbiAgICBpZiAoaGFzT3duKHRhcmdldCwgaXNSZWFkb25seSA/IFwiX192X3JlYWRvbmx5XCIgLyogUkVBRE9OTFkgKi8gOiBcIl9fdl9yZWFjdGl2ZVwiIC8qIFJFQUNUSVZFICovKSkge1xyXG4gICAgICAgIHJldHVybiBpc1JlYWRvbmx5XHJcbiAgICAgICAgICAgID8gdGFyZ2V0W1wiX192X3JlYWRvbmx5XCIgLyogUkVBRE9OTFkgKi9dXHJcbiAgICAgICAgICAgIDogdGFyZ2V0W1wiX192X3JlYWN0aXZlXCIgLyogUkVBQ1RJVkUgKi9dO1xyXG4gICAgfVxyXG4gICAgLy8gb25seSBhIHdoaXRlbGlzdCBvZiB2YWx1ZSB0eXBlcyBjYW4gYmUgb2JzZXJ2ZWQuXHJcbiAgICBpZiAoIWNhbk9ic2VydmUodGFyZ2V0KSkge1xyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCBvYnNlcnZlZCA9IG5ldyBQcm94eSh0YXJnZXQsIGNvbGxlY3Rpb25UeXBlcy5oYXModGFyZ2V0LmNvbnN0cnVjdG9yKSA/IGNvbGxlY3Rpb25IYW5kbGVycyA6IGJhc2VIYW5kbGVycyk7XHJcbiAgICBkZWYodGFyZ2V0LCBpc1JlYWRvbmx5ID8gXCJfX3ZfcmVhZG9ubHlcIiAvKiBSRUFET05MWSAqLyA6IFwiX192X3JlYWN0aXZlXCIgLyogUkVBQ1RJVkUgKi8sIG9ic2VydmVkKTtcclxuICAgIHJldHVybiBvYnNlcnZlZDtcclxufVxyXG5mdW5jdGlvbiBpc1JlYWN0aXZlKHZhbHVlKSB7XHJcbiAgICBpZiAoaXNSZWFkb25seSh2YWx1ZSkpIHtcclxuICAgICAgICByZXR1cm4gaXNSZWFjdGl2ZSh2YWx1ZVtcIl9fdl9yYXdcIiAvKiBSQVcgKi9dKTtcclxuICAgIH1cclxuICAgIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZVtcIl9fdl9pc1JlYWN0aXZlXCIgLyogSVNfUkVBQ1RJVkUgKi9dKTtcclxufVxyXG5mdW5jdGlvbiBpc1JlYWRvbmx5KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWVbXCJfX3ZfaXNSZWFkb25seVwiIC8qIElTX1JFQURPTkxZICovXSk7XHJcbn1cclxuZnVuY3Rpb24gaXNQcm94eSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGlzUmVhY3RpdmUodmFsdWUpIHx8IGlzUmVhZG9ubHkodmFsdWUpO1xyXG59XHJcbmZ1bmN0aW9uIHRvUmF3KG9ic2VydmVkKSB7XHJcbiAgICByZXR1cm4gKChvYnNlcnZlZCAmJiB0b1JhdyhvYnNlcnZlZFtcIl9fdl9yYXdcIiAvKiBSQVcgKi9dKSkgfHwgb2JzZXJ2ZWQpO1xyXG59XHJcbmZ1bmN0aW9uIG1hcmtSYXcodmFsdWUpIHtcclxuICAgIGRlZih2YWx1ZSwgXCJfX3Zfc2tpcFwiIC8qIFNLSVAgKi8sIHRydWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XG5cbmNvbnN0IGNvbnZlcnQgPSAodmFsKSA9PiBpc09iamVjdCh2YWwpID8gcmVhY3RpdmUodmFsKSA6IHZhbDtcclxuZnVuY3Rpb24gaXNSZWYocikge1xyXG4gICAgcmV0dXJuIHIgPyByLl9fdl9pc1JlZiA9PT0gdHJ1ZSA6IGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIHJlZih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGNyZWF0ZVJlZih2YWx1ZSk7XHJcbn1cclxuZnVuY3Rpb24gc2hhbGxvd1JlZih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGNyZWF0ZVJlZih2YWx1ZSwgdHJ1ZSk7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlUmVmKHJhd1ZhbHVlLCBzaGFsbG93ID0gZmFsc2UpIHtcclxuICAgIGlmIChpc1JlZihyYXdWYWx1ZSkpIHtcclxuICAgICAgICByZXR1cm4gcmF3VmFsdWU7XHJcbiAgICB9XHJcbiAgICBsZXQgdmFsdWUgPSBzaGFsbG93ID8gcmF3VmFsdWUgOiBjb252ZXJ0KHJhd1ZhbHVlKTtcclxuICAgIGNvbnN0IHIgPSB7XHJcbiAgICAgICAgX192X2lzUmVmOiB0cnVlLFxyXG4gICAgICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICAgICAgdHJhY2sociwgXCJnZXRcIiAvKiBHRVQgKi8sICd2YWx1ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQgdmFsdWUobmV3VmFsKSB7XHJcbiAgICAgICAgICAgIGlmIChoYXNDaGFuZ2VkKHRvUmF3KG5ld1ZhbCksIHJhd1ZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmF3VmFsdWUgPSBuZXdWYWw7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHNoYWxsb3cgPyBuZXdWYWwgOiBjb252ZXJ0KG5ld1ZhbCk7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyKHIsIFwic2V0XCIgLyogU0VUICovLCAndmFsdWUnLCAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgPyB7IG5ld1ZhbHVlOiBuZXdWYWwgfSA6IHZvaWQgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuZnVuY3Rpb24gdHJpZ2dlclJlZihyZWYpIHtcclxuICAgIHRyaWdnZXIocmVmLCBcInNldFwiIC8qIFNFVCAqLywgJ3ZhbHVlJywgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpID8geyBuZXdWYWx1ZTogcmVmLnZhbHVlIH0gOiB2b2lkIDApO1xyXG59XHJcbmZ1bmN0aW9uIHVucmVmKHJlZikge1xyXG4gICAgcmV0dXJuIGlzUmVmKHJlZikgPyByZWYudmFsdWUgOiByZWY7XHJcbn1cclxuZnVuY3Rpb24gY3VzdG9tUmVmKGZhY3RvcnkpIHtcclxuICAgIGNvbnN0IHsgZ2V0LCBzZXQgfSA9IGZhY3RvcnkoKCkgPT4gdHJhY2sociwgXCJnZXRcIiAvKiBHRVQgKi8sICd2YWx1ZScpLCAoKSA9PiB0cmlnZ2VyKHIsIFwic2V0XCIgLyogU0VUICovLCAndmFsdWUnKSk7XHJcbiAgICBjb25zdCByID0ge1xyXG4gICAgICAgIF9fdl9pc1JlZjogdHJ1ZSxcclxuICAgICAgICBnZXQgdmFsdWUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldCB2YWx1ZSh2KSB7XHJcbiAgICAgICAgICAgIHNldCh2KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuZnVuY3Rpb24gdG9SZWZzKG9iamVjdCkge1xyXG4gICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiAhaXNQcm94eShvYmplY3QpKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGB0b1JlZnMoKSBleHBlY3RzIGEgcmVhY3RpdmUgb2JqZWN0IGJ1dCByZWNlaXZlZCBhIHBsYWluIG9uZS5gKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJldCA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XHJcbiAgICAgICAgcmV0W2tleV0gPSB0b1JlZihvYmplY3QsIGtleSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0O1xyXG59XHJcbmZ1bmN0aW9uIHRvUmVmKG9iamVjdCwga2V5KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIF9fdl9pc1JlZjogdHJ1ZSxcclxuICAgICAgICBnZXQgdmFsdWUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmplY3Rba2V5XTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldCB2YWx1ZShuZXdWYWwpIHtcclxuICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBuZXdWYWw7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxuXG5mdW5jdGlvbiBjb21wdXRlZChnZXR0ZXJPck9wdGlvbnMpIHtcclxuICAgIGxldCBnZXR0ZXI7XHJcbiAgICBsZXQgc2V0dGVyO1xyXG4gICAgaWYgKGlzRnVuY3Rpb24oZ2V0dGVyT3JPcHRpb25zKSkge1xyXG4gICAgICAgIGdldHRlciA9IGdldHRlck9yT3B0aW9ucztcclxuICAgICAgICBzZXR0ZXIgPSAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJylcclxuICAgICAgICAgICAgPyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1dyaXRlIG9wZXJhdGlvbiBmYWlsZWQ6IGNvbXB1dGVkIHZhbHVlIGlzIHJlYWRvbmx5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgOiBOT09QO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZ2V0dGVyID0gZ2V0dGVyT3JPcHRpb25zLmdldDtcclxuICAgICAgICBzZXR0ZXIgPSBnZXR0ZXJPck9wdGlvbnMuc2V0O1xyXG4gICAgfVxyXG4gICAgbGV0IGRpcnR5ID0gdHJ1ZTtcclxuICAgIGxldCB2YWx1ZTtcclxuICAgIGxldCBjb21wdXRlZDtcclxuICAgIGNvbnN0IHJ1bm5lciA9IGVmZmVjdChnZXR0ZXIsIHtcclxuICAgICAgICBsYXp5OiB0cnVlLFxyXG4gICAgICAgIHNjaGVkdWxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWRpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBkaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyKGNvbXB1dGVkLCBcInNldFwiIC8qIFNFVCAqLywgJ3ZhbHVlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbXB1dGVkID0ge1xyXG4gICAgICAgIF9fdl9pc1JlZjogdHJ1ZSxcclxuICAgICAgICAvLyBleHBvc2UgZWZmZWN0IHNvIGNvbXB1dGVkIGNhbiBiZSBzdG9wcGVkXHJcbiAgICAgICAgZWZmZWN0OiBydW5uZXIsXHJcbiAgICAgICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgICAgICBpZiAoZGlydHkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gcnVubmVyKCk7XHJcbiAgICAgICAgICAgICAgICBkaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyYWNrKGNvbXB1dGVkLCBcImdldFwiIC8qIEdFVCAqLywgJ3ZhbHVlJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldCB2YWx1ZShuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBzZXR0ZXIobmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gY29tcHV0ZWQ7XHJcbn1cblxuZXhwb3J0IHsgSVRFUkFURV9LRVksIGNvbXB1dGVkLCBjdXN0b21SZWYsIGVmZmVjdCwgZW5hYmxlVHJhY2tpbmcsIGlzUHJveHksIGlzUmVhY3RpdmUsIGlzUmVhZG9ubHksIGlzUmVmLCBtYXJrUmF3LCBwYXVzZVRyYWNraW5nLCByZWFjdGl2ZSwgcmVhZG9ubHksIHJlZiwgcmVzZXRUcmFja2luZywgc2hhbGxvd1JlYWN0aXZlLCBzaGFsbG93UmVhZG9ubHksIHNoYWxsb3dSZWYsIHN0b3AsIHRvUmF3LCB0b1JlZiwgdG9SZWZzLCB0cmFjaywgdHJpZ2dlciwgdHJpZ2dlclJlZiwgdW5yZWYgfTtcbiIsImltcG9ydCB7IHBhdXNlVHJhY2tpbmcsIHJlc2V0VHJhY2tpbmcsIGlzUmVmLCB0b1JhdywgaXNQcm94eSwgc2hhbGxvd1JlYWN0aXZlLCB0cmlnZ2VyLCBlZmZlY3QsIHN0b3AsIGlzUmVhY3RpdmUsIHJlYWN0aXZlLCBzaGFsbG93UmVhZG9ubHksIHRyYWNrLCBjb21wdXRlZCBhcyBjb21wdXRlZCQxLCByZWYgfSBmcm9tICdAdnVlL3JlYWN0aXZpdHknO1xuZXhwb3J0IHsgY3VzdG9tUmVmLCBpc1Byb3h5LCBpc1JlYWN0aXZlLCBpc1JlYWRvbmx5LCBpc1JlZiwgbWFya1JhdywgcmVhY3RpdmUsIHJlYWRvbmx5LCByZWYsIHNoYWxsb3dSZWFjdGl2ZSwgc2hhbGxvd1JlYWRvbmx5LCBzaGFsbG93UmVmLCB0b1JhdywgdG9SZWYsIHRvUmVmcywgdHJpZ2dlclJlZiwgdW5yZWYgfSBmcm9tICdAdnVlL3JlYWN0aXZpdHknO1xuaW1wb3J0IHsgaXNTdHJpbmcsIGlzRnVuY3Rpb24sIGlzUHJvbWlzZSwgaXNBcnJheSwgZXh0ZW5kLCBpc09uLCBjYW1lbGl6ZSwgY2FwaXRhbGl6ZSwgRU1QVFlfQVJSLCBub3JtYWxpemVDbGFzcywgaXNPYmplY3QsIG5vcm1hbGl6ZVN0eWxlLCBFTVBUWV9PQkosIGh5cGhlbmF0ZSwgaGFzT3duLCBkZWYsIGlzUmVzZXJ2ZWRQcm9wLCB0b1Jhd1R5cGUsIG1ha2VNYXAsIHJlbW92ZSwgaW52b2tlQXJyYXlGbnMsIE5PLCBOT09QLCBoYXNDaGFuZ2VkLCBpc0dsb2JhbGx5V2hpdGVsaXN0ZWQgfSBmcm9tICdAdnVlL3NoYXJlZCc7XG5leHBvcnQgeyBjYW1lbGl6ZSwgY2FwaXRhbGl6ZSwgdG9EaXNwbGF5U3RyaW5nIH0gZnJvbSAnQHZ1ZS9zaGFyZWQnO1xuXG5jb25zdCBzdGFjayA9IFtdO1xyXG5mdW5jdGlvbiBwdXNoV2FybmluZ0NvbnRleHQodm5vZGUpIHtcclxuICAgIHN0YWNrLnB1c2godm5vZGUpO1xyXG59XHJcbmZ1bmN0aW9uIHBvcFdhcm5pbmdDb250ZXh0KCkge1xyXG4gICAgc3RhY2sucG9wKCk7XHJcbn1cclxuZnVuY3Rpb24gd2Fybihtc2csIC4uLmFyZ3MpIHtcclxuICAgIC8vIGF2b2lkIHByb3BzIGZvcm1hdHRpbmcgb3Igd2FybiBoYW5kbGVyIHRyYWNraW5nIGRlcHMgdGhhdCBtaWdodCBiZSBtdXRhdGVkXHJcbiAgICAvLyBkdXJpbmcgcGF0Y2gsIGxlYWRpbmcgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxyXG4gICAgcGF1c2VUcmFja2luZygpO1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSBzdGFjay5sZW5ndGggPyBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5jb21wb25lbnQgOiBudWxsO1xyXG4gICAgY29uc3QgYXBwV2FybkhhbmRsZXIgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5hcHBDb250ZXh0LmNvbmZpZy53YXJuSGFuZGxlcjtcclxuICAgIGNvbnN0IHRyYWNlID0gZ2V0Q29tcG9uZW50VHJhY2UoKTtcclxuICAgIGlmIChhcHBXYXJuSGFuZGxlcikge1xyXG4gICAgICAgIGNhbGxXaXRoRXJyb3JIYW5kbGluZyhhcHBXYXJuSGFuZGxlciwgaW5zdGFuY2UsIDExIC8qIEFQUF9XQVJOX0hBTkRMRVIgKi8sIFtcclxuICAgICAgICAgICAgbXNnICsgYXJncy5qb2luKCcnKSxcclxuICAgICAgICAgICAgaW5zdGFuY2UgJiYgaW5zdGFuY2UucHJveHksXHJcbiAgICAgICAgICAgIHRyYWNlXHJcbiAgICAgICAgICAgICAgICAubWFwKCh7IHZub2RlIH0pID0+IGBhdCA8JHtmb3JtYXRDb21wb25lbnROYW1lKGluc3RhbmNlLCB2bm9kZS50eXBlKX0+YClcclxuICAgICAgICAgICAgICAgIC5qb2luKCdcXG4nKSxcclxuICAgICAgICAgICAgdHJhY2VcclxuICAgICAgICBdKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHdhcm5BcmdzID0gW2BbVnVlIHdhcm5dOiAke21zZ31gLCAuLi5hcmdzXTtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICBpZiAodHJhY2UubGVuZ3RoICYmXHJcbiAgICAgICAgICAgIC8vIGF2b2lkIHNwYW1taW5nIGNvbnNvbGUgZHVyaW5nIHRlc3RzXHJcbiAgICAgICAgICAgICFmYWxzZSkge1xyXG4gICAgICAgICAgICB3YXJuQXJncy5wdXNoKGBcXG5gLCAuLi5mb3JtYXRUcmFjZSh0cmFjZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLndhcm4oLi4ud2FybkFyZ3MpO1xyXG4gICAgfVxyXG4gICAgcmVzZXRUcmFja2luZygpO1xyXG59XHJcbmZ1bmN0aW9uIGdldENvbXBvbmVudFRyYWNlKCkge1xyXG4gICAgbGV0IGN1cnJlbnRWTm9kZSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xyXG4gICAgaWYgKCFjdXJyZW50Vk5vZGUpIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcbiAgICAvLyB3ZSBjYW4ndCBqdXN0IHVzZSB0aGUgc3RhY2sgYmVjYXVzZSBpdCB3aWxsIGJlIGluY29tcGxldGUgZHVyaW5nIHVwZGF0ZXNcclxuICAgIC8vIHRoYXQgZGlkIG5vdCBzdGFydCBmcm9tIHRoZSByb290LiBSZS1jb25zdHJ1Y3QgdGhlIHBhcmVudCBjaGFpbiB1c2luZ1xyXG4gICAgLy8gaW5zdGFuY2UgcGFyZW50IHBvaW50ZXJzLlxyXG4gICAgY29uc3Qgbm9ybWFsaXplZFN0YWNrID0gW107XHJcbiAgICB3aGlsZSAoY3VycmVudFZOb2RlKSB7XHJcbiAgICAgICAgY29uc3QgbGFzdCA9IG5vcm1hbGl6ZWRTdGFja1swXTtcclxuICAgICAgICBpZiAobGFzdCAmJiBsYXN0LnZub2RlID09PSBjdXJyZW50Vk5vZGUpIHtcclxuICAgICAgICAgICAgbGFzdC5yZWN1cnNlQ291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRTdGFjay5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHZub2RlOiBjdXJyZW50Vk5vZGUsXHJcbiAgICAgICAgICAgICAgICByZWN1cnNlQ291bnQ6IDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhcmVudEluc3RhbmNlID0gY3VycmVudFZOb2RlLmNvbXBvbmVudCAmJiBjdXJyZW50Vk5vZGUuY29tcG9uZW50LnBhcmVudDtcclxuICAgICAgICBjdXJyZW50Vk5vZGUgPSBwYXJlbnRJbnN0YW5jZSAmJiBwYXJlbnRJbnN0YW5jZS52bm9kZTtcclxuICAgIH1cclxuICAgIHJldHVybiBub3JtYWxpemVkU3RhY2s7XHJcbn1cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuZnVuY3Rpb24gZm9ybWF0VHJhY2UodHJhY2UpIHtcclxuICAgIGNvbnN0IGxvZ3MgPSBbXTtcclxuICAgIHRyYWNlLmZvckVhY2goKGVudHJ5LCBpKSA9PiB7XHJcbiAgICAgICAgbG9ncy5wdXNoKC4uLihpID09PSAwID8gW10gOiBbYFxcbmBdKSwgLi4uZm9ybWF0VHJhY2VFbnRyeShlbnRyeSkpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gbG9ncztcclxufVxyXG5mdW5jdGlvbiBmb3JtYXRUcmFjZUVudHJ5KHsgdm5vZGUsIHJlY3Vyc2VDb3VudCB9KSB7XHJcbiAgICBjb25zdCBwb3N0Zml4ID0gcmVjdXJzZUNvdW50ID4gMCA/IGAuLi4gKCR7cmVjdXJzZUNvdW50fSByZWN1cnNpdmUgY2FsbHMpYCA6IGBgO1xyXG4gICAgY29uc3QgaXNSb290ID0gdm5vZGUuY29tcG9uZW50ID8gdm5vZGUuY29tcG9uZW50LnBhcmVudCA9PSBudWxsIDogZmFsc2U7XHJcbiAgICBjb25zdCBvcGVuID0gYCBhdCA8JHtmb3JtYXRDb21wb25lbnROYW1lKHZub2RlLmNvbXBvbmVudCwgdm5vZGUudHlwZSwgaXNSb290KX1gO1xyXG4gICAgY29uc3QgY2xvc2UgPSBgPmAgKyBwb3N0Zml4O1xyXG4gICAgcmV0dXJuIHZub2RlLnByb3BzXHJcbiAgICAgICAgPyBbb3BlbiwgLi4uZm9ybWF0UHJvcHModm5vZGUucHJvcHMpLCBjbG9zZV1cclxuICAgICAgICA6IFtvcGVuICsgY2xvc2VdO1xyXG59XHJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbmZ1bmN0aW9uIGZvcm1hdFByb3BzKHByb3BzKSB7XHJcbiAgICBjb25zdCByZXMgPSBbXTtcclxuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XHJcbiAgICBrZXlzLnNsaWNlKDAsIDMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICByZXMucHVzaCguLi5mb3JtYXRQcm9wKGtleSwgcHJvcHNba2V5XSkpO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoa2V5cy5sZW5ndGggPiAzKSB7XHJcbiAgICAgICAgcmVzLnB1c2goYCAuLi5gKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuZnVuY3Rpb24gZm9ybWF0UHJvcChrZXksIHZhbHVlLCByYXcpIHtcclxuICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcclxuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcmF3ID8gdmFsdWUgOiBbYCR7a2V5fT0ke3ZhbHVlfWBdO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fFxyXG4gICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nIHx8XHJcbiAgICAgICAgdmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiByYXcgPyB2YWx1ZSA6IFtgJHtrZXl9PSR7dmFsdWV9YF07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc1JlZih2YWx1ZSkpIHtcclxuICAgICAgICB2YWx1ZSA9IGZvcm1hdFByb3Aoa2V5LCB0b1Jhdyh2YWx1ZS52YWx1ZSksIHRydWUpO1xyXG4gICAgICAgIHJldHVybiByYXcgPyB2YWx1ZSA6IFtgJHtrZXl9PVJlZjxgLCB2YWx1ZSwgYD5gXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XHJcbiAgICAgICAgcmV0dXJuIFtgJHtrZXl9PWZuJHt2YWx1ZS5uYW1lID8gYDwke3ZhbHVlLm5hbWV9PmAgOiBgYH1gXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID0gdG9SYXcodmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByYXcgPyB2YWx1ZSA6IFtgJHtrZXl9PWAsIHZhbHVlXTtcclxuICAgIH1cclxufVxuXG5jb25zdCBFcnJvclR5cGVTdHJpbmdzID0ge1xyXG4gICAgW1wiYmNcIiAvKiBCRUZPUkVfQ1JFQVRFICovXTogJ2JlZm9yZUNyZWF0ZSBob29rJyxcclxuICAgIFtcImNcIiAvKiBDUkVBVEVEICovXTogJ2NyZWF0ZWQgaG9vaycsXHJcbiAgICBbXCJibVwiIC8qIEJFRk9SRV9NT1VOVCAqL106ICdiZWZvcmVNb3VudCBob29rJyxcclxuICAgIFtcIm1cIiAvKiBNT1VOVEVEICovXTogJ21vdW50ZWQgaG9vaycsXHJcbiAgICBbXCJidVwiIC8qIEJFRk9SRV9VUERBVEUgKi9dOiAnYmVmb3JlVXBkYXRlIGhvb2snLFxyXG4gICAgW1widVwiIC8qIFVQREFURUQgKi9dOiAndXBkYXRlZCcsXHJcbiAgICBbXCJidW1cIiAvKiBCRUZPUkVfVU5NT1VOVCAqL106ICdiZWZvcmVVbm1vdW50IGhvb2snLFxyXG4gICAgW1widW1cIiAvKiBVTk1PVU5URUQgKi9dOiAndW5tb3VudGVkIGhvb2snLFxyXG4gICAgW1wiYVwiIC8qIEFDVElWQVRFRCAqL106ICdhY3RpdmF0ZWQgaG9vaycsXHJcbiAgICBbXCJkYVwiIC8qIERFQUNUSVZBVEVEICovXTogJ2RlYWN0aXZhdGVkIGhvb2snLFxyXG4gICAgW1wiZWNcIiAvKiBFUlJPUl9DQVBUVVJFRCAqL106ICdlcnJvckNhcHR1cmVkIGhvb2snLFxyXG4gICAgW1wicnRjXCIgLyogUkVOREVSX1RSQUNLRUQgKi9dOiAncmVuZGVyVHJhY2tlZCBob29rJyxcclxuICAgIFtcInJ0Z1wiIC8qIFJFTkRFUl9UUklHR0VSRUQgKi9dOiAncmVuZGVyVHJpZ2dlcmVkIGhvb2snLFxyXG4gICAgWzAgLyogU0VUVVBfRlVOQ1RJT04gKi9dOiAnc2V0dXAgZnVuY3Rpb24nLFxyXG4gICAgWzEgLyogUkVOREVSX0ZVTkNUSU9OICovXTogJ3JlbmRlciBmdW5jdGlvbicsXHJcbiAgICBbMiAvKiBXQVRDSF9HRVRURVIgKi9dOiAnd2F0Y2hlciBnZXR0ZXInLFxyXG4gICAgWzMgLyogV0FUQ0hfQ0FMTEJBQ0sgKi9dOiAnd2F0Y2hlciBjYWxsYmFjaycsXHJcbiAgICBbNCAvKiBXQVRDSF9DTEVBTlVQICovXTogJ3dhdGNoZXIgY2xlYW51cCBmdW5jdGlvbicsXHJcbiAgICBbNSAvKiBOQVRJVkVfRVZFTlRfSEFORExFUiAqL106ICduYXRpdmUgZXZlbnQgaGFuZGxlcicsXHJcbiAgICBbNiAvKiBDT01QT05FTlRfRVZFTlRfSEFORExFUiAqL106ICdjb21wb25lbnQgZXZlbnQgaGFuZGxlcicsXHJcbiAgICBbNyAvKiBWTk9ERV9IT09LICovXTogJ3Zub2RlIGhvb2snLFxyXG4gICAgWzggLyogRElSRUNUSVZFX0hPT0sgKi9dOiAnZGlyZWN0aXZlIGhvb2snLFxyXG4gICAgWzkgLyogVFJBTlNJVElPTl9IT09LICovXTogJ3RyYW5zaXRpb24gaG9vaycsXHJcbiAgICBbMTAgLyogQVBQX0VSUk9SX0hBTkRMRVIgKi9dOiAnYXBwIGVycm9ySGFuZGxlcicsXHJcbiAgICBbMTEgLyogQVBQX1dBUk5fSEFORExFUiAqL106ICdhcHAgd2FybkhhbmRsZXInLFxyXG4gICAgWzEyIC8qIEZVTkNUSU9OX1JFRiAqL106ICdyZWYgZnVuY3Rpb24nLFxyXG4gICAgWzEzIC8qIEFTWU5DX0NPTVBPTkVOVF9MT0FERVIgKi9dOiAnYXN5bmMgY29tcG9uZW50IGxvYWRlcicsXHJcbiAgICBbMTQgLyogU0NIRURVTEVSICovXTogJ3NjaGVkdWxlciBmbHVzaC4gVGhpcyBpcyBsaWtlbHkgYSBWdWUgaW50ZXJuYWxzIGJ1Zy4gJyArXHJcbiAgICAgICAgJ1BsZWFzZSBvcGVuIGFuIGlzc3VlIGF0IGh0dHBzOi8vbmV3LWlzc3VlLnZ1ZWpzLm9yZy8/cmVwbz12dWVqcy92dWUtbmV4dCdcclxufTtcclxuZnVuY3Rpb24gY2FsbFdpdGhFcnJvckhhbmRsaW5nKGZuLCBpbnN0YW5jZSwgdHlwZSwgYXJncykge1xyXG4gICAgbGV0IHJlcztcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmVzID0gYXJncyA/IGZuKC4uLmFyZ3MpIDogZm4oKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICBoYW5kbGVFcnJvcihlcnIsIGluc3RhbmNlLCB0eXBlKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuZnVuY3Rpb24gY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcoZm4sIGluc3RhbmNlLCB0eXBlLCBhcmdzKSB7XHJcbiAgICBpZiAoaXNGdW5jdGlvbihmbikpIHtcclxuICAgICAgICBjb25zdCByZXMgPSBjYWxsV2l0aEVycm9ySGFuZGxpbmcoZm4sIGluc3RhbmNlLCB0eXBlLCBhcmdzKTtcclxuICAgICAgICBpZiAocmVzICYmIGlzUHJvbWlzZShyZXMpKSB7XHJcbiAgICAgICAgICAgIHJlcy5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlRXJyb3IoZXJyLCBpbnN0YW5jZSwgdHlwZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdmFsdWVzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFsdWVzLnB1c2goY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcoZm5baV0sIGluc3RhbmNlLCB0eXBlLCBhcmdzKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG59XHJcbmZ1bmN0aW9uIGhhbmRsZUVycm9yKGVyciwgaW5zdGFuY2UsIHR5cGUpIHtcclxuICAgIGNvbnN0IGNvbnRleHRWTm9kZSA9IGluc3RhbmNlID8gaW5zdGFuY2Uudm5vZGUgOiBudWxsO1xyXG4gICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgbGV0IGN1ciA9IGluc3RhbmNlLnBhcmVudDtcclxuICAgICAgICAvLyB0aGUgZXhwb3NlZCBpbnN0YW5jZSBpcyB0aGUgcmVuZGVyIHByb3h5IHRvIGtlZXAgaXQgY29uc2lzdGVudCB3aXRoIDIueFxyXG4gICAgICAgIGNvbnN0IGV4cG9zZWRJbnN0YW5jZSA9IGluc3RhbmNlLnByb3h5O1xyXG4gICAgICAgIC8vIGluIHByb2R1Y3Rpb24gdGhlIGhvb2sgcmVjZWl2ZXMgb25seSB0aGUgZXJyb3IgY29kZVxyXG4gICAgICAgIGNvbnN0IGVycm9ySW5mbyA9IChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSA/IEVycm9yVHlwZVN0cmluZ3NbdHlwZV0gOiB0eXBlO1xyXG4gICAgICAgIHdoaWxlIChjdXIpIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3JDYXB0dXJlZEhvb2tzID0gY3VyLmVjO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3JDYXB0dXJlZEhvb2tzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9yQ2FwdHVyZWRIb29rcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvckNhcHR1cmVkSG9va3NbaV0oZXJyLCBleHBvc2VkSW5zdGFuY2UsIGVycm9ySW5mbykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdXIgPSBjdXIucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhcHAtbGV2ZWwgaGFuZGxpbmdcclxuICAgICAgICBjb25zdCBhcHBFcnJvckhhbmRsZXIgPSBpbnN0YW5jZS5hcHBDb250ZXh0LmNvbmZpZy5lcnJvckhhbmRsZXI7XHJcbiAgICAgICAgaWYgKGFwcEVycm9ySGFuZGxlcikge1xyXG4gICAgICAgICAgICBjYWxsV2l0aEVycm9ySGFuZGxpbmcoYXBwRXJyb3JIYW5kbGVyLCBudWxsLCAxMCAvKiBBUFBfRVJST1JfSEFORExFUiAqLywgW2VyciwgZXhwb3NlZEluc3RhbmNlLCBlcnJvckluZm9dKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxvZ0Vycm9yKGVyciwgdHlwZSwgY29udGV4dFZOb2RlKTtcclxufVxyXG5mdW5jdGlvbiBsb2dFcnJvcihlcnIsIHR5cGUsIGNvbnRleHRWTm9kZSkge1xyXG4gICAgLy8gZGVmYXVsdCBiZWhhdmlvciBpcyBjcmFzaCBpbiBwcm9kICYgdGVzdCwgcmVjb3ZlciBpbiBkZXYuXHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmICggIWZhbHNlKSkge1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSBFcnJvclR5cGVTdHJpbmdzW3R5cGVdO1xyXG4gICAgICAgIGlmIChjb250ZXh0Vk5vZGUpIHtcclxuICAgICAgICAgICAgcHVzaFdhcm5pbmdDb250ZXh0KGNvbnRleHRWTm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdhcm4oYFVuaGFuZGxlZCBlcnJvciR7aW5mbyA/IGAgZHVyaW5nIGV4ZWN1dGlvbiBvZiAke2luZm99YCA6IGBgfWApO1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICBpZiAoY29udGV4dFZOb2RlKSB7XHJcbiAgICAgICAgICAgIHBvcFdhcm5pbmdDb250ZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfVxyXG59XG5cbmNvbnN0IHF1ZXVlID0gW107XHJcbmNvbnN0IHBvc3RGbHVzaENicyA9IFtdO1xyXG5jb25zdCBwID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbmxldCBpc0ZsdXNoaW5nID0gZmFsc2U7XHJcbmxldCBpc0ZsdXNoUGVuZGluZyA9IGZhbHNlO1xyXG5sZXQgZmx1c2hJbmRleCA9IDA7XHJcbmxldCBwZW5kaW5nUG9zdEZsdXNoQ2JzID0gbnVsbDtcclxubGV0IHBlbmRpbmdQb3N0Rmx1c2hJbmRleCA9IDA7XHJcbmNvbnN0IFJFQ1VSU0lPTl9MSU1JVCA9IDEwMDtcclxuZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcclxuICAgIHJldHVybiBmbiA/IHAudGhlbihmbikgOiBwO1xyXG59XHJcbmZ1bmN0aW9uIHF1ZXVlSm9iKGpvYikge1xyXG4gICAgaWYgKCFxdWV1ZS5pbmNsdWRlcyhqb2IsIGZsdXNoSW5kZXgpKSB7XHJcbiAgICAgICAgcXVldWUucHVzaChqb2IpO1xyXG4gICAgICAgIHF1ZXVlRmx1c2goKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpbnZhbGlkYXRlSm9iKGpvYikge1xyXG4gICAgY29uc3QgaSA9IHF1ZXVlLmluZGV4T2Yoam9iKTtcclxuICAgIGlmIChpID4gLTEpIHtcclxuICAgICAgICBxdWV1ZVtpXSA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcXVldWVQb3N0Rmx1c2hDYihjYikge1xyXG4gICAgaWYgKCFpc0FycmF5KGNiKSkge1xyXG4gICAgICAgIGlmICghcGVuZGluZ1Bvc3RGbHVzaENicyB8fFxyXG4gICAgICAgICAgICAhcGVuZGluZ1Bvc3RGbHVzaENicy5pbmNsdWRlcyhjYiwgcGVuZGluZ1Bvc3RGbHVzaEluZGV4KSkge1xyXG4gICAgICAgICAgICBwb3N0Rmx1c2hDYnMucHVzaChjYik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gaWYgY2IgaXMgYW4gYXJyYXksIGl0IGlzIGEgY29tcG9uZW50IGxpZmVjeWNsZSBob29rIHdoaWNoIGNhbiBvbmx5IGJlXHJcbiAgICAgICAgLy8gdHJpZ2dlcmVkIGJ5IGEgam9iLCB3aGljaCBpcyBhbHJlYWR5IGRlZHVwZWQgaW4gdGhlIG1haW4gcXVldWUsIHNvXHJcbiAgICAgICAgLy8gd2UgY2FuIHNraXAgZHVwaWNhdGUgY2hlY2sgaGVyZSB0byBpbXByb3ZlIHBlcmZcclxuICAgICAgICBwb3N0Rmx1c2hDYnMucHVzaCguLi5jYik7XHJcbiAgICB9XHJcbiAgICBxdWV1ZUZsdXNoKCk7XHJcbn1cclxuZnVuY3Rpb24gcXVldWVGbHVzaCgpIHtcclxuICAgIGlmICghaXNGbHVzaGluZyAmJiAhaXNGbHVzaFBlbmRpbmcpIHtcclxuICAgICAgICBpc0ZsdXNoUGVuZGluZyA9IHRydWU7XHJcbiAgICAgICAgbmV4dFRpY2soZmx1c2hKb2JzKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBmbHVzaFBvc3RGbHVzaENicyhzZWVuKSB7XHJcbiAgICBpZiAocG9zdEZsdXNoQ2JzLmxlbmd0aCkge1xyXG4gICAgICAgIHBlbmRpbmdQb3N0Rmx1c2hDYnMgPSBbLi4ubmV3IFNldChwb3N0Rmx1c2hDYnMpXTtcclxuICAgICAgICBwb3N0Rmx1c2hDYnMubGVuZ3RoID0gMDtcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgIHNlZW4gPSBzZWVuIHx8IG5ldyBNYXAoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChwZW5kaW5nUG9zdEZsdXNoSW5kZXggPSAwOyBwZW5kaW5nUG9zdEZsdXNoSW5kZXggPCBwZW5kaW5nUG9zdEZsdXNoQ2JzLmxlbmd0aDsgcGVuZGluZ1Bvc3RGbHVzaEluZGV4KyspIHtcclxuICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tSZWN1cnNpdmVVcGRhdGVzKHNlZW4sIHBlbmRpbmdQb3N0Rmx1c2hDYnNbcGVuZGluZ1Bvc3RGbHVzaEluZGV4XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGVuZGluZ1Bvc3RGbHVzaENic1twZW5kaW5nUG9zdEZsdXNoSW5kZXhdKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBlbmRpbmdQb3N0Rmx1c2hDYnMgPSBudWxsO1xyXG4gICAgICAgIHBlbmRpbmdQb3N0Rmx1c2hJbmRleCA9IDA7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgZ2V0SWQgPSAoam9iKSA9PiAoam9iLmlkID09IG51bGwgPyBJbmZpbml0eSA6IGpvYi5pZCk7XHJcbmZ1bmN0aW9uIGZsdXNoSm9icyhzZWVuKSB7XHJcbiAgICBpc0ZsdXNoUGVuZGluZyA9IGZhbHNlO1xyXG4gICAgaXNGbHVzaGluZyA9IHRydWU7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgc2VlbiA9IHNlZW4gfHwgbmV3IE1hcCgpO1xyXG4gICAgfVxyXG4gICAgLy8gU29ydCBxdWV1ZSBiZWZvcmUgZmx1c2guXHJcbiAgICAvLyBUaGlzIGVuc3VyZXMgdGhhdDpcclxuICAgIC8vIDEuIENvbXBvbmVudHMgYXJlIHVwZGF0ZWQgZnJvbSBwYXJlbnQgdG8gY2hpbGQuIChiZWNhdXNlIHBhcmVudCBpcyBhbHdheXNcclxuICAgIC8vICAgIGNyZWF0ZWQgYmVmb3JlIHRoZSBjaGlsZCBzbyBpdHMgcmVuZGVyIGVmZmVjdCB3aWxsIGhhdmUgc21hbGxlclxyXG4gICAgLy8gICAgcHJpb3JpdHkgbnVtYmVyKVxyXG4gICAgLy8gMi4gSWYgYSBjb21wb25lbnQgaXMgdW5tb3VudGVkIGR1cmluZyBhIHBhcmVudCBjb21wb25lbnQncyB1cGRhdGUsXHJcbiAgICAvLyAgICBpdHMgdXBkYXRlIGNhbiBiZSBza2lwcGVkLlxyXG4gICAgLy8gSm9icyBjYW4gbmV2ZXIgYmUgbnVsbCBiZWZvcmUgZmx1c2ggc3RhcnRzLCBzaW5jZSB0aGV5IGFyZSBvbmx5IGludmFsaWRhdGVkXHJcbiAgICAvLyBkdXJpbmcgZXhlY3V0aW9uIG9mIGFub3RoZXIgZmx1c2hlZCBqb2IuXHJcbiAgICBxdWV1ZS5zb3J0KChhLCBiKSA9PiBnZXRJZChhKSAtIGdldElkKGIpKTtcclxuICAgIGZvciAoZmx1c2hJbmRleCA9IDA7IGZsdXNoSW5kZXggPCBxdWV1ZS5sZW5ndGg7IGZsdXNoSW5kZXgrKykge1xyXG4gICAgICAgIGNvbnN0IGpvYiA9IHF1ZXVlW2ZsdXNoSW5kZXhdO1xyXG4gICAgICAgIGlmIChqb2IpIHtcclxuICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tSZWN1cnNpdmVVcGRhdGVzKHNlZW4sIGpvYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbFdpdGhFcnJvckhhbmRsaW5nKGpvYiwgbnVsbCwgMTQgLyogU0NIRURVTEVSICovKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmbHVzaEluZGV4ID0gMDtcclxuICAgIHF1ZXVlLmxlbmd0aCA9IDA7XHJcbiAgICBmbHVzaFBvc3RGbHVzaENicyhzZWVuKTtcclxuICAgIGlzRmx1c2hpbmcgPSBmYWxzZTtcclxuICAgIC8vIHNvbWUgcG9zdEZsdXNoQ2IgcXVldWVkIGpvYnMhXHJcbiAgICAvLyBrZWVwIGZsdXNoaW5nIHVudGlsIGl0IGRyYWlucy5cclxuICAgIGlmIChxdWV1ZS5sZW5ndGggfHwgcG9zdEZsdXNoQ2JzLmxlbmd0aCkge1xyXG4gICAgICAgIGZsdXNoSm9icyhzZWVuKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjaGVja1JlY3Vyc2l2ZVVwZGF0ZXMoc2VlbiwgZm4pIHtcclxuICAgIGlmICghc2Vlbi5oYXMoZm4pKSB7XHJcbiAgICAgICAgc2Vlbi5zZXQoZm4sIDEpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgY291bnQgPSBzZWVuLmdldChmbik7XHJcbiAgICAgICAgaWYgKGNvdW50ID4gUkVDVVJTSU9OX0xJTUlUKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWF4aW11bSByZWN1cnNpdmUgdXBkYXRlcyBleGNlZWRlZC4gJyArXHJcbiAgICAgICAgICAgICAgICBcIllvdSBtYXkgaGF2ZSBjb2RlIHRoYXQgaXMgbXV0YXRpbmcgc3RhdGUgaW4geW91ciBjb21wb25lbnQncyBcIiArXHJcbiAgICAgICAgICAgICAgICAncmVuZGVyIGZ1bmN0aW9uIG9yIHVwZGF0ZWQgaG9vayBvciB3YXRjaGVyIHNvdXJjZSBmdW5jdGlvbi4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNlZW4uc2V0KGZuLCBjb3VudCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5sZXQgaXNIbXJVcGRhdGluZyA9IGZhbHNlO1xyXG5jb25zdCBobXJEaXJ0eUNvbXBvbmVudHMgPSBuZXcgU2V0KCk7XHJcbi8vIEV4cG9zZSB0aGUgSE1SIHJ1bnRpbWUgb24gdGhlIGdsb2JhbCBvYmplY3RcclxuLy8gVGhpcyBtYWtlcyBpdCBlbnRpcmVseSB0cmVlLXNoYWthYmxlIHdpdGhvdXQgcG9sbHV0aW5nIHRoZSBleHBvcnRzIGFuZCBtYWtlc1xyXG4vLyBpdCBlYXNpZXIgdG8gYmUgdXNlZCBpbiB0b29saW5ncyBsaWtlIHZ1ZS1sb2FkZXJcclxuLy8gTm90ZTogZm9yIGEgY29tcG9uZW50IHRvIGJlIGVsaWdpYmxlIGZvciBITVIgaXQgYWxzbyBuZWVkcyB0aGUgX19obXJJZCBvcHRpb25cclxuLy8gdG8gYmUgc2V0IHNvIHRoYXQgaXRzIGluc3RhbmNlcyBjYW4gYmUgcmVnaXN0ZXJlZCAvIHJlbW92ZWQuXHJcbmlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgIGNvbnN0IGdsb2JhbE9iamVjdCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnXHJcbiAgICAgICAgPyBnbG9iYWxcclxuICAgICAgICA6IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICA/IHNlbGZcclxuICAgICAgICAgICAgOiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICAgICAgPyB3aW5kb3dcclxuICAgICAgICAgICAgICAgIDoge307XHJcbiAgICBnbG9iYWxPYmplY3QuX19WVUVfSE1SX1JVTlRJTUVfXyA9IHtcclxuICAgICAgICBjcmVhdGVSZWNvcmQ6IHRyeVdyYXAoY3JlYXRlUmVjb3JkKSxcclxuICAgICAgICByZXJlbmRlcjogdHJ5V3JhcChyZXJlbmRlciksXHJcbiAgICAgICAgcmVsb2FkOiB0cnlXcmFwKHJlbG9hZClcclxuICAgIH07XHJcbn1cclxuY29uc3QgbWFwID0gbmV3IE1hcCgpO1xyXG5mdW5jdGlvbiByZWdpc3RlckhNUihpbnN0YW5jZSkge1xyXG4gICAgY29uc3QgaWQgPSBpbnN0YW5jZS50eXBlLl9faG1ySWQ7XHJcbiAgICBsZXQgcmVjb3JkID0gbWFwLmdldChpZCk7XHJcbiAgICBpZiAoIXJlY29yZCkge1xyXG4gICAgICAgIGNyZWF0ZVJlY29yZChpZCk7XHJcbiAgICAgICAgcmVjb3JkID0gbWFwLmdldChpZCk7XHJcbiAgICB9XHJcbiAgICByZWNvcmQuYWRkKGluc3RhbmNlKTtcclxufVxyXG5mdW5jdGlvbiB1bnJlZ2lzdGVySE1SKGluc3RhbmNlKSB7XHJcbiAgICBtYXAuZ2V0KGluc3RhbmNlLnR5cGUuX19obXJJZCkuZGVsZXRlKGluc3RhbmNlKTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVSZWNvcmQoaWQpIHtcclxuICAgIGlmIChtYXAuaGFzKGlkKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIG1hcC5zZXQoaWQsIG5ldyBTZXQoKSk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiByZXJlbmRlcihpZCwgbmV3UmVuZGVyKSB7XHJcbiAgICBjb25zdCByZWNvcmQgPSBtYXAuZ2V0KGlkKTtcclxuICAgIGlmICghcmVjb3JkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIC8vIEFycmF5LmZyb20gY3JlYXRlcyBhIHNuYXBzaG90IHdoaWNoIGF2b2lkcyB0aGUgc2V0IGJlaW5nIG11dGF0ZWQgZHVyaW5nXHJcbiAgICAvLyB1cGRhdGVzXHJcbiAgICBBcnJheS5mcm9tKHJlY29yZCkuZm9yRWFjaChpbnN0YW5jZSA9PiB7XHJcbiAgICAgICAgaWYgKG5ld1JlbmRlcikge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZW5kZXIgPSBuZXdSZW5kZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluc3RhbmNlLnJlbmRlckNhY2hlID0gW107XHJcbiAgICAgICAgLy8gdGhpcyBmbGFnIGZvcmNlcyBjaGlsZCBjb21wb25lbnRzIHdpdGggc2xvdCBjb250ZW50IHRvIHVwZGF0ZVxyXG4gICAgICAgIGlzSG1yVXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgIGluc3RhbmNlLnVwZGF0ZSgpO1xyXG4gICAgICAgIGlzSG1yVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIHJlbG9hZChpZCwgbmV3Q29tcCkge1xyXG4gICAgY29uc3QgcmVjb3JkID0gbWFwLmdldChpZCk7XHJcbiAgICBpZiAoIXJlY29yZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAvLyBBcnJheS5mcm9tIGNyZWF0ZXMgYSBzbmFwc2hvdCB3aGljaCBhdm9pZHMgdGhlIHNldCBiZWluZyBtdXRhdGVkIGR1cmluZ1xyXG4gICAgLy8gdXBkYXRlc1xyXG4gICAgQXJyYXkuZnJvbShyZWNvcmQpLmZvckVhY2goaW5zdGFuY2UgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbXAgPSBpbnN0YW5jZS50eXBlO1xyXG4gICAgICAgIGlmICghaG1yRGlydHlDb21wb25lbnRzLmhhcyhjb21wKSkge1xyXG4gICAgICAgICAgICAvLyAxLiBVcGRhdGUgZXhpc3RpbmcgY29tcCBkZWZpbml0aW9uIHRvIG1hdGNoIG5ldyBvbmVcclxuICAgICAgICAgICAgZXh0ZW5kKGNvbXAsIG5ld0NvbXApO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb21wKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gbmV3Q29tcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29tcFtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIDIuIE1hcmsgY29tcG9uZW50IGRpcnR5LiBUaGlzIGZvcmNlcyB0aGUgcmVuZGVyZXIgdG8gcmVwbGFjZSB0aGUgY29tcG9uZW50XHJcbiAgICAgICAgICAgIC8vIG9uIHBhdGNoLlxyXG4gICAgICAgICAgICBobXJEaXJ0eUNvbXBvbmVudHMuYWRkKGNvbXApO1xyXG4gICAgICAgICAgICAvLyAzLiBNYWtlIHN1cmUgdG8gdW5tYXJrIHRoZSBjb21wb25lbnQgYWZ0ZXIgdGhlIHJlbG9hZC5cclxuICAgICAgICAgICAgcXVldWVQb3N0Rmx1c2hDYigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBobXJEaXJ0eUNvbXBvbmVudHMuZGVsZXRlKGNvbXApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGluc3RhbmNlLnBhcmVudCkge1xyXG4gICAgICAgICAgICAvLyA0LiBGb3JjZSB0aGUgcGFyZW50IGluc3RhbmNlIHRvIHJlLXJlbmRlci4gVGhpcyB3aWxsIGNhdXNlIGFsbCB1cGRhdGVkXHJcbiAgICAgICAgICAgIC8vIGNvbXBvbmVudHMgdG8gYmUgdW5tb3VudGVkIGFuZCByZS1tb3VudGVkLiBRdWV1ZSB0aGUgdXBkYXRlIHNvIHRoYXQgd2VcclxuICAgICAgICAgICAgLy8gZG9uJ3QgZW5kIHVwIGZvcmNpbmcgdGhlIHNhbWUgcGFyZW50IHRvIHJlLXJlbmRlciBtdWx0aXBsZSB0aW1lcy5cclxuICAgICAgICAgICAgcXVldWVKb2IoaW5zdGFuY2UucGFyZW50LnVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGluc3RhbmNlLmFwcENvbnRleHQucmVsb2FkKSB7XHJcbiAgICAgICAgICAgIC8vIHJvb3QgaW5zdGFuY2UgbW91bnRlZCB2aWEgY3JlYXRlQXBwKCkgaGFzIGEgcmVsb2FkIG1ldGhvZFxyXG4gICAgICAgICAgICBpbnN0YW5jZS5hcHBDb250ZXh0LnJlbG9hZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAvLyByb290IGluc3RhbmNlIGluc2lkZSB0cmVlIGNyZWF0ZWQgdmlhIHJhdyByZW5kZXIoKS4gRm9yY2UgcmVsb2FkLlxyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tITVJdIFJvb3Qgb3IgbWFudWFsbHkgbW91bnRlZCBpbnN0YW5jZSBtb2RpZmllZC4gRnVsbCByZWxvYWQgcmVxdWlyZWQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gdHJ5V3JhcChmbikge1xyXG4gICAgcmV0dXJuIChpZCwgYXJnKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGZuKGlkLCBhcmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtITVJdIFNvbWV0aGluZyB3ZW50IHdyb25nIGR1cmluZyBWdWUgY29tcG9uZW50IGhvdC1yZWxvYWQuIGAgK1xyXG4gICAgICAgICAgICAgICAgYEZ1bGwgcmVsb2FkIHJlcXVpcmVkLmApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cblxuLy8gbWFyayB0aGUgY3VycmVudCByZW5kZXJpbmcgaW5zdGFuY2UgZm9yIGFzc2V0IHJlc29sdXRpb24gKGUuZy5cclxuLy8gcmVzb2x2ZUNvbXBvbmVudCwgcmVzb2x2ZURpcmVjdGl2ZSkgZHVyaW5nIHJlbmRlclxyXG5sZXQgY3VycmVudFJlbmRlcmluZ0luc3RhbmNlID0gbnVsbDtcclxuZnVuY3Rpb24gc2V0Q3VycmVudFJlbmRlcmluZ0luc3RhbmNlKGluc3RhbmNlKSB7XHJcbiAgICBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UgPSBpbnN0YW5jZTtcclxufVxyXG4vLyBkZXYgb25seSBmbGFnIHRvIHRyYWNrIHdoZXRoZXIgJGF0dHJzIHdhcyB1c2VkIGR1cmluZyByZW5kZXIuXHJcbi8vIElmICRhdHRycyB3YXMgdXNlZCBkdXJpbmcgcmVuZGVyIHRoZW4gdGhlIHdhcm5pbmcgZm9yIGZhaWxlZCBhdHRyc1xyXG4vLyBmYWxsdGhyb3VnaCBjYW4gYmUgc3VwcHJlc3NlZC5cclxubGV0IGFjY2Vzc2VkQXR0cnMgPSBmYWxzZTtcclxuZnVuY3Rpb24gbWFya0F0dHJzQWNjZXNzZWQoKSB7XHJcbiAgICBhY2Nlc3NlZEF0dHJzID0gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiByZW5kZXJDb21wb25lbnRSb290KGluc3RhbmNlKSB7XHJcbiAgICBjb25zdCB7IHR5cGU6IENvbXBvbmVudCwgcGFyZW50LCB2bm9kZSwgcHJveHksIHdpdGhQcm94eSwgcHJvcHMsIHNsb3RzLCBhdHRycywgZW1pdCwgcmVuZGVyLCByZW5kZXJDYWNoZSwgZGF0YSwgc2V0dXBTdGF0ZSwgY3R4IH0gPSBpbnN0YW5jZTtcclxuICAgIGxldCByZXN1bHQ7XHJcbiAgICBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UgPSBpbnN0YW5jZTtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICBhY2Nlc3NlZEF0dHJzID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmYWxsdGhyb3VnaEF0dHJzO1xyXG4gICAgICAgIGlmICh2bm9kZS5zaGFwZUZsYWcgJiA0IC8qIFNUQVRFRlVMX0NPTVBPTkVOVCAqLykge1xyXG4gICAgICAgICAgICAvLyB3aXRoUHJveHkgaXMgYSBwcm94eSB3aXRoIGEgZGlmZmVyZW50IGBoYXNgIHRyYXAgb25seSBmb3JcclxuICAgICAgICAgICAgLy8gcnVudGltZS1jb21waWxlZCByZW5kZXIgZnVuY3Rpb25zIHVzaW5nIGB3aXRoYCBibG9jay5cclxuICAgICAgICAgICAgY29uc3QgcHJveHlUb1VzZSA9IHdpdGhQcm94eSB8fCBwcm94eTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gbm9ybWFsaXplVk5vZGUocmVuZGVyLmNhbGwocHJveHlUb1VzZSwgcHJveHlUb1VzZSwgcmVuZGVyQ2FjaGUsIHByb3BzLCBzZXR1cFN0YXRlLCBkYXRhLCBjdHgpKTtcclxuICAgICAgICAgICAgZmFsbHRocm91Z2hBdHRycyA9IGF0dHJzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gZnVuY3Rpb25hbFxyXG4gICAgICAgICAgICBjb25zdCByZW5kZXIgPSBDb21wb25lbnQ7XHJcbiAgICAgICAgICAgIC8vIGluIGRldiwgbWFyayBhdHRycyBhY2Nlc3NlZCBpZiBvcHRpb25hbCBwcm9wcyAoYXR0cnMgPT09IHByb3BzKVxyXG4gICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGF0dHJzID09PSBwcm9wcykge1xyXG4gICAgICAgICAgICAgICAgbWFya0F0dHJzQWNjZXNzZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQgPSBub3JtYWxpemVWTm9kZShyZW5kZXIubGVuZ3RoID4gMVxyXG4gICAgICAgICAgICAgICAgPyByZW5kZXIocHJvcHMsIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgICAgID8ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQgYXR0cnMoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrQXR0cnNBY2Nlc3NlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbG90cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1pdFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICA6IHsgYXR0cnMsIHNsb3RzLCBlbWl0IH0pXHJcbiAgICAgICAgICAgICAgICA6IHJlbmRlcihwcm9wcywgbnVsbCAvKiB3ZSBrbm93IGl0IGRvZXNuJ3QgbmVlZCBpdCAqLykpO1xyXG4gICAgICAgICAgICBmYWxsdGhyb3VnaEF0dHJzID0gQ29tcG9uZW50LnByb3BzID8gYXR0cnMgOiBnZXRGYWxsdGhyb3VnaEF0dHJzKGF0dHJzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYXR0ciBtZXJnaW5nXHJcbiAgICAgICAgLy8gaW4gZGV2IG1vZGUsIGNvbW1lbnRzIGFyZSBwcmVzZXJ2ZWQsIGFuZCBpdCdzIHBvc3NpYmxlIGZvciBhIHRlbXBsYXRlXHJcbiAgICAgICAgLy8gdG8gaGF2ZSBjb21tZW50cyBhbG9uZyBzaWRlIHRoZSByb290IGVsZW1lbnQgd2hpY2ggbWFrZXMgaXQgYSBmcmFnbWVudFxyXG4gICAgICAgIGxldCByb290ID0gcmVzdWx0O1xyXG4gICAgICAgIGxldCBzZXRSb290ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgO1xyXG4gICAgICAgICAgICBbcm9vdCwgc2V0Um9vdF0gPSBnZXRDaGlsZFJvb3QocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKENvbXBvbmVudC5pbmhlcml0QXR0cnMgIT09IGZhbHNlICYmXHJcbiAgICAgICAgICAgIGZhbGx0aHJvdWdoQXR0cnMgJiZcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoZmFsbHRocm91Z2hBdHRycykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmIChyb290LnNoYXBlRmxhZyAmIDEgLyogRUxFTUVOVCAqLyB8fFxyXG4gICAgICAgICAgICAgICAgcm9vdC5zaGFwZUZsYWcgJiA2IC8qIENPTVBPTkVOVCAqLykge1xyXG4gICAgICAgICAgICAgICAgcm9vdCA9IGNsb25lVk5vZGUocm9vdCwgZmFsbHRocm91Z2hBdHRycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmICFhY2Nlc3NlZEF0dHJzICYmIHJvb3QudHlwZSAhPT0gQ29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWxsQXR0cnMgPSBPYmplY3Qua2V5cyhhdHRycyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudEF0dHJzID0gW107XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHRyYUF0dHJzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGFsbEF0dHJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGFsbEF0dHJzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09uKGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIHYtbW9kZWwgaGFuZGxlcnMgd2hlbiB0aGV5IGZhaWwgdG8gZmFsbHRocm91Z2hcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFrZXkuc3RhcnRzV2l0aCgnb25VcGRhdGU6JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBgb25gLCBsb3dlcmNhc2UgZmlyc3QgbGV0dGVyIHRvIHJlZmxlY3QgZXZlbnQgY2FzaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhY2N1cmF0ZWx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudEF0dHJzLnB1c2goa2V5WzJdLnRvTG93ZXJDYXNlKCkgKyBrZXkuc2xpY2UoMykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHRyYUF0dHJzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZXh0cmFBdHRycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YXJuKGBFeHRyYW5lb3VzIG5vbi1wcm9wcyBhdHRyaWJ1dGVzIChgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYCR7ZXh0cmFBdHRycy5qb2luKCcsICcpfSkgYCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGB3ZXJlIHBhc3NlZCB0byBjb21wb25lbnQgYnV0IGNvdWxkIG5vdCBiZSBhdXRvbWF0aWNhbGx5IGluaGVyaXRlZCBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYGJlY2F1c2UgY29tcG9uZW50IHJlbmRlcnMgZnJhZ21lbnQgb3IgdGV4dCByb290IG5vZGVzLmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50QXR0cnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgRXh0cmFuZW91cyBub24tZW1pdHMgZXZlbnQgbGlzdGVuZXJzIChgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYCR7ZXZlbnRBdHRycy5qb2luKCcsICcpfSkgYCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGB3ZXJlIHBhc3NlZCB0byBjb21wb25lbnQgYnV0IGNvdWxkIG5vdCBiZSBhdXRvbWF0aWNhbGx5IGluaGVyaXRlZCBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYGJlY2F1c2UgY29tcG9uZW50IHJlbmRlcnMgZnJhZ21lbnQgb3IgdGV4dCByb290IG5vZGVzLiBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYElmIHRoZSBsaXN0ZW5lciBpcyBpbnRlbmRlZCB0byBiZSBhIGNvbXBvbmVudCBjdXN0b20gZXZlbnQgbGlzdGVuZXIgb25seSwgYCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGBkZWNsYXJlIGl0IHVzaW5nIHRoZSBcImVtaXRzXCIgb3B0aW9uLmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGluaGVyaXQgc2NvcGVJZFxyXG4gICAgICAgIGNvbnN0IHNjb3BlSWQgPSB2bm9kZS5zY29wZUlkO1xyXG4gICAgICAgIC8vIHZpdGUjNTM2OiBpZiBzdWJ0cmVlIHJvb3QgaXMgY3JlYXRlZCBmcm9tIHBhcmVudCBzbG90IGlmIHdvdWxkIGFscmVhZHlcclxuICAgICAgICAvLyBoYXZlIHRoZSBjb3JyZWN0IHNjb3BlSWQsIGluIHRoaXMgY2FzZSBhZGRpbmcgdGhlIHNjb3BlSWQgd2lsbCBjYXVzZVxyXG4gICAgICAgIC8vIGl0IHRvIGJlIHJlbW92ZWQgaWYgdGhlIG9yaWdpbmFsIHNsb3Qgdm5vZGUgaXMgcmV1c2VkLlxyXG4gICAgICAgIGNvbnN0IG5lZWRTY29wZUlkID0gc2NvcGVJZCAmJiByb290LnNjb3BlSWQgIT09IHNjb3BlSWQ7XHJcbiAgICAgICAgY29uc3QgdHJlZU93bmVySWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUuX19zY29wZUlkO1xyXG4gICAgICAgIGNvbnN0IHNsb3RTY29wZUlkID0gdHJlZU93bmVySWQgJiYgdHJlZU93bmVySWQgIT09IHNjb3BlSWQgPyB0cmVlT3duZXJJZCArICctcycgOiBudWxsO1xyXG4gICAgICAgIGlmIChuZWVkU2NvcGVJZCB8fCBzbG90U2NvcGVJZCkge1xyXG4gICAgICAgICAgICBjb25zdCBleHRyYXMgPSB7fTtcclxuICAgICAgICAgICAgaWYgKG5lZWRTY29wZUlkKVxyXG4gICAgICAgICAgICAgICAgZXh0cmFzW3Njb3BlSWRdID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChzbG90U2NvcGVJZClcclxuICAgICAgICAgICAgICAgIGV4dHJhc1tzbG90U2NvcGVJZF0gPSAnJztcclxuICAgICAgICAgICAgcm9vdCA9IGNsb25lVk5vZGUocm9vdCwgZXh0cmFzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaW5oZXJpdCBkaXJlY3RpdmVzXHJcbiAgICAgICAgaWYgKHZub2RlLmRpcnMpIHtcclxuICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiAhaXNFbGVtZW50Um9vdChyb290KSkge1xyXG4gICAgICAgICAgICAgICAgd2FybihgUnVudGltZSBkaXJlY3RpdmUgdXNlZCBvbiBjb21wb25lbnQgd2l0aCBub24tZWxlbWVudCByb290IG5vZGUuIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGBUaGUgZGlyZWN0aXZlcyB3aWxsIG5vdCBmdW5jdGlvbiBhcyBpbnRlbmRlZC5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByb290LmRpcnMgPSB2bm9kZS5kaXJzO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpbmhlcml0IHRyYW5zaXRpb24gZGF0YVxyXG4gICAgICAgIGlmICh2bm9kZS50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIWlzRWxlbWVudFJvb3Qocm9vdCkpIHtcclxuICAgICAgICAgICAgICAgIHdhcm4oYENvbXBvbmVudCBpbnNpZGUgPFRyYW5zaXRpb24+IHJlbmRlcnMgbm9uLWVsZW1lbnQgcm9vdCBub2RlIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGB0aGF0IGNhbm5vdCBiZSBhbmltYXRlZC5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByb290LnRyYW5zaXRpb24gPSB2bm9kZS50cmFuc2l0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHNldFJvb3QpIHtcclxuICAgICAgICAgICAgc2V0Um9vdChyb290KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGhhbmRsZUVycm9yKGVyciwgaW5zdGFuY2UsIDEgLyogUkVOREVSX0ZVTkNUSU9OICovKTtcclxuICAgICAgICByZXN1bHQgPSBjcmVhdGVWTm9kZShDb21tZW50KTtcclxuICAgIH1cclxuICAgIGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZSA9IG51bGw7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmNvbnN0IGdldENoaWxkUm9vdCA9ICh2bm9kZSkgPT4ge1xyXG4gICAgaWYgKHZub2RlLnR5cGUgIT09IEZyYWdtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIFt2bm9kZSwgdW5kZWZpbmVkXTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJhd0NoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XHJcbiAgICBjb25zdCBkeW5hbWljQ2hpbGRyZW4gPSB2bm9kZS5keW5hbWljQ2hpbGRyZW47XHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IHJhd0NoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiB7XHJcbiAgICAgICAgcmV0dXJuICEoaXNWTm9kZShjaGlsZCkgJiYgY2hpbGQudHlwZSA9PT0gQ29tbWVudCk7XHJcbiAgICB9KTtcclxuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggIT09IDEpIHtcclxuICAgICAgICByZXR1cm4gW3Zub2RlLCB1bmRlZmluZWRdO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY2hpbGRSb290ID0gY2hpbGRyZW5bMF07XHJcbiAgICBjb25zdCBpbmRleCA9IHJhd0NoaWxkcmVuLmluZGV4T2YoY2hpbGRSb290KTtcclxuICAgIGNvbnN0IGR5bmFtaWNJbmRleCA9IGR5bmFtaWNDaGlsZHJlblxyXG4gICAgICAgID8gZHluYW1pY0NoaWxkcmVuLmluZGV4T2YoY2hpbGRSb290KVxyXG4gICAgICAgIDogbnVsbDtcclxuICAgIGNvbnN0IHNldFJvb3QgPSAodXBkYXRlZFJvb3QpID0+IHtcclxuICAgICAgICByYXdDaGlsZHJlbltpbmRleF0gPSB1cGRhdGVkUm9vdDtcclxuICAgICAgICBpZiAoZHluYW1pY0luZGV4ICE9PSBudWxsKVxyXG4gICAgICAgICAgICBkeW5hbWljQ2hpbGRyZW5bZHluYW1pY0luZGV4XSA9IHVwZGF0ZWRSb290O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBbbm9ybWFsaXplVk5vZGUoY2hpbGRSb290KSwgc2V0Um9vdF07XHJcbn07XHJcbmNvbnN0IGdldEZhbGx0aHJvdWdoQXR0cnMgPSAoYXR0cnMpID0+IHtcclxuICAgIGxldCByZXM7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRycykge1xyXG4gICAgICAgIGlmIChrZXkgPT09ICdjbGFzcycgfHwga2V5ID09PSAnc3R5bGUnIHx8IGlzT24oa2V5KSkge1xyXG4gICAgICAgICAgICAocmVzIHx8IChyZXMgPSB7fSkpW2tleV0gPSBhdHRyc1trZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn07XHJcbmNvbnN0IGlzRWxlbWVudFJvb3QgPSAodm5vZGUpID0+IHtcclxuICAgIHJldHVybiAodm5vZGUuc2hhcGVGbGFnICYgNiAvKiBDT01QT05FTlQgKi8gfHxcclxuICAgICAgICB2bm9kZS5zaGFwZUZsYWcgJiAxIC8qIEVMRU1FTlQgKi8gfHxcclxuICAgICAgICB2bm9kZS50eXBlID09PSBDb21tZW50IC8vIHBvdGVudGlhbCB2LWlmIGJyYW5jaCBzd2l0Y2hcclxuICAgICk7XHJcbn07XHJcbmZ1bmN0aW9uIHNob3VsZFVwZGF0ZUNvbXBvbmVudChwcmV2Vk5vZGUsIG5leHRWTm9kZSwgb3B0aW1pemVkKSB7XHJcbiAgICBjb25zdCB7IHByb3BzOiBwcmV2UHJvcHMsIGNoaWxkcmVuOiBwcmV2Q2hpbGRyZW4gfSA9IHByZXZWTm9kZTtcclxuICAgIGNvbnN0IHsgcHJvcHM6IG5leHRQcm9wcywgY2hpbGRyZW46IG5leHRDaGlsZHJlbiwgcGF0Y2hGbGFnIH0gPSBuZXh0Vk5vZGU7XHJcbiAgICAvLyBQYXJlbnQgY29tcG9uZW50J3MgcmVuZGVyIGZ1bmN0aW9uIHdhcyBob3QtdXBkYXRlZC4gU2luY2UgdGhpcyBtYXkgaGF2ZVxyXG4gICAgLy8gY2F1c2VkIHRoZSBjaGlsZCBjb21wb25lbnQncyBzbG90cyBjb250ZW50IHRvIGhhdmUgY2hhbmdlZCwgd2UgbmVlZCB0b1xyXG4gICAgLy8gZm9yY2UgdGhlIGNoaWxkIHRvIHVwZGF0ZSBhcyB3ZWxsLlxyXG4gICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiAocHJldkNoaWxkcmVuIHx8IG5leHRDaGlsZHJlbikgJiYgaXNIbXJVcGRhdGluZykge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgLy8gZm9yY2UgY2hpbGQgdXBkYXRlIGZvciBydW50aW1lIGRpcmVjdGl2ZSBvciB0cmFuc2l0aW9uIG9uIGNvbXBvbmVudCB2bm9kZS5cclxuICAgIGlmIChuZXh0Vk5vZGUuZGlycyB8fCBuZXh0Vk5vZGUudHJhbnNpdGlvbikge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhdGNoRmxhZyA+IDApIHtcclxuICAgICAgICBpZiAocGF0Y2hGbGFnICYgMTAyNCAvKiBEWU5BTUlDX1NMT1RTICovKSB7XHJcbiAgICAgICAgICAgIC8vIHNsb3QgY29udGVudCB0aGF0IHJlZmVyZW5jZXMgdmFsdWVzIHRoYXQgbWlnaHQgaGF2ZSBjaGFuZ2VkLFxyXG4gICAgICAgICAgICAvLyBlLmcuIGluIGEgdi1mb3JcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYXRjaEZsYWcgJiAxNiAvKiBGVUxMX1BST1BTICovKSB7XHJcbiAgICAgICAgICAgIGlmICghcHJldlByb3BzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISFuZXh0UHJvcHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcHJlc2VuY2Ugb2YgdGhpcyBmbGFnIGluZGljYXRlcyBwcm9wcyBhcmUgYWx3YXlzIG5vbi1udWxsXHJcbiAgICAgICAgICAgIHJldHVybiBoYXNQcm9wc0NoYW5nZWQocHJldlByb3BzLCBuZXh0UHJvcHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwYXRjaEZsYWcgJiA4IC8qIFBST1BTICovKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGR5bmFtaWNQcm9wcyA9IG5leHRWTm9kZS5keW5hbWljUHJvcHM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZHluYW1pY1Byb3BzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBkeW5hbWljUHJvcHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dFByb3BzW2tleV0gIT09IHByZXZQcm9wc1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghb3B0aW1pemVkKSB7XHJcbiAgICAgICAgLy8gdGhpcyBwYXRoIGlzIG9ubHkgdGFrZW4gYnkgbWFudWFsbHkgd3JpdHRlbiByZW5kZXIgZnVuY3Rpb25zXHJcbiAgICAgICAgLy8gc28gcHJlc2VuY2Ugb2YgYW55IGNoaWxkcmVuIGxlYWRzIHRvIGEgZm9yY2VkIHVwZGF0ZVxyXG4gICAgICAgIGlmIChwcmV2Q2hpbGRyZW4gfHwgbmV4dENoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGlmICghbmV4dENoaWxkcmVuIHx8ICFuZXh0Q2hpbGRyZW4uJHN0YWJsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHByZXZQcm9wcyA9PT0gbmV4dFByb3BzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFwcmV2UHJvcHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuICEhbmV4dFByb3BzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIW5leHRQcm9wcykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhhc1Byb3BzQ2hhbmdlZChwcmV2UHJvcHMsIG5leHRQcm9wcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gaGFzUHJvcHNDaGFuZ2VkKHByZXZQcm9wcywgbmV4dFByb3BzKSB7XHJcbiAgICBjb25zdCBuZXh0S2V5cyA9IE9iamVjdC5rZXlzKG5leHRQcm9wcyk7XHJcbiAgICBpZiAobmV4dEtleXMubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhwcmV2UHJvcHMpLmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXh0S2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IG5leHRLZXlzW2ldO1xyXG4gICAgICAgIGlmIChuZXh0UHJvcHNba2V5XSAhPT0gcHJldlByb3BzW2tleV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUhPQ0hvc3RFbCh7IHZub2RlLCBwYXJlbnQgfSwgZWwgLy8gSG9zdE5vZGVcclxuKSB7XHJcbiAgICB3aGlsZSAocGFyZW50ICYmIHBhcmVudC5zdWJUcmVlID09PSB2bm9kZSkge1xyXG4gICAgICAgICh2bm9kZSA9IHBhcmVudC52bm9kZSkuZWwgPSBlbDtcclxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgfVxyXG59XG5cbmNvbnN0IGlzU3VzcGVuc2UgPSAodHlwZSkgPT4gdHlwZS5fX2lzU3VzcGVuc2U7XHJcbi8vIFN1c3BlbnNlIGV4cG9zZXMgYSBjb21wb25lbnQtbGlrZSBBUEksIGFuZCBpcyB0cmVhdGVkIGxpa2UgYSBjb21wb25lbnRcclxuLy8gaW4gdGhlIGNvbXBpbGVyLCBidXQgaW50ZXJuYWxseSBpdCdzIGEgc3BlY2lhbCBidWlsdC1pbiB0eXBlIHRoYXQgaG9va3NcclxuLy8gZGlyZWN0bHkgaW50byB0aGUgcmVuZGVyZXIuXHJcbmNvbnN0IFN1c3BlbnNlSW1wbCA9IHtcclxuICAgIC8vIEluIG9yZGVyIHRvIG1ha2UgU3VzcGVuc2UgdHJlZS1zaGFrYWJsZSwgd2UgbmVlZCB0byBhdm9pZCBpbXBvcnRpbmcgaXRcclxuICAgIC8vIGRpcmVjdGx5IGluIHRoZSByZW5kZXJlci4gVGhlIHJlbmRlcmVyIGNoZWNrcyBmb3IgdGhlIF9faXNTdXNwZW5zZSBmbGFnXHJcbiAgICAvLyBvbiBhIHZub2RlJ3MgdHlwZSBhbmQgY2FsbHMgdGhlIGBwcm9jZXNzYCBtZXRob2QsIHBhc3NpbmcgaW4gcmVuZGVyZXJcclxuICAgIC8vIGludGVybmFscy5cclxuICAgIF9faXNTdXNwZW5zZTogdHJ1ZSxcclxuICAgIHByb2Nlc3MobjEsIG4yLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCwgXHJcbiAgICAvLyBwbGF0Zm9ybS1zcGVjaWZpYyBpbXBsIHBhc3NlZCBmcm9tIHJlbmRlcmVyXHJcbiAgICByZW5kZXJlckludGVybmFscykge1xyXG4gICAgICAgIGlmIChuMSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG1vdW50U3VzcGVuc2UobjIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkLCByZW5kZXJlckludGVybmFscyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwYXRjaFN1c3BlbnNlKG4xLCBuMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgaXNTVkcsIG9wdGltaXplZCwgcmVuZGVyZXJJbnRlcm5hbHMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBoeWRyYXRlOiBoeWRyYXRlU3VzcGVuc2VcclxufTtcclxuLy8gRm9yY2UtY2FzdGVkIHB1YmxpYyB0eXBpbmcgZm9yIGggYW5kIFRTWCBwcm9wcyBpbmZlcmVuY2VcclxuY29uc3QgU3VzcGVuc2UgPSAoIFN1c3BlbnNlSW1wbFxyXG4gICAgKTtcclxuZnVuY3Rpb24gbW91bnRTdXNwZW5zZShuMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQsIHJlbmRlcmVySW50ZXJuYWxzKSB7XHJcbiAgICBjb25zdCB7IHA6IHBhdGNoLCBvOiB7IGNyZWF0ZUVsZW1lbnQgfSB9ID0gcmVuZGVyZXJJbnRlcm5hbHM7XHJcbiAgICBjb25zdCBoaWRkZW5Db250YWluZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNvbnN0IHN1c3BlbnNlID0gKG4yLnN1c3BlbnNlID0gY3JlYXRlU3VzcGVuc2VCb3VuZGFyeShuMiwgcGFyZW50U3VzcGVuc2UsIHBhcmVudENvbXBvbmVudCwgY29udGFpbmVyLCBoaWRkZW5Db250YWluZXIsIGFuY2hvciwgaXNTVkcsIG9wdGltaXplZCwgcmVuZGVyZXJJbnRlcm5hbHMpKTtcclxuICAgIC8vIHN0YXJ0IG1vdW50aW5nIHRoZSBjb250ZW50IHN1YnRyZWUgaW4gYW4gb2ZmLWRvbSBjb250YWluZXJcclxuICAgIHBhdGNoKG51bGwsIHN1c3BlbnNlLnN1YlRyZWUsIGhpZGRlbkNvbnRhaW5lciwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCBzdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCk7XHJcbiAgICAvLyBub3cgY2hlY2sgaWYgd2UgaGF2ZSBlbmNvdW50ZXJlZCBhbnkgYXN5bmMgZGVwc1xyXG4gICAgaWYgKHN1c3BlbnNlLmRlcHMgPiAwKSB7XHJcbiAgICAgICAgLy8gbW91bnQgdGhlIGZhbGxiYWNrIHRyZWVcclxuICAgICAgICBwYXRjaChudWxsLCBzdXNwZW5zZS5mYWxsYmFja1RyZWUsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIG51bGwsIC8vIGZhbGxiYWNrIHRyZWUgd2lsbCBub3QgaGF2ZSBzdXNwZW5zZSBjb250ZXh0XHJcbiAgICAgICAgaXNTVkcsIG9wdGltaXplZCk7XHJcbiAgICAgICAgbjIuZWwgPSBzdXNwZW5zZS5mYWxsYmFja1RyZWUuZWw7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBTdXNwZW5zZSBoYXMgbm8gYXN5bmMgZGVwcy4gSnVzdCByZXNvbHZlLlxyXG4gICAgICAgIHN1c3BlbnNlLnJlc29sdmUoKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBwYXRjaFN1c3BlbnNlKG4xLCBuMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgaXNTVkcsIG9wdGltaXplZCwgeyBwOiBwYXRjaCB9KSB7XHJcbiAgICBjb25zdCBzdXNwZW5zZSA9IChuMi5zdXNwZW5zZSA9IG4xLnN1c3BlbnNlKTtcclxuICAgIHN1c3BlbnNlLnZub2RlID0gbjI7XHJcbiAgICBjb25zdCB7IGNvbnRlbnQsIGZhbGxiYWNrIH0gPSBub3JtYWxpemVTdXNwZW5zZUNoaWxkcmVuKG4yKTtcclxuICAgIGNvbnN0IG9sZFN1YlRyZWUgPSBzdXNwZW5zZS5zdWJUcmVlO1xyXG4gICAgY29uc3Qgb2xkRmFsbGJhY2tUcmVlID0gc3VzcGVuc2UuZmFsbGJhY2tUcmVlO1xyXG4gICAgaWYgKCFzdXNwZW5zZS5pc1Jlc29sdmVkKSB7XHJcbiAgICAgICAgcGF0Y2gob2xkU3ViVHJlZSwgY29udGVudCwgc3VzcGVuc2UuaGlkZGVuQ29udGFpbmVyLCBudWxsLCBwYXJlbnRDb21wb25lbnQsIHN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICBpZiAoc3VzcGVuc2UuZGVwcyA+IDApIHtcclxuICAgICAgICAgICAgLy8gc3RpbGwgcGVuZGluZy4gcGF0Y2ggdGhlIGZhbGxiYWNrIHRyZWUuXHJcbiAgICAgICAgICAgIHBhdGNoKG9sZEZhbGxiYWNrVHJlZSwgZmFsbGJhY2ssIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIG51bGwsIC8vIGZhbGxiYWNrIHRyZWUgd2lsbCBub3QgaGF2ZSBzdXNwZW5zZSBjb250ZXh0XHJcbiAgICAgICAgICAgIGlzU1ZHLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgICAgICBuMi5lbCA9IGZhbGxiYWNrLmVsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBkZXBzIHNvbWVob3cgYmVjb21lcyAwIGFmdGVyIHRoZSBwYXRjaCBpdCBtZWFucyB0aGUgcGF0Y2ggY2F1c2VkIGFuXHJcbiAgICAgICAgLy8gYXN5bmMgZGVwIGNvbXBvbmVudCB0byB1bm1vdW50IGFuZCByZW1vdmVkIGl0cyBkZXAuIEl0IHdpbGwgY2F1c2UgdGhlXHJcbiAgICAgICAgLy8gc3VzcGVuc2UgdG8gcmVzb2x2ZSBhbmQgd2UgZG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZyBoZXJlLlxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8ganVzdCBub3JtYWwgcGF0Y2ggaW5uZXIgY29udGVudCBhcyBhIGZyYWdtZW50XHJcbiAgICAgICAgcGF0Y2gob2xkU3ViVHJlZSwgY29udGVudCwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgc3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgIG4yLmVsID0gY29udGVudC5lbDtcclxuICAgIH1cclxuICAgIHN1c3BlbnNlLnN1YlRyZWUgPSBjb250ZW50O1xyXG4gICAgc3VzcGVuc2UuZmFsbGJhY2tUcmVlID0gZmFsbGJhY2s7XHJcbn1cclxubGV0IGhhc1dhcm5lZCA9IGZhbHNlO1xyXG5mdW5jdGlvbiBjcmVhdGVTdXNwZW5zZUJvdW5kYXJ5KHZub2RlLCBwYXJlbnQsIHBhcmVudENvbXBvbmVudCwgY29udGFpbmVyLCBoaWRkZW5Db250YWluZXIsIGFuY2hvciwgaXNTVkcsIG9wdGltaXplZCwgcmVuZGVyZXJJbnRlcm5hbHMsIGlzSHlkcmF0aW5nID0gZmFsc2UpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiAhZmFsc2UgJiYgIWhhc1dhcm5lZCkge1xyXG4gICAgICAgIGhhc1dhcm5lZCA9IHRydWU7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZSBgY29uc29sZS5pbmZvYCBjYW5ub3QgYmUgbnVsbCBlcnJvclxyXG4gICAgICAgIGNvbnNvbGVbY29uc29sZS5pbmZvID8gJ2luZm8nIDogJ2xvZyddKGA8U3VzcGVuc2U+IGlzIGFuIGV4cGVyaW1lbnRhbCBmZWF0dXJlIGFuZCBpdHMgQVBJIHdpbGwgbGlrZWx5IGNoYW5nZS5gKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgcDogcGF0Y2gsIG06IG1vdmUsIHVtOiB1bm1vdW50LCBuOiBuZXh0LCBvOiB7IHBhcmVudE5vZGUgfSB9ID0gcmVuZGVyZXJJbnRlcm5hbHM7XHJcbiAgICBjb25zdCBnZXRDdXJyZW50VHJlZSA9ICgpID0+IHN1c3BlbnNlLmlzUmVzb2x2ZWQgfHwgc3VzcGVuc2UuaXNIeWRyYXRpbmdcclxuICAgICAgICA/IHN1c3BlbnNlLnN1YlRyZWVcclxuICAgICAgICA6IHN1c3BlbnNlLmZhbGxiYWNrVHJlZTtcclxuICAgIGNvbnN0IHsgY29udGVudCwgZmFsbGJhY2sgfSA9IG5vcm1hbGl6ZVN1c3BlbnNlQ2hpbGRyZW4odm5vZGUpO1xyXG4gICAgY29uc3Qgc3VzcGVuc2UgPSB7XHJcbiAgICAgICAgdm5vZGUsXHJcbiAgICAgICAgcGFyZW50LFxyXG4gICAgICAgIHBhcmVudENvbXBvbmVudCxcclxuICAgICAgICBpc1NWRyxcclxuICAgICAgICBvcHRpbWl6ZWQsXHJcbiAgICAgICAgY29udGFpbmVyLFxyXG4gICAgICAgIGhpZGRlbkNvbnRhaW5lcixcclxuICAgICAgICBhbmNob3IsXHJcbiAgICAgICAgZGVwczogMCxcclxuICAgICAgICBzdWJUcmVlOiBjb250ZW50LFxyXG4gICAgICAgIGZhbGxiYWNrVHJlZTogZmFsbGJhY2ssXHJcbiAgICAgICAgaXNIeWRyYXRpbmcsXHJcbiAgICAgICAgaXNSZXNvbHZlZDogZmFsc2UsXHJcbiAgICAgICAgaXNVbm1vdW50ZWQ6IGZhbHNlLFxyXG4gICAgICAgIGVmZmVjdHM6IFtdLFxyXG4gICAgICAgIHJlc29sdmUoKSB7XHJcbiAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdXNwZW5zZS5pc1Jlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGByZXNvbHZlU3VzcGVuc2UoKSBpcyBjYWxsZWQgb24gYW4gYWxyZWFkeSByZXNvbHZlZCBzdXNwZW5zZSBib3VuZGFyeS5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzdXNwZW5zZS5pc1VubW91bnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgcmVzb2x2ZVN1c3BlbnNlKCkgaXMgY2FsbGVkIG9uIGFuIGFscmVhZHkgdW5tb3VudGVkIHN1c3BlbnNlIGJvdW5kYXJ5LmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdm5vZGUsIHN1YlRyZWUsIGZhbGxiYWNrVHJlZSwgZWZmZWN0cywgcGFyZW50Q29tcG9uZW50LCBjb250YWluZXIgfSA9IHN1c3BlbnNlO1xyXG4gICAgICAgICAgICBpZiAoc3VzcGVuc2UuaXNIeWRyYXRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHN1c3BlbnNlLmlzSHlkcmF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGluaXRpYWwgYW5jaG9yIG9uIG1vdW50XHJcbiAgICAgICAgICAgICAgICBsZXQgeyBhbmNob3IgfSA9IHN1c3BlbnNlO1xyXG4gICAgICAgICAgICAgICAgLy8gdW5tb3VudCBmYWxsYmFjayB0cmVlXHJcbiAgICAgICAgICAgICAgICBpZiAoZmFsbGJhY2tUcmVlLmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGZhbGxiYWNrIHRyZWUgd2FzIG1vdW50ZWQsIGl0IG1heSBoYXZlIGJlZW4gbW92ZWRcclxuICAgICAgICAgICAgICAgICAgICAvLyBhcyBwYXJ0IG9mIGEgcGFyZW50IHN1c3BlbnNlLiBnZXQgdGhlIGxhdGVzdCBhbmNob3IgZm9yIGluc2VydGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvciA9IG5leHQoZmFsbGJhY2tUcmVlKTtcclxuICAgICAgICAgICAgICAgICAgICB1bm1vdW50KGZhbGxiYWNrVHJlZSwgcGFyZW50Q29tcG9uZW50LCBzdXNwZW5zZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBtb3ZlIGNvbnRlbnQgZnJvbSBvZmYtZG9tIGNvbnRhaW5lciB0byBhY3R1YWwgY29udGFpbmVyXHJcbiAgICAgICAgICAgICAgICBtb3ZlKHN1YlRyZWUsIGNvbnRhaW5lciwgYW5jaG9yLCAwIC8qIEVOVEVSICovKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBlbCA9ICh2bm9kZS5lbCA9IHN1YlRyZWUuZWwpO1xyXG4gICAgICAgICAgICAvLyBzdXNwZW5zZSBhcyB0aGUgcm9vdCBub2RlIG9mIGEgY29tcG9uZW50Li4uXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRDb21wb25lbnQgJiYgcGFyZW50Q29tcG9uZW50LnN1YlRyZWUgPT09IHZub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQudm5vZGUuZWwgPSBlbDtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUhPQ0hvc3RFbChwYXJlbnRDb21wb25lbnQsIGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSBpcyBhIHBlbmRpbmcgcGFyZW50IHN1c3BlbnNlXHJcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSBzdXNwZW5zZS5wYXJlbnQ7XHJcbiAgICAgICAgICAgIGxldCBoYXNVbnJlc29sdmVkQW5jZXN0b3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJlbnQuaXNSZXNvbHZlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGZvdW5kIGEgcGVuZGluZyBwYXJlbnQgc3VzcGVuc2UsIG1lcmdlIGJ1ZmZlcmVkIHBvc3Qgam9ic1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGludG8gdGhhdCBwYXJlbnRcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuZWZmZWN0cy5wdXNoKC4uLmVmZmVjdHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc1VucmVzb2x2ZWRBbmNlc3RvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIG5vIHBlbmRpbmcgcGFyZW50IHN1c3BlbnNlLCBmbHVzaCBhbGwgam9ic1xyXG4gICAgICAgICAgICBpZiAoIWhhc1VucmVzb2x2ZWRBbmNlc3Rvcikge1xyXG4gICAgICAgICAgICAgICAgcXVldWVQb3N0Rmx1c2hDYihlZmZlY3RzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXNwZW5zZS5pc1Jlc29sdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgc3VzcGVuc2UuZWZmZWN0cyA9IFtdO1xyXG4gICAgICAgICAgICAvLyBpbnZva2UgQHJlc29sdmUgZXZlbnRcclxuICAgICAgICAgICAgY29uc3Qgb25SZXNvbHZlID0gdm5vZGUucHJvcHMgJiYgdm5vZGUucHJvcHMub25SZXNvbHZlO1xyXG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihvblJlc29sdmUpKSB7XHJcbiAgICAgICAgICAgICAgICBvblJlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVjZWRlKCkge1xyXG4gICAgICAgICAgICBzdXNwZW5zZS5pc1Jlc29sdmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdm5vZGUsIHN1YlRyZWUsIGZhbGxiYWNrVHJlZSwgcGFyZW50Q29tcG9uZW50LCBjb250YWluZXIsIGhpZGRlbkNvbnRhaW5lciwgaXNTVkcsIG9wdGltaXplZCB9ID0gc3VzcGVuc2U7XHJcbiAgICAgICAgICAgIC8vIG1vdmUgY29udGVudCB0cmVlIGJhY2sgdG8gdGhlIG9mZi1kb20gY29udGFpbmVyXHJcbiAgICAgICAgICAgIGNvbnN0IGFuY2hvciA9IG5leHQoc3ViVHJlZSk7XHJcbiAgICAgICAgICAgIG1vdmUoc3ViVHJlZSwgaGlkZGVuQ29udGFpbmVyLCBudWxsLCAxIC8qIExFQVZFICovKTtcclxuICAgICAgICAgICAgLy8gcmVtb3VudCB0aGUgZmFsbGJhY2sgdHJlZVxyXG4gICAgICAgICAgICBwYXRjaChudWxsLCBmYWxsYmFja1RyZWUsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIG51bGwsIC8vIGZhbGxiYWNrIHRyZWUgd2lsbCBub3QgaGF2ZSBzdXNwZW5zZSBjb250ZXh0XHJcbiAgICAgICAgICAgIGlzU1ZHLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgICAgICBjb25zdCBlbCA9ICh2bm9kZS5lbCA9IGZhbGxiYWNrVHJlZS5lbCk7XHJcbiAgICAgICAgICAgIC8vIHN1c3BlbnNlIGFzIHRoZSByb290IG5vZGUgb2YgYSBjb21wb25lbnQuLi5cclxuICAgICAgICAgICAgaWYgKHBhcmVudENvbXBvbmVudCAmJiBwYXJlbnRDb21wb25lbnQuc3ViVHJlZSA9PT0gdm5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudC52bm9kZS5lbCA9IGVsO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlSE9DSG9zdEVsKHBhcmVudENvbXBvbmVudCwgZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGludm9rZSBAcmVjZWRlIGV2ZW50XHJcbiAgICAgICAgICAgIGNvbnN0IG9uUmVjZWRlID0gdm5vZGUucHJvcHMgJiYgdm5vZGUucHJvcHMub25SZWNlZGU7XHJcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKG9uUmVjZWRlKSkge1xyXG4gICAgICAgICAgICAgICAgb25SZWNlZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW92ZShjb250YWluZXIsIGFuY2hvciwgdHlwZSkge1xyXG4gICAgICAgICAgICBtb3ZlKGdldEN1cnJlbnRUcmVlKCksIGNvbnRhaW5lciwgYW5jaG9yLCB0eXBlKTtcclxuICAgICAgICAgICAgc3VzcGVuc2UuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmV4dCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQoZ2V0Q3VycmVudFRyZWUoKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWdpc3RlckRlcChpbnN0YW5jZSwgc2V0dXBSZW5kZXJFZmZlY3QpIHtcclxuICAgICAgICAgICAgLy8gc3VzcGVuc2UgaXMgYWxyZWFkeSByZXNvbHZlZCwgbmVlZCB0byByZWNlZGUuXHJcbiAgICAgICAgICAgIC8vIHVzZSBxdWV1ZUpvYiBzbyBpdCdzIGhhbmRsZWQgc3luY2hyb25vdXNseSBhZnRlciBwYXRjaGluZyB0aGUgY3VycmVudFxyXG4gICAgICAgICAgICAvLyBzdXNwZW5zZSB0cmVlXHJcbiAgICAgICAgICAgIGlmIChzdXNwZW5zZS5pc1Jlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICBxdWV1ZUpvYigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VzcGVuc2UucmVjZWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBoeWRyYXRlZEVsID0gaW5zdGFuY2Uudm5vZGUuZWw7XHJcbiAgICAgICAgICAgIHN1c3BlbnNlLmRlcHMrKztcclxuICAgICAgICAgICAgaW5zdGFuY2VcclxuICAgICAgICAgICAgICAgIC5hc3luY0RlcC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlRXJyb3IoZXJyLCBpbnN0YW5jZSwgMCAvKiBTRVRVUF9GVU5DVElPTiAqLyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihhc3luY1NldHVwUmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIHJldHJ5IHdoZW4gdGhlIHNldHVwKCkgcHJvbWlzZSByZXNvbHZlcy5cclxuICAgICAgICAgICAgICAgIC8vIGNvbXBvbmVudCBtYXkgaGF2ZSBiZWVuIHVubW91bnRlZCBiZWZvcmUgcmVzb2x2ZS5cclxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZS5pc1VubW91bnRlZCB8fCBzdXNwZW5zZS5pc1VubW91bnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN1c3BlbnNlLmRlcHMtLTtcclxuICAgICAgICAgICAgICAgIC8vIHJldHJ5IGZyb20gdGhpcyBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmFzeW5jUmVzb2x2ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeyB2bm9kZSB9ID0gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHVzaFdhcm5pbmdDb250ZXh0KHZub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhhbmRsZVNldHVwUmVzdWx0KGluc3RhbmNlLCBhc3luY1NldHVwUmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIGlmIChoeWRyYXRlZEVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdm5vZGUgbWF5IGhhdmUgYmVlbiByZXBsYWNlZCBpZiBhbiB1cGRhdGUgaGFwcGVuZWQgYmVmb3JlIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFzeW5jIGRlcCBpcyByZXNvbHZlZC5cclxuICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbCA9IGh5ZHJhdGVkRWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzZXR1cFJlbmRlckVmZmVjdChpbnN0YW5jZSwgdm5vZGUsIFxyXG4gICAgICAgICAgICAgICAgLy8gY29tcG9uZW50IG1heSBoYXZlIGJlZW4gbW92ZWQgYmVmb3JlIHJlc29sdmUuXHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGlzIGlzIG5vdCBhIGh5ZHJhdGlvbiwgaW5zdGFuY2Uuc3ViVHJlZSB3aWxsIGJlIHRoZSBjb21tZW50XHJcbiAgICAgICAgICAgICAgICAvLyBwbGFjZWhvbGRlci5cclxuICAgICAgICAgICAgICAgIGh5ZHJhdGVkRWxcclxuICAgICAgICAgICAgICAgICAgICA/IHBhcmVudE5vZGUoaHlkcmF0ZWRFbClcclxuICAgICAgICAgICAgICAgICAgICA6IHBhcmVudE5vZGUoaW5zdGFuY2Uuc3ViVHJlZS5lbCksIFxyXG4gICAgICAgICAgICAgICAgLy8gYW5jaG9yIHdpbGwgbm90IGJlIHVzZWQgaWYgdGhpcyBpcyBoeWRyYXRpb24sIHNvIG9ubHkgbmVlZCB0b1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc2lkZXIgdGhlIGNvbW1lbnQgcGxhY2Vob2xkZXIgY2FzZS5cclxuICAgICAgICAgICAgICAgIGh5ZHJhdGVkRWwgPyBudWxsIDogbmV4dChpbnN0YW5jZS5zdWJUcmVlKSwgc3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlSE9DSG9zdEVsKGluc3RhbmNlLCB2bm9kZS5lbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wV2FybmluZ0NvbnRleHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzdXNwZW5zZS5kZXBzID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VzcGVuc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVubW91bnQocGFyZW50U3VzcGVuc2UsIGRvUmVtb3ZlKSB7XHJcbiAgICAgICAgICAgIHN1c3BlbnNlLmlzVW5tb3VudGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdW5tb3VudChzdXNwZW5zZS5zdWJUcmVlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBkb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIGlmICghc3VzcGVuc2UuaXNSZXNvbHZlZCkge1xyXG4gICAgICAgICAgICAgICAgdW5tb3VudChzdXNwZW5zZS5mYWxsYmFja1RyZWUsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGRvUmVtb3ZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gc3VzcGVuc2U7XHJcbn1cclxuZnVuY3Rpb24gaHlkcmF0ZVN1c3BlbnNlKG5vZGUsIHZub2RlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkLCByZW5kZXJlckludGVybmFscywgaHlkcmF0ZU5vZGUpIHtcclxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xyXG4gICAgY29uc3Qgc3VzcGVuc2UgPSAodm5vZGUuc3VzcGVuc2UgPSBjcmVhdGVTdXNwZW5zZUJvdW5kYXJ5KHZub2RlLCBwYXJlbnRTdXNwZW5zZSwgcGFyZW50Q29tcG9uZW50LCBub2RlLnBhcmVudE5vZGUsIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBudWxsLCBpc1NWRywgb3B0aW1pemVkLCByZW5kZXJlckludGVybmFscywgdHJ1ZSAvKiBoeWRyYXRpbmcgKi8pKTtcclxuICAgIC8vIHRoZXJlIGFyZSB0d28gcG9zc2libGUgc2NlbmFyaW9zIGZvciBzZXJ2ZXItcmVuZGVyZWQgc3VzcGVuc2U6XHJcbiAgICAvLyAtIHN1Y2Nlc3M6IHNzciBjb250ZW50IHNob3VsZCBiZSBmdWxseSByZXNvbHZlZFxyXG4gICAgLy8gLSBmYWlsdXJlOiBzc3IgY29udGVudCBzaG91bGQgYmUgdGhlIGZhbGxiYWNrIGJyYW5jaC5cclxuICAgIC8vIGhvd2V2ZXIsIG9uIHRoZSBjbGllbnQgd2UgZG9uJ3QgcmVhbGx5IGtub3cgaWYgaXQgaGFzIGZhaWxlZCBvciBub3RcclxuICAgIC8vIGF0dGVtcHQgdG8gaHlkcmF0ZSB0aGUgRE9NIGFzc3VtaW5nIGl0IGhhcyBzdWNjZWVkZWQsIGJ1dCB3ZSBzdGlsbFxyXG4gICAgLy8gbmVlZCB0byBjb25zdHJ1Y3QgYSBzdXNwZW5zZSBib3VuZGFyeSBmaXJzdFxyXG4gICAgY29uc3QgcmVzdWx0ID0gaHlkcmF0ZU5vZGUobm9kZSwgc3VzcGVuc2Uuc3ViVHJlZSwgcGFyZW50Q29tcG9uZW50LCBzdXNwZW5zZSwgb3B0aW1pemVkKTtcclxuICAgIGlmIChzdXNwZW5zZS5kZXBzID09PSAwKSB7XHJcbiAgICAgICAgc3VzcGVuc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIC8qIGVzbGludC1lbmFibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXHJcbn1cclxuZnVuY3Rpb24gbm9ybWFsaXplU3VzcGVuc2VDaGlsZHJlbih2bm9kZSkge1xyXG4gICAgY29uc3QgeyBzaGFwZUZsYWcsIGNoaWxkcmVuIH0gPSB2bm9kZTtcclxuICAgIGlmIChzaGFwZUZsYWcgJiAzMiAvKiBTTE9UU19DSElMRFJFTiAqLykge1xyXG4gICAgICAgIGNvbnN0IHsgZGVmYXVsdDogZCwgZmFsbGJhY2sgfSA9IGNoaWxkcmVuO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IG5vcm1hbGl6ZVZOb2RlKGlzRnVuY3Rpb24oZCkgPyBkKCkgOiBkKSxcclxuICAgICAgICAgICAgZmFsbGJhY2s6IG5vcm1hbGl6ZVZOb2RlKGlzRnVuY3Rpb24oZmFsbGJhY2spID8gZmFsbGJhY2soKSA6IGZhbGxiYWNrKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjb250ZW50OiBub3JtYWxpemVWTm9kZShjaGlsZHJlbiksXHJcbiAgICAgICAgICAgIGZhbGxiYWNrOiBub3JtYWxpemVWTm9kZShudWxsKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcXVldWVFZmZlY3RXaXRoU3VzcGVuc2UoZm4sIHN1c3BlbnNlKSB7XHJcbiAgICBpZiAoc3VzcGVuc2UgJiYgIXN1c3BlbnNlLmlzUmVzb2x2ZWQpIHtcclxuICAgICAgICBpZiAoaXNBcnJheShmbikpIHtcclxuICAgICAgICAgICAgc3VzcGVuc2UuZWZmZWN0cy5wdXNoKC4uLmZuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHN1c3BlbnNlLmVmZmVjdHMucHVzaChmbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcXVldWVQb3N0Rmx1c2hDYihmbik7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIFdyYXAgYSBzbG90IGZ1bmN0aW9uIHRvIG1lbW9pemUgY3VycmVudCByZW5kZXJpbmcgaW5zdGFuY2VcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIHdpdGhDdHgoZm4sIGN0eCA9IGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZSkge1xyXG4gICAgaWYgKCFjdHgpXHJcbiAgICAgICAgcmV0dXJuIGZuO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlbmRlckZuV2l0aENvbnRleHQoKSB7XHJcbiAgICAgICAgY29uc3Qgb3duZXIgPSBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2U7XHJcbiAgICAgICAgc2V0Q3VycmVudFJlbmRlcmluZ0luc3RhbmNlKGN0eCk7XHJcbiAgICAgICAgY29uc3QgcmVzID0gZm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcclxuICAgICAgICBzZXRDdXJyZW50UmVuZGVyaW5nSW5zdGFuY2Uob3duZXIpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9O1xyXG59XG5cbi8vIFNGQyBzY29wZWQgc3R5bGUgSUQgbWFuYWdlbWVudC5cclxubGV0IGN1cnJlbnRTY29wZUlkID0gbnVsbDtcclxuY29uc3Qgc2NvcGVJZFN0YWNrID0gW107XHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gcHVzaFNjb3BlSWQoaWQpIHtcclxuICAgIHNjb3BlSWRTdGFjay5wdXNoKChjdXJyZW50U2NvcGVJZCA9IGlkKSk7XHJcbn1cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBwb3BTY29wZUlkKCkge1xyXG4gICAgc2NvcGVJZFN0YWNrLnBvcCgpO1xyXG4gICAgY3VycmVudFNjb3BlSWQgPSBzY29wZUlkU3RhY2tbc2NvcGVJZFN0YWNrLmxlbmd0aCAtIDFdIHx8IG51bGw7XHJcbn1cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiB3aXRoU2NvcGVJZChpZCkge1xyXG4gICAgcmV0dXJuICgoZm4pID0+IHdpdGhDdHgoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHB1c2hTY29wZUlkKGlkKTtcclxuICAgICAgICBjb25zdCByZXMgPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIHBvcFNjb3BlSWQoKTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfSkpO1xyXG59XG5cbmNvbnN0IGlzVGVsZXBvcnQgPSAodHlwZSkgPT4gdHlwZS5fX2lzVGVsZXBvcnQ7XHJcbmNvbnN0IGlzVGVsZXBvcnREaXNhYmxlZCA9IChwcm9wcykgPT4gcHJvcHMgJiYgKHByb3BzLmRpc2FibGVkIHx8IHByb3BzLmRpc2FibGVkID09PSAnJyk7XHJcbmNvbnN0IHJlc29sdmVUYXJnZXQgPSAocHJvcHMsIHNlbGVjdCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0U2VsZWN0b3IgPSBwcm9wcyAmJiBwcm9wcy50bztcclxuICAgIGlmIChpc1N0cmluZyh0YXJnZXRTZWxlY3RvcikpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdCkge1xyXG4gICAgICAgICAgICAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiZcclxuICAgICAgICAgICAgICAgIHdhcm4oYEN1cnJlbnQgcmVuZGVyZXIgZG9lcyBub3Qgc3VwcG9ydCBzdHJpbmcgdGFyZ2V0IGZvciBUZWxlcG9ydHMuIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGAobWlzc2luZyBxdWVyeVNlbGVjdG9yIHJlbmRlcmVyIG9wdGlvbilgKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBzZWxlY3QodGFyZ2V0U2VsZWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoIXRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgRmFpbGVkIHRvIGxvY2F0ZSBUZWxlcG9ydCB0YXJnZXQgd2l0aCBzZWxlY3RvciBcIiR7dGFyZ2V0U2VsZWN0b3J9XCIuIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBgTm90ZSB0aGUgdGFyZ2V0IGVsZW1lbnQgbXVzdCBleGlzdCBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkIC0gYCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGBpLmUuIHRoZSB0YXJnZXQgY2Fubm90IGJlIHJlbmRlcmVkIGJ5IHRoZSBjb21wb25lbnQgaXRzZWxmLCBhbmQgYCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGBpZGVhbGx5IHNob3VsZCBiZSBvdXRzaWRlIG9mIHRoZSBlbnRpcmUgVnVlIGNvbXBvbmVudCB0cmVlLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiAhdGFyZ2V0U2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgd2FybihgSW52YWxpZCBUZWxlcG9ydCB0YXJnZXQ6ICR7dGFyZ2V0U2VsZWN0b3J9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXRTZWxlY3RvcjtcclxuICAgIH1cclxufTtcclxuY29uc3QgVGVsZXBvcnRJbXBsID0ge1xyXG4gICAgX19pc1RlbGVwb3J0OiB0cnVlLFxyXG4gICAgcHJvY2VzcyhuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkLCBpbnRlcm5hbHMpIHtcclxuICAgICAgICBjb25zdCB7IG1jOiBtb3VudENoaWxkcmVuLCBwYzogcGF0Y2hDaGlsZHJlbiwgcGJjOiBwYXRjaEJsb2NrQ2hpbGRyZW4sIG86IHsgaW5zZXJ0LCBxdWVyeVNlbGVjdG9yLCBjcmVhdGVUZXh0LCBjcmVhdGVDb21tZW50IH0gfSA9IGludGVybmFscztcclxuICAgICAgICBjb25zdCBkaXNhYmxlZCA9IGlzVGVsZXBvcnREaXNhYmxlZChuMi5wcm9wcyk7XHJcbiAgICAgICAgY29uc3QgeyBzaGFwZUZsYWcsIGNoaWxkcmVuIH0gPSBuMjtcclxuICAgICAgICBpZiAobjEgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyBpbnNlcnQgYW5jaG9ycyBpbiB0aGUgbWFpbiB2aWV3XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gKG4yLmVsID0gKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpXHJcbiAgICAgICAgICAgICAgICA/IGNyZWF0ZUNvbW1lbnQoJ3RlbGVwb3J0IHN0YXJ0JylcclxuICAgICAgICAgICAgICAgIDogY3JlYXRlVGV4dCgnJykpO1xyXG4gICAgICAgICAgICBjb25zdCBtYWluQW5jaG9yID0gKG4yLmFuY2hvciA9IChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgPyBjcmVhdGVDb21tZW50KCd0ZWxlcG9ydCBlbmQnKVxyXG4gICAgICAgICAgICAgICAgOiBjcmVhdGVUZXh0KCcnKSk7XHJcbiAgICAgICAgICAgIGluc2VydChwbGFjZWhvbGRlciwgY29udGFpbmVyLCBhbmNob3IpO1xyXG4gICAgICAgICAgICBpbnNlcnQobWFpbkFuY2hvciwgY29udGFpbmVyLCBhbmNob3IpO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSAobjIudGFyZ2V0ID0gcmVzb2x2ZVRhcmdldChuMi5wcm9wcywgcXVlcnlTZWxlY3RvcikpO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRBbmNob3IgPSAobjIudGFyZ2V0QW5jaG9yID0gY3JlYXRlVGV4dCgnJykpO1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBpbnNlcnQodGFyZ2V0QW5jaG9yLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgd2FybignSW52YWxpZCBUZWxlcG9ydCB0YXJnZXQgb24gbW91bnQ6JywgdGFyZ2V0LCBgKCR7dHlwZW9mIHRhcmdldH0pYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbW91bnQgPSAoY29udGFpbmVyLCBhbmNob3IpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFRlbGVwb3J0ICphbHdheXMqIGhhcyBBcnJheSBjaGlsZHJlbi4gVGhpcyBpcyBlbmZvcmNlZCBpbiBib3RoIHRoZVxyXG4gICAgICAgICAgICAgICAgLy8gY29tcGlsZXIgYW5kIHZub2RlIGNoaWxkcmVuIG5vcm1hbGl6YXRpb24uXHJcbiAgICAgICAgICAgICAgICBpZiAoc2hhcGVGbGFnICYgMTYgLyogQVJSQVlfQ0hJTERSRU4gKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICBtb3VudENoaWxkcmVuKGNoaWxkcmVuLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChkaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgbW91bnQoY29udGFpbmVyLCBtYWluQW5jaG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIG1vdW50KHRhcmdldCwgdGFyZ2V0QW5jaG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdXBkYXRlIGNvbnRlbnRcclxuICAgICAgICAgICAgbjIuZWwgPSBuMS5lbDtcclxuICAgICAgICAgICAgY29uc3QgbWFpbkFuY2hvciA9IChuMi5hbmNob3IgPSBuMS5hbmNob3IpO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSAobjIudGFyZ2V0ID0gbjEudGFyZ2V0KTtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0QW5jaG9yID0gKG4yLnRhcmdldEFuY2hvciA9IG4xLnRhcmdldEFuY2hvcik7XHJcbiAgICAgICAgICAgIGNvbnN0IHdhc0Rpc2FibGVkID0gaXNUZWxlcG9ydERpc2FibGVkKG4xLnByb3BzKTtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENvbnRhaW5lciA9IHdhc0Rpc2FibGVkID8gY29udGFpbmVyIDogdGFyZ2V0O1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50QW5jaG9yID0gd2FzRGlzYWJsZWQgPyBtYWluQW5jaG9yIDogdGFyZ2V0QW5jaG9yO1xyXG4gICAgICAgICAgICBpZiAobjIuZHluYW1pY0NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmYXN0IHBhdGggd2hlbiB0aGUgdGVsZXBvcnQgaGFwcGVucyB0byBiZSBhIGJsb2NrIHJvb3RcclxuICAgICAgICAgICAgICAgIHBhdGNoQmxvY2tDaGlsZHJlbihuMS5keW5hbWljQ2hpbGRyZW4sIG4yLmR5bmFtaWNDaGlsZHJlbiwgY3VycmVudENvbnRhaW5lciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCFvcHRpbWl6ZWQpIHtcclxuICAgICAgICAgICAgICAgIHBhdGNoQ2hpbGRyZW4objEsIG4yLCBjdXJyZW50Q29udGFpbmVyLCBjdXJyZW50QW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXdhc0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZW5hYmxlZCAtPiBkaXNhYmxlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vdmUgaW50byBtYWluIGNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgICAgIG1vdmVUZWxlcG9ydChuMiwgY29udGFpbmVyLCBtYWluQW5jaG9yLCBpbnRlcm5hbHMsIDEgLyogVE9HR0xFICovKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHRhcmdldCBjaGFuZ2VkXHJcbiAgICAgICAgICAgICAgICBpZiAoKG4yLnByb3BzICYmIG4yLnByb3BzLnRvKSAhPT0gKG4xLnByb3BzICYmIG4xLnByb3BzLnRvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRUYXJnZXQgPSAobjIudGFyZ2V0ID0gcmVzb2x2ZVRhcmdldChuMi5wcm9wcywgcXVlcnlTZWxlY3RvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0VGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVUZWxlcG9ydChuMiwgbmV4dFRhcmdldCwgbnVsbCwgaW50ZXJuYWxzLCAwIC8qIFRBUkdFVF9DSEFOR0UgKi8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2FybignSW52YWxpZCBUZWxlcG9ydCB0YXJnZXQgb24gdXBkYXRlOicsIHRhcmdldCwgYCgke3R5cGVvZiB0YXJnZXR9KWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHdhc0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlzYWJsZWQgLT4gZW5hYmxlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vdmUgaW50byB0ZWxlcG9ydCB0YXJnZXRcclxuICAgICAgICAgICAgICAgICAgICBtb3ZlVGVsZXBvcnQobjIsIHRhcmdldCwgdGFyZ2V0QW5jaG9yLCBpbnRlcm5hbHMsIDEgLyogVE9HR0xFICovKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZW1vdmUodm5vZGUsIHsgcjogcmVtb3ZlLCBvOiB7IHJlbW92ZTogaG9zdFJlbW92ZSB9IH0pIHtcclxuICAgICAgICBjb25zdCB7IHNoYXBlRmxhZywgY2hpbGRyZW4sIGFuY2hvciB9ID0gdm5vZGU7XHJcbiAgICAgICAgaG9zdFJlbW92ZShhbmNob3IpO1xyXG4gICAgICAgIGlmIChzaGFwZUZsYWcgJiAxNiAvKiBBUlJBWV9DSElMRFJFTiAqLykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmUoY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1vdmU6IG1vdmVUZWxlcG9ydCxcclxuICAgIGh5ZHJhdGU6IGh5ZHJhdGVUZWxlcG9ydFxyXG59O1xyXG5mdW5jdGlvbiBtb3ZlVGVsZXBvcnQodm5vZGUsIGNvbnRhaW5lciwgcGFyZW50QW5jaG9yLCB7IG86IHsgaW5zZXJ0IH0sIG06IG1vdmUgfSwgbW92ZVR5cGUgPSAyIC8qIFJFT1JERVIgKi8pIHtcclxuICAgIC8vIG1vdmUgdGFyZ2V0IGFuY2hvciBpZiB0aGlzIGlzIGEgdGFyZ2V0IGNoYW5nZS5cclxuICAgIGlmIChtb3ZlVHlwZSA9PT0gMCAvKiBUQVJHRVRfQ0hBTkdFICovKSB7XHJcbiAgICAgICAgaW5zZXJ0KHZub2RlLnRhcmdldEFuY2hvciwgY29udGFpbmVyLCBwYXJlbnRBbmNob3IpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBlbCwgYW5jaG9yLCBzaGFwZUZsYWcsIGNoaWxkcmVuLCBwcm9wcyB9ID0gdm5vZGU7XHJcbiAgICBjb25zdCBpc1Jlb3JkZXIgPSBtb3ZlVHlwZSA9PT0gMiAvKiBSRU9SREVSICovO1xyXG4gICAgLy8gbW92ZSBtYWluIHZpZXcgYW5jaG9yIGlmIHRoaXMgaXMgYSByZS1vcmRlci5cclxuICAgIGlmIChpc1Jlb3JkZXIpIHtcclxuICAgICAgICBpbnNlcnQoZWwsIGNvbnRhaW5lciwgcGFyZW50QW5jaG9yKTtcclxuICAgIH1cclxuICAgIC8vIGlmIHRoaXMgaXMgYSByZS1vcmRlciBhbmQgdGVsZXBvcnQgaXMgZW5hYmxlZCAoY29udGVudCBpcyBpbiB0YXJnZXQpXHJcbiAgICAvLyBkbyBub3QgbW92ZSBjaGlsZHJlbi4gU28gdGhlIG9wcG9zaXRlIGlzOiBvbmx5IG1vdmUgY2hpbGRyZW4gaWYgdGhpc1xyXG4gICAgLy8gaXMgbm90IGEgcmVvcmRlciwgb3IgdGhlIHRlbGVwb3J0IGlzIGRpc2FibGVkXHJcbiAgICBpZiAoIWlzUmVvcmRlciB8fCBpc1RlbGVwb3J0RGlzYWJsZWQocHJvcHMpKSB7XHJcbiAgICAgICAgLy8gVGVsZXBvcnQgaGFzIGVpdGhlciBBcnJheSBjaGlsZHJlbiBvciBubyBjaGlsZHJlbi5cclxuICAgICAgICBpZiAoc2hhcGVGbGFnICYgMTYgLyogQVJSQVlfQ0hJTERSRU4gKi8pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbW92ZShjaGlsZHJlbltpXSwgY29udGFpbmVyLCBwYXJlbnRBbmNob3IsIDIgLyogUkVPUkRFUiAqLyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBtb3ZlIG1haW4gdmlldyBhbmNob3IgaWYgdGhpcyBpcyBhIHJlLW9yZGVyLlxyXG4gICAgaWYgKGlzUmVvcmRlcikge1xyXG4gICAgICAgIGluc2VydChhbmNob3IsIGNvbnRhaW5lciwgcGFyZW50QW5jaG9yKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBoeWRyYXRlVGVsZXBvcnQobm9kZSwgdm5vZGUsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIG9wdGltaXplZCwgeyBvOiB7IG5leHRTaWJsaW5nLCBwYXJlbnROb2RlLCBxdWVyeVNlbGVjdG9yIH0gfSwgaHlkcmF0ZUNoaWxkcmVuKSB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSAodm5vZGUudGFyZ2V0ID0gcmVzb2x2ZVRhcmdldCh2bm9kZS5wcm9wcywgcXVlcnlTZWxlY3RvcikpO1xyXG4gICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgIC8vIGlmIG11bHRpcGxlIHRlbGVwb3J0cyByZW5kZXJlZCB0byB0aGUgc2FtZSB0YXJnZXQgZWxlbWVudCwgd2UgbmVlZCB0b1xyXG4gICAgICAgIC8vIHBpY2sgdXAgZnJvbSB3aGVyZSB0aGUgbGFzdCB0ZWxlcG9ydCBmaW5pc2hlZCBpbnN0ZWFkIG9mIHRoZSBmaXJzdCBub2RlXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IHRhcmdldC5fbHBhIHx8IHRhcmdldC5maXJzdENoaWxkO1xyXG4gICAgICAgIGlmICh2bm9kZS5zaGFwZUZsYWcgJiAxNiAvKiBBUlJBWV9DSElMRFJFTiAqLykge1xyXG4gICAgICAgICAgICBpZiAoaXNUZWxlcG9ydERpc2FibGVkKHZub2RlLnByb3BzKSkge1xyXG4gICAgICAgICAgICAgICAgdm5vZGUuYW5jaG9yID0gaHlkcmF0ZUNoaWxkcmVuKG5leHRTaWJsaW5nKG5vZGUpLCB2bm9kZSwgcGFyZW50Tm9kZShub2RlKSwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgb3B0aW1pemVkKTtcclxuICAgICAgICAgICAgICAgIHZub2RlLnRhcmdldEFuY2hvciA9IHRhcmdldE5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2bm9kZS5hbmNob3IgPSBuZXh0U2libGluZyhub2RlKTtcclxuICAgICAgICAgICAgICAgIHZub2RlLnRhcmdldEFuY2hvciA9IGh5ZHJhdGVDaGlsZHJlbih0YXJnZXROb2RlLCB2bm9kZSwgdGFyZ2V0LCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhcmdldC5fbHBhID1cclxuICAgICAgICAgICAgICAgIHZub2RlLnRhcmdldEFuY2hvciAmJiBuZXh0U2libGluZyh2bm9kZS50YXJnZXRBbmNob3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2bm9kZS5hbmNob3IgJiYgbmV4dFNpYmxpbmcodm5vZGUuYW5jaG9yKTtcclxufVxyXG4vLyBGb3JjZS1jYXN0ZWQgcHVibGljIHR5cGluZyBmb3IgaCBhbmQgVFNYIHByb3BzIGluZmVyZW5jZVxyXG5jb25zdCBUZWxlcG9ydCA9IFRlbGVwb3J0SW1wbDtcblxuY29uc3QgQ09NUE9ORU5UUyA9ICdjb21wb25lbnRzJztcclxuY29uc3QgRElSRUNUSVZFUyA9ICdkaXJlY3RpdmVzJztcclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiByZXNvbHZlQ29tcG9uZW50KG5hbWUpIHtcclxuICAgIHJldHVybiByZXNvbHZlQXNzZXQoQ09NUE9ORU5UUywgbmFtZSkgfHwgbmFtZTtcclxufVxyXG5jb25zdCBOVUxMX0RZTkFNSUNfQ09NUE9ORU5UID0gU3ltYm9sKCk7XHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gcmVzb2x2ZUR5bmFtaWNDb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICBpZiAoaXNTdHJpbmcoY29tcG9uZW50KSkge1xyXG4gICAgICAgIHJldHVybiByZXNvbHZlQXNzZXQoQ09NUE9ORU5UUywgY29tcG9uZW50LCBmYWxzZSkgfHwgY29tcG9uZW50O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gaW52YWxpZCB0eXBlcyB3aWxsIGZhbGx0aHJvdWdoIHRvIGNyZWF0ZVZOb2RlIGFuZCByYWlzZSB3YXJuaW5nXHJcbiAgICAgICAgcmV0dXJuIChjb21wb25lbnQgfHwgTlVMTF9EWU5BTUlDX0NPTVBPTkVOVCk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiByZXNvbHZlRGlyZWN0aXZlKG5hbWUpIHtcclxuICAgIHJldHVybiByZXNvbHZlQXNzZXQoRElSRUNUSVZFUywgbmFtZSk7XHJcbn1cclxuLy8gaW1wbGVtZW50YXRpb25cclxuZnVuY3Rpb24gcmVzb2x2ZUFzc2V0KHR5cGUsIG5hbWUsIHdhcm5NaXNzaW5nID0gdHJ1ZSkge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UgfHwgY3VycmVudEluc3RhbmNlO1xyXG4gICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgbGV0IGNhbWVsaXplZCwgY2FwaXRhbGl6ZWQ7XHJcbiAgICAgICAgY29uc3QgcmVnaXN0cnkgPSBpbnN0YW5jZVt0eXBlXTtcclxuICAgICAgICBsZXQgcmVzID0gcmVnaXN0cnlbbmFtZV0gfHxcclxuICAgICAgICAgICAgcmVnaXN0cnlbKGNhbWVsaXplZCA9IGNhbWVsaXplKG5hbWUpKV0gfHxcclxuICAgICAgICAgICAgcmVnaXN0cnlbKGNhcGl0YWxpemVkID0gY2FwaXRhbGl6ZShjYW1lbGl6ZWQpKV07XHJcbiAgICAgICAgaWYgKCFyZXMgJiYgdHlwZSA9PT0gQ09NUE9ORU5UUykge1xyXG4gICAgICAgICAgICBjb25zdCBzZWxmID0gaW5zdGFuY2UudHlwZTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZk5hbWUgPSBzZWxmLmRpc3BsYXlOYW1lIHx8IHNlbGYubmFtZTtcclxuICAgICAgICAgICAgaWYgKHNlbGZOYW1lICYmXHJcbiAgICAgICAgICAgICAgICAoc2VsZk5hbWUgPT09IG5hbWUgfHxcclxuICAgICAgICAgICAgICAgICAgICBzZWxmTmFtZSA9PT0gY2FtZWxpemVkIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZk5hbWUgPT09IGNhcGl0YWxpemVkKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzID0gc2VsZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHdhcm5NaXNzaW5nICYmICFyZXMpIHtcclxuICAgICAgICAgICAgd2FybihgRmFpbGVkIHRvIHJlc29sdmUgJHt0eXBlLnNsaWNlKDAsIC0xKX06ICR7bmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgIHdhcm4oYHJlc29sdmUke2NhcGl0YWxpemUodHlwZS5zbGljZSgwLCAtMSkpfSBgICtcclxuICAgICAgICAgICAgYGNhbiBvbmx5IGJlIHVzZWQgaW4gcmVuZGVyKCkgb3Igc2V0dXAoKS5gKTtcclxuICAgIH1cclxufVxuXG5jb25zdCBGcmFnbWVudCA9IFN5bWJvbCgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgPyAnRnJhZ21lbnQnIDogdW5kZWZpbmVkKTtcclxuY29uc3QgVGV4dCA9IFN5bWJvbCgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgPyAnVGV4dCcgOiB1bmRlZmluZWQpO1xyXG5jb25zdCBDb21tZW50ID0gU3ltYm9sKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSA/ICdDb21tZW50JyA6IHVuZGVmaW5lZCk7XHJcbmNvbnN0IFN0YXRpYyA9IFN5bWJvbCgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgPyAnU3RhdGljJyA6IHVuZGVmaW5lZCk7XHJcbi8vIFNpbmNlIHYtaWYgYW5kIHYtZm9yIGFyZSB0aGUgdHdvIHBvc3NpYmxlIHdheXMgbm9kZSBzdHJ1Y3R1cmUgY2FuIGR5bmFtaWNhbGx5XHJcbi8vIGNoYW5nZSwgb25jZSB3ZSBjb25zaWRlciB2LWlmIGJyYW5jaGVzIGFuZCBlYWNoIHYtZm9yIGZyYWdtZW50IGEgYmxvY2ssIHdlXHJcbi8vIGNhbiBkaXZpZGUgYSB0ZW1wbGF0ZSBpbnRvIG5lc3RlZCBibG9ja3MsIGFuZCB3aXRoaW4gZWFjaCBibG9jayB0aGUgbm9kZVxyXG4vLyBzdHJ1Y3R1cmUgd291bGQgYmUgc3RhYmxlLiBUaGlzIGFsbG93cyB1cyB0byBza2lwIG1vc3QgY2hpbGRyZW4gZGlmZmluZ1xyXG4vLyBhbmQgb25seSB3b3JyeSBhYm91dCB0aGUgZHluYW1pYyBub2RlcyAoaW5kaWNhdGVkIGJ5IHBhdGNoIGZsYWdzKS5cclxuY29uc3QgYmxvY2tTdGFjayA9IFtdO1xyXG5sZXQgY3VycmVudEJsb2NrID0gbnVsbDtcclxuLyoqXHJcbiAqIE9wZW4gYSBibG9jay5cclxuICogVGhpcyBtdXN0IGJlIGNhbGxlZCBiZWZvcmUgYGNyZWF0ZUJsb2NrYC4gSXQgY2Fubm90IGJlIHBhcnQgb2YgYGNyZWF0ZUJsb2NrYFxyXG4gKiBiZWNhdXNlIHRoZSBjaGlsZHJlbiBvZiB0aGUgYmxvY2sgYXJlIGV2YWx1YXRlZCBiZWZvcmUgYGNyZWF0ZUJsb2NrYCBpdHNlbGZcclxuICogaXMgY2FsbGVkLiBUaGUgZ2VuZXJhdGVkIGNvZGUgdHlwaWNhbGx5IGxvb2tzIGxpa2UgdGhpczpcclxuICpcclxuICogYGBganNcclxuICogZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gKiAgIHJldHVybiAob3BlbkJsb2NrKCksY3JlYXRlQmxvY2soJ2RpdicsIG51bGwsIFsuLi5dKSlcclxuICogfVxyXG4gKiBgYGBcclxuICogZGlzYWJsZVRyYWNraW5nIGlzIHRydWUgd2hlbiBjcmVhdGluZyBhIHYtZm9yIGZyYWdtZW50IGJsb2NrLCBzaW5jZSBhIHYtZm9yXHJcbiAqIGZyYWdtZW50IGFsd2F5cyBkaWZmcyBpdHMgY2hpbGRyZW4uXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBvcGVuQmxvY2soZGlzYWJsZVRyYWNraW5nID0gZmFsc2UpIHtcclxuICAgIGJsb2NrU3RhY2sucHVzaCgoY3VycmVudEJsb2NrID0gZGlzYWJsZVRyYWNraW5nID8gbnVsbCA6IFtdKSk7XHJcbn1cclxuLy8gV2hldGhlciB3ZSBzaG91bGQgYmUgdHJhY2tpbmcgZHluYW1pYyBjaGlsZCBub2RlcyBpbnNpZGUgYSBibG9jay5cclxuLy8gT25seSB0cmFja3Mgd2hlbiB0aGlzIHZhbHVlIGlzID4gMFxyXG4vLyBXZSBhcmUgbm90IHVzaW5nIGEgc2ltcGxlIGJvb2xlYW4gYmVjYXVzZSB0aGlzIHZhbHVlIG1heSBuZWVkIHRvIGJlXHJcbi8vIGluY3JlbWVudGVkL2RlY3JlbWVudGVkIGJ5IG5lc3RlZCB1c2FnZSBvZiB2LW9uY2UgKHNlZSBiZWxvdylcclxubGV0IHNob3VsZFRyYWNrID0gMTtcclxuLyoqXHJcbiAqIEJsb2NrIHRyYWNraW5nIHNvbWV0aW1lcyBuZWVkcyB0byBiZSBkaXNhYmxlZCwgZm9yIGV4YW1wbGUgZHVyaW5nIHRoZVxyXG4gKiBjcmVhdGlvbiBvZiBhIHRyZWUgdGhhdCBuZWVkcyB0byBiZSBjYWNoZWQgYnkgdi1vbmNlLiBUaGUgY29tcGlsZXIgZ2VuZXJhdGVzXHJcbiAqIGNvZGUgbGlrZSB0aGlzOlxyXG4gKlxyXG4gKiBgYGAganNcclxuICogX2NhY2hlWzFdIHx8IChcclxuICogICBzZXRCbG9ja1RyYWNraW5nKC0xKSxcclxuICogICBfY2FjaGVbMV0gPSBjcmVhdGVWTm9kZSguLi4pLFxyXG4gKiAgIHNldEJsb2NrVHJhY2tpbmcoMSksXHJcbiAqICAgX2NhY2hlWzFdXHJcbiAqIClcclxuICogYGBgXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRCbG9ja1RyYWNraW5nKHZhbHVlKSB7XHJcbiAgICBzaG91bGRUcmFjayArPSB2YWx1ZTtcclxufVxyXG4vKipcclxuICogQ3JlYXRlIGEgYmxvY2sgcm9vdCB2bm9kZS4gVGFrZXMgdGhlIHNhbWUgZXhhY3QgYXJndW1lbnRzIGFzIGBjcmVhdGVWTm9kZWAuXHJcbiAqIEEgYmxvY2sgcm9vdCBrZWVwcyB0cmFjayBvZiBkeW5hbWljIG5vZGVzIHdpdGhpbiB0aGUgYmxvY2sgaW4gdGhlXHJcbiAqIGBkeW5hbWljQ2hpbGRyZW5gIGFycmF5LlxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlQmxvY2sodHlwZSwgcHJvcHMsIGNoaWxkcmVuLCBwYXRjaEZsYWcsIGR5bmFtaWNQcm9wcykge1xyXG4gICAgY29uc3Qgdm5vZGUgPSBjcmVhdGVWTm9kZSh0eXBlLCBwcm9wcywgY2hpbGRyZW4sIHBhdGNoRmxhZywgZHluYW1pY1Byb3BzLCB0cnVlIC8qIGlzQmxvY2s6IHByZXZlbnQgYSBibG9jayBmcm9tIHRyYWNraW5nIGl0c2VsZiAqLyk7XHJcbiAgICAvLyBzYXZlIGN1cnJlbnQgYmxvY2sgY2hpbGRyZW4gb24gdGhlIGJsb2NrIHZub2RlXHJcbiAgICB2bm9kZS5keW5hbWljQ2hpbGRyZW4gPSBjdXJyZW50QmxvY2sgfHwgRU1QVFlfQVJSO1xyXG4gICAgLy8gY2xvc2UgYmxvY2tcclxuICAgIGJsb2NrU3RhY2sucG9wKCk7XHJcbiAgICBjdXJyZW50QmxvY2sgPSBibG9ja1N0YWNrW2Jsb2NrU3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcclxuICAgIC8vIGEgYmxvY2sgaXMgYWx3YXlzIGdvaW5nIHRvIGJlIHBhdGNoZWQsIHNvIHRyYWNrIGl0IGFzIGEgY2hpbGQgb2YgaXRzXHJcbiAgICAvLyBwYXJlbnQgYmxvY2tcclxuICAgIGlmIChjdXJyZW50QmxvY2spIHtcclxuICAgICAgICBjdXJyZW50QmxvY2sucHVzaCh2bm9kZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdm5vZGU7XHJcbn1cclxuZnVuY3Rpb24gaXNWTm9kZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlID8gdmFsdWUuX192X2lzVk5vZGUgPT09IHRydWUgOiBmYWxzZTtcclxufVxyXG5mdW5jdGlvbiBpc1NhbWVWTm9kZVR5cGUobjEsIG4yKSB7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmXHJcbiAgICAgICAgbjIuc2hhcGVGbGFnICYgNiAvKiBDT01QT05FTlQgKi8gJiZcclxuICAgICAgICBobXJEaXJ0eUNvbXBvbmVudHMuaGFzKG4yLnR5cGUpKSB7XHJcbiAgICAgICAgLy8gSE1SIG9ubHk6IGlmIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gaG90LXVwZGF0ZWQsIGZvcmNlIGEgcmVsb2FkLlxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBuMS50eXBlID09PSBuMi50eXBlICYmIG4xLmtleSA9PT0gbjIua2V5O1xyXG59XHJcbmxldCB2bm9kZUFyZ3NUcmFuc2Zvcm1lcjtcclxuLyoqXHJcbiAqIEludGVybmFsIEFQSSBmb3IgcmVnaXN0ZXJpbmcgYW4gYXJndW1lbnRzIHRyYW5zZm9ybSBmb3IgY3JlYXRlVk5vZGVcclxuICogdXNlZCBmb3IgY3JlYXRpbmcgc3R1YnMgaW4gdGhlIHRlc3QtdXRpbHNcclxuICogSXQgaXMgKmludGVybmFsKiBidXQgbmVlZHMgdG8gYmUgZXhwb3NlZCBmb3IgdGVzdC11dGlscyB0byBwaWNrIHVwIHByb3BlclxyXG4gKiB0eXBpbmdzXHJcbiAqL1xyXG5mdW5jdGlvbiB0cmFuc2Zvcm1WTm9kZUFyZ3ModHJhbnNmb3JtZXIpIHtcclxuICAgIHZub2RlQXJnc1RyYW5zZm9ybWVyID0gdHJhbnNmb3JtZXI7XHJcbn1cclxuY29uc3QgY3JlYXRlVk5vZGVXaXRoQXJnc1RyYW5zZm9ybSA9ICguLi5hcmdzKSA9PiB7XHJcbiAgICByZXR1cm4gX2NyZWF0ZVZOb2RlKC4uLih2bm9kZUFyZ3NUcmFuc2Zvcm1lclxyXG4gICAgICAgID8gdm5vZGVBcmdzVHJhbnNmb3JtZXIoYXJncywgY3VycmVudFJlbmRlcmluZ0luc3RhbmNlKVxyXG4gICAgICAgIDogYXJncykpO1xyXG59O1xyXG5jb25zdCBJbnRlcm5hbE9iamVjdEtleSA9IGBfX3ZJbnRlcm5hbGA7XHJcbmNvbnN0IG5vcm1hbGl6ZUtleSA9ICh7IGtleSB9KSA9PiBrZXkgIT0gbnVsbCA/IGtleSA6IG51bGw7XHJcbmNvbnN0IG5vcm1hbGl6ZVJlZiA9ICh7IHJlZiB9KSA9PiB7XHJcbiAgICByZXR1cm4gKHJlZiAhPSBudWxsXHJcbiAgICAgICAgPyBpc0FycmF5KHJlZilcclxuICAgICAgICAgICAgPyByZWZcclxuICAgICAgICAgICAgOiBbY3VycmVudFJlbmRlcmluZ0luc3RhbmNlLCByZWZdXHJcbiAgICAgICAgOiBudWxsKTtcclxufTtcclxuY29uc3QgY3JlYXRlVk5vZGUgPSAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpXHJcbiAgICA/IGNyZWF0ZVZOb2RlV2l0aEFyZ3NUcmFuc2Zvcm1cclxuICAgIDogX2NyZWF0ZVZOb2RlKTtcclxuZnVuY3Rpb24gX2NyZWF0ZVZOb2RlKHR5cGUsIHByb3BzID0gbnVsbCwgY2hpbGRyZW4gPSBudWxsLCBwYXRjaEZsYWcgPSAwLCBkeW5hbWljUHJvcHMgPSBudWxsLCBpc0Jsb2NrTm9kZSA9IGZhbHNlKSB7XHJcbiAgICBpZiAoIXR5cGUgfHwgdHlwZSA9PT0gTlVMTF9EWU5BTUlDX0NPTVBPTkVOVCkge1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIXR5cGUpIHtcclxuICAgICAgICAgICAgd2FybihgSW52YWxpZCB2bm9kZSB0eXBlIHdoZW4gY3JlYXRpbmcgdm5vZGU6ICR7dHlwZX0uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHR5cGUgPSBDb21tZW50O1xyXG4gICAgfVxyXG4gICAgaWYgKGlzVk5vZGUodHlwZSkpIHtcclxuICAgICAgICByZXR1cm4gY2xvbmVWTm9kZSh0eXBlLCBwcm9wcywgY2hpbGRyZW4pO1xyXG4gICAgfVxyXG4gICAgLy8gY2xhc3MgY29tcG9uZW50IG5vcm1hbGl6YXRpb24uXHJcbiAgICBpZiAoaXNGdW5jdGlvbih0eXBlKSAmJiAnX192Y2NPcHRzJyBpbiB0eXBlKSB7XHJcbiAgICAgICAgdHlwZSA9IHR5cGUuX192Y2NPcHRzO1xyXG4gICAgfVxyXG4gICAgLy8gY2xhc3MgJiBzdHlsZSBub3JtYWxpemF0aW9uLlxyXG4gICAgaWYgKHByb3BzKSB7XHJcbiAgICAgICAgLy8gZm9yIHJlYWN0aXZlIG9yIHByb3h5IG9iamVjdHMsIHdlIG5lZWQgdG8gY2xvbmUgaXQgdG8gZW5hYmxlIG11dGF0aW9uLlxyXG4gICAgICAgIGlmIChpc1Byb3h5KHByb3BzKSB8fCBJbnRlcm5hbE9iamVjdEtleSBpbiBwcm9wcykge1xyXG4gICAgICAgICAgICBwcm9wcyA9IGV4dGVuZCh7fSwgcHJvcHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgeyBjbGFzczoga2xhc3MsIHN0eWxlIH0gPSBwcm9wcztcclxuICAgICAgICBpZiAoa2xhc3MgJiYgIWlzU3RyaW5nKGtsYXNzKSkge1xyXG4gICAgICAgICAgICBwcm9wcy5jbGFzcyA9IG5vcm1hbGl6ZUNsYXNzKGtsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzT2JqZWN0KHN0eWxlKSkge1xyXG4gICAgICAgICAgICAvLyByZWFjdGl2ZSBzdGF0ZSBvYmplY3RzIG5lZWQgdG8gYmUgY2xvbmVkIHNpbmNlIHRoZXkgYXJlIGxpa2VseSB0byBiZVxyXG4gICAgICAgICAgICAvLyBtdXRhdGVkXHJcbiAgICAgICAgICAgIGlmIChpc1Byb3h5KHN0eWxlKSAmJiAhaXNBcnJheShzdHlsZSkpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlID0gZXh0ZW5kKHt9LCBzdHlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvcHMuc3R5bGUgPSBub3JtYWxpemVTdHlsZShzdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gZW5jb2RlIHRoZSB2bm9kZSB0eXBlIGluZm9ybWF0aW9uIGludG8gYSBiaXRtYXBcclxuICAgIGNvbnN0IHNoYXBlRmxhZyA9IGlzU3RyaW5nKHR5cGUpXHJcbiAgICAgICAgPyAxIC8qIEVMRU1FTlQgKi9cclxuICAgICAgICA6ICBpc1N1c3BlbnNlKHR5cGUpXHJcbiAgICAgICAgICAgID8gMTI4IC8qIFNVU1BFTlNFICovXHJcbiAgICAgICAgICAgIDogaXNUZWxlcG9ydCh0eXBlKVxyXG4gICAgICAgICAgICAgICAgPyA2NCAvKiBURUxFUE9SVCAqL1xyXG4gICAgICAgICAgICAgICAgOiBpc09iamVjdCh0eXBlKVxyXG4gICAgICAgICAgICAgICAgICAgID8gNCAvKiBTVEFURUZVTF9DT01QT05FTlQgKi9cclxuICAgICAgICAgICAgICAgICAgICA6IGlzRnVuY3Rpb24odHlwZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAyIC8qIEZVTkNUSU9OQUxfQ09NUE9ORU5UICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogMDtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgc2hhcGVGbGFnICYgNCAvKiBTVEFURUZVTF9DT01QT05FTlQgKi8gJiYgaXNQcm94eSh0eXBlKSkge1xyXG4gICAgICAgIHR5cGUgPSB0b1Jhdyh0eXBlKTtcclxuICAgICAgICB3YXJuKGBWdWUgcmVjZWl2ZWQgYSBDb21wb25lbnQgd2hpY2ggd2FzIG1hZGUgYSByZWFjdGl2ZSBvYmplY3QuIFRoaXMgY2FuIGAgK1xyXG4gICAgICAgICAgICBgbGVhZCB0byB1bm5lY2Vzc2FyeSBwZXJmb3JtYW5jZSBvdmVyaGVhZCwgYW5kIHNob3VsZCBiZSBhdm9pZGVkIGJ5IGAgK1xyXG4gICAgICAgICAgICBgbWFya2luZyB0aGUgY29tcG9uZW50IHdpdGggXFxgbWFya1Jhd1xcYCBvciB1c2luZyBcXGBzaGFsbG93UmVmXFxgIGAgK1xyXG4gICAgICAgICAgICBgaW5zdGVhZCBvZiBcXGByZWZcXGAuYCwgYFxcbkNvbXBvbmVudCB0aGF0IHdhcyBtYWRlIHJlYWN0aXZlOiBgLCB0eXBlKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHZub2RlID0ge1xyXG4gICAgICAgIF9fdl9pc1ZOb2RlOiB0cnVlLFxyXG4gICAgICAgIF9fdl9za2lwOiB0cnVlLFxyXG4gICAgICAgIHR5cGUsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAga2V5OiBwcm9wcyAmJiBub3JtYWxpemVLZXkocHJvcHMpLFxyXG4gICAgICAgIHJlZjogcHJvcHMgJiYgbm9ybWFsaXplUmVmKHByb3BzKSxcclxuICAgICAgICBzY29wZUlkOiBjdXJyZW50U2NvcGVJZCxcclxuICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICBjb21wb25lbnQ6IG51bGwsXHJcbiAgICAgICAgc3VzcGVuc2U6IG51bGwsXHJcbiAgICAgICAgZGlyczogbnVsbCxcclxuICAgICAgICB0cmFuc2l0aW9uOiBudWxsLFxyXG4gICAgICAgIGVsOiBudWxsLFxyXG4gICAgICAgIGFuY2hvcjogbnVsbCxcclxuICAgICAgICB0YXJnZXQ6IG51bGwsXHJcbiAgICAgICAgdGFyZ2V0QW5jaG9yOiBudWxsLFxyXG4gICAgICAgIHN0YXRpY0NvdW50OiAwLFxyXG4gICAgICAgIHNoYXBlRmxhZyxcclxuICAgICAgICBwYXRjaEZsYWcsXHJcbiAgICAgICAgZHluYW1pY1Byb3BzLFxyXG4gICAgICAgIGR5bmFtaWNDaGlsZHJlbjogbnVsbCxcclxuICAgICAgICBhcHBDb250ZXh0OiBudWxsXHJcbiAgICB9O1xyXG4gICAgLy8gdmFsaWRhdGUga2V5XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHZub2RlLmtleSAhPT0gdm5vZGUua2V5KSB7XHJcbiAgICAgICAgd2FybihgVk5vZGUgY3JlYXRlZCB3aXRoIGludmFsaWQga2V5IChOYU4pLiBWTm9kZSB0eXBlOmAsIHZub2RlLnR5cGUpO1xyXG4gICAgfVxyXG4gICAgbm9ybWFsaXplQ2hpbGRyZW4odm5vZGUsIGNoaWxkcmVuKTtcclxuICAgIC8vIHByZXNlbmNlIG9mIGEgcGF0Y2ggZmxhZyBpbmRpY2F0ZXMgdGhpcyBub2RlIG5lZWRzIHBhdGNoaW5nIG9uIHVwZGF0ZXMuXHJcbiAgICAvLyBjb21wb25lbnQgbm9kZXMgYWxzbyBzaG91bGQgYWx3YXlzIGJlIHBhdGNoZWQsIGJlY2F1c2UgZXZlbiBpZiB0aGVcclxuICAgIC8vIGNvbXBvbmVudCBkb2Vzbid0IG5lZWQgdG8gdXBkYXRlLCBpdCBuZWVkcyB0byBwZXJzaXN0IHRoZSBpbnN0YW5jZSBvbiB0b1xyXG4gICAgLy8gdGhlIG5leHQgdm5vZGUgc28gdGhhdCBpdCBjYW4gYmUgcHJvcGVybHkgdW5tb3VudGVkIGxhdGVyLlxyXG4gICAgaWYgKHNob3VsZFRyYWNrID4gMCAmJlxyXG4gICAgICAgICFpc0Jsb2NrTm9kZSAmJlxyXG4gICAgICAgIGN1cnJlbnRCbG9jayAmJlxyXG4gICAgICAgIC8vIHRoZSBFVkVOVFMgZmxhZyBpcyBvbmx5IGZvciBoeWRyYXRpb24gYW5kIGlmIGl0IGlzIHRoZSBvbmx5IGZsYWcsIHRoZVxyXG4gICAgICAgIC8vIHZub2RlIHNob3VsZCBub3QgYmUgY29uc2lkZXJlZCBkeW5hbWljIGR1ZSB0byBoYW5kbGVyIGNhY2hpbmcuXHJcbiAgICAgICAgcGF0Y2hGbGFnICE9PSAzMiAvKiBIWURSQVRFX0VWRU5UUyAqLyAmJlxyXG4gICAgICAgIChwYXRjaEZsYWcgPiAwIHx8XHJcbiAgICAgICAgICAgIHNoYXBlRmxhZyAmIDEyOCAvKiBTVVNQRU5TRSAqLyB8fFxyXG4gICAgICAgICAgICBzaGFwZUZsYWcgJiA2NCAvKiBURUxFUE9SVCAqLyB8fFxyXG4gICAgICAgICAgICBzaGFwZUZsYWcgJiA0IC8qIFNUQVRFRlVMX0NPTVBPTkVOVCAqLyB8fFxyXG4gICAgICAgICAgICBzaGFwZUZsYWcgJiAyIC8qIEZVTkNUSU9OQUxfQ09NUE9ORU5UICovKSkge1xyXG4gICAgICAgIGN1cnJlbnRCbG9jay5wdXNoKHZub2RlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB2bm9kZTtcclxufVxyXG5mdW5jdGlvbiBjbG9uZVZOb2RlKHZub2RlLCBleHRyYVByb3BzLCBjaGlsZHJlbikge1xyXG4gICAgY29uc3QgcHJvcHMgPSBleHRyYVByb3BzXHJcbiAgICAgICAgPyB2bm9kZS5wcm9wc1xyXG4gICAgICAgICAgICA/IG1lcmdlUHJvcHModm5vZGUucHJvcHMsIGV4dHJhUHJvcHMpXHJcbiAgICAgICAgICAgIDogZXh0ZW5kKHt9LCBleHRyYVByb3BzKVxyXG4gICAgICAgIDogdm5vZGUucHJvcHM7XHJcbiAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgTk9UIHVzaW5nIHNwcmVhZCBvciBleHRlbmQgdG8gYXZvaWQgdGhlIHJ1bnRpbWVcclxuICAgIC8vIGtleSBlbnVtZXJhdGlvbiBjb3N0LlxyXG4gICAgY29uc3QgY2xvbmVkID0ge1xyXG4gICAgICAgIF9fdl9pc1ZOb2RlOiB0cnVlLFxyXG4gICAgICAgIF9fdl9za2lwOiB0cnVlLFxyXG4gICAgICAgIHR5cGU6IHZub2RlLnR5cGUsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAga2V5OiBwcm9wcyAmJiBub3JtYWxpemVLZXkocHJvcHMpLFxyXG4gICAgICAgIHJlZjogZXh0cmFQcm9wcyAmJiBleHRyYVByb3BzLnJlZiA/IG5vcm1hbGl6ZVJlZihleHRyYVByb3BzKSA6IHZub2RlLnJlZixcclxuICAgICAgICBzY29wZUlkOiB2bm9kZS5zY29wZUlkLFxyXG4gICAgICAgIGNoaWxkcmVuOiB2bm9kZS5jaGlsZHJlbixcclxuICAgICAgICB0YXJnZXQ6IHZub2RlLnRhcmdldCxcclxuICAgICAgICB0YXJnZXRBbmNob3I6IHZub2RlLnRhcmdldEFuY2hvcixcclxuICAgICAgICBzdGF0aWNDb3VudDogdm5vZGUuc3RhdGljQ291bnQsXHJcbiAgICAgICAgc2hhcGVGbGFnOiB2bm9kZS5zaGFwZUZsYWcsXHJcbiAgICAgICAgLy8gaWYgdGhlIHZub2RlIGlzIGNsb25lZCB3aXRoIGV4dHJhIHByb3BzLCB3ZSBjYW4gbm8gbG9uZ2VyIGFzc3VtZSBpdHNcclxuICAgICAgICAvLyBleGlzdGluZyBwYXRjaCBmbGFnIHRvIGJlIHJlbGlhYmxlIGFuZCBuZWVkIHRvIGJhaWwgb3V0IG9mIG9wdGltaXplZCBtb2RlLlxyXG4gICAgICAgIC8vIGhvd2V2ZXIgd2UgZG9uJ3Qgd2FudCBibG9jayBub2RlcyB0byBkZS1vcHQgdGhlaXIgY2hpbGRyZW4sIHNvIGlmIHRoZVxyXG4gICAgICAgIC8vIHZub2RlIGlzIGEgYmxvY2sgbm9kZSwgd2Ugb25seSBhZGQgdGhlIEZVTExfUFJPUFMgZmxhZyB0byBpdC5cclxuICAgICAgICBwYXRjaEZsYWc6IGV4dHJhUHJvcHNcclxuICAgICAgICAgICAgPyB2bm9kZS5keW5hbWljQ2hpbGRyZW5cclxuICAgICAgICAgICAgICAgID8gdm5vZGUucGF0Y2hGbGFnIHwgMTYgLyogRlVMTF9QUk9QUyAqL1xyXG4gICAgICAgICAgICAgICAgOiAtMiAvKiBCQUlMICovXHJcbiAgICAgICAgICAgIDogdm5vZGUucGF0Y2hGbGFnLFxyXG4gICAgICAgIGR5bmFtaWNQcm9wczogdm5vZGUuZHluYW1pY1Byb3BzLFxyXG4gICAgICAgIGR5bmFtaWNDaGlsZHJlbjogdm5vZGUuZHluYW1pY0NoaWxkcmVuLFxyXG4gICAgICAgIGFwcENvbnRleHQ6IHZub2RlLmFwcENvbnRleHQsXHJcbiAgICAgICAgZGlyczogdm5vZGUuZGlycyxcclxuICAgICAgICB0cmFuc2l0aW9uOiB2bm9kZS50cmFuc2l0aW9uLFxyXG4gICAgICAgIC8vIFRoZXNlIHNob3VsZCB0ZWNobmljYWxseSBvbmx5IGJlIG5vbi1udWxsIG9uIG1vdW50ZWQgVk5vZGVzLiBIb3dldmVyLFxyXG4gICAgICAgIC8vIHRoZXkgKnNob3VsZCogYmUgY29waWVkIGZvciBrZXB0LWFsaXZlIHZub2Rlcy4gU28gd2UganVzdCBhbHdheXMgY29weVxyXG4gICAgICAgIC8vIHRoZW0gc2luY2UgdGhlbSBiZWluZyBub24tbnVsbCBkdXJpbmcgYSBtb3VudCBkb2Vzbid0IGFmZmVjdCB0aGUgbG9naWMgYXNcclxuICAgICAgICAvLyB0aGV5IHdpbGwgc2ltcGx5IGJlIG92ZXJ3cml0dGVuLlxyXG4gICAgICAgIGNvbXBvbmVudDogdm5vZGUuY29tcG9uZW50LFxyXG4gICAgICAgIHN1c3BlbnNlOiB2bm9kZS5zdXNwZW5zZSxcclxuICAgICAgICBlbDogdm5vZGUuZWwsXHJcbiAgICAgICAgYW5jaG9yOiB2bm9kZS5hbmNob3JcclxuICAgIH07XHJcbiAgICBpZiAoY2hpbGRyZW4pIHtcclxuICAgICAgICBub3JtYWxpemVDaGlsZHJlbihjbG9uZWQsIGNoaWxkcmVuKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjbG9uZWQ7XHJcbn1cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVUZXh0Vk5vZGUodGV4dCA9ICcgJywgZmxhZyA9IDApIHtcclxuICAgIHJldHVybiBjcmVhdGVWTm9kZShUZXh0LCBudWxsLCB0ZXh0LCBmbGFnKTtcclxufVxyXG4vKipcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVN0YXRpY1ZOb2RlKGNvbnRlbnQsIG51bWJlck9mTm9kZXMpIHtcclxuICAgIC8vIEEgc3RhdGljIHZub2RlIGNhbiBjb250YWluIG11bHRpcGxlIHN0cmluZ2lmaWVkIGVsZW1lbnRzLCBhbmQgdGhlIG51bWJlclxyXG4gICAgLy8gb2YgZWxlbWVudHMgaXMgbmVjZXNzYXJ5IGZvciBoeWRyYXRpb24uXHJcbiAgICBjb25zdCB2bm9kZSA9IGNyZWF0ZVZOb2RlKFN0YXRpYywgbnVsbCwgY29udGVudCk7XHJcbiAgICB2bm9kZS5zdGF0aWNDb3VudCA9IG51bWJlck9mTm9kZXM7XHJcbiAgICByZXR1cm4gdm5vZGU7XHJcbn1cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVDb21tZW50Vk5vZGUodGV4dCA9ICcnLCBcclxuLy8gd2hlbiB1c2VkIGFzIHRoZSB2LWVsc2UgYnJhbmNoLCB0aGUgY29tbWVudCBub2RlIG11c3QgYmUgY3JlYXRlZCBhcyBhXHJcbi8vIGJsb2NrIHRvIGVuc3VyZSBjb3JyZWN0IHVwZGF0ZXMuXHJcbmFzQmxvY2sgPSBmYWxzZSkge1xyXG4gICAgcmV0dXJuIGFzQmxvY2tcclxuICAgICAgICA/IChvcGVuQmxvY2soKSwgY3JlYXRlQmxvY2soQ29tbWVudCwgbnVsbCwgdGV4dCkpXHJcbiAgICAgICAgOiBjcmVhdGVWTm9kZShDb21tZW50LCBudWxsLCB0ZXh0KTtcclxufVxyXG5mdW5jdGlvbiBub3JtYWxpemVWTm9kZShjaGlsZCkge1xyXG4gICAgaWYgKGNoaWxkID09IG51bGwgfHwgdHlwZW9mIGNoaWxkID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAvLyBlbXB0eSBwbGFjZWhvbGRlclxyXG4gICAgICAgIHJldHVybiBjcmVhdGVWTm9kZShDb21tZW50KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzQXJyYXkoY2hpbGQpKSB7XHJcbiAgICAgICAgLy8gZnJhZ21lbnRcclxuICAgICAgICByZXR1cm4gY3JlYXRlVk5vZGUoRnJhZ21lbnQsIG51bGwsIGNoaWxkKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBhbHJlYWR5IHZub2RlLCB0aGlzIHNob3VsZCBiZSB0aGUgbW9zdCBjb21tb24gc2luY2UgY29tcGlsZWQgdGVtcGxhdGVzXHJcbiAgICAgICAgLy8gYWx3YXlzIHByb2R1Y2UgYWxsLXZub2RlIGNoaWxkcmVuIGFycmF5c1xyXG4gICAgICAgIHJldHVybiBjaGlsZC5lbCA9PT0gbnVsbCA/IGNoaWxkIDogY2xvbmVWTm9kZShjaGlsZCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBzdHJpbmdzIGFuZCBudW1iZXJzXHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVZOb2RlKFRleHQsIG51bGwsIFN0cmluZyhjaGlsZCkpO1xyXG4gICAgfVxyXG59XHJcbi8vIG9wdGltaXplZCBub3JtYWxpemF0aW9uIGZvciB0ZW1wbGF0ZS1jb21waWxlZCByZW5kZXIgZm5zXHJcbmZ1bmN0aW9uIGNsb25lSWZNb3VudGVkKGNoaWxkKSB7XHJcbiAgICByZXR1cm4gY2hpbGQuZWwgPT09IG51bGwgPyBjaGlsZCA6IGNsb25lVk5vZGUoY2hpbGQpO1xyXG59XHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZUNoaWxkcmVuKHZub2RlLCBjaGlsZHJlbikge1xyXG4gICAgbGV0IHR5cGUgPSAwO1xyXG4gICAgY29uc3QgeyBzaGFwZUZsYWcgfSA9IHZub2RlO1xyXG4gICAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcclxuICAgICAgICBjaGlsZHJlbiA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc0FycmF5KGNoaWxkcmVuKSkge1xyXG4gICAgICAgIHR5cGUgPSAxNiAvKiBBUlJBWV9DSElMRFJFTiAqLztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBjaGlsZHJlbiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBOb3JtYWxpemUgc2xvdCB0byBwbGFpbiBjaGlsZHJlblxyXG4gICAgICAgIGlmICgoc2hhcGVGbGFnICYgMSAvKiBFTEVNRU5UICovIHx8IHNoYXBlRmxhZyAmIDY0IC8qIFRFTEVQT1JUICovKSAmJlxyXG4gICAgICAgICAgICBjaGlsZHJlbi5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIG5vcm1hbGl6ZUNoaWxkcmVuKHZub2RlLCBjaGlsZHJlbi5kZWZhdWx0KCkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0eXBlID0gMzIgLyogU0xPVFNfQ0hJTERSRU4gKi87XHJcbiAgICAgICAgICAgIGNvbnN0IHNsb3RGbGFnID0gY2hpbGRyZW4uXztcclxuICAgICAgICAgICAgaWYgKCFzbG90RmxhZyAmJiAhKEludGVybmFsT2JqZWN0S2V5IGluIGNoaWxkcmVuKSkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4uX2N0eCA9IGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChzbG90RmxhZyA9PT0gMyAvKiBGT1JXQVJERUQgKi8gJiYgY3VycmVudFJlbmRlcmluZ0luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhIGNoaWxkIGNvbXBvbmVudCByZWNlaXZlcyBmb3J3YXJkZWQgc2xvdHMgZnJvbSB0aGUgcGFyZW50LlxyXG4gICAgICAgICAgICAgICAgLy8gaXRzIHNsb3QgdHlwZSBpcyBkZXRlcm1pbmVkIGJ5IGl0cyBwYXJlbnQncyBzbG90IHR5cGUuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFJlbmRlcmluZ0luc3RhbmNlLnZub2RlLnBhdGNoRmxhZyAmIDEwMjQgLyogRFlOQU1JQ19TTE9UUyAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLl8gPSAyIC8qIERZTkFNSUMgKi87XHJcbiAgICAgICAgICAgICAgICAgICAgdm5vZGUucGF0Y2hGbGFnIHw9IDEwMjQgLyogRFlOQU1JQ19TTE9UUyAqLztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLl8gPSAxIC8qIFNUQUJMRSAqLztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24oY2hpbGRyZW4pKSB7XHJcbiAgICAgICAgY2hpbGRyZW4gPSB7IGRlZmF1bHQ6IGNoaWxkcmVuLCBfY3R4OiBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UgfTtcclxuICAgICAgICB0eXBlID0gMzIgLyogU0xPVFNfQ0hJTERSRU4gKi87XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjaGlsZHJlbiA9IFN0cmluZyhjaGlsZHJlbik7XHJcbiAgICAgICAgLy8gZm9yY2UgdGVsZXBvcnQgY2hpbGRyZW4gdG8gYXJyYXkgc28gaXQgY2FuIGJlIG1vdmVkIGFyb3VuZFxyXG4gICAgICAgIGlmIChzaGFwZUZsYWcgJiA2NCAvKiBURUxFUE9SVCAqLykge1xyXG4gICAgICAgICAgICB0eXBlID0gMTYgLyogQVJSQVlfQ0hJTERSRU4gKi87XHJcbiAgICAgICAgICAgIGNoaWxkcmVuID0gW2NyZWF0ZVRleHRWTm9kZShjaGlsZHJlbildO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdHlwZSA9IDggLyogVEVYVF9DSElMRFJFTiAqLztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB2bm9kZS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgdm5vZGUuc2hhcGVGbGFnIHw9IHR5cGU7XHJcbn1cclxuY29uc3QgaGFuZGxlcnNSRSA9IC9eb258XnZub2RlLztcclxuZnVuY3Rpb24gbWVyZ2VQcm9wcyguLi5hcmdzKSB7XHJcbiAgICBjb25zdCByZXQgPSBleHRlbmQoe30sIGFyZ3NbMF0pO1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgdG9NZXJnZSA9IGFyZ3NbaV07XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdG9NZXJnZSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnY2xhc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmV0LmNsYXNzICE9PSB0b01lcmdlLmNsYXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0LmNsYXNzID0gbm9ybWFsaXplQ2xhc3MoW3JldC5jbGFzcywgdG9NZXJnZS5jbGFzc10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xyXG4gICAgICAgICAgICAgICAgcmV0LnN0eWxlID0gbm9ybWFsaXplU3R5bGUoW3JldC5zdHlsZSwgdG9NZXJnZS5zdHlsZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGhhbmRsZXJzUkUudGVzdChrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbiosIHZub2RlKlxyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSByZXRba2V5XTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluY29taW5nID0gdG9NZXJnZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nICE9PSBpbmNvbWluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldFtrZXldID0gZXhpc3RpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBbXS5jb25jYXQoZXhpc3RpbmcsIHRvTWVyZ2Vba2V5XSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBpbmNvbWluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldFtrZXldID0gdG9NZXJnZVtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldDtcclxufVxuXG5mdW5jdGlvbiBlbWl0KGluc3RhbmNlLCBldmVudCwgLi4uYXJncykge1xyXG4gICAgY29uc3QgcHJvcHMgPSBpbnN0YW5jZS52bm9kZS5wcm9wcyB8fCBFTVBUWV9PQko7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IG5vcm1hbGl6ZUVtaXRzT3B0aW9ucyhpbnN0YW5jZS50eXBlKTtcclxuICAgICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAoIShldmVudCBpbiBvcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcHNPcHRpb25zID0gbm9ybWFsaXplUHJvcHNPcHRpb25zKGluc3RhbmNlLnR5cGUpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wc09wdGlvbnMgfHwgIShgb25gICsgY2FwaXRhbGl6ZShldmVudCkgaW4gcHJvcHNPcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhcm4oYENvbXBvbmVudCBlbWl0dGVkIGV2ZW50IFwiJHtldmVudH1cIiBidXQgaXQgaXMgbmVpdGhlciBkZWNsYXJlZCBpbiBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYHRoZSBlbWl0cyBvcHRpb24gbm9yIGFzIGFuIFwib24ke2NhcGl0YWxpemUoZXZlbnQpfVwiIHByb3AuYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWxpZGF0b3IgPSBvcHRpb25zW2V2ZW50XTtcclxuICAgICAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHZhbGlkYXRvcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdG9yKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuKGBJbnZhbGlkIGV2ZW50IGFyZ3VtZW50czogZXZlbnQgdmFsaWRhdGlvbiBmYWlsZWQgZm9yIGV2ZW50IFwiJHtldmVudH1cIi5gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgaGFuZGxlck5hbWUgPSBgb24ke2NhcGl0YWxpemUoZXZlbnQpfWA7XHJcbiAgICBsZXQgaGFuZGxlciA9IHByb3BzW2hhbmRsZXJOYW1lXTtcclxuICAgIC8vIGZvciB2LW1vZGVsIHVwZGF0ZTp4eHggZXZlbnRzLCBhbHNvIHRyaWdnZXIga2ViYWItY2FzZSBlcXVpdmFsZW50XHJcbiAgICAvLyBmb3IgcHJvcHMgcGFzc2VkIHZpYSBrZWJhYi1jYXNlXHJcbiAgICBpZiAoIWhhbmRsZXIgJiYgZXZlbnQuc3RhcnRzV2l0aCgndXBkYXRlOicpKSB7XHJcbiAgICAgICAgaGFuZGxlck5hbWUgPSBgb24ke2NhcGl0YWxpemUoaHlwaGVuYXRlKGV2ZW50KSl9YDtcclxuICAgICAgICBoYW5kbGVyID0gcHJvcHNbaGFuZGxlck5hbWVdO1xyXG4gICAgfVxyXG4gICAgaWYgKCFoYW5kbGVyKSB7XHJcbiAgICAgICAgaGFuZGxlciA9IHByb3BzW2hhbmRsZXJOYW1lICsgYE9uY2VgXTtcclxuICAgICAgICBpZiAoIWluc3RhbmNlLmVtaXR0ZWQpIHtcclxuICAgICAgICAgICAgKGluc3RhbmNlLmVtaXR0ZWQgPSB7fSlbaGFuZGxlck5hbWVdID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaW5zdGFuY2UuZW1pdHRlZFtoYW5kbGVyTmFtZV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChoYW5kbGVyKSB7XHJcbiAgICAgICAgY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcoaGFuZGxlciwgaW5zdGFuY2UsIDYgLyogQ09NUE9ORU5UX0VWRU5UX0hBTkRMRVIgKi8sIGFyZ3MpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZUVtaXRzT3B0aW9ucyhjb21wKSB7XHJcbiAgICBpZiAoaGFzT3duKGNvbXAsICdfX2VtaXRzJykpIHtcclxuICAgICAgICByZXR1cm4gY29tcC5fX2VtaXRzO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmF3ID0gY29tcC5lbWl0cztcclxuICAgIGxldCBub3JtYWxpemVkID0ge307XHJcbiAgICAvLyBhcHBseSBtaXhpbi9leHRlbmRzIHByb3BzXHJcbiAgICBsZXQgaGFzRXh0ZW5kcyA9IGZhbHNlO1xyXG4gICAgaWYgKCAhaXNGdW5jdGlvbihjb21wKSkge1xyXG4gICAgICAgIGlmIChjb21wLmV4dGVuZHMpIHtcclxuICAgICAgICAgICAgaGFzRXh0ZW5kcyA9IHRydWU7XHJcbiAgICAgICAgICAgIGV4dGVuZChub3JtYWxpemVkLCBub3JtYWxpemVFbWl0c09wdGlvbnMoY29tcC5leHRlbmRzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wLm1peGlucykge1xyXG4gICAgICAgICAgICBoYXNFeHRlbmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29tcC5taXhpbnMuZm9yRWFjaChtID0+IGV4dGVuZChub3JtYWxpemVkLCBub3JtYWxpemVFbWl0c09wdGlvbnMobSkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIXJhdyAmJiAhaGFzRXh0ZW5kcykge1xyXG4gICAgICAgIHJldHVybiAoY29tcC5fX2VtaXRzID0gdW5kZWZpbmVkKTtcclxuICAgIH1cclxuICAgIGlmIChpc0FycmF5KHJhdykpIHtcclxuICAgICAgICByYXcuZm9yRWFjaChrZXkgPT4gKG5vcm1hbGl6ZWRba2V5XSA9IG51bGwpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGV4dGVuZChub3JtYWxpemVkLCByYXcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChjb21wLl9fZW1pdHMgPSBub3JtYWxpemVkKTtcclxufVxyXG4vLyBDaGVjayBpZiBhbiBpbmNvbWluZyBwcm9wIGtleSBpcyBhIGRlY2xhcmVkIGVtaXQgZXZlbnQgbGlzdGVuZXIuXHJcbi8vIGUuZy4gV2l0aCBgZW1pdHM6IHsgY2xpY2s6IG51bGwgfWAsIHByb3BzIG5hbWVkIGBvbkNsaWNrYCBhbmQgYG9uY2xpY2tgIGFyZVxyXG4vLyBib3RoIGNvbnNpZGVyZWQgbWF0Y2hlZCBsaXN0ZW5lcnMuXHJcbmZ1bmN0aW9uIGlzRW1pdExpc3RlbmVyKGNvbXAsIGtleSkge1xyXG4gICAgbGV0IGVtaXRzO1xyXG4gICAgaWYgKCFpc09uKGtleSkgfHwgIShlbWl0cyA9IG5vcm1hbGl6ZUVtaXRzT3B0aW9ucyhjb21wKSkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBrZXkgPSBrZXkucmVwbGFjZSgvT25jZSQvLCAnJyk7XHJcbiAgICByZXR1cm4gKGhhc093bihlbWl0cywga2V5WzJdLnRvTG93ZXJDYXNlKCkgKyBrZXkuc2xpY2UoMykpIHx8XHJcbiAgICAgICAgaGFzT3duKGVtaXRzLCBrZXkuc2xpY2UoMikpKTtcclxufVxuXG5mdW5jdGlvbiBpbml0UHJvcHMoaW5zdGFuY2UsIHJhd1Byb3BzLCBpc1N0YXRlZnVsLCAvLyByZXN1bHQgb2YgYml0d2lzZSBmbGFnIGNvbXBhcmlzb25cclxuaXNTU1IgPSBmYWxzZSkge1xyXG4gICAgY29uc3QgcHJvcHMgPSB7fTtcclxuICAgIGNvbnN0IGF0dHJzID0ge307XHJcbiAgICBkZWYoYXR0cnMsIEludGVybmFsT2JqZWN0S2V5LCAxKTtcclxuICAgIHNldEZ1bGxQcm9wcyhpbnN0YW5jZSwgcmF3UHJvcHMsIHByb3BzLCBhdHRycyk7XHJcbiAgICAvLyB2YWxpZGF0aW9uXHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgdmFsaWRhdGVQcm9wcyhwcm9wcywgaW5zdGFuY2UudHlwZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNTdGF0ZWZ1bCkge1xyXG4gICAgICAgIC8vIHN0YXRlZnVsXHJcbiAgICAgICAgaW5zdGFuY2UucHJvcHMgPSBpc1NTUiA/IHByb3BzIDogc2hhbGxvd1JlYWN0aXZlKHByb3BzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghaW5zdGFuY2UudHlwZS5wcm9wcykge1xyXG4gICAgICAgICAgICAvLyBmdW5jdGlvbmFsIHcvIG9wdGlvbmFsIHByb3BzLCBwcm9wcyA9PT0gYXR0cnNcclxuICAgICAgICAgICAgaW5zdGFuY2UucHJvcHMgPSBhdHRycztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGZ1bmN0aW9uYWwgdy8gZGVjbGFyZWQgcHJvcHNcclxuICAgICAgICAgICAgaW5zdGFuY2UucHJvcHMgPSBwcm9wcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbnN0YW5jZS5hdHRycyA9IGF0dHJzO1xyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZVByb3BzKGluc3RhbmNlLCByYXdQcm9wcywgcmF3UHJldlByb3BzLCBvcHRpbWl6ZWQpIHtcclxuICAgIGNvbnN0IHsgcHJvcHMsIGF0dHJzLCB2bm9kZTogeyBwYXRjaEZsYWcgfSB9ID0gaW5zdGFuY2U7XHJcbiAgICBjb25zdCByYXdDdXJyZW50UHJvcHMgPSB0b1Jhdyhwcm9wcyk7XHJcbiAgICBjb25zdCBbb3B0aW9uc10gPSBub3JtYWxpemVQcm9wc09wdGlvbnMoaW5zdGFuY2UudHlwZSk7XHJcbiAgICBpZiAoKG9wdGltaXplZCB8fCBwYXRjaEZsYWcgPiAwKSAmJiAhKHBhdGNoRmxhZyAmIDE2IC8qIEZVTExfUFJPUFMgKi8pKSB7XHJcbiAgICAgICAgaWYgKHBhdGNoRmxhZyAmIDggLyogUFJPUFMgKi8pIHtcclxuICAgICAgICAgICAgLy8gQ29tcGlsZXItZ2VuZXJhdGVkIHByb3BzICYgbm8ga2V5cyBjaGFuZ2UsIGp1c3Qgc2V0IHRoZSB1cGRhdGVkXHJcbiAgICAgICAgICAgIC8vIHRoZSBwcm9wcy5cclxuICAgICAgICAgICAgY29uc3QgcHJvcHNUb1VwZGF0ZSA9IGluc3RhbmNlLnZub2RlLmR5bmFtaWNQcm9wcztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wc1RvVXBkYXRlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBwcm9wc1RvVXBkYXRlW2ldO1xyXG4gICAgICAgICAgICAgICAgLy8gUFJPUFMgZmxhZyBndWFyYW50ZWVzIHJhd1Byb3BzIHRvIGJlIG5vbi1udWxsXHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJhd1Byb3BzW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGF0dHIgLyBwcm9wcyBzZXBhcmF0aW9uIHdhcyBkb25lIG9uIGluaXQgYW5kIHdpbGwgYmUgY29uc2lzdGVudFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGluIHRoaXMgY29kZSBwYXRoLCBzbyBqdXN0IGNoZWNrIGlmIGF0dHJzIGhhdmUgaXQuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc093bihhdHRycywga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyc1trZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYW1lbGl6ZWRLZXkgPSBjYW1lbGl6ZShrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wc1tjYW1lbGl6ZWRLZXldID0gcmVzb2x2ZVByb3BWYWx1ZShvcHRpb25zLCByYXdDdXJyZW50UHJvcHMsIGNhbWVsaXplZEtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIGZ1bGwgcHJvcHMgdXBkYXRlLlxyXG4gICAgICAgIHNldEZ1bGxQcm9wcyhpbnN0YW5jZSwgcmF3UHJvcHMsIHByb3BzLCBhdHRycyk7XHJcbiAgICAgICAgLy8gaW4gY2FzZSBvZiBkeW5hbWljIHByb3BzLCBjaGVjayBpZiB3ZSBuZWVkIHRvIGRlbGV0ZSBrZXlzIGZyb21cclxuICAgICAgICAvLyB0aGUgcHJvcHMgb2JqZWN0XHJcbiAgICAgICAgbGV0IGtlYmFiS2V5O1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHJhd0N1cnJlbnRQcm9wcykge1xyXG4gICAgICAgICAgICBpZiAoIXJhd1Byb3BzIHx8XHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgY2FtZWxDYXNlXHJcbiAgICAgICAgICAgICAgICAoIWhhc093bihyYXdQcm9wcywga2V5KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGl0J3MgcG9zc2libGUgdGhlIG9yaWdpbmFsIHByb3BzIHdhcyBwYXNzZWQgaW4gYXMga2ViYWItY2FzZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCBjb252ZXJ0ZWQgdG8gY2FtZWxDYXNlICgjOTU1KVxyXG4gICAgICAgICAgICAgICAgICAgICgoa2ViYWJLZXkgPSBoeXBoZW5hdGUoa2V5KSkgPT09IGtleSB8fCAhaGFzT3duKHJhd1Byb3BzLCBrZWJhYktleSkpKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmF3UHJldlByb3BzICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvciBjYW1lbENhc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJhd1ByZXZQcm9wc1trZXldICE9PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvciBrZWJhYi1jYXNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXdQcmV2UHJvcHNba2ViYWJLZXldICE9PSB1bmRlZmluZWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzW2tleV0gPSByZXNvbHZlUHJvcFZhbHVlKG9wdGlvbnMsIHJhd1Byb3BzIHx8IEVNUFRZX09CSiwga2V5LCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBwcm9wc1trZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGluIHRoZSBjYXNlIG9mIGZ1bmN0aW9uYWwgY29tcG9uZW50IHcvbyBwcm9wcyBkZWNsYXJhdGlvbiwgcHJvcHMgYW5kXHJcbiAgICAgICAgLy8gYXR0cnMgcG9pbnQgdG8gdGhlIHNhbWUgb2JqZWN0IHNvIGl0IHNob3VsZCBhbHJlYWR5IGhhdmUgYmVlbiB1cGRhdGVkLlxyXG4gICAgICAgIGlmIChhdHRycyAhPT0gcmF3Q3VycmVudFByb3BzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJhd1Byb3BzIHx8ICFoYXNPd24ocmF3UHJvcHMsIGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgYXR0cnNba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIHRyaWdnZXIgdXBkYXRlcyBmb3IgJGF0dHJzIGluIGNhc2UgaXQncyB1c2VkIGluIGNvbXBvbmVudCBzbG90c1xyXG4gICAgdHJpZ2dlcihpbnN0YW5jZSwgXCJzZXRcIiAvKiBTRVQgKi8sICckYXR0cnMnKTtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgcmF3UHJvcHMpIHtcclxuICAgICAgICB2YWxpZGF0ZVByb3BzKHByb3BzLCBpbnN0YW5jZS50eXBlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBzZXRGdWxsUHJvcHMoaW5zdGFuY2UsIHJhd1Byb3BzLCBwcm9wcywgYXR0cnMpIHtcclxuICAgIGNvbnN0IFtvcHRpb25zLCBuZWVkQ2FzdEtleXNdID0gbm9ybWFsaXplUHJvcHNPcHRpb25zKGluc3RhbmNlLnR5cGUpO1xyXG4gICAgaWYgKHJhd1Byb3BzKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmF3UHJvcHMpIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSByYXdQcm9wc1trZXldO1xyXG4gICAgICAgICAgICAvLyBrZXksIHJlZiBhcmUgcmVzZXJ2ZWQgYW5kIG5ldmVyIHBhc3NlZCBkb3duXHJcbiAgICAgICAgICAgIGlmIChpc1Jlc2VydmVkUHJvcChrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBwcm9wIG9wdGlvbiBuYW1lcyBhcmUgY2FtZWxpemVkIGR1cmluZyBub3JtYWxpemF0aW9uLCBzbyB0byBzdXBwb3J0XHJcbiAgICAgICAgICAgIC8vIGtlYmFiIC0+IGNhbWVsIGNvbnZlcnNpb24gaGVyZSB3ZSBuZWVkIHRvIGNhbWVsaXplIHRoZSBrZXkuXHJcbiAgICAgICAgICAgIGxldCBjYW1lbEtleTtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgaGFzT3duKG9wdGlvbnMsIChjYW1lbEtleSA9IGNhbWVsaXplKGtleSkpKSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcHNbY2FtZWxLZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoIWlzRW1pdExpc3RlbmVyKGluc3RhbmNlLnR5cGUsIGtleSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIEFueSBub24tZGVjbGFyZWQgKGVpdGhlciBhcyBhIHByb3Agb3IgYW4gZW1pdHRlZCBldmVudCkgcHJvcHMgYXJlIHB1dFxyXG4gICAgICAgICAgICAgICAgLy8gaW50byBhIHNlcGFyYXRlIGBhdHRyc2Agb2JqZWN0IGZvciBzcHJlYWRpbmcuIE1ha2Ugc3VyZSB0byBwcmVzZXJ2ZVxyXG4gICAgICAgICAgICAgICAgLy8gb3JpZ2luYWwga2V5IGNhc2luZ1xyXG4gICAgICAgICAgICAgICAgYXR0cnNba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG5lZWRDYXN0S2V5cykge1xyXG4gICAgICAgIGNvbnN0IHJhd0N1cnJlbnRQcm9wcyA9IHRvUmF3KHByb3BzKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5lZWRDYXN0S2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBuZWVkQ2FzdEtleXNbaV07XHJcbiAgICAgICAgICAgIHByb3BzW2tleV0gPSByZXNvbHZlUHJvcFZhbHVlKG9wdGlvbnMsIHJhd0N1cnJlbnRQcm9wcywga2V5LCByYXdDdXJyZW50UHJvcHNba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlc29sdmVQcm9wVmFsdWUob3B0aW9ucywgcHJvcHMsIGtleSwgdmFsdWUpIHtcclxuICAgIGNvbnN0IG9wdCA9IG9wdGlvbnNba2V5XTtcclxuICAgIGlmIChvcHQgIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGhhc0RlZmF1bHQgPSBoYXNPd24ob3B0LCAnZGVmYXVsdCcpO1xyXG4gICAgICAgIC8vIGRlZmF1bHQgdmFsdWVzXHJcbiAgICAgICAgaWYgKGhhc0RlZmF1bHQgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBvcHQuZGVmYXVsdDtcclxuICAgICAgICAgICAgdmFsdWUgPVxyXG4gICAgICAgICAgICAgICAgb3B0LnR5cGUgIT09IEZ1bmN0aW9uICYmIGlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgID8gZGVmYXVsdFZhbHVlKClcclxuICAgICAgICAgICAgICAgICAgICA6IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYm9vbGVhbiBjYXN0aW5nXHJcbiAgICAgICAgaWYgKG9wdFswIC8qIHNob3VsZENhc3QgKi9dKSB7XHJcbiAgICAgICAgICAgIGlmICghaGFzT3duKHByb3BzLCBrZXkpICYmICFoYXNEZWZhdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG9wdFsxIC8qIHNob3VsZENhc3RUcnVlICovXSAmJlxyXG4gICAgICAgICAgICAgICAgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gaHlwaGVuYXRlKGtleSkpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuZnVuY3Rpb24gbm9ybWFsaXplUHJvcHNPcHRpb25zKGNvbXApIHtcclxuICAgIGlmIChjb21wLl9fcHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gY29tcC5fX3Byb3BzO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmF3ID0gY29tcC5wcm9wcztcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB7fTtcclxuICAgIGNvbnN0IG5lZWRDYXN0S2V5cyA9IFtdO1xyXG4gICAgLy8gYXBwbHkgbWl4aW4vZXh0ZW5kcyBwcm9wc1xyXG4gICAgbGV0IGhhc0V4dGVuZHMgPSBmYWxzZTtcclxuICAgIGlmICggIWlzRnVuY3Rpb24oY29tcCkpIHtcclxuICAgICAgICBjb25zdCBleHRlbmRQcm9wcyA9IChyYXcpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgW3Byb3BzLCBrZXlzXSA9IG5vcm1hbGl6ZVByb3BzT3B0aW9ucyhyYXcpO1xyXG4gICAgICAgICAgICBleHRlbmQobm9ybWFsaXplZCwgcHJvcHMpO1xyXG4gICAgICAgICAgICBpZiAoa2V5cylcclxuICAgICAgICAgICAgICAgIG5lZWRDYXN0S2V5cy5wdXNoKC4uLmtleXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGNvbXAuZXh0ZW5kcykge1xyXG4gICAgICAgICAgICBoYXNFeHRlbmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXh0ZW5kUHJvcHMoY29tcC5leHRlbmRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXAubWl4aW5zKSB7XHJcbiAgICAgICAgICAgIGhhc0V4dGVuZHMgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb21wLm1peGlucy5mb3JFYWNoKGV4dGVuZFByb3BzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIXJhdyAmJiAhaGFzRXh0ZW5kcykge1xyXG4gICAgICAgIHJldHVybiAoY29tcC5fX3Byb3BzID0gRU1QVFlfQVJSKTtcclxuICAgIH1cclxuICAgIGlmIChpc0FycmF5KHJhdykpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhdy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmICFpc1N0cmluZyhyYXdbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuKGBwcm9wcyBtdXN0IGJlIHN0cmluZ3Mgd2hlbiB1c2luZyBhcnJheSBzeW50YXguYCwgcmF3W2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkS2V5ID0gY2FtZWxpemUocmF3W2ldKTtcclxuICAgICAgICAgICAgaWYgKHZhbGlkYXRlUHJvcE5hbWUobm9ybWFsaXplZEtleSkpIHtcclxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRbbm9ybWFsaXplZEtleV0gPSBFTVBUWV9PQko7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChyYXcpIHtcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmICFpc09iamVjdChyYXcpKSB7XHJcbiAgICAgICAgICAgIHdhcm4oYGludmFsaWQgcHJvcHMgb3B0aW9uc2AsIHJhdyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHJhdykge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkS2V5ID0gY2FtZWxpemUoa2V5KTtcclxuICAgICAgICAgICAgaWYgKHZhbGlkYXRlUHJvcE5hbWUobm9ybWFsaXplZEtleSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9wdCA9IHJhd1trZXldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcCA9IChub3JtYWxpemVkW25vcm1hbGl6ZWRLZXldID1cclxuICAgICAgICAgICAgICAgICAgICBpc0FycmF5KG9wdCkgfHwgaXNGdW5jdGlvbihvcHQpID8geyB0eXBlOiBvcHQgfSA6IG9wdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvb2xlYW5JbmRleCA9IGdldFR5cGVJbmRleChCb29sZWFuLCBwcm9wLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0cmluZ0luZGV4ID0gZ2V0VHlwZUluZGV4KFN0cmluZywgcHJvcC50eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wWzAgLyogc2hvdWxkQ2FzdCAqL10gPSBib29sZWFuSW5kZXggPiAtMTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wWzEgLyogc2hvdWxkQ2FzdFRydWUgKi9dID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nSW5kZXggPCAwIHx8IGJvb2xlYW5JbmRleCA8IHN0cmluZ0luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcm9wIG5lZWRzIGJvb2xlYW4gY2FzdGluZyBvciBkZWZhdWx0IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvb2xlYW5JbmRleCA+IC0xIHx8IGhhc093bihwcm9wLCAnZGVmYXVsdCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5lZWRDYXN0S2V5cy5wdXNoKG5vcm1hbGl6ZWRLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IG5vcm1hbGl6ZWRFbnRyeSA9IFtub3JtYWxpemVkLCBuZWVkQ2FzdEtleXNdO1xyXG4gICAgY29tcC5fX3Byb3BzID0gbm9ybWFsaXplZEVudHJ5O1xyXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRFbnRyeTtcclxufVxyXG4vLyB1c2UgZnVuY3Rpb24gc3RyaW5nIG5hbWUgdG8gY2hlY2sgdHlwZSBjb25zdHJ1Y3RvcnNcclxuLy8gc28gdGhhdCBpdCB3b3JrcyBhY3Jvc3Mgdm1zIC8gaWZyYW1lcy5cclxuZnVuY3Rpb24gZ2V0VHlwZShjdG9yKSB7XHJcbiAgICBjb25zdCBtYXRjaCA9IGN0b3IgJiYgY3Rvci50b1N0cmluZygpLm1hdGNoKC9eXFxzKmZ1bmN0aW9uIChcXHcrKS8pO1xyXG4gICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiAnJztcclxufVxyXG5mdW5jdGlvbiBpc1NhbWVUeXBlKGEsIGIpIHtcclxuICAgIHJldHVybiBnZXRUeXBlKGEpID09PSBnZXRUeXBlKGIpO1xyXG59XHJcbmZ1bmN0aW9uIGdldFR5cGVJbmRleCh0eXBlLCBleHBlY3RlZFR5cGVzKSB7XHJcbiAgICBpZiAoaXNBcnJheShleHBlY3RlZFR5cGVzKSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBleHBlY3RlZFR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpc1NhbWVUeXBlKGV4cGVjdGVkVHlwZXNbaV0sIHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24oZXhwZWN0ZWRUeXBlcykpIHtcclxuICAgICAgICByZXR1cm4gaXNTYW1lVHlwZShleHBlY3RlZFR5cGVzLCB0eXBlKSA/IDAgOiAtMTtcclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxufVxyXG4vKipcclxuICogZGV2IG9ubHlcclxuICovXHJcbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcHMocHJvcHMsIGNvbXApIHtcclxuICAgIGNvbnN0IHJhd1ZhbHVlcyA9IHRvUmF3KHByb3BzKTtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSBub3JtYWxpemVQcm9wc09wdGlvbnMoY29tcClbMF07XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IG9wdCA9IG9wdGlvbnNba2V5XTtcclxuICAgICAgICBpZiAob3B0ID09IG51bGwpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIHZhbGlkYXRlUHJvcChrZXksIHJhd1ZhbHVlc1trZXldLCBvcHQsICFoYXNPd24ocmF3VmFsdWVzLCBrZXkpKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogZGV2IG9ubHlcclxuICovXHJcbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcE5hbWUoa2V5KSB7XHJcbiAgICBpZiAoa2V5WzBdICE9PSAnJCcpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgIHdhcm4oYEludmFsaWQgcHJvcCBuYW1lOiBcIiR7a2V5fVwiIGlzIGEgcmVzZXJ2ZWQgcHJvcGVydHkuYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuLyoqXHJcbiAqIGRldiBvbmx5XHJcbiAqL1xyXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3AobmFtZSwgdmFsdWUsIHByb3AsIGlzQWJzZW50KSB7XHJcbiAgICBjb25zdCB7IHR5cGUsIHJlcXVpcmVkLCB2YWxpZGF0b3IgfSA9IHByb3A7XHJcbiAgICAvLyByZXF1aXJlZCFcclxuICAgIGlmIChyZXF1aXJlZCAmJiBpc0Fic2VudCkge1xyXG4gICAgICAgIHdhcm4oJ01pc3NpbmcgcmVxdWlyZWQgcHJvcDogXCInICsgbmFtZSArICdcIicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIG1pc3NpbmcgYnV0IG9wdGlvbmFsXHJcbiAgICBpZiAodmFsdWUgPT0gbnVsbCAmJiAhcHJvcC5yZXF1aXJlZCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIHR5cGUgY2hlY2tcclxuICAgIGlmICh0eXBlICE9IG51bGwgJiYgdHlwZSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgdHlwZXMgPSBpc0FycmF5KHR5cGUpID8gdHlwZSA6IFt0eXBlXTtcclxuICAgICAgICBjb25zdCBleHBlY3RlZFR5cGVzID0gW107XHJcbiAgICAgICAgLy8gdmFsdWUgaXMgdmFsaWQgYXMgbG9uZyBhcyBvbmUgb2YgdGhlIHNwZWNpZmllZCB0eXBlcyBtYXRjaFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoICYmICFpc1ZhbGlkOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgeyB2YWxpZCwgZXhwZWN0ZWRUeXBlIH0gPSBhc3NlcnRUeXBlKHZhbHVlLCB0eXBlc1tpXSk7XHJcbiAgICAgICAgICAgIGV4cGVjdGVkVHlwZXMucHVzaChleHBlY3RlZFR5cGUgfHwgJycpO1xyXG4gICAgICAgICAgICBpc1ZhbGlkID0gdmFsaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaXNWYWxpZCkge1xyXG4gICAgICAgICAgICB3YXJuKGdldEludmFsaWRUeXBlTWVzc2FnZShuYW1lLCB2YWx1ZSwgZXhwZWN0ZWRUeXBlcykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gY3VzdG9tIHZhbGlkYXRvclxyXG4gICAgaWYgKHZhbGlkYXRvciAmJiAhdmFsaWRhdG9yKHZhbHVlKSkge1xyXG4gICAgICAgIHdhcm4oJ0ludmFsaWQgcHJvcDogY3VzdG9tIHZhbGlkYXRvciBjaGVjayBmYWlsZWQgZm9yIHByb3AgXCInICsgbmFtZSArICdcIi4nKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBpc1NpbXBsZVR5cGUgPSAvKiNfX1BVUkVfXyovIG1ha2VNYXAoJ1N0cmluZyxOdW1iZXIsQm9vbGVhbixGdW5jdGlvbixTeW1ib2wnKTtcclxuLyoqXHJcbiAqIGRldiBvbmx5XHJcbiAqL1xyXG5mdW5jdGlvbiBhc3NlcnRUeXBlKHZhbHVlLCB0eXBlKSB7XHJcbiAgICBsZXQgdmFsaWQ7XHJcbiAgICBjb25zdCBleHBlY3RlZFR5cGUgPSBnZXRUeXBlKHR5cGUpO1xyXG4gICAgaWYgKGlzU2ltcGxlVHlwZShleHBlY3RlZFR5cGUpKSB7XHJcbiAgICAgICAgY29uc3QgdCA9IHR5cGVvZiB2YWx1ZTtcclxuICAgICAgICB2YWxpZCA9IHQgPT09IGV4cGVjdGVkVHlwZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIC8vIGZvciBwcmltaXRpdmUgd3JhcHBlciBvYmplY3RzXHJcbiAgICAgICAgaWYgKCF2YWxpZCAmJiB0ID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB2YWxpZCA9IHZhbHVlIGluc3RhbmNlb2YgdHlwZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChleHBlY3RlZFR5cGUgPT09ICdPYmplY3QnKSB7XHJcbiAgICAgICAgdmFsaWQgPSB0b1Jhd1R5cGUodmFsdWUpID09PSAnT2JqZWN0JztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGV4cGVjdGVkVHlwZSA9PT0gJ0FycmF5Jykge1xyXG4gICAgICAgIHZhbGlkID0gaXNBcnJheSh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB2YWxpZCA9IHZhbHVlIGluc3RhbmNlb2YgdHlwZTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdmFsaWQsXHJcbiAgICAgICAgZXhwZWN0ZWRUeXBlXHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBkZXYgb25seVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW52YWxpZFR5cGVNZXNzYWdlKG5hbWUsIHZhbHVlLCBleHBlY3RlZFR5cGVzKSB7XHJcbiAgICBsZXQgbWVzc2FnZSA9IGBJbnZhbGlkIHByb3A6IHR5cGUgY2hlY2sgZmFpbGVkIGZvciBwcm9wIFwiJHtuYW1lfVwiLmAgK1xyXG4gICAgICAgIGAgRXhwZWN0ZWQgJHtleHBlY3RlZFR5cGVzLm1hcChjYXBpdGFsaXplKS5qb2luKCcsICcpfWA7XHJcbiAgICBjb25zdCBleHBlY3RlZFR5cGUgPSBleHBlY3RlZFR5cGVzWzBdO1xyXG4gICAgY29uc3QgcmVjZWl2ZWRUeXBlID0gdG9SYXdUeXBlKHZhbHVlKTtcclxuICAgIGNvbnN0IGV4cGVjdGVkVmFsdWUgPSBzdHlsZVZhbHVlKHZhbHVlLCBleHBlY3RlZFR5cGUpO1xyXG4gICAgY29uc3QgcmVjZWl2ZWRWYWx1ZSA9IHN0eWxlVmFsdWUodmFsdWUsIHJlY2VpdmVkVHlwZSk7XHJcbiAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIHNwZWNpZnkgZXhwZWN0ZWQgdmFsdWVcclxuICAgIGlmIChleHBlY3RlZFR5cGVzLmxlbmd0aCA9PT0gMSAmJlxyXG4gICAgICAgIGlzRXhwbGljYWJsZShleHBlY3RlZFR5cGUpICYmXHJcbiAgICAgICAgIWlzQm9vbGVhbihleHBlY3RlZFR5cGUsIHJlY2VpdmVkVHlwZSkpIHtcclxuICAgICAgICBtZXNzYWdlICs9IGAgd2l0aCB2YWx1ZSAke2V4cGVjdGVkVmFsdWV9YDtcclxuICAgIH1cclxuICAgIG1lc3NhZ2UgKz0gYCwgZ290ICR7cmVjZWl2ZWRUeXBlfSBgO1xyXG4gICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBzcGVjaWZ5IHJlY2VpdmVkIHZhbHVlXHJcbiAgICBpZiAoaXNFeHBsaWNhYmxlKHJlY2VpdmVkVHlwZSkpIHtcclxuICAgICAgICBtZXNzYWdlICs9IGB3aXRoIHZhbHVlICR7cmVjZWl2ZWRWYWx1ZX0uYDtcclxuICAgIH1cclxuICAgIHJldHVybiBtZXNzYWdlO1xyXG59XHJcbi8qKlxyXG4gKiBkZXYgb25seVxyXG4gKi9cclxuZnVuY3Rpb24gc3R5bGVWYWx1ZSh2YWx1ZSwgdHlwZSkge1xyXG4gICAgaWYgKHR5cGUgPT09ICdTdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcIiR7dmFsdWV9XCJgO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZSA9PT0gJ051bWJlcicpIHtcclxuICAgICAgICByZXR1cm4gYCR7TnVtYmVyKHZhbHVlKX1gO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIGRldiBvbmx5XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0V4cGxpY2FibGUodHlwZSkge1xyXG4gICAgY29uc3QgZXhwbGljaXRUeXBlcyA9IFsnc3RyaW5nJywgJ251bWJlcicsICdib29sZWFuJ107XHJcbiAgICByZXR1cm4gZXhwbGljaXRUeXBlcy5zb21lKGVsZW0gPT4gdHlwZS50b0xvd2VyQ2FzZSgpID09PSBlbGVtKTtcclxufVxyXG4vKipcclxuICogZGV2IG9ubHlcclxuICovXHJcbmZ1bmN0aW9uIGlzQm9vbGVhbiguLi5hcmdzKSB7XHJcbiAgICByZXR1cm4gYXJncy5zb21lKGVsZW0gPT4gZWxlbS50b0xvd2VyQ2FzZSgpID09PSAnYm9vbGVhbicpO1xyXG59XG5cbmZ1bmN0aW9uIGluamVjdEhvb2sodHlwZSwgaG9vaywgdGFyZ2V0ID0gY3VycmVudEluc3RhbmNlLCBwcmVwZW5kID0gZmFsc2UpIHtcclxuICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICBjb25zdCBob29rcyA9IHRhcmdldFt0eXBlXSB8fCAodGFyZ2V0W3R5cGVdID0gW10pO1xyXG4gICAgICAgIC8vIGNhY2hlIHRoZSBlcnJvciBoYW5kbGluZyB3cmFwcGVyIGZvciBpbmplY3RlZCBob29rcyBzbyB0aGUgc2FtZSBob29rXHJcbiAgICAgICAgLy8gY2FuIGJlIHByb3Blcmx5IGRlZHVwZWQgYnkgdGhlIHNjaGVkdWxlci4gXCJfX3dlaFwiIHN0YW5kcyBmb3IgXCJ3aXRoIGVycm9yXHJcbiAgICAgICAgLy8gaGFuZGxpbmdcIi5cclxuICAgICAgICBjb25zdCB3cmFwcGVkSG9vayA9IGhvb2suX193ZWggfHxcclxuICAgICAgICAgICAgKGhvb2suX193ZWggPSAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5pc1VubW91bnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGRpc2FibGUgdHJhY2tpbmcgaW5zaWRlIGFsbCBsaWZlY3ljbGUgaG9va3NcclxuICAgICAgICAgICAgICAgIC8vIHNpbmNlIHRoZXkgY2FuIHBvdGVudGlhbGx5IGJlIGNhbGxlZCBpbnNpZGUgZWZmZWN0cy5cclxuICAgICAgICAgICAgICAgIHBhdXNlVHJhY2tpbmcoKTtcclxuICAgICAgICAgICAgICAgIC8vIFNldCBjdXJyZW50SW5zdGFuY2UgZHVyaW5nIGhvb2sgaW52b2NhdGlvbi5cclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgYXNzdW1lcyB0aGUgaG9vayBkb2VzIG5vdCBzeW5jaHJvbm91c2x5IHRyaWdnZXIgb3RoZXIgaG9va3MsIHdoaWNoXHJcbiAgICAgICAgICAgICAgICAvLyBjYW4gb25seSBiZSBmYWxzZSB3aGVuIHRoZSB1c2VyIGRvZXMgc29tZXRoaW5nIHJlYWxseSBmdW5reS5cclxuICAgICAgICAgICAgICAgIHNldEN1cnJlbnRJbnN0YW5jZSh0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcoaG9vaywgdGFyZ2V0LCB0eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgICAgIHNldEN1cnJlbnRJbnN0YW5jZShudWxsKTtcclxuICAgICAgICAgICAgICAgIHJlc2V0VHJhY2tpbmcoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChwcmVwZW5kKSB7XHJcbiAgICAgICAgICAgIGhvb2tzLnVuc2hpZnQod3JhcHBlZEhvb2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaG9va3MucHVzaCh3cmFwcGVkSG9vayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgY29uc3QgYXBpTmFtZSA9IGBvbiR7Y2FwaXRhbGl6ZShFcnJvclR5cGVTdHJpbmdzW3R5cGVdLnJlcGxhY2UoLyBob29rJC8sICcnKSl9YDtcclxuICAgICAgICB3YXJuKGAke2FwaU5hbWV9IGlzIGNhbGxlZCB3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBjb21wb25lbnQgaW5zdGFuY2UgdG8gYmUgYCArXHJcbiAgICAgICAgICAgIGBhc3NvY2lhdGVkIHdpdGguIGAgK1xyXG4gICAgICAgICAgICBgTGlmZWN5Y2xlIGluamVjdGlvbiBBUElzIGNhbiBvbmx5IGJlIHVzZWQgZHVyaW5nIGV4ZWN1dGlvbiBvZiBzZXR1cCgpLmAgK1xyXG4gICAgICAgICAgICAoIGAgSWYgeW91IGFyZSB1c2luZyBhc3luYyBzZXR1cCgpLCBtYWtlIHN1cmUgdG8gcmVnaXN0ZXIgbGlmZWN5Y2xlIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGBob29rcyBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0IHN0YXRlbWVudC5gXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBjcmVhdGVIb29rID0gKGxpZmVjeWNsZSkgPT4gKGhvb2ssIHRhcmdldCA9IGN1cnJlbnRJbnN0YW5jZSkgPT4gXHJcbi8vIHBvc3QtY3JlYXRlIGxpZmVjeWNsZSByZWdpc3RyYXRpb25zIGFyZSBub29wcyBkdXJpbmcgU1NSXHJcbiFpc0luU1NSQ29tcG9uZW50U2V0dXAgJiYgaW5qZWN0SG9vayhsaWZlY3ljbGUsIGhvb2ssIHRhcmdldCk7XHJcbmNvbnN0IG9uQmVmb3JlTW91bnQgPSBjcmVhdGVIb29rKFwiYm1cIiAvKiBCRUZPUkVfTU9VTlQgKi8pO1xyXG5jb25zdCBvbk1vdW50ZWQgPSBjcmVhdGVIb29rKFwibVwiIC8qIE1PVU5URUQgKi8pO1xyXG5jb25zdCBvbkJlZm9yZVVwZGF0ZSA9IGNyZWF0ZUhvb2soXCJidVwiIC8qIEJFRk9SRV9VUERBVEUgKi8pO1xyXG5jb25zdCBvblVwZGF0ZWQgPSBjcmVhdGVIb29rKFwidVwiIC8qIFVQREFURUQgKi8pO1xyXG5jb25zdCBvbkJlZm9yZVVubW91bnQgPSBjcmVhdGVIb29rKFwiYnVtXCIgLyogQkVGT1JFX1VOTU9VTlQgKi8pO1xyXG5jb25zdCBvblVubW91bnRlZCA9IGNyZWF0ZUhvb2soXCJ1bVwiIC8qIFVOTU9VTlRFRCAqLyk7XHJcbmNvbnN0IG9uUmVuZGVyVHJpZ2dlcmVkID0gY3JlYXRlSG9vayhcInJ0Z1wiIC8qIFJFTkRFUl9UUklHR0VSRUQgKi8pO1xyXG5jb25zdCBvblJlbmRlclRyYWNrZWQgPSBjcmVhdGVIb29rKFwicnRjXCIgLyogUkVOREVSX1RSQUNLRUQgKi8pO1xyXG5jb25zdCBvbkVycm9yQ2FwdHVyZWQgPSAoaG9vaywgdGFyZ2V0ID0gY3VycmVudEluc3RhbmNlKSA9PiB7XHJcbiAgICBpbmplY3RIb29rKFwiZWNcIiAvKiBFUlJPUl9DQVBUVVJFRCAqLywgaG9vaywgdGFyZ2V0KTtcclxufTtcblxuZnVuY3Rpb24gdXNlVHJhbnNpdGlvblN0YXRlKCkge1xyXG4gICAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICAgICAgaXNNb3VudGVkOiBmYWxzZSxcclxuICAgICAgICBpc0xlYXZpbmc6IGZhbHNlLFxyXG4gICAgICAgIGlzVW5tb3VudGluZzogZmFsc2UsXHJcbiAgICAgICAgbGVhdmluZ1ZOb2RlczogbmV3IE1hcCgpXHJcbiAgICB9O1xyXG4gICAgb25Nb3VudGVkKCgpID0+IHtcclxuICAgICAgICBzdGF0ZS5pc01vdW50ZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgICBvbkJlZm9yZVVubW91bnQoKCkgPT4ge1xyXG4gICAgICAgIHN0YXRlLmlzVW5tb3VudGluZyA9IHRydWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBzdGF0ZTtcclxufVxyXG5jb25zdCBCYXNlVHJhbnNpdGlvbkltcGwgPSB7XHJcbiAgICBuYW1lOiBgQmFzZVRyYW5zaXRpb25gLFxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgICBtb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgYXBwZWFyOiBCb29sZWFuLFxyXG4gICAgICAgIHBlcnNpc3RlZDogQm9vbGVhbixcclxuICAgICAgICAvLyBlbnRlclxyXG4gICAgICAgIG9uQmVmb3JlRW50ZXI6IEZ1bmN0aW9uLFxyXG4gICAgICAgIG9uRW50ZXI6IEZ1bmN0aW9uLFxyXG4gICAgICAgIG9uQWZ0ZXJFbnRlcjogRnVuY3Rpb24sXHJcbiAgICAgICAgb25FbnRlckNhbmNlbGxlZDogRnVuY3Rpb24sXHJcbiAgICAgICAgLy8gbGVhdmVcclxuICAgICAgICBvbkJlZm9yZUxlYXZlOiBGdW5jdGlvbixcclxuICAgICAgICBvbkxlYXZlOiBGdW5jdGlvbixcclxuICAgICAgICBvbkFmdGVyTGVhdmU6IEZ1bmN0aW9uLFxyXG4gICAgICAgIG9uTGVhdmVDYW5jZWxsZWQ6IEZ1bmN0aW9uLFxyXG4gICAgICAgIC8vIGFwcGVhclxyXG4gICAgICAgIG9uQmVmb3JlQXBwZWFyOiBGdW5jdGlvbixcclxuICAgICAgICBvbkFwcGVhcjogRnVuY3Rpb24sXHJcbiAgICAgICAgb25BZnRlckFwcGVhcjogRnVuY3Rpb24sXHJcbiAgICAgICAgb25BcHBlYXJDYW5jZWxsZWQ6IEZ1bmN0aW9uXHJcbiAgICB9LFxyXG4gICAgc2V0dXAocHJvcHMsIHsgc2xvdHMgfSkge1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gZ2V0Q3VycmVudEluc3RhbmNlKCk7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB1c2VUcmFuc2l0aW9uU3RhdGUoKTtcclxuICAgICAgICBsZXQgcHJldlRyYW5zaXRpb25LZXk7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBzbG90cy5kZWZhdWx0ICYmIGdldFRyYW5zaXRpb25SYXdDaGlsZHJlbihzbG90cy5kZWZhdWx0KCksIHRydWUpO1xyXG4gICAgICAgICAgICBpZiAoIWNoaWxkcmVuIHx8ICFjaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB3YXJuIG11bHRpcGxlIGVsZW1lbnRzXHJcbiAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgd2FybignPHRyYW5zaXRpb24+IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBzaW5nbGUgZWxlbWVudCBvciBjb21wb25lbnQuIFVzZSAnICtcclxuICAgICAgICAgICAgICAgICAgICAnPHRyYW5zaXRpb24tZ3JvdXA+IGZvciBsaXN0cy4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB0aGVyZSdzIG5vIG5lZWQgdG8gdHJhY2sgcmVhY3Rpdml0eSBmb3IgdGhlc2UgcHJvcHMgc28gdXNlIHRoZSByYXdcclxuICAgICAgICAgICAgLy8gcHJvcHMgZm9yIGEgYml0IGJldHRlciBwZXJmXHJcbiAgICAgICAgICAgIGNvbnN0IHJhd1Byb3BzID0gdG9SYXcocHJvcHMpO1xyXG4gICAgICAgICAgICBjb25zdCB7IG1vZGUgfSA9IHJhd1Byb3BzO1xyXG4gICAgICAgICAgICAvLyBjaGVjayBtb2RlXHJcbiAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgbW9kZSAmJiAhWydpbi1vdXQnLCAnb3V0LWluJywgJ2RlZmF1bHQnXS5pbmNsdWRlcyhtb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgd2FybihgaW52YWxpZCA8dHJhbnNpdGlvbj4gbW9kZTogJHttb2RlfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGF0IHRoaXMgcG9pbnQgY2hpbGRyZW4gaGFzIGEgZ3VhcmFudGVlZCBsZW5ndGggb2YgMS5cclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlblswXTtcclxuICAgICAgICAgICAgaWYgKHN0YXRlLmlzTGVhdmluZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVtcHR5UGxhY2Vob2xkZXIoY2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGluIHRoZSBjYXNlIG9mIDx0cmFuc2l0aW9uPjxrZWVwLWFsaXZlLz48L3RyYW5zaXRpb24+LCB3ZSBuZWVkIHRvXHJcbiAgICAgICAgICAgIC8vIGNvbXBhcmUgdGhlIHR5cGUgb2YgdGhlIGtlcHQtYWxpdmUgY2hpbGRyZW4uXHJcbiAgICAgICAgICAgIGNvbnN0IGlubmVyQ2hpbGQgPSBnZXRLZWVwQWxpdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgICAgIGlmICghaW5uZXJDaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVtcHR5UGxhY2Vob2xkZXIoY2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGVudGVySG9va3MgPSAoaW5uZXJDaGlsZC50cmFuc2l0aW9uID0gcmVzb2x2ZVRyYW5zaXRpb25Ib29rcyhpbm5lckNoaWxkLCByYXdQcm9wcywgc3RhdGUsIGluc3RhbmNlKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZENoaWxkID0gaW5zdGFuY2Uuc3ViVHJlZTtcclxuICAgICAgICAgICAgY29uc3Qgb2xkSW5uZXJDaGlsZCA9IG9sZENoaWxkICYmIGdldEtlZXBBbGl2ZUNoaWxkKG9sZENoaWxkKTtcclxuICAgICAgICAgICAgbGV0IHRyYW5zaXRpb25LZXlDaGFuZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgZ2V0VHJhbnNpdGlvbktleSB9ID0gaW5uZXJDaGlsZC50eXBlO1xyXG4gICAgICAgICAgICBpZiAoZ2V0VHJhbnNpdGlvbktleSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gZ2V0VHJhbnNpdGlvbktleSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZUcmFuc2l0aW9uS2V5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2VHJhbnNpdGlvbktleSA9IGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGtleSAhPT0gcHJldlRyYW5zaXRpb25LZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2VHJhbnNpdGlvbktleSA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uS2V5Q2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaGFuZGxlIG1vZGVcclxuICAgICAgICAgICAgaWYgKG9sZElubmVyQ2hpbGQgJiZcclxuICAgICAgICAgICAgICAgIG9sZElubmVyQ2hpbGQudHlwZSAhPT0gQ29tbWVudCAmJlxyXG4gICAgICAgICAgICAgICAgKCFpc1NhbWVWTm9kZVR5cGUoaW5uZXJDaGlsZCwgb2xkSW5uZXJDaGlsZCkgfHwgdHJhbnNpdGlvbktleUNoYW5nZWQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsZWF2aW5nSG9va3MgPSByZXNvbHZlVHJhbnNpdGlvbkhvb2tzKG9sZElubmVyQ2hpbGQsIHJhd1Byb3BzLCBzdGF0ZSwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIG9sZCB0cmVlJ3MgaG9va3MgaW4gY2FzZSBvZiBkeW5hbWljIHRyYW5zaXRpb25cclxuICAgICAgICAgICAgICAgIHNldFRyYW5zaXRpb25Ib29rcyhvbGRJbm5lckNoaWxkLCBsZWF2aW5nSG9va3MpO1xyXG4gICAgICAgICAgICAgICAgLy8gc3dpdGNoaW5nIGJldHdlZW4gZGlmZmVyZW50IHZpZXdzXHJcbiAgICAgICAgICAgICAgICBpZiAobW9kZSA9PT0gJ291dC1pbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5pc0xlYXZpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBwbGFjZWhvbGRlciBub2RlIGFuZCBxdWV1ZSB1cGRhdGUgd2hlbiBsZWF2ZSBmaW5pc2hlc1xyXG4gICAgICAgICAgICAgICAgICAgIGxlYXZpbmdIb29rcy5hZnRlckxlYXZlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5pc0xlYXZpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW1wdHlQbGFjZWhvbGRlcihjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtb2RlID09PSAnaW4tb3V0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlYXZpbmdIb29rcy5kZWxheUxlYXZlID0gKGVsLCBlYXJseVJlbW92ZSwgZGVsYXllZExlYXZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlYXZpbmdWTm9kZXNDYWNoZSA9IGdldExlYXZpbmdOb2Rlc0ZvclR5cGUoc3RhdGUsIG9sZElubmVyQ2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWF2aW5nVk5vZGVzQ2FjaGVbU3RyaW5nKG9sZElubmVyQ2hpbGQua2V5KV0gPSBvbGRJbm5lckNoaWxkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlYXJseSByZW1vdmFsIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLl9sZWF2ZUNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFybHlSZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLl9sZWF2ZUNiID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGVudGVySG9va3MuZGVsYXllZExlYXZlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRlckhvb2tzLmRlbGF5ZWRMZWF2ZSA9IGRlbGF5ZWRMZWF2ZTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG4vLyBleHBvcnQgdGhlIHB1YmxpYyB0eXBlIGZvciBoL3RzeCBpbmZlcmVuY2VcclxuLy8gYWxzbyB0byBhdm9pZCBpbmxpbmUgaW1wb3J0KCkgaW4gZ2VuZXJhdGVkIGQudHMgZmlsZXNcclxuY29uc3QgQmFzZVRyYW5zaXRpb24gPSBCYXNlVHJhbnNpdGlvbkltcGw7XHJcbmZ1bmN0aW9uIGdldExlYXZpbmdOb2Rlc0ZvclR5cGUoc3RhdGUsIHZub2RlKSB7XHJcbiAgICBjb25zdCB7IGxlYXZpbmdWTm9kZXMgfSA9IHN0YXRlO1xyXG4gICAgbGV0IGxlYXZpbmdWTm9kZXNDYWNoZSA9IGxlYXZpbmdWTm9kZXMuZ2V0KHZub2RlLnR5cGUpO1xyXG4gICAgaWYgKCFsZWF2aW5nVk5vZGVzQ2FjaGUpIHtcclxuICAgICAgICBsZWF2aW5nVk5vZGVzQ2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIGxlYXZpbmdWTm9kZXMuc2V0KHZub2RlLnR5cGUsIGxlYXZpbmdWTm9kZXNDYWNoZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVhdmluZ1ZOb2Rlc0NhY2hlO1xyXG59XHJcbi8vIFRoZSB0cmFuc2l0aW9uIGhvb2tzIGFyZSBhdHRhY2hlZCB0byB0aGUgdm5vZGUgYXMgdm5vZGUudHJhbnNpdGlvblxyXG4vLyBhbmQgd2lsbCBiZSBjYWxsZWQgYXQgYXBwcm9wcmlhdGUgdGltaW5nIGluIHRoZSByZW5kZXJlci5cclxuZnVuY3Rpb24gcmVzb2x2ZVRyYW5zaXRpb25Ib29rcyh2bm9kZSwgeyBhcHBlYXIsIHBlcnNpc3RlZCA9IGZhbHNlLCBvbkJlZm9yZUVudGVyLCBvbkVudGVyLCBvbkFmdGVyRW50ZXIsIG9uRW50ZXJDYW5jZWxsZWQsIG9uQmVmb3JlTGVhdmUsIG9uTGVhdmUsIG9uQWZ0ZXJMZWF2ZSwgb25MZWF2ZUNhbmNlbGxlZCwgb25CZWZvcmVBcHBlYXIsIG9uQXBwZWFyLCBvbkFmdGVyQXBwZWFyLCBvbkFwcGVhckNhbmNlbGxlZCB9LCBzdGF0ZSwgaW5zdGFuY2UpIHtcclxuICAgIGNvbnN0IGtleSA9IFN0cmluZyh2bm9kZS5rZXkpO1xyXG4gICAgY29uc3QgbGVhdmluZ1ZOb2Rlc0NhY2hlID0gZ2V0TGVhdmluZ05vZGVzRm9yVHlwZShzdGF0ZSwgdm5vZGUpO1xyXG4gICAgY29uc3QgY2FsbEhvb2sgPSAoaG9vaywgYXJncykgPT4ge1xyXG4gICAgICAgIGhvb2sgJiZcclxuICAgICAgICAgICAgY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcoaG9vaywgaW5zdGFuY2UsIDkgLyogVFJBTlNJVElPTl9IT09LICovLCBhcmdzKTtcclxuICAgIH07XHJcbiAgICBjb25zdCBob29rcyA9IHtcclxuICAgICAgICBwZXJzaXN0ZWQsXHJcbiAgICAgICAgYmVmb3JlRW50ZXIoZWwpIHtcclxuICAgICAgICAgICAgbGV0IGhvb2sgPSBvbkJlZm9yZUVudGVyO1xyXG4gICAgICAgICAgICBpZiAoIXN0YXRlLmlzTW91bnRlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFwcGVhcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGhvb2sgPSBvbkJlZm9yZUFwcGVhciB8fCBvbkJlZm9yZUVudGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGZvciBzYW1lIGVsZW1lbnQgKHYtc2hvdylcclxuICAgICAgICAgICAgaWYgKGVsLl9sZWF2ZUNiKSB7XHJcbiAgICAgICAgICAgICAgICBlbC5fbGVhdmVDYih0cnVlIC8qIGNhbmNlbGxlZCAqLyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZm9yIHRvZ2dsZWQgZWxlbWVudCB3aXRoIHNhbWUga2V5ICh2LWlmKVxyXG4gICAgICAgICAgICBjb25zdCBsZWF2aW5nVk5vZGUgPSBsZWF2aW5nVk5vZGVzQ2FjaGVba2V5XTtcclxuICAgICAgICAgICAgaWYgKGxlYXZpbmdWTm9kZSAmJlxyXG4gICAgICAgICAgICAgICAgaXNTYW1lVk5vZGVUeXBlKHZub2RlLCBsZWF2aW5nVk5vZGUpICYmXHJcbiAgICAgICAgICAgICAgICBsZWF2aW5nVk5vZGUuZWwuX2xlYXZlQ2IpIHtcclxuICAgICAgICAgICAgICAgIC8vIGZvcmNlIGVhcmx5IHJlbW92YWwgKG5vdCBjYW5jZWxsZWQpXHJcbiAgICAgICAgICAgICAgICBsZWF2aW5nVk5vZGUuZWwuX2xlYXZlQ2IoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWxsSG9vayhob29rLCBbZWxdKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudGVyKGVsKSB7XHJcbiAgICAgICAgICAgIGxldCBob29rID0gb25FbnRlcjtcclxuICAgICAgICAgICAgbGV0IGFmdGVySG9vayA9IG9uQWZ0ZXJFbnRlcjtcclxuICAgICAgICAgICAgbGV0IGNhbmNlbEhvb2sgPSBvbkVudGVyQ2FuY2VsbGVkO1xyXG4gICAgICAgICAgICBpZiAoIXN0YXRlLmlzTW91bnRlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFwcGVhcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGhvb2sgPSBvbkFwcGVhciB8fCBvbkVudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGFmdGVySG9vayA9IG9uQWZ0ZXJBcHBlYXIgfHwgb25BZnRlckVudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbEhvb2sgPSBvbkFwcGVhckNhbmNlbGxlZCB8fCBvbkVudGVyQ2FuY2VsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBjYWxsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29uc3QgZG9uZSA9IChlbC5fZW50ZXJDYiA9IChjYW5jZWxsZWQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY2FsbGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChjYW5jZWxsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsSG9vayhjYW5jZWxIb29rLCBbZWxdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxIb29rKGFmdGVySG9vaywgW2VsXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaG9va3MuZGVsYXllZExlYXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaG9va3MuZGVsYXllZExlYXZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbC5fZW50ZXJDYiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChob29rKSB7XHJcbiAgICAgICAgICAgICAgICBob29rKGVsLCBkb25lKTtcclxuICAgICAgICAgICAgICAgIGlmIChob29rLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsZWF2ZShlbCwgcmVtb3ZlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IFN0cmluZyh2bm9kZS5rZXkpO1xyXG4gICAgICAgICAgICBpZiAoZWwuX2VudGVyQ2IpIHtcclxuICAgICAgICAgICAgICAgIGVsLl9lbnRlckNiKHRydWUgLyogY2FuY2VsbGVkICovKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc3RhdGUuaXNVbm1vdW50aW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbEhvb2sob25CZWZvcmVMZWF2ZSwgW2VsXSk7XHJcbiAgICAgICAgICAgIGxldCBjYWxsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29uc3QgZG9uZSA9IChlbC5fbGVhdmVDYiA9IChjYW5jZWxsZWQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY2FsbGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbmNlbGxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxIb29rKG9uTGVhdmVDYW5jZWxsZWQsIFtlbF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbEhvb2sob25BZnRlckxlYXZlLCBbZWxdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsLl9sZWF2ZUNiID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxlYXZpbmdWTm9kZXNDYWNoZVtrZXldID09PSB2bm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBsZWF2aW5nVk5vZGVzQ2FjaGVba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxlYXZpbmdWTm9kZXNDYWNoZVtrZXldID0gdm5vZGU7XHJcbiAgICAgICAgICAgIGlmIChvbkxlYXZlKSB7XHJcbiAgICAgICAgICAgICAgICBvbkxlYXZlKGVsLCBkb25lKTtcclxuICAgICAgICAgICAgICAgIGlmIChvbkxlYXZlLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBob29rcztcclxufVxyXG4vLyB0aGUgcGxhY2Vob2xkZXIgcmVhbGx5IG9ubHkgaGFuZGxlcyBvbmUgc3BlY2lhbCBjYXNlOiBLZWVwQWxpdmVcclxuLy8gaW4gdGhlIGNhc2Ugb2YgYSBLZWVwQWxpdmUgaW4gYSBsZWF2ZSBwaGFzZSB3ZSBuZWVkIHRvIHJldHVybiBhIEtlZXBBbGl2ZVxyXG4vLyBwbGFjZWhvbGRlciB3aXRoIGVtcHR5IGNvbnRlbnQgdG8gYXZvaWQgdGhlIEtlZXBBbGl2ZSBpbnN0YW5jZSBmcm9tIGJlaW5nXHJcbi8vIHVubW91bnRlZC5cclxuZnVuY3Rpb24gZW1wdHlQbGFjZWhvbGRlcih2bm9kZSkge1xyXG4gICAgaWYgKGlzS2VlcEFsaXZlKHZub2RlKSkge1xyXG4gICAgICAgIHZub2RlID0gY2xvbmVWTm9kZSh2bm9kZSk7XHJcbiAgICAgICAgdm5vZGUuY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICAgIHJldHVybiB2bm9kZTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRLZWVwQWxpdmVDaGlsZCh2bm9kZSkge1xyXG4gICAgcmV0dXJuIGlzS2VlcEFsaXZlKHZub2RlKVxyXG4gICAgICAgID8gdm5vZGUuY2hpbGRyZW5cclxuICAgICAgICAgICAgPyB2bm9kZS5jaGlsZHJlblswXVxyXG4gICAgICAgICAgICA6IHVuZGVmaW5lZFxyXG4gICAgICAgIDogdm5vZGU7XHJcbn1cclxuZnVuY3Rpb24gc2V0VHJhbnNpdGlvbkhvb2tzKHZub2RlLCBob29rcykge1xyXG4gICAgaWYgKHZub2RlLnNoYXBlRmxhZyAmIDYgLyogQ09NUE9ORU5UICovICYmIHZub2RlLmNvbXBvbmVudCkge1xyXG4gICAgICAgIHNldFRyYW5zaXRpb25Ib29rcyh2bm9kZS5jb21wb25lbnQuc3ViVHJlZSwgaG9va3MpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdm5vZGUudHJhbnNpdGlvbiA9IGhvb2tzO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldFRyYW5zaXRpb25SYXdDaGlsZHJlbihjaGlsZHJlbiwga2VlcENvbW1lbnQgPSBmYWxzZSkge1xyXG4gICAgbGV0IHJldCA9IFtdO1xyXG4gICAgbGV0IGtleWVkRnJhZ21lbnRDb3VudCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICAvLyBoYW5kbGUgZnJhZ21lbnQgY2hpbGRyZW4gY2FzZSwgZS5nLiB2LWZvclxyXG4gICAgICAgIGlmIChjaGlsZC50eXBlID09PSBGcmFnbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQucGF0Y2hGbGFnICYgMTI4IC8qIEtFWUVEX0ZSQUdNRU5UICovKVxyXG4gICAgICAgICAgICAgICAga2V5ZWRGcmFnbWVudENvdW50Kys7XHJcbiAgICAgICAgICAgIHJldCA9IHJldC5jb25jYXQoZ2V0VHJhbnNpdGlvblJhd0NoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBrZWVwQ29tbWVudCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb21tZW50IHBsYWNlaG9sZGVycyBzaG91bGQgYmUgc2tpcHBlZCwgZS5nLiB2LWlmXHJcbiAgICAgICAgZWxzZSBpZiAoa2VlcENvbW1lbnQgfHwgY2hpbGQudHlwZSAhPT0gQ29tbWVudCkge1xyXG4gICAgICAgICAgICByZXQucHVzaChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gIzExMjYgaWYgYSB0cmFuc2l0aW9uIGNoaWxkcmVuIGxpc3QgY29udGFpbnMgbXVsdGlwbGUgc3ViIGZyYWdtZW50cywgdGhlc2VcclxuICAgIC8vIGZyYWdtZW50cyB3aWxsIGJlIG1lcmdlZCBpbnRvIGEgZmxhdCBjaGlsZHJlbiBhcnJheS4gU2luY2UgZWFjaCB2LWZvclxyXG4gICAgLy8gZnJhZ21lbnQgbWF5IGNvbnRhaW4gZGlmZmVyZW50IHN0YXRpYyBiaW5kaW5ncyBpbnNpZGUsIHdlIG5lZWQgdG8gZGUtdG9wXHJcbiAgICAvLyB0aGVzZSBjaGlsZHJlbiB0byBmb3JjZSBmdWxsIGRpZmZzIHRvIGVuc3VyZSBjb3JyZWN0IGJlaGF2aW9yLlxyXG4gICAgaWYgKGtleWVkRnJhZ21lbnRDb3VudCA+IDEpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByZXRbaV0ucGF0Y2hGbGFnID0gLTIgLyogQkFJTCAqLztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0O1xyXG59XG5cbmNvbnN0IGlzS2VlcEFsaXZlID0gKHZub2RlKSA9PiB2bm9kZS50eXBlLl9faXNLZWVwQWxpdmU7XHJcbmNvbnN0IEtlZXBBbGl2ZUltcGwgPSB7XHJcbiAgICBuYW1lOiBgS2VlcEFsaXZlYCxcclxuICAgIC8vIE1hcmtlciBmb3Igc3BlY2lhbCBoYW5kbGluZyBpbnNpZGUgdGhlIHJlbmRlcmVyLiBXZSBhcmUgbm90IHVzaW5nIGEgPT09XHJcbiAgICAvLyBjaGVjayBkaXJlY3RseSBvbiBLZWVwQWxpdmUgaW4gdGhlIHJlbmRlcmVyLCBiZWNhdXNlIGltcG9ydGluZyBpdCBkaXJlY3RseVxyXG4gICAgLy8gd291bGQgcHJldmVudCBpdCBmcm9tIGJlaW5nIHRyZWUtc2hha2VuLlxyXG4gICAgX19pc0tlZXBBbGl2ZTogdHJ1ZSxcclxuICAgIGluaGVyaXRSZWY6IHRydWUsXHJcbiAgICBwcm9wczoge1xyXG4gICAgICAgIGluY2x1ZGU6IFtTdHJpbmcsIFJlZ0V4cCwgQXJyYXldLFxyXG4gICAgICAgIGV4Y2x1ZGU6IFtTdHJpbmcsIFJlZ0V4cCwgQXJyYXldLFxyXG4gICAgICAgIG1heDogW1N0cmluZywgTnVtYmVyXVxyXG4gICAgfSxcclxuICAgIHNldHVwKHByb3BzLCB7IHNsb3RzIH0pIHtcclxuICAgICAgICBjb25zdCBjYWNoZSA9IG5ldyBNYXAoKTtcclxuICAgICAgICBjb25zdCBrZXlzID0gbmV3IFNldCgpO1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gbnVsbDtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFN1c3BlbnNlID0gaW5zdGFuY2Uuc3VzcGVuc2U7XHJcbiAgICAgICAgLy8gS2VlcEFsaXZlIGNvbW11bmljYXRlcyB3aXRoIHRoZSBpbnN0YW50aWF0ZWQgcmVuZGVyZXIgdmlhIHRoZVxyXG4gICAgICAgIC8vIGN0eCB3aGVyZSB0aGUgcmVuZGVyZXIgcGFzc2VzIGluIGl0cyBpbnRlcm5hbHMsXHJcbiAgICAgICAgLy8gYW5kIHRoZSBLZWVwQWxpdmUgaW5zdGFuY2UgZXhwb3NlcyBhY3RpdmF0ZS9kZWFjdGl2YXRlIGltcGxlbWVudGF0aW9ucy5cclxuICAgICAgICAvLyBUaGUgd2hvbGUgcG9pbnQgb2YgdGhpcyBpcyB0byBhdm9pZCBpbXBvcnRpbmcgS2VlcEFsaXZlIGRpcmVjdGx5IGluIHRoZVxyXG4gICAgICAgIC8vIHJlbmRlcmVyIHRvIGZhY2lsaXRhdGUgdHJlZS1zaGFraW5nLlxyXG4gICAgICAgIGNvbnN0IHNoYXJlZENvbnRleHQgPSBpbnN0YW5jZS5jdHg7XHJcbiAgICAgICAgY29uc3QgeyByZW5kZXJlcjogeyBwOiBwYXRjaCwgbTogbW92ZSwgdW06IF91bm1vdW50LCBvOiB7IGNyZWF0ZUVsZW1lbnQgfSB9IH0gPSBzaGFyZWRDb250ZXh0O1xyXG4gICAgICAgIGNvbnN0IHN0b3JhZ2VDb250YWluZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBzaGFyZWRDb250ZXh0LmFjdGl2YXRlID0gKHZub2RlLCBjb250YWluZXIsIGFuY2hvciwgaXNTVkcsIG9wdGltaXplZCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHZub2RlLmNvbXBvbmVudDtcclxuICAgICAgICAgICAgbW92ZSh2bm9kZSwgY29udGFpbmVyLCBhbmNob3IsIDAgLyogRU5URVIgKi8sIHBhcmVudFN1c3BlbnNlKTtcclxuICAgICAgICAgICAgLy8gaW4gY2FzZSBwcm9wcyBoYXZlIGNoYW5nZWRcclxuICAgICAgICAgICAgcGF0Y2goaW5zdGFuY2Uudm5vZGUsIHZub2RlLCBjb250YWluZXIsIGFuY2hvciwgaW5zdGFuY2UsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICAgICAgcXVldWVQb3N0UmVuZGVyRWZmZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmlzRGVhY3RpdmF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZS5hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW52b2tlQXJyYXlGbnMoaW5zdGFuY2UuYSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2bm9kZUhvb2sgPSB2bm9kZS5wcm9wcyAmJiB2bm9kZS5wcm9wcy5vblZub2RlTW91bnRlZDtcclxuICAgICAgICAgICAgICAgIGlmICh2bm9kZUhvb2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnZva2VWTm9kZUhvb2sodm5vZGVIb29rLCBpbnN0YW5jZS5wYXJlbnQsIHZub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgcGFyZW50U3VzcGVuc2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2hhcmVkQ29udGV4dC5kZWFjdGl2YXRlID0gKHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdm5vZGUuY29tcG9uZW50O1xyXG4gICAgICAgICAgICBtb3ZlKHZub2RlLCBzdG9yYWdlQ29udGFpbmVyLCBudWxsLCAxIC8qIExFQVZFICovLCBwYXJlbnRTdXNwZW5zZSk7XHJcbiAgICAgICAgICAgIHF1ZXVlUG9zdFJlbmRlckVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UuZGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnZva2VBcnJheUZucyhpbnN0YW5jZS5kYSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2bm9kZUhvb2sgPSB2bm9kZS5wcm9wcyAmJiB2bm9kZS5wcm9wcy5vblZub2RlVW5tb3VudGVkO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZub2RlSG9vaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGludm9rZVZOb2RlSG9vayh2bm9kZUhvb2ssIGluc3RhbmNlLnBhcmVudCwgdm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuaXNEZWFjdGl2YXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sIHBhcmVudFN1c3BlbnNlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZ1bmN0aW9uIHVubW91bnQodm5vZGUpIHtcclxuICAgICAgICAgICAgLy8gcmVzZXQgdGhlIHNoYXBlRmxhZyBzbyBpdCBjYW4gYmUgcHJvcGVybHkgdW5tb3VudGVkXHJcbiAgICAgICAgICAgIHJlc2V0U2hhcGVGbGFnKHZub2RlKTtcclxuICAgICAgICAgICAgX3VubW91bnQodm5vZGUsIGluc3RhbmNlLCBwYXJlbnRTdXNwZW5zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHBydW5lQ2FjaGUoZmlsdGVyKSB7XHJcbiAgICAgICAgICAgIGNhY2hlLmZvckVhY2goKHZub2RlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBnZXROYW1lKHZub2RlLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgJiYgKCFmaWx0ZXIgfHwgIWZpbHRlcihuYW1lKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcnVuZUNhY2hlRW50cnkoa2V5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHBydW5lQ2FjaGVFbnRyeShrZXkpIHtcclxuICAgICAgICAgICAgY29uc3QgY2FjaGVkID0gY2FjaGUuZ2V0KGtleSk7XHJcbiAgICAgICAgICAgIGlmICghY3VycmVudCB8fCBjYWNoZWQudHlwZSAhPT0gY3VycmVudC50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICB1bm1vdW50KGNhY2hlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY3VycmVudCBhY3RpdmUgaW5zdGFuY2Ugc2hvdWxkIG5vIGxvbmdlciBiZSBrZXB0LWFsaXZlLlxyXG4gICAgICAgICAgICAgICAgLy8gd2UgY2FuJ3QgdW5tb3VudCBpdCBub3cgYnV0IGl0IG1pZ2h0IGJlIGxhdGVyLCBzbyByZXNldCBpdHMgZmxhZyBub3cuXHJcbiAgICAgICAgICAgICAgICByZXNldFNoYXBlRmxhZyhjdXJyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWNoZS5kZWxldGUoa2V5KTtcclxuICAgICAgICAgICAga2V5cy5kZWxldGUoa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2F0Y2goKCkgPT4gW3Byb3BzLmluY2x1ZGUsIHByb3BzLmV4Y2x1ZGVdLCAoW2luY2x1ZGUsIGV4Y2x1ZGVdKSA9PiB7XHJcbiAgICAgICAgICAgIGluY2x1ZGUgJiYgcHJ1bmVDYWNoZShuYW1lID0+IG1hdGNoZXMoaW5jbHVkZSwgbmFtZSkpO1xyXG4gICAgICAgICAgICBleGNsdWRlICYmIHBydW5lQ2FjaGUobmFtZSA9PiBtYXRjaGVzKGV4Y2x1ZGUsIG5hbWUpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBjYWNoZSBzdWIgdHJlZSBpbiBiZWZvcmVNb3VudC9VcGRhdGUgKGkuZS4gcmlnaHQgYWZ0ZXIgdGhlIHJlbmRlcilcclxuICAgICAgICBsZXQgcGVuZGluZ0NhY2hlS2V5ID0gbnVsbDtcclxuICAgICAgICBjb25zdCBjYWNoZVN1YnRyZWUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGZpeCAjMTYyMSwgdGhlIHBlbmRpbmdDYWNoZUtleSBjb3VsZCBiZSAwXHJcbiAgICAgICAgICAgIGlmIChwZW5kaW5nQ2FjaGVLZXkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuc2V0KHBlbmRpbmdDYWNoZUtleSwgaW5zdGFuY2Uuc3ViVHJlZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIG9uQmVmb3JlTW91bnQoY2FjaGVTdWJ0cmVlKTtcclxuICAgICAgICBvbkJlZm9yZVVwZGF0ZShjYWNoZVN1YnRyZWUpO1xyXG4gICAgICAgIG9uQmVmb3JlVW5tb3VudCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNhY2hlLmZvckVhY2goY2FjaGVkID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3ViVHJlZSwgc3VzcGVuc2UgfSA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlZC50eXBlID09PSBzdWJUcmVlLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjdXJyZW50IGluc3RhbmNlIHdpbGwgYmUgdW5tb3VudGVkIGFzIHBhcnQgb2Yga2VlcC1hbGl2ZSdzIHVubW91bnRcclxuICAgICAgICAgICAgICAgICAgICByZXNldFNoYXBlRmxhZyhzdWJUcmVlKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBidXQgaW52b2tlIGl0cyBkZWFjdGl2YXRlZCBob29rIGhlcmVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYSA9IHN1YlRyZWUuY29tcG9uZW50LmRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhICYmIHF1ZXVlUG9zdFJlbmRlckVmZmVjdChkYSwgc3VzcGVuc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHVubW91bnQoY2FjaGVkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgcGVuZGluZ0NhY2hlS2V5ID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFzbG90cy5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHNsb3RzLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IHZub2RlID0gY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgS2VlcEFsaXZlIHNob3VsZCBjb250YWluIGV4YWN0bHkgb25lIGNvbXBvbmVudCBjaGlsZC5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCFpc1ZOb2RlKHZub2RlKSB8fFxyXG4gICAgICAgICAgICAgICAgISh2bm9kZS5zaGFwZUZsYWcgJiA0IC8qIFNUQVRFRlVMX0NPTVBPTkVOVCAqLykpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZub2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXAgPSB2bm9kZS50eXBlO1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gZ2V0TmFtZShjb21wKTtcclxuICAgICAgICAgICAgY29uc3QgeyBpbmNsdWRlLCBleGNsdWRlLCBtYXggfSA9IHByb3BzO1xyXG4gICAgICAgICAgICBpZiAoKGluY2x1ZGUgJiYgKCFuYW1lIHx8ICFtYXRjaGVzKGluY2x1ZGUsIG5hbWUpKSkgfHxcclxuICAgICAgICAgICAgICAgIChleGNsdWRlICYmIG5hbWUgJiYgbWF0Y2hlcyhleGNsdWRlLCBuYW1lKSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY3VycmVudCA9IHZub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSB2bm9kZS5rZXkgPT0gbnVsbCA/IGNvbXAgOiB2bm9kZS5rZXk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlZFZOb2RlID0gY2FjaGUuZ2V0KGtleSk7XHJcbiAgICAgICAgICAgIC8vIGNsb25lIHZub2RlIGlmIGl0J3MgcmV1c2VkIGJlY2F1c2Ugd2UgYXJlIGdvaW5nIHRvIG11dGF0ZSBpdFxyXG4gICAgICAgICAgICBpZiAodm5vZGUuZWwpIHtcclxuICAgICAgICAgICAgICAgIHZub2RlID0gY2xvbmVWTm9kZSh2bm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gIzE1MTMgaXQncyBwb3NzaWJsZSBmb3IgdGhlIHJldHVybmVkIHZub2RlIHRvIGJlIGNsb25lZCBkdWUgdG8gYXR0clxyXG4gICAgICAgICAgICAvLyBmYWxsdGhyb3VnaCBvciBzY29wZUlkLCBzbyB0aGUgdm5vZGUgaGVyZSBtYXkgbm90IGJlIHRoZSBmaW5hbCB2bm9kZVxyXG4gICAgICAgICAgICAvLyB0aGF0IGlzIG1vdW50ZWQuIEluc3RlYWQgb2YgY2FjaGluZyBpdCBkaXJlY3RseSwgd2Ugc3RvcmUgdGhlIHBlbmRpbmdcclxuICAgICAgICAgICAgLy8ga2V5IGFuZCBjYWNoZSBgaW5zdGFuY2Uuc3ViVHJlZWAgKHRoZSBub3JtYWxpemVkIHZub2RlKSBpblxyXG4gICAgICAgICAgICAvLyBiZWZvcmVNb3VudC9iZWZvcmVVcGRhdGUgaG9va3MuXHJcbiAgICAgICAgICAgIHBlbmRpbmdDYWNoZUtleSA9IGtleTtcclxuICAgICAgICAgICAgaWYgKGNhY2hlZFZOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb3B5IG92ZXIgbW91bnRlZCBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgdm5vZGUuZWwgPSBjYWNoZWRWTm9kZS5lbDtcclxuICAgICAgICAgICAgICAgIHZub2RlLmNvbXBvbmVudCA9IGNhY2hlZFZOb2RlLmNvbXBvbmVudDtcclxuICAgICAgICAgICAgICAgIGlmICh2bm9kZS50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVjdXJzaXZlbHkgdXBkYXRlIHRyYW5zaXRpb24gaG9va3Mgb24gc3ViVHJlZVxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRyYW5zaXRpb25Ib29rcyh2bm9kZSwgdm5vZGUudHJhbnNpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBhdm9pZCB2bm9kZSBiZWluZyBtb3VudGVkIGFzIGZyZXNoXHJcbiAgICAgICAgICAgICAgICB2bm9kZS5zaGFwZUZsYWcgfD0gNTEyIC8qIENPTVBPTkVOVF9LRVBUX0FMSVZFICovO1xyXG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGlzIGtleSB0aGUgZnJlc2hlc3RcclxuICAgICAgICAgICAgICAgIGtleXMuZGVsZXRlKGtleSk7XHJcbiAgICAgICAgICAgICAgICBrZXlzLmFkZChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAga2V5cy5hZGQoa2V5KTtcclxuICAgICAgICAgICAgICAgIC8vIHBydW5lIG9sZGVzdCBlbnRyeVxyXG4gICAgICAgICAgICAgICAgaWYgKG1heCAmJiBrZXlzLnNpemUgPiBwYXJzZUludChtYXgsIDEwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBydW5lQ2FjaGVFbnRyeShrZXlzLnZhbHVlcygpLm5leHQoKS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYXZvaWQgdm5vZGUgYmVpbmcgdW5tb3VudGVkXHJcbiAgICAgICAgICAgIHZub2RlLnNoYXBlRmxhZyB8PSAyNTYgLyogQ09NUE9ORU5UX1NIT1VMRF9LRUVQX0FMSVZFICovO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gdm5vZGU7XHJcbiAgICAgICAgICAgIHJldHVybiB2bm9kZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG4vLyBleHBvcnQgdGhlIHB1YmxpYyB0eXBlIGZvciBoL3RzeCBpbmZlcmVuY2VcclxuLy8gYWxzbyB0byBhdm9pZCBpbmxpbmUgaW1wb3J0KCkgaW4gZ2VuZXJhdGVkIGQudHMgZmlsZXNcclxuY29uc3QgS2VlcEFsaXZlID0gS2VlcEFsaXZlSW1wbDtcclxuZnVuY3Rpb24gZ2V0TmFtZShjb21wKSB7XHJcbiAgICByZXR1cm4gY29tcC5kaXNwbGF5TmFtZSB8fCBjb21wLm5hbWU7XHJcbn1cclxuZnVuY3Rpb24gbWF0Y2hlcyhwYXR0ZXJuLCBuYW1lKSB7XHJcbiAgICBpZiAoaXNBcnJheShwYXR0ZXJuKSkge1xyXG4gICAgICAgIHJldHVybiBwYXR0ZXJuLnNvbWUoKHApID0+IG1hdGNoZXMocCwgbmFtZSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNTdHJpbmcocGF0dGVybikpIHtcclxuICAgICAgICByZXR1cm4gcGF0dGVybi5zcGxpdCgnLCcpLmluZGV4T2YobmFtZSkgPiAtMTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBhdHRlcm4udGVzdCkge1xyXG4gICAgICAgIHJldHVybiBwYXR0ZXJuLnRlc3QobmFtZSk7XHJcbiAgICB9XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIG9uQWN0aXZhdGVkKGhvb2ssIHRhcmdldCkge1xyXG4gICAgcmVnaXN0ZXJLZWVwQWxpdmVIb29rKGhvb2ssIFwiYVwiIC8qIEFDVElWQVRFRCAqLywgdGFyZ2V0KTtcclxufVxyXG5mdW5jdGlvbiBvbkRlYWN0aXZhdGVkKGhvb2ssIHRhcmdldCkge1xyXG4gICAgcmVnaXN0ZXJLZWVwQWxpdmVIb29rKGhvb2ssIFwiZGFcIiAvKiBERUFDVElWQVRFRCAqLywgdGFyZ2V0KTtcclxufVxyXG5mdW5jdGlvbiByZWdpc3RlcktlZXBBbGl2ZUhvb2soaG9vaywgdHlwZSwgdGFyZ2V0ID0gY3VycmVudEluc3RhbmNlKSB7XHJcbiAgICAvLyBjYWNoZSB0aGUgZGVhY3RpdmF0ZSBicmFuY2ggY2hlY2sgd3JhcHBlciBmb3IgaW5qZWN0ZWQgaG9va3Mgc28gdGhlIHNhbWVcclxuICAgIC8vIGhvb2sgY2FuIGJlIHByb3Blcmx5IGRlZHVwZWQgYnkgdGhlIHNjaGVkdWxlci4gXCJfX3dkY1wiIHN0YW5kcyBmb3IgXCJ3aXRoXHJcbiAgICAvLyBkZWFjdGl2YXRpb24gY2hlY2tcIi5cclxuICAgIGNvbnN0IHdyYXBwZWRIb29rID0gaG9vay5fX3dkYyB8fFxyXG4gICAgICAgIChob29rLl9fd2RjID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBvbmx5IGZpcmUgdGhlIGhvb2sgaWYgdGhlIHRhcmdldCBpbnN0YW5jZSBpcyBOT1QgaW4gYSBkZWFjdGl2YXRlZCBicmFuY2guXHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQuaXNEZWFjdGl2YXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBob29rKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICBpbmplY3RIb29rKHR5cGUsIHdyYXBwZWRIb29rLCB0YXJnZXQpO1xyXG4gICAgLy8gSW4gYWRkaXRpb24gdG8gcmVnaXN0ZXJpbmcgaXQgb24gdGhlIHRhcmdldCBpbnN0YW5jZSwgd2Ugd2FsayB1cCB0aGUgcGFyZW50XHJcbiAgICAvLyBjaGFpbiBhbmQgcmVnaXN0ZXIgaXQgb24gYWxsIGFuY2VzdG9yIGluc3RhbmNlcyB0aGF0IGFyZSBrZWVwLWFsaXZlIHJvb3RzLlxyXG4gICAgLy8gVGhpcyBhdm9pZHMgdGhlIG5lZWQgdG8gd2FsayB0aGUgZW50aXJlIGNvbXBvbmVudCB0cmVlIHdoZW4gaW52b2tpbmcgdGhlc2VcclxuICAgIC8vIGhvb2tzLCBhbmQgbW9yZSBpbXBvcnRhbnRseSwgYXZvaWRzIHRoZSBuZWVkIHRvIHRyYWNrIGNoaWxkIGNvbXBvbmVudHMgaW5cclxuICAgIC8vIGFycmF5cy5cclxuICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IHRhcmdldC5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudC5wYXJlbnQpIHtcclxuICAgICAgICAgICAgaWYgKGlzS2VlcEFsaXZlKGN1cnJlbnQucGFyZW50LnZub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgaW5qZWN0VG9LZWVwQWxpdmVSb290KHdyYXBwZWRIb29rLCB0eXBlLCB0YXJnZXQsIGN1cnJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5qZWN0VG9LZWVwQWxpdmVSb290KGhvb2ssIHR5cGUsIHRhcmdldCwga2VlcEFsaXZlUm9vdCkge1xyXG4gICAgaW5qZWN0SG9vayh0eXBlLCBob29rLCBrZWVwQWxpdmVSb290LCB0cnVlIC8qIHByZXBlbmQgKi8pO1xyXG4gICAgb25Vbm1vdW50ZWQoKCkgPT4ge1xyXG4gICAgICAgIHJlbW92ZShrZWVwQWxpdmVSb290W3R5cGVdLCBob29rKTtcclxuICAgIH0sIHRhcmdldCk7XHJcbn1cclxuZnVuY3Rpb24gcmVzZXRTaGFwZUZsYWcodm5vZGUpIHtcclxuICAgIGxldCBzaGFwZUZsYWcgPSB2bm9kZS5zaGFwZUZsYWc7XHJcbiAgICBpZiAoc2hhcGVGbGFnICYgMjU2IC8qIENPTVBPTkVOVF9TSE9VTERfS0VFUF9BTElWRSAqLykge1xyXG4gICAgICAgIHNoYXBlRmxhZyAtPSAyNTYgLyogQ09NUE9ORU5UX1NIT1VMRF9LRUVQX0FMSVZFICovO1xyXG4gICAgfVxyXG4gICAgaWYgKHNoYXBlRmxhZyAmIDUxMiAvKiBDT01QT05FTlRfS0VQVF9BTElWRSAqLykge1xyXG4gICAgICAgIHNoYXBlRmxhZyAtPSA1MTIgLyogQ09NUE9ORU5UX0tFUFRfQUxJVkUgKi87XHJcbiAgICB9XHJcbiAgICB2bm9kZS5zaGFwZUZsYWcgPSBzaGFwZUZsYWc7XHJcbn1cblxuY29uc3QgaXNJbnRlcm5hbEtleSA9IChrZXkpID0+IGtleVswXSA9PT0gJ18nIHx8IGtleSA9PT0gJyRzdGFibGUnO1xyXG5jb25zdCBub3JtYWxpemVTbG90VmFsdWUgPSAodmFsdWUpID0+IGlzQXJyYXkodmFsdWUpXHJcbiAgICA/IHZhbHVlLm1hcChub3JtYWxpemVWTm9kZSlcclxuICAgIDogW25vcm1hbGl6ZVZOb2RlKHZhbHVlKV07XHJcbmNvbnN0IG5vcm1hbGl6ZVNsb3QgPSAoa2V5LCByYXdTbG90LCBjdHgpID0+IHdpdGhDdHgoKHByb3BzKSA9PiB7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGN1cnJlbnRJbnN0YW5jZSkge1xyXG4gICAgICAgIHdhcm4oYFNsb3QgXCIke2tleX1cIiBpbnZva2VkIG91dHNpZGUgb2YgdGhlIHJlbmRlciBmdW5jdGlvbjogYCArXHJcbiAgICAgICAgICAgIGB0aGlzIHdpbGwgbm90IHRyYWNrIGRlcGVuZGVuY2llcyB1c2VkIGluIHRoZSBzbG90LiBgICtcclxuICAgICAgICAgICAgYEludm9rZSB0aGUgc2xvdCBmdW5jdGlvbiBpbnNpZGUgdGhlIHJlbmRlciBmdW5jdGlvbiBpbnN0ZWFkLmApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5vcm1hbGl6ZVNsb3RWYWx1ZShyYXdTbG90KHByb3BzKSk7XHJcbn0sIGN0eCk7XHJcbmNvbnN0IG5vcm1hbGl6ZU9iamVjdFNsb3RzID0gKHJhd1Nsb3RzLCBzbG90cykgPT4ge1xyXG4gICAgY29uc3QgY3R4ID0gcmF3U2xvdHMuX2N0eDtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIHJhd1Nsb3RzKSB7XHJcbiAgICAgICAgaWYgKGlzSW50ZXJuYWxLZXkoa2V5KSlcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSByYXdTbG90c1trZXldO1xyXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xyXG4gICAgICAgICAgICBzbG90c1trZXldID0gbm9ybWFsaXplU2xvdChrZXksIHZhbHVlLCBjdHgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgIHdhcm4oYE5vbi1mdW5jdGlvbiB2YWx1ZSBlbmNvdW50ZXJlZCBmb3Igc2xvdCBcIiR7a2V5fVwiLiBgICtcclxuICAgICAgICAgICAgICAgICAgICBgUHJlZmVyIGZ1bmN0aW9uIHNsb3RzIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVNsb3RWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHNsb3RzW2tleV0gPSAoKSA9PiBub3JtYWxpemVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuY29uc3Qgbm9ybWFsaXplVk5vZGVTbG90cyA9IChpbnN0YW5jZSwgY2hpbGRyZW4pID0+IHtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIWlzS2VlcEFsaXZlKGluc3RhbmNlLnZub2RlKSkge1xyXG4gICAgICAgIHdhcm4oYE5vbi1mdW5jdGlvbiB2YWx1ZSBlbmNvdW50ZXJlZCBmb3IgZGVmYXVsdCBzbG90LiBgICtcclxuICAgICAgICAgICAgYFByZWZlciBmdW5jdGlvbiBzbG90cyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLmApO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVNsb3RWYWx1ZShjaGlsZHJlbik7XHJcbiAgICBpbnN0YW5jZS5zbG90cy5kZWZhdWx0ID0gKCkgPT4gbm9ybWFsaXplZDtcclxufTtcclxuY29uc3QgaW5pdFNsb3RzID0gKGluc3RhbmNlLCBjaGlsZHJlbikgPT4ge1xyXG4gICAgaWYgKGluc3RhbmNlLnZub2RlLnNoYXBlRmxhZyAmIDMyIC8qIFNMT1RTX0NISUxEUkVOICovKSB7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IGNoaWxkcmVuLl87XHJcbiAgICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2Uuc2xvdHMgPSBjaGlsZHJlbjtcclxuICAgICAgICAgICAgLy8gbWFrZSBjb21waWxlciBtYXJrZXIgbm9uLWVudW1lcmFibGVcclxuICAgICAgICAgICAgZGVmKGNoaWxkcmVuLCAnXycsIHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbm9ybWFsaXplT2JqZWN0U2xvdHMoY2hpbGRyZW4sIChpbnN0YW5jZS5zbG90cyA9IHt9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaW5zdGFuY2Uuc2xvdHMgPSB7fTtcclxuICAgICAgICBpZiAoY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgbm9ybWFsaXplVk5vZGVTbG90cyhpbnN0YW5jZSwgY2hpbGRyZW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRlZihpbnN0YW5jZS5zbG90cywgSW50ZXJuYWxPYmplY3RLZXksIDEpO1xyXG59O1xyXG5jb25zdCB1cGRhdGVTbG90cyA9IChpbnN0YW5jZSwgY2hpbGRyZW4pID0+IHtcclxuICAgIGNvbnN0IHsgdm5vZGUsIHNsb3RzIH0gPSBpbnN0YW5jZTtcclxuICAgIGxldCBuZWVkRGVsZXRpb25DaGVjayA9IHRydWU7XHJcbiAgICBsZXQgZGVsZXRpb25Db21wYXJpc29uVGFyZ2V0ID0gRU1QVFlfT0JKO1xyXG4gICAgaWYgKHZub2RlLnNoYXBlRmxhZyAmIDMyIC8qIFNMT1RTX0NISUxEUkVOICovKSB7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IGNoaWxkcmVuLl87XHJcbiAgICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgICAgLy8gY29tcGlsZWQgc2xvdHMuXHJcbiAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgaXNIbXJVcGRhdGluZykge1xyXG4gICAgICAgICAgICAgICAgLy8gUGFyZW50IHdhcyBITVIgdXBkYXRlZCBzbyBzbG90IGNvbnRlbnQgbWF5IGhhdmUgY2hhbmdlZC5cclxuICAgICAgICAgICAgICAgIC8vIGZvcmNlIHVwZGF0ZSBzbG90cyBhbmQgbWFyayBpbnN0YW5jZSBmb3IgaG1yIGFzIHdlbGxcclxuICAgICAgICAgICAgICAgIGV4dGVuZChzbG90cywgY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09IDEgLyogU1RBQkxFICovKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb21waWxlZCBBTkQgc3RhYmxlLlxyXG4gICAgICAgICAgICAgICAgLy8gbm8gbmVlZCB0byB1cGRhdGUsIGFuZCBza2lwIHN0YWxlIHNsb3RzIHJlbW92YWwuXHJcbiAgICAgICAgICAgICAgICBuZWVkRGVsZXRpb25DaGVjayA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29tcGlsZWQgYnV0IGR5bmFtaWMgKHYtaWYvdi1mb3Igb24gc2xvdHMpIC0gdXBkYXRlIHNsb3RzLCBidXQgc2tpcFxyXG4gICAgICAgICAgICAgICAgLy8gbm9ybWFsaXphdGlvbi5cclxuICAgICAgICAgICAgICAgIGV4dGVuZChzbG90cywgY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBuZWVkRGVsZXRpb25DaGVjayA9ICFjaGlsZHJlbi4kc3RhYmxlO1xyXG4gICAgICAgICAgICBub3JtYWxpemVPYmplY3RTbG90cyhjaGlsZHJlbiwgc2xvdHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGlvbkNvbXBhcmlzb25UYXJnZXQgPSBjaGlsZHJlbjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGNoaWxkcmVuKSB7XHJcbiAgICAgICAgLy8gbm9uIHNsb3Qgb2JqZWN0IGNoaWxkcmVuIChkaXJlY3QgdmFsdWUpIHBhc3NlZCB0byBhIGNvbXBvbmVudFxyXG4gICAgICAgIG5vcm1hbGl6ZVZOb2RlU2xvdHMoaW5zdGFuY2UsIGNoaWxkcmVuKTtcclxuICAgICAgICBkZWxldGlvbkNvbXBhcmlzb25UYXJnZXQgPSB7IGRlZmF1bHQ6IDEgfTtcclxuICAgIH1cclxuICAgIC8vIGRlbGV0ZSBzdGFsZSBzbG90c1xyXG4gICAgaWYgKG5lZWREZWxldGlvbkNoZWNrKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2xvdHMpIHtcclxuICAgICAgICAgICAgaWYgKCFpc0ludGVybmFsS2V5KGtleSkgJiYgIShrZXkgaW4gZGVsZXRpb25Db21wYXJpc29uVGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNsb3RzW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XG5cbi8qKlxyXG5SdW50aW1lIGhlbHBlciBmb3IgYXBwbHlpbmcgZGlyZWN0aXZlcyB0byBhIHZub2RlLiBFeGFtcGxlIHVzYWdlOlxyXG5cbmNvbnN0IGNvbXAgPSByZXNvbHZlQ29tcG9uZW50KCdjb21wJylcclxuY29uc3QgZm9vID0gcmVzb2x2ZURpcmVjdGl2ZSgnZm9vJylcclxuY29uc3QgYmFyID0gcmVzb2x2ZURpcmVjdGl2ZSgnYmFyJylcclxuXG5yZXR1cm4gd2l0aERpcmVjdGl2ZXMoaChjb21wKSwgW1xyXG4gIFtmb28sIHRoaXMueF0sXHJcbiAgW2JhciwgdGhpcy55XVxyXG5dKVxyXG4qL1xyXG5jb25zdCBpc0J1aWx0SW5EaXJlY3RpdmUgPSAvKiNfX1BVUkVfXyovIG1ha2VNYXAoJ2JpbmQsY2xvYWssZWxzZS1pZixlbHNlLGZvcixodG1sLGlmLG1vZGVsLG9uLG9uY2UscHJlLHNob3csc2xvdCx0ZXh0Jyk7XHJcbmZ1bmN0aW9uIHZhbGlkYXRlRGlyZWN0aXZlTmFtZShuYW1lKSB7XHJcbiAgICBpZiAoaXNCdWlsdEluRGlyZWN0aXZlKG5hbWUpKSB7XHJcbiAgICAgICAgd2FybignRG8gbm90IHVzZSBidWlsdC1pbiBkaXJlY3RpdmUgaWRzIGFzIGN1c3RvbSBkaXJlY3RpdmUgaWQ6ICcgKyBuYW1lKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogQWRkcyBkaXJlY3RpdmVzIHRvIGEgVk5vZGUuXHJcbiAqL1xyXG5mdW5jdGlvbiB3aXRoRGlyZWN0aXZlcyh2bm9kZSwgZGlyZWN0aXZlcykge1xyXG4gICAgY29uc3QgaW50ZXJuYWxJbnN0YW5jZSA9IGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZTtcclxuICAgIGlmIChpbnRlcm5hbEluc3RhbmNlID09PSBudWxsKSB7XHJcbiAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHdhcm4oYHdpdGhEaXJlY3RpdmVzIGNhbiBvbmx5IGJlIHVzZWQgaW5zaWRlIHJlbmRlciBmdW5jdGlvbnMuYCk7XHJcbiAgICAgICAgcmV0dXJuIHZub2RlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaW5zdGFuY2UgPSBpbnRlcm5hbEluc3RhbmNlLnByb3h5O1xyXG4gICAgY29uc3QgYmluZGluZ3MgPSB2bm9kZS5kaXJzIHx8ICh2bm9kZS5kaXJzID0gW10pO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXJlY3RpdmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IFtkaXIsIHZhbHVlLCBhcmcsIG1vZGlmaWVycyA9IEVNUFRZX09CSl0gPSBkaXJlY3RpdmVzW2ldO1xyXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGRpcikpIHtcclxuICAgICAgICAgICAgZGlyID0ge1xyXG4gICAgICAgICAgICAgICAgbW91bnRlZDogZGlyLFxyXG4gICAgICAgICAgICAgICAgdXBkYXRlZDogZGlyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJpbmRpbmdzLnB1c2goe1xyXG4gICAgICAgICAgICBkaXIsXHJcbiAgICAgICAgICAgIGluc3RhbmNlLFxyXG4gICAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgICAgb2xkVmFsdWU6IHZvaWQgMCxcclxuICAgICAgICAgICAgYXJnLFxyXG4gICAgICAgICAgICBtb2RpZmllcnNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB2bm9kZTtcclxufVxyXG5mdW5jdGlvbiBpbnZva2VEaXJlY3RpdmVIb29rKHZub2RlLCBwcmV2Vk5vZGUsIGluc3RhbmNlLCBuYW1lKSB7XHJcbiAgICBjb25zdCBiaW5kaW5ncyA9IHZub2RlLmRpcnM7XHJcbiAgICBjb25zdCBvbGRCaW5kaW5ncyA9IHByZXZWTm9kZSAmJiBwcmV2Vk5vZGUuZGlycztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluZGluZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBiaW5kaW5nID0gYmluZGluZ3NbaV07XHJcbiAgICAgICAgaWYgKG9sZEJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgIGJpbmRpbmcub2xkVmFsdWUgPSBvbGRCaW5kaW5nc1tpXS52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaG9vayA9IGJpbmRpbmcuZGlyW25hbWVdO1xyXG4gICAgICAgIGlmIChob29rKSB7XHJcbiAgICAgICAgICAgIGNhbGxXaXRoQXN5bmNFcnJvckhhbmRsaW5nKGhvb2ssIGluc3RhbmNlLCA4IC8qIERJUkVDVElWRV9IT09LICovLCBbXHJcbiAgICAgICAgICAgICAgICB2bm9kZS5lbCxcclxuICAgICAgICAgICAgICAgIGJpbmRpbmcsXHJcbiAgICAgICAgICAgICAgICB2bm9kZSxcclxuICAgICAgICAgICAgICAgIHByZXZWTm9kZVxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxudmFyIERldnRvb2xzSG9va3M7XHJcbihmdW5jdGlvbiAoRGV2dG9vbHNIb29rcykge1xyXG4gICAgRGV2dG9vbHNIb29rc1tcIkFQUF9JTklUXCJdID0gXCJhcHA6aW5pdFwiO1xyXG4gICAgRGV2dG9vbHNIb29rc1tcIkFQUF9VTk1PVU5UXCJdID0gXCJhcHA6dW5tb3VudFwiO1xyXG4gICAgRGV2dG9vbHNIb29rc1tcIkNPTVBPTkVOVF9VUERBVEVEXCJdID0gXCJjb21wb25lbnQ6dXBkYXRlZFwiO1xyXG4gICAgRGV2dG9vbHNIb29rc1tcIkNPTVBPTkVOVF9BRERFRFwiXSA9IFwiY29tcG9uZW50OmFkZGVkXCI7XHJcbiAgICBEZXZ0b29sc0hvb2tzW1wiQ09NUE9ORU5UX1JFTU9WRURcIl0gPSBcImNvbXBvbmVudDpyZW1vdmVkXCI7XHJcbn0pKERldnRvb2xzSG9va3MgfHwgKERldnRvb2xzSG9va3MgPSB7fSkpO1xyXG5sZXQgZGV2dG9vbHM7XHJcbmZ1bmN0aW9uIHNldERldnRvb2xzSG9vayhob29rKSB7XHJcbiAgICBkZXZ0b29scyA9IGhvb2s7XHJcbn1cclxuZnVuY3Rpb24gaW5pdEFwcChhcHAsIHZlcnNpb24pIHtcclxuICAgIC8vIFRPRE8gcXVldWUgaWYgZGV2dG9vbHMgaXMgdW5kZWZpbmVkXHJcbiAgICBpZiAoIWRldnRvb2xzKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGRldnRvb2xzLmVtaXQoRGV2dG9vbHNIb29rcy5BUFBfSU5JVCwgYXBwLCB2ZXJzaW9uLCB7XHJcbiAgICAgICAgRnJhZ21lbnQ6IEZyYWdtZW50LFxyXG4gICAgICAgIFRleHQ6IFRleHQsXHJcbiAgICAgICAgQ29tbWVudDogQ29tbWVudCxcclxuICAgICAgICBTdGF0aWM6IFN0YXRpY1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gYXBwVW5tb3VudGVkKGFwcCkge1xyXG4gICAgaWYgKCFkZXZ0b29scylcclxuICAgICAgICByZXR1cm47XHJcbiAgICBkZXZ0b29scy5lbWl0KERldnRvb2xzSG9va3MuQVBQX1VOTU9VTlQsIGFwcCk7XHJcbn1cclxuY29uc3QgY29tcG9uZW50QWRkZWQgPSBjcmVhdGVEZXZ0b29sc0hvb2soRGV2dG9vbHNIb29rcy5DT01QT05FTlRfQURERUQpO1xyXG5jb25zdCBjb21wb25lbnRVcGRhdGVkID0gY3JlYXRlRGV2dG9vbHNIb29rKERldnRvb2xzSG9va3MuQ09NUE9ORU5UX1VQREFURUQpO1xyXG5jb25zdCBjb21wb25lbnRSZW1vdmVkID0gY3JlYXRlRGV2dG9vbHNIb29rKERldnRvb2xzSG9va3MuQ09NUE9ORU5UX1JFTU9WRUQpO1xyXG5mdW5jdGlvbiBjcmVhdGVEZXZ0b29sc0hvb2soaG9vaykge1xyXG4gICAgcmV0dXJuIChjb21wb25lbnQpID0+IHtcclxuICAgICAgICBpZiAoIWRldnRvb2xzIHx8ICFjb21wb25lbnQuYXBwQ29udGV4dC5fX2FwcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGRldnRvb2xzLmVtaXQoaG9vaywgY29tcG9uZW50LmFwcENvbnRleHQuX19hcHAsIGNvbXBvbmVudC51aWQsIGNvbXBvbmVudC5wYXJlbnQgPyBjb21wb25lbnQucGFyZW50LnVpZCA6IHVuZGVmaW5lZCk7XHJcbiAgICB9O1xyXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFwcENvbnRleHQoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICBpc05hdGl2ZVRhZzogTk8sXHJcbiAgICAgICAgICAgIGRldnRvb2xzOiB0cnVlLFxyXG4gICAgICAgICAgICBwZXJmb3JtYW5jZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGdsb2JhbFByb3BlcnRpZXM6IHt9LFxyXG4gICAgICAgICAgICBvcHRpb25NZXJnZVN0cmF0ZWdpZXM6IHt9LFxyXG4gICAgICAgICAgICBpc0N1c3RvbUVsZW1lbnQ6IE5PLFxyXG4gICAgICAgICAgICBlcnJvckhhbmRsZXI6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgd2FybkhhbmRsZXI6IHVuZGVmaW5lZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWl4aW5zOiBbXSxcclxuICAgICAgICBjb21wb25lbnRzOiB7fSxcclxuICAgICAgICBkaXJlY3RpdmVzOiB7fSxcclxuICAgICAgICBwcm92aWRlczogT2JqZWN0LmNyZWF0ZShudWxsKVxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVBcHBBUEkocmVuZGVyLCBoeWRyYXRlKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gY3JlYXRlQXBwKHJvb3RDb21wb25lbnQsIHJvb3RQcm9wcyA9IG51bGwpIHtcclxuICAgICAgICBpZiAocm9vdFByb3BzICE9IG51bGwgJiYgIWlzT2JqZWN0KHJvb3RQcm9wcykpIHtcclxuICAgICAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHdhcm4oYHJvb3QgcHJvcHMgcGFzc2VkIHRvIGFwcC5tb3VudCgpIG11c3QgYmUgYW4gb2JqZWN0LmApO1xyXG4gICAgICAgICAgICByb290UHJvcHMgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gY3JlYXRlQXBwQ29udGV4dCgpO1xyXG4gICAgICAgIGNvbnN0IGluc3RhbGxlZFBsdWdpbnMgPSBuZXcgU2V0KCk7XHJcbiAgICAgICAgbGV0IGlzTW91bnRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IHtcclxuICAgICAgICAgICAgX2NvbXBvbmVudDogcm9vdENvbXBvbmVudCxcclxuICAgICAgICAgICAgX3Byb3BzOiByb290UHJvcHMsXHJcbiAgICAgICAgICAgIF9jb250YWluZXI6IG51bGwsXHJcbiAgICAgICAgICAgIF9jb250ZXh0OiBjb250ZXh0LFxyXG4gICAgICAgICAgICB2ZXJzaW9uLFxyXG4gICAgICAgICAgICBnZXQgY29uZmlnKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuY29uZmlnO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQgY29uZmlnKHYpIHtcclxuICAgICAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YXJuKGBhcHAuY29uZmlnIGNhbm5vdCBiZSByZXBsYWNlZC4gTW9kaWZ5IGluZGl2aWR1YWwgb3B0aW9ucyBpbnN0ZWFkLmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1c2UocGx1Z2luLCAuLi5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFsbGVkUGx1Z2lucy5oYXMocGx1Z2luKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiB3YXJuKGBQbHVnaW4gaGFzIGFscmVhZHkgYmVlbiBhcHBsaWVkIHRvIHRhcmdldCBhcHAuYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwbHVnaW4gJiYgaXNGdW5jdGlvbihwbHVnaW4uaW5zdGFsbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YWxsZWRQbHVnaW5zLmFkZChwbHVnaW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbi5pbnN0YWxsKGFwcCwgLi4ub3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpc0Z1bmN0aW9uKHBsdWdpbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YWxsZWRQbHVnaW5zLmFkZChwbHVnaW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbihhcHAsIC4uLm9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgQSBwbHVnaW4gbXVzdCBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhbiBvYmplY3Qgd2l0aCBhbiBcImluc3RhbGxcIiBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYGZ1bmN0aW9uLmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFwcDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWl4aW4obWl4aW4pIHtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbnRleHQubWl4aW5zLmluY2x1ZGVzKG1peGluKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Lm1peGlucy5wdXNoKG1peGluKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm4oJ01peGluIGhhcyBhbHJlYWR5IGJlZW4gYXBwbGllZCB0byB0YXJnZXQgYXBwJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobWl4aW4ubmFtZSA/IGA6ICR7bWl4aW4ubmFtZX1gIDogJycpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXBwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb21wb25lbnQobmFtZSwgY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVDb21wb25lbnROYW1lKG5hbWUsIGNvbnRleHQuY29uZmlnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuY29tcG9uZW50c1tuYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgY29udGV4dC5jb21wb25lbnRzW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgQ29tcG9uZW50IFwiJHtuYW1lfVwiIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBpbiB0YXJnZXQgYXBwLmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5jb21wb25lbnRzW25hbWVdID0gY29tcG9uZW50O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFwcDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlyZWN0aXZlKG5hbWUsIGRpcmVjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlRGlyZWN0aXZlTmFtZShuYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghZGlyZWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuZGlyZWN0aXZlc1tuYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgY29udGV4dC5kaXJlY3RpdmVzW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgRGlyZWN0aXZlIFwiJHtuYW1lfVwiIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBpbiB0YXJnZXQgYXBwLmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5kaXJlY3RpdmVzW25hbWVdID0gZGlyZWN0aXZlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFwcDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbW91bnQocm9vdENvbnRhaW5lciwgaXNIeWRyYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTW91bnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZub2RlID0gY3JlYXRlVk5vZGUocm9vdENvbXBvbmVudCwgcm9vdFByb3BzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSBhcHAgY29udGV4dCBvbiB0aGUgcm9vdCBWTm9kZS5cclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHdpbGwgYmUgc2V0IG9uIHRoZSByb290IGluc3RhbmNlIG9uIGluaXRpYWwgbW91bnQuXHJcbiAgICAgICAgICAgICAgICAgICAgdm5vZGUuYXBwQ29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSE1SIHJvb3QgcmVsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJlbG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcihjbG9uZVZOb2RlKHZub2RlKSwgcm9vdENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0h5ZHJhdGUgJiYgaHlkcmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoeWRyYXRlKHZub2RlLCByb290Q29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcih2bm9kZSwgcm9vdENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlzTW91bnRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLl9jb250YWluZXIgPSByb290Q29udGFpbmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBpbml0QXBwKGFwcCwgdmVyc2lvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZub2RlLmNvbXBvbmVudC5wcm94eTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhcm4oYEFwcCBoYXMgYWxyZWFkeSBiZWVuIG1vdW50ZWQuXFxuYCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGBJZiB5b3Ugd2FudCB0byByZW1vdW50IHRoZSBzYW1lIGFwcCwgbW92ZSB5b3VyIGFwcCBjcmVhdGlvbiBsb2dpYyBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYGludG8gYSBmYWN0b3J5IGZ1bmN0aW9uIGFuZCBjcmVhdGUgZnJlc2ggYXBwIGluc3RhbmNlcyBmb3IgZWFjaCBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYG1vdW50IC0gZS5nLiBcXGBjb25zdCBjcmVhdGVNeUFwcCA9ICgpID0+IGNyZWF0ZUFwcChBcHApXFxgYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVubW91bnQoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyKG51bGwsIGFwcC5fY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgYXBwVW5tb3VudGVkKGFwcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YXJuKGBDYW5ub3QgdW5tb3VudCBhbiBhcHAgdGhhdCBpcyBub3QgbW91bnRlZC5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvdmlkZShrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGtleSBpbiBjb250ZXh0LnByb3ZpZGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgQXBwIGFscmVhZHkgcHJvdmlkZXMgcHJvcGVydHkgd2l0aCBrZXkgXCIke1N0cmluZyhrZXkpfVwiLiBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYEl0IHdpbGwgYmUgb3ZlcndyaXR0ZW4gd2l0aCB0aGUgbmV3IHZhbHVlLmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gVHlwZVNjcmlwdCBkb2Vzbid0IGFsbG93IHN5bWJvbHMgYXMgaW5kZXggdHlwZVxyXG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8yNDU4N1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5wcm92aWRlc1trZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXBwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb250ZXh0Ll9fYXBwID0gYXBwO1xyXG4gICAgICAgIHJldHVybiBhcHA7XHJcbiAgICB9O1xyXG59XG5cbmxldCBoYXNNaXNtYXRjaCA9IGZhbHNlO1xyXG5jb25zdCBpc1NWR0NvbnRhaW5lciA9IChjb250YWluZXIpID0+IC9zdmcvLnRlc3QoY29udGFpbmVyLm5hbWVzcGFjZVVSSSkgJiYgY29udGFpbmVyLnRhZ05hbWUgIT09ICdmb3JlaWduT2JqZWN0JztcclxuY29uc3QgaXNDb21tZW50ID0gKG5vZGUpID0+IG5vZGUubm9kZVR5cGUgPT09IDggLyogQ09NTUVOVCAqLztcclxuLy8gTm90ZTogaHlkcmF0aW9uIGlzIERPTS1zcGVjaWZpY1xyXG4vLyBCdXQgd2UgaGF2ZSB0byBwbGFjZSBpdCBpbiBjb3JlIGR1ZSB0byB0aWdodCBjb3VwbGluZyB3aXRoIGNvcmUgLSBzcGxpdHRpbmdcclxuLy8gaXQgb3V0IGNyZWF0ZXMgYSB0b24gb2YgdW5uZWNlc3NhcnkgY29tcGxleGl0eS5cclxuLy8gSHlkcmF0aW9uIGFsc28gZGVwZW5kcyBvbiBzb21lIHJlbmRlcmVyIGludGVybmFsIGxvZ2ljIHdoaWNoIG5lZWRzIHRvIGJlXHJcbi8vIHBhc3NlZCBpbiB2aWEgYXJndW1lbnRzLlxyXG5mdW5jdGlvbiBjcmVhdGVIeWRyYXRpb25GdW5jdGlvbnMocmVuZGVyZXJJbnRlcm5hbHMpIHtcclxuICAgIGNvbnN0IHsgbXQ6IG1vdW50Q29tcG9uZW50LCBwOiBwYXRjaCwgbzogeyBwYXRjaFByb3AsIG5leHRTaWJsaW5nLCBwYXJlbnROb2RlLCByZW1vdmUsIGluc2VydCwgY3JlYXRlQ29tbWVudCB9IH0gPSByZW5kZXJlckludGVybmFscztcclxuICAgIGNvbnN0IGh5ZHJhdGUgPSAodm5vZGUsIGNvbnRhaW5lcikgPT4ge1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIWNvbnRhaW5lci5oYXNDaGlsZE5vZGVzKCkpIHtcclxuICAgICAgICAgICAgd2FybihgQXR0ZW1wdGluZyB0byBoeWRyYXRlIGV4aXN0aW5nIG1hcmt1cCBidXQgY29udGFpbmVyIGlzIGVtcHR5LiBgICtcclxuICAgICAgICAgICAgICAgIGBQZXJmb3JtaW5nIGZ1bGwgbW91bnQgaW5zdGVhZC5gKTtcclxuICAgICAgICAgICAgcGF0Y2gobnVsbCwgdm5vZGUsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaGFzTWlzbWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICBoeWRyYXRlTm9kZShjb250YWluZXIuZmlyc3RDaGlsZCwgdm5vZGUsIG51bGwsIG51bGwpO1xyXG4gICAgICAgIGZsdXNoUG9zdEZsdXNoQ2JzKCk7XHJcbiAgICAgICAgaWYgKGhhc01pc21hdGNoICYmICFmYWxzZSkge1xyXG4gICAgICAgICAgICAvLyB0aGlzIGVycm9yIHNob3VsZCBzaG93IHVwIGluIHByb2R1Y3Rpb25cclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgSHlkcmF0aW9uIGNvbXBsZXRlZCBidXQgY29udGFpbnMgbWlzbWF0Y2hlcy5gKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHlkcmF0ZU5vZGUgPSAobm9kZSwgdm5vZGUsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIG9wdGltaXplZCA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNGcmFnbWVudFN0YXJ0ID0gaXNDb21tZW50KG5vZGUpICYmIG5vZGUuZGF0YSA9PT0gJ1snO1xyXG4gICAgICAgIGNvbnN0IG9uTWlzbWF0Y2ggPSAoKSA9PiBoYW5kbGVNaXNtYXRjaChub2RlLCB2bm9kZSwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNGcmFnbWVudFN0YXJ0KTtcclxuICAgICAgICBjb25zdCB7IHR5cGUsIHJlZiwgc2hhcGVGbGFnIH0gPSB2bm9kZTtcclxuICAgICAgICBjb25zdCBkb21UeXBlID0gbm9kZS5ub2RlVHlwZTtcclxuICAgICAgICB2bm9kZS5lbCA9IG5vZGU7XHJcbiAgICAgICAgbGV0IG5leHROb2RlID0gbnVsbDtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBUZXh0OlxyXG4gICAgICAgICAgICAgICAgaWYgKGRvbVR5cGUgIT09IDMgLyogVEVYVCAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHROb2RlID0gb25NaXNtYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZGF0YSAhPT0gdm5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzTWlzbWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhcm4oYEh5ZHJhdGlvbiB0ZXh0IG1pc21hdGNoOmAgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcXG4tIENsaWVudDogJHtKU09OLnN0cmluZ2lmeShub2RlLmRhdGEpfWAgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcXG4tIFNlcnZlcjogJHtKU09OLnN0cmluZ2lmeSh2bm9kZS5jaGlsZHJlbil9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGF0YSA9IHZub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBuZXh0Tm9kZSA9IG5leHRTaWJsaW5nKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgQ29tbWVudDpcclxuICAgICAgICAgICAgICAgIGlmIChkb21UeXBlICE9PSA4IC8qIENPTU1FTlQgKi8gfHwgaXNGcmFnbWVudFN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dE5vZGUgPSBvbk1pc21hdGNoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0Tm9kZSA9IG5leHRTaWJsaW5nKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgU3RhdGljOlxyXG4gICAgICAgICAgICAgICAgaWYgKGRvbVR5cGUgIT09IDEgLyogRUxFTUVOVCAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHROb2RlID0gb25NaXNtYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGV0ZXJtaW5lIGFuY2hvciwgYWRvcHQgY29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgc3RhdGljIHZub2RlIGhhcyBpdHMgY29udGVudCBzdHJpcHBlZCBkdXJpbmcgYnVpbGQsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRvcHQgaXQgZnJvbSB0aGUgc2VydmVyLXJlbmRlcmVkIEhUTUwuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmVlZFRvQWRvcHRDb250ZW50ID0gIXZub2RlLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZub2RlLnN0YXRpY0NvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5lZWRUb0Fkb3B0Q29udGVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmNoaWxkcmVuICs9IG5leHROb2RlLm91dGVySFRNTDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IHZub2RlLnN0YXRpY0NvdW50IC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuYW5jaG9yID0gbmV4dE5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dE5vZGUgPSBuZXh0U2libGluZyhuZXh0Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0Tm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEZyYWdtZW50OlxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc0ZyYWdtZW50U3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0Tm9kZSA9IG9uTWlzbWF0Y2goKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHROb2RlID0gaHlkcmF0ZUZyYWdtZW50KG5vZGUsIHZub2RlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hhcGVGbGFnICYgMSAvKiBFTEVNRU5UICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbVR5cGUgIT09IDEgLyogRUxFTUVOVCAqLyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS50eXBlICE9PSBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0Tm9kZSA9IG9uTWlzbWF0Y2goKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHROb2RlID0gaHlkcmF0ZUVsZW1lbnQobm9kZSwgdm5vZGUsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIG9wdGltaXplZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hhcGVGbGFnICYgNiAvKiBDT01QT05FTlQgKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHNldHRpbmcgdXAgdGhlIHJlbmRlciBlZmZlY3QsIGlmIHRoZSBpbml0aWFsIHZub2RlIGFscmVhZHlcclxuICAgICAgICAgICAgICAgICAgICAvLyBoYXMgLmVsIHNldCwgdGhlIGNvbXBvbmVudCB3aWxsIHBlcmZvcm0gaHlkcmF0aW9uIGluc3RlYWQgb2YgbW91bnRcclxuICAgICAgICAgICAgICAgICAgICAvLyBvbiBpdHMgc3ViLXRyZWUuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gcGFyZW50Tm9kZShub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBoeWRyYXRlQ29tcG9uZW50ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3VudENvbXBvbmVudCh2bm9kZSwgY29udGFpbmVyLCBudWxsLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWR0NvbnRhaW5lcihjb250YWluZXIpLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYXN5bmMgY29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9hZEFzeW5jID0gdm5vZGUudHlwZS5fX2FzeW5jTG9hZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2FkQXN5bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZEFzeW5jKCkudGhlbihoeWRyYXRlQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh5ZHJhdGVDb21wb25lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29tcG9uZW50IG1heSBiZSBhc3luYywgc28gaW4gdGhlIGNhc2Ugb2YgZnJhZ21lbnRzIHdlIGNhbm5vdCByZWx5XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb24gY29tcG9uZW50J3MgcmVuZGVyZWQgb3V0cHV0IHRvIGRldGVybWluZSB0aGUgZW5kIG9mIHRoZSBmcmFnbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGluc3RlYWQsIHdlIGRvIGEgbG9va2FoZWFkIHRvIGZpbmQgdGhlIGVuZCBhbmNob3Igbm9kZS5cclxuICAgICAgICAgICAgICAgICAgICBuZXh0Tm9kZSA9IGlzRnJhZ21lbnRTdGFydFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGxvY2F0ZUNsb3NpbmdBc3luY0FuY2hvcihub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG5leHRTaWJsaW5nKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hhcGVGbGFnICYgNjQgLyogVEVMRVBPUlQgKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tVHlwZSAhPT0gOCAvKiBDT01NRU5UICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHROb2RlID0gb25NaXNtYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dE5vZGUgPSB2bm9kZS50eXBlLmh5ZHJhdGUobm9kZSwgdm5vZGUsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIG9wdGltaXplZCwgcmVuZGVyZXJJbnRlcm5hbHMsIGh5ZHJhdGVDaGlsZHJlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIHNoYXBlRmxhZyAmIDEyOCAvKiBTVVNQRU5TRSAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHROb2RlID0gdm5vZGUudHlwZS5oeWRyYXRlKG5vZGUsIHZub2RlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWR0NvbnRhaW5lcihwYXJlbnROb2RlKG5vZGUpKSwgb3B0aW1pemVkLCByZW5kZXJlckludGVybmFscywgaHlkcmF0ZU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybignSW52YWxpZCBIb3N0Vk5vZGUgdHlwZTonLCB0eXBlLCBgKCR7dHlwZW9mIHR5cGV9KWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVmICE9IG51bGwgJiYgcGFyZW50Q29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHNldFJlZihyZWYsIG51bGwsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIHZub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5leHROb2RlO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGh5ZHJhdGVFbGVtZW50ID0gKGVsLCB2bm9kZSwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgb3B0aW1pemVkKSA9PiB7XHJcbiAgICAgICAgb3B0aW1pemVkID0gb3B0aW1pemVkIHx8ICEhdm5vZGUuZHluYW1pY0NoaWxkcmVuO1xyXG4gICAgICAgIGNvbnN0IHsgcHJvcHMsIHBhdGNoRmxhZywgc2hhcGVGbGFnLCBkaXJzIH0gPSB2bm9kZTtcclxuICAgICAgICAvLyBza2lwIHByb3BzICYgY2hpbGRyZW4gaWYgdGhpcyBpcyBob2lzdGVkIHN0YXRpYyBub2Rlc1xyXG4gICAgICAgIGlmIChwYXRjaEZsYWcgIT09IC0xIC8qIEhPSVNURUQgKi8pIHtcclxuICAgICAgICAgICAgLy8gcHJvcHNcclxuICAgICAgICAgICAgaWYgKHByb3BzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGltaXplZCB8fFxyXG4gICAgICAgICAgICAgICAgICAgIChwYXRjaEZsYWcgJiAxNiAvKiBGVUxMX1BST1BTICovIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoRmxhZyAmIDMyIC8qIEhZRFJBVEVfRVZFTlRTICovKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNSZXNlcnZlZFByb3Aoa2V5KSAmJiBpc09uKGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoUHJvcChlbCwga2V5LCBudWxsLCBwcm9wc1trZXldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3BzLm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBGYXN0IHBhdGggZm9yIGNsaWNrIGxpc3RlbmVycyAod2hpY2ggaXMgbW9zdCBvZnRlbikgdG8gYXZvaWRcclxuICAgICAgICAgICAgICAgICAgICAvLyBpdGVyYXRpbmcgdGhyb3VnaCBwcm9wcy5cclxuICAgICAgICAgICAgICAgICAgICBwYXRjaFByb3AoZWwsICdvbkNsaWNrJywgbnVsbCwgcHJvcHMub25DbGljayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdm5vZGUgLyBkaXJlY3RpdmUgaG9va3NcclxuICAgICAgICAgICAgbGV0IHZub2RlSG9va3M7XHJcbiAgICAgICAgICAgIGlmICgodm5vZGVIb29rcyA9IHByb3BzICYmIHByb3BzLm9uVm5vZGVCZWZvcmVNb3VudCkpIHtcclxuICAgICAgICAgICAgICAgIGludm9rZVZOb2RlSG9vayh2bm9kZUhvb2tzLCBwYXJlbnRDb21wb25lbnQsIHZub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGlycykge1xyXG4gICAgICAgICAgICAgICAgaW52b2tlRGlyZWN0aXZlSG9vayh2bm9kZSwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCAnYmVmb3JlTW91bnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoKHZub2RlSG9va3MgPSBwcm9wcyAmJiBwcm9wcy5vblZub2RlTW91bnRlZCkgfHwgZGlycykge1xyXG4gICAgICAgICAgICAgICAgcXVldWVFZmZlY3RXaXRoU3VzcGVuc2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZub2RlSG9va3MgJiYgaW52b2tlVk5vZGVIb29rKHZub2RlSG9va3MsIHBhcmVudENvbXBvbmVudCwgdm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpcnMgJiYgaW52b2tlRGlyZWN0aXZlSG9vayh2bm9kZSwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCAnbW91bnRlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSwgcGFyZW50U3VzcGVuc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNoaWxkcmVuXHJcbiAgICAgICAgICAgIGlmIChzaGFwZUZsYWcgJiAxNiAvKiBBUlJBWV9DSElMRFJFTiAqLyAmJlxyXG4gICAgICAgICAgICAgICAgLy8gc2tpcCBpZiBlbGVtZW50IGhhcyBpbm5lckhUTUwgLyB0ZXh0Q29udGVudFxyXG4gICAgICAgICAgICAgICAgIShwcm9wcyAmJiAocHJvcHMuaW5uZXJIVE1MIHx8IHByb3BzLnRleHRDb250ZW50KSkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXh0ID0gaHlkcmF0ZUNoaWxkcmVuKGVsLmZpcnN0Q2hpbGQsIHZub2RlLCBlbCwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgb3B0aW1pemVkKTtcclxuICAgICAgICAgICAgICAgIGxldCBoYXNXYXJuZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzTWlzbWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIWhhc1dhcm5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuKGBIeWRyYXRpb24gY2hpbGRyZW4gbWlzbWF0Y2ggaW4gPCR7dm5vZGUudHlwZX0+OiBgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBzZXJ2ZXIgcmVuZGVyZWQgZWxlbWVudCBjb250YWlucyBtb3JlIGNoaWxkIG5vZGVzIHRoYW4gY2xpZW50IHZkb20uYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc1dhcm5lZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBTU1JlZCBET00gY29udGFpbnMgbW9yZSBub2RlcyB0aGFuIGl0IHNob3VsZC4gUmVtb3ZlIHRoZW0uXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyID0gbmV4dDtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0ID0gbmV4dC5uZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmUoY3VyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChzaGFwZUZsYWcgJiA4IC8qIFRFWFRfQ0hJTERSRU4gKi8pIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbC50ZXh0Q29udGVudCAhPT0gdm5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBoYXNNaXNtYXRjaCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm4oYEh5ZHJhdGlvbiB0ZXh0IGNvbnRlbnQgbWlzbWF0Y2ggaW4gPCR7dm5vZGUudHlwZX0+OlxcbmAgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYC0gQ2xpZW50OiAke2VsLnRleHRDb250ZW50fVxcbmAgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYC0gU2VydmVyOiAke3Zub2RlLmNoaWxkcmVufWApO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gdm5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVsLm5leHRTaWJsaW5nO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGh5ZHJhdGVDaGlsZHJlbiA9IChub2RlLCB2bm9kZSwgY29udGFpbmVyLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBvcHRpbWl6ZWQpID0+IHtcclxuICAgICAgICBvcHRpbWl6ZWQgPSBvcHRpbWl6ZWQgfHwgISF2bm9kZS5keW5hbWljQ2hpbGRyZW47XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcclxuICAgICAgICBjb25zdCBsID0gY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgIGxldCBoYXNXYXJuZWQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB2bm9kZSA9IG9wdGltaXplZFxyXG4gICAgICAgICAgICAgICAgPyBjaGlsZHJlbltpXVxyXG4gICAgICAgICAgICAgICAgOiAoY2hpbGRyZW5baV0gPSBub3JtYWxpemVWTm9kZShjaGlsZHJlbltpXSkpO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IGh5ZHJhdGVOb2RlKG5vZGUsIHZub2RlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaGFzTWlzbWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiAhaGFzV2FybmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgSHlkcmF0aW9uIGNoaWxkcmVuIG1pc21hdGNoIGluIDwke2NvbnRhaW5lci50YWdOYW1lLnRvTG93ZXJDYXNlKCl9PjogYCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGBzZXJ2ZXIgcmVuZGVyZWQgZWxlbWVudCBjb250YWlucyBmZXdlciBjaGlsZCBub2RlcyB0aGFuIGNsaWVudCB2ZG9tLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc1dhcm5lZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgU1NSZWQgRE9NIGRpZG4ndCBjb250YWluIGVub3VnaCBub2Rlcy4gTW91bnQgdGhlIG1pc3Npbmcgb25lcy5cclxuICAgICAgICAgICAgICAgIHBhdGNoKG51bGwsIHZub2RlLCBjb250YWluZXIsIG51bGwsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHQ29udGFpbmVyKGNvbnRhaW5lcikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGh5ZHJhdGVGcmFnbWVudCA9IChub2RlLCB2bm9kZSwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgb3B0aW1pemVkKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gcGFyZW50Tm9kZShub2RlKTtcclxuICAgICAgICBjb25zdCBuZXh0ID0gaHlkcmF0ZUNoaWxkcmVuKG5leHRTaWJsaW5nKG5vZGUpLCB2bm9kZSwgY29udGFpbmVyLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgIGlmIChuZXh0ICYmIGlzQ29tbWVudChuZXh0KSAmJiBuZXh0LmRhdGEgPT09ICddJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV4dFNpYmxpbmcoKHZub2RlLmFuY2hvciA9IG5leHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGZyYWdtZW50IGRpZG4ndCBoeWRyYXRlIHN1Y2Nlc3NmdWxseSwgc2luY2Ugd2UgZGlkbid0IGdldCBhIGVuZCBhbmNob3JcclxuICAgICAgICAgICAgLy8gYmFjay4gVGhpcyBzaG91bGQgaGF2ZSBsZWQgdG8gbm9kZS9jaGlsZHJlbiBtaXNtYXRjaCB3YXJuaW5ncy5cclxuICAgICAgICAgICAgaGFzTWlzbWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgICAgICAvLyBzaW5jZSB0aGUgYW5jaG9yIGlzIG1pc3NpbmcsIHdlIG5lZWQgdG8gY3JlYXRlIG9uZSBhbmQgaW5zZXJ0IGl0XHJcbiAgICAgICAgICAgIGluc2VydCgodm5vZGUuYW5jaG9yID0gY3JlYXRlQ29tbWVudChgXWApKSwgY29udGFpbmVyLCBuZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGhhbmRsZU1pc21hdGNoID0gKG5vZGUsIHZub2RlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc0ZyYWdtZW50KSA9PiB7XHJcbiAgICAgICAgaGFzTWlzbWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJlxyXG4gICAgICAgICAgICB3YXJuKGBIeWRyYXRpb24gbm9kZSBtaXNtYXRjaDpcXG4tIENsaWVudCB2bm9kZTpgLCB2bm9kZS50eXBlLCBgXFxuLSBTZXJ2ZXIgcmVuZGVyZWQgRE9NOmAsIG5vZGUsIG5vZGUubm9kZVR5cGUgPT09IDMgLyogVEVYVCAqL1xyXG4gICAgICAgICAgICAgICAgPyBgKHRleHQpYFxyXG4gICAgICAgICAgICAgICAgOiBpc0NvbW1lbnQobm9kZSkgJiYgbm9kZS5kYXRhID09PSAnWydcclxuICAgICAgICAgICAgICAgICAgICA/IGAoc3RhcnQgb2YgZnJhZ21lbnQpYFxyXG4gICAgICAgICAgICAgICAgICAgIDogYGApO1xyXG4gICAgICAgIHZub2RlLmVsID0gbnVsbDtcclxuICAgICAgICBpZiAoaXNGcmFnbWVudCkge1xyXG4gICAgICAgICAgICAvLyByZW1vdmUgZXhjZXNzaXZlIGZyYWdtZW50IG5vZGVzXHJcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IGxvY2F0ZUNsb3NpbmdBc3luY0FuY2hvcihub2RlKTtcclxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBuZXh0U2libGluZyhub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQgIT09IGVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZShuZXh0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG5leHQgPSBuZXh0U2libGluZyhub2RlKTtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBwYXJlbnROb2RlKG5vZGUpO1xyXG4gICAgICAgIHJlbW92ZShub2RlKTtcclxuICAgICAgICBwYXRjaChudWxsLCB2bm9kZSwgY29udGFpbmVyLCBuZXh0LCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWR0NvbnRhaW5lcihjb250YWluZXIpKTtcclxuICAgICAgICByZXR1cm4gbmV4dDtcclxuICAgIH07XHJcbiAgICBjb25zdCBsb2NhdGVDbG9zaW5nQXN5bmNBbmNob3IgPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIGxldCBtYXRjaCA9IDA7XHJcbiAgICAgICAgd2hpbGUgKG5vZGUpIHtcclxuICAgICAgICAgICAgbm9kZSA9IG5leHRTaWJsaW5nKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAobm9kZSAmJiBpc0NvbW1lbnQobm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmRhdGEgPT09ICdbJylcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaCsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuZGF0YSA9PT0gJ10nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0U2libGluZyhub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoLS07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBbaHlkcmF0ZSwgaHlkcmF0ZU5vZGVdO1xyXG59XG5cbmxldCBzdXBwb3J0ZWQ7XHJcbmxldCBwZXJmO1xyXG5mdW5jdGlvbiBzdGFydE1lYXN1cmUoaW5zdGFuY2UsIHR5cGUpIHtcclxuICAgIGlmIChpbnN0YW5jZS5hcHBDb250ZXh0LmNvbmZpZy5wZXJmb3JtYW5jZSAmJiBpc1N1cHBvcnRlZCgpKSB7XHJcbiAgICAgICAgcGVyZi5tYXJrKGB2dWUtJHt0eXBlfS0ke2luc3RhbmNlLnVpZH1gKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBlbmRNZWFzdXJlKGluc3RhbmNlLCB0eXBlKSB7XHJcbiAgICBpZiAoaW5zdGFuY2UuYXBwQ29udGV4dC5jb25maWcucGVyZm9ybWFuY2UgJiYgaXNTdXBwb3J0ZWQoKSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0VGFnID0gYHZ1ZS0ke3R5cGV9LSR7aW5zdGFuY2UudWlkfWA7XHJcbiAgICAgICAgY29uc3QgZW5kVGFnID0gc3RhcnRUYWcgKyBgOmVuZGA7XHJcbiAgICAgICAgcGVyZi5tYXJrKGVuZFRhZyk7XHJcbiAgICAgICAgcGVyZi5tZWFzdXJlKGA8JHtmb3JtYXRDb21wb25lbnROYW1lKGluc3RhbmNlLCBpbnN0YW5jZS50eXBlKX0+ICR7dHlwZX1gLCBzdGFydFRhZywgZW5kVGFnKTtcclxuICAgICAgICBwZXJmLmNsZWFyTWFya3Moc3RhcnRUYWcpO1xyXG4gICAgICAgIHBlcmYuY2xlYXJNYXJrcyhlbmRUYWcpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xyXG4gICAgaWYgKHN1cHBvcnRlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cHBvcnRlZDtcclxuICAgIH1cclxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wZXJmb3JtYW5jZSkge1xyXG4gICAgICAgIHN1cHBvcnRlZCA9IHRydWU7XHJcbiAgICAgICAgcGVyZiA9IHdpbmRvdy5wZXJmb3JtYW5jZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN1cHBvcnRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgKi9cclxuICAgIHJldHVybiBzdXBwb3J0ZWQ7XHJcbn1cblxuY29uc3QgcHJvZEVmZmVjdE9wdGlvbnMgPSB7XHJcbiAgICBzY2hlZHVsZXI6IHF1ZXVlSm9iXHJcbn07XHJcbmZ1bmN0aW9uIGNyZWF0ZURldkVmZmVjdE9wdGlvbnMoaW5zdGFuY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2NoZWR1bGVyOiBxdWV1ZUpvYixcclxuICAgICAgICBvblRyYWNrOiBpbnN0YW5jZS5ydGMgPyBlID0+IGludm9rZUFycmF5Rm5zKGluc3RhbmNlLnJ0YywgZSkgOiB2b2lkIDAsXHJcbiAgICAgICAgb25UcmlnZ2VyOiBpbnN0YW5jZS5ydGcgPyBlID0+IGludm9rZUFycmF5Rm5zKGluc3RhbmNlLnJ0ZywgZSkgOiB2b2lkIDBcclxuICAgIH07XHJcbn1cclxuY29uc3QgcXVldWVQb3N0UmVuZGVyRWZmZWN0ID0gIHF1ZXVlRWZmZWN0V2l0aFN1c3BlbnNlXHJcbiAgICA7XHJcbmNvbnN0IHNldFJlZiA9IChyYXdSZWYsIG9sZFJhd1JlZiwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgdm5vZGUpID0+IHtcclxuICAgIGxldCB2YWx1ZTtcclxuICAgIGlmICghdm5vZGUpIHtcclxuICAgICAgICB2YWx1ZSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAodm5vZGUuc2hhcGVGbGFnICYgNCAvKiBTVEFURUZVTF9DT01QT05FTlQgKi8pIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB2bm9kZS5jb21wb25lbnQucHJveHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZub2RlLmVsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IFtvd25lciwgcmVmXSA9IHJhd1JlZjtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIW93bmVyKSB7XHJcbiAgICAgICAgd2FybihgTWlzc2luZyByZWYgb3duZXIgY29udGV4dC4gcmVmIGNhbm5vdCBiZSB1c2VkIG9uIGhvaXN0ZWQgdm5vZGVzLiBgICtcclxuICAgICAgICAgICAgYEEgdm5vZGUgd2l0aCByZWYgbXVzdCBiZSBjcmVhdGVkIGluc2lkZSB0aGUgcmVuZGVyIGZ1bmN0aW9uLmApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IG9sZFJlZiA9IG9sZFJhd1JlZiAmJiBvbGRSYXdSZWZbMV07XHJcbiAgICBjb25zdCByZWZzID0gb3duZXIucmVmcyA9PT0gRU1QVFlfT0JKID8gKG93bmVyLnJlZnMgPSB7fSkgOiBvd25lci5yZWZzO1xyXG4gICAgY29uc3Qgc2V0dXBTdGF0ZSA9IG93bmVyLnNldHVwU3RhdGU7XHJcbiAgICAvLyB1bnNldCBvbGQgcmVmXHJcbiAgICBpZiAob2xkUmVmICE9IG51bGwgJiYgb2xkUmVmICE9PSByZWYpIHtcclxuICAgICAgICBpZiAoaXNTdHJpbmcob2xkUmVmKSkge1xyXG4gICAgICAgICAgICByZWZzW29sZFJlZl0gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoaGFzT3duKHNldHVwU3RhdGUsIG9sZFJlZikpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXVlUG9zdFJlbmRlckVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dXBTdGF0ZVtvbGRSZWZdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH0sIHBhcmVudFN1c3BlbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpc1JlZihvbGRSZWYpKSB7XHJcbiAgICAgICAgICAgIG9sZFJlZi52YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGlzU3RyaW5nKHJlZikpIHtcclxuICAgICAgICByZWZzW3JlZl0gPSB2YWx1ZTtcclxuICAgICAgICBpZiAoaGFzT3duKHNldHVwU3RhdGUsIHJlZikpIHtcclxuICAgICAgICAgICAgcXVldWVQb3N0UmVuZGVyRWZmZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNldHVwU3RhdGVbcmVmXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LCBwYXJlbnRTdXNwZW5zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNSZWYocmVmKSkge1xyXG4gICAgICAgIHJlZi52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNGdW5jdGlvbihyZWYpKSB7XHJcbiAgICAgICAgY2FsbFdpdGhFcnJvckhhbmRsaW5nKHJlZiwgcGFyZW50Q29tcG9uZW50LCAxMiAvKiBGVU5DVElPTl9SRUYgKi8sIFtcclxuICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgIHJlZnNcclxuICAgICAgICBdKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgIHdhcm4oJ0ludmFsaWQgdGVtcGxhdGUgcmVmIHR5cGU6JywgdmFsdWUsIGAoJHt0eXBlb2YgdmFsdWV9KWApO1xyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogVGhlIGNyZWF0ZVJlbmRlcmVyIGZ1bmN0aW9uIGFjY2VwdHMgdHdvIGdlbmVyaWMgYXJndW1lbnRzOlxyXG4gKiBIb3N0Tm9kZSBhbmQgSG9zdEVsZW1lbnQsIGNvcnJlc3BvbmRpbmcgdG8gTm9kZSBhbmQgRWxlbWVudCB0eXBlcyBpbiB0aGVcclxuICogaG9zdCBlbnZpcm9ubWVudC4gRm9yIGV4YW1wbGUsIGZvciBydW50aW1lLWRvbSwgSG9zdE5vZGUgd291bGQgYmUgdGhlIERPTVxyXG4gKiBgTm9kZWAgaW50ZXJmYWNlIGFuZCBIb3N0RWxlbWVudCB3b3VsZCBiZSB0aGUgRE9NIGBFbGVtZW50YCBpbnRlcmZhY2UuXHJcbiAqXHJcbiAqIEN1c3RvbSByZW5kZXJlcnMgY2FuIHBhc3MgaW4gdGhlIHBsYXRmb3JtIHNwZWNpZmljIHR5cGVzIGxpa2UgdGhpczpcclxuICpcclxuICogYGBgIGpzXHJcbiAqIGNvbnN0IHsgcmVuZGVyLCBjcmVhdGVBcHAgfSA9IGNyZWF0ZVJlbmRlcmVyPE5vZGUsIEVsZW1lbnQ+KHtcclxuICogICBwYXRjaFByb3AsXHJcbiAqICAgLi4ubm9kZU9wc1xyXG4gKiB9KVxyXG4gKiBgYGBcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVJlbmRlcmVyKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBiYXNlQ3JlYXRlUmVuZGVyZXIob3B0aW9ucyk7XHJcbn1cclxuLy8gU2VwYXJhdGUgQVBJIGZvciBjcmVhdGluZyBoeWRyYXRpb24tZW5hYmxlZCByZW5kZXJlci5cclxuLy8gSHlkcmF0aW9uIGxvZ2ljIGlzIG9ubHkgdXNlZCB3aGVuIGNhbGxpbmcgdGhpcyBmdW5jdGlvbiwgbWFraW5nIGl0XHJcbi8vIHRyZWUtc2hha2FibGUuXHJcbmZ1bmN0aW9uIGNyZWF0ZUh5ZHJhdGlvblJlbmRlcmVyKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBiYXNlQ3JlYXRlUmVuZGVyZXIob3B0aW9ucywgY3JlYXRlSHlkcmF0aW9uRnVuY3Rpb25zKTtcclxufVxyXG4vLyBpbXBsZW1lbnRhdGlvblxyXG5mdW5jdGlvbiBiYXNlQ3JlYXRlUmVuZGVyZXIob3B0aW9ucywgY3JlYXRlSHlkcmF0aW9uRm5zKSB7XHJcbiAgICBjb25zdCB7IGluc2VydDogaG9zdEluc2VydCwgcmVtb3ZlOiBob3N0UmVtb3ZlLCBwYXRjaFByb3A6IGhvc3RQYXRjaFByb3AsIGZvcmNlUGF0Y2hQcm9wOiBob3N0Rm9yY2VQYXRjaFByb3AsIGNyZWF0ZUVsZW1lbnQ6IGhvc3RDcmVhdGVFbGVtZW50LCBjcmVhdGVUZXh0OiBob3N0Q3JlYXRlVGV4dCwgY3JlYXRlQ29tbWVudDogaG9zdENyZWF0ZUNvbW1lbnQsIHNldFRleHQ6IGhvc3RTZXRUZXh0LCBzZXRFbGVtZW50VGV4dDogaG9zdFNldEVsZW1lbnRUZXh0LCBwYXJlbnROb2RlOiBob3N0UGFyZW50Tm9kZSwgbmV4dFNpYmxpbmc6IGhvc3ROZXh0U2libGluZywgc2V0U2NvcGVJZDogaG9zdFNldFNjb3BlSWQgPSBOT09QLCBjbG9uZU5vZGU6IGhvc3RDbG9uZU5vZGUsIGluc2VydFN0YXRpY0NvbnRlbnQ6IGhvc3RJbnNlcnRTdGF0aWNDb250ZW50IH0gPSBvcHRpb25zO1xyXG4gICAgLy8gTm90ZTogZnVuY3Rpb25zIGluc2lkZSB0aGlzIGNsb3N1cmUgc2hvdWxkIHVzZSBgY29uc3QgeHh4ID0gKCkgPT4ge31gXHJcbiAgICAvLyBzdHlsZSBpbiBvcmRlciB0byBwcmV2ZW50IGJlaW5nIGlubGluZWQgYnkgbWluaWZpZXJzLlxyXG4gICAgY29uc3QgcGF0Y2ggPSAobjEsIG4yLCBjb250YWluZXIsIGFuY2hvciA9IG51bGwsIHBhcmVudENvbXBvbmVudCA9IG51bGwsIHBhcmVudFN1c3BlbnNlID0gbnVsbCwgaXNTVkcgPSBmYWxzZSwgb3B0aW1pemVkID0gZmFsc2UpID0+IHtcclxuICAgICAgICAvLyBwYXRjaGluZyAmIG5vdCBzYW1lIHR5cGUsIHVubW91bnQgb2xkIHRyZWVcclxuICAgICAgICBpZiAobjEgJiYgIWlzU2FtZVZOb2RlVHlwZShuMSwgbjIpKSB7XHJcbiAgICAgICAgICAgIGFuY2hvciA9IGdldE5leHRIb3N0Tm9kZShuMSk7XHJcbiAgICAgICAgICAgIHVubW91bnQobjEsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIHRydWUpO1xyXG4gICAgICAgICAgICBuMSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuMi5wYXRjaEZsYWcgPT09IC0yIC8qIEJBSUwgKi8pIHtcclxuICAgICAgICAgICAgb3B0aW1pemVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG4yLmR5bmFtaWNDaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHsgdHlwZSwgcmVmLCBzaGFwZUZsYWcgfSA9IG4yO1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFRleHQ6XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzVGV4dChuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIENvbW1lbnQ6XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzQ29tbWVudE5vZGUobjEsIG4yLCBjb250YWluZXIsIGFuY2hvcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTdGF0aWM6XHJcbiAgICAgICAgICAgICAgICBpZiAobjEgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vdW50U3RhdGljTm9kZShuMiwgY29udGFpbmVyLCBhbmNob3IsIGlzU1ZHKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGNoU3RhdGljTm9kZShuMSwgbjIsIGNvbnRhaW5lciwgaXNTVkcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRnJhZ21lbnQ6XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzRnJhZ21lbnQobjEsIG4yLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGlmIChzaGFwZUZsYWcgJiAxIC8qIEVMRU1FTlQgKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRWxlbWVudChuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlRmxhZyAmIDYgLyogQ09NUE9ORU5UICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0NvbXBvbmVudChuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlRmxhZyAmIDY0IC8qIFRFTEVQT1JUICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5wcm9jZXNzKG4xLCBuMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQsIGludGVybmFscyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICggc2hhcGVGbGFnICYgMTI4IC8qIFNVU1BFTlNFICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5wcm9jZXNzKG4xLCBuMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQsIGludGVybmFscyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YXJuKCdJbnZhbGlkIFZOb2RlIHR5cGU6JywgdHlwZSwgYCgke3R5cGVvZiB0eXBlfSlgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IHJlZlxyXG4gICAgICAgIGlmIChyZWYgIT0gbnVsbCAmJiBwYXJlbnRDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgc2V0UmVmKHJlZiwgbjEgJiYgbjEucmVmLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBuMik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHByb2Nlc3NUZXh0ID0gKG4xLCBuMiwgY29udGFpbmVyLCBhbmNob3IpID0+IHtcclxuICAgICAgICBpZiAobjEgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBob3N0SW5zZXJ0KChuMi5lbCA9IGhvc3RDcmVhdGVUZXh0KG4yLmNoaWxkcmVuKSksIGNvbnRhaW5lciwgYW5jaG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsID0gKG4yLmVsID0gbjEuZWwpO1xyXG4gICAgICAgICAgICBpZiAobjIuY2hpbGRyZW4gIT09IG4xLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBob3N0U2V0VGV4dChlbCwgbjIuY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHByb2Nlc3NDb21tZW50Tm9kZSA9IChuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yKSA9PiB7XHJcbiAgICAgICAgaWYgKG4xID09IG51bGwpIHtcclxuICAgICAgICAgICAgaG9zdEluc2VydCgobjIuZWwgPSBob3N0Q3JlYXRlQ29tbWVudChuMi5jaGlsZHJlbiB8fCAnJykpLCBjb250YWluZXIsIGFuY2hvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB0aGVyZSdzIG5vIHN1cHBvcnQgZm9yIGR5bmFtaWMgY29tbWVudHNcclxuICAgICAgICAgICAgbjIuZWwgPSBuMS5lbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgbW91bnRTdGF0aWNOb2RlID0gKG4yLCBjb250YWluZXIsIGFuY2hvciwgaXNTVkcpID0+IHtcclxuICAgICAgICBbbjIuZWwsIG4yLmFuY2hvcl0gPSBob3N0SW5zZXJ0U3RhdGljQ29udGVudChuMi5jaGlsZHJlbiwgY29udGFpbmVyLCBhbmNob3IsIGlzU1ZHKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERldiAvIEhNUiBvbmx5XHJcbiAgICAgKi9cclxuICAgIGNvbnN0IHBhdGNoU3RhdGljTm9kZSA9IChuMSwgbjIsIGNvbnRhaW5lciwgaXNTVkcpID0+IHtcclxuICAgICAgICAvLyBzdGF0aWMgbm9kZXMgYXJlIG9ubHkgcGF0Y2hlZCBkdXJpbmcgZGV2IGZvciBITVJcclxuICAgICAgICBpZiAobjIuY2hpbGRyZW4gIT09IG4xLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuY2hvciA9IGhvc3ROZXh0U2libGluZyhuMS5hbmNob3IpO1xyXG4gICAgICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmdcclxuICAgICAgICAgICAgcmVtb3ZlU3RhdGljTm9kZShuMSk7XHJcbiAgICAgICAgICAgIFtuMi5lbCwgbjIuYW5jaG9yXSA9IGhvc3RJbnNlcnRTdGF0aWNDb250ZW50KG4yLmNoaWxkcmVuLCBjb250YWluZXIsIGFuY2hvciwgaXNTVkcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbjIuZWwgPSBuMS5lbDtcclxuICAgICAgICAgICAgbjIuYW5jaG9yID0gbjEuYW5jaG9yO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERldiAvIEhNUiBvbmx5XHJcbiAgICAgKi9cclxuICAgIGNvbnN0IG1vdmVTdGF0aWNOb2RlID0gKHZub2RlLCBjb250YWluZXIsIGFuY2hvcikgPT4ge1xyXG4gICAgICAgIGxldCBjdXIgPSB2bm9kZS5lbDtcclxuICAgICAgICBjb25zdCBlbmQgPSB2bm9kZS5hbmNob3I7XHJcbiAgICAgICAgd2hpbGUgKGN1ciAmJiBjdXIgIT09IGVuZCkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0ID0gaG9zdE5leHRTaWJsaW5nKGN1cik7XHJcbiAgICAgICAgICAgIGhvc3RJbnNlcnQoY3VyLCBjb250YWluZXIsIGFuY2hvcik7XHJcbiAgICAgICAgICAgIGN1ciA9IG5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhvc3RJbnNlcnQoZW5kLCBjb250YWluZXIsIGFuY2hvcik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBEZXYgLyBITVIgb25seVxyXG4gICAgICovXHJcbiAgICBjb25zdCByZW1vdmVTdGF0aWNOb2RlID0gKHZub2RlKSA9PiB7XHJcbiAgICAgICAgbGV0IGN1ciA9IHZub2RlLmVsO1xyXG4gICAgICAgIHdoaWxlIChjdXIgJiYgY3VyICE9PSB2bm9kZS5hbmNob3IpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV4dCA9IGhvc3ROZXh0U2libGluZyhjdXIpO1xyXG4gICAgICAgICAgICBob3N0UmVtb3ZlKGN1cik7XHJcbiAgICAgICAgICAgIGN1ciA9IG5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhvc3RSZW1vdmUodm5vZGUuYW5jaG9yKTtcclxuICAgIH07XHJcbiAgICBjb25zdCBwcm9jZXNzRWxlbWVudCA9IChuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKSA9PiB7XHJcbiAgICAgICAgaXNTVkcgPSBpc1NWRyB8fCBuMi50eXBlID09PSAnc3ZnJztcclxuICAgICAgICBpZiAobjEgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBtb3VudEVsZW1lbnQobjIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHBhdGNoRWxlbWVudChuMSwgbjIsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBjb25zdCBtb3VudEVsZW1lbnQgPSAodm5vZGUsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKSA9PiB7XHJcbiAgICAgICAgbGV0IGVsO1xyXG4gICAgICAgIGxldCB2bm9kZUhvb2s7XHJcbiAgICAgICAgY29uc3QgeyB0eXBlLCBwcm9wcywgc2hhcGVGbGFnLCB0cmFuc2l0aW9uLCBzY29wZUlkLCBwYXRjaEZsYWcsIGRpcnMgfSA9IHZub2RlO1xyXG4gICAgICAgIGlmICghKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmXHJcbiAgICAgICAgICAgIHZub2RlLmVsICYmXHJcbiAgICAgICAgICAgIGhvc3RDbG9uZU5vZGUgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICBwYXRjaEZsYWcgPT09IC0xIC8qIEhPSVNURUQgKi8pIHtcclxuICAgICAgICAgICAgLy8gSWYgYSB2bm9kZSBoYXMgbm9uLW51bGwgZWwsIGl0IG1lYW5zIGl0J3MgYmVpbmcgcmV1c2VkLlxyXG4gICAgICAgICAgICAvLyBPbmx5IHN0YXRpYyB2bm9kZXMgY2FuIGJlIHJldXNlZCwgc28gaXRzIG1vdW50ZWQgRE9NIG5vZGVzIHNob3VsZCBiZVxyXG4gICAgICAgICAgICAvLyBleGFjdGx5IHRoZSBzYW1lLCBhbmQgd2UgY2FuIHNpbXBseSBkbyBhIGNsb25lIGhlcmUuXHJcbiAgICAgICAgICAgIC8vIG9ubHkgZG8gdGhpcyBpbiBwcm9kdWN0aW9uIHNpbmNlIGNsb25lZCB0cmVlcyBjYW5ub3QgYmUgSE1SIHVwZGF0ZWQuXHJcbiAgICAgICAgICAgIGVsID0gdm5vZGUuZWwgPSBob3N0Q2xvbmVOb2RlKHZub2RlLmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsID0gdm5vZGUuZWwgPSBob3N0Q3JlYXRlRWxlbWVudCh2bm9kZS50eXBlLCBpc1NWRywgcHJvcHMgJiYgcHJvcHMuaXMpO1xyXG4gICAgICAgICAgICAvLyBtb3VudCBjaGlsZHJlbiBmaXJzdCwgc2luY2Ugc29tZSBwcm9wcyBtYXkgcmVseSBvbiBjaGlsZCBjb250ZW50XHJcbiAgICAgICAgICAgIC8vIGJlaW5nIGFscmVhZHkgcmVuZGVyZWQsIGUuZy4gYDxzZWxlY3QgdmFsdWU+YFxyXG4gICAgICAgICAgICBpZiAoc2hhcGVGbGFnICYgOCAvKiBURVhUX0NISUxEUkVOICovKSB7XHJcbiAgICAgICAgICAgICAgICBob3N0U2V0RWxlbWVudFRleHQoZWwsIHZub2RlLmNoaWxkcmVuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChzaGFwZUZsYWcgJiAxNiAvKiBBUlJBWV9DSElMRFJFTiAqLykge1xyXG4gICAgICAgICAgICAgICAgbW91bnRDaGlsZHJlbih2bm9kZS5jaGlsZHJlbiwgZWwsIG51bGwsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHICYmIHR5cGUgIT09ICdmb3JlaWduT2JqZWN0Jywgb3B0aW1pemVkIHx8ICEhdm5vZGUuZHluYW1pY0NoaWxkcmVuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBwcm9wc1xyXG4gICAgICAgICAgICBpZiAocHJvcHMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1Jlc2VydmVkUHJvcChrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvc3RQYXRjaFByb3AoZWwsIGtleSwgbnVsbCwgcHJvcHNba2V5XSwgaXNTVkcsIHZub2RlLmNoaWxkcmVuLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCB1bm1vdW50Q2hpbGRyZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgodm5vZGVIb29rID0gcHJvcHMub25Wbm9kZUJlZm9yZU1vdW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGludm9rZVZOb2RlSG9vayh2bm9kZUhvb2ssIHBhcmVudENvbXBvbmVudCwgdm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkaXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpbnZva2VEaXJlY3RpdmVIb29rKHZub2RlLCBudWxsLCBwYXJlbnRDb21wb25lbnQsICdiZWZvcmVNb3VudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHNjb3BlSWRcclxuICAgICAgICAgICAgaWYgKHNjb3BlSWQpIHtcclxuICAgICAgICAgICAgICAgIGhvc3RTZXRTY29wZUlkKGVsLCBzY29wZUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB0cmVlT3duZXJJZCA9IHBhcmVudENvbXBvbmVudCAmJiBwYXJlbnRDb21wb25lbnQudHlwZS5fX3Njb3BlSWQ7XHJcbiAgICAgICAgICAgIC8vIHZub2RlJ3Mgb3duIHNjb3BlSWQgYW5kIHRoZSBjdXJyZW50IHBhdGNoZWQgY29tcG9uZW50J3Mgc2NvcGVJZCBpc1xyXG4gICAgICAgICAgICAvLyBkaWZmZXJlbnQgLSB0aGlzIGlzIGEgc2xvdCBjb250ZW50IG5vZGUuXHJcbiAgICAgICAgICAgIGlmICh0cmVlT3duZXJJZCAmJiB0cmVlT3duZXJJZCAhPT0gc2NvcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgaG9zdFNldFNjb3BlSWQoZWwsIHRyZWVPd25lcklkICsgJy1zJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRyYW5zaXRpb24gJiYgIXRyYW5zaXRpb24ucGVyc2lzdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLmJlZm9yZUVudGVyKGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBob3N0SW5zZXJ0KGVsLCBjb250YWluZXIsIGFuY2hvcik7XHJcbiAgICAgICAgLy8gIzE1ODMgRm9yIGluc2lkZSBzdXNwZW5zZSBjYXNlLCBlbnRlciBob29rIHNob3VsZCBjYWxsIHdoZW4gc3VzcGVuc2UgcmVzb2x2ZWRcclxuICAgICAgICBjb25zdCBuZWVkQ2FsbFRyYW5zaXRpb25Ib29rcyA9ICFwYXJlbnRTdXNwZW5zZSAmJiB0cmFuc2l0aW9uICYmICF0cmFuc2l0aW9uLnBlcnNpc3RlZDtcclxuICAgICAgICBpZiAoKHZub2RlSG9vayA9IHByb3BzICYmIHByb3BzLm9uVm5vZGVNb3VudGVkKSB8fFxyXG4gICAgICAgICAgICBuZWVkQ2FsbFRyYW5zaXRpb25Ib29rcyB8fFxyXG4gICAgICAgICAgICBkaXJzKSB7XHJcbiAgICAgICAgICAgIHF1ZXVlUG9zdFJlbmRlckVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2bm9kZUhvb2sgJiYgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgcGFyZW50Q29tcG9uZW50LCB2bm9kZSk7XHJcbiAgICAgICAgICAgICAgICBuZWVkQ2FsbFRyYW5zaXRpb25Ib29rcyAmJiB0cmFuc2l0aW9uLmVudGVyKGVsKTtcclxuICAgICAgICAgICAgICAgIGRpcnMgJiYgaW52b2tlRGlyZWN0aXZlSG9vayh2bm9kZSwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCAnbW91bnRlZCcpO1xyXG4gICAgICAgICAgICB9LCBwYXJlbnRTdXNwZW5zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IG1vdW50Q2hpbGRyZW4gPSAoY2hpbGRyZW4sIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkLCBzdGFydCA9IDApID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IChjaGlsZHJlbltpXSA9IG9wdGltaXplZFxyXG4gICAgICAgICAgICAgICAgPyBjbG9uZUlmTW91bnRlZChjaGlsZHJlbltpXSlcclxuICAgICAgICAgICAgICAgIDogbm9ybWFsaXplVk5vZGUoY2hpbGRyZW5baV0pKTtcclxuICAgICAgICAgICAgcGF0Y2gobnVsbCwgY2hpbGQsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgcGF0Y2hFbGVtZW50ID0gKG4xLCBuMiwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGVsID0gKG4yLmVsID0gbjEuZWwpO1xyXG4gICAgICAgIGxldCB7IHBhdGNoRmxhZywgZHluYW1pY0NoaWxkcmVuLCBkaXJzIH0gPSBuMjtcclxuICAgICAgICAvLyAjMTQyNiB0YWtlIHRoZSBvbGQgdm5vZGUncyBwYXRjaCBmbGFnIGludG8gYWNjb3VudCBzaW5jZSB1c2VyIG1heSBjbG9uZSBhXHJcbiAgICAgICAgLy8gY29tcGlsZXItZ2VuZXJhdGVkIHZub2RlLCB3aGljaCBkZS1vcHRzIHRvIEZVTExfUFJPUFNcclxuICAgICAgICBwYXRjaEZsYWcgfD0gbjEucGF0Y2hGbGFnICYgMTYgLyogRlVMTF9QUk9QUyAqLztcclxuICAgICAgICBjb25zdCBvbGRQcm9wcyA9IG4xLnByb3BzIHx8IEVNUFRZX09CSjtcclxuICAgICAgICBjb25zdCBuZXdQcm9wcyA9IG4yLnByb3BzIHx8IEVNUFRZX09CSjtcclxuICAgICAgICBsZXQgdm5vZGVIb29rO1xyXG4gICAgICAgIGlmICgodm5vZGVIb29rID0gbmV3UHJvcHMub25Wbm9kZUJlZm9yZVVwZGF0ZSkpIHtcclxuICAgICAgICAgICAgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgcGFyZW50Q29tcG9uZW50LCBuMiwgbjEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlycykge1xyXG4gICAgICAgICAgICBpbnZva2VEaXJlY3RpdmVIb29rKG4yLCBuMSwgcGFyZW50Q29tcG9uZW50LCAnYmVmb3JlVXBkYXRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgaXNIbXJVcGRhdGluZykge1xyXG4gICAgICAgICAgICAvLyBITVIgdXBkYXRlZCwgZm9yY2UgZnVsbCBkaWZmXHJcbiAgICAgICAgICAgIHBhdGNoRmxhZyA9IDA7XHJcbiAgICAgICAgICAgIG9wdGltaXplZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBkeW5hbWljQ2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGF0Y2hGbGFnID4gMCkge1xyXG4gICAgICAgICAgICAvLyB0aGUgcHJlc2VuY2Ugb2YgYSBwYXRjaEZsYWcgbWVhbnMgdGhpcyBlbGVtZW50J3MgcmVuZGVyIGNvZGUgd2FzXHJcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlZCBieSB0aGUgY29tcGlsZXIgYW5kIGNhbiB0YWtlIHRoZSBmYXN0IHBhdGguXHJcbiAgICAgICAgICAgIC8vIGluIHRoaXMgcGF0aCBvbGQgbm9kZSBhbmQgbmV3IG5vZGUgYXJlIGd1YXJhbnRlZWQgdG8gaGF2ZSB0aGUgc2FtZSBzaGFwZVxyXG4gICAgICAgICAgICAvLyAoaS5lLiBhdCB0aGUgZXhhY3Qgc2FtZSBwb3NpdGlvbiBpbiB0aGUgc291cmNlIHRlbXBsYXRlKVxyXG4gICAgICAgICAgICBpZiAocGF0Y2hGbGFnICYgMTYgLyogRlVMTF9QUk9QUyAqLykge1xyXG4gICAgICAgICAgICAgICAgLy8gZWxlbWVudCBwcm9wcyBjb250YWluIGR5bmFtaWMga2V5cywgZnVsbCBkaWZmIG5lZWRlZFxyXG4gICAgICAgICAgICAgICAgcGF0Y2hQcm9wcyhlbCwgbjIsIG9sZFByb3BzLCBuZXdQcm9wcywgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY2xhc3NcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgZmxhZyBpcyBtYXRjaGVkIHdoZW4gdGhlIGVsZW1lbnQgaGFzIGR5bmFtaWMgY2xhc3MgYmluZGluZ3MuXHJcbiAgICAgICAgICAgICAgICBpZiAocGF0Y2hGbGFnICYgMiAvKiBDTEFTUyAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRQcm9wcy5jbGFzcyAhPT0gbmV3UHJvcHMuY2xhc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9zdFBhdGNoUHJvcChlbCwgJ2NsYXNzJywgbnVsbCwgbmV3UHJvcHMuY2xhc3MsIGlzU1ZHKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBzdHlsZVxyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBmbGFnIGlzIG1hdGNoZWQgd2hlbiB0aGUgZWxlbWVudCBoYXMgZHluYW1pYyBzdHlsZSBiaW5kaW5nc1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGNoRmxhZyAmIDQgLyogU1RZTEUgKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICBob3N0UGF0Y2hQcm9wKGVsLCAnc3R5bGUnLCBvbGRQcm9wcy5zdHlsZSwgbmV3UHJvcHMuc3R5bGUsIGlzU1ZHKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHByb3BzXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGZsYWcgaXMgbWF0Y2hlZCB3aGVuIHRoZSBlbGVtZW50IGhhcyBkeW5hbWljIHByb3AvYXR0ciBiaW5kaW5nc1xyXG4gICAgICAgICAgICAgICAgLy8gb3RoZXIgdGhhbiBjbGFzcyBhbmQgc3R5bGUuIFRoZSBrZXlzIG9mIGR5bmFtaWMgcHJvcC9hdHRycyBhcmUgc2F2ZWQgZm9yXHJcbiAgICAgICAgICAgICAgICAvLyBmYXN0ZXIgaXRlcmF0aW9uLlxyXG4gICAgICAgICAgICAgICAgLy8gTm90ZSBkeW5hbWljIGtleXMgbGlrZSA6W2Zvb109XCJiYXJcIiB3aWxsIGNhdXNlIHRoaXMgb3B0aW1pemF0aW9uIHRvXHJcbiAgICAgICAgICAgICAgICAvLyBiYWlsIG91dCBhbmQgZ28gdGhyb3VnaCBhIGZ1bGwgZGlmZiBiZWNhdXNlIHdlIG5lZWQgdG8gdW5zZXQgdGhlIG9sZCBrZXlcclxuICAgICAgICAgICAgICAgIGlmIChwYXRjaEZsYWcgJiA4IC8qIFBST1BTICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGZsYWcgaXMgcHJlc2VudCB0aGVuIGR5bmFtaWNQcm9wcyBtdXN0IGJlIG5vbi1udWxsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvcHNUb1VwZGF0ZSA9IG4yLmR5bmFtaWNQcm9wcztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzVG9VcGRhdGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gcHJvcHNUb1VwZGF0ZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IG9sZFByb3BzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBuZXdQcm9wc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCAhPT0gcHJldiB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGhvc3RGb3JjZVBhdGNoUHJvcCAmJiBob3N0Rm9yY2VQYXRjaFByb3AoZWwsIGtleSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3N0UGF0Y2hQcm9wKGVsLCBrZXksIHByZXYsIG5leHQsIGlzU1ZHLCBuMS5jaGlsZHJlbiwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgdW5tb3VudENoaWxkcmVuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB0ZXh0XHJcbiAgICAgICAgICAgIC8vIFRoaXMgZmxhZyBpcyBtYXRjaGVkIHdoZW4gdGhlIGVsZW1lbnQgaGFzIG9ubHkgZHluYW1pYyB0ZXh0IGNoaWxkcmVuLlxyXG4gICAgICAgICAgICBpZiAocGF0Y2hGbGFnICYgMSAvKiBURVhUICovKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobjEuY2hpbGRyZW4gIT09IG4yLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaG9zdFNldEVsZW1lbnRUZXh0KGVsLCBuMi5jaGlsZHJlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoIW9wdGltaXplZCAmJiBkeW5hbWljQ2hpbGRyZW4gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyB1bm9wdGltaXplZCwgZnVsbCBkaWZmXHJcbiAgICAgICAgICAgIHBhdGNoUHJvcHMoZWwsIG4yLCBvbGRQcm9wcywgbmV3UHJvcHMsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYXJlQ2hpbGRyZW5TVkcgPSBpc1NWRyAmJiBuMi50eXBlICE9PSAnZm9yZWlnbk9iamVjdCc7XHJcbiAgICAgICAgaWYgKGR5bmFtaWNDaGlsZHJlbikge1xyXG4gICAgICAgICAgICBwYXRjaEJsb2NrQ2hpbGRyZW4objEuZHluYW1pY0NoaWxkcmVuLCBkeW5hbWljQ2hpbGRyZW4sIGVsLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBhcmVDaGlsZHJlblNWRyk7XHJcbiAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgcGFyZW50Q29tcG9uZW50ICYmIHBhcmVudENvbXBvbmVudC50eXBlLl9faG1ySWQpIHtcclxuICAgICAgICAgICAgICAgIHRyYXZlcnNlU3RhdGljQ2hpbGRyZW4objEsIG4yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghb3B0aW1pemVkKSB7XHJcbiAgICAgICAgICAgIC8vIGZ1bGwgZGlmZlxyXG4gICAgICAgICAgICBwYXRjaENoaWxkcmVuKG4xLCBuMiwgZWwsIG51bGwsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGFyZUNoaWxkcmVuU1ZHKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCh2bm9kZUhvb2sgPSBuZXdQcm9wcy5vblZub2RlVXBkYXRlZCkgfHwgZGlycykge1xyXG4gICAgICAgICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdm5vZGVIb29rICYmIGludm9rZVZOb2RlSG9vayh2bm9kZUhvb2ssIHBhcmVudENvbXBvbmVudCwgbjIsIG4xKTtcclxuICAgICAgICAgICAgICAgIGRpcnMgJiYgaW52b2tlRGlyZWN0aXZlSG9vayhuMiwgbjEsIHBhcmVudENvbXBvbmVudCwgJ3VwZGF0ZWQnKTtcclxuICAgICAgICAgICAgfSwgcGFyZW50U3VzcGVuc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyBUaGUgZmFzdCBwYXRoIGZvciBibG9ja3MuXHJcbiAgICBjb25zdCBwYXRjaEJsb2NrQ2hpbGRyZW4gPSAob2xkQ2hpbGRyZW4sIG5ld0NoaWxkcmVuLCBmYWxsYmFja0NvbnRhaW5lciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcpID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZFZOb2RlID0gb2xkQ2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZOb2RlID0gbmV3Q2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIC8vIERldGVybWluZSB0aGUgY29udGFpbmVyIChwYXJlbnQgZWxlbWVudCkgZm9yIHRoZSBwYXRjaC5cclxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gXHJcbiAgICAgICAgICAgIC8vIC0gSW4gdGhlIGNhc2Ugb2YgYSBGcmFnbWVudCwgd2UgbmVlZCB0byBwcm92aWRlIHRoZSBhY3R1YWwgcGFyZW50XHJcbiAgICAgICAgICAgIC8vIG9mIHRoZSBGcmFnbWVudCBpdHNlbGYgc28gaXQgY2FuIG1vdmUgaXRzIGNoaWxkcmVuLlxyXG4gICAgICAgICAgICBvbGRWTm9kZS50eXBlID09PSBGcmFnbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgLy8gLSBJbiB0aGUgY2FzZSBvZiBkaWZmZXJlbnQgbm9kZXMsIHRoZXJlIGlzIGdvaW5nIHRvIGJlIGEgcmVwbGFjZW1lbnRcclxuICAgICAgICAgICAgICAgIC8vIHdoaWNoIGFsc28gcmVxdWlyZXMgdGhlIGNvcnJlY3QgcGFyZW50IGNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgIWlzU2FtZVZOb2RlVHlwZShvbGRWTm9kZSwgbmV3Vk5vZGUpIHx8XHJcbiAgICAgICAgICAgICAgICAvLyAtIEluIHRoZSBjYXNlIG9mIGEgY29tcG9uZW50LCBpdCBjb3VsZCBjb250YWluIGFueXRoaW5nLlxyXG4gICAgICAgICAgICAgICAgb2xkVk5vZGUuc2hhcGVGbGFnICYgNiAvKiBDT01QT05FTlQgKi9cclxuICAgICAgICAgICAgICAgID8gaG9zdFBhcmVudE5vZGUob2xkVk5vZGUuZWwpXHJcbiAgICAgICAgICAgICAgICA6IC8vIEluIG90aGVyIGNhc2VzLCB0aGUgcGFyZW50IGNvbnRhaW5lciBpcyBub3QgYWN0dWFsbHkgdXNlZCBzbyB3ZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGp1c3QgcGFzcyB0aGUgYmxvY2sgZWxlbWVudCBoZXJlIHRvIGF2b2lkIGEgRE9NIHBhcmVudE5vZGUgY2FsbC5cclxuICAgICAgICAgICAgICAgICAgICBmYWxsYmFja0NvbnRhaW5lcjtcclxuICAgICAgICAgICAgcGF0Y2gob2xkVk5vZGUsIG5ld1ZOb2RlLCBjb250YWluZXIsIG51bGwsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgcGF0Y2hQcm9wcyA9IChlbCwgdm5vZGUsIG9sZFByb3BzLCBuZXdQcm9wcywgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcpID0+IHtcclxuICAgICAgICBpZiAob2xkUHJvcHMgIT09IG5ld1Byb3BzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG5ld1Byb3BzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNSZXNlcnZlZFByb3Aoa2V5KSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBuZXdQcm9wc1trZXldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IG9sZFByb3BzW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dCAhPT0gcHJldiB8fFxyXG4gICAgICAgICAgICAgICAgICAgIChob3N0Rm9yY2VQYXRjaFByb3AgJiYgaG9zdEZvcmNlUGF0Y2hQcm9wKGVsLCBrZXkpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhvc3RQYXRjaFByb3AoZWwsIGtleSwgcHJldiwgbmV4dCwgaXNTVkcsIHZub2RlLmNoaWxkcmVuLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCB1bm1vdW50Q2hpbGRyZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvbGRQcm9wcyAhPT0gRU1QVFlfT0JKKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvbGRQcm9wcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNSZXNlcnZlZFByb3Aoa2V5KSAmJiAhKGtleSBpbiBuZXdQcm9wcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9zdFBhdGNoUHJvcChlbCwga2V5LCBvbGRQcm9wc1trZXldLCBudWxsLCBpc1NWRywgdm5vZGUuY2hpbGRyZW4sIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIHVubW91bnRDaGlsZHJlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHByb2Nlc3NGcmFnbWVudCA9IChuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnRTdGFydEFuY2hvciA9IChuMi5lbCA9IG4xID8gbjEuZWwgOiBob3N0Q3JlYXRlVGV4dCgnJykpO1xyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50RW5kQW5jaG9yID0gKG4yLmFuY2hvciA9IG4xID8gbjEuYW5jaG9yIDogaG9zdENyZWF0ZVRleHQoJycpKTtcclxuICAgICAgICBsZXQgeyBwYXRjaEZsYWcsIGR5bmFtaWNDaGlsZHJlbiB9ID0gbjI7XHJcbiAgICAgICAgaWYgKHBhdGNoRmxhZyA+IDApIHtcclxuICAgICAgICAgICAgb3B0aW1pemVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBpc0htclVwZGF0aW5nKSB7XHJcbiAgICAgICAgICAgIC8vIEhNUiB1cGRhdGVkLCBmb3JjZSBmdWxsIGRpZmZcclxuICAgICAgICAgICAgcGF0Y2hGbGFnID0gMDtcclxuICAgICAgICAgICAgb3B0aW1pemVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGR5bmFtaWNDaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuMSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGhvc3RJbnNlcnQoZnJhZ21lbnRTdGFydEFuY2hvciwgY29udGFpbmVyLCBhbmNob3IpO1xyXG4gICAgICAgICAgICBob3N0SW5zZXJ0KGZyYWdtZW50RW5kQW5jaG9yLCBjb250YWluZXIsIGFuY2hvcik7XHJcbiAgICAgICAgICAgIC8vIGEgZnJhZ21lbnQgY2FuIG9ubHkgaGF2ZSBhcnJheSBjaGlsZHJlblxyXG4gICAgICAgICAgICAvLyBzaW5jZSB0aGV5IGFyZSBlaXRoZXIgZ2VuZXJhdGVkIGJ5IHRoZSBjb21waWxlciwgb3IgaW1wbGljaXRseSBjcmVhdGVkXHJcbiAgICAgICAgICAgIC8vIGZyb20gYXJyYXlzLlxyXG4gICAgICAgICAgICBtb3VudENoaWxkcmVuKG4yLmNoaWxkcmVuLCBjb250YWluZXIsIGZyYWdtZW50RW5kQW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwYXRjaEZsYWcgPiAwICYmXHJcbiAgICAgICAgICAgICAgICBwYXRjaEZsYWcgJiA2NCAvKiBTVEFCTEVfRlJBR01FTlQgKi8gJiZcclxuICAgICAgICAgICAgICAgIGR5bmFtaWNDaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgLy8gYSBzdGFibGUgZnJhZ21lbnQgKHRlbXBsYXRlIHJvb3Qgb3IgPHRlbXBsYXRlIHYtZm9yPikgZG9lc24ndCBuZWVkIHRvXHJcbiAgICAgICAgICAgICAgICAvLyBwYXRjaCBjaGlsZHJlbiBvcmRlciwgYnV0IGl0IG1heSBjb250YWluIGR5bmFtaWNDaGlsZHJlbi5cclxuICAgICAgICAgICAgICAgIHBhdGNoQmxvY2tDaGlsZHJlbihuMS5keW5hbWljQ2hpbGRyZW4sIGR5bmFtaWNDaGlsZHJlbiwgY29udGFpbmVyLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHBhcmVudENvbXBvbmVudCAmJiBwYXJlbnRDb21wb25lbnQudHlwZS5fX2htcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhdmVyc2VTdGF0aWNDaGlsZHJlbihuMSwgbjIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8ga2V5ZWQgLyB1bmtleWVkLCBvciBtYW51YWwgZnJhZ21lbnRzLlxyXG4gICAgICAgICAgICAgICAgLy8gZm9yIGtleWVkICYgdW5rZXllZCwgc2luY2UgdGhleSBhcmUgY29tcGlsZXIgZ2VuZXJhdGVkIGZyb20gdi1mb3IsXHJcbiAgICAgICAgICAgICAgICAvLyBlYWNoIGNoaWxkIGlzIGd1YXJhbnRlZWQgdG8gYmUgYSBibG9jayBzbyB0aGUgZnJhZ21lbnQgd2lsbCBuZXZlclxyXG4gICAgICAgICAgICAgICAgLy8gaGF2ZSBkeW5hbWljQ2hpbGRyZW4uXHJcbiAgICAgICAgICAgICAgICBwYXRjaENoaWxkcmVuKG4xLCBuMiwgY29udGFpbmVyLCBmcmFnbWVudEVuZEFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgcHJvY2Vzc0NvbXBvbmVudCA9IChuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKSA9PiB7XHJcbiAgICAgICAgaWYgKG4xID09IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKG4yLnNoYXBlRmxhZyAmIDUxMiAvKiBDT01QT05FTlRfS0VQVF9BTElWRSAqLykge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LmN0eC5hY3RpdmF0ZShuMiwgY29udGFpbmVyLCBhbmNob3IsIGlzU1ZHLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbW91bnRDb21wb25lbnQobjIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdXBkYXRlQ29tcG9uZW50KG4xLCBuMiwgb3B0aW1pemVkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgbW91bnRDb21wb25lbnQgPSAoaW5pdGlhbFZOb2RlLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gKGluaXRpYWxWTm9kZS5jb21wb25lbnQgPSBjcmVhdGVDb21wb25lbnRJbnN0YW5jZShpbml0aWFsVk5vZGUsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UpKTtcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGluc3RhbmNlLnR5cGUuX19obXJJZCkge1xyXG4gICAgICAgICAgICByZWdpc3RlckhNUihpbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgcHVzaFdhcm5pbmdDb250ZXh0KGluaXRpYWxWTm9kZSk7XHJcbiAgICAgICAgICAgIHN0YXJ0TWVhc3VyZShpbnN0YW5jZSwgYG1vdW50YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGluamVjdCByZW5kZXJlciBpbnRlcm5hbHMgZm9yIGtlZXBBbGl2ZVxyXG4gICAgICAgIGlmIChpc0tlZXBBbGl2ZShpbml0aWFsVk5vZGUpKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLmN0eC5yZW5kZXJlciA9IGludGVybmFscztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmVzb2x2ZSBwcm9wcyBhbmQgc2xvdHMgZm9yIHNldHVwIGNvbnRleHRcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0TWVhc3VyZShpbnN0YW5jZSwgYGluaXRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0dXBDb21wb25lbnQoaW5zdGFuY2UpO1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgZW5kTWVhc3VyZShpbnN0YW5jZSwgYGluaXRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0dXAoKSBpcyBhc3luYy4gVGhpcyBjb21wb25lbnQgcmVsaWVzIG9uIGFzeW5jIGxvZ2ljIHRvIGJlIHJlc29sdmVkXHJcbiAgICAgICAgLy8gYmVmb3JlIHByb2NlZWRpbmdcclxuICAgICAgICBpZiAoIGluc3RhbmNlLmFzeW5jRGVwKSB7XHJcbiAgICAgICAgICAgIGlmICghcGFyZW50U3VzcGVuc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpXHJcbiAgICAgICAgICAgICAgICAgICAgd2FybignYXN5bmMgc2V0dXAoKSBpcyB1c2VkIHdpdGhvdXQgYSBzdXNwZW5zZSBib3VuZGFyeSEnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXJlbnRTdXNwZW5zZS5yZWdpc3RlckRlcChpbnN0YW5jZSwgc2V0dXBSZW5kZXJFZmZlY3QpO1xyXG4gICAgICAgICAgICAvLyBHaXZlIGl0IGEgcGxhY2Vob2xkZXIgaWYgdGhpcyBpcyBub3QgaHlkcmF0aW9uXHJcbiAgICAgICAgICAgIGlmICghaW5pdGlhbFZOb2RlLmVsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IChpbnN0YW5jZS5zdWJUcmVlID0gY3JlYXRlVk5vZGUoQ29tbWVudCkpO1xyXG4gICAgICAgICAgICAgICAgcHJvY2Vzc0NvbW1lbnROb2RlKG51bGwsIHBsYWNlaG9sZGVyLCBjb250YWluZXIsIGFuY2hvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXR1cFJlbmRlckVmZmVjdChpbnN0YW5jZSwgaW5pdGlhbFZOb2RlLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgcG9wV2FybmluZ0NvbnRleHQoKTtcclxuICAgICAgICAgICAgZW5kTWVhc3VyZShpbnN0YW5jZSwgYG1vdW50YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHVwZGF0ZUNvbXBvbmVudCA9IChuMSwgbjIsIG9wdGltaXplZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gKG4yLmNvbXBvbmVudCA9IG4xLmNvbXBvbmVudCk7XHJcbiAgICAgICAgaWYgKHNob3VsZFVwZGF0ZUNvbXBvbmVudChuMSwgbjIsIG9wdGltaXplZCkpIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuYXN5bmNEZXAgJiZcclxuICAgICAgICAgICAgICAgICFpbnN0YW5jZS5hc3luY1Jlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhc3luYyAmIHN0aWxsIHBlbmRpbmcgLSBqdXN0IHVwZGF0ZSBwcm9wcyBhbmQgc2xvdHNcclxuICAgICAgICAgICAgICAgIC8vIHNpbmNlIHRoZSBjb21wb25lbnQncyByZWFjdGl2ZSBlZmZlY3QgZm9yIHJlbmRlciBpc24ndCBzZXQtdXAgeWV0XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHVzaFdhcm5pbmdDb250ZXh0KG4yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHVwZGF0ZUNvbXBvbmVudFByZVJlbmRlcihpbnN0YW5jZSwgbjIsIG9wdGltaXplZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wV2FybmluZ0NvbnRleHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vcm1hbCB1cGRhdGVcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLm5leHQgPSBuMjtcclxuICAgICAgICAgICAgICAgIC8vIGluIGNhc2UgdGhlIGNoaWxkIGNvbXBvbmVudCBpcyBhbHNvIHF1ZXVlZCwgcmVtb3ZlIGl0IHRvIGF2b2lkXHJcbiAgICAgICAgICAgICAgICAvLyBkb3VibGUgdXBkYXRpbmcgdGhlIHNhbWUgY2hpbGQgY29tcG9uZW50IGluIHRoZSBzYW1lIGZsdXNoLlxyXG4gICAgICAgICAgICAgICAgaW52YWxpZGF0ZUpvYihpbnN0YW5jZS51cGRhdGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gaW5zdGFuY2UudXBkYXRlIGlzIHRoZSByZWFjdGl2ZSBlZmZlY3QgcnVubmVyLlxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIG5vIHVwZGF0ZSBuZWVkZWQuIGp1c3QgY29weSBvdmVyIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgbjIuY29tcG9uZW50ID0gbjEuY29tcG9uZW50O1xyXG4gICAgICAgICAgICBuMi5lbCA9IG4xLmVsO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS52bm9kZSA9IG4yO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBjb25zdCBzZXR1cFJlbmRlckVmZmVjdCA9IChpbnN0YW5jZSwgaW5pdGlhbFZOb2RlLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQpID0+IHtcclxuICAgICAgICAvLyBjcmVhdGUgcmVhY3RpdmUgZWZmZWN0IGZvciByZW5kZXJpbmdcclxuICAgICAgICBpbnN0YW5jZS51cGRhdGUgPSBlZmZlY3QoZnVuY3Rpb24gY29tcG9uZW50RWZmZWN0KCkge1xyXG4gICAgICAgICAgICBpZiAoIWluc3RhbmNlLmlzTW91bnRlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZub2RlSG9vaztcclxuICAgICAgICAgICAgICAgIGNvbnN0IHsgZWwsIHByb3BzIH0gPSBpbml0aWFsVk5vZGU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IGJtLCBtLCBhLCBwYXJlbnQgfSA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0TWVhc3VyZShpbnN0YW5jZSwgYHJlbmRlcmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViVHJlZSA9IChpbnN0YW5jZS5zdWJUcmVlID0gcmVuZGVyQ29tcG9uZW50Um9vdChpbnN0YW5jZSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZE1lYXN1cmUoaW5zdGFuY2UsIGByZW5kZXJgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGJlZm9yZU1vdW50IGhvb2tcclxuICAgICAgICAgICAgICAgIGlmIChibSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGludm9rZUFycmF5Rm5zKGJtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIG9uVm5vZGVCZWZvcmVNb3VudFxyXG4gICAgICAgICAgICAgICAgaWYgKCh2bm9kZUhvb2sgPSBwcm9wcyAmJiBwcm9wcy5vblZub2RlQmVmb3JlTW91bnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgcGFyZW50LCBpbml0aWFsVk5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGVsICYmIGh5ZHJhdGVOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydE1lYXN1cmUoaW5zdGFuY2UsIGBoeWRyYXRlYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZub2RlIGhhcyBhZG9wdGVkIGhvc3Qgbm9kZSAtIHBlcmZvcm0gaHlkcmF0aW9uIGluc3RlYWQgb2YgbW91bnQuXHJcbiAgICAgICAgICAgICAgICAgICAgaHlkcmF0ZU5vZGUoaW5pdGlhbFZOb2RlLmVsLCBzdWJUcmVlLCBpbnN0YW5jZSwgcGFyZW50U3VzcGVuc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kTWVhc3VyZShpbnN0YW5jZSwgYGh5ZHJhdGVgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0TWVhc3VyZShpbnN0YW5jZSwgYHBhdGNoYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhdGNoKG51bGwsIHN1YlRyZWUsIGNvbnRhaW5lciwgYW5jaG9yLCBpbnN0YW5jZSwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZE1lYXN1cmUoaW5zdGFuY2UsIGBwYXRjaGApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsVk5vZGUuZWwgPSBzdWJUcmVlLmVsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gbW91bnRlZCBob29rXHJcbiAgICAgICAgICAgICAgICBpZiAobSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlUG9zdFJlbmRlckVmZmVjdChtLCBwYXJlbnRTdXNwZW5zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBvblZub2RlTW91bnRlZFxyXG4gICAgICAgICAgICAgICAgaWYgKCh2bm9kZUhvb2sgPSBwcm9wcyAmJiBwcm9wcy5vblZub2RlTW91bnRlZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZva2VWTm9kZUhvb2sodm5vZGVIb29rLCBwYXJlbnQsIGluaXRpYWxWTm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgcGFyZW50U3VzcGVuc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gYWN0aXZhdGVkIGhvb2sgZm9yIGtlZXAtYWxpdmUgcm9vdHMuXHJcbiAgICAgICAgICAgICAgICBpZiAoYSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxWTm9kZS5zaGFwZUZsYWcgJiAyNTYgLyogQ09NUE9ORU5UX1NIT1VMRF9LRUVQX0FMSVZFICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVldWVQb3N0UmVuZGVyRWZmZWN0KGEsIHBhcmVudFN1c3BlbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmlzTW91bnRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVDb21wb25lbnRcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgdHJpZ2dlcmVkIGJ5IG11dGF0aW9uIG9mIGNvbXBvbmVudCdzIG93biBzdGF0ZSAobmV4dDogbnVsbClcclxuICAgICAgICAgICAgICAgIC8vIE9SIHBhcmVudCBjYWxsaW5nIHByb2Nlc3NDb21wb25lbnQgKG5leHQ6IFZOb2RlKVxyXG4gICAgICAgICAgICAgICAgbGV0IHsgbmV4dCwgYnUsIHUsIHBhcmVudCwgdm5vZGUgfSA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgbGV0IG9yaWdpbk5leHQgPSBuZXh0O1xyXG4gICAgICAgICAgICAgICAgbGV0IHZub2RlSG9vaztcclxuICAgICAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBwdXNoV2FybmluZ0NvbnRleHQobmV4dCB8fCBpbnN0YW5jZS52bm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUNvbXBvbmVudFByZVJlbmRlcihpbnN0YW5jZSwgbmV4dCwgb3B0aW1pemVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHQgPSB2bm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydE1lYXN1cmUoaW5zdGFuY2UsIGByZW5kZXJgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRUcmVlID0gcmVuZGVyQ29tcG9uZW50Um9vdChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5kTWVhc3VyZShpbnN0YW5jZSwgYHJlbmRlcmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldlRyZWUgPSBpbnN0YW5jZS5zdWJUcmVlO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2Uuc3ViVHJlZSA9IG5leHRUcmVlO1xyXG4gICAgICAgICAgICAgICAgbmV4dC5lbCA9IHZub2RlLmVsO1xyXG4gICAgICAgICAgICAgICAgLy8gYmVmb3JlVXBkYXRlIGhvb2tcclxuICAgICAgICAgICAgICAgIGlmIChidSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGludm9rZUFycmF5Rm5zKGJ1KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIG9uVm5vZGVCZWZvcmVVcGRhdGVcclxuICAgICAgICAgICAgICAgIGlmICgodm5vZGVIb29rID0gbmV4dC5wcm9wcyAmJiBuZXh0LnByb3BzLm9uVm5vZGVCZWZvcmVVcGRhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgcGFyZW50LCBuZXh0LCB2bm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyByZXNldCByZWZzXHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IG5lZWRlZCBpZiBwcmV2aW91cyBwYXRjaCBoYWQgcmVmc1xyXG4gICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlLnJlZnMgIT09IEVNUFRZX09CSikge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLnJlZnMgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydE1lYXN1cmUoaW5zdGFuY2UsIGBwYXRjaGApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGF0Y2gocHJldlRyZWUsIG5leHRUcmVlLCBcclxuICAgICAgICAgICAgICAgIC8vIHBhcmVudCBtYXkgaGF2ZSBjaGFuZ2VkIGlmIGl0J3MgaW4gYSB0ZWxlcG9ydFxyXG4gICAgICAgICAgICAgICAgaG9zdFBhcmVudE5vZGUocHJldlRyZWUuZWwpLCBcclxuICAgICAgICAgICAgICAgIC8vIGFuY2hvciBtYXkgaGF2ZSBjaGFuZ2VkIGlmIGl0J3MgaW4gYSBmcmFnbWVudFxyXG4gICAgICAgICAgICAgICAgZ2V0TmV4dEhvc3ROb2RlKHByZXZUcmVlKSwgaW5zdGFuY2UsIHBhcmVudFN1c3BlbnNlLCBpc1NWRyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5kTWVhc3VyZShpbnN0YW5jZSwgYHBhdGNoYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBuZXh0LmVsID0gbmV4dFRyZWUuZWw7XHJcbiAgICAgICAgICAgICAgICBpZiAob3JpZ2luTmV4dCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNlbGYtdHJpZ2dlcmVkIHVwZGF0ZS4gSW4gY2FzZSBvZiBIT0MsIHVwZGF0ZSBwYXJlbnQgY29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdm5vZGUgZWwuIEhPQyBpcyBpbmRpY2F0ZWQgYnkgcGFyZW50IGluc3RhbmNlJ3Mgc3ViVHJlZSBwb2ludGluZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGNoaWxkIGNvbXBvbmVudCdzIHZub2RlXHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlSE9DSG9zdEVsKGluc3RhbmNlLCBuZXh0VHJlZS5lbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVkIGhvb2tcclxuICAgICAgICAgICAgICAgIGlmICh1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVldWVQb3N0UmVuZGVyRWZmZWN0KHUsIHBhcmVudFN1c3BlbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIG9uVm5vZGVVcGRhdGVkXHJcbiAgICAgICAgICAgICAgICBpZiAoKHZub2RlSG9vayA9IG5leHQucHJvcHMgJiYgbmV4dC5wcm9wcy5vblZub2RlVXBkYXRlZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZva2VWTm9kZUhvb2sodm5vZGVIb29rLCBwYXJlbnQsIG5leHQsIHZub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCBwYXJlbnRTdXNwZW5zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wV2FybmluZ0NvbnRleHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRVcGRhdGVkKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSA/IGNyZWF0ZURldkVmZmVjdE9wdGlvbnMoaW5zdGFuY2UpIDogcHJvZEVmZmVjdE9wdGlvbnMpO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHVwZGF0ZUNvbXBvbmVudFByZVJlbmRlciA9IChpbnN0YW5jZSwgbmV4dFZOb2RlLCBvcHRpbWl6ZWQpID0+IHtcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGluc3RhbmNlLnR5cGUuX19obXJJZCkge1xyXG4gICAgICAgICAgICBvcHRpbWl6ZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dFZOb2RlLmNvbXBvbmVudCA9IGluc3RhbmNlO1xyXG4gICAgICAgIGNvbnN0IHByZXZQcm9wcyA9IGluc3RhbmNlLnZub2RlLnByb3BzO1xyXG4gICAgICAgIGluc3RhbmNlLnZub2RlID0gbmV4dFZOb2RlO1xyXG4gICAgICAgIGluc3RhbmNlLm5leHQgPSBudWxsO1xyXG4gICAgICAgIHVwZGF0ZVByb3BzKGluc3RhbmNlLCBuZXh0Vk5vZGUucHJvcHMsIHByZXZQcm9wcywgb3B0aW1pemVkKTtcclxuICAgICAgICB1cGRhdGVTbG90cyhpbnN0YW5jZSwgbmV4dFZOb2RlLmNoaWxkcmVuKTtcclxuICAgIH07XHJcbiAgICBjb25zdCBwYXRjaENoaWxkcmVuID0gKG4xLCBuMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGMxID0gbjEgJiYgbjEuY2hpbGRyZW47XHJcbiAgICAgICAgY29uc3QgcHJldlNoYXBlRmxhZyA9IG4xID8gbjEuc2hhcGVGbGFnIDogMDtcclxuICAgICAgICBjb25zdCBjMiA9IG4yLmNoaWxkcmVuO1xyXG4gICAgICAgIGNvbnN0IHsgcGF0Y2hGbGFnLCBzaGFwZUZsYWcgfSA9IG4yO1xyXG4gICAgICAgIC8vIGZhc3QgcGF0aFxyXG4gICAgICAgIGlmIChwYXRjaEZsYWcgPiAwKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXRjaEZsYWcgJiAxMjggLyogS0VZRURfRlJBR01FTlQgKi8pIHtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgY291bGQgYmUgZWl0aGVyIGZ1bGx5LWtleWVkIG9yIG1peGVkIChzb21lIGtleWVkIHNvbWUgbm90KVxyXG4gICAgICAgICAgICAgICAgLy8gcHJlc2VuY2Ugb2YgcGF0Y2hGbGFnIG1lYW5zIGNoaWxkcmVuIGFyZSBndWFyYW50ZWVkIHRvIGJlIGFycmF5c1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hLZXllZENoaWxkcmVuKGMxLCBjMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBhdGNoRmxhZyAmIDI1NiAvKiBVTktFWUVEX0ZSQUdNRU5UICovKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1bmtleWVkXHJcbiAgICAgICAgICAgICAgICBwYXRjaFVua2V5ZWRDaGlsZHJlbihjMSwgYzIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjaGlsZHJlbiBoYXMgMyBwb3NzaWJpbGl0aWVzOiB0ZXh0LCBhcnJheSBvciBubyBjaGlsZHJlbi5cclxuICAgICAgICBpZiAoc2hhcGVGbGFnICYgOCAvKiBURVhUX0NISUxEUkVOICovKSB7XHJcbiAgICAgICAgICAgIC8vIHRleHQgY2hpbGRyZW4gZmFzdCBwYXRoXHJcbiAgICAgICAgICAgIGlmIChwcmV2U2hhcGVGbGFnICYgMTYgLyogQVJSQVlfQ0hJTERSRU4gKi8pIHtcclxuICAgICAgICAgICAgICAgIHVubW91bnRDaGlsZHJlbihjMSwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGMyICE9PSBjMSkge1xyXG4gICAgICAgICAgICAgICAgaG9zdFNldEVsZW1lbnRUZXh0KGNvbnRhaW5lciwgYzIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocHJldlNoYXBlRmxhZyAmIDE2IC8qIEFSUkFZX0NISUxEUkVOICovKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBwcmV2IGNoaWxkcmVuIHdhcyBhcnJheVxyXG4gICAgICAgICAgICAgICAgaWYgKHNoYXBlRmxhZyAmIDE2IC8qIEFSUkFZX0NISUxEUkVOICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdHdvIGFycmF5cywgY2Fubm90IGFzc3VtZSBhbnl0aGluZywgZG8gZnVsbCBkaWZmXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2hLZXllZENoaWxkcmVuKGMxLCBjMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm8gbmV3IGNoaWxkcmVuLCBqdXN0IHVubW91bnQgb2xkXHJcbiAgICAgICAgICAgICAgICAgICAgdW5tb3VudENoaWxkcmVuKGMxLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHByZXYgY2hpbGRyZW4gd2FzIHRleHQgT1IgbnVsbFxyXG4gICAgICAgICAgICAgICAgLy8gbmV3IGNoaWxkcmVuIGlzIGFycmF5IE9SIG51bGxcclxuICAgICAgICAgICAgICAgIGlmIChwcmV2U2hhcGVGbGFnICYgOCAvKiBURVhUX0NISUxEUkVOICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaG9zdFNldEVsZW1lbnRUZXh0KGNvbnRhaW5lciwgJycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gbW91bnQgbmV3IGlmIGFycmF5XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hhcGVGbGFnICYgMTYgLyogQVJSQVlfQ0hJTERSRU4gKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICBtb3VudENoaWxkcmVuKGMyLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgcGF0Y2hVbmtleWVkQ2hpbGRyZW4gPSAoYzEsIGMyLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCkgPT4ge1xyXG4gICAgICAgIGMxID0gYzEgfHwgRU1QVFlfQVJSO1xyXG4gICAgICAgIGMyID0gYzIgfHwgRU1QVFlfQVJSO1xyXG4gICAgICAgIGNvbnN0IG9sZExlbmd0aCA9IGMxLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBuZXdMZW5ndGggPSBjMi5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgY29tbW9uTGVuZ3RoID0gTWF0aC5taW4ob2xkTGVuZ3RoLCBuZXdMZW5ndGgpO1xyXG4gICAgICAgIGxldCBpO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb21tb25MZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0Q2hpbGQgPSAoYzJbaV0gPSBvcHRpbWl6ZWRcclxuICAgICAgICAgICAgICAgID8gY2xvbmVJZk1vdW50ZWQoYzJbaV0pXHJcbiAgICAgICAgICAgICAgICA6IG5vcm1hbGl6ZVZOb2RlKGMyW2ldKSk7XHJcbiAgICAgICAgICAgIHBhdGNoKGMxW2ldLCBuZXh0Q2hpbGQsIGNvbnRhaW5lciwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvbGRMZW5ndGggPiBuZXdMZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gcmVtb3ZlIG9sZFxyXG4gICAgICAgICAgICB1bm1vdW50Q2hpbGRyZW4oYzEsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIHRydWUsIGNvbW1vbkxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBtb3VudCBuZXdcclxuICAgICAgICAgICAgbW91bnRDaGlsZHJlbihjMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBvcHRpbWl6ZWQsIGNvbW1vbkxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vIGNhbiBiZSBhbGwta2V5ZWQgb3IgbWl4ZWRcclxuICAgIGNvbnN0IHBhdGNoS2V5ZWRDaGlsZHJlbiA9IChjMSwgYzIsIGNvbnRhaW5lciwgcGFyZW50QW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKSA9PiB7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGNvbnN0IGwyID0gYzIubGVuZ3RoO1xyXG4gICAgICAgIGxldCBlMSA9IGMxLmxlbmd0aCAtIDE7IC8vIHByZXYgZW5kaW5nIGluZGV4XHJcbiAgICAgICAgbGV0IGUyID0gbDIgLSAxOyAvLyBuZXh0IGVuZGluZyBpbmRleFxyXG4gICAgICAgIC8vIDEuIHN5bmMgZnJvbSBzdGFydFxyXG4gICAgICAgIC8vIChhIGIpIGNcclxuICAgICAgICAvLyAoYSBiKSBkIGVcclxuICAgICAgICB3aGlsZSAoaSA8PSBlMSAmJiBpIDw9IGUyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG4xID0gYzFbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IG4yID0gKGMyW2ldID0gb3B0aW1pemVkXHJcbiAgICAgICAgICAgICAgICA/IGNsb25lSWZNb3VudGVkKGMyW2ldKVxyXG4gICAgICAgICAgICAgICAgOiBub3JtYWxpemVWTm9kZShjMltpXSkpO1xyXG4gICAgICAgICAgICBpZiAoaXNTYW1lVk5vZGVUeXBlKG4xLCBuMikpIHtcclxuICAgICAgICAgICAgICAgIHBhdGNoKG4xLCBuMiwgY29udGFpbmVyLCBudWxsLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gMi4gc3luYyBmcm9tIGVuZFxyXG4gICAgICAgIC8vIGEgKGIgYylcclxuICAgICAgICAvLyBkIGUgKGIgYylcclxuICAgICAgICB3aGlsZSAoaSA8PSBlMSAmJiBpIDw9IGUyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG4xID0gYzFbZTFdO1xyXG4gICAgICAgICAgICBjb25zdCBuMiA9IChjMltlMl0gPSBvcHRpbWl6ZWRcclxuICAgICAgICAgICAgICAgID8gY2xvbmVJZk1vdW50ZWQoYzJbZTJdKVxyXG4gICAgICAgICAgICAgICAgOiBub3JtYWxpemVWTm9kZShjMltlMl0pKTtcclxuICAgICAgICAgICAgaWYgKGlzU2FtZVZOb2RlVHlwZShuMSwgbjIpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRjaChuMSwgbjIsIGNvbnRhaW5lciwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlMS0tO1xyXG4gICAgICAgICAgICBlMi0tO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAzLiBjb21tb24gc2VxdWVuY2UgKyBtb3VudFxyXG4gICAgICAgIC8vIChhIGIpXHJcbiAgICAgICAgLy8gKGEgYikgY1xyXG4gICAgICAgIC8vIGkgPSAyLCBlMSA9IDEsIGUyID0gMlxyXG4gICAgICAgIC8vIChhIGIpXHJcbiAgICAgICAgLy8gYyAoYSBiKVxyXG4gICAgICAgIC8vIGkgPSAwLCBlMSA9IC0xLCBlMiA9IDBcclxuICAgICAgICBpZiAoaSA+IGUxKSB7XHJcbiAgICAgICAgICAgIGlmIChpIDw9IGUyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0UG9zID0gZTIgKyAxO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYW5jaG9yID0gbmV4dFBvcyA8IGwyID8gYzJbbmV4dFBvc10uZWwgOiBwYXJlbnRBbmNob3I7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoaSA8PSBlMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGNoKG51bGwsIChjMltpXSA9IG9wdGltaXplZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGNsb25lSWZNb3VudGVkKGMyW2ldKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG5vcm1hbGl6ZVZOb2RlKGMyW2ldKSksIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIDQuIGNvbW1vbiBzZXF1ZW5jZSArIHVubW91bnRcclxuICAgICAgICAvLyAoYSBiKSBjXHJcbiAgICAgICAgLy8gKGEgYilcclxuICAgICAgICAvLyBpID0gMiwgZTEgPSAyLCBlMiA9IDFcclxuICAgICAgICAvLyBhIChiIGMpXHJcbiAgICAgICAgLy8gKGIgYylcclxuICAgICAgICAvLyBpID0gMCwgZTEgPSAwLCBlMiA9IC0xXHJcbiAgICAgICAgZWxzZSBpZiAoaSA+IGUyKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDw9IGUxKSB7XHJcbiAgICAgICAgICAgICAgICB1bm1vdW50KGMxW2ldLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyA1LiB1bmtub3duIHNlcXVlbmNlXHJcbiAgICAgICAgLy8gW2kgLi4uIGUxICsgMV06IGEgYiBbYyBkIGVdIGYgZ1xyXG4gICAgICAgIC8vIFtpIC4uLiBlMiArIDFdOiBhIGIgW2UgZCBjIGhdIGYgZ1xyXG4gICAgICAgIC8vIGkgPSAyLCBlMSA9IDQsIGUyID0gNVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBzMSA9IGk7IC8vIHByZXYgc3RhcnRpbmcgaW5kZXhcclxuICAgICAgICAgICAgY29uc3QgczIgPSBpOyAvLyBuZXh0IHN0YXJ0aW5nIGluZGV4XHJcbiAgICAgICAgICAgIC8vIDUuMSBidWlsZCBrZXk6aW5kZXggbWFwIGZvciBuZXdDaGlsZHJlblxyXG4gICAgICAgICAgICBjb25zdCBrZXlUb05ld0luZGV4TWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSBzMjsgaSA8PSBlMjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0Q2hpbGQgPSAoYzJbaV0gPSBvcHRpbWl6ZWRcclxuICAgICAgICAgICAgICAgICAgICA/IGNsb25lSWZNb3VudGVkKGMyW2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIDogbm9ybWFsaXplVk5vZGUoYzJbaV0pKTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0Q2hpbGQua2V5ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGtleVRvTmV3SW5kZXhNYXAuaGFzKG5leHRDaGlsZC5rZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm4oYER1cGxpY2F0ZSBrZXlzIGZvdW5kIGR1cmluZyB1cGRhdGU6YCwgSlNPTi5zdHJpbmdpZnkobmV4dENoaWxkLmtleSksIGBNYWtlIHN1cmUga2V5cyBhcmUgdW5pcXVlLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBrZXlUb05ld0luZGV4TWFwLnNldChuZXh0Q2hpbGQua2V5LCBpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyA1LjIgbG9vcCB0aHJvdWdoIG9sZCBjaGlsZHJlbiBsZWZ0IHRvIGJlIHBhdGNoZWQgYW5kIHRyeSB0byBwYXRjaFxyXG4gICAgICAgICAgICAvLyBtYXRjaGluZyBub2RlcyAmIHJlbW92ZSBub2RlcyB0aGF0IGFyZSBubyBsb25nZXIgcHJlc2VudFxyXG4gICAgICAgICAgICBsZXQgajtcclxuICAgICAgICAgICAgbGV0IHBhdGNoZWQgPSAwO1xyXG4gICAgICAgICAgICBjb25zdCB0b0JlUGF0Y2hlZCA9IGUyIC0gczIgKyAxO1xyXG4gICAgICAgICAgICBsZXQgbW92ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgLy8gdXNlZCB0byB0cmFjayB3aGV0aGVyIGFueSBub2RlIGhhcyBtb3ZlZFxyXG4gICAgICAgICAgICBsZXQgbWF4TmV3SW5kZXhTb0ZhciA9IDA7XHJcbiAgICAgICAgICAgIC8vIHdvcmtzIGFzIE1hcDxuZXdJbmRleCwgb2xkSW5kZXg+XHJcbiAgICAgICAgICAgIC8vIE5vdGUgdGhhdCBvbGRJbmRleCBpcyBvZmZzZXQgYnkgKzFcclxuICAgICAgICAgICAgLy8gYW5kIG9sZEluZGV4ID0gMCBpcyBhIHNwZWNpYWwgdmFsdWUgaW5kaWNhdGluZyB0aGUgbmV3IG5vZGUgaGFzXHJcbiAgICAgICAgICAgIC8vIG5vIGNvcnJlc3BvbmRpbmcgb2xkIG5vZGUuXHJcbiAgICAgICAgICAgIC8vIHVzZWQgZm9yIGRldGVybWluaW5nIGxvbmdlc3Qgc3RhYmxlIHN1YnNlcXVlbmNlXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0luZGV4VG9PbGRJbmRleE1hcCA9IG5ldyBBcnJheSh0b0JlUGF0Y2hlZCk7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b0JlUGF0Y2hlZDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgbmV3SW5kZXhUb09sZEluZGV4TWFwW2ldID0gMDtcclxuICAgICAgICAgICAgZm9yIChpID0gczE7IGkgPD0gZTE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldkNoaWxkID0gYzFbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0Y2hlZCA+PSB0b0JlUGF0Y2hlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsbCBuZXcgY2hpbGRyZW4gaGF2ZSBiZWVuIHBhdGNoZWQgc28gdGhpcyBjYW4gb25seSBiZSBhIHJlbW92YWxcclxuICAgICAgICAgICAgICAgICAgICB1bm1vdW50KHByZXZDaGlsZCwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3SW5kZXg7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJldkNoaWxkLmtleSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3SW5kZXggPSBrZXlUb05ld0luZGV4TWFwLmdldChwcmV2Q2hpbGQua2V5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGtleS1sZXNzIG5vZGUsIHRyeSB0byBsb2NhdGUgYSBrZXktbGVzcyBub2RlIG9mIHRoZSBzYW1lIHR5cGVcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSBzMjsgaiA8PSBlMjsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdJbmRleFRvT2xkSW5kZXhNYXBbaiAtIHMyXSA9PT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTYW1lVk5vZGVUeXBlKHByZXZDaGlsZCwgYzJbal0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdJbmRleCA9IGo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChuZXdJbmRleCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5tb3VudChwcmV2Q2hpbGQsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3SW5kZXhUb09sZEluZGV4TWFwW25ld0luZGV4IC0gczJdID0gaSArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0luZGV4ID49IG1heE5ld0luZGV4U29GYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4TmV3SW5kZXhTb0ZhciA9IG5ld0luZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwYXRjaChwcmV2Q2hpbGQsIGMyW25ld0luZGV4XSwgY29udGFpbmVyLCBudWxsLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgb3B0aW1pemVkKTtcclxuICAgICAgICAgICAgICAgICAgICBwYXRjaGVkKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gNS4zIG1vdmUgYW5kIG1vdW50XHJcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIGxvbmdlc3Qgc3RhYmxlIHN1YnNlcXVlbmNlIG9ubHkgd2hlbiBub2RlcyBoYXZlIG1vdmVkXHJcbiAgICAgICAgICAgIGNvbnN0IGluY3JlYXNpbmdOZXdJbmRleFNlcXVlbmNlID0gbW92ZWRcclxuICAgICAgICAgICAgICAgID8gZ2V0U2VxdWVuY2UobmV3SW5kZXhUb09sZEluZGV4TWFwKVxyXG4gICAgICAgICAgICAgICAgOiBFTVBUWV9BUlI7XHJcbiAgICAgICAgICAgIGogPSBpbmNyZWFzaW5nTmV3SW5kZXhTZXF1ZW5jZS5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAvLyBsb29waW5nIGJhY2t3YXJkcyBzbyB0aGF0IHdlIGNhbiB1c2UgbGFzdCBwYXRjaGVkIG5vZGUgYXMgYW5jaG9yXHJcbiAgICAgICAgICAgIGZvciAoaSA9IHRvQmVQYXRjaGVkIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRJbmRleCA9IHMyICsgaTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRDaGlsZCA9IGMyW25leHRJbmRleF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhbmNob3IgPSBuZXh0SW5kZXggKyAxIDwgbDIgPyBjMltuZXh0SW5kZXggKyAxXS5lbCA6IHBhcmVudEFuY2hvcjtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdJbmRleFRvT2xkSW5kZXhNYXBbaV0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBtb3VudCBuZXdcclxuICAgICAgICAgICAgICAgICAgICBwYXRjaChudWxsLCBuZXh0Q2hpbGQsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtb3ZlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vdmUgaWY6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlcmUgaXMgbm8gc3RhYmxlIHN1YnNlcXVlbmNlIChlLmcuIGEgcmV2ZXJzZSlcclxuICAgICAgICAgICAgICAgICAgICAvLyBPUiBjdXJyZW50IG5vZGUgaXMgbm90IGFtb25nIHRoZSBzdGFibGUgc2VxdWVuY2VcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaiA8IDAgfHwgaSAhPT0gaW5jcmVhc2luZ05ld0luZGV4U2VxdWVuY2Vbal0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZShuZXh0Q2hpbGQsIGNvbnRhaW5lciwgYW5jaG9yLCAyIC8qIFJFT1JERVIgKi8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgai0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBjb25zdCBtb3ZlID0gKHZub2RlLCBjb250YWluZXIsIGFuY2hvciwgbW92ZVR5cGUsIHBhcmVudFN1c3BlbnNlID0gbnVsbCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgZWwsIHR5cGUsIHRyYW5zaXRpb24sIGNoaWxkcmVuLCBzaGFwZUZsYWcgfSA9IHZub2RlO1xyXG4gICAgICAgIGlmIChzaGFwZUZsYWcgJiA2IC8qIENPTVBPTkVOVCAqLykge1xyXG4gICAgICAgICAgICBtb3ZlKHZub2RlLmNvbXBvbmVudC5zdWJUcmVlLCBjb250YWluZXIsIGFuY2hvciwgbW92ZVR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc2hhcGVGbGFnICYgMTI4IC8qIFNVU1BFTlNFICovKSB7XHJcbiAgICAgICAgICAgIHZub2RlLnN1c3BlbnNlLm1vdmUoY29udGFpbmVyLCBhbmNob3IsIG1vdmVUeXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hhcGVGbGFnICYgNjQgLyogVEVMRVBPUlQgKi8pIHtcclxuICAgICAgICAgICAgdHlwZS5tb3ZlKHZub2RlLCBjb250YWluZXIsIGFuY2hvciwgaW50ZXJuYWxzKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSA9PT0gRnJhZ21lbnQpIHtcclxuICAgICAgICAgICAgaG9zdEluc2VydChlbCwgY29udGFpbmVyLCBhbmNob3IpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBtb3ZlKGNoaWxkcmVuW2ldLCBjb250YWluZXIsIGFuY2hvciwgbW92ZVR5cGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhvc3RJbnNlcnQodm5vZGUuYW5jaG9yLCBjb250YWluZXIsIGFuY2hvcik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc3RhdGljIG5vZGUgbW92ZSBjYW4gb25seSBoYXBwZW4gd2hlbiBmb3JjZSB1cGRhdGluZyBITVJcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHR5cGUgPT09IFN0YXRpYykge1xyXG4gICAgICAgICAgICBtb3ZlU3RhdGljTm9kZSh2bm9kZSwgY29udGFpbmVyLCBhbmNob3IpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNpbmdsZSBub2Rlc1xyXG4gICAgICAgIGNvbnN0IG5lZWRUcmFuc2l0aW9uID0gbW92ZVR5cGUgIT09IDIgLyogUkVPUkRFUiAqLyAmJlxyXG4gICAgICAgICAgICBzaGFwZUZsYWcgJiAxIC8qIEVMRU1FTlQgKi8gJiZcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjtcclxuICAgICAgICBpZiAobmVlZFRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgaWYgKG1vdmVUeXBlID09PSAwIC8qIEVOVEVSICovKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLmJlZm9yZUVudGVyKGVsKTtcclxuICAgICAgICAgICAgICAgIGhvc3RJbnNlcnQoZWwsIGNvbnRhaW5lciwgYW5jaG9yKTtcclxuICAgICAgICAgICAgICAgIHF1ZXVlUG9zdFJlbmRlckVmZmVjdCgoKSA9PiB0cmFuc2l0aW9uLmVudGVyKGVsKSwgcGFyZW50U3VzcGVuc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeyBsZWF2ZSwgZGVsYXlMZWF2ZSwgYWZ0ZXJMZWF2ZSB9ID0gdHJhbnNpdGlvbjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9ICgpID0+IGhvc3RJbnNlcnQoZWwsIGNvbnRhaW5lciwgYW5jaG9yKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBlcmZvcm1MZWF2ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZWF2ZShlbCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJMZWF2ZSAmJiBhZnRlckxlYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlbGF5TGVhdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxheUxlYXZlKGVsLCByZW1vdmUsIHBlcmZvcm1MZWF2ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwZXJmb3JtTGVhdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaG9zdEluc2VydChlbCwgY29udGFpbmVyLCBhbmNob3IpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBjb25zdCB1bm1vdW50ID0gKHZub2RlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBkb1JlbW92ZSA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB0eXBlLCBwcm9wcywgcmVmLCBjaGlsZHJlbiwgZHluYW1pY0NoaWxkcmVuLCBzaGFwZUZsYWcsIHBhdGNoRmxhZywgZGlycyB9ID0gdm5vZGU7XHJcbiAgICAgICAgLy8gdW5zZXQgcmVmXHJcbiAgICAgICAgaWYgKHJlZiAhPSBudWxsICYmIHBhcmVudENvbXBvbmVudCkge1xyXG4gICAgICAgICAgICBzZXRSZWYocmVmLCBudWxsLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNoYXBlRmxhZyAmIDI1NiAvKiBDT01QT05FTlRfU0hPVUxEX0tFRVBfQUxJVkUgKi8pIHtcclxuICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LmN0eC5kZWFjdGl2YXRlKHZub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzaG91bGRJbnZva2VEaXJzID0gc2hhcGVGbGFnICYgMSAvKiBFTEVNRU5UICovICYmIGRpcnM7XHJcbiAgICAgICAgbGV0IHZub2RlSG9vaztcclxuICAgICAgICBpZiAoKHZub2RlSG9vayA9IHByb3BzICYmIHByb3BzLm9uVm5vZGVCZWZvcmVVbm1vdW50KSkge1xyXG4gICAgICAgICAgICBpbnZva2VWTm9kZUhvb2sodm5vZGVIb29rLCBwYXJlbnRDb21wb25lbnQsIHZub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNoYXBlRmxhZyAmIDYgLyogQ09NUE9ORU5UICovKSB7XHJcbiAgICAgICAgICAgIHVubW91bnRDb21wb25lbnQodm5vZGUuY29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgZG9SZW1vdmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCBzaGFwZUZsYWcgJiAxMjggLyogU1VTUEVOU0UgKi8pIHtcclxuICAgICAgICAgICAgICAgIHZub2RlLnN1c3BlbnNlLnVubW91bnQocGFyZW50U3VzcGVuc2UsIGRvUmVtb3ZlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2hvdWxkSW52b2tlRGlycykge1xyXG4gICAgICAgICAgICAgICAgaW52b2tlRGlyZWN0aXZlSG9vayh2bm9kZSwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCAnYmVmb3JlVW5tb3VudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkeW5hbWljQ2hpbGRyZW4gJiZcclxuICAgICAgICAgICAgICAgIC8vICMxMTUzOiBmYXN0IHBhdGggc2hvdWxkIG5vdCBiZSB0YWtlbiBmb3Igbm9uLXN0YWJsZSAodi1mb3IpIGZyYWdtZW50c1xyXG4gICAgICAgICAgICAgICAgKHR5cGUgIT09IEZyYWdtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKHBhdGNoRmxhZyA+IDAgJiYgcGF0Y2hGbGFnICYgNjQgLyogU1RBQkxFX0ZSQUdNRU5UICovKSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGZhc3QgcGF0aCBmb3IgYmxvY2sgbm9kZXM6IG9ubHkgbmVlZCB0byB1bm1vdW50IGR5bmFtaWMgY2hpbGRyZW4uXHJcbiAgICAgICAgICAgICAgICB1bm1vdW50Q2hpbGRyZW4oZHluYW1pY0NoaWxkcmVuLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChzaGFwZUZsYWcgJiAxNiAvKiBBUlJBWV9DSElMRFJFTiAqLykge1xyXG4gICAgICAgICAgICAgICAgdW5tb3VudENoaWxkcmVuKGNoaWxkcmVuLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhbiB1bm1vdW50ZWQgdGVsZXBvcnQgc2hvdWxkIGFsd2F5cyByZW1vdmUgaXRzIGNoaWxkcmVuXHJcbiAgICAgICAgICAgIGlmIChzaGFwZUZsYWcgJiA2NCAvKiBURUxFUE9SVCAqLykge1xyXG4gICAgICAgICAgICAgICAgdm5vZGUudHlwZS5yZW1vdmUodm5vZGUsIGludGVybmFscyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRvUmVtb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmUodm5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgodm5vZGVIb29rID0gcHJvcHMgJiYgcHJvcHMub25Wbm9kZVVubW91bnRlZCkgfHwgc2hvdWxkSW52b2tlRGlycykge1xyXG4gICAgICAgICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdm5vZGVIb29rICYmIGludm9rZVZOb2RlSG9vayh2bm9kZUhvb2ssIHBhcmVudENvbXBvbmVudCwgdm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgc2hvdWxkSW52b2tlRGlycyAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGludm9rZURpcmVjdGl2ZUhvb2sodm5vZGUsIG51bGwsIHBhcmVudENvbXBvbmVudCwgJ3VubW91bnRlZCcpO1xyXG4gICAgICAgICAgICB9LCBwYXJlbnRTdXNwZW5zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlbW92ZSA9IHZub2RlID0+IHtcclxuICAgICAgICBjb25zdCB7IHR5cGUsIGVsLCBhbmNob3IsIHRyYW5zaXRpb24gfSA9IHZub2RlO1xyXG4gICAgICAgIGlmICh0eXBlID09PSBGcmFnbWVudCkge1xyXG4gICAgICAgICAgICByZW1vdmVGcmFnbWVudChlbCwgYW5jaG9yKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHR5cGUgPT09IFN0YXRpYykge1xyXG4gICAgICAgICAgICByZW1vdmVTdGF0aWNOb2RlKHZub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwZXJmb3JtUmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBob3N0UmVtb3ZlKGVsKTtcclxuICAgICAgICAgICAgaWYgKHRyYW5zaXRpb24gJiYgIXRyYW5zaXRpb24ucGVyc2lzdGVkICYmIHRyYW5zaXRpb24uYWZ0ZXJMZWF2ZSkge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbi5hZnRlckxlYXZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICh2bm9kZS5zaGFwZUZsYWcgJiAxIC8qIEVMRU1FTlQgKi8gJiZcclxuICAgICAgICAgICAgdHJhbnNpdGlvbiAmJlxyXG4gICAgICAgICAgICAhdHJhbnNpdGlvbi5wZXJzaXN0ZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBsZWF2ZSwgZGVsYXlMZWF2ZSB9ID0gdHJhbnNpdGlvbjtcclxuICAgICAgICAgICAgY29uc3QgcGVyZm9ybUxlYXZlID0gKCkgPT4gbGVhdmUoZWwsIHBlcmZvcm1SZW1vdmUpO1xyXG4gICAgICAgICAgICBpZiAoZGVsYXlMZWF2ZSkge1xyXG4gICAgICAgICAgICAgICAgZGVsYXlMZWF2ZSh2bm9kZS5lbCwgcGVyZm9ybVJlbW92ZSwgcGVyZm9ybUxlYXZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBlcmZvcm1MZWF2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwZXJmb3JtUmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlbW92ZUZyYWdtZW50ID0gKGN1ciwgZW5kKSA9PiB7XHJcbiAgICAgICAgLy8gRm9yIGZyYWdtZW50cywgZGlyZWN0bHkgcmVtb3ZlIGFsbCBjb250YWluZWQgRE9NIG5vZGVzLlxyXG4gICAgICAgIC8vIChmcmFnbWVudCBjaGlsZCBub2RlcyBjYW5ub3QgaGF2ZSB0cmFuc2l0aW9uKVxyXG4gICAgICAgIGxldCBuZXh0O1xyXG4gICAgICAgIHdoaWxlIChjdXIgIT09IGVuZCkge1xyXG4gICAgICAgICAgICBuZXh0ID0gaG9zdE5leHRTaWJsaW5nKGN1cik7XHJcbiAgICAgICAgICAgIGhvc3RSZW1vdmUoY3VyKTtcclxuICAgICAgICAgICAgY3VyID0gbmV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaG9zdFJlbW92ZShlbmQpO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHVubW91bnRDb21wb25lbnQgPSAoaW5zdGFuY2UsIHBhcmVudFN1c3BlbnNlLCBkb1JlbW92ZSkgPT4ge1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgaW5zdGFuY2UudHlwZS5fX2htcklkKSB7XHJcbiAgICAgICAgICAgIHVucmVnaXN0ZXJITVIoaW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB7IGJ1bSwgZWZmZWN0cywgdXBkYXRlLCBzdWJUcmVlLCB1bSwgZGEsIGlzRGVhY3RpdmF0ZWQgfSA9IGluc3RhbmNlO1xyXG4gICAgICAgIC8vIGJlZm9yZVVubW91bnQgaG9va1xyXG4gICAgICAgIGlmIChidW0pIHtcclxuICAgICAgICAgICAgaW52b2tlQXJyYXlGbnMoYnVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVmZmVjdHMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlZmZlY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBzdG9wKGVmZmVjdHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHVwZGF0ZSBtYXkgYmUgbnVsbCBpZiBhIGNvbXBvbmVudCBpcyB1bm1vdW50ZWQgYmVmb3JlIGl0cyBhc3luY1xyXG4gICAgICAgIC8vIHNldHVwIGhhcyByZXNvbHZlZC5cclxuICAgICAgICBpZiAodXBkYXRlKSB7XHJcbiAgICAgICAgICAgIHN0b3AodXBkYXRlKTtcclxuICAgICAgICAgICAgdW5tb3VudChzdWJUcmVlLCBpbnN0YW5jZSwgcGFyZW50U3VzcGVuc2UsIGRvUmVtb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdW5tb3VudGVkIGhvb2tcclxuICAgICAgICBpZiAodW0pIHtcclxuICAgICAgICAgICAgcXVldWVQb3N0UmVuZGVyRWZmZWN0KHVtLCBwYXJlbnRTdXNwZW5zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGRlYWN0aXZhdGVkIGhvb2tcclxuICAgICAgICBpZiAoZGEgJiZcclxuICAgICAgICAgICAgIWlzRGVhY3RpdmF0ZWQgJiZcclxuICAgICAgICAgICAgaW5zdGFuY2Uudm5vZGUuc2hhcGVGbGFnICYgMjU2IC8qIENPTVBPTkVOVF9TSE9VTERfS0VFUF9BTElWRSAqLykge1xyXG4gICAgICAgICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoZGEsIHBhcmVudFN1c3BlbnNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcXVldWVQb3N0UmVuZGVyRWZmZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2UuaXNVbm1vdW50ZWQgPSB0cnVlO1xyXG4gICAgICAgIH0sIHBhcmVudFN1c3BlbnNlKTtcclxuICAgICAgICAvLyBBIGNvbXBvbmVudCB3aXRoIGFzeW5jIGRlcCBpbnNpZGUgYSBwZW5kaW5nIHN1c3BlbnNlIGlzIHVubW91bnRlZCBiZWZvcmVcclxuICAgICAgICAvLyBpdHMgYXN5bmMgZGVwIHJlc29sdmVzLiBUaGlzIHNob3VsZCByZW1vdmUgdGhlIGRlcCBmcm9tIHRoZSBzdXNwZW5zZSwgYW5kXHJcbiAgICAgICAgLy8gY2F1c2UgdGhlIHN1c3BlbnNlIHRvIHJlc29sdmUgaW1tZWRpYXRlbHkgaWYgdGhhdCB3YXMgdGhlIGxhc3QgZGVwLlxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgcGFyZW50U3VzcGVuc2UgJiZcclxuICAgICAgICAgICAgIXBhcmVudFN1c3BlbnNlLmlzUmVzb2x2ZWQgJiZcclxuICAgICAgICAgICAgIXBhcmVudFN1c3BlbnNlLmlzVW5tb3VudGVkICYmXHJcbiAgICAgICAgICAgIGluc3RhbmNlLmFzeW5jRGVwICYmXHJcbiAgICAgICAgICAgICFpbnN0YW5jZS5hc3luY1Jlc29sdmVkKSB7XHJcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLmRlcHMtLTtcclxuICAgICAgICAgICAgaWYgKHBhcmVudFN1c3BlbnNlLmRlcHMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgY29tcG9uZW50UmVtb3ZlZChpbnN0YW5jZSk7XHJcbiAgICB9O1xyXG4gICAgY29uc3QgdW5tb3VudENoaWxkcmVuID0gKGNoaWxkcmVuLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBkb1JlbW92ZSA9IGZhbHNlLCBzdGFydCA9IDApID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB1bm1vdW50KGNoaWxkcmVuW2ldLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBkb1JlbW92ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGdldE5leHRIb3N0Tm9kZSA9IHZub2RlID0+IHtcclxuICAgICAgICBpZiAodm5vZGUuc2hhcGVGbGFnICYgNiAvKiBDT01QT05FTlQgKi8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldE5leHRIb3N0Tm9kZSh2bm9kZS5jb21wb25lbnQuc3ViVHJlZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdm5vZGUuc2hhcGVGbGFnICYgMTI4IC8qIFNVU1BFTlNFICovKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2bm9kZS5zdXNwZW5zZS5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBob3N0TmV4dFNpYmxpbmcoKHZub2RlLmFuY2hvciB8fCB2bm9kZS5lbCkpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogIzExNTZcclxuICAgICAqIFdoZW4gYSBjb21wb25lbnQgaXMgSE1SLWVuYWJsZWQsIHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYWxsIHN0YXRpYyBub2Rlc1xyXG4gICAgICogaW5zaWRlIGEgYmxvY2sgYWxzbyBpbmhlcml0IHRoZSBET00gZWxlbWVudCBmcm9tIHRoZSBwcmV2aW91cyB0cmVlIHNvIHRoYXRcclxuICAgICAqIEhNUiB1cGRhdGVzICh3aGljaCBhcmUgZnVsbCB1cGRhdGVzKSBjYW4gcmV0cmlldmUgdGhlIGVsZW1lbnQgZm9yIHBhdGNoaW5nLlxyXG4gICAgICpcclxuICAgICAqIERldiBvbmx5LlxyXG4gICAgICovXHJcbiAgICBjb25zdCB0cmF2ZXJzZVN0YXRpY0NoaWxkcmVuID0gKG4xLCBuMikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNoMSA9IG4xLmNoaWxkcmVuO1xyXG4gICAgICAgIGNvbnN0IGNoMiA9IG4yLmNoaWxkcmVuO1xyXG4gICAgICAgIGlmIChpc0FycmF5KGNoMSkgJiYgaXNBcnJheShjaDIpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2gxLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIG9ubHkgY2FsbGVkIGluIHRoZSBvcHRpbWl6ZWQgcGF0aCBzbyBhcnJheSBjaGlsZHJlbiBhcmVcclxuICAgICAgICAgICAgICAgIC8vIGd1YXJhbnRlZWQgdG8gYmUgdm5vZGVzXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjMSA9IGNoMVtpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGMyID0gKGNoMltpXSA9IGNsb25lSWZNb3VudGVkKGNoMltpXSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGMyLnNoYXBlRmxhZyAmIDEgLyogRUxFTUVOVCAqLyAmJiAhYzIuZHluYW1pY0NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMyLnBhdGNoRmxhZyA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMyLmVsID0gYzEuZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRyYXZlcnNlU3RhdGljQ2hpbGRyZW4oYzEsIGMyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBjb25zdCByZW5kZXIgPSAodm5vZGUsIGNvbnRhaW5lcikgPT4ge1xyXG4gICAgICAgIGlmICh2bm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIuX3Zub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1bm1vdW50KGNvbnRhaW5lci5fdm5vZGUsIG51bGwsIG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwYXRjaChjb250YWluZXIuX3Zub2RlIHx8IG51bGwsIHZub2RlLCBjb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmbHVzaFBvc3RGbHVzaENicygpO1xyXG4gICAgICAgIGNvbnRhaW5lci5fdm5vZGUgPSB2bm9kZTtcclxuICAgIH07XHJcbiAgICBjb25zdCBpbnRlcm5hbHMgPSB7XHJcbiAgICAgICAgcDogcGF0Y2gsXHJcbiAgICAgICAgdW06IHVubW91bnQsXHJcbiAgICAgICAgbTogbW92ZSxcclxuICAgICAgICByOiByZW1vdmUsXHJcbiAgICAgICAgbXQ6IG1vdW50Q29tcG9uZW50LFxyXG4gICAgICAgIG1jOiBtb3VudENoaWxkcmVuLFxyXG4gICAgICAgIHBjOiBwYXRjaENoaWxkcmVuLFxyXG4gICAgICAgIHBiYzogcGF0Y2hCbG9ja0NoaWxkcmVuLFxyXG4gICAgICAgIG46IGdldE5leHRIb3N0Tm9kZSxcclxuICAgICAgICBvOiBvcHRpb25zXHJcbiAgICB9O1xyXG4gICAgbGV0IGh5ZHJhdGU7XHJcbiAgICBsZXQgaHlkcmF0ZU5vZGU7XHJcbiAgICBpZiAoY3JlYXRlSHlkcmF0aW9uRm5zKSB7XHJcbiAgICAgICAgW2h5ZHJhdGUsIGh5ZHJhdGVOb2RlXSA9IGNyZWF0ZUh5ZHJhdGlvbkZucyhpbnRlcm5hbHMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZW5kZXIsXHJcbiAgICAgICAgaHlkcmF0ZSxcclxuICAgICAgICBjcmVhdGVBcHA6IGNyZWF0ZUFwcEFQSShyZW5kZXIsIGh5ZHJhdGUpXHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGludm9rZVZOb2RlSG9vayhob29rLCBpbnN0YW5jZSwgdm5vZGUsIHByZXZWTm9kZSA9IG51bGwpIHtcclxuICAgIGNhbGxXaXRoQXN5bmNFcnJvckhhbmRsaW5nKGhvb2ssIGluc3RhbmNlLCA3IC8qIFZOT0RFX0hPT0sgKi8sIFtcclxuICAgICAgICB2bm9kZSxcclxuICAgICAgICBwcmV2Vk5vZGVcclxuICAgIF0pO1xyXG59XHJcbi8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xvbmdlc3RfaW5jcmVhc2luZ19zdWJzZXF1ZW5jZVxyXG5mdW5jdGlvbiBnZXRTZXF1ZW5jZShhcnIpIHtcclxuICAgIGNvbnN0IHAgPSBhcnIuc2xpY2UoKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFswXTtcclxuICAgIGxldCBpLCBqLCB1LCB2LCBjO1xyXG4gICAgY29uc3QgbGVuID0gYXJyLmxlbmd0aDtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGFyckkgPSBhcnJbaV07XHJcbiAgICAgICAgaWYgKGFyckkgIT09IDApIHtcclxuICAgICAgICAgICAgaiA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIGlmIChhcnJbal0gPCBhcnJJKSB7XHJcbiAgICAgICAgICAgICAgICBwW2ldID0gajtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGkpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdSA9IDA7XHJcbiAgICAgICAgICAgIHYgPSByZXN1bHQubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgd2hpbGUgKHUgPCB2KSB7XHJcbiAgICAgICAgICAgICAgICBjID0gKCh1ICsgdikgLyAyKSB8IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyW3Jlc3VsdFtjXV0gPCBhcnJJKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdSA9IGMgKyAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdiA9IGM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFyckkgPCBhcnJbcmVzdWx0W3VdXSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFtpXSA9IHJlc3VsdFt1IC0gMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbdV0gPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdSA9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICB2ID0gcmVzdWx0W3UgLSAxXTtcclxuICAgIHdoaWxlICh1LS0gPiAwKSB7XHJcbiAgICAgICAgcmVzdWx0W3VdID0gdjtcclxuICAgICAgICB2ID0gcFt2XTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cblxuLy8gU2ltcGxlIGVmZmVjdC5cclxuZnVuY3Rpb24gd2F0Y2hFZmZlY3QoZWZmZWN0LCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gZG9XYXRjaChlZmZlY3QsIG51bGwsIG9wdGlvbnMpO1xyXG59XHJcbi8vIGluaXRpYWwgdmFsdWUgZm9yIHdhdGNoZXJzIHRvIHRyaWdnZXIgb24gdW5kZWZpbmVkIGluaXRpYWwgdmFsdWVzXHJcbmNvbnN0IElOSVRJQUxfV0FUQ0hFUl9WQUxVRSA9IHt9O1xyXG4vLyBpbXBsZW1lbnRhdGlvblxyXG5mdW5jdGlvbiB3YXRjaChzb3VyY2UsIGNiLCBvcHRpb25zKSB7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmICFpc0Z1bmN0aW9uKGNiKSkge1xyXG4gICAgICAgIHdhcm4oYFxcYHdhdGNoKGZuLCBvcHRpb25zPylcXGAgc2lnbmF0dXJlIGhhcyBiZWVuIG1vdmVkIHRvIGEgc2VwYXJhdGUgQVBJLiBgICtcclxuICAgICAgICAgICAgYFVzZSBcXGB3YXRjaEVmZmVjdChmbiwgb3B0aW9ucz8pXFxgIGluc3RlYWQuIFxcYHdhdGNoXFxgIG5vdyBvbmx5IGAgK1xyXG4gICAgICAgICAgICBgc3VwcG9ydHMgXFxgd2F0Y2goc291cmNlLCBjYiwgb3B0aW9ucz8pIHNpZ25hdHVyZS5gKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkb1dhdGNoKHNvdXJjZSwgY2IsIG9wdGlvbnMpO1xyXG59XHJcbmZ1bmN0aW9uIGRvV2F0Y2goc291cmNlLCBjYiwgeyBpbW1lZGlhdGUsIGRlZXAsIGZsdXNoLCBvblRyYWNrLCBvblRyaWdnZXIgfSA9IEVNUFRZX09CSiwgaW5zdGFuY2UgPSBjdXJyZW50SW5zdGFuY2UpIHtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIWNiKSB7XHJcbiAgICAgICAgaWYgKGltbWVkaWF0ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHdhcm4oYHdhdGNoKCkgXCJpbW1lZGlhdGVcIiBvcHRpb24gaXMgb25seSByZXNwZWN0ZWQgd2hlbiB1c2luZyB0aGUgYCArXHJcbiAgICAgICAgICAgICAgICBgd2F0Y2goc291cmNlLCBjYWxsYmFjaywgb3B0aW9ucz8pIHNpZ25hdHVyZS5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRlZXAgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB3YXJuKGB3YXRjaCgpIFwiZGVlcFwiIG9wdGlvbiBpcyBvbmx5IHJlc3BlY3RlZCB3aGVuIHVzaW5nIHRoZSBgICtcclxuICAgICAgICAgICAgICAgIGB3YXRjaChzb3VyY2UsIGNhbGxiYWNrLCBvcHRpb25zPykgc2lnbmF0dXJlLmApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHdhcm5JbnZhbGlkU291cmNlID0gKHMpID0+IHtcclxuICAgICAgICB3YXJuKGBJbnZhbGlkIHdhdGNoIHNvdXJjZTogYCwgcywgYEEgd2F0Y2ggc291cmNlIGNhbiBvbmx5IGJlIGEgZ2V0dGVyL2VmZmVjdCBmdW5jdGlvbiwgYSByZWYsIGAgK1xyXG4gICAgICAgICAgICBgYSByZWFjdGl2ZSBvYmplY3QsIG9yIGFuIGFycmF5IG9mIHRoZXNlIHR5cGVzLmApO1xyXG4gICAgfTtcclxuICAgIGxldCBnZXR0ZXI7XHJcbiAgICBpZiAoaXNBcnJheShzb3VyY2UpKSB7XHJcbiAgICAgICAgZ2V0dGVyID0gKCkgPT4gc291cmNlLm1hcChzID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzUmVmKHMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcy52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc1JlYWN0aXZlKHMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhdmVyc2Uocyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNGdW5jdGlvbihzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxXaXRoRXJyb3JIYW5kbGluZyhzLCBpbnN0YW5jZSwgMiAvKiBXQVRDSF9HRVRURVIgKi8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHdhcm5JbnZhbGlkU291cmNlKHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc1JlZihzb3VyY2UpKSB7XHJcbiAgICAgICAgZ2V0dGVyID0gKCkgPT4gc291cmNlLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNSZWFjdGl2ZShzb3VyY2UpKSB7XHJcbiAgICAgICAgZ2V0dGVyID0gKCkgPT4gc291cmNlO1xyXG4gICAgICAgIGRlZXAgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNGdW5jdGlvbihzb3VyY2UpKSB7XHJcbiAgICAgICAgaWYgKGNiKSB7XHJcbiAgICAgICAgICAgIC8vIGdldHRlciB3aXRoIGNiXHJcbiAgICAgICAgICAgIGdldHRlciA9ICgpID0+IGNhbGxXaXRoRXJyb3JIYW5kbGluZyhzb3VyY2UsIGluc3RhbmNlLCAyIC8qIFdBVENIX0dFVFRFUiAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBubyBjYiAtPiBzaW1wbGUgZWZmZWN0XHJcbiAgICAgICAgICAgIGdldHRlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS5pc1VubW91bnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjbGVhbnVwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYW51cCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxXaXRoRXJyb3JIYW5kbGluZyhzb3VyY2UsIGluc3RhbmNlLCAzIC8qIFdBVENIX0NBTExCQUNLICovLCBbb25JbnZhbGlkYXRlXSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZ2V0dGVyID0gTk9PUDtcclxuICAgICAgICAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgd2FybkludmFsaWRTb3VyY2Uoc291cmNlKTtcclxuICAgIH1cclxuICAgIGlmIChjYiAmJiBkZWVwKSB7XHJcbiAgICAgICAgY29uc3QgYmFzZUdldHRlciA9IGdldHRlcjtcclxuICAgICAgICBnZXR0ZXIgPSAoKSA9PiB0cmF2ZXJzZShiYXNlR2V0dGVyKCkpO1xyXG4gICAgfVxyXG4gICAgbGV0IGNsZWFudXA7XHJcbiAgICBjb25zdCBvbkludmFsaWRhdGUgPSAoZm4pID0+IHtcclxuICAgICAgICBjbGVhbnVwID0gcnVubmVyLm9wdGlvbnMub25TdG9wID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsV2l0aEVycm9ySGFuZGxpbmcoZm4sIGluc3RhbmNlLCA0IC8qIFdBVENIX0NMRUFOVVAgKi8pO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgbGV0IG9sZFZhbHVlID0gaXNBcnJheShzb3VyY2UpID8gW10gOiBJTklUSUFMX1dBVENIRVJfVkFMVUU7XHJcbiAgICBjb25zdCBqb2IgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFydW5uZXIuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNiKSB7XHJcbiAgICAgICAgICAgIC8vIHdhdGNoKHNvdXJjZSwgY2IpXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gcnVubmVyKCk7XHJcbiAgICAgICAgICAgIGlmIChkZWVwIHx8IGhhc0NoYW5nZWQobmV3VmFsdWUsIG9sZFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY2xlYW51cCBiZWZvcmUgcnVubmluZyBjYiBhZ2FpblxyXG4gICAgICAgICAgICAgICAgaWYgKGNsZWFudXApIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYWxsV2l0aEFzeW5jRXJyb3JIYW5kbGluZyhjYiwgaW5zdGFuY2UsIDMgLyogV0FUQ0hfQ0FMTEJBQ0sgKi8sIFtcclxuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBwYXNzIHVuZGVmaW5lZCBhcyB0aGUgb2xkIHZhbHVlIHdoZW4gaXQncyBjaGFuZ2VkIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgICAgICAgICAgICAgIG9sZFZhbHVlID09PSBJTklUSUFMX1dBVENIRVJfVkFMVUUgPyB1bmRlZmluZWQgOiBvbGRWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICBvbkludmFsaWRhdGVcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgb2xkVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gd2F0Y2hFZmZlY3RcclxuICAgICAgICAgICAgcnVubmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGxldCBzY2hlZHVsZXI7XHJcbiAgICBpZiAoZmx1c2ggPT09ICdzeW5jJykge1xyXG4gICAgICAgIHNjaGVkdWxlciA9IGpvYjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGZsdXNoID09PSAncHJlJykge1xyXG4gICAgICAgIC8vIGVuc3VyZSBpdCdzIHF1ZXVlZCBiZWZvcmUgY29tcG9uZW50IHVwZGF0ZXMgKHdoaWNoIGhhdmUgcG9zaXRpdmUgaWRzKVxyXG4gICAgICAgIGpvYi5pZCA9IC0xO1xyXG4gICAgICAgIHNjaGVkdWxlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZSB8fCBpbnN0YW5jZS5pc01vdW50ZWQpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXVlSm9iKGpvYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB3aXRoICdwcmUnIG9wdGlvbiwgdGhlIGZpcnN0IGNhbGwgbXVzdCBoYXBwZW4gYmVmb3JlXHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQgc28gaXQgaXMgY2FsbGVkIHN5bmNocm9ub3VzbHkuXHJcbiAgICAgICAgICAgICAgICBqb2IoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzY2hlZHVsZXIgPSAoKSA9PiBxdWV1ZVBvc3RSZW5kZXJFZmZlY3Qoam9iLCBpbnN0YW5jZSAmJiBpbnN0YW5jZS5zdXNwZW5zZSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBydW5uZXIgPSBlZmZlY3QoZ2V0dGVyLCB7XHJcbiAgICAgICAgbGF6eTogdHJ1ZSxcclxuICAgICAgICBvblRyYWNrLFxyXG4gICAgICAgIG9uVHJpZ2dlcixcclxuICAgICAgICBzY2hlZHVsZXJcclxuICAgIH0pO1xyXG4gICAgcmVjb3JkSW5zdGFuY2VCb3VuZEVmZmVjdChydW5uZXIpO1xyXG4gICAgLy8gaW5pdGlhbCBydW5cclxuICAgIGlmIChjYikge1xyXG4gICAgICAgIGlmIChpbW1lZGlhdGUpIHtcclxuICAgICAgICAgICAgam9iKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvbGRWYWx1ZSA9IHJ1bm5lcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJ1bm5lcigpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICBzdG9wKHJ1bm5lcik7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZShpbnN0YW5jZS5lZmZlY3RzLCBydW5uZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuLy8gdGhpcy4kd2F0Y2hcclxuZnVuY3Rpb24gaW5zdGFuY2VXYXRjaChzb3VyY2UsIGNiLCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBwdWJsaWNUaGlzID0gdGhpcy5wcm94eTtcclxuICAgIGNvbnN0IGdldHRlciA9IGlzU3RyaW5nKHNvdXJjZSlcclxuICAgICAgICA/ICgpID0+IHB1YmxpY1RoaXNbc291cmNlXVxyXG4gICAgICAgIDogc291cmNlLmJpbmQocHVibGljVGhpcyk7XHJcbiAgICByZXR1cm4gZG9XYXRjaChnZXR0ZXIsIGNiLmJpbmQocHVibGljVGhpcyksIG9wdGlvbnMsIHRoaXMpO1xyXG59XHJcbmZ1bmN0aW9uIHRyYXZlcnNlKHZhbHVlLCBzZWVuID0gbmV3IFNldCgpKSB7XHJcbiAgICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBzZWVuLmhhcyh2YWx1ZSkpIHtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBzZWVuLmFkZCh2YWx1ZSk7XHJcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRyYXZlcnNlKHZhbHVlW2ldLCBzZWVuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE1hcCkge1xyXG4gICAgICAgIHZhbHVlLmZvckVhY2goKHYsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAvLyB0byByZWdpc3RlciBtdXRhdGlvbiBkZXAgZm9yIGV4aXN0aW5nIGtleXNcclxuICAgICAgICAgICAgdHJhdmVyc2UodmFsdWUuZ2V0KGtleSksIHNlZW4pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBTZXQpIHtcclxuICAgICAgICB2YWx1ZS5mb3JFYWNoKHYgPT4ge1xyXG4gICAgICAgICAgICB0cmF2ZXJzZSh2LCBzZWVuKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRyYXZlcnNlKHZhbHVlW2tleV0sIHNlZW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxuXG5mdW5jdGlvbiBwcm92aWRlKGtleSwgdmFsdWUpIHtcclxuICAgIGlmICghY3VycmVudEluc3RhbmNlKSB7XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICB3YXJuKGBwcm92aWRlKCkgY2FuIG9ubHkgYmUgdXNlZCBpbnNpZGUgc2V0dXAoKS5gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBsZXQgcHJvdmlkZXMgPSBjdXJyZW50SW5zdGFuY2UucHJvdmlkZXM7XHJcbiAgICAgICAgLy8gYnkgZGVmYXVsdCBhbiBpbnN0YW5jZSBpbmhlcml0cyBpdHMgcGFyZW50J3MgcHJvdmlkZXMgb2JqZWN0XHJcbiAgICAgICAgLy8gYnV0IHdoZW4gaXQgbmVlZHMgdG8gcHJvdmlkZSB2YWx1ZXMgb2YgaXRzIG93biwgaXQgY3JlYXRlcyBpdHNcclxuICAgICAgICAvLyBvd24gcHJvdmlkZXMgb2JqZWN0IHVzaW5nIHBhcmVudCBwcm92aWRlcyBvYmplY3QgYXMgcHJvdG90eXBlLlxyXG4gICAgICAgIC8vIHRoaXMgd2F5IGluIGBpbmplY3RgIHdlIGNhbiBzaW1wbHkgbG9vayB1cCBpbmplY3Rpb25zIGZyb20gZGlyZWN0XHJcbiAgICAgICAgLy8gcGFyZW50IGFuZCBsZXQgdGhlIHByb3RvdHlwZSBjaGFpbiBkbyB0aGUgd29yay5cclxuICAgICAgICBjb25zdCBwYXJlbnRQcm92aWRlcyA9IGN1cnJlbnRJbnN0YW5jZS5wYXJlbnQgJiYgY3VycmVudEluc3RhbmNlLnBhcmVudC5wcm92aWRlcztcclxuICAgICAgICBpZiAocGFyZW50UHJvdmlkZXMgPT09IHByb3ZpZGVzKSB7XHJcbiAgICAgICAgICAgIHByb3ZpZGVzID0gY3VycmVudEluc3RhbmNlLnByb3ZpZGVzID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRQcm92aWRlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFRTIGRvZXNuJ3QgYWxsb3cgc3ltYm9sIGFzIGluZGV4IHR5cGVcclxuICAgICAgICBwcm92aWRlc1trZXldID0gdmFsdWU7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5qZWN0KGtleSwgZGVmYXVsdFZhbHVlKSB7XHJcbiAgICAvLyBmYWxsYmFjayB0byBgY3VycmVudFJlbmRlcmluZ0luc3RhbmNlYCBzbyB0aGF0IHRoaXMgY2FuIGJlIGNhbGxlZCBpblxyXG4gICAgLy8gYSBmdW5jdGlvbmFsIGNvbXBvbmVudFxyXG4gICAgY29uc3QgaW5zdGFuY2UgPSBjdXJyZW50SW5zdGFuY2UgfHwgY3VycmVudFJlbmRlcmluZ0luc3RhbmNlO1xyXG4gICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgY29uc3QgcHJvdmlkZXMgPSBpbnN0YW5jZS5wcm92aWRlcztcclxuICAgICAgICBpZiAoa2V5IGluIHByb3ZpZGVzKSB7XHJcbiAgICAgICAgICAgIC8vIFRTIGRvZXNuJ3QgYWxsb3cgc3ltYm9sIGFzIGluZGV4IHR5cGVcclxuICAgICAgICAgICAgcmV0dXJuIHByb3ZpZGVzW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICB3YXJuKGBpbmplY3Rpb24gXCIke1N0cmluZyhrZXkpfVwiIG5vdCBmb3VuZC5gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICB3YXJuKGBpbmplY3QoKSBjYW4gb25seSBiZSB1c2VkIGluc2lkZSBzZXR1cCgpIG9yIGZ1bmN0aW9uYWwgY29tcG9uZW50cy5gKTtcclxuICAgIH1cclxufVxuXG5mdW5jdGlvbiBjcmVhdGVEdXBsaWNhdGVDaGVja2VyKCkge1xyXG4gICAgY29uc3QgY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgcmV0dXJuICh0eXBlLCBrZXkpID0+IHtcclxuICAgICAgICBpZiAoY2FjaGVba2V5XSkge1xyXG4gICAgICAgICAgICB3YXJuKGAke3R5cGV9IHByb3BlcnR5IFwiJHtrZXl9XCIgaXMgYWxyZWFkeSBkZWZpbmVkIGluICR7Y2FjaGVba2V5XX0uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYWNoZVtrZXldID0gdHlwZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGFwcGx5T3B0aW9ucyhpbnN0YW5jZSwgb3B0aW9ucywgZGVmZXJyZWREYXRhID0gW10sIGRlZmVycmVkV2F0Y2ggPSBbXSwgYXNNaXhpbiA9IGZhbHNlKSB7XHJcbiAgICBjb25zdCB7IFxyXG4gICAgLy8gY29tcG9zaXRpb25cclxuICAgIG1peGlucywgZXh0ZW5kczogZXh0ZW5kc09wdGlvbnMsIFxyXG4gICAgLy8gc3RhdGVcclxuICAgIGRhdGE6IGRhdGFPcHRpb25zLCBjb21wdXRlZDogY29tcHV0ZWRPcHRpb25zLCBtZXRob2RzLCB3YXRjaDogd2F0Y2hPcHRpb25zLCBwcm92aWRlOiBwcm92aWRlT3B0aW9ucywgaW5qZWN0OiBpbmplY3RPcHRpb25zLCBcclxuICAgIC8vIGFzc2V0c1xyXG4gICAgY29tcG9uZW50cywgZGlyZWN0aXZlcywgXHJcbiAgICAvLyBsaWZlY3ljbGVcclxuICAgIGJlZm9yZU1vdW50LCBtb3VudGVkLCBiZWZvcmVVcGRhdGUsIHVwZGF0ZWQsIGFjdGl2YXRlZCwgZGVhY3RpdmF0ZWQsIGJlZm9yZVVubW91bnQsIHVubW91bnRlZCwgcmVuZGVyVHJhY2tlZCwgcmVuZGVyVHJpZ2dlcmVkLCBlcnJvckNhcHR1cmVkIH0gPSBvcHRpb25zO1xyXG4gICAgY29uc3QgcHVibGljVGhpcyA9IGluc3RhbmNlLnByb3h5O1xyXG4gICAgY29uc3QgY3R4ID0gaW5zdGFuY2UuY3R4O1xyXG4gICAgY29uc3QgZ2xvYmFsTWl4aW5zID0gaW5zdGFuY2UuYXBwQ29udGV4dC5taXhpbnM7XHJcbiAgICAvLyBjYWxsIGl0IG9ubHkgZHVyaW5nIGRldlxyXG4gICAgLy8gYXBwbHlPcHRpb25zIGlzIGNhbGxlZCBub24tYXMtbWl4aW4gb25jZSBwZXIgaW5zdGFuY2VcclxuICAgIGlmICghYXNNaXhpbikge1xyXG4gICAgICAgIGNhbGxTeW5jSG9vaygnYmVmb3JlQ3JlYXRlJywgb3B0aW9ucywgcHVibGljVGhpcywgZ2xvYmFsTWl4aW5zKTtcclxuICAgICAgICAvLyBnbG9iYWwgbWl4aW5zIGFyZSBhcHBsaWVkIGZpcnN0XHJcbiAgICAgICAgYXBwbHlNaXhpbnMoaW5zdGFuY2UsIGdsb2JhbE1peGlucywgZGVmZXJyZWREYXRhLCBkZWZlcnJlZFdhdGNoKTtcclxuICAgIH1cclxuICAgIC8vIGV4dGVuZGluZyBhIGJhc2UgY29tcG9uZW50Li4uXHJcbiAgICBpZiAoZXh0ZW5kc09wdGlvbnMpIHtcclxuICAgICAgICBhcHBseU9wdGlvbnMoaW5zdGFuY2UsIGV4dGVuZHNPcHRpb25zLCBkZWZlcnJlZERhdGEsIGRlZmVycmVkV2F0Y2gsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgLy8gbG9jYWwgbWl4aW5zXHJcbiAgICBpZiAobWl4aW5zKSB7XHJcbiAgICAgICAgYXBwbHlNaXhpbnMoaW5zdGFuY2UsIG1peGlucywgZGVmZXJyZWREYXRhLCBkZWZlcnJlZFdhdGNoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGNoZWNrRHVwbGljYXRlUHJvcGVydGllcyA9IChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSA/IGNyZWF0ZUR1cGxpY2F0ZUNoZWNrZXIoKSA6IG51bGw7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHNPcHRpb25zID0gbm9ybWFsaXplUHJvcHNPcHRpb25zKG9wdGlvbnMpWzBdO1xyXG4gICAgICAgIGlmIChwcm9wc09wdGlvbnMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHNPcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja0R1cGxpY2F0ZVByb3BlcnRpZXMoXCJQcm9wc1wiIC8qIFBST1BTICovLCBrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gb3B0aW9ucyBpbml0aWFsaXphdGlvbiBvcmRlciAodG8gYmUgY29uc2lzdGVudCB3aXRoIFZ1ZSAyKTpcclxuICAgIC8vIC0gcHJvcHMgKGFscmVhZHkgZG9uZSBvdXRzaWRlIG9mIHRoaXMgZnVuY3Rpb24pXHJcbiAgICAvLyAtIGluamVjdFxyXG4gICAgLy8gLSBtZXRob2RzXHJcbiAgICAvLyAtIGRhdGEgKGRlZmVycmVkIHNpbmNlIGl0IHJlbGllcyBvbiBgdGhpc2AgYWNjZXNzKVxyXG4gICAgLy8gLSBjb21wdXRlZFxyXG4gICAgLy8gLSB3YXRjaCAoZGVmZXJyZWQgc2luY2UgaXQgcmVsaWVzIG9uIGB0aGlzYCBhY2Nlc3MpXHJcbiAgICBpZiAoaW5qZWN0T3B0aW9ucykge1xyXG4gICAgICAgIGlmIChpc0FycmF5KGluamVjdE9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5qZWN0T3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gaW5qZWN0T3B0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIGN0eFtrZXldID0gaW5qZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tEdXBsaWNhdGVQcm9wZXJ0aWVzKFwiSW5qZWN0XCIgLyogSU5KRUNUICovLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBpbmplY3RPcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcHQgPSBpbmplY3RPcHRpb25zW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3Qob3B0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eFtrZXldID0gaW5qZWN0KG9wdC5mcm9tLCBvcHQuZGVmYXVsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHhba2V5XSA9IGluamVjdChvcHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrRHVwbGljYXRlUHJvcGVydGllcyhcIkluamVjdFwiIC8qIElOSkVDVCAqLywga2V5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChtZXRob2RzKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbWV0aG9kcykge1xyXG4gICAgICAgICAgICBjb25zdCBtZXRob2RIYW5kbGVyID0gbWV0aG9kc1trZXldO1xyXG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihtZXRob2RIYW5kbGVyKSkge1xyXG4gICAgICAgICAgICAgICAgY3R4W2tleV0gPSBtZXRob2RIYW5kbGVyLmJpbmQocHVibGljVGhpcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tEdXBsaWNhdGVQcm9wZXJ0aWVzKFwiTWV0aG9kc1wiIC8qIE1FVEhPRFMgKi8sIGtleSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuKGBNZXRob2QgXCIke2tleX1cIiBoYXMgdHlwZSBcIiR7dHlwZW9mIG1ldGhvZEhhbmRsZXJ9XCIgaW4gdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLiBgICtcclxuICAgICAgICAgICAgICAgICAgICBgRGlkIHlvdSByZWZlcmVuY2UgdGhlIGZ1bmN0aW9uIGNvcnJlY3RseT9gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChkYXRhT3B0aW9ucykge1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIWlzRnVuY3Rpb24oZGF0YU9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgIHdhcm4oYFRoZSBkYXRhIG9wdGlvbiBtdXN0IGJlIGEgZnVuY3Rpb24uIGAgK1xyXG4gICAgICAgICAgICAgICAgYFBsYWluIG9iamVjdCB1c2FnZSBpcyBubyBsb25nZXIgc3VwcG9ydGVkLmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYXNNaXhpbikge1xyXG4gICAgICAgICAgICBkZWZlcnJlZERhdGEucHVzaChkYXRhT3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXNvbHZlRGF0YShpbnN0YW5jZSwgZGF0YU9wdGlvbnMsIHB1YmxpY1RoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghYXNNaXhpbikge1xyXG4gICAgICAgIGlmIChkZWZlcnJlZERhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGRlZmVycmVkRGF0YS5mb3JFYWNoKGRhdGFGbiA9PiByZXNvbHZlRGF0YShpbnN0YW5jZSwgZGF0YUZuLCBwdWJsaWNUaGlzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgY29uc3QgcmF3RGF0YSA9IHRvUmF3KGluc3RhbmNlLmRhdGEpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiByYXdEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja0R1cGxpY2F0ZVByb3BlcnRpZXMoXCJEYXRhXCIgLyogREFUQSAqLywga2V5KTtcclxuICAgICAgICAgICAgICAgIC8vIGV4cG9zZSBkYXRhIG9uIGN0eCBkdXJpbmcgZGV2XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5WzBdICE9PSAnJCcgJiYga2V5WzBdICE9PSAnXycpIHtcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3R4LCBrZXksIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHJhd0RhdGFba2V5XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0OiBOT09QXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoY29tcHV0ZWRPcHRpb25zKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29tcHV0ZWRPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdCA9IGNvbXB1dGVkT3B0aW9uc1trZXldO1xyXG4gICAgICAgICAgICBjb25zdCBnZXQgPSBpc0Z1bmN0aW9uKG9wdClcclxuICAgICAgICAgICAgICAgID8gb3B0LmJpbmQocHVibGljVGhpcywgcHVibGljVGhpcylcclxuICAgICAgICAgICAgICAgIDogaXNGdW5jdGlvbihvcHQuZ2V0KVxyXG4gICAgICAgICAgICAgICAgICAgID8gb3B0LmdldC5iaW5kKHB1YmxpY1RoaXMsIHB1YmxpY1RoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgOiBOT09QO1xyXG4gICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGdldCA9PT0gTk9PUCkge1xyXG4gICAgICAgICAgICAgICAgd2FybihgQ29tcHV0ZWQgcHJvcGVydHkgXCIke2tleX1cIiBoYXMgbm8gZ2V0dGVyLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHNldCA9ICFpc0Z1bmN0aW9uKG9wdCkgJiYgaXNGdW5jdGlvbihvcHQuc2V0KVxyXG4gICAgICAgICAgICAgICAgPyBvcHQuc2V0LmJpbmQocHVibGljVGhpcylcclxuICAgICAgICAgICAgICAgIDogKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpXHJcbiAgICAgICAgICAgICAgICAgICAgPyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm4oYFdyaXRlIG9wZXJhdGlvbiBmYWlsZWQ6IGNvbXB1dGVkIHByb3BlcnR5IFwiJHtrZXl9XCIgaXMgcmVhZG9ubHkuYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIDogTk9PUDtcclxuICAgICAgICAgICAgY29uc3QgYyA9IGNvbXB1dGVkKHtcclxuICAgICAgICAgICAgICAgIGdldCxcclxuICAgICAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0eCwga2V5LCB7XHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiBjLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgc2V0OiB2ID0+IChjLnZhbHVlID0gdilcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrRHVwbGljYXRlUHJvcGVydGllcyhcIkNvbXB1dGVkXCIgLyogQ09NUFVURUQgKi8sIGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAod2F0Y2hPcHRpb25zKSB7XHJcbiAgICAgICAgZGVmZXJyZWRXYXRjaC5wdXNoKHdhdGNoT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWFzTWl4aW4gJiYgZGVmZXJyZWRXYXRjaC5sZW5ndGgpIHtcclxuICAgICAgICBkZWZlcnJlZFdhdGNoLmZvckVhY2god2F0Y2hPcHRpb25zID0+IHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gd2F0Y2hPcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVXYXRjaGVyKHdhdGNoT3B0aW9uc1trZXldLCBjdHgsIHB1YmxpY1RoaXMsIGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmIChwcm92aWRlT3B0aW9ucykge1xyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVzID0gaXNGdW5jdGlvbihwcm92aWRlT3B0aW9ucylcclxuICAgICAgICAgICAgPyBwcm92aWRlT3B0aW9ucy5jYWxsKHB1YmxpY1RoaXMpXHJcbiAgICAgICAgICAgIDogcHJvdmlkZU9wdGlvbnM7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcHJvdmlkZXMpIHtcclxuICAgICAgICAgICAgcHJvdmlkZShrZXksIHByb3ZpZGVzW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGFzc2V0IG9wdGlvbnNcclxuICAgIGlmIChjb21wb25lbnRzKSB7XHJcbiAgICAgICAgZXh0ZW5kKGluc3RhbmNlLmNvbXBvbmVudHMsIGNvbXBvbmVudHMpO1xyXG4gICAgfVxyXG4gICAgaWYgKGRpcmVjdGl2ZXMpIHtcclxuICAgICAgICBleHRlbmQoaW5zdGFuY2UuZGlyZWN0aXZlcywgZGlyZWN0aXZlcyk7XHJcbiAgICB9XHJcbiAgICAvLyBsaWZlY3ljbGUgb3B0aW9uc1xyXG4gICAgaWYgKCFhc01peGluKSB7XHJcbiAgICAgICAgY2FsbFN5bmNIb29rKCdjcmVhdGVkJywgb3B0aW9ucywgcHVibGljVGhpcywgZ2xvYmFsTWl4aW5zKTtcclxuICAgIH1cclxuICAgIGlmIChiZWZvcmVNb3VudCkge1xyXG4gICAgICAgIG9uQmVmb3JlTW91bnQoYmVmb3JlTW91bnQuYmluZChwdWJsaWNUaGlzKSk7XHJcbiAgICB9XHJcbiAgICBpZiAobW91bnRlZCkge1xyXG4gICAgICAgIG9uTW91bnRlZChtb3VudGVkLmJpbmQocHVibGljVGhpcykpO1xyXG4gICAgfVxyXG4gICAgaWYgKGJlZm9yZVVwZGF0ZSkge1xyXG4gICAgICAgIG9uQmVmb3JlVXBkYXRlKGJlZm9yZVVwZGF0ZS5iaW5kKHB1YmxpY1RoaXMpKTtcclxuICAgIH1cclxuICAgIGlmICh1cGRhdGVkKSB7XHJcbiAgICAgICAgb25VcGRhdGVkKHVwZGF0ZWQuYmluZChwdWJsaWNUaGlzKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoYWN0aXZhdGVkKSB7XHJcbiAgICAgICAgb25BY3RpdmF0ZWQoYWN0aXZhdGVkLmJpbmQocHVibGljVGhpcykpO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYWN0aXZhdGVkKSB7XHJcbiAgICAgICAgb25EZWFjdGl2YXRlZChkZWFjdGl2YXRlZC5iaW5kKHB1YmxpY1RoaXMpKTtcclxuICAgIH1cclxuICAgIGlmIChlcnJvckNhcHR1cmVkKSB7XHJcbiAgICAgICAgb25FcnJvckNhcHR1cmVkKGVycm9yQ2FwdHVyZWQuYmluZChwdWJsaWNUaGlzKSk7XHJcbiAgICB9XHJcbiAgICBpZiAocmVuZGVyVHJhY2tlZCkge1xyXG4gICAgICAgIG9uUmVuZGVyVHJhY2tlZChyZW5kZXJUcmFja2VkLmJpbmQocHVibGljVGhpcykpO1xyXG4gICAgfVxyXG4gICAgaWYgKHJlbmRlclRyaWdnZXJlZCkge1xyXG4gICAgICAgIG9uUmVuZGVyVHJpZ2dlcmVkKHJlbmRlclRyaWdnZXJlZC5iaW5kKHB1YmxpY1RoaXMpKTtcclxuICAgIH1cclxuICAgIGlmIChiZWZvcmVVbm1vdW50KSB7XHJcbiAgICAgICAgb25CZWZvcmVVbm1vdW50KGJlZm9yZVVubW91bnQuYmluZChwdWJsaWNUaGlzKSk7XHJcbiAgICB9XHJcbiAgICBpZiAodW5tb3VudGVkKSB7XHJcbiAgICAgICAgb25Vbm1vdW50ZWQodW5tb3VudGVkLmJpbmQocHVibGljVGhpcykpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNhbGxTeW5jSG9vayhuYW1lLCBvcHRpb25zLCBjdHgsIGdsb2JhbE1peGlucykge1xyXG4gICAgY2FsbEhvb2tGcm9tTWl4aW5zKG5hbWUsIGdsb2JhbE1peGlucywgY3R4KTtcclxuICAgIGNvbnN0IGJhc2VIb29rID0gb3B0aW9ucy5leHRlbmRzICYmIG9wdGlvbnMuZXh0ZW5kc1tuYW1lXTtcclxuICAgIGlmIChiYXNlSG9vaykge1xyXG4gICAgICAgIGJhc2VIb29rLmNhbGwoY3R4KTtcclxuICAgIH1cclxuICAgIGNvbnN0IG1peGlucyA9IG9wdGlvbnMubWl4aW5zO1xyXG4gICAgaWYgKG1peGlucykge1xyXG4gICAgICAgIGNhbGxIb29rRnJvbU1peGlucyhuYW1lLCBtaXhpbnMsIGN0eCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzZWxmSG9vayA9IG9wdGlvbnNbbmFtZV07XHJcbiAgICBpZiAoc2VsZkhvb2spIHtcclxuICAgICAgICBzZWxmSG9vay5jYWxsKGN0eCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY2FsbEhvb2tGcm9tTWl4aW5zKG5hbWUsIG1peGlucywgY3R4KSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1peGlucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGZuID0gbWl4aW5zW2ldW25hbWVdO1xyXG4gICAgICAgIGlmIChmbikge1xyXG4gICAgICAgICAgICBmbi5jYWxsKGN0eCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGFwcGx5TWl4aW5zKGluc3RhbmNlLCBtaXhpbnMsIGRlZmVycmVkRGF0YSwgZGVmZXJyZWRXYXRjaCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaXhpbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhcHBseU9wdGlvbnMoaW5zdGFuY2UsIG1peGluc1tpXSwgZGVmZXJyZWREYXRhLCBkZWZlcnJlZFdhdGNoLCB0cnVlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZXNvbHZlRGF0YShpbnN0YW5jZSwgZGF0YUZuLCBwdWJsaWNUaGlzKSB7XHJcbiAgICBjb25zdCBkYXRhID0gZGF0YUZuLmNhbGwocHVibGljVGhpcywgcHVibGljVGhpcyk7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGlzUHJvbWlzZShkYXRhKSkge1xyXG4gICAgICAgIHdhcm4oYGRhdGEoKSByZXR1cm5lZCBhIFByb21pc2UgLSBub3RlIGRhdGEoKSBjYW5ub3QgYmUgYXN5bmM7IElmIHlvdSBgICtcclxuICAgICAgICAgICAgYGludGVuZCB0byBwZXJmb3JtIGRhdGEgZmV0Y2hpbmcgYmVmb3JlIGNvbXBvbmVudCByZW5kZXJzLCB1c2UgYCArXHJcbiAgICAgICAgICAgIGBhc3luYyBzZXR1cCgpICsgPFN1c3BlbnNlPi5gKTtcclxuICAgIH1cclxuICAgIGlmICghaXNPYmplY3QoZGF0YSkpIHtcclxuICAgICAgICAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgd2FybihgZGF0YSgpIHNob3VsZCByZXR1cm4gYW4gb2JqZWN0LmApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaW5zdGFuY2UuZGF0YSA9PT0gRU1QVFlfT0JKKSB7XHJcbiAgICAgICAgaW5zdGFuY2UuZGF0YSA9IHJlYWN0aXZlKGRhdGEpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gZXhpc3RpbmcgZGF0YTogdGhpcyBpcyBhIG1peGluIG9yIGV4dGVuZHMuXHJcbiAgICAgICAgZXh0ZW5kKGluc3RhbmNlLmRhdGEsIGRhdGEpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZVdhdGNoZXIocmF3LCBjdHgsIHB1YmxpY1RoaXMsIGtleSkge1xyXG4gICAgY29uc3QgZ2V0dGVyID0gKCkgPT4gcHVibGljVGhpc1trZXldO1xyXG4gICAgaWYgKGlzU3RyaW5nKHJhdykpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gY3R4W3Jhd107XHJcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcclxuICAgICAgICAgICAgd2F0Y2goZ2V0dGVyLCBoYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgIHdhcm4oYEludmFsaWQgd2F0Y2ggaGFuZGxlciBzcGVjaWZpZWQgYnkga2V5IFwiJHtyYXd9XCJgLCBoYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc0Z1bmN0aW9uKHJhdykpIHtcclxuICAgICAgICB3YXRjaChnZXR0ZXIsIHJhdy5iaW5kKHB1YmxpY1RoaXMpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzT2JqZWN0KHJhdykpIHtcclxuICAgICAgICBpZiAoaXNBcnJheShyYXcpKSB7XHJcbiAgICAgICAgICAgIHJhdy5mb3JFYWNoKHIgPT4gY3JlYXRlV2F0Y2hlcihyLCBjdHgsIHB1YmxpY1RoaXMsIGtleSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgd2F0Y2goZ2V0dGVyLCByYXcuaGFuZGxlci5iaW5kKHB1YmxpY1RoaXMpLCByYXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgIHdhcm4oYEludmFsaWQgd2F0Y2ggb3B0aW9uOiBcIiR7a2V5fVwiYCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVzb2x2ZU1lcmdlZE9wdGlvbnMoaW5zdGFuY2UpIHtcclxuICAgIGNvbnN0IHJhdyA9IGluc3RhbmNlLnR5cGU7XHJcbiAgICBjb25zdCB7IF9fbWVyZ2VkLCBtaXhpbnMsIGV4dGVuZHM6IGV4dGVuZHNPcHRpb25zIH0gPSByYXc7XHJcbiAgICBpZiAoX19tZXJnZWQpXHJcbiAgICAgICAgcmV0dXJuIF9fbWVyZ2VkO1xyXG4gICAgY29uc3QgZ2xvYmFsTWl4aW5zID0gaW5zdGFuY2UuYXBwQ29udGV4dC5taXhpbnM7XHJcbiAgICBpZiAoIWdsb2JhbE1peGlucy5sZW5ndGggJiYgIW1peGlucyAmJiAhZXh0ZW5kc09wdGlvbnMpXHJcbiAgICAgICAgcmV0dXJuIHJhdztcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcclxuICAgIGdsb2JhbE1peGlucy5mb3JFYWNoKG0gPT4gbWVyZ2VPcHRpb25zKG9wdGlvbnMsIG0sIGluc3RhbmNlKSk7XHJcbiAgICBleHRlbmRzT3B0aW9ucyAmJiBtZXJnZU9wdGlvbnMob3B0aW9ucywgZXh0ZW5kc09wdGlvbnMsIGluc3RhbmNlKTtcclxuICAgIG1peGlucyAmJiBtaXhpbnMuZm9yRWFjaChtID0+IG1lcmdlT3B0aW9ucyhvcHRpb25zLCBtLCBpbnN0YW5jZSkpO1xyXG4gICAgbWVyZ2VPcHRpb25zKG9wdGlvbnMsIHJhdywgaW5zdGFuY2UpO1xyXG4gICAgcmV0dXJuIChyYXcuX19tZXJnZWQgPSBvcHRpb25zKTtcclxufVxyXG5mdW5jdGlvbiBtZXJnZU9wdGlvbnModG8sIGZyb20sIGluc3RhbmNlKSB7XHJcbiAgICBjb25zdCBzdHJhdHMgPSBpbnN0YW5jZS5hcHBDb250ZXh0LmNvbmZpZy5vcHRpb25NZXJnZVN0cmF0ZWdpZXM7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBmcm9tKSB7XHJcbiAgICAgICAgaWYgKHN0cmF0cyAmJiBoYXNPd24oc3RyYXRzLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIHRvW2tleV0gPSBzdHJhdHNba2V5XSh0b1trZXldLCBmcm9tW2tleV0sIGluc3RhbmNlLnByb3h5LCBrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghaGFzT3duKHRvLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIHRvW2tleV0gPSBmcm9tW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cbmNvbnN0IHB1YmxpY1Byb3BlcnRpZXNNYXAgPSBleHRlbmQoT2JqZWN0LmNyZWF0ZShudWxsKSwge1xyXG4gICAgJDogaSA9PiBpLFxyXG4gICAgJGVsOiBpID0+IGkudm5vZGUuZWwsXHJcbiAgICAkZGF0YTogaSA9PiBpLmRhdGEsXHJcbiAgICAkcHJvcHM6IGkgPT4gKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSA/IHNoYWxsb3dSZWFkb25seShpLnByb3BzKSA6IGkucHJvcHMpLFxyXG4gICAgJGF0dHJzOiBpID0+ICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgPyBzaGFsbG93UmVhZG9ubHkoaS5hdHRycykgOiBpLmF0dHJzKSxcclxuICAgICRzbG90czogaSA9PiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpID8gc2hhbGxvd1JlYWRvbmx5KGkuc2xvdHMpIDogaS5zbG90cyksXHJcbiAgICAkcmVmczogaSA9PiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpID8gc2hhbGxvd1JlYWRvbmx5KGkucmVmcykgOiBpLnJlZnMpLFxyXG4gICAgJHBhcmVudDogaSA9PiBpLnBhcmVudCAmJiBpLnBhcmVudC5wcm94eSxcclxuICAgICRyb290OiBpID0+IGkucm9vdCAmJiBpLnJvb3QucHJveHksXHJcbiAgICAkZW1pdDogaSA9PiBpLmVtaXQsXHJcbiAgICAkb3B0aW9uczogaSA9PiAoIHJlc29sdmVNZXJnZWRPcHRpb25zKGkpICksXHJcbiAgICAkZm9yY2VVcGRhdGU6IGkgPT4gKCkgPT4gcXVldWVKb2IoaS51cGRhdGUpLFxyXG4gICAgJG5leHRUaWNrOiAoKSA9PiBuZXh0VGljayxcclxuICAgICR3YXRjaDogIGkgPT4gaW5zdGFuY2VXYXRjaC5iaW5kKGkpIFxyXG59KTtcclxuY29uc3QgUHVibGljSW5zdGFuY2VQcm94eUhhbmRsZXJzID0ge1xyXG4gICAgZ2V0KHsgXzogaW5zdGFuY2UgfSwga2V5KSB7XHJcbiAgICAgICAgY29uc3QgeyBjdHgsIHNldHVwU3RhdGUsIGRhdGEsIHByb3BzLCBhY2Nlc3NDYWNoZSwgdHlwZSwgYXBwQ29udGV4dCB9ID0gaW5zdGFuY2U7XHJcbiAgICAgICAgLy8gbGV0IEB2dWUvcmVhY3Rpdml0eSBrbm93IGl0IHNob3VsZCBuZXZlciBvYnNlcnZlIFZ1ZSBwdWJsaWMgaW5zdGFuY2VzLlxyXG4gICAgICAgIGlmIChrZXkgPT09IFwiX192X3NraXBcIiAvKiBTS0lQICovKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkYXRhIC8gcHJvcHMgLyBjdHhcclxuICAgICAgICAvLyBUaGlzIGdldHRlciBnZXRzIGNhbGxlZCBmb3IgZXZlcnkgcHJvcGVydHkgYWNjZXNzIG9uIHRoZSByZW5kZXIgY29udGV4dFxyXG4gICAgICAgIC8vIGR1cmluZyByZW5kZXIgYW5kIGlzIGEgbWFqb3IgaG90c3BvdC4gVGhlIG1vc3QgZXhwZW5zaXZlIHBhcnQgb2YgdGhpc1xyXG4gICAgICAgIC8vIGlzIHRoZSBtdWx0aXBsZSBoYXNPd24oKSBjYWxscy4gSXQncyBtdWNoIGZhc3RlciB0byBkbyBhIHNpbXBsZSBwcm9wZXJ0eVxyXG4gICAgICAgIC8vIGFjY2VzcyBvbiBhIHBsYWluIG9iamVjdCwgc28gd2UgdXNlIGFuIGFjY2Vzc0NhY2hlIG9iamVjdCAod2l0aCBudWxsXHJcbiAgICAgICAgLy8gcHJvdG90eXBlKSB0byBtZW1vaXplIHdoYXQgYWNjZXNzIHR5cGUgYSBrZXkgY29ycmVzcG9uZHMgdG8uXHJcbiAgICAgICAgbGV0IG5vcm1hbGl6ZWRQcm9wcztcclxuICAgICAgICBpZiAoa2V5WzBdICE9PSAnJCcpIHtcclxuICAgICAgICAgICAgY29uc3QgbiA9IGFjY2Vzc0NhY2hlW2tleV07XHJcbiAgICAgICAgICAgIGlmIChuICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMCAvKiBTRVRVUCAqLzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNldHVwU3RhdGVba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDEgLyogREFUQSAqLzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDMgLyogQ09OVEVYVCAqLzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0eFtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMiAvKiBQUk9QUyAqLzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdDoganVzdCBmYWxsdGhyb3VnaFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHNldHVwU3RhdGUgIT09IEVNUFRZX09CSiAmJiBoYXNPd24oc2V0dXBTdGF0ZSwga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzQ2FjaGVba2V5XSA9IDAgLyogU0VUVVAgKi87XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V0dXBTdGF0ZVtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGRhdGEgIT09IEVNUFRZX09CSiAmJiBoYXNPd24oZGF0YSwga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzQ2FjaGVba2V5XSA9IDEgLyogREFUQSAqLztcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoXHJcbiAgICAgICAgICAgIC8vIG9ubHkgY2FjaGUgb3RoZXIgcHJvcGVydGllcyB3aGVuIGluc3RhbmNlIGhhcyBkZWNsYXJlZCAodGh1cyBzdGFibGUpXHJcbiAgICAgICAgICAgIC8vIHByb3BzXHJcbiAgICAgICAgICAgIChub3JtYWxpemVkUHJvcHMgPSBub3JtYWxpemVQcm9wc09wdGlvbnModHlwZSlbMF0pICYmXHJcbiAgICAgICAgICAgICAgICBoYXNPd24obm9ybWFsaXplZFByb3BzLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NDYWNoZVtrZXldID0gMiAvKiBQUk9QUyAqLztcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wc1trZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGN0eCAhPT0gRU1QVFlfT0JKICYmIGhhc093bihjdHgsIGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGFjY2Vzc0NhY2hlW2tleV0gPSAzIC8qIENPTlRFWFQgKi87XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4W2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NDYWNoZVtrZXldID0gNCAvKiBPVEhFUiAqLztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwdWJsaWNHZXR0ZXIgPSBwdWJsaWNQcm9wZXJ0aWVzTWFwW2tleV07XHJcbiAgICAgICAgbGV0IGNzc01vZHVsZSwgZ2xvYmFsUHJvcGVydGllcztcclxuICAgICAgICAvLyBwdWJsaWMgJHh4eCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgaWYgKHB1YmxpY0dldHRlcikge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnJGF0dHJzJykge1xyXG4gICAgICAgICAgICAgICAgdHJhY2soaW5zdGFuY2UsIFwiZ2V0XCIgLyogR0VUICovLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIG1hcmtBdHRyc0FjY2Vzc2VkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHB1YmxpY0dldHRlcihpbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFxyXG4gICAgICAgIC8vIGNzcyBtb2R1bGUgKGluamVjdGVkIGJ5IHZ1ZS1sb2FkZXIpXHJcbiAgICAgICAgKGNzc01vZHVsZSA9IHR5cGUuX19jc3NNb2R1bGVzKSAmJlxyXG4gICAgICAgICAgICAoY3NzTW9kdWxlID0gY3NzTW9kdWxlW2tleV0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjc3NNb2R1bGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGN0eCAhPT0gRU1QVFlfT0JKICYmIGhhc093bihjdHgsIGtleSkpIHtcclxuICAgICAgICAgICAgLy8gdXNlciBtYXkgc2V0IGN1c3RvbSBwcm9wZXJ0aWVzIHRvIGB0aGlzYCB0aGF0IHN0YXJ0IHdpdGggYCRgXHJcbiAgICAgICAgICAgIGFjY2Vzc0NhY2hlW2tleV0gPSAzIC8qIENPTlRFWFQgKi87XHJcbiAgICAgICAgICAgIHJldHVybiBjdHhba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoXHJcbiAgICAgICAgLy8gZ2xvYmFsIHByb3BlcnRpZXNcclxuICAgICAgICAoKGdsb2JhbFByb3BlcnRpZXMgPSBhcHBDb250ZXh0LmNvbmZpZy5nbG9iYWxQcm9wZXJ0aWVzKSxcclxuICAgICAgICAgICAgaGFzT3duKGdsb2JhbFByb3BlcnRpZXMsIGtleSkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxQcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJlxyXG4gICAgICAgICAgICBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UgJiZcclxuICAgICAgICAgICAgLy8gIzEwOTEgYXZvaWQgaW50ZXJuYWwgaXNSZWYvaXNWTm9kZSBjaGVja3Mgb24gY29tcG9uZW50IGluc3RhbmNlIGxlYWRpbmdcclxuICAgICAgICAgICAgLy8gdG8gaW5maW5pdGUgd2FybmluZyBsb29wXHJcbiAgICAgICAgICAgIGtleS5pbmRleE9mKCdfX3YnKSAhPT0gMCkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAhPT0gRU1QVFlfT0JKICYmIGtleVswXSA9PT0gJyQnICYmIGhhc093bihkYXRhLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuKGBQcm9wZXJ0eSAke0pTT04uc3RyaW5naWZ5KGtleSl9IG11c3QgYmUgYWNjZXNzZWQgdmlhICRkYXRhIGJlY2F1c2UgaXQgc3RhcnRzIHdpdGggYSByZXNlcnZlZCBgICtcclxuICAgICAgICAgICAgICAgICAgICBgY2hhcmFjdGVyIGFuZCBpcyBub3QgcHJveGllZCBvbiB0aGUgcmVuZGVyIGNvbnRleHQuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuKGBQcm9wZXJ0eSAke0pTT04uc3RyaW5naWZ5KGtleSl9IHdhcyBhY2Nlc3NlZCBkdXJpbmcgcmVuZGVyIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGBidXQgaXMgbm90IGRlZmluZWQgb24gaW5zdGFuY2UuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2V0KHsgXzogaW5zdGFuY2UgfSwga2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGNvbnN0IHsgZGF0YSwgc2V0dXBTdGF0ZSwgY3R4IH0gPSBpbnN0YW5jZTtcclxuICAgICAgICBpZiAoc2V0dXBTdGF0ZSAhPT0gRU1QVFlfT0JKICYmIGhhc093bihzZXR1cFN0YXRlLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIHNldHVwU3RhdGVba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkYXRhICE9PSBFTVBUWV9PQkogJiYgaGFzT3duKGRhdGEsIGtleSkpIHtcclxuICAgICAgICAgICAgZGF0YVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGtleSBpbiBpbnN0YW5jZS5wcm9wcykge1xyXG4gICAgICAgICAgICAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiZcclxuICAgICAgICAgICAgICAgIHdhcm4oYEF0dGVtcHRpbmcgdG8gbXV0YXRlIHByb3AgXCIke2tleX1cIi4gUHJvcHMgYXJlIHJlYWRvbmx5LmAsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoa2V5WzBdID09PSAnJCcgJiYga2V5LnNsaWNlKDEpIGluIGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJlxyXG4gICAgICAgICAgICAgICAgd2FybihgQXR0ZW1wdGluZyB0byBtdXRhdGUgcHVibGljIHByb3BlcnR5IFwiJHtrZXl9XCIuIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGBQcm9wZXJ0aWVzIHN0YXJ0aW5nIHdpdGggJCBhcmUgcmVzZXJ2ZWQgYW5kIHJlYWRvbmx5LmAsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBrZXkgaW4gaW5zdGFuY2UuYXBwQ29udGV4dC5jb25maWcuZ2xvYmFsUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0eCwga2V5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3R4W2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBoYXMoeyBfOiB7IGRhdGEsIHNldHVwU3RhdGUsIGFjY2Vzc0NhY2hlLCBjdHgsIHR5cGUsIGFwcENvbnRleHQgfSB9LCBrZXkpIHtcclxuICAgICAgICBsZXQgbm9ybWFsaXplZFByb3BzO1xyXG4gICAgICAgIHJldHVybiAoYWNjZXNzQ2FjaGVba2V5XSAhPT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgIChkYXRhICE9PSBFTVBUWV9PQkogJiYgaGFzT3duKGRhdGEsIGtleSkpIHx8XHJcbiAgICAgICAgICAgIChzZXR1cFN0YXRlICE9PSBFTVBUWV9PQkogJiYgaGFzT3duKHNldHVwU3RhdGUsIGtleSkpIHx8XHJcbiAgICAgICAgICAgICgobm9ybWFsaXplZFByb3BzID0gbm9ybWFsaXplUHJvcHNPcHRpb25zKHR5cGUpWzBdKSAmJlxyXG4gICAgICAgICAgICAgICAgaGFzT3duKG5vcm1hbGl6ZWRQcm9wcywga2V5KSkgfHxcclxuICAgICAgICAgICAgaGFzT3duKGN0eCwga2V5KSB8fFxyXG4gICAgICAgICAgICBoYXNPd24ocHVibGljUHJvcGVydGllc01hcCwga2V5KSB8fFxyXG4gICAgICAgICAgICBoYXNPd24oYXBwQ29udGV4dC5jb25maWcuZ2xvYmFsUHJvcGVydGllcywga2V5KSk7XHJcbiAgICB9XHJcbn07XHJcbmlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIWZhbHNlKSB7XHJcbiAgICBQdWJsaWNJbnN0YW5jZVByb3h5SGFuZGxlcnMub3duS2V5cyA9ICh0YXJnZXQpID0+IHtcclxuICAgICAgICB3YXJuKGBBdm9pZCBhcHAgbG9naWMgdGhhdCByZWxpZXMgb24gZW51bWVyYXRpbmcga2V5cyBvbiBhIGNvbXBvbmVudCBpbnN0YW5jZS4gYCArXHJcbiAgICAgICAgICAgIGBUaGUga2V5cyB3aWxsIGJlIGVtcHR5IGluIHByb2R1Y3Rpb24gbW9kZSB0byBhdm9pZCBwZXJmb3JtYW5jZSBvdmVyaGVhZC5gKTtcclxuICAgICAgICByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XHJcbiAgICB9O1xyXG59XHJcbmNvbnN0IFJ1bnRpbWVDb21waWxlZFB1YmxpY0luc3RhbmNlUHJveHlIYW5kbGVycyA9IGV4dGVuZCh7fSwgUHVibGljSW5zdGFuY2VQcm94eUhhbmRsZXJzLCB7XHJcbiAgICBnZXQodGFyZ2V0LCBrZXkpIHtcclxuICAgICAgICAvLyBmYXN0IHBhdGggZm9yIHVuc2NvcGFibGVzIHdoZW4gdXNpbmcgYHdpdGhgIGJsb2NrXHJcbiAgICAgICAgaWYgKGtleSA9PT0gU3ltYm9sLnVuc2NvcGFibGVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFB1YmxpY0luc3RhbmNlUHJveHlIYW5kbGVycy5nZXQodGFyZ2V0LCBrZXksIHRhcmdldCk7XHJcbiAgICB9LFxyXG4gICAgaGFzKF8sIGtleSkge1xyXG4gICAgICAgIGNvbnN0IGhhcyA9IGtleVswXSAhPT0gJ18nICYmICFpc0dsb2JhbGx5V2hpdGVsaXN0ZWQoa2V5KTtcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmICFoYXMgJiYgUHVibGljSW5zdGFuY2VQcm94eUhhbmRsZXJzLmhhcyhfLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIHdhcm4oYFByb3BlcnR5ICR7SlNPTi5zdHJpbmdpZnkoa2V5KX0gc2hvdWxkIG5vdCBzdGFydCB3aXRoIF8gd2hpY2ggaXMgYSByZXNlcnZlZCBwcmVmaXggZm9yIFZ1ZSBpbnRlcm5hbHMuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBoYXM7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyBJbiBkZXYgbW9kZSwgdGhlIHByb3h5IHRhcmdldCBleHBvc2VzIHRoZSBzYW1lIHByb3BlcnRpZXMgYXMgc2VlbiBvbiBgdGhpc2BcclxuLy8gZm9yIGVhc2llciBjb25zb2xlIGluc3BlY3Rpb24uIEluIHByb2QgbW9kZSBpdCB3aWxsIGJlIGFuIGVtcHR5IG9iamVjdCBzb1xyXG4vLyB0aGVzZSBwcm9wZXJ0aWVzIGRlZmluaXRpb25zIGNhbiBiZSBza2lwcGVkLlxyXG5mdW5jdGlvbiBjcmVhdGVSZW5kZXJDb250ZXh0KGluc3RhbmNlKSB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSB7fTtcclxuICAgIC8vIGV4cG9zZSBpbnRlcm5hbCBpbnN0YW5jZSBmb3IgcHJveHkgaGFuZGxlcnNcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGBfYCwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBnZXQ6ICgpID0+IGluc3RhbmNlXHJcbiAgICB9KTtcclxuICAgIC8vIGV4cG9zZSBwdWJsaWMgcHJvcGVydGllc1xyXG4gICAgT2JqZWN0LmtleXMocHVibGljUHJvcGVydGllc01hcCkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBnZXQ6ICgpID0+IHB1YmxpY1Byb3BlcnRpZXNNYXBba2V5XShpbnN0YW5jZSksXHJcbiAgICAgICAgICAgIC8vIGludGVyY2VwdGVkIGJ5IHRoZSBwcm94eSBzbyBubyBuZWVkIGZvciBpbXBsZW1lbnRhdGlvbixcclxuICAgICAgICAgICAgLy8gYnV0IG5lZWRlZCB0byBwcmV2ZW50IHNldCBlcnJvcnNcclxuICAgICAgICAgICAgc2V0OiBOT09QXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIC8vIGV4cG9zZSBnbG9iYWwgcHJvcGVydGllc1xyXG4gICAgY29uc3QgeyBnbG9iYWxQcm9wZXJ0aWVzIH0gPSBpbnN0YW5jZS5hcHBDb250ZXh0LmNvbmZpZztcclxuICAgIE9iamVjdC5rZXlzKGdsb2JhbFByb3BlcnRpZXMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgZ2V0OiAoKSA9PiBnbG9iYWxQcm9wZXJ0aWVzW2tleV0sXHJcbiAgICAgICAgICAgIHNldDogTk9PUFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG59XHJcbi8vIGRldiBvbmx5XHJcbmZ1bmN0aW9uIGV4cG9zZVByb3BzT25SZW5kZXJDb250ZXh0KGluc3RhbmNlKSB7XHJcbiAgICBjb25zdCB7IGN0eCwgdHlwZSB9ID0gaW5zdGFuY2U7XHJcbiAgICBjb25zdCBwcm9wc09wdGlvbnMgPSBub3JtYWxpemVQcm9wc09wdGlvbnModHlwZSlbMF07XHJcbiAgICBpZiAocHJvcHNPcHRpb25zKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMocHJvcHNPcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdHgsIGtleSwge1xyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGdldDogKCkgPT4gaW5zdGFuY2UucHJvcHNba2V5XSxcclxuICAgICAgICAgICAgICAgIHNldDogTk9PUFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4vLyBkZXYgb25seVxyXG5mdW5jdGlvbiBleHBvc2VTZXR1cFN0YXRlT25SZW5kZXJDb250ZXh0KGluc3RhbmNlKSB7XHJcbiAgICBjb25zdCB7IGN0eCwgc2V0dXBTdGF0ZSB9ID0gaW5zdGFuY2U7XHJcbiAgICBPYmplY3Qua2V5cyh0b1JhdyhzZXR1cFN0YXRlKSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdHgsIGtleSwge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGdldDogKCkgPT4gc2V0dXBTdGF0ZVtrZXldLFxyXG4gICAgICAgICAgICBzZXQ6IE5PT1BcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XG5cbmNvbnN0IGVtcHR5QXBwQ29udGV4dCA9IGNyZWF0ZUFwcENvbnRleHQoKTtcclxubGV0IHVpZCA9IDA7XHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlKHZub2RlLCBwYXJlbnQsIHN1c3BlbnNlKSB7XHJcbiAgICAvLyBpbmhlcml0IHBhcmVudCBhcHAgY29udGV4dCAtIG9yIC0gaWYgcm9vdCwgYWRvcHQgZnJvbSByb290IHZub2RlXHJcbiAgICBjb25zdCBhcHBDb250ZXh0ID0gKHBhcmVudCA/IHBhcmVudC5hcHBDb250ZXh0IDogdm5vZGUuYXBwQ29udGV4dCkgfHwgZW1wdHlBcHBDb250ZXh0O1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSB7XHJcbiAgICAgICAgdWlkOiB1aWQrKyxcclxuICAgICAgICB2bm9kZSxcclxuICAgICAgICBwYXJlbnQsXHJcbiAgICAgICAgYXBwQ29udGV4dCxcclxuICAgICAgICB0eXBlOiB2bm9kZS50eXBlLFxyXG4gICAgICAgIHJvb3Q6IG51bGwsXHJcbiAgICAgICAgbmV4dDogbnVsbCxcclxuICAgICAgICBzdWJUcmVlOiBudWxsLFxyXG4gICAgICAgIHVwZGF0ZTogbnVsbCxcclxuICAgICAgICByZW5kZXI6IG51bGwsXHJcbiAgICAgICAgcHJveHk6IG51bGwsXHJcbiAgICAgICAgd2l0aFByb3h5OiBudWxsLFxyXG4gICAgICAgIGVmZmVjdHM6IG51bGwsXHJcbiAgICAgICAgcHJvdmlkZXM6IHBhcmVudCA/IHBhcmVudC5wcm92aWRlcyA6IE9iamVjdC5jcmVhdGUoYXBwQ29udGV4dC5wcm92aWRlcyksXHJcbiAgICAgICAgYWNjZXNzQ2FjaGU6IG51bGwsXHJcbiAgICAgICAgcmVuZGVyQ2FjaGU6IFtdLFxyXG4gICAgICAgIC8vIHN0YXRlXHJcbiAgICAgICAgY3R4OiBFTVBUWV9PQkosXHJcbiAgICAgICAgZGF0YTogRU1QVFlfT0JKLFxyXG4gICAgICAgIHByb3BzOiBFTVBUWV9PQkosXHJcbiAgICAgICAgYXR0cnM6IEVNUFRZX09CSixcclxuICAgICAgICBzbG90czogRU1QVFlfT0JKLFxyXG4gICAgICAgIHJlZnM6IEVNUFRZX09CSixcclxuICAgICAgICBzZXR1cFN0YXRlOiBFTVBUWV9PQkosXHJcbiAgICAgICAgc2V0dXBDb250ZXh0OiBudWxsLFxyXG4gICAgICAgIC8vIHBlci1pbnN0YW5jZSBhc3NldCBzdG9yYWdlIChtdXRhYmxlIGR1cmluZyBvcHRpb25zIHJlc29sdXRpb24pXHJcbiAgICAgICAgY29tcG9uZW50czogT2JqZWN0LmNyZWF0ZShhcHBDb250ZXh0LmNvbXBvbmVudHMpLFxyXG4gICAgICAgIGRpcmVjdGl2ZXM6IE9iamVjdC5jcmVhdGUoYXBwQ29udGV4dC5kaXJlY3RpdmVzKSxcclxuICAgICAgICAvLyBzdXNwZW5zZSByZWxhdGVkXHJcbiAgICAgICAgc3VzcGVuc2UsXHJcbiAgICAgICAgYXN5bmNEZXA6IG51bGwsXHJcbiAgICAgICAgYXN5bmNSZXNvbHZlZDogZmFsc2UsXHJcbiAgICAgICAgLy8gbGlmZWN5Y2xlIGhvb2tzXHJcbiAgICAgICAgLy8gbm90IHVzaW5nIGVudW1zIGhlcmUgYmVjYXVzZSBpdCByZXN1bHRzIGluIGNvbXB1dGVkIHByb3BlcnRpZXNcclxuICAgICAgICBpc01vdW50ZWQ6IGZhbHNlLFxyXG4gICAgICAgIGlzVW5tb3VudGVkOiBmYWxzZSxcclxuICAgICAgICBpc0RlYWN0aXZhdGVkOiBmYWxzZSxcclxuICAgICAgICBiYzogbnVsbCxcclxuICAgICAgICBjOiBudWxsLFxyXG4gICAgICAgIGJtOiBudWxsLFxyXG4gICAgICAgIG06IG51bGwsXHJcbiAgICAgICAgYnU6IG51bGwsXHJcbiAgICAgICAgdTogbnVsbCxcclxuICAgICAgICB1bTogbnVsbCxcclxuICAgICAgICBidW06IG51bGwsXHJcbiAgICAgICAgZGE6IG51bGwsXHJcbiAgICAgICAgYTogbnVsbCxcclxuICAgICAgICBydGc6IG51bGwsXHJcbiAgICAgICAgcnRjOiBudWxsLFxyXG4gICAgICAgIGVjOiBudWxsLFxyXG4gICAgICAgIGVtaXQ6IG51bGwsXHJcbiAgICAgICAgZW1pdHRlZDogbnVsbFxyXG4gICAgfTtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICBpbnN0YW5jZS5jdHggPSBjcmVhdGVSZW5kZXJDb250ZXh0KGluc3RhbmNlKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGluc3RhbmNlLmN0eCA9IHsgXzogaW5zdGFuY2UgfTtcclxuICAgIH1cclxuICAgIGluc3RhbmNlLnJvb3QgPSBwYXJlbnQgPyBwYXJlbnQucm9vdCA6IGluc3RhbmNlO1xyXG4gICAgaW5zdGFuY2UuZW1pdCA9IGVtaXQuYmluZChudWxsLCBpbnN0YW5jZSk7XHJcbiAgICAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgY29tcG9uZW50QWRkZWQoaW5zdGFuY2UpO1xyXG4gICAgcmV0dXJuIGluc3RhbmNlO1xyXG59XHJcbmxldCBjdXJyZW50SW5zdGFuY2UgPSBudWxsO1xyXG5jb25zdCBnZXRDdXJyZW50SW5zdGFuY2UgPSAoKSA9PiBjdXJyZW50SW5zdGFuY2UgfHwgY3VycmVudFJlbmRlcmluZ0luc3RhbmNlO1xyXG5jb25zdCBzZXRDdXJyZW50SW5zdGFuY2UgPSAoaW5zdGFuY2UpID0+IHtcclxuICAgIGN1cnJlbnRJbnN0YW5jZSA9IGluc3RhbmNlO1xyXG59O1xyXG5jb25zdCBpc0J1aWx0SW5UYWcgPSAvKiNfX1BVUkVfXyovIG1ha2VNYXAoJ3Nsb3QsY29tcG9uZW50Jyk7XHJcbmZ1bmN0aW9uIHZhbGlkYXRlQ29tcG9uZW50TmFtZShuYW1lLCBjb25maWcpIHtcclxuICAgIGNvbnN0IGFwcElzTmF0aXZlVGFnID0gY29uZmlnLmlzTmF0aXZlVGFnIHx8IE5PO1xyXG4gICAgaWYgKGlzQnVpbHRJblRhZyhuYW1lKSB8fCBhcHBJc05hdGl2ZVRhZyhuYW1lKSkge1xyXG4gICAgICAgIHdhcm4oJ0RvIG5vdCB1c2UgYnVpbHQtaW4gb3IgcmVzZXJ2ZWQgSFRNTCBlbGVtZW50cyBhcyBjb21wb25lbnQgaWQ6ICcgKyBuYW1lKTtcclxuICAgIH1cclxufVxyXG5sZXQgaXNJblNTUkNvbXBvbmVudFNldHVwID0gZmFsc2U7XHJcbmZ1bmN0aW9uIHNldHVwQ29tcG9uZW50KGluc3RhbmNlLCBpc1NTUiA9IGZhbHNlKSB7XHJcbiAgICBpc0luU1NSQ29tcG9uZW50U2V0dXAgPSBpc1NTUjtcclxuICAgIGNvbnN0IHsgcHJvcHMsIGNoaWxkcmVuLCBzaGFwZUZsYWcgfSA9IGluc3RhbmNlLnZub2RlO1xyXG4gICAgY29uc3QgaXNTdGF0ZWZ1bCA9IHNoYXBlRmxhZyAmIDQgLyogU1RBVEVGVUxfQ09NUE9ORU5UICovO1xyXG4gICAgaW5pdFByb3BzKGluc3RhbmNlLCBwcm9wcywgaXNTdGF0ZWZ1bCwgaXNTU1IpO1xyXG4gICAgaW5pdFNsb3RzKGluc3RhbmNlLCBjaGlsZHJlbik7XHJcbiAgICBjb25zdCBzZXR1cFJlc3VsdCA9IGlzU3RhdGVmdWxcclxuICAgICAgICA/IHNldHVwU3RhdGVmdWxDb21wb25lbnQoaW5zdGFuY2UsIGlzU1NSKVxyXG4gICAgICAgIDogdW5kZWZpbmVkO1xyXG4gICAgaXNJblNTUkNvbXBvbmVudFNldHVwID0gZmFsc2U7XHJcbiAgICByZXR1cm4gc2V0dXBSZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gc2V0dXBTdGF0ZWZ1bENvbXBvbmVudChpbnN0YW5jZSwgaXNTU1IpIHtcclxuICAgIGNvbnN0IENvbXBvbmVudCA9IGluc3RhbmNlLnR5cGU7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgaWYgKENvbXBvbmVudC5uYW1lKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlQ29tcG9uZW50TmFtZShDb21wb25lbnQubmFtZSwgaW5zdGFuY2UuYXBwQ29udGV4dC5jb25maWcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoQ29tcG9uZW50LmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgY29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyhDb21wb25lbnQuY29tcG9uZW50cyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlQ29tcG9uZW50TmFtZShuYW1lc1tpXSwgaW5zdGFuY2UuYXBwQ29udGV4dC5jb25maWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChDb21wb25lbnQuZGlyZWN0aXZlcykge1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lcyA9IE9iamVjdC5rZXlzKENvbXBvbmVudC5kaXJlY3RpdmVzKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGVEaXJlY3RpdmVOYW1lKG5hbWVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIDAuIGNyZWF0ZSByZW5kZXIgcHJveHkgcHJvcGVydHkgYWNjZXNzIGNhY2hlXHJcbiAgICBpbnN0YW5jZS5hY2Nlc3NDYWNoZSA9IHt9O1xyXG4gICAgLy8gMS4gY3JlYXRlIHB1YmxpYyBpbnN0YW5jZSAvIHJlbmRlciBwcm94eVxyXG4gICAgLy8gYWxzbyBtYXJrIGl0IHJhdyBzbyBpdCdzIG5ldmVyIG9ic2VydmVkXHJcbiAgICBpbnN0YW5jZS5wcm94eSA9IG5ldyBQcm94eShpbnN0YW5jZS5jdHgsIFB1YmxpY0luc3RhbmNlUHJveHlIYW5kbGVycyk7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgZXhwb3NlUHJvcHNPblJlbmRlckNvbnRleHQoaW5zdGFuY2UpO1xyXG4gICAgfVxyXG4gICAgLy8gMi4gY2FsbCBzZXR1cCgpXHJcbiAgICBjb25zdCB7IHNldHVwIH0gPSBDb21wb25lbnQ7XHJcbiAgICBpZiAoc2V0dXApIHtcclxuICAgICAgICBjb25zdCBzZXR1cENvbnRleHQgPSAoaW5zdGFuY2Uuc2V0dXBDb250ZXh0ID1cclxuICAgICAgICAgICAgc2V0dXAubGVuZ3RoID4gMSA/IGNyZWF0ZVNldHVwQ29udGV4dChpbnN0YW5jZSkgOiBudWxsKTtcclxuICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSBpbnN0YW5jZTtcclxuICAgICAgICBwYXVzZVRyYWNraW5nKCk7XHJcbiAgICAgICAgY29uc3Qgc2V0dXBSZXN1bHQgPSBjYWxsV2l0aEVycm9ySGFuZGxpbmcoc2V0dXAsIGluc3RhbmNlLCAwIC8qIFNFVFVQX0ZVTkNUSU9OICovLCBbKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpID8gc2hhbGxvd1JlYWRvbmx5KGluc3RhbmNlLnByb3BzKSA6IGluc3RhbmNlLnByb3BzLCBzZXR1cENvbnRleHRdKTtcclxuICAgICAgICByZXNldFRyYWNraW5nKCk7XHJcbiAgICAgICAgY3VycmVudEluc3RhbmNlID0gbnVsbDtcclxuICAgICAgICBpZiAoaXNQcm9taXNlKHNldHVwUmVzdWx0KSkge1xyXG4gICAgICAgICAgICBpZiAoaXNTU1IpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJldHVybiB0aGUgcHJvbWlzZSBzbyBzZXJ2ZXItcmVuZGVyZXIgY2FuIHdhaXQgb24gaXRcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZXR1cFJlc3VsdC50aGVuKChyZXNvbHZlZFJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVNldHVwUmVzdWx0KGluc3RhbmNlLCByZXNvbHZlZFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGFzeW5jIHNldHVwIHJldHVybmVkIFByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAvLyBiYWlsIGhlcmUgYW5kIHdhaXQgZm9yIHJlLWVudHJ5LlxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuYXN5bmNEZXAgPSBzZXR1cFJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaGFuZGxlU2V0dXBSZXN1bHQoaW5zdGFuY2UsIHNldHVwUmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmaW5pc2hDb21wb25lbnRTZXR1cChpbnN0YW5jZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaGFuZGxlU2V0dXBSZXN1bHQoaW5zdGFuY2UsIHNldHVwUmVzdWx0LCBpc1NTUikge1xyXG4gICAgaWYgKGlzRnVuY3Rpb24oc2V0dXBSZXN1bHQpKSB7XHJcbiAgICAgICAgLy8gc2V0dXAgcmV0dXJuZWQgYW4gaW5saW5lIHJlbmRlciBmdW5jdGlvblxyXG4gICAgICAgIGluc3RhbmNlLnJlbmRlciA9IHNldHVwUmVzdWx0O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNPYmplY3Qoc2V0dXBSZXN1bHQpKSB7XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBpc1ZOb2RlKHNldHVwUmVzdWx0KSkge1xyXG4gICAgICAgICAgICB3YXJuKGBzZXR1cCgpIHNob3VsZCBub3QgcmV0dXJuIFZOb2RlcyBkaXJlY3RseSAtIGAgK1xyXG4gICAgICAgICAgICAgICAgYHJldHVybiBhIHJlbmRlciBmdW5jdGlvbiBpbnN0ZWFkLmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXR1cCByZXR1cm5lZCBiaW5kaW5ncy5cclxuICAgICAgICAvLyBhc3N1bWluZyBhIHJlbmRlciBmdW5jdGlvbiBjb21waWxlZCBmcm9tIHRlbXBsYXRlIGlzIHByZXNlbnQuXHJcbiAgICAgICAgaW5zdGFuY2Uuc2V0dXBTdGF0ZSA9IHJlYWN0aXZlKHNldHVwUmVzdWx0KTtcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgIGV4cG9zZVNldHVwU3RhdGVPblJlbmRlckNvbnRleHQoaW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBzZXR1cFJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgd2Fybihgc2V0dXAoKSBzaG91bGQgcmV0dXJuIGFuIG9iamVjdC4gUmVjZWl2ZWQ6ICR7c2V0dXBSZXN1bHQgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2Ygc2V0dXBSZXN1bHR9YCk7XHJcbiAgICB9XHJcbiAgICBmaW5pc2hDb21wb25lbnRTZXR1cChpbnN0YW5jZSk7XHJcbn1cclxubGV0IGNvbXBpbGU7XHJcbi8qKlxyXG4gKiBGb3IgcnVudGltZS1kb20gdG8gcmVnaXN0ZXIgdGhlIGNvbXBpbGVyLlxyXG4gKiBOb3RlIHRoZSBleHBvcnRlZCBtZXRob2QgdXNlcyBhbnkgdG8gYXZvaWQgZC50cyByZWx5aW5nIG9uIHRoZSBjb21waWxlciB0eXBlcy5cclxuICovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyUnVudGltZUNvbXBpbGVyKF9jb21waWxlKSB7XHJcbiAgICBjb21waWxlID0gX2NvbXBpbGU7XHJcbn1cclxuZnVuY3Rpb24gZmluaXNoQ29tcG9uZW50U2V0dXAoaW5zdGFuY2UsIGlzU1NSKSB7XHJcbiAgICBjb25zdCBDb21wb25lbnQgPSBpbnN0YW5jZS50eXBlO1xyXG4gICAgLy8gdGVtcGxhdGUgLyByZW5kZXIgZnVuY3Rpb24gbm9ybWFsaXphdGlvblxyXG4gICAgaWYgKCFpbnN0YW5jZS5yZW5kZXIpIHtcclxuICAgICAgICBpZiAoY29tcGlsZSAmJiBDb21wb25lbnQudGVtcGxhdGUgJiYgIUNvbXBvbmVudC5yZW5kZXIpIHtcclxuICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRNZWFzdXJlKGluc3RhbmNlLCBgY29tcGlsZWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIENvbXBvbmVudC5yZW5kZXIgPSBjb21waWxlKENvbXBvbmVudC50ZW1wbGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgaXNDdXN0b21FbGVtZW50OiBpbnN0YW5jZS5hcHBDb250ZXh0LmNvbmZpZy5pc0N1c3RvbUVsZW1lbnQgfHwgTk9cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgIGVuZE1lYXN1cmUoaW5zdGFuY2UsIGBjb21waWxlYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQ29tcG9uZW50LnJlbmRlci5fcmMgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmICFDb21wb25lbnQucmVuZGVyKSB7XHJcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgICAgICBpZiAoIWNvbXBpbGUgJiYgQ29tcG9uZW50LnRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuKGBDb21wb25lbnQgcHJvdmlkZWQgdGVtcGxhdGUgb3B0aW9uIGJ1dCBgICtcclxuICAgICAgICAgICAgICAgICAgICBgcnVudGltZSBjb21waWxhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnVpbGQgb2YgVnVlLmAgK1xyXG4gICAgICAgICAgICAgICAgICAgICggYCBDb25maWd1cmUgeW91ciBidW5kbGVyIHRvIGFsaWFzIFwidnVlXCIgdG8gXCJ2dWUvZGlzdC92dWUuZXNtLWJ1bmRsZXIuanNcIi5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkgLyogc2hvdWxkIG5vdCBoYXBwZW4gKi8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2FybihgQ29tcG9uZW50IGlzIG1pc3NpbmcgdGVtcGxhdGUgb3IgcmVuZGVyIGZ1bmN0aW9uLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluc3RhbmNlLnJlbmRlciA9IChDb21wb25lbnQucmVuZGVyIHx8IE5PT1ApO1xyXG4gICAgICAgIC8vIGZvciBydW50aW1lLWNvbXBpbGVkIHJlbmRlciBmdW5jdGlvbnMgdXNpbmcgYHdpdGhgIGJsb2NrcywgdGhlIHJlbmRlclxyXG4gICAgICAgIC8vIHByb3h5IHVzZWQgbmVlZHMgYSBkaWZmZXJlbnQgYGhhc2AgaGFuZGxlciB3aGljaCBpcyBtb3JlIHBlcmZvcm1hbnQgYW5kXHJcbiAgICAgICAgLy8gYWxzbyBvbmx5IGFsbG93cyBhIHdoaXRlbGlzdCBvZiBnbG9iYWxzIHRvIGZhbGx0aHJvdWdoLlxyXG4gICAgICAgIGlmIChpbnN0YW5jZS5yZW5kZXIuX3JjKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLndpdGhQcm94eSA9IG5ldyBQcm94eShpbnN0YW5jZS5jdHgsIFJ1bnRpbWVDb21waWxlZFB1YmxpY0luc3RhbmNlUHJveHlIYW5kbGVycyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gc3VwcG9ydCBmb3IgMi54IG9wdGlvbnNcclxuICAgIHtcclxuICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSBpbnN0YW5jZTtcclxuICAgICAgICBhcHBseU9wdGlvbnMoaW5zdGFuY2UsIENvbXBvbmVudCk7XHJcbiAgICAgICAgY3VycmVudEluc3RhbmNlID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5jb25zdCBhdHRySGFuZGxlcnMgPSB7XHJcbiAgICBnZXQ6ICh0YXJnZXQsIGtleSkgPT4ge1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgbWFya0F0dHJzQWNjZXNzZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldFtrZXldO1xyXG4gICAgfSxcclxuICAgIHNldDogKCkgPT4ge1xyXG4gICAgICAgIHdhcm4oYHNldHVwQ29udGV4dC5hdHRycyBpcyByZWFkb25seS5gKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgZGVsZXRlUHJvcGVydHk6ICgpID0+IHtcclxuICAgICAgICB3YXJuKGBzZXR1cENvbnRleHQuYXR0cnMgaXMgcmVhZG9ubHkuYCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59O1xyXG5mdW5jdGlvbiBjcmVhdGVTZXR1cENvbnRleHQoaW5zdGFuY2UpIHtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAvLyBXZSB1c2UgZ2V0dGVycyBpbiBkZXYgaW4gY2FzZSBsaWJzIGxpa2UgdGVzdC11dGlscyBvdmVyd3JpdGUgaW5zdGFuY2VcclxuICAgICAgICAvLyBwcm9wZXJ0aWVzIChvdmVyd3JpdGVzIHNob3VsZCBub3QgYmUgZG9uZSBpbiBwcm9kKVxyXG4gICAgICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcclxuICAgICAgICAgICAgZ2V0IGF0dHJzKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm94eShpbnN0YW5jZS5hdHRycywgYXR0ckhhbmRsZXJzKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0IHNsb3RzKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNoYWxsb3dSZWFkb25seShpbnN0YW5jZS5zbG90cyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldCBlbWl0KCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChldmVudCwgLi4uYXJncykgPT4gaW5zdGFuY2UuZW1pdChldmVudCwgLi4uYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGF0dHJzOiBpbnN0YW5jZS5hdHRycyxcclxuICAgICAgICAgICAgc2xvdHM6IGluc3RhbmNlLnNsb3RzLFxyXG4gICAgICAgICAgICBlbWl0OiBpbnN0YW5jZS5lbWl0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4vLyByZWNvcmQgZWZmZWN0cyBjcmVhdGVkIGR1cmluZyBhIGNvbXBvbmVudCdzIHNldHVwKCkgc28gdGhhdCB0aGV5IGNhbiBiZVxyXG4vLyBzdG9wcGVkIHdoZW4gdGhlIGNvbXBvbmVudCB1bm1vdW50c1xyXG5mdW5jdGlvbiByZWNvcmRJbnN0YW5jZUJvdW5kRWZmZWN0KGVmZmVjdCkge1xyXG4gICAgaWYgKGN1cnJlbnRJbnN0YW5jZSkge1xyXG4gICAgICAgIChjdXJyZW50SW5zdGFuY2UuZWZmZWN0cyB8fCAoY3VycmVudEluc3RhbmNlLmVmZmVjdHMgPSBbXSkpLnB1c2goZWZmZWN0KTtcclxuICAgIH1cclxufVxyXG5jb25zdCBjbGFzc2lmeVJFID0gLyg/Ol58Wy1fXSkoXFx3KS9nO1xyXG5jb25zdCBjbGFzc2lmeSA9IChzdHIpID0+IHN0ci5yZXBsYWNlKGNsYXNzaWZ5UkUsIGMgPT4gYy50b1VwcGVyQ2FzZSgpKS5yZXBsYWNlKC9bLV9dL2csICcnKTtcclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuZnVuY3Rpb24gZm9ybWF0Q29tcG9uZW50TmFtZShpbnN0YW5jZSwgQ29tcG9uZW50LCBpc1Jvb3QgPSBmYWxzZSkge1xyXG4gICAgbGV0IG5hbWUgPSBpc0Z1bmN0aW9uKENvbXBvbmVudClcclxuICAgICAgICA/IENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fCBDb21wb25lbnQubmFtZVxyXG4gICAgICAgIDogQ29tcG9uZW50Lm5hbWU7XHJcbiAgICBpZiAoIW5hbWUgJiYgQ29tcG9uZW50Ll9fZmlsZSkge1xyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gQ29tcG9uZW50Ll9fZmlsZS5tYXRjaCgvKFteL1xcXFxdKylcXC52dWUkLyk7XHJcbiAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgIG5hbWUgPSBtYXRjaFsxXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIW5hbWUgJiYgaW5zdGFuY2UgJiYgaW5zdGFuY2UucGFyZW50KSB7XHJcbiAgICAgICAgLy8gdHJ5IHRvIGluZmVyIHRoZSBuYW1lIGJhc2VkIG9uIGxvY2FsIHJlc29sdXRpb25cclxuICAgICAgICBjb25zdCByZWdpc3RyeSA9IGluc3RhbmNlLnBhcmVudC5jb21wb25lbnRzO1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgIGlmIChyZWdpc3RyeVtrZXldID09PSBDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBuYW1lID8gY2xhc3NpZnkobmFtZSkgOiBpc1Jvb3QgPyBgQXBwYCA6IGBBbm9ueW1vdXNgO1xyXG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVkKGdldHRlck9yT3B0aW9ucykge1xyXG4gICAgY29uc3QgYyA9IGNvbXB1dGVkJDEoZ2V0dGVyT3JPcHRpb25zKTtcclxuICAgIHJlY29yZEluc3RhbmNlQm91bmRFZmZlY3QoYy5lZmZlY3QpO1xyXG4gICAgcmV0dXJuIGM7XHJcbn1cblxuLy8gaW1wbGVtZW50YXRpb24sIGNsb3NlIHRvIG5vLW9wXHJcbmZ1bmN0aW9uIGRlZmluZUNvbXBvbmVudChvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gaXNGdW5jdGlvbihvcHRpb25zKSA/IHsgc2V0dXA6IG9wdGlvbnMgfSA6IG9wdGlvbnM7XHJcbn1cblxuZnVuY3Rpb24gZGVmaW5lQXN5bmNDb21wb25lbnQoc291cmNlKSB7XHJcbiAgICBpZiAoaXNGdW5jdGlvbihzb3VyY2UpKSB7XHJcbiAgICAgICAgc291cmNlID0geyBsb2FkZXI6IHNvdXJjZSB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBsb2FkZXIsIGxvYWRpbmdDb21wb25lbnQ6IGxvYWRpbmdDb21wb25lbnQsIGVycm9yQ29tcG9uZW50OiBlcnJvckNvbXBvbmVudCwgZGVsYXkgPSAyMDAsIHRpbWVvdXQsIC8vIHVuZGVmaW5lZCA9IG5ldmVyIHRpbWVzIG91dFxyXG4gICAgc3VzcGVuc2libGUgPSB0cnVlLCBvbkVycm9yOiB1c2VyT25FcnJvciB9ID0gc291cmNlO1xyXG4gICAgbGV0IHBlbmRpbmdSZXF1ZXN0ID0gbnVsbDtcclxuICAgIGxldCByZXNvbHZlZENvbXA7XHJcbiAgICBsZXQgcmV0cmllcyA9IDA7XHJcbiAgICBjb25zdCByZXRyeSA9ICgpID0+IHtcclxuICAgICAgICByZXRyaWVzKys7XHJcbiAgICAgICAgcGVuZGluZ1JlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIHJldHVybiBsb2FkKCk7XHJcbiAgICB9O1xyXG4gICAgY29uc3QgbG9hZCA9ICgpID0+IHtcclxuICAgICAgICBsZXQgdGhpc1JlcXVlc3Q7XHJcbiAgICAgICAgcmV0dXJuIChwZW5kaW5nUmVxdWVzdCB8fFxyXG4gICAgICAgICAgICAodGhpc1JlcXVlc3QgPSBwZW5kaW5nUmVxdWVzdCA9IGxvYWRlcigpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIGVyciA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyIDogbmV3IEVycm9yKFN0cmluZyhlcnIpKTtcclxuICAgICAgICAgICAgICAgIGlmICh1c2VyT25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJSZXRyeSA9ICgpID0+IHJlc29sdmUocmV0cnkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJGYWlsID0gKCkgPT4gcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJPbkVycm9yKGVyciwgdXNlclJldHJ5LCB1c2VyRmFpbCwgcmV0cmllcyArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGNvbXApID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzUmVxdWVzdCAhPT0gcGVuZGluZ1JlcXVlc3QgJiYgcGVuZGluZ1JlcXVlc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGVuZGluZ1JlcXVlc3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmICFjb21wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgQXN5bmMgY29tcG9uZW50IGxvYWRlciByZXNvbHZlZCB0byB1bmRlZmluZWQuIGAgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBgSWYgeW91IGFyZSB1c2luZyByZXRyeSgpLCBtYWtlIHN1cmUgdG8gcmV0dXJuIGl0cyByZXR1cm4gdmFsdWUuYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBpbnRlcm9wIG1vZHVsZSBkZWZhdWx0XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChjb21wLl9fZXNNb2R1bGUgfHwgY29tcFtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnTW9kdWxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wID0gY29tcC5kZWZhdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBjb21wICYmICFpc09iamVjdChjb21wKSAmJiAhaXNGdW5jdGlvbihjb21wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhc3luYyBjb21wb25lbnQgbG9hZCByZXN1bHQ6ICR7Y29tcH1gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc29sdmVkQ29tcCA9IGNvbXA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcDtcclxuICAgICAgICAgICAgfSkpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gZGVmaW5lQ29tcG9uZW50KHtcclxuICAgICAgICBfX2FzeW5jTG9hZGVyOiBsb2FkLFxyXG4gICAgICAgIG5hbWU6ICdBc3luY0NvbXBvbmVudFdyYXBwZXInLFxyXG4gICAgICAgIHNldHVwKCkge1xyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnRJbnN0YW5jZTtcclxuICAgICAgICAgICAgLy8gYWxyZWFkeSByZXNvbHZlZFxyXG4gICAgICAgICAgICBpZiAocmVzb2x2ZWRDb21wKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gY3JlYXRlSW5uZXJDb21wKHJlc29sdmVkQ29tcCwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG9uRXJyb3IgPSAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwZW5kaW5nUmVxdWVzdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVFcnJvcihlcnIsIGluc3RhbmNlLCAxMyAvKiBBU1lOQ19DT01QT05FTlRfTE9BREVSICovKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gc3VzcGVuc2UtY29udHJvbGxlZCBvciBTU1IuXHJcbiAgICAgICAgICAgIGlmICgoIHN1c3BlbnNpYmxlICYmIGluc3RhbmNlLnN1c3BlbnNlKSB8fFxyXG4gICAgICAgICAgICAgICAgKGZhbHNlICkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsb2FkKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihjb21wID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gY3JlYXRlSW5uZXJDb21wKGNvbXAsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBlcnJvckNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGNyZWF0ZVZOb2RlKGVycm9yQ29tcG9uZW50LCB7IGVycm9yOiBlcnIgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbG9hZGVkID0gcmVmKGZhbHNlKTtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSByZWYoKTtcclxuICAgICAgICAgICAgY29uc3QgZGVsYXllZCA9IHJlZighIWRlbGF5KTtcclxuICAgICAgICAgICAgaWYgKGRlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxheWVkLnZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9LCBkZWxheSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRpbWVvdXQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2FkZWQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKGBBc3luYyBjb21wb25lbnQgdGltZWQgb3V0IGFmdGVyICR7dGltZW91dH1tcy5gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvci52YWx1ZSA9IGVycjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCB0aW1lb3V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsb2FkKClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxvYWRlZC52YWx1ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIGVycm9yLnZhbHVlID0gZXJyO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2FkZWQudmFsdWUgJiYgcmVzb2x2ZWRDb21wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUlubmVyQ29tcChyZXNvbHZlZENvbXAsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVycm9yLnZhbHVlICYmIGVycm9yQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZOb2RlKGVycm9yQ29tcG9uZW50LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvci52YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobG9hZGluZ0NvbXBvbmVudCAmJiAhZGVsYXllZC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVWTm9kZShsb2FkaW5nQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVJbm5lckNvbXAoY29tcCwgeyB2bm9kZTogeyBwcm9wcywgY2hpbGRyZW4gfSB9KSB7XHJcbiAgICByZXR1cm4gY3JlYXRlVk5vZGUoY29tcCwgcHJvcHMsIGNoaWxkcmVuKTtcclxufVxuXG4vLyBBY3R1YWwgaW1wbGVtZW50YXRpb25cclxuZnVuY3Rpb24gaCh0eXBlLCBwcm9wc09yQ2hpbGRyZW4sIGNoaWxkcmVuKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgIGlmIChpc09iamVjdChwcm9wc09yQ2hpbGRyZW4pICYmICFpc0FycmF5KHByb3BzT3JDaGlsZHJlbikpIHtcclxuICAgICAgICAgICAgLy8gc2luZ2xlIHZub2RlIHdpdGhvdXQgcHJvcHNcclxuICAgICAgICAgICAgaWYgKGlzVk5vZGUocHJvcHNPckNoaWxkcmVuKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZOb2RlKHR5cGUsIG51bGwsIFtwcm9wc09yQ2hpbGRyZW5dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBwcm9wcyB3aXRob3V0IGNoaWxkcmVuXHJcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVWTm9kZSh0eXBlLCBwcm9wc09yQ2hpbGRyZW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gb21pdCBwcm9wc1xyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlVk5vZGUodHlwZSwgbnVsbCwgcHJvcHNPckNoaWxkcmVuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoaXNWTm9kZShjaGlsZHJlbikpIHtcclxuICAgICAgICAgICAgY2hpbGRyZW4gPSBbY2hpbGRyZW5dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3JlYXRlVk5vZGUodHlwZSwgcHJvcHNPckNoaWxkcmVuLCBjaGlsZHJlbik7XHJcbiAgICB9XHJcbn1cblxuY29uc3Qgc3NyQ29udGV4dEtleSA9IFN5bWJvbCgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgPyBgc3NyQ29udGV4dGAgOiBgYCk7XHJcbmNvbnN0IHVzZVNTUkNvbnRleHQgPSAoKSA9PiB7XHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gaW5qZWN0KHNzckNvbnRleHRLZXkpO1xyXG4gICAgICAgIGlmICghY3R4KSB7XHJcbiAgICAgICAgICAgIHdhcm4oYFNlcnZlciByZW5kZXJpbmcgY29udGV4dCBub3QgcHJvdmlkZWQuIE1ha2Ugc3VyZSB0byBvbmx5IGNhbGwgYCArXHJcbiAgICAgICAgICAgICAgICBgdXNlU3NyQ29udGV4dCgpIGNvbmRpdGlvbmFsbHkgaW4gdGhlIHNlcnZlciBidWlsZC5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN0eDtcclxuICAgIH1cclxufTtcblxuLyoqXHJcbiAqIEFjdHVhbCBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gcmVuZGVyTGlzdChzb3VyY2UsIHJlbmRlckl0ZW0pIHtcclxuICAgIGxldCByZXQ7XHJcbiAgICBpZiAoaXNBcnJheShzb3VyY2UpIHx8IGlzU3RyaW5nKHNvdXJjZSkpIHtcclxuICAgICAgICByZXQgPSBuZXcgQXJyYXkoc291cmNlLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBzb3VyY2UubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJldFtpXSA9IHJlbmRlckl0ZW0oc291cmNlW2ldLCBpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2Ygc291cmNlID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIHJldCA9IG5ldyBBcnJheShzb3VyY2UpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc291cmNlOyBpKyspIHtcclxuICAgICAgICAgICAgcmV0W2ldID0gcmVuZGVySXRlbShpICsgMSwgaSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNPYmplY3Qoc291cmNlKSkge1xyXG4gICAgICAgIGlmIChzb3VyY2VbU3ltYm9sLml0ZXJhdG9yXSkge1xyXG4gICAgICAgICAgICByZXQgPSBBcnJheS5mcm9tKHNvdXJjZSwgcmVuZGVySXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcclxuICAgICAgICAgICAgcmV0ID0gbmV3IEFycmF5KGtleXMubGVuZ3RoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgICAgIHJldFtpXSA9IHJlbmRlckl0ZW0oc291cmNlW2tleV0sIGtleSwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXQgPSBbXTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXQ7XHJcbn1cblxuLyoqXHJcbiAqIEZvciBwcmVmaXhpbmcga2V5cyBpbiB2LW9uPVwib2JqXCIgd2l0aCBcIm9uXCJcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIHRvSGFuZGxlcnMob2JqKSB7XHJcbiAgICBjb25zdCByZXQgPSB7fTtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIWlzT2JqZWN0KG9iaikpIHtcclxuICAgICAgICB3YXJuKGB2LW9uIHdpdGggbm8gYXJndW1lbnQgZXhwZWN0cyBhbiBvYmplY3QgdmFsdWUuYCk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xyXG4gICAgICAgIHJldFtgb24ke2NhcGl0YWxpemUoa2V5KX1gXSA9IG9ialtrZXldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldDtcclxufVxuXG4vKipcclxuICogQ29tcGlsZXIgcnVudGltZSBoZWxwZXIgZm9yIHJlbmRlcmluZyBgPHNsb3QvPmBcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIHJlbmRlclNsb3Qoc2xvdHMsIG5hbWUsIHByb3BzID0ge30sIFxyXG4vLyB0aGlzIGlzIG5vdCBhIHVzZXItZmFjaW5nIGZ1bmN0aW9uLCBzbyB0aGUgZmFsbGJhY2sgaXMgYWx3YXlzIGdlbmVyYXRlZCBieVxyXG4vLyB0aGUgY29tcGlsZXIgYW5kIGd1YXJhbnRlZWQgdG8gYmUgYSBmdW5jdGlvbiByZXR1cm5pbmcgYW4gYXJyYXlcclxuZmFsbGJhY2spIHtcclxuICAgIGxldCBzbG90ID0gc2xvdHNbbmFtZV07XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHNsb3QgJiYgc2xvdC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgd2FybihgU1NSLW9wdGltaXplZCBzbG90IGZ1bmN0aW9uIGRldGVjdGVkIGluIGEgbm9uLVNTUi1vcHRpbWl6ZWQgcmVuZGVyIGAgK1xyXG4gICAgICAgICAgICBgZnVuY3Rpb24uIFlvdSBuZWVkIHRvIG1hcmsgdGhpcyBjb21wb25lbnQgd2l0aCAkZHluYW1pYy1zbG90cyBpbiB0aGUgYCArXHJcbiAgICAgICAgICAgIGBwYXJlbnQgdGVtcGxhdGUuYCk7XHJcbiAgICAgICAgc2xvdCA9ICgpID0+IFtdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChvcGVuQmxvY2soKSxcclxuICAgICAgICBjcmVhdGVCbG9jayhGcmFnbWVudCwgeyBrZXk6IHByb3BzLmtleSB9LCBzbG90ID8gc2xvdChwcm9wcykgOiBmYWxsYmFjayA/IGZhbGxiYWNrKCkgOiBbXSwgc2xvdHMuXyA9PT0gMSAvKiBTVEFCTEUgKi9cclxuICAgICAgICAgICAgPyA2NCAvKiBTVEFCTEVfRlJBR01FTlQgKi9cclxuICAgICAgICAgICAgOiAtMiAvKiBCQUlMICovKSk7XHJcbn1cblxuLyoqXHJcbiAqIENvbXBpbGVyIHJ1bnRpbWUgaGVscGVyIGZvciBjcmVhdGluZyBkeW5hbWljIHNsb3RzIG9iamVjdFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlU2xvdHMoc2xvdHMsIGR5bmFtaWNTbG90cykge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkeW5hbWljU2xvdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBzbG90ID0gZHluYW1pY1Nsb3RzW2ldO1xyXG4gICAgICAgIC8vIGFycmF5IG9mIGR5bmFtaWMgc2xvdCBnZW5lcmF0ZWQgYnkgPHRlbXBsYXRlIHYtZm9yPVwiLi4uXCIgI1suLi5dPlxyXG4gICAgICAgIGlmIChpc0FycmF5KHNsb3QpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2xvdC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgc2xvdHNbc2xvdFtqXS5uYW1lXSA9IHNsb3Rbal0uZm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2xvdCkge1xyXG4gICAgICAgICAgICAvLyBjb25kaXRpb25hbCBzaW5nbGUgc2xvdCBnZW5lcmF0ZWQgYnkgPHRlbXBsYXRlIHYtaWY9XCIuLi5cIiAjZm9vPlxyXG4gICAgICAgICAgICBzbG90c1tzbG90Lm5hbWVdID0gc2xvdC5mbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2xvdHM7XHJcbn1cblxuLy8gQ29yZSBBUEkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbmNvbnN0IHZlcnNpb24gPSBcIjMuMC4wLXJjLjJcIjtcclxuLyoqXHJcbiAqIFNTUiB1dGlscyBmb3IgXFxAdnVlL3NlcnZlci1yZW5kZXJlci4gT25seSBleHBvc2VkIGluIGNqcyBidWlsZHMuXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuY29uc3Qgc3NyVXRpbHMgPSAoIG51bGwpO1xuXG5leHBvcnQgeyBCYXNlVHJhbnNpdGlvbiwgQ29tbWVudCwgRnJhZ21lbnQsIEtlZXBBbGl2ZSwgU3RhdGljLCBTdXNwZW5zZSwgVGVsZXBvcnQsIFRleHQsIGNhbGxXaXRoQXN5bmNFcnJvckhhbmRsaW5nLCBjYWxsV2l0aEVycm9ySGFuZGxpbmcsIGNsb25lVk5vZGUsIGNvbXB1dGVkLCBjcmVhdGVCbG9jaywgY3JlYXRlQ29tbWVudFZOb2RlLCBjcmVhdGVIeWRyYXRpb25SZW5kZXJlciwgY3JlYXRlUmVuZGVyZXIsIGNyZWF0ZVNsb3RzLCBjcmVhdGVTdGF0aWNWTm9kZSwgY3JlYXRlVGV4dFZOb2RlLCBjcmVhdGVWTm9kZSwgZGVmaW5lQXN5bmNDb21wb25lbnQsIGRlZmluZUNvbXBvbmVudCwgZGV2dG9vbHMsIGdldEN1cnJlbnRJbnN0YW5jZSwgZ2V0VHJhbnNpdGlvblJhd0NoaWxkcmVuLCBoLCBoYW5kbGVFcnJvciwgaW5qZWN0LCBpc1ZOb2RlLCBtZXJnZVByb3BzLCBuZXh0VGljaywgb25BY3RpdmF0ZWQsIG9uQmVmb3JlTW91bnQsIG9uQmVmb3JlVW5tb3VudCwgb25CZWZvcmVVcGRhdGUsIG9uRGVhY3RpdmF0ZWQsIG9uRXJyb3JDYXB0dXJlZCwgb25Nb3VudGVkLCBvblJlbmRlclRyYWNrZWQsIG9uUmVuZGVyVHJpZ2dlcmVkLCBvblVubW91bnRlZCwgb25VcGRhdGVkLCBvcGVuQmxvY2ssIHBvcFNjb3BlSWQsIHByb3ZpZGUsIHB1c2hTY29wZUlkLCBxdWV1ZVBvc3RGbHVzaENiLCByZWdpc3RlclJ1bnRpbWVDb21waWxlciwgcmVuZGVyTGlzdCwgcmVuZGVyU2xvdCwgcmVzb2x2ZUNvbXBvbmVudCwgcmVzb2x2ZURpcmVjdGl2ZSwgcmVzb2x2ZUR5bmFtaWNDb21wb25lbnQsIHJlc29sdmVUcmFuc2l0aW9uSG9va3MsIHNldEJsb2NrVHJhY2tpbmcsIHNldERldnRvb2xzSG9vaywgc2V0VHJhbnNpdGlvbkhvb2tzLCBzc3JDb250ZXh0S2V5LCBzc3JVdGlscywgdG9IYW5kbGVycywgdHJhbnNmb3JtVk5vZGVBcmdzLCB1c2VTU1JDb250ZXh0LCB1c2VUcmFuc2l0aW9uU3RhdGUsIHZlcnNpb24sIHdhcm4sIHdhdGNoLCB3YXRjaEVmZmVjdCwgd2l0aEN0eCwgd2l0aERpcmVjdGl2ZXMsIHdpdGhTY29wZUlkIH07XG4iLCJpbXBvcnQgeyBjYW1lbGl6ZSwgd2FybiwgY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcsIGdldEN1cnJlbnRJbnN0YW5jZSwgb25Nb3VudGVkLCB3YXRjaEVmZmVjdCwgdW5yZWYsIEZyYWdtZW50LCBoLCBCYXNlVHJhbnNpdGlvbiwgdXNlVHJhbnNpdGlvblN0YXRlLCBvblVwZGF0ZWQsIGdldFRyYW5zaXRpb25SYXdDaGlsZHJlbiwgc2V0VHJhbnNpdGlvbkhvb2tzLCByZXNvbHZlVHJhbnNpdGlvbkhvb2tzLCBjcmVhdGVWTm9kZSwgY3JlYXRlUmVuZGVyZXIsIGNyZWF0ZUh5ZHJhdGlvblJlbmRlcmVyIH0gZnJvbSAnQHZ1ZS9ydW50aW1lLWNvcmUnO1xuZXhwb3J0ICogZnJvbSAnQHZ1ZS9ydW50aW1lLWNvcmUnO1xuaW1wb3J0IHsgaXNTdHJpbmcsIGh5cGhlbmF0ZSwgY2FwaXRhbGl6ZSwgaXNTcGVjaWFsQm9vbGVhbkF0dHIsIGlzQXJyYXksIGlzT24sIGlzRnVuY3Rpb24sIEVNUFRZX09CSiwgZXh0ZW5kLCBpc09iamVjdCwgdG9OdW1iZXIsIGludm9rZUFycmF5Rm5zLCBsb29zZUluZGV4T2YsIGxvb3NlRXF1YWwsIGlzSFRNTFRhZywgaXNTVkdUYWcgfSBmcm9tICdAdnVlL3NoYXJlZCc7XG5cbmNvbnN0IHN2Z05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcclxuY29uc3QgZG9jID0gKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudCA6IG51bGwpO1xyXG5sZXQgdGVtcENvbnRhaW5lcjtcclxubGV0IHRlbXBTVkdDb250YWluZXI7XHJcbmNvbnN0IG5vZGVPcHMgPSB7XHJcbiAgICBpbnNlcnQ6IChjaGlsZCwgcGFyZW50LCBhbmNob3IpID0+IHtcclxuICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBhbmNob3IgfHwgbnVsbCk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlOiBjaGlsZCA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gY2hpbGQucGFyZW50Tm9kZTtcclxuICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNyZWF0ZUVsZW1lbnQ6ICh0YWcsIGlzU1ZHLCBpcykgPT4gaXNTVkdcclxuICAgICAgICA/IGRvYy5jcmVhdGVFbGVtZW50TlMoc3ZnTlMsIHRhZylcclxuICAgICAgICA6IGRvYy5jcmVhdGVFbGVtZW50KHRhZywgaXMgPyB7IGlzIH0gOiB1bmRlZmluZWQpLFxyXG4gICAgY3JlYXRlVGV4dDogdGV4dCA9PiBkb2MuY3JlYXRlVGV4dE5vZGUodGV4dCksXHJcbiAgICBjcmVhdGVDb21tZW50OiB0ZXh0ID0+IGRvYy5jcmVhdGVDb21tZW50KHRleHQpLFxyXG4gICAgc2V0VGV4dDogKG5vZGUsIHRleHQpID0+IHtcclxuICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHRleHQ7XHJcbiAgICB9LFxyXG4gICAgc2V0RWxlbWVudFRleHQ6IChlbCwgdGV4dCkgPT4ge1xyXG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIH0sXHJcbiAgICBwYXJlbnROb2RlOiBub2RlID0+IG5vZGUucGFyZW50Tm9kZSxcclxuICAgIG5leHRTaWJsaW5nOiBub2RlID0+IG5vZGUubmV4dFNpYmxpbmcsXHJcbiAgICBxdWVyeVNlbGVjdG9yOiBzZWxlY3RvciA9PiBkb2MucXVlcnlTZWxlY3RvcihzZWxlY3RvciksXHJcbiAgICBzZXRTY29wZUlkKGVsLCBpZCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShpZCwgJycpO1xyXG4gICAgfSxcclxuICAgIGNsb25lTm9kZShlbCkge1xyXG4gICAgICAgIHJldHVybiBlbC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICB9LFxyXG4gICAgLy8gX19VTlNBRkVfX1xyXG4gICAgLy8gUmVhc29uOiBpbm5lckhUTUwuXHJcbiAgICAvLyBTdGF0aWMgY29udGVudCBoZXJlIGNhbiBvbmx5IGNvbWUgZnJvbSBjb21waWxlZCB0ZW1wbGF0ZXMuXHJcbiAgICAvLyBBcyBsb25nIGFzIHRoZSB1c2VyIG9ubHkgdXNlcyB0cnVzdGVkIHRlbXBsYXRlcywgdGhpcyBpcyBzYWZlLlxyXG4gICAgaW5zZXJ0U3RhdGljQ29udGVudChjb250ZW50LCBwYXJlbnQsIGFuY2hvciwgaXNTVkcpIHtcclxuICAgICAgICBjb25zdCB0ZW1wID0gaXNTVkdcclxuICAgICAgICAgICAgPyB0ZW1wU1ZHQ29udGFpbmVyIHx8XHJcbiAgICAgICAgICAgICAgICAodGVtcFNWR0NvbnRhaW5lciA9IGRvYy5jcmVhdGVFbGVtZW50TlMoc3ZnTlMsICdzdmcnKSlcclxuICAgICAgICAgICAgOiB0ZW1wQ29udGFpbmVyIHx8ICh0ZW1wQ29udGFpbmVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcclxuICAgICAgICB0ZW1wLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgY29uc3QgZmlyc3QgPSB0ZW1wLmZpcnN0Q2hpbGQ7XHJcbiAgICAgICAgbGV0IG5vZGUgPSBmaXJzdDtcclxuICAgICAgICBsZXQgbGFzdCA9IG5vZGU7XHJcbiAgICAgICAgd2hpbGUgKG5vZGUpIHtcclxuICAgICAgICAgICAgbGFzdCA9IG5vZGU7XHJcbiAgICAgICAgICAgIG5vZGVPcHMuaW5zZXJ0KG5vZGUsIHBhcmVudCwgYW5jaG9yKTtcclxuICAgICAgICAgICAgbm9kZSA9IHRlbXAuZmlyc3RDaGlsZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtmaXJzdCwgbGFzdF07XHJcbiAgICB9XHJcbn07XG5cbi8vIGNvbXBpbGVyIHNob3VsZCBub3JtYWxpemUgY2xhc3MgKyA6Y2xhc3MgYmluZGluZ3Mgb24gdGhlIHNhbWUgZWxlbWVudFxyXG4vLyBpbnRvIGEgc2luZ2xlIGJpbmRpbmcgWydzdGF0aWNDbGFzcycsIGR5bmFtaWNdXHJcbmZ1bmN0aW9uIHBhdGNoQ2xhc3MoZWwsIHZhbHVlLCBpc1NWRykge1xyXG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcclxuICAgICAgICB2YWx1ZSA9ICcnO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzU1ZHKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIGRpcmVjdGx5IHNldHRpbmcgY2xhc3NOYW1lIHNob3VsZCBiZSBmYXN0ZXIgdGhhbiBzZXRBdHRyaWJ1dGUgaW4gdGhlb3J5XHJcbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBlbGVtZW50IGR1cmluZyBhIHRyYW5zaXRpb24sIHRha2UgdGhlIHRlbXBvcmFyeSB0cmFuc2l0aW9uXHJcbiAgICAgICAgLy8gY2xhc3NlcyBpbnRvIGFjY291bnQuXHJcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbkNsYXNzZXMgPSBlbC5fdnRjO1xyXG4gICAgICAgIGlmICh0cmFuc2l0aW9uQ2xhc3Nlcykge1xyXG4gICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZVxyXG4gICAgICAgICAgICAgICAgPyBbdmFsdWUsIC4uLnRyYW5zaXRpb25DbGFzc2VzXVxyXG4gICAgICAgICAgICAgICAgOiBbLi4udHJhbnNpdGlvbkNsYXNzZXNdKS5qb2luKCcgJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IHZhbHVlO1xyXG4gICAgfVxyXG59XG5cbmZ1bmN0aW9uIHBhdGNoU3R5bGUoZWwsIHByZXYsIG5leHQpIHtcclxuICAgIGNvbnN0IHN0eWxlID0gZWwuc3R5bGU7XHJcbiAgICBpZiAoIW5leHQpIHtcclxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc1N0cmluZyhuZXh0KSkge1xyXG4gICAgICAgIGlmIChwcmV2ICE9PSBuZXh0KSB7XHJcbiAgICAgICAgICAgIHN0eWxlLmNzc1RleHQgPSBuZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIG5leHQpIHtcclxuICAgICAgICAgICAgc2V0U3R5bGUoc3R5bGUsIGtleSwgbmV4dFtrZXldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHByZXYgJiYgIWlzU3RyaW5nKHByZXYpKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHByZXYpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0W2tleV0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFN0eWxlKHN0eWxlLCBrZXksICcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zdCBpbXBvcnRhbnRSRSA9IC9cXHMqIWltcG9ydGFudCQvO1xyXG5mdW5jdGlvbiBzZXRTdHlsZShzdHlsZSwgbmFtZSwgdmFsKSB7XHJcbiAgICBpZiAobmFtZS5zdGFydHNXaXRoKCctLScpKSB7XHJcbiAgICAgICAgLy8gY3VzdG9tIHByb3BlcnR5IGRlZmluaXRpb25cclxuICAgICAgICBzdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWwpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgcHJlZml4ZWQgPSBhdXRvUHJlZml4KHN0eWxlLCBuYW1lKTtcclxuICAgICAgICBpZiAoaW1wb3J0YW50UkUudGVzdCh2YWwpKSB7XHJcbiAgICAgICAgICAgIC8vICFpbXBvcnRhbnRcclxuICAgICAgICAgICAgc3R5bGUuc2V0UHJvcGVydHkoaHlwaGVuYXRlKHByZWZpeGVkKSwgdmFsLnJlcGxhY2UoaW1wb3J0YW50UkUsICcnKSwgJ2ltcG9ydGFudCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc3R5bGVbcHJlZml4ZWRdID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zdCBwcmVmaXhlcyA9IFsnV2Via2l0JywgJ01veicsICdtcyddO1xyXG5jb25zdCBwcmVmaXhDYWNoZSA9IHt9O1xyXG5mdW5jdGlvbiBhdXRvUHJlZml4KHN0eWxlLCByYXdOYW1lKSB7XHJcbiAgICBjb25zdCBjYWNoZWQgPSBwcmVmaXhDYWNoZVtyYXdOYW1lXTtcclxuICAgIGlmIChjYWNoZWQpIHtcclxuICAgICAgICByZXR1cm4gY2FjaGVkO1xyXG4gICAgfVxyXG4gICAgbGV0IG5hbWUgPSBjYW1lbGl6ZShyYXdOYW1lKTtcclxuICAgIGlmIChuYW1lICE9PSAnZmlsdGVyJyAmJiBuYW1lIGluIHN0eWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIChwcmVmaXhDYWNoZVtyYXdOYW1lXSA9IG5hbWUpO1xyXG4gICAgfVxyXG4gICAgbmFtZSA9IGNhcGl0YWxpemUobmFtZSk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgcHJlZml4ZWQgPSBwcmVmaXhlc1tpXSArIG5hbWU7XHJcbiAgICAgICAgaWYgKHByZWZpeGVkIGluIHN0eWxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4Q2FjaGVbcmF3TmFtZV0gPSBwcmVmaXhlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJhd05hbWU7XHJcbn1cblxuY29uc3QgeGxpbmtOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJztcclxuZnVuY3Rpb24gcGF0Y2hBdHRyKGVsLCBrZXksIHZhbHVlLCBpc1NWRykge1xyXG4gICAgaWYgKGlzU1ZHICYmIGtleS5zdGFydHNXaXRoKCd4bGluazonKSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZU5TKHhsaW5rTlMsIGtleS5zbGljZSg2LCBrZXkubGVuZ3RoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua05TLCBrZXksIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBub3RlIHdlIGFyZSBvbmx5IGNoZWNraW5nIGJvb2xlYW4gYXR0cmlidXRlcyB0aGF0IGRvbid0IGhhdmUgYVxyXG4gICAgICAgIC8vIGNvcnJlc3BvbmRpbmcgZG9tIHByb3Agb2YgdGhlIHNhbWUgbmFtZSBoZXJlLlxyXG4gICAgICAgIGNvbnN0IGlzQm9vbGVhbiA9IGlzU3BlY2lhbEJvb2xlYW5BdHRyKGtleSk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgKGlzQm9vbGVhbiAmJiB2YWx1ZSA9PT0gZmFsc2UpKSB7XHJcbiAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgaXNCb29sZWFuID8gJycgOiB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cbi8vIF9fVU5TQUZFX19cclxuLy8gZnVuY3Rpb25zLiBUaGUgdXNlciBpcyByZXNwb25zaWJsZSBmb3IgdXNpbmcgdGhlbSB3aXRoIG9ubHkgdHJ1c3RlZCBjb250ZW50LlxyXG5mdW5jdGlvbiBwYXRjaERPTVByb3AoZWwsIGtleSwgdmFsdWUsIFxyXG4vLyB0aGUgZm9sbG93aW5nIGFyZ3MgYXJlIHBhc3NlZCBvbmx5IGR1ZSB0byBwb3RlbnRpYWwgaW5uZXJIVE1ML3RleHRDb250ZW50XHJcbi8vIG92ZXJyaWRpbmcgZXhpc3RpbmcgVk5vZGVzLCBpbiB3aGljaCBjYXNlIHRoZSBvbGQgdHJlZSBtdXN0IGJlIHByb3Blcmx5XHJcbi8vIHVubW91bnRlZC5cclxucHJldkNoaWxkcmVuLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCB1bm1vdW50Q2hpbGRyZW4pIHtcclxuICAgIGlmIChrZXkgPT09ICdpbm5lckhUTUwnIHx8IGtleSA9PT0gJ3RleHRDb250ZW50Jykge1xyXG4gICAgICAgIGlmIChwcmV2Q2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdW5tb3VudENoaWxkcmVuKHByZXZDaGlsZHJlbiwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsW2tleV0gPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoa2V5ID09PSAndmFsdWUnICYmIGVsLnRhZ05hbWUgIT09ICdQUk9HUkVTUycpIHtcclxuICAgICAgICAvLyBzdG9yZSB2YWx1ZSBhcyBfdmFsdWUgYXMgd2VsbCBzaW5jZVxyXG4gICAgICAgIC8vIG5vbi1zdHJpbmcgdmFsdWVzIHdpbGwgYmUgc3RyaW5naWZpZWQuXHJcbiAgICAgICAgZWwuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgZWwudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodmFsdWUgPT09ICcnICYmIHR5cGVvZiBlbFtrZXldID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAvLyBlLmcuIDxzZWxlY3QgbXVsdGlwbGU+IGNvbXBpbGVzIHRvIHsgbXVsdGlwbGU6ICcnIH1cclxuICAgICAgICBlbFtrZXldID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHZhbHVlID09IG51bGwgJiYgdHlwZW9mIGVsW2tleV0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgLy8gZS5nLiA8ZGl2IDppZD1cIm51bGxcIj5cclxuICAgICAgICBlbFtrZXldID0gJyc7XHJcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGtleSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBzb21lIHByb3BlcnRpZXMgcGVyZm9ybSB2YWx1ZSB2YWxpZGF0aW9uIGFuZCB0aHJvd1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGVsW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgd2FybihgRmFpbGVkIHNldHRpbmcgcHJvcCBcIiR7a2V5fVwiIG9uIDwke2VsLnRhZ05hbWUudG9Mb3dlckNhc2UoKX0+OiBgICtcclxuICAgICAgICAgICAgICAgICAgICBgdmFsdWUgJHt2YWx1ZX0gaXMgaW52YWxpZC5gLCBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG4vLyBBc3luYyBlZGdlIGNhc2UgZml4IHJlcXVpcmVzIHN0b3JpbmcgYW4gZXZlbnQgbGlzdGVuZXIncyBhdHRhY2ggdGltZXN0YW1wLlxyXG5sZXQgX2dldE5vdyA9IERhdGUubm93O1xyXG4vLyBEZXRlcm1pbmUgd2hhdCBldmVudCB0aW1lc3RhbXAgdGhlIGJyb3dzZXIgaXMgdXNpbmcuIEFubm95aW5nbHksIHRoZVxyXG4vLyB0aW1lc3RhbXAgY2FuIGVpdGhlciBiZSBoaS1yZXMgKHJlbGF0aXZlIHRvIHBhZ2UgbG9hZCkgb3IgbG93LXJlc1xyXG4vLyAocmVsYXRpdmUgdG8gVU5JWCBlcG9jaCksIHNvIGluIG9yZGVyIHRvIGNvbXBhcmUgdGltZSB3ZSBoYXZlIHRvIHVzZSB0aGVcclxuLy8gc2FtZSB0aW1lc3RhbXAgdHlwZSB3aGVuIHNhdmluZyB0aGUgZmx1c2ggdGltZXN0YW1wLlxyXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgX2dldE5vdygpID4gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50JykudGltZVN0YW1wKSB7XHJcbiAgICAvLyBpZiB0aGUgbG93LXJlcyB0aW1lc3RhbXAgd2hpY2ggaXMgYmlnZ2VyIHRoYW4gdGhlIGV2ZW50IHRpbWVzdGFtcFxyXG4gICAgLy8gKHdoaWNoIGlzIGV2YWx1YXRlZCBBRlRFUikgaXQgbWVhbnMgdGhlIGV2ZW50IGlzIHVzaW5nIGEgaGktcmVzIHRpbWVzdGFtcCxcclxuICAgIC8vIGFuZCB3ZSBuZWVkIHRvIHVzZSB0aGUgaGktcmVzIHZlcnNpb24gZm9yIGV2ZW50IGxpc3RlbmVycyBhcyB3ZWxsLlxyXG4gICAgX2dldE5vdyA9ICgpID0+IHBlcmZvcm1hbmNlLm5vdygpO1xyXG59XHJcbi8vIFRvIGF2b2lkIHRoZSBvdmVyaGVhZCBvZiByZXBlYXRlZGx5IGNhbGxpbmcgcGVyZm9ybWFuY2Uubm93KCksIHdlIGNhY2hlXHJcbi8vIGFuZCB1c2UgdGhlIHNhbWUgdGltZXN0YW1wIGZvciBhbGwgZXZlbnQgbGlzdGVuZXJzIGF0dGFjaGVkIGluIHRoZSBzYW1lIHRpY2suXHJcbmxldCBjYWNoZWROb3cgPSAwO1xyXG5jb25zdCBwID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbmNvbnN0IHJlc2V0ID0gKCkgPT4ge1xyXG4gICAgY2FjaGVkTm93ID0gMDtcclxufTtcclxuY29uc3QgZ2V0Tm93ID0gKCkgPT4gY2FjaGVkTm93IHx8IChwLnRoZW4ocmVzZXQpLCAoY2FjaGVkTm93ID0gX2dldE5vdygpKSk7XHJcbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIoZWwsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKSB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcclxufVxyXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVyKGVsLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucykge1xyXG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XHJcbn1cclxuZnVuY3Rpb24gcGF0Y2hFdmVudChlbCwgcmF3TmFtZSwgcHJldlZhbHVlLCBuZXh0VmFsdWUsIGluc3RhbmNlID0gbnVsbCkge1xyXG4gICAgY29uc3QgaW52b2tlciA9IHByZXZWYWx1ZSAmJiBwcmV2VmFsdWUuaW52b2tlcjtcclxuICAgIGlmIChuZXh0VmFsdWUgJiYgaW52b2tlcikge1xyXG4gICAgICAgIHByZXZWYWx1ZS5pbnZva2VyID0gbnVsbDtcclxuICAgICAgICBpbnZva2VyLnZhbHVlID0gbmV4dFZhbHVlO1xyXG4gICAgICAgIG5leHRWYWx1ZS5pbnZva2VyID0gaW52b2tlcjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IFtuYW1lLCBvcHRpb25zXSA9IHBhcnNlTmFtZShyYXdOYW1lKTtcclxuICAgICAgICBpZiAobmV4dFZhbHVlKSB7XHJcbiAgICAgICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZWwsIG5hbWUsIGNyZWF0ZUludm9rZXIobmV4dFZhbHVlLCBpbnN0YW5jZSksIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpbnZva2VyKSB7XHJcbiAgICAgICAgICAgIC8vIHJlbW92ZVxyXG4gICAgICAgICAgICByZW1vdmVFdmVudExpc3RlbmVyKGVsLCBuYW1lLCBpbnZva2VyLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY29uc3Qgb3B0aW9uc01vZGlmaWVyUkUgPSAvKD86T25jZXxQYXNzaXZlfENhcHR1cmUpJC87XHJcbmZ1bmN0aW9uIHBhcnNlTmFtZShuYW1lKSB7XHJcbiAgICBsZXQgb3B0aW9ucztcclxuICAgIGlmIChvcHRpb25zTW9kaWZpZXJSRS50ZXN0KG5hbWUpKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xyXG4gICAgICAgIGxldCBtO1xyXG4gICAgICAgIHdoaWxlICgobSA9IG5hbWUubWF0Y2gob3B0aW9uc01vZGlmaWVyUkUpKSkge1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zbGljZSgwLCBuYW1lLmxlbmd0aCAtIG1bMF0ubGVuZ3RoKTtcclxuICAgICAgICAgICAgb3B0aW9uc1ttWzBdLnRvTG93ZXJDYXNlKCldID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW25hbWUuc2xpY2UoMikudG9Mb3dlckNhc2UoKSwgb3B0aW9uc107XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlSW52b2tlcihpbml0aWFsVmFsdWUsIGluc3RhbmNlKSB7XHJcbiAgICBjb25zdCBpbnZva2VyID0gKGUpID0+IHtcclxuICAgICAgICAvLyBhc3luYyBlZGdlIGNhc2UgIzY1NjY6IGlubmVyIGNsaWNrIGV2ZW50IHRyaWdnZXJzIHBhdGNoLCBldmVudCBoYW5kbGVyXHJcbiAgICAgICAgLy8gYXR0YWNoZWQgdG8gb3V0ZXIgZWxlbWVudCBkdXJpbmcgcGF0Y2gsIGFuZCB0cmlnZ2VyZWQgYWdhaW4uIFRoaXNcclxuICAgICAgICAvLyBoYXBwZW5zIGJlY2F1c2UgYnJvd3NlcnMgZmlyZSBtaWNyb3Rhc2sgdGlja3MgYmV0d2VlbiBldmVudCBwcm9wYWdhdGlvbi5cclxuICAgICAgICAvLyB0aGUgc29sdXRpb24gaXMgc2ltcGxlOiB3ZSBzYXZlIHRoZSB0aW1lc3RhbXAgd2hlbiBhIGhhbmRsZXIgaXMgYXR0YWNoZWQsXHJcbiAgICAgICAgLy8gYW5kIHRoZSBoYW5kbGVyIHdvdWxkIG9ubHkgZmlyZSBpZiB0aGUgZXZlbnQgcGFzc2VkIHRvIGl0IHdhcyBmaXJlZFxyXG4gICAgICAgIC8vIEFGVEVSIGl0IHdhcyBhdHRhY2hlZC5cclxuICAgICAgICBjb25zdCB0aW1lU3RhbXAgPSBlLnRpbWVTdGFtcCB8fCBfZ2V0Tm93KCk7XHJcbiAgICAgICAgaWYgKHRpbWVTdGFtcCA+PSBpbnZva2VyLmF0dGFjaGVkIC0gMSkge1xyXG4gICAgICAgICAgICBjYWxsV2l0aEFzeW5jRXJyb3JIYW5kbGluZyhwYXRjaFN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbihlLCBpbnZva2VyLnZhbHVlKSwgaW5zdGFuY2UsIDUgLyogTkFUSVZFX0VWRU5UX0hBTkRMRVIgKi8sIFtlXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGludm9rZXIudmFsdWUgPSBpbml0aWFsVmFsdWU7XHJcbiAgICBpbml0aWFsVmFsdWUuaW52b2tlciA9IGludm9rZXI7XHJcbiAgICBpbnZva2VyLmF0dGFjaGVkID0gZ2V0Tm93KCk7XHJcbiAgICByZXR1cm4gaW52b2tlcjtcclxufVxyXG5mdW5jdGlvbiBwYXRjaFN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbihlLCB2YWx1ZSkge1xyXG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxTdG9wID0gZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb247XHJcbiAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsU3RvcC5jYWxsKGUpO1xyXG4gICAgICAgICAgICBlLl9zdG9wcGVkID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB2YWx1ZS5tYXAoZm4gPT4gKGUpID0+ICFlLl9zdG9wcGVkICYmIGZuKGUpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxufVxuXG5jb25zdCBuYXRpdmVPblJFID0gL15vblthLXpdLztcclxuY29uc3QgZm9yY2VQYXRjaFByb3AgPSAoXywga2V5KSA9PiBrZXkgPT09ICd2YWx1ZSc7XHJcbmNvbnN0IHBhdGNoUHJvcCA9IChlbCwga2V5LCBwcmV2VmFsdWUsIG5leHRWYWx1ZSwgaXNTVkcgPSBmYWxzZSwgcHJldkNoaWxkcmVuLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCB1bm1vdW50Q2hpbGRyZW4pID0+IHtcclxuICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgLy8gc3BlY2lhbFxyXG4gICAgICAgIGNhc2UgJ2NsYXNzJzpcclxuICAgICAgICAgICAgcGF0Y2hDbGFzcyhlbCwgbmV4dFZhbHVlLCBpc1NWRyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3N0eWxlJzpcclxuICAgICAgICAgICAgcGF0Y2hTdHlsZShlbCwgcHJldlZhbHVlLCBuZXh0VmFsdWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBpZiAoaXNPbihrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmUgdi1tb2RlbCBsaXN0ZW5lcnNcclxuICAgICAgICAgICAgICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoJ29uVXBkYXRlOicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2hFdmVudChlbCwga2V5LCBwcmV2VmFsdWUsIG5leHRWYWx1ZSwgcGFyZW50Q29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChzaG91bGRTZXRBc1Byb3AoZWwsIGtleSwgbmV4dFZhbHVlLCBpc1NWRykpIHtcclxuICAgICAgICAgICAgICAgIHBhdGNoRE9NUHJvcChlbCwga2V5LCBuZXh0VmFsdWUsIHByZXZDaGlsZHJlbiwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgdW5tb3VudENoaWxkcmVuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3IgPGlucHV0IHYtbW9kZWwgdHlwZT1cImNoZWNrYm94XCI+IHdpdGhcclxuICAgICAgICAgICAgICAgIC8vIDp0cnVlLXZhbHVlICYgOmZhbHNlLXZhbHVlXHJcbiAgICAgICAgICAgICAgICAvLyBzdG9yZSB2YWx1ZSBhcyBkb20gcHJvcGVydGllcyBzaW5jZSBub24tc3RyaW5nIHZhbHVlcyB3aWxsIGJlXHJcbiAgICAgICAgICAgICAgICAvLyBzdHJpbmdpZmllZC5cclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd0cnVlLXZhbHVlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLl90cnVlVmFsdWUgPSBuZXh0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChrZXkgPT09ICdmYWxzZS12YWx1ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbC5fZmFsc2VWYWx1ZSA9IG5leHRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBhdGNoQXR0cihlbCwga2V5LCBuZXh0VmFsdWUsIGlzU1ZHKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufTtcclxuZnVuY3Rpb24gc2hvdWxkU2V0QXNQcm9wKGVsLCBrZXksIHZhbHVlLCBpc1NWRykge1xyXG4gICAgaWYgKGlzU1ZHKSB7XHJcbiAgICAgICAgLy8gbW9zdCBrZXlzIG11c3QgYmUgc2V0IGFzIGF0dHJpYnV0ZSBvbiBzdmcgZWxlbWVudHMgdG8gd29ya1xyXG4gICAgICAgIC8vIC4uLmV4Y2VwdCBpbm5lckhUTUxcclxuICAgICAgICBpZiAoa2V5ID09PSAnaW5uZXJIVE1MJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gb3IgbmF0aXZlIG9uY2xpY2sgd2l0aCBmdW5jdGlvbiB2YWx1ZXNcclxuICAgICAgICBpZiAoa2V5IGluIGVsICYmIG5hdGl2ZU9uUkUudGVzdChrZXkpICYmIGlzRnVuY3Rpb24odmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyBzcGVsbGNoZWNrIGFuZCBkcmFnZ2FibGUgYXJlIG51bWVyYXRlZCBhdHRycywgaG93ZXZlciB0aGVpclxyXG4gICAgLy8gY29ycmVzcG9uZGluZyBET00gcHJvcGVydGllcyBhcmUgYWN0dWFsbHkgYm9vbGVhbnMgLSB0aGlzIGxlYWRzIHRvXHJcbiAgICAvLyBzZXR0aW5nIGl0IHdpdGggYSBzdHJpbmcgXCJmYWxzZVwiIHZhbHVlIGxlYWRpbmcgaXQgdG8gYmUgY29lcmNlZCB0b1xyXG4gICAgLy8gYHRydWVgLCBzbyB3ZSBuZWVkIHRvIGFsd2F5cyB0cmVhdCB0aGVtIGFzIGF0dHJpYnV0ZXMuXHJcbiAgICAvLyBOb3RlIHRoYXQgYGNvbnRlbnRFZGl0YWJsZWAgZG9lc24ndCBoYXZlIHRoaXMgcHJvYmxlbTogaXRzIERPTVxyXG4gICAgLy8gcHJvcGVydHkgaXMgYWxzbyBlbnVtZXJhdGVkIHN0cmluZyB2YWx1ZXMuXHJcbiAgICBpZiAoa2V5ID09PSAnc3BlbGxjaGVjaycgfHwga2V5ID09PSAnZHJhZ2dhYmxlJykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vICMxNTI2IDxpbnB1dCBsaXN0PiBtdXN0IGJlIHNldCBhcyBhdHRyaWJ1dGVcclxuICAgIGlmIChrZXkgPT09ICdsaXN0JyAmJiBlbC50YWdOYW1lID09PSAnSU5QVVQnKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy8gbmF0aXZlIG9uY2xpY2sgd2l0aCBzdHJpbmcgdmFsdWUsIG11c3QgYmUgc2V0IGFzIGF0dHJpYnV0ZVxyXG4gICAgaWYgKG5hdGl2ZU9uUkUudGVzdChrZXkpICYmIGlzU3RyaW5nKHZhbHVlKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBrZXkgaW4gZWw7XHJcbn1cblxuZnVuY3Rpb24gdXNlQ3NzTW9kdWxlKG5hbWUgPSAnJHN0eWxlJykge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgIHtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpO1xyXG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIHdhcm4oYHVzZUNzc01vZHVsZSBtdXN0IGJlIGNhbGxlZCBpbnNpZGUgc2V0dXAoKWApO1xyXG4gICAgICAgICAgICByZXR1cm4gRU1QVFlfT0JKO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBtb2R1bGVzID0gaW5zdGFuY2UudHlwZS5fX2Nzc01vZHVsZXM7XHJcbiAgICAgICAgaWYgKCFtb2R1bGVzKSB7XHJcbiAgICAgICAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiB3YXJuKGBDdXJyZW50IGluc3RhbmNlIGRvZXMgbm90IGhhdmUgQ1NTIG1vZHVsZXMgaW5qZWN0ZWQuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBFTVBUWV9PQko7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1vZCA9IG1vZHVsZXNbbmFtZV07XHJcbiAgICAgICAgaWYgKCFtb2QpIHtcclxuICAgICAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmXHJcbiAgICAgICAgICAgICAgICB3YXJuKGBDdXJyZW50IGluc3RhbmNlIGRvZXMgbm90IGhhdmUgQ1NTIG1vZHVsZSBuYW1lZCBcIiR7bmFtZX1cIi5gKTtcclxuICAgICAgICAgICAgcmV0dXJuIEVNUFRZX09CSjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1vZDtcclxuICAgIH1cclxufVxuXG5mdW5jdGlvbiB1c2VDc3NWYXJzKGdldHRlciwgc2NvcGVkID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IGluc3RhbmNlID0gZ2V0Q3VycmVudEluc3RhbmNlKCk7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgaWYgKCFpbnN0YW5jZSkge1xyXG4gICAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJlxyXG4gICAgICAgICAgICB3YXJuKGB1c2VDc3NWYXJzIGlzIGNhbGxlZCB3aXRob3V0IGN1cnJlbnQgYWN0aXZlIGNvbXBvbmVudCBpbnN0YW5jZS5gKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBwcmVmaXggPSBzY29wZWQgJiYgaW5zdGFuY2UudHlwZS5fX3Njb3BlSWRcclxuICAgICAgICA/IGAke2luc3RhbmNlLnR5cGUuX19zY29wZUlkLnJlcGxhY2UoL15kYXRhLXYtLywgJycpfS1gXHJcbiAgICAgICAgOiBgYDtcclxuICAgIG9uTW91bnRlZCgoKSA9PiB7XHJcbiAgICAgICAgd2F0Y2hFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXRWYXJzT25WTm9kZShpbnN0YW5jZS5zdWJUcmVlLCBnZXR0ZXIoaW5zdGFuY2UucHJveHkpLCBwcmVmaXgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gc2V0VmFyc09uVk5vZGUodm5vZGUsIHZhcnMsIHByZWZpeCkge1xyXG4gICAgLy8gZHJpbGwgZG93biBIT0NzIHVudGlsIGl0J3MgYSBub24tY29tcG9uZW50IHZub2RlXHJcbiAgICB3aGlsZSAodm5vZGUuY29tcG9uZW50KSB7XHJcbiAgICAgICAgdm5vZGUgPSB2bm9kZS5jb21wb25lbnQuc3ViVHJlZTtcclxuICAgIH1cclxuICAgIGlmICh2bm9kZS5zaGFwZUZsYWcgJiAxIC8qIEVMRU1FTlQgKi8gJiYgdm5vZGUuZWwpIHtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IHZub2RlLmVsLnN0eWxlO1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHZhcnMpIHtcclxuICAgICAgICAgICAgc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtwcmVmaXh9JHtrZXl9YCwgdW5yZWYodmFyc1trZXldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodm5vZGUudHlwZSA9PT0gRnJhZ21lbnQpIHtcclxuICAgICAgICB2bm9kZS5jaGlsZHJlbi5mb3JFYWNoKGMgPT4gc2V0VmFyc09uVk5vZGUoYywgdmFycywgcHJlZml4KSk7XHJcbiAgICB9XHJcbn1cblxuY29uc3QgVFJBTlNJVElPTiA9ICd0cmFuc2l0aW9uJztcclxuY29uc3QgQU5JTUFUSU9OID0gJ2FuaW1hdGlvbic7XHJcbi8vIERPTSBUcmFuc2l0aW9uIGlzIGEgaGlnaGVyLW9yZGVyLWNvbXBvbmVudCBiYXNlZCBvbiB0aGUgcGxhdGZvcm0tYWdub3N0aWNcclxuLy8gYmFzZSBUcmFuc2l0aW9uIGNvbXBvbmVudCwgd2l0aCBET00tc3BlY2lmaWMgbG9naWMuXHJcbmNvbnN0IFRyYW5zaXRpb24gPSAocHJvcHMsIHsgc2xvdHMgfSkgPT4gaChCYXNlVHJhbnNpdGlvbiwgcmVzb2x2ZVRyYW5zaXRpb25Qcm9wcyhwcm9wcyksIHNsb3RzKTtcclxuVHJhbnNpdGlvbi5kaXNwbGF5TmFtZSA9ICdUcmFuc2l0aW9uJztcclxuY29uc3QgRE9NVHJhbnNpdGlvblByb3BzVmFsaWRhdG9ycyA9IHtcclxuICAgIG5hbWU6IFN0cmluZyxcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGNzczoge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGR1cmF0aW9uOiBbU3RyaW5nLCBOdW1iZXIsIE9iamVjdF0sXHJcbiAgICBlbnRlckZyb21DbGFzczogU3RyaW5nLFxyXG4gICAgZW50ZXJBY3RpdmVDbGFzczogU3RyaW5nLFxyXG4gICAgZW50ZXJUb0NsYXNzOiBTdHJpbmcsXHJcbiAgICBhcHBlYXJGcm9tQ2xhc3M6IFN0cmluZyxcclxuICAgIGFwcGVhckFjdGl2ZUNsYXNzOiBTdHJpbmcsXHJcbiAgICBhcHBlYXJUb0NsYXNzOiBTdHJpbmcsXHJcbiAgICBsZWF2ZUZyb21DbGFzczogU3RyaW5nLFxyXG4gICAgbGVhdmVBY3RpdmVDbGFzczogU3RyaW5nLFxyXG4gICAgbGVhdmVUb0NsYXNzOiBTdHJpbmdcclxufTtcclxuY29uc3QgVHJhbnNpdGlvblByb3BzVmFsaWRhdG9ycyA9IChUcmFuc2l0aW9uLnByb3BzID0gZXh0ZW5kKHt9LCBCYXNlVHJhbnNpdGlvbi5wcm9wcywgRE9NVHJhbnNpdGlvblByb3BzVmFsaWRhdG9ycykpO1xyXG5mdW5jdGlvbiByZXNvbHZlVHJhbnNpdGlvblByb3BzKHJhd1Byb3BzKSB7XHJcbiAgICBsZXQgeyBuYW1lID0gJ3YnLCB0eXBlLCBjc3MgPSB0cnVlLCBkdXJhdGlvbiwgZW50ZXJGcm9tQ2xhc3MgPSBgJHtuYW1lfS1lbnRlci1mcm9tYCwgZW50ZXJBY3RpdmVDbGFzcyA9IGAke25hbWV9LWVudGVyLWFjdGl2ZWAsIGVudGVyVG9DbGFzcyA9IGAke25hbWV9LWVudGVyLXRvYCwgYXBwZWFyRnJvbUNsYXNzID0gZW50ZXJGcm9tQ2xhc3MsIGFwcGVhckFjdGl2ZUNsYXNzID0gZW50ZXJBY3RpdmVDbGFzcywgYXBwZWFyVG9DbGFzcyA9IGVudGVyVG9DbGFzcywgbGVhdmVGcm9tQ2xhc3MgPSBgJHtuYW1lfS1sZWF2ZS1mcm9tYCwgbGVhdmVBY3RpdmVDbGFzcyA9IGAke25hbWV9LWxlYXZlLWFjdGl2ZWAsIGxlYXZlVG9DbGFzcyA9IGAke25hbWV9LWxlYXZlLXRvYCB9ID0gcmF3UHJvcHM7XHJcbiAgICBjb25zdCBiYXNlUHJvcHMgPSB7fTtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIHJhd1Byb3BzKSB7XHJcbiAgICAgICAgaWYgKCEoa2V5IGluIERPTVRyYW5zaXRpb25Qcm9wc1ZhbGlkYXRvcnMpKSB7XHJcbiAgICAgICAgICAgIGJhc2VQcm9wc1trZXldID0gcmF3UHJvcHNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIWNzcykge1xyXG4gICAgICAgIHJldHVybiBiYXNlUHJvcHM7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkdXJhdGlvbnMgPSBub3JtYWxpemVEdXJhdGlvbihkdXJhdGlvbik7XHJcbiAgICBjb25zdCBlbnRlckR1cmF0aW9uID0gZHVyYXRpb25zICYmIGR1cmF0aW9uc1swXTtcclxuICAgIGNvbnN0IGxlYXZlRHVyYXRpb24gPSBkdXJhdGlvbnMgJiYgZHVyYXRpb25zWzFdO1xyXG4gICAgY29uc3QgeyBvbkJlZm9yZUVudGVyLCBvbkVudGVyLCBvbkVudGVyQ2FuY2VsbGVkLCBvbkxlYXZlLCBvbkxlYXZlQ2FuY2VsbGVkLCBvbkJlZm9yZUFwcGVhciA9IG9uQmVmb3JlRW50ZXIsIG9uQXBwZWFyID0gb25FbnRlciwgb25BcHBlYXJDYW5jZWxsZWQgPSBvbkVudGVyQ2FuY2VsbGVkIH0gPSBiYXNlUHJvcHM7XHJcbiAgICBjb25zdCBmaW5pc2hFbnRlciA9IChlbCwgaXNBcHBlYXIsIGRvbmUpID0+IHtcclxuICAgICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGlzQXBwZWFyID8gYXBwZWFyVG9DbGFzcyA6IGVudGVyVG9DbGFzcyk7XHJcbiAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBpc0FwcGVhciA/IGFwcGVhckFjdGl2ZUNsYXNzIDogZW50ZXJBY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgZG9uZSAmJiBkb25lKCk7XHJcbiAgICB9O1xyXG4gICAgY29uc3QgZmluaXNoTGVhdmUgPSAoZWwsIGRvbmUpID0+IHtcclxuICAgICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlVG9DbGFzcyk7XHJcbiAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUFjdGl2ZUNsYXNzKTtcclxuICAgICAgICBkb25lICYmIGRvbmUoKTtcclxuICAgIH07XHJcbiAgICBjb25zdCBtYWtlRW50ZXJIb29rID0gKGlzQXBwZWFyKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChlbCwgZG9uZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBob29rID0gaXNBcHBlYXIgPyBvbkFwcGVhciA6IG9uRW50ZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmUgPSAoKSA9PiBmaW5pc2hFbnRlcihlbCwgaXNBcHBlYXIsIGRvbmUpO1xyXG4gICAgICAgICAgICBob29rICYmIGhvb2soZWwsIHJlc29sdmUpO1xyXG4gICAgICAgICAgICBuZXh0RnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBpc0FwcGVhciA/IGFwcGVhckZyb21DbGFzcyA6IGVudGVyRnJvbUNsYXNzKTtcclxuICAgICAgICAgICAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgaXNBcHBlYXIgPyBhcHBlYXJUb0NsYXNzIDogZW50ZXJUb0NsYXNzKTtcclxuICAgICAgICAgICAgICAgIGlmICghKGhvb2sgJiYgaG9vay5sZW5ndGggPiAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRlckR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgZW50ZXJEdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVuVHJhbnNpdGlvbkVuZHMoZWwsIHR5cGUsIHJlc29sdmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gZXh0ZW5kKGJhc2VQcm9wcywge1xyXG4gICAgICAgIG9uQmVmb3JlRW50ZXIoZWwpIHtcclxuICAgICAgICAgICAgb25CZWZvcmVFbnRlciAmJiBvbkJlZm9yZUVudGVyKGVsKTtcclxuICAgICAgICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBlbnRlckFjdGl2ZUNsYXNzKTtcclxuICAgICAgICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBlbnRlckZyb21DbGFzcyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkJlZm9yZUFwcGVhcihlbCkge1xyXG4gICAgICAgICAgICBvbkJlZm9yZUFwcGVhciAmJiBvbkJlZm9yZUFwcGVhcihlbCk7XHJcbiAgICAgICAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgYXBwZWFyQWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgICAgICBhZGRUcmFuc2l0aW9uQ2xhc3MoZWwsIGFwcGVhckZyb21DbGFzcyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkVudGVyOiBtYWtlRW50ZXJIb29rKGZhbHNlKSxcclxuICAgICAgICBvbkFwcGVhcjogbWFrZUVudGVySG9vayh0cnVlKSxcclxuICAgICAgICBvbkxlYXZlKGVsLCBkb25lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmUgPSAoKSA9PiBmaW5pc2hMZWF2ZShlbCwgZG9uZSk7XHJcbiAgICAgICAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVBY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVGcm9tQ2xhc3MpO1xyXG4gICAgICAgICAgICBuZXh0RnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUZyb21DbGFzcyk7XHJcbiAgICAgICAgICAgICAgICBhZGRUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlVG9DbGFzcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShvbkxlYXZlICYmIG9uTGVhdmUubGVuZ3RoID4gMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGVhdmVEdXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGxlYXZlRHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlblRyYW5zaXRpb25FbmRzKGVsLCB0eXBlLCByZXNvbHZlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBvbkxlYXZlICYmIG9uTGVhdmUoZWwsIHJlc29sdmUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25FbnRlckNhbmNlbGxlZChlbCkge1xyXG4gICAgICAgICAgICBmaW5pc2hFbnRlcihlbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICBvbkVudGVyQ2FuY2VsbGVkICYmIG9uRW50ZXJDYW5jZWxsZWQoZWwpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25BcHBlYXJDYW5jZWxsZWQoZWwpIHtcclxuICAgICAgICAgICAgZmluaXNoRW50ZXIoZWwsIHRydWUpO1xyXG4gICAgICAgICAgICBvbkFwcGVhckNhbmNlbGxlZCAmJiBvbkFwcGVhckNhbmNlbGxlZChlbCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkxlYXZlQ2FuY2VsbGVkKGVsKSB7XHJcbiAgICAgICAgICAgIGZpbmlzaExlYXZlKGVsKTtcclxuICAgICAgICAgICAgb25MZWF2ZUNhbmNlbGxlZCAmJiBvbkxlYXZlQ2FuY2VsbGVkKGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBub3JtYWxpemVEdXJhdGlvbihkdXJhdGlvbikge1xyXG4gICAgaWYgKGR1cmF0aW9uID09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzT2JqZWN0KGR1cmF0aW9uKSkge1xyXG4gICAgICAgIHJldHVybiBbTnVtYmVyT2YoZHVyYXRpb24uZW50ZXIpLCBOdW1iZXJPZihkdXJhdGlvbi5sZWF2ZSldO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbiA9IE51bWJlck9mKGR1cmF0aW9uKTtcclxuICAgICAgICByZXR1cm4gW24sIG5dO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIE51bWJlck9mKHZhbCkge1xyXG4gICAgY29uc3QgcmVzID0gdG9OdW1iZXIodmFsKTtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpXHJcbiAgICAgICAgdmFsaWRhdGVEdXJhdGlvbihyZXMpO1xyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG5mdW5jdGlvbiB2YWxpZGF0ZUR1cmF0aW9uKHZhbCkge1xyXG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgd2FybihgPHRyYW5zaXRpb24+IGV4cGxpY2l0IGR1cmF0aW9uIGlzIG5vdCBhIHZhbGlkIG51bWJlciAtIGAgK1xyXG4gICAgICAgICAgICBgZ290ICR7SlNPTi5zdHJpbmdpZnkodmFsKX0uYCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc05hTih2YWwpKSB7XHJcbiAgICAgICAgd2FybihgPHRyYW5zaXRpb24+IGV4cGxpY2l0IGR1cmF0aW9uIGlzIE5hTiAtIGAgK1xyXG4gICAgICAgICAgICAndGhlIGR1cmF0aW9uIGV4cHJlc3Npb24gbWlnaHQgYmUgaW5jb3JyZWN0LicpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgY2xzKSB7XHJcbiAgICBjbHMuc3BsaXQoL1xccysvKS5mb3JFYWNoKGMgPT4gYyAmJiBlbC5jbGFzc0xpc3QuYWRkKGMpKTtcclxuICAgIChlbC5fdnRjIHx8XHJcbiAgICAgICAgKGVsLl92dGMgPSBuZXcgU2V0KCkpKS5hZGQoY2xzKTtcclxufVxyXG5mdW5jdGlvbiByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGNscykge1xyXG4gICAgY2xzLnNwbGl0KC9cXHMrLykuZm9yRWFjaChjID0+IGMgJiYgZWwuY2xhc3NMaXN0LnJlbW92ZShjKSk7XHJcbiAgICBjb25zdCB7IF92dGMgfSA9IGVsO1xyXG4gICAgaWYgKF92dGMpIHtcclxuICAgICAgICBfdnRjLmRlbGV0ZShjbHMpO1xyXG4gICAgICAgIGlmICghX3Z0Yy5zaXplKSB7XHJcbiAgICAgICAgICAgIGVsLl92dGMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG5leHRGcmFtZShjYikge1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gd2hlblRyYW5zaXRpb25FbmRzKGVsLCBleHBlY3RlZFR5cGUsIGNiKSB7XHJcbiAgICBjb25zdCB7IHR5cGUsIHRpbWVvdXQsIHByb3BDb3VudCB9ID0gZ2V0VHJhbnNpdGlvbkluZm8oZWwsIGV4cGVjdGVkVHlwZSk7XHJcbiAgICBpZiAoIXR5cGUpIHtcclxuICAgICAgICByZXR1cm4gY2IoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGVuZEV2ZW50ID0gdHlwZSArICdlbmQnO1xyXG4gICAgbGV0IGVuZGVkID0gMDtcclxuICAgIGNvbnN0IGVuZCA9ICgpID0+IHtcclxuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGVuZEV2ZW50LCBvbkVuZCk7XHJcbiAgICAgICAgY2IoKTtcclxuICAgIH07XHJcbiAgICBjb25zdCBvbkVuZCA9IChlKSA9PiB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBlbCkge1xyXG4gICAgICAgICAgICBpZiAoKytlbmRlZCA+PSBwcm9wQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIGVuZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGlmIChlbmRlZCA8IHByb3BDb3VudCkge1xyXG4gICAgICAgICAgICBlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LCB0aW1lb3V0ICsgMSk7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKGVuZEV2ZW50LCBvbkVuZCk7XHJcbn1cclxuZnVuY3Rpb24gZ2V0VHJhbnNpdGlvbkluZm8oZWwsIGV4cGVjdGVkVHlwZSkge1xyXG4gICAgY29uc3Qgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xyXG4gICAgLy8gSlNET00gbWF5IHJldHVybiB1bmRlZmluZWQgZm9yIHRyYW5zaXRpb24gcHJvcGVydGllc1xyXG4gICAgY29uc3QgZ2V0U3R5bGVQcm9wZXJ0aWVzID0gKGtleSkgPT4gKHN0eWxlc1trZXldIHx8ICcnKS5zcGxpdCgnLCAnKTtcclxuICAgIGNvbnN0IHRyYW5zaXRpb25EZWxheXMgPSBnZXRTdHlsZVByb3BlcnRpZXMoVFJBTlNJVElPTiArICdEZWxheScpO1xyXG4gICAgY29uc3QgdHJhbnNpdGlvbkR1cmF0aW9ucyA9IGdldFN0eWxlUHJvcGVydGllcyhUUkFOU0lUSU9OICsgJ0R1cmF0aW9uJyk7XHJcbiAgICBjb25zdCB0cmFuc2l0aW9uVGltZW91dCA9IGdldFRpbWVvdXQodHJhbnNpdGlvbkRlbGF5cywgdHJhbnNpdGlvbkR1cmF0aW9ucyk7XHJcbiAgICBjb25zdCBhbmltYXRpb25EZWxheXMgPSBnZXRTdHlsZVByb3BlcnRpZXMoQU5JTUFUSU9OICsgJ0RlbGF5Jyk7XHJcbiAgICBjb25zdCBhbmltYXRpb25EdXJhdGlvbnMgPSBnZXRTdHlsZVByb3BlcnRpZXMoQU5JTUFUSU9OICsgJ0R1cmF0aW9uJyk7XHJcbiAgICBjb25zdCBhbmltYXRpb25UaW1lb3V0ID0gZ2V0VGltZW91dChhbmltYXRpb25EZWxheXMsIGFuaW1hdGlvbkR1cmF0aW9ucyk7XHJcbiAgICBsZXQgdHlwZSA9IG51bGw7XHJcbiAgICBsZXQgdGltZW91dCA9IDA7XHJcbiAgICBsZXQgcHJvcENvdW50ID0gMDtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKGV4cGVjdGVkVHlwZSA9PT0gVFJBTlNJVElPTikge1xyXG4gICAgICAgIGlmICh0cmFuc2l0aW9uVGltZW91dCA+IDApIHtcclxuICAgICAgICAgICAgdHlwZSA9IFRSQU5TSVRJT047XHJcbiAgICAgICAgICAgIHRpbWVvdXQgPSB0cmFuc2l0aW9uVGltZW91dDtcclxuICAgICAgICAgICAgcHJvcENvdW50ID0gdHJhbnNpdGlvbkR1cmF0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZXhwZWN0ZWRUeXBlID09PSBBTklNQVRJT04pIHtcclxuICAgICAgICBpZiAoYW5pbWF0aW9uVGltZW91dCA+IDApIHtcclxuICAgICAgICAgICAgdHlwZSA9IEFOSU1BVElPTjtcclxuICAgICAgICAgICAgdGltZW91dCA9IGFuaW1hdGlvblRpbWVvdXQ7XHJcbiAgICAgICAgICAgIHByb3BDb3VudCA9IGFuaW1hdGlvbkR1cmF0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGltZW91dCA9IE1hdGgubWF4KHRyYW5zaXRpb25UaW1lb3V0LCBhbmltYXRpb25UaW1lb3V0KTtcclxuICAgICAgICB0eXBlID1cclxuICAgICAgICAgICAgdGltZW91dCA+IDBcclxuICAgICAgICAgICAgICAgID8gdHJhbnNpdGlvblRpbWVvdXQgPiBhbmltYXRpb25UaW1lb3V0XHJcbiAgICAgICAgICAgICAgICAgICAgPyBUUkFOU0lUSU9OXHJcbiAgICAgICAgICAgICAgICAgICAgOiBBTklNQVRJT05cclxuICAgICAgICAgICAgICAgIDogbnVsbDtcclxuICAgICAgICBwcm9wQ291bnQgPSB0eXBlXHJcbiAgICAgICAgICAgID8gdHlwZSA9PT0gVFJBTlNJVElPTlxyXG4gICAgICAgICAgICAgICAgPyB0cmFuc2l0aW9uRHVyYXRpb25zLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgOiBhbmltYXRpb25EdXJhdGlvbnMubGVuZ3RoXHJcbiAgICAgICAgICAgIDogMDtcclxuICAgIH1cclxuICAgIGNvbnN0IGhhc1RyYW5zZm9ybSA9IHR5cGUgPT09IFRSQU5TSVRJT04gJiZcclxuICAgICAgICAvXFxiKHRyYW5zZm9ybXxhbGwpKCx8JCkvLnRlc3Qoc3R5bGVzW1RSQU5TSVRJT04gKyAnUHJvcGVydHknXSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGUsXHJcbiAgICAgICAgdGltZW91dCxcclxuICAgICAgICBwcm9wQ291bnQsXHJcbiAgICAgICAgaGFzVHJhbnNmb3JtXHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGdldFRpbWVvdXQoZGVsYXlzLCBkdXJhdGlvbnMpIHtcclxuICAgIHdoaWxlIChkZWxheXMubGVuZ3RoIDwgZHVyYXRpb25zLmxlbmd0aCkge1xyXG4gICAgICAgIGRlbGF5cyA9IGRlbGF5cy5jb25jYXQoZGVsYXlzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBNYXRoLm1heCguLi5kdXJhdGlvbnMubWFwKChkLCBpKSA9PiB0b01zKGQpICsgdG9NcyhkZWxheXNbaV0pKSk7XHJcbn1cclxuLy8gT2xkIHZlcnNpb25zIG9mIENocm9taXVtIChiZWxvdyA2MS4wLjMxNjMuMTAwKSBmb3JtYXRzIGZsb2F0aW5nIHBvaW50ZXJcclxuLy8gbnVtYmVycyBpbiBhIGxvY2FsZS1kZXBlbmRlbnQgd2F5LCB1c2luZyBhIGNvbW1hIGluc3RlYWQgb2YgYSBkb3QuXHJcbi8vIElmIGNvbW1hIGlzIG5vdCByZXBsYWNlZCB3aXRoIGEgZG90LCB0aGUgaW5wdXQgd2lsbCBiZSByb3VuZGVkIGRvd25cclxuLy8gKGkuZS4gYWN0aW5nIGFzIGEgZmxvb3IgZnVuY3Rpb24pIGNhdXNpbmcgdW5leHBlY3RlZCBiZWhhdmlvcnNcclxuZnVuY3Rpb24gdG9NcyhzKSB7XHJcbiAgICByZXR1cm4gTnVtYmVyKHMuc2xpY2UoMCwgLTEpLnJlcGxhY2UoJywnLCAnLicpKSAqIDEwMDA7XHJcbn1cblxuZnVuY3Rpb24gdG9SYXcob2JzZXJ2ZWQpIHtcclxuICAgIHJldHVybiAoKG9ic2VydmVkICYmIHRvUmF3KG9ic2VydmVkW1wiX192X3Jhd1wiIC8qIFJBVyAqL10pKSB8fCBvYnNlcnZlZCk7XHJcbn1cblxuY29uc3QgcG9zaXRpb25NYXAgPSBuZXcgV2Vha01hcCgpO1xyXG5jb25zdCBuZXdQb3NpdGlvbk1hcCA9IG5ldyBXZWFrTWFwKCk7XHJcbmNvbnN0IFRyYW5zaXRpb25Hcm91cEltcGwgPSB7XHJcbiAgICBuYW1lOiAnVHJhbnNpdGlvbkdyb3VwJyxcclxuICAgIHByb3BzOiBleHRlbmQoe30sIFRyYW5zaXRpb25Qcm9wc1ZhbGlkYXRvcnMsIHtcclxuICAgICAgICB0YWc6IFN0cmluZyxcclxuICAgICAgICBtb3ZlQ2xhc3M6IFN0cmluZ1xyXG4gICAgfSksXHJcbiAgICBzZXR1cChwcm9wcywgeyBzbG90cyB9KSB7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBnZXRDdXJyZW50SW5zdGFuY2UoKTtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHVzZVRyYW5zaXRpb25TdGF0ZSgpO1xyXG4gICAgICAgIGxldCBwcmV2Q2hpbGRyZW47XHJcbiAgICAgICAgbGV0IGNoaWxkcmVuO1xyXG4gICAgICAgIG9uVXBkYXRlZCgoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNoaWxkcmVuIGlzIGd1YXJhbnRlZWQgdG8gZXhpc3QgYWZ0ZXIgaW5pdGlhbCByZW5kZXJcclxuICAgICAgICAgICAgaWYgKCFwcmV2Q2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbW92ZUNsYXNzID0gcHJvcHMubW92ZUNsYXNzIHx8IGAke3Byb3BzLm5hbWUgfHwgJ3YnfS1tb3ZlYDtcclxuICAgICAgICAgICAgaWYgKCFoYXNDU1NUcmFuc2Zvcm0ocHJldkNoaWxkcmVuWzBdLmVsLCBpbnN0YW5jZS52bm9kZS5lbCwgbW92ZUNsYXNzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHdlIGRpdmlkZSB0aGUgd29yayBpbnRvIHRocmVlIGxvb3BzIHRvIGF2b2lkIG1peGluZyBET00gcmVhZHMgYW5kIHdyaXRlc1xyXG4gICAgICAgICAgICAvLyBpbiBlYWNoIGl0ZXJhdGlvbiAtIHdoaWNoIGhlbHBzIHByZXZlbnQgbGF5b3V0IHRocmFzaGluZy5cclxuICAgICAgICAgICAgcHJldkNoaWxkcmVuLmZvckVhY2goY2FsbFBlbmRpbmdDYnMpO1xyXG4gICAgICAgICAgICBwcmV2Q2hpbGRyZW4uZm9yRWFjaChyZWNvcmRQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vdmVkQ2hpbGRyZW4gPSBwcmV2Q2hpbGRyZW4uZmlsdGVyKGFwcGx5VHJhbnNsYXRpb24pO1xyXG4gICAgICAgICAgICAvLyBmb3JjZSByZWZsb3cgdG8gcHV0IGV2ZXJ5dGhpbmcgaW4gcG9zaXRpb25cclxuICAgICAgICAgICAgZm9yY2VSZWZsb3coKTtcclxuICAgICAgICAgICAgbW92ZWRDaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBjLmVsO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBlbC5zdHlsZTtcclxuICAgICAgICAgICAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgbW92ZUNsYXNzKTtcclxuICAgICAgICAgICAgICAgIHN0eWxlLnRyYW5zZm9ybSA9IHN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2IgPSAoZWwuX21vdmVDYiA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgJiYgZS50YXJnZXQgIT09IGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlIHx8IC90cmFuc2Zvcm0kLy50ZXN0KGUucHJvcGVydHlOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgY2IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5fbW92ZUNiID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBtb3ZlQ2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGNiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmF3UHJvcHMgPSB0b1Jhdyhwcm9wcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNzc1RyYW5zaXRpb25Qcm9wcyA9IHJlc29sdmVUcmFuc2l0aW9uUHJvcHMocmF3UHJvcHMpO1xyXG4gICAgICAgICAgICBjb25zdCB0YWcgPSByYXdQcm9wcy50YWcgfHwgRnJhZ21lbnQ7XHJcbiAgICAgICAgICAgIHByZXZDaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgICAgICAgICBjaGlsZHJlbiA9IHNsb3RzLmRlZmF1bHQgPyBnZXRUcmFuc2l0aW9uUmF3Q2hpbGRyZW4oc2xvdHMuZGVmYXVsdCgpKSA6IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLmtleSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VHJhbnNpdGlvbkhvb2tzKGNoaWxkLCByZXNvbHZlVHJhbnNpdGlvbkhvb2tzKGNoaWxkLCBjc3NUcmFuc2l0aW9uUHJvcHMsIHN0YXRlLCBpbnN0YW5jZSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgPFRyYW5zaXRpb25Hcm91cD4gY2hpbGRyZW4gbXVzdCBiZSBrZXllZC5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJldkNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gcHJldkNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRyYW5zaXRpb25Ib29rcyhjaGlsZCwgcmVzb2x2ZVRyYW5zaXRpb25Ib29rcyhjaGlsZCwgY3NzVHJhbnNpdGlvblByb3BzLCBzdGF0ZSwgaW5zdGFuY2UpKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbk1hcC5zZXQoY2hpbGQsIGNoaWxkLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlVk5vZGUodGFnLCBudWxsLCBjaGlsZHJlbik7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxuLy8gcmVtb3ZlIG1vZGUgcHJvcHMgYXMgVHJhbnNpdGlvbkdyb3VwIGRvZXNuJ3Qgc3VwcG9ydCBpdFxyXG5kZWxldGUgVHJhbnNpdGlvbkdyb3VwSW1wbC5wcm9wcy5tb2RlO1xyXG5jb25zdCBUcmFuc2l0aW9uR3JvdXAgPSBUcmFuc2l0aW9uR3JvdXBJbXBsO1xyXG5mdW5jdGlvbiBjYWxsUGVuZGluZ0NicyhjKSB7XHJcbiAgICBjb25zdCBlbCA9IGMuZWw7XHJcbiAgICBpZiAoZWwuX21vdmVDYikge1xyXG4gICAgICAgIGVsLl9tb3ZlQ2IoKTtcclxuICAgIH1cclxuICAgIGlmIChlbC5fZW50ZXJDYikge1xyXG4gICAgICAgIGVsLl9lbnRlckNiKCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVjb3JkUG9zaXRpb24oYykge1xyXG4gICAgbmV3UG9zaXRpb25NYXAuc2V0KGMsIGMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xyXG59XHJcbmZ1bmN0aW9uIGFwcGx5VHJhbnNsYXRpb24oYykge1xyXG4gICAgY29uc3Qgb2xkUG9zID0gcG9zaXRpb25NYXAuZ2V0KGMpO1xyXG4gICAgY29uc3QgbmV3UG9zID0gbmV3UG9zaXRpb25NYXAuZ2V0KGMpO1xyXG4gICAgY29uc3QgZHggPSBvbGRQb3MubGVmdCAtIG5ld1Bvcy5sZWZ0O1xyXG4gICAgY29uc3QgZHkgPSBvbGRQb3MudG9wIC0gbmV3UG9zLnRvcDtcclxuICAgIGlmIChkeCB8fCBkeSkge1xyXG4gICAgICAgIGNvbnN0IHMgPSBjLmVsLnN0eWxlO1xyXG4gICAgICAgIHMudHJhbnNmb3JtID0gcy53ZWJraXRUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7ZHh9cHgsJHtkeX1weClgO1xyXG4gICAgICAgIHMudHJhbnNpdGlvbkR1cmF0aW9uID0gJzBzJztcclxuICAgICAgICByZXR1cm4gYztcclxuICAgIH1cclxufVxyXG4vLyB0aGlzIGlzIHB1dCBpbiBhIGRlZGljYXRlZCBmdW5jdGlvbiB0byBhdm9pZCB0aGUgbGluZSBmcm9tIGJlaW5nIHRyZWVzaGFrZW5cclxuZnVuY3Rpb24gZm9yY2VSZWZsb3coKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XHJcbn1cclxuZnVuY3Rpb24gaGFzQ1NTVHJhbnNmb3JtKGVsLCByb290LCBtb3ZlQ2xhc3MpIHtcclxuICAgIC8vIERldGVjdCB3aGV0aGVyIGFuIGVsZW1lbnQgd2l0aCB0aGUgbW92ZSBjbGFzcyBhcHBsaWVkIGhhc1xyXG4gICAgLy8gQ1NTIHRyYW5zaXRpb25zLiBTaW5jZSB0aGUgZWxlbWVudCBtYXkgYmUgaW5zaWRlIGFuIGVudGVyaW5nXHJcbiAgICAvLyB0cmFuc2l0aW9uIGF0IHRoaXMgdmVyeSBtb21lbnQsIHdlIG1ha2UgYSBjbG9uZSBvZiBpdCBhbmQgcmVtb3ZlXHJcbiAgICAvLyBhbGwgb3RoZXIgdHJhbnNpdGlvbiBjbGFzc2VzIGFwcGxpZWQgdG8gZW5zdXJlIG9ubHkgdGhlIG1vdmUgY2xhc3NcclxuICAgIC8vIGlzIGFwcGxpZWQuXHJcbiAgICBjb25zdCBjbG9uZSA9IGVsLmNsb25lTm9kZSgpO1xyXG4gICAgaWYgKGVsLl92dGMpIHtcclxuICAgICAgICBlbC5fdnRjLmZvckVhY2goY2xzID0+IHtcclxuICAgICAgICAgICAgY2xzLnNwbGl0KC9cXHMrLykuZm9yRWFjaChjID0+IGMgJiYgY2xvbmUuY2xhc3NMaXN0LnJlbW92ZShjKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBtb3ZlQ2xhc3Muc3BsaXQoL1xccysvKS5mb3JFYWNoKGMgPT4gYyAmJiBjbG9uZS5jbGFzc0xpc3QuYWRkKGMpKTtcclxuICAgIGNsb25lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSAocm9vdC5ub2RlVHlwZSA9PT0gMVxyXG4gICAgICAgID8gcm9vdFxyXG4gICAgICAgIDogcm9vdC5wYXJlbnROb2RlKTtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9uZSk7XHJcbiAgICBjb25zdCB7IGhhc1RyYW5zZm9ybSB9ID0gZ2V0VHJhbnNpdGlvbkluZm8oY2xvbmUpO1xyXG4gICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGNsb25lKTtcclxuICAgIHJldHVybiBoYXNUcmFuc2Zvcm07XHJcbn1cblxuY29uc3QgZ2V0TW9kZWxBc3NpZ25lciA9ICh2bm9kZSkgPT4ge1xyXG4gICAgY29uc3QgZm4gPSB2bm9kZS5wcm9wc1snb25VcGRhdGU6bW9kZWxWYWx1ZSddO1xyXG4gICAgcmV0dXJuIGlzQXJyYXkoZm4pID8gdmFsdWUgPT4gaW52b2tlQXJyYXlGbnMoZm4sIHZhbHVlKSA6IGZuO1xyXG59O1xyXG5mdW5jdGlvbiBvbkNvbXBvc2l0aW9uU3RhcnQoZSkge1xyXG4gICAgZS50YXJnZXQuY29tcG9zaW5nID0gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBvbkNvbXBvc2l0aW9uRW5kKGUpIHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgaWYgKHRhcmdldC5jb21wb3NpbmcpIHtcclxuICAgICAgICB0YXJnZXQuY29tcG9zaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdHJpZ2dlcih0YXJnZXQsICdpbnB1dCcpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIHR5cGUpIHtcclxuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xyXG4gICAgZS5pbml0RXZlbnQodHlwZSwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBlbC5kaXNwYXRjaEV2ZW50KGUpO1xyXG59XHJcbi8vIFdlIGFyZSBleHBvcnRpbmcgdGhlIHYtbW9kZWwgcnVudGltZSBkaXJlY3RseSBhcyB2bm9kZSBob29rcyBzbyB0aGF0IGl0IGNhblxyXG4vLyBiZSB0cmVlLXNoYWtlbiBpbiBjYXNlIHYtbW9kZWwgaXMgbmV2ZXIgdXNlZC5cclxuY29uc3Qgdk1vZGVsVGV4dCA9IHtcclxuICAgIGJlZm9yZU1vdW50KGVsLCB7IHZhbHVlLCBtb2RpZmllcnM6IHsgbGF6eSwgdHJpbSwgbnVtYmVyIH0gfSwgdm5vZGUpIHtcclxuICAgICAgICBlbC52YWx1ZSA9IHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlO1xyXG4gICAgICAgIGVsLl9hc3NpZ24gPSBnZXRNb2RlbEFzc2lnbmVyKHZub2RlKTtcclxuICAgICAgICBjb25zdCBjYXN0VG9OdW1iZXIgPSBudW1iZXIgfHwgZWwudHlwZSA9PT0gJ251bWJlcic7XHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihlbCwgbGF6eSA/ICdjaGFuZ2UnIDogJ2lucHV0JywgZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5jb21wb3NpbmcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGxldCBkb21WYWx1ZSA9IGVsLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodHJpbSkge1xyXG4gICAgICAgICAgICAgICAgZG9tVmFsdWUgPSBkb21WYWx1ZS50cmltKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2FzdFRvTnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICBkb21WYWx1ZSA9IHRvTnVtYmVyKGRvbVZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbC5fYXNzaWduKGRvbVZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAodHJpbSkge1xyXG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKGVsLCAnY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWwudmFsdWUgPSBlbC52YWx1ZS50cmltKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWxhenkpIHtcclxuICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihlbCwgJ2NvbXBvc2l0aW9uc3RhcnQnLCBvbkNvbXBvc2l0aW9uU3RhcnQpO1xyXG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKGVsLCAnY29tcG9zaXRpb25lbmQnLCBvbkNvbXBvc2l0aW9uRW5kKTtcclxuICAgICAgICAgICAgLy8gU2FmYXJpIDwgMTAuMiAmIFVJV2ViVmlldyBkb2Vzbid0IGZpcmUgY29tcG9zaXRpb25lbmQgd2hlblxyXG4gICAgICAgICAgICAvLyBzd2l0Y2hpbmcgZm9jdXMgYmVmb3JlIGNvbmZpcm1pbmcgY29tcG9zaXRpb24gY2hvaWNlXHJcbiAgICAgICAgICAgIC8vIHRoaXMgYWxzbyBmaXhlcyB0aGUgaXNzdWUgd2hlcmUgc29tZSBicm93c2VycyBlLmcuIGlPUyBDaHJvbWVcclxuICAgICAgICAgICAgLy8gZmlyZXMgXCJjaGFuZ2VcIiBpbnN0ZWFkIG9mIFwiaW5wdXRcIiBvbiBhdXRvY29tcGxldGUuXHJcbiAgICAgICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZWwsICdjaGFuZ2UnLCBvbkNvbXBvc2l0aW9uRW5kKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYmVmb3JlVXBkYXRlKGVsLCB7IHZhbHVlLCBtb2RpZmllcnM6IHsgdHJpbSwgbnVtYmVyIH0gfSwgdm5vZGUpIHtcclxuICAgICAgICBlbC5fYXNzaWduID0gZ2V0TW9kZWxBc3NpZ25lcih2bm9kZSk7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGVsKSB7XHJcbiAgICAgICAgICAgIGlmICh0cmltICYmIGVsLnZhbHVlLnRyaW0oKSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoKG51bWJlciB8fCBlbC50eXBlID09PSAnbnVtYmVyJykgJiYgdG9OdW1iZXIoZWwudmFsdWUpID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsLnZhbHVlID0gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHZNb2RlbENoZWNrYm94ID0ge1xyXG4gICAgYmVmb3JlTW91bnQoZWwsIGJpbmRpbmcsIHZub2RlKSB7XHJcbiAgICAgICAgc2V0Q2hlY2tlZChlbCwgYmluZGluZywgdm5vZGUpO1xyXG4gICAgICAgIGVsLl9hc3NpZ24gPSBnZXRNb2RlbEFzc2lnbmVyKHZub2RlKTtcclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKGVsLCAnY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbFZhbHVlID0gZWwuX21vZGVsVmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRWYWx1ZSA9IGdldFZhbHVlKGVsKTtcclxuICAgICAgICAgICAgY29uc3QgY2hlY2tlZCA9IGVsLmNoZWNrZWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGFzc2lnbiA9IGVsLl9hc3NpZ247XHJcbiAgICAgICAgICAgIGlmIChpc0FycmF5KG1vZGVsVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGxvb3NlSW5kZXhPZihtb2RlbFZhbHVlLCBlbGVtZW50VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZm91bmQgPSBpbmRleCAhPT0gLTE7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCAmJiAhZm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ24obW9kZWxWYWx1ZS5jb25jYXQoZWxlbWVudFZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICghY2hlY2tlZCAmJiBmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkID0gWy4uLm1vZGVsVmFsdWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduKGZpbHRlcmVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFzc2lnbihnZXRDaGVja2JveFZhbHVlKGVsLCBjaGVja2VkKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBiZWZvcmVVcGRhdGUoZWwsIGJpbmRpbmcsIHZub2RlKSB7XHJcbiAgICAgICAgZWwuX2Fzc2lnbiA9IGdldE1vZGVsQXNzaWduZXIodm5vZGUpO1xyXG4gICAgICAgIHNldENoZWNrZWQoZWwsIGJpbmRpbmcsIHZub2RlKTtcclxuICAgIH1cclxufTtcclxuZnVuY3Rpb24gc2V0Q2hlY2tlZChlbCwgeyB2YWx1ZSwgb2xkVmFsdWUgfSwgdm5vZGUpIHtcclxuICAgIGVsLl9tb2RlbFZhbHVlID0gdmFsdWU7XHJcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICBlbC5jaGVja2VkID0gbG9vc2VJbmRleE9mKHZhbHVlLCB2bm9kZS5wcm9wcy52YWx1ZSkgPiAtMTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHZhbHVlICE9PSBvbGRWYWx1ZSkge1xyXG4gICAgICAgIGVsLmNoZWNrZWQgPSBsb29zZUVxdWFsKHZhbHVlLCBnZXRDaGVja2JveFZhbHVlKGVsLCB0cnVlKSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3Qgdk1vZGVsUmFkaW8gPSB7XHJcbiAgICBiZWZvcmVNb3VudChlbCwgeyB2YWx1ZSB9LCB2bm9kZSkge1xyXG4gICAgICAgIGVsLmNoZWNrZWQgPSBsb29zZUVxdWFsKHZhbHVlLCB2bm9kZS5wcm9wcy52YWx1ZSk7XHJcbiAgICAgICAgZWwuX2Fzc2lnbiA9IGdldE1vZGVsQXNzaWduZXIodm5vZGUpO1xyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZWwsICdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGVsLl9hc3NpZ24oZ2V0VmFsdWUoZWwpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBiZWZvcmVVcGRhdGUoZWwsIHsgdmFsdWUsIG9sZFZhbHVlIH0sIHZub2RlKSB7XHJcbiAgICAgICAgZWwuX2Fzc2lnbiA9IGdldE1vZGVsQXNzaWduZXIodm5vZGUpO1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gb2xkVmFsdWUpIHtcclxuICAgICAgICAgICAgZWwuY2hlY2tlZCA9IGxvb3NlRXF1YWwodmFsdWUsIHZub2RlLnByb3BzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IHZNb2RlbFNlbGVjdCA9IHtcclxuICAgIC8vIHVzZSBtb3VudGVkICYgdXBkYXRlZCBiZWNhdXNlIDxzZWxlY3Q+IHJlbGllcyBvbiBpdHMgY2hpbGRyZW4gPG9wdGlvbj5zLlxyXG4gICAgbW91bnRlZChlbCwgeyB2YWx1ZSB9LCB2bm9kZSkge1xyXG4gICAgICAgIHNldFNlbGVjdGVkKGVsLCB2YWx1ZSk7XHJcbiAgICAgICAgZWwuX2Fzc2lnbiA9IGdldE1vZGVsQXNzaWduZXIodm5vZGUpO1xyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZWwsICdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkVmFsID0gQXJyYXkucHJvdG90eXBlLmZpbHRlclxyXG4gICAgICAgICAgICAgICAgLmNhbGwoZWwub3B0aW9ucywgKG8pID0+IG8uc2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICAubWFwKGdldFZhbHVlKTtcclxuICAgICAgICAgICAgZWwuX2Fzc2lnbihlbC5tdWx0aXBsZSA/IHNlbGVjdGVkVmFsIDogc2VsZWN0ZWRWYWxbMF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGJlZm9yZVVwZGF0ZShlbCwgX2JpbmRpbmcsIHZub2RlKSB7XHJcbiAgICAgICAgZWwuX2Fzc2lnbiA9IGdldE1vZGVsQXNzaWduZXIodm5vZGUpO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZWQoZWwsIHsgdmFsdWUgfSkge1xyXG4gICAgICAgIHNldFNlbGVjdGVkKGVsLCB2YWx1ZSk7XHJcbiAgICB9XHJcbn07XHJcbmZ1bmN0aW9uIHNldFNlbGVjdGVkKGVsLCB2YWx1ZSkge1xyXG4gICAgY29uc3QgaXNNdWx0aXBsZSA9IGVsLm11bHRpcGxlO1xyXG4gICAgaWYgKGlzTXVsdGlwbGUgJiYgIWlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmXHJcbiAgICAgICAgICAgIHdhcm4oYDxzZWxlY3QgbXVsdGlwbGUgdi1tb2RlbD4gZXhwZWN0cyBhbiBBcnJheSB2YWx1ZSBmb3IgaXRzIGJpbmRpbmcsIGAgK1xyXG4gICAgICAgICAgICAgICAgYGJ1dCBnb3QgJHtPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLnNsaWNlKDgsIC0xKX0uYCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBlbC5vcHRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGVsLm9wdGlvbnNbaV07XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBnZXRWYWx1ZShvcHRpb24pO1xyXG4gICAgICAgIGlmIChpc011bHRpcGxlKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGxvb3NlSW5kZXhPZih2YWx1ZSwgb3B0aW9uVmFsdWUpID4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobG9vc2VFcXVhbChnZXRWYWx1ZShvcHRpb24pLCB2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIGVsLnNlbGVjdGVkSW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFpc011bHRpcGxlKSB7XHJcbiAgICAgICAgZWwuc2VsZWN0ZWRJbmRleCA9IC0xO1xyXG4gICAgfVxyXG59XHJcbi8vIHJldHJpZXZlIHJhdyB2YWx1ZSBzZXQgdmlhIDp2YWx1ZSBiaW5kaW5nc1xyXG5mdW5jdGlvbiBnZXRWYWx1ZShlbCkge1xyXG4gICAgcmV0dXJuICdfdmFsdWUnIGluIGVsID8gZWwuX3ZhbHVlIDogZWwudmFsdWU7XHJcbn1cclxuLy8gcmV0cmlldmUgcmF3IHZhbHVlIGZvciB0cnVlLXZhbHVlIGFuZCBmYWxzZS12YWx1ZSBzZXQgdmlhIDp0cnVlLXZhbHVlIG9yIDpmYWxzZS12YWx1ZSBiaW5kaW5nc1xyXG5mdW5jdGlvbiBnZXRDaGVja2JveFZhbHVlKGVsLCBjaGVja2VkKSB7XHJcbiAgICBjb25zdCBrZXkgPSBjaGVja2VkID8gJ190cnVlVmFsdWUnIDogJ19mYWxzZVZhbHVlJztcclxuICAgIHJldHVybiBrZXkgaW4gZWwgPyBlbFtrZXldIDogY2hlY2tlZDtcclxufVxyXG5jb25zdCB2TW9kZWxEeW5hbWljID0ge1xyXG4gICAgYmVmb3JlTW91bnQoZWwsIGJpbmRpbmcsIHZub2RlKSB7XHJcbiAgICAgICAgY2FsbE1vZGVsSG9vayhlbCwgYmluZGluZywgdm5vZGUsIG51bGwsICdiZWZvcmVNb3VudCcpO1xyXG4gICAgfSxcclxuICAgIG1vdW50ZWQoZWwsIGJpbmRpbmcsIHZub2RlKSB7XHJcbiAgICAgICAgY2FsbE1vZGVsSG9vayhlbCwgYmluZGluZywgdm5vZGUsIG51bGwsICdtb3VudGVkJyk7XHJcbiAgICB9LFxyXG4gICAgYmVmb3JlVXBkYXRlKGVsLCBiaW5kaW5nLCB2bm9kZSwgcHJldlZOb2RlKSB7XHJcbiAgICAgICAgY2FsbE1vZGVsSG9vayhlbCwgYmluZGluZywgdm5vZGUsIHByZXZWTm9kZSwgJ2JlZm9yZVVwZGF0ZScpO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZWQoZWwsIGJpbmRpbmcsIHZub2RlLCBwcmV2Vk5vZGUpIHtcclxuICAgICAgICBjYWxsTW9kZWxIb29rKGVsLCBiaW5kaW5nLCB2bm9kZSwgcHJldlZOb2RlLCAndXBkYXRlZCcpO1xyXG4gICAgfVxyXG59O1xyXG5mdW5jdGlvbiBjYWxsTW9kZWxIb29rKGVsLCBiaW5kaW5nLCB2bm9kZSwgcHJldlZOb2RlLCBob29rKSB7XHJcbiAgICBsZXQgbW9kZWxUb1VzZTtcclxuICAgIHN3aXRjaCAoZWwudGFnTmFtZSkge1xyXG4gICAgICAgIGNhc2UgJ1NFTEVDVCc6XHJcbiAgICAgICAgICAgIG1vZGVsVG9Vc2UgPSB2TW9kZWxTZWxlY3Q7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ1RFWFRBUkVBJzpcclxuICAgICAgICAgICAgbW9kZWxUb1VzZSA9IHZNb2RlbFRleHQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZWwudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsVG9Vc2UgPSB2TW9kZWxDaGVja2JveDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JhZGlvJzpcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbFRvVXNlID0gdk1vZGVsUmFkaW87XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsVG9Vc2UgPSB2TW9kZWxUZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBmbiA9IG1vZGVsVG9Vc2VbaG9va107XHJcbiAgICBmbiAmJiBmbihlbCwgYmluZGluZywgdm5vZGUsIHByZXZWTm9kZSk7XHJcbn1cblxuY29uc3Qgc3lzdGVtTW9kaWZpZXJzID0gWydjdHJsJywgJ3NoaWZ0JywgJ2FsdCcsICdtZXRhJ107XHJcbmNvbnN0IG1vZGlmaWVyR3VhcmRzID0ge1xyXG4gICAgc3RvcDogZSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpLFxyXG4gICAgcHJldmVudDogZSA9PiBlLnByZXZlbnREZWZhdWx0KCksXHJcbiAgICBzZWxmOiBlID0+IGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQsXHJcbiAgICBjdHJsOiBlID0+ICFlLmN0cmxLZXksXHJcbiAgICBzaGlmdDogZSA9PiAhZS5zaGlmdEtleSxcclxuICAgIGFsdDogZSA9PiAhZS5hbHRLZXksXHJcbiAgICBtZXRhOiBlID0+ICFlLm1ldGFLZXksXHJcbiAgICBsZWZ0OiBlID0+ICdidXR0b24nIGluIGUgJiYgZS5idXR0b24gIT09IDAsXHJcbiAgICBtaWRkbGU6IGUgPT4gJ2J1dHRvbicgaW4gZSAmJiBlLmJ1dHRvbiAhPT0gMSxcclxuICAgIHJpZ2h0OiBlID0+ICdidXR0b24nIGluIGUgJiYgZS5idXR0b24gIT09IDIsXHJcbiAgICBleGFjdDogKGUsIG1vZGlmaWVycykgPT4gc3lzdGVtTW9kaWZpZXJzLnNvbWUobSA9PiBlW2Ake219S2V5YF0gJiYgIW1vZGlmaWVycy5pbmNsdWRlcyhtKSlcclxufTtcclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5jb25zdCB3aXRoTW9kaWZpZXJzID0gKGZuLCBtb2RpZmllcnMpID0+IHtcclxuICAgIHJldHVybiAoZXZlbnQsIC4uLmFyZ3MpID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGlmaWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBndWFyZCA9IG1vZGlmaWVyR3VhcmRzW21vZGlmaWVyc1tpXV07XHJcbiAgICAgICAgICAgIGlmIChndWFyZCAmJiBndWFyZChldmVudCwgbW9kaWZpZXJzKSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZuKGV2ZW50LCAuLi5hcmdzKTtcclxuICAgIH07XHJcbn07XHJcbi8vIEtlcHQgZm9yIDIueCBjb21wYXQuXHJcbi8vIE5vdGU6IElFMTEgY29tcGF0IGZvciBgc3BhY2ViYXJgIGFuZCBgZGVsYCBpcyByZW1vdmVkIGZvciBub3cuXHJcbmNvbnN0IGtleU5hbWVzID0ge1xyXG4gICAgZXNjOiAnZXNjYXBlJyxcclxuICAgIHNwYWNlOiAnICcsXHJcbiAgICB1cDogJ2Fycm93LXVwJyxcclxuICAgIGxlZnQ6ICdhcnJvdy1sZWZ0JyxcclxuICAgIHJpZ2h0OiAnYXJyb3ctcmlnaHQnLFxyXG4gICAgZG93bjogJ2Fycm93LWRvd24nLFxyXG4gICAgZGVsZXRlOiAnYmFja3NwYWNlJ1xyXG59O1xyXG4vKipcclxuICogQHByaXZhdGVcclxuICovXHJcbmNvbnN0IHdpdGhLZXlzID0gKGZuLCBtb2RpZmllcnMpID0+IHtcclxuICAgIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZiAoISgna2V5JyBpbiBldmVudCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBldmVudEtleSA9IGh5cGhlbmF0ZShldmVudC5rZXkpO1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAvLyBOb25lIG9mIHRoZSBwcm92aWRlZCBrZXkgbW9kaWZpZXJzIG1hdGNoIHRoZSBjdXJyZW50IGV2ZW50IGtleVxyXG4gICAgICAgICFtb2RpZmllcnMuc29tZShrID0+IGsgPT09IGV2ZW50S2V5IHx8IGtleU5hbWVzW2tdID09PSBldmVudEtleSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZm4oZXZlbnQpO1xyXG4gICAgfTtcclxufTtcblxuY29uc3QgdlNob3cgPSB7XHJcbiAgICBiZWZvcmVNb3VudChlbCwgeyB2YWx1ZSB9LCB7IHRyYW5zaXRpb24gfSkge1xyXG4gICAgICAgIGVsLl92b2QgPSBlbC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgPyAnJyA6IGVsLnN0eWxlLmRpc3BsYXk7XHJcbiAgICAgICAgaWYgKHRyYW5zaXRpb24gJiYgdmFsdWUpIHtcclxuICAgICAgICAgICAgdHJhbnNpdGlvbi5iZWZvcmVFbnRlcihlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzZXREaXNwbGF5KGVsLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1vdW50ZWQoZWwsIHsgdmFsdWUgfSwgeyB0cmFuc2l0aW9uIH0pIHtcclxuICAgICAgICBpZiAodHJhbnNpdGlvbiAmJiB2YWx1ZSkge1xyXG4gICAgICAgICAgICB0cmFuc2l0aW9uLmVudGVyKGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlZChlbCwgeyB2YWx1ZSwgb2xkVmFsdWUgfSwgeyB0cmFuc2l0aW9uIH0pIHtcclxuICAgICAgICBpZiAoIXZhbHVlID09PSAhb2xkVmFsdWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAodHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24uYmVmb3JlRW50ZXIoZWwpO1xyXG4gICAgICAgICAgICAgICAgc2V0RGlzcGxheShlbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLmVudGVyKGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24ubGVhdmUoZWwsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXREaXNwbGF5KGVsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2V0RGlzcGxheShlbCwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBiZWZvcmVVbm1vdW50KGVsLCB7IHZhbHVlIH0pIHtcclxuICAgICAgICBzZXREaXNwbGF5KGVsLCB2YWx1ZSk7XHJcbiAgICB9XHJcbn07XHJcbmZ1bmN0aW9uIHNldERpc3BsYXkoZWwsIHZhbHVlKSB7XHJcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyBlbC5fdm9kIDogJ25vbmUnO1xyXG59XG5cbmNvbnN0IHJlbmRlcmVyT3B0aW9ucyA9IGV4dGVuZCh7IHBhdGNoUHJvcCwgZm9yY2VQYXRjaFByb3AgfSwgbm9kZU9wcyk7XHJcbi8vIGxhenkgY3JlYXRlIHRoZSByZW5kZXJlciAtIHRoaXMgbWFrZXMgY29yZSByZW5kZXJlciBsb2dpYyB0cmVlLXNoYWthYmxlXHJcbi8vIGluIGNhc2UgdGhlIHVzZXIgb25seSBpbXBvcnRzIHJlYWN0aXZpdHkgdXRpbGl0aWVzIGZyb20gVnVlLlxyXG5sZXQgcmVuZGVyZXI7XHJcbmxldCBlbmFibGVkSHlkcmF0aW9uID0gZmFsc2U7XHJcbmZ1bmN0aW9uIGVuc3VyZVJlbmRlcmVyKCkge1xyXG4gICAgcmV0dXJuIHJlbmRlcmVyIHx8IChyZW5kZXJlciA9IGNyZWF0ZVJlbmRlcmVyKHJlbmRlcmVyT3B0aW9ucykpO1xyXG59XHJcbmZ1bmN0aW9uIGVuc3VyZUh5ZHJhdGlvblJlbmRlcmVyKCkge1xyXG4gICAgcmVuZGVyZXIgPSBlbmFibGVkSHlkcmF0aW9uXHJcbiAgICAgICAgPyByZW5kZXJlclxyXG4gICAgICAgIDogY3JlYXRlSHlkcmF0aW9uUmVuZGVyZXIocmVuZGVyZXJPcHRpb25zKTtcclxuICAgIGVuYWJsZWRIeWRyYXRpb24gPSB0cnVlO1xyXG4gICAgcmV0dXJuIHJlbmRlcmVyO1xyXG59XHJcbi8vIHVzZSBleHBsaWNpdCB0eXBlIGNhc3RzIGhlcmUgdG8gYXZvaWQgaW1wb3J0KCkgY2FsbHMgaW4gcm9sbGVkLXVwIGQudHNcclxuY29uc3QgcmVuZGVyID0gKCguLi5hcmdzKSA9PiB7XHJcbiAgICBlbnN1cmVSZW5kZXJlcigpLnJlbmRlciguLi5hcmdzKTtcclxufSk7XHJcbmNvbnN0IGh5ZHJhdGUgPSAoKC4uLmFyZ3MpID0+IHtcclxuICAgIGVuc3VyZUh5ZHJhdGlvblJlbmRlcmVyKCkuaHlkcmF0ZSguLi5hcmdzKTtcclxufSk7XHJcbmNvbnN0IGNyZWF0ZUFwcCA9ICgoLi4uYXJncykgPT4ge1xyXG4gICAgY29uc3QgYXBwID0gZW5zdXJlUmVuZGVyZXIoKS5jcmVhdGVBcHAoLi4uYXJncyk7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgaW5qZWN0TmF0aXZlVGFnQ2hlY2soYXBwKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgbW91bnQgfSA9IGFwcDtcclxuICAgIGFwcC5tb3VudCA9IChjb250YWluZXJPclNlbGVjdG9yKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gbm9ybWFsaXplQ29udGFpbmVyKGNvbnRhaW5lck9yU2VsZWN0b3IpO1xyXG4gICAgICAgIGlmICghY29udGFpbmVyKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gYXBwLl9jb21wb25lbnQ7XHJcbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKGNvbXBvbmVudCkgJiYgIWNvbXBvbmVudC5yZW5kZXIgJiYgIWNvbXBvbmVudC50ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICBjb21wb25lbnQudGVtcGxhdGUgPSBjb250YWluZXIuaW5uZXJIVE1MO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjbGVhciBjb250ZW50IGJlZm9yZSBtb3VudGluZ1xyXG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICBjb25zdCBwcm94eSA9IG1vdW50KGNvbnRhaW5lcik7XHJcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZSgndi1jbG9haycpO1xyXG4gICAgICAgIHJldHVybiBwcm94eTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gYXBwO1xyXG59KTtcclxuY29uc3QgY3JlYXRlU1NSQXBwID0gKCguLi5hcmdzKSA9PiB7XHJcbiAgICBjb25zdCBhcHAgPSBlbnN1cmVIeWRyYXRpb25SZW5kZXJlcigpLmNyZWF0ZUFwcCguLi5hcmdzKTtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICBpbmplY3ROYXRpdmVUYWdDaGVjayhhcHApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBtb3VudCB9ID0gYXBwO1xyXG4gICAgYXBwLm1vdW50ID0gKGNvbnRhaW5lck9yU2VsZWN0b3IpID0+IHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBub3JtYWxpemVDb250YWluZXIoY29udGFpbmVyT3JTZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICByZXR1cm4gbW91bnQoY29udGFpbmVyLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGFwcDtcclxufSk7XHJcbmZ1bmN0aW9uIGluamVjdE5hdGl2ZVRhZ0NoZWNrKGFwcCkge1xyXG4gICAgLy8gSW5qZWN0IGBpc05hdGl2ZVRhZ2BcclxuICAgIC8vIHRoaXMgaXMgdXNlZCBmb3IgY29tcG9uZW50IG5hbWUgdmFsaWRhdGlvbiAoZGV2IG9ubHkpXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYXBwLmNvbmZpZywgJ2lzTmF0aXZlVGFnJywge1xyXG4gICAgICAgIHZhbHVlOiAodGFnKSA9PiBpc0hUTUxUYWcodGFnKSB8fCBpc1NWR1RhZyh0YWcpLFxyXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZVxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gbm9ybWFsaXplQ29udGFpbmVyKGNvbnRhaW5lcikge1xyXG4gICAgaWYgKGlzU3RyaW5nKGNvbnRhaW5lcikpIHtcclxuICAgICAgICBjb25zdCByZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiAhcmVzKSB7XHJcbiAgICAgICAgICAgIHdhcm4oYEZhaWxlZCB0byBtb3VudCBhcHA6IG1vdW50IHRhcmdldCBzZWxlY3RvciByZXR1cm5lZCBudWxsLmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcclxufVxuXG5leHBvcnQgeyBUcmFuc2l0aW9uLCBUcmFuc2l0aW9uR3JvdXAsIGNyZWF0ZUFwcCwgY3JlYXRlU1NSQXBwLCBoeWRyYXRlLCByZW5kZXIsIHVzZUNzc01vZHVsZSwgdXNlQ3NzVmFycywgdk1vZGVsQ2hlY2tib3gsIHZNb2RlbER5bmFtaWMsIHZNb2RlbFJhZGlvLCB2TW9kZWxTZWxlY3QsIHZNb2RlbFRleHQsIHZTaG93LCB3aXRoS2V5cywgd2l0aE1vZGlmaWVycyB9O1xuIiwiLyoqXHJcbiAqIE1ha2UgYSBtYXAgYW5kIHJldHVybiBhIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIGtleVxyXG4gKiBpcyBpbiB0aGF0IG1hcC5cclxuICogSU1QT1JUQU5UOiBhbGwgY2FsbHMgb2YgdGhpcyBmdW5jdGlvbiBtdXN0IGJlIHByZWZpeGVkIHdpdGhcclxuICogXFwvXFwqI1xcX1xcX1BVUkVcXF9cXF9cXCpcXC9cclxuICogU28gdGhhdCByb2xsdXAgY2FuIHRyZWUtc2hha2UgdGhlbSBpZiBuZWNlc3NhcnkuXHJcbiAqL1xyXG5mdW5jdGlvbiBtYWtlTWFwKHN0ciwgZXhwZWN0c0xvd2VyQ2FzZSkge1xyXG4gICAgY29uc3QgbWFwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgIGNvbnN0IGxpc3QgPSBzdHIuc3BsaXQoJywnKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG1hcFtsaXN0W2ldXSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwZWN0c0xvd2VyQ2FzZSA/IHZhbCA9PiAhIW1hcFt2YWwudG9Mb3dlckNhc2UoKV0gOiB2YWwgPT4gISFtYXBbdmFsXTtcclxufVxuXG4vLyBQYXRjaCBmbGFncyBhcmUgb3B0aW1pemF0aW9uIGhpbnRzIGdlbmVyYXRlZCBieSB0aGUgY29tcGlsZXIuXHJcbi8vIHdoZW4gYSBibG9jayB3aXRoIGR5bmFtaWNDaGlsZHJlbiBpcyBlbmNvdW50ZXJlZCBkdXJpbmcgZGlmZiwgdGhlIGFsZ29yaXRobVxyXG4vLyBlbnRlcnMgXCJvcHRpbWl6ZWQgbW9kZVwiLiBJbiB0aGlzIG1vZGUsIHdlIGtub3cgdGhhdCB0aGUgdmRvbSBpcyBwcm9kdWNlZCBieVxyXG4vLyBhIHJlbmRlciBmdW5jdGlvbiBnZW5lcmF0ZWQgYnkgdGhlIGNvbXBpbGVyLCBzbyB0aGUgYWxnb3JpdGhtIG9ubHkgbmVlZHMgdG9cclxuLy8gaGFuZGxlIHVwZGF0ZXMgZXhwbGljaXRseSBtYXJrZWQgYnkgdGhlc2UgcGF0Y2ggZmxhZ3MuXHJcbi8vIGRldiBvbmx5IGZsYWcgLT4gbmFtZSBtYXBwaW5nXHJcbmNvbnN0IFBhdGNoRmxhZ05hbWVzID0ge1xyXG4gICAgWzEgLyogVEVYVCAqL106IGBURVhUYCxcclxuICAgIFsyIC8qIENMQVNTICovXTogYENMQVNTYCxcclxuICAgIFs0IC8qIFNUWUxFICovXTogYFNUWUxFYCxcclxuICAgIFs4IC8qIFBST1BTICovXTogYFBST1BTYCxcclxuICAgIFsxNiAvKiBGVUxMX1BST1BTICovXTogYEZVTExfUFJPUFNgLFxyXG4gICAgWzMyIC8qIEhZRFJBVEVfRVZFTlRTICovXTogYEhZRFJBVEVfRVZFTlRTYCxcclxuICAgIFs2NCAvKiBTVEFCTEVfRlJBR01FTlQgKi9dOiBgU1RBQkxFX0ZSQUdNRU5UYCxcclxuICAgIFsxMjggLyogS0VZRURfRlJBR01FTlQgKi9dOiBgS0VZRURfRlJBR01FTlRgLFxyXG4gICAgWzI1NiAvKiBVTktFWUVEX0ZSQUdNRU5UICovXTogYFVOS0VZRURfRlJBR01FTlRgLFxyXG4gICAgWzEwMjQgLyogRFlOQU1JQ19TTE9UUyAqL106IGBEWU5BTUlDX1NMT1RTYCxcclxuICAgIFs1MTIgLyogTkVFRF9QQVRDSCAqL106IGBORUVEX1BBVENIYCxcclxuICAgIFstMSAvKiBIT0lTVEVEICovXTogYEhPSVNURURgLFxyXG4gICAgWy0yIC8qIEJBSUwgKi9dOiBgQkFJTGBcclxufTtcblxuY29uc3QgR0xPQkFMU19XSElURV9MSVNURUQgPSAnSW5maW5pdHksdW5kZWZpbmVkLE5hTixpc0Zpbml0ZSxpc05hTixwYXJzZUZsb2F0LHBhcnNlSW50LGRlY29kZVVSSSwnICtcclxuICAgICdkZWNvZGVVUklDb21wb25lbnQsZW5jb2RlVVJJLGVuY29kZVVSSUNvbXBvbmVudCxNYXRoLE51bWJlcixEYXRlLEFycmF5LCcgK1xyXG4gICAgJ09iamVjdCxCb29sZWFuLFN0cmluZyxSZWdFeHAsTWFwLFNldCxKU09OLEludGwnO1xyXG5jb25zdCBpc0dsb2JhbGx5V2hpdGVsaXN0ZWQgPSAvKiNfX1BVUkVfXyovIG1ha2VNYXAoR0xPQkFMU19XSElURV9MSVNURUQpO1xuXG5jb25zdCByYW5nZSA9IDI7XHJcbmZ1bmN0aW9uIGdlbmVyYXRlQ29kZUZyYW1lKHNvdXJjZSwgc3RhcnQgPSAwLCBlbmQgPSBzb3VyY2UubGVuZ3RoKSB7XHJcbiAgICBjb25zdCBsaW5lcyA9IHNvdXJjZS5zcGxpdCgvXFxyP1xcbi8pO1xyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuICAgIGNvbnN0IHJlcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvdW50ICs9IGxpbmVzW2ldLmxlbmd0aCArIDE7XHJcbiAgICAgICAgaWYgKGNvdW50ID49IHN0YXJ0KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBpIC0gcmFuZ2U7IGogPD0gaSArIHJhbmdlIHx8IGVuZCA+IGNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChqIDwgMCB8fCBqID49IGxpbmVzLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBqICsgMTtcclxuICAgICAgICAgICAgICAgIHJlcy5wdXNoKGAke2xpbmV9JHsnICcucmVwZWF0KDMgLSBTdHJpbmcobGluZSkubGVuZ3RoKX18ICAke2xpbmVzW2pdfWApO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZUxlbmd0aCA9IGxpbmVzW2pdLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGlmIChqID09PSBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcHVzaCB1bmRlcmxpbmVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWQgPSBzdGFydCAtIChjb3VudCAtIGxpbmVMZW5ndGgpICsgMTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZW5ndGggPSBNYXRoLm1heCgxLCBlbmQgPiBjb3VudCA/IGxpbmVMZW5ndGggLSBwYWQgOiBlbmQgLSBzdGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goYCAgIHwgIGAgKyAnICcucmVwZWF0KHBhZCkgKyAnXicucmVwZWF0KGxlbmd0aCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaiA+IGkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZW5kID4gY291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5taW4oZW5kIC0gY291bnQsIGxpbmVMZW5ndGgpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goYCAgIHwgIGAgKyAnXicucmVwZWF0KGxlbmd0aCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb3VudCArPSBsaW5lTGVuZ3RoICsgMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzLmpvaW4oJ1xcbicpO1xyXG59XG5cbmNvbnN0IG1vY2tFcnJvciA9ICgpID0+IG1vY2tXYXJuKHRydWUpO1xyXG5mdW5jdGlvbiBtb2NrV2Fybihhc0Vycm9yID0gZmFsc2UpIHtcclxuICAgIGV4cGVjdC5leHRlbmQoe1xyXG4gICAgICAgIHRvSGF2ZUJlZW5XYXJuZWQocmVjZWl2ZWQpIHtcclxuICAgICAgICAgICAgYXNzZXJ0ZWQuYWRkKHJlY2VpdmVkKTtcclxuICAgICAgICAgICAgY29uc3QgcGFzc2VkID0gd2Fybi5tb2NrLmNhbGxzLnNvbWUoYXJncyA9PiBhcmdzWzBdLmluZGV4T2YocmVjZWl2ZWQpID4gLTEpO1xyXG4gICAgICAgICAgICBpZiAocGFzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhc3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogKCkgPT4gYGV4cGVjdGVkIFwiJHtyZWNlaXZlZH1cIiBub3QgdG8gaGF2ZSBiZWVuIHdhcm5lZC5gXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbXNncyA9IHdhcm4ubW9jay5jYWxscy5tYXAoYXJncyA9PiBhcmdzWzBdKS5qb2luKCdcXG4gLSAnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogKCkgPT4gYGV4cGVjdGVkIFwiJHtyZWNlaXZlZH1cIiB0byBoYXZlIGJlZW4gd2FybmVkLlxcblxcbkFjdHVhbCBtZXNzYWdlczpcXG5cXG4gLSAke21zZ3N9YFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9IYXZlQmVlbldhcm5lZExhc3QocmVjZWl2ZWQpIHtcclxuICAgICAgICAgICAgYXNzZXJ0ZWQuYWRkKHJlY2VpdmVkKTtcclxuICAgICAgICAgICAgY29uc3QgcGFzc2VkID0gd2Fybi5tb2NrLmNhbGxzW3dhcm4ubW9jay5jYWxscy5sZW5ndGggLSAxXVswXS5pbmRleE9mKHJlY2VpdmVkKSA+IC0xO1xyXG4gICAgICAgICAgICBpZiAocGFzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhc3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogKCkgPT4gYGV4cGVjdGVkIFwiJHtyZWNlaXZlZH1cIiBub3QgdG8gaGF2ZSBiZWVuIHdhcm5lZCBsYXN0LmBcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtc2dzID0gd2Fybi5tb2NrLmNhbGxzLm1hcChhcmdzID0+IGFyZ3NbMF0pLmpvaW4oJ1xcbiAtICcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAoKSA9PiBgZXhwZWN0ZWQgXCIke3JlY2VpdmVkfVwiIHRvIGhhdmUgYmVlbiB3YXJuZWQgbGFzdC5cXG5cXG5BY3R1YWwgbWVzc2FnZXM6XFxuXFxuIC0gJHttc2dzfWBcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvSGF2ZUJlZW5XYXJuZWRUaW1lcyhyZWNlaXZlZCwgbikge1xyXG4gICAgICAgICAgICBhc3NlcnRlZC5hZGQocmVjZWl2ZWQpO1xyXG4gICAgICAgICAgICBsZXQgZm91bmQgPSAwO1xyXG4gICAgICAgICAgICB3YXJuLm1vY2suY2FsbHMuZm9yRWFjaChhcmdzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhcmdzWzBdLmluZGV4T2YocmVjZWl2ZWQpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGZvdW5kID09PSBuKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhc3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogKCkgPT4gYGV4cGVjdGVkIFwiJHtyZWNlaXZlZH1cIiB0byBoYXZlIGJlZW4gd2FybmVkICR7bn0gdGltZXMuYFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogKCkgPT4gYGV4cGVjdGVkIFwiJHtyZWNlaXZlZH1cIiB0byBoYXZlIGJlZW4gd2FybmVkICR7bn0gdGltZXMgYnV0IGdvdCAke2ZvdW5kfS5gXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBsZXQgd2FybjtcclxuICAgIGNvbnN0IGFzc2VydGVkID0gbmV3IFNldCgpO1xyXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgYXNzZXJ0ZWQuY2xlYXIoKTtcclxuICAgICAgICB3YXJuID0gamVzdC5zcHlPbihjb25zb2xlLCBhc0Vycm9yID8gJ2Vycm9yJyA6ICd3YXJuJyk7XHJcbiAgICAgICAgd2Fybi5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4geyB9KTtcclxuICAgIH0pO1xyXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcclxuICAgICAgICBjb25zdCBhc3NlcnRlZEFycmF5ID0gQXJyYXkuZnJvbShhc3NlcnRlZCk7XHJcbiAgICAgICAgY29uc3Qgbm9uQXNzZXJ0ZWRXYXJuaW5ncyA9IHdhcm4ubW9jay5jYWxsc1xyXG4gICAgICAgICAgICAubWFwKGFyZ3MgPT4gYXJnc1swXSlcclxuICAgICAgICAgICAgLmZpbHRlcihyZWNlaXZlZCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhYXNzZXJ0ZWRBcnJheS5zb21lKGFzc2VydGVkTXNnID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlZC5pbmRleE9mKGFzc2VydGVkTXNnKSA+IC0xO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB3YXJuLm1vY2tSZXN0b3JlKCk7XHJcbiAgICAgICAgaWYgKG5vbkFzc2VydGVkV2FybmluZ3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIG5vbkFzc2VydGVkV2FybmluZ3MuZm9yRWFjaCh3YXJuaW5nID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybih3YXJuaW5nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgdGVzdCBjYXNlIHRocmV3IHVuZXhwZWN0ZWQgd2FybmluZ3MuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cblxuLyoqXHJcbiAqIE9uIHRoZSBjbGllbnQgd2Ugb25seSBuZWVkIHRvIG9mZmVyIHNwZWNpYWwgY2FzZXMgZm9yIGJvb2xlYW4gYXR0cmlidXRlcyB0aGF0XHJcbiAqIGhhdmUgZGlmZmVyZW50IG5hbWVzIGZyb20gdGhlaXIgY29ycmVzcG9uZGluZyBkb20gcHJvcGVydGllczpcclxuICogLSBpdGVtc2NvcGUgLT4gTi9BXHJcbiAqIC0gYWxsb3dmdWxsc2NyZWVuIC0+IGFsbG93RnVsbHNjcmVlblxyXG4gKiAtIGZvcm1ub3ZhbGlkYXRlIC0+IGZvcm1Ob1ZhbGlkYXRlXHJcbiAqIC0gaXNtYXAgLT4gaXNNYXBcclxuICogLSBub21vZHVsZSAtPiBub01vZHVsZVxyXG4gKiAtIG5vdmFsaWRhdGUgLT4gbm9WYWxpZGF0ZVxyXG4gKiAtIHJlYWRvbmx5IC0+IHJlYWRPbmx5XHJcbiAqL1xyXG5jb25zdCBzcGVjaWFsQm9vbGVhbkF0dHJzID0gYGl0ZW1zY29wZSxhbGxvd2Z1bGxzY3JlZW4sZm9ybW5vdmFsaWRhdGUsaXNtYXAsbm9tb2R1bGUsbm92YWxpZGF0ZSxyZWFkb25seWA7XHJcbmNvbnN0IGlzU3BlY2lhbEJvb2xlYW5BdHRyID0gLyojX19QVVJFX18qLyBtYWtlTWFwKHNwZWNpYWxCb29sZWFuQXR0cnMpO1xyXG4vKipcclxuICogVGhlIGZ1bGwgbGlzdCBpcyBuZWVkZWQgZHVyaW5nIFNTUiB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IGluaXRpYWwgbWFya3VwLlxyXG4gKi9cclxuY29uc3QgaXNCb29sZWFuQXR0ciA9IC8qI19fUFVSRV9fKi8gbWFrZU1hcChzcGVjaWFsQm9vbGVhbkF0dHJzICtcclxuICAgIGAsYXN5bmMsYXV0b2ZvY3VzLGF1dG9wbGF5LGNvbnRyb2xzLGRlZmF1bHQsZGVmZXIsZGlzYWJsZWQsaGlkZGVuLGAgK1xyXG4gICAgYGxvb3Asb3BlbixyZXF1aXJlZCxyZXZlcnNlZCxzY29wZWQsc2VhbWxlc3MsYCArXHJcbiAgICBgY2hlY2tlZCxtdXRlZCxtdWx0aXBsZSxzZWxlY3RlZGApO1xyXG5jb25zdCB1bnNhZmVBdHRyQ2hhclJFID0gL1s+Lz1cIidcXHUwMDA5XFx1MDAwYVxcdTAwMGNcXHUwMDIwXS87XHJcbmNvbnN0IGF0dHJWYWxpZGF0aW9uQ2FjaGUgPSB7fTtcclxuZnVuY3Rpb24gaXNTU1JTYWZlQXR0ck5hbWUobmFtZSkge1xyXG4gICAgaWYgKGF0dHJWYWxpZGF0aW9uQ2FjaGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICByZXR1cm4gYXR0clZhbGlkYXRpb25DYWNoZVtuYW1lXTtcclxuICAgIH1cclxuICAgIGNvbnN0IGlzVW5zYWZlID0gdW5zYWZlQXR0ckNoYXJSRS50ZXN0KG5hbWUpO1xyXG4gICAgaWYgKGlzVW5zYWZlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihgdW5zYWZlIGF0dHJpYnV0ZSBuYW1lOiAke25hbWV9YCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKGF0dHJWYWxpZGF0aW9uQ2FjaGVbbmFtZV0gPSAhaXNVbnNhZmUpO1xyXG59XHJcbmNvbnN0IHByb3BzVG9BdHRyTWFwID0ge1xyXG4gICAgYWNjZXB0Q2hhcnNldDogJ2FjY2VwdC1jaGFyc2V0JyxcclxuICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcclxuICAgIGh0bWxGb3I6ICdmb3InLFxyXG4gICAgaHR0cEVxdWl2OiAnaHR0cC1lcXVpdidcclxufTtcclxuLyoqXHJcbiAqIENTUyBwcm9wZXJ0aWVzIHRoYXQgYWNjZXB0IHBsYWluIG51bWJlcnNcclxuICovXHJcbmNvbnN0IGlzTm9Vbml0TnVtZXJpY1N0eWxlUHJvcCA9IC8qI19fUFVSRV9fKi8gbWFrZU1hcChgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudCxib3JkZXItaW1hZ2Utb3V0c2V0LGJvcmRlci1pbWFnZS1zbGljZSxgICtcclxuICAgIGBib3JkZXItaW1hZ2Utd2lkdGgsYm94LWZsZXgsYm94LWZsZXgtZ3JvdXAsYm94LW9yZGluYWwtZ3JvdXAsY29sdW1uLWNvdW50LGAgK1xyXG4gICAgYGNvbHVtbnMsZmxleCxmbGV4LWdyb3csZmxleC1wb3NpdGl2ZSxmbGV4LXNocmluayxmbGV4LW5lZ2F0aXZlLGZsZXgtb3JkZXIsYCArXHJcbiAgICBgZ3JpZC1yb3csZ3JpZC1yb3ctZW5kLGdyaWQtcm93LXNwYW4sZ3JpZC1yb3ctc3RhcnQsZ3JpZC1jb2x1bW4sYCArXHJcbiAgICBgZ3JpZC1jb2x1bW4tZW5kLGdyaWQtY29sdW1uLXNwYW4sZ3JpZC1jb2x1bW4tc3RhcnQsZm9udC13ZWlnaHQsbGluZS1jbGFtcCxgICtcclxuICAgIGBsaW5lLWhlaWdodCxvcGFjaXR5LG9yZGVyLG9ycGhhbnMsdGFiLXNpemUsd2lkb3dzLHotaW5kZXgsem9vbSxgICtcclxuICAgIC8vIFNWR1xyXG4gICAgYGZpbGwtb3BhY2l0eSxmbG9vZC1vcGFjaXR5LHN0b3Atb3BhY2l0eSxzdHJva2UtZGFzaGFycmF5LHN0cm9rZS1kYXNob2Zmc2V0LGAgK1xyXG4gICAgYHN0cm9rZS1taXRlcmxpbWl0LHN0cm9rZS1vcGFjaXR5LHN0cm9rZS13aWR0aGApO1xyXG4vKipcclxuICogS25vd24gYXR0cmlidXRlcywgdGhpcyBpcyB1c2VkIGZvciBzdHJpbmdpZmljYXRpb24gb2YgcnVudGltZSBzdGF0aWMgbm9kZXNcclxuICogc28gdGhhdCB3ZSBkb24ndCBzdHJpbmdpZnkgYmluZGluZ3MgdGhhdCBjYW5ub3QgYmUgc2V0IGZyb20gSFRNTC5cclxuICogRG9uJ3QgYWxzbyBmb3JnZXQgdG8gYWxsb3cgYGRhdGEtKmAgYW5kIGBhcmlhLSpgIVxyXG4gKiBHZW5lcmF0ZWQgZnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0F0dHJpYnV0ZXNcclxuICovXHJcbmNvbnN0IGlzS25vd25BdHRyID0gLyojX19QVVJFX18qLyBtYWtlTWFwKGBhY2NlcHQsYWNjZXB0LWNoYXJzZXQsYWNjZXNza2V5LGFjdGlvbixhbGlnbixhbGxvdyxhbHQsYXN5bmMsYCArXHJcbiAgICBgYXV0b2NhcGl0YWxpemUsYXV0b2NvbXBsZXRlLGF1dG9mb2N1cyxhdXRvcGxheSxiYWNrZ3JvdW5kLGJnY29sb3IsYCArXHJcbiAgICBgYm9yZGVyLGJ1ZmZlcmVkLGNhcHR1cmUsY2hhbGxlbmdlLGNoYXJzZXQsY2hlY2tlZCxjaXRlLGNsYXNzLGNvZGUsYCArXHJcbiAgICBgY29kZWJhc2UsY29sb3IsY29scyxjb2xzcGFuLGNvbnRlbnQsY29udGVudGVkaXRhYmxlLGNvbnRleHRtZW51LGNvbnRyb2xzLGAgK1xyXG4gICAgYGNvb3Jkcyxjcm9zc29yaWdpbixjc3AsZGF0YSxkYXRldGltZSxkZWNvZGluZyxkZWZhdWx0LGRlZmVyLGRpcixkaXJuYW1lLGAgK1xyXG4gICAgYGRpc2FibGVkLGRvd25sb2FkLGRyYWdnYWJsZSxkcm9wem9uZSxlbmN0eXBlLGVudGVya2V5aGludCxmb3IsZm9ybSxgICtcclxuICAgIGBmb3JtYWN0aW9uLGZvcm1lbmN0eXBlLGZvcm1tZXRob2QsZm9ybW5vdmFsaWRhdGUsZm9ybXRhcmdldCxoZWFkZXJzLGAgK1xyXG4gICAgYGhlaWdodCxoaWRkZW4saGlnaCxocmVmLGhyZWZsYW5nLGh0dHAtZXF1aXYsaWNvbixpZCxpbXBvcnRhbmNlLGludGVncml0eSxgICtcclxuICAgIGBpc21hcCxpdGVtcHJvcCxrZXl0eXBlLGtpbmQsbGFiZWwsbGFuZyxsYW5ndWFnZSxsb2FkaW5nLGxpc3QsbG9vcCxsb3csYCArXHJcbiAgICBgbWFuaWZlc3QsbWF4LG1heGxlbmd0aCxtaW5sZW5ndGgsbWVkaWEsbWluLG11bHRpcGxlLG11dGVkLG5hbWUsbm92YWxpZGF0ZSxgICtcclxuICAgIGBvcGVuLG9wdGltdW0scGF0dGVybixwaW5nLHBsYWNlaG9sZGVyLHBvc3RlcixwcmVsb2FkLHJhZGlvZ3JvdXAscmVhZG9ubHksYCArXHJcbiAgICBgcmVmZXJyZXJwb2xpY3kscmVsLHJlcXVpcmVkLHJldmVyc2VkLHJvd3Mscm93c3BhbixzYW5kYm94LHNjb3BlLHNjb3BlZCxgICtcclxuICAgIGBzZWxlY3RlZCxzaGFwZSxzaXplLHNpemVzLHNsb3Qsc3BhbixzcGVsbGNoZWNrLHNyYyxzcmNkb2Msc3JjbGFuZyxzcmNzZXQsYCArXHJcbiAgICBgc3RhcnQsc3RlcCxzdHlsZSxzdW1tYXJ5LHRhYmluZGV4LHRhcmdldCx0aXRsZSx0cmFuc2xhdGUsdHlwZSx1c2VtYXAsYCArXHJcbiAgICBgdmFsdWUsd2lkdGgsd3JhcGApO1xuXG5mdW5jdGlvbiBub3JtYWxpemVTdHlsZSh2YWx1ZSkge1xyXG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgY29uc3QgcmVzID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdmFsdWVbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVTdHlsZShpc1N0cmluZyhpdGVtKSA/IHBhcnNlU3RyaW5nU3R5bGUoaXRlbSkgOiBpdGVtKTtcclxuICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG5vcm1hbGl6ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNba2V5XSA9IG5vcm1hbGl6ZWRba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNPYmplY3QodmFsdWUpKSB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IGxpc3REZWxpbWl0ZXJSRSA9IC87KD8hW14oXSpcXCkpL2c7XHJcbmNvbnN0IHByb3BlcnR5RGVsaW1pdGVyUkUgPSAvOiguKykvO1xyXG5mdW5jdGlvbiBwYXJzZVN0cmluZ1N0eWxlKGNzc1RleHQpIHtcclxuICAgIGNvbnN0IHJldCA9IHt9O1xyXG4gICAgY3NzVGV4dC5zcGxpdChsaXN0RGVsaW1pdGVyUkUpLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc3QgdG1wID0gaXRlbS5zcGxpdChwcm9wZXJ0eURlbGltaXRlclJFKTtcclxuICAgICAgICAgICAgdG1wLmxlbmd0aCA+IDEgJiYgKHJldFt0bXBbMF0udHJpbSgpXSA9IHRtcFsxXS50cmltKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJldDtcclxufVxyXG5mdW5jdGlvbiBzdHJpbmdpZnlTdHlsZShzdHlsZXMpIHtcclxuICAgIGxldCByZXQgPSAnJztcclxuICAgIGlmICghc3R5bGVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3Qga2V5IGluIHN0eWxlcykge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gc3R5bGVzW2tleV07XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZEtleSA9IGtleS5zdGFydHNXaXRoKGAtLWApID8ga2V5IDogaHlwaGVuYXRlKGtleSk7XHJcbiAgICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSB8fFxyXG4gICAgICAgICAgICAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc05vVW5pdE51bWVyaWNTdHlsZVByb3Aobm9ybWFsaXplZEtleSkpKSB7XHJcbiAgICAgICAgICAgIC8vIG9ubHkgcmVuZGVyIHZhbGlkIHZhbHVlc1xyXG4gICAgICAgICAgICByZXQgKz0gYCR7bm9ybWFsaXplZEtleX06JHt2YWx1ZX07YDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0O1xyXG59XHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZUNsYXNzKHZhbHVlKSB7XHJcbiAgICBsZXQgcmVzID0gJyc7XHJcbiAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XHJcbiAgICAgICAgcmVzID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzICs9IG5vcm1hbGl6ZUNsYXNzKHZhbHVlW2ldKSArICcgJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXMgKz0gbmFtZSArICcgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXMudHJpbSgpO1xyXG59XG5cbi8vIFRoZXNlIHRhZyBjb25maWdzIGFyZSBzaGFyZWQgYmV0d2VlbiBjb21waWxlci1kb20gYW5kIHJ1bnRpbWUtZG9tLCBzbyB0aGV5XHJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudFxyXG5jb25zdCBIVE1MX1RBR1MgPSAnaHRtbCxib2R5LGJhc2UsaGVhZCxsaW5rLG1ldGEsc3R5bGUsdGl0bGUsYWRkcmVzcyxhcnRpY2xlLGFzaWRlLGZvb3RlciwnICtcclxuICAgICdoZWFkZXIsaDEsaDIsaDMsaDQsaDUsaDYsaGdyb3VwLG5hdixzZWN0aW9uLGRpdixkZCxkbCxkdCxmaWdjYXB0aW9uLCcgK1xyXG4gICAgJ2ZpZ3VyZSxwaWN0dXJlLGhyLGltZyxsaSxtYWluLG9sLHAscHJlLHVsLGEsYixhYmJyLGJkaSxiZG8sYnIsY2l0ZSxjb2RlLCcgK1xyXG4gICAgJ2RhdGEsZGZuLGVtLGksa2JkLG1hcmsscSxycCxydCxydGMscnVieSxzLHNhbXAsc21hbGwsc3BhbixzdHJvbmcsc3ViLHN1cCwnICtcclxuICAgICd0aW1lLHUsdmFyLHdicixhcmVhLGF1ZGlvLG1hcCx0cmFjayx2aWRlbyxlbWJlZCxvYmplY3QscGFyYW0sc291cmNlLCcgK1xyXG4gICAgJ2NhbnZhcyxzY3JpcHQsbm9zY3JpcHQsZGVsLGlucyxjYXB0aW9uLGNvbCxjb2xncm91cCx0YWJsZSx0aGVhZCx0Ym9keSx0ZCwnICtcclxuICAgICd0aCx0cixidXR0b24sZGF0YWxpc3QsZmllbGRzZXQsZm9ybSxpbnB1dCxsYWJlbCxsZWdlbmQsbWV0ZXIsb3B0Z3JvdXAsJyArXHJcbiAgICAnb3B0aW9uLG91dHB1dCxwcm9ncmVzcyxzZWxlY3QsdGV4dGFyZWEsZGV0YWlscyxkaWFsb2csbWVudSwnICtcclxuICAgICdzdW1tYXJ5LGNvbnRlbnQsdGVtcGxhdGUsYmxvY2txdW90ZSxpZnJhbWUsdGZvb3QnO1xyXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvRWxlbWVudFxyXG5jb25zdCBTVkdfVEFHUyA9ICdzdmcsYW5pbWF0ZSxhbmltYXRlTW90aW9uLGFuaW1hdGVUcmFuc2Zvcm0sY2lyY2xlLGNsaXBQYXRoLGNvbG9yLXByb2ZpbGUsJyArXHJcbiAgICAnZGVmcyxkZXNjLGRpc2NhcmQsZWxsaXBzZSxmZUJsZW5kLGZlQ29sb3JNYXRyaXgsZmVDb21wb25lbnRUcmFuc2ZlciwnICtcclxuICAgICdmZUNvbXBvc2l0ZSxmZUNvbnZvbHZlTWF0cml4LGZlRGlmZnVzZUxpZ2h0aW5nLGZlRGlzcGxhY2VtZW50TWFwLCcgK1xyXG4gICAgJ2ZlRGlzdGFuY2VMaWdodCxmZURyb3BTaGFkb3csZmVGbG9vZCxmZUZ1bmNBLGZlRnVuY0IsZmVGdW5jRyxmZUZ1bmNSLCcgK1xyXG4gICAgJ2ZlR2F1c3NpYW5CbHVyLGZlSW1hZ2UsZmVNZXJnZSxmZU1lcmdlTm9kZSxmZU1vcnBob2xvZ3ksZmVPZmZzZXQsJyArXHJcbiAgICAnZmVQb2ludExpZ2h0LGZlU3BlY3VsYXJMaWdodGluZyxmZVNwb3RMaWdodCxmZVRpbGUsZmVUdXJidWxlbmNlLGZpbHRlciwnICtcclxuICAgICdmb3JlaWduT2JqZWN0LGcsaGF0Y2gsaGF0Y2hwYXRoLGltYWdlLGxpbmUsbGluZWFyR3JhZGllbnQsbWFya2VyLG1hc2ssJyArXHJcbiAgICAnbWVzaCxtZXNoZ3JhZGllbnQsbWVzaHBhdGNoLG1lc2hyb3csbWV0YWRhdGEsbXBhdGgscGF0aCxwYXR0ZXJuLCcgK1xyXG4gICAgJ3BvbHlnb24scG9seWxpbmUscmFkaWFsR3JhZGllbnQscmVjdCxzZXQsc29saWRjb2xvcixzdG9wLHN3aXRjaCxzeW1ib2wsJyArXHJcbiAgICAndGV4dCx0ZXh0UGF0aCx0aXRsZSx0c3Bhbix1bmtub3duLHVzZSx2aWV3JztcclxuY29uc3QgVk9JRF9UQUdTID0gJ2FyZWEsYmFzZSxicixjb2wsZW1iZWQsaHIsaW1nLGlucHV0LGxpbmssbWV0YSxwYXJhbSxzb3VyY2UsdHJhY2ssd2JyJztcclxuY29uc3QgaXNIVE1MVGFnID0gLyojX19QVVJFX18qLyBtYWtlTWFwKEhUTUxfVEFHUyk7XHJcbmNvbnN0IGlzU1ZHVGFnID0gLyojX19QVVJFX18qLyBtYWtlTWFwKFNWR19UQUdTKTtcclxuY29uc3QgaXNWb2lkVGFnID0gLyojX19QVVJFX18qLyBtYWtlTWFwKFZPSURfVEFHUyk7XG5cbmNvbnN0IGVzY2FwZVJFID0gL1tcIicmPD5dLztcclxuZnVuY3Rpb24gZXNjYXBlSHRtbChzdHJpbmcpIHtcclxuICAgIGNvbnN0IHN0ciA9ICcnICsgc3RyaW5nO1xyXG4gICAgY29uc3QgbWF0Y2ggPSBlc2NhcGVSRS5leGVjKHN0cik7XHJcbiAgICBpZiAoIW1hdGNoKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH1cclxuICAgIGxldCBodG1sID0gJyc7XHJcbiAgICBsZXQgZXNjYXBlZDtcclxuICAgIGxldCBpbmRleDtcclxuICAgIGxldCBsYXN0SW5kZXggPSAwO1xyXG4gICAgZm9yIChpbmRleCA9IG1hdGNoLmluZGV4OyBpbmRleCA8IHN0ci5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICBzd2l0Y2ggKHN0ci5jaGFyQ29kZUF0KGluZGV4KSkge1xyXG4gICAgICAgICAgICBjYXNlIDM0OiAvLyBcIlxyXG4gICAgICAgICAgICAgICAgZXNjYXBlZCA9ICcmcXVvdDsnO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzg6IC8vICZcclxuICAgICAgICAgICAgICAgIGVzY2FwZWQgPSAnJmFtcDsnO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzk6IC8vICdcclxuICAgICAgICAgICAgICAgIGVzY2FwZWQgPSAnJiMzOTsnO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNjA6IC8vIDxcclxuICAgICAgICAgICAgICAgIGVzY2FwZWQgPSAnJmx0Oyc7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA2MjogLy8gPlxyXG4gICAgICAgICAgICAgICAgZXNjYXBlZCA9ICcmZ3Q7JztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsYXN0SW5kZXggIT09IGluZGV4KSB7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gc3RyLnN1YnN0cmluZyhsYXN0SW5kZXgsIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGFzdEluZGV4ID0gaW5kZXggKyAxO1xyXG4gICAgICAgIGh0bWwgKz0gZXNjYXBlZDtcclxuICAgIH1cclxuICAgIHJldHVybiBsYXN0SW5kZXggIT09IGluZGV4ID8gaHRtbCArIHN0ci5zdWJzdHJpbmcobGFzdEluZGV4LCBpbmRleCkgOiBodG1sO1xyXG59XHJcbi8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNTIvc3ludGF4Lmh0bWwjY29tbWVudHNcclxuY29uc3QgY29tbWVudFN0cmlwUkUgPSAvXi0/Pnw8IS0tfC0tPnwtLSE+fDwhLSQvZztcclxuZnVuY3Rpb24gZXNjYXBlSHRtbENvbW1lbnQoc3JjKSB7XHJcbiAgICByZXR1cm4gc3JjLnJlcGxhY2UoY29tbWVudFN0cmlwUkUsICcnKTtcclxufVxuXG5mdW5jdGlvbiBsb29zZUNvbXBhcmVBcnJheXMoYSwgYikge1xyXG4gICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aClcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICBsZXQgZXF1YWwgPSB0cnVlO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGVxdWFsICYmIGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZXF1YWwgPSBsb29zZUVxdWFsKGFbaV0sIGJbaV0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVxdWFsO1xyXG59XHJcbmZ1bmN0aW9uIGxvb3NlRXF1YWwoYSwgYikge1xyXG4gICAgaWYgKGEgPT09IGIpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBsZXQgYVZhbGlkVHlwZSA9IGlzRGF0ZShhKTtcclxuICAgIGxldCBiVmFsaWRUeXBlID0gaXNEYXRlKGIpO1xyXG4gICAgaWYgKGFWYWxpZFR5cGUgfHwgYlZhbGlkVHlwZSkge1xyXG4gICAgICAgIHJldHVybiBhVmFsaWRUeXBlICYmIGJWYWxpZFR5cGUgPyBhLmdldFRpbWUoKSA9PT0gYi5nZXRUaW1lKCkgOiBmYWxzZTtcclxuICAgIH1cclxuICAgIGFWYWxpZFR5cGUgPSBpc0FycmF5KGEpO1xyXG4gICAgYlZhbGlkVHlwZSA9IGlzQXJyYXkoYik7XHJcbiAgICBpZiAoYVZhbGlkVHlwZSB8fCBiVmFsaWRUeXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIGFWYWxpZFR5cGUgJiYgYlZhbGlkVHlwZSA/IGxvb3NlQ29tcGFyZUFycmF5cyhhLCBiKSA6IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgYVZhbGlkVHlwZSA9IGlzT2JqZWN0KGEpO1xyXG4gICAgYlZhbGlkVHlwZSA9IGlzT2JqZWN0KGIpO1xyXG4gICAgaWYgKGFWYWxpZFR5cGUgfHwgYlZhbGlkVHlwZSkge1xyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZjogdGhpcyBpZiB3aWxsIHByb2JhYmx5IG5ldmVyIGJlIGNhbGxlZCAqL1xyXG4gICAgICAgIGlmICghYVZhbGlkVHlwZSB8fCAhYlZhbGlkVHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGFLZXlzQ291bnQgPSBPYmplY3Qua2V5cyhhKS5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYktleXNDb3VudCA9IE9iamVjdC5rZXlzKGIpLmxlbmd0aDtcclxuICAgICAgICBpZiAoYUtleXNDb3VudCAhPT0gYktleXNDb3VudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGEpIHtcclxuICAgICAgICAgICAgY29uc3QgYUhhc0tleSA9IGEuaGFzT3duUHJvcGVydHkoa2V5KTtcclxuICAgICAgICAgICAgY29uc3QgYkhhc0tleSA9IGIuaGFzT3duUHJvcGVydHkoa2V5KTtcclxuICAgICAgICAgICAgaWYgKChhSGFzS2V5ICYmICFiSGFzS2V5KSB8fFxyXG4gICAgICAgICAgICAgICAgKCFhSGFzS2V5ICYmIGJIYXNLZXkpIHx8XHJcbiAgICAgICAgICAgICAgICAhbG9vc2VFcXVhbChhW2tleV0sIGJba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBTdHJpbmcoYSkgPT09IFN0cmluZyhiKTtcclxufVxyXG5mdW5jdGlvbiBsb29zZUluZGV4T2YoYXJyLCB2YWwpIHtcclxuICAgIHJldHVybiBhcnIuZmluZEluZGV4KGl0ZW0gPT4gbG9vc2VFcXVhbChpdGVtLCB2YWwpKTtcclxufVxuXG4vKipcclxuICogRm9yIGNvbnZlcnRpbmcge3sgaW50ZXJwb2xhdGlvbiB9fSB2YWx1ZXMgdG8gZGlzcGxheWVkIHN0cmluZ3MuXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5jb25zdCB0b0Rpc3BsYXlTdHJpbmcgPSAodmFsKSA9PiB7XHJcbiAgICByZXR1cm4gdmFsID09IG51bGxcclxuICAgICAgICA/ICcnXHJcbiAgICAgICAgOiBpc09iamVjdCh2YWwpXHJcbiAgICAgICAgICAgID8gSlNPTi5zdHJpbmdpZnkodmFsLCByZXBsYWNlciwgMilcclxuICAgICAgICAgICAgOiBTdHJpbmcodmFsKTtcclxufTtcclxuY29uc3QgcmVwbGFjZXIgPSAoX2tleSwgdmFsKSA9PiB7XHJcbiAgICBpZiAodmFsIGluc3RhbmNlb2YgTWFwKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgW2BNYXAoJHt2YWwuc2l6ZX0pYF06IFsuLi52YWwuZW50cmllcygpXS5yZWR1Y2UoKGVudHJpZXMsIFtrZXksIHZhbF0pID0+IHtcclxuICAgICAgICAgICAgICAgIGVudHJpZXNbYCR7a2V5fSA9PmBdID0gdmFsO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudHJpZXM7XHJcbiAgICAgICAgICAgIH0sIHt9KVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh2YWwgaW5zdGFuY2VvZiBTZXQpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBbYFNldCgke3ZhbC5zaXplfSlgXTogWy4uLnZhbC52YWx1ZXMoKV1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNPYmplY3QodmFsKSAmJiAhaXNBcnJheSh2YWwpICYmICFpc1BsYWluT2JqZWN0KHZhbCkpIHtcclxuICAgICAgICByZXR1cm4gU3RyaW5nKHZhbCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsO1xyXG59O1xuXG4vKipcclxuICogTGlzdCBvZiBAYmFiZWwvcGFyc2VyIHBsdWdpbnMgdGhhdCBhcmUgdXNlZCBmb3IgdGVtcGxhdGUgZXhwcmVzc2lvblxyXG4gKiB0cmFuc2Zvcm1zIGFuZCBTRkMgc2NyaXB0IHRyYW5zZm9ybXMuIEJ5IGRlZmF1bHQgd2UgZW5hYmxlIHByb3Bvc2FscyBzbGF0ZWRcclxuICogZm9yIEVTMjAyMC4gVGhpcyB3aWxsIG5lZWQgdG8gYmUgdXBkYXRlZCBhcyB0aGUgc3BlYyBtb3ZlcyBmb3J3YXJkLlxyXG4gKiBGdWxsIGxpc3QgYXQgaHR0cHM6Ly9iYWJlbGpzLmlvL2RvY3MvZW4vbmV4dC9iYWJlbC1wYXJzZXIjcGx1Z2luc1xyXG4gKi9cclxuY29uc3QgYmFiZWxQYXJzZXJEZWZhdXRQbHVnaW5zID0gW1xyXG4gICAgJ2JpZ0ludCcsXHJcbiAgICAnb3B0aW9uYWxDaGFpbmluZycsXHJcbiAgICAnbnVsbGlzaENvYWxlc2NpbmdPcGVyYXRvcidcclxuXTtcclxuY29uc3QgRU1QVFlfT0JKID0gKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpXHJcbiAgICA/IE9iamVjdC5mcmVlemUoe30pXHJcbiAgICA6IHt9O1xyXG5jb25zdCBFTVBUWV9BUlIgPSBbXTtcclxuY29uc3QgTk9PUCA9ICgpID0+IHsgfTtcclxuLyoqXHJcbiAqIEFsd2F5cyByZXR1cm4gZmFsc2UuXHJcbiAqL1xyXG5jb25zdCBOTyA9ICgpID0+IGZhbHNlO1xyXG5jb25zdCBvblJFID0gL15vblteYS16XS87XHJcbmNvbnN0IGlzT24gPSAoa2V5KSA9PiBvblJFLnRlc3Qoa2V5KTtcclxuY29uc3QgZXh0ZW5kID0gT2JqZWN0LmFzc2lnbjtcclxuY29uc3QgcmVtb3ZlID0gKGFyciwgZWwpID0+IHtcclxuICAgIGNvbnN0IGkgPSBhcnIuaW5kZXhPZihlbCk7XHJcbiAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgYXJyLnNwbGljZShpLCAxKTtcclxuICAgIH1cclxufTtcclxuY29uc3QgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xyXG5jb25zdCBoYXNPd24gPSAodmFsLCBrZXkpID0+IGhhc093blByb3BlcnR5LmNhbGwodmFsLCBrZXkpO1xyXG5jb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcclxuY29uc3QgaXNEYXRlID0gKHZhbCkgPT4gdmFsIGluc3RhbmNlb2YgRGF0ZTtcclxuY29uc3QgaXNGdW5jdGlvbiA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbic7XHJcbmNvbnN0IGlzU3RyaW5nID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XHJcbmNvbnN0IGlzU3ltYm9sID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gJ3N5bWJvbCc7XHJcbmNvbnN0IGlzT2JqZWN0ID0gKHZhbCkgPT4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xyXG5jb25zdCBpc1Byb21pc2UgPSAodmFsKSA9PiB7XHJcbiAgICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC50aGVuKSAmJiBpc0Z1bmN0aW9uKHZhbC5jYXRjaCk7XHJcbn07XHJcbmNvbnN0IG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcclxuY29uc3QgdG9UeXBlU3RyaW5nID0gKHZhbHVlKSA9PiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcclxuY29uc3QgdG9SYXdUeXBlID0gKHZhbHVlKSA9PiB7XHJcbiAgICByZXR1cm4gdG9UeXBlU3RyaW5nKHZhbHVlKS5zbGljZSg4LCAtMSk7XHJcbn07XHJcbmNvbnN0IGlzUGxhaW5PYmplY3QgPSAodmFsKSA9PiB0b1R5cGVTdHJpbmcodmFsKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbmNvbnN0IGlzUmVzZXJ2ZWRQcm9wID0gLyojX19QVVJFX18qLyBtYWtlTWFwKCdrZXkscmVmLCcgK1xyXG4gICAgJ29uVm5vZGVCZWZvcmVNb3VudCxvblZub2RlTW91bnRlZCwnICtcclxuICAgICdvblZub2RlQmVmb3JlVXBkYXRlLG9uVm5vZGVVcGRhdGVkLCcgK1xyXG4gICAgJ29uVm5vZGVCZWZvcmVVbm1vdW50LG9uVm5vZGVVbm1vdW50ZWQnKTtcclxuY29uc3QgY2FjaGVTdHJpbmdGdW5jdGlvbiA9IChmbikgPT4ge1xyXG4gICAgY29uc3QgY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgcmV0dXJuICgoc3RyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGl0ID0gY2FjaGVbc3RyXTtcclxuICAgICAgICByZXR1cm4gaGl0IHx8IChjYWNoZVtzdHJdID0gZm4oc3RyKSk7XHJcbiAgICB9KTtcclxufTtcclxuY29uc3QgY2FtZWxpemVSRSA9IC8tKFxcdykvZztcclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5jb25zdCBjYW1lbGl6ZSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4ge1xyXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKGNhbWVsaXplUkUsIChfLCBjKSA9PiAoYyA/IGMudG9VcHBlckNhc2UoKSA6ICcnKSk7XHJcbn0pO1xyXG5jb25zdCBoeXBoZW5hdGVSRSA9IC9cXEIoW0EtWl0pL2c7XHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuY29uc3QgaHlwaGVuYXRlID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiB7XHJcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoaHlwaGVuYXRlUkUsICctJDEnKS50b0xvd2VyQ2FzZSgpO1xyXG59KTtcclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5jb25zdCBjYXBpdGFsaXplID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiB7XHJcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xyXG59KTtcclxuLy8gY29tcGFyZSB3aGV0aGVyIGEgdmFsdWUgaGFzIGNoYW5nZWQsIGFjY291bnRpbmcgZm9yIE5hTi5cclxuY29uc3QgaGFzQ2hhbmdlZCA9ICh2YWx1ZSwgb2xkVmFsdWUpID0+IHZhbHVlICE9PSBvbGRWYWx1ZSAmJiAodmFsdWUgPT09IHZhbHVlIHx8IG9sZFZhbHVlID09PSBvbGRWYWx1ZSk7XHJcbmNvbnN0IGludm9rZUFycmF5Rm5zID0gKGZucywgYXJnKSA9PiB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZuc1tpXShhcmcpO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBkZWYgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgdmFsdWVcclxuICAgIH0pO1xyXG59O1xyXG5jb25zdCB0b051bWJlciA9ICh2YWwpID0+IHtcclxuICAgIGNvbnN0IG4gPSBwYXJzZUZsb2F0KHZhbCk7XHJcbiAgICByZXR1cm4gaXNOYU4obikgPyB2YWwgOiBuO1xyXG59O1xuXG5leHBvcnQgeyBFTVBUWV9BUlIsIEVNUFRZX09CSiwgTk8sIE5PT1AsIFBhdGNoRmxhZ05hbWVzLCBiYWJlbFBhcnNlckRlZmF1dFBsdWdpbnMsIGNhbWVsaXplLCBjYXBpdGFsaXplLCBkZWYsIGVzY2FwZUh0bWwsIGVzY2FwZUh0bWxDb21tZW50LCBleHRlbmQsIGdlbmVyYXRlQ29kZUZyYW1lLCBoYXNDaGFuZ2VkLCBoYXNPd24sIGh5cGhlbmF0ZSwgaW52b2tlQXJyYXlGbnMsIGlzQXJyYXksIGlzQm9vbGVhbkF0dHIsIGlzRGF0ZSwgaXNGdW5jdGlvbiwgaXNHbG9iYWxseVdoaXRlbGlzdGVkLCBpc0hUTUxUYWcsIGlzS25vd25BdHRyLCBpc05vVW5pdE51bWVyaWNTdHlsZVByb3AsIGlzT2JqZWN0LCBpc09uLCBpc1BsYWluT2JqZWN0LCBpc1Byb21pc2UsIGlzUmVzZXJ2ZWRQcm9wLCBpc1NTUlNhZmVBdHRyTmFtZSwgaXNTVkdUYWcsIGlzU3BlY2lhbEJvb2xlYW5BdHRyLCBpc1N0cmluZywgaXNTeW1ib2wsIGlzVm9pZFRhZywgbG9vc2VFcXVhbCwgbG9vc2VJbmRleE9mLCBtYWtlTWFwLCBtb2NrRXJyb3IsIG1vY2tXYXJuLCBub3JtYWxpemVDbGFzcywgbm9ybWFsaXplU3R5bGUsIG9iamVjdFRvU3RyaW5nLCBwYXJzZVN0cmluZ1N0eWxlLCBwcm9wc1RvQXR0ck1hcCwgcmVtb3ZlLCBzdHJpbmdpZnlTdHlsZSwgdG9EaXNwbGF5U3RyaW5nLCB0b051bWJlciwgdG9SYXdUeXBlLCB0b1R5cGVTdHJpbmcgfTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1c2VTb3VyY2VNYXApIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICByZXR1cm4gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGNvbnRlbnQsIFwifVwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbignJyk7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiAobW9kdWxlcywgbWVkaWFRdWVyeSwgZGVkdXBlKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCAnJ11dO1xuICAgIH1cblxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1kZXN0cnVjdHVyaW5nXG4gICAgICAgIHZhciBpZCA9IHRoaXNbaV1bMF07XG5cbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbW9kdWxlcy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2ldKTtcblxuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb250aW51ZVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lZGlhUXVlcnkpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhUXVlcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsyXSA9IFwiXCIuY29uY2F0KG1lZGlhUXVlcnksIFwiIGFuZCBcIikuY29uY2F0KGl0ZW1bMl0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItZGVzdHJ1Y3R1cmluZ1xuXG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblxuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8ICcnKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59IC8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcblxuXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcbiAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICByZXR1cm4gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaXNPbGRJRSA9IGZ1bmN0aW9uIGlzT2xkSUUoKSB7XG4gIHZhciBtZW1vO1xuICByZXR1cm4gZnVuY3Rpb24gbWVtb3JpemUoKSB7XG4gICAgaWYgKHR5cGVvZiBtZW1vID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3NcbiAgICAgIC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcbiAgICAgIC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcbiAgICAgIC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG4gICAgICBtZW1vID0gQm9vbGVhbih3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG59KCk7XG5cbnZhciBnZXRUYXJnZXQgPSBmdW5jdGlvbiBnZXRUYXJnZXQoKSB7XG4gIHZhciBtZW1vID0ge307XG4gIHJldHVybiBmdW5jdGlvbiBtZW1vcml6ZSh0YXJnZXQpIHtcbiAgICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbiAgfTtcbn0oKTtcblxudmFyIHN0eWxlc0luRG9tID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5Eb20ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5Eb21baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRvbVtpbmRleF0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5Eb21baW5kZXhdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzSW5Eb20ucHVzaCh7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IGFkZFN0eWxlKG9iaiwgb3B0aW9ucyksXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cblxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHZhciBhdHRyaWJ1dGVzID0gb3B0aW9ucy5hdHRyaWJ1dGVzIHx8IHt9O1xuXG4gIGlmICh0eXBlb2YgYXR0cmlidXRlcy5ub25jZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09ICd1bmRlZmluZWQnID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuXG4gICAgaWYgKG5vbmNlKSB7XG4gICAgICBhdHRyaWJ1dGVzLm5vbmNlID0gbm9uY2U7XG4gICAgfVxuICB9XG5cbiAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgc3R5bGUuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgfSk7XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdGlvbnMuaW5zZXJ0KHN0eWxlKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KG9wdGlvbnMuaW5zZXJ0IHx8ICdoZWFkJyk7XG5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgICB9XG5cbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgcmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG52YXIgcmVwbGFjZVRleHQgPSBmdW5jdGlvbiByZXBsYWNlVGV4dCgpIHtcbiAgdmFyIHRleHRTdG9yZSA9IFtdO1xuICByZXR1cm4gZnVuY3Rpb24gcmVwbGFjZShpbmRleCwgcmVwbGFjZW1lbnQpIHtcbiAgICB0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG4gICAgcmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG4gIH07XG59KCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuICB2YXIgY3NzID0gcmVtb3ZlID8gJycgOiBvYmoubWVkaWEgPyBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpLmNvbmNhdChvYmouY3NzLCBcIn1cIikgOiBvYmouY3NzOyAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuICAgIHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuICAgIGlmIChjaGlsZE5vZGVzW2luZGV4XSkge1xuICAgICAgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuICAgIH1cblxuICAgIGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgc3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGUsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gb2JqLmNzcztcbiAgdmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAobWVkaWEpIHtcbiAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ21lZGlhJywgbWVkaWEpO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLnJlbW92ZUF0dHJpYnV0ZSgnbWVkaWEnKTtcbiAgfVxuXG4gIGlmIChzb3VyY2VNYXAgJiYgYnRvYSkge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGUuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXIgc2luZ2xldG9uQ291bnRlciA9IDA7XG5cbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgc3R5bGU7XG4gIHZhciB1cGRhdGU7XG4gIHZhciByZW1vdmU7XG5cbiAgaWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG4gICAgdmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG4gICAgc3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSk7XG4gICAgdXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG4gICAgcmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcbiAgfSBlbHNlIHtcbiAgICBzdHlsZSA9IGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgICB1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXG4gICAgcmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlKG9iaik7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTsgLy8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG4gIC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2VcblxuICBpZiAoIW9wdGlvbnMuc2luZ2xldG9uICYmIHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG4gIH1cblxuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5ld0xpc3QpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRvbVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cblxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcblxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcblxuICAgICAgaWYgKHN0eWxlc0luRG9tW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRvbVtfaW5kZXhdLnVwZGF0ZXIoKTtcblxuICAgICAgICBzdHlsZXNJbkRvbS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsImltcG9ydCB7IHZlcnNpb24sIHNldERldnRvb2xzSG9vaywgd2FybiB9IGZyb20gJ0B2dWUvcnVudGltZS1kb20nO1xuZXhwb3J0ICogZnJvbSAnQHZ1ZS9ydW50aW1lLWRvbSc7XG5cbmZ1bmN0aW9uIGluaXREZXYoKSB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSAgd2luZG93IDtcclxuICAgIHRhcmdldC5fX1ZVRV9fID0gdmVyc2lvbjtcclxuICAgIHNldERldnRvb2xzSG9vayh0YXJnZXQuX19WVUVfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyk7XHJcbiAgICB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZSBgY29uc29sZS5pbmZvYCBjYW5ub3QgYmUgbnVsbCBlcnJvclxyXG4gICAgICAgIGNvbnNvbGVbY29uc29sZS5pbmZvID8gJ2luZm8nIDogJ2xvZyddKGBZb3UgYXJlIHJ1bm5pbmcgYSBkZXZlbG9wbWVudCBidWlsZCBvZiBWdWUuXFxuYCArXHJcbiAgICAgICAgICAgIGBNYWtlIHN1cmUgdG8gdXNlIHRoZSBwcm9kdWN0aW9uIGJ1aWxkICgqLnByb2QuanMpIHdoZW4gZGVwbG95aW5nIGZvciBwcm9kdWN0aW9uLmApO1xyXG4gICAgfVxyXG59XG5cbi8vIFRoaXMgZW50cnkgZXhwb3J0cyB0aGUgcnVudGltZSBvbmx5LCBhbmQgaXMgYnVpbHQgYXNcclxuKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGluaXREZXYoKTtcclxuY29uc3QgY29tcGlsZSA9ICgpID0+IHtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICB3YXJuKGBSdW50aW1lIGNvbXBpbGF0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBidWlsZCBvZiBWdWUuYCArXHJcbiAgICAgICAgICAgICggYCBDb25maWd1cmUgeW91ciBidW5kbGVyIHRvIGFsaWFzIFwidnVlXCIgdG8gXCJ2dWUvZGlzdC92dWUuZXNtLWJ1bmRsZXIuanNcIi5gXHJcbiAgICAgICAgICAgICAgICApIC8qIHNob3VsZCBub3QgaGFwcGVuICovKTtcclxuICAgIH1cclxufTtcblxuZXhwb3J0IHsgY29tcGlsZSB9O1xuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==