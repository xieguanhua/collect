import Http from '@/utils/http'
import {jsonApi,puppeteerApi}  from '@/utils/classify.data'
const service = new Http()
export function crawl(pageUrl, params,config) {
    pageUrl = params.requestPageUrl||pageUrl||puppeteerApi
    delete params.requestPageUrl
    return service.get(pageUrl, params,config)
}
export function agentRequests(params,config) {
    return service.get(jsonApi, params,config)
}