import Http from '@/common/http'
import HTMLParser from "@/common/html-parser"
const service = new Http()
export const crawl = async (data) => {
    try {
        console.log(data)
        const {pageUrl} = data
        const {data: res} = await service.get(pageUrl)
        const doc = new HTMLParser(res.toString().trim());
        console.log(doc.getElementsByClassName('manga-item'))
    } catch (e) {
        console.error(e)
    }
}
