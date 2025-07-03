import { reactive } from 'vue'
import { captcha } from './api'
import { Captcha } from './data.d'

export const useCaptcha = () => {
  const captchaInfo = reactive<Captcha>({
    image: '',
    pk: '',
    key: '',
  })

  const getCaptchaInfo = async () => {
    const { data } = await captcha()
    Object.assign(captchaInfo, data)
  }
  getCaptchaInfo()
  
  return {
    captchaInfo,
    getCaptchaInfo,
  }
}
