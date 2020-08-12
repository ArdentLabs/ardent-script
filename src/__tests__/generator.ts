import { reset } from '../random'
import { generateVariables } from '../generator'

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
      {
        type: 'EVALUATE',
        expression: '{1} * {2} + 5',
        variables: [
          { type: 'RANDOMFLOAT', min: 4, max: 6 },
          { type: 'RANDOMINT', min: 3, max: 12 },
        ],
      },
    ])

    expect(parseFloat(variables['1'])).toBeCloseTo(18.8)
  })

  it('errors on duplicate name', () => {
    expect(() => {
      generateVariables([
        { name: 'ok', type: 'RANDOMINT', min: 2, max: 4 },
        { name: 'duplicate', type: 'RANDOMINT', min: 3, max: 5 },
        { name: 'duplicate', type: 'RANDOMINT', min: 4, max: 6 },
      ])
    }).toThrow()
  })
})
