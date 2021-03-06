/*
 * BiwaScheme 0.7.4 - R6RS/R7RS Scheme in JavaScript
 *
 * Copyright (c) 2007-2021 Yutaka HARA (http://www.biwascheme.org/)
 * Licensed under the MIT license.
 */
//
// variables
//
const TopEnv = {};
const CoreEnv = {};

//
// Nil
// javascript representation of empty list( '() )
//
const nil = {
  toString: function () {
    return "nil";
  },
  to_write: function () {
    return "()";
  },
  to_array: function () {
    return [];
  },
  length: function () {
    return 0;
  },
  // Moved to main.js to avoid circular dependency
  //to_set: function() { return new BiwaSet(); },
};

//
// #<undef> (The undefined value)
// also used as #<unspecified> values
//
const undef = new Object();
undef.toString = function () {
  return "#<undef>";
};

//
// Configurations
//

// Maximum depth of stack trace
// (You can also set Interpreter#max_trace_size for each Interpreter)
const max_trace_size = 40;

// Stop showing deprecation warning
const suppress_deprecation_warning = false;

// Actual values are set by rollup (see rollup.config.js)
const VERSION = "0.7.4";
const GitCommit = "33b14cee86ce28e1f7fb2c719f364cf08f7e2378";

//     Underscore.js 1.13.1
//     https://underscorejs.org
//     (c) 2009-2021 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

// Current version.
var VERSION$1 = "1.13.1";

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root =
  (typeof self == "object" && self.self === self && self) ||
  (typeof global == "object" && global.global === global && global) ||
  Function("return this")() ||
  {};

// Save bytes in the minified (but not gzipped) version:
var ArrayProto = Array.prototype,
  ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== "undefined" ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
var push = ArrayProto.push,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty;

// Modern feature detection.
var supportsArrayBuffer = typeof ArrayBuffer !== "undefined",
  supportsDataView = typeof DataView !== "undefined";

// All **ECMAScript 5+** native function implementations that we hope to use
// are declared here.
var nativeIsArray = Array.isArray,
  nativeKeys = Object.keys,
  nativeCreate = Object.create,
  nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

// Create references to these builtin functions because we override them.
var _isNaN = isNaN,
  _isFinite = isFinite;

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
var hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
var nonEnumerableProps = [
  "valueOf",
  "isPrototypeOf",
  "toString",
  "propertyIsEnumerable",
  "hasOwnProperty",
  "toLocaleString",
];

// The largest integer that can be represented exactly.
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function???s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6???s "rest parameter".
function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    var length = Math.max(arguments.length - startIndex, 0),
      rest = Array(length),
      index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest);
      case 1:
        return func.call(this, arguments[0], rest);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
}

// Is a given variable an object?
function isObject(obj) {
  var type = typeof obj;
  return type === "function" || (type === "object" && !!obj);
}

// Is a given value equal to null?
function isNull(obj) {
  return obj === null;
}

// Is a given variable undefined?
function isUndefined(obj) {
  return obj === void 0;
}

// Is a given value a boolean?
function isBoolean(obj) {
  return (
    obj === true || obj === false || toString.call(obj) === "[object Boolean]"
  );
}

// Is a given value a DOM element?
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

// Internal function for creating a `toString`-based type tester.
function tagTester(name) {
  var tag = "[object " + name + "]";
  return function (obj) {
    return toString.call(obj) === tag;
  };
}

var isString = tagTester("String");

var isNumber$1 = tagTester("Number");

var isDate = tagTester("Date");

var isRegExp = tagTester("RegExp");

var isError = tagTester("Error");

var isSymbol = tagTester("Symbol");

var isArrayBuffer = tagTester("ArrayBuffer");

var isFunction = tagTester("Function");

// Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
// v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
var nodelist = root.document && root.document.childNodes;
if (
  typeof /./ != "function" &&
  typeof Int8Array != "object" &&
  typeof nodelist != "function"
) {
  isFunction = function (obj) {
    return typeof obj == "function" || false;
  };
}

var isFunction$1 = isFunction;

var hasObjectTag = tagTester("Object");

// In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
// In IE 11, the most common among them, this problem also applies to
// `Map`, `WeakMap` and `Set`.
var hasStringTagBug =
    supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8))),
  isIE11 = typeof Map !== "undefined" && hasObjectTag(new Map());

var isDataView = tagTester("DataView");

// In IE 10 - Edge 13, we need a different heuristic
// to determine whether an object is a `DataView`.
function ie10IsDataView(obj) {
  return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
}

var isDataView$1 = hasStringTagBug ? ie10IsDataView : isDataView;

// Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.
var isArray = nativeIsArray || tagTester("Array");

// Internal function to check whether `key` is an own property name of `obj`.
function has$1(obj, key) {
  return obj != null && hasOwnProperty.call(obj, key);
}

var isArguments = tagTester("Arguments");

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
(function () {
  if (!isArguments(arguments)) {
    isArguments = function (obj) {
      return has$1(obj, "callee");
    };
  }
})();

var isArguments$1 = isArguments;

// Is a given object a finite number?
function isFinite$1(obj) {
  return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
}

// Is the given value `NaN`?
function isNaN$1(obj) {
  return isNumber$1(obj) && _isNaN(obj);
}

// Predicate-generating function. Often useful outside of Underscore.
function constant(value) {
  return function () {
    return value;
  };
}

// Common internal logic for `isArrayLike` and `isBufferLike`.
function createSizePropertyCheck(getSizeProperty) {
  return function (collection) {
    var sizeProperty = getSizeProperty(collection);
    return (
      typeof sizeProperty == "number" &&
      sizeProperty >= 0 &&
      sizeProperty <= MAX_ARRAY_INDEX
    );
  };
}

// Internal helper to generate a function to obtain property `key` from `obj`.
function shallowProperty(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
}

// Internal helper to obtain the `byteLength` property of an object.
var getByteLength = shallowProperty("byteLength");

// Internal helper to determine whether we should spend extensive checks against
// `ArrayBuffer` et al.
var isBufferLike = createSizePropertyCheck(getByteLength);

// Is a given value a typed array?
var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function isTypedArray(obj) {
  // `ArrayBuffer.isView` is the most future-proof, so use it when available.
  // Otherwise, fall back on the above regular expression.
  return nativeIsView
    ? nativeIsView(obj) && !isDataView$1(obj)
    : isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
}

var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);

// Internal helper to obtain the `length` property of an object.
var getLength = shallowProperty("length");

// Internal helper to create a simple lookup structure.
// `collectNonEnumProps` used to depend on `_.contains`, but this led to
// circular imports. `emulatedSet` is a one-off solution that only works for
// arrays of strings.
function emulatedSet(keys) {
  var hash = {};
  for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
  return {
    contains: function (key) {
      return hash[key];
    },
    push: function (key) {
      hash[key] = true;
      return keys.push(key);
    },
  };
}

// Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
// be iterated by `for key in ...` and thus missed. Extends `keys` in place if
// needed.
function collectNonEnumProps(obj, keys) {
  keys = emulatedSet(keys);
  var nonEnumIdx = nonEnumerableProps.length;
  var constructor = obj.constructor;
  var proto = (isFunction$1(constructor) && constructor.prototype) || ObjProto;

  // Constructor is a special case.
  var prop = "constructor";
  if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);

  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
      keys.push(prop);
    }
  }
}

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
function keys(obj) {
  if (!isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj);
  var keys = [];
  for (var key in obj) if (has$1(obj, key)) keys.push(key);
  // Ahem, IE < 9.
  if (hasEnumBug) collectNonEnumProps(obj, keys);
  return keys;
}

// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
function isEmpty(obj) {
  if (obj == null) return true;
  // Skip the more expensive `toString`-based type checks if `obj` has no
  // `.length`.
  var length = getLength(obj);
  if (
    typeof length == "number" &&
    (isArray(obj) || isString(obj) || isArguments$1(obj))
  )
    return length === 0;
  return getLength(keys(obj)) === 0;
}

// Returns whether an object has a given set of `key:value` pairs.
function isMatch(object, attrs) {
  var _keys = keys(attrs),
    length = _keys.length;
  if (object == null) return !length;
  var obj = Object(object);
  for (var i = 0; i < length; i++) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
}

// If Underscore is called as a function, it returns a wrapped object that can
// be used OO-style. This wrapper holds altered versions of all functions added
// through `_.mixin`. Wrapped objects may be chained.
function _$1(obj) {
  if (obj instanceof _$1) return obj;
  if (!(this instanceof _$1)) return new _$1(obj);
  this._wrapped = obj;
}

_$1.VERSION = VERSION$1;

// Extracts the result from a wrapped and chained object.
_$1.prototype.value = function () {
  return this._wrapped;
};

// Provide unwrapping proxies for some methods used in engine operations
// such as arithmetic and JSON stringification.
_$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;

_$1.prototype.toString = function () {
  return String(this._wrapped);
};

// Internal function to wrap or shallow-copy an ArrayBuffer,
// typed array or DataView to a new view, reusing the buffer.
function toBufferView(bufferSource) {
  return new Uint8Array(
    bufferSource.buffer || bufferSource,
    bufferSource.byteOffset || 0,
    getByteLength(bufferSource)
  );
}

// We use this string twice, so give it a name for minification.
var tagDataView = "[object DataView]";

// Internal recursive comparison function for `_.isEqual`.
function eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  // `null` or `undefined` only equal to itself (strict comparison).
  if (a == null || b == null) return false;
  // `NaN`s are equivalent, but non-reflexive.
  if (a !== a) return b !== b;
  // Exhaust primitive checks
  var type = typeof a;
  if (type !== "function" && type !== "object" && typeof b != "object")
    return false;
  return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `_.isEqual`.
function deepEq(a, b, aStack, bStack) {
  // Unwrap any wrapped objects.
  if (a instanceof _$1) a = a._wrapped;
  if (b instanceof _$1) b = b._wrapped;
  // Compare `[[Class]]` names.
  var className = toString.call(a);
  if (className !== toString.call(b)) return false;
  // Work around a bug in IE 10 - Edge 13.
  if (hasStringTagBug && className == "[object Object]" && isDataView$1(a)) {
    if (!isDataView$1(b)) return false;
    className = tagDataView;
  }
  switch (className) {
    // These types are compared by value.
    case "[object RegExp]":
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case "[object String]":
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return "" + a === "" + b;
    case "[object Number]":
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) return +b !== +b;
      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case "[object Date]":
    case "[object Boolean]":
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
    case "[object Symbol]":
      return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    case "[object ArrayBuffer]":
    case tagDataView:
      // Coerce to typed array so we can fall through.
      return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
  }

  var areArrays = className === "[object Array]";
  if (!areArrays && isTypedArray$1(a)) {
    var byteLength = getByteLength(a);
    if (byteLength !== getByteLength(b)) return false;
    if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
    areArrays = true;
  }
  if (!areArrays) {
    if (typeof a != "object" || typeof b != "object") return false;

    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor,
      bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      !(
        isFunction$1(aCtor) &&
        aCtor instanceof aCtor &&
        isFunction$1(bCtor) &&
        bCtor instanceof bCtor
      ) &&
      "constructor" in a &&
      "constructor" in b
    ) {
      return false;
    }
  }
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) return bStack[length] === b;
  }

  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);

  // Recursively compare objects and arrays.
  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) return false;
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
  } else {
    // Deep compare objects.
    var _keys = keys(a),
      key;
    length = _keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (keys(b).length !== length) return false;
    while (length--) {
      // Deep compare each member
      key = _keys[length];
      if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return true;
}

// Perform a deep comparison to check if two objects are equal.
function isEqual(a, b) {
  return eq(a, b);
}

// Retrieve all the enumerable property names of an object.
function allKeys(obj) {
  if (!isObject(obj)) return [];
  var keys = [];
  for (var key in obj) keys.push(key);
  // Ahem, IE < 9.
  if (hasEnumBug) collectNonEnumProps(obj, keys);
  return keys;
}

// Since the regular `Object.prototype.toString` type tests don't work for
// some types in IE 11, we use a fingerprinting heuristic instead, based
// on the methods. It's not great, but it's the best we got.
// The fingerprint method lists are defined below.
function ie11fingerprint(methods) {
  var length = getLength(methods);
  return function (obj) {
    if (obj == null) return false;
    // `Map`, `WeakMap` and `Set` have no enumerable keys.
    var keys = allKeys(obj);
    if (getLength(keys)) return false;
    for (var i = 0; i < length; i++) {
      if (!isFunction$1(obj[methods[i]])) return false;
    }
    // If we are testing against `WeakMap`, we need to ensure that
    // `obj` doesn't have a `forEach` method in order to distinguish
    // it from a regular `Map`.
    return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
  };
}

// In the interest of compact minification, we write
// each string in the fingerprints only once.
var forEachName = "forEach",
  hasName = "has",
  commonInit = ["clear", "delete"],
  mapTail = ["get", hasName, "set"];

// `Map`, `WeakMap` and `Set` each have slightly different
// combinations of the above sublists.
var mapMethods = commonInit.concat(forEachName, mapTail),
  weakMapMethods = commonInit.concat(mapTail),
  setMethods = ["add"].concat(commonInit, forEachName, hasName);

var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester("Map");

var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester("WeakMap");

var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester("Set");

var isWeakSet = tagTester("WeakSet");

// Retrieve the values of an object's properties.
function values(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var values = Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[_keys[i]];
  }
  return values;
}

// Convert an object into a list of `[key, value]` pairs.
// The opposite of `_.object` with one argument.
function pairs(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var pairs = Array(length);
  for (var i = 0; i < length; i++) {
    pairs[i] = [_keys[i], obj[_keys[i]]];
  }
  return pairs;
}

// Invert the keys and values of an object. The values must be serializable.
function invert(obj) {
  var result = {};
  var _keys = keys(obj);
  for (var i = 0, length = _keys.length; i < length; i++) {
    result[obj[_keys[i]]] = _keys[i];
  }
  return result;
}

// Return a sorted list of the function names available on the object.
function functions(obj) {
  var names = [];
  for (var key in obj) {
    if (isFunction$1(obj[key])) names.push(key);
  }
  return names.sort();
}

// An internal function for creating assigner functions.
function createAssigner(keysFunc, defaults) {
  return function (obj) {
    var length = arguments.length;
    if (defaults) obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (var index = 1; index < length; index++) {
      var source = arguments[index],
        keys = keysFunc(source),
        l = keys.length;
      for (var i = 0; i < l; i++) {
        var key = keys[i];
        if (!defaults || obj[key] === void 0) obj[key] = source[key];
      }
    }
    return obj;
  };
}

// Extend a given object with all the properties in passed-in object(s).
var extend = createAssigner(allKeys);

// Assigns a given object with all the own properties in the passed-in
// object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
var extendOwn = createAssigner(keys);

// Fill in a given object with default properties.
var defaults = createAssigner(allKeys, true);

// Create a naked function reference for surrogate-prototype-swapping.
function ctor() {
  return function () {};
}

// An internal function for creating a new object that inherits from another.
function baseCreate(prototype) {
  if (!isObject(prototype)) return {};
  if (nativeCreate) return nativeCreate(prototype);
  var Ctor = ctor();
  Ctor.prototype = prototype;
  var result = new Ctor();
  Ctor.prototype = null;
  return result;
}

// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
function create(prototype, props) {
  var result = baseCreate(prototype);
  if (props) extendOwn(result, props);
  return result;
}

// Create a (shallow-cloned) duplicate of an object.
function clone(obj) {
  if (!isObject(obj)) return obj;
  return isArray(obj) ? obj.slice() : extend({}, obj);
}

// Invokes `interceptor` with the `obj` and then returns `obj`.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
function tap(obj, interceptor) {
  interceptor(obj);
  return obj;
}

// Normalize a (deep) property `path` to array.
// Like `_.iteratee`, this function can be customized.
function toPath$1(path) {
  return isArray(path) ? path : [path];
}
_$1.toPath = toPath$1;

// Internal wrapper for `_.toPath` to enable minification.
// Similar to `cb` for `_.iteratee`.
function toPath(path) {
  return _$1.toPath(path);
}

// Internal function to obtain a nested property in `obj` along `path`.
function deepGet(obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
}

// Get the value of the (deep) property on `path` from `object`.
// If any property in `path` does not exist or if the value is
// `undefined`, return `defaultValue` instead.
// The `path` is normalized through `_.toPath`.
function get(object, path, defaultValue) {
  var value = deepGet(object, toPath(path));
  return isUndefined(value) ? defaultValue : value;
}

// Shortcut function for checking if an object has a given property directly on
// itself (in other words, not on a prototype). Unlike the internal `has`
// function, this public version can also traverse nested properties.
function has(obj, path) {
  path = toPath(path);
  var length = path.length;
  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (!has$1(obj, key)) return false;
    obj = obj[key];
  }
  return !!length;
}

// Keep the identity function around for default iteratees.
function identity(value) {
  return value;
}

// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
function matcher(attrs) {
  attrs = extendOwn({}, attrs);
  return function (obj) {
    return isMatch(obj, attrs);
  };
}

// Creates a function that, when passed an object, will traverse that object???s
// properties down the given `path`, specified as an array of keys or indices.
function property(path) {
  path = toPath(path);
  return function (obj) {
    return deepGet(obj, path);
  };
}

// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function (value) {
        return func.call(context, value);
      };
    // The 2-argument case is omitted because we???re not using it.
    case 3:
      return function (value, index, collection) {
        return func.call(context, value, index, collection);
      };
    case 4:
      return function (accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
  }
  return function () {
    return func.apply(context, arguments);
  };
}

// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result ??? either `_.identity`,
// an arbitrary callback, a property matcher, or a property accessor.
function baseIteratee(value, context, argCount) {
  if (value == null) return identity;
  if (isFunction$1(value)) return optimizeCb(value, context, argCount);
  if (isObject(value) && !isArray(value)) return matcher(value);
  return property(value);
}

// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only `argCount` argument.
function iteratee(value, context) {
  return baseIteratee(value, context, Infinity);
}
_$1.iteratee = iteratee;

// The function we call internally to generate a callback. It invokes
// `_.iteratee` if overridden, otherwise `baseIteratee`.
function cb(value, context, argCount) {
  if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
  return baseIteratee(value, context, argCount);
}

// Returns the results of applying the `iteratee` to each element of `obj`.
// In contrast to `_.map` it returns an object.
function mapObject(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var _keys = keys(obj),
    length = _keys.length,
    results = {};
  for (var index = 0; index < length; index++) {
    var currentKey = _keys[index];
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

// Predicate-generating function. Often useful outside of Underscore.
function noop() {}

// Generates a function for a given object that returns a given property.
function propertyOf(obj) {
  if (obj == null) return noop;
  return function (path) {
    return get(obj, path);
  };
}

// Run a function **n** times.
function times(n, iteratee, context) {
  var accum = Array(Math.max(0, n));
  iteratee = optimizeCb(iteratee, context, 1);
  for (var i = 0; i < n; i++) accum[i] = iteratee(i);
  return accum;
}

// Return a random integer between `min` and `max` (inclusive).
function random(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}

// A (possibly faster) way to get the current timestamp as an integer.
var now =
  Date.now ||
  function () {
    return new Date().getTime();
  };

// Internal helper to generate functions for escaping and unescaping strings
// to/from HTML interpolation.
function createEscaper(map) {
  var escaper = function (match) {
    return map[match];
  };
  // Regexes for identifying a key that needs to be escaped.
  var source = "(?:" + keys(map).join("|") + ")";
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, "g");
  return function (string) {
    string = string == null ? "" : "" + string;
    return testRegexp.test(string)
      ? string.replace(replaceRegexp, escaper)
      : string;
  };
}

// Internal list of HTML entities for escaping.
var escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;",
};

// Function for escaping strings to HTML interpolation.
var _escape = createEscaper(escapeMap);

// Internal list of HTML entities for unescaping.
var unescapeMap = invert(escapeMap);

// Function for unescaping strings from HTML interpolation.
var _unescape = createEscaper(unescapeMap);

// By default, Underscore uses ERB-style template delimiters. Change the
// following template settings to use alternative delimiters.
var templateSettings = (_$1.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g,
});

// When customizing `_.templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /(.)^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
  "'": "'",
  "\\": "\\",
  "\r": "r",
  "\n": "n",
  "\u2028": "u2028",
  "\u2029": "u2029",
};

var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

function escapeChar(match) {
  return "\\" + escapes[match];
}

// In order to prevent third-party code injection through
// `_.templateSettings.variable`, we test it against the following regular
// expression. It is intentionally a bit more liberal than just matching valid
// identifiers, but still prevents possible loopholes through defaults or
// destructuring assignment.
var bareIdentifier = /^\s*(\w|\$)+\s*$/;

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
function template(text, settings, oldSettings) {
  if (!settings && oldSettings) settings = oldSettings;
  settings = defaults({}, settings, _$1.templateSettings);

  // Combine delimiters into one regular expression via alternation.
  var matcher = RegExp(
    [
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source,
    ].join("|") + "|$",
    "g"
  );

  // Compile the template source, escaping string literals appropriately.
  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function (
    match,
    escape,
    interpolate,
    evaluate,
    offset
  ) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;

    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }

    // Adobe VMs need the match returned to produce the correct offset.
    return match;
  });
  source += "';\n";

  var argument = settings.variable;
  if (argument) {
    // Insure against third-party code injection. (CVE-2021-23358)
    if (!bareIdentifier.test(argument))
      throw new Error("variable is not a bare identifier: " + argument);
  } else {
    // If a variable is not specified, place data values in local scope.
    source = "with(obj||{}){\n" + source + "}\n";
    argument = "obj";
  }

  source =
    "var __t,__p='',__j=Array.prototype.join," +
    "print=function(){__p+=__j.call(arguments,'');};\n" +
    source +
    "return __p;\n";

  var render;
  try {
    render = new Function(argument, "_", source);
  } catch (e) {
    e.source = source;
    throw e;
  }

  var template = function (data) {
    return render.call(this, data, _$1);
  };

  // Provide the compiled source as a convenience for precompilation.
  template.source = "function(" + argument + "){\n" + source + "}";

  return template;
}

// Traverses the children of `obj` along `path`. If a child is a function, it
// is invoked with its parent as context. Returns the value of the final
// child, or `fallback` if any child is undefined.
function result(obj, path, fallback) {
  path = toPath(path);
  var length = path.length;
  if (!length) {
    return isFunction$1(fallback) ? fallback.call(obj) : fallback;
  }
  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path[i]];
    if (prop === void 0) {
      prop = fallback;
      i = length; // Ensure we don't continue iterating.
    }
    obj = isFunction$1(prop) ? prop.call(obj) : prop;
  }
  return obj;
}

// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter + "";
  return prefix ? prefix + id : id;
}

// Start chaining a wrapped Underscore object.
function chain(obj) {
  var instance = _$1(obj);
  instance._chain = true;
  return instance;
}

// Internal function to execute `sourceFunc` bound to `context` with optional
// `args`. Determines whether to execute a function as a constructor or as a
// normal function.
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc))
    return sourceFunc.apply(context, args);
  var self = baseCreate(sourceFunc.prototype);
  var result = sourceFunc.apply(self, args);
  if (isObject(result)) return result;
  return self;
}

// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. `_` acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
var partial = restArguments(function (func, boundArgs) {
  var placeholder = partial.placeholder;
  var bound = function () {
    var position = 0,
      length = boundArgs.length;
    var args = Array(length);
    for (var i = 0; i < length; i++) {
      args[i] =
        boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return executeBound(func, bound, this, this, args);
  };
  return bound;
});

partial.placeholder = _$1;

// Create a function bound to a given object (assigning `this`, and arguments,
// optionally).
var bind = restArguments(function (func, context, args) {
  if (!isFunction$1(func))
    throw new TypeError("Bind must be called on a function");
  var bound = restArguments(function (callArgs) {
    return executeBound(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
});

// Internal helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
var isArrayLike = createSizePropertyCheck(getLength);

// Internal implementation of a recursive `flatten` function.
function flatten$1(input, depth, strict, output) {
  output = output || [];
  if (!depth && depth !== 0) {
    depth = Infinity;
  } else if (depth <= 0) {
    return output.concat(input);
  }
  var idx = output.length;
  for (var i = 0, length = getLength(input); i < length; i++) {
    var value = input[i];
    if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
      // Flatten current level of array or arguments object.
      if (depth > 1) {
        flatten$1(value, depth - 1, strict, output);
        idx = output.length;
      } else {
        var j = 0,
          len = value.length;
        while (j < len) output[idx++] = value[j++];
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
}

// Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
var bindAll = restArguments(function (obj, keys) {
  keys = flatten$1(keys, false, false);
  var index = keys.length;
  if (index < 1) throw new Error("bindAll must be passed function names");
  while (index--) {
    var key = keys[index];
    obj[key] = bind(obj[key], obj);
  }
  return obj;
});

// Memoize an expensive function by storing its results.
function memoize(func, hasher) {
  var memoize = function (key) {
    var cache = memoize.cache;
    var address = "" + (hasher ? hasher.apply(this, arguments) : key);
    if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
}

// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
var delay = restArguments(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args);
  }, wait);
});

// Defers a function, scheduling it to run after the current call stack has
// cleared.
var defer = partial(delay, _$1, 1);

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var _now = now();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

// When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is passed, the argument function will be
// triggered at the beginning of the sequence instead of at the end.
function debounce(func, wait, immediate) {
  var timeout, previous, args, result, context;

  var later = function () {
    var passed = now() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!timeout) args = context = null;
    }
  };

  var debounced = restArguments(function (_args) {
    context = this;
    args = _args;
    previous = now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result = func.apply(context, args);
    }
    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null;
  };

  return debounced;
}

// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
function wrap(func, wrapper) {
  return partial(wrapper, func);
}

// Returns a negated version of the passed-in predicate.
function negate(predicate) {
  return function () {
    return !predicate.apply(this, arguments);
  };
}

// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function () {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

// Returns a function that will only be executed on and after the Nth call.
function after(times, func) {
  return function () {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
}

// Returns a function that will only be executed up to (but not including) the
// Nth call.
function before(times, func) {
  var memo;
  return function () {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }
    if (times <= 1) func = null;
    return memo;
  };
}

// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
var once = partial(before, 2);

// Returns the first key on an object that passes a truth test.
function findKey(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = keys(obj),
    key;
  for (var i = 0, length = _keys.length; i < length; i++) {
    key = _keys[i];
    if (predicate(obj[key], key, obj)) return key;
  }
}

// Internal function to generate `_.findIndex` and `_.findLastIndex`.
function createPredicateIndexFinder(dir) {
  return function (array, predicate, context) {
    predicate = cb(predicate, context);
    var length = getLength(array);
    var index = dir > 0 ? 0 : length - 1;
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) return index;
    }
    return -1;
  };
}

// Returns the first index on an array-like that passes a truth test.
var findIndex = createPredicateIndexFinder(1);

// Returns the last index on an array-like that passes a truth test.
var findLastIndex = createPredicateIndexFinder(-1);

// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
function sortedIndex(array, obj, iteratee, context) {
  iteratee = cb(iteratee, context, 1);
  var value = iteratee(obj);
  var low = 0,
    high = getLength(array);
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee(array[mid]) < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

// Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
function createIndexFinder(dir, predicateFind, sortedIndex) {
  return function (array, item, idx) {
    var i = 0,
      length = getLength(array);
    if (typeof idx == "number") {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(slice.call(array, i, length), isNaN$1);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }
    return -1;
  };
}

// Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
var indexOf = createIndexFinder(1, findIndex, sortedIndex);

// Return the position of the last occurrence of an item in an array,
// or -1 if the item is not included in the array.
var lastIndexOf = createIndexFinder(-1, findLastIndex);

// Return the first value which passes a truth test.
function find(obj, predicate, context) {
  var keyFinder = isArrayLike(obj) ? findIndex : findKey;
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) return obj[key];
}

// Convenience version of a common use case of `_.find`: getting the first
// object containing specific `key:value` pairs.
function findWhere(obj, attrs) {
  return find(obj, matcher(attrs));
}

// The cornerstone for collection functions, an `each`
// implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
function each(obj, iteratee, context) {
  iteratee = optimizeCb(iteratee, context);
  var i, length;
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var _keys = keys(obj);
    for (i = 0, length = _keys.length; i < length; i++) {
      iteratee(obj[_keys[i]], _keys[i], obj);
    }
  }
  return obj;
}

