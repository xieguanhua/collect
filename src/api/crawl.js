import Http from '@/utils/http'
import {host}  from '@/utils/classify.data'
const service = new Http()
export function crawl(pageUrl, params,config) {
    return service.get(pageUrl, params,config)
}
export function agentRequests(params,config) {
    return service.get(`${host}/api/json/`, params,config)
}