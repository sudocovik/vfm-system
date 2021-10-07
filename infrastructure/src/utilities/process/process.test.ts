import { SimpleProcess } from './process'

describe('#process', () => {
  test('should be runnable', () => {
    let hasRun: boolean = false

    new SimpleProcess().run(async () => { hasRun = true })

    expect(hasRun).toBe(true)
  })
})