// Return the results of applying the iteratee to each element.
function map(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var _keys = !isArrayLike(obj) && keys(obj),
    length = (_keys || obj).length,
    results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

// Internal helper to create a reducing function, iterating left or right.
function createReduce(dir) {
  // Wrap code that reassigns argument variables in a separate function than
  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
  var reducer = function (obj, iteratee, memo, initial) {
    var _keys = !isArrayLike(obj) && keys(obj),
      length = (_keys || obj).length,
      index = dir > 0 ? 0 : length - 1;
    if (!initial) {
      memo = obj[_keys ? _keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = _keys ? _keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  return function (obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
  };
}

// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
var reduce = createReduce(1);

// The right-associative version of reduce, also known as `foldr`.
var reduceRight = createReduce(-1);

// Return all the elements that pass a truth test.
function filter(obj, predicate, context) {
  var results = [];
  predicate = cb(predicate, context);
  each(obj, function (value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
}

// Return all the elements for which a truth test fails.
function reject(obj, predicate, context) {
  return filter(obj, negate(cb(predicate)), context);
}

// Determine whether all of the elements pass a truth test.
function every(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike(obj) && keys(obj),
    length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }
  return true;
}

// Determine if at least one element in the object passes a truth test.
function some(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike(obj) && keys(obj),
    length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }
  return false;
}

// Determine if the array or object contains a given item (using `===`).
function contains(obj, item, fromIndex, guard) {
  if (!isArrayLike(obj)) obj = values(obj);
  if (typeof fromIndex != "number" || guard) fromIndex = 0;
  return indexOf(obj, item, fromIndex) >= 0;
}

// Invoke a method (with arguments) on every item in a collection.
var invoke = restArguments(function (obj, path, args) {
  var contextPath, func;
  if (isFunction$1(path)) {
    func = path;
  } else {
    path = toPath(path);
    contextPath = path.slice(0, -1);
    path = path[path.length - 1];
  }
  return map(obj, function (context) {
    var method = func;
    if (!method) {
      if (contextPath && contextPath.length) {
        context = deepGet(context, contextPath);
      }
      if (context == null) return void 0;
      method = context[path];
    }
    return method == null ? method : method.apply(context, args);
  });
});

// Convenience version of a common use case of `_.map`: fetching a property.
function pluck(obj, key) {
  return map(obj, property(key));
}

// Convenience version of a common use case of `_.filter`: selecting only
// objects containing specific `key:value` pairs.
function where(obj, attrs) {
  return filter(obj, matcher(attrs));
}

// Return the maximum element (or element-based computation).
function max(obj, iteratee, context) {
  var result = -Infinity,
    lastComputed = -Infinity,
    value,
    computed;
  if (
    iteratee == null ||
    (typeof iteratee == "number" && typeof obj[0] != "object" && obj != null)
  ) {
    obj = isArrayLike(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value > result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    each(obj, function (v, index, list) {
      computed = iteratee(v, index, list);
      if (
        computed > lastComputed ||
        (computed === -Infinity && result === -Infinity)
      ) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}

// Return the minimum element (or element-based computation).
function min(obj, iteratee, context) {
  var result = Infinity,
    lastComputed = Infinity,
    value,
    computed;
  if (
    iteratee == null ||
    (typeof iteratee == "number" && typeof obj[0] != "object" && obj != null)
  ) {
    obj = isArrayLike(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value < result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    each(obj, function (v, index, list) {
      computed = iteratee(v, index, list);
      if (
        computed < lastComputed ||
        (computed === Infinity && result === Infinity)
      ) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}

// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher???Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `_.map`.
function sample(obj, n, guard) {
  if (n == null || guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    return obj[random(obj.length - 1)];
  }
  var sample = isArrayLike(obj) ? clone(obj) : values(obj);
  var length = getLength(sample);
  n = Math.max(Math.min(n, length), 0);
  var last = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = random(index, last);
    var temp = sample[index];
    sample[index] = sample[rand];
    sample[rand] = temp;
  }
  return sample.slice(0, n);
}

// Shuffle a collection.
function shuffle(obj) {
  return sample(obj, Infinity);
}

// Sort the object's values by a criterion produced by an iteratee.
function sortBy(obj, iteratee, context) {
  var index = 0;
  iteratee = cb(iteratee, context);
  return pluck(
    map(obj, function (value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list),
      };
    }).sort(function (left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }),
    "value"
  );
}

// An internal function used for aggregate "group by" operations.
function group(behavior, partition) {
  return function (obj, iteratee, context) {
    var result = partition ? [[], []] : {};
    iteratee = cb(iteratee, context);
    each(obj, function (value, index) {
      var key = iteratee(value, index, obj);
      behavior(result, value, key);
    });
    return result;
  };
}

// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
var groupBy = group(function (result, value, key) {
  if (has$1(result, key)) result[key].push(value);
  else result[key] = [value];
});

// Indexes the object's values by a criterion, similar to `_.groupBy`, but for
// when you know that your index values will be unique.
var indexBy = group(function (result, value, key) {
  result[key] = value;
});

// Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
var countBy = group(function (result, value, key) {
  if (has$1(result, key)) result[key]++;
  else result[key] = 1;
});

// Split a collection into two arrays: one whose elements all pass the given
// truth test, and one whose elements all do not pass the truth test.
var partition = group(function (result, value, pass) {
  result[pass ? 0 : 1].push(value);
}, true);

// Safely create a real, live array from anything iterable.
var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function toArray(obj) {
  if (!obj) return [];
  if (isArray(obj)) return slice.call(obj);
  if (isString(obj)) {
    // Keep surrogate pair characters together.
    return obj.match(reStrSymbol);
  }
  if (isArrayLike(obj)) return map(obj, identity);
  return values(obj);
}

// Return the number of elements in a collection.
function size(obj) {
  if (obj == null) return 0;
  return isArrayLike(obj) ? obj.length : keys(obj).length;
}

// Internal `_.pick` helper function to determine whether `key` is an enumerable
// property name of `obj`.
function keyInObj(value, key, obj) {
  return key in obj;
}

// Return a copy of the object only containing the allowed properties.
var pick = restArguments(function (obj, keys) {
  var result = {},
    iteratee = keys[0];
  if (obj == null) return result;
  if (isFunction$1(iteratee)) {
    if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
    keys = allKeys(obj);
  } else {
    iteratee = keyInObj;
    keys = flatten$1(keys, false, false);
    obj = Object(obj);
  }
  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (iteratee(value, key, obj)) result[key] = value;
  }
  return result;
});

// Return a copy of the object without the disallowed properties.
var omit = restArguments(function (obj, keys) {
  var iteratee = keys[0],
    context;
  if (isFunction$1(iteratee)) {
    iteratee = negate(iteratee);
    if (keys.length > 1) context = keys[1];
  } else {
    keys = map(flatten$1(keys, false, false), String);
    iteratee = function (value, key) {
      return !contains(keys, key);
    };
  }
  return pick(obj, iteratee, context);
});

// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
function initial(array, n, guard) {
  return slice.call(
    array,
    0,
    Math.max(0, array.length - (n == null || guard ? 1 : n))
  );
}

// Get the first element of an array. Passing **n** will return the first N
// values in the array. The **guard** check allows it to work with `_.map`.
function first(array, n, guard) {
  if (array == null || array.length < 1)
    return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[0];
  return initial(array, array.length - n);
}

// Returns everything but the first entry of the `array`. Especially useful on
// the `arguments` object. Passing an **n** will return the rest N values in the
// `array`.
function rest(array, n, guard) {
  return slice.call(array, n == null || guard ? 1 : n);
}

// Get the last element of an array. Passing **n** will return the last N
// values in the array.
function last(array, n, guard) {
  if (array == null || array.length < 1)
    return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return rest(array, Math.max(0, array.length - n));
}

// Trim out all falsy values from an array.
function compact(array) {
  return filter(array, Boolean);
}

// Flatten out an array, either recursively (by default), or up to `depth`.
// Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
function flatten(array, depth) {
  return flatten$1(array, depth, false);
}

// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
var difference = restArguments(function (array, rest) {
  rest = flatten$1(rest, true, true);
  return filter(array, function (value) {
    return !contains(rest, value);
  });
});

// Return a version of the array that does not contain the specified value(s).
var without = restArguments(function (array, otherArrays) {
  return difference(array, otherArrays);
});

// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// The faster algorithm will not work with an iteratee if the iteratee
// is not a one-to-one function, so providing an iteratee will disable
// the faster algorithm.
function uniq(array, isSorted, iteratee, context) {
  if (!isBoolean(isSorted)) {
    context = iteratee;
    iteratee = isSorted;
    isSorted = false;
  }
  if (iteratee != null) iteratee = cb(iteratee, context);
  var result = [];
  var seen = [];
  for (var i = 0, length = getLength(array); i < length; i++) {
    var value = array[i],
      computed = iteratee ? iteratee(value, i, array) : value;
    if (isSorted && !iteratee) {
      if (!i || seen !== computed) result.push(value);
      seen = computed;
    } else if (iteratee) {
      if (!contains(seen, computed)) {
        seen.push(computed);
        result.push(value);
      }
    } else if (!contains(result, value)) {
      result.push(value);
    }
  }
  return result;
}

// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
var union = restArguments(function (arrays) {
  return uniq(flatten$1(arrays, true, true));
});

// Produce an array that contains every item shared between all the
// passed-in arrays.
function intersection(array) {
  var result = [];
  var argsLength = arguments.length;
  for (var i = 0, length = getLength(array); i < length; i++) {
    var item = array[i];
    if (contains(result, item)) continue;
    var j;
    for (j = 1; j < argsLength; j++) {
      if (!contains(arguments[j], item)) break;
    }
    if (j === argsLength) result.push(item);
  }
  return result;
}

// Complement of zip. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.
function unzip(array) {
  var length = (array && max(array, getLength).length) || 0;
  var result = Array(length);

  for (var index = 0; index < length; index++) {
    result[index] = pluck(array, index);
  }
  return result;
}

// Zip together multiple lists into a single array -- elements that share
// an index go together.
var zip = restArguments(unzip);

// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values. Passing by pairs is the reverse of `_.pairs`.
function object(list, values) {
  var result = {};
  for (var i = 0, length = getLength(list); i < length; i++) {
    if (values) {
      result[list[i]] = values[i];
    } else {
      result[list[i][0]] = list[i][1];
    }
  }
  return result;
}

// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](https://docs.python.org/library/functions.html#range).
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
}

// Chunk a single array into multiple arrays, each containing `count` or fewer
// items.
function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result = [];
  var i = 0,
    length = array.length;
  while (i < length) {
    result.push(slice.call(array, i, (i += count)));
  }
  return result;
}

// Helper function to continue chaining intermediate results.
function chainResult(instance, obj) {
  return instance._chain ? _$1(obj).chain() : obj;
}

// Add your own custom functions to the Underscore object.
function mixin(obj) {
  each(functions(obj), function (name) {
    var func = (_$1[name] = obj[name]);
    _$1.prototype[name] = function () {
      var args = [this._wrapped];
      push.apply(args, arguments);
      return chainResult(this, func.apply(_$1, args));
    };
  });
  return _$1;
}

// Add all mutator `Array` functions to the wrapper.
each(
  ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
  function (name) {
    var method = ArrayProto[name];
    _$1.prototype[name] = function () {
      var obj = this._wrapped;
      if (obj != null) {
        method.apply(obj, arguments);
        if ((name === "shift" || name === "splice") && obj.length === 0) {
          delete obj[0];
        }
      }
      return chainResult(this, obj);
    };
  }
);

// Add all accessor `Array` functions to the wrapper.
each(["concat", "join", "slice"], function (name) {
  var method = ArrayProto[name];
  _$1.prototype[name] = function () {
    var obj = this._wrapped;
    if (obj != null) obj = method.apply(obj, arguments);
    return chainResult(this, obj);
  };
});

// Named Exports

var allExports = {
  __proto__: null,
  VERSION: VERSION$1,
  restArguments: restArguments,
  isObject: isObject,
  isNull: isNull,
  isUndefined: isUndefined,
  isBoolean: isBoolean,
  isElement: isElement,
  isString: isString,
  isNumber: isNumber$1,
  isDate: isDate,
  isRegExp: isRegExp,
  isError: isError,
  isSymbol: isSymbol,
  isArrayBuffer: isArrayBuffer,
  isDataView: isDataView$1,
  isArray: isArray,
  isFunction: isFunction$1,
  isArguments: isArguments$1,
  isFinite: isFinite$1,
  isNaN: isNaN$1,
  isTypedArray: isTypedArray$1,
  isEmpty: isEmpty,
  isMatch: isMatch,
  isEqual: isEqual,
  isMap: isMap,
  isWeakMap: isWeakMap,
  isSet: isSet,
  isWeakSet: isWeakSet,
  keys: keys,
  allKeys: allKeys,
  values: values,
  pairs: pairs,
  invert: invert,
  functions: functions,
  methods: functions,
  extend: extend,
  extendOwn: extendOwn,
  assign: extendOwn,
  defaults: defaults,
  create: create,
  clone: clone,
  tap: tap,
  get: get,
  has: has,
  mapObject: mapObject,
  identity: identity,
  constant: constant,
  noop: noop,
  toPath: toPath$1,
  property: property,
  propertyOf: propertyOf,
  matcher: matcher,
  matches: matcher,
  times: times,
  random: random,
  now: now,
  escape: _escape,
  unescape: _unescape,
  templateSettings: templateSettings,
  template: template,
  result: result,
  uniqueId: uniqueId,
  chain: chain,
  iteratee: iteratee,
  partial: partial,
  bind: bind,
  bindAll: bindAll,
  memoize: memoize,
  delay: delay,
  defer: defer,
  throttle: throttle,
  debounce: debounce,
  wrap: wrap,
  negate: negate,
  compose: compose,
  after: after,
  before: before,
  once: once,
  findKey: findKey,
  findIndex: findIndex,
  findLastIndex: findLastIndex,
  sortedIndex: sortedIndex,
  indexOf: indexOf,
  lastIndexOf: lastIndexOf,
  find: find,
  detect: find,
  findWhere: findWhere,
  each: each,
  forEach: each,
  map: map,
  collect: map,
  reduce: reduce,
  foldl: reduce,
  inject: reduce,
  reduceRight: reduceRight,
  foldr: reduceRight,
  filter: filter,
  select: filter,
  reject: reject,
  every: every,
  all: every,
  some: some,
  any: some,
  contains: contains,
  includes: contains,
  include: contains,
  invoke: invoke,
  pluck: pluck,
  where: where,
  max: max,
  min: min,
  shuffle: shuffle,
  sample: sample,
  sortBy: sortBy,
  groupBy: groupBy,
  indexBy: indexBy,
  countBy: countBy,
  partition: partition,
  toArray: toArray,
  size: size,
  pick: pick,
  omit: omit,
  first: first,
  head: first,
  take: first,
  initial: initial,
  last: last,
  rest: rest,
  tail: rest,
  drop: rest,
  compact: compact,
  flatten: flatten,
  without: without,
  uniq: uniq,
  unique: uniq,
  union: union,
  intersection: intersection,
  difference: difference,
  unzip: unzip,
  transpose: unzip,
  zip: zip,
  object: object,
  range: range,
  chunk: chunk,
  mixin: mixin,
  default: _$1,
};

// Default Export

// Add all of the Underscore functions to the wrapper object.
var _ = mixin(allExports);
// Legacy Node.js API.
_._ = _;

//
// Super-simple class implementation
//
// Example usage:
//
// BiwaScheme.Foo = BiwaScheme.Class.create({
//   initialize: function(a){
//     this.a = a;
//   },
//
//   toString: function(){
//     return "foo[" + this.a + "]";
//   }
// });
//
// BiwaScheme.Bar = BiwaScheme.Class.extend(new BiwaScheme.Foo("hello1"), {
//   initialize: function(b){
//     this.b = b;
//   },
//
//   printEverything: function(){
//     console.log("a = ", this.a, "b = ", this.b);
//   },
//
//   toString: function(){
//     return "bar[" + this.b + "]";
//   }
// });

const Class = {
  create: function (methods) {
    var klass = function () {
      this.initialize.apply(this, arguments);
    };
    extend(klass.prototype, methods);
    return klass;
  },

  extend: function (parent, methods) {
    var klass = function () {
      this.initialize.apply(this, arguments);
    };
    klass.prototype = parent;
    extend(klass.prototype, methods);
    return klass;
  },
};

// Update the given method to memoized version.
//
// - klass : a class defined by BiwaScheme.Class.create
// - name_or_names : method name (a string or an array of strings)
//
// Example
//
//   // Given this method
//   BiwaScheme.Enumeration.EnumType = ...
//     universe: function(){
//       return ...
//     }
//   ...
//   // Memoize
//   BiwaScheme.Class.memoize(BiwaScheme.Enumeration.EnumType,
//                            "_universe");
//
//   // Equal to:
//   BiwaScheme.Enumeration.EnumType = ...
//     universe: function(){
//       if(!this.hasOwnProperty("cached_universe")){
//         this.cached_universe = this.compute_universe();
//       }
//       return this.cached_universe;
//     },
//     compute_universe: function(){
//       // Original function, renamed to compute_*
//       return ...
//     }
//   ...
Class.memoize = function (klass, name_or_names) {
  var proto = klass.prototype;
  var names = isArray(name_or_names) ? name_or_names : [name_or_names];

  each(names, function (name) {
    // Copy original function foo as 'compute_foo'
    proto["compute_" + name] = proto[name];

    // Define memoizing version
    proto[name] = function (/*arguments*/) {
      if (!this.hasOwnProperty("cached_" + name)) {
        this["cached_" + name] = this["compute_" + name].apply(
          this,
          toArray(arguments)
        );
      }
      return this["cached_" + name];
    };
  });
};

//
// Symbol
//

const Symbols = {};

const BiwaSymbol = Class.create({
  initialize: function (str) {
    this.name = str;
    Symbols[str] = this;
  },

  inspect: function () {
    return "'" + this.name;
    //return "#<Symbol '"+this.name+"'>";
  },

  toString: function () {
    return "'" + this.name;
  },

  to_write: function () {
    return this.name;
  },
});

const Sym = function (name, leaveCase) {
  if (Symbols[name] === undefined) {
    return new BiwaSymbol(name);
  } else if (!(Symbols[name] instanceof BiwaSymbol)) {
    //pre-defined member (like 'eval' in Firefox)
    return new BiwaSymbol(name);
  } else {
    return Symbols[name];
  }
};

const gensym = function () {
  return Sym(uniqueId("__gensym"));
};

//
// Errors
//

const BiwaError = Class.create({
  initialize: function (msg, form = null) {
    const info = form === null ? "" : `: ${to_write$1(form)}`;
    this.message = `Error: ${msg}${info}`;
    this.form = form;
  },
  toString: function () {
    return this.message;
  },
});

const Bug = Class.extend(new BiwaError(), {
  initialize: function (msg) {
    this.message = "[BUG] " + msg;
  },
});

// currently used by "raise"
const UserError = Class.extend(new BiwaError(), {
  initialize: function (msg) {
    this.message = msg;
  },
});

//
// Set - set of string
// contents must be string (or at least sortable)
//
const BiwaSet = Class.create({
  initialize: function (/*args*/) {
    this.arr = [];
    var i;
    for (i = 0; i < arguments.length; i++) this.arr[i] = arguments[i];
  },

  equals: function (other) {
    if (this.arr.length != other.arr.length) return false;

    var a1 = clone(this.arr);
    var a2 = clone(other.arr);
    a1.sort();
    a2.sort();
    for (var i = 0; i < this.arr.length; i++) {
      if (a1[i] != a2[i]) return false;
    }
    return true;
  },
  set_cons: function (item) {
    var o = new BiwaSet(item);
    o.arr = clone(this.arr);
    o.arr.push(item);
    return o;
  },
  set_union: function (/*args*/) {
    var o = new BiwaSet();
    o.arr = clone(this.arr);

    for (var k = 0; k < arguments.length; k++) {
      var s2 = arguments[k];
      if (!(s2 instanceof BiwaSet))
        throw new BiwaError("set_union: arguments must be a set");

      for (var i = 0; i < s2.arr.length; i++) o.add(s2.arr[i]);
    }
    return o;
  },
  set_intersect: function (s2) {
    if (!(s2 instanceof BiwaSet))
      throw new BiwaError("set_intersect: arguments must be a set");

    var o = new BiwaSet();
    for (var i = 0; i < this.arr.length; i++)
      if (s2.member(this.arr[i])) o.add(this.arr[i]);
    return o;
  },
  set_minus: function (s2) {
    if (!(s2 instanceof BiwaSet))
      throw new BiwaError("set_minus: arguments must be a set");

    var o = new BiwaSet();
    for (var i = 0; i < this.arr.length; i++)
      if (!s2.member(this.arr[i])) o.add(this.arr[i]);
    return o;
  },
  add: function (item) {
    if (!this.member(item)) {
      this.arr.push(item);
    }
  },
  member: function (item) {
    for (var i = 0; i < this.arr.length; i++)
      if (this.arr[i] == item) return true;

    return false;
  },
  rindex: function (item) {
    for (var i = this.arr.length - 1; i >= 0; i--)
      if (this.arr[i] == item) return this.arr.length - 1 - i;

    return null;
  },
  index: function (item) {
    for (var i = 0; i < this.arr.length; i++) if (this.arr[i] == item) return i;

    return null;
  },
  inspect: function () {
    return "Set(" + this.arr.join(", ") + ")";
  },
  toString: function () {
    return this.inspect();
  },
  size: function () {
    return this.arr.length;
  },
});

//
// Pair
// cons cell
//

const Pair = Class.create({
  initialize: function (car, cdr) {
    this.car = car;
    this.cdr = cdr;
  },

  caar: function () {
    return this.car.car;
  },
  cadr: function () {
    return this.cdr.car;
  },
  cdar: function () {
    return this.cdr.car;
  },
  cddr: function () {
    return this.cdr.cdr;
  },

  first: function () {
    return this.car;
  },
  second: function () {
    return this.cdr.car;
  },
  third: function () {
    return this.cdr.cdr.car;
  },
  fourth: function () {
    return this.cdr.cdr.cdr.car;
  },
  fifth: function () {
    return this.cdr.cdr.cdr.cdr.car;
  },

  // returns array containing all the car's of list
  // '(1 2 3) => [1,2,3]
  // '(1 2 . 3) => [1,2]
  to_array: function () {
    var ary = [];
    for (var o = this; o instanceof Pair; o = o.cdr) {
      ary.push(o.car);
    }
    return ary;
  },

  to_set: function () {
    var set = new BiwaSet();
    for (var o = this; o instanceof Pair; o = o.cdr) {
      set.add(o.car);
    }
    return set;
  },

  length: function () {
    var n = 0;
    for (var o = this; o instanceof Pair; o = o.cdr) {
      n++;
    }
    return n;
  },

  // Return the last cdr
  last_cdr: function () {
    var o;
    for (o = this; o instanceof Pair; o = o.cdr);
    return o;
  },

  // calls the given func passing each car of list
  // returns cdr of last Pair
  forEach: function (func) {
    for (var o = this; o instanceof Pair; o = o.cdr) {
      func(o.car);
    }
    return o;
  },

  // Alias of `forEach` (for backward compatibility)
  foreach: function (func) {
    for (var o = this; o instanceof Pair; o = o.cdr) {
      func(o.car);
    }
    return o;
  },

  // Returns an array which contains the resuls of calling func
  // with the car's as an argument.
  // If the receiver is not a proper list, the last cdr is ignored.
  // The receiver must not be a cyclic list.
  map: function (func) {
    var ary = [];
    for (var o = this; isPair(o); o = o.cdr) {
      ary.push(func(o.car));
    }
    return ary;
  },

  // Returns a new list made by applying `func` to each element
  mapList: function (func) {
    return array_to_list(this.map(func));
  },

  // Destructively concat the given list to the receiver.
  // The receiver must be a proper list.
  // Returns the receiver.
  concat: function (list) {
    var o = this;
    while (o instanceof Pair && o.cdr != nil) {
      o = o.cdr;
    }
    o.cdr = list;
    return this;
  },

  // returns human-redable string of pair
  inspect: function (conv) {
    conv || (conv = inspect);
    var a = [];
    var last = this.foreach(function (o) {
      a.push(conv(o));
    });
    if (last != nil) {
      a.push(".");
      a.push(conv(last));
    }
    return "(" + a.join(" ") + ")";
  },
  toString: function () {
    return this.inspect();
  },

  to_display: function (to_display) {
    return this.inspect(to_display);
  },

  to_write: function () {
    return this.inspect(to_write$1);
  },
});

// Note: '() is not a pair in scheme
const isPair = function (obj) {
  return obj instanceof Pair;
};

// Returns true if obj is a proper list
// Note: isList returns true for '()
const isList = function (obj) {
  if (obj === nil) {
    // Empty list
    return true;
  }
  if (!(obj instanceof Pair)) {
    // Argument isn't even a pair
    return false;
  }

  var tortoise = obj;
  var hare = obj.cdr;
  while (true) {
    if (hare === nil) {
      // End of list
      return true;
    }
    if (hare === tortoise) {
      // Cycle
      return false;
    }
    if (!(hare instanceof Pair)) {
      // Improper list
      return false;
    }

    if (hare.cdr === nil) {
      // End of list
      return true;
    }
    if (!(hare.cdr instanceof Pair)) {
      // Improper list
      return false;
    }

    hare = hare.cdr.cdr;
    tortoise = tortoise.cdr;
  }
};

// Creates a list out of the arguments, optionally converting any nested arrays into nested lists if the deep argument is true.
// Example:
//   BiwaScheme.List(1, 2, [3, 4]) ;=> (list 1 2 (vector 3 4))
//   BiwaScheme.deep_array_to_list(1, 2, [3, 4]) ;=> (list 1 2 (list 3 4))
const array_to_list_ = function (ary, deep) {
  var list = nil;
  for (var i = ary.length - 1; i >= 0; i--) {
    var obj = ary[i];
    if (deep && isArray(obj) && !obj.is_vector) {
      obj = array_to_list_(obj, deep);
    }
    list = new Pair(obj, list);
  }
  return list;
};

// Shallow: List(1, 2, [3]) == (list 1 2 (vector 3 4))
const List = function () {
  var ary = toArray(arguments);
  return array_to_list_(ary, false);
};

// Shallow: array_to_list(1, 2, [3]) == (list 1 2 (vector 3 4))
const array_to_list = function (ary) {
  return array_to_list_(ary, false);
};

// Deep: deep_array_to_list(1, 2, [3, 4]) == (list 1 2 (list 3 4))
// deep_array_to_list([1, 2, 3]) - deep
const deep_array_to_list = function (ary) {
  return array_to_list_(ary, true);
};

const Cons = function (car, cdr) {
  return new Pair(car, cdr);
};

const js_obj_to_alist = function (obj) {
  if (obj === undefined) {
    return nil;
  }
  var arr = [];
  each(obj, function (val, key) {
    arr.push(new Pair(key, val));
  });
  var alist = array_to_list(arr);
  return alist;
};

const alist_to_js_obj = function (alist) {
  if (alist === nil) {
    return {};
  }
  var obj = {};
  alist.foreach(function (item) {
    obj[item.car] = item.cdr;
  });
  return obj;
};

//
// _writer.js: Functions to convert objects to strings
//

// Truncate long string with '...'
const truncate = function (str, length) {
  const truncateStr = "...";
  return str.length > length ? str.slice(0, length) + truncateStr : str;
};

//
// write
//

const write_simple = function (obj) {
  if (obj === undefined) return "undefined";
  else if (obj === null) return "null";
  else if (isFunction$1(obj))
    return (
      "#<Function " +
      (obj.fname
        ? obj.fname
        : obj.toSource
        ? truncate(obj.toSource(), 40)
        : "") +
      ">"
    );
  else if (isString(obj))
    return (
      '"' +
      obj
        .replace(/\\|\"/g, function ($0) {
          return "\\" + $0;
        })
        .replace(/\x07/g, "\\a")
        .replace(/\x08/g, "\\b")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\v/g, "\\v")
        .replace(/\f/g, "\\f")
        .replace(/\r/g, "\\r") +
      '"'
    );
  else if (isArray(obj))
    return (
      "#(" +
      map(obj, function (e) {
        return write_simple(e);
      }).join(" ") +
      ")"
    );
  else if (typeof obj.to_write == "function") return obj.to_write();
  else if (isNaN(obj) && typeof obj == "number") return "+nan.0";
  else {
    switch (obj) {
      case true:
        return "#t";
      case false:
        return "#f";
      case Infinity:
        return "+inf.0";
      case -Infinity:
        return "-inf.0";
    }
  }
  return inspect(obj);
};

//
// display
//

const to_display = function (obj) {
  if (isUndefined(obj)) return "undefined";
  else if (isNull(obj)) return "null";
  else if (obj.to_display) return obj.to_display(to_display);
  else if (typeof obj.valueOf() == "string") return obj;
  else if (obj instanceof BiwaSymbol) return obj.name;
  else if (obj instanceof Array)
    return "#(" + map(obj, to_display).join(" ") + ")";
  else return write_simple(obj);
};

//
// inspect (for debugging)
//

const inspect = function (object, opts) {
  try {
    if (isUndefined(object)) return "undefined";
    if (object === null) return "null";
    if (object === true) return "#t";
    if (object === false) return "#f";
    if (object.inspect) return object.inspect();
    if (isString(object)) {
      return '"' + object.replace(/"/g, '\\"') + '"';
    }
    if (isArray(object)) {
      return "[" + map(object, inspect).join(", ") + "]";
    }

    if (opts && opts["fallback"]) {
      return opts["fallback"];
    } else {
      return object.toString();
    }
  } catch (e) {
    if (e instanceof RangeError) return "...";
    throw e;
  }
};

//
// write/ss (write with substructure)
//

// Uses datum label if cyclic. Otherwise does not
function write(obj) {
  const wstate = _preprocess(obj);
  if (wstate.cyclic) {
    return _write_shared(obj, wstate);
  } else {
    return write_simple(obj);
  }
}

function _preprocess(obj) {
  const state = {
    objs: new Set(),
    shared_objs: new Set(),
    parents: new Set(),
    cyclic: false,
  };
  _gather_information(obj, state);

  // Create initial writer state
  const ids = new Map();
  for (const o of state.shared_objs) {
    ids.set(o, null);
  }
  const wstate = {
    ids: ids,
    last_id: -1,
    cyclic: state.cyclic,
  };
  return wstate;
}

function _gather_information(obj, state) {
  if (state.parents.has(obj)) {
    // Already seen and this is a cyclic object
    state.cyclic = true;
  }
  if (state.shared_objs.has(obj)) {
    return;
  } else if (state.objs.has(obj)) {
    state.shared_objs.add(obj);
    return;
  }
  // Found a new object
  state.objs.add(obj);
  if (isPair(obj)) {
    state.parents.add(obj);
    _gather_information(obj.car, state);
    _gather_information(obj.cdr, state);
    state.parents.delete(obj);
  } else if (isVector(obj)) {
    state.parents.add(obj);
    obj.forEach((item) => {
      _gather_information(item, state);
    });
    state.parents.delete(obj);
  }
}

// Always use datum label
function write_shared(obj) {
  const wstate = _preprocess(obj);
  return _write_shared(obj, wstate);
}

function _write_shared(obj, wstate) {
  let s = "";
  if (wstate.ids.has(obj)) {
    const id = wstate.ids.get(obj);
    if (id === null) {
      // First occurrence of a shared object; Give it a number
      const new_id = wstate.last_id + 1;
      wstate.ids.set(obj, new_id);
      wstate.last_id = new_id;
      s += `#${new_id}=`;
    } else {
      // Already printed. Just show the reference
      return `#${id}#`;
    }
  }
  if (isPair(obj)) {
    const a = [];
    // Note that we cannot use obj.forEach (because it does not stop)
    a.push(_write_shared(obj.car, wstate));
    for (let o = obj.cdr; o !== nil; o = o.cdr) {
      if (!isPair(o) || wstate.ids.has(o)) {
        a.push(".");
        a.push(_write_shared(o, wstate));
        break;
      }
      a.push(_write_shared(o.car, wstate));
    }
    s += "(" + a.join(" ") + ")";
  } else if (isVector(obj)) {
    const a = obj.map((item) => _write_shared(item, wstate));
    s += "#(" + a.join(" ") + ")";
  } else {
    s += write_simple(obj);
  }
  return s;
}

const to_write$1 = write;

//
// Char
//

const Chars = {};

const Char = Class.create({
  initialize: function (c) {
    Chars[(this.value = c)] = this;
  },
  to_write: function () {
    switch (this.value) {
      case "\n":
        return "#\\newline";
      case " ":
        return "#\\space";
      case "\t":
        return "#\\tab";
      default:
        return "#\\" + this.value;
    }
  },
  to_display: function () {
    return this.value;
  },
  inspect: function () {
    return this.to_write();
  },
});

Char.get = function (c) {
  if (typeof c != "string") {
    throw new Bug("Char.get: " + inspect(c) + " is not a string");
  }
  if (Chars[c] === undefined) return new Char(c);
  else return Chars[c];
};

//
// pause object (facility to stop/resume interpreting)
//
var Pause = Class.create({
  //new (on_pause: javascript function calling setTimeout, Ajax.Request, ..)
  initialize: function (on_pause) {
    this.on_pause = on_pause;
  },

  //save state of interpreter
  set_state: function (intp, x, f, c, s) {
    this.interpreter = intp;
    this.x = x;
    this.f = f;
    this.c = c;
    this.s = s;
  },

  //call this when ready (to fire setTimeout, Ajax.Request..)
  ready: function () {
    this.on_pause(this);
  },

  //restart calculation
  resume: function (value) {
    return this.interpreter.resume(true, value, this.x, this.f, this.c, this.s);
  },
});

//
// Port
//

// (eof-object)
const eof = new Object();

const Port = Class.create({
  initialize: function (is_in, is_out) {
    this.is_open = true;
    this.is_binary = false; //??
    this.is_input = is_in;
    this.is_output = is_out;
  },
  close: function () {
    // close port
    this.is_open = false;
  },
  inspect: function () {
    return "#<Port>";
  },
  to_write: function () {
    return "#<Port>";
  },
});

//
// string ports (srfi-6)
//
Port.StringOutput = Class.extend(new Port(false, true), {
  initialize: function () {
    this.buffer = [];
  },
  put_string: function (str) {
    this.buffer.push(str);
  },
  output_string: function (str) {
    return this.buffer.join("");
  },
});

Port.StringInput = Class.extend(new Port(true, false), {
  initialize: function (str) {
    this.str = str;
  },
  get_string: function (after) {
    return after(this.str);
  },
});

Port.NullInput = Class.extend(new Port(true, false), {
  initialize: function () {},
  get_string: function (after) {
    // Never give them anything!
    return after("");
  },
});

Port.NullOutput = Class.extend(new Port(false, true), {
  initialize: function (output_function) {
    this.output_function = output_function;
  },
  put_string: function (str) {},
});

Port.CustomOutput = Class.extend(new Port(false, true), {
  initialize: function (output_function) {
    this.output_function = output_function;
  },
  put_string: function (str) {
    this.output_function(str);
  },
});

Port.CustomInput = Class.extend(new Port(true, false), {
  initialize: function (input_function) {
    this.input_function = input_function;
  },
  get_string: function (after) {
    var input_function = this.input_function;
    return new Pause(function (pause) {
      input_function(function (input) {
        pause.resume(after(input));
      });
    });
  },
});

// User must set the current input/output
Port.current_input = new Port.NullInput();
Port.current_output = new Port.NullOutput();
Port.current_error = new Port.NullOutput();

// A Scheme lambda
const Closure = Class.create({
  // body: Intermediate Language (JS array)
  // freevars: Captured free variables
  // dotpos: The position of `.` in the parameter list. -1 if none
  // expected_args: Expected number of args or `undefined`
  initialize: function (body, freevars, dotpos, expected_args) {
    this.body = body;
    this.freevars = freevars;
    this.dotpos = dotpos;
    this.expected_args = expected_args;
  },

  to_write: function () {
    return "#<Closure>";
  },
});

const isClosure = function (obj) {
  return obj instanceof Closure;
};

//

const isNil = function (obj) {
  return obj === nil;
};

const isUndef = function (obj) {
  return obj === undef;
};

const isBoolean$1 = isBoolean; // Return true if arg is either true or false

//isNumber is defined in number.js (Return true if arg is scheme number)

const isString$1 = isString;

const isFunction$2 = isFunction$1;

const isChar = function (obj) {
  return obj instanceof Char;
};

const isSymbol$1 = function (obj) {
  return obj instanceof BiwaSymbol;
};

const isPort = function (obj) {
  return obj instanceof Port;
};

const isVector = function (obj) {
  return obj instanceof Array;
};

// procedure: Scheme closure or JavaScript function
// valid argument for anywhere function is expected
const isProcedure = function (obj) {
  return isClosure(obj) || isFunction$1(obj);
};

// Return true if obj is a scheme value which evaluates to itself
const isSelfEvaluating = function (obj) {
  return isBoolean$1(obj) || isNumber(obj) || isString$1(obj) || isChar(obj);
};

//
// equality
//
const eq$1 = function (a, b) {
  return a === b;
};
// TODO: Records (etc.)
const eqv = function (a, b) {
  return a == b && typeof a == typeof b;
};
const equal = function (a, b) {
  //TODO: must terminate for cyclic objects
  return to_write$1(a) == to_write$1(b);
};

//
// comaprator
//
// Return true when a < b
const lt = function (a, b) {
  if (typeof a !== typeof b) {
    return compareFn(typeof a, typeof b);
  }
  return a < b;
};

///
/// Call
///

// The class Call is used to invoke scheme closure from
// library functions.
//
// Call#initialize takes three arguments: proc, args and after.
//   * proc is the scheme closure to invoke.
//   * args is an Array (not list!) of arguments for the invocation.
//   * after is a javascript function which is invoked when
//     returned from the proc.
//
//     after takes two arguments: ar and intp.
//       * ar is an Array which contains the result of the invocation.
//       * intp is an Interpreter which is running.
//
//     If after returns another Call object, another invocation
//     happens. If after returns a normal value, it is the value
//     of the library function.
//
// example:
//   return new Call(proc, [x, y], function(ar){ ar[0] });
//
const Call = Class.create({
  initialize: function (proc, args, after) {
    this.proc = proc;
    this.args = args;
    this.after =
      after ||
      function (ar) {
        // just return result which closure returned
        return ar[0];
      };
  },

  inspect: function () {
    return "#<Call args=" + this.args.inspect() + ">";
  },

  toString: function () {
    return "#<Call>";
  },

  to_write: function () {
    return "#<Call>";
  },
});

//
// Iterator - external iterator for Call.foreach
//
const Iterator = {
  ForArray: Class.create({
    initialize: function (arr) {
      this.arr = arr;
      this.i = 0;
    },
    has_next: function () {
      return this.i < this.arr.length;
    },
    next: function () {
      return this.arr[this.i++];
    },
  }),
  ForString: Class.create({
    initialize: function (str) {
      this.str = str;
      this.i = 0;
    },
    has_next: function () {
      return this.i < this.str.length;
    },
    next: function () {
      return Char.get(this.str.charAt(this.i++));
    },
  }),
  ForList: Class.create({
    initialize: function (ls) {
      this.ls = ls;
    },
    has_next: function () {
      return this.ls instanceof Pair && this.ls != nil;
    },
    next: function () {
      var pair = this.ls;
      this.ls = this.ls.cdr;
      return pair;
    },
  }),
  ForMulti: Class.create({
    initialize: function (objs) {
      this.objs = objs;
      this.size = objs.length;
      this.iterators = map(objs, function (x) {
        return Iterator.of(x);
      });
    },
    has_next: function () {
      for (var i = 0; i < this.size; i++)
        if (!this.iterators[i].has_next()) return false;

      return true;
    },
    next: function () {
      return map(this.iterators, function (ite) {
        return ite.next();
      });
    },
  }),
  of: function (obj) {
    switch (true) {
      case obj instanceof Array:
        return new this.ForArray(obj);
      case typeof obj == "string":
        return new this.ForString(obj);
      case obj instanceof Pair:
      case obj === nil:
        return new this.ForList(obj);
      default:
        throw new Bug("Iterator.of: unknown class: " + inspect(obj));
    }
  },
};

//
// Call.foreach - shortcut for successive Calls
//
// Some library functions, such as for-each or map,
// call a closure for each element. Call.foreach is
// a utility to help defining such methods.
//
// Call.foreach takes a sequence and some callbacks.
// Sequence is an Array, String, or list.
//
// Example:
//   return Call.foreach(sequence, {
//     // before each call
//     call: function(elem){
//       return new Call(proc, [elem]);
//     },
//     // after each call
//     result: function(value, elem){
//       ary.push(value);
//       // you can return a value to terminate the loop
//     },
//     // after all the calls
//     finish: function(){
//       return ary;
//     }
//   });

Call.default_callbacks = {
  call: function (x) {
    return new Call(this.proc, [x]);
  },
  result: function () {},
  finish: function () {},
};
Call.foreach = function (obj, callbacks, is_multi) {
  is_multi || (is_multi = false);
  each(["call", "result", "finish"], function (key) {
    if (!callbacks[key]) callbacks[key] = Call.default_callbacks[key];
  });

  var iterator = null;
  var x = null;

  var loop = function (ar) {
    if (iterator) {
      var ret = callbacks["result"](ar[0], x);
      if (ret !== undefined) return ret;
    } else {
      // first lap
      if (is_multi) iterator = new Iterator.ForMulti(obj);
      else iterator = Iterator.of(obj);
    }

    if (!iterator.has_next()) {
      return callbacks["finish"]();
    } else {
      x = iterator.next();
      var result = callbacks["call"](x);
      result.after = loop;
      return result;
    }
  };
  return loop(null);
};
Call.multi_foreach = function (obj, callbacks) {
  return Call.foreach(obj, callbacks, true);
};

//
// Syntax
//
const Syntax = Class.create({
  initialize: function (sname, func) {
    this.sname = sname;
    this.func = func;
  },
  transform: function (x) {
    if (!this.func) {
      throw new Bug("sorry, syntax " + this.sname + " is a pseudo syntax now");
    }
    return this.func(x);
  },
  inspect: function () {
    return "#<Syntax " + this.sname + ">";
  },
});

// A built-in syntax did not have associated Syntax object.
// Following code installed dummy Syntax objects to built-in syntax.
CoreEnv["define"] = new Syntax("define");
CoreEnv["begin"] = new Syntax("begin");
CoreEnv["quote"] = new Syntax("quote");
CoreEnv["lambda"] = new Syntax("lambda");
CoreEnv["if"] = new Syntax("if");
CoreEnv["set!"] = new Syntax("set!");

// A compiled Scheme expression
const VMCode = Class.create({
  // il: Intermediate Language (JS array)
  initialize: function (il) {
    if (!isVector(il)) {
      console.error(il);
      throw "not array";
    }
    this.il = il;
  },

  to_write: function () {
    return "#<VMCode>";
  },
});

///
/// Compiler
///
/// Note: macro expansion is done by Intepreter#expand

const Compiler = Class.create({
  initialize: function () {},

  is_tail: function (x) {
    return x[0] == "return";
  },

  //free: set
  //e: env(= [locals, frees])
  //next: opc
  //ret: opc["refer_*", n, ["argument",
  //          ["refer_*", n, ... ["argument", next]
  collect_free: function (free, e, next) {
    var vars = free;
    var opc = next;
    var arr = vars.arr;
    for (var i = 0; i < arr.length; i++) {
      opc = this.compile_refer(arr[i], e, ["argument", opc]);
    }
    //Console.puts("collect_free "+free.inspect()+" / "+e.inspect()+" => "+opc.inspect());
    return opc;
  },

  //x: Symbol
  //e: env [set of locals, set of frees]
  //ret: opc
  compile_refer: function (x, e, next) {
    return this.compile_lookup(
      x,
      e,
      function (n) {
        return ["refer-local", n, next];
      },
      function (n) {
        return ["refer-free", n, next];
      },
      function (sym) {
        return ["refer-global", sym, next];
      }
    );
  },

  compile_lookup: function (x, e, return_local, return_free, return_global) {
    var locals = e[0],
      free = e[1];
    var n;
    if ((n = locals.index(x)) != null) {
      //Console.puts("compile_refer:"+x.inspect()+" in "+e.inspect()+" results refer-local "+n);
      return return_local(n);
    } else if ((n = free.index(x)) != null) {
      //Console.puts("compile_refer:"+x.inspect()+" in "+e.inspect()+" results refer-free "+n);
      return return_free(n);
    } else {
      var sym = x.name;
      return return_global(sym);
    }
    //throw new BiwaError("undefined symbol `" + sym + "'");
  },

  //generate boxing code (intersection of sets & vars)
  //if no need of boxing, just returns next
  //  sets(Set): assigned variables
  //  vars(List): used variables
  //  next(opc):
  //  ret(opc):
  make_boxes: function (sets, vars, next) {
    var vars = vars;
    var n = 0;
    var a = [];
    while (vars instanceof Pair) {
      if (sets.member(vars.car)) a.push(n);
      n++;
      vars = vars.cdr;
    }
    var opc = next;
    for (var i = a.length - 1; i >= 0; i--) opc = ["box", a[i], opc];
    return opc;
  },

  // Enumerate variables which (could be assigned && included in v)
  // x: exp
  // v: set(vars)
  // ret: set
  find_sets: function (x, v) {
    //Console.puts("find_sets: " + to_write(x) + " " + to_write(v))
    var ret = null;
    if (x instanceof BiwaSymbol) {
      ret = new BiwaSet();
    } else if (x instanceof Pair) {
      switch (x.first()) {
        case Sym("define"):
          var exp = x.third();
          ret = this.find_sets(exp, v);
        case Sym("begin"):
          ret = this.find_sets(x.cdr, v); //(ignores improper list)
          break;
        case Sym("quote"):
          ret = new BiwaSet();
          break;
        case Sym("lambda"):
          var vars = x.second(),
            body = x.cdr.cdr;
          if (vars instanceof Pair) {
            // (lambda (...) ...)
            ret = this.find_sets(body, v.set_minus(vars.to_set()));
          } else {
            // (lambda args ...)
            ret = this.find_sets(body, v.set_minus(new BiwaSet(vars)));
          }
          break;
        case Sym("if"):
          var testc = x.second(),
            thenc = x.third(),
            elsec = x.fourth();
          ret = this.find_sets(testc, v).set_union(
            this.find_sets(thenc, v),
            this.find_sets(elsec, v)
          );
          break;
        case Sym("set!"):
          var vari = x.second(),
            xx = x.third();
          if (v.member(vari)) ret = this.find_sets(xx, v).set_cons(vari);
          else ret = this.find_sets(xx, v);
          break;
        case Sym("call/cc"):
          var exp = x.second();
          ret = this.find_sets(exp, v);
          break;
        default:
          var set = new BiwaSet();
          for (var p = x; p instanceof Pair; p = p.cdr) {
            set = set.set_union(this.find_sets(p.car, v));
          }
          ret = set;
          break;
      }
    } else {
      ret = new BiwaSet();
    }

    if (ret == null) throw new Bug("find_sets() exited in unusual way");
    else return ret;
  },

  // find_free(): find free variables in x
  //              these variables are collected by collect_free().
  // x: expression
  // b: set of local vars (= variables which are not free)
  // f: set of free var candidates
  //    (local vars of outer lambdas)
  // ret: set of free vars
  find_free: function (x, b, f) {
    var ret = null;
    if (x instanceof BiwaSymbol) {
      if (f.member(x)) ret = new BiwaSet(x);
      else ret = new BiwaSet();
    } else if (x instanceof Pair) {
      switch (x.first()) {
        case Sym("define"):
          var exp = x.third();
          ret = this.find_free(exp, b, f);
          break;
        case Sym("begin"):
          ret = this.find_free(x.cdr, b, f); //(ignores improper list)
          break;
        case Sym("quote"):
          ret = new BiwaSet();
          break;
        case Sym("lambda"):
          var vars = x.second(),
            body = x.cdr.cdr;
          if (vars instanceof Pair) {
            // (lambda (...) ...)
            ret = this.find_free(body, b.set_union(vars.to_set()), f);
          } else {
            // (lambda args ...)
            ret = this.find_free(body, b.set_cons(vars), f);
          }
          break;
        case Sym("if"):
          var testc = x.second(),
            thenc = x.third(),
            elsec = x.fourth();
          ret = this.find_free(testc, b, f).set_union(
            this.find_free(thenc, b, f),
            this.find_free(elsec, b, f)
          );
          break;
        case Sym("set!"):
          var vari = x.second(),
            exp = x.third();
          if (f.member(vari)) ret = this.find_free(exp, b, f).set_cons(vari);
          else ret = this.find_free(exp, b, f);
          break;
        case Sym("call/cc"):
          var exp = x.second();
          ret = this.find_free(exp, b, f);
          break;
        default:
          var set = new BiwaSet();
          for (var p = x; p instanceof Pair; p = p.cdr) {
            set = set.set_union(this.find_free(p.car, b, f));
          }
          ret = set;
          break;
      }
    } else {
      ret = new BiwaSet();
    }
    //Console.p("find_free "+x.inspect()+" / "+b.inspect()+" => "+ret.inspect());

    if (ret == null) throw new Bug("find_free() exited in unusual way");
    else return ret;
  },

  // Returns the position of the dot pair.
  // Returns -1 if x is a proper list.
  //
  // eg. (a b . c) -> 2
  find_dot_pos: function (x) {
    var idx = 0;
    for (; x instanceof Pair; x = x.cdr, ++idx);
    if (x != nil) {
      return idx;
    } else {
      return -1;
    }
  },

  last_pair: function (x) {
    if (x instanceof Pair) {
      for (; x.cdr instanceof Pair; x = x.cdr);
    }
    return x;
  },

  // Takes an dotted list and returns proper list.
  //
  // eg. (x y . z) -> (x y z)
  dotted2proper: function (ls) {
    if (ls === nil) return nil;

    var nreverse = function (ls) {
      var res = nil;
      for (; ls instanceof Pair; ) {
        var d = ls.cdr;
        ls.cdr = res;
        res = ls;
        ls = d;
      }
      return res;
    };
    var copy_list = function (ls) {
      var res = nil;
      for (; ls instanceof Pair; ls = ls.cdr) {
        res = new Pair(ls.car, res);
      }
      return nreverse(res);
    };

    if (ls instanceof Pair) {
      var last = this.last_pair(ls);
      if (last instanceof Pair && last.cdr === nil) {
        return ls;
      } else {
        var copied = copy_list(ls);
        this.last_pair(copied).cdr = new Pair(last.cdr, nil);
        return copied;
      }
    } else {
      return new Pair(ls, nil);
    }
  },

  // x: exp(list of symbol or integer or..)
  // e: env (= [locals, frees])
  // s: vars might be set!
  // next: opc
  // ret: opc
  compile: function (x, e, s, f, next) {
    //Console.p(x);
    var ret = null;

    while (1) {
      if (x instanceof BiwaSymbol) {
        // Variable reference
        // compiled into refer-(local|free|global)
        return this.compile_refer(
          x,
          e,
          s.member(x) ? ["indirect", next] : next
        );
      } else if (x instanceof Pair) {
        switch (x.first()) {
          case Sym("define"):
            ret = this._compile_define(x, next);

            x = ret[0];
            next = ret[1];
            break;

          case Sym("begin"):
            var a = [];
            for (var p = x.cdr; p instanceof Pair; p = p.cdr) a.push(p.car);

            //compile each expression (in reverse order)
            var c = next;
            for (var i = a.length - 1; i >= 0; i--) {
              c = this.compile(a[i], e, s, f, c);
            }
            return c;

          case Sym("quote"):
            if (x.length() < 2)
              throw new BiwaError("Invalid quote: " + x.to_write());

            var obj = x.second();
            return ["constant", obj, next];

          case Sym("lambda"):
            return this._compile_lambda(x, e, s, f, next);

          case Sym("if"):
            if (x.length() < 3 || x.length() > 4)
              throw new BiwaError("Invalid if: " + x.to_write());

            var testc = x.second(),
              thenc = x.third(),
              elsec = x.fourth();
            var thenc = this.compile(thenc, e, s, f, next);
            var elsec = this.compile(elsec, e, s, f, next);
            x = testc;
            next = ["test", thenc, elsec];
            break;

          case Sym("set!"):
            // error-checking: should have only 3 things
            if (x.length() != 3)
              throw new BiwaError("Invalid set!: " + x.to_write());

            var v = x.second(),
              x = x.third();
            var do_assign = this.compile_lookup(
              v,
              e,
              function (n) {
                return ["assign-local", n, next];
              },
              function (n) {
                return ["assign-free", n, next];
              },
              function (sym) {
                return ["assign-global", sym, next];
              }
            );
            next = do_assign;
            break;

          case Sym("call/cc"):
            var x = x.second();
            var arity_of_arg = 1; // Always 1. (lambda (cc) ...)
            var c = [
              "conti",
              this.is_tail(next) ? e[0].size() + 1 : 0, //number of args for outer lambda
              [
                "argument", // Push the continuaion closure onto the stack
                [
                  "constant",
                  arity_of_arg,
                  [
                    "argument",
                    this.compile(
                      x,
                      e,
                      s,
                      f,
                      this.is_tail(next)
                        ? ["shift", arity_of_arg, ["tco_hinted_apply"]]
                        : ["apply"]
                    ),
                  ],
                ],
              ],
            ];

            // Do not push stack frame when call/cc is in a tail context
            return this.is_tail(next) ? c : ["frame", c, next];

          default:
            //apply
            //x = (func 1 2)
            //x.car = func = '(lambda (x) ..) or Symbol
            //x.cdr = args = '(1 2)
            var func = x.car;
            var args = x.cdr;
            var c = this.compile(
              func,
              e,
              s,
              f,
              this.is_tail(next)
                ? ["shift", args.length(), ["tco_hinted_apply"]]
                : ["apply"]
            );

            // VM will push the number of arguments to the stack.
            c = this.compile(args.length(), e, s, f, ["argument", c]);
            for (var p = args; p instanceof Pair; p = p.cdr) {
              c = this.compile(p.car, e, s, f, ["argument", c]);
            }

            // Do not push stack frame for tail calls
            return this.is_tail(next) ? c : ["frame", c, next];
        }
      } else {
        return ["constant", x, next];
      }
    }
    //Console.p("result of " + x.inspect() + ":");
    //Console.p(ret);
    //dump({"ret":ret, "x":x, "e":e, "s":s, "next":next, "stack":[]});
    //      if(ret == null)
    //        throw new Bug("compile() exited in unusual way");
    //      else
    //        return ret;
  },

  // Compile define.
  //
  // 0. (define) ; => error
  // 1. (define a)
  // 2. (define a 1)
  // 3. (define a 1 2) ; => error
  // 4. (define (f x) x), (define (f . a) a)
  // 5. (define 1 2)
  //
  // Note: define may appear in lambda, let, let*, let-values,
  // let*-values, letrec, letrec*. These definitions are local to the
  // <body> of these forms.
  _compile_define: function (x, next) {
    if (x.length() == 1) {
      // 0. (define)
      throw new BiwaError("Invalid `define': " + x.to_write());
    }

    var first = x.cdr.car;
    var rest = x.cdr.cdr;

    if (first instanceof BiwaSymbol) {
      if (rest === nil) {
        // 1. (define a)
        x = undef;
      } else {
        if (rest.cdr === nil)
          // 2. (define a 1)
          x = rest.car;
        // 3. (define a 1 2)
        else throw new BiwaError("Invalid `define': " + x.to_write());
      }

      if (!TopEnv.hasOwnProperty(first.name)) {
        TopEnv[first.name] = undef;
      }
      next = ["assign-global", first.name, next];
    } else if (first instanceof Pair) {
      // 4. (define (f x) ...)
      // Note: define of this form may contain internal define.
      // They are handled in compilation of "lambda".

      var fname = first.car,
        args = first.cdr;
      var lambda = new Pair(Sym("lambda"), new Pair(args, rest));
      x = lambda;
      if (!TopEnv.hasOwnProperty(first.name)) {
        TopEnv[fname.name] = undef;
      }
      next = ["assign-global", fname.name, next];
    } else {
      // 5. (define 1 2)
      throw new BiwaError("define: symbol or pair expected but got " + first);
    }

    return [x, next];
  },

  // Compiles various forms of "lambda".
  //
  // * (lambda (x y) ...)
  // * (lambda (x y . rest) ...)
  // * (lambda args ...)
  _compile_lambda: function (x, e, s, f, next) {
    if (x.length() < 3) throw new BiwaError("Invalid lambda: " + x.to_write());

    var vars = x.cdr.car;
    var body = x.cdr.cdr;

    // Handle internal defines
    var tbody = Compiler.transform_internal_define(body);
    if (isPair(tbody) && isSymbol$1(tbody.car) && tbody.car.name == "letrec*") {
      // The body has internal defines.
      // Expand letrec* macro
      var cbody = Compiler.expand(tbody);
    } else {
      // The body has no internal defines.
      // Just wrap the list with begin
      var cbody = new Pair(Sym("begin"), x.cdr.cdr);
    }

    var dotpos = this.find_dot_pos(vars);
    var proper = this.dotted2proper(vars);
    var free = this.find_free(cbody, proper.to_set(), f); //free variables
    var sets = this.find_sets(cbody, proper.to_set()); //local variables

    var do_body = this.compile(
      cbody,
      [proper.to_set(), free],
      sets.set_union(s.set_intersect(free)),
      f.set_union(proper.to_set()),
      ["return"]
    );
    var do_close = [
      "close",
      vars instanceof Pair ? vars.length() : 0,
      free.size(),
      this.make_boxes(sets, proper, do_body),
      next,
      dotpos,
    ];
    return this.collect_free(free, e, do_close);
  },

  run: function (expr) {
    const opc = this.compile(
      expr,
      [new BiwaSet(), new BiwaSet()],
      new BiwaSet(),
      new BiwaSet(),
      ["halt"]
    );
    return new VMCode(opc);
  },
});

// Compile an expression with new compiler
Compiler.compile = function (expr, next) {
  expr = Compiler.expand(expr);
  return new Compiler().run(expr, next);
};

// Expand macro calls in a expression recursively.
//
// x - expression
// flag - used internally. do not specify this
//
// @throws {BiwaError} when x has syntax error
Compiler.expand = function (x, flag /*optional*/) {
  var expand = Compiler.expand;
  flag || (flag = {});
  var ret = null;

  if (x instanceof Pair) {
    switch (x.car) {
      case Sym("define"):
        var left = x.cdr.car,
          exp = x.cdr.cdr;
        ret = new Pair(Sym("define"), new Pair(left, expand(exp, flag)));
        break;
      case Sym("begin"):
        ret = new Pair(Sym("begin"), expand(x.cdr, flag));
        break;
      case Sym("quote"):
        ret = x;
        break;
      case Sym("lambda"):
        var vars = x.cdr.car,
          body = x.cdr.cdr;
        ret = new Pair(Sym("lambda"), new Pair(vars, expand(body, flag)));
        break;
      case Sym("if"):
        var testc = x.second(),
          thenc = x.third(),
          elsec = x.fourth();
        ret = List(
          Sym("if"),
          expand(testc, flag),
          expand(thenc, flag),
          expand(elsec, flag)
        );
        break;
      case Sym("set!"):
        var v = x.second(),
          x = x.third();
        ret = List(Sym("set!"), v, expand(x, flag));
        break;
      case Sym("call-with-current-continuation"):
      case Sym("call/cc"):
        var x = x.second();
        ret = List(Sym("call/cc"), expand(x, flag));
        break;
      default:
        //apply
        var transformer = null;
        if (isSymbol$1(x.car)) {
          if (TopEnv[x.car.name] instanceof Syntax)
            transformer = TopEnv[x.car.name];
          else if (CoreEnv[x.car.name] instanceof Syntax)
            transformer = CoreEnv[x.car.name];
        }

        if (transformer) {
          flag["modified"] = true;
          ret = transformer.transform(x);

          //            // Debug
          //            var before = to_write(x);
          //            var after = to_write(ret);
          //            if(before != after){
          //              console.log("before: " + before)
          //              console.log("expand: " + after)
          //            }

          var fl;
          for (;;) {
            ret = expand(ret, (fl = {}));
            if (!fl["modified"]) break;
          }
        } else {
          var expanded_car = expand(x.car, flag);
          var expanded_cdr;
          if (!(x.cdr instanceof Pair) && x.cdr !== nil) {
            throw new BiwaError(
              "proper list required for function application " +
                "or macro use: " +
                to_write(x)
            );
          }
          expanded_cdr = array_to_list(
            x.cdr.to_array().map(function (item) {
              return expand(item, flag);
            })
          );
          ret = new Pair(expanded_car, expanded_cdr);
        }
    }
  } else {
    ret = x;
  }
  return ret;
};

// Transform internal defines to letrec*.
//
// Example
//   (let ((a 1))
//     (define (b) a)
//     (b))
//
//   (let ((a 1))
//     (letrec* ((b (lambda () a)))
//       (b)))
//
// x - expression starts with (define ...)
//
// Returns a letrec* expression, or
// just returns x, when x does not contain definitions.

// Returns true if x is a definition
var is_definition = function (x) {
  return isPair(x) && Sym("define") === x.car;
  // TODO: support "begin", nested "begin", "let(rec)-syntax"
};

// Convert function definition to lambda binding
//   (define a ..)         -> (a ..)
//   (define (f) ..)       -> (f (lambda () ..))
//   (define (f x . y) ..) -> (f (lambda (x . y) ..))
//   (define (f . a) ..)   -> (f (lambda a ..))
var define_to_lambda_bind = function (def) {
  var sig = def.cdr.car;
  var body = def.cdr.cdr;

  if (isSymbol$1(sig)) {
    var variable = sig;

    return new Pair(variable, body);
  } else {
    var variable = sig.car;
    var value = new Pair(Sym("lambda"), new Pair(sig.cdr, body));

    return List(variable, value);
  }
};

Compiler.transform_internal_define = function (x) {
  // 1. Split x into definitions and expressions
  var defs = [],
    item = x;
  while (is_definition(item.car)) {
    defs.push(item.car);
    item = item.cdr;
  }
  var exprs = item;

  // 2. Return x if there is no definitions
  if (defs.length == 0) return x;

  // 3. Return (letrec* <bindings> <expressions>)
  var bindings = List.apply(null, map(defs, define_to_lambda_bind));
  return new Pair(Sym("letrec*"), new Pair(bindings, exprs));
};

//
// assertions - type checks
//

const make_assert = function (check) {
  return function (/*args*/) {
    // We cannot use callee/caller in ESM (=JS strict mode)
    //var fname = arguments.callee.caller
    //              ? arguments.callee.caller.fname
    //              : "";
    const fname = "";
    check.apply(this, [fname].concat(toArray(arguments)));
  };
};

const make_simple_assert = function (type, test, _fname) {
  return make_assert(function (fname, obj, opt) {
    const option = opt ? "(" + opt + "): " : "";
    if (!test(obj)) {
      throw new BiwaError(
        option + type + " required, but got " + to_write$1(obj)
      );
    }
  });
};

//
// Hashtable
//
// TODO: Reimplement with JavaScript Map
//
// Based on the base JavaScript Object class, but
//  * Object takes only strings as keys
//  * R6RS hashtable needs its own hash function
// so some hacks are needed.

const Hashtable = Class.create({
  initialize: function (_hash_proc, _equiv_proc, mutable) {
    this.mutable = mutable === undefined ? true : mutable ? true : false;

    this.hash_proc = _hash_proc;
    this.equiv_proc = _equiv_proc;

    // Hash (hashed) => (array of (key and value))
    this.pairs_of = {};
  },

  clear: function () {
    this.pairs_of = {};
  },

  candidate_pairs: function (hashed) {
    return this.pairs_of[hashed];
  },

  add_pair: function (hashed, key, value) {
    var pairs = this.pairs_of[hashed];

    if (pairs) {
      pairs.push([key, value]);
    } else {
      this.pairs_of[hashed] = [[key, value]];
    }
  },

  remove_pair: function (hashed, pair) {
    var pairs = this.pairs_of[hashed];
    var i = pairs.indexOf(pair);
    if (i == -1) {
      throw new Bug("Hashtable#remove_pair: pair not found!");
    } else {
      pairs.splice(i, 1); //remove 1 element from i-th index
    }
  },

  create_copy: function (mutable) {
    var copy = new Hashtable(this.hash_proc, this.equiv_proc, mutable);
    // clone the pairs to copy
    each(
      keys(this.pairs_of),
      bind(function (hashed) {
        var pairs = this.pairs_of[hashed];
        var cloned = map(pairs, function (pair) {
          return clone(pair);
        });
        copy.pairs_of[hashed] = cloned;
      }, this)
    );

    return copy;
  },

  size: function () {
    var n = 0;
    this._apply_pair(function (pair) {
      n++;
    });
    return n;
  },

  keys: function () {
    return this._apply_pair(function (pair) {
      return pair[0];
    });
  },

  values: function () {
    return this._apply_pair(function (pair) {
      return pair[1];
    });
  },

  _apply_pair: function (func) {
    var a = [];
    each(values(this.pairs_of), function (pairs) {
      each(pairs, function (pair) {
        a.push(func(pair));
      });
    });
    return a;
  },

  to_write: function () {
    return "#<Hashtable size=" + this.size() + ">";
  },
});

const isHashtable = function (obj) {
  return obj instanceof Hashtable;
};

const isMutableHashtable = function (obj) {
  return obj instanceof Hashtable && obj.mutable;
};

//
// Hash functions
//

Hashtable.equal_hash = function (ar) {
  return to_write$1(ar[0]);
};
Hashtable.eq_hash = Hashtable.equal_hash;
Hashtable.eqv_hash = Hashtable.equal_hash;

Hashtable.string_hash = function (ar) {
  return ar[0];
};

Hashtable.string_ci_hash = function (ar) {
  return isString(ar[0]) ? ar[0].toLowerCase() : ar[0];
};

Hashtable.symbol_hash = function (ar) {
  return ar[0] instanceof BiwaSymbol ? ar[0].name : ar[0];
};

//
// Equivalence functions
//

Hashtable.eq_equiv = function (ar) {
  return eq$1(ar[0], ar[1]);
};

Hashtable.eqv_equiv = function (ar) {
  return eqv(ar[0], ar[1]);
};

//
// Parser
// copied from jsScheme - should be rewrriten (support #0=, etc)
//
const Parser = Class.create({
  initialize: function (txt) {
    this.tokens = this.tokenize(txt);
    this.i = 0;
  },

  // Inject scheme program into current position
  insert: function (txt) {
    this.tokens.splice(this.i, 0, ...this.tokenize(txt));
  },

  inspect: function () {
    return [
      "#<Parser:",
      this.i,
      "/",
      this.tokens.length,
      " ",
      inspect(this.tokens),
      ">",
    ].join("");
  },

  tokenize: function (txt) {
    var tokens = new Array(),
      oldTxt = null;
    var in_srfi_30_comment = 0;

    while (txt != "" && oldTxt != txt) {
      oldTxt = txt;
      txt = txt.replace(
        /^\s*(;[^\r\n]*(\r|\n|$)|#;|#\||#\\[^\w]|#?(\(|\[|{)|\)|\]|}|\'|`|,@|,|\+inf\.0|-inf\.0|\+nan\.0|\"(\\(.|$)|[^\"\\])*(\"|$)|[^\s()\[\]{}]+)/,
        function ($0, $1) {
          var t = $1;

          if (t == "#|") {
            in_srfi_30_comment++;
            return "";
          } else if (in_srfi_30_comment > 0) {
            if (/(.*\|#)/.test(t)) {
              in_srfi_30_comment--;
              if (in_srfi_30_comment < 0) {
                throw new BiwaError("Found an extra comment terminator: `|#'");
              }
              // Push back the rest substring to input stream.
              return t.substring(RegExp.$1.length, t.length);
            } else {
              return "";
            }
          } else {
            if (t.charAt(0) != ";") tokens[tokens.length] = t;
            return "";
          }
        }
      );
    }
    return tokens;
  },

  sexpCommentMarker: new Object(),
  getObject: function () {
    var r = this.getObject0();

    if (r != this.sexpCommentMarker) return r;

    r = this.getObject();
    if (r == Parser.EOS)
      throw new BiwaError(
        "Readable object not found after S exression comment"
      );

    r = this.getObject();
    return r;
  },

  getList: function (close) {
    var list = nil,
      prev = list;
    while (this.i < this.tokens.length) {
      this.eatObjectsInSexpComment(
        "Input stream terminated unexpectedly(in list)"
      );

      if (
        this.tokens[this.i] == ")" ||
        this.tokens[this.i] == "]" ||
        this.tokens[this.i] == "}"
      ) {
        this.i++;
        break;
      }

      if (this.tokens[this.i] == ".") {
        this.i++;
        var o = this.getObject();
        if (o != Parser.EOS && list != nil) {
          prev.cdr = o;
        }
      } else {
        var cur = new Pair(this.getObject(), nil);
        if (list == nil) list = cur;
        else prev.cdr = cur;
        prev = cur;
      }
    }
    return list;
  },

  getVector: function (close) {
    var arr = new Array();
    while (this.i < this.tokens.length) {
      this.eatObjectsInSexpComment(
        "Input stream terminated unexpectedly(in vector)"
      );

      if (
        this.tokens[this.i] == ")" ||
        this.tokens[this.i] == "]" ||
        this.tokens[this.i] == "}"
      ) {
        this.i++;
        break;
      }
      arr[arr.length] = this.getObject();
    }
    return arr;
  },

  eatObjectsInSexpComment: function (err_msg) {
    while (this.tokens[this.i] == "#;") {
      this.i++;
      if (this.getObject() == Parser.EOS || this.i >= this.tokens.length)
        throw new BiwaError(err_msg);
    }
  },

  getObject0: function () {
    if (this.i >= this.tokens.length) return Parser.EOS;

    var t = this.tokens[this.i++];
    // if( t == ')' ) return null;

    if (t == "#;") return this.sexpCommentMarker;

    var s =
      t == "'"
        ? "quote"
        : t == "`"
        ? "quasiquote"
        : t == ","
        ? "unquote"
        : t == ",@"
        ? "unquote-splicing"
        : false;

    if (
      s ||
      t == "(" ||
      t == "#(" ||
      t == "[" ||
      t == "#[" ||
      t == "{" ||
      t == "#{"
    ) {
      return s
        ? new Pair(Sym(s), new Pair(this.getObject(), nil))
        : t == "(" || t == "[" || t == "{"
        ? this.getList(t)
        : this.getVector(t);
    } else {
      switch (t) {
        case "+inf.0":
          return Infinity;
        case "-inf.0":
          return -Infinity;
        case "+nan.0":
          return NaN;
      }

      var n;
      if (/^#x[0-9a-z]+$/i.test(t)) {
        // #x... Hex
        n = new Number("0x" + t.substring(2, t.length));
      } else if (/^#d[0-9\.]+$/i.test(t)) {
        // #d... Decimal
        n = new Number(t.substring(2, t.length));
      } else {
        n = new Number(t); // use constrictor as parser
      }

      if (!isNaN(n)) {
        return n.valueOf();
      } else if (t == "#f" || t == "#F") {
        return false;
      } else if (t == "#t" || t == "#T") {
        return true;
      } else if (t.toLowerCase() == "#\\newline") {
        return Char.get("\n");
      } else if (t.toLowerCase() == "#\\space") {
        return Char.get(" ");
      } else if (t.toLowerCase() == "#\\tab") {
        return Char.get("\t");
      } else if (/^#\\.$/.test(t)) {
        return Char.get(t.charAt(2));
      } else if (/^#\\x[a-zA-Z0-9]+$/.test(t)) {
        var scalar = parseInt(t.slice(3), 16);
        // R6RS 11.11 (surrogate codepoints)
        if (scalar >= 0xd800 && scalar <= 0xdfff) {
          throw new BiwaError("Character in Unicode excluded range.");
        }
        // ECMA-262 4.3.16 -- Basically, strings are sequences of 16-bit
        // unsigned integers, so anything greater than 0xFFFF won't fit.
        // NOTE: This violates R6RS which requires the full Unicode range!
        else if (scalar > 0xffff) {
          throw new BiwaError("Character literal out of range.");
        } else {
          return Char.get(String.fromCharCode(scalar));
        }
      } else if (/^\"(\\(.|$)|[^\"\\])*\"?$/.test(t)) {
        return t
          .replace(/(\r?\n|\\n)/g, "\n")
          .replace(/^\"|\\(.|$)|\"$/g, function ($0, $1) {
            return $1 ? $1 : "";
          });
      } else return Sym(t); // 2Do: validate !!
    }
  },
});
// indicates end of source file
Parser.EOS = new Object();

// Parser the text and return an array of exprs
Parser.parse = (txt) => {
  const parser = new Parser(txt);
  const ret = [];
  while (true) {
    var expr = parser.getObject();
    if (expr === Parser.EOS) break;
    ret.push(expr);
  }
  return ret;
};

///
/// Interpreter
///

const Interpreter = Class.create({
  // new Interpreter()
  // new Interpreter(lastInterpreter)
  // new Interpreter(errorHandler)
  // new Interpreter(lastInterpreter, errorHandler)
  initialize: function () {
    var last_interpreter = null;
    var on_error = null;
    if (arguments.length == 2) {
      last_interpreter = arguments[0];
      on_error = arguments[1];
    } else if (arguments.length == 1 && arguments[0] instanceof Interpreter) {
      last_interpreter = arguments[0];
    } else if (arguments.length == 1 && typeof arguments[0] == "function") {
      on_error = arguments[0];
    }

    // Interpreter stack
    this.stack = [];
    // JS function to handle error
    this.on_error =
      on_error ||
      (last_interpreter ? last_interpreter.on_error : function (e) {});
    // JS function to handle result
    this.after_evaluate = function () {};

    // (Variables for stack trace)
    // Name of the last variable read by refer-xx
    this.last_refer = last_interpreter ? last_interpreter.last_refer : null;
    // Call stack (array of last_refer)
    this.call_stack = last_interpreter
      ? clone(last_interpreter.call_stack)
      : [];
    // Counts number of tail calls (= how many times should we pop call_stack
    // in op_return)
    this.tco_counter = [];
    // Maximum length of call_stack
    // (Note: we should cap call_stack for inifinite loop with recursion)
    this.max_trace_size = last_interpreter
      ? last_interpreter.max_trace_size
      : max_trace_size;

    // dynamic-wind
    this.current_dynamic_winder = Interpreter.DynamicWind.ROOT;
  },

  inspect: function () {
    return [
      "#<Interpreter: stack size=>",
      this.stack.length,
      " ",
      "after_evaluate=",
      inspect(this.after_evaluate),
      ">",
    ].join("");
  },

  // private
  push: function (x, s) {
    this.stack[s] = x;
    return s + 1;
  },

  // private
  //s: depth of stack to save
  //ret: saved(copied) stack
  save_stack: function (s) {
    var v = [];
    for (var i = 0; i < s; i++) {
      v[i] = this.stack[i];
    }
    return {
      stack: v,
      last_refer: this.last_refer,
      call_stack: clone(this.call_stack),
      tco_counter: clone(this.tco_counter),
    };
  },

  // private
  //v: stack array to restore
  //ret: lenght of restored stack
  restore_stack: function (stuff) {
    const v = stuff.stack;
    const s = v.length;
    for (var i = 0; i < s; i++) {
      this.stack[i] = v[i];
    }
    this.last_refer = stuff.last_refer;
    this.call_stack = clone(stuff.call_stack);
    this.tco_counter = clone(stuff.tco_counter);
    return s;
  },

  // private
  //s: depth of stack to save
  //n: number of args(for outer lambda) to remove (= 0 unless tail position)
  //ret: closure array
  capture_continuation: function (s, n) {
    // note: implementation of this function for final version doesn't exist in 3imp.pdf..
    var ss = this.push(n, s);
    return this.closure(
      ["nuate1", this.save_stack(ss), this.current_dynamic_winder],
      1, //arity
      0, //n (number of frees)
      null, //s (stack position to get frees)
      -1
    ); // dotpos
  },

  // private
  // shift stack
  // n: number of items to skip (from stack top)
  // m: number of items to shift
  // s: stack pointer (= index of stack top + 1)
  shift_args: function (n, m, s) {
    for (var i = n; i >= 0; i--) {
      this.index_set(s, i + m + 1, this.index(s, i));
    }
    return s - m - 1;
  },

  index: function (s, i) {
    return this.stack[s - 1 - i];
  },

  // private
  index_set: function (s, i, v) {
    this.stack[s - 1 - i] = v;
  },

  // private
  closure: function (body, n_args, n, s, dotpos) {
    const freevars = [];
    for (var i = 0; i < n; i++) {
      freevars[i] = this.index(s, i);
    }
    const expected_args = dotpos == -1 ? n_args : undefined;
    return new Closure(body, freevars, dotpos, expected_args);
  },

  // private
  run_dump_hook: function (a, x, f, c, s) {
    var dumper;
    var state;

    if (this.dumper) {
      dumper = this.dumper;
    } else if (Interpreter.dumper) {
      dumper = Interpreter.dumper;
    } else return;

    if (dumper) {
      state = { a: a, f: f, c: c, s: s, x: x, stack: this.stack };
      dumper.dump(state);
    }
  },

  // private
  // a: arbitary object (temporary register)
  // x: opecode
  // f: integer
  // c: BiwaScheme.Closure
  // s: integer
  _execute: function (a, x, f, c, s) {
    var ret = null;
    //Console.puts("executing "+x[0]);

    while (true) {
      //x[0] != "halt"){
      this.run_dump_hook(a, x, f, c, s);

      switch (x[0]) {
        case "halt":
          return a;
        case "refer-local":
          var n = x[1],
            x = x[2];
          a = this.index(f, n + 1);
          this.last_refer = "(anon)";
          break;
        case "refer-free":
          var n = x[1],
            x = x[2];
          a = c.freevars[n];
          this.last_refer = "(anon)";
          break;
        case "refer-global":
          var sym = x[1],
            x = x[2];
          if (TopEnv.hasOwnProperty(sym)) var val = TopEnv[sym];
          else if (CoreEnv.hasOwnProperty(sym)) var val = CoreEnv[sym];
          else throw new BiwaError("execute: unbound symbol: " + inspect(sym));

          a = val;
          this.last_refer = sym || "(anon)";
          break;
        case "indirect":
          var x = x[1];
          a = a[0]; //unboxing
          break;
        case "constant":
          var obj = x[1],
            x = x[2];
          a = obj;
          this.last_refer = "(anon)";
          break;
        case "close":
          var ox = x;
          var v = ox[1],
            n = ox[2],
            body = ox[3],
            x = ox[4],
            dotpos = ox[5];
          a = this.closure(body, v, n, s, dotpos);
          s -= n;
          break;
        case "box":
          var n = x[1],
            x = x[2];
          this.index_set(s, n + 1, [this.index(s, n + 1)]); //boxing
          break;
        case "test":
          var thenc = x[1],
            elsec = x[2];
          x = a !== false ? thenc : elsec;
          break;
        case "assign-global":
          var name = x[1],
            x = x[2];
          if (!TopEnv.hasOwnProperty(name) && !CoreEnv.hasOwnProperty(name))
            throw new BiwaError(
              "global variable '" + name + "' is not defined"
            );

          TopEnv[name] = a;
          a = undef;
          break;
        case "assign-local":
          var n = x[1],
            x = x[2];
          var box = this.index(f, n + 1);
          box[0] = a;
          a = undef;
          break;
        case "assign-free":
          var n = x[1],
            x = x[2];
          var box = c.freevars[n];
          box[0] = a;
          a = undef;
          break;
        case "conti":
          var n = x[1],
            x = x[2];
          a = this.capture_continuation(s, n);
          break;
        case "nuate1":
          var stack = x[1],
            to = x[2];
          var from = this.current_dynamic_winder;
          var winders = Interpreter.DynamicWind.listWinders(from, to);
          x = Interpreter.DynamicWind.joinWinders(winders, [
            "refer-local",
            0,
            ["nuate2", stack],
          ]);
          break;
        case "nuate2":
          var stack = x[1],
            x = ["return"];
          s = this.restore_stack(stack);
          break;
        case "frame":
          var ret = x[2];
          x = x[1];
          s = this.push(ret, this.push(f, this.push(c, s)));
          this.tco_counter[this.tco_counter.length] = 0;
          break;
        case "argument":
          var x = x[1];
          s = this.push(a, s);
          break;
        case "shift":
          var n = x[1],
            x = x[2];

          // the number of arguments in the last call
          var n_args = this.index(s, n + 1);

          s = this.shift_args(n, n_args, s);
          break;
        case "tco_hinted_apply": // just like a regular apply, except we need to trace the # of TCO calls so we can generate a stacktrace
          this.tco_counter[this.tco_counter.length - 1]++;
          x = ["apply"].concat(rest(x));
          break;
        case "apply": //extended: n_args as second argument
          var func = a; //, n_args = x[1];

          // Save stack trace
          this.call_stack.push(this.last_refer);
          if (this.call_stack.length > this.max_trace_size) {
            // Remove old memory if it grows too long
            // Note: this simple way may be inconvenient (e.g. no trace
            // will be shown when an error occurred right after returning
            // from a large function)
            this.call_stack.shift();
          }

          // the number of arguments in the last call is
          // pushed to the stack.
          var n_args = this.index(s, 0);
          if (isClosure(func)) {
            a = func;
            x = func.body;

            // The position of dot in the parameter list.
            const dotpos = func.dotpos;
            if (dotpos >= 0) {
              // The dot is found
              // ----------------
              // => Process the &rest args: packing the rest args into a list.
              var ls = nil;
              for (var i = n_args; --i >= dotpos; ) {
                ls = new Pair(this.index(s, i + 1), ls);
              }
              if (dotpos >= n_args) {
                // No rest argument is passed to this closure.
                // However, the closure expects the caller passes the rest argument.
                // In such case this VM prepares an empty list as the rest argument.
                // --------------------------------------------------------------
                // => We extend the stack to put the empty list.
                for (var i = 0; i < n_args + 1; i++) {
                  this.index_set(s, i - 1, this.index(s, i));
                }
                s++;
                // => Update the number of arguments
                this.index_set(s, 0, this.index(s, 0) + 1);
              }
              this.index_set(s, dotpos + 1, ls);
            } else {
              // the dot is not found
              // --------------------
              // => Verify that number of arguments = expected number of arguments
              // (if the closure knows how many it wants)
              if (
                func.expected_args !== undefined &&
                n_args != func.expected_args
              ) {
                var errMsg =
                  "Function call error: got " +
                  n_args +
                  " but wanted " +
                  func.expected_args;
                throw new BiwaError(errMsg);
              }
            }
            f = s;
            c = func;
          } else if (func instanceof Function) {
            // Apply JavaScript function
            // load arguments from stack
            var args = [];
            for (var i = 0; i < n_args; i++) args.push(this.index(s, i + 1));

            // invoke the function
            var result = func(args, this);

            if (result instanceof Pause) {
              // it requested the interpreter to suspend
              var pause = result;
              pause.set_state(this, ["return"], f, c, s);
              pause.ready();
              return pause;
            } else if (result instanceof Call) {
              // it requested the interpreter to call a scheme closure

              //   [frame,
              //     [constant... (args)
              //     [constant, proc
              //     [apply]]]]
              //   [frame,
              //     [constant, after
              //     [apply 1]]]]
              //   x
              var call_after = [
                "frame",
                [
                  "argument",
                  [
                    "constant",
                    1,
                    ["argument", ["constant", result.after, ["apply"]]],
                  ],
                ],
                ["return"],
              ];
              var call_proc = [
                "constant",
                result.args.length,
                [
                  "argument",
                  ["constant", result.proc, ["apply", result.args.length]],
                ],
              ];
              var push_args = reduce(
                result.args,
                function (opc, arg) {
                  // (foo 1 2) => first push 2, then 1
                  //   [constant 2 ... [constant 1 ... ]
                  return ["constant", arg, ["argument", opc]];
                },
                call_proc
              );
              x = ["frame", push_args, call_after];
            } else {
              // the JavaScript function returned a normal value
              a = result;
              x = ["return"];
            }
          } else {
            // unknown function type
            throw new BiwaError(inspect(func) + " is not a function");
          }
          break;
        case "return":
          // Pop stack frame
          var n = this.index(s, 0);
          var ss = s - n;
          (x = this.index(ss, 1)),
            (f = this.index(ss, 2)),
            (c = this.index(ss, 3)),
            (s = ss - 3 - 1);

          // Pop stack trace (> 1 times if tail calls are done)
          var n_pops = 1 + this.tco_counter[this.tco_counter.length - 1];
          this.call_stack.splice(-n_pops);
          this.tco_counter.pop();
          break;
        default:
          throw new Bug("unknown opecode type: " + x[0]);
      }
    }

    //      if(ret === null)
    //        throw new Bug("interpreter exited in unusual way");
    //      else
    //        return ret;
    return a;
  },

  // Compile and evaluate Scheme program
  evaluate: function (str, after_evaluate) {
    this.call_stack = [];
    this.parser = new Parser(str);
    this.compiler = new Compiler();
    if (after_evaluate) this.after_evaluate = after_evaluate;

    //Console.puts("executing: " + str);

    this.is_top = true;
    this.file_stack = [];

    try {
      return this.resume(false);
    } catch (e) {
      e.message = e.message + " [" + this.call_stack.join(", ") + "]";
      return this.on_error(e);
    }
  },

  // Resume evaluation
  // (internally used from Interpreter#execute and Pause#resume)
  resume: function (is_resume, a, x, f, c, s) {
    var ret = undef;

    for (;;) {
      if (is_resume) {
        ret = this._execute(a, x, f, c, s);
        is_resume = false;
      } else {
        if (!this.parser) break; // adhoc: when Pause is used via invoke_closure
        var expr = this.parser.getObject();
        if (expr === Parser.EOS) break;

        // expand
        expr = Compiler.expand(expr);

        // compile
        const vmcode = this.compiler.run(expr);

        // execute
        ret = this._execute(expr, vmcode.il, 0, [], 0);
      }

      if (ret instanceof Pause) {
        //suspend evaluation
        return ret;
      }
    }

    // finished executing all forms
    this.after_evaluate(ret);
    return ret;
  },

  // Invoke a scheme closure
  invoke_closure: function (closure, args) {
    args || (args = []);
    var n_args = args.length;

    var x = [
      "constant",
      n_args,
      ["argument", ["constant", closure, ["apply"]]],
    ];
    for (var i = 0; i < n_args; i++) x = ["constant", args[i], ["argument", x]];

    return this._execute(closure, ["frame", x, ["halt"]], 0, closure, 0);
  },

  // only compiling (for debug use only)
  compile: function (str) {
    var obj = Interpreter.read(str);
    var opc = Compiler.compile(obj);
    return opc;
  },

  // before, after: Scheme closure
  push_dynamic_winder: function (before, after) {
    this.current_dynamic_winder = new Interpreter.DynamicWind(
      this.current_dynamic_winder,
      before,
      after
    );
  },

  pop_dynamic_winder: function (before, after) {
    this.current_dynamic_winder = this.current_dynamic_winder.parent;
  },
});

// Take a string and returns an expression.
Interpreter.read = function (str) {
  var parser = new Parser(str);
  var r = parser.getObject();
  return r == Parser.EOS ? eof : r;
};

Interpreter.expand = function () {
  throw "Interpreter.expand is moved to Compiler.expand";
};

//
// dynamic-wind
//

Interpreter.DynamicWind = Class.create({
  initialize: function (parent, before, after) {
    // Parent `DynamicWind` obj
    this.parent = parent;
    // "before" winder (Scheme closure)
    this.before = before;
    // "after" winder (Scheme closure)
    this.after = after;
  },
});

// A special value indicates the root of the winders
// (the string is just for debugging purpose.)
Interpreter.DynamicWind.ROOT = { _: "this is ROOT." };

// Return the list of winders to call
Interpreter.DynamicWind.listWinders = function (from, to) {
  // List winders from `from` to `ROOT`
  var fromStack = [from];
  while (from !== Interpreter.DynamicWind.ROOT) {
    from = from.parent;
    fromStack.push(from);
  }

  // List winders from `to` to `ROOT` and find the common one
  var toStack = [];
  var common;
  while (true) {
    var matched = fromStack.find(function (item) {
      return item === to;
    });
    if (matched) {
      common = matched;
      break;
    }
    toStack.push(to);
    to = to.parent;
  }

  // List `after`s to call
  var ret = [];
  for (var i = 0; i < fromStack.length; i++) {
    if (fromStack[i] === common) break;
    ret.push(fromStack[i].after);
  }
  // List `before`s to call
  toStack.reverse();
  toStack.forEach(function (item) {
    ret.push(item.before);
  });

  return ret;
};

// Return an opecode to run all the winders
Interpreter.DynamicWind.joinWinders = function (winders, x) {
  return winders.reduceRight(function (acc, winder) {
    return [
      "frame",
      ["constant", 0, ["argument", ["constant", winder, ["apply"]]]],
      acc,
    ];
  }, x);
};

//
// number.js
//

//
// Complex
//
const Complex = Class.create({
  initialize: function (real, imag) {
    this.real = real;
    this.imag = imag;
  },
  magnitude: function () {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  },
  angle: function () {
    return Math.atan2(this.imag, this.real);
  },
  isReal: function () {
    return this.imag == 0;
  },
  isRational: function () {
    return this.imag == 0 && isRational(this.real);
  },
  isInteger: function () {
    return this.imag == 0 && isInteger(this.real);
  },
  toString: function (radix) {
    if (this.real === 0 && this.imag === 0) return "0";
    var img = "";
    if (this.imag !== 0) {
      if (this.imag > 0 && this.real !== 0) {
        img += "+";
      }
      switch (this.imag) {
        case 1:
          break;
        case -1:
          img += "-";
          break;
        default:
          img += this.imag.toString(radix);
      }
      img += "i";
    }
    var real = "";
    if (this.real !== 0) {
      real += this.real.toString(radix);
    }
    return real + img;
  },
});
Complex.from_polar = function (r, theta) {
  var real = r * Math.cos(theta);
  var imag = r * Math.sin(theta);
  return new Complex(real, imag);
};
Complex.assure = function (num) {
  if (num instanceof Complex) return num;
  else return new Complex(num, 0);
};

//
// Rational (unfinished)
//
const Rational = Class.create({
  initialize: function (numerator, denominator) {
    this.numerator = numerator;
    this.denominator = denominator;
  },

  isInteger: function () {
    // FIXME
  },
});

//
// Predicates
//
const isNumber$2 = function (x) {
  return x instanceof Complex || x instanceof Rational || typeof x == "number";
};
const isComplex = isNumber$2;
const isReal = function (x) {
  if (x instanceof Complex || x instanceof Rational) {
    return x.isReal();
  } else {
    return typeof x == "number";
  }
};
const isRational = function (x) {
  if (x instanceof Complex) {
    return x.isRational();
  } else if (x instanceof Rational) {
    return true;
  } else {
    return typeof x == "number";
  }
};
const isInteger = function (x) {
  if (x instanceof Complex || x instanceof Rational) {
    return x.isInteger();
  } else {
    return typeof x == "number" && x % 1 == 0;
  }
};

//
// R7RS Promise (lazy library)
//
const BiwaPromise = Class.create({
  initialize: function (done, thunk_or_value) {
    this.box = [done, thunk_or_value];
  },

  // Return true when this promise is already calculated
  is_done: function () {
    return this.box[0];
  },

  // Return calculated value of this promise
  value: function () {
    if (!this.is_done()) {
      throw new Bug("this promise is not calculated yet");
    }
    return this.box[1];
  },

  thunk: function () {
    if (this.is_done()) {
      throw new Bug("this promise does not know the thunk");
    }
    return this.box[1];
  },

  update_with: function (new_promise) {
    this.box[0] = new_promise.box[0];
    this.box[1] = new_promise.box[1];
    new_promise.box = this.box;
  },
});

const isPromise = function (obj) {
  return obj instanceof BiwaPromise;
};

// Create fresh promise
BiwaPromise.fresh = function (thunk) {
  return new BiwaPromise(false, thunk);
};
// Create calculated promise
BiwaPromise.done = function (value) {
  return new BiwaPromise(true, value);
};

///
/// infra.js - Basis for library functions
///

//
// define_*func - define library functions
//
const check_arity = function (fname, len, min, max) {
  if (len < min) {
    if (max && max == min)
      throw new BiwaError(
        fname +
          ": wrong number of arguments (expected: " +
          min +
          " got: " +
          len +
          ")"
      );
    else
      throw new BiwaError(
        fname + ": too few arguments (at least: " + min + " got: " + len + ")"
      );
  } else if (max && max < len)
    throw new BiwaError(
      fname + ": too many arguments (at most: " + max + " got: " + len + ")"
    );
};

const define_libfunc = function (fname, min, max, func) {
  var f = function (ar, intp) {
    check_arity(fname, ar.length, min, max);
    return func(ar, intp);
  };

  func["fname"] = fname; // for assert_*
  f["inspect"] = function () {
    return this.fname;
  };
  CoreEnv[fname] = f;
};

const alias_libfunc = function (fname, aliases) {
  if (CoreEnv[fname]) {
    if (isArray(aliases)) {
      map(aliases, function (a) {
        alias_libfunc(fname, a);
      });
    } else if (isString(aliases)) {
      CoreEnv[aliases] = CoreEnv[fname];
    } else {
      console.error(
        "[BUG] bad alias for library function " +
          "`" +
          fname +
          "': " +
          aliases.toString()
      );
    }
  } else {
    console.error(
      "[BUG] library function " +
        "`" +
        fname +
        "'" +
        " does not exist, so can't alias it."
    );
  }
};

const define_syntax = function (sname, func) {
  var s = new Syntax(sname, func);
  CoreEnv[sname] = s;
};

const define_scmfunc = function (fname, min, max, str) {
  new Interpreter().evaluate("(define " + fname + " " + str + "\n)");
};

//  define_scmfunc("map+", 2, null,
//    "(lambda (proc ls) (if (null? ls) ls (cons (proc (car ls)) (map proc (cdr ls)))))");

//
// assertions - type checks
//

const assert_number = make_simple_assert("number", function (obj) {
  return typeof obj == "number" || obj instanceof Complex;
});

const assert_integer = make_simple_assert("integer", function (obj) {
  return typeof obj == "number" && obj % 1 == 0;
});

const assert_real = make_simple_assert("real number", function (obj) {
  return typeof obj == "number";
});

const assert_between = make_assert(function (fname, obj, from, to) {
  if (typeof obj != "number" || obj != Math.round(obj)) {
    throw new BiwaError(
      fname + ": " + "number required, but got " + to_write$1(obj)
    );
  }

  if (obj < from || to < obj) {
    throw new BiwaError(
      fname +
        ": " +
        "number must be between " +
        from +
        " and " +
        to +
        ", but got " +
        to_write$1(obj)
    );
  }
});

const assert_string = make_simple_assert("string", isString$1);
const assert_char = make_simple_assert("character", isChar);
const assert_symbol = make_simple_assert("symbol", isSymbol$1);
const assert_port = make_simple_assert("port", isPort);
const assert_pair = make_simple_assert("pair", isPair);
const assert_list = make_simple_assert("list", isList);
const assert_vector = make_simple_assert("vector", isVector);
const assert_hashtable = make_simple_assert("hashtable", isHashtable);
const assert_promise = make_simple_assert("promise", isPromise);

const assert_function = make_simple_assert("JavaScript function", isFunction$2);
const assert_closure = make_simple_assert("scheme closure", isClosure);
const assert_procedure = make_simple_assert("scheme/js function", function (
  obj
) {
  return isClosure(obj) || isFunction$2(obj);
});

const assert_date = make_simple_assert("date", function (obj) {
  // FIXME: this is not accurate (about cross-frame issue)
  // https://prototype.lighthouseapp.com/projects/8886/tickets/443
  return obj instanceof Date;
});

//var assert_instance_of = BiwaScheme.make_assert(function(fname, type, obj, klass){
//  if(!(obj instanceof klass)){
//    throw new BiwaScheme.Error(fname + ": " +
//                               type + " required, but got " +
//                               BiwaScheme.to_write(obj));
//  }
//});

const assert = make_assert(function (fname, success, message, _fname) {
  if (!success) {
    throw new BiwaError((_fname || fname) + ": " + message);
  }
});

//
// deprecation
//

// Show deprecation warnig
// @param {string} title - feature to be deprecated
// @param {string} ver - when it will be removed (eg. "1.0")
// @param {string} alt - alternatives
const deprecate = function (title, ver, alt) {
  var msg =
    title +
    " is deprecated and will be removed in BiwaScheme " +
    ver +
    ". " +
    "Please use " +
    alt +
    " instead";
  console.warn(msg);
};

//
// utils
//

// Parses a fractional notation in the format: <num>/<denom> (e.g. 3/7, -9/4),
// where <num> is a valid integer notation, and <denom> is a valid notation
// for a positive integer.
//
// Returns a float if the notation is valid, otherwise false.
//
// @param {string} rep - the string representation of the fraction
// @return {float|false}
const parse_fraction = function (rep) {
  assert_string(rep);

  var frac_parts = rep.split("/");

  if (frac_parts.length !== 2) return false;

  var num_rep = frac_parts[0];
  var denom_rep = frac_parts[1];

  var num = parse_integer(num_rep, 10);
  var denom = parse_integer(denom_rep, 10);

  if (num === false || denom === false) return false;

  if (denom <= 0) return false;

  return num / denom;
};

// Given a string notation of an integer, and the radix, validates the
// notation: returns true if the notation is valid, otherwise false.
//
// @param {string} rep - the string representation of the integer
// @param {integer} rdx - the radix, where 2 <= rdx <= 36
// @return {boolean}
const is_valid_integer_notation = function (rep, rdx) {
  assert_string(rep);
  assert_integer(rdx);

  if (rdx < 2 || rdx > 36) return false;

  var rdx_symbols = "0123456789abcdefghijklmnopqrstuvwxyz";

  var valid_symbols = rdx_symbols.slice(0, rdx);
  var sym_regex = new RegExp("^[+-]?" + "[" + valid_symbols + "]+$", "ig");

  return sym_regex.test(rep);
};

// Parse an integer. If the integer does not have a valid representation, or
// produces NaN, - false is returned. If the radix is not within [2..36]
// range, false is returned as well.
//
// @param {string} rep - the string representation of the integer
// @param {integer} rdx - the radix, where 2 <= rdx <= 36
// @return {integer|false}
const parse_integer = function (rep, rdx) {
  assert_string(rep);
  assert_integer(rdx);

  if (rdx < 2 || rdx > 36) return false;

  if (!is_valid_integer_notation(rep, rdx)) return false;

  var res = parseInt(rep, rdx);

  if (Number.isNaN(res)) return false;

  return res;
};

// Given a string notation of a floating-point number in the standard or
// scientific notation, returns true if the notation valid, otherwise false.
//
// For example:
// "1"      -> true
// "1."     -> true
// "1.23"   -> true
// "1e4"    -> true
// "1E4"    -> true
// "1E4.34" -> false
// "e34"    -> false
//
// @param {string} rep - the string representation of the float.
// @return {boolean}
const is_valid_float_notation = function (rep) {
  assert_string(rep);

  var sci_regex = /^[+-]?[0-9]+[.]?[0-9]*e[+-]?[0-9]+$/i;
  var fp_regex = /(^[+-]?[0-9]*[.][0-9]+$)|(^[+-]?[0-9]+[.][0-9]*$)/;

  if (sci_regex.test(rep) || fp_regex.test(rep)) return true;

  return is_valid_integer_notation(rep, 10);
};

// Parse a floating-point number. If the floating-point number does not have a
// valid representation, or produces -Infinity, +Infinity or NaN, - false is
// returned.
//
// @param {string} rep - the string representation of the floating-point value
// @return {float|false}
const parse_float = function (rep) {
  assert_string(rep);

  if (!is_valid_float_notation(rep)) return false;

  var res = new Number(rep).valueOf();

  if (Number.isNaN(res)) return false;

  if (!Number.isFinite(res)) return false;

  return res;
};

//
// R6RS Enumerations
// http://www.r6rs.org/final/html/r6rs-lib/r6rs-lib-Z-H-15.html#node_chap_14
//
// Example
//
//   (define-enumeration color
//     (black white purple maroon)
//     color-set)
//
//   (color black)                  ;=> 'black
//   (color purpel)                 ;=> &syntax exception
//   (enum-set->list
//     (color-set maroon white))    ;=> #<enum-set (white maroon)>

const Enumeration = {};

// Represents an enum_type.
//
// Becuase there is no way to access an EnumType directly from Scheme,
// EnumType#to_write is not defined.
//
// Properties
//
// members - Array of symbols (no duplicate)
//
Enumeration.EnumType = Class.create({
  // Creates a new enum_type.
  //
  // members - Array of symbols.
  //           Symbols may be duplicate (I think you shouldn't, though :-p).
  initialize: function (members) {
    this.members = uniq(members);
  },

  // Returns an EnumSet.
  universe: function () {
    return new Enumeration.EnumSet(this, this.members);
  },

  // Returns a function which map a symbol to an integer (or #f, if
  // the symbol is out of the universe).
  //
  // Implementation note: don't forget this.members may have duplicates.
  indexer: function () {
    // ar[0] - a symbol
    // Returns an integer or #f.
    return bind(function (ar) {
      assert_symbol(ar[0], "(enum-set indexer)");
      var idx = indexOf(this.members, ar[0]);
      return idx === -1 ? false : idx;
    }, this);
  },

  // Retuns a function which creates an enum_set from a list of
  // symbols (Symbols may be duplicate.)
  constructor: function () {
    // ar[0] - a list of symbol
    // Returns a enum_set.
    return bind(function (ar) {
      assert_list(ar[0], "(enum-set constructor)");
      var symbols = ar[0].to_array();
      each(symbols, function (arg) {
        assert_symbol(arg, "(enum-set constructor)");
      });

      return new Enumeration.EnumSet(this, symbols);
    }, this);
  },
});
Class.memoize(Enumeration.EnumType, ["universe", "indexer", "constructor"]);

// Represents an enum_set of an enum_type.
//
// Properties
//
// enum_type - The enum_type.
// symbols   - Array of symbols (no duplicate, properly ordered)
//
Enumeration.EnumSet = Class.create({
  // Creates a new enum_set.
  //
  // enum_type - An EnumType
  // symbols   - Array of symbols.
  //
  // initialize normalizes symbols.
  //   - remove duplicates
  //   - order by universe
  initialize: function (enum_type, symbols) {
    this.enum_type = enum_type;
    this.symbols = filter(enum_type.members, function (sym) {
      return contains(symbols, sym);
    });
  },

  // Returns a list of symbols.
  symbol_list: function () {
    return array_to_list(this.symbols);
  },

  // Returns true if the enum_set includes the symbol.
  // 'symbol' is allowed to be a symbol which is not included in the universe.
  is_member: function (symbol) {
    return contains(this.symbols, symbol);
  },

  // Returns true if:
  // - the enum_set is a subset of the enum_set 'other', and
  // - the universe of the enum_set is a subset of
  //   the universe of 'other'.
  // The enum_set and 'other' may belong to different enum_type.
  is_subset: function (other) {
    // Check elements
    if (
      some(this.symbols, function (sym) {
        return !contains(other.symbols, sym);
      })
    ) {
      return false;
    }

    // Check universe
    if (this.enum_type === other.enum_type) {
      return true;
    } else {
      return every(this.enum_type.members, function (sym) {
        return contains(other.enum_type.members, sym);
      });
    }
  },

  // Returns true if:
  //   - the enum_set contains the same set of symbols as 'other', and
  //   - universe of the enum_set contains the same set of symbols
  //     as the universe of 'other'.
  //
  // The enum_set and 'other' may belong to different enum_type.
  equal_to: function (other) {
    return this.is_subset(other) && other.is_subset(this);
  },

  // Returns a enum_set which has:
  // - all the symbols included in the enum_set or the enum_set 'other'.
  // The enum_set and 'other' *must* belong to the same enum_type.
  union: function (other) {
    var syms = filter(
      this.enum_type.members,
      bind(function (sym) {
        return contains(this.symbols, sym) || contains(other.symbols, sym);
      }, this)
    );
    return new Enumeration.EnumSet(this.enum_type, syms);
  },

  // Returns a enum_set which has:
  // - the symbols included both in the enum_set or the enum_set 'other'.
  // The enum_set and 'other' *must* belong to the same enum_type.
  intersection: function (other) {
    var syms = filter(this.symbols, function (sym) {
      return contains(other.symbols, sym);
    });
    return new Enumeration.EnumSet(this.enum_type, syms);
  },

  // Returns a enum_set which has:
  // - the symbols included in the enum_set and not in the enum_set 'other'.
  // The enum_set and 'other' *must* belong to the same enum_type.
  difference: function (other) {
    var syms = filter(this.symbols, function (sym) {
      return !contains(other.symbols, sym);
    });
    return new Enumeration.EnumSet(this.enum_type, syms);
  },

  // Returns a enum_set which has:
  // - the symbols included in the universe but not in the enum_set.
  complement: function () {
    var syms = filter(
      this.enum_type.members,
      bind(function (sym) {
        return !contains(this.symbols, sym);
      }, this)
    );
    return new Enumeration.EnumSet(this.enum_type, syms);
  },

  // Returns a enum_set which has:
  // - the symbols included in the enum_set and the universe of the enum_set 'other'.
  // The enum_set and 'other' may belong to different enum_type.
  projection: function (other) {
    var syms = filter(this.symbols, function (sym) {
      return contains(other.enum_type.members, sym);
    });
    return new Enumeration.EnumSet(other.enum_type, syms);
  },

  // Returns a string which represents the enum_set.
  toString: function () {
    return "#<EnumSet " + inspect(this.symbols) + ">";
  },
});
Class.memoize(Enumeration.EnumSet, "symbol_list");

const isEnumSet = function (obj) {
  return obj instanceof Enumeration.EnumSet;
};

const assert_enum_set = make_simple_assert("enum_set", isEnumSet);

//
// R6RS Records
// http://www.r6rs.org/final/html/r6rs-lib/r6rs-lib-Z-H-7.html#node_chap_6
//
// Record is like struct in C, but supports more feature like inheritance.
// see also: src/library/r6rs_lib.js

//
// Record
// represents each instance of record type
//
const Record = Class.create({
  initialize: function (rtd, values) {
    assert_record_td(rtd, "new Record");

    this.rtd = rtd;
    this.fields = values;
  },

  get: function (k) {
    return this.fields[k];
  },

  set: function (k, v) {
    this.fields[k] = v;
  },

  toString: function () {
    var contents = to_write$1(this.fields);
    return "#<Record " + this.rtd.name + " " + contents + ">";
  },
});

const isRecord = function (o) {
  return o instanceof Record;
};

// Defined record types
Record._DefinedTypes = {};

Record.define_type = function (name_str, rtd, cd) {
  return (Record._DefinedTypes[name_str] = { rtd: rtd, cd: cd });
};
Record.get_type = function (name_str) {
  return Record._DefinedTypes[name_str];
};

//
// RTD (Record type descriptor)
//
Record.RTD = Class.create({
  //                   Symbol RTD        Symbol Bool  Bool    Array
  initialize: function (name, parent_rtd, uid, sealed, opaque, fields) {
    this.name = name;
    this.parent_rtd = parent_rtd;
    this.is_base_type = !parent_rtd;

    if (uid) {
      this.uid = uid;
      this.generative = false;
    } else {
      this.uid = this._generate_new_uid();
      this.generative = true;
    }

    this.sealed = !!sealed;
    this.opaque = parent_rtd.opaque || !!opaque;

    this.fields = map(fields, function (field) {
      return { name: field[0], mutable: !!field[1] };
    });
  },

  // Returns the name of the k-th field.
  // Only used for error messages.
  field_name: function (k) {
    var names = this._field_names();

    for (var par = this.parent_rtd; par; par = par.parent_rtd) {
      names = par._field_names() + names;
    }

    return names[k];
  },
  _field_names: function () {
    return map(this.fields, function (spec) {
      return spec.name;
    });
  },

  _generate_new_uid: function () {
    return Sym(uniqueId("__record_td_uid"));
  },

  toString: function () {
    return "#<RecordTD " + name + ">";
  },
});

Record.RTD.NongenerativeRecords = {};
const isRecordTD = function (o) {
  return o instanceof Record.RTD;
};

//
// CD (Record constructor descriptor)
//
Record.CD = Class.create({
  initialize: function (rtd, parent_cd, protocol) {
    this._check(rtd, parent_cd, protocol);
    this.rtd = rtd;
    this.parent_cd = parent_cd;
    if (protocol) {
      this.has_custom_protocol = true;
      this.protocol = protocol;
    } else {
      this.has_custom_protocol = false;
      if (rtd.parent_rtd)
        this.protocol = this._default_protocol_for_derived_types();
      else this.protocol = this._default_protocol_for_base_types();
    }
  },

  _check: function (rtd, parent_cd, protocol) {
    if (rtd.is_base_type && parent_cd)
      throw new Error("Record.CD.new: cannot specify parent cd of a base type");

    if (parent_cd && rtd.parent_rtd && parent_cd.rtd != rtd.parent_rtd)
      throw new Error(
        "Record.CD.new: mismatched parents between rtd and parent_cd"
      );

    if (rtd.parent_rtd && !parent_cd && protocol)
      throw new Error(
        "Record.CD.new: protocol must be #f when parent_cd is not given"
      );

    if (parent_cd && parent_cd.has_custom_protocol && !protocol)
      throw new Error(
        "Record.CD.new: protocol must be specified when parent_cd has a custom protocol"
      );
  },

  _default_protocol_for_base_types: function () {
    // (lambda (p) p)
    // called with `p' as an argument
    return function (ar) {
      var p = ar[0];
      assert_procedure(p, "_default_protocol/base");
      return p;
    };
  },

  _default_protocol_for_derived_types: function () {
    // (lambda (n)
    //   (lambda (a b x y s t)
    //     (let1 p (n a b x y) (p s t))))
    // called with `n' as an argument
    var rtd = this.rtd;
    return function (ar) {
      var n = ar[0];
      assert_procedure(n, "_default_protocol/n");

      var ctor = function (args) {
        var my_argc = rtd.fields.length;
        var ancestor_argc = args.length - my_argc;

        var ancestor_values = args.slice(0, ancestor_argc);
        var my_values = args.slice(ancestor_argc);

        // (n a b x y) => p
        return new Call(n, ancestor_values, function (ar) {
          var p = ar[0];
          assert_procedure(p, "_default_protocol/p");

          // (p s t) => record
          return new Call(p, my_values, function (ar) {
            var record = ar[0];
            assert_record(record, "_default_protocol/result");

            return record;
          });
        });
      };
      return ctor;
    };
  },

  toString: function () {
    return "#<RecordCD " + this.rtd.name + ">";
  },

  record_constructor: function () {
    var arg_for_protocol = this.parent_cd
      ? this._make_n([], this.rtd)
      : this._make_p();
    arg_for_protocol = bind(arg_for_protocol, this);

    return new Call(this.protocol, [arg_for_protocol], function (ar) {
      var ctor = ar[0];
      assert_procedure(ctor, "record_constructor");
      return ctor;
    });
  },

  // Create the function `p' which is given to the protocol.
  _make_p: function () {
    return function (values) {
      return new Record(this.rtd, values);
      // TODO: check argc
    };
  },

  // Create the function `n' which is given to the protocol.
  // When creating an instance of a derived type,
  // _make_n is called for each ancestor rtd's.
  _make_n: function (children_values, rtd) {
    var parent_cd = this.parent_cd;

    if (parent_cd) {
      // called from protocol (n)
      var n = function (args_for_n) {
        // called from protocol (p)
        var p = function (args_for_p) {
          var values = [].concat(args_for_p[0]).concat(children_values);
          var parent_n = parent_cd._make_n(values, rtd);

          return new Call(parent_cd.protocol, [parent_n], function (ar) {
            var ctor = ar[0];
            assert_procedure(ctor, "_make_n");

            return new Call(ctor, args_for_n, function (ar) {
              var record = ar[0];
              assert_record(record);
              return record;
            });
          });
        };
        return p;
      };
      return n;
    } else {
      var n = function (my_values) {
        var values = my_values.concat(children_values);
        return new Record(rtd, values);
        // TODO: check argc
      };
      return n;
    }
  },
});

const isRecordCD = function (o) {
  return o instanceof Record.CD;
};

const assert_record = make_simple_assert("record", isRecord);
const assert_record_td = make_simple_assert(
  "record type descriptor",
  isRecordTD
);
const assert_record_cd = make_simple_assert(
  "record constructor descriptor",
  isRecordCD
);

//
// Values
//
const Values$1 = Class.create({
  initialize: function (values) {
    this.content = values;
  },
  to_write: function () {
    return "#<Values " + map(this.content, to_write$1).join(" ") + ">";
  },
});

const Console = {};

// Actual implementation is in src/platforms/*/console.js

define_libfunc("html-escape", 1, 1, function (ar) {
  assert_string(ar[0]);
  return _escape(ar[0]);
});
const inspect_objs = function (objs) {
  return map(objs, inspect).join(", ");
};
define_libfunc("inspect", 1, null, function (ar) {
  return inspect_objs(ar);
});
define_libfunc("inspect!", 1, null, function (ar) {
  Console.puts(inspect_objs(ar));
  return undef;
});

//
// json
//
// json->sexp
// Array -> list
// Object -> alist
// (number, boolean, string,
//
const json2sexp = function (json) {
  switch (true) {
    case isNumber$1(json) || isString(json) || json === true || json === false:
      return json;
    case isArray(json):
      return array_to_list(map(json, json2sexp));
    case typeof json == "object":
      var ls = nil;
      for (key in json) {
        ls = new Pair(new Pair(key, json2sexp(json[key])), ls);
      }
      return ls;
    default:
      throw new Error(
        "json->sexp: detected invalid value for json: " + inspect(json)
      );
  }
};
define_libfunc("json->sexp", 1, 1, function (ar) {
  return json2sexp(ar[0]);
});

// (vector-push! v item1 item2 ...)
define_libfunc("vector-push!", 2, null, function (ar) {
  assert_vector(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    ar[0].push(ar[i]);
  }
  return ar[0];
});

//
//from Gauche
//

// (identity obj)
// Returns obj.
define_libfunc("identity", 1, 1, function (ar) {
  return ar[0];
});

// (inc! i)
// = (begin (set! i (+ i 1)) i)
// Increments i (i.e., set i+1 to i).
define_syntax("inc!", function (x) {
  var target = x.cdr.car;
  return List(
    Sym("begin"),
    List(Sym("set!"), target, List(Sym("+"), target, 1)),
    target
  );
});

// (dec! i)
// = (begin (set! i (- i 1)) i)
// Decrements i (i.e., set i-1 to i).
define_syntax("dec!", function (x) {
  var target = x.cdr.car;
  return List(
    Sym("begin"),
    List(Sym("set!"), target, List(Sym("-"), target, 1)),
    target
  );
});

// string

define_libfunc("string-concat", 1, 1, function (ar) {
  assert_list(ar[0]);
  return ar[0].to_array().join("");
});

define_libfunc("string-split", 2, 2, function (ar) {
  assert_string(ar[0]);
  assert_string(ar[1]);
  return array_to_list(ar[0].split(ar[1]));
});

define_libfunc("string-join", 1, 2, function (ar) {
  assert_list(ar[0]);
  var delim = "";
  if (ar[1]) {
    assert_string(ar[1]);
    delim = ar[1];
  }
  return ar[0].to_array().join(delim);
});

// lists

define_libfunc("intersperse", 2, 2, function (ar) {
  var item = ar[0],
    ls = ar[1];
  assert_list(ls);

  var ret = [];
  each(ls.to_array().reverse(), function (x) {
    ret.push(x);
    ret.push(item);
  });
  ret.pop();
  return array_to_list(ret);
});

define_libfunc("map-with-index", 2, null, function (ar) {
  var proc = ar.shift(),
    lists = ar;
  each(lists, assert_list);

  var results = [],
    i = 0;
  return Call.multi_foreach(lists, {
    call: function (xs) {
      var args = map(xs, function (x) {
        return x.car;
      });
      args.unshift(i);
      i++;
      return new Call(proc, args);
    },
    result: function (res) {
      results.push(res);
    },
    finish: function () {
      return array_to_list(results);
    },
  });
});

// loop

// (dotimes (variable limit result) body ...)
// Iterate with variable 0 to limit-1.
// ->
//    (do ((tlimit limit)
//         (variable 0 (+ variable 1)))
//        ((>= variable tlimit) result)
//      body ...)
define_syntax("dotimes", function (x) {
  var spec = x.cdr.car,
    bodies = x.cdr.cdr;
  var variable = spec.car,
    limit = spec.cdr.car,
    result = spec.cdr.cdr.car;
  var tlimit = gensym();

  var do_vars = deep_array_to_list([
    [tlimit, limit],
    [variable, 0, [Sym("+"), variable, 1]],
  ]);
  var do_check = deep_array_to_list([[Sym(">="), variable, tlimit], result]);

  return new Pair(Sym("do"), new Pair(do_vars, new Pair(do_check, bodies)));
});

// sorting (Obsolete: use list-sort, etc. instead of these.)

// utility function. takes a JS Array and a Scheme procedure,
// returns sorted array
var sort_with_comp = function (ary, proc, intp) {
  return ary.sort(function (a, b) {
    var intp2 = new Interpreter(intp);
    return intp2.invoke_closure(proc, [a, b]);
  });
};

define_libfunc("list-sort/comp", 1, 2, function (ar, intp) {
  assert_procedure(ar[0]);
  assert_list(ar[1]);

  return array_to_list(sort_with_comp(ar[1].to_array(), ar[0], intp));
});
define_libfunc("vector-sort/comp", 1, 2, function (ar, intp) {
  assert_procedure(ar[0]);
  assert_vector(ar[1]);

  return sort_with_comp(clone(ar[1]), ar[0], intp);
});
define_libfunc("vector-sort/comp!", 1, 2, function (ar, intp) {
  assert_procedure(ar[0]);
  assert_vector(ar[1]);

  sort_with_comp(ar[1], ar[0], intp);
  return undef;
});

// macros

//(define-macro (foo x y) body ...)
//(define-macro foo lambda)

var rearrange_args = function (expected, given) {
  var args = [];
  var dotpos = new Compiler().find_dot_pos(expected);
  if (dotpos == -1) args = given;
  else {
    for (var i = 0; i < dotpos; i++) {
      args[i] = given[i];
    }
    args[i] = array_to_list(given.slice(i));
  }
  return args;
};
define_syntax("define-macro", function (x) {
  var head = x.cdr.car;
  var expected_args;
  if (head instanceof Pair) {
    var name = head.car;
    expected_args = head.cdr;
    var body = x.cdr.cdr;
    var lambda = new Pair(Sym("lambda"), new Pair(expected_args, body));
  } else {
    var name = head;
    var lambda = x.cdr.cdr.car;
    expected_args = lambda.cdr.car;
  }

  //["close", <args>, <n>, <body>, <opecodes_next>, <dotpos>]
  var opc = Compiler.compile(lambda).il;
  if (opc[2] != 0)
    throw new Bug(
      "you cannot use free variables in macro expander (or define-macro must be on toplevel)"
    );
  var cls = new Closure(opc[3], [], -1, undefined);

  TopEnv[name.name] = new Syntax(name.name, function (sexp) {
    var given_args = sexp.to_array();

    given_args.shift();

    var intp = new Interpreter();
    var args = rearrange_args(expected_args, given_args);
    var result = intp.invoke_closure(cls, args);
    return result;
  });

  return undef;
});

var macroexpand_1 = function (x) {
  if (x instanceof Pair) {
    // TODO: Should we check CoreEnv too?
    if (x.car instanceof BiwaSymbol && TopEnv[x.car.name] instanceof Syntax) {
      var transformer = TopEnv[x.car.name];
      x = transformer.transform(x);
    } else
      throw new Error("macroexpand-1: `" + to_write$1(x) + "' is not a macro");
  }
  return x;
};
define_syntax("%macroexpand", function (x) {
  var expanded = Compiler.expand(x.cdr.car);
  return List(Sym("quote"), expanded);
});
define_syntax("%macroexpand-1", function (x) {
  var expanded = macroexpand_1(x.cdr.car);
  return List(Sym("quote"), expanded);
});

define_libfunc("macroexpand", 1, 1, function (ar) {
  return Compiler.expand(ar[0]);
});
define_libfunc("macroexpand-1", 1, 1, function (ar) {
  return macroexpand_1(ar[0]);
});

define_libfunc("gensym", 0, 0, function (ar) {
  return gensym();
});

// i/o

define_libfunc("print", 1, null, function (ar) {
  map(ar, function (item) {
    Console.puts(to_display(item), true);
  });
  Console.puts(""); //newline
  return undef;
});
define_libfunc("write-to-string", 1, 1, function (ar) {
  return to_write$1(ar[0]);
});
define_libfunc("read-from-string", 1, 1, function (ar) {
  assert_string(ar[0]);
  return Interpreter.read(ar[0]);
});
define_libfunc("port-closed?", 1, 1, function (ar) {
  assert_port(ar[0]);
  return !ar[0].is_open;
});
//define_libfunc("with-input-from-port", 2, 2, function(ar){
//define_libfunc("with-error-to-port", 2, 2, function(ar){
define_libfunc("with-output-to-port", 2, 2, function (ar) {
  var port = ar[0],
    proc = ar[1];
  assert_port(port);
  assert_procedure(proc);

  var original_port = Port.current_output;
  Port.current_output = port;

  return new Call(proc, [port], function (ar) {
    port.close();
    Port.current_output = original_port;

    return ar[0];
  });
});

// syntax

define_syntax("let1", function (x) {
  //(let1 vari expr body ...)
  //=> ((lambda (var) body ...) expr)
  var vari = x.cdr.car;
  var expr = x.cdr.cdr.car;
  var body = x.cdr.cdr.cdr;

  return new Pair(
    new Pair(Sym("lambda"), new Pair(new Pair(vari, nil), body)),
    new Pair(expr, nil)
  );
});

//
// Regular Expression
//
var assert_regexp = function (obj, fname) {
  if (!(obj instanceof RegExp))
    throw new Error(fname + ": regexp required, but got " + to_write$1(obj));
};

//Function: string->regexp string &keyword case-fold
define_libfunc("string->regexp", 1, 1, function (ar) {
  assert_string(ar[0], "string->regexp");
  return new RegExp(ar[0]); //todo: case-fold
});
//Function: regexp? obj
define_libfunc("regexp?", 1, 1, function (ar) {
  return ar[0] instanceof RegExp;
});
//Function: regexp->string regexp
define_libfunc("regexp->string", 1, 1, function (ar) {
  assert_regexp(ar[0], "regexp->string");
  return ar[0].toString().slice(1, -1); //cut '/'
});

define_libfunc("regexp-exec", 2, 2, function (ar) {
  var rexp = ar[0];
  if (isString(ar[0])) {
    rexp = new RegExp(ar[0]);
  }
  assert_regexp(rexp, "regexp-exec");
  assert_string(ar[1], "regexp-exec");
  var ret = rexp.exec(ar[1]);
  return ret === null ? false : array_to_list(ret);
});

//  //Function: rxmatch regexp string
//  define_libfunc("rxmatch", 1, 1, function(ar){
//    assert_regexp(ar[0], "rxmatch");
//    assert_string(ar[1], "rxmatch");
//    return ar[0].match(ar[1]);
//  });
//Function: rxmatch-start match &optional (i 0)
//Function: rxmatch-end match &optional (i 0)
//Function: rxmatch-substring match &optional (i 0)
//Function: rxmatch-num-matches match
//Function: rxmatch-after match &optional (i 0)
//Function: rxmatch-before match &optional (i 0)
//Generic application: regmatch &optional index
//Generic application: regmatch 'before &optional index
//Generic application: regmatch 'after &optional index
//Function: regexp-replace regexp string substitution

// regexp-replace-all regexp string substitution
define_libfunc("regexp-replace-all", 3, 3, function (ar) {
  var pat = ar[0];
  if (isString(pat)) {
    var rexp = new RegExp(pat, "g");
  } else {
    assert_regexp(pat);
    var rexp = new RegExp(pat.source, "g");
  }
  assert_string(ar[1]);
  assert_string(ar[2]);
  return ar[1].replace(rexp, ar[2]);
});
//Function: regexp-replace* string rx1 sub1 rx2 sub2 ...
//Function: regexp-replace-all* string rx1 sub1 rx2 sub2 ...
//Function: regexp-quote string
//Macro: rxmatch-let match-expr (var ...) form ...
//Macro: rxmatch-if match-expr (var ...) then-form else-form
//Macro: rxmatch-cond clause ...
//Macro: rxmatch-case string-expr clause ...

//
// interface to javascript
//

// Rebind uses of eval to the global scope, to avoid polluting downstream code.
// See: https://github.com/rollup/rollup/wiki/Troubleshooting#avoiding-eval
let eval2 = eval;

define_libfunc("js-eval", 1, 1, function (ar) {
  return eval2(ar[0]);
});
define_libfunc("js-ref", 2, 2, function (ar) {
  if (isString(ar[1])) {
    return ar[0][ar[1]];
  } else {
    assert_symbol(ar[1]);
    return ar[0][ar[1].name];
  }
});
define_libfunc("js-set!", 3, 3, function (ar) {
  assert_string(ar[1]);
  ar[0][ar[1]] = ar[2];
  return undef;
});

// (js-call (js-eval "Math.pow") 2 4)
define_libfunc("js-call", 1, null, function (ar) {
  var js_func = ar.shift();
  assert_function(js_func);

  var receiver = null;
  return js_func.apply(receiver, ar);
});
// (js-invoke (js-new "Date") "getTime")
define_libfunc("js-invoke", 2, null, function (ar) {
  var js_obj = ar.shift();
  var func_name = ar.shift();
  if (!isString(func_name)) {
    assert_symbol(func_name);
    func_name = func_name.name;
  }
  if (js_obj[func_name]) return js_obj[func_name].apply(js_obj, ar);
  else throw new Error("js-invoke: function " + func_name + " is not defined");
});

// Short hand for JavaScript method call.
//
// (js-invocation obj '(foo 1 2 3))  ;=> obj.foo(1,2,3)
// (js-invocation obj '(foo 1 2 3)   ;=> obj.foo(1,2,3)
//                    'bar           ;      .bar
//                    '(baz 4 5))    ;      .baz(4,5)
// (js-invocation 'Math '(pow 2 3))  ;=> Math.pow(2,3)
//
// It also converts
//   (lambda (e) ...) to
//   (js-closure (lambda (e) ...))
//   and
//   '((a . b) (c . 4)) to
//   {a: "b", c: 4}
//
define_libfunc("js-invocation", 2, null, function (ar, intp) {
  var receiver = ar.shift();
  // TODO: convert lambdas by js-closure
  if (isSymbol$1(receiver)) {
    receiver = eval2(receiver.name); //XXX: is this ok?
  }

  var v = receiver;

  // Process each method call
  each(ar, function (callspec) {
    if (isSymbol$1(callspec)) {
      // Property access
      v = v[callspec.name];
    } else if (isList(callspec)) {
      // Method call
      var args = callspec.to_array();

      assert_symbol(args[0]);
      var method = args.shift().name;

      // Convert arguments
      args = map(args, function (arg) {
        if (isClosure(arg)) {
          // closure -> JavaScript funciton
          return js_closure(arg, intp);
        } else if (isList(arg)) {
          // alist -> JavaScript Object
          var o = {};
          arg.foreach(function (pair) {
            assert_symbol(pair.car);
            o[pair.car.name] = pair.cdr;
          });
          return o;
        } else return arg;
      });

      // Call the method
      if (!isFunction$1(v[method])) {
        throw new BiwaError(
          "js-invocation: the method `" + method + "' not found"
        );
      }
      v = v[method].apply(v, args);
    } else {
      // (wrong argument)
      throw new BiwaError(
        "js-invocation: expected list or symbol for callspec but got " +
          inspect(callspec)
      );
    }
  });

  return v;
});

// TODO: provide corresponding macro ".."
define_syntax("..", function (x) {
  if (x.cdr == nil) {
    throw new Error("malformed ..");
  }
  return new Pair(Sym("js-invocation"), x.cdr);
});

// (js-new (js-eval "Date") 2005 1 1)
// (js-new (js-eval "Draggable") elem 'onEnd (lambda (drg) ...))
//   If symbol is given, following arguments are converted to
//   an js object. If any of them is a scheme closure,
//   it is converted to js function which invokes that closure.
//
// (js-new "Date" 2005 1 1)
//   You can pass javascript program string for constructor.
define_libfunc("js-new", 1, null, function (ar, intp) {
  // make js object from key-value pair
  var array_to_obj = function (ary) {
    if (ary.length % 2 != 0)
      throw new Error("js-new: odd number of key-value pair");

    var obj = {};
    for (var i = 0; i < ary.length; i += 2) {
      var key = ary[i],
        value = ary[i + 1];
      assert_symbol(key);
      if (isClosure(value)) value = js_closure(value, intp);

      obj[key.name] = value;
    }
    return obj;
  };

  var ctor = ar.shift();
  if (isString(ctor)) ctor = eval2(ctor);

  if (ar.length == 0) {
    return new ctor();
  } else {
    // pack args to js object, if symbol appears
    var args = [];
    for (var i = 0; i < ar.length; i++) {
      if (ar[i] instanceof BiwaSymbol) {
        args.push(array_to_obj(ar.slice(i)));
        break;
      } else {
        args.push(ar[i]);
      }
    }
    // Run `new ctor(...args)`;
    return new (Function.prototype.bind.apply(ctor, [null].concat(args)))();
  }
});

// (js-obj "foo" 1 "bar" 2)
// -> {"foo": 1, "bar": 2}
define_libfunc("js-obj", 0, null, function (ar) {
  if (ar.length % 2 != 0) {
    throw new Error("js-obj: number of arguments must be even");
  }

  var obj = {};
  for (i = 0; i < ar.length / 2; i++) {
    assert_string(ar[i * 2]);
    obj[ar[i * 2]] = ar[i * 2 + 1];
  }
  return obj;
});

const js_closure = function (proc, intp) {
  var intp2 = new Interpreter(intp);
  return function (/*args*/) {
    return intp2.invoke_closure(proc, toArray(arguments));
  };
};
// (js-closure (lambda (event) ..))
// Returns a js function which executes the given procedure.
//
// Example
//   (add-handler! ($ "#btn") "click" (js-closure on-click))
define_libfunc("js-closure", 1, 1, function (ar, intp) {
  assert_closure(ar[0]);
  return js_closure(ar[0], intp);
});

define_libfunc("js-null?", 1, 1, function (ar) {
  return ar[0] === null;
});

define_libfunc("js-undefined?", 1, 1, function (ar) {
  return ar[0] === undefined;
});

define_libfunc("js-function?", 1, 1, function (ar) {
  return isFunction$1(ar[0]);
});

define_libfunc("js-array-to-list", 1, 1, function (ar) {
  deprecate("js-array-to-list", "1.0", "js-array->list");
  return array_to_list(ar[0]);
});

define_libfunc("js-array->list", 1, 1, function (ar) {
  return array_to_list(ar[0]);
});

define_libfunc("list-to-js-array", 1, 1, function (ar) {
  deprecate("list-to-js-array", "1.0", "list->js-array");
  return ar[0].to_array();
});

define_libfunc("list->js-array", 1, 1, function (ar) {
  return ar[0].to_array();
});

define_libfunc("alist-to-js-obj", 1, 1, function (ar) {
  deprecate("alist-to-js-obj", "1.0", "alist->js-obj");
  return alist_to_js_obj(ar[0]);
});

define_libfunc("alist->js-obj", 1, 1, function (ar) {
  assert_list(ar[0]);
  return alist_to_js_obj(ar[0]);
});

define_libfunc("js-obj-to-alist", 1, 1, function (ar) {
  deprecate("js-obj-to-alist", "1.0", "js-obj->alist");
  return js_obj_to_alist(ar[0]);
});
define_libfunc("js-obj->alist", 1, 1, function (ar) {
  return js_obj_to_alist(ar[0]);
});

//
// timer, sleep
//
define_libfunc("timer", 2, 2, function (ar, intp) {
  var proc = ar[0],
    sec = ar[1];
  assert_closure(proc);
  assert_real(sec);
  var intp2 = new Interpreter(intp);
  setTimeout(function () {
    intp2.invoke_closure(proc);
  }, sec * 1000);
  return undef;
});
define_libfunc("set-timer!", 2, 2, function (ar, intp) {
  var proc = ar[0],
    sec = ar[1];
  assert_closure(proc);
  assert_real(sec);
  var intp2 = new Interpreter(intp);
  return setInterval(function () {
    intp2.invoke_closure(proc);
  }, sec * 1000);
});
define_libfunc("clear-timer!", 1, 1, function (ar) {
  var timer_id = ar[0];
  clearInterval(timer_id);
  return undef;
});
define_libfunc("sleep", 1, 1, function (ar) {
  var sec = ar[0];
  assert_real(sec);
  return new Pause(function (pause) {
    setTimeout(function () {
      pause.resume(nil);
    }, sec * 1000);
  });
});

//
// console
//
// (console-debug obj1 ...)
// (console-log obj1 ...)
// (console-info obj1 ...)
// (console-warn obj1 ...)
// (console-error obj1 ...)
//   Put objects to console, if window.console is defined.
//   Returns obj1.
//
// Example:
//     (some-func arg1 (console-debug arg2) arg3)
var define_console_func = function (name) {
  define_libfunc("console-" + name, 1, null, function (ar) {
    var con = window.console;
    if (con) {
      var vals = map(ar, function (item) {
        return inspect(item, { fallback: item });
      });

      con[name].apply(con, vals);
    }
    return ar[0];
  });
};
define_console_func("debug");
define_console_func("log");
define_console_func("info");
define_console_func("warn");
define_console_func("error");

///
/// R6RS Base library
///

//
//        11.4  Expressions
//
//            11.4.1  Quotation
//(quote)
//            11.4.2  Procedures
//(lambda)
//            11.4.3  Conditionaar
//(if)
//            11.4.4  Assignments
//(set!)
//            11.4.5  Derived conditionaar

define_syntax("cond", function (x) {
  var clauses = x.cdr;
  if (!(clauses instanceof Pair) || clauses === nil) {
    throw new BiwaError(
      "malformed cond: cond needs list but got " + write_ss(clauses)
    );
  }
  // TODO: assert that clauses is a proper list

  var ret = null;
  each(clauses.to_array().reverse(), function (clause) {
    if (!(clause instanceof Pair)) {
      throw new BiwaError("bad clause in cond: " + write_ss(clause));
    }

    if (clause.car === Sym("else")) {
      if (ret !== null) {
        throw new BiwaError(
          "'else' clause of cond followed by more clauses: " + write_ss(clauses)
        );
      } else if (clause.cdr === nil) {
        // pattern A: (else)
        //  -> #f            ; not specified in R6RS...?
        ret = false;
      } else if (clause.cdr.cdr === nil) {
        // pattern B: (else expr)
        //  -> expr
        ret = clause.cdr.car;
      } else {
        // pattern C: (else expr ...)
        //  -> (begin expr ...)
        ret = new Pair(Sym("begin"), clause.cdr);
      }
    } else {
      var test = clause.car;
      if (clause.cdr === nil) {
        // pattern 1: (test)
        //  -> (or test ret)
        ret = List(Sym("or"), test, ret);
      } else if (clause.cdr.cdr === nil) {
        // pattern 2: (test expr)
        //  -> (if test expr ret)
        ret = List(Sym("if"), test, clause.cdr.car, ret);
      } else if (clause.cdr.car === Sym("=>")) {
        // pattern 3: (test => expr)
        //  -> (let ((#<gensym1> test))
        //       (if test (expr #<gensym1>) ret))
        var test = clause.car,
          expr = clause.cdr.cdr.car;
        var tmp_sym = gensym();

        ret = List(
          Sym("let"),
          List(List(tmp_sym, test)),
          List(Sym("if"), test, List(expr, tmp_sym), ret)
        );
      } else {
        // pattern 4: (test expr ...)
        //  -> (if test (begin expr ...) ret)
        ret = List(Sym("if"), test, new Pair(Sym("begin"), clause.cdr), ret);
      }
    }
  });
  return ret;
});

define_syntax("case", function (x) {
  var tmp_sym = gensym();

  if (x.cdr === nil) {
    throw new BiwaError("case: at least one clause is required");
  } else if (!(x.cdr instanceof Pair)) {
    throw new BiwaError("case: proper list is required");
  } else {
    // (case key clauses ....)
    //  -> (let ((#<gensym1> key))
    var key = x.cdr.car;
    var clauses = x.cdr.cdr;

    var ret = undefined;
    each(clauses.to_array().reverse(), function (clause) {
      if (clause.car === Sym("else")) {
        // pattern 0: (else expr ...)
        //  -> (begin expr ...)
        if (ret === undefined) {
          ret = new Pair(Sym("begin"), clause.cdr);
        } else {
          throw new BiwaError(
            "case: 'else' clause followed by more clauses: " + write_ss(clauses)
          );
        }
      } else {
        // pattern 1: ((datum ...) expr ...)
        //  -> (if (or (eqv? key (quote d1)) ...) (begin expr ...) ret)
        ret = List(
          Sym("if"),
          new Pair(
            Sym("or"),
            array_to_list(
              map(clause.car.to_array(), function (d) {
                return List(Sym("eqv?"), tmp_sym, List(Sym("quote"), d));
              })
            )
          ),
          new Pair(Sym("begin"), clause.cdr),
          ret
        );
      }
    });
    return new Pair(
      Sym("let1"),
      new Pair(tmp_sym, new Pair(key, new Pair(ret, nil)))
    );
  }
});

define_syntax("and", function (x) {
  // (and a b c) => (if a (if b c #f) #f)
  //todo: check improper list
  if (x.cdr == nil) return true;

  var objs = x.cdr.to_array();
  var i = objs.length - 1;
  var t = objs[i];
  for (i = i - 1; i >= 0; i--) t = List(Sym("if"), objs[i], t, false);

  return t;
});

define_syntax("or", function (x) {
  // (or a b c) => (if a a (if b b (if c c #f)))
  //todo: check improper list

  var objs = x.cdr.to_array();
  var f = false;
  for (var i = objs.length - 1; i >= 0; i--)
    f = List(Sym("if"), objs[i], objs[i], f);

  return f;
});

//            11.4.6  Binding constructs
define_syntax("let", function (x) {
  //(let ((a 1) (b 2)) (print a) (+ a b))
  //=> ((lambda (a b) (print a) (+ a b)) 1 2)
  var name = null;
  if (x.cdr.car instanceof BiwaSymbol) {
    name = x.cdr.car;
    x = x.cdr;
  }
  var binds = x.cdr.car,
    body = x.cdr.cdr;

  if (!(binds instanceof Pair) && binds != nil) {
    throw new BiwaError(
      "let: need a pair for bindings: got " + to_write$1(binds)
    );
  }

  var vars = nil,
    vals = nil;
  for (var p = binds; p instanceof Pair; p = p.cdr) {
    if (!(p.car instanceof Pair)) {
      throw new BiwaError(
        "let: need a pair for bindings: got " + to_write$1(p.car)
      );
    }
    vars = new Pair(p.car.car, vars);
    vals = new Pair(p.car.cdr.car, vals);
  }

  var lambda = null;
  if (name) {
    // (let loop ((a 1) (b 2)) body ..)
    //=> (letrec ((loop (lambda (a b) body ..))) (loop 1 2))
    vars = array_to_list(vars.to_array().reverse());
    vals = array_to_list(vals.to_array().reverse());

    var body_lambda = new Pair(Sym("lambda"), new Pair(vars, body));
    var init_call = new Pair(name, vals);

    lambda = List(
      Sym("letrec"),
      new Pair(List(name, body_lambda), nil),
      init_call
    );
  } else {
    lambda = new Pair(new Pair(Sym("lambda"), new Pair(vars, body)), vals);
  }
  return lambda;
});

define_syntax("let*", function (x) {
  //(let* ((a 1) (b a)) (print a) (+ a b))
  //-> (let ((a 1))
  //     (let ((b a)) (print a) (+ a b)))
  var binds = x.cdr.car,
    body = x.cdr.cdr;

  if (binds === nil) return new Pair(Sym("let"), new Pair(nil, body));

  if (!(binds instanceof Pair))
    throw new BiwaError(
      "let*: need a pair for bindings: got " + to_write$1(binds)
    );

  var ret = null;
  each(binds.to_array().reverse(), function (bind) {
    ret = new Pair(
      Sym("let"),
      new Pair(new Pair(bind, nil), ret == null ? body : new Pair(ret, nil))
    );
  });
  return ret;
});

var expand_letrec_star = function (x) {
  var binds = x.cdr.car,
    body = x.cdr.cdr;

  if (!(binds instanceof Pair))
    throw new BiwaError(
      "letrec*: need a pair for bindings: got " + to_write$1(binds)
    );

  var ret = body;
  each(binds.to_array().reverse(), function (bind) {
    ret = new Pair(new Pair(Sym("set!"), bind), ret);
  });
  var letbody = nil;
  each(binds.to_array().reverse(), function (bind) {
    letbody = new Pair(new Pair(bind.car, new Pair(undef, nil)), letbody);
  });
  return new Pair(Sym("let"), new Pair(letbody, ret));
};
define_syntax("letrec", expand_letrec_star);
define_syntax("letrec*", expand_letrec_star);

define_syntax("let-values", function (x) {
  // (let-values (((a b) (values 1 2))
  //               ((c d . e) (values 3 4 a)))
  //              (print a b c d e))
  // =>
  // (let ((#<gensym1> (lambda () (values 1 2)))
  //       (#<gensym2> (lambda () (values 3 4 a))))
  //   (let*-values (((a b) #<gensym1>)
  //                 ((c d . e) #<gensym2>))
  //                 (print a b c d e)))
  var mv_bindings = x.cdr.car;
  var body = x.cdr.cdr;
  var ret = null;

  var let_bindings = nil;
  var let_star_values_bindings = nil;
  each(mv_bindings.to_array().reverse(), function (item) {
    var init = item.cdr.car;
    var tmpsym = gensym();
    var binding = new Pair(
      tmpsym,
      new Pair(new Pair(Sym("lambda"), new Pair(nil, new Pair(init, nil))), nil)
    );
    let_bindings = new Pair(binding, let_bindings);

    var formals = item.car;
    let_star_values_bindings = new Pair(
      new Pair(formals, new Pair(new Pair(tmpsym, nil), nil)),
      let_star_values_bindings
    );
  });

  var let_star_values = new Pair(
    Sym("let*-values"),
    new Pair(let_star_values_bindings, body)
  );
  ret = new Pair(
    Sym("let"),
    new Pair(let_bindings, new Pair(let_star_values, nil))
  );
  return ret;
});

//let*-values
define_syntax("let*-values", function (x) {
  // (let*-values (((a b) (values 1 2))
  //               ((c d . e) (values 3 4 a)))
  //   (print a b c d e))
  // -> (call-with-values
  //      (lambda () (values 1 2))
  //      (lambda (a b)
  //        (call-with-values
  //          (lambda () (values 3 4 a))
  //          (lambda (c d . e)
  //            (print a b c d e)))))
  var mv_bindings = x.cdr.car;
  var body = x.cdr.cdr;

  var ret = null;

  each(mv_bindings.to_array().reverse(), function (item) {
    var formals = item.car,
      init = item.cdr.car;
    ret = new Pair(
      Sym("call-with-values"),
      new Pair(
        new Pair(Sym("lambda"), new Pair(nil, new Pair(init, nil))),
        new Pair(
          new Pair(
            Sym("lambda"),
            new Pair(formals, ret == null ? body : new Pair(ret, nil))
          ),
          nil
        )
      )
    );
  });
  return ret;
});
//            11.4.7  Sequencing
//(begin)

//
//        11.5  Equivalence predicates
//
define_libfunc("eqv?", 2, 2, function (ar) {
  return eqv(ar[0], ar[1]);
});
define_libfunc("eq?", 2, 2, function (ar) {
  return eq$1(ar[0], ar[1]);
});
define_libfunc("equal?", 2, 2, function (ar) {
  return equal(ar[0], ar[1]);
});

//
//        11.6  Procedure predicate
//
//"procedure?", 1, 1
define_libfunc("procedure?", 1, 1, function (ar) {
  return isProcedure(ar[0]);
});

//
//        11.7  Arithmetic
//

//            11.7.1  Propagation of exactness and inexactness
//            11.7.2  Representability of infinities and NaNs
//            11.7.3  Semantics of common operations
//                11.7.3.1  Integer division
//                11.7.3.2  Transcendental functions
//(no functions are introduced by above sections)

//
//            11.7.4  Numerical operations
//

//                11.7.4.1  Numerical type predicates
define_libfunc("number?", 1, 1, function (ar) {
  return isNumber$2(ar[0]);
});
define_libfunc("complex?", 1, 1, function (ar) {
  return isComplex(ar[0]);
});
define_libfunc("real?", 1, 1, function (ar) {
  return isReal(ar[0]);
});
define_libfunc("rational?", 1, 1, function (ar) {
  return isRational(ar[0]);
});
define_libfunc("integer?", 1, 1, function (ar) {
  return isInteger(ar[0]);
});

//(real-valued? obj)    procedure
//(rational-valued? obj)    procedure
//(integer-valued? obj)    procedure
//
//(exact? z)    procedure
//(inexact? z)    procedure

//                11.7.4.2  Generic conversions
//
//(inexact z)    procedure
//(exact z)    procedure
//
//                11.7.4.3  Arithmetic operations

//inf & nan: ok (for this section)
define_libfunc("=", 2, null, function (ar) {
  var v = ar[0];
  assert_number(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_number(ar[i]);
    if (real_part(ar[i]) != real_part(v)) return false;
    if (imag_part(ar[i]) != imag_part(v)) return false;
  }
  return true;
});
define_libfunc("<", 2, null, function (ar) {
  assert_number(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_number(ar[i]);
    if (!(ar[i - 1] < ar[i])) return false;
  }
  return true;
});
define_libfunc(">", 2, null, function (ar) {
  assert_number(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_number(ar[i]);
    if (!(ar[i - 1] > ar[i])) return false;
  }
  return true;
});
define_libfunc("<=", 2, null, function (ar) {
  assert_number(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_number(ar[i]);
    if (!(ar[i - 1] <= ar[i])) return false;
  }
  return true;
});
define_libfunc(">=", 2, null, function (ar) {
  assert_number(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_number(ar[i]);
    if (!(ar[i - 1] >= ar[i])) return false;
  }
  return true;
});

define_libfunc("zero?", 1, 1, function (ar) {
  assert_number(ar[0]);
  return ar[0] === 0;
});
define_libfunc("positive?", 1, 1, function (ar) {
  assert_number(ar[0]);
  return ar[0] > 0;
});
define_libfunc("negative?", 1, 1, function (ar) {
  assert_number(ar[0]);
  return ar[0] < 0;
});
define_libfunc("odd?", 1, 1, function (ar) {
  assert_number(ar[0]);
  return ar[0] % 2 == 1 || ar[0] % 2 == -1;
});
define_libfunc("even?", 1, 1, function (ar) {
  assert_number(ar[0]);
  return ar[0] % 2 == 0;
});
define_libfunc("finite?", 1, 1, function (ar) {
  assert_number(ar[0]);
  return ar[0] != Infinity && ar[0] != -Infinity && !isNaN(ar[0]);
});
define_libfunc("infinite?", 1, 1, function (ar) {
  assert_number(ar[0]);
  return ar[0] == Infinity || ar[0] == -Infinity;
});
define_libfunc("nan?", 1, 1, function (ar) {
  assert_number(ar[0]);
  return isNaN(ar[0]);
});
define_libfunc("max", 2, null, function (ar) {
  for (var i = 0; i < ar.length; i++) assert_number(ar[i]);

  return Math.max.apply(null, ar);
});
define_libfunc("min", 2, null, function (ar) {
  for (var i = 0; i < ar.length; i++) assert_number(ar[i]);

  return Math.min.apply(null, ar);
});

var complex_or_real = function (real, imag) {
  if (imag === 0) return real;
  return new Complex(real, imag);
};
var polar_or_real = function (magnitude, angle) {
  if (angle === 0) return magnitude;
  return Complex.from_polar(magnitude, angle);
};
define_libfunc("+", 0, null, function (ar) {
  var real = 0;
  var imag = 0;
  for (var i = 0; i < ar.length; i++) {
    assert_number(ar[i]);
    real += real_part(ar[i]);
    imag += imag_part(ar[i]);
  }
  return complex_or_real(real, imag);
});
var the_magnitude = function (n) {
  if (n instanceof Complex) return n.magnitude();
  return n;
};
var the_angle = function (n) {
  if (n instanceof Complex) return n.angle();
  return 0;
};
define_libfunc("*", 0, null, function (ar) {
  var magnitude = 1;
  var angle = 0;
  for (var i = 0; i < ar.length; i++) {
    assert_number(ar[i]);
    magnitude *= the_magnitude(ar[i]);
    angle += the_angle(ar[i]);
  }
  return polar_or_real(magnitude, angle);
});
define_libfunc("-", 1, null, function (ar) {
  var len = ar.length;
  assert_number(ar[0]);

  if (len == 1) {
    if (ar[0] instanceof Complex)
      return new Complex(-real_part(ar[0]), -imag_part(ar[0]));
    return -ar[0];
  } else {
    var real = real_part(ar[0]);
    var imag = imag_part(ar[0]);
    for (var i = 1; i < len; i++) {
      assert_number(ar[i]);
      real -= real_part(ar[i]);
      imag -= imag_part(ar[i]);
    }
    return complex_or_real(real, imag);
  }
});
//for r6rs specification, (/ 0 0) or (/ 3 0) raises '&assertion exception'
define_libfunc("/", 1, null, function (ar) {
  var len = ar.length;
  assert_number(ar[0]);

  if (len == 1) {
    if (ar[0] instanceof Complex)
      return Complex.from_polar(1 / the_magnitude(ar[0]), -the_angle(ar[0]));
    return 1 / ar[0];
  } else {
    var magnitude = the_magnitude(ar[0]);
    var angle = the_angle(ar[0]);
    for (var i = 1; i < len; i++) {
      assert_number(ar[i]);
      magnitude /= the_magnitude(ar[i]);
      angle -= the_angle(ar[i]);
    }
    return polar_or_real(magnitude, angle);
  }
});

define_libfunc("abs", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.abs(ar[0]);
});

var div = function (n, m) {
  return Math.floor(n / m);
};
var mod = function (n, m) {
  return n - Math.floor(n / m) * m;
};
var div0 = function (n, m) {
  return n > 0 ? Math.floor(n / m) : Math.ceil(n / m);
};
var mod0 = function (n, m) {
  return n > 0 ? n - Math.floor(n / m) * m : n - Math.ceil(n / m) * m;
};
define_libfunc("div0-and-mod0", 2, 2, function (ar) {
  assert_number(ar[0]);
  assert_number(ar[1]);
  return new Values$1([div(ar[0], ar[1]), mod(ar[0], ar[1])]);
});
define_libfunc("div", 2, 2, function (ar) {
  assert_number(ar[0]);
  assert_number(ar[1]);
  return div(ar[0], ar[1]);
});
define_libfunc("mod", 2, 2, function (ar) {
  assert_number(ar[0]);
  assert_number(ar[1]);
  return mod(ar[0], ar[1]);
});
define_libfunc("div0-and-mod0", 2, 2, function (ar) {
  assert_number(ar[0]);
  assert_number(ar[1]);
  return new Values$1([div0(ar[0], ar[1]), mod0(ar[0], ar[1])]);
});
define_libfunc("div0", 2, 2, function (ar) {
  assert_number(ar[0]);
  assert_number(ar[1]);
  return div0(ar[0], ar[1]);
});
define_libfunc("mod0", 2, 2, function (ar) {
  assert_number(ar[0]);
  assert_number(ar[1]);
  return mod0(ar[0], ar[1]);
});

//(gcd n1 ...)    procedure
//(lcm n1 ...)    procedure

define_libfunc("numerator", 1, 1, function (ar) {
  assert_number(ar[0]);
  if (ar[0] instanceof Rational) return ar[0].numerator;
  else throw new Bug("todo");
});
define_libfunc("denominator", 1, 1, function (ar) {
  assert_number(ar[0]);
  if (ar[0] instanceof Rational) return ar[0].denominator;
  else throw new Bug("todo");
});
define_libfunc("floor", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.floor(ar[0]);
});
define_libfunc("ceiling", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.ceil(ar[0]);
});
define_libfunc("truncate", 1, 1, function (ar) {
  assert_number(ar[0]);
  return ar[0] < 0 ? Math.ceil(ar[0]) : Math.floor(ar[0]);
});
define_libfunc("round", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.round(ar[0]);
});

//(rationalize x1 x2)    procedure

define_libfunc("exp", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.exp(ar[0]);
});
define_libfunc("log", 1, 2, function (ar) {
  var num = ar[0],
    base = ar[1];
  assert_number(num);

  if (base) {
    // log b num == log e num / log e b
    assert_number(base);
    return Math.log(num) / Math.log(base);
  } else return Math.log(num);
});
define_libfunc("sin", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.sin(ar[0]);
});
define_libfunc("cos", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.cos(ar[0]);
});
define_libfunc("tan", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.tan(ar[0]);
});
define_libfunc("asin", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.asin(ar[0]);
});
define_libfunc("acos", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.acos(ar[0]);
});
define_libfunc("atan", 1, 2, function (ar) {
  assert_number(ar[0]);
  if (ar.length == 2) {
    assert_number(ar[1]);
    return Math.atan2(ar[0], ar[1]);
  } else return Math.atan(ar[0]);
});
define_libfunc("sqrt", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Math.sqrt(ar[0]);
});
define_libfunc("exact-integer-sqrt", 1, 1, function (ar) {
  assert_number(ar[0]);
  var sqrt_f = Math.sqrt(ar[0]);
  var sqrt_i = sqrt_f - (sqrt_f % 1);
  var rest = ar[0] - sqrt_i * sqrt_i;

  return new Values$1([sqrt_i, rest]);
});
define_libfunc("expt", 2, 2, function (ar) {
  assert_number(ar[0]);
  assert_number(ar[1]);
  return Math.pow(ar[0], ar[1]);
});
define_libfunc("make-rectangular", 2, 2, function (ar) {
  assert_number(ar[0]);
  assert_number(ar[1]);
  return new Complex(ar[0], ar[1]);
});
define_libfunc("make-polar", 2, 2, function (ar) {
  assert_number(ar[0]);
  assert_number(ar[1]);
  return Complex.from_polar(ar[0], ar[1]);
});
var real_part = function (n) {
  return Complex.assure(n).real;
};
var imag_part = function (n) {
  return Complex.assure(n).imag;
};
define_libfunc("real-part", 1, 1, function (ar) {
  assert_number(ar[0]);
  return real_part(ar[0]);
});
define_libfunc("imag-part", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Complex.assure(ar[0]).imag;
});
define_libfunc("magnitude", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Complex.assure(ar[0]).magnitude();
});
define_libfunc("angle", 1, 1, function (ar) {
  assert_number(ar[0]);
  return Complex.assure(ar[0]).angle();
});

