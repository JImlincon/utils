function deepcopy(obj) {
    // var result = Array.isArray(obj) ? [] : {};
    if (Array.isArray(obj)) {
        var newObj = [];
    } else {
        var newObj = {}
    }

    for (var i in obj) {
        if (typeof obj[i] == 'object') {
            newObj[i] = deepcopy(obj[i]);
        } else {
            newObj[i] = obj[i];
        }
    }
    return newObj;
}

function deepClone(obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                //判断ojb子元素是否为对象，如果是，递归复制
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}

function deepClone(data) {
    if (!data || !(data instanceof Object) || (typeof data == "function")) {
        return data || undefined;
    }
    var constructor = data.constructor;
    var result = new constructor();
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            result[key] = deepClone(data[key]);
        }
    }
    return result;
}

function deepCopy(obj, cache = []) {

    function find(list, f) {
        return list.filter(f)[0]
    }

    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj)
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    })

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    })

    return copy
}

function deepClone(initalObj, finalObj) {
    var obj = finalObj || {};
    for (var i in initalObj) {
        var prop = initalObj[i];
        // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
        if (prop === obj) {
            continue;
        }
        if (typeof prop === 'object') {
            obj[i] = (prop.constructor === Array) ? [] : Object.create(prop);
        } else {
            obj[i] = prop;
        }
    }
    return obj;
}


//根据函数字符串获取参数列表字符串
function getArgStr(s) {
    var args = s.split('(')[1].split(')')[0].split(',');
    var argsStr = "";
    if (args[0] != '') {
        for (var i in args) {
            if (args[i].indexOf("'") != -1) {
                args[i] = args[i].replace(/'/g, '\\\'');
            }
            if (args[i].indexOf('"') != -1) {
                args[i] = args[i].replace('"', "\\\"");
            }
            argsStr += "'" + args[i] + "',";
        }
    }
    return argsStr;
}

//根据函数字符串获取函数体字符串
function getFuncBody(s) {
    var body = s.split('{')[1].split('}')[0].split('\n').join(";").replace(/[\r\n]/g, '');
    var temp = body.split('');
    for (var i in temp) {
        if (temp[i] === "'" || temp[i] === '"') {
            temp[i] = "\\" + temp[i];
        }
    }
    body = temp.join('');
    return body;
}

//深拷贝
var clone = function (obj) {
    if (obj === null) return null;
    if (typeof obj === 'function') {
        var s = obj.toString();
        var argsStr = getArgStr(s);
        var body = getFuncBody(s);
        return eval("new Function(" + argsStr + "\"" + body + "\");");
    }
    if (typeof obj !== 'object') return obj;
    if (obj.cunstructor === Date) return new Date(obj);
    if (obj.constructor === RegExp) return new RegExp(obj);
    var newObj = new obj.constructor(); //保持继承链
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {//不遍历其原型链上的属性
            var val = obj[key];
            newObj[key] = (typeof val === 'object' || typeof val === 'function') ? arguments.callee(val) : val;//使用arguments.callee解除与函数名的耦合
        }
    }
    return newObj;
}
// https://blog.csdn.net/YaoDeBiAn/article/details/82778403


var data;
var type = Object.prototype.toString.call(data);
var getType = /^\[object (.*)\]$/.exec(type)[1];
// var getType = type.match(/^\[object (.*)\]$/)[1]

function getType(obj) {
    var str = Object.prototype.toString.call(obj);
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }
    if (obj instanceof Element) { //判断是否是dom元素，如div等
        return "element";
    }
    return map[str];
}
function deepCopy(p) {
    var obj;
    var str = getType(p);
    if (str == 'array') {
        obj = [];
        for (var i = 0; i < p.length; i++) {
            obj.push(arguments.callee(p[i]));  //回调自己
        }
    } else if (str == 'object') {
        obj = {};
        for (var i in p) {
            obj[i] = arguments.callee(p[i]);
        }
    } else {
        return p;
    }
    return obj;
}




/* 
可以完全复制一个对象，包括对象的原型对象和方法，包括Map和Set
 */
function clone(obj) {
    if (typeof obj !== 'object') { return obj; }
    let cloneObj = {};
    switch (obj.constructor) {
        case Array:
            cloneObj = [];
        case Object:
            for (var property in obj) {
                cloneObj[property] = typeof obj[property] === 'object' ? clone(obj[property]) : obj[property];
            }
            break;
        case Map:
            cloneObj = new Map();
            obj.forEach((value, key) => {
                cloneObj.set(key, typeof value === 'object' ? clone(value) : value);
            });
            break;
        case Set:
            cloneObj = new Set();
            obj.forEach(value => {
                cloneObj.add(typeof value === 'object' ? clone(value) : value);
            });
            break;
    }
    return cloneObj;
}

function deepClone(obj) {
    let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
    return objClone
}
