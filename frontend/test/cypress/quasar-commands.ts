// eslint-disable

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainer<Subject> {
      /**
       * `have.css` matcher compares the computedColor, which is a rgb() value.
       * This custom matcher instead accept any valid CSS color format.
       *
       * @example
       *    cy.get('foo').should('have.color', 'white')
       *    cy.get('foo').should('have.color', '#fff')
       *    cy.get('foo').should('have.color', 'var(--q-primary)')
       */
      (chainer: 'have.color', type: string): Chainable<Subject>;
      /**
       * `have.css` matcher compares the computedColor, which is a rgb() value.
       * This custom matcher instead accept any valid CSS color format.
       *
       * @example
       *    cy.get('foo').should('have.backgroundColor', 'black')
       *    cy.get('foo').should('have.backgroundColor', '#000')
       *    cy.get('foo').should('have.backgroundColor', 'var(--q-dark)')
       */
      (chainer: 'have.backgroundColor', type: string): Chainable<Subject>;
    }
  }
}

type CssStyleProperties = Extract<keyof CSSStyleDeclaration, string>;

const COLOR_RELATED_CSS_PROPERTIES: CssStyleProperties[] = [
  'color',
  'backgroundColor'
]

export function registerColorAssertions () {
  // Cypress looks at the computed color which is always rgb()
  // This makes it possible to compare `black` to `rgb(0, 0, 0)` for instance
  // Overriding `should` isn't the way to go to add new assertions,
  // we should add them via Chai methods
  for (const property of COLOR_RELATED_CSS_PROPERTIES) {
    chai.Assertion.addMethod(property, function (colorValue: string) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const targetElement: JQuery<HTMLElement> = this._obj

      const tempElement = document.createElement('div')
      tempElement.style.color = colorValue
      tempElement.style.display = 'none' // make sure it doesn't actually render
      document.body.appendChild(tempElement) // append so that `getComputedStyle` actually works

      const tempColor = getComputedStyle(tempElement).color
      const targetColor = getComputedStyle(targetElement[0])[property]

      document.body.removeChild(tempElement) // remove it because we're done with it

      expect(tempColor).to.equal(targetColor)

      const actual = tempColor
      const expected = targetColor
      this.assert(
        actual === expected,
        `expected #{this} to have ${property} #{exp}, but got #{act} instead`,
        `expected #{this} not to have ${property} #{exp}`,
        expected,
        actual
      )
    })
  }
}

// TODO: Cypress types when overriding select are wrong up until 9.7, they miss subject param
// this forces us to use ts-expect-error on every override

function isCheckBasedComponent (subject: JQuery<HTMLElement>) {
  return (
    subject.hasClass('q-checkbox') ||
    subject.hasClass('q-toggle') ||
    subject.hasClass('q-radio')
  )
}

export function registerCypressOverwrites () {
  Cypress.Commands.overwrite(
    'select',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (
      originalFn,
      subject: JQuery<HTMLElement>,
      valueOrTextOrIndex: string | number | Array<string | number>,
      options
    ) => {
      // Hijack the subject to be the root q-select element if we notice we are inside one of them
      // This is due to Quasar passing data-cy attr to the underlying "q-field__native" element
      // The re-target allow to use this command seamlessly, but the problem will still bite back in other scenarios
      // TODO: the best solution would be to exempt data-cy from being copied down by Quasar
      if (subject.hasClass('q-field__native')) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        subject = subject.closest('.q-select') || subject
      }

      if (subject.hasClass('q-select')) {
        if (Array.isArray(valueOrTextOrIndex)) {
          if (!subject.hasClass('q-select--multiple')) {
            throw new Error(
              'Cypress: select command with array param can only be used with a multiple select'
            )
          }
        }
        else {
          valueOrTextOrIndex = [valueOrTextOrIndex]
        }

        if (valueOrTextOrIndex.length === 0) {
          throw new Error(
            'Cypress: select command requires at least one value'
          )
        }

        cy.wrap(subject).click()
        cy.withinSelectMenu(() => {
          (valueOrTextOrIndex as (string | number)[]).forEach((value) => {
            if (typeof value === 'string') {
              cy.get('.q-item[role=option]').contains(value).click()
            }
            else {
              cy.get('.q-item[role=option]').eq(value).click()
            }
          })
        })

        return
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return originalFn(subject, valueOrTextOrIndex, options)
    }
  )

  Cypress.Commands.overwrite(
    'check',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (originalFn, subject: JQuery<HTMLElement>, options) => {
      if (isCheckBasedComponent(subject)) {
        if (!subject.is('[aria-checked="true"]')) {
          cy.wrap(subject).click()
        }
        return
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return originalFn(subject, options)
    }
  )

  Cypress.Commands.overwrite(
    'uncheck',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (originalFn, subject: JQuery<HTMLElement>, options) => {
      if (isCheckBasedComponent(subject)) {
        if (!subject.is('[aria-checked="false"]')) {
          cy.wrap(subject).click()
        }
        return
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return originalFn(subject, options)
    }
  )

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  chai.Assertion.overwriteProperty('checked', (_super: () => void) => {
    return function (
      this: typeof chai.Assertion & { __flags: { negate?: boolean } }
    ) {
      const subject = this._obj as JQuery<HTMLElement> | undefined

      if (subject && isCheckBasedComponent(subject)) {
        const expectedValue = this.__flags.negate ? 'false' : 'true'
        new chai.Assertion(subject[0]).to.have.attr(
          'aria-checked',
          expectedValue
        )
      }
      else {
        _super.call(this)
      }
    }
  })
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       * @example cy.dataCy('greeting', { timeout: 0 })
       */
      dataCy<E extends Node = HTMLElement>(
        value: string,
        options?: Partial<
          Cypress.Loggable &
          Cypress.Timeoutable &
          Cypress.Withinable &
          Cypress.Shadow
          >,
      ): Chainable<JQuery<E>>;
    }
  }
}

