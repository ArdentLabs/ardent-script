import { reset, random } from '../random'
import { generateVariables } from '../generator'
import { DuplicateVariableName, FailedVariableInstantiation } from '../errors'

jest.mock('../random')

describe('value generator', () => {
  beforeEach(reset)

  it('randomly generates values', () => {
    const variables = generateVariables([
      { name: 'randint', type: 'RANDOMINT', range: [2, 6] },
      { name: 'randfloat', type: 'RANDOMFLOAT', range: [7, 15] },
    ])

    expect(variables).toMatchObject({
      randint: expect.any(String),
      randfloat: expect.any(String),
    })

    expect(parseInt(variables.randint)).toBe(3)

    expect(parseFloat(variables.randfloat)).toBeCloseTo(7.8)
  })

  it('respects incluiveness for random integers', () => {
    expect(
      generateVariables([
        { type: 'RANDOMINT', range: [0, 10] },
        { type: 'RANDOMINT', range: [0, 10], inclusive: [true, false] },
        { type: 'RANDOMINT', range: [0, 7], inclusive: false },
        { type: 'RANDOMINT', range: [0, 19], inclusive: true },
        { type: 'RANDOMINT', range: [0, 20], inclusive: [false, true] },
      ])
    ).toEqual({
      '1': '3',
      '2': '1',
      '3': '3',
      '4': '2',
      '5': '11',
    })
  })

  it('can supply default names', () => {
    expect(
      generateVariables([
        { type: 'RANDOMINT', range: [-5, 13] },
        { type: 'RANDOMINT', range: [4, 8] },
        { type: 'RANDOMFLOAT', range: [4.6, 77] },
      ])
    ).toMatchObject({
      '1': expect.any(String),
      '2': expect.any(String),
      '3': expect.any(String),
    })

    expect(
      generateVariables([
        { name: 'uses', type: 'RANDOMINT', range: [-5, 13] },
        { type: 'RANDOMINT', range: [4, 8] },
        { name: 'position', type: 'RANDOMFLOAT', range: [4.6, 77] },
      ])
    ).toMatchObject({
      uses: expect.any(String),
      '2': expect.any(String),
      position: expect.any(String),
    })
  })

  it('can evaluate composite expressions', () => {
    const variables = generateVariables([
      { type: 'RANDOMFLOAT', range: [4, 6] },
      { type: 'RANDOMINT', range: [3, 12] },
      { type: 'EVALUATE', expression: '{1} * {2} + 5' },
    ])

    expect(parseFloat(variables['3'])).toBeCloseTo(18.8)
  })

  it('can randomly choose a value', () => {
    expect(
      generateVariables([
        { type: 'RANDOMCHOOSE', values: ['1', '2', '3', '4', '5'] },
      ])
    ).toEqual({
      '1': '2',
    })

    expect(
      generateVariables([
        { type: 'RANDOMCHOOSE', values: ['1', '2', '3', '4', '5'] },
      ])
    ).toEqual({
      '1': '1',
    })

    expect(
      generateVariables([
        { type: 'RANDOMCHOOSE', values: ['1', '2', '3', '4', '5'] },
      ])
    ).toEqual({
      '1': '3',
    })
  })

  it('can shuffle variables', () => {
    expect(
      generateVariables([
        { type: 'RANDOMFLOAT', range: [0, 1], numDigits: 1 },
        { type: 'RANDOMFLOAT', range: [0, 1], numDigits: 1 },
        { type: 'RANDOMFLOAT', range: [0, 1], numDigits: 1 },
        {
          type: 'SHUFFLEJOIN',
          operator: ' ',
          operands: ['{1}', '{2}', '{3}', '0.7'],
        },
      ])
    ).toEqual({
      '1': '0.3',
      '2': '0.1',
      '3': '0.4',
      '4': '0.7 0.4 0.1 0.3',
    })
    expect(random).toBeCalledTimes(6)

    reset()

    expect(generateVariables([]))

    expect(
      generateVariables([
        { type: 'RANDOMFLOAT', range: [0, 2], numDigits: 1 },
        { type: 'RANDOMFLOAT', range: [0, 2], numDigits: 1 },
        { type: 'RANDOMFLOAT', range: [0, 2], numDigits: 1 },
        { type: 'RANDOMFLOAT', range: [1, 2], numDigits: 1 },
        { type: 'RANDOMFLOAT', range: [0, 2], numDigits: 1 },
        {
          type: 'SHUFFLEJOIN',
          operator: ' * ',
          operands: ['{1}', '{2}', '{3}', '{4}', '{5}'],
        },
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
        { name: 'ok', type: 'RANDOMINT', range: [2, 4] },
        { name: 'duplicate', type: 'RANDOMINT', range: [3, 5] },
        { name: 'duplicate', type: 'RANDOMINT', range: [4, 6] },
      ])
    }).toThrow(DuplicateVariableName)

    expect(() => {
      generateVariables([
        { name: 'badorder', type: 'EVALUATE', expression: '{dep1} + {dep2}' },
        { name: 'dep1', type: 'RANDOMINT', range: [4, 8] },
        { name: 'dep2', type: 'RANDOMINT', range: [3, 10] },
      ])
    }).toThrow(FailedVariableInstantiation)
  })
})