//
//                11.7.4.4  Numerical Input and Output
//
define_libfunc("number->string", 1, 3, function (ar) {
  var z = ar[0],
    radix = ar[1],
    precision = ar[2];
  if (precision)
    throw new Bug("number->string: precision is not yet implemented");

  radix = radix || 10; //TODO: check radix is 2, 8, 10, or 16.
  return z.toString(radix);
});
define_libfunc("string->number", 1, 3, function (ar) {
  var s = ar[0];

  if (s === "+inf.0") return Infinity;

  if (s === "-inf.0") return -Infinity;

  if (s === "+nan.0") return NaN;

  var radix = ar[1];

  var int_res = parse_integer(s, radix === 0 ? 0 : radix || 10);

  if (int_res !== false) return int_res;

  if (radix !== undefined && radix !== 10) return false;

  var fp_res = parse_float(s);

  if (fp_res !== false) return fp_res;

  var frac_res = parse_fraction(s);

  if (frac_res !== false) return frac_res;

  return false;
});

//
//        11.8  Booleans
//

define_libfunc("not", 1, 1, function (ar) {
  return ar[0] === false ? true : false;
});
define_libfunc("boolean?", 1, 1, function (ar) {
  return ar[0] === false || ar[0] === true ? true : false;
});
define_libfunc("boolean=?", 2, null, function (ar) {
  var len = ar.length;
  for (var i = 1; i < len; i++) {
    if (ar[i] != ar[0]) return false;
  }
  return true;
});

