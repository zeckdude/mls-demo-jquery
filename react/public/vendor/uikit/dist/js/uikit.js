/*! UIkit 3.0.0-beta.32 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('uikit', factory) :
      (global.UIkit = factory());
}(this, (() => {
/**
 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

  const RESOLVED = 0;
  const REJECTED = 1;
  const PENDING = 2;

  const async = 'setImmediate' in window ? setImmediate : setTimeout;

  function Promise$1(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];

    const promise = this;

    try {
      executor((x) => {
        promise.resolve(x);
      }, (r) => {
        promise.reject(r);
      });
    } catch (e) {
      promise.reject(e);
    }
  }

  Promise$1.reject = function (r) {
    return new Promise$1(((resolve, reject) => {
      reject(r);
    }));
  };

  Promise$1.resolve = function (x) {
    return new Promise$1(((resolve, reject) => {
      resolve(x);
    }));
  };

  Promise$1.all = function all(iterable) {
    return new Promise$1(((resolve, reject) => {
      let count = 0,
        result = [];

      if (iterable.length === 0) {
        resolve(result);
      }

      function resolver(i) {
        return function (x) {
          result[i] = x;
          count += 1;

          if (count === iterable.length) {
            resolve(result);
          }
        };
      }

      for (let i = 0; i < iterable.length; i += 1) {
        Promise$1.resolve(iterable[i]).then(resolver(i), reject);
      }
    }));
  };

  Promise$1.race = function race(iterable) {
    return new Promise$1(((resolve, reject) => {
      for (let i = 0; i < iterable.length; i += 1) {
        Promise$1.resolve(iterable[i]).then(resolve, reject);
      }
    }));
  };

  const p = Promise$1.prototype;

  p.resolve = function resolve(x) {
    const promise = this;

    if (promise.state === PENDING) {
      if (x === promise) {
        throw new TypeError('Promise settled with itself.');
      }

      let called = false;

      try {
        const then = x && x.then;

        if (x !== null && isObject(x) && isFunction(then)) {
          then.call(x, (x) => {
            if (!called) {
              promise.resolve(x);
            }
            called = true;
          }, (r) => {
            if (!called) {
              promise.reject(r);
            }
            called = true;
          });
          return;
        }
      } catch (e) {
        if (!called) {
          promise.reject(e);
        }
        return;
      }

      promise.state = RESOLVED;
      promise.value = x;
      promise.notify();
    }
  };

  p.reject = function reject(reason) {
    const promise = this;

    if (promise.state === PENDING) {
      if (reason === promise) {
        throw new TypeError('Promise settled with itself.');
      }

      promise.state = REJECTED;
      promise.value = reason;
      promise.notify();
    }
  };

  p.notify = function notify() {
    const this$1 = this;

    async(() => {
      if (this$1.state !== PENDING) {
        while (this$1.deferred.length) {
          let deferred = this$1.deferred.shift(),
            onResolved = deferred[0],
            onRejected = deferred[1],
            resolve = deferred[2],
            reject = deferred[3];

          try {
            if (this$1.state === RESOLVED) {
              if (isFunction(onResolved)) {
                resolve(onResolved.call(undefined, this$1.value));
              } else {
                resolve(this$1.value);
              }
            } else if (this$1.state === REJECTED) {
              if (isFunction(onRejected)) {
                resolve(onRejected.call(undefined, this$1.value));
              } else {
                reject(this$1.value);
              }
            }
          } catch (e) {
            reject(e);
          }
        }
      }
    });
  };

  p.then = function then(onResolved, onRejected) {
    const this$1 = this;

    return new Promise$1(((resolve, reject) => {
      this$1.deferred.push([onResolved, onRejected, resolve, reject]);
      this$1.notify();
    }));
  };

  p.catch = function (onRejected) {
    return this.then(undefined, onRejected);
  };

  function bind(fn, context) {
    return function (a) {
      const l = arguments.length;
      return l ? l > 1 ? fn.apply(context, arguments) : fn.call(context, a) : fn.call(context);
    };
  }

  const hasOwnProperty = Object.prototype.hasOwnProperty;

  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }

  const Promise = 'Promise' in window ? window.Promise : Promise$1;

  const classifyRe = /(?:^|[-_\/])(\w)/g;

  function classify(str) {
    return str.replace(classifyRe, (_, c) => (c ? c.toUpperCase() : ''));
  }

  const hyphenateRe = /([a-z\d])([A-Z])/g;

  function hyphenate(str) {
    return str
      .replace(hyphenateRe, '$1-$2')
      .toLowerCase();
  }

  const camelizeRE = /-(\w)/g;

  function camelize(str) {
    return str.replace(camelizeRE, toUpper);
  }

  function toUpper(_, c) {
    return c ? c.toUpperCase() : '';
  }

  function ucfirst(str) {
    return str.length ? toUpper(null, str.charAt(0)) + str.slice(1) : '';
  }

  const strPrototype = String.prototype;
  const startsWithFn = strPrototype.startsWith || function (search) { return this.lastIndexOf(search, 0) === 0; };

  function startsWith(str, search) {
    return startsWithFn.call(str, search);
  }

  const endsWithFn = strPrototype.endsWith || function (search) { return this.substr(-1 * search.length) === search; };

  function endsWith(str, search) {
    return endsWithFn.call(str, search);
  }

  const includesFn = function (search) { return ~this.indexOf(search); };
  const includesStr = strPrototype.includes || includesFn;
  const includesArray = Array.prototype.includes || includesFn;

  function includes(obj, search) {
    return obj && (isString(obj) ? includesStr : includesArray).call(obj, search);
  }

  const isArray = Array.isArray;

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  function isObject(obj) {
    return obj !== null && typeof obj === 'object';
  }

  function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;
  }

  function isWindow(obj) {
    return isObject(obj) && obj === obj.window;
  }

  function isDocument(obj) {
    return isObject(obj) && obj.nodeType === 9;
  }

  function isBoolean(value) {
    return typeof value === 'boolean';
  }

  function isString(value) {
    return typeof value === 'string';
  }

  function isNumber(value) {
    return typeof value === 'number';
  }

  function isNumeric(value) {
    return isNumber(value) || isString(value) && !isNaN(value - parseFloat(value));
  }

  function isUndefined(value) {
    return value === void 0;
  }

  function toBoolean(value) {
    return isBoolean(value)
      ? value
      : value === 'true' || value === '1' || value === ''
        ? true
        : value === 'false' || value === '0'
          ? false
          : value;
  }

  function toNumber(value) {
    const number = Number(value);
    return !isNaN(number) ? number : false;
  }

  function toFloat(value) {
    return parseFloat(value) || 0;
  }

  function toList(value) {
    return isArray(value)
      ? value
      : isString(value)
        ? value.split(',').map(value => (isNumeric(value)
          ? toNumber(value)
          : toBoolean(value.trim())))
        : [value];
  }

  const vars = {};

  function toMedia(value) {
    if (isString(value)) {
      if (value[0] === '@') {
        const name = `media-${value.substr(1)}`;
        value = vars[name] || (vars[name] = toFloat(getCssVar(name)));
      } else if (isNaN(value)) {
        return value;
      }
    }

    return value && !isNaN(value) ? (`(min-width: ${value}px)`) : false;
  }

  function coerce(type, value, context) {
    if (type === Boolean) {
      return toBoolean(value);
    } else if (type === Number) {
      return toNumber(value);
    } else if (type === 'query') {
      return query(value, context);
    } else if (type === 'list') {
      return toList(value);
    } else if (type === 'media') {
      return toMedia(value);
    }

    return type ? type(value) : value;
  }

  function toMs(time) {
    return !time
      ? 0
      : endsWith(time, 'ms')
        ? toFloat(time)
        : toFloat(time) * 1000;
  }

  function swap(value, a, b) {
    return value.replace(new RegExp((`${a}|${b}`), 'mg'), match => (match === a ? b : a));
  }

  const assign = Object.assign || function (target) {
    let args = [],
      len = arguments.length - 1;
    while (len-- > 0) args[len] = arguments[len + 1];

    target = Object(target);
    for (let i = 0; i < args.length; i++) {
      const source = args[i];
      if (source !== null) {
        for (const key in source) {
          if (hasOwn(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };

  function each(obj, cb) {
    for (const key in obj) {
      if (cb.call(obj[key], obj[key], key) === false) {
        break;
      }
    }
  }

  function clamp(number, min, max) {
    if (min === void 0) min = 0;
    if (max === void 0) max = 1;

    return Math.min(Math.max(number, min), max);
  }

  function noop() {}

  function intersectRect(r1, r2) {
    return r1.left <= r2.right &&
        r2.left <= r1.right &&
        r1.top <= r2.bottom &&
        r2.top <= r1.bottom;
  }

  function pointInRect(point, rect) {
    return intersectRect({
      top: point.y, bottom: point.y, left: point.x, right: point.x,
    }, rect);
  }

  function ajax(url, options) {
    return new Promise(((resolve, reject) => {
      const env = assign({
        url,
        data: null,
        method: 'GET',
        headers: {},
        xhr: new XMLHttpRequest(),
        beforeSend: noop,
        responseType: '',
      }, options);

      env.beforeSend(env);

      env.xhr.open(env.method, env.url);
      env.xhr.responseType = env.responseType;

      env.xhr.onload = function () {
        if (this.status === 0 || this.status >= 200 && this.status < 300 || this.status === 304) {
          resolve(this);
        } else {
          reject(assign(Error(this.statusText), {
            xhr: this,
            status: this.status,
          }));
        }
      };

      env.xhr.onerror = function () {
        reject(assign(Error('Network Error'), { xhr: this }));
      };

      env.xhr.ontimeout = function () {
        reject(assign(Error('Network Timeout'), { xhr: this }));
      };

      env.xhr.send(env.data);
    }));
  }

  const arrayProto = Array.prototype;

  function $$1(selector, context) {
    return !isString(selector)
      ? toNode(selector)
      : isHtml(selector)
        ? $$1(fragment(selector))
        : find(selector, context);
  }

  function $$(selector, context) {
    return !isString(selector)
      ? toNodes(selector)
      : isHtml(selector)
        ? $$(fragment(selector))
        : findAll(selector, context);
  }

  function isHtml(str) {
    return str[0] === '<' || str.match(/^\s*</);
  }

  function query(selector, context) {
    return $$1(selector, isContextSelector(selector) ? context : doc);
  }

  function queryAll(selector, context) {
    return $$(selector, isContextSelector(selector) ? context : doc);
  }

  function find(selector, context) {
    if (context === void 0) context = doc;


    try {
      return !selector
        ? null
        : !isContextSelector(selector)
          ? context.querySelector(selector)
          : $$1(_query(selector, context));
    } catch (e) {
      return null;
    }
  }

  function findAll(selector, context) {
    if (context === void 0) context = doc;


    try {
      return !selector
        ? []
        : !isContextSelector(selector)
          ? $$(context.querySelectorAll(selector))
          : $$(_query(selector, context));
    } catch (e) {
      return [];
    }
  }

  function _query(selector, context) {
    if (includes(selector, ',')) {
      return merge(selector.split(',').map(selector => find(selector.trim(), context)));
    }

    return getContextSelectors(selector).reduce((context, selector) => resolveQuery(selector, context), context);
  }

  function filter(element, selector) {
    return $$(element).filter(element => matches(element, selector));
  }

  function within(element, selector) {
    return !isString(selector)
      ? element === selector || toNode(selector).contains(toNode(element))
      : matches(element, selector) || closest(element, selector);
  }

  const contextSelector = '^,?[!+-]?\\s*>|(?:^|\\s)[!+-]';
  const contextSelectorRe = new RegExp(contextSelector);
  const contextSplitRe = new RegExp((`(?=${contextSelector})`), 'g');

  function isContextSelector(selector) {
    return isString(selector) && selector.match(contextSelectorRe);
  }

  function getContextSelectors(selector) {
    return isString(selector) && selector.split(contextSplitRe);
  }

  function resolveQuery(query, context) {
    if (!isString(query) || !context) {
      return null;
    }

    query = query.trim();

    let selectors = query.substr(1).trim().split(' '),
      contextSelector = selectors[0] || '*',
      selector = selectors.slice(1).join(' ');
    switch (query[0]) {
      case '>':
        return merge(filter(context.children, contextSelector).map(el => !selector && el || $$(selector, el)));
      case '!':
        return closest(context.parentNode, query.substr(1));
      case '+':
        return findDir(context, contextSelector, selector, 'next');
      case '-':
        return findDir(context, contextSelector, selector, 'previous');
    }

    return $$1(query, context);
  }

  function findDir(element, contextSelector, selector, dir) {
    let fn = [(`${dir}ElementSibling`)],
      nodes = [];

    element = element[fn];

    while (element) {
      if (matches(element, contextSelector)) {
        nodes = nodes.concat(selector ? $$(selector, element) : element);
      }

      element = element[fn];
    }

    return nodes;
  }

  const elProto = Element.prototype;
  const matchesFn = elProto.matches || elProto.msMatchesSelector;

  function matches(element, selector) {
    return toNodes(element).some(element => matchesFn.call(element, selector));
  }

  const closestFn = elProto.closest || function (selector) {
    let ancestor = this;

    if (!docEl.contains(this)) {
      return;
    }

    do {
      if (matches(ancestor, selector)) {
        return ancestor;
      }

      ancestor = ancestor.parentNode;
    } while (ancestor && ancestor.nodeType === 1);
  };

  function closest(element, selector) {
    if (startsWith(selector, '>')) {
      selector = selector.slice(1);
    }

    return isNode(element) ? closestFn.call(element, selector) : toNodes(element).map(element => closestFn.call(element, selector));
  }

  function parents(element, selector) {
    let elements = [],
      parent = toNode(element).parentNode;

    while (parent && parent.nodeType === 1) {
      if (matches(parent, selector)) {
        elements.push(parent);
      }

      parent = parent.parentNode;
    }

    return elements;
  }

  function isJQuery(obj) {
    return isObject(obj) && !!obj.jquery;
  }

  function isNode(element) {
    return element instanceof Node || isObject(element) && element.nodeType === 1;
  }

  function isNodeCollection(element) {
    return element instanceof NodeList || element instanceof HTMLCollection;
  }

  function toNode(element) {
    return isNode(element) || isWindow(element) || isDocument(element)
      ? element
      : isNodeCollection(element) || isJQuery(element)
        ? element[0]
        : isArray(element)
          ? toNode(element[0])
          : null;
  }

  function toNodes(element) {
    return isNode(element)
      ? [element]
      : isNodeCollection(element)
        ? arrayProto.slice.call(element)
        : isArray(element)
          ? element.map(toNode).filter(Boolean)
          : isJQuery(element)
            ? element.toArray()
            : [];
  }

  function merge(arrays) {
    return arrayProto.concat.apply([], arrays);
  }

  function attr(element, name, value) {
    if (isObject(name)) {
      for (const key in name) {
        attr(element, key, name[key]);
      }
      return;
    }

    if (isUndefined(value)) {
      element = toNode(element);
      return element && element.getAttribute(name);
    }
    toNodes(element).forEach((element) => {
      if (isFunction(value)) {
        value = value.call(element, attr(element, name));
      }

      if (value === null) {
        removeAttr(element, name);
      } else {
        element.setAttribute(name, value);
      }
    });
  }

  function hasAttr(element, name) {
    return toNodes(element).some(element => element.hasAttribute(name));
  }

  function removeAttr(element, name) {
    element = toNodes(element);
    name.split(' ').forEach(name => element.forEach(element => element.removeAttribute(name)));
  }

  function filterAttr(element, attribute, pattern, replacement) {
    attr(element, attribute, value => (value ? value.replace(pattern, replacement) : value));
  }

  function data(element, attribute) {
    for (let i = 0, attrs = [attribute, (`data-${attribute}`)]; i < attrs.length; i++) {
      if (hasAttr(element, attrs[i])) {
        return attr(element, attrs[i]);
      }
    }
  }

  const win = window;
  var doc = document;
  var docEl = doc.documentElement;

  const isRtl = attr(docEl, 'dir') === 'rtl';

  function isReady() {
    return doc.readyState === 'complete' || doc.readyState !== 'loading' && !docEl.doScroll;
  }

  function ready(fn) {
    if (isReady()) {
      fn();
      return;
    }

    var handle = function () {
        unbind1();
        unbind2();
        fn();
      },
      unbind1 = on(doc, 'DOMContentLoaded', handle),
      unbind2 = on(win, 'load', handle);
  }

  const transitioncancel = 'transitioncanceled';

  function transition(element, props, duration, transition) {
    if (duration === void 0) duration = 400;
    if (transition === void 0) transition = 'linear';


    return Promise.all(toNodes(element).map(element => new Promise(((resolve, reject) => {
      for (const name in props) {
        const value = css(element, name);
        if (value === '') {
          css(element, name, value);
        }
      }

      const timer = setTimeout(() => trigger(element, transitionend), duration);

      once(element, (`${transitionend} ${transitioncancel}`), (ref) => {
        const type = ref.type;

        clearTimeout(timer);
        removeClass(element, 'uk-transition');
        css(element, 'transition', '');
        type === transitioncancel ? reject() : resolve();
      }, false, (ref) => {
        const target = ref.target;

        return element === target;
      });

      addClass(element, 'uk-transition');
      css(element, assign({ transition: (`all ${duration}ms ${transition}`) }, props));
    }))));
  }

  const Transition = {

    start: transition,

    stop: function stop(element) {
      trigger(element, transitionend);
      return Promise.resolve();
    },

    cancel: function cancel(element) {
      trigger(element, transitioncancel);
    },

    inProgress: function inProgress(element) {
      return hasClass(element, 'uk-transition');
    },

  };

  const animationcancel = 'animationcancel';
  const animationPrefix = 'uk-animation-';
  const clsCancelAnimation = 'uk-cancel-animation';

  function animate(element, animation, duration, origin, out) {
    const arguments$1 = arguments;
    if (duration === void 0) duration = 200;


    return Promise.all(toNodes(element).map(element => new Promise(((resolve, reject) => {
      if (hasClass(element, clsCancelAnimation)) {
        requestAnimationFrame(() => Promise.resolve().then(() => animate(...arguments$1).then(resolve, reject)));
        return;
      }

      let cls = `${animation} ${animationPrefix}${out ? 'leave' : 'enter'}`;

      if (startsWith(animation, animationPrefix)) {
        if (origin) {
          cls += ` ${animationPrefix}${origin}`;
        }

        if (out) {
          cls += ` ${animationPrefix}reverse`;
        }
      }

      reset();

      once(element, (`${animationend || 'animationend'} ${animationcancel}`), (ref) => {
        const type = ref.type;


        let hasReset = false;

        if (type === animationcancel) {
          reject();
          reset();
        } else {
          resolve();
          Promise.resolve().then(() => {
            hasReset = true;
            reset();
          });
        }

        requestAnimationFrame(() => {
          if (!hasReset) {
            addClass(element, clsCancelAnimation);

            requestAnimationFrame(() => removeClass(element, clsCancelAnimation));
          }
        });
      }, false, (ref) => {
        const target = ref.target;

        return element === target;
      });

      css(element, 'animationDuration', (`${duration}ms`));
      addClass(element, cls);

      if (!animationend) {
        requestAnimationFrame(() => Animation.cancel(element));
      }

      function reset() {
        css(element, 'animationDuration', '');
        removeClasses(element, (`${animationPrefix}\\S*`));
      }
    }))));
  }

  const inProgress = new RegExp((`${animationPrefix}(enter|leave)`));
  var Animation = {

    in: function in$1(element, animation, duration, origin) {
      return animate(element, animation, duration, origin, false);
    },

    out: function out(element, animation, duration, origin) {
      return animate(element, animation, duration, origin, true);
    },

    inProgress: function inProgress$1(element) {
      return inProgress.test(attr(element, 'class'));
    },

    cancel: function cancel(element) {
      trigger(element, animationcancel);
    },

  };

  function isInView(element, top, left) {
    if (top === void 0) top = 0;
    if (left === void 0) left = 0;

    return intersectRect(toNode(element).getBoundingClientRect(), {
      top,
      left,
      bottom: top + height(win),
      right: left + width(win),
    });
  }

  function scrolledOver(element) {
    element = toNode(element);

    let elHeight = element.offsetHeight,
      top = positionTop(element),
      vp = height(win),
      vh = vp + Math.min(0, top - vp),
      diff = Math.max(0, vp - (height(doc) - (top + elHeight)));

    return clamp(((vh + win.pageYOffset - top) / ((vh + (elHeight - (diff < vp ? diff : 0))) / 100)) / 100);
  }

  function positionTop(element) {
    let top = 0;

    do {
      top += element.offsetTop;
    } while (element = element.offsetParent);

    return top;
  }

  function getIndex(i, elements, current) {
    if (current === void 0) current = 0;


    elements = toNodes(elements);

    const length = elements.length;

    i = (isNumeric(i)
      ? toNumber(i)
      : i === 'next'
        ? current + 1
        : i === 'previous'
          ? current - 1
          : index(elements, i)
    ) % length;

    return i < 0 ? i + length : i;
  }

  const voidElements = {
    area: true,
    base: true,
    br: true,
    col: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    menuitem: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true,
  };
  function isVoidElement(element) {
    return voidElements[toNode(element).tagName.toLowerCase()];
  }

  const Dimensions = {

    ratio: function ratio(dimensions, prop, value) {
      const aProp = prop === 'width' ? 'height' : 'width';

      return (obj = {}, obj[aProp] = Math.round(value * dimensions[aProp] / dimensions[prop]), obj[prop] = value, obj);
      let obj;
    },

    contain: function contain(dimensions, maxDimensions) {
      const this$1 = this;

      dimensions = assign({}, dimensions);

      each(dimensions, (_, prop) => dimensions = dimensions[prop] > maxDimensions[prop]
        ? this$1.ratio(dimensions, prop, maxDimensions[prop])
        : dimensions);

      return dimensions;
    },

    cover: function cover(dimensions, maxDimensions) {
      const this$1 = this;

      dimensions = this.contain(dimensions, maxDimensions);

      each(dimensions, (_, prop) => dimensions = dimensions[prop] < maxDimensions[prop]
        ? this$1.ratio(dimensions, prop, maxDimensions[prop])
        : dimensions);

      return dimensions;
    },

  };

  function preventClick() {
    const timer = setTimeout(() => trigger(doc, 'click'), 0);

    once(doc, 'click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      clearTimeout(timer);
    }, true);
  }

  function isVisible(element) {
    return toNodes(element).some(element => element.offsetHeight);
  }

  const selInput = 'input,select,textarea,button';
  function isInput(element) {
    return toNodes(element).some(element => matches(element, selInput));
  }

  function empty(element) {
    element = toNode(element);
    element.innerHTML = '';
    return element;
  }

  function html(parent, html) {
    parent = toNode(parent);
    return isUndefined(html)
      ? parent.innerHTML
      : append(parent.hasChildNodes() ? empty(parent) : parent, html);
  }

  function prepend(parent, element) {
    parent = toNode(parent);

    if (!parent.hasChildNodes()) {
      return append(parent, element);
    }
    return insertNodes(element, element => parent.insertBefore(element, parent.firstChild));
  }

  function append(parent, element) {
    parent = toNode(parent);
    return insertNodes(element, element => parent.appendChild(element));
  }

  function before(ref, element) {
    ref = toNode(ref);
    return insertNodes(element, element => ref.parentNode.insertBefore(element, ref));
  }

  function after(ref, element) {
    ref = toNode(ref);
    return insertNodes(element, element => (ref.nextSibling
      ? before(ref.nextSibling, element)
      : append(ref.parentNode, element)));
  }

  function insertNodes(element, fn) {
    element = isString(element) ? fragment(element) : element;
    return 'length' in element ? toNodes(element).map(fn) : fn(element);
  }

  function remove(element) {
    toNodes(element).map(element => element.parentNode && element.parentNode.removeChild(element));
  }

  function wrapAll(element, structure) {
    structure = toNode(before(element, structure));

    while (structure.firstChild) {
      structure = structure.firstChild;
    }

    append(structure, element);

    return structure;
  }

  function wrapInner(element, structure) {
    return toNodes(toNodes(element).map(element => (element.hasChildNodes ? wrapAll(toNodes(element.childNodes), structure) : append(element, structure))));
  }

  function unwrap(element) {
    toNodes(element)
      .map(element => element.parentNode)
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach((parent) => {
        before(parent, parent.childNodes);
        remove(parent);
      });
  }

  const fragmentRE = /^\s*<(\w+|!)[^>]*>/;
  const singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;

  function fragment(html) {
    let matches;

    if (matches = singleTagRE.exec(html)) {
      return doc.createElement(matches[1]);
    }

    const container = doc.createElement('div');
    if (fragmentRE.test(html)) {
      container.insertAdjacentHTML('beforeend', html.trim());
    } else {
      container.textContent = html;
    }

    return container.childNodes.length > 1 ? toNodes(container.childNodes) : container.firstChild;
  }

  function index(element, ref) {
    return ref
      ? toNodes(element).indexOf(toNode(ref))
      : toNodes((element = toNode(element)) && element.parentNode.children).indexOf(element);
  }

  const cssNumber = {
    'animation-iteration-count': true,
    'column-count': true,
    'fill-opacity': true,
    'flex-grow': true,
    'flex-shrink': true,
    'font-weight': true,
    'line-height': true,
    opacity: true,
    order: true,
    orphans: true,
    widows: true,
    'z-index': true,
    zoom: true,
  };

  function css(element, property, value) {
    return toNodes(element).map((element) => {
      if (isString(property)) {
        property = propName(property);

        if (isUndefined(value)) {
          return getStyle(element, property);
        } else if (!value && value !== 0) {
          element.style.removeProperty(property);
        } else {
          element.style[property] = isNumeric(value) && !cssNumber[property] ? (`${value}px`) : value;
        }
      } else if (isArray(property)) {
        const styles = getStyles(element);

        return property.reduce((props, property) => {
          props[property] = propName(styles[property]);
          return props;
        }, {});
      } else if (isObject(property)) {
        each(property, (value, property) => css(element, property, value));
      }

      return element;
    })[0];
  }

  function getStyles(element, pseudoElt) {
    element = toNode(element);
    return element.ownerDocument.defaultView.getComputedStyle(element, pseudoElt);
  }

  function getStyle(element, property, pseudoElt) {
    return getStyles(element, pseudoElt)[property];
  }

  const vars$1 = {};

  function getCssVar(name) {
    if (!(name in vars$1)) {
      /* usage in css:  .var-name:before { content:"xyz" } */

      const element = append(docEl, doc.createElement('div'));

      addClass(element, (`var-${name}`));

      try {
        vars$1[name] = getStyle(element, 'content', ':before').replace(/^["'](.*)["']$/, '$1');
        vars$1[name] = JSON.parse(vars$1[name]);
      } catch (e) {}

      docEl.removeChild(element);
    }

    return vars$1[name];
  }

  const cssProps = {};

  function propName(name) {
    let ret = cssProps[name];
    if (!ret) {
      ret = cssProps[name] = vendorPropName(name) || name;
    }
    return ret;
  }

  const cssPrefixes = ['webkit', 'moz', 'ms'];
  const style = doc.createElement('div').style;

  function vendorPropName(name) {
    name = hyphenate(name);

    if (name in style) {
      return name;
    }

    let i = cssPrefixes.length,
      prefixedName;

    while (i--) {
      prefixedName = `-${cssPrefixes[i]}${name}`;
      if (prefixedName in style) {
        return prefixedName;
      }
    }
  }

  let supportsClassList;
  let supportsMultiple;
  let supportsForce;

  function addClass(element) {
    let args = [],
      len = arguments.length - 1;
    while (len-- > 0) args[len] = arguments[len + 1];

    apply(element, args, 'add');
  }

  function removeClass(element) {
    let args = [],
      len = arguments.length - 1;
    while (len-- > 0) args[len] = arguments[len + 1];

    apply(element, args, 'remove');
  }

  function removeClasses(element, cls) {
    filterAttr(element, 'class', new RegExp((`(^|\\s)${cls}(?!\\S)`), 'g'), '');
  }

  function replaceClass(element) {
    let args = [],
      len = arguments.length - 1;
    while (len-- > 0) args[len] = arguments[len + 1];

    args[0] && removeClass(element, args[0]);
    args[1] && addClass(element, args[1]);
  }

  function hasClass(element, cls) {
    return supportsClassList && toNodes(element).some(element => element.classList.contains(cls));
  }

  function toggleClass(element) {
    let args = [],
      len = arguments.length - 1;
    while (len-- > 0) args[len] = arguments[len + 1];


    if (!supportsClassList || !args.length) {
      return;
    }

    args = getArgs(args);

    const force = !isString(args[args.length - 1]) ? args.pop() : undefined;

    toNodes(element).forEach((ref) => {
      const classList = ref.classList;

      for (let i = 0; i < args.length; i++) {
        supportsForce
          ? classList.toggle(args[i], force)
          : (classList[(!isUndefined(force) ? force : !classList.contains(args[i])) ? 'add' : 'remove'](args[i]));
      }
    });
  }

  function apply(element, args, fn) {
    args = getArgs(args).filter(arg => arg);

    supportsClassList && args.length && toNodes(element).forEach((ref) => {
      const classList = ref.classList;

      supportsMultiple
        ? classList[fn](...args)
        : args.forEach(cls => classList[fn](cls));
    });
  }

  function getArgs(args) {
    return args.reduce((args, arg) => {
      args.push(...isString(arg) && includes(arg, ' ') ? arg.trim().split(' ') : [arg]);
      return args;
    }, []);
  }

  (function () {
    let list = doc.createElement('_').classList;
    if (list) {
      list.add('a', 'b');
      list.toggle('c', false);
      supportsMultiple = list.contains('b');
      supportsForce = !list.contains('c');
      supportsClassList = true;
    }
    list = null;
  }());

  const Observer = win.MutationObserver || win.WebKitMutationObserver;
  var requestAnimationFrame = win.requestAnimationFrame || (function (fn) { return setTimeout(fn, 1000 / 60); });

  const hasTouchEvents = 'ontouchstart' in win;
  const hasPointerEvents = win.PointerEvent;
  const hasTouch = 'ontouchstart' in win
    || win.DocumentTouch && doc instanceof DocumentTouch
    || navigator.msPointerEnabled && navigator.msMaxTouchPoints // IE 10
    || navigator.pointerEnabled && navigator.maxTouchPoints; // IE >=11

  const pointerDown = !hasTouch ? 'mousedown' : (`mousedown ${hasTouchEvents ? 'touchstart' : 'pointerdown'}`);
  const pointerMove = !hasTouch ? 'mousemove' : (`mousemove ${hasTouchEvents ? 'touchmove' : 'pointermove'}`);
  const pointerUp = !hasTouch ? 'mouseup' : (`mouseup ${hasTouchEvents ? 'touchend' : 'pointerup'}`);
  const pointerEnter = hasTouch && hasPointerEvents ? 'pointerenter' : 'mouseenter';
  const pointerLeave = hasTouch && hasPointerEvents ? 'pointerleave' : 'mouseleave';

  var transitionend = prefix('transition', 'transition-end');
  const animationstart = prefix('animation', 'animation-start');
  var animationend = prefix('animation', 'animation-end');

  function getImage(src) {
    return new Promise(((resolve, reject) => {
      const img = new Image();

      img.onerror = reject;
      img.onload = function () { return resolve(img); };

      img.src = src;
    }));
  }

  function prefix(name, event) {
    let ucase = classify(name),
      lowered = classify(event).toLowerCase(),
      classified = classify(event),
      element = doc.body || docEl,
      names = (obj = {}, obj[name] = lowered, obj[(`Webkit${ucase}`)] = (`webkit${classified}`), obj[(`Moz${ucase}`)] = lowered, obj[(`o${ucase}`)] = (`o${classified} o${lowered}`), obj);
    let obj;

    for (name in names) {
      if (element.style[name] !== undefined) {
        return names[name];
      }
    }
  }

  function on() {
    let args = [],
      len = arguments.length;
    while (len--) args[len] = arguments[len];


    const ref = getArgs$1(args);
    let element = ref[0];
    const type = ref[1];
    const selector = ref[2];
    let listener = ref[3];
    const useCapture = ref[4];

    element = toNode(element);

    if (selector) {
      listener = delegate(element, selector, listener);
    }

    if (listener.length > 1) {
      listener = detail(listener);
    }

    type.split(' ').forEach(type => element.addEventListener(type, listener, useCapture));
    return function () { return off(element, type, listener, useCapture); };
  }

  function off(element, type, listener, useCapture) {
    if (useCapture === void 0) useCapture = false;

    type.split(' ').forEach(type => toNode(element).removeEventListener(type, listener, useCapture));
  }

  function once() {
    let args = [],
      len = arguments.length;
    while (len--) args[len] = arguments[len];


    const ref = getArgs$1(args);
    const element = ref[0];
    const type = ref[1];
    const selector = ref[2];
    const listener = ref[3];
    const useCapture = ref[4];
    const condition = ref[5];
    var off = on(element, type, selector, (e) => {
      const result = !condition || condition(e);
      if (result) {
        off();
        listener(e, result);
      }
    }, useCapture);

    return off;
  }

  function trigger(element, event, detail) {
    return toNodes(element).reduce(
      (notCanceled, element) => notCanceled && element.dispatchEvent(createEvent(event, true, true, detail))
      , true
    );
  }

  function createEvent(e, bubbles, cancelable, detail) {
    if (bubbles === void 0) bubbles = true;
    if (cancelable === void 0) cancelable = false;

    if (isString(e)) {
      const event = doc.createEvent('CustomEvent');
      event.initCustomEvent(e, bubbles, cancelable, detail);
      e = event;
    }

    return e;
  }

  function getArgs$1(args) {
    if (isString(args[0])) {
      args[0] = $$1(args[0]);
    }

    if (isFunction(args[2])) {
      args.splice(2, 0, false);
    }
    return args;
  }

  function delegate(element, selector, listener) {
    const this$1 = this;

    return function (e) {
      let target = e.target,
        current = selector[0] === '>'
          ? $$(selector, element).filter(element => within(target, element))[0]
          : closest(target, selector);

      if (current) {
        e.delegate = element;
        e.current = current;

        listener.call(this$1, e);
      }
    };
  }

  function detail(listener) {
    return function (e) { return isArray(e.detail) ? listener.apply(listener, [e].concat(e.detail)) : listener(e); };
  }

  /*
    Based on:
    Copyright (c) 2016 Wilson Page wilsonpage@me.com
    https://github.com/wilsonpage/fastdom
*/

  const fastdom = {

    reads: [],
    writes: [],

    measure: function measure(task) {
      this.reads.push(task);
      scheduleFlush();
      return task;
    },

    mutate: function mutate(task) {
      this.writes.push(task);
      scheduleFlush();
      return task;
    },

    clear: function clear(task) {
      return remove$1(this.reads, task) || remove$1(this.writes, task);
    },

    flush: function flush() {
      runTasks(this.reads);
      runTasks(this.writes.splice(0, this.writes.length));

      this.scheduled = false;

      if (this.reads.length || this.writes.length) {
        scheduleFlush();
      }
    },

  };

  function scheduleFlush() {
    if (!fastdom.scheduled) {
      fastdom.scheduled = true;
      requestAnimationFrame(fastdom.flush.bind(fastdom));
    }
  }

  function runTasks(tasks) {
    let task;
    while (task = tasks.shift()) {
      task();
    }
  }

  function remove$1(array, item) {
    const index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
  }

  function MouseTracker() {}

  MouseTracker.prototype = {

    positions: [],
    position: null,

    init: function init() {
      const this$1 = this;


      this.positions = [];
      this.position = null;

      let ticking = false;
      this.unbind = on(doc, 'mousemove', (e) => {
        if (ticking) {
          return;
        }

        setTimeout(() => {
          let time = Date.now(),
            length = this$1.positions.length;
          if (length && (time - this$1.positions[length - 1].time > 100)) {
            this$1.positions.splice(0, length);
          }

          this$1.positions.push({ time, x: e.pageX, y: e.pageY });

          if (this$1.positions.length > 5) {
            this$1.positions.shift();
          }

          ticking = false;
        }, 5);

        ticking = true;
      });
    },

    cancel: function cancel() {
      if (this.unbind) {
        this.unbind();
      }
    },

    movesTo: function movesTo(target) {
      if (this.positions.length < 2) {
        return false;
      }

      let p = offset(target),
        position = this.positions[this.positions.length - 1],
        prevPos = this.positions[0];

      if (p.left <= position.x && position.x <= p.right && p.top <= position.y && position.y <= p.bottom) {
        return false;
      }

      const points = [
        [{ x: p.left, y: p.top }, { x: p.right, y: p.bottom }],
        [{ x: p.right, y: p.top }, { x: p.left, y: p.bottom }],
      ];

      if (p.right <= position.x) {

      } else if (p.left >= position.x) {
        points[0].reverse();
        points[1].reverse();
      } else if (p.bottom <= position.y) {
        points[0].reverse();
      } else if (p.top >= position.y) {
        points[1].reverse();
      }

      return !!points.reduce((result, point) => result + (slope(prevPos, point[0]) < slope(position, point[0]) && slope(prevPos, point[1]) > slope(position, point[1])), 0);
    },

  };

  function slope(a, b) {
    return (b.y - a.y) / (b.x - a.x);
  }

  const strats = {};

  // concat strategy
  strats.args =
