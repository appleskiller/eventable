Inspired by Backbone link :https://github.com/jashkenas/backbone

感谢Backbone的原作者。

# eventable - 事件内核
* 基于Backbone的事件实现，为on方法和listenTo方法增加了额外的priority参数，为复杂事件系统提供处理优先级的支持。
* 在Typescript环境中，可以直接使用extends关键字继承eventable.Dispatcher创建具有事件处理能力的类。
## 依赖
```
"lodash": "^4.17.4"
```
## 示例
```
// 事件监听
var listener = new eventable.Dispatcher();
listener.on("eventName" , function (e) {
    // body
});
// 或者
listener.on({
    "eventName1": function (e) {},
    "eventName2": function (e) {}
});

// 事件移除
listener.off("eventName" , function (e) {}); // 移除指定名称指定处理函数的监听
listener.off("eventName"); // 移除指定名称的所有处理函数的监听
listener.off(); // 移除所有处理函数的监听

// 监听目标对象的事件
var dispatcher = new eventable.Dispatcher();
listener.listenTo(dispatcher , "eventName" , function (e) {});

// 移除目标对象上的事件
listener.stopListening(dispatcher , "eventName" , function (e) {}); // 移除dispatcher对象上指定事件类型指定处理函数
listener.stopListening(dispatcher , "eventName"); // 移除dispatcher对象上指定事件类型的所有处理函数
listener.stopListening(dispatcher); // 移除dispatcher对象上所有事件类型的处理函数
listener.stopListening(); // 移除曾监听的在其他对象上的所有处理函数
```

## 构建
```
tsc -p ./src
```
## 测试
```
karma start
```

## 开发依赖项
```
"Karma": "^1.4.1",
"jasmine": "^2.5.2",
"jasmine-core": "^2.5.2",
"karma": "^1.4.1",
"karma-chrome-launcher": "^2.0.0",
"karma-cli": "^1.0.1",
"karma-jasmine": "^1.1.0",
"karma-requirejs": "^1.1.0",
"karma-typescript-preprocessor": "^0.3.1",
"karma-webpack": "^2.0.2",
"requirejs": "^2.3.2",
"ts-loader": "^2.0.0",
"typescript": "^2.1.6",
"typings": "^2.1.0",
"webpack": "^2.2.1"
```