//        11.9  Pairs and lists

define_libfunc("pair?", 1, 1, function (ar) {
  return ar[0] instanceof Pair ? true : false;
});
define_libfunc("cons", 2, 2, function (ar) {
  return new Pair(ar[0], ar[1]);
});
define_libfunc("car", 1, 1, function (ar) {
  //should raise &assertion for '()...
  if (!(ar[0] instanceof Pair))
    throw new BiwaError("Attempt to apply car on " + ar[0]);
  return ar[0].car;
});
define_libfunc("cdr", 1, 1, function (ar) {
  //should raise &assertion for '()...
  if (!(ar[0] instanceof Pair))
    throw new BiwaError("Attempt to apply cdr on " + ar[0]);
  return ar[0].cdr;
});
define_libfunc("set-car!", 2, 2, function (ar) {
  if (!(ar[0] instanceof Pair))
    throw new BiwaError("Attempt to apply set-car! on " + ar[0]);
  ar[0].car = ar[1];
  return undef;
});
define_libfunc("set-cdr!", 2, 2, function (ar) {
  if (!(ar[0] instanceof Pair))
    throw new BiwaError("Attempt to apply set-cdr! on " + ar[0]);
  ar[0].cdr = ar[1];
  return undef;
});

// cadr, caddr, cadddr, etc.
(function () {
  // To traverse into pair and raise error
  var get = function (funcname, spec, obj) {
    var ret = obj;
    each(spec, function (is_cdr) {
      if (ret instanceof Pair) {
        ret = is_cdr ? ret.cdr : ret.car;
      } else {
        throw new BiwaError(
          funcname +
            ": attempt to get " +
            (is_cdr ? "cdr" : "car") +
            " of " +
            ret
        );
      }
    });
    return ret;
  };
  define_libfunc("caar", 1, 1, function (ar) {
    return get("caar", [0, 0], ar[0]);
  });
  define_libfunc("cadr", 1, 1, function (ar) {
    return get("cadr", [1, 0], ar[0]);
  });
  define_libfunc("cdar", 1, 1, function (ar) {
    return get("cadr", [0, 1], ar[0]);
  });
  define_libfunc("cddr", 1, 1, function (ar) {
    return get("cadr", [1, 1], ar[0]);
  });

  define_libfunc("caaar", 1, 1, function (ar) {
    return get("caaar", [0, 0, 0], ar[0]);
  });
  define_libfunc("caadr", 1, 1, function (ar) {
    return get("caadr", [1, 0, 0], ar[0]);
  });
  define_libfunc("cadar", 1, 1, function (ar) {
    return get("cadar", [0, 1, 0], ar[0]);
  });
  define_libfunc("caddr", 1, 1, function (ar) {
    return get("caddr", [1, 1, 0], ar[0]);
  });
  define_libfunc("cdaar", 1, 1, function (ar) {
    return get("cdaar", [0, 0, 1], ar[0]);
  });
  define_libfunc("cdadr", 1, 1, function (ar) {
    return get("cdadr", [1, 0, 1], ar[0]);
  });
  define_libfunc("cddar", 1, 1, function (ar) {
    return get("cddar", [0, 1, 1], ar[0]);
  });
  define_libfunc("cdddr", 1, 1, function (ar) {
    return get("cdddr", [1, 1, 1], ar[0]);
  });

  define_libfunc("caaaar", 1, 1, function (ar) {
    return get("caaaar", [0, 0, 0, 0], ar[0]);
  });
  define_libfunc("caaadr", 1, 1, function (ar) {
    return get("caaadr", [1, 0, 0, 0], ar[0]);
  });
  define_libfunc("caadar", 1, 1, function (ar) {
    return get("caadar", [0, 1, 0, 0], ar[0]);
  });
  define_libfunc("caaddr", 1, 1, function (ar) {
    return get("caaddr", [1, 1, 0, 0], ar[0]);
  });
  define_libfunc("cadaar", 1, 1, function (ar) {
    return get("cadaar", [0, 0, 1, 0], ar[0]);
  });
  define_libfunc("cadadr", 1, 1, function (ar) {
    return get("cadadr", [1, 0, 1, 0], ar[0]);
  });
  define_libfunc("caddar", 1, 1, function (ar) {
    return get("caddar", [0, 1, 1, 0], ar[0]);
  });
  define_libfunc("cadddr", 1, 1, function (ar) {
    return get("cadddr", [1, 1, 1, 0], ar[0]);
  });
  define_libfunc("cdaaar", 1, 1, function (ar) {
    return get("cdaaar", [0, 0, 0, 1], ar[0]);
  });
  define_libfunc("cdaadr", 1, 1, function (ar) {
    return get("cdaadr", [1, 0, 0, 1], ar[0]);
  });
  define_libfunc("cdadar", 1, 1, function (ar) {
    return get("cdadar", [0, 1, 0, 1], ar[0]);
  });
  define_libfunc("cdaddr", 1, 1, function (ar) {
    return get("cdaddr", [1, 1, 0, 1], ar[0]);
  });
  define_libfunc("cddaar", 1, 1, function (ar) {
    return get("cddaar", [0, 0, 1, 1], ar[0]);
  });
  define_libfunc("cddadr", 1, 1, function (ar) {
    return get("cddadr", [1, 0, 1, 1], ar[0]);
  });
  define_libfunc("cdddar", 1, 1, function (ar) {
    return get("cdddar", [0, 1, 1, 1], ar[0]);
  });
  define_libfunc("cddddr", 1, 1, function (ar) {
    return get("cddddr", [1, 1, 1, 1], ar[0]);
  });
})();

