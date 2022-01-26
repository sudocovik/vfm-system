import { i18n, t } from 'boot/i18n'

i18n.global.missing = (currentLanguage: string, key: string) => {
  throw new Error(`Translation for key '${key}' does not exist for language '${currentLanguage}'`)
}

export const inAllLanguages = {
  it: (title: string, fn: (translate: typeof t) => unknown): void => {
    const defaultLanguage = i18n.global.locale
    const availableLanguages = i18n.global.availableLocales

    // tests are scoped in describe block so beforeEach does not affect other tests that do not require translations
    describe(title, () => {
      availableLanguages.forEach((currentLanguage) => {
        it(`[${currentLanguage}]`, () => {
          i18n.global.locale = currentLanguage
          fn(t)
        })
      })

      beforeEach(() => {
        i18n.global.locale = defaultLanguage
      })
    })
  }
}
