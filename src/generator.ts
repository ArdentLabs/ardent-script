/**
 * Responsible for generating concrete values from template variables.
 */

import { evaluate } from 'mathjs'
import { interpolate } from './interpolation'
import { random } from './random'
import { DuplicateVariableName, FailedVariableInstantiation } from './errors'

export type VariableTemplate = {
  name?: string
} & (
  | {
      type: 'RANDOMINT'
      range: [number, number]
      inclusive?: boolean | [boolean, boolean]
    }
  | {
      type: 'RANDOMFLOAT'
      range: [number, number]
      /** If defined, round to this many digits after the decimal */
      numDigits?: number
    }
  | {
      type: 'RANDOMCHOOSE'
      values: string[]
    }
  | {
      type: 'EVALUATE'
      expression: string
    }
  | {
      type: 'SHUFFLEADD'
      variables: string[]
    }
  | {
      type: 'SHUFFLEMULT'
      variables: string[]
    }
)

const shuffle = <T>(input: T[]): T[] => {
  const output = [...input]
  for (let i = output.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[output[i], output[j]] = [output[j], output[i]]
  }
  return output
}

const generateValue = (
  template: VariableTemplate,
  values: Record<string, string>
): string => {
  switch (template.type) {
    case 'RANDOMFLOAT': {
      const [min, max] = template.range
      const value = min + random() * (max - min)
      if (template.numDigits != null) {
        return value.toFixed(template.numDigits)
      } else {
        return value.toString()
      }
    }
    case 'RANDOMINT': {
      let [min, max] = template.range
      const [includeMin, includeMax] =
        template.inclusive == null
          ? [true, false]
          : Array.isArray(template.inclusive)
          ? template.inclusive
          : [template.inclusive, template.inclusive]
      if (!includeMin) {
        min++
      }
      if (includeMax) {
        max++
      }

      return `${min + Math.floor(random() * (max - min))}`
    }
    case 'RANDOMCHOOSE': {
      return template.values[Math.floor(random() * template.values.length)]
    }
    case 'EVALUATE': {
      const expression = interpolate(template.expression, values)
      return `${evaluate(expression)}`
    }
    case 'SHUFFLEADD': {
      return interpolate(
        shuffle(template.variables)
          .map((variable) => `{${variable}}`)
          .join(' + '),
        values
      )
    }
    case 'SHUFFLEMULT': {
      return interpolate(
        shuffle(template.variables)
          .map((variable) => `{${variable}}`)
          .join(' * '),
        values
      )
    }
  }
}

export const generateVariables = (
  templates: VariableTemplate[]
): Record<string, string> => {
  const values: Record<string, string> = {}

  for (let i = 0; i < templates.length; i++) {
    const template = templates[i]
    const name = template.name ?? `${i + 1}`

    if (name in values) {
      throw new DuplicateVariableName(name)
    }

    try {
      values[name] = generateValue(template, values)
    } catch (error) {
      throw new FailedVariableInstantiation(name, error)
    }
  }

  return values
}