strats.created =
strats.events =
strats.init =
strats.ready =
strats.connected =
strats.disconnected =
strats.destroy = function (parentVal, childVal) {
  parentVal = parentVal && !isArray(parentVal) ? [parentVal] : parentVal;

  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
};

  // update strategy
  strats.update = function (parentVal, childVal) {
    return strats.args(parentVal, isFunction(childVal) ? { read: childVal } : childVal);
  };

  // property strategy
  strats.props = function (parentVal, childVal) {
    if (isArray(childVal)) {
      childVal = childVal.reduce((value, key) => {
        value[key] = String;
        return value;
      }, {});
    }

    return strats.methods(parentVal, childVal);
  };

  // extend strategy
  strats.computed =
strats.defaults =
strats.methods = function (parentVal, childVal) {
  return childVal
    ? parentVal
      ? assign({}, parentVal, childVal)
      : childVal
    : parentVal;
};

  // default strategy
  const defaultStrat = function (parentVal, childVal) {
    return isUndefined(childVal) ? parentVal : childVal;
  };

  function mergeOptions(parent, child) {
    let options = {},
      key;

    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i]);
      }
    }

    for (key in parent) {
      mergeKey(key);
    }

    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeKey(key);
      }
    }

    function mergeKey(key) {
      options[key] = (strats[key] || defaultStrat)(parent[key], child[key]);
    }

    return options;
  }

  let id = 0;

  const Player = function Player(el) {
    this.id = ++id;
    this.el = toNode(el);
  };

  Player.prototype.isVideo = function isVideo() {
    return this.isYoutube() || this.isVimeo() || this.isHTML5();
  };

  Player.prototype.isHTML5 = function isHTML5() {
    return this.el.tagName === 'VIDEO';
  };

  Player.prototype.isIFrame = function isIFrame() {
    return this.el.tagName === 'IFRAME';
  };

  Player.prototype.isYoutube = function isYoutube() {
    return this.isIFrame() && !!this.el.src.match(/\/\/.*?youtube\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/);
  };

  Player.prototype.isVimeo = function isVimeo() {
    return this.isIFrame() && !!this.el.src.match(/vimeo\.com\/video\/.*/);
  };

  Player.prototype.enableApi = function enableApi() {
    const this$1 = this;


    if (this.ready) {
      return this.ready;
    }

    let youtube = this.isYoutube(),
      vimeo = this.isVimeo(),
      poller;

    if (youtube || vimeo) {
      return this.ready = new Promise(((resolve) => {
        once(this$1.el, 'load', () => {
          if (youtube) {
            const listener = function () { return post(this$1.el, { event: 'listening', id: this$1.id }); };
            poller = setInterval(listener, 100);
            listener();
          }
        });

        listen(data => youtube && data.id === this$1.id && data.event === 'onReady' || vimeo && Number(data.player_id) === this$1.id)
          .then(() => {
            resolve();
            poller && clearInterval(poller);
          });

        attr(this$1.el, 'src', (`${this$1.el.src}${includes(this$1.el.src, '?') ? '&' : '?'}${youtube ? 'enablejsapi=1' : (`api=1&player_id=${id}`)}`));
      }));
    }

    return Promise.resolve();
  };

  Player.prototype.play = function play() {
    const this$1 = this;


    if (!this.isVideo()) {
      return;
    }

    if (this.isIFrame()) {
      this.enableApi().then(() => post(this$1.el, { func: 'playVideo', method: 'play' }));
    } else if (this.isHTML5()) {
      this.el.play();
    }
  };

  Player.prototype.pause = function pause() {
    const this$1 = this;


    if (!this.isVideo()) {
      return;
    }

    if (this.isIFrame()) {
      this.enableApi().then(() => post(this$1.el, { func: 'pauseVideo', method: 'pause' }));
    } else if (this.isHTML5()) {
      this.el.pause();
    }
  };

  Player.prototype.mute = function mute() {
    const this$1 = this;


    if (!this.isVideo()) {
      return;
    }

    if (this.isIFrame()) {
      this.enableApi().then(() => post(this$1.el, { func: 'mute', method: 'setVolume', value: 0 }));
    } else if (this.isHTML5()) {
      this.el.muted = true;
      attr(this.el, 'muted', '');
    }
  };

  function post(el, cmd) {
    try {
      el.contentWindow.postMessage(JSON.stringify(assign({ event: 'command' }, cmd)), '*');
    } catch (e) {}
  }

  function listen(cb) {
    return new Promise(((resolve) => {
      once(win, 'message', (_, data) => resolve(data), false, (ref) => {
        let data = ref.data;


        if (!data || !isString(data)) {
          return;
        }

        try {
          data = JSON.parse(data);
        } catch (e) {
          return;
        }

        return data && cb(data);
      });
    }));
  }

  const dirs = {
    width: ['x', 'left', 'right'],
    height: ['y', 'top', 'bottom'],
  };

  function positionAt(element, target, elAttach, targetAttach, elOffset, targetOffset, flip, boundary) {
    elAttach = getPos(elAttach);
    targetAttach = getPos(targetAttach);

    const flipped = { element: elAttach, target: targetAttach };

    if (!element || !target) {
      return flipped;
    }

    let dim = getDimensions(element),
      targetDim = getDimensions(target),
      position = targetDim;

    moveTo(position, elAttach, dim, -1);
    moveTo(position, targetAttach, targetDim, 1);

    elOffset = getOffsets(elOffset, dim.width, dim.height);
    targetOffset = getOffsets(targetOffset, targetDim.width, targetDim.height);

    elOffset.x += targetOffset.x;
    elOffset.y += targetOffset.y;

    position.left += elOffset.x;
    position.top += elOffset.y;

    boundary = getDimensions(boundary || getWindow(element));

    if (flip) {
      each(dirs, (ref, prop) => {
        const dir = ref[0];
        const align = ref[1];
        const alignFlip = ref[2];


        if (!(flip === true || includes(flip, dir))) {
          return;
        }

        let elemOffset = elAttach[dir] === align
            ? -dim[prop]
            : elAttach[dir] === alignFlip
              ? dim[prop]
              : 0,
          targetOffset = targetAttach[dir] === align
            ? targetDim[prop]
            : targetAttach[dir] === alignFlip
              ? -targetDim[prop]
              : 0;

        if (position[align] < boundary[align] || position[align] + dim[prop] > boundary[alignFlip]) {
          let centerOffset = dim[prop] / 2,
            centerTargetOffset = targetAttach[dir] === 'center' ? -targetDim[prop] / 2 : 0;

          elAttach[dir] === 'center' && (
            apply(centerOffset, centerTargetOffset)
                    || apply(-centerOffset, -centerTargetOffset)
          ) || apply(elemOffset, targetOffset);
        }

        function apply(elemOffset, targetOffset) {
          const newVal = position[align] + elemOffset + targetOffset - elOffset[dir] * 2;

          if (newVal >= boundary[align] && newVal + dim[prop] <= boundary[alignFlip]) {
            position[align] = newVal;

            ['element', 'target'].forEach((el) => {
              flipped[el][dir] = !elemOffset
                ? flipped[el][dir]
                : flipped[el][dir] === dirs[prop][1]
                  ? dirs[prop][2]
                  : dirs[prop][1];
            });

            return true;
          }
        }
      });
    }

    offset(element, position);

    return flipped;
  }

  function offset(element, coordinates) {
    element = toNode(element);

    if (coordinates) {
      let currentOffset = offset(element),
        pos = css(element, 'position');

      ['left', 'top'].forEach((prop) => {
        if (prop in coordinates) {
          const value = css(element, prop);
          element.style[prop] = `${(coordinates[prop] - currentOffset[prop])
                    + toFloat(pos === 'absolute' && value === 'auto' ? position(element)[prop] : value)}px`;
        }
      });

      return;
    }

    return getDimensions(element);
  }

  function getDimensions(element) {
    element = toNode(element);

    const ref = getWindow(element);
    const top = ref.pageYOffset;
    const left = ref.pageXOffset;

    if (isWindow(element)) {
      let height = element.innerHeight,
        width = element.innerWidth;

      return {
        top,
        left,
        height,
        width,
        bottom: top + height,
        right: left + width,
      };
    }

    let display = false;
    if (!isVisible(element)) {
      display = element.style.display;
      element.style.display = 'block';
    }

    const rect = element.getBoundingClientRect();

    if (display !== false) {
      element.style.display = display;
    }

    return {
      height: rect.height,
      width: rect.width,
      top: rect.top + top,
      left: rect.left + left,
      bottom: rect.bottom + top,
      right: rect.right + left,
    };
  }

  function position(element) {
    element = toNode(element);

    let parent = offsetParent(element),
      parentOffset = parent === docEl$1(element) ? { top: 0, left: 0 } : offset(parent);

    return ['top', 'left'].reduce((props, prop) => {
      const propName = ucfirst(prop);
      props[prop] -= parentOffset[prop]
            + (toFloat(css(element, (`margin${propName}`))) || 0)
            + (toFloat(css(parent, (`border${propName}Width`))) || 0);
      return props;
    }, offset(element));
  }

  function offsetParent(element) {
    let parent = toNode(element).offsetParent;

    while (parent && css(parent, 'position') === 'static') {
      parent = parent.offsetParent;
    }

    return parent || docEl$1(element);
  }

  var height = dimension('height');
  var width = dimension('width');

  function dimension(prop) {
    const propName = ucfirst(prop);
    return function (element, value) {
      element = toNode(element);

      if (isUndefined(value)) {
        if (isWindow(element)) {
          return element[(`inner${propName}`)];
        }

        if (isDocument(element)) {
          const doc = element.documentElement;
          return Math.max(doc.offsetHeight, doc.scrollHeight);
        }

        value = css(element, prop);
        value = value === 'auto' ? element[(`offset${propName}`)] : toFloat(value) || 0;

        return getContentSize(prop, element, value);
      }

      css(element, prop, !value && value !== 0
        ? ''
        : `${getContentSize(prop, element, value)}px`);
    };
  }

  function getContentSize(prop, element, value) {
    return css(element, 'boxSizing') === 'border-box' ? dirs[prop].slice(1).map(ucfirst).reduce(
      (value, prop) => value
            - toFloat(css(element, (`padding${prop}`)))
            - toFloat(css(element, (`border${prop}Width`)))
      , value
    ) : value;
  }

  function getWindow(element) {
    return isWindow(element) ? element : document$1(element).defaultView;
  }

  function moveTo(position, attach, dim, factor) {
    each(dirs, (ref, prop) => {
      const dir = ref[0];
      const align = ref[1];
      const alignFlip = ref[2];

      if (attach[dir] === alignFlip) {
        position[align] += dim[prop] * factor;
      } else if (attach[dir] === 'center') {
        position[align] += dim[prop] * factor / 2;
      }
    });
  }

  function getPos(pos) {
    let x = /left|center|right/,
      y = /top|center|bottom/;

    pos = (pos || '').split(' ');

    if (pos.length === 1) {
      pos = x.test(pos[0])
        ? pos.concat(['center'])
        : y.test(pos[0])
          ? ['center'].concat(pos)
          : ['center', 'center'];
    }

    return {
      x: x.test(pos[0]) ? pos[0] : 'center',
      y: y.test(pos[1]) ? pos[1] : 'center',
    };
  }

  function getOffsets(offsets, width, height) {
    const ref = (offsets || '').split(' ');
    const x = ref[0];
    const y = ref[1];

    return {
      x: x ? toFloat(x) * (endsWith(x, '%') ? width / 100 : 1) : 0,
      y: y ? toFloat(y) * (endsWith(y, '%') ? height / 100 : 1) : 0,
    };
  }

  function flipPosition(pos) {
    switch (pos) {
      case 'left':
        return 'right';
      case 'right':
        return 'left';
      case 'top':
        return 'bottom';
      case 'bottom':
        return 'top';
      default:
        return pos;
    }
  }

  function document$1(element) {
    return toNode(element).ownerDocument;
  }

  function docEl$1(element) {
    return document$1(element).documentElement;
  }

  /*
    Based on:
    Copyright (c) 2010-2016 Thomas Fuchs
    http://zeptojs.com/
*/

  let touch = {};
  let clickTimeout;
  let swipeTimeout;
  let tapTimeout;
  let clicked;

  function swipeDirection(ref) {
    const x1 = ref.x1;
    const x2 = ref.x2;
    const y1 = ref.y1;
    const y2 = ref.y2;

    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
  }

  function cancelAll() {
    clickTimeout && clearTimeout(clickTimeout);
    swipeTimeout && clearTimeout(swipeTimeout);
    tapTimeout && clearTimeout(tapTimeout);
    clickTimeout = swipeTimeout = tapTimeout = null;
    touch = {};
  }

  ready(() => {
    on(doc, 'click', () => clicked = true, true);

    on(doc, pointerDown, (e) => {
      const target = e.target;
      const ref = getPos$1(e);
      const x = ref.x;
      const y = ref.y;
      const now = Date.now();

      touch.el = 'tagName' in target ? target : target.parentNode;

      clickTimeout && clearTimeout(clickTimeout);

      touch.x1 = x;
      touch.y1 = y;

      if (touch.last && now - touch.last <= 250) {
        touch = {};
      }

      touch.last = now;

      clicked = e.button > 0;
    });

    on(doc, pointerMove, (e) => {
      const ref = getPos$1(e);
      const x = ref.x;
      const y = ref.y;

      touch.x2 = x;
      touch.y2 = y;
    });

    on(doc, pointerUp, (ref) => {
      const target = ref.target;


      // swipe
      if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) {
        swipeTimeout = setTimeout(() => {
          if (touch.el) {
            trigger(touch.el, 'swipe');
            trigger(touch.el, (`swipe${swipeDirection(touch)}`));
          }
          touch = {};
        });

        // normal tap
      } else if ('last' in touch) {
        tapTimeout = setTimeout(() => touch.el && trigger(touch.el, 'tap'));

        // trigger single click after 350ms of inactivity
        if (touch.el && within(target, touch.el)) {
          clickTimeout = setTimeout(() => {
            clickTimeout = null;
            if (touch.el && !clicked) {
              trigger(touch.el, 'click');
            }
            touch = {};
          }, 350);
        }
      } else {
        touch = {};
      }
    });

    on(doc, 'touchcancel', cancelAll);
    on(win, 'scroll', cancelAll);
  });

  let touching = false;
  on(doc, 'touchstart', () => touching = true, true);
  on(doc, 'click', () => { touching = false; });
  on(doc, 'touchcancel', () => touching = false, true);

  function isTouch(e) {
    return touching || e.pointerType === 'touch';
  }

  function getPos$1(e) {
    const touches = e.touches;
    const changedTouches = e.changedTouches;

    const ref = touches && touches[0] || changedTouches && changedTouches[0] || e;
    const x = ref.pageX;
    const y = ref.pageY;
    return { x, y };
  }


  const util = Object.freeze({
    bind,
    hasOwn,
    Promise,
    classify,
    hyphenate,
    camelize,
    ucfirst,
    startsWith,
    endsWith,
    includes,
    isArray,
    isFunction,
    isObject,
    isPlainObject,
    isWindow,
    isDocument,
    isBoolean,
    isString,
    isNumber,
    isNumeric,
    isUndefined,
    toBoolean,
    toNumber,
    toFloat,
    toList,
    toMedia,
    coerce,
    toMs,
    swap,
    assign,
    each,
    clamp,
    noop,
    intersectRect,
    pointInRect,
    ajax,
    $: $$1,
    $$,
    query,
    queryAll,
    filter,
    within,
    matches,
    closest,
    parents,
    isJQuery,
    toNode,
    toNodes,
    attr,
    hasAttr,
    removeAttr,
    filterAttr,
    data,
    win,
    doc,
    docEl,
    isRtl,
    isReady,
    ready,
    transition,
    Transition,
    animate,
    Animation,
    isInView,
    scrolledOver,
    getIndex,
    isVoidElement,
    Dimensions,
    preventClick,
    isVisible,
    selInput,
    isInput,
    empty,
    html,
    prepend,
    append,
    before,
    after,
    remove,
    wrapAll,
    wrapInner,
    unwrap,
    fragment,
    index,
    css,
    getStyles,
    getStyle,
    getCssVar,
    addClass,
    removeClass,
    removeClasses,
    replaceClass,
    hasClass,
    toggleClass,
    Observer,
    requestAnimationFrame,
    hasTouch,
    pointerDown,
    pointerMove,
    pointerUp,
    pointerEnter,
    pointerLeave,
    transitionend,
    animationstart,
    animationend,
    getImage,
    on,
    off,
    once,
    trigger,
    createEvent,
    fastdom,
    MouseTracker,
    mergeOptions,
    Player,
    positionAt,
    offset,
    position,
    height,
    width,
    flipPosition,
    isTouch,
    getPos: getPos$1,
  });

  const boot = function (UIkit) {
    const connect = UIkit.connect;
    const disconnect = UIkit.disconnect;

    if (Observer) {
      if (doc.body) {
        init();
      } else {
        (new Observer(function () {
          if (doc.body) {
            this.disconnect();
            init();
          }
        })).observe(docEl, { childList: true, subtree: true });
      }
    } else {
      ready(() => {
        apply(doc.body, connect);
        on(docEl, 'DOMNodeInserted', e => apply(e.target, connect));
        on(docEl, 'DOMNodeRemoved', e => apply(e.target, disconnect));
      });
    }

    function init() {
      apply(doc.body, connect);

      fastdom.flush();

      (new Observer((mutations => mutations.forEach((ref) => {
        const addedNodes = ref.addedNodes;
        const removedNodes = ref.removedNodes;
        const target = ref.target;


        for (var i = 0; i < addedNodes.length; i++) {
          apply(addedNodes[i], connect);
        }

        for (i = 0; i < removedNodes.length; i++) {
          apply(removedNodes[i], disconnect);
        }

        UIkit.update(createEvent('update', true, false, { mutation: true }), target, true);
      })))).observe(docEl, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['href'],
      });

      UIkit._initialized = true;
    }

    function apply(node, fn) {
      if (node.nodeType !== 1 || hasAttr(node, 'uk-no-boot')) {
        return;
      }

      fn(node);
      node = node.firstElementChild;
      while (node) {
        const next = node.nextElementSibling;
        apply(node, fn);
        node = next;
      }
    }
  };

  const globalAPI = function (UIkit) {
    const DATA = UIkit.data;

    UIkit.use = function (plugin) {
      if (plugin.installed) {
        return;
      }

      plugin.call(null, this);
      plugin.installed = true;

      return this;
    };

    UIkit.mixin = function (mixin, component) {
      component = (isString(component) ? UIkit.components[component] : component) || this;
      mixin = mergeOptions({}, mixin);
      mixin.mixins = component.options.mixins;
      delete component.options.mixins;
      component.options = mergeOptions(mixin, component.options);
    };

    UIkit.extend = function (options) {
      options = options || {};

      let Super = this,
        name = options.name || Super.options.name;
      const Sub = createClass(name || 'UIkitComponent');

      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(Super.options, options);

      Sub.super = Super;
      Sub.extend = Super.extend;

      return Sub;
    };

    UIkit.update = function (e, element, parents) {
      if (parents === void 0) parents = false;


      e = createEvent(e || 'update');

      if (!element) {
        update(UIkit.instances, e);
        return;
      }

      element = toNode(element);

      if (parents) {
        do {
          update(element[DATA], e);
          element = element.parentNode;
        } while (element);
      } else {
        apply(element, element => update(element[DATA], e));
      }
    };

    let container;
    Object.defineProperty(UIkit, 'container', {

      get: function get() {
        return container || doc.body;
      },

      set: function set(element) {
        container = element;
      },

    });

    function createClass(name) {
      return new Function((`return function ${classify(name)} (options) { this._init(options); }`))();
    }

    function apply(node, fn) {
      if (node.nodeType !== 1) {
        return;
      }

      fn(node);
      node = node.firstElementChild;
      while (node) {
        apply(node, fn);
        node = node.nextElementSibling;
      }
    }

    function update(data, e) {
      if (!data) {
        return;
      }

      for (const name in data) {
        if (data[name]._isReady) {
          data[name]._callUpdate(e);
        }
      }
    }
  };

  const hooksAPI = function (UIkit) {
    UIkit.prototype._callHook = function (hook) {
      const this$1 = this;


      const handlers = this.$options[hook];

      if (handlers) {
        handlers.forEach(handler => handler.call(this$1));
      }
    };

    UIkit.prototype._callReady = function () {
      if (this._isReady) {
        return;
      }

      this._isReady = true;
      this._callHook('ready');
      this._callUpdate();
    };

    UIkit.prototype._callConnected = function () {
      const this$1 = this;


      if (this._connected) {
        return;
      }

      if (!includes(UIkit.elements, this.$options.el)) {
        UIkit.elements.push(this.$options.el);
      }

      UIkit.instances[this._uid] = this;

      this._initEvents();

      this._callHook('connected');
      this._connected = true;

      this._initObserver();

      if (!this._isReady) {
        ready(() => this$1._callReady());
      }

      this._callUpdate();
    };

    UIkit.prototype._callDisconnected = function () {
      if (!this._connected) {
        return;
      }

      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }

      const index = UIkit.elements.indexOf(this.$options.el);

      if (~index) {
        UIkit.elements.splice(index, 1);
      }

      delete UIkit.instances[this._uid];

      this._unbindEvents();
      this._callHook('disconnected');

      this._connected = false;
    };

    UIkit.prototype._callUpdate = function (e) {
      const this$1 = this;


      e = createEvent(e || 'update');

      const type = e.type;
      const detail = e.detail;

      if (type === 'update' && detail && detail.mutation) {
        this._computeds = {};
      }

      const updates = this.$options.update;

      if (!updates) {
        return;
      }

      updates.forEach((update, i) => {
        if (type !== 'update' && !includes(update.events, type)) {
          return;
        }

        if (update.read && !includes(fastdom.reads, this$1._frames.reads[i])) {
          this$1._frames.reads[i] = fastdom.measure(() => {
            update.read.call(this$1, e);
            delete this$1._frames.reads[i];
          });
        }

        if (update.write && !includes(fastdom.writes, this$1._frames.writes[i])) {
          this$1._frames.writes[i] = fastdom.mutate(() => {
            update.write.call(this$1, e);
            delete this$1._frames.writes[i];
          });
        }
      });
    };
  };

  const stateAPI = function (UIkit) {
    let uid = 0;

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {
      options = options || {};
      options = this.$options = mergeOptions(this.constructor.options, options, this);

      this.$el = null;
      this.$name = UIkit.prefix + hyphenate(this.$options.name);
      this.$props = {};

      this._frames = { reads: {}, writes: {} };
      this._events = [];

      this._uid = uid++;
      this._initData();
      this._initMethods();
      this._initComputeds();
      this._callHook('created');

      if (options.el) {
        this.$mount(options.el);
      }
    };

    UIkit.prototype._initData = function () {
      const this$1 = this;


      const ref = this.$options;
      const defaults = ref.defaults;
      let data$$1 = ref.data; if (data$$1 === void 0) data$$1 = {};
      let args = ref.args; if (args === void 0) args = [];
      let props = ref.props; if (props === void 0) props = {};
      const el = ref.el;

      if (args.length && isArray(data$$1)) {
        data$$1 = data$$1.slice(0, args.length).reduce((data$$1, value, index) => {
          if (isPlainObject(value)) {
            assign(data$$1, value);
          } else {
            data$$1[args[index]] = value;
          }
          return data$$1;
        }, {});
      }

      for (const key in defaults) {
        this$1.$props[key] = this$1[key] = hasOwn(data$$1, key) && !isUndefined(data$$1[key])
          ? coerce(props[key], data$$1[key], el)
          : isArray(defaults[key])
            ? defaults[key].concat()
            : defaults[key];
      }
    };

    UIkit.prototype._initMethods = function () {
      const this$1 = this;


      const methods = this.$options.methods;

      if (methods) {
        for (const key in methods) {
          this$1[key] = bind(methods[key], this$1);
        }
      }
    };

    UIkit.prototype._initComputeds = function () {
      const this$1 = this;


      const computed = this.$options.computed;

      this._computeds = {};

      if (computed) {
        for (const key in computed) {
          registerComputed(this$1, key, computed[key]);
        }
      }
    };

    UIkit.prototype._initProps = function (props) {
      const this$1 = this;


      this._computeds = {};
      assign(this.$props, props || getProps(this.$options, this.$name));

      const exclude = [this.$options.computed, this.$options.methods];
      for (const key in this$1.$props) {
        if (notIn(exclude, key)) {
          this$1[key] = this$1.$props[key];
        }
      }
    };

    UIkit.prototype._initEvents = function () {
      const this$1 = this;


      const events = this.$options.events;

      if (events) {
        events.forEach((event) => {
          if (!hasOwn(event, 'handler')) {
            for (const key in event) {
              registerEvent(this$1, event[key], key);
            }
          } else {
            registerEvent(this$1, event);
          }
        });
      }
    };

    UIkit.prototype._unbindEvents = function () {
      this._events.forEach(unbind => unbind());
      this._events = [];
    };

    UIkit.prototype._initObserver = function () {
      const this$1 = this;


      const ref = this.$options;
      let attrs = ref.attrs;
      const props = ref.props;
      const el = ref.el;
      if (this._observer || !props || !attrs || !Observer) {
        return;
      }

      attrs = isArray(attrs) ? attrs : Object.keys(props).map(key => hyphenate(key));

      this._observer = new Observer((() => {
        const data$$1 = getProps(this$1.$options, this$1.$name);
        if (attrs.some(key => !isUndefined(data$$1[key]) && data$$1[key] !== this$1.$props[key])) {
          this$1.$reset(data$$1);
        }
      }));

      this._observer.observe(el, { attributes: true, attributeFilter: attrs.concat([this.$name, (`data-${this.$name}`)]) });
    };

    function getProps(opts, name) {
      const data$$1 = {};
      let args = opts.args; if (args === void 0) args = [];
      let props = opts.props; if (props === void 0) props = {};
      const el = opts.el;
      let key,
        prop;

      if (!props) {
        return data$$1;
      }

      for (key in props) {
        prop = hyphenate(key);
        if (hasAttr(el, prop)) {
          const value = coerce(props[key], attr(el, prop), el);

          if (prop === 'target' && (!value || startsWith(value, '_'))) {
            continue;
          }

          data$$1[key] = value;
        }
      }

      const options = parseOptions(data(el, name), args);

      for (key in options) {
        prop = camelize(key);
        if (props[prop] !== undefined) {
          data$$1[prop] = coerce(props[prop], options[key], el);
        }
      }

      return data$$1;
    }

    function parseOptions(options, args) {
      if (args === void 0) args = [];


      try {
        return !options
          ? {}
          : startsWith(options, '{')
            ? JSON.parse(options)
            : args.length && !includes(options, ':')
              ? ((obj = {}, obj[args[0]] = options, obj))
              : options.split(';').reduce((options, option) => {
                const ref = option.split(/:(.+)/);
                const key = ref[0];
                const value = ref[1];
                if (key && value) {
                  options[key.trim()] = value.trim();
                }
                return options;
              }, {});
        let obj;
      } catch (e) {
        return {};
      }
    }

    function registerComputed(component, key, cb) {
      Object.defineProperty(component, key, {

        enumerable: true,

        get: function get() {
          const _computeds = component._computeds;
          const $props = component.$props;
          const $el = component.$el;

          if (!hasOwn(_computeds, key)) {
            _computeds[key] = cb.call(component, $props, $el);
          }

          return _computeds[key];
        },

        set: function set(value) {
          component._computeds[key] = value;
        },

      });
    }

    function registerEvent(component, event, key) {
      if (!isPlainObject(event)) {
        event = ({ name: key, handler: event });
      }

      const name = event.name;
      let el = event.el;
      const delegate = event.delegate;
      const self = event.self;
      const filter = event.filter;
      let handler = event.handler;
      el = isFunction(el)
        ? el.call(component)
        : el || component.$el;

      if (isArray(el)) {
        el.forEach(el => registerEvent(component, assign(event, { el }), key));
        return;
      }

      if (!el || filter && !filter.call(component)) {
        return;
      }

      handler = detail(isString(handler) ? component[handler] : bind(handler, component));

      if (self) {
        handler = selfFilter(handler);
      }

      component._events.push(on(
        el,
        name,
        !delegate
          ? null
          : isString(delegate)
            ? delegate
            : delegate.call(component),
        handler
      ));
    }

    function selfFilter(handler) {
      return function selfHandler(e) {
        if (e.target === e.currentTarget || e.target === e.current) {
          return handler.call(null, e);
        }
      };
    }

    function notIn(options, key) {
      return options.every(arr => !arr || !hasOwn(arr, key));
    }

    function detail(listener) {
      return function (e) { return isArray(e.detail) ? listener.apply(listener, [e].concat(e.detail)) : listener(e); };
    }
  };

  const instanceAPI = function (UIkit) {
    const DATA = UIkit.data;

    UIkit.prototype.$mount = function (el) {
      const name = this.$options.name;

      if (!el[DATA]) {
        el[DATA] = {};
      }

      if (el[DATA][name]) {
        return;
      }

      el[DATA][name] = this;

      this.$el = this.$options.el = this.$options.el || el;

      this._initProps();

      this._callHook('init');

      if (within(el, docEl)) {
        this._callConnected();
      }
    };

    UIkit.prototype.$emit = function (e) {
      this._callUpdate(e);
    };

    UIkit.prototype.$update = function (e, parents) {
      UIkit.update(e, this.$options.el, parents);
    };

    UIkit.prototype.$reset = function (data) {
      this._callDisconnected();
      this._initProps(data);
      this._callConnected();
    };

    UIkit.prototype.$destroy = function (removeEl) {
      if (removeEl === void 0) removeEl = false;


      const ref = this.$options;
      const el = ref.el;
      const name = ref.name;

      if (el) {
        this._callDisconnected();
      }

      this._callHook('destroy');

      if (!el || !el[DATA]) {
        return;
      }

      delete el[DATA][name];

      if (!Object.keys(el[DATA]).length) {
        delete el[DATA];
      }

      if (removeEl) {
        remove(this.$el);
      }
    };
  };

  const componentAPI = function (UIkit) {
    const DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (id, options) {
      const name = camelize(id);

      if (isPlainObject(options)) {
        options.name = name;
        options = UIkit.extend(options);
      } else if (isUndefined(options)) {
        return UIkit.components[name];
      } else {
        options.options.name = name;
      }

      UIkit.components[name] = options;

      UIkit[name] = function (element, data) {
        let i = arguments.length,
          argsArray = Array(i);
        while (i--) argsArray[i] = arguments[i];


        if (isPlainObject(element)) {
          return new UIkit.components[name]({ data: element });
        }

        if (UIkit.components[name].options.functional) {
          return new UIkit.components[name]({ data: [].concat(argsArray) });
        }

        return element && element.nodeType ? init(element) : $$(element).map(init)[0];

        function init(element) {
          return UIkit.getComponent(element, name) || new UIkit.components[name]({ el: element, data: data || {} });
        }
      };

      if (UIkit._initialized && !options.options.functional) {
        fastdom.measure(() => UIkit[name]((`[uk-${id}],[data-uk-${id}]`)));
      }

      return UIkit.components[name];
    };

    UIkit.getComponents = function (element) { return element && (element = isJQuery(element) ? element[0] : element) && element[DATA] || {}; };
    UIkit.getComponent = function (element, name) { return UIkit.getComponents(element)[name]; };

    UIkit.connect = function (node) {
      let name;

      if (node[DATA]) {
        for (name in node[DATA]) {
          node[DATA][name]._callConnected();
        }
      }

      for (let i = 0; i < node.attributes.length; i++) {
        name = node.attributes[i].name;

        if (startsWith(name, 'uk-') || startsWith(name, 'data-uk-')) {
          name = camelize(name.replace('data-uk-', '').replace('uk-', ''));

          if (UIkit[name]) {
            UIkit[name](node);
          }
        }
      }
    };

    UIkit.disconnect = function (node) {
      for (const name in node[DATA]) {
        node[DATA][name]._callDisconnected();
      }
    };
  };

  const UIkit$2 = function (options) {
    this._init(options);
  };

  UIkit$2.util = util;
  UIkit$2.data = '__uikit__';
  UIkit$2.prefix = 'uk-';
  UIkit$2.options = {};
  UIkit$2.instances = {};
  UIkit$2.elements = [];

  globalAPI(UIkit$2);
  hooksAPI(UIkit$2);
  stateAPI(UIkit$2);
  instanceAPI(UIkit$2);
  componentAPI(UIkit$2);

  const Class = {

    init: function init() {
      addClass(this.$el, this.$name);
    },

  };

  const Container = {

    props: {
      container: Boolean,
    },

    defaults: {
      container: true,
    },

    computed: {

      container: function container(ref) {
        const container = ref.container;

        return container === true && UIkit$2.container || container && $(container) || UIkit$2.container;
      },

    },

  };

  const Togglable = {

    props: {
      cls: Boolean,
      animation: 'list',
      duration: Number,
      origin: String,
      transition: String,
      queued: Boolean,
    },

    defaults: {
      cls: false,
      animation: [false],
      duration: 200,
      origin: false,
      transition: 'linear',
      queued: false,

      initProps: {
        overflow: '',
        height: '',
        paddingTop: '',
        paddingBottom: '',
        marginTop: '',
        marginBottom: '',
      },

      hideProps: {
        overflow: 'hidden',
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
      },

    },

    computed: {

      hasAnimation: function hasAnimation(ref) {
        const animation = ref.animation;

        return !!animation[0];
      },

      hasTransition: function hasTransition(ref) {
        const animation = ref.animation;

        return this.hasAnimation && animation[0] === true;
      },

    },

    methods: {

      toggleElement: function toggleElement(targets, show, animate) {
        const this$1 = this;

        return new Promise(((resolve) => {
          targets = toNodes(targets);

          let all = function (targets) { return Promise.all(targets.map(el => this$1._toggleElement(el, show, animate))); },
            toggled = targets.filter(el => this$1.isToggled(el)),
            untoggled = targets.filter(el => !includes(toggled, el)),
            p;

          if (!this$1.queued || !isUndefined(animate) || !isUndefined(show) || !this$1.hasAnimation || targets.length < 2) {
            p = all(untoggled.concat(toggled));
          } else {
            let body = doc.body,
              scroll = body.scrollTop,
              el = toggled[0],
              inProgress = Animation.inProgress(el) && hasClass(el, 'uk-animation-leave')
                            || Transition.inProgress(el) && el.style.height === '0px';

            p = all(toggled);

            if (!inProgress) {
              p = p.then(() => {
                const p = all(untoggled);
                body.scrollTop = scroll;
                return p;
              });
            }
          }

          p.then(resolve, noop);
        }));
      },

      toggleNow: function toggleNow(targets, show) {
        const this$1 = this;

        return new Promise((resolve => Promise.all(toNodes(targets).map(el => this$1._toggleElement(el, show, false))).then(resolve, noop)));
      },

      isToggled: function isToggled(el) {
        const nodes = toNodes(el || this.$el);
        return this.cls
          ? hasClass(nodes, this.cls.split(' ')[0])
          : !hasAttr(nodes, 'hidden');
      },

      updateAria: function updateAria(el) {
        if (this.cls === false) {
          attr(el, 'aria-hidden', !this.isToggled(el));
        }
      },

      _toggleElement: function _toggleElement(el, show, animate) {
        const this$1 = this;


        show = isBoolean(show)
          ? show
          : Animation.inProgress(el)
            ? hasClass(el, 'uk-animation-leave')
            : Transition.inProgress(el)
              ? el.style.height === '0px'
              : !this.isToggled(el);

        if (!trigger(el, (`before${show ? 'show' : 'hide'}`), [this])) {
          return Promise.reject();
        }

        const promise = (animate === false || !this.hasAnimation
          ? this._toggleImmediate
          : this.hasTransition
            ? this._toggleHeight
            : this._toggleAnimation
        )(el, show);

        trigger(el, show ? 'show' : 'hide', [this]);

        return promise.then(() => {
          trigger(el, show ? 'shown' : 'hidden', [this$1]);
          UIkit$2.update(null, el);
        });
      },

      _toggle: function _toggle(el, toggled) {
        if (this.cls) {
          toggleClass(el, this.cls, includes(this.cls, ' ') ? undefined : toggled);
        } else {
          attr(el, 'hidden', !toggled ? '' : null);
        }

        $$('[autofocus]', el).some(el => isVisible(el) && (el.focus() || true));

        this.updateAria(el);
        UIkit$2.update(null, el);
      },

      _toggleImmediate: function _toggleImmediate(el, show) {
        this._toggle(el, show);
        return Promise.resolve();
      },

      _toggleHeight: function _toggleHeight(el, show) {
        const this$1 = this;


        let inProgress = Transition.inProgress(el),
          inner = el.hasChildNodes ? toFloat(css(el.firstElementChild, 'marginTop')) + toFloat(css(el.lastElementChild, 'marginBottom')) : 0,
          currentHeight = isVisible(el) ? height(el) + (inProgress ? 0 : inner) : 0,
          endHeight;

        Transition.cancel(el);

        if (!this.isToggled(el)) {
          this._toggle(el, true);
        }

        height(el, '');

        // Update child components first
        fastdom.flush();

        endHeight = height(el) + (inProgress ? 0 : inner);
        height(el, currentHeight);

        return (show
          ? Transition.start(el, assign({}, this.initProps, { overflow: 'hidden', height: endHeight }), Math.round(this.duration * (1 - currentHeight / endHeight)), this.transition)
          : Transition.start(el, this.hideProps, Math.round(this.duration * (currentHeight / endHeight)), this.transition).then(() => this$1._toggle(el, false))
        ).then(() => css(el, this$1.initProps));
      },

      _toggleAnimation: function _toggleAnimation(el, show) {
        const this$1 = this;


        Animation.cancel(el);

        if (show) {
          this._toggle(el, true);
          return Animation.in(el, this.animation[0], this.duration, this.origin);
        }

        return Animation.out(el, this.animation[1] || this.animation[0], this.duration, this.origin).then(() => this$1._toggle(el, false));
      },

    },

  };

  let active;

  const Modal = {

    mixins: [Class, Container, Togglable],

    props: {
      clsPanel: String,
      selClose: String,
      escClose: Boolean,
      bgClose: Boolean,
      stack: Boolean,
    },

    defaults: {
      cls: 'uk-open',
      escClose: true,
      bgClose: true,
      overlay: true,
      stack: false,
    },

    computed: {

      panel: function panel(ref, $el) {
        const clsPanel = ref.clsPanel;

        return $$1((`.${clsPanel}`), $el);
      },

      transitionElement: function transitionElement() {
        return this.panel;
      },

      transitionDuration: function transitionDuration() {
        return toMs(css(this.transitionElement, 'transitionDuration'));
      },

    },

    events: [

      {

        name: 'click',

        delegate: function delegate() {
          return this.selClose;
        },

        handler: function handler(e) {
          e.preventDefault();
          this.hide();
        },

      },

      {

        name: 'toggle',

        handler: function handler(e) {
          e.preventDefault();
          this.toggle();
        },

      },

      {

        name: 'show',

        self: true,

        handler: function handler() {
          if (!hasClass(docEl, this.clsPage)) {
            this.scrollbarWidth = width(win) - docEl.offsetWidth;
            css(doc.body, 'overflowY', this.scrollbarWidth && this.overlay ? 'scroll' : '');
          }

          addClass(docEl, this.clsPage);
        },

      },

      {

        name: 'hidden',

        self: true,

        handler: function handler() {
          const this$1 = this;


          let found,
            prev = this.prev;

          while (prev) {
            if (prev.clsPage === this$1.clsPage) {
              found = true;
              break;
            }

            prev = prev.prev;
          }

          if (!found) {
            removeClass(docEl, this.clsPage);
          }

          !this.prev && css(doc.body, 'overflowY', '');
        },

      },

    ],

    methods: {

      toggle: function toggle() {
        return this.isToggled() ? this.hide() : this.show();
      },

      show: function show() {
        if (this.isToggled()) {
          return;
        }

        if (this.container && this.$el.parentNode !== this.container) {
          append(this.container, this.$el);
          this._callConnected();
        }

        const prev = active && active !== this && active;

        active = this;

        if (prev) {
          if (this.stack) {
            this.prev = prev;
          } else {
            prev.hide().then(this.show);
            return;
          }
        }

        registerEvents();

        return this.toggleNow(this.$el, true);
      },

      hide: function hide() {
        if (!this.isToggled()) {
          return;
        }

        active = active && active !== this && active || this.prev;

        if (!active) {
          deregisterEvents();
        }

        return this.toggleNow(this.$el, false);
      },

      getActive: function getActive() {
        return active;
      },

      _toggleImmediate: function _toggleImmediate(el, show) {
        const this$1 = this;


        requestAnimationFrame(() => this$1._toggle(el, show));

        return this.transitionDuration
          ? new Promise((resolve => once(this$1.transitionElement, transitionend, resolve, false, e => e.target === this$1.transitionElement)))
          : Promise.resolve();
      },
    },

  };

  let events;

  function registerEvents() {
    if (events) {
      return;
    }

    events = [
      on(doc, 'click', (ref) => {
        const target = ref.target;
        const defaultPrevented = ref.defaultPrevented;

        if (active && active.bgClose && !defaultPrevented && !within(target, active.panel)) {
          active.hide();
        }
      }),
      on(doc, 'keydown', (e) => {
        if (e.keyCode === 27 && active && active.escClose) {
          e.preventDefault();
          active.hide();
        }
      }),
    ];
  }

  function deregisterEvents() {
    events && events.forEach(unbind => unbind());
    events = null;
  }

  const Position = {

    props: {
      pos: String,
      offset: null,
      flip: Boolean,
      clsPos: String,
    },

    defaults: {
      pos: (`bottom-${!isRtl ? 'left' : 'right'}`),
      flip: true,
      offset: false,
      clsPos: '',
    },

    computed: {

      pos: function pos(ref) {
        const pos = ref.pos;

        return (pos + (!includes(pos, '-') ? '-center' : '')).split('-');
      },

      dir: function dir() {
        return this.pos[0];
      },

      align: function align() {
        return this.pos[1];
      },

    },

    methods: {

      positionAt: function positionAt$1(element, target, boundary) {
        removeClasses(element, (`${this.clsPos}-(top|bottom|left|right)(-[a-z]+)?`));
        css(element, { top: '', left: '' });

        let offset = toNumber(this.offset) || 0,
          axis = this.getAxis();
        const ref = positionAt(
          element,
          target,
          axis === 'x' ? (`${flipPosition(this.dir)} ${this.align}`) : (`${this.align} ${flipPosition(this.dir)}`),
          axis === 'x' ? (`${this.dir} ${this.align}`) : (`${this.align} ${this.dir}`),
          axis === 'x' ? (`${this.dir === 'left' ? -1 * offset : offset}`) : (` ${this.dir === 'top' ? -1 * offset : offset}`),
          null,
          this.flip,
          boundary
        ).target;
        const x = ref.x;
        const y = ref.y;

        this.dir = axis === 'x' ? x : y;
        this.align = axis === 'x' ? y : x;

        toggleClass(element, (`${this.clsPos}-${this.dir}-${this.align}`), this.offset === false);
      },

      getAxis: function getAxis() {
        return this.dir === 'top' || this.dir === 'bottom' ? 'y' : 'x';
      },

    },

  };

  const mixin = function (UIkit) {
    UIkit.mixin.class = Class;
    UIkit.mixin.container = Container;
    UIkit.mixin.modal = Modal;
    UIkit.mixin.position = Position;
    UIkit.mixin.togglable = Togglable;
  };

  const Accordion = function (UIkit) {
    UIkit.component('accordion', {

      mixins: [Class, Togglable],

      props: {
        targets: String,
        active: null,
        collapsible: Boolean,
        multiple: Boolean,
        toggle: String,
        content: String,
        transition: String,
      },

      defaults: {
        targets: '> *',
        active: false,
        animation: [true],
        collapsible: true,
        multiple: false,
        clsOpen: 'uk-open',
        toggle: '> .uk-accordion-title',
        content: '> .uk-accordion-content',
        transition: 'ease',
      },

      computed: {

        items: function items(ref, $el) {
          const targets = ref.targets;

          return $$(targets, $el);
        },

      },

      events: [

        {

          name: 'click',

          self: true,

          delegate: function delegate() {
            return (`${this.targets} ${this.$props.toggle}`);
          },

          handler: function handler(e) {
            e.preventDefault();
            this.toggle(index($$((`${this.targets} ${this.$props.toggle}`), this.$el), e.current));
          },

        },

      ],

      ready: function ready() {
        var active = this.active !== false && this.items[Number(this.active)] && !hasClass(active, this.clsOpen);
        if (active) {
          this.toggle(active, false);
        }
      },

      update: function update() {
        const this$1 = this;


        this.items.forEach(el => this$1.toggleNow($$1(this$1.content, el), hasClass(el, this$1.clsOpen)));

        const active = !this.collapsible && !hasClass(this.items, this.clsOpen) && this.items[0];
        if (active) {
          this.toggle(active, false);
        }
      },

      methods: {

        toggle: function toggle(item, animate) {
          const this$1 = this;


          let index = getIndex(item, this.items),
            active = filter(this.items, (`.${this.clsOpen}`));

          item = this.items[index];

          item && [item]
            .concat(!this.multiple && !includes(active, item) && active || [])
            .forEach((el) => {
              let isItem = el === item,
                state = isItem && !hasClass(el, this$1.clsOpen);

              if (!state && isItem && !this$1.collapsible && active.length < 2) {
                return;
              }

              toggleClass(el, this$1.clsOpen, state);

              const content = el._wrapper ? el._wrapper.firstElementChild : $$1(this$1.content, el);

              if (!el._wrapper) {
                el._wrapper = wrapAll(content, '<div>');
                attr(el._wrapper, 'hidden', state ? '' : null);
              }

              this$1._toggleImmediate(content, true);
              this$1.toggleElement(el._wrapper, state, animate).then(() => {
                if (hasClass(el, this$1.clsOpen) === state) {
                  if (!state) {
                    this$1._toggleImmediate(content, false);
                  }

                  el._wrapper = null;
                  unwrap(content);
                }
              });
            });
        },

      },

    });
  };

  const Alert = function (UIkit) {
    UIkit.component('alert', {

      attrs: true,

      mixins: [Class, Togglable],

      args: 'animation',

      props: {
        close: String,
      },

      defaults: {
        animation: [true],
        selClose: '.uk-alert-close',
        duration: 150,
        hideProps: assign({ opacity: 0 }, Togglable.defaults.hideProps),
      },

      events: [

        {

          name: 'click',

          delegate: function delegate() {
            return this.selClose;
          },

          handler: function handler(e) {
            e.preventDefault();
            this.close();
          },

        },

      ],

      methods: {

        close: function close() {
          const this$1 = this;

          this.toggleElement(this.$el).then(() => this$1.$destroy(true));
        },

      },

    });
  };

  const Cover = function (UIkit) {
    UIkit.component('cover', {

      mixins: [Class, UIkit.components.video.options],

      props: {
        width: Number,
        height: Number,
      },

      defaults: {
        automute: true,
      },

      ready: function ready() {
        if (this.$el.tagName === 'IFRAME') {
          css(this.$el, 'pointerEvents', 'none');
        }
      },

      update: {

        write: function write() {
          const el = this.$el;

          if (!isVisible(el)) {
            return;
          }

          const ref = el.parentNode;
          const height = ref.offsetHeight;
          const width = ref.offsetWidth;

          css(
            css(el, { width: '', height: '' }),
            Dimensions.cover(
              {
                width: this.width || el.clientWidth,
                height: this.height || el.clientHeight,
              },
              {
                width: width + (width % 2 ? 1 : 0),
                height,
              }
            )
          );
        },

        events: ['load', 'resize'],

      },

      events: {

        loadedmetadata: function loadedmetadata() {
          this.$emit();
        },

      },

    });
  };

  const Drop = function (UIkit) {
    let active;

    UIkit.component('drop', {

      mixins: [Position, Togglable],

      args: 'pos',

      props: {
        mode: 'list',
        toggle: Boolean,
        boundary: 'query',
        boundaryAlign: Boolean,
        delayShow: Number,
        delayHide: Number,
        clsDrop: String,
      },

      defaults: {
        mode: ['click', 'hover'],
        toggle: '-',
        boundary: win,
        boundaryAlign: false,
        delayShow: 0,
        delayHide: 800,
        clsDrop: false,
        hoverIdle: 200,
        animation: ['uk-animation-fade'],
        cls: 'uk-open',
      },

      init: function init() {
        this.tracker = new MouseTracker();
        this.clsDrop = this.clsDrop || (`uk-${this.$options.name}`);
        this.clsPos = this.clsDrop;

        addClass(this.$el, this.clsDrop);
      },

      ready: function ready() {
        this.updateAria(this.$el);

        if (this.toggle) {
          this.toggle = UIkit.toggle(query(this.toggle, this.$el), { target: this.$el, mode: this.mode });
        }
      },

      events: [

        {

          name: 'click',

          delegate: function delegate() {
            return (`.${this.clsDrop}-close`);
          },

          handler: function handler(e) {
            e.preventDefault();
            this.hide(false);
          },

        },

        {

          name: 'click',

          delegate: function delegate() {
            return 'a[href^="#"]';
          },

          handler: function handler(e) {
            if (e.defaultPrevented) {
              return;
            }

            const id = e.target.hash;

            if (!id) {
              e.preventDefault();
            }

            if (!id || !within(id, this.$el)) {
              this.hide(false);
            }
          },

        },

        {

          name: 'beforescroll',

          handler: function handler() {
            this.hide(false);
          },

        },

        {

          name: 'toggle',

          self: true,

          handler: function handler(e, toggle) {
            e.preventDefault();

            if (this.isToggled()) {
              this.hide(false);
            } else {
              this.show(toggle, false);
            }
          },

        },

        {

          name: pointerEnter,

          filter: function filter() {
            return includes(this.mode, 'hover');
          },

          handler: function handler(e) {
            if (isTouch(e)) {
              return;
            }

            if (active
                        && active !== this
                        && active.toggle
                        && includes(active.toggle.mode, 'hover')
                        && !within(e.target, active.toggle.$el)
                        && !pointInRect({ x: e.pageX, y: e.pageY }, offset(active.$el))
            ) {
              active.hide(false);
            }

            e.preventDefault();
            this.show(this.toggle);
          },

        },

        {

          name: 'toggleshow',

          handler: function handler(e, toggle) {
            if (toggle && !includes(toggle.target, this.$el)) {
              return;
            }

            e.preventDefault();
            this.show(toggle || this.toggle);
          },

        },

        {

          name: (`togglehide ${pointerLeave}`),

          handler: function handler(e, toggle) {
            if (isTouch(e) || toggle && !includes(toggle.target, this.$el)) {
              return;
            }

            e.preventDefault();

            if (this.toggle && includes(this.toggle.mode, 'hover')) {
              this.hide();
            }
          },

        },

        {

          name: 'beforeshow',

          self: true,

          handler: function handler() {
            this.clearTimers();
          },

        },

        {

          name: 'show',

          self: true,

          handler: function handler() {
            this.tracker.init();
            addClass(this.toggle.$el, this.cls);
            attr(this.toggle.$el, 'aria-expanded', 'true');
            registerEvent();
          },

        },

        {

          name: 'beforehide',

          self: true,

          handler: function handler() {
            this.clearTimers();
          },

        },

        {

          name: 'hide',

          handler: function handler(ref) {
            const target = ref.target;


            if (this.$el !== target) {
              active = active === null && within(target, this.$el) && this.isToggled() ? this : active;
              return;
            }

            active = this.isActive() ? null : active;
            removeClass(this.toggle.$el, this.cls);
            attr(this.toggle.$el, 'aria-expanded', 'false');
            this.toggle.$el.blur();
            $$('a, button', this.toggle.$el).forEach(el => el.blur());
            this.tracker.cancel();
          },

        },

      ],

      update: {

        write: function write() {
          if (this.isToggled() && !Animation.inProgress(this.$el)) {
            this.position();
          }
        },

        events: ['resize'],

      },

      methods: {

        show: function show(toggle, delay) {
          const this$1 = this;
          if (delay === void 0) delay = true;


          let show = function () {
              if (!this$1.isToggled()) {
                this$1.position();
                this$1.toggleElement(this$1.$el, true);
              }
            },
            tryShow = function () {
              this$1.toggle = toggle || this$1.toggle;

              this$1.clearTimers();

              if (this$1.isActive()) {
                return;
              } else if (delay && active && active !== this$1 && active.isDelaying) {
                this$1.showTimer = setTimeout(this$1.show, 10);
                return;
              } else if (this$1.isParentOf(active)) {
                if (active.hideTimer) {
                  active.hide(false);
                } else {
                  return;
                }
              } else if (active && !this$1.isChildOf(active) && !this$1.isParentOf(active)) {
                let prev;
                while (active && active !== prev && !this$1.isChildOf(active)) {
                  prev = active;
                  active.hide(false);
                }
              }

              if (delay && this$1.delayShow) {
                this$1.showTimer = setTimeout(show, this$1.delayShow);
              } else {
                show();
              }

              active = this$1;
            };

          if (toggle && this.toggle && toggle.$el !== this.toggle.$el) {
            once(this.$el, 'hide', tryShow);
            this.hide(false);
          } else {
            tryShow();
          }
        },

        hide: function hide(delay) {
          const this$1 = this;
          if (delay === void 0) delay = true;


          const hide = function () { return this$1.toggleNow(this$1.$el, false); };

          this.clearTimers();

          this.isDelaying = this.tracker.movesTo(this.$el);

          if (delay && this.isDelaying) {
            this.hideTimer = setTimeout(this.hide, this.hoverIdle);
          } else if (delay && this.delayHide) {
            this.hideTimer = setTimeout(hide, this.delayHide);
          } else {
            hide();
          }
        },

        clearTimers: function clearTimers() {
          clearTimeout(this.showTimer);
          clearTimeout(this.hideTimer);
          this.showTimer = null;
          this.hideTimer = null;
          this.isDelaying = false;
        },

        isActive: function isActive() {
          return active === this;
        },

        isChildOf: function isChildOf(drop) {
          return drop && drop !== this && within(this.$el, drop.$el);
        },

        isParentOf: function isParentOf(drop) {
          return drop && drop !== this && within(drop.$el, this.$el);
        },

        position: function position() {
          removeClasses(this.$el, (`${this.clsDrop}-(stack|boundary)`));
          css(this.$el, { top: '', left: '', display: 'block' });
          toggleClass(this.$el, (`${this.clsDrop}-boundary`), this.boundaryAlign);

          let boundary = offset(this.boundary),
            alignTo = this.boundaryAlign ? boundary : offset(this.toggle.$el);

          if (this.align === 'justify') {
            const prop = this.getAxis() === 'y' ? 'width' : 'height';
            css(this.$el, prop, alignTo[prop]);
          } else if (this.$el.offsetWidth > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
            addClass(this.$el, (`${this.clsDrop}-stack`));
            trigger(this.$el, 'stack', [this]);
          }

          this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.toggle.$el, this.boundary);

          css(this.$el, 'display', '');
        },

      },

    });

    UIkit.drop.getActive = function () { return active; };

    let registered;

    function registerEvent() {
      if (registered) {
        return;
      }

      registered = true;
      on(doc, 'click', (ref) => {
        const target = ref.target;
        const defaultPrevented = ref.defaultPrevented;

        let prev;

        if (defaultPrevented) {
          return;
        }

        while (active && active !== prev && !within(target, active.$el) && !(active.toggle && within(target, active.toggle.$el))) {
          prev = active;
          active.hide(false);
        }
      });
    }
  };

  const Dropdown = function (UIkit) {
    UIkit.component('dropdown', UIkit.components.drop.extend({ name: 'dropdown' }));
  };

  const FormCustom = function (UIkit) {
    UIkit.component('form-custom', {

      mixins: [Class],

      args: 'target',

      props: {
        target: Boolean,
      },

      defaults: {
        target: false,
      },

      computed: {

        input: function input(_, $el) {
          return $$1(selInput, $el);
        },

        state: function state() {
          return this.input.nextElementSibling;
        },

        target: function target(ref, $el) {
          const target = ref.target;

          return target && (target === true
                    && this.input.parentNode === $el
                    && this.input.nextElementSibling
                    || query(target, $el));
        },

      },

      connected: function connected() {
        trigger(this.input, 'change');
      },

      events: [

        {

          name: 'focusin focusout mouseenter mouseleave',

          delegate: selInput,

          handler: function handler(ref) {
            const type = ref.type;
            const current = ref.current;

            if (current === this.input) {
              toggleClass(
                this.state,
                (`uk-${includes(type, 'focus') ? 'focus' : 'hover'}`),
                includes(['focusin', 'mouseenter'], type)
              );
            }
          },

        },

        {

          name: 'change',

          handler: function handler() {
            let target = this.target,
              input = this.input,
              option;

            if (!target) {
              return;
            }

            target[isInput(target) ? 'value' : 'innerText'] = input.files && input.files[0]
              ? input.files[0].name
              : matches(input, 'select') && (option = $$('option', input).filter(el => el.selected)[0])
                ? option.innerText
                : input.value;
          },

        },

      ],

    });
  };

  const Gif = function (UIkit) {
    UIkit.component('gif', {

      update: {

        read: function read() {
          const inview = isInView(this.$el);

          if (!this.isInView && inview) {
            this.$el.src = this.$el.src;
          }

          this.isInView = inview;
        },

        events: ['scroll', 'load', 'resize'],
      },

    });
  };

  const Grid = function (UIkit) {
    UIkit.component('grid', UIkit.components.margin.extend({

      mixins: [Class],

      name: 'grid',

      defaults: {
        margin: 'uk-grid-margin',
        clsStack: 'uk-grid-stack',
      },

      update: {

        write: function write() {
          toggleClass(this.$el, this.clsStack, this.stacks);
        },

        events: ['load', 'resize'],

      },

    }));
  };

  const HeightMatch = function (UIkit) {
    UIkit.component('height-match', {

      args: 'target',

      props: {
        target: String,
        row: Boolean,
      },

      defaults: {
        target: '> *',
        row: true,
      },

      computed: {

        elements: function elements(ref, $el) {
          const target = ref.target;

          return $$(target, $el);
        },

      },

      update: {

        read: function read() {
          const this$1 = this;


          let lastOffset = false;

          css(this.elements, 'minHeight', '');

          this.rows = !this.row
            ? [this.match(this.elements)]
            : this.elements.reduce((rows, el) => {
              if (lastOffset !== el.offsetTop) {
                rows.push([el]);
              } else {
                rows[rows.length - 1].push(el);
              }

              lastOffset = el.offsetTop;

              return rows;
            }, []).map(elements => this$1.match(elements));
        },

        write: function write() {
          this.rows.forEach((ref) => {
            const height = ref.height;
            const elements = ref.elements;

            return css(elements, 'minHeight', height);
          });
        },

        events: ['load', 'resize'],

      },

      methods: {

        match: function match(elements) {
          if (elements.length < 2) {
            return {};
          }

          let max = 0,
            heights = [];

          elements
            .forEach((el) => {
              let style,
                hidden;

              if (!isVisible(el)) {
                style = attr(el, 'style');
                hidden = attr(el, 'hidden');

                attr(el, {
                  style: (`${style || ''};display:block !important;`),
                  hidden: null,
                });
              }

              max = Math.max(max, el.offsetHeight);
              heights.push(el.offsetHeight);

              if (!isUndefined(style)) {
                attr(el, { style, hidden });
              }
            });

          elements = elements.filter((el, i) => heights[i] < max);

          return { height: max, elements };
        },
      },

    });
  };

  const HeightViewport = function (UIkit) {
    UIkit.component('height-viewport', {

      props: {
        expand: Boolean,
        offsetTop: Boolean,
        offsetBottom: Boolean,
        minHeight: Number,
      },

      defaults: {
        expand: false,
        offsetTop: false,
        offsetBottom: false,
        minHeight: 0,
      },

      update: {

        write: function write() {
          css(this.$el, 'boxSizing', 'border-box');

          let viewport = height(win),
            minHeight = 0,
            offsetTop = 0;

          if (this.expand) {
            css(this.$el, { height: '', minHeight: '' });

            const diff = viewport - docEl.offsetHeight;

            if (diff > 0) {
              minHeight = this.$el.offsetHeight + diff;
            }
          } else {
            const top = offset(this.$el).top;

            if (top < viewport / 2 && this.offsetTop) {
              offsetTop += top;
            }

            if (this.offsetBottom === true) {
              offsetTop += this.$el.nextElementSibling.offsetHeight || 0;
            } else if (isNumeric(this.offsetBottom)) {
              offsetTop += (viewport / 100) * this.offsetBottom;
            } else if (this.offsetBottom && endsWith(this.offsetBottom, 'px')) {
              offsetTop += toFloat(this.offsetBottom);
            } else if (isString(this.offsetBottom)) {
              const el = query(this.offsetBottom, this.$el);
              offsetTop += el && el.offsetHeight || 0;
            }

            minHeight = viewport - offsetTop;
          }

          css(this.$el, 'minHeight', Math.max(minHeight, this.minHeight) || '');

          // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
          height(this.$el, '');
          if (minHeight && viewport - offsetTop >= this.$el.offsetHeight) {
            css(this.$el, 'height', minHeight);
          }
        },

        events: ['load', 'resize'],

      },

    });
  };

  const Hover = function (UIkit) {
    ready(() => {
      if (!hasTouch) {
        return;
      }

      const cls = 'uk-hover';

      on(doc, 'tap', (ref) => {
        const target = ref.target;

        return $$((`.${cls}`)).forEach((_, el) => !within(target, el) && removeClass(el, cls));
      });

      Object.defineProperty(UIkit, 'hoverSelector', {

        set: function set(selector) {
          on(doc, 'tap', selector, (ref) => {
            const current = ref.current;

            return addClass(current, cls);
          });
        },

      });

      UIkit.hoverSelector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';
    });
  };

  const closeIcon = '<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#000" stroke-width="1.1" x1="1" y1="1" x2="13" y2="13"></line><line fill="none" stroke="#000" stroke-width="1.1" x1="13" y1="1" x2="1" y2="13"></line></svg>';

  const closeLarge = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#000" stroke-width="1.4" x1="1" y1="1" x2="19" y2="19"></line><line fill="none" stroke="#000" stroke-width="1.4" x1="19" y1="1" x2="1" y2="19"></line></svg>';

  const marker = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="4" width="1" height="11"></rect><rect x="4" y="9" width="11" height="1"></rect></svg>';

  const navbarToggleIcon = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect y="9" width="20" height="2"></rect><rect y="3" width="20" height="2"></rect><rect y="15" width="20" height="2"></rect></svg>';

  const overlayIcon = '<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="19" y="0" width="1" height="40"></rect><rect x="0" y="19" width="40" height="1"></rect></svg>';

  const paginationNext = '<svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="1 1 6 6 1 11"></polyline></svg>';

  const paginationPrevious = '<svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="6 1 1 6 6 11"></polyline></svg>';

  const searchIcon = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="9" cy="9" r="7"></circle><path fill="none" stroke="#000" stroke-width="1.1" d="M14,14 L18,18 L14,14 Z"></path></svg>';

  const searchLarge = '<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.8" cx="17.5" cy="17.5" r="16.5"></circle><line fill="none" stroke="#000" stroke-width="1.8" x1="38" y1="39" x2="29" y2="30"></line></svg>';

  const searchNavbar = '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="10.5" cy="10.5" r="9.5"/><line fill="none" stroke="#000" stroke-width="1.1" x1="23" y1="23" x2="17" y2="17"/></svg>';

  const slidenavNext = '<svg width="11" height="20" viewBox="0 0 11 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="1 1 10 10 1 19"></polyline></svg>';

  const slidenavNextLarge = '<svg width="18" height="34" viewBox="0 0 18 34" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.4" points="1 1 17 17 1 33"></polyline></svg>';

  const slidenavPrevious = '<svg width="11" height="20" viewBox="0 0 11 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="10 1 1 10 10 19"></polyline></svg>';

  const slidenavPreviousLarge = '<svg width="18" height="34" viewBox="0 0 18 34" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.4" points="17 1 1 17 17 33"></polyline></svg>';

  const spinner = '<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" cx="15" cy="15" r="14"></circle></svg>';

  const totop = '<svg width="18" height="10" viewBox="0 0 18 10" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="1 9 9 1 17 9 "></polyline></svg>';

  const Icon = function (UIkit) {
    let parsed = {},
      icons = {
        spinner,
        totop,
        marker,
        'close-icon': closeIcon,
        'close-large': closeLarge,
        'navbar-toggle-icon': navbarToggleIcon,
        'overlay-icon': overlayIcon,
        'pagination-next': paginationNext,
        'pagination-previous': paginationPrevious,
        'search-icon': searchIcon,
        'search-large': searchLarge,
        'search-navbar': searchNavbar,
        'slidenav-next': slidenavNext,
        'slidenav-next-large': slidenavNextLarge,
        'slidenav-previous': slidenavPrevious,
        'slidenav-previous-large': slidenavPreviousLarge,
      };

    UIkit.component('icon', UIkit.components.svg.extend({

      attrs: ['icon', 'ratio'],

      mixins: [Class],

      name: 'icon',

      args: 'icon',

      props: ['icon'],

      defaults: { exclude: ['id', 'style', 'class', 'src', 'icon'] },

      init: function init() {
        addClass(this.$el, 'uk-icon');

        if (isRtl) {
          this.icon = swap(swap(this.icon, 'left', 'right'), 'previous', 'next');
        }
      },

      disconnected: function disconnected() {
        delete this.delay;
      },

      methods: {

        getSvg: function getSvg() {
          const icon = getIcon(this.icon);

          if (!icon) {
            return Promise.reject('Icon not found.');
          }

          return Promise.resolve(icon);
        },

      },

    }));

    [
      'marker',
      'navbar-toggle-icon',
      'overlay-icon',
      'pagination-previous',
      'pagination-next',
      'totop',
    ].forEach(name => registerComponent(name));

    [
      'slidenav-previous',
      'slidenav-next',
    ].forEach(name => registerComponent(name, {

      init: function init() {
        addClass(this.$el, 'uk-slidenav');

        if (hasClass(this.$el, 'uk-slidenav-large')) {
          this.icon += '-large';
        }
      },

    }));

    registerComponent('search-icon', {

      init: function init() {
        if (hasClass(this.$el, 'uk-search-icon') && parents(this.$el, '.uk-search-large').length) {
          this.icon = 'search-large';
        } else if (parents(this.$el, '.uk-search-navbar').length) {
          this.icon = 'search-navbar';
        }
      },

    });

    registerComponent('close', {

      init: function init() {
        this.icon = `close-${hasClass(this.$el, 'uk-close-large') ? 'large' : 'icon'}`;
      },

    });

    registerComponent('spinner', {

      connected: function connected() {
        const this$1 = this;

        this.svg.then(svg => this$1.ratio !== 1 && css($$1('circle', svg), 'stroke-width', 1 / this$1.ratio), noop);
      },

    });

    UIkit.icon.add = function (added) {
      Object.keys(added).forEach((name) => {
        icons[name] = added[name];
        delete parsed[name];
      });

      if (UIkit._initialized) {
        each(UIkit.instances, (component) => {
          if (component.$options.name === 'icon') {
            component.$reset();
          }
        });
      }
    };

    function registerComponent(name, mixin$$1) {
      UIkit.component(name, UIkit.components.icon.extend({

        name,

        mixins: mixin$$1 ? [mixin$$1] : [],

        defaults: {
          icon: name,
        },

      }));
    }

    function getIcon(icon) {
      if (!icons[icon]) {
        return null;
      }

      if (!parsed[icon]) {
        parsed[icon] = $$1(icons[icon].trim());
      }

      return parsed[icon];
    }
  };

  const Leader = function (UIkit) {
    UIkit.component('leader', {

      mixins: [Class],

      props: {
        fill: String,
        media: 'media',
      },

      defaults: {
        fill: '',
        media: false,
        clsWrapper: 'uk-leader-fill',
        clsHide: 'uk-leader-hide',
        attrFill: 'data-fill',
      },

      computed: {

        fill: function fill(ref) {
          const fill = ref.fill;

          return fill || getCssVar('leader-fill');
        },

      },

      connected: function connected() {
        this.wrapper = wrapInner(this.$el, (`<span class="${this.clsWrapper}">`))[0];
      },

      disconnected: function disconnected() {
        unwrap(this.wrapper.childNodes);
        delete this._width;
      },

      update: [

        {

          read: function read() {
            const prev = this._width;
            this._width = Math.floor(this.$el.offsetWidth / 2);
            this._changed = prev !== this._width;
            this._hide = this.media && !win.matchMedia(this.media).matches;
          },

          write: function write() {
            toggleClass(this.wrapper, this.clsHide, this._hide);

            if (this._changed) {
              attr(this.wrapper, this.attrFill, new Array(this._width).join(this.fill));
            }
          },

          events: ['load', 'resize'],

        },
      ],
    });
  };

  const Margin = function (UIkit) {
    UIkit.component('margin', {

      props: {
        margin: String,
        firstColumn: Boolean,
      },

      defaults: {
        margin: 'uk-margin-small-top',
        firstColumn: 'uk-first-column',
      },

      update: {

        read: function read() {
          const this$1 = this;


          const items = this.$el.children;

          if (!items.length || !isVisible(this.$el)) {
            this.rows = false;
            return;
          }

          this.stacks = true;

          const rows = [[]];

          for (let i = 0; i < items.length; i++) {
            let el = items[i],
              dim = el.getBoundingClientRect();

            if (!dim.height) {
              continue;
            }

            for (let j = rows.length - 1; j >= 0; j--) {
              const row = rows[j];

              if (!row[0]) {
                row.push(el);
                break;
              }

              const leftDim = row[0].getBoundingClientRect();

              if (dim.top >= Math.floor(leftDim.bottom)) {
                rows.push([el]);
                break;
              }

              if (Math.floor(dim.bottom) > leftDim.top) {
                this$1.stacks = false;

                if (dim.left < leftDim.left && !isRtl) {
                  row.unshift(el);
                  break;
                }

                row.push(el);
                break;
              }

              if (j === 0) {
                rows.unshift([el]);
                break;
              }
            }
          }

          this.rows = rows;
        },

        write: function write() {
          const this$1 = this;


          this.rows && this.rows.forEach((row, i) => row.forEach((el, j) => {
            toggleClass(el, this$1.margin, i !== 0);
            toggleClass(el, this$1.firstColumn, j === 0);
          }));
        },

        events: ['load', 'resize'],

      },

    });
  };

  const Modal$1 = function (UIkit) {
    UIkit.component('modal', {

      mixins: [Modal],

      defaults: {
        clsPage: 'uk-modal-page',
        clsPanel: 'uk-modal-dialog',
        selClose: '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full',
      },

      events: [

        {
          name: 'show',

          self: true,

          handler: function handler() {
            if (hasClass(this.panel, 'uk-margin-auto-vertical')) {
              addClass(this.$el, 'uk-flex');
            } else {
              css(this.$el, 'display', 'block');
            }

            height(this.$el); // force reflow
          },
        },

        {
          name: 'hidden',

          self: true,

          handler: function handler() {
            css(this.$el, 'display', '');
            removeClass(this.$el, 'uk-flex');
          },
        },

      ],

    });

    UIkit.component('overflow-auto', {

      mixins: [Class],

      computed: {

        modal: function modal(_, $el) {
          return closest($el, '.uk-modal');
        },

        panel: function panel(_, $el) {
          return closest($el, '.uk-modal-dialog');
        },

      },

      connected: function connected() {
        css(this.$el, 'minHeight', 150);
      },

      update: {

        write: function write() {
          if (!this.panel || !this.modal) {
            return;
          }

          const current = css(this.$el, 'maxHeight');

          css(css(this.$el, 'maxHeight', 150), 'maxHeight', Math.max(150, 150 + height(this.modal) - this.panel.offsetHeight));
          if (current !== css(this.$el, 'maxHeight')) {
            trigger(this.$el, 'resize');
          }
        },

        events: ['load', 'resize'],

      },

    });

    UIkit.modal.dialog = function (content, options) {
      const dialog = UIkit.modal((` <div class="uk-modal"> <div class="uk-modal-dialog">${content}</div> </div> `), options);

      on(dialog.$el, 'hidden', (ref) => {
        const target = ref.target;
        const current = ref.current;

        if (target === current) {
          dialog.$destroy(true);
        }
      });
      dialog.show();

      return dialog;
    };

    UIkit.modal.alert = function (message, options) {
      options = assign({ bgClose: false, escClose: false, labels: UIkit.modal.labels }, options);

      return new Promise((resolve => on(UIkit.modal.dialog((` <div class="uk-modal-body">${isString(message) ? message : html(message)}</div> <div class="uk-modal-footer uk-text-right"> <button class="uk-button uk-button-primary uk-modal-close" autofocus>${options.labels.ok}</button> </div> `), options).$el, 'hide', resolve)));
    };

    UIkit.modal.confirm = function (message, options) {
      options = assign({ bgClose: false, escClose: false, labels: UIkit.modal.labels }, options);

      return new Promise(((resolve, reject) => on(UIkit.modal.dialog((` <div class="uk-modal-body">${isString(message) ? message : html(message)}</div> <div class="uk-modal-footer uk-text-right"> <button class="uk-button uk-button-default uk-modal-close">${options.labels.cancel}</button> <button class="uk-button uk-button-primary uk-modal-close" autofocus>${options.labels.ok}</button> </div> `), options).$el, 'click', '.uk-modal-footer button', (ref) => {
        const target = ref.target;

        return index(target) === 0 ? reject() : resolve();
      })));
    };

    UIkit.modal.prompt = function (message, value, options) {
      options = assign({ bgClose: false, escClose: false, labels: UIkit.modal.labels }, options);

      return new Promise(((resolve) => {
        let resolved = false,
          prompt = UIkit.modal.dialog((` <form class="uk-form-stacked"> <div class="uk-modal-body"> <label>${isString(message) ? message : html(message)}</label> <input class="uk-input" autofocus> </div> <div class="uk-modal-footer uk-text-right"> <button class="uk-button uk-button-default uk-modal-close" type="button">${options.labels.cancel}</button> <button class="uk-button uk-button-primary">${options.labels.ok}</button> </div> </form> `), options),
          input = $$1('input', prompt.$el);

        input.value = value;

        on(prompt.$el, 'submit', 'form', (e) => {
          e.preventDefault();
          resolve(input.value);
          resolved = true;
          prompt.hide();
        });
        on(prompt.$el, 'hide', () => {
          if (!resolved) {
            resolve(null);
          }
        });
      }));
    };

    UIkit.modal.labels = {
      ok: 'Ok',
      cancel: 'Cancel',
    };
  };

  const Nav = function (UIkit) {
    UIkit.component('nav', UIkit.components.accordion.extend({

      name: 'nav',

      defaults: {
        targets: '> .uk-parent',
        toggle: '> a',
        content: '> ul',
      },

    }));
  };

  const Navbar = function (UIkit) {
    UIkit.component('navbar', {

      mixins: [Class],

      props: {
        dropdown: String,
        mode: 'list',
        align: String,
        offset: Number,
        boundary: Boolean,
        boundaryAlign: Boolean,
        clsDrop: String,
        delayShow: Number,
        delayHide: Number,
        dropbar: Boolean,
        dropbarMode: String,
        dropbarAnchor: 'query',
        duration: Number,
      },

      defaults: {
        dropdown: '.uk-navbar-nav > li',
        align: !isRtl ? 'left' : 'right',
        clsDrop: 'uk-navbar-dropdown',
        mode: undefined,
        offset: undefined,
        delayShow: undefined,
        delayHide: undefined,
        boundaryAlign: undefined,
        flip: 'x',
        boundary: true,
        dropbar: false,
        dropbarMode: 'slide',
        dropbarAnchor: false,
        duration: 200,
      },

      computed: {

        boundary: function boundary(ref, $el) {
          const boundary = ref.boundary;
          const boundaryAlign = ref.boundaryAlign;

          return (boundary === true || boundaryAlign) ? $el : boundary;
        },

        pos: function pos(ref) {
          const align = ref.align;

          return (`bottom-${align}`);
        },

      },

      ready: function ready() {
        if (this.dropbar) {
          UIkit.navbarDropbar(
            query(this.dropbar, this.$el) || after(this.dropbarAnchor || this.$el, '<div></div>'),
            {
              clsDrop: this.clsDrop, mode: this.dropbarMode, duration: this.duration, navbar: this,
            }
          );
        }
      },

      update: function update() {
        UIkit.drop(
          $$((`${this.dropdown} .${this.clsDrop}`), this.$el).filter(el => !UIkit.getComponent(el, 'dropdown')),
          assign({}, this.$props, { boundary: this.boundary, pos: this.pos })
        );
      },

      events: [

        {
          name: 'mouseover',

          delegate: function delegate() {
            return this.dropdown;
          },

          handler: function handler(ref) {
            const current = ref.current;

            const active = this.getActive();
            if (active && active.toggle && !within(active.toggle.$el, current) && !active.tracker.movesTo(active.$el)) {
              active.hide(false);
            }
          },

        },

      ],

      methods: {

        getActive: function getActive() {
          const active = UIkit.drop.getActive();
          return active && includes(active.mode, 'hover') && within(active.toggle.$el, this.$el) && active;
        },

      },

    });

    UIkit.component('navbar-dropbar', {

      mixins: [Class],

      defaults: {
        clsDrop: '',
        mode: 'slide',
        navbar: null,
        duration: 200,
      },

      init: function init() {
        if (this.mode === 'slide') {
          addClass(this.$el, 'uk-navbar-dropbar-slide');
        }
      },

      events: [

        {
          name: 'beforeshow',

          el: function el() {
            return this.navbar.$el;
          },

          handler: function handler(e, drop) {
            const $el = drop.$el;
            const dir = drop.dir;
            if (dir === 'bottom' && !within($el, this.$el)) {
              append(this.$el, $el);
              drop.show();
              e.preventDefault();
            }
          },
        },

        {
          name: 'mouseleave',

          handler: function handler() {
            const active = this.navbar.getActive();

            if (active && !matches(this.$el, ':hover')) {
              active.hide();
            }
          },
        },

        {
          name: 'show',

          handler: function handler(_, ref) {
            const $el = ref.$el;

            this.clsDrop && addClass($el, (`${this.clsDrop}-dropbar`));
            this.transitionTo($el.offsetHeight + toFloat(css($el, 'margin-top')) + toFloat(css($el, 'margin-bottom')));
          },
        },

        {
          name: 'beforehide',

          handler: function handler(e, ref) {
            const $el = ref.$el;


            const active = this.navbar.getActive();

            if (matches(this.$el, ':hover') && active && active.$el === $el) {
              e.preventDefault();
            }
          },
        },

        {
          name: 'hide',

          handler: function handler(_, ref) {
            const $el = ref.$el;


            const active = this.navbar.getActive();

            if (!active || active && active.$el === $el) {
              this.transitionTo(0);
            }
          },
        },

      ],

      methods: {

        transitionTo: function transitionTo(newHeight) {
          height(this.$el, isVisible(this.$el) ? height(this.$el) : 0);
          Transition.cancel(this.$el);
          return Transition.start(this.$el, { height: newHeight }, this.duration).then(null, noop);
        },

      },

    });
  };

  let scroll;

  const Offcanvas = function (UIkit) {
    UIkit.component('offcanvas', {

      mixins: [Modal],

      args: 'mode',

      props: {
        content: String,
        mode: String,
        flip: Boolean,
        overlay: Boolean,
      },

      defaults: {
        content: '.uk-offcanvas-content',
        mode: 'slide',
        flip: false,
        overlay: false,
        clsPage: 'uk-offcanvas-page',
        clsContainer: 'uk-offcanvas-container',
        clsPanel: 'uk-offcanvas-bar',
        clsFlip: 'uk-offcanvas-flip',
        clsContent: 'uk-offcanvas-content',
        clsContentAnimation: 'uk-offcanvas-content-animation',
        clsSidebarAnimation: 'uk-offcanvas-bar-animation',
        clsMode: 'uk-offcanvas',
        clsOverlay: 'uk-offcanvas-overlay',
        selClose: '.uk-offcanvas-close',
      },

      computed: {

        content: function content(ref) {
          const content = ref.content;

          return $$1(content);
        },

        clsFlip: function clsFlip(ref) {
          const flip = ref.flip;
          const clsFlip = ref.clsFlip;

          return flip ? clsFlip : '';
        },

        clsOverlay: function clsOverlay(ref) {
          const overlay = ref.overlay;
          const clsOverlay = ref.clsOverlay;

          return overlay ? clsOverlay : '';
        },

        clsMode: function clsMode(ref) {
          const mode = ref.mode;
          const clsMode = ref.clsMode;

          return (`${clsMode}-${mode}`);
        },

        clsSidebarAnimation: function clsSidebarAnimation(ref) {
          const mode = ref.mode;
          const clsSidebarAnimation = ref.clsSidebarAnimation;

          return mode === 'none' || mode === 'reveal' ? '' : clsSidebarAnimation;
        },

        clsContentAnimation: function clsContentAnimation(ref) {
          const mode = ref.mode;
          const clsContentAnimation = ref.clsContentAnimation;

          return mode !== 'push' && mode !== 'reveal' ? '' : clsContentAnimation;
        },

        transitionElement: function transitionElement(ref) {
          const mode = ref.mode;

          return mode === 'reveal' ? this.panel.parentNode : this.panel;
        },

      },

      update: {

        write: function write() {
          if (this.getActive() === this) {
            if (this.overlay || this.clsContentAnimation) {
              width(this.content, width(win) - this.scrollbarWidth);
            }

            if (this.overlay) {
              height(this.content, height(win));
              if (scroll) {
                this.content.scrollTop = scroll.y;
              }
            }
          }
        },

        events: ['resize'],

      },

      events: [

        {

          name: 'click',

          delegate: function delegate() {
            return 'a[href^="#"]';
          },

          handler: function handler(ref) {
            const current = ref.current;

            if (current.hash && $$1(current.hash, this.content)) {
              scroll = null;
              this.hide();
            }
          },

        },

        {

          name: 'beforescroll',

          filter: function filter() {
            return this.overlay;
          },

          handler: function handler(e, scroll, target) {
            if (scroll && target && this.isToggled() && $$1(target, this.content)) {
              once(this.$el, 'hidden', () => scroll.scrollTo(target));
              e.preventDefault();
            }
          },

        },

        {
          name: 'show',

          self: true,

          handler: function handler() {
            scroll = scroll || { x: win.pageXOffset, y: win.pageYOffset };

            if (this.mode === 'reveal' && !hasClass(this.panel, this.clsMode)) {
              wrapAll(this.panel, '<div>');
              addClass(this.panel.parentNode, this.clsMode);
            }

            css(docEl, 'overflowY', (!this.clsContentAnimation || this.flip) && this.scrollbarWidth && this.overlay ? 'scroll' : '');
            addClass(doc.body, (`${this.clsContainer} ${this.clsFlip} ${this.clsOverlay}`));
            height(doc.body); // force reflow
            addClass(this.content, this.clsContentAnimation);
            addClass(this.panel, (`${this.clsSidebarAnimation} ${this.mode !== 'reveal' ? this.clsMode : ''}`));
            addClass(this.$el, this.clsOverlay);
            css(this.$el, 'display', 'block');
            height(this.$el); // force reflow
          },
        },

        {
          name: 'hide',

          self: true,

          handler: function handler() {
            removeClass(this.content, this.clsContentAnimation);

            const active = this.getActive();
            if (this.mode === 'none' || active && active !== this && active !== this.prev) {
              trigger(this.panel, transitionend);
            }
          },
        },

        {
          name: 'hidden',

          self: true,

          handler: function handler() {
            if (this.mode === 'reveal') {
              unwrap(this.panel);
            }

            if (!this.overlay) {
              scroll = { x: win.pageXOffset, y: win.pageYOffset };
            } else if (!scroll) {
              const ref = this.content;
              const x = ref.scrollLeft;
              const y = ref.scrollTop;
              scroll = { x, y };
            }

            removeClass(this.panel, (`${this.clsSidebarAnimation} ${this.clsMode}`));
            removeClass(this.$el, this.clsOverlay);
            css(this.$el, 'display', '');
            removeClass(doc.body, (`${this.clsContainer} ${this.clsFlip} ${this.clsOverlay}`));
            doc.body.scrollTop = scroll.y;

            css(docEl, 'overflow-y', '');

            width(this.content, '');
            height(this.content, '');

            win.scrollTo(scroll.x, scroll.y);

            scroll = null;
          },
        },

        {
          name: 'swipeLeft swipeRight',

          handler: function handler(e) {
            if (this.isToggled() && isTouch(e) && (e.type === 'swipeLeft' && !this.flip || e.type === 'swipeRight' && this.flip)) {
              this.hide();
            }
          },
        },

      ],

    });
  };

  const Responsive = function (UIkit) {
    UIkit.component('responsive', {

      props: ['width', 'height'],

      init: function init() {
        addClass(this.$el, 'uk-responsive-width');
      },

      update: {

        read: function read() {
          this.dim = isVisible(this.$el) && this.width && this.height
            ? { width: width(this.$el.parentNode), height: this.height }
            : false;
        },

        write: function write() {
          if (this.dim) {
            height(this.$el, Dimensions.contain({ height: this.height, width: this.width }, this.dim).height);
          }
        },

        events: ['load', 'resize'],

      },

    });
  };

  const Scroll = function (UIkit) {
    UIkit.component('scroll', {

      props: {
        duration: Number,
        offset: Number,
      },

      defaults: {
        duration: 1000,
        offset: 0,
      },

      methods: {

        scrollTo: function scrollTo(el) {
          const this$1 = this;


          el = el && $$1(isString(el) ? el.replace(/\//g, '\\/') : el) || doc.body;

          let target = offset(el).top - this.offset,
            docHeight = height(doc),
            winHeight = height(win);

          if (target + winHeight > docHeight) {
            target = docHeight - winHeight;
          }

          if (!trigger(this.$el, 'beforescroll', [this, el])) {
            return;
          }

          var start = Date.now(),
            startY = win.pageYOffset,
            step = function () {
              const currentY = startY + (target - startY) * ease(clamp((Date.now() - start) / this$1.duration));

              win.scrollTo(win.pageXOffset, currentY);

              // scroll more if we have not reached our destination
              if (currentY !== target) {
                requestAnimationFrame(step);
              } else {
                trigger(this$1.$el, 'scrolled', [this$1, el]);
              }
            };

          step();
        },

      },

      events: {

        click: function click(e) {
          if (e.defaultPrevented) {
            return;
          }

          e.preventDefault();
          this.scrollTo(this.$el.hash);
        },

      },

    });

    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }
  };

  const Scrollspy = function (UIkit) {
    UIkit.component('scrollspy', {

      args: 'cls',

      props: {
        cls: 'list',
        target: String,
        hidden: Boolean,
        offsetTop: Number,
        offsetLeft: Number,
        repeat: Boolean,
        delay: Number,
      },

      defaults: {
        cls: ['uk-scrollspy-inview'],
        target: false,
        hidden: true,
        offsetTop: 0,
        offsetLeft: 0,
        repeat: false,
        delay: 0,
        inViewClass: 'uk-scrollspy-inview',
      },

      computed: {

        elements: function elements(ref, $el) {
          const target = ref.target;

          return target && $$(target, $el) || [$el];
        },

      },

      update: [

        {

          write: function write() {
            if (this.hidden) {
              css(filter(this.elements, (`:not(.${this.inViewClass})`)), 'visibility', 'hidden');
            }
          },

        },

        {

          read: function read() {
            const this$1 = this;

            this.elements.forEach((el) => {
              if (!el._scrollspy) {
                const cls = attr(el, 'uk-scrollspy-class');
                el._scrollspy = { toggles: cls && cls.split(',') || this$1.cls };
              }

              el._scrollspy.show = isInView(el, this$1.offsetTop, this$1.offsetLeft);
            });
          },

          write: function write() {
            const this$1 = this;


            let index = this.elements.length === 1 ? 1 : 0;

            this.elements.forEach((el, i) => {
              let data = el._scrollspy,
                cls = data.toggles[i] || data.toggles[0];

              if (data.show) {
                if (!data.inview && !data.timer) {
                  const show = function () {
                    css(el, 'visibility', '');
                    addClass(el, this$1.inViewClass);
                    toggleClass(el, cls);

                    trigger(el, 'inview');

                    this$1.$update();

                    data.inview = true;
                    delete data.timer;
                  };

                  if (this$1.delay && index) {
                    data.timer = setTimeout(show, this$1.delay * index);
                  } else {
                    show();
                  }

                  index++;
                }
              } else if (data.inview && this$1.repeat) {
                if (data.timer) {
                  clearTimeout(data.timer);
                  delete data.timer;
                }

                css(el, 'visibility', this$1.hidden ? 'hidden' : '');
                removeClass(el, this$1.inViewClass);
                toggleClass(el, cls);

                trigger(el, 'outview');

                this$1.$update();

                data.inview = false;
              }
            });
          },

          events: ['scroll', 'load', 'resize'],

        },

      ],

    });
  };

  const ScrollspyNav = function (UIkit) {
    UIkit.component('scrollspy-nav', {

      props: {
        cls: String,
        closest: String,
        scroll: Boolean,
        overflow: Boolean,
        offset: Number,
      },

      defaults: {
        cls: 'uk-active',
        closest: false,
        scroll: false,
        overflow: true,
        offset: 0,
      },

      computed: {

        links: function links(_, $el) {
          return $$('a[href^="#"]', $el).filter(el => el.hash);
        },

        elements: function elements() {
          return this.closest ? closest(this.links, this.closest) : this.links;
        },

        targets: function targets() {
          return $$(this.links.map(el => el.hash).join(','));
        },

      },

      update: [

        {

          read: function read() {
            if (this.scroll) {
              UIkit.scroll(this.links, { offset: this.offset || 0 });
            }
          },

        },

        {

          read: function read() {
            const this$1 = this;


            let scroll = win.pageYOffset + this.offset + 1,
              max = height(doc) - height(win) + this.offset;

            this.active = false;

            this.targets.every((el, i) => {
              let top = offset(el).top,
                last = i + 1 === this$1.targets.length;
              if (!this$1.overflow && (i === 0 && top > scroll || last && top + el.offsetTop < scroll)) {
                return false;
              }

              if (!last && offset(this$1.targets[i + 1]).top <= scroll) {
                return true;
              }

              if (scroll >= max) {
                for (let j = this$1.targets.length - 1; j > i; j--) {
                  if (isInView(this$1.targets[j])) {
                    el = this$1.targets[j];
                    break;
                  }
                }
              }

              return !(this$1.active = $$1(filter(this$1.links, (`[href="#${el.id}"]`))));
            });
          },

          write: function write() {
            this.links.forEach(el => el.blur());
            removeClass(this.elements, this.cls);

            if (this.active) {
              trigger(this.$el, 'active', [
                this.active,
                addClass(this.closest ? closest(this.active, this.closest) : this.active, this.cls),
              ]);
            }
          },

          events: ['scroll', 'load', 'resize'],

        },

      ],

    });
  };

  const Sticky = function (UIkit) {
    UIkit.component('sticky', {

      mixins: [Class],

      attrs: true,

      props: {
        top: null,
        bottom: Boolean,
        offset: Number,
        animation: String,
        clsActive: String,
        clsInactive: String,
        clsFixed: String,
        clsBelow: String,
        selTarget: String,
        widthElement: 'query',
        showOnUp: Boolean,
        media: 'media',
        target: Number,
      },

      defaults: {
        top: 0,
        bottom: false,
        offset: 0,
        animation: '',
        clsActive: 'uk-active',
        clsInactive: '',
        clsFixed: 'uk-sticky-fixed',
        clsBelow: 'uk-sticky-below',
        selTarget: '',
        widthElement: false,
        showOnUp: false,
        media: false,
        target: false,
      },

      computed: {

        selTarget: function selTarget(ref, $el) {
          const selTarget = ref.selTarget;

          return selTarget && $$1(selTarget, $el) || $el;
        },

      },

      connected: function connected() {
        this.placeholder = $$1('<div class="uk-sticky-placeholder"></div>');
        this.widthElement = this.$props.widthElement || this.placeholder;

        if (!this.isActive) {
          this.hide();
        }
      },

      disconnected: function disconnected() {
        if (this.isActive) {
          this.isActive = false;
          this.hide();
          removeClass(this.$el, this.clsInactive);
        }

        remove(this.placeholder);
        this.placeholder = null;
        this.widthElement = null;
      },

      ready: function ready() {
        const this$1 = this;


        if (!(this.target && location.hash && win.pageYOffset > 0)) {
          return;
        }

        const target = $$1(location.hash);

        if (target) {
          requestAnimationFrame(() => {
            let top = offset(target).top,
              elTop = offset(this$1.$el).top,
              elHeight = this$1.$el.offsetHeight;

            if (elTop + elHeight >= top && elTop <= top + target.offsetHeight) {
              win.scrollTo(0, top - elHeight - this$1.target - this$1.offset);
            }
          });
        }
      },

      events: [

        {
          name: 'active',

          handler: function handler() {
            replaceClass(this.selTarget, this.clsInactive, this.clsActive);
          },

        },

        {
          name: 'inactive',

          handler: function handler() {
            replaceClass(this.selTarget, this.clsActive, this.clsInactive);
          },

        },

      ],

      update: [

        {

          write: function write() {
            const this$1 = this;


            let placeholder = this.placeholder,
              outerHeight = (this.isActive ? placeholder : this.$el).offsetHeight,
              el;

            css(placeholder, assign(
              { height: css(this.$el, 'position') !== 'absolute' ? outerHeight : '' },
              css(this.$el, ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'])
            ));

            if (!within(placeholder, docEl)) {
              after(this.$el, placeholder);
              attr(placeholder, 'hidden', '');
            }

            attr(this.widthElement, 'hidden', null);
            this.width = this.widthElement.offsetWidth;
            attr(this.widthElement, 'hidden', this.isActive ? null : '');

            this.topOffset = offset(this.isActive ? placeholder : this.$el).top;
            this.bottomOffset = this.topOffset + outerHeight;

            ['top', 'bottom'].forEach((prop) => {
              this$1[prop] = this$1.$props[prop];

              if (!this$1[prop]) {
                return;
              }

              if (isNumeric(this$1[prop])) {
                this$1[prop] = this$1[(`${prop}Offset`)] + toFloat(this$1[prop]);
              } else if (isString(this$1[prop]) && this$1[prop].match(/^-?\d+vh$/)) {
                this$1[prop] = height(win) * toFloat(this$1[prop]) / 100;
              } else {
                el = this$1[prop] === true ? this$1.$el.parentNode : query(this$1[prop], this$1.$el);

                if (el) {
                  this$1[prop] = offset(el).top + el.offsetHeight;
                }
              }
            });

            this.top = Math.max(toFloat(this.top), this.topOffset) - this.offset;
            this.bottom = this.bottom && this.bottom - outerHeight;
            this.inactive = this.media && !win.matchMedia(this.media).matches;

            if (this.isActive) {
              this.update();
            }
          },

          events: ['load', 'resize'],

        },

        {

          read: function read() {
            this.offsetTop = offset(this.$el).top;
            this.scroll = win.pageYOffset;
            this.visible = isVisible(this.$el);
          },

          write: function write(ref) {
            const this$1 = this;
            if (ref === void 0) ref = {};
            const dir = ref.dir;


            const scroll = this.scroll;

            if (scroll < 0 || !this.visible || this.disabled || this.showOnUp && !dir) {
              return;
            }

            if (this.inactive
                        || scroll < this.top
                        || this.showOnUp && (scroll <= this.top || dir === 'down' || dir === 'up' && !this.isActive && scroll <= this.bottomOffset)
            ) {
              if (!this.isActive) {
                return;
              }

              this.isActive = false;

              if (this.animation && scroll > this.topOffset) {
                Animation.cancel(this.$el);
                Animation.out(this.$el, this.animation).then(() => this$1.hide(), noop);
              } else {
                this.hide();
              }
            } else if (this.isActive) {
              this.update();
            } else if (this.animation) {
              Animation.cancel(this.$el);
              this.show();
              Animation.in(this.$el, this.animation).then(null, noop);
            } else {
              this.show();
            }
          },

          events: ['scroll'],

        }],

      methods: {

        show: function show() {
          this.isActive = true;
          this.update();
          attr(this.placeholder, 'hidden', null);
        },

        hide: function hide() {
          if (!this.isActive || hasClass(this.selTarget, this.clsActive)) {
            trigger(this.$el, 'inactive');
          }

          removeClass(this.$el, this.clsFixed, this.clsBelow);
          css(this.$el, { position: '', top: '', width: '' });
          attr(this.placeholder, 'hidden', '');
        },

        update: function update() {
          let top = Math.max(0, this.offset),
            active = this.scroll > this.top;

          if (this.bottom && this.scroll > this.bottom - this.offset) {
            top = this.bottom - this.scroll;
          }

          css(this.$el, {
            position: 'fixed',
            top: (`${top}px`),
            width: this.width,
          });

          if (hasClass(this.selTarget, this.clsActive)) {
            if (!active) {
              trigger(this.$el, 'inactive');
            }
          } else if (active) {
            trigger(this.$el, 'active');
          }

          toggleClass(this.$el, this.clsBelow, this.scroll > this.bottomOffset);


          addClass(this.$el, this.clsFixed);
        },

      },

    });
  };

  const svgs = {};

  const Svg = function (UIkit) {
    UIkit.component('svg', {

      attrs: true,

      props: {
        id: String,
        icon: String,
        src: String,
        style: String,
        width: Number,
        height: Number,
        ratio: Number,
        class: String,
      },

      defaults: {
        ratio: 1,
        id: false,
        exclude: ['src'],
        class: '',
      },

      init: function init() {
        this.class += ' uk-svg';
      },

      connected: function connected() {
        const this$1 = this;


        if (!this.icon && includes(this.src, '#')) {
          const parts = this.src.split('#');

          if (parts.length > 1) {
            this.src = parts[0];
            this.icon = parts[1];
          }
        }

        this.svg = this.getSvg().then((svg) => {
          let el;

          if (isString(svg)) {
            if (this$1.icon && includes(svg, '<symbol')) {
              svg = parseSymbols(svg, this$1.icon) || svg;
            }

            el = $$1(svg.trim());
          } else {
            el = svg.cloneNode(true);
          }

          if (!el) {
            return Promise.reject('SVG not found.');
          }

          let dimensions = attr(el, 'viewBox');

          if (dimensions) {
            dimensions = dimensions.split(' ');
            this$1.width = this$1.$props.width || dimensions[2];
            this$1.height = this$1.$props.height || dimensions[3];
          }

          this$1.width *= this$1.ratio;
          this$1.height *= this$1.ratio;

          for (const prop in this$1.$options.props) {
            if (this$1[prop] && !includes(this$1.exclude, prop)) {
              attr(el, prop, this$1[prop]);
            }
          }

          if (!this$1.id) {
            removeAttr(el, 'id');
          }

          if (this$1.width && !this$1.height) {
            removeAttr(el, 'height');
          }

          if (this$1.height && !this$1.width) {
            removeAttr(el, 'width');
          }

          const root = this$1.$el;
          if (isVoidElement(root) || root.tagName === 'CANVAS') {
            attr(root, { hidden: true, id: null });

            const next = root.nextElementSibling;
            if (next && el.isEqualNode(next)) {
              el = next;
            } else {
              after(root, el);
            }
          } else {
            const last = root.lastElementChild;
            if (last && el.isEqualNode(last)) {
              el = last;
            } else {
              append(root, el);
            }
          }

          this$1.svgEl = el;

          return el;
        }, noop);
      },

      disconnected: function disconnected() {
        const this$1 = this;


        if (isVoidElement(this.$el)) {
          attr(this.$el, { hidden: null, id: this.id || null });
        }

        if (this.svg) {
          this.svg.then(svg => (!this$1._connected || svg !== this$1.svgEl) && remove(svg), noop);
        }

        this.svg = this.svgEl = null;
      },

      methods: {

        getSvg: function getSvg() {
          const this$1 = this;


          if (!this.src) {
            return Promise.reject();
          }

          if (svgs[this.src]) {
            return svgs[this.src];
          }

          svgs[this.src] = new Promise(((resolve, reject) => {
            if (startsWith(this$1.src, 'data:')) {
              resolve(decodeURIComponent(this$1.src.split(',')[1]));
            } else {
              ajax(this$1.src).then(
                xhr => resolve(xhr.response),
                () => reject('SVG not found.')
              );
            }
          }));

          return svgs[this.src];
        },

      },

    });

    let symbolRe = /<symbol(.*?id=(['"])(.*?)\2[^]*?<\/)symbol>/g,
      symbols = {};

    function parseSymbols(svg, icon) {
      if (!symbols[svg]) {
        symbols[svg] = {};

        let match;
        while (match = symbolRe.exec(svg)) {
          symbols[svg][match[3]] = `<svg xmlns="http://www.w3.org/2000/svg"${match[1]}svg>`;
        }
      }

      return symbols[svg][icon];
    }
  };

  const Switcher = function (UIkit) {
    UIkit.component('switcher', {

      mixins: [Togglable],

      args: 'connect',

      props: {
        connect: String,
        toggle: String,
        active: Number,
        swiping: Boolean,
      },

      defaults: {
        connect: '+ .uk-switcher',
        toggle: '> *',
        active: 0,
        swiping: true,
        cls: 'uk-active',
        clsContainer: 'uk-switcher',
        attrItem: 'uk-switcher-item',
        queued: true,
      },

      computed: {

        connects: function connects(ref, $el) {
          const connect = ref.connect;

          return queryAll(connect, $el);
        },

        toggles: function toggles(ref, $el) {
          const toggle = ref.toggle;

          return $$(toggle, $el);
        },

      },

      events: [

        {

          name: 'click',

          delegate: function delegate() {
            return (`${this.toggle}:not(.uk-disabled)`);
          },

          handler: function handler(e) {
            e.preventDefault();
            this.show(e.current);
          },

        },

        {
          name: 'click',

          el: function el() {
            return this.connects;
          },

          delegate: function delegate() {
            return (`[${this.attrItem}],[data-${this.attrItem}]`);
          },

          handler: function handler(e) {
            e.preventDefault();
            this.show(data(e.current, this.attrItem));
          },
        },

        {
          name: 'swipeRight swipeLeft',

          filter: function filter$$1() {
            return this.swiping;
          },

          el: function el() {
            return this.connects;
          },

          handler: function handler(e) {
            if (!isTouch(e)) {
              return;
            }

            e.preventDefault();
            if (!win.getSelection().toString()) {
              this.show(e.type === 'swipeLeft' ? 'next' : 'previous');
            }
          },
        },

      ],

      update: function update() {
        const this$1 = this;


        this.connects.forEach(list => this$1.updateAria(list.children));
        this.show(filter(this.toggles, (`.${this.cls}`))[0] || this.toggles[this.active] || this.toggles[0]);
      },

      methods: {

        show: function show(item) {
          const this$1 = this;


          if (!this.connects.length) {
            return;
          }

          let length = this.toggles.length,
            prev = index(filter(this.connects[0].children, (`.${this.cls}`))[0]),
            hasPrev = prev >= 0,
            next = getIndex(item, this.toggles, prev),
            dir = item === 'previous' ? -1 : 1,
            toggle;

          for (let i = 0; i < length; i++, next = (next + dir + length) % length) {
            if (!matches(this$1.toggles[next], '.uk-disabled, [disabled]')) {
              toggle = this$1.toggles[next];
              break;
            }
          }

          if (!toggle || prev >= 0 && hasClass(toggle, this.cls) || prev === next) {
            return;
          }

          removeClass(this.toggles, this.cls);
          attr(this.toggles, 'aria-expanded', false);
          addClass(toggle, this.cls);
          attr(toggle, 'aria-expanded', true);

          this.connects.forEach((list) => {
            if (!hasPrev) {
              this$1.toggleNow(list.children[next]);
            } else {
              this$1.toggleElement([list.children[prev], list.children[next]]);
            }
          });
        },

      },

    });
  };

  const Tab = function (UIkit) {
    UIkit.component('tab', UIkit.components.switcher.extend({

      mixins: [Class],

      name: 'tab',

      props: {
        media: 'media',
      },

      defaults: {
        media: 960,
        attrItem: 'uk-tab-item',
      },

      init: function init() {
        const cls = hasClass(this.$el, 'uk-tab-left')
          ? 'uk-tab-left'
          : hasClass(this.$el, 'uk-tab-right')
            ? 'uk-tab-right'
            : false;

        if (cls) {
          UIkit.toggle(this.$el, { cls, mode: 'media', media: this.media });
        }
      },

    }));
  };

  const Toggle = function (UIkit) {
    UIkit.component('toggle', {

      mixins: [UIkit.mixin.togglable],

      args: 'target',

      props: {
        href: String,
        target: null,
        mode: 'list',
        media: 'media',
      },

      defaults: {
        href: false,
        target: false,
        mode: 'click',
        queued: true,
        media: false,
      },

      computed: {

        target: function target(ref, $el) {
          const href = ref.href;
          let target = ref.target;

          target = queryAll(target || href, $el);
          return target.length && target || [$el];
        },

      },

      events: [

        {

          name: (`${pointerEnter} ${pointerLeave}`),

          filter: function filter() {
            return includes(this.mode, 'hover');
          },

          handler: function handler(e) {
            if (!isTouch(e)) {
              this.toggle((`toggle${e.type === pointerEnter ? 'show' : 'hide'}`));
            }
          },

        },

        {

          name: 'click',

          filter: function filter() {
            return includes(this.mode, 'click') || hasTouch;
          },

          handler: function handler(e) {
            if (!isTouch(e) && !includes(this.mode, 'click')) {
              return;
            }

            // TODO better isToggled handling
            let link;
            if (closest(e.target, 'a[href="#"], button')
                        || (link = closest(e.target, 'a[href]')) && (
                          this.cls
                            || !isVisible(this.target)
                            || link.hash && matches(this.target, link.hash)
                        )
            ) {
              e.preventDefault();
            }

            this.toggle();
          },

        },
      ],

      update: {

        write: function write() {
          if (!includes(this.mode, 'media') || !this.media) {
            return;
          }

          const toggled = this.isToggled(this.target);
          if (win.matchMedia(this.media).matches ? !toggled : toggled) {
            this.toggle();
          }
        },

        events: ['load', 'resize'],

      },

      methods: {

        toggle: function toggle(type) {
          if (trigger(this.target, type || 'toggle', [this])) {
            this.toggleElement(this.target);
          }
        },

      },

    });
  };

  const Video = function (UIkit) {
    UIkit.component('video', {

      props: {
        automute: Boolean,
        autoplay: Boolean,
      },

      defaults: { automute: false, autoplay: true },

      ready: function ready() {
        this.player = new Player(this.$el);

        if (this.automute) {
          this.player.mute();
        }
      },

      update: {

        write: function write() {
          if (!this.player) {
            return;
          }

          if (!isVisible(this.$el) || css(this.$el, 'visibility') === 'hidden') {
            this.player.pause();
          } else if (this.autoplay) {
            this.player.play();
          }
        },

        events: ['load'],

      },

    });
  };

  const core = function (UIkit) {
    let scroll = 0,
      started = 0;

    on(win, 'load resize', UIkit.update);
    on(win, 'scroll', (e) => {
      e.dir = scroll < win.pageYOffset ? 'down' : 'up';
      scroll = win.pageYOffset;
      UIkit.update(e);
      fastdom.flush();
    });

    animationstart && on(doc, animationstart, (ref) => {
      const target = ref.target;

      if ((css(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {
        started++;
        doc.body.style.overflowX = 'hidden';
        setTimeout(() => {
          if (!--started) {
            doc.body.style.overflowX = '';
          }
        }, toMs(css(target, 'animationDuration')) + 100);
      }
    }, true);

    // core components
    UIkit.use(Toggle);
    UIkit.use(Accordion);
    UIkit.use(Alert);
    UIkit.use(Video);
    UIkit.use(Cover);
    UIkit.use(Drop);
    UIkit.use(Dropdown);
    UIkit.use(FormCustom);
    UIkit.use(HeightMatch);
    UIkit.use(HeightViewport);
    UIkit.use(Hover);
    UIkit.use(Margin);
    UIkit.use(Gif);
    UIkit.use(Grid);
    UIkit.use(Leader);
    UIkit.use(Modal$1);
    UIkit.use(Nav);
    UIkit.use(Navbar);
    UIkit.use(Offcanvas);
    UIkit.use(Responsive);
    UIkit.use(Scroll);
    UIkit.use(Scrollspy);
    UIkit.use(ScrollspyNav);
    UIkit.use(Sticky);
    UIkit.use(Svg);
    UIkit.use(Icon);
    UIkit.use(Switcher);
    UIkit.use(Tab);
  };

  UIkit$2.version = '3.0.0-beta.32';

  mixin(UIkit$2);
  core(UIkit$2);

  function plugin(UIkit) {
    if (plugin.installed) {
      return;
    }

    const ref = UIkit.util;
    const $ = ref.$;
    const doc = ref.doc;
    const empty = ref.empty;
    const html = ref.html;

    UIkit.component('countdown', {

      mixins: [UIkit.mixin.class],

      attrs: true,

      props: {
        date: String,
        clsWrapper: String,
      },

      defaults: {
        date: '',
        clsWrapper: '.uk-countdown-%unit%',
      },

      computed: {

        date: function date(ref) {
          const date = ref.date;

          return Date.parse(date);
        },

        days: function days(ref, $el) {
          const clsWrapper = ref.clsWrapper;

          return $(clsWrapper.replace('%unit%', 'days'), $el);
        },

        hours: function hours(ref, $el) {
          const clsWrapper = ref.clsWrapper;

          return $(clsWrapper.replace('%unit%', 'hours'), $el);
        },

        minutes: function minutes(ref, $el) {
          const clsWrapper = ref.clsWrapper;

          return $(clsWrapper.replace('%unit%', 'minutes'), $el);
        },

        seconds: function seconds(ref, $el) {
          const clsWrapper = ref.clsWrapper;

          return $(clsWrapper.replace('%unit%', 'seconds'), $el);
        },

        units: function units() {
          const this$1 = this;

          return ['days', 'hours', 'minutes', 'seconds'].filter(unit => this$1[unit]);
        },

      },

      connected: function connected() {
        this.start();
      },

      disconnected: function disconnected() {
        const this$1 = this;

        this.stop();
        this.units.forEach(unit => empty(this$1[unit]));
      },

      events: [

        {

          name: 'visibilitychange',

          el: doc,

          handler: function handler() {
            if (doc.hidden) {
              this.stop();
            } else {
              this.start();
            }
          },

        },

      ],

      update: {

        write: function write() {
          const this$1 = this;


          const timespan = getTimeSpan(this.date);

          if (timespan.total <= 0) {
            this.stop();

            timespan.days
                        = timespan.hours
                        = timespan.minutes
                        = timespan.seconds
                        = 0;
          }

          this.units.forEach((unit) => {
            let digits = String(Math.floor(timespan[unit]));

            digits = digits.length < 2 ? (`0${digits}`) : digits;

            const el = this$1[unit];
            if (el.innerText !== digits) {
              digits = digits.split('');

              if (digits.length !== el.children.length) {
                html(el, digits.map(() => '<span></span>').join(''));
              }

              digits.forEach((digit, i) => el.children[i].innerText = digit);
            }
          });
        },

      },

      methods: {

        start: function start() {
          const this$1 = this;


          this.stop();

          if (this.date && this.units.length) {
            this.$emit();
            this.timer = setInterval(() => this$1.$emit(), 1000);
          }
        },

        stop: function stop() {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
        },

      },

    });

    function getTimeSpan(date) {
      const total = date - Date.now();

      return {
        total,
        seconds: total / 1000 % 60,
        minutes: total / 1000 / 60 % 60,
        hours: total / 1000 / 60 / 60 % 24,
        days: total / 1000 / 60 / 60 / 24,
      };
    }
  }

  if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
  }

  function plugin$1(UIkit) {
    if (plugin$1.installed) {
      return;
    }

    const ref = UIkit.util;
    const $$ = ref.$$;
    const addClass = ref.addClass;
    const css = ref.css;
    const scrolledOver = ref.scrolledOver;
    const toFloat = ref.toFloat;
    const toNodes = ref.toNodes;

    UIkit.component('grid-parallax', UIkit.components.grid.extend({

      props: {
        target: String,
        translate: Number,
      },

      defaults: {
        target: false,
        translate: 150,
      },

      computed: {

        translate: function translate(ref) {
          const translate = ref.translate;

          return Math.abs(translate);
        },

        items: function items(ref, $el) {
          const target = ref.target;

          return target ? $$(target, $el) : toNodes($el.children);
        },

      },

      init: function init() {
        addClass(this.$el, 'uk-grid');
      },

      disconnected: function disconnected() {
        this.reset();
        css(this.$el, 'marginBottom', '');
      },

      update: [

        {

          read: function read() {
            this.columns = this.rows && this.rows[0] && this.rows[0].length || 0;
            this.rows = this.rows && this.rows.map(elements => sortBy(elements, 'offsetLeft'));
          },

          write: function write() {
            css(this.$el, 'marginBottom', this.columns > 1
              ? this.translate + toFloat(css(css(this.$el, 'marginBottom', ''), 'marginBottom'))
              : '');
          },

          events: ['load', 'resize'],
        },

        {

          read: function read() {
            this.scrolled = scrolledOver(this.$el) * this.translate;
          },

          write: function write() {
            const this$1 = this;


            if (!this.rows || this.columns === 1 || !this.scrolled) {
              return this.reset();
            }

            this.rows.forEach(row => row.forEach((el, i) => css(el, 'transform', (`translateY(${i % 2 ? this$1.scrolled : this$1.scrolled / 8}px)`))));
          },

          events: ['scroll', 'load', 'resize'],
        },
      ],

      methods: {

        reset: function reset() {
          css(this.items, 'transform', '');
        },

      },

    }));

    UIkit.component('grid-parallax').options.update.unshift({

      read: function read() {
        this.reset();
      },

      events: ['load', 'resize'],

    });

    function sortBy(collection, prop) {
      return collection.sort((a, b) => (a[prop] > b[prop]
        ? 1
        : b[prop] > a[prop]
          ? -1
          : 0));
    }
  }

  if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$1);
  }

  const Animations = function (UIkit) {
    const ref = UIkit.util;
    const css = ref.css;

    var Animations = {

      slide: {

        show: function show(dir) {
          return [
            { transform: translate(dir * -100) },
            { transform: translate() },
          ];
        },

        percent: function percent(current) {
          return Animations.translated(current);
        },

        translate: function translate$1(percent, dir) {
          return [
            { transform: translate(dir * -100 * percent) },
            { transform: translate(dir * 100 * (1 - percent)) },
          ];
        },

      },

      translated: function translated(el) {
        return Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth);
      },

    };

    return Animations;
  };

  function translate(value) {
    if (value === void 0) value = 0;

    return (`translate(${value}${value ? '%' : ''}, 0)`); // currently not translate3d to support IE, translate3d within translate3d does not work while transitioning
  }

  function scale3d(value) {
    return (`scale3d(${value}, ${value}, 1)`);
  }

  function plugin$3(UIkit) {
    if (plugin$3.installed) {
      return;
    }

    const ref = UIkit.util;
    const $$ = ref.$$;
    const $ = ref.$;
    const addClass = ref.addClass;
    const assign = ref.assign;
    const attr = ref.attr;
    const createEvent = ref.createEvent;
    const css = ref.css;
    const doc = ref.doc;
    const endsWith = ref.endsWith;
    const fastdom = ref.fastdom;
    const getIndex = ref.getIndex;
    const getPos = ref.getPos;
    const hasClass = ref.hasClass;
    const index = ref.index;
    const isTouch = ref.isTouch;
    const noop = ref.noop;
    const off = ref.off;
    const on = ref.on;
    const pointerDown = ref.pointerDown;
    const pointerMove = ref.pointerMove;
    const pointerUp = ref.pointerUp;
    const preventClick = ref.preventClick;
    const Promise = ref.Promise;
    const removeClass = ref.removeClass;
    const toggleClass = ref.toggleClass;
    const Transition = ref.Transition;
    const trigger = ref.trigger;

    UIkit.mixin.slideshow = {

      attrs: true,

      props: {
        autoplay: Boolean,
        autoplayInterval: Number,
        pauseOnHover: Boolean,
        animation: String,
        easing: String,
        velocity: Number,
      },

      defaults: {
        autoplay: false,
        autoplayInterval: 7000,
        pauseOnHover: true,
        animation: 'slide',
        easing: 'ease',
        velocity: 1,
        index: 0,
        stack: [],
        threshold: 10,
        percent: 0,
        clsActive: 'uk-active',
        clsActivated: 'uk-transition-active',
        initialAnimation: false,
        Animations: Animations(UIkit),
      },

      computed: {

        list: function list(ref, $el) {
          const selList = ref.selList;

          return $(selList, $el);
        },

        slides: function slides() {
          return $$(this.list.children);
        },

        animation: function animation(ref) {
          const animation = ref.animation;
          const Animations$$1 = ref.Animations;

          return assign(animation in Animations$$1 ? Animations$$1[animation] : Animations$$1.slide, { name: animation });
        },

        duration: function duration(ref, $el) {
          const velocity = ref.velocity;

          return speedUp($el.offsetWidth / velocity);
        },

      },

      init: function init() {
        const this$1 = this;

        ['start', 'move', 'end'].forEach((key) => {
          const fn = this$1[key];
          this$1[key] = function (e) {
            const pos = getPos(e).x;

            this$1.prevPos = pos !== this$1.pos ? this$1.pos : this$1.prevPos;
            this$1.pos = pos;

            fn(e);
          };
        });
      },

      connected: function connected() {
        this.startAutoplay();
      },

      disconnected: function disconnected() {
        this.stopAutoplay();
      },

      update: [

        {

          read: function read() {
            delete this._computeds.duration;
          },

          events: ['load', 'resize'],

        },

      ],

      events: [

        {

          name: 'click',

          delegate: function delegate() {
            return (`[${this.attrItem}]`);
          },

          handler: function handler(e) {
            e.preventDefault();
            e.current.blur();
            this.show(attr(e.current, this.attrItem));
          },

        },

        {

          name: pointerDown,

          delegate: function delegate() {
            return (`${this.selList} > *`);
          },

          handler: 'start',

        },

        {

          name: 'visibilitychange',

          el: doc,

          handler: function handler() {
            if (doc.hidden) {
              this.stopAutoplay();
            } else {
              this.startAutoplay();
            }
          },

        },

        {

          name: pointerDown,
          handler: 'stopAutoplay',

        },

        {

          name: 'mouseenter',

          filter: function filter() {
            return this.autoplay;
          },

          handler: function handler() {
            this.isHovering = true;
          },

        },

        {

          name: 'mouseleave',

          filter: function filter() {
            return this.autoplay;
          },

          handler: function handler() {
            this.isHovering = false;
          },

        },

        {

          name: 'beforeitemshow',

          self: true,

          delegate: function delegate() {
            return (`${this.selList} > *`);
          },

          handler: function handler(ref) {
            const target = ref.target;

            addClass(target, this.clsActive);
          },

        },

        {

          name: 'itemshown',

          self: true,

          delegate: function delegate() {
            return (`${this.selList} > *`);
          },

          handler: function handler(ref) {
            const target = ref.target;

            addClass(target, this.clsActivated);
          },

        },

        {

          name: 'itemshow itemhide',

          self: true,

          delegate: function delegate() {
            return (`${this.selList} > *`);
          },

          handler: function handler(ref) {
            const type = ref.type;
            const target = ref.target;

            toggleClass($$((`[${this.attrItem}="${index(target)}"]`), this.$el), this.clsActive, endsWith(type, 'show'));
          },

        },

        {

          name: 'itemhidden',

          self: true,

          delegate: function delegate() {
            return (`${this.selList} > *`);
          },

          handler: function handler(ref) {
            const target = ref.target;

            removeClass(target, this.clsActive);
            removeClass(target, this.clsActivated);
          },

        },

        {

          name: 'itemshow itemhide itemshown itemhidden',

          self: true,

          delegate: function delegate() {
            return (`${this.selList} > *`);
          },

          handler: function handler(ref) {
            const target = ref.target;

            UIkit.update(null, target);
          },

        },

      ],

      methods: {

        start: function start(e) {
          if (e.button && e.button !== 0 || this.slides.length < 2) {
            return;
          }

          if (!isTouch(e)) {
            e.preventDefault();
          }

          if (this._animation && this._animation.animation !== this.animation) {
            return;
          }

          let percent = 0;
          if (this.stack.length) {
            const ref = this._animation;
            const dir = ref.dir;
            const getPercent = ref.percent;
            const cancel = ref.cancel;
            const translate$$1 = ref.translate;

            percent = getPercent() * dir;

            this.percent = Math.abs(percent) * -dir;

            this.stack.splice(0, this.stack.length);

            cancel();
            translate$$1(Math.abs(percent));

            this.index = this.getIndex(this.index - dir);
            this.touching = true;
          }

          on(doc, pointerMove, this.move, true);
          on(doc, pointerUp, this.end, true);

          this.touch = this.pos + this.$el.offsetWidth * percent;
        },

        move: function move() {
          const this$1 = this;


          if (this.pos === this.prevPos || (!this.touching && Math.abs(this.touch - this.pos) < this.threshold)) {
            return;
          }

          this.touching = true;

          const percent = (this.pos - this.touch) / this.$el.offsetWidth;

          if (this.percent === percent) {
            return;
          }

          let prevIndex = this.getIndex(this.index - trunc(this.percent)),
            index = this.getIndex(this.index - trunc(percent)),
            current = this.slides[index],
            dir = percent < 0 ? 1 : -1,
            nextIndex = getIndex(percent < 0 ? 'next' : 'previous', this.slides, index),
            next = this.slides[nextIndex];

          this.slides.forEach((el, i) => toggleClass(el, this$1.clsActive, i === index || i === nextIndex));

          if (index !== prevIndex) {
            this._animation && this._animation.reset();
            trigger(this.slides[prevIndex], 'itemhide', [this]);
            trigger(current, 'itemshow', [this]);
          }

          this._animation = new Transitioner(this.animation, this.easing, current, next, dir, noop);
          this._animation.translate(Math.abs(percent % 1));

          this.percent = percent;

          UIkit.update(null, current);
          UIkit.update(null, next);
        },

        end: function end() {
          off(doc, pointerMove, this.move, true);
          off(doc, pointerUp, this.end, true);

          if (this.touching) {
            let percent = this.percent;

            this.percent = Math.abs(this.percent) % 1;
            this.index = this.getIndex(this.index - trunc(percent));

            if (this.percent < 0.1 || percent < 0 === this.pos > this.prevPos) {
              this.index = this.getIndex(percent > 0 ? 'previous' : 'next');
              this.percent = 1 - this.percent;
              percent *= -1;
            }

            this.show(percent > 0 ? 'previous' : 'next', true);

            preventClick();
          }

          this.pos
                    = this.prevPos
                    = this.touch
                    = this.touching
                    = this.percent
                    = null;
        },

        show: function show(index, force) {
          const this$1 = this;
          if (force === void 0) force = false;


          if (!force && this.touch) {
            return;
          }

          this.stack[force ? 'unshift' : 'push'](index);

          if (!force && this.stack.length > 1) {
            if (this.stack.length === 2) {
              this._animation.forward(250);
            }

            return;
          }

          let prevIndex = this.index,
            nextIndex = this.getIndex(index),
            prev = hasClass(this.slides, 'uk-active') && this.slides[prevIndex],
            next = this.slides[nextIndex];

          if (prev === next) {
            this.stack[force ? 'shift' : 'pop']();
            return;
          }

          prev && trigger(prev, 'beforeitemhide', [this]);
          trigger(next, 'beforeitemshow', [this]);

          this.index = nextIndex;

          const done = function () {
            prev && trigger(prev, 'itemhidden', [this$1]);
            trigger(next, 'itemshown', [this$1]);

            fastdom.mutate(() => {
              this$1.stack.shift();
              if (this$1.stack.length) {
                this$1.show(this$1.stack.shift(), true);
              } else {
                this$1._animation = null;
              }
            });
          };

          if (prev || this.initialAnimation) {
            this._show(
              !prev ? this.Animations[this.initialAnimation] : this.animation,
              force ? 'cubic-bezier(0.165, 0.840, 0.440, 1.000)' : this.easing,
              prev,
              next,
              getDirection(index, prevIndex),
              this.stack.length > 1,
              done
            );
          }

          prev && trigger(prev, 'itemhide', [this]);
          trigger(next, 'itemshow', [this]);

          if (!prev && !this.initialAnimation) {
            done();
          }

          prev && fastdom.flush(); // iOS 10+ will honor the video.play only if called from a gesture handler
        },

        _show: function _show(animation, easing, prev, next, dir, forward, done) {
          this._animation = new Transitioner(
            animation,
            easing,
            prev,
            next,
            dir,
            done
          );

          this._animation.show(
            prev === next
              ? 300
              : forward
                ? 150
                : this.duration,
            this.percent,
            forward
          );
        },

        getIndex: function getIndex$1(index) {
          if (index === void 0) index = this.index;

          return getIndex(index, this.slides, this.index);
        },

        startAutoplay: function startAutoplay() {
          const this$1 = this;


          this.stopAutoplay();

          if (this.autoplay) {
            this.interval = setInterval(() => !(this$1.isHovering && this$1.pauseOnHover) && this$1.show('next'), this.autoplayInterval);
          }
        },

        stopAutoplay: function stopAutoplay() {
          if (this.interval) {
            clearInterval(this.interval);
          }
        },

      },

    };

    function Transitioner(animation, easing, current, next, dir, cb) {
      const percent = animation.percent;
      const translate$$1 = animation.translate;
      const show = animation.show;
      const props = show(dir);

      return {

        animation,
        dir,
        current,
        next,

        show: function show(duration, percent, linear) {
          const this$1 = this;
          if (percent === void 0) percent = 0;


          const ease = linear ? 'linear' : easing;
          duration -= Math.round(duration * percent);

          this.translate(percent);

          triggerUpdate(next, 'itemin', {
            percent, duration, ease, dir,
          });
          current && triggerUpdate(current, 'itemout', {
            percent: 1 - percent, duration, ease, dir,
          });

          return Promise.all([
            Transition.start(next, props[1], duration, ease),
            current && Transition.start(current, props[0], duration, ease),
          ]).then(() => {
            this$1.reset();
            cb();
          }, noop);
        },

        stop: function stop() {
          return Transition.stop([next, current]);
        },

        cancel: function cancel() {
          Transition.cancel([next, current]);
        },

        reset: function reset() {
          for (const prop in props[0]) {
            css([next, current], prop, '');
          }
        },

        forward: function forward(duration) {
          const percent = this.percent();
          Transition.cancel([next, current]);
          this.show(duration, percent, true);
        },

        translate: function translate$1(percent) {
          const props = translate$$1(percent, dir);
          css(next, props[1]);
          current && css(current, props[0]);
          triggerUpdate(next, 'itemtranslatein', { percent, dir });
          current && triggerUpdate(current, 'itemtranslateout', { percent: 1 - percent, dir });
        },

        percent: function percent$1() {
          return percent(current, next, dir);
        },

      };
    }

    function triggerUpdate(el, type, data) {
      trigger(el, createEvent(type, false, false, data));
    }

    // polyfill for Math.trunc (IE)
    function trunc(x) {
      return ~~x;
    }

    function getDirection(index, prevIndex) {
      return index === 'next'
        ? 1
        : index === 'previous'
          ? -1
          : index < prevIndex
            ? -1
            : 1;
    }

    function speedUp(x) {
      return 0.5 * x + 300; // parabola through (400,500; 600,600; 1800,1200)
    }
  }

  const Animations$1 = function (UIkit) {
    const mixin = UIkit.mixin;
    const ref = UIkit.util;
    const assign = ref.assign;
    const css = ref.css;

    return assign({}, mixin.slideshow.defaults.Animations, {

      fade: {

        show: function show() {
          return [
            { opacity: 0 },
            { opacity: 1 },
          ];
        },

        percent: function percent(current) {
          return 1 - css(current, 'opacity');
        },

        translate: function translate$$1(percent) {
          return [
            { opacity: 1 - percent },
            { opacity: percent },
          ];
        },

      },

      scale: {

        show: function show() {
          return [
            { opacity: 0, transform: scale3d(1 - 0.2) },
            { opacity: 1, transform: scale3d(1) },
          ];
        },

        percent: function percent(current) {
          return 1 - css(current, 'opacity');
        },

        translate: function translate$$1(percent) {
          return [
            { opacity: 1 - percent, transform: scale3d(1 - 0.2 * percent) },
            { opacity: percent, transform: scale3d(1 - 0.2 + 0.2 * percent) },
          ];
        },

      },

    });
  };

  function plugin$2(UIkit) {
    if (plugin$2.installed) {
      return;
    }

    UIkit.use(plugin$3);

    const mixin = UIkit.mixin;
    const util = UIkit.util;
    const $ = util.$;
    const $$ = util.$$;
    const addClass = util.addClass;
    const ajax = util.ajax;
    const append = util.append;
    const assign = util.assign;
    const attr = util.attr;
    const css = util.css;
    const doc = util.doc;
    const docEl = util.docEl;
    const data = util.data;
    const getImage = util.getImage;
    const html = util.html;
    const index = util.index;
    const on = util.on;
    const pointerDown = util.pointerDown;
    const pointerMove = util.pointerMove;
    const removeClass = util.removeClass;
    const Transition = util.Transition;
    const trigger = util.trigger;

    UIkit.component('lightbox', {

      attrs: true,

      props: {
        animation: String,
        toggle: String,
        autoplay: Boolean,
        autoplayInterval: Number,
        videoAutoplay: Boolean,
      },

      defaults: {
        animation: undefined,
        toggle: 'a',
        autoplay: 0,
        videoAutoplay: false,
      },

      computed: {

        toggles: function toggles(ref, $el) {
          const this$1 = this;
          const toggle = ref.toggle;

          const toggles = $$(toggle, $el);

          this._changed = !this._toggles
                    || toggles.length !== this._toggles.length
                    || toggles.some((el, i) => el !== this$1._toggles[i]);

          return this._toggles = toggles;
        },

      },

      disconnected: function disconnected() {
        if (this.panel) {
          this.panel.$destroy(true);
          this.panel = null;
        }
      },

      events: [

        {

          name: 'click',

          delegate: function delegate() {
            return (`${this.toggle}:not(.uk-disabled)`);
          },

          handler: function handler(e) {
            e.preventDefault();
            e.current.blur();
            this.show(index(this.toggles, e.current));
          },

        },

      ],

      update: function update() {
        if (this.panel && this.animation) {
          this.panel.$props.animation = this.animation;
          this.panel.$emit();
        }

        if (!this.toggles.length || !this._changed || !this.panel) {
          return;
        }

        this.panel.$destroy(true);
        this._init();
      },

      methods: {

        _init: function _init() {
          return this.panel = this.panel || UIkit.lightboxPanel(assign({}, this.$props, {
            items: this.toggles.reduce((items, el) => {
              items.push(['href', 'caption', 'type', 'poster'].reduce((obj, attr) => {
                obj[attr === 'href' ? 'source' : attr] = data(el, attr);
                return obj;
              }, {}));
              return items;
            }, []),
          }));
        },

        show: function show(index) {
          if (!this.panel) {
            this._init();
          }

          return this.panel.show(index);
        },

        hide: function hide() {
          return this.panel && this.panel.hide();
        },

      },

    });

    UIkit.component('lightbox-panel', {

      mixins: [mixin.container, mixin.togglable, mixin.slideshow],

      functional: true,

      defaults: {
        preload: 1,
        videoAutoplay: false,
        delayControls: 3000,
        items: [],
        cls: 'uk-open',
        clsPage: 'uk-lightbox-page',
        selList: '.uk-lightbox-items',
        attrItem: 'uk-lightbox-item',
        initialAnimation: 'scale',
        pauseOnHover: false,
        velocity: 2,
        Animations: Animations$1(UIkit),
        template: '<div class="uk-lightbox uk-overflow-hidden"> <ul class="uk-lightbox-items"></ul> <div class="uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque"> <button class="uk-lightbox-toolbar-icon uk-close-large" type="button" uk-close uk-toggle="!.uk-lightbox"></button> </div> <a class="uk-lightbox-button uk-position-center-left uk-position-medium uk-transition-fade" href="#" uk-slidenav-previous uk-lightbox-item="previous"></a> <a class="uk-lightbox-button uk-position-center-right uk-position-medium uk-transition-fade" href="#" uk-slidenav-next uk-lightbox-item="next"></a> <div class="uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque"></div> </div>',
      },

      created: function created() {
        const this$1 = this;


        this.$mount(append(this.container, this.template));

        this.caption = $('.uk-lightbox-caption', this.$el);

        this.items.forEach((el, i) => append(this$1.list, '<li></li>'));
      },

      events: [

        {

          name: (`${pointerMove} ${pointerDown} keydown`),

          handler: 'showControls',

        },

        {

          name: 'click',

          self: true,

          delegate: function delegate() {
            return (`${this.selList} > *`);
          },

          handler: function handler(e) {
            e.preventDefault();
            this.hide();
          },

        },

        {

          name: 'show',

          self: true,

          handler: function handler() {
            addClass(docEl, this.clsPage);
          },
        },

        {

          name: 'shown',

          self: true,

          handler: 'showControls',
        },

        {

          name: 'hide',

          self: true,

          handler: 'hideControls',
        },

        {

          name: 'hidden',

          self: true,

          handler: function handler() {
            removeClass(docEl, this.clsPage);
          },
        },

        {

          name: 'keydown',

          el: function el() {
            return doc;
          },

          handler: function handler(e) {
            if (!this.isToggled(this.$el)) {
              return;
            }

            switch (e.keyCode) {
              case 27:
                this.hide();
                break;
              case 37:
                this.show('previous');
                break;
              case 39:
                this.show('next');
                break;
            }
          },
        },

        {

          name: 'toggle',

          handler: function handler(e) {
            e.preventDefault();
            this.toggle();
          },

        },

        {

          name: 'beforeitemshow',

          self: true,

          delegate: function delegate() {
            return (`${this.selList} > *`);
          },

          handler: function handler() {
            if (!this.isToggled()) {
              this.toggleNow(this.$el, true);
            }
          },

        },

        {

          name: 'itemshow',

          self: true,

          delegate: function delegate() {
            return (`${this.selList} > *`);
          },

          handler: function handler(ref) {
            const this$1 = this;
            const target = ref.target;


            let i = index(target),
              caption = this.getItem(i).caption;
            css(this.caption, 'display', caption ? '' : 'none');
            html(this.caption, caption);

            for (let j = 0; j <= this.preload; j++) {
              this$1.loadItem(this$1.getIndex(i + j));
              this$1.loadItem(this$1.getIndex(i - j));
            }
          },

        },

        {

          name: 'itemload',

          handler: function handler(_, item) {
            const this$1 = this;


            const source = item.source;
            const type = item.type;
            let matches;

            this.setItem(item, '<span uk-spinner></span>');

            if (!source) {
              return;
            }

            // Image
            if (type === 'image' || source.match(/\.(jp(e)?g|png|gif|svg)$/i)) {
              getImage(source).then(
                img => this$1.setItem(item, (`<img width="${img.width}" height="${img.height}" src="${source}">`)),
                () => this$1.setError(item)
              );

              // Video
            } else if (type === 'video' || source.match(/\.(mp4|webm|ogv)$/i)) {
              const video = $((`<video controls playsinline${item.poster ? (` poster="${item.poster}"`) : ''} uk-video="autoplay: ${this.videoAutoplay}"></video>`));
              attr(video, 'src', source);

              on(video, 'error', () => this$1.setError(item));
              on(video, 'loadedmetadata', () => {
                attr(video, { width: video.videoWidth, height: video.videoHeight });
                this$1.setItem(item, video);
              });

              // Iframe
            } else if (type === 'iframe') {
              this.setItem(item, (`<iframe class="uk-lightbox-iframe" src="${source}" frameborder="0" allowfullscreen></iframe>`));

              // Youtube
            } else if (matches = source.match(/\/\/.*?youtube\.[a-z]+\/watch\?v=([^&\s]+)/) || source.match(/youtu\.be\/(.*)/)) {
              let id = matches[1],
                setIframe = function (width, height) {
                  if (width === void 0) width = 640;
                  if (height === void 0) height = 450;

                  return this$1.setItem(item, getIframe((`//www.youtube.com/embed/${id}`), width, height, this$1.videoAutoplay));
                };

              getImage((`//img.youtube.com/vi/${id}/maxresdefault.jpg`)).then(
                (ref) => {
                  const width = ref.width;
                  const height = ref.height;

                  // youtube default 404 thumb, fall back to lowres
                  if (width === 120 && height === 90) {
                    getImage((`//img.youtube.com/vi/${id}/0.jpg`)).then(
                      (ref) => {
                        const width = ref.width;
                        const height = ref.height;

                        return setIframe(width, height);
                      },
                      setIframe
                    );
                  } else {
                    setIframe(width, height);
                  }
                },
                setIframe
              );

              // Vimeo
            } else if (matches = source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/)) {
              ajax((`//vimeo.com/api/oembed.json?maxwidth=1920&url=${encodeURI(source)}`), { responseType: 'json' })
                .then((ref) => {
                  const ref_response = ref.response;
                  const height = ref_response.height;
                  const width = ref_response.width;

                  return this$1.setItem(item, getIframe((`//player.vimeo.com/video/${matches[2]}`), width, height, this$1.videoAutoplay));
                });
            }
          },

        },

      ],

      methods: {

        toggle: function toggle() {
          return this.isToggled() ? this.hide() : this.show();
        },

        hide: function hide() {
          if (this.isToggled()) {
            this.toggleNow(this.$el, false);
          }

          removeClass(this.slides, this.clsActive);
          Transition.stop(this.slides);

          delete this.index;
          delete this.percent;
          delete this._animation;
        },

        loadItem: function loadItem(index) {
          if (index === void 0) index = this.index;


          const item = this.getItem(index);

          if (item.content) {
            return;
          }

          trigger(this.$el, 'itemload', [item]);
        },

        getItem: function getItem(index) {
          if (index === void 0) index = this.index;

          return this.items[index] || {};
        },

        setItem: function setItem(item, content) {
          assign(item, { content });
          const el = html(this.slides[this.items.indexOf(item)], content);
          trigger(this.$el, 'itemloaded', [this, el]);
          UIkit.update(null, el);
        },

        setError: function setError(item) {
          this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
        },

        showControls: function showControls() {
          clearTimeout(this.controlsTimer);
          this.controlsTimer = setTimeout(this.hideControls, this.delayControls);

          addClass(this.$el, 'uk-active uk-transition-active');
        },

        hideControls: function hideControls() {
          removeClass(this.$el, 'uk-active uk-transition-active');
        },

      },

    });

    function getIframe(src, width, height, autoplay) {
      return (`<iframe src="${src}" width="${width}" height="${height}" style="max-width: 100%; box-sizing: border-box;" frameborder="0" allowfullscreen uk-video="autoplay: ${autoplay}" uk-responsive></iframe>`);
    }
  }

  if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$2);
  }

  function plugin$4(UIkit) {
    if (plugin$4.installed) {
      return;
    }

    const ref = UIkit.util;
    const append = ref.append;
    const closest = ref.closest;
    const css = ref.css;
    const each = ref.each;
    const pointerEnter = ref.pointerEnter;
    const pointerLeave = ref.pointerLeave;
    const remove = ref.remove;
    const toFloat = ref.toFloat;
    const Transition = ref.Transition;
    const trigger = ref.trigger;
    const containers = {};

    UIkit.component('notification', {

      functional: true,

      args: ['message', 'status'],

      defaults: {
        message: '',
        status: '',
        timeout: 5000,
        group: null,
        pos: 'top-center',
        clsClose: 'uk-notification-close',
        clsMsg: 'uk-notification-message',
      },

      created: function created() {
        if (!containers[this.pos]) {
          containers[this.pos] = append(UIkit.container, (`<div class="uk-notification uk-notification-${this.pos}"></div>`));
        }

        const container = css(containers[this.pos], 'display', 'block');

        this.$mount(append(
          container,
          (`<div class="${this.clsMsg}${this.status ? (` ${this.clsMsg}-${this.status}`) : ''}"> <a href="#" class="${this.clsClose}" data-uk-close></a> <div>${this.message}</div> </div>`)
        ));
      },

      ready: function ready() {
        const this$1 = this;


        const marginBottom = toFloat(css(this.$el, 'marginBottom'));
        Transition.start(
          css(this.$el, { opacity: 0, marginTop: -1 * this.$el.offsetHeight, marginBottom: 0 }),
          { opacity: 1, marginTop: 0, marginBottom }
        ).then(() => {
          if (this$1.timeout) {
            this$1.timer = setTimeout(this$1.close, this$1.timeout);
          }
        });
      },

      events: (obj = {

        click: function click(e) {
          if (closest(e.target, 'a[href="#"]')) {
            e.preventDefault();
          }
          this.close();
        },

      }, obj[pointerEnter] = function () {
          if (this.timer) {
            clearTimeout(this.timer);
          }
        }, obj[pointerLeave] = function () {
          if (this.timeout) {
            this.timer = setTimeout(this.close, this.timeout);
          }
        }, obj),

      methods: {

        close: function close(immediate) {
          const this$1 = this;


          const removeFn = function () {
            trigger(this$1.$el, 'close', [this$1]);
            remove(this$1.$el);

            if (!containers[this$1.pos].children.length) {
              css(containers[this$1.pos], 'display', 'none');
            }
          };

          if (this.timer) {
            clearTimeout(this.timer);
          }

          if (immediate) {
            removeFn();
          } else {
            Transition.start(this.$el, {
              opacity: 0,
              marginTop: -1 * this.$el.offsetHeight,
              marginBottom: 0,
            }).then(removeFn);
          }
        },

      },

    });
    let obj;

    UIkit.notification.closeAll = function (group, immediate) {
      each(UIkit.instances, (component) => {
        if (component.$options.name === 'notification' && (!group || group === component.group)) {
          component.close(immediate);
        }
      });
    };
  }

  if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$4);
  }

  function plugin$5(UIkit) {
    if (plugin$5.installed) {
      return;
    }

    const mixin = UIkit.mixin;
    const util = UIkit.util;
    const clamp = util.clamp;
    const css = util.css;
    const Dimensions = util.Dimensions;
    const each = util.each;
    const getImage = util.getImage;
    const includes = util.includes;
    const isNumber = util.isNumber;
    const isUndefined = util.isUndefined;
    const scrolledOver = util.scrolledOver;
    const toFloat = util.toFloat;
    const query = util.query;
    const win = util.win;

    const props = ['x', 'y', 'bgx', 'bgy', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity'];

    mixin.parallax = {

      props: props.reduce((props, prop) => {
        props[prop] = 'list';
        return props;
      }, {
        media: 'media',
      }),

      defaults: props.reduce((defaults, prop) => {
        defaults[prop] = undefined;
        return defaults;
      }, {
        media: false,
      }),

      computed: {

        props: function props$1(properties, $el) {
          const this$1 = this;


          return props.reduce((props, prop) => {
            if (isUndefined(properties[prop])) {
              return props;
            }

            let isColor = prop.match(/color/i),
              isCssProp = isColor || prop === 'opacity',
              steps = properties[prop].slice(0),
              pos,
              diff;

            if (isCssProp) {
              css($el, prop, '');
            }

            if (steps.length < 2) {
              steps.unshift((prop === 'scale'
                ? 1
                : isCssProp
                  ? css($el, prop)
                  : 0) || 0);
            }

            const unit = includes(steps.join(''), '%') ? '%' : 'px';

            if (isColor) {
              const color = $el.style.color;
              steps = steps.map(step => parseColor($el, step));
              $el.style.color = color;
            } else {
              steps = steps.map(toFloat);
            }

            if (prop.match(/^bg/)) {
              if (this$1.covers) {
                let min = Math.min(...steps),
                  max = Math.max(...steps);

                steps = steps.map(step => step - min);
                diff = max - min;
                pos = `${-1 * Math.max(...steps)}px`;
              } else {
                css($el, (`background-position-${prop[2]}`), '');
                pos = css($el, 'backgroundPosition').split(' ')[prop[2] === 'x' ? 0 : 1]; // IE 11 can't read background-position-[x|y]
              }
            }

            props[prop] = {
              steps, unit, pos, diff,
            };

            return props;
          }, {});
        },

        bgProps: function bgProps() {
          const this$1 = this;

          return ['bgx', 'bgy'].filter(bg => bg in this$1.props);
        },

        covers: function covers(_, $el) {
          return css($el.style.backgroundSize !== '' ? css($el, 'backgroundSize', '') : $el, 'backgroundSize') === 'cover';
        },

      },

      disconnected: function disconnected() {
        delete this._image;
      },

      update: [

        {

          read: function read() {
            const this$1 = this;


            delete this._computeds.props;

            this._active = !this.media || win.matchMedia(this.media).matches;

            if (this._image) {
              this._image.dimEl = {
                width: this.$el.offsetWidth,
                height: this.$el.offsetHeight,
              };
            }

            if (!isUndefined(this._image) || !this.covers || !this.bgProps.length) {
              return;
            }

            const src = css(this.$el, 'backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

            if (!src) {
              return;
            }

            this._image = false;

            getImage(src).then((img) => {
              this$1._image = {
                width: img.naturalWidth,
                height: img.naturalHeight,
              };

              this$1.$emit();
            });
          },

          write: function write() {
            const this$1 = this;


            if (!this._image) {
              return;
            }

            if (!this._active) {
              css(this.$el, { backgroundSize: '', backgroundRepeat: '' });
              return;
            }

            let image = this._image,
              dimEl = image.dimEl,
              dim = Dimensions.cover(image, dimEl);

            this.bgProps.forEach((prop) => {
              const ref = this$1.props[prop];
              const diff = ref.diff;
              let attr = prop === 'bgy' ? 'height' : 'width',
                span = dim[attr] - dimEl[attr];

              if (span < diff) {
                dimEl[attr] = dim[attr] + diff - span;
              }

              dim = Dimensions.cover(image, dimEl);
            });

            css(this.$el, {
              backgroundSize: (`${dim.width}px ${dim.height}px`),
              backgroundRepeat: 'no-repeat',
            });
          },

          events: ['load', 'resize'],

        },

      ],

      methods: {

        reset: function reset() {
          const this$1 = this;

          each(this.getCss(0), (_, prop) => css(this$1.$el, prop, ''));
        },

        getCss: function getCss(percent) {
          let translated = false,
            props = this.props;

          return Object.keys(props).reduce((css, prop) => {
            const ref = props[prop];
            const steps = ref.steps;
            const unit = ref.unit;
            const pos = ref.pos;
            const value = getValue(steps, percent);

            switch (prop) {
              // transforms
              case 'x':
              case 'y':

                if (translated) {
                  break;
                }

                var ref$1 = ['x', 'y'].map(dir => (prop === dir
                  ? value + unit
                  : props[dir]
                    ? getValue(props[dir].steps, percent) + props[dir].unit
                    : 0));
                var x = ref$1[0];
                var y = ref$1[1];

                translated = css.transform += ` translate3d(${x}, ${y}, 0)`;
                break;
              case 'rotate':
                css.transform += ` rotate(${value}deg)`;
                break;
              case 'scale':
                css.transform += ` scale(${value})`;
                break;

                // bg image
              case 'bgy':
              case 'bgx':
                css[(`background-position-${prop[2]}`)] = `calc(${pos} + ${value + unit})`;
                break;

                // color
              case 'color':
              case 'backgroundColor':
              case 'borderColor':

                var ref$2 = getStep(steps, percent);
                var start = ref$2[0];
                var end = ref$2[1];
                var p = ref$2[2];

                css[prop] = `rgba(${start.map((value, i) => {
                  value += p * (end[i] - value);
                  return i === 3 ? toFloat(value) : parseInt(value, 10);
                }).join(',')})`;
                break;

                // CSS Filter
              case 'blur':
                css.filter += ` blur(${value}px)`;
                break;
              case 'hue':
                css.filter += ` hue-rotate(${value}deg)`;
                break;
              case 'fopacity':
                css.filter += ` opacity(${value}%)`;
                break;
              case 'grayscale':
              case 'invert':
              case 'saturate':
              case 'sepia':
                css.filter += ` ${prop}(${value}%)`;
                break;

              default:
                css[prop] = value;
            }

            return css;
          }, { transform: '', filter: '' });
        },

      },

    };

    UIkit.component('parallax', {

      mixins: [mixin.parallax],

      props: {
        target: String,
        viewport: Number,
        easing: Number,
      },

      defaults: {
        target: false,
        viewport: 1,
        easing: 1,
      },

      computed: {

        target: function target(ref, $el) {
          const target = ref.target;

          return target && query(target, $el) || $el;
        },

      },

      disconnected: function disconnected() {
        delete this._prev;
      },

      update: [

        {

          read: function read() {
            delete this._prev;
          },

        },

        {

          read: function read() {
            this._percent = ease(scrolledOver(this.target) / (this.viewport || 1), this.easing);
          },

          write: function write() {
            if (!this._active) {
              this.reset();
              return;
            }

            if (this._prev !== this._percent) {
              css(this.$el, this.getCss(this._percent));
              this._prev = this._percent;
            }
          },

          events: ['scroll', 'load', 'resize'],
        },

      ],

    });

    function ease(percent, easing) {
      return clamp(percent * (1 - (easing - easing * percent)));
    }

    function parseColor(el, color) {
      return css(css(el, 'color', color), 'color').split(/[(),]/g).slice(1, -1).concat(1)
        .slice(0, 4)
        .map(n => toFloat(n));
    }

    function getStep(steps, percent) {
      let count = steps.length - 1,
        index = Math.min(Math.floor(count * percent), count - 1),
        step = steps.slice(index, index + 2);

      step.push(percent === 1 ? 1 : percent % (1 / count) * count);

      return step;
    }

    function getValue(steps, percent) {
      const ref = getStep(steps, percent);
      const start = ref[0];
      const end = ref[1];
      const p = ref[2];
      return (isNumber(start)
        ? start + Math.abs(start - end) * p * (start < end ? 1 : -1)
        : +end
      ).toFixed(2);
    }
  }

  if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$5);
  }

  const Animations$2 = function (UIkit) {
    const mixin = UIkit.mixin;
    const ref = UIkit.util;
    const assign = ref.assign;
    const css = ref.css;

    var Animations$$1 = assign({}, mixin.slideshow.defaults.Animations, {

      fade: {

        show: function show() {
          return [
            { opacity: 0, zIndex: 0 },
            { zIndex: -1 },
          ];
        },

        percent: function percent(current) {
          return 1 - css(current, 'opacity');
        },

        translate: function translate$$1(percent) {
          return [
            { opacity: 1 - percent, zIndex: 0 },
            { zIndex: -1 },
          ];
        },

      },

      scale: {

        show: function show() {
          return [
            { opacity: 0, transform: scale3d(1 + 0.5), zIndex: 0 },
            { zIndex: -1 },
          ];
        },

        percent: function percent(current) {
          return 1 - css(current, 'opacity');
        },

        translate: function translate$$1(percent) {
          return [
            { opacity: 1 - percent, transform: scale3d(1 + 0.5 * percent), zIndex: 0 },
            { zIndex: -1 },
          ];
        },

      },

      pull: {

        show: function show(dir) {
          return dir < 0
            ? [
              { transform: translate(30), zIndex: -1 },
              { transform: translate(), zIndex: 0 }]
            : [
              { transform: translate(-100), zIndex: 0 },
              { transform: translate(), zIndex: -1 },
            ];
        },

        percent: function percent(current) {
          return Animations$$1.translated(current);
        },

        translate: function translate$1(percent, dir) {
          return dir < 0
            ? [
              { transform: translate(30 * percent), zIndex: -1 },
              { transform: translate(-100 * (1 - percent)), zIndex: 0 }]
            : [
              { transform: translate(-percent * 100), zIndex: 0 },
              { transform: translate(30 * (1 - percent)), zIndex: -1 },
            ];
        },

      },

      push: {

        show: function show(dir) {
          return dir < 0
            ? [
              { transform: translate(100), zIndex: 0 },
              { transform: translate(), zIndex: -1 }]
            : [
              { transform: translate(-30), zIndex: -1 },
              { transform: translate(), zIndex: 0 },
            ];
        },

        percent: function percent(current, next) {
          return 1 - Animations$$1.translated(next);
        },

        translate: function translate$2(percent, dir) {
          return dir < 0
            ? [
              { transform: translate(percent * 100), zIndex: 0 },
              { transform: translate(-30 * (1 - percent)), zIndex: -1 }]
            : [
              { transform: translate(-30 * percent), zIndex: -1 },
              { transform: translate(100 * (1 - percent)), zIndex: 0 },
            ];
        },

      },

    });

    return Animations$$1;
  };

  function plugin$6(UIkit) {
    if (plugin$6.installed) {
      return;
    }

    UIkit.use(plugin$5);
    UIkit.use(plugin$3);

    const mixin = UIkit.mixin;
    const ref = UIkit.util;
    const closest = ref.closest;
    const css = ref.css;
    const fastdom = ref.fastdom;
    const endsWith = ref.endsWith;
    const height = ref.height;
    const noop = ref.noop;
    const Transition = ref.Transition;

    UIkit.component('slideshow', {

      mixins: [mixin.class, mixin.slideshow],

      props: {
        ratio: String,
        minHeight: Boolean,
        maxHeight: Boolean,
      },

      defaults: {
        ratio: '16:9',
        minHeight: false,
        maxHeight: false,
        selList: '.uk-slideshow-items',
        attrItem: 'uk-slideshow-item',
        Animations: Animations$2(UIkit),
      },

      ready: function ready() {
        const this$1 = this;

        fastdom.mutate(() => this$1.show(this$1.index));
      },

      update: {

        read: function read() {
          const ref = this.ratio.split(':').map(Number);
          const width = ref[0];
          const height = ref[1];
          this.height = height * this.$el.offsetWidth / width;

          if (this.minHeight) {
            this.height = Math.max(this.minHeight, this.height);
          }

          if (this.maxHeight) {
            this.height = Math.min(this.maxHeight, this.height);
          }
        },

        write: function write() {
          height(this.list, Math.floor(this.height));
        },

        events: ['load', 'resize'],

      },

    });

    UIkit.component('slideshow-parallax', {

      mixins: [mixin.parallax],

      computed: {

        item: function item() {
          const slideshow = UIkit.getComponent(closest(this.$el, '.uk-slideshow'), 'slideshow');
          return slideshow && closest(this.$el, (`${slideshow.selList} > *`));
        },

      },

      events: [

        {

          name: 'itemshown',

          self: true,

          el: function el() {
            return this.item;
          },

          handler: function handler() {
            css(this.$el, this.getCss(0.5));
          },

        },

        {
          name: 'itemin itemout',

          self: true,

          el: function el() {
            return this.item;
          },

          handler: function handler(ref) {
            const type = ref.type;
            const ref_detail = ref.detail;
            const percent = ref_detail.percent;
            const duration = ref_detail.duration;
            const ease = ref_detail.ease;
            const dir = ref_detail.dir;


            Transition.cancel(this.$el);
            css(this.$el, this.getCss(getCurrent(type, dir, percent)));

            Transition.start(this.$el, this.getCss(isIn(type)
              ? 0.5
              : dir > 0
                ? 1
                : 0), duration, ease).catch(noop);
          },
        },

        {
          name: 'transitioncanceled transitionend',

          self: true,

          el: function el() {
            return this.item;
          },

          handler: function handler() {
            Transition.cancel(this.$el);
          },

        },

        {
          name: 'itemtranslatein itemtranslateout',

          self: true,

          el: function el() {
            return this.item;
          },

          handler: function handler(ref) {
            const type = ref.type;
            const ref_detail = ref.detail;
            const percent = ref_detail.percent;
            const dir = ref_detail.dir;

            Transition.cancel(this.$el);
            css(this.$el, this.getCss(getCurrent(type, dir, percent)));
          },
        },

      ],

    });

    function isIn(type) {
      return endsWith(type, 'in');
    }

    function getCurrent(type, dir, percent) {
      percent /= 2;

      return !isIn(type)
        ? dir < 0
          ? percent
          : 1 - percent
        : dir < 0
          ? 1 - percent
          : percent;
    }
  }

  if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$6);
  }

  function plugin$7(UIkit) {
    if (plugin$7.installed) {
      return;
    }

    const mixin = UIkit.mixin;
    const util = UIkit.util;
    const $$ = util.$$;
    const addClass = util.addClass;
    const after = util.after;
    const assign = util.assign;
    const append = util.append;
    const attr = util.attr;
    const before = util.before;
    const closest = util.closest;
    const css = util.css;
    const doc = util.doc;
    const docEl = util.docEl;
    const height = util.height;
    const fastdom = util.fastdom;
    const getPos = util.getPos;
    const includes = util.includes;
    const index = util.index;
    const isInput = util.isInput;
    const noop = util.noop;
    const offset = util.offset;
    const off = util.off;
    const on = util.on;
    const pointerDown = util.pointerDown;
    const pointerMove = util.pointerMove;
    const pointerUp = util.pointerUp;
    const position = util.position;
    const preventClick = util.preventClick;
    const Promise = util.Promise;
    const remove = util.remove;
    const removeClass = util.removeClass;
    const toggleClass = util.toggleClass;
    const toNodes = util.toNodes;
    const Transition = util.Transition;
    const trigger = util.trigger;
    const win = util.win;
    const within = util.within;

    UIkit.component('sortable', {

      mixins: [mixin.class],

      props: {
        group: String,
        animation: Number,
        threshold: Number,
        clsItem: String,
        clsPlaceholder: String,
        clsDrag: String,
        clsDragState: String,
        clsBase: String,
        clsNoDrag: String,
        clsEmpty: String,
        clsCustom: String,
        handle: String,
      },

      defaults: {
        group: false,
        animation: 150,
        threshold: 5,
        clsItem: 'uk-sortable-item',
        clsPlaceholder: 'uk-sortable-placeholder',
        clsDrag: 'uk-sortable-drag',
        clsDragState: 'uk-drag',
        clsBase: 'uk-sortable',
        clsNoDrag: 'uk-sortable-nodrag',
        clsEmpty: 'uk-sortable-empty',
        clsCustom: '',
        handle: false,
      },

      init: function init() {
        const this$1 = this;

        ['init', 'start', 'move', 'end'].forEach((key) => {
          const fn = this$1[key];
          this$1[key] = function (e) {
            this$1.scrollY = win.scrollY;
            const ref = getPos(e);
            const x = ref.x;
            const y = ref.y;
            this$1.pos = { x, y };

            fn(e);
          };
        });
      },

      events: (obj = {}, obj[pointerDown] = 'init', obj),

      update: {

        write: function write() {
          if (this.clsEmpty) {
            toggleClass(this.$el, this.clsEmpty, !this.$el.children.length);
          }

          if (!this.drag) {
            return;
          }

          offset(this.drag, { top: this.pos.y + this.origin.top, left: this.pos.x + this.origin.left });

          let top = offset(this.drag).top,
            bottom = top + this.drag.offsetHeight,
            scroll;

          if (top > 0 && top < this.scrollY) {
            scroll = this.scrollY - 5;
          } else if (bottom < height(doc) && bottom > height(win) + this.scrollY) {
            scroll = this.scrollY + 5;
          }

          scroll && setTimeout(() => win.scrollTo(win.scrollX, scroll), 5);
        },

      },

      methods: {

        init: function init(e) {
          const target = e.target;
          const button = e.button;
          const defaultPrevented = e.defaultPrevented;
          const placeholder = toNodes(this.$el.children).filter(el => within(target, el))[0];

          if (!placeholder
                    || isInput(e.target)
                    || this.handle && !within(target, this.handle)
                    || button !== 0
                    || within(target, (`.${this.clsNoDrag}`))
                    || defaultPrevented
          ) {
            return;
          }

          e.preventDefault();

          this.touched = [this];
          this.placeholder = placeholder;
          this.origin = assign({ target, index: index(placeholder) }, this.pos);

          on(docEl, pointerMove, this.move);
          on(docEl, pointerUp, this.end);
          on(win, 'scroll', this.scroll);

          if (!this.threshold) {
            this.start(e);
          }
        },

        start: function start(e) {
          this.drag = append(UIkit.container, this.placeholder.outerHTML.replace(/^<li/i, '<div').replace(/li>$/i, 'div>'));

          css(this.drag, assign({
            boxSizing: 'border-box',
            width: this.placeholder.offsetWidth,
            height: this.placeholder.offsetHeight,
          }, css(this.placeholder, ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'])));
          attr(this.drag, 'uk-no-boot', '');
          addClass(this.drag, (`${this.clsDrag} ${this.clsCustom}`));

          height(this.drag.firstElementChild, height(this.placeholder.firstElementChild));

          const ref = offset(this.placeholder);
          const left = ref.left;
          const top = ref.top;
          assign(this.origin, { left: left - this.pos.x, top: top - this.pos.y });

          addClass(this.placeholder, this.clsPlaceholder);
          addClass(this.$el.children, this.clsItem);
          addClass(docEl, this.clsDragState);

          trigger(this.$el, 'start', [this, this.placeholder, this.drag]);

          this.move(e);
        },

        move: function move(e) {
          if (!this.drag) {
            if (Math.abs(this.pos.x - this.origin.x) > this.threshold || Math.abs(this.pos.y - this.origin.y) > this.threshold) {
              this.start(e);
            }

            return;
          }

          this.$emit();

          let target = e.type === 'mousemove' ? e.target : doc.elementFromPoint(this.pos.x - doc.body.scrollLeft, this.pos.y - doc.body.scrollTop),
            sortable = getSortable(target),
            previous = getSortable(this.placeholder),
            move = sortable !== previous;

          if (!sortable || within(target, this.placeholder) || move && (!sortable.group || sortable.group !== previous.group)) {
            return;
          }

          target = sortable.$el === target.parentNode && target || toNodes(sortable.$el.children).filter(element => within(target, element))[0];

          if (move) {
            previous.remove(this.placeholder);
          } else if (!target) {
            return;
          }

          sortable.insert(this.placeholder, target);

          if (!includes(this.touched, sortable)) {
            this.touched.push(sortable);
          }
        },

        scroll: function scroll() {
          const scroll = win.scrollY;
          if (scroll !== this.scrollY) {
            this.pos.y += scroll - this.scrollY;
            this.scrollY = scroll;
            this.$emit();
          }
        },

        end: function end(e) {
          off(docEl, pointerMove, this.move);
          off(docEl, pointerUp, this.end);
          off(win, 'scroll', this.scroll);

          if (!this.drag) {
            if (e.type !== 'mouseup' && within(e.target, 'a[href]')) {
              location.href = closest(e.target, 'a[href]').href;
            }

            return;
          }

          preventClick();

          const sortable = getSortable(this.placeholder);

          if (this === sortable) {
            if (this.origin.index !== index(this.placeholder)) {
              trigger(this.$el, 'change', [this, this.placeholder, 'moved']);
            }
          } else {
            trigger(sortable.$el, 'change', [sortable, this.placeholder, 'added']);
            trigger(this.$el, 'change', [this, this.placeholder, 'removed']);
          }

          trigger(this.$el, 'stop', [this]);

          remove(this.drag);
          this.drag = null;

          const classes = this.touched.map(sortable => (`${sortable.clsPlaceholder} ${sortable.clsItem}`)).join(' ');
          this.touched.forEach(sortable => removeClass(sortable.$el.children, classes));

          removeClass(docEl, this.clsDragState);
        },

        insert: function insert(element, target) {
          const this$1 = this;


          addClass(this.$el.children, this.clsItem);

          const insert = function () {
            if (target) {
              if (!within(element, this$1.$el) || $$('-', element).some(element => element === target)) {
                before(target, element);
              } else {
                after(target, element);
              }
            } else {
              append(this$1.$el, element);
            }
          };

          if (this.animation) {
            this.animate(insert);
          } else {
            insert();
          }
        },

        remove: function remove$1(element) {
          if (!within(element, this.$el)) {
            return;
          }

          if (this.animation) {
            this.animate(() => remove(element));
          } else {
            remove(element);
          }
        },

        animate: function animate(action) {
          const this$1 = this;


          let props = [],
            children = toNodes(this.$el.children),
            reset = {
              position: '', width: '', height: '', pointerEvents: '', top: '', left: '', bottom: '', right: '',
            };

          children.forEach((el) => {
            props.push(assign({
              position: 'absolute',
              pointerEvents: 'none',
              width: el.offsetWidth,
              height: el.offsetHeight,
            }, position(el)));
          });

          action();

          children.forEach(Transition.cancel);
          css(children, reset);
          this.$update('update', true);
          fastdom.flush();

          css(this.$el, 'minHeight', height(this.$el));

          const positions = children.map(el => position(el));
          Promise.all(children.map((el, i) => Transition.start(css(el, props[i]), positions[i], this$1.animation)))
            .then(() => {
              css(this$1.$el, 'minHeight', '');
              css(children, reset);
              this$1.$update('update', true);
              fastdom.flush();
            }, noop);
        },

      },

    });
    let obj;

    function getSortable(element) {
      return UIkit.getComponent(element, 'sortable') || element.parentNode && getSortable(element.parentNode);
    }
  }

  if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$7);
  }

  function plugin$8(UIkit) {
    if (plugin$8.installed) {
      return;
    }

    const util = UIkit.util;
    const mixin = UIkit.mixin;
    const append = util.append;
    const attr = util.attr;
    const doc = util.doc;
    const fastdom = util.fastdom;
    const flipPosition = util.flipPosition;
    const includes = util.includes;
    const isTouch = util.isTouch;
    const isVisible = util.isVisible;
    const matches = util.matches;
    const on = util.on;
    const pointerDown = util.pointerDown;
    const pointerEnter = util.pointerEnter;
    const pointerLeave = util.pointerLeave;
    const remove = util.remove;
    const within = util.within;

    const actives = [];

    UIkit.component('tooltip', {

      attrs: true,

      mixins: [mixin.container, mixin.togglable, mixin.position],

      props: {
        delay: Number,
        title: String,
      },

      defaults: {
        pos: 'top',
        title: '',
        delay: 0,
        animation: ['uk-animation-scale-up'],
        duration: 100,
        cls: 'uk-active',
        clsPos: 'uk-tooltip',
      },

      connected: function connected() {
        const this$1 = this;

        fastdom.mutate(() => attr(this$1.$el, { title: null, 'aria-expanded': false }));
      },

      disconnected: function disconnected() {
        this.hide();
      },

      methods: {

        show: function show() {
          const this$1 = this;


          if (includes(actives, this)) {
            return;
          }

          actives.forEach(active => active.hide());
          actives.push(this);

          this._unbind = on(doc, 'click', e => !within(e.target, this$1.$el) && this$1.hide());

          clearTimeout(this.showTimer);

          this.tooltip = append(this.container, (`<div class="${this.clsPos}" aria-hidden><div class="${this.clsPos}-inner">${this.title}</div></div>`));

          attr(this.$el, 'aria-expanded', true);

          this.positionAt(this.tooltip, this.$el);

          this.origin = this.getAxis() === 'y' ? (`${flipPosition(this.dir)}-${this.align}`) : (`${this.align}-${flipPosition(this.dir)}`);

          this.showTimer = setTimeout(() => {
            this$1.toggleElement(this$1.tooltip, true);

            this$1.hideTimer = setInterval(() => {
              if (!isVisible(this$1.$el)) {
                this$1.hide();
              }
            }, 150);
          }, this.delay);
        },

        hide: function hide() {
          const index = actives.indexOf(this);

          if (!~index || matches(this.$el, 'input') && this.$el === doc.activeElement) {
            return;
          }

          actives.splice(index, 1);

          clearTimeout(this.showTimer);
          clearInterval(this.hideTimer);
          attr(this.$el, 'aria-expanded', false);
          this.toggleElement(this.tooltip, false);
          this.tooltip && remove(this.tooltip);
          this.tooltip = false;
          this._unbind();
        },

      },

      events: (obj = {

        blur: 'hide',

      }, obj[(`focus ${pointerEnter} ${pointerDown}`)] = function (e) {
          if (e.type !== pointerDown || !isTouch(e)) {
            this.show();
          }
        }, obj[pointerLeave] = function (e) {
          if (!isTouch(e)) {
            this.hide();
          }
        }, obj),

    });
    let obj;
  }

  if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$8);
  }

  function plugin$9(UIkit) {
    if (plugin$9.installed) {
      return;
    }

    const ref = UIkit.util;
    const addClass = ref.addClass;
    const ajax = ref.ajax;
    const matches = ref.matches;
    const noop = ref.noop;
    const removeClass = ref.removeClass;
    const trigger = ref.trigger;

    UIkit.component('upload', {

      props: {
        allow: String,
        clsDragover: String,
        concurrent: Number,
        mime: String,
        msgInvalidMime: String,
        msgInvalidName: String,
        multiple: Boolean,
        name: String,
        params: Object,
        type: String,
        url: String,
      },

      defaults: {
        allow: false,
        clsDragover: 'uk-dragover',
        concurrent: 1,
        mime: false,
        msgInvalidMime: 'Invalid File Type: %s',
        msgInvalidName: 'Invalid File Name: %s',
        multiple: false,
        name: 'files[]',
        params: {},
        type: 'POST',
        url: '',
        abort: noop,
        beforeAll: noop,
        beforeSend: noop,
        complete: noop,
        completeAll: noop,
        error: noop,
        fail: noop,
        load: noop,
        loadEnd: noop,
        loadStart: noop,
        progress: noop,
      },

      events: {

        change: function change(e) {
          if (!matches(e.target, 'input[type="file"]')) {
            return;
          }

          e.preventDefault();

          if (e.target.files) {
            this.upload(e.target.files);
          }

          e.target.value = '';
        },

        drop: function drop(e) {
          stop(e);

          const transfer = e.dataTransfer;

          if (!transfer || !transfer.files) {
            return;
          }

          removeClass(this.$el, this.clsDragover);

          this.upload(transfer.files);
        },

        dragenter: function dragenter(e) {
          stop(e);
        },

        dragover: function dragover(e) {
          stop(e);
          addClass(this.$el, this.clsDragover);
        },

        dragleave: function dragleave(e) {
          stop(e);
          removeClass(this.$el, this.clsDragover);
        },

      },

      methods: {

        upload: function upload(files) {
          const this$1 = this;


          if (!files.length) {
            return;
          }

          trigger(this.$el, 'upload', [files]);

          for (let i = 0; i < files.length; i++) {
            if (this$1.allow) {
              if (!match(this$1.allow, files[i].name)) {
                this$1.fail(this$1.msgInvalidName.replace(/%s/, this$1.allow));
                return;
              }
            }

            if (this$1.mime) {
              if (!match(this$1.mime, files[i].type)) {
                this$1.fail(this$1.msgInvalidMime.replace(/%s/, this$1.mime));
                return;
              }
            }
          }

          if (!this.multiple) {
            files = [files[0]];
          }

          this.beforeAll(this, files);

          var chunks = chunk(files, this.concurrent),
            upload = function (files) {
              const data = new FormData();

              files.forEach(file => data.append(this$1.name, file));

              for (const key in this$1.params) {
                data.append(key, this$1.params[key]);
              }

              ajax(this$1.url, {
                data,
                method: this$1.type,
                beforeSend(env) {
                  const xhr = env.xhr;
                  xhr.upload && xhr.upload.addEventListener('progress', this$1.progress);
                  ['loadStart', 'load', 'loadEnd', 'abort'].forEach(type => xhr.addEventListener(type.toLowerCase(), this$1[type]));

                  this$1.beforeSend(env);
                },
              }).then((xhr) => {
                this$1.complete(xhr);

                if (chunks.length) {
                  upload(chunks.shift());
                } else {
                  this$1.completeAll(xhr);
                }
              }, (e) => {
                this$1.error(e.message);
              });
            };

          upload(chunks.shift());
        },

      },

    });

    function match(pattern, path) {
      return path.match(new RegExp((`^${pattern.replace(/\//g, '\\/').replace(/\*\*/g, '(\\/[^\\/]+)*').replace(/\*/g, '[^\\/]+').replace(/((?!\\))\?/g, '$1.')}$`), 'i'));
    }

    function chunk(files, size) {
      const chunks = [];
      for (let i = 0; i < files.length; i += size) {
        const chunk = [];
        for (let j = 0; j < size; j++) {
          chunk.push(files[i + j]);
        }
        chunks.push(chunk);
      }
      return chunks;
    }

    function stop(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$9);
  }

  UIkit$2.use(plugin);
  UIkit$2.use(plugin$1);
  UIkit$2.use(plugin$2);
  UIkit$2.use(plugin$4);
  UIkit$2.use(plugin$5);
  UIkit$2.use(plugin$6);
  UIkit$2.use(plugin$7);
  UIkit$2.use(plugin$8);
  UIkit$2.use(plugin$9);

  {
    boot(UIkit$2);
  }

  return UIkit$2;
})));
