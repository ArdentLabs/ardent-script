import { generateValues } from '../generator'

describe('value generator', () => {
  it('can generate values', () => {
    const variables = generateValues([
      { name: 'randint', type: 'RANDOMINT', min: 2, max: 6 },
      { name: 'randfloat', type: 'RANDOMFLOAT', min: 7, max: 15 },
      { name: 'var', type: 'VARIABLE', symbol: 'x' },
    ])

    expect(variables).toMatchObject({
      randint: expect.any(String),
      randfloat: expect.any(String),
      var: 'x',
    })

    expect(parseInt(variables.randint)).not.toBeNaN()
    expect(parseInt(variables.randint)).toBeGreaterThanOrEqual(2)
    expect(parseInt(variables.randint)).toBeLessThan(6)

    expect(parseFloat(variables.randfloat)).not.toBeNaN()
    expect(parseFloat(variables.randfloat)).toBeGreaterThanOrEqual(7)
    expect(parseFloat(variables.randfloat)).toBeLessThan(15)
  })

  it('can supply default names', () => {
    expect(
      generateValues([
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
      generateValues([
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

  it('errors on duplicate name', () => {
    expect(() => {
      generateValues([
        { name: 'ok', type: 'RANDOMINT', min: 2, max: 4 },
        { name: 'duplicate', type: 'VARIABLE', symbol: 'dup' },
        { name: 'duplicate', type: 'VARIABLE', symbol: 'd' },
      ])
    }).toThrow()
  })
})
