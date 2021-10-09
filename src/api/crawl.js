import Http from '@/common/http'

const service = new Http()
export function crawl(pageUrl, params) {
    return service.get(pageUrl, params)
}