define_libfunc("null?", 1, 1, function (ar) {
  return ar[0] === nil;
});
define_libfunc("list?", 1, 1, function (ar) {
  return isList(ar[0]);
});
define_libfunc("list", 0, null, function (ar) {
  var l = nil;
  for (var i = ar.length - 1; i >= 0; i--) l = new Pair(ar[i], l);
  return l;
});
define_libfunc("length", 1, 1, function (ar) {
  assert_list(ar[0]);
  var n = 0;
  for (var o = ar[0]; o != nil; o = o.cdr) n++;
  return n;
});
define_libfunc("append", 1, null, function (ar) {
  var k = ar.length;
  var ret = ar[--k];
  while (k--) {
    each(ar[k].to_array().reverse(), function (item) {
      ret = new Pair(item, ret);
    });
  }
  return ret;
});
define_libfunc("reverse", 1, 1, function (ar) {
  // (reverse '()) => '()
  if (ar[0] == nil) return nil;
  assert_pair(ar[0]);

  var l = nil;
  for (var o = ar[0]; o != nil; o = o.cdr) l = new Pair(o.car, l);
  return l;
});
define_libfunc("list-tail", 2, 2, function (ar) {
  assert_pair(ar[0]);
  assert_integer(ar[1]);
  if (ar[1] < 0)
    throw new BiwaError("list-tail: index out of range (" + ar[1] + ")");

  var o = ar[0];
  for (var i = 0; i < ar[1]; i++) {
    if (!(o instanceof Pair))
      throw new BiwaError("list-tail: the list is shorter than " + ar[1]);
    o = o.cdr;
  }
  return o;
});
define_libfunc("list-ref", 2, 2, function (ar) {
  assert_pair(ar[0]);
  assert_integer(ar[1]);
  if (ar[1] < 0)
    throw new BiwaError("list-tail: index out of range (" + ar[1] + ")");

  var o = ar[0];
  for (var i = 0; i < ar[1]; i++) {
    if (!(o instanceof Pair))
      throw new BiwaError("list-ref: the list is shorter than " + ar[1]);
    o = o.cdr;
  }
  return o.car;
});
define_libfunc("map", 2, null, function (ar) {
  var proc = ar.shift(),
    lists = ar;
  each(lists, assert_list);

  var a = [];
  return Call.multi_foreach(lists, {
    // Called for each element
    // input: the element (or the elements, if more than one list is given)
    // output: a Call request of proc and args
    call: function (xs) {
      return new Call(
        proc,
        map(xs, function (x) {
          return x.car;
        })
      );
    },

    // Called when each Call request is finished
    // input: the result of Call request,
    //   the element(s) of the Call request (which is not used here)
    // output: `undefined' to continue,
    //   some value to terminate (the value will be the result)
    result: function (res) {
      a.push(res);
    },

    // Called when reached to the end of the list(s)
    // input: none
    // output: the resultant value
    finish: function () {
      return array_to_list(a);
    },
  });
});
define_libfunc("for-each", 2, null, function (ar) {
  var proc = ar.shift(),
    lists = ar;
  each(lists, assert_list);

  return Call.multi_foreach(lists, {
    call: function (xs) {
      return new Call(
        proc,
        map(xs, function (x) {
          return x.car;
        })
      );
    },
    finish: function () {
      return undef;
    },
  });
});

//        11.10  Symbols

define_libfunc("symbol?", 1, 1, function (ar) {
  return ar[0] instanceof BiwaSymbol ? true : false;
});
define_libfunc("symbol->string", 1, 1, function (ar) {
  assert_symbol(ar[0]);
  return ar[0].name;
});
define_libfunc("symbol=?", 2, null, function (ar) {
  assert_symbol(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_symbol(ar[i]);
    if (ar[i] != ar[0]) return false;
  }
  return true;
});
define_libfunc("string->symbol", 1, 1, function (ar) {
  assert_string(ar[0]);
  return Sym(ar[0]);
});

//
//        11.11  Characters
//
define_libfunc("char?", 1, 1, function (ar) {
  return ar[0] instanceof Char;
});
define_libfunc("char->integer", 1, 1, function (ar) {
  assert_char(ar[0]);
  return ar[0].value.charCodeAt(0);
});
define_libfunc("integer->char", 1, 1, function (ar) {
  assert_integer(ar[0]);
  return Char.get(String.fromCharCode(ar[0]));
});

var make_char_compare_func = function (test) {
  return function (ar) {
    assert_char(ar[0]);
    for (var i = 1; i < ar.length; i++) {
      assert_char(ar[i]);
      if (!test(ar[i - 1].value, ar[i].value)) return false;
    }
    return true;
  };
};
define_libfunc(
  "char=?",
  2,
  null,
  make_char_compare_func(function (a, b) {
    return a == b;
  })
);
define_libfunc(
  "char<?",
  2,
  null,
  make_char_compare_func(function (a, b) {
    return a < b;
  })
);
define_libfunc(
  "char>?",
  2,
  null,
  make_char_compare_func(function (a, b) {
    return a > b;
  })
);
define_libfunc(
  "char<=?",
  2,
  null,
  make_char_compare_func(function (a, b) {
    return a <= b;
  })
);
define_libfunc(
  "char>=?",
  2,
  null,
  make_char_compare_func(function (a, b) {
    return a >= b;
  })
);

