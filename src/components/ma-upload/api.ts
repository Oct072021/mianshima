import service from '@/network/request'
import constant from '@/utils/constant'
import cache from '@/utils/cache'

export const uploadImg = (params: FormData) => {
	return service.postForm(constant.uploadUrl + '?access_token=' + cache.getTicket(), params)
}