import Http from '@/common/http'
import HTMLParser from "@/common/html-parser"
const service = new Http()
export const crawl = async (data) => {
    try {
        const {pageUrl} = data
        const {data: res} = await service.get(pageUrl)
        const doc = new HTMLParser(res.toString().trim());
        console.log(doc.getElementsByClassName('manga-img'))
    } catch (e) {
        console.error(e)
    }
}
