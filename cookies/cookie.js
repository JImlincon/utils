function setCookie(name, value, expiredays) {
    let exp = new Date();
    exp.setDate(exp.getDate() + expiredays);
    let path = '/';
    document.cookie = name + "=" + escape(value) + ';expires' + exp.toGMTString() + ';path=' + path;
};

function getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function delCookie(name) {
    let exp = new Date();
    exp.setDate(exp.getDate() - 1);
    let cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}