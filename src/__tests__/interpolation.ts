import { interpolate, getVariables } from '../interpolation'
import { ValueNotFound } from '../errors'

describe('variable detection', () => {
  it('returns empty array on non template strings', () => {
    expect(getVariables('foo bar')).toEqual([])
    expect(getVariables('hello world')).toEqual([])
    expect(
      getVariables(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pulvinar ultricies diam a porttitor.'
      )
    ).toEqual([])
  })

  it('recognizes variables', () => {
    expect(getVariables('{foo} bar')).toEqual(['foo'])
    expect(getVariables('{adjacent}{substitutions}')).toEqual([
      'adjacent',
      'substitutions',
    ])
    expect(
      getVariables('some {parts } of this {string} is interpolated')
    ).toEqual(['parts ', 'string'])
    expect(getVariables('repeat {string}s')).toEqual(['string'])
    expect(getVariables('repeat {string}s')).toEqual(['string'])
  })

  it('ignores escaped characters', () => {
    expect(getVariables('the {{brackets {{are}} escaped}}')).toEqual([])
    expect(getVariables('several {{ left {{ brackets {{')).toEqual([])
  })

  it('correctly detects variables in a complex template string', () => {
    expect(
      getVariables(
        'several {{ left {{ brackets {{ to {confuse}  {{{variable detection}}}'
      )
    ).toEqual(['confuse', 'variable detection'])
  })
})

describe('string interpolation engine', () => {
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
