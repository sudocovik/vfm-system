type EventInvocation = unknown[]

interface EventInvocationsOperations {
  at(index: number): EventInvocation

  count(): number
}

export class Event {
  private readonly _name: string

  private constructor (name: string) {
    this._name = name
  }

  public static named (by: string): Event {
    return new Event(by)
  }

  public shouldBeFired () {
    return {
      once: () => {
        const invocationCount = 1
        this.assertWasFiredTimes(invocationCount)
        return {
          withData: (expectedData: unknown) => {
            const invocationIndex = invocationCount - 1
            this.assertFiredData(expectedData, invocationIndex)
          }
        }
      }
    }
  }

  public shouldNotBeFired (): void {
    this.assertWasFiredTimes(0)
  }

  private assertWasFiredTimes (n: number) {
    cy.then(() => {
      const ACTUAL_TIMES_FIRED = this.invocations().count()
      const EXPECTED_TIMES_FIRED = n
      const failureMessage = EXPECTED_TIMES_FIRED === 0
        ? `Event '${this._name}' should not be fired but was fired (${ACTUAL_TIMES_FIRED}) times`
        : `Event '${this._name}' should be fired (${EXPECTED_TIMES_FIRED}) times but was (${ACTUAL_TIMES_FIRED}) times`

      expect(ACTUAL_TIMES_FIRED, failureMessage).to.be.gte(EXPECTED_TIMES_FIRED) // equal
    })
  }

  private assertFiredData (expectedData: unknown, index: number) {
    cy.then(() => {
      const invocationData = this.invocations().at(index)
      expect(invocationData).to.deep.equal(expectedData)
    })
  }

  private invocations (): EventInvocationsOperations {
    const invocations = Cypress.vueWrapper.emitted(this._name)
    return invocations === undefined
      ? new NoEventInvocations()
      : new EventInvocations(Cypress.vueWrapper.emitted(this._name) ?? [])
  }
}

class EventInvocations implements EventInvocationsOperations {
  private readonly _invocations: EventInvocation[]

  constructor (invocations: EventInvocation[]) {
    this._invocations = invocations
  }

  public at (index: number): EventInvocation {
    return this._invocations[index]
  }

  public count (): number {
    return this._invocations.length
  }
}

class NoEventInvocations implements EventInvocationsOperations {
  public at (): EventInvocation {
    return []
  }

  public count (): number {
    return 0
  }
}