//
//        11.12  Strings
//
define_libfunc("string?", 1, 1, function (ar) {
  return typeof ar[0] == "string";
});
define_libfunc("make-string", 1, 2, function (ar) {
  assert_integer(ar[0]);
  var c = " ";
  if (ar[1]) {
    assert_char(ar[1]);
    c = ar[1].value;
  }
  var out = "";
  times(ar[0], function () {
    out += c;
  });
  return out;
});
define_libfunc("string", 0, null, function (ar) {
  if (ar.length == 0) return "";
  for (var i = 0; i < ar.length; i++) assert_char(ar[i]);
  return map(ar, function (c) {
    return c.value;
  }).join("");
});
define_libfunc("string-length", 1, 1, function (ar) {
  assert_string(ar[0]);
  return ar[0].length;
});
define_libfunc("string-ref", 2, 2, function (ar) {
  assert_string(ar[0]);
  assert_between(ar[1], 0, ar[0].length - 1);
  return Char.get(ar[0].charAt([ar[1]]));
});
define_libfunc("string=?", 2, null, function (ar) {
  assert_string(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_string(ar[i]);
    if (ar[0] != ar[i]) return false;
  }
  return true;
});
define_libfunc("string<?", 2, null, function (ar) {
  assert_string(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_string(ar[i]);
    if (!(ar[i - 1] < ar[i])) return false;
  }
  return true;
});
define_libfunc("string>?", 2, null, function (ar) {
  assert_string(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_string(ar[i]);
    if (!(ar[i - 1] > ar[i])) return false;
  }
  return true;
});
define_libfunc("string<=?", 2, null, function (ar) {
  assert_string(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_string(ar[i]);
    if (!(ar[i - 1] <= ar[i])) return false;
  }
  return true;
});
define_libfunc("string>=?", 2, null, function (ar) {
  assert_string(ar[0]);
  for (var i = 1; i < ar.length; i++) {
    assert_string(ar[i]);
    if (!(ar[i - 1] >= ar[i])) return false;
  }
  return true;
});

define_libfunc("substring", 3, 3, function (ar) {
  assert_string(ar[0]);
  assert_integer(ar[1]);
  assert_integer(ar[2]);

  if (ar[1] < 0) throw new BiwaError("substring: start too small: " + ar[1]);
  if (ar[2] < 0) throw new BiwaError("substring: end too small: " + ar[2]);
  if (ar[0].length + 1 <= ar[1])
    throw new BiwaError("substring: start too big: " + ar[1]);
  if (ar[0].length + 1 <= ar[2])
    throw new BiwaError("substring: end too big: " + ar[2]);
  if (!(ar[1] <= ar[2]))
    throw new BiwaError("substring: not start <= end: " + ar[1] + ", " + ar[2]);

  return ar[0].substring(ar[1], ar[2]);
});

define_libfunc("string-append", 0, null, function (ar) {
  for (var i = 0; i < ar.length; i++) assert_string(ar[i]);

  return ar.join("");
});
define_libfunc("string->list", 1, 1, function (ar) {
  assert_string(ar[0]);
  return array_to_list(
    map(ar[0].split(""), function (s) {
      return Char.get(s[0]);
    })
  );
});
define_libfunc("list->string", 1, 1, function (ar) {
  assert_list(ar[0]);
  return map(ar[0].to_array(), function (c) {
    return c.value;
  }).join("");
});
define_libfunc("string-for-each", 2, null, function (ar) {
  var proc = ar.shift(),
    strs = ar;
  each(strs, assert_string);

  return Call.multi_foreach(strs, {
    call: function (chars) {
      return new Call(proc, chars);
    },
    finish: function () {
      return undef;
    },
  });
});
define_libfunc("string-copy", 1, 1, function (ar) {
  // note: this is useless, because javascript strings are immutable
  assert_string(ar[0]);
  return ar[0];
});

//
//        11.13  Vectors
//
define_libfunc("vector?", 1, 1, function (ar) {
  return isVector(ar[0]);
});
define_libfunc("make-vector", 1, 2, function (ar) {
  assert_integer(ar[0]);
  var vec = new Array(ar[0]);

  if (ar.length == 2) {
    for (var i = 0; i < ar[0]; i++) vec[i] = ar[1];
  }
  return vec;
});
define_libfunc("vector", 0, null, function (ar) {
  return ar;
});
define_libfunc("vector-length", 1, 1, function (ar) {
  assert_vector(ar[0]);
  return ar[0].length;
});
define_libfunc("vector-ref", 2, 2, function (ar) {
  assert_vector(ar[0]);
  assert_integer(ar[1]);
  assert_between(ar[1], 0, ar[0].length - 1);

  return ar[0][ar[1]];
});
define_libfunc("vector-set!", 3, 3, function (ar) {
  assert_vector(ar[0]);
  assert_integer(ar[1]);

  ar[0][ar[1]] = ar[2];
  return undef;
});
define_libfunc("vector->list", 1, 1, function (ar) {
  assert_vector(ar[0]);
  return array_to_list(ar[0]);
});
define_libfunc("list->vector", 1, 1, function (ar) {
  assert_list(ar[0]);
  return ar[0].to_array();
});
define_libfunc("vector-fill!", 2, 2, function (ar) {
  assert_vector(ar[0]);
  var vec = ar[0],
    obj = ar[1];

  for (var i = 0; i < vec.length; i++) vec[i] = obj;
  return vec;
});
define_libfunc("vector-map", 2, null, function (ar) {
  var proc = ar.shift(),
    vecs = ar;
  each(vecs, assert_vector);

  var a = [];
  return Call.multi_foreach(vecs, {
    call: function (objs) {
      return new Call(proc, objs);
    },
    result: function (res) {
      a.push(res);
    },
    finish: function () {
      return a;
    },
  });
});
define_libfunc("vector-for-each", 2, null, function (ar) {
  var proc = ar.shift(),
    vecs = ar;
  each(vecs, assert_vector);

  return Call.multi_foreach(vecs, {
    call: function (objs) {
      return new Call(proc, objs);
    },
    finish: function () {
      return undef;
    },
  });
});

//
//        11.14  Errors and violations
//
//(error who message irritant1 ...)    procedure
//(assertion-violation who message irritant1 ...)    procedure
//(assert <expression>)    syntax

//
//        11.15  Control features
//
define_libfunc("apply", 2, null, function (ar) {
  var proc = ar.shift(),
    rest_args = ar.pop(),
    args = ar;
  args = args.concat(rest_args.to_array());

  return new Call(proc, args);
});
define_syntax("call-with-current-continuation", function (x) {
  return new Pair(Sym("call/cc"), x.cdr);
});
define_libfunc("values", 0, null, function (ar) {
  if (ar.length == 1)
    // eg. (values 3)
    return ar[0];
  else return new Values$1(ar);
});
define_libfunc("call-with-values", 2, 2, function (ar) {
  var producer = ar[0],
    consumer = ar[1];
  assert_procedure(producer);
  assert_procedure(consumer);
  return new Call(producer, [], function (ar) {
    var result = ar[0];
    if (result instanceof Values$1) {
      return new Call(consumer, result.content);
    } else {
      // eg. (call-with-values (lambda () 3)
      //                       (lambda (x) x))
      return new Call(consumer, [result]);
    }
  });
});

define_libfunc("dynamic-wind", 3, 3, function (ar, intp) {
  var before = ar[0],
    thunk = ar[1],
    after = ar[2];
  return new Call(before, [], function () {
    intp.push_dynamic_winder(before, after);
    return new Call(thunk, [], function (ar2) {
      var result = ar2[0];
      intp.pop_dynamic_winder();
      return new Call(after, [], function () {
        return result;
      });
    });
  });
});

//        11.16  Iteration
//named let

//        11.17  Quasiquotation
// `() is expanded to `cons` and `append`.
// `#() is expanded to `vector` and `vector-append`.
var expand_qq = function (f, lv) {
  if (f instanceof BiwaSymbol || f === nil) {
    return List(Sym("quote"), f);
  } else if (f instanceof Pair) {
    var car = f.car;
    if (car instanceof Pair && car.car === Sym("unquote-splicing")) {
      if (lv == 1)
        return List(Sym("append"), f.car.cdr.car, expand_qq(f.cdr, lv));
      else
        return List(
          Sym("cons"),
          List(
            Sym("list"),
            List(Sym("quote"), Sym("unquote-splicing")),
            expand_qq(f.car.cdr.car, lv - 1)
          ),
          expand_qq(f.cdr, lv)
        );
    } else if (car === Sym("unquote")) {
      if (lv == 1) return f.cdr.car;
      else
        return List(
          Sym("list"),
          List(Sym("quote"), Sym("unquote")),
          expand_qq(f.cdr.car, lv - 1)
        );
    } else if (car === Sym("quasiquote"))
      return List(
        Sym("list"),
        List(Sym("quote"), Sym("quasiquote")),
        expand_qq(f.cdr.car, lv + 1)
      );
    else return List(Sym("cons"), expand_qq(f.car, lv), expand_qq(f.cdr, lv));
  } else if (f instanceof Array) {
    var vecs = [[]];
    for (var i = 0; i < f.length; i++) {
      if (f[i] instanceof Pair && f[i].car === Sym("unquote-splicing")) {
        if (lv == 1) {
          var item = List(Sym("list->vector"), f[i].cdr.car);
          item["splicing"] = true;
          vecs.push(item);
          vecs.push([]);
        } else {
          var item = List(
            Sym("cons"),
            List(
              Sym("list"),
              List(Sym("quote"), Sym("unquote-splicing")),
              expand_qq(f[i].car.cdr.car, lv - 1)
            ),
            expand_qq(f[i].cdr, lv)
          );
          last(vecs).push(item);
        }
      } else {
        // Expand other things as the same as if they are in a list quasiquote
        last(vecs).push(expand_qq(f[i], lv));
      }
    }

    var vectors = vecs.map(function (vec) {
      if (vec["splicing"]) {
        return vec;
      } else {
        return Cons(Sym("vector"), array_to_list(vec));
      }
    });
    if (vectors.length == 1) {
      return Cons(Sym("vector"), array_to_list(vecs[0]));
    } else {
      return Cons(Sym("vector-append"), array_to_list(vectors));
    }
  } else return f;
};
define_syntax("quasiquote", function (x) {
  return expand_qq(x.cdr.car, 1);
});
//unquote
define_syntax("unquote", function (x) {
  throw new BiwaError("unquote(,) must be inside quasiquote(`)");
});
//unquote-splicing
define_syntax("unquote-splicing", function (x) {
  throw new BiwaError("unquote-splicing(,@) must be inside quasiquote(`)");
});

//        11.18  Binding constructs for syntactic keywords
//let-syntax
//letrec-syntax

//        11.19  Macro transformers
//syntax-rules
//identifier-syntax
//

//        11.20  Tail calls and tail contexts
//(no library function introduced)

///
/// R6RS Standard Libraries
///

//
// Chapter 1 Unicode
//
//(char-upcase char)    procedure
//(char-downcase char)    procedure
//(char-titlecase char)    procedure
//(char-foldcase char)    procedure
//
//(char-ci=? char1 char2 char3 ...)    procedure
//(char-ci<? char1 char2 char3 ...)    procedure
//(char-ci>? char1 char2 char3 ...)    procedure
//(char-ci<=? char1 char2 char3 ...)    procedure
//(char-ci>=? char1 char2 char3 ...)    procedure
//
//(char-alphabetic? char)    procedure
//(char-numeric? char)    procedure
//(char-whitespace? char)    procedure
//(char-upper-case? char)    procedure
//(char-lower-case? char)    procedure
//(char-title-case? char)    procedure
//
//(char-general-category char)    procedure

//(string-upcase string)    procedure
define_libfunc("string-upcase", 1, 1, function (ar) {
  assert_string(ar[0]);
  return ar[0].toUpperCase();
});
//(string-downcase string)    procedure
define_libfunc("string-downcase", 1, 1, function (ar) {
  assert_string(ar[0]);
  return ar[0].toLowerCase();
});
//(string-titlecase string)    procedure
//(string-foldcase string)    procedure

const make_string_ci_function = function (compare) {
  return function (ar) {
    assert_string(ar[0]);
    var str = ar[0].toUpperCase();

    for (var i = 1; i < ar.length; i++) {
      assert_string(ar[i]);
      if (!compare(str, ar[i].toUpperCase())) return false;
    }
    return true;
  };
};
//(string-ci=? string1 string2 string3 ...)    procedure
define_libfunc(
  "string-ci=?",
  2,
  null,
  make_string_ci_function(function (a, b) {
    return a == b;
  })
);
//(string-ci<? string1 string2 string3 ...)    procedure
define_libfunc(
  "string-ci<?",
  2,
  null,
  make_string_ci_function(function (a, b) {
    return a < b;
  })
);
//(string-ci>? string1 string2 string3 ...)    procedure
define_libfunc(
  "string-ci>?",
  2,
  null,
  make_string_ci_function(function (a, b) {
    return a > b;
  })
);
//(string-ci<=? string1 string2 string3 ...)    procedure
define_libfunc(
  "string-ci<=?",
  2,
  null,
  make_string_ci_function(function (a, b) {
    return a <= b;
  })
);
//(string-ci>=? string1 string2 string3 ...)    procedure
define_libfunc(
  "string-ci>=?",
  2,
  null,
  make_string_ci_function(function (a, b) {
    return a >= b;
  })
);

//(string-normalize-nfd string)    procedure
//(string-normalize-nfkd string)    procedure
//(string-normalize-nfc string)    procedure
//(string-normalize-nfkc string)    procedure

//
// Chapter 2 Bytevectors
//

//
// Chapter 3 List utilities
//
define_libfunc("find", 2, 2, function (ar) {
  var proc = ar[0],
    ls = ar[1];
  assert_list(ls);
  return Call.foreach(ls, {
    call: function (x) {
      return new Call(proc, [x.car]);
    },
    result: function (res, x) {
      if (res) return x.car;
    },
    finish: function () {
      return false;
    },
  });
});
define_libfunc("for-all", 2, null, function (ar) {
  var proc = ar.shift();
  var lists = ar;
  each(lists, assert_list);

  var last = true; //holds last result which proc returns
  return Call.multi_foreach(lists, {
    call: function (pairs) {
      return new Call(
        proc,
        map(pairs, function (x) {
          return x.car;
        })
      );
    },
    result: function (res, pairs) {
      if (res === false) return false;
      last = res;
    },
    finish: function () {
      return last;
    },
  });
});
define_libfunc("exists", 2, null, function (ar) {
  var proc = ar.shift();
  var lists = ar;
  each(lists, assert_list);

  return Call.multi_foreach(lists, {
    call: function (pairs) {
      return new Call(
        proc,
        map(pairs, function (x) {
          return x.car;
        })
      );
    },
    result: function (res, pairs) {
      if (res !== false) return res;
    },
    finish: function () {
      return false;
    },
  });
});
define_libfunc("filter", 2, 2, function (ar) {
  var proc = ar[0],
    ls = ar[1];
  assert_list(ls);

  var a = [];
  return Call.foreach(ls, {
    call: function (x) {
      return new Call(proc, [x.car]);
    },
    result: function (res, x) {
      if (res) a.push(x.car);
    },
    finish: function () {
      return array_to_list(a);
    },
  });
});
//  define_scmfunc("partition+", 2, 2,
//    "(lambda (proc ls)  \
//       (define (partition2 proc ls t f) \
//         (if (null? ls) \
//           (values (reverse t) (reverse f)) \
//           (if (proc (car ls)) \
//             (partition2 proc (cdr ls) (cons (car ls) t) f) \
//             (partition2 proc (cdr ls) t (cons (car ls) f))))) \
//       (partition2 proc ls '() '()))");

define_libfunc("partition", 2, 2, function (ar) {
  var proc = ar[0],
    ls = ar[1];
  assert_list(ls);

  var t = [],
    f = [];
  return Call.foreach(ls, {
    call: function (x) {
      return new Call(proc, [x.car]);
    },
    result: function (res, x) {
      if (res) t.push(x.car);
      else f.push(x.car);
    },
    finish: function () {
      return new Values$1([array_to_list(t), array_to_list(f)]);
    },
  });
});
define_libfunc("fold-left", 3, null, function (ar) {
  var proc = ar.shift(),
    accum = ar.shift(),
    lists = ar;
  each(lists, assert_list);

  return Call.multi_foreach(lists, {
    call: function (pairs) {
      var args = map(pairs, function (x) {
        return x.car;
      });
      args.unshift(accum);
      return new Call(proc, args);
    },
    result: function (res, pairs) {
      accum = res;
    },
    finish: function () {
      return accum;
    },
  });
});
define_libfunc("fold-right", 3, null, function (ar) {
  var proc = ar.shift(),
    accum = ar.shift();
  var lists = map(ar, function (ls) {
    // reverse each list
    assert_list(ls);
    return array_to_list(ls.to_array().reverse());
  });

  return Call.multi_foreach(lists, {
    call: function (pairs) {
      var args = map(pairs, function (x) {
        return x.car;
      });
      args.push(accum);
      return new Call(proc, args);
    },
    result: function (res, pairs) {
      accum = res;
    },
    finish: function () {
      return accum;
    },
  });
});
define_libfunc("remp", 2, 2, function (ar) {
  var proc = ar[0],
    ls = ar[1];
  assert_list(ls);

  var ret = [];
  return Call.foreach(ls, {
    call: function (x) {
      return new Call(proc, [x.car]);
    },
    result: function (res, x) {
      if (!res) ret.push(x.car);
    },
    finish: function () {
      return array_to_list(ret);
    },
  });
});
var make_remover = function (key) {
  return function (ar) {
    var obj = ar[0],
      ls = ar[1];
    assert_list(ls);

    var ret = [];
    return Call.foreach(ls, {
      call: function (x) {
        return new Call(TopEnv[key] || CoreEnv[key], [obj, x.car]);
      },
      result: function (res, x) {
        if (!res) ret.push(x.car);
      },
      finish: function () {
        return array_to_list(ret);
      },
    });
  };
};
define_libfunc("remove", 2, 2, make_remover("equal?"));
define_libfunc("remv", 2, 2, make_remover("eqv?"));
define_libfunc("remq", 2, 2, make_remover("eq?"));

define_libfunc("memp", 2, 2, function (ar) {
  var proc = ar[0],
    ls = ar[1];
  assert_list(ls);
  return Call.foreach(ls, {
    call: function (x) {
      return new Call(proc, [x.car]);
    },
    result: function (res, x) {
      if (res) return x;
    },
    finish: function () {
      return false;
    },
  });
});
var make_finder = function (key) {
  return function (ar) {
    var obj = ar[0],
      ls = ar[1];
    assert_list(ls);
    return Call.foreach(ls, {
      call: function (x) {
        return new Call(TopEnv[key] || CoreEnv[key], [obj, x.car]);
      },
      result: function (res, x) {
        if (res) return x;
      },
      finish: function () {
        return false;
      },
    });
  };
};
define_libfunc("member", 2, 2, make_finder("equal?"));
define_libfunc("memv", 2, 2, make_finder("eqv?"));
define_libfunc("memq", 2, 2, make_finder("eq?"));

define_libfunc("assp", 2, 2, function (ar) {
  var proc = ar[0],
    als = ar[1];
  assert_list(als);
  return Call.foreach(als, {
    call: function (x) {
      if (x.car.car) return new Call(proc, [x.car.car]);
      else
        throw new BiwaError("ass*: pair required but got " + to_write$1(x.car));
    },
    result: function (res, x) {
      if (res) return x.car;
    },
    finish: function () {
      return false;
    },
  });
});
var make_assoc = function (func_name, eq_func_name) {
  return function (ar) {
    var obj = ar[0],
      list = ar[1];
    assert_list(list);
    return Call.foreach(list, {
      call: function (ls) {
        if (!isPair(ls.car))
          throw new BiwaError(
            func_name + ": pair required but got " + to_write$1(ls.car)
          );

        var equality = TopEnv[eq_func_name] || CoreEnv[eq_func_name];
        return new Call(equality, [obj, ls.car.car]);
      },
      result: function (was_equal, ls) {
        if (was_equal) return ls.car;
      },
      finish: function () {
        return false;
      },
    });
  };
};
define_libfunc("assoc", 2, 2, make_assoc("assoc", "equal?"));
define_libfunc("assv", 2, 2, make_assoc("assv", "eqv?"));
define_libfunc("assq", 2, 2, make_assoc("assq", "eq?"));

define_libfunc("cons*", 1, null, function (ar) {
  if (ar.length == 1) return ar[0];
  else {
    var ret = null;
    each(ar.reverse(), function (x) {
      if (ret) {
        ret = new Pair(x, ret);
      } else ret = x;
    });
    return ret;
  }
});

//
// Chapter 4 Sorting
//
(function () {
  // Destructively sort the given array
  // with scheme function `proc` as comparator
  var mergeSort = function (ary, proc, finish) {
    if (ary.length <= 1) return finish(ary);
    return mergeSort_(ary, proc, finish, [[0, ary.length, false]], false);
  };

  var mergeSort_ = function (ary, proc, finish, stack, up) {
    while (true) {
      var start = stack[stack.length - 1][0],
        end = stack[stack.length - 1][1],
        left = stack[stack.length - 1][2];
      var len = end - start;
      //console.debug("mergeSort_", ary, stack.join(' '), up?"u":"d", ""+start+".."+(end-1))

      if (len >= 2 && !up) {
        // There are parts to be sorted
        stack.push([start, start + (len >> 1), true]);
        continue;
      } else if (left) {
        // Left part sorted. Continue to the right one
        stack.pop();
        var rend = stack[stack.length - 1][1];
        stack.push([end, rend, false]);
        up = false;
        continue;
      } else {
        // Right part sorted. Merge left and right
        stack.pop();
        var lstart = stack[stack.length - 1][0];
        var ary1 = ary.slice(lstart, start),
          ary2 = ary.slice(start, end);
        return merge_(ary1, ary2, proc, [], 0, 0, function (ret) {
          //console.debug("mergeSortd", ary, stack.join(' '), up?"u":"d", ary1, ary2, ret, ""+start+".."+(start+len-1));
          for (var i = 0; i < ret.length; i++) {
            ary[lstart + i] = ret[i];
          }

          if (stack.length == 1) {
            return finish(ary);
          } else {
            return mergeSort_(ary, proc, finish, stack, true);
          }
        });
      }
    }
  };

  var merge_ = function (ary1, ary2, proc, ret, i, j, cont) {
    //console.debug("merge_", ary1, ary2, ret, i, j);
    var len1 = ary1.length,
      len2 = ary2.length;
    if (i < len1 && j < len2) {
      return new Call(proc, [ary2[j], ary1[i]], function (ar) {
        //console.debug("comp", [ary2[j], ary1[i]], ar[0]);
        if (ar[0]) {
          ret.push(ary2[j]);
          j += 1;
        } else {
          ret.push(ary1[i]);
          i += 1;
        }
        return merge_(ary1, ary2, proc, ret, i, j, cont);
      });
    } else {
      while (i < len1) {
        ret.push(ary1[i]);
        i += 1;
      }
      while (j < len2) {
        ret.push(ary2[j]);
        j += 1;
      }
      return cont(ret);
    }
  };

  var compareFn = function (a, b) {
    return lt(a, b) ? -1 : lt(b, a) ? 1 : 0;
  };

  define_libfunc("list-sort", 1, 2, function (ar) {
    if (ar[1]) {
      assert_procedure(ar[0]);
      assert_list(ar[1]);
      return mergeSort(ar[1].to_array(), ar[0], function (ret) {
        return array_to_list(ret);
      });
    } else {
      assert_list(ar[0]);
      return array_to_list(ar[0].to_array().sort(compareFn));
    }
  });

  //(vector-sort proc vector)    procedure
  define_libfunc("vector-sort", 1, 2, function (ar) {
    if (ar[1]) {
      assert_procedure(ar[0]);
      assert_vector(ar[1]);
      return mergeSort(clone(ar[1]), ar[0], function (ret) {
        return ret;
      });
    } else {
      assert_vector(ar[0]);
      return clone(ar[0]).sort(compareFn);
    }
  });

  //(vector-sort! proc vector)    procedure
  define_libfunc("vector-sort!", 1, 2, function (ar) {
    if (ar[1]) {
      assert_procedure(ar[0]);
      assert_vector(ar[1]);
      return mergeSort(ar[1], ar[0], function (ret) {
        return undef;
      });
    } else {
      assert_vector(ar[0]);
      ar[0].sort(compareFn);
      return undef;
    }
  });
})();

//
// Chapter 5 Control Structures
//
define_syntax("when", function (x) {
  //(when test body ...)
  //=> (if test (begin body ...) #<undef>)
  var test = x.cdr.car,
    body = x.cdr.cdr;

  return new Pair(
    Sym("if"),
    new Pair(test, new Pair(new Pair(Sym("begin"), body), new Pair(undef, nil)))
  );
});

define_syntax("unless", function (x) {
  //(unless test body ...)
  //=> (if (not test) (begin body ...) #<undef>)
  var test = x.cdr.car,
    body = x.cdr.cdr;

  return new Pair(
    Sym("if"),
    new Pair(
      new Pair(Sym("not"), new Pair(test, nil)),
      new Pair(new Pair(Sym("begin"), body), new Pair(undef, nil))
    )
  );
});

define_syntax("do", function (x) {
  //(do ((var1 init1 step1)
  //     (var2 init2 step2) ...)
  //    (test expr1 expr2 ...)
  //  body1 body2 ...)
  //=> (let loop` ((var1 init1) (var2 init2) ...)
  //     (if test
  //       (begin expr1 expr2 ...)
  //       (begin body1 body2 ...
  //              (loop` step1 step2 ...)))))

  // parse arguments
  if (!isPair(x.cdr)) throw new BiwaError("do: no variables of do");
  var varsc = x.cdr.car;
  if (!isPair(varsc))
    throw new BiwaError("do: variables must be given as a list");
  if (!isPair(x.cdr.cdr)) throw new BiwaError("do: no resulting form of do");
  var resultc = x.cdr.cdr.car;
  var bodyc = x.cdr.cdr.cdr;

  // construct subforms
  var loop = gensym();

  var init_vars = array_to_list(
    varsc.map(function (var_def) {
      var a = var_def.to_array();
      return List(a[0], a[1]);
    })
  );

  var test = resultc.car;
  var result_exprs = new Pair(Sym("begin"), resultc.cdr);

  var next_loop = new Pair(
    loop,
    array_to_list(
      varsc.map(function (var_def) {
        var a = var_def.to_array();
        return a[2] || a[0];
      })
    )
  );
  var body_exprs = new Pair(Sym("begin"), bodyc).concat(List(next_loop));

  // combine subforms
  return List(
    Sym("let"),
    loop,
    init_vars,
    List(Sym("if"), test, result_exprs, body_exprs)
  );
});

//(case-lambda <case-lambda clause> ...)    syntax
define_syntax("case-lambda", function (x) {
  if (!isPair(x.cdr))
    throw new BiwaError("case-lambda: at least 1 clause required");
  var clauses = x.cdr.to_array();

  var args_ = gensym();
  var exec = List(Sym("raise"), "case-lambda: no matching clause found");

  clauses.reverse().forEach(function (clause) {
    if (!isPair(clause))
      throw new BiwaError(
        "case-lambda: clause must be a pair: " + to_write$1(clause)
      );
    var formals = clause.car,
      clause_body = clause.cdr;

    if (formals === nil) {
      exec = List(
        Sym("if"),
        List(Sym("null?"), args_),
        new Pair(Sym("begin"), clause_body),
        exec
      );
    } else if (isPair(formals)) {
      var len = formals.length(),
        last_cdr = formals.last_cdr();
      var pred = last_cdr === nil ? Sym("=") : Sym(">=");
      var lambda = new Pair(Sym("lambda"), new Pair(formals, clause_body));
      exec = List(
        Sym("if"),
        List(pred, List(Sym("length"), args_), len),
        List(Sym("apply"), lambda, args_),
        exec
      );
    } else if (isSymbol$1(formals)) {
      exec = new Pair(
        Sym("let1"),
        new Pair(formals, new Pair(args_, clause_body))
      );
      // Note: previous `exec` is just discarded because this is a wildcard pattern.
    } else {
      throw new BiwaError(
        "case-lambda: invalid formals: " + to_write$1(formals)
      );
    }
  });

  return List(Sym("lambda"), args_, exec);
});

//
// Chapter 6 Records
// see also: src/system/record.js
//

// 6.2 Records: Syntactic layer
//eqv, eq

//(define-record-type <name spec> <record clause>*)    syntax
define_syntax("define-record-type", function (x) {
  // (define-record-type <name spec> <record clause>*)
  var name_spec = x.cdr.car;
  var record_clauses = x.cdr.cdr;

  // 1. parse name spec
  // <name spec>: either
  // - <record name> eg: point
  // - (<record name> <constructor name> <predicate name>)
  //   eg: (point make-point point?)
  if (isSymbol$1(name_spec)) {
    var record_name = name_spec;
    var constructor_name = Sym("make-" + name_spec.name);
    var predicate_name = Sym(name_spec.name + "?");
  } else {
    assert_list(name_spec);
    var record_name = name_spec.car;
    var constructor_name = name_spec.cdr.car;
    var predicate_name = name_spec.cdr.cdr.car;
    assert_symbol(record_name);
    assert_symbol(constructor_name);
    assert_symbol(predicate_name);
  }

  // 2. parse record clauses
  var sealed = false;
  var opaque = false;
  var uid = false;
  var parent_name;
  var parent_rtd = false;
  var parent_cd = false;
  var protocol = false;
  var fields = [];

  // <record clause>:
  each(record_clauses.to_array(), function (clause) {
    switch (clause.car) {
      // - (fields <field spec>*)
      case Sym("fields"):
        fields = map(clause.cdr.to_array(), function (field_spec, idx) {
          if (isSymbol$1(field_spec)) {
            // - <field name>
            return {
              name: field_spec,
              idx: idx,
              mutable: false,
              accessor_name: null,
              mutator_name: null,
            };
          } else {
            assert_list(field_spec);
            assert_symbol(field_spec.car);
            switch (field_spec.car) {
              case Sym("immutable"):
                // - (immutable <field name>)
                // - (immutable <field name> <accessor name>)
                var field_name = field_spec.cdr.car;
                assert_symbol(field_name);

                if (isNil(field_spec.cdr.cdr))
                  return { name: field_name, idx: idx, mutable: false };
                else
                  return {
                    name: field_name,
                    idx: idx,
                    mutable: false,
                    accessor_name: field_spec.cdr.cdr.car,
                  };

              case Sym("mutable"):
                // - (mutable <field name>)
                // - (mutable <field name> <accessor name> <mutator name>)
                var field_name = field_spec.cdr.car;
                assert_symbol(field_name);

                if (isNil(field_spec.cdr.cdr))
                  return { name: field_name, idx: idx, mutable: true };
                else
                  return {
                    name: field_name,
                    idx: idx,
                    mutable: true,
                    accessor_name: field_spec.cdr.cdr.car,
                    mutator_name: field_spec.cdr.cdr.cdr.car,
                  };
              default:
                throw new BiwaError(
                  "define-record-type: field definition " +
                    "must start with `immutable' or `mutable' " +
                    "but got " +
                    inspect(field_spec.car)
                );
            }
          }
        });
        break;
      // - (parent <name>)
      case Sym("parent"):
        parent_name = clause.cdr.car;
        assert_symbol(parent_name);
        break;
      // - (protocol <expr>)
      case Sym("protocol"):
        protocol = clause.cdr.car;
        break;
      // - (sealed <bool>)
      case Sym("sealed"):
        sealed = !!clause.cdr.car;
        break;
      // - (opaque <bool>)
      case Sym("opaque"):
        opaque = !!clause.cdr.car;
        break;
      // - (nongenerative <uid>?)
      case Sym("nongenerative"):
        uid = clause.cdr.car;
        break;
      // - (parent-rtd <rtd> <cd>)
      case Sym("parent-rtd"):
        parent_rtd = clause.cdr.car;
        parent_cd = clause.cdr.cdr.car;
        break;
      default:
        throw new BiwaError(
          "define-record-type: unknown clause `" + to_write$1(clause.car) + "'"
        );
    }
  });

  if (parent_name) {
    parent_rtd = [Sym("record-type-descriptor"), parent_name];
    parent_cd = [Sym("record-constructor-descriptor"), parent_name];
  }

  // 3. build the definitions
  // Note: In this implementation, rtd and cd are not bound to symbols.
  // They are referenced through record name by record-type-descriptor
  // and record-constructor-descriptor. These relation are stored in
  // the hash BiwaScheme.Record._DefinedTypes.
  var rtd = [Sym("record-type-descriptor"), record_name];
  var cd = [Sym("record-constructor-descriptor"), record_name];

  // registration
  var rtd_fields = map(fields, function (field) {
    return List(Sym(field.mutable ? "mutable" : "immutable"), field.name);
  });
  rtd_fields.is_vector = true; //tell List not to convert
  var rtd_def = [
    Sym("make-record-type-descriptor"),
    [Sym("quote"), record_name],
    parent_rtd,
    uid,
    sealed,
    opaque,
    rtd_fields,
  ];
  var cd_def = [
    Sym("make-record-constructor-descriptor"),
    Sym("__rtd"),
    parent_cd,
    protocol,
  ];
  var registration = [
    Sym("let*"),
    [
      [Sym("__rtd"), rtd_def],
      [Sym("__cd"), cd_def],
    ],
    [
      Sym("_define-record-type"),
      [Sym("quote"), record_name],
      Sym("__rtd"),
      Sym("__cd"),
    ],
  ];

  // accessors and mutators
  var accessor_defs = map(fields, function (field) {
    var name =
      field.accessor_name || Sym(record_name.name + "-" + field.name.name);

    return [Sym("define"), name, [Sym("record-accessor"), rtd, field.idx]];
  });

  var mutator_defs = filter(fields, function (field) {
    return field.mutable;
  });
  mutator_defs = map(mutator_defs, function (field) {
    var name =
      field.mutator_name ||
      Sym(record_name.name + "-" + field.name.name + "-set!");

    return [Sym("define"), name, [Sym("record-mutator"), rtd, field.idx]];
  });

  // Wrap the definitions with `begin'
  // Example:
  //   (begin
  //     (let* ((__rtd (make-record-type-descriptor 'square
  //                     (record-type-descriptor rect)
  //                     #f #f #f
  //                     #((mutable w) (mutable h))))
  //            (__cd (make-record-constructor-descriptor __rtd
  //                    (record-constructor-descriptor rect)
  //                    (lambda (n) ...))))
  //       (_define-record-type 'square __rtd __cd))
  //
  //     (define make-square
  //       (record-constructor
  //         (record-constructor-descriptor square)))
  //     (define square?
  //       (record-predicate (record-type-descriptor square)))
  //     (define square-w
  //       (record-accessor (record-type-descriptor square) 0))
  //     (define square-h
  //       (record-accessor (record-type-descriptor square) 1))
  //     (define set-square-w!
  //       (record-mutator (record-type-descriptor square) 0))
  //     (define set-square-h!
  //       (record-mutator (record-type-descriptor square) 1)))
  //
  return deep_array_to_list(
    [
      Sym("begin"),
      registration,
      [Sym("define"), constructor_name, [Sym("record-constructor"), cd]],
      [Sym("define"), predicate_name, [Sym("record-predicate"), rtd]],
    ]
      .concat(accessor_defs)
      .concat(mutator_defs)
  );
});

define_libfunc("_define-record-type", 3, 3, function (ar) {
  assert_symbol(ar[0]);
  assert_record_td(ar[1]);
  assert_record_cd(ar[2]);
  Record.define_type(ar[0].name, ar[1], ar[2]);
  return undef;
});

//(record-type-descriptor <record name>)    syntax
define_syntax("record-type-descriptor", function (x) {
  return deep_array_to_list([
    Sym("_record-type-descriptor"),
    [Sym("quote"), x.cdr.car],
  ]);
});
define_libfunc("_record-type-descriptor", 1, 1, function (ar) {
  assert_symbol(ar[0]);
  var type = Record.get_type(ar[0].name);
  if (type) return type.rtd;
  else
    throw new BiwaError(
      "record-type-descriptor: unknown record type " + ar[0].name
    );
});

//(record-constructor-descriptor <record name>)    syntax
define_syntax("record-constructor-descriptor", function (x) {
  return deep_array_to_list([
    Sym("_record-constructor-descriptor"),
    [Sym("quote"), x.cdr.car],
  ]);
});
define_libfunc("_record-constructor-descriptor", 1, 1, function (ar) {
  assert_symbol(ar[0]);
  var type = Record.get_type(ar[0].name);
  if (type) return type.cd;
  else
    throw new BiwaError(
      "record-constructor-descriptor: unknown record type " + ar[0].name
    );
});

// 6.3  Records: Procedural layer
//(make-record-type-descriptor name    procedure
define_libfunc("make-record-type-descriptor", 6, 6, function (ar) {
  var name = ar[0],
    parent_rtd = ar[1],
    uid = ar[2],
    sealed = ar[3],
    opaque = ar[4],
    fields = ar[5];

  assert_symbol(name);
  if (parent_rtd) assert_record_td(parent_rtd);
  if (uid) {
    assert_symbol(uid);
    var _rtd = Record.RTD.NongenerativeRecords[uid.name];
    if (_rtd) {
      // the record type is already defined.
      return _rtd;
      // should check equality of other arguments..
    }
  }
  sealed = !!sealed;
  opaque = !!opaque;
  assert_vector(fields);
  for (var i = 0; i < fields.length; i++) {
    var list = fields[i];
    assert_symbol(list.car, "mutability");
    assert_symbol(list.cdr.car, "field name");
    fields[i] = [list.cdr.car.name, list.car == Sym("mutable")];
  }
  var rtd = new Record.RTD(name, parent_rtd, uid, sealed, opaque, fields);
  if (uid) Record.RTD.NongenerativeRecords[uid.name] = rtd;

  return rtd;
});

//(record-type-descriptor? obj)    procedure
define_libfunc("record-type-descriptor?", 1, 1, function (ar) {
  return ar[0] instanceof Record.RTD;
});

//(make-record-constructor-descriptor rtd    procedure
define_libfunc("make-record-constructor-descriptor", 3, 3, function (ar) {
  var rtd = ar[0],
    parent_cd = ar[1],
    protocol = ar[2];

  assert_record_td(rtd);
  if (parent_cd) assert_record_cd(parent_cd);
  if (protocol) assert_procedure(protocol);

  return new Record.CD(rtd, parent_cd, protocol);
});

//(record-constructor constructor-descriptor)    procedure
define_libfunc("record-constructor", 1, 1, function (ar) {
  var cd = ar[0];
  assert_record_cd(cd);

  return cd.record_constructor();
});

//(record-predicate rtd)    procedure
define_libfunc("record-predicate", 1, 1, function (ar) {
  var rtd = ar[0];
  assert_record_td(rtd);

  return function (args) {
    var obj = args[0];

    return obj instanceof Record && obj.rtd === rtd;
  };
});

