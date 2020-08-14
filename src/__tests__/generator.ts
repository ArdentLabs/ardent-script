import { reset, random } from '../random'
import { generateVariables } from '../generator'
import { DuplicateVariableName, FailedVariableInstantiation } from '../errors'

jest.mock('../random')

describe('value generator', () => {
  beforeEach(reset)

  it('randomly generates values', () => {
    const variables = generateVariables([
      { name: 'randint', type: 'RANDOMINT', min: 2, max: 6 },
      { name: 'randfloat', type: 'RANDOMFLOAT', min: 7, max: 15 },
    ])

    expect(variables).toMatchObject({
      randint: expect.any(String),
      randfloat: expect.any(String),
    })

    expect(parseInt(variables.randint)).toBe(3)

    expect(parseFloat(variables.randfloat)).toBeCloseTo(7.8)
  })

  it('can supply default names', () => {
    expect(
      generateVariables([
        { type: 'RANDOMINT', min: -5, max: 13 },
        { type: 'RANDOMINT', min: 4, max: 8 },
        { type: 'RANDOMFLOAT', min: 4.6, max: 77 },
      ])
    ).toMatchObject({
      '1': expect.any(String),
      '2': expect.any(String),
      '3': expect.any(String),
    })

    expect(
      generateVariables([
        { name: 'uses', type: 'RANDOMINT', min: -5, max: 13 },
        { type: 'RANDOMINT', min: 4, max: 8 },
        { name: 'position', type: 'RANDOMFLOAT', min: 4.6, max: 77 },
      ])
    ).toMatchObject({
      uses: expect.any(String),
      '2': expect.any(String),
      position: expect.any(String),
    })
  })

  it('can evaluate composite expressions', () => {
    const variables = generateVariables([
      { type: 'RANDOMFLOAT', min: 4, max: 6 },
      { type: 'RANDOMINT', min: 3, max: 12 },
      { type: 'EVALUATE', expression: '{1} * {2} + 5' },
    ])

    expect(parseFloat(variables['3'])).toBeCloseTo(18.8)
  })

  it('can shuffle variables', () => {
    expect(
      generateVariables([
        { type: 'RANDOMFLOAT', min: 0, max: 1, numDigits: 1 },
        { type: 'RANDOMFLOAT', min: 0, max: 1, numDigits: 1 },
        { type: 'RANDOMFLOAT', min: 0, max: 1, numDigits: 1 },
        { type: 'RANDOMFLOAT', min: 0, max: 1, numDigits: 1 },
        { type: 'SHUFFLEADD', variables: ['1', '2', '3', '4'] },
      ])
    ).toEqual({
      '1': '0.3',
      '2': '0.1',
      '3': '0.4',
      '4': '0.1',
      '5': '0.1 + 0.3 + 0.1 + 0.4',
    })
    expect(random).toBeCalledTimes(7)

    reset()

    expect(
      generateVariables([
        { type: 'RANDOMFLOAT', min: 0, max: 2, numDigits: 1 },
        { type: 'RANDOMFLOAT', min: 0, max: 2, numDigits: 1 },
        { type: 'RANDOMFLOAT', min: 0, max: 2, numDigits: 1 },
        { type: 'RANDOMFLOAT', min: 1, max: 2, numDigits: 1 },
        { type: 'RANDOMFLOAT', min: 0, max: 2, numDigits: 1 },
        { type: 'SHUFFLEMULT', variables: ['1', '2', '3', '4', '5'] },
      ])
    ).toEqual({
      '1': '0.6',
      '2': '0.2',
      '3': '0.8',
      '4': '1.1',
      '5': '1.0',
      '6': '0.8 * 1.1 * 0.2 * 0.6 * 1.0',
    })
    expect(random).toBeCalledTimes(9)
  })

  it('throws appropriate errors', () => {
    expect(() => {
      generateVariables([
        { name: 'ok', type: 'RANDOMINT', min: 2, max: 4 },
        { name: 'duplicate', type: 'RANDOMINT', min: 3, max: 5 },
        { name: 'duplicate', type: 'RANDOMINT', min: 4, max: 6 },
      ])
    }).toThrow(DuplicateVariableName)

    expect(() => {
      generateVariables([
        { name: 'badorder', type: 'EVALUATE', expression: '{dep1} + {dep2}' },
        { name: 'dep1', type: 'RANDOMINT', min: 4, max: 8 },
        { name: 'dep2', type: 'RANDOMINT', min: 3, max: 10 },
      ])
    }).toThrow(FailedVariableInstantiation)
  })
})
