/**
 * Responsible for instantiating a template string with the given values
 */

import { ValueNotFound } from './errors'

const regex = /(?<escl>{{)|(?<escr>}})|{(?<var>[^{}]+)}/g

export const getVariables = (template: string): string[] => {
  const matches = [...template.matchAll(regex)]
  return matches.map((match) => match[3]).filter((variable) => variable != null)
}

export const interpolate = (
  template: string,
  values: Record<string, string> = {}
): string =>
  template.replace(regex, (...match) => {
    if (match[1] != null) {
      return '{'
    } else if (match[2] != null) {
      return '}'
    } else if (match[3] != null) {
      if (!(match[3] in values)) {
        throw new ValueNotFound(match[3], Object.keys(values))
      }
      return `${values[match[3]]}`
    } else {
      // WTF?
      throw new Error('Match failed')
    }
  })