//(record-accessor rtd k)    procedure
define_libfunc("record-accessor", 2, 2, function (ar) {
  var rtd = ar[0],
    k = ar[1];
  assert_record_td(rtd);
  assert_integer(k);
  for (var _rtd = rtd.parent_rtd; _rtd; _rtd = _rtd.parent_rtd)
    k += _rtd.fields.length;

  return function (args) {
    var record = args[0];
    var error_msg =
      rtd.name.name +
      "-" +
      rtd.field_name(k) +
      ": " +
      to_write$1(record) +
      " is not a " +
      rtd.name.name;
    assert(isRecord(record), error_msg);

    var descendant = false;
    for (var _rtd = record.rtd; _rtd; _rtd = _rtd.parent_rtd) {
      if (_rtd == rtd) descendant = true;
    }
    assert(descendant, error_msg);

    return record.get(k);
  };
});

//(record-mutator rtd k)    procedure
define_libfunc("record-mutator", 2, 2, function (ar) {
  var rtd = ar[0],
    k = ar[1];
  assert_record_td(rtd);
  assert_integer(k);
  for (var _rtd = rtd.parent_rtd; _rtd; _rtd = _rtd.parent_rtd)
    k += _rtd.fields.length;

  return function (args) {
    var record = args[0],
      val = args[1];
    var func_name = rtd.field_name(k);

    assert_record(record);
    assert(
      record.rtd === rtd,
      func_name + ": " + to_write$1(record) + " is not a " + rtd.name.name
    );
    assert(
      !record.rtd.sealed,
      func_name + ": " + rtd.name.name + " is sealed (can't mutate)"
    );

    record.set(k, val);
  };
});

// 6.4  Records: Inspection
//(record? obj)    procedure
define_libfunc("record?", 1, 1, function (ar) {
  var obj = ar[0];
  if (isRecord(obj)) {
    if (obj.rtd.opaque) return false;
    // opaque records pretend as if it is not a record.
    else return true;
  } else return false;
});

//(record-rtd record)    procedure
define_libfunc("record-rtd", 1, 1, function (ar) {
  assert_record(ar[0]);
  return ar[0].rtd;
});

//(record-type-name rtd)    procedure
define_libfunc("record-type-name", 1, 1, function (ar) {
  assert_record_td(ar[0]);
  return ar[0].name;
});

//(record-type-parent rtd)    procedure
define_libfunc("record-type-parent", 1, 1, function (ar) {
  assert_record_td(ar[0]);
  return ar[0].parent_rtd;
});

//(record-type-uid rtd)    procedure
define_libfunc("record-type-uid", 1, 1, function (ar) {
  assert_record_td(ar[0]);
  return ar[0].uid;
});

//(record-type-generative? rtd)    procedure
define_libfunc("record-type-generative?", 1, 1, function (ar) {
  assert_record_td(ar[0]);
  return ar[0].generative;
});

//(record-type-sealed? rtd)    procedure
define_libfunc("record-type-sealed?", 1, 1, function (ar) {
  assert_record_td(ar[0]);
  return ar[0].sealed;
});

//(record-type-opaque? rtd)    procedure
define_libfunc("record-type-opaque?", 1, 1, function (ar) {
  assert_record_td(ar[0]);
  return ar[0].opaque;
});

//(record-type-field-names rtd)    procedure
define_libfunc("record-type-field-names", 1, 1, function (ar) {
  assert_record_td(ar[0]);
  return map(ar[0].fields, function (field) {
    return field.name;
  });
});

//(record-field-mutable? rtd k)    procedure
define_libfunc("record-field-mutable?", 2, 2, function (ar) {
  var rtd = ar[0],
    k = ar[1];
  assert_record_td(ar[0]);
  assert_integer(k);

  for (var _rtd = rtd.parent_rtd; _rtd; _rtd = _rtd.parent_rtd)
    k += _rtd.fields.length;

  return ar[0].fields[k].mutable;
});

//
// Chapter 7 Exceptions and conditions
//
//(with-exception-handler handler thunk)    procedure
//(guard (<variable>    syntax
//(raise obj)    procedure
define_libfunc("raise", 1, 1, function (ar) {
  throw new UserError(to_write$1(ar[0]));
});
//(raise-continuable obj)    procedure
//
//&condition    condition type
//(condition condition1 ...)    procedure
//(simple-conditions condition)    procedure
//(condition? obj)    procedure
//(condition-predicate rtd)    procedure
//(condition-accessor rtd proc)    procedure
//
//&message    condition type
//&warning    condition type
//&serious    condition type
//&error    condition type
//&violation    condition type
//&assertion    condition type
//&irritants    condition type
//&who    condition type
//&non-continuable    condition type
//&implementation-restriction    condition type
//&lexical    condition type
//&syntax    condition type
//&undefined    condition type

//
// Chapter 8 I/O
//
//  //    8  I/O
//  //        8.1  Condition types
//&i/o    condition type
//&i/o-read    condition type
//&i/o-write    condition type
//&i/o-invalid-position    condition type
//&i/o-filename    condition type
//&i/o-file-protection    condition type
//&i/o-file-is-read-only    condition type
//&i/o-file-already-exists    condition type
//&i/o-file-does-not-exist    condition type
//&i/o-port    condition type
//
//  //        8.2  Port I/O
//  //            8.2.1  File names
//  //(no function introduced)
//
//  //            8.2.2  File options
//(file-options <file-options symbol> ...)    syntax
//
//  //            8.2.3  Buffer modes
//(buffer-mode <buffer-mode symbol>)    syntax
//(buffer-mode? obj)    procedure
//
//  //            8.2.4  Transcoders
//(latin-1-codec)    procedure
//(utf-8-codec)    procedure
//(utf-16-codec)    procedure
//(eol-style <eol-style symbol>)    syntax
//(native-eol-style)    procedure
//&i/o-decoding    condition type
//&i/o-encoding    condition type
//(error-handling-mode <error-handling-mode symbol>)    syntax
//(make-transcoder codec)    procedure
//(make-transcoder codec eol-style)    procedure
//(make-transcoder codec eol-style handling-mode)    procedure
//(native-transcoder)    procedure
//(transcoder-codec transcoder)    procedure
//(transcoder-eol-style transcoder)    procedure
//(transcoder-error-handling-mode transcoder)    procedure
//(bytevector->string bytevector transcoder)    procedure
//(string->bytevector string transcoder)    procedure
//
//            8.2.5  End-of-file object
//-> 8.3 (eof-object)    procedure
//-> 8.3 (eof-object? obj)    procedure

//            8.2.6  Input and output ports
define_libfunc("port?", 1, 1, function (ar) {
  return ar[0] instanceof Port;
});
//(port-transcoder port)    procedure
define_libfunc("textual-port?", 1, 1, function (ar) {
  assert_port(ar[0]);
  return !ar[0].is_binary;
});
define_libfunc("binary-port?", 1, 1, function (ar) {
  assert_port(ar[0]);
  return ar[0].is_binary;
});
//(transcoded-port binary-port transcoder)    procedure
//(port-has-port-position? port)    procedure
//(port-position port)    procedure
//(port-has-set-port-position!? port)    procedure
//(set-port-position! port pos)    procedure
define_libfunc("close-port", 1, 1, function (ar) {
  assert_port(ar[0]);
  ar[0].close();
  return undef;
});
//(call-with-port port proc)    procedure
define_libfunc("call-with-port", 2, 2, function (ar) {
  var port = ar[0],
    proc = ar[1];
  assert_port(port);
  assert_closure(proc);

  return new Call(proc, [port], function (ar) {
    // Automatically close the port
    port.close();
    return ar[0]; // TODO: values
  });
});

//            8.2.7  Input ports
//8.3 (input-port? obj)    procedure
//(port-eof? input-port)    procedure
//(open-file-input-port filename)    procedure
//(open-bytevector-input-port bytevector)    procedure
//(open-string-input-port string)    procedure
//(standard-input-port)    procedure
//8.3 (current-input-port)    procedure
//(make-custom-binary-input-port id read!    procedure
//(make-custom-textual-input-port id read!    procedure
//
//  //            8.2.8  Binary input
//(get-u8 binary-input-port)    procedure
//(lookahead-u8 binary-input-port)    procedure
//(get-bytevector-n binary-input-port count)    procedure
//(get-bytevector-n! binary-input-port    procedure
//(get-bytevector-some binary-input-port)    procedure
//(get-bytevector-all binary-input-port)    procedure
//
//  //            8.2.9  Textual input
//(get-char textual-input-port)    procedure
//(lookahead-char textual-input-port)    procedure
//(get-string-n textual-input-port count)    procedure
//(get-string-n! textual-input-port string start count)    procedure
//(get-string-all textual-input-port)    procedure
//(get-line textual-input-port)    procedure
//(get-datum textual-input-port)    procedure
//
//            8.2.10  Output ports
//8.3 (output-port? obj)    procedure
//(flush-output-port output-port)    procedure
//(output-port-buffer-mode output-port)    procedure
//(open-file-output-port filename)    procedure
//(open-bytevector-output-port)    procedure
//(call-with-bytevector-output-port proc)    procedure
//(open-string-output-port)    procedure
//(call-with-string-output-port proc)    procedure
define_libfunc("call-with-string-output-port", 1, 1, function (ar) {
  var proc = ar[0];
  assert_procedure(proc);

  var port = new Port.StringOutput();

  return new Call(proc, [port], function (ar) {
    port.close();
    return port.output_string();
  });
});

//(standard-output-port)    procedure
//(standard-error-port)    procedure
//8.3 (current-output-port)    procedure
//8.3 (current-error-port)    procedure
//(make-custom-binary-output-port id    procedure
//(make-custom-textual-output-port id write! get-position set-position! close)
//  define_libfunc("make-custom-textual-output-port", 5, 5, function(ar){
//    assert_string(ar[0]);
//    assert_closure(ar[1]);
//    assert_closure(ar[2]);
//    assert_closure(ar[3]);
//    assert_closure(ar[4]);
//    return new Port(ar[0], ar[1], ar[2], ar[3], ar[4]);
//  })
//
//  //            8.2.11  Binary output
//(put-u8 binary-output-port octet)    procedure
//(put-bytevector binary-output-port bytevector)    procedure
//
//            8.2.12  Textual output
define_libfunc("put-char", 2, 2, function (ar) {
  assert_port(ar[0]);
  assert_char(ar[1]);
  ar[0].put_string(ar[1].value);
  return undef;
});
define_libfunc("put-string", 2, 2, function (ar) {
  assert_port(ar[0]);
  assert_string(ar[1]);
  ar[0].put_string(ar[1]);
  return undef;
});
define_libfunc("put-datum", 2, 2, function (ar) {
  assert_port(ar[0]);
  ar[0].put_string(to_write$1(ar[1]));
  return undef;
});
//
//  //            8.2.13  Input/output ports
//(open-file-input/output-port filename)    procedure
//(make-custom-binary-input/output-port    procedure
//(make-custom-textual-input/output-port    procedure
//
//  //        8.3  Simple I/O
define_libfunc("eof-object", 0, 0, function (ar) {
  return eof;
});
define_libfunc("eof-object?", 1, 1, function (ar) {
  return ar[0] === eof;
});
//(call-with-input-file filename proc)    procedure
//(call-with-output-file filename proc)    procedure
define_libfunc("input-port?", 1, 1, function (ar) {
  assert_port(ar[0]);
  return ar[0].is_input;
});
define_libfunc("output-port?", 1, 1, function (ar) {
  assert_port(ar[0]);
  return ar[0].is_output;
});
define_libfunc("current-input-port", 0, 0, function (ar) {
  return Port.current_input;
});
define_libfunc("current-output-port", 0, 0, function (ar) {
  return Port.current_output;
});
define_libfunc("current-error-port", 0, 0, function (ar) {
  return Port.current_error;
});
//(with-input-from-file filename thunk)    procedure
//(with-output-to-file filename thunk)    procedure
//(open-input-file filename)    procedure
//(open-output-file filename)    procedure
define_libfunc("close-input-port", 1, 1, function (ar) {
  assert_port(ar[0]);
  if (!ar[0].is_input)
    throw new BiwaError("close-input-port: port is not input port");
  ar[0].close();
  return undef;
});
define_libfunc("close-output-port", 1, 1, function (ar) {
  assert_port(ar[0]);
  if (!ar[0].is_output)
    throw new BiwaError("close-output-port: port is not output port");
  ar[0].close();
  return undef;
});
//(read-char)    procedure
//(peek-char)    procedure
define_libfunc("read", 0, 1, function (ar) {
  var port = ar[0] || Port.current_input;
  assert_port(port);

  return port.get_string(function (str) {
    return Interpreter.read(str);
  });
});

define_libfunc("write-char", 1, 2, function (ar) {
  var port = ar[1] || Port.current_output;
  assert_char(ar[0]);
  port.put_string(ar[0].value);
  return undef;
});
define_libfunc("newline", 0, 1, function (ar) {
  var port = ar[0] || Port.current_output;
  port.put_string("\n");
  return undef;
});
define_libfunc("display", 1, 2, function (ar) {
  var port = ar[1] || Port.current_output;
  port.put_string(to_display(ar[0]));
  return undef;
});
define_libfunc("write", 1, 2, function (ar) {
  var port = ar[1] || Port.current_output;
  assert_port(port);
  port.put_string(to_write$1(ar[0]));
  return undef;
});
define_libfunc("write-shared", 1, 2, function (ar) {
  var port = ar[1] || Port.current_output;
  assert_port(port);
  port.put_string(write_shared(ar[0]));
  return undef;
});
define_libfunc("write-simple", 1, 2, function (ar) {
  var port = ar[1] || Port.current_output;
  assert_port(port);
  port.put_string(write_simple(ar[0]));
  return undef;
});

//
// Chapter 9 File System
// Chapter 10 Command-line access and exit values
//
// see src/library/node_functions.js

//
// Chapter 11 Arithmetic
//
////        11.1  Bitwise operations
////        11.2  Fixnums
//(fixnum? obj)    procedure
//(fixnum-width)    procedure
//(least-fixnum)    procedure
//(greatest-fixnum)    procedure
//(fx=? fx1 fx2 fx3 ...)    procedure
//(fx>? fx1 fx2 fx3 ...)    procedure
//(fx<? fx1 fx2 fx3 ...)    procedure
//(fx>=? fx1 fx2 fx3 ...)    procedure
//(fx<=? fx1 fx2 fx3 ...)    procedure
//(fxzero? fx)    procedure
//(fxpositive? fx)    procedure
//(fxnegative? fx)    procedure
//(fxodd? fx)    procedure
//(fxeven? fx)    procedure
//(fxmax fx1 fx2 ...)    procedure
//(fxmin fx1 fx2 ...)    procedure
//(fx+ fx1 fx2)    procedure
//(fx* fx1 fx2)    procedure
//(fx- fx1 fx2)    procedure
//(fxdiv-and-mod fx1 fx2)    procedure
//(fxdiv fx1 fx2)    procedure
//(fxmod fx1 fx2)    procedure
//(fxdiv0-and-mod0 fx1 fx2)    procedure
//(fxdiv0 fx1 fx2)    procedure
//(fxmod0 fx1 fx2)    procedure
//(fx+/carry fx1 fx2 fx3)    procedure
//(fx-/carry fx1 fx2 fx3)    procedure
//(fx*/carry fx1 fx2 fx3)    procedure
//(fxnot fx)    procedure
//(fxand fx1 ...)    procedure
//(fxior fx1 ...)    procedure
//(fxxor fx1 ...)    procedure
//(fxif fx1 fx2 fx3)    procedure
//(fxbit-count fx)    procedure
//(fxlength fx)    procedure
//(fxfirst-bit-set fx)    procedure
//(fxbit-set? fx1 fx2)    procedure
//(fxcopy-bit fx1 fx2 fx3)    procedure
//(fxbit-field fx1 fx2 fx3)    procedure
//(fxcopy-bit-field fx1 fx2 fx3 fx4)    procedure
//(fxarithmetic-shift fx1 fx2)    procedure
//(fxarithmetic-shift-left fx1 fx2)    procedure
//(fxarithmetic-shift-right fx1 fx2)    procedure
//(fxrotate-bit-field fx1 fx2 fx3 fx4)    procedure
//(fxreverse-bit-field fx1 fx2 fx3)    procedure
//
////        11.3  Flonums
//(flonum? obj)    procedure
//(real->flonum x)    procedure
//(fl=? fl1 fl2 fl3 ...)    procedure
//(fl<? fl1 fl2 fl3 ...)    procedure
//(fl<=? fl1 fl2 fl3 ...)    procedure
//(fl>? fl1 fl2 fl3 ...)    procedure
//(fl>=? fl1 fl2 fl3 ...)    procedure
//(flinteger? fl)    procedure
//(flzero? fl)    procedure
//(flpositive? fl)    procedure
//(flnegative? fl)    procedure
//(flodd? ifl)    procedure
//(fleven? ifl)    procedure
//(flfinite? fl)    procedure
//(flinfinite? fl)    procedure
//(flnan? fl)    procedure
//(flmax fl1 fl2 ...)    procedure
//(flmin fl1 fl2 ...)    procedure
//(fl+ fl1 ...)    procedure
//(fl* fl1 ...)    procedure
//(fl- fl1 fl2 ...)    procedure
//(fl- fl)    procedure
//(fl/ fl1 fl2 ...)    procedure
//(fl/ fl)    procedure
//(flabs fl)    procedure
//(fldiv-and-mod fl1 fl2)    procedure
//(fldiv fl1 fl2)    procedure
//(flmod fl1 fl2)    procedure
//(fldiv0-and-mod0 fl1 fl2)    procedure
//(fldiv0 fl1 fl2)    procedure
//(flmod0 fl1 fl2)    procedure
//(flnumerator fl)    procedure
//(fldenominator fl)    procedure
//(flfloor fl)    procedure
//(flceiling fl)    procedure
//(fltruncate fl)    procedure
//(flround fl)    procedure
//(flexp fl)    procedure
//(fllog fl)    procedure
//(fllog fl1 fl2)    procedure
//(flsin fl)    procedure
//(flcos fl)    procedure
//(fltan fl)    procedure
//(flasin fl)    procedure
//(flacos fl)    procedure
//(flatan fl)    procedure
//(flatan fl1 fl2)    procedure
//(flsqrt fl)    procedure
//(flexpt fl1 fl2)    procedure
//&no-infinities    condition type
//&no-nans    condition type
//(fixnum->flonum fx)    procedure

////        11.4  Exact bitwise arithmetic
//(bitwise-not ei)    procedure
define_libfunc("bitwise-not", 1, 1, function (ar) {
  return ~ar[0];
});

//(bitwise-and ei1 ...)    procedure
define_libfunc("bitwise-and", 1, null, function (ar) {
  return reduce(ar, function (ret, item) {
    return ret & item;
  });
});

//(bitwise-ior ei1 ...)    procedure
define_libfunc("bitwise-ior", 1, null, function (ar) {
  return reduce(ar, function (ret, item) {
    return ret | item;
  });
});

//(bitwise-xor ei1 ...)    procedure
define_libfunc("bitwise-xor", 1, null, function (ar) {
  return reduce(ar, function (ret, item) {
    return ret ^ item;
  });
});

//(bitwise-if ei1 ei2 ei3)    procedure
define_libfunc("bitwise-if", 3, 3, function (ar) {
  return (ar[0] & ar[1]) | (~ar[0] & ar[2]);
});

//(bitwise-bit-count ei)    procedure
define_libfunc("bitwise-bit-count", 1, 1, function (ar) {
  var e = Math.abs(ar[0]),
    ret = 0;
  for (; e != 0; e >>= 1) {
    if (e & 1) ret++;
  }
  return ret;
});

//(bitwise-length ei)    procedure
define_libfunc("bitwise-length", 1, 1, function (ar) {
  var e = Math.abs(ar[0]),
    ret = 0;
  for (; e != 0; e >>= 1) {
    ret++;
  }
  return ret;
});

//(bitwise-first-bit-set ei)    procedure
define_libfunc("bitwise-first-bit-set", 1, 1, function (ar) {
  var e = Math.abs(ar[0]),
    ret = 0;
  if (e == 0) return -1;
  for (; e != 0; e >>= 1) {
    if (e & 1) return ret;
    ret++;
  }
});

//(bitwise-bit-set? ei1 ei2)    procedure
define_libfunc("bitwise-bit-set?", 2, 2, function (ar) {
  return !!(ar[0] & (1 << ar[1]));
});

//(bitwise-copy-bit ei1 n b)    procedure
define_libfunc("bitwise-copy-bit", 3, 3, function (ar) {
  var mask = 1 << ar[1];
  return (
    (mask & (ar[2] << ar[1])) | // Set n-th bit to b
    (~mask & ar[0])
  ); // and use ei1 for rest of the bits
});

//(bitwise-bit-field ei1 start end)    procedure
define_libfunc("bitwise-bit-field", 3, 3, function (ar) {
  var mask = ~(-1 << ar[2]); // Has 1 at 0...end
  return (mask & ar[0]) >> ar[1];
});

//(bitwise-copy-bit-field dst start end src)    procedure
define_libfunc("bitwise-copy-bit-field", 4, 4, function (ar) {
  var dst = ar[0],
    start = ar[1],
    end = ar[2],
    src = ar[3];
  var mask =
    ~(-1 << end) & // Has 1 at 0...end
    (-1 << start); // Clear 0...start
  return (mask & (src << start)) | (~mask & dst);
});

//(bitwise-arithmetic-shift ei1 ei2)    procedure
define_libfunc("bitwise-arithmetic-shift", 2, 2, function (ar) {
  return ar[1] >= 0 ? ar[0] << ar[1] : ar[0] >> -ar[1];
});

//(bitwise-arithmetic-shift-left ei1 ei2)    procedure
define_libfunc("bitwise-arithmetic-shift-left", 2, 2, function (ar) {
  return ar[0] << ar[1];
});

//(bitwise-arithmetic-shift-right ei1 ei2)    procedure
define_libfunc("bitwise-arithmetic-shift-right", 2, 2, function (ar) {
  return ar[0] >> ar[1];
});

//(bitwise-rotate-bit-field ei1 start end count)    procedure
define_libfunc("bitwise-rotate-bit-field", 4, 4, function (ar) {
  var n = ar[0],
    start = ar[1],
    end = ar[2],
    count = ar[3];
  var width = end - start;
  if (width <= 0) return n;

  count %= width;
  var orig_field = (~(-1 << end) & n) >> start;
  var rotated_field = (orig_field << count) | (orig_field >> (width - count));

  var mask = ~(-1 << end) & (-1 << start);
  return (mask & (rotated_field << start)) | (~mask & n);
});

//(bitwise-reverse-bit-field ei1 ei2 ei3)    procedure
define_libfunc("bitwise-reverse-bit-field", 3, 3, function (ar) {
  var ret = ar[0],
    n = ar[0],
    start = ar[1],
    end = ar[2];
  var orig_field = (~(-1 << end) & n) >> start;
  for (var i = 0; i < end - start; i++, orig_field >>= 1) {
    var bit = orig_field & 1;
    var setpos = end - 1 - i;
    var mask = 1 << setpos;
    ret = (mask & (bit << setpos)) | (~mask & ret);
  }
  return ret;
});

//
// Chapter 12 syntax-case
//

//
// Chapter 13 Hashtables
//

//13.1  Constructors
//(define h (make-eq-hashtale)
//(define h (make-eq-hashtable 1000))
define_libfunc("make-eq-hashtable", 0, 1, function (ar) {
  // Note: ar[1] (hashtable size) is just ignored
  return new Hashtable(Hashtable.eq_hash, Hashtable.eq_equiv);
});
//(make-eqv-hashtable)    procedure
//(make-eqv-hashtable k)    procedure
define_libfunc("make-eqv-hashtable", 0, 1, function (ar) {
  return new Hashtable(Hashtable.eqv_hash, Hashtable.eqv_equiv);
});
//(make-hashtable hash-function equiv)    procedure
//(make-hashtable hash-function equiv k)    procedure
define_libfunc("make-hashtable", 2, 3, function (ar) {
  assert_procedure(ar[0]);
  assert_procedure(ar[1]);
  return new Hashtable(ar[0], ar[1]);
});

//13.2  Procedures
// (hashtable? hash)
define_libfunc("hashtable?", 1, 1, function (ar) {
  return ar[0] instanceof Hashtable;
});
//(hashtable-size hash)
define_libfunc("hashtable-size", 1, 1, function (ar) {
  assert_hashtable(ar[0]);
  return ar[0].keys().length;
});

// Find a pair from a hashtable with given key.
//
// hash      - a BiwaScheme.Hashtable
// key       - an object
// callbacks - an object contains callback functions
//             .on_found     - function(pair, hashed)
//               pair   - [Object key, Object value]
//               hashed - Object hashed
//             .on_not_found - function(hashed)
//               hashed - Object hashed
//
// Returns an instance of BiwaScheme.Call.
const find_hash_pair = function (hash, key, callbacks) {
  // invoke hash proc
  return new Call(hash.hash_proc, [key], function (ar) {
    var hashed = ar[0];
    var candidate_pairs = hash.candidate_pairs(hashed);

    if (!candidate_pairs) {
      // shortcut: obviously not found
      return callbacks.on_not_found(hashed);
    }

    // search the exact key from candidates
    return Call.foreach(candidate_pairs, {
      call: function (pair) {
        // invoke the equivalence proc
        return new Call(hash.equiv_proc, [key, pair[0]]);
      },
      result: function (equal, pair) {
        if (equal) {
          // found
          return callbacks.on_found(pair, hashed);
        }
      },
      finish: function () {
        // not found
        return callbacks.on_not_found(hashed);
      },
    });
  });
};

//(hashtable-ref hash "foo" #f)
define_libfunc("hashtable-ref", 3, 3, function (ar) {
  var hash = ar[0],
    key = ar[1],
    ifnone = ar[2];
  assert_hashtable(hash);

  return find_hash_pair(hash, key, {
    on_found: function (pair) {
      return pair[1];
    },
    on_not_found: function (hashed) {
      return ifnone;
    },
  });
});

//(hashtable-set! hash "foo" '(1 2))
define_libfunc("hashtable-set!", 3, 3, function (ar) {
  var hash = ar[0],
    key = ar[1],
    value = ar[2];
  assert_hashtable(hash);
  assert(hash.mutable, "hashtable is not mutable");

  return find_hash_pair(hash, key, {
    on_found: function (pair) {
      pair[1] = value;
      return undef;
    },
    on_not_found: function (hashed) {
      hash.add_pair(hashed, key, value);
      return undef;
    },
  });
});

//(hashtable-delete! hash "foo")
define_libfunc("hashtable-delete!", 2, 2, function (ar) {
  var hash = ar[0],
    key = ar[1];
  assert_hashtable(hash);
  assert(hash.mutable, "hashtable is not mutable");

  return find_hash_pair(hash, key, {
    on_found: function (pair, hashed) {
      hash.remove_pair(hashed, pair);
      return undef;
    },
    on_not_found: function (hashed) {
      return undef;
    },
  });
});

//(hashtable-contains? hash "foo")
define_libfunc("hashtable-contains?", 2, 2, function (ar) {
  var hash = ar[0],
    key = ar[1];
  assert_hashtable(hash);

  return find_hash_pair(hash, key, {
    on_found: function (pair) {
      return true;
    },
    on_not_found: function (hashed) {
      return false;
    },
  });
});

//(hashtable-update! hashtable key proc default)    procedure
define_libfunc("hashtable-update!", 4, 4, function (ar) {
  var hash = ar[0],
    key = ar[1],
    proc = ar[2],
    ifnone = ar[3];
  assert_hashtable(hash);
  assert(hash.mutable, "hashtable is not mutable");
  assert_procedure(proc);

  return find_hash_pair(hash, key, {
    on_found: function (pair, hashed) {
      // invoke proc and get new value
      return new Call(proc, [pair[1]], function (ar) {
        // replace the value
        pair[1] = ar[0];
        return undef;
      });
    },
    on_not_found: function (hashed) {
      // invoke proc and get new value
      return new Call(proc, [ifnone], function (ar) {
        // create new pair
        hash.add_pair(hashed, key, ar[0]);
        return undef;
      });
    },
  });
});
//(hashtable-copy hashtable)    procedure
//(hashtable-copy hashtable mutable)    procedure
define_libfunc("hashtable-copy", 1, 2, function (ar) {
  var mutable = ar[1] === undefined ? false : !!ar[1];
  assert_hashtable(ar[0]);
  return ar[0].create_copy(mutable);
});
//(hashtable-clear! hashtable)    procedure
//(hashtable-clear! hashtable k)    procedure
define_libfunc("hashtable-clear!", 0, 1, function (ar) {
  assert_hashtable(ar[0]);
  assert(ar[0].mutable, "hashtable is not mutable");
  ar[0].clear();
  return undef;
});
//(hashtable-keys hash)  ; => vector
define_libfunc("hashtable-keys", 1, 1, function (ar) {
  assert_hashtable(ar[0]);
  return ar[0].keys();
});
//(hashtable-entries hash)  ; => two vectors (keys, values)
define_libfunc("hashtable-entries", 1, 1, function (ar) {
  assert_hashtable(ar[0]);
  return new Values$1([ar[0].keys(), ar[0].values()]);
});

//13.3  Inspection

//(hashtable-equivalence-function hashtable)    procedure
define_libfunc("hashtable-equivalence-function", 1, 1, function (ar) {
  assert_hashtable(ar[0]);
  return ar[0].equiv_proc;
});
//(hashtable-hash-function hashtable)    procedure
define_libfunc("hashtable-hash-function", 1, 1, function (ar) {
  assert_hashtable(ar[0]);
  return ar[0].hash_proc;
});
//(hashtable-mutable? hashtable)    procedure
define_libfunc("hashtable-mutable?", 1, 1, function (ar) {
  assert_hashtable(ar[0]);
  return ar[0].mutable;
});

//13.4  Hash functions

//(equal-hash obj)    procedure
define_libfunc("equal-hash", 0, 0, function (ar) {
  return Hashtable.equal_hash;
});
//(string-hash string)    procedure
define_libfunc("string-hash", 0, 0, function (ar) {
  return Hashtable.string_hash;
});
//(string-ci-hash string)    procedure
define_libfunc("string-ci-hash", 0, 0, function (ar) {
  return Hashtable.string_ci_hash;
});
//(symbol-hash symbol)    procedure
define_libfunc("symbol-hash", 0, 0, function (ar) {
  return Hashtable.symbol_hash;
});

//
// Chapter 14 Enumerators
//
//(make-enumeration symbol-list) -> enum-set(new type)
define_libfunc("make-enumeration", 1, 1, function (ar) {
  assert_list(ar[0]);
  var members = ar[0].to_array();
  var enum_type = new Enumeration.EnumType(members);
  return enum_type.universe();
});

//(enum-set-universe enum-set) -> enum-set(same type as the argument)
define_libfunc("enum-set-universe", 1, 1, function (ar) {
  assert_enum_set(ar[0]);
  return ar[0].enum_type.universe();
});

//(enum-set-indexer enum-set) -> (lambda (sym)) -> integer or #f
define_libfunc("enum-set-indexer", 1, 1, function (ar) {
  assert_enum_set(ar[0]);
  return ar[0].enum_type.indexer();
});

//(enum-set-constructor enum-set) -> (lambda (syms)) -> enum-set(same type as the argument)
define_libfunc("enum-set-constructor", 1, 1, function (ar) {
  assert_enum_set(ar[0]);
  return ar[0].enum_type.constructor();
});

//(enum-set->list enum-set) -> symbol-list
define_libfunc("enum-set->list", 1, 1, function (ar) {
  assert_enum_set(ar[0]);
  return ar[0].symbol_list();
});

//(enum-set-member? symbol enum-set) -> bool
define_libfunc("enum-set-member?", 2, 2, function (ar) {
  assert_symbol(ar[0]);
  assert_enum_set(ar[1]);
  return ar[1].is_member(ar[0]);
});

//(enum-set-subset? esa esb) -> bool
define_libfunc("enum-set-subset?", 2, 2, function (ar) {
  assert_enum_set(ar[0]);
  assert_enum_set(ar[1]);
  return ar[0].is_subset(ar[1]);
});

//(enum-set=? esa esb) -> bool
define_libfunc("enum-set=?", 2, 2, function (ar) {
  assert_enum_set(ar[0]);
  assert_enum_set(ar[1]);
  return ar[0].equal_to(ar[1]);
});

//(enum-set-union es1 es2) -> enum-set
define_libfunc("enum-set-union", 2, 2, function (ar) {
  assert_enum_set(ar[0]);
  assert_enum_set(ar[1]);
  assert(
    ar[0].enum_type === ar[1].enum_type,
    "two enum-sets must be the same enum-type",
    "enum-set-union"
  );
  return ar[0].union(ar[1]);
});

//(enum-set-intersection es1 es2) -> enum-set
define_libfunc("enum-set-intersection", 2, 2, function (ar) {
  assert_enum_set(ar[0]);
  assert_enum_set(ar[1]);
  return ar[0].intersection(ar[1]);
});

//(enum-set-difference es1 es2) -> enum-set
define_libfunc("enum-set-difference", 2, 2, function (ar) {
  assert_enum_set(ar[0]);
  assert_enum_set(ar[1]);
  return ar[0].difference(ar[1]);
});

//(enum-set-complement enum-set) -> enum-set
define_libfunc("enum-set-complement", 1, 1, function (ar) {
  assert_enum_set(ar[0]);
  return ar[0].complement();
});

//(enum-set-projection esa esb) -> enum-set
define_libfunc("enum-set-projection", 2, 2, function (ar) {
  assert_enum_set(ar[0]);
  assert_enum_set(ar[1]);
  return ar[0].projection(ar[1]);
});

//(define-enumeration <type-name> (<symbol> ...) <constructor-syntax>)
// Example:
//   (define-enumeration color (red green black white) color-set)
//   this defines:
//     - an EnumType
//     - (color red) ;=> 'red
//     - (color-set red black) ;=> #<enum-set (red black)>
define_syntax("define-enumeration", function (x) {
  // Extract parameters
  var type_name = x.cdr.car;
  assert(
    isSymbol$1(type_name),
    "expected symbol for type_name",
    "define-enumeration"
  );
  type_name = type_name.name;

  var members = x.cdr.cdr.car;
  assert(
    isList(members),
    "expected list of symbol for members",
    "define-enumeration"
  );
  members = members.to_array();

  var constructor_name = x.cdr.cdr.cdr.car;
  assert(
    isSymbol$1(constructor_name),
    "expected symbol for constructor_name",
    "define-enumeration"
  );
  constructor_name = constructor_name.name;

  // Define EnumType
  var enum_type = new Enumeration.EnumType(members);

  // Define (color red)
  define_syntax(type_name, function (x) {
    // (color)
    assert(!isNil(x.cdr), "an argument is needed", type_name);

    var arg = x.cdr.car;
    assert_symbol(arg, type_name);

    // Check arg is included in the universe
    assert(
      contains(enum_type.members, arg),
      arg.name +
        " is not included in the universe: " +
        to_write$1(enum_type.members),
      type_name
    );

    return List(Sym("quote"), arg);
  });

  // Define (color-set red black)
  define_syntax(constructor_name, function (x) {
    assert_list(x.cdr, constructor_name);

    var symbols = x.cdr.to_array();

    // Check each argument is included in the universe
    each(symbols, function (arg) {
      assert_symbol(arg, constructor_name);
      assert(
        contains(enum_type.members, arg),
        arg.name +
          " is not included in the universe: " +
          to_write$1(enum_type.members),
        constructor_name
      );
    });

    // Create an EnumSet
    return new Enumeration.EnumSet(enum_type, symbols);
  });
});

//
// Chapter 15 Composite library
//
//(rnrs 6) = all - eval - mutable pairs - mutable strings - r5rs compatibility

//
// Chapter 16 eval
//
//(eval expression environment)    procedure
define_libfunc("eval", 1, 1, function (ar, intp) {
  //TODO: environment
  //TODO: this implementation has a bug that
  //  expressions which contains #<undef>, etc. cannot be evaluated.
  var expr = ar[0];
  var intp2 = new Interpreter(intp);
  return intp2.evaluate(to_write$1(expr));
});
//(environment import-spec ...)    procedure

//
// Chapter 17 Mutable pairs
//
//(set-car! pair obj)    procedure
//(set-cdr! pair obj)    procedure

//
// Chapter 18 Mutable strings
//
//(string-set! string k char)    procedure
// (string-fill! string char)    procedure

//
// Chapter 19 R5RS compatibility
//
//(exact->inexact z)    procedure
//(inexact->exact z)    procedure
//
//(quotient n1 n2)    procedure
//(remainder n1 n2)    procedure
//(modulo n1 n2)    procedure
//
//(null-environment n)    procedure
//(scheme-report-environment n)    procedure

//
// R7RS (TODO: split file?)
//

// R7RS Promise
//
// (delay expression)
define_syntax("delay", function (x) {
  if (x.cdr === nil) {
    throw new BiwaError("malformed delay: no argument");
  }
  if (x.cdr.cdr !== nil) {
    throw new BiwaError("malformed delay: too many arguments: " + write_ss(x));
  }
  var expr = x.cdr.car;
  // Expand into call of internal function
  // ( procedure->promise (lambda () (make-promise expr)))
  return new Pair(
    Sym(" procedure->promise"),
    new Pair(
      new Pair(
        Sym("lambda"),
        new Pair(
          nil,
          new Pair(new Pair(Sym("make-promise"), new Pair(expr, nil)), nil)
        )
      )
    )
  );
});

// (delay-force promise-expr)
define_syntax("delay-force", function (x) {
  if (x.cdr === nil) {
    throw new BiwaError("malformed delay-force: no argument");
  }
  if (x.cdr.cdr !== nil) {
    throw new BiwaError(
      "malformed delay-force: too many arguments: " + write_ss(x)
    );
  }
  var expr = x.cdr.car;
  // Expand into call of internal function
  // ( procedure->promise (lambda () expr))
  return new Pair(
    Sym(" procedure->promise"),
    new Pair(new Pair(Sym("lambda"), new Pair(nil, new Pair(expr, nil))), nil)
  );
});

// (force promise)
var force = function (promise) {
  if (promise.is_done()) {
    return promise.value();
  }
  return new Call(promise.thunk(), [], function (ar) {
    assert_promise(ar[0]);
    var new_promise = ar[0];
    if (promise.is_done()) {
      // reentrant!
      return promise.value();
    } else {
      promise.update_with(new_promise);
      return force(new_promise);
    }
  });
};
define_libfunc("force", 1, 1, function (ar, intp) {
  assert_promise(ar[0]);
  return force(ar[0]);
});

// (promise? obj)
define_libfunc("promise?", 1, 1, function (ar, intp) {
  return ar[0] instanceof BiwaPromise;
});

// (make-promise obj)
define_libfunc("make-promise", 1, 1, function (ar, intp) {
  var obj = ar[0];
  if (obj instanceof BiwaPromise) {
    return obj;
  } else {
    return BiwaPromise.done(obj);
  }
});

// internal function
// ( procedure->promise proc)
// proc must be a procedure with no argument and return a promise
define_libfunc(" procedure->promise", 1, 1, function (ar, intp) {
  assert_procedure(ar[0]);
  return BiwaPromise.fresh(ar[0]);
});

//
// parameterize
//

