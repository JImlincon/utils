import axios from 'axios'

const pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const CancelToken = axios.CancelToken

axios.defaults.timeout = 5000;  //超时时间是5秒
axios.defaults.withCredentials = true //允许跨域

//Content-type 响应头
// axios.defaults.headers.post['Content-type'] = 'application/x-www-from-urlencoded;charset=UTF-8';
//基础url
// axios.defaults.baseURL = "http://localhost:8888";


/**
 * @description 取消请求
 * @params nowBrand {string} '请求url' + '&' + '方法类型(get||post||put||delete等)'
 */
axios.cancelFetch = (nowBrand) => {
  for (const p in pending) {
    if (nowBrand == null) { // 如果为空，删除所有
      pending[p].cancel() // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    } else if (pending[p].brand === nowBrand) {
      pending[p].cancel()
      pending.splice(p, 1)
      break
    }
  }
}

axios.interceptors.request.use((config) => {
  const { isAutoCancel = false, method, url } = config
  // 取消令牌标识是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
  const brand = url + '&' + method
  // 判断是否需要 - 设置自动取消(默认 false)
  if (isAutoCancel === true) {
    // 先取消有相同请求的请求
    axios.cancelFetch(brand)
    // 设置取消令牌
    config.cancelBrand = brand
    config.cancelToken = new CancelToken((cancel) => {
      pending.push({ brand, cancel, config })
    })
  }
  return config
})

axios.interceptors.response.use((response) => {
  const { config: { cancelBrand } } = response
  cancelBrand && clearPending(cancelBrand)

  return response
}, (error) => {
  const { config } = error
  if (config) {
    const { cancelBrand } = config
    cancelBrand && clearPending(cancelBrand)
  }

  return error
})

function clearPending(cancelBrand) {
  if (cancelBrand) {
    for (const p in pending) {
      if (pending[p].brand === cancelBrand) {
        pending.splice(p, 1)
        break
      }
    }
  } else {
    pending.length = 0
  }
}

export default function({url, method, params = {}}) {
	// 首先判断是get请求还是post请求
	let data = method.toLocaleLowerCase() === 'get' ? 'params' : 'data';
	return axios({
    	method,
    	url,
    	[data]: params // 差异点在于data的值
	}).then((res) => {
    	return Promise.resolve(res.data);
	}).catch((err) => {
    	return Promise.reject(err);
	})
}
// export {
//   axios
// }
// getCookie (name) {
//   const value = '; ' + document.cookie;
//   const parts = value.split('; ' + name + '=');
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return null;
// }
// export default axios