const findEventsByName = (name: string) => (): string[][] => {
  const eventSequence = <string[][]>Cypress.vueWrapper.emitted(name)
  if (eventSequence) return eventSequence
  else throw new Error(`Event '${name}' never occurred`)
}

const takeLastEvent = () => (eventSequence: string[][]): string[] => eventSequence[eventSequence.length - 1]

const takeFirstValue = () => (eventData: string[]): string => eventData[0]

export class ModelValueProperty {
  public changeTo (value: unknown): void {
    cy.then(() => Cypress.vueWrapper.setProps({ modelValue: value }))
  }

  public shouldBe (wantedValue: unknown): void {
    cy.then(findEventsByName('update:modelValue'))
      .then(takeLastEvent())
      .then(takeFirstValue())
      .then((firstValue: string) => {
        expect(firstValue).to.be.equal(wantedValue)
      })
  }
}
