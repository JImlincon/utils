/**
* 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
* @param delay   {number}    空闲时间，单位毫秒
* @param fn {function}  请求关联函数，实际应用需要调用的函数
* @return {function}    返回客户调用函数
*/

function debounce(fn, delay) {
    let args = arguments,
        context = this,
        timer = null;

    return function () {
        if (timer) {
            clearTimeout(timer);
        } 
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}

/**
* 频率控制 返回函数连续调用时，fn 执行频率限定为 次 / delay
* @param delay  {number}    延迟时间，单位毫秒
* @param fn {function}  请求关联函数，实际应用需要调用的函数
* @return {function}    返回客户调用函数
*/

function throttle(fn, delay) {
    let args = arguments,
        context = this,
        timer = null,
        remaining = 0,
        previous = new Date();

    return function () {
        let now = new Date();
        remaining = now - previous;

        if (remaining >= delay) {
            if (timer) {
                clearTimeout(timer);
            }

            fn.apply(context, args);
            previous = now;
        } else {
            if (!timer) {
                timer = setTimeout(function () {
                    fn.apply(context, args);
                    previous = new Date();
                }, delay - remaining);
            }
        }
    };
}