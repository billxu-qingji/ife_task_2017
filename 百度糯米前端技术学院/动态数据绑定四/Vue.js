//事件相关操作
class Event {
    constructor() {
        this._eventBus = {};
    }
    on(eventType, callback) {
        if (!(eventType in this._eventBus)) {
            this._eventBus[eventType] = [];
        }
        this._eventBus[eventType].push(callback);
    }
    emit(eventType, ...args) {
        if (!(eventType in this._eventBus)) return;
        let items = eventType.split(".");
        for (let i = 0, len = items.length; i < len; i++) {
            eventType = items.join(".");
            this._eventBus[eventType].forEach(function (item) {
                item.apply(this, args);
            })
            items.pop();
        }
    }
    off() {

    }
}

class Vue {
    constructor(obj) {
        this.data = obj.data;
        this._event = new Event();
        
        this.walk(obj.data);
        this.render(obj.el, obj.data);
    }
    //遍历所有属性
    walk(data, path = '') {
        let _this = this;
        let entries = Object.entries(data);
        entries.forEach(function ([key, val]) {
            if (typeof val === "object") {
                path = path ? `${path}.${key}` : key;
                _this.walk(val, path);
            }
            _this.convert(data, key, val, path);
        })
    }
    //配置属性
    convert(data, key, val, path) {
        let _this = this;
        Object.defineProperty(data, key, {
            enumerable: true,
            configrable: true,
            get() {
                console.log(`you get ${key} is ${val}`);
                return val;
            },
            set(newVal) {
                let resultPath = path;
                if (val === newVal) return;
                console.log(`you set ${key} to ${newVal}`);
                resultPath = resultPath ? `${resultPath}.${key}` : key;
                console.log(resultPath);
                _this._event.emit(resultPath, newVal);
                if (typeof newVal === "object") {
                    _this.walk(newVal, path);
                }
                val = newVal;
            }
        })
    }
    //监听属性变化
    $watch(attr, callback) {
        this._event.on(attr, callback);
    }
    //渲染html
    render(elem, data){
        let wrapElem = document.querySelector(elem);
        let html = wrapElem.innerHTML;
        let newHtml = html.replace(/\{\{(\S*)\}\}/g, function(str,val){
            return eval(`data.${val}`);;
        })
        wrapElem.innerHTML = newHtml;
    }
}