export function registerDataCy () {
  Cypress.Commands.add(
    'dataCy',
    { prevSubject: 'optional' },
    (subject, value, options) => {
      return cy.get(
        `[data-cy=${value}]`,
        Object.assign({ withinSubject: subject }, options)
      )
    }
  )
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to work in the context of a portal-based component.
       * @example cy.withinPortal('.cy-greeting-dialog', () => { doSomething() })
       * @example cy.withinPortal({ dataCy: 'reprocess-dialog }, () => { doSomething() })
       */
      withinPortal<E extends HTMLElement = HTMLElement>(
        selectorOrOptions: string | WithinPortalOptions,
        fn: WithinPortalCallback<E>,
      ): Chainable<JQuery<E>>;

      /**
       * Custom command to work in the context of a QSelect options menu
       * It assumes there's a single select menu open at any time,
       * but allows you to provide a custom selector or dataCy id
       * if you need more specificity
       *
       * It assumes the QSelect options menu closes after performing all actions inside the provided callback.
       * If this is not the case, use `{ persistent: true }` option
       *
       * @example cy.withinSelectMenu(() => { doSomething() })
       * @example cy.withinSelectMenu({ dataCy: 'select-menu', fn: () => { doSomething() } })
       * @example cy.withinSelectMenu({ selector: '.cy-books-menu', fn: () => { doSomething() } })
       * @example cy.withinSelectMenu({ persistent: true, fn: () => { doSomething() } })
       */
      withinSelectMenu<E extends HTMLElement = HTMLElement>(
        fnOrOptions: WithinPortalCallback<E> | WithinPortalDerivateOptions<E>,
      ): Chainable<JQuery<E>>;

      /**
       * Custom command to work in the context of a QMenu
       * It assumes there's a single menu open at any time,
       * but allows you to provide a custom selector or dataCy id
       * if you need more specificity
       *
       * It assumes the QMenu closes after performing all actions inside the provided callback.
       * If this is not the case, use `{ persistent: true }` option
       *
       * @example cy.withinMenu(() => { doSomething() })
       * @example cy.withinMenu({ dataCy: 'select-menu', fn: () => { doSomething() } })
       * @example cy.withinMenu({ selector: '.cy-books-menu', fn: () => { doSomething() } })
       * @example cy.withinMenu({ persistent: true, fn: () => { doSomething() } })
       */
      withinMenu<E extends HTMLElement = HTMLElement>(
        fnOrOptions: WithinPortalCallback<E> | WithinPortalDerivateOptions<E>,
      ): Chainable<JQuery<E>>;

      /**
       * Custom command to work in the context of a QDialog
       * It assumes there's a single dialog open at any time,
       * but allows you to provide a custom selector or dataCy id
       * if you need more specificity
       *
       * It assumes the QDialog closes after performing all actions inside the provided callback.
       * If this is not the case, use `{ persistent: true }` option
       *
       * @example cy.withinDialog(() => { doSomething() })
       * @example cy.withinDialog({ dataCy: 'reprocess-dialog', fn: () => { doSomething() } })
       * @example cy.withinDialog({ selector: '.cy-delete-dialog', fn: () => { doSomething() } })
       * @example cy.withinDialog({ persistent: true, fn: () => { doSomething() } })
       */
      withinDialog<E extends HTMLElement = HTMLElement>(
        fnOrOptions: WithinPortalCallback<E> | WithinPortalDerivateOptions<E>,
      ): Chainable<JQuery<E>>;
    }
  }
}

type WithinPortalCallback<E extends HTMLElement = HTMLElement> = (
  currentSubject: JQuery<E>,
) => void;

