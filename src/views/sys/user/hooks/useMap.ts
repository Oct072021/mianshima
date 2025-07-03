import { useI18n } from 'vue-i18n'

export const useMap = () => {
  const { t } = useI18n()
  
  const statusMap: { [index: number]: { label: string; type: 'danger' | 'success' | 'primary' | 'info' | 'default' } } =
    {
      0: { label: t('userManage.disable'), type: 'danger' },
      1: { label: t('userManage.enable'), type: 'success' },
    }

  return {
    statusMap,
  }
}
