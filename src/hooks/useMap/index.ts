import { useI18n } from 'vue-i18n'

export const useMap = () => {
  const { t } = useI18n()

  const enableMap: { [index: number]: string } = {
    1: t('hooks.yes'),
    0: t('hooks.no'),
  }

  const genderMap: { [index: number]: string } = {
    0: t('hooks.unknown'),
    1: t('hooks.male'),
    2: t('hooks.female'),
  }

  return {
    enableMap,
    genderMap,
  }
}
