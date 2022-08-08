import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

type MessageSchema = typeof messages['en-US']

export const i18n = createI18n<[MessageSchema], 'hr-HR' | 'en-US'>({
  locale: 'hr-HR',
  messages
})

export const { global: { t } } = i18n

export default boot(({ app }) => {
  app.use(i18n)
})
