/// <reference path="./eventable.d.ts" />
define("eventable", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    //     Backbone.js 1.1.2
    //     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
    //     Backbone may be freely distributed under the MIT license.
    //     For all details and documentation:
    //     http://backbonejs.org
    // eventable.js 1.0
    // (c) 2017-2020 Jingyuan Jiang <appleskiller@163.com>
    // 感谢Backbone的原作者
    // https://github.com/appleskiller/eventable/
    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;
    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function (obj, action, name, rest) {
        if (!name)
            return true;
        // Handle event maps.
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
            return false;
        }
        // Handle space separated event names.
        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, length = names.length; i < length; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
            return false;
        }
        return true;
    };
    // A difficult-to-believe, but optimized internal dispatch function for
    // triggering events. Tries to keep the usual cases speedy (most internal
    // Backbone events have 3 arguments).
    var triggerEvents = function (events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
            case 0:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx);
                return;
            case 1:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx, a1);
                return;
            case 2:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx, a1, a2);
                return;
            case 3:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                return;
            default:
                while (++i < l)
                    (ev = events[i]).callback.apply(ev.ctx, args);
                return;
        }
    };
    /**
     * Dispatcher类在Backbone.Events的基础上增加了priority参数以及hasListener方法。
     * 同时，Dispatcher类将可以直接使用在Typescript中
     * @export
     * @class Dispatcher
     */
    var Dispatcher = (function () {
        function Dispatcher() {
        }
        // Bind an event to a `callback` function. Passing `"all"` will bind
        // the callback to all events fired.
        /**
         * 绑定指定事件到一个处理函数；
         * 对于特殊的“all”类型的事件处理函数，任何事件发生都会被触发
         * 越高优先级的监听器越先被处理
         * 此函数具有两种函数签名
         * on(name: string , callback: any , context?: any , priority?: number);
         * on(name: Name , context?: any , priority);
         *
         * @param {(string|Name)} name
         * @param {*} [callback]
         * @param {*} [context]
         * @param {number} [priority]
         * @returns
         *
         * @memberOf Dispatcher
         */
        Dispatcher.prototype.on = function (name, callback, context, priority) {
            if (!eventsApi(this, 'on', name, [callback, context, priority]) || !callback)
                return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            priority = _.isUndefined(priority) ? 0 : priority;
            var item = { callback: callback, context: context, priority: priority, ctx: context || this };
            if (events.length) {
                for (var i = events.length - 1; i >= 0; i--) {
                    if (events[i].priority >= item.priority) {
                        events.splice(i + 1, 0, item);
                        break;
                    }
                }
            }
            else {
                events.push(item);
            }
            return this;
        };
        // Bind an event to only be triggered a single time. After the first time
        // the callback is invoked, it will be removed.
        /**
         * 一次性的绑定指定事件到一个处理函数；
         * 一旦事件被处理就立刻被移除。
         * 越高优先级的监听器越先被处理
         * 此函数具有两种函数签名
         * once(name: string , callback: any , context?: any , priority?: number);
         * once(name: Name , context?: any , priority);
         *
         * @param {(string|Name)} name
         * @param {*} [callback]
         * @param {*} [context]
         * @param {number} [priority]
         * @returns
         *
         * @memberOf Dispatcher
         */
        Dispatcher.prototype.once = function (name, callback, context, priority) {
            if (!eventsApi(this, 'once', name, [callback, context, priority]) || !callback)
                return this;
            var self = this;
            var once = _.once(function () {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context, priority);
        };
        // Remove one or many callbacks. If `context` is null, removes all
        // callbacks with that function. If `callback` is null, removes all
        // callbacks for the event. If `name` is null, removes all bound
        // callbacks for all events.
        /**
         * 移除一个或多个响应函数。
         * 此函数具有两种函数签名
         * once(name: string , callback: any , context?: any);
         * once(name: Name , context?: any);
         * @param {(string|Name)} [name]
         * @param {*} [callback]
         * @param {*} [context]
         * @returns
         *
         * @memberOf Dispatcher
         */
        Dispatcher.prototype.off = function (name, callback, context) {
            if (!this._events || !eventsApi(this, 'off', name, [callback, context]))
                return this;
            // Remove all callbacks for all events.
            if (!name && !callback && !context) {
                this._events = void 0;
                return this;
            }
            var names = name ? [name] : _.keys(this._events);
            for (var i = 0, length = names.length; i < length; i++) {
                name = names[i];
                // Bail out if there are no events stored.
                var events = this._events[name];
                if (!events)
                    continue;
                // Remove all callbacks for this event.
                if (!callback && !context) {
                    delete this._events[name];
                    continue;
                }
                // Find any remaining events.
                var remaining = [];
                for (var j = 0, k = events.length; j < k; j++) {
                    var event = events[j];
                    if (callback && callback !== event.callback &&
                        callback !== event.callback._callback ||
                        context && context !== event.context) {
                        remaining.push(event);
                    }
                }
                // Replace events if there are any remaining.  Otherwise, clean up.
                if (remaining.length) {
                    this._events[name] = remaining;
                }
                else {
                    delete this._events[name];
                }
            }
            return this;
        };
        /**
         * 与on方法相同
         * @param {(string|Name)} name
         * @param {*} [callback]
         * @param {*} [context]
         * @param {number} [priority]
         *
         * @memberOf Dispatcher
         */
        Dispatcher.prototype.bind = function (name, callback, context, priority) {
            this.on(name, callback, context, priority);
        };
        /**
         * 与off方法相同
         * @param {(string|Name)} [name]
         * @param {*} [callback]
         * @param {*} [context]
         *
         * @memberOf Dispatcher
         */
        Dispatcher.prototype.unbind = function (name, callback, context) {
            this.off(name, callback, context);
        };
        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        /**
         * 派发一个或多个指定事件
         * @param {(string|Dic)} name
         * @param {any} args
         * @returns
         *
         * @memberOf Dispatcher
         */
        Dispatcher.prototype.trigger = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!this._events)
                return this;
            if (!eventsApi(this, 'trigger', name, args))
                return this;
            var events = this._events[name];
            var allEvents = this._events["all"];
            if (events)
                triggerEvents(events, args);
            if (allEvents)
                triggerEvents(allEvents, args);
            return this;
        };
        // Inversion-of-control versions of `on` and `once`. Tell *this* object to
        // listen to an event in another object ... keeping track of what it's
        // listening to.
        /**
         * 监听指定对象的特定事件。
         * 此函数具有两种函数签名
         * listenTo(obj: IDispatcher, name: string, callback?: any, priority?: number);
         * listenTo(obj: IDispatcher, name: Name, priority?: number);
         * @param {IDispatcher} obj
         * @param {(string|Name)} name
         * @param {*} [callback]
         * @param {number} [priority]
         * @returns
         *
         * @memberOf Dispatcher
         */
        Dispatcher.prototype.listenTo = function (obj, name, callback, priority) {
            var listeningTo = this._listeningTo || (this._listeningTo = {});
            var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
            listeningTo[id] = obj;
            if (typeof name === 'object') {
                priority = callback;
                obj.on(name, this, priority);
            }
            else {
                obj.on(name, callback, this, priority);
            }
            return this;
        };
        /**
         * 一次性的监听指定对象的特定事件。
         * 一旦事件被处理就立刻被移除。
         * 此函数具有两种函数签名
         * listenToOnce(obj: IDispatcher, name: string, callback?: any, priority?: number);
         * listenToOnce(obj: IDispatcher, name: Name, priority?: number);
         * @param {IDispatcher} obj
         * @param {(string|Name)} name
         * @param {*} [callback]
         * @param {number} [priority]
         * @returns
         *
         * @memberOf Dispatcher
         */
        Dispatcher.prototype.listenToOnce = function (obj, name, callback, priority) {
            if (typeof name === 'object') {
                priority = callback;
                for (var event in name)
                    this.listenToOnce(obj, event, name[event], priority);
                return this;
            }
            if (eventSplitter.test(name)) {
                var names = name.split(eventSplitter);
                for (var i = 0, length = names.length; i < length; i++) {
                    this.listenToOnce(obj, names[i], callback, priority);
                }
                return this;
            }
            if (!callback)
                return this;
            var once = _.once(function () {
                this.stopListening(obj, name, once);
                callback.apply(this, arguments);
            });
            once["_callback"] = callback;
            return this.listenTo(obj, name, once, priority);
        };
        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        /**
         * 取消指定对象的特定事件监听
         * @param {IDispatcher} [obj]
         * @param {(string|Name)} [name]
         * @param {*} [callback]
         * @returns
         *
         * @memberOf Dispatcher
         */
        Dispatcher.prototype.stopListening = function (obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo)
                return this;
            var remove = !name && !callback;
            if (!callback && typeof name === 'object')
                callback = this;
            if (obj)
                (listeningTo = {})[obj._listenId] = obj;
            for (var id in listeningTo) {
                obj = listeningTo[id];
                obj.off(name, callback, this);
                if (remove || _.isEmpty(obj._events))
                    delete this._listeningTo[id];
            }
            return this;
        };
        /**
         * 检查指定事件是否有任何处理函数。
         * @param {string} name
         * @returns {boolean}
         *
         * @memberOf Dispatcher
         */
        Dispatcher.prototype.hasListener = function (name) {
            return this._events && !!this._events[name];
        };
        return Dispatcher;
    }());
    exports.Dispatcher = Dispatcher;
    /**
     * 将IDispatcher的核心事件函数mixin到指定对象原型上，以使指定对象具有事件处理能力。
     * @export
     * @param {*} proto
     * @returns {void}
     */
    function mixin(proto) {
        if (!proto)
            return null;
        _.extend(proto, Dispatcher.prototype);
    }
    exports.mixin = mixin;
});
//# sourceMappingURL=eventable.js.map