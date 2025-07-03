import service from '@/network/request'

export const useDataApi = async (url: string) => {
  const { data } = await service.get(url)

  return data
}