/**
 * Responsible for instantiating a template string with the given values
 */

const regex = /(?<escl>{{)|(?<escr>}})|{(?<var>[^\s{}]+)}/g

export const interpolate = (
  template: string,
  variables: Record<string, string> = {}
): string =>
  template.replace(regex, (...match) => {
    if (match[1] != null) {
      return '{'
    } else if (match[2] != null) {
      return '}'
    } else if (match[3] != null) {
      if (!(match[3] in variables)) {
        throw new Error(`${match[3]} is not a valid variable`)
      }
      return `${variables[match[3]]}`
    } else {
      // WTF?
      throw new Error('Match failed')
    }
  })
