import { useI18n } from 'vue-i18n'

export const useMap = () => {
  const { t } = useI18n()
  const typeMap: { [index: string]: { value: string; type: 'info' | 'warning' | 'danger' | 'primary' | 'success' } } = {
    '99': { value: t('application.application'), type: 'info' },
    '0': { value: t('menu._menu'), type: 'warning' },
    '1': { value: t('menu.component'), type: 'primary' },
    '2': { value: t('menu.func'), type: 'primary' },
    '3': { value: t('menu.btn'), type: 'success' },
  }

  return {
    typeMap,
  }
}
