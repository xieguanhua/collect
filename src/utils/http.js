/* 请求
 * @param {String} baseURL 请求的baseUrl
 * @param {Object} header 请求头
 * @param {Object} header 请求头
 * @param {Boolean} isRequestIntercept 请求拦截 默认true
 * @param {Boolean} isResponseIntercept 响应拦截 默认true
 * @param {Boolean} all 返回全部 默认返回res.data
 */
import {legalUrl} from '@/enum'

const urlFormat = require('url')
export default class Request {
    constructor(config = {}) {
        //默认配置
        const defaultConfig = {
            //请求的baseUrl
            baseURL: '',
            //loading超时时间
            timeOut: 60000,
            //请求头
            header: {},
            //loading动画
            showLoading: false,
            //loading遮罩
            loadingMask: false,
            //loading文本
            loadingText: '加载中',
        }
        this.config = Object.assign(defaultConfig, config)
        const methods = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch']
        methods.forEach(method => {
            this[method] = (url, data, config = {}) => {
                return this.request({
                    method,
                    url,
                    data,
                    config
                })
            };
        })
        //拦截器
        this.interceptors = {
            request(res, config) {
                try {
                    return Promise.resolve(res)
                } catch (e) {
                    return Promise.reject(e)
                }
            },
            response(res, config) {
                const {statusCode, data} = res
                try {
                    if (statusCode !== 200) {
                        let msg = data.message
                        if (!msg) {
                            if (statusCode === 400) {
                                // 400 错误码处理
                                msg = `请求出错，请稍后重试`
                            } else {
                                const code = String(statusCode).substr(0, 1)
                                const errorTxt = {
                                    '0': `网络异常，请检查网络连接`,
                                    '4': `请求出错，请稍后重试`,
                                    '5': `服务器异常，请稍后重试`,
                                }
                                msg = errorTxt[code] || `未知异常`
                            }
                        }
                        const err = new Error(msg)
                        err.data = data
                        return Promise.reject(err)
                    } else {
                        return Promise.resolve(data)
                    }
                } catch (e) {
                    e.message = `网络异常，请检查网络连接`
                    return Promise.reject(e)
                }
            }
        }
    }

    showLoading(config) {
        const {
            //默认loading动画
            showLoading: defaultShowLoading,
            //默认loading文本
            loadingText: defaultLoadingTitle,
            //默认loading遮罩
            loadingMask: defaultLoadingMask
        } = this.config
        const {
            //loading动画
            loadingText,
            //loading文本
            showLoading,
            //loading遮罩
            loadingMask
        } = config
        const loading = typeof showLoading === 'boolean' ? showLoading : defaultShowLoading
        const title = loadingText || defaultLoadingTitle
        const mask = typeof loadingMask === 'boolean' ? loadingMask : defaultLoadingMask
        //loading动画
        if (loading) {
            uni.showLoading({
                title,
                mask
            })
        }
    }

    hideLoading({showLoading}) {
        const loading = typeof showLoading === 'boolean' ? showLoading : this.config.showLoading
        loading && uni.hideLoading()
    }

    request({method, url, data, config}) {
        const {
            baseURL,
            //默认请求头
            header: defaultHeader,
            //默认loading超时时间
            timeOut: defaultTimeOut,
        } = this.config
        const {
            //请求头
            header = {},
            //loading超时时间
            timeOut,
            //如果设为 json，会尝试对返回的数据做一次 JSON.parse
            dataType = 'json',
            //设置响应的数据类型。合法值：text、arraybuffer
            responseType,
        } = config

        this.showLoading(config)
        let option = {
            url: legalUrl.test(url) ? url : urlFormat.resolve(baseURL, url),
            data,
            header: Object.assign(defaultHeader, header),
            method,
            timeout: timeOut || defaultTimeOut,
            dataType,
            responseType
        }
        return this.interceptors.request(option, config).then(option => {
            return new Promise((success, fail) => {
                //config.request 外部传递config对象过来，直接操作当前请求，用于取消请求与监听进度等等
                config.request = uni.request({
                    ...option,
                    success,
                    fail
                });
            })
        }).then(data => {
            return this.interceptors.response(data, config)
        }).finally(() => {
            this.hideLoading(config)
        })
    }

    /* 多个请求
     * @param {Array[]} requests 配置参数 request方法的参数
     * @param {Object} config 配置参数 request方法的config
     * @param {Boolean} config.inherit 当请求没有配置config，继承当前方法的config
     */
    async requestAll(requests = [], config = {}) {
        this.showLoading(config)
        try {
            return await Promise.all(requests.map(v => {
                if (!v.config) {
                    v.config = config.inherit ? config : {}
                }
                v.config.showLoading = false
                return this.request(v)
            }))
        } catch (e) {
            throw e
        } finally {
            this.hideLoading(config)
        }
    }
}

