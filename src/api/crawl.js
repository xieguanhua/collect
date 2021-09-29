import Http from '@/common/http'
const service = new Http()
export const crawl =async (data)=>{
    const {pageUrl} = data
    const {data:res}=await service.get(pageUrl)
    console.log(res)
}
