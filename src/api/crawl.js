import Http from '@/utils/http'

const service = new Http()
export function crawl(pageUrl, params,config) {
    return service.get(pageUrl, params,config)
}
