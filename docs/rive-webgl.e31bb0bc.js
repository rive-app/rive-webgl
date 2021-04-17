// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"node_modules/dat.gui/build/dat.gui.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GUI = exports.gui = exports.dom = exports.controllers = exports.color = void 0;

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
function ___$insertStyle(css) {
  if (!css) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

function colorToString(color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();

  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);

  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);

    while (str.length < 6) {
      str = '0' + str;
    }

    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }

  return 'unknown format';
}

var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function () {
      var args = ARR_SLICE.call(arguments);

      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }

      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }

    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;

      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;

      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }

      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);

      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }

    isNaN.toString = function () {
      return _isNaN.toString();
    };

    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return obj instanceof Function;
  }
};
var INTERPRETATIONS = [{
  litmus: Common.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);

        if (test === null) {
          return false;
        }

        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);

        if (test === null) {
          return false;
        }

        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);

        if (test === null) {
          return false;
        }

        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);

        if (test === null) {
          return false;
        }

        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString
    }
  }
}, {
  litmus: Common.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
}, {
  litmus: Common.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }

        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
}, {
  litmus: Common.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result = void 0;
var toReturn = void 0;

var interpret = function interpret() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function (family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function (conversion, conversionName) {
        result = conversion.read(original);

        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};

var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;

    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }

    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }

    h /= 6;

    if (h < 0) {
      h += 1;
    }

    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Color = function () {
  function Color() {
    classCallCheck(this, Color);
    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }

    this.__state.a = this.__state.a || 1;
  }

  createClass(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();

function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }

      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }

      this.__state[component] = v;
    }
  });
}

function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }

      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color.recalculateHSV(this);
        this.__state.space = 'HSV';
      }

      this.__state[component] = v;
    }
  });
}

Color.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};

Color.recalculateHSV = function (color) {
  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result.s,
    v: result.v
  });

  if (!Common.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};

Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent(Color.prototype, 'r', 2);
defineRGBComponent(Color.prototype, 'g', 1);
defineRGBComponent(Color.prototype, 'b', 0);
defineHSVComponent(Color.prototype, 'h');
defineHSVComponent(Color.prototype, 's');
defineHSVComponent(Color.prototype, 'v');
Object.defineProperty(Color.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, 'hex', {
  get: function get$$1() {
    if (this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
      this.__state.space = 'HEX';
    }

    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});

var Controller = function () {
  function Controller(object, property) {
    classCallCheck(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }

  createClass(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;

      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }

      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();

var EVENT_MAP = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function (v, k) {
  Common.each(v, function (e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

function cssValueToPixels(val) {
  if (val === '0' || Common.isUndefined(val)) {
    return 0;
  }

  var match = val.match(CSS_VALUE_PIXELS);

  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }

  return 0;
}

var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;

    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }

    if (Common.isUndefined(vertical)) {
      vertical = true;
    }

    elem.style.position = 'absolute';

    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }

    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];

    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }

    var evt = document.createEvent(className);

    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
          break;
        }

      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }

      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }

    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;

    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }

    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;

    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }

    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);

      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }

    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);

        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }

    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = {
      left: 0,
      top: 0
    };

    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }

    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};

var BooleanController = function (_Controller) {
  inherits(BooleanController, _Controller);

  function BooleanController(object, property) {
    classCallCheck(this, BooleanController);

    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));

    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');

    _this2.__checkbox.setAttribute('type', 'checkbox');

    function onChange() {
      _this.setValue(!_this.__prev);
    }

    dom.bind(_this2.__checkbox, 'change', onChange, false);

    _this2.domElement.appendChild(_this2.__checkbox);

    _this2.updateDisplay();

    return _this2;
  }

  createClass(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }

      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');

        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }

      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);

var OptionController = function (_Controller) {
  inherits(OptionController, _Controller);

  function OptionController(object, property, opts) {
    classCallCheck(this, OptionController);

    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));

    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');

    if (Common.isArray(options)) {
      var map = {};
      Common.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }

    Common.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);

      _this.__select.appendChild(opt);
    });

    _this2.updateDisplay();

    dom.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;

      _this.setValue(desiredValue);
    });

    _this2.domElement.appendChild(_this2.__select);

    return _this2;
  }

  createClass(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }

      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);

var StringController = function (_Controller) {
  inherits(StringController, _Controller);

  function StringController(object, property) {
    classCallCheck(this, StringController);

    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));

    var _this = _this2;

    function onChange() {
      _this.setValue(_this.__input.value);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    _this2.__input = document.createElement('input');

    _this2.__input.setAttribute('type', 'text');

    dom.bind(_this2.__input, 'keyup', onChange);
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });

    _this2.updateDisplay();

    _this2.domElement.appendChild(_this2.__input);

    return _this2;
  }

  createClass(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }

      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller);

function numDecimals(x) {
  var _x = x.toString();

  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }

  return 0;
}

var NumberController = function (_Controller) {
  inherits(NumberController, _Controller);

  function NumberController(object, property, params) {
    classCallCheck(this, NumberController);

    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));

    var _params = params || {};

    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;

    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }

    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }

  createClass(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;

      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }

      if (this.__step !== undefined && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }

      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController;
}(Controller);

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

var NumberControllerBox = function (_NumberController) {
  inherits(NumberControllerBox, _NumberController);

  function NumberControllerBox(object, property, params) {
    classCallCheck(this, NumberControllerBox);

    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));

    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;

    function onChange() {
      var attempted = parseFloat(_this.__input.value);

      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onBlur() {
      onFinish();
    }

    function onMouseDrag(e) {
      var diff = prevY - e.clientY;

      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

      prevY = e.clientY;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }

    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }

    _this2.__input = document.createElement('input');

    _this2.__input.setAttribute('type', 'text');

    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'mousedown', onMouseDown);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });

    _this2.updateDisplay();

    _this2.domElement.appendChild(_this2.__input);

    return _this2;
  }

  createClass(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}

var NumberControllerSlider = function (_NumberController) {
  inherits(NumberControllerSlider, _NumberController);

  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck(this, NumberControllerSlider);

    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, {
      min: min,
      max: max,
      step: step
    }));

    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom.bind(_this2.__background, 'mousedown', onMouseDown);
    dom.bind(_this2.__background, 'touchstart', onTouchStart);
    dom.addClass(_this2.__background, 'slider');
    dom.addClass(_this2.__foreground, 'slider-fg');

    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }

    function onMouseDrag(e) {
      e.preventDefault();

      var bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));

      return false;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);

      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }

      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }

    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;

      var bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }

    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);

      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    _this2.updateDisplay();

    _this2.__background.appendChild(_this2.__foreground);

    _this2.domElement.appendChild(_this2.__background);

    return _this2;
  }

  createClass(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);

      this.__foreground.style.width = pct * 100 + '%';
      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);

var FunctionController = function (_Controller) {
  inherits(FunctionController, _Controller);

  function FunctionController(object, property, text) {
    classCallCheck(this, FunctionController);

    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));

    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();

      _this.fire();

      return false;
    });
    dom.addClass(_this2.__button, 'button');

    _this2.domElement.appendChild(_this2.__button);

    return _this2;
  }

  createClass(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }

      this.getValue().call(this.object);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller);

var ColorController = function (_Controller) {
  inherits(ColorController, _Controller);

  function ColorController(object, property) {
    classCallCheck(this, ColorController);

    var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));

    _this2.__color = new Color(_this2.getValue());
    _this2.__temp = new Color(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement('div');
    _this2.__selector.className = 'selector';
    _this2.__saturation_field = document.createElement('div');
    _this2.__saturation_field.className = 'saturation-field';
    _this2.__field_knob = document.createElement('div');
    _this2.__field_knob.className = 'field-knob';
    _this2.__field_knob_border = '2px solid ';
    _this2.__hue_knob = document.createElement('div');
    _this2.__hue_knob.className = 'hue-knob';
    _this2.__hue_field = document.createElement('div');
    _this2.__hue_field.className = 'hue-field';
    _this2.__input = document.createElement('input');
    _this2.__input.type = 'text';
    _this2.__input_textShadow = '0 1px 1px ';
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__selector, 'mousedown', function () {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    dom.bind(_this2.__selector, 'touchstart', function () {
      dom.addClass(this, 'drag').bind(window, 'touchend', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    var valueField = document.createElement('div');
    Common.extend(_this2.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    Common.extend(_this2.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    Common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    Common.extend(_this2.__hue_field.style, {
      width: '15px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      right: '3px'
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);

    function fieldDown(e) {
      setSV(e);
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'touchmove', setSV);
      dom.bind(window, 'mouseup', fieldUpSV);
      dom.bind(window, 'touchend', fieldUpSV);
    }

    function fieldDownH(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'touchmove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
      dom.bind(window, 'touchend', fieldUpH);
    }

    function fieldUpSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'touchmove', setSV);
      dom.unbind(window, 'mouseup', fieldUpSV);
      dom.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }

    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'touchmove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      dom.unbind(window, 'touchend', fieldUpH);
      onFinish();
    }

    function onBlur() {
      var i = interpret(this.value);

      if (i !== false) {
        _this.__color.__state = i;

        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }

    _this2.__saturation_field.appendChild(valueField);

    _this2.__selector.appendChild(_this2.__field_knob);

    _this2.__selector.appendChild(_this2.__saturation_field);

    _this2.__selector.appendChild(_this2.__hue_field);

    _this2.__hue_field.appendChild(_this2.__hue_knob);

    _this2.domElement.appendChild(_this2.__input);

    _this2.domElement.appendChild(_this2.__selector);

    _this2.updateDisplay();

    function setSV(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }

      var fieldRect = _this.__saturation_field.getBoundingClientRect();

      var _ref = e.touches && e.touches[0] || e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;

      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }

      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());

      return false;
    }

    function setH(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }

      var fieldRect = _this.__hue_field.getBoundingClientRect();

      var _ref2 = e.touches && e.touches[0] || e,
          clientY = _ref2.clientY;

      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }

      _this.__color.h = h * 360;

      _this.setValue(_this.__color.toOriginal());

      return false;
    }

    return _this2;
  }

  createClass(ColorController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var i = interpret(this.getValue());

      if (i !== false) {
        var mismatch = false;
        Common.each(Color.COMPONENTS, function (component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);

        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }

      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;

      var _flip = 255 - flip;

      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }
  }]);
  return ColorController;
}(Controller);

var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];

function linearGradient(elem, x, a, b) {
  elem.style.background = '';
  Common.each(vendors, function (vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}

function hueGradient(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];

    try {
      head.appendChild(injected);
    } catch (e) {}
  }
};
var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

var ControllerFactory = function ControllerFactory(object, property) {
  var initialValue = object[property];

  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }

  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }

      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }

    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, {
        min: arguments[2],
        max: arguments[3],
        step: arguments[4]
      });
    }

    return new NumberControllerBox(object, property, {
      min: arguments[2],
      max: arguments[3]
    });
  }

  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }

  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }

  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }

  return null;
};

function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}

var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);

    var _this = this;

    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }

  createClass(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;

      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;

      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom.unbind(_this.domElement, 'transitionend', hide);
        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
      };

      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom.bind(this.domElement, 'transitionend', hide);
      dom.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();

var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

css.inject(styleSheet);
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

var SUPPORTS_LOCAL_STORAGE = function () {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();

var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];

var GUI = function GUI(pars) {
  var _this = this;

  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });

  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = {
      preset: DEFAULT_DEFAULT_PRESET_NAME
    };
  }

  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }

  params.resizable = Common.isUndefined(params.parent) && params.resizable;

  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }

  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  var titleRow = void 0;
  Object.defineProperties(this, {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }

        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }

        setPresetSelectIndex(this);

        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;

        if (titleRow) {
          titleRow.innerHTML = params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;

        if (params.closed) {
          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }

        this.onResize();

        if (_this.__closeButton) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE) {
          useLocalStorage = bool;

          if (bool) {
            dom.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom.unbind(window, 'unload', saveToLocalStorage);
          }

          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
        }
      }
    }
  });

  if (Common.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);

    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }

    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);

    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }

    dom.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }

    var titleRowName = document.createTextNode(params.name);
    dom.addClass(titleRowName, 'controller-name');
    titleRow = addRow(_this, titleRowName);

    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };

    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom.addClass(titleRow, 'title');
    dom.bind(titleRow, 'click', onClickTitle);

    if (!params.closed) {
      this.closed = false;
    }
  }

  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }

      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }

    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }

  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };

  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();

  if (params.resizable) {
    addResizeHandle(this);
  }

  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };

  this.saveToLocalStorageIfPossible = saveToLocalStorage;

  function resetWidth() {
    var root = _this.getRoot();

    root.width += 1;
    Common.defer(function () {
      root.width -= 1;
    });
  }

  if (!params.parent) {
    resetWidth();
  }
};

GUI.toggleHide = function () {
  hide = !hide;
  Common.each(hideableGuis, function (gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};

GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';

GUI._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};

dom.bind(window, 'keydown', GUI._keydownHandler, false);
Common.extend(GUI.prototype, {
  add: function add(object, property) {
    return _add(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, 2)
    });
  },
  addColor: function addColor(object, property) {
    return _add(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);

    this.__controllers.splice(this.__controllers.indexOf(controller), 1);

    var _this = this;

    Common.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }

    if (this.autoPlace) {
      autoPlaceContainer.removeChild(this.domElement);
    }

    var _this = this;

    Common.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
    removeListeners(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }

    var newGuiParams = {
      name: name,
      parent: this
    };
    newGuiParams.autoPlace = this.autoPlace;

    if (this.load && this.load.folders && this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }

    var gui = new GUI(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow(this, gui.domElement);
    dom.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);

    delete this.__folders[folder.name];

    if (this.load && this.load.folders && this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }

    removeListeners(folder);

    var _this = this;

    Common.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  hide: function hide() {
    this.domElement.style.display = 'none';
  },
  show: function show() {
    this.domElement.style.display = '';
  },
  onResize: function onResize() {
    var root = this.getRoot();

    if (root.scrollable) {
      var top = dom.getOffset(root.__ul).top;
      var h = 0;
      Common.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom.getHeight(node);
        }
      });

      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
      } else {
        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }

    if (root.__resize_handle) {
      Common.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }

    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common.isUndefined(SAVE_DIALOGUE)) {
      SAVE_DIALOGUE = new CenteredDiv();
      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
    }

    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }

    var _this = this;

    Common.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu(_this);
      }

      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });

    if (this.autoPlace) {
      setWidth(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;

    while (gui.parent) {
      gui = gui.parent;
    }

    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;

    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;

      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }

      toReturn.remembered[this.preset] = getCurrentPreset(this);
    }

    toReturn.folders = {};
    Common.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }

    this.load.remembered[this.preset] = getCurrentPreset(this);
    markPresetModified(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }

    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue(gui || this.getRoot(), controller);
      }

      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common.each(this.__folders, function (folder) {
      folder.revert(folder);
    });

    if (!gui) {
      markPresetModified(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;

    this.__listening.push(controller);

    if (init) {
      updateDisplays(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});

function addRow(gui, newDom, liBefore) {
  var li = document.createElement('li');

  if (newDom) {
    li.appendChild(newDom);
  }

  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }

  gui.onResize();
  return li;
}

function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);

  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}

function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];

  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}

function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller, {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }

      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);

      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);

      return controller;
    }
  });

  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, {
      min: controller.__min,
      max: controller.__max,
      step: controller.__step
    });
    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
      var pc = controller[method];
      var pb = box[method];

      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();

        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });

        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }

      return returned;
    };

    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__checkbox, 'click');
    });
    dom.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__button, 'click');
    });
    dom.bind(li, 'mouseover', function () {
      dom.addClass(controller.__button, 'hover');
    });
    dom.bind(li, 'mouseout', function () {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = Common.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }

  controller.setValue = Common.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }

    return val;
  }, controller.setValue);
}

function recallSavedValue(gui, controller) {
  var root = gui.getRoot();

  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);

  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];

    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }

    controllerMap[controller.property] = controller;

    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;

      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }

      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}

function _add(gui, object, property, params) {
  if (object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }

  var controller = void 0;

  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }

  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }

  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom.addClass(name, 'property-name');
  name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);

  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }

  augmentController(gui, li, controller);

  gui.__controllers.push(controller);

  return controller;
}

function getLocalStorageHash(gui, key) {
  return document.location.href + '.' + key;
}

function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;

  gui.__preset_select.appendChild(opt);

  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}

function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}

function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom.addClass(gui.domElement, 'has-save');

  gui.__ul.insertBefore(div, gui.__ul.firstChild);

  dom.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');

  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function (value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }

  dom.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }

    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);

  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';

    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }

    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }

  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, 'click', function () {
    gui.save();
  });
  dom.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');

    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, 'click', function () {
    gui.revert();
  });
}

function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });

  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }

  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }

  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);
    return false;
  }

  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}

function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';

  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }

  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}

function getCurrentPreset(gui, useInitialValues) {
  var toReturn = {};
  Common.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}

function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}

function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function () {
      updateDisplays(controllerArray);
    });
  }

  Common.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}

var color = {
  Color: Color,
  math: ColorMath,
  interpret: interpret
};
exports.color = color;
var controllers = {
  Controller: Controller,
  BooleanController: BooleanController,
  OptionController: OptionController,
  StringController: StringController,
  NumberController: NumberController,
  NumberControllerBox: NumberControllerBox,
  NumberControllerSlider: NumberControllerSlider,
  FunctionController: FunctionController,
  ColorController: ColorController
};
exports.controllers = controllers;
var dom$1 = {
  dom: dom
};
exports.dom = dom$1;
var gui = {
  GUI: GUI
};
exports.gui = gui;
var GUI$1 = GUI;
exports.GUI = GUI$1;
var index = {
  color: color,
  controllers: controllers,
  dom: dom$1,
  gui: gui,
  GUI: GUI$1
};
var _default = index;
exports.default = _default;
},{}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/path-browserify/index.js":[function(require,module,exports) {
var process = require("process");
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

},{"process":"node_modules/process/browser.js"}],"node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/buffer/index.js"}],"node_modules/rive-canvas/rive.mjs":[function(require,module,exports) {
var __filename = "/Users/luigi/Projects/rive-webgl/node_modules/rive-canvas/rive.mjs";
var process = require("process");
var __dirname = "/Users/luigi/Projects/rive-webgl/node_modules/rive-canvas";
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Rive = function () {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;

  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return function (Rive) {
    Rive = Rive || {};
    null;
    var Module = typeof Rive !== "undefined" ? Rive : {};
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise(function (resolve, reject) {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    var moduleOverrides = {};
    var key;

    for (key in Module) {
      if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
      }
    }

    var arguments_ = [];
    var thisProgram = "./this.program";

    var quit_ = function (status, toThrow) {
      throw toThrow;
    };

    var ENVIRONMENT_IS_WEB = false;
    var ENVIRONMENT_IS_WORKER = false;
    var ENVIRONMENT_IS_NODE = false;
    var ENVIRONMENT_IS_SHELL = false;
    ENVIRONMENT_IS_WEB = typeof window === "object";
    ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
    ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
    ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
    var scriptDirectory = "";

    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }

      return scriptDirectory + path;
    }

    var read_, readAsync, readBinary, setWindowTitle;
    var nodeFS;
    var nodePath;

    if (ENVIRONMENT_IS_NODE) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = require("path").dirname(scriptDirectory) + "/";
      } else {
        scriptDirectory = __dirname + "/";
      }

      read_ = function shell_read(filename, binary) {
        var ret = tryParseAsDataURI(filename);

        if (ret) {
          return binary ? ret : ret.toString();
        }

        if (!nodeFS) nodeFS = require("fs");
        if (!nodePath) nodePath = require("path");
        filename = nodePath["normalize"](filename);
        return nodeFS["readFileSync"](filename, binary ? null : "utf8");
      };

      readBinary = function readBinary(filename) {
        var ret = read_(filename, true);

        if (!ret.buffer) {
          ret = new Uint8Array(ret);
        }

        assert(ret.buffer);
        return ret;
      };

      if (process["argv"].length > 1) {
        thisProgram = process["argv"][1].replace(/\\/g, "/");
      }

      arguments_ = process["argv"].slice(2);
      process["on"]("uncaughtException", function (ex) {
        if (!(ex instanceof ExitStatus)) {
          throw ex;
        }
      });
      process["on"]("unhandledRejection", abort);

      quit_ = function (status) {
        process["exit"](status);
      };

      Module["inspect"] = function () {
        return "[Emscripten Module object]";
      };
    } else if (ENVIRONMENT_IS_SHELL) {
      if (typeof read != "undefined") {
        read_ = function shell_read(f) {
          var data = tryParseAsDataURI(f);

          if (data) {
            return intArrayToString(data);
          }

          return read(f);
        };
      }

      readBinary = function readBinary(f) {
        var data;
        data = tryParseAsDataURI(f);

        if (data) {
          return data;
        }

        if (typeof readbuffer === "function") {
          return new Uint8Array(readbuffer(f));
        }

        data = read(f, "binary");
        assert(typeof data === "object");
        return data;
      };

      if (typeof scriptArgs != "undefined") {
        arguments_ = scriptArgs;
      } else if (typeof arguments != "undefined") {
        arguments_ = arguments;
      }

      if (typeof quit === "function") {
        quit_ = function (status) {
          quit(status);
        };
      }

      if (typeof print !== "undefined") {
        if (typeof console === "undefined") console = {};
        console.log = print;
        console.warn = console.error = typeof printErr !== "undefined" ? printErr : print;
      }
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }

      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }

      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
      } else {
        scriptDirectory = "";
      }

      {
        read_ = function shell_read(url) {
          try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText;
          } catch (err) {
            var data = tryParseAsDataURI(url);

            if (data) {
              return intArrayToString(data);
            }

            throw err;
          }
        };

        if (ENVIRONMENT_IS_WORKER) {
          readBinary = function readBinary(url) {
            try {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.responseType = "arraybuffer";
              xhr.send(null);
              return new Uint8Array(xhr.response);
            } catch (err) {
              var data = tryParseAsDataURI(url);

              if (data) {
                return data;
              }

              throw err;
            }
          };
        }

        readAsync = function readAsync(url, onload, onerror) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";

          xhr.onload = function xhr_onload() {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
              onload(xhr.response);
              return;
            }

            var data = tryParseAsDataURI(url);

            if (data) {
              onload(data.buffer);
              return;
            }

            onerror();
          };

          xhr.onerror = onerror;
          xhr.send(null);
        };
      }

      setWindowTitle = function (title) {
        document.title = title;
      };
    } else {}

    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);

    for (key in moduleOverrides) {
      if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key];
      }
    }

    moduleOverrides = null;
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];
    var tempRet0 = 0;

    var setTempRet0 = function (value) {
      tempRet0 = value;
    };

    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    var noExitRuntime;
    if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];

    if (typeof WebAssembly !== "object") {
      abort("no native wasm support detected");
    }

    var wasmMemory;
    var wasmTable = new WebAssembly.Table({
      "initial": 1007,
      "maximum": 1007 + 0,
      "element": "anyfunc"
    });
    var ABORT = false;
    var EXITSTATUS = 0;

    function assert(condition, text) {
      if (!condition) {
        abort("Assertion failed: " + text);
      }
    }

    var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

    function UTF8ArrayToString(heap, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;

      while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;

      if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(heap.subarray(idx, endPtr));
      } else {
        var str = "";

        while (idx < endPtr) {
          var u0 = heap[idx++];

          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }

          var u1 = heap[idx++] & 63;

          if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue;
          }

          var u2 = heap[idx++] & 63;

          if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2;
          } else {
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63;
          }

          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          }
        }
      }

      return str;
    }

    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    }

    function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;

      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);

        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = 65536 + ((u & 1023) << 10) | u1 & 1023;
        }

        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | u >> 6;
          heap[outIdx++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | u >> 12;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 240 | u >> 18;
          heap[outIdx++] = 128 | u >> 12 & 63;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        }
      }

      heap[outIdx] = 0;
      return outIdx - startIdx;
    }

    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    }

    function lengthBytesUTF8(str) {
      var len = 0;

      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
        if (u <= 127) ++len;else if (u <= 2047) len += 2;else if (u <= 65535) len += 3;else len += 4;
      }

      return len;
    }

    var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

    function UTF16ToString(ptr, maxBytesToRead) {
      var endPtr = ptr;
      var idx = endPtr >> 1;
      var maxIdx = idx + maxBytesToRead / 2;

      while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;

      endPtr = idx << 1;

      if (endPtr - ptr > 32 && UTF16Decoder) {
        return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
      } else {
        var i = 0;
        var str = "";

        while (1) {
          var codeUnit = HEAP16[ptr + i * 2 >> 1];
          if (codeUnit == 0 || i == maxBytesToRead / 2) return str;
          ++i;
          str += String.fromCharCode(codeUnit);
        }
      }
    }

    function stringToUTF16(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647;
      }

      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2;
      var startPtr = outPtr;
      var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;

      for (var i = 0; i < numCharsToWrite; ++i) {
        var codeUnit = str.charCodeAt(i);
        HEAP16[outPtr >> 1] = codeUnit;
        outPtr += 2;
      }

      HEAP16[outPtr >> 1] = 0;
      return outPtr - startPtr;
    }

    function lengthBytesUTF16(str) {
      return str.length * 2;
    }

    function UTF32ToString(ptr, maxBytesToRead) {
      var i = 0;
      var str = "";

      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[ptr + i * 4 >> 2];
        if (utf32 == 0) break;
        ++i;

        if (utf32 >= 65536) {
          var ch = utf32 - 65536;
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
        } else {
          str += String.fromCharCode(utf32);
        }
      }

      return str;
    }

    function stringToUTF32(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647;
      }

      if (maxBytesToWrite < 4) return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;

      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);

        if (codeUnit >= 55296 && codeUnit <= 57343) {
          var trailSurrogate = str.charCodeAt(++i);
          codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
        }

        HEAP32[outPtr >> 2] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }

      HEAP32[outPtr >> 2] = 0;
      return outPtr - startPtr;
    }

    function lengthBytesUTF32(str) {
      var len = 0;

      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
        len += 4;
      }

      return len;
    }

    var WASM_PAGE_SIZE = 65536;

    function alignUp(x, multiple) {
      if (x % multiple > 0) {
        x += multiple - x % multiple;
      }

      return x;
    }

    var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = HEAP8 = new Int8Array(buf);
      Module["HEAP16"] = HEAP16 = new Int16Array(buf);
      Module["HEAP32"] = HEAP32 = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
    }

    var DYNAMIC_BASE = 5266272,
        DYNAMICTOP_PTR = 23232;
    var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;

    if (Module["wasmMemory"]) {
      wasmMemory = Module["wasmMemory"];
    } else {
      wasmMemory = new WebAssembly.Memory({
        "initial": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
        "maximum": 2147483648 / WASM_PAGE_SIZE
      });
    }

    if (wasmMemory) {
      buffer = wasmMemory.buffer;
    }

    INITIAL_INITIAL_MEMORY = buffer.byteLength;
    updateGlobalBufferAndViews(buffer);
    HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;

    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();

        if (typeof callback == "function") {
          callback(Module);
          continue;
        }

        var func = callback.func;

        if (typeof func === "number") {
          if (callback.arg === undefined) {
            Module["dynCall_v"](func);
          } else {
            Module["dynCall_vi"](func, callback.arg);
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg);
        }
      }
    }

    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATMAIN__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;

    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];

        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }

      callRuntimeCallbacks(__ATPRERUN__);
    }

    function initRuntime() {
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }

    function preMain() {
      callRuntimeCallbacks(__ATMAIN__);
    }

    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];

        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }

      callRuntimeCallbacks(__ATPOSTRUN__);
    }

    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }

    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }

    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;

    function addRunDependency(id) {
      runDependencies++;

      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }

    function removeRunDependency(id) {
      runDependencies--;

      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }

      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }

        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }

    Module["preloadedImages"] = {};
    Module["preloadedAudios"] = {};

    function abort(what) {
      if (Module["onAbort"]) {
        Module["onAbort"](what);
      }

      what += "";
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }

    function hasPrefix(str, prefix) {
      return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0;
    }

    var dataURIPrefix = "data:application/octet-stream;base64,";

    function isDataURI(filename) {
      return hasPrefix(filename, dataURIPrefix);
    }

    var fileURIPrefix = "file://";

    function isFileURI(filename) {
      return hasPrefix(filename, fileURIPrefix);
    }

    var wasmBinaryFile = "data:application/octet-stream;base64,AGFzbQEAAAABrQRJYAF/AGACf38Bf2ABfwF/YAJ/fwBgA39/fwF/YAN/f38AYAAAYAF/AX1gA399fQBgAAF/YAJ/fQBgBH9/f38AYAd/fX19fX19AGAFf39/f38AYAR/f399AGAEf39/fwF/YAZ/f39/f38AYAN/f30AYAJ/fwF9YAR/f319AGAFf319fX0AYAZ/f399f30AYAN/f30Bf2ACf30Bf2ABfQF9YAV/f39/fwF/YAd/f39/f39/AGAFf39/fX0AYAZ/f319fX0AYAh/f319fX19fQBgA39/fAF/YAJ/fAF/YAZ/fH9/f38Bf2ACfX0BfWADfX19AX1gCH9/f39/f39/AGAKf39/f39/f39/fwBgBH9+fn8AYAd/f39/f39/AX9gAn5/AX9gA39+fwF+YAN/f38BfWACf30BfWABfAF9YAJ8fwF8YA1/f39/f39/f39/f39/AGAFf39/f30AYAZ/f39/fX8AYAd/f39/fX99AGAGf39/f319AGAHf39/fX19fQBgCX9/f319fX19fQBgBH9/fX8AYAZ/f319f38AYAV/f319fQBgBX99fX9/AGAHfX1/f39/fwBgBn9/f39/fwF/YAR/f399AX9gBH9/f3wBf2AHf398f39/fwF/YAN/fX8Bf2ADf319AX9gA35/fwF/YAJ9fwF/YAF8AX9gAX8BfmAIf39/f319fX8BfWABfwF8YAN/f38BfGAFf39/f38BfGACfn4BfGACfHwBfAKIAikBYQFhACMBYQFiACQBYQFjAC0BYQFkAAEBYQFlAAsBYQFmACMBYQFnAAUBYQFoAA0BYQFpABoBYQFqAAUBYQFrAAsBYQFsAEUBYQFtAAUBYQFuAAQBYQFvAA8BYQFwAAUBYQFxAAMBYQFyABABYQFzAAYBYQF0AAEBYQF1AAEBYQF2ABkBYQF3AAABYQF4AAQBYQF5AAIBYQF6AAIBYQFBAAMBYQFCAA0BYQFDAAMBYQFEAAABYQFFAAABYQFGAAIBYQFHAAABYQFIAEYBYQFJAAABYQFKACQBYQFLABABYQFMABABYQFNAAIBYQZtZW1vcnkCAYACgIACAWEFdGFibGUBcADvBwOtCqsKAQACAgIBAAECRAAAAgICAwIDAgIBAAQAAj4BAgICAgEBAgAFAQACAgQCDQQDAQoKCgEABAEAAQMBKysG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QRBrIgIkACACIAE7AQ4gAiAAIAJBDmoQhwQ2AgggAhCZATYCAEEAIQAgAkEIaiACEP8DRQRAIAJBCGoQbSgCBCEACyACQRBqJAAgAAsJACAAKAIAEB4LmwEBAX8jAEEQayIDJAACf0EAIAAvASwgARBUIAFGDQAaIABBLGogARDJASAAIAAvASwgACgCACgCLBEDACAAKAIoIAAQlgZBASACRQ0AGiADIABBGGoiABAqNgIIIAMgABArNgIAA38gA0EIaiADECwEfyADKAIIKAIAIAFBARBaGiADQQhqEC0MAQVBAQsLCyEAIANBEGokACAAC1oBAn8gACABQbh/akEAIAEbIgM2AigCQCAAIANGDQBBASECIAEgACgCECABKAIAKAIAEQEAIgFFDQAgAUELIAEoAgAoAgwRAQBFDQAgACABNgIUQQAhAgsgAgsUACAABEAgACAAKAIAKAIEEQAACwsJACAAIAEQ8AULKAEBfyMAQRBrIgIkACACIAE2AgwgAEGMAWogAkEMahByIAJBEGokAAsYACAAIAEoAgA2AgAgACABKAIENgIEIAALSwECfCAAIACiIgEgAKIiAiABIAGioiABRKdGO4yHzcY+okR058ri+QAqv6CiIAIgAUSy+26JEBGBP6JEd6zLVFVVxb+goiAAoKC2C08BAXwgACAAoiIARIFeDP3//9+/okQAAAAAAADwP6AgACAAoiIBREI6BeFTVaU/oqAgACABoiAARGlQ7uBCk/k+okQnHg/oh8BWv6CioLYLBQAQEgALDwAgACAAKAIAKAJgEQAAC1IBAn0gAUEAECcqAgAhBCACQQAQJyoCACEFIABBABAnIAQgBSADlJI4AgAgAUEBECcqAgAhBCACQQEQJyoCACEFIABBARAnIAQgBSADlJI4AgALCgAgAEHoGzYCAAuCBAEDfyACQYAETwRAIAAgASACEBcaIAAPCyAAIAJqIQMCQCAAIAFzQQNxRQRAAkAgAkEBSARAIAAhAgwBCyAAQQNxRQRAIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADTw0BIAJBA3ENAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBQGshASACQUBrIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQALDAELIANBBEkEQCAAIQIMAQsgA0F8aiIEIABJBEAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCyACIANJBEADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAs3AQF/IAAoAgQiA0EBdSABaiEBIAAoAgAhACABIAIgA0EBcQR/IAEoAgAgAGooAgAFIAALEQMAC1MCAn8BfSMAQRBrIgIkACAAKAIAIQMgAiABIAAoAgQiAEEBdWoiASAAQQFxBH8gASgCACADaigCAAUgAwsRBwA4AgwgAioCDCEEIAJBEGokACAECycBAX8jAEEQayICJAAgAiABNgIMIABBGGogAkEMahByIAJBEGokAAsPACAAKAIAIAAoAgQ2AgQLIAAgABC/AyAAQQA2AjwgAEHsKzYCACAAQbA6NgIAIAALRwAgABBlIABBpBU2AgAgAEEEakGwJhDaASAAQQA2AhAgAEEANgIUIABBtD82AgAgAEEYahA6GiAAQf//AzsBLCAAQQA2AigLCgAgACgCAEEIagsdAQF/IAAQmAEEQCAAKAIAIQEgABD6AxogARAyCwsNACAAKAIEIAAoAgBrCwwAIAAQuQIaIAAQMgsnACABEKYCBEAgACABKAI4EJwDEF8aDwsgACABKgIwIAEqAjQQQBoLIQAgACgCBCAAEC8oAgBHBEAgACABEKYBDwsgACABEKMDCwsAIAAQfhogABAyCwgAIABB2ABqC1gBA30gAUEAECcqAgAhBCABQQEQJyoCACEFIAJBABAnKgIAIQYgAEEAECcgBCAGIASTIAOUkjgCACACQQEQJyoCACEEIABBARAnIAUgBCAFkyADlJI4AgALCgAgAEHIGTYCAAtQAgJ/AX4jAEEQayIBJAACfiAAKAIAIAAoAgQgAUEIahDUByICRQRAIAAQrwFCAAwBCyAAIAAoAgAgAmo2AgAgASkDCAshAyABQRBqJAAgAwsMACAAKAIIIAEQ7gkLGQAgACgCACABNgIAIAAgACgCAEEIajYCAAsUAQF/QQQQKSIBIAAoAgA2AgAgAQsRACAAIABBf2pxRSAAQQJLcQsMACABIAIoAgA2AgALEgAgABAvKAIAIAAoAgBrQQJ1CzMBAX8gAEH8KjYCACAAKAKIASIBBEAgASABKAIAKAIEEQAACyAAQYwBahA+IAAQRBogAAsSACAAEC8oAgAgACgCAGtBA20LEgAgABAvKAIAIAAoAgBrQQN1CxAAIAAoAgQgACgCAGtBA20LFgAgABBsIABB/CU2AgAgAEHAJTYCAAsNACAAKgIMIAAqAgSTCw0AIAAqAgggACoCAJMLBwAgABDfAgskAQJ/IwBBEGsiACQAIABBCGpBABBBKAIAIQEgAEEQaiQAIAELDAAgABC3AhogABAyC3YBA38CQCAAELMBIgIgARCzAUcNACAAEJcBIQMgARCXASEBIAAQmAFFBEADQCACRSEEIAJFDQIgAy0AACABLQAARw0CIAFBAWohASADQQFqIQMgAkF/aiECDAAACwALIAIEfyADIAEgAhCECQVBAAtFIQQLIAQLVQECf0HAtQEoAgAiASAAQQNqQXxxIgJqIQACQCACQQFOQQAgACABTRsNACAAPwBBEHRLBEAgABAYRQ0BC0HAtQEgADYCACABDwtBiLEBQTA2AgBBfwvoAgIDfwF8IwBBEGsiASQAAn0gALwiA0H/////B3EiAkHan6T6A00EQEMAAIA/IAJBgICAzANJDQEaIAC7EGEMAQsgAkHRp+2DBE0EQCAAuyEEIAJB5JfbgARPBEBEGC1EVPshCcBEGC1EVPshCUAgA0F/ShsgBKAQYYwMAgsgA0F/TARAIAREGC1EVPsh+T+gEGAMAgtEGC1EVPsh+T8gBKEQYAwBCyACQdXjiIcETQRAIAJB4Nu/hQRPBEBEGC1EVPshGcBEGC1EVPshGUAgA0F/ShsgALugEGEMAgsgA0F/TARARNIhM3982RLAIAC7oRBgDAILIAC7RNIhM3982RLAoBBgDAELIAAgAJMgAkGAgID8B08NABoCQAJAAkACQCAAIAFBCGoQlgRBA3EOAwABAgMLIAErAwgQYQwDCyABKwMImhBgDAILIAErAwgQYYwMAQsgASsDCBBgCyEAIAFBEGokACAAC/4CAgN/AXwjAEEQayIBJAACQCAAvCIDQf////8HcSICQdqfpPoDTQRAIAJBgICAzANJDQEgALsQYCEADAELIAJB0aftgwRNBEAgALshBCACQeOX24AETQRAIANBf0wEQCAERBgtRFT7Ifk/oBBhjCEADAMLIAREGC1EVPsh+b+gEGEhAAwCC0QYLURU+yEJwEQYLURU+yEJQCADQX9KGyAEoJoQYCEADAELIAJB1eOIhwRNBEAgALshBCACQd/bv4UETQRAIANBf0wEQCAERNIhM3982RJAoBBhIQAMAwsgBETSITN/fNkSwKAQYYwhAAwCC0QYLURU+yEZwEQYLURU+yEZQCADQX9KGyAEoBBgIQAMAQsgAkGAgID8B08EQCAAIACTIQAMAQsCQAJAAkACQCAAIAFBCGoQlgRBA3EOAwABAgMLIAErAwgQYCEADAMLIAErAwgQYSEADAILIAErAwiaEGAhAAwBCyABKwMIEGGMIQALIAFBEGokACAAC1cBAn8jAEEQayIDJAAgACgCBCIEQQF1IAFqIQEgACgCACEAIARBAXEEQCABKAIAIABqKAIAIQALIAMgAhCmBCABIAMgABEBACEAIAMQbiADQRBqJAAgAAspAQF/IwBBEGsiAiQAIAIgADYCDCACQQxqIAEoAgAQeSACQRBqJAAgAAsPACAAEC8oAgAgACgCAGsLDgBBnK8BIAEgAhAJIAALmgEBAn8gASgCACAAKAIAIAMoAgARAQAhBSACKAIAIAEoAgAgAygCABEBACEEAn8CQCAFRQRAQQAgBEUNAhogASACEDZBASABKAIAIAAoAgAgAygCABEBAEUNAhogACABEDYMAQsgBARAIAAgAhA2QQEPCyAAIAEQNkEBIAIoAgAgASgCACADKAIAEQEARQ0BGiABIAIQNgtBAgsLCgAgABDXA0EBRgsOACAAIAEoAgA2AgAgAAsgAQF/IAAoAgAhAiAAIAE2AgAgAgRAIAAQQiACEP0CCwsHACAAQQJHCy4AIAAgARD0ASABQQgQSwRAIAAoAogBIAAgACgCACgCZBECACAAQYwBahDkBgsLBABBAAsWAAJ/IAAQmAEEQCAAKAIADAELIAAL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fGoiBSgCACACKAIAEQEADQALIAAgBU8Ef0EEBSAAIAUQNgwBCwsLIQUgACEDIAUOBQIAAgABAAsLCwsLDAAgAEGAAkEAEFoaCwcAIABBGHYLCAAgAEH/AXELCwAgAEEIdkH/AXELCwAgAEEQdkH/AXELWAAgAUEgEEsEQCAAEJIFCyABQcAAEEsEQCAAEJEFCwJAIAFBgAEQS0UNACAAIAAqAjw4AnAgACgCdCIBRQ0AIAAgASABKAIAKAJEEQcAIAAqAnCUOAJwCwsTACAAKAIUBEAgACgCFCAAEGkLCw8AIAAgACgCACgCADYCAAsfACABQSlGBEAgACACEJEBOgAuQQEPCyAAIAEgAhBSCyMAIABB1OgANgJEIABB/OcANgIAIABB0ABqED4gABBEGiAACwwAIAAQ3gEaIAAQMgssACAAEGUgAEF/NgIMIABCADcCBCAAQdTHADYCACAAQQA2AhAgAEGgCjYCAAsYACAAEOkCIABBsMUANgIAIABBsA82AgALCQAgAEEANgIACyMAIAAQZSAAQdANNgIAIABBBGpBwMMAENoBIABBsMoANgIACw0AIAAoAgAgASgCAEkLEAAgACgCACABKAIAa0ECdQsqACAAKAIAGiAAKAIAIAAQfUECdGoaIAAoAgAgABB9QQJ0ahogACgCABoLFgBBAUEgIABBf2pna3QgACAAQQJPGwslACMAQRBrIgAkACAAIAE2AgggAEEIahCCBiEBIABBEGokACABCwwAIAAgASgCADYCAAsJACAAIAEQgwILDAAgACABELICQQFzCycBAX8jAEEQayIBJAAgAUEIaiAAEOoCIAEoAgghACABQRBqJAAgAAtUAQF/IwBBEGsiASQAIAAQhwYgAEEIahCLAiABQQA2AgwgAEEMaiABQQxqIAFBCGoQhAIgAUGAgID8AzYCBCAAQRBqIAFBBGogARCEAiABQRBqJAALUAEBfyAAEKQCIAAQLyAAKAIAIAAoAgQgAUEEaiICEMcBIAAgAhA2IABBBGogAUEIahA2IAAQLyABEDUQNiABIAEoAgQ2AgAgACAAEDkQgAILCQAgABCHAiAACxEAIABBGCAAKAIAKAIMEQEACwkAIABBADYCAAsDAAELJQAgASAEEIoBIAOUEFYgASAEEIsBIAKUEFUgASAAKgKsARCcAQttAQJ/IwBB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ACgCACgCFBEIACAAIAEgA5IiAyACIAAoAgAoAhgRCAAgACADIAIgBJIiAiAAKAIAKAIYEQgAIAAgASACIAAoAgAoAhgRCAAgACAAKAIAKAIgEQAAC0MBAX8jAEEQayIBJAAgABAvGiABQf////8DNgIMIAFB/////wc2AgggAUEMaiABQQhqEMEBKAIAIQAgAUEQaiQAIAALKgEBfwJAIAFBAEgNACAAQdwAaiIAEDkgAUwNACAAIAEQLigCACECCyACCw8AIABBFGoQoAEgABCgAQshACAAKAIEIAAQLygCAEkEQCAAIAEQpgEPCyAAIAEQowMLEQEBfyAAKAIAIQEgABAtIAELEQAgABCHAiAAQRRqEIcCIAALMgAgABBsIABC/////w83AjAgAEGoPjYCACAAQQA2AkAgAEIANwI4IABBiMEANgIAIAAL+AIBBX8jAEEQayIBJAAgAEHUPTYCSCAAQfw8NgIAIAEgAEHcAGoiBRAqNgIIIAEgBRArNgIAA0AgAUEIaiABECxFBEAgASAAQegAaiIDECo2AgggASADECs2AgADQCABQQhqIAEQLEUEQCABIABB9ABqIgQQKjYCCCABIAQQKzYCAANAIAFBCGogARAsRQRAIAAoAqwBIgIEQCACIAIoAgAoAgQRAAALIAAoAqgBIgIEQCACIAIoAgAoAgQRAAALIABBmAFqED4gAEGMAWoQPiAAQYABahA+IAQQPiADED4gBRA+IABBzABqEI0DIAAQRBogAUEQaiQAIAAPCyABKAIIKAIAIgIEQCACIAIoAgAoAgQRAAALIAFBCGoQLQwAAAsACyABKAIIKAIAIgQEQCAEIAQoAgAoAgQRAAALIAFBCGoQLQwAAAsACyABKAIIKAIAIgMgAEYgA0VyRQRAIAMgAygCACgCBBEAAAsgAUEIahAtDAAACwALLAAgAEH8OjYCACAAQagCahBEGiAAQegBahBEGiAAQagBahBEGiAAEH4aIAALDAAgABCOAhogABAyCxkAIABB/DQ2AgAgAEGIAWoQPiAAEEQaIAALCQAgAEEEahA+Cy0AIABBpDM2AgAgAEHsAWoQPiAAQbABahCRAhogAEGgAWoQjQMgABCMAxogAAsPACAAIAAtAAAgAXI6AAALGAAgAEGwAWpBCEEBEFoaIABBoAFqELAGCxEAIABBADoAACAAQQRqEDoaCzUAIABBnDE2AgAgAEHsAmoQRBogAEGsAmoQRBogAEHsAWoQRBogAEGsAWoQRBogABB+GiAACysBAX8gACABKAIANgIAIAEoAgAhAyAAIAE2AgggACADIAJBAnRqNgIEIAALOgACQAJAAkAgAUGDf2oOAgABAgsgACACEDc2AqgBQQEPCyAAIAIQMLY4AqwBQQEPCyAAIAEgAhCjAgtCAQF9IAFDAABAQJQiAyACQwAAQECUIgIgAUMAAMDAlJIiASABkiAAlCADQwAAgD8gApOSQwAAQECUIACUIACUkpILTQAgAUEIEEsEQCAAQYwBahA5IAAgACgCACgCgAERAgBHBEAgACAAIAAoAgAoAoABEQIAEM0GCyAAIAAoAgAoAoQBEQAACyAAIAEQlQELGAEBfyAAEDkhAiAAIAEQmQMgACACELkDCzMBAX8gABA5IgIgAUkEQCAAIAEgAmsQzAYPCyACIAFLBEAgACAAKAIAIAFBAnRqEJcDCwsrAQF/IAAoAgQhAgNAIAEgAkcEQCAAEC8aIAJBfGohAgwBCwsgACABNgIECx8AIAAQ0wEgAEIFNwKoASAAQZQwNgIAIABBhC82AgALKwAgACoCMCAAKgI0IAAoAjgoAjQgACgCOCgCMCABIAIgACgCOBCcAxCuAgsHACAAQThqCwwAIAAgACgCABCZAwtcAQJ/IwBBEGsiASQAIAAoAjAgABBpIAEgACgCMBCQAiICECo2AgggASACECs2AgADQCABQQhqIAEQLARAIAEoAggoAgAgABBpIAFBCGoQLQwBBSABQRBqJAALCwsoACACIAFrIgBBAU4EQCADKAIAIAEgABBmGiADIAMoAgAgAGo2AgALC0YBAn8jAEEQayICJAAgARAvGiAAIAJBCGoQ3QYgARA5IgMEQCAAIAMQ3AYgACABKAIAIAEoAgQgAxDbBgsgAkEQaiQAIAALJQAgACABEOMGIABB7Cs2AgAgACABKAI8NgI8IABBsDo2AgAgAAsbACAAQQhBABBaGiAAKAKEASIABEAgABCQAwsLVgECfyMAQSBrIgMkACAAEC8iAiADQQhqIAAgABA5QQFqEMwBIAAQOSACEM4BIgIoAgggARB8IAIgAigCCEEEajYCCCAAIAIQiAIgAhChASADQSBqJAALHAAgABD1ASAAIAAoAoQBQaABakEAEKIBNgKIAQsHACAAEEMaCxYAIAEgAi8AADsAACABIAItAAI6AAILUAEBfyAAEJMCIAAQLyAAKAIAIAAoAgQgAUEEaiICEPcGIAAgAhA2IABBBGogAUEIahA2IAAQLyABEDUQNiABIAEoAgQ2AgAgACAAEEgQqgMLKwEBfyAAKAIEIQIDQCABIAJHBEAgABAvGiACQXhqIQIMAQsLIAAgATYCBAszACAAKAIAGiAAKAIAIAAQf0EDbGoaIAAoAgAgABCBAUEDbGoaIAAoAgAgABB/QQNsahoLLAAgACgCABogACgCACAAEIABQQN0ahogACgCACAAEIABQQN0ahogACgCABoLDAAgASACKQIANwIAC2ICAX8BfSMAQRBrIgIkACACIABBABAnKgIAIAFBABAnKgIAk4s4AgwgAiAAQQEQJyoCACABQQEQJyoCAJOLOAIIIAJBDGogAkEIahDwAyoCACEDIAJBEGokACADQwAAgD9eCysBAX8gAEGoKDYCACAAKAJoIgEEQCABIAEoAgAoAgQRAAALIAAQmQIaIAALCgAgAEHMKTYCAAtPACAAEK4DIABB2Cg2AgAgAEEEahA6GiAAQRBqEDoaIABBHGoQOhogAEEoahA6GiAAQTRqEDoaIABBQGsQOhogAEEANgJMIABB0ABqEE4aCw0AIAEgAJMgApQgAJILDQAgACgCACABQQNsagtjAQF/IwBBEGsiByQAIABBKGogB0EIakEBIABBBGoiABBIQf8BcRC1AxC0AyAAIAdBCGogASACEEAQpQEgACAHQQhqIAMgBBBAEKUBIAAgB0EIaiAFIAYQQBClASAHQRBqJAALVgECfyMAQSBrIgMkACAAEC8iAiADQQhqIAAgABA5QQFqEMwBIAAQOSACEKQGIgIoAgggARB8IAIgAigCCEEEajYCCCAAIAIQiAIgAhChASADQSBqJAALIQAgACgCBCAAEC8oAgBJBEAgACABEJEHDwsgACABEJAHCxkAIABBADoAAiAAIAI6AAEgACABOgAAIAALQAEBfyMAQRBrIgMkACAAQShqIANBCGpBACAAQQRqIgAQSEH/AXEQtQMQtAMgACADIAEgAhBAEKUBIANBEGokAAsnAQF/IwBBEGsiAyQAIABBBGogA0EIaiABIAIQQBClASADQRBqJAALOgEB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IAdBAWohBwwAAAsACyAKC6ABAQV/IwBBEGsiAyQAIAAQNRogAS8BACEEAkACQCAAEFAiBUUNACAAIAQgBRA7IgYQLigCACICRQ0AA0AgAigCACICRQ0BIAQgAigCBEcEQCACKAIEIAUQOyAGRw0CCyAEIAIoAgRHDQAgABBFIAJBCGogARDbA0UNAAsgA0EIaiACEEEoAgAhAgwBCyADEIYBIgI2AggLIANBEGokACACCwkAIAAgARCZCAsJACAAQRxqEDkLHwEBfyAAQRxqIgAQOSABSwR/IAAgARAuKAIABUEACwsnAQF/IwBBEGsiAiQAIAIgATYCDCAAQRxqIAJBDGoQUyACQRBqJAALJwEBfyMAQRBrIgIkACACIAE2AgwgAEEQaiACQQxqEFMgAkEQaiQAC8QBAQR/IwBBEGsiASQAIABBwA42AgAgASAAQRxqIgMQKjYCCCABIAMQKzYCAANAAkAgAUEIaiABECxFBEAgASAAQRBqIgIQKjYCCCABIAIQKzYCAANAIAFBCGogARAsRQ0CIAEoAggoAgAiBARAIAQgBCgCACgCBBEAAAsgAUEIahAtDAAACwALIAEoAggoAgAiAgRAIAIgAigCACgCBBEAAAsgAUEIahAtDAELCyADED4gAhA+IAAQ3gEaIAFBEGokACAAC2UCAn8BfSAAKgIEIAFcBEAgACABOAIEIAAqAgggACoCDJMhBCAAKAIALQAoBEAgACgCACgCICECCyAAKAIAKAIQIQMgAEEBNgIUIAAgASACIANsspMiATgCCCAAIAEgBJM4AgwLCz0BAX0gACABNgIAIAEtACgEQCABKAIgsiABKAIQspUhAgsgAEKAgICAEDcCECAAQgA3AgggACACOAIEIAALDAAgACABLQAAOgAACwkAIAAgAToACwsOACAAKAIIQf////8HcQs2AQF/IwBBEGsiAyQAIAFBN0YEQCADIAIQvwEgAEEEaiADELgCIAMQbgsgA0EQaiQAIAFBN0YLHQAgAC0AKAR9IAAoAiCyBUMAAAAACyAAKAIQspULcQEDfyMAQRBrIgEkACAAQYgNNgIAIAEgAEEsaiICECo2AgggASACECs2AgADQCABQQhqIAEQLARAIAEoAggoAgAiAwRAIAMgAygCACgCBBEAAAsgAUEIahAtDAELCyACED4gABDeARog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AEgNACADIgENACAAQwAAAACUDwsgAUEBdCEBIAJBf2oiAkH/AEoNAAtB/wAhAgsCQCABQYCAgARrIgNBAEgNACADIgENACAAQwAAAACUDwsCQCABQf///wNLBEAgASEDDAELA0AgAkF/aiECIAFBgICAAkkhBSABQQF0IgMhASAFDQALCyAEQYCAgIB4cSADQYCAgHxqIAJBF3RyIANBASACa3YgAkEBThtyvg8LIABDAAAAAJQgACABQYCAgPgHRhsLIwAgAEEANgIMIAAgATYCBCAAIAE2AgAgACABQQFqNgIIIAALIwAgACoCjAEgAVwEQCAAIAE4AowBIAAgACgCACgCWBEAAAsLCwAgACABIAIQ/QgLIwAgACoCiAEgAVwEQCAAIAE4AogBIAAgACgCACgCVBEAAAsLEgAgAEUEQEEADwsgACABEIEJCyEAIAAqAlggAVwEQCAAIAE4AlggACAAKAIAKAJQEQAACwuYAgACQAJAIAFBFEsNAAJAAkACQAJAAkACQAJAAkAgAUF3ag4KAAECCQMEBQYJBwgLIAIgAigCACIBQQRqNgIAIAAgASgCADYCAA8LIAIgAigCACIBQQRqNgIAIAAgATQCADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATUCADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATIBADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATMBADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATAAADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATEAADcDAA8LIAAgAiADEQMACw8LIAIgAigCAEEHakF4cSIBQQhqNgIAIAAgASkDADcDAAtEAQN/IAAoAgAsAAAQtgEEQANAIAAoAgAiAiwAACEDIAAgAkEBajYCACADIAFBCmxqQVBqIQEgAiwAARC2AQ0ACwsgAQshACAAKgJ8IAFcBEAgACABOAJ8IAAgACgCACgCVBEAAAsL2wIBA38jAEHQAWsiBSQAIAUgAjYCzAFBACECIAVBoAFqQQBBKBA9GiAFIAUoAswBNgLIAQJAQQAgASAFQcgBaiAFQdAAaiAFQaABaiADIAQQvwJBAEgNACAAKAJMQQBOBEBBASECCyAAKAIAIQYgACwASkEATARAIAAgBkFfcTYCAAsgBkEgcSEHAn8gACgCMARA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BSAAQQAQLigCAAsLYgEBfyMAQRBrIgIkACACIABBBGoiABAqNgIIIAIgABArNgIAA0ACQCACQQhqIAIQLEUEQEEAIQAMAQsgAigCCCgCACIAEEIgARCIAQ0AIAJBCGoQLQwBCwsgAkEQaiQAIAALQgEBfyMAQSBrIgIkACACIAEQhgI2AhAgAkEYaiAAIAEgAkEQaiACQQhqEJoFIAJBGGoQbSEAIAJBIGokACAAQQRqC1UBAX8jAEEQayICJAAgAiABNgIIIAIgABAqNgIAIAJBCGogAhD/ASEBIAAgACgCACABQQJ0aiIBQQRqIAAoAgQgARDyAhCXAyABENYBGiACQRBqJAALVgEBfyMAQRBrIgMkACADIAE2AgAgAyAANgIIA0ACQCADQQhqIAMQLEUNACADKAIIKAIAIAIoAgBGDQAgA0EIahAtDAELCyADKAIIIQAgA0EQaiQAIAALLQEBfyMAQRBrIgEkACABIAAoAgQ2AgggAUEIahDiAigCACEAIAFBEGokACAACzUBAX8jAEEQayICJAAgAiAAKAIENgIIIAIgASgCBDYCACACQQhqIAIQLCEAIAJBEGokACAAC1UBAX8jAEEQayICJAAgAiABNgIMIAIgAEEMaiACQQxqENIFNgIIIAIQmQE2AgBBfyEAIAJBCGogAhD/A0UEQCACQQhqEG0oAgQhAAsgAkEQaiQAIAALIAAgAEF8aiIAQZwBTQRAIABBAnRB7N8AaigCAA8LQX8L+REBAn8CQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIABBf2oORysdHiUfKSIkMzMzMzMzMyEXGRocMxYsGAIFCgszDREzMyAjMw4zMy4vJjAxLTIbACoGJygPMzMDCRIVMwEIEBMMMzMEMwcUMwtBxAAQKUEAQcQAED0iABCIAxoMMwtBGBApIgBCADcDACAAQgA3AxAgAEIANwMIIAAQrQEaIABBfzYCECAAQfjDADYCACAAQczDADYCAAwyC0EUECkiAEIANwMAIABBADYCECAAQgA3AwggABBlIABBADYCBCAAQaTEADYCACAAQcAINgIAIABBCGoQOhoMMQtBFBApIgBCADcDACAAQQA2AhAgAEIANwMIIAAQ+wEgAEEANgIQIABBgMUANgIAIABB0MQANgIADDALQQgQKSIAQgA3AwAgABDoAiAAQYjGADYCACAAQZQUNgIADC8LQRQQKSIAQgA3AwAgAEEANgIQIABCADcDCCAAEGUgAEEANgIEIABB6MYANgIAIABBsAk2AgAgAEEIahA6GgwuC0EcECkiAEIANwMAIABBADYCGCAAQgA3AxAgAEIANwMIIAAQ+gEgAEF/NgIYIABBlMcANgIAIABB3As2AgAMLQtBEBApIgBCADcDACAAQgA3AwggABDnAiAAQQA2AgwgAEGIyAA2AgAgAEHYEzYCAAwsC0EQECkiAEIANwMAIABCADcDCCAAEK0BGiAAQdzJADYCACAAQbTJADYCAAwrC0EoEClBAEEoED0iABDXBQwqC0EQECkiAEIANwMAIABCADcDCCAAEP0BDCkLQcAAEClBAEHAABA9IgAiAiIBEGUgAULh9dH4g4CAwD83AgwgAUK9lNz2AzcCBCABQdzKADYCACACQYgINgIADCgLQSQQKUEAQSQQPSIAIgEiAhDUAyACQgA3AgwgAkL/////DzcCBCACQZTLADYCACABQQA2AhQgAUHwETYCACABQRhqEDoaDCcLQRwQKSIAQgA3AwAgAEEANgIYIABCADcDECAAQgA3AwggABD6ASAAQQA2AhggAEHMywA2AgAgAEGcCzYCAAwmC0EcECkiAEIANwMAIABBADYCGCAAQgA3AxAgAEIANwMIIAAQ+gEgAEEANgIYIABBjMwANgIAIABB3Ao2AgAMJQtBKBApQQBBKBA9IgAQ1gUMJAtBEBApIgBCADcDACAAQgA3AwggABCtARogAEGgzQA2AgAgAEH4zAA2AgAMIwtBOBApQQBBOBA9IgAiARDRBSABQYgNNgIAIAFBLGoQOhoMIgtBEBApIgBCADcDACAAQgA3AwggABD7ASAAQbzOADYCACAAQZDOADYCAAwhC0EQECkiAEIANwMAIABCADcDCCAAEK0BGiAAQZDPADYCACAAQejOADYCAAwgC0EMECkiAEIANwMAIABBADYCCCAAEOcCIABBuM8ANgIAIABB7BI2AgAMHwtBFBApIgBCADcDACAAQQA2AhAgAEIANwMIIAAQ+wEgAEEAOgAQIABBoNAANgIAIABB8M8ANgIADB4LQeQAEClBAEHkABA9IgAQ7gIMHQtB5AAQKUEAQeQAED0iACIBIgIQ7gIgAkGE0gA2AkQgAkGs0QA2AgAgAUH86QA2AkQgAUGk6QA2AgAMHAtBzAAQKUEAQcwAED0iACICIgEQ5AIgAUEBOgBEIAFBADYCQCABQoCAgPwDNwI4IAFBkNIANgIAIAJBADYCSCACQaTrADYCAAwbC0HAABApQQBBwAAQPSIAIgEiAhBsIAJB9OjRezYCMCACQazTADYCACABQTRqEOsCIQIgAUHU6gA2AgAgAkGY6wA2AgAMGgtBOBApQQBBOBA9IgAiAiIBEGwgAUL/////DzcCMCABQezTADYCACACQbjnADYCAAwZC0HMABApIgAQ7wQMGAtBPBApQQBBPBA9IgAiAiIBEOQCIAFBADYCOCABQbDUADYCACACQejmADYCAAwXC0GAARApQQBBgAEQPSIAEKECDBYLQfwBECkiABC/BgwVC0HAABApQQBBwAAQPSIAEGsaDBQLQdwAEClBAEHcABA9IgAiAiIBEJ8CIAFBADYCWCABQgA3AlAgAUGA1QA2AgAgAkHMHTYCAAwTC0GkARApQQBBpAEQPSIAIgEiAhDDAyACQQA6AJgBIAJB3NUANgIAIAFBnAFqIgJBADYCBCACQdDWADYCACABQYAuNgIAIAJB+C42AgAMEgtBrAMQKSIAEMUGDBELQdgAEClBAEHYABA9IgAiAiIBEJ8CIAFCADcCUCABQdzWADYCACACQYgfNgIADBALQegCECkiABCoBgwPC0GoBBApIgAQqgcMDgtB0AAQKUEAQdAAED0iACIBIgIQbCACQQE6ADggAkL/////DzcCMCACQbTXADYCACABQcAcNgIAIAFBPGoQOhogAUIANwJIDA0LQbABECkiABCaAwwMC0G0ARApIgAiARCaAyABQYCAgPgDNgKwASABQZw5NgIAIAFBiDg2AgAMCwtB4AAQKUEAQeAAED0iABCnARoMCgtBOBApQQBBOBA9IgAiASICEIIBIAJBfzYCMCACQfzXADYCACABQQA2AjQgAUHIwAA2AgAMCQtBtAEQKUEAQbQBED0iABDVBQwIC0EEECkiAEEANgIAIAAQZSAAQcTZADYCACAAQZzZADYCAAwHC0HAABApQQBBwAAQ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ECwEQCACKAIYKAIAIgNFDQIgAxCrAkUNASADIQEDQCABRQ0CIAEgBEYEQCADIAAQ7gUMAwUgASgCFCEBDAELAAALAAsgABC6ATYCTCACQSBqJABBAA8LIAMQzANFIAMgBEZyDQAgAyEBA0AgAUUNASAAKAJIIAFGBEAgAiADNgIMIANBoAFqQQRBEBCpARCPAyAFIAJBDGoQUwUgASgCFCEBDAELCwsgAkEYahAtDAAACwALNQEBfSABQQAQJyoCACAAQQAQJyoCAJMiAiAClCABQQEQJyoCACAAQQEQJyoCAJMiAiAClJILUAEBfyAAQQAQJyIDIAMqAgAgAZQ4AgAgAEEBECciAyADKgIAIAGUOAIAIABBAhAnIgMgAyoCACAClDgCACAAQQMQJyIAIAAqAgAgApQ4AgALiAEBAX8gAUEAECcoAgAhAiAAQQAQJyACNgIAIAFBARAnKAIAIQIgAEEBECcgAjYCACABQQIQJygCACECIABBAhAnIAI2AgAgAUEDECcoAgAhAiAAQQMQJyACNgIAIAFBBBAnKAIAIQIgAEEEECcgAjYCACABQQUQJygCACEBIABBBRAnIAE2AgALVQEBfSABEIsBIQIgARCKASEBIABBABAnIAE4AgAgAEEBECcgAjgCACAAQQIQJyACjDgCACAAQQMQJyABOAIAIABBBBAnQQA2AgAgAEEFECdBADYCAAssACAAIAEoAgA2AgAgACABKAIENgIEIAAgASgCCDYCCCAAIAEoAgw2AgwgAAsIACABQcIARgsFAEHCAAsvAQF/IwBBEGsiASQAIABCADcCACABQQA2AgwgAEEIaiABQQxqEPwBIAFBEGokAAsiAQF/QRAQKSIBQgA3AwAgAUIANwMIIAAgARCtARDVA0EBC7ECAQR/IwBBIGsiAiQAIAAoAggoAgQhAyACIAAoAgRBEGoiARAqNgIYIAIgARArNgIQA0ACQAJAAkAgAkEYaiACQRBqECxFBEBBAiEBDAELAkAgAigCGCgCACIBELEBRQ0AIAEoAhBBf0YNACABIAMgASgCEBD/AiIENgIUIAQNAEEBIQFBASEADAMLIAIgAUEEaiIBECo2AgggAiABECs2AgACfwNAIAJBCGogAhAsRQRAQQQhAUEADAILAkAgAigCCCgCACIBKAIEQQBIDQAgASgCBCAAKAIE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IAAoAghPRQRAIAAoAgwgAkECdGooAgAiAyADKAIAKAIAEQAAIAJBAWohAgwBCwsgAC0ABAtZAQJ/A0AgACgCDCEBIAIgACgCCE8EQCABBEAgARAyCyAAKAIUIgAEQCAAEDILDwsgASACQQJ0aigCACIBBEAgASABKAIAKAIIEQAACyACQQFqIQIMAAALAAsrACAAQgA3AhQgAEIANwIAIABBgICA/AM2AhwgAEIANwIIIABBADoAECAAC+QDAQR/IABBADoABCAAIAE2AgAgACABEPEDIgM2AgggAEF/IANBAnQgAyADQf////8DcUcbECk2AgwDfyACIANPBH8gACABQRBqEDkiBDYCEEF/IARBBXQiAiAEIARB////P3FHGxApIQMgBARAIAIgA2ohBCADIQIDQCACEKEIQSBqIgIgBEcNAAsLIAAgAzYCFEEABQJAIAEgAhDyAyIFRQRAIAAoAgwgAkECdGpBADYCAAwBCwJAAkACQAJAIAUgBSgCACgCCBECAEFIag4EAQMCAAMLQRAQKSIDIgQgBSAAELQCIARBnBA2AgAgBCAFLQAQOgAMIAAoAgwgAkECdGogAzYCAAwDC0EQECkiAyIEIAUgABC0AiAEQbAQNgIAIAQgBSoCEDgCDCAAKAIMIAJBAnRqIAM2AgAMAgtBEBApIgMiBCAFIAAQtAIgBEEAOgAMIARBxBA2AgAgACgCDCACQQJ0aiADNgIADAELIAAoAgwgAkECdGpBADYCAAsgAkEBaiECIAAoAgghAwwBCwshAgNAIAIgACgCEEkEQCAAKAIUIAJBBXRqIgQgAUEQaiIDEDkgAksEfyADIAIQLigCAAVBAAsiAzYCACAEIAMoAiA2AgQgAkEBaiECDAELCyAACwkAIABBADoADAsXACAALQAMRQRAIABBAToADCAAELMCCwsZACAAKgIMIAFcBEAgACABOAIMIAAQswILCxkAIAEgAC0ADEcEQCAAIAE6AAwgABCzAgsLCQAgACgCCBBCCwcAIAFBNkYLBABBNgtWAQF/AkACQAJAAkACQAJAIAFBQWoOBAABAgMFCyAAIAIQMLY4AgQMAwsgACACEDC2OAIIDAILIAAgAhAwtjgCDAwBCyAAIAIQMLY4AhALQQEhAwsgAwsMACABQf7/A3FBNkYLBABBNwsdACABQTUQWCIBRQRAQQEPCyABKAIEIAAQ8wNBAAsTAEEBIQAgAUEbRiABQTVGckVFCwQAQTULBwAgAUEcRgscACABQQEQWCIBBH8gASgCBCAAEJgGQQAFQQELC88BAQN/IwBBEGsiAiQAIAIgAEEcaiIDECo2AgggAiADECs2AgADQAJAIAJBCGogAhAsIgRFDQAgAigCCCgCACIDIAEgAygCACgCGBEBACIDDQAgAkEIahAtDAELCwJAIARFBEAgAiAAQRBqIgAQKjYCCCACIAAQKzYCAANAIAJBCGogAhAsRQRAQQAhAwwDCyACKAIIKAIAIgAgASAAKAIAKAIYEQEAIgMNAiACQQhqEC0MAAALAAsgAkEQaiQAIANB/wFxDwsgAkEQaiQAIAMLzwEBA38jAEEQayICJAAgAiAAQRxqIgMQKjYCCCACIAMQKzYCAANAAkAgAkEIaiACECwiBEUNACACKAIIKAIAIgMgASADKAIAKAIUEQEAIgMNACACQQhqEC0MAQsLAkAgBEUEQCACIABBEGoiABAqNgIIIAIgABArNgIAA0AgAkEIaiACECxFBEBBACEDDAMLIAIoAggoAgAiACABIAAoAgAoAhQRAQAiAw0CIAJBCGoQLQwAAAsACyACQRBqJAAgA0H/AXEPCyACQRBqJAAgAwsJACAAEPUDEDILBABBHAsHACAAKAIcC1kBAn8jAEEQayICJAAgABCYAQRAIAAoAgAhAyAAEPoDGiADEDILIAAgASgCCDYCCCAAIAEpAgA3AgAgAUEAEPkDIAJBADoADyABIAJBD2oQ+AMgAkEQaiQACwcAIAFBG0YLBABBGwuHAQACQAJAAkACQAJAAkACQAJAAkAgAUFIag4HAAECAwQFBgcLIAAgAhA3NgIQDAcLIAAgAhA3NgIUDAYLIAAgAhAwtjgCGAwFCyAAIAIQNzYCHAwECyAAIAIQNzYCIAwDCyAAIAIQNzYCJAwCCyAAIAIQkQE6ACgMAQsgACABIAIQ+wMPC0EBCx8AQQEhAAJAAkAgAUFlag4FAQAAAAEAC0EAIQALIAALBABBHwsHACAAKAIUCwcAIAAoAiQLBwAgACgCIAsHACAALQAoCxwAIAFBARBYIgEEfyABKAIEIAAQmQZBAAVBAQsLJwEBfyMAQRBrIgIkACACIAE2AgwgAEEsaiACQQxqEFMgAkEQaiQAC2oBAX8jAEEQayICJAAgAiAAQSxqIgAQKjYCCCACIAAQKzYCAANAAkAgAkEIaiACECxFBEBBACEADAELIAIoAggoAgAiACABIAAoAgAoAhgRAQAiAA0AIAJBCGoQLQwBCwsgAkEQaiQAIAALagEBfyMAQRBrIgIkACACIABBLGoiABAqNgIIIAIgABArNgIAA0ACQCACQQhqIAIQLEUEQEEAIQAMAQsgAigCCCgCACIAIAEgACgCACgCFBEBACIADQAgAkEIahAtDAELCyACQRBqJAAgAAsJACAAEP0DEDILFABBASEAIAFBPEYgAUHCAEZyRUULBABBPAsaACABQTkQWCIBRQRAQQEPCyABIAAQ1QNBAAtqAQF/IwBBEGsiAiQAIAIgAEEEaiIAECo2AgggAiAAECs2AgADQAJAIAJBCGogAhAsRQRAQQAhAAwBCyACKAIIKAIAIgAgASAAKAIAKAIYEQEAIgANACACQQhqEC0MAQsLIAJBEGokACAAC2oBAX8jAEEQayICJAAgAiAAQQRqIgAQKjYCCCACIAAQKzYCAANAAkAgAkEIaiACECxFBEBBACEADAELIAIoAggoAgAiACABIAAoAgAoAhQRAQAiAA0AIAJBCGoQLQwBCwsgAkEQaiQAIAALCQAgABC5AhAyCyAAIAFB+gBGBEAgACACEDc2AhhBAQ8LIAAgASACELgBCxMAQQEhACABQR1GIAFBMkZyRUULBABBMgsOACABIAIgACgCGBCFBAsiAQF+IAEgAq0gA61CIIaEIAQgABEoACIFQiCIpxAWIAWnCxMAIAEgAiADIAQgBSAGIAARIAALEQAgASACIAMgBCAFIAARFAALBwAgABEJAAsNACABIAIgAyAAERYACxEAIAEgAiADIAQgBSAAERsACw0AIAEgAiADIAARHgALDgAgASACIAAoAhgQhQQLEwAgASACIAMgBCAFIAYgABEcAAsXACABIAIgAyAEIAUgBiAHIAggABEdAAsTACABIAIgAyAEIAUgBiAAERAACw8AIAEgAiADIAQgABELAAsLACABIAIgABEXAAsPACABIAIgAyAEIAAREwALDQAgASACIAMgABERAAsLACABIAIgABEKAAsLACABIAIgABEfAAsLACABIAIgABESAAsRACABIAIgAyAEIAUgABENAAsVACABIAIgAyAEIAUgBiAHIAARDAALDQAgASACIAMgABEIAAsNACABIAIgAyAAEQUACwkAIAEgABEHAAsLACABIAIgABEDAAsTACABIAIgAyAEIAUgBiAAERUACw8AIAEgAiADIAQgABEOAAsHACAAEQYACw0AIAEgAiADIAARBAALBwAgACoCOAsLACABIAIgABEBAAsJACABIAARAAALCQAgASAAEQIAC1kBAX8gACAALQBKIgFBf2ogAXI6AEogACgCACIBQQhxBEAgACABQSByNgIAQX8PCyAAQgA3AgQgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCEEEACwcAIAAqAjQLiQQCAn8EfgJAIAG9IgZCAYYiBVAgBkL///////////8Ag0KAgICAgICA+P8AVnJFBEAgAL0iB0I0iKdB/w9xIgJB/w9HDQELIAAgAaIiACAAow8LIAdCAYYiBCAFVgRAIAZCNIinQf8PcSEDAn4gAkUEQEEAIQIgB0IMhiIEQgBZBEADQCACQX9qIQIgBEIBhiIEQn9VDQALCyAHQQEgAmuthgwBCyAHQv////////8Hg0KAgICAgICACIQLIQQCfiADRQRAQQAhAyAGQgyGIgVCAFkEQANAIANBf2ohAyAFQgGGIgVCf1UNAAsLIAZBASADa62GDAELIAZC/////////weDQoCAgICAgIAIhAshBiACIANKBEADQAJAIAQgBn0iBUIAUw0AIAUiBEIAUg0AIABEAAAAAAAAAACiDwsgBEIBhiEEIAJBf2oiAiADSg0ACyADIQILAkAgBCAGfSIFQgBTDQAgBSIEQgBSDQAgAEQAAAAAAAAAAKIPCwJAIARC/////////wdWBEAgBCEFDAELA0AgAkF/aiECIARCgICAgICAgARUIQMgBEIBhiIFIQQgAw0ACwsgB0KAgICAgICAgIB/gyEEIAJBAU4EfiAFQoCAgICAgIB4fCACrUI0hoQFIAVBASACa62ICyAEhL8PCyAARAAAAAAAAAAAoiAAIAQgBVEbCzIAIAC8Qf////8HcUGAgID8B00EQCAAIAAgAZcgAbxB/////wdxQYCAgPwHSxsPCyABCzIAIAC8Qf////8HcUGAgID8B00EQCAAIAAgAZYgAbxB/////wdxQYCAgPwHSxsPCyABCwcAIAAqAjALAwAACzIBAX8jAEEQayIBJAAgAUEIaiAAKAIEEEEoAgBBAToAACAAKAIIQQE6AAAgAUEQaiQACy4BAX8CQCAAKAIIIgAtAAAiAUEBRwR/IAFBAnENASAAQQI6AABBAQVBAAsPCwALMwECfyMAQRBrIgEkACABQQhqIAAoAgQQQSgCAC0AAEUEQCAAEPgIIQILIAFBEGokACACCyQAIABBC08EfyAAQRBqQXBxIgAgAEF/aiIAIABBC0YbBUEKCwtFAQF/IwBBEGsiAiQAAkAgARCYAUUEQCAAIAEoAgg2AgggACABKQIANwIADAELIAAgASgCACABKAIEELwCCyACQRBqJAALbwECfyMAQRBrIgMkACABIABrQQJ1IQEDQCABBEAgAyAANgIMIAMgAygCDCABQQF2IgRBAnRqNgIMIAMoAgwgAhD+AQR/IAMgAygCDEEEaiIANgIMIAEgBEF/c2oFIAQLIQEMAQsLIANBEGokACAACyEBAX8jAEEQayIDJAAgACABIAIQ/AghACADQRBqJAAgAAtQAQF+AkAgA0HAAHEEQCABIANBQGqthiECQgAhAQwBCyADRQ0AIAIgA60iBIYgAUHAACADa62IhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvZAwICfwJ+IwBBIGsiAiQAAkAgAUL///////////8AgyIFQoCAgICAgMD/Q3wgBUKAgICAgIDAgLx/fFQEQCABQgSGIABCPIiEIQQgAEL//////////w+DIgBCgYCAgICAgIAIWgRAIARCgYCAgICAgIDAAHwhBAwCCyAEQoCAgICAgICAQH0hBCAAQoCAgICAgICACIVCAFINASAEQgGDIAR8IQQMAQsgAFAgBUKAgICAgIDA//8AVCAFQoCAgICAgMD//wBRG0UEQCABQgSGIABCPIiEQv////////8Dg0KAgICAgICA/P8AhCEEDAELQoCAgICAgID4/wAhBCAFQv///////7//wwBWDQBCACEEIAVCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahD+CCACIAAgBEGB+AAgA2sQgAkgAikDCEIEhiACKQMAIgBCPIiEIQQgAikDECACKQMYhEIAUq0gAEL//////////w+DhCIAQoGAgICAgICACFoEQCAEQgF8IQQMAQsg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aiQACygBAX8jAEEQayICJAAgAiABNgIMIAAoAgggAkEMahDmCSACQRBqJAALNAEBfyMAQRBrIgMkACADIAI2AgggAyABNgIMIAAoAgggA0EMaiADQQhqEOkJIANBEGokAAsMACAAKAIIIAEQ7AkLCgAgAEGH7gAQeAsKACAAQYLuABB4CwcAIAAqAhgLDAAgABCpBBogABAyCy0AIABBADYCACAAQaj7ADYCACAAQQRqELcBIABBhPsANgIAIABBCGogARDCAgs9AQF/IAAoAgQiBkEBdSABaiEBIAAoAgAhACABIAIgAyAEIAUgBkEBcQR/IAEoAgAgAGooAgAFIAALEQ0ACxAAIAEgAiADIAAqAhgQqAQLKQEBfyMAQRBrIgIkACACIAA2AgwgAkEMaiABEKsEEHkgAkEQaiQAIAALTAECfwJAQZCvAS0AAEEBcQ0AQZCvARBNRQ0AIwBBEGsiACQAQQJBiPkAEAMhASAAQRBqJABBjK8BIAE2AgBBkK8BEEwLQYyvASgCAAspACAAKAIAIAEoAgA2AgAgACgCACABKAIENgIEIAAgACgCAEEIajYCAAslAANAIAEgACgCCEcEQCAAKAIQGiAAIAAoAghBf2o2AggMAQsLCyYAIAAoAgAaIAAoAgAgABCOAWoaIAAoAgAgABCOAWoaIAAoAgAaCygBAX8gACABKAIANgIAIAEoAgAhAyAAIAE2AgggACACIANqNgIEIAALPwEBfyMAQRBrIgEkACAAEC8aIAFBfzYCDCABQf////8HNgIIIAFBDGogAUEIahDBASgCACEAIAFBEGokACAACyUAIAAoAgAaIAAoAgAgABCOAWoaIAAoAgAaIAAoAgAgABBvahoLUAEBfyAAENACIAAQLyAAKAIAIAAoAgQgAUEEaiICEMcBIAAgAhA2IABBBGogAUEIahA2IAAQLyABEDUQNiABIAEoAgQ2AgAgACAAEG8Q/QkLWQECfyMAQRBrIgIkACACIABBCGogARD+CSIBKAIAIQMDQCABKAIEIANHBEAgACgCEBogASgCABC3ASABIAEoAgBBAWoiAzYCAAwBCwsgARDQASACQRBqJAALbgECfyMAQRBrIgQkACAEQQA2AgwgAEEMaiAEQQxqIAMQnwEgAQRAIAAoAhAaQX8gAUkEQBBiAAsgARApIQULIAAgBTYC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QRAQKSACEMcHIQAgAkEQaiQAIAALCgAgAEH0AGoQOQs+AQF/IwBBEGsiASQAIAEgACkCADcDCEG6sAFB6fMAQQNBuIMBQfz7AEGgByABQQhqEDRBABAAIAFBEGokAAs+AQF/IwBBEGsiASQAIAEgACkCADcDCEG6sAFB1fMAQQNBrIMBQfz7AEGfByABQQhqEDRBABAAIAFBEGokAAsKACAAQegAahA5CzcAAkACQAJAAkAgAUFbag4CAQIACyABQdgARw0CIAAgAhCtBA8LIAAgAhDFAg8LIAAgAhDFAgsLPgEBfyMAQRBrIgEkACABIAApAgA3AwhBurABQbbzAEEDQZiDAUH8+wBBnQcgAUEIahA0QQAQACABQRBqJAALPgEBfyMAQRBrIgEkACABIAApAgA3AwhBurABQaXzAEEDQYyDAUH8+wBBnAcgAUEIahA0QQAQACABQRBqJAALPgEBfyMAQRBrIgEkACABIAApAgA3AwhBurABQZzzAEEDQYCDAUH8+wBBmwcgAUEIahA0QQAQACABQRBqJAALfQEBfyMAQRBrIgIkACACIABB3ABqIgAQKjYCCCACIAAQKzYCAANAAkAgAkEIaiACECxFBEBBACEADAELAkAgAigCCCgCACIARQ0AIABBKSAAKAIAKAIMEQEARQ0AIAAQQiABEIgBDQELIAJBCGoQLQwBCwsgAkEQaiQAIAALPgEBfyMAQRBrIgEkACABIAApAgA3AwhBurABQZfzAEEDQfSCAUH8+wBBmgcgAUEIahA0QQAQACABQRBqJAALcwEBfyMAQRBrIgIkACACIABB3ABqIgAQKjYCCCACIAAQKzYCAANAAkAgAkEIaiACECxFBEBBACEADAELAkAgAigCCCgCACIARQ0AIAAQsQJFDQAgABBCIAEQiAENAQsgAkEIahAtDAELCyACQRBqJAAgAAs+AQF/IwBBEGsiASQAIAEgACkCADcDCEG6sAFBkvMAQQNB6IIBQfz7AEGZByABQQhqEDRBABAAIAFBEGokAAtzAQF/IwBBEGsiAiQAIAIgAEHcAGoiABAqNgIIIAIgABArNgIAA0ACQCACQQhqIAIQLEUEQEEAIQAMAQsCQCACKAIIKAIAIgBFDQAgABCqAkUNACAAEEIgARCIAQ0BCyACQQhqEC0MAQsLIAJBEGokACAACz4B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AKkBAACqAQAAqwEAAKwBAABk////AAAAAK0BAEGELwuGAa4BAACvAQAAsAEAALEBAACyAQAAQQEAAEIBAACuAAAArwAAALAAAABDAQAARAEAALMBAAC0AAAAtQAAALYAAAC3AAAAuAAAAEYBAABHAQAASAEAAEkBAABKAQAASwEAAEwBAABNAQAATgEAAE8BAABQAQAAUQEAALQBAAC1AQAAtgEAALcBAEGUMAt+UgEAALgBAACwAQAAsQEAALIBAABBAQAAQgEAAK4AAACvAAAAsAAAAEMBAABEAQAAVAEAALQAAAC1AAAAtgAAALcAAAC4AAAARgEAAEcBAABIAQAASQEAAEoBAABLAQAATAEAAE0BAABOAQAATwEAAFABAABRAQAAuQEAALoBAEGcMQt6uwEAALwBAAC9AQAAvgEAAL8BAABBAQAAQgEAAK4AAACvAAAAsAAAAEMBAABEAQAAwAEAALQAAAC1AAAAtgAAALcAAAC4AAAARgEAAEcBAABIAQAASQEAAEoBAABLAQAATAEAAE0BAABOAQAATwEAAFABAABRAQAAwQEAQaAyC3pSAQAAwgEAAL0BAAC+AQAAvwEAAEEBAABCAQAArgAAAK8AAACwAAAAQwEAAEQBAABUAQAAtAAAALUAAAC2AAAAtwAAALgAAABGAQAARwEAAEgBAABJAQAASgEAAEsBAABMAQAATQEAAE4BAABPAQAAUAEAAFEBAADDAQBBpDMLYsQBAADFAQAAxgEAAMcBAADIAQAAyQEAAGABAACuAAAArwAAALAAAADKAQAAsgAAAMsBAAC0AAAAtQAAALYAAAC3AAAAuAAAAEYBAABHAQAASAEAAEkBAADMAQAAzQEAAM4BAEGQNAthzwEAANABAADGAQAAxwEAAMgBAACsAAAAYAEAAK4AAACvAAAAsAAAALEAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAAC4AAAARgEAAEcBAABIAQAASQEAAMwBAADNAQAAKQBB/DQLYc8BAADRAQAA0gEAANMBAADIAQAArAAAAGABAACuAAAArwAAALAAAACxAAAAsgAAALMAAAC0AAAAtQAAALYAAAC3AAAAuAAAAEYBAABHAQAASAEAAEkBAADMAQAAzQEAACkAQeg1C6MB2QAAANQBAADSAQAA0wEAAMgBAACsAAAAYAEAAK4AAACvAAAAsAAAALEAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAAC4AAAARgEAAEcBAABIAQAASQEAAMwBAADNAQAAYWxsb2NhdG9yPFQ+OjphbGxvY2F0ZShzaXplX3QgbikgJ24nIGV4Y2VlZHMgbWF4aW11bSBzdXBwb3J0ZWQgc2l6ZQBBlDcLa4sBAADVAQAAjQEAANYBAACOAQAAjwEAAJABAACRAQAAkgEAANcBAABhbGxvY2F0b3I8VD46OmFsbG9jYXRlKHNpemVfdCBuKSAnbicgZXhjZWVkcyBtYXhpbXVtIHN1cHBvcnRlZCBzaXplAEGIOAuKAa4BAADYAQAA2QEAANoBAADbAQAAQQEAAEIBAACuAAAArwAAALAAAABDAQAARAEAANwBAAC0AAAAtQAAALYAAAC3AAAAuAAAAEYBAABHAQAASAEAAEkBAABKAQAASwEAAEwBAABNAQAATgEAAE8BAABQAQAAUQEAALQBAAC1AQAA3QEAAN4BAADfAQBBnDkLigGuAQAA4AEAANkBAADaAQAA2wEAAEEBAABCAQAArgAAAK8AAACwAAAAQwEAAEQBAACzAQAAtAAAALUAAAC2AAAAtwAAALgAAABGAQAARwEAAEgBAABJAQAASgEAAEsBAABMAQAATQEAAE4BAABPAQAAUAEAAFEBAAC0AQAAtQEAALYBAAC3AQAA4QEAQbA6C0LZAAAA4gEAAJgBAACZAQAAmgEAABwBAAAdAQAArgAAAK8AAACwAAAA4AAAALIAAADhAAAAeQEAAHoBAAB7AQAA4wEAQfw6C3bkAQAA5QEAAOYBAADnAQAAQAEAAEEBAABCAQAArgAAAK8AAACwAAAAQwEAAEQBAADoAQAAtAAAALUAAAC2AAAAtwAAALgAAABGAQAARwEAAEgBAABJAQAASgEAAEsBAABMAQAATQEAAE4BAABPAQAAUAEAAFEBAEH8Owt2UgEAAOkBAADmAQAA5wEAAEABAABBAQAAQgEAAK4AAACvAAAAsAAAAEMBAABEAQAAVAEAALQAAAC1AAAAtgAAALcAAAC4AAAARgEAAEcBAABIAQAASQEAAEoBAABLAQAATAEAAE0BAABOAQAATwEAAFABAABRAQBB/DwLowHqAQAA6wEAAOwBAADtAQAA7gEAAKwAAADvAQAArgAAAK8AAACwAAAA4AAAAPABAADxAQAA8gEAAPMBAAD0AQAA9QEAAPYBAAD3AQAA+AEAALj///8AAAAA+QEAAEFydGJvYXJkOjppbml0aWFsaXplIC0gRHJhdyBydWxlIHRhcmdldHMgbWlzc2luZyBjb21wb25lbnQgd2lkdGggaWQgJWQKAEGoPgt/2QAAAPoBAAD7AQAA/AEAAP0BAACsAAAAKQAAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAAP4BAAD/AQAAYWxsb2NhdG9yPFQ+OjphbGxvY2F0ZShzaXplX3QgbikgJ24nIGV4Y2VlZHMgbWF4aW11bSBzdXBwb3J0ZWQgc2l6ZQBBtD8LigHZAAAAAAIAAL4AAAC/AAAAwAAAAKwAAAApAAAArgAAAK8AAACwAAAA4AAAALIAAADhAAAARGVwZW5kZW5jeSBjeWNsZSEKAGFsbG9jYXRvcjxUPjo6YWxsb2NhdGUoc2l6ZV90IG4pICduJyBleGNlZWRzIG1heGltdW0gc3VwcG9ydGVkIHNpemUAQcjAAAs22QAAAAECAAACAgAAAwIAAAQCAAAFAgAABgIAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAAAcCAEGIwQALtwLZAAAACAIAAPsBAAD8AQAA/QEAAAkCAAAKAgAArgAAAK8AAACwAAAA4AAAALIAAADhAAAA/gEAAAsCAABhbGxvY2F0b3I8VD46OmFsbG9jYXRlKHNpemVfdCBuKSAnbicgZXhjZWVkcyBtYXhpbXVtIHN1cHBvcnRlZCBzaXplAEJhZCBoZWFkZXIKAFVuc3VwcG9ydGVkIHZlcnNpb24gJXUuJXUgZXhwZWN0ZWQgJXUuJXUuCgBSSVZFAGFsbG9jYXRvcjxUPjo6YWxsb2NhdGUoc2l6ZV90IG4pICduJyBleGNlZWRzIG1heGltdW0gc3VwcG9ydGVkIHNpemUAAFVua25vd24gcHJvcGVydHkga2V5ICVsbHUsIG1pc3NpbmcgZnJvbSBwcm9wZXJ0eSBUb0MuCgBBzMMACyI/AAAADAIAAA0CAAAOAgAADwIAAEQAAABFAAAARgAAABACAEH4wwALIj8AAAARAgAADQIAAA4CAAAPAgAARAAAAEUAAABGAAAAEAIAQaTEAAshAQAAABICAAAPAAAAEAAAABEAAAApAAAAKQAAAFwAAAAVAEHQxAALJmQAAAATAgAAFAIAABUCAAAWAgAAaQAAAGoAAABrAAAAbAAAABcCAEGAxQALJmQAAAAYAgAAFAIAABUCAAAWAgAAaQAAAGoAAABrAAAAbAAAABcCAEGwxQALIWQAAAAZAgAAZgAAAGcAAABoAAAAKQAAACkAAABcAAAAbABB3MUACyFkAAAAGgIAAG4AAABvAAAAaAAAACkAAAApAAAAXAAAAGwAQYjGAAspAQAAABsCAACjAAAApAAAAJgAAACOAAAAjwAAAJAAAACRAAAAmQAAAJoAQbzGAAshAQAAABwCAACWAAAAlwAAAJgAAAApAAAAKQAAAFwAAACRAEHoxgALIQEAAAAdAgAAGAAAABkAAAAaAAAAKQAAACkAAABcAAAAHgBBlMcACzUBAAAAHgIAADkAAAA6AAAAOwAAACMAAAAkAAAAJQAAACYAAAAnAAAAKAAAACkAAAApAAAAPgBB1McACykBAAAAHwIAACAAAAAhAAAAIgAAACkAAAApAAAAXAAAACYAAAAnAAAAKABBiMgACzEBAAAAIAIAAJwAAACdAAAAngAAAI4AAACPAAAAkAAAAJEAAACZAAAAmgAAAJQAAAChAEHEyAALLQEAAAAhAgAAIgIAACMCAACNAAAAjgAAAI8AAACQAAAAkQAAAJkAAACaAAAAlABB/MgACy0BAAAAJAIAACICAAAjAgAAjQAAAI4AAACPAAAAkAAAAJEAAACZAAAAmgAAAJQAQbTJAAsdPwAAACUCAAAmAgAAJwIAAEMAAABEAAAARQAAAEYAQdzJAAsdPwAAACgCAAAmAgAAJwIAAEMAAABEAAAARQAAAEYAQYTKAAshZAAAACkCAAB5AAAAegAAAGgAAAApAAAAKQAAAFwAAABsAEGwygALIVcAAAAqAgAAWQAAAFoAAABbAAAAKwIAACwCAABcAAAATwBB3MoACy0BAAAALQIAAAMAAAAEAAAABQAAACkAAAApAAAAXAAAAAkAAAAKAAAACwAAAAwAQZTLAAstAQAAAC4CAACAAAAAgQAAAIIAAAApAAAAKQAAAFwAAACGAAAAhwAAAIgAAACJAEHMywALNQEAAAAvAgAAMgAAADMAAAA0AAAAIwAAACQAAAAlAAAAJgAAACcAAAAoAAAAKQAAACkAAAA3AEGMzAALNQEAAAAwAgAAKwAAACwAAAAtAAAAIwAAACQAAAAlAAAAJgAAACcAAAAoAAAAKQAAACkAAAAwAEHMzAALIVcAAAAxAgAAXwAAAGAAAABbAAAAKwIAACwCAABcAAAATwBB+MwACx0/AAAAMgIAADMCAAA0AgAAQwAAAEQAAABFAAAARgBBoM0ACx0/AAAANQIAADMCAAA0AgAAQwAAAEQAAABFAAAARgBByM0ACz1XAAAANgIAAEkAAABKAAAASwAAACsCAAAsAgAAXAAAAE8AAABQAAAAUQAAAFIAAABTAAAAVAAAAFUAAABWAEGQzgALIWQAAAA3AgAAOAIAADkCAABoAAAAaQAAAGoAAABrAAAAbABBvM4ACyFkAAAAOgIAADgCAAA5AgAAaAAAAGkAAABqAAAAawAAAGwAQejOAAsdPwAAADsCAAA8AgAAPQIAAEMAAABEAAAARQAAAEYAQZDPAAsdPwAAAD4CAAA8AgAAPQIAAEMAAABEAAAARQAAAEYAQbjPAAstAQAAAD8CAACLAAAAjAAAAI0AAACOAAAAjwAAAJAAAACRAAAAmQAAAJoAAACUAEHwzwALJmQAAABAAgAAQQIAAEICAABDAgAAaQAAAGoAAABrAAAAbAAAAEQCAEGg0AALJmQAAABFAgAAQQIAAEICAABDAgAAaQAAAGoAAABrAAAAbAAAAEQCAEHQ0AALRtkAAABGAgAARwIAAEgCAABJAgAArAAAACkAAACuAAAArwAAALAAAADgAAAAsgAAAOEAAABKAgAASwIAAEwCAABNAgAATgIAQaDRAAsBKQBBrNEAC1pPAgAAUAIAAFECAABSAgAASQIAAFMCAABUAgAArgAAAK8AAACwAAAAVQIAALIAAABWAgAAVwIAAFgCAABZAgAAWgIAAFsCAABcAgAAXQIAALz///8AAAAAXgIAQZDSAAtSXwIAAGACAABhAgAAYgIAAGMCAACsAAAAZAIAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAAGUCAABmAgAAKQAAACkAAABnAgAAaAIAAGkCAABqAgBB7NIACzbZAAAAawIAAGwCAABtAgAAbgIAAKwAAAApAAAArgAAAK8AAACwAAAA4AAAALIAAADhAAAAZQIAQazTAAs22QAAAG8CAABwAgAAcQIAAHICAACsAAAAKQAAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAAHMCAEHs0wALOtkAAAB0AgAAdQIAAHYCAAB3AgAArAAAACkAAACuAAAArwAAALAAAADgAAAAsgAAAOEAAAB4AgAAeQIAQbDUAAtGXwIAAHoCAAB7AgAAfAIAAH0CAACsAAAAZAIAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAAGUCAABmAgAAKQAAACkAAAB+AgBBgNUAC1LZAAAAfwIAABkBAAAaAQAAGwEAABwBAAAdAQAArgAAAK8AAACwAAAA4AAAALIAAADhAAAAHgEAAB8BAAAgAQAAKQAAACkAAACAAgAAgQIAAIICAEHc1QALalIBAACDAgAAowEAAKQBAAClAQAAQQEAAEIBAACuAAAArwAAALAAAABDAQAARAEAAFQBAAC0AAAAtQAAALYAAAC3AAAAuAAAAEYBAABHAQAASAEAAEkBAABKAQAASwEAAEwBAABNAQAAqwEAQdDWAAsBKQBB3NYAC07ZAAAAhAIAADEBAAAyAQAAMwEAABwBAAAdAQAArgAAAK8AAACwAAAA4AAAALIAAADhAAAAHgEAAB8BAAAgAQAAKQAAACkAAACFAgAAhgIAQbTXAAs+2QAAAIcCAAAOAQAADwEAABABAACsAAAAKQAAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAABUBAAAWAQAAFwEAQfzXAAs22QAAAIgCAAACAgAAAwIAAAQCAACsAAAAKQAAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAAIkCAEG82AALStkAAACKAgAA7AEAAO0BAADuAQAArAAAACkAAACuAAAArwAAALAAAADgAAAAsgAAAOEAAADyAQAA8wEAAPQBAAD1AQAA9gEAAPcBAEGQ2QALASkAQZzZAAsdAQAAAIsCAACMAgAAjQIAAI4CAACPAgAAkAIAAFwAQcTZAAsdAQAAAJECAACMAgAAjQIAAI4CAAApAAAAKQAAAFwAQezZAAs52QAAAJICAADqAAAA6wAAAOwAAACsAAAAKQAAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAAO8AAADwAEGw2gALUtkAAACTAgAAqQAAAKoAAACrAAAArAAAAGABAACuAAAArwAAALAAAACxAAAAsgAAALMAAAC0AAAAtQAAALYAAAC3AAAAuAAAACkAAAApAAAAlAIAQYzbAAtN2QAAAJUCAACWAgAAlwIAAGoBAACsAAAAYAEAAK4AAACvAAAAsAAAALEAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAAC4AAAAKQAAACkAQeTbAAtN2QAAAJgCAACWAgAAlwIAAGoBAACsAAAAYAEAAK4AAACvAAAAsAAAALEAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAAC4AAAAKQAAACkAQbzcAAtapwAAAJkCAADCAAAAwwAAAMQAAACsAAAArQAAAK4AAACvAAAAsAAAALEAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAAC4AAAAxgAAAMcAAAC7AAAAmgIAAJsCAEGg3QALSdkAAACcAgAAzAAAAM0AAADOAAAArAAAACkAAACuAAAArwAAALAAAADgAAAAsgAAAOEAAADTAAAA1AAAANUAAADWAAAA1wAAANgAQfTdAAtN2QAAAJ0CAADbAAAA3AAAAN0AAACsAAAAKQAAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAAOIAAADjAAAA5AAAAOUAAADmAAAA5wAAAOgAQczeAAtK2QAAAJ4CAACfAgAAoAIAAKECAADtAAAA7gAAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAAO8AAADwAAAAogIAAKMCAACkAgAApQIAQaDfAAvZAdkAAACmAgAAnwIAAKACAAChAgAA7QAAAO4AAACuAAAArwAAALAAAADgAAAAsgAAAOEAAADvAAAA8AAAAKICAACjAgAApAIAAKUCAAABAAAAAAAAAP////8CAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAD/////AgAAAAIAAAD/////AAAAAAIAAAACAAAAAgAAAP////////////////////8CAAAAAAAAAAIAAAACAAAAAgAAAP////8DAAAAAwAAAAIAQYThAAsVAgAAAP///////////////wIAAAACAEGs4QALDf////8AAAAA/////wEAQcThAAsBAgBB2OEACw0CAAAAAgAAAAIAAAACAEH04QALVQIAAAD//////////////////////////////////////////wIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAMAAAACAAAAAgAAAAIAQdziAAsVAgAAAAIAAAACAAAAAgAAAAIAAAACAEH84gALFQIAAAACAAAAAgAAAAIAAAACAAAAAgBBpOMACxQCAAAAAgAAAAIAAAAAAAAA/////wBByOMACxECAAAAAgAAAAAAAAACAAAAAgBB5OMAC5gB//////////////////////////////////////////8BAAAA/////wIAAAAAAAAA/////////////////////////////////////wAAAAD/////AAAAAAAAAAD//////////wAAAAAAAAAAAgAAAAAAAAD/////AAAAAAAAgL8AAIC/AAAAAAAAgL8AAIA/AACAvwAAgL8AQYrlAAt8gD8AAAAAAACAvwAAgD8AAAAAAACAPwAAgD8AAIA/AAAAAAAAAADZAAAApwIAAGIBAABjAQAAZAEAAKwAAABgAQAArgAAAK8AAACwAAAAsQAAALIAAACzAAAAtAAAALUAAAC2AAAAtwAAALgAAABGAQAARwEAAEgBAABJAQBBkOYAC03ZAAAAqAIAAGgBAABpAQAAagEAAKwAAABgAQAArgAAAK8AAACwAAAAsQAAALIAAACzAAAAtAAAALUAAAC2AAAAtwAAALgAAAApAAAAKQBB6OYAC0ZfAgAAqQIAAHsCAAB8AgAAfQIAAKwAAABkAgAArgAAAK8AAACwAAAA4AAAALIAAADhAAAAZQIAAKoCAACrAgAArAIAAH4CAEG45wALOtkAAACtAgAAdQIAAHYCAAB3AgAArgIAAK8CAACuAAAArwAAALAAAADgAAAAsgAAAOEAAACwAgAAsQIAQfznAAufAU8CAACzAgAARwIAAEgCAABJAgAAUwIAAFQCAACuAAAArwAAALAAAABVAgAAsgAAAFYCAABXAgAAWAIAAFkCAABaAgAAWwIAAFwCAABdAgAAvP///wAAAABeAgAAYWxsb2NhdG9yPFQ+OjphbGxvY2F0ZShzaXplX3QgbikgJ24nIGV4Y2VlZHMgbWF4aW11bSBzdXBwb3J0ZWQgc2l6ZQBBpOkAC1pPAgAAtAIAAFECAABSAgAASQIAAFMCAAC1AgAArgAAAK8AAACwAAAAVQIAALIAAABWAgAAVwIAAFgCAABZAgAAWgIAAFsCAABcAgAAtgIAALz///8AAAAAXgIAQYjqAAtBXwIAALcCAABsAgAAbQIAAG4CAACsAAAAZAIAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAAGUCAABmAgAAKQAAACkAQdTqAAtG2QAAALgCAABwAgAAcQIAAHICAAC5AgAAugIAAK4AAACvAAAAsAAAAOAAAACyAAAA4QAAALsCAAC8AgAAzP///wAAAAC9AgBBpOsAC1JfAgAAvgIAAGECAABiAgAAYwIAAKwAAABkAgAArgAAAK8AAACwAAAA4AAAALIAAADhAAAAZQIAAL8CAADAAgAAwQIAAMICAADDAgAAxAIAAGoCAEGA7AALWsUCAADGAgAAxwIAAMgCAADJAgAArAAAAMoCAACuAAAArwAAALAAAADgAAAAsgAAAOEAAADLAgAAzAIAAM0CAADOAgAAzwIAANACAADA////AAAAANECAADSAgBB5OwAC0LZAAAA0wIAAMcCAADIAgAAyQIAAKwAAAApAAAArgAAAK8AAACwAAAA4AAAALIAAADhAAAA1AIAANUCAADWAgAA1wIAQbDtAAuQDCkAAAApAAAAcmVuZGVyRmFjdG9yeQBtYWtlUmVuZGVyUGFpbnQAbWFrZVJlbmRlclBhdGgAYnl0ZUxlbmd0aABzZXQAbG9hZABSZW5kZXJlcgBzYXZlAHJlc3RvcmUAdHJhbnNmb3JtAGRyYXdQYXRoAGNsaXBQYXRoAGFsaWduAFJlbmRlcmVyV3JhcHBlcgBSZW5kZXJQYXRoAHJlc2V0AGFkZFBhdGgAZmlsbFJ1bGUAbW92ZVRvAGxpbmVUbwBjdWJpY1RvAGNsb3NlAFJlbmRlclBhdGhXcmFwcGVyAFJlbmRlclBhaW50U3R5bGUAZmlsbABzdHJva2UARmlsbFJ1bGUAbm9uWmVybwBldmVuT2RkAFN0cm9rZUNhcABidXR0AHJvdW5kAHNxdWFyZQBTdHJva2VKb2luAG1pdGVyAGJldmVsAEJsZW5kTW9kZQBzcmNPdmVyAHNjcmVlbgBvdmVybGF5AGRhcmtlbgBsaWdodGVuAGNvbG9yRG9kZ2UAY29sb3JCdXJuAGhhcmRMaWdodABzb2Z0TGlnaHQAZGlmZmVyZW5jZQBleGNsdXNpb24AbXVsdGlwbHkAaHVlAHNhdHVyYXRpb24AY29sb3IAbHVtaW5vc2l0eQBSZW5kZXJQYWludABzdHlsZQB0aGlja25lc3MAam9pbgBjYXAAYmxlbmRNb2RlAGxpbmVhckdyYWRpZW50AHJhZGlhbEdyYWRpZW50AGFkZFN0b3AAY29tcGxldGVHcmFkaWVudABSZW5kZXJQYWludFdyYXBwZXIATWF0MkQAeHgAeHkAeXgAeXkAdHgAdHkARmlsZQBkZWZhdWx0QXJ0Ym9hcmQAYXJ0Ym9hcmRCeU5hbWUAYXJ0Ym9hcmRCeUluZGV4AGFydGJvYXJkQ291bnQAQXJ0Ym9hcmQAbmFtZQBhZHZhbmNlAGRyYXcAdHJhbnNmb3JtQ29tcG9uZW50AG5vZGUAYm9uZQByb290Qm9uZQBhbmltYXRpb25CeUluZGV4AGFuaW1hdGlvbkJ5TmFtZQBhbmltYXRpb25Db3VudABzdGF0ZU1hY2hpbmVCeUluZGV4AHN0YXRlTWFjaGluZUJ5TmFtZQBzdGF0ZU1hY2hpbmVDb3VudABib3VuZHMAVHJhbnNmb3JtQ29tcG9uZW50AHNjYWxlWABzY2FsZVkAcm90YXRpb24ATm9kZQB4AHkAQm9uZQBsZW5ndGgAUm9vdEJvbmUAQW5pbWF0aW9uAExpbmVhckFuaW1hdGlvbgBkdXJhdGlvbgBmcHMAd29ya1N0YXJ0AHdvcmtFbmQAZW5hYmxlV29ya0FyZWEAbG9vcFZhbHVlAHNwZWVkAGFwcGx5AExpbmVhckFuaW1hdGlvbkluc3RhbmNlAHRpbWUAZGlkTG9vcABTdGF0ZU1hY2hpbmUAU3RhdGVNYWNoaW5lSW5zdGFuY2UAaW5wdXRDb3VudABpbnB1dABTTUlJbnB1dAB0eXBlAGJvb2wAOwBudW1iZXIAADgAdHJpZ2dlcgA6AGFzQm9vbABhc051bWJlcgBhc1RyaWdnZXIAU01JQm9vbAB2YWx1ZQBTTUlOdW1iZXIAU01JVHJpZ2dlcgBmaXJlAEZpdABjb250YWluAGNvdmVyAGZpdFdpZHRoAGZpdEhlaWdodABub25lAHNjYWxlRG93bgBBbGlnbm1lbnQAdG9wTGVmdAB0b3BDZW50ZXIAdG9wUmlnaHQAY2VudGVyTGVmdABjZW50ZXIAY2VudGVyUmlnaHQAYm90dG9tTGVmdABib3R0b21DZW50ZXIAYm90dG9tUmlnaHQAQUFCQgBtaW5Y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aGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIHNob3J0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8bG9uZz4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgbG9uZz4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50OF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50OF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MTZfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDMyX3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGZsb2F0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxkb3VibGU+AAADAAAABAAAAAQAAAAGAAAAg/miAERObgD8KRUA0VcnAN009QBi28AAPJmVAEGQQwBjUf4Au96rALdhxQA6biQA0k1CAEkG4AAJ6i4AHJLRAOsd/gApsRwA6D6nAPU1ggBEuy4AnOmEALQmcABBfl8A1pE5AFODOQCc9DkAi1+EACj5vQD4HzsA3v+XAA+YBQARL+8AClqLAG0fbQDPfjYACcsnAEZPtwCeZj8ALepfALondQDl68cAPXvxAPc5BwCSUooA+2vqAB+xXwAIXY0AMANWAHv8RgDwq2sAILzPADb0mgDjqR0AXmGRAAgb5gCFmWUAoBRfAI1AaACA2P8AJ3NNAAYGMQDKVhUAyahzAHviYABrjMAAGcRHAM1nwwAJ6NwAWYMqAIt2xACmHJYARK/dABlX0QClPgUABQf/ADN+PwDCMugAmE/eALt9MgAmPcMAHmvvAJ/4XgA1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";

    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }

    function getBinary() {
      try {
        if (wasmBinary) {
          return new Uint8Array(wasmBinary);
        }

        var binary = tryParseAsDataURI(wasmBinaryFile);

        if (binary) {
          return binary;
        }

        if (readBinary) {
          return readBinary(wasmBinaryFile);
        } else {
          throw "both async and sync fetching of the wasm failed";
        }
      } catch (err) {
        abort(err);
      }
    }

    function getBinaryPromise() {
      if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
        return fetch(wasmBinaryFile, {
          credentials: "same-origin"
        }).then(function (response) {
          if (!response["ok"]) {
            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
          }

          return response["arrayBuffer"]();
        }).catch(function () {
          return getBinary();
        });
      }

      return Promise.resolve().then(getBinary);
    }

    function createWasm() {
      var info = {
        "a": asmLibraryArg
      };

      function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        removeRunDependency("wasm-instantiate");
      }

      addRunDependency("wasm-instantiate");

      function receiveInstantiatedSource(output) {
        receiveInstance(output["instance"]);
      }

      function instantiateArrayBuffer(receiver) {
        return getBinaryPromise().then(function (binary) {
          return WebAssembly.instantiate(binary, info);
        }).then(receiver, function (reason) {
          err("failed to asynchronously prepare wasm: " + reason);
          abort(reason);
        });
      }

      function instantiateAsync() {
        if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
          fetch(wasmBinaryFile, {
            credentials: "same-origin"
          }).then(function (response) {
            var result = WebAssembly.instantiateStreaming(response, info);
            return result.then(receiveInstantiatedSource, function (reason) {
              err("wasm streaming compile failed: " + reason);
              err("falling back to ArrayBuffer instantiation");
              return instantiateArrayBuffer(receiveInstantiatedSource);
            });
          });
        } else {
          return instantiateArrayBuffer(receiveInstantiatedSource);
        }
      }

      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          return exports;
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          return false;
        }
      }

      instantiateAsync();
      return {};
    }

    __ATINIT__.push({
      func: function () {
        ___wasm_call_ctors();
      }
    });

    var char_0 = 48;
    var char_9 = 57;

    function makeLegalFunctionName(name) {
      if (undefined === name) {
        return "_unknown";
      }

      name = name.replace(/[^a-zA-Z0-9_]/g, "$");
      var f = name.charCodeAt(0);

      if (f >= char_0 && f <= char_9) {
        return "_" + name;
      } else {
        return name;
      }
    }

    function createNamedFunction(name, body) {
      name = makeLegalFunctionName(name);
      return new Function("body", "return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body);
    }

    var emval_free_list = [];
    var emval_handle_array = [{}, {
      value: undefined
    }, {
      value: null
    }, {
      value: true
    }, {
      value: false
    }];

    function count_emval_handles() {
      var count = 0;

      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          ++count;
        }
      }

      return count;
    }

    function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          return emval_handle_array[i];
        }
      }

      return null;
    }

    function init_emval() {
      Module["count_emval_handles"] = count_emval_handles;
      Module["get_first_emval"] = get_first_emval;
    }

    function __emval_register(value) {
      switch (value) {
        case undefined:
          {
            return 1;
          }

        case null:
          {
            return 2;
          }

        case true:
          {
            return 3;
          }

        case false:
          {
            return 4;
          }

        default:
          {
            var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
            emval_handle_array[handle] = {
              refcount: 1,
              value: value
            };
            return handle;
          }
      }
    }

    function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, function (message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;

        if (stack !== undefined) {
          this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
        }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;

      errorClass.prototype.toString = function () {
        if (this.message === undefined) {
          return this.name;
        } else {
          return this.name + ": " + this.message;
        }
      };

      return errorClass;
    }

    var PureVirtualError = undefined;

    function embind_init_charCodes() {
      var codes = new Array(256);

      for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
      }

      embind_charCodes = codes;
    }

    var embind_charCodes = undefined;

    function readLatin1String(ptr) {
      var ret = "";
      var c = ptr;

      while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]];
      }

      return ret;
    }

    function getInheritedInstanceCount() {
      return Object.keys(registeredInstances).length;
    }

    function getLiveInheritedInstances() {
      var rv = [];

      for (var k in registeredInstances) {
        if (registeredInstances.hasOwnProperty(k)) {
          rv.push(registeredInstances[k]);
        }
      }

      return rv;
    }

    var deletionQueue = [];

    function flushPendingDeletes() {
      while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj["delete"]();
      }
    }

    var delayFunction = undefined;

    function setDelayFunction(fn) {
      delayFunction = fn;

      if (deletionQueue.length && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
    }

    function init_embind() {
      Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
      Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
      Module["flushPendingDeletes"] = flushPendingDeletes;
      Module["setDelayFunction"] = setDelayFunction;
    }

    var registeredInstances = {};
    var BindingError = undefined;

    function throwBindingError(message) {
      throw new BindingError(message);
    }

    function getBasestPointer(class_, ptr) {
      if (ptr === undefined) {
        throwBindingError("ptr should not be undefined");
      }

      while (class_.baseClass) {
        ptr = class_.upcast(ptr);
        class_ = class_.baseClass;
      }

      return ptr;
    }

    function registerInheritedInstance(class_, ptr, instance) {
      ptr = getBasestPointer(class_, ptr);

      if (registeredInstances.hasOwnProperty(ptr)) {
        throwBindingError("Tried to register registered instance: " + ptr);
      } else {
        registeredInstances[ptr] = instance;
      }
    }

    function requireHandle(handle) {
      if (!handle) {
        throwBindingError("Cannot use deleted val. handle = " + handle);
      }

      return emval_handle_array[handle].value;
    }

    var registeredTypes = {};

    function getTypeName(type) {
      var ptr = ___getTypeName(type);

      var rv = readLatin1String(ptr);

      _free(ptr);

      return rv;
    }

    function requireRegisteredType(rawType, humanName) {
      var impl = registeredTypes[rawType];

      if (undefined === impl) {
        throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
      }

      return impl;
    }

    function unregisterInheritedInstance(class_, ptr) {
      ptr = getBasestPointer(class_, ptr);

      if (registeredInstances.hasOwnProperty(ptr)) {
        delete registeredInstances[ptr];
      } else {
        throwBindingError("Tried to unregister unregistered instance: " + ptr);
      }
    }

    function detachFinalizer(handle) {}

    var finalizationGroup = false;

    function runDestructor($$) {
      if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    }

    function releaseClassHandle($$) {
      $$.count.value -= 1;
      var toDelete = 0 === $$.count.value;

      if (toDelete) {
        runDestructor($$);
      }
    }

    function attachFinalizer(handle) {
      if ("undefined" === typeof FinalizationGroup) {
        attachFinalizer = function (handle) {
          return handle;
        };

        return handle;
      }

      finalizationGroup = new FinalizationGroup(function (iter) {
        for (var result = iter.next(); !result.done; result = iter.next()) {
          var $$ = result.value;

          if (!$$.ptr) {
            console.warn("object already deleted: " + $$.ptr);
          } else {
            releaseClassHandle($$);
          }
        }
      });

      attachFinalizer = function (handle) {
        finalizationGroup.register(handle, handle.$$, handle.$$);
        return handle;
      };

      detachFinalizer = function (handle) {
        finalizationGroup.unregister(handle.$$);
      };

      return attachFinalizer(handle);
    }

    function __embind_create_inheriting_constructor(constructorName, wrapperType, properties) {
      constructorName = readLatin1String(constructorName);
      wrapperType = requireRegisteredType(wrapperType, "wrapper");
      properties = requireHandle(properties);
      var arraySlice = [].slice;
      var registeredClass = wrapperType.registeredClass;
      var wrapperPrototype = registeredClass.instancePrototype;
      var baseClass = registeredClass.baseClass;
      var baseClassPrototype = baseClass.instancePrototype;
      var baseConstructor = registeredClass.baseClass.constructor;
      var ctor = createNamedFunction(constructorName, function () {
        registeredClass.baseClass.pureVirtualFunctions.forEach(function (name) {
          if (this[name] === baseClassPrototype[name]) {
            throw new PureVirtualError("Pure virtual function " + name + " must be implemented in JavaScript");
          }
        }.bind(this));
        Object.defineProperty(this, "__parent", {
          value: wrapperPrototype
        });
        this["__construct"].apply(this, arraySlice.call(arguments));
      });

      wrapperPrototype["__construct"] = function __construct() {
        if (this === wrapperPrototype) {
          throwBindingError("Pass correct 'this' to __construct");
        }

        var inner = baseConstructor["implement"].apply(undefined, [this].concat(arraySlice.call(arguments)));
        detachFinalizer(inner);
        var $$ = inner.$$;
        inner["notifyOnDestruction"]();
        $$.preservePointerOnDelete = true;
        Object.defineProperties(this, {
          $$: {
            value: $$
          }
        });
        attachFinalizer(this);
        registerInheritedInstance(registeredClass, $$.ptr, this);
      };

      wrapperPrototype["__destruct"] = function __destruct() {
        if (this === wrapperPrototype) {
          throwBindingError("Pass correct 'this' to __destruct");
        }

        detachFinalizer(this);
        unregisterInheritedInstance(registeredClass, this.$$.ptr);
      };

      ctor.prototype = Object.create(wrapperPrototype);

      for (var p in properties) {
        ctor.prototype[p] = properties[p];
      }

      return __emval_register(ctor);
    }

    var structRegistrations = {};

    function runDestructors(destructors) {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    }

    function simpleReadValueFromPointer(pointer) {
      return this["fromWireType"](HEAPU32[pointer >> 2]);
    }

    var awaitingDependencies = {};
    var typeDependencies = {};
    var InternalError = undefined;

    function throwInternalError(message) {
      throw new InternalError(message);
    }

    function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
      myTypes.forEach(function (type) {
        typeDependencies[type] = dependentTypes;
      });

      function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);

        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError("Mismatched type converter count");
        }

        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }

      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach(function (dt, i) {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);

          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }

          awaitingDependencies[dt].push(function () {
            typeConverters[i] = registeredTypes[dt];
            ++registered;

            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      });

      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    }

    function __embind_finalize_value_object(structType) {
      var reg = structRegistrations[structType];
      delete structRegistrations[structType];
      var rawConstructor = reg.rawConstructor;
      var rawDestructor = reg.rawDestructor;
      var fieldRecords = reg.fields;
      var fieldTypes = fieldRecords.map(function (field) {
        return field.getterReturnType;
      }).concat(fieldRecords.map(function (field) {
        return field.setterArgumentType;
      }));
      whenDependentTypesAreResolved([structType], fieldTypes, function (fieldTypes) {
        var fields = {};
        fieldRecords.forEach(function (field, i) {
          var fieldName = field.fieldName;
          var getterReturnType = fieldTypes[i];
          var getter = field.getter;
          var getterContext = field.getterContext;
          var setterArgumentType = fieldTypes[i + fieldRecords.length];
          var setter = field.setter;
          var setterContext = field.setterContext;
          fields[fieldName] = {
            read: function (ptr) {
              return getterReturnType["fromWireType"](getter(getterContext, ptr));
            },
            write: function (ptr, o) {
              var destructors = [];
              setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
              runDestructors(destructors);
            }
          };
        });
        return [{
          name: reg.name,
          "fromWireType": function (ptr) {
            var rv = {};

            for (var i in fields) {
              rv[i] = fields[i].read(ptr);
            }

            rawDestructor(ptr);
            return rv;
          },
          "toWireType": function (destructors, o) {
            for (var fieldName in fields) {
              if (!(fieldName in o)) {
                throw new TypeError('Missing field:  "' + fieldName + '"');
              }
            }

            var ptr = rawConstructor();

            for (fieldName in fields) {
              fields[fieldName].write(ptr, o[fieldName]);
            }

            if (destructors !== null) {
              destructors.push(rawDestructor, ptr);
            }

            return ptr;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": simpleReadValueFromPointer,
          destructorFunction: rawDestructor
        }];
      });
    }

    function getShiftFromSize(size) {
      switch (size) {
        case 1:
          return 0;

        case 2:
          return 1;

        case 4:
          return 2;

        case 8:
          return 3;

        default:
          throw new TypeError("Unknown type size: " + size);
      }
    }

    function registerType(rawType, registeredInstance, options) {
      options = options || {};

      if (!("argPackAdvance" in registeredInstance)) {
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      }

      var name = registeredInstance.name;

      if (!rawType) {
        throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
      }

      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError("Cannot register type '" + name + "' twice");
        }
      }

      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];

      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach(function (cb) {
          cb();
        });
      }
    }

    function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        "fromWireType": function (wt) {
          return !!wt;
        },
        "toWireType": function (destructors, o) {
          return o ? trueValue : falseValue;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": function (pointer) {
          var heap;

          if (size === 1) {
            heap = HEAP8;
          } else if (size === 2) {
            heap = HEAP16;
          } else if (size === 4) {
            heap = HEAP32;
          } else {
            throw new TypeError("Unknown boolean type size: " + name);
          }

          return this["fromWireType"](heap[pointer >> shift]);
        },
        destructorFunction: null
      });
    }

    function ClassHandle_isAliasOf(other) {
      if (!(this instanceof ClassHandle)) {
        return false;
      }

      if (!(other instanceof ClassHandle)) {
        return false;
      }

      var leftClass = this.$$.ptrType.registeredClass;
      var left = this.$$.ptr;
      var rightClass = other.$$.ptrType.registeredClass;
      var right = other.$$.ptr;

      while (leftClass.baseClass) {
        left = leftClass.upcast(left);
        leftClass = leftClass.baseClass;
      }

      while (rightClass.baseClass) {
        right = rightClass.upcast(right);
        rightClass = rightClass.baseClass;
      }

      return leftClass === rightClass && left === right;
    }

    function shallowCopyInternalPointer(o) {
      return {
        count: o.count,
        deleteScheduled: o.deleteScheduled,
        preservePointerOnDelete: o.preservePointerOnDelete,
        ptr: o.ptr,
        ptrType: o.ptrType,
        smartPtr: o.smartPtr,
        smartPtrType: o.smartPtrType
      };
    }

    function throwInstanceAlreadyDeleted(obj) {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }

      throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
    }

    function ClassHandle_clone() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }

      if (this.$$.preservePointerOnDelete) {
        this.$$.count.value += 1;
        return this;
      } else {
        var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
          $$: {
            value: shallowCopyInternalPointer(this.$$)
          }
        }));
        clone.$$.count.value += 1;
        clone.$$.deleteScheduled = false;
        return clone;
      }
    }

    function ClassHandle_delete() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }

      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion");
      }

      detachFinalizer(this);
      releaseClassHandle(this.$$);

      if (!this.$$.preservePointerOnDelete) {
        this.$$.smartPtr = undefined;
        this.$$.ptr = undefined;
      }
    }

    function ClassHandle_isDeleted() {
      return !this.$$.ptr;
    }

    function ClassHandle_deleteLater() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }

      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion");
      }

      deletionQueue.push(this);

      if (deletionQueue.length === 1 && delayFunction) {
        delayFunction(flushPendingDeletes);
      }

      this.$$.deleteScheduled = true;
      return this;
    }

    function init_ClassHandle() {
      ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
      ClassHandle.prototype["clone"] = ClassHandle_clone;
      ClassHandle.prototype["delete"] = ClassHandle_delete;
      ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
      ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
    }

    function ClassHandle() {}

    var registeredPointers = {};

    function ensureOverloadTable(proto, methodName, humanName) {
      if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];

        proto[methodName] = function () {
          if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
            throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
          }

          return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
        };

        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    }

    function exposePublicSymbol(name, value, numArguments) {
      if (Module.hasOwnProperty(name)) {
        if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) {
          throwBindingError("Cannot register public name '" + name + "' twice");
        }

        ensureOverloadTable(Module, name, name);

        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
        }

        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;

        if (undefined !== numArguments) {
          Module[name].numArguments = numArguments;
        }
      }
    }

    function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }

    function upcastPointer(ptr, ptrClass, desiredClass) {
      while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
          throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
        }

        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass;
      }

      return ptr;
    }

    function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }

        return 0;
      }

      if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }

      if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
      }

      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }

    function genericPointerToWireType(destructors, handle) {
      var ptr;

      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }

        if (this.isSmartPointer) {
          ptr = this.rawConstructor();

          if (destructors !== null) {
            destructors.push(this.rawDestructor, ptr);
          }

          return ptr;
        } else {
          return 0;
        }
      }

      if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }

      if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
      }

      if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
      }

      var handleClass = handle.$$.ptrType.registeredClass;
      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);

      if (this.isSmartPointer) {
        if (undefined === handle.$$.smartPtr) {
          throwBindingError("Passing raw pointer to smart pointer is illegal");
        }

        switch (this.sharingPolicy) {
          case 0:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
            }

            break;

          case 1:
            ptr = handle.$$.smartPtr;
            break;

          case 2:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              var clonedHandle = handle["clone"]();
              ptr = this.rawShare(ptr, __emval_register(function () {
                clonedHandle["delete"]();
              }));

              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
            }

            break;

          default:
            throwBindingError("Unsupporting sharing policy");
        }
      }

      return ptr;
    }

    function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }

        return 0;
      }

      if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }

      if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
      }

      if (handle.$$.ptrType.isConst) {
        throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name);
      }

      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }

    function RegisteredPointer_getPointee(ptr) {
      if (this.rawGetPointee) {
        ptr = this.rawGetPointee(ptr);
      }

      return ptr;
    }

    function RegisteredPointer_destructor(ptr) {
      if (this.rawDestructor) {
        this.rawDestructor(ptr);
      }
    }

    function RegisteredPointer_deleteObject(handle) {
      if (handle !== null) {
        handle["delete"]();
      }
    }

    function downcastPointer(ptr, ptrClass, desiredClass) {
      if (ptrClass === desiredClass) {
        return ptr;
      }

      if (undefined === desiredClass.baseClass) {
        return null;
      }

      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);

      if (rv === null) {
        return null;
      }

      return desiredClass.downcast(rv);
    }

    function getInheritedInstance(class_, ptr) {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    }

    function makeClassHandle(prototype, record) {
      if (!record.ptrType || !record.ptr) {
        throwInternalError("makeClassHandle requires ptr and ptrType");
      }

      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;

      if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError("Both smartPtrType and smartPtr must be specified");
      }

      record.count = {
        value: 1
      };
      return attachFinalizer(Object.create(prototype, {
        $$: {
          value: record
        }
      }));
    }

    function RegisteredPointer_fromWireType(ptr) {
      var rawPointer = this.getPointee(ptr);

      if (!rawPointer) {
        this.destructor(ptr);
        return null;
      }

      var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);

      if (undefined !== registeredInstance) {
        if (0 === registeredInstance.$$.count.value) {
          registeredInstance.$$.ptr = rawPointer;
          registeredInstance.$$.smartPtr = ptr;
          return registeredInstance["clone"]();
        } else {
          var rv = registeredInstance["clone"]();
          this.destructor(ptr);
          return rv;
        }
      }

      function makeDefaultHandle() {
        if (this.isSmartPointer) {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this.pointeeType,
            ptr: rawPointer,
            smartPtrType: this,
            smartPtr: ptr
          });
        } else {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this,
            ptr: ptr
          });
        }
      }

      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];

      if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this);
      }

      var toType;

      if (this.isConst) {
        toType = registeredPointerRecord.constPointerType;
      } else {
        toType = registeredPointerRecord.pointerType;
      }

      var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);

      if (dp === null) {
        return makeDefaultHandle.call(this);
      }

      if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
          smartPtrType: this,
          smartPtr: ptr
        });
      } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp
        });
      }
    }

    function init_RegisteredPointer() {
      RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
      RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
      RegisteredPointer.prototype["argPackAdvance"] = 8;
      RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
      RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
      RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType;
    }

    function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;

      if (!isSmartPointer && registeredClass.baseClass === undefined) {
        if (isConst) {
          this["toWireType"] = constNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        } else {
          this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        }
      } else {
        this["toWireType"] = genericPointerToWireType;
      }
    }

    function replacePublicSymbol(name, value, numArguments) {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol");
      }

      if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    }

    function embind__requireFunction(signature, rawFunction) {
      signature = readLatin1String(signature);

      function makeDynCaller(dynCall) {
        var args = [];

        for (var i = 1; i < signature.length; ++i) {
          args.push("a" + i);
        }

        var name = "dynCall_" + signature + "_" + rawFunction;
        var body = "return function " + name + "(" + args.join(", ") + ") {\n";
        body += "    return dynCall(rawFunction" + (args.length ? ", " : "") + args.join(", ") + ");\n";
        body += "};\n";
        return new Function("dynCall", "rawFunction", body)(dynCall, rawFunction);
      }

      var dc = Module["dynCall_" + signature];
      var fp = makeDynCaller(dc);

      if (typeof fp !== "function") {
        throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
      }

      return fp;
    }

    var UnboundTypeError = undefined;

    function throwUnboundTypeError(message, types) {
      var unboundTypes = [];
      var seen = {};

      function visit(type) {
        if (seen[type]) {
          return;
        }

        if (registeredTypes[type]) {
          return;
        }

        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);
          return;
        }

        unboundTypes.push(type);
        seen[type] = true;
      }

      types.forEach(visit);
      throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
    }

    function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
      name = readLatin1String(name);
      getActualType = embind__requireFunction(getActualTypeSignature, getActualType);

      if (upcast) {
        upcast = embind__requireFunction(upcastSignature, upcast);
      }

      if (downcast) {
        downcast = embind__requireFunction(downcastSignature, downcast);
      }

      rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
      var legalFunctionName = makeLegalFunctionName(name);
      exposePublicSymbol(legalFunctionName, function () {
        throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]);
      });
      whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function (base) {
        base = base[0];
        var baseClass;
        var basePrototype;

        if (baseClassRawType) {
          baseClass = base.registeredClass;
          basePrototype = baseClass.instancePrototype;
        } else {
          basePrototype = ClassHandle.prototype;
        }

        var constructor = createNamedFunction(legalFunctionName, function () {
          if (Object.getPrototypeOf(this) !== instancePrototype) {
            throw new BindingError("Use 'new' to construct " + name);
          }

          if (undefined === registeredClass.constructor_body) {
            throw new BindingError(name + " has no accessible constructor");
          }

          var body = registeredClass.constructor_body[arguments.length];

          if (undefined === body) {
            throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
          }

          return body.apply(this, arguments);
        });
        var instancePrototype = Object.create(basePrototype, {
          constructor: {
            value: constructor
          }
        });
        constructor.prototype = instancePrototype;
        var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
        var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
        var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
        var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
        registeredPointers[rawType] = {
          pointerType: pointerConverter,
          constPointerType: constPointerConverter
        };
        replacePublicSymbol(legalFunctionName, constructor);
        return [referenceConverter, pointerConverter, constPointerConverter];
      });
    }

    function new_(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
        throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function");
      }

      var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function () {});
      dummy.prototype = constructor.prototype;
      var obj = new dummy();
      var r = constructor.apply(obj, argumentList);
      return r instanceof Object ? r : obj;
    }

    function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
      var argCount = argTypes.length;

      if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
      }

      var isClassMethodFunc = argTypes[1] !== null && classType !== null;
      var needsDestructorStack = false;

      for (var i = 1; i < argTypes.length; ++i) {
        if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
          needsDestructorStack = true;
          break;
        }
      }

      var returns = argTypes[0].name !== "void";
      var argsList = "";
      var argsListWired = "";

      for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
      }

      var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\n" + "if (arguments.length !== " + (argCount - 2) + ") {\n" + "throwBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n" + "}\n";

      if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n";
      }

      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
      var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];

      if (isClassMethodFunc) {
        invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
      }

      for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
        args1.push("argType" + i);
        args2.push(argTypes[i + 2]);
      }

      if (isClassMethodFunc) {
        argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
      }

      invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";

      if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n";
      } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
          var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";

          if (argTypes[i].destructorFunction !== null) {
            invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
            args1.push(paramName + "_dtor");
            args2.push(argTypes[i].destructorFunction);
          }
        }
      }

      if (returns) {
        invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n";
      } else {}

      invokerFnBody += "}\n";
      args1.push(invokerFnBody);
      var invokerFunction = new_(Function, args1).apply(null, args2);
      return invokerFunction;
    }

    function heap32VectorToArray(count, firstElement) {
      var array = [];

      for (var i = 0; i < count; i++) {
        array.push(HEAP32[(firstElement >> 2) + i]);
      }

      return array;
    }

    function __embind_register_class_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, fn) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
      whenDependentTypesAreResolved([], [rawClassType], function (classType) {
        classType = classType[0];
        var humanName = classType.name + "." + methodName;

        function unboundTypesHandler() {
          throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
        }

        var proto = classType.registeredClass.constructor;

        if (undefined === proto[methodName]) {
          unboundTypesHandler.argCount = argCount - 1;
          proto[methodName] = unboundTypesHandler;
        } else {
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 1] = unboundTypesHandler;
        }

        whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
          var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
          var func = craftInvokerFunction(humanName, invokerArgsArray, null, rawInvoker, fn);

          if (undefined === proto[methodName].overloadTable) {
            func.argCount = argCount - 1;
            proto[methodName] = func;
          } else {
            proto[methodName].overloadTable[argCount - 1] = func;
          }

          return [];
        });
        return [];
      });
    }

    function validateThis(this_, classType, humanName) {
      if (!(this_ instanceof Object)) {
        throwBindingError(humanName + ' with invalid "this": ' + this_);
      }

      if (!(this_ instanceof classType.registeredClass.constructor)) {
        throwBindingError(humanName + ' incompatible with "this" of type ' + this_.constructor.name);
      }

      if (!this_.$$.ptr) {
        throwBindingError("cannot call emscripten binding method " + humanName + " on deleted object");
      }

      return upcastPointer(this_.$$.ptr, this_.$$.ptrType.registeredClass, classType.registeredClass);
    }

    function __embind_register_class_class_property(rawClassType, fieldName, rawFieldType, rawFieldPtr, getterSignature, getter, setterSignature, setter) {
      fieldName = readLatin1String(fieldName);
      getter = embind__requireFunction(getterSignature, getter);
      whenDependentTypesAreResolved([], [rawClassType], function (classType) {
        classType = classType[0];
        var humanName = classType.name + "." + fieldName;
        var desc = {
          get: function () {
            throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [rawFieldType]);
          },
          enumerable: true,
          configurable: true
        };

        if (setter) {
          desc.set = function () {
            throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [rawFieldType]);
          };
        } else {
          desc.set = function (v) {
            throwBindingError(humanName + " is a read-only property");
          };
        }

        Object.defineProperty(classType.registeredClass.constructor, fieldName, desc);
        whenDependentTypesAreResolved([], [rawFieldType], function (fieldType) {
          fieldType = fieldType[0];
          var desc = {
            get: function () {
              return fieldType["fromWireType"](getter(rawFieldPtr));
            },
            enumerable: true
          };

          if (setter) {
            setter = embind__requireFunction(setterSignature, setter);

            desc.set = function (v) {
              var destructors = [];
              setter(rawFieldPtr, fieldType["toWireType"](destructors, v));
              runDestructors(destructors);
            };
          }

          Object.defineProperty(classType.registeredClass.constructor, fieldName, desc);
          return [];
        });
        return [];
      });
    }

    function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
      assert(argCount > 0);
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
      var args = [rawConstructor];
      var destructors = [];
      whenDependentTypesAreResolved([], [rawClassType], function (classType) {
        classType = classType[0];
        var humanName = "constructor " + classType.name;

        if (undefined === classType.registeredClass.constructor_body) {
          classType.registeredClass.constructor_body = [];
        }

        if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
          throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
        }

        classType.registeredClass.constructor_body[argCount - 1] = function unboundTypeHandler() {
          throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes);
        };

        whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
          classType.registeredClass.constructor_body[argCount - 1] = function constructor_body() {
            if (arguments.length !== argCount - 1) {
              throwBindingError(humanName + " called with " + arguments.length + " arguments, expected " + (argCount - 1));
            }

            destructors.length = 0;
            args.length = argCount;

            for (var i = 1; i < argCount; ++i) {
              args[i] = argTypes[i]["toWireType"](destructors, arguments[i - 1]);
            }

            var ptr = invoker.apply(null, args);
            runDestructors(destructors);
            return argTypes[0]["fromWireType"](ptr);
          };

          return [];
        });
        return [];
      });
    }

    function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
      whenDependentTypesAreResolved([], [rawClassType], function (classType) {
        classType = classType[0];
        var humanName = classType.name + "." + methodName;

        if (isPureVirtual) {
          classType.registeredClass.pureVirtualFunctions.push(methodName);
        }

        function unboundTypesHandler() {
          throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
        }

        var proto = classType.registeredClass.instancePrototype;
        var method = proto[methodName];

        if (undefined === method || undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
          unboundTypesHandler.argCount = argCount - 2;
          unboundTypesHandler.className = classType.name;
          proto[methodName] = unboundTypesHandler;
        } else {
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
        }

        whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
          var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);

          if (undefined === proto[methodName].overloadTable) {
            memberFunction.argCount = argCount - 2;
            proto[methodName] = memberFunction;
          } else {
            proto[methodName].overloadTable[argCount - 2] = memberFunction;
          }

          return [];
        });
        return [];
      });
    }

    function __embind_register_class_property(classType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
      fieldName = readLatin1String(fieldName);
      getter = embind__requireFunction(getterSignature, getter);
      whenDependentTypesAreResolved([], [classType], function (classType) {
        classType = classType[0];
        var humanName = classType.name + "." + fieldName;
        var desc = {
          get: function () {
            throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
          },
          enumerable: true,
          configurable: true
        };

        if (setter) {
          desc.set = function () {
            throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
          };
        } else {
          desc.set = function (v) {
            throwBindingError(humanName + " is a read-only property");
          };
        }

        Object.defineProperty(classType.registeredClass.instancePrototype, fieldName, desc);
        whenDependentTypesAreResolved([], setter ? [getterReturnType, setterArgumentType] : [getterReturnType], function (types) {
          var getterReturnType = types[0];
          var desc = {
            get: function () {
              var ptr = validateThis(this, classType, humanName + " getter");
              return getterReturnType["fromWireType"](getter(getterContext, ptr));
            },
            enumerable: true
          };

          if (setter) {
            setter = embind__requireFunction(setterSignature, setter);
            var setterArgumentType = types[1];

            desc.set = function (v) {
              var ptr = validateThis(this, classType, humanName + " setter");
              var destructors = [];
              setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, v));
              runDestructors(destructors);
            };
          }

          Object.defineProperty(classType.registeredClass.instancePrototype, fieldName, desc);
          return [];
        });
        return [];
      });
    }

    function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = undefined;
        emval_free_list.push(handle);
      }
    }

    function __embind_register_emval(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        "fromWireType": function (handle) {
          var rv = emval_handle_array[handle].value;

          __emval_decref(handle);

          return rv;
        },
        "toWireType": function (destructors, value) {
          return __emval_register(value);
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: null
      });
    }

    function enumReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return function (pointer) {
            var heap = signed ? HEAP8 : HEAPU8;
            return this["fromWireType"](heap[pointer]);
          };

        case 1:
          return function (pointer) {
            var heap = signed ? HEAP16 : HEAPU16;
            return this["fromWireType"](heap[pointer >> 1]);
          };

        case 2:
          return function (pointer) {
            var heap = signed ? HEAP32 : HEAPU32;
            return this["fromWireType"](heap[pointer >> 2]);
          };

        default:
          throw new TypeError("Unknown integer type: " + name);
      }
    }

    function __embind_register_enum(rawType, name, size, isSigned) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);

      function ctor() {}

      ctor.values = {};
      registerType(rawType, {
        name: name,
        constructor: ctor,
        "fromWireType": function (c) {
          return this.constructor.values[c];
        },
        "toWireType": function (destructors, c) {
          return c.value;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": enumReadValueFromPointer(name, shift, isSigned),
        destructorFunction: null
      });
      exposePublicSymbol(name, ctor);
    }

    function __embind_register_enum_value(rawEnumType, name, enumValue) {
      var enumType = requireRegisteredType(rawEnumType, "enum");
      name = readLatin1String(name);
      var Enum = enumType.constructor;
      var Value = Object.create(enumType.constructor.prototype, {
        value: {
          value: enumValue
        },
        constructor: {
          value: createNamedFunction(enumType.name + "_" + name, function () {})
        }
      });
      Enum.values[enumValue] = Value;
      Enum[name] = Value;
    }

    function _embind_repr(v) {
      if (v === null) {
        return "null";
      }

      var t = typeof v;

      if (t === "object" || t === "array" || t === "function") {
        return v.toString();
      } else {
        return "" + v;
      }
    }

    function floatReadValueFromPointer(name, shift) {
      switch (shift) {
        case 2:
          return function (pointer) {
            return this["fromWireType"](HEAPF32[pointer >> 2]);
          };

        case 3:
          return function (pointer) {
            return this["fromWireType"](HEAPF64[pointer >> 3]);
          };

        default:
          throw new TypeError("Unknown float type: " + name);
      }
    }

    function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        "fromWireType": function (value) {
          return value;
        },
        "toWireType": function (destructors, value) {
          if (typeof value !== "number" && typeof value !== "boolean") {
            throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
          }

          return value;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": floatReadValueFromPointer(name, shift),
        destructorFunction: null
      });
    }

    function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      name = readLatin1String(name);
      rawInvoker = embind__requireFunction(signature, rawInvoker);
      exposePublicSymbol(name, function () {
        throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes);
      }, argCount - 1);
      whenDependentTypesAreResolved([], argTypes, function (argTypes) {
        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
        replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
        return [];
      });
    }

    function integerReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return signed ? function readS8FromPointer(pointer) {
            return HEAP8[pointer];
          } : function readU8FromPointer(pointer) {
            return HEAPU8[pointer];
          };

        case 1:
          return signed ? function readS16FromPointer(pointer) {
            return HEAP16[pointer >> 1];
          } : function readU16FromPointer(pointer) {
            return HEAPU16[pointer >> 1];
          };

        case 2:
          return signed ? function readS32FromPointer(pointer) {
            return HEAP32[pointer >> 2];
          } : function readU32FromPointer(pointer) {
            return HEAPU32[pointer >> 2];
          };

        default:
          throw new TypeError("Unknown integer type: " + name);
      }
    }

    function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
      name = readLatin1String(name);

      if (maxRange === -1) {
        maxRange = 4294967295;
      }

      var shift = getShiftFromSize(size);

      var fromWireType = function (value) {
        return value;
      };

      if (minRange === 0) {
        var bitshift = 32 - 8 * size;

        fromWireType = function (value) {
          return value << bitshift >>> bitshift;
        };
      }

      var isUnsignedType = name.indexOf("unsigned") != -1;
      registerType(primitiveType, {
        name: name,
        "fromWireType": fromWireType,
        "toWireType": function (destructors, value) {
          if (typeof value !== "number" && typeof value !== "boolean") {
            throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
          }

          if (value < minRange || value > maxRange) {
            throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!");
          }

          return isUnsignedType ? value >>> 0 : value | 0;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
        destructorFunction: null
      });
    }

    function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
      var TA = typeMapping[dataTypeIndex];

      function decodeMemoryView(handle) {
        handle = handle >> 2;
        var heap = HEAPU32;
        var size = heap[handle];
        var data = heap[handle + 1];
        return new TA(buffer, data, size);
      }

      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        "fromWireType": decodeMemoryView,
        "argPackAdvance": 8,
        "readValueFromPointer": decodeMemoryView
      }, {
        ignoreDuplicateRegistrations: true
      });
    }

    function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name);
      var stdStringIsUTF8 = name === "std::string";
      registerType(rawType, {
        name: name,
        "fromWireType": function (value) {
          var length = HEAPU32[value >> 2];
          var str;

          if (stdStringIsUTF8) {
            var decodeStartPtr = value + 4;

            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = value + 4 + i;

              if (i == length || HEAPU8[currentBytePtr] == 0) {
                var maxRead = currentBytePtr - decodeStartPtr;
                var stringSegment = UTF8ToString(decodeStartPtr, maxRead);

                if (str === undefined) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }

                decodeStartPtr = currentBytePtr + 1;
              }
            }
          } else {
            var a = new Array(length);

            for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
            }

            str = a.join("");
          }

          _free(value);

          return str;
        },
        "toWireType": function (destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }

          var getLength;
          var valueIsOfTypeString = typeof value === "string";

          if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
            throwBindingError("Cannot pass non-string to std::string");
          }

          if (stdStringIsUTF8 && valueIsOfTypeString) {
            getLength = function () {
              return lengthBytesUTF8(value);
            };
          } else {
            getLength = function () {
              return value.length;
            };
          }

          var length = getLength();

          var ptr = _malloc(4 + length + 1);

          HEAPU32[ptr >> 2] = length;

          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr + 4, length + 1);
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);

                if (charCode > 255) {
                  _free(ptr);

                  throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                }

                HEAPU8[ptr + 4 + i] = charCode;
              }
            } else {
              for (var i = 0; i < length; ++i) {
                HEAPU8[ptr + 4 + i] = value[i];
              }
            }
          }

          if (destructors !== null) {
            destructors.push(_free, ptr);
          }

          return ptr;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
          _free(ptr);
        }
      });
    }

    function __embind_register_std_wstring(rawType, charSize, name) {
      name = readLatin1String(name);
      var decodeString, encodeString, getHeap, lengthBytesUTF, shift;

      if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;

        getHeap = function () {
          return HEAPU16;
        };

        shift = 1;
      } else if (charSize === 4) {
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;

        getHeap = function () {
          return HEAPU32;
        };

        shift = 2;
      }

      registerType(rawType, {
        name: name,
        "fromWireType": function (value) {
          var length = HEAPU32[value >> 2];
          var HEAP = getHeap();
          var str;
          var decodeStartPtr = value + 4;

          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = value + 4 + i * charSize;

            if (i == length || HEAP[currentBytePtr >> shift] == 0) {
              var maxReadBytes = currentBytePtr - decodeStartPtr;
              var stringSegment = decodeString(decodeStartPtr, maxReadBytes);

              if (str === undefined) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }

              decodeStartPtr = currentBytePtr + charSize;
            }
          }

          _free(value);

          return str;
        },
        "toWireType": function (destructors, value) {
          if (!(typeof value === "string")) {
            throwBindingError("Cannot pass non-string to C++ string type " + name);
          }

          var length = lengthBytesUTF(value);

          var ptr = _malloc(4 + length + charSize);

          HEAPU32[ptr >> 2] = length >> shift;
          encodeString(value, ptr + 4, length + charSize);

          if (destructors !== null) {
            destructors.push(_free, ptr);
          }

          return ptr;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
          _free(ptr);
        }
      });
    }

    function __embind_register_value_object(rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) {
      structRegistrations[rawType] = {
        name: readLatin1String(name),
        rawConstructor: embind__requireFunction(constructorSignature, rawConstructor),
        rawDestructor: embind__requireFunction(destructorSignature, rawDestructor),
        fields: []
      };
    }

    function __embind_register_value_object_field(structType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
      structRegistrations[structType].fields.push({
        fieldName: readLatin1String(fieldName),
        getterReturnType: getterReturnType,
        getter: embind__requireFunction(getterSignature, getter),
        getterContext: getterContext,
        setterArgumentType: setterArgumentType,
        setter: embind__requireFunction(setterSignature, setter),
        setterContext: setterContext
      });
    }

    function __embind_register_void(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        isVoid: true,
        name: name,
        "argPackAdvance": 0,
        "fromWireType": function () {
          return undefined;
        },
        "toWireType": function (destructors, o) {
          return undefined;
        }
      });
    }

    function __emval_as(handle, returnType, destructorsRef) {
      handle = requireHandle(handle);
      returnType = requireRegisteredType(returnType, "emval::as");
      var destructors = [];

      var rd = __emval_register(destructors);

      HEAP32[destructorsRef >> 2] = rd;
      return returnType["toWireType"](destructors, handle);
    }

    function __emval_allocateDestructors(destructorsRef) {
      var destructors = [];
      HEAP32[destructorsRef >> 2] = __emval_register(destructors);
      return destructors;
    }

    var emval_symbols = {};

    function getStringOrSymbol(address) {
      var symbol = emval_symbols[address];

      if (symbol === undefined) {
        return readLatin1String(address);
      } else {
        return symbol;
      }
    }

    var emval_methodCallers = [];

    function __emval_call_method(caller, handle, methodName, destructorsRef, args) {
      caller = emval_methodCallers[caller];
      handle = requireHandle(handle);
      methodName = getStringOrSymbol(methodName);
      return caller(handle, methodName, __emval_allocateDestructors(destructorsRef), args);
    }

    function __emval_call_void_method(caller, handle, methodName, args) {
      caller = emval_methodCallers[caller];
      handle = requireHandle(handle);
      methodName = getStringOrSymbol(methodName);
      caller(handle, methodName, null, args);
    }

    function __emval_addMethodCaller(caller) {
      var id = emval_methodCallers.length;
      emval_methodCallers.push(caller);
      return id;
    }

    function __emval_lookupTypes(argCount, argTypes) {
      var a = new Array(argCount);

      for (var i = 0; i < argCount; ++i) {
        a[i] = requireRegisteredType(HEAP32[(argTypes >> 2) + i], "parameter " + i);
      }

      return a;
    }

    function __emval_get_method_caller(argCount, argTypes) {
      var types = __emval_lookupTypes(argCount, argTypes);

      var retType = types[0];
      var signatureName = retType.name + "_$" + types.slice(1).map(function (t) {
        return t.name;
      }).join("_") + "$";
      var params = ["retType"];
      var args = [retType];
      var argsList = "";

      for (var i = 0; i < argCount - 1; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        params.push("argType" + i);
        args.push(types[1 + i]);
      }

      var functionName = makeLegalFunctionName("methodCaller_" + signatureName);
      var functionBody = "return function " + functionName + "(handle, name, destructors, args) {\n";
      var offset = 0;

      for (var i = 0; i < argCount - 1; ++i) {
        functionBody += "    var arg" + i + " = argType" + i + ".readValueFromPointer(args" + (offset ? "+" + offset : "") + ");\n";
        offset += types[i + 1]["argPackAdvance"];
      }

      functionBody += "    var rv = handle[name](" + argsList + ");\n";

      for (var i = 0; i < argCount - 1; ++i) {
        if (types[i + 1]["deleteObject"]) {
          functionBody += "    argType" + i + ".deleteObject(arg" + i + ");\n";
        }
      }

      if (!retType.isVoid) {
        functionBody += "    return retType.toWireType(destructors, rv);\n";
      }

      functionBody += "};\n";
      params.push(functionBody);
      var invokerFunction = new_(Function, params).apply(null, args);
      return __emval_addMethodCaller(invokerFunction);
    }

    function __emval_get_module_property(name) {
      name = getStringOrSymbol(name);
      return __emval_register(Module[name]);
    }

    function __emval_get_property(handle, key) {
      handle = requireHandle(handle);
      key = requireHandle(key);
      return __emval_register(handle[key]);
    }

    function __emval_incref(handle) {
      if (handle > 4) {
        emval_handle_array[handle].refcount += 1;
      }
    }

    function __emval_new_cstring(v) {
      return __emval_register(getStringOrSymbol(v));
    }

    function __emval_run_destructors(handle) {
      var destructors = emval_handle_array[handle].value;
      runDestructors(destructors);

      __emval_decref(handle);
    }

    function __emval_take_value(type, argv) {
      type = requireRegisteredType(type, "_emval_take_value");
      var v = type["readValueFromPointer"](argv);
      return __emval_register(v);
    }

    function _abort() {
      abort();
    }

    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }

    function _emscripten_get_heap_size() {
      return HEAPU8.length;
    }

    function emscripten_realloc_buffer(size) {
      try {
        wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1;
      } catch (e) {}
    }

    function _emscripten_resize_heap(requestedSize) {
      requestedSize = requestedSize >>> 0;

      var oldSize = _emscripten_get_heap_size();

      var PAGE_MULTIPLE = 65536;
      var maxHeapSize = 2147483648;

      if (requestedSize > maxHeapSize) {
        return false;
      }

      var minHeapSize = 16777216;

      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), PAGE_MULTIPLE));
        var replacement = emscripten_realloc_buffer(newSize);

        if (replacement) {
          return true;
        }
      }

      return false;
    }

    var PATH = {
      splitPath: function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
      normalizeArray: function (parts, allowAboveRoot) {
        var up = 0;

        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];

          if (last === ".") {
            parts.splice(i, 1);
          } else if (last === "..") {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }

        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift("..");
          }
        }

        return parts;
      },
      normalize: function (path) {
        var isAbsolute = path.charAt(0) === "/",
            trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(path.split("/").filter(function (p) {
          return !!p;
        }), !isAbsolute).join("/");

        if (!path && !isAbsolute) {
          path = ".";
        }

        if (path && trailingSlash) {
          path += "/";
        }

        return (isAbsolute ? "/" : "") + path;
      },
      dirname: function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];

        if (!root && !dir) {
          return ".";
        }

        if (dir) {
          dir = dir.substr(0, dir.length - 1);
        }

        return root + dir;
      },
      basename: function (path) {
        if (path === "/") return "/";
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1);
      },
      extname: function (path) {
        return PATH.splitPath(path)[3];
      },
      join: function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join("/"));
      },
      join2: function (l, r) {
        return PATH.normalize(l + "/" + r);
      }
    };
    var SYSCALLS = {
      mappings: {},
      buffers: [null, [], []],
      printChar: function (stream, curr) {
        var buffer = SYSCALLS.buffers[stream];

        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      },
      varargs: undefined,
      get: function () {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret;
      },
      getStr: function (ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
      get64: function (low, high) {
        return low;
      }
    };

    function _fd_close(fd) {
      return 0;
    }

    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {}

    function _fd_write(fd, iov, iovcnt, pnum) {
      var num = 0;

      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[iov + i * 8 >> 2];
        var len = HEAP32[iov + (i * 8 + 4) >> 2];

        for (var j = 0; j < len; j++) {
          SYSCALLS.printChar(fd, HEAPU8[ptr + j]);
        }

        num += len;
      }

      HEAP32[pnum >> 2] = num;
      return 0;
    }

    function _setTempRet0($i) {
      setTempRet0($i | 0);
    }

    init_emval();
    PureVirtualError = Module["PureVirtualError"] = extendError(Error, "PureVirtualError");
    embind_init_charCodes();
    init_embind();
    BindingError = Module["BindingError"] = extendError(Error, "BindingError");
    InternalError = Module["InternalError"] = extendError(Error, "InternalError");
    init_ClassHandle();
    init_RegisteredPointer();
    UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
    var ASSERTIONS = false;

    function intArrayToString(array) {
      var ret = [];

      for (var i = 0; i < array.length; i++) {
        var chr = array[i];

        if (chr > 255) {
          if (ASSERTIONS) {
            assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.");
          }

          chr &= 255;
        }

        ret.push(String.fromCharCode(chr));
      }

      return ret.join("");
    }

    var decodeBase64 = typeof atob === "function" ? atob : function (input) {
      var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
          output = output + String.fromCharCode(chr2);
        }

        if (enc4 !== 64) {
          output = output + String.fromCharCode(chr3);
        }
      } while (i < input.length);

      return output;
    };

    function intArrayFromBase64(s) {
      if (typeof ENVIRONMENT_IS_NODE === "boolean" && ENVIRONMENT_IS_NODE) {
        var buf;

        try {
          buf = Buffer.from(s, "base64");
        } catch (_) {
          buf = new Buffer(s, "base64");
        }

        return new Uint8Array(buf["buffer"], buf["byteOffset"], buf["byteLength"]);
      }

      try {
        var decoded = decodeBase64(s);
        var bytes = new Uint8Array(decoded.length);

        for (var i = 0; i < decoded.length; ++i) {
          bytes[i] = decoded.charCodeAt(i);
        }

        return bytes;
      } catch (_) {
        throw new Error("Converting base64 string to bytes failed.");
      }
    }

    function tryParseAsDataURI(filename) {
      if (!isDataURI(filename)) {
        return;
      }

      return intArrayFromBase64(filename.slice(dataURIPrefix.length));
    }

    var asmLibraryArg = {
      "n": __embind_create_inheriting_constructor,
      "I": __embind_finalize_value_object,
      "B": __embind_register_bool,
      "c": __embind_register_class,
      "i": __embind_register_class_class_function,
      "f": __embind_register_class_class_property,
      "r": __embind_register_class_constructor,
      "a": __embind_register_class_function,
      "b": __embind_register_class_property,
      "A": __embind_register_emval,
      "k": __embind_register_enum,
      "j": __embind_register_enum_value,
      "p": __embind_register_float,
      "L": __embind_register_function,
      "h": __embind_register_integer,
      "g": __embind_register_memory_view,
      "q": __embind_register_std_string,
      "m": __embind_register_std_wstring,
      "K": __embind_register_value_object,
      "J": __embind_register_value_object_field,
      "C": __embind_register_void,
      "l": __emval_as,
      "H": __emval_call_method,
      "e": __emval_call_void_method,
      "E": __emval_decref,
      "d": __emval_get_method_caller,
      "M": __emval_get_module_property,
      "u": __emval_get_property,
      "D": __emval_incref,
      "F": __emval_new_cstring,
      "G": __emval_run_destructors,
      "t": __emval_take_value,
      "s": _abort,
      "x": _emscripten_memcpy_big,
      "y": _emscripten_resize_heap,
      "z": _fd_close,
      "v": _fd_seek,
      "o": _fd_write,
      "memory": wasmMemory,
      "w": _setTempRet0,
      "table": wasmTable
    };
    var asm = createWasm();

    var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function () {
      return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["N"]).apply(null, arguments);
    };

    var _malloc = Module["_malloc"] = function () {
      return (_malloc = Module["_malloc"] = Module["asm"]["O"]).apply(null, arguments);
    };

    var ___getTypeName = Module["___getTypeName"] = function () {
      return (___getTypeName = Module["___getTypeName"] = Module["asm"]["P"]).apply(null, arguments);
    };

    var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function () {
      return (___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = Module["asm"]["Q"]).apply(null, arguments);
    };

    var _free = Module["_free"] = function () {
      return (_free = Module["_free"] = Module["asm"]["R"]).apply(null, arguments);
    };

    var dynCall_ii = Module["dynCall_ii"] = function () {
      return (dynCall_ii = Module["dynCall_ii"] = Module["asm"]["S"]).apply(null, arguments);
    };

    var dynCall_vi = Module["dynCall_vi"] = function () {
      return (dynCall_vi = Module["dynCall_vi"] = Module["asm"]["T"]).apply(null, arguments);
    };

    var dynCall_iii = Module["dynCall_iii"] = function () {
      return (dynCall_iii = Module["dynCall_iii"] = Module["asm"]["U"]).apply(null, arguments);
    };

    var dynCall_iiii = Module["dynCall_iiii"] = function () {
      return (dynCall_iiii = Module["dynCall_iiii"] = Module["asm"]["V"]).apply(null, arguments);
    };

    var dynCall_v = Module["dynCall_v"] = function () {
      return (dynCall_v = Module["dynCall_v"] = Module["asm"]["W"]).apply(null, arguments);
    };

    var dynCall_viiif = Module["dynCall_viiif"] = function () {
      return (dynCall_viiif = Module["dynCall_viiif"] = Module["asm"]["X"]).apply(null, arguments);
    };

    var dynCall_viiifif = Module["dynCall_viiifif"] = function () {
      return (dynCall_viiifif = Module["dynCall_viiifif"] = Module["asm"]["Y"]).apply(null, arguments);
    };

    var dynCall_vii = Module["dynCall_vii"] = function () {
      return (dynCall_vii = Module["dynCall_vii"] = Module["asm"]["Z"]).apply(null, arguments);
    };

    var dynCall_fi = Module["dynCall_fi"] = function () {
      return (dynCall_fi = Module["dynCall_fi"] = Module["asm"]["_"]).apply(null, arguments);
    };

    var dynCall_viii = Module["dynCall_viii"] = function () {
      return (dynCall_viii = Module["dynCall_viii"] = Module["asm"]["$"]).apply(null, arguments);
    };

    var dynCall_viff = Module["dynCall_viff"] = function () {
      return (dynCall_viff = Module["dynCall_viff"] = Module["asm"]["aa"]).apply(null, arguments);
    };

    var dynCall_viffffff = Module["dynCall_viffffff"] = function () {
      return (dynCall_viffffff = Module["dynCall_viffffff"] = Module["asm"]["ba"]).apply(null, arguments);
    };

    var dynCall_viiiii = Module["dynCall_viiiii"] = function () {
      return (dynCall_viiiii = Module["dynCall_viiiii"] = Module["asm"]["ca"]).apply(null, arguments);
    };

    var dynCall_fii = Module["dynCall_fii"] = function () {
      return (dynCall_fii = Module["dynCall_fii"] = Module["asm"]["da"]).apply(null, arguments);
    };

    var dynCall_iid = Module["dynCall_iid"] = function () {
      return (dynCall_iid = Module["dynCall_iid"] = Module["asm"]["ea"]).apply(null, arguments);
    };

    var dynCall_vif = Module["dynCall_vif"] = function () {
      return (dynCall_vif = Module["dynCall_vif"] = Module["asm"]["fa"]).apply(null, arguments);
    };

    var dynCall_viif = Module["dynCall_viif"] = function () {
      return (dynCall_viif = Module["dynCall_viif"] = Module["asm"]["ga"]).apply(null, arguments);
    };

    var dynCall_viiff = Module["dynCall_viiff"] = function () {
      return (dynCall_viiff = Module["dynCall_viiff"] = Module["asm"]["ha"]).apply(null, arguments);
    };

    var dynCall_iif = Module["dynCall_iif"] = function () {
      return (dynCall_iif = Module["dynCall_iif"] = Module["asm"]["ia"]).apply(null, arguments);
    };

    var dynCall_viiii = Module["dynCall_viiii"] = function () {
      return (dynCall_viiii = Module["dynCall_viiii"] = Module["asm"]["ja"]).apply(null, arguments);
    };

    var dynCall_viiiiii = Module["dynCall_viiiiii"] = function () {
      return (dynCall_viiiiii = Module["dynCall_viiiiii"] = Module["asm"]["ka"]).apply(null, arguments);
    };

    var dynCall_viiffffff = Module["dynCall_viiffffff"] = function () {
      return (dynCall_viiffffff = Module["dynCall_viiffffff"] = Module["asm"]["la"]).apply(null, arguments);
    };

    var dynCall_viiffff = Module["dynCall_viiffff"] = function () {
      return (dynCall_viiffff = Module["dynCall_viiffff"] = Module["asm"]["ma"]).apply(null, arguments);
    };

    var dynCall_iiid = Module["dynCall_iiid"] = function () {
      return (dynCall_iiid = Module["dynCall_iiid"] = Module["asm"]["na"]).apply(null, arguments);
    };

    var dynCall_viiiff = Module["dynCall_viiiff"] = function () {
      return (dynCall_viiiff = Module["dynCall_viiiff"] = Module["asm"]["oa"]).apply(null, arguments);
    };

    var dynCall_iiif = Module["dynCall_iiif"] = function () {
      return (dynCall_iiif = Module["dynCall_iiif"] = Module["asm"]["pa"]).apply(null, arguments);
    };

    var dynCall_i = Module["dynCall_i"] = function () {
      return (dynCall_i = Module["dynCall_i"] = Module["asm"]["qa"]).apply(null, arguments);
    };

    var dynCall_viffff = Module["dynCall_viffff"] = function () {
      return (dynCall_viffff = Module["dynCall_viffff"] = Module["asm"]["ra"]).apply(null, arguments);
    };

    var dynCall_jiji = Module["dynCall_jiji"] = function () {
      return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["sa"]).apply(null, arguments);
    };

    var dynCall_iidiiii = Module["dynCall_iidiiii"] = function () {
      return (dynCall_iidiiii = Module["dynCall_iidiiii"] = Module["asm"]["ta"]).apply(null, arguments);
    };

    var calledRun;

    function ExitStatus(status) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + status + ")";
      this.status = status;
    }

    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };

    function run(args) {
      args = args || arguments_;

      if (runDependencies > 0) {
        return;
      }

      preRun();
      if (runDependencies > 0) return;

      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        preMain();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }

      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }

    Module["run"] = run;

    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];

      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }

    noExitRuntime = true;
    run();

    function makeMatrix(m2d) {
      const m = new DOMMatrix();
      m.a = m2d.xx;
      m.b = m2d.xy;
      m.c = m2d.yx;
      m.d = m2d.yy;
      m.e = m2d.tx;
      m.f = m2d.ty;
      return m;
    }

    Module.onRuntimeInitialized = function () {
      const {
        RenderPaintStyle,
        FillRule,
        RenderPath,
        RenderPaint,
        Renderer,
        StrokeCap,
        StrokeJoin,
        BlendMode
      } = Module;
      const {
        fill,
        stroke
      } = RenderPaintStyle;
      const {
        evenOdd,
        nonZero
      } = FillRule;
      var CanvasRenderPath = RenderPath.extend("CanvasRenderPath", {
        __construct: function () {
          this.__parent.__construct.call(this);

          this._path2D = new Path2D();
        },
        reset: function () {
          this._path2D = new Path2D();
        },
        addPath: function (path, m2d) {
          this._path2D.addPath(path._path2D, makeMatrix(m2d));
        },
        fillRule: function (fillRule) {
          this._fillRule = fillRule;
        },
        moveTo: function (x, y) {
          this._path2D.moveTo(x, y);
        },
        lineTo: function (x, y) {
          this._path2D.lineTo(x, y);
        },
        cubicTo: function (ox, oy, ix, iy, x, y) {
          this._path2D.bezierCurveTo(ox, oy, ix, iy, x, y);
        },
        close: function () {
          this._path2D.closePath();
        }
      });

      function _colorStyle(value) {
        return 'rgba(' + ((0x00ff0000 & value) >>> 16) + ',' + ((0x0000ff00 & value) >>> 8) + ',' + ((0x000000ff & value) >>> 0) + ',' + ((0xff000000 & value) >>> 24) / 0xFF + ')';
      }

      var CanvasRenderPaint = RenderPaint.extend("CanvasRenderPaint", {
        color: function (value) {
          this._value = _colorStyle(value);
        },
        thickness: function (value) {
          this._thickness = value;
        },
        join: function (value) {
          switch (value) {
            case StrokeJoin.miter:
              this._join = 'miter';
              break;

            case StrokeJoin.round:
              this._join = 'round';
              break;

            case StrokeJoin.bevel:
              this._join = 'bevel';
              break;
          }
        },
        cap: function (value) {
          switch (value) {
            case StrokeCap.butt:
              this._cap = 'butt';
              break;

            case StrokeCap.round:
              this._cap = 'round';
              break;

            case StrokeCap.square:
              this._cap = 'square';
              break;
          }
        },
        style: function (value) {
          this._style = value;
        },
        blendMode: function (value) {
          switch (value) {
            case BlendMode.srcOver:
              this._blend = 'source-over';
              break;

            case BlendMode.screen:
              this._blend = 'screen';
              break;

            case BlendMode.overlay:
              this._blend = 'overlay';
              break;

            case BlendMode.darken:
              this._blend = 'darken';
              break;

            case BlendMode.lighten:
              this._blend = 'lighten';
              break;

            case BlendMode.colorDodge:
              this._blend = 'color-dodge';
              break;

            case BlendMode.colorBurn:
              this._blend = 'color-burn';
              break;

            case BlendMode.hardLight:
              this._blend = 'hard-light';
              break;

            case BlendMode.softLight:
              this._blend = 'soft-light';
              break;

            case BlendMode.difference:
              this._blend = 'difference';
              break;

            case BlendMode.exclusion:
              this._blend = 'exclusion';
              break;

            case BlendMode.multiply:
              this._blend = 'multiply';
              break;

            case BlendMode.hue:
              this._blend = 'hue';
              break;

            case BlendMode.saturation:
              this._blend = 'saturation';
              break;

            case BlendMode.color:
              this._blend = 'color';
              break;

            case BlendMode.luminosity:
              this._blend = 'luminosity';
              break;
          }
        },
        linearGradient: function (sx, sy, ex, ey) {
          this._gradient = {
            sx,
            sy,
            ex,
            ey,
            stops: []
          };
        },
        radialGradient: function (sx, sy, ex, ey) {
          this._gradient = {
            sx,
            sy,
            ex,
            ey,
            stops: [],
            isRadial: true
          };
        },
        addStop: function (color, stop) {
          this._gradient.stops.push({
            color,
            stop
          });
        },
        completeGradient: function () {},
        draw: function (ctx, path) {
          let {
            _style,
            _value,
            _gradient,
            _blend
          } = this;
          ctx.globalCompositeOperation = _blend;

          if (_gradient != null) {
            const {
              sx,
              sy,
              ex,
              ey,
              stops,
              isRadial
            } = _gradient;

            if (isRadial) {
              var dx = ex - sx;
              var dy = ey - sy;
              var radius = Math.sqrt(dx * dx + dy * dy);
              _value = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
            } else {
              _value = ctx.createLinearGradient(sx, sy, ex, ey);
            }

            for (const {
              stop,
              color
            } of stops) {
              _value.addColorStop(stop, _colorStyle(color));
            }

            this._value = _value;
            this._gradient = null;
          }

          switch (_style) {
            case stroke:
              ctx.strokeStyle = _value;
              ctx.lineWidth = this._thickness;
              ctx.lineCap = this._cap;
              ctx.lineJoin = this._join;
              ctx.stroke(path._path2D);
              break;

            case fill:
              ctx.fillStyle = _value;
              ctx.fill(path._path2D, path._fillRule === evenOdd ? 'evenodd' : 'nonzero');
              break;
          }
        }
      });
      Module.CanvasRenderer = Renderer.extend("Renderer", {
        __construct: function (ctx) {
          this.__parent.__construct.call(this);

          this._ctx = ctx;
        },
        save: function () {
          this._ctx.save();
        },
        restore: function () {
          this._ctx.restore();
        },
        transform: function (matrix) {
          this._ctx.transform(matrix.xx, matrix.xy, matrix.yx, matrix.yy, matrix.tx, matrix.ty);
        },
        drawPath: function (path, paint) {
          paint.draw(this._ctx, path);
        },
        clipPath: function (path) {
          this._ctx.clip(path._path2D, path._fillRule === evenOdd ? 'evenodd' : 'nonzero');
        }
      });
      Module.renderFactory = {
        makeRenderPaint: function () {
          return new CanvasRenderPaint();
        },
        makeRenderPath: function () {
          return new CanvasRenderPath();
        }
      };
    };

    return Rive.ready;
  };
}();

var _default = Rive;
exports.default = _default;
},{"path":"node_modules/path-browserify/index.js","fs":"node_modules/parcel-bundler/src/builtins/_empty.js","process":"node_modules/process/browser.js","buffer":"node_modules/buffer/index.js"}],"node_modules/twgl.js/dist/4.x/twgl-full.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addExtensionsToContext = addExtensionsToContext;
exports.bindFramebufferInfo = bindFramebufferInfo;
exports.bindTransformFeedbackInfo = bindTransformFeedbackInfo;
exports.bindUniformBlock = bindUniformBlock;
exports.canFilter = canFilter;
exports.canGenerateMipmap = canGenerateMipmap;
exports.createAttribsFromArrays = createAttribsFromArrays;
exports.createAttributeSetters = createAttributeSetters;
exports.createBufferFromArray = createBufferFromArray;
exports.createBufferFromTypedArray = createBufferFromTypedArray;
exports.createBufferInfoFromArrays = createBufferInfoFromArrays;
exports.createBuffersFromArrays = createBuffersFromArrays;
exports.createFramebufferInfo = createFramebufferInfo;
exports.createProgram = createProgram;
exports.createProgramFromScripts = createProgramFromScripts;
exports.createProgramFromSources = createProgramFromSources;
exports.createProgramInfo = createProgramInfo;
exports.createProgramInfoFromProgram = createProgramInfoFromProgram;
exports.createSampler = createSampler;
exports.createSamplers = createSamplers;
exports.createTexture = createTexture;
exports.createTextures = createTextures;
exports.createTransformFeedback = createTransformFeedback;
exports.createTransformFeedbackInfo = createTransformFeedbackInfo;
exports.createUniformBlockInfo = createUniformBlockInfo;
exports.createUniformBlockInfoFromProgram = createUniformBlockInfoFromProgram;
exports.createUniformBlockSpecFromProgram = createUniformBlockSpecFromProgram;
exports.createUniformSetters = createUniformSetters;
exports.createVAOAndSetAttributes = createVAOAndSetAttributes;
exports.createVAOFromBufferInfo = createVAOFromBufferInfo;
exports.createVertexArrayInfo = createVertexArrayInfo;
exports.drawBufferInfo = drawBufferInfo;
exports.drawObjectList = drawObjectList;
exports.getArray_ = getArray;
exports.getBytesPerElementForInternalFormat = getBytesPerElementForInternalFormat;
exports.getContext = getContext;
exports.getFormatAndTypeForInternalFormat = getFormatAndTypeForInternalFormat;
exports.getGLTypeForTypedArray = getGLTypeForTypedArray;
exports.getGLTypeForTypedArrayType = getGLTypeForTypedArrayType;
exports.getNumComponentsForFormat = getNumComponentsForFormat;
exports.getNumComponents_ = getNumComponents;
exports.getTypedArrayTypeForGLType = getTypedArrayTypeForGLType;
exports.getWebGLContext = getWebGLContext;
exports.isWebGL1 = isWebGL1;
exports.isWebGL2 = isWebGL2;
exports.loadTextureFromUrl = loadTextureFromUrl;
exports.resizeCanvasToDisplaySize = resizeCanvasToDisplaySize;
exports.resizeFramebufferInfo = resizeFramebufferInfo;
exports.resizeTexture = resizeTexture;
exports.setAttribInfoBufferFromArray = setAttribInfoBufferFromArray;
exports.setAttributeDefaults_ = setDefaults;
exports.setAttributePrefix = setAttributePrefix;
exports.setAttributes = setAttributes;
exports.setBlockUniforms = setBlockUniforms;
exports.setBuffersAndAttributes = setBuffersAndAttributes;
exports.setDefaultTextureColor = setDefaultTextureColor;
exports.setDefaults = setDefaults$2;
exports.setEmptyTexture = setEmptyTexture;
exports.setSamplerParameters = setSamplerParameters;
exports.setTextureDefaults_ = setDefaults$1;
exports.setTextureFilteringForSize = setTextureFilteringForSize;
exports.setTextureFromArray = setTextureFromArray;
exports.setTextureFromElement = setTextureFromElement;
exports.setTextureParameters = setTextureParameters;
exports.setUniformBlock = setUniformBlock;
exports.setUniforms = setUniforms;
exports.vertexArrays = exports.v3 = exports.utils = exports.typedarrays = exports.textures = exports.setUniformsAndBindTextures = exports.programs = exports.primitives = exports.m4 = exports.isArrayBuffer = exports.glEnumToString = exports.framebuffers = exports.draw = exports.attributes = void 0;

/* @license twgl.js 4.19.1 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */

/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 *
 * Vec3 math math functions.
 *
 * Almost all functions take an optional `dst` argument. If it is not passed in the
 * functions will create a new Vec3. In other words you can do this
 *
 *     var v = v3.cross(v1, v2);  // Creates a new Vec3 with the cross product of v1 x v2.
 *
 * or
 *
 *     var v = v3.create();
 *     v3.cross(v1, v2, v);  // Puts the cross product of v1 x v2 in v
 *
 * The first style is often easier but depending on where it's used it generates garbage where
 * as there is almost never allocation with the second style.
 *
 * It is always save to pass any vector as the destination. So for example
 *
 *     v3.cross(v1, v2, v1);  // Puts the cross product of v1 x v2 in v1
 *
 * @module twgl/v3
 */
let VecType = Float32Array;
/**
 * A JavaScript array with 3 values or a Float32Array with 3 values.
 * When created by the library will create the default type which is `Float32Array`
 * but can be set by calling {@link module:twgl/v3.setDefaultType}.
 * @typedef {(number[]|Float32Array)} Vec3
 * @memberOf module:twgl/v3
 */

/**
 * Sets the type this library creates for a Vec3
 * @param {constructor} ctor the constructor for the type. Either `Float32Array` or `Array`
 * @return {constructor} previous constructor for Vec3
 * @memberOf module:twgl/v3
 */

function setDefaultType(ctor) {
  const oldType = VecType;
  VecType = ctor;
  return oldType;
}
/**
 * Creates a vec3; may be called with x, y, z to set initial values.
 * @param {number} [x] Initial x value.
 * @param {number} [y] Initial y value.
 * @param {number} [z] Initial z value.
 * @return {module:twgl/v3.Vec3} the created vector
 * @memberOf module:twgl/v3
 */


function create(x, y, z) {
  const dst = new VecType(3);

  if (x) {
    dst[0] = x;
  }

  if (y) {
    dst[1] = y;
  }

  if (z) {
    dst[2] = z;
  }

  return dst;
}
/**
 * Adds two vectors; assumes a and b have the same dimension.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} A vector tha tis the sum of a and b.
 * @memberOf module:twgl/v3
 */


function add(a, b, dst) {
  dst = dst || new VecType(3);
  dst[0] = a[0] + b[0];
  dst[1] = a[1] + b[1];
  dst[2] = a[2] + b[2];
  return dst;
}
/**
 * Subtracts two vectors.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} A vector that is the difference of a and b.
 * @memberOf module:twgl/v3
 */


function subtract(a, b, dst) {
  dst = dst || new VecType(3);
  dst[0] = a[0] - b[0];
  dst[1] = a[1] - b[1];
  dst[2] = a[2] - b[2];
  return dst;
}
/**
 * Performs linear interpolation on two vectors.
 * Given vectors a and b and interpolation coefficient t, returns
 * a + t * (b - a).
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {number} t Interpolation coefficient.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} The linear interpolated result.
 * @memberOf module:twgl/v3
 */


function lerp(a, b, t, dst) {
  dst = dst || new VecType(3);
  dst[0] = a[0] + t * (b[0] - a[0]);
  dst[1] = a[1] + t * (b[1] - a[1]);
  dst[2] = a[2] + t * (b[2] - a[2]);
  return dst;
}
/**
 * Performs linear interpolation on two vectors.
 * Given vectors a and b and interpolation coefficient vector t, returns
 * a + t * (b - a).
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} t Interpolation coefficients vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} the linear interpolated result.
 * @memberOf module:twgl/v3
 */


function lerpV(a, b, t, dst) {
  dst = dst || new VecType(3);
  dst[0] = a[0] + t[0] * (b[0] - a[0]);
  dst[1] = a[1] + t[1] * (b[1] - a[1]);
  dst[2] = a[2] + t[2] * (b[2] - a[2]);
  return dst;
}
/**
 * Return max values of two vectors.
 * Given vectors a and b returns
 * [max(a[0], b[0]), max(a[1], b[1]), max(a[2], b[2])].
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} The max components vector.
 * @memberOf module:twgl/v3
 */


function max(a, b, dst) {
  dst = dst || new VecType(3);
  dst[0] = Math.max(a[0], b[0]);
  dst[1] = Math.max(a[1], b[1]);
  dst[2] = Math.max(a[2], b[2]);
  return dst;
}
/**
 * Return min values of two vectors.
 * Given vectors a and b returns
 * [min(a[0], b[0]), min(a[1], b[1]), min(a[2], b[2])].
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} The min components vector.
 * @memberOf module:twgl/v3
 */


function min(a, b, dst) {
  dst = dst || new VecType(3);
  dst[0] = Math.min(a[0], b[0]);
  dst[1] = Math.min(a[1], b[1]);
  dst[2] = Math.min(a[2], b[2]);
  return dst;
}
/**
 * Multiplies a vector by a scalar.
 * @param {module:twgl/v3.Vec3} v The vector.
 * @param {number} k The scalar.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} The scaled vector.
 * @memberOf module:twgl/v3
 */


function mulScalar(v, k, dst) {
  dst = dst || new VecType(3);
  dst[0] = v[0] * k;
  dst[1] = v[1] * k;
  dst[2] = v[2] * k;
  return dst;
}
/**
 * Divides a vector by a scalar.
 * @param {module:twgl/v3.Vec3} v The vector.
 * @param {number} k The scalar.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} The scaled vector.
 * @memberOf module:twgl/v3
 */


function divScalar(v, k, dst) {
  dst = dst || new VecType(3);
  dst[0] = v[0] / k;
  dst[1] = v[1] / k;
  dst[2] = v[2] / k;
  return dst;
}
/**
 * Computes the cross product of two vectors; assumes both vectors have
 * three entries.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} The vector of a cross b.
 * @memberOf module:twgl/v3
 */


function cross(a, b, dst) {
  dst = dst || new VecType(3);
  const t1 = a[2] * b[0] - a[0] * b[2];
  const t2 = a[0] * b[1] - a[1] * b[0];
  dst[0] = a[1] * b[2] - a[2] * b[1];
  dst[1] = t1;
  dst[2] = t2;
  return dst;
}
/**
 * Computes the dot product of two vectors; assumes both vectors have
 * three entries.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @return {number} dot product
 * @memberOf module:twgl/v3
 */


function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the length of vector
 * @param {module:twgl/v3.Vec3} v vector.
 * @return {number} length of vector.
 * @memberOf module:twgl/v3
 */


function length$1(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}
/**
 * Computes the square of the length of vector
 * @param {module:twgl/v3.Vec3} v vector.
 * @return {number} square of the length of vector.
 * @memberOf module:twgl/v3
 */


function lengthSq(v) {
  return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
}
/**
 * Computes the distance between 2 points
 * @param {module:twgl/v3.Vec3} a vector.
 * @param {module:twgl/v3.Vec3} b vector.
 * @return {number} distance between a and b
 * @memberOf module:twgl/v3
 */


function distance(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
/**
 * Computes the square of the distance between 2 points
 * @param {module:twgl/v3.Vec3} a vector.
 * @param {module:twgl/v3.Vec3} b vector.
 * @return {number} square of the distance between a and b
 * @memberOf module:twgl/v3
 */


function distanceSq(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}
/**
 * Divides a vector by its Euclidean length and returns the quotient.
 * @param {module:twgl/v3.Vec3} a The vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} The normalized vector.
 * @memberOf module:twgl/v3
 */


function normalize(a, dst) {
  dst = dst || new VecType(3);
  const lenSq = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
  const len = Math.sqrt(lenSq);

  if (len > 0.00001) {
    dst[0] = a[0] / len;
    dst[1] = a[1] / len;
    dst[2] = a[2] / len;
  } else {
    dst[0] = 0;
    dst[1] = 0;
    dst[2] = 0;
  }

  return dst;
}
/**
 * Negates a vector.
 * @param {module:twgl/v3.Vec3} v The vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} -v.
 * @memberOf module:twgl/v3
 */


function negate(v, dst) {
  dst = dst || new VecType(3);
  dst[0] = -v[0];
  dst[1] = -v[1];
  dst[2] = -v[2];
  return dst;
}
/**
 * Copies a vector.
 * @param {module:twgl/v3.Vec3} v The vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} A copy of v.
 * @memberOf module:twgl/v3
 */


function copy(v, dst) {
  dst = dst || new VecType(3);
  dst[0] = v[0];
  dst[1] = v[1];
  dst[2] = v[2];
  return dst;
}
/**
 * Multiplies a vector by another vector (component-wise); assumes a and
 * b have the same length.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} The vector of products of entries of a and
 *     b.
 * @memberOf module:twgl/v3
 */


function multiply(a, b, dst) {
  dst = dst || new VecType(3);
  dst[0] = a[0] * b[0];
  dst[1] = a[1] * b[1];
  dst[2] = a[2] * b[2];
  return dst;
}
/**
 * Divides a vector by another vector (component-wise); assumes a and
 * b have the same length.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created.
 * @return {module:twgl/v3.Vec3} The vector of quotients of entries of a and
 *     b.
 * @memberOf module:twgl/v3
 */


function divide(a, b, dst) {
  dst = dst || new VecType(3);
  dst[0] = a[0] / b[0];
  dst[1] = a[1] / b[1];
  dst[2] = a[2] / b[2];
  return dst;
}

var v3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  add: add,
  copy: copy,
  create: create,
  cross: cross,
  distance: distance,
  distanceSq: distanceSq,
  divide: divide,
  divScalar: divScalar,
  dot: dot,
  lerp: lerp,
  lerpV: lerpV,
  length: length$1,
  lengthSq: lengthSq,
  max: max,
  min: min,
  mulScalar: mulScalar,
  multiply: multiply,
  negate: negate,
  normalize: normalize,
  setDefaultType: setDefaultType,
  subtract: subtract
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * 4x4 Matrix math math functions.
 *
 * Almost all functions take an optional `dst` argument. If it is not passed in the
 * functions will create a new matrix. In other words you can do this
 *
 *     const mat = m4.translation([1, 2, 3]);  // Creates a new translation matrix
 *
 * or
 *
 *     const mat = m4.create();
 *     m4.translation([1, 2, 3], mat);  // Puts translation matrix in mat.
 *
 * The first style is often easier but depending on where it's used it generates garbage where
 * as there is almost never allocation with the second style.
 *
 * It is always save to pass any matrix as the destination. So for example
 *
 *     const mat = m4.identity();
 *     const trans = m4.translation([1, 2, 3]);
 *     m4.multiply(mat, trans, mat);  // Multiplies mat * trans and puts result in mat.
 *
 * @module twgl/m4
 */

exports.v3 = v3;
let MatType = Float32Array;
/**
 * A JavaScript array with 16 values or a Float32Array with 16 values.
 * When created by the library will create the default type which is `Float32Array`
 * but can be set by calling {@link module:twgl/m4.setDefaultType}.
 * @typedef {(number[]|Float32Array)} Mat4
 * @memberOf module:twgl/m4
 */

/**
 * Sets the type this library creates for a Mat4
 * @param {constructor} ctor the constructor for the type. Either `Float32Array` or `Array`
 * @return {constructor} previous constructor for Mat4
 * @memberOf module:twgl/m4
 */

function setDefaultType$1(ctor) {
  const oldType = MatType;
  MatType = ctor;
  return oldType;
}
/**
 * Negates a matrix.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} -m.
 * @memberOf module:twgl/m4
 */


function negate$1(m, dst) {
  dst = dst || new MatType(16);
  dst[0] = -m[0];
  dst[1] = -m[1];
  dst[2] = -m[2];
  dst[3] = -m[3];
  dst[4] = -m[4];
  dst[5] = -m[5];
  dst[6] = -m[6];
  dst[7] = -m[7];
  dst[8] = -m[8];
  dst[9] = -m[9];
  dst[10] = -m[10];
  dst[11] = -m[11];
  dst[12] = -m[12];
  dst[13] = -m[13];
  dst[14] = -m[14];
  dst[15] = -m[15];
  return dst;
}
/**
 * Copies a matrix.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/m4.Mat4} [dst] The matrix. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} A copy of m.
 * @memberOf module:twgl/m4
 */


function copy$1(m, dst) {
  dst = dst || new MatType(16);
  dst[0] = m[0];
  dst[1] = m[1];
  dst[2] = m[2];
  dst[3] = m[3];
  dst[4] = m[4];
  dst[5] = m[5];
  dst[6] = m[6];
  dst[7] = m[7];
  dst[8] = m[8];
  dst[9] = m[9];
  dst[10] = m[10];
  dst[11] = m[11];
  dst[12] = m[12];
  dst[13] = m[13];
  dst[14] = m[14];
  dst[15] = m[15];
  return dst;
}
/**
 * Creates an n-by-n identity matrix.
 *
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} An n-by-n identity matrix.
 * @memberOf module:twgl/m4
 */


function identity(dst) {
  dst = dst || new MatType(16);
  dst[0] = 1;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 1;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = 1;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Takes the transpose of a matrix.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The transpose of m.
 * @memberOf module:twgl/m4
 */


function transpose(m, dst) {
  dst = dst || new MatType(16);

  if (dst === m) {
    let t;
    t = m[1];
    m[1] = m[4];
    m[4] = t;
    t = m[2];
    m[2] = m[8];
    m[8] = t;
    t = m[3];
    m[3] = m[12];
    m[12] = t;
    t = m[6];
    m[6] = m[9];
    m[9] = t;
    t = m[7];
    m[7] = m[13];
    m[13] = t;
    t = m[11];
    m[11] = m[14];
    m[14] = t;
    return dst;
  }

  const m00 = m[0 * 4 + 0];
  const m01 = m[0 * 4 + 1];
  const m02 = m[0 * 4 + 2];
  const m03 = m[0 * 4 + 3];
  const m10 = m[1 * 4 + 0];
  const m11 = m[1 * 4 + 1];
  const m12 = m[1 * 4 + 2];
  const m13 = m[1 * 4 + 3];
  const m20 = m[2 * 4 + 0];
  const m21 = m[2 * 4 + 1];
  const m22 = m[2 * 4 + 2];
  const m23 = m[2 * 4 + 3];
  const m30 = m[3 * 4 + 0];
  const m31 = m[3 * 4 + 1];
  const m32 = m[3 * 4 + 2];
  const m33 = m[3 * 4 + 3];
  dst[0] = m00;
  dst[1] = m10;
  dst[2] = m20;
  dst[3] = m30;
  dst[4] = m01;
  dst[5] = m11;
  dst[6] = m21;
  dst[7] = m31;
  dst[8] = m02;
  dst[9] = m12;
  dst[10] = m22;
  dst[11] = m32;
  dst[12] = m03;
  dst[13] = m13;
  dst[14] = m23;
  dst[15] = m33;
  return dst;
}
/**
 * Computes the inverse of a 4-by-4 matrix.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The inverse of m.
 * @memberOf module:twgl/m4
 */


function inverse(m, dst) {
  dst = dst || new MatType(16);
  const m00 = m[0 * 4 + 0];
  const m01 = m[0 * 4 + 1];
  const m02 = m[0 * 4 + 2];
  const m03 = m[0 * 4 + 3];
  const m10 = m[1 * 4 + 0];
  const m11 = m[1 * 4 + 1];
  const m12 = m[1 * 4 + 2];
  const m13 = m[1 * 4 + 3];
  const m20 = m[2 * 4 + 0];
  const m21 = m[2 * 4 + 1];
  const m22 = m[2 * 4 + 2];
  const m23 = m[2 * 4 + 3];
  const m30 = m[3 * 4 + 0];
  const m31 = m[3 * 4 + 1];
  const m32 = m[3 * 4 + 2];
  const m33 = m[3 * 4 + 3];
  const tmp_0 = m22 * m33;
  const tmp_1 = m32 * m23;
  const tmp_2 = m12 * m33;
  const tmp_3 = m32 * m13;
  const tmp_4 = m12 * m23;
  const tmp_5 = m22 * m13;
  const tmp_6 = m02 * m33;
  const tmp_7 = m32 * m03;
  const tmp_8 = m02 * m23;
  const tmp_9 = m22 * m03;
  const tmp_10 = m02 * m13;
  const tmp_11 = m12 * m03;
  const tmp_12 = m20 * m31;
  const tmp_13 = m30 * m21;
  const tmp_14 = m10 * m31;
  const tmp_15 = m30 * m11;
  const tmp_16 = m10 * m21;
  const tmp_17 = m20 * m11;
  const tmp_18 = m00 * m31;
  const tmp_19 = m30 * m01;
  const tmp_20 = m00 * m21;
  const tmp_21 = m20 * m01;
  const tmp_22 = m00 * m11;
  const tmp_23 = m10 * m01;
  const t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  const t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  const t2 = tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  const t3 = tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  dst[0] = d * t0;
  dst[1] = d * t1;
  dst[2] = d * t2;
  dst[3] = d * t3;
  dst[4] = d * (tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30 - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
  dst[5] = d * (tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30 - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
  dst[6] = d * (tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30 - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
  dst[7] = d * (tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20 - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
  dst[8] = d * (tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33 - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
  dst[9] = d * (tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33 - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
  dst[10] = d * (tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33 - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
  dst[11] = d * (tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23 - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
  dst[12] = d * (tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12 - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
  dst[13] = d * (tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22 - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
  dst[14] = d * (tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02 - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
  dst[15] = d * (tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12 - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
  return dst;
}
/**
 * Multiplies two 4-by-4 matrices with a on the left and b on the right
 * @param {module:twgl/m4.Mat4} a The matrix on the left.
 * @param {module:twgl/m4.Mat4} b The matrix on the right.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The matrix product of a and b.
 * @memberOf module:twgl/m4
 */


function multiply$1(a, b, dst) {
  dst = dst || new MatType(16);
  const a00 = a[0];
  const a01 = a[1];
  const a02 = a[2];
  const a03 = a[3];
  const a10 = a[4 + 0];
  const a11 = a[4 + 1];
  const a12 = a[4 + 2];
  const a13 = a[4 + 3];
  const a20 = a[8 + 0];
  const a21 = a[8 + 1];
  const a22 = a[8 + 2];
  const a23 = a[8 + 3];
  const a30 = a[12 + 0];
  const a31 = a[12 + 1];
  const a32 = a[12 + 2];
  const a33 = a[12 + 3];
  const b00 = b[0];
  const b01 = b[1];
  const b02 = b[2];
  const b03 = b[3];
  const b10 = b[4 + 0];
  const b11 = b[4 + 1];
  const b12 = b[4 + 2];
  const b13 = b[4 + 3];
  const b20 = b[8 + 0];
  const b21 = b[8 + 1];
  const b22 = b[8 + 2];
  const b23 = b[8 + 3];
  const b30 = b[12 + 0];
  const b31 = b[12 + 1];
  const b32 = b[12 + 2];
  const b33 = b[12 + 3];
  dst[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
  dst[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
  dst[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
  dst[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
  dst[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
  dst[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
  dst[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
  dst[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
  dst[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
  dst[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
  dst[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
  dst[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
  dst[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
  dst[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
  dst[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
  dst[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
  return dst;
}
/**
 * Sets the translation component of a 4-by-4 matrix to the given
 * vector.
 * @param {module:twgl/m4.Mat4} a The matrix.
 * @param {module:twgl/v3.Vec3} v The vector.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The matrix with translation set.
 * @memberOf module:twgl/m4
 */


function setTranslation(a, v, dst) {
  dst = dst || identity();

  if (a !== dst) {
    dst[0] = a[0];
    dst[1] = a[1];
    dst[2] = a[2];
    dst[3] = a[3];
    dst[4] = a[4];
    dst[5] = a[5];
    dst[6] = a[6];
    dst[7] = a[7];
    dst[8] = a[8];
    dst[9] = a[9];
    dst[10] = a[10];
    dst[11] = a[11];
  }

  dst[12] = v[0];
  dst[13] = v[1];
  dst[14] = v[2];
  dst[15] = 1;
  return dst;
}
/**
 * Returns the translation component of a 4-by-4 matrix as a vector with 3
 * entries.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not passed a new one is created.
 * @return {module:twgl/v3.Vec3} The translation component of m.
 * @memberOf module:twgl/m4
 */


function getTranslation(m, dst) {
  dst = dst || create();
  dst[0] = m[12];
  dst[1] = m[13];
  dst[2] = m[14];
  return dst;
}
/**
 * Returns an axis of a 4x4 matrix as a vector with 3 entries
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {number} axis The axis 0 = x, 1 = y, 2 = z;
 * @return {module:twgl/v3.Vec3} [dst] vector.
 * @return {module:twgl/v3.Vec3} The axis component of m.
 * @memberOf module:twgl/m4
 */


function getAxis(m, axis, dst) {
  dst = dst || create();
  const off = axis * 4;
  dst[0] = m[off + 0];
  dst[1] = m[off + 1];
  dst[2] = m[off + 2];
  return dst;
}
/**
 * Sets an axis of a 4x4 matrix as a vector with 3 entries
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/v3.Vec3} v the axis vector
 * @param {number} axis The axis  0 = x, 1 = y, 2 = z;
 * @param {module:twgl/m4.Mat4} [dst] The matrix to set. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The matrix with axis set.
 * @memberOf module:twgl/m4
 */


function setAxis(a, v, axis, dst) {
  if (dst !== a) {
    dst = copy$1(a, dst);
  }

  const off = axis * 4;
  dst[off + 0] = v[0];
  dst[off + 1] = v[1];
  dst[off + 2] = v[2];
  return dst;
}
/**
 * Computes a 4-by-4 perspective transformation matrix given the angular height
 * of the frustum, the aspect ratio, and the near and far clipping planes.  The
 * arguments define a frustum extending in the negative z direction.  The given
 * angle is the vertical angle of the frustum, and the horizontal angle is
 * determined to produce the given aspect ratio.  The arguments near and far are
 * the distances to the near and far clipping planes.  Note that near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  The matrix generated sends the viewing frustum to the unit box.
 * We assume a unit box extending from -1 to 1 in the x and y dimensions and
 * from 0 to 1 in the z dimension.
 * @param {number} fieldOfViewYInRadians The camera angle from top to bottom (in radians).
 * @param {number} aspect The aspect ratio width / height.
 * @param {number} zNear The depth (negative z coordinate)
 *     of the near clipping plane.
 * @param {number} zFar The depth (negative z coordinate)
 *     of the far clipping plane.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The perspective matrix.
 * @memberOf module:twgl/m4
 */


function perspective(fieldOfViewYInRadians, aspect, zNear, zFar, dst) {
  dst = dst || new MatType(16);
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
  const rangeInv = 1.0 / (zNear - zFar);
  dst[0] = f / aspect;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = f;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = (zNear + zFar) * rangeInv;
  dst[11] = -1;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = zNear * zFar * rangeInv * 2;
  dst[15] = 0;
  return dst;
}
/**
 * Computes a 4-by-4 orthogonal transformation matrix given the left, right,
 * bottom, and top dimensions of the near clipping plane as well as the
 * near and far clipping plane distances.
 * @param {number} left Left side of the near clipping plane viewport.
 * @param {number} right Right side of the near clipping plane viewport.
 * @param {number} bottom Bottom of the near clipping plane viewport.
 * @param {number} top Top of the near clipping plane viewport.
 * @param {number} near The depth (negative z coordinate)
 *     of the near clipping plane.
 * @param {number} far The depth (negative z coordinate)
 *     of the far clipping plane.
 * @param {module:twgl/m4.Mat4} [dst] Output matrix. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The perspective matrix.
 * @memberOf module:twgl/m4
 */


function ortho(left, right, bottom, top, near, far, dst) {
  dst = dst || new MatType(16);
  dst[0] = 2 / (right - left);
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 2 / (top - bottom);
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = 2 / (near - far);
  dst[11] = 0;
  dst[12] = (right + left) / (left - right);
  dst[13] = (top + bottom) / (bottom - top);
  dst[14] = (far + near) / (near - far);
  dst[15] = 1;
  return dst;
}
/**
 * Computes a 4-by-4 perspective transformation matrix given the left, right,
 * top, bottom, near and far clipping planes. The arguments define a frustum
 * extending in the negative z direction. The arguments near and far are the
 * distances to the near and far clipping planes. Note that near and far are not
 * z coordinates, but rather they are distances along the negative z-axis. The
 * matrix generated sends the viewing frustum to the unit box. We assume a unit
 * box extending from -1 to 1 in the x and y dimensions and from 0 to 1 in the z
 * dimension.
 * @param {number} left The x coordinate of the left plane of the box.
 * @param {number} right The x coordinate of the right plane of the box.
 * @param {number} bottom The y coordinate of the bottom plane of the box.
 * @param {number} top The y coordinate of the right plane of the box.
 * @param {number} near The negative z coordinate of the near plane of the box.
 * @param {number} far The negative z coordinate of the far plane of the box.
 * @param {module:twgl/m4.Mat4} [dst] Output matrix. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The perspective projection matrix.
 * @memberOf module:twgl/m4
 */


function frustum(left, right, bottom, top, near, far, dst) {
  dst = dst || new MatType(16);
  const dx = right - left;
  const dy = top - bottom;
  const dz = near - far;
  dst[0] = 2 * near / dx;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 2 * near / dy;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = (left + right) / dx;
  dst[9] = (top + bottom) / dy;
  dst[10] = far / dz;
  dst[11] = -1;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = near * far / dz;
  dst[15] = 0;
  return dst;
}

let xAxis;
let yAxis;
let zAxis;
/**
 * Computes a 4-by-4 look-at transformation.
 *
 * This is a matrix which positions the camera itself. If you want
 * a view matrix (a matrix which moves things in front of the camera)
 * take the inverse of this.
 *
 * @param {module:twgl/v3.Vec3} eye The position of the eye.
 * @param {module:twgl/v3.Vec3} target The position meant to be viewed.
 * @param {module:twgl/v3.Vec3} up A vector pointing up.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The look-at matrix.
 * @memberOf module:twgl/m4
 */

function lookAt(eye, target, up, dst) {
  dst = dst || new MatType(16);
  xAxis = xAxis || create();
  yAxis = yAxis || create();
  zAxis = zAxis || create();
  normalize(subtract(eye, target, zAxis), zAxis);
  normalize(cross(up, zAxis, xAxis), xAxis);
  normalize(cross(zAxis, xAxis, yAxis), yAxis);
  dst[0] = xAxis[0];
  dst[1] = xAxis[1];
  dst[2] = xAxis[2];
  dst[3] = 0;
  dst[4] = yAxis[0];
  dst[5] = yAxis[1];
  dst[6] = yAxis[2];
  dst[7] = 0;
  dst[8] = zAxis[0];
  dst[9] = zAxis[1];
  dst[10] = zAxis[2];
  dst[11] = 0;
  dst[12] = eye[0];
  dst[13] = eye[1];
  dst[14] = eye[2];
  dst[15] = 1;
  return dst;
}
/**
 * Creates a 4-by-4 matrix which translates by the given vector v.
 * @param {module:twgl/v3.Vec3} v The vector by
 *     which to translate.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The translation matrix.
 * @memberOf module:twgl/m4
 */


function translation(v, dst) {
  dst = dst || new MatType(16);
  dst[0] = 1;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 1;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = 1;
  dst[11] = 0;
  dst[12] = v[0];
  dst[13] = v[1];
  dst[14] = v[2];
  dst[15] = 1;
  return dst;
}
/**
 * Translates the given 4-by-4 matrix by the given vector v.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/v3.Vec3} v The vector by
 *     which to translate.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The translated matrix.
 * @memberOf module:twgl/m4
 */


function translate(m, v, dst) {
  dst = dst || new MatType(16);
  const v0 = v[0];
  const v1 = v[1];
  const v2 = v[2];
  const m00 = m[0];
  const m01 = m[1];
  const m02 = m[2];
  const m03 = m[3];
  const m10 = m[1 * 4 + 0];
  const m11 = m[1 * 4 + 1];
  const m12 = m[1 * 4 + 2];
  const m13 = m[1 * 4 + 3];
  const m20 = m[2 * 4 + 0];
  const m21 = m[2 * 4 + 1];
  const m22 = m[2 * 4 + 2];
  const m23 = m[2 * 4 + 3];
  const m30 = m[3 * 4 + 0];
  const m31 = m[3 * 4 + 1];
  const m32 = m[3 * 4 + 2];
  const m33 = m[3 * 4 + 3];

  if (m !== dst) {
    dst[0] = m00;
    dst[1] = m01;
    dst[2] = m02;
    dst[3] = m03;
    dst[4] = m10;
    dst[5] = m11;
    dst[6] = m12;
    dst[7] = m13;
    dst[8] = m20;
    dst[9] = m21;
    dst[10] = m22;
    dst[11] = m23;
  }

  dst[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
  dst[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
  dst[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
  dst[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;
  return dst;
}
/**
 * Creates a 4-by-4 matrix which rotates around the x-axis by the given angle.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The rotation matrix.
 * @memberOf module:twgl/m4
 */


function rotationX(angleInRadians, dst) {
  dst = dst || new MatType(16);
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  dst[0] = 1;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = c;
  dst[6] = s;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = -s;
  dst[10] = c;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Rotates the given 4-by-4 matrix around the x-axis by the given
 * angle.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The rotated matrix.
 * @memberOf module:twgl/m4
 */


function rotateX(m, angleInRadians, dst) {
  dst = dst || new MatType(16);
  const m10 = m[4];
  const m11 = m[5];
  const m12 = m[6];
  const m13 = m[7];
  const m20 = m[8];
  const m21 = m[9];
  const m22 = m[10];
  const m23 = m[11];
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  dst[4] = c * m10 + s * m20;
  dst[5] = c * m11 + s * m21;
  dst[6] = c * m12 + s * m22;
  dst[7] = c * m13 + s * m23;
  dst[8] = c * m20 - s * m10;
  dst[9] = c * m21 - s * m11;
  dst[10] = c * m22 - s * m12;
  dst[11] = c * m23 - s * m13;

  if (m !== dst) {
    dst[0] = m[0];
    dst[1] = m[1];
    dst[2] = m[2];
    dst[3] = m[3];
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  return dst;
}
/**
 * Creates a 4-by-4 matrix which rotates around the y-axis by the given angle.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The rotation matrix.
 * @memberOf module:twgl/m4
 */


function rotationY(angleInRadians, dst) {
  dst = dst || new MatType(16);
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  dst[0] = c;
  dst[1] = 0;
  dst[2] = -s;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 1;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = s;
  dst[9] = 0;
  dst[10] = c;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Rotates the given 4-by-4 matrix around the y-axis by the given
 * angle.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The rotated matrix.
 * @memberOf module:twgl/m4
 */


function rotateY(m, angleInRadians, dst) {
  dst = dst || new MatType(16);
  const m00 = m[0 * 4 + 0];
  const m01 = m[0 * 4 + 1];
  const m02 = m[0 * 4 + 2];
  const m03 = m[0 * 4 + 3];
  const m20 = m[2 * 4 + 0];
  const m21 = m[2 * 4 + 1];
  const m22 = m[2 * 4 + 2];
  const m23 = m[2 * 4 + 3];
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  dst[0] = c * m00 - s * m20;
  dst[1] = c * m01 - s * m21;
  dst[2] = c * m02 - s * m22;
  dst[3] = c * m03 - s * m23;
  dst[8] = c * m20 + s * m00;
  dst[9] = c * m21 + s * m01;
  dst[10] = c * m22 + s * m02;
  dst[11] = c * m23 + s * m03;

  if (m !== dst) {
    dst[4] = m[4];
    dst[5] = m[5];
    dst[6] = m[6];
    dst[7] = m[7];
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  return dst;
}
/**
 * Creates a 4-by-4 matrix which rotates around the z-axis by the given angle.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The rotation matrix.
 * @memberOf module:twgl/m4
 */


function rotationZ(angleInRadians, dst) {
  dst = dst || new MatType(16);
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  dst[0] = c;
  dst[1] = s;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = -s;
  dst[5] = c;
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = 1;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Rotates the given 4-by-4 matrix around the z-axis by the given
 * angle.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The rotated matrix.
 * @memberOf module:twgl/m4
 */


function rotateZ(m, angleInRadians, dst) {
  dst = dst || new MatType(16);
  const m00 = m[0 * 4 + 0];
  const m01 = m[0 * 4 + 1];
  const m02 = m[0 * 4 + 2];
  const m03 = m[0 * 4 + 3];
  const m10 = m[1 * 4 + 0];
  const m11 = m[1 * 4 + 1];
  const m12 = m[1 * 4 + 2];
  const m13 = m[1 * 4 + 3];
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  dst[0] = c * m00 + s * m10;
  dst[1] = c * m01 + s * m11;
  dst[2] = c * m02 + s * m12;
  dst[3] = c * m03 + s * m13;
  dst[4] = c * m10 - s * m00;
  dst[5] = c * m11 - s * m01;
  dst[6] = c * m12 - s * m02;
  dst[7] = c * m13 - s * m03;

  if (m !== dst) {
    dst[8] = m[8];
    dst[9] = m[9];
    dst[10] = m[10];
    dst[11] = m[11];
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  return dst;
}
/**
 * Creates a 4-by-4 matrix which rotates around the given axis by the given
 * angle.
 * @param {module:twgl/v3.Vec3} axis The axis
 *     about which to rotate.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} A matrix which rotates angle radians
 *     around the axis.
 * @memberOf module:twgl/m4
 */


function axisRotation(axis, angleInRadians, dst) {
  dst = dst || new MatType(16);
  let x = axis[0];
  let y = axis[1];
  let z = axis[2];
  const n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  const xx = x * x;
  const yy = y * y;
  const zz = z * z;
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  const oneMinusCosine = 1 - c;
  dst[0] = xx + (1 - xx) * c;
  dst[1] = x * y * oneMinusCosine + z * s;
  dst[2] = x * z * oneMinusCosine - y * s;
  dst[3] = 0;
  dst[4] = x * y * oneMinusCosine - z * s;
  dst[5] = yy + (1 - yy) * c;
  dst[6] = y * z * oneMinusCosine + x * s;
  dst[7] = 0;
  dst[8] = x * z * oneMinusCosine + y * s;
  dst[9] = y * z * oneMinusCosine - x * s;
  dst[10] = zz + (1 - zz) * c;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Rotates the given 4-by-4 matrix around the given axis by the
 * given angle.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/v3.Vec3} axis The axis
 *     about which to rotate.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The rotated matrix.
 * @memberOf module:twgl/m4
 */


function axisRotate(m, axis, angleInRadians, dst) {
  dst = dst || new MatType(16);
  let x = axis[0];
  let y = axis[1];
  let z = axis[2];
  const n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  const xx = x * x;
  const yy = y * y;
  const zz = z * z;
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  const oneMinusCosine = 1 - c;
  const r00 = xx + (1 - xx) * c;
  const r01 = x * y * oneMinusCosine + z * s;
  const r02 = x * z * oneMinusCosine - y * s;
  const r10 = x * y * oneMinusCosine - z * s;
  const r11 = yy + (1 - yy) * c;
  const r12 = y * z * oneMinusCosine + x * s;
  const r20 = x * z * oneMinusCosine + y * s;
  const r21 = y * z * oneMinusCosine - x * s;
  const r22 = zz + (1 - zz) * c;
  const m00 = m[0];
  const m01 = m[1];
  const m02 = m[2];
  const m03 = m[3];
  const m10 = m[4];
  const m11 = m[5];
  const m12 = m[6];
  const m13 = m[7];
  const m20 = m[8];
  const m21 = m[9];
  const m22 = m[10];
  const m23 = m[11];
  dst[0] = r00 * m00 + r01 * m10 + r02 * m20;
  dst[1] = r00 * m01 + r01 * m11 + r02 * m21;
  dst[2] = r00 * m02 + r01 * m12 + r02 * m22;
  dst[3] = r00 * m03 + r01 * m13 + r02 * m23;
  dst[4] = r10 * m00 + r11 * m10 + r12 * m20;
  dst[5] = r10 * m01 + r11 * m11 + r12 * m21;
  dst[6] = r10 * m02 + r11 * m12 + r12 * m22;
  dst[7] = r10 * m03 + r11 * m13 + r12 * m23;
  dst[8] = r20 * m00 + r21 * m10 + r22 * m20;
  dst[9] = r20 * m01 + r21 * m11 + r22 * m21;
  dst[10] = r20 * m02 + r21 * m12 + r22 * m22;
  dst[11] = r20 * m03 + r21 * m13 + r22 * m23;

  if (m !== dst) {
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  return dst;
}
/**
 * Creates a 4-by-4 matrix which scales in each dimension by an amount given by
 * the corresponding entry in the given vector; assumes the vector has three
 * entries.
 * @param {module:twgl/v3.Vec3} v A vector of
 *     three entries specifying the factor by which to scale in each dimension.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The scaling matrix.
 * @memberOf module:twgl/m4
 */


function scaling(v, dst) {
  dst = dst || new MatType(16);
  dst[0] = v[0];
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = v[1];
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = v[2];
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
}
/**
 * Scales the given 4-by-4 matrix in each dimension by an amount
 * given by the corresponding entry in the given vector; assumes the vector has
 * three entries.
 * @param {module:twgl/m4.Mat4} m The matrix to be modified.
 * @param {module:twgl/v3.Vec3} v A vector of three entries specifying the
 *     factor by which to scale in each dimension.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If not passed a new one is created.
 * @return {module:twgl/m4.Mat4} The scaled matrix.
 * @memberOf module:twgl/m4
 */


function scale(m, v, dst) {
  dst = dst || new MatType(16);
  const v0 = v[0];
  const v1 = v[1];
  const v2 = v[2];
  dst[0] = v0 * m[0 * 4 + 0];
  dst[1] = v0 * m[0 * 4 + 1];
  dst[2] = v0 * m[0 * 4 + 2];
  dst[3] = v0 * m[0 * 4 + 3];
  dst[4] = v1 * m[1 * 4 + 0];
  dst[5] = v1 * m[1 * 4 + 1];
  dst[6] = v1 * m[1 * 4 + 2];
  dst[7] = v1 * m[1 * 4 + 3];
  dst[8] = v2 * m[2 * 4 + 0];
  dst[9] = v2 * m[2 * 4 + 1];
  dst[10] = v2 * m[2 * 4 + 2];
  dst[11] = v2 * m[2 * 4 + 3];

  if (m !== dst) {
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  return dst;
}
/**
 * Takes a 4-by-4 matrix and a vector with 3 entries,
 * interprets the vector as a point, transforms that point by the matrix, and
 * returns the result as a vector with 3 entries.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/v3.Vec3} v The point.
 * @param {module:twgl/v3.Vec3} [dst] optional vec3 to store result. If not passed a new one is created.
 * @return {module:twgl/v3.Vec3} The transformed point.
 * @memberOf module:twgl/m4
 */


function transformPoint(m, v, dst) {
  dst = dst || create();
  const v0 = v[0];
  const v1 = v[1];
  const v2 = v[2];
  const d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];
  dst[0] = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d;
  dst[1] = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d;
  dst[2] = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d;
  return dst;
}
/**
 * Takes a 4-by-4 matrix and a vector with 3 entries, interprets the vector as a
 * direction, transforms that direction by the matrix, and returns the result;
 * assumes the transformation of 3-dimensional space represented by the matrix
 * is parallel-preserving, i.e. any combination of rotation, scaling and
 * translation, but not a perspective distortion. Returns a vector with 3
 * entries.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/v3.Vec3} v The direction.
 * @param {module:twgl/v3.Vec3} [dst] optional Vec3 to store result. If not passed a new one is created.
 * @return {module:twgl/v3.Vec3} The transformed direction.
 * @memberOf module:twgl/m4
 */


function transformDirection(m, v, dst) {
  dst = dst || create();
  const v0 = v[0];
  const v1 = v[1];
  const v2 = v[2];
  dst[0] = v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0];
  dst[1] = v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1];
  dst[2] = v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2];
  return dst;
}
/**
 * Takes a 4-by-4 matrix m and a vector v with 3 entries, interprets the vector
 * as a normal to a surface, and computes a vector which is normal upon
 * transforming that surface by the matrix. The effect of this function is the
 * same as transforming v (as a direction) by the inverse-transpose of m.  This
 * function assumes the transformation of 3-dimensional space represented by the
 * matrix is parallel-preserving, i.e. any combination of rotation, scaling and
 * translation, but not a perspective distortion.  Returns a vector with 3
 * entries.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/v3.Vec3} v The normal.
 * @param {module:twgl/v3.Vec3} [dst] The direction. If not passed a new one is created.
 * @return {module:twgl/v3.Vec3} The transformed normal.
 * @memberOf module:twgl/m4
 */


function transformNormal(m, v, dst) {
  dst = dst || create();
  const mi = inverse(m);
  const v0 = v[0];
  const v1 = v[1];
  const v2 = v[2];
  dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
  dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
  dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];
  return dst;
}

var m4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  axisRotate: axisRotate,
  axisRotation: axisRotation,
  copy: copy$1,
  frustum: frustum,
  getAxis: getAxis,
  getTranslation: getTranslation,
  identity: identity,
  inverse: inverse,
  lookAt: lookAt,
  multiply: multiply$1,
  negate: negate$1,
  ortho: ortho,
  perspective: perspective,
  rotateX: rotateX,
  rotateY: rotateY,
  rotateZ: rotateZ,
  rotationX: rotationX,
  rotationY: rotationY,
  rotationZ: rotationZ,
  scale: scale,
  scaling: scaling,
  setAxis: setAxis,
  setDefaultType: setDefaultType$1,
  setTranslation: setTranslation,
  transformDirection: transformDirection,
  transformNormal: transformNormal,
  transformPoint: transformPoint,
  translate: translate,
  translation: translation,
  transpose: transpose
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/* DataType */

exports.m4 = m4;
const BYTE = 0x1400;
const UNSIGNED_BYTE = 0x1401;
const SHORT = 0x1402;
const UNSIGNED_SHORT = 0x1403;
const INT = 0x1404;
const UNSIGNED_INT = 0x1405;
const FLOAT = 0x1406;
const UNSIGNED_SHORT_4_4_4_4 = 0x8033;
const UNSIGNED_SHORT_5_5_5_1 = 0x8034;
const UNSIGNED_SHORT_5_6_5 = 0x8363;
const HALF_FLOAT = 0x140B;
const UNSIGNED_INT_2_10_10_10_REV = 0x8368;
const UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B;
const UNSIGNED_INT_5_9_9_9_REV = 0x8C3E;
const FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD;
const UNSIGNED_INT_24_8 = 0x84FA;
const glTypeToTypedArray = {};
{
  const tt = glTypeToTypedArray;
  tt[BYTE] = Int8Array;
  tt[UNSIGNED_BYTE] = Uint8Array;
  tt[SHORT] = Int16Array;
  tt[UNSIGNED_SHORT] = Uint16Array;
  tt[INT] = Int32Array;
  tt[UNSIGNED_INT] = Uint32Array;
  tt[FLOAT] = Float32Array;
  tt[UNSIGNED_SHORT_4_4_4_4] = Uint16Array;
  tt[UNSIGNED_SHORT_5_5_5_1] = Uint16Array;
  tt[UNSIGNED_SHORT_5_6_5] = Uint16Array;
  tt[HALF_FLOAT] = Uint16Array;
  tt[UNSIGNED_INT_2_10_10_10_REV] = Uint32Array;
  tt[UNSIGNED_INT_10F_11F_11F_REV] = Uint32Array;
  tt[UNSIGNED_INT_5_9_9_9_REV] = Uint32Array;
  tt[FLOAT_32_UNSIGNED_INT_24_8_REV] = Uint32Array;
  tt[UNSIGNED_INT_24_8] = Uint32Array;
}
/**
 * Get the GL type for a typedArray
 * @param {ArrayBufferView} typedArray a typedArray
 * @return {number} the GL type for array. For example pass in an `Int8Array` and `gl.BYTE` will
 *   be returned. Pass in a `Uint32Array` and `gl.UNSIGNED_INT` will be returned
 * @memberOf module:twgl/typedArray
 */

function getGLTypeForTypedArray(typedArray) {
  if (typedArray instanceof Int8Array) {
    return BYTE;
  } // eslint-disable-line


  if (typedArray instanceof Uint8Array) {
    return UNSIGNED_BYTE;
  } // eslint-disable-line


  if (typedArray instanceof Uint8ClampedArray) {
    return UNSIGNED_BYTE;
  } // eslint-disable-line


  if (typedArray instanceof Int16Array) {
    return SHORT;
  } // eslint-disable-line


  if (typedArray instanceof Uint16Array) {
    return UNSIGNED_SHORT;
  } // eslint-disable-line


  if (typedArray instanceof Int32Array) {
    return INT;
  } // eslint-disable-line


  if (typedArray instanceof Uint32Array) {
    return UNSIGNED_INT;
  } // eslint-disable-line


  if (typedArray instanceof Float32Array) {
    return FLOAT;
  } // eslint-disable-line


  throw new Error('unsupported typed array type');
}
/**
 * Get the GL type for a typedArray type
 * @param {ArrayBufferView} typedArrayType a typedArray constructor
 * @return {number} the GL type for type. For example pass in `Int8Array` and `gl.BYTE` will
 *   be returned. Pass in `Uint32Array` and `gl.UNSIGNED_INT` will be returned
 * @memberOf module:twgl/typedArray
 */


function getGLTypeForTypedArrayType(typedArrayType) {
  if (typedArrayType === Int8Array) {
    return BYTE;
  } // eslint-disable-line


  if (typedArrayType === Uint8Array) {
    return UNSIGNED_BYTE;
  } // eslint-disable-line


  if (typedArrayType === Uint8ClampedArray) {
    return UNSIGNED_BYTE;
  } // eslint-disable-line


  if (typedArrayType === Int16Array) {
    return SHORT;
  } // eslint-disable-line


  if (typedArrayType === Uint16Array) {
    return UNSIGNED_SHORT;
  } // eslint-disable-line


  if (typedArrayType === Int32Array) {
    return INT;
  } // eslint-disable-line


  if (typedArrayType === Uint32Array) {
    return UNSIGNED_INT;
  } // eslint-disable-line


  if (typedArrayType === Float32Array) {
    return FLOAT;
  } // eslint-disable-line


  throw new Error('unsupported typed array type');
}
/**
 * Get the typed array constructor for a given GL type
 * @param {number} type the GL type. (eg: `gl.UNSIGNED_INT`)
 * @return {function} the constructor for a the corresponding typed array. (eg. `Uint32Array`).
 * @memberOf module:twgl/typedArray
 */


function getTypedArrayTypeForGLType(type) {
  const CTOR = glTypeToTypedArray[type];

  if (!CTOR) {
    throw new Error('unknown gl type');
  }

  return CTOR;
}

const isArrayBuffer = typeof SharedArrayBuffer !== 'undefined' ? function isArrayBufferOrSharedArrayBuffer(a) {
  return a && a.buffer && (a.buffer instanceof ArrayBuffer || a.buffer instanceof SharedArrayBuffer);
} : function isArrayBuffer(a) {
  return a && a.buffer && a.buffer instanceof ArrayBuffer;
};
exports.isArrayBuffer = isArrayBuffer;
var typedarrays = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getGLTypeForTypedArray: getGLTypeForTypedArray,
  getGLTypeForTypedArrayType: getGLTypeForTypedArrayType,
  getTypedArrayTypeForGLType: getTypedArrayTypeForGLType,
  isArrayBuffer: isArrayBuffer
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/* eslint no-console: "off" */

/**
 * Copy named properties
 *
 * @param {string[]} names names of properties to copy
 * @param {object} src object to copy properties from
 * @param {object} dst object to copy properties to
 * @private
 */

exports.typedarrays = typedarrays;

function copyNamedProperties(names, src, dst) {
  names.forEach(function (name) {
    const value = src[name];

    if (value !== undefined) {
      dst[name] = value;
    }
  });
}
/**
 * Copies properties from source to dest only if a matching key is in dest
 *
 * @param {Object.<string, ?>} src the source
 * @param {Object.<string, ?>} dst the dest
 * @private
 */


function copyExistingProperties(src, dst) {
  Object.keys(dst).forEach(function (key) {
    if (dst.hasOwnProperty(key) && src.hasOwnProperty(key)) {
      /* eslint no-prototype-builtins: 0 */
      dst[key] = src[key];
    }
  });
}

function error(...args) {
  console.error(...args);
}

function warn(...args) {
  console.warn(...args);
}

function isBuffer(gl, t) {
  return typeof WebGLBuffer !== 'undefined' && t instanceof WebGLBuffer;
}

function isRenderbuffer(gl, t) {
  return typeof WebGLRenderbuffer !== 'undefined' && t instanceof WebGLRenderbuffer;
}

function isShader(gl, t) {
  return typeof WebGLShader !== 'undefined' && t instanceof WebGLShader;
}

function isTexture(gl, t) {
  return typeof WebGLTexture !== 'undefined' && t instanceof WebGLTexture;
}

function isSampler(gl, t) {
  return typeof WebGLSampler !== 'undefined' && t instanceof WebGLSampler;
}
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


const STATIC_DRAW = 0x88e4;
const ARRAY_BUFFER = 0x8892;
const ELEMENT_ARRAY_BUFFER = 0x8893;
const BUFFER_SIZE = 0x8764;
const BYTE$1 = 0x1400;
const UNSIGNED_BYTE$1 = 0x1401;
const SHORT$1 = 0x1402;
const UNSIGNED_SHORT$1 = 0x1403;
const INT$1 = 0x1404;
const UNSIGNED_INT$1 = 0x1405;
const FLOAT$1 = 0x1406;
const defaults = {
  attribPrefix: ""
};
/**
 * Sets the default attrib prefix
 *
 * When writing shaders I prefer to name attributes with `a_`, uniforms with `u_` and varyings with `v_`
 * as it makes it clear where they came from. But, when building geometry I prefer using un-prefixed names.
 *
 * In other words I'll create arrays of geometry like this
 *
 *     var arrays = {
 *       position: ...
 *       normal: ...
 *       texcoord: ...
 *     };
 *
 * But need those mapped to attributes and my attributes start with `a_`.
 *
 * @deprecated see {@link module:twgl.setDefaults}
 * @param {string} prefix prefix for attribs
 * @memberOf module:twgl/attributes
 */

function setAttributePrefix(prefix) {
  defaults.attribPrefix = prefix;
}

function setDefaults(newDefaults) {
  copyExistingProperties(newDefaults, defaults);
}

function setBufferFromTypedArray(gl, type, buffer, array, drawType) {
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, array, drawType || STATIC_DRAW);
}
/**
 * Given typed array creates a WebGLBuffer and copies the typed array
 * into it.
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView|WebGLBuffer} typedArray the typed array. Note: If a WebGLBuffer is passed in it will just be returned. No action will be taken
 * @param {number} [type] the GL bind type for the buffer. Default = `gl.ARRAY_BUFFER`.
 * @param {number} [drawType] the GL draw type for the buffer. Default = 'gl.STATIC_DRAW`.
 * @return {WebGLBuffer} the created WebGLBuffer
 * @memberOf module:twgl/attributes
 */


function createBufferFromTypedArray(gl, typedArray, type, drawType) {
  if (isBuffer(gl, typedArray)) {
    return typedArray;
  }

  type = type || ARRAY_BUFFER;
  const buffer = gl.createBuffer();
  setBufferFromTypedArray(gl, type, buffer, typedArray, drawType);
  return buffer;
}

function isIndices(name) {
  return name === "indices";
} // This is really just a guess. Though I can't really imagine using
// anything else? Maybe for some compression?


function getNormalizationForTypedArray(typedArray) {
  if (typedArray instanceof Int8Array) {
    return true;
  } // eslint-disable-line


  if (typedArray instanceof Uint8Array) {
    return true;
  } // eslint-disable-line


  return false;
} // This is really just a guess. Though I can't really imagine using
// anything else? Maybe for some compression?


function getNormalizationForTypedArrayType(typedArrayType) {
  if (typedArrayType === Int8Array) {
    return true;
  } // eslint-disable-line


  if (typedArrayType === Uint8Array) {
    return true;
  } // eslint-disable-line


  return false;
}

function getArray(array) {
  return array.length ? array : array.data;
}

const texcoordRE = /coord|texture/i;
const colorRE = /color|colour/i;

function guessNumComponentsFromName(name, length) {
  let numComponents;

  if (texcoordRE.test(name)) {
    numComponents = 2;
  } else if (colorRE.test(name)) {
    numComponents = 4;
  } else {
    numComponents = 3; // position, normals, indices ...
  }

  if (length % numComponents > 0) {
    throw new Error(`Can not guess numComponents for attribute '${name}'. Tried ${numComponents} but ${length} values is not evenly divisible by ${numComponents}. You should specify it.`);
  }

  return numComponents;
}

function getNumComponents(array, arrayName) {
  return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
}

function makeTypedArray(array, name) {
  if (isArrayBuffer(array)) {
    return array;
  }

  if (isArrayBuffer(array.data)) {
    return array.data;
  }

  if (Array.isArray(array)) {
    array = {
      data: array
    };
  }

  let Type = array.type;

  if (!Type) {
    if (isIndices(name)) {
      Type = Uint16Array;
    } else {
      Type = Float32Array;
    }
  }

  return new Type(array.data);
}
/**
 * The info for an attribute. This is effectively just the arguments to `gl.vertexAttribPointer` plus the WebGLBuffer
 * for the attribute.
 *
 * @typedef {Object} AttribInfo
 * @property {number[]|ArrayBufferView} [value] a constant value for the attribute. Note: if this is set the attribute will be
 *    disabled and set to this constant value and all other values will be ignored.
 * @property {number} [numComponents] the number of components for this attribute.
 * @property {number} [size] synonym for `numComponents`.
 * @property {number} [type] the type of the attribute (eg. `gl.FLOAT`, `gl.UNSIGNED_BYTE`, etc...) Default = `gl.FLOAT`
 * @property {boolean} [normalize] whether or not to normalize the data. Default = false
 * @property {number} [offset] offset into buffer in bytes. Default = 0
 * @property {number} [stride] the stride in bytes per element. Default = 0
 * @property {number} [divisor] the divisor in instances. Default = undefined. Note: undefined = don't call gl.vertexAttribDivisor
 *    where as anything else = do call it with this value
 * @property {WebGLBuffer} buffer the buffer that contains the data for this attribute
 * @property {number} [drawType] the draw type passed to gl.bufferData. Default = gl.STATIC_DRAW
 * @memberOf module:twgl
 */

/**
 * Use this type of array spec when TWGL can't guess the type or number of components of an array
 * @typedef {Object} FullArraySpec
 * @property {number[]|ArrayBufferView} [value] a constant value for the attribute. Note: if this is set the attribute will be
 *    disabled and set to this constant value and all other values will be ignored.
 * @property {(number|number[]|ArrayBufferView)} data The data of the array. A number alone becomes the number of elements of type.
 * @property {number} [numComponents] number of components for `vertexAttribPointer`. Default is based on the name of the array.
 *    If `coord` is in the name assumes `numComponents = 2`.
 *    If `color` is in the name assumes `numComponents = 4`.
 *    otherwise assumes `numComponents = 3`
 * @property {constructor} [type] type. This is only used if `data` is a JavaScript array. It is the constructor for the typedarray. (eg. `Uint8Array`).
 * For example if you want colors in a `Uint8Array` you might have a `FullArraySpec` like `{ type: Uint8Array, data: [255,0,255,255, ...], }`.
 * @property {number} [size] synonym for `numComponents`.
 * @property {boolean} [normalize] normalize for `vertexAttribPointer`. Default is true if type is `Int8Array` or `Uint8Array` otherwise false.
 * @property {number} [stride] stride for `vertexAttribPointer`. Default = 0
 * @property {number} [offset] offset for `vertexAttribPointer`. Default = 0
 * @property {number} [divisor] divisor for `vertexAttribDivisor`. Default = undefined. Note: undefined = don't call gl.vertexAttribDivisor
 *    where as anything else = do call it with this value
 * @property {string} [attrib] name of attribute this array maps to. Defaults to same name as array prefixed by the default attribPrefix.
 * @property {string} [name] synonym for `attrib`.
 * @property {string} [attribName] synonym for `attrib`.
 * @property {WebGLBuffer} [buffer] Buffer to use for this attribute. This lets you use your own buffer
 *    but you will need to supply `numComponents` and `type`. You can effectively pass an `AttribInfo`
 *    to provide this. Example:
 *
 *         const bufferInfo1 = twgl.createBufferInfoFromArrays(gl, {
 *           position: [1, 2, 3, ... ],
 *         });
 *         const bufferInfo2 = twgl.createBufferInfoFromArrays(gl, {
 *           position: bufferInfo1.attribs.position,  // use the same buffer from bufferInfo1
 *         });
 *
 * @memberOf module:twgl
 */

/**
 * An individual array in {@link module:twgl.Arrays}
 *
 * When passed to {@link module:twgl.createBufferInfoFromArrays} if an ArraySpec is `number[]` or `ArrayBufferView`
 * the types will be guessed based on the name. `indices` will be `Uint16Array`, everything else will
 * be `Float32Array`. If an ArraySpec is a number it's the number of floats for an empty (zeroed) buffer.
 *
 * @typedef {(number|number[]|ArrayBufferView|module:twgl.FullArraySpec)} ArraySpec
 * @memberOf module:twgl
 */

/**
 * This is a JavaScript object of arrays by name. The names should match your shader's attributes. If your
 * attributes have a common prefix you can specify it by calling {@link module:twgl.setAttributePrefix}.
 *
 *     Bare JavaScript Arrays
 *
 *         var arrays = {
 *            position: [-1, 1, 0],
 *            normal: [0, 1, 0],
 *            ...
 *         }
 *
 *     Bare TypedArrays
 *
 *         var arrays = {
 *            position: new Float32Array([-1, 1, 0]),
 *            color: new Uint8Array([255, 128, 64, 255]),
 *            ...
 *         }
 *
 * *   Will guess at `numComponents` if not specified based on name.
 *
 *     If `coord` is in the name assumes `numComponents = 2`
 *
 *     If `color` is in the name assumes `numComponents = 4`
 *
 *     otherwise assumes `numComponents = 3`
 *
 * Objects with various fields. See {@link module:twgl.FullArraySpec}.
 *
 *     var arrays = {
 *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *       normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
 *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
 *     };
 *
 * @typedef {Object.<string, module:twgl.ArraySpec>} Arrays
 * @memberOf module:twgl
 */

/**
 * Creates a set of attribute data and WebGLBuffers from set of arrays
 *
 * Given
 *
 *      var arrays = {
 *        position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *        texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *        normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
 *        color:    { numComponents: 4, data: [255, 255, 255, 255, 255, 0, 0, 255, 0, 0, 255, 255], type: Uint8Array, },
 *        indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
 *      };
 *
 * returns something like
 *
 *      var attribs = {
 *        position: { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
 *        texcoord: { numComponents: 2, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
 *        normal:   { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
 *        color:    { numComponents: 4, type: gl.UNSIGNED_BYTE, normalize: true,  buffer: WebGLBuffer, },
 *      };
 *
 * notes:
 *
 * *   Arrays can take various forms
 *
 *     Bare JavaScript Arrays
 *
 *         var arrays = {
 *            position: [-1, 1, 0],
 *            normal: [0, 1, 0],
 *            ...
 *         }
 *
 *     Bare TypedArrays
 *
 *         var arrays = {
 *            position: new Float32Array([-1, 1, 0]),
 *            color: new Uint8Array([255, 128, 64, 255]),
 *            ...
 *         }
 *
 * *   Will guess at `numComponents` if not specified based on name.
 *
 *     If `coord` is in the name assumes `numComponents = 2`
 *
 *     If `color` is in the name assumes `numComponents = 4`
 *
 *     otherwise assumes `numComponents = 3`
 *
 * @param {WebGLRenderingContext} gl The webgl rendering context.
 * @param {module:twgl.Arrays} arrays The arrays
 * @param {module:twgl.BufferInfo} [srcBufferInfo] a BufferInfo to copy from
 *   This lets you share buffers. Any arrays you supply will override
 *   the buffers from srcBufferInfo.
 * @return {Object.<string, module:twgl.AttribInfo>} the attribs
 * @memberOf module:twgl/attributes
 */


function createAttribsFromArrays(gl, arrays) {
  const attribs = {};
  Object.keys(arrays).forEach(function (arrayName) {
    if (!isIndices(arrayName)) {
      const array = arrays[arrayName];
      const attribName = array.attrib || array.name || array.attribName || defaults.attribPrefix + arrayName;

      if (array.value) {
        if (!Array.isArray(array.value) && !isArrayBuffer(array.value)) {
          throw new Error('array.value is not array or typedarray');
        }

        attribs[attribName] = {
          value: array.value
        };
      } else {
        let buffer;
        let type;
        let normalization;
        let numComponents;

        if (array.buffer && array.buffer instanceof WebGLBuffer) {
          buffer = array.buffer;
          numComponents = array.numComponents || array.size;
          type = array.type;
          normalization = array.normalize;
        } else if (typeof array === "number" || typeof array.data === "number") {
          const numValues = array.data || array;
          const arrayType = array.type || Float32Array;
          const numBytes = numValues * arrayType.BYTES_PER_ELEMENT;
          type = getGLTypeForTypedArrayType(arrayType);
          normalization = array.normalize !== undefined ? array.normalize : getNormalizationForTypedArrayType(arrayType);
          numComponents = array.numComponents || array.size || guessNumComponentsFromName(arrayName, numValues);
          buffer = gl.createBuffer();
          gl.bindBuffer(ARRAY_BUFFER, buffer);
          gl.bufferData(ARRAY_BUFFER, numBytes, array.drawType || STATIC_DRAW);
        } else {
          const typedArray = makeTypedArray(array, arrayName);
          buffer = createBufferFromTypedArray(gl, typedArray, undefined, array.drawType);
          type = getGLTypeForTypedArray(typedArray);
          normalization = array.normalize !== undefined ? array.normalize : getNormalizationForTypedArray(typedArray);
          numComponents = getNumComponents(array, arrayName);
        }

        attribs[attribName] = {
          buffer: buffer,
          numComponents: numComponents,
          type: type,
          normalize: normalization,
          stride: array.stride || 0,
          offset: array.offset || 0,
          divisor: array.divisor === undefined ? undefined : array.divisor,
          drawType: array.drawType
        };
      }
    }
  });
  gl.bindBuffer(ARRAY_BUFFER, null);
  return attribs;
}
/**
 * Sets the contents of a buffer attached to an attribInfo
 *
 * This is helper function to dynamically update a buffer.
 *
 * Let's say you make a bufferInfo
 *
 *     var arrays = {
 *        position: new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]),
 *        texcoord: new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
 *        normal:   new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
 *        indices:  new Uint16Array([0, 1, 2, 1, 2, 3]),
 *     };
 *     var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
 *
 *  And you want to dynamically update the positions. You could do this
 *
 *     // assuming arrays.position has already been updated with new data.
 *     twgl.setAttribInfoBufferFromArray(gl, bufferInfo.attribs.position, arrays.position);
 *
 * @param {WebGLRenderingContext} gl
 * @param {AttribInfo} attribInfo The attribInfo who's buffer contents to set. NOTE: If you have an attribute prefix
 *   the name of the attribute will include the prefix.
 * @param {ArraySpec} array Note: it is arguably inefficient to pass in anything but a typed array because anything
 *    else will have to be converted to a typed array before it can be used by WebGL. During init time that
 *    inefficiency is usually not important but if you're updating data dynamically best to be efficient.
 * @param {number} [offset] an optional offset into the buffer. This is only an offset into the WebGL buffer
 *    not the array. To pass in an offset into the array itself use a typed array and create an `ArrayBufferView`
 *    for the portion of the array you want to use.
 *
 *        var someArray = new Float32Array(1000); // an array with 1000 floats
 *        var someSubArray = new Float32Array(someArray.buffer, offsetInBytes, sizeInUnits); // a view into someArray
 *
 *    Now you can pass `someSubArray` into setAttribInfoBufferFromArray`
 * @memberOf module:twgl/attributes
 */


function setAttribInfoBufferFromArray(gl, attribInfo, array, offset) {
  array = makeTypedArray(array);

  if (offset !== undefined) {
    gl.bindBuffer(ARRAY_BUFFER, attribInfo.buffer);
    gl.bufferSubData(ARRAY_BUFFER, offset, array);
  } else {
    setBufferFromTypedArray(gl, ARRAY_BUFFER, attribInfo.buffer, array, attribInfo.drawType);
  }
}

function getBytesPerValueForGLType(gl, type) {
  if (type === BYTE$1) return 1; // eslint-disable-line

  if (type === UNSIGNED_BYTE$1) return 1; // eslint-disable-line

  if (type === SHORT$1) return 2; // eslint-disable-line

  if (type === UNSIGNED_SHORT$1) return 2; // eslint-disable-line

  if (type === INT$1) return 4; // eslint-disable-line

  if (type === UNSIGNED_INT$1) return 4; // eslint-disable-line

  if (type === FLOAT$1) return 4; // eslint-disable-line

  return 0;
} // Tries to get the number of elements from a set of arrays.


const positionKeys = ['position', 'positions', 'a_position'];

function getNumElementsFromNonIndexedArrays(arrays) {
  let key;
  let ii;

  for (ii = 0; ii < positionKeys.length; ++ii) {
    key = positionKeys[ii];

    if (key in arrays) {
      break;
    }
  }

  if (ii === positionKeys.length) {
    key = Object.keys(arrays)[0];
  }

  const array = arrays[key];
  const length = getArray(array).length;
  const numComponents = getNumComponents(array, key);
  const numElements = length / numComponents;

  if (length % numComponents > 0) {
    throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
  }

  return numElements;
}

function getNumElementsFromAttributes(gl, attribs) {
  let key;
  let ii;

  for (ii = 0; ii < positionKeys.length; ++ii) {
    key = positionKeys[ii];

    if (key in attribs) {
      break;
    }

    key = defaults.attribPrefix + key;

    if (key in attribs) {
      break;
    }
  }

  if (ii === positionKeys.length) {
    key = Object.keys(attribs)[0];
  }

  const attrib = attribs[key];
  gl.bindBuffer(ARRAY_BUFFER, attrib.buffer);
  const numBytes = gl.getBufferParameter(ARRAY_BUFFER, BUFFER_SIZE);
  gl.bindBuffer(ARRAY_BUFFER, null);
  const bytesPerValue = getBytesPerValueForGLType(gl, attrib.type);
  const totalElements = numBytes / bytesPerValue;
  const numComponents = attrib.numComponents || attrib.size; // TODO: check stride

  const numElements = totalElements / numComponents;

  if (numElements % 1 !== 0) {
    throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
  }

  return numElements;
}
/**
 * @typedef {Object} BufferInfo
 * @property {number} numElements The number of elements to pass to `gl.drawArrays` or `gl.drawElements`.
 * @property {number} [elementType] The type of indices `UNSIGNED_BYTE`, `UNSIGNED_SHORT` etc..
 * @property {WebGLBuffer} [indices] The indices `ELEMENT_ARRAY_BUFFER` if any indices exist.
 * @property {Object.<string, module:twgl.AttribInfo>} [attribs] The attribs appropriate to call `setAttributes`
 * @memberOf module:twgl
 */

/**
 * Creates a BufferInfo from an object of arrays.
 *
 * This can be passed to {@link module:twgl.setBuffersAndAttributes} and to
 * {@link module:twgl:drawBufferInfo}.
 *
 * Given an object like
 *
 *     var arrays = {
 *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *       normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
 *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
 *     };
 *
 *  Creates an BufferInfo like this
 *
 *     bufferInfo = {
 *       numElements: 4,        // or whatever the number of elements is
 *       indices: WebGLBuffer,  // this property will not exist if there are no indices
 *       attribs: {
 *         position: { buffer: WebGLBuffer, numComponents: 3, },
 *         normal:   { buffer: WebGLBuffer, numComponents: 3, },
 *         texcoord: { buffer: WebGLBuffer, numComponents: 2, },
 *       },
 *     };
 *
 *  The properties of arrays can be JavaScript arrays in which case the number of components
 *  will be guessed.
 *
 *     var arrays = {
 *        position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
 *        texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
 *        normal:   [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
 *        indices:  [0, 1, 2, 1, 2, 3],
 *     };
 *
 *  They can also be TypedArrays
 *
 *     var arrays = {
 *        position: new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]),
 *        texcoord: new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
 *        normal:   new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
 *        indices:  new Uint16Array([0, 1, 2, 1, 2, 3]),
 *     };
 *
 *  Or AugmentedTypedArrays
 *
 *     var positions = createAugmentedTypedArray(3, 4);
 *     var texcoords = createAugmentedTypedArray(2, 4);
 *     var normals   = createAugmentedTypedArray(3, 4);
 *     var indices   = createAugmentedTypedArray(3, 2, Uint16Array);
 *
 *     positions.push([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]);
 *     texcoords.push([0, 0, 0, 1, 1, 0, 1, 1]);
 *     normals.push([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
 *     indices.push([0, 1, 2, 1, 2, 3]);
 *
 *     var arrays = {
 *        position: positions,
 *        texcoord: texcoords,
 *        normal:   normals,
 *        indices:  indices,
 *     };
 *
 * For the last example it is equivalent to
 *
 *     var bufferInfo = {
 *       attribs: {
 *         position: { numComponents: 3, buffer: gl.createBuffer(), },
 *         texcoord: { numComponents: 2, buffer: gl.createBuffer(), },
 *         normal: { numComponents: 3, buffer: gl.createBuffer(), },
 *       },
 *       indices: gl.createBuffer(),
 *       numElements: 6,
 *     };
 *
 *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.position.buffer);
 *     gl.bufferData(gl.ARRAY_BUFFER, arrays.position, gl.STATIC_DRAW);
 *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.texcoord.buffer);
 *     gl.bufferData(gl.ARRAY_BUFFER, arrays.texcoord, gl.STATIC_DRAW);
 *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.normal.buffer);
 *     gl.bufferData(gl.ARRAY_BUFFER, arrays.normal, gl.STATIC_DRAW);
 *     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
 *     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrays.indices, gl.STATIC_DRAW);
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @param {module:twgl.Arrays} arrays Your data
 * @param {module:twgl.BufferInfo} [srcBufferInfo] An existing
 *        buffer info to start from. WebGLBuffers etc specified
 *        in the srcBufferInfo will be used in a new BufferInfo
 *        with any arrays specified overriding the ones in
 *        srcBufferInfo.
 * @return {module:twgl.BufferInfo} A BufferInfo
 * @memberOf module:twgl/attributes
 */


function createBufferInfoFromArrays(gl, arrays, srcBufferInfo) {
  const newAttribs = createAttribsFromArrays(gl, arrays);
  const bufferInfo = Object.assign({}, srcBufferInfo ? srcBufferInfo : {});
  bufferInfo.attribs = Object.assign({}, srcBufferInfo ? srcBufferInfo.attribs : {}, newAttribs);
  const indices = arrays.indices;

  if (indices) {
    const newIndices = makeTypedArray(indices, "indices");
    bufferInfo.indices = createBufferFromTypedArray(gl, newIndices, ELEMENT_ARRAY_BUFFER);
    bufferInfo.numElements = newIndices.length;
    bufferInfo.elementType = getGLTypeForTypedArray(newIndices);
  } else if (!bufferInfo.numElements) {
    bufferInfo.numElements = getNumElementsFromAttributes(gl, bufferInfo.attribs);
  }

  return bufferInfo;
}
/**
 * Creates a buffer from an array, typed array, or array spec
 *
 * Given something like this
 *
 *     [1, 2, 3],
 *
 * or
 *
 *     new Uint16Array([1,2,3]);
 *
 * or
 *
 *     {
 *        data: [1, 2, 3],
 *        type: Uint8Array,
 *     }
 *
 * returns a WebGLBuffer that contains the given data.
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext.
 * @param {module:twgl.ArraySpec} array an array, typed array, or array spec.
 * @param {string} arrayName name of array. Used to guess the type if type can not be derived otherwise.
 * @return {WebGLBuffer} a WebGLBuffer containing the data in array.
 * @memberOf module:twgl/attributes
 */


function createBufferFromArray(gl, array, arrayName) {
  const type = arrayName === "indices" ? ELEMENT_ARRAY_BUFFER : ARRAY_BUFFER;
  const typedArray = makeTypedArray(array, arrayName);
  return createBufferFromTypedArray(gl, typedArray, type);
}
/**
 * Creates buffers from arrays or typed arrays
 *
 * Given something like this
 *
 *     var arrays = {
 *        positions: [1, 2, 3],
 *        normals: [0, 0, 1],
 *     }
 *
 * returns something like
 *
 *     buffers = {
 *       positions: WebGLBuffer,
 *       normals: WebGLBuffer,
 *     }
 *
 * If the buffer is named 'indices' it will be made an ELEMENT_ARRAY_BUFFER.
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext.
 * @param {module:twgl.Arrays} arrays
 * @return {Object<string, WebGLBuffer>} returns an object with one WebGLBuffer per array
 * @memberOf module:twgl/attributes
 */


function createBuffersFromArrays(gl, arrays) {
  const buffers = {};
  Object.keys(arrays).forEach(function (key) {
    buffers[key] = createBufferFromArray(gl, arrays[key], key);
  }); // Ugh!

  if (arrays.indices) {
    buffers.numElements = arrays.indices.length;
    buffers.elementType = getGLTypeForTypedArray(makeTypedArray(arrays.indices));
  } else {
    buffers.numElements = getNumElementsFromNonIndexedArrays(arrays);
  }

  return buffers;
}

var attributes = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createAttribsFromArrays: createAttribsFromArrays,
  createBuffersFromArrays: createBuffersFromArrays,
  createBufferFromArray: createBufferFromArray,
  createBufferFromTypedArray: createBufferFromTypedArray,
  createBufferInfoFromArrays: createBufferInfoFromArrays,
  setAttribInfoBufferFromArray: setAttribInfoBufferFromArray,
  setAttributePrefix: setAttributePrefix,
  setAttributeDefaults_: setDefaults,
  getNumComponents_: getNumComponents,
  getArray_: getArray
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

exports.attributes = attributes;
const getArray$1 = getArray; // eslint-disable-line

const getNumComponents$1 = getNumComponents; // eslint-disable-line

/**
 * @typedef {(Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array)} TypedArray
 */

/**
 * Add `push` to a typed array. It just keeps a 'cursor'
 * and allows use to `push` values into the array so we
 * don't have to manually compute offsets
 * @param {TypedArray} typedArray TypedArray to augment
 * @param {number} numComponents number of components.
 * @private
 */

function augmentTypedArray(typedArray, numComponents) {
  let cursor = 0;

  typedArray.push = function () {
    for (let ii = 0; ii < arguments.length; ++ii) {
      const value = arguments[ii];

      if (value instanceof Array || isArrayBuffer(value)) {
        for (let jj = 0; jj < value.length; ++jj) {
          typedArray[cursor++] = value[jj];
        }
      } else {
        typedArray[cursor++] = value;
      }
    }
  };

  typedArray.reset = function (opt_index) {
    cursor = opt_index || 0;
  };

  typedArray.numComponents = numComponents;
  Object.defineProperty(typedArray, 'numElements', {
    get: function () {
      return this.length / this.numComponents | 0;
    }
  });
  return typedArray;
}
/**
 * creates a typed array with a `push` function attached
 * so that you can easily *push* values.
 *
 * `push` can take multiple arguments. If an argument is an array each element
 * of the array will be added to the typed array.
 *
 * Example:
 *
 *     const array = createAugmentedTypedArray(3, 2);  // creates a Float32Array with 6 values
 *     array.push(1, 2, 3);
 *     array.push([4, 5, 6]);
 *     // array now contains [1, 2, 3, 4, 5, 6]
 *
 * Also has `numComponents` and `numElements` properties.
 *
 * @param {number} numComponents number of components
 * @param {number} numElements number of elements. The total size of the array will be `numComponents * numElements`.
 * @param {constructor} opt_type A constructor for the type. Default = `Float32Array`.
 * @return {ArrayBufferView} A typed array.
 * @memberOf module:twgl/primitives
 */


function createAugmentedTypedArray(numComponents, numElements, opt_type) {
  const Type = opt_type || Float32Array;
  return augmentTypedArray(new Type(numComponents * numElements), numComponents);
}

function allButIndices(name) {
  return name !== "indices";
}
/**
 * Given indexed vertices creates a new set of vertices un-indexed by expanding the indexed vertices.
 * @param {Object.<string, TypedArray>} vertices The indexed vertices to deindex
 * @return {Object.<string, TypedArray>} The deindexed vertices
 * @memberOf module:twgl/primitives
 */


function deindexVertices(vertices) {
  const indices = vertices.indices;
  const newVertices = {};
  const numElements = indices.length;

  function expandToUnindexed(channel) {
    const srcBuffer = vertices[channel];
    const numComponents = srcBuffer.numComponents;
    const dstBuffer = createAugmentedTypedArray(numComponents, numElements, srcBuffer.constructor);

    for (let ii = 0; ii < numElements; ++ii) {
      const ndx = indices[ii];
      const offset = ndx * numComponents;

      for (let jj = 0; jj < numComponents; ++jj) {
        dstBuffer.push(srcBuffer[offset + jj]);
      }
    }

    newVertices[channel] = dstBuffer;
  }

  Object.keys(vertices).filter(allButIndices).forEach(expandToUnindexed);
  return newVertices;
}
/**
 * flattens the normals of deindexed vertices in place.
 * @param {Object.<string, TypedArray>} vertices The deindexed vertices who's normals to flatten
 * @return {Object.<string, TypedArray>} The flattened vertices (same as was passed in)
 * @memberOf module:twgl/primitives
 */


function flattenNormals(vertices) {
  if (vertices.indices) {
    throw new Error('can not flatten normals of indexed vertices. deindex them first');
  }

  const normals = vertices.normal;
  const numNormals = normals.length;

  for (let ii = 0; ii < numNormals; ii += 9) {
    // pull out the 3 normals for this triangle
    const nax = normals[ii + 0];
    const nay = normals[ii + 1];
    const naz = normals[ii + 2];
    const nbx = normals[ii + 3];
    const nby = normals[ii + 4];
    const nbz = normals[ii + 5];
    const ncx = normals[ii + 6];
    const ncy = normals[ii + 7];
    const ncz = normals[ii + 8]; // add them

    let nx = nax + nbx + ncx;
    let ny = nay + nby + ncy;
    let nz = naz + nbz + ncz; // normalize them

    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
    nx /= length;
    ny /= length;
    nz /= length; // copy them back in

    normals[ii + 0] = nx;
    normals[ii + 1] = ny;
    normals[ii + 2] = nz;
    normals[ii + 3] = nx;
    normals[ii + 4] = ny;
    normals[ii + 5] = nz;
    normals[ii + 6] = nx;
    normals[ii + 7] = ny;
    normals[ii + 8] = nz;
  }

  return vertices;
}

function applyFuncToV3Array(array, matrix, fn) {
  const len = array.length;
  const tmp = new Float32Array(3);

  for (let ii = 0; ii < len; ii += 3) {
    fn(matrix, [array[ii], array[ii + 1], array[ii + 2]], tmp);
    array[ii] = tmp[0];
    array[ii + 1] = tmp[1];
    array[ii + 2] = tmp[2];
  }
}

function transformNormal$1(mi, v, dst) {
  dst = dst || create();
  const v0 = v[0];
  const v1 = v[1];
  const v2 = v[2];
  dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
  dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
  dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];
  return dst;
}
/**
 * Reorients directions by the given matrix..
 * @param {(number[]|TypedArray)} array The array. Assumes value floats per element.
 * @param {module:twgl/m4.Mat4} matrix A matrix to multiply by.
 * @return {(number[]|TypedArray)} the same array that was passed in
 * @memberOf module:twgl/primitives
 */


function reorientDirections(array, matrix) {
  applyFuncToV3Array(array, matrix, transformDirection);
  return array;
}
/**
 * Reorients normals by the inverse-transpose of the given
 * matrix..
 * @param {(number[]|TypedArray)} array The array. Assumes value floats per element.
 * @param {module:twgl/m4.Mat4} matrix A matrix to multiply by.
 * @return {(number[]|TypedArray)} the same array that was passed in
 * @memberOf module:twgl/primitives
 */


function reorientNormals(array, matrix) {
  applyFuncToV3Array(array, inverse(matrix), transformNormal$1);
  return array;
}
/**
 * Reorients positions by the given matrix. In other words, it
 * multiplies each vertex by the given matrix.
 * @param {(number[]|TypedArray)} array The array. Assumes value floats per element.
 * @param {module:twgl/m4.Mat4} matrix A matrix to multiply by.
 * @return {(number[]|TypedArray)} the same array that was passed in
 * @memberOf module:twgl/primitives
 */


function reorientPositions(array, matrix) {
  applyFuncToV3Array(array, matrix, transformPoint);
  return array;
}
/**
 * @typedef {(number[]|TypedArray)} NativeArrayOrTypedArray
 */

/**
 * Reorients arrays by the given matrix. Assumes arrays have
 * names that contains 'pos' could be reoriented as positions,
 * 'binorm' or 'tan' as directions, and 'norm' as normals.
 *
 * @param {Object.<string, NativeArrayOrTypedArray>} arrays The vertices to reorient
 * @param {module:twgl/m4.Mat4} matrix matrix to reorient by.
 * @return {Object.<string, NativeArrayOrTypedArray>} same arrays that were passed in.
 * @memberOf module:twgl/primitives
 */


function reorientVertices(arrays, matrix) {
  Object.keys(arrays).forEach(function (name) {
    const array = arrays[name];

    if (name.indexOf("pos") >= 0) {
      reorientPositions(array, matrix);
    } else if (name.indexOf("tan") >= 0 || name.indexOf("binorm") >= 0) {
      reorientDirections(array, matrix);
    } else if (name.indexOf("norm") >= 0) {
      reorientNormals(array, matrix);
    }
  });
  return arrays;
}
/**
 * Creates XY quad BufferInfo
 *
 * The default with no parameters will return a 2x2 quad with values from -1 to +1.
 * If you want a unit quad with that goes from 0 to 1 you'd call it with
 *
 *     twgl.primitives.createXYQuadBufferInfo(gl, 1, 0.5, 0.5);
 *
 * If you want a unit quad centered above 0,0 you'd call it with
 *
 *     twgl.primitives.createXYQuadBufferInfo(gl, 1, 0, 0.5);
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} [size] the size across the quad. Defaults to 2 which means vertices will go from -1 to +1
 * @param {number} [xOffset] the amount to offset the quad in X
 * @param {number} [yOffset] the amount to offset the quad in Y
 * @return {Object.<string, WebGLBuffer>} the created XY Quad BufferInfo
 * @memberOf module:twgl/primitives
 * @function createXYQuadBuffers
 */

/**
 * Creates XY quad Buffers
 *
 * The default with no parameters will return a 2x2 quad with values from -1 to +1.
 * If you want a unit quad with that goes from 0 to 1 you'd call it with
 *
 *     twgl.primitives.createXYQuadBufferInfo(gl, 1, 0.5, 0.5);
 *
 * If you want a unit quad centered above 0,0 you'd call it with
 *
 *     twgl.primitives.createXYQuadBufferInfo(gl, 1, 0, 0.5);
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} [size] the size across the quad. Defaults to 2 which means vertices will go from -1 to +1
 * @param {number} [xOffset] the amount to offset the quad in X
 * @param {number} [yOffset] the amount to offset the quad in Y
 * @return {module:twgl.BufferInfo} the created XY Quad buffers
 * @memberOf module:twgl/primitives
 * @function createXYQuadBufferInfo
 */

/**
 * Creates XY quad vertices
 *
 * The default with no parameters will return a 2x2 quad with values from -1 to +1.
 * If you want a unit quad with that goes from 0 to 1 you'd call it with
 *
 *     twgl.primitives.createXYQuadVertices(1, 0.5, 0.5);
 *
 * If you want a unit quad centered above 0,0 you'd call it with
 *
 *     twgl.primitives.createXYQuadVertices(1, 0, 0.5);
 *
 * @param {number} [size] the size across the quad. Defaults to 2 which means vertices will go from -1 to +1
 * @param {number} [xOffset] the amount to offset the quad in X
 * @param {number} [yOffset] the amount to offset the quad in Y
 * @return {Object.<string, TypedArray>} the created XY Quad vertices
 * @memberOf module:twgl/primitives
 */


function createXYQuadVertices(size, xOffset, yOffset) {
  size = size || 2;
  xOffset = xOffset || 0;
  yOffset = yOffset || 0;
  size *= 0.5;
  return {
    position: {
      numComponents: 2,
      data: [xOffset + -1 * size, yOffset + -1 * size, xOffset + 1 * size, yOffset + -1 * size, xOffset + -1 * size, yOffset + 1 * size, xOffset + 1 * size, yOffset + 1 * size]
    },
    normal: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    texcoord: [0, 0, 1, 0, 0, 1, 1, 1],
    indices: [0, 1, 2, 2, 1, 3]
  };
}
/**
 * Creates XZ plane BufferInfo.
 *
 * The created plane has position, normal, and texcoord data
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} [width] Width of the plane. Default = 1
 * @param {number} [depth] Depth of the plane. Default = 1
 * @param {number} [subdivisionsWidth] Number of steps across the plane. Default = 1
 * @param {number} [subdivisionsDepth] Number of steps down the plane. Default = 1
 * @param {module:twgl/m4.Mat4} [matrix] A matrix by which to multiply all the vertices.
 * @return {module:twgl.BufferInfo} The created plane BufferInfo.
 * @memberOf module:twgl/primitives
 * @function createPlaneBufferInfo
 */

/**
 * Creates XZ plane buffers.
 *
 * The created plane has position, normal, and texcoord data
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} [width] Width of the plane. Default = 1
 * @param {number} [depth] Depth of the plane. Default = 1
 * @param {number} [subdivisionsWidth] Number of steps across the plane. Default = 1
 * @param {number} [subdivisionsDepth] Number of steps down the plane. Default = 1
 * @param {module:twgl/m4.Mat4} [matrix] A matrix by which to multiply all the vertices.
 * @return {Object.<string, WebGLBuffer>} The created plane buffers.
 * @memberOf module:twgl/primitives
 * @function createPlaneBuffers
 */

/**
 * Creates XZ plane vertices.
 *
 * The created plane has position, normal, and texcoord data
 *
 * @param {number} [width] Width of the plane. Default = 1
 * @param {number} [depth] Depth of the plane. Default = 1
 * @param {number} [subdivisionsWidth] Number of steps across the plane. Default = 1
 * @param {number} [subdivisionsDepth] Number of steps down the plane. Default = 1
 * @param {module:twgl/m4.Mat4} [matrix] A matrix by which to multiply all the vertices.
 * @return {Object.<string, TypedArray>} The created plane vertices.
 * @memberOf module:twgl/primitives
 */


function createPlaneVertices(width, depth, subdivisionsWidth, subdivisionsDepth, matrix) {
  width = width || 1;
  depth = depth || 1;
  subdivisionsWidth = subdivisionsWidth || 1;
  subdivisionsDepth = subdivisionsDepth || 1;
  matrix = matrix || identity();
  const numVertices = (subdivisionsWidth + 1) * (subdivisionsDepth + 1);
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals = createAugmentedTypedArray(3, numVertices);
  const texcoords = createAugmentedTypedArray(2, numVertices);

  for (let z = 0; z <= subdivisionsDepth; z++) {
    for (let x = 0; x <= subdivisionsWidth; x++) {
      const u = x / subdivisionsWidth;
      const v = z / subdivisionsDepth;
      positions.push(width * u - width * 0.5, 0, depth * v - depth * 0.5);
      normals.push(0, 1, 0);
      texcoords.push(u, v);
    }
  }

  const numVertsAcross = subdivisionsWidth + 1;
  const indices = createAugmentedTypedArray(3, subdivisionsWidth * subdivisionsDepth * 2, Uint16Array);

  for (let z = 0; z < subdivisionsDepth; z++) {
    // eslint-disable-line
    for (let x = 0; x < subdivisionsWidth; x++) {
      // eslint-disable-line
      // Make triangle 1 of quad.
      indices.push((z + 0) * numVertsAcross + x, (z + 1) * numVertsAcross + x, (z + 0) * numVertsAcross + x + 1); // Make triangle 2 of quad.

      indices.push((z + 1) * numVertsAcross + x, (z + 1) * numVertsAcross + x + 1, (z + 0) * numVertsAcross + x + 1);
    }
  }

  const arrays = reorientVertices({
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices
  }, matrix);
  return arrays;
}
/**
 * Creates sphere BufferInfo.
 *
 * The created sphere has position, normal, and texcoord data
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} radius radius of the sphere.
 * @param {number} subdivisionsAxis number of steps around the sphere.
 * @param {number} subdivisionsHeight number of vertically on the sphere.
 * @param {number} [opt_startLatitudeInRadians] where to start the
 *     top of the sphere. Default = 0.
 * @param {number} [opt_endLatitudeInRadians] Where to end the
 *     bottom of the sphere. Default = Math.PI.
 * @param {number} [opt_startLongitudeInRadians] where to start
 *     wrapping the sphere. Default = 0.
 * @param {number} [opt_endLongitudeInRadians] where to end
 *     wrapping the sphere. Default = 2 * Math.PI.
 * @return {module:twgl.BufferInfo} The created sphere BufferInfo.
 * @memberOf module:twgl/primitives
 * @function createSphereBufferInfo
 */

/**
 * Creates sphere buffers.
 *
 * The created sphere has position, normal, and texcoord data
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} radius radius of the sphere.
 * @param {number} subdivisionsAxis number of steps around the sphere.
 * @param {number} subdivisionsHeight number of vertically on the sphere.
 * @param {number} [opt_startLatitudeInRadians] where to start the
 *     top of the sphere. Default = 0.
 * @param {number} [opt_endLatitudeInRadians] Where to end the
 *     bottom of the sphere. Default = Math.PI.
 * @param {number} [opt_startLongitudeInRadians] where to start
 *     wrapping the sphere. Default = 0.
 * @param {number} [opt_endLongitudeInRadians] where to end
 *     wrapping the sphere. Default = 2 * Math.PI.
 * @return {Object.<string, WebGLBuffer>} The created sphere buffers.
 * @memberOf module:twgl/primitives
 * @function createSphereBuffers
 */

/**
 * Creates sphere vertices.
 *
 * The created sphere has position, normal, and texcoord data
 *
 * @param {number} radius radius of the sphere.
 * @param {number} subdivisionsAxis number of steps around the sphere.
 * @param {number} subdivisionsHeight number of vertically on the sphere.
 * @param {number} [opt_startLatitudeInRadians] where to start the
 *     top of the sphere. Default = 0.
 * @param {number} [opt_endLatitudeInRadians] Where to end the
 *     bottom of the sphere. Default = Math.PI.
 * @param {number} [opt_startLongitudeInRadians] where to start
 *     wrapping the sphere. Default = 0.
 * @param {number} [opt_endLongitudeInRadians] where to end
 *     wrapping the sphere. Default = 2 * Math.PI.
 * @return {Object.<string, TypedArray>} The created sphere vertices.
 * @memberOf module:twgl/primitives
 */


function createSphereVertices(radius, subdivisionsAxis, subdivisionsHeight, opt_startLatitudeInRadians, opt_endLatitudeInRadians, opt_startLongitudeInRadians, opt_endLongitudeInRadians) {
  if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
    throw new Error('subdivisionAxis and subdivisionHeight must be > 0');
  }

  opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
  opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
  opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
  opt_endLongitudeInRadians = opt_endLongitudeInRadians || Math.PI * 2;
  const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
  const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians; // We are going to generate our sphere by iterating through its
  // spherical coordinates and generating 2 triangles for each quad on a
  // ring of the sphere.

  const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals = createAugmentedTypedArray(3, numVertices);
  const texcoords = createAugmentedTypedArray(2, numVertices); // Generate the individual vertices in our vertex buffer.

  for (let y = 0; y <= subdivisionsHeight; y++) {
    for (let x = 0; x <= subdivisionsAxis; x++) {
      // Generate a vertex based on its spherical coordinates
      const u = x / subdivisionsAxis;
      const v = y / subdivisionsHeight;
      const theta = longRange * u + opt_startLongitudeInRadians;
      const phi = latRange * v + opt_startLatitudeInRadians;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const ux = cosTheta * sinPhi;
      const uy = cosPhi;
      const uz = sinTheta * sinPhi;
      positions.push(radius * ux, radius * uy, radius * uz);
      normals.push(ux, uy, uz);
      texcoords.push(1 - u, v);
    }
  }

  const numVertsAround = subdivisionsAxis + 1;
  const indices = createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array);

  for (let x = 0; x < subdivisionsAxis; x++) {
    // eslint-disable-line
    for (let y = 0; y < subdivisionsHeight; y++) {
      // eslint-disable-line
      // Make triangle 1 of quad.
      indices.push((y + 0) * numVertsAround + x, (y + 0) * numVertsAround + x + 1, (y + 1) * numVertsAround + x); // Make triangle 2 of quad.

      indices.push((y + 1) * numVertsAround + x, (y + 0) * numVertsAround + x + 1, (y + 1) * numVertsAround + x + 1);
    }
  }

  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices
  };
}
/**
 * Array of the indices of corners of each face of a cube.
 * @type {Array.<number[]>}
 * @private
 */


const CUBE_FACE_INDICES = [[3, 7, 5, 1], // right
[6, 2, 0, 4], // left
[6, 7, 3, 2], // ??
[0, 1, 5, 4], // ??
[7, 6, 4, 5], // front
[2, 3, 1, 0] // back
];
/**
 * Creates a BufferInfo for a cube.
 *
 * The cube is created around the origin. (-size / 2, size / 2).
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} [size] width, height and depth of the cube.
 * @return {module:twgl.BufferInfo} The created BufferInfo.
 * @memberOf module:twgl/primitives
 * @function createCubeBufferInfo
 */

/**
 * Creates the buffers and indices for a cube.
 *
 * The cube is created around the origin. (-size / 2, size / 2).
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} [size] width, height and depth of the cube.
 * @return {Object.<string, WebGLBuffer>} The created buffers.
 * @memberOf module:twgl/primitives
 * @function createCubeBuffers
 */

/**
 * Creates the vertices and indices for a cube.
 *
 * The cube is created around the origin. (-size / 2, size / 2).
 *
 * @param {number} [size] width, height and depth of the cube.
 * @return {Object.<string, TypedArray>} The created vertices.
 * @memberOf module:twgl/primitives
 */

function createCubeVertices(size) {
  size = size || 1;
  const k = size / 2;
  const cornerVertices = [[-k, -k, -k], [+k, -k, -k], [-k, +k, -k], [+k, +k, -k], [-k, -k, +k], [+k, -k, +k], [-k, +k, +k], [+k, +k, +k]];
  const faceNormals = [[+1, +0, +0], [-1, +0, +0], [+0, +1, +0], [+0, -1, +0], [+0, +0, +1], [+0, +0, -1]];
  const uvCoords = [[1, 0], [0, 0], [0, 1], [1, 1]];
  const numVertices = 6 * 4;
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals = createAugmentedTypedArray(3, numVertices);
  const texcoords = createAugmentedTypedArray(2, numVertices);
  const indices = createAugmentedTypedArray(3, 6 * 2, Uint16Array);

  for (let f = 0; f < 6; ++f) {
    const faceIndices = CUBE_FACE_INDICES[f];

    for (let v = 0; v < 4; ++v) {
      const position = cornerVertices[faceIndices[v]];
      const normal = faceNormals[f];
      const uv = uvCoords[v]; // Each face needs all four vertices because the normals and texture
      // coordinates are not all the same.

      positions.push(position);
      normals.push(normal);
      texcoords.push(uv);
    } // Two triangles make a square face.


    const offset = 4 * f;
    indices.push(offset + 0, offset + 1, offset + 2);
    indices.push(offset + 0, offset + 2, offset + 3);
  }

  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices
  };
}
/**
 * Creates a BufferInfo for a truncated cone, which is like a cylinder
 * except that it has different top and bottom radii. A truncated cone
 * can also be used to create cylinders and regular cones. The
 * truncated cone will be created centered about the origin, with the
 * y axis as its vertical axis.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} bottomRadius Bottom radius of truncated cone.
 * @param {number} topRadius Top radius of truncated cone.
 * @param {number} height Height of truncated cone.
 * @param {number} radialSubdivisions The number of subdivisions around the
 *     truncated cone.
 * @param {number} verticalSubdivisions The number of subdivisions down the
 *     truncated cone.
 * @param {boolean} [opt_topCap] Create top cap. Default = true.
 * @param {boolean} [opt_bottomCap] Create bottom cap. Default = true.
 * @return {module:twgl.BufferInfo} The created cone BufferInfo.
 * @memberOf module:twgl/primitives
 * @function createTruncatedConeBufferInfo
 */

/**
 * Creates buffers for a truncated cone, which is like a cylinder
 * except that it has different top and bottom radii. A truncated cone
 * can also be used to create cylinders and regular cones. The
 * truncated cone will be created centered about the origin, with the
 * y axis as its vertical axis.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} bottomRadius Bottom radius of truncated cone.
 * @param {number} topRadius Top radius of truncated cone.
 * @param {number} height Height of truncated cone.
 * @param {number} radialSubdivisions The number of subdivisions around the
 *     truncated cone.
 * @param {number} verticalSubdivisions The number of subdivisions down the
 *     truncated cone.
 * @param {boolean} [opt_topCap] Create top cap. Default = true.
 * @param {boolean} [opt_bottomCap] Create bottom cap. Default = true.
 * @return {Object.<string, WebGLBuffer>} The created cone buffers.
 * @memberOf module:twgl/primitives
 * @function createTruncatedConeBuffers
 */

/**
 * Creates vertices for a truncated cone, which is like a cylinder
 * except that it has different top and bottom radii. A truncated cone
 * can also be used to create cylinders and regular cones. The
 * truncated cone will be created centered about the origin, with the
 * y axis as its vertical axis. .
 *
 * @param {number} bottomRadius Bottom radius of truncated cone.
 * @param {number} topRadius Top radius of truncated cone.
 * @param {number} height Height of truncated cone.
 * @param {number} radialSubdivisions The number of subdivisions around the
 *     truncated cone.
 * @param {number} verticalSubdivisions The number of subdivisions down the
 *     truncated cone.
 * @param {boolean} [opt_topCap] Create top cap. Default = true.
 * @param {boolean} [opt_bottomCap] Create bottom cap. Default = true.
 * @return {Object.<string, TypedArray>} The created cone vertices.
 * @memberOf module:twgl/primitives
 */


function createTruncatedConeVertices(bottomRadius, topRadius, height, radialSubdivisions, verticalSubdivisions, opt_topCap, opt_bottomCap) {
  if (radialSubdivisions < 3) {
    throw new Error('radialSubdivisions must be 3 or greater');
  }

  if (verticalSubdivisions < 1) {
    throw new Error('verticalSubdivisions must be 1 or greater');
  }

  const topCap = opt_topCap === undefined ? true : opt_topCap;
  const bottomCap = opt_bottomCap === undefined ? true : opt_bottomCap;
  const extra = (topCap ? 2 : 0) + (bottomCap ? 2 : 0);
  const numVertices = (radialSubdivisions + 1) * (verticalSubdivisions + 1 + extra);
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals = createAugmentedTypedArray(3, numVertices);
  const texcoords = createAugmentedTypedArray(2, numVertices);
  const indices = createAugmentedTypedArray(3, radialSubdivisions * (verticalSubdivisions + extra / 2) * 2, Uint16Array);
  const vertsAroundEdge = radialSubdivisions + 1; // The slant of the cone is constant across its surface

  const slant = Math.atan2(bottomRadius - topRadius, height);
  const cosSlant = Math.cos(slant);
  const sinSlant = Math.sin(slant);
  const start = topCap ? -2 : 0;
  const end = verticalSubdivisions + (bottomCap ? 2 : 0);

  for (let yy = start; yy <= end; ++yy) {
    let v = yy / verticalSubdivisions;
    let y = height * v;
    let ringRadius;

    if (yy < 0) {
      y = 0;
      v = 1;
      ringRadius = bottomRadius;
    } else if (yy > verticalSubdivisions) {
      y = height;
      v = 1;
      ringRadius = topRadius;
    } else {
      ringRadius = bottomRadius + (topRadius - bottomRadius) * (yy / verticalSubdivisions);
    }

    if (yy === -2 || yy === verticalSubdivisions + 2) {
      ringRadius = 0;
      v = 0;
    }

    y -= height / 2;

    for (let ii = 0; ii < vertsAroundEdge; ++ii) {
      const sin = Math.sin(ii * Math.PI * 2 / radialSubdivisions);
      const cos = Math.cos(ii * Math.PI * 2 / radialSubdivisions);
      positions.push(sin * ringRadius, y, cos * ringRadius);

      if (yy < 0) {
        normals.push(0, -1, 0);
      } else if (yy > verticalSubdivisions) {
        normals.push(0, 1, 0);
      } else if (ringRadius === 0.0) {
        normals.push(0, 0, 0);
      } else {
        normals.push(sin * cosSlant, sinSlant, cos * cosSlant);
      }

      texcoords.push(ii / radialSubdivisions, 1 - v);
    }
  }

  for (let yy = 0; yy < verticalSubdivisions + extra; ++yy) {
    // eslint-disable-line
    if (yy === 1 && topCap || yy === verticalSubdivisions + extra - 2 && bottomCap) {
      continue;
    }

    for (let ii = 0; ii < radialSubdivisions; ++ii) {
      // eslint-disable-line
      indices.push(vertsAroundEdge * (yy + 0) + 0 + ii, vertsAroundEdge * (yy + 0) + 1 + ii, vertsAroundEdge * (yy + 1) + 1 + ii);
      indices.push(vertsAroundEdge * (yy + 0) + 0 + ii, vertsAroundEdge * (yy + 1) + 1 + ii, vertsAroundEdge * (yy + 1) + 0 + ii);
    }
  }

  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices
  };
}
/**
 * Expands RLE data
 * @param {number[]} rleData data in format of run-length, x, y, z, run-length, x, y, z
 * @param {number[]} [padding] value to add each entry with.
 * @return {number[]} the expanded rleData
 * @private
 */


function expandRLEData(rleData, padding) {
  padding = padding || [];
  const data = [];

  for (let ii = 0; ii < rleData.length; ii += 4) {
    const runLength = rleData[ii];
    const element = rleData.slice(ii + 1, ii + 4);
    element.push.apply(element, padding);

    for (let jj = 0; jj < runLength; ++jj) {
      data.push.apply(data, element);
    }
  }

  return data;
}
/**
 * Creates 3D 'F' BufferInfo.
 * An 'F' is useful because you can easily tell which way it is oriented.
 * The created 'F' has position, normal, texcoord, and color buffers.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @return {module:twgl.BufferInfo} The created BufferInfo.
 * @memberOf module:twgl/primitives
 * @function create3DFBufferInfo
 */

/**
 * Creates 3D 'F' buffers.
 * An 'F' is useful because you can easily tell which way it is oriented.
 * The created 'F' has position, normal, texcoord, and color buffers.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @return {Object.<string, WebGLBuffer>} The created buffers.
 * @memberOf module:twgl/primitives
 * @function create3DFBuffers
 */

/**
 * Creates 3D 'F' vertices.
 * An 'F' is useful because you can easily tell which way it is oriented.
 * The created 'F' has position, normal, texcoord, and color arrays.
 *
 * @return {Object.<string, TypedArray>} The created vertices.
 * @memberOf module:twgl/primitives
 */


function create3DFVertices() {
  const positions = [// left column front
  0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0, // top rung front
  30, 0, 0, 30, 30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0, // middle rung front
  30, 60, 0, 30, 90, 0, 67, 60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0, // left column back
  0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30, // top rung back
  30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30, // middle rung back
  30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30, // top
  0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30, // top rung front
  100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30, // under top rung
  30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0, // between top rung and middle
  30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30, // top of middle rung
  30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30, // front of middle rung
  67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30, // bottom of middle rung.
  30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0, // front of bottom
  30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150, 30, // bottom
  0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0, // left side
  0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0];
  const texcoords = [// left column front
  0.22, 0.19, 0.22, 0.79, 0.34, 0.19, 0.22, 0.79, 0.34, 0.79, 0.34, 0.19, // top rung front
  0.34, 0.19, 0.34, 0.31, 0.62, 0.19, 0.34, 0.31, 0.62, 0.31, 0.62, 0.19, // middle rung front
  0.34, 0.43, 0.34, 0.55, 0.49, 0.43, 0.34, 0.55, 0.49, 0.55, 0.49, 0.43, // left column back
  0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, // top rung back
  0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, // middle rung back
  0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, // top
  0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, // top rung front
  0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, // under top rung
  0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, // between top rung and middle
  0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, // top of middle rung
  0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, // front of middle rung
  0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, // bottom of middle rung.
  0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, // front of bottom
  0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, // bottom
  0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, // left side
  0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0];
  const normals = expandRLEData([// left column front
  // top rung front
  // middle rung front
  18, 0, 0, 1, // left column back
  // top rung back
  // middle rung back
  18, 0, 0, -1, // top
  6, 0, 1, 0, // top rung front
  6, 1, 0, 0, // under top rung
  6, 0, -1, 0, // between top rung and middle
  6, 1, 0, 0, // top of middle rung
  6, 0, 1, 0, // front of middle rung
  6, 1, 0, 0, // bottom of middle rung.
  6, 0, -1, 0, // front of bottom
  6, 1, 0, 0, // bottom
  6, 0, -1, 0, // left side
  6, -1, 0, 0]);
  const colors = expandRLEData([// left column front
  // top rung front
  // middle rung front
  18, 200, 70, 120, // left column back
  // top rung back
  // middle rung back
  18, 80, 70, 200, // top
  6, 70, 200, 210, // top rung front
  6, 200, 200, 70, // under top rung
  6, 210, 100, 70, // between top rung and middle
  6, 210, 160, 70, // top of middle rung
  6, 70, 180, 210, // front of middle rung
  6, 100, 70, 210, // bottom of middle rung.
  6, 76, 210, 100, // front of bottom
  6, 140, 210, 80, // bottom
  6, 90, 130, 110, // left side
  6, 160, 160, 220], [255]);
  const numVerts = positions.length / 3;
  const arrays = {
    position: createAugmentedTypedArray(3, numVerts),
    texcoord: createAugmentedTypedArray(2, numVerts),
    normal: createAugmentedTypedArray(3, numVerts),
    color: createAugmentedTypedArray(4, numVerts, Uint8Array),
    indices: createAugmentedTypedArray(3, numVerts / 3, Uint16Array)
  };
  arrays.position.push(positions);
  arrays.texcoord.push(texcoords);
  arrays.normal.push(normals);
  arrays.color.push(colors);

  for (let ii = 0; ii < numVerts; ++ii) {
    arrays.indices.push(ii);
  }

  return arrays;
}
/**
 * Creates crescent BufferInfo.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} verticalRadius The vertical radius of the crescent.
 * @param {number} outerRadius The outer radius of the crescent.
 * @param {number} innerRadius The inner radius of the crescent.
 * @param {number} thickness The thickness of the crescent.
 * @param {number} subdivisionsDown number of steps around the crescent.
 * @param {number} [startOffset] Where to start arc. Default 0.
 * @param {number} [endOffset] Where to end arg. Default 1.
 * @return {module:twgl.BufferInfo} The created BufferInfo.
 * @memberOf module:twgl/primitives
 * @function createCresentBufferInfo
 */

/**
 * Creates crescent buffers.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} verticalRadius The vertical radius of the crescent.
 * @param {number} outerRadius The outer radius of the crescent.
 * @param {number} innerRadius The inner radius of the crescent.
 * @param {number} thickness The thickness of the crescent.
 * @param {number} subdivisionsDown number of steps around the crescent.
 * @param {number} [startOffset] Where to start arc. Default 0.
 * @param {number} [endOffset] Where to end arg. Default 1.
 * @return {Object.<string, WebGLBuffer>} The created buffers.
 * @memberOf module:twgl/primitives
 * @function createCresentBuffers
 */

/**
 * Creates crescent vertices.
 *
 * @param {number} verticalRadius The vertical radius of the crescent.
 * @param {number} outerRadius The outer radius of the crescent.
 * @param {number} innerRadius The inner radius of the crescent.
 * @param {number} thickness The thickness of the crescent.
 * @param {number} subdivisionsDown number of steps around the crescent.
 * @param {number} [startOffset] Where to start arc. Default 0.
 * @param {number} [endOffset] Where to end arg. Default 1.
 * @return {Object.<string, TypedArray>} The created vertices.
 * @memberOf module:twgl/primitives
 * @function createCresentBuffers
 */

/**
 * Creates crescent BufferInfo.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} verticalRadius The vertical radius of the crescent.
 * @param {number} outerRadius The outer radius of the crescent.
 * @param {number} innerRadius The inner radius of the crescent.
 * @param {number} thickness The thickness of the crescent.
 * @param {number} subdivisionsDown number of steps around the crescent.
 * @param {number} [startOffset] Where to start arc. Default 0.
 * @param {number} [endOffset] Where to end arg. Default 1.
 * @return {module:twgl.BufferInfo} The created BufferInfo.
 * @memberOf module:twgl/primitives
 * @function createCrescentBufferInfo
 */

/**
 * Creates crescent buffers.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} verticalRadius The vertical radius of the crescent.
 * @param {number} outerRadius The outer radius of the crescent.
 * @param {number} innerRadius The inner radius of the crescent.
 * @param {number} thickness The thickness of the crescent.
 * @param {number} subdivisionsDown number of steps around the crescent.
 * @param {number} [startOffset] Where to start arc. Default 0.
 * @param {number} [endOffset] Where to end arg. Default 1.
 * @return {Object.<string, WebGLBuffer>} The created buffers.
 * @memberOf module:twgl/primitives
 * @function createCrescentBuffers
 */

/**
 * Creates crescent vertices.
 *
 * @param {number} verticalRadius The vertical radius of the crescent.
 * @param {number} outerRadius The outer radius of the crescent.
 * @param {number} innerRadius The inner radius of the crescent.
 * @param {number} thickness The thickness of the crescent.
 * @param {number} subdivisionsDown number of steps around the crescent.
 * @param {number} [startOffset] Where to start arc. Default 0.
 * @param {number} [endOffset] Where to end arg. Default 1.
 * @return {Object.<string, TypedArray>} The created vertices.
 * @memberOf module:twgl/primitives
 */


function createCrescentVertices(verticalRadius, outerRadius, innerRadius, thickness, subdivisionsDown, startOffset, endOffset) {
  if (subdivisionsDown <= 0) {
    throw new Error('subdivisionDown must be > 0');
  }

  startOffset = startOffset || 0;
  endOffset = endOffset || 1;
  const subdivisionsThick = 2;
  const offsetRange = endOffset - startOffset;
  const numVertices = (subdivisionsDown + 1) * 2 * (2 + subdivisionsThick);
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals = createAugmentedTypedArray(3, numVertices);
  const texcoords = createAugmentedTypedArray(2, numVertices);

  function lerp(a, b, s) {
    return a + (b - a) * s;
  }

  function createArc(arcRadius, x, normalMult, normalAdd, uMult, uAdd) {
    for (let z = 0; z <= subdivisionsDown; z++) {
      const uBack = x / (subdivisionsThick - 1);
      const v = z / subdivisionsDown;
      const xBack = (uBack - 0.5) * 2;
      const angle = (startOffset + v * offsetRange) * Math.PI;
      const s = Math.sin(angle);
      const c = Math.cos(angle);
      const radius = lerp(verticalRadius, arcRadius, s);
      const px = xBack * thickness;
      const py = c * verticalRadius;
      const pz = s * radius;
      positions.push(px, py, pz);
      const n = add(multiply([0, s, c], normalMult), normalAdd);
      normals.push(n);
      texcoords.push(uBack * uMult + uAdd, v);
    }
  } // Generate the individual vertices in our vertex buffer.


  for (let x = 0; x < subdivisionsThick; x++) {
    const uBack = (x / (subdivisionsThick - 1) - 0.5) * 2;
    createArc(outerRadius, x, [1, 1, 1], [0, 0, 0], 1, 0);
    createArc(outerRadius, x, [0, 0, 0], [uBack, 0, 0], 0, 0);
    createArc(innerRadius, x, [1, 1, 1], [0, 0, 0], 1, 0);
    createArc(innerRadius, x, [0, 0, 0], [uBack, 0, 0], 0, 1);
  } // Do outer surface.


  const indices = createAugmentedTypedArray(3, subdivisionsDown * 2 * (2 + subdivisionsThick), Uint16Array);

  function createSurface(leftArcOffset, rightArcOffset) {
    for (let z = 0; z < subdivisionsDown; ++z) {
      // Make triangle 1 of quad.
      indices.push(leftArcOffset + z + 0, leftArcOffset + z + 1, rightArcOffset + z + 0); // Make triangle 2 of quad.

      indices.push(leftArcOffset + z + 1, rightArcOffset + z + 1, rightArcOffset + z + 0);
    }
  }

  const numVerticesDown = subdivisionsDown + 1; // front

  createSurface(numVerticesDown * 0, numVerticesDown * 4); // right

  createSurface(numVerticesDown * 5, numVerticesDown * 7); // back

  createSurface(numVerticesDown * 6, numVerticesDown * 2); // left

  createSurface(numVerticesDown * 3, numVerticesDown * 1);
  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices
  };
}
/**
 * Creates cylinder BufferInfo. The cylinder will be created around the origin
 * along the y-axis.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} radius Radius of cylinder.
 * @param {number} height Height of cylinder.
 * @param {number} radialSubdivisions The number of subdivisions around the cylinder.
 * @param {number} verticalSubdivisions The number of subdivisions down the cylinder.
 * @param {boolean} [topCap] Create top cap. Default = true.
 * @param {boolean} [bottomCap] Create bottom cap. Default = true.
 * @return {module:twgl.BufferInfo} The created BufferInfo.
 * @memberOf module:twgl/primitives
 * @function createCylinderBufferInfo
 */

/**
 * Creates cylinder buffers. The cylinder will be created around the origin
 * along the y-axis.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} radius Radius of cylinder.
 * @param {number} height Height of cylinder.
 * @param {number} radialSubdivisions The number of subdivisions around the cylinder.
 * @param {number} verticalSubdivisions The number of subdivisions down the cylinder.
 * @param {boolean} [topCap] Create top cap. Default = true.
 * @param {boolean} [bottomCap] Create bottom cap. Default = true.
 * @return {Object.<string, WebGLBuffer>} The created buffers.
 * @memberOf module:twgl/primitives
 * @function createCylinderBuffers
 */

/**
 * Creates cylinder vertices. The cylinder will be created around the origin
 * along the y-axis.
 *
 * @param {number} radius Radius of cylinder.
 * @param {number} height Height of cylinder.
 * @param {number} radialSubdivisions The number of subdivisions around the cylinder.
 * @param {number} verticalSubdivisions The number of subdivisions down the cylinder.
 * @param {boolean} [topCap] Create top cap. Default = true.
 * @param {boolean} [bottomCap] Create bottom cap. Default = true.
 * @return {Object.<string, TypedArray>} The created vertices.
 * @memberOf module:twgl/primitives
 */


function createCylinderVertices(radius, height, radialSubdivisions, verticalSubdivisions, topCap, bottomCap) {
  return createTruncatedConeVertices(radius, radius, height, radialSubdivisions, verticalSubdivisions, topCap, bottomCap);
}
/**
 * Creates BufferInfo for a torus
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} radius radius of center of torus circle.
 * @param {number} thickness radius of torus ring.
 * @param {number} radialSubdivisions The number of subdivisions around the torus.
 * @param {number} bodySubdivisions The number of subdivisions around the body torus.
 * @param {boolean} [startAngle] start angle in radians. Default = 0.
 * @param {boolean} [endAngle] end angle in radians. Default = Math.PI * 2.
 * @return {module:twgl.BufferInfo} The created BufferInfo.
 * @memberOf module:twgl/primitives
 * @function createTorusBufferInfo
 */

/**
 * Creates buffers for a torus
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} radius radius of center of torus circle.
 * @param {number} thickness radius of torus ring.
 * @param {number} radialSubdivisions The number of subdivisions around the torus.
 * @param {number} bodySubdivisions The number of subdivisions around the body torus.
 * @param {boolean} [startAngle] start angle in radians. Default = 0.
 * @param {boolean} [endAngle] end angle in radians. Default = Math.PI * 2.
 * @return {Object.<string, WebGLBuffer>} The created buffers.
 * @memberOf module:twgl/primitives
 * @function createTorusBuffers
 */

/**
 * Creates vertices for a torus
 *
 * @param {number} radius radius of center of torus circle.
 * @param {number} thickness radius of torus ring.
 * @param {number} radialSubdivisions The number of subdivisions around the torus.
 * @param {number} bodySubdivisions The number of subdivisions around the body torus.
 * @param {boolean} [startAngle] start angle in radians. Default = 0.
 * @param {boolean} [endAngle] end angle in radians. Default = Math.PI * 2.
 * @return {Object.<string, TypedArray>} The created vertices.
 * @memberOf module:twgl/primitives
 */


function createTorusVertices(radius, thickness, radialSubdivisions, bodySubdivisions, startAngle, endAngle) {
  if (radialSubdivisions < 3) {
    throw new Error('radialSubdivisions must be 3 or greater');
  }

  if (bodySubdivisions < 3) {
    throw new Error('verticalSubdivisions must be 3 or greater');
  }

  startAngle = startAngle || 0;
  endAngle = endAngle || Math.PI * 2;
  const range = endAngle - startAngle;
  const radialParts = radialSubdivisions + 1;
  const bodyParts = bodySubdivisions + 1;
  const numVertices = radialParts * bodyParts;
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals = createAugmentedTypedArray(3, numVertices);
  const texcoords = createAugmentedTypedArray(2, numVertices);
  const indices = createAugmentedTypedArray(3, radialSubdivisions * bodySubdivisions * 2, Uint16Array);

  for (let slice = 0; slice < bodyParts; ++slice) {
    const v = slice / bodySubdivisions;
    const sliceAngle = v * Math.PI * 2;
    const sliceSin = Math.sin(sliceAngle);
    const ringRadius = radius + sliceSin * thickness;
    const ny = Math.cos(sliceAngle);
    const y = ny * thickness;

    for (let ring = 0; ring < radialParts; ++ring) {
      const u = ring / radialSubdivisions;
      const ringAngle = startAngle + u * range;
      const xSin = Math.sin(ringAngle);
      const zCos = Math.cos(ringAngle);
      const x = xSin * ringRadius;
      const z = zCos * ringRadius;
      const nx = xSin * sliceSin;
      const nz = zCos * sliceSin;
      positions.push(x, y, z);
      normals.push(nx, ny, nz);
      texcoords.push(u, 1 - v);
    }
  }

  for (let slice = 0; slice < bodySubdivisions; ++slice) {
    // eslint-disable-line
    for (let ring = 0; ring < radialSubdivisions; ++ring) {
      // eslint-disable-line
      const nextRingIndex = 1 + ring;
      const nextSliceIndex = 1 + slice;
      indices.push(radialParts * slice + ring, radialParts * nextSliceIndex + ring, radialParts * slice + nextRingIndex);
      indices.push(radialParts * nextSliceIndex + ring, radialParts * nextSliceIndex + nextRingIndex, radialParts * slice + nextRingIndex);
    }
  }

  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices
  };
}
/**
 * Creates a disc BufferInfo. The disc will be in the xz plane, centered at
 * the origin. When creating, at least 3 divisions, or pie
 * pieces, need to be specified, otherwise the triangles making
 * up the disc will be degenerate. You can also specify the
 * number of radial pieces `stacks`. A value of 1 for
 * stacks will give you a simple disc of pie pieces.  If you
 * want to create an annulus you can set `innerRadius` to a
 * value > 0. Finally, `stackPower` allows you to have the widths
 * increase or decrease as you move away from the center. This
 * is particularly useful when using the disc as a ground plane
 * with a fixed camera such that you don't need the resolution
 * of small triangles near the perimeter. For example, a value
 * of 2 will produce stacks whose outside radius increases with
 * the square of the stack index. A value of 1 will give uniform
 * stacks.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} radius Radius of the ground plane.
 * @param {number} divisions Number of triangles in the ground plane (at least 3).
 * @param {number} [stacks] Number of radial divisions (default=1).
 * @param {number} [innerRadius] Default 0.
 * @param {number} [stackPower] Power to raise stack size to for decreasing width.
 * @return {module:twgl.BufferInfo} The created BufferInfo.
 * @memberOf module:twgl/primitives
 * @function createDiscBufferInfo
 */

/**
 * Creates disc buffers. The disc will be in the xz plane, centered at
 * the origin. When creating, at least 3 divisions, or pie
 * pieces, need to be specified, otherwise the triangles making
 * up the disc will be degenerate. You can also specify the
 * number of radial pieces `stacks`. A value of 1 for
 * stacks will give you a simple disc of pie pieces.  If you
 * want to create an annulus you can set `innerRadius` to a
 * value > 0. Finally, `stackPower` allows you to have the widths
 * increase or decrease as you move away from the center. This
 * is particularly useful when using the disc as a ground plane
 * with a fixed camera such that you don't need the resolution
 * of small triangles near the perimeter. For example, a value
 * of 2 will produce stacks whose outside radius increases with
 * the square of the stack index. A value of 1 will give uniform
 * stacks.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
 * @param {number} radius Radius of the ground plane.
 * @param {number} divisions Number of triangles in the ground plane (at least 3).
 * @param {number} [stacks] Number of radial divisions (default=1).
 * @param {number} [innerRadius] Default 0.
 * @param {number} [stackPower] Power to raise stack size to for decreasing width.
 * @return {Object.<string, WebGLBuffer>} The created buffers.
 * @memberOf module:twgl/primitives
 * @function createDiscBuffers
 */

/**
 * Creates disc vertices. The disc will be in the xz plane, centered at
 * the origin. When creating, at least 3 divisions, or pie
 * pieces, need to be specified, otherwise the triangles making
 * up the disc will be degenerate. You can also specify the
 * number of radial pieces `stacks`. A value of 1 for
 * stacks will give you a simple disc of pie pieces.  If you
 * want to create an annulus you can set `innerRadius` to a
 * value > 0. Finally, `stackPower` allows you to have the widths
 * increase or decrease as you move away from the center. This
 * is particularly useful when using the disc as a ground plane
 * with a fixed camera such that you don't need the resolution
 * of small triangles near the perimeter. For example, a value
 * of 2 will produce stacks whose outside radius increases with
 * the square of the stack index. A value of 1 will give uniform
 * stacks.
 *
 * @param {number} radius Radius of the ground plane.
 * @param {number} divisions Number of triangles in the ground plane (at least 3).
 * @param {number} [stacks] Number of radial divisions (default=1).
 * @param {number} [innerRadius] Default 0.
 * @param {number} [stackPower] Power to raise stack size to for decreasing width.
 * @return {Object.<string, TypedArray>} The created vertices.
 * @memberOf module:twgl/primitives
 */


function createDiscVertices(radius, divisions, stacks, innerRadius, stackPower) {
  if (divisions < 3) {
    throw new Error('divisions must be at least 3');
  }

  stacks = stacks ? stacks : 1;
  stackPower = stackPower ? stackPower : 1;
  innerRadius = innerRadius ? innerRadius : 0; // Note: We don't share the center vertex because that would
  // mess up texture coordinates.

  const numVertices = (divisions + 1) * (stacks + 1);
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals = createAugmentedTypedArray(3, numVertices);
  const texcoords = createAugmentedTypedArray(2, numVertices);
  const indices = createAugmentedTypedArray(3, stacks * divisions * 2, Uint16Array);
  let firstIndex = 0;
  const radiusSpan = radius - innerRadius;
  const pointsPerStack = divisions + 1; // Build the disk one stack at a time.

  for (let stack = 0; stack <= stacks; ++stack) {
    const stackRadius = innerRadius + radiusSpan * Math.pow(stack / stacks, stackPower);

    for (let i = 0; i <= divisions; ++i) {
      const theta = 2.0 * Math.PI * i / divisions;
      const x = stackRadius * Math.cos(theta);
      const z = stackRadius * Math.sin(theta);
      positions.push(x, 0, z);
      normals.push(0, 1, 0);
      texcoords.push(1 - i / divisions, stack / stacks);

      if (stack > 0 && i !== divisions) {
        // a, b, c and d are the indices of the vertices of a quad.  unless
        // the current stack is the one closest to the center, in which case
        // the vertices a and b connect to the center vertex.
        const a = firstIndex + (i + 1);
        const b = firstIndex + i;
        const c = firstIndex + i - pointsPerStack;
        const d = firstIndex + (i + 1) - pointsPerStack; // Make a quad of the vertices a, b, c, d.

        indices.push(a, b, c);
        indices.push(a, c, d);
      }
    }

    firstIndex += divisions + 1;
  }

  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices
  };
}
/**
 * creates a random integer between 0 and range - 1 inclusive.
 * @param {number} range
 * @return {number} random value between 0 and range - 1 inclusive.
 * @private
 */


function randInt(range) {
  return Math.random() * range | 0;
}
/**
 * Used to supply random colors
 * @callback RandomColorFunc
 * @param {number} ndx index of triangle/quad if unindexed or index of vertex if indexed
 * @param {number} channel 0 = red, 1 = green, 2 = blue, 3 = alpha
 * @return {number} a number from 0 to 255
 * @memberOf module:twgl/primitives
 */

/**
 * @typedef {Object} RandomVerticesOptions
 * @property {number} [vertsPerColor] Defaults to 3 for non-indexed vertices
 * @property {module:twgl/primitives.RandomColorFunc} [rand] A function to generate random numbers
 * @memberOf module:twgl/primitives
 */

/**
 * Creates an augmentedTypedArray of random vertex colors.
 * If the vertices are indexed (have an indices array) then will
 * just make random colors. Otherwise assumes they are triangles
 * and makes one random color for every 3 vertices.
 * @param {Object.<string, AugmentedTypedArray>} vertices Vertices as returned from one of the createXXXVertices functions.
 * @param {module:twgl/primitives.RandomVerticesOptions} [options] options.
 * @return {Object.<string, AugmentedTypedArray>} same vertices as passed in with `color` added.
 * @memberOf module:twgl/primitives
 */


function makeRandomVertexColors(vertices, options) {
  options = options || {};
  const numElements = vertices.position.numElements;
  const vColors = createAugmentedTypedArray(4, numElements, Uint8Array);

  const rand = options.rand || function (ndx, channel) {
    return channel < 3 ? randInt(256) : 255;
  };

  vertices.color = vColors;

  if (vertices.indices) {
    // just make random colors if index
    for (let ii = 0; ii < numElements; ++ii) {
      vColors.push(rand(ii, 0), rand(ii, 1), rand(ii, 2), rand(ii, 3));
    }
  } else {
    // make random colors per triangle
    const numVertsPerColor = options.vertsPerColor || 3;
    const numSets = numElements / numVertsPerColor;

    for (let ii = 0; ii < numSets; ++ii) {
      // eslint-disable-line
      const color = [rand(ii, 0), rand(ii, 1), rand(ii, 2), rand(ii, 3)];

      for (let jj = 0; jj < numVertsPerColor; ++jj) {
        vColors.push(color);
      }
    }
  }

  return vertices;
}
/**
 * creates a function that calls fn to create vertices and then
 * creates a buffers for them
 * @private
 */


function createBufferFunc(fn) {
  return function (gl) {
    const arrays = fn.apply(this, Array.prototype.slice.call(arguments, 1));
    return createBuffersFromArrays(gl, arrays);
  };
}
/**
 * creates a function that calls fn to create vertices and then
 * creates a bufferInfo object for them
 * @private
 */


function createBufferInfoFunc(fn) {
  return function (gl) {
    const arrays = fn.apply(null, Array.prototype.slice.call(arguments, 1));
    return createBufferInfoFromArrays(gl, arrays);
  };
}

const arraySpecPropertyNames = ["numComponents", "size", "type", "normalize", "stride", "offset", "attrib", "name", "attribName"];
/**
 * Copy elements from one array to another
 *
 * @param {Array|TypedArray} src source array
 * @param {Array|TypedArray} dst dest array
 * @param {number} dstNdx index in dest to copy src
 * @param {number} [offset] offset to add to copied values
 * @private
 */

function copyElements(src, dst, dstNdx, offset) {
  offset = offset || 0;
  const length = src.length;

  for (let ii = 0; ii < length; ++ii) {
    dst[dstNdx + ii] = src[ii] + offset;
  }
}
/**
 * Creates an array of the same time
 *
 * @param {(number[]|ArrayBufferView|module:twgl.FullArraySpec)} srcArray array who's type to copy
 * @param {number} length size of new array
 * @return {(number[]|ArrayBufferView|module:twgl.FullArraySpec)} array with same type as srcArray
 * @private
 */


function createArrayOfSameType(srcArray, length) {
  const arraySrc = getArray$1(srcArray);
  const newArray = new arraySrc.constructor(length);
  let newArraySpec = newArray; // If it appears to have been augmented make new one augmented

  if (arraySrc.numComponents && arraySrc.numElements) {
    augmentTypedArray(newArray, arraySrc.numComponents);
  } // If it was a full spec make new one a full spec


  if (srcArray.data) {
    newArraySpec = {
      data: newArray
    };
    copyNamedProperties(arraySpecPropertyNames, srcArray, newArraySpec);
  }

  return newArraySpec;
}
/**
 * Concatenates sets of vertices
 *
 * Assumes the vertices match in composition. For example
 * if one set of vertices has positions, normals, and indices
 * all sets of vertices must have positions, normals, and indices
 * and of the same type.
 *
 * Example:
 *
 *      const cubeVertices = twgl.primitives.createCubeVertices(2);
 *      const sphereVertices = twgl.primitives.createSphereVertices(1, 10, 10);
 *      // move the sphere 2 units up
 *      twgl.primitives.reorientVertices(
 *          sphereVertices, twgl.m4.translation([0, 2, 0]));
 *      // merge the sphere with the cube
 *      const cubeSphereVertices = twgl.primitives.concatVertices(
 *          [cubeVertices, sphereVertices]);
 *      // turn them into WebGL buffers and attrib data
 *      const bufferInfo = twgl.createBufferInfoFromArrays(gl, cubeSphereVertices);
 *
 * @param {module:twgl.Arrays[]} arrays Array of arrays of vertices
 * @return {module:twgl.Arrays} The concatenated vertices.
 * @memberOf module:twgl/primitives
 */


function concatVertices(arrayOfArrays) {
  const names = {};
  let baseName; // get names of all arrays.
  // and numElements for each set of vertices

  for (let ii = 0; ii < arrayOfArrays.length; ++ii) {
    const arrays = arrayOfArrays[ii];
    Object.keys(arrays).forEach(function (name) {
      // eslint-disable-line
      if (!names[name]) {
        names[name] = [];
      }

      if (!baseName && name !== 'indices') {
        baseName = name;
      }

      const arrayInfo = arrays[name];
      const numComponents = getNumComponents$1(arrayInfo, name);
      const array = getArray$1(arrayInfo);
      const numElements = array.length / numComponents;
      names[name].push(numElements);
    });
  } // compute length of combined array
  // and return one for reference


  function getLengthOfCombinedArrays(name) {
    let length = 0;
    let arraySpec;

    for (let ii = 0; ii < arrayOfArrays.length; ++ii) {
      const arrays = arrayOfArrays[ii];
      const arrayInfo = arrays[name];
      const array = getArray$1(arrayInfo);
      length += array.length;

      if (!arraySpec || arrayInfo.data) {
        arraySpec = arrayInfo;
      }
    }

    return {
      length: length,
      spec: arraySpec
    };
  }

  function copyArraysToNewArray(name, base, newArray) {
    let baseIndex = 0;
    let offset = 0;

    for (let ii = 0; ii < arrayOfArrays.length; ++ii) {
      const arrays = arrayOfArrays[ii];
      const arrayInfo = arrays[name];
      const array = getArray$1(arrayInfo);

      if (name === 'indices') {
        copyElements(array, newArray, offset, baseIndex);
        baseIndex += base[ii];
      } else {
        copyElements(array, newArray, offset);
      }

      offset += array.length;
    }
  }

  const base = names[baseName];
  const newArrays = {};
  Object.keys(names).forEach(function (name) {
    const info = getLengthOfCombinedArrays(name);
    const newArraySpec = createArrayOfSameType(info.spec, info.length);
    copyArraysToNewArray(name, base, getArray$1(newArraySpec));
    newArrays[name] = newArraySpec;
  });
  return newArrays;
}
/**
 * Creates a duplicate set of vertices
 *
 * This is useful for calling reorientVertices when you
 * also want to keep the original available
 *
 * @param {module:twgl.Arrays} arrays of vertices
 * @return {module:twgl.Arrays} The duplicated vertices.
 * @memberOf module:twgl/primitives
 */


function duplicateVertices(arrays) {
  const newArrays = {};
  Object.keys(arrays).forEach(function (name) {
    const arraySpec = arrays[name];
    const srcArray = getArray$1(arraySpec);
    const newArraySpec = createArrayOfSameType(arraySpec, srcArray.length);
    copyElements(srcArray, getArray$1(newArraySpec), 0);
    newArrays[name] = newArraySpec;
  });
  return newArrays;
}

const create3DFBufferInfo = createBufferInfoFunc(create3DFVertices);
const create3DFBuffers = createBufferFunc(create3DFVertices);
const createCubeBufferInfo = createBufferInfoFunc(createCubeVertices);
const createCubeBuffers = createBufferFunc(createCubeVertices);
const createPlaneBufferInfo = createBufferInfoFunc(createPlaneVertices);
const createPlaneBuffers = createBufferFunc(createPlaneVertices);
const createSphereBufferInfo = createBufferInfoFunc(createSphereVertices);
const createSphereBuffers = createBufferFunc(createSphereVertices);
const createTruncatedConeBufferInfo = createBufferInfoFunc(createTruncatedConeVertices);
const createTruncatedConeBuffers = createBufferFunc(createTruncatedConeVertices);
const createXYQuadBufferInfo = createBufferInfoFunc(createXYQuadVertices);
const createXYQuadBuffers = createBufferFunc(createXYQuadVertices);
const createCrescentBufferInfo = createBufferInfoFunc(createCrescentVertices);
const createCrescentBuffers = createBufferFunc(createCrescentVertices);
const createCylinderBufferInfo = createBufferInfoFunc(createCylinderVertices);
const createCylinderBuffers = createBufferFunc(createCylinderVertices);
const createTorusBufferInfo = createBufferInfoFunc(createTorusVertices);
const createTorusBuffers = createBufferFunc(createTorusVertices);
const createDiscBufferInfo = createBufferInfoFunc(createDiscVertices);
const createDiscBuffers = createBufferFunc(createDiscVertices); // these were mis-spelled until 4.12

const createCresentBufferInfo = createCrescentBufferInfo;
const createCresentBuffers = createCrescentBuffers;
const createCresentVertices = createCrescentVertices;
var primitives = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create3DFBufferInfo: create3DFBufferInfo,
  create3DFBuffers: create3DFBuffers,
  create3DFVertices: create3DFVertices,
  createAugmentedTypedArray: createAugmentedTypedArray,
  createCubeBufferInfo: createCubeBufferInfo,
  createCubeBuffers: createCubeBuffers,
  createCubeVertices: createCubeVertices,
  createPlaneBufferInfo: createPlaneBufferInfo,
  createPlaneBuffers: createPlaneBuffers,
  createPlaneVertices: createPlaneVertices,
  createSphereBufferInfo: createSphereBufferInfo,
  createSphereBuffers: createSphereBuffers,
  createSphereVertices: createSphereVertices,
  createTruncatedConeBufferInfo: createTruncatedConeBufferInfo,
  createTruncatedConeBuffers: createTruncatedConeBuffers,
  createTruncatedConeVertices: createTruncatedConeVertices,
  createXYQuadBufferInfo: createXYQuadBufferInfo,
  createXYQuadBuffers: createXYQuadBuffers,
  createXYQuadVertices: createXYQuadVertices,
  createCresentBufferInfo: createCresentBufferInfo,
  createCresentBuffers: createCresentBuffers,
  createCresentVertices: createCresentVertices,
  createCrescentBufferInfo: createCrescentBufferInfo,
  createCrescentBuffers: createCrescentBuffers,
  createCrescentVertices: createCrescentVertices,
  createCylinderBufferInfo: createCylinderBufferInfo,
  createCylinderBuffers: createCylinderBuffers,
  createCylinderVertices: createCylinderVertices,
  createTorusBufferInfo: createTorusBufferInfo,
  createTorusBuffers: createTorusBuffers,
  createTorusVertices: createTorusVertices,
  createDiscBufferInfo: createDiscBufferInfo,
  createDiscBuffers: createDiscBuffers,
  createDiscVertices: createDiscVertices,
  deindexVertices: deindexVertices,
  flattenNormals: flattenNormals,
  makeRandomVertexColors: makeRandomVertexColors,
  reorientDirections: reorientDirections,
  reorientNormals: reorientNormals,
  reorientPositions: reorientPositions,
  reorientVertices: reorientVertices,
  concatVertices: concatVertices,
  duplicateVertices: duplicateVertices
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * Gets the gl version as a number
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @return {number} version of gl
 * @private
 */
//function getVersionAsNumber(gl) {
//  return parseFloat(gl.getParameter(gl.VERSION).substr(6));
//}

/**
 * Check if context is WebGL 2.0
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @return {bool} true if it's WebGL 2.0
 * @memberOf module:twgl
 */

exports.primitives = primitives;

function isWebGL2(gl) {
  // This is the correct check but it's slow
  //  return gl.getParameter(gl.VERSION).indexOf("WebGL 2.0") === 0;
  // This might also be the correct check but I'm assuming it's slow-ish
  // return gl instanceof WebGL2RenderingContext;
  return !!gl.texStorage2D;
}
/**
 * Check if context is WebGL 1.0
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @return {bool} true if it's WebGL 1.0
 * @memberOf module:twgl
 */


function isWebGL1(gl) {
  // This is the correct check but it's slow
  // const version = getVersionAsNumber(gl);
  // return version <= 1.0 && version > 0.0;  // because as of 2016/5 Edge returns 0.96
  // This might also be the correct check but I'm assuming it's slow-ish
  // return gl instanceof WebGLRenderingContext;
  return !gl.texStorage2D;
}
/**
 * Gets a string for WebGL enum
 *
 * Note: Several enums are the same. Without more
 * context (which function) it's impossible to always
 * give the correct enum. As it is, for matching values
 * it gives all enums. Checking the WebGL2RenderingContext
 * that means
 *
 *      0     = ZERO | POINT | NONE | NO_ERROR
 *      1     = ONE | LINES | SYNC_FLUSH_COMMANDS_BIT
 *      32777 = BLEND_EQUATION_RGB | BLEND_EQUATION_RGB
 *      36662 = COPY_READ_BUFFER | COPY_READ_BUFFER_BINDING
 *      36663 = COPY_WRITE_BUFFER | COPY_WRITE_BUFFER_BINDING
 *      36006 = FRAMEBUFFER_BINDING | DRAW_FRAMEBUFFER_BINDING
 *
 * It's also not useful for bits really unless you pass in individual bits.
 * In other words
 *
 *     const bits = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT;
 *     twgl.glEnumToString(gl, bits);  // not going to work
 *
 * Note that some enums only exist on extensions. If you
 * want them to show up you need to pass the extension at least
 * once. For example
 *
 *     const ext = gl.getExtension('WEBGL_compressed_texture_s3tc');
 *     if (ext) {
 *        twgl.glEnumToString(ext, 0);  // just prime the function
 *
 *        ..later..
 *
 *        const internalFormat = ext.COMPRESSED_RGB_S3TC_DXT1_EXT;
 *        console.log(twgl.glEnumToString(gl, internalFormat));
 *
 * Notice I didn't have to pass the extension the second time. This means
 * you can have place that generically gets an enum for texture formats for example.
 * and as long as you primed the function with the extensions
 *
 * If you're using `twgl.addExtensionsToContext` to enable your extensions
 * then twgl will automatically get the extension's enums.
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext or any extension object
 * @param {number} value the value of the enum you want to look up.
 * @return {string} enum string or hex value
 * @memberOf module:twgl
 * @function glEnumToString
 */


const glEnumToString = function () {
  const haveEnumsForType = {};
  const enums = {};

  function addEnums(gl) {
    const type = gl.constructor.name;

    if (!haveEnumsForType[type]) {
      for (const key in gl) {
        if (typeof gl[key] === 'number') {
          const existing = enums[gl[key]];
          enums[gl[key]] = existing ? `${existing} | ${key}` : key;
        }
      }

      haveEnumsForType[type] = true;
    }
  }

  return function glEnumToString(gl, value) {
    addEnums(gl);
    return enums[value] || (typeof value === 'number' ? `0x${value.toString(16)}` : value);
  };
}();

exports.glEnumToString = glEnumToString;
var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  glEnumToString: glEnumToString,
  isWebGL1: isWebGL1,
  isWebGL2: isWebGL2
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

exports.utils = utils;
const defaults$1 = {
  textureColor: new Uint8Array([128, 192, 255, 255]),
  textureOptions: {},
  crossOrigin: undefined
};
const isArrayBuffer$1 = isArrayBuffer; // Should we make this on demand?

const getShared2DContext = function () {
  let s_ctx;
  return function getShared2DContext() {
    s_ctx = s_ctx || (typeof document !== 'undefined' && document.createElement ? document.createElement("canvas").getContext("2d") : null);
    return s_ctx;
  };
}(); // NOTE: Chrome supports 2D canvas in a Worker (behind flag as of v64 but
//       not only does Firefox NOT support it but Firefox freezes immediately
//       if you try to create one instead of just returning null and continuing.
//  : (global.OffscreenCanvas && (new global.OffscreenCanvas(1, 1)).getContext("2d"));  // OffscreenCanvas may not support 2d
// NOTE: We can maybe remove some of the need for the 2d canvas. In WebGL2
// we can use the various unpack settings. Otherwise we could try using
// the ability of an ImageBitmap to be cut. Unfortunately cutting an ImageBitmap
// is async and the current TWGL code expects a non-Async result though that
// might not be a problem. ImageBitmap though is not available in Edge or Safari
// as of 2018-01-02

/* PixelFormat */


const ALPHA = 0x1906;
const RGB = 0x1907;
const RGBA = 0x1908;
const LUMINANCE = 0x1909;
const LUMINANCE_ALPHA = 0x190A;
const DEPTH_COMPONENT = 0x1902;
const DEPTH_STENCIL = 0x84F9;
/* TextureWrapMode */
// const REPEAT                         = 0x2901;
// const MIRRORED_REPEAT                = 0x8370;

const CLAMP_TO_EDGE = 0x812f;
/* TextureMagFilter */

const NEAREST = 0x2600;
const LINEAR = 0x2601;
/* TextureMinFilter */
// const NEAREST_MIPMAP_NEAREST         = 0x2700;
// const LINEAR_MIPMAP_NEAREST          = 0x2701;
// const NEAREST_MIPMAP_LINEAR          = 0x2702;
// const LINEAR_MIPMAP_LINEAR           = 0x2703;

/* Texture Target */

const TEXTURE_2D = 0x0de1;
const TEXTURE_CUBE_MAP = 0x8513;
const TEXTURE_3D = 0x806f;
const TEXTURE_2D_ARRAY = 0x8c1a;
/* Cubemap Targets */

const TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
const TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
const TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
const TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
const TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
const TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851a;
/* Texture Parameters */

const TEXTURE_MIN_FILTER = 0x2801;
const TEXTURE_MAG_FILTER = 0x2800;
const TEXTURE_WRAP_S = 0x2802;
const TEXTURE_WRAP_T = 0x2803;
const TEXTURE_WRAP_R = 0x8072;
const TEXTURE_MIN_LOD = 0x813a;
const TEXTURE_MAX_LOD = 0x813b;
const TEXTURE_BASE_LEVEL = 0x813c;
const TEXTURE_MAX_LEVEL = 0x813d;
/* Pixel store */

const UNPACK_ALIGNMENT = 0x0cf5;
const UNPACK_ROW_LENGTH = 0x0cf2;
const UNPACK_IMAGE_HEIGHT = 0x806e;
const UNPACK_SKIP_PIXELS = 0x0cf4;
const UNPACK_SKIP_ROWS = 0x0cf3;
const UNPACK_SKIP_IMAGES = 0x806d;
const UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;
const UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
const UNPACK_FLIP_Y_WEBGL = 0x9240;
const R8 = 0x8229;
const R8_SNORM = 0x8F94;
const R16F = 0x822D;
const R32F = 0x822E;
const R8UI = 0x8232;
const R8I = 0x8231;
const RG16UI = 0x823A;
const RG16I = 0x8239;
const RG32UI = 0x823C;
const RG32I = 0x823B;
const RG8 = 0x822B;
const RG8_SNORM = 0x8F95;
const RG16F = 0x822F;
const RG32F = 0x8230;
const RG8UI = 0x8238;
const RG8I = 0x8237;
const R16UI = 0x8234;
const R16I = 0x8233;
const R32UI = 0x8236;
const R32I = 0x8235;
const RGB8 = 0x8051;
const SRGB8 = 0x8C41;
const RGB565 = 0x8D62;
const RGB8_SNORM = 0x8F96;
const R11F_G11F_B10F = 0x8C3A;
const RGB9_E5 = 0x8C3D;
const RGB16F = 0x881B;
const RGB32F = 0x8815;
const RGB8UI = 0x8D7D;
const RGB8I = 0x8D8F;
const RGB16UI = 0x8D77;
const RGB16I = 0x8D89;
const RGB32UI = 0x8D71;
const RGB32I = 0x8D83;
const RGBA8 = 0x8058;
const SRGB8_ALPHA8 = 0x8C43;
const RGBA8_SNORM = 0x8F97;
const RGB5_A1 = 0x8057;
const RGBA4 = 0x8056;
const RGB10_A2 = 0x8059;
const RGBA16F = 0x881A;
const RGBA32F = 0x8814;
const RGBA8UI = 0x8D7C;
const RGBA8I = 0x8D8E;
const RGB10_A2UI = 0x906F;
const RGBA16UI = 0x8D76;
const RGBA16I = 0x8D88;
const RGBA32I = 0x8D82;
const RGBA32UI = 0x8D70;
const DEPTH_COMPONENT16 = 0x81A5;
const DEPTH_COMPONENT24 = 0x81A6;
const DEPTH_COMPONENT32F = 0x8CAC;
const DEPTH32F_STENCIL8 = 0x8CAD;
const DEPTH24_STENCIL8 = 0x88F0;
/* DataType */

const BYTE$2 = 0x1400;
const UNSIGNED_BYTE$2 = 0x1401;
const SHORT$2 = 0x1402;
const UNSIGNED_SHORT$2 = 0x1403;
const INT$2 = 0x1404;
const UNSIGNED_INT$2 = 0x1405;
const FLOAT$2 = 0x1406;
const UNSIGNED_SHORT_4_4_4_4$1 = 0x8033;
const UNSIGNED_SHORT_5_5_5_1$1 = 0x8034;
const UNSIGNED_SHORT_5_6_5$1 = 0x8363;
const HALF_FLOAT$1 = 0x140B;
const HALF_FLOAT_OES = 0x8D61; // Thanks Khronos for making this different >:(

const UNSIGNED_INT_2_10_10_10_REV$1 = 0x8368;
const UNSIGNED_INT_10F_11F_11F_REV$1 = 0x8C3B;
const UNSIGNED_INT_5_9_9_9_REV$1 = 0x8C3E;
const FLOAT_32_UNSIGNED_INT_24_8_REV$1 = 0x8DAD;
const UNSIGNED_INT_24_8$1 = 0x84FA;
const RG = 0x8227;
const RG_INTEGER = 0x8228;
const RED = 0x1903;
const RED_INTEGER = 0x8D94;
const RGB_INTEGER = 0x8D98;
const RGBA_INTEGER = 0x8D99;
const formatInfo = {};
{
  // NOTE: this is named `numColorComponents` vs `numComponents` so we can let Uglify mangle
  // the name.
  const f = formatInfo;
  f[ALPHA] = {
    numColorComponents: 1
  };
  f[LUMINANCE] = {
    numColorComponents: 1
  };
  f[LUMINANCE_ALPHA] = {
    numColorComponents: 2
  };
  f[RGB] = {
    numColorComponents: 3
  };
  f[RGBA] = {
    numColorComponents: 4
  };
  f[RED] = {
    numColorComponents: 1
  };
  f[RED_INTEGER] = {
    numColorComponents: 1
  };
  f[RG] = {
    numColorComponents: 2
  };
  f[RG_INTEGER] = {
    numColorComponents: 2
  };
  f[RGB] = {
    numColorComponents: 3
  };
  f[RGB_INTEGER] = {
    numColorComponents: 3
  };
  f[RGBA] = {
    numColorComponents: 4
  };
  f[RGBA_INTEGER] = {
    numColorComponents: 4
  };
  f[DEPTH_COMPONENT] = {
    numColorComponents: 1
  };
  f[DEPTH_STENCIL] = {
    numColorComponents: 2
  };
}
/**
 * @typedef {Object} TextureFormatDetails
 * @property {number} textureFormat format to pass texImage2D and similar functions.
 * @property {boolean} colorRenderable true if you can render to this format of texture.
 * @property {boolean} textureFilterable true if you can filter the texture, false if you can ony use `NEAREST`.
 * @property {number[]} type Array of possible types you can pass to texImage2D and similar function
 * @property {Object.<number,number>} bytesPerElementMap A map of types to bytes per element
 * @private
 */

let s_textureInternalFormatInfo;

function getTextureInternalFormatInfo(internalFormat) {
  if (!s_textureInternalFormatInfo) {
    // NOTE: these properties need unique names so we can let Uglify mangle the name.
    const t = {}; // unsized formats

    t[ALPHA] = {
      textureFormat: ALPHA,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [1, 2, 2, 4],
      type: [UNSIGNED_BYTE$2, HALF_FLOAT$1, HALF_FLOAT_OES, FLOAT$2]
    };
    t[LUMINANCE] = {
      textureFormat: LUMINANCE,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [1, 2, 2, 4],
      type: [UNSIGNED_BYTE$2, HALF_FLOAT$1, HALF_FLOAT_OES, FLOAT$2]
    };
    t[LUMINANCE_ALPHA] = {
      textureFormat: LUMINANCE_ALPHA,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [2, 4, 4, 8],
      type: [UNSIGNED_BYTE$2, HALF_FLOAT$1, HALF_FLOAT_OES, FLOAT$2]
    };
    t[RGB] = {
      textureFormat: RGB,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [3, 6, 6, 12, 2],
      type: [UNSIGNED_BYTE$2, HALF_FLOAT$1, HALF_FLOAT_OES, FLOAT$2, UNSIGNED_SHORT_5_6_5$1]
    };
    t[RGBA] = {
      textureFormat: RGBA,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [4, 8, 8, 16, 2, 2],
      type: [UNSIGNED_BYTE$2, HALF_FLOAT$1, HALF_FLOAT_OES, FLOAT$2, UNSIGNED_SHORT_4_4_4_4$1, UNSIGNED_SHORT_5_5_5_1$1]
    };
    t[DEPTH_COMPONENT] = {
      textureFormat: DEPTH_COMPONENT,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [2, 4],
      type: [UNSIGNED_INT$2, UNSIGNED_SHORT$2]
    }; // sized formats

    t[R8] = {
      textureFormat: RED,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [1],
      type: [UNSIGNED_BYTE$2]
    };
    t[R8_SNORM] = {
      textureFormat: RED,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [1],
      type: [BYTE$2]
    };
    t[R16F] = {
      textureFormat: RED,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [4, 2],
      type: [FLOAT$2, HALF_FLOAT$1]
    };
    t[R32F] = {
      textureFormat: RED,
      colorRenderable: false,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [FLOAT$2]
    };
    t[R8UI] = {
      textureFormat: RED_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [1],
      type: [UNSIGNED_BYTE$2]
    };
    t[R8I] = {
      textureFormat: RED_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [1],
      type: [BYTE$2]
    };
    t[R16UI] = {
      textureFormat: RED_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [2],
      type: [UNSIGNED_SHORT$2]
    };
    t[R16I] = {
      textureFormat: RED_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [2],
      type: [SHORT$2]
    };
    t[R32UI] = {
      textureFormat: RED_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [UNSIGNED_INT$2]
    };
    t[R32I] = {
      textureFormat: RED_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [INT$2]
    };
    t[RG8] = {
      textureFormat: RG,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [2],
      type: [UNSIGNED_BYTE$2]
    };
    t[RG8_SNORM] = {
      textureFormat: RG,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [2],
      type: [BYTE$2]
    };
    t[RG16F] = {
      textureFormat: RG,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [8, 4],
      type: [FLOAT$2, HALF_FLOAT$1]
    };
    t[RG32F] = {
      textureFormat: RG,
      colorRenderable: false,
      textureFilterable: false,
      bytesPerElement: [8],
      type: [FLOAT$2]
    };
    t[RG8UI] = {
      textureFormat: RG_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [2],
      type: [UNSIGNED_BYTE$2]
    };
    t[RG8I] = {
      textureFormat: RG_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [2],
      type: [BYTE$2]
    };
    t[RG16UI] = {
      textureFormat: RG_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [UNSIGNED_SHORT$2]
    };
    t[RG16I] = {
      textureFormat: RG_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [SHORT$2]
    };
    t[RG32UI] = {
      textureFormat: RG_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [8],
      type: [UNSIGNED_INT$2]
    };
    t[RG32I] = {
      textureFormat: RG_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [8],
      type: [INT$2]
    };
    t[RGB8] = {
      textureFormat: RGB,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [3],
      type: [UNSIGNED_BYTE$2]
    };
    t[SRGB8] = {
      textureFormat: RGB,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [3],
      type: [UNSIGNED_BYTE$2]
    };
    t[RGB565] = {
      textureFormat: RGB,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [3, 2],
      type: [UNSIGNED_BYTE$2, UNSIGNED_SHORT_5_6_5$1]
    };
    t[RGB8_SNORM] = {
      textureFormat: RGB,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [3],
      type: [BYTE$2]
    };
    t[R11F_G11F_B10F] = {
      textureFormat: RGB,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [12, 6, 4],
      type: [FLOAT$2, HALF_FLOAT$1, UNSIGNED_INT_10F_11F_11F_REV$1]
    };
    t[RGB9_E5] = {
      textureFormat: RGB,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [12, 6, 4],
      type: [FLOAT$2, HALF_FLOAT$1, UNSIGNED_INT_5_9_9_9_REV$1]
    };
    t[RGB16F] = {
      textureFormat: RGB,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [12, 6],
      type: [FLOAT$2, HALF_FLOAT$1]
    };
    t[RGB32F] = {
      textureFormat: RGB,
      colorRenderable: false,
      textureFilterable: false,
      bytesPerElement: [12],
      type: [FLOAT$2]
    };
    t[RGB8UI] = {
      textureFormat: RGB_INTEGER,
      colorRenderable: false,
      textureFilterable: false,
      bytesPerElement: [3],
      type: [UNSIGNED_BYTE$2]
    };
    t[RGB8I] = {
      textureFormat: RGB_INTEGER,
      colorRenderable: false,
      textureFilterable: false,
      bytesPerElement: [3],
      type: [BYTE$2]
    };
    t[RGB16UI] = {
      textureFormat: RGB_INTEGER,
      colorRenderable: false,
      textureFilterable: false,
      bytesPerElement: [6],
      type: [UNSIGNED_SHORT$2]
    };
    t[RGB16I] = {
      textureFormat: RGB_INTEGER,
      colorRenderable: false,
      textureFilterable: false,
      bytesPerElement: [6],
      type: [SHORT$2]
    };
    t[RGB32UI] = {
      textureFormat: RGB_INTEGER,
      colorRenderable: false,
      textureFilterable: false,
      bytesPerElement: [12],
      type: [UNSIGNED_INT$2]
    };
    t[RGB32I] = {
      textureFormat: RGB_INTEGER,
      colorRenderable: false,
      textureFilterable: false,
      bytesPerElement: [12],
      type: [INT$2]
    };
    t[RGBA8] = {
      textureFormat: RGBA,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [4],
      type: [UNSIGNED_BYTE$2]
    };
    t[SRGB8_ALPHA8] = {
      textureFormat: RGBA,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [4],
      type: [UNSIGNED_BYTE$2]
    };
    t[RGBA8_SNORM] = {
      textureFormat: RGBA,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [4],
      type: [BYTE$2]
    };
    t[RGB5_A1] = {
      textureFormat: RGBA,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [4, 2, 4],
      type: [UNSIGNED_BYTE$2, UNSIGNED_SHORT_5_5_5_1$1, UNSIGNED_INT_2_10_10_10_REV$1]
    };
    t[RGBA4] = {
      textureFormat: RGBA,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [4, 2],
      type: [UNSIGNED_BYTE$2, UNSIGNED_SHORT_4_4_4_4$1]
    };
    t[RGB10_A2] = {
      textureFormat: RGBA,
      colorRenderable: true,
      textureFilterable: true,
      bytesPerElement: [4],
      type: [UNSIGNED_INT_2_10_10_10_REV$1]
    };
    t[RGBA16F] = {
      textureFormat: RGBA,
      colorRenderable: false,
      textureFilterable: true,
      bytesPerElement: [16, 8],
      type: [FLOAT$2, HALF_FLOAT$1]
    };
    t[RGBA32F] = {
      textureFormat: RGBA,
      colorRenderable: false,
      textureFilterable: false,
      bytesPerElement: [16],
      type: [FLOAT$2]
    };
    t[RGBA8UI] = {
      textureFormat: RGBA_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [UNSIGNED_BYTE$2]
    };
    t[RGBA8I] = {
      textureFormat: RGBA_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [BYTE$2]
    };
    t[RGB10_A2UI] = {
      textureFormat: RGBA_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [UNSIGNED_INT_2_10_10_10_REV$1]
    };
    t[RGBA16UI] = {
      textureFormat: RGBA_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [8],
      type: [UNSIGNED_SHORT$2]
    };
    t[RGBA16I] = {
      textureFormat: RGBA_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [8],
      type: [SHORT$2]
    };
    t[RGBA32I] = {
      textureFormat: RGBA_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [16],
      type: [INT$2]
    };
    t[RGBA32UI] = {
      textureFormat: RGBA_INTEGER,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [16],
      type: [UNSIGNED_INT$2]
    }; // Sized Internal

    t[DEPTH_COMPONENT16] = {
      textureFormat: DEPTH_COMPONENT,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [2, 4],
      type: [UNSIGNED_SHORT$2, UNSIGNED_INT$2]
    };
    t[DEPTH_COMPONENT24] = {
      textureFormat: DEPTH_COMPONENT,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [UNSIGNED_INT$2]
    };
    t[DEPTH_COMPONENT32F] = {
      textureFormat: DEPTH_COMPONENT,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [FLOAT$2]
    };
    t[DEPTH24_STENCIL8] = {
      textureFormat: DEPTH_STENCIL,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [UNSIGNED_INT_24_8$1]
    };
    t[DEPTH32F_STENCIL8] = {
      textureFormat: DEPTH_STENCIL,
      colorRenderable: true,
      textureFilterable: false,
      bytesPerElement: [4],
      type: [FLOAT_32_UNSIGNED_INT_24_8_REV$1]
    };
    Object.keys(t).forEach(function (internalFormat) {
      const info = t[internalFormat];
      info.bytesPerElementMap = {};
      info.bytesPerElement.forEach(function (bytesPerElement, ndx) {
        const type = info.type[ndx];
        info.bytesPerElementMap[type] = bytesPerElement;
      });
    });
    s_textureInternalFormatInfo = t;
  }

  return s_textureInternalFormatInfo[internalFormat];
}
/**
 * Gets the number of bytes per element for a given internalFormat / type
 * @param {number} internalFormat The internalFormat parameter from texImage2D etc..
 * @param {number} type The type parameter for texImage2D etc..
 * @return {number} the number of bytes per element for the given internalFormat, type combo
 * @memberOf module:twgl/textures
 */


function getBytesPerElementForInternalFormat(internalFormat, type) {
  const info = getTextureInternalFormatInfo(internalFormat);

  if (!info) {
    throw "unknown internal format";
  }

  const bytesPerElement = info.bytesPerElementMap[type];

  if (bytesPerElement === undefined) {
    throw "unknown internal format";
  }

  return bytesPerElement;
}
/**
 * Info related to a specific texture internalFormat as returned
 * from {@link module:twgl/textures.getFormatAndTypeForInternalFormat}.
 *
 * @typedef {Object} TextureFormatInfo
 * @property {number} format Format to pass to texImage2D and related functions
 * @property {number} type Type to pass to texImage2D and related functions
 * @memberOf module:twgl/textures
 */

/**
 * Gets the format and type for a given internalFormat
 *
 * @param {number} internalFormat The internal format
 * @return {module:twgl/textures.TextureFormatInfo} the corresponding format and type,
 * @memberOf module:twgl/textures
 */


function getFormatAndTypeForInternalFormat(internalFormat) {
  const info = getTextureInternalFormatInfo(internalFormat);

  if (!info) {
    throw "unknown internal format";
  }

  return {
    format: info.textureFormat,
    type: info.type[0]
  };
}
/**
 * Returns true if value is power of 2
 * @param {number} value number to check.
 * @return true if value is power of 2
 * @private
 */


function isPowerOf2(value) {
  return (value & value - 1) === 0;
}
/**
 * Gets whether or not we can generate mips for the given
 * internal format.
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {number} width The width parameter from texImage2D etc..
 * @param {number} height The height parameter from texImage2D etc..
 * @param {number} internalFormat The internalFormat parameter from texImage2D etc..
 * @return {boolean} true if we can generate mips
 * @memberOf module:twgl/textures
 */


function canGenerateMipmap(gl, width, height, internalFormat) {
  if (!isWebGL2(gl)) {
    return isPowerOf2(width) && isPowerOf2(height);
  }

  const info = getTextureInternalFormatInfo(internalFormat);

  if (!info) {
    throw "unknown internal format";
  }

  return info.colorRenderable && info.textureFilterable;
}
/**
 * Gets whether or not we can generate mips for the given format
 * @param {number} internalFormat The internalFormat parameter from texImage2D etc..
 * @return {boolean} true if we can generate mips
 * @memberOf module:twgl/textures
 */


function canFilter(internalFormat) {
  const info = getTextureInternalFormatInfo(internalFormat);

  if (!info) {
    throw "unknown internal format";
  }

  return info.textureFilterable;
}
/**
 * Gets the number of components for a given image format.
 * @param {number} format the format.
 * @return {number} the number of components for the format.
 * @memberOf module:twgl/textures
 */


function getNumComponentsForFormat(format) {
  const info = formatInfo[format];

  if (!info) {
    throw "unknown format: " + format;
  }

  return info.numColorComponents;
}
/**
 * Gets the texture type for a given array type.
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @return {number} the gl texture type
 * @private
 */


function getTextureTypeForArrayType(gl, src, defaultType) {
  if (isArrayBuffer$1(src)) {
    return getGLTypeForTypedArray(src);
  }

  return defaultType || UNSIGNED_BYTE$2;
}

function guessDimensions(gl, target, width, height, numElements) {
  if (numElements % 1 !== 0) {
    throw "can't guess dimensions";
  }

  if (!width && !height) {
    const size = Math.sqrt(numElements / (target === TEXTURE_CUBE_MAP ? 6 : 1));

    if (size % 1 === 0) {
      width = size;
      height = size;
    } else {
      width = numElements;
      height = 1;
    }
  } else if (!height) {
    height = numElements / width;

    if (height % 1) {
      throw "can't guess dimensions";
    }
  } else if (!width) {
    width = numElements / height;

    if (width % 1) {
      throw "can't guess dimensions";
    }
  }

  return {
    width: width,
    height: height
  };
}
/**
 * Sets the default texture color.
 *
 * The default texture color is used when loading textures from
 * urls. Because the URL will be loaded async we'd like to be
 * able to use the texture immediately. By putting a 1x1 pixel
 * color in the texture we can start using the texture before
 * the URL has loaded.
 *
 * @param {number[]} color Array of 4 values in the range 0 to 1
 * @deprecated see {@link module:twgl.setDefaults}
 * @memberOf module:twgl/textures
 */


function setDefaultTextureColor(color) {
  defaults$1.textureColor = new Uint8Array([color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255]);
}

function setDefaults$1(newDefaults) {
  copyExistingProperties(newDefaults, defaults$1);

  if (newDefaults.textureColor) {
    setDefaultTextureColor(newDefaults.textureColor);
  }
}
/**
 * A function to generate the source for a texture.
 * @callback TextureFunc
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @param {module:twgl.TextureOptions} options the texture options
 * @return {*} Returns any of the things documented for `src` for {@link module:twgl.TextureOptions}.
 * @memberOf module:twgl
 */

/**
 * Texture options passed to most texture functions. Each function will use whatever options
 * are appropriate for its needs. This lets you pass the same options to all functions.
 *
 * Note: A `TexImageSource` is defined in the WebGL spec as a `HTMLImageElement`, `HTMLVideoElement`,
 * `HTMLCanvasElement`, `ImageBitmap`, or `ImageData`.
 *
 * @typedef {Object} TextureOptions
 * @property {number} [target] the type of texture `gl.TEXTURE_2D` or `gl.TEXTURE_CUBE_MAP`. Defaults to `gl.TEXTURE_2D`.
 * @property {number} [level] the mip level to affect. Defaults to 0. Note, if set auto will be considered false unless explicitly set to true.
 * @property {number} [width] the width of the texture. Only used if src is an array or typed array or null.
 * @property {number} [height] the height of a texture. Only used if src is an array or typed array or null.
 * @property {number} [depth] the depth of a texture. Only used if src is an array or type array or null and target is `TEXTURE_3D` .
 * @property {number} [min] the min filter setting (eg. `gl.LINEAR`). Defaults to `gl.NEAREST_MIPMAP_LINEAR`
 *     or if texture is not a power of 2 on both dimensions then defaults to `gl.LINEAR`.
 * @property {number} [mag] the mag filter setting (eg. `gl.LINEAR`). Defaults to `gl.LINEAR`
 * @property {number} [minMag] both the min and mag filter settings.
 * @property {number} [internalFormat] internal format for texture. Defaults to `gl.RGBA`
 * @property {number} [format] format for texture. Defaults to `gl.RGBA`.
 * @property {number} [type] type for texture. Defaults to `gl.UNSIGNED_BYTE` unless `src` is ArrayBufferView. If `src`
 *     is ArrayBufferView defaults to type that matches ArrayBufferView type.
 * @property {number} [wrap] Texture wrapping for both S and T (and R if TEXTURE_3D or WebGLSampler). Defaults to `gl.REPEAT` for 2D unless src is WebGL1 and src not npot and `gl.CLAMP_TO_EDGE` for cube
 * @property {number} [wrapS] Texture wrapping for S. Defaults to `gl.REPEAT` and `gl.CLAMP_TO_EDGE` for cube. If set takes precedence over `wrap`.
 * @property {number} [wrapT] Texture wrapping for T. Defaults to `gl.REPEAT` and `gl.CLAMP_TO_EDGE` for cube. If set takes precedence over `wrap`.
 * @property {number} [wrapR] Texture wrapping for R. Defaults to `gl.REPEAT` and `gl.CLAMP_TO_EDGE` for cube. If set takes precedence over `wrap`.
 * @property {number} [minLod] TEXTURE_MIN_LOD setting
 * @property {number} [maxLod] TEXTURE_MAX_LOD setting
 * @property {number} [baseLevel] TEXTURE_BASE_LEVEL setting
 * @property {number} [maxLevel] TEXTURE_MAX_LEVEL setting
 * @property {number} [unpackAlignment] The `gl.UNPACK_ALIGNMENT` used when uploading an array. Defaults to 1.
 * @property {number[]|ArrayBufferView} [color] Color to initialize this texture with if loading an image asynchronously.
 *     The default use a blue 1x1 pixel texture. You can set another default by calling `twgl.setDefaults`
 *     or you can set an individual texture's initial color by setting this property. Example: `[1, .5, .5, 1]` = pink
 * @property {number} [premultiplyAlpha] Whether or not to premultiply alpha. Defaults to whatever the current setting is.
 *     This lets you set it once before calling `twgl.createTexture` or `twgl.createTextures` and only override
 *     the current setting for specific textures.
 * @property {number} [flipY] Whether or not to flip the texture vertically on upload. Defaults to whatever the current setting is.
 *     This lets you set it once before calling `twgl.createTexture` or `twgl.createTextures` and only override
 *     the current setting for specific textures.
 * @property {number} [colorspaceConversion] Whether or not to let the browser do colorspace conversion of the texture on upload. Defaults to whatever the current setting is.
 *     This lets you set it once before calling `twgl.createTexture` or `twgl.createTextures` and only override
 *     the current setting for specific textures.
 * @property {boolean} [auto] If `undefined` or `true`, in WebGL1, texture filtering is set automatically for non-power of 2 images and
 *    mips are generated for power of 2 images. In WebGL2 mips are generated if they can be. Note: if `level` is set above
 *    then then `auto` is assumed to be `false` unless explicity set to `true`.
 * @property {number[]} [cubeFaceOrder] The order that cube faces are pulled out of an img or set of images. The default is
 *
 *     [gl.TEXTURE_CUBE_MAP_POSITIVE_X,
 *      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
 *      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
 *      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
 *      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
 *      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]
 *
 * @property {(number[]|ArrayBufferView|TexImageSource|TexImageSource[]|string|string[]|module:twgl.TextureFunc)} [src] source for texture
 *
 *    If `string` then it's assumed to be a URL to an image. The image will be downloaded async. A usable
 *    1x1 pixel texture will be returned immediately. The texture will be updated once the image has downloaded.
 *    If `target` is `gl.TEXTURE_CUBE_MAP` will attempt to divide image into 6 square pieces. 1x6, 6x1, 3x2, 2x3.
 *    The pieces will be uploaded in `cubeFaceOrder`
 *
 *    If `string[]` or `TexImageSource[]` and target is `gl.TEXTURE_CUBE_MAP` then it must have 6 entries, one for each face of a cube map.
 *
 *    If `string[]` or `TexImageSource[]` and target is `gl.TEXTURE_2D_ARRAY` then each entry is a slice of the a 2d array texture
 *    and will be scaled to the specified width and height OR to the size of the first image that loads.
 *
 *    If `TexImageSource` then it wil be used immediately to create the contents of the texture. Examples `HTMLImageElement`,
 *    `HTMLCanvasElement`, `HTMLVideoElement`.
 *
 *    If `number[]` or `ArrayBufferView` it's assumed to be data for a texture. If `width` or `height` is
 *    not specified it is guessed as follows. First the number of elements is computed by `src.length / numComponents`
 *    where `numComponents` is derived from `format`. If `target` is `gl.TEXTURE_CUBE_MAP` then `numElements` is divided
 *    by 6. Then
 *
 *    *   If neither `width` nor `height` are specified and `sqrt(numElements)` is an integer then width and height
 *        are set to `sqrt(numElements)`. Otherwise `width = numElements` and `height = 1`.
 *
 *    *   If only one of `width` or `height` is specified then the other equals `numElements / specifiedDimension`.
 *
 * If `number[]` will be converted to `type`.
 *
 * If `src` is a function it will be called with a `WebGLRenderingContext` and these options.
 * Whatever it returns is subject to these rules. So it can return a string url, an `HTMLElement`
 * an array etc...
 *
 * If `src` is undefined then an empty texture will be created of size `width` by `height`.
 *
 * @property {string} [crossOrigin] What to set the crossOrigin property of images when they are downloaded.
 *    default: undefined. Also see {@link module:twgl.setDefaults}.
 *
 * @memberOf module:twgl
 */

/**
 * Sets any packing state that will be set based on the options.
 * @param {module:twgl.TextureOptions} options A TextureOptions object with whatever parameters you want set.
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @private
 */


function setPackState(gl, options) {
  if (options.colorspaceConversion !== undefined) {
    gl.pixelStorei(UNPACK_COLORSPACE_CONVERSION_WEBGL, options.colorspaceConversion);
  }

  if (options.premultiplyAlpha !== undefined) {
    gl.pixelStorei(UNPACK_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha);
  }

  if (options.flipY !== undefined) {
    gl.pixelStorei(UNPACK_FLIP_Y_WEBGL, options.flipY);
  }
}
/**
 * Set skip state to defaults
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @private
 */


function setSkipStateToDefault(gl) {
  gl.pixelStorei(UNPACK_ALIGNMENT, 4);

  if (isWebGL2(gl)) {
    gl.pixelStorei(UNPACK_ROW_LENGTH, 0);
    gl.pixelStorei(UNPACK_IMAGE_HEIGHT, 0);
    gl.pixelStorei(UNPACK_SKIP_PIXELS, 0);
    gl.pixelStorei(UNPACK_SKIP_ROWS, 0);
    gl.pixelStorei(UNPACK_SKIP_IMAGES, 0);
  }
}
/**
 * Sets the parameters of a texture or sampler
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {number|WebGLSampler} target texture target or sampler
 * @param {function()} parameteriFn texParameteri or samplerParameteri fn
 * @param {WebGLTexture} tex the WebGLTexture to set parameters for
 * @param {module:twgl.TextureOptions} options A TextureOptions object with whatever parameters you want set.
 *   This is often the same options you passed in when you created the texture.
 * @private
 */


function setTextureSamplerParameters(gl, target, parameteriFn, options) {
  if (options.minMag) {
    parameteriFn.call(gl, target, TEXTURE_MIN_FILTER, options.minMag);
    parameteriFn.call(gl, target, TEXTURE_MAG_FILTER, options.minMag);
  }

  if (options.min) {
    parameteriFn.call(gl, target, TEXTURE_MIN_FILTER, options.min);
  }

  if (options.mag) {
    parameteriFn.call(gl, target, TEXTURE_MAG_FILTER, options.mag);
  }

  if (options.wrap) {
    parameteriFn.call(gl, target, TEXTURE_WRAP_S, options.wrap);
    parameteriFn.call(gl, target, TEXTURE_WRAP_T, options.wrap);

    if (target === TEXTURE_3D || isSampler(gl, target)) {
      parameteriFn.call(gl, target, TEXTURE_WRAP_R, options.wrap);
    }
  }

  if (options.wrapR) {
    parameteriFn.call(gl, target, TEXTURE_WRAP_R, options.wrapR);
  }

  if (options.wrapS) {
    parameteriFn.call(gl, target, TEXTURE_WRAP_S, options.wrapS);
  }

  if (options.wrapT) {
    parameteriFn.call(gl, target, TEXTURE_WRAP_T, options.wrapT);
  }

  if (options.minLod) {
    parameteriFn.call(gl, target, TEXTURE_MIN_LOD, options.minLod);
  }

  if (options.maxLod) {
    parameteriFn.call(gl, target, TEXTURE_MAX_LOD, options.maxLod);
  }

  if (options.baseLevel) {
    parameteriFn.call(gl, target, TEXTURE_BASE_LEVEL, options.baseLevel);
  }

  if (options.maxLevel) {
    parameteriFn.call(gl, target, TEXTURE_MAX_LEVEL, options.maxLevel);
  }
}
/**
 * Sets the texture parameters of a texture.
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLTexture} tex the WebGLTexture to set parameters for
 * @param {module:twgl.TextureOptions} options A TextureOptions object with whatever parameters you want set.
 *   This is often the same options you passed in when you created the texture.
 * @memberOf module:twgl/textures
 */


function setTextureParameters(gl, tex, options) {
  const target = options.target || TEXTURE_2D;
  gl.bindTexture(target, tex);
  setTextureSamplerParameters(gl, target, gl.texParameteri, options);
}
/**
 * Sets the sampler parameters of a sampler.
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLSampler} sampler the WebGLSampler to set parameters for
 * @param {module:twgl.TextureOptions} options A TextureOptions object with whatever parameters you want set.
 * @memberOf module:twgl/textures
 */


function setSamplerParameters(gl, sampler, options) {
  setTextureSamplerParameters(gl, sampler, gl.samplerParameteri, options);
}
/**
 * Creates a new sampler object and sets parameters.
 *
 * Example:
 *
 *      const sampler = twgl.createSampler(gl, {
 *        minMag: gl.NEAREST,         // sets both TEXTURE_MIN_FILTER and TEXTURE_MAG_FILTER
 *        wrap: gl.CLAMP_TO_NEAREST,  // sets both TEXTURE_WRAP_S and TEXTURE_WRAP_T and TEXTURE_WRAP_R
 *      });
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {Object.<string,module:twgl.TextureOptions>} options A object of TextureOptions one per sampler.
 * @return {Object.<string,WebGLSampler>} the created samplers by name
 * @private
 */


function createSampler(gl, options) {
  const sampler = gl.createSampler();
  setSamplerParameters(gl, sampler, options);
  return sampler;
}
/**
 * Creates a multiple sampler objects and sets parameters on each.
 *
 * Example:
 *
 *      const samplers = twgl.createSamplers(gl, {
 *        nearest: {
 *          minMag: gl.NEAREST,
 *        },
 *        nearestClampS: {
 *          minMag: gl.NEAREST,
 *          wrapS: gl.CLAMP_TO_NEAREST,
 *        },
 *        linear: {
 *          minMag: gl.LINEAR,
 *        },
 *        nearestClamp: {
 *          minMag: gl.NEAREST,
 *          wrap: gl.CLAMP_TO_EDGE,
 *        },
 *        linearClamp: {
 *          minMag: gl.LINEAR,
 *          wrap: gl.CLAMP_TO_EDGE,
 *        },
 *        linearClampT: {
 *          minMag: gl.LINEAR,
 *          wrapT: gl.CLAMP_TO_EDGE,
 *        },
 *      });
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {module:twgl.TextureOptions} [options] A TextureOptions object with whatever parameters you want set on the sampler
 * @private
 */


function createSamplers(gl, samplerOptions) {
  const samplers = {};
  Object.keys(samplerOptions).forEach(function (name) {
    samplers[name] = createSampler(gl, samplerOptions[name]);
  });
  return samplers;
}
/**
 * Makes a 1x1 pixel
 * If no color is passed in uses the default color which can be set by calling `setDefaultTextureColor`.
 * @param {(number[]|ArrayBufferView)} [color] The color using 0-1 values
 * @return {Uint8Array} Unit8Array with color.
 * @private
 */


function make1Pixel(color) {
  color = color || defaults$1.textureColor;

  if (isArrayBuffer$1(color)) {
    return color;
  }

  return new Uint8Array([color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255]);
}
/**
 * Sets filtering or generates mips for texture based on width or height
 * If width or height is not passed in uses `options.width` and//or `options.height`
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLTexture} tex the WebGLTexture to set parameters for
 * @param {module:twgl.TextureOptions} [options] A TextureOptions object with whatever parameters you want set.
 *   This is often the same options you passed in when you created the texture.
 * @param {number} [width] width of texture
 * @param {number} [height] height of texture
 * @param {number} [internalFormat] The internalFormat parameter from texImage2D etc..
 * @memberOf module:twgl/textures
 */


function setTextureFilteringForSize(gl, tex, options, width, height, internalFormat) {
  options = options || defaults$1.textureOptions;
  internalFormat = internalFormat || RGBA;
  const target = options.target || TEXTURE_2D;
  width = width || options.width;
  height = height || options.height;
  gl.bindTexture(target, tex);

  if (canGenerateMipmap(gl, width, height, internalFormat)) {
    gl.generateMipmap(target);
  } else {
    const filtering = canFilter(internalFormat) ? LINEAR : NEAREST;
    gl.texParameteri(target, TEXTURE_MIN_FILTER, filtering);
    gl.texParameteri(target, TEXTURE_MAG_FILTER, filtering);
    gl.texParameteri(target, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
    gl.texParameteri(target, TEXTURE_WRAP_T, CLAMP_TO_EDGE);
  }
}

function shouldAutomaticallySetTextureFilteringForSize(options) {
  return options.auto === true || options.auto === undefined && options.level === undefined;
}
/**
 * Gets an array of cubemap face enums
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {module:twgl.TextureOptions} options A TextureOptions object with whatever parameters you want set.
 *   This is often the same options you passed in when you created the texture.
 * @return {number[]} cubemap face enums
 * @private
 */


function getCubeFaceOrder(gl, options) {
  options = options || {};
  return options.cubeFaceOrder || [TEXTURE_CUBE_MAP_POSITIVE_X, TEXTURE_CUBE_MAP_NEGATIVE_X, TEXTURE_CUBE_MAP_POSITIVE_Y, TEXTURE_CUBE_MAP_NEGATIVE_Y, TEXTURE_CUBE_MAP_POSITIVE_Z, TEXTURE_CUBE_MAP_NEGATIVE_Z];
}
/**
 * @typedef {Object} FaceInfo
 * @property {number} face gl enum for texImage2D
 * @property {number} ndx face index (0 - 5) into source data
 * @ignore
 */

/**
 * Gets an array of FaceInfos
 * There's a bug in some NVidia drivers that will crash the driver if
 * `gl.TEXTURE_CUBE_MAP_POSITIVE_X` is not uploaded first. So, we take
 * the user's desired order from his faces to WebGL and make sure we
 * do the faces in WebGL order
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {module:twgl.TextureOptions} options A TextureOptions object with whatever parameters you want set.
 * @return {FaceInfo[]} cubemap face infos. Arguably the `face` property of each element is redundant but
 *    it's needed internally to sort the array of `ndx` properties by `face`.
 * @private
 */


function getCubeFacesWithNdx(gl, options) {
  const faces = getCubeFaceOrder(gl, options); // work around bug in NVidia drivers. We have to upload the first face first else the driver crashes :(

  const facesWithNdx = faces.map(function (face, ndx) {
    return {
      face: face,
      ndx: ndx
    };
  });
  facesWithNdx.sort(function (a, b) {
    return a.face - b.face;
  });
  return facesWithNdx;
}
/**
 * Set a texture from the contents of an element. Will also set
 * texture filtering or generate mips based on the dimensions of the element
 * unless `options.auto === false`. If `target === gl.TEXTURE_CUBE_MAP` will
 * attempt to slice image into 1x6, 2x3, 3x2, or 6x1 images, one for each face.
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLTexture} tex the WebGLTexture to set parameters for
 * @param {HTMLElement} element a canvas, img, or video element.
 * @param {module:twgl.TextureOptions} [options] A TextureOptions object with whatever parameters you want set.
 *   This is often the same options you passed in when you created the texture.
 * @memberOf module:twgl/textures
 * @kind function
 */


function setTextureFromElement(gl, tex, element, options) {
  options = options || defaults$1.textureOptions;
  const target = options.target || TEXTURE_2D;
  const level = options.level || 0;
  let width = element.width;
  let height = element.height;
  const internalFormat = options.internalFormat || options.format || RGBA;
  const formatType = getFormatAndTypeForInternalFormat(internalFormat);
  const format = options.format || formatType.format;
  const type = options.type || formatType.type;
  setPackState(gl, options);
  gl.bindTexture(target, tex);

  if (target === TEXTURE_CUBE_MAP) {
    // guess the parts
    const imgWidth = element.width;
    const imgHeight = element.height;
    let size;
    let slices;

    if (imgWidth / 6 === imgHeight) {
      // It's 6x1
      size = imgHeight;
      slices = [0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0];
    } else if (imgHeight / 6 === imgWidth) {
      // It's 1x6
      size = imgWidth;
      slices = [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5];
    } else if (imgWidth / 3 === imgHeight / 2) {
      // It's 3x2
      size = imgWidth / 3;
      slices = [0, 0, 1, 0, 2, 0, 0, 1, 1, 1, 2, 1];
    } else if (imgWidth / 2 === imgHeight / 3) {
      // It's 2x3
      size = imgWidth / 2;
      slices = [0, 0, 1, 0, 0, 1, 1, 1, 0, 2, 1, 2];
    } else {
      throw "can't figure out cube map from element: " + (element.src ? element.src : element.nodeName);
    }

    const ctx = getShared2DContext();

    if (ctx) {
      ctx.canvas.width = size;
      ctx.canvas.height = size;
      width = size;
      height = size;
      getCubeFacesWithNdx(gl, options).forEach(function (f) {
        const xOffset = slices[f.ndx * 2 + 0] * size;
        const yOffset = slices[f.ndx * 2 + 1] * size;
        ctx.drawImage(element, xOffset, yOffset, size, size, 0, 0, size, size);
        gl.texImage2D(f.face, level, internalFormat, format, type, ctx.canvas);
      }); // Free up the canvas memory

      ctx.canvas.width = 1;
      ctx.canvas.height = 1;
    } else if (typeof createImageBitmap !== 'undefined') {
      // NOTE: It seems like we should prefer ImageBitmap because unlike canvas it's
      // note lossy? (alpha is not premultiplied? although I'm not sure what
      width = size;
      height = size;
      getCubeFacesWithNdx(gl, options).forEach(function (f) {
        const xOffset = slices[f.ndx * 2 + 0] * size;
        const yOffset = slices[f.ndx * 2 + 1] * size; // We can't easily use a default texture color here as it would have to match
        // the type across all faces where as with a 2D one there's only one face
        // so we're replacing everything all at once. It also has to be the correct size.
        // On the other hand we need all faces to be the same size so as one face loads
        // the rest match else the texture will be un-renderable.

        gl.texImage2D(f.face, level, internalFormat, size, size, 0, format, type, null);
        createImageBitmap(element, xOffset, yOffset, size, size, {
          premultiplyAlpha: 'none',
          colorSpaceConversion: 'none'
        }).then(function (imageBitmap) {
          setPackState(gl, options);
          gl.bindTexture(target, tex);
          gl.texImage2D(f.face, level, internalFormat, format, type, imageBitmap);

          if (shouldAutomaticallySetTextureFilteringForSize(options)) {
            setTextureFilteringForSize(gl, tex, options, width, height, internalFormat);
          }
        });
      });
    }
  } else if (target === TEXTURE_3D || target === TEXTURE_2D_ARRAY) {
    const smallest = Math.min(element.width, element.height);
    const largest = Math.max(element.width, element.height);
    const depth = largest / smallest;

    if (depth % 1 !== 0) {
      throw "can not compute 3D dimensions of element";
    }

    const xMult = element.width === largest ? 1 : 0;
    const yMult = element.height === largest ? 1 : 0;
    gl.pixelStorei(UNPACK_ALIGNMENT, 1);
    gl.pixelStorei(UNPACK_ROW_LENGTH, element.width);
    gl.pixelStorei(UNPACK_IMAGE_HEIGHT, 0);
    gl.pixelStorei(UNPACK_SKIP_IMAGES, 0);
    gl.texImage3D(target, level, internalFormat, smallest, smallest, smallest, 0, format, type, null);

    for (let d = 0; d < depth; ++d) {
      const srcX = d * smallest * xMult;
      const srcY = d * smallest * yMult;
      gl.pixelStorei(UNPACK_SKIP_PIXELS, srcX);
      gl.pixelStorei(UNPACK_SKIP_ROWS, srcY);
      gl.texSubImage3D(target, level, 0, 0, d, smallest, smallest, 1, format, type, element);
    }

    setSkipStateToDefault(gl);
  } else {
    gl.texImage2D(target, level, internalFormat, format, type, element);
  }

  if (shouldAutomaticallySetTextureFilteringForSize(options)) {
    setTextureFilteringForSize(gl, tex, options, width, height, internalFormat);
  }

  setTextureParameters(gl, tex, options);
}

function noop() {}
/**
 * Checks whether the url's origin is the same so that we can set the `crossOrigin`
 * @param {string} url url to image
 * @returns {boolean} true if the window's origin is the same as image's url
 * @private
 */


function urlIsSameOrigin(url) {
  if (typeof document !== 'undefined') {
    // for IE really
    const a = document.createElement('a');
    a.href = url;
    return a.hostname === location.hostname && a.port === location.port && a.protocol === location.protocol;
  } else {
    const localOrigin = new URL(location.href).origin;
    const urlOrigin = new URL(url, location.href).origin;
    return urlOrigin === localOrigin;
  }
}

function setToAnonymousIfUndefinedAndURLIsNotSameOrigin(url, crossOrigin) {
  return crossOrigin === undefined && !urlIsSameOrigin(url) ? 'anonymous' : crossOrigin;
}
/**
 * Loads an image
 * @param {string} url url to image
 * @param {string} crossOrigin
 * @param {function(err, img)} [callback] a callback that's passed an error and the image. The error will be non-null
 *     if there was an error
 * @return {HTMLImageElement} the image being loaded.
 * @private
 */


function loadImage(url, crossOrigin, callback) {
  callback = callback || noop;
  let img;
  crossOrigin = crossOrigin !== undefined ? crossOrigin : defaults$1.crossOrigin;
  crossOrigin = setToAnonymousIfUndefinedAndURLIsNotSameOrigin(url, crossOrigin);

  if (typeof Image !== 'undefined') {
    img = new Image();

    if (crossOrigin !== undefined) {
      img.crossOrigin = crossOrigin;
    }

    const clearEventHandlers = function clearEventHandlers() {
      img.removeEventListener('error', onError); // eslint-disable-line

      img.removeEventListener('load', onLoad); // eslint-disable-line

      img = null;
    };

    const onError = function onError() {
      const msg = "couldn't load image: " + url;
      error(msg);
      callback(msg, img);
      clearEventHandlers();
    };

    const onLoad = function onLoad() {
      callback(null, img);
      clearEventHandlers();
    };

    img.addEventListener('error', onError);
    img.addEventListener('load', onLoad);
    img.src = url;
    return img;
  } else if (typeof ImageBitmap !== 'undefined') {
    let err;
    let bm;

    const cb = function cb() {
      callback(err, bm);
    };

    const options = {};

    if (crossOrigin) {
      options.mode = 'cors'; // TODO: not sure how to translate image.crossOrigin
    }

    fetch(url, options).then(function (response) {
      if (!response.ok) {
        throw response;
      }

      return response.blob();
    }).then(function (blob) {
      return createImageBitmap(blob, {
        premultiplyAlpha: 'none',
        colorSpaceConversion: 'none'
      });
    }).then(function (bitmap) {
      // not sure if this works. We don't want
      // to catch the user's error. So, call
      // the callback in a timeout so we're
      // not in this scope inside the promise.
      bm = bitmap;
      setTimeout(cb);
    }).catch(function (e) {
      err = e;
      setTimeout(cb);
    });
    img = null;
  }

  return img;
}
/**
 * check if object is a TexImageSource
 *
 * @param {Object} obj Object to test
 * @return {boolean} true if object is a TexImageSource
 * @private
 */


function isTexImageSource(obj) {
  return typeof ImageBitmap !== 'undefined' && obj instanceof ImageBitmap || typeof ImageData !== 'undefined' && obj instanceof ImageData || typeof HTMLElement !== 'undefined' && obj instanceof HTMLElement;
}
/**
 * if obj is an TexImageSource then just
 * uses it otherwise if obj is a string
 * then load it first.
 *
 * @param {string|TexImageSource} obj
 * @param {string} crossOrigin
 * @param {function(err, img)} [callback] a callback that's passed an error and the image. The error will be non-null
 *     if there was an error
 * @private
 */


function loadAndUseImage(obj, crossOrigin, callback) {
  if (isTexImageSource(obj)) {
    setTimeout(function () {
      callback(null, obj);
    });
    return obj;
  }

  return loadImage(obj, crossOrigin, callback);
}
/**
 * Sets a texture to a 1x1 pixel color. If `options.color === false` is nothing happens. If it's not set
 * the default texture color is used which can be set by calling `setDefaultTextureColor`.
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLTexture} tex the WebGLTexture to set parameters for
 * @param {module:twgl.TextureOptions} [options] A TextureOptions object with whatever parameters you want set.
 *   This is often the same options you passed in when you created the texture.
 * @memberOf module:twgl/textures
 */


function setTextureTo1PixelColor(gl, tex, options) {
  options = options || defaults$1.textureOptions;
  const target = options.target || TEXTURE_2D;
  gl.bindTexture(target, tex);

  if (options.color === false) {
    return;
  } // Assume it's a URL
  // Put 1x1 pixels in texture. That makes it renderable immediately regardless of filtering.


  const color = make1Pixel(options.color);

  if (target === TEXTURE_CUBE_MAP) {
    for (let ii = 0; ii < 6; ++ii) {
      gl.texImage2D(TEXTURE_CUBE_MAP_POSITIVE_X + ii, 0, RGBA, 1, 1, 0, RGBA, UNSIGNED_BYTE$2, color);
    }
  } else if (target === TEXTURE_3D || target === TEXTURE_2D_ARRAY) {
    gl.texImage3D(target, 0, RGBA, 1, 1, 1, 0, RGBA, UNSIGNED_BYTE$2, color);
  } else {
    gl.texImage2D(target, 0, RGBA, 1, 1, 0, RGBA, UNSIGNED_BYTE$2, color);
  }
}
/**
 * The src image(s) used to create a texture.
 *
 * When you call {@link module:twgl.createTexture} or {@link module:twgl.createTextures}
 * you can pass in urls for images to load into the textures. If it's a single url
 * then this will be a single HTMLImageElement. If it's an array of urls used for a cubemap
 * this will be a corresponding array of images for the cubemap.
 *
 * @typedef {HTMLImageElement|HTMLImageElement[]} TextureSrc
 * @memberOf module:twgl
 */

/**
 * A callback for when an image finished downloading and been uploaded into a texture
 * @callback TextureReadyCallback
 * @param {*} err If truthy there was an error.
 * @param {WebGLTexture} texture the texture.
 * @param {module:twgl.TextureSrc} source image(s) used to as the src for the texture
 * @memberOf module:twgl
 */

/**
 * A callback for when all images have finished downloading and been uploaded into their respective textures
 * @callback TexturesReadyCallback
 * @param {*} err If truthy there was an error.
 * @param {Object.<string, WebGLTexture>} textures the created textures by name. Same as returned by {@link module:twgl.createTextures}.
 * @param {Object.<string, module:twgl.TextureSrc>} sources the image(s) used for the texture by name.
 * @memberOf module:twgl
 */

/**
 * A callback for when an image finished downloading and been uploaded into a texture
 * @callback CubemapReadyCallback
 * @param {*} err If truthy there was an error.
 * @param {WebGLTexture} tex the texture.
 * @param {HTMLImageElement[]} imgs the images for each face.
 * @memberOf module:twgl
 */

/**
 * A callback for when an image finished downloading and been uploaded into a texture
 * @callback ThreeDReadyCallback
 * @param {*} err If truthy there was an error.
 * @param {WebGLTexture} tex the texture.
 * @param {HTMLImageElement[]} imgs the images for each slice.
 * @memberOf module:twgl
 */

/**
 * Loads a texture from an image from a Url as specified in `options.src`
 * If `options.color !== false` will set the texture to a 1x1 pixel color so that the texture is
 * immediately useable. It will be updated with the contents of the image once the image has finished
 * downloading. Filtering options will be set as appropriate for image unless `options.auto === false`.
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLTexture} tex the WebGLTexture to set parameters for
 * @param {module:twgl.TextureOptions} [options] A TextureOptions object with whatever parameters you want set.
 * @param {module:twgl.TextureReadyCallback} [callback] A function to be called when the image has finished loading. err will
 *    be non null if there was an error.
 * @return {HTMLImageElement} the image being downloaded.
 * @memberOf module:twgl/textures
 */


function loadTextureFromUrl(gl, tex, options, callback) {
  callback = callback || noop;
  options = options || defaults$1.textureOptions;
  setTextureTo1PixelColor(gl, tex, options); // Because it's async we need to copy the options.

  options = Object.assign({}, options);
  const img = loadAndUseImage(options.src, options.crossOrigin, function (err, img) {
    if (err) {
      callback(err, tex, img);
    } else {
      setTextureFromElement(gl, tex, img, options);
      callback(null, tex, img);
    }
  });
  return img;
}
/**
 * Loads a cubemap from 6 urls or TexImageSources as specified in `options.src`. Will set the cubemap to a 1x1 pixel color
 * so that it is usable immediately unless `option.color === false`.
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLTexture} tex the WebGLTexture to set parameters for
 * @param {module:twgl.TextureOptions} options A TextureOptions object with whatever parameters you want set.
 * @param {module:twgl.CubemapReadyCallback} [callback] A function to be called when all the images have finished loading. err will
 *    be non null if there was an error.
 * @memberOf module:twgl/textures
 */


function loadCubemapFromUrls(gl, tex, options, callback) {
  callback = callback || noop;
  const urls = options.src;

  if (urls.length !== 6) {
    throw "there must be 6 urls for a cubemap";
  }

  const level = options.level || 0;
  const internalFormat = options.internalFormat || options.format || RGBA;
  const formatType = getFormatAndTypeForInternalFormat(internalFormat);
  const format = options.format || formatType.format;
  const type = options.type || UNSIGNED_BYTE$2;
  const target = options.target || TEXTURE_2D;

  if (target !== TEXTURE_CUBE_MAP) {
    throw "target must be TEXTURE_CUBE_MAP";
  }

  setTextureTo1PixelColor(gl, tex, options); // Because it's async we need to copy the options.

  options = Object.assign({}, options);
  let numToLoad = 6;
  const errors = [];
  const faces = getCubeFaceOrder(gl, options);
  let imgs; // eslint-disable-line

  function uploadImg(faceTarget) {
    return function (err, img) {
      --numToLoad;

      if (err) {
        errors.push(err);
      } else {
        if (img.width !== img.height) {
          errors.push("cubemap face img is not a square: " + img.src);
        } else {
          setPackState(gl, options);
          gl.bindTexture(target, tex); // So assuming this is the first image we now have one face that's img sized
          // and 5 faces that are 1x1 pixel so size the other faces

          if (numToLoad === 5) {
            // use the default order
            getCubeFaceOrder().forEach(function (otherTarget) {
              // Should we re-use the same face or a color?
              gl.texImage2D(otherTarget, level, internalFormat, format, type, img);
            });
          } else {
            gl.texImage2D(faceTarget, level, internalFormat, format, type, img);
          }

          if (shouldAutomaticallySetTextureFilteringForSize(options)) {
            gl.generateMipmap(target);
          }
        }
      }

      if (numToLoad === 0) {
        callback(errors.length ? errors : undefined, tex, imgs);
      }
    };
  }

  imgs = urls.map(function (url, ndx) {
    return loadAndUseImage(url, options.crossOrigin, uploadImg(faces[ndx]));
  });
}
/**
 * Loads a 2d array or 3d texture from urls OR TexImageSources as specified in `options.src`.
 * Will set the texture to a 1x1 pixel color
 * so that it is usable immediately unless `option.color === false`.
 *
 * If the width and height is not specified the width and height of the first
 * image loaded will be used. Note that since images are loaded async
 * which image downloads first is unknown.
 *
 * If an image is not the same size as the width and height it will be scaled
 * to that width and height.
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLTexture} tex the WebGLTexture to set parameters for
 * @param {module:twgl.TextureOptions} options A TextureOptions object with whatever parameters you want set.
 * @param {module:twgl.ThreeDReadyCallback} [callback] A function to be called when all the images have finished loading. err will
 *    be non null if there was an error.
 * @memberOf module:twgl/textures
 */


function loadSlicesFromUrls(gl, tex, options, callback) {
  callback = callback || noop;
  const urls = options.src;
  const internalFormat = options.internalFormat || options.format || RGBA;
  const formatType = getFormatAndTypeForInternalFormat(internalFormat);
  const format = options.format || formatType.format;
  const type = options.type || UNSIGNED_BYTE$2;
  const target = options.target || TEXTURE_2D_ARRAY;

  if (target !== TEXTURE_3D && target !== TEXTURE_2D_ARRAY) {
    throw "target must be TEXTURE_3D or TEXTURE_2D_ARRAY";
  }

  setTextureTo1PixelColor(gl, tex, options); // Because it's async we need to copy the options.

  options = Object.assign({}, options);
  let numToLoad = urls.length;
  const errors = [];
  let imgs; // eslint-disable-line

  const level = options.level || 0;
  let width = options.width;
  let height = options.height;
  const depth = urls.length;
  let firstImage = true;

  function uploadImg(slice) {
    return function (err, img) {
      --numToLoad;

      if (err) {
        errors.push(err);
      } else {
        setPackState(gl, options);
        gl.bindTexture(target, tex);

        if (firstImage) {
          firstImage = false;
          width = options.width || img.width;
          height = options.height || img.height;
          gl.texImage3D(target, level, internalFormat, width, height, depth, 0, format, type, null); // put it in every slice otherwise some slices will be 0,0,0,0

          for (let s = 0; s < depth; ++s) {
            gl.texSubImage3D(target, level, 0, 0, s, width, height, 1, format, type, img);
          }
        } else {
          let src = img;
          let ctx;

          if (img.width !== width || img.height !== height) {
            // Size the image to fix
            ctx = getShared2DContext();
            src = ctx.canvas;
            ctx.canvas.width = width;
            ctx.canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
          }

          gl.texSubImage3D(target, level, 0, 0, slice, width, height, 1, format, type, src); // free the canvas memory

          if (ctx && src === ctx.canvas) {
            ctx.canvas.width = 0;
            ctx.canvas.height = 0;
          }
        }

        if (shouldAutomaticallySetTextureFilteringForSize(options)) {
          gl.generateMipmap(target);
        }
      }

      if (numToLoad === 0) {
        callback(errors.length ? errors : undefined, tex, imgs);
      }
    };
  }

  imgs = urls.map(function (url, ndx) {
    return loadAndUseImage(url, options.crossOrigin, uploadImg(ndx));
  });
}
/**
 * Sets a texture from an array or typed array. If the width or height is not provided will attempt to
 * guess the size. See {@link module:twgl.TextureOptions}.
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLTexture} tex the WebGLTexture to set parameters for
 * @param {(number[]|ArrayBufferView)} src An array or typed arry with texture data.
 * @param {module:twgl.TextureOptions} [options] A TextureOptions object with whatever parameters you want set.
 *   This is often the same options you passed in when you created the texture.
 * @memberOf module:twgl/textures
 */


function setTextureFromArray(gl, tex, src, options) {
  options = options || defaults$1.textureOptions;
  const target = options.target || TEXTURE_2D;
  gl.bindTexture(target, tex);
  let width = options.width;
  let height = options.height;
  let depth = options.depth;
  const level = options.level || 0;
  const internalFormat = options.internalFormat || options.format || RGBA;
  const formatType = getFormatAndTypeForInternalFormat(internalFormat);
  const format = options.format || formatType.format;
  const type = options.type || getTextureTypeForArrayType(gl, src, formatType.type);

  if (!isArrayBuffer$1(src)) {
    const Type = getTypedArrayTypeForGLType(type);
    src = new Type(src);
  } else if (src instanceof Uint8ClampedArray) {
    src = new Uint8Array(src.buffer);
  }

  const bytesPerElement = getBytesPerElementForInternalFormat(internalFormat, type);
  const numElements = src.byteLength / bytesPerElement; // TODO: check UNPACK_ALIGNMENT?

  if (numElements % 1) {
    throw "length wrong size for format: " + glEnumToString(gl, format);
  }

  let dimensions;

  if (target === TEXTURE_3D || target === TEXTURE_2D_ARRAY) {
    if (!width && !height && !depth) {
      const size = Math.cbrt(numElements);

      if (size % 1 !== 0) {
        throw "can't guess cube size of array of numElements: " + numElements;
      }

      width = size;
      height = size;
      depth = size;
    } else if (width && (!height || !depth)) {
      dimensions = guessDimensions(gl, target, height, depth, numElements / width);
      height = dimensions.width;
      depth = dimensions.height;
    } else if (height && (!width || !depth)) {
      dimensions = guessDimensions(gl, target, width, depth, numElements / height);
      width = dimensions.width;
      depth = dimensions.height;
    } else {
      dimensions = guessDimensions(gl, target, width, height, numElements / depth);
      width = dimensions.width;
      height = dimensions.height;
    }
  } else {
    dimensions = guessDimensions(gl, target, width, height, numElements);
    width = dimensions.width;
    height = dimensions.height;
  }

  setSkipStateToDefault(gl);
  gl.pixelStorei(UNPACK_ALIGNMENT, options.unpackAlignment || 1);
  setPackState(gl, options);

  if (target === TEXTURE_CUBE_MAP) {
    const elementsPerElement = bytesPerElement / src.BYTES_PER_ELEMENT;
    const faceSize = numElements / 6 * elementsPerElement;
    getCubeFacesWithNdx(gl, options).forEach(f => {
      const offset = faceSize * f.ndx;
      const data = src.subarray(offset, offset + faceSize);
      gl.texImage2D(f.face, level, internalFormat, width, height, 0, format, type, data);
    });
  } else if (target === TEXTURE_3D || target === TEXTURE_2D_ARRAY) {
    gl.texImage3D(target, level, internalFormat, width, height, depth, 0, format, type, src);
  } else {
    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, src);
  }

  return {
    width: width,
    height: height,
    depth: depth,
    type: type
  };
}
/**
 * Sets a texture with no contents of a certain size. In other words calls `gl.texImage2D` with `null`.
 * You must set `options.width` and `options.height`.
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLTexture} tex the WebGLTexture to set parameters for
 * @param {module:twgl.TextureOptions} options A TextureOptions object with whatever parameters you want set.
 * @memberOf module:twgl/textures
 */


function setEmptyTexture(gl, tex, options) {
  const target = options.target || TEXTURE_2D;
  gl.bindTexture(target, tex);
  const level = options.level || 0;
  const internalFormat = options.internalFormat || options.format || RGBA;
  const formatType = getFormatAndTypeForInternalFormat(internalFormat);
  const format = options.format || formatType.format;
  const type = options.type || formatType.type;
  setPackState(gl, options);

  if (target === TEXTURE_CUBE_MAP) {
    for (let ii = 0; ii < 6; ++ii) {
      gl.texImage2D(TEXTURE_CUBE_MAP_POSITIVE_X + ii, level, internalFormat, options.width, options.height, 0, format, type, null);
    }
  } else if (target === TEXTURE_3D || target === TEXTURE_2D_ARRAY) {
    gl.texImage3D(target, level, internalFormat, options.width, options.height, options.depth, 0, format, type, null);
  } else {
    gl.texImage2D(target, level, internalFormat, options.width, options.height, 0, format, type, null);
  }
}
/**
 * Creates a texture based on the options passed in.
 *
 * Note: may reset UNPACK_ALIGNMENT, UNPACK_ROW_LENGTH, UNPACK_IMAGE_HEIGHT, UNPACK_SKIP_IMAGES
 * UNPACK_SKIP_PIXELS, and UNPACK_SKIP_ROWS
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {module:twgl.TextureOptions} [options] A TextureOptions object with whatever parameters you want set.
 * @param {module:twgl.TextureReadyCallback} [callback] A callback called when an image has been downloaded and uploaded to the texture.
 * @return {WebGLTexture} the created texture.
 * @memberOf module:twgl/textures
 */


function createTexture(gl, options, callback) {
  callback = callback || noop;
  options = options || defaults$1.textureOptions;
  const tex = gl.createTexture();
  const target = options.target || TEXTURE_2D;
  let width = options.width || 1;
  let height = options.height || 1;
  const internalFormat = options.internalFormat || RGBA;
  gl.bindTexture(target, tex);

  if (target === TEXTURE_CUBE_MAP) {
    // this should have been the default for cubemaps :(
    gl.texParameteri(target, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
    gl.texParameteri(target, TEXTURE_WRAP_T, CLAMP_TO_EDGE);
  }

  let src = options.src;

  if (src) {
    if (typeof src === "function") {
      src = src(gl, options);
    }

    if (typeof src === "string") {
      loadTextureFromUrl(gl, tex, options, callback);
    } else if (isArrayBuffer$1(src) || Array.isArray(src) && (typeof src[0] === 'number' || Array.isArray(src[0]) || isArrayBuffer$1(src[0]))) {
      const dimensions = setTextureFromArray(gl, tex, src, options);
      width = dimensions.width;
      height = dimensions.height;
    } else if (Array.isArray(src) && (typeof src[0] === 'string' || isTexImageSource(src[0]))) {
      if (target === TEXTURE_CUBE_MAP) {
        loadCubemapFromUrls(gl, tex, options, callback);
      } else {
        loadSlicesFromUrls(gl, tex, options, callback);
      }
    } else {
      // if (isTexImageSource(src))
      setTextureFromElement(gl, tex, src, options);
      width = src.width;
      height = src.height;
    }
  } else {
    setEmptyTexture(gl, tex, options);
  }

  if (shouldAutomaticallySetTextureFilteringForSize(options)) {
    setTextureFilteringForSize(gl, tex, options, width, height, internalFormat);
  }

  setTextureParameters(gl, tex, options);
  return tex;
}
/**
 * Resizes a texture based on the options passed in.
 *
 * Note: This is not a generic resize anything function.
 * It's mostly used by {@link module:twgl.resizeFramebufferInfo}
 * It will use `options.src` if it exists to try to determine a `type`
 * otherwise it will assume `gl.UNSIGNED_BYTE`. No data is provided
 * for the texture. Texture parameters will be set accordingly
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {WebGLTexture} tex the texture to resize
 * @param {module:twgl.TextureOptions} options A TextureOptions object with whatever parameters you want set.
 * @param {number} [width] the new width. If not passed in will use `options.width`
 * @param {number} [height] the new height. If not passed in will use `options.height`
 * @param {number} [depth] the new depth. If not passed in will use `options.depth`
 * @memberOf module:twgl/textures
 */


function resizeTexture(gl, tex, options, width, height, depth) {
  width = width || options.width;
  height = height || options.height;
  depth = depth || options.depth;
  const target = options.target || TEXTURE_2D;
  gl.bindTexture(target, tex);
  const level = options.level || 0;
  const internalFormat = options.internalFormat || options.format || RGBA;
  const formatType = getFormatAndTypeForInternalFormat(internalFormat);
  const format = options.format || formatType.format;
  let type;
  const src = options.src;

  if (!src) {
    type = options.type || formatType.type;
  } else if (isArrayBuffer$1(src) || Array.isArray(src) && typeof src[0] === 'number') {
    type = options.type || getTextureTypeForArrayType(gl, src, formatType.type);
  } else {
    type = options.type || formatType.type;
  }

  if (target === TEXTURE_CUBE_MAP) {
    for (let ii = 0; ii < 6; ++ii) {
      gl.texImage2D(TEXTURE_CUBE_MAP_POSITIVE_X + ii, level, internalFormat, width, height, 0, format, type, null);
    }
  } else if (target === TEXTURE_3D || target === TEXTURE_2D_ARRAY) {
    gl.texImage3D(target, level, internalFormat, width, height, depth, 0, format, type, null);
  } else {
    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
  }
}
/**
 * Check if a src is an async request.
 * if src is a string we're going to download an image
 * if src is an array of strings we're going to download cubemap images
 * @param {*} src The src from a TextureOptions
 * @returns {bool} true if src is async.
 * @private
 */


function isAsyncSrc(src) {
  return typeof src === 'string' || Array.isArray(src) && typeof src[0] === 'string';
}
/**
 * Creates a bunch of textures based on the passed in options.
 *
 * Example:
 *
 *     const textures = twgl.createTextures(gl, {
 *       // a power of 2 image
 *       hftIcon: { src: "images/hft-icon-16.png", mag: gl.NEAREST },
 *       // a non-power of 2 image
 *       clover: { src: "images/clover.jpg" },
 *       // From a canvas
 *       fromCanvas: { src: ctx.canvas },
 *       // A cubemap from 6 images
 *       yokohama: {
 *         target: gl.TEXTURE_CUBE_MAP,
 *         src: [
 *           'images/yokohama/posx.jpg',
 *           'images/yokohama/negx.jpg',
 *           'images/yokohama/posy.jpg',
 *           'images/yokohama/negy.jpg',
 *           'images/yokohama/posz.jpg',
 *           'images/yokohama/negz.jpg',
 *         ],
 *       },
 *       // A cubemap from 1 image (can be 1x6, 2x3, 3x2, 6x1)
 *       goldengate: {
 *         target: gl.TEXTURE_CUBE_MAP,
 *         src: 'images/goldengate.jpg',
 *       },
 *       // A 2x2 pixel texture from a JavaScript array
 *       checker: {
 *         mag: gl.NEAREST,
 *         min: gl.LINEAR,
 *         src: [
 *           255,255,255,255,
 *           192,192,192,255,
 *           192,192,192,255,
 *           255,255,255,255,
 *         ],
 *       },
 *       // a 1x2 pixel texture from a typed array.
 *       stripe: {
 *         mag: gl.NEAREST,
 *         min: gl.LINEAR,
 *         format: gl.LUMINANCE,
 *         src: new Uint8Array([
 *           255,
 *           128,
 *           255,
 *           128,
 *           255,
 *           128,
 *           255,
 *           128,
 *         ]),
 *         width: 1,
 *       },
 *     });
 *
 * Now
 *
 * *   `textures.hftIcon` will be a 2d texture
 * *   `textures.clover` will be a 2d texture
 * *   `textures.fromCanvas` will be a 2d texture
 * *   `textures.yohohama` will be a cubemap texture
 * *   `textures.goldengate` will be a cubemap texture
 * *   `textures.checker` will be a 2d texture
 * *   `textures.stripe` will be a 2d texture
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {Object.<string,module:twgl.TextureOptions>} options A object of TextureOptions one per texture.
 * @param {module:twgl.TexturesReadyCallback} [callback] A callback called when all textures have been downloaded.
 * @return {Object.<string,WebGLTexture>} the created textures by name
 * @memberOf module:twgl/textures
 */


function createTextures(gl, textureOptions, callback) {
  callback = callback || noop;
  let numDownloading = 0;
  const errors = [];
  const textures = {};
  const images = {};

  function callCallbackIfReady() {
    if (numDownloading === 0) {
      setTimeout(function () {
        callback(errors.length ? errors : undefined, textures, images);
      }, 0);
    }
  }

  Object.keys(textureOptions).forEach(function (name) {
    const options = textureOptions[name];
    let onLoadFn;

    if (isAsyncSrc(options.src)) {
      onLoadFn = function (err, tex, img) {
        images[name] = img;
        --numDownloading;

        if (err) {
          errors.push(err);
        }

        callCallbackIfReady();
      };

      ++numDownloading;
    }

    textures[name] = createTexture(gl, options, onLoadFn);
  }); // queue the callback if there are no images to download.
  // We do this because if your code is structured to wait for
  // images to download but then you comment out all the async
  // images your code would break.

  callCallbackIfReady();
  return textures;
}

var textures = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setTextureDefaults_: setDefaults$1,
  createSampler: createSampler,
  createSamplers: createSamplers,
  setSamplerParameters: setSamplerParameters,
  createTexture: createTexture,
  setEmptyTexture: setEmptyTexture,
  setTextureFromArray: setTextureFromArray,
  loadTextureFromUrl: loadTextureFromUrl,
  setTextureFromElement: setTextureFromElement,
  setTextureFilteringForSize: setTextureFilteringForSize,
  setTextureParameters: setTextureParameters,
  setDefaultTextureColor: setDefaultTextureColor,
  createTextures: createTextures,
  resizeTexture: resizeTexture,
  canGenerateMipmap: canGenerateMipmap,
  canFilter: canFilter,
  getNumComponentsForFormat: getNumComponentsForFormat,
  getBytesPerElementForInternalFormat: getBytesPerElementForInternalFormat,
  getFormatAndTypeForInternalFormat: getFormatAndTypeForInternalFormat
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * Low level shader program related functions
 *
 * You should generally not need to use these functions. They are provided
 * for those cases where you're doing something out of the ordinary
 * and you need lower level access.
 *
 * For backward compatibility they are available at both `twgl.programs` and `twgl`
 * itself
 *
 * See {@link module:twgl} for core functions
 *
 * @module twgl/programs
 */

exports.textures = textures;
const error$1 = error;
const warn$1 = warn;

function getElementById(id) {
  return typeof document !== 'undefined' && document.getElementById ? document.getElementById(id) : null;
}

const TEXTURE0 = 0x84c0;
const DYNAMIC_DRAW = 0x88e8;
const ARRAY_BUFFER$1 = 0x8892;
const ELEMENT_ARRAY_BUFFER$1 = 0x8893;
const UNIFORM_BUFFER = 0x8a11;
const TRANSFORM_FEEDBACK_BUFFER = 0x8c8e;
const TRANSFORM_FEEDBACK = 0x8e22;
const COMPILE_STATUS = 0x8b81;
const LINK_STATUS = 0x8b82;
const FRAGMENT_SHADER = 0x8b30;
const VERTEX_SHADER = 0x8b31;
const SEPARATE_ATTRIBS = 0x8c8d;
const ACTIVE_UNIFORMS = 0x8b86;
const ACTIVE_ATTRIBUTES = 0x8b89;
const TRANSFORM_FEEDBACK_VARYINGS = 0x8c83;
const ACTIVE_UNIFORM_BLOCKS = 0x8a36;
const UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 0x8a44;
const UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8a46;
const UNIFORM_BLOCK_DATA_SIZE = 0x8a40;
const UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 0x8a43;
const FLOAT$3 = 0x1406;
const FLOAT_VEC2 = 0x8B50;
const FLOAT_VEC3 = 0x8B51;
const FLOAT_VEC4 = 0x8B52;
const INT$3 = 0x1404;
const INT_VEC2 = 0x8B53;
const INT_VEC3 = 0x8B54;
const INT_VEC4 = 0x8B55;
const BOOL = 0x8B56;
const BOOL_VEC2 = 0x8B57;
const BOOL_VEC3 = 0x8B58;
const BOOL_VEC4 = 0x8B59;
const FLOAT_MAT2 = 0x8B5A;
const FLOAT_MAT3 = 0x8B5B;
const FLOAT_MAT4 = 0x8B5C;
const SAMPLER_2D = 0x8B5E;
const SAMPLER_CUBE = 0x8B60;
const SAMPLER_3D = 0x8B5F;
const SAMPLER_2D_SHADOW = 0x8B62;
const FLOAT_MAT2x3 = 0x8B65;
const FLOAT_MAT2x4 = 0x8B66;
const FLOAT_MAT3x2 = 0x8B67;
const FLOAT_MAT3x4 = 0x8B68;
const FLOAT_MAT4x2 = 0x8B69;
const FLOAT_MAT4x3 = 0x8B6A;
const SAMPLER_2D_ARRAY = 0x8DC1;
const SAMPLER_2D_ARRAY_SHADOW = 0x8DC4;
const SAMPLER_CUBE_SHADOW = 0x8DC5;
const UNSIGNED_INT$3 = 0x1405;
const UNSIGNED_INT_VEC2 = 0x8DC6;
const UNSIGNED_INT_VEC3 = 0x8DC7;
const UNSIGNED_INT_VEC4 = 0x8DC8;
const INT_SAMPLER_2D = 0x8DCA;
const INT_SAMPLER_3D = 0x8DCB;
const INT_SAMPLER_CUBE = 0x8DCC;
const INT_SAMPLER_2D_ARRAY = 0x8DCF;
const UNSIGNED_INT_SAMPLER_2D = 0x8DD2;
const UNSIGNED_INT_SAMPLER_3D = 0x8DD3;
const UNSIGNED_INT_SAMPLER_CUBE = 0x8DD4;
const UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7;
const TEXTURE_2D$1 = 0x0DE1;
const TEXTURE_CUBE_MAP$1 = 0x8513;
const TEXTURE_3D$1 = 0x806F;
const TEXTURE_2D_ARRAY$1 = 0x8C1A;
const typeMap = {};
/**
 * Returns the corresponding bind point for a given sampler type
 */

function getBindPointForSamplerType(gl, type) {
  return typeMap[type].bindPoint;
} // This kind of sucks! If you could compose functions as in `var fn = gl[name];`
// this code could be a lot smaller but that is sadly really slow (T_T)


function floatSetter(gl, location) {
  return function (v) {
    gl.uniform1f(location, v);
  };
}

function floatArraySetter(gl, location) {
  return function (v) {
    gl.uniform1fv(location, v);
  };
}

function floatVec2Setter(gl, location) {
  return function (v) {
    gl.uniform2fv(location, v);
  };
}

function floatVec3Setter(gl, location) {
  return function (v) {
    gl.uniform3fv(location, v);
  };
}

function floatVec4Setter(gl, location) {
  return function (v) {
    gl.uniform4fv(location, v);
  };
}

function intSetter(gl, location) {
  return function (v) {
    gl.uniform1i(location, v);
  };
}

function intArraySetter(gl, location) {
  return function (v) {
    gl.uniform1iv(location, v);
  };
}

function intVec2Setter(gl, location) {
  return function (v) {
    gl.uniform2iv(location, v);
  };
}

function intVec3Setter(gl, location) {
  return function (v) {
    gl.uniform3iv(location, v);
  };
}

function intVec4Setter(gl, location) {
  return function (v) {
    gl.uniform4iv(location, v);
  };
}

function uintSetter(gl, location) {
  return function (v) {
    gl.uniform1ui(location, v);
  };
}

function uintArraySetter(gl, location) {
  return function (v) {
    gl.uniform1uiv(location, v);
  };
}

function uintVec2Setter(gl, location) {
  return function (v) {
    gl.uniform2uiv(location, v);
  };
}

function uintVec3Setter(gl, location) {
  return function (v) {
    gl.uniform3uiv(location, v);
  };
}

function uintVec4Setter(gl, location) {
  return function (v) {
    gl.uniform4uiv(location, v);
  };
}

function floatMat2Setter(gl, location) {
  return function (v) {
    gl.uniformMatrix2fv(location, false, v);
  };
}

function floatMat3Setter(gl, location) {
  return function (v) {
    gl.uniformMatrix3fv(location, false, v);
  };
}

function floatMat4Setter(gl, location) {
  return function (v) {
    gl.uniformMatrix4fv(location, false, v);
  };
}

function floatMat23Setter(gl, location) {
  return function (v) {
    gl.uniformMatrix2x3fv(location, false, v);
  };
}

function floatMat32Setter(gl, location) {
  return function (v) {
    gl.uniformMatrix3x2fv(location, false, v);
  };
}

function floatMat24Setter(gl, location) {
  return function (v) {
    gl.uniformMatrix2x4fv(location, false, v);
  };
}

function floatMat42Setter(gl, location) {
  return function (v) {
    gl.uniformMatrix4x2fv(location, false, v);
  };
}

function floatMat34Setter(gl, location) {
  return function (v) {
    gl.uniformMatrix3x4fv(location, false, v);
  };
}

function floatMat43Setter(gl, location) {
  return function (v) {
    gl.uniformMatrix4x3fv(location, false, v);
  };
}

function samplerSetter(gl, type, unit, location) {
  const bindPoint = getBindPointForSamplerType(gl, type);
  return isWebGL2(gl) ? function (textureOrPair) {
    let texture;
    let sampler;

    if (isTexture(gl, textureOrPair)) {
      texture = textureOrPair;
      sampler = null;
    } else {
      texture = textureOrPair.texture;
      sampler = textureOrPair.sampler;
    }

    gl.uniform1i(location, unit);
    gl.activeTexture(TEXTURE0 + unit);
    gl.bindTexture(bindPoint, texture);
    gl.bindSampler(unit, sampler);
  } : function (texture) {
    gl.uniform1i(location, unit);
    gl.activeTexture(TEXTURE0 + unit);
    gl.bindTexture(bindPoint, texture);
  };
}

function samplerArraySetter(gl, type, unit, location, size) {
  const bindPoint = getBindPointForSamplerType(gl, type);
  const units = new Int32Array(size);

  for (let ii = 0; ii < size; ++ii) {
    units[ii] = unit + ii;
  }

  return isWebGL2(gl) ? function (textures) {
    gl.uniform1iv(location, units);
    textures.forEach(function (textureOrPair, index) {
      gl.activeTexture(TEXTURE0 + units[index]);
      let texture;
      let sampler;

      if (isTexture(gl, textureOrPair)) {
        texture = textureOrPair;
        sampler = null;
      } else {
        texture = textureOrPair.texture;
        sampler = textureOrPair.sampler;
      }

      gl.bindSampler(unit, sampler);
      gl.bindTexture(bindPoint, texture);
    });
  } : function (textures) {
    gl.uniform1iv(location, units);
    textures.forEach(function (texture, index) {
      gl.activeTexture(TEXTURE0 + units[index]);
      gl.bindTexture(bindPoint, texture);
    });
  };
}

typeMap[FLOAT$3] = {
  Type: Float32Array,
  size: 4,
  setter: floatSetter,
  arraySetter: floatArraySetter
};
typeMap[FLOAT_VEC2] = {
  Type: Float32Array,
  size: 8,
  setter: floatVec2Setter
};
typeMap[FLOAT_VEC3] = {
  Type: Float32Array,
  size: 12,
  setter: floatVec3Setter
};
typeMap[FLOAT_VEC4] = {
  Type: Float32Array,
  size: 16,
  setter: floatVec4Setter
};
typeMap[INT$3] = {
  Type: Int32Array,
  size: 4,
  setter: intSetter,
  arraySetter: intArraySetter
};
typeMap[INT_VEC2] = {
  Type: Int32Array,
  size: 8,
  setter: intVec2Setter
};
typeMap[INT_VEC3] = {
  Type: Int32Array,
  size: 12,
  setter: intVec3Setter
};
typeMap[INT_VEC4] = {
  Type: Int32Array,
  size: 16,
  setter: intVec4Setter
};
typeMap[UNSIGNED_INT$3] = {
  Type: Uint32Array,
  size: 4,
  setter: uintSetter,
  arraySetter: uintArraySetter
};
typeMap[UNSIGNED_INT_VEC2] = {
  Type: Uint32Array,
  size: 8,
  setter: uintVec2Setter
};
typeMap[UNSIGNED_INT_VEC3] = {
  Type: Uint32Array,
  size: 12,
  setter: uintVec3Setter
};
typeMap[UNSIGNED_INT_VEC4] = {
  Type: Uint32Array,
  size: 16,
  setter: uintVec4Setter
};
typeMap[BOOL] = {
  Type: Uint32Array,
  size: 4,
  setter: intSetter,
  arraySetter: intArraySetter
};
typeMap[BOOL_VEC2] = {
  Type: Uint32Array,
  size: 8,
  setter: intVec2Setter
};
typeMap[BOOL_VEC3] = {
  Type: Uint32Array,
  size: 12,
  setter: intVec3Setter
};
typeMap[BOOL_VEC4] = {
  Type: Uint32Array,
  size: 16,
  setter: intVec4Setter
};
typeMap[FLOAT_MAT2] = {
  Type: Float32Array,
  size: 16,
  setter: floatMat2Setter
};
typeMap[FLOAT_MAT3] = {
  Type: Float32Array,
  size: 36,
  setter: floatMat3Setter
};
typeMap[FLOAT_MAT4] = {
  Type: Float32Array,
  size: 64,
  setter: floatMat4Setter
};
typeMap[FLOAT_MAT2x3] = {
  Type: Float32Array,
  size: 24,
  setter: floatMat23Setter
};
typeMap[FLOAT_MAT2x4] = {
  Type: Float32Array,
  size: 32,
  setter: floatMat24Setter
};
typeMap[FLOAT_MAT3x2] = {
  Type: Float32Array,
  size: 24,
  setter: floatMat32Setter
};
typeMap[FLOAT_MAT3x4] = {
  Type: Float32Array,
  size: 48,
  setter: floatMat34Setter
};
typeMap[FLOAT_MAT4x2] = {
  Type: Float32Array,
  size: 32,
  setter: floatMat42Setter
};
typeMap[FLOAT_MAT4x3] = {
  Type: Float32Array,
  size: 48,
  setter: floatMat43Setter
};
typeMap[SAMPLER_2D] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_2D$1
};
typeMap[SAMPLER_CUBE] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_CUBE_MAP$1
};
typeMap[SAMPLER_3D] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_3D$1
};
typeMap[SAMPLER_2D_SHADOW] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_2D$1
};
typeMap[SAMPLER_2D_ARRAY] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_2D_ARRAY$1
};
typeMap[SAMPLER_2D_ARRAY_SHADOW] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_2D_ARRAY$1
};
typeMap[SAMPLER_CUBE_SHADOW] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_CUBE_MAP$1
};
typeMap[INT_SAMPLER_2D] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_2D$1
};
typeMap[INT_SAMPLER_3D] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_3D$1
};
typeMap[INT_SAMPLER_CUBE] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_CUBE_MAP$1
};
typeMap[INT_SAMPLER_2D_ARRAY] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_2D_ARRAY$1
};
typeMap[UNSIGNED_INT_SAMPLER_2D] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_2D$1
};
typeMap[UNSIGNED_INT_SAMPLER_3D] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_3D$1
};
typeMap[UNSIGNED_INT_SAMPLER_CUBE] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_CUBE_MAP$1
};
typeMap[UNSIGNED_INT_SAMPLER_2D_ARRAY] = {
  Type: null,
  size: 0,
  setter: samplerSetter,
  arraySetter: samplerArraySetter,
  bindPoint: TEXTURE_2D_ARRAY$1
};

function floatAttribSetter(gl, index) {
  return function (b) {
    if (b.value) {
      gl.disableVertexAttribArray(index);

      switch (b.value.length) {
        case 4:
          gl.vertexAttrib4fv(index, b.value);
          break;

        case 3:
          gl.vertexAttrib3fv(index, b.value);
          break;

        case 2:
          gl.vertexAttrib2fv(index, b.value);
          break;

        case 1:
          gl.vertexAttrib1fv(index, b.value);
          break;

        default:
          throw new Error('the length of a float constant value must be between 1 and 4!');
      }
    } else {
      gl.bindBuffer(ARRAY_BUFFER$1, b.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(index, b.numComponents || b.size, b.type || FLOAT$3, b.normalize || false, b.stride || 0, b.offset || 0);

      if (b.divisor !== undefined) {
        gl.vertexAttribDivisor(index, b.divisor);
      }
    }
  };
}

function intAttribSetter(gl, index) {
  return function (b) {
    if (b.value) {
      gl.disableVertexAttribArray(index);

      if (b.value.length === 4) {
        gl.vertexAttrib4iv(index, b.value);
      } else {
        throw new Error('The length of an integer constant value must be 4!');
      }
    } else {
      gl.bindBuffer(ARRAY_BUFFER$1, b.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribIPointer(index, b.numComponents || b.size, b.type || INT$3, b.stride || 0, b.offset || 0);

      if (b.divisor !== undefined) {
        gl.vertexAttribDivisor(index, b.divisor);
      }
    }
  };
}

function uintAttribSetter(gl, index) {
  return function (b) {
    if (b.value) {
      gl.disableVertexAttribArray(index);

      if (b.value.length === 4) {
        gl.vertexAttrib4uiv(index, b.value);
      } else {
        throw new Error('The length of an unsigned integer constant value must be 4!');
      }
    } else {
      gl.bindBuffer(ARRAY_BUFFER$1, b.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribIPointer(index, b.numComponents || b.size, b.type || UNSIGNED_INT$3, b.stride || 0, b.offset || 0);

      if (b.divisor !== undefined) {
        gl.vertexAttribDivisor(index, b.divisor);
      }
    }
  };
}

function matAttribSetter(gl, index, typeInfo) {
  const defaultSize = typeInfo.size;
  const count = typeInfo.count;
  return function (b) {
    gl.bindBuffer(ARRAY_BUFFER$1, b.buffer);
    const numComponents = b.size || b.numComponents || defaultSize;
    const size = numComponents / count;
    const type = b.type || FLOAT$3;
    const typeInfo = typeMap[type];
    const stride = typeInfo.size * numComponents;
    const normalize = b.normalize || false;
    const offset = b.offset || 0;
    const rowOffset = stride / count;

    for (let i = 0; i < count; ++i) {
      gl.enableVertexAttribArray(index + i);
      gl.vertexAttribPointer(index + i, size, type, normalize, stride, offset + rowOffset * i);

      if (b.divisor !== undefined) {
        gl.vertexAttribDivisor(index + i, b.divisor);
      }
    }
  };
}

const attrTypeMap = {};
attrTypeMap[FLOAT$3] = {
  size: 4,
  setter: floatAttribSetter
};
attrTypeMap[FLOAT_VEC2] = {
  size: 8,
  setter: floatAttribSetter
};
attrTypeMap[FLOAT_VEC3] = {
  size: 12,
  setter: floatAttribSetter
};
attrTypeMap[FLOAT_VEC4] = {
  size: 16,
  setter: floatAttribSetter
};
attrTypeMap[INT$3] = {
  size: 4,
  setter: intAttribSetter
};
attrTypeMap[INT_VEC2] = {
  size: 8,
  setter: intAttribSetter
};
attrTypeMap[INT_VEC3] = {
  size: 12,
  setter: intAttribSetter
};
attrTypeMap[INT_VEC4] = {
  size: 16,
  setter: intAttribSetter
};
attrTypeMap[UNSIGNED_INT$3] = {
  size: 4,
  setter: uintAttribSetter
};
attrTypeMap[UNSIGNED_INT_VEC2] = {
  size: 8,
  setter: uintAttribSetter
};
attrTypeMap[UNSIGNED_INT_VEC3] = {
  size: 12,
  setter: uintAttribSetter
};
attrTypeMap[UNSIGNED_INT_VEC4] = {
  size: 16,
  setter: uintAttribSetter
};
attrTypeMap[BOOL] = {
  size: 4,
  setter: intAttribSetter
};
attrTypeMap[BOOL_VEC2] = {
  size: 8,
  setter: intAttribSetter
};
attrTypeMap[BOOL_VEC3] = {
  size: 12,
  setter: intAttribSetter
};
attrTypeMap[BOOL_VEC4] = {
  size: 16,
  setter: intAttribSetter
};
attrTypeMap[FLOAT_MAT2] = {
  size: 4,
  setter: matAttribSetter,
  count: 2
};
attrTypeMap[FLOAT_MAT3] = {
  size: 9,
  setter: matAttribSetter,
  count: 3
};
attrTypeMap[FLOAT_MAT4] = {
  size: 16,
  setter: matAttribSetter,
  count: 4
};
const errorRE = /ERROR:\s*\d+:(\d+)/gi;

function addLineNumbersWithError(src, log = '', lineOffset = 0) {
  // Note: Error message formats are not defined by any spec so this may or may not work.
  const matches = [...log.matchAll(errorRE)];
  const lineNoToErrorMap = new Map(matches.map((m, ndx) => {
    const lineNo = parseInt(m[1]);
    const next = matches[ndx + 1];
    const end = next ? next.index : log.length;
    const msg = log.substring(m.index, end);
    return [lineNo - 1, msg];
  }));
  return src.split('\n').map((line, lineNo) => {
    const err = lineNoToErrorMap.get(lineNo);
    return `${lineNo + 1 + lineOffset}: ${line}${err ? `\n\n^^^ ${err}` : ''}`;
  }).join('\n');
}
/**
 * Error Callback
 * @callback ErrorCallback
 * @param {string} msg error message.
 * @param {number} [lineOffset] amount to add to line number
 * @memberOf module:twgl
 */


const spaceRE = /^[ \t]*\n/;
/**
 * Loads a shader.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {string} shaderSource The shader source.
 * @param {number} shaderType The type of shader.
 * @param {module:twgl.ErrorCallback} opt_errorCallback callback for errors.
 * @return {WebGLShader} The created shader.
 * @private
 */

function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
  const errFn = opt_errorCallback || error$1; // Create the shader object

  const shader = gl.createShader(shaderType); // Remove the first end of line because WebGL 2.0 requires
  // #version 300 es
  // as the first line. No whitespace allowed before that line
  // so
  //
  // <script>
  // #version 300 es
  // </script>
  //
  // Has one line before it which is invalid according to GLSL ES 3.00
  //

  let lineOffset = 0;

  if (spaceRE.test(shaderSource)) {
    lineOffset = 1;
    shaderSource = shaderSource.replace(spaceRE, '');
  } // Load the shader source


  gl.shaderSource(shader, shaderSource); // Compile the shader

  gl.compileShader(shader); // Check the compile status

  const compiled = gl.getShaderParameter(shader, COMPILE_STATUS);

  if (!compiled) {
    // Something went wrong during compilation; get the error
    const lastError = gl.getShaderInfoLog(shader);
    errFn(`${addLineNumbersWithError(shaderSource, lastError, lineOffset)}\nError compiling ${glEnumToString(gl, shaderType)}: ${lastError}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
/**
 * @typedef {Object} ProgramOptions
 * @property {function(string)} [errorCallback] callback for errors
 * @property {Object.<string,number>} [attribLocations] a attribute name to location map
 * @property {(module:twgl.BufferInfo|Object.<string,module:twgl.AttribInfo>|string[])} [transformFeedbackVaryings] If passed
 *   a BufferInfo will use the attribs names inside. If passed an object of AttribInfos will use the names from that object. Otherwise
 *   you can pass an array of names.
 * @property {number} [transformFeedbackMode] the mode to pass `gl.transformFeedbackVaryings`. Defaults to `SEPARATE_ATTRIBS`.
 * @memberOf module:twgl
 */

/**
 * Gets the program options based on all these optional arguments
 * @param {module:twgl.ProgramOptions|string[]} [opt_attribs] Options for the program or an array of attribs names. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @param {module:twgl.ErrorCallback} [opt_errorCallback] callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 * @return {module:twgl.ProgramOptions} an instance of ProgramOptions based on the arguments passed in
 * @private
 */


function getProgramOptions(opt_attribs, opt_locations, opt_errorCallback) {
  let transformFeedbackVaryings;
  let transformFeedbackMode;

  if (typeof opt_locations === 'function') {
    opt_errorCallback = opt_locations;
    opt_locations = undefined;
  }

  if (typeof opt_attribs === 'function') {
    opt_errorCallback = opt_attribs;
    opt_attribs = undefined;
  } else if (opt_attribs && !Array.isArray(opt_attribs)) {
    // If we have an errorCallback we can just return this object
    // Otherwise we need to construct one with default errorCallback
    if (opt_attribs.errorCallback) {
      return opt_attribs;
    }

    const opt = opt_attribs;
    opt_errorCallback = opt.errorCallback;
    opt_attribs = opt.attribLocations;
    transformFeedbackVaryings = opt.transformFeedbackVaryings;
    transformFeedbackMode = opt.transformFeedbackMode;
  }

  const options = {
    errorCallback: opt_errorCallback || error$1,
    transformFeedbackVaryings: transformFeedbackVaryings,
    transformFeedbackMode: transformFeedbackMode
  };

  if (opt_attribs) {
    let attribLocations = {};

    if (Array.isArray(opt_attribs)) {
      opt_attribs.forEach(function (attrib, ndx) {
        attribLocations[attrib] = opt_locations ? opt_locations[ndx] : ndx;
      });
    } else {
      attribLocations = opt_attribs;
    }

    options.attribLocations = attribLocations;
  }

  return options;
}

const defaultShaderType = ["VERTEX_SHADER", "FRAGMENT_SHADER"];

function getShaderTypeFromScriptType(gl, scriptType) {
  if (scriptType.indexOf("frag") >= 0) {
    return FRAGMENT_SHADER;
  } else if (scriptType.indexOf("vert") >= 0) {
    return VERTEX_SHADER;
  }

  return undefined;
}

function deleteShaders(gl, shaders) {
  shaders.forEach(function (shader) {
    gl.deleteShader(shader);
  });
}
/**
 * Creates a program, attaches (and/or compiles) shaders, binds attrib locations, links the
 * program and calls useProgram.
 *
 * NOTE: There are 4 signatures for this function
 *
 *     twgl.createProgram(gl, [vs, fs], options);
 *     twgl.createProgram(gl, [vs, fs], opt_errFunc);
 *     twgl.createProgram(gl, [vs, fs], opt_attribs, opt_errFunc);
 *     twgl.createProgram(gl, [vs, fs], opt_attribs, opt_locations, opt_errFunc);
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {WebGLShader[]|string[]} shaders The shaders to attach, or element ids for their source, or strings that contain their source
 * @param {module:twgl.ProgramOptions|string[]|module:twgl.ErrorCallback} [opt_attribs] Options for the program or an array of attribs names or an error callback. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations|module:twgl.ErrorCallback] The locations for the. A parallel array to opt_attribs letting you assign locations or an error callback.
 * @param {module:twgl.ErrorCallback} [opt_errorCallback] callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 * @return {WebGLProgram?} the created program or null if error.
 * @memberOf module:twgl/programs
 */


function createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
  const progOptions = getProgramOptions(opt_attribs, opt_locations, opt_errorCallback);
  const realShaders = [];
  const newShaders = [];

  for (let ndx = 0; ndx < shaders.length; ++ndx) {
    let shader = shaders[ndx];

    if (typeof shader === 'string') {
      const elem = getElementById(shader);
      const src = elem ? elem.text : shader;
      let type = gl[defaultShaderType[ndx]];

      if (elem && elem.type) {
        type = getShaderTypeFromScriptType(gl, elem.type) || type;
      }

      shader = loadShader(gl, src, type, progOptions.errorCallback);
      newShaders.push(shader);
    }

    if (isShader(gl, shader)) {
      realShaders.push(shader);
    }
  }

  if (realShaders.length !== shaders.length) {
    progOptions.errorCallback("not enough shaders for program");
    deleteShaders(gl, newShaders);
    return null;
  }

  const program = gl.createProgram();
  realShaders.forEach(function (shader) {
    gl.attachShader(program, shader);
  });

  if (progOptions.attribLocations) {
    Object.keys(progOptions.attribLocations).forEach(function (attrib) {
      gl.bindAttribLocation(program, progOptions.attribLocations[attrib], attrib);
    });
  }

  let varyings = progOptions.transformFeedbackVaryings;

  if (varyings) {
    if (varyings.attribs) {
      varyings = varyings.attribs;
    }

    if (!Array.isArray(varyings)) {
      varyings = Object.keys(varyings);
    }

    gl.transformFeedbackVaryings(program, varyings, progOptions.transformFeedbackMode || SEPARATE_ATTRIBS);
  }

  gl.linkProgram(program); // Check the link status

  const linked = gl.getProgramParameter(program, LINK_STATUS);

  if (!linked) {
    // something went wrong with the link
    const lastError = gl.getProgramInfoLog(program);
    progOptions.errorCallback(`${realShaders.map(shader => {
      const src = addLineNumbersWithError(gl.getShaderSource(shader), '', 0);
      const type = gl.getShaderParameter(shader, gl.SHADER_TYPE);
      return `${glEnumToString(gl, type)}\n${src}}`;
    }).join('\n')}\nError in program linking: ${lastError}`);
    gl.deleteProgram(program);
    deleteShaders(gl, newShaders);
    return null;
  }

  return program;
}
/**
 * Loads a shader from a script tag.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {string} scriptId The id of the script tag.
 * @param {number} [opt_shaderType] The type of shader. If not passed in it will
 *     be derived from the type of the script tag.
 * @param {module:twgl.ErrorCallback} [opt_errorCallback] callback for errors.
 * @return {WebGLShader?} The created shader or null if error.
 * @private
 */


function createShaderFromScript(gl, scriptId, opt_shaderType, opt_errorCallback) {
  let shaderSource = "";
  const shaderScript = getElementById(scriptId);

  if (!shaderScript) {
    throw new Error(`unknown script element: ${scriptId}`);
  }

  shaderSource = shaderScript.text;
  const shaderType = opt_shaderType || getShaderTypeFromScriptType(gl, shaderScript.type);

  if (!shaderType) {
    throw new Error('unknown shader type');
  }

  return loadShader(gl, shaderSource, shaderType, opt_errorCallback);
}
/**
 * Creates a program from 2 script tags.
 *
 * NOTE: There are 4 signatures for this function
 *
 *     twgl.createProgramFromScripts(gl, [vs, fs], opt_options);
 *     twgl.createProgramFromScripts(gl, [vs, fs], opt_errFunc);
 *     twgl.createProgramFromScripts(gl, [vs, fs], opt_attribs, opt_errFunc);
 *     twgl.createProgramFromScripts(gl, [vs, fs], opt_attribs, opt_locations, opt_errFunc);
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext
 *        to use.
 * @param {string[]} shaderScriptIds Array of ids of the script
 *        tags for the shaders. The first is assumed to be the
 *        vertex shader, the second the fragment shader.
 * @param {module:twgl.ProgramOptions|string[]|module:twgl.ErrorCallback} [opt_attribs] Options for the program or an array of attribs names or an error callback. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations|module:twgl.ErrorCallback] The locations for the. A parallel array to opt_attribs letting you assign locations or an error callback.
 * @param {module:twgl.ErrorCallback} [opt_errorCallback] callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 * @return {WebGLProgram?} the created program or null if error.
 * @memberOf module:twgl/programs
 */


function createProgramFromScripts(gl, shaderScriptIds, opt_attribs, opt_locations, opt_errorCallback) {
  const progOptions = getProgramOptions(opt_attribs, opt_locations, opt_errorCallback);
  const shaders = [];

  for (let ii = 0; ii < shaderScriptIds.length; ++ii) {
    const shader = createShaderFromScript(gl, shaderScriptIds[ii], gl[defaultShaderType[ii]], progOptions.errorCallback);

    if (!shader) {
      return null;
    }

    shaders.push(shader);
  }

  return createProgram(gl, shaders, progOptions);
}
/**
 * Creates a program from 2 sources.
 *
 * NOTE: There are 4 signatures for this function
 *
 *     twgl.createProgramFromSource(gl, [vs, fs], opt_options);
 *     twgl.createProgramFromSource(gl, [vs, fs], opt_errFunc);
 *     twgl.createProgramFromSource(gl, [vs, fs], opt_attribs, opt_errFunc);
 *     twgl.createProgramFromSource(gl, [vs, fs], opt_attribs, opt_locations, opt_errFunc);
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext
 *        to use.
 * @param {string[]} shaderSources Array of sources for the
 *        shaders. The first is assumed to be the vertex shader,
 *        the second the fragment shader.
 * @param {module:twgl.ProgramOptions|string[]|module:twgl.ErrorCallback} [opt_attribs] Options for the program or an array of attribs names or an error callback. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations|module:twgl.ErrorCallback] The locations for the. A parallel array to opt_attribs letting you assign locations or an error callback.
 * @param {module:twgl.ErrorCallback} [opt_errorCallback] callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 * @return {WebGLProgram?} the created program or null if error.
 * @memberOf module:twgl/programs
 */


function createProgramFromSources(gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
  const progOptions = getProgramOptions(opt_attribs, opt_locations, opt_errorCallback);
  const shaders = [];

  for (let ii = 0; ii < shaderSources.length; ++ii) {
    const shader = loadShader(gl, shaderSources[ii], gl[defaultShaderType[ii]], progOptions.errorCallback);

    if (!shader) {
      return null;
    }

    shaders.push(shader);
  }

  return createProgram(gl, shaders, progOptions);
}
/**
 * Returns true if attribute/uniform is a reserved/built in
 *
 * It makes no sense to me why GL returns these because it's
 * illegal to call `gl.getUniformLocation` and `gl.getAttribLocation`
 * with names that start with `gl_` (and `webgl_` in WebGL)
 *
 * I can only assume they are there because they might count
 * when computing the number of uniforms/attributes used when you want to
 * know if you are near the limit. That doesn't really make sense
 * to me but the fact that these get returned are in the spec.
 *
 * @param {WebGLActiveInfo} info As returned from `gl.getActiveUniform` or
 *    `gl.getActiveAttrib`.
 * @return {bool} true if it's reserved
 * @private
 */


function isBuiltIn(info) {
  const name = info.name;
  return name.startsWith("gl_") || name.startsWith("webgl_");
}
/**
 * Creates setter functions for all uniforms of a shader
 * program.
 *
 * @see {@link module:twgl.setUniforms}
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {WebGLProgram} program the program to create setters for.
 * @returns {Object.<string, function>} an object with a setter by name for each uniform
 * @memberOf module:twgl/programs
 */


function createUniformSetters(gl, program) {
  let textureUnit = 0;
  /**
   * Creates a setter for a uniform of the given program with it's
   * location embedded in the setter.
   * @param {WebGLProgram} program
   * @param {WebGLUniformInfo} uniformInfo
   * @returns {function} the created setter.
   */

  function createUniformSetter(program, uniformInfo, location) {
    const isArray = uniformInfo.name.endsWith("[0]");
    const type = uniformInfo.type;
    const typeInfo = typeMap[type];

    if (!typeInfo) {
      throw new Error(`unknown type: 0x${type.toString(16)}`); // we should never get here.
    }

    let setter;

    if (typeInfo.bindPoint) {
      // it's a sampler
      const unit = textureUnit;
      textureUnit += uniformInfo.size;

      if (isArray) {
        setter = typeInfo.arraySetter(gl, type, unit, location, uniformInfo.size);
      } else {
        setter = typeInfo.setter(gl, type, unit, location, uniformInfo.size);
      }
    } else {
      if (typeInfo.arraySetter && isArray) {
        setter = typeInfo.arraySetter(gl, location);
      } else {
        setter = typeInfo.setter(gl, location);
      }
    }

    setter.location = location;
    return setter;
  }

  const uniformSetters = {};
  const numUniforms = gl.getProgramParameter(program, ACTIVE_UNIFORMS);

  for (let ii = 0; ii < numUniforms; ++ii) {
    const uniformInfo = gl.getActiveUniform(program, ii);

    if (isBuiltIn(uniformInfo)) {
      continue;
    }

    let name = uniformInfo.name; // remove the array suffix.

    if (name.endsWith("[0]")) {
      name = name.substr(0, name.length - 3);
    }

    const location = gl.getUniformLocation(program, uniformInfo.name); // the uniform will have no location if it's in a uniform block

    if (location) {
      uniformSetters[name] = createUniformSetter(program, uniformInfo, location);
    }
  }

  return uniformSetters;
}
/**
 * @typedef {Object} TransformFeedbackInfo
 * @property {number} index index of transform feedback
 * @property {number} type GL type
 * @property {number} size 1 - 4
 * @memberOf module:twgl
 */

/**
 * Create TransformFeedbackInfo for passing to bindTransformFeedbackInfo.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {WebGLProgram} program an existing WebGLProgram.
 * @return {Object<string, module:twgl.TransformFeedbackInfo>}
 * @memberOf module:twgl
 */


function createTransformFeedbackInfo(gl, program) {
  const info = {};
  const numVaryings = gl.getProgramParameter(program, TRANSFORM_FEEDBACK_VARYINGS);

  for (let ii = 0; ii < numVaryings; ++ii) {
    const varying = gl.getTransformFeedbackVarying(program, ii);
    info[varying.name] = {
      index: ii,
      type: varying.type,
      size: varying.size
    };
  }

  return info;
}
/**
 * Binds buffers for transform feedback.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {(module:twgl.ProgramInfo|Object<string, module:twgl.TransformFeedbackInfo>)} transformFeedbackInfo A ProgramInfo or TransformFeedbackInfo.
 * @param {(module:twgl.BufferInfo|Object<string, module:twgl.AttribInfo>)} [bufferInfo] A BufferInfo or set of AttribInfos.
 * @memberOf module:twgl
 */


function bindTransformFeedbackInfo(gl, transformFeedbackInfo, bufferInfo) {
  if (transformFeedbackInfo.transformFeedbackInfo) {
    transformFeedbackInfo = transformFeedbackInfo.transformFeedbackInfo;
  }

  if (bufferInfo.attribs) {
    bufferInfo = bufferInfo.attribs;
  }

  for (const name in bufferInfo) {
    const varying = transformFeedbackInfo[name];

    if (varying) {
      const buf = bufferInfo[name];

      if (buf.offset) {
        gl.bindBufferRange(TRANSFORM_FEEDBACK_BUFFER, varying.index, buf.buffer, buf.offset, buf.size);
      } else {
        gl.bindBufferBase(TRANSFORM_FEEDBACK_BUFFER, varying.index, buf.buffer);
      }
    }
  }
}
/**
 * Creates a transform feedback and sets the buffers
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {module:twgl.ProgramInfo} programInfo A ProgramInfo as returned from {@link module:twgl.createProgramInfo}
 * @param {(module:twgl.BufferInfo|Object<string, module:twgl.AttribInfo>)} [bufferInfo] A BufferInfo or set of AttribInfos.
 * @return {WebGLTransformFeedback} the created transform feedback
 * @memberOf module:twgl
 */


function createTransformFeedback(gl, programInfo, bufferInfo) {
  const tf = gl.createTransformFeedback();
  gl.bindTransformFeedback(TRANSFORM_FEEDBACK, tf);
  gl.useProgram(programInfo.program);
  bindTransformFeedbackInfo(gl, programInfo, bufferInfo);
  gl.bindTransformFeedback(TRANSFORM_FEEDBACK, null);
  return tf;
}
/**
 * @typedef {Object} UniformData
 * @property {number} type The WebGL type enum for this uniform
 * @property {number} size The number of elements for this uniform
 * @property {number} blockNdx The block index this uniform appears in
 * @property {number} offset The byte offset in the block for this uniform's value
 * @memberOf module:twgl
 */

/**
 * The specification for one UniformBlockObject
 *
 * @typedef {Object} BlockSpec
 * @property {number} index The index of the block.
 * @property {number} size The size in bytes needed for the block
 * @property {number[]} uniformIndices The indices of the uniforms used by the block. These indices
 *    correspond to entries in a UniformData array in the {@link module:twgl.UniformBlockSpec}.
 * @property {bool} usedByVertexShader Self explanatory
 * @property {bool} usedByFragmentShader Self explanatory
 * @property {bool} used Self explanatory
 * @memberOf module:twgl
 */

/**
 * A `UniformBlockSpec` represents the data needed to create and bind
 * UniformBlockObjects for a given program
 *
 * @typedef {Object} UniformBlockSpec
 * @property {Object.<string, module:twgl.BlockSpec> blockSpecs The BlockSpec for each block by block name
 * @property {UniformData[]} uniformData An array of data for each uniform by uniform index.
 * @memberOf module:twgl
 */

/**
 * Creates a UniformBlockSpec for the given program.
 *
 * A UniformBlockSpec represents the data needed to create and bind
 * UniformBlockObjects
 *
 * @param {WebGL2RenderingContext} gl A WebGL2 Rendering Context
 * @param {WebGLProgram} program A WebGLProgram for a successfully linked program
 * @return {module:twgl.UniformBlockSpec} The created UniformBlockSpec
 * @memberOf module:twgl/programs
 */


function createUniformBlockSpecFromProgram(gl, program) {
  const numUniforms = gl.getProgramParameter(program, ACTIVE_UNIFORMS);
  const uniformData = [];
  const uniformIndices = [];

  for (let ii = 0; ii < numUniforms; ++ii) {
    uniformIndices.push(ii);
    uniformData.push({});
    const uniformInfo = gl.getActiveUniform(program, ii);

    if (isBuiltIn(uniformInfo)) {
      break;
    }

    uniformData[ii].name = uniformInfo.name;
  }

  [["UNIFORM_TYPE", "type"], ["UNIFORM_SIZE", "size"], // num elements
  ["UNIFORM_BLOCK_INDEX", "blockNdx"], ["UNIFORM_OFFSET", "offset"]].forEach(function (pair) {
    const pname = pair[0];
    const key = pair[1];
    gl.getActiveUniforms(program, uniformIndices, gl[pname]).forEach(function (value, ndx) {
      uniformData[ndx][key] = value;
    });
  });
  const blockSpecs = {};
  const numUniformBlocks = gl.getProgramParameter(program, ACTIVE_UNIFORM_BLOCKS);

  for (let ii = 0; ii < numUniformBlocks; ++ii) {
    const name = gl.getActiveUniformBlockName(program, ii);
    const blockSpec = {
      index: gl.getUniformBlockIndex(program, name),
      usedByVertexShader: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER),
      usedByFragmentShader: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER),
      size: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_DATA_SIZE),
      uniformIndices: gl.getActiveUniformBlockParameter(program, ii, UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES)
    };
    blockSpec.used = blockSpec.usedByVertexShader || blockSpec.usedByFragmentShader;
    blockSpecs[name] = blockSpec;
  }

  return {
    blockSpecs: blockSpecs,
    uniformData: uniformData
  };
}

const arraySuffixRE = /\[\d+\]\.$/; // better way to check?

const pad = (v, padding) => ((v + (padding - 1)) / padding | 0) * padding;

function createUniformBlockUniformSetter(view, Type, typeSize, paddedSize, isArray) {
  if (isArray) {
    const numElements = typeSize / Type.BYTES_PER_ELEMENT;
    const numPaddedElements = paddedSize / Type.BYTES_PER_ELEMENT;
    return function (value) {
      let dst = 0;

      for (let src = 0; src < value.length; src += numElements) {
        for (let i = 0; i < numElements; ++i) {
          view[dst + i] = value[src + i];
        }

        dst += numPaddedElements;
      }
    };
  } else {
    return function (value) {
      if (value.length) {
        view.set(value);
      } else {
        view[0] = value;
      }
    };
  }
}
/**
 * Represents a UniformBlockObject including an ArrayBuffer with all the uniform values
 * and a corresponding WebGLBuffer to hold those values on the GPU
 *
 * @typedef {Object} UniformBlockInfo
 * @property {string} name The name of the block
 * @property {ArrayBuffer} array The array buffer that contains the uniform values
 * @property {Float32Array} asFloat A float view on the array buffer. This is useful
 *    inspecting the contents of the buffer in the debugger.
 * @property {WebGLBuffer} buffer A WebGL buffer that will hold a copy of the uniform values for rendering.
 * @property {number} [offset] offset into buffer
 * @property {Object<string, ArrayBufferView>} uniforms A uniform name to ArrayBufferView map.
 *   each Uniform has a correctly typed `ArrayBufferView` into array at the correct offset
 *   and length of that uniform. So for example a float uniform would have a 1 float `Float32Array`
 *   view. A single mat4 would have a 16 element `Float32Array` view. An ivec2 would have an
 *   `Int32Array` view, etc.
 * @property {Object<string, function>} setters A setter for this uniform.
 *   The reason to use setters is elements of arrays are padded to vec4 sizes which
 *   means if you want to set an array of 4 floats you'd need to set 16 values
 *   (or set elements 0, 4, 8, 12). In other words
 *   `someBlockInfo.uniforms.some4FloatArrayUniform.set([0, , , , 1, , , , 2, , , , 3])`
 *   where as the setter handles just passing in [0, 1, 2, 3] either directly as in
 *   `someBlockInfo.setter.some4FloatArrayUniform.set([0, 1, 2, 3])` (not recommended)
 *   or via {@link module:twgl.setBlockUniforms}
 * @memberOf module:twgl
 */

/**
 * Creates a `UniformBlockInfo` for the specified block
 *
 * Note: **If the blockName matches no existing blocks a warning is printed to the console and a dummy
 * `UniformBlockInfo` is returned**. This is because when debugging GLSL
 * it is common to comment out large portions of a shader or for example set
 * the final output to a constant. When that happens blocks get optimized out.
 * If this function did not create dummy blocks your code would crash when debugging.
 *
 * @param {WebGL2RenderingContext} gl A WebGL2RenderingContext
 * @param {WebGLProgram} program A WebGLProgram
 * @param {module:twgl.UniformBlockSpec} uniformBlockSpec. A UniformBlockSpec as returned
 *     from {@link module:twgl.createUniformBlockSpecFromProgram}.
 * @param {string} blockName The name of the block.
 * @return {module:twgl.UniformBlockInfo} The created UniformBlockInfo
 * @memberOf module:twgl/programs
 */


function createUniformBlockInfoFromProgram(gl, program, uniformBlockSpec, blockName) {
  const blockSpecs = uniformBlockSpec.blockSpecs;
  const uniformData = uniformBlockSpec.uniformData;
  const blockSpec = blockSpecs[blockName];

  if (!blockSpec) {
    warn$1("no uniform block object named:", blockName);
    return {
      name: blockName,
      uniforms: {}
    };
  }

  const array = new ArrayBuffer(blockSpec.size);
  const buffer = gl.createBuffer();
  const uniformBufferIndex = blockSpec.index;
  gl.bindBuffer(UNIFORM_BUFFER, buffer);
  gl.uniformBlockBinding(program, blockSpec.index, uniformBufferIndex);
  let prefix = blockName + ".";

  if (arraySuffixRE.test(prefix)) {
    prefix = prefix.replace(arraySuffixRE, ".");
  }

  const uniforms = {};
  const setters = {};
  blockSpec.uniformIndices.forEach(function (uniformNdx) {
    const data = uniformData[uniformNdx];
    const typeInfo = typeMap[data.type];
    const Type = typeInfo.Type;
    const paddedSize = pad(typeInfo.size, 16);
    const length = typeInfo.size + (data.size - 1) * paddedSize;
    let name = data.name;

    if (name.startsWith(prefix)) {
      name = name.substr(prefix.length);
    }

    const isArray = name.endsWith('[0]');

    if (isArray) {
      name = name.substr(0, name.length - 3);
    }

    const uniformView = new Type(array, data.offset, length / Type.BYTES_PER_ELEMENT);
    uniforms[name] = uniformView;
    setters[name] = createUniformBlockUniformSetter(uniformView, Type, typeInfo.size, paddedSize, isArray);
  });
  return {
    name: blockName,
    array,
    asFloat: new Float32Array(array),
    // for debugging
    buffer,
    uniforms,
    setters
  };
}
/**
 * Creates a `UniformBlockInfo` for the specified block
 *
 * Note: **If the blockName matches no existing blocks a warning is printed to the console and a dummy
 * `UniformBlockInfo` is returned**. This is because when debugging GLSL
 * it is common to comment out large portions of a shader or for example set
 * the final output to a constant. When that happens blocks get optimized out.
 * If this function did not create dummy blocks your code would crash when debugging.
 *
 * @param {WebGL2RenderingContext} gl A WebGL2RenderingContext
 * @param {module:twgl.ProgramInfo} programInfo a `ProgramInfo`
 *     as returned from {@link module:twgl.createProgramInfo}
 * @param {string} blockName The name of the block.
 * @return {module:twgl.UniformBlockInfo} The created UniformBlockInfo
 * @memberOf module:twgl/programs
 */


function createUniformBlockInfo(gl, programInfo, blockName) {
  return createUniformBlockInfoFromProgram(gl, programInfo.program, programInfo.uniformBlockSpec, blockName);
}
/**
 * Binds a uniform block to the matching uniform block point.
 * Matches by blocks by name so blocks must have the same name not just the same
 * structure.
 *
 * If you have changed any values and you upload the values into the corresponding WebGLBuffer
 * call {@link module:twgl.setUniformBlock} instead.
 *
 * @param {WebGL2RenderingContext} gl A WebGL 2 rendering context.
 * @param {(module:twgl.ProgramInfo|module:twgl.UniformBlockSpec)} programInfo a `ProgramInfo`
 *     as returned from {@link module:twgl.createProgramInfo} or or `UniformBlockSpec` as
 *     returned from {@link module:twgl.createUniformBlockSpecFromProgram}.
 * @param {module:twgl.UniformBlockInfo} uniformBlockInfo a `UniformBlockInfo` as returned from
 *     {@link module:twgl.createUniformBlockInfo}.
 * @return {bool} true if buffer was bound. If the programInfo has no block with the same block name
 *     no buffer is bound.
 * @memberOf module:twgl/programs
 */


function bindUniformBlock(gl, programInfo, uniformBlockInfo) {
  const uniformBlockSpec = programInfo.uniformBlockSpec || programInfo;
  const blockSpec = uniformBlockSpec.blockSpecs[uniformBlockInfo.name];

  if (blockSpec) {
    const bufferBindIndex = blockSpec.index;
    gl.bindBufferRange(UNIFORM_BUFFER, bufferBindIndex, uniformBlockInfo.buffer, uniformBlockInfo.offset || 0, uniformBlockInfo.array.byteLength);
    return true;
  }

  return false;
}
/**
 * Uploads the current uniform values to the corresponding WebGLBuffer
 * and binds that buffer to the program's corresponding bind point for the uniform block object.
 *
 * If you haven't changed any values and you only need to bind the uniform block object
 * call {@link module:twgl.bindUniformBlock} instead.
 *
 * @param {WebGL2RenderingContext} gl A WebGL 2 rendering context.
 * @param {(module:twgl.ProgramInfo|module:twgl.UniformBlockSpec)} programInfo a `ProgramInfo`
 *     as returned from {@link module:twgl.createProgramInfo} or or `UniformBlockSpec` as
 *     returned from {@link module:twgl.createUniformBlockSpecFromProgram}.
 * @param {module:twgl.UniformBlockInfo} uniformBlockInfo a `UniformBlockInfo` as returned from
 *     {@link module:twgl.createUniformBlockInfo}.
 * @memberOf module:twgl/programs
 */


function setUniformBlock(gl, programInfo, uniformBlockInfo) {
  if (bindUniformBlock(gl, programInfo, uniformBlockInfo)) {
    gl.bufferData(UNIFORM_BUFFER, uniformBlockInfo.array, DYNAMIC_DRAW);
  }
}
/**
 * Sets values of a uniform block object
 *
 * @param {module:twgl.UniformBlockInfo} uniformBlockInfo A UniformBlockInfo as returned by {@link module:twgl.createUniformBlockInfo}.
 * @param {Object.<string, ?>} values A uniform name to value map where the value is correct for the given
 *    type of uniform. So for example given a block like
 *
 *       uniform SomeBlock {
 *         float someFloat;
 *         vec2 someVec2;
 *         vec3 someVec3Array[2];
 *         int someInt;
 *       }
 *
 *  You can set the values of the uniform block with
 *
 *       twgl.setBlockUniforms(someBlockInfo, {
 *          someFloat: 12.3,
 *          someVec2: [1, 2],
 *          someVec3Array: [1, 2, 3, 4, 5, 6],
 *          someInt: 5,
 *       }
 *
 *  Arrays can be JavaScript arrays or typed arrays
 *
 *  Any name that doesn't match will be ignored
 * @memberOf module:twgl/programs
 */


function setBlockUniforms(uniformBlockInfo, values) {
  const setters = uniformBlockInfo.setters;

  for (const name in values) {
    const setter = setters[name];

    if (setter) {
      const value = values[name];
      setter(value);
    }
  }
}
/**
 * Set uniforms and binds related textures.
 *
 * example:
 *
 *     const programInfo = createProgramInfo(
 *         gl, ["some-vs", "some-fs"]);
 *
 *     const tex1 = gl.createTexture();
 *     const tex2 = gl.createTexture();
 *
 *     ... assume we setup the textures with data ...
 *
 *     const uniforms = {
 *       u_someSampler: tex1,
 *       u_someOtherSampler: tex2,
 *       u_someColor: [1,0,0,1],
 *       u_somePosition: [0,1,1],
 *       u_someMatrix: [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ],
 *     };
 *
 *     gl.useProgram(program);
 *
 * This will automatically bind the textures AND set the
 * uniforms.
 *
 *     twgl.setUniforms(programInfo, uniforms);
 *
 * For the example above it is equivalent to
 *
 *     var texUnit = 0;
 *     gl.activeTexture(gl.TEXTURE0 + texUnit);
 *     gl.bindTexture(gl.TEXTURE_2D, tex1);
 *     gl.uniform1i(u_someSamplerLocation, texUnit++);
 *     gl.activeTexture(gl.TEXTURE0 + texUnit);
 *     gl.bindTexture(gl.TEXTURE_2D, tex2);
 *     gl.uniform1i(u_someSamplerLocation, texUnit++);
 *     gl.uniform4fv(u_someColorLocation, [1, 0, 0, 1]);
 *     gl.uniform3fv(u_somePositionLocation, [0, 1, 1]);
 *     gl.uniformMatrix4fv(u_someMatrix, false, [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ]);
 *
 * Note it is perfectly reasonable to call `setUniforms` multiple times. For example
 *
 *     const uniforms = {
 *       u_someSampler: tex1,
 *       u_someOtherSampler: tex2,
 *     };
 *
 *     const moreUniforms {
 *       u_someColor: [1,0,0,1],
 *       u_somePosition: [0,1,1],
 *       u_someMatrix: [
 *         1,0,0,0,
 *         0,1,0,0,
 *         0,0,1,0,
 *         0,0,0,0,
 *       ],
 *     };
 *
 *     twgl.setUniforms(programInfo, uniforms);
 *     twgl.setUniforms(programInfo, moreUniforms);
 *
 * You can also add WebGLSamplers to uniform samplers as in
 *
 *     const uniforms = {
 *       u_someSampler: {
 *         texture: someWebGLTexture,
 *         sampler: someWebGLSampler,
 *       },
 *     };
 *
 * In which case both the sampler and texture will be bound to the
 * same unit.
 *
 * @param {(module:twgl.ProgramInfo|Object.<string, function>)} setters a `ProgramInfo` as returned from `createProgramInfo` or the setters returned from
 *        `createUniformSetters`.
 * @param {Object.<string, ?>} values an object with values for the
 *        uniforms.
 *   You can pass multiple objects by putting them in an array or by calling with more arguments.For example
 *
 *     const sharedUniforms = {
 *       u_fogNear: 10,
 *       u_projection: ...
 *       ...
 *     };
 *
 *     const localUniforms = {
 *       u_world: ...
 *       u_diffuseColor: ...
 *     };
 *
 *     twgl.setUniforms(programInfo, sharedUniforms, localUniforms);
 *
 *     // is the same as
 *
 *     twgl.setUniforms(programInfo, [sharedUniforms, localUniforms]);
 *
 *     // is the same as
 *
 *     twgl.setUniforms(programInfo, sharedUniforms);
 *     twgl.setUniforms(programInfo, localUniforms};
 *
 * @memberOf module:twgl/programs
 */


function setUniforms(setters, values) {
  // eslint-disable-line
  const actualSetters = setters.uniformSetters || setters;
  const numArgs = arguments.length;

  for (let aNdx = 1; aNdx < numArgs; ++aNdx) {
    const values = arguments[aNdx];

    if (Array.isArray(values)) {
      const numValues = values.length;

      for (let ii = 0; ii < numValues; ++ii) {
        setUniforms(actualSetters, values[ii]);
      }
    } else {
      for (const name in values) {
        const setter = actualSetters[name];

        if (setter) {
          setter(values[name]);
        }
      }
    }
  }
}
/**
 * Alias for `setUniforms`
 * @function
 * @param {(module:twgl.ProgramInfo|Object.<string, function>)} setters a `ProgramInfo` as returned from `createProgramInfo` or the setters returned from
 *        `createUniformSetters`.
 * @param {Object.<string, ?>} values an object with values for the
 * @memberOf module:twgl/programs
 */


const setUniformsAndBindTextures = setUniforms;
/**
 * Creates setter functions for all attributes of a shader
 * program. You can pass this to {@link module:twgl.setBuffersAndAttributes} to set all your buffers and attributes.
 *
 * @see {@link module:twgl.setAttributes} for example
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {WebGLProgram} program the program to create setters for.
 * @return {Object.<string, function>} an object with a setter for each attribute by name.
 * @memberOf module:twgl/programs
 */

exports.setUniformsAndBindTextures = setUniformsAndBindTextures;

function createAttributeSetters(gl, program) {
  const attribSetters = {};
  const numAttribs = gl.getProgramParameter(program, ACTIVE_ATTRIBUTES);

  for (let ii = 0; ii < numAttribs; ++ii) {
    const attribInfo = gl.getActiveAttrib(program, ii);

    if (isBuiltIn(attribInfo)) {
      continue;
    }

    const index = gl.getAttribLocation(program, attribInfo.name);
    const typeInfo = attrTypeMap[attribInfo.type];
    const setter = typeInfo.setter(gl, index, typeInfo);
    setter.location = index;
    attribSetters[attribInfo.name] = setter;
  }

  return attribSetters;
}
/**
 * Sets attributes and binds buffers (deprecated... use {@link module:twgl.setBuffersAndAttributes})
 *
 * Example:
 *
 *     const program = createProgramFromScripts(
 *         gl, ["some-vs", "some-fs");
 *
 *     const attribSetters = createAttributeSetters(program);
 *
 *     const positionBuffer = gl.createBuffer();
 *     const texcoordBuffer = gl.createBuffer();
 *
 *     const attribs = {
 *       a_position: {buffer: positionBuffer, numComponents: 3},
 *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
 *     };
 *
 *     gl.useProgram(program);
 *
 * This will automatically bind the buffers AND set the
 * attributes.
 *
 *     setAttributes(attribSetters, attribs);
 *
 * Properties of attribs. For each attrib you can add
 * properties:
 *
 * *   type: the type of data in the buffer. Default = gl.FLOAT
 * *   normalize: whether or not to normalize the data. Default = false
 * *   stride: the stride. Default = 0
 * *   offset: offset into the buffer. Default = 0
 * *   divisor: the divisor for instances. Default = undefined
 *
 * For example if you had 3 value float positions, 2 value
 * float texcoord and 4 value uint8 colors you'd setup your
 * attribs like this
 *
 *     const attribs = {
 *       a_position: {buffer: positionBuffer, numComponents: 3},
 *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
 *       a_color: {
 *         buffer: colorBuffer,
 *         numComponents: 4,
 *         type: gl.UNSIGNED_BYTE,
 *         normalize: true,
 *       },
 *     };
 *
 * @param {Object.<string, function>} setters Attribute setters as returned from createAttributeSetters
 * @param {Object.<string, module:twgl.AttribInfo>} buffers AttribInfos mapped by attribute name.
 * @memberOf module:twgl/programs
 * @deprecated use {@link module:twgl.setBuffersAndAttributes}
 */


function setAttributes(setters, buffers) {
  for (const name in buffers) {
    const setter = setters[name];

    if (setter) {
      setter(buffers[name]);
    }
  }
}
/**
 * Sets attributes and buffers including the `ELEMENT_ARRAY_BUFFER` if appropriate
 *
 * Example:
 *
 *     const programInfo = createProgramInfo(
 *         gl, ["some-vs", "some-fs");
 *
 *     const arrays = {
 *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
 *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
 *     };
 *
 *     const bufferInfo = createBufferInfoFromArrays(gl, arrays);
 *
 *     gl.useProgram(programInfo.program);
 *
 * This will automatically bind the buffers AND set the
 * attributes.
 *
 *     setBuffersAndAttributes(gl, programInfo, bufferInfo);
 *
 * For the example above it is equivalent to
 *
 *     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 *     gl.enableVertexAttribArray(a_positionLocation);
 *     gl.vertexAttribPointer(a_positionLocation, 3, gl.FLOAT, false, 0, 0);
 *     gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
 *     gl.enableVertexAttribArray(a_texcoordLocation);
 *     gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext.
 * @param {(module:twgl.ProgramInfo|Object.<string, function>)} setters A `ProgramInfo` as returned from {@link module:twgl.createProgramInfo} or Attribute setters as returned from {@link module:twgl.createAttributeSetters}
 * @param {(module:twgl.BufferInfo|module:twgl.VertexArrayInfo)} buffers a `BufferInfo` as returned from {@link module:twgl.createBufferInfoFromArrays}.
 *   or a `VertexArrayInfo` as returned from {@link module:twgl.createVertexArrayInfo}
 * @memberOf module:twgl/programs
 */


function setBuffersAndAttributes(gl, programInfo, buffers) {
  if (buffers.vertexArrayObject) {
    gl.bindVertexArray(buffers.vertexArrayObject);
  } else {
    setAttributes(programInfo.attribSetters || programInfo, buffers.attribs);

    if (buffers.indices) {
      gl.bindBuffer(ELEMENT_ARRAY_BUFFER$1, buffers.indices);
    }
  }
}
/**
 * @typedef {Object} ProgramInfo
 * @property {WebGLProgram} program A shader program
 * @property {Object<string, function>} uniformSetters object of setters as returned from createUniformSetters,
 * @property {Object<string, function>} attribSetters object of setters as returned from createAttribSetters,
 * @property {module:twgl.UniformBlockSpec} [uniformBlockSpace] a uniform block spec for making UniformBlockInfos with createUniformBlockInfo etc..
 * @property {Object<string, module:twgl.TransformFeedbackInfo>} [transformFeedbackInfo] info for transform feedbacks
 * @memberOf module:twgl
 */

/**
 * Creates a ProgramInfo from an existing program.
 *
 * A ProgramInfo contains
 *
 *     programInfo = {
 *        program: WebGLProgram,
 *        uniformSetters: object of setters as returned from createUniformSetters,
 *        attribSetters: object of setters as returned from createAttribSetters,
 *     }
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext
 *        to use.
 * @param {WebGLProgram} program an existing WebGLProgram.
 * @return {module:twgl.ProgramInfo} The created ProgramInfo.
 * @memberOf module:twgl/programs
 */


function createProgramInfoFromProgram(gl, program) {
  const uniformSetters = createUniformSetters(gl, program);
  const attribSetters = createAttributeSetters(gl, program);
  const programInfo = {
    program: program,
    uniformSetters: uniformSetters,
    attribSetters: attribSetters
  };

  if (isWebGL2(gl)) {
    programInfo.uniformBlockSpec = createUniformBlockSpecFromProgram(gl, program);
    programInfo.transformFeedbackInfo = createTransformFeedbackInfo(gl, program);
  }

  return programInfo;
}
/**
 * Creates a ProgramInfo from 2 sources.
 *
 * A ProgramInfo contains
 *
 *     programInfo = {
 *        program: WebGLProgram,
 *        uniformSetters: object of setters as returned from createUniformSetters,
 *        attribSetters: object of setters as returned from createAttribSetters,
 *     }
 *
 * NOTE: There are 4 signatures for this function
 *
 *     twgl.createProgramInfo(gl, [vs, fs], options);
 *     twgl.createProgramInfo(gl, [vs, fs], opt_errFunc);
 *     twgl.createProgramInfo(gl, [vs, fs], opt_attribs, opt_errFunc);
 *     twgl.createProgramInfo(gl, [vs, fs], opt_attribs, opt_locations, opt_errFunc);
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext
 *        to use.
 * @param {string[]} shaderSources Array of sources for the
 *        shaders or ids. The first is assumed to be the vertex shader,
 *        the second the fragment shader.
 * @param {module:twgl.ProgramOptions|string[]|module:twgl.ErrorCallback} [opt_attribs] Options for the program or an array of attribs names or an error callback. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations|module:twgl.ErrorCallback] The locations for the. A parallel array to opt_attribs letting you assign locations or an error callback.
 * @param {module:twgl.ErrorCallback} [opt_errorCallback] callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 * @return {module:twgl.ProgramInfo?} The created ProgramInfo or null if it failed to link or compile
 * @memberOf module:twgl/programs
 */


function createProgramInfo(gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
  const progOptions = getProgramOptions(opt_attribs, opt_locations, opt_errorCallback);
  let good = true;
  shaderSources = shaderSources.map(function (source) {
    // Lets assume if there is no \n it's an id
    if (source.indexOf("\n") < 0) {
      const script = getElementById(source);

      if (!script) {
        progOptions.errorCallback("no element with id: " + source);
        good = false;
      } else {
        source = script.text;
      }
    }

    return source;
  });

  if (!good) {
    return null;
  }

  const program = createProgramFromSources(gl, shaderSources, progOptions);

  if (!program) {
    return null;
  }

  return createProgramInfoFromProgram(gl, program);
}

var programs = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createAttributeSetters: createAttributeSetters,
  createProgram: createProgram,
  createProgramFromScripts: createProgramFromScripts,
  createProgramFromSources: createProgramFromSources,
  createProgramInfo: createProgramInfo,
  createProgramInfoFromProgram: createProgramInfoFromProgram,
  createUniformSetters: createUniformSetters,
  createUniformBlockSpecFromProgram: createUniformBlockSpecFromProgram,
  createUniformBlockInfoFromProgram: createUniformBlockInfoFromProgram,
  createUniformBlockInfo: createUniformBlockInfo,
  createTransformFeedback: createTransformFeedback,
  createTransformFeedbackInfo: createTransformFeedbackInfo,
  bindTransformFeedbackInfo: bindTransformFeedbackInfo,
  setAttributes: setAttributes,
  setBuffersAndAttributes: setBuffersAndAttributes,
  setUniforms: setUniforms,
  setUniformsAndBindTextures: setUniformsAndBindTextures,
  setUniformBlock: setUniformBlock,
  setBlockUniforms: setBlockUniforms,
  bindUniformBlock: bindUniformBlock
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

exports.programs = programs;
const TRIANGLES = 0x0004;
const UNSIGNED_SHORT$3 = 0x1403;
/**
 * Drawing related functions
 *
 * For backward compatibility they are available at both `twgl.draw` and `twgl`
 * itself
 *
 * See {@link module:twgl} for core functions
 *
 * @module twgl/draw
 */

/**
 * Calls `gl.drawElements` or `gl.drawArrays`, whichever is appropriate
 *
 * normally you'd call `gl.drawElements` or `gl.drawArrays` yourself
 * but calling this means if you switch from indexed data to non-indexed
 * data you don't have to remember to update your draw call.
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @param {(module:twgl.BufferInfo|module:twgl.VertexArrayInfo)} bufferInfo A BufferInfo as returned from {@link module:twgl.createBufferInfoFromArrays} or
 *   a VertexArrayInfo as returned from {@link module:twgl.createVertexArrayInfo}
 * @param {number} [type] eg (gl.TRIANGLES, gl.LINES, gl.POINTS, gl.TRIANGLE_STRIP, ...). Defaults to `gl.TRIANGLES`
 * @param {number} [count] An optional count. Defaults to bufferInfo.numElements
 * @param {number} [offset] An optional offset. Defaults to 0.
 * @param {number} [instanceCount] An optional instanceCount. if set then `drawArraysInstanced` or `drawElementsInstanced` will be called
 * @memberOf module:twgl/draw
 */

function drawBufferInfo(gl, bufferInfo, type, count, offset, instanceCount) {
  type = type === undefined ? TRIANGLES : type;
  const indices = bufferInfo.indices;
  const elementType = bufferInfo.elementType;
  const numElements = count === undefined ? bufferInfo.numElements : count;
  offset = offset === undefined ? 0 : offset;

  if (elementType || indices) {
    if (instanceCount !== undefined) {
      gl.drawElementsInstanced(type, numElements, elementType === undefined ? UNSIGNED_SHORT$3 : bufferInfo.elementType, offset, instanceCount);
    } else {
      gl.drawElements(type, numElements, elementType === undefined ? UNSIGNED_SHORT$3 : bufferInfo.elementType, offset);
    }
  } else {
    if (instanceCount !== undefined) {
      gl.drawArraysInstanced(type, offset, numElements, instanceCount);
    } else {
      gl.drawArrays(type, offset, numElements);
    }
  }
}
/**
 * A DrawObject is useful for putting objects in to an array and passing them to {@link module:twgl.drawObjectList}.
 *
 * You need either a `BufferInfo` or a `VertexArrayInfo`.
 *
 * @typedef {Object} DrawObject
 * @property {boolean} [active] whether or not to draw. Default = `true` (must be `false` to be not true). In other words `undefined` = `true`
 * @property {number} [type] type to draw eg. `gl.TRIANGLES`, `gl.LINES`, etc...
 * @property {module:twgl.ProgramInfo} programInfo A ProgramInfo as returned from {@link module:twgl.createProgramInfo}
 * @property {module:twgl.BufferInfo} [bufferInfo] A BufferInfo as returned from {@link module:twgl.createBufferInfoFromArrays}
 * @property {module:twgl.VertexArrayInfo} [vertexArrayInfo] A VertexArrayInfo as returned from {@link module:twgl.createVertexArrayInfo}
 * @property {Object<string, ?>} uniforms The values for the uniforms.
 *   You can pass multiple objects by putting them in an array. For example
 *
 *     var sharedUniforms = {
 *       u_fogNear: 10,
 *       u_projection: ...
 *       ...
 *     };
 *
 *     var localUniforms = {
 *       u_world: ...
 *       u_diffuseColor: ...
 *     };
 *
 *     var drawObj = {
 *       ...
 *       uniforms: [sharedUniforms, localUniforms],
 *     };
 *
 * @property {number} [offset] the offset to pass to `gl.drawArrays` or `gl.drawElements`. Defaults to 0.
 * @property {number} [count] the count to pass to `gl.drawArrays` or `gl.drawElements`. Defaults to bufferInfo.numElements.
 * @property {number} [instanceCount] the number of instances. Defaults to undefined.
 * @memberOf module:twgl
 */

/**
 * Draws a list of objects
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @param {DrawObject[]} objectsToDraw an array of objects to draw.
 * @memberOf module:twgl/draw
 */


function drawObjectList(gl, objectsToDraw) {
  let lastUsedProgramInfo = null;
  let lastUsedBufferInfo = null;
  objectsToDraw.forEach(function (object) {
    if (object.active === false) {
      return;
    }

    const programInfo = object.programInfo;
    const bufferInfo = object.vertexArrayInfo || object.bufferInfo;
    let bindBuffers = false;
    const type = object.type === undefined ? TRIANGLES : object.type;

    if (programInfo !== lastUsedProgramInfo) {
      lastUsedProgramInfo = programInfo;
      gl.useProgram(programInfo.program); // We have to rebind buffers when changing programs because we
      // only bind buffers the program uses. So if 2 programs use the same
      // bufferInfo but the 1st one uses only positions the when the
      // we switch to the 2nd one some of the attributes will not be on.

      bindBuffers = true;
    } // Setup all the needed attributes.


    if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
      if (lastUsedBufferInfo && lastUsedBufferInfo.vertexArrayObject && !bufferInfo.vertexArrayObject) {
        gl.bindVertexArray(null);
      }

      lastUsedBufferInfo = bufferInfo;
      setBuffersAndAttributes(gl, programInfo, bufferInfo);
    } // Set the uniforms.


    setUniforms(programInfo, object.uniforms); // Draw

    drawBufferInfo(gl, bufferInfo, type, object.count, object.offset, object.instanceCount);
  });

  if (lastUsedBufferInfo && lastUsedBufferInfo.vertexArrayObject) {
    gl.bindVertexArray(null);
  }
}

var draw = /*#__PURE__*/Object.freeze({
  __proto__: null,
  drawBufferInfo: drawBufferInfo,
  drawObjectList: drawObjectList
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

exports.draw = draw;
const FRAMEBUFFER = 0x8d40;
const RENDERBUFFER = 0x8d41;
const TEXTURE_2D$2 = 0x0de1;
const UNSIGNED_BYTE$3 = 0x1401;
/* PixelFormat */

const DEPTH_COMPONENT$1 = 0x1902;
const RGBA$1 = 0x1908;
const DEPTH_COMPONENT24$1 = 0x81a6;
const DEPTH_COMPONENT32F$1 = 0x8cac;
const DEPTH24_STENCIL8$1 = 0x88f0;
const DEPTH32F_STENCIL8$1 = 0x8cad;
/* Framebuffer Object. */

const RGBA4$1 = 0x8056;
const RGB5_A1$1 = 0x8057;
const RGB565$1 = 0x8D62;
const DEPTH_COMPONENT16$1 = 0x81A5;
const STENCIL_INDEX = 0x1901;
const STENCIL_INDEX8 = 0x8D48;
const DEPTH_STENCIL$1 = 0x84F9;
const COLOR_ATTACHMENT0 = 0x8CE0;
const DEPTH_ATTACHMENT = 0x8D00;
const STENCIL_ATTACHMENT = 0x8D20;
const DEPTH_STENCIL_ATTACHMENT = 0x821A;
/* TextureWrapMode */

const CLAMP_TO_EDGE$1 = 0x812F;
/* TextureMagFilter */

const LINEAR$1 = 0x2601;
/**
 * The options for a framebuffer attachment.
 *
 * Note: For a `format` that is a texture include all the texture
 * options from {@link module:twgl.TextureOptions} for example
 * `min`, `mag`, `clamp`, etc... Note that unlike {@link module:twgl.TextureOptions}
 * `auto` defaults to `false` for attachment textures but `min` and `mag` default
 * to `gl.LINEAR` and `wrap` defaults to `CLAMP_TO_EDGE`
 *
 * @typedef {Object} AttachmentOptions
 * @property {number} [attachmentPoint] The attachment point. Defaults
 *   to `gl.COLOR_ATTACHMENT0 + ndx` unless type is a depth or stencil type
 *   then it's gl.DEPTH_ATTACHMENT or `gl.DEPTH_STENCIL_ATTACHMENT` depending
 *   on the format or attachment type.
 * @property {number} [format] The format. If one of `gl.RGBA4`,
 *   `gl.RGB565`, `gl.RGB5_A1`, `gl.DEPTH_COMPONENT16`,
 *   `gl.STENCIL_INDEX8` or `gl.DEPTH_STENCIL` then will create a
 *   renderbuffer. Otherwise will create a texture. Default = `gl.RGBA`
 * @property {number} [type] The type. Used for texture. Default = `gl.UNSIGNED_BYTE`.
 * @property {number} [target] The texture target for `gl.framebufferTexture2D`.
 *   Defaults to `gl.TEXTURE_2D`. Set to appropriate face for cube maps.
 * @property {number} [level] level for `gl.framebufferTexture2D`. Defaults to 0.
 * @property {number} [layer] layer for `gl.framebufferTextureLayer`. Defaults to undefined.
 *   If set then `gl.framebufferTextureLayer` is called, if not then `gl.framebufferTexture2D`
 * @property {WebGLObject} [attachment] An existing renderbuffer or texture.
 *    If provided will attach this Object. This allows you to share
 *    attachments across framebuffers.
 * @memberOf module:twgl
 * @mixes module:twgl.TextureOptions
 */

const defaultAttachments = [{
  format: RGBA$1,
  type: UNSIGNED_BYTE$3,
  min: LINEAR$1,
  wrap: CLAMP_TO_EDGE$1
}, {
  format: DEPTH_STENCIL$1
}];
const attachmentsByFormat = {};
attachmentsByFormat[DEPTH_STENCIL$1] = DEPTH_STENCIL_ATTACHMENT;
attachmentsByFormat[STENCIL_INDEX] = STENCIL_ATTACHMENT;
attachmentsByFormat[STENCIL_INDEX8] = STENCIL_ATTACHMENT;
attachmentsByFormat[DEPTH_COMPONENT$1] = DEPTH_ATTACHMENT;
attachmentsByFormat[DEPTH_COMPONENT16$1] = DEPTH_ATTACHMENT;
attachmentsByFormat[DEPTH_COMPONENT24$1] = DEPTH_ATTACHMENT;
attachmentsByFormat[DEPTH_COMPONENT32F$1] = DEPTH_ATTACHMENT;
attachmentsByFormat[DEPTH24_STENCIL8$1] = DEPTH_STENCIL_ATTACHMENT;
attachmentsByFormat[DEPTH32F_STENCIL8$1] = DEPTH_STENCIL_ATTACHMENT;

function getAttachmentPointForFormat(format, internalFormat) {
  return attachmentsByFormat[format] || attachmentsByFormat[internalFormat];
}

const renderbufferFormats = {};
renderbufferFormats[RGBA4$1] = true;
renderbufferFormats[RGB5_A1$1] = true;
renderbufferFormats[RGB565$1] = true;
renderbufferFormats[DEPTH_STENCIL$1] = true;
renderbufferFormats[DEPTH_COMPONENT16$1] = true;
renderbufferFormats[STENCIL_INDEX] = true;
renderbufferFormats[STENCIL_INDEX8] = true;

function isRenderbufferFormat(format) {
  return renderbufferFormats[format];
}
/**
 * @typedef {Object} FramebufferInfo
 * @property {WebGLFramebuffer} framebuffer The WebGLFramebuffer for this framebufferInfo
 * @property {WebGLObject[]} attachments The created attachments in the same order as passed in to {@link module:twgl.createFramebufferInfo}.
 * @property {number} width The width of the framebuffer and its attachments
 * @property {number} height The width of the framebuffer and its attachments
 * @memberOf module:twgl
 */

/**
 * Creates a framebuffer and attachments.
 *
 * This returns a {@link module:twgl.FramebufferInfo} because it needs to return the attachments as well as the framebuffer.
 *
 * The simplest usage
 *
 *     // create an RGBA/UNSIGNED_BYTE texture and DEPTH_STENCIL renderbuffer
 *     const fbi = twgl.createFramebufferInfo(gl);
 *
 * More complex usage
 *
 *     // create an RGB565 renderbuffer and a STENCIL_INDEX8 renderbuffer
 *     const attachments = [
 *       { format: RGB565, mag: NEAREST },
 *       { format: STENCIL_INDEX8 },
 *     ]
 *     const fbi = twgl.createFramebufferInfo(gl, attachments);
 *
 * Passing in a specific size
 *
 *     const width = 256;
 *     const height = 256;
 *     const fbi = twgl.createFramebufferInfo(gl, attachments, width, height);
 *
 * **Note!!** It is up to you to check if the framebuffer is renderable by calling `gl.checkFramebufferStatus`.
 * [WebGL1 only guarantees 3 combinations of attachments work](https://www.khronos.org/registry/webgl/specs/latest/1.0/#6.6).
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {module:twgl.AttachmentOptions[]} [attachments] which attachments to create. If not provided the default is a framebuffer with an
 *    `RGBA`, `UNSIGNED_BYTE` texture `COLOR_ATTACHMENT0` and a `DEPTH_STENCIL` renderbuffer `DEPTH_STENCIL_ATTACHMENT`.
 * @param {number} [width] the width for the attachments. Default = size of drawingBuffer
 * @param {number} [height] the height for the attachments. Default = size of drawingBuffer
 * @return {module:twgl.FramebufferInfo} the framebuffer and attachments.
 * @memberOf module:twgl/framebuffers
 */


function createFramebufferInfo(gl, attachments, width, height) {
  const target = FRAMEBUFFER;
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(target, fb);
  width = width || gl.drawingBufferWidth;
  height = height || gl.drawingBufferHeight;
  attachments = attachments || defaultAttachments;
  let colorAttachmentCount = 0;
  const framebufferInfo = {
    framebuffer: fb,
    attachments: [],
    width: width,
    height: height
  };
  attachments.forEach(function (attachmentOptions) {
    let attachment = attachmentOptions.attachment;
    const format = attachmentOptions.format;
    let attachmentPoint = attachmentOptions.attachmentPoint || getAttachmentPointForFormat(format, attachmentOptions.internalFormat);

    if (!attachmentPoint) {
      attachmentPoint = COLOR_ATTACHMENT0 + colorAttachmentCount++;
    }

    if (!attachment) {
      if (isRenderbufferFormat(format)) {
        attachment = gl.createRenderbuffer();
        gl.bindRenderbuffer(RENDERBUFFER, attachment);
        gl.renderbufferStorage(RENDERBUFFER, format, width, height);
      } else {
        const textureOptions = Object.assign({}, attachmentOptions);
        textureOptions.width = width;
        textureOptions.height = height;

        if (textureOptions.auto === undefined) {
          textureOptions.auto = false;
          textureOptions.min = textureOptions.min || textureOptions.minMag || LINEAR$1;
          textureOptions.mag = textureOptions.mag || textureOptions.minMag || LINEAR$1;
          textureOptions.wrapS = textureOptions.wrapS || textureOptions.wrap || CLAMP_TO_EDGE$1;
          textureOptions.wrapT = textureOptions.wrapT || textureOptions.wrap || CLAMP_TO_EDGE$1;
        }

        attachment = createTexture(gl, textureOptions);
      }
    }

    if (isRenderbuffer(gl, attachment)) {
      gl.framebufferRenderbuffer(target, attachmentPoint, RENDERBUFFER, attachment);
    } else if (isTexture(gl, attachment)) {
      if (attachmentOptions.layer !== undefined) {
        gl.framebufferTextureLayer(target, attachmentPoint, attachment, attachmentOptions.level || 0, attachmentOptions.layer);
      } else {
        gl.framebufferTexture2D(target, attachmentPoint, attachmentOptions.target || TEXTURE_2D$2, attachment, attachmentOptions.level || 0);
      }
    } else {
      throw new Error('unknown attachment type');
    }

    framebufferInfo.attachments.push(attachment);
  });
  return framebufferInfo;
}
/**
 * Resizes the attachments of a framebuffer.
 *
 * You need to pass in the same `attachments` as you passed in {@link module:twgl.createFramebufferInfo}
 * because TWGL has no idea the format/type of each attachment.
 *
 * The simplest usage
 *
 *     // create an RGBA/UNSIGNED_BYTE texture and DEPTH_STENCIL renderbuffer
 *     const fbi = twgl.createFramebufferInfo(gl);
 *
 *     ...
 *
 *     function render() {
 *       if (twgl.resizeCanvasToDisplaySize(gl.canvas)) {
 *         // resize the attachments
 *         twgl.resizeFramebufferInfo(gl, fbi);
 *       }
 *
 * More complex usage
 *
 *     // create an RGB565 renderbuffer and a STENCIL_INDEX8 renderbuffer
 *     const attachments = [
 *       { format: RGB565, mag: NEAREST },
 *       { format: STENCIL_INDEX8 },
 *     ]
 *     const fbi = twgl.createFramebufferInfo(gl, attachments);
 *
 *     ...
 *
 *     function render() {
 *       if (twgl.resizeCanvasToDisplaySize(gl.canvas)) {
 *         // resize the attachments to match
 *         twgl.resizeFramebufferInfo(gl, fbi, attachments);
 *       }
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {module:twgl.FramebufferInfo} framebufferInfo a framebufferInfo as returned from {@link module:twgl.createFramebufferInfo}.
 * @param {module:twgl.AttachmentOptions[]} [attachments] the same attachments options as passed to {@link module:twgl.createFramebufferInfo}.
 * @param {number} [width] the width for the attachments. Default = size of drawingBuffer
 * @param {number} [height] the height for the attachments. Default = size of drawingBuffer
 * @memberOf module:twgl/framebuffers
 */


function resizeFramebufferInfo(gl, framebufferInfo, attachments, width, height) {
  width = width || gl.drawingBufferWidth;
  height = height || gl.drawingBufferHeight;
  framebufferInfo.width = width;
  framebufferInfo.height = height;
  attachments = attachments || defaultAttachments;
  attachments.forEach(function (attachmentOptions, ndx) {
    const attachment = framebufferInfo.attachments[ndx];
    const format = attachmentOptions.format;

    if (isRenderbuffer(gl, attachment)) {
      gl.bindRenderbuffer(RENDERBUFFER, attachment);
      gl.renderbufferStorage(RENDERBUFFER, format, width, height);
    } else if (isTexture(gl, attachment)) {
      resizeTexture(gl, attachment, attachmentOptions, width, height);
    } else {
      throw new Error('unknown attachment type');
    }
  });
}
/**
 * Binds a framebuffer
 *
 * This function pretty much solely exists because I spent hours
 * trying to figure out why something I wrote wasn't working only
 * to realize I forget to set the viewport dimensions.
 * My hope is this function will fix that.
 *
 * It is effectively the same as
 *
 *     gl.bindFramebuffer(gl.FRAMEBUFFER, someFramebufferInfo.framebuffer);
 *     gl.viewport(0, 0, someFramebufferInfo.width, someFramebufferInfo.height);
 *
 * @param {WebGLRenderingContext} gl the WebGLRenderingContext
 * @param {module:twgl.FramebufferInfo|null} [framebufferInfo] a framebufferInfo as returned from {@link module:twgl.createFramebufferInfo}.
 *   If falsy will bind the canvas.
 * @param {number} [target] The target. If not passed `gl.FRAMEBUFFER` will be used.
 * @memberOf module:twgl/framebuffers
 */


function bindFramebufferInfo(gl, framebufferInfo, target) {
  target = target || FRAMEBUFFER;

  if (framebufferInfo) {
    gl.bindFramebuffer(target, framebufferInfo.framebuffer);
    gl.viewport(0, 0, framebufferInfo.width, framebufferInfo.height);
  } else {
    gl.bindFramebuffer(target, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }
}

var framebuffers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  bindFramebufferInfo: bindFramebufferInfo,
  createFramebufferInfo: createFramebufferInfo,
  resizeFramebufferInfo: resizeFramebufferInfo
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * vertex array object related functions
 *
 * You should generally not need to use these functions. They are provided
 * for those cases where you're doing something out of the ordinary
 * and you need lower level access.
 *
 * For backward compatibility they are available at both `twgl.attributes` and `twgl`
 * itself
 *
 * See {@link module:twgl} for core functions
 *
 * @module twgl/vertexArrays
 */

exports.framebuffers = framebuffers;
const ELEMENT_ARRAY_BUFFER$2 = 0x8893;
/**
 * @typedef {Object} VertexArrayInfo
 * @property {number} numElements The number of elements to pass to `gl.drawArrays` or `gl.drawElements`.
 * @property {number} [elementType] The type of indices `UNSIGNED_BYTE`, `UNSIGNED_SHORT` etc..
 * @property {WebGLVertexArrayObject} [vertexArrayObject] a vertex array object
 * @memberOf module:twgl
 */

/**
 * Creates a VertexArrayInfo from a BufferInfo and one or more ProgramInfos
 *
 * This can be passed to {@link module:twgl.setBuffersAndAttributes} and to
 * {@link module:twgl:drawBufferInfo}.
 *
 * > **IMPORTANT:** Vertex Array Objects are **not** a direct analog for a BufferInfo. Vertex Array Objects
 *   assign buffers to specific attributes at creation time. That means they can only be used with programs
 *   who's attributes use the same attribute locations for the same purposes.
 *
 * > Bind your attribute locations by passing an array of attribute names to {@link module:twgl.createProgramInfo}
 *   or use WebGL 2's GLSL ES 3's `layout(location = <num>)` to make sure locations match.
 *
 * also
 *
 * > **IMPORTANT:** After calling twgl.setBuffersAndAttribute with a BufferInfo that uses a Vertex Array Object
 *   that Vertex Array Object will be bound. That means **ANY MANIPULATION OF ELEMENT_ARRAY_BUFFER or ATTRIBUTES**
 *   will affect the Vertex Array Object state.
 *
 * > Call `gl.bindVertexArray(null)` to get back manipulating the global attributes and ELEMENT_ARRAY_BUFFER.
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @param {module:twgl.ProgramInfo|module:twgl.ProgramInfo[]} programInfo a programInfo or array of programInfos
 * @param {module:twgl.BufferInfo} bufferInfo BufferInfo as returned from createBufferInfoFromArrays etc...
 *
 *    You need to make sure every attribute that will be used is bound. So for example assume shader 1
 *    uses attributes A, B, C and shader 2 uses attributes A, B, D. If you only pass in the programInfo
 *    for shader 1 then only attributes A, B, and C will have their attributes set because TWGL doesn't
 *    now attribute D's location.
 *
 *    So, you can pass in both shader 1 and shader 2's programInfo
 *
 * @return {module:twgl.VertexArrayInfo} The created VertexArrayInfo
 *
 * @memberOf module:twgl/vertexArrays
 */

function createVertexArrayInfo(gl, programInfos, bufferInfo) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  if (!programInfos.length) {
    programInfos = [programInfos];
  }

  programInfos.forEach(function (programInfo) {
    setBuffersAndAttributes(gl, programInfo, bufferInfo);
  });
  gl.bindVertexArray(null);
  return {
    numElements: bufferInfo.numElements,
    elementType: bufferInfo.elementType,
    vertexArrayObject: vao
  };
}
/**
 * Creates a vertex array object and then sets the attributes on it
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {Object.<string, function>} setters Attribute setters as returned from createAttributeSetters
 * @param {Object.<string, module:twgl.AttribInfo>} attribs AttribInfos mapped by attribute name.
 * @param {WebGLBuffer} [indices] an optional ELEMENT_ARRAY_BUFFER of indices
 * @memberOf module:twgl/vertexArrays
 */


function createVAOAndSetAttributes(gl, setters, attribs, indices) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  setAttributes(setters, attribs);

  if (indices) {
    gl.bindBuffer(ELEMENT_ARRAY_BUFFER$2, indices);
  } // We unbind this because otherwise any change to ELEMENT_ARRAY_BUFFER
  // like when creating buffers for other stuff will mess up this VAO's binding


  gl.bindVertexArray(null);
  return vao;
}
/**
 * Creates a vertex array object and then sets the attributes
 * on it
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext
 *        to use.
 * @param {Object.<string, function>| module:twgl.ProgramInfo} programInfo as returned from createProgramInfo or Attribute setters as returned from createAttributeSetters
 * @param {module:twgl.BufferInfo} bufferInfo BufferInfo as returned from createBufferInfoFromArrays etc...
 * @param {WebGLBuffer} [indices] an optional ELEMENT_ARRAY_BUFFER of indices
 * @memberOf module:twgl/vertexArrays
 */


function createVAOFromBufferInfo(gl, programInfo, bufferInfo) {
  return createVAOAndSetAttributes(gl, programInfo.attribSetters || programInfo, bufferInfo.attribs, bufferInfo.indices);
}

var vertexArrays = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createVertexArrayInfo: createVertexArrayInfo,
  createVAOAndSetAttributes: createVAOAndSetAttributes,
  createVAOFromBufferInfo: createVAOFromBufferInfo
});
/*
 * Copyright 2019 Gregg Tavares
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

exports.vertexArrays = vertexArrays;
const defaults$2 = {
  addExtensionsToContext: true
};
/**
 * Various default settings for twgl.
 *
 * Note: You can call this any number of times. Example:
 *
 *     twgl.setDefaults({ textureColor: [1, 0, 0, 1] });
 *     twgl.setDefaults({ attribPrefix: 'a_' });
 *
 * is equivalent to
 *
 *     twgl.setDefaults({
 *       textureColor: [1, 0, 0, 1],
 *       attribPrefix: 'a_',
 *     });
 *
 * @typedef {Object} Defaults
 * @property {string} [attribPrefix] The prefix to stick on attributes
 *
 *   When writing shaders I prefer to name attributes with `a_`, uniforms with `u_` and varyings with `v_`
 *   as it makes it clear where they came from. But, when building geometry I prefer using un-prefixed names.
 *
 *   In other words I'll create arrays of geometry like this
 *
 *       const arrays = {
 *         position: ...
 *         normal: ...
 *         texcoord: ...
 *       };
 *
 *   But need those mapped to attributes and my attributes start with `a_`.
 *
 *   Default: `""`
 *
 * @property {number[]} [textureColor] Array of 4 values in the range 0 to 1
 *
 *   The default texture color is used when loading textures from
 *   urls. Because the URL will be loaded async we'd like to be
 *   able to use the texture immediately. By putting a 1x1 pixel
 *   color in the texture we can start using the texture before
 *   the URL has loaded.
 *
 *   Default: `[0.5, 0.75, 1, 1]`
 *
 * @property {string} [crossOrigin]
 *
 *   If not undefined sets the crossOrigin attribute on images
 *   that twgl creates when downloading images for textures.
 *
 *   Also see {@link module:twgl.TextureOptions}.
 *
 * @property {bool} [addExtensionsToContext]
 *
 *   If true, then, when twgl will try to add any supported WebGL extensions
 *   directly to the context under their normal GL names. For example
 *   if ANGLE_instances_arrays exists then twgl would enable it,
 *   add the functions `vertexAttribDivisor`, `drawArraysInstanced`,
 *   `drawElementsInstanced`, and the constant `VERTEX_ATTRIB_ARRAY_DIVISOR`
 *   to the `WebGLRenderingContext`.
 *
 * @memberOf module:twgl
 */

/**
 * Sets various defaults for twgl.
 *
 * In the interest of terseness which is kind of the point
 * of twgl I've integrated a few of the older functions here
 *
 * @param {module:twgl.Defaults} newDefaults The default settings.
 * @memberOf module:twgl
 */

function setDefaults$2(newDefaults) {
  copyExistingProperties(newDefaults, defaults$2);
  setDefaults(newDefaults); // eslint-disable-line

  setDefaults$1(newDefaults); // eslint-disable-line
}

const prefixRE = /^(.*?)_/;

function addExtensionToContext(gl, extensionName) {
  glEnumToString(gl, 0);
  const ext = gl.getExtension(extensionName);

  if (ext) {
    const enums = {};
    const fnSuffix = prefixRE.exec(extensionName)[1];
    const enumSuffix = '_' + fnSuffix;

    for (const key in ext) {
      const value = ext[key];
      const isFunc = typeof value === 'function';
      const suffix = isFunc ? fnSuffix : enumSuffix;
      let name = key; // examples of where this is not true are WEBGL_compressed_texture_s3tc
      // and WEBGL_compressed_texture_pvrtc

      if (key.endsWith(suffix)) {
        name = key.substring(0, key.length - suffix.length);
      }

      if (gl[name] !== undefined) {
        if (!isFunc && gl[name] !== value) {
          warn(name, gl[name], value, key);
        }
      } else {
        if (isFunc) {
          gl[name] = function (origFn) {
            return function () {
              return origFn.apply(ext, arguments);
            };
          }(value);
        } else {
          gl[name] = value;
          enums[name] = value;
        }
      }
    } // pass the modified enums to glEnumToString


    enums.constructor = {
      name: ext.constructor.name
    };
    glEnumToString(enums, 0);
  }

  return ext;
}
/*
 * If you're wondering why the code doesn't just iterate
 * over all extensions using `gl.getExtensions` is that it's possible
 * some future extension is incompatible with this code. Rather than
 * have thing suddenly break it seems better to manually add to this
 * list.
 *
 */


const supportedExtensions = ['ANGLE_instanced_arrays', 'EXT_blend_minmax', 'EXT_color_buffer_float', 'EXT_color_buffer_half_float', 'EXT_disjoint_timer_query', 'EXT_disjoint_timer_query_webgl2', 'EXT_frag_depth', 'EXT_sRGB', 'EXT_shader_texture_lod', 'EXT_texture_filter_anisotropic', 'OES_element_index_uint', 'OES_standard_derivatives', 'OES_texture_float', 'OES_texture_float_linear', 'OES_texture_half_float', 'OES_texture_half_float_linear', 'OES_vertex_array_object', 'WEBGL_color_buffer_float', 'WEBGL_compressed_texture_atc', 'WEBGL_compressed_texture_etc1', 'WEBGL_compressed_texture_pvrtc', 'WEBGL_compressed_texture_s3tc', 'WEBGL_compressed_texture_s3tc_srgb', 'WEBGL_depth_texture', 'WEBGL_draw_buffers'];
/**
 * Attempts to enable all of the following extensions
 * and add their functions and constants to the
 * `WebGLRenderingContext` using their normal non-extension like names.
 *
 *      ANGLE_instanced_arrays
 *      EXT_blend_minmax
 *      EXT_color_buffer_float
 *      EXT_color_buffer_half_float
 *      EXT_disjoint_timer_query
 *      EXT_disjoint_timer_query_webgl2
 *      EXT_frag_depth
 *      EXT_sRGB
 *      EXT_shader_texture_lod
 *      EXT_texture_filter_anisotropic
 *      OES_element_index_uint
 *      OES_standard_derivatives
 *      OES_texture_float
 *      OES_texture_float_linear
 *      OES_texture_half_float
 *      OES_texture_half_float_linear
 *      OES_vertex_array_object
 *      WEBGL_color_buffer_float
 *      WEBGL_compressed_texture_atc
 *      WEBGL_compressed_texture_etc1
 *      WEBGL_compressed_texture_pvrtc
 *      WEBGL_compressed_texture_s3tc
 *      WEBGL_compressed_texture_s3tc_srgb
 *      WEBGL_depth_texture
 *      WEBGL_draw_buffers
 *
 * For example if `ANGLE_instanced_arrays` exists then the functions
 * `drawArraysInstanced`, `drawElementsInstanced`, `vertexAttribDivisor`
 * and the constant `VERTEX_ATTRIB_ARRAY_DIVISOR` are added to the
 * `WebGLRenderingContext`.
 *
 * Note that if you want to know if the extension exists you should
 * probably call `gl.getExtension` for each extension. Alternatively
 * you can check for the existence of the functions or constants that
 * are expected to be added. For example
 *
 *    if (gl.drawBuffers) {
 *      // Either WEBGL_draw_buffers was enabled OR you're running in WebGL2
 *      ....
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext
 * @memberOf module:twgl
 */

function addExtensionsToContext(gl) {
  for (let ii = 0; ii < supportedExtensions.length; ++ii) {
    addExtensionToContext(gl, supportedExtensions[ii]);
  }
}
/**
 * Creates a webgl context.
 * @param {HTMLCanvasElement} canvas The canvas tag to get
 *     context from. If one is not passed in one will be
 *     created.
 * @return {WebGLRenderingContext} The created context.
 * @private
 */


function create3DContext(canvas, opt_attribs) {
  const names = ["webgl", "experimental-webgl"];
  let context = null;

  for (let ii = 0; ii < names.length; ++ii) {
    context = canvas.getContext(names[ii], opt_attribs);

    if (context) {
      if (defaults$2.addExtensionsToContext) {
        addExtensionsToContext(context);
      }

      break;
    }
  }

  return context;
}
/**
 * Gets a WebGL1 context.
 *
 * Note: Will attempt to enable Vertex Array Objects
 * and add WebGL2 entry points. (unless you first set defaults with
 * `twgl.setDefaults({enableVertexArrayObjects: false})`;
 *
 * @param {HTMLCanvasElement} canvas a canvas element.
 * @param {WebGLContextAttributes} [opt_attribs] optional webgl context creation attributes
 * @return {WebGLRenderingContext} The created context.
 * @memberOf module:twgl
 */


function getWebGLContext(canvas, opt_attribs) {
  const gl = create3DContext(canvas, opt_attribs);
  return gl;
}
/**
 * Creates a webgl context.
 *
 * Will return a WebGL2 context if possible.
 *
 * You can check if it's WebGL2 with
 *
 *     twgl.isWebGL2(gl);
 *
 * @param {HTMLCanvasElement} canvas The canvas tag to get
 *     context from. If one is not passed in one will be
 *     created.
 * @return {WebGLRenderingContext} The created context.
 */


function createContext(canvas, opt_attribs) {
  const names = ["webgl2", "webgl", "experimental-webgl"];
  let context = null;

  for (let ii = 0; ii < names.length; ++ii) {
    context = canvas.getContext(names[ii], opt_attribs);

    if (context) {
      if (defaults$2.addExtensionsToContext) {
        addExtensionsToContext(context);
      }

      break;
    }
  }

  return context;
}
/**
 * Gets a WebGL context.  Will create a WebGL2 context if possible.
 *
 * You can check if it's WebGL2 with
 *
 *    function isWebGL2(gl) {
 *      return gl.getParameter(gl.VERSION).indexOf("WebGL 2.0 ") == 0;
 *    }
 *
 * Note: For a WebGL1 context will attempt to enable Vertex Array Objects
 * and add WebGL2 entry points. (unless you first set defaults with
 * `twgl.setDefaults({enableVertexArrayObjects: false})`;
 *
 * @param {HTMLCanvasElement} canvas a canvas element.
 * @param {WebGLContextAttributes} [opt_attribs] optional webgl context creation attributes
 * @return {WebGLRenderingContext} The created context.
 * @memberOf module:twgl
 */


function getContext(canvas, opt_attribs) {
  const gl = createContext(canvas, opt_attribs);
  return gl;
}
/**
 * Resize a canvas to match the size it's displayed.
 * @param {HTMLCanvasElement} canvas The canvas to resize.
 * @param {number} [multiplier] So you can pass in `window.devicePixelRatio` or other scale value if you want to.
 * @return {boolean} true if the canvas was resized.
 * @memberOf module:twgl
 */


function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  multiplier = Math.max(0, multiplier);
  const width = canvas.clientWidth * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }

  return false;
}
},{}],"index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var dat = _interopRequireWildcard(require("dat.gui"));

var _riveCanvas = _interopRequireDefault(require("rive-canvas"));

var twgl = _interopRequireWildcard(require("twgl.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var files = ['star.riv', 'clipped_circle_star_2.riv', 'clipped_circle_star.riv', 'clipped_circle.riv', 'evenodd.riv', 'nonzero.riv'];

function changeFile(_x) {
  return _changeFile.apply(this, arguments);
}

function _changeFile() {
  _changeFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(filename) {
    var fileBytes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = Uint8Array;
            _context.next = 3;
            return fetch(new Request(filename));

          case 3:
            _context.next = 5;
            return _context.sent.arrayBuffer();

          case 5:
            _context.t1 = _context.sent;
            fileBytes = new _context.t0(_context.t1);
            console.log(fileBytes);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _changeFile.apply(this, arguments);
}

function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var rive, gui;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _riveCanvas.default)({
              locateFile: function locateFile(file) {
                return 'https://unpkg.com/rive-canvas@0.7.1/' + file;
              }
            });

          case 2:
            rive = _context2.sent;
            console.log('packages', dat, rive, twgl);
            gui = new dat.GUI({
              width: 300
            });
            _context2.next = 7;
            return changeFile(files[0]);

          case 7:
            _context2.t0 = gui;
            _context2.t1 = files[0];
            _context2.t2 = {
              _file: _context2.t1,

              get file() {
                return this._file;
              },

              set file(value) {
                this._file = value;
                changeFile(value);
              }

            };
            _context2.t3 = files;

            _context2.t0.add.call(_context2.t0, _context2.t2, 'file', _context2.t3);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _main.apply(this, arguments);
}

;
main();
},{"regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","dat.gui":"node_modules/dat.gui/build/dat.gui.module.js","rive-canvas":"node_modules/rive-canvas/rive.mjs","twgl.js":"node_modules/twgl.js/dist/4.x/twgl-full.module.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58493" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/rive-webgl.e31bb0bc.js.map