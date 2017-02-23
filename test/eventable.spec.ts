import * as eventable from "../src/eventable";
const TEST_EVENT: string = 'test_event';
const TEST_EVENT_1: string = 'test_event_1';
describe("Dispatcher suite", function() {
    it("使用‘on’监听特定事件", function() {
        var listener = new eventable.Dispatcher();
        listener.on(TEST_EVENT , function (e) {
            expect(e).toBe(true);
        });
        listener.trigger(TEST_EVENT , true);
    });
    it("使用‘on’监听一组特定事件", function() {
        var listener = new eventable.Dispatcher();
        var count = 0;
        var func = function (e) {
            count++
        }
        var handles = {};
        handles[TEST_EVENT] = func;
        handles[TEST_EVENT_1] = func;
        listener.on(handles);
        listener.trigger(TEST_EVENT , true);
        listener.trigger(TEST_EVENT_1 , true);
        expect(count).toBe(2);
    });
    it("使用‘on’监听特定事件,并绑定特定context", function() {
        var listener = new eventable.Dispatcher();
        listener.on(TEST_EVENT , function (e) {
            expect(this === listener).toBe(true);
        });
        listener.trigger(TEST_EVENT , true, listener);
    });
    it("使用‘on’监听特定事件,并设置处理优先级", function() {
        var listener = new eventable.Dispatcher();
        var result = '';
        listener.on(TEST_EVENT , function (e) {
            result += "1";
        } , listener , 1);
        listener.on(TEST_EVENT , function (e) {
            result += "0";
        });
        listener.trigger(TEST_EVENT , true, listener);
        expect(result).toBe("10")
    });
    it("使用‘all’监听任意事件" , function () {
        var listener = new eventable.Dispatcher();
        listener.on("all" , function (e) {
            expect(e).toBe(true);
        });
        listener.trigger(TEST_EVENT , true);
    });
    it("使用‘off’方法移除特定处理函数" , function () {
        var listener = new eventable.Dispatcher();
        var count = 0;
        var func = function (e) {
            count++
        }
        listener.on(TEST_EVENT , function (e) {
            count++
        })
        listener.on(TEST_EVENT , func);
        listener.off(TEST_EVENT , func);
        listener.trigger(TEST_EVENT , true);
        expect(count).toBe(1);
    });
    it("使用‘off’方法移除特定名称的所有处理函数" , function () {
        var listener = new eventable.Dispatcher();
        var count = 0;
        var func = function (e) {
            count++
        }
        listener.on(TEST_EVENT , function (e) {
            count++
        })
        listener.on(TEST_EVENT , func);
        listener.off(TEST_EVENT);
        listener.trigger(TEST_EVENT , true);
        expect(count).toBe(0);
    });
    it("使用‘off’方法移除所有处理函数" , function () {
        var listener = new eventable.Dispatcher();
        var count = 0;
        var func = function (e) {
            count++
        }
        listener.on(TEST_EVENT_1 , function (e) {
            count++
        })
        listener.on(TEST_EVENT , func);
        listener.off();
        listener.trigger(TEST_EVENT , true);
        listener.trigger(TEST_EVENT_1 , true);
        expect(count).toBe(0);
    });
    it("使用‘listenTo’方法监听指定对象的事件" , function () {
        var dispatcher = new eventable.Dispatcher();
        var listener = new eventable.Dispatcher();
        var func = function (e) {
            expect(e).toBe(true);
        }
        listener.listenTo(dispatcher , TEST_EVENT , func);
        dispatcher.trigger(TEST_EVENT , true);
    });
    it("使用‘listenTo’方法监听指定对象的事件,并设置优先级" , function () {
        var dispatcher = new eventable.Dispatcher();
        var listener = new eventable.Dispatcher();
        var result = '';
        listener.listenTo(dispatcher , TEST_EVENT , function (e) {
            result += "1";
        } , 1);
        listener.listenTo(dispatcher , TEST_EVENT , function (e) {
            result += "0";
        });
        dispatcher.trigger(TEST_EVENT , true, listener);
        expect(result).toBe("10")
    });
    it("使用‘stopListening’方法移除特定处理函数" , function () {
        var dispatcher = new eventable.Dispatcher();
        var listener = new eventable.Dispatcher();
        var count = 0;
        var func = function (e) {
            count++
        }
        listener.listenTo(dispatcher , TEST_EVENT , function (e) {
            count++
        })
        listener.listenTo(dispatcher , TEST_EVENT , func);
        listener.stopListening(dispatcher , TEST_EVENT , func);
        dispatcher.trigger(TEST_EVENT , true);
        expect(count).toBe(1);
    });
    it("使用‘stopListening’方法移除特定名称的所有处理函数" , function () {
        var dispatcher = new eventable.Dispatcher();
        var listener = new eventable.Dispatcher();
        var count = 0;
        var func = function (e) {
            count++
        }
        listener.listenTo(dispatcher , TEST_EVENT , function (e) {
            count++
        })
        listener.listenTo(dispatcher , TEST_EVENT , func);
        listener.stopListening(dispatcher , TEST_EVENT);
        dispatcher.trigger(TEST_EVENT , true);
        expect(count).toBe(0);
    });
    it("使用‘stopListening’方法移除所有处理函数" , function () {
        var dispatcher = new eventable.Dispatcher();
        var listener = new eventable.Dispatcher();
        var count = 0;
        var func = function (e) {
            count++
        }
        listener.listenTo(dispatcher , TEST_EVENT_1 , function (e) {
            count++
        })
        listener.listenTo(dispatcher , TEST_EVENT , func);
        listener.stopListening(dispatcher);
        dispatcher.trigger(TEST_EVENT , true);
        dispatcher.trigger(TEST_EVENT_1 , true);
        expect(count).toBe(0);
    });
    it("使用‘stopListening’方法移除所有监听" , function () {
        var dispatcher = new eventable.Dispatcher();
        var listener = new eventable.Dispatcher();
        var count = 0;
        var func = function (e) {
            count++
        }
        listener.listenTo(dispatcher , TEST_EVENT_1 , function (e) {
            count++
        })
        listener.listenTo(dispatcher , TEST_EVENT , func);
        listener.stopListening();
        dispatcher.trigger(TEST_EVENT , true);
        dispatcher.trigger(TEST_EVENT_1 , true);
        expect(count).toBe(0);
    });
});

describe("eventable suite", function() {
    it("mixin方法测试", function() {
        var obj: any = {};
        eventable.mixin(obj);
        obj.on(TEST_EVENT , function (e) {
            expect(e).toBe(true);
        });
        obj.trigger(TEST_EVENT , true);
    });
    it("extend 扩展测试", function() {
        class Ext extends eventable.Dispatcher {
        }
        var obj = new Ext();
        obj.on(TEST_EVENT , function (e) {
            expect(e).toBe(true);
        });
        obj.trigger(TEST_EVENT , true);
    });
});