interface WithinPortalOptions {
  dataCy: string;
}

interface WithinPortalDerivateOptions<E extends HTMLElement = HTMLElement> {
  /** Callback to execute within the scope of the Portal-based component */
  fn: WithinPortalCallback<E>;
  /**
   * Custom selector in case more specificity is needed,
   * eg. you need to differentiate between multiple open dialogs
   * For cases where using data-cy attributes is too troublesome
   * @example
   * .cy-books-menu
   * .cy-reprocess-plugin
   */
  selector?: string;
  /**
   * dataCy id in case more specificity is needed,
   * eg. you need to differentiate between multiple open dialogs
   */
  dataCy?: string;
  /**
   * If set to true, instruct the command to avoid the check for the Portal-based component
   * to be closed after the callback finished executing
   */
  persistent?: boolean;
}

// TODO: make cy.dataCy Withinable as cy.get
function getDataCySelector (dataCy: string) {
  return `[data-cy=${dataCy}]`
}

function portalDerivateCommand<E extends HTMLElement = HTMLElement> (
  selectorDefault: string,
  selectorSuffix: string,
  fnOrOptions: WithinPortalCallback<E> | WithinPortalDerivateOptions<E>
) {
  const {
    dataCy = undefined,
    persistent = false,
    selector = selectorDefault
  } = typeof fnOrOptions === 'function' ? {} : fnOrOptions

  const fn = typeof fnOrOptions === 'function' ? fnOrOptions : fnOrOptions.fn

  const portalSelector = `${
    dataCy ? getDataCySelector(dataCy) : selector
  }${selectorSuffix}`

  return cy.withinPortal(portalSelector, fn).should(($el) => {
    if (!persistent) {
      cy.wrap($el).should('not.exist')
    }
  })
}

export function registerPortalHelpers () {
  Cypress.Commands.add('withinPortal', function (selectorOrOptions, fn) {
    const selector =
      typeof selectorOrOptions === 'string'
        ? selectorOrOptions
        : getDataCySelector(selectorOrOptions.dataCy)

    return (
      cy
        .get(selector, {
          withinSubject: Cypress.$('body')
        })
        // Assert there's only one portal-based element that match the selection before continuing,
        // avoids delay due to transitions
        .should('have.length', 1)
        .within(fn)
    )
  })

  Cypress.Commands.add('withinSelectMenu', function (fnOrOptions) {
    return portalDerivateCommand('.q-menu', '[role=listbox]', fnOrOptions)
  })

  Cypress.Commands.add('withinMenu', function (fnOrOptions) {
    // Without `:not([role])` this would match select options menus too
    return portalDerivateCommand('.q-menu', ':not([role])', fnOrOptions)
  })

  Cypress.Commands.add('withinDialog', function (fnOrOptions) {
    return portalDerivateCommand('.q-dialog', '', fnOrOptions)
  })
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Persist current local storage data.
       * @example cy.saveLocalStorage()
       */
      saveLocalStorage(): void;

      /**
       * Restore saved data to local storage.
       * @example cy.restoreLocalStorage()
       */
      restoreLocalStorage(): void;
    }
  }
}

// these two commands let you persist local storage between tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LOCAL_STORAGE_MEMORY: Record<string, any> = {}

export function registerStorageHelpers () {
  Cypress.Commands.add('saveLocalStorage', () => {
    Object.keys(localStorage).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      LOCAL_STORAGE_MEMORY[key] = localStorage[key]
    })
  })

  Cypress.Commands.add('restoreLocalStorage', () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
    })
  })
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to test being on a given route.
       * @example cy.testRoute('home')
       */
      testRoute(value: string): void;
    }
  }
}

export function registerTestRoute () {
  Cypress.Commands.add('testRoute', (route) => {
    cy.location().should((loc) => {
      const usesHashModeRouter = loc.hash.length > 0
      const target = usesHashModeRouter ? loc.hash : loc.pathname
      const pattern = usesHashModeRouter ? `#/${route}` : `/${route}`

      expect(
        Cypress.minimatch(target, pattern, {
          nocomment: true
        })
      ).to.be.true
    })
  })
}

export function registerCommands () {
  registerCypressOverwrites()

  registerColorAssertions()
  registerDataCy()
  registerPortalHelpers()
  registerStorageHelpers()
  registerTestRoute()

  // Not a command, but a common known problem with Cypress
  // We add it here since it's needed for both e2e and component tests
  // Usually it should be placed into `cypress/support/index.ts` file
  // See https://github.com/quasarframework/quasar/issues/2233#issuecomment-492975745
  const resizeObserverLoopError = 'ResizeObserver loop limit exceeded'
  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes(resizeObserverLoopError)) {
      // returning false here prevents Cypress from failing the test
      return false
    }
  })
}
