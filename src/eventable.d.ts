
type EventItem = {
    callback: any;
    context: any;
    ctx: any;
    priority: number;
}
type Dic = {
    [name: string]: any;
}
type Name = {
    [name: string]: (...args)=>void;
}
interface IDispatcher {
    _listenId: string;
    _events: {[name: string]: EventItem[]};
    on(name: string|Name, callback?: any, context?: any, priority?: number);
    once(name: string|Name, callback?: any, context?: any, priority?: number);
    off(name?: string|Name, callback?: any, context?: any);
    bind(name: string|Name, callback?: any, context?: any, priority?: number);
    unbind(name?: string|Name, callback?: any, context?: any);
    trigger(name: string|Dic, ...args);
    listenTo(obj: IDispatcher, name: string|Name, callback?: any, priority?: number);
    listenToOnce(obj: IDispatcher, name: string|Name, callback?: any, priority?: number);
    stopListening(obj?: IDispatcher, name?: string|Name, callback?: any);
    hasListener(name: string): boolean;
}