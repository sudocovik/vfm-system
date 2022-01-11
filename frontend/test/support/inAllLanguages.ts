import { i18n, t } from 'boot/i18n'

const translateKey = (...params: unknown[]): ReturnType<typeof t> => {
  const translationKey = params[0] as PropertyKey
  const currentLanguage = i18n.global.locale

  const allTranslations = i18n.global.messages[currentLanguage] ?? {}

  if (!Object.prototype.hasOwnProperty.call(allTranslations, translationKey)) {
    throw new Error(`Translation for key '${String(translationKey)}' does not exist for language '${currentLanguage}'`)
  }

  // Disabled because there is no point in dealing with t() overloading and typings
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return t(...params)
}

export const inAllLanguages = {
  it: (title: string, fn: (translate: typeof translateKey) => unknown): void => {
    const defaultLanguage = i18n.global.locale
    const availableLanguages = i18n.global.availableLocales

    // tests are scoped in describe block so beforeEach does not affect other tests that do not require translations
    describe(title, () => {
      availableLanguages.forEach((currentLanguage) => {
        it(`[${currentLanguage}]`, () => {
          i18n.global.locale = currentLanguage
          fn(translateKey)
        })
      })

      beforeEach(() => {
        i18n.global.locale = defaultLanguage
      })
    })
  }
}
