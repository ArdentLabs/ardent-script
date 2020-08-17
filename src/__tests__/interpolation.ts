import { interpolate } from '../interpolation'
import { ValueNotFound } from '../errors'

describe('interpolation engine', () => {
  it('does not affect non template strings', () => {
    expect(interpolate('foo bar')).toEqual('foo bar')
  })

  it('can perform interpolation', () => {
    expect(interpolate('{0} {1}', { '0': 'foo', '1': 'bar' })).toEqual(
      'foo bar'
    )

    expect(
      interpolate('{adjacent}{substitutions}', {
        adjacent: 'foo',
        substitutions: 'bar',
      })
    ).toEqual('foobar')

    expect(
      interpolate('This string is {var1} from {var2} {x3}', {
        var1: 'constructed',
        var2: 'multiple',
        x3: 'interpolations',
      })
    ).toEqual('This string is constructed from multiple interpolations')

    expect(
      interpolate(
        'multiple interpolations {0} should not {1} interfere with each other',
        { '0': '{1}', '1': '{0}' }
      )
    ).toEqual(
      'multiple interpolations {1} should not {0} interfere with each other'
    )
  })

  it('can escape interpolations', () => {
    expect(interpolate('{{foo}} bar')).toEqual('{foo} bar')

    expect(interpolate('a {{complicated } and weird }} expression')).toEqual(
      'a {complicated } and weird } expression'
    )
  })

  it('tolerates special characters in variable names', () => {
    expect(
      interpolate(
        'A variable name { replace here } anything that does not contain a {{ or }} character.',
        {
          ' replace here ': 'can be',
        }
      )
    ).toEqual(
      'A variable name can be anything that does not contain a { or } character.'
    )
  })

  it('can detect invalid variables', () => {
    expect(() => interpolate('{invalid} variable', { valid: 'foo' })).toThrow(
      ValueNotFound
    )
  })
})
