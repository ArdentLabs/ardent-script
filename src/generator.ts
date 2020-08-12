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
      min: number
      max: number
    }
  | {
      type: 'RANDOMFLOAT'
      min: number
      max: number
      /** If defined, round to this many digits after the decimal */
      numDigits?: number
    }
  | {
      type: 'EVALUATE'
      expression: string
    }
)

const generateValue = (
  template: VariableTemplate,
  values: Record<string, string>
): string => {
  switch (template.type) {
    case 'RANDOMFLOAT': {
      const value = template.min + random() * (template.max - template.min)
      if (template.numDigits != null) {
        return value.toFixed(template.numDigits)
      } else {
        return value.toString()
      }
    }
    case 'RANDOMINT': {
      return `${
        template.min + Math.floor(random() * (template.max - template.min))
      }`
    }
    case 'EVALUATE': {
      const expression = interpolate(template.expression, values)
      return `${evaluate(expression)}`
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
