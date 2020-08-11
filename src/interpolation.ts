const regex = /(?<lead>^|[^{]){(?<var>[^\s{}]+)}|(?<escl>{{)|(?<escr>}})/g

export const interpolate = (
  template: string,
  variables: Record<string, string> = {}
): string =>
  template.replace(regex, (...match) => {
    if (match[1] != null && match[2] != null) {
      if (!(match[2] in variables)) {
        throw new Error(`${match[2]} is not a valid variable`)
      }
      return `${match[1]}${variables[match[2]]}`
    } else if (match[3] != null) {
      return '{'
    } else if (match[4] != null) {
      return '}'
    } else {
      throw new Error('Match failed')
    }
  })
