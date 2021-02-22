import fetch from './fetch'
export default {
    columns() {
        let paramObj = {
            url: 'https://zhuanlan.zhihu.com/api/columns/zhihuadmin',
            method: 'get',
            params: {}
        }
        return fetch(paramObj)
    }
}