// (make-parameter init)
// (make-parameter init converter)
define_libfunc("make-parameter", 1, 2, function (ar, intp) {
  let currentValue;
  const converter = ar[1];
  // A parameter is represented by a JS function.
  // (parameterObj)   ;=> Return the current value
  // (parameterObj v) ;=> Set v as the value and return the original value
  const parameterObj = function (ar2) {
    if (ar2.length == 0) {
      // Get
      return currentValue;
    } else {
      // Set
      const origValue = currentValue;
      if (converter) {
        return new Call(converter, [ar2[0]], (ar3) => {
          currentValue = ar3[0];
          return origValue;
        });
      } else {
        currentValue = ar2[0];
        return origValue;
      }
    }
  };

  if (converter) {
    return new Call(converter, [ar[0]], (initialValue) => {
      currentValue = initialValue;
      return parameterObj;
    });
  } else {
    const initialValue = ar[0];
    currentValue = initialValue;
    return parameterObj;
  }
});

// (parameterize ((param val) ...) body ...)
define_syntax("parameterize", function (x) {
  const inits = x.cdr.car.to_array();
  const body = x.cdr.cdr;
  const tmpNames = inits.map(() => gensym());
  // (let ((tmp0 val0) (tmp1 val1) ...)
  //   (dynamic-wind
  //     (lambda () (begin (set! tmp0 (param0 tmp0))) ...)
  //     (lambda () body ...)
  //     (lambda () (begin (set! tmp0 (param0 tmp0))) ...)))
  const givenValues = List(
    ...inits.map((item, i) => List(tmpNames[i], item.cdr.car))
  );
  const updateValues = Cons(
    Sym("begin"),
    List(
      ...inits.map((item, i) =>
        List(Sym("set!"), tmpNames[i], List(item.car, tmpNames[i]))
      )
    )
  );

  const before = List(Sym("lambda"), nil, updateValues);
  const thunk = Cons(Sym("lambda"), Cons(nil, body));
  const after = List(Sym("lambda"), nil, updateValues);
  //return List(Sym("quote"),
  return List(
    Sym("let"),
    givenValues,
    List(Sym("dynamic-wind"), before, thunk, after)
  );
  //)
});

//
// srfi.js - SRFI libraries
//
// should be src/library/srfi/1.js, etc (in the future).
//

//
// srfi-1 (list)
//
// (iota count start? step?)
define_libfunc("iota", 1, 3, function (ar) {
  var count = ar[0];
  var start = ar[1] || 0;
  var step = ar[2] === undefined ? 1 : ar[2];
  assert_integer(count);
  assert_number(start);
  assert_number(step);

  var a = [],
    n = start;
  for (var i = 0; i < count; i++) {
    a.push(n);
    n += step;
  }
  return array_to_list(a);
});

var copy_pair = function (pair) {
  var car = isPair(pair.car) ? copy_pair(pair.car) : pair.car;
  var cdr = isPair(pair.cdr) ? copy_pair(pair.cdr) : pair.cdr;
  return new Pair(car, cdr);
};
// (list-copy list)
define_libfunc("list-copy", 1, 1, function (ar) {
  if (isPair(ar[0])) {
    return copy_pair(ar[0]);
  } else {
    return nil;
  }
});

//
// srfi-6 & Gauche (string port)
//
define_libfunc("open-input-string", 1, 1, function (ar) {
  assert_string(ar[0]);
  return new Port.StringInput(ar[0]);
});
define_libfunc("open-output-string", 0, 0, function (ar) {
  return new Port.StringOutput();
});
define_libfunc("get-output-string", 1, 1, function (ar) {
  assert_port(ar[0]);
  if (!(ar[0] instanceof Port.StringOutput))
    throw new Error(
      "get-output-string: port must be made by 'open-output-string'"
    );
  return ar[0].output_string();
});

//
// srfi-8 (receive)
//

// (receive <formals> <expression> <body>...)
// -> (call-with-values (lambda () expression)
//                        (lambda formals body ...))
define_syntax("receive", function (x) {
  assert(isPair(x.cdr), "missing formals", "receive");
  var formals = x.cdr.car;
  assert(isPair(x.cdr.cdr), "missing expression", "receive");
  var expression = x.cdr.cdr.car;
  var body = x.cdr.cdr.cdr;

  return deep_array_to_list([
    Sym("call-with-values"),
    [Sym("lambda"), nil, expression],
    new Pair(Sym("lambda"), new Pair(formals, body)),
  ]);
});

// srfi-19 (time)
//
//  // constants
//time-duration
//time-monotonic
//time-process
//time-tai
//time-thread
//time-utc
// Current time and clock resolution
// (current-date [tz-offset])
define_libfunc("current-date", 0, 1, function (ar) {
  //todo: tz-offset (ar[1])
  return new Date();
});
//
//current-julian-day -> jdn
//current-modified-julian-day -> mjdn
//current-time [time-type] -> time
//time-resolution [time-type] -> integer
//  // Time object and accessors
//make-time type nanosecond second -> time
//time? object -> boolean
//time-type time -> time-type
//time-nanosecond time -> integer
//time-second time -> integer
//set-time-type! time time-type
//set-time-nanosecond! time integer
//set-time-second! time integer
//copy-time time1 -> time2
//  // Time comparison procedures
//time<=? time1 time2 -> boolean
//time<? time1 time2 -> boolean
//time=? time1 time2 -> boolean
//time>=? time1 time2 -> boolean
//time>? time1 time2 -> boolean
//  // Time arithmetic procedures
//time-difference time1 time2 -> time-duration
//time-difference! time1 time2 -> time-duration
//add-duration time1 time-duration -> time
//add-duration! time1 time-duration -> time
//subtract-duration time1 time-duration -> time
//subtract-duration! time1 time-duration -> time
// Date object and accessors
// make-date
define_libfunc("date?", 1, 1, function (ar) {
  return ar[0] instanceof Date;
});
define_libfunc("date-nanosecond", 1, 1, function (ar) {
  assert_date(ar[0]);
  return ar[0].getMilliseconds() * 1000000;
});
define_libfunc("date-millisecond", 1, 1, function (ar) {
  // not srfi-19
  assert_date(ar[0]);
  return ar[0].getMilliseconds();
});
define_libfunc("date-second", 1, 1, function (ar) {
  assert_date(ar[0]);
  return ar[0].getSeconds();
});
define_libfunc("date-minute", 1, 1, function (ar) {
  assert_date(ar[0]);
  return ar[0].getMinutes();
});
define_libfunc("date-hour", 1, 1, function (ar) {
  assert_date(ar[0]);
  return ar[0].getHours();
});
define_libfunc("date-day", 1, 1, function (ar) {
  assert_date(ar[0]);
  return ar[0].getDate();
});
define_libfunc("date-month", 1, 1, function (ar) {
  assert_date(ar[0]);
  return ar[0].getMonth() + 1; //Jan = 0 in javascript..
});
define_libfunc("date-year", 1, 1, function (ar) {
  assert_date(ar[0]);
  return ar[0].getFullYear();
});
//date-zone-offset
//date-year-day
define_libfunc("date-week-day", 1, 1, function (ar) {
  assert_date(ar[0]);
  return ar[0].getDay();
});
//date-week-number

// Time/Date/Julian Day/Modified Julian Day Converters
// (snipped)

// Date to String/String to Date Converters
// TODO: support locale
//   * date_names
//   * ~f 5.2 sec
//   * ~p AM/PM
//   * ~X 2007/01/01
const date_names = {
  weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  full_weekday: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  month: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  full_month: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "Octorber",
    "November",
    "December",
  ],
};

const date2string = function (date, format) {
  var zeropad = function (n) {
    return n < 10 ? "0" + n : "" + n;
  };
  var spacepad = function (n) {
    return n < 10 ? " " + n : "" + n;
  };
  var isoweeknum = function (x) {
    var janFour = new Date(x.getFullYear(), 0, 4);
    var weekone = new Date(x.getFullYear(), 0, 4);

    if (janFour.getDay() >= date_names.weekday.indexOf("Thu")) {
      weekone.setDate(janFour.getDate() - (janFour.getDay() + 1));
    } else {
      weekone.setDate(janFour.getDate() + (7 - janFour.getDay() + 1));
    }

    return Math.ceil((x - weekone) / 86400000 / 7);
  };

  var getter = {
    a: function (x) {
      return date_names.weekday[x.getDay()];
    },
    A: function (x) {
      return date_names.full_weekday[x.getDay()];
    },
    b: function (x) {
      return date_names.month[x.getMonth()];
    },
    B: function (x) {
      return date_names.full_month[x.getMonth()];
    },
    c: function (x) {
      return x.toString();
    },
    d: function (x) {
      return zeropad(x.getDate());
    },
    D: function (x) {
      return getter.d(x) + getter.m(x) + getter.y(x);
    },
    e: function (x) {
      return spacepad(x.getDate());
    },
    f: function (x) {
      return x.getSeconds() + x.getMilliseconds() / 1000;
    },
    h: function (x) {
      return date_names.month[x.getMonth()];
    },
    H: function (x) {
      return zeropad(x.getHours());
    },
    I: function (x) {
      var h = x.getHours();
      return zeropad(h < 13 ? h : h - 12);
    },
    j: function (x) {
      throw new Bug("not implemented: day of year");
    },
    k: function (x) {
      return spacepad(x.getHours());
    },
    l: function (x) {
      var h = x.getHours();
      return spacepad(h < 13 ? h : h - 12);
    },
    m: function (x) {
      return zeropad(x.getMonth() + 1);
    },
    M: function (x) {
      return zeropad(x.getMinutes());
    },
    n: function (x) {
      return "\n";
    },
    N: function (x) {
      throw new Bug("not implemented: nanoseconds");
    },
    p: function (x) {
      return x.getHours() < 13 ? "AM" : "PM";
    },
    r: function (x) {
      return (
        getter.I(x) + ":" + getter.M(x) + ":" + getter.S(x) + " " + getter.p(x)
      );
    },
    s: function (x) {
      return Math.floor(x.getTime() / 1000);
    },
    S: function (x) {
      return zeropad(x.getSeconds());
    },
    t: function (x) {
      return "\t";
    },
    T: function (x) {
      return getter.H(x) + ":" + getter.M(x) + ":" + getter.S(x);
    },
    U: function (x) {
      throw new Bug("not implemented: weeknum(0~, Sun)");
    },
    V: function (x) {
      return isoweeknum(x);
    },
    w: function (x) {
      return x.getDay();
    },
    W: function (x) {
      throw new Bug("not implemented: weeknum(0~, Mon)");
    },
    x: function (x) {
      throw new Bug("not implemented: weeknum(1~, Mon)");
    },
    X: function (x) {
      return getter.Y(x) + "/" + getter.m(x) + "/" + getter.d(x);
    },
    y: function (x) {
      return x.getFullYear() % 100;
    },
    Y: function (x) {
      return x.getFullYear();
    },
    z: function (x) {
      throw new Bug("not implemented: time-zone");
    },
    Z: function (x) {
      throw new Bug("not implemented: symbol time zone");
    },
    1: function (x) {
      throw new Bug("not implemented: ISO-8601 year-month-day format");
    },
    2: function (x) {
      throw new Bug(
        "not implemented: ISO-8601 hour-minute-second-timezone format"
      );
    },
    3: function (x) {
      throw new Bug("not implemented: ISO-8601 hour-minute-second format");
    },
    4: function (x) {
      throw new Bug(
        "not implemented: ISO-8601 year-month-day-hour-minute-second-timezone format"
      );
    },
    5: function (x) {
      throw new Bug(
        "not implemented: ISO-8601 year-month-day-hour-minute-second format"
      );
    },
  };

  return format.replace(/~([\w1-5~])/g, function (str, x) {
    var func = getter[x];
    if (func) return func(date);
    else if (x == "~") return "~";
    else return x;
  });
};

// date->string date template
define_libfunc("date->string", 1, 2, function (ar) {
  assert_date(ar[0]);

  if (ar[1]) {
    assert_string(ar[1]);
    return date2string(ar[0], ar[1]);
  } else return ar[0].toString();
});
// string->date

// parse-date date
define_libfunc("parse-date", 1, 1, function (ar) {
  // not srfi-19
  assert_string(ar[0]);
  return new Date(Date.parse(ar[0]));
});

//
// srfi-27
//
define_libfunc("random-integer", 1, 1, function (ar) {
  var n = ar[0];
  assert_integer(n);
  if (n < 0) throw new Error("random-integer: the argument must be >= 0");
  else return Math.floor(Math.random() * ar[0]);
});
define_libfunc("random-real", 0, 0, function (ar) {
  return Math.random();
});

//
// srfi-28 (format)
//

// (format format-str obj1 obj2 ...) -> string
// (format #f format-str ...) -> string
// (format #t format-str ...) -> output to current port
// (format port format-str ...) -> output to the port
//   ~a: display
//   ~s: write
//   ~%: newline
//   ~~: tilde
define_libfunc("format", 1, null, function (ar) {
  if (isString(ar[0])) {
    var port = null,
      format_str = ar.shift();
  } else if (ar[0] === false) {
    ar.shift();
    var port = null,
      format_str = ar.shift();
  } else if (ar[0] === true) {
    ar.shift();
    var port = Port.current_output,
      format_str = ar.shift();
  } else {
    var port = ar.shift(),
      format_str = ar.shift();
    assert_port(port);
  }

  var str = format_str
    .replace(/~[as]/g, function (matched) {
      assert(ar.length > 0, "insufficient number of arguments", "format");
      if (matched == "~a") return to_display(ar.shift());
      else return to_write$1(ar.shift());
    })
    .replace(/~%/, "\n")
    .replace(/~~/, "~");
  if (port) {
    port.put_string(str);
    return undef;
  } else {
    return str;
  }
});

//
// srfi-38 (write/ss)
//
const user_write_ss = function (ar) {
  Console.puts(write_shared(ar[0]), true);
  return undef;
};
define_libfunc("write/ss", 1, 2, user_write_ss);
define_libfunc("write-with-shared-structure", 1, 2, user_write_ss);
define_libfunc("write*", 1, 2, user_write_ss); //from Gauche(STklos)

//
// srfi-43 (vector library)
//
define_libfunc("vector-append", 2, null, function (ar) {
  var vec = [];
  return vec.concat.apply(vec, ar);
});

// (vector-copy vector)
define_libfunc("vector-copy", 1, 1, function (ar) {
  assert_vector(ar[0]);
  return clone(ar[0]);
});

//
// see src/library/node_functions.js for:
// - srfi-98 (get-environment-variable)
//

// Avoid circular dependency
nil.to_set = function () {
  return new BiwaSet();
};

var BiwaScheme$1 = {
  TopEnv,
  CoreEnv,
  nil,
  undef,
  max_trace_size,
  suppress_deprecation_warning,
  Version: VERSION,
  VERSION,
  GitCommit,
  isNil,
  isUndef,
  isBoolean: isBoolean$1,
  isString: isString$1,
  isChar,
  isSymbol: isSymbol$1,
  isPort,
  isPair,
  isList,
  isVector,
  isHashtable,
  isMutableHashtable,
  isProcedure,
  isSelfEvaluating,
  eq: eq$1,
  eqv,
  equal,
  lt,
  to_write: to_write$1,
  to_display,
  inspect,
  write_ss: write_shared,
  to_write_ss: write_shared, // For backward compatibility
  Call,
  Char,
  Closure,
  isClosure,
  Compiler,
  Enumeration,
  isEnumSet,
  Error: BiwaError,
  Bug,
  UserError,
  Hashtable,
  Interpreter,
  Complex,
  Rational,
  isNumber: isNumber$2,
  isComplex,
  isReal,
  isRational,
  isInteger,
  Pair,
  List,
  array_to_list,
  deep_array_to_list,
  Cons,
  Parser,
  Pause,
  Port,
  eof,
  Promise: BiwaPromise,
  isPromise,
  Record,
  isRecord,
  isRecordTD,
  isRecordCD,
  Set: BiwaSet,
  Symbol: BiwaSymbol,
  Sym,
  gensym,
  Syntax,
  Values: Values$1,
  VMCode,

  define_libfunc,
  define_scmfunc,
  parse_fraction,
  is_valid_integer_notation,
  parse_integer,
  is_valid_float_notation,
  parse_float,
};

Console.puts = function (str, no_newline) {
  Port.current_output.put_string(str + (no_newline ? "" : "\n"));
};

Console.p = function (/*ARGS*/) {
  Port.current_output.put_string(
    "p> " + map(toArray(arguments), inspect).join(" ")
  );
};

const current_input = new Port.CustomInput(function (callback) {
  const out = document.querySelector("#bs-console");
  const form = document.createElement("form");
  form.innerHTML =
    "<input id='webscheme-read-line' type='text'><input type='submit' value='ok'>";
  out.appendChild(form);
  form.addEventListener("submit", function () {
    const input = document.querySelector("#webscheme-read-line").value;
    form.remove();
    callback(input);
    return false;
  });
});

const current_output = new Port.CustomOutput(function (str) {
  const out = document.querySelector("#bs-console");
  if (!out) return;
  const span = document.createElement("span");
  span.innerHTML = _escape(str).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
  out.appendChild(span);
});

const current_error = current_output;

// To use webscheme_lib, jQuery must be loaded beforehand
const $$1 = window.jQuery;

define_libfunc("read-line", 0, 1, function (ar) {
  var port = ar[0] || Port.current_input;
  assert_port(port);
  return port.get_string((str) => str);
});

//
// element
//
define_libfunc("element-empty!", 1, 1, function (ar) {
  if ($$1(ar[0]).prop("value")) {
    return $$1(ar[0]).val("");
  } else {
    return $$1(ar[0]).empty();
  }
});
alias_libfunc("element-empty!", "element-clear!");
define_libfunc("element-visible?", 1, 1, function (ar) {
  return $$1(ar[0]).is(":visible");
});
define_libfunc("element-toggle!", 1, 1, function (ar) {
  return $$1(ar[0]).toggle();
});
define_libfunc("element-hide!", 1, 1, function (ar) {
  return $$1(ar[0]).hide();
});
define_libfunc("element-show!", 1, 1, function (ar) {
  return $$1(ar[0]).show();
});
define_libfunc("element-remove!", 1, 1, function (ar) {
  return $$1(ar[0]).remove();
});
define_libfunc("element-update!", 2, 2, function (ar) {
  return $$1(ar[0]).html(ar[1]);
});
define_libfunc("element-replace!", 2, 2, function (ar) {
  return $$1(ar[0]).replaceWith(ar[1]);
});
define_libfunc("element-insert!", 2, 2, function (ar) {
  return $$1(ar[0]).append(ar[1]);
});
define_libfunc("element-wrap!", 3, 3, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-ancestors", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-descendants", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-first-descendant", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-immediate-descendants", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-previous-sibling", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-next-sibling", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-siblings", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-match?", 2, 2, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-up", 3, 3, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-down", 3, 3, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-previous", 3, 3, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-next", 3, 3, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-select", 1, 1, function (ar) {
  $$1(ar[0]).select();
});
define_libfunc("element-adjacent", 0, 0, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-identify", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-read-attribute", 2, 2, function (ar) {
  assert_string(ar[1]);
  return $$1(ar[0]).prop(ar[1]);
});

var element_write_attribute = function (ar) {
  assert_string(ar[1]);
  return $$1(ar[0]).prop(ar[1], ar[2]);
};
define_libfunc("element-write-attribute", 3, 3, function (ar) {
  deprecate("element-write-attribute", "1.0", "element-write-attribute!");
  return element_write_attribute(ar);
});
define_libfunc("element-write-attribute!", 3, 3, element_write_attribute);

define_libfunc("element-height", 1, 1, function (ar) {
  return $$1(ar[0]).height();
});
define_libfunc("element-width", 1, 1, function (ar) {
  return $$1(ar[0]).width();
});

define_libfunc("element-class-names", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-has-class-name?", 2, 2, function (ar) {
  assert_string(ar[1]);
  return $$1(ar[0]).hasClass(ar[1]);
});

var element_add_class_name = function (ar) {
  assert_string(ar[1]);
  return $$1(ar[0]).addClass(ar[1]);
};
define_libfunc("element-add-class-name", 2, 2, function (ar) {
  deprecate("element-add-class-name", "1.0", "element-add-class-name!");
  return element_add_class_name(ar);
});
define_libfunc("element-add-class-name!", 2, 2, element_add_class_name);

var element_remove_class_name = function (ar) {
  assert_string(ar[1]);
  return $$1(ar[0]).removeClass(ar[1]);
};
define_libfunc("element-remove-class-name", 2, 2, function (ar) {
  deprecate("element-remove-class-name", "1.0", "element-remove-class-name!");
  return element_remove_class_name(ar);
});
define_libfunc("element-remove-class-name!", 2, 2, element_remove_class_name);

var element_toggle_class_name = function (ar) {
  assert_string(ar[1]);
  return $$1(ar[0]).toggleClass(ar[1]);
};
define_libfunc("element-toggle-class-name", 2, 2, function (ar) {
  deprecate("element-toggle-class-name", "1.0", "element-toggle-class-name!");
  return element_toggle_class_name(ar);
});
define_libfunc("element-toggle-class-name!", 2, 2, element_toggle_class_name);

define_libfunc("element-clean-whitespace!", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-empty?", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-descendant-of!", 2, 2, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("scroll-to-element!", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-style", 2, 2, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-opacity", 2, 2, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-style-set!", 2, 2, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-opacity-set!", 2, 2, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-dimensions", 1, 1, function (ar) {
  return new Values($$1(ar[0]).width(), $$1(ar[0]).height());
});
define_libfunc("element-make-positioned!", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-undo-positioned!", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-make-clipping!", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-undo-clipping!", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-cumulative-offset", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-positioned-offset", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-absolutize!", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-relativize!", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-cumulative-scroll-offset", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-offset-parent", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-viewport-offset", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-clone-position!", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-absolutize!", 1, 1, function (ar) {
  throw new Bug("not yet implemented");
});
define_libfunc("element-focus!", 1, 1, function (ar) {
  return $$1(ar[0]).focus();
});

// usage:
//  (element-new '(div "foo"))        => <div>foo</div>
//  (element-new '("div#main" "foo")) => <div id='main'>foo</div>
//  (element-new '("div.red" "foo"))  => <div class='red'>foo</div>
//  (element-new '(div align "right" "foo"))  => <div align='right'>foo</div>
//  (element-new '(div (span "foo"))  => <div><span>foo</span></div>
//

const create_elements_by_string = function (spec) {
  spec = spec.to_array();
  var name = spec.shift();
  if (name instanceof BiwaSymbol) name = name.name;
  var m = name.match(/(.*)\.(.*)/);
  if (m) {
    name = m[1];
    spec.unshift(Sym("class"), m[2]);
  }
  m = name.match(/(.*)\#(.*)/);
  if (m) {
    name = m[1];
    spec.unshift(Sym("id"), m[2]);
  }
  var children = [];
  var s = ["<" + name];
  for (var i = 0; i < spec.length; i++) {
    if (spec[i] instanceof BiwaSymbol) {
      s.push(" " + spec[i].name + '="' + spec[i + 1] + '"');
      i++;
    } else {
      if (spec[i] instanceof Pair)
        children.push(create_elements_by_string(spec[i]));
      else children.push(spec[i]); // String
    }
  }
  s.push(">");
  s.push(children.join(""));
  s.push("</" + name + ">");
  return s.join("");
};

const tree_all = function (tree, pred) {
  if (tree === nil) return true;
  else if (pred(tree.car) === false) return false;
  else return tree_all(tree.cdr, pred);
};
define_libfunc("element-new", 1, 1, function (ar) {
  var string_or_symbol = function (item) {
    return isString(item) || item instanceof BiwaSymbol || item instanceof Pair;
  };
  if (tree_all(ar[0], string_or_symbol)) {
    return $$1(create_elements_by_string(ar[0]))[0];
  } else {
    return nil;
  }
});

const element_content = function (selector) {
  if ($$1(selector).prop("value")) {
    return $$1(selector).val();
  } else {
    return _escape($$1(selector).html());
  }
};
define_libfunc("element-content", 1, 1, function (ar) {
  return element_content(ar[0]);
});

//
// load from network
//
define_libfunc("load", 1, 1, function (ar, intp) {
  var path = ar[0];
  assert_string(path);
  var intp2 = new Interpreter(intp);
  return new Pause(function (pause) {
    $$1.ajax(path, {
      dataType: "text",
      mimeType: "text/plain; charset=UTF-8", // For Firefox (#88)
      success: function (data) {
        // create new interpreter not to destroy current stack.
        intp2.evaluate(data, function () {
          return pause.resume(undef);
        });
      },
      error: function () {
        throw new Error("load: network error: failed to load " + path);
      },
    });
  });
});

// Load javascript file on the server
const _require = function (src, check, proc) {
  var script = $$1("<script/>", { src: src });
  $$1("body").append(script);

  var checker = new Function("return !!(" + check + ")");

  if (checker()) proc();
  else
    setTimeout(function () {
      checker() ? proc() : setTimeout(arguments.callee, 10);
    }, 10);
};
// (js-load "lib/foo.js" "Foo")
define_libfunc("js-load", 2, 2, function (ar) {
  var path = ar[0];
  var check = ar[1];
  assert_string(path);
  assert_string(check);

  return new Pause(function (pause) {
    _require(path, "window." + check, function () {
      pause.resume(undef);
    });
  });
});

//
// html modification
//

const getelem = function (ar) {
  // account for getelem returning false when no results (and that getting passed back in)
  if (ar.length > 1 && ar[1] === false) {
    ar[1] = [];
  }

  var x = $$1.apply(this, ar);
  if (x.length > 0) {
    return x;
  } else {
    return false;
  }
};
define_libfunc("$", 1, 2, getelem);
define_libfunc("getelem", 1, 2, getelem);
define_libfunc("dom-element", 1, 1, function (ar) {
  return $$1(ar[0])[0];
});

define_libfunc("set-style!", 3, 3, function (ar) {
  assert_string(ar[1]);
  $$1(ar[0]).css(ar[1], ar[2]);
  return undef;
});
define_libfunc("get-style", 2, 2, function (ar) {
  assert_string(ar[1]);
  return $$1(ar[0]).css(ar[1]);
});
define_libfunc("set-content!", 2, 2, function (ar) {
  assert_string(ar[1]);
  var str = ar[1].replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
  $$1(ar[0]).html(str);
  return undef;
});
define_libfunc("get-content", 1, 1, function (ar) {
  return element_content(ar[0]);
});

//
// handlers
//
define_libfunc("set-handler!", 3, 3, function (ar, intp) {
  throw new Error("set-handler! is obsolete, please use add-handler! instead");
});
define_libfunc("add-handler!", 3, 3, function (ar, intp) {
  var selector = ar[0],
    evtype = ar[1],
    proc = ar[2];
  var intp2 = new Interpreter(intp);
  var handler = function (event) {
    return clone(intp2).invoke_closure(proc, [event]);
  };
  $$1(selector).on(evtype, handler);
  return handler;
});
define_libfunc("remove-handler!", 3, 3, function (ar, intp) {
  var selector = ar[0],
    evtype = ar[1],
    handler = ar[2];
  $$1(selector).off(evtype, handler);
  return undef;
});
define_libfunc("wait-for", 2, 2, function (ar) {
  var selector = ar[0],
    evtype = ar[1];
  var elem = $$1(selector);
  elem.biwascheme_wait_for = elem.biwascheme_wait_for || {};

  var prev_handler = elem.biwascheme_wait_for[evtype];
  if (prev_handler) {
    // Maybe a wait-for is called more than once,
    // and previous handler is not consumed.
    elem.off(evtype, prev_handler);
  }

  return new Pause(function (pause) {
    var handler = function (event) {
      elem.biwascheme_wait_for[evtype] = undefined;
      elem.off(evtype, handler);
      return pause.resume(event);
    };

    elem.biwascheme_wait_for[evtype] = handler;
    elem.on(evtype, handler);
  });
});

//
// dom
//
define_libfunc("domelem", 1, null, function (ar) {
  throw new Error("obsolete");
});
define_libfunc("dom-remove-children!", 1, 1, function (ar) {
  Console.puts(
    "warning: dom-remove-children! is obsolete. use element-empty! instead"
  );
  $$1(ar[0]).empty();
  return undef;
});
define_libfunc("dom-create-element", 1, 1, function (ar) {
  throw new Error("obsolete");
});
define_libfunc("element-append-child!", 2, 2, function (ar) {
  return $$1(ar[0]).append(ar[1]);
});
define_libfunc("dom-remove-child!", 2, 2, function (ar) {
  throw new Error("obsolete");
});
//  define_libfunc("dom-get-attribute", 2, 2, function(ar){
//  });
//  define_libfunc("dom-remove-child!", 2, 2, function(ar){
//  });

//
// communication to server
//
define_libfunc("http-request", 1, 1, function (ar) {
  var path = ar[0];
  assert_string(path);

  return new Pause(function (pause) {
    $$1.get(
      path,
      function (data) {
        pause.resume(data);
      },
      "text"
    );
  });
});
// (http-post "/foo" '(("x" . 1) ("y" . 2)))
define_libfunc("http-post", 2, 2, function (ar) {
  var path = ar[0];
  assert_string(path);
  var alist = ar[1];
  assert_list(alist);
  var h = alist_to_js_obj(alist);

  return new Pause(function (pause) {
    $$1.post(
      path,
      h,
      function (data) {
        pause.resume(data);
      },
      "text"
    );
  });
});

const jsonp_receiver = [];
define_libfunc("receive-jsonp", 1, 1, function (ar) {
  var url = ar[0];
  assert_string(url);

  var receives = jsonp_receiver;
  for (var i = 0; i < receives.length; i++) if (receives[i] === null) break;
  var receiver_id = i;
  url += "?callback=BiwaScheme.jsonp_receiver[" + receiver_id + "]";

  return new Pause(function (pause) {
    receives[receiver_id] = function (data) {
      pause.resume(data);
      receives[receiver_id] = null;
    };
    var script = $$1("<script/>", { src: url });
    $$1("body").append(script);
  });
});

//
// dialog, debug
//
define_libfunc("alert", 1, 1, function (ar) {
  alert(ar[0]);
  return undef;
});
define_libfunc("confirm", 1, 1, function (ar) {
  return confirm(ar[0]);
});

//
// Dumper - graphical state dumper
//

const Dumper = Class.create({
  initialize: function (dumparea) {
    this.dumparea = dumparea || $("#dumparea")[0] || null;
    this.reset();
  },

  reset: function () {
    if (this.dumparea) {
      // Note: this is for repl.html (needs refactoring..)
      $(this.dumparea).empty();
    }
    this.n_folds = 0;
    this.closures = [];
    this.n_dumps = 0;
    this.cur = -1;
    this.is_folded = true;
  },

  is_opc: function (obj) {
    return obj instanceof Array && typeof obj[0] == "string";
  },

  dump_pad: "&nbsp;&nbsp;&nbsp;",
  dump_opc: function (obj, level, nested) {
    var s = "";
    var pad1 = "",
      pad2 = "";
    var level = level || 0;
    var nested = nested || false;
    times(
      level,
      bind(function () {
        pad1 += this.dump_pad;
      }, this)
    );
    times(
      level + 1,
      bind(function () {
        pad2 += this.dump_pad;
      }, this)
    );

    s += pad1 + '[<span class="dump_opecode">' + obj[0] + "</span>";
    var i = 1;
    while (!(obj[i] instanceof Array) && i < obj.length) {
      if (obj[0] == "constant")
        s +=
          "&nbsp;<span class='dump_constant'>" +
          this.dump_obj(obj[i]) +
          "</span>";
      else s += "&nbsp;" + this.dump_obj(obj[i]);
      i++;
    }
    if (i < obj.length) s += "<br>\n";
    for (; i < obj.length; i++) {
      if (this.is_opc(obj[i])) {
        s += this.dump_opc(
          obj[i],
          i == obj.length - 1 ? level : level + 1,
          true
        );
      } else {
        s += i == obj.length - 1 ? pad1 : pad2;
        s += this.dump_obj(obj[i]);
      }
      if (i != obj.length - 1) s += "<br>\n";
    }
    s += "]";
    return nested ? s : this.add_fold(s);
  },

  fold_limit: 20,
  add_fold: function (s) {
    var lines = s.split(/<br>/gim);

    if (lines.length > this.fold_limit) {
      var fold_btn =
        " <span style='text-decoration:underline; color:blue; cursor:pointer;'" +
        "onclick='BiwaScheme.Dumper.toggle_fold(" +
        this.n_folds +
        ")'>more</span>";
      var fold_start =
        "<div style='display:none' class='fold" + this.n_folds + "'>";
      var fold_end = "</div>";
      this.n_folds++;
      return [
        lines.slice(0, this.fold_limit).join("<br>"),
        fold_btn,
        fold_start,
        lines.slice(this.fold_limit).join("<br>"),
        fold_end,
      ].join("");
    } else {
      return s;
    }
  },

  stack_max_len: 80,
  dump_stack: function (stk, size) {
    if (stk === null || stk === undefined) return inspect(stk);
    var s = "<table>";

    // show the 'physical' stack top
    if (stk.length == 0) {
      s += "<tr><td class='dump_dead'>(stack is empty)</td></tr>";
    } else if (size < stk.length) {
      var l = stk.length - 1;
      s +=
        "<tr><td class='dump_dead'>[" +
        l +
        "]</td>" +
        "<td class='dump_dead'>" +
        truncate(this.dump_obj(stk[l]), this.stack_max_len) +
        "</td></tr>";
    }

    // show the element in the stack
    for (var i = size - 1; i >= 0; i--) {
      s +=
        "<tr><td class='dump_stknum'>[" +
        i +
        "]</td>" +
        "<td>" +
        truncate(this.dump_obj(stk[i]), this.stack_max_len) +
        "</td></tr>";
    }
    return s + "</table>";
  },

  dump_object: function (obj) {
    var a = [];
    for (var k in obj) {
      //if(this.prototype[k]) continue;
      a.push(k.toString()); //+" => "+this[k].toString() );
    }
    return "#<Object{" + a.join(",") + "}>";
  },

  dump_closure: function (cls) {
    if (!cls) return "**BROKEN**";
    if (cls.length == 0) return "[]";

    var cls_num = null;
    for (var i = 0; i < this.closures.length; i++) {
      if (this.closures[i] == cls) cls_num = i;
    }
    if (cls_num == null) {
      cls_num = this.closures.length;
      this.closures.push(cls);
    }

    var c = clone(cls);
    var body = c.shift && c.shift();
    return [
      "c",
      cls_num,
      " <span class='dump_closure'>free vars :</span> ",
      this.dump_obj(c),
      " <span class='dump_closure'>body :</span> ",
      truncate(this.dump_obj(body), 100),
    ].join("");
  },

  dump_obj: function (obj) {
    if (obj && typeof obj.to_html == "function") return obj.to_html();
    else {
      var s = to_write$1(obj);
      if (s == "[object Object]") s = this.dump_object(obj);
      return _escape(s);
    }
  },

  dump: function (obj) {
    var s = "";
    if (obj instanceof Object) {
      s += "<table>";

      // header
      s +=
        "<tr><td colspan='4'>" +
        "<a href='#' class='header'>" +
        "#" +
        this.n_dumps +
        "</a></td></tr>";

      // registers
      each(
        keys(obj),
        bind(function (key) {
          var value = obj[key];
          if (key != "x" && key != "stack") {
            value =
              key == "c" ? this.dump_closure(value) : this.dump_obj(value);
            s +=
              "<tr><td>" +
              key +
              ": </td>" +
              "<td colspan='3'>" +
              value +
              "</td></tr>";
          }
        }, this)
      );
      s +=
        "<tr><td>x:</td><td>" +
        (this.is_opc(obj["x"])
          ? this.dump_opc(obj["x"])
          : this.dump_obj(obj["x"])) +
        "</td>";

      // stack
      s +=
        "<td style='border-left: 1px solid black'>stack:</td><td>" +
        this.dump_stack(obj["stack"], obj["s"]) +
        "</td></tr>";
      s += "</table>";
    } else {
      s = _escape(inspect(obj)) + "<br>\n";
    }
    var dumpitem = $("<div/>", { class: "dump" + this.n_dumps });
    dumpitem.html(s);
    $(this.dumparea).append(dumpitem);
    bind(function (n) {
      $(".header", this.dump_el(this.n_dumps)).click(
        bind(function () {
          this.dump_move_to(n);
          this.dump_fold();
        }, this)
      );
    }, this)(this.n_dumps);
    dumpitem.hide();
    this.n_dumps++;
  },

  //
  // UI
  //
  dump_el: function (n) {
    return $(".dump" + n, this.dumparea);
  },
  dump_move_to: function (n) {
    if (n < 0) n = this.n_dumps + n;

    if (0 <= n && n <= this.n_dumps) {
      this.dump_el(this.cur).hide();
      this.cur = n;
      this.dump_el(this.cur).show();
    }
  },

  dump_move: function (dir) {
    if (0 <= this.cur && this.cur < this.n_dumps) this.dump_el(this.cur).hide();

    if (0 <= this.cur + dir && this.cur + dir < this.n_dumps) this.cur += dir;

    this.dump_el(this.cur).show();
  },

  dump_fold: function () {
    for (var i = 0; i < this.n_dumps; i++)
      if (i != this.cur) this.dump_el(i).hide();

    this.is_folded = true;
  },

  dump_unfold: function () {
    for (var i = 0; i < this.n_dumps; i++) this.dump_el(i).show();

    this.is_folded = false;
  },

  dump_toggle_fold: function () {
    if (this.is_folded) this.dump_unfold();
    else this.dump_fold();
  },
});

Dumper.toggle_fold = function (n) {
  $(".fold" + n, this.dumparea).toggle();
};

//
// release_initializer.js - read user's program and eval it (if it exists)
//

const execute_user_program = function () {
  let dumper = null;
  const debug_area = document.querySelector("#biwascheme-debugger");
  if (debug_area) {
    dumper = new Dumper(debug_area);
  }

  // Error handler (show message to console div)
  const onError = function (e, state) {
    BiwaScheme.Port.current_error.put_string(e.message + "\n");
    if (dumper) {
      dumper.dump(state);
      dumper.dump_move(1);
    } else if (typeof console !== "undefined" && console.error) {
      console.error(e.message);
    } else {
      throw e;
    }
  };

  const run = function (script) {
    const intp = new BiwaScheme.Interpreter(onError);
    try {
      intp.evaluate(script, function () {});
    } catch (e) {
      onError(e);
    }
  };

  // Start user's program (old style)
  let script = "";
  for (const s of document.querySelectorAll("script[src$='biwascheme.js']")) {
    script += s.innerHTML;
  }
  for (const s of document.querySelectorAll(
    "script[src$='biwascheme-min.js']"
  )) {
    script += s.innerHTML;
  }

  if (script.length > 0) run(script);

  // Start user's program (new style)
  window.addEventListener("DOMContentLoaded", function () {
    for (const s of document.querySelectorAll(
      "script[type='text/biwascheme']"
    )) {
      run(s.innerHTML);
    }
  });
};

BiwaScheme$1.on_node = false;
BiwaScheme$1.Console = Console;
BiwaScheme$1.Port.current_input = current_input;
BiwaScheme$1.Port.current_output = current_output;
BiwaScheme$1.Port.current_error = current_error;
BiwaScheme$1.jsonp_receiver = jsonp_receiver;
BiwaScheme$1.Dumper = Dumper;

// TODO: ideally this should just be `window.BiwaScheme = BiwaScheme` but it will break test/spec.html (grep with `register_tests`)
window.BiwaScheme = window.BiwaScheme || {};
Object.assign(window.BiwaScheme, BiwaScheme$1);
execute_user_program();

export default BiwaScheme$1;
