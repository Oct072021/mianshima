import { UpdatePwd } from '@/store/modules/user/data.d'

export interface Pwd extends Omit<UpdatePwd, 'userName'> {
  confirmPassword: string
}
